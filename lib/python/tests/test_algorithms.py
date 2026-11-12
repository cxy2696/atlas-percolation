"""Tests for the v3 algorithm zoo (bootstrap, explosive, invasion, Leath)."""

from __future__ import annotations

import json
import pathlib
import unittest

from percolation_atlas import (
    Rng,
    build_lattice,
    neighbours_from_edges,
    bootstrap_activation,
    invasion_cluster,
    leath_cluster,
    explosive_random_graph,
    explosive_percolation,
    explosive_sweep,
)


GOLDEN = json.loads(
    (pathlib.Path(__file__).resolve().parents[3] / "data" / "golden" / "algorithms-v3.json").read_text()
)
EXPECTED = {p["id"]: p["value"] for p in GOLDEN["probes"]}


class BootstrapTests(unittest.TestCase):
    def test_golden_3x3(self):
        lat = build_lattice("square", 3)
        nb = neighbours_from_edges(lat.n, lat.eu, lat.ev)
        init = [0] * 9
        for v in (0, 2, 6, 8):
            init[v] = 1
        b = bootstrap_activation(9, nb, init, 2)
        self.assertEqual(b.active_count, EXPECTED["bootstrap_3x3_corners_r2"]["activeCount"])
        self.assertEqual(len(b.rounds), EXPECTED["bootstrap_3x3_corners_r2"]["rounds"])
        self.assertEqual(b.time, EXPECTED["bootstrap_3x3_corners_r2"]["time"])

    def test_least_fixed_point(self):
        lat = build_lattice("square", 8)
        nb = neighbours_from_edges(lat.n, lat.eu, lat.ev)
        for seed in range(1, 13):
            rng = Rng(seed)
            init = [1 if rng.random() < 0.4 else 0 for _ in range(lat.n)]
            r = 1 + (seed % 3)
            fast = bootstrap_activation(lat.n, nb, init, r)
            active = list(init)
            for _round in range(lat.n):
                nxt = list(active)
                for v in range(lat.n):
                    if active[v]:
                        continue
                    c = 0
                    for k in range(nb[0][v], nb[0][v + 1]):
                        if active[nb[1][k]]:
                            c += 1
                    if c >= r:
                        nxt[v] = 1
                if nxt == active:
                    break
                active = nxt
            self.assertEqual(fast.active, active, f"seed {seed} r {r}")

    def test_threshold_above_degree(self):
        lat = build_lattice("square", 5)
        nb = neighbours_from_edges(lat.n, lat.eu, lat.ev)
        b = bootstrap_activation(lat.n, nb, [1] * lat.n, 5)
        self.assertEqual(b.active_count, lat.n)
        self.assertEqual(len(b.rounds), 0)


class InvasionTests(unittest.TestCase):
    def test_golden_2x2(self):
        lat = build_lattice("square", 2)
        inv = invasion_cluster(4, lat.eu, lat.ev, [0.1, 0.9, 0.2, 0.8], 0)
        want = EXPECTED["invasion_2x2_thresholds"]
        self.assertEqual(inv.order, want["order"])
        self.assertEqual(inv.thresholds, want["thresholds"])
        self.assertEqual(inv.loops, want["loops"])

    def test_spanning_tree(self):
        lat = build_lattice("square", 12)
        rng = Rng(77)
        th = [rng.random() for _ in range(lat.m)]
        inv = invasion_cluster(lat.n, lat.eu, lat.ev, th, 0)
        self.assertEqual(inv.size, lat.n)
        self.assertEqual(len(inv.thresholds), lat.n - 1)
        self.assertEqual(sum(inv.accepted), lat.n - 1)


class LeathTests(unittest.TestCase):
    def test_extremes(self):
        lat = build_lattice("square", 6)
        full = leath_cluster(lat, 0, 1.0, Rng(1))
        self.assertEqual(full.size, lat.n)
        self.assertEqual(full.perimeter, 0)
        empty = leath_cluster(lat, 0, 0.0, Rng(1))
        self.assertEqual(empty.size, 1)
        self.assertEqual(empty.open_edges, 0)

    def test_golden(self):
        lat = build_lattice("square", 6)
        le = leath_cluster(lat, 3, 0.5, Rng(3))
        want = EXPECTED["leath_6x6_seed3_p05"]
        self.assertEqual(le.size, want["size"])
        self.assertEqual(le.open_edges, want["openEdges"])
        self.assertEqual(le.perimeter, want["perimeter"])


class ExplosiveTests(unittest.TestCase):
    def test_monotone_and_spans(self):
        ex = explosive_random_graph(300, seed=5)
        last = 0.0
        for point in ex.points:
            self.assertGreaterEqual(point["smax"], last - 1e-15)
            self.assertLessEqual(point["smax"], 1.0)
            last = point["smax"]
        self.assertEqual(ex.points[-1]["smax"], 1.0)
        self.assertGreater(ex.max_jump, 0.0)

    def test_golden_graph(self):
        ex = explosive_random_graph(500, seed=7)
        want = EXPECTED["explosive_graph_500_seed7"]
        self.assertEqual(ex.points[-1]["smax"], want["final"])
        self.assertAlmostEqual(ex.max_jump, want["maxJump"], places=12)
        self.assertEqual(ex.jump_at, want["jumpAt"])
        self.assertEqual(ex.added, want["added"])

    def test_fixed_list_rules(self):
        lat = build_lattice("square", 4)
        order = list(range(lat.m))
        prod = explosive_sweep(16, lat.eu, lat.ev, order, rule="product")
        summ = explosive_sweep(16, lat.eu, lat.ev, order, rule="sum")
        self.assertEqual(len(prod.steps), lat.m // 2)
        self.assertEqual(len(summ.steps), lat.m // 2)
        self.assertGreater(prod.steps[-1]["smax"], 0.0)
        self.assertGreaterEqual(prod.steps[-1]["chi2"], 1.0)
        with self.assertRaises(ValueError):
            explosive_sweep(16, lat.eu, lat.ev, order, rule="nope")

    def test_guards(self):
        lat = build_lattice("square", 4)
        th = [0.5] * lat.m
        with self.assertRaises(ValueError):
            invasion_cluster(lat.n, lat.eu, lat.ev, th, -1)
        with self.assertRaises(ValueError):
            invasion_cluster(lat.n, lat.eu, lat.ev, th, lat.n)
        with self.assertRaises(ValueError):
            leath_cluster(lat, lat.n, 0.5, Rng(1))
        with self.assertRaises(ValueError):
            explosive_random_graph(1, seed=1)

    def test_lattice_golden(self):
        lat = build_lattice("square", 4)
        ex = explosive_percolation(16, lat.eu, lat.ev, seed=11, rule="sum")
        want = EXPECTED["explosive_lattice_4x4_seed11_sum"]
        self.assertEqual(len(ex.steps), want["steps"])
        self.assertEqual(ex.steps[-1]["smax"], want["smax"])
        self.assertAlmostEqual(ex.max_jump, want["maxJump"], places=12)
        self.assertEqual(ex.jump_at, want["jumpAt"])


if __name__ == "__main__":
    unittest.main()
