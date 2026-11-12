# Changelog

## 3.0.0 — 2026-11-12

The algorithm and application release. The atlas grows from 18 to 21 chapters,
from 9 to 13 laboratories, and from 64 to 81 audited references (80 Crossref/HTTP-verified, 1 pre-DOI note); the core
engine gains a second algorithm family with its own parity contract, and the
Python package becomes a distributable CLI plus JSON API.

**Content**

- Added Chapter 19, *Proofs, algorithms and the status of a claim*: FKG, BK,
  Burton–Keane uniqueness (with the tree counterexample), duality, RSW,
  sharpness, mean-field range, Cardy/SLE, algorithm correctness, statistical
  error and an explicit list of open problems.
- Added Chapter 20, *Design under uncertainty*: a design template, the
  distinction between monotonicity and submodularity, network/epidemic/
  infrastructure/material/porous-media/fire/sensor/scaffold scenarios, an
  optimisation-method comparison and a validation protocol.
- Added Chapter 21, *Reproducibility, uncertainty and the error budget*: the
  artifact contract, RNG conventions, parity scopes, statistical protocol,
  five-line error budget, figure reproduction, package/API routes and a
  ten-item reporting checklist.
- Extended Chapter 15 with bootstrap, invasion and Achlioptas processes.
- Added trilingual authored reading guides to all 13 laboratories: what you
  see, what every parameter does, how to read the dynamics, what to try, and
  the limits of the instrument.

**Code**

- Added `bootstrapActivation` / `bootstrapLattice` (synchronous r-neighbour
  closure, O(n+m), least fixed point) in JavaScript and Python.
- Added `invasionCluster` / `invasionPercolation` (greedy minimum-threshold
  boundary growth, binary heap, accepted spanning tree, rejected loops).
- Added `explosiveSweep`, `explosivePercolation` and `explosiveRandomGraph`
  (Achlioptas product/sum rules, with an explicit finite-size warning).
- Added `leathCluster` and `neighboursFromEdges`.
- Added `randomGraphSweep` as the Erdős–Rényi baseline for the explosive
  laboratory.
- Added `data/golden/algorithms-v3.json` and `scripts/parity_algorithms.py`:
  Python and JavaScript agree on bootstrap times, invasion order, Leath
  cluster size and Achlioptas trajectories. The four-language contract still
  covers the Bernoulli core.
- Added `lib/python/percolation_atlas/cli.py` (`atlas-perc`) and `api.py`
  (static site + `/api/*`), and made the package buildable as a wheel.

**Interface**

- Added a persisted light/dark theme switch (`?theme=` override for
  screenshots and sharing), theme-aware canvas palettes in every laboratory,
  and a stylesheet light theme with contrast fixes.
- Added four laboratories: bootstrap percolation, explosive percolation,
  invasion percolation and the algorithm studio (edge-by-edge Newman–Ziff
  replay, measured cost table, log–log scaling fit).
- Added parameter help text, plot notes, a collapsible reading guide with
  tabs, and a "try this" section to every instrument.
- Added PWA metadata, an offline service worker, Open Graph metadata,
  `robots.txt`, `sitemap.xml`, a 404 page and deployment configs for Pages,
  Docker, Netlify, Vercel and Fly.io.

**Verification**

- Added `scripts/verify_references.py` and `content/reference_audit.json`:
  DOI entries are checked against Crossref, URL entries by HTTP fetch.
- Added 17 references, including books (Sahimi 2023; Meester–Roy 1996;
  Hunt–Ewing–Ghanbarian 2013), a blog note (John D. Cook 2015) and software
  (NetworkX).
- Added `make parity-alg`, `make audit`, `make package` and `make api`.
- Extended CI with the v3 parity runner, the offline reference audit, a wheel
  build and an API smoke test.

**Corrections and clarifications**

- Bootstrapping at r = 2 is now presented correctly: the infinite-lattice
  threshold is zero, while a finite box fills above an L-dependent crossover;
  r = 3 and r = 4 have positive thresholds.
- The Achlioptas process is labelled with its rigorous status: continuous in
  the thermodynamic limit; the visible jump is a finite-size effect.
- Uniqueness is stated for amenable transitive graphs, with the regular-tree
  counterexample noted.
- The random baseline in the explosive laboratory is compared at q = ln 2
  when candidate pairs are drawn with replacement.

## 2.1.0 — 2026-11-12

A completeness and verification release. Four chapters, two laboratories and a
new cross-language probe were added, and the critical review of the existing
mathematics found several errors that are now corrected and recorded.

**Content**

- Added Chapter 15, *Algorithms: from one sample to the whole curve*, Chapter
  16, *Directed percolation: time as a direction*, Chapter 17, *Continuum
  percolation: disks, rods and real media*, and Chapter 18, *Transport and
  first passage*.
- Completed the English, Simplified Chinese and German editions of all 18
  chapters.
