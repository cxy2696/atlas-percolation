/**
 * Simple cubic lattice in three dimensions.
 *
 * Site numbering is x*L*L + y*L + z, with z the vertical axis.  The edge list
 * contains +x, +y and +z neighbours once, in that order; open boundaries.
 * The object exposes the same n/m/eu/ev contract as the two-dimensional
 * lattices, so the Bernoulli sampler and DSU work unchanged.
 */

const index = (L, x, y, z) => (x * L + y) * L + z;

export function buildLattice3D(L) {
  if (!Number.isInteger(L) || L < 2) throw new Error('L must be an integer >= 2');
  const n = L * L * L;
  const eu = [];
  const ev = [];
  const etype = [];
  const push = (a, b, t) => {
    eu.push(a);
    ev.push(b);
    etype.push(t);
  };
  for (let x = 0; x < L; x++) {
    for (let y = 0; y < L; y++) {
      for (let z = 0; z < L; z++) {
        const v = index(L, x, y, z);
        if (x + 1 < L) push(v, index(L, x + 1, y, z), 0);
        if (y + 1 < L) push(v, index(L, x, y + 1, z), 1);
        if (z + 1 < L) push(v, index(L, x, y, z + 1), 2);
      }
    }
  }
  return {
    kind: 'cubic3d',
    L,
    n,
    m: eu.length,
    eu: Int32Array.from(eu),
    ev: Int32Array.from(ev),
    etype: Uint8Array.from(etype),
    /** Normalised coordinates in the unit cube. */
    position(v) {
      const z = v % L;
      const y = Math.floor(v / L) % L;
      const x = Math.floor(v / (L * L));
      return { x: x / (L - 1), y: y / (L - 1), z: z / (L - 1) };
    },
  };
}

export const LATTICE3D_KINDS = ['cubic3d'];
