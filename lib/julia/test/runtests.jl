# Test suite for PercolationAtlas -- Julia stdlib `Test` only.
#
# Run from the repository root:
#     julia --project=lib/julia lib/julia/test/runtests.jl
#
# The RNG values below are the contents of data/golden/rng-seed42.json; the
# parity probes are data/golden/parity.json.  They are hard-coded because the
# package deliberately has no external (JSON) dependency.

using Test
using PercolationAtlas

const GOLDEN_DOUBLES = [
    0.15377165154351735,
    0.018084544121180213,
    0.5348906350361368,
    0.7272476917564136,
    0.572911021218635,
    0.2877089619804075,
    0.8504471575585412,
    0.30334379811845724,
]
const GOLDEN_INTS = [1, 2, 6, 3, 6, 7, 4, 6]
const GOLDEN_U32_SUM = 839333524
const GOLDEN_FNV1A = 3108118429

count_lr(lat, mode, p, seed, nsamples) = begin
    model = Percolation(lat, mode)
    rng = Rng(seed)
    hits = 0
    for _ in 1:nsamples
        sample!(model, p, rng)
        hits += crosses_lr(model) ? 1 : 0
    end
    hits
end

@testset "RNG golden vectors (seed 42)" begin
    rng = Rng(42)
    @test [random(rng) for _ in 1:8] == GOLDEN_DOUBLES

    rng = Rng(42)
    @test [int(rng, 10) for _ in 1:8] == GOLDEN_INTS

    rng = Rng(42)
    total = UInt32(0)
    h = UInt32(2166136261)
    for _ in 1:10000
        v = u32!(rng)
        total += v
        h = (h ⊻ v) * UInt32(16777619)
    end
    @test Int(total) == GOLDEN_U32_SUM
    @test Int(h) == GOLDEN_FNV1A

    # The public helper must expose the same four probes.
    t = rng_test(42)
    @test t.doubles == GOLDEN_DOUBLES
    @test t.ints_mod_10 == GOLDEN_INTS
    @test Int(t.u32_sum) == GOLDEN_U32_SUM
    @test Int(t.fnv1a) == GOLDEN_FNV1A

    # Consumption and range sanity.
    rng = Rng(7)
    vals = [random(rng) for _ in 1:5000]
    @test all(v -> 0.0 <= v < 1.0, vals)
    @test abs(sum(vals) / length(vals) - 0.5) < 0.02

    rng = Rng(11)
    a = collect(0:99)
    shuffle!(rng, a)
    @test sort(a) == collect(0:99)
    @test a != collect(0:99)
end

@testset "Lattice generators" begin
    sq = build_lattice("square", 8)
    @test sq.n == 64
    @test sq.m == 2 * 8 * 7
    @test build_lattice("square", 8; torus = true).m == 128

    tri = build_lattice("triangular", 8)
    @test tri.m == 8 * 7 + 8 * 7 + 7 * 7
    @test build_lattice("triangular", 8, true).m == 3 * 64

    # Open-boundary SW edges never originate in column 0 (they must not wrap).
    for e in 1:tri.m
        if tri.etype[e] == 0x02
            @test tri.eu[e] % 8 != 0
            @test tri.ev[e] == tri.eu[e] + 7
        end
    end
    tri_t = build_lattice("triangular", 8; torus = true)
    @test any(e -> tri_t.etype[e] == 0x02 && tri_t.eu[e] % 8 == 0, 1:tri_t.m)

    hc = build_lattice("honeycomb", 8; torus = true)
    @test hc.m == 96
    @test all(d -> d == 3, degree_histogram(hc).deg)
    @test_throws ArgumentError build_lattice("honeycomb", 7)
    @test_throws ArgumentError build_lattice("hexagonal", 8)
end