- Corrected the susceptibility definition and Theorem 3.6: $\chi$ now includes
  the infinite cluster, so $\sup\{p:\chi<\infty\}=p_c$ is true.
- Replaced the false finite-size identity $\pi(1/2,L)=1/2$ by the limit
  $\pi(1/2,L)\to1/2$; the 3x3 box gives 43/64.
- Corrected the RSW theorem statement (the non-trivial square-to-rectangle
  direction) and removed the false FKG gluing claim from the Kesten sketch.
- Corrected the Potts/Fortuin-Kasteleyn identity in all three languages.
- Corrected the Hammersley bound (no upper bound $1/\lambda$), the Peierls
  series threshold, the directed-percolation dimension label, the $d=1$
  fractal dimension, the Fisher derivation, the FSS prefactor, the branching
  factor, the $d>6$ proof range and the BCC/FCC source attribution.
- Added 17 references (64 total), including de Gennes, Aizenman-Fernández,
  Menshikov, Callaway et al., Hoshen-Kopelman, Leath, Tarjan, Janssen,
  Grassberger, Takeuchi et al., Gilbert, Torquato, Balberg et al., Gefen et
  al., Havlin-Ben-Avraham, Redner and Ben-Avraham-Havlin.

**Code**

- Added directed percolation to all four libraries, with parity probes
  (354 bond and 328 site crossings out of 500 for seed 4242).
- Added the first six standard normals to the RNG golden vectors and fixed the
  Python normal sampler to match the cached-spare polar method.
- Fixed the JavaScript k-core queue overflow (triangle-plus-leaf regression),
  the unsorted `ClusterStats.sizes`, the stale Box-Muller spare on reseed, the
  `int(n)` guard, and the empty-DSU maximum at p=0.
- Fixed the large-mean Poisson sampler in all four languages (the Knuth loop
  underflows above mean ~745), the Python power-law overflow, and the
  even-sum degree fix so it stays inside `[kmin,kmax]`.
- Rejected degenerate honeycomb sizes (L<6) and documented the girth reason.
- Fixed the benchmark: k-core range, adaptive Cardy sample count, 50 coupled
  cascade replicates with standard errors and convergence flags, stable
  targeting sort, safe power-law cast, weighted one-arm fit with a 95% CI.
- Wired the parity runner into `make test`/`make parity` and CI.

**Interface**

- Added the Directed percolation and Random-cluster/Potts laboratories (nine
  in total).
- Localized lab chrome, dashboard counts and stage labels; removed duplicate
  i18n keys and the misleading "Spanning" label for a left-right crossing.
- Added repository, live-site and API links to the status bar, a localized
  document title, and the 18-chapter counts throughout.
- Updated the README, API, RNG, DATA, EXAMPLES and editorial guides.

## 2.0.0 — 2026-11-12

A correctness and completeness release. The site, the four libraries and the benchmark record are now one verified pipeline.

**Content**

- Added Chapter 11, *Measuring a threshold without fooling yourself*, and Chapter 14, *Sources, corrections, and maintenance*.
- Completed English, Simplified Chinese and German editions of all fourteen chapters.
- Replaced the earlier crossing-formula shortcut with the elliptic-modulus form of Cardy's formula and added the corrected regression values.
- Narrowed the sharpness theorem to the lattice case and separated it from the Burton–Keane uniqueness theorem.
- Corrected the random-cluster Ising point, the two-dimensional conductivity claim, continuum coverage language, the herd-immunity formula, the complexity claim and the 3D threshold attributions.
- Added 47 primary references with DOI links and per-chapter source lists.

**Code**

- Fixed the one-to-one coupled-network cascade in C++, Julia, Python, JavaScript, the lab and the benchmark. The round is now the intersection of the two giant components; the parity probe changed from 0.668 to 0.5306666666666666.
- Reimplemented Cardy's formula in all four libraries: the argument is the elliptic modulus `m` with `l = K(m)/K(1-m)`, not `-l`.
- Fixed the benchmark harness rejection limit for stub counts dividing `2^32`.
- Fixed duplicate DOM ids in the lattice, coupled-cascade and Cardy labs.
- Added the JavaScript test suite and the Python/JavaScript parity runner.
- Added a root Makefile, CI workflow, data/scaling/editorial documentation and licence files.

**Interface**

- New control-room overview with a live isometric bond-percolation map, exact thresholds, exponent table and lab index.
- New searchable Sources view with DOI links and chapter cross-references.
- Source workbench showing every file in all four libraries plus tests.
- Localized the dashboard, data captions, lab notes, errors and 404 states in all three languages.
- Responsive HUD layout down to 500 px, with a 1200×675 reference viewport.

## 1.0.0 — 2024

Initial internal edition: fourteen-chapter English draft, four reference implementations, benchmark harness, and the first seven laboratories. No public release; several results in this edition were corrected in 2.0.0 and are listed in Chapter 14.
