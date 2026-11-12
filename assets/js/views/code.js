/** Source browser for the four reference libraries. */
import { t } from '../i18n.js';

const ORDER = ['javascript', 'python', 'cpp', 'julia'];
const LABELS = { javascript: 'JavaScript', python: 'Python', cpp: 'C++', julia: 'Julia' };
const INITIAL = {
  javascript: 'lib/js/engine/percolation.js',
  python: 'lib/python/percolation_atlas/percolation.py',
  cpp: 'lib/cpp/include/percolation_atlas/percolation.hpp',
  julia: 'lib/julia/src/percolation.jl',
};

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export async function render(root, ctx) {
  const { lang, query } = ctx;
  const T = (k) => t(lang, k);
  root.innerHTML = `
    <div class="view-head">
      <div><div class="kicker">${T('code_kicker')}</div><h2>${T('code_title')}</h2></div>
      <div class="meta">4 LANGUAGES<br>1 RNG CONTRACT<br><a href="#/${lang}/algorithms" style="color:var(--cyan)">${T('nav_algorithms')} ↗</a></div>
    </div>
    <p class="muted" style="max-width:840px;line-height:1.7;margin-top:-6px">${T('code_lead')}</p>
    <div class="code-workbench">
      <aside class="code-side">
        <div class="code-tabs" id="code-langs">
          ${ORDER.map((id, i) => `<button type="button" data-lang="${id}" class="${i === 0 ? 'active' : ''}">${LABELS[id]}</button>`).join('')}
        </div>
        <div class="file-tree" id="file-tree">
          <p class="hint" style="padding:10px">${T('loading')}</p>
        </div>
      </aside>
      <section class="code-pane">
        <div class="code-pane-head">
          <div><b id="code-path">—</b><span id="code-meta"></span></div>
          <button class="btn copy-code" id="code-copy">${T('code_copy')}</button>
        </div>
        <pre class="code-body" id="code-body"><code>${T('loading')}</code></pre>
      </section>
    </div>
    <div class="grid-2" style="margin-top:18px">
      <section class="panel">
        <h3>${T('code_parity_title')}</h3>
        <p class="small muted" style="line-height:1.7;margin:0">${T('code_contract_lead')}</p>
        <p class="hint" style="margin-top:10px">data/golden/rng-seed42.json · data/golden/parity.json · docs/RNG.md</p>
      </section>
      <section class="panel">
        <h3>${T('code_run_title')}</h3>
        <pre class="mono small" style="margin:0;color:var(--text-dim);white-space:pre-wrap">make test
make bench
python3 scripts/analyse_bench.py
python3 scripts/build_content.py</pre>
      </section>
    </div>
    <div class="grid-2" style="margin-top:14px">
      <section class="panel">
        <h3>${T('code_package_title')}</h3>
        <p class="hint" style="margin-top:0">${T('code_package_lead')}</p>
        <pre class="mono small" style="margin:8px 0 0;color:var(--text-dim);white-space:pre-wrap">python3 -m pip install -e lib/python
atlas-perc info
atlas-perc sample --L 128 --p 0.5 --seed 42
atlas-perc bootstrap --L 64 --p 0.55 --r 3 --seed 11
atlas-perc invasion --L 48 --seed 3
atlas-perc explosive --n 2000 --seed 7</pre>
      </section>
      <section class="panel">
        <h3>${T('code_api_title')}</h3>
        <p class="hint" style="margin-top:0">${T('code_api_lead')}</p>
        <pre class="mono small" style="margin:8px 0 0;color:var(--text-dim);white-space:pre-wrap">atlas-perc serve --port 8080
GET  /api/health
GET  /api/thresholds
POST /api/sample
POST /api/sweep
POST /api/bootstrap
POST /api/invasion
POST /api/explosive
GET  /api/openapi.json</pre>
      </section>
    </div>
    <p class="hint" style="margin-top:12px">${T('code_audit_note')} · <a href="https://github.com/cxy2696/atlas-percolation/blob/main/docs/API.md" target="_blank" rel="noopener noreferrer">docs/API.md</a></p>`;

  const body = root.querySelector('#code-body');
  const pathEl = root.querySelector('#code-path');
  const metaEl = root.querySelector('#code-meta');
  const treeEl = root.querySelector('#file-tree');
  const langEl = root.querySelector('#code-langs');
  let inventory = null;
  const requested = query && query.file ? decodeURIComponent(query.file) : '';
  let activeLang = 'javascript';
  if (requested.includes('/python/') || requested.startsWith('lib/python/')) activeLang = 'python';
  else if (requested.includes('/cpp/') || requested.startsWith('lib/cpp/')) activeLang = 'cpp';
  else if (requested.includes('/julia/') || requested.startsWith('lib/julia/')) activeLang = 'julia';
  let activeFile = requested || INITIAL[activeLang];
  langEl.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.lang === activeLang));
  let sourceText = '';

  try {
    const r = await fetch('content/code.json', { cache: 'no-cache' });
    if (r.ok) inventory = await r.json();
  } catch (e) { /* fallback below */ }

  const fallback = {
    languages: ORDER.map((id) => ({
      id,
      group: `lib/${id}`,
      files: [{ path: INITIAL[id], bucket: 'core', lines: 0, bytes: 0 }],
    })),
  };
  const data = inventory && inventory.languages ? inventory : fallback;

  function filesOf(id) {
    const entry = data.languages.find((l) => l.id === id);
    return entry ? entry.files : [];
  }

  function drawTree() {
    const files = filesOf(activeLang);
    const groups = { core: [], tests: [] };
    for (const f of files) groups[f.bucket === 'tests' ? 'tests' : 'core'].push(f);
    treeEl.innerHTML = Object.entries(groups)
      .filter(([, list]) => list.length)
      .map(([bucket, list]) => `<div class="file-group">
        <div class="file-group-title">${bucket === 'tests' ? T('code_group_tests') : T('code_group_core')}</div>
        ${list.map((f) => `<button type="button" class="file-item ${f.path === activeFile ? 'active' : ''}" data-path="${esc(f.path)}">
          <span>${esc(f.path.split('/').slice(-1)[0])}</span><em>${f.lines}</em>
        </button>`).join('')}
      </div>`).join('');
    treeEl.querySelectorAll('[data-path]').forEach((b) => b.addEventListener('click', () => {
      show(b.dataset.path);
    }));
  }

  async function show(path) {
    activeFile = path;
    drawTree();
    body.textContent = T('loading');
    pathEl.textContent = path;
    metaEl.textContent = '';
    try {
      const r = await fetch(path, { cache: 'no-cache' });
      if (!r.ok) throw new Error(String(r.status));
      sourceText = await r.text();
      const lines = sourceText.split('\n');
      const maxDigits = String(lines.length).length;
      body.innerHTML = lines.map((line, i) => `<span class="code-line"><span class="ln">${String(i + 1).padStart(maxDigits, ' ')}</span>${esc(line)}</span>`).join('\n');
      metaEl.textContent = `${lines.length} ${T('code_lines')}`;
      body.scrollTop = 0;
    } catch (err) {
      sourceText = '';
      body.textContent = `${T('code_source_missing')}: ${path}`;
    }
  }

  langEl.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
    activeLang = b.dataset.lang;
    langEl.querySelectorAll('button').forEach((x) => x.classList.toggle('active', x === b));
    activeFile = INITIAL[activeLang] || filesOf(activeLang)[0]?.path;
    const noteKeys = {
      javascript: 'code_note_javascript', python: 'code_note_python',
      cpp: 'code_note_cpp', julia: 'code_note_julia',
    };
    pathEl.dataset.note = T(noteKeys[activeLang]);
    drawTree();
    if (activeFile) show(activeFile);
  }));

  root.querySelector('#code-copy').addEventListener('click', async (e) => {
    if (!sourceText) return;
    try {
      await navigator.clipboard.writeText(sourceText);
      const old = e.target.textContent;
      e.target.textContent = T('code_copied');
      setTimeout(() => { e.target.textContent = old; }, 1400);
    } catch (err) { /* clipboard unavailable */ }
  });

  drawTree();
  if (activeFile) await show(activeFile);
  ctx.setStatus(t(lang, 'status_ready'), 'CODE · 4 LANGUAGES · PARITY');
  return null;
}
