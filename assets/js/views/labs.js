import { LABS, labSources } from '../labs/index.js';
import { RECIPES, recipeById, recipeHref } from '../labs/recipes.js';
import { ALGORITHM_GUIDE } from '../lib/algorithm-guide.js';
import { t } from '../i18n.js';
import { csv, downloadText, recordRows, runRecord } from '../lib/experiment.js';
import { saveRun } from '../lib/notebook.js';
import { flashButton } from '../labs/ui.js';

function labelFor(input) {
  const control = input.closest('.control');
  const label = control?.querySelector('label span')?.textContent?.trim();
  return label || input.getAttribute('aria-label') || input.id || input.name || 'control';
}

function captureControls(root) {
  const params = {};
  for (const input of root.querySelectorAll('input, select')) {
    if (input.closest('.run-record, .notebook-dialog')) continue;
    if (!input.id) continue;
    if (input.type === 'button' || input.type === 'submit') continue;
    const value = input.type === 'checkbox' ? input.checked : input.value;
    if (value === '' || value === null || value === undefined) continue;
    params[labelFor(input)] = value;
  }
  return params;
}

function captureResults(root) {
  const result = {};
  for (const readout of root.querySelectorAll('.readout')) {
    const label = readout.querySelector('span')?.textContent?.trim();
    const value = readout.querySelector('b')?.textContent?.trim();
    if (label && value && value !== '—') result[label] = value;
  }
  return result;
}

function chapterTitle(ctx, id) {
  const chapter = ctx.manifest?.chapters?.find((c) => c.id === id);
  return chapter ? chapter.title[ctx.lang] || chapter.title.en : id;
}

function sourceLinks(lab, ctx) {
  const sources = labSources(lab.id);
  const chapters = sources.chapters.map(
    (id) => `<a class="source-chip" href="#/${ctx.lang}/atlas/${id}">${chapterTitle(ctx, id)}</a>`
  );
  const algorithms = sources.algorithms.map((id) => {
    const meta = ALGORITHM_GUIDE[id];
    const label = meta ? meta.title[ctx.lang] || meta.title.en : id;
    return `<a class="source-chip" href="#/${ctx.lang}/algorithms/${id}">${label}</a>`;
  });
  return [...chapters, ...algorithms].join('');
}

function recipeBanner(recipe, lang) {
  const title = recipe.title[lang] || recipe.title.en;
  const question = recipe.question[lang] || recipe.question.en;
  const expect = recipe.expect[lang] || recipe.expect.en;
  return `<section class="recipe-banner" data-recipe="${recipe.id}">
    <div class="recipe-label">${t(lang, 'lab_recipe_label')} · ${recipe.minutes} ${t(lang, 'min')}</div>
    <h3>${title}</h3>
    <p><b>${t(lang, 'recipe_question')}</b> ${question}</p>
    <p><b>${t(lang, 'recipe_expect')}</b> ${expect}</p>
  </section>`;
}

function recordFor(lab, ctx, root) {
  const sources = labSources(lab.id);
  const chapterSources = sources.chapters.map((id) => ({
    label: chapterTitle(ctx, id),
    href: `#/${ctx.lang}/atlas/${id}`,
    kind: 'chapter',
  }));
  const algorithmSources = sources.algorithms.map((id) => ({
    label: (ALGORITHM_GUIDE[id]?.title?.[ctx.lang] || ALGORITHM_GUIDE[id]?.title?.en || id),
    href: `#/${ctx.lang}/algorithms/${id}`,
    kind: 'algorithm',
  }));
  const semantic = ctx.labRun?.params || {};
  return runRecord({
    lab: lab.id,
    title: lab.title[ctx.lang] || lab.title.en,
    route: location.hash || `#/${ctx.lang}/labs/${lab.id}`,
    version: ctx.manifest?.version || 'unknown',
    commit: ctx.manifest?.commit || '',
    seed: ctx.labRun?.seed ?? null,
    params: Object.keys(semantic).length ? { ...semantic } : captureControls(root),
    result: { ...captureResults(root), ...(ctx.labRun?.result || {}) },
    sources: [...chapterSources, ...algorithmSources],
  });
}

