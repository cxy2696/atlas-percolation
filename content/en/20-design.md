---
id: 20-design
part: synthesis
order: 20
title: Design under uncertainty
subtitle: Choosing edges, doses, fillers and firebreaks when the medium is random
reading: 22 min
---

The previous chapters answer “what happens at this density?”. Design asks the inverse question: “which density, which edges, which allocation gives a required reliability at acceptable cost?”. That inversion changes the mathematics. A percolation threshold becomes a constraint, a power-law becomes a cost curve, and a finite-size correction becomes the difference between a safe design and a failed one.

## 20.1 The design template

Every design problem in this chapter fits one template.

1. **Decision variables.** Which edges to add ($x_e\in\{0,1\}$), which vertices to protect ($y_v$), the filler fraction $\phi$, the firebreak density $\rho$, the number of sensors $n$, the coupling strength between layers.
2. **Random medium.** The realisation of open/closed elements, contact transmission, pore-size disorder or fuel connectivity. Its law is a model choice, and the model choice is part of the claim.
3. **Performance functional.** The probability of a spanning cluster, the size of the giant component, the expected fraction of demand served, the probability that a cascade stays below a budget, or a quantile of the first-passage time.
4. **Cost.** Money, mass, energy, added edges, vaccinated-person-days, maintenance. Design without a cost is a wish.
5. **Constraint.** A minimum reliability, a maximum budget, an equity constraint, or a regulatory limit.

The output is not a single number but a curve: reliability versus cost. A design point is a point on that curve, and the curve is the useful object.

## 20.2 Monotonicity is not submodularity

Adding edges cannot reduce connectivity, so the performance functional is monotone in the set of edges. Monotonicity alone does not give a good greedy algorithm. The greedy guarantee for maximising a monotone **submodular** function requires diminishing returns: adding an edge to a small set must help at least as much as adding it to a large set.

For coverage problems (union of disks, influence maximisation with independent cascade) submodularity holds and the greedy algorithm has a $(1-1/e)$ guarantee. For **connectivity** the situation is different: adding an edge can be redundant in a large set and decisive in a small one, and the expected giant-component size is not generally submodular. Two honest options are available.

- Use a surrogate that is submodular (coverage, spectral connectivity, number of protected demand pairs) and validate the final design with the true percolation objective.
- Use a derivative-free or mixed-integer search with a stated optimality gap, and report that gap. Do not call a greedy heuristic optimal because the objective is monotone.

## 20.3 Networks: robustness at a price

The configuration-model result $f_c=1-1/(\kappa-1)$ with $\kappa=\langle k^2\rangle/\langle k\rangle$ says that heterogeneity protects against random loss and exposes the network to targeted loss. Design follows from the two terms.

- **Truncate the tail.** Capping the degree at $k_{\max}$ reduces $\kappa$ and makes the network less fragile under targeting, at the cost of the capacity that the hubs provided. The optimal cap is a cost problem, not a theorem.
- **Add redundancy, not just edges.** A second path between two regions costs more than one extra edge but changes the failure mode from disconnection to graceful degradation.
- **Protect the hubs.** Guarding a small number of high-degree vertices is efficient against targeted attack; it is almost useless against random loss. Allocate the budget according to the threat model, not according to the average degree.
- **Measure the right curve.** A robustness audit that reports $f_c$ alone hides the cascade. Report $S(f)$ for both random and targeted removal, with the number of cascade rounds.

For coupled infrastructures the design variables are coupling strength and redundancy. A one-to-one dependency produces a first-order transition at $p_c=2.4554/c$; partial coupling or multiple dependencies restores a continuous transition (Buldyrev et al. 2010; Parshani et al. 2010). The engineering question is not “is coupling bad?” but “how much coupling can we afford to remove?”.

## 20.4 Epidemics: doses, targets and timing

For an SIR process on a configuration-model network, the final size is the giant component after each edge is retained with the per-contact transmission probability $T$. With $R_0=T(\kappa-1)$, random immunisation needs a fraction
$$
v_c=1-\frac{1}{R_0}
$$
of the population. Targeted immunisation of high-degree vertices is more efficient when the degree distribution is heavy-tailed; the gain is largest exactly where random allocation is worst.

Three design cautions. First, the formula is for a static network and a Markovian epidemic; temporal and behavioural networks change the threshold. Second, the herd-immunity threshold is about the final size in an infinite population, not the peak or the time course. Third, equity is a constraint, not an afterthought: the cheapest allocation by doses may systematically leave the most exposed group below its local threshold.

## 20.5 Materials and electrodes: a narrow window

A conductive composite needs the filler network above its percolation threshold. The threshold is controlled by geometry more than by mass: the excluded volume of a rod scales with its aspect ratio, so nanotubes and graphene percolate at fractions far below carbon black. The design variables are aspect ratio, dispersion quality, alignment and loading.

The engineering optimum sits just above the threshold, where conductivity rises steeply with loading but the additive still displaces active material. That window is narrow for two reasons: the percolation conductivity is a power law, and the batch-to-batch scatter of the effective occupancy is largest near the threshold. A design that targets the middle of the window will fail on the low side of a batch distribution; a design that targets the upper edge pays an energy-density penalty. The robust choice depends on the cost of failure, not on the mean.

The same structure appears in battery electrodes, fuel-cell catalyst layers, solid electrolytes and thermal interface materials: two or more networks must percolate simultaneously, which is a **two-phase** percolation problem, not two independent ones.

## 20.6 Porous media and energy storage

