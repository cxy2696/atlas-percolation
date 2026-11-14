---
id: 22-trees
part: bridges
order: 22
title: Trees, generating functions, and message passing
subtitle: Exact percolation on branching structures, and what sparse networks inherit
reading: 17 min
---

Every exact calculation in this atlas that is not two-dimensional is a calculation on a tree. The Bethe lattice is the cleanest of them, but it is not the only one: a sparse random graph looks like a tree in the neighbourhood of a typical vertex, and the configuration model inherits the tree answer *globally* because its giant component is born by branching. This chapter derives the three equations that do most of the work — the branching recursion, the generating-function fixed point, and the message-passing system — and states precisely when each is exact and when it is only a local approximation.

## 22.1 Bond percolation on a Galton–Watson tree

Let $T$ be a Galton–Watson tree: the root has $K$ children with $\mathbb{P}(K=k)=p_k$, and every other vertex has an independent copy of the same offspring law. Write
$$
f(s)=\sum_{k\ge0}p_k s^k,\qquad m=f'(1)=\mathbb{E}K
$$
for the offspring generating function and its mean, and assume $m>1$ so that the tree is infinite with positive probability. Put bond percolation with retention probability $p$ on the edges.

Let $u$ be the probability that the open cluster of a vertex, *restricted to its descendant subtree*, is finite. The vertex itself is present. Each child branch is finite if either the edge to that child is closed (probability $1-p$) or it is open and the child's descendant cluster is finite (probability $p\,u$). The branches are independent given the vertex, so
$$
u=f\big(1-p+p\,u\big). \tag{22.1}
$$
The root has the same offspring law, so its cluster is finite with probability $u$ as well:
$$
\theta(p)=1-u,\qquad u=f(1-p+pu). \tag{22.2}
$$
The fixed point $u=1$ always solves (22.1) and gives $\theta=0$. A second solution in $[0,1)$ exists exactly when the map $g(u)=f(1-p+pu)$ has slope greater than one at $u=1$:
$$
g'(1)=p\,f'(1)=p\,m>1
\quad\Longleftrightarrow\quad
p>\frac1m .
$$
Hence
$$
p_c(T)=\frac{1}{m}. \tag{22.3}
$$
This is the whole mean-field theory in three lines. For the $z$-regular tree the root has $z$ neighbours and every other vertex has $z-1$ forward neighbours; the forward recursion is
$$
u=\big(1-p+pu\big)^{z-1},\qquad
\theta(p)=1-\big(1-p+pu\big)^{z}, \tag{22.4}
$$
and $p_c=1/(z-1)$, the value quoted in Chapters 4 and 8. The two forms differ only in the root's degree; both are exact on their respective trees. For $z=2$ the tree is a chain: $p_c=1$, and at $p=1$ the chain is fully open with $\theta=1$. The endpoint is the one place where the "critical means $\theta=0$" shorthand needs the obvious exception.

**Mean cluster size.** The expected number of vertices at distance $n$ from the root is $m^n$ in the tree, and each is connected to the root with probability $p^n$. Hence
$$
\chi(p)=\sum_{n\ge0}(pm)^n=\frac{1}{1-pm},\qquad p<p_c, \tag{22.5}
$$
which diverges as $p\uparrow p_c=1/m$ with exponent $\gamma=1$. On the $z$-regular tree the count at distance $n\ge1$ is $z(z-1)^{n-1}$, so $\chi=1+zp/(1-p(z-1))$; the divergence is the same.

## 22.2 The cluster generating function

Let $H(s)=\sum_{n\ge1}\mathbb{P}(|C_0|=n)\,s^n$ be the generating function of the open cluster of the root. The root contributes $s$; each child branch contributes either nothing (edge closed, factor $1-p$) or a cluster with generating function $H(s)$ (edge open, factor $p\,H(s)$). Independence over children gives the functional equation
$$
H(s)=s\,f\big(1-p+p\,H(s)\big). \tag{22.6}
$$
Setting $s=1$ recovers (22.2), since $u=H(1)$ is the probability that the cluster is finite. Differentiating at $s=1$ and writing $\chi=H'(1)$ gives
$$
\chi=1+p\,f'(1)\,\chi=\frac{1}{1-pm},
$$
in agreement with (22.5).

At $p=p_c$, for a finite-variance offspring law, the equation has a double root at $s=1$, and a standard singularity analysis of (22.6) gives
$$
\mathbb{P}(|C_0|=n)\sim C\,n^{-3/2},\qquad
n_s(p_c)=\frac{\mathbb{P}(|C_0|=s)}{s}\sim C\,s^{-5/2}.
$$
Comparing with the definitions $\mathbb{P}(|C_0|=n)\sim n^{-1-1/\delta}$ and $n_s\sim s^{-\tau}$ gives $\delta=2$ and $\tau=5/2$, the mean-field values. The square-root singularity is the tree's substitute for a phase transition with a divergent correlation length: there is no length scale at all, only a generation count.

