# Cardy's crossing formula, evaluated through the elliptic modulus.
#
# With aspect ratio l = H/W, the left-right crossing probability is
#
#   P(l) = C * m^(1/3) * 2F1(1/3, 2/3; 4/3; m),
#   C    = 3*Gamma(2/3) / Gamma(1/3)^2 = 0.5660466803631597,
#
# where m solves l = K(m) / K(1-m).  For l > 1 the identity
# P(l) = 1 - P(1/l) is used, so the series is evaluated at m <= 1/2.
#
# The first edition substituted -l directly into the hypergeometric; that is
# a different function and is wrong at moderate aspect ratios.

const CARDY_CONSTANT = 0.5660466803631597

# Complete elliptic integral K(m), parameter convention, via the AGM.
function _ellip_k(m::Float64)
    a = 1.0
    b = sqrt(1.0 - m)
    for _ in 1:80
        a, b = 0.5 * (a + b), sqrt(a * b)
    end
    return pi / (2.0 * a)
end

# K(1-m) without forming 1-m; keeps tiny moduli resolvable.
function _ellip_k_complement(m::Float64)
    a = 1.0
    b = sqrt(m)
    for _ in 1:80
        a, b = 0.5 * (a + b), sqrt(a * b)
    end
    return pi / (2.0 * a)
end

function _cardy_hyp2f1_series(a::Float64, b::Float64, c::Float64, z::Float64)
    term = 1.0
    total = 1.0
    for n in 1:499999
        term *= ((a + n - 1) * (b + n - 1)) / ((c + n - 1) * n) * z
        total += term
        abs(term) < 1e-16 * abs(total) && break
    end
    return total
end

"""Elliptic modulus used by the stable evaluation for aspect ratio `l`."""
function cardy_modulus(l::Real)
    lf = Float64(l)
    (lf > 0.0 && isfinite(lf)) || throw(ArgumentError("aspect ratio must be positive and finite"))
    lf > 1.0 && (lf = 1.0 / lf)
    abs(lf - 1.0) < 1e-15 && return 0.5
    lo, hi = 0.0, 0.5
    for _ in 1:90
        mid = 0.5 * (lo + hi)
        if _ellip_k(mid) / _ellip_k_complement(mid) < lf
            lo = mid
        else
            hi = mid
        end
    end
    return 0.5 * (lo + hi)
end

"""`2F1(1/3, 2/3; 4/3; m)` at the modulus corresponding to `l`."""
function cardy_hypergeom(l::Real)
    m = cardy_modulus(l)
    return _cardy_hyp2f1_series(1 / 3, 2 / 3, 4 / 3, m)
end

"""
    cardy_crossing(l)

Left-right crossing probability at criticality for aspect ratio `l = H/W`.
"""
function cardy_crossing(l::Real)
    lf = Float64(l)
    (lf > 0.0 && isfinite(lf)) || throw(ArgumentError("aspect ratio must be positive and finite"))
    lf > 1.0 && return 1.0 - cardy_crossing(1.0 / lf)
    abs(lf - 1.0) < 1e-15 && return 0.5
    m = cardy_modulus(lf)
    return CARDY_CONSTANT * m^(1 / 3) * _cardy_hyp2f1_series(1 / 3, 2 / 3, 4 / 3, m)
end

"""Vertical (top-bottom) crossing probability of the same rectangle."""
function cardy_crossing_vertical(l::Real)
    lf = Float64(l)
    (lf > 0.0 && isfinite(lf)) || throw(ArgumentError("aspect ratio must be positive and finite"))
    return 1.0 - cardy_crossing(lf)
end
