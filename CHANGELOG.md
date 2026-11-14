# Changelog

## 4.3.0 — 2026-11-14

A reading-order edition. The content is unchanged; the site is reorganised so
the first visit, the chapter index, the laboratory index, the algorithm index
and the top navigation all follow the same sequence.

**Navigation**

- The top bar now reads **Start → Overview → Atlas → Labs → Algorithms → Code →
  Data → Sources → Library**. Algorithms precede the raw code browser, and the
  bibliography precedes the full-text search index.

**Atlas**

- The chapter index is grouped by part instead of one flat 23-card grid.
- The tail of the atlas is now contiguous: 16–18 are **Extensions** (directed,
  continuum, transport), 19–21 are **Proofs, design and reproducibility**, and
  22–23 are **Bridges: trees and epidemics**. This removes the repeated
  "Critical phenomena" and "Networks" headings that the old part labels
  produced in the rail.
- Chapter cards show only the number, title, subtitle and reading time; the
  part name is in the group heading, not repeated on every card.

**Labs**

- The 16 labs are grouped into **Foundations**, **Critical phenomena**,
  **Networks and applications**, and **Methods**.
- 3D percolation moves next to the lattice laboratories (lab 04); the other
  lab numbers and on-page kickers follow the new sequence.
- Each lab page has a previous/next pager at the bottom, matching the chapter
  reader.

**Algorithms**

- The 13-entry reader is grouped into **Core sampling**, **Dynamics**, and
  **Labels, trees and messages**, in both the rail and the reader list.

**Housekeeping**

- README, translated READMEs, CITATION, meta tags, PWA cache and wiki updated
  to 4.3.0.
- No bibliography, chapter text, engine or golden file changed.

## 4.2.0 — 2026-11-14

A field-guide release. The atlas gains a three-dimensional site-percolation
laboratory, a domain-by-domain applications guide, and fifteen verified
application references. The bibliography is now 140 entries: 138 checked
against Crossref or the publisher, 2 explanatory notes.

**Three dimensions**

- Added `buildLattice3D(L)` (simple cubic, open boundaries, `L³` sites and
  `3L²(L−1)` edges) and a new **3D percolation** laboratory (`#/en/labs/three-d`).
- The laboratory draws every occupied site in isometric projection, colours the
  largest and second-largest clusters, and tests top–bottom spanning directly
  through the union-find roots.
- New guide explains the projection, the cube side, the finite-size crossing,
  and why the quoted `p_c = 0.3116077(2)` is numerical, not exact.

**Applications**

- Chapter 12 now ends with a field guide by domain: materials and rigidity,
  porous media, wildfire, epidemics, infrastructure, optimal percolation,
  traffic, finance, social/urban models, quantum information and turbulence.
- Added a "claims that are easy to get wrong" section. In particular: random
  immunization on heterogeneous networks is not easier. At fixed mean degree a
  heavy-tailed network has a larger R0 and needs *more* random coverage; at
  fixed R0 the random-coverage formula is the same. Targeted immunization is
  the strategy that lowers the requirement.
- Corrected the common overreach around the 2D landscape threshold, the
  conductivity exponent, surface-code erasure thresholds, the mean-field
  rigidity value 2.4, forest-fire criticality, message passing and AI emergence.

**References**

- Added fifteen entries: Thorpe (1983), Drossel–Schwabl (1992), Cohen–Havlin–
  ben-Avraham (2003), Morone–Makse (2015), Li et al. (2015), Gai–Kapadia
  (2010), Solomon et al. (2000), Makse et al. (1995), Kieling–Rudolph–Eisert
  (2007), Stace–Barrett–Doherty (2009), Lemoult et al. (2016), Sano–Tamai
  (2016), Jacobs–Thorpe (1995), Zdeborová et al. (2016) and Mugisha–Zhou (2016).
- Audit: 140 total, 138 verified, 2 explanatory notes, 0 unresolved.

**Housekeeping**

- README, README_cn, README_de, CITATION, meta tags, wiki and deployment
  examples updated to 16 laboratories and 140 references.
