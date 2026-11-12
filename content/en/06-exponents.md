---
id: 06-exponents
part: Critical phenomena
order: 6
title: Exponents, scaling relations, and universality
subtitle: What the numbers mean and which of them are theorems
reading: 17 min
---

At $p_c$ the correlation length diverges and the system loses its only length scale. Everything that remains is a power law, and the exponents of those power laws are the quantitative content of universality. This chapter defines them, derives the relations among them, and separates the exponents that are known exactly from those that are only known numerically.

## 6.1 Definitions

As $p\downarrow p_c$ (for $\theta$) and $p\to p_c$ from either side (for the rest):

$$
\theta(p)\sim(p-p_c)^{\beta},\qquad
\chi(p)\sim|p-p_c|^{-\gamma},\qquad
\xi(p)\sim|p-p_c|^{-\nu},
$$
$$
\mathbb{P}_{p_c}\big(|C_0|=n\big)\sim n^{-1-1/\delta},\qquad
\tau_{p_c}(x)\sim|x|^{-(d-2+\eta)},\qquad
M\sim R^{d_f}.
$$

The cluster-number density is $n_s(p)=\mathbb{P}_p(|C_0|=s)/s$; at criticality $n_s\sim s^{-\tau}$ with $\tau=2+1/\delta$. The fractal dimension $d_f$ describes the mass–radius relation of a critical cluster, the spectral dimension $d_s$ describes the return probability of a random walk on it, and $d_{\min}$ describes the shortest-path (chemical) distance.

The **one-arm probability** is the chance that the origin is connected to the boundary of a box of side $n$ at $p_c$:
$$
\pi_{\text{arm}}(n)=\mathbb{P}_{p_c}\big(0\leftrightarrow\partial\Lambda_n\big).
$$
It scales as $n^{-\beta/\nu}$. This identity is used constantly as a fingerprint. The two-dimensional value is $n^{-5/48}=n^{-0.10417\ldots}$; a frequently seen $n^{-2/3}$ is not consistent with the exponent set and is a useful diagnostic of a copied formula.

## 6.2 The table

| | $\beta$ | $\gamma$ | $\nu$ | $\delta$ | $\eta$ | $d_f$ | status |
|---|---|---|---|---|---|---|---|
| $d=1$ | 0 | 1 | 1 | $\infty$ | — | 1 | exact, degenerate |
| $d=2$ | $5/36$ | $43/18$ | $4/3$ | $91/5$ | $5/24$ | $91/48$ | theorem (SLE) |
| $d=3$ | 0.4181(1) | 1.793(3) | 0.8764(1) | 5.29(1) | $-0.046(2)$ | 2.5229(1) | numerical |
| $d=4$ | 0.639(2) | 1.44(2) | 0.689(2) | 3.26(2) | — | — | numerical |
| $d=5$ | 0.77(1) | 1.18(1) | 0.54(1) | — | — | — | numerical |
| $d\ge6$ | 1 | 1 | $1/2$ | 2 | 0 | 4 | theorem (nearest-neighbour $d\ge11$; spread-out $d>6$), logs at $d=6$ |
| Bethe | 1 | 1 | $1/2$ | 2 | 0 | 4 | exact |
| Directed, $1+1$D | 0.276486(8) | 2.277730(5) | 1.096854(4) | — | — | — | numerical, distinct class (ν = ν_⊥) |

The directed row refers to directed percolation in $1+1$ dimensions (one transverse dimension and one time direction); $\nu$ there is the transverse exponent $\nu_\perp$. The $2+1$-dimensional class has different values ($\beta\approx0.584$, $\nu_\perp\approx0.733$); the table lists the $1+1$-dimensional class because that is the one the interactive directed lattice uses. The $d=1$ row is the lower critical dimension: the threshold is at $p=1$, the cluster is a segment, and the hyperscaling relations below degenerate (they are stated for $d\ge2$). The two-dimensional row is the only one that is simultaneously exact and non-mean-field. It comes from the SLE description of the scaling limit (Chapter 7), and every entry can be checked against the relations below, which is how the table should be read: not as six independent numbers but as a small set constrained by consistency.

For $d=3$ the values above are those of Wang, Zhou, Zhang, Garoni and Deng (2013), obtained from $L\le512$ with about $2.5\times10^7$ samples per size. They are quoted with the precision the method supports; the third decimal is not stable across methods.

