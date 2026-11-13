#!/usr/bin/env python3
"""Check the numerical claims that the atlas states in prose.

This is not a proof assistant.  It is a small, independent audit of the
numbers that are easy to mistype and expensive to notice: exact small-box
crossing counts, Cardy values, exponent identities, Bethe and
configuration-model fixed points, threshold relations, and the recorded
benchmark rates.

    python3 scripts/verify_claims.py

Exit status is 1 if any claim disagrees with the independent calculation.
"""
from __future__ import annotations

import json
import math
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "lib" / "python"))

from percolation_atlas import (  # noqa: E402
    bethe_percolation,
    cardy_crossing,
    configuration_giant_component,
    poisson_pmf,
)

FAILURES: list[str] = []


def check(name: str, got, want, tol: float = 0.0) -> None:
    if isinstance(want, float):
        ok = abs(got - want) <= tol
    else:
        ok = got == want
    if not ok:
        FAILURES.append(f"{name}: got {got!r}, want {want!r} (tol {tol})")
        print(f"FAIL {name}: {got!r} != {want!r}")
    else:
        print(f"ok   {name}")


def exact_crossing(L: int) -> tuple[int, int]:
    """Exact left-right bond crossing count on an L x L free-boundary box."""
    edges = []
    for y in range(L):
        for x in range(L - 1):
            edges.append((y * L + x, y * L + x + 1))
    for y in range(L - 1):
        for x in range(L):
            edges.append((y * L + x, (y + 1) * L + x))
    hits = 0
    for mask in range(1 << len(edges)):
        parent = list(range(L * L))

        def find(a):
            while parent[a] != a:
                parent[a] = parent[parent[a]]
                a = parent[a]
            return a

        for e, (u, v) in enumerate(edges):
            if mask >> e & 1:
                ru, rv = find(u), find(v)
                if ru != rv:
                    parent[ru] = rv
        left = {find(y * L) for y in range(L)}
        if any(find(y * L + L - 1) in left for y in range(L)):
            hits += 1
    return hits, 1 << len(edges)


def main() -> int:
    # Exact finite-box crossing counts quoted in Chapter 4 and 19.
    h2, t2 = exact_crossing(2)
    h3, t3 = exact_crossing(3)
    check("2x2 exact crossing", (h2, t2), (12, 16))
    check("3x3 exact crossing", (h3, t3), (2752, 4096))
    check("3x3 fraction", h3 / t3, 43 / 64, 0.0)

    # Cardy formula values quoted in Chapter 7.
    check("Cardy pi(1)", cardy_crossing(1.0), 0.5, 0.0)
    check("Cardy pi(0.1)", cardy_crossing(0.1), 4.0394890895707114e-05, 1e-16)
    check("Cardy pi(10)", cardy_crossing(10.0), 0.9999596051091043, 1e-12)
    check("Cardy symmetry pi(2)", cardy_crossing(2.0), 1.0 - cardy_crossing(0.5), 1e-15)

    # Exact two-dimensional exponent set and its identities (Chapter 7).
    beta, gamma, nu, delta, eta, df = 5 / 36, 43 / 18, 4 / 3, 91 / 5, 5 / 24, 91 / 48
    check("gamma = (2-eta)nu", gamma, (2 - eta) * nu, 1e-15)
    check("beta = nu(d-2+eta)/2", beta, nu * (2 - 2 + eta) / 2, 1e-15)
    check("df = d - beta/nu", df, 2 - beta / nu, 1e-15)
    check("delta = 1 + gamma/beta", delta, 1 + gamma / beta, 1e-15)
    check("df = (d+2-eta)/2", df, (2 + 2 - eta) / 2, 1e-15)

    # Bethe tree values (Chapters 8 and 22).
    check("Bethe z=3 p_c", bethe_percolation(3, 0.5).pc, 0.5, 0.0)
    check("Bethe z=3 p=0.6 theta", bethe_percolation(3, 0.6).theta, 19 / 27, 1e-10)
    check("Bethe z=3 p=0.4 chi", bethe_percolation(3, 0.4).chi, 7.0, 1e-12)
    check("Bethe z=2 p=1 theta", bethe_percolation(2, 1.0).theta, 1.0, 0.0)

    # Configuration-model / SIR values (Chapters 22-23).
    pmf = poisson_pmf(2.0)
    cfg = configuration_giant_component(pmf, 1.0)
    check("ER c=2 giant fraction", cfg.S, 0.7968121300200199, 1e-10)
    check("ER c=2 kappa", cfg.kappa, 3.0, 1e-12)
    check("ER c=2 T_c", cfg.tc, 0.5, 1e-12)
    check("ER R0 at T=1", cfg.r0, 2.0, 1e-12)

    # Threshold relations from Chapter 4.
    tri = 2 * math.sin(math.pi / 18)
    check("triangular bond threshold", tri, 0.3472963553338607, 1e-15)
    check("honeycomb bond threshold", 1 - tri, 0.6527036446661393, 1e-15)
    check("kagome site = honeycomb bond", 1 - tri, 0.6527036446661393, 1e-15)

    # Recorded benchmark rates at p = 1/2 (Chapter 11).
    bench_path = ROOT / "data" / "benchmarks.json"
    if bench_path.exists():
        bench = json.loads(bench_path.read_text())
        by_l = {}
        for row in bench.get("crossing", []):
            if row.get("p") == 0.5:
                by_l[row["L"]] = row["hits"] / row["n"]
        check("benchmark L=32 p=0.5", by_l.get(32), 0.5275, 1e-12)
        check("benchmark L=64 p=0.5", by_l.get(64), 0.5375, 1e-12)
        check("benchmark L=128 p=0.5", by_l.get(128), 0.505, 1e-12)
    else:
        FAILURES.append("data/benchmarks.json missing")
        print("FAIL data/benchmarks.json missing")

    # Reference audit totals (Chapter 14 / Sources).
    audit_path = ROOT / "content" / "reference_audit.json"
    if audit_path.exists():
        audit = json.loads(audit_path.read_text())
        check("audit total", audit.get("total"), 125)
        check("audit verified", audit.get("counts", {}).get("ok"), 123)
        check("audit notes", audit.get("counts", {}).get("ok-note"), 2)
        bad = [r for r in audit.get("results", []) if r.get("status") not in ("ok", "ok-note")]
        check("audit has no unresolved entries", len(bad), 0)
    else:
        FAILURES.append("content/reference_audit.json missing")
        print("FAIL content/reference_audit.json missing")

    if FAILURES:
        print(f"\n{len(FAILURES)} claim check(s) failed", file=sys.stderr)
        return 1
    print("\nall prose claims agree with the independent checks")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