- Added `tests/js/lattice3d.test.js` (size, edge count, degree, extremes,
  positions); the guide and claim checks now expect the new counts.

## 4.1.0 — 2026-11-13

A verification and algorithm edition. The atlas keeps 23 chapters, 15
laboratories and 125 references, and grows to 13 algorithm walkthroughs.

**New algorithms (all four languages)**

- **Site-mode Newman–Ziff.** `newmanZiffSite` / `newman_ziff_site` adds
  vertices rather than edges; after k sites the state is a uniform k-subset,
  so it is a site-percolation sample at p = k/n. It is the site counterpart
  of the bond sweep and uses the same observable conventions.
- **Message passing.** `messagePassingPercolation` /
  `message_passing_percolation` computes cavity messages
  `u[i→j] = Π_{k≠j}(1 − T + T u[k→i])` with prefix/suffix products in
  O(n + m) per sweep. It is exact on trees and the Bethe approximation on
  graphs with cycles; starting from zero selects the physical fixed point.
- Both have golden probes (`nz_site_square8_seed5_cp16`, `message_k5_T04`),
  four-language tests and algorithm-reader entries. The reader now has 13
  routines.

**Verification**

- Added `scripts/verify_claims.py`, which independently checks exact 2×2 and
  3×3 crossing counts, Cardy values, the two-dimensional exponent identities,
  Bethe and configuration-model fixed points, threshold relations, the stored
  benchmark rates and the audit totals. It is part of `make test`,
  `make verify` and CI.
- Added [`docs/VERIFICATION.md`](docs/VERIFICATION.md): the check matrix,
  provenance rules, current record and explicit limits.
- Re-ran the full reference audit: 125 entries, 123 verified, 2 explanatory
  notes, 0 unresolved. The audit retries Crossref 429/5xx responses.
- The translation structure check (section numbers, equation tags, display
  blocks) covers all 23 chapters in three editions.

**Documentation and language switch**

- Added complete [简体中文](README_cn.md) and [Deutsch](README_de.md) editions
  of the README, with a language switch in all three files and in the site
  header/rail.
- Updated README, wiki, docs, package metadata, citation metadata and service
  worker to 4.1.0 and to the new algorithm counts.
- The German and Chinese READMEs preserve the commands, counts, paths and
  provenance rules of the English edition.

**Content and code refinements**

- Corrected the Poisson-tree worked example in Chapter 22 to the recursion
  `u = e^{-cp(1-u)} = e^{-1.2(1-u)}`, and made the finite-variance condition
  explicit in the singularity statement.
- Documented the z = 2 Bethe endpoint (p_c = 1, θ(1) = 1) in the text, the
  lab and the tests.
- Site and message-passing implementations are covered by the same integer
  parity discipline as the existing algorithms.


## 4.0.0 — 2026-11-13

A content, algorithm and interface release. The atlas grows to 23 chapters,
15 laboratories, 11 algorithm walkthroughs and 125 audited references, and the
algorithm zoo becomes a four-language contract.

**New chapters (English, Chinese, German)**

- **22 — Trees, generating functions, and message passing.** Exact bond
  percolation on Galton–Watson and z-regular trees, the cluster generating
  function, local weak convergence of sparse graphs, the configuration-model
  equations `u = G1(1 − T + Tu)`, `S = 1 − G0(1 − T + Tu)`, the threshold
  `1/(κ − 1)`, the Bethe approximation and message passing, and a table that
  separates where the tree answer is exact from where it is only local.
- **23 — Epidemics as percolation.** The SIR-to-bond-percolation mapping with
  the directed out-component caveat, the final-size equation, `R0 = T(κ − 1)`,
  herd immunity, vaccine efficacy (all-or-nothing and leaky), superspreading,
  temporal networks, the fixed-point algorithm and a reporting checklist.

**New laboratories**

- **14 — Bethe tree.** A finite z-ary tree drawn edge by edge beside the exact
  infinite-tree curve, with `p_c = 1/(z − 1)`, θ, u and the subcritical χ.
- **15 — SIR as percolation.** Final size against the effective reproduction
  number, vaccination and efficacy controls, and a log-binned histogram of
  3,000 branching-process outbreaks. The lab says explicitly that the
  histogram is a mean-field illustration, not a contact-network simulation.

