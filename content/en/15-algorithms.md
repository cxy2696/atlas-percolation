---
id: 15-algorithms
part: Methods
order: 15
title: Algorithms: from one sample to the whole curve
subtitle: Union-find, label propagation, edge sweeps, and what each one costs
reading: 15 min
---

A percolation experiment is a sequence of finite operations, and the choice of operation decides which questions are cheap. Drawing one configuration and finding its clusters, sweeping the whole coupling curve, and enumerating every configuration on a small strip are three different problems. This chapter gives the algorithms, their cost, and the mistakes that survive when the code is fast but the estimator is not.

## 15.1 The primitive operation

Almost every lattice algorithm reduces to maintaining connected components under edge insertions. Start with $n$ isolated sites. Each open edge either joins two components or does nothing. A cluster statistic is a function of the component sizes, so the data structure only has to answer two questions: *which component contains this site?* and *what is its size?* The disjoint-set union (DSU) answers both in amortised time that is effectively constant.

## 15.2 Union-find

Represent each component by a rooted tree. `find(x)` walks to the root; `union(a,b)` links the smaller root under the larger. Two optimisations matter.

- **Union by size (or rank).** The depth of a tree is at most $\lfloor\log_2 n\rfloor$, because a root of size $s$ is only attached to a root of size at least $s$.
- **Path compression.** Every `find` rewires the nodes on its path directly to the root. A node that is expensive once becomes cheap afterwards.

With both, a sequence of $m$ operations on $n$ elements costs $O(m\,\alpha(n))$, where $\alpha$ is the inverse Ackermann function; $\alpha(n)\le4$ for every $n$ that fits in the observable universe (Tarjan 1975). Path compression alone is not enough for the inverse-Ackermann bound, and union by size alone gives $O(\log n)$ per operation. The combination is what the four libraries implement.

```
find(x):
    r = x
    while parent[r] != r: r = parent[r]
    while parent[x] != r:
        next = parent[x]; parent[x] = r; x = next
    return r

union(a, b):
    ra = find(a); rb = find(b)
    if ra == rb: return false
    if size[ra] < size[rb]: swap(ra, rb)
    parent[rb] = ra
    size[ra] += size[rb]
    count -= 1
    max_size = max(max_size, size[ra])
    return true
```

The `max_size` and `count` fields are not part of the abstract DSU; they are maintained because every observable in this atlas needs them.

## 15.3 Hoshen–Kopelman labelling

The DSU is the engine; Hoshen–Kopelman is the scan that feeds it (Hoshen and Kopelman 1976). Visit the sites in row-major order. For each occupied site, inspect its already-visited neighbours (west and north on a square lattice). If none is occupied, assign a new label. If exactly one label is present, copy it. If two different labels are present, copy one and union the two labels in an equivalence table.

After the scan, each label points to a DSU root, and the cluster sizes follow from one pass over the labels. The cost is $O(n\,\alpha(n))$ for $n$ sites, with $O(n)$ memory. The method extends to any lattice once the neighbour list and the scan order are fixed; on a triangular lattice the neighbour list is larger, but each edge is still visited once, so the complexity does not change.

Two implementation details are easy to get wrong. First, the equivalence table must be compressed after the scan; a label that was merged into another label may still appear in the array. Second, for site percolation the empty sites must not be labelled at all, and for bond percolation every site is present but only open edges are unioned. Mixing the two conventions produces a plausible cluster picture with the wrong threshold.

## 15.4 Leath growth

Hoshen–Kopelman computes every cluster in the box. Leath's algorithm computes one cluster, the one containing a chosen seed (Leath 1976). Put the seed in a queue and mark it. Pop a site, inspect its neighbours, and enqueue each open neighbour that has not been visited. The output is the cluster and its perimeter; the cost is proportional to the number of sites and boundary edges actually touched, not to the volume of the box.

The algorithm is exact: conditional on the seed being occupied, it samples the cluster of the seed from the percolation measure, because every open neighbour is explored and every closed neighbour is recorded as a boundary. It is the right tool when the cluster is small compared with the box, and the wrong tool when the cluster wraps around the box, since the exploration then touches most of the lattice anyway.

Leath growth also gives the cluster-size distribution without counting all clusters. Run it from many independent seeds at fixed $p$, record the size of each cluster, and stop a run when the size exceeds a cutoff. The cutoff introduces a bias in the tail; report it rather than hiding it.

## 15.5 The Newman–Ziff sweep

A Monte Carlo study that loops over $p$ draws a fresh configuration at every $p$, so two nearby points on the curve come from different samples. Newman and Ziff (2000, 2001) remove the outer loop. Draw one random ordering of the $m$ edges. Add the edges one at a time. After $k$ edges the open set is a sample from bond percolation at $p=k/m$, and the samples at different $k$ are nested, not independent.

Maintain the DSU, the number of clusters $n_c$, the largest cluster $S_{\max}$, and the second moment
$$
M_2=\sum_{C}|C|^2 .
$$
Initially $M_2=n$, one singleton per site. When an edge joins components of sizes $a$ and $b$, the change is
$$
M_2\;\mapsto\;M_2+2ab,
$$
because the cross terms $2ab$ appear and the two old squares are replaced by $(a+b)^2=a^2+2ab+b^2$. The susceptibility proxy is $M_2/n$, and the mean cluster size is $M_2/n$ divided by the number of occupied sites; for bond percolation at $p=k/m$ the two differ only by the normalisation.

