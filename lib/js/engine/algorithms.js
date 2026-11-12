/**
 * Algorithm zoo: bootstrap, explosive (Achlioptas), invasion and Leath growth.
 *
 * These four routines are deliberately written against explicit inputs
 * (neighbour lists, edge lists, threshold arrays) so that they can be tested
 * without a random number generator and compared across implementations.
 * The random-stream versions are thin wrappers around the same code.
 *
 * Complexity summary
 *   bootstrapActivation   O(n + m) time, O(n + m) memory, at most n rounds
 *   explosiveSweep        O(m α(n)) time, O(n + m) memory
 *   invasionCluster       O((|C| + b) log b) time, b boundary edges
 *   leathCluster          O(|C| + boundary) time, one pass over touched edges
 */
import { Dsu } from './dsu.js';
import { Rng } from './rng.js';

function maxOf(a) {
  let m = 0;
  for (let i = 0; i < a.length; i++) if (a[i] > m) m = a[i];
  return m;
}

/** Build a symmetric neighbour list from an undirected edge list. */
export function neighboursFromEdges(n, eu, ev) {
  const deg = new Int32Array(n);
  const m = eu.length;
  for (let e = 0; e < m; e++) {
    deg[eu[e]]++;
    deg[ev[e]]++;
  }
  const start = new Int32Array(n + 1);
  for (let v = 0; v < n; v++) start[v + 1] = start[v] + deg[v];
  const pos = start.slice(0, n);
  const adj = new Int32Array(2 * m);
  const edgeOf = new Int32Array(2 * m);
  for (let e = 0; e < m; e++) {
    const a = eu[e];
    const b = ev[e];
    adj[pos[a]] = b;
    edgeOf[pos[a]++] = e;
    adj[pos[b]] = a;
    edgeOf[pos[b]++] = e;
  }
  return { start, adj, edgeOf, deg };
}

/**
 * Synchronous r-neighbour bootstrap percolation.
 *
 * `initial[v]` is 1 for sites active at time 0.  A site becomes active at
 * round t+1 if at least `r` of its neighbours were active at round t.  The
 * queue implementation reproduces the synchronous closure exactly: a site
 * that reaches the threshold while processing round t is scheduled for t+1,
 * never for t.  Returns the least fixed point, which is unique because the
 * update rule is monotone.
 */
export function bootstrapActivation(n, neighbours, initial, r) {
  if (!Number.isInteger(r) || r < 1) throw new Error('bootstrap threshold r must be a positive integer');
  const { start, adj, deg } = neighbours;
  const active = new Uint8Array(n);
  const time = new Int32Array(n).fill(-1);
  const count = new Int32Array(n);
  let pending = [];
  let activeCount = 0;
  for (let v = 0; v < n; v++) {
    if (initial[v]) {
      active[v] = 1;
      time[v] = 0;
      activeCount++;
    }
  }
  for (let v = 0; v < n; v++) {
    if (!active[v]) continue;
    for (let k = start[v]; k < start[v + 1]; k++) {
      const u = adj[k];
      if (!active[u]) count[u]++;
    }
  }
  for (let v = 0; v < n; v++) {
    if (!active[v] && count[v] >= r) pending.push(v);
  }
  const rounds = [];
  let t = 0;
  while (pending.length) {
    t++;
    const next = [];
    let newly = 0;
    for (const v of pending) {
      if (active[v]) continue;
      active[v] = 1;
      time[v] = t;
      activeCount++;
      newly++;
    }
    for (const v of pending) {
      if (time[v] !== t) continue;
      for (let k = start[v]; k < start[v + 1]; k++) {
        const u = adj[k];
        if (active[u]) continue;
        count[u]++;
        if (count[u] === r) next.push(u);
      }
    }
    rounds.push({ round: t, newly, cumulative: activeCount });
    pending = next;
    if (t > n) throw new Error('bootstrap did not converge; threshold exceeds maximum degree?');
  }
  return {
    active,
    time,
    rounds,
    activeCount,
    fraction: activeCount / n,
    converged: true,
    maxDegree: maxOf(deg),
  };
}

