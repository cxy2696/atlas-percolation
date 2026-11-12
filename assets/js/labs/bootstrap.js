import { Rng, buildLattice, bootstrapLattice, Dsu } from '../../../lib/js/index.js';
import { labHead, control, select, readout, panel, canvasBox, fmt, setText } from './ui.js';
import { drawPlot } from '../lib/plot.js';
import { palette, onTheme } from '../theme.js';

const LABELS = {
  en: {
    kicker: 'lab 10 · thresholds on thresholds',
    title: 'Bootstrap percolation',
    lead: 'Sites are occupied independently with probability p. An empty site then becomes active if at least r of its neighbours are active, and the rule is applied until nothing changes. This is a closure, not a random process: the final set is the least fixed point and is independent of the update order.',
    field: 'Occupation and activation time',
    curve: 'Final active fraction vs p',
    roundcurve: 'New activations per round',
    initial: 'Initially occupied',
    final: 'Finally active',
    rounds: 'Rounds',
    newly: 'Newly activated',
    threshold: 'Neighbour threshold r',
    crossing: 'Left–right active path',
    measuredPc: 'p at half activation',
    controls: 'Controls',
    run: 'Run cascade',
    step: 'One round',
    reset: 'Reset',
    note: 'Square lattice, open boundaries. The final set is computed by the least-fixed-point algorithm in lib/js/engine/algorithms.js; the animation replays its rounds.',
    legendActive: 'initially active',
    legendNew: 'activated later',
    legendEmpty: 'never active',
    time: 'time',
  },
  zh: {
    kicker: '实验 10 · 阈值之上的阈值',
    title: '自举渗流',
    lead: '每个位点以概率 p 独立被占据。随后，一个空位点若至少有 r 个邻居处于活跃状态，就变为活跃；规则反复施加直到不再变化。这是一个闭包而不是随机过程：最终集合是最小不动点，与更新顺序无关。',
    field: '占据与激活时间',
    curve: '最终活跃比例随 p',
    roundcurve: '每轮新增激活数',
    initial: '初始占据',
    final: '最终活跃',
    rounds: '轮数',
    newly: '新增激活',
    threshold: '邻居阈值 r',
    crossing: '左右活跃通路',
    measuredPc: '半激活处的 p',
    controls: '控制',
    run: '运行级联',
    step: '单轮',
    reset: '重置',
    note: '方格、开边界。最终集合由 lib/js/engine/algorithms.js 的最小不动点算法计算；动画重放其轮次。',
    legendActive: '初始活跃',
    legendNew: '后来激活',
    legendEmpty: '始终未激活',
    time: '时间',
  },
  de: {
    kicker: 'Labor 10 · Schwellen über Schwellen',
    title: 'Bootstrap-Perkolation',
    lead: 'Plätze sind unabhängig mit Wahrscheinlichkeit p besetzt. Ein leerer Platz wird danach aktiv, wenn mindestens r seiner Nachbarn aktiv sind; die Regel wird angewandt, bis sich nichts mehr ändert. Das ist ein Abschluss, kein Zufallsprozess: die Endmenge ist der kleinste Fixpunkt und unabhängig von der Reihenfolge.',
    field: 'Besetzung und Aktivierungszeit',
    curve: 'Aktiver Endanteil über p',
    roundcurve: 'Neue Aktivierungen pro Runde',
    initial: 'Anfangs besetzt',
    final: 'Schließlich aktiv',
    rounds: 'Runden',
    newly: 'Neu aktiviert',
    threshold: 'Nachbarschwelle r',
    crossing: 'Aktiver Links-rechts-Pfad',
    measuredPc: 'p bei halber Aktivierung',
    controls: 'Regler',
    run: 'Kaskade starten',
    step: 'Eine Runde',
    reset: 'Zurück',
    note: 'Quadratgitter, offene Ränder. Die Endmenge berechnet der Kleinste-Fixpunkt-Algorithmus in lib/js/engine/algorithms.js; die Animation spielt die Runden ab.',
    legendActive: 'anfangs aktiv',
    legendNew: 'später aktiviert',
    legendEmpty: 'nie aktiv',
    time: 'Zeit',
  },
};

