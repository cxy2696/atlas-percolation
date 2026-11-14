import test from 'node:test';
import assert from 'node:assert/strict';
import { Rng, Percolation, buildLattice3D } from '../../lib/js/index.js';

test('3D cubic lattice has the right size, edge count and degree', () => {
  for (const L of [2, 4, 8]) {
    const lat = buildLattice3D(L);
    assert.equal(lat.n, L ** 3);
    assert.equal(lat.m, 3 * L * L * (L - 1));
    const deg = new Int32Array(lat.n);
    for (let e = 0; e < lat.m; e++) {
      deg[lat.eu[e]]++;
      deg[lat.ev[e]]++;
      assert.notEqual(lat.eu[e], lat.ev[e]);
    }
    for (let v = 0; v < lat.n; v++) {
      const x = Math.floor(v / (L * L));
      const y = Math.floor(v / L) % L;
      const z = v % L;
      const expected = (x > 0) + (x < L - 1) + (y > 0) + (y < L - 1) + (z > 0) + (z < L - 1);
      assert.equal(deg[v], expected, `L=${L} v=${v}`);
    }
  }
});

test('3D site percolation extremes and boundary test', () => {
  const lat = buildLattice3D(4);
  const model = new Percolation(lat, { mode: 'site' });
  const full = model.sample(1, new Rng(1)).analyze();
  assert.equal(full.maxSize, lat.n);
  assert.equal(full.count, 1);
  const empty = model.sample(0, new Rng(1)).analyze();
  assert.equal(empty.maxSize, 0);
  assert.equal(empty.count, 0);
});

test('3D positions are normalised inside the unit cube', () => {
  const lat = buildLattice3D(6);
  for (const v of [0, 1, lat.n - 1, Math.floor(lat.n / 2)]) {
    const p = lat.position(v);
    for (const key of ['x', 'y', 'z']) {
      assert.ok(p[key] >= 0 && p[key] <= 1, `${key}=${p[key]}`);
    }
  }
});