/** Convenience wrapper: bootstrap on a lattice, with occupied sites as seeds. */
export function bootstrapLattice(lattice, occupied, r) {
  const neighbours = neighboursFromEdges(lattice.n, lattice.eu, lattice.ev);
  return bootstrapActivation(lattice.n, neighbours, occupied, r);
}

/**
 * Achlioptas process on a fixed edge list.
 *
 * At each step two candidate edges are taken from `candidateOrder` (a
 * permutation of 0..m-1); the product rule adds the candidate with the
 * smaller product of the two endpoint component sizes, the sum rule the
 * smaller sum.  The other candidate is discarded.  This is the standard
 * two-choice process; with a uniform candidate order it is a reproducible
 * version of the model studied by Achlioptas, D'Souza and Spencer (2009).
 *
 * Returns the trajectory indexed by the number of candidates consumed, plus
 * the largest one-step jump in the giant-component fraction.  The jump is a
 * finite-size observable: the thermodynamic limit of the product rule is
 * continuous (da Costa et al. 2010; Riordan and Warnke 2012).
 */
export function explosiveSweep(n, eu, ev, candidateOrder, { rule = 'product' } = {}) {
  if (rule !== 'product' && rule !== 'sum') throw new Error('rule must be product or sum');
  const m = eu.length;
  const dsu = new Dsu(n);
  let sum2 = n;
  const steps = [];
  let maxJump = 0;
  let jumpAt = 0;
  let prevS = 1 / n;
  const totalCandidates = candidateOrder.length;
  for (let k = 0; k + 1 < totalCandidates; k += 2) {
    const e1 = candidateOrder[k];
    const e2 = candidateOrder[k + 1];
    const a1 = dsu.find(eu[e1]);
    const b1 = dsu.find(ev[e1]);
    const a2 = dsu.find(eu[e2]);
    const b2 = dsu.find(ev[e2]);
    const s1 = dsu.size[a1] * dsu.size[b1];
    const s2 = dsu.size[a2] * dsu.size[b2];
    const pick = rule === 'product' ? (s1 <= s2 ? e1 : e2) : (dsu.size[a1] + dsu.size[b1] <= dsu.size[a2] + dsu.size[b2] ? e1 : e2);
    const ra = dsu.find(eu[pick]);
    const rb = dsu.find(ev[pick]);
    const before = dsu.maxSize;
    if (ra !== rb) {
      const sa = dsu.size[ra];
      const sb = dsu.size[rb];
      dsu.union(ra, rb);
      sum2 += 2 * sa * sb;
    }
    const smax = dsu.maxSize / n;
    if (smax - prevS > maxJump) {
      maxJump = smax - prevS;
      jumpAt = (k + 2) / 2;
    }
    prevS = smax;
    steps.push({
      candidates: k + 2,
      added: (k + 2) / 2,
      edges: (k + 2) / 2,
      smax,
      maxSize: dsu.maxSize,
      clusters: dsu.count,
      chi2: sum2 / n,
      merged: dsu.maxSize > before,
    });
  }
  return { steps, maxJump, jumpAt, rule, n, m, candidatesUsed: Math.floor(totalCandidates / 2) * 2 };
}

/**
 * Achlioptas process on the complete graph, the setting of the 2009 paper.
 *
 * Each step samples two candidate pairs uniformly (with replacement) and adds
 * the one preferred by the product or sum rule.  This makes the whole
 * percolation curve accessible: the process can add edges up to and beyond
 * the threshold, unlike the fixed-edge-list version which discards half of
 * its candidates.  Duplicate pairs are counted as additions but do not merge
 * components.
 */
