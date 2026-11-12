// Data-production harness for the atlas.
//
// This program generates every number that appears in Chapter 11, in the
// Data view of the site and in data/benchmarks.json.  It is deliberately
// self-contained (RNG + DSU + lattices) so that the published data can be
// reproduced without depending on the library build.  The library itself
// lives in lib/cpp and is tested against the same golden vectors.
//
// Build:  clang++ -O3 -std=c++20 -o build/bench scripts/bench.cpp
// Run:    ./build/bench > data/raw/bench.json
//
// All experiments use the shared xoshiro128** stream (docs/RNG.md).

#include <algorithm>
#include <cmath>
#include <cstdint>
#include <cstdio>
#include <cstring>
#include <map>
#include <numeric>
#include <queue>
#include <string>
#include <unordered_map>
#include <vector>

// ---------------------------------------------------------------- RNG
struct Rng {
  uint32_t s[4];
  static uint32_t mix32(uint32_t z) {
    z = (z ^ (z >> 16)) * 0x21F0AAADu;
    z = (z ^ (z >> 15)) * 0x735A2D97u;
    return z ^ (z >> 15);
  }
  explicit Rng(uint32_t seed) {
    uint32_t x = seed;
    for (int i = 0; i < 4; i++) {
      x += 0x9E3779B9u;
      s[i] = mix32(x);
    }
    if ((s[0] | s[1] | s[2] | s[3]) == 0) s[0] = 1;
  }
  static uint32_t rotl(uint32_t x, int k) { return (x << k) | (x >> (32 - k)); }
  uint32_t u32() {
    uint32_t r = rotl(s[1] * 5u, 7) * 9u;
    uint32_t t = s[1] << 9;
    s[2] ^= s[0];
    s[3] ^= s[1];
    s[1] ^= s[2];
    s[0] ^= s[3];
    s[2] ^= t;
    s[3] = rotl(s[3], 11);
    return r;
  }
  double random() {
    uint32_t a = u32() >> 6;
    uint32_t b = u32() >> 5;
    return (a * 134217728.0 + b) / 9007199254740992.0;
  }
  uint32_t intn(uint32_t n) {
    if (n <= 1) return 0;
    // Keep the largest multiple of n that fits in 32 bits in 64-bit arithmetic.
    // The earlier 32-bit cast wrapped to zero when n divided 2^32, which made
    // the rejection loop run forever for stub counts such as 65536.
    const uint64_t limit = (uint64_t{1} << 32) / n * n;
    uint32_t r;
    do { r = u32(); } while ((uint64_t)r >= limit);
    return r % n;
  }
};

// ---------------------------------------------------------------- DSU
struct Dsu {
  std::vector<int> p, sz;
  int maxSize = 1;
  explicit Dsu(int n) : p(n), sz(n, 1) {
    std::iota(p.begin(), p.end(), 0);
    maxSize = n ? 1 : 0;
  }
  void reset() {
    std::iota(p.begin(), p.end(), 0);
    std::fill(sz.begin(), sz.end(), 1);
    maxSize = 1;
  }
  int find(int x) {
    int r = x;
    while (p[r] != r) r = p[r];
    while (p[x] != r) { int nx = p[x]; p[x] = r; x = nx; }
    return r;
  }
  bool unite(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return false;
    if (sz[a] < sz[b]) std::swap(a, b);
    p[b] = a;
    sz[a] += sz[b];
    if (sz[a] > maxSize) maxSize = sz[a];
    return true;
  }
};

// ---------------------------------------------------------------- lattice
struct Lattice {
  int Lx, Ly, n, m;
  std::string kind;
  std::vector<int> eu, ev;
  int id(int i, int j) const { return i * Lx + j; }
};

