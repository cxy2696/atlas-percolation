# Network percolation: configuration model, giant components, k-core,
# random/targeted removal and coupled (interdependent) ER networks.

"""Compressed sparse row adjacency (multigraph; self-loops and parallels kept)."""
struct Graph
    n::Int
    m::Int
    offset::Vector{Int32}   # offset[v] = first adjacency slot of 1-based v; offset[n+1] = m+1
    adj::Vector{Int32}      # 0-based neighbour ids
end

"""Degree of 0-based vertex `v`."""
@inline degree(g::Graph, v::Integer) = Int(g.offset[Int(v) + 2] - g.offset[Int(v) + 1])

"""
    poisson_degrees(N, mean, rng)

Poisson degree sequence by Knuth counting.  If the total degree is odd, one
stub is added to vertex 0, keeping the sequence graphical for the
configuration model.
"""
function poisson_degrees(N::Integer, mean::Real, rng::Rng)
    N >= 0 || throw(ArgumentError("N must be non-negative"))
    mean >= 0 || throw(ArgumentError("mean must be non-negative"))
    deg = Vector{Int32}(undef, Int(N))
    limit = exp(-Float64(mean))
    @inbounds for i in 1:Int(N)
        k = 0
        p = 1.0
        while true
            k += 1
            p *= random(rng)
            p <= limit && break
        end
        deg[i] = Int32(k - 1)
    end
    total = 0
    @inbounds for d in deg
        total += Int(d)
    end
    if isodd(total)
        deg[1] += Int32(1)
    end
    return deg
end

"""
    power_law_degrees(N, gamma, kmin=2, kmax=10000, rng)

Pareto-tail degrees via `floor(kmin * (1-u)^(-1/(gamma-1)))`, clamped to
`[kmin, kmax]`, with the same even-sum fix as `poisson_degrees`.
"""
function power_law_degrees(N::Integer, gamma::Real, kmin::Integer, kmax::Integer, rng::Rng)
    N >= 0 || throw(ArgumentError("N must be non-negative"))
    gamma > 1 || throw(ArgumentError("gamma must be > 1"))
    kmin >= 1 || throw(ArgumentError("kmin must be positive"))
    kmax >= kmin || throw(ArgumentError("kmax must be >= kmin"))
    a = 1.0 / (Float64(gamma) - 1.0)
    deg = Vector{Int32}(undef, Int(N))
    total = 0
    @inbounds for i in 1:Int(N)
        u = random(rng)
        v = Float64(kmin) * (1.0 - u)^(-a)
        k = if !isfinite(v) || v > Float64(kmax)
            Int(kmax)
        else
            floor(Int, v)
        end
        k < kmin && (k = Int(kmin))
        deg[i] = Int32(k)
        total += k
    end
    if isodd(total)
        deg[1] += Int32(1)
    end
    return deg
end

power_law_degrees(N::Integer, gamma::Real, rng::Rng;
                  kmin::Integer = 2, kmax::Integer = 10000) =
    power_law_degrees(N, gamma, kmin, kmax, rng)

"""
    configuration_model(deg, rng)

Pair stubs uniformly at random (one Fisher-Yates shuffle) and return the CSR
multigraph.  The degree sum must be even.
"""
function configuration_model(deg::AbstractVector{<:Integer}, rng::Rng)
    N = length(deg)
    M = 0
    @inbounds for d in deg
        d >= 0 || throw(ArgumentError("degrees must be non-negative"))
        M += Int(d)
    end
    iseven(M) || throw(ArgumentError("degree sum must be even"))
    M <= typemax(Int32) || throw(ArgumentError("degree sum is too large"))

    stubs = Vector{Int32}(undef, M)
    s = 0
    @inbounds for i in 1:N
        d = Int(deg[i])
        for _ in 1:d
            s += 1
            stubs[s] = Int32(i - 1)
        end
    end
    shuffle!(rng, stubs)

    counts = zeros(Int32, N)
    @inbounds for k in 1:2:M
        counts[Int(stubs[k]) + 1] += Int32(1)
        counts[Int(stubs[k + 1]) + 1] += Int32(1)
    end

    offset = Vector{Int32}(undef, N + 1)
    offset[1] = Int32(1)
    @inbounds for v in 1:N
        offset[v + 1] = offset[v] + counts[v]
    end
    adj = Vector{Int32}(undef, M)
    fillpos = copy(offset)
    @inbounds for k in 1:2:M
        a = Int(stubs[k])
        b = Int(stubs[k + 1])
        adj[Int(fillpos[a + 1])] = Int32(b)
        fillpos[a + 1] += Int32(1)
        adj[Int(fillpos[b + 1])] = Int32(a)
        fillpos[b + 1] += Int32(1)
    end
    return Graph(N, M, offset, adj)
end

"""All-ones activity mask of length `n`."""
all_active(n::Integer) = ones(UInt8, max(Int(n), 0))

