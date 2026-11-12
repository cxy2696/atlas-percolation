import { cardyCrossing, cardyHypergeom, cardyModulus, CARDY_CONSTANT } from '../../../lib/js/index.js';
import { labHead, panel, canvasBox, readout, fmt, setText } from './ui.js';
import { drawPlot, PALETTE } from '../lib/plot.js';
import { t } from '../i18n.js';
import { palette, onTheme, withAlpha } from '../theme.js';

const LABELS = {
  en: {
    kicker: 'lab 07 · conformal',
    title: 'Cardy’s crossing formula',
    lead: 'The exact left–right crossing probability of a critical rectangle as a function of ℓ = H/W. The curve is Cardy’s hypergeometric formula evaluated through the elliptic modulus; the dots are measured square-lattice crossings at p = 1/2. Both pass through 1/2 at ℓ = 1.',
    curve: 'π(ℓ) with measured points',
    shape: 'Boundary condition',
    reading: 'Readout',
    aspect: 'Aspect ratio ℓ = H/W',
    pi: 'π(ℓ)',
    hyper: '₂F₁(1/3,2/3;4/3;m)',
    constant: 'Prefactor C',
    note: 'm solves ℓ = K(m)/K(1−m). At ℓ = 1, m = 1/2. P(ℓ) = C m^(1/3) ₂F₁(1/3,2/3;4/3;m); for ℓ > 1 use P(ℓ) = 1 − P(1/ℓ).',
  },
  zh: {
    kicker: '实验 07 · 共形',
    title: 'Cardy 横穿公式',
    lead: '临界矩形的左右横穿概率作为 ℓ = H/W 的精确函数。曲线是经椭圆模数计算的 Cardy 超几何公式；散点是方格子在 p = 1/2 的实测横穿率。两者都在 ℓ = 1 处经过 1/2。',
    curve: 'π(ℓ) 与实测点',
    shape: '边界条件',
    reading: '读数',
    aspect: '纵横比 ℓ = H/W',
    pi: 'π(ℓ)',
    hyper: '₂F₁(1/3,2/3;4/3;m)',
    constant: '前置常数 C',
    note: 'm 满足 ℓ = K(m)/K(1−m)；ℓ = 1 时 m = 1/2。P(ℓ) = C m^(1/3) ₂F₁(1/3,2/3;4/3;m)，ℓ > 1 时用 P(ℓ) = 1 − P(1/ℓ)。',
  },
  de: {
    kicker: 'Labor 07 · konform',
    title: 'Cardys Durchgangsformel',
    lead: 'Die exakte Links-rechts-Durchgangswahrscheinlichkeit eines kritischen Rechtecks als Funktion von ℓ = H/W. Die Kurve ist Cardys hypergeometrische Formel, ausgewertet über den Ellipsenmodul; die Punkte sind gemessene Durchgänge des Quadratgitters bei p = 1/2. Beide laufen bei ℓ = 1 durch 1/2.',
    curve: 'π(ℓ) mit Messpunkten',
    shape: 'Randbedingung',
    reading: 'Anzeige',
    aspect: 'Seitenverhältnis ℓ = H/W',
    pi: 'π(ℓ)',
    hyper: '₂F₁(1/3,2/3;4/3;m)',
    constant: 'Vorfaktor C',
    note: 'm löst ℓ = K(m)/K(1−m). Bei ℓ = 1 ist m = 1/2. P(ℓ) = C m^(1/3) ₂F₁(1/3,2/3;4/3;m); für ℓ > 1 gilt P(ℓ) = 1 − P(1/ℓ).',
  },
};

const LMIN = Math.log10(0.05);
const LMAX = Math.log10(10);

