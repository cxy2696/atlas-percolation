---
id: 10-networks
part: Networks and applications
order: 10
title: Networks: degrees, cores, and coupling
subtitle: Molloy–Reed, k-core, and the 2.4554 constant
reading: 18 min
---

On a lattice every vertex has the same number of neighbours. On a network it does not, and the degree distribution becomes a control parameter as important as $p$. Three results carry most of the theory: the Molloy–Reed criterion for the existence of a giant component, the first-order character of $k$-core percolation, and the 2.4554 threshold of two fully coupled Erdős–Rényi networks. The last one is derived here from scratch, because it is easy to get the coupled-network recursion subtly wrong.

## 10.1 The configuration model and the branching approximation

Fix a degree sequence $(k_1,\dots,k_N)$ with $\sum k_i=2M$. The configuration model pairs the $2M$ stubs uniformly at random. In the limit $N\to\infty$ with a fixed degree distribution $p_k$, the neighbourhood of a random vertex converges locally to a branching process: a vertex of degree $k$ has $k$ neighbours, and a neighbour reached along an edge has $k-1$ further edges, with the **size-biased** degree distribution
$$
\tilde p_k=\frac{k\,p_k}{\langle k\rangle}.
$$
The size bias is the only non-obvious ingredient. Choose a random edge and then a random endpoint: a vertex of degree $k$ is chosen with probability proportional to $k$, not to $p_k$. Getting this wrong is a common error in applied network papers.

## 10.2 Molloy–Reed, with the calculation

Retain each vertex independently with probability $p$ (site dilution). Define $\rho$ as the probability that connectivity continues forever from a vertex reached along an edge. A retained neighbour of degree $k$ continues if at least one of its $k-1$ other edges leads to a retained vertex that continues, so
$$
\rho=p\sum_{k\ge1}\frac{k\,p_k}{\langle k\rangle}\Big[1-(1-\rho)^{k-1}\Big].
$$
The giant component exists iff this equation has a positive solution, which happens iff the derivative at $\rho=0$ exceeds one:
$$
\left.\frac{d}{d\rho}\right|_{\rho=0}
=p\sum_k\frac{k\,p_k}{\langle k\rangle}(k-1)
=p\,\frac{\langle k^2\rangle-\langle k\rangle}{\langle k\rangle}.
$$
Hence
$$
p_c=\frac{\langle k\rangle}{\langle k^2\rangle-\langle k\rangle}=\frac{1}{\kappa-1},
\qquad \kappa:=\frac{\langle k^2\rangle}{\langle k\rangle},
$$
At full occupancy ($p=1$) this reduces to $\kappa>2$, the Molloy–Reed criterion. Under dilution the criterion is $p(\kappa-1)>1$, or equivalently $p>1/(\kappa-1)$; $\kappa>2$ alone is not enough. The branching factor is $\kappa-1$, not $\kappa$. It is not the mean degree; the two coincide only for Poisson degrees, where $\kappa=c+1$ and $\kappa-1=c$.

The dilute fraction is $f=1-p$, so the critical removal fraction is
$$
f_c=1-\frac{1}{\kappa-1}=\frac{\kappa-2}{\kappa-1}.
$$
For Erdős–Rényi degrees, $\langle k^2\rangle=\langle k\rangle(\langle k\rangle+1)$ and $\kappa=c+1$, giving $f_c=1-1/c$, the familiar result that a random graph with mean degree $c$ fragments when a fraction $1-1/c$ of vertices is removed.

**A common slip.** It is tempting to write $f_c=1-1/\kappa$ and to quote, in the same display, the correct expression $1-\langle k\rangle/(\langle k^2\rangle-\langle k\rangle)$. The two are not equal: $1/\kappa=\langle k\rangle/\langle k^2\rangle$, whereas the correct denominator is $\langle k^2\rangle-\langle k\rangle$. The Erdős–Rényi special case is forgiving, which is why the error survives casual checks. The general formula is $f_c=1-1/(\kappa-1)$; the difference from $1-1/\kappa$ is $1/[\kappa(\kappa-1)]$, which is largest near $\kappa=2$ and vanishes for heavy tails.

## 10.3 Scale-free degrees: the disappearance of the threshold

Take $p_k\propto k^{-\gamma_{\text{deg}}}$ for $k\ge m$ (the subscript distinguishes the degree exponent from the susceptibility exponent $\gamma$). Then
$$
\langle k^2\rangle\propto\int_m^\infty k^{2-\gamma_{\text{deg}}}\,dk
$$
converges iff $\gamma_{\text{deg}}>3$. Three regimes follow:

- $\gamma_{\text{deg}}>3$: $\kappa=(\gamma_{\text{deg}}-2)m/(\gamma_{\text{deg}}-3)$ is finite, so $f_c=1-1/(\kappa-1)$ is a genuine threshold below one.
- $2<\gamma_{\text{deg}}\le3$: $\langle k^2\rangle=\infty$, so $\kappa=\infty$, $f_c=1$: random removal never destroys the giant component in the infinite-size limit.
- $\gamma_{\text{deg}}\le2$: even $\langle k\rangle$ diverges and the distribution needs a finite-$N$ regularisation; the notion of a random graph with such degrees is delicate.

The same network is extremely fragile under **targeted** removal: deleting vertices in decreasing degree order can destroy the giant component while most vertices remain. This is the "robust yet fragile" duality of Cohen, Erez, ben-Avraham and Havlin (2000) and Albert, Jeong and Barabási (2000). It is not a paradox: random removal samples the degree distribution proportionally, so the many low-degree vertices dominate; targeted removal hits the hubs that hold the network together.

