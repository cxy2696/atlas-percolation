/** Minimal HUD line plot on a canvas, no dependencies. */

export const PALETTE = {
  cyan: '#4fe3ea',
  amber: '#ffb454',
  red: '#ff5f6d',
  green: '#6ef0a8',
  violet: '#b18cff',
  dim: '#3b5a66',
  text: '#7d909c',
  faint: '#4d5f6a',
};

const FONT = '9px SFMono-Regular, Menlo, Consolas, monospace';

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

function fmtTick(v) {
  if (v === 0) return '0';
  const a = Math.abs(v);
  if (a >= 1000) return v.toExponential(0);
  if (a >= 10) return v.toFixed(0);
  if (a >= 1) return v.toFixed(1);
  if (a >= 0.01) return v.toFixed(2);
  return v.toExponential(1);
}

export function drawPlot(canvas, spec) {
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

  const m = { l: 48, r: 12, t: 12, b: 30 };
  const W = cssW - m.l - m.r;
  const H = cssH - m.t - m.b;

  const xr = spec.xRange || [0, 1];
  const yr = spec.yRange || [0, 1];
  const logX = !!spec.logX;
  const logY = !!spec.logY;
  const sx = (x) => {
    const t = logX ? (Math.log10(x) - Math.log10(xr[0])) / (Math.log10(xr[1]) - Math.log10(xr[0])) : (x - xr[0]) / (xr[1] - xr[0]);
    return m.l + t * W;
  };
  const sy = (y) => {
    const t = logY ? (Math.log10(y) - Math.log10(yr[0])) / (Math.log10(yr[1]) - Math.log10(yr[0])) : (y - yr[0]) / (yr[1] - yr[0]);
    return m.t + H - t * H;
  };

  // frame
  ctx.strokeStyle = 'rgba(96,190,210,0.16)';
  ctx.lineWidth = 1;
  ctx.strokeRect(m.l + 0.5, m.t + 0.5, W, H);

  // grid + ticks
  ctx.font = FONT;
  ctx.fillStyle = PALETTE.text;
  const xt = spec.xTicks || (logX ? null : niceTicks(xr[0], xr[1], 6));
  const yt = spec.yTicks || niceTicks(yr[0], yr[1], 5);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  if (xt) {
    for (const x of xt) {
      const px = sx(x);
      ctx.strokeStyle = 'rgba(96,190,210,0.08)';
      ctx.beginPath();
      ctx.moveTo(px, m.t);
      ctx.lineTo(px, m.t + H);
      ctx.stroke();
      ctx.fillText(fmtTick(x), px, m.t + H + 6);
    }
  }
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (const y of yt) {
    const py = sy(y);
    ctx.strokeStyle = 'rgba(96,190,210,0.08)';
    ctx.beginPath();
    ctx.moveTo(m.l, py);
    ctx.lineTo(m.l + W, py);
    ctx.stroke();
    ctx.fillText(fmtTick(y), m.l - 8, py);
  }

  // axis labels
  ctx.fillStyle = PALETTE.faint;
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

  // vertical reference lines
  for (const v of spec.vlines || []) {
    const px = sx(v.x);
    ctx.strokeStyle = v.color || 'rgba(255,180,84,0.5)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(px, m.t);
    ctx.lineTo(px, m.t + H);
    ctx.stroke();
    ctx.setLineDash([]);
    if (v.label) {
      ctx.fillStyle = v.color || PALETTE.amber;
      ctx.textAlign = px > m.l + W * 0.7 ? 'right' : 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(v.label, px + (px > m.l + W * 0.7 ? -4 : 4), m.t + 3);
    }
  }

  // series
  for (const s of spec.series || []) {
    if (!s.x || s.x.length === 0) continue;
    ctx.strokeStyle = s.color || PALETTE.cyan;
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
      ctx.fillStyle = s.color || PALETTE.cyan;
      for (let i = 0; i < s.x.length; i++) {
        if (!isFinite(s.x[i]) || !isFinite(s.y[i])) continue;
        ctx.beginPath();
        ctx.arc(sx(s.x[i]), sy(s.y[i]), s.points === true ? 2.2 : s.points, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (s.marker) {
      const i = s.marker.index;
      if (i >= 0 && i < s.x.length) {
        ctx.strokeStyle = s.color || PALETTE.amber;
        ctx.beginPath();
        ctx.arc(sx(s.x[i]), sy(s.y[i]), 4, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
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
      ctx.strokeStyle = s.color || PALETTE.cyan;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 14, y);
      ctx.stroke();
      ctx.fillStyle = PALETTE.text;
      ctx.fillText(s.label, x + 18, y);
      x += 26 + ctx.measureText(s.label).width;
    }
  }
}
