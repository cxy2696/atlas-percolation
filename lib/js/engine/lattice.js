/**
 * Lattice generators.
 *
 * Square      : E, S                              (degree 4)
 * Triangular  : E, S, SW                          (degree 6)
 * Honeycomb   : brick-wall embedding, alternating
 *               horizontal rungs + vertical struts (degree 3)
 *
 * Only nearest-neighbour bonds are produced; each undirected edge appears
 * once.  With torus=true the edge that would leave the box is wrapped.
 */

function idx(L, i, j) {
  return ((i % L) + L) % L * L + (((j % L) + L) % L);
}

export const LATTICE_KINDS = ['square', 'triangular', 'honeycomb'];

export function buildLattice(kind, L, { torus = false } = {}) {
  if (!LATTICE_KINDS.includes(kind)) throw new Error(`unknown lattice: ${kind}`);
  if (!Number.isInteger(L) || L < 1) throw new Error('L must be a positive integer');
  if (kind === 'honeycomb' && L % 2 !== 0) {
    throw new Error('honeycomb needs even L');
  }
  if (kind === 'honeycomb' && L < 6) {
    // The brick-wall quotient has parallel edges and 4-cycles below L=6;
    // it is not the honeycomb lattice.
    throw new Error('honeycomb needs L >= 6');
  }
  const n = L * L;
  const eu = [];
  const ev = [];
  const etype = []; // 0 = E / rung, 1 = S, 2 = SW
  const push = (a, b, t) => {
    eu.push(a);
    ev.push(b);
    etype.push(t);
  };

  for (let i = 0; i < L; i++) {
    for (let j = 0; j < L; j++) {
      const v = i * L + j;
      if (kind === 'honeycomb') {
        // horizontal rung: row i even -> j even; row i odd -> j odd
        if ((i + j) % 2 === 0) {
          if (j + 1 < L || torus) push(v, idx(L, i, j + 1), 0);
        }
        // vertical strut, present at every site
        if (i + 1 < L || torus) push(v, idx(L, i + 1, j), 1);
        continue;
      }
      // E
      if (j + 1 < L || torus) push(v, idx(L, i, j + 1), 0);
      // S
      if (i + 1 < L || torus) push(v, idx(L, i + 1, j), 1);
      // SW (triangular only): to row i+1, column j-1.  With open boundaries
      // the edge is simply absent at column 0; it must not wrap.
      if (kind === 'triangular' && (i + 1 < L || torus) && (j - 1 >= 0 || torus)) {
        push(v, idx(L, i + 1, j - 1), 2);
      }
    }
  }

  return {
    kind,
    L,
    n,
    torus,
    m: eu.length,
    eu: Int32Array.from(eu),
    ev: Int32Array.from(ev),
    etype: Uint8Array.from(etype),
    /** Geometric position of site v in a unit box, for rendering. */
    position(v) {
      const i = Math.floor(v / L);
      const j = v % L;
      if (kind === 'honeycomb') {
        return { x: (j + 0.5 * (i % 2)) / L, y: i / L };
      }
      if (kind === 'triangular') {
        return { x: (j + 0.5 * i) / L, y: (i * 0.8660254037844386) / L };
      }
      return { x: j / L, y: i / L };
    },
  };
}

/** Degree histogram, for sanity checks and for the atlas tables. */
export function degreeHistogram(lat) {
  const deg = new Int32Array(lat.n);
  for (let e = 0; e < lat.m; e++) {
    deg[lat.eu[e]]++;
    deg[lat.ev[e]]++;
  }
  const hist = new Map();
  for (let v = 0; v < lat.n; v++) hist.set(deg[v], (hist.get(deg[v]) || 0) + 1);
  return { deg, hist: [...hist.entries()].sort((a, b) => a[0] - b[0]) };
}
