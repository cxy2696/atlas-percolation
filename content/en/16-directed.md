---
id: 16-directed
part: extensions
order: 16
title: Directed percolation: time as a direction
subtitle: Causality, the DP conjecture, and the exponents that come with it
reading: 14 min
---

Ordinary percolation has no arrow of time. A path may wander left, right, backwards or forwards, and the only constraint is connectivity. Directed percolation adds a direction: an open edge may be traversed in one sense only. The change looks minor and is not. It removes loops, changes the universality class, and produces the most robust universality class in non-equilibrium statistical physics.

## 16.1 The model

Work on $\mathbb{Z}^d\times\mathbb{Z}_{\ge0}$. For each site $x$ and each of the $d$ positive coordinate directions $e_i$, declare the directed edge $(x,t)\to(x+e_i,t+1)$ open with probability $p$, independently. A directed path is a sequence of open edges with increasing time. The directed cluster of $(x,t)$ is the set of sites reachable from it.

The order parameter is
$$
\theta(p)=\mathbb{P}_p\big(|C_{(0,0)}|=\infty\big),\qquad
p_c=\inf\{p:\theta(p)>0\}.
$$
For $d=1$ the lattice is a tilted square lattice: one spatial direction and one time direction, usually written $1+1$. For $d=2$ it is $2+1$. The interactive laboratory uses the $1+1$ case: east edges are space, south edges are time.

The first structural difference from ordinary percolation is that a directed cluster cannot close a loop in time. A directed path that returns to the same time slice would need a backward edge, and there are none. This is why the branching approximation is quantitatively useful in a way that it is not for the undirected lattice: the genealogical tree of a directed cluster has no cycles to correct.

## 16.2 Mean field, done exactly

On a directed tree with $d$ forward branches per site, let $r$ be the probability that a site reached at time $t$ has an infinite forward cluster. Its $d$ children are independent, each is reached with probability $p$, and each then has an infinite forward cluster with probability $r$. Hence
$$
r=1-(1-pr)^d .
$$
The trivial solution $r=0$ always exists. A positive solution appears when the right-hand side has slope greater than one at $r=0$:
$$
\left.\frac{d}{dr}\big(1-(1-pr)^d\big)\right|_{r=0}=pd>1
\quad\Longleftrightarrow\quad
p_c=\frac1d .
$$
For $p=p_c(1+\varepsilon)$, expand $r$ to second order. With $s=pr$,
$$
r=ds-\binom d2s^2+O(s^3)
\;\Longrightarrow\;
1=dp-\binom d2p^2r+O(r^2),
$$
so, using $dp=1+\varepsilon$,
$$
r\sim\frac{2d}{d-1}\,\varepsilon,\qquad
\theta\sim dpr\sim\frac{2d}{d-1}\,\varepsilon .
$$
Thus $\beta=1$ in mean field. The spatial correlation length is the distance over which the branching process forgets its starting point; a random walk with $d$ choices has diffusive spread, so $\xi_\perp\sim\varepsilon^{-1/2}$ and $\nu_\perp=1/2$. The temporal correlation length counts generations, so $\xi_\parallel\sim\varepsilon^{-1}$ and $\nu_\parallel=1$. The dynamic exponent is $z=\nu_\parallel/\nu_\perp=2$. The upper critical dimension is $d_c=4$ spatial dimensions; above it these mean-field values are exact, with logarithmic corrections at $d=4$.

## 16.3 The exponents

Write
$$
P_\infty\sim(p-p_c)^{\beta},\qquad
\xi_\perp\sim|p-p_c|^{-\nu_\perp},\qquad
\xi_\parallel\sim|p-p_c|^{-\nu_\parallel},\qquad
z=\frac{\nu_\parallel}{\nu_\perp}.
$$
At criticality the survival probability decays as
$$
P_s(t)\sim t^{-\delta},\qquad \delta=\frac{\beta}{\nu_\parallel},
$$
because a cluster that survives to time $t$ has probability $\sim t^{-\beta/\nu_\parallel}$ to be connected to the origin. The relation is a scaling identity, not an independent exponent.

| Class | $\beta$ | $\nu_\perp$ | $\nu_\parallel$ | $z$ | status |
|---|---|---|---|---|---|
| Mean field ($d\ge4$) | 1 | $1/2$ | 1 | 2 | exact |
| $1+1$ | 0.276486(8) | 1.096854(4) | 1.733847(6) | 1.5807 | numerical |
| $2+1$ | 0.5836(6) | 0.7329(6) | 1.2950(5) | 1.767 | numerical |

