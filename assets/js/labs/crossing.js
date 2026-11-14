import { Rng, buildLattice, Percolation } from '../../../lib/js/index.js';
import { labHead, panel, canvasBox, readout, fmt, setText, bindRange, queryNumber } from './ui.js';
import { wilsonInterval } from '../lib/experiment.js';
import { drawPlot, PALETTE } from '../lib/plot.js';
import { t } from '../i18n.js';
import { onTheme } from '../theme.js';

const LABELS = {
  en: {
    kicker: 'lab 02 · finite size',
    title: 'Crossing probability and collapse',
    lead: 'Three lattice sizes are sampled at once. Left: the raw crossing curves sharpen as L grows while all of them pass through 1/2 at p_c. Right: the same data in the scaling variable (p − p_c)L^(1/ν) with ν = 4/3 — the collapse is the evidence that a single exponent organises the transition.',
    raw: 'π(p) by lattice size',
    collapse: 'Finite-size collapse',
    speed: 'Samples / tick',
    samples: 'Samples',
    pi32: 'π(p_c), L=32',
    pi64: 'π(p_c), L=64',
    pi128: 'π(p_c), L=128',
    state: 'Acquisition',
    collapseExp: 'Collapse exponent ν',
    boost: 'Add 2 000 samples',
    nuHelp: '4/3 is the exact two-dimensional value. Change it to see the collapse fail.',
    interval: '95% interval',
  },
  zh: {
    kicker: '实验 02 · 有限尺度',
    title: '横穿概率与数据坍缩',
    lead: '同时采样三种尺寸。左：原始横穿曲线随 L 增大而变陡，且都经过 p_c 处的 1/2。右：把同一批数据画在标度变量 (p − p_c)L^(1/ν) 上（ν = 4/3），曲线重合，说明整个相变由一个指数组织。',
    raw: 'π(p) 随尺寸',
    collapse: '有限尺度坍缩',
    speed: '每帧样本数',
    samples: '样本数',
    pi32: 'π(p_c)，L=32',
    pi64: 'π(p_c)，L=64',
    pi128: 'π(p_c)，L=128',
    state: '采集',
    collapseExp: '坍缩指数 ν',
    boost: '再加 2 000 个样本',
    nuHelp: '4/3 是二维精确值。改掉它，就能看到坍缩失效。',
    interval: '95% 区间',
  },
  de: {
    kicker: 'Labor 02 · endliche Größe',
    title: 'Durchgangswahrscheinlichkeit und Kollaps',
    lead: 'Drei Gittergrößen werden gleichzeitig gezogen. Links: die Rohkurven werden mit wachsendem L steiler, laufen aber alle bei p_c durch 1/2. Rechts: dieselben Daten in der Skalenvariablen (p − p_c)L^(1/ν), ν = 4/3 — der Kollaps zeigt, dass ein einziger Exponent den Übergang organisiert.',
    raw: 'π(p) nach Gittergröße',
    collapse: 'Finite-Size-Kollaps',
    speed: 'Stichproben / Takt',
    samples: 'Stichproben',
    pi32: 'π(p_c), L=32',
    pi64: 'π(p_c), L=64',
    pi128: 'π(p_c), L=128',
    state: 'Erfassung',
    collapseExp: 'Kollaps-Exponent ν',
    boost: '2 000 Stichproben ergänzen',
    nuHelp: '4/3 ist der exakte zweidimensionale Wert. Ändern, um den Kollaps scheitern zu sehen.',
    interval: '95%-Intervall',
  },
};

const LS = [32, 64, 128];
const BINS = 25;
const P0 = 0.4;
const P1 = 0.6;
const NU0 = 4 / 3;

