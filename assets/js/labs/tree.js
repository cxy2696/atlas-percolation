import { bethePercolation, betheThreshold } from '../../../lib/js/index.js';
import { labHead, control, select, readout, panel, canvasBox, fmt, setText } from './ui.js';
import { drawPlot, PALETTE } from '../lib/plot.js';
import { palette, onTheme, withAlpha } from '../theme.js';

const LABELS = {
  en: {
    kicker: 'lab 14 · branching',
    title: 'Percolation on a Bethe tree',
    lead: 'A finite z-ary tree drawn edge by edge, and the exact infinite-tree curve beside it. Cyan edges are open and connected to the root; amber edges are open but cut off; grey edges are closed. The finite picture is a preview of the branching recursion, not a simulation of the infinite tree.',
    picture: 'Finite tree, depth 4',
    curve: 'θ(p) for the infinite tree',
    controls: 'Controls',
    degree: 'Degree z',
    p: 'Open probability p',
    resample: 'New draw',
    reading: 'Readout',
    pc: 'Exact p_c = 1/(z−1)',
    ratio: 'p / p_c',
    theta: 'θ(p)',
    u: 'u (finite branch)',
    chi: 'χ below p_c',
    status: 'Phase',
    sub: 'subcritical',
    crit: 'critical',
    super: 'supercritical',
    reach: 'P(root reaches depth 4)',
    note: 'The finite tree has z^4 leaves; the curve is the exact z-regular-tree solution θ = 1 − (1 − p + pu)^z with u = (1 − p + pu)^(z−1), selecting the smallest fixed point. A finite tree can never be “infinite”, so the readout is a depth-4 reach indicator, not θ.',
    depth: 'depth',
    cut: 'open, cut off',
    closed: 'closed',
  },
  zh: {
    kicker: '实验 14 · 分支',
    title: 'Bethe 树上的渗流',
    lead: '左边是一棵逐边绘制的有限 z 叉树，右边是精确的无限树曲线。青色边是打开且与根连通的边，琥珀色边是打开但被截断的边，灰色边是闭边。有限图只是分支递推的预览，不是无限树的模拟。',
    picture: '有限树，深度 4',
    curve: '无限树的 θ(p)',
    controls: '控制',
    degree: '度数 z',
    p: '开放概率 p',
    resample: '重新抽样',
    reading: '读数',
    pc: '精确 p_c = 1/(z−1)',
    ratio: 'p / p_c',
    theta: 'θ(p)',
    u: 'u（有限分支）',
    chi: 'p_c 以下的 χ',
    status: '相态',
    sub: '亚临界',
    crit: '临界',
    super: '超临界',
    reach: 'P(根触及深度 4)',
    note: '有限树有 z^4 个叶子；曲线是精确的 z 正则树解 θ = 1 − (1 − p + pu)^z，其中 u = (1 − p + pu)^(z−1)，取最小不动点。有限树永远不可能“无限”，所以读数只是深度 4 的可达指示，不是 θ。',
    depth: '深度',
    cut: '打开但被截断',
    closed: '闭边',
  },
  de: {
    kicker: 'Labor 14 · Verzweigung',
    title: 'Perkolation auf einem Bethe-Baum',
    lead: 'Links ein endlicher z-facher Baum, Kante für Kante gezeichnet, rechts die exakte Kurve des unendlichen Baums. Cyan sind offene, mit der Wurzel verbundene Kanten; bernsteinfarben offene, aber abgeschnittene; grau geschlossene. Das endliche Bild ist eine Vorschau der Verzweigungsrekursion, keine Simulation des unendlichen Baums.',
    picture: 'Endlicher Baum, Tiefe 4',
    curve: 'θ(p) für den unendlichen Baum',
    controls: 'Regler',
    degree: 'Grad z',
    p: 'Öffnungswahrscheinlichkeit p',
    resample: 'Neu zeichnen',
    reading: 'Anzeige',
    pc: 'Exakt p_c = 1/(z−1)',
    ratio: 'p / p_c',
    theta: 'θ(p)',
    u: 'u (endlicher Zweig)',
    chi: 'χ unterhalb p_c',
    status: 'Phase',
    sub: 'subkritisch',
    crit: 'kritisch',
    super: 'superkritisch',
    reach: 'P(Wurzel erreicht Tiefe 4)',
    note: 'Der endliche Baum hat z^4 Blätter; die Kurve ist die exakte Lösung des z-regulären Baums, θ = 1 − (1 − p + pu)^z mit u = (1 − p + pu)^(z−1), kleinster Fixpunkt. Ein endlicher Baum kann nie „unendlich“ sein; die Anzeige ist ein Erreichbarkeitsindikator bis Tiefe 4, nicht θ.',
    depth: 'Tiefe',
    cut: 'offen, abgeschnitten',
    closed: 'geschlossen',
  },
};

