# Algorithm zoo: bootstrap, explosive (Achlioptas), invasion and Leath growth;
# exact percolation on trees and configuration models; Hoshen-Kopelman
# labelling.
#
# These routines are written against explicit arrays (neighbour lists, edge
# lists, threshold arrays) so that the same input can be run in every language
# without touching a random stream.  The random wrappers are thin layers over
# the same code and consume the shared xoshiro128** stream exactly as the
# Python and JavaScript references do.
#
# Public site/edge indices are 0-based, matching docs/API.md and the other
# implementations.  The union-find arrays remain 1-based internally.

# ---------------------------------------------------------------------------
# CSR neighbour lists
# ---------------------------------------------------------------------------

"""
    neighbours_from_edges(n, eu, ev)

Build a symmetric CSR neighbour list from an undirected edge list.

Returns a named tuple `(start, adj, edge_of, degree)`.  `start` has length
`n + 1`; the neighbours of 0-based site `v` occupy the 1-based slots
`start[v+1]+1:start[v+2]` of `adj`, and `edge_of[k]` is the 0-based edge that
produced adjacency slot `k`.  `degree[v+1]` is the degree of site `v`.
Endpoints `eu[e]`/`ev[e]` are 0-based.
"""
function neighbours_from_edges(n::Integer, eu::AbstractVector{<:Integer},
                               ev::AbstractVector{<:Integer})
    nn = Int(n)
    nn >= 0 || throw(ArgumentError("n must be non-negative"))
    m = length(eu)
    length(ev) == m || throw(ArgumentError("eu and ev must have the same length"))

    deg = zeros(Int32, nn)
    @inbounds for e in 1:m
        a = Int(eu[e])
        b = Int(ev[e])
        (0 <= a < nn && 0 <= b < nn) ||
            throw(ArgumentError("edge endpoint outside 0:n-1"))
        deg[a + 1] += Int32(1)
        deg[b + 1] += Int32(1)
    end

    start = zeros(Int32, nn + 1)
    @inbounds for v in 1:nn
        start[v + 1] = start[v] + deg[v]
    end

    pos = copy(start[1:nn])
    adj = Vector{Int32}(undef, 2 * m)
    edge_of = Vector{Int32}(undef, 2 * m)
    @inbounds for e in 1:m
        a = Int(eu[e])
        b = Int(ev[e])
        pa = Int(pos[a + 1]) + 1
        adj[pa] = Int32(b)
        edge_of[pa] = Int32(e - 1)
        pos[a + 1] += Int32(1)
        pb = Int(pos[b + 1]) + 1
        adj[pb] = Int32(a)
        edge_of[pb] = Int32(e - 1)
        pos[b + 1] += Int32(1)
    end
    return (start = start, adj = adj, edge_of = edge_of, degree = deg)
end

# ---------------------------------------------------------------------------
# Bootstrap percolation
# ---------------------------------------------------------------------------

"""
    bootstrap_activation(n, neighbours, initial, r)

Synchronous `r`-neighbour bootstrap percolation.

`neighbours` is the CSR tuple returned by [`neighbours_from_edges`](@ref);
`initial[v+1]` is nonzero when 0-based site `v` is active at time 0.  At each
round, every inactive site with at least `r` neighbours that were active in
the previous round activates simultaneously.  The queue implementation is the
least fixed point of this monotone closure and is independent of tie order.

Returns a named tuple `(active, time, rounds, active_count, fraction,
converged, max_degree)`.  `time[v+1]` is the activation round (`-1` if never),
`rounds[k]` is `(round, newly, cumulative)`, and `max_degree` is the largest
degree in the supplied graph.
"""
function bootstrap_activation(n::Integer, neighbours, initial, r::Integer)
    r >= 1 || throw(ArgumentError("bootstrap threshold r must be a positive integer"))
    nn = Int(n)
    nn >= 0 || throw(ArgumentError("n must be non-negative"))
    start = neighbours.start
    adj = neighbours.adj
    degree = neighbours.degree
    length(initial) == nn || throw(ArgumentError("initial must have length n"))

    active = zeros(UInt8, nn)
    time = fill(-1, nn)
    count = zeros(Int32, nn)
    active_count = 0
    @inbounds for v in 0:(nn - 1)
        if initial[v + 1] != 0
            active[v + 1] = 0x01
            time[v + 1] = 0
            active_count += 1
        end
    end

    # Seed the threshold counts from the initial active set.
    @inbounds for v in 0:(nn - 1)
        active[v + 1] == 0 && continue
        for k in (Int(start[v + 1]) + 1):Int(start[v + 2])
            u = Int(adj[k])
            if active[u + 1] == 0
                count[u + 1] += Int32(1)
            end
        end
    end

    pending = Int[]
    @inbounds for v in 0:(nn - 1)
        if active[v + 1] == 0 && Int(count[v + 1]) >= r
            push!(pending, v)
        end
    end

    rounds = NamedTuple[]
    t = 0
    while !isempty(pending)
        t += 1
        newly = 0
        @inbounds for v in pending
            if active[v + 1] == 0
                active[v + 1] = 0x01
                time[v + 1] = t
                active_count += 1
                newly += 1
            end
        end

        next_frontier = Int[]
        @inbounds for v in pending
            time[v + 1] == t || continue
            for k in (Int(start[v + 1]) + 1):Int(start[v + 2])
                u = Int(adj[k])
                active[u + 1] != 0 && continue
                count[u + 1] += Int32(1)
                if Int(count[u + 1]) == r
                    push!(next_frontier, u)
                end
            end
        end
        push!(rounds, (round = t, newly = newly, cumulative = active_count))
        pending = next_frontier
        if t > nn
            error("bootstrap did not converge; threshold exceeds maximum degree?")
        end
    end

    max_degree = 0
    @inbounds for d in degree
        Int(d) > max_degree && (max_degree = Int(d))
    end
    return (active = active,
            time = time,
            rounds = rounds,
            active_count = active_count,
            fraction = nn > 0 ? active_count / nn : 0.0,
            converged = true,
            max_degree = max_degree)
