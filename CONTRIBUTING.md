# Contributing

The atlas is a static site and a set of reference libraries. Contributions are welcome if they keep the three contracts below intact.

## 1. Content contract

- Every chapter exists in `content/en`, `content/zh` and `content/de` with the same `id`, `order` and `part`.
- Every factual claim has a source in `content/references.json`, and the chapter is listed in `content/citations.json`.
- Exact, numerical and conjectural statements are labelled as such.
- Do not edit `content/manifest.json`, `content/search.json`, `content/code.json`, `data/raw_bench.json` or `data/benchmarks.json` by hand. Run the generator instead.

Before opening a pull request:

```sh
python3 scripts/build_content.py
node --test tests/js/*.test.js
PYTHONPATH=lib/python python3 -m unittest discover -s lib/python/tests
make -C lib/cpp test
julia --project=lib/julia lib/julia/test/runtests.jl
```

## 2. Code contract

- All four implementations consume the same RNG stream, in the same order, over the same edge list.
- A change to the RNG, the edge order or the consumption order is a breaking change: regenerate `data/golden/*.json`, bump the version, and add an errata row.
- New algorithms come with a parity probe if they are implemented in more than one language, and with a regression test in every language that implements them.

## 3. Interface contract

- Every control has a label, every chart has a textual readout, and every readout has a unit.
- Every user-visible string is in `assets/js/i18n.js` or in the lab's own `LABELS` table, in all three languages.
- Test the layout at 1200×675 and 1440×900, and at 500 px width.
- No runtime framework, no external font, no remote image. The site must remain readable when archived.

## Style

Read `docs/EDITORIAL.md` before writing or translating. The short version: concrete nouns, short sentences, no promotional language, no generated-prose tics, and no claim that cannot be traced.
