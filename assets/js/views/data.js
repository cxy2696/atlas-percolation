import { t } from '../i18n.js';
import { drawPlot, PALETTE } from '../lib/plot.js';
import { fmt } from '../labs/ui.js';

function mathTitle(lang, key) {
  return t(lang, key).replace(/([πχλγ])/g, '<span class="mathcap">$1</span>');
}

function pi(row) {
  return row.n ? row.hits / row.n : 0;
}

function byL(rows, key) {
  const out = new Map();
  for (const r of rows) {
    if (!out.has(r.L)) out.set(r.L, []);
    out.get(r.L).push(r);
  }
  return [...out.entries()].sort((a, b) => a[0] - b[0]);
}

function crossAt(curve, y) {
  for (let i = 1; i < curve.length; i++) {
    const a = curve[i - 1];
    const b = curve[i];
    if ((a.smax - y) * (b.smax - y) <= 0 && a.smax !== b.smax) {
      const t0 = (y - a.smax) / (b.smax - a.smax);
      return a.p + t0 * (b.p - a.p);
    }
  }
  return NaN;
}

export async function render(root, ctx) {
  const { lang } = ctx;
  let data = null;
  try {
    const r = await fetch('data/benchmarks.json', { cache: 'no-cache' });
    if (r.ok) data = await r.json();
  } catch (e) {
    /* handled below */
  }

  root.innerHTML =
    `<div class="view-head">
      <div><div class="kicker">${t(lang, 'data_kicker')}</div><h2>${t(lang, 'data_title')}</h2></div>
      <div class="meta" id="data-meta">—</div>
    </div>
    <p class="muted" style="max-width:820px;line-height:1.7;margin-top:-6px">${t(lang, 'data_lead')}</p>
    <div id="data-body"></div>`;

  if (!data) {
    root.querySelector('#data-body').innerHTML = `<div class="panel"><p class="mono small">${t(lang, 'no_data')}</p>
      <pre class="mono small" style="color:#a8e8ec">clang++ -O3 -std=c++20 -o build/bench scripts/bench.cpp
./build/bench > data/raw_bench.json
python3 scripts/analyse_bench.py</pre></div>`;
    return null;
  }

  const meta = data.meta || {};
  root.querySelector('#data-meta').innerHTML = `SEED ${meta.seed ?? '—'}<br>${meta.generated ?? ''}<br>${meta.harness ?? ''}`;

  const body = root.querySelector('#data-body');
  const fits = data.fits || {};
  const collapse = fits.collapse || {};
  const armFit = fits.one_arm || {};
  const fitWindow = collapse.window
    ? `p ∈ [${collapse.window[0].toFixed(2)}, ${collapse.window[1].toFixed(2)}] · L = ${(collapse.sizes || []).join(', ')}`
    : '';
  body.innerHTML = `<div class="stat-strip">
    <div><span>${t(lang, 'data_fit')} p_c</span><b>${fmt(collapse.pc, 4)}</b></div>
    <div><span>ν (fixed)</span><b>${fmt(collapse.nu, 3)}</b></div>
    <div><span>one-arm</span><b>${fmt(armFit.slope, 4)}${armFit.slope_se ? ` ± ${fmt(1.96 * armFit.slope_se, 3)}` : ''}</b></div>
    <div><span>${t(lang, 'sections')}</span><b>${(data.crossing || []).length + (data.torus || []).length}</b></div>
  </div>
  <p class="hint small" style="margin:-4px 0 18px">${collapse.note || ''}${fitWindow ? ' · ' + fitWindow : ''}</p>`;
  const crossingByL = byL(data.crossing || [], 'L');
  const torusByL = byL(data.torus || [], 'L');

  const pcEstimates = torusByL.map(([L, rows]) => ({
    L,
    pc: crossAt(
      rows.map((r) => ({ p: r.p, smax: r.smax })),
      0.5
    ),
  }));

  const sections = [];
  sections.push(`<div class="grid-2">
    <section class="panel"><h3>${mathTitle(lang, 'data_cross_title')}</h3>${canvas('d-cross')}</section>
    <section class="panel"><h3>${mathTitle(lang, 'data_smax_title')}</h3>${canvas('d-smax')}</section>
  </div>`);
  sections.push(`<div class="grid-2" style="margin-top:16px">
    <section class="panel"><h3>${mathTitle(lang, 'data_chi_title')}</h3>${canvas('d-chi')}</section>
    <section class="panel"><h3>${mathTitle(lang, 'data_arm_title')}</h3>${canvas('d-arm')}</section>
  </div>`);
  if (data.cardy) {
    sections.push(`<div class="grid-2" style="margin-top:16px">
      <section class="panel"><h3>${mathTitle(lang, 'data_cardy_title')}</h3>${canvas('d-cardy')}</section>
      <section class="panel"><h3>${mathTitle(lang, 'data_net_title')}</h3>${canvas('d-net')}</section>
    </div>`);
  }
  if (data.interdependent) {
    sections.push(`<div class="grid-2" style="margin-top:16px">
      <section class="panel"><h3>${mathTitle(lang, 'data_dep_title')}, c = ${data.interdependent.c}</h3>${canvas('d-dep')}</section>
      <section class="panel"><h3>${mathTitle(lang, 'data_kcore_title')}</h3>${canvas('d-kcore')}</section>
    </div>`);
  }
  if (data.continuum) {
    sections.push(`<div class="grid-2" style="margin-top:16px">
      <section class="panel"><h3>${mathTitle(lang, 'data_cont_title')}</h3>${canvas('d-cont')}</section>
      <section class="panel"><h3>${mathTitle(lang, 'data_pc_title')}</h3>${pcTable(pcEstimates, lang)}</section>
    </div>`);
  }
  body.insertAdjacentHTML('beforeend', sections.join(''));

  // plots
  drawPlot(document.getElementById('d-cross'), {
    height: 250,
    xLabel: 'p',
    yLabel: 'π',
    xRange: [0.42, 0.58],
    yRange: [0, 1],
    vlines: [{ x: 0.5, color: 'rgba(255,180,84,0.45)', label: 'p_c' }],
    series: crossingByL.map(([L, rows], i) => ({
      x: rows.map((r) => r.p),
      y: rows.map(pi),
      color: [PALETTE.cyan, PALETTE.amber, PALETTE.violet, PALETTE.green][i % 4],
      label: `L=${L}`,
      points: 2,
    })),
  });

  drawPlot(document.getElementById('d-smax'), {
    height: 250,
    xLabel: 'p',
    yLabel: 'S_max',
    xRange: [0.42, 0.58],
    yRange: [0, 1],
    vlines: [{ x: 0.5, color: 'rgba(255,180,84,0.45)', label: 'p_c' }],
    series: torusByL.map(([L, rows], i) => ({
      x: rows.map((r) => r.p),
      y: rows.map((r) => r.smax),
      color: [PALETTE.cyan, PALETTE.amber, PALETTE.violet, PALETTE.green, PALETTE.dim][i % 5],
      label: `L=${L}`,
    })),
  });

  drawPlot(document.getElementById('d-chi'), {
    height: 250,
    xLabel: 'p',
    yLabel: 'χ',
    xRange: [0.42, 0.58],
    yRange: [1, 2000],
    logY: true,
    vlines: [{ x: 0.5, color: 'rgba(255,180,84,0.45)', label: 'p_c' }],
    series: torusByL.map(([L, rows], i) => ({
      x: rows.map((r) => r.p),
      y: rows.map((r) => Math.max(1e-2, r.chi)),
      color: [PALETTE.cyan, PALETTE.amber, PALETTE.violet, PALETTE.green, PALETTE.dim][i % 5],
      label: `L=${L}`,
    })),
  });

  if (data.arm) {
    drawPlot(document.getElementById('d-arm'), {
      height: 250,
      xLabel: 'L',
      yLabel: 'P(0 ↔ ∂Λ_L)',
      xRange: [16, 1024],
      yRange: [0.2, 0.9],
      logX: true,
      logY: true,
      series: [
        {
          x: data.arm.map((r) => r.L),
          y: data.arm.map(pi),
          color: PALETTE.cyan,
          points: 3,
        },
        {
          x: [32, 512],
          y: [0.62 * Math.pow(32 / 32, -5 / 48), 0.62 * Math.pow(512 / 32, -5 / 48)],
          color: PALETTE.amber,
          dash: [4, 4],
          label: 'slope −5/48',
        },
      ],
    });
  }

  if (data.cardy) {
    drawPlot(document.getElementById('d-cardy'), {
      height: 250,
      xLabel: 'ℓ = H/W',
      yLabel: 'π',
      xRange: [0.2, 4],
      logX: true,
      yRange: [0, 1],
      series: [
        {
          x: data.cardy.map((r) => r.aspect),
          y: data.cardy.map((r) => r.formula),
          color: PALETTE.cyan,
          label: 'Cardy',
        },
        {
          x: data.cardy.map((r) => r.aspect),
          y: data.cardy.map((r) => r.measured),
          color: PALETTE.amber,
          points: 3,
          label: 'measured',
        },
      ],
    });
  }

  if (data.network) {
    const net = data.network;
    drawPlot(document.getElementById('d-net'), {
      height: 250,
      xLabel: 'f',
      yLabel: 'S',
      xRange: [0, 0.9],
      yRange: [0, 1],
      series: [
        { x: net.pl25rand.map((r) => r.f), y: net.pl25rand.map((r) => r.s), color: PALETTE.cyan, label: 'γ=2.5 random' },
        { x: net.pl25.targeted.map((r) => r.f), y: net.pl25.targeted.map((r) => r.s), color: PALETTE.amber, label: 'γ=2.5 targeted' },
      ],
    });
  }

  if (data.interdependent) {
    drawPlot(document.getElementById('d-dep'), {
      height: 250,
      xLabel: 'p',
      yLabel: 'S',
      xRange: [0.45, 0.95],
      yRange: [0, 1],
      vlines: [{ x: data.interdependent.pc_theory, color: 'rgba(255,180,84,0.5)', label: '2.4554/c' }],
      series: [
        {
          x: data.interdependent.points.map((r) => r.p),
          y: data.interdependent.points.map((r) => r.s),
          color: PALETTE.cyan,
          points: 2,
        },
      ],
    });
  }

  if (data.kcore) {
    drawPlot(document.getElementById('d-kcore'), {
      height: 250,
      xLabel: 'p',
      yLabel: '3-core fraction',
      xRange: [0.5, 1],
      yRange: [0, 1],
      series: [{ x: data.kcore.points.map((r) => r.p), y: data.kcore.points.map((r) => r.s), color: PALETTE.violet }],
    });
  }

  if (data.continuum) {
    drawPlot(document.getElementById('d-cont'), {
      height: 250,
      xLabel: 'λ = nπr²',
      yLabel: 'S_max',
      xRange: [0.2, 2.2],
      yRange: [0, 1],
      vlines: [{ x: 1.128, color: 'rgba(255,180,84,0.5)', label: 'λ_c' }],
      series: [{ x: data.continuum.points.map((r) => r.lambda), y: data.continuum.points.map((r) => r.smax), color: PALETTE.green, points: 2 }],
    });
  }

  ctx.setStatus(t(lang, 'status_done'), `DATA · ${(data.crossing || []).length} CROSSING ROWS`);
  return null;
}

