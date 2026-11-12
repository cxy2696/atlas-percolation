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
requires even `L`).  With `torus=true` edges wrap; with `torus=false` edges
that would leave the box are omitted.

## Bernoulli percolation

`Percolation(lattice, mode)` where `mode` is `"site"` or `"bond"`.

- `sample(p, rng)` — draw a configuration (consumption order in `RNG.md`).
- `build()` — union-find over open edges between occupied sites.
- `analyze()` — cluster statistics: count, sizes, largest, sum, sum of squares.
- `crosses_lr()` / `crosses_tb()` — boundary-crossing tests.

Cluster statistics use occupied sites as the denominator.  `chi2` is
`sum |C|^2 / sum |C|` (the second-moment susceptibility proxy); `s_max` is the
largest cluster size, and `s_max_fraction = s_max / sum|C|`.

## Newman–Ziff sweep

`newman_ziff(lattice, rng, checkpoints)` → arrays `p, smax, chi2, nclusters`.
Bond percolation only.  One random edge order gives the whole curve; `p` runs
over the grid `k/m`.

## Networks

- `poisson_degrees(N, mean, rng)` — Poisson degree sequence with even sum.
- `power_law_degrees(N, gamma, kmin, kmax, rng)` — Pareto tail.
- `configuration_model(deg, rng)` — uniform stub pairing, multigraph, CSR.
- `components(graph, active)` — sizes, largest, largest fraction.
- `kcore(graph, active, k)` — bucket peeling, returns survivors.
- `targeted_removal(graph, frac)` — delete the highest-degree vertices.
- `interdependent_er(N, mean, p, rng)` — one-to-one coupled ER cascade. The round keeps the intersection of the giant components of both layers; returns `fraction`, `cascade`, the two graphs and the final active mask. Pruning each layer independently is not the same algorithm and overestimates the mutual component.
- `molloy_reed(deg)` — mean, second moment, kappa, p_c, f_c.

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
- `molloy_reed` returns `pc = Inf` when the second moment is not larger than
  the first (no giant component at any `p <= 1`).
