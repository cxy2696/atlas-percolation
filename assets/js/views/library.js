import { t } from '../i18n.js';

function score(entry, tokens) {
  const hay = (entry.heading + ' ' + entry.text).toLowerCase();
  let total = 0;
  for (const tok of tokens) {
    let n = 0;
    let i = hay.indexOf(tok);
    while (i !== -1) {
      n++;
      i = hay.indexOf(tok, i + tok.length);
    }
    if (n === 0) return 0;
    total += n;
  }
  const head = entry.heading.toLowerCase();
  if (tokens.some((tk) => head.includes(tk))) total += 8;
  return total;
}

function snippet(entry, token) {
  const text = entry.text.replace(/\s+/g, ' ');
  const i = text.toLowerCase().indexOf(token);
  if (i < 0) return text.slice(0, 160) + '…';
  const start = Math.max(0, i - 70);
  return (start > 0 ? '…' : '') + text.slice(start, i + 110) + '…';
}

function highlight(text, tokens) {
  let out = text.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  for (const tk of tokens) {
    if (!tk) continue;
    const re = new RegExp(`(${tk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
    out = out.replace(re, '<mark>$1</mark>');
  }
  return out;
}

export async function render(root, ctx) {
  const { lang } = ctx;
  root.innerHTML =
    `<div class="view-head">
      <div><div class="kicker">${t(lang, 'library_kicker')}</div><h2>${t(lang, 'library_title')}</h2></div>
      <div class="meta" id="lib-count">—</div>
    </div>
    <p class="muted" style="max-width:780px;line-height:1.7;margin-top:-6px">${t(lang, 'library_lead')}</p>
    <div class="searchbox">
      <span class="mono" style="color:#2b9aa6">⌕</span>
      <input id="lib-q" type="search" placeholder="${t(lang, 'search_placeholder')}" autocomplete="off" />
      <kbd>/</kbd>
    </div>
    <div id="lib-results"></div>`;

  let index = null;
  try {
    const r = await fetch('content/search.json', { cache: 'no-cache' });
    if (r.ok) index = await r.json();
  } catch (e) {
    /* ignore */
  }

  const input = root.querySelector('#lib-q');
  const results = root.querySelector('#lib-results');
  const count = root.querySelector('#lib-count');

  if (!index) {
    results.innerHTML = `<p class="mono small">content/search.json missing. Run <code>python3 scripts/build_content.py</code>.</p>`;
    return null;
  }

  const entries = index.entries.filter((e) => e.lang === lang);
  count.innerHTML = `${entries.length} ${t(lang, 'sections')}<br>${lang.toUpperCase()}`;

  function showAll() {
    const byChapter = new Map();
    for (const e of entries) {
      if (!byChapter.has(e.chapter)) byChapter.set(e.chapter, []);
      byChapter.get(e.chapter).push(e);
    }
    results.innerHTML = `<div class="rail-title" style="padding:0 0 10px;color:#4d5f6a;font-family:var(--mono);font-size:9px;letter-spacing:.2em">${t(lang, 'all_sections')}</div>` +
      [...byChapter.entries()]
        .map(
          ([ch, list]) => `<div style="margin-bottom:14px">
            <div class="path" style="font-family:var(--mono);font-size:10px;color:#7d909c;margin-bottom:4px">
              <a href="#/${lang}/atlas/${ch}" style="color:#4fe3ea;text-decoration:none">${list[0].chapterTitle}</a>
            </div>
            ${list
              .map(
                (e) =>
                  `<a href="#/${lang}/atlas/${ch}" style="display:block;color:#8fa4b0;text-decoration:none;font-size:13px;padding:3px 0 3px 14px;border-left:1px solid rgba(96,190,210,0.16)">${e.heading}</a>`
              )
              .join('')}
          </div>`
        )
        .join('');
  }

  function search(q) {
    const tokens = q.toLowerCase().split(/\s+/).filter((x) => x.length > 1);
    if (!tokens.length) {
      showAll();
      return;
    }
    const hits = entries
      .map((e) => ({ e, s: score(e, tokens) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 40);
    if (!hits.length) {
      results.innerHTML = `<p class="muted small">${t(lang, 'search_empty')}</p>`;
      return;
    }
    count.innerHTML = `${hits.length} ${t(lang, 'results')}<br>${lang.toUpperCase()}`;
    results.innerHTML = hits
      .map(
        ({ e }) => `<div class="result">
          <div class="path">${e.chapterTitle}</div>
          <a href="#/${lang}/atlas/${e.chapter}">${highlight(e.heading, tokens)}</a>
          <div class="snippet">${highlight(snippet(e, tokens[0]), tokens)}</div>
        </div>`
      )
      .join('');
  }

  input.addEventListener('input', () => search(input.value.trim()));
  showAll();
  ctx.setStatus(t(lang, 'status_ready'), `INDEX · ${entries.length} ${t(lang, 'sections')}`);
  return null;
}
