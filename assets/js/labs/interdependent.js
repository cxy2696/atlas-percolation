import {
  Rng,
  poissonDegrees,
  configurationModel,
} from '../../../lib/js/index.js';
import { labHead, panel, canvasBox, readout, fmt, setText } from './ui.js';
import { drawPlot, PALETTE } from '../lib/plot.js';
import { t } from '../i18n.js';
import { palette, onTheme, withAlpha } from '../theme.js';

const LABELS = {
  en: {
    kicker: 'lab 05 · coupled networks',
    title: 'Cascade between two layers',
    lead: 'Two Erdős–Rényi layers with one-to-one coupling. Each round keeps only vertices that are in the giant component of both layers. The mutual component disappears by a saddle-node bifurcation at p_c = 2.4554/c, not by a continuous decay — the curve jumps.',
    layers: 'Layer A / layer B, surviving set',
    curve: 'Mutual giant component',
    pc: 'p_c = 2.4554 / c',
    steps: 'Cascade steps',
    mutual: 'Mutual component',
    p: 'Retained fraction p',
    c: 'Mean degree c',
    restart: 'Restart cascade',
    note: 'N = 4096 vertices per layer. Each round keeps the intersection of the two giant components; the measured curve uses the same engine as the libraries.',
  },
  zh: {
    kicker: '实验 05 · 耦合网络',
    title: '双层网络之间的级联',
    lead: '两个一一耦合的 Erdős–Rényi 层。每一轮只保留同时属于两层巨分量的顶点。相互巨分量在 p_c = 2.4554/c 处经鞍结分岔消失，而不是连续衰减——曲线是跳变的。',
    layers: 'A 层 / B 层，存活集合',
    curve: '相互巨分量',
    pc: 'p_c = 2.4554 / c',
    steps: '级联步数',
    mutual: '相互分量',
    p: '保留比例 p',
    c: '平均度 c',
    restart: '重新级联',
    note: '每层 4096 个顶点。每一轮保留两个巨分量的交集；实测曲线与四种语言库共用同一引擎。',
  },
  de: {
    kicker: 'Labor 05 · gekoppelte Netzwerke',
    title: 'Kaskade zwischen zwei Schichten',
    lead: 'Zwei Erdős–Rényi-Schichten, eins zu eins gekoppelt. Jede Runde behält nur Knoten, die in der Riesenkomponente beider Schichten liegen. Die gemeinsame Komponente verschwindet durch eine Sattel-Knoten-Bifurkation bei p_c = 2.4554/c, nicht kontinuierlich — die Kurve springt.',
    layers: 'Schicht A / Schicht B, Überlebende',
    curve: 'Gemeinsame Riesenkomponente',
    pc: 'p_c = 2.4554 / c',
    steps: 'Kaskadenschritte',
    mutual: 'Gemeinsame Komponente',
    p: 'Erhaltener Anteil p',
    c: 'Mittlerer Grad c',
    restart: 'Kaskade neu starten',
    note: 'N = 4096 Knoten pro Schicht. Jede Runde behält die Schnittmenge der beiden Riesenkomponenten; die Messkurve nutzt dieselbe Engine wie die Bibliotheken.',
  },
};

const SIDE = 64;

function giantMark(graph, active) {
  const { n, offset, adj } = graph;
  const seen = new Uint8Array(n);
  const queue = new Int32Array(n);
  let best = null;
  let bestSize = 0;
  for (let v = 0; v < n; v++) {
    if (!active[v] || seen[v]) continue;
    let head = 0;
    let tail = 0;
    queue[tail++] = v;
    seen[v] = 1;
    const members = [];
    while (head < tail) {
      const u = queue[head++];
      members.push(u);
      for (let e = offset[u]; e < offset[u + 1]; e++) {
        const w = adj[e];
        if (active[w] && !seen[w]) {
          seen[w] = 1;
          queue[tail++] = w;
        }
      }
    }
    if (members.length > bestSize) {
      bestSize = members.length;
      best = members;
    }
  }
  const out = new Uint8Array(n);
  if (best) for (const v of best) out[v] = 1;
  return out;
}

