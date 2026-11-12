/**
 * Continuum (Boolean) percolation in the unit square: Poisson points,
 * hard disks of radius r, two disks connected when they overlap.
 * Neighbour search uses a uniform grid with cell size 2r.
 */
import { Dsu } from './dsu.js';

export function poissonPoints(n, rng) {
  const x = new Float64Array(n);
  const y = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    x[i] = rng.random();
    y[i] = rng.random();
  }
  return { x, y, n };
}

export function booleanModel(n, r, rng) {
  const { x, y } = poissonPoints(n, rng);
  const dsu = new Dsu(n);
  const cells = new Map();
  const size = 2 * r;
  const cellOf = (v) => {
    const cx = Math.floor(x[v] / size);
    const cy = Math.floor(y[v] / size);
    return cx + ':' + cy;
  };
  for (let v = 0; v < n; v++) {
    const key = cellOf(v);
    let arr = cells.get(key);
    if (!arr) cells.set(key, (arr = []));
    arr.push(v);
  }
  const r2 = (2 * r) * (2 * r);
  const neigh = [-1, 0, 1];
  for (let v = 0; v < n; v++) {
    const cx = Math.floor(x[v] / size);
    const cy = Math.floor(y[v] / size);
    for (const dx of neigh) {
      for (const dy of neigh) {
        const arr = cells.get(cx + dx + ':' + (cy + dy));
        if (!arr) continue;
        for (const w of arr) {
          if (w <= v) continue;
          const ddx = x[v] - x[w];
          const ddy = y[v] - y[w];
          if (ddx * ddx + ddy * ddy <= r2) dsu.union(v, w);
        }
      }
    }
  }
  const rootSize = new Int32Array(n);
  let largest = 0;
  const touched = [];
  for (let v = 0; v < n; v++) {
    const rt = dsu.find(v);
    if (rootSize[rt] === 0) touched.push(rt);
    rootSize[rt]++;
    if (rootSize[rt] > largest) largest = rootSize[rt];
  }
  const sizes = touched.map((rt) => rootSize[rt]).sort((a, b) => b - a);
  return {
    n,
    r,
    x,
    y,
    dsu,
    sizes,
    largest,
    largestFraction: n ? largest / n : 0,
    /** Fraction of the square covered by at least one disk (theoretical mean). */
    coverage: 1 - Math.exp(-n * Math.PI * r * r),
  };
}
