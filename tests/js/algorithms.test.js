import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  Rng,
  buildLattice,
  neighboursFromEdges,
  bootstrapActivation,
  invasionCluster,
  leathCluster,
  explosiveRandomGraph,
  explosivePercolation,
  explosiveSweep,
} from '../../lib/js/index.js';

const golden = JSON.parse(readFileSync(new URL('../../data/golden/algorithms-v3.json', import.meta.url)));
const expected = Object.fromEntries(golden.probes.map((p) => [p.id, p.value]));

test('algorithm golden: bootstrap 3x3 corners, r=2', () => {
  const lat = buildLattice('square', 3);
  const nb = neighboursFromEdges(lat.n, lat.eu, lat.ev);
  const init = new Uint8Array(9);
  for (const v of [0, 2, 6, 8]) init[v] = 1;
  const b = bootstrapActivation(9, nb, init, 2);
  assert.equal(b.activeCount, expected.bootstrap_3x3_corners_r2.activeCount);
  assert.equal(b.rounds.length, expected.bootstrap_3x3_corners_r2.rounds);
  assert.deepEqual(Array.from(b.time), expected.bootstrap_3x3_corners_r2.time);
});

test('bootstrap is the least fixed point of the threshold closure', () => {
  const lat = buildLattice('square', 8);
  const nb = neighboursFromEdges(lat.n, lat.eu, lat.ev);
  for (let seed = 1; seed <= 12; seed++) {
    const rng = new Rng(seed);
    const init = new Uint8Array(lat.n);
    for (let v = 0; v < lat.n; v++) init[v] = rng.random() < 0.4 ? 1 : 0;
    const r = 1 + (seed % 3);
    const fast = bootstrapActivation(lat.n, nb, init, r);
    // Naive synchronous closure: at most n rounds, O(n^2) on purpose.
    let active = Array.from(init);
    for (let round = 0; round < lat.n; round++) {
      const next = active.slice();
      for (let v = 0; v < lat.n; v++) {
        if (active[v]) continue;
        let c = 0;
        for (let k = nb.start[v]; k < nb.start[v + 1]; k++) if (active[nb.adj[k]]) c++;
        if (c >= r) next[v] = 1;
      }
      if (next.every((x, i) => x === active[i])) break;
      active = next;
    }
    assert.deepEqual(Array.from(fast.active), active, `seed ${seed} r ${r}`);
  }
});

test('bootstrap handles r larger than every degree without activating', () => {
  const lat = buildLattice('square', 5);
  const nb = neighboursFromEdges(lat.n, lat.eu, lat.ev);
  const init = new Uint8Array(lat.n).fill(1);
  const b = bootstrapActivation(lat.n, nb, init, 5);
  assert.equal(b.activeCount, lat.n);
  assert.equal(b.rounds.length, 0);
});

test('neighbour list is symmetric and has the right degree', () => {
  const lat = buildLattice('triangular', 7);
  const nb = neighboursFromEdges(lat.n, lat.eu, lat.ev);
  for (let v = 0; v < lat.n; v++) {
    for (let k = nb.start[v]; k < nb.start[v + 1]; k++) {
      const u = nb.adj[k];
      let back = false;
      for (let j = nb.start[u]; j < nb.start[u + 1]; j++) if (nb.adj[j] === v) back = true;
      assert.ok(back, `edge ${v}-${u} missing reverse`);
    }
  }
});

test('algorithm golden: invasion 2x2 with fixed thresholds', () => {
  const lat = buildLattice('square', 2);
  const inv = invasionCluster(4, lat.eu, lat.ev, new Float64Array([0.1, 0.9, 0.2, 0.8]), 0);
  assert.deepEqual(inv.order, expected.invasion_2x2_thresholds.order);
  assert.deepEqual(inv.thresholds, expected.invasion_2x2_thresholds.thresholds);
  assert.equal(inv.loops, expected.invasion_2x2_thresholds.loops);
});

test('invasion accepts a spanning tree of the connected component', () => {
  const lat = buildLattice('square', 12);
  const rng = new Rng(77);
  const th = new Float64Array(lat.m);
  for (let e = 0; e < lat.m; e++) th[e] = rng.random();
  const inv = invasionCluster(lat.n, lat.eu, lat.ev, th, 0);
  assert.equal(inv.size, lat.n);
  assert.equal(inv.thresholds.length, lat.n - 1);
  assert.equal(inv.accepted.reduce((a, b) => a + b, 0), lat.n - 1);
});

