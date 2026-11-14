import { explosiveRandomGraph, randomGraphSweep } from '../../../lib/js/index.js';
import { labHead, select, readout, panel, canvasBox, fmt, setText, control } from './ui.js';
import { drawPlot } from '../lib/plot.js';
import { palette, onTheme } from '../theme.js';

const LABELS = {
  en: {
    kicker: 'lab 09 · two choices',
    title: 'Explosive percolation',
    lead: 'At every step two candidate edges are drawn; the product rule keeps the one whose endpoint components have the smaller size product. The giant component is delayed and then appears in a sharp step. Compare it with ordinary random addition at the same number of edges.',
    curve: 'S_max(q): two-choice vs random',
    jump: 'Largest one-step jump',
    qc: 'q at S_max = 1/2',
    qcRandom: 'random q at 1/2',
    maxJump: 'largest jump',
    jumpAt: 'jump at q',
    final: 'final S_max',
    scaling: 'Finite-size check',
    scalingHint: 'If the jump shrinks as n grows, it is a finite-size effect. The thermodynamic limit of the product rule is continuous.',
    run: 'Run process',
    compare: 'Scaling check',
    rule: 'Selection rule',
    product: 'product (Achlioptas)',
    sum: 'sum',
    size: 'Vertices n',
    seed: 'Seed',
    controls: 'Controls',
    note: 'Each step samples two unordered pairs uniformly. Duplicate edges count as additions but do not merge components. The random baseline adds one uniformly sampled pair per step.',
    n: 'n',
    jumpCol: 'max jump',
    qCol: 'q at jump',
  },
  zh: {
    kicker: '实验 11 · 两个选择',
    title: '爆炸渗流',
    lead: '每一步抽两条候选边；乘积规则保留两端分量大小乘积较小的那条。巨分量被推迟，然后以陡峭的一步出现。把它与相同加边数下的普通随机加边比较。',
    curve: 'S_max(q)：双选择与随机',
    jump: '最大单步跳变',
    qc: 'S_max = 1/2 处的 q',
    qcRandom: '随机过程 1/2 处的 q',
    maxJump: '最大跳变',
    jumpAt: '跳变位置 q',
    final: '最终 S_max',
    scaling: '有限尺度检验',
    scalingHint: '若跳变随 n 增大而缩小，它就是有限尺度效应。乘积规则在热力学极限下是连续的。',
    run: '运行过程',
    compare: '尺度检验',
    rule: '选择规则',
    product: '乘积（Achlioptas）',
    sum: '求和',
    size: '顶点数 n',
    seed: '种子',
    controls: '控制',
    note: '每步均匀抽两个无序点对。重复边计为一次加边，但不合并分量。随机基线每步加入一个均匀点对。',
    n: 'n',
    jumpCol: '最大跳变',
    qCol: '跳变处 q',
  },
  de: {
    kicker: 'Labor 11 · zwei Möglichkeiten',
    title: 'Explosive Perkolation',
    lead: 'In jedem Schritt werden zwei Kandidatenkanten gezogen; die Produktregel behält die mit dem kleineren Produkt der Komponentengrößen. Die Riesenkomponente wird verzögert und erscheint dann in einem scharfen Sprung. Vergleichen Sie mit gewöhnlicher zufälliger Zugabe bei gleicher Kantenzahl.',
    curve: 'S_max(q): Zwei-Wahl vs. zufällig',
    jump: 'Größter Ein-Schritt-Sprung',
    qc: 'q bei S_max = 1/2',
    qcRandom: 'zufälliges q bei 1/2',
    maxJump: 'größter Sprung',
    jumpAt: 'Sprung bei q',
    final: 'S_max am Ende',
    scaling: 'Endlichkeitsprüfung',
    scalingHint: 'Schrumpft der Sprung mit wachsendem n, ist er ein Endlichkeitseffekt. Der thermodynamische Limes der Produktregel ist stetig.',
    run: 'Prozess starten',
    compare: 'Skalenprüfung',
    rule: 'Auswahlregel',
    product: 'Produkt (Achlioptas)',
    sum: 'Summe',
    size: 'Knoten n',
    seed: 'Seed',
    controls: 'Regler',
    note: 'Jeder Schritt zieht zwei ungeordnete Paare uniform. Doppelte Kanten zählen als Zugabe, verschmelzen aber nichts. Die Zufallsbasis fügt pro Schritt ein uniformes Paar hinzu.',
    n: 'n',
    jumpCol: 'max. Sprung',
    qCol: 'q am Sprung',
  },
};

