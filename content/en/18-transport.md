---
id: 18-transport
part: Networks and applications
order: 18
title: Transport and first passage
subtitle: What connectivity does not tell you, and how to measure the rest
reading: 14 min
---

Connectivity answers a yes/no question: is there a path? Transport asks how much, how fast, and how variable. The two are related but not interchangeable. A cluster can be connected and still conduct poorly, and a connected network can have arrival times so heavy-tailed that the mean is not a useful summary. This chapter gives the exponents and the measurement protocol that separate the two.

## 18.1 Conductivity

Put a unit voltage across a percolation cluster and measure the current. Near $p_c$ the effective conductivity vanishes as
$$
\sigma(p)\sim(p-p_c)^{t}.
$$
The exponent $t$ is not the conductivity of a single bond; it is the macroscopic response of a fractal network with dangling ends, bottlenecks and loops. The standard scaling relation is
$$
t=\nu(d-2+\zeta),
$$
where $\zeta$ is the resistance exponent, the anomalous dimension that measures how resistance grows with Euclidean distance on the cluster. In two dimensions $t\approx1.299$ (Grassberger 1999); in three dimensions $t\approx2.0$. Neither is known exactly in three dimensions. The two-dimensional value is numerical, not a conformal-field-theory theorem, and it should be quoted with its uncertainty.

The naive Einstein relation identifies conductivity with a diffusion coefficient. It fails at $p_c$ because the random walk on the cluster is anomalous: the mean-square displacement grows as
$$
\langle r^2(t)\rangle\sim t^{2/d_w},\qquad d_w>2,
$$
with a walk dimension $d_w$ larger than the diffusive value two. The spectral dimension
$$
d_s=\frac{2d_f}{d_w}
$$
controls the return probability and the low-frequency density of states. In two dimensions $d_w\approx2.878$ and $d_s\approx1.318$; in three dimensions $d_w\approx3.88$ and $d_s\approx1.30$. The numbers are numerical; the relation $d_s=2d_f/d_w$ is a definition plus the fractal geometry, not an independent theorem.

## 18.2 Why the exponents differ

Three geometric features separate transport from connectivity.

- **Dangling ends.** A large fraction of the cluster mass hangs from the conducting backbone and carries no current. The backbone is thinner than the cluster, so the conductivity is lower than a naive counting of sites would suggest.
- **Bottlenecks.** Current must pass through narrow necks. The resistance is dominated by the narrowest cuts, not by the average width.
- **Loops.** A loop gives an alternative path and lowers the resistance, but it also adds a length scale that the walk must explore. The competition between loops and bottlenecks is what makes $\zeta$ nontrivial.

The same three features explain why the diffusion coefficient and the conductivity are not proportional. A walker spends most of its time in dangling ends, which carry no current; the current uses the backbone, which the walker visits rarely. The Einstein relation is restored only if the walk is averaged over the same measure as the current, which is not the simple site measure.

## 18.3 First passage

The first-passage time from a source to a target is the random time at which a walker first reaches the target. On a percolation cluster near $p_c$, its distribution is broad. The mean is dominated by rare slow paths and is often a poor summary; quantiles and the full distribution are more informative.

For a one-dimensional chain the first-passage density decays as $t^{-3/2}$ for large $t$, a universal tail that follows from the central limit theorem for the underlying random walk. On a fractal the tail is modified by the walk dimension and the spectral dimension. The practical consequence is the same: near the threshold, a small fraction of trajectories takes a very long time, and a risk calculation based on the mean arrival time underestimates the tail.

This is not a mathematical curiosity. Contaminant transport in a heterogeneous aquifer, message delivery in a delay-tolerant network, and the search time of a foraging animal all show heavy-tailed first-passage distributions near a connectivity threshold. The correct engineering question is usually a quantile — "what is the 95th percentile arrival time?" — not the mean.

## 18.4 Algorithms

Three computations cover most of the applications.

**Shortest path.** On an unweighted graph, breadth-first search from the source gives the graph distance to every vertex in $O(n+m)$. On a weighted graph, Dijkstra's algorithm with a binary heap costs $O((n+m)\log n)$. The shortest path is not the first-passage path of a random walk, but it is the right object for routing and for the "best case" arrival time.

**Conductivity.** Solve the Laplacian linear system with a unit voltage on the source and sink. The effective conductance is the current. Direct solvers cost $O(n^3)$ in the worst case; sparse Cholesky, multigrid or a conjugate-gradient method with a good preconditioner brings large two- and three-dimensional systems into range. The atlas does not ship a Laplacian solver; the exponent table is quoted from the literature, and a production calculation needs a dedicated numerical library.

**Random walk.** Simulate many independent walkers, record the first-passage time to the target, and report the empirical distribution and its quantiles. The cost is $O(\text{walkers}\times\text{steps})$; the variance of the tail estimate is controlled by the number of walkers that actually reach the target, not by the total number of steps.

## 18.5 Applications

**Composite conductivity.** The percolation threshold sets where the conductivity jump occurs; the exponent $t$ sets how steep it is; the contact resistance sets the amplitude. A formulation that is barely above the threshold is sensitive to batch-to-batch variation, because the slope is largest there.

**Porous media.** The relative permeability curve is a transport observable, not a connectivity observable. Near the irreducible saturation the water phase is connected but poorly conducting; the exponent and the bottleneck geometry determine the shape of the curve.

**Epidemics and networks.** The arrival time of an epidemic or a message is a first-passage observable. The giant component tells you whether arrival is possible; the tail tells you how long it may take. The two questions need different models.

**Sensor and infrastructure networks.** Connectivity is necessary for operation but not sufficient for performance. Latency, capacity and failure propagation are transport questions, and a network that is connected can still be unusable under load.

## 18.6 What to report

A transport measurement should report the exponent, the interval over which it was fitted, the geometry (backbone or full cluster), the boundary conditions, and the uncertainty. It should also report the first-passage quantiles if the application cares about time. A single conductivity number at one volume fraction is not a percolation result; it is one point on a curve whose shape is the actual prediction.

The distinction between connectivity and transport is the last piece of the atlas's recurring theme. Percolation gives the threshold and the scaling with remarkable reliability. It gives amplitudes and dynamics poorly or not at all. An application that respects the division of labour is useful; one that quotes a threshold as a material constant is not.
