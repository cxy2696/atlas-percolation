"""Bernoulli percolation, cluster statistics and the Newman–Ziff sweep."""

from __future__ import annotations

from dataclasses import dataclass

from .lattice import Lattice
from .rng import Rng


class Dsu:
    __slots__ = ("parent", "size", "n", "count", "max_size")

    def __init__(self, n: int):
        self.n = n
        self.parent = list(range(n))
        self.size = [1] * n
        self.count = n
        self.max_size = 1 if n else 0

    def reset(self) -> None:
        self.parent = list(range(self.n))
        self.size = [1] * self.n
        self.count = self.n
        self.max_size = 1 if self.n else 0

    def find(self, x: int) -> int:
        p = self.parent
        r = x
        while p[r] != r:
            r = p[r]
        while p[x] != r:
            nxt = p[x]
            p[x] = r
            x = nxt
        return r

    def union(self, a: int, b: int) -> bool:
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.size[ra] < self.size[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        self.size[ra] += self.size[rb]
        self.count -= 1
        if self.size[ra] > self.max_size:
            self.max_size = self.size[ra]
        return True


@dataclass
class ClusterStats:
    count: int = 0
    max_size: int = 0
    total: int = 0
    total2: int = 0
    sizes: list = None

    @property
    def max_fraction(self) -> float:
        return self.max_size / self.total if self.total else 0.0

    @property
    def mean_size(self) -> float:
        return self.total / self.count if self.count else 0.0

    @property
    def chi2(self) -> float:
        return self.total2 / self.total if self.total else 0.0


class Percolation:
    """Site or bond percolation on a lattice."""

    def __init__(self, lattice: Lattice, mode: str = "bond"):
        if mode not in ("bond", "site"):
            raise ValueError(f"bad mode {mode}")
        self.lat = lattice
        self.mode = mode
        self.occ = [1] * lattice.n
        self.open = [1] * lattice.m
        self.dsu = Dsu(lattice.n)
        self.dirty = True

    def sample(self, p: float, rng: Rng) -> "Percolation":
        if self.mode == "site":
            rnd = rng.random
            self.occ = [1 if rnd() < p else 0 for _ in range(self.lat.n)]
            self.open = [1] * self.lat.m
        else:
            rnd = rng.random
            self.occ = [1] * self.lat.n
            self.open = [1 if rnd() < p else 0 for _ in range(self.lat.m)]
        self.dirty = True
        return self

    def build(self) -> Dsu:
        dsu = self.dsu
        dsu.reset()
        occ, op = self.occ, self.open
        dsu.count = sum(occ)
        dsu.max_size = 1 if dsu.count else 0
        eu, ev = self.lat.eu, self.lat.ev
        for e in range(self.lat.m):
            if op[e] and occ[eu[e]] and occ[ev[e]]:
                dsu.union(eu[e], ev[e])
        self.dirty = False
        return dsu

    def ensure_built(self) -> Dsu:
        if self.dirty:
            self.build()
        return self.dsu

    def analyze(self) -> ClusterStats:
        dsu = self.build()
        root_size: dict[int, int] = {}
        for v in range(self.lat.n):
            if not self.occ[v]:
                continue
            r = dsu.find(v)
            root_size[r] = root_size.get(r, 0) + 1
        sizes = sorted(root_size.values(), reverse=True)
        st = ClusterStats(
            count=len(sizes),
            max_size=sizes[0] if sizes else 0,
            total=sum(sizes),
            total2=sum(s * s for s in sizes),
            sizes=sizes,
        )
        return st

    def crosses_lr(self) -> bool:
        self.ensure_built()
        L = self.lat.L
        left = set()
        for i in range(L):
            v = i * L
            if self.occ[v]:
                left.add(self.dsu.find(v))
        for i in range(L):
            v = i * L + L - 1
            if self.occ[v] and self.dsu.find(v) in left:
                return True
        return False

    def crosses_tb(self) -> bool:
        self.ensure_built()
        L = self.lat.L
        top = set()
        for j in range(L):
            if self.occ[j]:
                top.add(self.dsu.find(j))
        for j in range(L):
            v = (L - 1) * L + j
            if self.occ[v] and self.dsu.find(v) in top:
                return True
        return False


def newman_ziff(lat: Lattice, rng: Rng, checkpoints: int = 400):
    """One random edge order -> S_max(p), chi2(p), cluster count(p)."""
    if checkpoints < 1:
        raise ValueError("checkpoints must be positive")
    order = list(range(lat.m))
    rng.shuffle(order)
    dsu = Dsu(lat.n)
    total2 = lat.n
    every = max(1, lat.m // checkpoints)
    ps, smax, chi2, ncl = [], [], [], []
    for k, e in enumerate(order):
        a, b = dsu.find(lat.eu[e]), dsu.find(lat.ev[e])
        if a != b:
            sa, sb = dsu.size[a], dsu.size[b]
            dsu.union(a, b)
            total2 += 2 * sa * sb
        if (k + 1) % every == 0 or k == lat.m - 1:
            ps.append((k + 1) / lat.m)
            smax.append(dsu.max_size)
            chi2.append(total2 / lat.n)
            ncl.append(dsu.count)
    return {"p": ps, "smax": smax, "chi2": chi2, "nclusters": ncl}


def cluster_size_distribution(lat: Lattice, p: float, rng: Rng, mode: str = "bond", samples: int = 1):
    model = Percolation(lat, mode=mode)
    hist: dict[int, int] = {}
    for _ in range(samples):
        each = model.sample(p, rng).analyze().sizes or []
        for s in each:
            hist[s] = hist.get(s, 0) + 1
    return dict(sorted(hist.items()))


def _csr_neighbours(n: int, eu, ev):
    """Minimal CSR neighbour list, kept local to avoid an import cycle."""
    deg = [0] * n
    m = len(eu)
    for e in range(m):
        deg[eu[e]] += 1
        deg[ev[e]] += 1
    start = [0] * (n + 1)
    for v in range(n):
        start[v + 1] = start[v] + deg[v]
    pos = start[:-1].copy()
    adj = [0] * (2 * m)
    for e in range(m):
        a, b = eu[e], ev[e]
        adj[pos[a]] = b
        pos[a] += 1
        adj[pos[b]] = a
        pos[b] += 1
    return start, adj


def newman_ziff_site(lat: Lattice, rng: Rng, checkpoints: int = 400):
    """One random *site* order -> S_max(p), chi2(p) and cluster count.

    After ``k`` sites the occupied set is a uniform ``k``-subset of the
    vertices, hence a site-percolation sample at ``p = k/n``.  Edges are never
    sampled: an edge is active exactly when both endpoints have appeared, so
    the random object is the site order alone.  The returned arrays use the
    same convention as :func:`newman_ziff`: ``chi2`` is ``sum |C|^2 / n`` over
    the whole box, and the cluster count counts occupied clusters only.
    """
    if checkpoints < 1:
        raise ValueError("checkpoints must be positive")
    n = lat.n
    order = list(range(n))
    rng.shuffle(order)
    start, adj = _csr_neighbours(n, lat.eu, lat.ev)
    active = bytearray(n)
    dsu = Dsu(n)
    dsu.count = 0
    dsu.max_size = 0
    total2 = 0
    every = max(1, n // checkpoints)
    ps, smax, chi2, ncl = [], [], [], []
    for k, v in enumerate(order):
        active[v] = 1
        dsu.count += 1
        if dsu.max_size < 1:
            dsu.max_size = 1
        total2 += 1
        for j in range(start[v], start[v + 1]):
            u = adj[j]
            if active[u]:
                ra, rb = dsu.find(v), dsu.find(u)
                if ra != rb:
                    sa, sb = dsu.size[ra], dsu.size[rb]
                    dsu.union(ra, rb)
                    total2 += 2 * sa * sb
        if (k + 1) % every == 0 or k == n - 1:
            ps.append((k + 1) / n)
            smax.append(dsu.max_size)
            chi2.append(total2 / n)
            ncl.append(dsu.count)
    return {"p": ps, "smax": smax, "chi2": chi2, "nclusters": ncl, "n": n}
