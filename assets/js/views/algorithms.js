/** Algorithm reader: idea, invariant, cost, code notes and the exact source. */
import { t } from '../i18n.js';
import { ALGORITHM_ORDER, ALGORITHM_GUIDE, guideFor } from '../lib/algorithm-guide.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export async function render(root, ctx) {
  const { lang, param } = ctx;
  const T = (k) => t(lang, k);
  const active = ALGORITHM_ORDER.includes(param) ? param : ALGORITHM_ORDER[0];
  const g = guideFor(active, lang);

  const list = ALGORITHM_ORDER.map((id, i) => {
    const entry = ALGORITHM_GUIDE[id];
    const title = entry.title[lang] || entry.title.en;
    return `<a href="#/${lang}/algorithms/${id}" class="${id === active ? 'active' : ''}">
      <span class="idx">${String(i + 1).padStart(2, '0')}</span>
      <span><b>${esc(title)}</b><em>${esc(entry.tag[lang] || entry.tag.en)}</em></span>
    </a>`;
  }).join('');

  const steps = g.steps.map((s) => `<li>${esc(s)}</li>`).join('');
  const complexity = g.complexity.map(([k, v]) => `<tr><td>${esc(k)}</td><td class="num">${esc(v)}</td></tr>`).join('');
  const notes = g.notes.map(([fn, note]) => `<dt><code>${esc(fn)}</code></dt><dd>${esc(note)}</dd>`).join('');
  const pitfalls = g.pitfalls.map((p) => `<li>${esc(p)}</li>`).join('');
  const sources = g.code.map((c) => `<a class="algo-source" href="#/${lang}/code?file=${encodeURIComponent(c.path)}">${esc(c.label)} <span class="mono">${esc(c.path)}</span> ↗</a>`).join('');
  const tests = g.tests.map((p) => `<code>${esc(p)}</code>`).join(' · ');

  const rows = ALGORITHM_ORDER.map((id) => {
    const e = ALGORITHM_GUIDE[id];
    const first = (e.complexity[lang] || e.complexity.en)[0];
    const mem = (e.complexity[lang] || e.complexity.en).find((x) => /memory|内存|Speicher/i.test(x[0])) || ['—', '—'];
    return `<tr>
      <td><a href="#/${lang}/algorithms/${id}">${esc(e.title[lang] || e.title.en)}</a></td>
      <td>${esc(e.tag[lang] || e.tag.en)}</td>
      <td class="num">${esc(first[1])}</td>
      <td class="num">${esc(mem[1])}</td>
    </tr>`;
  }).join('');

  root.innerHTML = `
    <div class="view-head">
      <div><div class="kicker">${T('algorithms_kicker')}</div><h2>${T('algorithms_title')}</h2></div>
      <div class="meta">${ALGORITHM_ORDER.length} ${T('algorithms_badge')}</div>
    </div>
    <p class="muted" style="max-width:860px;line-height:1.75;margin:-4px 0 20px">${T('algorithms_lead')}</p>
    <div class="algo-reader">
      <aside class="algo-list" aria-label="${T('algorithms_title')}">${list}</aside>
      <article class="algo-article">
        <div class="algo-head">
          <span class="tag">${esc(g.tag)}</span>
          <h2>${esc(g.title)}</h2>
        </div>
        <div class="algo-purpose">${g.purpose.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
        <div class="algo-cols">
          <section>
            <h3>${T('algo_steps')}</h3>
            <ol>${steps}</ol>
          </section>
          <section>
            <h3>${T('algo_invariant')}</h3>
            <p>${esc(g.invariant)}</p>
            <h3>${T('algo_pitfalls')}</h3>
            <ul>${pitfalls}</ul>
          </section>
        </div>
        <section>
          <h3>${T('algo_complexity')}</h3>
          <table class="data-table algo-table"><tbody>${complexity}</tbody></table>
        </section>
        <section>
          <h3>${T('algo_code_notes')}</h3>
          <dl class="algo-notes">${notes}</dl>
          <div class="algo-sources">${sources}</div>
        </section>
        <section>
          <h3>${T('algo_tests')}</h3>
          <p class="mono small">${tests}</p>
        </section>
        <p class="hint">${T('algo_hint')}</p>
      </article>
    </div>
    <section class="panel" style="margin-top:18px">
      <h3>${T('algo_compare')}</h3>
      <p class="hint" style="margin-top:0">${T('algo_compare_lead')}</p>
      <table class="data-table">
        <thead><tr><th>${T('algo_name')}</th><th>${T('algo_task')}</th><th>${T('algo_cost')}</th><th>${T('algo_memory')}</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </section>`;

  ctx.setStatus(T('status_ready'), `ALGORITHMS · ${ALGORITHM_ORDER.length} ROUTINES`);
  return null;
}
