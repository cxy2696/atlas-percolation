---
id: 17-continuum
part: extensions
order: 17
title: Continuum percolation: disks, rods, and real media
subtitle: The Boolean model, excluded volume, and why coverage is not connectivity
reading: 15 min
---

Lattice percolation puts the randomness on a fixed grid. A composite, a sensor field or a porous rock does not have a grid: the filler particles sit at random positions, and two particles are connected when their excluded volumes overlap. The continuum version of the model is the Boolean model, and its threshold is a number that every application quotes and few applications check.

## 17.1 The Boolean model

Let the centres of the particles be a Poisson point process of intensity $n$ in the plane, and let each particle be a closed disk of radius $r$. Two disks are connected when they overlap or touch, i.e. when the distance between their centres is at most $2r$. The connected components of this intersection graph are the continuum clusters.

The natural dimensionless control parameter is the reduced density
$$
\lambda=n\pi r^2,
$$
the expected number of disk centres in a disk of radius $r$. It is the continuum analogue of $np$. The model is scale-free in the sense that only $\lambda$ matters, not $n$ and $r$ separately, as long as the domain is large compared with $r$.

## 17.2 Coverage is smooth

Fix a point $x$. The number of centres in the disk of radius $r$ around $x$ is Poisson with mean $\lambda$, so
$$
\mathbb{P}(x\text{ is covered})=1-e^{-\lambda}.
$$
This is the expected covered area fraction, and it is a smooth function of $\lambda$ with no threshold. The derivative $e^{-\lambda}$ is largest at $\lambda=0$ and decreases monotonically; there is no critical point in the coverage curve.

The distinction matters because coverage and connectivity are routinely conflated in deployment calculations. A sensor field can cover 99% of a region and still fail to connect its two ends; a composite can be electrically connected at a filler fraction far below the fraction that covers the sample. Coverage is a statement about the union of disks. Connectivity is a statement about a spanning cluster in the intersection graph.

## 17.3 The connectivity threshold

The Boolean model has a percolation transition at a critical reduced density
$$
\lambda_c\approx1.128087,
$$
with the area fraction at the transition
$$
\phi_c=1-e^{-\lambda_c}\approx0.6763.
$$
The value is numerical, not exact; the best estimates come from large-scale simulations and finite-size scaling (Mertens and Moore 2012). The threshold is for the infinite plane; a finite box has a rounded transition and a pseudocritical point that depends on the boundary conditions.

A useful sanity check is the mean degree. A disk has, on average,
$$
\langle k\rangle=n\cdot\pi(2r)^2=4\lambda
$$
neighbours, because the centre of a neighbouring disk must lie in a disk of radius $2r$. At $\lambda_c$ this gives $\langle k\rangle\approx4.51$. The number is not a threshold criterion — the degree distribution is Poisson and the clustering is geometric — but it is a quick check that a simulation is in the right range. A code that reports a threshold at $\langle k\rangle\approx2$ is describing a different graph.

## 17.4 Excluded volume and anisotropic fillers

The disk model is isotropic. Real fillers are rods, plates and irregular particles, and their shape changes the threshold by orders of magnitude. The organising quantity is the **excluded volume** $V_{ex}$: the volume swept by one particle around another when the two are in contact. For two convex bodies of volume $v$, the percolation threshold scales as
$$
\phi_c\;\sim\;\frac{v}{V_{ex}},
$$
up to a shape-dependent prefactor of order one. The relation is not exact, but it explains the scaling that matters.

For a thin rod of length $L$ and diameter $D$, $v\sim L D^2$ and $V_{ex}\sim L^2D$, so
$$
\phi_c\;\sim\;\frac{D}{L}.
$$
For a thin plate of diameter $L$ and thickness $D$, the same dimensional argument gives $\phi_c\sim D/L$. This is why carbon nanotubes and graphene percolate at fractions one or two orders of magnitude below spherical carbon black: the aspect ratio $L/D$ multiplies the excluded volume without multiplying the mass.

The excluded-volume argument assumes hard, randomly oriented, well-dispersed particles. Agglomeration reduces the effective aspect ratio and raises the threshold; alignment changes the threshold in a direction-dependent way, so a single scalar $\phi_c$ is no longer the right object. The correct object is a directional threshold tensor, and the engineering target is a formulation that sits above the threshold in every direction that carries current or load.

## 17.5 Simulation

The direct algorithm is the same as the lattice one, with geometry replacing the edge list. Generate $n$ Poisson points in the box. Bucket them into a uniform grid with cell size $2r$. For each disk, inspect the nine neighbouring cells and union the disks whose centres are within $2r$. The expected work is $O(n)$ when the density is moderate, because the number of neighbours per cell is bounded by the Poisson mean.

Two corrections are easy to miss. First, the grid must cover the box with a halo of one cell, or pairs that straddle a boundary are lost. Second, the finite box has a boundary layer of width $2r$ in which clusters are truncated; the largest-cluster fraction should be measured in the interior or the boundary conditions should be stated. The laboratory uses periodic images for the neighbour search but reports the largest cluster in the fundamental box, which is a compromise: it removes the worst boundary bias without pretending that a small box is infinite.

## 17.6 Applications

**Sensor networks.** Coverage asks whether every point is within range of some sensor; connectivity asks whether the communication graph has a spanning component. The two thresholds differ, and a deployment that satisfies one may fail the other. The Boolean model gives the scaling law; the actual radio range, obstacles and sleep schedules are corrections that must be measured.

**Conductive composites.** The filler network is a continuum percolation problem with tunnelling. The threshold is set by the excluded volume and the dispersion; the conductivity above it is set by the contact resistance and the tunnelling barriers. Percolation predicts where the jump occurs, not how large it is.

**Porous media.** The pore space is the connected phase; the solid matrix is the obstacle. Mercury intrusion, drainage and imbibition are invasion problems with a threshold set by the throat-size distribution. The Boolean model is a crude geometry for the pore space, but it captures the difference between a connected and a disconnected pore network.

**Tissue scaffolds.** Cells migrate through connected pores. The scaffold must be above the pore-connectivity threshold, not merely porous. The threshold depends on the pore-size distribution relative to the cell size, which makes it a weighted percolation problem rather than a Boolean one.

## 17.7 What the Boolean model does not capture

The model assumes hard impenetrable disks, a Poisson distribution of centres, no orientational correlations and no contacts beyond geometric overlap. Real systems violate every assumption to some degree. Polydispersity broadens the transition; clustering creates dense regions and voids; alignment makes the threshold anisotropic; tunnelling and contact resistance add a transport layer that percolation does not describe.

The right response is not to abandon the model but to use it for what it does well: the scaling of the threshold with aspect ratio, the distinction between coverage and connectivity, and the order of magnitude of the critical fraction. The prefactor and the amplitude require a more detailed model, and the measurement should be designed to test the scaling rather than to confirm a single number.

## 17.8 Open questions

The exact $\lambda_c$ of the Poisson disk model is not known. The value is known numerically to several digits, and the universality class is the same as lattice percolation in two dimensions, but a proof is missing. The same is true for the threshold of anisotropic particles, polydisperse mixtures and systems with attractive interactions. These are not exotic questions: they are the questions that decide whether a composite formulation or a sensor deployment will work.
