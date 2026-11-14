// Self-contained test suite for the C++ edition (no gtest / catch2).
//
// The golden values are copied from data/golden/rng-seed42.json and
// data/golden/parity.json so this binary also runs outside the repository
// checkout.  Exit status is 1 if any test fails.

#include <percolation_atlas/atlas.hpp>

#include <algorithm>
#include <cmath>
#include <cstdint>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <stdexcept>
#include <string>
#include <utility>
#include <vector>

namespace atlas_test {

[[noreturn]] void report_failure(int line, const std::string& message) {
  throw std::runtime_error("line " + std::to_string(line) + ": " + message);
}

void check_bool(bool condition, const char* expression, int line) {
  if (!condition) report_failure(line, std::string("check failed: ") + expression);
}

void check_int(long long got, long long want, const char* what, int line) {
  if (got != want) {
    std::ostringstream os;
    os << what << ": got " << got << ", want " << want;
    report_failure(line, os.str());
  }
}

void check_double(double got, double want, double tolerance, const char* what, int line) {
  const double diff = std::abs(got - want);
  if (!(diff <= tolerance)) {
    std::ostringstream os;
    os << std::setprecision(17) << what << ": got " << got << ", want " << want
       << " (|diff|=" << diff << " > " << tolerance << ")";
    report_failure(line, os.str());
  }
}

void check_range(double value, double lo, double hi, const char* what, int line) {
  if (!(value >= lo && value <= hi)) {
    std::ostringstream os;
    os << std::setprecision(17) << what << " = " << value << " is outside [" << lo << ", "
       << hi << "]";
    report_failure(line, os.str());
  }
}

}  // namespace atlas_test

