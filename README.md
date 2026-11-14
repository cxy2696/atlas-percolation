# Percolation Atlas

**English** · [简体中文](README_cn.md) · [Deutsch](README_de.md)

[![CI](https://github.com/cxy2696/atlas-percolation/actions/workflows/ci.yml/badge.svg)](https://github.com/cxy2696/atlas-percolation/actions/workflows/ci.yml) [![Pages](https://github.com/cxy2696/atlas-percolation/actions/workflows/pages.yml/badge.svg)](https://github.com/cxy2696/atlas-percolation/actions/workflows/pages.yml) [![Release](https://img.shields.io/github/v/release/cxy2696/atlas-percolation?label=release)](https://github.com/cxy2696/atlas-percolation/releases)

A trilingual, source-backed atlas of percolation theory with four reference implementations, sixteen interactive laboratories and a thirteen-entry algorithm reader. The site is a static, dependency-free HUD: it reads Markdown, JSON and the JavaScript engine directly, and it can be archived or served from any static host.

**Live content:** 23 chapters in English, Simplified Chinese and German · 16 laboratories · 13 code walkthroughs · 4 language implementations · 140 references · a pip-installable algorithm package. The site opens in **light mode, English** by default and remembers a reader's choice.

## What is inside

| Layer | Contents |
|---|---|
| Knowledge base | 23 chapters from the founding 1957 paper through duality, sharpness, exponents, SLE, random-cluster models, networks, measurement, applications, algorithms, directed and continuum percolation, transport, the cross-disciplinary map, a proofs appendix, design under uncertainty, reproducibility, trees and generating functions, and epidemics as percolation |
| Sources | 140 references (articles, books, blog notes, software) with DOI or URL links, a Crossref/HTTP audit record (138 verified, 2 explanatory notes), per-chapter source lists, and an errata table |
| Code | C++20 (header-only), Julia, Python and JavaScript, all consuming the same xoshiro128** stream and the same lattice edge order |
| Laboratories | Lattice percolation, crossing collapse, Newman–Ziff sweep, network robustness, coupled cascades, the Boolean model, Cardy's formula, directed percolation, random-cluster/Potts, bootstrap percolation, explosive percolation, invasion percolation, an algorithm studio, the Bethe tree, SIR as percolation, and three-dimensional site percolation |
| Algorithms | A thirteen-entry reader: Bernoulli sampler, DSU, bond and site Newman–Ziff, Leath, bootstrap, invasion, Achlioptas, k-core, Hoshen–Kopelman, the Bethe fixed point, the SIR final size and message passing. Each entry gives the idea, invariant, cost, pitfalls and links to the exact source. |
| Data | A C++ benchmark harness, a Python analyser, and a JSON record that the Data view reads without hiding missing data |
| Tests | Integer-exact parity probes across all four implementations, including the algorithm zoo, the v4 tree/epidemic solvers, the site sweep and message passing; RNG golden vectors, property tests, and a reference audit |
| Examples | Side-by-side calls for the same experiment in all four languages: `docs/EXAMPLES.md`; the code-reading map: `docs/ALGORITHMS.md`; a CLI and JSON API: `docs/API.md` |

**Live site:** <https://cxy2696.github.io/atlas-percolation/> · **Wiki:** <https://github.com/cxy2696/atlas-percolation/wiki> (source in `wiki/`) · **Release:** [v4.2.0](https://github.com/cxy2696/atlas-percolation/releases/tag/v4.2.0) · **Package:** `pip install -e lib/python`

## Quick start

Requirements: Python 3.10+, Node.js 20+ for the tests and the site build, and a C++20 compiler. Julia 1.9+ is needed only for the Julia suite.

```sh
git clone https://github.com/cxy2696/atlas-percolation.git
cd atlas-percolation

python3 scripts/build_content.py     # manifest, search index, code inventory
python3 scripts/serve.py 8788        # http://127.0.0.1:8788/
```

Open `http://127.0.0.1:8788/`. The site must be served over HTTP; the content loader uses `fetch()`, which browsers block for `file://` URLs.

The default route is the start-here guide (`#/en/guide`), in English and light mode. The nine main views are `#/en/guide`, `#/en/overview`, `#/en/atlas`, `#/en/labs`, `#/en/code`, `#/en/algorithms`, `#/en/data`, `#/en/library` and `#/en/sources`. Replace `en` with `zh` or `de` to switch language; the switch is also in the header and is remembered in `localStorage`.

## Reproduce the checks

```sh
make test          # four suites + parity + translation structure + prose claims
make verify        # translation structure + prose claims + reference audit
make bench         # C++ harness -> data/raw_bench.json
make analyse       # raw JSON -> data/benchmarks.json
make content       # rebuild manifest/search/code inventory
make audit         # Crossref/HTTP reference audit
make package       # wheel + sdist for the Python algorithm package
```

Or run a single suite:

```sh
node --test tests/js/*.test.js
PYTHONPATH=lib/python python3 -m unittest discover -s lib/python/tests -v
make -C lib/cpp test
julia --project=lib/julia lib/julia/test/runtests.jl
```

The parity contract is in `data/golden/parity.json`; the random-stream vectors are in `data/golden/rng-seed42.json`; the algorithm-zoo, v4 solver, site-sweep and message-passing probes are in `data/golden/algorithms-v3.json` and are asserted by all four suites. A change to the RNG, the lattice edge order or the consumption order is a breaking change: regenerate the goldens, bump the version and record it in Chapter 14. The exact check matrix and its limits are in [`docs/VERIFICATION.md`](docs/VERIFICATION.md).

## Benchmark pipeline

```sh
make bench
make analyse
```

`scripts/bench.cpp` writes only raw counts (`n`, `hits`, sizes) and the seed. `scripts/analyse_bench.py` adds derived quantities, the Cardy curve, a collapse fit and a one-arm slope, and stamps the record with its generation time. The Data view reads `data/benchmarks.json`; if the file is absent it shows the exact commands above instead of inventing a curve.

The benchmark is a teaching dataset, not a high-precision measurement. It is sized to run in minutes on a laptop and to make finite-size behaviour visible. Chapter 11 states what it can and cannot support.

## Algorithm package, CLI and API

The Python package is the distributable form of the engine. It has no runtime
dependencies outside the standard library.

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

`atlas-perc serve` serves the static site and a JSON API under `/api`
(`/api/health`, `/api/thresholds`, `/api/sample`, `/api/sweep`,
`/api/bootstrap`, `/api/invasion`, `/api/explosive`, `/api/openapi.json`).
The API is a reference service with bounded inputs and no authentication; put
it behind a reverse proxy if you expose it publicly. See `docs/API.md`.

Deployment options: GitHub Pages (the canonical site), Docker
(`Dockerfile`), Netlify, Vercel and Fly.io. Details are in
[`deploy/DEPLOY.md`](deploy/DEPLOY.md).

## Theme, guides and accessibility

The default is light/English for a first visit. A saved choice wins; `?theme=dark` and `?theme=light` override it for sharing and screenshots. The theme switch is in the top bar and every canvas redraws from the active stylesheet.

Every laboratory carries an authored reading guide in English, Simplified
Chinese and German: what the picture shows, what each parameter does, how to
read the dynamics, what to try, and where the model stops. The light/dark
switch is persisted in `localStorage`, follows the system preference on first
visit, and can be forced with `?theme=light` or `?theme=dark` for screenshots
and sharing. Canvas charts resolve their colours from the active stylesheet,
so a theme switch redraws every plot without a reload.

## Repository layout

```
README.md / README_cn.md / README_de.md  repository guide in English, Chinese and German
content/
  en/ zh/ de/           chapter Markdown, one file per chapter and language
  reference_audit.json  generated by scripts/verify_references.py
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
                        (percolation, site/bond Newman–Ziff, networks,
                         continuum, Cardy, directed, bootstrap, invasion,
                         explosive, Leath, trees and message passing)
assets/
  js/views/             overview, atlas reader, labs, code, algorithms, data, library, sources
  js/labs/              sixteen instruments, with authored guides
  css/hud.css           the HUD shell
scripts/
  build_content.py      validates content and generates JSON
  check_translations.py compares section numbers, equation tags and display blocks across editions
  bench.cpp             C++ raw-data harness
  analyse_bench.py      derived data and fits
  serve.py              static preview server
  verify_references.py  Crossref/HTTP bibliography audit
  parity_algorithms.py  algorithm-zoo, v4 solver and message-parity runner
tests/js/               Node test suite
docs/                   API, RNG, algorithms, data, scaling and editorial notes
wiki/                  GitHub wiki source, published by scripts/push_wiki.sh
```

## Design and maintenance

- **UI.** Dark graphite/cyan HUD, thin instrumentation lines, monospace readouts. The overview is a live isometric bond-percolation map with a regime slider. It uses no images, no web fonts and no runtime framework; the only third-party front-end files are the vendored KaTeX and marked builds.
- **Content.** Markdown with YAML front matter. Every chapter has a stable id and the same order in every language. `scripts/build_content.py` refuses to build a partial translation, a duplicate order or an unresolved citation, and `scripts/check_translations.py` refuses a chapter whose section numbers, equation tags or display-block count drift between editions.
- **Translations.** Authored, not machine-translated at runtime. The repository README is available in [English](README.md), [简体中文](README_cn.md) and [Deutsch](README_de.md); the site switch changes all three editions. The glossary and voice rules are in `docs/EDITORIAL.md`. Technical terms are kept consistent so that a search for a threshold finds the same concept in all three editions. The language list, UI tables and content directories are data-driven; adding a fourth edition is a content and review task, not an engine change.
- **Accessibility.** Keyboard navigation, visible focus states, semantic headings, a skip-friendly main region, and charts with textual readouts. The colour palette is not the only carrier of meaning: every stage readout has a text label. Light and dark themes both keep a contrast-checked palette.
- **Browser support.** Current Chrome, Firefox and Safari with ES modules and `IntersectionObserver`. The site degrades to readable Markdown when JavaScript is disabled. Complexity and memory limits are documented in `docs/SCALING.md`.

## Deployment

The repository is already a static site. Publish the directory with GitHub Pages, Netlify, an object store, or any static server. The only requirement is the directory layout: `index.html` at the root, `assets/`, `content/` and `data/` beside it.

The GitHub Pages workflow in `.github/workflows/pages.yml` assembles `index.html`, `assets/`, `content/` and `data/` into `_site/` and deploys it. The published URL is <https://cxy2696.github.io/atlas-percolation/>. The site does not need a build step beyond `python3 scripts/build_content.py`.

## Scope and honesty

This is a reference and a teaching instrument. It is not a substitute for the primary literature, and it does not claim new theorems or new precision measurements. Every numerical value is labelled exact or numerical, and the errata table in Chapter 14 records the mistakes found in earlier versions, including the coupled-cascade bug that changed the parity probe from 0.668 to 0.5306666666666666.

## Licence

Code: MIT (`LICENSE`). Text and figures: CC BY 4.0 (`LICENSE-CONTENT`). 
