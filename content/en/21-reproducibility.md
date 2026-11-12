---
id: 21-reproducibility
part: Methods
order: 21
title: Reproducibility, uncertainty and the error budget
subtitle: From a seed to a published number, and back again
reading: 18 min
---

A result that cannot be reproduced is a story. This chapter states the contract the atlas uses, the commands that check it, and the places where a careful reader should still be suspicious. The goal is not to claim that every number is exact; it is to make every number traceable to a seed, a size, an estimator and a version.

## 21.1 The artifact contract

The repository is the artifact. Five things are versioned together.

1. **Sources.** Markdown chapters, JSON bibliography, citation map.
2. **Engine.** C++20, Julia, Python and JavaScript implementations of the core; Python and JavaScript for the v3 algorithm zoo.
3. **Goldens.** `data/golden/parity.json` for the four-language core, `data/golden/rng-seed42.json` for the random stream, `data/golden/algorithms-v3.json` for the new algorithms.
4. **Data.** Raw benchmark counts and the analysed record, with the harness that produced them.
5. **Build and deploy.** The content builder, the static server, the Python package, the API, the Dockerfile and the CI workflows.

A change to the RNG, the edge order or the consumption order is a breaking change. It requires regenerating the goldens, bumping the version and recording the correction in Chapter 14. The same applies to a change in a sampling convention, even if the code still “looks right”.

## 21.2 The random stream

The generator is xoshiro128** with SplitMix32 seeding. The conventions are fixed:

- the seed is reduced modulo $2^{32}$;
- seeding performs four SplitMix32 steps;
- `random()` consumes two 32-bit outputs, high 26 bits then low 27 bits, and returns an exact multiple of $2^{-53}$ in $[0,1)$;
- `int(n)` uses rejection sampling against the largest multiple of $n$ not exceeding $2^{32}$;
- site percolation draws $n$ uniforms in site order; bond percolation draws $m$ uniforms in the edge order produced by `build_lattice`.

Every implementation follows this order. The golden file stores raw outputs after a fixed number of draws, so a disagreement is caught before it becomes a wrong exponent. The full specification is in `docs/RNG.md`.

## 21.3 The parity tests

The core parity contract is four-language. `scripts/parity.py` computes the Python probes, runs `scripts/parity_probe.mjs` for JavaScript, and compares both with `data/golden/parity.json`; the C++ and Julia suites assert the same values from the same file.

The v3 algorithm zoo has a two-language contract. `scripts/parity_algorithms.py` compares Python and JavaScript on bootstrap activation times, invasion order, Leath cluster size, and the Achlioptas trajectories. The scope is stated in the golden file; the atlas does not pretend that the C++ and Julia libraries implement these routines.

Run them with:

```sh
python3 scripts/parity.py
python3 scripts/parity_algorithms.py
node --test tests/js/*.test.js
PYTHONPATH=lib/python python3 -m unittest discover -s lib/python/tests -v
```

A parity test is not a statistical test. It says that two implementations agree on an integer or an exact component size for a fixed input. That is the strongest check available before a statistical comparison, and it is the one that catches the majority of silent bugs.

## 21.4 The statistical protocol

A Monte Carlo estimate needs four numbers: the sample size, the seed (or the seed list), the estimator and the uncertainty. The atlas uses the following rules.

- **Independent seeds, not one long run.** For a threshold estimate, run $R$ independent seeds, each producing an estimate, and report the mean and the standard error over the $R$ estimates. A single long run underestimates the variance because successive configurations are correlated.
- **Common random numbers for comparisons.** When comparing two algorithms or two designs, use the same disorder realisations. The comparison is then paired, and the variance of the difference is much smaller than the variance of either mean.
- **Blocking for correlated sweeps.** A Newman–Ziff sweep produces correlated points. Error bars come from independent edge orders, not from the $m$ points along one order.
- **Intervals, not standard deviations.** Report a 95% interval. For a proportion near 0 or 1 use Wilson or Jeffreys; for a small number of seeds use a $t$ interval and say so.
- **Pre-register the stopping rule.** “We ran until it looked converged” is not a stopping rule. Fix the number of seeds or the target half-width in advance.

## 21.5 The error budget

Every numerical claim in the atlas has an error budget with five lines.