Lattice make_lattice(const std::string& kind, int Lx, int Ly, bool torus) {
  Lattice g;
  g.kind = kind;
  g.Lx = Lx;
  g.Ly = Ly;
  g.n = Lx * Ly;
  auto add = [&](int a, int b) { g.eu.push_back(a); g.ev.push_back(b); };
  for (int i = 0; i < Ly; i++) {
    for (int j = 0; j < Lx; j++) {
      int v = g.id(i, j);
      if (kind == "honeycomb") {
        if ((i + j) % 2 == 0 && (j + 1 < Lx || torus))
          add(v, g.id(i, (j + 1) % Lx));
        if (i + 1 < Ly || torus) add(v, g.id((i + 1) % Ly, j));
        continue;
      }
      if (j + 1 < Lx || torus) add(v, g.id(i, (j + 1) % Lx));
      if (i + 1 < Ly || torus) add(v, g.id((i + 1) % Ly, j));
      if (kind == "triangular" && (i + 1 < Ly || torus) && (j - 1 >= 0 || torus))
        add(v, g.id((i + 1) % Ly, ((j - 1) % Lx + Lx) % Lx));
    }
  }
  g.m = (int)g.eu.size();
  return g;
}

// ---------------------------------------------------------------- percolation
struct Sample {
  std::vector<uint8_t> occ, open;
  Dsu dsu;
  std::vector<int> stamp;
  int gen = 0;
  explicit Sample(const Lattice& g) : occ(g.n, 1), open(g.m, 1), dsu(g.n), stamp(g.n, 0) {}
};

void draw_bond(Sample& s, const Lattice& g, double p, Rng& rng) {
  std::fill(s.occ.begin(), s.occ.end(), 1);
  for (int e = 0; e < g.m; e++) s.open[e] = rng.random() < p;
  s.dsu.reset();
  for (int e = 0; e < g.m; e++)
    if (s.open[e] && s.occ[g.eu[e]] && s.occ[g.ev[e]]) s.dsu.unite(g.eu[e], g.ev[e]);
}

void draw_site(Sample& s, const Lattice& g, double p, Rng& rng) {
  for (int v = 0; v < g.n; v++) s.occ[v] = rng.random() < p;
  std::fill(s.open.begin(), s.open.end(), 1);
  s.dsu.reset();
  for (int e = 0; e < g.m; e++)
    if (s.open[e] && s.occ[g.eu[e]] && s.occ[g.ev[e]]) s.dsu.unite(g.eu[e], g.ev[e]);
}

bool crosses_lr(Sample& s, const Lattice& g) {
  int gen = ++s.gen;
  for (int i = 0; i < g.Ly; i++) {
    int v = g.id(i, 0);
    if (s.occ[v]) s.stamp[s.dsu.find(v)] = gen;
  }
  for (int i = 0; i < g.Ly; i++) {
    int v = g.id(i, g.Lx - 1);
    if (s.occ[v] && s.stamp[s.dsu.find(v)] == gen) return true;
  }
  return false;
}

struct Stats {
  int count = 0, maxSize = 0;
  long long sum = 0, sum2 = 0;
};

Stats stats_of(Sample& s, const Lattice& g) {
  // O(n): roots of occupied sites hold their component size in dsu.sz.
  Stats st;
  for (int v = 0; v < g.n; v++) {
    if (!s.occ[v] || s.dsu.p[v] != v) continue;
    int sz = s.dsu.sz[v];
    st.count++;
    st.sum += sz;
    st.sum2 += (long long)sz * sz;
    if (sz > st.maxSize) st.maxSize = sz;
  }
  return st;
}

bool touches_any_boundary(Sample& s, const Lattice& g, int root) {
  for (int i = 0; i < g.Ly; i++) {
    for (int j : {0, g.Lx - 1}) {
      const int v = g.id(i, j);
      if (s.occ[v] && s.dsu.find(v) == root) return true;
    }
  }
  for (int j = 0; j < g.Lx; j++) {
    for (int i : {0, g.Ly - 1}) {
      const int v = g.id(i, j);
      if (s.occ[v] && s.dsu.find(v) == root) return true;
    }
  }
  return false;
}

