import { Rng, buildLattice3D, Percolation } from '../../../lib/js/index.js';
import { labHead, control, select, readout, panel, canvasBox, fmt, setText } from './ui.js';
import { palette, onTheme } from '../theme.js';

const PC = 0.3116077;

const LABELS = {
  en: {
    kicker: 'lab 16 · three dimensions',
    title: 'Three-dimensional percolation',
    lead: 'Simple cubic site percolation, drawn in isometric projection. The cube is L × L × L with open boundaries; cyan is the largest cluster, amber the second, grey the rest. The readout reports top–bottom spanning, which is the event whose probability defines p_c.',
    field: 'Site configuration',
    observables: 'Observables',
    controls: 'Controls',
    resample: 'Resample',
    sweep: 'Sweep p',
    size: 'Cube side L',
    sizeHelp: 'A larger cube sharpens the crossing and costs O(L³).',
    probability: 'Occupancy p',
    pHelp: 'Independent site occupancy. The interesting window is p ≈ 0.31.',
    smax: 'Largest cluster S',
    largest: 'largest cluster',
    second: 'second cluster',
    clusters: 'Clusters',
    occupied: 'Occupied sites',
    span: 'Top–bottom spanning',
    pc: 'Known p_c (site)',
    ratio: 'p / p_c',
    time: 'ms',
    note: 'The threshold 0.3116077(2) is the high-precision value of Wang et al. (2013), not an exact identity. The cube is small enough to draw every occupied site; the finite-size crossing is rounded and sits slightly above the infinite-lattice value.',
    top: 'top', bottom: 'bottom', axis: 'z',
  },
  zh: {
    kicker: '实验 16 · 三维',
    title: '三维渗流',
    lead: '简单立方位点渗流，用等距投影绘制。立方体为 L × L × L，开边界；青色是最大团簇，琥珀色是次大团簇，灰色是其余。读数给出上下贯穿——定义 p_c 的事件。',
    field: '位点构型',
    observables: '观测量',
    controls: '控制',
    resample: '重采样',
    sweep: '扫描 p',
    size: '立方体边长 L',
    sizeHelp: '立方体越大，交点越锐，代价是 O(L³)。',
    probability: '占据率 p',
    pHelp: '位点独立占据。有意义的窗口在 p ≈ 0.31。',
    smax: '最大团簇 S',
    largest: '最大团簇',
    second: '次大团簇',
    clusters: '团簇数',
    occupied: '占据位点',
    span: '上下贯穿',
    pc: '已知 p_c（位点）',
    ratio: 'p / p_c',
    time: '毫秒',
    note: '阈值 0.3116077(2) 是 Wang 等（2013）的高精度数值，不是精确恒等式。立方体小到可以画出每个占据位点；有限尺度交点被抹圆，并略高于无限格值。',
    top: '顶', bottom: '底', axis: 'z',
  },
  de: {
    kicker: 'Labor 16 · drei Dimensionen',
    title: 'Perkolation in drei Dimensionen',
    lead: 'Einfache kubische Platzperkolation in isometrischer Projektion. Der Würfel ist L × L × L mit offenen Rändern; Cyan ist der größte Cluster, Bernstein der zweitgrößte, Grau der Rest. Die Anzeige misst den Durchgang von oben nach unten — das Ereignis, das p_c definiert.',
    field: 'Platzkonfiguration',
    observables: 'Observablen',
    controls: 'Regler',
    resample: 'Neu ziehen',
    sweep: 'p durchlaufen',
    size: 'Würfelkante L',
    sizeHelp: 'Ein größerer Würfel schärft den Übergang und kostet O(L³).',
    probability: 'Besetzung p',
    pHelp: 'Unabhängige Platzbesetzung. Das interessante Fenster ist p ≈ 0.31.',
    smax: 'Größter Cluster S',
    largest: 'größter Cluster',
    second: 'zweitgrößter',
    clusters: 'Cluster',
    occupied: 'Besetzte Plätze',
    span: 'Durchgang oben–unten',
    pc: 'Bekanntes p_c (Platz)',
    ratio: 'p / p_c',
    time: 'ms',
    note: 'Die Schwelle 0.3116077(2) ist der hochpräzise Wert von Wang et al. (2013), keine exakte Identität. Der Würfel ist klein genug, um jeden besetzten Platz zu zeichnen; der Endlichkeits-Schnitt ist gerundet und liegt etwas über dem Wert des unendlichen Gitters.',
    top: 'oben', bottom: 'unten', axis: 'z',
  },
};

