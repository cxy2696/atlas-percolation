/** Searchable primary-source bibliography with DOI links and chapter cross-links. */
import { t } from '../i18n.js';

const TOPICS = [
  'foundations', 'core', 'critical', 'networks', 'methods', 'applications',
  'continuum', 'epidemics', 'transport', 'reference',
];

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function topicsOf(entry) {
  const raw = (entry.topics || []).map((x) => String(x).toLowerCase());
  const out = new Set(raw);
  if (out.has('foundations') || out.has('history')) out.add('foundations');
  if (out.has('rigorous') || out.has('fkg') || out.has('sharpness') || out.has('uniqueness') || out.has('duality') || out.has('rsw') || out.has('thresholds')) out.add('core');
  if (out.has('two-dimensions') || out.has('sle') || out.has('cardy') || out.has('high-dimensions') || out.has('lace-expansion') || out.has('random-cluster') || out.has('exponents') || out.has('three-dimensions')) out.add('critical');
  if (out.has('networks') || out.has('robustness') || out.has('cascades') || out.has('k-core')) out.add('networks');
  if (out.has('algorithms') || out.has('measurement')) out.add('methods');
  if (out.has('applications') || out.has('continuum') || out.has('epidemics') || out.has('transport')) out.add('applications');
  return [...out];
}

function cite(entry) {
  const auth = entry.authors.join('; ');
  const vol = entry.volume ? ` ${entry.volume}` : '';
  const pages = entry.pages ? `, ${entry.pages}` : '';
  const doi = entry.doi ? ` https://doi.org/${entry.doi}` : '';
  return `${auth} (${entry.year}). ${entry.title}. ${entry.venue}${vol}${pages}.${doi}`;
}

export async function render(root, ctx) {
  const { lang, manifest } = ctx;
  const T = (key) => t(lang, key);
  let data = null;
  let citations = {};
  try {
    const [r1, r2] = await Promise.all([
      fetch('content/references.json', { cache: 'no-cache' }),
      fetch('content/citations.json', { cache: 'no-cache' }),
    ]);
    if (r1.ok) data = await r1.json();
    if (r2.ok) citations = await r2.json();
  } catch (e) { /* handled below */ }

  root.innerHTML = `
    <div class="view-head">
      <div><div class="kicker">${T('sources_kicker')}</div><h2>${T('sources_title')}</h2></div>
      <div class="meta" id="src-meta">—</div>
    </div>
    <p class="muted" style="max-width:820px;line-height:1.7;margin-top:-6px">${T('sources_lead')}</p>
    <div class="searchbox">
      <span class="mono" style="color:#2b9aa6">⌕</span>
      <input id="src-q" type="search" placeholder="${T('search_sources')}" autocomplete="off" />
      <kbd>/</kbd>
    </div>
    <div class="topic-row" id="src-topics"></div>
    <div id="src-results"></div>`;

  if (!data || !Array.isArray(data.entries)) {
    root.querySelector('#src-results').innerHTML = `<div class="panel"><p class="mono small">content/references.json missing. Run <code>python3 scripts/build_content.py</code>.</p></div>`;
    return null;
  }

  const entries = data.entries.slice();
  const titleOf = (chapterId) => {
    const ch = manifest?.chapters?.find((c) => c.id === chapterId);
    return ch ? ch.title[lang] || ch.title.en : chapterId;
  };
  const usedBy = new Map();
  for (const [chapterId, ids] of Object.entries(citations)) {
    for (const id of ids) {
      if (!usedBy.has(id)) usedBy.set(id, []);
      usedBy.get(id).push(chapterId);
    }
  }

  const meta = root.querySelector('#src-meta');
  meta.innerHTML = `${entries.length} ${T('references')}<br>${T('updated')} ${esc(data.updated || '')}`;

  const topics = ['all', ...TOPICS.filter((topic) => entries.some((e) => topicsOf(e).includes(topic)))];
  let activeTopic = 'all';
  let query = '';
  const results = root.querySelector('#src-results');
  const topicEl = root.querySelector('#src-topics');

  const topicLabel = (topic) => topic === 'all' ? T('all_topics') : T(`topic_${topic}`) !== `topic_${topic}` ? T(`topic_${topic}`) : topic;

  function drawTopics() {
    topicEl.innerHTML = topics.map((topic) => `<button type="button" class="chip ${topic === activeTopic ? 'active' : ''}" data-topic="${topic}">${topicLabel(topic)}</button>`).join('');
    topicEl.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
      activeTopic = b.dataset.topic;
      drawTopics();
      draw();
    }));
  }

  function matches(entry, tokens) {
    const hay = `${entry.authors.join(' ')} ${entry.title} ${entry.venue} ${entry.year} ${(entry.topics || []).join(' ')}`.toLowerCase();
    return tokens.every((tok) => hay.includes(tok));
  }

  function draw() {
    const tokens = query.toLowerCase().split(/\s+/).filter((x) => x.length > 1);
    const filtered = entries
      .filter((entry) => activeTopic === 'all' || topicsOf(entry).includes(activeTopic))
      .filter((entry) => !tokens.length || matches(entry, tokens))
      .sort((a, b) => a.authors[0].localeCompare(b.authors[0]) || a.year - b.year);
    meta.innerHTML = `${filtered.length} / ${entries.length} ${T('references')}<br>${T('updated')} ${esc(data.updated || '')}`;
    if (!filtered.length) {
      results.innerHTML = `<p class="muted small">${T('no_sources')}</p>`;
      return;
    }
    results.innerHTML = filtered.map((entry) => {
      const chapters = (usedBy.get(entry.id) || []).slice(0, 5);
      return `<article class="source-card" data-id="${esc(entry.id)}">
        <div class="source-top">
          <span class="badge">${esc(entry.type || 'source')}</span>
          <span class="mono">${esc(entry.year)}</span>
          <button class="copy-btn" data-copy="${esc(cite(entry))}" title="${T('copy_citation')}">${T('copy')}</button>
        </div>
        <h3>${esc(entry.title)}</h3>
        <p class="source-authors">${esc(entry.authors.join(' · '))}</p>
        <p class="source-venue">${esc(entry.venue)}${entry.volume ? ` · ${esc(entry.volume)}` : ''}${entry.pages ? ` · ${esc(entry.pages)}` : ''}</p>
        <div class="source-bottom">
          ${entry.doi ? `<a class="doi" href="https://doi.org/${esc(entry.doi)}" target="_blank" rel="noopener noreferrer">DOI ${esc(entry.doi)}</a>` : ''}
          ${chapters.length ? `<span class="source-used">${T('used_in')}: ${chapters.map((id) => `<a href="#/${lang}/atlas/${esc(id)}">${esc(titleOf(id))}</a>`).join(' · ')}</span>` : ''}
        </div>
      </article>`;
    }).join('');
    results.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(b.dataset.copy);
        const old = b.textContent;
        b.textContent = T('citation_copied');
        setTimeout(() => { b.textContent = old; }, 1500);
      } catch (e) { /* clipboard may be unavailable */ }
    }));
  }

  root.querySelector('#src-q').addEventListener('input', (e) => {
    query = e.target.value.trim();
    draw();
  });
  drawTopics();
  draw();
  ctx.setStatus(t(lang, 'status_ready'), `SOURCES · ${entries.length} ${T('references')}`);
  return null;
}
