// Algorithm zoo: bootstrap, explosive (Achlioptas), invasion, Leath growth,
// Hoshen-Kopelman labelling, Bethe percolation and the configuration-model /
// SIR fixed points.
//
// This is the C++ counterpart of lib/js/engine/algorithms.js,
// lib/js/engine/trees.js, lib/python/percolation_atlas/algorithms.py and
// lib/python/percolation_atlas/trees.py.  The deterministic routines take
// explicit inputs (edge lists, neighbour lists, threshold arrays) so that the
// same configuration can be run in every language; the random wrappers use the
// shared xoshiro128** stream and consume it in exactly the reference order.
//
// RNG consumption is part of the public contract:
//   - explosive_random_graph: four next_int() draws per step, in the order
//     int(n), int(n-1), int(n), int(n-1);
//   - explosive_percolation: a Fisher-Yates shuffle of the edge indices;
//   - invasion_percolation: m uniforms, edge order 0..m-1;
//   - leath_cluster: one uniform per touched edge, in neighbour order.

#pragma once

#include <algorithm>
#include <cmath>
#include <cstddef>
#include <cstdint>
#include <functional>
#include <limits>
#include <numeric>
#include <queue>
#include <stdexcept>
#include <string>
#include <string_view>
#include <utility>
#include <vector>

#include "percolation_atlas/lattice.hpp"
#include "percolation_atlas/percolation.hpp"
#include "percolation_atlas/rng.hpp"

