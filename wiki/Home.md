# Percolation Atlas — wiki

**Version 3.2.0** · [Live site](https://cxy2696.github.io/atlas-percolation/) · [Repository](https://github.com/cxy2696/atlas-percolation) · [Release](https://github.com/cxy2696/atlas-percolation/releases/tag/v3.2.0)

A trilingual atlas of percolation theory: 21 chapters, 13 interactive laboratories, 8 algorithm walkthroughs, 105 audited references, four-language core code and a Python package.

The site opens in **light mode, English**, on the start-here guide at `#/en/guide`. The guide is the right first page; this wiki is the slower reference for the parts that are easier to read as text.

## Start here

| If you want to… | Open |
|---|---|
| Understand what the site contains | [[Interface Guide]] |
| Read the theory | [Chapter 01 — What percolation is](https://cxy2696.github.io/atlas-percolation/#/en/atlas/01-foundations) |
| Run a first experiment | [Lattice percolation laboratory](https://cxy2696.github.io/atlas-percolation/#/en/labs/lattice) |
| Understand an algorithm | [[Algorithms]] |
| Check a number or a source | [[Reproducibility]] and [[References]] |
| Install the package | [[Getting Started]] |
| Deploy or extend the site | [[Deployment]] and [[Contributing]] |

## The four doors

1. **Argument** — 21 chapters in English, Simplified Chinese and German. The core is 01–13; 19 is the proof appendix; 20 is design under uncertainty; 21 is the reproducibility protocol.
2. **Experiment** — 13 laboratories. Every instrument has an authored reading guide: what you see, what each control does, what to try, and where the model stops.
3. **Code** — the Bernoulli core is C++20, Julia, Python and JavaScript. The v3 algorithms are Python and JavaScript, with a separate golden file.
4. **Evidence** — seeded data, a bibliography of 105 entries (103 verified against Crossref or the publisher, 2 with explanatory notes), and an errata table.

## What “verified” means here

A DOI entry is checked against Crossref for title, year and first author. A URL entry is checked by HTTP fetch. A result is labelled **exact**, **numerical**, **conjecture**, or **proof sketch**. These labels are not decoration; they say how much weight a number can carry.

## Wiki pages

- [[Getting Started]]
- [[Interface Guide]]
- [[Algorithms]]
- [[Reproducibility]]
- [[References]]
- [[Deployment]]
- [[Contributing]]
- [[FAQ]]

## Scope

This is a teaching and reference instrument, not a substitute for the primary literature. It does not claim new theorems or high-precision measurements. The benchmark is sized to make finite-size behaviour visible, not to settle a critical exponent.