**Algorithms**

- The v3 zoo (bootstrap, invasion, Leath, Achlioptas) is now implemented in
  C++20 and Julia as well as Python and JavaScript, with the same RNG
  consumption and edge order. The golden file is asserted by all four suites.
- Added Hoshen–Kopelman labelling (`labelClusters` / `label_clusters`) in all
  four languages, with the inactive-vertex sentinel and a full label-array
  golden probe.
- Added the Bethe fixed point (`bethePercolation`), the Poisson pmf, the
  configuration-model giant component and the SIR final size
  (`sirFinalSize`) in all four languages.
- Added three algorithm-reader entries (Hoshen–Kopelman, Bethe fixed point,
  SIR final size), for 11 total.

**References**

- Added 20 verified entries, including Benjamini–Schramm, Lyons–Peres,
  Mézard–Montanari, Karrer–Newman, Durrett, van der Hofstad, Janson–Łuczak–
  Ruciński, Harris's branching-process book, Kiss–Miller–Simon, Keeling–
  Rohani, Anderson–May, Lloyd-Smith et al., Holme–Saramäki, Valdano et al.,
  Pastor-Satorras et al., Boguñá et al., Stauffer (1979), Coniglio,
  Alexander–Orbach and Newman (2005).
- Current audit: 123 verified, 2 explanatory notes, 125 total. The audit
  script now retries Crossref 429/5xx responses with bounded backoff instead
  of recording a transient rate limit as an unreachable source.

**Errata and translation repair**

- Chapter 4, Proposition 4.3: the finite-box crossing values were listed in
  the wrong order (a 4×4 box was said to give 3/4). Exact enumeration gives
  3/4 on 2×2, 43/64 on 3×3 and 82623/131072 on 4×4. The Chinese and German
  editions still carried the superseded *finite-n identity* and its incorrect
  proof; both now match the corrected limit statement.
- Chapter 19, duality proof sketch: the same finite-n identity had survived
  there. It now derives only the n → ∞ statement and points to Proposition
  4.3 for the finite-size caveat. The sharpness sentence about the
  susceptibility diverging "above" p_c is corrected to "as p ↑ p_c".
- Chapter 14: rows 20–21 of the corrections table had been displaced below the
  maintenance section; they are back in the table, joined by row 22 for the
  Chapter 19 repair, in all three languages.
- Benchmark crossing rates at p = 1/2 are now quoted as 0.5275, 0.5375 and
  0.505 for L = 32, 64, 128, matching the raw record instead of rounding to
  three digits.

**Interface and housekeeping**

- New laboratories are registered in the rail and the index; both have
  authored reading guides in English, Chinese and German.
- Plot corner labels that duplicated axis labels were removed from the new
  instruments; the tree and outbreak views use a single, unambiguous label
  per axis.
- Version bumped to 4.0.0 across the site, package metadata, Python and Julia
  packages, service worker and citation file.


## 3.2.1 — 2026-11-13

A layout fix for the Start view. The full-width desktop rule for the guide
(`grid-template-columns: 0 1fr`) was outside a media query, so it overrode the
one-column mobile shell below 861px. The page content collapsed into a narrow
strip at exactly the tablet width where the mobile layout starts.

The desktop rule is now wrapped in `@media (min-width: 861px)`. Desktop is
unchanged; the 500–860px layout uses the normal one-column shell, with the
guide cards stacked and the top bar intact.

No content, algorithm, golden file or reference changed.

## 3.2.0 — 2026-11-13

A start-here release. The first visit now lands on a short interface guide in
light English, the module titles in light mode are readable, the algorithm
reader gains a k-core walkthrough, and the bibliography grows to 105 entries.

**Start here**

- Added the Start view (`#/en/guide`) and made it the default landing page.
  It maps the four doors (argument, experiments, code, evidence), explains the
  rail, hash routes, search and `?guide=open`, and gives three reading paths:
  twenty minutes, an afternoon, and a pre-citation check.
- The guide is authored in English, Chinese and German; the default remains
  light/English, while language and theme choices are still remembered.
