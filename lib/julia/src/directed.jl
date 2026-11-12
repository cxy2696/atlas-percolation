# Directed percolation on an L x L square lattice.
#
# Edges point east (E) and south (S).  Bond mode opens every E/S edge with
# probability p; site mode occupies every site with probability p and treats
# all E/S edges between occupied sites as open.  Reachability is a row-major
# DP, O(L^2).  RNG consumption matches the undirected sampler: n uniforms for
# site mode, m for bond mode, in lattice order.

struct DirectedResult
    cross::Bool
    site::Bool
    reach::Vector{UInt8}
    open::Vector{UInt8}
    occ::Vector{UInt8}
    m::Int
    n::Int
end

"""
    directed_crossing(lat, p, rng; mode="bond")

Draw one directed configuration on a square `Lattice` and return a
`DirectedResult`.  `cross` is true when a directed path joins the left and
right boundaries.  `mode` is `"bond"` or `"site"`.
"""
function directed_crossing(lat::Lattice, p::Real, rng::Rng; mode::Union{AbstractString,Symbol} = "bond")
    lat.kind === :square || throw(ArgumentError("directed percolation needs the square lattice"))
    sym = mode isa Symbol ? mode : Symbol(mode)
    sym === :bond || sym === :site || throw(ArgumentError("bad mode $mode"))
    L = lat.L
    n = lat.n
    occ = fill(UInt8(1), n)
    open_edges = fill(UInt8(1), lat.m)
    if sym === :site
        @inbounds for v in 1:n
            occ[v] = random(rng) < p ? 0x01 : 0x00
        end
    else
        @inbounds for e in 1:lat.m
            open_edges[e] = random(rng) < p ? 0x01 : 0x00
        end
    end

    east = fill(-1, n)
    south = fill(-1, n)
    @inbounds for e in 1:lat.m
        a = Int(lat.eu[e])
        b = Int(lat.ev[e])
        if b == a + 1 && a ÷ L == b ÷ L
            east[a + 1] = e
        elseif b == a + L
            south[a + 1] = e
        end
    end

    reach = zeros(UInt8, n)
    cross = false
    @inbounds for i in 0:(L - 1)
        row = i * L
        for j in 0:(L - 1)
            v = row + j
            occ[v + 1] == 0 && continue
            r = j == 0
            if !r && j > 0
                e = east[(v - 1) + 1]
                if e >= 0 && reach[(v - 1) + 1] != 0 && open_edges[e] != 0
                    r = true
                end
            end
            if !r && i > 0
                e = south[(v - L) + 1]
                if e >= 0 && reach[(v - L) + 1] != 0 && open_edges[e] != 0
                    r = true
                end
            end
            reach[v + 1] = r ? 0x01 : 0x00
            if r && j == L - 1
                cross = true
            end
        end
    end
    return DirectedResult(cross, sym === :site, reach, open_edges, occ, lat.m, n)
end

"""Empirical left-right directed crossing probability over `samples` draws."""
function directed_crossing_rate(lat::Lattice, p::Real, rng::Rng; mode::Union{AbstractString,Symbol} = "bond", samples::Integer = 100)
    samples >= 1 || throw(ArgumentError("samples must be positive"))
    hits = 0
    for _ in 1:samples
        hits += directed_crossing(lat, p, rng; mode = mode).cross ? 1 : 0
    end
    return hits / samples
end

"""Boolean shortcut for [`directed_crossing`](@ref)."""
directed_crosses_lr(lat::Lattice, p::Real, rng::Rng; mode::Union{AbstractString,Symbol} = "bond") =
    directed_crossing(lat, p, rng; mode = mode).cross
