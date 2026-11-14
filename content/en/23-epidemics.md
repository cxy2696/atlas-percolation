---
id: 23-epidemics
part: bridges
order: 23
title: Epidemics as percolation
subtitle: Final size, herd immunity, and where the mapping stops
reading: 16 min
---

An SIR epidemic and bond percolation answer the same question when the question is *who is ever infected*. The answer is exact, not an analogy: retain each contact edge with the probability that it transmits, and the ever-infected set is the open cluster of the initial case. That identity gives the final size, the epidemic threshold, and the vaccination target in one calculation. It says nothing about the peak, the time course, or the effect of behaviour — and most failed applications fail by forgetting the second sentence.

## 23.1 The mapping, stated precisely

Consider an SIR process on a static contact graph $G=(V,E)$ with one initially infectious vertex. Each infectious vertex $i$ has an infectious period $\tau_i$, and while infectious it makes contacts with each susceptible neighbour at rate $\beta$. The number of transmissions along an edge is then Poisson with mean $\beta\tau_i$ (if the contacts are a Poisson process), so the edge transmits with probability
$$
T_i=1-e^{-\beta\tau_i}.
$$
If the infectious periods are independent and identically distributed, condition on them. Each *directed* edge $i\to j$ is open independently with probability $1-e^{-\beta\tau_i}$, and the set of vertices that ever become infected is the out-component of the initial case in this directed random graph. On a tree, each edge is traversed only away from the initial case, so averaging over the infectious periods gives independent edge retention with probability
$$
T=\mathbb{E}\big[1-e^{-\beta\tau}\big].
$$
In the configuration-model limit the same reduction holds because cycles are negligible at the scale of the giant out-component. This is the mapping used below; on a general graph with short cycles the exact object is the directed out-component, and the undirected percolation cluster is the tree approximation.

Two special cases are worth recording. For a constant infectious period $\tau$, $T=1-e^{-\beta\tau}$. For a Markovian SIR with recovery rate $\gamma$ (mean infectious period $1/\gamma$) and transmission rate $\beta$, $T=\beta/(\beta+\gamma)$. The mapping requires the contacts to be independent across edges; that is what makes the percolation representation exact, and it is the assumption that temporal and behavioural heterogeneity violate.

For several initial cases, the final set is the union of their open clusters. In a large population with a vanishing initial fraction, the final size is the giant component whenever the parameters are supercritical; near the threshold the fluctuation of the initial seed matters.

## 23.2 The final-size equation

Take the configuration model of Chapter 22 with degree generating functions $G_0$ and $G_1$. The bond-percolation solution (22.9) with retention $T$ gives the final fraction directly:
$$
R_\infty=1-G_0\big(1-T+T u\big),\qquad
u=G_1\big(1-T+T u\big). \tag{23.1}
$$
The derivation is the message-passing one: a vertex escapes infection if every neighbour either does not transmit (probability $1-T$) or transmits to a neighbour whose own branch dies out (probability $T u$). The giant component is the set of vertices that do not escape.

For Poisson degrees with mean $c$, $G_0=G_1=e^{c(x-1)}$ and (23.1) collapses to the scalar equation
$$
R_\infty=1-e^{-R_0R_\infty},\qquad R_0=Tc. \tag{23.2}
$$
The trivial solution $R_\infty=0$ always exists. A positive solution exists iff $R_0>1$, and then it is unique. The same bifurcation is the percolation threshold of Chapter 22:
$$
R_0=T(\kappa-1),\qquad T_c=\frac{1}{\kappa-1}. \tag{23.3}
$$
Equation (23.3) is the quantitative content of "the epidemic threshold is a percolation threshold". It is exact in the configuration-model limit; on a real finite network it is the leading term of a $1/\langle k\rangle$ expansion.

**Worked values.** For $R_0=2$, (23.2) gives $R_\infty=0.7968\ldots$; for $R_0=3$, $R_\infty=0.9405\ldots$; for $R_0=1.5$, $R_\infty=0.5828\ldots$. The approach to $R_\infty=1$ is slow: even $R_0=5$ leaves about $0.7\%$ susceptible. These are arithmetic consequences of the mean-field equation, not estimates for a particular pathogen.

## 23.3 Herd immunity