const HELP = {
  en: { rule: 'Product delays the giant component more strongly than sum.', n: 'Larger n makes every finite-size jump smaller.', seed: 'Same seed, same candidate sequence and the same curve.' },
  zh: { rule: '乘积规则比求和规则更强地推迟巨分量。', n: 'n 越大，有限尺度跳变越小。', seed: '同一种子给出同一候选序列与同一条曲线。' },
  de: { rule: 'Produkt verzögert die Riesenkomponente stärker als Summe.', n: 'Größeres n macht jeden Endlichkeitssprung kleiner.', seed: 'Gleicher Seed, gleiche Kandidatenfolge, gleiche Kurve.' },
};

function qAtHalf(points) {
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    if (a.smax < 0.5 && b.smax >= 0.5) {
      const t = (0.5 - a.smax) / (b.smax - a.smax || 1);
      return a.q + t * (b.q - a.q);
    }
  }
  return null;
}

export function mount(root, ctx) {
  const { lang } = ctx;
  const L = LABELS[lang] || LABELS.en;
  const H = HELP[lang] || HELP.en;
  root.innerHTML =
    labHead({ kicker: L.kicker, title: L.title, lead: L.lead, lang, guide: 'explosive' }) +
    `<div class="grid-lab">
      <div>
        ${canvasBox('expl-curve', ['', '', '', ''])}
        <div class="grid-2" style="margin-top:12px">
          ${panel(L.jump, '<div class="plot-host" id="expl-jump"></div>')}
          ${panel(L.scaling, `<div id="expl-scaling"><p class="hud-note">${L.scalingHint}</p></div>`)}
        </div>
        <p class="explain">${L.note}</p>
      </div>
      <aside class="panel">
        <h3>${L.controls}</h3>
        ${select({ id: 'expl-rule', label: L.rule, value: 'product', options: [
          { value: 'product', label: L.product },
          { value: 'sum', label: L.sum },
        ], help: H.rule })}
        ${select({ id: 'expl-n', label: L.size, value: '2000', options: [
          { value: '1000', label: '1 000' },
          { value: '2000', label: '2 000' },
          { value: '4000', label: '4 000' },
        ], help: H.n })}
        ${control({ id: 'expl-seed', label: L.seed, min: 1, max: 9999, step: 1, value: 7, help: H.seed })}
        <div class="btn-row">
          <button class="btn primary" id="expl-run">${L.run}</button>
          <button class="btn" id="expl-check">${L.compare}</button>
        </div>
        ${readout('expl-qc', L.qc)}
        ${readout('expl-qcr', L.qcRandom)}
        ${readout('expl-maxjump', L.maxJump)}
        ${readout('expl-jumpat', L.jumpAt)}
        ${readout('expl-final', L.final)}
      </aside>
    </div>`;

  const state = { n: 2000, rule: 'product', seed: 7, ex: null, rnd: null, reveal: 0, timer: null };
  const canvas = root.querySelector('#expl-curve');

  function stop() {
    if (state.timer) clearInterval(state.timer);
    state.timer = null;
  }

  function run() {
    stop();
    const steps = 4 * state.n;
    const recordEvery = Math.max(1, Math.floor(steps / 420));
    state.ex = explosiveRandomGraph(state.n, { rule: state.rule, seed: state.seed, steps, recordEvery });
    state.rnd = randomGraphSweep(state.n, { seed: state.seed + 101, steps, recordEvery });
    state.reveal = 2;
    const total = state.ex.points.length;
    const qc = qAtHalf(state.ex.points);
    const qcr = qAtHalf(state.rnd.points);
    setText('expl-qc', qc === null ? '—' : fmt(qc, 3));
    setText('expl-qcr', qcr === null ? '—' : fmt(qcr, 3));
    setText('expl-maxjump', fmt(state.ex.maxJump, 3));
    setText('expl-jumpat', fmt(state.ex.jumpAt / state.n, 3));
    setText('expl-final', fmt(state.ex.points[total - 1].smax, 3));
    draw();
    state.timer = setInterval(() => {
      state.reveal = Math.min(total, state.reveal + 12);
      if (state.reveal >= total) stop();
      draw();
    }, 34);
  }

  function draw() {
    if (!state.ex) return;
    const C = palette();
    const wrap = canvas.parentElement;
    const W = Math.max(300, wrap.clientWidth - 2);
    const H = 330;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    const g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = C.bg;
    g.fillRect(0, 0, W, H);
    const total = state.ex.points.length;
    const upto = Math.max(2, state.reveal);
    const exPts = state.ex.points.slice(0, upto);
    const rndPts = state.rnd.points.slice(0, upto);
    drawPlot(canvas, {
      height: H,
      xRange: [0, Math.min(1.4, 4)],
      yRange: [0, 1],
      xLabel: 'q = candidate steps / n',
      yLabel: 'S_max',
      vlines: [{ x: Math.log(2), color: palette().faint, label: 'ln 2' }],
      series: [
        { x: rndPts.map((p) => p.q), y: rndPts.map((p) => p.smax), color: C.dim, width: 1.2, label: 'random' },
        { x: exPts.map((p) => p.q), y: exPts.map((p) => p.smax), color: C.cyan, width: 2, label: state.rule },
      ],
    });
    drawJump();
  }

  function drawJump() {
    const host = root.querySelector('#expl-jump');
    if (!host || !state.ex) return;
    let el = host.querySelector('canvas');
    if (!el) {
      el = document.createElement('canvas');
      host.appendChild(el);
    }
    const C = palette();
    const pts = state.ex.points;
    const deltas = [];
    for (let i = 1; i < Math.max(2, state.reveal); i++) {
      deltas.push({ q: pts[i].q, d: pts[i].smax - pts[i - 1].smax });
    }
    drawPlot(el, {
      height: 190,
      xRange: [0, 1.4],
      yRange: [0, Math.max(0.05, ...deltas.map((d) => d.d)) * 1.1],
      xLabel: 'q',
      yLabel: 'ΔS_max',
      series: [{ x: deltas.map((d) => d.q), y: deltas.map((d) => d.d), color: C.amber, width: 1 }],
    });
  }

  function scalingCheck() {
    const rows = [];
    for (const n of [500, 1000, 2000, 4000]) {
      const ex = explosiveRandomGraph(n, { rule: state.rule, seed: state.seed, steps: 4 * n, recordEvery: Math.max(1, Math.floor((4 * n) / 200)) });
      rows.push({ n, jump: ex.maxJump, q: ex.jumpAt / n, final: ex.points[ex.points.length - 1].smax });
    }
    const host = root.querySelector('#expl-scaling');
    host.innerHTML = `<table class="data-table">
      <thead><tr><th>${L.n}</th><th>${L.jumpCol}</th><th>${L.qCol}</th></tr></thead>
      <tbody>${rows.map((r) => `<tr><td>${r.n}</td><td class="num">${fmt(r.jump, 3)}</td><td class="num">${fmt(r.q, 3)}</td></tr>`).join('')}</tbody>
    </table><p class="hud-note" style="margin-top:8px">${L.scalingHint}</p>`;
  }

  root.querySelector('#expl-run').addEventListener('click', run);
  root.querySelector('#expl-check').addEventListener('click', scalingCheck);
  root.querySelector('#expl-rule').addEventListener('change', (e) => {
    state.rule = e.target.value;
    run();
  });
  root.querySelector('#expl-n').addEventListener('change', (e) => {
    state.n = parseInt(e.target.value, 10);
    root.querySelector('#expl-scaling').innerHTML = `<p class="hud-note">${L.scalingHint}</p>`;
    run();
  });
  const seedInput = root.querySelector('#expl-seed');
  seedInput.addEventListener('input', () => {
    state.seed = parseInt(seedInput.value, 10);
    root.querySelector('#expl-seed-val').textContent = String(state.seed);
  });
  seedInput.addEventListener('change', run);
  const onResize = () => draw();
  window.addEventListener('resize', onResize);
  const offTheme = onTheme(() => draw());
  run();
  return () => {
    stop();
    offTheme();
    window.removeEventListener('resize', onResize);
  };
}
