"""Command-line entry point for the percolation-atlas algorithm package.

    atlas-perc info
    atlas-perc sample --lattice square --mode bond --L 128 --p 0.5 --seed 42
    atlas-perc sweep --lattice square --L 64 --seed 7
    atlas-perc bootstrap --L 64 --p 0.55 --r 3 --seed 11
    atlas-perc invasion --L 48 --seed 3
    atlas-perc explosive --n 2000 --rule product --seed 7
    atlas-perc serve --port 8080

Every command prints JSON when `--json` is given; the default is a compact
human-readable report.  The JSON form is the stable interface.
"""
from __future__ import annotations

import argparse
import dataclasses
import json
import math
import sys

from . import __version__
from .algorithms import (
    bootstrap_lattice,
    explosive_random_graph,
    invasion_percolation,
    leath_cluster,
)
from .lattice import LATTICE_KINDS, build_lattice
from .percolation import Percolation, newman_ziff
from .rng import Rng

THRESHOLDS = {
    "square": {"bond": ("0.5", "exact"), "site": ("0.592746", "numerical")},
    "triangular": {"bond": ("0.347296", "exact"), "site": ("0.5", "exact")},
    "honeycomb": {"bond": ("0.652704", "exact"), "site": ("0.697043", "numerical")},
}


def payload(**kw) -> dict:
    return {"package": "percolation-atlas", "version": __version__, "engine": "python", **kw}


def emit(obj: dict, as_json: bool) -> None:
    if as_json:
        print(json.dumps(obj, ensure_ascii=False, indent=1, default=str))
        return
    for key, value in obj.items():
        if isinstance(value, (dict, list)):
            print(f"{key}: {json.dumps(value, ensure_ascii=False)}")
        else:
            print(f"{key}: {value}")


def cmd_info(args) -> int:
    emit(
        payload(
            command="info",
            thresholds=THRESHOLDS,
            algorithms=["percolation", "newman-ziff", "leath", "bootstrap", "invasion", "explosive", "hoshen-kopelman", "bethe", "configuration-model", "sir-final-size"],
            notes="Core engine, algorithm zoo and tree/epidemic solvers are implemented in C++, Julia, Python and JavaScript.",
        ),
        args.json,
    )
    return 0


def cmd_sample(args) -> int:
    lat = build_lattice(args.lattice, args.L)
    rng = Rng(args.seed)
    model = Percolation(lat, mode=args.mode)
    stats = model.sample(args.p, rng).analyze()
    result = {
        "L": args.L,
        "lattice": args.lattice,
        "mode": args.mode,
        "p": args.p,
        "seed": args.seed,
        "n": lat.n,
        "m": lat.m,
        "clusters": stats.count,
        "largest": stats.max_size,
        "largest_fraction": stats.max_fraction,
        "occupied_fraction": stats.total / lat.n,
        "susceptibility": stats.chi2,
        "crosses_lr": bool(model.crosses_lr()),
        "sizes_head": stats.sizes[:12],
    }
    emit(payload(command="sample", result=result), args.json)
    return 0


