"""Continuum (Boolean) percolation in the unit square."""

from __future__ import annotations

import math

from .percolation import Dsu
from .rng import Rng


def poisson_points(n: int, rng: Rng):
    xs = []
    ys = []
    for _ in range(n):
        xs.append(rng.random())
        ys.append(rng.random())
    return xs, ys


def boolean_model(n: int, r: float, rng: Rng) -> dict:
    xs, ys = poisson_points(n, rng)
    dsu = Dsu(n)
    size = 2.0 * r
    cells: dict[tuple[int, int], list[int]] = {}
    for v in range(n):
        key = (int(xs[v] / size), int(ys[v] / size))
        cells.setdefault(key, []).append(v)
    r2 = (2.0 * r) ** 2
    for v in range(n):
        cx, cy = int(xs[v] / size), int(ys[v] / size)
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                for w in cells.get((cx + dx, cy + dy), ()):
                    if w <= v:
                        continue
                    ddx = xs[v] - xs[w]
                    ddy = ys[v] - ys[w]
                    if ddx * ddx + ddy * ddy <= r2:
                        dsu.union(v, w)
    sizes: dict[int, int] = {}
    for v in range(n):
        root = dsu.find(v)
        sizes[root] = sizes.get(root, 0) + 1
    ordered = sorted(sizes.values(), reverse=True)
    return {
        "n": n,
        "r": r,
        "x": xs,
        "y": ys,
        "dsu": dsu,
        "sizes": ordered,
        "largest": ordered[0] if ordered else 0,
        "largest_fraction": ordered[0] / n if n else 0.0,
        "coverage": 1.0 - math.exp(-n * math.pi * r * r),
    }
