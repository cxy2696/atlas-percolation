import { LANGS, t, partName } from './i18n.js';
import { getManifest } from './content.js';
import * as guide from './views/guide.js';
import * as overview from './views/dashboard.js';
import * as atlas from './views/atlas.js';
import * as labs from './views/labs.js';
import * as code from './views/code.js';
import * as algorithms from './views/algorithms.js';
import * as data from './views/data.js';
import * as library from './views/library.js';
import * as sources from './views/sources.js';
import { LABS } from './labs/index.js';
import { ALGORITHM_ORDER, ALGORITHM_GUIDE } from './lib/algorithm-guide.js';
import { initTheme, toggleTheme, themeLabel, onTheme } from './theme.js';

const VIEWS = { guide, overview, atlas, labs, code, algorithms, data, library, sources };
const state = { lang: 'en', view: 'overview', param: null, manifest: null, cleanup: null };

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, search = ''] = raw.split('?');
  const query = Object.fromEntries(new URLSearchParams(search));
  const parts = path.split('/').filter(Boolean);
  const saved = localStorage.getItem('atlas-lang-v3');
  let lang = LANGS.includes(parts[0]) ? parts[0] : LANGS.includes(saved) ? saved : 'en';
  const view = parts[1] && VIEWS[parts[1]] ? parts[1] : 'guide';
  const param = parts.slice(2).join('/') || null;
  return { lang, view, param, query };
}

function go(lang, view, param, query) {
  const qs = query && Object.keys(query).length ? '?' + new URLSearchParams(query).toString() : '';
  const target = `#/${lang}/${view}${param ? '/' + param : ''}${qs}`;
  if (location.hash === target) route();
  else location.hash = target;
}

function updateThemeButton() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const label = themeLabel(state.lang);
  btn.querySelector('.theme-text').textContent = label;
  btn.setAttribute('aria-label', `${label} · switch colour theme`);
  btn.setAttribute('title', `${label} · switch colour theme`);
}

function setStatus(mode, info) {
  const m = document.getElementById('status-mode');
  const i = document.getElementById('status-info');
  if (m) m.textContent = mode;
  if (i) i.textContent = info;
}

function buildRail() {
  const rail = document.getElementById('rail');
  const lang = state.lang;
  const bits = [];
  if (state.view === 'overview' || state.view === 'guide') {
    rail.innerHTML = '';
    return;
  }
  if (state.view === 'algorithms') {
    bits.push(`<div class="rail-title">${t(lang, 'algorithms_title')}</div>`);
    ALGORITHM_ORDER.forEach((id, i) => {
      const meta = ALGORITHM_GUIDE[id];
      const title = meta.title[lang] || meta.title.en;
      const active = state.param === id;
      bits.push(
        `<a href="#/${lang}/algorithms/${id}" class="${active ? 'active' : ''}">` +
          `<span class="num">${String(i + 1).padStart(2, '0')}</span>${title}</a>`
      );
    });
    rail.innerHTML = bits.join('');
    return;
  }
  if (state.view === 'labs') {
    bits.push(`<div class="rail-title">${t(lang, 'labs_title')}</div>`);
    LABS.forEach((lab, i) => {
      const active = state.param === lab.id;
      bits.push(
        `<a href="#/${lang}/labs/${lab.id}" class="${active ? 'active' : ''}">` +
          `<span class="num">${String(i + 1).padStart(2, '0')}</span>${lab.title[lang] || lab.title.en}</a>`
      );
    });
    rail.innerHTML = bits.join('');
    return;
  }
  bits.push(`<div class="rail-title">${t(lang, 'chapters')}</div>`);
  const chapters = state.manifest ? state.manifest.chapters : [];
  let lastPart = null;
  for (const ch of chapters) {
    if (ch.part !== lastPart) {
      lastPart = ch.part;
      bits.push(`<div class="group">${partName(lang, ch.part)}</div>`);
    }
    const active = state.view === 'atlas' && state.param === ch.id;
    bits.push(
      `<a href="#/${lang}/atlas/${ch.id}" class="${active ? 'active' : ''}">` +
        `<span class="num">${String(ch.order).padStart(2, '0')}</span>${ch.title[lang] || ch.title.en}</a>`
    );
  }
  rail.innerHTML = bits.join('');
}

