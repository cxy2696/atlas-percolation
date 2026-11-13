# Algorithms

The site's **Algorithms** view has the full walkthrough for each routine: idea, steps, invariant, cost, code notes, pitfalls and tests. This page is the map.

All thirteen routines share:

- a CSR edge list with `n` sites and `m` edges;
- a DSU that owns the component partition and the counters;
- the xoshiro128** stream and the consumption order in `docs/RNG.md`;
- integer or exact-size parity checks, not only statistical comparisons.

## The thirteen routines

| Routine | Task | Main cost | Source |
|---|---|---|---|
| Bernoulli sampler | one configuration | `O(n + m α(n))` | `lib/js/engine/percolation.js`, `lib/python/percolation_atlas/percolation.py` |
| Union–find | components under edge insertions | `O(α(n))` amortised | `lib/js/engine/dsu.js` |
| Newman–Ziff (bond) | the whole curve from one edge order | `O(m α(n))` | `percolation.js`, `percolation.py` |
| Newman–Ziff (site) | the whole curve from one site order | `O(n + m α(n))` | `percolation.js`, `percolation.py` |
| Leath growth | one cluster, conditional on its seed | `O(|C| + boundary)` | `lib/js/engine/algorithms.js`, `algorithms.py` |
| Bootstrap | least fixed point of a threshold closure | `O(n + m)` | `algorithms.js`, `algorithms.py` |
| Invasion | greedy minimum-threshold growth | `O(m log m)` worst case | `algorithms.js`, `algorithms.py` |
| Achlioptas | two-choice edge process | `O(n α(n))` | `algorithms.js`, `algorithms.py` |
| k-core | largest induced subgraph with min degree `k` | `O(n + m)` | `lib/js/engine/network.js`, `network.py` |
| Hoshen–Kopelman | label every cluster in one scan | `O((n + m) α(n))` | `lib/js/engine/algorithms.js`, `algorithms.py` |
| Bethe fixed point | exact tree θ(p), u, χ and p_c | `O(log(1/tol))` | `lib/js/engine/trees.js`, `trees.py` |
| SIR final size | final size and herd immunity | `O(k_max log(1/tol))` | `trees.js`, `trees.py` |
| Message passing | giant component from cavity fixed point | `O((n+m)·iterations)` | `message.js`, `message.py` |

## What to remember

### DSU

`find` returns the root; `union` links the smaller root under the larger. Union by size alone gives `O(log n)` depth; path halving with union by size gives the inverse-Ackermann bound. The counters `count` and `maxSize` are maintained inside `union`, because every observable needs them.

### Newman–Ziff

After `k` edges of a uniform permutation, the open set is a uniform `k`-subset, so it is a sample at `p = k/m`. When components of sizes `a` and `b` merge, `M₂` increases by `2ab`. Points along one sweep are correlated; error bars need independent edge orders.

### Leath

Each edge incident to a visited site is tested once. An open edge to an unvisited site is explored; a closed one is perimeter. The optional size cutoff truncates the tail — report it.

### Bootstrap

The update operator is monotone, so the final set is the least fixed point and is independent of update order. The queue implementation uses two frontiers so that a site is activated in round `t + 1`, never in round `t`. For `r = 2` on the square lattice the infinite-lattice threshold is zero; a finite box fills above an `L`-dependent crossover. `r = 3` and `r = 4` have positive thresholds.

### Invasion

The accepted edges form a spanning tree. Rejected loop edges are recorded once; an edge with two visited endpoints would otherwise be counted twice. The accepted threshold sequence is not monotone: a newly exposed edge can be cheaper than the last accepted one. This is loop rejection, not the trapping variant.

### Achlioptas

Two candidates are drawn; the product (or sum) rule keeps the one with smaller endpoint components. The trajectory is a deterministic function of the candidate sequence. The visible jump is finite-size; the product rule is continuous in the thermodynamic limit.

### k-core

Repeatedly delete vertices whose current degree is below `k`. The result is the unique maximal k-core. The queue must be growable: a vertex can be re-queued after each neighbour is peeled.

## Which check covers what

| Claim | Check |
|---|---|
| RNG stream | `data/golden/rng-seed42.json` |
| Four-language core | `data/golden/parity.json`, `scripts/parity.py` |
| v3/v4 algorithms, site sweep, message passing | `data/golden/algorithms-v3.json`, all four test suites |
| Bootstrap fixed point | `tests/js/algorithms.test.js` (naive closure comparison) |
| Invasion tree | `tests/js/algorithms.test.js` |
| Leath extremes | `tests/js/algorithms.test.js` |
| k-core regression | `tests/js/engine.test.js` |

The prose walkthrough is in [`docs/ALGORITHMS.md`](https://github.com/cxy2696/atlas-percolation/blob/main/docs/ALGORITHMS.md); the interactive version is the site's **Algorithms** view.

### Hoshen–Kopelman

The scan visits the edge list once and unions open edges whose endpoints are present; the labels are compressed in one final pass. In site mode an inactive vertex gets label `-1`; forgetting that sentinel turns every empty site into a singleton cluster.

### Bethe fixed point

The z-regular tree gives `u = (1 − p + pu)^(z−1)` and `θ = 1 − (1 − p + pu)^z`. The physical branch is the smallest fixed point; iterating from `u = 1` would report θ = 0 above p_c. The threshold is exactly `1/(z−1)`.

### SIR final size

The final size of an SIR epidemic is the giant component of the contact graph after each edge is kept with transmissibility `T`. The solver evaluates `S = 1 − G0(1 − T + Tu)`, `u = G1(1 − T + Tu)` and returns `R0 = T(κ−1)`. Starting the iteration at `u = 1` is the same trivial-root error as in the Bethe solver.

### Site Newman–Ziff

The site sweep adds vertices instead of edges. After `k` sites the occupied set is a uniform `k`-subset, so the state is a site-percolation sample at `p = k/n`. Edges are never sampled; the random stream depends on `n`, not `m`.

### Message passing

Cavity messages solve `u[i→j] = Π_{k≠j}(1 − T + T u[k→i])`. The product is exact on a tree and is the Bethe approximation on a graph with cycles. The implementation uses prefix/suffix products, so one sweep is `O(n + m)`; it starts from zero to select the physical fixed point.

Next: [[Reproducibility]].
