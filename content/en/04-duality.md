---
id: 04-duality
part: Rigorous core
order: 4
title: Duality, matching, and the exact thresholds
subtitle: From Harris to Kesten, and the star–triangle correction
reading: 18 min
---

Planar duality is the principal tool that produces exact thresholds, and it does so in two steps: first it converts a statement about open crossings into a statement about closed crossings, then a symmetry argument pins the critical point to the self-dual value. On the square lattice the two steps give $p_c=1/2$. On the triangular and honeycomb lattices a second ingredient, the star–triangle transformation, is needed. The derivation is in Section 4.4; the algebraic shortcut that looks plausible but gives the wrong root is explained there too.

## 4.1 The matching graph and the crossing lemma

**Definition 4.1.** Let $G$ be a graph embedded in the plane with locally finite faces. The **matching graph** $G^\dagger$ has one vertex in each face of $G$, and one edge crossing each edge of $G$, joining the two faces adjacent to it. $G$ is **self-dual** if $G^\dagger\cong G$ as planar graphs. The square lattice is self-dual; the triangular and honeycomb lattices are matched to each other.

**Lemma 4.2 (crossing duality, ★).** Let $\Lambda_n=[-n,n]^2$ and let $\Lambda_n^\dagger$ be the matching square. For every bond configuration $\omega$ on $\Lambda_n$, exactly one of the following holds:

- $A$: there is an open left–right crossing of $\Lambda_n$;
- $B^\ast$: there is a closed top–bottom crossing of $\Lambda_n^\dagger$.

**Proof.** Color every bond of $\Lambda_n$ open or closed, and draw the dual bond of $\Lambda_n^\dagger$ closed when the primal bond is open, open when the primal bond is closed. The two families of bonds therefore form a pair of complementary planar duals.

*At most one.* Suppose $A$ and $B^\ast$ both hold. The open left–right path $P$ and the closed top–bottom dual path $Q$ must cross at some primal edge $e$: the paths intersect as curves in the plane, and a crossing of a horizontal primal path with a vertical dual path occurs exactly at an edge. At that edge $e$ is open (because $P$ uses it) and closed (because $Q$ uses its dual), a contradiction.

*At least one.* Suppose $A$ fails. Consider the set $S$ of primal vertices reachable from the left side by open paths. Its edge boundary consists of closed edges: an edge from $S$ to $S^c$ cannot be open, or the endpoint would be in $S$. Walk along the boundary of $S$ from the top of the box to the bottom; the duals of the boundary edges form a closed dual path joining the top and bottom sides of $\Lambda_n^\dagger$. This is $B^\ast$. (If $S$ is empty the whole left side is closed, and the dual path runs along the left boundary.) $\blacksquare$

The lemma is the two-dimensional replacement for the absence of a "monotone coupling" in higher dimensions. Everything exact in $d=2$ starts here.

## 4.2 Why the self-dual point is $1/2$

**Proposition 4.3 (★).** For bond percolation on $\mathbb{Z}^2$ at $p=1/2$,
$$
\lim_{n\to\infty}\mathbb{P}_{1/2}\big(\text{open left–right crossing of }\Lambda_n\big)=\tfrac12.
$$
The convergence is not exact at finite $n$. Exact enumeration at $p=1/2$ gives $3/4$ on the $2\times2$ vertex box, $43/64=0.671875$ on the $3\times3$ box, and $82623/131072=0.63036\ldots$ on the $4\times4$ box. The sequence decreases slowly towards $1/2$; the identity is asymptotic, and it must not be used as a per-size calibration.

**Proof sketch.** Lemma 4.2 gives
$$
\mathbb{P}_p(A_n)+\mathbb{P}_p(B_n^\ast)=1
$$
for every $p$ and $n$. At $p=1/2$, colour exchange turns the closed top–bottom crossing $B_n^\ast$ of the dual box into an open top–bottom crossing. The dual box has side $2n$ faces, while $A_n$ lives on a $(2n+1)\times(2n+1)$ vertex box; the two crossing probabilities are therefore not equal at finite $n$, but their difference is a boundary term that vanishes as $n\to\infty$. RSW bounds both sequences away from $0$ and $1$, so every subsequential limit exists and is bounded away from the endpoints. The boundary term forces any such limit $\pi$ to satisfy $2\pi=1$, hence $\pi=1/2$; the full sequence converges to the same value. A complete proof identifies the limit through the Harris–Kesten theorem or Cardy's formula. $\blacksquare$

