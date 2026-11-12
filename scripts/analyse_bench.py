#!/usr/bin/env python3
"""Turn data/raw_bench.json into the published data/benchmarks.json.

Adds derived quantities (π, Cardy's formula, a data-collapse fit of (p_c, ν)
and a log–log fit of the one-arm exponent) and stamps the record with its
provenance.  Pure standard library plus the atlas Python package.

    ./build/bench > data/raw_bench.json
    python3 scripts/analyse_bench.py
"""

from __future__ import annotations

import datetime as dt
import json
import math
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "lib" / "python"))

from percolation_atlas import cardy_crossing  # noqa: E402


def collapse_spread(torus, pc, nu):
    bins = {}
    for row in torus:
        x = (row["p"] - pc) * (row["L"] ** (1.0 / nu))
        bins.setdefault(round(x / 0.6), []).append(row["smax"])
    dev = 0.0
    count = 0
    for values in bins.values():
        if len(values) < 2:
            continue
        mean = sum(values) / len(values)
        dev += sum((v - mean) ** 2 for v in values)
        count += len(values)
    return math.sqrt(dev / count) if count else float("inf")


def fit_collapse(torus):
    best = (float("inf"), 0.5, 4.0 / 3.0)
    for i in range(41):
        pc = 0.49 + 0.02 * i / 40
        for j in range(41):
            nu = 1.10 + 0.60 * j / 40
            spread = collapse_spread(torus, pc, nu)
            if spread < best[0]:
                best = (spread, pc, nu)
    return {"spread": best[0], "pc": best[1], "nu": best[2]}


def linfit(xs, ys):
    n = len(xs)
    mx = sum(xs) / n
    my = sum(ys) / n
    sxy = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    sxx = sum((x - mx) ** 2 for x in xs)
    slope = sxy / sxx if sxx else 0
    return slope, my - slope * mx


def main() -> int:
    raw_path = ROOT / "data" / "raw_bench.json"
    if not raw_path.exists() or raw_path.stat().st_size == 0:
        print("data/raw_bench.json is missing or empty; run ./build/bench first")
        return 1
    raw = json.loads(raw_path.read_text())

    crossing = []
    for row in raw["crossing"]:
        crossing.append({**row, "pi": row["hits"] / row["n"]})

    torus = []
    for row in raw["torus"]:
        torus.append({**row, "pi": row["smax"]})

    arm = [{**row, "pi": row["hits"] / row["n"]} for row in raw["arm"]]

    cardy = []
    for row in raw["cardy"]:
        cardy.append(
            {
                **row,
                "measured": row["hits"] / row["n"],
                "formula": cardy_crossing(row["aspect"]),
            }
        )

    fit = fit_collapse(torus)

    xs = [math.log(r["L"]) for r in arm]
    ys = [math.log(r["pi"]) for r in arm]
    slope, intercept = linfit(xs, ys)
    arm_fit = {"slope": slope, "expected": -5 / 48, "intercept": intercept}

    out = {
        "meta": {
            "generated": dt.datetime.now().strftime("%Y-%m-%d %H:%M"),
            "seed": 20241112,
            "harness": "scripts/bench.cpp (clang++ -O3 -std=c++20)",
            "rng": "xoshiro128** / SplitMix32, docs/RNG.md",
            "note": "Every row records its own sample count. No value on this page is illustrative.",
        },
        "crossing": crossing,
        "torus": torus,
        "arm": arm,
        "cardy": cardy,
        "network": raw["network"],
        "interdependent": raw["interdependent"],
        "kcore": raw["kcore"],
        "continuum": raw["continuum"],
        "cluster_hist": raw["cluster_hist"],
        "fits": {
            "collapse": fit,
            "one_arm": arm_fit,
            "pc_s05": [],
        },
    }

    for L in sorted({r["L"] for r in torus}):
        rows = sorted((r for r in torus if r["L"] == L), key=lambda r: r["p"])
        est = None
        for a, b in zip(rows, rows[1:]):
            if (a["smax"] - 0.5) * (b["smax"] - 0.5) <= 0 and a["smax"] != b["smax"]:
                frac = (0.5 - a["smax"]) / (b["smax"] - a["smax"])
                est = a["p"] + frac * (b["p"] - a["p"])
                break
        if est is not None:
            out["fits"]["pc_s05"].append({"L": L, "pc": est})

    (ROOT / "data" / "benchmarks.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))

    print(f"wrote data/benchmarks.json ({len(crossing)} crossing rows, {len(torus)} torus rows)")
    print(f"collapse fit: p_c = {fit['pc']:.4f}, nu = {fit['nu']:.3f} (spread {fit['spread']:.4f})")
    print(f"one-arm slope = {slope:.4f} (expected -5/48 = {-5/48:.4f})")
    print("p_c from S=0.5:", ", ".join(f"{r['L']}:{r['pc']:.4f}" for r in out["fits"]["pc_s05"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