end

# ---------------------------------------------------------------------------
# Achlioptas (explosive) percolation
# ---------------------------------------------------------------------------

@inline function _check_rule(rule)
    sym = rule isa Symbol ? rule : Symbol(rule)
    (sym === :product || sym === :sum) ||
        throw(ArgumentError("rule must be product or sum"))
    return sym
end

"""
    explosive_sweep(n, eu, ev, candidate_order; rule="product")

Achlioptas two-choice process on a fixed edge list.

At each step two candidate edges are taken from `candidate_order` (normally a
permutation of `0:m-1`); the product rule keeps the candidate with the smaller
product of its endpoint component sizes, the sum rule the smaller sum.  The
other candidate is discarded.

Returns `(steps, max_jump, jump_at, rule, n, m, candidates_used)`.  Each entry
of `steps` is `(candidates, added, edges, smax, max_size, clusters, chi2,
merged)` indexed by the number of candidates consumed.  `max_jump` is the
largest one-step increase of the giant-component fraction -- a finite-size
observable, not a thermodynamic singularity.
"""
function explosive_sweep(n::Integer, eu::AbstractVector{<:Integer},
                         ev::AbstractVector{<:Integer},
                         candidate_order::AbstractVector{<:Integer};
                         rule::Union{AbstractString,Symbol} = "product")
    sym = _check_rule(rule)
    nn = Int(n)
    nn >= 0 || throw(ArgumentError("n must be non-negative"))
    m = length(eu)
    length(ev) == m || throw(ArgumentError("eu and ev must have the same length"))
    total = length(candidate_order)
    @inbounds for edge in candidate_order
        (0 <= Int(edge) < m) ||
            throw(ArgumentError("candidate_order contains an edge index outside 0..m-1"))
    end

    dsu = Dsu(nn)
    sum2 = nn
    steps = NamedTuple[]
    max_jump = 0.0
    jump_at = 0
    prev_s = nn > 0 ? 1.0 / nn : 0.0

    for k in 0:2:(total - 2)
        e1 = Int(candidate_order[k + 1])
        e2 = Int(candidate_order[k + 2])
        a1 = find(dsu, Int(eu[e1 + 1]))
        b1 = find(dsu, Int(ev[e1 + 1]))
        a2 = find(dsu, Int(eu[e2 + 1]))
        b2 = find(dsu, Int(ev[e2 + 1]))
        s1 = Int(dsu.size[a1 + 1]) * Int(dsu.size[b1 + 1])
        s2 = Int(dsu.size[a2 + 1]) * Int(dsu.size[b2 + 1])
        pick = if sym === :product
            s1 <= s2 ? e1 : e2
        else
            (Int(dsu.size[a1 + 1]) + Int(dsu.size[b1 + 1])) <=
                (Int(dsu.size[a2 + 1]) + Int(dsu.size[b2 + 1])) ? e1 : e2
        end

        ra = find(dsu, Int(eu[pick + 1]))
        rb = find(dsu, Int(ev[pick + 1]))
        before = dsu.max_size
        if ra != rb
            sa = Int(dsu.size[ra + 1])
            sb = Int(dsu.size[rb + 1])
            _union_roots!(dsu, ra + 1, rb + 1)
            sum2 += 2 * sa * sb
        end

        smax = nn > 0 ? dsu.max_size / nn : 0.0
        if smax - prev_s > max_jump
            max_jump = smax - prev_s
            jump_at = (k + 2) ÷ 2
        end
        prev_s = smax
        push!(steps, (candidates = k + 2,
                      added = (k + 2) ÷ 2,
                      edges = (k + 2) ÷ 2,
                      smax = smax,
                      max_size = dsu.max_size,
                      clusters = dsu.count,
                      chi2 = nn > 0 ? sum2 / nn : 0.0,
                      merged = dsu.max_size > before))
    end

    return (steps = steps,
            max_jump = max_jump,
            jump_at = jump_at,
            rule = String(sym),
            n = nn,
            m = m,
            candidates_used = (total ÷ 2) * 2)