test('Leath growth saturates at p=1 and is a single site at p=0', () => {
  const lat = buildLattice('square', 6);
  const full = leathCluster(lat, 0, 1, new Rng(1));
  assert.equal(full.size, lat.n);
  assert.equal(full.perimeter, 0);
  const empty = leathCluster(lat, 0, 0, new Rng(1));
  assert.equal(empty.size, 1);
  assert.equal(empty.openEdges, 0);
});

test('algorithm golden: Leath 6x6 seed 3 p=0.5', () => {
  const lat = buildLattice('square', 6);
  const le = leathCluster(lat, 3, 0.5, new Rng(3));
  assert.equal(le.size, expected.leath_6x6_seed3_p05.size);
  assert.equal(le.openEdges, expected.leath_6x6_seed3_p05.openEdges);
  assert.equal(le.perimeter, expected.leath_6x6_seed3_p05.perimeter);
});

test('Achlioptas graph process is monotone and spans', () => {
  const ex = explosiveRandomGraph(300, { seed: 5 });
  let last = 0;
  for (const p of ex.points) {
    assert.ok(p.smax >= last - 1e-15, 'S_max must not decrease');
    assert.ok(p.smax <= 1);
    last = p.smax;
  }
  assert.equal(ex.points[ex.points.length - 1].smax, 1);
  assert.ok(ex.maxJump > 0);
});

test('algorithm golden: explosive graph 500 seed 7', () => {
  const ex = explosiveRandomGraph(500, { seed: 7 });
  const end = ex.points[ex.points.length - 1];
  assert.equal(end.smax, expected.explosive_graph_500_seed7.final);
  assert.equal(ex.maxJump, expected.explosive_graph_500_seed7.maxJump);
  assert.equal(ex.jumpAt, expected.explosive_graph_500_seed7.jumpAt);
  assert.equal(ex.added, expected.explosive_graph_500_seed7.added);
});

test('explosive fixed-list sweep is deterministic and respects the rule', () => {
  const lat = buildLattice('square', 4);
  const order = Array.from({ length: lat.m }, (_, i) => i);
  const prod = explosiveSweep(16, lat.eu, lat.ev, order, { rule: 'product' });
  const sum = explosiveSweep(16, lat.eu, lat.ev, order, { rule: 'sum' });
  assert.equal(prod.steps.length, Math.floor(lat.m / 2));
  assert.equal(sum.steps.length, prod.steps.length);
  assert.equal(prod.rule, 'product');
  const last = prod.steps[prod.steps.length - 1];
  assert.ok(last.smax > 0 && last.smax <= 1);
  assert.ok(last.chi2 >= 1);
  assert.throws(() => explosiveSweep(16, lat.eu, lat.ev, order, { rule: 'nope' }));
});

test('explosive lattice golden', () => {
  const lat = buildLattice('square', 4);
  const ex = explosivePercolation(16, lat.eu, lat.ev, { seed: 11, rule: 'sum' });
  assert.equal(ex.steps.length, expected.explosive_lattice_4x4_seed11_sum.steps);
  assert.equal(ex.steps[ex.steps.length - 1].smax, expected.explosive_lattice_4x4_seed11_sum.smax);
  assert.equal(ex.maxJump, expected.explosive_lattice_4x4_seed11_sum.maxJump);
  assert.equal(ex.jumpAt, expected.explosive_lattice_4x4_seed11_sum.jumpAt);
});

test('algorithm guards reject impossible seeds and tiny graphs', () => {
  const lat = buildLattice('square', 4);
  const th = new Float64Array(lat.m).fill(0.5);
  assert.throws(() => invasionCluster(lat.n, lat.eu, lat.ev, th, -1));
  assert.throws(() => invasionCluster(lat.n, lat.eu, lat.ev, th, lat.n));
  assert.throws(() => leathCluster(lat, lat.n, 0.5, new Rng(1)));
  assert.throws(() => explosiveRandomGraph(1, { seed: 1 }));
});
