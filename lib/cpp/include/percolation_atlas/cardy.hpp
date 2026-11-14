// Cardy's crossing formula, evaluated through the elliptic modulus.
//
// With aspect ratio l = H/W, the left-right crossing probability is
//
//   P(l) = C * m^(1/3) * 2F1(1/3, 2/3; 4/3; m),
//   C    = 3*Gamma(2/3) / Gamma(1/3)^2 = 0.5660466803631597...,
//
// where m solves l = K(m) / K(1-m).  For l > 1 the identity
// P(l) = 1 - P(1/l) is used, so the series is evaluated at m <= 1/2.
//
// The first edition substituted -l directly into the hypergeometric; that is
// a different function and is wrong at moderate aspect ratios.  Chapter 14
// records the correction.

#pragma once

#include <cmath>
#include <stdexcept>

namespace atlas {

inline constexpr double CARDY_CONSTANT = 0.5660466803631597;

namespace detail {

// Complete elliptic integral K(m), parameter convention, via the AGM.
inline double ellip_k(double m) {
  double a = 1.0;
  double b = std::sqrt(1.0 - m);
  for (int i = 0; i < 80; ++i) {
    const double an = 0.5 * (a + b);
    b = std::sqrt(a * b);
    a = an;
  }
  return std::acos(-1.0) / (2.0 * a);
}

// K(1-m) without forming 1-m; keeps tiny moduli resolvable.
inline double ellip_k_complement(double m) {
  double a = 1.0;
  double b = std::sqrt(m);
  for (int i = 0; i < 80; ++i) {
    const double an = 0.5 * (a + b);
    b = std::sqrt(a * b);
    a = an;
  }
  return std::acos(-1.0) / (2.0 * a);
}

inline double hyp2f1_series(double a, double b, double c, double z) {
  double term = 1.0;
  double sum = 1.0;
  for (int n = 1; n < 500000; ++n) {
    term *= ((a + n - 1) * (b + n - 1)) / ((c + n - 1) * n) * z;
    sum += term;
    if (std::abs(term) < 1e-16 * std::abs(sum)) break;
  }
  return sum;
}

}  // namespace detail

// Elliptic modulus used by the stable evaluation for aspect ratio l.
inline double cardy_modulus(double l) {
  if (!(l > 0.0) || !std::isfinite(l)) {
    throw std::invalid_argument("aspect ratio must be positive and finite");
  }
  if (l > 1.0) l = 1.0 / l;
  if (std::abs(l - 1.0) < 1e-15) return 0.5;
  double lo = 0.0;
  double hi = 0.5;
  for (int i = 0; i < 90; ++i) {
    const double mid = 0.5 * (lo + hi);
    const double ratio = detail::ellip_k(mid) / detail::ellip_k_complement(mid);
    if (ratio < l) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return 0.5 * (lo + hi);
}

// 2F1(1/3, 2/3; 4/3; m) at the modulus corresponding to l.
inline double cardy_hypergeom(double l) {
  const double m = cardy_modulus(l);
  return detail::hyp2f1_series(1.0 / 3.0, 2.0 / 3.0, 4.0 / 3.0, m);
}

// Left-right crossing probability of a W x H rectangle at criticality.
inline double cardy_crossing(double l) {
  if (!(l > 0.0) || !std::isfinite(l)) {
    throw std::invalid_argument("aspect ratio must be positive and finite");
  }
  if (l > 1.0) return 1.0 - cardy_crossing(1.0 / l);
  if (std::abs(l - 1.0) < 1e-15) return 0.5;
  const double m = cardy_modulus(l);
  return CARDY_CONSTANT * std::pow(m, 1.0 / 3.0) *
         detail::hyp2f1_series(1.0 / 3.0, 2.0 / 3.0, 4.0 / 3.0, m);
}

// Vertical (top-bottom) crossing probability of the same rectangle.
inline double cardy_crossing_vertical(double l) {
  if (!(l > 0.0) || !std::isfinite(l)) {
    throw std::invalid_argument("aspect ratio must be positive and finite");
  }
  return 1.0 - cardy_crossing(l);
}

}  // namespace atlas
