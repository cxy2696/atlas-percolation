# Bernoulli percolation: union-find, cluster statistics, Newman-Ziff sweep.
#
# Public site/edge indices are 0-based, matching docs/API.md and the other
# implementations.  The Dsu arrays themselves are 1-based internally.

"""
    Dsu(n)

Disjoint-set union with path compression and union by size.  `find(d, v)` and
`union!(d, a, b)` use 0-based vertex indices; the internal arrays are 1-based.
"""
mutable struct Dsu
    n::Int
    parent::Vector{Int32}
    size::Vector{Int32}
    count::Int
    max_size::Int

    function Dsu(n::Integer)
        n >= 0 || throw(ArgumentError("n must be non-negative"))
        nn = Int(n)
        return new(nn, collect(Int32, 1:nn), ones(Int32, nn), nn, nn > 0 ? 1 : 0)
    end
end

function reset!(d::Dsu)
    @inbounds for i in 1:d.n
        d.parent[i] = Int32(i)
        d.size[i] = Int32(1)
    end
    d.count = d.n
    d.max_size = d.n > 0 ? 1 : 0
    return d
end

# Internal 1-based find with full path compression (as in the JS reference).
@inline function _find(d::Dsu, x::Int)
    p = d.parent
    r = x
    @inbounds while Int(p[r]) != r
        r = Int(p[r])
    end
    @inbounds while Int(p[x]) != r
        nxt = Int(p[x])
        p[x] = Int32(r)
        x = nxt
    end
    return r
end

@inline function _union_roots!(d::Dsu, ra::Int, rb::Int)
    ra == rb && return false
    sa = Int(d.size[ra])
    sb = Int(d.size[rb])
    if sa < sb
        ra, rb = rb, ra
        sa, sb = sb, sa
    end
    @inbounds d.parent[rb] = Int32(ra)
    @inbounds d.size[ra] = Int32(sa + sb)
    d.count -= 1
    if sa + sb > d.max_size
        d.max_size = sa + sb
    end
    return true
end

@inline function _union_find!(d::Dsu, a::Int, b::Int)
    ra = _find(d, a)
    rb = _find(d, b)
    ra == rb && return false
    return _union_roots!(d, ra, rb)
end

"""0-based `find` (returns a 0-based root)."""
@inline find(d::Dsu, v::Integer) = _find(d, Int(v) + 1) - 1

"""0-based union.  Returns `true` when two components were merged."""
@inline union!(d::Dsu, a::Integer, b::Integer) = _union_find!(d, Int(a) + 1, Int(b) + 1)

"""All 0-based roots, for diagnostics."""
function roots(d::Dsu)
    out = Int[]
    for v in 1:d.n
        _find(d, v) == v && push!(out, v - 1)
    end
    return out
end

"""Cluster statistics for one configuration."""
mutable struct ClusterStats
    count::Int
    max_size::Int
    sum::Int
    sum2::Int
    sizes::Vector{Int32}
    root_size::Vector{Int32}
    touched::Vector{Int32}
    stamp::Vector{Int32}
    gen::Int

    function ClusterStats(n::Integer)
        nn = Int(n)
        return new(0, 0, 0, 0, Int32[],
                   zeros(Int32, nn), zeros(Int32, nn), zeros(Int32, nn), 0)
    end
end

"""Recompute cluster statistics from `dsu` and the occupancy mask."""
function compute!(st::ClusterStats, dsu::Dsu, occ::AbstractVector{UInt8})
    n = dsu.n
    root_size = st.root_size
    touched = st.touched
    nt = 0
    @inbounds for v in 1:n
        if occ[v] != 0
            r = _find(dsu, v)
            s = Int(root_size[r])
            if s == 0
                nt += 1
                touched[nt] = Int32(r)
            end
            root_size[r] = Int32(s + 1)
        end
    end

    sizes = st.sizes
    resize!(sizes, nt)
    count = 0
    maxs = 0
    total = 0
    total2 = 0
    @inbounds for k in 1:nt
        r = Int(touched[k])
        s = Int(root_size[r])
        root_size[r] = Int32(0)
        sizes[k] = Int32(s)
        count += 1
        total += s
        total2 += s * s
        if s > maxs
            maxs = s
        end
    end
    sort!(sizes; rev = true)

    st.count = count
    st.max_size = maxs
    st.sum = total
    st.sum2 = total2
    return st