end

"""
    explosive_random_graph(n; rule="product", steps=nothing, seed=1, record_every=1)

Achlioptas process on the complete graph, the setting of the 2009 paper.

Each step samples two candidate pairs uniformly with replacement (four
`int` draws in the order `a1, b1, a2, b2`) and adds the one preferred by the
product or sum rule.  Duplicate pairs are counted as additions but do not
merge components.  `steps` defaults to `4n`; `record_every` controls how often
a point is recorded (the final step is always recorded).

Returns `(points, max_jump, jump_at, rule, n, steps, added)` where each point
is `(step, added, q, smax, max_size, clusters, chi2)`.
"""
function explosive_random_graph(n::Integer; rule::Union{AbstractString,Symbol} = "product",
                                steps = nothing, seed::Integer = 1,
                                record_every::Integer = 1)
    nn = Int(n)
    nn >= 2 || throw(ArgumentError("explosive_random_graph needs n >= 2"))
    sym = _check_rule(rule)
    record_every >= 1 || throw(ArgumentError("record_every must be positive"))
    total = steps === nothing ? 4 * nn : Int(steps)
    total >= 0 || throw(ArgumentError("steps must be non-negative"))

    rng = Rng(seed)
    dsu = Dsu(nn)
    sum2 = nn
    points = NamedTuple[]
    max_jump = 0.0
    jump_at = 0
    prev_s = 1.0 / nn
    added = 0

    for s in 0:(total - 1)
        a1 = int(rng, nn)
        b1 = int(rng, nn - 1)
        b1 >= a1 && (b1 += 1)
        a2 = int(rng, nn)
        b2 = int(rng, nn - 1)
        b2 >= a2 && (b2 += 1)

        ra1 = find(dsu, a1)
        rb1 = find(dsu, b1)
        ra2 = find(dsu, a2)
        rb2 = find(dsu, b2)
        s1 = Int(dsu.size[ra1 + 1]) * Int(dsu.size[rb1 + 1])
        s2 = Int(dsu.size[ra2 + 1]) * Int(dsu.size[rb2 + 1])
        pick_first = if sym === :product
            s1 <= s2
        else
            (Int(dsu.size[ra1 + 1]) + Int(dsu.size[rb1 + 1])) <=
                (Int(dsu.size[ra2 + 1]) + Int(dsu.size[rb2 + 1]))
        end
        a, b = pick_first ? (a1, b1) : (a2, b2)
        ra = find(dsu, a)
        rb = find(dsu, b)
        if ra != rb
            sa = Int(dsu.size[ra + 1])
            sb = Int(dsu.size[rb + 1])
            _union_roots!(dsu, ra + 1, rb + 1)
            sum2 += 2 * sa * sb
            added += 1
        end

        smax = dsu.max_size / nn
        if smax - prev_s > max_jump
            max_jump = smax - prev_s
            jump_at = s + 1
        end
        prev_s = smax
        if s % record_every == 0 || s == total - 1
            push!(points, (step = s + 1,
                           added = added,
                           q = (s + 1) / nn,
                           smax = smax,
                           max_size = dsu.max_size,
                           clusters = dsu.count,
                           chi2 = sum2 / nn))
        end
    end

    return (points = points,
            max_jump = max_jump,
            jump_at = jump_at,
            rule = String(sym),
            n = nn,
            steps = total,
            added = added)
end

"""
    explosive_percolation(n, eu, ev; rule="product", seed=1)

Random-stream wrapper for [`explosive_sweep`](@ref): shuffle the edge order
with the shared generator (one Fisher-Yates pass), then run the two-choice
process over the shuffled list.
"""
function explosive_percolation(n::Integer, eu::AbstractVector{<:Integer},
                               ev::AbstractVector{<:Integer};
                               rule::Union{AbstractString,Symbol} = "product",
                               seed::Integer = 1)
    rng = Rng(seed)
    m = length(eu)
    order = collect(Int, 0:(m - 1))
    shuffle!(rng, order)
    return explosive_sweep(n, eu, ev, order; rule = rule)
end

# ---------------------------------------------------------------------------
# Invasion percolation (Prim with loop rejection)
# ---------------------------------------------------------------------------

# Binary min-heap of (key, edge) pairs.  Comparison is lexicographic, matching
# Python's `heapq` on tuples: equal thresholds are broken by the smaller edge
# index, so the traversal is deterministic.
mutable struct _EdgeHeap
    keys::Vector{Float64}
    edges::Vector{Int}
end

_EdgeHeap() = _EdgeHeap(Float64[], Int[])