@testset "Parity probes (data/golden/parity.json)" begin
    # square_bond_cross_500_seed1234
    @test count_lr(build_lattice("square", 32), "bond", 0.5, 1234, 500) == 244

    # tri_site_cross_300_seed777
    @test count_lr(build_lattice("triangular", 16), "site", 0.5, 777, 300) == 151

    # nz_smax_q1_q2_end_seed5 (0-based 69//4, 69//2, 68)
    nz = newman_ziff(build_lattice("square", 16), Rng(5); checkpoints = 64)
    len = length(nz.p)
    @test len == 69
    @test [nz.smax[len ÷ 4 + 1], nz.smax[len ÷ 2 + 1], nz.smax[len]] == [10, 109, 256]

    # configmodel_largest_seed9
    rng = Rng(9)
    deg = poisson_degrees(2000, 3.0, rng)
    g = configuration_model(deg, rng)
    @test components(g, all_active(2000)).largest == 1883

    # interdependent_fraction_seed11 (exact)
    res = interdependent_er(1500, 3.5, 0.75, Rng(11))
    @test res.fraction == 0.5306666666666666
end

@testset "Cardy formula" begin
    @test isapprox(cardy_crossing(0.1), 4.0394890895707114e-05; atol = 1e-15, rtol = 0)
    @test cardy_crossing(1.0) == 0.5
    @test isapprox(cardy_crossing(10.0), 0.9999596051091043; atol = 1e-12, rtol = 0)
    @test isapprox(cardy_crossing(0.25), 0.02163002909086475; atol = 1e-12, rtol = 0)
    @test isapprox(cardy_crossing(2.0), 0.8243531061993461; atol = 1e-12, rtol = 0)
    @test isapprox(cardy_hypergeom(1.0), 1.1129126745223048; atol = 1e-12, rtol = 0)
    @test isapprox(cardy_crossing_vertical(10.0), 1.0 - cardy_crossing(10.0);
                   atol = 1e-12, rtol = 0)
    vals = [cardy_crossing(l) for l in (0.1, 0.3, 1.0, 3.0, 10.0, 100.0)]
    @test issorted(vals)
    @test_throws ArgumentError cardy_crossing(0.0)
    @test_throws ArgumentError cardy_crossing(-1.0)
end

@testset "Percolation sanity" begin
    sq_t = build_lattice("square", 32; torus = true)
    @test sq_t.n == 1024
    @test sq_t.m == 2048

    model = Percolation(build_lattice("square", 16), "bond")
    rng = Rng(3)
    sample!(model, 1.0, rng)
    st = analyze!(model)
    @test st.count == 1
    @test st.max_size == 256
    @test st.sum == 256
    @test st.sum2 == 65536
    @test st.sizes == Int32[256]
    @test crosses_lr(model)
    @test crosses_tb(model)

    sample!(model, 0.0, rng)
    st = analyze!(model)
    @test st.count == 256          # 256 isolated sites
    @test st.max_size == 1
    @test st.sum == 256
    @test st.sum2 == 256
    @test max_fraction(st) == 1 / 256
    @test chi2(st) == 1.0
    @test !crosses_lr(model)
    @test !crosses_tb(model)

    @test_throws ArgumentError Percolation(build_lattice("square", 8), "bad")
end

@testset "Duality crossing rate" begin
    hits = count_lr(build_lattice("square", 32), "bond", 0.5, 2024, 400)
    rate = hits / 400
    @test 0.42 <= rate <= 0.58
end

@testset "Newman-Ziff sweep" begin
    out = newman_ziff(build_lattice("square", 24), Rng(5); checkpoints = 100)
    @test length(out.p) == length(out.smax) == length(out.chi2) == length(out.nclusters)
    @test out.p[end] == 1.0
    @test out.smax[end] == 24 * 24
    @test out.chi2[end] == 24 * 24
    @test issorted(out.smax)
    @test out.nclusters[end] == 1
    @test all(p -> 0.0 < p <= 1.0, out.p)
end

@testset "Union-find" begin
    d = Dsu(5)
    @test find(d, 3) == 3
    @test union!(d, 0, 4)
    @test find(d, 4) == find(d, 0)
    @test d.count == 4
    @test union!(d, 4, 0) == false
    @test d.size[find(d, 0) + 1] == 2
    @test sort(roots(d)) == [0, 1, 2, 3]
