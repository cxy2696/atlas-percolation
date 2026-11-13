"""Message passing for bond percolation on a fixed graph.

The cavity message ``u[i -> j]`` is the probability that ``i`` is not
connected to the giant component through any neighbour other than ``j``.
For bond percolation with retention ``T``:

    u[i -> j] = prod_{k in N(i) \\ {j}} (1 - T + T u[k -> i])

The product is exact on a tree.  On a graph with cycles it is the Bethe
approximation; the error is controlled by the density of short loops, not by
the system size.  The implementation computes each vertex's product with a
prefix/suffix scan, so one sweep costs O(n + m) rather than O(sum deg^2).

The iteration starts from zero, which selects the physical (smallest) fixed
point.  Starting from one would stay at the trivial fixed point and report no
giant component even when the graph has one.
"""

from __future__ import annotations

__all__ = ["message_passing_percolation"]


def _csr(n: int, eu, ev):
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
    mate = [0] * (2 * m)
    for e in range(m):
        a, b = eu[e], ev[e]
        ha = pos[a]
        hb = pos[b]
        adj[ha] = b
        adj[hb] = a
        edge_of[ha] = e
        edge_of[hb] = e
        mate[ha] = hb
        mate[hb] = ha
        pos[a] += 1
        pos[b] += 1
    return start, adj, edge_of, mate, deg


def message_passing_percolation(n: int, eu, ev, T: float, max_iter: int = 10000, tol: float = 1e-12):
    """Run the cavity iteration and return the giant-component fraction.

    ``T`` is the bond retention probability.  The result contains ``S`` (the
    fraction outside the giant component is ``1 - S``), the per-vertex
    outside probabilities, the number of sweeps and a convergence flag.
    """
    if n < 0:
        raise ValueError("n must be non-negative")
    if not (0.0 <= T <= 1.0):
        raise ValueError("T must lie in [0,1]")
    if max_iter < 1:
        raise ValueError("max_iter must be positive")
    start, adj, edge_of, mate, deg = _csr(n, eu, ev)
    m = len(eu)
    msg = [0.0] * (2 * m)
    converged = False
    iterations = 0
    max_change = 0.0
    for iterations in range(1, max_iter + 1):
        new = [0.0] * (2 * m)
        max_change = 0.0
        for v in range(n):
            lo, hi = start[v], start[v + 1]
            vals = [1.0 - T + T * msg[k] for k in range(lo, hi)]
            d = hi - lo
            if d == 0:
                continue
            prefix = [1.0] * (d + 1)
            suffix = [1.0] * (d + 1)
            for i in range(d):
                prefix[i + 1] = prefix[i] * vals[i]
            for i in range(d - 1, -1, -1):
                suffix[i] = suffix[i + 1] * vals[i]
            for i, k in enumerate(range(lo, hi)):
                # msg[k] is the message *into* v from adj[k]; the message v
                # sends back is stored at the opposite half-edge.
                value = prefix[i] * suffix[i + 1]
                slot = mate[k]
                new[slot] = value
                diff = abs(value - msg[slot])
                if diff > max_change:
                    max_change = diff
        msg = new
        if max_change < tol:
            converged = True
            break
    outside = [1.0] * n
    for v in range(n):
        prod = 1.0
        for k in range(start[v], start[v + 1]):
            prod *= 1.0 - T + T * msg[k]
        outside[v] = prod
    S = 1.0 - sum(outside) / n if n else 0.0
    return {
        "S": max(0.0, min(1.0, S)),
        "outside": outside,
        "iterations": iterations,
        "converged": converged,
        "maxChange": max_change,
    }
