# Data record and benchmark pipeline

The Data view is a record, not an illustration. Every row on it comes from a seed, a sample count (or replicate count) and a harness that can be rebuilt. The network curves use one configuration per removal fraction and record N in the experiment block.

## Files

| File | Written by | Contents |
|---|---|---|
| `data/raw_bench.json` | `./build/bench` (compiled from `scripts/bench.cpp`) | raw integer counts and sizes; one seed (20241112) |
| `data/benchmarks.json` | `scripts/analyse_bench.py` | raw rows plus `pi`, Cardy formula, collapse fit and one-arm fit |
| `data/golden/rng-seed42.json` | hand-maintained | the random-stream contract |
| `data/golden/parity.json` | hand-maintained | integer-exact cross-language probes |

Generated files should not be edited. Change the harness or the analyser and regenerate.

## Reproduce

```sh
make bench
make analyse
```

The C++ harness is self-contained so that the published record does not depend on the library build. It uses the same xoshiro128** generator and the same lattice edge order as `lib/cpp`, `lib/js`, `lib/python` and `lib/julia`.

## What each experiment measures

| Key | Experiment | Sample sizes | Notes |
|---|---|---|---|
| `crossing` | square bond, free boundaries, `p ∈ [0.44, 0.56]` | 400 for L ≤ 64, 200 for L = 128 | left–right crossing indicator |
| `torus` | square bond on a torus, `p ∈ [0.42, 0.58]` | 100 per point, L = 32, 64, 128 | `S_max` and `chi2` |
| `arm` | center connected to *any* boundary at `p = 1/2` | 800 for L ≤ 64, 400 for L = 128, 256, 200 for L = 512 | one-arm probability proxy; fit uses L ≥ 64 |
| `cardy` | rectangles of width 96, aspect ratio 0.25–4 | 3000 at aspect 0.25, 600 otherwise | left–right crossing at `p = 1/2` |
| `cluster_hist` | square 512 at `p = 1/2` | 20 configurations | log-spaced histogram |
| `network` | configuration model, N = 10000 | 11 fractions | ER random, power-law random/targeted |
| `interdependent` | two coupled ER layers, N = 5000, c = 4 | 50 replicates per p | intersection update; `se`, `reps`, `rounds`, `converged` recorded |
| `kcore` | ER, N = 10000, c = 4.0 | 11 fractions in `p ∈ [0.75, 1.0]` | 3-core peeling; the onset is near `p = 3.35/4` |
| `continuum` | Poisson disks, N = 500 | one configuration per radius | Boolean model |

## Reading the record

- `pi = hits / n` for crossing experiments; the raw `hits` and `n` are kept.
- `torus.smax` is already an average over configurations.
- `chi` is `sum |C|^2 / sum |C|` from the harness, not the mean cluster size.
- `fits.collapse` holds `ν = 4/3` (the exact two-dimensional value) and fits `p_c` by minimising a binned collapse spread; it is a teaching fit, not a precision estimate. The unconstrained two-parameter fit is stored in `fits.collapse.nu_free` as a diagnostic.
- `fits.collapse_smax` repeats the exercise for `S_max` with the exact `β/ν = 5/48` prefactor; `fits.collapse_smax.nu` is still ill-conditioned and is not a result.
- `fits.one_arm.slope` is a log–log fit to the one-arm proxy over `L ≥ 64`; `slope_se` and `ci95` are the OLS standard error and the 95% interval. The expected two-dimensional value is `-5/48`, and the current interval is wide because the largest sizes carry few samples.

The analyser prints the fit and the `p_c` estimates from the `S = 0.5` level. Those estimates are deliberately shown with their bias; Chapter 11 explains why the level crossing is not the recommended estimator.