#define CHECK(cond) ::atlas_test::check_bool((cond), #cond, __LINE__)
#define CHECK_INT(got, want) \
  ::atlas_test::check_int(static_cast<long long>(got), static_cast<long long>(want), #got, __LINE__)
#define CHECK_CLOSE(got, want, tol) \
  ::atlas_test::check_double((got), (want), (tol), #got, __LINE__)
#define CHECK_RANGE(value, lo, hi) \
  ::atlas_test::check_range((value), (lo), (hi), #value, __LINE__)

namespace {

using atlas::Mode;

void test_rng() {
  // data/golden/rng-seed42.json
  const double expected_doubles[8] = {
      0.15377165154351735, 0.018084544121180213, 0.5348906350361368, 0.7272476917564136,
      0.572911021218635,   0.2877089619804075,   0.8504471575585412, 0.30334379811845724};
  const int expected_ints[8] = {1, 2, 6, 3, 6, 7, 4, 6};

  atlas::Rng rng(42);
  for (int i = 0; i < 8; ++i) {
    CHECK_CLOSE(rng.random(), expected_doubles[i], 0.0);
  }

  atlas::Rng int_rng(42);
  for (int i = 0; i < 8; ++i) {
    CHECK_INT(int_rng.next_int(10), expected_ints[i]);
  }

  atlas::Rng stream(42);
  std::uint32_t sum = 0;
  std::uint32_t hash = 2166136261u;
  for (int i = 0; i < 10000; ++i) {
    const std::uint32_t v = stream.u32();
    sum += v;
    hash = (hash ^ v) * 16777619u;
  }
  CHECK_INT(sum, 839333524u);
  CHECK_INT(hash, 3108118429u);

  // Normal draws use the polar Box-Muller path with a cached spare.
  const double expected_normals[6] = {
      0.26752688913325207, 1.7424408577069266, 0.5813902729075202,
      -1.6928023015879279, 0.8153199416965593, -0.4575232516347127};
  atlas::Rng normal_rng(42);
  for (int i = 0; i < 6; ++i) {
    CHECK_CLOSE(normal_rng.normal(), expected_normals[i], 0.0);
  }

  // Fisher-Yates must stay a permutation (the exact order is covered by the
  // parity probes, which depend on it).
  atlas::Rng shuffle_rng(11);
  std::vector<int> values(100);
  for (int i = 0; i < 100; ++i) values[static_cast<std::size_t>(i)] = i;
  shuffle_rng.shuffle(values);
  bool changed = false;
  for (int i = 0; i < 100; ++i) {
    if (values[static_cast<std::size_t>(i)] != i) changed = true;
  }
  CHECK(changed);
  std::vector<int> sorted = values;
  std::sort(sorted.begin(), sorted.end());
  for (int i = 0; i < 100; ++i) {
    CHECK_INT(sorted[static_cast<std::size_t>(i)], i);
  }
}

void test_parity() {
  // square_bond_cross_500_seed1234 -> 244
  {
    const atlas::Lattice lat = atlas::build_lattice("square", 32);
    atlas::Percolation model(lat, Mode::Bond);
    atlas::Rng rng(1234);
    int hits = 0;
    for (int s = 0; s < 500; ++s) {
      model.sample(0.5, rng);
      if (model.crosses_lr()) ++hits;
    }
    CHECK_INT(hits, 244);
  }

  // tri_site_cross_300_seed777 -> 151
  {
    const atlas::Lattice lat = atlas::build_lattice("triangular", 16);
    atlas::Percolation model(lat, Mode::Site);
    atlas::Rng rng(777);
    int hits = 0;
    for (int s = 0; s < 300; ++s) {
      model.sample(0.5, rng);
      if (model.crosses_lr()) ++hits;
    }
    CHECK_INT(hits, 151);
  }

  // nz_smax_q1_q2_end_seed5 -> [10, 109, 256]
  {
    const atlas::Lattice lat = atlas::build_lattice("square", 16);
    atlas::Rng rng(5);
    const atlas::NewmanZiffResult nz = atlas::newman_ziff(lat, rng, 64);
    const std::size_t len = nz.smax.size();
    CHECK_INT(len, 69);
    CHECK_INT(nz.smax[len / 4], 10);
    CHECK_INT(nz.smax[len / 2], 109);
    CHECK_INT(nz.smax[len - 1], 256);
  }

  // configmodel_largest_seed9 -> 1883
  {
    atlas::Rng rng(9);
    const std::vector<int> deg = atlas::poisson_degrees(2000, 3.0, rng);
    const atlas::Graph graph = atlas::configuration_model(deg, rng);
    const atlas::Components comp = atlas::components(graph, atlas::all_active(2000));
    CHECK_INT(comp.largest, 1883);
  }

  // interdependent_fraction_seed11 -> 0.5306666666666666 (exact, tolerance 0.0)
  {
    atlas::Rng rng(11);
    const atlas::InterdependentResult result =
        atlas::interdependent_er(1500, 3.5, 0.75, rng);
    CHECK_CLOSE(result.fraction, 0.5306666666666666, 0.0);
  }
}

void test_directed() {
  const atlas::Lattice lat = atlas::build_lattice("square", 32);
  {
    atlas::Rng rng(4242);
    int hits = 0;
    for (int s = 0; s < 500; ++s) {
      if (atlas::directed_crossing(lat, 0.65, rng, false).cross) ++hits;
    }
    CHECK_INT(hits, 354);
  }
  {
    atlas::Rng rng(4242);
    int hits = 0;
    for (int s = 0; s < 500; ++s) {
      if (atlas::directed_crossing(lat, 0.70, rng, true).cross) ++hits;
    }
    CHECK_INT(hits, 328);
  }
}

void test_cardy() {
  CHECK_CLOSE(atlas::cardy_crossing(0.1), 4.039284061265219e-05, 1e-13);
  CHECK_CLOSE(atlas::cardy_hypergeom(1.0), 1.1129126745223048, 1e-12);
  CHECK_CLOSE(atlas::cardy_crossing(1.0), 0.5, 0.0);
  CHECK_CLOSE(atlas::cardy_crossing(10.0), 0.9999596071593873, 1e-12);
  CHECK_CLOSE(atlas::cardy_crossing(0.25), 0.02163002909086675, 1e-12);
  CHECK_CLOSE(atlas::cardy_crossing(2.0), 0.8243531061993448, 1e-12);
}

void test_sanity() {
  // Square torus: every site contributes an E and an S edge.
  const atlas::Lattice square = atlas::build_lattice("square", 32, true);
  CHECK_INT(square.n, 32 * 32);
  CHECK_INT(square.m, 2 * 32 * 32);

  // Honeycomb torus: cubic and m = 3n/2.
  const atlas::Lattice honey = atlas::build_lattice("honeycomb", 8, true);
  const atlas::DegreeHistogram hist = atlas::degree_histogram(honey);
  CHECK_INT(honey.n, 64);
  CHECK_INT(honey.m, 96);
  for (int v = 0; v < honey.n; ++v) CHECK_INT(hist.degree[static_cast<std::size_t>(v)], 3);

  // Triangular open boundaries: the SW edge is absent at column 0, so the
  // open lattice has 2L(L-1) E/S edges plus (L-1)^2 SW edges.
  const atlas::Lattice tri = atlas::build_lattice("triangular", 8);
  int sw_edges = 0;
  for (int e = 0; e < tri.m; ++e) {
    if (tri.etype[static_cast<std::size_t>(e)] == atlas::ETYPE_SW) {
      ++sw_edges;
      CHECK(tri.eu[static_cast<std::size_t>(e)] % 8 != 0);
    }
  }
  CHECK_INT(tri.m, 8 * 7 + 8 * 7 + 7 * 7);
  CHECK_INT(sw_edges, 7 * 7);
  const atlas::Lattice tri_torus = atlas::build_lattice("triangular", 8, true);
  CHECK_INT(tri_torus.m, 3 * 8 * 8);

  // p = 1 -> one cluster spanning all n sites; p = 0 -> n singletons.
  const atlas::Lattice lat = atlas::build_lattice("square", 16);
  atlas::Percolation model(lat, Mode::Bond);
  atlas::Rng rng(3);

  model.sample(1.0, rng);
  const atlas::ClusterStats& full = model.analyze();
  CHECK_INT(full.count, 1);
  CHECK_INT(full.max_size, lat.n);
  CHECK_INT(full.sum, lat.n);
  CHECK_INT(full.sum2, static_cast<long long>(lat.n) * lat.n);
  CHECK_CLOSE(full.chi2(), static_cast<double>(lat.n), 0.0);
  CHECK_CLOSE(full.max_fraction(), 1.0, 0.0);
  CHECK(model.crosses_lr());
  CHECK(model.crosses_tb());

  model.sample(0.0, rng);
  const atlas::ClusterStats& empty = model.analyze();
  CHECK_INT(empty.count, lat.n);
  CHECK_INT(empty.max_size, 1);
  CHECK_INT(empty.sum, lat.n);
  CHECK_INT(empty.sum2, lat.n);
  CHECK_CLOSE(empty.chi2(), 1.0, 0.0);
  CHECK_CLOSE(empty.max_fraction(), 1.0 / lat.n, 1e-15);
  CHECK(!model.crosses_lr());
  CHECK(!model.crosses_tb());
}

void test_regressions() {
  // Triangle 0-1-2 plus leaf 3-2: the 3-core is empty.
  {
    atlas::Graph g;
    g.n = 4;
    g.m = 8;
    g.offset = {0, 2, 4, 7, 8};
    g.adj = {1, 2, 0, 2, 1, 0, 3, 2};
    const atlas::KCoreResult core = atlas::kcore(g, atlas::all_active(4), 3);
    CHECK_INT(core.size, 0);
  }
  // Site percolation at p=0 must not report a maximum cluster of size 1.
  {
    const atlas::Lattice lat = atlas::build_lattice("square", 8);
    atlas::Percolation model(lat, Mode::Site);
    atlas::Rng rng(2);
    model.sample(0.0, rng);
    model.build();
    CHECK_INT(model.dsu().count(), 0);
    CHECK_INT(model.dsu().max_size(), 0);
  }
  // Large-mean Poisson: exp(-mean) underflows above ~745.
  {
    atlas::Rng rng(3);
    const std::vector<int> deg = atlas::poisson_degrees(2000, 1000.0, rng);
    double sum = 0;
    for (const int d : deg) sum += d;
    CHECK_CLOSE(sum / static_cast<double>(deg.size()), 1000.0, 5.0);
  }
  // Degenerate honeycomb sizes are rejected.
  {
    bool threw = false;
    try {
      (void)atlas::build_lattice("honeycomb", 4);
    } catch (const std::invalid_argument&) {
      threw = true;
    }
    CHECK(threw);
  }
}

void test_duality() {
  const atlas::Lattice lat = atlas::build_lattice("square", 32);
  atlas::Percolation model(lat, Mode::Bond);
  atlas::Rng rng(2024);
  int hits = 0;
  constexpr int kSamples = 400;
  for (int s = 0; s < kSamples; ++s) {
    model.sample(0.5, rng);
    if (model.crosses_lr()) ++hits;
  }
  const double rate = static_cast<double>(hits) / kSamples;
  CHECK_RANGE(rate, 0.42, 0.58);
}

void test_algorithms() {
  // The chain at p = 1 is the boundary case where p_c = 1: it is fully open,
  // so theta = 1, not the theta = 0 returned by the generic p <= p_c branch.
  {
    const atlas::BetheResult chain = atlas::bethe_percolation(2, 1.0);
    CHECK_CLOSE(chain.theta, 1.0, 0.0);
    CHECK_CLOSE(chain.u, 0.0, 0.0);
    CHECK(chain.supercritical);
  }

  // ---------------------------------------------------------------------
  // data/golden/algorithms-v3.json: bootstrap_3x3_corners_r2
  // ---------------------------------------------------------------------
  {
    const atlas::Lattice lat = atlas::build_lattice("square", 3);
    const atlas::Neighbours nb = atlas::neighbours_from_edges(lat.n, lat.eu, lat.ev);
    std::vector<std::uint8_t> init(static_cast<std::size_t>(lat.n), 0);
    const int corners[4] = {0, 2, 6, 8};
    for (const int v : corners) init[static_cast<std::size_t>(v)] = 1;
    const atlas::BootstrapResult b = atlas::bootstrap_activation(lat.n, nb, init, 2);
    const int want_time[9] = {0, 1, 0, 1, 2, 1, 0, 1, 0};
    CHECK_INT(b.active_count, 9);
    CHECK_INT(b.rounds.size(), 2);
    for (int v = 0; v < 9; ++v) {
      CHECK_INT(b.time[static_cast<std::size_t>(v)], want_time[v]);
      CHECK_INT(b.active[static_cast<std::size_t>(v)], 1);
    }
  }

  // data/golden/algorithms-v3.json: bootstrap_32x32_p055_r3_seed123
  {
    const atlas::Lattice lat = atlas::build_lattice("square", 32);
    const atlas::Neighbours nb = atlas::neighbours_from_edges(lat.n, lat.eu, lat.ev);
    atlas::Rng rng(123);
    std::vector<std::uint8_t> init(static_cast<std::size_t>(lat.n), 0);
    for (int v = 0; v < lat.n; ++v) {
      init[static_cast<std::size_t>(v)] = rng.random() < 0.55 ? 1 : 0;
    }
    const atlas::BootstrapResult b = atlas::bootstrap_activation(lat.n, nb, init, 3);
    CHECK_INT(b.active_count, 811);
    CHECK_INT(b.rounds.size(), 10);
    CHECK_CLOSE(b.fraction, 0.7919921875, 1e-15);
  }

  // ---------------------------------------------------------------------
  // data/golden/algorithms-v3.json: invasion_2x2_thresholds
  // ---------------------------------------------------------------------
  {
    const atlas::Lattice lat = atlas::build_lattice("square", 2);
    const std::vector<double> threshold = {0.1, 0.9, 0.2, 0.8};
    const atlas::InvasionResult inv =
        atlas::invasion_cluster(lat.n, lat.eu, lat.ev, threshold, 0);
    const int want_order[4] = {0, 1, 3, 2};
    const double want_threshold[3] = {0.1, 0.2, 0.8};
    CHECK_INT(inv.size, 4);
    CHECK_INT(inv.loops, 1);
    CHECK_INT(inv.order.size(), 4);
    CHECK_INT(inv.thresholds.size(), 3);
    for (int i = 0; i < 4; ++i) {
      CHECK_INT(inv.order[static_cast<std::size_t>(i)], want_order[i]);
    }
    for (int i = 0; i < 3; ++i) {
      CHECK_CLOSE(inv.thresholds[static_cast<std::size_t>(i)], want_threshold[i], 0.0);
    }
    CHECK_CLOSE(inv.last_threshold, 0.8, 0.0);
  }

  // data/golden/algorithms-v3.json: invasion_16x16_seed5_rng13
  {
    const atlas::Lattice lat = atlas::build_lattice("square", 16);
    atlas::Rng rng(13);
    std::vector<double> threshold(static_cast<std::size_t>(lat.m));
    for (int e = 0; e < lat.m; ++e) {
      threshold[static_cast<std::size_t>(e)] = rng.random();
    }
    const atlas::InvasionResult inv =
        atlas::invasion_cluster(lat.n, lat.eu, lat.ev, threshold, 5);
    CHECK_INT(inv.size, 256);
    CHECK_INT(inv.loops, 225);
    CHECK_CLOSE(inv.last_threshold, 0.7136381922622188, 1e-15);
    CHECK_INT(inv.thresholds.size(), 255);
  }

  // ---------------------------------------------------------------------
  // data/golden/algorithms-v3.json: leath_6x6_seed3_p05
  // ---------------------------------------------------------------------
  {
    const atlas::Lattice lat = atlas::build_lattice("square", 6);
    atlas::Rng rng(3);
    const atlas::LeathResult le = atlas::leath_cluster(lat, 3, 0.5, rng);
    CHECK_INT(le.size, 4);
    CHECK_INT(le.open_edges, 3);
    CHECK_INT(le.perimeter, 5);
    CHECK(!le.truncated);
    CHECK_INT(le.sites.size(), 4);
    CHECK_INT(le.sites.front(), 3);
  }

  // ---------------------------------------------------------------------
  // data/golden/algorithms-v3.json: explosive_graph_500_seed7
  // ---------------------------------------------------------------------
  {
    const atlas::ExplosiveGraphResult ex =
        atlas::explosive_random_graph(500, "product", 0, 7, 1);
    CHECK_INT(ex.steps, 2000);
    CHECK_INT(ex.points.size(), 2000);
    CHECK_CLOSE(ex.points.back().smax, 1.0, 0.0);
    CHECK_CLOSE(ex.max_jump, 0.312, 1e-12);
    CHECK_INT(ex.jump_at, 464);
    CHECK_INT(ex.added, 499);
    CHECK_INT(ex.points.back().added, 499);
  }

  // data/golden/algorithms-v3.json: explosive_lattice_4x4_seed11_sum
  {
    const atlas::Lattice lat = atlas::build_lattice("square", 4);
    const atlas::ExplosiveResult ex =
        atlas::explosive_percolation(lat.n, lat.eu, lat.ev, "sum", 11);
    CHECK_INT(ex.steps.size(), 12);
    CHECK_CLOSE(ex.steps.back().smax, 0.375, 0.0);
    CHECK_CLOSE(ex.max_jump, 0.0625, 0.0);
    CHECK_INT(ex.jump_at, 1);
    CHECK_INT(ex.m, lat.m);
    CHECK_INT(ex.candidates_used, 24);
  }

  // ---------------------------------------------------------------------
  // data/golden/algorithms-v3.json: bethe_z3_p06 and bethe_z4_p04
  // ---------------------------------------------------------------------
  {
    const atlas::BetheResult z3 = atlas::bethe_percolation(3, 0.6);
    CHECK_CLOSE(z3.theta, 0.7037037037036935, 1e-12);
    CHECK_CLOSE(z3.u, 0.4444444444444571, 1e-12);
    CHECK_CLOSE(z3.pc, 0.5, 0.0);
    CHECK(std::isinf(z3.chi));
    CHECK(z3.supercritical);

    const atlas::BetheResult z4 = atlas::bethe_percolation(4, 0.4);
    CHECK_CLOSE(z4.theta, 0.5415026221291449, 1e-12);
    CHECK_CLOSE(z4.u, 0.557189138830779, 1e-12);
    CHECK_CLOSE(z4.pc, 1.0 / 3.0, 0.0);
    CHECK(std::isinf(z4.chi));
    CHECK(z4.supercritical);
  }

  // ---------------------------------------------------------------------
  // data/golden/algorithms-v3.json: config_poisson_c2_T1 and
  // sir_poisson_c2_T1
  // ---------------------------------------------------------------------
  {
    const std::vector<double> poisson2 = atlas::poisson_pmf(2.0);
    const atlas::GiantComponentResult config =
        atlas::configuration_giant_component(poisson2, 1.0);
    CHECK_CLOSE(config.S, 0.7968121300200065, 1e-12);
    CHECK_CLOSE(config.u, 0.20318786998001315, 1e-12);
    CHECK_CLOSE(config.kappa, 3.0, 1e-12);
    CHECK_CLOSE(config.tc, 0.5, 1e-12);
    CHECK_CLOSE(config.r0, 2.0, 1e-12);
    CHECK_CLOSE(config.mean_degree, 2.0, 1e-12);

    const atlas::SirResult sir = atlas::sir_final_size(poisson2, 1.0);
    CHECK_CLOSE(sir.final_size, 0.7968121300200065, 1e-12);
    CHECK_CLOSE(sir.r0, 2.0, 1e-12);
    CHECK_CLOSE(sir.herd_immunity, 0.5, 1e-12);
  }

  // ---------------------------------------------------------------------
  // data/golden/algorithms-v3.json: labels_square6_p05_seed42
  // ---------------------------------------------------------------------
  {
    const atlas::Lattice lat = atlas::build_lattice("square", 6);
    atlas::Rng rng(42);
    std::vector<std::uint8_t> open_edges(static_cast<std::size_t>(lat.m), 0);
    for (int e = 0; e < lat.m; ++e) {
      open_edges[static_cast<std::size_t>(e)] = rng.random() < 0.5 ? 1 : 0;
    }
    const atlas::LabelResult lab =
        atlas::label_clusters(lat.n, lat.eu, lat.ev, &open_edges);
    const int want_labels[36] = {3,  3,  3,  3,  4,  4,  3,  3,  3,  3,  3,  3,
                                 3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,
                                 3,  25, 26, 3,  3,  29, 3,  3,  3,  3,  3,  35};
    CHECK_INT(lab.count, 6);
    CHECK_INT(lab.max_size, 30);
    CHECK_INT(lab.labels.size(), 36);
    for (int v = 0; v < 36; ++v) {
      CHECK_INT(lab.labels[static_cast<std::size_t>(v)],
                want_labels[static_cast<std::size_t>(v)]);
    }
  }

  // ---------------------------------------------------------------------
  // Property: the round-based bootstrap agrees with the naive synchronous
  // closure on random initial sets and thresholds.
  // ---------------------------------------------------------------------
  {
    const atlas::Lattice lat = atlas::build_lattice("square", 8);
    const atlas::Neighbours nb = atlas::neighbours_from_edges(lat.n, lat.eu, lat.ev);
    for (int seed = 1; seed <= 12; ++seed) {
      atlas::Rng rng(seed);
      std::vector<std::uint8_t> init(static_cast<std::size_t>(lat.n), 0);
      for (int v = 0; v < lat.n; ++v) {
        init[static_cast<std::size_t>(v)] = rng.random() < 0.4 ? 1 : 0;
      }
      const int r = 1 + (seed % 3);
      const atlas::BootstrapResult fast =
          atlas::bootstrap_activation(lat.n, nb, init, r);
      std::vector<std::uint8_t> slow = init;
      for (int round = 0; round < lat.n; ++round) {
        std::vector<std::uint8_t> next = slow;
        bool changed = false;
        for (int v = 0; v < lat.n; ++v) {
          if (slow[static_cast<std::size_t>(v)]) continue;
          int active_neighbours = 0;
          for (int k = nb.start[static_cast<std::size_t>(v)];
               k < nb.start[static_cast<std::size_t>(v) + 1]; ++k) {
            active_neighbours += slow[static_cast<std::size_t>(nb.adj[static_cast<std::size_t>(k)])];
          }
          if (active_neighbours >= r) {
            next[static_cast<std::size_t>(v)] = 1;
            changed = true;
          }
        }
        slow = std::move(next);
        if (!changed) break;
      }
      CHECK(fast.active == slow);
    }
  }

  // ---------------------------------------------------------------------
  // Property: label_clusters() reproduces the percolation cluster statistics
  // for bond and site configurations.
  // ---------------------------------------------------------------------
  {
    const atlas::Lattice lat = atlas::build_lattice("square", 8);
    {
      atlas::Percolation model(lat, Mode::Bond);
      atlas::Rng rng(7);
      model.sample(0.5, rng);
      const atlas::LabelResult lab =
          atlas::label_clusters(lat.n, lat.eu, lat.ev, &model.open());
      const atlas::ClusterStats& stats = model.analyze();
      long long labelled_sites = 0;
      int labelled_max = 0;
      for (const int s : lab.sizes) {
        labelled_sites += s;
        labelled_max = std::max(labelled_max, s);
      }
      CHECK_INT(lab.count, stats.count);
      CHECK_INT(lab.max_size, stats.max_size);
      CHECK_INT(labelled_max, stats.max_size);
      CHECK_INT(labelled_sites, stats.sum);
      CHECK_INT(labelled_sites, lat.n);
    }
    {
      atlas::Percolation model(lat, Mode::Site);
      atlas::Rng rng(11);
      model.sample(0.45, rng);
      const atlas::LabelResult lab =
          atlas::label_clusters(lat.n, lat.eu, lat.ev, nullptr, &model.occupied());
      const atlas::ClusterStats& stats = model.analyze();
      long long labelled_sites = 0;
      for (const int s : lab.sizes) labelled_sites += s;
      for (int v = 0; v < lat.n; ++v) {
        if (model.occupied()[static_cast<std::size_t>(v)]) {
          CHECK(lab.labels[static_cast<std::size_t>(v)] >= 0);
          CHECK(lab.sizes[static_cast<std::size_t>(
                    lab.labels[static_cast<std::size_t>(v)])] > 0);
        } else {
          CHECK_INT(lab.labels[static_cast<std::size_t>(v)], -1);
        }
      }
      CHECK_INT(lab.count, stats.count);
      CHECK_INT(lab.max_size, stats.max_size);
      CHECK_INT(labelled_sites, stats.sum);
    }
  }

  // ---------------------------------------------------------------------
  // Property: the Bethe threshold is exact and p_c is the critical point.
  // ---------------------------------------------------------------------
  {
    const int degrees[3] = {3, 4, 10};
    for (const int z : degrees) {
      CHECK_CLOSE(atlas::bethe_threshold(z), 1.0 / static_cast<double>(z - 1), 0.0);
      const atlas::BetheResult crit =
          atlas::bethe_percolation(z, atlas::bethe_threshold(z));
      CHECK_CLOSE(crit.theta, 0.0, 0.0);
      CHECK_CLOSE(crit.u, 1.0, 0.0);
      CHECK(std::isinf(crit.chi));
      CHECK(!crit.supercritical);
    }
    // z = 2 is the endpoint p_c = 1: below it the chain is closed, at p = 1
    // it is fully open and theta = 1.
    const atlas::BetheResult chain_sub = atlas::bethe_percolation(2, 0.999);
    CHECK_CLOSE(chain_sub.theta, 0.0, 0.0);
    CHECK_CLOSE(chain_sub.u, 1.0, 0.0);
    CHECK(!chain_sub.supercritical);
    const atlas::BetheResult chain_open = atlas::bethe_percolation(2, 1.0);
    CHECK_CLOSE(chain_open.theta, 1.0, 0.0);
    CHECK(chain_open.supercritical);

    const atlas::BetheResult subcritical = atlas::bethe_percolation(3, 0.4);
    CHECK_CLOSE(subcritical.theta, 0.0, 0.0);
    CHECK_CLOSE(subcritical.chi, 7.0, 1e-12);
    CHECK(!subcritical.supercritical);
  }
}

template <typename Function>
bool throws_invalid_argument(Function&& function) {
  try {
    function();
  } catch (const std::invalid_argument&) {
    return true;
  }
  return false;
}

void test_newman_ziff_site() {
  // data/golden/algorithms-v3.json: nz_site_square8_seed5_cp16
  const atlas::Lattice lat = atlas::build_lattice("square", 8);
  atlas::Rng rng(5);
  const atlas::NewmanZiffResult nz = atlas::newman_ziff_site(lat, rng, 16);
  const double want_p[16] = {0.0625, 0.125, 0.1875, 0.25,   0.3125, 0.375, 0.4375, 0.5,
                             0.5625, 0.625, 0.6875, 0.75,   0.8125, 0.875, 0.9375, 1.0};
  const int want_smax[16] = {1, 2, 6, 8, 13, 15, 17, 22, 26, 34, 41, 45, 52, 56, 60, 64};
  const double want_chi2[16] = {0.0625,   0.15625,  0.71875,  1.40625,  2.875,  3.875,
                                5.0,      8.0,      11.0,     18.34375, 26.40625, 31.78125,
                                42.25,    49.0,     56.25,    64.0};
  const int want_nclusters[16] = {4, 7, 5, 4, 5, 5, 5, 5, 5, 3, 2, 2, 1, 1, 1, 1};

  CHECK_INT(nz.p.size(), 16);
  CHECK_INT(nz.smax.size(), 16);
  CHECK_INT(nz.chi2.size(), 16);
  CHECK_INT(nz.nclusters.size(), 16);
  CHECK_INT(nz.n, lat.n);
  CHECK_INT(nz.m, lat.m);
  for (std::size_t i = 0; i < 16; ++i) {
    CHECK_CLOSE(nz.p[i], want_p[i], 0.0);
    CHECK_INT(nz.smax[i], want_smax[i]);
    CHECK_CLOSE(nz.chi2[i], want_chi2[i], 1e-12);
    CHECK_INT(nz.nclusters[i], want_nclusters[i]);
  }

  // Input validation.
  atlas::Rng bad_rng(5);
  CHECK(throws_invalid_argument([&lat, &bad_rng] {
    (void)atlas::newman_ziff_site(lat, bad_rng, 0);
  }));
  CHECK(throws_invalid_argument([&lat, &bad_rng] {
    (void)atlas::newman_ziff_site(lat, bad_rng, -3);
  }));
}

void test_message_passing() {
  // K5: all ten edges of the complete graph on five vertices.
  const std::vector<int> eu = {0, 0, 0, 0, 1, 1, 1, 2, 2, 3};
  const std::vector<int> ev = {1, 2, 3, 4, 2, 3, 4, 3, 4, 4};

  // data/golden/algorithms-v3.json: message_k5_T04
  {
    const atlas::MessagePassingResult k5 =
        atlas::message_passing_percolation(5, eu, ev, 0.4);
    CHECK(k5.converged);
    CHECK(k5.iterations >= 1);
    CHECK_CLOSE(k5.S, 0.5415026221328071, 1e-10);
    CHECK_INT(k5.outside.size(), 5);
    for (std::size_t v = 0; v < 5; ++v) {
      CHECK_CLOSE(k5.outside[v], 0.45849737786719297, 1e-10);
    }
  }

  // Property: a finite tree carries no giant component.  On the path 0-1-2-3-4-5
  // every cavity message converges to one, so S = 0 and every outside = 1.
  {
    const std::vector<int> teu = {0, 1, 2, 3, 4};
    const std::vector<int> tev = {1, 2, 3, 4, 5};
    const atlas::MessagePassingResult tree =
        atlas::message_passing_percolation(6, teu, tev, 0.5);
    CHECK(tree.converged);
    CHECK_CLOSE(tree.S, 0.0, 1e-12);
    CHECK_INT(tree.outside.size(), 6);
    for (std::size_t v = 0; v < 6; ++v) CHECK_CLOSE(tree.outside[v], 1.0, 1e-12);
  }

  // Property: at T = 1 the triangle is fully connected, so S = 1.
  {
    const std::vector<int> tri_u = {0, 1, 2};
    const std::vector<int> tri_v = {1, 2, 0};
    const atlas::MessagePassingResult triangle =
        atlas::message_passing_percolation(3, tri_u, tri_v, 1.0);
    CHECK(triangle.converged);
    CHECK_CLOSE(triangle.S, 1.0, 1e-12);
    CHECK_INT(triangle.outside.size(), 3);
    for (std::size_t v = 0; v < 3; ++v) CHECK_CLOSE(triangle.outside[v], 0.0, 1e-12);
  }

  // Input validation.
  CHECK(throws_invalid_argument([&eu, &ev] {
    (void)atlas::message_passing_percolation(5, eu, ev, -0.01);
  }));
  CHECK(throws_invalid_argument([&eu, &ev] {
    (void)atlas::message_passing_percolation(5, eu, ev, 1.01);
  }));
  CHECK(throws_invalid_argument([&eu, &ev] {
    (void)atlas::message_passing_percolation(5, eu, ev, 0.4, 0);
  }));
}

struct TestCase {
  const char* name;
  void (*fn)();
};

}  // namespace

int main() {
  const TestCase tests[] = {
      {"rng", test_rng},
      {"parity", test_parity},
      {"directed", test_directed},
      {"cardy", test_cardy},
      {"sanity", test_sanity},
      {"regressions", test_regressions},
      {"duality", test_duality},
      {"algorithms", test_algorithms},
      {"newman_ziff_site", test_newman_ziff_site},
      {"message_passing", test_message_passing},
  };

  int failures = 0;
  for (const TestCase& test : tests) {
    try {
      test.fn();
      std::cout << "PASS " << test.name << '\n';
    } catch (const std::exception& error) {
      ++failures;
      std::cout << "FAIL " << test.name << ": " << error.what() << '\n';
    } catch (...) {
      ++failures;
      std::cout << "FAIL " << test.name << ": unknown exception\n";
    }
  }
  std::cout.flush();
  if (failures != 0) {
    std::cout << failures << " test(s) failed\n";
    return 1;
  }
  std::cout << "ALL TESTS PASSED\n";
  return 0;
}