## 22.3 Sparse graphs and the local tree limit

The configuration model fixes a degree sequence $(k_1,\dots,k_N)$ with $\sum_i k_i=2M$ and pairs the $2M$ stubs uniformly at random. Choose a vertex uniformly and look at its neighbourhood out to a fixed radius $r$. With probability tending to one as $N\to\infty$, that neighbourhood is a tree, and the root has offspring distribution
$$
q_k=\frac{(k+1)\,p_{k+1}}{\langle k\rangle}, \tag{22.7}
$$
the size-biased law: a neighbour of a random vertex has one edge already used, and its remaining $k$ edges are distributed as $q_k$. The convergence is the *local weak convergence* of Benjamini and Schramm (2001); a textbook treatment is in van der Hofstad (2017).

Local convergence is not enough to determine a global event such as percolation on $\mathbb{Z}^d$. It is enough for the configuration model because the giant component is created by a branching instability, and the cycles that would correct the branching count are rare at the scale of the emerging component. Under a finite-second-moment condition, the Molloy–Reed criterion is exact: a giant component exists iff
$$
\frac{\langle k^2\rangle-\langle k\rangle}{\langle k\rangle}>1 .
$$
Durrett (2007) and Janson, Łuczak and Ruciński (2000) give the precise statements and the critical-window behaviour.

## 22.4 The generating-function solution of the configuration model

Let
$$
G_0(x)=\sum_{k\ge0}p_k x^k,\qquad
G_1(x)=\frac{G_0'(x)}{G_0'(1)}=\sum_{k\ge1}\frac{k\,p_k}{\langle k\rangle}x^{k-1}
$$
be the degree generating function and its size-biased counterpart. Add bond percolation with retention $T$ (the letter $p$ is reserved for the occupation probability of the lattice chapters; $T$ is the transmissibility of Chapter 23).

Define $u$ as the probability that a vertex reached by following an edge is *not* connected to the giant component through that edge. Its $k-1$ other edges are distributed as $G_1$; each is either not retained (probability $1-T$) or retained and fails to continue (probability $T u$). Therefore
$$
u=G_1\big(1-T+T u\big). \tag{22.8}
$$
The probability that the root is not in the giant component is the same expression with the root's degree law $G_0$:
$$
S(T)=1-G_0\big(1-T+T u\big),\qquad u=G_1(1-T+Tu). \tag{22.9}
$$
Equation (22.9) is the standard configuration-model solution (Newman 2002); it is exact in the limit $N\to\infty$ under the same finite-second-moment conditions as Molloy–Reed.

**Threshold.** Linearise (22.8) at $u=1$: the derivative of the right side is $T\,G_1'(1)$, and
$$
G_1'(1)=\frac{G_0''(1)}{G_0'(1)}
=\frac{\langle k^2\rangle-\langle k\rangle}{\langle k\rangle}=\kappa-1 .
$$
A nontrivial solution appears when $T(\kappa-1)>1$, i.e.
$$
T_c=\frac{1}{\kappa-1},\qquad \kappa=\frac{\langle k^2\rangle}{\langle k\rangle}. \tag{22.10}
$$
At $T=1$ this is the Molloy–Reed condition $\kappa>2$. Equation (22.10) is the same threshold derived in Chapter 10 by a first-moment argument; the generating function supplies the giant-component size as well.

**Erdős–Rényi check.** For Poisson degrees with mean $c$, $G_0(x)=G_1(x)=e^{c(x-1)}$, so (22.9) becomes
$$
S=1-e^{-cTS},\qquad T_c=\frac1c .
$$
The nonzero solution is the familiar giant component of the random graph; at $cT=2$ it is $S=0.7968\ldots$.

**Scale-free check.** For $p_k\propto k^{-\gamma_{\text{deg}}}$ with $2<\gamma_{\text{deg}}\le3$, $\langle k^2\rangle=\infty$ in the infinite-size limit, so $\kappa=\infty$ and $T_c=0$. The statement is about the limit; a finite network has a cutoff and a small but positive threshold. Chapter 10 discusses the finite-size qualification.

## 22.5 Message passing on a fixed graph

The generating-function solution assumes a degree distribution, not a specific graph. For a given finite graph with adjacency $\partial i$, define the cavity message $u_{i\to j}$ as the probability that $i$ is not connected to the giant component through any neighbour other than $j$. The neighbours of $i$ other than $j$ are independent *if the graph is a tree*, so
$$
u_{i\to j}=\prod_{k\in\partial i\setminus\{j\}}\big(1-T+T\,u_{k\to i}\big), \tag{22.11}
$$
and the probability that $i$ is outside the giant component is
$$
u_i=\prod_{k\in\partial i}\big(1-T+T\,u_{k\to i}\big). \tag{22.12}
$$
On a tree, (22.11)–(22.12) are exact and can be solved by one pass from the leaves inward. On a graph with cycles they are the *Bethe approximation*: the product assumes that the branches behind different neighbours are independent given $i$, which fails when short loops connect them. The error is governed by the density of short loops, not by the system size. Karrer and Newman (2010) use exactly this system for general epidemic models, and Mézard and Montanari (2009) develop the cavity method in general.

