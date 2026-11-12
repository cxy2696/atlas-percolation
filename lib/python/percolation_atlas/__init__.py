"""atlas-percolation: reference algorithms for percolation theory.

The package deliberately keeps the numerical core small and explicit.  It is
the Python member of a four-language library (C++, Julia, JavaScript) which
shares one random stream, so that cross-language tests can compare results
bit for bit.

Typical use::

    from percolation_atlas import Rng, build_lattice, Percolation

    rng = Rng(42)
    lat = build_lattice("square", 128)
    model = Percolation(lat, mode="bond")
    hits = sum(model.sample(0.5, rng).crosses_lr() for _ in range(200))
    print(hits / 200)          # ~ 0.5

For production-scale runs use the C++ or Julia implementation; the Python
version favours readability.
"""

from .rng import Rng
from .lattice import build_lattice, degree_histogram, LATTICE_KINDS
from .percolation import Percolation, ClusterStats, newman_ziff, cluster_size_distribution
from .network import (
    Graph,
    poisson_degrees,
    power_law_degrees,
    configuration_model,
    components,
    all_active,
    dilute,
    targeted_removal,
    kcore,
    interdependent_er,
    molloy_reed,
)
from .continuum import boolean_model, poisson_points
from .directed import directed_crossing, directed_crossing_rate, directed_crosses_lr
from .cardy import cardy_crossing, cardy_crossing_vertical, cardy_hypergeom, cardy_modulus, CARDY_CONSTANT
from .algorithms import (
    neighbours_from_edges,
    bootstrap_activation,
    bootstrap_lattice,
    explosive_sweep,
    explosive_percolation,
    explosive_random_graph,
    invasion_cluster,
    invasion_percolation,
    leath_cluster,
    BootstrapResult,
    ExplosiveResult,
    ExplosiveGraphResult,
    InvasionResult,
    LeathResult,
)

__version__ = "3.0.0"

__all__ = [
    "Rng",
    "build_lattice",
    "degree_histogram",
    "LATTICE_KINDS",
    "Percolation",
    "ClusterStats",
    "newman_ziff",
    "cluster_size_distribution",
    "Graph",
    "poisson_degrees",
    "power_law_degrees",
    "configuration_model",
    "components",
    "all_active",
    "dilute",
    "targeted_removal",
    "kcore",
    "interdependent_er",
    "molloy_reed",
    "boolean_model",
    "poisson_points",
    "directed_crossing",
    "directed_crossing_rate",
    "directed_crosses_lr",
    "cardy_crossing",
    "cardy_crossing_vertical",
    "cardy_hypergeom",
    "cardy_modulus",
    "CARDY_CONSTANT",
    "neighbours_from_edges",
    "bootstrap_activation",
    "bootstrap_lattice",
    "explosive_sweep",
    "explosive_percolation",
    "explosive_random_graph",
    "invasion_cluster",
    "invasion_percolation",
    "leath_cluster",
    "BootstrapResult",
    "ExplosiveResult",
    "ExplosiveGraphResult",
    "InvasionResult",
    "LeathResult",
]
