"""Tests for message passing and the site-mode Newman-Ziff sweep."""

from __future__ import annotations

import json
import pathlib
import unittest

from percolation_atlas import (
    Rng,
    build_lattice,
    message_passing_percolation,
    newman_ziff_site,
)

GOLDEN = json.loads(
    (pathlib.Path(__file__).resolve().parents[3] / "data" / "golden" / "algorithms-v3.json").read_text()
)
EXPECTED = {p["id"]: p["value"] for p in GOLDEN["probes"]}


class MessagePassingTests(unittest.TestCase):
    def test_k5_golden(self):
        eu, ev = [], []
        for i in range(5):
            for j in range(i + 1, 5):
                eu.append(i)
                ev.append(j)
        r = message_passing_percolation(5, eu, ev, 0.4)
        want = EXPECTED["message_k5_T04"]
        self.assertAlmostEqual(r["S"], want["S"], places=10)
        for got, expected in zip(r["outside"], want["outside"]):
            self.assertAlmostEqual(got, expected, places=10)
        self.assertTrue(r["converged"])

    def test_finite_tree_has_no_giant_component(self):
        r = message_passing_percolation(4, [0, 1, 2], [1, 2, 3], 0.5)
        self.assertEqual(r["S"], 0.0)
        for value in r["outside"]:
            self.assertAlmostEqual(value, 1.0, places=12)

    def test_t_one_connected_graph(self):
        r = message_passing_percolation(3, [0, 1, 2], [1, 2, 0], 1.0)
        self.assertEqual(r["S"], 1.0)
        for value in r["outside"]:
            self.assertEqual(value, 0.0)

    def test_input_validation(self):
        with self.assertRaises(ValueError):
            message_passing_percolation(2, [0], [1], 1.5)
        with self.assertRaises(ValueError):
            message_passing_percolation(2, [0], [1], 0.5, max_iter=0)


class SiteNewmanZiffTests(unittest.TestCase):
    def test_golden_square8(self):
        lat = build_lattice("square", 8)
        r = newman_ziff_site(lat, Rng(5), checkpoints=16)
        want = EXPECTED["nz_site_square8_seed5_cp16"]
        self.assertEqual(r["p"], want["p"])
        self.assertEqual(r["smax"], want["smax"])
        self.assertEqual(r["nclusters"], want["nclusters"])
        for got, expected in zip(r["chi2"], want["chi2"]):
            self.assertAlmostEqual(got, expected, places=12)

    def test_one_checkpoint_is_full_occupancy(self):
        lat = build_lattice("square", 6)
        r = newman_ziff_site(lat, Rng(1), checkpoints=1)
        self.assertEqual(r["p"][-1], 1.0)
        self.assertEqual(r["smax"][-1], lat.n)
        self.assertEqual(r["nclusters"][-1], 1)

    def test_input_validation(self):
        lat = build_lattice("square", 4)
        with self.assertRaises(ValueError):
            newman_ziff_site(lat, Rng(1), checkpoints=0)


if __name__ == "__main__":
    unittest.main()