The whole sweep costs $O(m\,\alpha(n))$ time and $O(n+m)$ memory. It produces the entire curve $S_{\max}(p)$, $\chi(p)$, $n_c(p)$ from one edge order. The price is correlation: the point at $k+1$ differs from the point at $k$ by one edge, so the effective number of independent samples is much smaller than the number of plotted points. Error bars must be computed by blocking over independent edge orders, not by treating the $m$ points as independent.

## 15.6 Exact enumeration and transfer matrices

For small systems, exact enumeration is competitive and gives a check that no Monte Carlo can give. A strip of width $w$ and length $L$ has $2^{O(wL)}$ configurations if enumerated naively; the transfer matrix reduces this to $O(L)$ steps over a state space of size exponential in $w$. The state records the connectivity pattern of the open sites at the current cut, not the whole history. Each new column is added with its open/closed pattern, the connectivity is updated, and the crossing indicator is read at the end.

The transfer matrix is exact for the strip, and finite-width scaling extracts $p_c$ and exponents by comparing widths. The cost grows exponentially in $w$, so the method is limited to $w$ of order ten to twenty on a laptop. It is nevertheless the standard route to high-precision thresholds for two-dimensional strips and to exact checks of the star–triangle values.

## 15.7 What to use

| Task | Algorithm | Cost | Caveat |
|---|---|---|---|
| One configuration, all clusters | Hoshen–Kopelman | $O(n\,\alpha(n))$ | needs a full label pass |
| One cluster, rare event | Leath growth | $O(|C|)$ | biased if a cutoff is used |
| Whole $S_{\max}(p)$, $\chi(p)$ curve | Newman–Ziff | $O(m\,\alpha(n))$ | correlated points |
| Exact strip thresholds | transfer matrix | exponential in width | small widths only |
| Coupled networks | repeated giant-component search | $O(r(n+m))$ | number of rounds $r$ is data-dependent |

The first three are implemented in all four libraries; the fourth is a research tool and is not part of the reference API. The parity probes in `data/golden/parity.json` compare integer counts for a fixed seed, which is the only way to catch a disagreement in edge order or RNG consumption before it turns into a wrong exponent.

## 15.8 Beyond the core: bootstrap, explosive and invasion

Three further algorithms are implemented in the Python and JavaScript reference libraries and exposed in the laboratories. They answer different questions and should not be mixed with the Bernoulli sampler.

**Bootstrap percolation.** Occupied sites are active at time zero; an empty site activates when at least $r$ of its neighbours are active. The update is a monotone closure, so the final set is the least fixed point and is independent of the update order. The queue implementation activates each site at the first round in which its active-neighbour count reaches $r$, in $O(n+m)$ time. For $r=2$ the infinite-lattice threshold is zero, but a finite box fills above a crossover that depends on $L$; for $r=3$ and $r=4$ the threshold is positive. The distinction is visible in laboratory 10.

**Invasion percolation.** Each edge carries an i.i.d. threshold. From a seed, the cluster repeatedly accepts the lowest-threshold boundary edge that leads to an unvisited site. The accepted set is a spanning tree of the invaded region, and the greedy rule is the definition of the process, not an approximation to Bernoulli percolation. A binary heap gives $O(m\log m)$ in the worst case; in the boundary size $b$ this is often quoted as $O(b\log b)$. Loop edges are discarded; the laboratory labels this as loop rejection, not the trapping variant used for defending clusters in porous media.

**Achlioptas process.** At each step two candidate edges are drawn and the product (or sum) rule keeps the one whose endpoint components are smaller. On the complete graph this delays the giant component and produces a sharp finite-size jump. The jump is not a thermodynamic discontinuity: the product rule is continuous in the limit, as the scaling check in laboratory 11 shows. The implementation uses the same DSU and reports the trajectory as an exact function of the candidate sequence.

The three algorithms have a two-language parity contract (Python and JavaScript), recorded in `data/golden/algorithms-v3.json`. The four-language contract still covers the Bernoulli core. The correctness arguments are in Chapter 19, the instruments are laboratories 10–12, and the site's Algorithm reader links each invariant to the exact source file.

## 15.9 Reading the implementations

The JavaScript engine is the one the browser runs; the Python package is the readable reference; the C++ headers are the fast path; the Julia package is the typed path with the same public conventions. The edge order is fixed by `build_lattice`, the random stream by `docs/RNG.md`, and the DSU by the pseudocode above. A change to any of the three is a breaking change: regenerate the goldens, bump the version, and record the correction in Chapter 14.

The algorithms in this chapter are also the reason the atlas can show a live curve in a browser at all. A 128×128 lattice has 32 512 open-boundary edges; a Newman–Ziff sweep over that lattice is a few million DSU operations, which is well inside a frame budget when the sweep is chunked. The laboratories use the same code path as the libraries; there is no separate "demo" implementation to drift out of sync.