@inline _heap_size(h::_EdgeHeap) = length(h.keys)

@inline function _heap_less(h::_EdgeHeap, i::Int, j::Int)
    ki = h.keys[i]
    kj = h.keys[j]
    return ki < kj || (ki == kj && h.edges[i] < h.edges[j])
end

function _heap_push!(h::_EdgeHeap, key::Float64, edge::Int)
    push!(h.keys, key)
    push!(h.edges, edge)
    i = length(h.keys)
    @inbounds while i > 1
        p = i >> 1
        _heap_less(h, i, p) || break
        h.keys[i], h.keys[p] = h.keys[p], h.keys[i]
        h.edges[i], h.edges[p] = h.edges[p], h.edges[i]
        i = p
    end
    return h
end

function _heap_pop!(h::_EdgeHeap)
    keys = h.keys
    edges = h.edges
    top_key = keys[1]
    top_edge = edges[1]
    last_key = pop!(keys)
    last_edge = pop!(edges)
    n = length(keys)
    if n > 0
        keys[1] = last_key
        edges[1] = last_edge
        i = 1
        @inbounds while true
            l = 2 * i
            r = l + 1
            smallest = i
            if l <= n && _heap_less(h, l, smallest)
                smallest = l
            end
            if r <= n && _heap_less(h, r, smallest)
                smallest = r
            end
            smallest == i && break
            keys[i], keys[smallest] = keys[smallest], keys[i]
            edges[i], edges[smallest] = edges[smallest], edges[i]
            i = smallest
        end
    end
    return (top_key, top_edge)
end

"""
    invasion_cluster(n, eu, ev, threshold, seed=0)

Invasion percolation with loop rejection.

Every edge carries an i.i.d. threshold in `threshold[e+1]`.  Starting from
0-based `seed`, repeatedly accept the lowest-threshold boundary edge leading
to an unvisited site; edges to visited sites are loops and are discarded,
counted once each in `loops`.  The accepted set is a spanning tree of the
invaded cluster (Prim's algorithm with random edge weights), so the accepted
thresholds are nondecreasing.

Returns `(order, thresholds, accepted, visited, size, loops, loop_edges,
last_threshold)`.
"""
function invasion_cluster(n::Integer, eu::AbstractVector{<:Integer},
                          ev::AbstractVector{<:Integer},
                          threshold::AbstractVector{<:Real},
                          seed::Integer = 0)
    nn = Int(n)
    nn >= 0 || throw(ArgumentError("n must be non-negative"))
    (0 <= seed < nn) || throw(ArgumentError("invasion seed must be a site index"))
    m = length(eu)
    length(ev) == m || throw(ArgumentError("eu and ev must have the same length"))
    length(threshold) == m || throw(ArgumentError("threshold must have length m"))

    nb = neighbours_from_edges(nn, eu, ev)
    start = nb.start
    adj = nb.adj
    edge_of = nb.edge_of

    visited = zeros(UInt8, nn)
    accepted = zeros(UInt8, m)
    loop_seen = zeros(UInt8, m)
    order = Int[]
    keys = Float64[]
    loop_edges = Int[]
    heap = _EdgeHeap()

    visited[seed + 1] = 0x01
    push!(order, Int(seed))
    @inbounds for k in (Int(start[seed + 1]) + 1):Int(start[seed + 2])
        e = Int(edge_of[k])
        _heap_push!(heap, Float64(threshold[e + 1]), e)
    end

    loops = 0
    while _heap_size(heap) > 0
        key, edge = _heap_pop!(heap)
        a = Int(eu[edge + 1])
        b = Int(ev[edge + 1])
        u = visited[a + 1] != 0 ? b : a
        if visited[u + 1] != 0
            if loop_seen[edge + 1] == 0
                loop_seen[edge + 1] = 0x01
                loops += 1
                push!(loop_edges, edge)
            end
            continue
        end

        visited[u + 1] = 0x01
        accepted[edge + 1] = 0x01
        push!(order, u)
        push!(keys, key)
        @inbounds for k in (Int(start[u + 1]) + 1):Int(start[u + 2])
            e = Int(edge_of[k])
            if accepted[e + 1] == 0
                _heap_push!(heap, Float64(threshold[e + 1]), e)
            end
        end
    end

    return (order = order,
            thresholds = keys,
            accepted = accepted,
            visited = visited,
            size = length(order),
            loops = loops,
            loop_edges = loop_edges,
            last_threshold = isempty(keys) ? 0.0 : keys[end])
end

