# Applications

Chapter 12 is the protocol and the case studies. This page is the short field guide: what the graph and control parameter are, what percolation gives, and where the claim stops.

| Domain | Graph and control | What percolation gives | What it does not give | Sources |
|---|---|---|---|---|
| Conductive composites, electrodes | filler particles and contacts; volume fraction, aspect ratio, dispersion | threshold window and power-law conductivity above it | absolute conductivity, tunnelling, contact resistance | Balberg et al. 1984; Sahimi 2023 |
| Rigidity of glasses and frameworks | constraint graph; mean coordination | mean-field rigidity threshold, constraint counting | experimental glass transition, chemistry | Thorpe 1983; Jacobs and Thorpe 1995 |
| Porous media, CO₂ storage | pore–throat network; saturation, capillary pressure | connected pore fraction, invasion path, relative-permeability shape | pore-scale reaction, hysteresis | Sahimi 2023; Hunt et al. 2013 |
| Wildfire | fuel cells; density, wind, treatment | qualitative threshold and placement logic | operational fire spread, weather, suppression | Drossel and Schwabl 1992 (model) |
| Epidemics | contact network; transmission per contact | final size, random and targeted immunization thresholds | timing, behaviour change, temporal contacts | Newman 2002; Cohen et al. 2003 |
| Infrastructure | multilayer network; coupling, redundancy | first-order cascade, mutual giant component | which line trips, operator response | Buldyrev et al. 2010; Parshani et al. 2010 |
| Optimal percolation | graph; removed vertices | minimal dismantling set, influence maximization | exact optimum at scale, costs | Morone and Makse 2015; Zdeborová et al. 2016; Mugisha and Zhou 2016 |
| Road traffic | evolving road network; bottleneck removal | percolation transition in the dynamical network | individual route choice, demand forecast | Li et al. 2015 |
| Finance | interbank exposures; default threshold | cascade condition and systemic-risk ranking | balance-sheet detail, fire sales, policy | Gai and Kapadia 2010 |
| Social contagion, urban growth | social graph or correlated landscape | global adoption threshold; correlated morphology | preferences, media, planning | Watts 2002; Solomon et al. 2000; Makse et al. 1995 |
| Quantum information | fusion graph; gate success probability | cluster-state percolation threshold, erasure threshold | general gate errors, overhead, architecture | Kieling et al. 2007; Stace et al. 2009 |
| Turbulence | directed percolation in space–time | universality class and exponents | Navier–Stokes derivation, engineering amplitudes | Lemoult et al. 2016; Sano and Tamai 2016 |

## Claims that are easy to get wrong

- **Random immunization on a heterogeneous network is not easier.** The required coverage is `v_c = 1 − 1/R₀` with `R₀ = T(κ−1)`. At fixed `R₀` the formula is the same for every degree distribution. At fixed mean degree, a heavy-tailed network has a larger `κ` and `R₀`, so it needs *more* random coverage, not less. Targeted immunization of hubs is what lowers the requirement (Cohen et al. 2003).
- **0.5927 is the square-lattice site threshold, not a universal landscape constant.** Real landscapes have correlated habitat, weighted movement and species-specific dispersal; use correlated or weighted percolation and measure the threshold.
- **The conductivity exponent is numerical.** `t ≈ 2.0` in 3D and `t ≈ 1.299` in 2D are simulation values; `t = ν(d − 2 + ζ)` relates exponents, it does not derive them.
- **The surface-code erasure threshold equals a bond-percolation threshold only in the specific loss model** of Stace et al. (2009). General gate and measurement errors do not map to that number.
- **The rigidity value 2.4 is mean-field.** Real glasses have different coordination distributions, bending forces and floppy modes; experiments give a range.
- **Forest-fire criticality is model-conditional.** Drossel–Schwabl assumes separated time scales; real fire regimes depend on weather, fuel and suppression.
- **Message passing is exact on trees and locally tree-like ensembles.** Finite cycles, degree correlations and communities can shift the threshold; it is a principled approximation for an observed graph.
- **“Emergence is a percolation transition” is a hypothesis** for a particular architecture, not a theorem, even when pruning thresholds are rigorous for random sparse networks.

The rule: state the graph, the control parameter and the connectivity; label the result exact, numerical, model-conditional or metaphorical; and do not quote a threshold as a material constant.