export function explosiveRandomGraph(n, { rule = 'product', steps = null, seed = 1, recordEvery = 1 } = {}) {
  if (rule !== 'product' && rule !== 'sum') throw new Error('rule must be product or sum');
  const rng = new Rng(seed);
  const dsu = new Dsu(n);
  let sum2 = n;
  const total = steps || 4 * n;
  const points = [];
  let maxJump = 0;
  let jumpAt = 0;
  let prevS = 1 / n;
  let added = 0;
  for (let s = 0; s < total; s++) {
    let a1 = rng.int(n);
    let b1 = rng.int(n - 1);
    if (b1 >= a1) b1++;
    let a2 = rng.int(n);
    let b2 = rng.int(n - 1);
    if (b2 >= a2) b2++;
    const ra1 = dsu.find(a1);
    const rb1 = dsu.find(b1);
    const ra2 = dsu.find(a2);
    const rb2 = dsu.find(b2);
    const s1 = dsu.size[ra1] * dsu.size[rb1];
    const s2 = dsu.size[ra2] * dsu.size[rb2];
    const pickFirst = rule === 'product'
      ? s1 <= s2
      : dsu.size[ra1] + dsu.size[rb1] <= dsu.size[ra2] + dsu.size[rb2];
    const a = pickFirst ? a1 : a2;
    const b = pickFirst ? b1 : b2;
    const ra = dsu.find(a);
    const rb = dsu.find(b);
    if (ra !== rb) {
      const sa = dsu.size[ra];
      const sb = dsu.size[rb];
      dsu.union(ra, rb);
      sum2 += 2 * sa * sb;
      added++;
    }
    const smax = dsu.maxSize / n;
    if (smax - prevS > maxJump) {
      maxJump = smax - prevS;
      jumpAt = s + 1;
    }
    prevS = smax;
    if (s % recordEvery === 0 || s === total - 1) {
      points.push({
        step: s + 1,
        added,
        q: (s + 1) / n,
        smax,
        maxSize: dsu.maxSize,
        clusters: dsu.count,
        chi2: sum2 / n,
      });
    }
  }
  return { points, maxJump, jumpAt, rule, n, steps: total, added };
}

/** Ordinary random-graph process (Erdős–Rényi), the baseline for the zoo. */
export function randomGraphSweep(n, { seed = 1, steps = null, recordEvery = 1 } = {}) {
  const rng = new Rng(seed);
  const dsu = new Dsu(n);
  let sum2 = n;
  const total = steps || 4 * n;
  const points = [];
  let added = 0;
  for (let s = 0; s < total; s++) {
    const a = rng.int(n);
    let b = rng.int(n - 1);
    if (b >= a) b++;
    const ra = dsu.find(a);
    const rb = dsu.find(b);
    if (ra !== rb) {
      const sa = dsu.size[ra];
      const sb = dsu.size[rb];
      dsu.union(ra, rb);
      sum2 += 2 * sa * sb;
      added++;
    }
    if (s % recordEvery === 0 || s === total - 1) {
      points.push({ step: s + 1, added, q: (s + 1) / n, smax: dsu.maxSize / n, maxSize: dsu.maxSize, clusters: dsu.count, chi2: sum2 / n });
    }
  }
  return { points, n, steps: total, added };
}

/** Random-stream wrapper for the explosive process. */
export function explosivePercolation(n, eu, ev, { rule = 'product', seed = 1 } = {}) {
  const rng = new Rng(seed);
  const order = Array.from({ length: eu.length }, (_, i) => i);
  rng.shuffle(order);
  return explosiveSweep(n, eu, ev, order, { rule });
}

/** Binary min-heap of (key, edge) pairs. */
class MinHeap {
  constructor() {
    this.keys = [];
    this.edges = [];
  }
  get size() {
    return this.keys.length;
  }
  push(key, edge) {
    const k = this.keys;
    const e = this.edges;
    let i = k.length;
    k.push(key);
    e.push(edge);
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (k[p] <= k[i]) break;
      [k[p], k[i]] = [k[i], k[p]];
      [e[p], e[i]] = [e[i], e[p]];
      i = p;
    }
  }
  pop() {
    const k = this.keys;
    const e = this.edges;
    const top = { key: k[0], edge: e[0] };
    const lastK = k.pop();
    const lastE = e.pop();
    if (k.length) {
      k[0] = lastK;
      e[0] = lastE;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let smallest = i;
        if (l < k.length && k[l] < k[smallest]) smallest = l;
        if (r < k.length && k[r] < k[smallest]) smallest = r;
        if (smallest === i) break;
        [k[smallest], k[i]] = [k[i], k[smallest]];
        [e[smallest], e[i]] = [e[i], e[smallest]];
        i = smallest;
      }
    }
    return top;
  }
}

