/** Shared lab scaffolding: panels, controls, readouts, canvases. */
import { t } from '../i18n.js';

export function fmt(x, d = 3) {
  if (!isFinite(x)) return '—';
  if (x === 0) return '0';
  const a = Math.abs(x);
  if (a >= 1e5 || a < 1e-3) return x.toExponential(2);
  return x.toFixed(d);
}

export function control({ id, label, min, max, step, value, unit = '' }) {
  return `<div class="control">
    <label for="${id}"><span>${label}</span><b id="${id}-val">${value}${unit}</b></label>
    <input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" />
  </div>`;
}

export function select({ id, label, options, value }) {
  return `<div class="control">
    <label for="${id}"><span>${label}</span></label>
    <select id="${id}">
      ${options.map((o) => `<option value="${o.value}" ${o.value === value ? 'selected' : ''}>${o.label}</option>`).join('')}
    </select>
  </div>`;
}

export function readout(id, label, cls = '') {
  return `<div class="readout ${cls}"><span>${label}</span><b id="${id}">—</b></div>`;
}

export function panel(title, inner) {
  return `<section class="panel"><h3>${title}</h3>${inner}</section>`;
}

export function canvasBox(id, corners = ['', '', '', '']) {
  return `<div class="canvas-wrap">
    <canvas id="${id}"></canvas>
    <span class="corner tl">${corners[0]}</span>
    <span class="corner tr">${corners[1]}</span>
    <span class="corner bl">${corners[2]}</span>
    <span class="corner br">${corners[3]}</span>
  </div>`;
}

export function labHead({ kicker, title, lead, lang = 'en' }) {
  return `<div class="view-head">
    <div><div class="kicker">${kicker}</div><h2>${title}</h2></div>
    <div class="meta">${t(lang, 'lab_badge')}</div>
  </div>
  <p class="muted" style="max-width:820px;line-height:1.7;margin:-4px 0 20px">${lead}</p>`;
}

/** Bind a range input to a live value label; returns the input element. */
export function bindRange(id, onInput, fmtFn = (v) => v) {
  const input = document.getElementById(id);
  const out = document.getElementById(`${id}-val`);
  const update = () => {
    out.textContent = fmtFn(parseFloat(input.value));
    onInput(parseFloat(input.value));
  };
  input.addEventListener('input', update);
  return input;
}

/** Canvas sizing with device pixel ratio; returns {ctx, w, h, dpr}. */
export function fitCanvas(canvas, cssW, cssH) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  canvas.style.width = '100%';
  canvas.style.height = 'auto';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: cssW, h: cssH, dpr };
}

export const CLUSTER_COLORS = [
  '#4fe3ea', // largest
  '#ffb454', // second
  '#3f8fa0',
  '#2f6a78',
  '#274f5a',
  '#1e3a43',
  '#182b32',
];

/** Colour for a cluster of size s given the largest size. */
export function clusterColor(s, maxS, alpha = 1) {
  if (s === maxS) return `rgba(79,227,234,${alpha})`;
  if (s > maxS * 0.35) return `rgba(255,180,84,${alpha})`;
  const t = Math.min(1, Math.log2(1 + s) / Math.log2(1 + Math.max(2, maxS)));
  const r = Math.round(40 + 30 * t);
  const g = Math.round(90 + 50 * t);
  const b = Math.round(105 + 60 * t);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
