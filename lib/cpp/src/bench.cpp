// Small benchmark suite for the C++ edition.  Prints one JSON object to
// stdout:
//
// {"lattice":{"L":256,"p":0.5,"samples":200,"crossing":...,"seconds":...},
//  "newman_ziff":{"L":512,"m":...,"seconds":...},
//  "network":{"N":200000,"mean":4,"largest":...,"seconds":...}}
//
// Timings are wall-clock seconds from std::chrono::steady_clock and cover
// only the computation described by each section.

#include <percolation_atlas/atlas.hpp>

#include <chrono>
#include <cstddef>
#include <iomanip>
#include <iostream>

namespace {

using Clock = std::chrono::steady_clock;

double elapsed_seconds(Clock::time_point start, Clock::time_point stop) {
  return std::chrono::duration<double>(stop - start).count();
}

}  // namespace

int main() {
  using atlas::Mode;

  // --- Bernoulli bond percolation on an open 256 x 256 square ------------
  const atlas::Lattice lattice = atlas::build_lattice("square", 256);
  atlas::Percolation model(lattice, Mode::Bond);
  atlas::Rng lattice_rng(7);
  constexpr int kLatticeSamples = 200;
  int crossing_hits = 0;
  const Clock::time_point lattice_start = Clock::now();
  for (int s = 0; s < kLatticeSamples; ++s) {
    model.sample(0.5, lattice_rng);
    if (model.crosses_lr()) ++crossing_hits;
  }
  const double lattice_seconds = elapsed_seconds(lattice_start, Clock::now());
  const double crossing = static_cast<double>(crossing_hits) / kLatticeSamples;

  // --- Newman-Ziff sweep on a 512 x 512 torus ----------------------------
  const atlas::Lattice nz_lattice = atlas::build_lattice("square", 512, true);
  atlas::Rng nz_rng(7);
  const Clock::time_point nz_start = Clock::now();
  const atlas::NewmanZiffResult nz = atlas::newman_ziff(nz_lattice, nz_rng, 400);
  const double nz_seconds = elapsed_seconds(nz_start, Clock::now());

  // --- Configuration-model network --------------------------------------
  constexpr int kNetworkN = 200000;
  atlas::Rng network_rng(11);
  const Clock::time_point network_start = Clock::now();
  const std::vector<int> degrees =
      atlas::poisson_degrees(kNetworkN, 4.0, network_rng);
  const atlas::Graph graph = atlas::configuration_model(degrees, network_rng);
  const atlas::Components network_components =
      atlas::components(graph, atlas::all_active(kNetworkN));
  const double network_seconds = elapsed_seconds(network_start, Clock::now());

  std::cout << std::setprecision(9)
            << "{\"lattice\":{\"L\":" << lattice.L << ",\"p\":0.5,\"samples\":"
            << kLatticeSamples << ",\"crossing\":" << crossing
            << ",\"seconds\":" << lattice_seconds << "},"
            << "\"newman_ziff\":{\"L\":" << nz_lattice.L << ",\"m\":" << nz.m
            << ",\"seconds\":" << nz_seconds << "},"
            << "\"network\":{\"N\":" << kNetworkN << ",\"mean\":4,\"largest\":"
            << network_components.largest << ",\"seconds\":" << network_seconds
            << "}}\n";
  return 0;
}