end

"""Susceptibility proxy `sum |C|^2 / sum |C|`."""
chi2(st::ClusterStats) = st.sum > 0 ? st.sum2 / st.sum : 0.0

"""Largest cluster as a fraction of occupied sites."""
max_fraction(st::ClusterStats) = st.sum > 0 ? st.max_size / st.sum : 0.0

"""Mean cluster size."""
mean_size(st::ClusterStats) = st.count > 0 ? st.sum / st.count : 0.0

"""
    Percolation(lattice, mode="bond")

Site (`mode="site"`) or bond (`mode="bond"`) percolation model.  `sample`
draws a fresh configuration; `build` builds the union-find forest; `analyze`
computes cluster statistics.
"""
mutable struct Percolation
    lat::Lattice
    mode::Symbol
    occ::Vector{UInt8}
    open::Vector{UInt8}
    dsu::Dsu
    stats::ClusterStats
    dirty::Bool
end

function Percolation(lat::Lattice, mode::Union{AbstractString,Symbol})
    sym = mode isa Symbol ? mode : Symbol(mode)
    sym === :bond || sym === :site || throw(ArgumentError("bad mode $mode"))
    occ = ones(UInt8, lat.n)
    open = ones(UInt8, lat.m)
    return Percolation(lat, sym, occ, open, Dsu(lat.n), ClusterStats(lat.n), true)
end

Percolation(lat::Lattice; mode::Union{AbstractString,Symbol} = "bond") =
    Percolation(lat, mode)

"""
    sample!(model, p, rng)

Draw a fresh configuration.  Site mode consumes `n` uniforms in site order,
bond mode consumes `m` uniforms in edge order.  Returns `model`.
"""
function sample!(m::Percolation, p::Real, rng::Rng)
    pf = Float64(p)
    if m.mode === :site
        occ = m.occ
        @inbounds for v in 1:m.lat.n
            occ[v] = random(rng) < pf ? 0x01 : 0x00
        end
        fill!(m.open, 0x01)
    else
        fill!(m.occ, 0x01)
        open = m.open
        @inbounds for e in 1:m.lat.m
            open[e] = random(rng) < pf ? 0x01 : 0x00
        end
    end
    m.dirty = true
    return m
end

"""Non-mutating-name alias for [`sample!`](@ref)."""
sample(m::Percolation, p::Real, rng::Rng) = sample!(m, p, rng)

"""Build the union-find forest for the current configuration."""
function build!(m::Percolation)
    dsu = m.dsu
    reset!(dsu)
    lat = m.lat
    occ = m.occ
    open = m.open
    eu = lat.eu
    ev = lat.ev
    if m.mode === :site
        active = 0
        @inbounds for v in 1:lat.n
            active += Int(occ[v])
        end
        dsu.count = active
        @inbounds for e in 1:lat.m
            a = Int(eu[e]) + 1
            b = Int(ev[e]) + 1
            if occ[a] != 0 && occ[b] != 0
                _union_find!(dsu, a, b)
            end
        end
    else
        @inbounds for e in 1:lat.m
            if open[e] != 0
                _union_find!(dsu, Int(eu[e]) + 1, Int(ev[e]) + 1)
            end
        end
    end
    m.dirty = false
    return dsu
end

"""Non-mutating-name alias for [`build!`](@ref)."""
build(m::Percolation) = build!(m)

@inline function ensure_built!(m::Percolation)
    m.dirty && build!(m)
    return m.dsu
end

"""Build and compute cluster statistics; returns the `ClusterStats`."""
function analyze!(m::Percolation)
    build!(m)
    return compute!(m.stats, m.dsu, m.occ)
end

"""Non-mutating-name alias for [`analyze!`](@ref)."""
analyze(m::Percolation) = analyze!(m)

