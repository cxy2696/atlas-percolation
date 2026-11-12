import { Rng, buildLattice, invasionPercolation } from '../../../lib/js/index.js';
import { labHead, select, readout, panel, canvasBox, fmt, setText, control } from './ui.js';
import { drawPlot } from '../lib/plot.js';
import { palette, onTheme } from '../theme.js';

const LABELS = {
  en: {
    kicker: 'lab 12 · minimum bottleneck growth',
    title: 'Invasion percolation',
    lead: 'Every edge has an independent random threshold. Starting from one seed, the cluster always invades across the lowest-threshold edge on its boundary. It is not Bernoulli percolation: the rule is greedy and history-dependent, and the result is a spanning tree of the invaded region.',
    field: 'Invaded set and threshold',
    sequence: 'Accepted threshold sequence',
    histogram: 'Threshold distribution',
    sites: 'Invaded sites',
    accepted: 'Accepted edges',
    loops: 'Rejected loop edges',
    last: 'Last threshold',
    mean: 'Mean threshold',
    df: 'Mass–radius slope',
    controls: 'Controls',
    grow: 'Grow',
    step: 'Step',
    reset: 'Reset',
    seed: 'Seed',
    showLoops: 'Show rejected loops',
    note: 'The mass–radius slope is fitted over the first part of the growth and is a finite-size estimate, not a precise fractal dimension. Rejected loops are edges that would close a cycle inside the invaded set.',
    legendLow: 'low threshold',
    legendHigh: 'high threshold',
    legendLoop: 'rejected loop',
  },
  zh: {
    kicker: '实验 12 · 最小瓶颈生长',
    title: '侵入渗流',
    lead: '每条边有独立的随机阈值。从一个种子出发，团簇总是沿着边界上阈值最小的边侵入。它不是 Bernoulli 渗流：规则是贪心的、依赖历史的，结果是侵入区域的一棵生成树。',
    field: '侵入集合与阈值',
    sequence: '接受的阈值序列',
    histogram: '阈值分布',
    sites: '已侵入位点',
    accepted: '接受的边',
    loops: '被拒绝的环边',
    last: '最后阈值',
    mean: '平均阈值',
    df: '质量–半径斜率',
    controls: '控制',
    grow: '生长',
    step: '单步',
    reset: '重置',
    seed: '种子',
    showLoops: '显示被拒绝的环',
    note: '质量–半径斜率只在生长前段拟合，是有限尺度估计，不是精确分形维数。被拒绝的环边会闭合侵入集合内部的回路。',
    legendLow: '低阈值',
    legendHigh: '高阈值',
    legendLoop: '被拒绝的环',
  },
  de: {
    kicker: 'Labor 12 · minimaler Engpass',
    title: 'Invasion-Perkolation',
    lead: 'Jede Kante hat eine unabhängige Zufallsschwelle. Von einem Startplatz aus überflutet der Cluster stets die Kante mit der kleinsten Schwelle am Rand. Das ist keine Bernoulli-Perkolation: die Regel ist gierig und histories abhängig; das Ergebnis ist ein Spannbaum des überfluteten Gebiets.',
    field: 'Überflutete Menge und Schwelle',
    sequence: 'Akzeptierte Schwellenfolge',
    histogram: 'Schwellenverteilung',
    sites: 'Überflutete Plätze',
    accepted: 'Akzeptierte Kanten',
    loops: 'Verworfene Kreiskanten',
    last: 'Letzte Schwelle',
    mean: 'Mittlere Schwelle',
    df: 'Masse-Radius-Steigung',
    controls: 'Regler',
    grow: 'Wachsen',
    step: 'Schritt',
    reset: 'Zurück',
    seed: 'Seed',
    showLoops: 'Verworfene Kreise zeigen',
    note: 'Die Masse-Radius-Steigung wird nur am Anfang des Wachstums gefittet und ist eine endliche Schätzung, keine exakte Fraktaldimension. Verworfene Kreiskanten würden einen Zyklus im überfluteten Gebiet schließen.',
    legendLow: 'kleine Schwelle',
    legendHigh: 'große Schwelle',
    legendLoop: 'verworfener Kreis',
  },
};

