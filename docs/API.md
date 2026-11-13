# Shared API surface

The four libraries implement the same small set of primitives.  Names are
`snake_case` in Python/Julia/C++ and `camelCase` in JavaScript; the semantics
are identical and are covered by the same tests.  Any function marked
"parity" must produce bit-identical results for the same seed.

## Lattices

`build_lattice(kind, L, torus=false)` → lattice object with

- `n = L*L` sites, numbered `i*L + j`;
- `m` edges, each listed once, in row-major order;
- `eu[e]`, `ev[e]` endpoint arrays;
- `etype[e]` in `{0,1,2}`: E, S, SW (triangular only).

Kinds: `square` (degree 4), `triangular` (degree 6), `honeycomb` (degree 3,
requires even `L >= 6`; smaller brick-wall quotients have parallel edges and
4-cycles and are not the honeycomb lattice).  With `torus=true` edges wrap; with `torus=false` edges
that would leave the box are omitted.

## Bernoulli percolation

`Percolation(lattice, mode)` where `mode` is `"site"` or `"bond"`.

- `sample(p, rng)` — draw a configuration (consumption order in `RNG.md`).
- `build()` — union-find over open edges between occupied sites.
- `analyze()` — cluster statistics: count, sizes (descending), largest, sum, sum of squares.
- `crosses_lr()` / `crosses_tb()` — boundary-crossing tests.

Cluster statistics use occupied sites as the denominator.  `chi2` is
`sum |C|^2 / sum |C|` (the second-moment susceptibility proxy); `s_max` is the
largest cluster size, and `s_max_fraction = s_max / sum|C|`.

## Newman–Ziff sweep

`newman_ziff(lattice, rng, checkpoints)` → arrays `p, smax, chi2, nclusters`.
Bond percolation only.  One random edge order gives the whole curve; `p` runs
over the grid `k/m`.

## Directed percolation

`directed_crossing(lattice, p, rng, mode)` — one directed configuration on a
square lattice with east and south edges. Bond mode opens every E/S edge with
probability `p`; site mode occupies sites with probability `p`. The function
returns `cross`, the reachable mask, the open/occupancy masks, `m` and `n`.
The reachability DP is row-major and O(L^2); RNG consumption is the same as the
undirected sampler (n uniforms for site, m for bond). `directed_crossing_rate`
is the empirical mean over independent draws. The 1+1 reference thresholds are
`p_c = 0.644700(10)` (bond) and `0.705489(4)` (site); these are numerical, and
there is no exact 1/2 identity at `p_c`.

## Networks

- `poisson_degrees(N, mean, rng)` — Poisson degree sequence with even sum.
- `power_law_degrees(N, gamma, kmin, kmax, rng)` — Pareto tail.
- `configuration_model(deg, rng)` — uniform stub pairing, multigraph, CSR.
- `components(graph, active)` — sizes, largest, largest fraction.
- `kcore(graph, active, k)` — bucket peeling, returns survivors.
- `targeted_removal(graph, frac)` — delete the highest-degree vertices.
- `interdependent_er(N, mean, p, rng)` — one-to-one coupled ER cascade. The round keeps the intersection of the giant components of both layers; returns `fraction`, `cascade`, the two graphs and the final active mask. Pruning each layer independently is not the same algorithm and overestimates the mutual component.
- `molloy_reed(deg)` — mean, second moment, kappa, p_c, f_c. Empty or
  zero-mean sequences raise; a degenerate sequence with `k2 <= k1` returns
  `pc = 1`, `fc = 0` rather than a negative removal fraction.

## Continuum

`boolean_model(n, r, rng)` — Poisson points in the unit square, hard disks of
radius `r`, grid neighbour search, returns points, labels, sizes and the
analytic coverage `1 - exp(-n*pi*r^2)`.

## Cardy formula

`cardy_crossing(l)` — left-right crossing probability at criticality for
aspect ratio `l = H/W`. The modulus `m` solves `l = K(m)/K(1-m)` and the
formula is `C m^(1/3) 2F1(1/3,2/3;4/3;m)`; for `l > 1` the symmetry
`P(l) = 1 - P(1/l)` is used. `cardy_modulus(l)` exposes the modulus and
`cardy_crossing_vertical(l) = 1 - cardy_crossing(l)`. The argument must be
finite and positive in every implementation.

## Coupled networks: the exact update

For a one-to-one coupling the two layers share vertex labels. At each
round, with surviving set $S$:

1. compute the largest connected component $G_A(S)$ in layer A;
2. compute the largest connected component $G_B(S)$ in layer B;
3. set $S \leftarrow S \cap G_A(S) \cap G_B(S)$.

Iterate until $S$ is unchanged. The final `fraction` is $|S|/N$. The first
edition pruned A and B independently, which kept vertices whose partner had
already failed; the parity probe changed from 0.668 to 0.5306666666666666
for seed 11. The lab and the C++ benchmark use the same update.

## Error conventions

- Ill-formed arguments raise/throw (`ValueError`, `ArgumentError`,
  `std::invalid_argument`, `Error`); nothing returns `NaN` silently.
- `crosses_lr` on an empty occupancy field returns `false`.
- `molloy_reed` returns `pc = 1`, `fc = 0` when the second moment is not
  larger than the first (no giant component at any `p < 1`); an empty or
  zero-mean sequence raises.
- `Rng.int(n)` rejects `n > 2^32`; `poisson_degrees` switches to a stable
  exponential-sum sampler for `mean > 700`; `power_law_degrees` requires
  `gamma > 1` and keeps the even-sum fix inside `[kmin, kmax]`.


## Algorithm zoo