// ---------------------------------------------------------------- output
static std::string out;
void emit(const std::string& s) { out += s; }

std::string d2s(double x) {
  char buf[64];
  std::snprintf(buf, sizeof buf, "%.10g", x);
  return buf;
}

// ---------------------------------------------------------------- experiments
void exp_crossing(Rng& rng) {
  emit("\"crossing\":[");
  bool first = true;
  for (int L : {32, 64, 128}) {
    Lattice g = make_lattice("square", L, L, false);
    Sample s(g);
    for (int k = 0; k <= 12; k++) {
      double p = 0.44 + 0.01 * k;
      int n = (L <= 64) ? 400 : 200;
      int hits = 0;
      for (int t = 0; t < n; t++) {
        draw_bond(s, g, p, rng);
        hits += crosses_lr(s, g);
      }
      if (!first) emit(",");
      first = false;
      emit("{\"L\":" + std::to_string(L) + ",\"p\":" + d2s(p) + ",\"n\":" + std::to_string(n) +
           ",\"hits\":" + std::to_string(hits) + "}");
    }
  }
  emit("]");
}

void exp_torus(Rng& rng) {
  emit(",\"torus\":[");
  bool first = true;
  for (int L : {32, 64, 128}) {
    Lattice g = make_lattice("square", L, L, true);
    Sample s(g);
    for (int k = 0; k <= 16; k++) {
      double p = 0.42 + 0.01 * k;
      int n = 100;
      double smax = 0, chi = 0;
      for (int t = 0; t < n; t++) {
        draw_bond(s, g, p, rng);
        Stats st = stats_of(s, g);
        smax += (double)st.maxSize / g.n;
        chi += st.sum ? (double)st.sum2 / st.sum : 0.0;
      }
      if (!first) emit(",");
      first = false;
      emit("{\"L\":" + std::to_string(L) + ",\"p\":" + d2s(p) + ",\"n\":" + std::to_string(n) +
           ",\"smax\":" + d2s(smax / n) + ",\"chi\":" + d2s(chi / n) + "}");
    }
  }
  emit("]");
}

void exp_psi(Rng& rng) {
  // probability that the origin is connected to the boundary, at p_c
  emit(",\"arm\":[");
  bool first = true;
  for (int L : {32, 64, 128, 256, 512}) {
    Lattice g = make_lattice("square", L, L, false);
    Sample s(g);
    // Keep the total work bounded: the 512^2 box is 16 times the 128^2 box.
    int n = (L <= 64) ? 800 : (L <= 256 ? 400 : 200);
    int hits = 0;
    for (int t = 0; t < n; t++) {
      draw_bond(s, g, 0.5, rng);
      // The one-arm exponent is defined for a bulk point, not a corner.
      const int center = (g.Ly / 2) * g.Lx + g.Lx / 2;
      int r = s.dsu.find(center);
      hits += touches_any_boundary(s, g, r);
    }
    if (!first) emit(",");
    first = false;
    emit("{\"L\":" + std::to_string(L) + ",\"n\":" + std::to_string(n) +
         ",\"hits\":" + std::to_string(hits) + "}");
  }
  emit("]");
}

void exp_cardy(Rng& rng) {
  emit(",\"cardy\":[");
  bool first = true;
  int W = 96;
  for (double aspect : {0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 4.0}) {
    int H = (int)std::lround(W * aspect);
    Lattice g = make_lattice("square", W, H, false);
    Sample s(g);
    // The narrow rectangle has a tiny crossing probability; a fixed n=300
    // gave a 3-sigma fluctuation at aspect 0.25.  Spend the samples where the
    // signal is rare.
    int n = (aspect <= 0.3) ? 3000 : 600;
    int hits = 0;
    for (int t = 0; t < n; t++) {
      draw_bond(s, g, 0.5, rng);
      hits += crosses_lr(s, g);
    }
    if (!first) emit(",");
    first = false;
    emit("{\"aspect\":" + d2s(aspect) + ",\"W\":" + std::to_string(W) + ",\"H\":" + std::to_string(H) +
         ",\"n\":" + std::to_string(n) + ",\"hits\":" + std::to_string(hits) + "}");
  }
  emit("]");
}

