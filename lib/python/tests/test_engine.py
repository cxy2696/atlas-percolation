"""Test suite for percolation_atlas (stdlib unittest, no external deps).

Run from the repository root:

    PYTHONPATH=lib/python python3 -m unittest discover -s lib/python/tests -v
"""

from __future__ import annotations

import json
import math
import pathlib
import unittest

from percolation_atlas import (
    CARDY_CONSTANT,
    Percolation,
    Rng,
    boolean_model,
    build_lattice,
    cardy_crossing,
    components,
    configuration_model,
    interdependent_er,
    kcore,
    molloy_reed,
    newman_ziff,
    poisson_degrees,
)

ROOT = pathlib.Path(__file__).resolve().parents[3]
GOLDEN = ROOT / "data" / "golden" / "rng-seed42.json"


class TestRng(unittest.TestCase):
    def test_golden_doubles(self):
        g = json.loads(GOLDEN.read_text())
        rng = Rng(g["seed"])
        got = [rng.random() for _ in range(len(g["doubles"]))]
        self.assertEqual(got, g["doubles"])

    def test_golden_ints(self):
        g = json.loads(GOLDEN.read_text())
        rng = Rng(g["seed"])
        got = [rng.int(10) for _ in range(len(g["ints_mod_10"]))]
        self.assertEqual(got, g["ints_mod_10"])

    def test_golden_stream_hash(self):
        g = json.loads(GOLDEN.read_text())
        rng = Rng(g["seed"])
        total = 0
        h = 2166136261
        for _ in range(10000):
            v = rng.u32()
            total = (total + v) % 2**32
            h = ((h ^ v) * 16777619) % 2**32
        self.assertEqual(total, g["u32_sum_first_10000"])
        self.assertEqual(h, g["fnv1a_first_10000"])

    def test_uniform_range(self):
        rng = Rng(7)
        vals = [rng.random() for _ in range(5000)]
        self.assertTrue(all(0.0 <= v < 1.0 for v in vals))
        self.assertAlmostEqual(sum(vals) / len(vals), 0.5, delta=0.02)

    def test_shuffle_is_permutation(self):
        rng = Rng(11)
        a = list(range(100))
        rng.shuffle(a)
        self.assertEqual(sorted(a), list(range(100)))
        self.assertNotEqual(a, list(range(100)))