"""
    invasion_percolation(n, eu, ev; seed=1, rng_seed=1)

Random-stream wrapper for [`invasion_cluster`](@ref): draw one uniform
threshold per edge in edge order (exactly `m` draws), then invade from
0-based site `seed`.  The full threshold vector is returned as `threshold`
alongside the `invasion_cluster` fields.
"""
function invasion_percolation(n::Integer, eu::AbstractVector{<:Integer},
                              ev::AbstractVector{<:Integer};
                              seed::Integer = 1, rng_seed::Integer = 1)
    rng = Rng(rng_seed)
    m = length(eu)
    threshold = Vector{Float64}(undef, m)
    @inbounds for e in 1:m
        threshold[e] = random(rng)
    end
    result = invasion_cluster(n, eu, ev, threshold, seed)
    return merge(result, (threshold = threshold,))
end

# ---------------------------------------------------------------------------
# Leath growth
# ---------------------------------------------------------------------------

"""
    leath_cluster(lattice, seed, p, rng; max_size=typemax(Int))

Grow the bond-percolation cluster of 0-based `seed` at occupation `p`.

Breadth-first growth in which every touched edge is tested exactly once (one
`random()` draw per edge, in CSR scan order).  An open edge to an unvisited
site joins the cluster; a closed edge contributes to the perimeter.  No site
outside the cluster is inspected.

Returns `(sites, size, open_edges, perimeter, truncated)` where `sites` is the
BFS visitation order and `truncated` is true when growth stopped at
`max_size`.
"""
function leath_cluster(lattice::Lattice, seed::Integer, p::Real, rng::Rng;
                       max_size::Integer = typemax(Int))
    n = lattice.n
    (0 <= seed < n) || throw(ArgumentError("Leath seed must be a site index"))
    pf = Float64(p)

    nb = neighbours_from_edges(n, lattice.eu, lattice.ev)
    start = nb.start
    adj = nb.adj
    edge_of = nb.edge_of

    visited = zeros(UInt8, n)
    tested = zeros(UInt8, lattice.m)
    queue = Int[Int(seed)]
    visited[seed + 1] = 0x01
    head = 1
    open_edges = 0
    perimeter = 0

    while head <= length(queue) && length(queue) <= max_size
        v = queue[head]
        head += 1
        @inbounds for k in (Int(start[v + 1]) + 1):Int(start[v + 2])
            e = Int(edge_of[k])
            tested[e + 1] != 0 && continue
            tested[e + 1] = 0x01
            if random(rng) < pf
                open_edges += 1
                u = Int(adj[k])
                if visited[u + 1] == 0
                    visited[u + 1] = 0x01
                    push!(queue, u)
                end
            else
                perimeter += 1
            end
        end
    end

    return (sites = queue,
            size = length(queue),
            open_edges = open_edges,
            perimeter = perimeter,
            truncated = length(queue) > max_size)
end

# ---------------------------------------------------------------------------
# Hoshen-Kopelman / graph-scan labelling
# ---------------------------------------------------------------------------

"""
    label_clusters(n, eu, ev, open_edges=nothing, active=nothing)

Label the connected components of open edges in scan order.

This is the graph form of Hoshen-Kopelman labelling: edges are visited once in
their given order, an equivalence table (a [`Dsu`](@ref)) is maintained, and
the labels are compressed in one final pass.  With `active` supplied the
routine labels site percolation (an edge counts only when both endpoints are
active); without it every vertex is present and only `open_edges` matters.
Inactive vertices get label `-1`.

`open_edges[e+1]` is nonzero for an open edge; `active[v+1]` is nonzero for a
present site.  Returns `(labels, sizes, count, max_size, max_label)`, where
`labels` is 0-based and `sizes[root+1]` counts the vertices carrying that root
label.  Cost is `O((n + m) alpha(n))` time and `O(n)` memory.
"""
function label_clusters(n::Integer, eu::AbstractVector{<:Integer},
                        ev::AbstractVector{<:Integer},
                        open_edges = nothing, active = nothing)
    nn = Int(n)
    nn >= 0 || throw(ArgumentError("n must be non-negative"))
    m = length(eu)
    length(ev) == m || throw(ArgumentError("eu and ev must have the same length"))
    if open_edges !== nothing && length(open_edges) != m
        throw(ArgumentError("open_edges must have length m"))
    end
    if active !== nothing && length(active) != nn
        throw(ArgumentError("active must have length n"))
    end

    present = Vector{UInt8}(undef, nn)
    present_count = 0
    if active === nothing
        fill!(present, 0x01)
        present_count = nn
    else
        @inbounds for v in 1:nn
            on = active[v] != 0
            present[v] = on ? 0x01 : 0x00
            present_count += on ? 1 : 0
        end
    end

    dsu = Dsu(nn)
    dsu.count = present_count
    dsu.max_size = present_count > 0 ? 1 : 0

    @inbounds for e in 1:m
        if open_edges !== nothing && open_edges[e] == 0
            continue
        end
        a = Int(eu[e])
        b = Int(ev[e])
        if present[a + 1] != 0 && present[b + 1] != 0
            union!(dsu, a, b)
        end
    end

    labels = fill(-1, nn)
    sizes = zeros(Int, nn)
    @inbounds for v in 0:(nn - 1)
        if present[v + 1] != 0
            r = find(dsu, v)
            labels[v + 1] = r
            sizes[r + 1] += 1
        end
    end

    count = 0
    max_size = 0
    @inbounds for s in sizes
        if s > 0
            count += 1
            s > max_size && (max_size = s)
        end
    end
    max_label = -1
    @inbounds for ℓ in labels
        ℓ > max_label && (max_label = ℓ)
    end
    return (labels = labels,
            sizes = sizes,
            count = count,
            max_size = max_size,
            max_label = max_label)
