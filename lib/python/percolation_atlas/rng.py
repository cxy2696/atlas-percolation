"""xoshiro128** with SplitMix32 seeding — see docs/RNG.md.

The implementation uses Python integers masked to 32 bits, which reproduces
the unsigned 32-bit arithmetic of the C++/Julia/JavaScript versions exactly.
"""

from __future__ import annotations

MASK = 0xFFFFFFFF
GOLDEN = 0x9E3779B9


def _rotl(x: int, k: int) -> int:
    x &= MASK
    return ((x << k) | (x >> (32 - k))) & MASK


def _mix32(z: int) -> int:
    z = ((z ^ (z >> 16)) * 0x21F0AAAD) & MASK
    z = ((z ^ (z >> 15)) * 0x735A2D97) & MASK
    return (z ^ (z >> 15)) & MASK


class Rng:
    """Deterministic random stream shared by all four implementations."""

    __slots__ = ("s", "_spare")

    def __init__(self, seed: int = GOLDEN):
        self._spare = None
        self.seed(seed)

    def seed(self, seed: int) -> "Rng":
        x = seed & MASK
        s = []
        for _ in range(4):
            x = (x + GOLDEN) & MASK
            s.append(_mix32(x))
        if (s[0] | s[1] | s[2] | s[3]) == 0:
            s[0] = 1
        self.s = s
        self._spare = None
        return self

    def u32(self) -> int:
        s = self.s
        result = (_rotl((s[1] * 5) & MASK, 7) * 9) & MASK
        t = (s[1] << 9) & MASK
        s[2] ^= s[0]
        s[3] ^= s[1]
        s[1] ^= s[2]
        s[0] ^= s[3]
        s[2] ^= t
        s[3] = _rotl(s[3], 11)
        return result

    def random(self) -> float:
        a = self.u32() >> 6
        b = self.u32() >> 5
        return (a * 134217728 + b) / 9007199254740992.0

    def int(self, n: int) -> int:
        if n <= 1:
            return 0
        if n > 4294967296:
            raise ValueError("int(n) requires n <= 2^32")
        limit = (4294967296 // n) * n
        while True:
            r = self.u32()
            if r < limit:
                return r % n

    def bernoulli(self, p: float) -> bool:
        return self.random() < p

    def shuffle(self, a):
        for i in range(len(a) - 1, 0, -1):
            j = self.int(i + 1)
            a[i], a[j] = a[j], a[i]
        return a

    def normal(self) -> float:
        """Standard normal via Marsaglia polar Box-Muller.

        The cached spare and the rejection loop must match the other three
        implementations, otherwise a program that draws normals consumes a
        different random stream (JS/C++/Julia use the same polar method).
        """
        import math

        if self._spare is not None:
            value = self._spare
            self._spare = None
            return value
        while True:
            u = 2.0 * self.random() - 1.0
            v = 2.0 * self.random() - 1.0
            s = u * u + v * v
            if 0.0 < s < 1.0:
                m = math.sqrt(-2.0 * math.log(s) / s)
                self._spare = v * m
                return u * m
