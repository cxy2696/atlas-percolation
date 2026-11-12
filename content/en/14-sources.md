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
4. **No invented citations.** If a claim cannot be traced to a source, it is either removed or explicitly marked as a heuristic argument. The bibliography in the Sources view is generated from `content/references.json`; every entry there has a DOI, a stable publisher URL, or an explicit note for pre-DOI literature.
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
| 13 | Chapter 3, Theorem 3.4 and Peierls argument | The Hammersley theorem was stated as $1/(\Delta-1)\le p_c\le1/\lambda$ with a second-moment proof of the upper bound. The Peierls series was bounded by $x/(1-x)$ at $x<1$. | The upper bound is false: on $\mathbb{Z}^2$, $1/\lambda=0.3790\ldots$ while $p_c=1/2$. The theorem now states only $p_c\ge1/\lambda\ge1/(\Delta-1)$; the second-moment hypothesis holds only near $p=1$, and the upper bound $p_c<1$ is Peierls's. The Peierls series is $x/(1-x)$ with $x=c_d(1-p)$, which is below $1$ only for $x<1/2$; the bound is now $p_c\le1-1/(2c_d)$. |
| 14 | Chapter 9, Proposition 9.1, all three languages | The Fortuin–Kasteleyn proof used $e^{-\beta(1-\delta)}=1+(e^{\beta}-1)\delta$, which fails at $\delta=1$, and then inserted a spurious factor $(1-p)^{-|E|}$. | The correct identity is $e^{-\beta(1-\delta)}=e^{-\beta}+(1-e^{-\beta})\delta=(1-p)+p\delta$. Expanding the product gives $Z_{\text{Potts}}=\sum_\omega p^{|\omega|}(1-p)^{|E|-|\omega|}q^{k(\omega)}=Z_G(p,q)$ exactly, with no prefactor. |
| 15 | Chapter 6 exponent table | The directed-percolation row was labelled $2+1$D but quoted $\beta=0.276$, $\gamma=2.277$, $\nu_\perp=1.096$. | Those are the $1+1$D values. The $2+1$D class has $\beta\approx0.584$ and $\nu_\perp\approx0.733$. The row is relabelled $1+1$D, matching the directed lattice used in the laboratory. |
| 16 | Chapters 1 and 3, susceptibility and Theorem 3.6 | $\chi$ was defined with the infinite cluster excluded, yet Theorem 3.6 used $\sup\{p:\chi(p)<\infty\}=p_c$. With the exclusion, $\chi$ is finite above $p_c$ and the supremum is $1$. | $\chi$ now includes the infinite cluster: $\chi=\mathbb{E}_p|C_0|$, with $\chi=\infty$ whenever $\theta>0$. Theorem 3.6 is then correct as stated. |
| 17 | Chapter 4, Proposition 4.3, and Chapters 7 and 11 | The text claimed $\mathbb{P}_{1/2}(\text{LR crossing of }\Lambda_n)=1/2$ for every $n$. This is false: the $3\times3$ vertex box gives $43/64=0.671875$, and the $4\times4$ box gives $3/4$. | The proposition now states only the limit $\lim_n\mathbb{P}_{1/2}(A_n)=1/2$. The finite-$L$ values in the benchmark ($0.528$, $0.538$, $0.505$ at $L=32,64,128$) are reported as a trend, not as an identity. |
| 18 | Chapter 4, Theorem 4.5 and the Kesten sketch | Theorem 4.5 stated the trivial implication (a long-rectangle crossing implies a square crossing) and the Kesten paragraph claimed FKG gluing gives a crossing probability tending to one exponentially in the number of blocks. FKG gives a product of lower bounds, which decays; the claim was false. | The theorem now states the non-trivial RSW direction: a square crossing with probability at least $1/2$ forces a $3n\times n$ rectangle crossing with probability at least $\eta>0$. The Kesten sketch now uses duality and sharpness to get long-rectangle crossings, then the ladder/renormalisation argument, without the false exponential claim. |
| 19 | Minor corrections in this revision | The $d=1$ row gave $d_f=0$ (Relation 1 gives $1$); the FSS ansatz used $L^{y_A/\nu}$ with $y_A=d_f$ and $\gamma/\nu$; the Fisher relation was derived by a density matching that gives $2-\eta$; $\kappa$ was called the branching factor; $\theta$ was said to be twice differentiable at $p_c$; the BCC/FCC bond thresholds were attributed to van der Marck alone. | $d_f=1$; the FSS prefactor is $L^{y_A}$; Fisher is derived from Relations 1, 2 and 5; the branching factor is $\kappa-1$; $\theta$ is $C^2$ on $(p_c,1]$ with one-sided right derivatives at $p_c$; BCC/FCC bond values are attributed to Lorenz–Ziff and site values to van der Marck. |

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
