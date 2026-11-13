"""
    PercolationAtlas

Reference algorithms for percolation theory: a shared xoshiro128** random
stream, square/triangular/honeycomb lattices, Bernoulli site and bond
percolation, Newman-Ziff sweeps, configuration-model networks, continuum
Boolean percolation and Cardy's crossing formula.

The package is the Julia member of a four-language library.  It has no
external dependencies and reproduces the golden vectors in
`data/golden/` exactly.

```julia
using PercolationAtlas
rng = Rng(42)
lat = build_lattice("square", 128)
model = Percolation(lat, "bond")
hits = sum(crosses_lr(sample!(model, 0.5, rng)) for _ in 1:200)
```
"""
module PercolationAtlas

import Base: union!

include("rng.jl")
include("lattice.jl")
include("percolation.jl")
include("network.jl")
include("continuum.jl")
include("cardy.jl")
include("directed.jl")
include("algorithms.jl")

export Rng, seed!, u32!, random, int, bernoulli, shuffle!, normal, state,
       load_state!, rng_test
export Lattice, LATTICE_KINDS, build_lattice, degree_histogram,
       lattice_position, lattice_size
export Dsu, reset!, find, union!, roots, ClusterStats, compute!, chi2,
       max_fraction, mean_size, Percolation, sample!, sample, build!, build,
       ensure_built!, analyze!, analyze, crosses_lr, crosses_tb, newman_ziff,
       newman_ziff_site, cluster_size_distribution
export Graph, degree, poisson_degrees, power_law_degrees, configuration_model,
       all_active, components, dilute, targeted_removal, kcore, mark_giant!,
       interdependent_er, molloy_reed
export poisson_points, boolean_model
export cardy_crossing, cardy_crossing_vertical, cardy_hypergeom, cardy_modulus, CARDY_CONSTANT
export DirectedResult, directed_crossing, directed_crossing_rate, directed_crosses_lr
export neighbours_from_edges, bootstrap_activation, explosive_sweep,
       explosive_random_graph, explosive_percolation, invasion_cluster,
       invasion_percolation, leath_cluster, label_clusters,
       message_passing_percolation
export bethe_threshold, bethe_percolation, poisson_pmf,
       configuration_giant_component, sir_final_size

const PKG_VERSION = v"4.1.0"

end
