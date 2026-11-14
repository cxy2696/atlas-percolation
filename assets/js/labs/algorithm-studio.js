import {
  Rng, buildLattice, Percolation, newmanZiff, leathCluster,
  bootstrapLattice, invasionPercolation, Dsu,
} from '../../../lib/js/index.js';
import { labHead, select, control, readout, panel, canvasBox, fmt, setText } from './ui.js';
import { drawPlot } from '../lib/plot.js';
import { palette, onTheme } from '../theme.js';

const LABELS = {
  en: {
    kicker: 'lab 16 · algorithm observatory',
    title: 'Algorithm studio',
    lead: 'Five ways to ask a percolation question, on the same lattice and the same seed. The step slider replays a Newman–Ziff edge order one union at a time; the benchmark compares measured cost and the scaling fit estimates the exponent.',
    lattice: 'Edge order replay',
    scaling: 'Cost vs L (log–log)',
    methods: 'Measured cost',
    method: 'Method',
    time: 'time / ms',
    ops: 'work',
    result: 'result',
    controls: 'Controls',
    size: 'Lattice size L',
    p: 'Occupancy p',
    reps: 'Repeats (min)',
    seed: 'Seed',
    step: 'Edge step k',
    bench: 'Benchmark',
    scale: 'Scaling sweep',
    methodSel: 'Scaling method',
    slope: 'fitted exponent',
    note: 'Times are wall-clock on this machine and include JavaScript overhead; they show orders, not absolute performance. Work is the number of edge or site operations the algorithm performs (an estimate for the sampling routines).',
    smax: 'S_max(k)',
    clusters: 'Clusters',
    pNow: 'p = k / m',
    newest: 'Newest edge',
    sample: 'one sample (DSU)',
    nz: 'whole curve (NZ)',
    leath: 'one cluster (Leath)',
    boot: 'bootstrap closure',
    inv: 'invasion tree',
  },
  zh: {
    kicker: '实验 13 · 算法观测台',
    title: '算法工坊',
    lead: '在同一个格子、同一个种子上，用五种方式问渗流问题。步进滑块把一条 Newman–Ziff 边序逐次合并重放；基准测试比较实测代价，标度拟合估计指数。',
    lattice: '边序重放',
    scaling: '代价随 L（双对数）',
    methods: '实测代价',
    method: '方法',
    time: '时间 / ms',
    ops: '工作量',
    result: '结果',
    controls: '控制',
    size: '格子尺寸 L',
    p: '占据概率 p',
    reps: '重复次数（取最小）',
    seed: '种子',
    step: '边步 k',
    bench: '基准测试',
    scale: '标度扫描',
    methodSel: '标度方法',
    slope: '拟合指数',
    note: '时间是本机的墙钟时间，包含 JavaScript 开销；它展示量级，不是绝对性能。工作量是算法执行的边或位点操作数（采样类为估计值）。',
    smax: 'S_max(k)',
    clusters: '团簇数',
    pNow: 'p = k / m',
    newest: '最新边',
    sample: '单样本（并查集）',
    nz: '整条曲线（NZ）',
    leath: '单团簇（Leath）',
    boot: '自举闭包',
    inv: '侵入树',
  },
  de: {
    kicker: 'Labor 13 · Algorithmen-Observatorium',
    title: 'Algorithmen-Studio',
    lead: 'Fünf Wege, dieselbe Perkolationsfrage auf demselben Gitter mit demselben Seed zu stellen. Der Schrittregler spielt eine Newman–Ziff-Kantenordnung Zug um Zug ab; der Benchmark vergleicht gemessene Kosten, die Skalenanpassung schätzt den Exponenten.',
    lattice: 'Kantenordnung abspielen',
    scaling: 'Kosten über L (log–log)',
    methods: 'Gemessene Kosten',
    method: 'Methode',
    time: 'Zeit / ms',
    ops: 'Arbeit',
    result: 'Ergebnis',
    controls: 'Regler',
    size: 'Gittergröße L',
    p: 'Besetzung p',
    reps: 'Wiederholungen (Minimum)',
    seed: 'Seed',
    step: 'Kantenschritt k',
    bench: 'Benchmark',
    scale: 'Skalensweep',
    methodSel: 'Skalenmethode',
    slope: 'gefiteter Exponent',
    note: 'Zeiten sind Wanduhrzeiten dieser Maschine inklusive JavaScript-Overhead; sie zeigen Größenordnungen, keine absolute Leistung. Arbeit ist die Zahl der Kanten- oder Platzoperationen.',
    smax: 'S_max(k)',
    clusters: 'Cluster',
    pNow: 'p = k / m',
    newest: 'Neueste Kante',
    sample: 'eine Stichprobe (DSU)',
    nz: 'ganze Kurve (NZ)',
    leath: 'ein Cluster (Leath)',
    boot: 'Bootstrap-Abschluss',
    inv: 'Invasion-Baum',
  },
};

