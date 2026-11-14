---
id: 19-proofs
part: synthesis
order: 19
title: Proofs, algorithms and the status of a claim
subtitle: A rigorous appendix, with proof sketches clearly labelled
reading: 20 min
---

This atlas mixes three kinds of statement: theorems with complete proofs, theorems whose proofs are too long to reproduce but whose hypotheses and conclusions are stated, and numerical observations. Conflating them is the most common way a percolation argument goes wrong. This appendix states the main results, gives the short proofs, sketches the long ones, and gives the correctness argument for every algorithm in the reference library.

## 19.1 A status vocabulary

Every claim in the atlas carries one of four labels.

- **Theorem.** A proven statement. The proof is either written out here or cited to a specific theorem in a specific source.
- **Proof sketch.** The mechanism is correct and the missing step is a standard compactness, coupling or finite-volume argument. A sketch is not a substitute for a proof in a paper submission.
- **Numerical.** A value produced by a finite simulation with a stated seed, size and criterion. It is reproducible, not exact.
- **Conjecture.** A statement with strong evidence and no proof. Conjectures are labelled in the text, not quietly promoted.

The distinction matters because percolation has a large literature of exact thresholds, and a reader who cannot tell an exact value from an extrapolation will overstate the precision of an applied model.

## 19.2 Positive association: Harris and FKG

Let $\Omega=\{0,1\}^{E}$ with the product measure $\mathbb{P}_p$, and order configurations by inclusion. An event is increasing if adding open edges cannot destroy it; examples are “there is a left–right crossing” and “$|C(0)|\ge k$”.

**Theorem (Harris 1960; FKG 1971).** If $A$ and $B$ are increasing, then
$$
\mathbb{P}_p(A\cap B)\;\ge\;\mathbb{P}_p(A)\,\mathbb{P}_p(B).
$$

**Proof sketch.** Couple two configurations $\omega\le\omega'$ by the same uniforms: declare $e$ open in $\omega$ if $U_e\le p$ and in $\omega'$ if $U_e\le q$, with $p\le q$. This monotone coupling preserves the order. A pointwise inequality for monotone set functions on the Boolean lattice (the four-function argument of Harris, or the lattice argument of Fortuin–Kasteleyn–Ginibre) then gives the result. The key point is that the inequality is a statement about the measure, not about a particular graph.

Two consequences are used repeatedly. First, the probability of a crossing is increasing in $p$, so the critical point is well defined as a supremum. Second, if $A$ is increasing and $B$ is decreasing, the inequality reverses.

Harris's original application was a lower bound for $p_c$ on the square lattice. FKG turned the idea into a general tool for ferromagnetic systems.

## 19.3 Disjoint occurrence: the BK inequality

FKG compares events that may overlap. The BK inequality compares events that must occur on disjoint edge sets.

For increasing events $A$ and $B$, let $A\circ B$ be the event that there are disjoint sets of open edges witnessing $A$ and $B$. Then
$$
\mathbb{P}_p(A\circ B)\;\le\;\mathbb{P}_p(A)\,\mathbb{P}_p(B)
$$
(van den Berg and Kesten 1985). This is not true for general measures; it is a property of product measures and of the models obtained from them by the usual coupling arguments.

The standard use is the tail of the cluster size. If $\{|C(0)|\ge n\}$ occurs, one can split the cluster at a suitable edge into two disjoint crossing events; BK converts the resulting recursive bound into exponential decay for $p<p_c$. Sharpness theorems are built on this step.

## 19.4 Uniqueness of the infinite cluster

**Theorem (Burton and Keane 1989).** For Bernoulli percolation on an amenable transitive graph such as $\mathbb{Z}^d$, there is at most one infinite cluster almost surely, for every $p$.

**Proof sketch.** Suppose two infinite clusters were disjoint with positive probability. By finite energy, one can flip a finite set of edges to merge them without changing the probability by more than a constant factor. A local modification argument then shows that the number of infinite clusters cannot be a non-constant finite random variable, and an amenability argument rules out infinitely many. The complete argument is short but not trivial. The conclusion is false on a regular tree, where infinitely many infinite clusters coexist for a range of $p$: amenability is doing real work.

Uniqueness is what lets one speak of “the” infinite cluster and of the percolation probability $\theta(p)=\mathbb{P}_p(0\leftrightarrow\infty)$ without ambiguity.

## 19.5 Duality and exact thresholds

On the square lattice, the dual of a bond configuration is another bond configuration on the shifted lattice: an edge is open in the dual exactly when the primal edge is closed. For a box $\Lambda_n$, a left–right open crossing of $\Lambda_n$ exists iff there is no top–bottom closed crossing of the matching box $\Lambda_n^\dagger$. This gives the finite-box identity
$$
\mathbb{P}_{1/2}(A_n)+\mathbb{P}_{1/2}(B_n^\dagger)=1 .
$$
At $p=1/2$ colour symmetry makes $B_n^\dagger$ an open top–bottom crossing of the dual box. The dual box does not have the same vertex count as $\Lambda_n$, so the two probabilities are not equal at finite $n$; their difference is a boundary term. Taking $n\to\infty$ and using Proposition 4.3 gives $\mathbb{P}_{1/2}(A_n)\to1/2$. Harris used this limiting statement to prove $p_c\ge 1/2$; Kesten (1980) proved $p_c\le 1/2$ by a more delicate argument, so $p_c=1/2$ exactly. At finite $n$ the crossing probability is *not* $1/2$: exact enumeration gives $3/4$, $43/64$ and $82623/131072$ on the $2\times2$, $3\times3$ and $4\times4$ vertex boxes.

