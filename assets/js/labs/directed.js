import { Rng, buildLattice, directedCrossing } from '../../../lib/js/index.js';
import { labHead, control, select, readout, panel, canvasBox, fmt, setText } from './ui.js';
import { drawPlot, PALETTE } from '../lib/plot.js';
import { t } from '../i18n.js';
import { palette, onTheme, withAlpha } from '../theme.js';

const PC = { bond: 0.644700, site: 0.705489 };

const LABELS = {
  en: {
    title: 'Directed percolation',
    kicker: 'lab 08 · causality',
    lead: 'East edges are space, south edges are time. A site is reachable only from the west or north; the cyan set is the causal future of the left boundary. At the same p the directed model is far below the undirected threshold.',
    readout: 'Reachable set',
    threshold: 'Threshold (1+1)',
    resample: 'Resample',
    sweep: 'Sweep π(p)',
    crossing: 'Left–right crossing',
    reachable: 'Reachable sites',
    ratio: 'p / p_c',
    mode: 'Mode',
    size: 'Lattice size L',
    curve: 'Crossing probability',
    space: 'SPACE →',
    time: 'TIME ↓',
    known: 'Known p_c',
    note: 'p_c is numerical: 0.644700(10) for bond and 0.705489(4) for site. There is no duality identity at p_c, so the crossing probability is not 1/2.',
  },
  zh: {
    title: '有向渗流',
    kicker: '实验 08 · 因果性',
    lead: '向东的边是空间，向南的边是时间。一个位点只能从西侧或北侧到达；青色集合是左边界在因果意义上的未来。在同一个 p 下，有向模型远低于无向阈值。',
    readout: '可达集合',
    threshold: '阈值（1+1 维）',
    resample: '重采样',
    sweep: '扫描 π(p)',
    crossing: '左右横穿',
    reachable: '可达位点',
    ratio: 'p / p_c',
    mode: '模式',
    size: '格子尺寸 L',
    curve: '横穿概率',
    space: '空间 →',
    time: '时间 ↓',
    known: '已知 p_c',
    note: 'p_c 是数值：键渗流 0.644700(10)，位点渗流 0.705489(4)。p_c 处没有对偶恒等式，所以横穿概率不是 1/2。',
  },
  de: {
    title: 'Gerichtete Perkolation',
    kicker: 'Labor 08 · Kausalität',
    lead: 'Ostkanten sind Raum, Südkanten sind Zeit. Ein Platz ist nur vom Westen oder Norden erreichbar; die cyanfarbene Menge ist die kausale Zukunft des linken Randes. Bei gleichem p liegt das gerichtete Modell weit unter der ungerichteten Schwelle.',
    readout: 'Erreichbare Menge',
    threshold: 'Schwelle (1+1)',
    resample: 'Neu ziehen',
    sweep: 'π(p) durchlaufen',
    crossing: 'Links-rechts-Durchgang',
    reachable: 'Erreichbare Plätze',
    ratio: 'p / p_c',
    mode: 'Modus',
    size: 'Gittergröße L',
    curve: 'Durchgangswahrscheinlichkeit',
    space: 'RAUM →',
    time: 'ZEIT ↓',
    known: 'Bekanntes p_c',
    note: 'p_c ist numerisch: 0.644700(10) für Bond und 0.705489(4) für Site. Bei p_c gibt es keine Dualitätsidentität; die Durchgangswahrscheinlichkeit ist nicht 1/2.',
  },
};

