"""Exact percolation on trees, configuration models and SIR final size.

These routines are the numerical content of Chapters 22 and 23.  Everything
here is deterministic: the tree and configuration-model answers are fixed
points of one-dimensional maps, and the SIR final size is the same fixed point
with the transmissibility interpretation.

The fixed-point selection matters.  For a supercritical tree the map has two
fixed points, the trivial one at ``u = 1`` (no giant component) and the
physical one at ``u < 1``.  Iterating from ``u = 0`` converges to the physical
root; iterating from ``u = 1`` stays at the trivial root.  The implementations
use bisection on the first sign change so that the answer does not depend on
the starting point.
"""

from __future__ import annotations

import math
from dataclasses import dataclass

__all__ = [
    "BetheResult",
    "GiantComponentResult",
    "SirResult",
    "bethe_threshold",
    "bethe_percolation",
    "poisson_pmf",
    "configuration_giant_component",
    "sir_final_size",
]


@dataclass
class BetheResult:
    z: int
    p: float
    pc: float
    theta: float
    u: float
    chi: float
    supercritical: bool


@dataclass
class GiantComponentResult:
    T: float
    S: float
    u: float
    kappa: float
    tc: float
    mean_degree: float
    r0: float


@dataclass
class SirResult:
    T: float
    final_size: float
    r0: float
    kappa: float
    tc: float
    herd_immunity: float


def bethe_threshold(z: int) -> float:
    """Bond (and site) threshold of the z-regular tree, 1/(z-1)."""
    if not isinstance(z, int) or z < 2:
        raise ValueError("the Bethe lattice needs an integer degree z >= 2")
    return 1.0 / (z - 1)


def _first_root(g, *, tol=1e-13, iterations=200):
    """Smallest u in [0,1] with g(u) = u, assuming g(0) >= 0 and g(1) = 1.

    ``g`` must be increasing and satisfy g(u) - u > 0 for small u when a
    nontrivial root exists.  Bisection then finds the first crossing; when no
    crossing exists it returns 1.
    """
    lo, hi = 0.0, 1.0
    for _ in range(iterations):
        mid = 0.5 * (lo + hi)
        if g(mid) - mid > 0.0:
            lo = mid
        else:
            hi = mid
        if hi - lo < tol:
            break
    return hi


def bethe_percolation(z: int, p: float) -> BetheResult:
    """Percolation on the z-regular tree.

    Returns the percolation probability ``theta``, the finite-branch
    probability ``u`` and the subcritical mean cluster size ``chi``.  Above
    ``p_c`` the mean cluster size including the infinite cluster is infinite,
    so ``chi`` is reported as ``inf`` there.
    """
    if not isinstance(z, int) or z < 2:
        raise ValueError("the Bethe lattice needs an integer degree z >= 2")
    if not (0.0 <= p <= 1.0):
        raise ValueError("p must lie in [0,1]")
    pc = bethe_threshold(z)
    if p >= 1.0:
        # The fully open tree has no finite branch; for z = 2 this is also the
        # threshold, so the p <= pc shortcut below must not swallow it.
        return BetheResult(z=z, p=p, pc=pc, theta=1.0, u=0.0, chi=math.inf, supercritical=True)
    if p <= pc:
        return BetheResult(z=z, p=p, pc=pc, theta=0.0, u=1.0, chi=math.inf if p >= pc else 1.0 + z * p / (1.0 - p * (z - 1)), supercritical=False)
    u = _first_root(lambda x: (1.0 - p + p * x) ** (z - 1))
    theta = 1.0 - (1.0 - p + p * u) ** z
    return BetheResult(z=z, p=p, pc=pc, theta=max(0.0, theta), u=u, chi=math.inf, supercritical=True)


def _normalise_pmf(pmf) -> list[float]:
    values = [float(x) for x in pmf]
    if not values:
        raise ValueError("degree distribution must not be empty")
    if any(x < 0.0 or not math.isfinite(x) for x in values):
        raise ValueError("degree probabilities must be finite and non-negative")
    total = sum(values)
    if total <= 0.0:
        raise ValueError("degree probabilities must have positive sum")
    return [x / total for x in values]


def poisson_pmf(c: float, kmax: int | None = None) -> list[float]:
    """Truncated Poisson probabilities, normalised to sum to one."""
    if not (c >= 0.0) or not math.isfinite(c):
        raise ValueError("Poisson mean must be finite and non-negative")
    if kmax is None:
        kmax = int(c + 12.0 * math.sqrt(c + 1.0) + 30)
    kmax = max(0, int(kmax))
    out = []
    term = math.exp(-c)
    for k in range(kmax + 1):
        out.append(term)
        term *= c / (k + 1)
    total = sum(out)
    return [x / total for x in out]


def configuration_giant_component(pmf, T: float = 1.0) -> GiantComponentResult:
    """Giant-component fraction of the configuration model after bond dilution.

    ``pmf[k]`` is the probability of degree ``k``.  ``T`` is the probability
    that an edge is retained.  The equations are (22.8)-(22.10):

        u = G1(1 - T + T u),   S = 1 - G0(1 - T + T u).
    """
    if not (0.0 <= T <= 1.0):
        raise ValueError("T must lie in [0,1]")
    p = _normalise_pmf(pmf)
    mean = sum(k * pk for k, pk in enumerate(p))
    if mean <= 0.0:
        return GiantComponentResult(T=T, S=0.0, u=1.0, kappa=1.0, tc=math.inf, mean_degree=0.0, r0=0.0)
    second = sum(k * (k - 1) * pk for k, pk in enumerate(p))
    kappa = 1.0 + second / mean
    tc = 1.0 / (kappa - 1.0) if kappa > 1.0 else math.inf

    def g1(x: float) -> float:
        # G1(x) = sum_{k>=1} k p_k x^(k-1) / <k>
        return sum((k * pk / mean) * (x ** (k - 1)) for k, pk in enumerate(p) if k >= 1)

    def g0(x: float) -> float:
        return sum(pk * (x**k) for k, pk in enumerate(p))

    u = _first_root(lambda x: g1(1.0 - T + T * x))
    S = 1.0 - g0(1.0 - T + T * u)
    S = min(1.0, max(0.0, S))
    return GiantComponentResult(
        T=T,
        S=S,
        u=u,
        kappa=kappa,
        tc=tc,
        mean_degree=mean,
        r0=T * (kappa - 1.0),
    )


def sir_final_size(pmf, T: float) -> SirResult:
    """Final fraction of an SIR epidemic mapped to bond percolation.

    ``T`` is the per-edge transmissibility.  The final size equals the giant
    component of the configuration model with retention ``T``; ``R0`` is
    ``T (<k^2> - <k>) / <k>`` by (23.3).
    """
    g = configuration_giant_component(pmf, T)
    r0 = g.r0
    herd = 1.0 - 1.0 / r0 if r0 > 1.0 else 0.0
    return SirResult(T=T, final_size=g.S, r0=r0, kappa=g.kappa, tc=g.tc, herd_immunity=herd)
