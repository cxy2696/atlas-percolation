# Contributing

## Content changes

Markdown is the source of truth. Edit:

- `content/en/`, `content/zh/`, `content/de/` for chapters;
- `content/references.json` for the bibliography;
- `content/citations.json` for chapter → reference keys.

Then run:

```sh
python3 scripts/build_content.py
```

The builder refuses a missing language, a duplicate order, a non-contiguous order, or a citation to an unknown reference. Do not edit `content/manifest.json`, `content/search.json` or `content/code.json` by hand.

## Code changes

- Keep the RNG consumption order and lattice edge order stable. A change is breaking: regenerate the goldens, bump the version and record it in Chapter 14.
- Run `make test` before proposing a change.
- If you change an integer result or a component size, update the relevant golden file.
- If you add an algorithm, add it to the algorithm reader, the tests and `docs/ALGORITHMS.md`.

## Reference changes

- Add a DOI when one exists, otherwise a stable URL and a note.
- Run `python3 scripts/verify_references.py`.
- Do not add a reference you cannot resolve. The audit checks title, year and first author.

## Review checklist

- Is the claim labelled exact, numerical, conjecture or proof sketch?
- Are boundary conditions stated (open, periodic, wired)?
- Is the estimator defined?
- Is the seed or seed list archived?
- Is the finite-size correction estimated or the claim explicitly asymptotic?
- Does a second implementation reproduce the integer probes?

Next: [[FAQ]].
