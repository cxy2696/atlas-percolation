---
id: 12-applications
part: Networks and applications
order: 12
title: Applications, and how to use the theory without abusing it
subtitle: A protocol, four case studies, a field guide, and the questions to ask first
reading: 23 min
---

Percolation earns its keep in applications because it answers one question very well: given a random medium, is there a connected path across it? Everything else — the threshold value, the exponents, the finite-size corrections — is a refinement of that question. Most failed applications fail not because the mathematics is wrong but because the question being asked is not the one percolation answers.

## 12.1 A translation protocol

Before writing any code, answer five questions. If any answer is "no" or "not sure", the model is not yet a percolation model.

1. **What are the elements?** Sites, bonds, or both? In a porous rock the pores are sites and the throats are bonds; in a composite the filler particles are sites and their contacts are bonds; in an epidemic the individuals are sites and the contacts are bonds. The choice changes the threshold, so it is not a detail.
2. **What is the control parameter?** Volume fraction, connectivity, occupancy, removal fraction — and is it the *effective* or the *nominal* one? Agglomeration, swelling, compression and measurement bias all move the effective value away from the nominal one.
3. **What is the relevant connectivity?** For transport it is usually the existence of a path; for mechanical integrity it is the existence of a load-bearing backbone; for epidemiology it is a path in a temporal contact network. These are different connectivities on the same graph, with different thresholds.
4. **Which phase is the system in?** If the answer is "near the threshold", then the response is dominated by the critical region and the answers are scale-dependent. If the answer is "far above", a mean-field or effective-medium estimate is usually enough and percolation adds little.
5. **What is the sample size relative to the correlation length?** If $L/\xi$ is not large, finite-size effects are the signal, not the noise. This is a common failure mode in engineering applications.

The protocol is deliberately conservative. A model that passes all five is a percolation model and can borrow the entire toolkit of this atlas. A model that fails one can still be useful, but it is an analogy, and analogies should not be used to quote a threshold.

## 12.2 Composites and electrodes

**Conductive composites.** Insulating polymer plus conductive filler: the conductivity jumps when the filler volume fraction crosses the percolation threshold of the filler network. Three facts from the theory matter more than the exact threshold.

First, *shape beats quantity*. The threshold scales roughly with the inverse aspect ratio for rods and with the inverse of the dimensionless, normalized excluded volume for plates, so high-aspect-ratio fillers (carbon nanotubes, graphene) percolate at fractions one or two orders of magnitude below spherical carbon black. The relevant geometric quantity is the average excluded volume, not the mass fraction.

Second, *dispersion is the control variable*. The effective occupancy is the fraction of well-dispersed filler, not the nominal loading. Agglomerates reduce the effective $p$ while increasing the nominal one, which is why two batches with identical formulation can sit on opposite sides of the threshold. This produces the bimodal performance distribution familiar to battery and composite engineers; it is a percolation effect, not a mixing-quality anecdote.

Third, *anisotropy follows processing*. Alignment of anisotropic fillers changes the threshold in a direction-dependent way: the percolation threshold along the alignment direction drops, and perpendicular to it rises. A single scalar "threshold" is then meaningless; the correct object is a directional threshold tensor.

**Battery electrodes.** A lithium iron phosphate cathode is a poor electronic conductor and needs a conductive additive (carbon black, carbon nanotubes) plus a carbon coating. The additive forms a percolating network; below the threshold the electrode is rate-limited by electronic transport, above it the extra additive displaces active material and reduces energy density. The engineering problem is therefore a narrow window just above the threshold, and the theory's contribution is to explain why the window is narrow: the conductivity grows as a power law above $p_c$, so a small change in loading produces a large change in conductivity only near the threshold, exactly where the batch-to-batch scatter is largest.

The same structure appears in solid electrolytes (ionic percolation through grain boundaries), in fuel-cell catalyst layers (electronic and ionic networks must both percolate, a *two-phase* percolation problem), and in thermal interface materials.