The $1+1$ values are known to about seven digits from long Monte Carlo runs and series extrapolations; the $2+1$ values are known to three or four. Neither is a theorem. The table is included because the contrast with ordinary percolation is the point: $\beta\approx0.276$ is not $5/36\approx0.139$, and the two transitions are in different universality classes even though both live on a square lattice.

## 16.4 The DP conjecture

The reason directed percolation matters beyond its own lattice is a conjecture, not a theorem.

**Conjecture 16.1 (Janssen 1981; Grassberger 1982).** Consider a continuous phase transition from an absorbing state to an active state in a system with a scalar order parameter, short-range interactions, no additional conservation law and no quenched disorder. Then the transition belongs to the directed-percolation universality class.

The conditions are the content. A conserved density, a second absorbing state, long-range interactions, quenched randomness or a coupling to a conserved field can change the class. The contact process, the Schlögl second model and a number of reaction-diffusion systems satisfy the conditions and reproduce DP exponents. The experimental confirmation in turbulent liquid crystals (Takeuchi et al. 2007) is the cleanest physical instance.

The conjecture is not proved in general, and it is not a licence to call every absorbing-state transition DP. It is a checklist: identify the absorbing state, check that the order parameter is scalar, check that no conservation law survives, and check that the disorder is not quenched. A model that fails one item may still be in the class, but the burden of evidence is then on the model.

## 16.5 Simulation

Directed reachability is cheaper than undirected connectivity because the time direction gives a topological order. On an $L\times L$ square with east and south edges, process the sites in row-major order. A site is reachable if it is occupied (site mode), or if the edge from its west or north neighbour is open and that neighbour is reachable (bond mode). The left column is the source. A left-right crossing exists if any site in the last column is reachable.

The dynamic program is $O(L^2)$ after the configuration is drawn, and it uses $O(L^2)$ memory for the reachable set. It consumes $n$ uniforms in site mode and $m$ in bond mode, in the same order as the undirected sampler, which is why the four libraries can share a parity probe. The reference values for the $1+1$ square lattice are $p_c=0.644700(10)$ for bond and $p_c=0.705489(4)$ for site.

Finite-size scaling works as in the undirected case, with one important difference: there is no duality identity that fixes the crossing probability at $p_c$ to $1/2$. The crossing probability at $p_c$ approaches a universal constant that is not $1/2$, and the approach is slow. A code calibrated only on the undirected square-lattice identity will therefore give a biased directed threshold. Use the collapse, not the level crossing.

## 16.6 Where the direction comes from

Directed percolation is the natural model when the order of events matters.

- **Epidemics on temporal networks.** A transmission path must respect time: an individual infected at time $t$ can only infect a contact who is available after $t$. The static-network giant component is the wrong object; the temporal reachability graph is directed.
- **Forest fires and invasions.** A fire spreading with a prevailing wind, or a species advancing into new territory, has a preferred direction. The front is a directed interface, and its roughness is a DP observable.
- **Directed polymers in random media.** A path through a random environment with a preferred direction maps to a directed-walk problem; the free-energy fluctuations are governed by the Kardashev–Parisi–Zhang class, and the connection to DP is through the same directed geometry, not through an identity of exponents.
- **Absorbing-state dynamics.** The contact process, catalytic reactions and Schlögl-type models sit in the DP class under the conditions of Conjecture 16.1. This is the largest application: DP is the default critical behaviour of a whole family of non-equilibrium systems.

The unity is real but conditional. A model with a conservation law, a symmetry or a second absorbing state is not automatically DP, and the DP exponents should not be quoted for it without a check.

## 16.7 What the laboratory shows

The directed laboratory draws a $1+1$ bond or site configuration at full resolution, marks the reachable set, and reports the left-right crossing indicator. The controls are the same as in the undirected lattice laboratory, so the two can be compared directly: at the same $p$, the directed model is far below its threshold when the undirected model is already critical.

The laboratory does not measure the exponent table. It shows the geometry that makes the exponents plausible: a directed cluster is a tree-like object with a well-defined front, and the front broadens as $p$ approaches $p_c$. The numerical values in the table come from the literature, not from the browser.
