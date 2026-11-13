/**
 * Message passing for bond percolation on a fixed graph.
 *
 * msg[k] is the cavity message into vertex v from adj[k]:
 *
 *   msg[k] = prod_{j in N(v), j != adj[k]} (1 - T + T msg[j])
 *
 * On a tree the equations are exact.  On a graph with cycles they are the
 * Bethe approximation, controlled by the density of short loops.  The
 * iteration starts at zero to select the physical (smallest) fixed point;
 * starting at one would stay at the trivial no-giant-component solution.
 *
 * One sweep costs O(n + m) because each vertex uses a prefix/suffix product.
 */

function csr(n, eu, ev) {
  const m = eu.length;
  const start = new Int32Array(n + 1);
  for (let e = 0; e < m; e++) {
    start[eu[e] + 1]++;
    start[ev[e] + 1]++;
  }
  for (let v = 0; v < n; v++) start[v + 1] += start[v];
  const pos = start.slice(0, n);
  const adj = new Int32Array(2 * m);
  const edgeOf = new Int32Array(2 * m);
  const mate = new Int32Array(2 * m);
  for (let e = 0; e < m; e++) {
    const a = eu[e];
    const b = ev[e];
    const ha = pos[a]++;
    const hb = pos[b]++;
    adj[ha] = b;
    adj[hb] = a;
    edgeOf[ha] = e;
    edgeOf[hb] = e;
    mate[ha] = hb;
    mate[hb] = ha;
  }
  return { start, adj, edgeOf, mate };
}

/**
 * Run the cavity iteration and return the giant-component fraction.
 *
 * T is the bond retention probability. `outside[v]` is the probability that
 * v is not in the giant component; `S = 1 - mean(outside)` is the estimated
 * giant-component fraction.
 */
export function messagePassingPercolation(n, eu, ev, T, { maxIter = 10000, tol = 1e-12 } = {}) {
  if (!Number.isInteger(n) || n < 0) throw new Error('n must be a non-negative integer');
  if (!(T >= 0 && T <= 1)) throw new Error('T must lie in [0,1]');
  if (!Number.isInteger(maxIter) || maxIter < 1) throw new Error('maxIter must be positive');
  const { start, adj, edgeOf, mate } = csr(n, eu, ev);
  const m = eu.length;
  let msg = new Float64Array(2 * m);
  let next = new Float64Array(2 * m);
  let converged = false;
  let iterations = 0;
  let maxChange = 0;
  for (iterations = 1; iterations <= maxIter; iterations++) {
    maxChange = 0;
    for (let v = 0; v < n; v++) {
      const lo = start[v];
      const hi = start[v + 1];
      const d = hi - lo;
      if (d === 0) continue;
      const prefix = new Float64Array(d + 1);
      const suffix = new Float64Array(d + 1);
      prefix[0] = 1;
      suffix[d] = 1;
      for (let i = 0; i < d; i++) prefix[i + 1] = prefix[i] * (1 - T + T * msg[lo + i]);
      for (let i = d - 1; i >= 0; i--) suffix[i] = suffix[i + 1] * (1 - T + T * msg[lo + i]);
      for (let i = 0; i < d; i++) {
        const slot = mate[lo + i];
        const value = prefix[i] * suffix[i + 1];
        next[slot] = value;
        const diff = Math.abs(value - msg[slot]);
        if (diff > maxChange) maxChange = diff;
      }
    }
    const swap = msg;
    msg = next;
    next = swap;
    if (maxChange < tol) {
      converged = true;
      break;
    }
  }
  const outside = new Float64Array(n);
  for (let v = 0; v < n; v++) {
    let prod = 1;
    for (let k = start[v]; k < start[v + 1]; k++) prod *= 1 - T + T * msg[k];
    outside[v] = prod;
  }
  let sum = 0;
  for (let v = 0; v < n; v++) sum += outside[v];
  const S = n ? Math.max(0, Math.min(1, 1 - sum / n)) : 0;
  return { S, outside, iterations, converged, maxChange, edgeOf };
}