const HELP = {
  en: { L: 'Box side. The cluster eventually fills the connected box; the early growth is the interesting part.', seed: 'Controls both the threshold field and the starting site.' },
  zh: { L: '盒子边长。团簇最终会填满连通盒子；有意思的是早期生长。', seed: '同时控制阈值场与起始位点。' },
  de: { L: 'Boxseite. Der Cluster füllt schließlich die zusammenhängende Box; interessant ist das frühe Wachstum.', seed: 'Steuert Schwellenfeld und Startplatz.' },
};

export function mount(root, ctx) {
  const { lang } = ctx;
  const L = LABELS[lang] || LABELS.en;
  const H = HELP[lang] || HELP.en;
  root.innerHTML =
    labHead({ kicker: L.kicker, title: L.title, lead: L.lead, lang, guide: 'invasion' }) +
    `<div class="grid-lab">
      <div>
        ${canvasBox('inv-canvas', [L.field, 'threshold', 'seed 0', 'L'])}
        <div class="control" style="margin-top:10px">
          <label for="inv-progress"><span>invaded sites</span><b id="inv-progress-val">0</b></label>
          <input id="inv-progress" type="range" min="1" max="100" step="1" value="1" />
        </div>
        <div class="legend" style="margin:10px 0 14px">
          <span><i data-theme-color="cyan"></i>${L.legendLow}</span>
          <span><i data-theme-color="amber"></i>${L.legendHigh}</span>
          <span><i style="background:var(--red)"></i>${L.legendLoop}</span>
        </div>
        <div class="grid-2">
          ${panel(L.sequence, '<div class="plot-host" id="inv-seq"></div>')}
          ${panel(L.histogram, '<div class="plot-host" id="inv-hist"></div>')}
        </div>
        <p class="explain">${L.note}</p>
      </div>
      <aside class="panel">
        <h3>${L.controls}</h3>
        ${select({ id: 'inv-size', label: 'L', value: '48', options: [
          { value: '32', label: '32 × 32' },
          { value: '48', label: '48 × 48' },
          { value: '64', label: '64 × 64' },
        ], help: H.L })}
        ${control({ id: 'inv-seed', label: L.seed, min: 1, max: 9999, step: 1, value: 3, help: H.seed })}
        <label class="checkline"><input type="checkbox" id="inv-showloops" /> ${L.showLoops}</label>
        <div class="btn-row">
          <button class="btn primary" id="inv-grow">${L.grow}</button>
          <button class="btn" id="inv-step">${L.step}</button>
          <button class="btn ghost" id="inv-reset">${L.reset}</button>
        </div>
        ${readout('inv-sites', L.sites)}
        ${readout('inv-accepted', L.accepted)}
        ${readout('inv-loops', L.loops)}
        ${readout('inv-last', L.last)}
        ${readout('inv-mean', L.mean)}
        ${readout('inv-df', L.df)}
      </aside>
    </div>`;

  const canvas = root.querySelector('#inv-canvas');
  const state = { L: 48, seed: 3, result: null, lat: null, reveal: 0, timer: null, showLoops: false, rank: null };
  let df = null;

  function stop() {
    if (state.timer) clearInterval(state.timer);
    state.timer = null;
  }

  function run() {
    stop();
    state.lat = buildLattice('square', state.L);
    const seed = state.seed % state.lat.n;
    state.result = invasionPercolation(state.lat.n, state.lat.eu, state.lat.ev, { seed, rngSeed: state.seed * 97 + 11 });
    state.reveal = 1;
    const prog = root.querySelector('#inv-progress');
    prog.max = String(state.result.order.length);
    prog.value = '1';
    root.querySelector('#inv-progress-val').textContent = `1 / ${state.result.order.length}`;
    state.rank = new Int32Array(state.lat.n).fill(-1);
    state.result.order.forEach((v, k) => { state.rank[v] = k; });
    df = fitMassRadius(state.lat, state.result.order);
    readouts();
    draw();
    drawPlots();
    const chunk = Math.max(1, Math.floor(state.result.order.length / 150));
    state.timer = setInterval(() => {
      state.reveal = Math.min(state.result.order.length, state.reveal + chunk);
      if (state.reveal >= state.result.order.length) stop();
      draw();
      readouts();
      root.querySelector('#inv-progress').value = String(state.reveal);
      root.querySelector('#inv-progress-val').textContent = `${state.reveal} / ${state.result.order.length}`;
    }, 30);
  }

  function fitMassRadius(lat, order) {
    const xs = [];
    const ys = [];
    const maxK = Math.min(order.length, Math.max(20, Math.floor(order.length * 0.4)));
    for (let k = 10; k <= maxK; k *= 2) {
      let cx = 0;
      let cy = 0;
      for (let i = 0; i < k; i++) {
        const p = lat.position(order[i]);
        cx += p.x;
        cy += p.y;
      }
      cx /= k;
      cy /= k;
      let r2 = 0;
      for (let i = 0; i < k; i++) {
        const p = lat.position(order[i]);
        r2 += (p.x - cx) ** 2 + (p.y - cy) ** 2;
      }
      r2 /= k;
      if (r2 > 0) {
        xs.push(0.5 * Math.log(k));
        ys.push(0.5 * Math.log(r2));
      }
    }
    if (xs.length < 3) return null;
    const n = xs.length;
    const mx = xs.reduce((a, b) => a + b, 0) / n;
    const my = ys.reduce((a, b) => a + b, 0) / n;
    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
      num += (xs[i] - mx) * (ys[i] - my);
      den += (xs[i] - mx) ** 2;
    }
    return den > 0 ? num / den : null;
  }

  function readouts() {
    const r = state.result;
    if (!r) return;
    const n = state.reveal;
    setText('inv-sites', `${n} / ${r.order.length}  (${fmt(n / r.order.length, 3)})`);
    setText('inv-accepted', String(n - 1));
    setText('inv-loops', String(r.loops));
    const keys = r.thresholds.slice(0, Math.max(0, n - 1));
    setText('inv-last', keys.length ? fmt(keys[keys.length - 1], 3) : '—');
    setText('inv-mean', keys.length ? fmt(keys.reduce((a, b) => a + b, 0) / keys.length, 3) : '—');
    setText('inv-df', df === null ? '—' : fmt(df, 2));
  }

  function draw() {
    const r = state.result;
    if (!r) return;
    const C = palette();
    const wrap = canvas.parentElement;
    const W = Math.max(280, wrap.clientWidth - 2);
    const H = Math.min(560, Math.round(W * 0.9));
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
    const cell = Math.min((W - 24) / n, (H - 24) / n);
    const ox = (W - cell * n) / 2;
    const oy = (H - cell * n) / 2;
    const reveal = Math.max(1, state.reveal);
    for (let i = 0; i < n * n; i++) {
      const row = Math.floor(i / n);
      const col = i % n;
      g.fillStyle = C.closed;
      g.fillRect(ox + col * cell, oy + row * cell, Math.max(1, cell - 0.4), Math.max(1, cell - 0.4));
    }
    for (let k = 0; k < reveal; k++) {
      const v = r.order[k];
      const row = Math.floor(v / n);
      const col = v % n;
      const key = k === 0 ? 0 : r.thresholds[k - 1];
      g.fillStyle = key < 0.34 ? C.cyan : key < 0.67 ? C.amber : C.red;
      g.fillRect(ox + col * cell, oy + row * cell, Math.max(1, cell - 0.4), Math.max(1, cell - 0.4));
    }
    // accepted tree edges
    g.strokeStyle = C.ink;
    g.globalAlpha = 0.25;
    g.lineWidth = 0.7;
    for (let k = 1; k < reveal; k++) {
      const v = r.order[k];
      const row = Math.floor(v / n);
      const col = v % n;
      for (const [dr, dc] of [[0, 1], [1, 0], [-1, 0], [0, -1]]) {
        const rr = row + dr;
        const cc = col + dc;
        if (rr < 0 || cc < 0 || rr >= n || cc >= n) continue;
        const u = rr * n + cc;
        if (state.rank[u] >= 0 && state.rank[u] < k) {
          g.beginPath();
          g.moveTo(ox + (col + 0.5) * cell, oy + (row + 0.5) * cell);
          g.lineTo(ox + (cc + 0.5) * cell, oy + (rr + 0.5) * cell);
          g.stroke();
        }
      }
    }
    g.globalAlpha = 1;
    if (state.showLoops) {
      g.strokeStyle = C.red;
      g.lineWidth = 1.2;
      g.globalAlpha = 0.8;
      for (const e of r.loopEdges) {
        const a = state.lat.eu[e];
        const b = state.lat.ev[e];
        const ar = Math.floor(a / n);
        const ac = a % n;
        const br = Math.floor(b / n);
        const bc = b % n;
        if (Math.max(ar, br) >= n || Math.max(ac, bc) >= n) continue;
        g.beginPath();
        g.moveTo(ox + (ac + 0.5) * cell, oy + (ar + 0.5) * cell);
        g.lineTo(ox + (bc + 0.5) * cell, oy + (br + 0.5) * cell);
        g.stroke();
      }
      g.globalAlpha = 1;
    }
  }

  function drawPlots() {
    if (!state.result) return;
    const C = palette();
    const seqHost = root.querySelector('#inv-seq');
    let el = seqHost.querySelector('canvas');
    if (!el) {
      el = document.createElement('canvas');
      seqHost.appendChild(el);
    }
    const keys = state.result.thresholds;
    drawPlot(el, {
      height: 200,
      xRange: [1, Math.max(2, keys.length + 1)],
      yRange: [0, 1],
      xLabel: 'accepted edges',
      yLabel: 'threshold',
      series: [{ x: keys.map((_, i) => i + 1), y: keys, color: C.amber, width: 1.2 }],
    });
    const histHost = root.querySelector('#inv-hist');
    let el2 = histHost.querySelector('canvas');
    if (!el2) {
      el2 = document.createElement('canvas');
      histHost.appendChild(el2);
    }
    const bins = new Array(20).fill(0);
    for (const k of keys) bins[Math.min(19, Math.floor(k * 20))]++;
    const maxBin = Math.max(1, ...bins);
    drawPlot(el2, {
      height: 200,
      xRange: [0, 1],
      yRange: [0, maxBin],
      xLabel: 'threshold',
      yLabel: 'count',
      series: [{ x: bins.map((_, i) => (i + 0.5) / 20), y: bins, color: C.cyan, width: 0.8, points: 2 }],
    });
  }

  function reset() {
    stop();
    state.result = null;
    state.reveal = 0;
    const C = palette();
    const g = canvas.getContext('2d');
    g.fillStyle = C.bg;
    g.fillRect(0, 0, canvas.width, canvas.height);
    for (const id of ['inv-sites', 'inv-accepted', 'inv-loops', 'inv-last', 'inv-mean', 'inv-df']) setText(id, '—');
    for (const host of ['inv-seq', 'inv-hist']) {
      const h = root.querySelector(`#${host}`);
      if (h) h.innerHTML = '';
    }
  }

  root.querySelector('#inv-grow').addEventListener('click', run);
  root.querySelector('#inv-progress').addEventListener('input', (e) => {
    if (!state.result) return;
    stop();
    state.reveal = Math.max(1, parseInt(e.target.value, 10));
    root.querySelector('#inv-progress-val').textContent = `${state.reveal} / ${state.result.order.length}`;
    draw();
    readouts();
  });
  root.querySelector('#inv-step').addEventListener('click', () => {
    if (!state.result) return;
    state.reveal = Math.min(state.result.order.length, state.reveal + Math.max(1, Math.floor(state.result.order.length / 20)));
    draw();
    readouts();
  });
  root.querySelector('#inv-reset').addEventListener('click', reset);
  root.querySelector('#inv-size').addEventListener('change', (e) => {
    state.L = parseInt(e.target.value, 10);
    run();
  });
  const seedInput = root.querySelector('#inv-seed');
  seedInput.addEventListener('input', () => {
    state.seed = parseInt(seedInput.value, 10);
    root.querySelector('#inv-seed-val').textContent = String(state.seed);
  });
  seedInput.addEventListener('change', run);
  root.querySelector('#inv-showloops').addEventListener('change', (e) => {
    state.showLoops = e.target.checked;
    draw();
  });
  const onResize = () => {
    draw();
    drawPlots();
  };
  window.addEventListener('resize', onResize);
  const offTheme = onTheme(() => {
    draw();
    drawPlots();
  });
  run();
  return () => {
    stop();
    offTheme();
    window.removeEventListener('resize', onResize);
  };
}