## 10.4 $k$-core percolation

The $k$-core of a graph is obtained by repeatedly deleting vertices of current degree less than $k$. Unlike connectivity, the $k$-core requires local redundancy: a vertex survives if at least $k$ of its neighbours survive.

On an Erdős–Rényi graph with mean degree $c$, the $3$-core appears discontinuously. Above a threshold $c_3\approx3.35$ (for the appearance of a non-empty 3-core in the undiluted graph; Dorogovtsev, Goltsev and Mendes 2006) the core is macroscopic; below it there is nothing. Under dilution the transition is also discontinuous, with a hysteresis loop if the process is run in reverse. The mechanism is a bootstrap-percolation feedback: losing one vertex can push several neighbours below the threshold, which removes more vertices, and the cascade either stops early or runs to completion.

This is the cleanest example of a percolation transition whose *type* is changed by the local rule rather than by correlations. It matters in applications because "gradual degradation" is exactly what a $k$-core requirement removes: a system with a redundancy requirement fails abruptly, not gracefully.

## 10.5 Two coupled networks and the constant 2.4554

**Model (Buldyrev et al. 2010).** Two networks $A$ and $B$ on the same vertex set, with a one-to-one coupling. A vertex survives a round iff it is initially retained, belongs to the giant component of the surviving subgraph of $A$, and its partner belongs to the giant component of the surviving subgraph of $B$. Remove a fraction $1-p$ initially, apply the round repeatedly, and stop at the fixed point. After labelling partners by the same index, the one-to-one partner map is the identity, so the round is the intersection of the two giant components; pruning $A$ and $B$ in isolation is not the same algorithm and keeps vertices whose partner has already failed.

**Mean-field solution for Erdős–Rényi layers.** Let $\mu$ be the fraction of vertices in the mutual giant component. A retained vertex is in it iff it has at least one neighbour in $A$ that is in the mutual component, and the same in $B$. For Poisson degrees with mean $c$, the probability that none of the $c$ neighbours qualifies is $e^{-c\mu}$, and the two layers are independent given the vertex, so
$$
\mu=p\big(1-e^{-c\mu}\big)^2. \tag{10.1}
$$
The trivial solution $\mu=0$ always exists. A nontrivial solution appears when the right-hand side is tangent to the diagonal. Write $t=c\mu$ and $f(t)=p(1-e^{-t})^2$. Tangency requires
$$
f(t)=t/c,\qquad f'(t)=1/c .
$$
The second gives $1/c=2p(1-e^{-t})e^{-t}$. Dividing the first equation by the second,
$$
t=\frac{(1-e^{-t})^2}{2(1-e^{-t})e^{-t}}=\frac{e^{t}-1}{2},
$$
so $e^{t}=1+2t$. The nonzero root is $t^\ast=1.256431\ldots$, giving
$$
p_c=\frac{1}{2c\,(1-e^{-t^\ast})e^{-t^\ast}}=\frac{2.4554075\ldots}{c}.
$$
For comparison, a single Erdős–Rényi layer has $p_c=1/c$. Coupling therefore raises the threshold by a factor $2.4554$, and the transition is **first order**: at $p_c$ the mutual component jumps from zero to a finite size $\mu^\ast=t^\ast/c$, because the nontrivial branch is born by a saddle-node bifurcation, not by a continuous bifurcation from zero.

Two consequences are worth stating because they are often missed. First, the constant is not universal: it depends on the degree distribution and on the coupling pattern (one-to-one, partial, multiple). For a fully coupled pair of Poisson layers it is exactly the root of the transcendental equation above; for other degree distributions the same calculation gives a different number. Second, the first-order character is what makes the system dangerous: there is no early warning in the order parameter, and the cascade proceeds at a finite fraction of the network per step.

**Partial coupling.** If only a fraction $q$ of vertices are coupled, the recursion becomes a pair of equations for the two layers. For small coupling strength the transition returns to second order (Parshani, Buldyrev and Havlin 2010). The design lesson — prefer several weak couplings to one strong one — is the engineering content of the theory.

## 10.6 Higher-order percolation

On a simplicial complex or hypergraph, "connected" can mean $k$-th order connectivity (two $k$-simplices joined through a shared $(k-1)$-face), connectivity defined through Betti numbers, or connectivity defined through the Euler characteristic. Numerically, these definitions produce transitions that can be more continuous than the graph case, with a critical interval in which Betti numbers stay nonzero. There is no unified rigorous theory; the topic is in Chapter 13's list of open problems, and the numerics are sensitive to the definition used.

## 10.7 Design rules that follow

Four rules follow from this chapter and are used in Chapter 12's case studies.

1. **Homogenise degrees to resist targeted attack; heterogenise to resist random failure.** The two objectives conflict, and the conflict is quantified by $f_c=1-1/(\kappa-1)$ versus the targeted threshold.
2. **Avoid single-point dependencies.** One-to-one coupling turns a continuous transition into a first-order one; multiple coupling restores the continuous character.
3. **Treat redundancy requirements as discontinuous.** A $k$-core requirement removes the gradual regime; design the safety margin for the jump, not for the average.
4. **Measure $\kappa$, not the mean degree.** The mean degree is the wrong summary statistic for robustness; a network with the same mean degree and a heavier tail has a very different $f_c$.
