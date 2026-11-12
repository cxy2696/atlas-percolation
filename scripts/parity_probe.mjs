/** JSON emitter for the JavaScript side of the cross-language parity check. */
import {
  Rng, buildLattice, Percolation, newmanZiff,
  poissonDegrees, configurationModel, components, allActive,
  interdependentER, cardyCrossing, directedCrossing,
} from '../lib/js/index.js';

function crossing(lat, mode, p, seed, n) {
  const model = new Percolation(lat, { mode });
  const rng = new Rng(seed);
  let hits = 0;
  for (let i = 0; i < n; i++) hits += model.sample(p, rng).crossesLR() ? 1 : 0;
  return hits;
}

const rng9 = new Rng(9);
const deg9 = poissonDegrees(2000, 3.0, rng9);
const nz = newmanZiff(buildLattice('square', 16), new Rng(5), { checkpoints: 64 });
const len = nz.smax.length;

function directedCount(mode, p, seed, n) {
  const lat = buildLattice('square', 32);
  const rng = new Rng(seed);
  let hits = 0;
  for (let i = 0; i < n; i++) hits += directedCrossing(lat, p, rng, { mode }).cross ? 1 : 0;
  return hits;
}

const out = {
  'square_bond_cross_500_seed1234': crossing(buildLattice('square', 32), 'bond', 0.5, 1234, 500),
  'tri_site_cross_300_seed777': crossing(buildLattice('triangular', 16), 'site', 0.5, 777, 300),
  'nz_smax_q1_q2_end_seed5': [nz.smax[Math.floor(len / 4)], nz.smax[Math.floor(len / 2)], nz.smax[len - 1]],
  'configmodel_largest_seed9': components(configurationModel(deg9, rng9), allActive(2000)).largest,
  'interdependent_fraction_seed11': interdependentER(1500, 3.5, 0.75, new Rng(11)).fraction,
  'directed_bond_cross_500_seed4242': directedCount('bond', 0.65, 4242, 500),
  'directed_site_cross_500_seed4242': directedCount('site', 0.70, 4242, 500),
};
const cardy = [0.1, 1.0, 10.0].map((l) => ({ l, value: cardyCrossing(l) }));
process.stdout.write(JSON.stringify({ probes: out, cardy }));
