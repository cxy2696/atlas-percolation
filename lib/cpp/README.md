# atlas-percolation — C++ edition

Header-only C++20 implementation.  The random stream, lattice edge order and
RNG consumption order match the JavaScript/Python references bit for bit.

## Build and run

    cd lib/cpp
    make test      # build and run the self-contained test harness
    make bench     # build and run the benchmark (JSON on stdout)
    make clean     # remove build/

Requires a C++20 compiler and `make`; there are no external dependencies.
The Makefile uses `-O2 -std=c++20 -Wall -Wextra -Wpedantic`.

## API map

| header | contents |
|---|---|
| `percolation_atlas/rng.hpp` | `Rng`: xoshiro128**, `random()`, `next_int(n)` (the reference `int(n)`), `shuffle`, `bernoulli`, `normal` |
| `percolation_atlas/lattice.hpp` | `build_lattice(kind, L, torus)`, `degree_histogram`, `Lattice` |
| `percolation_atlas/percolation.hpp` | `Dsu`, `ClusterStats`, `Percolation`, `newman_ziff` |
| `percolation_atlas/network.hpp` | `poisson_degrees`, `power_law_degrees`, `configuration_model`, `components`, `kcore`, `targeted_removal`, `interdependent_er`, `molloy_reed` |
| `percolation_atlas/continuum.hpp` | `poisson_points`, `boolean_model` |
| `percolation_atlas/cardy.hpp` | `cardy_crossing`, `cardy_crossing_vertical`, `cardy_hypergeom`, `cardy_modulus` |
| `percolation_atlas/directed.hpp` | `directed_crossing`, `directed_crosses_lr`, `directed_crossing_rate` |
| `percolation_atlas/atlas.hpp` | umbrella header for all of the above |

All types live in `namespace atlas`.  `make test` checks the golden RNG
vectors (including the six normals), every `parity.json` probe (including
directed percolation), Cardy values, edge-case regressions, sanity checks and
crossing duality; the golden values are embedded, so the test binary runs
standalone.
