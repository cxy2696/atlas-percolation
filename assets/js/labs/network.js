import {
  Rng,
  poissonDegrees,
  powerLawDegrees,
  configurationModel,
  components,
  molloyReed,
} from '../../../lib/js/index.js';
import { labHead, panel, canvasBox, readout, fmt, setText, bindRange } from './ui.js';
import { drawPlot, PALETTE } from '../lib/plot.js';
import { t } from '../i18n.js';
import { palette, onTheme, withAlpha } from '../theme.js';

const LABELS = {
  en: {
    kicker: 'lab 04 · networks',
    title: 'Robust yet fragile',
    lead: 'A configuration-model network of 20 000 vertices. Random removal follows the Molloy–Reed curve; targeted removal of the highest-degree vertices destroys the giant component while most vertices are still present. Move γ_deg and watch the two failure modes separate.',
    curves: 'Giant component under attack',
    structure: 'Hub map (top 600 by degree)',
    kappa: 'κ = ⟨k²⟩/⟨k⟩',
    fcRandom: 'f_c, random (theory)',
    fcTarget: 'f_c, targeted (measured)',
    f: 'Removed fraction f',
    gamma: 'Degree exponent γ_deg',
    mode: 'Attack mode',
    now: 'S at f',
    note: 'N = 20 000. The targeted curve is measured at S = 0.02.',
  },
  zh: {
    kicker: '实验 04 · 网络',
    title: '鲁棒又脆弱',
    lead: '两万个顶点的配置模型网络。随机删除遵循 Molloy–Reed 曲线；定向删除高度顶点会在绝大多数顶点仍在时摧毁巨分量。拖动 γ_deg，看两种失效模式如何分开。',
    curves: '攻击下的巨分量',
    structure: '枢纽图（按度取前 600）',
    kappa: 'κ = ⟨k²⟩/⟨k⟩',
    fcRandom: 'f_c 随机（理论）',
    fcTarget: 'f_c 定向（实测）',
    f: '删除比例 f',
    gamma: '度分布指数 γ_deg',
    mode: '攻击模式',
    now: 'f 处 S',
    note: 'N = 20 000。定向曲线按 S = 0.02 读取。',
  },
  de: {
    kicker: 'Labor 04 · Netzwerke',
    title: 'Robust und verletzlich',
    lead: 'Konfigurationsmodell mit 20 000 Knoten. Zufälliges Entfernen folgt der Molloy–Reed-Kurve; gezieltes Entfernen der Knoten mit höchstem Grad zerstört die Riesenkomponente, solange fast alle Knoten noch da sind. γ_deg verschieben und die beiden Versagensmodi trennen sich.',
    curves: 'Riesenkomponente unter Angriff',
    structure: 'Hub-Karte (Top 600 nach Grad)',
    kappa: 'κ = ⟨k²⟩/⟨k⟩',
    fcRandom: 'f_c, zufällig (Theorie)',
    fcTarget: 'f_c, gezielt (gemessen)',
    f: 'Entfernter Anteil f',
    gamma: 'Gradverteilungs-Exponent γ_deg',
    mode: 'Angriffsmodus',
    now: 'S bei f',
    note: 'N = 20 000. Die gezielte Kurve wird bei S = 0.02 ausgelesen.',
  },
};

const N = 20000;

