---
id: 01-foundations
part: Foundations
order: 1
title: What percolation is
subtitle: One parameter, one threshold, a whole geometry of chance
reading: 11 min
---

A cup of coffee is a random medium. Water finds its way through a packed bed of grounds because some channels are open and others are blocked, and the path it takes is decided by the geometry of the bed rather than by any randomness in the water. Broadbent and Hammersley put this picture into mathematics in 1957 and called it *percolation*, after the Latin *percolare*, to seep through. Their point was philosophical as much as technical: in diffusion theory the medium is fixed and the walking particle is random; in percolation the medium is random and the flow through it is completely determined once the medium is drawn.

That single inversion turns out to generate an entire field. Declare each site or each bond of a graph open with probability $p$, independently, and ask a yes/no question: is there an infinite connected component of open elements? The answer changes qualitatively at one value of $p$. Around that value the geometry becomes scale invariant, and the quantities that describe it obey power laws whose exponents do not depend on the microscopic details of the graph. This is a phase transition with no temperature, no energy and no Hamiltonian — only connectivity.

## The model in one paragraph

Let $G=(V,E)$ be a countably infinite, locally finite, connected graph, and let $0\in V$ be a distinguished origin. Attach to every site (site percolation) or every bond (bond percolation) an independent Bernoulli variable with mean $p$. The open elements form a random subgraph; its connected components are the **open clusters**. Write $C_0$ for the cluster containing the origin, and define

$$
\theta(p)=\mathbb{P}_p\big(|C_0|=\infty\big),\qquad
p_c(G)=\inf\{p\in[0,1]:\ \theta(p)>0\}.
$$

Everything else in this atlas is a refinement of these two lines. The function $\theta$ is the order parameter, $p_c$ is the critical probability, and the interesting statements are about what happens as $p\downarrow p_c$ and as $p\uparrow p_c$.

## Six observables

Six quantities carry almost all of the theory. Their definitions are worth fixing once, because different communities normalise them differently and half of the confusion in the literature is bookkeeping.

**Percolation probability.** $\theta(p)=\mathbb{P}_p(0\leftrightarrow\infty)$.

**Two-point function.** $\tau_p(x,y)=\mathbb{P}_p(x\leftrightarrow y)$, with $\tau_p(x)=\tau_p(0,x)$. This is the connectivity kernel; on a transitive graph it depends only on $x-y$.

**Cluster-size distribution.** $\theta_n(p)=\mathbb{P}_p(|C_0|=n)$ for $n<\infty$, and $\theta_\infty=\theta$.

**Susceptibility.** $\chi(p)=\mathbb{E}_p|C_0|=\sum_{n\ge1} n\,\theta_n(p)$, with the convention that $\chi(p)=\infty$ when $\theta(p)>0$. This is the mean size of the cluster at the origin, including the infinite cluster. It diverges as $p\uparrow p_c$ and is infinite above $p_c$; that divergence is the cleanest numerical signal of criticality.

**Correlation length.** $\xi(p)^{-1}=\lim_{n\to\infty}-\frac1n\log\tau_p(0,n\mathbf e_1)$, the exponential rate of decay of connectivity along a coordinate axis. It diverges as $p\to p_c$ from either side.

**Crossing probability.** On a finite box $\Lambda$, $\pi_\Lambda(p)=\mathbb{P}_p(\text{open left–right crossing of }\Lambda)$. This is the observable that finite-size studies actually measure, because it is an indicator with a sharp threshold in $L$ and no need for an infinite lattice.

A related quantity, the cluster number density $n_s(p)=\mathbb{P}_p(|C_0|=s)/s$ per site, is the natural object for scaling theory; it appears in Chapter 6 and is the reason $\delta$ exists.

## Why one parameter is enough

It is tempting to think that a model this poor in structure cannot produce anything universal. The opposite is true, and the reason is a separation of scales. Near $p_c$ the correlation length $\xi$ is enormous compared with the lattice spacing, so the microscopic arrangement of edges is averaged over many times before a cluster can decide whether it is infinite. Universality is the statement that in this limit only a few features of the microscopic model survive: the dimension, and the symmetries that constrain the large-scale geometry (rotation and reflection invariance, and for percolation the colour symmetry between open and closed).

The price of this economy is that the model is *critical at a single point* and therefore numerically delicate: at $p_c$ the relevant scale is the system size itself, finite-size effects are power-law rather than exponential, and naive fits give biased exponents. Chapter 11 is devoted to doing this correctly.

## Five layers of the picture

The subject is usually taught as a stack, and it helps to see the whole stack at once.

1. **Local connectivity.** For fixed $p$, the box contains many clusters of many sizes; the size distribution is the object of study.
2. **A threshold.** On an infinite transitive graph there is a single $p_c\in(0,1)$ at which the qualitative behaviour changes. Existence is easy; locating it is hard.
3. **Critical scaling.** Near $p_c$, observables behave as powers of $|p-p_c|$ or of the system size, with exponents that are universal.
4. **Geometric limit.** In two dimensions the scaling limit of the critical clusters is conformally invariant, and the interfaces converge to SLE$_6$. This is the only dimension in which the limit is understood in full.
5. **Translation.** Ising, Potts, random graphs, epidemics, resistor networks, error-correcting codes and network robustness can all be written as percolation problems, sometimes exactly and sometimes only as analogies. Separating the two is a recurring theme of this atlas.

## Landmarks

Three results orient a newcomer. On the square lattice, bond percolation has $p_c=1/2$ exactly (Kesten 1980). On the triangular lattice, site percolation has $p_c=1/2$ exactly, a fact with a short star–triangle proof (Chapter 4). For site percolation on the triangular lattice, the two-dimensional critical exponents are known exactly: $\beta=5/36$, $\gamma=43/18$, $\nu=4/3$, $\delta=91/5$, $\eta=5/24$, $d_f=91/48$. The same values are expected on other planar lattices, but that is a conjecture. In three dimensions no threshold or exponent is known exactly; the best numerical values are $\beta\approx0.4181$, $\nu\approx0.8764$, $d_f\approx2.5229$, with error bars in the last quoted digit. Above six dimensions the mean-field values $\beta=\gamma=1$, $\nu=1/2$, $\delta=2$, $\eta=0$, $d_f=4$ are expected; they are proved for $d\ge11$ (Chapter 8), and at $d=6$ the exponents are mean-field with logarithmic corrections.

The gap between the exact results and the numerical middle is the shape of the field: exact in two dimensions, rigorous for $d\ge11$, numerical in between.

## How to read this atlas

If you want intuition, read this chapter and Chapter 4, then open the *Lattice* lab and watch a crossing probability sharpen as $L$ grows.

If you want the rigorous core, read Chapters 3–5 in order (monotonicity and existence, duality and exact thresholds, sharpness and uniqueness), then Chapter 7 for the two-dimensional limit.

If you are here for networks or epidemics, read Chapters 10, 22 and 23 in that order: degree distributions, generating functions and the SIR mapping. Chapter 11 is the numerical methodology that keeps an application from producing a plausible but wrong threshold.

If you want to check a claim, every theorem that is proved in full is marked ★, every numerical value carries its source and precision, and Chapter 14 indexes the proofs, records the corrections made in this edition, and lists the sources used throughout.