- Added the guide to the PWA start URL, sitemap and service-worker shell.

**Light-mode titles**

- Fixed the module titles that inherited pale dark-HUD ink: laboratory cards,
  library section index, inline data/source labels and compact table labels.
- The reader headings and KaTeX fixes from 3.1.1 remain in place.

**References**

- Added five verified entries: Grimmett's *The Random-Cluster Model* (2006),
  Dorogovtsev–Mendes (2002), Newman's SIAM Review article (2003), Albert–
  Barabási (2002), and Boccaletti et al. (2006).
- Current audit: 103 verified, 2 explanatory notes, 105 total.

**Housekeeping**

- Removed the stale `lib/python/build` tree from the code inventory and made
  the inventory builder ignore build, dist and egg-info directories.
- Kept the patch-level 3.1.1 changelog entry below; that release only changed
  reader contrast.

## 3.1.1 — 2026-11-13

A contrast patch for the reader in light mode. The page background was light
but several reader colours still came from the dark HUD palette: h1, h2,
section headings, table cells, block quotes and KaTeX formulas were almost
invisible.

The light theme now sets its own ink for the reader: near-black headings,
dark body text, darker table headers and cells, readable code, block quotes
and links, and an explicit `color` on KaTeX so formulas no longer inherit the
pale dark-theme text. The table of contents and document metadata were
darkened at the same time. The dark theme is unchanged.

No content, algorithm, golden file or reference changed in this patch.

## 3.1.0 — 2026-11-12

A readability and evidence release. The site now opens light and English on a
first visit, the algorithm code has a reader of its own, and the bibliography
grew from 81 to 100 entries.

**Default and navigation**

- First visit lands on `#/en/overview` with the light theme. A saved choice
  still wins; `?theme=dark` / `?theme=light` force a theme for links and
  screenshots. The inline boot script, the `<html>` attribute and the theme
  module all agree on the default, so there is no dark flash.
- Added an **Algorithms** view to the top bar and rail. It covers seven
  routines with the idea, the invariant, the cost, the common mistakes, the
  exact source links and the tests that check them.
- The Code workbench accepts `?file=...` deep links, so an algorithm page can
  open the real file instead of a paraphrase.

**Algorithm and code readability**

- Added `assets/js/lib/algorithm-guide.js` and `assets/js/views/algorithms.js`;
  the guide is authored in English, Chinese and German.
- Added `docs/ALGORITHMS.md`, a repository-level map of the seven routines and
  their correctness arguments.
- Removed the unused `trapping` flag from the invasion interface. The code and
  the guide now say plainly that the implementation uses loop rejection and is
  not the trapping variant.
- Kept the v3 contract honest: bootstrap, invasion, Leath and Achlioptas are
  Python + JavaScript; the Bernoulli core remains four-language.

**References**

- Added 19 verified entries: books by Dorogovtsev, Newman, Christensen and
  Moloney, Zallen, Bunde and Havlin, Hughes, and Bianconi; reviews by Li et al.,
  Saberi, D'Souza et al., Boccaletti et al., Kivelä et al. and Isichenko;
  papers by Nienhuis, Smirnov, Baxter et al., De Domenico et al. and Berkowitz
  and Ewing; plus the graph-tool software entry.
- The audit now checks the DOI title, year and first author. Current count:
  98 verified, 2 explanatory notes, 100 total.
- The chapters that use these sources cite them: two dimensions, exponents,
  networks, multilayer networks, applications, transport, proofs and design.

**Small corrections and polish**

- Light-theme contrast fixes for source cards, code file trees and canvas
  wrappers.
- The code view explains the parity scope in one sentence rather than letting
  the old “four languages” headline overstate it.
- The algorithm reader states the bootstrap `r = 2` zero-threshold and the
  Achlioptas continuity caveats in place, next to the code.

## 3.0.0 — 2026-11-12

The algorithm and application release. The atlas grows from 18 to 21 chapters,
from 9 to 13 laboratories, and from 64 to 81 audited references (79 Crossref/HTTP-verified, 2 with explanatory notes); the core
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
