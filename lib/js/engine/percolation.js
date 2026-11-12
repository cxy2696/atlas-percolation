/**
 * Bernoulli percolation on an arbitrary lattice, plus observables.
 *
 * Site percolation: every site is occupied independently with probability p.
 * Bond percolation: every site is present; every bond is open independently
 * with probability p.  A cluster is a connected component of the graph
 * induced by occupied sites and open bonds.
 *
 * RNG consumption order is part of the public contract:
 *   - site mode: n uniforms, site order 0..n-1;
 *   - bond mode: m uniforms, edge order as produced by buildLattice.
 */
import { Dsu } from './dsu.js';

export class ClusterStats {
  constructor(n) {
    this.rootSize = new Int32Array(n);
    this.touched = new Int32Array(n);
    this.stamp = new Int32Array(n);
    this.gen = 0;
    this.count = 0;
    this.maxSize = 0;
    this.sum = 0;
    this.sum2 = 0;
    this.sizes = [];
  }

  compute(dsu, active) {
    const { rootSize, touched } = this;
    const n = dsu.n;
    let nt = 0;
    for (let v = 0; v < n; v++) {
      if (!active[v]) continue;
      const r = dsu.find(v);
      let s = rootSize[r];
      if (s === 0) touched[nt++] = r;
      rootSize[r] = s + 1;
    }
    let count = 0;
    let max = 0;
    let sum = 0;
    let sum2 = 0;
    const sizes = new Array(nt);
    for (let k = 0; k < nt; k++) {
      const r = touched[k];
      const s = rootSize[r];
      sizes[k] = s;
      rootSize[r] = 0;
      count++;
      sum += s;
      sum2 += s * s;
      if (s > max) max = s;
    }
    this.count = count;
    this.maxSize = max;
    this.sum = sum;
    this.sum2 = sum2;
    // Consumers read sizes[0] as the largest cluster; keep the order
    // descending, as the other three libraries do.
    sizes.sort((a, b) => b - a);
    this.sizes = sizes;
    return this;
  }

  /** Mean finite-cluster size (second-moment / first-moment). */
  meanClusterSize() {
    return this.count ? this.sum / this.count : 0;
  }

  /** Susceptibility proxy: sum |C|^2 / (number of occupied sites). */
  chi2() {
    return this.sum ? this.sum2 / this.sum : 0;
  }

  /** Largest cluster as a fraction of the occupied sites. */
  maxFraction() {
    return this.sum ? this.maxSize / this.sum : 0;
  }

  sizeHistogram() {
    const h = new Map();
    for (const s of this.sizes) h.set(s, (h.get(s) || 0) + 1);
    return h;
  }
}

export class Percolation {
  constructor(lattice, { mode = 'bond' } = {}) {
    if (mode !== 'bond' && mode !== 'site') throw new Error(`bad mode ${mode}`);
    this.lat = lattice;
    this.mode = mode;
    this.occ = new Uint8Array(lattice.n);
    this.open = new Uint8Array(lattice.m);
    this.dsu = new Dsu(lattice.n);
    this.stats = new ClusterStats(lattice.n);
    this.occ.fill(1);
    this.open.fill(1);
    this.dirty = true;
  }

  /** Rebuild only when the configuration changed since the last build. */
  ensureBuilt() {
    if (this.dirty) {
      this.build();
      this.dirty = false;
    }
    return this.dsu;
  }

  /** Draw a fresh configuration. Returns this. */
  sample(p, rng) {
    const { lat, occ, open } = this;
    if (this.mode === 'site') {
      for (let v = 0; v < lat.n; v++) occ[v] = rng.random() < p ? 1 : 0;
      open.fill(1);
    } else {
      occ.fill(1);
      for (let e = 0; e < lat.m; e++) open[e] = rng.random() < p ? 1 : 0;
    }
    this.dirty = true;
    return this;
  }

  /** Load an explicit configuration (used by the replay/debug tools). */
  load({ occ, open }) {
    if (occ) this.occ.set(occ);
    if (open) this.open.set(open);
    this.dirty = true;
    return this;
  }

