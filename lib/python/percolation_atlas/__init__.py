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
from .cardy import cardy_crossing, cardy_crossing_vertical, cardy_hypergeom, cardy_modulus, CARDY_CONSTANT

__version__ = "2.0.0"

__all__ = [
    "Rng",
    "build_lattice",
    "degree_histogram",
    "LATTICE_KINDS",
    "Percolation",
    "ClusterStats",
    "newman_ziff",
    "cluster_size_distribution",
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
    "cardy_crossing",
    "cardy_crossing_vertical",
    "cardy_hypergeom",
    "cardy_modulus",
    "CARDY_CONSTANT",
]
