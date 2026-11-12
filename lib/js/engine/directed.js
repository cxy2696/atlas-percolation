/**
 * Directed percolation on an L x L square lattice.
 *
 * Edges point east (E) and south (S) only.  In the usual (1+1)-dimensional
 * picture the row index is time and the column index is space, so an open
 * directed path is a causal chain.  Bond mode opens every E/S edge with
 * probability p; site mode occupies every site with probability p and treats
 * all E/S edges as open between occupied sites.
 *
 * The RNG consumption is the same as the undirected sampler for the same
 * lattice: n uniforms in site mode (site order), m uniforms in bond mode
 * (lattice edge order).  SW edges are not used; this module requires the
 * square lattice so that the edge set is exactly {E,S}.
 */
import { Rng } from './rng.js';

function edgeIndex(lat) {
  const idx = new Int32Array(lat.n * 2).fill(-1);
  for (let e = 0; e < lat.m; e++) {
    const a = lat.eu[e];
    const b = lat.ev[e];
    if (b === a + 1 && Math.floor(a / lat.L) === Math.floor(b / lat.L)) idx[a * 2] = e;
    else if (b === a + lat.L) idx[a * 2 + 1] = e;
  }
  return idx;
}

/**
 * Draw one directed configuration and return the reachable set from the
 * left boundary.  A left-right directed crossing is `reach` on any site in
 * the last column.
 */
export function directedCrossing(lat, p, rng, { mode = 'bond' } = {}) {
  if (lat.kind !== 'square') throw new Error('directed percolation needs the square lattice');
  if (mode !== 'bond' && mode !== 'site') throw new Error(`bad mode ${mode}`);
  const L = lat.L;
  const n = lat.n;
  // Always return full masks, even when one of them is all ones, so the
  // four languages expose the same object shape.
  const occ = new Uint8Array(n).fill(1);
  const open = new Uint8Array(lat.m).fill(1);
  if (mode === 'site') {
    for (let v = 0; v < n; v++) occ[v] = rng.random() < p ? 1 : 0;
  } else {
    for (let e = 0; e < lat.m; e++) open[e] = rng.random() < p ? 1 : 0;
  }
  const eidx = edgeIndex(lat);
  const reach = new Uint8Array(n);
  let cross = false;
  for (let i = 0; i < L; i++) {
    const row = i * L;
    for (let j = 0; j < L; j++) {
      const v = row + j;
      if (mode === 'site' && !occ[v]) continue;
      let r = j === 0 ? 1 : 0;
      if (!r && j > 0) {
        const e = eidx[(v - 1) * 2];
        if (reach[v - 1] && (mode === 'site' || (e >= 0 && open[e]))) r = 1;
      }
      if (!r && i > 0) {
        const e = eidx[(v - L) * 2 + 1];
        if (reach[v - L] && (mode === 'site' || (e >= 0 && open[e]))) r = 1;
      }
      reach[v] = r;
      if (r && j === L - 1) cross = true;
    }
  }
  return { cross, reach, open, occ, mode, m: lat.m, n };
}

/** Convenience: crossing indicator only. */
export function directedCrossesLR(lat, p, rng, opts = {}) {
  return directedCrossing(lat, p, rng, opts).cross;
}

/** Empirical crossing probability over `samples` configurations. */
export function directedCrossingRate(lat, p, rng, { mode = 'bond', samples = 100 } = {}) {
  if (!Number.isInteger(samples) || samples < 1) throw new Error('samples must be positive');
  let hits = 0;
  for (let s = 0; s < samples; s++) if (directedCrossing(lat, p, rng, { mode }).cross) hits++;
  return hits / samples;
}

export default directedCrossing;