Suppose a fraction $v$ of the population is immunised at random before the epidemic. In the configuration model, immunisation removes vertices and all their edges. The branching factor of the residual network is multiplied by $(1-v)$, so the effective reproduction number is
$$
R_{\text{eff}}=(1-v)R_0,
$$
and the threshold is crossed when $R_{\text{eff}}=1$:
$$
v_c=1-\frac{1}{R_0}. \tag{23.4}
$$
The same formula holds for a vaccine that is *all-or-nothing* with efficacy $e$ if $v$ is the fraction vaccinated (the protected fraction is $ve$), and for a *leaky* vaccine that reduces susceptibility by $e$ (the residual branching factor is $1-ev$). In both cases
$$
v_c=\frac{1-1/R_0}{e}. \tag{23.5}
$$
A vaccine with $e=0.9$ and $R_0=3$ therefore needs $v_c=0.741$, not $0.667$. The efficacy enters linearly in the mean-field calculation; real allocation also depends on who is vaccinated, because $R_0$ is an average over a heterogeneous contact structure.

Table 23.1 gives the arithmetic of (23.4) for a range of $R_0$. The values are not epidemiological recommendations; they are what the homogeneous-mixing formula says, and Chapter 12 explains why the heterogeneous correction can be large.

| $R_0$ | $v_c=1-1/R_0$ | $1-R_\infty$ at $T$ tuned to $R_0$ |
|---|---|---|
| 1.5 | 0.333 | 0.417 |
| 2.0 | 0.500 | 0.203 |
| 3.0 | 0.667 | 0.059 |
| 5.0 | 0.800 | 0.007 |
| 10.0 | 0.900 | $4.5\times10^{-5}$ |

Table 23.1. Herd-immunity fractions and the residual susceptible fraction from (23.2). The second column is the fraction that must be immune to push $R_{\text{eff}}$ to one; the third is the fraction that escapes infection in the uncontrolled epidemic at the same $R_0$.

**Targeted vaccination.** If the highest-degree vertices are vaccinated first, the threshold is reached at a smaller fraction, and for a heavy-tailed degree distribution the gain can be dramatic: the vertices that dominate $\langle k^2\rangle$ are exactly the ones removed. The mean-field calculation is the same once the residual degree distribution is specified; what changes is the distribution, not the formula. This is the percolation content of the "vaccinate the hubs" advice, and it is also its limitation: the advice requires the contact network to be known well enough to rank the hubs, and it is sensitive to error in that ranking.

## 23.4 Heterogeneity, superspreading, and the limits of the reproduction number

$R_0=T(\kappa-1)$ is a single number, but the epidemic is governed by the whole offspring distribution. Two populations with the same $R_0$ can have very different final sizes and very different probabilities of a major outbreak, because the offspring variance controls the branching process. The extreme case is a heavy-tailed contact distribution: $\kappa$ can be large, $T_c$ close to zero, and a single introduction can produce a large outbreak even when the mean number of transmissions is modest.

The empirical literature on superspreading makes the same point from the other side. Individual variation in infectiousness is often overdispersed, with a small fraction of cases responsible for a large fraction of transmissions (Lloyd-Smith et al. 2005). In percolation language, the offspring distribution is not Poisson: the mean is $R_0$, but the variance and the tail determine the extinction probability and the size of the largest cluster. $R_0$ alone does not determine either. The practical consequence is that control measures which reduce the variance — avoiding crowded indoor events, for example — can have an effect out of proportion to their effect on the mean.

This is also where the analogy with the degree distribution becomes quantitative. In the configuration model, the offspring law of the percolation process is size-biased, and its variance is fixed by $p_k$. A contact distribution with a heavy tail has a heavy-tailed offspring law even if transmission is a simple coin flip per edge. The two sources of overdispersion — contact heterogeneity and individual infectiousness — are different, and a single $R_0$ cannot distinguish them.

## 23.5 Temporal networks: when the static mapping fails

The mapping of Section 23.1 assumes that the contact graph is static: an edge that exists at any time can carry transmission at any later time. Real contacts are ordered. A path that uses an edge at time $t_1$ and another at time $t_2<t_1$ is not a valid transmission path, even though it is a path in the static graph.

