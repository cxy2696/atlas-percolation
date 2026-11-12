# percolation-atlas (Python)

Readable reference implementation of the algorithms used by the atlas. It shares the xoshiro128** stream, the lattice edge order and the RNG consumption order with the C++, Julia and JavaScript editions.

```sh
PYTHONPATH=lib/python python3 -m unittest discover -s lib/python/tests -v
```

Requires Python 3.10+ and the standard library only. The package is intentionally small: `Percolation`, `newman_ziff`, lattice generators, configuration-model and k-core utilities, the Boolean model, Cardy's formula, and directed percolation.

See the repository root `README.md` and `docs/API.md` for the full contract.