export function mount(root, ctx) {
  const { lang } = ctx;
  const L = LABELS[lang] || LABELS.en;
  root.innerHTML =
    labHead({ kicker: L.kicker, title: L.title, lead: L.lead, lang, guide: 'three-d' }) +
    `<div class="grid-lab">
      <div>
        ${canvasBox('td-canvas', ['', 'L', 'z', 'p'])}
        <div class="legend" style="margin:10px 0 14px">
          <span><i data-theme-color="cyan"></i>${L.largest}</span>
          <span><i data-theme-color="amber"></i>${L.second}</span>
          <span><i data-theme-color="closed"></i>${L.clusters}</span>
        </div>
        <div class="grid-2">
          ${panel(L.observables,
            readout('td-smax', L.smax) +
            readout('td-clusters', L.clusters) +
            readout('td-occupied', L.occupied) +
            readout('td-span', L.span))}
          ${panel('p_c',
            readout('td-p-show', 'p') +
            readout('td-pc', L.pc) +
            readout('td-ratio', L.ratio) +
            readout('td-time', L.time))}
        </div>
        <p class="explain">${L.note}</p>
      </div>
      <aside class="panel">
        <h3>${L.controls}</h3>
        ${select({ id: 'td-size', label: L.size, value: '16', options: [
          { value: '12', label: '12³ = 1 728' },
          { value: '16', label: '16³ = 4 096' },
          { value: '20', label: '20³ = 8 000' },
          { value: '24', label: '24³ = 13 824' },
        ], help: L.sizeHelp })}
        ${control({ id: 'td-p', label: L.probability, min: 0.15, max: 0.50, step: 0.002, value: 0.3116, help: L.pHelp })}
        <div class="btn-row">
          <button class="btn primary" id="td-resample">${L.resample}</button>
          <button class="btn" id="td-sweep">${L.sweep}</button>
        </div>
      </aside>
    </div>`;

  const canvas = root.querySelector('#td-canvas');
  const state = { L: 16, p: 0.3116, seed: 4001, model: null, lat: null, stats: null, ms: 0, timer: null };
  let sweeping = null;

  function rebuild() {
    state.lat = buildLattice3D(state.L);
    state.model = new Percolation(state.lat, { mode: 'site' });
  }

  function spanning() {
    const { model, lat } = state;
    if (!model || !lat) return false;
    const dsu = model.dsu;
    const top = new Set();
    const bottom = new Set();
    for (let x = 0; x < lat.L; x++) {
      for (let y = 0; y < lat.L; y++) {
        const t = (x * lat.L + y) * lat.L + (lat.L - 1); // z = L-1
        const b = (x * lat.L + y) * lat.L;             // z = 0
        if (model.occ[t]) top.add(dsu.find(t));
        if (model.occ[b]) bottom.add(dsu.find(b));
      }
    }
    for (const r of top) if (bottom.has(r)) return true;
    return false;
  }

  function sample() {
    if (state.timer) clearInterval(state.timer);
    const t0 = performance.now();
    const rng = new Rng(state.seed++);
    state.stats = state.model.sample(state.p, rng).analyze();
    state.ms = performance.now() - t0;
    draw();
    readouts();
  }

  function readouts() {
    const s = state.stats;
    if (!s) return;
    setText('td-smax', `${fmt(s.maxSize / state.lat.n, 3)}  (${s.maxSize})`);
    setText('td-clusters', String(s.count));
    setText('td-occupied', `${s.sum} / ${state.lat.n}`);
    setText('td-span', spanning() ? (lang === 'zh' ? '是' : lang === 'de' ? 'JA' : 'YES') : (lang === 'zh' ? '否' : lang === 'de' ? 'NEIN' : 'NO'));
    setText('td-p-show', fmt(state.p, 4));
    setText('td-pc', fmt(PC, 7));
    setText('td-ratio', `${fmt(state.p / PC, 3)}×`);
    setText('td-time', state.ms.toFixed(1));
    const sp = document.getElementById('td-span');
    if (sp) sp.parentElement.className = `readout ${spanning() ? 'ok' : ''}`;
    const ra = document.getElementById('td-ratio');
    if (ra) ra.parentElement.className = `readout ${state.p / PC > 1 ? 'ok' : 'alert'}`;
  }

  function draw() {
    if (!state.lat || !state.stats) return;
    const C = palette();
    const wrap = canvas.parentElement;
    const W = Math.max(320, wrap.clientWidth - 2);
    const H = Math.min(620, Math.round(W * 0.92));
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    const g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = C.bg;
    g.fillRect(0, 0, W, H);

    const Ls = state.lat.L;
    const pad = 26;
    const span = Ls - 1;
    const s = Math.min((W - 2 * pad) / (2 * 0.866 * span), (H - 2 * pad) / (1.9 * span));
    const ox = W / 2;
    const oy = H * 0.20;
    const iso = (x, y, z) => ({
      x: ox + (x - y) * s * 0.866,
      y: oy + (x + y) * s * 0.5 - z * s * 0.9,
    });
    // wireframe cube
    g.strokeStyle = C.grid;
    g.lineWidth = 1;
    const corners = [];
    for (const x of [0, span]) for (const y of [0, span]) for (const z of [0, span]) corners.push(iso(x, y, z));
    const edges = [[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]];
    for (const [a, b] of edges) {
      g.beginPath();
      g.moveTo(corners[a].x, corners[a].y);
      g.lineTo(corners[b].x, corners[b].y);
      g.stroke();
    }

    const dsu = state.model.dsu;
    const sizes = new Map();
    for (let v = 0; v < state.lat.n; v++) {
      if (!state.model.occ[v]) continue;
      const r = dsu.find(v);
      sizes.set(r, (sizes.get(r) || 0) + 1);
    }
    const maxS = Math.max(1, ...sizes.values());
    const second = [...sizes.values()].sort((a, b) => b - a)[1] || 1;
    const sites = [];
    for (let v = 0; v < state.lat.n; v++) {
      if (!state.model.occ[v]) continue;
      const z = v % Ls;
      const y = Math.floor(v / Ls) % Ls;
      const x = Math.floor(v / (Ls * Ls));
      const sSize = sizes.get(dsu.find(v)) || 1;
      sites.push({ x, y, z, size: sSize });
    }
    sites.sort((a, b) => (a.x + a.y + a.z) - (b.x + b.y + b.z));
    const h = Math.max(1.8, s * 0.42);
    for (const site of sites) {
      const p = iso(site.x, site.y, site.z);
      const isMax = site.size === maxS;
      const isSecond = site.size === second && maxS > 1;
      const base = isMax ? C.cyan : isSecond ? C.amber : C.cyanDim;
      // top diamond
      g.fillStyle = base;
      g.beginPath();
      g.moveTo(p.x, p.y - h * 0.55);
      g.lineTo(p.x + h, p.y);
      g.lineTo(p.x, p.y + h * 0.55);
      g.lineTo(p.x - h, p.y);
      g.closePath();
      g.fill();
      // two side faces, darker
      g.fillStyle = shade(base, -0.38);
      g.beginPath();
      g.moveTo(p.x - h, p.y);
      g.lineTo(p.x, p.y + h * 0.55);
      g.lineTo(p.x, p.y + h * 1.45);
      g.lineTo(p.x - h, p.y + h * 0.9);
      g.closePath();
      g.fill();
      g.fillStyle = shade(base, -0.24);
      g.beginPath();
      g.moveTo(p.x + h, p.y);
      g.lineTo(p.x, p.y + h * 0.55);
      g.lineTo(p.x, p.y + h * 1.45);
      g.lineTo(p.x + h, p.y + h * 0.9);
      g.closePath();
      g.fill();
    }
    g.fillStyle = C.faint;
    g.font = '9px monospace';
    g.fillText(`L = ${Ls}`, 8, 14);
    g.fillText(L.top, ox - 8, oy - s * 1.55);
    g.fillText(L.bottom, ox - 14, oy + s * 1.95);
  }

  function shade(hex, amount) {
    const m = String(hex || '').match(/^#?([0-9a-f]{6})$/i);
    if (!m) return hex;
    const n = parseInt(m[1], 16);
    let r = (n >> 16) & 255;
    let g = (n >> 8) & 255;
    let b = n & 255;
    if (amount < 0) {
      r *= 1 + amount; g *= 1 + amount; b *= 1 + amount;
    } else {
      r += (255 - r) * amount; g += (255 - g) * amount; b += (255 - b) * amount;
    }
    return `rgb(${r | 0},${g | 0},${b | 0})`;
  }

  root.querySelector('#td-size').addEventListener('change', (e) => {
    state.L = parseInt(e.target.value, 10);
    rebuild();
    sample();
  });
  const pInput = root.querySelector('#td-p');
  pInput.addEventListener('input', () => {
    state.p = parseFloat(pInput.value);
    root.querySelector('#td-p-val').textContent = state.p.toFixed(4);
    sample();
  });
  root.querySelector('#td-resample').addEventListener('click', sample);
  root.querySelector('#td-sweep').addEventListener('click', () => {
    if (sweeping) {
      clearInterval(sweeping);
      sweeping = null;
      return;
    }
    let p = 0.18;
    sweeping = setInterval(() => {
      p += 0.004;
      if (p > 0.46) {
        clearInterval(sweeping);
        sweeping = null;
        return;
      }
      state.p = p;
      pInput.value = String(p);
      root.querySelector('#td-p-val').textContent = p.toFixed(4);
      sample();
    }, 120);
  });

  const onResize = () => draw();
  window.addEventListener('resize', onResize);
  const offTheme = onTheme(() => draw());
  rebuild();
  sample();
  return () => {
    offTheme();
    if (sweeping) clearInterval(sweeping);
    window.removeEventListener('resize', onResize);
  };
}
