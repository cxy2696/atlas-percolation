---
id: 14-sources
part: Reference
order: 14
title: Sources, corrections, and maintenance
subtitle: How the numbers are checked, what changed, and how to keep the atlas alive
reading: 13 min
---

A reference work is only as good as its provenance. This final chapter records where the claims come from, which claims are exact and which are numerical, what has been corrected in this edition, and how to maintain the repository without breaking the guarantees that make it useful.

## 14.1 Editorial rules

Five rules govern the content.

1. **Primary sources for results.** A theorem is cited to the paper or book that proves it, not to a review that mentions it. Where a result has a long history, the original and the standard modern reference are both given.
2. **Exact, numerical, or conjectural.** Every exponent and threshold carries one of these labels. A numerical value is quoted with the precision its source supports, not with the precision of a plotting tool. A conjecture is called a conjecture even when it is universally believed.
3. **No silent rounding.** Where a value is rounded, the source's uncertainty is preserved. Where two sources disagree in the last digit, the conservative value is used and the disagreement is noted.
4. **No invented citations.** If a claim cannot be traced to a source, it is either removed or explicitly marked as a heuristic argument. The bibliography in the Sources view is generated from `content/references.json`; every entry there has a DOI or a stable publisher URL.
5. **Corrections are public.** A correction is dated and described in Section 14.3. Removing a wrong statement without recording it makes the next reader repeat the error.

The prose is written to be read by a person. Mathematical notation is standard; undefined jargon is explained at first use; rhetorical flourishes are kept to a minimum. The three language editions are authored, not machine-translated at runtime. Technical terms follow the glossary in `docs/EDITORIAL.md` so that a search for "threshold" finds the same concept in every edition.

## 14.2 How to read a citation

The bibliography uses author–year keys in the text and full entries in the Sources view. For a journal article the entry gives authors, title, journal, volume, pages, year and DOI. For a book it gives the edition actually used. For a computational result it gives the algorithm, the sample sizes and the seed where those are part of the claim.

Two conventions are worth stating. First, the year is the year of the version that was actually consulted. A preprint that appeared in 2016 and a journal version that appeared in 2017 are different objects; the entry says which one. Second, a DOI resolves to the publisher's record, not to a copy of the paper. The atlas does not host copyrighted PDFs.

## 14.3 Corrections in this edition

The following errors were found in earlier drafts of this atlas and in the first release of its code. They are listed with the correction and, where relevant, the numerical consequence.

| # | Where | Earlier statement | Correction |
|---|---|---|---|
| 1 | Coupled-network cascade, Chapter 10, lab, C++/Julia/Python/JS library and benchmark | Layer A and layer B were each pruned to their own giant component, without intersecting the two surviving sets. | With one-to-one coupling a vertex survives only if it is in both giant components. The round is an intersection. The parity probe changed from 0.668 to 0.5306666666666666 for seed 11, and the benchmark curve is lower near $p_c$. |
| 2 | Random-cluster chapter | The Ising critical point on the square lattice was placed at $p=1/2$. | The $q=2$ self-dual point is $p_c=\sqrt2/(1+\sqrt2)=0.585786\ldots$. The value $1/2$ is the $q=1$ percolation point. |
| 3 | Random-cluster chapter | Duality was described as $p\mapsto1-p$ at every $q$. | On the square lattice the self-dual curve is $p=\sqrt q/(1+\sqrt q)$; $p\mapsto1-p$ is the $q=1$ special case. |
| 4 | Conductivity discussion, Chapter 13 | The two-dimensional conductivity exponent $t\approx1.299$ was called exactly known. | It is a high-precision numerical value (Grassberger 1999), not a conformal-field-theory theorem. |
| 5 | Continuum lab and Chapter 12 | Coverage was described as having a threshold at $\lambda=0$, contrasted with connectivity at $\lambda_c\approx1.128$. | Coverage is the smooth function $1-e^{-\lambda}$; it has no threshold. The percolation threshold of the Poisson disk model is the separate quantity $\lambda_c\approx1.128$ (area fraction $\approx0.676$). |
| 6 | Universality discussion, Chapters 6 and 13 | "Every periodic planar lattice has the same exponents" was stated as a theorem. | The theorem is for the triangular lattice and its star–triangle relatives. The general planar case is a conjecture supported by numerics. |
| 7 | Sharpness chapter | Continuity at $p_c$ was said to be open only for $3\le d\le5$. | It is known in $d=2$ and in sufficiently high dimensions, and open in the intermediate range; the chapter now states it that way. |
| 8 | Threshold table, 3D values | The BCC/FCC/diamond values were attributed to Lorenz–Ziff (1998). | Lorenz–Ziff determined the sc, fcc and bcc *bond* thresholds; the site and diamond values are quoted from van der Marck (1997), and the sc values from Wang et al. (2013). |
| 9 | Chapter 12 | The heterogeneous herd-immunity threshold was written as $1-1/(\kappa-1)$ without the transmissibility. | The general form is $v_c=1-1/R_0$ with $R_0=T(\kappa-1)$; the simpler expression is the $T=1$ special case. |
| 10 | Chapter 13 | "Peridemic graph" and a claim that exact percolation thresholds of finite graphs are #P-hard. | The term is corrected to "percolation graph". The complexity sentence now distinguishes finite-graph reliability (#P-hard) from recovering an infinite-volume threshold, which is a different problem. |
| 11 | Benchmark harness | The rejection limit in `scripts/bench.cpp` was computed in 32-bit arithmetic and wrapped to zero when the stub count divided $2^{32}$, making the shuffle loop forever. | The limit is now computed in 64-bit arithmetic. The four libraries were not affected; their rejection samplers already used 64-bit or exact integer arithmetic. |
| 12 | Cardy formula, Chapter 7, Cardy lab, four libraries and golden probes | The hypergeometric was evaluated at argument $-\ell$; the resulting curve gave $\pi(0.1)=0.2585$, $\pi(10)=0.7414$ and was much too flat. | The correct argument is the elliptic modulus $m$ solving $\ell=K(m)/K(1-m)$. Correct values: $\pi(0.1)=4.03949\times10^{-5}$, $\pi(1)=0.5$, $\pi(10)=0.9999596$. The libraries, lab, tests and golden values were updated. |