The triangular and honeycomb thresholds follow from the star–triangle transformation. The bond thresholds are
$$
p_c(\text{triangular})=2\sin\frac{\pi}{18}\approx0.347296,\qquad
p_c(\text{honeycomb})=1-2\sin\frac{\pi}{18}\approx0.652704,
$$
and the square value is $1/2$ (Sykes and Essam 1964; Wierman 1981). These are exact, not fits.

No such identity is known for site percolation on the square lattice; the numerical value $0.592746\ldots$ is not a closed form. The directed model has no duality at $p_c$, which is why its crossing probability at threshold is not $1/2$.

## 19.6 Sharpness, RSW and the critical window

Duality gives the threshold on special lattices; it does not show that the transition is sharp on a general graph. The modern route has three steps.

1. **RSW.** For Bernoulli percolation on the square lattice, crossing probabilities of rectangles are bounded above and below uniformly in the aspect ratio, at $p=1/2$ (Russo 1978; Seymour and Welsh 1978).
2. **Sharpness.** Aizenman and Barsky (1987) and Menshikov (1986) proved that for $p<p_c$ the cluster tail decays exponentially and $\chi(p)<\infty$, while $\theta(p)>0$ for $p>p_c$; in particular $\chi(p)\to\infty$ as $p\uparrow p_c$. Duminil-Copin and Tassion (2016) gave a short proof for transitive graphs using a differential inequality.
3. **Critical window.** Finite-size scaling predicts that the transition is rounded over a window of width $L^{-1/\nu}$. The exponent $\nu$ is not obtained from sharpness; in two dimensions it comes from conformal invariance, and in high dimensions from the lace expansion.

RSW is also the reason a finite box has a well-defined crossing probability: the bound is uniform in the shape, so the limit as the box grows exists along rectangles.

## 19.7 Mean field and high dimensions

Above the upper critical dimension $d_c=6$, the critical exponents are expected to take their mean-field values
$$
\beta=1,\quad \gamma=1,\quad \nu=1/2,\quad \Delta=2,
$$
with logarithmic corrections at $d=6$. Hara and Slade (1990) proved mean-field behaviour for sufficiently large $d$ using the lace expansion; Fitzner and van der Hofstad (2017) extended the proof to all $d>10$. The case $7\le d\le 10$ and the logarithmic corrections at $d=6$ are active research areas, not settled textbook material.

On a tree or a Bethe lattice the calculation is exact: the threshold is $p_c=1/(z-1)$ for degree $z$, and the exponents are mean-field. The tree is a useful check on any approximation, but it is not a model of a two-dimensional material.

## 19.8 Two-dimensional conformal invariance

Cardy's formula (1992) gives the left–right crossing probability of a critical rectangle with wired left and right sides:
$$
\Pi(\ell)=C\,m^{1/3}\,{}_2F_1\!\left(\frac13,\frac23;\frac43;m\right),
\qquad \ell=\frac{H}{W}=\frac{K(m)}{K(1-m)},
$$
where $C$ is a normalisation constant and $K$ is the complete elliptic integral. At $\ell=1$, $m=1/2$ and $\Pi=1/2$.

Smirnov (2001) proved conformal invariance for site percolation on the triangular lattice, which identifies the scaling limit with SLE$_6$; Lawler, Schramm and Werner computed the exponent values that follow. The formula is exact in the scaling limit. On a finite square lattice the measured crossing probability approaches it with a correction that vanishes as $L$ grows; the laboratory shows both the curve and the measured points rather than hiding the correction.

## 19.9 Correctness of the algorithms

The following statements are what the test suite checks; each is a small proof.

**Union–find.** Invariant: `find(x)` returns the root of the tree containing $x$, and `size[root]` is the number of elements in that tree. Union by size attaches the smaller root under the larger, so a root of size $s$ can only be attached to a root of size at least $s$; the depth is $O(\log n)$. Path halving makes every other node on the path point to its grandparent, which gives the inverse-Ackermann amortised bound when combined with union by size (Tarjan 1975).

**Hoshen–Kopelman.** Every site is visited once, and every edge between a site and an already visited neighbour is processed once. Two labels are unioned exactly when the corresponding components are connected by an open edge, so after the scan the label classes are the connected components. The scan is a spanning-forest construction, not an approximation.

**Newman–Ziff.** After the first $k$ edges of a uniform random permutation have been added, the open set is a sample from bond percolation at $p=k/m$. This is exact because a uniform permutation conditioned on its first $k$ elements gives a uniform $k$-subset. The maintained second moment satisfies $M_2\mapsto M_2+2ab$ when components of sizes $a$ and $b$ merge, so the reported susceptibility is exact for the sampled configuration, not an estimator of a different quantity.

