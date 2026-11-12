"""A small, dependency-free JSON API and static file server.

This is a reference service, not a hardened production appliance.  It is
deliberately limited to the algorithms in the package, validates sizes, and
returns JSON errors with a 4xx status instead of raising.
"""
from __future__ import annotations

import json
import mimetypes
import pathlib
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

from . import __version__
from .algorithms import (
    bootstrap_lattice,
    explosive_random_graph,
    invasion_percolation,
)
from .lattice import LATTICE_KINDS, build_lattice
from .percolation import Percolation, newman_ziff
from .rng import Rng

THRESHOLDS = {
    "square": {"bond": {"value": 0.5, "status": "exact"}, "site": {"value": 0.592746, "status": "numerical"}},
    "triangular": {"bond": {"value": 0.347296, "status": "exact"}, "site": {"value": 0.5, "status": "exact"}},
    "honeycomb": {"bond": {"value": 0.652704, "status": "exact"}, "site": {"value": 0.697043, "status": "numerical"}},
}

OPENAPI = {
    "openapi": "3.1.0",
    "info": {
        "title": "Percolation Atlas API",
        "version": __version__,
        "description": "Reference endpoints for Bernoulli, bootstrap, invasion and Achlioptas percolation.",
    },
    "paths": {
        "/api/health": {"get": {"summary": "health and version"}},
        "/api/thresholds": {"get": {"summary": "exact and numerical thresholds"}},
        "/api/sample": {"post": {"summary": "one configuration and cluster statistics"}},
        "/api/sweep": {"post": {"summary": "Newman-Ziff sweep"}},
        "/api/bootstrap": {"post": {"summary": "bootstrap closure"}},
        "/api/invasion": {"post": {"summary": "invasion cluster"}},
        "/api/explosive": {"post": {"summary": "Achlioptas trajectory"}},
    },
}


def _int(body, key, default, lo, hi):
    value = body.get(key, default)
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError(f"{key} must be an integer")
    value = int(value)
    if value < lo or value > hi:
        raise ValueError(f"{key} must be between {lo} and {hi}")
    return value


def _float(body, key, default, lo, hi):
    value = body.get(key, default)
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError(f"{key} must be a number")
    value = float(value)
    if not lo <= value <= hi:
        raise ValueError(f"{key} must be between {lo} and {hi}")
    return value


def _lattice(body):
    value = body.get("lattice", "square")
    if value not in LATTICE_KINDS:
        raise ValueError(f"lattice must be one of {LATTICE_KINDS}")
    return value


