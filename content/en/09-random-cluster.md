---
id: 09-random-cluster
part: Critical phenomena
order: 9
title: The random-cluster model
subtitle: One model that contains percolation, Ising, and Potts
reading: 10 min
---

The random-cluster (RC) model is percolation with a reward for forming clusters. It is the Fortuin–Kasteleyn representation of the $q$-state Potts model, and at $q=1$ it is ordinary percolation. Its value in this atlas is twofold: it gives a rigorous bridge between percolation and spin systems, and it supplies the algorithms (Swendsen–Wang, Edwards–Sokal) that made cluster updates standard in computational physics.

## 9.1 Definition

Let $G=(V,E)$ be finite. For $p\in[0,1]$ and $q>0$, put
$$
\phi_{p,q}(\omega)=\frac{1}{Z_G(p,q)}\,p^{|\omega|}(1-p)^{|E|-|\omega|}\,q^{k(\omega)},
\qquad
Z_G(p,q)=\sum_{\omega\in\{0,1\}^E}p^{|\omega|}(1-p)^{|E|-|\omega|}q^{k(\omega)},
$$
where $k(\omega)$ is the number of connected components of the open subgraph, counting isolated vertices. At $q=1$ the cluster weight disappears and $\phi_{p,1}$ is Bernoulli percolation. The parameter $q$ need not be an integer for the measure to make sense, but the spin interpretation requires $q\in\{2,3,\dots\}$.

## 9.2 The Potts correspondence

**Proposition 9.1 (★).** For integer $q\ge2$ and $\beta\ge0$, the $q$-state Potts partition function
$$
Z_{\text{Potts}}(\beta)=\sum_{\sigma\in\{1,\dots,q\}^V}\exp\Big(-\beta\sum_{e=(u,v)}\big(1-\delta_{\sigma_u\sigma_v}\big)\Big)
$$
equals $Z_G(p,q)$ exactly, with $p=1-e^{-\beta}$.

**Proof.** For a single edge, the identity
$$
e^{-\beta(1-\delta_{\sigma_u\sigma_v})}
=e^{-\beta}+\big(1-e^{-\beta}\big)\delta_{\sigma_u\sigma_v}
=(1-p)+p\,\delta_{\sigma_u\sigma_v}
$$
is a two-case check: the left side is $1$ when the spins agree and $e^{-\beta}$ when they differ. Multiplying over edges and expanding the product,
$$
\prod_{e\in E}\Big((1-p)+p\,\delta_{\sigma_u\sigma_v}\Big)
=\sum_{\omega\subseteq E}p^{|\omega|}(1-p)^{|E|-|\omega|}\prod_{e\in\omega}\delta_{\sigma_u\sigma_v}.
$$
Summing over $\sigma$, the product of deltas forces $\sigma$ to be constant on each connected component of $(V,\omega)$, and each component can take any of $q$ colours. There are $q^{k(\omega)}$ colourings, so
$$
Z_{\text{Potts}}(\beta)=\sum_{\omega\subseteq E}p^{|\omega|}(1-p)^{|E|-|\omega|}q^{k(\omega)}
=Z_G(p,q).
$$
No prefactor is needed: the Bernoulli weights and the cluster weight are already normalised by the same sum. $\blacksquare$

At $q=2$ this is the Ising model in its Fortuin–Kasteleyn form, and the percolation probability becomes the magnetisation: with wired boundary conditions, $\langle\sigma_0\rangle$ equals the probability that the origin is connected to the boundary. The correspondence is exact, not an analogy, and it is the reason percolation exponents can be computed from spin-model technology and vice versa.

## 9.3 Consequences

**Shared critical points.** The RC model has a phase transition at a value $p_c(q)$ that is the image of the Potts critical temperature. For $q=2$ on $\mathbb{Z}^2$, the self-dual point is $p_c=\sqrt2/(1+\sqrt2)=0.585786\ldots$, which corresponds to the Ising critical point $\sinh(2\beta_c)=1$ under $p=1-e^{-2\beta_c}$. The equality is a theorem, and it gives the Ising critical temperature on $\mathbb{Z}^2$ without a transfer-matrix calculation. The value $p=1/2$ is the $q=1$ (percolation) special case, not the Ising point.

**Monotonicity in $q$.** The RC measure is positively associated for $q\ge1$ and satisfies FKG, and the percolation probability is monotone in $p$. Increasing $q$ rewards cluster formation and can turn a continuous transition into a first-order one: the cluster reward favours a dense phase. The precise $q$-dependence of the transition order is model-dependent, and the statements below do not rely on a monotonicity in $q$.

**Duality.** On a planar graph the RC model has a dual model with transformed parameters; on the square lattice the self-dual curve is $p=\sqrt q/(1+\sqrt q)$, and at $q=1$ it reduces to $p\leftrightarrow1-p$. The duality relations are the RC generalisation of Lemma 4.2 and are the cleanest route to the $q$-dependent critical points on the square and triangular lattices.

## 9.4 Algorithms

The RC representation is behind two of the most useful algorithms in Monte Carlo physics.

**Swendsen–Wang (1987).** Given a spin configuration, form the Fortuin–Kasteleyn clusters by opening each edge with probability $p=1-e^{-J}$ when the two endpoint spins agree and never otherwise, where $J$ is the Potts coupling (for the Ising normalisation above, $J=2\beta$). Then assign a fresh random colour to each cluster. The resulting spin configuration is stationary for the Potts measure. The update is non-local: it can flip an entire correlated region in one step, which is why it beats single-spin Metropolis near a critical point.

**Edwards–Sokal (1988).** A joint update of spins and bonds that is a Gibbs sampler for the RC measure; it gives a systematic way to interpolate between the spin and cluster pictures and is the standard tool for measuring cluster observables.

Neither algorithm changes the physics; both change the correlation time. At a critical point the single-spin Metropolis algorithm suffers critical slowing down with dynamic exponent $z\approx2$, while cluster algorithms reduce $z$ substantially for Potts models. For percolation itself ($q=1$) the relevant algorithm is not Swendsen–Wang but the Newman–Ziff sweep of Chapter 11, which samples the whole coupling curve from one random edge order rather than from a Markov chain.

## 9.5 What the RC model does not solve

The RC model does not give the percolation threshold on a general lattice, because the $q=1$ model has no spin representation to solve. It does not give the full scaling limit in two dimensions except through the Coulomb-gas/SLE machinery, which is a separate development. And it does not make the three-dimensional exponents rigorous: the RC model at $q=1$ in $d=3$ is exactly as hard as percolation.

What it does give is a language. Statements about percolation that are awkward in the Bernoulli picture — boundary conditions, wired/free limits, cluster weights, the meaning of "conditioning on a connection" — become natural in the RC picture. Much of the rigorous technology in this atlas (FKG, the matching theorem, the sharpness proofs) can be phrased in the RC language and then specialised to $q=1$.