end

# ---------------------------------------------------------------------------
# Exact percolation on trees and configuration models
# ---------------------------------------------------------------------------

"""
    bethe_threshold(z)

Bond (and site) threshold of the `z`-regular Bethe lattice, exactly
`1/(z-1)`.  Requires an integer degree `z >= 2`.
"""
function bethe_threshold(z::Integer)
    z >= 2 || throw(ArgumentError("the Bethe lattice needs an integer degree z >= 2"))
    return 1.0 / (z - 1)
end

# Neumaier compensated accumulation.  Python's built-in `sum` uses compensated
# summation for floats (3.12+), and the golden configuration-model values were
# produced with it; mirroring the accumulation keeps the tree/epidemic answers
# bit-identical to the Python reference rather than merely within 1e-9.
@inline function _comp_add(s::Float64, c::Float64, x::Float64)
    t = s + x
    if abs(s) >= abs(x)
        c += (s - t) + x
    else
        c += (x - t) + s
    end
    return (t, c)
end

function _comp_sum(values)
    s = 0.0
    c = 0.0
    @inbounds for x in values
        s, c = _comp_add(s, c, Float64(x))
    end
    return s + c
end

# Smallest u in [0,1] with g(u) = u, assuming increasing g with g(1) = 1 and
# g(u) - u > 0 just above 0 when a nontrivial root exists.  Bisection selects
# the physical root independently of the starting point.
function _first_root(g; tol::Float64 = 1e-13, iterations::Integer = 200)
    lo = 0.0
    hi = 1.0
    for _ in 1:iterations
        mid = 0.5 * (lo + hi)
        if g(mid) - mid > 0.0
            lo = mid
        else
            hi = mid
        end
        hi - lo < tol && break
    end
    return hi
end

"""
    bethe_percolation(z, p)

Percolation on the `z`-regular tree.

Returns `(z, p, pc, theta, u, chi, supercritical)`: the percolation
probability `theta`, the probability `u` that a branch from a site is finite,
and the subcritical mean cluster size `chi`.  At or above `p_c = 1/(z-1)` the
mean cluster size including the infinite cluster is infinite, so `chi` is
`Inf` there.  The physical fixed point is selected by bisection on the first
sign change of `(1-p+p*u)^(z-1) - u`.
"""
function bethe_percolation(z::Integer, p::Real)
    z >= 2 || throw(ArgumentError("the Bethe lattice needs an integer degree z >= 2"))
    pf = Float64(p)
    (0.0 <= pf <= 1.0) || throw(ArgumentError("p must lie in [0,1]"))
    pc = bethe_threshold(z)

    if pf >= 1.0
        # The fully open tree has no finite branch.  For z = 2 this is also
        # the threshold, so the p <= pc shortcut below must not swallow it.
        return (z = Int(z), p = pf, pc = pc, theta = 1.0, u = 0.0,
                chi = Inf, supercritical = true)
    end

    if pf <= pc
        chi = pf >= pc ? Inf : 1.0 + z * pf / (1.0 - pf * (z - 1))
        return (z = Int(z), p = pf, pc = pc, theta = 0.0, u = 1.0,
                chi = chi, supercritical = false)
    end

    u = _first_root(x -> (1.0 - pf + pf * x)^(z - 1))
    theta = 1.0 - (1.0 - pf + pf * u)^z
    return (z = Int(z), p = pf, pc = pc, theta = max(0.0, theta), u = u,
            chi = Inf, supercritical = true)
end

"""
    poisson_pmf(c, kmax=nothing)

Truncated Poisson probabilities for mean `c`, normalised to sum to one.

`kmax` defaults to `floor(c + 12*sqrt(c+1) + 30)`, which captures the tail to
far beyond double precision.  This mirrors `poisson_pmf` in the Python reference
and `poissonPmf` in JavaScript.
"""
function poisson_pmf(c::Real, kmax = nothing)
    cf = Float64(c)
    (cf >= 0.0 && isfinite(cf)) ||
        throw(ArgumentError("Poisson mean must be finite and non-negative"))
    K = kmax === nothing ? floor(Int, cf + 12.0 * sqrt(cf + 1.0) + 30.0) :
        max(0, Int(kmax))
    out = Vector{Float64}(undef, K + 1)
    term = exp(-cf)
    @inbounds for k in 0:K
        out[k + 1] = term
        term *= cf / (k + 1)
    end
    total = _comp_sum(out)
    @inbounds for k in eachindex(out)
        out[k] /= total
    end
    return out
