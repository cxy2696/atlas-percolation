# PercolationAtlas (Julia)

Julia edition of the four-language atlas-percolation library.  No external
dependencies; `Test` (stdlib) is used by the suite.  Julia >= 1.9.

## Install / load
From the repository root:

```sh
julia --project=lib/julia -e 'using PercolationAtlas'
```

(REPL: `] activate lib/julia`, then `using PercolationAtlas`.)

## Run the tests
```sh
julia --project=lib/julia lib/julia/test/runtests.jl
```

The suite reproduces `data/golden/rng-seed42.json`, all `parity.json` probes,
the Cardy reference values, the duality crossing rate, and the algorithm-zoo
and v4 tree/epidemic probes in `data/golden/algorithms-v3.json`.

## API map
| area | API |
|---|---|
| RNG | `Rng`, `u32!`, `random`, `int`, `shuffle!`, `normal`, `rng_test` |
| Lattice | `build_lattice`, `LATTICE_KINDS`, `degree_histogram`, `lattice_position` |
| Percolation | `Percolation`, `sample!`, `build!`, `analyze!`, `crosses_lr`, `crosses_tb`, `newman_ziff` |
| Network | `poisson_degrees`, `power_law_degrees`, `configuration_model`, `components`, `kcore`, `interdependent_er`, `molloy_reed` |
| Continuum / Cardy | `boolean_model`, `poisson_points`; `cardy_crossing`, `cardy_hypergeom`, `cardy_modulus` |
| Directed | `directed_crossing`, `directed_crosses_lr`, `directed_crossing_rate` |
| Algorithms / trees | `bootstrap_activation`, `explosive_*`, `invasion_*`, `leath_cluster`, `label_clusters`, `bethe_percolation`, `configuration_giant_component`, `sir_final_size` |

## Parity notes
* xoshiro128** + SplitMix32, pure `UInt32` arithmetic; site draws `n`
  uniforms, bond `m`, configuration model one stub shuffle, continuum `2n`.
* 0-based public indices, 1-based internal union-find, `Int32`/`UInt8` arrays.
  Parity probes match exactly (244, 151, [10,109,256], 1883, 0.5306666666666666,
  directed 354/328); Cardy agrees to 1e-12.
* Benchmark: 256x256 square bond, 200 samples, p=0.5, seed 2024: ~0.24 s
  (76 crossings, same as JS) on Julia 1.11.6.
