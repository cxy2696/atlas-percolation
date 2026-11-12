import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  Rng, buildLattice, degreeHistogram, Percolation, newmanZiff,
  poissonDegrees, powerLawDegrees, configurationModel, components, allActive,
  targetedRemoval, kcore, interdependentER, molloyReed, booleanModel,
  cardyCrossing, cardyCrossingVertical, cardyHypergeom, CARDY_CONSTANT,
  directedCrossing,
} from '../../lib/js/index.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const rngGolden = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/golden/rng-seed42.json'), 'utf8'));
const parity = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/golden/parity.json'), 'utf8'));

function probe(id) {
  return parity.probes.find((p) => p.id === id).value;
}

test('shared RNG reproduces the seed-42 golden vectors', () => {
  const rng = new Rng(rngGolden.seed);
  assert.deepEqual(Array.from({ length: 8 }, () => rng.random()), rngGolden.doubles);

  const ints = new Rng(rngGolden.seed);
  assert.deepEqual(Array.from({ length: 8 }, () => ints.int(10)), rngGolden.ints_mod_10);

  const normals = new Rng(rngGolden.seed);
  assert.deepEqual(Array.from({ length: 6 }, () => normals.normal()), rngGolden.normals);

  const stream = new Rng(rngGolden.seed);
  let sum = 0;
  let hash = 2166136261;
  for (let i = 0; i < 10000; i++) {
    const v = stream.u32();
    sum = (sum + v) >>> 0;
    hash = Math.imul(hash ^ v, 16777619) >>> 0;
  }
  assert.equal(sum, rngGolden.u32_sum_first_10000);
  assert.equal(hash, rngGolden.fnv1a_first_10000);
});

test('lattice edge counts and degrees', () => {
  const sq = buildLattice('square', 8);
  assert.equal(sq.n, 64);
  assert.equal(sq.m, 2 * 8 * 7);
  assert.equal(buildLattice('square', 8, { torus: true }).m, 128);

  const tri = buildLattice('triangular', 8);
  assert.equal(tri.m, 8 * 7 + 8 * 7 + 7 * 7);
  assert.equal(buildLattice('triangular', 8, { torus: true }).m, 3 * 64);

  const hc = buildLattice('honeycomb', 8, { torus: true });
  const hd = degreeHistogram(hc);
  assert.equal(hc.m, 96);
  assert.deepEqual([...new Set(hd.deg)], [3]);
  assert.throws(() => buildLattice('honeycomb', 7));
  assert.throws(() => buildLattice('hexagonal', 8));
});

test('parity probe: crossing count', () => {
  const model = new Percolation(buildLattice('square', 32), { mode: 'bond' });
  const rng = new Rng(1234);
  let hits = 0;
  for (let i = 0; i < 500; i++) hits += model.sample(0.5, rng).crossesLR() ? 1 : 0;
  assert.equal(hits, probe('square_bond_cross_500_seed1234'));
});

test('parity probe: triangular site crossing', () => {
  const model = new Percolation(buildLattice('triangular', 16), { mode: 'site' });
  const rng = new Rng(777);
  let hits = 0;
  for (let i = 0; i < 300; i++) hits += model.sample(0.5, rng).crossesLR() ? 1 : 0;
  assert.equal(hits, probe('tri_site_cross_300_seed777'));
});

test('parity probe: Newman–Ziff checkpoints', () => {
  const nz = newmanZiff(buildLattice('square', 16), new Rng(5), { checkpoints: 64 });
  const n = nz.smax.length;
  assert.deepEqual([nz.smax[Math.floor(n / 4)], nz.smax[Math.floor(n / 2)], nz.smax[n - 1]],
    probe('nz_smax_q1_q2_end_seed5'));
});

test('parity probe: configuration-model giant component', () => {
  const rng = new Rng(9);
  const deg = poissonDegrees(2000, 3.0, rng);
  const g = configurationModel(deg, rng);
  assert.equal(components(g, allActive(2000)).largest, probe('configmodel_largest_seed9'));
});

test('parity probe: coupled cascade intersects the two layers', () => {
  const result = interdependentER(1500, 3.5, 0.75, new Rng(11));
  assert.equal(result.fraction, probe('interdependent_fraction_seed11'));
  assert.ok(result.cascade.length >= 2);
  const last = result.cascade[result.cascade.length - 1];
  assert.ok(last.a <= 1 && last.b <= 1);
});

test('directed percolation parity probe', () => {
  const lat = buildLattice('square', 32);
  for (const [mode, p, want] of [['bond', 0.65, probe('directed_bond_cross_500_seed4242')],
                                 ['site', 0.70, probe('directed_site_cross_500_seed4242')]]) {
    const rng = new Rng(4242);
    let hits = 0;
    for (let i = 0; i < 500; i++) hits += directedCrossing(lat, p, rng, { mode }).cross ? 1 : 0;
    assert.equal(hits, want);
  }
});

