# Reading the algorithm code

This note is a companion to the site's **Algorithms** view. It explains what
each routine is responsible for, where the real code lives, and which property
makes it correct. The source is the authority; this page is a map.

The shared conventions are:

- a lattice is a CSR edge list with `n` sites and `m` undirected edges;
- a DSU owns the component partition and the counters `count` and `maxSize`;
- the random stream is xoshiro128** with the consumption order documented in
  [`RNG.md`](RNG.md);
- a parity test compares integers and exact component sizes, not statistical
  summaries.

## 1. Bernoulli sampler

`lib/js/engine/percolation.js` · `lib/python/percolation_atlas/percolation.py`

The sampler walks sites (site mode) or edges (bond mode) in a fixed order and
draws one uniform per element. Closed elements still consume a draw. That is
why the stream position after `sample(p, rng)` is predictable and why the
four implementations can agree bit for bit.

The invariant is the obvious one, but it is worth stating: after the loop the
occupancy/open arrays are independent Bernoulli variables, and the DSU holds
the connected components of the occupied/open subgraph.

The usual mistakes are mixing the two modes, skipping draws for closed
elements, and using the number of occupied sites as the denominator of a bond
observable. Each changes the number while leaving the picture plausible.

## 2. Union–find

`lib/js/engine/dsu.js` · `lib/python/percolation_atlas/percolation.py` (`Dsu`)

`find` walks to the root and halves the path. `union` attaches the smaller
root under the larger and updates `size`, `count` and `maxSize`. The depth is
`O(log n)` from union by size alone; path halving adds the amortised
inverse-Ackermann bound. Either optimisation without the other is weaker, and
the code comments say so because it is a common claim in tutorials.

The DSU is not a cluster counter by itself: `count` and `maxSize` are
maintained inside `union` because every observable in the atlas needs them.
A separate pass over the roots is fine for a diagnostic, not for a hot loop.

## 3. Newman–Ziff

`newmanZiff` in `lib/js/engine/percolation.js` · `newman_ziff` in
`lib/python/percolation_atlas/percolation.py`

Shuffle the edge indices once. Add them one at a time. After `k` edges the open
set is a uniform `k`-subset, so it is a sample of bond percolation at
`p = k/m`. The nested samples are the point of the algorithm: one order gives
the whole curve.

When components of sizes `a` and `b` merge, `M₂` increases by `2ab`. That is
exact for the sampled configuration. The cost is `O(m α(n))` time and
`O(n + m)` memory. The price is correlation: points along one sweep are not
independent, so error bars need independent edge orders.

Two details are easy to get wrong: record the observables *after* the union,
and do not treat the `m` plotted points as `m` independent samples.

## 4. Leath growth

`leathCluster` in `lib/js/engine/algorithms.js` · `leath_cluster` in
`lib/python/percolation_atlas/algorithms.py`

Start at a seed. Test each edge incident to a visited site exactly once. An open
edge to an unvisited site is explored; a closed edge is perimeter. The visited
set is exactly the cluster of the seed, conditional on the seed being occupied.

The `tested` array is the guard that makes the cost proportional to the
touched boundary instead of the box. The optional `maxSize` cutoff truncates
the tail; it is a bias, not a neutral optimisation.

## 5. Bootstrap closure

`bootstrapActivation` in `lib/js/engine/algorithms.js` ·
`bootstrap_activation` in `lib/python/percolation_atlas/algorithms.py`

The update rule is monotone, so the final set is the least fixed point and is
independent of the order in which sites are considered. The queue version
keeps two frontiers: sites that became active in round `t`, and sites that
reach the threshold while processing that frontier. The second group is
activated in round `t+1`, never in `t`. That synchronisation is the whole
correctness argument.

For `r = 2` on the square lattice the infinite-lattice threshold is zero; a
finite box fills above a crossover that depends on `L`. For `r = 3` and `r = 4`
the threshold is positive. The instrument states this rather than treating the
finite-size onset as a material constant.

## 6. Invasion percolation

`invasionCluster` in `lib/js/engine/algorithms.js` · `invasion_cluster` in
`lib/python/percolation_atlas/algorithms.py`

Each edge has an i.i.d. threshold. A min-heap holds the boundary. Popping the
smallest key and accepting the edge when it reaches an unvisited site is the
definition of the process, not an approximation to Bernoulli percolation. The
accepted edges form a spanning tree of the invaded region.

Rejected loop edges are recorded once, through `loopSeen`; without that guard
an edge with two visited endpoints is pushed twice and the loop count roughly
doubles. The sequence of accepted thresholds is not monotone: a newly exposed
edge can be cheaper than the last accepted one. This is ordinary invasion with
loop rejection, not the trapping variant used for defending clusters.

## 7. Achlioptas process

`explosiveRandomGraph` and `explosiveSweep` in
`lib/js/engine/algorithms.js` · `explosive_random_graph` and
`explosive_sweep` in `lib/python/percolation_atlas/algorithms.py`

Two candidates are drawn; the product rule keeps the one whose endpoint
component sizes have the smaller product (the sum rule is the weaker control).
The DSU state after each step is the component partition of the chosen edges,
so the trajectory is a deterministic function of the candidate sequence.

The visible jump is a finite-size effect. The product rule is continuous in
the thermodynamic limit; the laboratory's scaling table is there to make that
distinction visible, not to sell a discontinuity. Duplicate candidate pairs
count as additions but do not merge components, and `q = steps / n` is the
right horizontal axis for this sampling scheme.

## Tests and goldens

| Claim | Check |
|---|---|
| RNG stream | `data/golden/rng-seed42.json` |
| core parity | `data/golden/parity.json`, `scripts/parity.py` |
| v3 algorithms | `data/golden/algorithms-v3.json`, `scripts/parity_algorithms.py` |
| least fixed point | `tests/js/algorithms.test.js` (naive closure comparison) |
| invasion tree | `tests/js/algorithms.test.js` (spanning-tree count) |
| Leath extremes | `tests/js/algorithms.test.js` (`p = 0`, `p = 1`) |

If you change an algorithm, change the golden file and the version, and say in
the changelog what moved. A change that "looks harmless" in the random order
will move every downstream number.