const HELP = {
  en: { L: 'Box side. Larger boxes sharpen the finite-size onset.', p: 'Independent occupation probability of each site.', r: 'A site activates when this many neighbours are active.' },
  zh: { L: '盒子边长。盒子越大，有限尺度起点越锐利。', p: '每个位点独立被占据的概率。', r: '活跃邻居达到这个数时，空位点被激活。' },
  de: { L: 'Boxseite. Größere Boxen schärfen den Endlichkeits-Einsatz.', p: 'Unabhängige Besetzungswahrscheinlichkeit jedes Platzes.', r: 'Ein Platz wird aktiv, wenn so viele Nachbarn aktiv sind.' },
};

const PC_NOTES = {
  en: 'The readout is the p at which the mean final active fraction crosses 0.5. It is not the infinite-lattice threshold: for r = 2 the threshold is 0 (Holroyd 2003), and a finite box fills at any p above its finite-size crossover. r = 3 and r = 4 have positive thresholds.',
  zh: '读数给出平均最终活跃比例穿过 0.5 的 p。它不是无限格子的阈值：r = 2 时阈值为 0（Holroyd 2003），有限盒子只要 p 超过其有限尺度交叉点就会充满；r = 3 与 r = 4 才有正阈值。',
  de: 'Der Wert ist das p, bei dem der mittlere aktive Endanteil 0.5 kreuzt. Das ist nicht die Schwelle des unendlichen Gitters: Für r = 2 ist sie 0 (Holroyd 2003), eine endliche Box füllt sich oberhalb ihres Endlichkeits-Crossovers. r = 3 und r = 4 haben positive Schwellen.',
};

