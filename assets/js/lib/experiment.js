/** Pure helpers for experiment estimates and run records.
 *
 *  Kept free of DOM access so the statistics can be tested under Node:
 *  Wilson score intervals, run-record construction, and CSV/JSON formatting.
 */

/** Wilson score interval for a binomial proportion.
 *  Returns { p, lower, upper, half, n, hits }.
 *  n = 0 returns NaNs; callers should display a dash. */
export function wilsonInterval(hits, n, z = 1.96) {
  if (!Number.isFinite(hits) || !Number.isFinite(n) || n <= 0) {
    return { p: NaN, lower: NaN, upper: NaN, half: NaN, n: 0, hits: 0 };
  }
  const p = hits / n;
  const z2 = z * z;
  const denom = 1 + z2 / n;
  const centre = (p + z2 / (2 * n)) / denom;
  const half = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / denom;
  return {
    p,
    lower: Math.max(0, centre - half),
    upper: Math.min(1, centre + half),
    half,
    n,
    hits,
  };
}

/** A proportional 95% interval by the normal approximation, used only for
 *  the large-n crossing bins where the Wilson interval is nearly identical. */
export function normalInterval(hits, n, z = 1.96) {
  if (!Number.isFinite(hits) || !Number.isFinite(n) || n <= 0) {
    return { p: NaN, lower: NaN, upper: NaN, half: NaN, n: 0, hits: 0 };
  }
  const p = hits / n;
  const half = (z * Math.sqrt((p * (1 - p)) / n)) || 0;
  return { p, lower: Math.max(0, p - half), upper: Math.min(1, p + half), half, n, hits };
}

/** Round a number for display in a run record without losing the value. */
export function cleanNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return value;
  return Number(n.toPrecision(10));
}

/** Build a versioned, JSON-serialisable record of one experiment run.
 *  The callers supply the lab metadata and the current control state. */
export function runRecord({
  lab,
  title,
  route,
  version = 'unknown',
  commit = '',
  seed = null,
  params = {},
  result = {},
  sources = [],
}) {
  return {
    schema: 'atlas/experiment-run@1',
    lab,
    title,
    route,
    capturedAt: new Date().toISOString(),
    app: { version, commit: commit || null },
    engine: 'assets/js + lib/js',
    rng: 'xoshiro128**',
    seed: seed ?? null,
    params: Object.fromEntries(
      Object.entries(params || {}).map(([k, v]) => [k, typeof v === 'number' ? cleanNumber(v) : v])
    ),
    result,
    sources,
  };
}

/** Flatten a run record into rows for CSV export. */
export function recordRows(record) {
  const rows = [
    ['field', 'value'],
    ['schema', record.schema],
    ['lab', record.lab],
    ['title', record.title],
    ['route', record.route],
    ['captured_at', record.capturedAt],
    ['app_version', record.app?.version ?? ''],
    ['commit', record.app?.commit ?? ''],
    ['engine', record.engine],
    ['rng', record.rng],
    ['seed', record.seed ?? ''],
  ];
  for (const [key, value] of Object.entries(record.params || {})) {
    rows.push([`param.${key}`, typeof value === 'object' ? JSON.stringify(value) : String(value)]);
  }
  for (const [key, value] of Object.entries(record.result || {})) {
    rows.push([`result.${key}`, typeof value === 'object' ? JSON.stringify(value) : String(value)]);
  }
  for (const source of record.sources || []) {
    rows.push(['source', typeof source === 'string' ? source : `${source.label || ''} ${source.href || ''}`.trim()]);
  }
  return rows;
}

/** CSV string with RFC 4180 quoting. */
export function csv(rows) {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const s = String(cell ?? '');
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(',')
    )
    .join('\n');
}

/** Trigger a browser download for a text payload. */
export function downloadText(filename, text, type = 'application/json') {
  const blob = new Blob([text], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
