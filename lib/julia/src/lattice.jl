# Lattice generators -- see docs/API.md.
#
# Square      : E, S                              (degree 4)
# Triangular  : E, S, SW                          (degree 6)
# Honeycomb   : brick-wall embedding, alternating
#               horizontal rungs + vertical struts (degree 3)
#
# Each undirected edge is listed once in row-major (i outer, j inner) order.
# Site indices are 0-based: v = i*L + j.  The public endpoint arrays `eu`,
# `ev` and the edge-type array `etype` therefore hold 0-based indices.

const LATTICE_KINDS = (:square, :triangular, :honeycomb)

"""
    Lattice

A lattice with `n = L*L` sites and `m` edges.  `eu[e]`/`ev[e]` are 0-based
endpoints, `etype[e]` is 0 (E/rung), 1 (S) or 2 (SW, triangular only).
"""
struct Lattice
    kind::Symbol
    L::Int
    torus::Bool
    n::Int
    m::Int
    eu::Vector{Int32}
    ev::Vector{Int32}
    etype::Vector{UInt8}
end

@inline _latidx(L::Int, i::Int, j::Int) = mod(i, L) * L + mod(j, L)

"""
    build_lattice(kind, L; torus=false)
    build_lattice(kind, L, torus)

Build a `square`, `triangular` or `honeycomb` lattice.  Honeycomb requires
an even `L`.  Open boundaries omit edges that would leave the box; `torus`
wraps them instead (the triangular SW edge never wraps when `torus=false`).
"""
function build_lattice(kind::Union{AbstractString,Symbol}, L::Integer; torus::Bool = false)
    k = kind isa Symbol ? kind : Symbol(kind)
    k in LATTICE_KINDS || throw(ArgumentError("unknown lattice: $kind"))
    L >= 1 || throw(ArgumentError("L must be positive"))
    if k === :honeycomb && isodd(L)
        throw(ArgumentError("honeycomb needs even L"))
    end
    L = Int(L)
    n = L * L
    n <= typemax(Int32) || throw(ArgumentError("L is too large for Int32 site indices"))

    if k === :square
        cap = torus ? 2 * n : 2 * L * (L - 1)
    elseif k === :triangular
        cap = torus ? 3 * n : 3 * L * L - 4 * L + 1
    else
        cap = 3 * (n ÷ 2)
    end
    eu = Int32[]
    ev = Int32[]
    etype = UInt8[]
    sizehint!(eu, cap)
    sizehint!(ev, cap)
    sizehint!(etype, cap)

    @inbounds for i in 0:(L - 1)
        for j in 0:(L - 1)
            v = i * L + j
            if k === :honeycomb
                # horizontal rung: row i even -> j even; row i odd -> j odd
                if iseven(i + j) && (j + 1 < L || torus)
                    push!(eu, Int32(v))
                    push!(ev, Int32(_latidx(L, i, j + 1)))
                    push!(etype, 0x00)
                end
                # vertical strut, present at every site
                if i + 1 < L || torus
                    push!(eu, Int32(v))
                    push!(ev, Int32(_latidx(L, i + 1, j)))
                    push!(etype, 0x01)
                end
                continue
            end
            # E
            if j + 1 < L || torus
                push!(eu, Int32(v))
                push!(ev, Int32(_latidx(L, i, j + 1)))
                push!(etype, 0x00)
            end
            # S
            if i + 1 < L || torus
                push!(eu, Int32(v))
                push!(ev, Int32(_latidx(L, i + 1, j)))
                push!(etype, 0x01)
            end
            # SW (triangular only).  Open boundaries: the edge is absent at
            # column 0 -- it must not wrap to column L-1.
            if k === :triangular && (i + 1 < L || torus) && (j - 1 >= 0 || torus)
                push!(eu, Int32(v))
                push!(ev, Int32(_latidx(L, i + 1, j - 1)))
                push!(etype, 0x02)
            end
        end
    end

    m = length(eu)
    return Lattice(k, L, torus, n, m, eu, ev, etype)
end

build_lattice(kind::Union{AbstractString,Symbol}, L::Integer, torus::Bool) =
    build_lattice(kind, L; torus = torus)

"""Geometric position of 0-based site `v` in the unit box `(x, y)`."""
function lattice_position(lat::Lattice, v::Integer)
    i = Int(v) ÷ lat.L
    j = Int(v) % lat.L
    L = lat.L
    if lat.kind === :honeycomb
        return ((j + 0.5 * (i % 2)) / L, i / L)
    elseif lat.kind === :triangular
        return ((j + 0.5 * i) / L, (i * 0.8660254037844386) / L)
    else
        return (j / L, i / L)
    end
end

"""
    degree_histogram(lat)

Return `(deg, hist)` where `deg[v+1]` is the degree of 0-based site `v` and
`hist` is a sorted vector of `degree => count` pairs.
"""
function degree_histogram(lat::Lattice)
    deg = zeros(Int32, lat.n)
    @inbounds for e in 1:lat.m
        deg[Int(lat.eu[e]) + 1] += Int32(1)
        deg[Int(lat.ev[e]) + 1] += Int32(1)
    end
    counts = Dict{Int,Int}()
    @inbounds for d in deg
        counts[Int(d)] = get(counts, Int(d), 0) + 1
    end
    hist = sort!([k => v for (k, v) in counts]; by = first)
    return (deg = deg, hist = hist)
end

"""Number of sites and edges (`n`, `m`) as a named tuple."""
lattice_size(lat::Lattice) = (n = lat.n, m = lat.m)