namespace atlas {

// Symmetric CSR neighbour list built from an undirected edge list.
//
// For vertex v the incident half-edges are
//   adj[start[v] .. start[v+1]),
// and edge_of[k] is the index of the original edge that produced half-edge k.
// degree[v] = start[v+1] - start[v].  Both endpoints of every edge are listed,
// so adj and edge_of have length 2*m.  Half-edges are emitted in edge order,
// exactly like the Python and JavaScript references.
struct Neighbours {
  std::vector<int> start;    // n + 1 offsets into adj/edge_of
  std::vector<int> adj;      // 2m neighbour vertices
  std::vector<int> edge_of;  // 2m original edge indices
  std::vector<int> degree;   // n vertex degrees
};

// Build the CSR neighbour list from an undirected edge list eu/ev.
//
// Throws std::invalid_argument if n is negative, the two endpoint arrays have
// different lengths, or an endpoint lies outside [0, n).
inline Neighbours neighbours_from_edges(int n, const std::vector<int>& eu,
                                        const std::vector<int>& ev) {
  if (n < 0) throw std::invalid_argument("neighbour count must be non-negative");
  if (eu.size() != ev.size()) {
    throw std::invalid_argument("edge endpoint arrays must have the same length");
  }
  const int m = static_cast<int>(eu.size());
  Neighbours out;
  out.degree.assign(static_cast<std::size_t>(n), 0);
  for (int e = 0; e < m; ++e) {
    const int a = eu[static_cast<std::size_t>(e)];
    const int b = ev[static_cast<std::size_t>(e)];
    if (a < 0 || a >= n || b < 0 || b >= n) {
      throw std::invalid_argument("edge endpoint outside 0..n-1");
    }
    ++out.degree[static_cast<std::size_t>(a)];
    ++out.degree[static_cast<std::size_t>(b)];
  }
  out.start.assign(static_cast<std::size_t>(n) + 1, 0);
  for (int v = 0; v < n; ++v) {
    out.start[static_cast<std::size_t>(v) + 1] =
        out.start[static_cast<std::size_t>(v)] + out.degree[static_cast<std::size_t>(v)];
  }
  std::vector<int> pos(out.start.begin(), out.start.end() - 1);
  out.adj.assign(static_cast<std::size_t>(2) * static_cast<std::size_t>(m), 0);
  out.edge_of.assign(static_cast<std::size_t>(2) * static_cast<std::size_t>(m), 0);
  for (int e = 0; e < m; ++e) {
    const int a = eu[static_cast<std::size_t>(e)];
    const int b = ev[static_cast<std::size_t>(e)];
    std::size_t slot = static_cast<std::size_t>(pos[static_cast<std::size_t>(a)]++);
    out.adj[slot] = b;
    out.edge_of[slot] = e;
    slot = static_cast<std::size_t>(pos[static_cast<std::size_t>(b)]++);
    out.adj[slot] = a;
    out.edge_of[slot] = e;
  }
  return out;
}

// One synchronous round of the bootstrap closure.
struct BootstrapRound {
  int round = 0;       // 1-based round number
  int newly = 0;       // sites that activated in this round
  int cumulative = 0;  // active sites after this round
};

// Result of bootstrap_activation().
struct BootstrapResult {
  std::vector<std::uint8_t> active;  // 1 for every site in the closure
  std::vector<int> time;             // activation round, 0 for seeds, -1 otherwise
  std::vector<BootstrapRound> rounds;
  int active_count = 0;
  double fraction = 0.0;  // active_count / n, or 0 for n = 0
  bool converged = true;
  int max_degree = 0;
};

// Synchronous r-neighbour bootstrap percolation.
//
// initial[v] != 0 marks a site active at time 0.  A site activates at round
// t+1 when at least r of its neighbours were active at round t.  The
// implementation advances the frontier one synchronous round at a time, so it
// returns the least fixed point of the monotone closure and is independent of
// tie order.  Throws std::invalid_argument when r < 1 or when the neighbour
// list is inconsistent with n; throws std::runtime_error if the frontier fails
// to empty within n rounds (which cannot happen for a valid rule).
inline BootstrapResult bootstrap_activation(int n, const Neighbours& neighbours,
                                            const std::vector<std::uint8_t>& initial,
                                            int r) {
  if (r < 1) throw std::invalid_argument("bootstrap threshold r must be a positive integer");
  if (n < 0) throw std::invalid_argument("bootstrap site count must be non-negative");
  if (neighbours.start.size() != static_cast<std::size_t>(n) + 1 ||
      neighbours.adj.size() != neighbours.edge_of.size() ||
      neighbours.degree.size() != static_cast<std::size_t>(n)) {
    throw std::invalid_argument("neighbour list does not match n");
  }
  if (initial.size() < static_cast<std::size_t>(n)) {
    throw std::invalid_argument("initial activity array is too short");
  }

  const std::size_t un = static_cast<std::size_t>(n);
  BootstrapResult out;
  out.active.assign(un, 0);
  out.time.assign(un, -1);
  out.max_degree = 0;
  for (int v = 0; v < n; ++v) {
    if (neighbours.degree[static_cast<std::size_t>(v)] > out.max_degree) {
      out.max_degree = neighbours.degree[static_cast<std::size_t>(v)];
    }
  }

  std::vector<int> count(un, 0);
  for (int v = 0; v < n; ++v) {
    if (initial[static_cast<std::size_t>(v)]) {
      out.active[static_cast<std::size_t>(v)] = 1;
      out.time[static_cast<std::size_t>(v)] = 0;
      ++out.active_count;
    }
  }
  for (int v = 0; v < n; ++v) {
    if (!out.active[static_cast<std::size_t>(v)]) continue;
    for (int k = neighbours.start[static_cast<std::size_t>(v)];
         k < neighbours.start[static_cast<std::size_t>(v) + 1]; ++k) {
      const int u = neighbours.adj[static_cast<std::size_t>(k)];
      if (!out.active[static_cast<std::size_t>(u)]) {
        ++count[static_cast<std::size_t>(u)];
      }
    }
  }

  std::vector<int> pending;
  pending.reserve(un);
  for (int v = 0; v < n; ++v) {
    if (!out.active[static_cast<std::size_t>(v)] &&
        count[static_cast<std::size_t>(v)] >= r) {
      pending.push_back(v);
    }
  }

  int t = 0;
  while (!pending.empty()) {
    ++t;
    int newly = 0;
    for (const int v : pending) {
      if (out.active[static_cast<std::size_t>(v)]) continue;
      out.active[static_cast<std::size_t>(v)] = 1;
      out.time[static_cast<std::size_t>(v)] = t;
      ++out.active_count;
      ++newly;
    }
    std::vector<int> next;
    for (const int v : pending) {
      if (out.time[static_cast<std::size_t>(v)] != t) continue;
      for (int k = neighbours.start[static_cast<std::size_t>(v)];
           k < neighbours.start[static_cast<std::size_t>(v) + 1]; ++k) {
        const int u = neighbours.adj[static_cast<std::size_t>(k)];
        if (out.active[static_cast<std::size_t>(u)]) continue;
        ++count[static_cast<std::size_t>(u)];
        if (count[static_cast<std::size_t>(u)] == r) next.push_back(u);
      }
    }
    out.rounds.push_back(BootstrapRound{t, newly, out.active_count});
    pending = std::move(next);
    if (t > n) {
      throw std::runtime_error(
          "bootstrap did not converge; threshold exceeds maximum degree?");
    }
  }
  out.fraction = n > 0 ? static_cast<double>(out.active_count) / static_cast<double>(n) : 0.0;
  return out;
}

// Parse the Achlioptas rule name.  Any other string is rejected.
inline bool valid_explosive_rule(std::string_view rule) noexcept {
  return rule == "product" || rule == "sum";
}

// The two-choice rules understood by the explosive routines.
enum class ExplosiveRule { Product, Sum };

// Convert a rule spelling to the enum, throwing on an unknown name.
inline ExplosiveRule parse_explosive_rule(std::string_view rule) {
  if (rule == "product") return ExplosiveRule::Product;
  if (rule == "sum") return ExplosiveRule::Sum;
  throw std::invalid_argument("rule must be product or sum");
}

// One step of explosive_sweep(): every two consumed candidates add one edge.
struct ExplosiveStep {
  int candidates = 0;  // candidate edges consumed so far (2 per step)
  int added = 0;       // steps completed = candidate pairs examined
  int edges = 0;       // same as added; kept for reference parity
  double smax = 0.0;   // largest component / n
  int max_size = 0;    // largest component, in sites
  int clusters = 0;    // current number of components
  double chi2 = 0.0;   // sum |C|^2 / n
  bool merged = false; // did this step merge two components?
};

// Result of explosive_sweep().
struct ExplosiveResult {
  std::vector<ExplosiveStep> steps;
  double max_jump = 0.0;
  int jump_at = 0;
  std::string rule;
  int n = 0;
  int m = 0;
  int candidates_used = 0;
};

// Achlioptas two-choice process on a fixed edge list.
//
// Pairs of candidate edges are taken from candidate_order; for the product
// rule the edge with the smaller product of endpoint-component sizes is added,
// for the sum rule the edge with the smaller size sum.  The other candidate is
// discarded.  A short trailing candidate (when the order has odd length) is
// ignored.  This is the standard two-choice process; with a uniform candidate
// order it is a reproducible finite-size version of the model of Achlioptas,
// D'Souza and Spencer (2009).
inline ExplosiveResult explosive_sweep(int n, const std::vector<int>& eu,
                                       const std::vector<int>& ev,
                                       const std::vector<int>& candidate_order,
                                       std::string_view rule = "product") {
  const ExplosiveRule parsed = parse_explosive_rule(rule);
  if (eu.size() != ev.size()) {
    throw std::invalid_argument("edge endpoint arrays must have the same length");
  }
  if (n < 0) throw std::invalid_argument("site count must be non-negative");
  const int m = static_cast<int>(eu.size());
  const int total = static_cast<int>(candidate_order.size());
  for (const int e : candidate_order) {
    if (e < 0 || e >= m) {
      throw std::invalid_argument("candidate_order contains an edge index outside 0..m-1");
    }
  }

  Dsu dsu(n);
  long long sum2 = n;  // sum of |C|^2, starting from n singletons
  ExplosiveResult out;
  out.rule = std::string(rule);
  out.n = n;
  out.m = m;
  double prev_s = n > 0 ? 1.0 / static_cast<double>(n) : 0.0;

  for (int k = 0; k + 1 < total; k += 2) {
    const int e1 = candidate_order[static_cast<std::size_t>(k)];
    const int e2 = candidate_order[static_cast<std::size_t>(k) + 1];
    const int a1 = dsu.find(eu[static_cast<std::size_t>(e1)]);
    const int b1 = dsu.find(ev[static_cast<std::size_t>(e1)]);
    const int a2 = dsu.find(eu[static_cast<std::size_t>(e2)]);
    const int b2 = dsu.find(ev[static_cast<std::size_t>(e2)]);
    const long long s1 = static_cast<long long>(dsu.root_size(a1)) * dsu.root_size(b1);
    const long long s2 = static_cast<long long>(dsu.root_size(a2)) * dsu.root_size(b2);
    int pick = 0;
    if (parsed == ExplosiveRule::Product) {
      pick = s1 <= s2 ? e1 : e2;
    } else {
      const long long sum1 = static_cast<long long>(dsu.root_size(a1)) + dsu.root_size(b1);
      const long long sum2_rule = static_cast<long long>(dsu.root_size(a2)) + dsu.root_size(b2);
      pick = sum1 <= sum2_rule ? e1 : e2;
    }
    const int ra = dsu.find(eu[static_cast<std::size_t>(pick)]);
    const int rb = dsu.find(ev[static_cast<std::size_t>(pick)]);
    const int before = dsu.max_size();
    if (ra != rb) {
      const long long sa = dsu.root_size(ra);
      const long long sb = dsu.root_size(rb);
      dsu.unite(ra, rb);
      sum2 += 2 * sa * sb;
    }
    const double smax =
        n > 0 ? static_cast<double>(dsu.max_size()) / static_cast<double>(n) : 0.0;
    if (smax - prev_s > out.max_jump) {
      out.max_jump = smax - prev_s;
      out.jump_at = (k + 2) / 2;
    }
    prev_s = smax;
    ExplosiveStep step;
    step.candidates = k + 2;
    step.added = (k + 2) / 2;
    step.edges = step.added;
    step.smax = smax;
    step.max_size = dsu.max_size();
    step.clusters = dsu.count();
    step.chi2 = n > 0 ? static_cast<double>(sum2) / static_cast<double>(n) : 0.0;
    step.merged = dsu.max_size() > before;
    out.steps.push_back(step);
  }
  out.candidates_used = (total / 2) * 2;
  return out;
}

// One recorded point of explosive_random_graph().
struct ExplosivePoint {
  int step = 0;      // steps completed (1-based)
  int added = 0;     // accepted edges (merges) so far
  double q = 0.0;    // (step) / n, the edges-per-site scale
  double smax = 0.0; // largest component / n
  int max_size = 0;
  int clusters = 0;
  double chi2 = 0.0;
};

// Result of explosive_random_graph().
struct ExplosiveGraphResult {
  std::vector<ExplosivePoint> points;
  double max_jump = 0.0;
  int jump_at = 0;
  std::string rule;
  int n = 0;
  int steps = 0;
  int added = 0;
};

// Achlioptas process on the complete graph (the setting of the 2009 paper).
//
// Each step samples two candidate pairs uniformly (with replacement) and adds
// the pair preferred by the product or sum rule.  Duplicate pairs count as
// additions but do not merge components.  Recording is done every
// record_every steps and at the final step.  steps <= 0 selects the reference
// default of 4*n steps (a non-positive count is treated as "not supplied").
// The RNG is consumed in the exact order used by the Python and JavaScript
// wrappers.
inline ExplosiveGraphResult explosive_random_graph(int n, std::string_view rule = "product",
                                                   int steps = 0, int seed = 1,
                                                   int record_every = 1) {
  const ExplosiveRule parsed = parse_explosive_rule(rule);
  if (n < 2) throw std::invalid_argument("explosive_random_graph needs n >= 2");
  if (record_every < 1) throw std::invalid_argument("record_every must be at least 1");
  const int total = steps <= 0 ? 4 * n : steps;

  Rng rng(static_cast<std::uint32_t>(seed));
  Dsu dsu(n);
  long long sum2 = n;
  ExplosiveGraphResult out;
  out.rule = std::string(rule);
  out.n = n;
  out.steps = total;
  double prev_s = 1.0 / static_cast<double>(n);
  int added = 0;

  for (int s = 0; s < total; ++s) {
    const int a1 = rng.next_int(n);
    int b1 = rng.next_int(n - 1);
    if (b1 >= a1) ++b1;
    const int a2 = rng.next_int(n);
    int b2 = rng.next_int(n - 1);
    if (b2 >= a2) ++b2;

    const int ra1 = dsu.find(a1);
    const int rb1 = dsu.find(b1);
    const int ra2 = dsu.find(a2);
    const int rb2 = dsu.find(b2);
    const long long s1 = static_cast<long long>(dsu.root_size(ra1)) * dsu.root_size(rb1);
    const long long s2 = static_cast<long long>(dsu.root_size(ra2)) * dsu.root_size(rb2);
    bool pick_first = false;
    if (parsed == ExplosiveRule::Product) {
      pick_first = s1 <= s2;
    } else {
      pick_first = static_cast<long long>(dsu.root_size(ra1)) + dsu.root_size(rb1) <=
                   static_cast<long long>(dsu.root_size(ra2)) + dsu.root_size(rb2);
    }
    const int a = pick_first ? a1 : a2;
    const int b = pick_first ? b1 : b2;
    const int ra = dsu.find(a);
    const int rb = dsu.find(b);
    if (ra != rb) {
      const long long sa = dsu.root_size(ra);
      const long long sb = dsu.root_size(rb);
      dsu.unite(ra, rb);
      sum2 += 2 * sa * sb;
      ++added;
    }
    const double smax = static_cast<double>(dsu.max_size()) / static_cast<double>(n);
    if (smax - prev_s > out.max_jump) {
      out.max_jump = smax - prev_s;
      out.jump_at = s + 1;
    }
    prev_s = smax;
    if (s % record_every == 0 || s == total - 1) {
      ExplosivePoint point;
      point.step = s + 1;
      point.added = added;
      point.q = static_cast<double>(s + 1) / static_cast<double>(n);
      point.smax = smax;
      point.max_size = dsu.max_size();
      point.clusters = dsu.count();
      point.chi2 = static_cast<double>(sum2) / static_cast<double>(n);
      out.points.push_back(point);
    }
  }
  out.added = added;
  return out;
}

// Random-stream wrapper for the fixed-edge-list process: shuffle the edge
// indices with the shared xoshiro128** stream, then run explosive_sweep().
inline ExplosiveResult explosive_percolation(int n, const std::vector<int>& eu,
                                             const std::vector<int>& ev,
                                             std::string_view rule = "product",
                                             int seed = 1) {
  Rng rng(static_cast<std::uint32_t>(seed));
  std::vector<int> order(eu.size());
  std::iota(order.begin(), order.end(), 0);
  rng.shuffle(order);
  return explosive_sweep(n, eu, ev, order, rule);
}

// Result of invasion_cluster() / invasion_percolation().
//
// order        : invasion order, starting with the seed;
// thresholds   : threshold of each accepted edge (nondecreasing), length size-1;
// accepted     : 1 for the accepted spanning-tree edges;
// visited      : 1 for invaded sites;
// loop_edges   : rejected loop-closing edges, each recorded once;
// threshold    : full threshold array (filled by invasion_percolation, empty
//                in a direct invasion_cluster call, like the reference's
//                optional field).
struct InvasionResult {
  std::vector<int> order;
  std::vector<double> thresholds;
  std::vector<std::uint8_t> accepted;
  std::vector<std::uint8_t> visited;
  int size = 0;
  int loops = 0;
  std::vector<int> loop_edges;
  double last_threshold = 0.0;
  std::vector<double> threshold;
};

// Invasion percolation with loop rejection.
//
// Every edge carries an i.i.d. threshold.  Starting from seed, repeatedly
// accept the lowest-threshold boundary edge that leads to an unvisited site;
// an edge whose two endpoints are already visited closes a loop and is
// discarded, counted once no matter how often it is popped.  This is Prim's
// algorithm on the random edge weights: the accepted edges form a spanning
// tree of the invaded cluster and the accepted thresholds are nondecreasing.
// It is ordinary invasion percolation, not the trapping variant used for
// defending clusters.
inline InvasionResult invasion_cluster(int n, const std::vector<int>& eu,
                                       const std::vector<int>& ev,
                                       const std::vector<double>& threshold,
                                       int seed = 0) {
  if (n < 0) throw std::invalid_argument("site count must be non-negative");
  if (eu.size() != ev.size()) {
    throw std::invalid_argument("edge endpoint arrays must have the same length");
  }
  if (threshold.size() < eu.size()) {
    throw std::invalid_argument("threshold array is shorter than the edge list");
  }
  if (seed < 0 || seed >= n) throw std::invalid_argument("invasion seed must be a site index");

  const int m = static_cast<int>(eu.size());
  const Neighbours neighbours = neighbours_from_edges(n, eu, ev);
  InvasionResult out;
  out.accepted.assign(static_cast<std::size_t>(m), 0);
  out.visited.assign(static_cast<std::size_t>(n), 0);
  out.order.push_back(seed);
  out.visited[static_cast<std::size_t>(seed)] = 1;

  // (key, edge) ordering matches Python's heapq tuples, so ties are broken by
  // the edge index deterministically in both languages.
  using HeapItem = std::pair<double, int>;
  std::priority_queue<HeapItem, std::vector<HeapItem>, std::greater<HeapItem>> heap;
  for (int k = neighbours.start[static_cast<std::size_t>(seed)];
       k < neighbours.start[static_cast<std::size_t>(seed) + 1]; ++k) {
    const int e = neighbours.edge_of[static_cast<std::size_t>(k)];
    heap.push(HeapItem{threshold[static_cast<std::size_t>(e)], e});
  }

  std::vector<std::uint8_t> loop_seen(static_cast<std::size_t>(m), 0);
  while (!heap.empty()) {
    const HeapItem item = heap.top();
    heap.pop();
    const double key = item.first;
    const int edge = item.second;
    const int a = eu[static_cast<std::size_t>(edge)];
    const int b = ev[static_cast<std::size_t>(edge)];
    const int u = out.visited[static_cast<std::size_t>(a)] ? b : a;
    if (out.visited[static_cast<std::size_t>(u)]) {
      if (!loop_seen[static_cast<std::size_t>(edge)]) {
        loop_seen[static_cast<std::size_t>(edge)] = 1;
        ++out.loops;
        out.loop_edges.push_back(edge);
      }
      continue;
    }
    out.visited[static_cast<std::size_t>(u)] = 1;
    out.accepted[static_cast<std::size_t>(edge)] = 1;
    out.order.push_back(u);
    out.thresholds.push_back(key);
    for (int k = neighbours.start[static_cast<std::size_t>(u)];
         k < neighbours.start[static_cast<std::size_t>(u) + 1]; ++k) {
      const int e = neighbours.edge_of[static_cast<std::size_t>(k)];
      if (!out.accepted[static_cast<std::size_t>(e)]) {
        heap.push(HeapItem{threshold[static_cast<std::size_t>(e)], e});
      }
    }
  }
  out.size = static_cast<int>(out.order.size());
  out.last_threshold = out.thresholds.empty() ? 0.0 : out.thresholds.back();
  return out;
}

// Random-stream wrapper for invasion percolation: draw m uniform thresholds in
// edge order, run invasion_cluster(), and expose the drawn thresholds.
inline InvasionResult invasion_percolation(int n, const std::vector<int>& eu,
                                           const std::vector<int>& ev, int seed = 1,
                                           int rng_seed = 1) {
  Rng rng(static_cast<std::uint32_t>(rng_seed));
  std::vector<double> threshold(eu.size());
  for (std::size_t e = 0; e < threshold.size(); ++e) threshold[e] = rng.random();
  InvasionResult out = invasion_cluster(n, eu, ev, threshold, seed);
  out.threshold = std::move(threshold);
  return out;
}

// Result of leath_cluster().
struct LeathResult {
  std::vector<int> sites;  // invaded sites in BFS discovery order
  int size = 0;            // number of sites
  int open_edges = 0;      // tested open edges (including redundant ones)
  int perimeter = 0;       // tested closed edges
  bool truncated = false;  // did the cluster exceed max_size?
};

// Leath growth: sample the cluster of seed in bond percolation at p.
//
// Each touched edge is tested exactly once with one uniform draw; an open edge
// to an unvisited site is explored.  Conditional on the seed being occupied
// the output is a sample from the percolation cluster distribution.  The cost
// is proportional to the touched boundary, not to the volume of the box.
// max_size is the largest number of sites that may be queued before growth
// stops; truncated reports whether the queue grew past that bound.
inline LeathResult leath_cluster(const Lattice& lattice, int seed, double p, Rng& rng,
                                 int max_size = std::numeric_limits<int>::max()) {
  if (seed < 0 || seed >= lattice.n) {
    throw std::invalid_argument("Leath seed must be a site index");
  }
  const int n = lattice.n;
  const int m = lattice.m;
  const Neighbours neighbours = neighbours_from_edges(n, lattice.eu, lattice.ev);
  std::vector<std::uint8_t> visited(static_cast<std::size_t>(n), 0);
  std::vector<std::uint8_t> tested(static_cast<std::size_t>(m), 0);
  LeathResult out;
  out.sites.push_back(seed);
  visited[static_cast<std::size_t>(seed)] = 1;
  std::size_t head = 0;
  while (head < out.sites.size() && out.sites.size() <= static_cast<std::size_t>(max_size)) {
    const int v = out.sites[head++];
    for (int k = neighbours.start[static_cast<std::size_t>(v)];
         k < neighbours.start[static_cast<std::size_t>(v) + 1]; ++k) {
      const int e = neighbours.edge_of[static_cast<std::size_t>(k)];
      if (tested[static_cast<std::size_t>(e)]) continue;
      tested[static_cast<std::size_t>(e)] = 1;
      if (rng.random() < p) {
        ++out.open_edges;
        const int u = neighbours.adj[static_cast<std::size_t>(k)];
        if (!visited[static_cast<std::size_t>(u)]) {
          visited[static_cast<std::size_t>(u)] = 1;
          out.sites.push_back(u);
        }
      } else {
        ++out.perimeter;
      }
    }
  }
  out.size = static_cast<int>(out.sites.size());
  out.truncated = out.sites.size() > static_cast<std::size_t>(max_size);
  return out;
}

// Result of label_clusters().
//
// labels   : root vertex of each present site, -1 for an inactive site;
// sizes    : size of the cluster rooted at each vertex (0 for non-roots);
// count    : number of present clusters;
// max_size : largest cluster size;
// max_label: largest root label, or -1 when no site is present.
struct LabelResult {
  std::vector<int> labels;
  std::vector<int> sizes;
  int count = 0;
  int max_size = 0;
  int max_label = -1;
};

// Label the connected components of open edges in scan order.
//
// This is the graph form of Hoshen-Kopelman labelling: edges are visited once
// in their given order, an equivalence table (the DSU) is maintained, and the
// labels are compressed in one final pass.  With active supplied the routine
// labels site percolation (an edge counts only when both endpoints are
// active); without it every vertex is present and only open_edges matters.
// Inactive vertices get label -1.  The cost is O((n + m) alpha(n)) time and
// O(n) memory.  Both optional arrays, when supplied, must cover the graph.
inline LabelResult label_clusters(int n, const std::vector<int>& eu,
                                  const std::vector<int>& ev,
                                  const std::vector<std::uint8_t>* open_edges = nullptr,
                                  const std::vector<std::uint8_t>* active = nullptr) {
  if (n < 0) throw std::invalid_argument("site count must be non-negative");
  if (eu.size() != ev.size()) {
    throw std::invalid_argument("edge endpoint arrays must have the same length");
  }
  if (open_edges != nullptr && open_edges->size() < eu.size()) {
    throw std::invalid_argument("open_edges array is shorter than the edge list");
  }
  if (active != nullptr && active->size() < static_cast<std::size_t>(n)) {
    throw std::invalid_argument("active array is shorter than n");
  }

  std::vector<std::uint8_t> present(static_cast<std::size_t>(n), 1);
  int present_count = n;
  if (active != nullptr) {
    present_count = 0;
    for (int v = 0; v < n; ++v) {
      present[static_cast<std::size_t>(v)] = (*active)[static_cast<std::size_t>(v)] ? 1 : 0;
      present_count += present[static_cast<std::size_t>(v)];
    }
  }

  Dsu dsu(n);
  dsu.reset(present_count);
  for (std::size_t e = 0; e < eu.size(); ++e) {
    if (open_edges != nullptr && !(*open_edges)[e]) continue;
    const int a = eu[e];
    const int b = ev[e];
    if (present[static_cast<std::size_t>(a)] && present[static_cast<std::size_t>(b)]) {
      dsu.unite(a, b);
    }
  }

  LabelResult out;
  out.labels.assign(static_cast<std::size_t>(n), -1);
  out.sizes.assign(static_cast<std::size_t>(n), 0);
  for (int v = 0; v < n; ++v) {
    if (!present[static_cast<std::size_t>(v)]) continue;
    const int r = dsu.find(v);
    out.labels[static_cast<std::size_t>(v)] = r;
    ++out.sizes[static_cast<std::size_t>(r)];
    if (r > out.max_label) out.max_label = r;
  }
  for (int v = 0; v < n; ++v) {
    const int s = out.sizes[static_cast<std::size_t>(v)];
    if (s > 0) {
      ++out.count;
      if (s > out.max_size) out.max_size = s;
    }
  }
  return out;
}

namespace detail {

// Neumaier compensated summation.  Python's built-in sum() uses the same
// algorithm for floats, so using it here keeps the fixed-point maps in exact
// step with the Python reference even at the critical point, where the
// leading cancellation makes naive summation's last bits visible.
class NeumaierSum {
 public:
  void add(double value) {
    const double total = sum_ + value;
    if (std::abs(sum_) >= std::abs(value)) {
      correction_ += (sum_ - total) + value;
    } else {
      correction_ += (value - total) + sum_;
    }
    sum_ = total;
  }
  double value() const noexcept { return sum_ + correction_; }

