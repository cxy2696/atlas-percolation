---
id: 08-high-dimensions
part: Critical phenomena
order: 8
title: High dimensions and the lace expansion
subtitle: Mean-field behaviour, the triangle condition, and why six
reading: 14 min
---

Above six dimensions, percolation forgets its lattice. The exponents take their mean-field values, the order parameter is smooth at $p_c$, and the whole theory reduces to a branching process with corrections that can be bounded. The tool that proves this is the lace expansion, one of the few non-perturbative methods in critical phenomena. This chapter explains what the expansion is, why its convergence threshold is $d\ge11$ rather than $d>6$, and why the gap matters.

## 8.1 Mean-field from the Bethe lattice, done correctly

The Bethe lattice (Cayley tree) of degree $z$ is the $d\to\infty$ limit: no loops, so connectivity is a branching process. It is the one model where everything is exact.

**Bond percolation.** Each edge is open with probability $p$. Let $r$ be the probability that a given vertex, reached along an open edge, is connected to infinity through its descendants. The vertex has $z-1$ descendant edges, each open with probability $p$ and leading to a subtree that percolates with probability $r$, independently. Hence
$$
r=1-(1-pr)^{z-1},
$$
and the root is connected to infinity iff at least one of its $z$ edges is open and leads to a percolating subtree:
$$
\theta(p)=1-(1-pr)^{z}.
$$
The trivial solution $r=0$ is always present. A nonzero solution appears when the right-hand side has slope exceeding $1$ at $r=0$:
$$
\left.\frac{d}{dr}\big(1-(1-pr)^{z-1}\big)\right|_{r=0}=p(z-1)>1
\quad\Longleftrightarrow\quad
p>\frac{1}{z-1}.
$$
So $p_c=1/(z-1)$. For site percolation the recursion for an occupied vertex is $r=1-(1-pr)^{z-1}$ and the root probability is $\theta=p[1-(1-pr)^z]$; the extra factor $p$ cancels at the threshold, so $p_c=1/(z-1)$ again.

**Exponents.** Put $p=p_c(1+\delta)$ with $\delta>0$ small. Expanding the recursion to second order,
$$
r=(1+\delta)r-\frac{z-2}{2(z-1)}r^{2}+O(r^3)
\;\Longrightarrow\;
r\sim\frac{2(z-1)}{z-2}\,\delta,
$$
so $\theta\asymp zp_cr\asymp\delta$ and $\beta=1$. The mean cluster size is the expected progeny of a Galton–Watson process with mean $p(z-1)$:
$$
\chi=\sum_{n\ge0}\big(p(z-1)\big)^n=\frac{1}{1-p(z-1)}\sim\frac{1}{z-1}\cdot\frac{1}{p_c-p},
$$
so $\gamma=1$. At criticality the offspring distribution has mean one and finite variance, so the cluster size is in the domain of attraction of a stable law with $\mathbb{P}(|C_0|=n)\sim n^{-3/2}$, which gives $1+1/\delta=3/2$, i.e. $\delta=2$. Finally, the relation $\beta=\nu(d-2+\eta)/2$ at the upper critical dimension $d=6$ with $\eta=0$ gives $1=\nu\cdot 2$, so $\nu=1/2$; the correlation length behaves as $(p_c-p)^{-1/2}$, which can also be checked directly from the recursion. The fractal dimension is $d_f=d-\beta/\nu=6-2=4$.

**Why the Bethe lattice is not a lattice.** It has no cycles, so it is not a subgraph of $\mathbb{Z}^d$ for any finite $d$. Its exponents coincide with the mean-field values because the branching approximation becomes exact when loops are negligible, and loops are negligible above $d_c$. The coincidence is a theorem above six dimensions, not an analogy.

## 8.2 The triangle condition

Write $\tau_p$ for the two-point function. The **triangle condition** is
$$
\nabla(p_c)=\sum_{x,y\in\mathbb{Z}^d}\tau_{p_c}(x)\,\tau_{p_c}(y)\,\tau_{p_c}(x-y)<\infty .
$$
(Aizenman–Newman 1984; Barsky–Aizenman 1987 introduced it for percolation.) The name comes from the diagram: three propagators joining two vertices, i.e. a triangle in the dual representation, or a theta graph in the direct representation.

**Theorem 8.1 (Aizenman–Newman; Barsky–Aizenman).** If the triangle condition holds at $p_c$, then the mean-field exponents hold: $\beta=\gamma=1$, $\nu=1/2$, $\delta=2$, $\eta=0$, $d_f=4$, and $\theta$ is twice differentiable at $p_c$ with $\theta'(p_c)>0$.

