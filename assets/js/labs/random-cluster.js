import { Rng, Dsu, buildLattice } from '../../../lib/js/index.js';
import { labHead, control, select, readout, panel, canvasBox, fmt, setText } from './ui.js';
import { t } from '../i18n.js';

const LABELS = {
  en: {
    title: 'Random-cluster / Potts',
    kicker: 'lab 09 · cluster weight',
    lead: 'A Swendsen–Wang update on a 64×64 square lattice. Equal-spin edges are opened with probability p, each FK cluster gets a fresh colour, and the cycle repeats. q=2 is the Ising point at p = √2/(1+√2); q>2 is the q-state Potts model.',
    state: 'Order parameter',
    pc: 'Self-dual p_c(q)',
    largest: 'Largest FK cluster',
    magnet: 'Magnetisation',
    sweeps: 'Sweeps',
    q: 'States q',
    p: 'Edge probability p',
    play: 'Pause',
    step: 'One sweep',
    reset: 'Reset',
    note: 'The update is a Gibbs sampler for the random-cluster measure; it is not a claim that the browser reaches equilibrium in a few sweeps.',
  },
  zh: {
    title: '随机簇 / Potts',
    kicker: '实验 09 · 团簇权重',
    lead: '在 64×64 方格上做 Swendsen–Wang 更新。自旋相同的边以概率 p 打开，每个 FK 团簇获得新颜色，如此循环。q=2 是 Ising 点 p = √2/(1+√2)；q>2 是 q 态 Potts 模型。',
    state: '序参量',
    pc: '自对偶 p_c(q)',
    largest: '最大 FK 团簇',
    magnet: '磁化强度',
    sweeps: '扫描次数',
    q: '状态数 q',
    p: '边概率 p',
    play: '暂停',
    step: '单次扫描',
    reset: '重置',
    note: '该更新是随机簇测度的 Gibbs 采样器；这不意味着浏览器在几次扫描内就达到平衡。',
  },
  de: {
    title: 'Random-Cluster / Potts',
    kicker: 'Labor 09 · Clustergewicht',
    lead: 'Ein Swendsen–Wang-Update auf einem 64×64-Quadratgitter. Kanten mit gleichem Spin werden mit Wahrscheinlichkeit p geöffnet, jedes FK-Cluster erhält eine neue Farbe, und der Zyklus wiederholt sich. q=2 ist der Ising-Punkt p = √2/(1+√2); q>2 ist das q-Zustands-Potts-Modell.',
    state: 'Ordnungsparameter',
    pc: 'Selbstduales p_c(q)',
    largest: 'Größtes FK-Cluster',
    magnet: 'Magnetisierung',
    sweeps: 'Sweeps',
    q: 'Zustände q',
    p: 'Kantenwahrscheinlichkeit p',
    play: 'Pause',
    step: 'Ein Sweep',
    reset: 'Zurück',
    note: 'Das Update ist ein Gibbs-Sampler für das Random-Cluster-Maß; es behauptet nicht, dass der Browser in wenigen Sweeps ins Gleichgewicht kommt.',
  },
};

const COLORS = ['#4fe3ea', '#ffb454', '#6ef0a8', '#c9a7ff'];

