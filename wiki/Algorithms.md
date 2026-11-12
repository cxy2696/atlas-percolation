# Algorithms

The site's **Algorithms** view has the full walkthrough for each routine: idea, steps, invariant, cost, code notes, pitfalls and tests. This page is the map.

All eight routines share:

- a CSR edge list with `n` sites and `m` edges;
- a DSU that owns the component partition and the counters;
- the xoshiro128** stream and the consumption order in `docs/RNG.md`;
- integer or exact-size parity checks, not only statistical comparisons.

## The eight routines

| Routine | Task | Main cost | Source |
|---|---|---|---|
| Bernoulli sampler | one configuration | `O(n + m α(n))` | `lib/js/engine/percolation.js`, `lib/python/percolation_atlas/percolation.py` |
| Union–find | components under edge insertions | `O(α(n))` amortised | `lib/js/engine/dsu.js` |
| Newman–Ziff | the whole curve from one edge order | `O(m α(n))` | `percolation.js`, `percolation.py` |
| Leath growth | one cluster, conditional on its seed | `O(|C| + boundary)` | `lib/js/engine/algorithms.js`, `algorithms.py` |
| Bootstrap | least fixed point of a threshold closure | `O(n + m)` | `algorithms.js`, `algorithms.py` |
| Invasion | greedy minimum-threshold growth | `O(m log m)` worst case | `algorithms.js`, `algorithms.py` |
| Achlioptas | two-choice edge process | `O(n α(n))` | `algorithms.js`, `algorithms.py` |
| k-core | largest induced subgraph with min degree `k` | `O(n + m)` | `lib/js/engine/network.js`, `network.py` |

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
| v3 algorithms | `data/golden/algorithms-v3.json`, `scripts/parity_algorithms.py` |
| Bootstrap fixed point | `tests/js/algorithms.test.js` (naive closure comparison) |
| Invasion tree | `tests/js/algorithms.test.js` |
| Leath extremes | `tests/js/algorithms.test.js` |
| k-core regression | `tests/js/engine.test.js` |

The prose walkthrough is in [`docs/ALGORITHMS.md`](https://github.com/cxy2696/atlas-percolation/blob/main/docs/ALGORITHMS.md); the interactive version is the site's **Algorithms** view.

Next: [[Reproducibility]].
