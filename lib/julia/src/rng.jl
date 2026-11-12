# xoshiro128** with SplitMix32 seeding -- see docs/RNG.md.
#
# All arithmetic is performed on UInt32 words (Julia's unsigned `+`, `*` and
# `<<` wrap modulo 2^32), so the stream is bit-identical to the C++, Python
# and JavaScript implementations.  Consumption order is part of the public
# contract: random() draws two words, int(n) uses rejection sampling.

const RNG_GOLDEN = 0x9e3779b9 % UInt32
const RNG_MIX_A  = 0x21f0aaad % UInt32
const RNG_MIX_B  = 0x735a2d97 % UInt32

@inline rotl32(x::UInt32, k::Integer) = (x << k) | (x >> (32 - k))

@inline function mix32(z::UInt32)
    z = (z ⊻ (z >> 16)) * RNG_MIX_A
    z = (z ⊻ (z >> 15)) * RNG_MIX_B
    return z ⊻ (z >> 15)
end

"""
    Rng(seed = 0x9e3779b9)

Shared deterministic random stream (xoshiro128** seeded by SplitMix32).
"""
mutable struct Rng
    s0::UInt32
    s1::UInt32
    s2::UInt32
    s3::UInt32
    has_spare::Bool
    spare::Float64

    function Rng(seed::Integer = RNG_GOLDEN)
        r = new(0, 0, 0, 0, false, 0.0)
        seed!(r, seed)
        return r
    end
end

"""Reseed an existing `Rng` (the Box-Muller spare is cleared)."""
function seed!(r::Rng, seed::Integer)
    x = seed % UInt32
    s = Vector{UInt32}(undef, 4)
    @inbounds for i in 1:4
        x += RNG_GOLDEN
        s[i] = mix32(x)
    end
    if (s[1] | s[2] | s[3] | s[4]) == 0
        s[1] = UInt32(1)
    end
    r.s0, r.s1, r.s2, r.s3 = s[1], s[2], s[3], s[4]
    r.has_spare = false
    r.spare = 0.0
    return r
end

"""Raw 32-bit output (advances the state)."""
@inline function u32!(r::Rng)
    s0, s1, s2, s3 = r.s0, r.s1, r.s2, r.s3
    result = rotl32(s1 * UInt32(5), 7) * UInt32(9)
    t = s1 << 9
    s2 ⊻= s0
    s3 ⊻= s1
    s1 ⊻= s2
    s0 ⊻= s3
    s2 ⊻= t
    s3 = rotl32(s3, 11)
    r.s0, r.s1, r.s2, r.s3 = s0, s1, s2, s3
    return result
end

"""
    random(rng)

Uniform `Float64` in `[0, 1)` with 53 bits of resolution, using two 32-bit
draws (26 + 27 bits).  Every result is an exact multiple of 2^-53.
"""
@inline function random(r::Rng)
    a = u32!(r) >> 6   # 26 bits
    b = u32!(r) >> 5   # 27 bits
    return (Float64(a) * 134217728.0 + Float64(b)) / 9007199254740992.0
end

"""Uniform integer in `[0, n)` for `n >= 1`, via rejection sampling."""
function int(r::Rng, n::Integer)
    n <= 1 && return 0
    n <= (Int64(1) << 32) || throw(ArgumentError("int(n) requires n <= 2^32"))
    limit = (UInt64(1) << 32) ÷ UInt64(n) * UInt64(n)
    @inbounds while true
        x = u32!(r)
        if UInt64(x) < limit
            return Int(UInt64(x) % UInt64(n))
        end
    end
end

"""True with probability `p` (one `random()` draw)."""
@inline bernoulli(r::Rng, p::Real) = random(r) < p

"""
    shuffle!(rng, a)

In-place Fisher-Yates shuffle, walking downwards exactly as the reference
implementations do.
"""
function shuffle!(r::Rng, a::AbstractVector)
    @inbounds for i in length(a):-1:2
        j = int(r, i) + 1
        a[i], a[j] = a[j], a[i]
    end
    return a
end

"""Standard normal via polar Box-Muller (cached spare, as in the JS engine)."""
function normal(r::Rng)
    if r.has_spare
        r.has_spare = false
        return r.spare
    end
    while true
        u = 2.0 * random(r) - 1.0
        v = 2.0 * random(r) - 1.0
        s = u * u + v * v
        if s < 1.0 && s != 0.0
            m = sqrt(-2.0 * log(s) / s)
            r.spare = v * m
            r.has_spare = true
            return u * m
        end
    end
end

"""Return a snapshot of the four state words (diagnostics/replay)."""
state(r::Rng) = (r.s0, r.s1, r.s2, r.s3)

"""Restore a state produced by [`state`](@ref)."""
function load_state!(r::Rng, s::NTuple{4,UInt32})
    r.s0, r.s1, r.s2, r.s3 = s
    r.has_spare = false
    r.spare = 0.0
    return r
end

"""
    rng_test(seed = 42)

Reproduce the four golden probes for `seed` and return them as a named tuple.
With the default seed the result is exactly the contents of
`data/golden/rng-seed42.json`.
"""
function rng_test(seed::Integer = 42)
    r = Rng(seed)
    doubles = [random(r) for _ in 1:8]

    r = Rng(seed)
    ints = [int(r, 10) for _ in 1:8]

    r = Rng(seed)
    total = UInt32(0)
    h = UInt32(2166136261)
    @inbounds for _ in 1:10000
        v = u32!(r)
        total += v
        h = (h ⊻ v) * UInt32(16777619)
    end
    return (doubles = doubles,
            ints_mod_10 = ints,
            u32_sum = Int(total),
            fnv1a = Int(h))
end
