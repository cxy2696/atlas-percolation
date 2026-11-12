/** Control-room overview: live isometric lattice, exact thresholds, lab status. */
import { Rng, buildLattice, Percolation } from '../../../lib/js/index.js';
import { t } from '../i18n.js';
import { LABS } from '../labs/index.js';
import { drawPlot, PALETTE } from '../lib/plot.js';

const L = 32;
const PC = 0.5;
const PALETTE_CLUSTER = ['#4fe3ea', '#ffb454', '#57a9b8', '#3b7f8d', '#2c5f6b', '#204751', '#18363e'];

export async function render(root, ctx) {
  const { lang } = ctx;
  const T = (key) => t(lang, key);
  root.innerHTML = `
    <div class="dash">
      <header class="dash-head">
        <div>
          <div class="kicker">${T('overview_kicker')} · ${T('brand')}</div>
          <h2>${T('overview_title')}</h2>
          <p>${T('overview_lead')}</p>
        </div>
        <div class="dash-head-right">
          <span class="badge">${T('live')}</span>
          <span class="mono small">${T('seed')} 20241112 · XOSHIRO128**</span>
          <span class="mono small" id="dash-clock">--:--:--</span>
        </div>
      </header>

      <div class="dash-grid">
        <aside class="dash-col">
          <section class="panel dash-panel">
            <div class="panel-tag">${T('regime').toUpperCase()} / 01</div>
            <h3>${T('regime')}</h3>
            <div class="big-readout"><b id="dash-p">0.500</b><span>p</span></div>
            <div class="phase-line"><i id="dash-phase-dot"></i><b id="dash-phase">critical</b><span id="dash-ratio">1.080× p_c</span></div>
            <div class="control">
              <label for="dash-slider"><span>${T('occupancy')}</span><b id="dash-slider-val">0.500</b></label>
              <input id="dash-slider" type="range" min="0.20" max="0.82" step="0.002" value="0.50" />
            </div>
            <div class="btn-row">
              <button class="btn primary" id="dash-toggle">${T('pause_live')}</button>
              <button class="btn" id="dash-reset">${T('reset_live')}</button>
            </div>
            <div class="micro-chart"><canvas id="dash-mini"></canvas></div>
          </section>

          <section class="panel dash-panel">
            <div class="panel-tag">${T('exact_thresholds').toUpperCase()} / 02</div>
            <h3>${T('exact_thresholds')}</h3>
            <table class="hud-table compact">
              <thead><tr><th>${T('lattice_name')}</th><th>${T('bond_threshold')}</th></tr></thead>
              <tbody>
                <tr><td>${T('lattice_square')}</td><td class="ok">0.500000</td></tr>
                <tr><td>${T('lattice_triangular')}</td><td class="ok">0.347296</td></tr>
                <tr><td>${T('lattice_honeycomb')}</td><td class="ok">0.652704</td></tr>
                <tr><td>${T('lattice_bethe')}</td><td class="ok">1/(z−1)</td></tr>
              </tbody>
            </table>
            <p class="hint">${T('source_hint')}</p>
          </section>
        </aside>

        <section class="dash-stage panel">
          <div class="stage-head">
            <div><span class="stage-kicker">${T('geometry').toUpperCase()}</span><b>${T('live_lattice')}</b></div>
            <div class="stage-meta"><span id="dash-kind">${T('lattice_square')} · ${T('bond')}</span><span>32 × 32</span></div>
          </div>
          <div class="stage-canvas" id="dash-stage">
            <canvas id="dash-iso"></canvas>
            <div class="scanline"></div>
            <div class="stage-corner tl">DSU / PATH HALVING</div>
            <div class="stage-corner tr" id="dash-status">SAMPLING</div>
            <div class="stage-corner bl" id="dash-cross-label">LR —</div>
            <div class="stage-corner br">p_c = 0.5</div>
            <div class="stage-legend">
              <span><i style="background:#4fe3ea"></i>${T('largest')}</span>
              <span><i style="background:#ffb454"></i>${T('second')}</span>
              <span><i style="background:#57a9b8"></i>${T('closed')}</span>
              <span><i style="background:#16242b"></i>${T('empty')}</span>
            </div>
          </div>
          <div class="stage-foot">
            <div><span>${T('largest_cluster')}</span><b id="dash-smax">—</b></div>
            <div><span>${T('cluster_count')}</span><b id="dash-clusters">—</b></div>
            <div><span>${T('spanning')}</span><b id="dash-cross">—</b></div>
            <div><span>${T('phase_ratio')}</span><b id="dash-ratio2">—</b></div>
          </div>
        </section>

        <aside class="dash-col">
          <section class="panel dash-panel">
            <div class="panel-tag">${T('critical_exponents').toUpperCase()} / 03</div>
            <h3>${T('critical_exponents')}</h3>
            <table class="hud-table compact">
              <thead><tr><th>d=2</th><th>${T('value')}</th><th>${T('status')}</th></tr></thead>
              <tbody>
                <tr><td>β</td><td>5/36</td><td><span class="badge ok">${T('exact')}</span></td></tr>
                <tr><td>γ</td><td>43/18</td><td><span class="badge ok">${T('exact')}</span></td></tr>
                <tr><td>ν</td><td>4/3</td><td><span class="badge ok">${T('exact')}</span></td></tr>
                <tr><td>d_f</td><td>91/48</td><td><span class="badge ok">${T('exact')}</span></td></tr>
              </tbody>
            </table>
            <p class="hint">Triangular lattice · SLE₆ · <a href="#/${lang}/atlas/07-two-dimensions">Ch. 07</a></p>
          </section>

          <section class="panel dash-panel instruments-panel">
            <div class="panel-tag">${T('instruments').toUpperCase()} / 04</div>
            <h3>${T('instruments')}</h3>
            <div class="instrument-list">
              ${LABS.map((lab, i) => `<a href="#/${lang}/labs/${lab.id}"><span class="dot"></span><span class="idx">${String(i + 1).padStart(2, '0')}</span><b>${lab.title[lang] || lab.title.en}</b><span class="arrow">↗</span></a>`).join('')}
            </div>
          </section>
        </aside>
      </div>

      <footer class="dash-foot">
        <div class="module-links">
          <a href="#/${lang}/atlas"><b>01</b><span>${T('module_chapters')}</span><em>14</em></a>
          <a href="#/${lang}/labs"><b>02</b><span>${T('module_labs')}</span><em>${LABS.length}</em></a>
          <a href="#/${lang}/data"><b>03</b><span>${T('module_data')}</span><em>${T('module_data')}</em></a>
          <a href="#/${lang}/sources"><b>04</b><span>${T('module_sources')}</span><em>${ctx.manifest ? ctx.manifest.references || 0 : 0}</em></a>
        </div>
        <div class="dash-foot-note mono">${T('data_record')} · ${T('seed_word')} 20241112 · ${ctx.manifest ? ctx.manifest.references || 0 : 0} ${T('references')}</div>
      </footer>
    </div>`;

  const state = { p: 0.50, running: true, seed: 20241112, overlay: 0 };
  const rng = new Rng(state.seed);
  const lat = buildLattice('square', L);
  const model = new Percolation(lat, { mode: 'bond' });
  const canvas = root.querySelector('#dash-iso');
  const stage = root.querySelector('#dash-stage');
  let stats = null;
  let timer = null;
  let clockTimer = null;

  const fmt = (x, d = 3) => (Number.isFinite(x) ? x.toFixed(d) : '—');

  function resample() {
    stats = model.sample(state.p, rng).analyze();
    updateReadouts();
    draw();
  }

  function updateReadouts() {
    const ratio = state.p / PC;
    const phase = Math.abs(state.p - PC) < 0.012 ? 'critical' : state.p < PC ? 'subcritical' : 'supercritical';
    root.querySelector('#dash-p').textContent = fmt(state.p);
    root.querySelector('#dash-slider-val').textContent = fmt(state.p);
    root.querySelector('#dash-ratio').textContent = `${ratio.toFixed(3)}× p_c`;
    root.querySelector('#dash-ratio2').textContent = `${ratio.toFixed(3)}×`;
    const phaseLabel = phase === 'critical' ? T('critical_phase') : phase === 'subcritical' ? T('subcritical') : T('supercritical');
    const phaseEl = root.querySelector('#dash-phase');
    phaseEl.textContent = phaseLabel;
    phaseEl.dataset.phase = phase;
    const dot = root.querySelector('#dash-phase-dot');
    dot.dataset.phase = phase;
    const frac = stats.sum ? stats.maxSize / stats.sum : 0;
    root.querySelector('#dash-smax').textContent = frac.toFixed(3);
    root.querySelector('#dash-clusters').textContent = String(stats.count);
    const cross = model.crossesLR();
    root.querySelector('#dash-cross').textContent = cross ? T('yes') : T('no');
    root.querySelector('#dash-cross').className = cross ? 'ok' : '';
    root.querySelector('#dash-cross-label').textContent = `LR ${cross ? '✓' : '—'}`;
    root.querySelector('#dash-status').textContent = phase === 'critical' ? T('critical_phase').toUpperCase() : phase === 'subcritical' ? T('subcritical').toUpperCase() : T('stat_supercritical').toUpperCase();
  }

  function draw() {
    if (!stage || !stats) return;
    const W = Math.max(320, stage.clientWidth);
    const H = Math.max(260, stage.clientHeight);
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    const g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);

    const pad = 34;
    const s = Math.min((W - 2 * pad) / (L * 1.78), (H - 2 * pad) / (L * 1.10));
    const originX = W / 2;
    const originY = H * 0.30;
    const iso = (i, j, z = 0) => ({
      x: originX + (j - i) * s * 0.866,
      y: originY + (j + i) * s * 0.5 - z * s,
    });

    // Ground plane: faint diamond with concentric guide lines.
    const a = iso(0, 0), b = iso(0, L), c = iso(L, L), d = iso(L, 0);
    g.beginPath();
    g.moveTo(a.x, a.y);
    g.lineTo(b.x, b.y);
    g.lineTo(c.x, c.y);
    g.lineTo(d.x, d.y);
    g.closePath();
    g.fillStyle = 'rgba(9, 27, 35, 0.62)';
    g.fill();
    g.strokeStyle = 'rgba(79,227,234,0.18)';
    g.lineWidth = 1;
    g.stroke();

    // Grid on the ground.
    g.strokeStyle = 'rgba(79,227,234,0.055)';
    g.beginPath();
    for (let k = 0; k <= L; k += 4) {
      const p1 = iso(0, k), p2 = iso(L, k);
      g.moveTo(p1.x, p1.y);
      g.lineTo(p2.x, p2.y);
      const q1 = iso(k, 0), q2 = iso(k, L);
      g.moveTo(q1.x, q1.y);
      g.lineTo(q2.x, q2.y);
    }
    g.stroke();

    const dsu = model.dsu;
    const rootSize = new Map();
    for (let v = 0; v < lat.n; v++) {
      if (!model.occ[v]) continue;
      const r = dsu.find(v);
      rootSize.set(r, (rootSize.get(r) || 0) + 1);
    }
    const maxS = stats.maxSize;
    const colorOf = (root) => {
      const size = rootSize.get(root) || 1;
      if (size === maxS) return PALETTE_CLUSTER[0];
      if (size > maxS * 0.45) return PALETTE_CLUSTER[1];
      const idx = Math.min(PALETTE_CLUSTER.length - 1, 2 + (Math.log2(1 + size) | 0) % 5);
      return PALETTE_CLUSTER[idx];
    };
    const faces = [];
    for (let i = 0; i < L; i++) {
      for (let j = 0; j < L; j++) {
        const v = i * L + j;
        faces.push({ i, j, v, z: i + j });
      }
    }
    faces.sort((u, v) => u.z - v.z || u.j - v.j);

    for (const { i, j, v } of faces) {
      const open = !!model.occ[v];
      const root = dsu.find(v);
      const size = rootSize.get(root) || 0;
      const h = open
        ? 0.35 + Math.min(3.1, Math.sqrt(size / Math.max(1, maxS)) * 3.2) + (((i * 17 + j * 11) % 7) / 7) * 0.55
        : 0.12;
      const p0 = iso(i, j, 0);
      const p1 = iso(i, j, h);
      const half = s * 0.39;
      const top = [
        { x: p1.x, y: p1.y - half * 0.5 },
        { x: p1.x + half * 0.866, y: p1.y },
        { x: p1.x, y: p1.y + half * 0.5 },
        { x: p1.x - half * 0.866, y: p1.y },
      ];
      const left = [top[3], top[2], { x: top[2].x, y: top[2].y + h * s }, { x: top[3].x, y: top[3].y + h * s }];
      const right = [top[2], top[1], { x: top[1].x, y: top[1].y + h * s }, { x: top[2].x, y: top[2].y + h * s }];
      const col = open ? colorOf(root) : '#0d171d';
      // side faces
      g.fillStyle = open ? shade(col, -0.52) : '#091116';
      poly(g, left);
      g.fillStyle = open ? shade(col, -0.34) : '#0b1419';
      poly(g, right);
      // top face
      g.fillStyle = open ? shade(col, -0.05) : '#0e1a21';
      poly(g, top);
      g.strokeStyle = open ? 'rgba(180,255,255,0.22)' : 'rgba(70,120,140,0.10)';
      g.lineWidth = 0.5;
      poly(g, top, true);
      if (open && size === maxS) {
        g.strokeStyle = 'rgba(79,227,234,0.65)';
        g.lineWidth = 0.9;
        poly(g, top, true);
      }
    }

    // Open bonds between neighbouring occupied sites, drawn on the roof plane.
    for (let e = 0; e < lat.m; e++) {
      if (!model.open[e]) continue;
      const a0 = lat.eu[e];
      const b0 = lat.ev[e];
      if (!model.occ[a0] || !model.occ[b0]) continue;
      const i = Math.floor(a0 / L), j = a0 % L;
      const ii = Math.floor(b0 / L), jj = b0 % L;
      const size = rootSize.get(dsu.find(a0)) || 1;
      const h = 0.42 + Math.min(3.1, Math.sqrt(size / Math.max(1, maxS)) * 3.2) + (((i * 17 + j * 11) % 7) / 7) * 0.55;
      const p1 = iso(i, j, h);
      const p2 = iso(ii, jj, h);
      g.strokeStyle = size === maxS ? 'rgba(79,227,234,0.42)' : 'rgba(255,180,84,0.25)';
      g.lineWidth = size === maxS ? 1.1 : 0.7;
      g.beginPath();
      g.moveTo(p1.x, p1.y);
      g.lineTo(p2.x, p2.y);
      g.stroke();
    }

    // boundary rails
    g.strokeStyle = 'rgba(255,180,84,0.34)';
    g.lineWidth = 1;
    for (let k = 0; k <= L; k += 8) {
      const p1 = iso(0, k, 0.05), p2 = iso(0, k, 1.0);
      g.beginPath(); g.moveTo(p1.x, p1.y); g.lineTo(p2.x, p2.y); g.stroke();
      const q1 = iso(L, k, 0.05), q2 = iso(L, k, 1.0);
      g.beginPath(); g.moveTo(q1.x, q1.y); g.lineTo(q2.x, q2.y); g.stroke();
    }

  }

  function poly(g, pts, strokeOnly = false) {
    g.beginPath();
    g.moveTo(pts[0].x, pts[0].y);
    for (let k = 1; k < pts.length; k++) g.lineTo(pts[k].x, pts[k].y);
    g.closePath();
    if (strokeOnly) g.stroke();
    else g.fill();
  }

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) & 255, gg = (n >> 8) & 255, b = n & 255;
    if (amt < 0) { r *= 1 + amt; gg *= 1 + amt; b *= 1 + amt; }
    else { r += (255 - r) * amt; gg += (255 - gg) * amt; b += (255 - b) * amt; }
    return `rgb(${r | 0},${gg | 0},${b | 0})`;
  }

  function drawMini() {
    const el = root.querySelector('#dash-mini');
    if (!el) return;
    const xs = [], ys = [];
    for (let i = 0; i <= 80; i++) {
      const p = 0.36 + (0.28 * i) / 80;
      xs.push(p);
      ys.push(1 / (1 + Math.exp(-(p - 0.5) * 62)));
    }
    drawPlot(el, {
      height: 66,
      xRange: [0.36, 0.64],
      yRange: [0, 1],
      xTicks: [0.4, 0.5, 0.6],
      yTicks: [0, 1],
      vlines: [{ x: state.p, color: 'rgba(255,180,84,0.7)', label: '' }],
      series: [{ x: xs, y: ys, color: PALETTE.cyan, width: 1.2 }],
    });
  }

  function updateClock() {
    const el = root.querySelector('#dash-clock');
    if (el) el.textContent = new Date().toTimeString().slice(0, 8);
  }

  root.querySelector('#dash-slider').addEventListener('input', (e) => {
    state.p = parseFloat(e.target.value);
    resample();
    drawMini();
  });
  root.querySelector('#dash-toggle').addEventListener('click', (e) => {
    state.running = !state.running;
    e.target.textContent = state.running ? T('pause_live') : T('sweep_live');
    if (state.running) startTimer(); else stopTimer();
  });
  root.querySelector('#dash-reset').addEventListener('click', () => {
    state.p = 0.50;
    state.seed = 20241112;
    root.querySelector('#dash-slider').value = '0.50';
    resample();
    drawMini();
  });

  function startTimer() {
    stopTimer();
    timer = setInterval(() => { if (state.running) resample(); }, 1400);
  }
  function stopTimer() { if (timer) clearInterval(timer); timer = null; }

  const onResize = () => { draw(); drawMini(); };
  window.addEventListener('resize', onResize);
  updateClock();
  clockTimer = setInterval(updateClock, 1000);
  resample();
  drawMini();
  startTimer();
  ctx.setStatus(T('status_ready'), `OVERVIEW · ${L}×${L} · SEED ${state.seed}`);

  return () => {
    stopTimer();
    if (clockTimer) clearInterval(clockTimer);
    window.removeEventListener('resize', onResize);
  };
}