export function mount(root, ctx) {
  const { lang } = ctx;
  const L = LABELS[lang] || LABELS.en;
  root.innerHTML =
    labHead({ kicker: L.kicker, title: L.title, lead: L.lead, lang , guide: 'cardy' }) +
    `<div class="grid-lab">
      <div>
        ${canvasBox('cardy-plot', ['π(ℓ)', 'CARDY 1992 / SMIRNOV 2001', 'ℓ', ''])}
        <div style="height:12px"></div>
        ${canvasBox('cardy-shape', [t(lang, 'geometry'), t(lang, 'left_right'), '', ''])}
        <div class="grid-2" style="margin-top:12px">
          ${panel(L.curve, '')}
        </div>
      </div>
      <aside class="panel">
        <h3>${L.reading}</h3>
        ${readout('cardy-l-readout', L.aspect)}
        ${readout('cardy-pi', L.pi)}
        ${readout('cardy-h', L.hyper)}
        ${readout('cardy-c', L.constant)}
        ${readout('cardy-m', 'm')}
        <div class="control" style="margin-top:14px">
          <label><span>${L.aspect}</span><b id="cardy-l-val">1.00</b></label>
          <input id="cardy-l" type="range" min="0" max="1" step="0.005" value="0.5654" />
        </div>
        <p class="hint" style="margin-top:14px">${L.note}</p>
      </aside>
    </div>`;

  let measured = [];
  fetch('data/benchmarks.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (d && Array.isArray(d.cardy)) measured = d.cardy;
      draw();
    })
    .catch(() => {});

  function currentL() {
    const v = parseFloat(document.getElementById('cardy-l').value);
    return Math.pow(10, LMIN + v * (LMAX - LMIN));
  }

  function draw() {
    const l = currentL();
    const xs = [];
    const ys = [];
    for (let i = 0; i <= 220; i++) {
      const x = Math.pow(10, LMIN + (i / 220) * (LMAX - LMIN));
      xs.push(x);
      ys.push(cardyCrossing(x));
    }
    drawPlot(document.getElementById('cardy-plot'), {
      height: 260,
      xLabel: 'ℓ = H/W (log)',
      yLabel: 'π',
      xRange: [0.05, 10],
      logX: true,
      yRange: [0, 1],
      vlines: [{ x: 1, color: 'rgba(255,180,84,0.4)', label: 'ℓ = 1' }],
      series: [
        { x: xs, y: ys, color: PALETTE.cyan, width: 1.8 },
        {
          x: measured.map((m) => m.aspect),
          y: measured.map((m) => m.measured),
          color: PALETTE.amber,
          points: 2.6,
        },
        { x: [l], y: [cardyCrossing(l)], color: PALETTE.red, points: 5 },
      ],
    });
    drawShape(l);
    setText('cardy-l-readout', l >= 1 ? l.toFixed(2) : l.toFixed(3));
    setText('cardy-pi', fmt(cardyCrossing(l), 6));
    setText('cardy-h', fmt(cardyHypergeom(l), 6));
    setText('cardy-c', fmt(CARDY_CONSTANT, 6));
    setText('cardy-m', fmt(cardyModulus(l), 6));
    document.getElementById('cardy-l-val').textContent = l >= 1 ? l.toFixed(2) : l.toFixed(3);
  }

  function drawShape(l) {
    const canvas = document.getElementById('cardy-shape');
    const wrap = canvas.parentElement;
    const W = Math.max(280, wrap.clientWidth - 2);
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
    const maxW = Math.min(W - 120, 300);
    const maxH = H - 70;
    const scale = Math.min(maxW / 1, maxH / Math.max(l, 1e-6));
    const rw = Math.max(24, scale * 1);
    const rh = Math.max(24, scale * l);
    const x0 = (W - rw) / 2;
    const y0 = (H - rh) / 2 + 6;
    g.fillStyle = withAlpha(C.cyan, 0.07);
    g.fillRect(x0, y0, rw, rh);
    g.lineWidth = 1;
    g.strokeStyle = C.cyan;
    g.beginPath();
    g.moveTo(x0, y0);
    g.lineTo(x0, y0 + rh);
    g.moveTo(x0 + rw, y0);
    g.lineTo(x0 + rw, y0 + rh);
    g.stroke();
    g.strokeStyle = withAlpha(C.dim, 0.75);
    g.beginPath();
    g.moveTo(x0, y0);
    g.lineTo(x0 + rw, y0);
    g.moveTo(x0, y0 + rh);
    g.lineTo(x0 + rw, y0 + rh);
    g.stroke();
    g.fillStyle = C.dim;
    g.font = '9px monospace';
    g.fillText('W', x0 + rw / 2 - 3, y0 + rh + 14);
    g.save();
    g.translate(x0 - 10, y0 + rh / 2);
    g.rotate(-Math.PI / 2);
    g.fillText('H', 0, 0);
    g.restore();
    g.strokeStyle = C.amber;
    g.beginPath();
    g.moveTo(x0 - 16, y0 + rh / 2);
    g.lineTo(x0 + rw + 16, y0 + rh / 2);
    g.stroke();
    g.fillStyle = C.amber;
    g.beginPath();
    g.moveTo(x0 + rw + 16, y0 + rh / 2);
    g.lineTo(x0 + rw + 10, y0 + rh / 2 - 3);
    g.lineTo(x0 + rw + 10, y0 + rh / 2 + 3);
    g.fill();
    g.fillStyle = C.dim;
  }

  document.getElementById('cardy-l').addEventListener('input', draw);
  const onResize = () => draw();
  window.addEventListener('resize', onResize);
  const offTheme = onTheme(() => draw());
  draw();
  return () => {
    offTheme();
    window.removeEventListener('resize', onResize);
  };
}
