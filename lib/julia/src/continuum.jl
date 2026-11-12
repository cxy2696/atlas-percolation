# Continuum (Boolean) percolation in the unit square: Poisson points,
# hard disks of radius r, disks connected when they overlap.

"""`n` uniform points: for each point an x draw then a y draw."""
function poisson_points(n::Integer, rng::Rng)
    n >= 0 || throw(ArgumentError("n must be non-negative"))
    nn = Int(n)
    x = Vector{Float64}(undef, nn)
    y = Vector{Float64}(undef, nn)
    @inbounds for i in 1:nn
        x[i] = random(rng)
        y[i] = random(rng)
    end
    return (x = x, y = y, n = nn)
end

"""
    boolean_model(n, r, rng)

Poisson points in the unit square with hard disks of radius `r`.  Two disks
are in the same cluster when their centre distance is at most `2r`; a uniform
grid of cell size `2r` supplies the neighbour search.  The analytic coverage
`1 - exp(-n*pi*r^2)` is returned for comparison with the sampled union.
"""
function boolean_model(n::Integer, r::Real, rng::Rng)
    n >= 0 || throw(ArgumentError("n must be non-negative"))
    (isfinite(r) && r > 0) || throw(ArgumentError("r must be positive and finite"))
    rf = Float64(r)
    pts = poisson_points(n, rng)
    x = pts.x
    y = pts.y
    nn = pts.n
    dsu = Dsu(nn)
    size = 2.0 * rf
    cells = Dict{Tuple{Int,Int},Vector{Int32}}()
    @inbounds for v in 1:nn
        cx = floor(Int, x[v] / size)
        cy = floor(Int, y[v] / size)
        push!(get!(cells, (cx, cy), Int32[]), Int32(v - 1))
    end
    r2 = (2.0 * rf) * (2.0 * rf)
    empty = Int32[]
    @inbounds for v in 1:nn
        v0 = v - 1
        cx = floor(Int, x[v] / size)
        cy = floor(Int, y[v] / size)
        for dx in -1:1
            for dy in -1:1
                arr = get(cells, (cx + dx, cy + dy), empty)
                for w0 in arr
                    w = Int(w0)
                    w <= v0 && continue
                    ddx = x[v] - x[w + 1]
                    ddy = y[v] - y[w + 1]
                    if ddx * ddx + ddy * ddy <= r2
                        union!(dsu, v0, w)
                    end
                end
            end
        end
    end

    root_size = zeros(Int32, nn)
    touched = Int32[]
    @inbounds for v in 1:nn
        rt = _find(dsu, v)
        if root_size[rt] == 0
            push!(touched, Int32(rt))
        end
        root_size[rt] += Int32(1)
    end
    sizes = Vector{Int}(undef, length(touched))
    @inbounds for k in eachindex(touched)
        sizes[k] = Int(root_size[Int(touched[k])])
    end
    sort!(sizes; rev = true)
    largest = isempty(sizes) ? 0 : sizes[1]
    return (n = nn,
            r = rf,
            x = x,
            y = y,
            dsu = dsu,
            sizes = sizes,
            largest = largest,
            largest_fraction = nn > 0 ? largest / nn : 0.0,
            coverage = 1.0 - exp(-nn * pi * rf * rf))
end
