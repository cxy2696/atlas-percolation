/** Theme controller and canvas palette.
 *
 *  The stylesheet owns the colours; this module only resolves the CSS custom
 *  properties for canvas code (which cannot use CSS variables directly) and
 *  keeps the choice in localStorage.  Every laboratory subscribes with
 *  `onTheme` and redraws, so switching theme never requires a page reload.
 */

const KEY = 'atlas-theme-v3';
const META = { dark: '#0e1316', light: '#f6f2e9' };

export function currentTheme() {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export function setTheme(theme, persist = true) {
  const next = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', META[next]);
  if (persist) {
    try {
      localStorage.setItem(KEY, next);
    } catch (e) {
      /* private mode */
    }
  }
  window.dispatchEvent(new CustomEvent('atlas:theme', { detail: { theme: next } }));
  return next;
}

export function toggleTheme() {
  return setTheme(currentTheme() === 'light' ? 'dark' : 'light');
}

export function initTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem(KEY);
  } catch (e) {
    /* private mode */
  }
  let forced = null;
  try {
    forced = new URLSearchParams(location.search).get('theme');
  } catch (e) {
    /* ignore */
  }
  const theme = forced === 'light' || forced === 'dark' ? forced : saved === 'light' || saved === 'dark' ? saved : 'light';
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', META[theme]);
  return theme;
}

export function onTheme(fn) {
  const handler = (e) => fn(e.detail.theme);
  window.addEventListener('atlas:theme', handler);
  return () => window.removeEventListener('atlas:theme', handler);
}

/** Resolve all canvas colours from the active stylesheet. */
export function palette() {
  const s = getComputedStyle(document.documentElement);
  const v = (name, fallback) => {
    const value = s.getPropertyValue(name).trim();
    return value || fallback;
  };
  return {
    theme: currentTheme(),
    bg: v('--canvas-bg', '#050a0e'),
    bg2: v('--canvas-bg-2', '#081018'),
    panel: v('--panel', '#0b1219'),
    grid: v('--grid', 'rgba(96,190,210,0.16)'),
    gridFaint: v('--grid-faint', 'rgba(96,190,210,0.08)'),
    cyan: v('--cyan', '#4fe3ea'),
    cyanDim: v('--cyan-dim', '#2b9aa6'),
    amber: v('--amber', '#ffb454'),
    red: v('--red', '#ff5f6d'),
    green: v('--green', '#6ef0a8'),
    violet: v('--violet', '#b18cff'),
    ink: v('--text', '#cfdae2'),
    dim: v('--text-dim', '#7d909c'),
    faint: v('--text-faint', '#4d5f6a'),
    closed: v('--node-closed', '#16242b'),
    paper: v('--paper', '#ffffff'),
  };
}

/** Run `draw` now and after every theme switch; returns an unsubscribe fn. */
export function redrawOnTheme(draw) {
  draw();
  return onTheme(draw);
}

export function themeLabel(lang) {
  const light = currentTheme() === 'light';
  const labels = {
    en: light ? 'Light' : 'Dark',
    zh: light ? '明亮' : '深色',
    de: light ? 'Hell' : 'Dunkel',
  };
  return (labels[lang] || labels.en);
}

/** Convert a hex colour from the stylesheet into rgba(..., alpha). */
export function withAlpha(hex, alpha) {
  const s = String(hex || '').trim();
  const m = s.match(/^#?([0-9a-f]{6})$/i);
  if (!m) return s;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}