## 12.3 Porous media and hydrology

In a porous rock the pore space is the site graph and the throats are the bonds. As water saturation decreases, the water-filled subgraph thins and at a critical saturation the hydraulic conductance drops to zero. The percolation threshold sets the *irreducible* saturation; the power-law conductivity above it sets the shape of the relative-permeability curve.

Two refinements are essential in practice. The pore-size distribution makes the occupation probability site-dependent, so the relevant model is *correlated* or *weighted* percolation, and the threshold is set by the largest throats that must be invaded (invasion percolation). And the geometry is often dual-porosity: fractures percolate at a much lower density than the matrix, and the two networks exchange fluid. A single $p_c$ is then not a material constant but a function of the measurement direction and scale.

The application to contaminant transport is the one with the clearest engineering consequence: near the threshold, first-passage times are heavy-tailed, so the mean arrival time is not a useful risk measure. Use quantiles.

## 12.4 Epidemiology

For an SIR epidemic on a static contact network, retain each edge independently with the per-contact transmission probability $T$. The final size is the giant component of the resulting percolation graph. That is an exact statement in the infinite-population limit for a configuration-model network; it avoids the circular phrase "delete the vertices that escape", since which vertices escape is precisely what the construction determines. It gives the random-immunisation threshold as
$$
v_c=1-\frac{1}{R_0},\qquad R_0=T(\kappa-1),
$$
where $\kappa=\langle k^2\rangle/\langle k\rangle$ is the Molloy–Reed ratio. For homogeneous mixing $R_0\approx T\langle k\rangle$, and for $T\approx1$ the heterogeneous expression reduces to $1-1/(\kappa-1)$. If $R_0$ is held fixed, the random-coverage formula is the same for every degree distribution. What heterogeneity changes is $R_0$: at fixed mean degree, a heavy-tailed network has a larger $\kappa$ and therefore a larger $R_0$ and a larger $v_c$. Random immunization is never easier on the heterogeneous network; targeted immunity of high-degree vertices is the strategy that lowers the required coverage.

Two warnings. The mapping assumes a static network and a Markovian epidemic; for temporal networks with bursty contacts the percolation threshold is replaced by a *temporal* connectivity threshold, and the two can differ by a large factor. And the herd-immunity threshold is a statement about the final size in an infinite population, not about the peak or the time course, which require the dynamics that percolation deliberately discards.

## 12.5 Infrastructure and cascades

The 2010 result on interdependent networks (Chapter 10) is the theoretical basis for the modern view that coupled infrastructures fail abruptly. The engineering translation has three parts.

*Coupling topology matters more than coupling strength.* A one-to-one dependency between a power grid and its communication network turns a continuous transition into a first-order one. Partial coupling, or multiple redundant dependencies, restores a continuous transition. This is a design choice, not a law of nature.

*The cascade is a sequence of giant-component computations.* Each round removes the vertices that lost their support, recomputes the giant component, and repeats. The number of rounds is small (typically under ten) and the total loss is much larger than the initial shock. Any mitigation that shortens the cascade — buffering, islanding, redundant control — acts by keeping the surviving set above the threshold of the next round.

*Metrics must be cascade-aware.* A network that is robust to random failures at the single-layer level can be fragile when coupled, so a robustness audit that examines each layer separately is not merely imprecise; it can give the wrong sign.

Wildfire is a natural percolation problem with the same structure: fuel connectivity is the control parameter, and the transition from exponentially truncated fire sizes to power-law fire sizes is the percolation transition. Firebreaks work by lowering the effective connectivity below the threshold, and the practical lesson is the same as in the composite case: the change in outcome per unit change in the control parameter is largest near the threshold, so a firebreak density that is "almost enough" is the worst place to be.

## 12.6 Imaging, sensing, and tissue

