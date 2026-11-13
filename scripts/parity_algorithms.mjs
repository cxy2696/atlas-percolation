/** JSON emitter for the v3 algorithm parity check (Python <-> JavaScript). */
import {
  Rng, buildLattice, neighboursFromEdges, bootstrapActivation,
  invasionCluster, leathCluster, explosiveRandomGraph, explosivePercolation,
  labelClusters, bethePercolation, configurationGiantComponent, poissonPmf, sirFinalSize,
  newmanZiffSite, messagePassingPercolation,
} from '../lib/js/index.js';

function bootstrapProbe(kind, L, p, r, seed) {
  const lat = buildLattice(kind, L);
  const nb = neighboursFromEdges(lat.n, lat.eu, lat.ev);
  const rng = new Rng(seed);
  const init = new Uint8Array(lat.n);
  for (let v = 0; v < lat.n; v++) init[v] = rng.random() < p ? 1 : 0;
  const b = bootstrapActivation(lat.n, nb, init, r);
  return { activeCount: b.activeCount, rounds: b.rounds.length, fraction: b.fraction };
}

const lat3 = buildLattice('square', 3);
const nb3 = neighboursFromEdges(lat3.n, lat3.eu, lat3.ev);
const corners = new Uint8Array(9);
for (const v of [0, 2, 6, 8]) corners[v] = 1;
const b3 = bootstrapActivation(9, nb3, corners, 2);

const lat2 = buildLattice('square', 2);
const inv2 = invasionCluster(4, lat2.eu, lat2.ev, new Float64Array([0.1, 0.9, 0.2, 0.8]), 0);

const lat16 = buildLattice('square', 16);
const rng13 = new Rng(13);
const th16 = new Float64Array(lat16.m);
for (let e = 0; e < lat16.m; e++) th16[e] = rng13.random();
const inv16 = invasionCluster(lat16.n, lat16.eu, lat16.ev, th16, 5);

const lat6 = buildLattice('square', 6);
const leath = leathCluster(lat6, 3, 0.5, new Rng(3));

const ex = explosiveRandomGraph(500, { seed: 7, rule: 'product' });

const lat4 = buildLattice('square', 4);
const exl = explosivePercolation(16, lat4.eu, lat4.ev, { seed: 11, rule: 'sum' });

const b3tree = bethePercolation(3, 0.6);
const b4tree = bethePercolation(4, 0.4);
const pmf2 = poissonPmf(2);
const cfg = configurationGiantComponent(pmf2, 1);
const sir = sirFinalSize(pmf2, 1);
const lat6lab = buildLattice('square', 6);
const rng42 = new Rng(42);
const open42 = new Uint8Array(lat6lab.m);
for (let e = 0; e < lat6lab.m; e++) open42[e] = rng42.random() < 0.5 ? 1 : 0;
const lab = labelClusters(lat6lab.n, lat6lab.eu, lat6lab.ev, open42);
const nzSite = newmanZiffSite(buildLattice('square', 8), new Rng(5), { checkpoints: 16 });
const k5u = [];
const k5v = [];
for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) { k5u.push(i); k5v.push(j); }
const mp = messagePassingPercolation(5, k5u, k5v, 0.4);
const mpPath = messagePassingPercolation(4, [0, 1, 2], [1, 2, 3], 0.5);

process.stdout.write(JSON.stringify({
  probes: {
    bootstrap_3x3_corners_r2: { activeCount: b3.activeCount, rounds: b3.rounds.length, time: Array.from(b3.time) },
    bootstrap_32x32_p055_r3_seed123: bootstrapProbe('square', 32, 0.55, 3, 123),
    invasion_2x2_thresholds: { order: inv2.order, thresholds: inv2.thresholds, loops: inv2.loops },
    invasion_16x16_seed5_rng13: { size: inv16.size, loops: inv16.loops, last: inv16.lastThreshold },
    leath_6x6_seed3_p05: { size: leath.size, openEdges: leath.openEdges, perimeter: leath.perimeter },
    explosive_graph_500_seed7: { final: ex.points[ex.points.length - 1].smax, maxJump: ex.maxJump, jumpAt: ex.jumpAt, added: ex.added },
    explosive_lattice_4x4_seed11_sum: { steps: exl.steps.length, smax: exl.steps[exl.steps.length - 1].smax, maxJump: exl.maxJump, jumpAt: exl.jumpAt },
    bethe_z3_p06: { theta: b3tree.theta, u: b3tree.u, pc: b3tree.pc, chiInfinite: b3tree.chi === Infinity },
    bethe_z4_p04: { theta: b4tree.theta, u: b4tree.u, pc: b4tree.pc, chiInfinite: b4tree.chi === Infinity },
    config_poisson_c2_T1: { S: cfg.S, u: cfg.u, kappa: cfg.kappa, tc: cfg.tc, r0: cfg.r0, meanDegree: cfg.meanDegree },
    sir_poisson_c2_T1: { finalSize: sir.finalSize, r0: sir.r0, herdImmunity: sir.herdImmunity },
    labels_square6_p05_seed42: { count: lab.count, maxSize: lab.maxSize, labels: Array.from(lab.labels) },
    nz_site_square8_seed5_cp16: { p: Array.from(nzSite.p), smax: Array.from(nzSite.smax), chi2: Array.from(nzSite.chi2), nclusters: Array.from(nzSite.nclusters), n: nzSite.n },
    message_k5_T04: { S: mp.S, outside: Array.from(mp.outside), converged: mp.converged },
    message_path4_T05: { S: mpPath.S, outside: Array.from(mpPath.outside), converged: mpPath.converged },
  },
}));