function canvas(id) {
  return `<div class="canvas-wrap"><canvas id="${id}"></canvas></div>`;
}

function pcTable(rows, lang) {
  return `<table class="mono" style="width:100%;border-collapse:collapse;font-size:11px">
    <thead><tr><th style="text-align:left;color:#2b9aa6;padding:6px 4px">L</th><th style="text-align:left;color:#2b9aa6;padding:6px 4px">p_c (S=0.5)</th><th style="text-align:left;color:#2b9aa6;padding:6px 4px">${t(lang, 'data_deviation')}</th></tr></thead>
    <tbody>${rows
      .map(
        (r) => `<tr><td style="padding:5px 4px;border-top:1px solid rgba(96,190,210,0.12)">${r.L}</td>
        <td style="padding:5px 4px;border-top:1px solid rgba(96,190,210,0.12);color:#4fe3ea">${fmt(r.pc, 4)}</td>
        <td style="padding:5px 4px;border-top:1px solid rgba(96,190,210,0.12);color:${Math.abs(r.pc - 0.5) > 0.004 ? '#ffb454' : '#6ef0a8'}">${fmt(r.pc - 0.5, 4)}</td></tr>`
      )
      .join('')}</tbody></table>
    <p class="hint" style="margin-top:10px">${t(lang, 'data_criterion_hint')}</p>`;
}