**Image segmentation.** Thresholding an image and taking the largest connected component is percolation with a spatially correlated field. The choice of threshold is the choice of $p$, and the "right" threshold is the one at which the structure of interest percolates while the noise does not. The percolation picture explains why a single global threshold fails on heterogeneous images and why hysteresis (two thresholds, one for growth and one for merging) works better: it is an explicit finite-size correction to a critical phenomenon.

**Wireless sensor networks.** Coverage and connectivity are different questions. Coverage is the smooth area fraction of the union of disks (a Boolean model); connectivity is a continuum percolation problem with its own threshold, $\lambda_c\approx1.128$ in two dimensions for the reduced density $\lambda=n\pi r^2$ (Mertens and Moore 2012). Confusing the two produces optimistic deployment rules: coverage is a statement about the union of disks, while connectivity is a statement about a spanning cluster, and at finite density one can have high coverage without a spanning cluster.

**Tissue engineering.** A porous scaffold must have connected pores for cell migration and vascularisation. Below the pore-connectivity threshold, cells remain at the surface and the construct fails to vascularise; above it, penetration is rapid. The threshold depends on pore-size distribution and on cell size, which makes it a *weighted* percolation problem again.

## 12.7 Four case studies, with what the model does not give

*Case 1: carbon-black polymer composite.* Percolation says the conductivity jump occurs at a filler fraction set by filler geometry and dispersion. It does not give the absolute conductivity, which depends on tunnelling between particles, contact resistance, and polymer morphology. Use percolation for the threshold and the power-law exponent; use a transport model for the amplitude.

*Case 2: LFP cathode.* Percolation says the rate capability collapses below a critical additive loading and that the window above it is narrow. It does not give the electrochemical impedance, the lithium diffusion coefficient, or the calendering effect on particle contact. Use percolation to bracket the formulation window, then measure.

*Case 3: measles vaccination.* Percolation gives the herd-immunity threshold for a homogeneous mixing model and its correction for heterogeneous contact networks. It does not give the vaccination coverage actually achieved, the timing of the campaign, or the behaviour of the contact network during a school holiday. Use it to set a target, not to predict an outbreak.

*Case 4: coupled power/communication cascade.* Percolation predicts the existence of a first-order transition and the scaling of the cascade size. It does not predict which line trips first. Use it to compare topologies and to justify redundancy; do not use it to forecast a specific blackout.

The pattern in all four is the same: percolation gives thresholds, scaling and qualitative transitions with remarkable reliability, and gives amplitudes and dynamics poorly or not at all. An application that respects the division of labour is useful; one that quotes a threshold as a material constant is not.

## 12.8 A field guide by domain

The same three questions — what is the graph, what is the control parameter, what connectivity matters — organise every application below. The table is deliberately conservative: it separates a model that has been tested against data from a percolation metaphor that has not.

