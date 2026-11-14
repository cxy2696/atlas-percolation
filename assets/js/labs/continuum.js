import { Rng, booleanModel } from '../../../lib/js/index.js';
import { labHead, panel, canvasBox, readout, fmt, setText } from './ui.js';
import { drawPlot, PALETTE } from '../lib/plot.js';
import { t } from '../i18n.js';
import { palette, onTheme, withAlpha } from '../theme.js';

const LABELS = {
  en: {
    kicker: 'lab 13 · continuum',
    title: 'Boolean model',
    lead: 'Poisson points, hard disks, overlap means connected. The control parameter is the reduced density λ = nπr². Coverage is the smooth curve 1 − e^(−λ); connectivity is a genuine threshold near λ_c ≈ 1.128. At that density only about 68% of the square is covered, and a disk deployment can cover a large area without forming a spanning cluster.',
    field: 'Disk configuration',
    sweep: 'Largest component vs λ',
    lambda: 'λ = n π r²',
    lambdaC: 'λ_c (literature)',
    smax: 'S_max',
    status: 'Percolating',
    coverage: 'Covered area fraction',
    note: 'N = 1200. λ_c is the literature onset for the infinite Poisson–Boolean model; a finite square percolates slightly above it. The sweep shows S_max, not coverage.',
    radius: 'Disk radius r',
    n: 'Points n',
  },
  zh: {
    kicker: '实验 06 · 连续空间',
    title: '布尔模型',
    lead: 'Poisson 点、硬圆盘，相交即连通。控制量是约化密度 λ = nπr²。覆盖率是 1 − e^(−λ) 这条光滑曲线；连通性才是真正的阈值，约在 λ_c ≈ 1.128。此时方格只有约 68% 被覆盖，因此大面积覆盖并不等于存在贯通团簇。',
    field: '圆盘构型',
    sweep: '最大分量随 λ',
    lambda: 'λ = n π r²',
    lambdaC: 'λ_c（文献）',
    smax: 'S_max',
    status: '是否渗流',
    coverage: '覆盖面积分数',
    note: 'N = 1200。λ_c 是无限 Poisson–布尔模型的文献阈值；有限方格会略高于它。扫描画的是 S_max，不是覆盖率。',
    radius: '圆盘半径 r',
    n: '点数 n',
  },
  de: {
    kicker: 'Labor 06 · Kontinuum',
    title: 'Boolesches Modell',
    lead: 'Poisson-Punkte, harte Scheiben, Überlappung heißt verbunden. Der Kontrollparameter ist die reduzierte Dichte λ = nπr². Die Überdeckung ist die glatte Kurve 1 − e^(−λ); Konnektivität ist eine echte Schwelle bei λ_c ≈ 1.128. Dort sind nur etwa 68% der Fläche bedeckt — große Überdeckung bedeutet also nicht automatisch einen durchgehenden Cluster.',
    field: 'Scheibenkonfiguration',
    sweep: 'Größte Komponente über λ',
    lambda: 'λ = n π r²',
    lambdaC: 'λ_c (Literatur)',
    smax: 'S_max',
    status: 'Perkolierend',
    coverage: 'Überdeckter Flächenanteil',
    note: 'N = 1200. λ_c ist der Literaturwert für das unendliche Poisson-Boolesche Modell; ein endliches Quadrat perkoliert erst etwas darüber. Der Sweep zeigt S_max, nicht die Überdeckung.',
    radius: 'Scheibenradius r',
    n: 'Punkte n',
  },
};

const N = 1200;
const LAMBDA_C = 1.128;

function spanningFraction(model) {
  const { dsu, x, y, n, r } = model;
  const touch = new Map();
  for (let v = 0; v < n; v++) {
    const rt = dsu.find(v);
    let rec = touch.get(rt);
    if (!rec) {
      rec = { left: false, right: false, top: false, bottom: false, size: 0 };
      touch.set(rt, rec);
    }
    rec.size++;
    if (x[v] <= r) rec.left = true;
    if (x[v] >= 1 - r) rec.right = true;
    if (y[v] <= r) rec.top = true;
    if (y[v] >= 1 - r) rec.bottom = true;
  }
  let best = 0;
  for (const rec of touch.values()) {
    if ((rec.left && rec.right) || (rec.top && rec.bottom)) best = Math.max(best, rec.size);
  }
  return best / n;
}

