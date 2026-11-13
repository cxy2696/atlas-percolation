// Bernoulli percolation, cluster statistics and the Newman-Ziff sweep.
// This is the C++ counterpart of lib/js/engine/percolation.js and
// lib/python/percolation_atlas/percolation.py.
//
// RNG consumption order is part of the public contract:
//   - site mode: n uniforms, site order 0..n-1;
//   - bond mode: m uniforms, edge order as produced by build_lattice();
//   - newman_ziff_site: one Fisher-Yates permutation of the n site indices.

#pragma once

#include <algorithm>
#include <cstddef>
#include <cstdint>
#include <functional>
#include <numeric>
#include <stdexcept>
#include <string>
#include <string_view>
#include <vector>

#include "percolation_atlas/lattice.hpp"
#include "percolation_atlas/rng.hpp"

namespace atlas {

// Disjoint-set union with path compression/union by size.  The traversal is
// the same as the reference Dsu (compress every node on the find path).
class Dsu {
 public:
  explicit Dsu(int n = 0) : n_(n) {
    if (n < 0) throw std::invalid_argument("Dsu size must be non-negative");
    reset();
  }

  // active_count defaults to n; Percolation::build() passes the number of
  // occupied sites, exactly like the reference implementation's dsu.count.
  void reset(int active_count = -1) {
    parent_.resize(static_cast<std::size_t>(n_));
    size_.assign(static_cast<std::size_t>(n_), 1);
    for (int i = 0; i < n_; ++i) parent_[static_cast<std::size_t>(i)] = i;
    count_ = active_count < 0 ? n_ : active_count;
    max_size_ = (active_count == 0) ? 0 : (n_ > 0 ? 1 : 0);
  }

  int find(int x) {
    int r = x;
    while (parent_[static_cast<std::size_t>(r)] != r) r = parent_[static_cast<std::size_t>(r)];
    while (parent_[static_cast<std::size_t>(x)] != r) {
      const int next = parent_[static_cast<std::size_t>(x)];
      parent_[static_cast<std::size_t>(x)] = r;
      x = next;
    }
    return r;
  }

  bool unite(int a, int b) {
    int ra = find(a);
    int rb = find(b);
    if (ra == rb) return false;
    if (size_[static_cast<std::size_t>(ra)] < size_[static_cast<std::size_t>(rb)]) {
      std::swap(ra, rb);
    }
    parent_[static_cast<std::size_t>(rb)] = ra;
    size_[static_cast<std::size_t>(ra)] += size_[static_cast<std::size_t>(rb)];
    --count_;
    if (size_[static_cast<std::size_t>(ra)] > max_size_) {
      max_size_ = size_[static_cast<std::size_t>(ra)];
    }
    return true;
  }

  // Mark one previously inactive site as a new singleton cluster.  The site
  // Newman-Ziff sweep starts from an empty DSU (count = max_size = 0) and
  // activates one site per step, exactly like the reference counters.
  void activate() {
    ++count_;
    if (max_size_ < 1) max_size_ = 1;
  }

  int n() const noexcept { return n_; }
  int count() const noexcept { return count_; }
  int max_size() const noexcept { return max_size_; }
  int root_size(int root) const noexcept { return size_[static_cast<std::size_t>(root)]; }
  int component_size(int v) { return size_[static_cast<std::size_t>(find(v))]; }

 private:
  int n_ = 0;
  int count_ = 0;
  int max_size_ = 0;
  std::vector<int> parent_;
  std::vector<int> size_;
};

struct ClusterStats {
  int count = 0;
  int max_size = 0;
  long long sum = 0;
  long long sum2 = 0;
  std::vector<int> sizes;  // descending, for reporting

