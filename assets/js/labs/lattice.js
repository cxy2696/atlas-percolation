import { Rng, buildLattice, Percolation, degreeHistogram } from '../../../lib/js/index.js';
import { labHead, control, select, readout, panel, canvasBox, bindRange, clusterColor, fmt, setText } from './ui.js';
import { t } from '../i18n.js';

const PC = {
  'square:bond': 0.5,
  'square:site': 0.592746,
  'triangular:bond': 0.347296,
  'triangular:site': 0.5,
  'honeycomb:bond': 0.652704,
  'honeycomb:site': 0.697043,
};

const LABELS = {
  en: {
    title: 'Lattice percolation',
    kicker: 'lab 01 · geometry',
    lead: 'One random configuration, drawn at full resolution. The largest cluster is cyan, the second amber; the crossing indicator turns green when a cluster joins the left and right boundaries.',
    observables: 'Observables',
    threshold: 'Threshold',
    controls: 'Controls',
    resample: 'Resample',
    sweep: 'Sweep p',
    sMax: 'Largest cluster S',
    chi: 'Susceptibility χ',
    ncl: 'Clusters',
    crossingLr: 'Left–right crossing',
    ratio: 'p / p_c',
    known: 'Known p_c',
    clusters: 'Cluster count',
    largest: 'largest',
    second: 'second',
    closed: 'closed',
    empty: 'closed site',
    square: 'square',
    triangular: 'triangular',
    honeycomb: 'honeycomb',
  },
  zh: {
    title: '格子渗流',
    kicker: '实验 01 · 几何',
    lead: '一张完整分辨率的随机构型：最大团簇为青色，次大为琥珀色；当某个团簇同时触及左右边界时，横穿指示变为绿色。',
    observables: '观测量',
    threshold: '阈值',
    controls: '控制',
    resample: '重采样',
    sweep: '扫描 p',
    sMax: '最大团簇 S',
    chi: '磁化率 χ',
    ncl: '团簇数',
    crossingLr: '左右横穿',
    ratio: 'p / p_c',
    known: '已知 p_c',
    clusters: '团簇数',
    largest: '最大团簇',
    second: '次大团簇',
    closed: '闭合',
    empty: '空位点',
    square: '方格',
    triangular: '三角',
    honeycomb: '蜂窝',
  },
  de: {
    title: 'Gitterperkolation',
    kicker: 'Labor 01 · Geometrie',
    lead: 'Eine zufällige Konfiguration in voller Auflösung. Der größte Cluster ist cyan, der zweitgrößte amber; der Durchgangsindikator wird grün, sobald ein Cluster linken und rechten Rand verbindet.',
    observables: 'Observablen',
    threshold: 'Schwelle',
    controls: 'Regler',
    resample: 'Neu ziehen',
    sweep: 'p durchlaufen',
    sMax: 'Größter Cluster S',
    chi: 'Suszeptibilität χ',
    ncl: 'Cluster',
    crossingLr: 'Durchgang links–rechts',
    ratio: 'p / p_c',
    known: 'Bekanntes p_c',
    clusters: 'Clusterzahl',
    largest: 'größter Cluster',
    second: 'zweitgrößter',
    closed: 'geschlossen',
    empty: 'leerer Platz',
    square: 'Quadrat',
    triangular: 'Dreieck',
    honeycomb: 'Bienenwabe',
  },
};