**Consistency check for $d=3$.** With $\nu=0.8764$:
$$
\delta=1+\frac{\gamma}{\beta}=1+\frac{1.793}{0.4181}=5.288,\qquad
\eta=2-\frac{\gamma}{\nu}=2-\frac{1.793}{0.8764}=-0.0457,
$$
$$
d_f=d-\frac{\beta}{\nu}=3-0.4771=2.5229,\qquad
\frac{d+2-\eta}{2}=\frac{5.0457}{2}=2.5229 .
$$
All four relations close to the quoted precision. This is not a proof of the values, but a set of values that fails these checks is certainly wrong.

## 6.3 The scaling relations

The relations below are not independent theorems; they follow from a scaling ansatz. Each derivation is labelled with what it assumes.

**Relation 1: $d_f=d-\beta/\nu$ (★, scaling ansatz only).** At the pseudo-critical point of a box of side $L$, the effective distance from criticality is $\varepsilon\sim L^{-1/\nu}$, so the percolation probability is $\theta\sim L^{-\beta/\nu}$. It is also the probability that a given site lies in the largest cluster, whose mass is $\sim L^{d_f}$; hence $\theta\sim L^{d_f-d}$. Equating the two gives $d_f=d-\beta/\nu$. $\blacksquare$

**Relation 2: $\gamma=(2-\eta)\nu$ (★, scaling ansatz only).** By definition
$$
\chi=\sum_x\tau(x)\asymp\int_{\mathbb R^d}|x|^{-(d-2+\eta)}e^{-|x|/\xi}\,dx
=\xi^{2-\eta}\int|u|^{-(d-2+\eta)}e^{-|u|}\,du .
$$
The integral is a finite constant, so $\chi\asymp\xi^{2-\eta}$. With $\chi\sim\varepsilon^{-\gamma}$ and $\xi\sim\varepsilon^{-\nu}$, $\gamma=(2-\eta)\nu$. $\blacksquare$

**Relation 3: Fisher, $d_f=(d+2-\eta)/2$ (hyperscaling, $d\le d_c$).** This is not an independent density matching, and the naive comparison of $r^{d_f-d}$ with $\tau(r)$ gives the wrong exponent $2-\eta$. The relation follows from Relations 1, 2 and 5. Josephson's relation $d\nu=2\beta+\gamma$ and Relation 2, $\gamma=(2-\eta)\nu$, give
$$
\beta=\frac{\nu(d-2+\eta)}{2}.
$$
Substituting this into Relation 1,
$$
d_f=d-\frac{\beta}{\nu}=d-\frac{d-2+\eta}{2}=\frac{d+2-\eta}{2}.
$$
The relation is hyperscaling: it fails above $d_c=6$, where $d_f=4$ stays fixed while $(d+2)/2$ grows. $\blacksquare$

**Relation 4: $\delta=1+\gamma/\beta$ (Widom; standard scaling argument).** Assume the cluster-number scaling form
$$
n_s(p)=s^{-\tau}f\big(s/s^\ast\big),\qquad s^\ast\sim\varepsilon^{-1/\sigma},\qquad \tau=2+\frac1\delta,\quad \sigma=\frac1{\beta\delta}.
$$
Then
$$
\theta(p)\asymp\sum_{s>s^\ast}s\,n_s\asymp (s^\ast)^{2-\tau}=(s^\ast)^{-1/\delta}\sim\varepsilon^{\beta},
$$
which is consistent with the definition of $\beta$, and
$$
\chi(p)\asymp\sum_{s<s^\ast}s^2n_s\asymp(s^\ast)^{3-\tau}=(s^\ast)^{1-1/\delta}\sim\varepsilon^{-\beta(\delta-1)} .
$$
Comparing with $\chi\sim\varepsilon^{-\gamma}$ gives $\gamma=\beta(\delta-1)$, i.e. $\delta=1+\gamma/\beta$. $\blacksquare$

**Relation 5: Josephson, $d\nu=2\beta+\gamma$ (hyperscaling, $d\le d_c$).** The free-energy analogue of percolation scales as $\xi^{-d}$, and its second derivative with respect to the field conjugate to the order parameter is $\chi$. Dimensional analysis gives $d\nu=2\beta+\gamma$. Two-dimensional check: $d\nu=8/3$ and $2\beta+\gamma=10/36+43/18=8/3$. Mean-field check at $d=6$: both sides equal $3$. Above six dimensions the left side grows with $d$ and the right side does not, which is precisely the failure of hyperscaling. $\blacksquare$