export function mount(root, ctx) {
  const { lang } = ctx;
  const L = LABELS[lang] || LABELS.en;
  root.innerHTML =
    labHead({ kicker: L.kicker, title: L.title, lead: L.lead, lang , guide: 'interdependent' }) +
    `<div class="grid-lab">
      <div>
        ${canvasBox('dep-layers', ['A', 'B', 'SADDLE-NODE', ''])}
        <div style="height:12px"></div>
        ${canvasBox('dep-curve', ['S(p)', 'coupled ER', 'p', ''])}
        <div class="grid-2" style="margin-top:12px">
          ${panel(L.layers, '')}
        </div>
      </div>
      <aside class="panel">
        <h3>COUPLED</h3>
        ${readout('dep-p-readout', L.p)}
        ${readout('dep-pc', L.pc)}
        ${readout('dep-s', L.mutual)}
        ${readout('dep-steps', L.steps)}
        <div class="control" style="margin-top:14px">
          <label><span>${L.c}</span><b id="dep-c-val">4.0</b></label>
          <select id="dep-c">
            <option value="3">3.0</option>
            <option value="4" selected>4.0</option>
            <option value="5">5.0</option>
          </select>
        </div>
        <div class="control">
          <label><span>${L.p}</span><b id="dep-p-slider-val">0.70</b></label>
          <input id="dep-p-slider" type="range" min="0.35" max="0.95" step="0.005" value="0.7" />
        </div>
        <div class="btn-row">
          <button class="btn primary" id="dep-restart">${L.restart}</button>
        </div>
        <p class="hint" style="margin-top:14px">${L.note}</p>
      </aside>
    </div>`;

  const N = SIDE * SIDE;
  const state = { c: 4, p: 0.7, snapshots: [], steps: 0, curve: [], pc: 2.45538 / 4 };
  const rng = new Rng(9091);
  let graphA = null;
  let graphB = null;
  let timer = null;

  function buildLayers() {
    const degA = poissonDegrees(N, state.c, rng);
    const degB = poissonDegrees(N, state.c, rng);
    graphA = configurationModel(degA, rng);
    graphB = configurationModel(degB, rng);
  }

  function cascade(p) {
    let surviving = new Uint8Array(N);
    for (let i = 0; i < N; i++) surviving[i] = rng.random() < p ? 1 : 0;
    const snaps = [{ a: surviving, b: surviving }];
    for (let it = 0; it < 100; it++) {
      const giantA = giantMark(graphA, surviving);
      const giantB = giantMark(graphB, surviving);
      const next = new Uint8Array(N);
      let changed = false;
      for (let i = 0; i < N; i++) {
        // One-to-one coupling: a vertex must survive in both layers.
        next[i] = surviving[i] && giantA[i] && giantB[i] ? 1 : 0;
        if (next[i] !== surviving[i]) changed = true;
      }
      surviving = next;
      snaps.push({ a: surviving, b: surviving });
      if (!changed) break;
    }
    return snaps;
  }

  function recomputeCurve() {
    state.pc = 2.45538 / state.c;
    state.curve = [];
    const reps = 3;
    for (let k = 0; k <= 16; k++) {
      const p = 0.45 + (0.5 * k) / 16;
      let sum = 0;
      for (let r = 0; r < reps; r++) {
        const snaps = cascade(p);
        const last = snaps[snaps.length - 1];
        let alive = 0;
        for (let i = 0; i < N; i++) alive += last.a[i];
        sum += alive / N;
      }
      state.curve.push({ p, s: sum / reps });
    }
  }

  function drawLayers(step) {
    const C = palette();
    const canvas = document.getElementById('dep-layers');
    const wrap = canvas.parentElement;
    const W = Math.max(300, wrap.clientWidth - 2);
    const H = Math.round(W * 0.5);
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    const g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = C.bg;
    g.fillRect(0, 0, W, H);
    const snap = state.snapshots[Math.min(step, state.snapshots.length - 1)];
    if (!snap) return;
    const pad = 10;
    const side = Math.min((W - 3 * pad) / 2, H - 2 * pad);
    const ox = [pad, 2 * pad + side];
    const oy = (H - side) / 2;
    const cell = side / SIDE;
    for (let layer = 0; layer < 2; layer++) {
      const act = layer === 0 ? snap.a : snap.b;
      for (let i = 0; i < SIDE; i++) {
        for (let j = 0; j < SIDE; j++) {
          const on = act[i * SIDE + j];
          g.fillStyle = on ? withAlpha(C.cyan, 0.9) : withAlpha(C.closed, 0.95);
          g.fillRect(ox[layer] + j * cell, oy + i * cell, Math.max(1, cell - 0.4), Math.max(1, cell - 0.4));
        }
      }
      g.strokeStyle = C.grid;
      g.strokeRect(ox[layer] - 2, oy - 2, side + 4, side + 4);
      g.fillStyle = C.dim;
      g.font = '9px monospace';
      g.fillText(layer === 0 ? 'A' : 'B', ox[layer], oy - 6);
    }
  }

  function drawCurve() {
    drawPlot(document.getElementById('dep-curve'), {
      height: 230,
      xLabel: 'p',
      yLabel: 'S',
      xRange: [0.45, 0.95],
      yRange: [0, 1],
      vlines: [{ x: state.pc, color: 'rgba(255,180,84,0.5)', label: `p_c = ${state.pc.toFixed(3)}` }],
      series: [
        { x: state.curve.map((q) => q.p), y: state.curve.map((q) => q.s), color: PALETTE.cyan, points: 2 },
        {
          x: state.snapshots.length ? [state.p] : [],
          y: state.snapshots.length ? [countActive(state.snapshots[state.snapshots.length - 1].a) / N] : [],
          color: PALETTE.amber,
          points: 4,
        },
      ],
    });
  }

  function countActive(a) {
    let n = 0;
    for (let i = 0; i < a.length; i++) n += a[i];
    return n;
  }

  let lastStep = 0;
  function animate() {
    if (timer) clearTimeout(timer);
    let step = 0;
    const run = () => {
      lastStep = step;
      drawLayers(step);
      setText('dep-steps', `${step + 1} / ${state.snapshots.length}`);
      if (step < state.snapshots.length - 1) {
        step++;
        timer = setTimeout(run, 180);
      } else {
        const last = state.snapshots[state.snapshots.length - 1];
        const frac = countActive(last.a) / N;
        setText('dep-s', fmt(frac, 4));
        drawCurve();
      }
    };
    run();
  }

  function restart() {
    buildLayers();
    recomputeCurve();
    state.snapshots = cascade(state.p);
    setText('dep-p-readout', fmt(state.p, 3));
    setText('dep-pc', fmt(state.pc, 3));
    animate();
  }

  document.getElementById('dep-p-slider').addEventListener('input', (e) => {
    state.p = parseFloat(e.target.value);
    document.getElementById('dep-p-slider-val').textContent = state.p.toFixed(3);
    setText('dep-p-readout', fmt(state.p, 3));
    state.snapshots = cascade(state.p);
    animate();
  });
  document.getElementById('dep-c').addEventListener('change', (e) => {
    state.c = parseFloat(e.target.value);
    document.getElementById('dep-c-val').textContent = state.c.toFixed(1);
    restart();
  });
  document.getElementById('dep-restart').addEventListener('click', restart);

  restart();
  const offTheme = onTheme(() => { drawLayers(lastStep); drawCurve(); });

  return () => {
    offTheme();
    if (timer) clearTimeout(timer);
  };
}