const DEPTH = 4;

function hash01(a, b, salt) {
  let h = (a * 374761393 + b * 668265263 + salt * 2246822519) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export function mount(root, ctx) {
  const { lang } = ctx;
  const L = LABELS[lang] || LABELS.en;
  root.innerHTML =
    labHead({ kicker: L.kicker, title: L.title, lead: L.lead, lang, guide: 'tree' }) +
    `<div class="grid-lab">
      <div>
        ${canvasBox('tree-canvas', [L.picture, 'BETHE / z-ARY', '', ''])}
        <div class="legend" style="margin:10px 0 14px">
          <span><i data-theme-color="cyan"></i>${L.theta}</span>
          <span><i data-theme-color="amber"></i>${L.cut}</span>
          <span><i data-theme-color="closed"></i>${L.closed}</span>
        </div>
        ${canvasBox('tree-plot', ['', '', '', ''])}
      </div>
      <aside class="panel">
        <h3>${L.controls}</h3>
        ${select({ id: 'tree-z', label: L.degree, value: '3', options: [2, 3, 4].map((z) => ({ value: String(z), label: 'z = ' + z })) })}
        ${control({ id: 'tree-p', label: L.p, min: 0, max: 1, step: 0.005, value: 0.5 })}
        <button class="btn" id="tree-resample" type="button" style="margin-top:10px">${L.resample}</button>
        <h3 style="margin-top:16px">${L.reading}</h3>
        ${readout('tree-pc', L.pc)}
        ${readout('tree-ratio', L.ratio)}
        ${readout('tree-theta', L.theta)}
        ${readout('tree-u', L.u)}
        ${readout('tree-chi', L.chi)}
        ${readout('tree-status', L.status)}
        ${readout('tree-reach', L.reach)}
        <p class="hint" style="margin-top:14px">${L.note}</p>
      </aside>
    </div>`;

  let salt = 1;
  const zsel = document.getElementById('tree-z');
  const psel = document.getElementById('tree-p');
  const pval = document.getElementById('tree-p-val');

  function current() {
    return { z: parseInt(zsel.value, 10), p: parseFloat(psel.value) };
  }

  function draw() {
    const { z, p } = current();
    pval.textContent = p.toFixed(3);
    drawTree(z, p);
    drawCurve(z, p);
    const r = bethePercolation(z, p);
    setText('tree-pc', fmt(r.pc, 6));
    setText('tree-ratio', fmt(p / r.pc, 3));
    setText('tree-theta', fmt(r.theta, 6));
    setText('tree-u', fmt(r.u, 6));
    setText('tree-chi', Number.isFinite(r.chi) ? fmt(r.chi, 4) : '∞');
    setText('tree-status', r.supercritical ? L.super : Math.abs(p - r.pc) <= 1e-12 ? L.crit : L.sub);
    setText('tree-reach', reachLabel(z, p));
  }

  function reachLabel(z, p) {
    // Probability that at least one open path of length DEPTH exists in the
    // complete z-ary tree.  Backward recursion: a vertex at depth DEPTH
    // reaches the bottom with probability 1; a vertex above it succeeds if
    // at least one of its z child edges is open and the child succeeds.
    let r = 1;
    for (let d = 0; d < DEPTH; d++) r = 1 - (1 - p * r) ** z;
    return fmt(r, 4);
  }

  function drawCurve(z, p) {
    const xs = [];
    const ys = [];
    for (let i = 0; i <= 200; i++) {
      const x = i / 200;
      xs.push(x);
      ys.push(bethePercolation(z, x).theta);
    }
    const pc = betheThreshold(z);
    drawPlot(document.getElementById('tree-plot'), {
      height: 250,
      xLabel: 'p',
      yLabel: 'θ',
      xRange: [0, 1],
      yRange: [0, 1],
      vlines: [{ x: pc, color: 'rgba(255,180,84,0.45)', label: 'p_c' }],
      series: [
        { x: xs, y: ys, color: PALETTE.cyan, width: 1.8 },
        { x: [p], y: [bethePercolation(z, p).theta], color: PALETTE.red, points: 4 },
      ],
    });
  }

  function drawTree(z, p) {
    const canvas = document.getElementById('tree-canvas');
    const wrap = canvas.parentElement;
    const W = Math.max(300, wrap.clientWidth - 2);
    const H = 330;
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

    // Lay out a complete z-ary tree of depth DEPTH using leaf slots.
    const nodes = [];
    const edges = [];
    let leaf = 0;
    const build = (id, d, parent) => {
      const node = { id, d, parent, x: 0, y: 0, children: [] };
      nodes.push(node);
      if (parent !== null) edges.push({ from: parent, to: id });
      if (d === DEPTH) {
        node.x = leaf++;
      } else {
        for (let c = 0; c < z; c++) node.children.push(build(nodes.length, d + 1, id));
        node.x = node.children.reduce((s, c) => s + c.x, 0) / node.children.length;
      }
      return node;
    };
    build(0, 0, null);
    const leaves = Math.max(1, leaf);
    const padX = 22;
    const usable = W - 2 * padX;
    for (const n of nodes) {
      n.px = padX + (leaves === 1 ? usable / 2 : (n.x / (leaves - 1)) * usable);
      n.py = 26 + (n.d / DEPTH) * (H - 62);
    }

    // Open status and connectivity to the root.
    const open = new Map();
    for (const e of edges) {
      open.set(e.to, hash01(e.from, e.to, salt) < p);
    }
    const reached = new Set([0]);
    for (const e of edges) {
      if (open.get(e.to) && reached.has(e.from)) reached.add(e.to);
    }

    // Edges first.
    for (const e of edges) {
      const a = nodes[e.from];
      const b = nodes[e.to];
      const isOpen = open.get(e.to);
      const connected = isOpen && reached.has(e.to) && reached.has(e.from);
      g.strokeStyle = connected ? withAlpha(C.cyan, 0.85) : isOpen ? withAlpha(C.amber, 0.65) : withAlpha(C.closed, 0.55);
      g.lineWidth = connected ? 1.6 : 1;
      g.beginPath();
      g.moveTo(a.px, a.py);
      g.lineTo(b.px, b.py);
      g.stroke();
    }

    for (const n of nodes) {
      const connected = reached.has(n.id);
      g.fillStyle = connected ? C.cyan : withAlpha(C.dim, 0.55);
      g.beginPath();
      g.arc(n.px, n.py, n.d === 0 ? 4 : 2.2, 0, Math.PI * 2);
      g.fill();
    }

    g.fillStyle = C.dim;
    g.font = '9px SFMono-Regular, Menlo, Consolas, monospace';
    g.textAlign = 'left';
    g.fillText(`z = ${z}   p = ${p.toFixed(3)}   depth = ${DEPTH}`, 10, H - 12);
    g.textAlign = 'right';
    g.fillText(`${reachLabel(z, p)} reach`, W - 10, H - 12);
  }

  zsel.addEventListener('change', draw);
  psel.addEventListener('input', draw);
  document.getElementById('tree-resample').addEventListener('click', () => {
    salt = (salt * 1664525 + 1013904223) >>> 0;
    draw();
  });
  const onResize = () => draw();
  window.addEventListener('resize', onResize);
  const offTheme = onTheme(() => draw());
  draw();
  return () => {
    offTheme();
    window.removeEventListener('resize', onResize);
  };
}
