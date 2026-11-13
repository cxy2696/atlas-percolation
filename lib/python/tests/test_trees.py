"""Tests for the tree, configuration-model and SIR final-size routines."""

from __future__ import annotations

import json
import math
import pathlib
import unittest

from percolation_atlas import (
    Rng,
    bethe_percolation,
    bethe_threshold,
    build_lattice,
    configuration_giant_component,
    label_clusters,
    poisson_pmf,
    sir_final_size,
)

GOLDEN = json.loads(
    (pathlib.Path(__file__).resolve().parents[3] / "data" / "golden" / "algorithms-v3.json").read_text()
)
EXPECTED = {p["id"]: p["value"] for p in GOLDEN["probes"]}


class BetheTests(unittest.TestCase):
    def test_golden_z3(self):
        r = bethe_percolation(3, 0.6)
        want = EXPECTED["bethe_z3_p06"]
        self.assertAlmostEqual(r.theta, want["theta"], places=10)
        self.assertAlmostEqual(r.u, want["u"], places=10)
        self.assertEqual(r.pc, 0.5)
        self.assertTrue(math.isinf(r.chi))

    def test_golden_z4(self):
        r = bethe_percolation(4, 0.4)
        want = EXPECTED["bethe_z4_p04"]
        self.assertAlmostEqual(r.theta, want["theta"], places=10)
        self.assertAlmostEqual(r.u, want["u"], places=10)

    def test_threshold_is_exact(self):
        for z in (2, 3, 4, 10):
            self.assertEqual(bethe_threshold(z), 1.0 / (z - 1))
        self.assertEqual(bethe_threshold(3), 0.5)

    def test_critical_point_has_zero_order_parameter(self):
        r = bethe_percolation(3, 0.5)
        self.assertEqual(r.theta, 0.0)
        self.assertEqual(r.u, 1.0)
        self.assertTrue(math.isinf(r.chi))

    def test_subcritical_mean_size(self):
        r = bethe_percolation(3, 0.4)
        self.assertEqual(r.theta, 0.0)
        self.assertAlmostEqual(r.chi, 7.0, places=12)
        self.assertFalse(r.supercritical)

    def test_chain_at_p_one_is_fully_open(self):
        # z = 2 is the endpoint p_c = 1: at p = 1 the chain percolates.
        r = bethe_percolation(2, 1.0)
        self.assertEqual(r.theta, 1.0)
        self.assertEqual(r.u, 0.0)
        self.assertTrue(r.supercritical)
        below = bethe_percolation(2, 0.999)
        self.assertEqual(below.theta, 0.0)
        self.assertAlmostEqual(below.chi, 1 + 2 * 0.999 / (1 - 0.999), places=10)

    def test_input_validation(self):
        with self.assertRaises(ValueError):
            bethe_percolation(1, 0.5)
        with self.assertRaises(ValueError):
            bethe_percolation(3, 1.5)


class ConfigurationModelTests(unittest.TestCase):
    def test_golden_poisson(self):
        r = configuration_giant_component(poisson_pmf(2.0), 1.0)
        want = EXPECTED["config_poisson_c2_T1"]
        self.assertAlmostEqual(r.S, want["S"], places=10)
        self.assertAlmostEqual(r.u, want["u"], places=10)
        self.assertAlmostEqual(r.kappa, want["kappa"], places=12)
        self.assertAlmostEqual(r.tc, want["tc"], places=12)
        self.assertAlmostEqual(r.r0, want["r0"], places=12)

    def test_subcritical_dilution_has_no_giant_component(self):
        r = configuration_giant_component(poisson_pmf(2.0), 0.4)
        self.assertEqual(r.S, 0.0)

    def test_threshold_scales_with_kappa(self):
        pmf = [0.1, 0.2, 0.3, 0.2, 0.1, 0.1]
        r = configuration_giant_component(pmf, 1.0)
        self.assertAlmostEqual(r.tc, 1.0 / (r.kappa - 1.0), places=12)

    def test_sir_matches_giant_component(self):
        pmf = poisson_pmf(3.0)
        for T in (0.2, 0.4, 0.7, 1.0):
            g = configuration_giant_component(pmf, T)
            s = sir_final_size(pmf, T)
            self.assertEqual(g.S, s.final_size)
            self.assertEqual(g.r0, s.r0)
            if s.r0 > 1:
                self.assertAlmostEqual(s.herd_immunity, 1 - 1 / s.r0, places=12)

    def test_poisson_pmf_normalised(self):
        pmf = poisson_pmf(4.0)
        self.assertAlmostEqual(sum(pmf), 1.0, places=12)
        self.assertAlmostEqual(sum(k * p for k, p in enumerate(pmf)), 4.0, places=6)


class LabelTests(unittest.TestCase):
    def test_labels_match_cluster_statistics(self):
        lat = build_lattice("square", 8)
        rng = Rng(7)
        open_edges = [1 if rng.random() < 0.5 else 0 for _ in range(lat.m)]
        lab = label_clusters(lat.n, lat.eu, lat.ev, open_edges)
        self.assertEqual(lab.count, len({x for x in lab.labels}))
        self.assertEqual(lab.max_size, max(lab.sizes))
        self.assertEqual(sum(lab.sizes), lat.n)

    def test_site_labels_skip_inactive_vertices(self):
        lat = build_lattice("square", 4)
        active = [1 if v % 3 else 0 for v in range(lat.n)]
        lab = label_clusters(lat.n, lat.eu, lat.ev, None, active)
        self.assertEqual(sum(lab.sizes), sum(active))
        for v, on in enumerate(active):
            if not on:
                self.assertEqual(lab.labels[v], -1)

    def test_golden_square6(self):
        lat = build_lattice("square", 6)
        rng = Rng(42)
        open_edges = [1 if rng.random() < 0.5 else 0 for _ in range(lat.m)]
        lab = label_clusters(lat.n, lat.eu, lat.ev, open_edges)
        want = EXPECTED["labels_square6_p05_seed42"]
        self.assertEqual(lab.count, want["count"])
        self.assertEqual(lab.max_size, want["maxSize"])
        self.assertEqual(lab.labels, want["labels"])


if __name__ == "__main__":
    unittest.main()