| Domain | Graph and control | What percolation actually gives | What it does not give | Key sources |
|---|---|---|---|---|
| Conductive composites, electrodes | filler particles and contacts; volume fraction, aspect ratio, dispersion | threshold window and power-law conductivity above it | absolute conductivity, tunnelling, contact resistance | Balberg et al. 1984; Sahimi 2023 |
| Rigidity of glasses and frameworks | constraint graph; mean coordination | mean-field rigidity threshold and constraint-counting algorithm | experimental glass transition, chemistry-specific thresholds | Thorpe 1983; Jacobs and Thorpe 1995 |
| Porous media, CO₂ storage | pore–throat network; saturation, capillary pressure | connected pore fraction, invasion path, relative-permeability shape | pore-scale reaction, multiphase hysteresis | Sahimi 2023; Hunt et al. 2013 |
| Wildfire | fuel cells; fuel density, wind, treatment | qualitative threshold and treatment-placement logic | operational fire spread, weather, suppression | Drossel and Schwabl 1992 (model) |
| Epidemics | contact network; per-contact transmission | final size, random and targeted immunization thresholds | timing, behaviour change, temporal contacts | Newman 2002; Cohen et al. 2003 |
| Infrastructure | multilayer network; coupling strength, redundancy | first-order cascade, mutual giant component | which line trips, operator response | Buldyrev et al. 2010; Parshani et al. 2010 |
| Optimal percolation | graph; removed vertices | minimal dismantling set, influence maximization | exact optimum at scale, costs and constraints | Morone and Makse 2015; Zdeborová et al. 2016; Mugisha and Zhou 2016 |
| Road traffic | evolving road network; removal of bottlenecks | percolation transition in the dynamical network | individual route choice, demand forecast | Li et al. 2015 |
| Finance | interbank exposures; default threshold | cascade condition and systemic-risk ranking | balance-sheet detail, fire sales, policy response | Gai and Kapadia 2010 |
| Social contagion, urban growth | social/contact graph or correlated landscape | threshold for global adoption; correlated-percolation morphology | preferences, media, planning policy | Watts 2002; Solomon et al. 2000; Makse et al. 1995 |
| Quantum information | fusion/measurement graph; gate success probability | percolation threshold for a usable cluster state, erasure threshold | general gate errors, overhead, architecture | Kieling et al. 2007; Stace et al. 2009 |
| Turbulence | directed percolation in space–time | universality class and critical exponents | Navier–Stokes derivation, engineering amplitudes | Lemoult et al. 2016; Sano and Tamai 2016 |

## 12.9 Claims that are easy to get wrong

**“Random immunization is easier on a heterogeneous network.”** It is not. For random immunization the required coverage is
$$
v_c = 1-\frac{1}{T(\kappa-1)},
$$
which grows with $R_0$. If $R_0$ is held fixed, the random coverage is the same for every degree distribution. At fixed mean degree, a heavy-tailed network has a larger $\kappa$, hence a larger $R_0$ and a larger $v_c$; it is **not** easier to protect by random immunization. Targeted immunization of high-degree vertices is the strategy that needs less coverage (Cohen et al. 2003).

**“Two-dimensional site percolation with $p_c\approx0.5927$ is the landscape-connectivity threshold.”** It is the threshold of the square-lattice site model. A real landscape has correlated habitat, weighted movement costs and a species-specific dispersal kernel; the relevant model is correlated or weighted percolation, and the number should be measured, not borrowed.

**“The conductivity exponent is universal and exact.”** In three dimensions $t\approx2.0$ is a numerical value; in two dimensions $t\approx1.299$ is also numerical (Grassberger 1999). The scaling relation $t=\nu(d-2+\zeta)$ is a relation between exponents, not a derivation of their values.

**“The surface-code erasure threshold is exactly the bond-percolation threshold.”** For the specific loss model in Stace et al. (2009), the mapping is useful and the threshold coincides with the corresponding bond-percolation value. General gate errors, measurement errors and circuit-level noise do not map to that single number.

**“Rigidity percolation has a sharp threshold at mean coordination 2.4.”** The $2.4$ value is a mean-field constraint-counting result. Real glasses have different coordination distributions, bond-bending forces and floppy modes; experiments give a range, not a universal constant.

**“Forest-fire models prove that real forests are self-organised critical.”** Drossel–Schwabl is a model with a separation of time scales. Real fire regimes depend on weather, fuel structure, ignition and suppression; the power-law claim is model-conditional.

**“Percolation explains the emergence of capabilities in large language models.”** The language of connectivity and pruning is useful, and $k$-core pruning thresholds are rigorous for random sparse networks. Claims that a specific capability is a percolation transition in a trained transformer are hypotheses about a particular architecture, not theorems.

**“Message passing gives the exact threshold of any real network.”** The non-backtracking criterion is exact on trees and asymptotically on locally tree-like ensembles. Finite cycles, degree correlations and community structure can shift it; the result is a principled approximation, not an exact identity for one observed graph.

The practical rule is the same in every row: state the graph, the control parameter and the connectivity; label the result exact, numerical, model-conditional or metaphorical; and do not quote a threshold as a material constant.
