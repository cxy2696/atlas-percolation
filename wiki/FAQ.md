# FAQ

### Why does the site open light and English?

It is the default for a first visit. A saved language/theme choice wins; `?theme=light` and `?theme=dark` override the theme for a link. The storage keys are versioned so an old preference does not silently override the new default.

### Are all 140 references verified?

138 are verified against Crossref (title, year, first author) or an HTTP fetch. Two carry explanatory notes: Menshikov (1986) has no DOI for the translation; Stauffer & Aharony is the 1994 edition while the DOI identifies a later reissue. The audit record lists every result.

### Is `p_c = 1/2` exact?

For square-lattice **bond** percolation, yes (Kesten 1980). For square-lattice **site** percolation, `0.592746…` is numerical, not a closed form. Directed percolation has no duality at threshold, so its crossing probability is not `1/2`.

### Why does bootstrap at `r = 2` fill a finite box at low `p`?

The infinite square-lattice threshold for the two-neighbour rule is zero. A finite box fills above a crossover that depends on `L`. This is why the laboratory measures a finite-size onset and says so.

### Why is “explosive” percolation not a discontinuity?

The product rule produces a sharp finite-size jump, but the thermodynamic limit is continuous. The laboratory's scaling check shows the jump shrinking with `n`.

### Does GitHub Pages run the API?

No. Pages serves the static site. Use `atlas-perc serve` or the Docker image for `/api/*`.

### Why are only some algorithms in C++ and Julia?

The Bernoulli core, the v3 algorithm zoo (bootstrap, invasion, Leath, Achlioptas, random-graph baseline), the labelling routine and the tree/epidemic solvers are four-language. Their golden probes are in `data/golden/parity.json` and `data/golden/algorithms-v3.json`.

### Why do timings differ between runs?

Browser wall-clock timings include JIT, cache and scheduling noise. The algorithm studio reports teaching-scale timings; use the C++ harness for measurements you intend to publish.

### I changed the theme and the page still looks old.

The service worker caches the shell. It is versioned (`atlas-v4.3.0`); refresh once, or hard-refresh with `Cmd/Ctrl + Shift + R`.

### Where do I start?

Read Chapter 01, run the lattice laboratory at `p = 1/2`, then look up one source. That loop is the method.
