/** Minimal HUD line plot on a canvas, no dependencies.
 *
 *  Colours are resolved from the active theme on every call, and the
 *  `PALETTE` proxy keeps older laboratories working without an import change.
 *  Spec fields:
 *    xRange, yRange, logX, logY, xLabel, yLabel, height, title, bg
 *    xTicks, yTicks, vlines, hlines
 *    series: [{x, y, err, color, width, dash, points, label, fill, band}]
 *    annotations: [{x, y, text, dx, dy, color, align}]
 */
import { palette } from '../theme.js';

let cache = null;
window.addEventListener('atlas:theme', () => {
  cache = null;
});
function P() {
  if (!cache) cache = palette();
  return cache;
}
export const PALETTE = new Proxy(
  {},
  {
    get(_target, key) {
      return P()[key];
    },
  }
);

const FONT = '9px SFMono-Regular, Menlo, Consolas, monospace';
const FONT_SMALL = '8.5px SFMono-Regular, Menlo, Consolas, monospace';

function niceTicks(a, b, n = 5) {
  if (!(isFinite(a) && isFinite(b)) || a === b) return [a];
  const span = b - a;
  const raw = span / n;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
  const start = Math.ceil(a / step) * step;
  const out = [];
  for (let v = start; v <= b + step * 1e-9; v += step) out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
  return out;
}

function logTicks(a, b) {
  const out = [];
  for (let e = Math.floor(Math.log10(a)); e <= Math.ceil(Math.log10(b)); e++) {
    for (const m of [1, 2, 5]) {
      const v = m * Math.pow(10, e);
      if (v >= a * 0.999 && v <= b * 1.001 && out.length < 8) out.push(v);
    }
  }
  return out;
}

function fmtTick(v) {
  if (v === 0) return '0';
  const a = Math.abs(v);
  if (a >= 1000) return v.toExponential(0);
  if (a >= 10) return v.toFixed(0);
  if (a >= 1) return v.toFixed(1);
  if (a >= 0.01) return v.toFixed(2);
  return v.toExponential(1);
}

