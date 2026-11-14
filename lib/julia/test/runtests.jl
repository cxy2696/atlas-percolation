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
const GOLDEN_NORMALS = [
    0.26752688913325207,
    1.7424408577069266,
    0.5813902729075202,
    -1.6928023015879279,
    0.8153199416965593,
    -0.4575232516347127,
]
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

    rng = Rng(42)
    @test [normal(rng) for _ in 1:6] == GOLDEN_NORMALS

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

@testset "Directed percolation parity" begin
    lat = build_lattice("square", 32)
    rng = Rng(4242)
    hits = 0
    for _ in 1:500
        hits += directed_crossing(lat, 0.65, rng; mode = "bond").cross ? 1 : 0
    end
    @test hits == 354
    rng = Rng(4242)
    hits = 0
    for _ in 1:500
        hits += directed_crossing(lat, 0.70, rng; mode = "site").cross ? 1 : 0
    end
    @test hits == 328
end

@testset "Regression checks" begin
    # Triangle 0-1-2 plus leaf 3-2: the 3-core is empty.
    g = Graph(4, 8, Int32[1, 3, 5, 8, 9], Int32[1, 2, 0, 2, 1, 0, 3, 2])
    @test kcore(g, [1, 1, 1, 1], 3).size == 0

    # Site p=0 leaves no occupied component.
    model = Percolation(build_lattice("square", 8), "site")
    sample!(model, 0.0, Rng(2))
    build!(model)
    @test model.dsu.count == 0
    @test model.dsu.max_size == 0

    # Large-mean Poisson.
    deg = poisson_degrees(2000, 1000.0, Rng(3))
    @test abs(sum(deg) / length(deg) - 1000.0) < 5.0

    # Degenerate honeycomb quotient is rejected.
    @test_throws ArgumentError build_lattice("honeycomb", 4)
end

@testset "Cardy formula" begin
    @test isapprox(cardy_crossing(0.1), 4.039284061265219e-05; atol = 1e-15, rtol = 0)
    @test cardy_crossing(1.0) == 0.5
    @test isapprox(cardy_crossing(10.0), 0.9999596071593873; atol = 1e-12, rtol = 0)
    @test isapprox(cardy_crossing(0.25), 0.02163002909086675; atol = 1e-12, rtol = 0)
    @test isapprox(cardy_crossing(2.0), 0.8243531061993448; atol = 1e-12, rtol = 0)
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

# Floats in the v3/v4 zoo contract agree to 1e-9; integers must be exact.
close_to(a, b) = isapprox(a, b; atol = 1e-9, rtol = 1e-9)

