# Four-language examples

The same experiment in each library: draw 1000 bond configurations on a 64×64 square lattice at `p=1/2`, count left–right crossings, and print the rate. The answer is identical for the same seed; that is the parity contract.

## JavaScript

```js
import { Rng, buildLattice, Percolation } from './lib/js/index.js';

const model = new Percolation(buildLattice('square', 64), { mode: 'bond' });
const rng = new Rng(2024);
let hits = 0;
for (let i = 0; i < 1000; i++) hits += model.sample(0.5, rng).crossesLR() ? 1 : 0;
console.log(hits / 1000);
```

## Python

```python
from percolation_atlas import Rng, build_lattice, Percolation

model = Percolation(build_lattice("square", 64), mode="bond")
rng = Rng(2024)
hits = sum(model.sample(0.5, rng).crosses_lr() for _ in range(1000))
print(hits / 1000)
```

## C++

```cpp
#include <percolation_atlas/atlas.hpp>
#include <iostream>

int main() {
  const auto lat = atlas::build_lattice("square", 64);
  atlas::Percolation model(lat, atlas::Mode::Bond);
  atlas::Rng rng(2024);
  int hits = 0;
  for (int i = 0; i < 1000; ++i) {
    model.sample(0.5, rng);
    if (model.crosses_lr()) ++hits;
  }
  std::cout << hits / 1000.0 << "\n";
}
```

Compile with `-std=c++20 -Ilib/cpp/include`.

## Julia

```julia
using PercolationAtlas

model = Percolation(build_lattice("square", 64), "bond")
rng = Rng(2024)
hits = 0
for _ in 1:1000
    sample!(model, 0.5, rng)
    hits += crosses_lr(model) ? 1 : 0
end
println(hits / 1000)
```

Run from the repository root with `julia --project=lib/julia`.

## Directed percolation

The directed probe returns a reachable mask and a crossing flag. The call is
the same in all four languages; the mode is `"bond"` or `"site"`.

```js
directedCrossing(buildLattice('square', 32), 0.65, new Rng(4242), { mode: 'bond' }).cross
```

```python
directed_crossing(build_lattice("square", 32), 0.65, Rng(4242), "bond")["cross"]
```

```cpp
atlas::directed_crossing(atlas::build_lattice("square", 32), 0.65, rng, false).cross
```

```julia
directed_crossing(build_lattice("square", 32), 0.65, Rng(4242); mode = "bond").cross
```

## API names

| concept | JavaScript | Python | C++ | Julia |
|---|---|---|---|---|
| generator | `Rng` | `Rng` | `atlas::Rng` | `Rng` |
| lattice | `buildLattice(kind, L, {torus})` | `build_lattice(kind, L, torus)` | `atlas::build_lattice(kind, L, torus)` | `build_lattice(kind, L; torus)` |
| model | `new Percolation(lat, {mode})` | `Percolation(lat, mode)` | `atlas::Percolation(lat, mode)` | `Percolation(lat, mode)` |
| sample | `sample(p, rng)` | `sample(p, rng)` | `sample(p, rng)` | `sample!(model, p, rng)` |
| crossing | `crossesLR()` | `crosses_lr()` | `crosses_lr()` | `crosses_lr(model)` |
| Newman–Ziff | `newmanZiff(lat, rng)` | `newman_ziff(lat, rng)` | `atlas::newman_ziff(lat, rng)` | `newman_ziff(lat, rng)` |
| directed | `directedCrossing(lat, p, rng, {mode})` | `directed_crossing(lat, p, rng, mode)` | `atlas::directed_crossing(lat, p, rng, site)` | `directed_crossing(lat, p, rng; mode)` |

The RNG and observation order are documented in `docs/RNG.md`; the full API is in `docs/API.md`.

## v3 algorithms: bootstrap, invasion and the Achlioptas process

The v3 routines are exposed in Python and JavaScript. They share the Dsu and
Rng types with the core, and their parity file is
`data/golden/algorithms-v3.json`.

```python
from percolation_atlas import (
    Rng, build_lattice, bootstrap_lattice,
    invasion_percolation, explosive_random_graph,
)

lat = build_lattice("square", 64)
rng = Rng(11)
occupied = [1 if rng.random() < 0.55 else 0 for _ in range(lat.n)]
boot = bootstrap_lattice(lat, occupied, r=3)
print(boot.fraction, len(boot.rounds))       # ~0.7, a handful of rounds

inv = invasion_percolation(lat.n, lat.eu, lat.ev, seed=0, rng_seed=5)
print(inv.size, inv.last_threshold, inv.loops)

ex = explosive_random_graph(2000, rule="product", seed=7)
print(ex.points[-1]["smax"], ex.max_jump)
```

```javascript
import {
  Rng, buildLattice, bootstrapLattice,
  invasionPercolation, explosiveRandomGraph,
} from "./lib/js/index.js";

const lat = buildLattice("square", 64);
const rng = new Rng(11);
const occupied = new Uint8Array(lat.n);
for (let v = 0; v < lat.n; v++) occupied[v] = rng.random() < 0.55 ? 1 : 0;
const boot = bootstrapLattice(lat, occupied, 3);
console.log(boot.fraction, boot.rounds.length);

const inv = invasionPercolation(lat.n, lat.eu, lat.ev, { seed: 0, rngSeed: 5 });
console.log(inv.size, inv.lastThreshold, inv.loops);

const ex = explosiveRandomGraph(2000, { rule: "product", seed: 7 });
console.log(ex.points.at(-1).smax, ex.maxJump);
```

The CLI produces the same numbers:

```sh
atlas-perc bootstrap --L 64 --p 0.55 --r 3 --seed 11
atlas-perc invasion --L 64 --seed 3
atlas-perc explosive --n 2000 --rule product --seed 7
```