/**
 * Invasion percolation (ordinary, without trapping correction).
 *
 * Every edge carries an i.i.d. threshold.  Starting from `seed`, repeatedly
 * accept the lowest-threshold boundary edge that leads to an unvisited site.
 * This is Prim's algorithm on the random edge weights, so the accepted edge
 * thresholds are nondecreasing and the accepted set is a spanning tree of
 * the invaded cluster.  Loops (edges to visited sites) are discarded.
 *
 * `trapping: true` additionally skips an edge when the other endpoint is in a
 * bounded region already enclosed by invaded sites; the simple implementation
 * here only reports the number of discarded loop edges, and the laboratory
 * labels the option as loop rejection rather than full trapping.
 */
export function invasionCluster(n, eu, ev, threshold, seed = 0, { trapping = false } = {}) {
  const m = eu.length;
  const neighbours = neighboursFromEdges(n, eu, ev);
  const { start, adj, edgeOf } = neighbours;
  const visited = new Uint8Array(n);
  const accepted = new Uint8Array(m);
  const order = [];
  const keys = [];
  const loopEdges = [];
  const loopSeen = new Uint8Array(m);
  const heap = new MinHeap();
  visited[seed] = 1;
  order.push(seed);
  for (let k = start[seed]; k < start[seed + 1]; k++) heap.push(threshold[edgeOf[k]], edgeOf[k]);
  let loops = 0;
  while (heap.size) {
    const { key, edge } = heap.pop();
    const a = eu[edge];
    const b = ev[edge];
    const u = visited[a] ? b : a;
    if (visited[u]) {
      if (!loopSeen[edge]) {
        loopSeen[edge] = 1;
        loops++;
        loopEdges.push(edge);
      }
      continue;
    }
    visited[u] = 1;
    accepted[edge] = 1;
    order.push(u);
    keys.push(key);
    for (let k = start[u]; k < start[u + 1]; k++) {
      const e = edgeOf[k];
      if (!accepted[e]) heap.push(threshold[e], e);
    }
  }
  return {
    order,
    thresholds: keys,
    accepted,
    visited,
    size: order.length,
    loops,
    loopEdges,
    trapping,
    lastThreshold: keys.length ? keys[keys.length - 1] : 0,
  };
}

/** Random-stream wrapper: i.i.d. uniform thresholds in edge order. */
export function invasionPercolation(n, eu, ev, { seed = 1, rngSeed = 1, trapping = false } = {}) {
  const rng = new Rng(rngSeed);
  const threshold = new Float64Array(eu.length);
  for (let e = 0; e < eu.length; e++) threshold[e] = rng.random();
  return { ...invasionCluster(n, eu, ev, threshold, seed, { trapping }), threshold };
}

/**
 * Leath growth: sample the cluster of `seed` in bond percolation at p.
 *
 * Each touched edge is tested exactly once, and an open edge to an unvisited
 * site is explored.  Conditional on the seed being occupied, the output is a
 * sample from the percolation cluster distribution; no other cluster is
 * inspected.  The cost is proportional to the touched boundary, not to the
 * volume of the box.
 */
export function leathCluster(lattice, seed, p, rng, { maxSize = Infinity } = {}) {
  const { n, eu, ev } = lattice;
  const neighbours = neighboursFromEdges(n, eu, ev);
  const { start, adj, edgeOf } = neighbours;
  const visited = new Uint8Array(n);
  const tested = new Uint8Array(lattice.m);
  const queue = [seed];
  visited[seed] = 1;
  let head = 0;
  let openEdges = 0;
  let perimeter = 0;
  while (head < queue.length && queue.length <= maxSize) {
    const v = queue[head++];
    for (let k = start[v]; k < start[v + 1]; k++) {
      const e = edgeOf[k];
      if (tested[e]) continue;
      tested[e] = 1;
      if (rng.random() < p) {
        openEdges++;
        const u = adj[k];
        if (!visited[u]) {
          visited[u] = 1;
          queue.push(u);
        }
      } else {
        perimeter++;
      }
    }
  }
  return { sites: queue, size: queue.length, openEdges, perimeter, truncated: queue.length > maxSize };
}

export default { bootstrapActivation, bootstrapLattice, explosiveSweep, explosivePercolation, invasionCluster, invasionPercolation, leathCluster, neighboursFromEdges };