These routines live in all four libraries: `lib/python/percolation_atlas/algorithms.py`,
`lib/js/engine/algorithms.js`, `lib/cpp/include/percolation_atlas/algorithms.hpp`
and `lib/julia/src/algorithms.jl`. They share the `Dsu` and `Rng` types with
the Bernoulli core and have their own four-language parity contract
(`data/golden/algorithms-v3.json`).

- `neighbours_from_edges(n, eu, ev)` → `(start, adj, edge_of, degree)` CSR.
  Python returns a tuple; JavaScript returns an object with the same fields.
- `bootstrap_activation(n, neighbours, initial, r)` → result with `active`,
  `time`, `rounds`, `active_count`, `fraction`, `converged`. Synchronous
  r-neighbour closure; the least fixed point, independent of update order.
  `bootstrap_lattice(lattice, occupied, r)` is the lattice convenience form.
- `explosive_sweep(n, eu, ev, candidate_order, rule)` → trajectory indexed by
  candidate steps. `rule` is `"product"` or `"sum"`. `explosive_percolation`
  shuffles the edge list with the shared RNG; `explosive_random_graph` samples
  two uniform pairs per step on the complete graph.
- `invasion_cluster(n, eu, ev, threshold, seed)` → `order`, `thresholds`,
  `accepted`, `visited`, `size`, `loops`, `loop_edges`. The accepted edges
  form a spanning tree of the invaded region.
- `invasion_percolation(..., rng_seed)` draws i.i.d. uniform thresholds.
- `leath_cluster(lattice, seed, p, rng)` → `sites`, `size`, `open_edges`,
  `perimeter`, `truncated`.
- `random_graph_sweep(n, seed)` is the Erdős–Rényi baseline used by the
  explosive laboratory.

The convention is the same in both languages except for naming (`snake_case`
in Python, `camelCase` in JavaScript). Integer results and component sizes are
exact; the golden file uses tolerances only for the float-valued fields.

## Command line: `atlas-perc`

```sh
atlas-perc info
atlas-perc sample --lattice square --mode bond --L 128 --p 0.5 --seed 42
atlas-perc sweep --lattice square --L 64 --seed 7
atlas-perc bootstrap --L 64 --p 0.55 --r 3 --seed 11
atlas-perc invasion --L 48 --seed 3
atlas-perc explosive --n 2000 --rule product --seed 7
atlas-perc serve --host 127.0.0.1 --port 8080
```

Every command accepts `--json` and prints a stable JSON envelope:
`{"package", "version", "engine", "command", "result"}`. Errors return exit
status 2 with a one-line message on stderr.

## HTTP API

`atlas-perc serve` serves the static site from the repository root and a JSON
API. Request bodies are JSON objects; unknown fields are ignored, sizes are
bounded, and errors are `{"ok": false, "error": "..."}` with status 400/404/500.

| Method | Route | Body / notes |
|---|---|---|
| GET | `/api/health` | `{"ok": true, "version": ...}` |
| GET | `/api/thresholds` | exact/numerical table with status labels |
| GET | `/api/openapi.json` | OpenAPI 3.1 document |
| POST | `/api/sample` | `{lattice, mode, L, p, seed}`; `L ≤ 512` |
| POST | `/api/sweep` | `{lattice, L, seed, checkpoints}`; `L ≤ 512` |
| POST | `/api/bootstrap` | `{lattice, L, p, r, seed}`; `L ≤ 256` |
| POST | `/api/invasion` | `{lattice, L, seed, rng_seed}`; `L ≤ 128` |
| POST | `/api/explosive` | `{n, rule, seed}`; `n ≤ 20000` |

The API is a reference service with no authentication and no persistence. It
does not expose a job queue; long runs should be done with the CLI or the
Python API directly. The Dockerfile runs `atlas-perc serve` on port 8080.

## Trees, configuration models and epidemics

Deterministic fixed-point routines; no random stream is consumed.

- `bethe_threshold(z)` — exact threshold `1/(z-1)` of the z-regular tree.
- `bethe_percolation(z, p)` — returns `theta`, `u`, `pc`, `chi` and
  `supercritical`. `chi` is infinite at and above `p_c` (the mean includes the
  infinite cluster).
- `poisson_pmf(c, kmax=None)` — truncated, normalised Poisson probabilities.
- `configuration_giant_component(pmf, T=1)` — returns `S`, `u`, `kappa`, `tc`,
  `mean_degree` and `r0` for the configuration model after bond dilution.
- `sir_final_size(pmf, T)` — returns `final_size`, `r0`, `kappa`, `tc` and
  `herd_immunity`. The final size is the giant component with transmissibility
  `T`; see Chapters 22–23.
- `newman_ziff_site(lattice, rng, checkpoints=400)` — site-mode Newman–Ziff;
  returns `p`, `smax`, `chi2` (with denominator `n`), `nclusters` and `n`.
- `message_passing_percolation(n, eu, ev, T, max_iter=10000, tol=1e-12)` —
  cavity iteration; returns `S`, `outside`, `iterations`, `converged` and
  `maxChange`. Exact on trees, the Bethe approximation on graphs with cycles.
- `label_clusters(n, eu, ev, open_edges=None, active=None)` — Hoshen–Kopelman
  labelling. Inactive vertices get label `-1`; returns `labels`, `sizes`,
  `count`, `max_size` and `max_label`.

The algorithm zoo (`bootstrap_activation`, `invasion_cluster`,
`leath_cluster`, `explosive_*`, `neighbours_from_edges`) is implemented in all
four languages; its golden probes are in `data/golden/algorithms-v3.json`.

## Errors and validation

All routines reject out-of-range probabilities, negative sizes, non-integer
thresholds and empty degree distributions. The Python package raises
`ValueError`; JavaScript throws `Error`; C++ throws `std::invalid_argument`;
Julia throws `ArgumentError`. The parity tests do not depend on the exception
text.