The first correction was not a typo in the prose; it was an algorithmic error, and it survived because the wrong algorithm still produced a plausible curve. The Cardy correction was a formula error with a similarly large numerical effect. The lesson is recorded in Chapter 11: compare integer counts for a fixed seed, not just the shape of a plot.

## 14.4 Reproducing the numbers

The full pipeline is:

```sh
make test                 # JS, Python, C++ and Julia parity suites
make bench                # builds the C++ harness and writes raw JSON
python3 scripts/analyse_bench.py
python3 scripts/build_content.py
```

`make bench` writes `data/raw_bench.json`; the analyser writes `data/benchmarks.json` and prints the collapse fit and the one-arm slope. The website reads `content/manifest.json`, `content/search.json` and `data/benchmarks.json`. None of these generated files should be edited by hand.

The parity probes in `data/golden/parity.json` are the contract between the four libraries. They cover a crossing count, a Newman–Ziff checkpoint triple, a configuration-model component size and a coupled-network cascade fraction. The random-stream vectors in `data/golden/rng-seed42.json` pin the generator itself. A change to the random stream, the edge order or the consumption order is a breaking change and requires new golden files, a version bump and a note in this chapter.

## 14.5 Maintaining the atlas

**Adding a chapter.** Create `content/en/NN-slug.md`, `content/zh/NN-slug.md` and `content/de/NN-slug.md` with the same `id`, `order` and structure. Add the references to `content/references.json`. Run `scripts/build_content.py`; it fails if a language is missing or an order is duplicated. Add the chapter to the test matrix if it introduces a computed number.

**Adding a laboratory.** Put the engine in `assets/js/engine/` only if it is part of the shared contract. Put the page in `assets/js/labs/`, register it in `LABS`, and localise at least the title, the lead, every control label and the readout captions. A lab that only works in English is not finished.

**Adding a language.** Add the language code to `LANGS`, add a content directory, add a UI string table, and extend `scripts/build_content.py`. The layout must be checked at 1280, 1440 and 1920 pixels; German labels are longer than English and Chinese labels are shorter, and a layout that only fits one language is not a layout.

**Updating a result.** Change the Markdown source, not the generated JSON. If the result affects a code path, add a regression test first. If it changes a published number, add a row to Section 14.3 and bump the minor version.

**Review cadence.** Once a year, check every DOI, re-run the benchmark on the current compiler, and compare the new raw counts with the previous record. A change in counts with the same seed is either a compiler bug, a platform-dependent floating-point path, or a change in the algorithm. All three are worth knowing about.

## 14.6 Licence and citation

The text is released under CC BY 4.0 and the code under MIT; see `LICENSE` and `LICENSE-CONTENT`. Citation metadata is in `CITATION.cff`. When citing a specific result, cite the original source as well as the atlas; the atlas is a guide to the literature, not a substitute for it.

The atlas is maintained as a static site with no server-side dependencies. That is a deliberate choice: it can be archived, mirrored and read offline, and it will still work when the build tool of the month has been forgotten.
