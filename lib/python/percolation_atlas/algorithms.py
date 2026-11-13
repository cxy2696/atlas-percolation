"""Algorithm zoo: bootstrap, explosive, invasion and Leath growth.

The routines take explicit arrays (edge lists, neighbour lists, threshold
arrays) so that the same input can be run in every language without relying on
a random stream.  The random wrappers at the end are reproducible: they use
the shared xoshiro128** generator.
"""

from __future__ import annotations

import heapq
from dataclasses import dataclass, field

from .percolation import Dsu
from .rng import Rng


def neighbours_from_edges(n: int, eu, ev):
    """CSR neighbour list: (start, adj, edge_of, degree)."""
    m = len(eu)
    deg = [0] * n
    for e in range(m):
        deg[eu[e]] += 1
        deg[ev[e]] += 1
    start = [0] * (n + 1)
    for v in range(n):
        start[v + 1] = start[v] + deg[v]
    pos = start[:-1].copy()
    adj = [0] * (2 * m)
    edge_of = [0] * (2 * m)
    for e in range(m):
        a, b = eu[e], ev[e]
        adj[pos[a]] = b
        edge_of[pos[a]] = e
        pos[a] += 1
        adj[pos[b]] = a
        edge_of[pos[b]] = e
        pos[b] += 1
    return start, adj, edge_of, deg


@dataclass
class BootstrapResult:
    active: list
    time: list
    rounds: list = field(default_factory=list)
    active_count: int = 0
    fraction: float = 0.0
    converged: bool = True
    max_degree: int = 0


def bootstrap_activation(n: int, neighbours, initial, r: int) -> BootstrapResult:
    """Synchronous r-neighbour bootstrap percolation.

    A site activates at round t+1 when at least r neighbours were active at
    round t.  The queue implementation is the least fixed point of the
    monotone closure and therefore independent of the order in which ties are
    broken.
    """
    if not isinstance(r, int) or r < 1:
        raise ValueError("bootstrap threshold r must be a positive integer")
    start, adj, _edge_of, deg = neighbours
    active = [0] * n
    time = [-1] * n
    count = [0] * n
    active_count = 0
    for v in range(n):
        if initial[v]:
            active[v] = 1
            time[v] = 0
            active_count += 1
    for v in range(n):
        if not active[v]:
            continue
        for k in range(start[v], start[v + 1]):
            u = adj[k]
            if not active[u]:
                count[u] += 1
    pending = [v for v in range(n) if not active[v] and count[v] >= r]
    rounds = []
    t = 0
    while pending:
        t += 1
        seen = set()
        for v in pending:
            if active[v] or v in seen:
                continue
            seen.add(v)
            active[v] = 1
            time[v] = t
            active_count += 1
        next_frontier = []
        for v in pending:
            if time[v] != t:
                continue
            for k in range(start[v], start[v + 1]):
                u = adj[k]
                if active[u]:
                    continue
                count[u] += 1
                if count[u] == r:
                    next_frontier.append(u)
        rounds.append({"round": t, "newly": len(seen), "cumulative": active_count})
        pending = next_frontier
        if t > n:
            raise RuntimeError("bootstrap did not converge; threshold exceeds maximum degree?")
    return BootstrapResult(
        active=active,
        time=time,
        rounds=rounds,
        active_count=active_count,
        fraction=active_count / n if n else 0.0,
        max_degree=max(deg) if deg else 0,
    )


def bootstrap_lattice(lattice, occupied, r: int) -> BootstrapResult:
    neighbours = neighbours_from_edges(lattice.n, lattice.eu, lattice.ev)
    return bootstrap_activation(lattice.n, neighbours, occupied, r)


@dataclass
class ExplosiveResult:
    steps: list
    max_jump: float
    jump_at: int
    rule: str
    n: int
    m: int
    candidates_used: int