void exp_cluster_hist(Rng& rng) {
  emit(",\"cluster_hist\":[");
  Lattice g = make_lattice("square", 512, 512, false);
  Sample s(g);
  std::vector<long long> hist(g.n + 1, 0);
  for (int t = 0; t < 20; t++) {
    draw_bond(s, g, 0.5, rng);
    for (int v = 0; v < g.n; v++)
      if (s.dsu.p[v] == v) hist[s.dsu.sz[v]]++;
  }
  bool first = true;
  // log-spaced bins
  int lo = 1;
  while (lo < g.n) {
    int hi = std::max(lo + 1, (int)std::lround(lo * 1.35));
    long long c = 0;
    for (int s2 = lo; s2 < hi && s2 <= g.n; s2++) c += hist[s2];
    if (c > 0) {
      if (!first) emit(",");
      first = false;
      emit("{\"lo\":" + std::to_string(lo) + ",\"hi\":" + std::to_string(hi) +
           ",\"count\":" + std::to_string(c) + "}");
    }
    lo = hi;
  }
  emit("]");
}

// ---------------------------------------------------------------- networks
struct Graph {
  int n;
  std::vector<int> off, adj;
};
Graph make_config(const std::vector<int>& deg, Rng& rng) {
  int n = (int)deg.size();
  long long M = 0;
  for (int d : deg) M += d;
  std::vector<int> stubs;
  stubs.reserve(M);
  for (int i = 0; i < n; i++) stubs.insert(stubs.end(), deg[i], i);
  for (long long i = (long long)stubs.size() - 1; i > 0; i--) {
    uint32_t j = rng.intn((uint32_t)(i + 1));
    std::swap(stubs[i], stubs[j]);
  }
  Graph g;
  g.n = n;
  g.off.assign(n + 1, 0);
  for (long long k = 0; k < M; k += 2) {
    g.off[stubs[k] + 1]++;
    g.off[stubs[k + 1] + 1]++;
  }
  for (int i = 0; i < n; i++) g.off[i + 1] += g.off[i];
  g.adj.resize(M);
  std::vector<int> fill(g.off.begin(), g.off.end() - 1);
  for (long long k = 0; k < M; k += 2) {
    int a = stubs[k], b = stubs[k + 1];
    g.adj[fill[a]++] = b;
    g.adj[fill[b]++] = a;
  }
  return g;
}
int largest_component(const Graph& g, const std::vector<uint8_t>& active) {
  std::vector<uint8_t> seen(g.n, 0);
  std::vector<int> q(g.n);
  int best = 0;
  for (int v = 0; v < g.n; v++) {
    if (!active[v] || seen[v]) continue;
    int head = 0, tail = 0, size = 0;
    q[tail++] = v;
    seen[v] = 1;
    while (head < tail) {
      int u = q[head++];
      size++;
      for (int e = g.off[u]; e < g.off[u + 1]; e++) {
        int w = g.adj[e];
        if (active[w] && !seen[w]) { seen[w] = 1; q[tail++] = w; }
      }
    }
    best = std::max(best, size);
  }
  return best;
}