In a porous rock the pore space is the site graph and the throats are the bonds. The water-filled subgraph thins as saturation falls, and the hydraulic conductance vanishes at a critical saturation. The design variables are pore-size distribution, wettability and the fracture/matrix contrast.

Invasion percolation is the right model when the displacement is controlled by the capillary pressure threshold, not by random occupation. The invasive cluster follows the lowest-threshold boundary edge, so the path is selected, not sampled. This is why a single “critical saturation” is not a material constant: it depends on the pressure path and on the ratio of throat sizes. For contaminant transport, the practical output is a quantile of the arrival-time distribution, not its mean; near the threshold the mean is dominated by rare fast paths.

## 20.7 Fire, sensors, images and tissue

**Wildfire.** Fuel connectivity is the control parameter. A firebreak reduces the effective density; the percolation picture says the change in fire size per unit of treatment is largest near the threshold, so a treatment density that is “almost enough” is the worst place to be. The design question is where to place the treatment, not only how much: a barrier that does not close a spanning path buys little.

**Sensor deployment.** Coverage and connectivity are different functionals. Coverage is the area fraction of the union of disks, $1-e^{-\lambda}$ for a Poisson deployment; connectivity is a spanning cluster with onset $\lambda_c\approx1.128$ in two dimensions (Mertens and Moore 2012). At $\lambda\approx0.7$ the field can be 50% covered and still disconnected. A deployment rule that equates the two overstates reliability.

**Image segmentation.** Thresholding an image and taking the largest connected component is percolation on a correlated field. The choice of threshold is the choice of $p$. Hysteresis (a high threshold for seeds, a low threshold for growth) is a finite-size correction to a critical phenomenon; it works because the two thresholds separate the nucleation and the growth of the structure of interest.

**Tissue engineering.** A scaffold must have connected pores above the cell-size cutoff. The relevant model is weighted percolation: a pore below the cell diameter is closed for migration even if it is geometrically open. The design variable is the pore-size distribution, not the mean porosity.

## 20.8 A scenario table

| Domain | Control variable | Performance | Main constraint | Suggested method | Validation |
|---|---|---|---|---|---|
| Communication network | added links, degree cap | giant component under attack | budget, latency | multi-objective search + percolation audit | targeted/random $S(f)$ |
| Epidemic | vaccine doses, target group | final size below budget | doses, equity | percolation threshold + allocation LP | contact-network simulation |
| Power/communication coupling | coupling strength, redundancy | cascade size | cost, operating limits | coupled giant-component iteration | N-1 and N-k scenarios |
| Conductive composite | filler fraction, aspect ratio | conductivity above target | viscosity, cost | excluded-volume estimate + percolation curve | batch distribution |
| Battery electrode | additive loading, calendering | rate capability | energy density | two-phase percolation window | impedance + cycling |
| Porous medium | pore-size distribution, wettability | hydraulic conductance | permeability, cost | invasion percolation / effective medium | core-flood data |
| Wildfire | treatment placement, density | fire size distribution | budget, ecology | percolation threshold + spatial optimisation | landscape simulation |
| Sensor field | number, radius, placement | coverage and connectivity | cost, power | Boolean model + connectivity audit | deployment test |
| Scaffold | pore-size distribution | connected pore fraction | stiffness, manufacturability | weighted percolation | imaging + cell penetration |

The table is a map, not a recipe. Each row needs its own model validation; the percolation part supplies thresholds and scaling, not the amplitude.

## 20.9 Optimisation algorithms, honestly

Three families are useful.

- **Exact on small instances.** Mixed-integer programming for edge selection with a connectivity cut, solved to a stated gap for graphs up to a few hundred edges. The percolation objective is replaced by a deterministic connectivity constraint on a scenario set; the result is only as good as the scenario set.
- **Greedy with a surrogate.** Coverage, spectral connectivity or protected demand pairs are submodular or nearly so. Use the $(1-1/e)$ guarantee for the surrogate, then re-evaluate on the true percolation objective. Report both numbers.
- **Stochastic search.** Simulated annealing or evolutionary search on the edge set, with the percolation objective estimated by Monte Carlo. The noise in the objective is part of the algorithm; use common random numbers across candidate designs so that comparisons are not dominated by sampling noise.

A design claimed to be optimal should state the objective, the scenario distribution, the solver, the gap or the number of samples, and the validation set. Without those, “optimal” means “the best point we happened to try”.

## 20.10 Validation and the cost of being wrong

A percolation design is a model-based decision, and the model has four error sources: the graph, the occupation law, the finite-size correction and the performance estimator. A validation protocol should address each.

1. **Hold out a network or a batch.** Fit on one realisation, test on another. A design that only works on the graph used to tune it is overfitted.
2. **Report the finite-size gap.** If the design is evaluated on $L=64$ but deployed at $L=10^6$, say so and estimate the direction of the bias.
3. **Stress the tail.** Evaluate at the 5th and 95th percentiles of the uncertain parameters, not only at the mean.
4. **Compare with a trivial baseline.** Random allocation, uniform loading, no treatment. A complex optimisation that beats the baseline by less than its own uncertainty is not evidence.
5. **State the failure mode.** Disconnection, cascade, slow drift, or a threshold that moves with temperature. The failure mode determines which metric matters.

The honest summary is uncomfortable but useful: percolation is excellent at telling you *where* the cliff is and *how steep* it is, and poor at telling you the exact height of the fence you need. Design with the cliff in mind, measure the fence, and keep a margin for the part of the model you cannot verify.
