"""Cardy's crossing formula, evaluated through the elliptic modulus.

With aspect ratio ``l = H/W``, the left-right crossing probability is

    P(l) = C * m**(1/3) * 2F1(1/3, 2/3; 4/3; m),

where ``m`` solves ``l = K(m) / K(1-m)`` and ``K`` is the complete elliptic
integral of the first kind.  For ``l > 1`` the identity ``P(l) = 1 - P(1/l)``
is used, so the hypergeometric series is only evaluated at ``m <= 1/2``.

The first edition substituted ``-l`` directly into the hypergeometric.  That
is a different function and is wrong at moderate aspect ratios; see the errata
in Chapter 14 and the regression values in the test suite.
"""

from __future__ import annotations

import math

CARDY_CONSTANT = 0.5660466803631597


def _ellip_k(m: float) -> float:
    """Complete elliptic integral K(m), parameter convention, by the AGM."""
    a = 1.0
    b = math.sqrt(1.0 - m)
    for _ in range(80):
        a, b = 0.5 * (a + b), math.sqrt(a * b)
    return math.pi / (2.0 * a)


def _ellip_k_complement(m: float) -> float:
    """K(1-m) without forming 1-m.

    For the small moduli used by l < 0.2, the subtraction 1-m loses the
    difference between neighbouring roots. The AGM for K(1-m) starts from
    sqrt(m), so the root can be resolved down to the double-precision limit.
    """
    a = 1.0
    b = math.sqrt(m)
    for _ in range(80):
        a, b = 0.5 * (a + b), math.sqrt(a * b)
    return math.pi / (2.0 * a)


def _hyp2f1_series(a: float, b: float, c: float, z: float) -> float:
    term = 1.0
    total = 1.0
    for n in range(1, 500000):
        term *= ((a + n - 1) * (b + n - 1)) / ((c + n - 1) * n) * z
        total += term
        if abs(term) < 1e-16 * abs(total):
            break
    return total


def cardy_modulus(l: float) -> float:
    """Elliptic modulus used by the stable evaluation for aspect ratio ``l``."""
    if not (l > 0.0) or not math.isfinite(l):
        raise ValueError("aspect ratio must be positive and finite")
    if l > 1.0:
        l = 1.0 / l
    if abs(l - 1.0) < 1e-15:
        return 0.5
    lo, hi = 0.0, 0.5
    for _ in range(90):
        mid = 0.5 * (lo + hi)
        if _ellip_k(mid) / _ellip_k_complement(mid) < l:
            lo = mid
        else:
            hi = mid
    return 0.5 * (lo + hi)


def cardy_hypergeom(l: float) -> float:
    """``2F1(1/3, 2/3; 4/3; m)`` at the modulus for ``l``."""
    m = cardy_modulus(l)
    return _hyp2f1_series(1 / 3, 2 / 3, 4 / 3, m)


def cardy_crossing(l: float) -> float:
    """Left-right crossing probability at p_c for aspect ratio l = H/W."""
    if not (l > 0.0) or not math.isfinite(l):
        raise ValueError("aspect ratio must be positive and finite")
    if l > 1.0:
        return 1.0 - cardy_crossing(1.0 / l)
    if abs(l - 1.0) < 1e-15:
        return 0.5
    m = cardy_modulus(l)
    return CARDY_CONSTANT * m ** (1.0 / 3.0) * _hyp2f1_series(1 / 3, 2 / 3, 4 / 3, m)


def cardy_crossing_vertical(l: float) -> float:
    """Vertical (top-bottom) crossing probability of the same rectangle."""
    if not (l > 0.0) or not math.isfinite(l):
        raise ValueError("aspect ratio must be positive and finite")
    return 1.0 - cardy_crossing(l)
