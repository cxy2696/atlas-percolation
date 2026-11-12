# Changelog

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
