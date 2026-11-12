/** Start-here page: what the atlas contains, how to move through it, and
 *  which path to take depending on how much time the reader has. */
import { t } from '../i18n.js';

export async function render(root, ctx) {
  const { lang } = ctx;
  const T = (k) => t(lang, k);
  const cards = [
    { href: `#/${lang}/atlas`, n: '01', title: T('guide_learn'), text: T('guide_learn_text') },
    { href: `#/${lang}/labs`, n: '02', title: T('guide_labs'), text: T('guide_labs_text') },
    { href: `#/${lang}/algorithms`, n: '03', title: T('guide_code'), text: T('guide_code_text') },
    { href: `#/${lang}/sources`, n: '04', title: T('guide_sources'), text: T('guide_sources_text') },
  ];

  root.innerHTML = `
    <div class="view-head">
      <div><div class="kicker">${T('guide_kicker')}</div><h2>${T('guide_title')}</h2></div>
      <div class="meta">${T('guide_badge')}</div>
    </div>

    <section class="entry-hero">
      <div>
        <p class="entry-lead">${T('guide_lead')}</p>
        <div class="entry-actions">
          <a class="btn primary" href="#/${lang}/overview">${T('guide_open_overview')}</a>
          <a class="btn" href="#/${lang}/atlas">${T('guide_open_atlas')}</a>
          <a class="btn ghost" href="#/${lang}/labs">${T('guide_open_labs')}</a>
        </div>
      </div>
      <aside class="entry-key">
        <b>${T('guide_key_title')}</b>
        <p>${T('guide_key_text')}</p>
      </aside>
    </section>

    <div class="entry-grid">
      ${cards.map((c) => `<a class="entry-card" href="${c.href}">
        <span class="entry-num">${c.n}</span>
        <h3>${c.title}</h3>
        <p>${c.text}</p>
        <span class="entry-arrow">${T('guide_open')} ↗</span>
      </a>`).join('')}
    </div>

    <div class="grid-2" style="margin-top:18px">
      <section class="panel">
        <h3>${T('guide_how_title')}</h3>
        <ol class="entry-list">
          <li>${T('guide_how_1')}</li>
          <li>${T('guide_how_2')}</li>
          <li>${T('guide_how_3')}</li>
          <li>${T('guide_how_4')}</li>
        </ol>
      </section>
      <section class="panel">
        <h3>${T('guide_labels_title')}</h3>
        <p class="hint" style="margin-top:0">${T('guide_labels_text')}</p>
        <div class="entry-tags">
          <span class="badge ok">${T('exact')}</span>
          <span class="badge">${T('numerical')}</span>
          <span class="badge">${T('conjectural')}</span>
          <span class="badge">${T('guide_sketch')}</span>
        </div>
      </section>
    </div>

    <section class="panel" style="margin-top:18px">
      <h3>${T('guide_paths_title')}</h3>
      <div class="path-grid">
        <div><b>${T('guide_path_1_title')}</b><p>${T('guide_path_1_text')}</p></div>
        <div><b>${T('guide_path_2_title')}</b><p>${T('guide_path_2_text')}</p></div>
        <div><b>${T('guide_path_3_title')}</b><p>${T('guide_path_3_text')}</p></div>
      </div>
    </section>

    <p class="entry-foot">${T('guide_foot')}</p>`;

  ctx.setStatus(T('status_ready'), `GUIDE · ${T('guide_badge')}`);
  return null;
}