@testset "Algorithm zoo and trees" begin
    # z = 2 at p = 1 is the boundary: the chain is fully open.
    chain = bethe_percolation(2, 1.0)
    @test chain.theta == 1.0
    @test chain.u == 0.0
    @test chain.supercritical

    # ---- bootstrap_3x3_corners_r2
    lat3 = build_lattice("square", 3)
    nb3 = neighbours_from_edges(lat3.n, lat3.eu, lat3.ev)
    @test length(nb3.start) == 10
    @test length(nb3.adj) == 2 * lat3.m
    @test nb3.degree[1] == 2 && nb3.degree[5] == 4
    corners = zeros(UInt8, 9)
    for v in (0, 2, 6, 8)
        corners[v + 1] = 0x01
    end
    b3 = bootstrap_activation(9, nb3, corners, 2)
    @test b3.active_count == 9
    @test length(b3.rounds) == 2
    @test b3.time == [0, 1, 0, 1, 2, 1, 0, 1, 0]
    @test b3.fraction == 1.0
    @test b3.converged
    @test b3.max_degree == 4
    @test b3.rounds[1].newly == 4 && b3.rounds[2].newly == 1

    # ---- bootstrap_32x32_p055_r3_seed123
    lat32 = build_lattice("square", 32)
    nb32 = neighbours_from_edges(lat32.n, lat32.eu, lat32.ev)
    rng = Rng(123)
    init32 = UInt8[random(rng) < 0.55 ? 0x01 : 0x00 for _ in 1:lat32.n]
    b32 = bootstrap_activation(lat32.n, nb32, init32, 3)
    @test b32.active_count == 811
    @test length(b32.rounds) == 10
    @test b32.fraction == 0.7919921875
    @test b32.max_degree == 4

    # Bootstrap is the least fixed point of the synchronous closure.
    for seed in 1:12
        lat = build_lattice("square", 8)
        nb = neighbours_from_edges(lat.n, lat.eu, lat.ev)
        rng = Rng(seed)
        init = UInt8[random(rng) < 0.4 ? 0x01 : 0x00 for _ in 1:lat.n]
        r = 1 + (seed % 3)
        fast = bootstrap_activation(lat.n, nb, init, r)

        active = copy(init)
        for _ in 1:lat.n
            nxt = copy(active)
            for v in 1:lat.n
                active[v] != 0 && continue
                c = 0
                for k in (Int(nb.start[v]) + 1):Int(nb.start[v + 1])
                    c += Int(active[Int(nb.adj[k]) + 1])
                end
                c >= r && (nxt[v] = 0x01)
            end
            nxt == active && break
            active = nxt
        end
        @test fast.active == active
        @test fast.active_count == count(!iszero, active)
    end
    # A threshold above every degree never adds sites beyond the initial set.
    nb5 = neighbours_from_edges(25, build_lattice("square", 5).eu,
                               build_lattice("square", 5).ev)
    tall = bootstrap_activation(25, nb5, ones(UInt8, 25), 5)
    @test tall.active_count == 25
    @test isempty(tall.rounds)

    # ---- invasion_2x2_thresholds
    lat2 = build_lattice("square", 2)
    inv2 = invasion_cluster(4, lat2.eu, lat2.ev, [0.1, 0.9, 0.2, 0.8], 0)
    @test inv2.order == [0, 1, 3, 2]
    @test inv2.thresholds == [0.1, 0.2, 0.8]
    @test inv2.loops == 1
    @test inv2.size == 4
    @test inv2.last_threshold == 0.8

    # ---- invasion_16x16_seed5_rng13
    lat16 = build_lattice("square", 16)
    rng13 = Rng(13)
    th16 = [random(rng13) for _ in 1:lat16.m]
    inv16 = invasion_cluster(lat16.n, lat16.eu, lat16.ev, th16, 5)
    @test inv16.size == 256
    @test inv16.loops == 225
    @test close_to(inv16.last_threshold, 0.7136381922622188)
    @test sum(inv16.accepted) == lat16.n - 1
    @test length(inv16.thresholds) == lat16.n - 1

    # ---- leath_6x6_seed3_p05
    lat6 = build_lattice("square", 6)
    le = leath_cluster(lat6, 3, 0.5, Rng(3))
    @test le.size == 4
    @test le.open_edges == 3
    @test le.perimeter == 5
    @test !le.truncated
    @test le.sites[1] == 3
    @test leath_cluster(lat6, 0, 1.0, Rng(1)).size == lat6.n
    empty_leath = leath_cluster(lat6, 0, 0.0, Rng(1))
    @test empty_leath.size == 1 && empty_leath.open_edges == 0

    # ---- explosive_graph_500_seed7
    ex = explosive_random_graph(500, seed = 7)
    @test ex.points[end].smax == 1.0
    @test close_to(ex.max_jump, 0.312)
    @test ex.jump_at == 464
    @test ex.added == 499
    @test ex.steps == 2000
    @test length(ex.points) == 2000
    @test all(p -> p.smax <= 1.0, ex.points)

    # ---- explosive_lattice_4x4_seed11_sum
    lat4 = build_lattice("square", 4)
    exl = explosive_percolation(16, lat4.eu, lat4.ev, seed = 11, rule = "sum")
    @test length(exl.steps) == 12
    @test close_to(exl.steps[end].smax, 0.375)
    @test close_to(exl.max_jump, 0.0625)
    @test exl.jump_at == 1
    @test exl.candidates_used == 24
    @test exl.rule == "sum"
    @test length(explosive_sweep(16, lat4.eu, lat4.ev, 0:(lat4.m - 1)).steps) == 12

    # ---- bethe_z3_p06
    bethe3 = bethe_percolation(3, 0.6)
    @test close_to(bethe3.theta, 0.7037037037036935)
    @test close_to(bethe3.u, 0.4444444444444571)
    @test bethe3.pc == 0.5
    @test isinf(bethe3.chi)
    @test bethe3.supercritical
    @test bethe3.z == 3

    # ---- bethe_z4_p04
    bethe4 = bethe_percolation(4, 0.4)
    @test close_to(bethe4.theta, 0.5415026221291449)
    @test close_to(bethe4.u, 0.557189138830779)
    @test bethe4.pc == 0.3333333333333333
    @test isinf(bethe4.chi)
    @test bethe4.supercritical

    # Bethe threshold is exact, and the critical point has zero order parameter.
    for z in (2, 3, 4, 10)
        @test bethe_threshold(z) == 1.0 / (z - 1)
    end
    @test bethe_threshold(3) == 0.5
    crit = bethe_percolation(3, 0.5)
    @test crit.theta == 0.0 && crit.u == 1.0 && isinf(crit.chi)
    sub = bethe_percolation(3, 0.4)
    @test sub.theta == 0.0 && !sub.supercritical
    @test close_to(sub.chi, 7.0)
    @test_throws ArgumentError bethe_percolation(1, 0.5)
    @test_throws ArgumentError bethe_percolation(3, 1.5)
    @test_throws ArgumentError bethe_threshold(1)

    # ---- config_poisson_c2_T1 and sir_poisson_c2_T1
    pmf2 = poisson_pmf(2.0)
    @test close_to(sum(pmf2), 1.0)
    cfg = configuration_giant_component(pmf2, 1.0)
    @test close_to(cfg.S, 0.7968121300200065)
    @test close_to(cfg.u, 0.20318786998001315)
    @test close_to(cfg.kappa, 3.0)
    @test close_to(cfg.tc, 0.5)
    @test close_to(cfg.r0, 2.0)
    @test close_to(cfg.mean_degree, 2.0)

    sir = sir_final_size(pmf2, 1.0)
    @test close_to(sir.final_size, 0.7968121300200065)
    @test close_to(sir.r0, 2.0)
    @test close_to(sir.herd_immunity, 0.5)
    @test sir.final_size == cfg.S
    @test configuration_giant_component(pmf2, 0.4).S == 0.0

    # ---- labels_square6_p05_seed42
    lat6b = build_lattice("square", 6)
    rng42 = Rng(42)
    open6 = UInt8[random(rng42) < 0.5 ? 0x01 : 0x00 for _ in 1:lat6b.m]
    lab = label_clusters(lat6b.n, lat6b.eu, lat6b.ev, open6)
    @test lab.count == 6
    @test lab.max_size == 30
    @test lab.labels == [3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
                         3, 3, 3, 3, 3, 3, 3, 3, 3, 25, 26, 3, 3, 29, 3, 3,
                         3, 3, 3, 35]
    @test sum(lab.sizes) == lat6b.n
    @test count(>(0), lab.sizes) == lab.count
    @test lab.max_label == maximum(lab.labels)

    # Labelling agrees with the independent union-find statistics.
    lat8 = build_lattice("square", 8)
    model = Percolation(lat8, "bond")
    sample!(model, 0.5, Rng(7))
    st = analyze!(model)
    lab8 = label_clusters(lat8.n, lat8.eu, lat8.ev, model.open)
    @test lab8.count == st.count
    @test lab8.max_size == st.max_size
    @test sum(lab8.sizes) == lat8.n
    @test sort(filter(>(0), lab8.sizes); rev = true) == Int.(st.sizes)
    for e in 1:lat8.m
        if model.open[e] != 0
            @test lab8.labels[Int(lat8.eu[e]) + 1] ==
                  lab8.labels[Int(lat8.ev[e]) + 1]
        end
    end

    # Site labels skip inactive vertices and use -1 for them.
    lat4b = build_lattice("square", 4)
    active = UInt8[v % 3 != 0 ? 0x01 : 0x00 for v in 0:(lat4b.n - 1)]
    site_lab = label_clusters(lat4b.n, lat4b.eu, lat4b.ev, nothing, active)
    @test sum(site_lab.sizes) == sum(active)
    for v in 0:(lat4b.n - 1)
        if active[v + 1] == 0
            @test site_lab.labels[v + 1] == -1
        end
    end