class Handler(SimpleHTTPRequestHandler):
    server_version = f"atlas-perc/{__version__}"

    def __init__(self, *args, root=None, **kwargs):
        super().__init__(*args, directory=str(root), **kwargs)

    # ------------------------------------------------------------- helpers
    def _json(self, obj, status=200):
        raw = json.dumps(obj, ensure_ascii=False, default=str).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()
        self.wfile.write(raw)

    def _error(self, message, status=400):
        self._json({"ok": False, "error": str(message)}, status=status)

    def _body(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            raise ValueError("invalid Content-Length")
        if length > 1_000_000:
            raise ValueError("request body too large")
        if not length:
            return {}
        try:
            payload = json.loads(self.rfile.read(length))
        except json.JSONDecodeError as exc:
            raise ValueError(f"invalid JSON: {exc}") from exc
        if not isinstance(payload, dict):
            raise ValueError("body must be a JSON object")
        return payload

    # ------------------------------------------------------------- HTTP
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()

    def do_GET(self):
        path = self.path.split("?", 1)[0]
        if path == "/api/health":
            self._json({"ok": True, "package": "percolation-atlas", "version": __version__, "engine": "python"})
            return
        if path == "/api/thresholds":
            self._json({"ok": True, "thresholds": THRESHOLDS, "note": "Exact and numerical values are labelled; see Chapter 19."})
            return
        if path == "/api/openapi.json":
            self._json(OPENAPI)
            return
        if path.startswith("/api/"):
            self._error("unknown API route", 404)
            return
        return super().do_GET()

    def do_POST(self):
        path = self.path.split("?", 1)[0]
        try:
            body = self._body()
            if path == "/api/sample":
                self._json({"ok": True, "result": self._sample(body)})
            elif path == "/api/sweep":
                self._json({"ok": True, "result": self._sweep(body)})
            elif path == "/api/bootstrap":
                self._json({"ok": True, "result": self._bootstrap(body)})
            elif path == "/api/invasion":
                self._json({"ok": True, "result": self._invasion(body)})
            elif path == "/api/explosive":
                self._json({"ok": True, "result": self._explosive(body)})
            elif path.startswith("/api/"):
                self._error("unknown API route", 404)
            else:
                self._error("static routes are GET-only", 405)
        except ValueError as exc:
            self._error(exc, 400)
        except Exception as exc:  # noqa: BLE001 - return a JSON error, never crash the server
            self._error(f"internal error: {exc}", 500)

    # ------------------------------------------------------------- endpoints
    def _sample(self, body):
        lattice = _lattice(body)
        mode = body.get("mode", "bond")
        if mode not in ("bond", "site"):
            raise ValueError("mode must be bond or site")
        L = _int(body, "L", 64, 2, 512)
        p = _float(body, "p", 0.5, 0.0, 1.0)
        seed = _int(body, "seed", 42, 0, 2**32 - 1)
        lat = build_lattice(lattice, L)
        model = Percolation(lat, mode=mode)
        stats = model.sample(p, Rng(seed)).analyze()
        return {
            "lattice": lattice,
            "mode": mode,
            "L": L,
            "p": p,
            "seed": seed,
            "n": lat.n,
            "m": lat.m,
            "clusters": stats.count,
            "largest": stats.max_size,
            "largest_fraction": stats.max_fraction,
            "susceptibility": stats.chi2,
            "crosses_lr": bool(model.crosses_lr()),
        }

    def _sweep(self, body):
        lattice = _lattice(body)
        L = _int(body, "L", 64, 2, 512)
        seed = _int(body, "seed", 7, 0, 2**32 - 1)
        checkpoints = _int(body, "checkpoints", 200, 2, 2000)
        lat = build_lattice(lattice, L)
        nz = newman_ziff(lat, Rng(seed), checkpoints=checkpoints)
        step = max(1, len(nz["p"]) // 160)
        return {
            "lattice": lattice,
            "L": L,
            "seed": seed,
            "m": lat.m,
            "p": [round(float(x), 6) for x in nz["p"][::step]],
            "smax": [float(x) for x in nz["smax"][::step]],
            "chi2": [round(float(x), 6) for x in nz["chi2"][::step]],
        }

    def _bootstrap(self, body):
        lattice = _lattice(body)
        L = _int(body, "L", 64, 2, 256)
        p = _float(body, "p", 0.5, 0.0, 1.0)
        r = _int(body, "r", 3, 1, 8)
        seed = _int(body, "seed", 11, 0, 2**32 - 1)
        lat = build_lattice(lattice, L)
        rng = Rng(seed)
        occupied = [1 if rng.random() < p else 0 for _ in range(lat.n)]
        res = bootstrap_lattice(lat, occupied, r)
        return {
            "lattice": lattice,
            "L": L,
            "p": p,
            "r": r,
            "seed": seed,
            "initially_occupied": sum(occupied),
            "active": res.active_count,
            "fraction": res.fraction,
            "rounds": len(res.rounds),
            "round_sizes": [x["newly"] for x in res.rounds],
        }

    def _invasion(self, body):
        lattice = _lattice(body)
        L = _int(body, "L", 48, 2, 128)
        seed = _int(body, "seed", 3, 0, 2**32 - 1)
        rng_seed = _int(body, "rng_seed", 1, 0, 2**32 - 1)
        lat = build_lattice(lattice, L)
        site = (seed * 97 + 11) % lat.n
        res = invasion_percolation(lat.n, lat.eu, lat.ev, seed=site, rng_seed=rng_seed)
        keys = res.thresholds
        return {
            "lattice": lattice,
            "L": L,
            "seed_site": site,
            "rng_seed": rng_seed,
            "size": res.size,
            "loops": res.loops,
            "last_threshold": keys[-1] if keys else None,
            "mean_threshold": sum(keys) / len(keys) if keys else None,
        }

    def _explosive(self, body):
        n = _int(body, "n", 2000, 10, 20000)
        seed = _int(body, "seed", 7, 0, 2**32 - 1)
        rule = body.get("rule", "product")
        if rule not in ("product", "sum"):
            raise ValueError("rule must be product or sum")
        res = explosive_random_graph(n, rule=rule, seed=seed)
        pts = res.points
        q50 = None
        for i in range(1, len(pts)):
            a, b = pts[i - 1], pts[i]
            if a["smax"] < 0.5 <= b["smax"]:
                t = (0.5 - a["smax"]) / (b["smax"] - a["smax"] or 1.0)
                q50 = a["q"] + t * (b["q"] - a["q"])
                break
        return {
            "n": n,
            "seed": seed,
            "rule": rule,
            "q_at_half": q50,
            "max_jump": res.max_jump,
            "jump_at_q": res.jump_at / n,
            "final_smax": pts[-1]["smax"],
            "edges_added": res.added,
            "note": "The thermodynamic limit of the product rule is continuous; the jump is finite-size.",
        }

    # ------------------------------------------------------------- static
    def guess_type(self, path):
        suffix = pathlib.Path(path).suffix
        overrides = {
            ".js": "text/javascript; charset=utf-8",
            ".mjs": "text/javascript; charset=utf-8",
            ".json": "application/json; charset=utf-8",
            ".md": "text/markdown; charset=utf-8",
            ".webmanifest": "application/manifest+json",
            ".woff2": "font/woff2",
        }
        return overrides.get(suffix) or mimetypes.guess_type(path)[0] or "application/octet-stream"

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()


def default_root() -> pathlib.Path:
    cwd = pathlib.Path.cwd()
    if (cwd / "index.html").exists():
        return cwd
    repo = pathlib.Path(__file__).resolve().parents[3]
    if (repo / "index.html").exists():
        return repo
    return cwd


def serve(host: str = "127.0.0.1", port: int = 8080, root: str | None = None) -> int:
    root_path = pathlib.Path(root).resolve() if root else default_root()
    if not (root_path / "index.html").exists():
        print(f"warning: {root_path} has no index.html; API still works", file=sys.stderr)
    handler = lambda *a, **kw: Handler(*a, root=root_path, **kw)  # noqa: E731
    try:
        server = ThreadingHTTPServer((host, port), handler)
    except OSError as exc:
        print(f"cannot bind {host}:{port}: {exc}", file=sys.stderr)
        return 1
    print(f"atlas-perc {__version__} serving {root_path}")
    print(f"  site  http://{host}:{port}/")
    print(f"  api   http://{host}:{port}/api/health")
    print(f"  docs  http://{host}:{port}/api/openapi.json")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nstopped")
    return 0
