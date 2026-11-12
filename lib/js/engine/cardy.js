/**
 * Cardy's crossing formula for critical percolation in a rectangle.
 *
 * With aspect ratio l = H/W, the left-right crossing probability is
 *
 *   P(l) = C * m^(1/3) * 2F1(1/3, 2/3; 4/3; m),
 *   C    = 3*Gamma(2/3) / Gamma(1/3)^2 = 0.5660466803631552...,
 *
 * where m is the elliptic modulus fixed by
 *
 *   l = K(m) / K(1-m),       K(m) = int_0^(pi/2) (1 - m sin^2 t)^(-1/2) dt.
 *
 * For l > 1 the identity P(l) + P(1/l) = 1 is used, so the series is only
 * evaluated for m <= 1/2, where it converges quickly.  The earlier edition
 * substituted -l directly into the hypergeometric and was wrong by a wide
 * margin at moderate aspect ratios; Chapter 14 records the correction.
 */

const C_CARDY = 0.5660466803631552;

/** Complete elliptic integral of the first kind, parameter m in [0, 1). */
function ellipK(m) {
  let a = 1;
  let b = Math.sqrt(1 - m);
  for (let i = 0; i < 80; i++) {
    const an = 0.5 * (a + b);
    b = Math.sqrt(a * b);
    a = an;
  }
  return Math.PI / (2 * a);
}

function hyp2f1Series(a, b, c, z) {
  let term = 1;
  let sum = 1;
  for (let n = 1; n < 500000; n++) {
    term *= ((a + n - 1) * (b + n - 1)) / ((c + n - 1) * n) * z;
    sum += term;
    if (Math.abs(term) < 1e-16 * Math.abs(sum)) break;
  }
  return sum;
}

/** Elliptic modulus m corresponding to aspect ratio l = H/W (0 < l <= 1). */
export function cardyModulus(l) {
  if (!(l > 0) || !Number.isFinite(l)) throw new Error('aspect ratio must be positive and finite');
  if (l > 1) l = 1 / l;
  if (Math.abs(l - 1) < 1e-15) return 0.5;
  let lo = 0;
  let hi = 0.5;
  for (let i = 0; i < 90; i++) {
    const mid = 0.5 * (lo + hi);
    const ratio = ellipK(mid) / ellipK(1 - mid);
    if (ratio < l) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

/** 2F1(1/3, 2/3; 4/3; m) at the modulus corresponding to l = H/W. */
export function cardyHypergeom(l) {
  const m = cardyModulus(l);
  return hyp2f1Series(1 / 3, 2 / 3, 4 / 3, m);
}

/** Left-right crossing probability of a W x H rectangle at criticality. */
export function cardyCrossing(l) {
  if (!(l > 0) || !Number.isFinite(l)) throw new Error('aspect ratio must be positive and finite');
  if (l > 1) return 1 - cardyCrossing(1 / l);
  if (Math.abs(l - 1) < 1e-15) return 0.5;
  const m = cardyModulus(l);
  return C_CARDY * Math.cbrt(m) * hyp2f1Series(1 / 3, 2 / 3, 4 / 3, m);
}

/** Vertical (top-bottom) crossing probability of the same rectangle. */
export function cardyCrossingVertical(l) {
  if (!(l > 0) || !Number.isFinite(l)) throw new Error('aspect ratio must be positive and finite');
  return 1 - cardyCrossing(l);
}

export const CARDY_CONSTANT = C_CARDY;