 private:
  double sum_ = 0.0;
  double correction_ = 0.0;
};

// Smallest u in [0, 1] with g(u) = u, assuming g is increasing, g(0) >= 0 and
// g(1) = 1.  Bisection on the first sign change selects the physical root:
// when g(u) - u > 0 near 0 there is a nontrivial crossing at u < 1; when the
// inequality never holds the routine returns 1, the trivial fixed point.
// This is exactly the reference _first_root() in trees.py/trees.js.
template <typename Function>
inline double first_root(Function&& g, double tol = 1e-13, int iterations = 200) {
  double lo = 0.0;
  double hi = 1.0;
  for (int i = 0; i < iterations; ++i) {
    const double mid = 0.5 * (lo + hi);
    if (g(mid) - mid > 0.0) {
      lo = mid;
    } else {
      hi = mid;
    }
    if (hi - lo < tol) break;
  }
  return hi;
}

// Normalise a degree probability mass function, throwing on invalid input.
inline std::vector<double> normalise_pmf(const std::vector<double>& pmf) {
  if (pmf.empty()) throw std::invalid_argument("degree distribution must not be empty");
  std::vector<double> out = pmf;
  NeumaierSum total;
  for (const double x : out) {
    if (!(x >= 0.0) || !std::isfinite(x)) {
      throw std::invalid_argument("degree probabilities must be finite and non-negative");
    }
    total.add(x);
  }
  if (!(total.value() > 0.0)) {
    throw std::invalid_argument("degree probabilities must have positive sum");
  }
  for (double& x : out) x /= total.value();
  return out;
}

}  // namespace detail

// Result of message_passing_percolation().
//
// S          : estimated giant-component fraction, 1 - mean(outside);
// outside    : probability that each vertex is outside the giant component;
// iterations : number of sweeps performed;
// converged  : did max_change fall below tol within max_iter sweeps?
// max_change : largest message change in the last sweep.
struct MessagePassingResult {
  double S = 0.0;
  std::vector<double> outside;
  int iterations = 0;
  bool converged = false;
  double max_change = 0.0;
};

// Cavity message passing for bond percolation on a fixed graph.
//
// msg[k] is the message into vertex v from adj[k]:
//
//   msg[k] = prod_{j in N(v), j != adj[k]} (1 - T + T msg[j])
//
// The message v sends to adj[k] is stored at the opposite half-edge mate[k].
// Each vertex uses a prefix/suffix product, so one sweep costs O(n + m).  The
// iteration starts from zero, which selects the physical (smallest) fixed
// point; starting from one would stay at the trivial no-giant-component
// solution.  On a tree the equations are exact; on a graph with cycles they
// are the Bethe approximation.
inline MessagePassingResult message_passing_percolation(int n, const std::vector<int>& eu,
                                                         const std::vector<int>& ev, double T,
                                                         int max_iter = 10000,
                                                         double tol = 1e-12) {
  if (n < 0) throw std::invalid_argument("n must be non-negative");
  if (!(T >= 0.0 && T <= 1.0)) throw std::invalid_argument("T must lie in [0,1]");
  if (max_iter < 1) throw std::invalid_argument("max_iter must be positive");

  const Neighbours neighbours = neighbours_from_edges(n, eu, ev);
  const int m = static_cast<int>(eu.size());
  const std::size_t halves = static_cast<std::size_t>(2) * static_cast<std::size_t>(m);

  // Pair up the two half-edges of every edge.  The CSR emits both endpoints in
  // edge order, so the first occurrence of each edge index is its first half.
  std::vector<int> mate(halves, 0);
  std::vector<int> first(static_cast<std::size_t>(m), -1);
  for (std::size_t k = 0; k < halves; ++k) {
    const int e = neighbours.edge_of[k];
    if (first[static_cast<std::size_t>(e)] < 0) {
      first[static_cast<std::size_t>(e)] = static_cast<int>(k);
    } else {
      const std::size_t other = static_cast<std::size_t>(first[static_cast<std::size_t>(e)]);
      mate[other] = static_cast<int>(k);
      mate[k] = static_cast<int>(other);
    }
  }

  int max_degree = 0;
  for (int v = 0; v < n; ++v) {
    if (neighbours.degree[static_cast<std::size_t>(v)] > max_degree) {
      max_degree = neighbours.degree[static_cast<std::size_t>(v)];
    }
  }
  std::vector<double> prefix(static_cast<std::size_t>(max_degree) + 1, 1.0);
  std::vector<double> suffix(static_cast<std::size_t>(max_degree) + 1, 1.0);
  std::vector<double> msg(halves, 0.0);
  std::vector<double> next(halves, 0.0);

  bool converged = false;
  int iterations = 0;
  double max_change = 0.0;
  for (iterations = 1; iterations <= max_iter; ++iterations) {
    max_change = 0.0;
    for (int v = 0; v < n; ++v) {
      const int lo = neighbours.start[static_cast<std::size_t>(v)];
      const int hi = neighbours.start[static_cast<std::size_t>(v) + 1];
      const int d = hi - lo;
      if (d == 0) continue;
      prefix[0] = 1.0;
      for (int i = 0; i < d; ++i) {
        prefix[static_cast<std::size_t>(i) + 1] =
            prefix[static_cast<std::size_t>(i)] *
            (1.0 - T + T * msg[static_cast<std::size_t>(lo + i)]);
      }
      suffix[static_cast<std::size_t>(d)] = 1.0;
      for (int i = d - 1; i >= 0; --i) {
        suffix[static_cast<std::size_t>(i)] =
            suffix[static_cast<std::size_t>(i) + 1] *
            (1.0 - T + T * msg[static_cast<std::size_t>(lo + i)]);
      }
      for (int i = 0; i < d; ++i) {
        const std::size_t slot = static_cast<std::size_t>(mate[static_cast<std::size_t>(lo + i)]);
        const double value = prefix[static_cast<std::size_t>(i)] *
                             suffix[static_cast<std::size_t>(i) + 1];
        next[slot] = value;
        const double diff = std::abs(value - msg[slot]);
        if (diff > max_change) max_change = diff;
      }
    }
    msg.swap(next);
    if (max_change < tol) {
      converged = true;
      break;
    }
  }

  MessagePassingResult out;
  out.outside.assign(static_cast<std::size_t>(n), 1.0);
  detail::NeumaierSum total;
  for (int v = 0; v < n; ++v) {
    double prod = 1.0;
    for (int k = neighbours.start[static_cast<std::size_t>(v)];
         k < neighbours.start[static_cast<std::size_t>(v) + 1]; ++k) {
      prod *= 1.0 - T + T * msg[static_cast<std::size_t>(k)];
    }
    out.outside[static_cast<std::size_t>(v)] = prod;
    total.add(prod);
  }
  if (n > 0) {
    const double S = 1.0 - total.value() / static_cast<double>(n);
    out.S = std::min(1.0, std::max(0.0, S));
  }
  out.iterations = iterations;
  out.converged = converged;
  out.max_change = max_change;
  return out;
}

// Result of bethe_percolation().
struct BetheResult {
  int z = 0;
  double p = 0.0;
  double pc = 0.0;
  double theta = 0.0;  // percolation probability (order parameter)
  double u = 1.0;      // probability that a branch is finite
  double chi = 1.0;    // mean cluster size; infinite at and above pc
  bool supercritical = false;
};

// Bond (and site) threshold of the z-regular tree, 1/(z-1).
//
// Throws std::invalid_argument unless z is an integer >= 2.
inline double bethe_threshold(int z) {
  if (z < 2) throw std::invalid_argument("the Bethe lattice needs an integer degree z >= 2");
  return 1.0 / static_cast<double>(z - 1);
}

// Percolation on the z-regular Bethe lattice.
//
// Returns the percolation probability theta, the finite-branch probability u
// and the subcritical mean cluster size chi.  Above and at p_c the mean cluster
// size including the infinite cluster diverges, so chi is reported as
// +infinity there.  The physical fixed point is selected by bisection on the
// first sign change, matching the Python and JavaScript references exactly.
inline BetheResult bethe_percolation(int z, double p) {
  if (z < 2) throw std::invalid_argument("the Bethe lattice needs an integer degree z >= 2");
  if (!(p >= 0.0 && p <= 1.0)) throw std::invalid_argument("p must lie in [0,1]");

  BetheResult out;
  out.z = z;
  out.p = p;
  out.pc = bethe_threshold(z);
  if (p >= 1.0) {
    // The fully open tree has no finite branch.  For z = 2 this is also the
    // threshold, so the p <= pc shortcut below must not swallow it.
    out.theta = 1.0;
    out.u = 0.0;
    out.chi = std::numeric_limits<double>::infinity();
    out.supercritical = true;
    return out;
  }
  if (p <= out.pc) {
    out.theta = 0.0;
    out.u = 1.0;
    out.chi = p >= out.pc
                  ? std::numeric_limits<double>::infinity()
                  : 1.0 + static_cast<double>(z) * p / (1.0 - p * static_cast<double>(z - 1));
    out.supercritical = false;
    return out;
  }

  const int k = z - 1;
  const double q = 1.0 - p;
  out.u = detail::first_root([p, q, k](double x) { return std::pow(q + p * x, k); });
  const double branch = q + p * out.u;
  out.theta = 1.0 - std::pow(branch, z);
  if (out.theta < 0.0) out.theta = 0.0;
  out.chi = std::numeric_limits<double>::infinity();
  out.supercritical = true;
  return out;
}

// Truncated Poisson degree distribution, normalised to sum to one.
//
// The default truncation is the reference one:
//   kmax = floor(c + 12*sqrt(c + 1) + 30).
// A non-negative explicit kmax overrides it; negative values select the
// default.  Throws for a negative, NaN or infinite mean.
inline std::vector<double> poisson_pmf(double c, int kmax = -1) {
  if (!(c >= 0.0) || !std::isfinite(c)) {
    throw std::invalid_argument("Poisson mean must be finite and non-negative");
  }
  int k_max = kmax;
  if (k_max < 0) {
    const double raw = c + 12.0 * std::sqrt(c + 1.0) + 30.0;
    if (raw > static_cast<double>(std::numeric_limits<int>::max())) {
      throw std::invalid_argument("Poisson truncation is too large");
    }
    k_max = static_cast<int>(raw);
  }
  std::vector<double> out;
  out.reserve(static_cast<std::size_t>(k_max) + 1);
  double term = std::exp(-c);
  for (int k = 0; k <= k_max; ++k) {
    out.push_back(term);
    term *= c / static_cast<double>(k + 1);
  }
  detail::NeumaierSum total;
  for (const double x : out) total.add(x);
  const double normaliser = total.value();
  for (double& x : out) x /= normaliser;
  return out;
}

// Result of configuration_giant_component().
struct GiantComponentResult {
  double T = 1.0;
  double S = 0.0;           // giant-component fraction
  double u = 1.0;           // finite-branch probability
  double kappa = 1.0;       // branching factor <k^2>/<k>
  double tc = std::numeric_limits<double>::infinity();
  double mean_degree = 0.0;
  double r0 = 0.0;          // T (kappa - 1)
};

// Giant-component fraction of the configuration model after bond dilution.
//
// pmf[k] is the probability of degree k and T the probability that an edge is
// retained.  The equations are (22.8)-(22.10):
//
//   u = G1(1 - T + T u),   S = 1 - G0(1 - T + T u),
//
// with G0 the degree generating function and G1 its size-biased counterpart.
// The branch u is the smallest fixed point of the map, found by bisection on
// the first sign change (so the trivial root u = 1 is not selected when a
// nontrivial giant component exists).
inline GiantComponentResult configuration_giant_component(const std::vector<double>& pmf,
                                                          double T = 1.0) {
  if (!(T >= 0.0 && T <= 1.0)) throw std::invalid_argument("T must lie in [0,1]");
  const std::vector<double> p = detail::normalise_pmf(pmf);

  detail::NeumaierSum mean_sum;
  detail::NeumaierSum second_sum;
  for (std::size_t k = 0; k < p.size(); ++k) {
    const double kd = static_cast<double>(k);
    mean_sum.add(kd * p[k]);
    second_sum.add(kd * (kd - 1.0) * p[k]);
  }
  const double mean = mean_sum.value();
  const double second = second_sum.value();

  GiantComponentResult out;
  out.T = T;
  if (!(mean > 0.0)) {
    out.S = 0.0;
    out.u = 1.0;
    out.kappa = 1.0;
    out.tc = std::numeric_limits<double>::infinity();
    out.mean_degree = 0.0;
    out.r0 = 0.0;
    return out;
  }
  out.kappa = 1.0 + second / mean;
  out.tc = out.kappa > 1.0 ? 1.0 / (out.kappa - 1.0)
                           : std::numeric_limits<double>::infinity();
  out.mean_degree = mean;

  const auto g0 = [&p](double x) {
    detail::NeumaierSum s;
    for (std::size_t k = 0; k < p.size(); ++k) {
      s.add(p[k] * std::pow(x, static_cast<double>(k)));
    }
    return s.value();
  };
  const auto g1 = [&p, mean](double x) {
    detail::NeumaierSum s;
    for (std::size_t k = 1; k < p.size(); ++k) {
      s.add((static_cast<double>(k) * p[k] / mean) *
            std::pow(x, static_cast<double>(k - 1)));
    }
    return s.value();
  };

  out.u = detail::first_root([&g1, T](double x) { return g1(1.0 - T + T * x); });
  double S = 1.0 - g0(1.0 - T + T * out.u);
  S = std::min(1.0, std::max(0.0, S));
  out.S = S;
  out.r0 = T * (out.kappa - 1.0);
  return out;
}

// Result of sir_final_size().
struct SirResult {
  double T = 0.0;
  double final_size = 0.0;
  double r0 = 0.0;
  double kappa = 1.0;
  double tc = std::numeric_limits<double>::infinity();
  double herd_immunity = 0.0;
};

// Final fraction of an SIR epidemic mapped to bond percolation.
//
// T is the per-edge transmissibility.  The final size equals the giant
// component of the configuration model with retention T, and R0 is
// T (<k^2> - <k>) / <k> by (23.3).  Herd immunity is 1 - 1/R0 above the
// epidemic threshold and 0 otherwise.
inline SirResult sir_final_size(const std::vector<double>& pmf, double T) {
  const GiantComponentResult g = configuration_giant_component(pmf, T);
  SirResult out;
  out.T = T;
  out.final_size = g.S;
  out.r0 = g.r0;
  out.kappa = g.kappa;
  out.tc = g.tc;
  out.herd_immunity = out.r0 > 1.0 ? 1.0 - 1.0 / out.r0 : 0.0;
  return out;
}

}  // namespace atlas
