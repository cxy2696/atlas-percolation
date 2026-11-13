import { Rng, poissonPmf, sirFinalSize } from '../../../lib/js/index.js';
import { labHead, control, readout, canvasBox, fmt, setText } from './ui.js';
import { drawPlot, PALETTE } from '../lib/plot.js';
import { palette, onTheme, withAlpha } from '../theme.js';

const LABELS = {
  en: {
    kicker: 'lab 15 · epidemics',
    title: 'SIR as percolation',
    lead: 'The final size of an SIR epidemic is the giant component of the contact network after each edge is kept with the transmissibility T. The curve is the exact Poisson configuration-model solution; the bars are 3,000 branching-process outbreaks at the current effective reproduction number. The branching process is an illustration of the mean-field limit, not a contact-network simulation.',
    curve: 'Final size vs R₀',
    hist: 'Outbreak sizes at R_eff',
    controls: 'Controls',
    mean: 'Mean degree c',
    T: 'Transmissibility T',
    v: 'Vaccinated fraction v',
    e: 'Vaccine efficacy e',
    resample: 'Resample outbreaks',
    reading: 'Readout',
    r0: 'R₀ = cT',
    reff: 'R_eff = (1 − ve)R₀',
    size: 'Final size R∞',
    herd: 'Herd immunity 1 − 1/R₀',
    need: 'Coverage needed (1 − 1/R₀)/e',
    large: 'P(outbreak ≥ 100)',
    meanSize: 'Mean outbreak size',
    note: 'Assumptions: static Poisson contact network, independent transmission per edge, no depletion of susceptibles during the infectious period beyond the percolation limit. Vaccination is random and reduces the effective branching factor by (1 − ve). The histogram uses a branching process with Poisson(R_eff) offspring and a size cap of 800; it is a teaching illustration, not an epidemiological forecast.',
    sub: 'Outbreaks are bimodal near R_eff = 1: most die out, a few reach a finite fraction. The bars are on a log size axis, so a tall left bar is not the whole story.',
  },
  zh: {
    kicker: '实验 15 · 流行病',
    title: 'SIR 即渗流',
    lead: 'SIR 流行的最终规模，等于接触网络在每条边以传播概率 T 保留后的巨分量。曲线是 Poisson 配置模型的精确解；柱状图是当前有效再生数下 3,000 次分支过程暴发的规模分布。分支过程只是平均场极限的图示，不是接触网络模拟。',
    curve: '最终规模随 R₀ 变化',
    hist: 'R_eff 下的暴发规模',
    controls: '控制',
    mean: '平均度 c',
    T: '传播概率 T',
    v: '接种比例 v',
    e: '疫苗效力 e',
    resample: '重新抽样暴发',
    reading: '读数',
    r0: 'R₀ = cT',
    reff: 'R_eff = (1 − ve)R₀',
    size: '最终规模 R∞',
    herd: '群体免疫 1 − 1/R₀',
    need: '所需覆盖率 (1 − 1/R₀)/e',
    large: 'P(暴发 ≥ 100)',
    meanSize: '平均暴发规模',
    note: '假设：静态 Poisson 接触网络、每条边独立传播、感染期内除渗流极限外不耗尽易感者。接种为随机接种，把有效分支因子乘以 (1 − ve)。柱状图使用后代为 Poisson(R_eff) 的分支过程，规模上限 800；它是教学图示，不是流行病学预测。',
    sub: 'R_eff ≈ 1 附近暴发规模是双峰的：大多数熄灭，少数达到有限比例。柱状图用对数规模轴，左侧高柱并不是全部故事。',
  },
  de: {
    kicker: 'Labor 15 · Epidemien',
    title: 'SIR als Perkolation',
    lead: 'Die Endgröße einer SIR-Epidemie ist die Riesenkomponente des Kontaktnetzwerks, nachdem jede Kante mit der Übertragbarkeit T behalten wurde. Die Kurve ist die exakte Lösung des Poisson-Konfigurationsmodells; die Balken sind 3.000 Ausbrüche eines Verzweigungsprozesses bei der aktuellen effektiven Reproduktionszahl. Der Verzweigungsprozess illustriert den Mean-Field-Grenzfall, nicht eine Kontaktnetzwerk-Simulation.',
    curve: 'Endgröße gegen R₀',
    hist: 'Ausbruchsgrößen bei R_eff',
    controls: 'Regler',
    mean: 'Mittlerer Grad c',
    T: 'Übertragbarkeit T',
    v: 'Geimpfter Anteil v',
    e: 'Impfstoffwirksamkeit e',
    resample: 'Ausbrüche neu ziehen',
    reading: 'Anzeige',
    r0: 'R₀ = cT',
    reff: 'R_eff = (1 − ve)R₀',
    size: 'Endgröße R∞',
    herd: 'Herdenimmunität 1 − 1/R₀',
    need: 'Nötige Abdeckung (1 − 1/R₀)/e',
    large: 'P(Ausbruch ≥ 100)',
    meanSize: 'Mittlere Ausbruchsgröße',
    note: 'Annahmen: statisches Poisson-Kontaktnetz, unabhängige Übertragung pro Kante, keine Erschöpfung der Empfänglichen während der Infektionsperiode über den Perkolationslimes hinaus. Die Impfung ist zufällig und multipliziert den effektiven Verzweigungsfaktor mit (1 − ve). Das Histogramm nutzt einen Verzweigungsprozess mit Poisson(R_eff)-Nachkommen und einer Obergrenze von 800; es ist eine Lehrdarstellung, keine epidemiologische Prognose.',
    sub: 'In der Nähe von R_eff = 1 sind die Ausbruchsgrößen bimodal: Die meisten sterben aus, wenige erreichen einen endlichen Anteil. Die Balken stehen auf einer logarithmischen Größenachse; ein hoher linker Balken ist nicht die ganze Geschichte.',
  },
};