const METHODS = ['sample', 'nz', 'leath', 'boot', 'inv'];

const HELP = {
  en: { L: 'The replay lattice. The benchmark uses the same L.', p: 'Used by the sampling, Leath and bootstrap routines.', reps: 'Each timing is the minimum over this many runs, to reduce JIT noise.', seed: 'One seed drives every panel, so the methods see the same disorder.' },
  zh: { L: '用于重放的格子；基准测试使用同一个 L。', p: '供采样、Leath 与自举例程使用。', reps: '每次计时取多次运行的最小值，以降低 JIT 噪声。', seed: '同一个种子驱动所有面板，使各方法面对同一种无序。' },
  de: { L: 'Das Replay-Gitter. Der Benchmark nutzt dasselbe L.', p: 'Wird von Sampling, Leath und Bootstrap genutzt.', reps: 'Jede Zeit ist das Minimum über so viele Läufe, um JIT-Rauschen zu senken.', seed: 'Ein Seed treibt alle Panels; alle Methoden sehen dieselbe Unordnung.' },
};

function fmtOps(x) {
  if (!isFinite(x)) return '—';
  if (x >= 1e6) return `${(x / 1e6).toFixed(2)}M`;
  if (x >= 1e3) return `${(x / 1e3).toFixed(1)}k`;
  return String(Math.round(x));
}