end

function _normalise_pmf(pmf)
    isempty(pmf) && throw(ArgumentError("degree distribution must not be empty"))
    values = Vector{Float64}(undef, length(pmf))
    @inbounds for k in eachindex(pmf)
        x = Float64(pmf[k])
        (x >= 0.0 && isfinite(x)) ||
            throw(ArgumentError("degree probabilities must be finite and non-negative"))
        values[k] = x
    end
    total = _comp_sum(values)
    total > 0.0 || throw(ArgumentError("degree probabilities must have positive sum"))
    @inbounds for k in eachindex(values)
        values[k] /= total
    end
    return values
end

"""
    configuration_giant_component(pmf, T=1.0)

Giant-component fraction of the configuration model after bond dilution.

`pmf[k+1]` is the probability of degree `k` (normalised internally) and `T`
is the probability that an edge is retained.  The equations are (22.8)-(22.10),

    u = G1(1 - T + T u),    S = 1 - G0(1 - T + T u),

with `G0` the degree generating function and `G1` its size-biased
counterpart.  The physical root `u <= 1` is found by bisection.

Returns `(T, S, u, kappa, tc, mean_degree, r0)`, where
`kappa = 1 + <k(k-1)>/<k>`, `tc = 1/(kappa-1)`, and `r0 = T (kappa-1)`.
"""
function configuration_giant_component(pmf, T::Real = 1.0)
    Tf = Float64(T)
    (0.0 <= Tf <= 1.0) || throw(ArgumentError("T must lie in [0,1]"))
    p = _normalise_pmf(pmf)

    mean = 0.0
    cmean = 0.0
    second = 0.0
    csecond = 0.0
    @inbounds for k in 0:(length(p) - 1)
        pk = p[k + 1]
        mean, cmean = _comp_add(mean, cmean, k * pk)
        second, csecond = _comp_add(second, csecond, k * (k - 1) * pk)
    end
    mean += cmean
    second += csecond
    if mean <= 0.0
        return (T = Tf, S = 0.0, u = 1.0, kappa = 1.0, tc = Inf,
                mean_degree = 0.0, r0 = 0.0)
    end

    kappa = 1.0 + second / mean
    tc = kappa > 1.0 ? 1.0 / (kappa - 1.0) : Inf

    g1 = function (x)
        s = 0.0
        c = 0.0
        @inbounds for k in 1:(length(p) - 1)
            s, c = _comp_add(s, c, (k * p[k + 1] / mean) * x^(k - 1))
        end
        return s + c
    end
    g0 = function (x)
        s = 0.0
        c = 0.0
        @inbounds for k in 0:(length(p) - 1)
            s, c = _comp_add(s, c, p[k + 1] * x^k)
        end
        return s + c
    end

    u = _first_root(x -> g1(1.0 - Tf + Tf * x))
    S = 1.0 - g0(1.0 - Tf + Tf * u)
    S = min(1.0, max(0.0, S))
    return (T = Tf, S = S, u = u, kappa = kappa, tc = tc,
            mean_degree = mean, r0 = Tf * (kappa - 1.0))
end

"""
    sir_final_size(pmf, T)

Final fraction of an SIR epidemic mapped to bond percolation.

`T` is the per-edge transmissibility.  The final size equals the giant
component of the configuration model with retention `T`, and `R0` is
`T (<k^2> - <k>) / <k>` by (23.3).  Herd immunity is `1 - 1/R0` when
`R0 > 1`, and zero otherwise.

Returns `(T, final_size, r0, kappa, tc, herd_immunity)`.
"""
function sir_final_size(pmf, T::Real)
    g = configuration_giant_component(pmf, T)
    r0 = g.r0
    herd = r0 > 1.0 ? 1.0 - 1.0 / r0 : 0.0
    return (T = g.T,
            final_size = g.S,
            r0 = r0,
            kappa = g.kappa,
            tc = g.tc,
            herd_immunity = herd)
end

# ---------------------------------------------------------------------------
# Message passing (cavity method) for bond percolation
# ---------------------------------------------------------------------------

