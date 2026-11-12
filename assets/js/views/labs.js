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
    ctx.setStatus(t(lang, 'status_running'), `${lab.title[lang] || lab.title.en} · LAB`);
    return lab.mount(host, ctx);
  }

  root.innerHTML =
    `<div class="view-head">
      <div><div class="kicker">${t(lang, 'labs_kicker')}</div><h2>${t(lang, 'labs_title')}</h2></div>
      <div class="meta">${LABS.length} INSTRUMENTS<br>LIVE ENGINE</div>
    </div>
    <p class="muted" style="max-width:780px;line-height:1.7;margin-top:-6px">${t(lang, 'labs_lead')}</p>
    <div class="cards" style="margin-top:22px">` +
    LABS.map(
      (lab, i) => `<a class="card" href="#/${lang}/labs/${lab.id}">
        <span class="idx">${String(i + 1).padStart(2, '0')}</span>
        <div class="tag">lab</div>
        <h4>${lab.title[lang] || lab.title.en}</h4>
        <p>${lab.blurb[lang] || lab.blurb.en}</p>
      </a>`
    ).join('') +
    `</div>`;
  ctx.setStatus(t(lang, 'status_ready'), `${LABS.length} LABS · IDLE`);
  return null;
}