  // Susceptibility proxy: sum |C|^2 / (number of occupied sites).
  double chi2() const noexcept {
    return sum ? static_cast<double>(sum2) / static_cast<double>(sum) : 0.0;
  }
  // Largest cluster as a fraction of the occupied sites.
  double max_fraction() const noexcept {
    return sum ? static_cast<double>(max_size) / static_cast<double>(sum) : 0.0;
  }
  double mean_size() const noexcept {
    return count ? static_cast<double>(sum) / static_cast<double>(count) : 0.0;
  }
};

enum class Mode { Site, Bond };

inline Mode parse_mode(std::string_view mode) {
  if (mode == "site") return Mode::Site;
  if (mode == "bond") return Mode::Bond;
  throw std::invalid_argument("bad mode " + std::string(mode));
}

inline const char* to_string(Mode mode) noexcept {
  return mode == Mode::Site ? "site" : "bond";
}

class Percolation {
 public:
  explicit Percolation(const Lattice& lattice, Mode mode = Mode::Bond)
      : lat_(&lattice),
        mode_(mode),
        occ_(static_cast<std::size_t>(lattice.n), 1),
        open_(static_cast<std::size_t>(lattice.m), 1),
        dsu_(lattice.n),
        stamp_(static_cast<std::size_t>(lattice.n), 0) {}

  explicit Percolation(const Lattice& lattice, std::string_view mode)
      : Percolation(lattice, parse_mode(mode)) {}

  // Draw a fresh configuration.  Returns *this.
  Percolation& sample(double p, Rng& rng) {
    if (mode_ == Mode::Site) {
      for (int v = 0; v < lat_->n; ++v) {
        occ_[static_cast<std::size_t>(v)] = rng.random() < p ? 1 : 0;
      }
      std::fill(open_.begin(), open_.end(), 1);
    } else {
      std::fill(occ_.begin(), occ_.end(), 1);
      for (int e = 0; e < lat_->m; ++e) {
        open_[static_cast<std::size_t>(e)] = rng.random() < p ? 1 : 0;
      }
    }
    dirty_ = true;
    return *this;
  }

  // Build the union-find forest.  Returns dsu().
  const Dsu& build() {
    int active = 0;
    for (const std::uint8_t o : occ_) active += o;
    dsu_.reset(active);
    for (int e = 0; e < lat_->m; ++e) {
      if (open_[static_cast<std::size_t>(e)] && occ_[static_cast<std::size_t>(lat_->eu[e])] &&
          occ_[static_cast<std::size_t>(lat_->ev[e])]) {
        dsu_.unite(lat_->eu[e], lat_->ev[e]);
      }
    }
    dirty_ = false;
    return dsu_;
  }

  const Dsu& ensure_built() {
    if (dirty_) build();
    return dsu_;
  }

  // Cluster statistics.  Sizes are returned in descending order.
  const ClusterStats& analyze() {
    build();
    const std::size_t n = static_cast<std::size_t>(lat_->n);
    root_count_.assign(n, 0);
    touched_.clear();
    for (int v = 0; v < lat_->n; ++v) {
      if (!occ_[static_cast<std::size_t>(v)]) continue;
      const int r = dsu_.find(v);
      if (root_count_[static_cast<std::size_t>(r)] == 0) {
        touched_.push_back(r);
      }
      ++root_count_[static_cast<std::size_t>(r)];
    }

    stats_.count = 0;
    stats_.max_size = 0;
    stats_.sum = 0;
    stats_.sum2 = 0;
    stats_.sizes.resize(touched_.size());
    for (std::size_t k = 0; k < touched_.size(); ++k) {
      const int r = touched_[k];
      const int s = root_count_[static_cast<std::size_t>(r)];
      root_count_[static_cast<std::size_t>(r)] = 0;
      stats_.sizes[k] = s;
      ++stats_.count;
      stats_.sum += s;
      stats_.sum2 += static_cast<long long>(s) * s;
      if (s > stats_.max_size) stats_.max_size = s;
    }
    std::sort(stats_.sizes.begin(), stats_.sizes.end(), std::greater<>());
    return stats_;
  }

