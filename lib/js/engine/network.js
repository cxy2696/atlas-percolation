/**
 * Network percolation: configuration model, giant component, k-core,
 * random/targeted removal, coupled (interdependent) networks.
 *
 * The configuration model below is a multigraph: stubs are paired uniformly
 * at random, self-loops and parallel edges are kept.  For giant-component
 * asymptotics that is the correct ensemble (Molloy–Reed 1995).
 */
import { Rng } from './rng.js';

export function poissonDegrees(N, mean, rng) {
  if (!Number.isInteger(N) || N < 0) throw new Error('N must be a non-negative integer');
  if (!Number.isFinite(mean) || mean < 0) throw new Error('mean must be non-negative and finite');
  const deg = new Int32Array(N);
  if (mean <= 700) {
    // Knuth counting; exact but it loses precision when exp(-mean) underflows.
    const limit = Math.exp(-mean);
    for (let i = 0; i < N; i++) {
      let k = 0;
      let p = 1;
      do {
        k++;
        p *= rng.random();
      } while (p > limit);
      deg[i] = k - 1;
    }
  } else {
    // Sum of exponential waiting times; stable for large means and consumes
    // the same number of uniforms as the Knuth loop in the other languages.
    for (let i = 0; i < N; i++) {
      let k = 0;
      let s = 0;
      do {
        k++;
        s -= Math.log(1 - rng.random());
      } while (s <= mean);
      deg[i] = k - 1;
    }
  }
  let sum = 0;
  for (let i = 0; i < N; i++) sum += deg[i];
  if (sum % 2 === 1) deg[0] += 1;
  return deg;
}

/**
 * Power-law degrees with a lower cutoff kmin and upper cutoff kmax.
 * Uses the continuous approximation k = floor(kmin * (1-u)^(-1/(gamma-1))),
 * which is exact in distribution for the Pareto tail.
 */
export function powerLawDegrees(N, gamma, kmin = 2, kmax = 10000, rng) {
  if (!(gamma > 1)) throw new Error('gamma must be greater than 1');
  if (!Number.isInteger(kmin) || kmin < 1) throw new Error('kmin must be a positive integer');
  if (!Number.isInteger(kmax) || kmax < kmin) throw new Error('kmax must be at least kmin');
  const deg = new Int32Array(N);
  const a = 1 / (gamma - 1);
  let sum = 0;
  for (let i = 0; i < N; i++) {
    const u = rng.random();
    let k = Math.floor(kmin * Math.pow(1 - u, -a));
    if (!Number.isFinite(k) || k > kmax) k = kmax;
    if (k < kmin) k = kmin;
    deg[i] = k;
    sum += k;
  }
  if (sum % 2 === 1) {
    // Keep the documented bound: bump a vertex that still has room.
    let bumped = false;
    for (let i = 0; i < deg.length; i++) {
      if (deg[i] < kmax) {
        deg[i] += 1;
        bumped = true;
        break;
      }
    }
    if (!bumped) deg[0] -= 1;
  }
  return deg;
}

/** Pair stubs uniformly at random and return a CSR adjacency. */
export function configurationModel(deg, rng) {
  const N = deg.length;
  let M = 0;
  for (let i = 0; i < N; i++) M += deg[i];
  if (M % 2 === 1) {
    // One stub is added to vertex 0: the effect on N -> infinity asymptotics
    // is O(1/N) and it keeps the API total.  Set fixParity=false to forbid.
    throw new Error('degree sum must be even');
  }
  const stubs = new Int32Array(M);
  let s = 0;
  for (let i = 0; i < N; i++) {
    for (let k = 0; k < deg[i]; k++) stubs[s++] = i;
  }
  rng.shuffle(stubs);
  const count = new Int32Array(N + 1);
  for (let k = 0; k < M; k += 2) {
    count[stubs[k] + 1]++;
    count[stubs[k + 1] + 1]++;
  }
  for (let i = 0; i < N; i++) count[i + 1] += count[i];
  const offset = count.slice();
  const adj = new Int32Array(M);
  for (let k = 0; k < M; k += 2) {
    const a = stubs[k];
    const b = stubs[k + 1];
    adj[offset[a]++] = b;
    adj[offset[b]++] = a;
  }
  return { n: N, m: M, offset: count, adj };
}

/** Connected components of the subgraph induced by `active`. */
export function components(graph, active) {
  const { n, offset, adj } = graph;
  const seen = new Uint8Array(n);
  const queue = new Int32Array(n);
  const sizes = [];
  let largest = 0;
  let activeCount = 0;
  for (let v = 0; v < n; v++) if (active[v]) activeCount++;
  for (let v = 0; v < n; v++) {
    if (!active[v] || seen[v]) continue;
    seen[v] = 1;
    let head = 0;
    let tail = 0;
    queue[tail++] = v;
    let size = 0;
    while (head < tail) {
      const u = queue[head++];
      size++;
      for (let e = offset[u]; e < offset[u + 1]; e++) {
        const w = adj[e];
        if (active[w] && !seen[w]) {
          seen[w] = 1;
          queue[tail++] = w;
        }
      }
    }
    sizes.push(size);
    if (size > largest) largest = size;
  }
  sizes.sort((a, b) => b - a);
  return {
    sizes,
    largest,
    activeCount,
    largestFraction: activeCount ? largest / activeCount : 0,
    largestGlobalFraction: n ? largest / n : 0,
  };
}

export function allActive(n) {
  if (!Number.isInteger(n) || n < 0) throw new Error('n must be a non-negative integer');
  const a = new Uint8Array(n);
  a.fill(1);
  return a;
}