function mountRunRecord(host, lab, ctx, run) {
  const wrap = document.createElement('section');
  wrap.className = 'run-record panel';
  wrap.innerHTML = `<details>
    <summary>${t(ctx.lang, 'lab_run_record')}</summary>
    <p class="hint">${t(ctx.lang, 'lab_run_hint')}</p>
    <p class="run-summary"></p>
    <div class="run-actions">
      <button type="button" class="btn" data-run="json">${t(ctx.lang, 'lab_download_json')}</button>
      <button type="button" class="btn" data-run="notebook">${t(ctx.lang, 'notebook_add')}</button>
      <button type="button" class="btn ghost" data-run="copy">${t(ctx.lang, 'lab_copy_summary')}</button>
    </div>
    ${labSources(lab.id).cli ? `<p class="run-cli"><span>CLI</span><code>${labSources(lab.id).cli}</code></p>` : ''}
    <div class="run-sources"><span>${t(ctx.lang, 'lab_sources')}</span>${sourceLinks(lab, ctx)}</div>
    <pre class="run-json" hidden></pre>
  </details>`;
  const record = () => recordFor(lab, ctx, document.getElementById('view'));
  const pre = wrap.querySelector('.run-json');
  const summaryEl = wrap.querySelector('.run-summary');
  const details = wrap.querySelector('details');
  details.addEventListener('toggle', () => {
    if (!details.open) return;
    const rec = record();
    const params = Object.entries(rec.params || {}).slice(0, 6).map(([k, v]) => `${k} = ${v}`).join(' · ');
    summaryEl.textContent = `${t(ctx.lang, 'seed')} ${rec.seed ?? '—'} · ${params}`;
  });
  wrap.querySelector('[data-run="json"]').addEventListener('click', () => {
    const rec = record();
    downloadText(`atlas-${lab.id}-run.json`, JSON.stringify(rec, null, 2));
    pre.hidden = false;
    pre.textContent = JSON.stringify(rec, null, 2);
  });
  wrap.querySelector('[data-run="notebook"]').addEventListener('click', (ev) => {
    const rec = record();
    saveRun(rec);
    flashButton(ev.currentTarget, 'Saved', 1300);
  });
  wrap.querySelector('[data-run="copy"]').addEventListener('click', async (ev) => {
    const rec = record();
    const text = `${rec.title} · ${Object.entries(rec.params).slice(0, 5).map(([k, v]) => `${k}=${v}`).join(' · ')} · ${rec.route}`;
    try {
      await navigator.clipboard.writeText(text);
      flashButton(ev.currentTarget, 'Copied', 1200);
    } catch (err) {
      pre.hidden = false;
      pre.textContent = text;
    }
  });
  host.appendChild(wrap);
}

export async function render(root, ctx) {
  const { lang, param } = ctx;
  if (param) {
    const lab = LABS.find((l) => l.id === param);
    if (!lab) {
      root.innerHTML = `<div class="view-head"><div><div class="kicker">404</div><h2>${t(lang, 'not_found_lab')}</h2></div></div>`;
      return null;
    }
    const host = document.createElement('div');
    host.className = 'lab-host';
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
    const recipe = recipeById(ctx.query?.recipe);
    const run = { seed: null, params: {}, result: {}, note: '' };
    ctx.labRun = run;
    ctx.setRun = (partial = {}) => {
      if (Object.prototype.hasOwnProperty.call(partial, 'seed')) run.seed = partial.seed;
      Object.assign(run.params, partial.params || {});
      Object.assign(run.result, partial.result || {});
    };
    const cleanup = await lab.mount(host, ctx);
    if (recipe && recipe.lab === lab.id) {
      host.insertAdjacentHTML('afterbegin', recipeBanner(recipe, lang));
    }
    mountRunRecord(host, lab, ctx, run);
    root.appendChild(pager);
    ctx.setStatus(t(lang, 'status_running'), `${lab.title[lang] || lab.title.en} · ${t(lang, 'lab_badge').replace('<br>', ' · ')}`);
    return cleanup;
  }

  root.innerHTML =
    `<div class="view-head">
      <div><div class="kicker">${t(lang, 'labs_kicker')}</div><h2>${t(lang, 'labs_title')}</h2></div>
      <div class="meta">${LABS.length} ${t(lang, 'labs_badge').replace('<br>', ' · ')}</div>
    </div>
    <p class="muted" style="max-width:780px;line-height:1.7;margin-top:-6px">${t(lang, 'labs_lead')}</p>` +
    `<section class="recipe-band">
      <div class="section-head"><h3>${t(lang, 'recipes_title')}</h3><span class="mono small">${RECIPES.length} ${t(lang, 'recipes_badge')}</span></div>
      <div class="recipe-grid">` +
      RECIPES.map((r) => `<a class="recipe-card" href="${recipeHref(lang, r)}">
        <span class="recipe-meta">${r.minutes} ${t(lang, 'min')} · ${LABS.find((l) => l.id === r.lab)?.title[lang] || r.lab}</span>
        <h4>${r.title[lang] || r.title.en}</h4>
        <p>${r.question[lang] || r.question.en}</p>
        <span class="entry-arrow">${t(lang, 'open')} →</span>
      </a>`).join('') +
      `</div></section>` +
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
          <div class="tag">${t(lang, 'lab_label')}</div>
          <h4>${lab.title[lang] || lab.title.en}</h4>
          <p>${lab.blurb[lang] || lab.blurb.en}</p>
        </a>`).join('') +
        `</div></section>`;
    }).join('');
  ctx.setStatus(t(lang, 'status_ready'), `${LABS.length} ${t(lang, 'lab_group_instruments')} · ${t(lang, 'status_ready')}`);
  return null;
}
