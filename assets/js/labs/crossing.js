import { Rng, buildLattice, Percolation } from '../../../lib/js/index.js';
import { labHead, panel, canvasBox, readout, fmt, setText, bindRange } from './ui.js';
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
    pi32: 'π at p_c, L=32',
    pi64: 'π at p_c, L=64',
    pi128: 'π at p_c, L=128',
    state: 'Acquisition',
  },
  zh: {
    kicker: '实验 02 · 有限尺度',
    title: '横穿概率与数据坍缩',
    lead: '同时采样三种尺寸。左：原始横穿曲线随 L 增大而变陡，且都经过 p_c 处的 1/2。右：把同一批数据画在标度变量 (p − p_c)L^(1/ν) 上（ν = 4/3），曲线重合，说明整个相变由一个指数组织。',
    raw: 'π(p) 随尺寸',
    collapse: '有限尺度坍缩',
    speed: '每帧样本数',
    samples: '样本数',
    pi32: 'p_c 处 π，L=32',
    pi64: 'p_c 处 π，L=64',
    pi128: 'p_c 处 π，L=128',
    state: '采集',
  },
  de: {
    kicker: 'Labor 02 · endliche Größe',
    title: 'Durchgangswahrscheinlichkeit und Kollaps',
    lead: 'Drei Gittergrößen werden gleichzeitig gezogen. Links: die Rohkurven werden mit wachsendem L steiler, laufen aber alle bei p_c durch 1/2. Rechts: dieselben Daten in der Skalenvariablen (p − p_c)L^(1/ν), ν = 4/3 — der Kollaps zeigt, dass ein einziger Exponent den Übergang organisiert.',
    raw: 'π(p) nach Gittergröße',
    collapse: 'Finite-Size-Kollaps',
    speed: 'Stichproben / Takt',
    samples: 'Stichproben',
    pi32: 'π bei p_c, L=32',
    pi64: 'π bei p_c, L=64',
    pi128: 'π bei p_c, L=128',
    state: 'Erfassung',
  },
};

const LS = [32, 64, 128];
const BINS = 25;
const P0 = 0.4;
const P1 = 0.6;

export function mount(root, ctx) {
  const { lang } = ctx;
  const L = LABELS[lang] || LABELS.en;
  root.innerHTML =
    labHead({ kicker: L.kicker, title: L.title, lead: L.lead, lang , guide: 'crossing' }) +
    `<div class="grid-lab">
      <div>
        ${canvasBox('cross-raw', ['π(p)', 'BOND · SQUARE', 'p', ''])}
        <div style="height:12px"></div>
        ${canvasBox('cross-collapse', ['COLLAPSE', 'ν = 4/3', '(p−p_c)L^{1/ν}', ''])}
        <div class="grid-2" style="margin-top:12px">
          ${panel(L.raw, '')}
        </div>
      </div>
      <aside class="panel">
        <h3>${L.state}</h3>
        ${readout('cross-total', L.samples)}
        ${readout('cross-pi32', L.pi32)}
        ${readout('cross-pi64', L.pi64)}
        ${readout('cross-pi128', L.pi128)}
        <div class="control" style="margin-top:16px">
          <label><span>${L.speed}</span><b id="cross-speed-val">8</b></label>
          <input id="cross-speed" type="range" min="1" max="24" step="1" value="8" />
        </div>
        <div class="btn-row">
          <button class="btn primary" id="cross-toggle">${t(lang, 'pause')}</button>
          <button class="btn" id="cross-reset">${t(lang, 'reset')}</button>
        </div>
        <p class="hint" style="margin-top:14px">${t(lang, 'engine_note')}</p>
      </aside>
    </div>`;

  const rng = new Rng(4242);
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
      }
    }
    frame++;
    if (frame % 3 === 0) draw();
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
        x: pts.map((b) => (b.p - 0.5) * Math.pow(size, 4 / 3)),
        y: pts.map((b) => b.hits / b.n),
        color: [PALETTE.cyan, PALETTE.amber, PALETTE.violet][i],
        label: `L=${size}`,
        points: 2,
      };
    });
    drawPlot(document.getElementById('cross-collapse'), {
      height: 240,
      xLabel: '(p − p_c) L^{1/ν}',
      yLabel: 'π',
      xRange: [-60, 60],
      yRange: [0, 1],
      vlines: [{ x: 0, color: 'rgba(255,180,84,0.45)', label: 'p = p_c' }],
      series,
    });

    setText('cross-total', total.toLocaleString());
    for (const size of [32, 64, 128]) {
      const b = nearestBin(size, 0.5);
      setText(`cross-pi${size}`, b.n ? `${fmt(b.hits / b.n, 4)}  (n=${b.n})` : '—');
    }
  }

  const speed = document.getElementById('cross-speed');
  speed.addEventListener('input', () => {
    perTick = parseInt(speed.value, 10);
    document.getElementById('cross-speed-val').textContent = String(perTick);
  });

  root.querySelector('#cross-toggle').addEventListener('click', (e) => {
    running = !running;
    e.target.textContent = running ? t(lang, 'pause') : t(lang, 'resume');
  });

  root.querySelector('#cross-reset').addEventListener('click', () => {
    for (const size of LS) {
      for (const b of bins[size]) {
        b.hits = 0;
        b.n = 0;
      }
    }
    total = 0;
    draw();
  });

  timer = setInterval(tick, 60);
  draw();

  const offTheme = onTheme(() => draw());
  return () => {
    offTheme();
    if (timer) clearInterval(timer);
  };
}
