/**
 * Exact percolation on trees, configuration models and SIR final size.
 *
 * These routines are deterministic fixed-point calculations (Chapters 22 and
 * 23).  For a supercritical tree the map has a trivial fixed point at u = 1
 * and a physical one at u < 1; bisection on the first sign change selects the
 * physical root, so the answer does not depend on an initial guess.
 */

/** Threshold of the z-regular tree, 1/(z-1). */
export function betheThreshold(z) {
  if (!Number.isInteger(z) || z < 2) throw new Error('the Bethe lattice needs an integer degree z >= 2');
  return 1 / (z - 1);
}

/** Smallest u in [0,1] with g(u) = u, for increasing g with g(1) = 1. */
function firstRoot(g, tol = 1e-13, iterations = 200) {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < iterations; i++) {
    const mid = 0.5 * (lo + hi);
    if (g(mid) - mid > 0) lo = mid;
    else hi = mid;
    if (hi - lo < tol) break;
  }
  return hi;
}

/**
 * Percolation on the z-regular tree.
 *
 * Returns theta, the finite-branch probability u, and the subcritical mean
 * cluster size chi. Above p_c the mean cluster size including the infinite
 * cluster is infinite, so chi is Infinity.
 */
export function bethePercolation(z, p) {
  if (!Number.isInteger(z) || z < 2) throw new Error('the Bethe lattice needs an integer degree z >= 2');
  if (!(p >= 0 && p <= 1)) throw new Error('p must lie in [0,1]');
  const pc = betheThreshold(z);
  if (p >= 1) {
    // The fully open tree has no finite branch; for z = 2 this is also the
    // threshold, so the p <= pc shortcut below must not swallow it.
    return { z, p, pc, theta: 1, u: 0, chi: Infinity, supercritical: true };
  }
  if (p <= pc) {
    return {
      z, p, pc,
      theta: 0,
      u: 1,
      chi: p >= pc ? Infinity : 1 + (z * p) / (1 - p * (z - 1)),
      supercritical: false,
    };
  }
  const u = firstRoot((x) => (1 - p + p * x) ** (z - 1));
  const theta = 1 - (1 - p + p * u) ** z;
  return { z, p, pc, theta: Math.max(0, theta), u, chi: Infinity, supercritical: true };
}

function normalisePmf(pmf) {
  if (!pmf || pmf.length === 0) throw new Error('degree distribution must not be empty');
  let total = 0;
  const out = new Array(pmf.length);
  for (let k = 0; k < pmf.length; k++) {
    const x = Number(pmf[k]);
    if (!(x >= 0) || !Number.isFinite(x)) throw new Error('degree probabilities must be finite and non-negative');
    out[k] = x;
    total += x;
  }
  if (!(total > 0)) throw new Error('degree probabilities must have positive sum');
  for (let k = 0; k < out.length; k++) out[k] /= total;
  return out;
}

/** Truncated Poisson probabilities, normalised to sum to one. */
export function poissonPmf(c, kmax = null) {
  if (!(c >= 0) || !Number.isFinite(c)) throw new Error('Poisson mean must be finite and non-negative');
  let K = kmax == null ? Math.floor(c + 12 * Math.sqrt(c + 1) + 30) : Math.floor(kmax);
  K = Math.max(0, K);
  const out = [];
  let term = Math.exp(-c);
  for (let k = 0; k <= K; k++) {
    out.push(term);
    term *= c / (k + 1);
  }
  const total = out.reduce((a, b) => a + b, 0);
  return out.map((x) => x / total);
}

/**
 * Giant-component fraction of the configuration model after bond dilution.
 *
 *   u = G1(1 - T + T u),   S = 1 - G0(1 - T + T u)
 *
 * with G0 the degree generating function and G1 its size-biased counterpart.
 */
export function configurationGiantComponent(pmf, T = 1) {
  if (!(T >= 0 && T <= 1)) throw new Error('T must lie in [0,1]');
  const p = normalisePmf(pmf);
  let mean = 0;
  let second = 0;
  for (let k = 0; k < p.length; k++) {
    mean += k * p[k];
    second += k * (k - 1) * p[k];
  }
  if (!(mean > 0)) {
    return { T, S: 0, u: 1, kappa: 1, tc: Infinity, meanDegree: 0, r0: 0 };
  }
  const kappa = 1 + second / mean;
  const tc = kappa > 1 ? 1 / (kappa - 1) : Infinity;

  const g0 = (x) => {
    let s = 0;
    for (let k = 0; k < p.length; k++) s += p[k] * x ** k;
    return s;
  };
  const g1 = (x) => {
    let s = 0;
    for (let k = 1; k < p.length; k++) s += ((k * p[k]) / mean) * x ** (k - 1);
    return s;
  };

  const u = firstRoot((x) => g1(1 - T + T * x));
  let S = 1 - g0(1 - T + T * u);
  S = Math.min(1, Math.max(0, S));
  return { T, S, u, kappa, tc, meanDegree: mean, r0: T * (kappa - 1) };
}

/**
 * Final fraction of an SIR epidemic mapped to bond percolation.
 *
 * T is the per-edge transmissibility; the final size is the giant component
 * of the configuration model with retention T.
 */
export function sirFinalSize(pmf, T) {
  const g = configurationGiantComponent(pmf, T);
  const r0 = g.r0;
  return {
    T,
    finalSize: g.S,
    r0,
    kappa: g.kappa,
    tc: g.tc,
    herdImmunity: r0 > 1 ? 1 - 1 / r0 : 0,
  };
}
