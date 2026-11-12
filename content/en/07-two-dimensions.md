---
id: 07-two-dimensions
part: Critical phenomena
order: 7
title: Two dimensions: Cardy, Smirnov, SLE
subtitle: The one dimension with an exact conformal solution
reading: 19 min
---

In two dimensions the critical interface is a curve, and curves have an infinite-dimensional symmetry group: the conformal maps. At the critical point, that symmetry is enough to determine the scaling limit of the triangular-lattice model. This chapter follows the chain from Cardy's 1992 conjecture to Smirnov's 2001 theorem to the SLE description of Lawler, Schramm and Werner, and records the exact exponent set that comes out.

## 7.1 Why the interface is the right object

At $p_c$ the open cluster of the origin is a fractal with $d_f=91/48\approx1.896$, and its boundary is a random curve that fluctuates on every scale. Consider the exploration interface: start at a boundary point of a simply connected domain, and walk along the boundary between the open cluster touching one arc and the closed cluster touching the other. The walk is determined by the colouring, it can be generated without look-ahead, and its law is the object whose scaling limit we want.

Two properties of this walk are inherited from the lattice and survive the continuum limit:

- **Domain Markov property.** Conditioned on the interface up to time $t$, the law of the remaining configuration in the unexplored region is the same percolation law, with the boundary conditions transported by the interface.
- **Colour symmetry.** At $p=1/2$ swapping open and closed leaves the law invariant.

A random curve with these two properties and conformal invariance is an SLE; the parameter is fixed by locality, the continuum form of the domain Markov property together with colour symmetry. That gives $\kappa=6$.

## 7.2 Smirnov's theorem

**Theorem 7.1 (Smirnov 2001).** Let $\Omega$ be a simply connected domain with four marked boundary points $A,B,C,D$ in counterclockwise order, and let $\Omega_\delta$ be a discretisation by the triangular lattice with mesh $\delta$. For critical site percolation on $\Omega_\delta$, the probability that there is an open crossing from the arc $AB$ to the arc $CD$ has a limit as $\delta\to0$ which is conformally invariant, and for a rectangle of aspect ratio $\ell=H/W$ the limit is Cardy's formula.

**Proof architecture.** The proof has four steps, and each is worth knowing because together they are the template for every later result of this kind.

*Step 1: three observables.* For a point $z$ in the domain, let $H_1(z),H_2(z),H_3(z)$ be the probabilities that the interface from $z$ exits through the three boundary arcs determined by the marked points. They sum to one, and each is a harmonic-type function of $z$.

*Step 2: discrete Cauchy–Riemann.* On the triangular lattice the colour of a vertex determines the local move of the interface, and the three-colouring of the hexagonal dual makes the combination $H_1+\omega H_2+\omega^2H_3$ (with $\omega=e^{2\pi i/3}$) satisfy a discrete Cauchy–Riemann equation. This is the technical heart: the lattice is exactly the one on which the discrete holomorphic structure closes.

*Step 3: compactness.* RSW estimates give uniform bounds on the oscillation of the $H_i$ at all scales, so the family is precompact and a subsequence converges.

*Step 4: identification.* The limit is holomorphic, has the boundary values forced by the geometry, and is therefore unique. Cardy's formula is the solution of that boundary-value problem.

**Why the triangular lattice.** The discrete holomorphicity in Step 2 uses the fact that the triangular lattice and its hexagonal matching graph fit together so that every face is a triangle, and the interface has exactly three local choices. It is the triangular face structure, not self-duality, that makes the argument close. For the square lattice, or for a general planar lattice, the corresponding discrete object is not known to converge; conformal invariance of the scaling limit is still a conjecture there, supported by very strong numerics. This is the central open problem of the rigorous two-dimensional theory.

## 7.3 Cardy's formula, with the constants checked

Let $\ell=H/W$ be the aspect ratio of a rectangle, and let $\pi(\ell)$ be the probability that at criticality there is an open crossing from the left side to the right side. Cardy's formula is most cleanly written through the elliptic modulus $m\in(0,1)$ defined by

$$
\ell=\frac{K(m)}{K(1-m)},\qquad
K(m)=\int_0^{\pi/2}\frac{dt}{\sqrt{1-m\sin^2t}},
$$

where $K$ is the complete elliptic integral of the first kind. Then

$$
\pi(\ell)=\frac{3\,\Gamma(2/3)}{\Gamma(1/3)^2}\;m^{1/3}\;{}_2F_1\!\left(\frac13,\frac23;\frac43;m\right),
\qquad 0<\ell\le1,
$$

and for $\ell>1$ the symmetry $\pi(\ell)=1-\pi(1/\ell)$ is used. The modulus is not the aspect ratio: for $\ell=1$ one has $m=1/2$, and $m$ decreases rapidly as $\ell$ decreases. This is the point at which a tempting shortcut fails. Substituting $-\ell$ directly into the hypergeometric gives a different function, one that is far too flat at moderate aspect ratios; the correct argument is the modulus $m$, and the elliptic relation is what carries the geometry.

Three checks fix the constants and the orientation.

*Symmetry.* At $\ell=1$, $m=1/2$, ${}_2F_1(1/3,2/3;4/3;1/2)=1.1129126745\ldots$, $m^{1/3}=0.7937005260\ldots$, and $3\Gamma(2/3)/\Gamma(1/3)^2=0.5660466804\ldots$; the product is $0.5$ to machine precision. This is the self-duality identity of Proposition 4.3.

