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


def collapse_spread(rows, pc, nu, key="pi", rescale=None, bandwidth=0.3):
    """Binned collapse spread.

    ``rows`` must contain ``p``, ``L`` and ``key``.  If ``rescale`` is given,
    the observable is multiplied by ``L**rescale`` first; this is required for
    S_max, whose scaling dimension is not zero.  The crossing probability has
    scaling dimension zero, so it needs no rescaling.
    """
    bins = {}
    for row in rows:
        x = (row["p"] - pc) * (row["L"] ** (1.0 / nu))
        y = row[key]
        if rescale is not None:
            y *= row["L"] ** rescale
        bins.setdefault(round(x / bandwidth), []).append(y)
    dev = 0.0
    count = 0
    for values in bins.values():
        if len(values) < 2:
            continue
        mean = sum(values) / len(values)
        dev += sum((v - mean) ** 2 for v in values)
        count += len(values)
    return math.sqrt(dev / count) if count else float("inf")


def fit_pc_at_nu(rows, nu=4.0 / 3.0, key="pi", pc_lo=0.490, pc_hi=0.510):
    """Fit p_c with nu held at a known value (the clean one-parameter test)."""
    best = (float("inf"), 0.5)
    for i in range(801):
        pc = pc_lo + (pc_hi - pc_lo) * i / 800
        spread = collapse_spread(rows, pc, nu, key=key)
        if spread < best[0]:
            best = (spread, pc)
    return {
        "spread": best[0],
        "pc": best[1],
        "nu": nu,
        "nu_fixed": True,
        "window": [pc_lo, pc_hi],
        "sizes": sorted({r["L"] for r in rows}),
        "method": f"{key} collapse at nu=4/3, bin width 0.3",
    }


def fit_collapse(rows, key="pi", rescale=None, pc_lo=0.485, pc_hi=0.515):
    best = (float("inf"), 0.5, 4.0 / 3.0)
    for i in range(121):
        pc = pc_lo + (pc_hi - pc_lo) * i / 120
        for j in range(101):
            nu = 1.05 + 0.50 * j / 100
            spread = collapse_spread(rows, pc, nu, key=key, rescale=rescale)
            if spread < best[0]:
                best = (spread, pc, nu)
    return {
        "spread": best[0],
        "pc": best[1],
        "nu": best[2],
        "window": [pc_lo, pc_hi],
        "sizes": sorted({r["L"] for r in rows}),
        "method": f"{key} collapse, bin width 0.3",
    }


def linfit(xs, ys):
    n = len(xs)
    mx = sum(xs) / n
    my = sum(ys) / n
    sxy = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    sxx = sum((x - mx) ** 2 for x in xs)
    slope = sxy / sxx if sxx else 0
    intercept = my - slope * mx
    sse = sum((y - (intercept + slope * x)) ** 2 for x, y in zip(xs, ys))
    slope_se = math.sqrt(sse / (n - 2) / sxx) if n > 2 and sxx else float("nan")
    return slope, intercept, slope_se


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

    # pi has scaling dimension zero, so it collapses without a prefactor.
    # The two-parameter (p_c, nu) fit is ill-conditioned at L <= 128: the
    # minimum drifts to the lower edge of the nu window because a smaller nu
    # smooths the finite-size noise.  We therefore report the collapse at the
    # exact two-dimensional nu = 4/3 and fit p_c alone, and keep the free fit
    # as a diagnostic rather than as a result.
    fit_free = fit_collapse(crossing, key="pi")
    fit = fit_pc_at_nu(crossing, nu=4.0 / 3.0, key="pi")
    fit["nu_free"] = fit_free["nu"]
    fit["pc_free"] = fit_free["pc"]
    fit["note"] = ("nu fixed to the exact 4/3; the unconstrained fit drifts to "
                   "the lower edge of its window at these sizes")
    fit_smax = fit_collapse(torus, key="smax", rescale=5 / 48)

    # The L=32 point carries a visible correction; the asymptotic fit uses
    # L >= 64 and reports its window instead of hiding the choice.
    arm_window = [r for r in arm if r["L"] >= 64]
    xs = [math.log(r["L"]) for r in arm_window]
    ys = [math.log(r["pi"]) for r in arm_window]
    slope, intercept, slope_se = linfit(xs, ys)
    arm_fit = {
        "slope": slope,
        "slope_se": slope_se,
        "ci95": [slope - 1.96 * slope_se, slope + 1.96 * slope_se] if math.isfinite(slope_se) else None,
        "expected": -5 / 48,
        "intercept": intercept,
        "sizes": [r["L"] for r in arm_window],
        "window": "L >= 64",
    }

    out = {
        "meta": {
            "generated": dt.datetime.now().strftime("%Y-%m-%d %H:%M"),
            "seed": 20241112,
            "harness": "scripts/bench.cpp (clang++ -O3 -std=c++20)",
            "rng": "xoshiro128** / SplitMix32, docs/RNG.md",
            "note": ("Sample counts, seeds and replicate counts are recorded per experiment. "
                     "The network curves use N=10000 vertices and one configuration per removal fraction; "
                     "the coupled-cascade rows record reps, standard error and convergence."),
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
            "collapse_smax": fit_smax,
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
    print(f"collapse fit (nu=4/3): p_c = {fit['pc']:.4f} (spread {fit['spread']:.4f})")
    print(f"free two-parameter fit: p_c = {fit_free['pc']:.4f}, nu = {fit_free['nu']:.3f} (ill-conditioned)")
    print(f"collapse fit (S_max): p_c = {fit_smax['pc']:.4f}, nu = {fit_smax['nu']:.3f}")
    print(f"one-arm slope = {slope:.4f} +/- {1.96 * slope_se:.4f} (95% CI; expected -5/48 = {-5/48:.4f}, fit L >= 64)")
    print("p_c from S=0.5:", ", ".join(f"{r['L']}:{r['pc']:.4f}" for r in out["fits"]["pc_s05"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
