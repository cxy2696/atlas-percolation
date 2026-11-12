# The shared random number generator

Every implementation in `lib/` (C++, Julia, JavaScript, Python) must produce
the **same** random stream for the same seed.  That is what makes the
cross-language parity tests meaningful: a Monte Carlo estimate computed in
Julia and in C++ is not merely statistically compatible, it is the same
sample path, so any difference larger than floating-point rounding is a bug.

## Generator

xoshiro128\*\* by David Blackman and Sebastiano Vigna (2018), seeded with
SplitMix32.  Only 32-bit integer operations are used, so the stream is
independent of language-level integer width and of `double` rounding modes.

State: four unsigned 32-bit words `s0, s1, s2, s3`.

```
result = rotl(s1 * 5, 7) * 9
t      = s1 << 9
s2    ^= s0
s3    ^= s1
s1    ^= s2
s0    ^= s3
s2    ^= t
s3     = rotl(s3, 11)
return result
```

All multiplications, shifts and additions are modulo 2^32.  `rotl(x, k)` is
`((x << k) | (x >> (32 - k)))` on unsigned 32-bit words.

## Seeding

```
x = seed mod 2^32
repeat four times:
    x = (x + 0x9E3779B9) mod 2^32
    z = x
    z = ((z XOR (z >> 16)) * 0x21F0AAAD) mod 2^32
    z = ((z XOR (z >> 15)) * 0x735A2D97) mod 2^32
    z =  z XOR (z >> 15)
    emit z
s0..s3 = the four emitted words
if all four words are zero: s0 = 1
```

## Uniform doubles

`random()` consumes **two** 32-bit outputs:

```
a = next() >> 6      # 26 bits
b = next() >> 5      # 27 bits
u = (a * 2^27 + b) / 2^53
```

`u` is an exact multiple of 2^-53 in `[0, 1)`.  No language-specific
`float()` conversion of a 64-bit integer is involved, which keeps the result
bit-identical everywhere.

## Uniform integers

`int(n)` for `n >= 1` uses rejection sampling so that the result is exactly
uniform:

```
limit = floor(2^32 / n) * n
do { r = next() } while (r >= limit)
return r mod n
```

## Fixed consumption order

Observables depend on the order in which uniforms are drawn.  The contract is:

| routine | uniforms consumed |
|---|---|
| site percolation sample | `n` uniforms, sites `0..n-1` |
| bond percolation sample | `m` uniforms, edges in generator order |
| configuration model | one shuffle of the stub array |
| continuum model | `2n` uniforms, x then y for each point |

Changing this order is a breaking change and requires new golden vectors.

## Golden vectors

`data/golden/rng-seed42.json` contains, for seed 42: the first eight doubles,
the first eight `int(10)` draws, the sum of the first 10 000 raw 32-bit
outputs modulo 2^32, and the 32-bit FNV-1a hash of those outputs.  Every
language test suite must reproduce all four.

Reference values:

```
doubles[0] = 0.15377165154351735
doubles[1] = 0.018084544121180213
ints[0..7] = 1 2 6 3 6 7 4 6
u32_sum    = 839333524
fnv1a      = 3108118429
```

## Why not use the language's native RNG?

Because then "the same seed" would mean four different sample paths, and the
parity tests would have to be statistical.  With a shared stream, we can test
the *algorithms* (union-find, cluster bookkeeping, cascade order) exactly,
which is where the real bugs live.  Production users who simply want speed
may switch to `numpy.random.Generator`, Julia's `Xoshiro`, or C++'s
`std::mt19937_64` — those paths are provided as an option, but they are not
covered by the golden vectors.