"""
    _message_csr(n, eu, ev)

Symmetric CSR half-edge structure for the cavity iteration.

`start[v+1]+1:start[v+2]` are the 1-based adjacency slots of 0-based site `v`;
`adj[k]` is the neighbour reached through slot `k`, `mate[k]` the opposite
half-edge of the same undirected edge and `edge_of[k]` the 0-based input edge.
Half-edges are laid out edge by edge, exactly as in the Python/JavaScript
references, so the floating-point product order is reproduced.
"""
function _message_csr(nn::Int, eu::AbstractVector{<:Integer},
                      ev::AbstractVector{<:Integer})
    m = length(eu)
    start = zeros(Int32, nn + 1)
    @inbounds for e in 1:m
        a = Int(eu[e])
        b = Int(ev[e])
        (0 <= a < nn && 0 <= b < nn) ||
            throw(ArgumentError("edge endpoint outside 0:n-1"))
        start[a + 2] += Int32(1)
        start[b + 2] += Int32(1)
    end
    @inbounds for v in 1:nn
        start[v + 1] += start[v]
    end

    pos = copy(start[1:nn])
    adj = Vector{Int32}(undef, 2 * m)
    mate = Vector{Int32}(undef, 2 * m)
    edge_of = Vector{Int32}(undef, 2 * m)
    @inbounds for e in 1:m
        a = Int(eu[e])
        b = Int(ev[e])
        pa = Int(pos[a + 1]) + 1
        pb = Int(pos[b + 1]) + 1
        adj[pa] = Int32(b)
        adj[pb] = Int32(a)
        mate[pa] = Int32(pb)
        mate[pb] = Int32(pa)
        edge_of[pa] = Int32(e - 1)
        edge_of[pb] = Int32(e - 1)
        pos[a + 1] += Int32(1)
        pos[b + 1] += Int32(1)
    end
    return (start = start, adj = adj, mate = mate, edge_of = edge_of)
end

"""
    message_passing_percolation(n, eu, ev, T; max_iter=10000, tol=1e-12)

Cavity (Bethe) approximation for bond percolation on a fixed graph.

`msg[k]` is the message into site `adj[k]` from the vertex owning slot `k`,
i.e. the probability that the neighbour is not connected to the giant
component through `k`:

    msg[k] = prod_{j in N(v), j != adj[k]} (1 - T + T * msg[j])

and the message `v` sends back to `adj[k]` is stored at the opposite half-edge
`mate[k]`.  One sweep uses prefix/suffix products per vertex, so it costs
`O(n + m)`.  The iteration starts from zero to select the physical (smallest)
fixed point; starting at one would stay at the trivial solution.

After convergence `outside[v]` is the probability that `v` is not in the giant
component and `S = 1 - mean(outside)` is the estimated giant-component
fraction.  Returns `(S, outside, iterations, converged, max_change)`.
"""
function message_passing_percolation(n::Integer,
                                     eu::AbstractVector{<:Integer},
                                     ev::AbstractVector{<:Integer},
                                     T::Real;
                                     max_iter::Integer = 10000,
                                     tol::Real = 1e-12)
    nn = Int(n)
    nn >= 0 || throw(ArgumentError("n must be non-negative"))
    Tf = Float64(T)
    (0.0 <= Tf <= 1.0) || throw(ArgumentError("T must lie in [0,1]"))
    max_iter >= 1 || throw(ArgumentError("max_iter must be positive"))
    m = length(eu)
    length(ev) == m || throw(ArgumentError("eu and ev must have the same length"))

    csr = _message_csr(nn, eu, ev)
    start = csr.start
    mate = csr.mate

    max_degree = 0
    @inbounds for v in 1:nn
        d = Int(start[v + 1]) - Int(start[v])
        d > max_degree && (max_degree = d)
    end
    prefix = Vector{Float64}(undef, max_degree + 1)
    suffix = Vector{Float64}(undef, max_degree + 1)

    msg = zeros(Float64, 2 * m)
    nextmsg = zeros(Float64, 2 * m)
    converged = false
    iterations = 0
    max_change = 0.0

    for it in 1:Int(max_iter)
        iterations = it
        max_change = 0.0
        @inbounds for v in 1:nn
            lo = Int(start[v]) + 1
            hi = Int(start[v + 1])
            d = hi - lo + 1
            d <= 0 && continue
            prefix[1] = 1.0
            for i in 1:d
                prefix[i + 1] = prefix[i] * (1.0 - Tf + Tf * msg[lo + i - 1])
            end
            suffix[d + 1] = 1.0
            for i in d:-1:1
                suffix[i] = suffix[i + 1] * (1.0 - Tf + Tf * msg[lo + i - 1])
            end
            for i in 1:d
                slot = Int(mate[lo + i - 1])
                value = prefix[i] * suffix[i + 1]
                nextmsg[slot] = value
                diff = abs(value - msg[slot])
                diff > max_change && (max_change = diff)
            end
        end
        msg, nextmsg = nextmsg, msg
        if max_change < tol
            converged = true
            break
        end
    end

    outside = Vector{Float64}(undef, nn)
    total = 0.0
    @inbounds for v in 1:nn
        prod = 1.0
        for k in (Int(start[v]) + 1):Int(start[v + 1])
            prod *= 1.0 - Tf + Tf * msg[k]
        end
        outside[v] = prod
        total += prod
    end
    S = nn > 0 ? 1.0 - total / nn : 0.0
    S = min(1.0, max(0.0, S))
    return (S = S,
            outside = outside,
            iterations = iterations,
            converged = converged,
            max_change = max_change)
end