"""
    components(graph, active)

Connected components of the subgraph induced by `active`.  Returns sizes
(sorted descending), the largest size and the active count/fractions.
"""
function components(g::Graph, active::AbstractVector{<:Integer})
    length(active) == g.n || throw(ArgumentError("active mask length must equal n"))
    n = g.n
    seen = zeros(UInt8, n)
    queue = Vector{Int32}(undef, n)
    sizes = Int[]
    largest = 0
    active_count = 0
    @inbounds for v in 1:n
        active[v] != 0 && (active_count += 1)
    end
    offset = g.offset
    adj = g.adj
    @inbounds for v in 1:n
        (active[v] == 0 || seen[v] != 0) && continue
        seen[v] = 0x01
        head = 1
        tail = 1
        queue[1] = Int32(v - 1)
        size = 0
        while head <= tail
            u0 = Int(queue[head])
            head += 1
            size += 1
            for e in Int(offset[u0 + 1]):(Int(offset[u0 + 2]) - 1)
                w0 = Int(adj[e])
                if active[w0 + 1] != 0 && seen[w0 + 1] == 0
                    seen[w0 + 1] = 0x01
                    tail += 1
                    queue[tail] = Int32(w0)
                end
            end
        end
        push!(sizes, size)
        size > largest && (largest = size)
    end
    sort!(sizes; rev = true)
    return (sizes = sizes,
            largest = largest,
            active_count = active_count,
            largest_fraction = active_count > 0 ? largest / active_count : 0.0,
            largest_global_fraction = n > 0 ? largest / n : 0.0)
end

"""Retain each vertex independently with probability `p`; inactive stays 0."""
function dilute(active::AbstractVector{<:Integer}, p::Real, rng::Rng)
    n = length(active)
    out = Vector{UInt8}(undef, n)
    pf = Float64(p)
    @inbounds for i in 1:n
        out[i] = (active[i] != 0 && random(rng) < pf) ? 0x01 : 0x00
    end
    return out
end

"""Remove the `floor(frac*n)` highest-degree vertices (stable tie order)."""
function targeted_removal(g::Graph, frac::Real)
    (0.0 <= frac <= 1.0) || throw(ArgumentError("frac must be in [0, 1]"))
    n = g.n
    deg = Vector{Int}(undef, n)
    @inbounds for v in 1:n
        deg[v] = Int(g.offset[v + 1] - g.offset[v])
    end
    order = sortperm(deg; rev = true, alg = MergeSort)
    active = ones(UInt8, n)
    cut = min(n, floor(Int, Float64(frac) * n))
    @inbounds for i in 1:cut
        active[order[i]] = 0x00
    end
    return active
end

"""
    kcore(graph, active, k)

k-core of the induced subgraph, computed by bucket peeling.  Returns the
surviving mask, its size and its fraction of all `n` vertices.
"""
function kcore(g::Graph, active::AbstractVector{<:Integer}, k::Integer)
    length(active) == g.n || throw(ArgumentError("active mask length must equal n"))
    k >= 0 || throw(ArgumentError("k must be non-negative"))
    n = g.n
    alive = zeros(UInt8, n)
    deg = zeros(Int32, n)
    rem = 0
    offset = g.offset
    adj = g.adj
    maxdeg = 0
    @inbounds for v in 1:n
        if active[v] != 0
            alive[v] = 0x01
            rem += 1
            d = 0
            for e in Int(offset[v]):(Int(offset[v + 1]) - 1)
                active[Int(adj[e]) + 1] != 0 && (d += 1)
            end
            deg[v] = Int32(d)
            d > maxdeg && (maxdeg = d)
        end
    end

    buckets = [Int32[] for _ in 0:maxdeg]
    @inbounds for v in 1:n
        if alive[v] != 0 && Int(deg[v]) < k
            push!(buckets[Int(deg[v]) + 1], Int32(v - 1))
        end
    end

    d = 0
    while d <= maxdeg && isempty(buckets[d + 1])
        d += 1
    end
    while d <= maxdeg
        # `bd` is the bucket being drained and must not move while it is
        # non-empty: entries whose degree drops below `bd` are re-queued in
        # lower buckets, while entries that cascade down to exactly `bd`
        # join this bucket.  `d` tracks the lowest non-empty degree.
        bd = d
        bucket = buckets[bd + 1]
        while !isempty(bucket)
            v0 = Int(pop!(bucket))
            v = v0 + 1
            if alive[v] == 0
                continue
            end
            dv = Int(deg[v])
            if dv != bd
                # Stale entry: degree dropped after it was queued.  Re-queue
                # at the actual degree (strictly below `bd` in practice).
                push!(buckets[dv + 1], Int32(v0))
                dv < d && (d = dv)
                continue
            end
            alive[v] = 0x00
            rem -= 1
            for e in Int(offset[v]):(Int(offset[v + 1]) - 1)
                w = Int(adj[e]) + 1
                if alive[w] != 0
                    nd = Int(deg[w]) - 1
                    deg[w] = Int32(nd)
                    if nd < k
                        push!(buckets[nd + 1], Int32(w - 1))
                        nd < d && (d = nd)
                    end
                end
            end
        end
        while d <= maxdeg && isempty(buckets[d + 1])
            d += 1
        end
    end
    return (alive = alive, size = rem, fraction = n > 0 ? rem / n : 0.0)
