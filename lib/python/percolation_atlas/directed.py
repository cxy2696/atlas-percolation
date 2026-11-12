"""Directed percolation on an L x L square lattice.

Edges point east and south.  Bond mode opens each E/S edge with probability
``p``; site mode occupies each site with probability ``p`` and uses all E/S
edges between occupied sites.  The DP is row-major, so it is O(L^2) after the
configuration is drawn, and the RNG consumption is identical to the undirected
sampler (n uniforms for site, m for bond, in lattice order).
"""

from __future__ import annotations

from .lattice import Lattice
from .rng import Rng


def _edge_index(lat: Lattice):
    east = [-1] * lat.n
    south = [-1] * lat.n
    for e in range(lat.m):
        a, b = lat.eu[e], lat.ev[e]
        if b == a + 1 and a // lat.L == b // lat.L:
            east[a] = e
        elif b == a + lat.L:
            south[a] = e
    return east, south


def directed_crossing(lat: Lattice, p: float, rng: Rng, mode: str = "bond") -> dict:
    if lat.kind != "square":
        raise ValueError("directed percolation needs the square lattice")
    if mode not in ("bond", "site"):
        raise ValueError(f"bad mode {mode}")
    n, L = lat.n, lat.L
    occ = [1] * n if mode == "bond" else [1 if rng.random() < p else 0 for _ in range(n)]
    open_edges = [1] * lat.m if mode == "site" else [1 if rng.random() < p else 0 for _ in range(lat.m)]
    east, south = _edge_index(lat)
    reach = [0] * n
    cross = False
    for i in range(L):
        row = i * L
        for j in range(L):
            v = row + j
            if not occ[v]:
                continue
            r = j == 0
            if not r and reach[v - 1] and open_edges[east[v - 1]]:
                r = True
            if not r and i > 0 and reach[v - L] and open_edges[south[v - L]]:
                r = True
            reach[v] = 1 if r else 0
            if r and j == L - 1:
                cross = True
    return {
        "cross": cross,
        "reach": reach,
        "open": open_edges,
        "occ": occ,
        "mode": mode,
        "m": lat.m,
        "n": n,
    }


def directed_crossing_rate(lat: Lattice, p: float, rng: Rng, mode: str = "bond", samples: int = 100) -> float:
    if samples < 1:
        raise ValueError("samples must be positive")
    hits = sum(1 for _ in range(samples) if directed_crossing(lat, p, rng, mode)["cross"])
    return hits / samples


def directed_crosses_lr(lat: Lattice, p: float, rng: Rng, mode: str = "bond") -> bool:
    return directed_crossing(lat, p, rng, mode)["cross"]