std::vector<int> poisson_deg(int n, double c, Rng& rng) {
  std::vector<int> d(n);
  long long sum = 0;
  double lim = std::exp(-c);
  for (int i = 0; i < n; i++) {
    int k = 0;
    double p = 1;
    do { k++; p *= rng.random(); } while (p > lim);
    d[i] = k - 1;
    sum += d[i];
  }
  if (sum % 2) d[0]++;
  return d;
}
std::vector<int> powerlaw_deg(int n, double gamma, int kmin, Rng& rng) {
  std::vector<int> d(n);
  long long sum = 0;
  double a = 1.0 / (gamma - 1.0);
  for (int i = 0; i < n; i++) {
    double u = rng.random();
    const double kd = std::floor(kmin * std::pow(1 - u, -a));
    int k;
    if (!std::isfinite(kd) || kd > 5000.0) {
      k = 5000;
    } else {
      k = static_cast<int>(kd);
    }
    if (k < kmin) k = kmin;
    d[i] = k;
    sum += k;
  }
  if (sum % 2) d[0]++;
  return d;
}

void exp_network(Rng& rng) {
  const int N = 10000;
  emit(",\"network\":{");
  // ER c=4
  {
    auto deg = poisson_deg(N, 4.0, rng);
    Graph g = make_config(deg, rng);
    long long s1 = 0, s2 = 0;
    for (int d : deg) { s1 += d; s2 += (long long)d * d; }
    double k1 = (double)s1 / N, k2 = (double)s2 / N;
    emit("\"er\":{\"mean\":" + d2s(k1) + ",\"second\":" + d2s(k2) + ",\"fc_theory\":" +
         d2s(1 - 1 / (k2 / k1 - 1)) + ",\"random\":[");
    bool first = true;
    for (int k = 0; k <= 10; k++) {
      double f = 0.5 * k / 10; // removal fraction 0..0.5
      std::vector<uint8_t> act(N, 1);
      for (int i = 0; i < N; i++) act[i] = rng.random() < 1 - f;
      int lg = largest_component(g, act);
      if (!first) emit(",");
      first = false;
      emit("{\"f\":" + d2s(f) + ",\"s\":" + d2s((double)lg / N) + "}");
    }
    emit("]}");
  }
  // power law gamma=2.5, targeted
  {
    auto deg = powerlaw_deg(N, 2.5, 2, rng);
    Graph g = make_config(deg, rng);
    long long s1 = 0, s2 = 0;
    for (int d : deg) { s1 += d; s2 += (long long)d * d; }
    std::vector<int> order(N);
    std::iota(order.begin(), order.end(), 0);
    // Ties are common in a power-law degree sequence; keep the vertex index
    // as a deterministic tie-breaker so the published curve is reproducible.
    std::stable_sort(order.begin(), order.end(), [&](int a, int b) {
      return (g.off[a + 1] - g.off[a]) > (g.off[b + 1] - g.off[b]);
    });
    emit(",\"pl25\":{\"mean\":" + d2s((double)s1 / N) + ",\"second\":" + d2s((double)s2 / N) +
         ",\"targeted\":[");
    bool first = true;
    for (int k = 0; k <= 10; k++) {
      double f = 0.5 * k / 10;
      int cut = (int)(f * N);
      std::vector<uint8_t> act(N, 1);
      for (int i = 0; i < cut; i++) act[order[i]] = 0;
      int lg = largest_component(g, act);
      if (!first) emit(",");
      first = false;
      emit("{\"f\":" + d2s(f) + ",\"s\":" + d2s((double)lg / N) + "}");
    }
    emit("]}");
  }
  // power law gamma=2.5 random
  {
    auto deg = powerlaw_deg(N, 2.5, 2, rng);
    Graph g = make_config(deg, rng);
    emit(",\"pl25rand\":[");
    bool first = true;
    for (int k = 0; k <= 10; k++) {
      double f = 0.5 * k / 10;
      std::vector<uint8_t> act(N, 1);
      for (int i = 0; i < N; i++) act[i] = rng.random() < 1 - f;
      int lg = largest_component(g, act);
      if (!first) emit(",");
      first = false;
      emit("{\"f\":" + d2s(f) + ",\"s\":" + d2s((double)lg / N) + "}");
    }
    emit("]");
  }
  emit("}");
}