  // Does some cluster join the left and right boundary?
  bool crosses_lr() {
    ensure_built();
    const int L = lat_->L;
    const std::uint32_t gen = next_generation();
    for (int i = 0; i < L; ++i) {
      const int v = i * L;
      if (occ_[static_cast<std::size_t>(v)]) {
        stamp_[static_cast<std::size_t>(dsu_.find(v))] = gen;
      }
    }
    for (int i = 0; i < L; ++i) {
      const int v = i * L + L - 1;
      if (occ_[static_cast<std::size_t>(v)] &&
          stamp_[static_cast<std::size_t>(dsu_.find(v))] == gen) {
        return true;
      }
    }
    return false;
  }

  // Does some cluster join the top and bottom boundary?
  bool crosses_tb() {
    ensure_built();
    const int L = lat_->L;
    const std::uint32_t gen = next_generation();
    for (int j = 0; j < L; ++j) {
      if (occ_[static_cast<std::size_t>(j)]) {
        stamp_[static_cast<std::size_t>(dsu_.find(j))] = gen;
      }
    }
    for (int j = 0; j < L; ++j) {
      const int v = (L - 1) * L + j;
      if (occ_[static_cast<std::size_t>(v)] &&
          stamp_[static_cast<std::size_t>(dsu_.find(v))] == gen) {
        return true;
      }
    }
    return false;
  }

  const Lattice& lattice() const noexcept { return *lat_; }
  Mode mode() const noexcept { return mode_; }
  const Dsu& dsu() const noexcept { return dsu_; }
  const ClusterStats& stats() const noexcept { return stats_; }
  const std::vector<std::uint8_t>& occupied() const noexcept { return occ_; }
  const std::vector<std::uint8_t>& open() const noexcept { return open_; }

 private:
  std::uint32_t next_generation() {
    if (++generation_ == 0) {
      std::fill(stamp_.begin(), stamp_.end(), 0);
      generation_ = 1;
    }
    return generation_;
  }

  const Lattice* lat_;
  Mode mode_;
  std::vector<std::uint8_t> occ_;
  std::vector<std::uint8_t> open_;
  Dsu dsu_;
  ClusterStats stats_;
  bool dirty_ = true;