end

@testset "Site Newman-Ziff and message passing" begin
    # ---- nz_site_square8_seed5_cp16 (data/golden/algorithms-v3.json)
    lat8 = build_lattice("square", 8)
    site = newman_ziff_site(lat8, Rng(5); checkpoints = 16)
    @test site.n == 64
    @test site.p == [0.0625, 0.125, 0.1875, 0.25, 0.3125, 0.375, 0.4375, 0.5,
                     0.5625, 0.625, 0.6875, 0.75, 0.8125, 0.875, 0.9375, 1.0]
    @test site.smax == [1, 2, 6, 8, 13, 15, 17, 22, 26, 34, 41, 45, 52, 56, 60, 64]
    @test site.nclusters == [4, 7, 5, 4, 5, 5, 5, 5, 5, 3, 2, 2, 1, 1, 1, 1]
    golden_chi2 = [0.0625, 0.15625, 0.71875, 1.40625, 2.875, 3.875, 5.0, 8.0,
                   11.0, 18.34375, 26.40625, 31.78125, 42.25, 49.0, 56.25, 64.0]
    @test length(site.chi2) == length(golden_chi2)
    for i in eachindex(golden_chi2)
        @test isapprox(site.chi2[i], golden_chi2[i]; atol = 1e-12, rtol = 0)
    end

    # One checkpoint records the full box; an empty lattice stays empty.
    one = newman_ziff_site(build_lattice("square", 6), Rng(1); checkpoints = 1)
    @test one.p[end] == 1.0
    @test one.smax[end] == 36
    @test one.nclusters[end] == 1
    # The 1x1 lattice has one site and no edges: the single checkpoint is p = 1.
    tiny = newman_ziff_site(build_lattice("square", 1), Rng(1); checkpoints = 4)
    @test tiny.p == [1.0] && tiny.smax == [1]
    @test tiny.chi2 == [1.0] && tiny.nclusters == [1]

    # ---- message_k5_T04: complete graph on 5 sites, T = 0.4
    k5u = Int[]
    k5v = Int[]
    for i in 0:4
        for j in (i + 1):4
            push!(k5u, i)
            push!(k5v, j)
        end
    end
    mp = message_passing_percolation(5, k5u, k5v, 0.4)
    @test mp.converged
    @test mp.iterations >= 1
    @test isapprox(mp.S, 0.5415026221328071; atol = 1e-10, rtol = 0)
    @test length(mp.outside) == 5
    for value in mp.outside
        @test isapprox(value, 0.45849737786719297; atol = 1e-10, rtol = 0)
    end

    # A finite tree has no giant component; T = 1 on a connected graph has all.
    tree = message_passing_percolation(4, [0, 1, 2], [1, 2, 3], 0.5)
    @test tree.S == 0.0
    for value in tree.outside
        @test isapprox(value, 1.0; atol = 1e-12, rtol = 0)
    end
    @test tree.converged

    tri = message_passing_percolation(3, [0, 1, 2], [1, 2, 0], 1.0)
    @test tri.S == 1.0
    @test all(iszero, tri.outside)
    @test tri.converged

    # Degenerate sizes and input validation.
    none = message_passing_percolation(0, Int[], Int[], 0.5)
    @test none.S == 0.0 && isempty(none.outside) && none.converged
    isolated = message_passing_percolation(3, Int[], Int[], 0.5)
    @test isolated.S == 0.0 && isolated.outside == ones(3)

    @test_throws ArgumentError message_passing_percolation(2, [0], [1], 1.5)
    @test_throws ArgumentError message_passing_percolation(2, [0], [1], -0.1)
    @test_throws ArgumentError message_passing_percolation(2, [0], [1], 0.5;
                                                           max_iter = 0)
    @test_throws ArgumentError newman_ziff_site(lat8, Rng(1); checkpoints = 0)
    @test_throws ArgumentError newman_ziff_site(lat8, Rng(1); checkpoints = -3)
end