**Leath growth.** Conditional on the seed being occupied, every edge incident to a visited site is tested once with the correct Bernoulli probability. An open edge to an unvisited site is explored; a closed edge is recorded as perimeter. By induction on the BFS order, the visited set is exactly the cluster of the seed. The only bias is the optional size cutoff, which truncates the tail.

**Bootstrap closure.** The update operator is monotone: if $S\subseteq T$, then $F(S)\subseteq F(T)$. A monotone operator on a finite lattice has a least fixed point, obtained by iterating from the initial set. The queue algorithm activates a site at the first round at which its active-neighbour count reaches $r$, so it computes that least fixed point; ties and update order cannot change the result.

**Invasion percolation.** The accepted edges form a tree: an edge is accepted only when it connects a visited site to an unvisited one, so no cycle is created, and every accepted site except the seed is reached by exactly one accepted edge. The greedy choice of the minimum boundary threshold is the definition of the process; the heap implements it exactly. The loop edges are discarded, not accepted.

**Achlioptas process.** The DSU state after each step is the component partition of the graph containing the edges chosen so far. The rule selects one of two candidates using only the current component sizes, so the trajectory is a deterministic function of the candidate sequence and the initial graph. The finite-size jump in $S_{\max}$ is a property of that trajectory; it is not evidence of a thermodynamic discontinuity, and the scaling check in the laboratory is there to make the distinction visible.

## 19.10 Statistical error and finite-size bias

A Monte Carlo estimate $\hat\pi$ from $n$ independent samples has standard error $\sqrt{\pi(1-\pi)/n}$. A 95% interval is $\hat\pi\pm1.96\,\mathrm{se}$ for large $n$; for small $n$ use a Wilson or Jeffreys interval, not the normal approximation. Hoeffding's inequality gives the distribution-free bound
$$
\mathbb{P}(|\hat\pi-\pi|\ge\epsilon)\le2e^{-2n\epsilon^2},
$$
which is useful when a guaranteed accuracy is needed.

Finite-size bias is a separate error. The crossing probability at $p_c$ converges to $1/2$ only after a correction of order $L^{-1/\nu}$; the pseudo-critical point extracted from the susceptibility peak is shifted by a term of the same order. A fit that ignores the correction will report an exponent that depends on the range of $L$ used. The correct protocol is to fit with a correction term, report the range, and show the residuals.

## 19.11 What is not known

- The exact site-percolation threshold of the square lattice is not known in closed form.
- The exact bond threshold in three dimensions is not known; the best numerical values have many digits but no proof.
- The critical exponents in three dimensions are not proven to take any particular rational values.
- The scaling limit of critical percolation in three dimensions is not constructed.
- The sharpness of the transition for all transitive graphs is not known in full generality.

Listing these is not a disclaimer; it is part of using the theory honestly. A numerical value in this atlas is never presented as a theorem, and a theorem is never presented without its hypotheses.

## 19.12 Reading the sources

The primary sources for this appendix are Grimmett's *Percolation* (1999) for the rigorous core, Bollobás and Riordan's *Percolation* (2006) for the modern probabilistic treatment, and the original papers cited above. The proofs in this chapter are sketches where the full argument would run to several pages; they are labelled as sketches. The algorithms are checked by executable tests, not by the prose: see `tests/js/algorithms.test.js`, `lib/python/tests/test_algorithms.py` and `data/golden/algorithms-v3.json`.

### A short shelf

If you want one rigorous book, take Grimmett's *Percolation*; if you want the modern probabilistic viewpoint with the proofs written for a graduate course, take Bollobás and Riordan. Stauffer and Aharony remains the quickest route into the physicists' language of exponents, and Sahimi's *Applications of Percolation Theory* is the bridge to porous media, composites and transport. Meester and Roy are the standard reference for continuum percolation; Hunt, Ewing and Ghanbarian go carefully from percolation to flow in real porous media.

For networks, Newman's *Networks* is the general text, Dorogovtsev's *Lectures on Complex Networks* the compact theoretical one, and Bianconi's *Multilayer Networks* the right starting point when one layer is not enough. Lyons and Peres is the rigorous reference for trees and branching processes; Kiss, Miller and Simon, and Keeling and Rohani, are the right next step for epidemics. Christensen and Moloney connect percolation to criticality without hiding the physics. Bunde and Havlin, Hughes, and Zallen are older books that still repay reading: they contain the arguments and the experimental context that modern reviews compress away.

Among reviews, Saberi (2015) and Li et al. (2021) are broad and well referenced; D'Souza et al. (2019) is the honest account of explosive percolation; Boccaletti et al. (2014) and Kivelä et al. (2014) cover multilayer networks from structure to dynamics. Isichenko (1992) is still the best long essay on percolation, statistical topography and transport in random media, and Berkowitz and Ewing (1998) is a compact introduction to the soil-physics applications.

These are reading suggestions, not a canonical list. The bibliography in the Sources view is the complete record, with a DOI or URL for every entry and a note where a DOI does not exist.