def cmd_sweep(args) -> int:
    lat = build_lattice(args.lattice, args.L)
    nz = newman_ziff(lat, Rng(args.seed), checkpoints=args.checkpoints)
    m = len(nz["p"])
    step = max(1, m // args.points)
    result = {
        "L": args.L,
        "lattice": args.lattice,
        "seed": args.seed,
        "m": lat.m,
        "checkpoints": m,
        "p": [round(float(nz["p"][i]), 6) for i in range(0, m, step)],
        "smax": [float(nz["smax"][i]) for i in range(0, m, step)],
        "chi2": [round(float(nz["chi2"][i]), 6) for i in range(0, m, step)],
        "clusters": [int(nz["nclusters"][i]) for i in range(0, m, step)],
    }
    emit(payload(command="sweep", result=result), args.json)
    return 0


def cmd_bootstrap(args) -> int:
    lat = build_lattice(args.lattice, args.L)
    rng = Rng(args.seed)
    occupied = [1 if rng.random() < args.p else 0 for _ in range(lat.n)]
    res = bootstrap_lattice(lat, occupied, args.r)
    result = {
        "L": args.L,
        "p": args.p,
        "r": args.r,
        "seed": args.seed,
        "initially_occupied": sum(occupied),
        "active": res.active_count,
        "fraction": res.fraction,
        "rounds": len(res.rounds),
        "round_sizes": [q["newly"] for q in res.rounds],
        "converged": res.converged,
    }
    emit(payload(command="bootstrap", result=result), args.json)
    return 0


def cmd_invasion(args) -> int:
    lat = build_lattice(args.lattice, args.L)
    seed = (args.seed * 97 + 11) % lat.n
    res = invasion_percolation(lat.n, lat.eu, lat.ev, seed=seed, rng_seed=args.rng_seed)
    keys = res.thresholds
    result = {
        "L": args.L,
        "seed_site": seed,
        "rng_seed": args.rng_seed,
        "size": res.size,
        "loops": res.loops,
        "last_threshold": keys[-1] if keys else None,
        "mean_threshold": sum(keys) / len(keys) if keys else None,
        "thresholds_head": [round(k, 6) for k in keys[:16]],
    }
    emit(payload(command="invasion", result=result), args.json)
    return 0


def cmd_explosive(args) -> int:
    res = explosive_random_graph(args.n, rule=args.rule, seed=args.seed, steps=args.steps)
    points = res.points
    q50 = None
    for i in range(1, len(points)):
        a, b = points[i - 1], points[i]
        if a["smax"] < 0.5 <= b["smax"]:
            t = (0.5 - a["smax"]) / (b["smax"] - a["smax"] or 1.0)
            q50 = a["q"] + t * (b["q"] - a["q"])
            break
    result = {
        "n": args.n,
        "rule": args.rule,
        "seed": args.seed,
        "steps": res.steps,
        "edges_added": res.added,
        "q_at_half": q50,
        "max_jump": res.max_jump,
        "jump_at_q": res.jump_at / args.n,
        "final_smax": points[-1]["smax"],
        "note": "The product rule is continuous in the thermodynamic limit; the jump is a finite-size effect.",
    }
    emit(payload(command="explosive", result=result), args.json)
    return 0


def cmd_serve(args) -> int:
    from .api import serve

    return serve(host=args.host, port=args.port, root=args.root)


def build_parser() -> argparse.ArgumentParser:
    ap = argparse.ArgumentParser(prog="atlas-perc", description="Percolation Atlas algorithm package")
    ap.add_argument("--version", action="version", version=f"%(prog)s {__version__}")
    sub = ap.add_subparsers(dest="command", required=True)

    p = sub.add_parser("info", help="version, thresholds and available algorithms")
    p.add_argument("--json", action="store_true")
    p.set_defaults(func=cmd_info)

    p = sub.add_parser("sample", help="draw one configuration and report cluster statistics")
    p.add_argument("--lattice", choices=LATTICE_KINDS, default="square")
    p.add_argument("--mode", choices=["bond", "site"], default="bond")
    p.add_argument("--L", type=int, default=64)
    p.add_argument("--p", type=float, default=0.5)
    p.add_argument("--seed", type=int, default=42)
    p.add_argument("--json", action="store_true")
    p.set_defaults(func=cmd_sample)

    p = sub.add_parser("sweep", help="Newman-Ziff curve")
    p.add_argument("--lattice", choices=LATTICE_KINDS, default="square")
    p.add_argument("--L", type=int, default=64)
    p.add_argument("--seed", type=int, default=7)
    p.add_argument("--checkpoints", type=int, default=400)
    p.add_argument("--points", type=int, default=80)
    p.add_argument("--json", action="store_true")
    p.set_defaults(func=cmd_sweep)

    p = sub.add_parser("bootstrap", help="r-neighbour bootstrap closure")
    p.add_argument("--lattice", choices=LATTICE_KINDS, default="square")
    p.add_argument("--L", type=int, default=64)
    p.add_argument("--p", type=float, default=0.5)
    p.add_argument("--r", type=int, default=3)
    p.add_argument("--seed", type=int, default=11)
    p.add_argument("--json", action="store_true")
    p.set_defaults(func=cmd_bootstrap)

    p = sub.add_parser("invasion", help="invasion percolation cluster")
    p.add_argument("--lattice", choices=LATTICE_KINDS, default="square")
    p.add_argument("--L", type=int, default=48)
    p.add_argument("--seed", type=int, default=3)
    p.add_argument("--rng-seed", type=int, default=1)
    p.add_argument("--json", action="store_true")
    p.set_defaults(func=cmd_invasion)

    p = sub.add_parser("explosive", help="Achlioptas two-choice process on the complete graph")
    p.add_argument("--n", type=int, default=2000)
    p.add_argument("--rule", choices=["product", "sum"], default="product")
    p.add_argument("--seed", type=int, default=7)
    p.add_argument("--steps", type=int, default=None)
    p.add_argument("--json", action="store_true")
    p.set_defaults(func=cmd_explosive)

    p = sub.add_parser("serve", help="serve the static site and the JSON API")
    p.add_argument("--host", default="127.0.0.1")
    p.add_argument("--port", type=int, default=8080)
    p.add_argument("--root", default=None)
    p.set_defaults(func=cmd_serve)

    return ap


def main(argv=None) -> int:
    ap = build_parser()
    args = ap.parse_args(argv)
    try:
        return args.func(args)
    except (ValueError, TypeError) as exc:
        print(f"atlas-perc: {exc}", file=sys.stderr)
        return 2
    except BrokenPipeError:
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
