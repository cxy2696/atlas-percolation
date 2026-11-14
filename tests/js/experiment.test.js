import test from 'node:test';
import assert from 'node:assert/strict';

import { wilsonInterval, normalInterval, runRecord, recordRows, csv } from '../../assets/js/lib/experiment.js';

test('Wilson interval contains the point estimate and is bounded', () => {
  const ci = wilsonInterval(200, 400);
  assert.equal(ci.p, 0.5);
  assert.ok(ci.lower < 0.5 && ci.upper > 0.5);
  assert.ok(ci.lower >= 0 && ci.upper <= 1);
  assert.ok(Math.abs(ci.half - 0.049) < 0.002);
});

test('Wilson interval handles zero hits without inventing a negative bound', () => {
  const ci = wilsonInterval(0, 100);
  assert.equal(ci.p, 0);
  assert.equal(ci.lower, 0);
  assert.ok(ci.upper > 0 && ci.upper < 0.05);
});

test('empty samples return NaNs rather than a fabricated interval', () => {
  const ci = wilsonInterval(0, 0);
  assert.ok(Number.isNaN(ci.p));
  assert.ok(Number.isNaN(ci.lower));
});

test('normal interval agrees with Wilson for large n', () => {
  const w = wilsonInterval(500, 1000);
  const n = normalInterval(500, 1000);
  assert.ok(Math.abs(w.lower - n.lower) < 0.001);
  assert.ok(Math.abs(w.upper - n.upper) < 0.001);
});

test('run record is serialisable and keeps the provenance fields', () => {
  const rec = runRecord({
    lab: 'lattice',
    title: 'Lattice percolation',
    route: '#/en/labs/lattice?p=0.5',
    version: '4.4.0',
    commit: 'abc1234',
    seed: 1001,
    params: { p: 0.5, L: 64 },
    result: { crossing: 0.5 },
    sources: [{ label: 'Chapter 4', href: '#/en/atlas/04-duality' }],
  });
  assert.equal(rec.schema, 'atlas/experiment-run@1');
  assert.equal(rec.seed, 1001);
  assert.equal(rec.params.p, 0.5);
  assert.ok(rec.capturedAt.endsWith('Z'));
  const rows = recordRows(rec);
  assert.ok(rows.some(([k, v]) => k === 'param.p' && v === '0.5'));
  assert.ok(csv(rows).includes('param.L,64'));
});