The correct object is the *time-respecting* or *temporal* reachability graph: $j$ is reachable from $i$ if there is a sequence of contacts with nondecreasing times. The giant component of the static graph is an upper bound on the set reachable in this sense, and the bound can be very loose when the contact sequence is bursty (Holme and Saramäki 2012). The epidemic threshold of a temporal network therefore depends on the ordering, not only on the aggregate degree distribution; Valdano et al. (2015) give an analytical computation for a class of temporal networks.

Two practical rules follow. First, a static percolation calculation is a *best case* for spread: it allows transmission paths that the clock forbids. Second, the error is not a small finite-size correction; it can change the threshold by an amount comparable to the threshold itself. When the question is "can an epidemic persist?", the static answer is necessary but not sufficient.

## 23.6 The algorithm, and how to check it

The final size is a fixed point, so the algorithm is a fixed-point iteration with a bracket on $[0,1]$:

```
solve_final_size(T, degree_pmf):
    u = 0
    repeat:
        u_new = G1(1 - T + T*u)
        if |u_new - u| < tol: break
        u = u_new
    return 1 - G0(1 - T + T*u)
```

Starting from $u=0$ the iteration is monotone increasing and converges to the smallest fixed point, which is the physical one; starting from $u=1$ stays at the trivial fixed point $u=1$ and would report a final size of zero. On a tree the equations are exact; on the configuration model they are exact in the limit; on a given graph the same equations are the message-passing system (22.11). The libraries expose the solver as `sirFinalSize` in C++, Julia, Python and JavaScript, and the tests compare it with the analytic Erdős–Rényi value and with a direct percolation computation on a small graph.

A stochastic check is worth running once. Simulate the SIR process with the Gillespie algorithm on a small configuration-model graph, repeat with many seeds, and compare the mean final size with (23.1). The mean converges slowly near the threshold, where the distribution is bimodal: most runs die out, and a few reach the giant component. Reporting only the mean hides the bimodality; report the extinction probability and the size distribution as well.

## 23.7 Applications and what the model does not give

**Childhood vaccination.** Measles has a basic reproduction number commonly estimated in the range 12–18, which by (23.4) implies $v_c$ between $0.92$ and $0.94$. The arithmetic is robust; the epidemiological claim requires the contact structure, the vaccine efficacy and the coverage actually achieved. Anderson and May (1991) is the standard source for the estimates and their caveats.

**Heterogeneous contact networks.** For a network with a heavy-tailed degree distribution, random immunisation needs a fraction close to one even when the mean degree is modest, while targeted immunisation of the high-degree vertices can be much cheaper. The percolation calculation gives the comparison; it does not give the contact network.

**Temporal and behavioural networks.** The static mapping is a bound, not an estimate. When contacts are ordered, bursty or responsive to the epidemic, the threshold is a property of the temporal process, and the static giant component can be badly misleading.

**What the model does not give.** It does not give the peak time or height, the effect of isolation or treatment, the waning of immunity, the emergence of variants, or the behavioural response to prevalence. Those are dynamical questions, and the percolation mapping deliberately discards the dynamics. Chapter 18's first-passage material is the right place to start when timing matters, and Keeling and Rohani (2008) or Kiss, Miller and Simon (2017) give the dynamical treatment.

## 23.8 A reporting checklist

Before quoting a percolation-based epidemic number, answer these questions.

1. **What is the graph?** Static, temporal, weighted, directed, or a configuration model? The answer changes the threshold.
2. **What is $T$?** A measured transmission probability, a fitted parameter, or a modelling assumption? State which.
3. **What is the degree distribution?** $R_0$ is not enough; $\kappa$ and the variance of the offspring law matter.
4. **Is the population large compared with the correlation length?** Near the threshold, finite-size effects are the phenomenon.
5. **Is the question about the final size or about time?** Percolation answers the first and not the second.
6. **Is the vaccine all-or-nothing or leaky?** Use (23.5), and state the efficacy.
7. **Is the contact network known or assumed?** Targeted allocation requires knowledge that random allocation does not.

A number that cannot answer these questions is an arithmetic exercise, not an epidemiological estimate. The value of the percolation mapping is that it makes the arithmetic exact and the assumptions visible; it does not remove the need to defend them.