def explosive_sweep(n: int, eu, ev, candidate_order, rule: str = "product") -> ExplosiveResult:
    """Achlioptas two-choice process with the product or sum rule.

    The thermodynamic limit of the product rule is continuous; the visible
    jump is a finite-size effect and is reported as such.
    """
    if rule not in ("product", "sum"):
        raise ValueError("rule must be product or sum")
    if candidate_order and (min(candidate_order) < 0 or max(candidate_order) >= len(eu)):
        raise ValueError("candidate_order contains an edge index outside 0..m-1")
    dsu = Dsu(n)
    sum2 = n
    steps = []
    max_jump = 0.0
    jump_at = 0
    prev_s = 1.0 / n if n else 0.0
    total = len(candidate_order)
    for k in range(0, total - 1, 2):
        e1, e2 = candidate_order[k], candidate_order[k + 1]
        a1, b1 = dsu.find(eu[e1]), dsu.find(ev[e1])
        a2, b2 = dsu.find(eu[e2]), dsu.find(ev[e2])
        s1 = dsu.size[a1] * dsu.size[b1]
        s2 = dsu.size[a2] * dsu.size[b2]
        if rule == "product":
            pick = e1 if s1 <= s2 else e2
        else:
            pick = e1 if (dsu.size[a1] + dsu.size[b1]) <= (dsu.size[a2] + dsu.size[b2]) else e2
        ra, rb = dsu.find(eu[pick]), dsu.find(ev[pick])
        before = dsu.max_size
        if ra != rb:
            sa, sb = dsu.size[ra], dsu.size[rb]
            dsu.union(ra, rb)
            sum2 += 2 * sa * sb
        smax = dsu.max_size / n if n else 0.0
        if smax - prev_s > max_jump:
            max_jump = smax - prev_s
            jump_at = (k + 2) // 2
        prev_s = smax
        steps.append(
            {
                "candidates": k + 2,
                "added": (k + 2) // 2,
                "edges": (k + 2) // 2,
                "smax": smax,
                "max_size": dsu.max_size,
                "clusters": dsu.count,
                "chi2": sum2 / n if n else 0.0,
                "merged": dsu.max_size > before,
            }
        )
    return ExplosiveResult(
        steps=steps,
        max_jump=max_jump,
        jump_at=jump_at,
        rule=rule,
        n=n,
        m=len(eu),
        candidates_used=(total // 2) * 2,
    )


@dataclass
class ExplosiveGraphResult:
    points: list
    max_jump: float
    jump_at: int
    rule: str
    n: int
    steps: int
    added: int


def explosive_random_graph(n: int, rule: str = "product", steps: int | None = None, seed: int = 1, record_every: int = 1) -> ExplosiveGraphResult:
    """Achlioptas process on the complete graph (two random candidate edges)."""
    if rule not in ("product", "sum"):
        raise ValueError("rule must be product or sum")
    if not isinstance(n, int) or n < 2:
        raise ValueError("explosive_random_graph needs n >= 2")
    rng = Rng(seed)
    dsu = Dsu(n)
    sum2 = n
    total = steps if steps is not None else 4 * n
    points = []
    max_jump = 0.0
    jump_at = 0
    prev_s = 1.0 / n
    added = 0
    for s in range(total):
        a1 = rng.int(n)
        b1 = rng.int(n - 1)
        if b1 >= a1:
            b1 += 1
        a2 = rng.int(n)
        b2 = rng.int(n - 1)
        if b2 >= a2:
            b2 += 1
        ra1, rb1 = dsu.find(a1), dsu.find(b1)
        ra2, rb2 = dsu.find(a2), dsu.find(b2)
        s1 = dsu.size[ra1] * dsu.size[rb1]
        s2 = dsu.size[ra2] * dsu.size[rb2]
        if rule == "product":
            pick_first = s1 <= s2
        else:
            pick_first = (dsu.size[ra1] + dsu.size[rb1]) <= (dsu.size[ra2] + dsu.size[rb2])
        a, b = (a1, b1) if pick_first else (a2, b2)
        ra, rb = dsu.find(a), dsu.find(b)
        if ra != rb:
            sa, sb = dsu.size[ra], dsu.size[rb]
            dsu.union(ra, rb)
            sum2 += 2 * sa * sb
            added += 1
        smax = dsu.max_size / n if n else 0.0
        if smax - prev_s > max_jump:
            max_jump = smax - prev_s
            jump_at = s + 1
        prev_s = smax
        if s % record_every == 0 or s == total - 1:
            points.append(
                {
                    "step": s + 1,
                    "added": added,
                    "q": (s + 1) / n,
                    "smax": smax,
                    "max_size": dsu.max_size,
                    "clusters": dsu.count,
                    "chi2": sum2 / n if n else 0.0,
                }
            )
    return ExplosiveGraphResult(points=points, max_jump=max_jump, jump_at=jump_at, rule=rule, n=n, steps=total, added=added)


def explosive_percolation(n: int, eu, ev, rule: str = "product", seed: int = 1) -> ExplosiveResult:
    rng = Rng(seed)
    order = list(range(len(eu)))
    rng.shuffle(order)
    return explosive_sweep(n, eu, ev, order, rule)


@dataclass
class InvasionResult:
    order: list
    thresholds: list
    accepted: list
    visited: list
    size: int
    loops: int
    last_threshold: float
    threshold: list | None = None


def invasion_cluster(n: int, eu, ev, threshold, seed: int = 0) -> InvasionResult:
    """Invasion percolation with loop rejection.

    Every edge has an i.i.d. threshold.  Starting from the seed, repeatedly
    accept the lowest-threshold boundary edge leading to an unvisited site.
    Loops are discarded.  The accepted set is a spanning tree of the invaded
    cluster.  This is not the trapping variant used for defending clusters.
    """
    if not isinstance(seed, int) or seed < 0 or seed >= n:
        raise ValueError("invasion seed must be a site index")
    m = len(eu)
    start, adj, edge_of, _deg = neighbours_from_edges(n, eu, ev)
    visited = [0] * n
    accepted = [0] * m
    order = [seed]
    keys = []
    heap = []
    visited[seed] = 1
    for k in range(start[seed], start[seed + 1]):
        e = edge_of[k]
        heapq.heappush(heap, (threshold[e], e))
    loops = 0
    loop_seen = set()
    while heap:
        key, edge = heapq.heappop(heap)
        a, b = eu[edge], ev[edge]
        u = b if visited[a] else a
        if visited[u]:
            if edge not in loop_seen:
                loop_seen.add(edge)
                loops += 1
            continue
        visited[u] = 1
        accepted[edge] = 1
        order.append(u)
        keys.append(key)
        for k in range(start[u], start[u + 1]):
            e = edge_of[k]
            if not accepted[e]:
                heapq.heappush(heap, (threshold[e], e))
    return InvasionResult(
        order=order,
        thresholds=keys,
        accepted=accepted,
        visited=visited,
        size=len(order),
        loops=loops,
        last_threshold=keys[-1] if keys else 0.0,
    )


def invasion_percolation(n: int, eu, ev, seed: int = 1, rng_seed: int = 1) -> InvasionResult:
    rng = Rng(rng_seed)
    threshold = [rng.random() for _ in range(len(eu))]
    result = invasion_cluster(n, eu, ev, threshold, seed)
    result.threshold = threshold
    return result


@dataclass
class LeathResult:
    sites: list
    size: int
    open_edges: int
    perimeter: int
    truncated: bool


def leath_cluster(lattice, seed: int, p: float, rng: Rng, max_size: int = 1 << 60) -> LeathResult:
    """Grow the cluster of `seed` in bond percolation at p."""
    n = lattice.n
    if not isinstance(seed, int) or seed < 0 or seed >= n:
        raise ValueError("Leath seed must be a site index")
    start, adj, edge_of, _deg = neighbours_from_edges(n, lattice.eu, lattice.ev)
    visited = [0] * n
    tested = [0] * lattice.m
    queue = [seed]
    visited[seed] = 1
    head = 0
    open_edges = 0
    perimeter = 0
    while head < len(queue) and len(queue) <= max_size:
        v = queue[head]
        head += 1
        for k in range(start[v], start[v + 1]):
            e = edge_of[k]
            if tested[e]:
                continue
            tested[e] = 1
            if rng.random() < p:
                open_edges += 1
                u = adj[k]
                if not visited[u]:
                    visited[u] = 1
                    queue.append(u)
            else:
                perimeter += 1
    return LeathResult(
        sites=queue,
        size=len(queue),
        open_edges=open_edges,
        perimeter=perimeter,
        truncated=len(queue) > max_size,
    )


@dataclass
class LabelResult:
    labels: list
    sizes: list
    count: int
    max_size: int
    max_label: int


def label_clusters(n: int, eu, ev, open_edges=None, active=None) -> LabelResult:
    """Label the connected components of open edges in scan order.

    This is the graph form of Hoshen-Kopelman labelling: edges are visited
    once in their given order, an equivalence table (the DSU) is maintained,
    and the labels are compressed in one final pass.  With ``active`` supplied
    the routine labels site percolation (edges count only when both endpoints
    are active); without it, every vertex is present and only ``open_edges``
    matters.  Inactive vertices get label -1.

    The cost is O((n + m) alpha(n)) time and O(n) memory.
    """
    dsu = Dsu(n)
    present = [1] * n if active is None else [1 if a else 0 for a in active]
    dsu.count = sum(present)
    dsu.max_size = 1 if dsu.count else 0
    m = len(eu)
    for e in range(m):
        if open_edges is not None and not open_edges[e]:
            continue
        a, b = eu[e], ev[e]
        if present[a] and present[b]:
            dsu.union(a, b)
    labels = [-1] * n
    sizes = [0] * n
    for v in range(n):
        if present[v]:
            r = dsu.find(v)
            labels[v] = r
            sizes[r] += 1
    count = sum(1 for s in sizes if s > 0)
    max_size = max(sizes) if sizes else 0
    max_label = max(labels) if labels else -1
    return LabelResult(labels=labels, sizes=sizes, count=count, max_size=max_size, max_label=max_label)