void exp_interdependent(Rng& rng) {
  const int N = 5000;
  const double c = 4.0;
  emit(",\"interdependent\":{\"c\":" + d2s(c) + ",\"pc_theory\":" + d2s(2.45538 / c) + ",\"points\":[");
  bool first = true;
  for (int k = 0; k <= 12; k++) {
    double p = 0.55 + 0.025 * k;
    double sum = 0;
    double sumsq = 0;
    int max_rounds = 0;
    bool all_converged = true;
    const int reps = 50;
    for (int rep = 0; rep < reps; rep++) {
      auto dA = poisson_deg(N, c, rng);
      auto dB = poisson_deg(N, c, rng);
      Graph A = make_config(dA, rng);
      Graph B = make_config(dB, rng);
      std::vector<uint8_t> surviving(N);
      for (int i = 0; i < N; i++) surviving[i] = rng.random() < p;
      int rounds = 0;
      bool converged = false;
      for (int it = 0; it < 100; it++) {
        rounds = it + 1;
        std::vector<uint8_t> giantA(N, 0), giantB(N, 0);
        auto mark = [&](const Graph& G, const std::vector<uint8_t>& act,
                        std::vector<uint8_t>& outv) {
          std::vector<uint8_t> seen(N, 0);
          std::vector<int> q(N);
          int bestRoot = -1, bestSize = 0;
          for (int v = 0; v < N; v++) {
            if (!act[v] || seen[v]) continue;
            int head = 0, tail = 0;
            q[tail++] = v;
            seen[v] = 1;
            int size = 0;
            while (head < tail) {
              int u = q[head++];
              size++;
              for (int e = G.off[u]; e < G.off[u + 1]; e++) {
                int w = G.adj[e];
                if (act[w] && !seen[w]) { seen[w] = 1; q[tail++] = w; }
              }
            }
            if (size > bestSize) { bestSize = size; bestRoot = v; }
          }
          outv.assign(N, 0);
          if (bestRoot < 0) return;
          int head = 0, tail = 0;
          q[tail++] = bestRoot;
          outv[bestRoot] = 1;
          while (head < tail) {
            int u = q[head++];
            for (int e = G.off[u]; e < G.off[u + 1]; e++) {
              int w = G.adj[e];
              if (act[w] && !outv[w]) { outv[w] = 1; q[tail++] = w; }
            }
          }
        };
        mark(A, surviving, giantA);
        mark(B, surviving, giantB);
        std::vector<uint8_t> next(N, 0);
        bool changed = false;
        for (int i = 0; i < N; i++) {
          next[i] = (surviving[i] && giantA[i] && giantB[i]) ? 1 : 0;
          if (next[i] != surviving[i]) changed = true;
        }
        surviving.swap(next);
        if (!changed) { converged = true; break; }
      }
      if (!converged) all_converged = false;
      if (rounds > max_rounds) max_rounds = rounds;
      int alive = std::accumulate(surviving.begin(), surviving.end(), 0);
      const double frac = (double)alive / N;
      sum += frac;
      sumsq += frac * frac;
    }
    const double mean = sum / reps;
    const double variance = reps > 1 ? (sumsq - reps * mean * mean) / (reps - 1) : 0.0;
    const double se = std::sqrt(std::max(0.0, variance) / reps);
    if (!first) emit(",");
    first = false;
    emit("{\"p\":" + d2s(p) + ",\"s\":" + d2s(mean) + ",\"se\":" + d2s(se) +
         ",\"reps\":" + std::to_string(reps) + ",\"rounds\":" + std::to_string(max_rounds) +
         ",\"converged\":" + (all_converged ? "true" : "false") + "}");
  }
  emit("]}");
}

