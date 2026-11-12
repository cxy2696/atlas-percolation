# Changelog

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