export function mount(root, ctx) {
  const { lang } = ctx;
  const L = LABELS[lang] || LABELS.en;
  root.innerHTML =
    labHead({ kicker: L.kicker, title: L.title, lead: L.lead, lang }) +
    `<div class="grid-lab">
      <div>
        ${canvasBox('lat-canvas', [t(lang, 'geometry'), t(lang, 'stage_engine'), 'p', 'L'])}
        <div class="legend" style="margin:10px 0 14px">
          <span><i style="background:#4fe3ea"></i>${L.largest}</span>
          <span><i style="background:#ffb454"></i>${L.second}</span>
          <span><i style="background:#3f8fa0"></i>${t(lang, 'clusters')}</span>
          <span><i style="background:#16242b"></i>${L.empty}</span>
        </div>
        <div class="grid-2">
          ${panel(L.observables,
            readout('lat-smax', L.sMax) +
            readout('lat-chi', L.chi) +
            readout('lat-ncl', L.ncl) +
            readout('lat-cross', L.crossingLr))}
          ${panel(L.threshold,
            readout('lat-p-readout', 'p') +
            readout('lat-pc', L.known) +
            readout('lat-ratio', L.ratio) +
            readout('lat-time', 'ms'))}
        </div>
      </div>
      <aside class="panel">
        <h3>${L.controls}</h3>
        ${select({ id: 'lat-kind', label: t(lang, 'lattice'), value: 'square', options: [
          { value: 'square', label: L.square },
          { value: 'triangular', label: L.triangular },
          { value: 'honeycomb', label: L.honeycomb },
        ] })}
        ${select({ id: 'lat-mode', label: t(lang, 'mode'), value: 'bond', options: [
          { value: 'bond', label: t(lang, 'bond') },
          { value: 'site', label: t(lang, 'site') },
        ] })}
        ${select({ id: 'lat-size', label: t(lang, 'size'), value: '64', options: [
          { value: '32', label: '32 × 32' },
          { value: '64', label: '64 × 64' },
          { value: '128', label: '128 × 128' },
          { value: '256', label: '256 × 256' },
        ] })}
        ${control({ id: 'lat-p-slider', label: t(lang, 'probability'), min: 0, max: 1, step: 0.001, value: 0.5 })}
        <div class="btn-row">
          <button class="btn primary" id="lat-resample">${L.resample}</button>
          <button class="btn" id="lat-sweep">${L.sweep}</button>
        </div>
        <p class="hint" style="margin-top:14px">${t(lang, 'engine_note')}</p>
      </aside>
    </div>`;

  const canvas = root.querySelector('#lat-canvas');
  const state = { kind: 'square', mode: 'bond', L: 64, p: 0.5, seed: 1001 };
  let lat = null;
  let model = null;
  let stats = null;
  let lastMs = 0;
  let sweeping = null;

  const pixelCanvas = document.createElement('canvas');
  const pixelCtx = pixelCanvas.getContext('2d');

  function rebuild() {
    const size = state.L;
    lat = buildLattice(state.kind, size);
    model = new Percolation(lat, { mode: state.mode });
  }

  function resample() {
    if (state.mode === 'bond' && state.L > 256) return;
    const t0 = performance.now();
    const rng = new Rng(state.seed++);
    stats = model.sample(state.p, rng).analyze();
    lastMs = performance.now() - t0;
    draw();
    readouts();
  }

  function readouts() {
    const n = lat.n;
    setText('lat-smax', `${fmt(stats.maxSize / Math.max(1, stats.sum), 4)}  (${stats.maxSize})`);
    setText('lat-chi', fmt(stats.chi2(), 3));
    setText('lat-ncl', String(stats.count));
    setText('lat-p-readout', fmt(state.p, 3));
    const pc = PC[`${state.kind}:${state.mode}`];
    setText('lat-pc', fmt(pc, 4));
    const ratio = state.p / pc;
    setText('lat-ratio', `${fmt(ratio, 3)}×`);
    const rEl = document.getElementById('lat-ratio');
    if (rEl) rEl.parentElement.className = `readout ${ratio > 1 ? 'ok' : 'alert'}`;
    setText('lat-time', `${lastMs.toFixed(1)}`);
    const cross = model.crossesLR();
    setText('lat-cross', cross ? t(lang, 'yes') : t(lang, 'no'));
    const cEl = document.getElementById('lat-cross');
    if (cEl) cEl.parentElement.className = `readout ${cross ? 'ok' : ''}`;
  }

  function draw() {
    const wrap = canvas.parentElement;
    const W = Math.max(280, wrap.clientWidth - 2);
    const H = Math.min(560, Math.round(W * 0.86));
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    const g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = '#050a0e';
    g.fillRect(0, 0, W, H);

    if (state.kind === 'square') drawPixel(g, W, H);
    else drawVector(g, W, H);
  }

  function rootSizes() {
    const sizeOf = new Map();
    const dsu = model.dsu;
    for (let v = 0; v < lat.n; v++) {
      if (!model.occ[v]) continue;
      const r = dsu.find(v);
      sizeOf.set(r, (sizeOf.get(r) || 0) + 1);
    }
    return sizeOf;
  }

  function drawPixel(g, W, H) {
    const L2 = state.mode === 'bond' ? 2 * state.L - 1 : state.L;
    pixelCanvas.width = L2;
    pixelCanvas.height = L2;
    const img = pixelCtx.createImageData(L2, L2);
    const data = img.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 7;
      data[i + 1] = 12;
      data[i + 2] = 16;
      data[i + 3] = 255;
    }
    const sizeOf = rootSizes();
    const dsu = model.dsu;
    const maxS = stats.maxSize;
    const rgbCache = new Map();
    const rgbOf = (r) => {
      let c = rgbCache.get(r);
      if (!c) {
        const s = sizeOf.get(r) || 1;
        const str = clusterColor(s, maxS, 1);
        const m = str.match(/rgba?\(([^)]+)\)/);
        const p = m ? m[1].split(',').map(Number) : [80, 200, 210];
        c = [p[0], p[1], p[2]];
        rgbCache.set(r, c);
      }
      return c;
    };
    const put = (x, y, rgb) => {
      const o = (y * L2 + x) * 4;
      data[o] = rgb[0];
      data[o + 1] = rgb[1];
      data[o + 2] = rgb[2];
      data[o + 3] = 255;
    };
    const Ls = state.L;
    for (let i = 0; i < Ls; i++) {
      for (let j = 0; j < Ls; j++) {
        const v = i * Ls + j;
        const px = state.mode === 'bond' ? 2 * j : j;
        const py = state.mode === 'bond' ? 2 * i : i;
        if (!model.occ[v]) {
          put(px, py, [16, 24, 30]);
          continue;
        }
        put(px, py, rgbOf(dsu.find(v)));
      }
    }
    if (state.mode === 'bond') {
      for (let e = 0; e < lat.m; e++) {
        const a = lat.eu[e];
        const b = lat.ev[e];
        if (!model.open[e]) continue;
        const i = Math.floor(a / Ls);
        const j = a % Ls;
        let x;
        let y;
        if (b === a + 1) {
          x = 2 * j + 1;
          y = 2 * i;
        } else {
          x = 2 * j;
          y = 2 * i + 1;
        }
        put(x, y, rgbOf(dsu.find(a)));
      }
    }
    pixelCtx.putImageData(img, 0, 0);
    g.imageSmoothingEnabled = false;
    const pad = 8;
    const side = Math.min(W - 2 * pad, H - 2 * pad);
    g.drawImage(pixelCanvas, pad + (W - 2 * pad - side) / 2, pad + (H - 2 * pad - side) / 2, side, side);
    g.strokeStyle = 'rgba(96,190,210,0.25)';
    g.strokeRect(pad + 0.5, pad + 0.5, side, side);
  }

  function drawVector(g, W, H) {
    const pad = 18;
    const side = Math.min(W - 2 * pad, H - 2 * pad);
    const ox = pad + (W - 2 * pad - side) / 2;
    const oy = pad + (H - 2 * pad - side) / 2;
    const pos = (v) => {
      const p = lat.position(v);
      return [ox + p.x * side, oy + p.y * side];
    };
    const dsu = model.dsu;
    const maxS = stats.maxSize;
    const sizeOf = rootSizes();
    // closed edges first
    g.lineWidth = 1;
    g.strokeStyle = 'rgba(30,60,72,0.55)';
    g.beginPath();
    for (let e = 0; e < lat.m; e++) {
      if (model.open[e]) continue;
      const [x1, y1] = pos(lat.eu[e]);
      const [x2, y2] = pos(lat.ev[e]);
      g.moveTo(x1, y1);
      g.lineTo(x2, y2);
    }
    g.stroke();
    // open edges, coloured by cluster
    for (let e = 0; e < lat.m; e++) {
      if (!model.open[e]) continue;
      if (!model.occ[lat.eu[e]] || !model.occ[lat.ev[e]]) continue;
      const [x1, y1] = pos(lat.eu[e]);
      const [x2, y2] = pos(lat.ev[e]);
      const r = dsu.find(lat.eu[e]);
      g.strokeStyle = clusterColor(sizeOf.get(r) || 1, maxS, 0.9);
      g.lineWidth = 1.2;
      g.beginPath();
      g.moveTo(x1, y1);
      g.lineTo(x2, y2);
      g.stroke();
    }
    // sites
    for (let v = 0; v < lat.n; v++) {
      const [x, y] = pos(v);
      if (!model.occ[v]) {
        g.fillStyle = '#0c141a';
        g.fillRect(x - 1, y - 1, 2, 2);
      } else {
        const r = dsu.find(v);
        g.fillStyle = clusterColor(sizeOf.get(r) || 1, maxS, 1);
        g.fillRect(x - 1.2, y - 1.2, 2.4, 2.4);
      }
    }
    g.strokeStyle = 'rgba(96,190,210,0.2)';
    g.strokeRect(ox - 6, oy - 6, side + 12, side + 12);
  }

  function applyControls() {
    rebuild();
    resample();
  }

  root.querySelector('#lat-kind').addEventListener('change', (e) => {
    state.kind = e.target.value;
    if (state.kind === 'honeycomb' && state.L % 2) state.L = 64;
    applyControls();
  });
  root.querySelector('#lat-mode').addEventListener('change', (e) => {
    state.mode = e.target.value;
    applyControls();
  });
  root.querySelector('#lat-size').addEventListener('change', (e) => {
    state.L = parseInt(e.target.value, 10);
    applyControls();
  });
  bindRange('lat-p-slider', (v) => {
    state.p = v;
    resample();
  }, (v) => v.toFixed(3));
  root.querySelector('#lat-resample').addEventListener('click', resample);
  root.querySelector('#lat-sweep').addEventListener('click', () => {
    if (sweeping) {
      clearInterval(sweeping);
      sweeping = null;
      return;
    }
    let p = 0.1;
    sweeping = setInterval(() => {
      p += 0.004;
      if (p > 0.85) {
        clearInterval(sweeping);
        sweeping = null;
        return;
      }
      state.p = p;
      const input = document.getElementById('lat-p');
      if (input) {
        input.value = String(p);
        document.getElementById('lat-p-slider-val').textContent = p.toFixed(3);
      }
      resample();
    }, 90);
  });

  const onResize = () => draw();
  window.addEventListener('resize', onResize);

  applyControls();

  return () => {
    window.removeEventListener('resize', onResize);
    if (sweeping) clearInterval(sweeping);
  };
}
