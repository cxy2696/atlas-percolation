---
id: 13-map
part: Reference
order: 13
title: The cross-disciplinary map, and what is still open
subtitle: Where the same mathematics reappears, and where it does not
reading: 12 min
---

Percolation is a small model with a large catchment area. This chapter maps the connections that are exact, the ones that are approximate, and the ones that are merely metaphorical — and then lists the problems that are actually open, in the order in which they look tractable.

## 13.1 Exact correspondences

**Spin models.** The random-cluster representation (Chapter 9) makes the $q$-state Potts model and percolation the same measure at different values of a parameter. At $q=1$ the percolation probability is the Potts magnetisation, and the phase transitions coincide. This is an identity, not an analogy, and it is the reason percolation exponents can be computed with spin-model technology.

**Random graphs.** The Erdős–Rényi giant component is percolation on the complete graph; the configuration-model giant component is percolation on a random multigraph. The Molloy–Reed criterion is the exact statement, and it is the same branching-process computation as the Bethe lattice.

**Electrical networks.** The link between percolation and resistor networks is exact at the level of the random-cluster model with wired boundary conditions: the effective conductance has a variational (Dirichlet) representation determined by the cluster structure, and it vanishes exactly when no open cluster connects the electrodes. The *scaling* of the conductivity is a well-defined critical exponent $t$: high-precision simulations give $t\approx1.299$ in two dimensions (Grassberger 1999) and $t\approx2.0$ in three dimensions. These are numerical values, not conformal-field-theory theorems. The relation $t=\nu(d-2+\zeta)$ defines the resistance exponent $\zeta$, and the failure of the naive Einstein relation is the "anomalous" part.

**Epidemics.** The final size of an SIR epidemic on a static network is the giant component of the percolation graph — the network with each edge retained with probability equal to the per-contact transmission probability. This is exact in the infinite-population limit.

**Coupled networks.** The cascade in interdependent networks is a sequence of giant-component computations, so each step is exact; the mean-field solution of the sequence is approximate but the first-order character is robust.

## 13.2 Approximate and contested correspondences

**Glass transitions.** Dynamic heterogeneity in supercooled liquids is often described as "dynamical percolation" of mobile regions. The phenomenology is suggestive and the exponents sometimes match, but there is no derivation of the dynamics from a percolation model. Treat the correspondence as a metaphor with predictive value for scaling collapses, not as an identity.

**Neural criticality.** Avalanches in cortical tissue show power-law size distributions, and branching-process models (which are percolation on a tree) reproduce them. The identification of a *critical* brain with a percolation critical point is contested: the exponents are not universal across preparations, and the measured networks are small enough that finite-size effects dominate.

**Machine learning.** The "emergence" of capabilities with scale, the sparsity threshold at which pruning destroys a network, and the connectivity of random feature maps have all been described in percolation language. Some of these are rigorous (pruning thresholds in random sparse networks are $k$-core thresholds); most are analogies. The distinction matters, because a percolation analogy predicts a sharp threshold where the actual phenomenon may be smooth.

**Financial contagion.** Interbank networks do exhibit cascade behaviour and the interdependent-network machinery applies to the extent that the balance-sheet constraints really are "survive only if your counterparty survives". In practice the constraints are partial, delayed and weighted, so the quantitative thresholds are not transferable. The qualitative lesson — coupling creates first-order fragility — survives.

**Climate tipping points.** Spatial connectivity of sea ice, vegetation and ocean circulation has been analysed with percolation. The analogy is useful for detecting early warning signals (critical slowing down), but the systems are forced, non-stationary and finite, which violates the model's assumptions.

## 13.3 A checklist for a cross-disciplinary claim

Whenever a paper says "X is a percolation problem", ask:

1. What is the graph, explicitly?
2. What is the random element, and is it independent?
3. What is the control parameter, and can it be varied independently of the others?
4. Which connectivity is meant, and is it the one that controls the phenomenon?
5. Is the system in the critical region, and is the system size larger than the correlation length?
6. Which predictions are *specific* to percolation (a threshold, an exponent, a universality class) rather than generic consequences of connectivity?

A claim that answers all six is a scientific contribution. A claim that answers none is a metaphor, which may still be useful for teaching but should not be used to make predictions.

## 13.4 Open problems

The list is ordered from "likely to fall in the next decade" to "may be out of reach". Each entry says why it matters.

**1. Conformal invariance for non-triangular planar lattices.** Smirnov's theorem is specific to the triangular lattice. For the square-lattice site problem, the scaling limit is believed to be conformally invariant and SLE$_6$; the proof is missing. This is the last piece of the universality puzzle in two dimensions, and it is the most concrete open problem in the field.

**2. Critical exponents in $3\le d\le5$.** The numerical values are excellent and the rigorous values are absent. A proof of mean-field behaviour down to $d=7$ would still leave the physical dimensions open, but it would be a major step. The obstacle is the divergence of the lace expansion below $d=11$.

**3. The $d=6$ logarithmic corrections.** The exponents are mean-field at $d=6$, but the logarithms' coefficients are not rigorously known in full. This is a technically hard but well-posed problem.

**4. Classification of higher-order percolation transitions.** On simplicial complexes, the transition type depends on the definition of connectivity (Betti-number connectivity, $k$-th order connectivity, Euler characteristic). Is there a classification theorem? At present there is a zoo of numerical behaviours and no unified theory.

**5. Stability of first-order transitions under partial coupling.** The 2.4554 constant is for fully coupled Poisson layers. For realistic partial, weighted and time-varying coupling, the location and even the order of the transition are open.

**6. Optimal attack and defence.** Given a degree distribution and a budget, what removal sequence minimises the giant component, and what edge additions maximise robustness? This is a combinatorial optimisation problem with a percolation objective; the mean-field answers are known, the finite-size and adversarial versions are not.

**7. Temporal percolation.** Real connectivity is time-dependent: a path must exist *and* be traversable within a time window. The theory of temporal percolation is young, and the appropriate scaling theory is not settled.

**8. Algorithmic complexity of percolation quantities.** Computing the percolation probability or the reliability polynomial of a given finite graph is #P-hard in general; the complexity of recovering the infinite-volume threshold from finite data, and the planar case in particular, are separate questions. The connection to the Tutte polynomial suggests a complexity classification, but it has not been worked out for percolation thresholds specifically.

**9. Quantum error correction thresholds.** The threshold theorem for surface codes is well established; the optimal thresholds for general code families, and the behaviour under correlated noise, are open. The percolation analogy is exact for some decoding problems and only heuristic for others.

**10. Percolation in learning systems.** Whether the sparsity thresholds observed in pruning and the "emergence" phenomena have a percolation description that is more than an analogy is genuinely unknown. The question is worth asking carefully, because the answer determines whether the thresholds can be predicted or only observed.

## 13.5 What this atlas is for

The atlas is a working document, not a monument. Every chapter is a Markdown file with a stable id; every result marked ★ has a proof or a proof sketch in its chapter; every number has a source. If you find an error, the errata table in the next chapter is where it should go, with the date and the correction. That is the only way a reference of this kind stays useful after its authors stop looking at it.