The pattern is worth stating plainly: Relations 1 and 2 are bookkeeping and hold whenever the scaling ansatz does. Relations 3 and 5 are hyperscaling and hold only at or below the upper critical dimension. Relation 4 is a bookkeeping identity for the cluster-size distribution. None of them is a proof of any exponent; they are constraints that any candidate set must satisfy.

## 6.4 Why the upper critical dimension is six

The upper critical dimension is the dimension above which mean-field exponents become exact. For self-avoiding walks it is four; for percolation it is six. The difference is a counting argument about loops, and it is worth doing carefully because the counting is easy to state too loosely.

Consider the two-point function at criticality. In mean-field theory $\tau(x)\asymp|x|^{-(d-2)}$, so its Fourier transform behaves as $\hat\tau(k)\asymp|k|^{-2}$. The corrections to mean-field theory are organised by the **triangle (bubble) diagram**
$$
\nabla=\sum_{x,y}\tau(x)\,\tau(y)\,\tau(x-y),
$$
which counts three paths joining two branch points, i.e. a theta graph. In Fourier space this is $\int\hat\tau(k)^3\,d^dk\asymp\int|k|^{-6}\,d^dk$, which converges exactly when $d>6$. When it converges, the lace expansion can be organised as a convergent series and the mean-field exponents follow; when it diverges, the series does not control the critical behaviour.

The same counting in position space: each of the three paths contributes a factor of dimension $d-2$, and the two branch points contribute $2d$; the diagram is finite when $3(d-2)>2d$, i.e. $d>6$. For a self-avoiding walk the analogous diagram has two paths and one loop, $2(d-2)>d$, giving $d_c=4$. The extra path is what raises six above four.

At $d=6$ exactly, $\int|k|^{-6}$ diverges logarithmically, and the mean-field picture survives only with logarithmic corrections to the scaling forms. The exponents are the mean-field ones, but the amplitudes carry logarithms; the coefficients require a separate renormalisation-group calculation.

## 6.5 The status of universality

Universality is the claim that the exponents depend only on the dimension (and on symmetries), not on the lattice. Its status differs sharply by dimension.

**Two dimensions: theorem for the triangular lattice and its star–triangle relatives.** For critical site percolation on the triangular lattice, the scaling limit is conformally invariant and the interfaces converge to SLE$_6$ (Chapter 7), which fixes the exponents. The same exponent set is expected on every periodic planar lattice in the same universality class, but conformal invariance of the scaling limit for a general planar lattice is still a conjecture, supported by extensive numerics. This is the most important open problem in the rigorous two-dimensional theory and is discussed in Chapter 13.

**Above six dimensions: theorem.** Lace expansion proves mean-field behaviour for $d\ge11$ for nearest-neighbour bond percolation (Fitzner–van der Hofstad 2017), with Hara and Slade's earlier $d\ge19$ threshold (1990). The result includes the values $\beta=\gamma=1$, $\nu=1/2$, $\delta=2$, $\eta=0$, $d_f=4$ and the behaviour $\theta(p)=c_1(p-p_c)+c_2(p-p_c)^2+O((p-p_c)^3)$ for $p>p_c$, with $c_1>0$; $\theta$ is $C^2$ on $(p_c,1]$ and has one-sided right derivatives at $p_c$.

**Three to five dimensions: no proof.** The exponents in the table for $d=3,4,5$ are numerical. They are extremely well constrained — the relations of Section 6.3 hold to the quoted precision, and independent methods (Monte Carlo, conformal bootstrap where applicable, functional renormalisation group) agree — but they are not theorems. Any statement that "the three-dimensional percolation exponents are known" is, strictly, a statement about numerics.

**Bethe lattice: exact.** The mean-field exponents are computed exactly in Chapter 8 by solving the branching-process recursion. The Bethe lattice is the $d\to\infty$ limit and the reference point against which the finite-dimensional numbers are compared.

## 6.6 Reading exponents off data

The exponents are defined as limits as $\varepsilon\to0$ and $L\to\infty$, and neither limit is available in a simulation. The practical consequence is that a naive log–log fit gives an effective exponent that drifts with the fit window. A susceptibility fit at a single size can look stable while its slope changes by a factor of two across the critical region; Chapter 11 explains how to detect the drift and what to report instead.

The correct procedure has three parts. Use a scaling ansatz with corrections to scaling, $A(p,L)=L^{y}\mathcal A\big((p-p_c)L^{1/\nu}\big)\big(1+cL^{-\omega}\big)$; fit all sizes simultaneously; and report a confidence interval from resampling rather than a single number. The benchmark data in `data/benchmarks.json` is produced this way, and the fit residuals are part of the published record, not an afterthought.