export function mount(root, ctx) {
  const { lang } = ctx;
  const L = LABELS[lang] || LABELS.en;
  root.innerHTML =
    labHead({ kicker: L.kicker, title: L.title, lead: L.lead, lang , guide: 'crossing' }) +
    `<div class="grid-lab">
      <div>
        ${canvasBox('cross-raw', ['π(p)', 'BOND · SQUARE', 'p', ''])}
        <div style="height:12px"></div>
        ${canvasBox('cross-collapse', ['COLLAPSE', 'ν = 4/3', '', ''])}
      </div>
      <aside class="panel">
        <h3>${L.state}</h3>
        ${readout('cross-total', L.samples)}
        ${readout('cross-pi32', L.pi32)}
        ${readout('cross-pi64', L.pi64)}
        ${readout('cross-pi128', L.pi128)}
        <div class="control" style="margin-top:16px">
          <label for="cross-nu"><span>${L.collapseExp}</span><b id="cross-nu-val">1.333</b></label>
          <input id="cross-nu" type="range" min="0.8" max="2" step="0.001" value="1.333" />
          <span class="help">${L.nuHelp}</span>
        </div>
        <div class="control">
          <label><span>${L.speed}</span><b id="cross-speed-val">8</b></label>
          <input id="cross-speed" type="range" min="1" max="24" step="1" value="8" />
        </div>
        <div class="btn-row">
          <button class="btn primary" id="cross-toggle">${t(lang, 'pause')}</button>
          <button class="btn" id="cross-reset">${t(lang, 'reset')}</button>
        </div>
        <div class="btn-row">
          <button class="btn" id="cross-boost">${L.boost}</button>
        </div>
        <p class="hint" style="margin-top:14px">${t(lang, 'engine_note')}</p>
      </aside>
    </div>`;

  let rng = new Rng(4242);
  const models = {};
  const bins = {};
  for (const size of LS) {
    const lat = buildLattice('square', size);
    models[size] = new Percolation(lat, { mode: 'bond' });
    bins[size] = Array.from({ length: BINS }, (_, i) => ({
      p: P0 + ((P1 - P0) * (i + 0.5)) / BINS,
      hits: 0,
      n: 0,
    }));
  }
  let total = 0;
  let perTick = 8;
  let running = true;
  let timer = null;
  let frame = 0;
  let quiet = false;
  let nu = Math.min(2, Math.max(0.8, queryNumber(ctx.query, 'nu', NU0)));
  const atPc = Object.fromEntries(LS.map((size) => [size, { hits: 0, n: 0 }]));

  const nuInput = document.getElementById('cross-nu');
  nuInput.value = String(nu);
  document.getElementById('cross-nu-val').textContent = nu.toFixed(3);

  function tick() {
    if (!running) return;
    for (let k = 0; k < perTick; k++) {
      for (const size of LS) {
        const b = rng.int(BINS);
        const bin = bins[size][b];
        if (!bin) continue;
        models[size].sample(bin.p, rng);
        bin.n++;
        if (models[size].crossesLR()) bin.hits++;
        total++;
        models[size].sample(0.5, rng);
        atPc[size].n++;
        if (models[size].crossesLR()) atPc[size].hits++;
        total++;
      }
    }
    frame++;
    if (!quiet && frame % 3 === 0) draw();
    if (frame % 15 === 0) publishRun();
  }

  function addSamples(n) {
    const oldPerTick = perTick;
    const wasRunning = running;
    perTick = 1;
    running = true;
    quiet = true;
    for (let i = 0; i < n; i++) tick();
    quiet = false;
    running = wasRunning;
    perTick = oldPerTick;
    draw();
    publishRun();
  }

  function publishRun() {
    if (!ctx.setRun) return;
    ctx.setRun({
      seed: 4242,
      params: { sizes: '32,64,128', pMin: P0, pMax: P1, nu: Number(nu.toFixed(6)), samples: total },
      result: {
        samples: total,
        pi32: atPc[32].hits / Math.max(1, atPc[32].n),
        pi64: atPc[64].hits / Math.max(1, atPc[64].n),
        pi128: atPc[128].hits / Math.max(1, atPc[128].n),
      },
    });
  }

  function nearestBin(size, p) {
    let best = bins[size][0];
    for (const b of bins[size]) if (Math.abs(b.p - p) < Math.abs(best.p - p)) best = b;
    return best;
  }

  function draw() {
    drawPlot(document.getElementById('cross-raw'), {
      height: 240,
      xLabel: 'p',
      yLabel: 'π(p, L)',
      xRange: [P0, P1],
      yRange: [0, 1],
      vlines: [{ x: 0.5, color: 'rgba(255,180,84,0.45)', label: 'p_c = 1/2' }],
      series: LS.map((size, i) => ({
        x: bins[size].filter((b) => b.n > 6).map((b) => b.p),
        y: bins[size].filter((b) => b.n > 6).map((b) => b.hits / b.n),
        color: [PALETTE.cyan, PALETTE.amber, PALETTE.violet][i],
        label: `L=${size}`,
        points: 2,
      })),
    });

    const series = LS.map((size, i) => {
      const pts = bins[size].filter((b) => b.n > 6);
      return {
        x: pts.map((b) => (b.p - 0.5) * Math.pow(size, nu)),
        y: pts.map((b) => b.hits / b.n),
        color: [PALETTE.cyan, PALETTE.amber, PALETTE.violet][i],
        label: `L=${size}`,
        points: 2,
      };
    });
    let limit = 12;
    for (const line of series) for (const x of line.x) limit = Math.max(limit, Math.abs(x));
    limit = Math.ceil(limit * 1.08);
    drawPlot(document.getElementById('cross-collapse'), {
      height: 240,
      xLabel: `(p − p_c) L^{1/ν}`,
      yLabel: 'π',
      xRange: [-limit, limit],
      yRange: [0, 1],
      vlines: [{ x: 0, color: 'rgba(255,180,84,0.45)', label: 'p = p_c' }],
      series,
    });

    setText('cross-total', total.toLocaleString());
    for (const size of [32, 64, 128]) {
      const b = atPc[size];
      if (!b.n) {
        setText(`cross-pi${size}`, '—');
        continue;
      }
      const ci = wilsonInterval(b.hits, b.n);
      setText(`cross-pi${size}`, `${fmt(ci.p, 3)} ± ${fmt(ci.half, 3)} · ${b.n}`);
    }
  }

  nuInput.addEventListener('input', () => {
    nu = parseFloat(nuInput.value);
    document.getElementById('cross-nu-val').textContent = nu.toFixed(3);
    draw();
    publishRun();
  });

  const speed = document.getElementById('cross-speed');
  speed.addEventListener('input', () => {
    perTick = parseInt(speed.value, 10);
    document.getElementById('cross-speed-val').textContent = String(perTick);
  });

  root.querySelector('#cross-toggle').addEventListener('click', (e) => {
    running = !running;
    e.target.textContent = running ? t(lang, 'pause') : t(lang, 'resume');
  });

  root.querySelector('#cross-boost').addEventListener('click', () => addSamples(2000));

  root.querySelector('#cross-reset').addEventListener('click', () => {
    for (const size of LS) {
      for (const b of bins[size]) {
        b.hits = 0;
        b.n = 0;
      }
      atPc[size].hits = 0;
      atPc[size].n = 0;
    }
    total = 0;
    rng = new Rng(4242);
    draw();
    publishRun();
  });

  timer = setInterval(tick, 60);
  draw();
  publishRun();
  if (ctx.query?.recipe === 'collapse') running = true;

  const offTheme = onTheme(() => draw());
  return () => {
    offTheme();
    if (timer) clearInterval(timer);
  };
}