*Limits.* As $\ell\to0$, $m\to0$ and $\pi\to0$; as $\ell\to\infty$, $\pi\to1$. Both limits are consistent with the geometry: a very wide, short rectangle is unlikely to be crossed left–right, while a very tall one is almost surely crossed.

*Values.* $\pi(0.1)=4.0394890896\times10^{-5}$, $\pi(0.25)=0.0216300291$, $\pi(0.5)=0.1756468938$, $\pi(1)=0.5$, $\pi(2)=0.8243531062$, $\pi(4)=0.9783699709$, $\pi(10)=0.9999596051$. The steepness is real; it is why a simulation at a fixed narrow width needs large aspect ratios before the asymptotic curve is visible.

**Numerical evaluation.** The modulus is found by bisection on $m\in[0,1/2]$ using the arithmetic–geometric mean for $K$. Because the evaluation only needs $m\le1/2$, the hypergeometric series converges rapidly. The code in `lib/js/engine/cardy.js`, `lib/python/percolation_atlas/cardy.py`, `lib/cpp/include/percolation_atlas/cardy.hpp` and `lib/julia/src/cardy.jl` follows this route; the regression values above are part of the four test suites.

**Remark 7.2.** Two conventions circulate in the literature. Some authors take $\ell=W/H$ and the vertical crossing, which replaces $\pi(\ell)$ by $1-\pi(1/\ell)$; others use a cross-ratio or a nome instead of the modulus. The formula above gives $\pi(1)=1/2$ and $\pi(\infty)=1$ with $\ell=H/W$ and a left–right crossing. When comparing with a paper, check which convention is used before concluding that a factor is wrong.

## 7.4 SLE and the exponent set

**Definition 7.3 (chordal SLE$_\kappa$).** Let $B_t$ be a standard Brownian motion and $\xi_t=\sqrt\kappa\,B_t$. The Loewner flow in the upper half-plane is the solution of
$$
\partial_t g_t(z)=\frac{2}{g_t(z)-\xi_t},\qquad g_0(z)=z,
$$
and the SLE trace is $\gamma(t)=g_t^{-1}(\xi_t)$.

**Theorem 7.4 (Lawler–Schramm–Werner 2001).** The scaling limit of the critical percolation interface on the triangular lattice is SLE$_6$.

The parameter is fixed by the locality property: among all SLE$_\kappa$, only $\kappa=6$ has a law invariant under restricting the domain, up to time reparametrisation. (The restriction property is a different condition, associated with $\kappa=8/3$.) Locality is exactly the continuum version of the domain Markov property combined with colour symmetry, which percolation possesses at $p=1/2$.

From $\kappa=6$ the exponents follow by computing Brownian intersection exponents. The result is
$$
\beta=\frac{5}{36},\quad
\gamma=\frac{43}{18},\quad
\nu=\frac43,\quad
\delta=\frac{91}{5},\quad
\eta=\frac{5}{24},\quad
d_f=\frac{91}{48}=1.895833\ldots
$$

**Consistency check.** With these values,
$$
\gamma=(2-\eta)\nu=\frac{43}{24}\cdot\frac43=\frac{43}{18},\qquad
\beta=\frac{\nu(d-2+\eta)}{2}=\frac{4}{3}\cdot\frac{5}{24}\cdot\frac12=\frac{5}{36},
$$
$$
d_f=\frac{d+2-\eta}{2}=\frac{4-5/24}{2}=\frac{91}{48},\qquad
\delta=1+\frac{\gamma}{\beta}=1+\frac{43/18}{5/36}=\frac{91}{5}.
$$
All four relations close exactly, which is a strong indication that no digit is wrong.

The one-arm exponent is $\beta/\nu=5/48$:
$$
\mathbb{P}_{p_c}\big(0\leftrightarrow\partial\Lambda_n\big)\asymp n^{-5/48}=n^{-0.104166\ldots}.
$$
A reported exponent of $n^{-2/3}$ is not consistent with this value, and the discrepancy is easy to detect because $\beta/\nu$ must equal $5/48$ for the exponent set to be self-consistent. Chapter 14 records the correction history.

## 7.5 What the two-dimensional solution does and does not give

It gives the exponents, the crossing probabilities, the arm exponents, and the conformal invariance of the scaling limit — for the triangular lattice, and for lattices connected to it by star–triangle transformations. It gives, in principle, the full continuum description of the critical geometry.

It does not give the threshold on an arbitrary lattice. Cardy's formula is about the critical point; it says nothing about where the critical point is. The threshold remains a lattice-dependent quantity, known exactly for a handful of lattices (Chapter 4) and numerically for the rest.

It also does not give the full scaling limit of the *cluster* as a set, only of the interfaces. The collection of all interfaces — the "full scaling limit" — is described by the Brownian loop soup / CLE$_\kappa$ technology, which is a substantial theory in its own right. For the purposes of this atlas, the interface statement is enough: every exponent in the table follows from it, and every numerical check of two-dimensional percolation can be phrased as a check of the Cardy formula or of an arm exponent.

## 7.6 Numerical fingerprints

Three numbers identify critical two-dimensional percolation beyond reasonable doubt:

1. the crossing probability at $p_c$ equals $1/2$ at aspect ratio $1$ (and follows Cardy's curve for other aspect ratios);
2. the one-arm probability decays as $n^{-5/48}$;
3. the cluster-size distribution decays as $n^{-1-1/\delta}=n^{-96/91}=n^{-1.0549\ldots}$.

A simulation that reproduces (1) but not (2) has a finite-size problem; one that reproduces (2) but not (3) has a cluster-counting problem. The three together are a much stronger check than any single exponent fit, and the benchmark suite in this repository reports all three.
