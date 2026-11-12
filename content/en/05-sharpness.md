---
id: 05-sharpness
part: Rigorous core
order: 5
title: Sharpness and uniqueness
subtitle: Exponential decay below p_c, and one infinite cluster above it
reading: 13 min
---

Two theorems turn the definition of $p_c$ into a usable theory. The first says that below $p_c$ connectivity decays exponentially, so "no infinite cluster" is a strong statement about every length scale, not just about infinity. The second says that above $p_c$ there is exactly one infinite cluster, so "percolating" is a property of the whole system rather than of a lucky component. Both hold on $\mathbb{Z}^d$; the uniqueness theorem extends to transitive amenable graphs, while the sharpness theorem is stated here for the lattice. The proofs use completely different ideas.

## 5.1 Exponential decay

**Theorem 5.1 (Aizenman–Barsky 1987; Menshikov 1986).** Let $G=\mathbb{Z}^d$. For every $p<p_c(G)$ there exists $\psi(p)>0$ such that
$$
\theta_n(p)\le e^{-n\psi(p)}\quad\text{for all }n\ge1,
\qquad
\tau_p(0,x)\le e^{-\psi(p)|x|}\quad\text{for all }x,
$$
and consequently $\chi(p)<\infty$ and $\xi(p)<\infty$.

The bound is sharp in the sense that $\psi(p)\downarrow0$ as $p\uparrow p_c$. In the critical scaling regime the rate vanishes as $(p_c-p)^{\nu}$, with $\nu$ the correlation-length exponent; that power law is part of the scaling ansatz, not a consequence of the strict inequality. At $p_c$ itself the exponential bound fails, and the decay is a power law.

**How the proof goes.** Both proofs rest on a differential inequality for the cluster-size generating function. Write $G_p(z)=\sum_n\theta_n(p)z^n$ and let $G'_p(1)=\chi(p)$. The Aizenman–Barsky route differentiates the defining equation of $\theta_n$ with respect to $p$ and bounds the derivative by a quadratic expression in $G_p$ and $G'_p$, using the geometric fact that a cluster of size $n+m$ can be split at a pivotal edge into pieces of sizes $n$ and $m$. The resulting inequality
$$
\frac{d}{dp}\Big(\frac{1}{G_p(z)}\Big)\ \ge\ -C(z)
$$
integrates to a bound on $\theta_n$ that is exponential once $\chi(p)<\infty$. Menshikov's route is combinatorial: it shows that a cluster of size $n$ contains a "cone" of occupied sites of size comparable to $n$, and counts the number of ways such a cone can be built. The two arguments are different in technique and identical in conclusion, which is why the result is regarded as robust.

We do not reproduce either proof in full; both take several pages and neither is needed for the applications in this atlas. What is needed is the equivalence:

**Corollary 5.2.** For $G=\mathbb{Z}^d$ and $p<p_c$, the following are equivalent: $\chi(p)<\infty$; $\xi(p)<\infty$; $\theta_n(p)$ decays exponentially.

The equivalence is what makes the numerical criterion "$\chi$ diverges" a legitimate definition of the critical point (Theorem 3.6). Without Theorem 5.1, a divergent $\chi$ would only say that the mean cluster size is infinite, which could happen at a density below $p_c$ in a graph with heavy-tailed cluster sizes.

## 5.2 Uniqueness of the infinite cluster

**Theorem 5.3 (Burton–Keane 1989).** Let $G$ be a transitive amenable graph. For every $p$,
$$
\mathbb{P}_p\big(\text{there is at most one infinite open cluster}\big)=1 .
$$

**Proof sketch.** The argument has three ingredients.

*Ergodicity.* The number $N(\omega)$ of infinite open clusters is a translation-invariant measurable function, so it is almost surely constant on each ergodic component. On a transitive amenable graph the Bernoulli measure is ergodic under translations, hence $N\in\{0,1,2,\dots\}\cup\{\infty\}$ is a constant almost surely.

*Finite energy.* For a finite edge set $F$, let $\omega^F$ be the configuration obtained from $\omega$ by opening every edge of $F$. Conditional on the configuration outside $F$, the probability of seeing any prescribed pattern on $F$ is at least $\min(p,1-p)^{|F|}>0$. In particular, if opening $F$ would merge two infinite clusters of $\omega$, then this merge happens with conditional probability bounded below by a constant depending only on $|F|$ and $p$.