  // Scratch space for analyze() and for the boundary stamps in crosses_*().
  std::vector<int> root_count_;
  std::vector<int> touched_;
  std::vector<std::uint32_t> stamp_;
  std::uint32_t generation_ = 0;
};

struct NewmanZiffResult {
  std::vector<double> p;
  std::vector<int> smax;
  std::vector<double> chi2;
  std::vector<int> nclusters;
  int m = 0;
  int n = 0;
};

// One random edge order yields the whole curve S_max(p), chi2(p),
// n_clusters(p).  Bond percolation only.
inline NewmanZiffResult newman_ziff(const Lattice& lat, Rng& rng, int checkpoints = 400) {
  if (checkpoints < 1) throw std::invalid_argument("checkpoints must be at least 1");
  const int m = lat.m;
  const int n = lat.n;
  std::vector<int> order(static_cast<std::size_t>(m));
  std::iota(order.begin(), order.end(), 0);
  rng.shuffle(order);

  Dsu dsu(n);
  long long total2 = n;  // sum of |C|^2, starts at n singletons
  const int every = std::max(1, m / checkpoints);

  NewmanZiffResult out;
  out.m = m;
  out.n = n;
  for (int k = 0; k < m; ++k) {
    const int e = order[static_cast<std::size_t>(k)];
    const int a = dsu.find(lat.eu[static_cast<std::size_t>(e)]);
    const int b = dsu.find(lat.ev[static_cast<std::size_t>(e)]);
    if (a != b) {
      const int sa = dsu.root_size(a);
      const int sb = dsu.root_size(b);
      dsu.unite(a, b);
      total2 += 2LL * sa * sb;
    }
    if ((k + 1) % every == 0 || k == m - 1) {
      out.p.push_back(static_cast<double>(k + 1) / m);
      out.smax.push_back(dsu.max_size());
      out.chi2.push_back(static_cast<double>(total2) / n);
      out.nclusters.push_back(dsu.count());
    }
  }
  return out;
}

// One random site order yields the whole site-percolation curve S_max(p),
// chi2(p), n_clusters(p).  Edges are never sampled: the site order is the only
// random object, and an edge is active exactly when both endpoints have
// appeared.  After k sites the occupied set is a uniform k-subset, hence a
// site-percolation sample at p = k/n.  chi2 is sum |C|^2 / n over the whole
// box and the cluster count counts occupied clusters only, so both match
// newman_ziff()'s conventions.
inline NewmanZiffResult newman_ziff_site(const Lattice& lat, Rng& rng, int checkpoints = 400) {
  if (checkpoints < 1) throw std::invalid_argument("checkpoints must be at least 1");
  const int n = lat.n;
  const int m = lat.m;
  std::vector<int> order(static_cast<std::size_t>(n));
  std::iota(order.begin(), order.end(), 0);
  rng.shuffle(order);

  // Symmetric CSR neighbour list, half-edges emitted in edge order exactly as
  // in the reference: for edge e list b at a and a at b.
  std::vector<int> start(static_cast<std::size_t>(n) + 1, 0);
  for (int e = 0; e < m; ++e) {
    ++start[static_cast<std::size_t>(lat.eu[static_cast<std::size_t>(e)]) + 1];
    ++start[static_cast<std::size_t>(lat.ev[static_cast<std::size_t>(e)]) + 1];
  }
  for (int v = 0; v < n; ++v) {
    start[static_cast<std::size_t>(v) + 1] += start[static_cast<std::size_t>(v)];
  }
  std::vector<int> pos(start.begin(), start.end() - 1);
  std::vector<int> adj(static_cast<std::size_t>(2) * static_cast<std::size_t>(m), 0);
  for (int e = 0; e < m; ++e) {
    const int a = lat.eu[static_cast<std::size_t>(e)];
    const int b = lat.ev[static_cast<std::size_t>(e)];
    adj[static_cast<std::size_t>(pos[static_cast<std::size_t>(a)]++)] = b;
    adj[static_cast<std::size_t>(pos[static_cast<std::size_t>(b)]++)] = a;
  }

  std::vector<std::uint8_t> active(static_cast<std::size_t>(n), 0);
  Dsu dsu(n);
  dsu.reset(0);  // empty active set: no clusters, no sites
  long long total2 = 0;  // sum of |C|^2 over the occupied clusters
  const int every = std::max(1, n / checkpoints);

  NewmanZiffResult out;
  out.m = m;
  out.n = n;
  for (int k = 0; k < n; ++k) {
    const int v = order[static_cast<std::size_t>(k)];
    active[static_cast<std::size_t>(v)] = 1;
    dsu.activate();
    total2 += 1;
    for (int j = start[static_cast<std::size_t>(v)];
         j < start[static_cast<std::size_t>(v) + 1]; ++j) {
      const int u = adj[static_cast<std::size_t>(j)];
      if (!active[static_cast<std::size_t>(u)]) continue;
      const int ra = dsu.find(v);
      const int rb = dsu.find(u);
      if (ra != rb) {
        const long long sa = dsu.root_size(ra);
        const long long sb = dsu.root_size(rb);
        dsu.unite(ra, rb);
        total2 += 2LL * sa * sb;
      }
    }
    if ((k + 1) % every == 0 || k == n - 1) {
      out.p.push_back(static_cast<double>(k + 1) / static_cast<double>(n));
      out.smax.push_back(dsu.max_size());
      out.chi2.push_back(static_cast<double>(total2) / static_cast<double>(n));
      out.nclusters.push_back(dsu.count());
    }
  }
  return out;
}

}  // namespace atlas
