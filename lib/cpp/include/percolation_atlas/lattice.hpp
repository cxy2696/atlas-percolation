// Lattice generators, matching lib/js/engine/lattice.js and
// lib/python/percolation_atlas/lattice.py.
//
//   square      : E, S                    (degree 4)
//   triangular  : E, S, SW                (degree 6)
//   honeycomb   : brick-wall embedding, alternating horizontal rungs and
//                 vertical struts        (degree 3, requires even L)
//
// Sites are numbered i*L + j, row-major.  Every undirected edge is emitted
// once, in row-major site order (E then S then SW for triangular; rung then
// strut for honeycomb).  With torus=true the edge that would leave the box is
// wrapped; with torus=false it is omitted.  In particular, the triangular SW
// edge must NOT wrap at column 0 when torus=false.

#pragma once

#include <cstdint>
#include <limits>
#include <map>
#include <stdexcept>
#include <string>
#include <string_view>
#include <utility>
#include <vector>

namespace atlas {

inline constexpr std::string_view LATTICE_KINDS[] = {"square", "triangular", "honeycomb"};

inline constexpr std::uint8_t ETYPE_E = 0;
inline constexpr std::uint8_t ETYPE_S = 1;
inline constexpr std::uint8_t ETYPE_SW = 2;

struct Point {
  double x = 0.0;
  double y = 0.0;
};

struct Lattice {
  std::string kind;
  int L = 0;
  bool torus = false;
  int n = 0;
  int m = 0;
  std::vector<int> eu;
  std::vector<int> ev;
  std::vector<std::uint8_t> etype;

  // Geometric position of site v in a unit box, for rendering.
  Point position(int v) const {
    const int i = v / L;
    const int j = v % L;
    if (kind == "honeycomb") {
      return Point{(j + 0.5 * (i % 2)) / static_cast<double>(L),
                   static_cast<double>(i) / L};
    }
    if (kind == "triangular") {
      return Point{(j + 0.5 * i) / static_cast<double>(L),
                   (i * 0.8660254037844386) / static_cast<double>(L)};
    }
    return Point{static_cast<double>(j) / L, static_cast<double>(i) / L};
  }
};

inline Lattice build_lattice(std::string_view kind, int L, bool torus = false) {
  if (kind != "square" && kind != "triangular" && kind != "honeycomb") {
    throw std::invalid_argument("unknown lattice: " + std::string(kind));
  }
  if (L < 1) throw std::invalid_argument("lattice L must be positive");
  if (kind == "honeycomb" && L % 2 != 0) {
    throw std::invalid_argument("honeycomb needs even L");
  }
  // The edge count fits in int for every lattice we can represent.  m <= 3n.
  if (static_cast<long long>(L) * L > std::numeric_limits<int>::max() / 3) {
    throw std::invalid_argument("lattice too large");
  }

  const int n = L * L;
  std::vector<int> eu;
  std::vector<int> ev;
  std::vector<std::uint8_t> etype;
  eu.reserve(static_cast<std::size_t>(n) * 2);
  ev.reserve(static_cast<std::size_t>(n) * 2);
  etype.reserve(static_cast<std::size_t>(n) * 2);

  const auto idx = [L](int i, int j) {
    i = ((i % L) + L) % L;
    j = ((j % L) + L) % L;
    return i * L + j;
  };
  const auto push = [&eu, &ev, &etype](int a, int b, std::uint8_t t) {
    eu.push_back(a);
    ev.push_back(b);
    etype.push_back(t);
  };

  for (int i = 0; i < L; ++i) {
    for (int j = 0; j < L; ++j) {
      const int v = i * L + j;
      if (kind == "honeycomb") {
        // Horizontal rung: row i even -> j even; row i odd -> j odd.
        if ((i + j) % 2 == 0 && (j + 1 < L || torus)) {
          push(v, idx(i, j + 1), ETYPE_E);
        }
        // Vertical strut, present at every site.
        if (i + 1 < L || torus) push(v, idx(i + 1, j), ETYPE_S);
        continue;
      }
      // E
      if (j + 1 < L || torus) push(v, idx(i, j + 1), ETYPE_E);
      // S
      if (i + 1 < L || torus) push(v, idx(i + 1, j), ETYPE_S);
      // SW (triangular only): to row i+1, column j-1.  Open boundaries omit
      // the edge at column 0; it must not wrap.
      if (kind == "triangular" && (i + 1 < L || torus) && (j - 1 >= 0 || torus)) {
        push(v, idx(i + 1, j - 1), ETYPE_SW);
      }
    }
  }

  Lattice lat;
  lat.kind = std::string(kind);
  lat.L = L;
  lat.torus = torus;
  lat.n = n;
  lat.m = static_cast<int>(eu.size());
  lat.eu = std::move(eu);
  lat.ev = std::move(ev);
  lat.etype = std::move(etype);
  return lat;
}

struct DegreeHistogram {
  std::vector<int> degree;
  std::map<int, int> hist;  // degree -> number of vertices, ascending degree
};

inline DegreeHistogram degree_histogram(const Lattice& lat) {
  DegreeHistogram out;
  out.degree.assign(static_cast<std::size_t>(lat.n), 0);
  for (int e = 0; e < lat.m; ++e) {
    ++out.degree[static_cast<std::size_t>(lat.eu[e])];
    ++out.degree[static_cast<std::size_t>(lat.ev[e])];
  }
  for (const int d : out.degree) ++out.hist[d];
  return out;
}

}  // namespace atlas