/** Retain each vertex independently with probability p. */
export function dilute(active, p, rng) {
  const out = new Uint8Array(active.length);
  for (let i = 0; i < active.length; i++) {
    out[i] = active[i] && rng.random() < p ? 1 : 0;
  }
  return out;
}

/** Remove the `frac` highest-degree vertices (degree measured on the full graph). */
export function targetedRemoval(graph, frac) {
  if (!(frac >= 0 && frac <= 1)) throw new Error('frac must lie in [0,1]');
  const { n, offset } = graph;
  const order = new Int32Array(n);
  for (let i = 0; i < n; i++) order[i] = i;
  order.sort((a, b) => offset[b + 1] - offset[b] - (offset[a + 1] - offset[a]));
  const active = new Uint8Array(n);
  active.fill(1);
  const cut = Math.floor(frac * n);
  for (let i = 0; i < cut; i++) active[order[i]] = 0;
  return active;
}

/**
 * k-core of the subgraph induced by `active`, via bucket peeling.
 * Returns the set of surviving vertices and their count.
 */
export function kcore(graph, active, k) {
  if (!Number.isInteger(k) || k < 0) throw new Error('k must be a non-negative integer');
  const { n, offset, adj } = graph;
  const deg = new Int32Array(n);
  const alive = new Uint8Array(n);
  let rem = 0;
  for (let v = 0; v < n; v++) {
    if (!active[v]) continue;
    alive[v] = 1;
    rem++;
    let d = 0;
    for (let e = offset[v]; e < offset[v + 1]; e++) if (active[adj[e]]) d++;
    deg[v] = d;
  }
  // A vertex can be queued again after each of its neighbours is peeled, so
  // the queue must grow; a fixed Int32Array(n) silently drops writes once
  // tail exceeds n, which leaves a non-k-core behind.
  const queue = [];
  let head = 0;
  for (let v = 0; v < n; v++) if (alive[v] && deg[v] < k) queue.push(v);
  while (head < queue.length) {
    const v = queue[head++];
    if (!alive[v]) continue;
    alive[v] = 0;
    rem--;
    for (let e = offset[v]; e < offset[v + 1]; e++) {
      const w = adj[e];
      if (alive[w]) {
        deg[w]--;
        if (deg[w] < k) queue.push(w);
      }
    }
  }
  return { alive, size: rem, fraction: n ? rem / n : 0 };
}

/**
 * Fully interdependent pair of ER networks, one-to-one coupling.
 *
 * A vertex survives a round only if it is still retained, lies in the giant
 * component of layer A, *and* lies in the giant component of layer B.  For a
 * one-to-one coupling the two layers share vertex labels, so the update is
 * the intersection of the two giant components.  Pruning one layer without
 * intersecting with the other overestimates the mutual component and misses
 * the cascade; this was a bug in the first edition.
 *
 * Returns the mutual giant-component fraction and the cascade trace.
 */
export function interdependentER(N, meanDegree, p, rng) {
  const degA = poissonDegrees(N, meanDegree, rng);
  const degB = poissonDegrees(N, meanDegree, rng);
  const gA = configurationModel(degA, rng);
  const gB = configurationModel(degB, rng);
  let surviving = new Uint8Array(N);
  for (let i = 0; i < N; i++) surviving[i] = rng.random() < p ? 1 : 0;
  const trace = [];
  for (let it = 0; it < 1000; it++) {
    const ca = components(gA, surviving);
    const cb = components(gB, surviving);
    trace.push({
      iteration: it,
      a: ca.largestFraction,
      b: cb.largestFraction,
      aliveA: ca.activeCount,
      aliveB: cb.activeCount,
    });
    const giantA = new Uint8Array(N);
    const giantB = new Uint8Array(N);
    markGiant(gA, surviving, giantA);
    markGiant(gB, surviving, giantB);
    const next = new Uint8Array(N);
    let changed = false;
    for (let i = 0; i < N; i++) {
      next[i] = surviving[i] && giantA[i] && giantB[i] ? 1 : 0;
      if (next[i] !== surviving[i]) changed = true;
    }
    surviving = next;
    if (!changed) break;
  }
  let alive = 0;
  for (let i = 0; i < N; i++) alive += surviving[i];
  return {
    fraction: N ? alive / N : 0,
    cascade: trace,
    graphA: gA,
    graphB: gB,
    active: surviving,
  };
}

function markGiant(graph, active, out) {
  const { n, offset, adj } = graph;
  const seen = new Uint8Array(n);
  const queue = new Int32Array(n);
  let best = [];
  let bestSize = 0;
  for (let v = 0; v < n; v++) {
    if (!active[v] || seen[v]) continue;
    seen[v] = 1;
    let head = 0;
    let tail = 0;
    queue[tail++] = v;
    const members = [];
    while (head < tail) {
      const u = queue[head++];
      members.push(u);
      for (let e = offset[u]; e < offset[u + 1]; e++) {
        const w = adj[e];
        if (active[w] && !seen[w]) {
          seen[w] = 1;
          queue[tail++] = w;
        }
      }
    }
    if (members.length > bestSize) {
      bestSize = members.length;
      best = members;
    }
  }
  for (const v of best) out[v] = 1;
}

/** Exact Molloy–Reed threshold for a degree sequence. */
export function molloyReed(deg) {
  let s1 = 0;
  let s2 = 0;
  for (let i = 0; i < deg.length; i++) {
    s1 += deg[i];
    s2 += deg[i] * deg[i];
  }
  const k1 = s1 / deg.length;
  const k2 = s2 / deg.length;
  const kappa = k1 > 0 ? k2 / k1 : Infinity;
  const pc = k2 > k1 ? k1 / (k2 - k1) : Infinity;
  return { mean: k1, second: k2, kappa, pc, fc: 1 - pc };
}
