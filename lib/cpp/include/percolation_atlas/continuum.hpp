// Continuum (Boolean) percolation in the unit square: Poisson points, hard
// disks of radius r, two disks connected when they overlap (squared centre
// distance <= (2r)^2).  Neighbour search uses a uniform grid with cell size
// 2r.  Counterpart of lib/js/engine/continuum.js.

#pragma once

#include <algorithm>
#include <cmath>
#include <cstddef>
#include <functional>
#include <stdexcept>
#include <unordered_map>
#include <utility>
#include <vector>

#include "percolation_atlas/percolation.hpp"
#include "percolation_atlas/rng.hpp"

namespace atlas {

struct PoissonPoints {
  std::vector<double> x;
  std::vector<double> y;
  int n = 0;
};

inline PoissonPoints poisson_points(int n, Rng& rng) {
  if (n < 0) throw std::invalid_argument("n must be non-negative");
  PoissonPoints pts;
  pts.n = n;
  pts.x.resize(static_cast<std::size_t>(n));
  pts.y.resize(static_cast<std::size_t>(n));
  for (int i = 0; i < n; ++i) {
    pts.x[static_cast<std::size_t>(i)] = rng.random();
    pts.y[static_cast<std::size_t>(i)] = rng.random();
  }
  return pts;
}

struct BooleanModel {
  int n = 0;
  double r = 0.0;
  std::vector<double> x;
  std::vector<double> y;
  std::vector<int> sizes;  // descending
  int largest = 0;
  double largest_fraction = 0.0;
  double coverage = 0.0;
  Dsu dsu;
};

inline BooleanModel boolean_model(int n, double r, Rng& rng) {
  if (n < 0) throw std::invalid_argument("n must be non-negative");
  if (!(r > 0.0)) throw std::invalid_argument("radius must be positive");

  PoissonPoints pts = poisson_points(n, rng);
  const std::vector<double>& x = pts.x;
  const std::vector<double>& y = pts.y;
  Dsu dsu(n);

  const double size = 2.0 * r;
  struct CellHash {
    std::size_t operator()(const std::pair<long long, long long>& p) const noexcept {
      const std::size_t h1 = std::hash<long long>{}(p.first);
      const std::size_t h2 = std::hash<long long>{}(p.second);
      return h1 ^ (h2 + 0x9E3779B97F4A7C15ULL + (h1 << 6) + (h1 >> 2));
    }
  };
  std::unordered_map<std::pair<long long, long long>, std::vector<int>, CellHash> cells;
  cells.reserve(static_cast<std::size_t>(n) * 2 + 1);

  const auto cell_of = [size](double coord) {
    return static_cast<long long>(std::floor(coord / size));
  };
  for (int v = 0; v < n; ++v) {
    cells[{cell_of(x[static_cast<std::size_t>(v)]), cell_of(y[static_cast<std::size_t>(v)])}]
        .push_back(v);
  }

  const double r2 = (2.0 * r) * (2.0 * r);
  for (int v = 0; v < n; ++v) {
    const long long cx = cell_of(x[static_cast<std::size_t>(v)]);
    const long long cy = cell_of(y[static_cast<std::size_t>(v)]);
    for (int dx = -1; dx <= 1; ++dx) {
      for (int dy = -1; dy <= 1; ++dy) {
        const auto it = cells.find({cx + dx, cy + dy});
        if (it == cells.end()) continue;
        for (const int w : it->second) {
          if (w <= v) continue;
          const double ddx = x[static_cast<std::size_t>(v)] - x[static_cast<std::size_t>(w)];
          const double ddy = y[static_cast<std::size_t>(v)] - y[static_cast<std::size_t>(w)];
          if (ddx * ddx + ddy * ddy <= r2) dsu.unite(v, w);
        }
      }
    }
  }

  std::vector<int> root_count(static_cast<std::size_t>(n), 0);
  std::vector<int> touched;
  touched.reserve(static_cast<std::size_t>(n));
  for (int v = 0; v < n; ++v) {
    const int root = dsu.find(v);
    if (root_count[static_cast<std::size_t>(root)] == 0) touched.push_back(root);
    ++root_count[static_cast<std::size_t>(root)];
  }
  std::vector<int> sizes;
  sizes.reserve(touched.size());
  for (const int root : touched) sizes.push_back(root_count[static_cast<std::size_t>(root)]);
  std::sort(sizes.begin(), sizes.end(), std::greater<>());
  const int largest = sizes.empty() ? 0 : sizes.front();

  BooleanModel out;
  out.n = n;
  out.r = r;
  out.x = std::move(pts.x);
  out.y = std::move(pts.y);
  out.sizes = std::move(sizes);
  out.largest = largest;
  out.largest_fraction = n ? static_cast<double>(largest) / n : 0.0;
  out.coverage = 1.0 - std::exp(-static_cast<double>(n) * 3.14159265358979323846 * r * r);
  out.dsu = std::move(dsu);
  return out;
}

}  // namespace atlas
