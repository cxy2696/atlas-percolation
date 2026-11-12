"""Network percolation: configuration model, k-core, coupled networks."""

from __future__ import annotations

import math
from dataclasses import dataclass

from .rng import Rng


class Graph:
    """Compressed sparse row adjacency (multigraph allowed)."""

    __slots__ = ("n", "m", "offset", "adj")

    def __init__(self, n: int, offset: list, adj: list):
        self.n = n
        self.m = len(adj)
        self.offset = offset
        self.adj = adj

    def degree(self, v: int) -> int:
        return self.offset[v + 1] - self.offset[v]

    def neighbors(self, v: int):
        for e in range(self.offset[v], self.offset[v + 1]):
            yield self.adj[e]


def poisson_degrees(N: int, mean: float, rng: Rng) -> list:
    deg = []
    limit = math.exp(-mean)
    for _ in range(N):
        k = 0
        p = 1.0
        while True:
            k += 1
            p *= rng.random()
            if p <= limit:
                break
        deg.append(k - 1)
    if sum(deg) % 2 == 1:
        deg[0] += 1
    return deg


def power_law_degrees(N: int, gamma: float, kmin: int = 2, kmax: int = 10000, rng: Rng | None = None) -> list:
    if rng is None:
        raise ValueError("rng is required")
    a = 1.0 / (gamma - 1.0)
    deg = []
    for _ in range(N):
        u = rng.random()
        k = int(kmin * (1.0 - u) ** (-a))
        if k > kmax or k != k:
            k = kmax
        if k < kmin:
            k = kmin
        deg.append(k)
    if sum(deg) % 2 == 1:
        deg[0] += 1
    return deg


def configuration_model(deg: list, rng: Rng) -> Graph:
    N = len(deg)
    M = sum(deg)
    if M % 2 == 1:
        raise ValueError("degree sum must be even")
    stubs = []
    for i, d in enumerate(deg):
        stubs.extend([i] * d)
    rng.shuffle(stubs)
    offset = [0] * (N + 1)
    for k in range(0, M, 2):
        offset[stubs[k] + 1] += 1
        offset[stubs[k + 1] + 1] += 1
    for i in range(N):
        offset[i + 1] += offset[i]
    fill = offset[:-1][:]
    adj = [0] * M
    for k in range(0, M, 2):
        a, b = stubs[k], stubs[k + 1]
        adj[fill[a]] = b
        fill[a] += 1
        adj[fill[b]] = a
        fill[b] += 1
    return Graph(N, offset, adj)


def components(graph: Graph, active) -> dict:
    n = graph.n
    seen = bytearray(n)
    sizes = []
    largest = 0
    active_count = sum(1 for v in range(n) if active[v])
    for v in range(n):
        if not active[v] or seen[v]:
            continue
        seen[v] = 1
        stack = [v]
        size = 0
        while stack:
            u = stack.pop()
            size += 1
            for w in graph.neighbors(u):
                if active[w] and not seen[w]:
                    seen[w] = 1
                    stack.append(w)
        sizes.append(size)
        if size > largest:
            largest = size
    sizes.sort(reverse=True)
    return {
        "sizes": sizes,
        "largest": largest,
        "active_count": active_count,
        "largest_fraction": largest / active_count if active_count else 0.0,
        "largest_global_fraction": largest / n if n else 0.0,
    }


def all_active(n: int) -> list:
    return [1] * n


def dilute(active: list, p: float, rng: Rng) -> list:
    return [1 if active[i] and rng.random() < p else 0 for i in range(len(active))]


def targeted_removal(graph: Graph, frac: float) -> list:
    n = graph.n
    order = sorted(range(n), key=lambda v: -graph.degree(v))
    active = [1] * n
    for i in range(int(frac * n)):
        active[order[i]] = 0
    return active


def kcore(graph: Graph, active, k: int):
    n = graph.n
    alive = [0] * n
    deg = [0] * n
    rem = 0
    for v in range(n):
        if active[v]:
            alive[v] = 1
            rem += 1
            deg[v] = sum(1 for w in graph.neighbors(v) if active[w])
    queue = [v for v in range(n) if alive[v] and deg[v] < k]
    head = 0
    while head < len(queue):
        v = queue[head]
        head += 1
        if not alive[v]:
            continue
        alive[v] = 0
        rem -= 1
        for w in graph.neighbors(v):
            if alive[w]:
                deg[w] -= 1
                if deg[w] < k:
                    queue.append(w)
    return {"alive": alive, "size": rem, "fraction": rem / n if n else 0.0}


def _mark_giant(graph: Graph, active, out) -> None:
    n = graph.n
    seen = bytearray(n)
    best = []
    for v in range(n):
        if not active[v] or seen[v]:
            continue
        seen[v] = 1
        stack = [v]
        members = []
        while stack:
            u = stack.pop()
            members.append(u)
            for w in graph.neighbors(u):
                if active[w] and not seen[w]:
                    seen[w] = 1
                    stack.append(w)
        if len(members) > len(best):
            best = members
    for v in best:
        out[v] = 1


def interdependent_er(N: int, mean_degree: float, p: float, rng: Rng) -> dict:
    """Fully coupled ER pair with one-to-one dependency.

    A vertex survives a pruning round only if it is still retained, lies in
    the giant component of layer A and lies in the giant component of layer B.
    The layers share labels, so the round is the intersection of the two giant
    components.  Pruning the layers independently is wrong: it keeps vertices
    whose partner has already failed and misses cascades.
    """
    deg_a = poisson_degrees(N, mean_degree, rng)
    deg_b = poisson_degrees(N, mean_degree, rng)
    ga = configuration_model(deg_a, rng)
    gb = configuration_model(deg_b, rng)
    surviving = bytearray(1 if rng.random() < p else 0 for _ in range(N))
    trace = []
    for it in range(1000):
        ca = components(ga, surviving)
        cb = components(gb, surviving)
        trace.append(
            {
                "iteration": it,
                "a": ca["largest_fraction"],
                "b": cb["largest_fraction"],
                "alive_a": ca["active_count"],
                "alive_b": cb["active_count"],
            }
        )
        giant_a = bytearray(N)
        giant_b = bytearray(N)
        _mark_giant(ga, surviving, giant_a)
        _mark_giant(gb, surviving, giant_b)
        nxt = bytearray(N)
        for i in range(N):
            nxt[i] = 1 if surviving[i] and giant_a[i] and giant_b[i] else 0
        if nxt == surviving:
            break
        surviving = nxt
    alive = sum(surviving)
    return {
        "fraction": alive / N if N else 0.0,
        "cascade": trace,
        "graph_a": ga,
        "graph_b": gb,
        "active": surviving,
    }


def molloy_reed(deg: list) -> dict:
    n = len(deg)
    s1 = sum(deg)
    s2 = sum(d * d for d in deg)
    k1 = s1 / n
    k2 = s2 / n
    kappa = k2 / k1 if k1 > 0 else math.inf
    pc = k1 / (k2 - k1) if k2 > k1 else math.inf
    return {"mean": k1, "second": k2, "kappa": kappa, "pc": pc, "fc": 1 - pc}