export function mount(root, ctx) {
  const { lang } = ctx;
  const L = LABELS[lang] || LABELS.en;
  root.innerHTML =
    labHead({ kicker: L.kicker, title: L.title, lead: L.lead, lang , guide: 'continuum' }) +
    `<div class="grid-lab">
      <div>
        ${canvasBox('cont-field', ['BOOLEAN', 'GRID SEARCH', 'λ', ''])}
        <div style="height:12px"></div>
        ${canvasBox('cont-sweep', ['S_max(λ)', 'FINITE SIZE', 'λ', 'n = 1200'])}
        <div class="grid-2" style="margin-top:12px">
          ${panel(L.field, '')}
        </div>
      </div>
      <aside class="panel">
        <h3>CONTINUUM</h3>
        ${readout('cont-lambda', L.lambda)}
        ${readout('cont-lc', L.lambdaC)}
        ${readout('cont-smax', L.smax)}
        ${readout('cont-status', L.status)}
        ${readout('cont-cov', L.coverage)}
        <div class="control" style="margin-top:14px">
          <label><span>${L.radius}</span><b id="cont-r-val">0.030</b></label>
          <input id="cont-r" type="range" min="0.008" max="0.070" step="0.001" value="0.03" />
        </div>
        <p class="hint" style="margin-top:14px">${L.note}</p>
      </aside>
    </div>`;

  const rng = new Rng(6161);
  let model = null;
  let sweep = [];

  function computeSweep() {
    sweep = [];
    const rngSweep = new Rng(271);
    for (let k = 0; k <= 18; k++) {
      const lambda = 0.3 + (2.0 * k) / 18;
      const r = Math.sqrt(lambda / (N * Math.PI));
      let sum = 0;
      const reps = 3;
      for (let i = 0; i < reps; i++) {
        const m = booleanModel(N, r, rngSweep);
        sum += m.largestFraction;
      }
      sweep.push({ lambda, s: sum / reps });
    }
  }

  function drawField() {
    const C = palette();
    const canvas = document.getElementById('cont-field');
    const wrap = canvas.parentElement;
    const W = Math.max(300, wrap.clientWidth - 2);
    const H = W;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    const g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = C.bg;
    g.fillRect(0, 0, W, H);
    if (!model) return;
    const { x, y, dsu, n, r } = model;
    const sizeOf = new Map();
    for (let v = 0; v < n; v++) {
      const rt = dsu.find(v);
      sizeOf.set(rt, (sizeOf.get(rt) || 0) + 1);
    }
    const maxS = Math.max(...sizeOf.values());
    for (let v = 0; v < n; v++) {
      const rt = dsu.find(v);
      const s = sizeOf.get(rt);
      const big = s === maxS;
      g.beginPath();
      g.arc(x[v] * W, y[v] * H, r * W, 0, Math.PI * 2);
      g.fillStyle = big ? withAlpha(C.cyan, 0.28) : s > maxS * 0.3 ? withAlpha(C.amber, 0.18) : withAlpha(C.cyanDim, 0.10);
      g.fill();
      g.strokeStyle = big ? withAlpha(C.cyan, 0.75) : withAlpha(C.cyanDim, 0.3);
      g.lineWidth = 0.6;
      g.stroke();
    }
    for (let v = 0; v < n; v++) {
      g.fillStyle = C.ink;
      g.fillRect(x[v] * W - 0.8, y[v] * H - 0.8, 1.6, 1.6);
    }
  }

  function drawSweep() {
    drawPlot(document.getElementById('cont-sweep'), {
      height: 220,
      xLabel: 'λ',
      yLabel: 'S_max',
      xRange: [0.3, 2.3],
      yRange: [0, 1],
      vlines: [{ x: LAMBDA_C, color: 'rgba(255,180,84,0.5)', label: 'λ_c = 1.128' }],
      series: [{ x: sweep.map((q) => q.lambda), y: sweep.map((q) => q.s), color: PALETTE.cyan, points: 2 }],
    });
  }

  function update() {
    const r = parseFloat(document.getElementById('cont-r').value);
    model = booleanModel(N, r, rng);
    const lambda = N * Math.PI * r * r;
    const span = spanningFraction(model);
    setText('cont-lambda', fmt(lambda, 3));
    setText('cont-smax', fmt(model.largestFraction, 3));
    setText('cont-status', span > 0 ? t(lang, 'yes') : t(lang, 'no'));
    const st = document.getElementById('cont-status');
    if (st) st.parentElement.className = `readout ${span > 0 ? 'ok' : ''}`;
    setText('cont-cov', fmt(model.coverage, 3));
    document.getElementById('cont-r-val').textContent = r.toFixed(3);
    drawField();
    drawSweep();
  }

  document.getElementById('cont-r').addEventListener('input', update);
  computeSweep();
  update();

  const onResize = () => {
    drawField();
    drawSweep();
  };
  window.addEventListener('resize', onResize);
  const offTheme = onTheme(() => { drawField(); drawSweep(); });
  return () => {
    offTheme();
    window.removeEventListener('resize', onResize);
  };
}