function rgba(hex, alpha) {
  const s = String(hex || '').trim();
  const m = s.match(/^#?([0-9a-f]{6})$/i);
  if (!m) return s;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

export function drawPlot(canvas, spec) {
  const C = P();
  const dpr = window.devicePixelRatio || 1;
  const cssW = Math.max(240, canvas.parentElement.clientWidth - 2);
  const cssH = spec.height || 230;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  canvas.style.width = cssW + 'px';
  canvas.style.height = cssH + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);
  if (spec.bg) {
    ctx.fillStyle = spec.bg;
    ctx.fillRect(0, 0, cssW, cssH);
  }

  const topPad = spec.title ? 20 : 12;
  const m = { l: spec.xLabel ? 50 : 44, r: 14, t: topPad, b: spec.xLabel ? 42 : 30 };
  const W = cssW - m.l - m.r;
  const H = cssH - m.t - m.b;

  const xr = spec.xRange || [0, 1];
  const yr = spec.yRange || [0, 1];
  const logX = !!spec.logX;
  const logY = !!spec.logY;
  const sx = (x) => {
    const t = logX
      ? (Math.log10(x) - Math.log10(xr[0])) / (Math.log10(xr[1]) - Math.log10(xr[0]))
      : (x - xr[0]) / (xr[1] - xr[0]);
    return m.l + t * W;
  };
  const sy = (y) => {
    const t = logY
      ? (Math.log10(y) - Math.log10(yr[0])) / (Math.log10(yr[1]) - Math.log10(yr[0]))
      : (y - yr[0]) / (yr[1] - yr[0]);
    return m.t + H - t * H;
  };

  if (spec.title) {
    ctx.fillStyle = C.ink;
    ctx.font = FONT;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(spec.title, m.l, 3);
  }

  // frame
  ctx.strokeStyle = C.grid;
  ctx.lineWidth = 1;
  ctx.strokeRect(m.l + 0.5, m.t + 0.5, W, H);

  // grid + ticks
  ctx.font = FONT;
  ctx.fillStyle = C.dim;
  const xt = spec.xTicks || (logX ? logTicks(xr[0], xr[1]) : niceTicks(xr[0], xr[1], 6));
  const yt = spec.yTicks || (logY ? logTicks(yr[0], yr[1]) : niceTicks(yr[0], yr[1], 5));
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (const x of xt) {
    const px = sx(x);
    ctx.strokeStyle = C.gridFaint;
    ctx.beginPath();
    ctx.moveTo(px, m.t);
    ctx.lineTo(px, m.t + H);
    ctx.stroke();
    ctx.fillText(fmtTick(x), px, m.t + H + 6);
  }
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (const y of yt) {
    const py = sy(y);
    ctx.strokeStyle = C.gridFaint;
    ctx.beginPath();
    ctx.moveTo(m.l, py);
    ctx.lineTo(m.l + W, py);
    ctx.stroke();
    ctx.fillText(fmtTick(y), m.l - 8, py);
  }

  // axis labels
  ctx.fillStyle = C.faint;
  ctx.font = FONT_SMALL;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  if (spec.xLabel) ctx.fillText(spec.xLabel, m.l + W / 2, cssH - 1);
  if (spec.yLabel) {
    ctx.save();
    ctx.translate(10, m.t + H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(spec.yLabel, 0, 0);
    ctx.restore();
  }

  // horizontal reference lines
  for (const h of spec.hlines || []) {
    const py = sy(h.y);
    ctx.strokeStyle = h.color || rgba(C.amber, 0.5);
    ctx.setLineDash(h.dash || [3, 3]);
    ctx.beginPath();
    ctx.moveTo(m.l, py);
    ctx.lineTo(m.l + W, py);
    ctx.stroke();
    ctx.setLineDash([]);
    if (h.label) {
      ctx.fillStyle = h.color || C.amber;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(h.label, m.l + W - 3, py - 2);
    }
  }

  // vertical reference lines
  for (const v of spec.vlines || []) {
    const px = sx(v.x);
    ctx.strokeStyle = v.color || rgba(C.amber, 0.55);
    ctx.setLineDash(v.dash || [3, 3]);
    ctx.beginPath();
    ctx.moveTo(px, m.t);
    ctx.lineTo(px, m.t + H);
    ctx.stroke();
    ctx.setLineDash([]);
    if (v.label) {
      ctx.fillStyle = v.color || C.amber;
      ctx.textAlign = px > m.l + W * 0.7 ? 'right' : 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(v.label, px + (px > m.l + W * 0.7 ? -4 : 4), m.t + 3);
    }
  }

  // series
  for (const s of spec.series || []) {
    if (!s.x || s.x.length === 0) continue;
    const color = s.color || C.cyan;

    // confidence band before the centre line
    if (s.band) {
      const lo = s.band.lower || [];
      const hi = s.band.upper || [];
      ctx.fillStyle = s.band.color || rgba(color, 0.12);
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < lo.length; i++) {
        if (!isFinite(s.x[i]) || !isFinite(lo[i])) continue;
        const px = sx(s.x[i]);
        const py = sy(lo[i]);
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else ctx.lineTo(px, py);
      }
      for (let i = hi.length - 1; i >= 0; i--) {
        if (!isFinite(s.x[i]) || !isFinite(hi[i])) continue;
        ctx.lineTo(sx(s.x[i]), sy(hi[i]));
      }
      if (started) {
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = s.width || 1.5;
    if (s.dash) ctx.setLineDash(s.dash);
    ctx.beginPath();
    let started = false;
    for (let i = 0; i < s.x.length; i++) {
      const x = s.x[i];
      const y = s.y[i];
      if (!isFinite(x) || !isFinite(y) || (logY && y <= 0) || (logX && x <= 0)) continue;
      const px = sx(x);
      const py = sy(y);
      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    if (s.points) {
      ctx.fillStyle = color;
      for (let i = 0; i < s.x.length; i++) {
        if (!isFinite(s.x[i]) || !isFinite(s.y[i])) continue;
        ctx.beginPath();
        ctx.arc(sx(s.x[i]), sy(s.y[i]), s.points === true ? 2.2 : s.points, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (s.err) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      for (let i = 0; i < s.x.length; i++) {
        const e = s.err[i];
        if (!isFinite(s.x[i]) || !isFinite(s.y[i]) || !isFinite(e) || e <= 0) continue;
        const px = sx(s.x[i]);
        const y0 = sy(Math.max(yr[0], s.y[i] - e));
        const y1 = sy(Math.min(yr[1], s.y[i] + e));
        ctx.beginPath();
        ctx.moveTo(px, y0);
        ctx.lineTo(px, y1);
        ctx.moveTo(px - 2.5, y0);
        ctx.lineTo(px + 2.5, y0);
        ctx.moveTo(px - 2.5, y1);
        ctx.lineTo(px + 2.5, y1);
        ctx.stroke();
      }
    }

    if (s.marker) {
      const i = s.marker.index;
      if (i >= 0 && i < s.x.length) {
        ctx.strokeStyle = s.color || C.amber;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(sx(s.x[i]), sy(s.y[i]), 4.5, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  // annotations
  for (const a of spec.annotations || []) {
    if (!isFinite(a.x) || !isFinite(a.y)) continue;
    const px = sx(a.x) + (a.dx || 0);
    const py = sy(a.y) + (a.dy || 0);
    ctx.fillStyle = a.color || C.text || C.ink;
    ctx.font = FONT_SMALL;
    ctx.textAlign = a.align || 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(a.text, px, py);
  }

  // legend
  if (spec.series && spec.series.some((s) => s.label)) {
    let x = m.l + 8;
    const y = m.t + 10;
    ctx.font = FONT;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    for (const s of spec.series) {
      if (!s.label) continue;
      ctx.strokeStyle = s.color || C.cyan;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 14, y);
      ctx.stroke();
      ctx.fillStyle = C.dim;
      ctx.fillText(s.label, x + 18, y);
      x += 26 + ctx.measureText(s.label).width;
    }
  }
}
