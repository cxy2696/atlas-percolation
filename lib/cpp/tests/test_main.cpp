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
  CHECK_CLOSE(atlas::cardy_crossing(0.1), 4.0394890895707114e-05, 1e-13);
  CHECK_CLOSE(atlas::cardy_hypergeom(1.0), 1.1129126745223048, 1e-12);
  CHECK_CLOSE(atlas::cardy_crossing(1.0), 0.5, 0.0);
  CHECK_CLOSE(atlas::cardy_crossing(10.0), 0.9999596051091043, 1e-12);
  CHECK_CLOSE(atlas::cardy_crossing(0.25), 0.02163002909086475, 1e-12);
  CHECK_CLOSE(atlas::cardy_crossing(2.0), 0.8243531061993461, 1e-12);
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
