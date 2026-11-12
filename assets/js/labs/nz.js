import { Rng, buildLattice, newmanZiff } from '../../../lib/js/index.js';
import { labHead, panel, canvasBox, readout, fmt, setText } from './ui.js';
import { drawPlot, PALETTE } from '../lib/plot.js';
import { t } from '../i18n.js';

const LABELS = {
  en: {
    kicker: 'lab 03 · one sweep, all p',
    title: 'Newman–Ziff incremental sweep',
    lead: 'A single random edge order produces the whole curve. Edges are added one at a time and the union-find records S_max and χ after every merge, so no configuration is ever thrown away. The vertical line is p_c = 1/2.',
    smax: 'S_max(p)',
    chi: 'χ(p)',
    p: 'Current p',
    smaxNow: 'S_max now',
    chiNow: 'χ now',
    clusters: 'Clusters',
    edges: 'Edges added',
    replay: 'Replay',
    note: 'S_max and χ are exact functions of the edge order: no resampling, no error bars other than the order itself.',
  },
  zh: {
    kicker: '实验 03 · 一次扫描给出全部 p',
    title: 'Newman–Ziff 增量扫描',
    lead: '一条随机边序给出整条曲线：逐条加边，并查集在每次合并后记录 S_max 与 χ，没有任何构型被浪费。竖线是 p_c = 1/2。',
    smax: 'S_max(p)',
    chi: 'χ(p)',
    p: '当前 p',
    smaxNow: '当前 S_max',
    chiNow: '当前 χ',
    clusters: '团簇数',
    edges: '已加边数',
    replay: '重放',
    note: 'S_max 与 χ 是边序的精确函数：不重采样，误差只来自边序本身。',
  },
  de: {
    kicker: 'Labor 03 · ein Sweep, alle p',
    title: 'Inkrementeller Newman–Ziff-Sweep',
    lead: 'Eine einzige zufällige Kantenreihenfolge erzeugt die ganze Kurve. Kanten werden einzeln hinzugefügt, die Union-Find-Struktur protokolliert S_max und χ nach jeder Verschmelzung. Die senkrechte Linie ist p_c = 1/2.',
    smax: 'S_max(p)',
    chi: 'χ(p)',
    p: 'Aktuelles p',
    smaxNow: 'S_max jetzt',
    chiNow: 'χ jetzt',
    clusters: 'Cluster',
    edges: 'Kanten',
    replay: 'Wiederholen',
    note: 'S_max und χ sind exakte Funktionen der Kantenreihenfolge: kein Resampling, keine Fehlerbalken außer der Reihenfolge selbst.',
  },
};

export function mount(root, ctx) {
  const { lang } = ctx;
  const L = LABELS[lang] || LABELS.en;
  root.innerHTML =
    labHead({ kicker: L.kicker, title: L.title, lead: L.lead, lang }) +
    `<div class="grid-lab">
      <div>
        ${canvasBox('nz-smax', ['S_max', 'NZ SWEEP', 'p', 'L = 256'])}
        <div style="height:12px"></div>
        ${canvasBox('nz-chi', ['χ', 'SECOND MOMENT', 'p', ''])}
        <div class="grid-2" style="margin-top:12px">
          ${panel(L.smax, '')}
        </div>
      </div>
      <aside class="panel">
        <h3>SWEEP</h3>
        ${readout('nz-p', L.p)}
        ${readout('nz-smax', L.smaxNow)}
        ${readout('nz-chi', L.chiNow)}
        ${readout('nz-cl', L.clusters)}
        ${readout('nz-edges', L.edges)}
        <div class="btn-row">
          <button class="btn primary" id="nz-replay">${L.replay}</button>
        </div>
        <p class="hint" style="margin-top:14px">${L.note}</p>
      </aside>
    </div>`;

  const lat = buildLattice('square', 256);
  const rng = new Rng(777);
  const data = newmanZiff(lat, rng, { checkpoints: 260 });
  let upto = 0;
  let timer = null;

  function draw() {
    const n = Math.max(2, upto);
    drawPlot(document.getElementById('nz-smax'), {
      height: 220,
      xLabel: 'p',
      yLabel: 'S_max / N',
      xRange: [0, 1],
      yRange: [0, 1],
      vlines: [{ x: 0.5, color: 'rgba(255,180,84,0.45)', label: 'p_c' }],
      series: [
        {
          x: Array.from(data.p).slice(0, n),
          y: Array.from(data.smax).slice(0, n).map((v) => v / lat.n),
          color: PALETTE.cyan,
        },
        ...(upto > 1
          ? [{
              x: [data.p[n - 1]],
              y: [data.smax[n - 1] / lat.n],
              color: PALETTE.amber,
              points: 4,
            }]
          : []),
      ],
    });
    const chi = Array.from(data.chi2).slice(0, n);
    const maxChi = Math.max(...Array.from(data.chi2));
    drawPlot(document.getElementById('nz-chi'), {
      height: 200,
      xLabel: 'p',
      yLabel: 'χ / χ_max',
      xRange: [0, 1],
      yRange: [0, 1],
      vlines: [{ x: 0.5, color: 'rgba(255,180,84,0.45)', label: 'p_c' }],
      series: [{ x: Array.from(data.p).slice(0, n), y: chi.map((v) => v / maxChi), color: PALETTE.violet }],
    });
    const i = upto - 1;
    setText('nz-p', i >= 0 ? fmt(data.p[i], 4) : '—');
    setText('nz-smax', i >= 0 ? `${fmt(data.smax[i] / lat.n, 4)}` : '—');
    setText('nz-chi', i >= 0 ? fmt(data.chi2[i], 2) : '—');
    setText('nz-cl', i >= 0 ? String(Math.round(data.nclusters[i])) : '—');
    setText('nz-edges', i >= 0 ? `${Math.round(data.p[i] * lat.m).toLocaleString()} / ${lat.m.toLocaleString()}` : '—');
  }

  function replay() {
    if (timer) clearInterval(timer);
    upto = 0;
    timer = setInterval(() => {
      upto += 2;
      if (upto >= data.p.length) {
        upto = data.p.length;
        clearInterval(timer);
        timer = null;
      }
      draw();
    }, 24);
  }

  root.querySelector('#nz-replay').addEventListener('click', replay);
  replay();

  return () => {
    if (timer) clearInterval(timer);
  };
}