export function mount(root, ctx) {
  const { lang } = ctx;
  const L = LABELS[lang] || LABELS.en;
  const H = HELP[lang] || HELP.en;
  root.innerHTML =
    labHead({ kicker: L.kicker, title: L.title, lead: L.lead, lang, guide: 'bootstrap' }) +
    `<div class="grid-lab">
      <div>
        ${canvasBox('boot-canvas', [L.field, 'r', 'p', 'L'])}
        <div class="legend" style="margin:10px 0 14px">
          <span><i data-theme-color="cyan"></i>${L.legendActive}</span>
          <span><i data-theme-color="amber"></i>${L.legendNew}</span>
          <span><i data-theme-color="closed"></i>${L.legendEmpty}</span>
        </div>
        <div class="grid-2">
          ${panel(L.curve, '<div class="plot-host" id="boot-plot"></div>')}
          ${panel(L.roundcurve, '<div class="plot-host" id="boot-rounds-plot"></div>')}
        </div>
        <p class="explain">${L.note}</p>
      </div>
      <aside class="panel">
        <h3>${L.controls}</h3>
        ${select({ id: 'boot-size', label: 'L', value: '64', options: [
          { value: '32', label: '32 × 32' },
          { value: '64', label: '64 × 64' },
          { value: '96', label: '96 × 96' },
          { value: '128', label: '128 × 128' },
        ], help: H.L })}
        ${control({ id: 'boot-p', label: 'p', min: 0.3, max: 0.8, step: 0.002, value: 0.50, help: H.p })}
        ${select({ id: 'boot-r', label: L.threshold, value: '3', options: [
          { value: '2', label: 'r = 2 (zero threshold)' },
          { value: '3', label: 'r = 3' },
          { value: '4', label: 'r = 4' },
        ], help: H.r })}
        <div class="btn-row">
          <button class="btn primary" id="boot-run">${L.run}</button>
          <button class="btn" id="boot-step">${L.step}</button>
          <button class="btn ghost" id="boot-reset">${L.reset}</button>
        </div>
        ${readout('boot-init', L.initial)}
        ${readout('boot-final', L.final)}
        ${readout('boot-rounds', L.rounds)}
        ${readout('boot-onset', L.measuredPc)}
        ${readout('boot-new', L.newly)}
        ${readout('boot-cross', L.crossing)}
        <div class="hud-note" style="margin-top:10px">${PC_NOTES[lang] || PC_NOTES.en}</div>
      </aside>
    </div>`;

  const canvas = root.querySelector('#boot-canvas');
  const state = { L: 64, p: 0.50, r: 3, seed: 2001, shown: 0, result: null, occupied: null, timer: null };
  let curve = [];

  function stop() {
    if (state.timer) clearInterval(state.timer);
    state.timer = null;
  }

  function crossesLR(active, L) {
    const dsu = new Dsu(L * L);
    for (let i = 0; i < L; i++) {
      for (let j = 0; j < L; j++) {
        const v = i * L + j;
        if (!active[v]) continue;
        if (j + 1 < L && active[v + 1]) dsu.union(v, v + 1);
        if (i + 1 < L && active[v + L]) dsu.union(v, v + L);
      }
    }
    const left = new Set();
    const right = new Set();
    for (let i = 0; i < L; i++) {
      if (active[i * L]) left.add(dsu.find(i * L));
      if (active[i * L + L - 1]) right.add(dsu.find(i * L + L - 1));
    }
    for (const r of left) if (right.has(r)) return true;
    return false;
  }

  function run() {
    stop();
    const lat = buildLattice('square', state.L);
    const rng = new Rng(state.seed++);
    const occ = new Uint8Array(lat.n);
    for (let v = 0; v < lat.n; v++) occ[v] = rng.random() < state.p ? 1 : 0;
    state.occupied = occ;
    state.result = bootstrapLattice(lat, occ, state.r);
    state.shown = 0;
    const maxRound = state.result.rounds.length;
    readouts();
    draw();
    drawCurve();
    drawRounds();
    if (maxRound === 0) return;
    state.timer = setInterval(() => {
      state.shown++;
      if (state.shown >= maxRound) {
        state.shown = maxRound;
        stop();
      }
      draw();
      readouts();
    }, 520);
  }

  function readouts() {
    const res = state.result;
    if (!res) return;
    const init = state.occupied.reduce((a, b) => a + b, 0);
    setText('boot-init', `${fmt(init / res.active.length, 3)}  (${init})`);
    setText('boot-final', `${fmt(res.fraction, 3)}  (${res.activeCount})`);
    setText('boot-rounds', String(res.rounds.length));
    const shownRound = res.rounds[state.shown - 1];
    setText('boot-new', shownRound ? String(shownRound.newly) : '0');
    setText('boot-cross', crossesLR(res.active, state.L) ? (lang === 'zh' ? '是' : lang === 'de' ? 'JA' : 'YES') : (lang === 'zh' ? '否' : lang === 'de' ? 'NEIN' : 'NO'));
    const cEl = document.getElementById('boot-cross');
    if (cEl) cEl.parentElement.className = `readout ${crossesLR(res.active, state.L) ? 'ok' : ''}`;
  }

  function draw() {
    const res = state.result;
    if (!res) return;
    const C = palette();
    const wrap = canvas.parentElement;
    const W = Math.max(280, wrap.clientWidth - 2);
    const H = Math.min(560, Math.round(W * 0.9));
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    const g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = C.bg;
    g.fillRect(0, 0, W, H);
    const n = state.L;
    const cell = Math.min((W - 24) / n, (H - 24) / n);
    const ox = (W - cell * n) / 2;
    const oy = (H - cell * n) / 2;
    const maxRound = Math.max(1, res.rounds.length);
    for (let v = 0; v < n * n; v++) {
      const i = Math.floor(v / n);
      const j = v % n;
      const time = res.time[v];
      let fill;
      if (time === 0) fill = C.cyan;
      else if (time > 0 && time <= state.shown) {
        const t = time / maxRound;
        fill = t < 0.5 ? C.amber : C.green;
      } else fill = C.closed;
      g.fillStyle = fill;
      g.fillRect(ox + j * cell, oy + i * cell, Math.max(1, cell - 0.4), Math.max(1, cell - 0.4));
    }
    g.strokeStyle = C.grid;
    g.strokeRect(ox - 0.5, oy - 0.5, cell * n + 1, cell * n + 1);
    if (state.shown === 0) {
      g.fillStyle = C.ink;
      g.font = '10px monospace';
      g.fillText('t = 0', ox + 4, oy + cell * n - 6);
    } else {
      g.fillStyle = C.ink;
      g.font = '10px monospace';
      g.fillText(`t = ${state.shown} / ${res.rounds.length}`, ox + 4, oy + cell * n - 6);
    }
  }

  function drawCurve() {
    const host = root.querySelector('#boot-plot');
    if (!host) return;
    let el = host.querySelector('canvas');
    if (!el) {
      el = document.createElement('canvas');
      host.appendChild(el);
    }
    const pts = curve.filter((q) => q.r === state.r && q.L === state.L);
    if (!pts.length) {
      for (let i = 0; i <= 16; i++) {
        const p = 0.3 + (0.5 * i) / 16;
        const lat = buildLattice('square', state.L);
        let sum = 0;
        const reps = 3;
        for (let k = 0; k < reps; k++) {
          const rng = new Rng(8000 + i * 17 + k);
          const occ = new Uint8Array(lat.n);
          for (let v = 0; v < lat.n; v++) occ[v] = rng.random() < p ? 1 : 0;
          sum += bootstrapLattice(lat, occ, state.r).fraction;
        }
        curve.push({ p, r: state.r, L: state.L, f: sum / reps });
      }
    }
    const ps = curve.filter((q) => q.r === state.r && q.L === state.L).sort((a, b) => a.p - b.p);
    let onset = null;
    for (let i = 1; i < ps.length; i++) {
      if (ps[i - 1].f < 0.5 && ps[i].f >= 0.5) {
        const t = (0.5 - ps[i - 1].f) / (ps[i].f - ps[i - 1].f);
        onset = ps[i - 1].p + t * (ps[i].p - ps[i - 1].p);
      }
    }
    drawPlot(el, {
      height: 210,
      xRange: [0.3, 0.8],
      yRange: [0, 1],
      xLabel: 'p',
      yLabel: 'final active fraction',
      vlines: [
        { x: state.p, color: palette().amber, label: 'p' },
        ...(onset ? [{ x: onset, color: palette().green, label: '50%' }] : []),
      ],
      series: [{ x: ps.map((q) => q.p), y: ps.map((q) => q.f), color: palette().cyan, points: 2.2 }],
    });
    const el2 = root.querySelector('#boot-onset');
    if (el2) el2.textContent = onset ? onset.toFixed(3) : '—';
  }

  function drawRounds() {
    const host = root.querySelector('#boot-rounds-plot');
    if (!host || !state.result) return;
    let el = host.querySelector('canvas');
    if (!el) {
      el = document.createElement('canvas');
      host.appendChild(el);
    }
    const rounds = state.result.rounds;
    drawPlot(el, {
      height: 210,
      xRange: [0, Math.max(1, rounds.length)],
      yRange: [0, Math.max(1, ...rounds.map((q) => q.newly))],
      xLabel: 'round t',
      yLabel: 'newly active',
      series: [{ x: rounds.map((q) => q.round), y: rounds.map((q) => q.newly), color: palette().amber, points: 2.5 }],
    });
  }

  function reset() {
    stop();
    state.seed = 2001;
    state.shown = 0;
    state.result = null;
    const g = canvas.getContext('2d');
    const C = palette();
    g.fillStyle = C.bg;
    g.fillRect(0, 0, canvas.width, canvas.height);
    setText('boot-init', '—');
    setText('boot-final', '—');
    setText('boot-rounds', '—');
    setText('boot-new', '—');
    setText('boot-cross', '—');
  }

  root.querySelector('#boot-size').addEventListener('change', (e) => {
    state.L = parseInt(e.target.value, 10);
    curve = [];
    run();
  });
  root.querySelector('#boot-r').addEventListener('change', (e) => {
    state.r = parseInt(e.target.value, 10);
    curve = [];
    run();
  });
  const pInput = root.querySelector('#boot-p');
  pInput.addEventListener('input', () => {
    state.p = parseFloat(pInput.value);
    root.querySelector('#boot-p-val').textContent = state.p.toFixed(3);
    run();
  });
  root.querySelector('#boot-run').addEventListener('click', run);
  root.querySelector('#boot-step').addEventListener('click', () => {
    if (!state.result) return;
    state.shown = Math.min(state.result.rounds.length, state.shown + 1);
    draw();
    readouts();
  });
  root.querySelector('#boot-reset').addEventListener('click', reset);

  const onResize = () => {
    draw();
    drawCurve();
    drawRounds();
  };
  window.addEventListener('resize', onResize);
  const offTheme = onTheme(() => {
    draw();
    drawCurve();
    drawRounds();
  });
  root.querySelector('#boot-p-val').textContent = state.p.toFixed(3);
  run();

  return () => {
    stop();
    offTheme();
    window.removeEventListener('resize', onResize);
  };
}