"""Does some occupied cluster join the left and right boundaries?"""
function crosses_lr(m::Percolation)
    ensure_built!(m)
    dsu = m.dsu
    st = m.stats
    stamp = st.stamp
    occ = m.occ
    L = m.lat.L
    st.gen += 1
    gen = st.gen
    @inbounds for i in 0:(L - 1)
        v = i * L
        if occ[v + 1] != 0
            stamp[_find(dsu, v + 1)] = gen
        end
    end
    @inbounds for i in 0:(L - 1)
        v = i * L + L - 1
        if occ[v + 1] != 0 && Int(stamp[_find(dsu, v + 1)]) == gen
            return true
        end
    end
    return false
end

"""Does some occupied cluster join the top and bottom boundaries?"""
function crosses_tb(m::Percolation)
    ensure_built!(m)
    dsu = m.dsu
    st = m.stats
    stamp = st.stamp
    occ = m.occ
    L = m.lat.L
    st.gen += 1
    gen = st.gen
    @inbounds for j in 0:(L - 1)
        if occ[j + 1] != 0
            stamp[_find(dsu, j + 1)] = gen
        end
    end
    @inbounds for j in 0:(L - 1)
        v = (L - 1) * L + j
        if occ[v + 1] != 0 && Int(stamp[_find(dsu, v + 1)]) == gen
            return true
        end
    end
    return false
end

"""
    newman_ziff(lattice, rng; checkpoints=400)

One random edge order yields the whole bond-percolation curve on the grid
`k/m`: `p`, `smax`, `chi2 = sum|C|^2 / n` and `nclusters`, sampled every
`max(1, m ÷ checkpoints)` steps and at the final step.
"""
function newman_ziff(lat::Lattice, rng::Rng; checkpoints::Integer = 400)
    checkpoints >= 1 || throw(ArgumentError("checkpoints must be positive"))
    m = lat.m
    order = Vector{Int32}(undef, m)
    @inbounds for e in 1:m
        order[e] = Int32(e - 1)
    end
    shuffle!(rng, order)

    n = lat.n
    dsu = Dsu(n)
    total2 = n
    every = max(1, m ÷ Int(checkpoints))
    cap = m == 0 ? 0 : min(m, Int(checkpoints) + 1)
    ps = Float64[]
    smax = Int[]
    chis = Float64[]
    ncl = Int[]
    sizehint!(ps, cap)
    sizehint!(smax, cap)
    sizehint!(chis, cap)
    sizehint!(ncl, cap)

    eu = lat.eu
    ev = lat.ev
    @inbounds for k in 1:m
        e0 = Int(order[k])
        a = _find(dsu, Int(eu[e0 + 1]) + 1)
        b = _find(dsu, Int(ev[e0 + 1]) + 1)
        if a != b
            sa = Int(dsu.size[a])
            sb = Int(dsu.size[b])
            _union_roots!(dsu, a, b)
            total2 += 2 * sa * sb
        end
        if k % every == 0 || k == m
            push!(ps, k / m)
            push!(smax, dsu.max_size)
            push!(chis, total2 / n)
            push!(ncl, dsu.count)
        end
    end
    return (p = ps, smax = smax, chi2 = chis, nclusters = ncl, m = m, n = n)
end

newman_ziff(lat::Lattice, rng::Rng, checkpoints::Integer) =
    newman_ziff(lat, rng; checkpoints = checkpoints)

"""Cluster-size histogram at a fixed `p` over `samples` configurations."""
function cluster_size_distribution(lat::Lattice, p::Real, rng::Rng;
                                   mode::Union{AbstractString,Symbol} = "bond",
                                   samples::Integer = 1)
    samples >= 0 || throw(ArgumentError("samples must be non-negative"))
    model = Percolation(lat, mode)
    hist = Dict{Int,Int}()
    for _ in 1:Int(samples)
        sample!(model, p, rng)
        analyze!(model)
        for s in model.stats.sizes
            hist[Int(s)] = get(hist, Int(s), 0) + 1
        end
    end
    return hist
end
