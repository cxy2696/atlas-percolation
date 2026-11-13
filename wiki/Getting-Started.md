# Getting started

## Read the live site

Open <https://cxy2696.github.io/atlas-percolation/>.

- Default: light theme, English, start-here guide (`#/en/guide`).
- Switch language with `EN / 中文 / DE`.
- Switch theme with the top-bar button. The choice is stored locally.
- Force a theme in a link with `?theme=light` or `?theme=dark`.

No account, server or build step is needed to read the site.

## Use the site locally

```sh
git clone https://github.com/cxy2696/atlas-percolation.git
cd atlas-percolation

python3 scripts/build_content.py
python3 scripts/serve.py 8788
```

Open <http://127.0.0.1:8788/>. The content loader uses `fetch()`, so `file://` will not work.

For the static site plus JSON API:

```sh
python3 -m pip install -e lib/python
atlas-perc serve --port 8080
```

Open <http://127.0.0.1:8080/>; the API is under `/api`.

## Install the algorithm package

```sh
# from a checkout
python3 -m pip install -e lib/python

# or install the release wheel
python3 -m pip install percolation_atlas-4.1.0-py3-none-any.whl
```

Python 3.10 or newer; the package uses only the standard library.

```sh
atlas-perc info
atlas-perc sample    --lattice square --mode bond --L 128 --p 0.5 --seed 42
atlas-perc sweep     --lattice square --L 64 --seed 7
atlas-perc bootstrap --L 64 --p 0.55 --r 3 --seed 11
atlas-perc invasion  --L 48 --seed 3
atlas-perc explosive --n 2000 --rule product --seed 7
atlas-perc serve     --port 8080
```

Every command accepts `--json`.

## Run the checks

Requirements: Python 3.10+, Node.js 20+, a C++20 compiler, and Julia 1.9+ for the Julia suite.

```sh
make test        # four language suites + both parity contracts
make bench       # C++ benchmark -> data/raw_bench.json
make analyse     # raw counts -> data/benchmarks.json
make content     # manifest, search index, code inventory
make audit       # Crossref/HTTP reference audit
```

A single suite:

```sh
node --test tests/js/*.test.js
PYTHONPATH=lib/python python3 -m unittest discover -s lib/python/tests -v
make -C lib/cpp test
julia --project=lib/julia lib/julia/test/runtests.jl
```

Next: [[Interface Guide]].