class TestLattice(unittest.TestCase):
    def test_square_counts(self):
        lat = build_lattice("square", 8)
        self.assertEqual(lat.n, 64)
        self.assertEqual(lat.m, 2 * 8 * 7)
        lat_t = build_lattice("square", 8, torus=True)
        self.assertEqual(lat_t.m, 2 * 64)

    def test_triangular_counts(self):
        lat = build_lattice("triangular", 8)
        self.assertEqual(lat.m, 8 * 7 + 8 * 7 + 7 * 7)
        lat_t = build_lattice("triangular", 8, torus=True)
        self.assertEqual(lat_t.m, 3 * 64)

    def test_honeycomb_degree(self):
        lat = build_lattice("honeycomb", 8, torus=True)
        deg = [0] * lat.n
        for e in range(lat.m):
            deg[lat.eu[e]] += 1
            deg[lat.ev[e]] += 1
        self.assertEqual(set(deg), {3})
        self.assertEqual(lat.m, 3 * lat.n // 2)
        with self.assertRaises(ValueError):
            build_lattice("honeycomb", 7)

    def test_bad_kind(self):
        with self.assertRaises(ValueError):
            build_lattice("hexagonal", 8)


class TestPercolation(unittest.TestCase):
    def test_extremes(self):
        lat = build_lattice("square", 16)
        model = Percolation(lat, mode="bond")
        rng = Rng(3)
        model.sample(1.0, rng).analyze()
        self.assertEqual(model.dsu.count, 1)
        self.assertEqual(model.dsu.max_size, 16 * 16)
        model.sample(0.0, rng).analyze()
        self.assertEqual(model.dsu.count, 16 * 16)
        self.assertFalse(model.crosses_lr())

    def test_duality_crossing(self):
        lat = build_lattice("square", 48)
        model = Percolation(lat, mode="bond")
        rng = Rng(2024)
        hits = 0
        n = 400
        for _ in range(n):
            model.sample(0.5, rng)
            hits += model.crosses_lr()
        p = hits / n
        self.assertLess(abs(p - 0.5), 0.08, msg=f"crossing={p}")

    def test_triangular_site_threshold(self):
        lat = build_lattice("triangular", 32)
        model = Percolation(lat, mode="site")
        rng = Rng(99)
        lo = sum(model.sample(0.40, rng).crosses_lr() for _ in range(120)) / 120
        hi = sum(model.sample(0.60, rng).crosses_lr() for _ in range(120)) / 120
        self.assertLess(lo, 0.1)
        self.assertGreater(hi, 0.9)

    def test_newman_ziff(self):
        lat = build_lattice("square", 24)
        rng = Rng(5)
        out = newman_ziff(lat, rng, checkpoints=100)
        self.assertEqual(len(out["p"]), len(out["smax"]))
        self.assertAlmostEqual(out["p"][-1], 1.0)
        self.assertEqual(out["smax"][-1], lat.n)
        self.assertEqual(out["smax"], sorted(out["smax"]))


class TestNetwork(unittest.TestCase):
    def test_molloy_reed_er(self):
        rng = Rng(17)
        deg = poisson_degrees(20000, 4.0, rng)
        mr = molloy_reed(deg)
        self.assertAlmostEqual(mr["pc"], 0.25, delta=0.02)
        self.assertAlmostEqual(mr["kappa"], 5.0, delta=0.05)

    def test_giant_component(self):
        rng = Rng(23)
        deg = poisson_degrees(5000, 4.0, rng)
        g = configuration_model(deg, rng)
        active = [1] * 5000
        res = components(g, active)
        # ER giant component at c=4: 1 - exp(-4S) => S ~ 0.98
        self.assertGreater(res["largest_fraction"], 0.9)

    def test_kcore(self):
        rng = Rng(29)
        deg = poisson_degrees(3000, 3.5, rng)
        g = configuration_model(deg, rng)
        res = kcore(g, [1] * 3000, 3)
        self.assertGreater(res["fraction"], 0.0)
        self.assertLess(res["fraction"], 1.0)

    def test_interdependent_cascade(self):
        rng = Rng(31)
        res = interdependent_er(4000, 4.0, 0.80, rng)
        self.assertGreater(res["fraction"], 0.2)
        self.assertGreater(len(res["cascade"]), 0)


class TestContinuum(unittest.TestCase):
    def test_bool_model(self):
        rng = Rng(37)
        res = boolean_model(1500, 0.04, rng)
        # n*pi*r^2 = 7.54 > 1.128 => supercritical
        self.assertGreater(res["largest_fraction"], 0.5)


class TestCardy(unittest.TestCase):
    def test_symmetric_point(self):
        self.assertAlmostEqual(cardy_crossing(1.0), 0.5, places=12)

    def test_reference_values(self):
        self.assertAlmostEqual(cardy_crossing(0.1), 4.0394890895707114e-05, places=13)
        self.assertAlmostEqual(cardy_crossing(10.0), 0.9999596051091043, places=10)
        self.assertAlmostEqual(cardy_crossing(0.25), 0.02163002909086475, places=12)
        self.assertAlmostEqual(cardy_crossing(2.0), 0.8243531061993461, places=12)

    def test_monotone(self):
        vals = [cardy_crossing(l) for l in (0.1, 0.3, 1.0, 3.0, 10.0, 100.0)]
        self.assertEqual(vals, sorted(vals))
        self.assertGreater(vals[-1], 0.85)
        self.assertGreater(cardy_crossing(1e4), 0.97)

    def test_constant(self):
        self.assertAlmostEqual(CARDY_CONSTANT, 3 * math.gamma(2 / 3) / math.gamma(1 / 3) ** 2, places=12)


if __name__ == "__main__":
    unittest.main()
