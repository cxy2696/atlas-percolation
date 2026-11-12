// Directed percolation on an L x L square lattice.
//
// Edges point east (E) and south (S).  Bond mode opens every E/S edge with
// probability p; site mode occupies every site with probability p and treats
// all E/S edges between occupied sites as open.  The reachability DP is
// row-major and O(L^2).  RNG consumption is identical to the undirected
// sampler: n uniforms for site mode, m for bond mode, in lattice order.

#pragma once

#include <cstdint>
#include <stdexcept>
#include <vector>

#include "percolation_atlas/lattice.hpp"
#include "percolation_atlas/rng.hpp"

namespace atlas {

struct DirectedResult {
  bool cross = false;
  bool site = false;
  std::vector<std::uint8_t> reach;
  std::vector<std::uint8_t> open;
  std::vector<std::uint8_t> occ;
  int m = 0;
  int n = 0;
};

inline DirectedResult directed_crossing(const Lattice& lat, double p, Rng& rng, bool site = false) {
  if (lat.kind != "square") {
    throw std::invalid_argument("directed percolation needs the square lattice");
  }
  const int L = lat.L;
  const int n = lat.n;
  DirectedResult out;
  out.site = site;
  out.m = lat.m;
  out.n = n;
  out.reach.assign(static_cast<std::size_t>(n), 0);
  out.occ.assign(static_cast<std::size_t>(n), 1);
  out.open.assign(static_cast<std::size_t>(lat.m), 1);
  if (site) {
    for (int v = 0; v < n; ++v) {
      out.occ[static_cast<std::size_t>(v)] = rng.random() < p ? 1 : 0;
    }
  } else {
    for (int e = 0; e < lat.m; ++e) {
      out.open[static_cast<std::size_t>(e)] = rng.random() < p ? 1 : 0;
    }
  }

  std::vector<int> east(static_cast<std::size_t>(n), -1);
  std::vector<int> south(static_cast<std::size_t>(n), -1);
  for (int e = 0; e < lat.m; ++e) {
    const int a = lat.eu[static_cast<std::size_t>(e)];
    const int b = lat.ev[static_cast<std::size_t>(e)];
    if (b == a + 1 && a / L == b / L) {
      east[static_cast<std::size_t>(a)] = e;
    } else if (b == a + L) {
      south[static_cast<std::size_t>(a)] = e;
    }
  }

  for (int i = 0; i < L; ++i) {
    for (int j = 0; j < L; ++j) {
      const int v = i * L + j;
      if (out.occ[static_cast<std::size_t>(v)] == 0) continue;
      bool reachable = (j == 0);
      if (!reachable && j > 0) {
        const int e = east[static_cast<std::size_t>(v - 1)];
        if (e >= 0 && out.reach[static_cast<std::size_t>(v - 1)] != 0 &&
            out.open[static_cast<std::size_t>(e)] != 0) {
          reachable = true;
        }
      }
      if (!reachable && i > 0) {
        const int e = south[static_cast<std::size_t>(v - L)];
        if (e >= 0 && out.reach[static_cast<std::size_t>(v - L)] != 0 &&
            out.open[static_cast<std::size_t>(e)] != 0) {
          reachable = true;
        }
      }
      out.reach[static_cast<std::size_t>(v)] = reachable ? 1 : 0;
      if (reachable && j == L - 1) out.cross = true;
    }
  }
  return out;
}

inline bool directed_crosses_lr(const Lattice& lat, double p, Rng& rng, bool site = false) {
  return directed_crossing(lat, p, rng, site).cross;
}

inline double directed_crossing_rate(const Lattice& lat, double p, Rng& rng, bool site = false,
                                     int samples = 100) {
  if (samples < 1) throw std::invalid_argument("samples must be positive");
  int hits = 0;
  for (int s = 0; s < samples; ++s) {
    if (directed_crossing(lat, p, rng, site).cross) ++hits;
  }
  return samples > 0 ? static_cast<double>(hits) / samples : 0.0;
}

}  // namespace atlas