export function mount(root, ctx) {
  const { lang } = ctx;
  const L = LABELS[lang] || LABELS.en;
  root.innerHTML =
    labHead({ kicker: L.kicker, title: L.title, lead: L.lead, lang , guide: 'network' }) +
    `<div class="grid-lab">
      <div>
        ${canvasBox('net-plot', ['S(f)', 'CONFIG MODEL', 'f', 'N = 20 000'])}
        <div style="height:12px"></div>
        ${canvasBox('net-graph', ['HUBS', 'DEGREE ORDER', '', ''])}
        <div class="grid-2" style="margin-top:12px">
          ${panel(L.curves, '')}
        </div>
      </div>
      <aside class="panel">
        <h3>NETWORK</h3>
        ${readout('net-kappa', L.kappa)}
        ${readout('net-fcr', L.fcRandom)}
        ${readout('net-fct', L.fcTarget)}
        ${readout('net-now', L.now)}
        <div class="control" style="margin-top:14px">
          <label><span>${L.mode}</span></label>
          <select id="net-mode">
            <option value="random">${t(lang, 'random')}</option>
            <option value="targeted">${t(lang, 'targeted')}</option>
          </select>
        </div>
        <div class="control">
          <label><span>${L.gamma}</span><b id="net-gamma-val">2.5</b></label>
          <select id="net-gamma">
            <option value="2.2">2.2</option>
            <option value="2.5" selected>2.5</option>
            <option value="3.0">3.0</option>
            <option value="3.5">3.5</option>
          </select>
        </div>
        ${bindRange ? `<div class="control">
          <label><span>${L.f}</span><b id="net-f-val">0.00</b></label>
          <input id="net-f" type="range" min="0" max="0.9" step="0.01" value="0" />
        </div>` : ''}
        <p class="hint" style="margin-top:14px">${t(lang, 'engine_note')} ${L.note}</p>
      </aside>
    </div>`;

  const state = { gamma: 2.5, mode: 'random', f: 0, graph: null, deg: null, mr: null, random: [], targeted: [] };
  const rng = new Rng(31337);

  function buildNetwork() {
    const deg = powerLawDegrees(N, state.gamma, 2, 5000, rng);
    const graph = configurationModel(deg, rng);
    state.deg = deg;
    state.graph = graph;
    state.mr = molloyReed(deg);
    state.random = [];
    state.targeted = [];
    const act0 = new Uint8Array(N).fill(1);
    for (let k = 0; k <= 30; k++) {
      const f = 0.9 * (k / 30);
      const active = new Uint8Array(N);
      for (let i = 0; i < N; i++) active[i] = rng.random() < 1 - f ? 1 : 0;
      state.random.push({ f, s: components(graph, active).largest / N });
    }
    const order = new Int32Array(N);
    for (let i = 0; i < N; i++) order[i] = i;
    order.sort((a, b) => {
      const da = graph.offset[a + 1] - graph.offset[a];
      const db = graph.offset[b + 1] - graph.offset[b];
      return db - da;
    });
    for (let k = 0; k <= 30; k++) {
      const f = 0.5 * (k / 30);
      const active = new Uint8Array(N).fill(1);
      const cut = Math.floor(f * N);
      for (let i = 0; i < cut; i++) active[order[i]] = 0;
      state.targeted.push({ f, s: components(graph, active).largest / N });
    }
    setText('net-kappa', fmt(state.mr.kappa, 2));
    setText('net-fcr', state.mr.fc > 0 && state.mr.fc < 1 ? fmt(state.mr.fc, 3) : '≈ 1');
    setText('net-fct', fmt(crossing(state.targeted, 0.02), 3));
    draw();
  }

  function crossing(curve, threshold) {
    for (let i = 1; i < curve.length; i++) {
      if (curve[i].s < threshold && curve[i - 1].s >= threshold) {
        const t0 = (curve[i - 1].s - threshold) / (curve[i - 1].s - curve[i].s);
        return curve[i - 1].f + t0 * (curve[i].f - curve[i - 1].f);
      }
    }
    return 1;
  }

  function sAt(curve, f) {
    let best = curve[0];
    for (const p of curve) if (Math.abs(p.f - f) < Math.abs(best.f - f)) best = p;
    return best.s;
  }

  function draw() {
    const mode = state.mode;
    drawPlot(document.getElementById('net-plot'), {
      height: 260,
      xLabel: 'f',
      yLabel: 'S(f)',
      xRange: [0, 0.9],
      yRange: [0, 1],
      vlines: [
        { x: state.f, color: 'rgba(255,180,84,0.5)', label: 'f' },
        ...(state.mr.fc > 0 && state.mr.fc < 1
          ? [{ x: state.mr.fc, color: 'rgba(110,240,168,0.35)', label: L.fcRandom }]
          : []),
      ],
      series: [
        {
          x: state.random.map((p) => p.f),
          y: state.random.map((p) => p.s),
          color: PALETTE.cyan,
          label: t(lang, 'random'),
          width: mode === 'random' ? 2.2 : 1.2,
        },
        {
          x: state.targeted.map((p) => p.f),
          y: state.targeted.map((p) => p.s),
          color: PALETTE.amber,
          label: t(lang, 'targeted'),
          width: mode === 'targeted' ? 2.2 : 1.2,
        },
      ],
    });
    setText('net-now', fmt(sAt(mode === 'random' ? state.random : state.targeted, state.f), 4));
    drawHubs();
  }

  function drawHubs() {
    const C = palette();
    const canvas = document.getElementById('net-graph');
    const wrap = canvas.parentElement;
    const W = Math.max(280, wrap.clientWidth - 2);
    const H = 260;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    const g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = C.bg;
    g.fillRect(0, 0, W, H);
    const graph = state.graph;
    if (!graph) return;
    const top = 600;
    const order = Array.from({ length: N }, (_, i) => i).sort(
      (a, b) => graph.offset[b + 1] - graph.offset[b] - (graph.offset[a + 1] - graph.offset[a])
    );
    const rank = new Map();
    order.slice(0, top).forEach((v, i) => rank.set(v, i));
    const cx = W / 2;
    const cy = H / 2;
    const R = Math.min(W, H) * 0.44;
    const pos = (i) => {
      const rr = Math.sqrt((i + 1) / top) * R;
      const a = i * 2.399963229728653;
      return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
    };
    g.strokeStyle = withAlpha(C.cyan, 0.12);
    g.lineWidth = 0.6;
    g.beginPath();
    for (let i = 0; i < top; i++) {
      const v = order[i];
      const [x1, y1] = pos(i);
      for (let e = graph.offset[v]; e < graph.offset[v + 1]; e++) {
        const w = graph.adj[e];
        const j = rank.get(w);
        if (j === undefined || j <= i) continue;
        const [x2, y2] = pos(j);
        g.moveTo(x1, y1);
        g.lineTo(x2, y2);
      }
    }
    g.stroke();
    for (let i = 0; i < top; i++) {
      const [x, y] = pos(i);
      const deg = graph.offset[order[i] + 1] - graph.offset[order[i]];
      const t0 = Math.min(1, deg / 60);
      g.fillStyle = i < 8 ? C.amber : C.cyan;
      g.globalAlpha = i < 8 ? 1 : 0.3 + 0.6 * t0;
      g.beginPath();
      g.arc(x, y, i < 8 ? 2.6 : 1.2 + 1.4 * t0, 0, Math.PI * 2);
      g.fill();
      g.globalAlpha = 1;
    }
  }

  document.getElementById('net-gamma').addEventListener('change', (e) => {
    state.gamma = parseFloat(e.target.value);
    document.getElementById('net-gamma-val').textContent = String(state.gamma);
    buildNetwork();
  });
  document.getElementById('net-mode').addEventListener('change', (e) => {
    state.mode = e.target.value;
    draw();
  });
  const fInput = document.getElementById('net-f');
  fInput.addEventListener('input', () => {
    state.f = parseFloat(fInput.value);
    document.getElementById('net-f-val').textContent = state.f.toFixed(2);
    draw();
  });

  const onResize = () => draw();
  window.addEventListener('resize', onResize);
  const offTheme = onTheme(() => draw());
  buildNetwork();

  return () => {
    offTheme();
    window.removeEventListener('resize', onResize);
  };
}