export function mount(root, ctx) {
  const { lang } = ctx;
  const L = LABELS[lang] || LABELS.en;
  root.innerHTML =
    labHead({ kicker: L.kicker, title: L.title, lead: L.lead, lang }) +
    `<div class="grid-lab">
      <div>
        ${canvasBox('rc-canvas', ['POTTS', 'SWENDSEN–WANG', 'SPIN', ''])}
      </div>
      <aside class="panel">
        <h3>${L.state}</h3>
        ${readout('rc-pc', L.pc)}
        ${readout('rc-p-readout', L.p)}
        ${readout('rc-largest', L.largest)}
        ${readout('rc-magnet', L.magnet)}
        ${readout('rc-sweeps', L.sweeps)}
        <div class="control" style="margin-top:14px">
          <label><span>${L.q}</span></label>
          <select id="rc-q">
            <option value="2" selected>q = 2</option>
            <option value="3">q = 3</option>
            <option value="4">q = 4</option>
          </select>
        </div>
        <div class="control">
          <label><span>${L.p}</span></label>
          <input id="rc-p" type="range" min="0.40" max="0.80" step="0.001" value="0.586" />
        </div>
        <div class="btn-row">
          <button class="btn primary" id="rc-play">${L.play}</button>
          <button class="btn" id="rc-step">${L.step}</button>
          <button class="btn" id="rc-reset">${L.reset}</button>
        </div>
        <p class="hint" style="margin-top:14px">${L.note}</p>
      </aside>
    </div>`;

  const N = 64;
  const lat = buildLattice('square', N);
  const state = { q: 2, p: 0.586, spins: new Uint8Array(lat.n), sweeps: 0, running: true };
  const rng = new Rng(20241112);
  const dsu = new Dsu(lat.n);
  let timer = null;

  function pcOf(q) {
    const s = Math.sqrt(q);
    return s / (1 + s);
  }

  function init() {
    for (let i = 0; i < lat.n; i++) state.spins[i] = rng.int(state.q);
    state.sweeps = 0;
    sweep();
  }

  function sweep() {
    dsu.reset();
    for (let e = 0; e < lat.m; e++) {
      const a = lat.eu[e];
      const b = lat.ev[e];
      if (state.spins[a] === state.spins[b] && rng.random() < state.p) dsu.union(a, b);
    }
    const colorOfRoot = new Map();
    for (let v = 0; v < lat.n; v++) {
      const r = dsu.find(v);
      if (!colorOfRoot.has(r)) colorOfRoot.set(r, rng.int(state.q));
      state.spins[v] = colorOfRoot.get(r);
    }
    state.sweeps++;
  }

  function stats() {
    let largest = 0;
    for (let v = 0; v < lat.n; v++) largest = Math.max(largest, dsu.size[dsu.find(v)]);
    const counts = new Array(state.q).fill(0);
    for (let v = 0; v < lat.n; v++) counts[state.spins[v]]++;
    return { largest, magnet: Math.max(...counts) / lat.n };
  }

  function draw() {
    const canvas = document.getElementById('rc-canvas');
    const wrap = canvas.parentElement;
    const W = Math.max(300, wrap.clientWidth - 2);
    const H = Math.min(560, Math.round(W * 0.86));
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    const g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = '#050a0e';
    g.fillRect(0, 0, W, H);
    const pad = 10;
    const cell = Math.min((W - 2 * pad) / N, (H - 2 * pad) / N);
    const ox = (W - cell * N) / 2;
    const oy = (H - cell * N) / 2;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const v = i * N + j;
        g.fillStyle = COLORS[state.spins[v] % COLORS.length];
        g.globalAlpha = 0.82;
        g.fillRect(ox + j * cell, oy + i * cell, Math.max(1, cell - 0.3), Math.max(1, cell - 0.3));
      }
    }
    g.globalAlpha = 1;
    g.strokeStyle = 'rgba(96,190,210,0.35)';
    g.strokeRect(ox, oy, cell * N, cell * N);
    const st = stats();
    setText('rc-largest', `${fmt(st.largest / lat.n, 4)}  (${st.largest})`);
    setText('rc-magnet', fmt(st.magnet, 4));
    setText('rc-sweeps', String(state.sweeps));
    setText('rc-pc', fmt(pcOf(state.q), 4));
    setText('rc-p-readout', fmt(state.p, 3));
  }

  function tick() {
    if (!state.running) return;
    sweep();
    sweep();
    draw();
  }

  document.getElementById('rc-q').addEventListener('change', (e) => {
    state.q = parseInt(e.target.value, 10);
    init();
    draw();
  });
  document.getElementById('rc-p').addEventListener('input', (e) => {
    state.p = parseFloat(e.target.value);
    setText('rc-p-readout', fmt(state.p, 3));
    sweep();
    draw();
  });
  document.getElementById('rc-play').addEventListener('click', (e) => {
    state.running = !state.running;
    e.target.textContent = state.running ? L.play : t(lang, 'resume');
  });
  document.getElementById('rc-step').addEventListener('click', () => {
    sweep();
    draw();
  });
  document.getElementById('rc-reset').addEventListener('click', () => {
    init();
    draw();
  });

  init();
  draw();
  timer = setInterval(tick, 160);
  return () => {
    if (timer) clearInterval(timer);
  };
}