  /** Build the union-find forest. Returns this.dsu. */
  build() {
    const dsu = this.dsu;
    const { eu, ev } = this.lat;
    const { occ, open } = this;
    dsu.reset();
    let active = 0;
    for (let v = 0; v < this.lat.n; v++) active += occ[v];
    dsu.count = active;
    dsu.maxSize = active ? 1 : 0;
    for (let e = 0; e < this.lat.m; e++) {
      if (open[e] && occ[eu[e]] && occ[ev[e]]) dsu.union(eu[e], ev[e]);
    }
    this.dirty = false;
    return dsu;
  }

  analyze() {
    this.build();
    return this.stats.compute(this.dsu, this.occ);
  }

  /** Does some cluster join the left and right boundary? */
  crossesLR() {
    this.ensureBuilt();
    const { L } = this.lat;
    const stamp = this.stats.stamp;
    const gen = ++this.stats.gen;
    for (let i = 0; i < L; i++) {
      const v = i * L;
      if (this.occ[v]) stamp[this.dsu.find(v)] = gen;
    }
    for (let i = 0; i < L; i++) {
      const v = i * L + L - 1;
      if (this.occ[v] && stamp[this.dsu.find(v)] === gen) return true;
    }
    return false;
  }

  crossesTB() {
    this.ensureBuilt();
    const { L } = this.lat;
    const stamp = this.stats.stamp;
    const gen = ++this.stats.gen;
    for (let j = 0; j < L; j++) {
      const v = j;
      if (this.occ[v]) stamp[this.dsu.find(v)] = gen;
    }
    for (let j = 0; j < L; j++) {
      const v = (L - 1) * L + j;
      if (this.occ[v] && stamp[this.dsu.find(v)] === gen) return true;
    }
    return false;
  }
}

/**
 * Newman–Ziff incremental sweep for bond percolation.
 * One random edge order yields the full curve S_max(p), chi2(p), n_clusters(p)
 * for all p on the grid k/m.
 */
export function newmanZiff(lattice, rng, { checkpoints = 400 } = {}) {
  if (!Number.isInteger(checkpoints) || checkpoints < 1) throw new Error('checkpoints must be positive');
  const m = lattice.m;
  const order = new Int32Array(m);
  for (let e = 0; e < m; e++) order[e] = e;
  rng.shuffle(order);
  const dsu = new Dsu(lattice.n);
  let total2 = lattice.n; // sum of |C|^2, starts at n singletons
  const p = [];
  const smax = [];
  const chi2 = [];
  const nclusters = [];
  const every = Math.max(1, Math.floor(m / checkpoints));
  for (let k = 0; k < m; k++) {
    const e = order[k];
    const a = dsu.find(lattice.eu[e]);
    const b = dsu.find(lattice.ev[e]);
    if (a !== b) {
      const sa = dsu.size[a];
      const sb = dsu.size[b];
      dsu.union(a, b);
      total2 += 2 * sa * sb;
    }
    if ((k + 1) % every === 0 || k === m - 1) {
      const pp = (k + 1) / m;
      p.push(pp);
      smax.push(dsu.maxSize);
      chi2.push(total2 / lattice.n);
      nclusters.push(dsu.count);
    }
  }
  return {
    p: Float64Array.from(p),
    smax: Float64Array.from(smax),
    chi2: Float64Array.from(chi2),
    nclusters: Float64Array.from(nclusters),
    m,
    n: lattice.n,
  };
}

/** Cluster size distribution at a fixed p (site or bond). */
export function clusterSizeDistribution(lat, p, rng, { mode = 'bond', samples = 1 } = {}) {
  const model = new Percolation(lat, { mode });
  const hist = new Map();
  for (let s = 0; s < samples; s++) {
    model.sample(p, rng);
    model.analyze();
    for (const size of model.stats.sizes) hist.set(size, (hist.get(size) || 0) + 1);
  }
  return hist;
}
