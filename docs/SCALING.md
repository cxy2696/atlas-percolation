# Complexity, memory and practical scaling

This note records what each routine costs, where the implementation stops scaling, and which language to use for which job. The four libraries share algorithms and random streams, not performance characteristics.

## Percolation on a lattice

Let `n = L²` be the number of sites and `m` the number of edges (`2L(L−1)` on an open square lattice, `3n` on a triangular torus).

| Operation | Time | Memory | Notes |
|---|---|---|---|
| `build_lattice` | O(n + m) | O(n + m) | arrays of 32-bit indices |
| one bond sample | O(m) | O(m) | one uniform per edge |
| one site sample | O(n) | O(n) | one uniform per site |
| `build` (union-find) | O(m α(n)) | O(n) | α is the inverse Ackermann function |
| `analyze` | O(n α(n)) | O(n) | one pass over occupied roots |
| `crosses_lr` | O(L) | O(n) | root stamps, no allocation |
| directed crossing | O(L²) | O(n + m) | row-major reachability DP after the sample |
| Newman–Ziff sweep | O(m α(n)) | O(m + n) | one edge order; whole p-grid |

The JavaScript engine is the fastest way to explore a single configuration up to `L≈1024` in a browser. The C++ and Julia versions are appropriate when the same configuration must be repeated many times, or when `L` is large enough that allocation and garbage collection dominate. Python is the readable reference; it is roughly one to two orders of magnitude slower than C++ for the same `m`.

At `L=4096` a square lattice has 16.7 million sites and 33.5 million edges. A single `Int32Array` of edges is 134 MB before the union-find arrays and cluster bookkeeping. That is near the practical limit of a browser tab; use C++ or Julia for larger systems, and expect the union-find arrays alone to be several hundred megabytes.

## Networks

For `N` vertices and degree sum `M = Σ k`:

| Operation | Time | Memory |
|---|---|---|
| Poisson or Pareto degrees | O(N) | O(N) |
| configuration model | O(M) + shuffle | O(N + M) |
| components | O(N + M) | O(N) |
| k-core peeling | O(N + M) | O(N + M) |
| targeted removal | O(N log N) + O(N + M) | O(N) |
| Molloy–Reed | O(N) | O(1) extra |
| coupled cascade | O(I (N + M)) | O(N) |

`I` is the number of pruning rounds; in the one-to-one ER model it is small (typically under 40) but there is no universal bound. The benchmark caps it at 100 and records whether every replicate converged; the libraries cap it at 1000 as a safety valve. A cap that is reached is a signal, not a result: the returned `cascade` trace shows the last state.

The configuration model keeps self-loops and parallel edges, which is the correct ensemble for the Molloy–Reed asymptotics but not for a simple graph. If a simple graph is required, remove self-loops and merge parallels after generation and recompute the degree sequence; the threshold formula then applies only approximately.

## Continuum Boolean model

The implementation uses a uniform grid with cell size `2r`, checks the 3×3 neighbourhood, and unions overlapping disks.

| Operation | Time | Memory |
|---|---|---|
| `boolean_model` | expected O(n + pairs) | O(n + cells) |
| grid occupancy | O(n) | O(n) |
| neighbour checks | O(n) expected | O(n) |

The expected number of pairs grows with `n²r²`; for fixed `n`, large `r` is the expensive regime. Very small `r` creates many empty cells and a large `Map`/hash table; for `n=10⁶` and `r<10⁻³` a cell-list or a k-d tree is preferable. The model is two-dimensional and uses a unit square; it does not implement periodic boundaries or polydisperse disks.

## Cardy formula

`cardy_crossing(l)` costs a fixed 90-step bisection, each step evaluating two complete elliptic integrals by an 80-step AGM, plus a hypergeometric series evaluated at `m≤1/2`. In practice it is O(1) and sub-millisecond; the entire 221-point curve in the lab is cheap. The implementation is deliberately simple rather than optimised with a lookup table.

## Reproducibility and parallelisation

The shared RNG makes the four implementations comparable for a fixed seed. It is not designed for parallel streams: if you split a sweep across threads, give each worker its own seed and combine results statistically, or use a counter-based generator. Do not share one mutable RNG state across threads.

The benchmark harness is single-threaded. The C++ union-find is the obvious place to parallelise a multi-sample study, but the current API keeps one model per thread and one RNG per model; that is the safe pattern. The Python implementation is not intended for multi-million-sample campaigns.

## What is not implemented

- Random-cluster sampling as a library API. The Swendsen–Wang laboratory is a browser-only implementation; the four-library contract covers Bernoulli percolation and directed percolation.
- Three-dimensional lattice generators (the threshold table is data, not a generator).
- Higher-order connectivity on simplicial complexes.
- Temporal networks and time-respecting paths.
- GPU kernels.

These are honest boundaries, not omissions to be papered over. The cross-disciplinary chapter marks which extensions are exact, which are approximate, and which are metaphors.
