// xoshiro128** with SplitMix32 seeding -- see docs/RNG.md.
//
// Every arithmetic operation is performed on uint32_t, so the stream is
// independent of the host integer width and of floating-point rounding modes.
// random() consumes two 32-bit outputs (26 + 27 bits) and returns an exact
// multiple of 2^-53 in [0, 1).  next_int(n) is the C++ spelling of the
// reference int(n): rejection sampling against the largest multiple of n
// that is <= 2^32, then reduction mod n.  shuffle() is Fisher-Yates
// downwards, using the same draw sequence as the JavaScript/Python engines.

#pragma once

#include <cmath>
#include <cstddef>
#include <cstdint>
#include <utility>

namespace atlas {

class Rng {
 public:
  explicit Rng(std::uint32_t seed_value = 0x9E3779B9u) { seed(seed_value); }

  Rng& seed(std::uint32_t seed_value) {
    constexpr std::uint32_t kGolden = 0x9E3779B9u;
    std::uint32_t x = seed_value;
    for (int i = 0; i < 4; ++i) {
      x += kGolden;
      state_[i] = mix32(x);
    }
    if ((state_[0] | state_[1] | state_[2] | state_[3]) == 0) state_[0] = 1;
    has_spare_ = false;
    spare_ = 0.0;
    return *this;
  }

  // Raw 32-bit output.
  std::uint32_t u32() {
    const std::uint32_t result = rotl(state_[1] * 5u, 7) * 9u;
    const std::uint32_t t = state_[1] << 9;
    state_[2] ^= state_[0];
    state_[3] ^= state_[1];
    state_[1] ^= state_[2];
    state_[0] ^= state_[3];
    state_[2] ^= t;
    state_[3] = rotl(state_[3], 11);
    return result;
  }

  // Uniform double in [0, 1) with 53 bits of resolution.
  double random() {
    const std::uint64_t a = static_cast<std::uint64_t>(u32() >> 6);  // 26 bits
    const std::uint64_t b = static_cast<std::uint64_t>(u32() >> 5);  // 27 bits
    return static_cast<double>((a << 27) | b) / 9007199254740992.0;
  }

  // Uniform integer in [0, n), n >= 1.  Returns 0 for n <= 1.
  int next_int(int n) {
    if (n <= 1) return 0;
    const std::uint64_t limit = ((std::uint64_t{1} << 32) / static_cast<std::uint64_t>(n)) *
                                static_cast<std::uint64_t>(n);
    std::uint32_t r = 0;
    do {
      r = u32();
    } while (static_cast<std::uint64_t>(r) >= limit);
    return static_cast<int>(r % static_cast<std::uint32_t>(n));
  }

  bool bernoulli(double p) { return random() < p; }

  // In-place Fisher-Yates shuffle, downwards, matching the reference order.
  template <typename Container>
  Container& shuffle(Container& a) {
    for (std::size_t i = a.size(); i > 1; --i) {
      const std::size_t j = static_cast<std::size_t>(next_int(static_cast<int>(i)));
      using std::swap;
      swap(a[i - 1], a[j]);
    }
    return a;
  }

  // Standard normal via Marsaglia polar / Box-Muller (spare cached like the JS
  // engine).  Not covered by the golden vectors, but kept for API parity.
  double normal() {
    if (has_spare_) {
      has_spare_ = false;
      return spare_;
    }
    double u = 0.0;
    double v = 0.0;
    double s = 0.0;
    do {
      u = 2.0 * random() - 1.0;
      v = 2.0 * random() - 1.0;
      s = u * u + v * v;
    } while (s >= 1.0 || s == 0.0);
    const double m = std::sqrt((-2.0 * std::log(s)) / s);
    spare_ = v * m;
    has_spare_ = true;
    return u * m;
  }

 private:
  static constexpr std::uint32_t rotl(std::uint32_t x, int k) {
    return (x << k) | (x >> (32 - k));
  }

  static constexpr std::uint32_t mix32(std::uint32_t z) {
    z = (z ^ (z >> 16)) * 0x21F0AAADu;
    z = (z ^ (z >> 15)) * 0x735A2D97u;
    return z ^ (z >> 15);
  }

  std::uint32_t state_[4] = {0, 0, 0, 0};
  bool has_spare_ = false;
  double spare_ = 0.0;
};

}  // namespace atlas
