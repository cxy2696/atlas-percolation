import { getChapterMarkdown, renderMarkdown, enhanceArticle } from '../content.js';
import { t, partName } from '../i18n.js';

let refCache = null;
let citeCache = null;

async function getReferences() {
  if (!refCache) {
    const r = await fetch('content/references.json', { cache: 'no-cache' });
    if (!r.ok) throw new Error('references missing');
    refCache = await r.json();
  }
  return refCache;
}

async function getCitations() {
  if (!citeCache) {
    const r = await fetch('content/citations.json', { cache: 'no-cache' });
    if (!r.ok) throw new Error('citations missing');
    citeCache = await r.json();
  }
  return citeCache;
}

function head(lang, kicker, title, meta = '') {
  return `<div class="view-head">
    <div><div class="kicker">${kicker}</div><h2>${title}</h2></div>
    <div class="meta">${meta}</div>
  </div>`;
}

export async function render(root, ctx) {
  if (ctx.param) return renderReader(root, ctx);
  return renderIndex(root, ctx);
}

function renderIndex(root, ctx) {
  const { lang, manifest } = ctx;
  const chapters = manifest.chapters;
  root.innerHTML =
    head(
      lang,
      t(lang, 'atlas_kicker'),
      t(lang, 'atlas_title'),
      `${chapters.length} ${t(lang, 'chapters')}<br>EN · 中文 · DE`
    ) +
    `<p class="muted" style="max-width:760px;line-height:1.7;margin-top:-6px">${t(lang, 'atlas_lead')}</p>` +
    `<div class="cards" style="margin-top:22px">` +
    chapters
      .map(
        (ch) => `<a class="card" href="#/${lang}/atlas/${ch.id}">
          <span class="idx">${String(ch.order).padStart(2, '0')}</span>
          <div class="tag">${partName(lang, ch.part)}</div>
          <h4>${ch.title[lang] || ch.title.en}</h4>
          <p>${ch.subtitle[lang] || ch.subtitle.en}</p>
          <div class="hint" style="margin-top:10px">${(ch.reading && ch.reading[lang]) || ch.reading?.en || 10} ${t(lang, 'min')}</div>
        </a>`
      )
      .join('') +
    `</div>`;
  ctx.setStatus(t(lang, 'status_ready'), `${chapters.length} ${t(lang, 'chapters')} · INDEX`);
  return null;
}

async function renderReader(root, ctx) {
  const { lang, manifest, param } = ctx;
  const idx = manifest.chapters.findIndex((c) => c.id === param);
  if (idx < 0) {
    root.innerHTML = head(lang, '404', t(lang, 'not_found_chapter'), '') + `<p class="muted">${param}</p>`;
    return null;
  }
  const ch = manifest.chapters[idx];
  const md = await getChapterMarkdown(lang, ch.id);

  root.innerHTML =
    `<div class="reader-grid">
      <article class="article" id="article">
        <div class="doc-meta">
          <span>CH <b>${String(ch.order).padStart(2, '0')}</b></span>
          <span><b>${partName(lang, ch.part)}</b></span>
          <span><b>${(ch.reading && ch.reading[lang]) || 10} ${t(lang, 'min')}</b></span>
          <span><b>${lang.toUpperCase()}</b></span>
        </div>
        <h1>${ch.title[lang] || ch.title.en}</h1>
        <div class="subtitle">${ch.subtitle[lang] || ch.subtitle.en}</div>
        <div id="docbody"></div>
        <section class="chapter-sources" id="chapter-sources" hidden></section>
        <div class="pager" id="pager"></div>
      </article>
      <nav class="toc" id="toc" aria-label="${t(lang, 'toc')}"></nav>
    </div>`;

  const body = root.querySelector('#docbody');
  body.innerHTML = renderMarkdown(md);
  const toc = enhanceArticle(body);

  renderChapterSources(root, lang, ch.id, manifest);

  const tocEl = root.querySelector('#toc');
  tocEl.innerHTML =
    `<div class="rail-title" style="padding:0 0 8px">${t(lang, 'toc')}</div>` +
    toc.map((e) => `<a href="#${e.id}" data-toc="${e.id}">${e.text}</a>`).join('');

  tocEl.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      const target = body.querySelector(`#${CSS.escape(a.dataset.toc)}`);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#/${lang}/atlas/${ch.id}`);
    });
  });

  const prev = manifest.chapters[idx - 1];
  const next = manifest.chapters[idx + 1];
  root.querySelector('#pager').innerHTML =
    (prev ? `<a href="#/${lang}/atlas/${prev.id}">← ${t(lang, 'prev')}<br><span class="mono small">${prev.title[lang] || prev.title.en}</span></a>` : '<span></span>') +
    (next ? `<a href="#/${lang}/atlas/${next.id}" style="text-align:right">${t(lang, 'next')} →<br><span class="mono small">${next.title[lang] || next.title.en}</span></a>` : '<span></span>');

  ctx.setStatus(t(lang, 'status_ready'), `CH ${String(ch.order).padStart(2, '0')} · ${toc.length} ${t(lang, 'sections')} · ${lang.toUpperCase()}`);

  // track the section in view
  const obs = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          tocEl.querySelectorAll('a').forEach((a) => a.classList.toggle('active', a.dataset.toc === e.target.id));
        }
      }
    },
    { rootMargin: '-10% 0px -80% 0px' }
  );
  body.querySelectorAll('h2').forEach((h) => obs.observe(h));

  return () => obs.disconnect();
}

async function renderChapterSources(root, lang, chapterId, manifest) {
  const host = root.querySelector('#chapter-sources');
  if (!host) return;
  try {
    const [refs, citations] = await Promise.all([getReferences(), getCitations()]);
    const ids = citations[chapterId] || [];
    if (!ids.length) return;
    const byId = new Map(refs.entries.map((e) => [e.id, e]));
    const list = ids.map((id) => byId.get(id)).filter(Boolean);
    if (!list.length) return;
    host.hidden = false;
    host.innerHTML = `
      <div class="sources-head">
        <h2>${t(lang, 'source_for_chapter')}</h2>
        <a href="#/${lang}/sources">${t(lang, 'sources_title')} →</a>
      </div>
      <p class="hint">${t(lang, 'source_hint')}</p>
      <ol class="chapter-source-list">
        ${list.map((e) => `<li>
          <span class="source-year">${e.year}</span>
          <span class="source-cite">${e.authors.join(', ')}. <em>${e.title}</em>. ${e.venue}${e.volume ? ` ${e.volume}` : ''}${e.pages ? `, ${e.pages}` : ''}.</span>
          ${e.doi ? `<a class="doi" href="https://doi.org/${e.doi}" target="_blank" rel="noopener noreferrer">DOI</a>` : ''}
        </li>`).join('')}
      </ol>`;
  } catch (err) {
    host.hidden = true;
  }
}
