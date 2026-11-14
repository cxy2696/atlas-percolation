# References

The bibliography is in [`content/references.json`](https://github.com/cxy2696/atlas-percolation/blob/main/content/references.json); the audit record is [`content/reference_audit.json`](https://github.com/cxy2696/atlas-percolation/blob/main/content/reference_audit.json).

## Current state

- **142 entries**: articles, books, blog notes and software.
- **140 verified** against Crossref (DOI title, year and first author) or by HTTP fetch.
- **2 explanatory notes** where a DOI does not exist or a reissue date differs:
  - Menshikov (1986): no DOI for the translation; bibliographic record given.
  - Stauffer & Aharony: the second edition is dated 1994; the DOI identifies a later CRC reissue (2018).

## Audit it yourself

```sh
python3 scripts/verify_references.py --offline   # schema check, no network
python3 scripts/verify_references.py             # Crossref/HTTP audit
```

The online audit writes `content/reference_audit.json`. It does not rewrite the bibliography.

An entry is:

- `ok` when the title/year/first-author checks agree, or the URL returns HTTP < 400;
- `ok-note` when the entry carries a note explaining the discrepancy;
- `metadata-mismatch` when a DOI resolves to a different paper;
- `unreachable` for a transient network failure.

## A short shelf

For the rigorous core: Grimmett, *Percolation*; Bollobás and Riordan, *Percolation*; Grimmett, *The Random-Cluster Model*. For the physicists' language: Stauffer and Aharony; Christensen and Moloney. For applications: Sahimi, *Applications of Percolation Theory*; Hunt, Ewing and Ghanbarian; Meester and Roy for continuum percolation.

For networks: Newman, *Networks*; Dorogovtsev, *Lectures on Complex Networks*; Bianconi, *Multilayer Networks*. For reviews: Saberi (2015), Li et al. (2021), D'Souza et al. (2019), Boccaletti et al. (2014), Kivelä et al. (2014), Isichenko (1992), Berkowitz and Ewing (1998).

The full annotated shelf is §19.12 of the atlas.

## How to cite

Cite the repository and the primary sources for the specific result. The atlas is a guide to the literature, not a substitute for it.

Next: [[Deployment]].
