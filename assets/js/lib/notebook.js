/** A local notebook of saved experiment runs.
 *
 *  The notebook is deliberately browser-local: no server, no account and no
 *  upload. Each entry is the same JSON record the experiment page can
 *  download, so a reader can keep the interactive result and the citation
 *  trail together. The store is capped to keep localStorage predictable.
 */
import { t } from '../i18n.js';
import { csv, downloadText, recordRows } from './experiment.js';

const KEY = 'atlas-notebook-v1';
const LIMIT = 100;

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function write(entries) {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries.slice(-LIMIT)));
  } catch (e) {
    /* private mode or quota; the in-memory copy still works for this page */
  }
  window.dispatchEvent(new CustomEvent('atlas:notebook', { detail: { count: entries.length } }));
}

export function notebookCount() {
  return read().length;
}

export function saveRun(record) {
  const entries = read();
  entries.push({
    ...record,
    id: (globalThis.crypto && crypto.randomUUID && crypto.randomUUID()) || `run-${Date.now()}`,
    savedAt: new Date().toISOString(),
  });
  write(entries);
  return entries.length;
}

export function clearRuns() {
  write([]);
}

function exportJSON(entries) {
  downloadText(`atlas-notebook-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(entries, null, 2));
}

function exportCSV(entries) {
  const rows = [['run_id', 'saved_at', 'lab', 'seed', 'field', 'value']];
  for (const entry of entries) {
    for (const [key, value] of recordRows(entry)) {
      rows.push([entry.id, entry.savedAt, entry.lab, entry.seed ?? '', key, value]);
    }
  }
  downloadText(`atlas-notebook-${new Date().toISOString().slice(0, 10)}.csv`, csv(rows), 'text/csv');
}

function currentLang() {
  const raw = document.documentElement.lang || 'en';
  return raw.startsWith('zh') ? 'zh' : raw.startsWith('de') ? 'de' : 'en';
}

function summary(entry, lang) {
  const parts = [];
  if (entry.seed !== null && entry.seed !== undefined) parts.push(`${t(lang, 'seed')} ${entry.seed}`);
  for (const [key, value] of Object.entries(entry.params || {}).slice(0, 4)) {
    parts.push(`${key} ${value}`);
  }
  return parts.join(' · ');
}

function render(dialog, lang) {
  const entries = read();
  const list = dialog.querySelector('.notebook-list');
  dialog.querySelector('.notebook-title').textContent = t(lang, 'notebook_title');
  const close = dialog.querySelector('[data-nb="close"]');
  close.textContent = '×';
  close.setAttribute('aria-label', t(lang, 'notebook_close'));
  dialog.querySelector('.notebook-lead').textContent = t(lang, 'notebook_lead');
  dialog.querySelector('[data-nb="json"]').textContent = t(lang, 'notebook_export_json');
  dialog.querySelector('[data-nb="csv"]').textContent = t(lang, 'notebook_export_csv');
  dialog.querySelector('[data-nb="clear"]').textContent = t(lang, 'notebook_clear');
  if (!entries.length) {
    list.innerHTML = `<p class="notebook-empty">${t(lang, 'notebook_empty')}</p>`;
    return;
  }
  list.innerHTML = entries
    .slice()
    .reverse()
    .map(
      (entry) => `<article class="notebook-entry">
        <header>
          <b>${entry.title || entry.lab}</b>
          <time>${new Date(entry.savedAt).toLocaleString()}</time>
        </header>
        <p class="notebook-meta">${summary(entry, lang)}</p>
        <details><summary>${t(lang, 'notebook_record')}</summary><pre>${JSON.stringify(entry, null, 2)}</pre></details>
      </article>`
    )
    .join('');
}

export function openNotebook() {
  const lang = currentLang();
  let dialog = document.getElementById('notebook-dialog');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'notebook-dialog';
    dialog.className = 'notebook-dialog';
    dialog.innerHTML = `<div class="notebook-head">
        <h2 class="notebook-title"></h2>
        <button type="button" class="notebook-close" data-nb="close"></button>
      </div>
      <p class="notebook-lead hint"></p>
      <div class="notebook-actions">
        <button type="button" class="btn" data-nb="json"></button>
        <button type="button" class="btn" data-nb="csv"></button>
        <button type="button" class="btn ghost" data-nb="clear"></button>
      </div>
      <div class="notebook-list"></div>`;
    document.body.appendChild(dialog);
    dialog.querySelector('[data-nb="close"]').addEventListener('click', () => dialog.close());
    dialog.querySelector('[data-nb="json"]').addEventListener('click', () => exportJSON(read()));
    dialog.querySelector('[data-nb="csv"]').addEventListener('click', () => exportCSV(read()));
    dialog.querySelector('[data-nb="clear"]').addEventListener('click', () => {
      if (read().length && window.confirm('Clear every saved run?')) {
        clearRuns();
        render(dialog, lang);
      }
    });
    dialog.addEventListener('click', (ev) => {
      if (ev.target === dialog) dialog.close();
    });
  }
  render(dialog, lang);
  if (!dialog.open) dialog.showModal();
}

export function initNotebook() {
  const button = document.getElementById('notebook-open');
  const count = document.getElementById('notebook-count');
  const update = () => {
    const lang = currentLang();
    if (count) count.textContent = String(notebookCount());
    if (button) button.setAttribute('aria-label', `${t(lang, 'notebook')}: ${notebookCount()}`);
  };
  update();
  button?.addEventListener('click', () => openNotebook());
  window.addEventListener('atlas:notebook', update);
  window.addEventListener('atlas:lang', update);
}
