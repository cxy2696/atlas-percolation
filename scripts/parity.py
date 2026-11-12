#!/usr/bin/env python3
"""Compare the Python and JavaScript probes against the golden file.

The C++ and Julia suites assert the same values; this runner covers the two
implementations that are easiest to execute in a checkout without a build.
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
    cardy_crossing,
    components,
    configuration_model,
    interdependent_er,
    newman_ziff,
    Percolation,
    poisson_degrees,
)


def crossing(lat, mode, p, seed, n):
    model = Percolation(lat, mode=mode)
    rng = Rng(seed)
    hits = 0
    for _ in range(n):
        hits += int(model.sample(p, rng).crosses_lr())
    return hits


def python_probes():
    rng9 = Rng(9)
    deg9 = poisson_degrees(2000, 3.0, rng9)
    nz = newman_ziff(build_lattice("square", 16), Rng(5), checkpoints=64)
    n = len(nz["p"])
    return {
        "square_bond_cross_500_seed1234": crossing(build_lattice("square", 32), "bond", 0.5, 1234, 500),
        "tri_site_cross_300_seed777": crossing(build_lattice("triangular", 16), "site", 0.5, 777, 300),
        "nz_smax_q1_q2_end_seed5": [nz["smax"][n // 4], nz["smax"][n // 2], nz["smax"][n - 1]],
        "configmodel_largest_seed9": components(
            configuration_model(deg9, rng9), [1] * 2000
        )["largest"],
        "interdependent_fraction_seed11": interdependent_er(
            1500, 3.5, 0.75, Rng(11)
        )["fraction"],
    }


def main():
    golden = json.loads((ROOT / "data" / "golden" / "parity.json").read_text())
    expected = {p["id"]: p["value"] for p in golden["probes"]}
    py = python_probes()
    js_raw = subprocess.run(
        ["node", str(ROOT / "scripts" / "parity_probe.mjs")],
        cwd=ROOT, check=True, text=True, capture_output=True,
    )
    js_payload = json.loads(js_raw.stdout)
    js = js_payload["probes"]

    failures = []

    def same(got, want):
        if isinstance(want, list):
            return isinstance(got, list) and len(got) == len(want) and all(a == b for a, b in zip(got, want))
        if isinstance(want, int):
            return got == want
        return abs(got - want) < 1e-12

    for key, want in expected.items():
        for lang, got in (("python", py.get(key)), ("javascript", js.get(key))):
            if not same(got, want):
                failures.append(f"{lang} {key}: got {got!r}, want {want!r}")
            else:
                print(f"ok {lang:10s} {key:40s} {got!r}")

    js_cardy = {row["l"]: row["value"] for row in js_payload["cardy"]}
    for row in golden["cardy"]:
        for lang, value in (("python", cardy_crossing(row["l"])), ("javascript", js_cardy.get(row["l"]))):
            if value is None or abs(value - row["value"]) >= 1e-12:
                failures.append(f"{lang} cardy({row['l']}): {value} != {row['value']}")
    if failures:
        print("\n".join(failures), file=sys.stderr)
        return 1
    print("Python and JavaScript match all golden probes. C++ and Julia assert the same file.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