The finite-size values are the reason the benchmark in `data/benchmarks.json` reports the crossing rate with its sample count rather than asserting $1/2$. At $L=32,64,128$ the recorded rates at $p=1/2$ are $0.5275$, $0.5375$ and $0.505$; they approach $1/2$ but are not equal to it at any of these sizes.

What Proposition 4.3 does **not** give is $p_c=1/2$. It says that $p=1/2$ is a fixed point of the duality in the infinite-volume limit, not that it is the critical point. A model could in principle have a first-order transition elsewhere and still satisfy the limiting identity. Closing that gap is the Harris–Kesten theorem.

## 4.3 Harris–Kesten: the architecture

**Theorem 4.4 (Harris 1960; Kesten 1980).** For bond percolation on $\mathbb{Z}^2$, $p_c=1/2$.

The proof has two halves that use different machinery.

**Lower half, $p_c\ge1/2$ (Harris).** Suppose $\theta(1/2)>0$. Then there is an infinite open cluster with positive probability, and by the uniqueness theorem (Theorem 5.3, which does not depend on the value of $p_c$) it is almost surely unique. A standard consequence of uniqueness plus positive density is that the probability of an open left–right crossing of $\Lambda_n$ tends to $1$ as $n\to\infty$: the infinite cluster has positive density, so it meets both sides of a large box, and the crossing event fails only if the cluster is disconnected inside the box, an event of exponentially small probability. This contradicts the limit in Proposition 4.3, which forces the crossing probability to tend to $1/2$. Hence $\theta(1/2)=0$ and $p_c\ge1/2$.

The step from uniqueness to "crossing probability tends to one" is the only non-elementary ingredient; it is proved in Grimmett's *Percolation*, Chapter 8, and it is where the hypothesis of amenability enters. Everything else in the lower half is Proposition 4.3.

**Upper half, $p_c\le1/2$ (Kesten).** The engine is the RSW inequality.

**Theorem 4.5 (Russo 1978; Seymour–Welsh 1978).** There is a constant $\eta>0$ such that for all $p$ and all $n$,
$$
\mathbb{P}_p\big(\Lambda_n\text{ is crossed left–right}\big)\ \ge\ \tfrac12
\quad\Longrightarrow\quad
\mathbb{P}_p\big([0,3n]\times[0,n]\text{ is crossed left–right}\big)\ \ge\ \eta .
$$
The implication is the non-trivial direction of RSW: a square crossing with probability at least one half forces a long rectangle to be crossed with a probability bounded below independently of $n$. The proof is a coarse-graining argument. Place three overlapping $n\times n$ squares along the long rectangle. A left–right crossing of the long rectangle can be assembled from crossings of the three squares, and FKG turns a lower bound on the probability of each square crossing into a lower bound on the probability of the assembly. The constant $\eta$ depends only on the value $1/2$, not on $n$.

With RSW in hand, Kesten's argument has three steps. Take $p=1/2+\varepsilon$. First, duality and the Harris lower bound $p_c\ge1/2$ show that a closed dual crossing of a long rectangle has probability tending to zero; equivalently, the primal crossing probability of a long rectangle tends to one. Second, RSW gives a uniform lower bound for crossings of rectangles of every scale. Third, the standard ladder (renormalisation) argument converts these scale-uniform bounds into an infinite open path with positive probability, so $\theta(1/2+\varepsilon)>0$. Hence $p_c\le1/2+\varepsilon$ for every $\varepsilon>0$. The second and third steps are where the proof is long; the first is the part that uses duality at the critical point.

**Remark 4.6.** The proof has been simplified repeatedly. The route in Bollobás and Riordan (2006) uses the Friedgut–Kalai sharp-threshold theorem; it is conceptually cleaner but relies on a different heavy result. No proof is short. What matters for this atlas is the structure: duality gives the fixed point, RSW gives rigidity at the fixed point, and rigidity upgrades the fixed point to the critical point.

## 4.4 Matching pairs, the star–triangle transformation, and the corrected cubic