*No finite merge.* Suppose $N=k\ge2$ almost surely. Two distinct infinite clusters cannot be joined by a finite set of edges without changing $N$, so for every finite $F$ the event "opening $F$ reduces $N$" has probability zero. But a configuration with $k\ge2$ infinite clusters has infinitely many finite sets $F$ whose opening would merge two of them: take a large finite region meeting two of the clusters inside a single connected piece and shrink the connecting edge set until it is minimal. By finite energy and translation invariance, the probability that at least one such minimal $F$ succeeds is positive, contradicting the previous sentence.

The third step is the one that needs care, and it is where amenability enters: on a non-amenable graph the number of infinite clusters can genuinely be infinite (the $3$-regular tree at $p$ above the critical value has infinitely many infinite clusters, since distinct branches are independent). The complete proof is in Burton–Keane (1989); a textbook treatment is Grimmett (1999), §8.2. $\blacksquare$

**Corollary 5.4.** For $p>p_c$, almost every vertex belongs to the unique infinite cluster or to a finite cluster, and
$$
\mathbb{P}_p(0\leftrightarrow\infty)=\theta(p)
$$
for every choice of origin. In this regime the "percolating" event is translation invariant and has probability one conditionally on the origin being in the infinite cluster.

The second corollary is what licenses the renormalisation arguments of Chapter 4: once $\theta(p)>0$, one may speak of *the* infinite cluster and use its density as a macroscopic order parameter.

## 5.3 Continuity at the critical point

**Theorem 5.5 (Kesten 1980; RSW).** For bond percolation on $\mathbb{Z}^2$, $\theta(p_c)=0$ and $\theta$ is continuous at $p_c$. Moreover $\chi(p)\to\infty$ as $p\uparrow p_c$.

**Proof idea.** At $p_c$, duality gives $\mathbb{P}(A_n)+\mathbb{P}(B_n^\ast)=1$. RSW gives a uniform lower bound $\delta$ for the dual crossing probability $\mathbb{P}(B_n^\ast)$, hence a uniform upper bound $\mathbb{P}(A_n)\le1-\delta$ for the primal crossing. If $\theta(p_c)>0$, then by uniqueness and positive density the crossing probability would tend to one, contradicting the uniform upper bound. Hence $\theta(p_c)=0$. Continuity follows from the same estimates: the probability that the origin is connected to distance $n$ is bounded by a constant times the probability of a crossing of the annulus, which tends to zero as $n\to\infty$ uniformly for $p\downarrow p_c$. $\blacksquare$

The result is special to two dimensions in its proof, not in its statement: in high dimensions continuity at $p_c$ is known as part of the lace-expansion theory; in the intermediate dimensions that include $d=3,4,5$ it remains open. The contrast is worth keeping in mind when reading numerical claims about the order parameter: a discontinuous jump at $p_c$ would be visible in a simulation as a plateau, and no such plateau has ever been seen in three dimensions, but "not seen" is not "proved absent".

## 5.4 First-order transitions: the exception, not the rule

The continuity of the Bernoulli transition is not a universal law of nature; it is a theorem about independent percolation. Three mechanisms produce discontinuous transitions, and each is treated later in this atlas:

- **Correlated percolation.** Long-range positive correlations can produce a jump in the order parameter; the random-cluster model with $q$ large has a first-order transition for $q$ above a dimension-dependent threshold.
- **$k$-core percolation.** Requiring local redundancy rather than mere connectivity changes the transition to first order at $k\ge3$ (Chapter 10).
- **Coupled networks.** Two networks that depend on each other's giant component generate a cascade with a discontinuous jump (Chapter 10).

The lesson is that "percolation is continuous" is a statement about the independence of the bonds, not about connectivity as such. Any application that couples percolation to another dynamical process must check which regime it is in before assuming a continuous transition.

## 5.5 What sharpness buys

Three practical consequences follow from this chapter and are used repeatedly.

First, the finite-size scaling ansatz of Chapter 6 is justified: below $p_c$ all lengths are controlled by $\xi$, and above $p_c$ the infinite cluster is unique and dense, so the only remaining scale at $p_c$ is the system size.

Second, the numerical detection of $p_c$ by susceptibility divergence is legitimate, and its error bars can be estimated from the scaling of $\chi$ with $L$.

Third, the uniqueness theorem makes the "giant component" language of network science consistent with the lattice language: on a large finite graph, above the threshold there is one component of size $\Theta(N)$, and the second largest is $o(N)$. The statement is asymptotic; on a graph of $10^4$ vertices the second largest component can still be large enough to matter, which is a recurring source of confusion in applied papers.
