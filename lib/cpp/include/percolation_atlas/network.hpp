// Network percolation: configuration model, giant components, k-core,
// targeted removal, coupled (interdependent) networks and Molloy-Reed.
// Counterpart of lib/js/engine/network.js and
// lib/python/percolation_atlas/network.py.
//
// The configuration model is a multigraph: stubs are paired uniformly at
// random and self-loops/parallel edges are kept.  That is the correct
// ensemble for Molloy-Reed asymptotics.

#pragma once

#include <algorithm>
#include <cmath>
#include <cstddef>
#include <cstdint>
#include <functional>
#include <limits>
#include <numeric>
#include <stdexcept>
#include <utility>
#include <vector>

#include "percolation_atlas/rng.hpp"

namespace atlas {

// Poisson degree sequence with an even sum (Knuth counting).  If the raw sum
// is odd, one is added to vertex 0, exactly as in the reference engines.
inline std::vector<int> poisson_degrees(int N, double mean, Rng& rng) {
  if (N < 0) throw std::invalid_argument("N must be non-negative");
  std::vector<int> deg(static_cast<std::size_t>(N), 0);
  const double limit = std::exp(-mean);
  for (int i = 0; i < N; ++i) {
    int k = 0;
    double p = 1.0;
    do {
      ++k;
      p *= rng.random();
    } while (p > limit);
    deg[static_cast<std::size_t>(i)] = k - 1;
  }
  long long sum = 0;
  for (const int d : deg) sum += d;
  if (sum % 2 != 0) ++deg[0];
  return deg;
}

// Power-law degrees with lower cutoff kmin and upper cutoff kmax:
// k = floor(kmin * (1-u)^(-1/(gamma-1))), capped at kmax.  The sum is made
// even on vertex 0.
inline std::vector<int> power_law_degrees(int N, double gamma, int kmin, int kmax, Rng& rng) {
  if (N < 0) throw std::invalid_argument("N must be non-negative");
  if (!(gamma > 1.0)) throw std::invalid_argument("gamma must be greater than 1");
  if (kmin < 0) throw std::invalid_argument("kmin must be non-negative");
  if (kmax < kmin) throw std::invalid_argument("kmax must be at least kmin");
  const double a = 1.0 / (gamma - 1.0);
  std::vector<int> deg(static_cast<std::size_t>(N), 0);
  long long sum = 0;
  for (int i = 0; i < N; ++i) {
    const double u = rng.random();
    const double kd = std::floor(kmin * std::pow(1.0 - u, -a));
    int k;
    if (!std::isfinite(kd) || kd > static_cast<double>(kmax)) {
      k = kmax;
    } else {
      k = static_cast<int>(kd);
    }
    if (k < kmin) k = kmin;
    deg[static_cast<std::size_t>(i)] = k;
    sum += k;
  }
  if (sum % 2 != 0) ++deg[0];
  return deg;
}

// Convenience overload mirroring the docs' argument order for callers that
// do not care about the cutoffs.
inline std::vector<int> power_law_degrees(int N, double gamma, Rng& rng, int kmin = 2,
                                          int kmax = 10000) {
  return power_law_degrees(N, gamma, kmin, kmax, rng);
}

// Compressed sparse row adjacency (multigraph allowed).  offset has n+1
// entries; adj has m = sum(deg) entries.
struct Graph {
  int n = 0;
  int m = 0;
  std::vector<int> offset;
  std::vector<int> adj;