| Source | What it is | How it is controlled | Typical size |
|---|---|---|---|
| Random stream | finite sample of disorder | independent seeds, paired comparisons | $O(n^{-1/2})$ |
| Finite size | $L/\xi$ not infinite | collapse fit, correction term, several $L$ | $O(L^{-1/\nu})$ |
| Discretisation | lattice or time step approximates a continuum | refine the step, compare two resolutions | problem-specific |
| Estimator bias | e.g. $S=0.5$ crossing instead of a collapse | use the better estimator, report both | $10^{-2}$ in the teaching benchmark |
| Model error | the graph or occupation law is wrong | validation on held-out data, sensitivity analysis | often dominant |

The last line is the one that matters most in applications and the one that a simulation cannot reduce. A percolation model with a perfect error bar on the wrong graph is still wrong.

## 21.6 Reproducing a figure

Each figure in the Data view names its source record and the command that produced it. The sequence is:

```sh
make content       # regenerate manifest, search index, code inventory
make bench         # C++ harness -> data/raw_bench.json
make analyse       # raw counts -> data/benchmarks.json
make test          # four language suites + parity
make serve         # http://127.0.0.1:8788/
```

The benchmark is a teaching dataset, not a high-precision measurement. It is sized to run in minutes and to make finite-size behaviour visible. The Data view shows the exact sample sizes, the seed and the date; if the file is missing, it shows the commands instead of inventing a curve.

## 21.7 The algorithm package

The Python package is the distributable form of the engine.

```sh
python3 -m pip install -e lib/python
atlas-perc info
atlas-perc sample --lattice square --mode bond --L 128 --p 0.5 --seed 42
atlas-perc sweep  --lattice square --L 64 --seed 7
atlas-perc bootstrap --L 64 --p 0.55 --r 3 --seed 11
atlas-perc invasion  --L 48 --seed 3
atlas-perc explosive --n 2000 --rule product --seed 7
atlas-perc serve --port 8080
```

`atlas-perc serve` exposes the same static site plus a JSON API:

| Route | Purpose |
|---|---|
| `GET /api/health` | version, build time, engine status |
| `GET /api/thresholds` | exact and numerical thresholds with status |
| `POST /api/sample` | one configuration, cluster statistics |
| `POST /api/sweep` | Newman–Ziff curve |
| `POST /api/bootstrap` | bootstrap closure |
| `POST /api/invasion` | invasion cluster |
| `POST /api/explosive` | Achlioptas trajectory |
| `GET /api/openapi.json` | machine-readable schema |

The API is intentionally small and has no authentication. It is a reference service, not a production multi-tenant deployment. For a public deployment, put it behind a rate limiter and a reverse proxy; the Dockerfile is a starting point, not a hardened appliance.

## 21.8 A reporting checklist

Before a percolation number leaves the notebook, answer these questions.

- [ ] Is the model stated as a graph plus an occupation law?
- [ ] Are the boundary conditions stated (open, periodic, wired)?
- [ ] Is the estimator defined, and is it the one you actually computed?
- [ ] Is the sample size given, and is the seed or seed list archived?
- [ ] Is the uncertainty a standard error, a confidence interval or a standard deviation?
- [ ] Is the finite-size correction estimated, or is the claim explicitly asymptotic?
- [ ] Is the value labelled exact, numerical or conjectural?
- [ ] Is the code version or commit recorded?
- [ ] Does a second implementation reproduce the integer probes?
- [ ] Is the failure mode of the model stated?

A reader who can answer all ten can reproduce the number. A reader who cannot has a story, not a result.

## 21.9 What cannot be reproduced

Three things in this atlas are not bit-reproducible.

1. **Wall-clock timings.** The algorithm studio reports browser timings for teaching; they depend on the machine, the JIT and the load. Use the C++ harness for measurements intended to compare implementations.
2. **Floating-point transcendental functions.** `sin`, `exp`, `log` and the hypergeometric evaluation can differ in the last bits across libm versions. The golden files use tolerances for those values and exact equality only for integers and component sizes.
3. **A published web page.** The live site can change after a release. The repository tag and the archived `_site/` artifact are the reproducible objects; the URL is a convenience.

Being explicit about these limits is part of the reproducibility claim, not a contradiction of it.