function buildNav() {
  const nav = document.getElementById('topnav');
  const items = [
    ['guide', 'nav_guide'],
    ['overview', 'nav_overview'],
    ['atlas', 'nav_atlas'],
    ['labs', 'nav_labs'],
    ['code', 'nav_code'],
    ['algorithms', 'nav_algorithms'],
    ['data', 'nav_data'],
    ['library', 'nav_library'],
    ['sources', 'nav_sources'],
  ];
  nav.innerHTML = items
    .map(([v, key]) => `<a href="#/${state.lang}/${v}" data-view="${v}">${t(state.lang, key)}</a>`)
    .join('');
  document.getElementById('brand')?.remove();
  const h1 = document.querySelector('.brand h1');
  if (h1) h1.textContent = t(state.lang, 'brand');
}

function tickClock() {
  const el = document.getElementById('status-clock');
  if (el) {
    const d = new Date();
    el.textContent = d.toTimeString().slice(0, 8);
  }
}

async function route() {
  const { lang, view, param, query } = parseHash();
  state.lang = lang;
  state.view = view;
  state.param = param;
  localStorage.setItem('atlas-lang-v3', lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
  document.body.dataset.view = view;
  document.title = `${t(lang, 'brand')} — ${t(lang, view === 'overview' ? 'nav_overview' : `nav_${view}`)}`;

  buildNav();
  buildRail();
  updateThemeButton();
  document.querySelectorAll('.topnav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.view === view);
  });
  document.querySelectorAll('.langswitch button').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
  });

  const main = document.getElementById('view');
  if (state.cleanup) {
    try {
      state.cleanup();
    } catch (e) {
      /* ignore */
    }
    state.cleanup = null;
  }
  main.innerHTML = '';
  main.scrollTop = 0;

  try {
    state.cleanup = await VIEWS[view].render(main, {
      lang,
      manifest: state.manifest,
      param,
      query,
      go: (v, p, q) => go(lang, v, p, q),
      setStatus,
    });
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    main.innerHTML = `
      <div class="view-head"><div><div class="kicker">error</div><h2>${t(lang, 'error_title')}</h2></div></div>
      <div class="panel"><p class="mono small">${String(err.message || err)}</p>
      <p class="hint">${t(lang, 'error_hint')}</p></div>`;
  }

  if (new URLSearchParams(location.search).get('guide') === 'open') {
    main.querySelectorAll('details.guide').forEach((d) => { d.open = true; });
  }
  const n = state.manifest ? state.manifest.chapters.length : 0;
  setStatus(t(lang, 'status_ready'), `${n} ${t(lang, 'chapters')} · ${state.manifest ? state.manifest.languages.length : 3} LANG · ${lang.toUpperCase()}`);
}

async function boot() {
  initTheme();
  try {
    state.manifest = await getManifest();
  } catch (err) {
    console.warn('manifest missing', err);
  }
  window.addEventListener('hashchange', route);
  document.querySelectorAll('.langswitch button').forEach((b) => {
    b.addEventListener('click', () => {
      const cur = parseHash();
      go(b.dataset.lang, cur.view, cur.param, cur.query);
    });
  });
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    toggleTheme();
    updateThemeButton();
  });
  onTheme(() => {
    updateThemeButton();
    if (state.view === 'data') route();
  });
  document.addEventListener('click', (e) => {
    const tab = e.target.closest('.guide-tabs button');
    if (!tab) return;
    const box = tab.closest('.guide');
    if (!box) return;
    box.querySelectorAll('.guide-tabs button').forEach((b) => b.classList.toggle('active', b === tab));
    box.querySelectorAll('.guide-pane').forEach((p) => p.classList.toggle('active', p.dataset.pane === tab.dataset.tab));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement?.tagName || '')) {
      const input = document.querySelector('.searchbox input');
      if (input) {
        e.preventDefault();
        input.focus();
      }
    }
  });
  tickClock();
  setInterval(tickClock, 1000);
  route();
}

boot();
