# Percolation Atlas

**English** · [简体中文](README_cn.md) · [Deutsch](README_de.md)

[![CI](https://github.com/cxy2696/atlas-percolation/actions/workflows/ci.yml/badge.svg)](https://github.com/cxy2696/atlas-percolation/actions/workflows/ci.yml) [![Pages](https://github.com/cxy2696/atlas-percolation/actions/workflows/pages.yml/badge.svg)](https://github.com/cxy2696/atlas-percolation/actions/workflows/pages.yml) [![Release](https://img.shields.io/github/v/release/cxy2696/atlas-percolation?label=release)](https://github.com/cxy2696/atlas-percolation/releases)

Percolation asks when random connections form a path across a medium: through coffee grounds, a forest, a power grid, a contact network, or a porous electrode. This repository is a trilingual reference on that question. It has 23 chapters, 16 interactive experiments, a 13-part algorithm reader, four reference implementations and 142 sourced references.

The site is a static directory of Markdown, JSON and JavaScript. There is no application server and no runtime framework; the only vendored front-end files are KaTeX and marked. The Python package, command-line tool and JSON API are the same engine in a different wrapper.

**Live site:** <https://cxy2696.github.io/atlas-percolation/> · **Wiki:** <https://github.com/cxy2696/atlas-percolation/wiki> · **Release:** [v4.4.0](https://github.com/cxy2696/atlas-percolation/releases/tag/v4.4.0)

## Start here

- **Read the argument.** Begin with [Chapter 1](https://cxy2696.github.io/atlas-percolation/#/en/atlas/01-foundations), then Chapters 3–7 for the rigorous core. The chapter index is [here](https://cxy2696.github.io/atlas-percolation/#/en/atlas).
- **Run an experiment.** The [experiment index](https://cxy2696.github.io/atlas-percolation/#/en/labs) opens with three guided runs: measure the crossing probability at `p = 1/2`, collapse three lattice sizes, and find the susceptibility peak. Each experiment has a reading guide, a run record and links to the chapter it tests.
- **Check a number.** [Sources](https://cxy2696.github.io/atlas-percolation/#/en/sources) lists every reference with a DOI or stable URL and its audit status. Exact, numerical and conjectural statements are labelled differently; the convention is explained on the [start page](https://cxy2696.github.io/atlas-percolation/#/en/guide).

## Quick start

Requirements: Python 3.10+, Node.js 20+ and a C++20 compiler. Julia 1.9+ is needed only for the Julia suite.

```sh
git clone https://github.com/cxy2696/atlas-percolation.git
cd atlas-percolation
python3 scripts/build_content.py     # manifest, search index, code inventory
python3 scripts/serve.py 8788        # http://127.0.0.1:8788/
```

Open `http://127.0.0.1:8788/`. The site must be served over HTTP because the content loader uses `fetch()`; opening `index.html` from disk will not work. The default route is the start page in English and light mode. Routes use `#/en/...`, `#/zh/...` or `#/de/...`; the theme and language are remembered in `localStorage`.

## What is inside

| Layer | Contents |
|---|---|
| Chapters | 23 chapters in English, Simplified Chinese and German, from the 1957 paper through duality, sharpness, exponents, SLE, random-cluster models, networks, measurement, applications, algorithms, directed and continuum percolation, transport, proofs, design, reproducibility, trees and epidemics. |
| Experiments | 16 interactive models: lattice percolation, crossing collapse, Newman–Ziff, 3D site percolation, Cardy, directed, random-cluster, bootstrap, explosive, invasion, network robustness, coupled cascades, Boolean model, Bethe tree, SIR, and an algorithm studio. |
| Algorithms | 13 routines with the idea, invariant, cost, source file and failure modes: Bernoulli sampler, DSU, bond and site Newman–Ziff, Leath, bootstrap, invasion, Achlioptas, k-core, Hoshen–Kopelman, Bethe fixed point, SIR final size and message passing. |
| Code | C++20 header-only, Julia, Python and JavaScript, sharing the same xoshiro128** stream and lattice edge order. |
| Data | A C++ benchmark harness, a Python analyser, and a JSON record with raw counts, seeds and fits. |
| Checks | Four language suites, cross-language parity probes, RNG golden vectors, translation structure, prose-claim checks and a bibliography audit. |

## Reproduce the checks

```sh
make test          # four suites + parity + translation structure + prose claims
make verify        # translation structure + prose claims + reference audit
make bench         # C++ harness -> data/raw_bench.json
make analyse       # raw JSON -> data/benchmarks.json
make content       # rebuild manifest/search/code inventory
make audit         # Crossref/HTTP reference audit
make package       # wheel + sdist for the Python package
```

A single suite:

```sh
node --test tests/js/*.test.js
PYTHONPATH=lib/python python3 -m unittest discover -s lib/python/tests -v
make -C lib/cpp test
julia --startup-file=no --project=lib/julia lib/julia/test/runtests.jl
```

The parity contract is in `data/golden/parity.json`; the random-stream vectors are in `data/golden/rng-seed42.json`; the algorithm-zoo, v4 solver, site-sweep and message-passing probes are in `data/golden/algorithms-v3.json`. A change to the RNG, the lattice edge order or the consumption order is a breaking change: regenerate the goldens, bump the version and record it in Chapter 14. The exact coverage and limits of the checks are in [`docs/VERIFICATION.md`](docs/VERIFICATION.md).

## Benchmark pipeline

`scripts/bench.cpp` writes only raw counts, sizes and the seed. `scripts/analyse_bench.py` adds derived quantities, the Cardy curve, a collapse fit and a one-arm slope. The Data view reads `data/benchmarks.json`; if the file is absent it shows the commands above rather than inventing a curve.

The benchmark is a teaching dataset, not a high-precision measurement. It is sized to run in minutes on a laptop and to make finite-size behaviour visible. Chapter 11 states what it can and cannot support.

## Python package, CLI and API

The Python package is the distributable form of the engine. It has no runtime dependencies outside the standard library.

```sh
python3 -m pip install -e lib/python

atlas-perc info
atlas-perc sample    --lattice square --mode bond --L 128 --p 0.5 --seed 42
atlas-perc sweep     --lattice square --L 64 --seed 7
atlas-perc bootstrap --L 64 --p 0.55 --r 3 --seed 11
atlas-perc invasion  --L 48 --seed 3
atlas-perc explosive --n 2000 --rule product --seed 7
atlas-perc serve     --port 8080
```

`atlas-perc serve` serves the static site and a JSON API under `/api` (`/api/health`, `/api/thresholds`, `/api/sample`, `/api/sweep`, `/api/bootstrap`, `/api/invasion`, `/api/explosive`, `/api/openapi.json`). The API is a reference service with bounded inputs and no authentication; put it behind a reverse proxy if you expose it publicly. See [`docs/API.md`](docs/API.md).

Deployment options are GitHub Pages (the canonical site), Docker (`Dockerfile`), Netlify, Vercel and Fly.io. Details are in [`deploy/DEPLOY.md`](deploy/DEPLOY.md).

## Repository layout

```
README.md / README_cn.md / README_de.md  repository guide in three languages
content/
  en/ zh/ de/           chapter Markdown, one file per chapter and language
  references.json       primary bibliography (DOI or stable publisher URL)
  citations.json        chapter -> reference keys
  manifest.json         generated; do not edit by hand
  search.json           generated full-text index
  code.json             generated source inventory
data/
  golden/               RNG vectors and cross-language parity probes
  raw_bench.json        generated raw record
  benchmarks.json       generated, analysed record
lib/
  cpp/                  header-only C++20 library + Makefile + tests
  julia/                Julia package + tests
  python/               Python package + tests
  js/                   ES-module engine shared with the site
assets/
  js/views/             overview, atlas reader, experiments, code, algorithms, data, library, sources
  js/labs/              sixteen experiments, with authored guides
  js/lib/               plot, statistics, run-record and notebook helpers
  css/hud.css           shell styles
  css/reading.css       reading layer: type, measure, colour and responsive rules
scripts/
  build_content.py      validates content and generates JSON
  check_translations.py compares section numbers, equation tags and display blocks
  bench.cpp             C++ raw-data harness
  analyse_bench.py      derived data and fits
  serve.py              static preview server
  verify_references.py  Crossref/HTTP bibliography audit
  parity_algorithms.py  algorithm-zoo, v4 solver and message-parity runner
tests/js/               Node test suite
docs/                   API, RNG, algorithms, data, scaling, verification and editorial notes
wiki/                  GitHub wiki source, published by scripts/push_wiki.sh
```

## Design and maintenance

- **Reading first.** Chapters use a 720 px serif measure, sentence-case headings and a light default palette. The instrumentation language is kept for live readouts, not for prose.
- **Content.** Markdown with YAML front matter. Every chapter has a stable id and the same order in every language. `scripts/build_content.py` refuses a partial translation, a duplicate order or an unresolved citation, and `scripts/check_translations.py` refuses a chapter whose section numbers, equation tags or display-block count drift between editions.
- **Translations.** Authored, not machine-translated at runtime. The glossary and voice rules are in [`docs/EDITORIAL.md`](docs/EDITORIAL.md); technical terms are kept consistent across editions. Adding a fourth edition is a content and review task, not an engine change.
- **Experiments.** Every experiment runs the same engine as the library suites. A run record captures the controls, seed, readouts, app version and the commit when available; it can be downloaded as JSON or saved to a local notebook.
- **Accessibility.** Keyboard navigation, visible focus states, semantic headings, text labels for chart series, and a light/dark palette that keeps contrast. Charts are canvas, but every experiment also reports its key numbers as text.
- **Browser support.** Current Chrome, Firefox and Safari with ES modules and `IntersectionObserver`. Without JavaScript the Markdown sources remain readable in `content/`.

## Scope and limits

This is a reference and a teaching instrument. It does not claim new theorems or new precision measurements. Every numerical value is labelled exact or numerical, and the errata table in Chapter 14 records the mistakes found in earlier versions.

Known limits:

- The synthetic market example in the separate `hmm-percolation` repository is not part of this atlas.
- The benchmark is a teaching dataset with a single seed and finite sizes; it is not a precision measurement.
- The 3D exponents are numerical. The 2D exponents are theorem-backed only for site percolation on the triangular lattice; other planar lattices are conjectural.
- The tree and message-passing answers are exact on trees and asymptotic on locally tree-like graphs; on a lattice they are the Bethe approximation.
- The SIR mapping is exact for a constant infectious period; for variable periods it gives the threshold and a mean-field final size, not independent bonds.
- The site does not model real market, epidemiological or infrastructure data.

## Contributing

Corrections are welcome, especially corrections with a source. Read [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`docs/EDITORIAL.md`](docs/EDITORIAL.md) first. A change to a numerical path needs `make test`, the Python suite and `scripts/reproduce.sh`-style regeneration; a change to a claim needs a proof, a citation or an explicit empirical label.

## Licence

Code: MIT (`LICENSE`). Text and figures: CC BY 4.0 (`LICENSE-CONTENT`).
