import { LABS } from '../labs/index.js';
import { t } from '../i18n.js';

export async function render(root, ctx) {
  const { lang, param } = ctx;
  if (param) {
    const lab = LABS.find((l) => l.id === param);
    if (!lab) {
      root.innerHTML = `<div class="view-head"><div><div class="kicker">404</div><h2>${t(lang, 'not_found_lab')}</h2></div></div>`;
      return null;
    }
    const host = document.createElement('div');
    root.appendChild(host);
    const idx = LABS.findIndex((l) => l.id === lab.id);
    const prev = LABS[idx - 1];
    const next = LABS[idx + 1];
    const pager = document.createElement('nav');
    pager.className = 'pager lab-pager';
    pager.setAttribute('aria-label', t(lang, 'labs_title'));
    pager.innerHTML =
      (prev ? `<a href="#/${lang}/labs/${prev.id}">← ${t(lang, 'prev')}<br><span class="mono small">${prev.title[lang] || prev.title.en}</span></a>` : '<span></span>') +
      (next ? `<a href="#/${lang}/labs/${next.id}" style="text-align:right">${t(lang, 'next')} →<br><span class="mono small">${next.title[lang] || next.title.en}</span></a>` : '<span></span>');
    root.appendChild(pager);
    ctx.setStatus(t(lang, 'status_running'), `${lab.title[lang] || lab.title.en} · LAB`);
    return lab.mount(host, ctx);
  }

  root.innerHTML =
    `<div class="view-head">
      <div><div class="kicker">${t(lang, 'labs_kicker')}</div><h2>${t(lang, 'labs_title')}</h2></div>
      <div class="meta">${LABS.length} ${t(lang, 'labs_badge')}</div>
    </div>
    <p class="muted" style="max-width:780px;line-height:1.7;margin-top:-6px">${t(lang, 'labs_lead')}</p>` +
    ['foundations', 'critical', 'networks', 'methods'].map((group) => {
      const rows = LABS.map((lab, i) => ({ lab, i })).filter(({ lab }) => lab.group === group);
      if (!rows.length) return '';
      return `<section class="lab-group">
        <div class="section-head">
          <h3>${t(lang, `lab_group_${group}`)}</h3>
          <span class="mono small">${rows.length} ${t(lang, rows.length === 1 ? 'lab_group_instrument' : 'lab_group_instruments')}</span>
        </div>
        <div class="cards">` +
        rows.map(({ lab, i }) => `<a class="card" href="#/${lang}/labs/${lab.id}">
          <span class="idx">${String(i + 1).padStart(2, '0')}</span>
          <div class="tag">lab</div>
          <h4>${lab.title[lang] || lab.title.en}</h4>
          <p>${lab.blurb[lang] || lab.blurb.en}</p>
        </a>`).join('') +
        `</div></section>`;
    }).join('');
  ctx.setStatus(t(lang, 'status_ready'), `${LABS.length} LABS · IDLE`);
  return null;
}