  int degree(int v) const noexcept {
    return offset[static_cast<std::size_t>(v) + 1] - offset[static_cast<std::size_t>(v)];
  }
};

// Pair stubs uniformly at random and return a CSR adjacency.
inline Graph configuration_model(const std::vector<int>& deg, Rng& rng) {
  const int N = static_cast<int>(deg.size());
  long long total = 0;
  for (const int d : deg) {
    if (d < 0) throw std::invalid_argument("degrees must be non-negative");
    total += d;
  }
  if (total % 2 != 0) throw std::invalid_argument("degree sum must be even");
  if (total > std::numeric_limits<int>::max()) {
    throw std::length_error("degree sum does not fit in int");
  }
  const int M = static_cast<int>(total);

  std::vector<int> stubs(static_cast<std::size_t>(M));
  std::size_t s = 0;
  for (int i = 0; i < N; ++i) {
    for (int k = 0; k < deg[static_cast<std::size_t>(i)]; ++k) {
      stubs[s++] = i;
    }
  }
  rng.shuffle(stubs);

  std::vector<int> offset(static_cast<std::size_t>(N) + 1, 0);
  for (int k = 0; k < M; k += 2) {
    ++offset[static_cast<std::size_t>(stubs[static_cast<std::size_t>(k)] + 1)];
    ++offset[static_cast<std::size_t>(stubs[static_cast<std::size_t>(k + 1)] + 1)];
  }
  for (int i = 0; i < N; ++i) {
    offset[static_cast<std::size_t>(i) + 1] += offset[static_cast<std::size_t>(i)];
  }
  std::vector<int> fill = offset;
  std::vector<int> adj(static_cast<std::size_t>(M));
  for (int k = 0; k < M; k += 2) {
    const int a = stubs[static_cast<std::size_t>(k)];
    const int b = stubs[static_cast<std::size_t>(k + 1)];
    adj[static_cast<std::size_t>(fill[static_cast<std::size_t>(a)]++)] = b;
    adj[static_cast<std::size_t>(fill[static_cast<std::size_t>(b)]++)] = a;
  }
  return Graph{N, M, std::move(offset), std::move(adj)};
}

struct Components {
  std::vector<int> sizes;  // descending
  int largest = 0;
  int active_count = 0;
  double largest_fraction = 0.0;
  double largest_global_fraction = 0.0;
};

inline std::vector<std::uint8_t> all_active(int n) {
  if (n < 0) throw std::invalid_argument("n must be non-negative");
  return std::vector<std::uint8_t>(static_cast<std::size_t>(n), 1);
}

// Connected components of the subgraph induced by active, using a stack DFS
// like the Python reference.  (Traversal order does not affect the sizes.)
inline Components components(const Graph& graph, const std::vector<std::uint8_t>& active) {
  if (static_cast<int>(active.size()) != graph.n) {
    throw std::invalid_argument("active vector must have graph.n entries");
  }
  Components out;
  std::vector<std::uint8_t> seen(static_cast<std::size_t>(graph.n), 0);
  std::vector<int> stack;
  stack.reserve(static_cast<std::size_t>(graph.n));

  for (int v = 0; v < graph.n; ++v) {
    if (active[static_cast<std::size_t>(v)]) ++out.active_count;
  }

  for (int start = 0; start < graph.n; ++start) {
    if (!active[static_cast<std::size_t>(start)] ||
        seen[static_cast<std::size_t>(start)]) {
      continue;
    }
    seen[static_cast<std::size_t>(start)] = 1;
    stack.clear();
    stack.push_back(start);
    int size = 0;
    while (!stack.empty()) {
      const int u = stack.back();
      stack.pop_back();
      ++size;
      for (int e = graph.offset[static_cast<std::size_t>(u)];
           e < graph.offset[static_cast<std::size_t>(u) + 1]; ++e) {
        const int w = graph.adj[static_cast<std::size_t>(e)];
        if (active[static_cast<std::size_t>(w)] && !seen[static_cast<std::size_t>(w)]) {
          seen[static_cast<std::size_t>(w)] = 1;
          stack.push_back(w);
        }
      }
    }
    out.sizes.push_back(size);
    if (size > out.largest) out.largest = size;
  }
  std::sort(out.sizes.begin(), out.sizes.end(), std::greater<>());
  out.largest_fraction =
      out.active_count ? static_cast<double>(out.largest) / out.active_count : 0.0;
  out.largest_global_fraction =
      graph.n ? static_cast<double>(out.largest) / graph.n : 0.0;
  return out;
}

// Retain each vertex independently with probability p.
inline std::vector<std::uint8_t> dilute(const std::vector<std::uint8_t>& active, double p,
                                        Rng& rng) {
  std::vector<std::uint8_t> out(active.size(), 0);
  for (std::size_t i = 0; i < active.size(); ++i) {
    out[i] = (active[i] && rng.random() < p) ? 1 : 0;
  }
  return out;
}

// Remove the floor(frac*n) highest-degree vertices.  Degree is measured on
// the full graph; ties keep vertex order (stable sort), like the references.
inline std::vector<std::uint8_t> targeted_removal(const Graph& graph, double frac) {
  if (!(frac >= 0.0 && frac <= 1.0)) {
    throw std::invalid_argument("frac must be in [0, 1]");
  }
  const int n = graph.n;
  std::vector<int> order(static_cast<std::size_t>(n));
  std::iota(order.begin(), order.end(), 0);
  std::stable_sort(order.begin(), order.end(), [&graph](int a, int b) {
    return graph.degree(a) > graph.degree(b);
  });
  std::vector<std::uint8_t> active(static_cast<std::size_t>(n), 1);
  const int cut = static_cast<int>(frac * n);
  for (int i = 0; i < cut; ++i) active[static_cast<std::size_t>(order[static_cast<std::size_t>(i)])] = 0;
  return active;
}

struct KCoreResult {
  std::vector<std::uint8_t> alive;
  int size = 0;
  double fraction = 0.0;
};

// k-core of the subgraph induced by active, via bucket peeling.
inline KCoreResult kcore(const Graph& graph, const std::vector<std::uint8_t>& active, int k) {
  if (static_cast<int>(active.size()) != graph.n) {
    throw std::invalid_argument("active vector must have graph.n entries");
  }
  const int n = graph.n;
  std::vector<int> deg(static_cast<std::size_t>(n), 0);
  std::vector<std::uint8_t> alive(static_cast<std::size_t>(n), 0);
  std::vector<int> queue;
  queue.reserve(static_cast<std::size_t>(n));
  int rem = 0;
  for (int v = 0; v < n; ++v) {
    if (!active[static_cast<std::size_t>(v)]) continue;
    alive[static_cast<std::size_t>(v)] = 1;
    ++rem;
    int d = 0;
    for (int e = graph.offset[static_cast<std::size_t>(v)];
         e < graph.offset[static_cast<std::size_t>(v) + 1]; ++e) {
      if (active[static_cast<std::size_t>(graph.adj[static_cast<std::size_t>(e)])]) ++d;
    }
    deg[static_cast<std::size_t>(v)] = d;
  }
  for (int v = 0; v < n; ++v) {
    if (alive[static_cast<std::size_t>(v)] && deg[static_cast<std::size_t>(v)] < k) {
      queue.push_back(v);
    }
  }
  std::size_t head = 0;
  while (head < queue.size()) {
    const int v = queue[head++];
    if (!alive[static_cast<std::size_t>(v)]) continue;
    alive[static_cast<std::size_t>(v)] = 0;
    --rem;
    for (int e = graph.offset[static_cast<std::size_t>(v)];
         e < graph.offset[static_cast<std::size_t>(v) + 1]; ++e) {
      const int w = graph.adj[static_cast<std::size_t>(e)];
      if (alive[static_cast<std::size_t>(w)]) {
        --deg[static_cast<std::size_t>(w)];
        if (deg[static_cast<std::size_t>(w)] < k) queue.push_back(w);
      }
    }
  }
  KCoreResult out;
  out.alive = std::move(alive);
  out.size = rem;
  out.fraction = n ? static_cast<double>(rem) / n : 0.0;
  return out;
}

namespace detail {

// Keep only the vertices of the largest component of the active subgraph.
// Ties keep the first component in vertex order, matching the references.
inline void mark_giant(const Graph& graph, const std::vector<std::uint8_t>& active,
                       std::vector<std::uint8_t>& out) {
  const int n = graph.n;
  std::vector<std::uint8_t> seen(static_cast<std::size_t>(n), 0);
  std::vector<int> stack;
  std::vector<int> members;
  stack.reserve(static_cast<std::size_t>(n));
  members.reserve(static_cast<std::size_t>(n));
  std::vector<int> best;
  best.reserve(static_cast<std::size_t>(n));

  for (int start = 0; start < n; ++start) {
    if (!active[static_cast<std::size_t>(start)] ||
        seen[static_cast<std::size_t>(start)]) {
      continue;
    }
    seen[static_cast<std::size_t>(start)] = 1;
    stack.clear();
    stack.push_back(start);
    members.clear();
    while (!stack.empty()) {
      const int u = stack.back();
      stack.pop_back();
      members.push_back(u);
      for (int e = graph.offset[static_cast<std::size_t>(u)];
           e < graph.offset[static_cast<std::size_t>(u) + 1]; ++e) {
        const int w = graph.adj[static_cast<std::size_t>(e)];
        if (active[static_cast<std::size_t>(w)] && !seen[static_cast<std::size_t>(w)]) {
          seen[static_cast<std::size_t>(w)] = 1;
          stack.push_back(w);
        }
      }
    }
    if (members.size() > best.size()) best = members;
  }
  out.assign(static_cast<std::size_t>(n), 0);
  for (const int v : best) out[static_cast<std::size_t>(v)] = 1;
}

}  // namespace detail

struct CascadeStep {
  int iteration = 0;
  double a = 0.0;
  double b = 0.0;
  int alive_a = 0;
  int alive_b = 0;
};

struct InterdependentResult {
  double fraction = 0.0;
  std::vector<CascadeStep> cascade;
  Graph graph_a;
  Graph graph_b;
  std::vector<std::uint8_t> active;
};

// Fully interdependent pair of ER networks, one-to-one coupling.
//
// A vertex survives a round only if it is retained, in the giant component of
// A, and in the giant component of B.  With one-to-one coupling the layers
// share labels, so the update is the intersection of the two giant
// components.  The first edition pruned A and B independently and therefore
// retained vertices whose partner had already failed.
inline InterdependentResult interdependent_er(int N, double mean_degree, double p, Rng& rng) {
  if (N < 0) throw std::invalid_argument("N must be non-negative");
  const std::vector<int> deg_a = poisson_degrees(N, mean_degree, rng);
  const std::vector<int> deg_b = poisson_degrees(N, mean_degree, rng);
  Graph graph_a = configuration_model(deg_a, rng);
  Graph graph_b = configuration_model(deg_b, rng);

  std::vector<std::uint8_t> surviving(static_cast<std::size_t>(N), 0);
  for (int i = 0; i < N; ++i) {
    surviving[static_cast<std::size_t>(i)] = rng.random() < p ? 1 : 0;
  }

  std::vector<CascadeStep> trace;
  std::vector<std::uint8_t> giant_a(static_cast<std::size_t>(N), 0);
  std::vector<std::uint8_t> giant_b(static_cast<std::size_t>(N), 0);
  for (int it = 0; it < 1000; ++it) {
    const Components ca = components(graph_a, surviving);
    const Components cb = components(graph_b, surviving);
    trace.push_back(CascadeStep{it, ca.largest_fraction, cb.largest_fraction,
                                ca.active_count, cb.active_count});

    detail::mark_giant(graph_a, surviving, giant_a);
    detail::mark_giant(graph_b, surviving, giant_b);
    std::vector<std::uint8_t> next(static_cast<std::size_t>(N), 0);
    bool changed = false;
    for (int i = 0; i < N; ++i) {
      const std::size_t k = static_cast<std::size_t>(i);
      next[k] = (surviving[k] && giant_a[k] && giant_b[k]) ? 1 : 0;
      if (next[k] != surviving[k]) changed = true;
    }
    surviving.swap(next);
    if (!changed) break;
  }

  int alive = 0;
  for (const std::uint8_t v : surviving) alive += v;
  return InterdependentResult{N ? static_cast<double>(alive) / N : 0.0,
                              std::move(trace), std::move(graph_a), std::move(graph_b),
                              std::move(surviving)};
}

struct MolloyReed {
  double mean = 0.0;
  double second = 0.0;
  double kappa = 0.0;
  double pc = 0.0;
  double fc = 0.0;
};

// Exact Molloy-Reed threshold for a degree sequence.  pc = Inf when the
// second moment is not larger than the first.
inline MolloyReed molloy_reed(const std::vector<int>& deg) {
  if (deg.empty()) throw std::invalid_argument("degree sequence must be non-empty");
  long long s1 = 0;
  long long s2 = 0;
  for (const int d : deg) {
    if (d < 0) throw std::invalid_argument("degrees must be non-negative");
    s1 += d;
    s2 += static_cast<long long>(d) * d;
  }
  const double n = static_cast<double>(deg.size());
  const double k1 = static_cast<double>(s1) / n;
  const double k2 = static_cast<double>(s2) / n;
  const double inf = std::numeric_limits<double>::infinity();
  const double kappa = k1 > 0.0 ? k2 / k1 : inf;
  const double pc = k2 > k1 ? k1 / (k2 - k1) : inf;
  return MolloyReed{k1, k2, kappa, pc, 1.0 - pc};
}

}  // namespace atlas