**Theorem 4.7 (matching relation).** Let $G,G^\dagger$ be a matching pair of periodic planar graphs, both amenable. Then
$$
p_c(G)+p_c(G^\dagger)=1 .
$$

**Proof idea.** A configuration of $G$ and its colour-exchanged dual configuration on $G^\dagger$ are complementary in the sense of Lemma 4.2. The planar separation argument upgrades the finite-box statement to the infinite one: $G$ has no infinite open cluster if and only if $G^\dagger$ has an infinite closed $\ast$-cluster. Translating "closed $\ast$-cluster at density $1-p$" into "open cluster at density $q$" gives the identity. The amenability hypothesis is needed to exclude the possibility that both sides fail to percolate with positive probability. $\blacksquare$

For the pair (triangular $T$, honeycomb $H$) this gives one equation. The second equation is the star–triangle identity, and it is here that the algebra must be done carefully.

**Theorem 4.8 (Sykes–Essam 1964; ★ algebra).** For bond percolation,
$$
p_c(T)=2\sin\frac{\pi}{18}=0.3472963553\ldots,\qquad
p_c(H)=1-2\sin\frac{\pi}{18}=0.6527036447\ldots .
$$

**Derivation.** Work on the triangular lattice at its critical point $p=p_c(T)$, and let $q=1-p$ be the density of closed bonds, which by the matching relation is the critical density of the honeycomb.

A star (a vertex with three bonds to three outer vertices) with bond probability $q$ connects all three outer vertices pairwise exactly when all three bonds are open, an event of probability $q^3$. A triangle with bond probability $p$ connects its three vertices pairwise whenever at least two of its three bonds are open, an event of probability
$$
3p^2(1-p)+p^3=3p^2-2p^3 .
$$
The star–triangle transformation identifies these two three-terminal networks at the critical point, so
$$
q^3=3p^2-2p^3 .
$$
Substituting $q=1-p$ gives
$$
(1-p)^3=3p^2-2p^3
\;\Longleftrightarrow\;
1-3p+3p^2-p^3=3p^2-2p^3
\;\Longleftrightarrow\;
p^3-3p+1=0 .
$$
The cubic has three real roots, $2\sin(10^\circ)$, $2\sin(50^\circ)$ and $-2\sin(70^\circ)$; only the first lies in $(0,1)$, so
$$
p_c(T)=2\sin\frac{\pi}{18}=0.34729635533\ldots,
\qquad
p_c(H)=1-p_c(T)=0.65270364466\ldots .
$$
Numerical check: with $p=0.34729635533386066$, $q^3=0.2780661432813856$ and $3p^2-2p^3=0.2780661432813855$, agreeing to the last bit of double precision. $\blacksquare$

**Why a plausible shortcut fails.** A tempting but incorrect route equates the triangle connectivity to the star *density*: $3p^2-2p^3=1-p$. That is not the three-terminal connectivity of a star; the star connects all three outer vertices only when all three of its bonds are open, which has probability $(1-p)^3$. The wrong equation gives the cubic
$$
2p^3-3p^2-p+1=(p-\tfrac12)(2p^2-2p-2)
$$
which has the root $p=1/2$ and two roots outside $(0,1)$. It therefore "predicts" the bond threshold $1/2$, which is actually the *site* threshold of the triangular lattice. The numerical difference is large ($0.3473$ versus $0.5$), and the fact that both numbers are often quoted in the same table is precisely why provenance matters. The correct cubic gives $2\sin 10^\circ$, in agreement with Sykes and Essam (1964).

**Remark 4.9 (the status of the Y–Δ step).** The identity $q^3=3p^2-2p^3$ is not a distributional equality of a single star and a single triangle: the two networks have different cycle structure and different connectivity distributions for the three boundary vertices. It is the $q_{\mathrm{RC}}\to1$ limit of the Yang–Baxter (star–triangle) relation for the random-cluster model, used at the level of the three-terminal connectivity function; $q_{\mathrm{RC}}$ is the random-cluster cluster weight, not the closed-bond density $q$ used above. Treating it as a local identity to be applied triangle by triangle is a common error and produces nonsense; it is a critical-point identity, and its rigorous justification for the bond problem is the content of the Sykes–Essam matching argument, later made rigorous by Wierman.

## 4.5 The triangular site threshold

**Theorem 4.10.** For site percolation on the triangular lattice, $p_c=1/2$.