const CAP = 800;
const TRIALS = 3000;

function poisson(rng, mean) {
  // Knuth for mean <= 30; the laboratory keeps R_eff <= 10.
  const limit = Math.exp(-mean);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= rng.random();
  } while (p > limit);
  return k - 1;
}

function simulateOutbreak(rng, R) {
  let total = 0;
  let current = 1; // the initial case
  while (current > 0 && total < CAP) {
    total += current;
    if (total >= CAP) return CAP;
    let next = 0;
    for (let i = 0; i < current; i++) {
      next += poisson(rng, R);
      if (next >= CAP) { next = CAP; break; }
    }
    current = next;
  }
  return Math.min(CAP, total);
}

export function mount(root, ctx) {
  const { lang } = ctx;
  const L = LABELS[lang] || LABELS.en;
  root.innerHTML =
    labHead({ kicker: L.kicker, title: L.title, lead: L.lead, lang, guide: 'epidemic' }) +
    `<div class="grid-lab">
      <div>
        ${canvasBox('epi-curve', ['', '', '', ''])}
        <div style="height:12px"></div>
        ${canvasBox('epi-hist', ['', '', '', ''])}
      </div>
      <aside class="panel">
        <h3>${L.controls}</h3>
        ${control({ id: 'epi-c', label: L.mean, min: 2, max: 10, step: 1, value: 4 })}
        ${control({ id: 'epi-T', label: L.T, min: 0, max: 1, step: 0.01, value: 0.5 })}
        ${control({ id: 'epi-v', label: L.v, min: 0, max: 0.95, step: 0.01, value: 0 })}
        ${control({ id: 'epi-e', label: L.e, min: 0.5, max: 1, step: 0.01, value: 0.9 })}
        <button class="btn" id="epi-resample" type="button" style="margin-top:10px">${L.resample}</button>
        <h3 style="margin-top:16px">${L.reading}</h3>
        ${readout('epi-r0', L.r0)}
        ${readout('epi-reff', L.reff)}
        ${readout('epi-size', L.size)}
        ${readout('epi-herd', L.herd)}
        ${readout('epi-need', L.need)}
        ${readout('epi-large', L.large)}
        ${readout('epi-mean', L.meanSize)}
        <p class="hint" style="margin-top:14px">${L.sub}</p>
        <p class="hint" style="margin-top:10px">${L.note}</p>
      </aside>
    </div>`;

  const csel = document.getElementById('epi-c');
  const tsel = document.getElementById('epi-T');
  const vsel = document.getElementById('epi-v');
  const esel = document.getElementById('epi-e');
  const ids = ['epi-c', 'epi-T', 'epi-v', 'epi-e'];
  for (const id of ids) {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
      document.getElementById(`${id}-val`).textContent = parseFloat(el.value).toFixed(id === 'epi-c' ? 0 : 2);
      drawAnalytic();
      scheduleHist();
    });
  }

  let seed = 1;
  let timer = null;
  function scheduleHist() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => drawHist(), 180);
  }

  function state() {
    const c = parseFloat(csel.value);
    const T = parseFloat(tsel.value);
    const v = parseFloat(vsel.value);
    const e = parseFloat(esel.value);
    const R0 = c * T;
    const Teff = T * (1 - v * e);
    const Reff = c * Teff;
    return { c, T, v, e, R0, Teff, Reff };
  }

  function drawAnalytic() {
    const { c, R0, Reff, v, e, Teff } = state();
    const pmf = poissonPmf(c);
    const s = sirFinalSize(pmf, Teff);
    const xs = [];
    const ys = [];
    for (let i = 0; i <= 240; i++) {
      const r = (i / 240) * c;
      xs.push(r);
      ys.push(sirFinalSize(pmf, Math.min(1, r / c)).finalSize);
    }
    drawPlot(document.getElementById('epi-curve'), {
      height: 250,
      xLabel: 'R₀ = cT (effective)',
      yLabel: 'R∞',
      xRange: [0, c],
      yRange: [0, 1],
      vlines: [{ x: 1, color: 'rgba(255,180,84,0.45)', label: 'R = 1' }],
      series: [
        { x: xs, y: ys, color: PALETTE.cyan, width: 1.8 },
        { x: [Reff], y: [s.finalSize], color: PALETTE.red, points: 4 },
      ],
    });
    const herd = R0 > 1 ? 1 - 1 / R0 : 0;
    setText('epi-r0', fmt(R0, 3));
    setText('epi-reff', fmt(Reff, 3));
    setText('epi-size', fmt(s.finalSize, 4));
    setText('epi-herd', R0 > 1 ? fmt(herd, 3) : '—');
    setText('epi-need', R0 > 1 ? fmt(herd / e, 3) : '—');
  }

  function drawHist() {
    const { Reff } = state();
    const rng = new Rng(seed);
    const sizes = new Uint32Array(TRIALS);
    let large = 0;
    let sum = 0;
    for (let i = 0; i < TRIALS; i++) {
      const s = simulateOutbreak(rng, Reff);
      sizes[i] = s;
      sum += s;
      if (s >= 100) large++;
    }
    const bins = 26;
    const logMax = Math.log10(CAP);
    const counts = new Float64Array(bins);
    for (let i = 0; i < TRIALS; i++) {
      const b = Math.min(bins - 1, Math.floor((Math.log10(Math.max(1, sizes[i])) / logMax) * bins));
      counts[b]++;
    }
    setText('epi-large', fmt(large / TRIALS, 4));
    setText('epi-mean', fmt(sum / TRIALS, 2));

    const canvas = document.getElementById('epi-hist');
    const wrap = canvas.parentElement;
    const W = Math.max(300, wrap.clientWidth - 2);
    const H = 220;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    const C = palette();
    const g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = C.bg;
    g.fillRect(0, 0, W, H);
    const m = { l: 46, r: 12, t: 28, b: 34 };
    const plotW = W - m.l - m.r;
    const plotH = H - m.t - m.b;
    const maxCount = Math.max(1, ...counts);
    g.fillStyle = C.ink;
    g.font = '9px SFMono-Regular, Menlo, Consolas, monospace';
    g.textAlign = 'left';
    g.textBaseline = 'top';
    g.fillText(L.hist, m.l, 6);
    g.textBaseline = 'alphabetic';
    for (let b = 0; b < bins; b++) {
      const x0 = m.l + (b / bins) * plotW;
      const bw = plotW / bins;
      const h = (counts[b] / maxCount) * plotH;
      const center = Math.pow(10, ((b + 0.5) / bins) * logMax);
      g.fillStyle = center >= 100 ? withAlpha(C.amber, 0.75) : withAlpha(C.cyan, 0.6);
      g.fillRect(x0 + 1, m.t + plotH - h, Math.max(1, bw - 2), h);
    }
    g.strokeStyle = C.grid;
    g.strokeRect(m.l + 0.5, m.t + 0.5, plotW, plotH);
    g.fillStyle = C.dim;
    g.font = '9px SFMono-Regular, Menlo, Consolas, monospace';
    g.textAlign = 'center';
    for (const v of [1, 10, 100, CAP]) {
      const x = m.l + (Math.log10(v) / logMax) * plotW;
      g.fillText(String(v), x, H - 16);
    }
    g.textAlign = 'center';
    g.fillText('outbreak size (log scale)', m.l + plotW / 2, H - 4);
    g.textAlign = 'left';
    g.fillStyle = C.cyan;
    g.fillText(`R_eff = ${Reff.toFixed(2)}`, m.l + 4, m.t + 10);
  }

  document.getElementById('epi-resample').addEventListener('click', () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    drawHist();
  });
  const onResize = () => {
    drawAnalytic();
    drawHist();
  };
  window.addEventListener('resize', onResize);
  const offTheme = onTheme(() => {
    drawAnalytic();
    drawHist();
  });
  drawAnalytic();
  drawHist();
  return () => {
    if (timer) clearTimeout(timer);
    offTheme();
    window.removeEventListener('resize', onResize);
  };
}
