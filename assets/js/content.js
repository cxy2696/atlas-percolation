/** Content loading and Markdown rendering.
 *
 * Math is protected before Markdown conversion: `$...$` and `$$...$$` are
 * replaced by tokens, so that underscores, asterisks and backslashes inside
 * LaTeX never interact with emphasis rules.  Code fences are protected the
 * same way.  Tokens are restored after marked has run, then KaTeX renders
 * the surviving math in the DOM.
 */

let manifestPromise = null;
const chapterCache = new Map();

export async function getManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch('content/manifest.json', { cache: 'no-cache' }).then((r) => {
      if (!r.ok) throw new Error('manifest not found');
      return r.json();
    });
  }
  return manifestPromise;
}

export async function getChapterMarkdown(lang, id) {
  const key = `${lang}:${id}`;
  if (chapterCache.has(key)) return chapterCache.get(key);
  const res = await fetch(`content/${lang}/${id}.md`, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`chapter ${lang}/${id} missing`);
  const text = await res.text();
  chapterCache.set(key, text);
  return text;
}

export function stripFrontMatter(md) {
  if (md.startsWith('---')) {
    const end = md.indexOf('\n---', 3);
    if (end !== -1) return md.slice(md.indexOf('\n', end + 1) + 1);
  }
  return md;
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function protect(md) {
  const store = { math: [], code: [] };
  let text = md;

  // fenced code
  text = text.replace(/```[^\n]*\n([\s\S]*?)```/g, (m, body) => {
    store.code.push(`<pre><code>${escapeHtml(body.replace(/\n$/, ''))}</code></pre>`);
    return `\n\n@@CODE${store.code.length - 1}@@\n\n`;
  });
  // inline code
  text = text.replace(/`([^`\n]+)`/g, (m, body) => {
    store.code.push(`<code>${escapeHtml(body)}</code>`);
    return `@@CODE${store.code.length - 1}@@`;
  });
  // display math
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (m, body) => {
    store.math.push(`$$${body}$$`);
    return `\n\n@@MATH${store.math.length - 1}@@\n\n`;
  });
  // inline math (single $, no newline, not escaped)
  text = text.replace(/(^|[^\\$])\$([^$\n]+?)\$/g, (m, pre, body) => {
    store.math.push(`$${body}$`);
    return `${pre}@@MATH${store.math.length - 1}@@`;
  });
  return { text, store };
}

function restore(html, store) {
  let out = html;
  out = out.replace(/<p>\s*@@MATH(\d+)@@\s*<\/p>/g, (m, n) => {
    return `<div class="mathblock">${escapeHtml(store.math[Number(n)])}</div>`;
  });
  out = out.replace(/<p>\s*@@CODE(\d+)@@\s*<\/p>/g, (m, n) => store.code[Number(n)]);
  out = out.replace(/@@MATH(\d+)@@/g, (m, n) => escapeHtml(store.math[Number(n)]));
  out = out.replace(/@@CODE(\d+)@@/g, (m, n) => store.code[Number(n)]);
  return out;
}

export function renderMarkdown(md) {
  const body = stripFrontMatter(md);
  const { text, store } = protect(body);
  const marked = window.marked;
  const html = marked ? marked.parse(text, { gfm: true, breaks: false }) : `<pre>${escapeHtml(text)}</pre>`;
  return restore(html, store);
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

/** Insert rendered HTML, add heading anchors, render math, return TOC entries. */
export function enhanceArticle(el) {
  el.querySelectorAll('h2, h3').forEach((h, i) => {
    let id = slugify(h.textContent) || `sec-${i + 1}`;
    let unique = id;
    let k = 2;
    while (el.querySelector(`#${CSS.escape(unique)}`)) unique = `${id}-${++k}`;
    h.id = unique;
  });

  if (window.renderMathInElement) {
    window.renderMathInElement(el, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ],
      throwOnError: false,
      strict: false,
      trust: false,
      macros: { '\\R': '\\mathbb{R}', '\\E': '\\mathbb{E}', '\\P': '\\mathbb{P}' },
    });
  }

  return Array.from(el.querySelectorAll('h2')).map((h) => ({
    id: h.id,
    text: h.textContent.trim(),
  }));
}