end

"""Mark (in `out`) the vertices of the largest component of `active`."""
function mark_giant!(g::Graph, active::AbstractVector{<:Integer}, out::Vector{UInt8})
    n = g.n
    seen = zeros(UInt8, n)
    queue = Vector{Int32}(undef, n)
    best = Vector{Int32}(undef, n)
    best_size = 0
    offset = g.offset
    adj = g.adj
    @inbounds for v in 1:n
        (active[v] == 0 || seen[v] != 0) && continue
        seen[v] = 0x01
        head = 1
        tail = 1
        queue[1] = Int32(v - 1)
        while head <= tail
            u0 = Int(queue[head])
            head += 1
            for e in Int(offset[u0 + 1]):(Int(offset[u0 + 2]) - 1)
                w0 = Int(adj[e])
                if active[w0 + 1] != 0 && seen[w0 + 1] == 0
                    seen[w0 + 1] = 0x01
                    tail += 1
                    queue[tail] = Int32(w0)
                end
            end
        end
        if tail > best_size
            best_size = tail
            copyto!(best, 1, queue, 1, tail)
        end
    end
    @inbounds for i in 1:best_size
        out[Int(best[i]) + 1] = 0x01
    end
    return out
end

"""
    interdependent_er(N, mean_degree, p, rng)

Fully interdependent pair of ER networks with one-to-one coupling.  A vertex
survives a round only if it is retained, lies in the giant component of layer
A and lies in the giant component of layer B.  The layers share labels, so
the update is the intersection of the two giant components; pruning them
independently is a bug and overestimates the mutual component.
"""
function interdependent_er(N::Integer, mean_degree::Real, p::Real, rng::Rng)
    N >= 1 || throw(ArgumentError("N must be positive"))
    (0.0 <= p <= 1.0) || throw(ArgumentError("p must be in [0, 1]"))
    n = Int(N)
    deg_a = poisson_degrees(n, mean_degree, rng)
    deg_b = poisson_degrees(n, mean_degree, rng)
    g_a = configuration_model(deg_a, rng)
    g_b = configuration_model(deg_b, rng)

    surviving = Vector{UInt8}(undef, n)
    pf = Float64(p)
    @inbounds for i in 1:n
        surviving[i] = random(rng) < pf ? 0x01 : 0x00
    end

    trace = NamedTuple{(:iteration, :a, :b, :alive_a, :alive_b),Tuple{Int,Float64,Float64,Int,Int}}[]
    giant_a = zeros(UInt8, n)
    giant_b = zeros(UInt8, n)
    for it in 0:999
        ca = components(g_a, surviving)
        cb = components(g_b, surviving)
        push!(trace, (iteration = it, a = ca.largest_fraction, b = cb.largest_fraction,
                      alive_a = ca.active_count, alive_b = cb.active_count))
        fill!(giant_a, 0x00)
        fill!(giant_b, 0x00)
        mark_giant!(g_a, surviving, giant_a)
        mark_giant!(g_b, surviving, giant_b)
        next_surviving = Vector{UInt8}(undef, n)
        changed = false
        @inbounds for i in 1:n
            next_surviving[i] = (surviving[i] != 0 && giant_a[i] != 0 && giant_b[i] != 0) ? 0x01 : 0x00
            next_surviving[i] != surviving[i] && (changed = true)
        end
        surviving = next_surviving
        changed || break
    end
    alive = 0
    @inbounds for v in surviving
        alive += Int(v)
    end
    return (fraction = alive / n,
            cascade = trace,
            graph_a = g_a,
            graph_b = g_b,
            active = surviving)
end


"""Exact Molloy-Reed quantities for a degree sequence."""
function molloy_reed(deg::AbstractVector{<:Integer})
    isempty(deg) && throw(ArgumentError("degree sequence must not be empty"))
    n = length(deg)
    s1 = 0.0
    s2 = 0.0
    @inbounds for d in deg
        fd = Float64(d)
        s1 += fd
        s2 += fd * fd
    end
    k1 = s1 / n
    k2 = s2 / n
    kappa = k1 > 0 ? k2 / k1 : Inf
    pc = k2 > k1 ? k1 / (k2 - k1) : Inf
    return (mean = k1, second = k2, kappa = kappa, pc = pc, fc = 1 - pc)
end
