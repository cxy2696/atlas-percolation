# Verification and provenance

This note says what has been checked, by which command, and what the checks do
not cover. It is deliberately short: the executable evidence is in the test
suites, the golden files and the audit record, not in a claim of correctness.

## One-command verification

```sh
make verify        # translation structure + prose claims + reference audit
make test          # four language suites + both parity contracts + the above structure/claims checks
```

Individual checks:

```sh
python3 scripts/check_translations.py   # section numbers, equation tags, display blocks
python3 scripts/verify_claims.py        # exact counts, Cardy values, exponent identities, fixed points, benchmark, audit totals
python3 scripts/verify_references.py    # Crossref/HTTP bibliography audit (network)
node --test tests/js/*.test.js
PYTHONPATH=lib/python python3 -m unittest discover -s lib/python/tests -v
make -C lib/cpp test
julia --startup-file=no --project=lib/julia lib/julia/test/runtests.jl
```

## What is checked

| Area | Check | Where |
|---|---|---|
| Random stream | seed-42 vectors, 10 000-draw sum and FNV hash | `data/golden/rng-seed42.json` |
| Core parity | crossing counts, NZ checkpoint, configuration model, coupled cascade, directed | `data/golden/parity.json`, C++ and Julia suites |
| Algorithm parity | bootstrap, invasion, Leath, Achlioptas, labels, Bethe, configuration/SIR, site NZ, message passing | `data/golden/algorithms-v3.json`, all four suites |
| Exact small-box counts | 2×2 = 3/4, 3×3 = 43/64 | `scripts/verify_claims.py` (independent enumeration) |
| Cardy formula | π(1), π(0.1), π(10), symmetry | `scripts/verify_claims.py` |
| 2D exponent set | β = 5/36, γ = 43/18, ν = 4/3, δ = 91/5, η = 5/24, d_f = 91/48 and all five scaling identities | `scripts/verify_claims.py` |
| Bethe values | p_c = 1/(z−1), θ(0.6) = 19/27, χ(0.4) = 7, z=2 endpoint | `scripts/verify_claims.py` |
| ER / SIR | S = 0.796812…, κ = 3, T_c = 1/2, R0 = 2 | `scripts/verify_claims.py` |
| Threshold relations | triangular = 2 sin(π/18), honeycomb = 1 − that, kagome site = honeycomb bond | `scripts/verify_claims.py` |
| Benchmark record | L=32/64/128 rates at p=1/2 equal the stored raw counts | `scripts/verify_claims.py` |
| Bibliography | 140 entries, 138 verified, 2 notes, 0 unresolved | `content/reference_audit.json` |
| Translation structure | 23 chapters × 3 editions agree on section numbers, tags and display blocks | `scripts/check_translations.py` |

## Provenance rules

1. **Primary sources for results.** A theorem is cited to the paper or book
   that proves it; reviews are used for orientation, not as the proof.
2. **Exact, numerical, or conjectural.** Every exponent and threshold is
   labelled. Numerical values carry the precision their source supports.
3. **No invented citations.** Every bibliography entry has a DOI, a stable
   publisher URL, or an explicit note for pre-DOI literature. The audit never
   rewrites the bibliography; it records what resolved.
4. **Corrections are public.** Chapter 14 lists the corrections made in each
   edition. A correction applied to one language edition and not the others is
   itself an error; `check_translations.py` exists because that happened.
5. **Seeds and counts.** Benchmark rows store `n` and `hits`, not only a rate;
   parity probes compare integers and exact component sizes for a fixed seed.

## Current record (edition 4.1.0)

```text
chapters: 23 (en, zh, de)
laboratories: 15
algorithm reader: 13
references: 125 (123 ok, 2 explanatory notes)
JS tests: 50
Python tests: 65
C++: all testsets pass
Julia: 461 assertions, all testsets pass
```

The exact counts are printed by the commands above; they are not a promise
that the repository cannot change, only a statement of the edition.

## Limits

- The benchmark is a teaching dataset, not a high-precision measurement.
- The three-dimensional exponents are numerical, not theorems.
- The tree and message-passing answers are exact on trees and asymptotic on
  locally tree-like graphs; on a lattice with short loops they are the Bethe
  approximation, not the lattice answer.
- The SIR mapping gives the final size, not the peak or the time course; the
  temporal-network discussion in Chapter 23 is a warning, not a theorem.
- A Crossref success verifies identity, not the correctness of a claim. The
  numerical checks verify arithmetic, not the literature's derivation.