void exp_kcore(Rng& rng) {
  const int N = 10000;
  const double c = 4.0;
  auto deg = poisson_deg(N, c, rng);
  Graph g = make_config(deg, rng);
  emit(",\"kcore\":{\"c\":" + d2s(c) + ",\"points\":[");
  bool first = true;
  for (int k = 0; k <= 10; k++) {
    // The 3-core of a diluted ER graph appears near p = c_3/c = 3.35/4, so
    // the old 0.55..0.775 window was entirely subcritical and produced a flat
    // zero curve.  Span 0.75..1.00 to show the discontinuous onset.
    double p = 0.75 + 0.025 * k;
    std::vector<uint8_t> act(N, 1);
    for (int i = 0; i < N; i++) act[i] = rng.random() < p;
    // 3-core peeling
    std::vector<int> dcur(N, 0);
    std::vector<uint8_t> alive = act;
    for (int v = 0; v < N; v++)
      if (alive[v])
        for (int e = g.off[v]; e < g.off[v + 1]; e++)
          if (alive[g.adj[e]]) dcur[v]++;
    std::vector<int> q;
    for (int v = 0; v < N; v++)
      if (alive[v] && dcur[v] < 3) q.push_back(v);
    size_t head = 0;
    int rem = std::accumulate(alive.begin(), alive.end(), 0);
    while (head < q.size()) {
      int v = q[head++];
      if (!alive[v]) continue;
      alive[v] = 0;
      rem--;
      for (int e = g.off[v]; e < g.off[v + 1]; e++) {
        int w = g.adj[e];
        if (alive[w]) {
          dcur[w]--;
          if (dcur[w] < 3) q.push_back(w);
        }
      }
    }
    if (!first) emit(",");
    first = false;
    emit("{\"p\":" + d2s(p) + ",\"s\":" + d2s((double)rem / N) + "}");
  }
  emit("]}");
}

void exp_continuum(Rng& rng) {
  const int N = 500;
  emit(",\"continuum\":{\"n\":" + std::to_string(N) + ",\"points\":[");
  bool first = true;
  for (int k = 0; k <= 10; k++) {
    double r = 0.015 + 0.003 * k;
    std::vector<double> x(N), y(N);
    for (int i = 0; i < N; i++) { x[i] = rng.random(); y[i] = rng.random(); }
    Dsu dsu(N);
    double cell = 2 * r;
    std::unordered_map<long long, std::vector<int>> grid;
    auto key = [&](int cx, int cy) -> long long { return (long long)cx * 1000003 + cy; };
    for (int i = 0; i < N; i++) grid[key((int)(x[i] / cell), (int)(y[i] / cell))].push_back(i);
    double r2 = 4 * r * r;
    for (int i = 0; i < N; i++) {
      int cx = (int)(x[i] / cell), cy = (int)(y[i] / cell);
      for (int dx = -1; dx <= 1; dx++)
        for (int dy = -1; dy <= 1; dy++) {
          auto it = grid.find(key(cx + dx, cy + dy));
          if (it == grid.end()) continue;
          for (int j : it->second) {
            if (j <= i) continue;
            double ddx = x[i] - x[j], ddy = y[i] - y[j];
            if (ddx * ddx + ddy * ddy <= r2) dsu.unite(i, j);
          }
        }
    }
    std::map<int, int> sz;
    for (int i = 0; i < N; i++) sz[dsu.find(i)]++;
    int best = 0;
    for (auto& kv : sz) best = std::max(best, kv.second);
    if (!first) emit(",");
    first = false;
    emit("{\"r\":" + d2s(r) + ",\"lambda\":" + d2s(N * 3.14159265358979323846 * r * r) + ",\"smax\":" +
         d2s((double)best / N) + "}");
  }
  emit("]}");
}

int main() {
  Rng rng(20241112u);
  emit("{");
  exp_crossing(rng);
  exp_torus(rng);
  exp_psi(rng);
  exp_cardy(rng);
  exp_cluster_hist(rng);
  exp_network(rng);
  exp_interdependent(rng);
  exp_kcore(rng);
  exp_continuum(rng);
  emit("}\n");
  std::fwrite(out.data(), 1, out.size(), stdout);
  return 0;
}
