/** Start-here page: a short explanation of the atlas, its three routes, and
 *  the conventions used for evidence. The page deliberately reads as prose
 *  first and navigation second. */
import { t } from '../i18n.js';
import { LABS } from '../labs/index.js';

export async function render(root, ctx) {
  const { lang, manifest } = ctx;
  const T = (k) => t(lang, k);
  const chapters = manifest?.chapters?.length || 23;
  const references = manifest?.references || 142;
  const cards = [
    {
      href: `#/${lang}/atlas`,
      n: '01',
      title: T('guide_learn'),
      text: T('guide_learn_text'),
      meta: `${chapters} ${T('chapters')} · ${T('guide_card_read')}`,
    },
    {
      href: `#/${lang}/labs`,
      n: '02',
      title: T('guide_labs'),
      text: T('guide_labs_text'),
      meta: `${LABS.length} ${T('lab_group_instruments')} · ${T('guide_card_run')}`,
    },
    {
      href: `#/${lang}/algorithms`,
      n: '03',
      title: T('guide_code'),
      text: T('guide_code_text'),
      meta: `${T('guide_card_algorithms')}`,
    },
    {
      href: `#/${lang}/sources`,
      n: '04',
      title: T('guide_sources'),
      text: T('guide_sources_text'),
      meta: `${references} ${T('references')} · ${T('guide_card_audit')}`,
    },
  ];

  root.innerHTML = `
    <div class="view-head">
      <div><div class="kicker">${T('guide_kicker')}</div><h2>${T('guide_title')}</h2></div>
      <div class="meta">${T('guide_badge')} · ${T('guide_time')}</div>
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

    <div class="guide-facts" aria-label="${T('guide_facts')}">
      <div><b>${chapters}</b><span>${T('chapters')}</span></div>
      <div><b>${manifest?.languages?.length || 3}</b><span>${T('guide_languages')}</span></div>
      <div><b>${LABS.length}</b><span>${T('lab_group_instruments')}</span></div>
      <div><b>${references}</b><span>${T('references')}</span></div>
    </div>

    <div class="entry-grid">
      ${cards.map((c) => `<a class="entry-card" href="${c.href}">
        <span class="entry-num">${c.n}</span>
        <h3>${c.title}</h3>
        <p>${c.text}</p>
        <span class="entry-meta">${c.meta}</span>
        <span class="entry-arrow">${T('guide_open')} →</span>
      </a>`).join('')}
    </div>

    <div class="grid-2" style="margin-top:26px">
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
        <dl class="label-key">
          <dt><span class="badge ok">${T('exact')}</span></dt><dd>${T('label_exact_text')}</dd>
          <dt><span class="badge">${T('numerical')}</span></dt><dd>${T('label_numerical_text')}</dd>
          <dt><span class="badge">${T('conjectural')}</span></dt><dd>${T('label_conjectural_text')}</dd>
          <dt><span class="badge">${T('guide_sketch')}</span></dt><dd>${T('label_sketch_text')}</dd>
        </dl>
      </section>
    </div>

    <section class="panel" style="margin-top:26px">
      <h3>${T('guide_paths_title')}</h3>
      <div class="path-grid">
        <div><b>${T('guide_path_1_title')}</b><p>${T('guide_path_1_text')}</p></div>
        <div><b>${T('guide_path_2_title')}</b><p>${T('guide_path_2_text')}</p></div>
        <div><b>${T('guide_path_3_title')}</b><p>${T('guide_path_3_text')}</p></div>
      </div>
    </section>

    <p class="entry-foot">${T('guide_foot')}</p>`;

  ctx.setStatus(T('status_ready'), `${chapters} ${T('chapters')} · ${LABS.length} ${T('lab_group_instruments')} · ${references} ${T('references')}`);
  return null;
}
