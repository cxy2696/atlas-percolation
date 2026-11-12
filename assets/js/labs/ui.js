/** Shared lab scaffolding: panels, controls, readouts, canvases. */
import { t } from '../i18n.js';
import { guideHTML } from './guides.js';
import { palette } from '../theme.js';

export function fmt(x, d = 3) {
  if (!isFinite(x)) return '—';
  if (x === 0) return '0';
  const a = Math.abs(x);
  if (a >= 1e5 || a < 1e-3) return x.toExponential(2);
  return x.toFixed(d);
}

export function control({ id, label, min, max, step, value, unit = '', help = '' }) {
  return `<div class="control">
    <label for="${id}"><span>${label}</span><b id="${id}-val">${value}${unit}</b></label>
    <input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" />
    ${help ? `<span class="help">${help}</span>` : ''}
  </div>`;
}

export function select({ id, label, options, value, help = '' }) {
  return `<div class="control">
    <label for="${id}"><span>${label}</span></label>
    <select id="${id}">
      ${options.map((o) => `<option value="${o.value}" ${o.value === value ? 'selected' : ''}>${o.label}</option>`).join('')}
    </select>
    ${help ? `<span class="help">${help}</span>` : ''}
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

export function labHead({ kicker, title, lead, lang = 'en', guide = '', actions = '' }) {
  return `<div class="view-head">
    <div><div class="kicker">${kicker}</div><h2>${title}</h2></div>
    <div class="meta">${t(lang, 'lab_badge')}</div>
  </div>
  ${actions ? `<div class="lab-toolbar">${actions}</div>` : ''}
  <p class="muted" style="max-width:820px;line-height:1.7;margin:10px 0 12px">${lead}</p>
  ${guide ? guideHTML(guide, lang) : ''}`;
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
  'var(--cyan)', // largest
  'var(--amber)', // second
  'var(--cyan-dim)',
  'var(--text-dim)',
  'var(--text-faint)',
  'var(--node-closed)',
  'var(--node-closed)',
];

function hexRgb(hex, fallback) {
  const m = String(hex || '').trim().match(/^#?([0-9a-f]{6})$/i);
  if (!m) return fallback;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Colour for a cluster of size s given the largest size; theme aware. */
export function clusterColor(s, maxS, alpha = 1, C = null) {
  const p = C || palette();
  const parse = (hex) => hexRgb(hex, [79, 227, 234]);
  if (s === maxS) {
    const [r, g, b] = parse(p.cyan);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  if (s > maxS * 0.35) {
    const [r, g, b] = parse(p.amber);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  const [r0, g0, b0] = parse(p.cyanDim);
  const [r1, g1, b1] = parse(p.closed);
  const t = Math.min(1, Math.log2(1 + s) / Math.log2(1 + Math.max(2, maxS)));
  const r = Math.round(r0 + (r1 - r0) * t * 0.6);
  const g = Math.round(g0 + (g1 - g0) * t * 0.6);
  const b = Math.round(b0 + (b1 - b0) * t * 0.6);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}


/** Copy text, with a graceful fallback for non-secure contexts. */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (err) {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}

/** Download a CSV from rows of arrays. */
export function downloadCSV(filename, rows) {
  const body = rows
    .map((row) => row.map((cell) => {
      const s = String(cell ?? '');
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(','))
    .join('\n');
  const blob = new Blob([body], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Read a numeric/string query parameter with a default. */
export function queryNumber(query, key, fallback) {
  const raw = query && query[key];
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

export function queryChoice(query, key, allowed, fallback) {
  const raw = query && query[key];
  return allowed.includes(raw) ? raw : fallback;
}

/** Toast-like confirmation next to a button. */
export function flashButton(btn, text, ms = 1400) {
  if (!btn) return;
  const old = btn.textContent;
  btn.textContent = text;
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = old;
    btn.disabled = false;
  }, ms);
}