The proof is a combination of the infrared bound (a Fourier-space inequality for $\tau$) with a differential inequality for $\theta$; it does not require the lace expansion. The triangle condition itself is what needs to be verified, and that is where the lace expansion enters.

**Why the condition is $d>6$.** Suppose the mean-field form $\tau(x)\asymp|x|^{-(d-2)}$ holds. Then $\hat\tau(k)\asymp|k|^{-2}$ and
$$
\nabla\asymp\int_{\mathbb R^d}\hat\tau(k)^3\,d^dk\asymp\int|k|^{-6}\,d^dk,
$$
which is finite exactly when $d>6$. At $d=6$ the integral diverges logarithmically; the divergence is the source of the logarithmic corrections to mean-field behaviour at the upper critical dimension.

The real-space version of the same count: the theta graph consists of three paths, each of scaling dimension $d-2$, joining two branch points. It is finite when $3(d-2)>2d$, i.e. $d>6$. For a self-avoiding walk the corresponding diagram has two paths and one loop, $2(d-2)>d$, giving the familiar $d_c=4$. The extra propagator is why percolation's upper critical dimension is two higher than the walk's.

## 8.3 The lace expansion

The lace expansion rewrites $\tau(x)$ as a sum over "laced" graphs — trees decorated with overlaps — and shows that the series converges when $d$ is large. The first term is the tree (mean-field) contribution; each additional lace costs a factor of order $1/d$.

**Theorem 8.2 (Hara–Slade 1990; Fitzner–van der Hofstad 2017).** For nearest-neighbour bond percolation on $\mathbb{Z}^d$ with $d\ge11$, the triangle condition holds at $p_c$ and the mean-field exponents obtain. Moreover
$$
\theta(p)=c_1(p-p_c)+c_2(p-p_c)^2+O\big((p-p_c)^3\big),\qquad c_1>0 .
$$

The history of the threshold is instructive. Hara and Slade proved the result for $d\ge19$ in 1990; Fitzner and van der Hofstad (2017) brought the threshold down to $d\ge11$. Each improvement required a sharper estimate on the lace expansion's remainder, not a new idea. The gap between $d>6$ (where the triangle condition should hold) and $d\ge11$ (where it is proved) remains open; closing it needs estimates that the current expansion does not supply.

**What the expansion does not do.** It gives no information about $p_c$ itself beyond its existence; it is a statement about exponents and about the smoothness of $\theta$. And it gives nothing at $d=6$, where the logarithmic corrections require a separate analysis (Hara–Slade's work at the upper critical dimension, and later refinements).

## 8.4 The three-dimensional problem

Three dimensions is where the theory is least complete and most needed: materials, porous media, biological tissues are three-dimensional. The numerical values are excellent and the rigorous values are absent. The best current estimates come from large-scale Monte Carlo with finite-size scaling:

$$
\frac1\nu=1.1410(15),\qquad
\frac{\beta}{\nu}=0.47705(15),\qquad
y_h=2.52295(15),\qquad
d_{\min}=1.3756(3),
$$
from Wang, Zhou, Zhang, Garoni and Deng (2013), with $L$ up to 512 and about $2.5\times10^7$ samples per size. Converting, $\nu=0.8764(1)$, $\beta=0.4181(1)$, $\gamma=\nu(2-\eta)=1.793(3)$, $\eta=-0.046(2)$, $\delta=5.29(1)$, $d_f=2.5229(1)$.

The internal consistency of these numbers (Chapter 6, Section 6.2) is impressive, and independent methods agree. But consistency is not proof: the exponents could in principle be the limit of a sequence of effective exponents that has not converged. No one believes this, but the belief is supported by the agreement of many methods rather than by a theorem.

## 8.5 The geometry above six dimensions

The statement $d_f=4$ at $d>6$ is strange at first: the cluster is a four-dimensional object living in a higher-dimensional space, so it is extremely sparse. Its structure has two parts: a **backbone** that carries the cycles and the current, and **dangling ends** attached to it. The dangling ends carry much of the mass but no current. This is why the conductivity exponent $t$ and the mass exponent $d_f$ are different quantities, and why the "anomalous" conductivity of percolation networks is not a small correction but a distinct phenomenon (Chapter 12).

The same two-scale picture explains the paradox that $\nu=1/2$ and $d_f=4$ coexist: the correlation length grows as $\varepsilon^{-1/2}$, the mass at that scale as $\xi^4=\varepsilon^{-2}$, and the percolation probability as $\xi^{-2}=\varepsilon$, which is $\beta=1$. Nothing is inconsistent; the cluster simply has two independent length scales once $d>6$.
