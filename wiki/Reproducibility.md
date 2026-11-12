# Reproducibility

The atlas is built so that a number can be traced to a seed, a size, an estimator and a version.

## The random stream

xoshiro128** with SplitMix32 seeding. The conventions are fixed:

- seed reduced modulo `2^32`;
- four SplitMix32 steps at seed time;
- `random()` consumes two 32-bit outputs, high 26 bits then low 27 bits, returning an exact multiple of `2^-53`;
- `int(n)` uses rejection sampling;
- site percolation draws `n` uniforms in site order; bond percolation draws `m` uniforms in `build_lattice` order.

Every implementation follows this order. `docs/RNG.md` is the specification; `data/golden/rng-seed42.json` is the check.

## Parity contracts

| Contract | Languages | Golden file |
|---|---|---|
| Bernoulli core | C++20, Julia, Python, JavaScript | `data/golden/parity.json` |
| v3 algorithm zoo | Python, JavaScript | `data/golden/algorithms-v3.json` |

Run:

```sh
python3 scripts/parity.py
python3 scripts/parity_algorithms.py
```

A parity test says that two implementations agree on an integer or an exact component size for a fixed input. That is stronger than a statistical comparison and catches most silent bugs.

## Statistical protocol

- Independent seeds, not one long run.
- Common random numbers when comparing algorithms or designs.
- Block over independent edge orders for a Newman–Ziff sweep.
- Report 95% intervals, not bare standard deviations.
- Fix the stopping rule in advance.

## Error budget

| Source | Controlled by | Typical size |
|---|---|---|
| Random stream | independent seeds, paired comparisons | `O(n^-1/2)` |
| Finite size | collapse fit, correction term, several `L` | `O(L^-1/ν)` |
| Discretisation | refine the step, compare two resolutions | problem-specific |
| Estimator bias | use the better estimator, report both | ~`10^-2` in the teaching benchmark |
| Model error | validation on held-out data, sensitivity | often dominant |

The last line is the one a simulation cannot remove. A perfect error bar on the wrong graph is still wrong.

## Reproduce the record

```sh
make content
make bench
make analyse
make test
```

`data/benchmarks.json` is what the Data view reads. If it is missing, the view shows the commands instead of inventing a curve.

## What is not bit-reproducible

- Browser wall-clock timings.
- Last bits of `sin`, `exp`, `log` and the hypergeometric evaluation across libm versions.
- A live web page after a release; the repository tag and the archived `_site/` artifact are the reproducible objects.

Next: [[References]].