export function mount(root, ctx) {
  const { lang } = ctx;
  const L = LABELS[lang] || LABELS.en;
  const H = HELP[lang] || HELP.en;
  root.innerHTML =
    labHead({ kicker: L.kicker, title: L.title, lead: L.lead, lang, guide: 'algorithm-studio' }) +
    `<div class="grid-lab">
      <div>
        ${canvasBox('algo-canvas', [L.lattice, 'L', 'k / m', 'DSU'])}
        <div class="control" style="margin-top:10px">
          <label for="algo-k"><span>${L.step}</span><b id="algo-k-val">0</b></label>
          <input id="algo-k" type="range" min="0" max="100" step="1" value="0" />
        </div>
        <div class="grid-2" style="margin-top:12px">
          ${panel(L.scaling, '<div class="plot-host" id="algo-plot"></div>')}
          ${panel(L.methods, '<div id="algo-table"><p class="hud-note">Press Benchmark.</p></div>')}
        </div>
        <p class="explain">${L.note}</p>
      </div>
      <aside class="panel">
        <h3>${L.controls}</h3>
        ${select({ id: 'algo-size', label: L.size, value: '32', options: [
          { value: '12', label: '12 × 12' },
          { value: '16', label: '16 × 16' },
          { value: '24', label: '24 × 24' },
          { value: '32', label: '32 × 32' },
        ], help: H.L })}
        ${control({ id: 'algo-p', label: L.p, min: 0.2, max: 0.8, step: 0.005, value: 0.5, help: H.p })}
        ${control({ id: 'algo-reps', label: L.reps, min: 1, max: 9, step: 1, value: 3, help: H.reps })}
        ${control({ id: 'algo-seed', label: L.seed, min: 1, max: 9999, step: 1, value: 21, help: H.seed })}
        <div class="btn-row">
          <button class="btn primary" id="algo-bench">${L.bench}</button>
          <button class="btn" id="algo-scale">${L.scale}</button>
        </div>
        ${readout('algo-smax', L.smax)}
        ${readout('algo-clusters', L.clusters)}
        ${readout('algo-pnow', L.pNow)}
        ${readout('algo-newest', L.newest)}
        ${readout('algo-slope', L.slope)}
      </aside>
    </div>`;

  const canvas = root.querySelector('#algo-canvas');
  const state = { L: 32, p: 0.5, reps: 3, seed: 21, k: 0, order: null, lat: null, scaling: [] };
  const startTime = () => performance.now();

  function setup() {
    state.lat = buildLattice('square', state.L);
    const rng = new Rng(state.seed);
    state.order = new Int32Array(state.lat.m);
    for (let e = 0; e < state.lat.m; e++) state.order[e] = e;
    rng.shuffle(state.order);
    const input = root.querySelector('#algo-k');
    input.max = String(state.lat.m);
    if (state.k > state.lat.m) state.k = state.lat.m;
    input.value = String(state.k);
    root.querySelector('#algo-k-val').textContent = `${state.k} / ${state.lat.m}`;
    draw();
  }

  function replay() {
    const lat = state.lat;
    const dsu = new Dsu(lat.n);
    const k = state.k;
    for (let i = 0; i < k; i++) {
      const e = state.order[i];
      dsu.union(lat.eu[e], lat.ev[e]);
    }
    return { dsu, k };
  }

  function draw() {
    if (!state.lat) return;
    const C = palette();
    const { dsu, k } = replay();
    const wrap = canvas.parentElement;
    const W = Math.max(280, wrap.clientWidth - 2);
    const H = Math.min(520, Math.round(W * 0.86));
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    const g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = C.bg;
    g.fillRect(0, 0, W, H);
    const n = state.L;
    const pad = 18;
    const cell = Math.min((W - 2 * pad) / n, (H - 2 * pad) / n);
    const ox = (W - cell * n) / 2;
    const oy = (H - cell * n) / 2;
    const sizes = new Map();
    for (let v = 0; v < n * n; v++) {
      const r = dsu.find(v);
      sizes.set(r, (sizes.get(r) || 0) + 1);
    }
    const maxS = Math.max(1, ...sizes.values());
    for (let v = 0; v < n * n; v++) {
      const r = dsu.find(v);
      const s = sizes.get(r) || 1;
      const i = Math.floor(v / n);
      const j = v % n;
      if (s === 1) g.fillStyle = C.closed;
      else if (s === maxS) g.fillStyle = C.cyan;
      else if (s > maxS * 0.5) g.fillStyle = C.amber;
      else g.fillStyle = C.cyanDim;
      g.fillRect(ox + j * cell + 1, oy + i * cell + 1, Math.max(1, cell - 2), Math.max(1, cell - 2));
    }
    // open edges
    g.strokeStyle = C.ink;
    g.globalAlpha = 0.35;
    g.lineWidth = Math.max(1, cell * 0.08);
    for (let i = 0; i < k; i++) {
      const e = state.order[i];
      const a = state.lat.eu[e];
      const b = state.lat.ev[e];
      const ar = Math.floor(a / n), ac = a % n;
      const br = Math.floor(b / n), bc = b % n;
      g.beginPath();
      g.moveTo(ox + (ac + 0.5) * cell, oy + (ar + 0.5) * cell);
      g.lineTo(ox + (bc + 0.5) * cell, oy + (br + 0.5) * cell);
      g.stroke();
    }
    g.globalAlpha = 1;
    if (k > 0) {
      const e = state.order[k - 1];
      const a = state.lat.eu[e];
      const b = state.lat.ev[e];
      const ar = Math.floor(a / n), ac = a % n;
      const br = Math.floor(b / n), bc = b % n;
      g.strokeStyle = C.amber;
      g.lineWidth = 3;
      g.beginPath();
      g.moveTo(ox + (ac + 0.5) * cell, oy + (ar + 0.5) * cell);
      g.lineTo(ox + (bc + 0.5) * cell, oy + (br + 0.5) * cell);
      g.stroke();
    }
    const smax = Math.max(...sizes.values());
    setText('algo-smax', `${smax}  (${fmt(smax / (n * n), 3)})`);
    setText('algo-clusters', String(dsu.count));
    setText('algo-pnow', fmt(k / state.lat.m, 3));
    setText('algo-newest', k > 0 ? `e${state.order[k - 1]}` : '—');
    root.querySelector('#algo-k-val').textContent = `${k} / ${state.lat.m}`;
  }

  function timeIt(fn) {
    let best = Infinity;
    let out = null;
    for (let r = 0; r < state.reps; r++) {
      const t0 = startTime();
      out = fn(r);
      const dt = startTime() - t0;
      if (dt < best) best = dt;
    }
    return { ms: best, out };
  }

  function benchmark() {
    const lat = state.lat;
    const seed = state.seed;
    const p = state.p;
    const model = new Percolation(lat, { mode: 'bond' });
    const sample = timeIt((r) => {
      const rng = new Rng(seed + 1000 + r);
      return model.sample(p, rng).analyze().maxSize;
    });
    const nz = timeIt((r) => {
      const res = newmanZiff(lat, new Rng(seed + 2000 + r), { checkpoints: 80 });
      return res.smax[Math.floor(res.smax.length / 2)];
    });
    let leathWork = 0;
    const leath = timeIt((r) => {
      const res = leathCluster(lat, 0, p, new Rng(seed + 3000 + r));
      leathWork = res.openEdges + res.perimeter;
      return res.size;
    });
    const bootOcc = new Uint8Array(lat.n);
    const rngB = new Rng(seed + 4000);
    for (let v = 0; v < lat.n; v++) bootOcc[v] = rngB.random() < p ? 1 : 0;
    const boot = timeIt(() => bootstrapLattice(lat, bootOcc, 2).activeCount);
    const inv = timeIt((r) => invasionPercolation(lat.n, lat.eu, lat.ev, { seed: 0, rngSeed: seed + 5000 + r }).size);
    const rows = [
      ['sample', sample, lat.m],
      ['nz', nz, lat.m],
      ['leath', leath, leathWork],
      ['boot', boot, lat.n + lat.m],
      ['inv', inv, lat.m * Math.log2(Math.max(2, lat.m))],
    ];
    const label = { sample: L.sample, nz: L.nz, leath: L.leath, boot: L.boot, inv: L.inv };
    const host = root.querySelector('#algo-table');
    host.innerHTML = `<table class="data-table">
      <thead><tr><th>${L.method}</th><th>${L.time}</th><th>${L.ops}</th><th>${L.result}</th></tr></thead>
      <tbody>${rows.map(([id, res, ops]) => `<tr><td>${label[id]}</td><td class="num">${fmt(res.ms, 2)}</td><td class="num">${fmtOps(ops)}</td><td class="num">${typeof res.out === 'number' ? fmt(res.out, 0) : res.out}</td></tr>`).join('')}</tbody>
    </table>`;
    state.bench = rows;
  }

  function scalingSweep() {
    const sizes = [12, 16, 24, 32, 48, 64, 96, 128];
    const xs = [];
    const ys = [];
    const method = 'sample';
    for (const Lv of sizes) {
      const lat = buildLattice('square', Lv);
      const model = new Percolation(lat, { mode: 'bond' });
      let best = Infinity;
      for (let r = 0; r < Math.max(1, Math.min(3, state.reps)); r++) {
        const rng = new Rng(state.seed + r);
        const t0 = startTime();
        model.sample(state.p, rng).analyze();
        const dt = startTime() - t0;
        if (dt < best) best = dt;
      }
      xs.push(Math.log10(lat.n));
      ys.push(Math.log10(Math.max(1e-3, best)));
    }
    const n = xs.length;
    const mx = xs.reduce((a, b) => a + b, 0) / n;
    const my = ys.reduce((a, b) => a + b, 0) / n;
    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
      num += (xs[i] - mx) * (ys[i] - my);
      den += (xs[i] - mx) ** 2;
    }
    const slope = den > 0 ? num / den : null;
    setText('algo-slope', slope === null ? '—' : fmt(slope, 2));
    const host = root.querySelector('#algo-plot');
    let el = host.querySelector('canvas');
    if (!el) {
      el = document.createElement('canvas');
      host.appendChild(el);
    }
    drawPlot(el, {
      height: 220,
      xRange: [Math.min(...xs) - 0.05, Math.max(...xs) + 0.05],
      yRange: [Math.min(...ys) - 0.2, Math.max(...ys) + 0.2],
      logX: false,
      logY: false,
      xLabel: 'log10 n',
      yLabel: 'log10 time / ms',
      series: [{ x: xs, y: ys, color: palette().cyan, points: 2.5, label: 'one sample' }],
    });
  }

  root.querySelector('#algo-k').addEventListener('input', (e) => {
    state.k = parseInt(e.target.value, 10);
    draw();
  });
  root.querySelector('#algo-size').addEventListener('change', (e) => {
    state.L = parseInt(e.target.value, 10);
    state.k = Math.min(state.k, state.L * state.L * 2);
    setup();
  });
  const pInput = root.querySelector('#algo-p');
  pInput.addEventListener('input', () => {
    state.p = parseFloat(pInput.value);
    root.querySelector('#algo-p-val').textContent = state.p.toFixed(3);
  });
  const repsInput = root.querySelector('#algo-reps');
  repsInput.addEventListener('input', () => {
    state.reps = parseInt(repsInput.value, 10);
    root.querySelector('#algo-reps-val').textContent = String(state.reps);
  });
  const seedInput = root.querySelector('#algo-seed');
  seedInput.addEventListener('input', () => {
    state.seed = parseInt(seedInput.value, 10);
    root.querySelector('#algo-seed-val').textContent = String(state.seed);
    state.k = 0;
    setup();
  });
  root.querySelector('#algo-bench').addEventListener('click', benchmark);
  root.querySelector('#algo-scale').addEventListener('click', scalingSweep);
  const onResize = () => draw();
  window.addEventListener('resize', onResize);
  const offTheme = onTheme(() => draw());
  setup();
  setTimeout(benchmark, 60);
  return () => {
    offTheme();
    window.removeEventListener('resize', onResize);
  };
}
