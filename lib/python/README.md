# percolation-atlas (Python)

Reference implementations of Bernoulli percolation, the Newman–Ziff sweep,
Leath growth, bootstrap percolation, invasion percolation and the Achlioptas
two-choice process. Standard library only.

```sh
python3 -m pip install -e .
atlas-perc info
atlas-perc sample --lattice square --mode bond --L 128 --p 0.5 --seed 42
atlas-perc sweep --lattice square --L 64 --seed 7
atlas-perc bootstrap --L 64 --p 0.55 --r 3 --seed 11
atlas-perc invasion --L 48 --seed 3
atlas-perc explosive --n 2000 --rule product --seed 7
atlas-perc serve --port 8080
```

`atlas-perc serve` serves the static atlas from the repository root and a JSON
API under `/api`. The API is a reference service: no authentication, bounded
input sizes, and JSON errors. See `docs/API.md` for the routes.

The package shares the xoshiro128** stream and edge order with the C++, Julia
and JavaScript editions of the core. The algorithm zoo (bootstrap, invasion, Leath, Achlioptas), the
Hoshen–Kopelman labelling routine and the tree/epidemic solvers are
implemented in all four languages; see `data/golden/algorithms-v3.json`.