The message-passing form is what makes the tree calculation useful on real data: a contact network is given, the degree distribution is not, and (22.11) can be iterated on the actual adjacency in $O(m)$ time per sweep. The reference implementation is `messagePassingPercolation` / `message_passing_percolation`, with a prefix/suffix product and a `mate` array for the opposite half-edge.

## 22.6 What trees get right, and what they do not

The Bethe lattice is the $d\to\infty$ limit, and its threshold $1/(z-1)$ is *not* the threshold of $\mathbb{Z}^d$ with the same degree. Table 22.1 makes the gap visible.

| Graph | $z$ | Tree prediction $1/(z-1)$ | Actual $p_c$ (bond) | Status |
|---|---|---|---|---|
| $\mathbb{Z}^2$ | 4 | $1/3=0.3333$ | $1/2$ | exact (Kesten) |
| Simple cubic $\mathbb{Z}^3$ | 6 | $1/5=0.2$ | $0.24881182(10)$ | numerical |
| $z$-regular tree | $z$ | $1/(z-1)$ | $1/(z-1)$ | exact |
| Configuration model | $\langle k\rangle$ | $1/(\kappa-1)$ | $1/(\kappa-1)$ | exact, $N\to\infty$ |

Table 22.1. The tree value is exact on trees and on the configuration model, and it is a lower bound on $\mathbb{Z}^d$ that gets worse as $d$ falls. The reason is that a tree has no cycles to block a would-be infinite cluster: on $\mathbb{Z}^2$, the dual closed crossings that enforce $p_c=1/2$ have no tree analogue. The configuration model is different again: it is tree-like at the scale of the giant component, so the branching answer is asymptotically exact even though the graph is finite and has cycles.

This distinction is the most common source of error in applied work. A "Bethe approximation" to a two-dimensional material is not a controlled approximation; a Bethe approximation to a sparse contact network can be asymptotically exact for the giant component and is usually a good approximation for the threshold, but the size of the error is a property of the particular graph, not a universal constant.

## 22.7 Worked checks

Three numbers are worth carrying in memory.

**Bethe, $z=3$, $p=1/2$.** Equation (22.4) is $u=(1/2+u/2)^2$, i.e. $(u-1)^2=0$. The double root at $u=1$ is the critical point: $\theta=0$ and the two branches merge. At $p=0.6$ the roots are $u=1$ and $u=4/9$, and
$$
\theta=1-\big(0.4+0.6\cdot\tfrac49\big)^3
=1-\big(\tfrac23\big)^3=\tfrac{19}{27}=0.7037\ldots .
$$

**Erdős–Rényi, $c=2$, $T=1$.** $S=1-e^{-2S}$ has the nonzero root $S=0.796812\ldots$; the threshold is at $c=1$, and the giant component at $c=2$ occupies about four fifths of the graph.

**Poisson tree, $c=2$, $p=0.6$.** Here $p_c=1/2$, so the tree is supercritical; the nonzero solution of $u=e^{-cp(1-u)}=e^{-1.2(1-u)}$ gives $\theta=1-u=0.313698\ldots$. This is exactly the Erdős–Rényi giant component at $cT=1.2$, because a Poisson degree distribution is stable under thinning: the root has $\mathrm{Poisson}(2p)=\mathrm{Poisson}(1.2)$ open children, the same law as every forward branch. The agreement is a useful check on both calculations, and it is special to Poisson degrees.

The four-language libraries implement these three checks as `bethePercolation`, `configurationGiantComponent` and the fixed-point solver behind (22.9); the regression values are in the test suites.

## 22.8 What to carry away

1. **On a tree, percolation is a branching process.** The recursion (22.1) and the threshold (22.3) are exact, not approximations.
2. **Generating functions turn the recursion into algebra.** The cluster generating function (22.6) gives the mean size, the critical exponent $\delta=2$ and the $n^{-3/2}$ tail in one calculation.
3. **Sparse graphs inherit the tree answer globally.** The configuration-model equations (22.9)–(22.10) are exact in the $N\to\infty$ limit, under a finite-second-moment condition.
4. **On a lattice, the tree answer is only a local limit.** The cycles that the tree omits are exactly what fixes $p_c=1/2$ in two dimensions, and what makes the three-dimensional threshold larger than $1/(2d-1)$.
5. **Message passing is the finite-graph version.** It is exact on trees, asymptotically exact on locally tree-like graphs, and a controlled approximation elsewhere only when the short-loop density is small.

Chapter 23 uses these equations for the final size of an epidemic, where $T$ is a transmission probability rather than a bond occupancy.
