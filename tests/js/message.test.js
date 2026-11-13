import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { Rng, buildLattice, newmanZiffSite, messagePassingPercolation } from '../../lib/js/index.js';

const golden = JSON.parse(readFileSync(new URL('../../data/golden/algorithms-v3.json', import.meta.url)));
const expected = Object.fromEntries(golden.probes.map((p) => [p.id, p.value]));

test('message passing: K5 golden and convergence', () => {
  const eu = [];
  const ev = [];
  for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) { eu.push(i); ev.push(j); }
  const r = messagePassingPercolation(5, eu, ev, 0.4);
  const want = expected.message_k5_T04;
  assert.ok(Math.abs(r.S - want.S) < 1e-10);
  r.outside.forEach((x, i) => assert.ok(Math.abs(x - want.outside[i]) < 1e-10));
  assert.equal(r.converged, true);
});

test('message passing: a finite tree has no giant component', () => {
  const r = messagePassingPercolation(4, [0, 1, 2], [1, 2, 3], 0.5);
  assert.equal(r.S, 0);
  for (const x of r.outside) assert.ok(Math.abs(x - 1) < 1e-12);
});

test('message passing: T = 1 on a connected graph', () => {
  const r = messagePassingPercolation(3, [0, 1, 2], [1, 2, 0], 1);
  assert.equal(r.S, 1);
  for (const x of r.outside) assert.equal(x, 0);
});

test('site Newman–Ziff: golden square 8', () => {
  const lat = buildLattice('square', 8);
  const r = newmanZiffSite(lat, new Rng(5), { checkpoints: 16 });
  const want = expected.nz_site_square8_seed5_cp16;
  assert.deepEqual(Array.from(r.p), want.p);
  assert.deepEqual(Array.from(r.smax), want.smax);
  assert.deepEqual(Array.from(r.nclusters), want.nclusters);
  r.chi2.forEach((x, i) => assert.ok(Math.abs(x - want.chi2[i]) < 1e-12));
});

test('site Newman–Ziff: full occupancy at the last checkpoint', () => {
  const lat = buildLattice('square', 6);
  const r = newmanZiffSite(lat, new Rng(1), { checkpoints: 1 });
  assert.equal(r.p[r.p.length - 1], 1);
  assert.equal(r.smax[r.smax.length - 1], lat.n);
  assert.equal(r.nclusters[r.nclusters.length - 1], 1);
});