**Argument (★ structure).** The triangular lattice is fully triangulated, so every face is a triangle and the matching graph of the site problem is the honeycomb with the roles of vertices and faces exchanged. The star–triangle transformation now acts on *sites*: a site of the triangular lattice with its six neighbours is dual to a hexagon of the honeycomb whose six sites are its duals. At density $p$, the probability that a site is open equals the probability that the corresponding hexagon is "blocked", and the fully triangulated structure makes the two events complementary. Hence
$$
\theta_T(p)>0\iff \theta_H^{\ast}(1-p)=0 ,
$$
and the self-dual point of the transformation is $p=1/2$. The rigorous version is due to Wierman (1981); see Grimmett (1999), §11.9, for a complete account. $\blacksquare$

Menshikov and Aizenman–Barsky prove sharpness of the phase transition, not the numerical value of this threshold; the two sets of results are often conflated in secondary accounts.

**Corollary 4.11.** If a planar graph $G$ contains the triangular lattice as a subgraph, then $p_c^{\text{site}}(G)\le1/2$, because adding edges and vertices cannot increase the threshold. There is no universal lower bound of this kind for arbitrary planar graphs: adding edges to the triangular lattice lowers the threshold, and planar graphs that contain a triangular sublattice can sit below $1/2$.

## 4.6 A threshold table with provenance

The table gives the values used throughout this atlas. "Exact" means a theorem; "numerical" means the best available Monte Carlo or transfer-matrix estimate, with the last digits uncertain. Values are quoted to the precision that is actually supported by the cited source; where sources differ in the last digit, the conservative value is given.

| Lattice | $z$ | Site $p_c$ | Bond $p_c$ | Status | Source |
|---|---|---|---|---|---|
| Chain | 2 | 1 | 1 | exact | trivial |
| Square $\mathbb{Z}^2$ | 4 | 0.59274605(3) | $1/2$ | bond exact, site numerical | Kesten 1980; Jacobsen 2014 |
| Triangular | 6 | $1/2$ | $2\sin(\pi/18)=0.3472963553$ | exact | Wierman 1981; Sykes–Essam 1964 |
| Honeycomb | 3 | 0.697043(3) | $1-2\sin(\pi/18)=0.6527036447$ | bond exact, site numerical | Sykes–Essam 1964; Jacobsen 2014 |
| Kagome | 4 | $0.6527036447$ | 0.5244053(3) | site exact, bond numerical | matching argument; Jacobsen 2014 |
| Simple cubic | 6 | 0.3116077(2) | 0.24881182(10) | numerical | Wang et al. 2013 |
| BCC | 8 | 0.2459(1) | 0.1803(1) | numerical | site van der Marck 1997; bond Lorenz–Ziff 1998 |
| FCC | 12 | 0.1992(1) | 0.1190(1) | numerical | site van der Marck 1997; bond Lorenz–Ziff 1998 |
| Diamond | 4 | 0.4299(2) | 0.3886(2) | numerical | van der Marck 1997 |
| Bethe lattice, degree $z$ | $z$ | $1/(z-1)$ | $1/(z-1)$ | exact | Hammersley 1957 |

Two entries deserve comment. The kagome site threshold equals the honeycomb bond threshold, $1-2\sin(\pi/18)$, and this is not a coincidence: the kagome lattice is the "line graph" of the honeycomb in the sense of the matching construction, so the site problem on one is the bond problem on the other. The equality of the two numbers to all displayed digits is a good test of any table one finds in the wild.

The three-dimensional values are the weakest entries: they are numerical, the error bars are in the last one or two digits, and different high-precision studies disagree at that level. They should be quoted with their error bars or not at all.

## 4.7 What not to infer

The table invites a false pattern: thresholds decrease as the coordination number increases. The pattern is real on average but useless quantitatively. The kagome lattice has $z=4$ and site threshold $0.6527$, while the square lattice has the same $z=4$ and site threshold $0.5927$; the difference comes from the ring structure, not the degree. Formulas of the type $p_c\approx 2/z$ or the Galam–Mauger interpolation reproduce the table to within a few percent on some lattices and fail badly on others. They are not theorems and should never be used to "predict" a threshold that matters. Chapter 11 lists the measurement traps that follow from this.