test('percolation extremes and susceptibility', () => {
  const lat = buildLattice('square', 16);
  const model = new Percolation(lat, { mode: 'bond' });
  const rng = new Rng(3);
  let st = model.sample(1.0, rng).analyze();
  assert.equal(st.count, 1);
  assert.equal(st.maxSize, 256);
  assert.equal(st.chi2(), 256);
  assert.equal(model.crossesLR(), true);
  st = model.sample(0.0, rng).analyze();
  assert.equal(st.count, 256);
  assert.equal(st.maxSize, 1);
  assert.equal(st.maxFraction(), 1 / 256);
  assert.equal(model.crossesLR(), false);
});

test('square-lattice self-duality at p = 1/2', () => {
  const model = new Percolation(buildLattice('square', 64), { mode: 'bond' });
  const rng = new Rng(2024);
  let hits = 0;
  for (let i = 0; i < 300; i++) hits += model.sample(0.5, rng).crossesLR() ? 1 : 0;
  assert.ok(Math.abs(hits / 300 - 0.5) < 0.08, `crossing rate ${hits / 300}`);
});

test('k-core exact regression: triangle plus leaf', () => {
  // Triangle 0-1-2 plus leaf 3-2. Every triangle vertex has degree 2, so the
  // 3-core is empty. A fixed-size queue used to lose a vertex and leave one.
  const g = {
    n: 4,
    offset: Int32Array.from([0, 2, 4, 7, 8]),
    adj: Int32Array.from([1, 2, 0, 2, 1, 0, 3, 2]),
  };
  const core = kcore(g, allActive(4), 3);
  assert.equal(core.size, 0);
  assert.deepEqual(Array.from(core.alive), [0, 0, 0, 0]);
});

test('cluster sizes are sorted and maxSize agrees', () => {
  const model = new Percolation(buildLattice('square', 8), { mode: 'bond' });
  const st = model.sample(0.5, new Rng(1)).analyze();
  assert.equal(st.sizes[0], st.maxSize);
  assert.deepEqual(st.sizes, [...st.sizes].sort((a, b) => b - a));
});

test('reseed clears the cached normal spare', () => {
  const rng = new Rng(1);
  rng.normal();
  rng.seed(42);
  assert.equal(rng.normal(), new Rng(42).normal());
});

test('RNG int rejects n > 2^32 and poisson survives a large mean', () => {
  assert.throws(() => new Rng(1).int(4294967297));
  const deg = poissonDegrees(4000, 1000, new Rng(2));
  const mean = deg.reduce((a, b) => a + b, 0) / deg.length;
  assert.ok(Math.abs(mean - 1000) < 5, `poisson mean ${mean}`);
  assert.throws(() => powerLawDegrees(10, 1.0, 2, 1000, new Rng(3)));
});

test('network robustness and k-core', () => {
  const rng = new Rng(29);
  const deg = poissonDegrees(2000, 3.5, rng);
  const g = configurationModel(deg, rng);
  const core = kcore(g, allActive(2000), 3);
  assert.ok(core.fraction > 0 && core.fraction < 1);
  const removed = targetedRemoval(g, 0.1);
  assert.equal(removed.reduce((a, b) => a + b, 0), 1800);
  const mr = molloyReed(poissonDegrees(20000, 4.0, new Rng(17)));
  assert.ok(Math.abs(mr.pc - 0.25) < 0.02);
  assert.throws(() => configurationModel([1, 2], new Rng(1)));
});

test('continuum Boolean model', () => {
  const m = booleanModel(1200, 0.05, new Rng(37));
  assert.equal(m.sizes.reduce((a, b) => a + b, 0), 1200);
  assert.ok(m.largestFraction > 0.5);
  assert.ok(m.coverage > 0.99 && m.coverage < 1);
});

test('Cardy formula and symmetry', () => {
  assert.equal(cardyCrossing(1.0), 0.5);
  assert.ok(Math.abs(cardyCrossing(0.1) - 4.0394890895707114e-05) < 1e-13);
  assert.ok(Math.abs(cardyCrossing(10.0) - 0.9999596051091043) < 1e-12);
  assert.ok(Math.abs(cardyCrossingVertical(10.0) - (1 - cardyCrossing(10.0))) < 1e-12);
  assert.ok(Math.abs(CARDY_CONSTANT - 3 * Math.exp(
    lgamma(2 / 3) - 2 * lgamma(1 / 3)
  )) < 1e-12);
  assert.throws(() => cardyCrossing(0));
});

// Lanczos approximation is unnecessary here; use the exact known constant check
// via the hypergeometric identity instead of a gamma implementation.
function lgamma(x) {
  const g = 7;
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
  x -= 1;
  let a = c[0];
  const t = x + g + 0.5;
  for (let i = 1; i < g + 2; i++) a += c[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

test('power-law degrees are even-summed and bounded', () => {
  const deg = powerLawDegrees(500, 2.5, 2, 1000, new Rng(3));
  assert.equal(deg.length, 500);
  assert.ok(deg.every((d) => d >= 2));
  assert.equal(deg.reduce((a, b) => a + b, 0) % 2, 0);
});