end

@testset "Network model" begin
    rng = Rng(23)
    deg = poisson_degrees(5000, 4.0, rng)
    g = configuration_model(deg, rng)
    c = components(g, all_active(5000))
    @test c.largest_fraction > 0.9
    @test c.largest_global_fraction > 0.9
    @test sum(c.sizes) == 5000

    mr = molloy_reed(poisson_degrees(20000, 4.0, Rng(17)))
    @test isapprox(mr.pc, 0.25; atol = 0.02)
    @test isapprox(mr.kappa, 5.0; atol = 0.05)

    rng = Rng(29)
    g2 = configuration_model(poisson_degrees(3000, 3.5, rng), rng)
    core = kcore(g2, all_active(3000), 3)
    @test 0.0 < core.fraction < 1.0
    removed = targeted_removal(g2, 0.1)
    @test count(!iszero, removed) == 2700

    @test_throws ArgumentError configuration_model([1, 2], Rng(1))
    @test_throws ArgumentError molloy_reed(Int[])
end

@testset "Continuum Boolean model" begin
    res = boolean_model(1500, 0.04, Rng(37))
    @test res.n == 1500
    @test res.largest_fraction > 0.5
    @test sum(res.sizes) == 1500
    @test isapprox(res.coverage, 1.0 - exp(-1500 * pi * 0.04^2); rtol = 1e-14)
    @test_throws ArgumentError boolean_model(10, 0.0, Rng(1))
end

@testset "Empty / minimal systems" begin
    lat0 = build_lattice("square", 1)          # open boundary: no edges
    @test lat0.m == 0
    nz = newman_ziff(lat0, Rng(1); checkpoints = 10)
    @test isempty(nz.p) && isempty(nz.smax)

    g0 = configuration_model(Int32[], Rng(1))
    @test g0.n == 0 && g0.m == 0
    @test components(g0, UInt8[]).largest == 0
    @test kcore(g0, UInt8[], 3).size == 0
    @test boolean_model(0, 0.04, Rng(1)).sizes == Int[]

    d0 = Dsu(0)
    @test roots(d0) == Int[]
    @test d0.count == 0

    site = Percolation(build_lattice("square", 8), "site")
    sample!(site, 0.0, Rng(1))
    st = analyze!(site)
    @test st.count == 0 && st.sum == 0 && st.max_size == 0
    @test !crosses_lr(site) && !crosses_tb(site)
end

@testset "API smoke" begin
    # RNG state round-trip and scalar helpers.
    r = Rng(123)
    snap = state(r)
    saved = random(r)
    load_state!(r, snap)
    @test random(r) == saved
    @test bernoulli(Rng(1), 1.0)
    @test !bernoulli(Rng(1), 0.0)
    @test isfinite(normal(Rng(5)))

    # Geometry helpers and non-mutating-name aliases.
    lat = build_lattice("square", 8)
    @test lattice_position(lat, 0) == (0.0, 0.0)
    @test lattice_position(lat, 63) == (7 / 8, 7 / 8)
    @test lattice_size(lat) == (n = 64, m = 112)
    @test build_lattice(:square, 4; torus = true).m == 32
    model = Percolation(lat; mode = "site")
    @test model.mode === :site
    sample(model, 1.0, Rng(2))
    build(model)
    @test analyze(model).count == 1
    @test ensure_built!(model) === model.dsu

    # Distribution helper and Pareto degrees.
    hist = cluster_size_distribution(lat, 1.0, Rng(2); samples = 1)
    @test hist[64] == 1
    @test newman_ziff(build_lattice("square", 4), Rng(1), 5).p[end] == 1.0
    pl = power_law_degrees(500, 2.5, 2, 1000, Rng(3))
    @test length(pl) == 500
    @test all(d -> 2 <= d, pl)
    @test iseven(sum(Int, pl))
    @test count(!iszero, dilute(all_active(1000), 0.5, Rng(4))) == 480
end

