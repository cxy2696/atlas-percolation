#!/usr/bin/env python3
"""Compare the Python and JavaScript implementations of the v3 algorithms.

The core engine has a four-language contract (parity.json).  The newer
algorithm zoo is exposed in Python and JavaScript; this runner checks both
against data/golden/algorithms-v3.json and fails on any field mismatch.
"""
from __future__ import annotations

import json
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "lib" / "python"))

from percolation_atlas import (  # noqa: E402
    Rng,
    build_lattice,
    neighbours_from_edges,
    bootstrap_activation,
    invasion_cluster,
    leath_cluster,
    explosive_random_graph,
    explosive_percolation,
)


def bootstrap_probe(kind, L, p, r, seed):
    lat = build_lattice(kind, L)
    nb = neighbours_from_edges(lat.n, lat.eu, lat.ev)
    rng = Rng(seed)
    init = [1 if rng.random() < p else 0 for _ in range(lat.n)]
    b = bootstrap_activation(lat.n, nb, init, r)
    return {"activeCount": b.active_count, "rounds": len(b.rounds), "fraction": b.fraction}


def python_probes():
    lat3 = build_lattice("square", 3)
    nb3 = neighbours_from_edges(lat3.n, lat3.eu, lat3.ev)
    corners = [0] * 9
    for v in (0, 2, 6, 8):
        corners[v] = 1
    b3 = bootstrap_activation(9, nb3, corners, 2)
    lat2 = build_lattice("square", 2)
    inv2 = invasion_cluster(4, lat2.eu, lat2.ev, [0.1, 0.9, 0.2, 0.8], 0)
    lat16 = build_lattice("square", 16)
    rng13 = Rng(13)
    th16 = [rng13.random() for _ in range(lat16.m)]
    inv16 = invasion_cluster(lat16.n, lat16.eu, lat16.ev, th16, 5)
    lat6 = build_lattice("square", 6)
    le = leath_cluster(lat6, 3, 0.5, Rng(3))
    ex = explosive_random_graph(500, seed=7)
    lat4 = build_lattice("square", 4)
    exl = explosive_percolation(16, lat4.eu, lat4.ev, seed=11, rule="sum")
    return {
        "bootstrap_3x3_corners_r2": {
            "activeCount": b3.active_count,
            "rounds": len(b3.rounds),
            "time": b3.time,
        },
        "bootstrap_32x32_p055_r3_seed123": bootstrap_probe("square", 32, 0.55, 3, 123),
        "invasion_2x2_thresholds": {
            "order": inv2.order,
            "thresholds": inv2.thresholds,
            "loops": inv2.loops,
        },
        "invasion_16x16_seed5_rng13": {
            "size": inv16.size,
            "loops": inv16.loops,
            "last": inv16.last_threshold,
        },
        "leath_6x6_seed3_p05": {
            "size": le.size,
            "openEdges": le.open_edges,
            "perimeter": le.perimeter,
        },
        "explosive_graph_500_seed7": {
            "final": ex.points[-1]["smax"],
            "maxJump": ex.max_jump,
            "jumpAt": ex.jump_at,
            "added": ex.added,
        },
        "explosive_lattice_4x4_seed11_sum": {
            "steps": len(exl.steps),
            "smax": exl.steps[-1]["smax"],
            "maxJump": exl.max_jump,
            "jumpAt": exl.jump_at,
        },
    }


def close(a, b, path=""):
    """Recursive comparison; floats must agree to 1e-12 relative."""
    if isinstance(a, dict) and isinstance(b, dict):
        if set(a) != set(b):
            return f"{path}: keys {sorted(a)} != {sorted(b)}"
        for k in a:
            msg = close(a[k], b[k], f"{path}.{k}" if path else k)
            if msg:
                return msg
        return None
    if isinstance(a, list) and isinstance(b, list):
        if len(a) != len(b):
            return f"{path}: length {len(a)} != {len(b)}"
        for i, (x, y) in enumerate(zip(a, b)):
            msg = close(x, y, f"{path}[{i}]")
            if msg:
                return msg
        return None
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        if abs(a - b) > 1e-12 * max(1.0, abs(a), abs(b)):
            return f"{path}: {a!r} != {b!r}"
        return None
    return None if a == b else f"{path}: {a!r} != {b!r}"


def main():
    golden = json.loads((ROOT / "data" / "golden" / "algorithms-v3.json").read_text())
    expected = {p["id"]: p["value"] for p in golden["probes"]}
    py = python_probes()
    raw = subprocess.run(
        ["node", str(ROOT / "scripts" / "parity_algorithms.mjs")],
        cwd=ROOT, check=True, text=True, capture_output=True,
    )
    js = json.loads(raw.stdout)["probes"]
    failures = []
    for key, want in expected.items():
        for lang, got in (("python", py.get(key)), ("javascript", js.get(key))):
            msg = close(got, want, key)
            if msg:
                failures.append(f"{lang}: {msg}")
            else:
                print(f"ok {lang:10s} {key}")
    if failures:
        print("\n".join(failures), file=sys.stderr)
        return 1
    print("Python and JavaScript match all v3 algorithm probes.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
