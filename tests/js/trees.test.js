import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  Rng,
  buildLattice,
  bethePercolation,
  betheThreshold,
  poissonPmf,
  configurationGiantComponent,
  sirFinalSize,
  labelClusters,
} from '../../lib/js/index.js';

const golden = JSON.parse(readFileSync(new URL('../../data/golden/algorithms-v3.json', import.meta.url)));
const expected = Object.fromEntries(golden.probes.map((p) => [p.id, p.value]));

test('Bethe lattice: golden values and exact threshold', () => {
  const r = bethePercolation(3, 0.6);
  const want = expected.bethe_z3_p06;
  assert.ok(Math.abs(r.theta - want.theta) < 1e-10);
  assert.ok(Math.abs(r.u - want.u) < 1e-10);
  assert.equal(r.pc, 0.5);
  assert.equal(r.chi, Infinity);

  const r4 = bethePercolation(4, 0.4);
  assert.ok(Math.abs(r4.theta - expected.bethe_z4_p04.theta) < 1e-10);
  assert.ok(Math.abs(r4.u - expected.bethe_z4_p04.u) < 1e-10);

  for (const z of [2, 3, 4, 10]) assert.equal(betheThreshold(z), 1 / (z - 1));
});

test('Bethe lattice: subcritical mean size and critical point', () => {
  const sub = bethePercolation(3, 0.4);
  assert.equal(sub.theta, 0);
  assert.ok(Math.abs(sub.chi - 7) < 1e-12);
  assert.equal(sub.supercritical, false);

  const crit = bethePercolation(3, 0.5);
  assert.equal(crit.theta, 0);
  assert.equal(crit.u, 1);
  assert.equal(crit.chi, Infinity);
});

test('Bethe chain at p = 1 is fully open', () => {
  const r = bethePercolation(2, 1);
  assert.equal(r.theta, 1);
  assert.equal(r.u, 0);
  assert.equal(r.supercritical, true);
  const below = bethePercolation(2, 0.999);
  assert.equal(below.theta, 0);
  assert.ok(Math.abs(below.chi - (1 + (2 * 0.999) / (1 - 0.999))) < 1e-10);
});

test('configuration model: Poisson giant component golden', () => {
  const r = configurationGiantComponent(poissonPmf(2), 1);
  const want = expected.config_poisson_c2_T1;
  assert.ok(Math.abs(r.S - want.S) < 1e-10);
  assert.ok(Math.abs(r.u - want.u) < 1e-10);
  assert.ok(Math.abs(r.kappa - want.kappa) < 1e-12);
  assert.ok(Math.abs(r.tc - want.tc) < 1e-12);
  assert.ok(Math.abs(r.r0 - want.r0) < 1e-12);
});

test('configuration model: dilution below threshold removes the giant component', () => {
  const r = configurationGiantComponent(poissonPmf(2), 0.4);
  assert.equal(r.S, 0);
});

test('SIR final size equals the percolation giant component', () => {
  const pmf = poissonPmf(3);
  for (const T of [0.2, 0.4, 0.7, 1]) {
    const g = configurationGiantComponent(pmf, T);
    const s = sirFinalSize(pmf, T);
    assert.equal(s.finalSize, g.S);
    assert.equal(s.r0, g.r0);
    if (s.r0 > 1) assert.ok(Math.abs(s.herdImmunity - (1 - 1 / s.r0)) < 1e-12);
  }
});

test('Poisson pmf is normalised', () => {
  const pmf = poissonPmf(4);
  assert.ok(Math.abs(pmf.reduce((a, b) => a + b, 0) - 1) < 1e-12);
  let mean = 0;
  pmf.forEach((p, k) => { mean += k * p; });
  assert.ok(Math.abs(mean - 4) < 1e-6);
});

test('Hoshen–Kopelman labels agree with cluster statistics', () => {
  const lat = buildLattice('square', 8);
  const rng = new Rng(7);
  const open = new Uint8Array(lat.m);
  for (let e = 0; e < lat.m; e++) open[e] = rng.random() < 0.5 ? 1 : 0;
  const lab = labelClusters(lat.n, lat.eu, lat.ev, open);
  assert.equal(lab.count, new Set(lab.labels).size);
  assert.equal(lab.maxSize, Math.max(...lab.sizes));
  assert.equal(Array.from(lab.sizes).reduce((a, b) => a + b, 0), lat.n);
});

test('Hoshen–Kopelman site mode skips inactive vertices', () => {
  const lat = buildLattice('square', 4);
  const active = new Uint8Array(lat.n);
  for (let v = 0; v < lat.n; v++) active[v] = v % 3 ? 1 : 0;
  const lab = labelClusters(lat.n, lat.eu, lat.ev, null, active);
  assert.equal(Array.from(lab.sizes).reduce((a, b) => a + b, 0), active.reduce((a, b) => a + b, 0));
  for (let v = 0; v < lat.n; v++) if (!active[v]) assert.equal(lab.labels[v], -1);
});

test('Hoshen–Kopelman golden labels', () => {
  const lat = buildLattice('square', 6);
  const rng = new Rng(42);
  const open = new Uint8Array(lat.m);
  for (let e = 0; e < lat.m; e++) open[e] = rng.random() < 0.5 ? 1 : 0;
  const lab = labelClusters(lat.n, lat.eu, lat.ev, open);
  const want = expected.labels_square6_p05_seed42;
  assert.equal(lab.count, want.count);
  assert.equal(lab.maxSize, want.maxSize);
  assert.deepEqual(Array.from(lab.labels), want.labels);
});