export function mount(root, ctx) {
  const { lang } = ctx;
  const L = LABELS[lang] || LABELS.en;
  root.innerHTML =
    labHead({ kicker: L.kicker, title: L.title, lead: L.lead, lang , guide: 'directed' }) +
    `<div class="grid-lab">
      <div>
        ${canvasBox('dir-canvas', [L.space, '', L.time, ''])}
        <div style="height:12px"></div>
        ${canvasBox('dir-curve', [L.curve, '1+1 D', 'p', ''])}
      </div>
      <aside class="panel">
        <h3>${L.threshold}</h3>
        ${readout('dir-cross', L.crossing)}
        ${readout('dir-reach', L.reachable)}
        ${readout('dir-ratio', L.ratio)}
        ${readout('dir-pc', L.known)}
        <div class="control" style="margin-top:14px">
          <label><span>${L.mode}</span></label>
          <select id="dir-mode">
            <option value="bond">${t(lang, 'bond')}</option>
            <option value="site">${t(lang, 'site')}</option>
          </select>
        </div>
        <div class="control">
          <label><span>${L.size}</span></label>
          <select id="dir-size">
            <option value="32">32 × 32</option>
            <option value="64" selected>64 × 64</option>
            <option value="128">128 × 128</option>
          </select>
        </div>
        ${control({ id: 'dir-p', label: t(lang, 'probability'), min: 0, max: 1, step: 0.001, value: 0.65 })}
        <div class="btn-row">
          <button class="btn primary" id="dir-resample">${L.resample}</button>
          <button class="btn" id="dir-sweep">${L.sweep}</button>
        </div>
        <p class="hint" style="margin-top:14px">${L.note}</p>
      </aside>
    </div>`;

  const state = { mode: 'bond', L: 64, p: 0.65, seed: 7101, curve: [] };
  let lat = buildLattice('square', state.L);
  let last = null;

  function resample() {
    const rng = new Rng(state.seed++);
    last = directedCrossing(lat, state.p, rng, { mode: state.mode });
    draw();
    readouts();
  }

  function readouts() {
    const reachable = last ? last.reach.reduce((a, b) => a + b, 0) : 0;
    const pc = PC[state.mode];
    setText('dir-cross', last && last.cross ? t(lang, 'yes') : t(lang, 'no'));
    setText('dir-reach', `${reachable} / ${lat.n}`);
    setText('dir-ratio', `${fmt(state.p / pc, 3)}×`);
    setText('dir-pc', fmt(pc, 6));
    const cEl = document.getElementById('dir-cross');
    if (cEl) cEl.parentElement.className = `readout ${last && last.cross ? 'ok' : ''}`;
  }

  function draw() {
    const C = palette();
    const canvas = document.getElementById('dir-canvas');
    const wrap = canvas.parentElement;
    const W = Math.max(300, wrap.clientWidth - 2);
    const H = Math.min(560, Math.round(W * 0.82));
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    const g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = C.bg;
    g.fillRect(0, 0, W, H);
    if (!last) return;
    const n = state.L;
    const pad = 8;
    const cell = Math.min((W - 2 * pad) / n, (H - 2 * pad) / n);
    const ox = (W - cell * n) / 2;
    const oy = (H - cell * n) / 2;

    // edges
    if (n <= 64) {
      g.lineWidth = Math.max(0.4, cell * 0.12);
      for (let e = 0; e < lat.m; e++) {
        const a = lat.eu[e];
        const b = lat.ev[e];
        const open = state.mode === 'bond' ? last.open[e] : last.occ[a] && last.occ[b];
        if (!open) continue;
        const ai = Math.floor(a / n), aj = a % n;
        const bi = Math.floor(b / n), bj = b % n;
        g.strokeStyle = withAlpha(C.cyanDim, 0.45);
        g.beginPath();
        g.moveTo(ox + (aj + 0.5) * cell, oy + (ai + 0.5) * cell);
        g.lineTo(ox + (bj + 0.5) * cell, oy + (bi + 0.5) * cell);
        g.stroke();
      }
    }

    const block = Math.max(1, cell * 0.72);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const v = i * n + j;
        if (last.occ && !last.occ[v]) continue;
        let color = 'rgba(35,58,70,0.85)';
        if (last.reach[v]) color = '#4fe3ea';
        else if (state.mode === 'bond') color = 'rgba(40,74,88,0.7)';
        g.fillStyle = color;
        g.fillRect(ox + (j + 0.5) * cell - block / 2, oy + (i + 0.5) * cell - block / 2, block, block);
      }
    }

    g.strokeStyle = C.grid;
    g.strokeRect(ox, oy, cell * n, cell * n);
  }

  function sweep() {
    const n = 32;
    const small = buildLattice('square', n);
    const rng = new Rng(991);
    const pts = [];
    for (let k = 0; k <= 12; k++) {
      const p = 0.45 + (0.35 * k) / 12;
      let hits = 0;
      const samples = 80;
      for (let s = 0; s < samples; s++) {
        if (directedCrossing(small, p, rng, { mode: state.mode }).cross) hits++;
      }
      pts.push({ p, pi: hits / samples });
    }
    state.curve = pts;
    drawPlot(document.getElementById('dir-curve'), {
      height: 220,
      xLabel: 'p',
      yLabel: 'π(p)',
      xRange: [0.45, 0.8],
      yRange: [0, 1],
      vlines: [{ x: PC[state.mode], color: 'rgba(255,180,84,0.5)', label: 'p_c' }],
      series: [{ x: pts.map((q) => q.p), y: pts.map((q) => q.pi), color: PALETTE.cyan, points: 2 }],
    });
  }

  const pInput = document.getElementById('dir-p');
  pInput.addEventListener('input', () => {
    state.p = parseFloat(pInput.value);
    document.getElementById('dir-p-val').textContent = fmt(state.p, 3);
    resample();
  });
  document.getElementById('dir-mode').addEventListener('change', (e) => {
    state.mode = e.target.value;
    resample();
  });
  document.getElementById('dir-size').addEventListener('change', (e) => {
    state.L = parseInt(e.target.value, 10);
    lat = buildLattice('square', state.L);
    resample();
  });
  document.getElementById('dir-resample').addEventListener('click', resample);
  document.getElementById('dir-sweep').addEventListener('click', sweep);

  resample();
  sweep();
  const offTheme = onTheme(() => { draw(); sweep(); });
  return () => offTheme();
}
