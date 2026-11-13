[English](README.md) · [简体中文](README_cn.md) · **Deutsch**

# Percolation Atlas

[![CI](https://github.com/cxy2696/atlas-percolation/actions/workflows/ci.yml/badge.svg)](https://github.com/cxy2696/atlas-percolation/actions/workflows/ci.yml) [![Pages](https://github.com/cxy2696/atlas-percolation/actions/workflows/pages.yml/badge.svg)](https://github.com/cxy2696/atlas-percolation/actions/workflows/pages.yml) [![Release](https://img.shields.io/github/v/release/cxy2696/atlas-percolation?label=release)](https://github.com/cxy2696/atlas-percolation/releases)

Ein dreisprachiger, quellenbelegter Atlas der Perkolationstheorie mit vier Referenzimplementierungen, fünfzehn interaktiven Laboren und einem Algorithmen-Lesebuch mit dreizehn Einträgen. Die Seite ist ein statisches HUD ohne Abhängigkeiten; es liest Markdown, JSON und die JavaScript-Engine direkt und lässt sich archivieren oder von jedem statischen Host ausliefern.

**Aktueller Inhalt:** 23 Kapitel auf Englisch, vereinfachtem Chinesisch und Deutsch · 15 Labore · 13 Code-Rundgänge · 4 Sprachimplementierungen · 125 Quellen · ein per pip installierbares Algorithmuspaket. Die Seite öffnet standardmäßig **im hellen Modus, auf Englisch**, und merkt sich die getroffene Wahl.

## Inhalt

| Ebene | Inhalt |
|---|---|
| Wissensbasis | 23 Kapitel von der Gründungsarbeit von 1957 über Dualität, Schärfe, Exponenten, SLE, Random-Cluster-Modelle, Netzwerke, Messung, Anwendungen, Algorithmen, gerichtete und Kontinuumsperkolation, Transport, die fächerübergreifende Landkarte, einen Beweisanhang, Entwurf unter Unsicherheit, Reproduzierbarkeit, Bäume und erzeugende Funktionen bis hin zu Epidemien als Perkolation |
| Quellen | 125 Quellen (Aufsätze, Bücher, Blognotizen, Software) mit DOI- oder URL-Links, ein Crossref/HTTP-Prüfprotokoll (123 verifiziert, 2 erläuternde Anmerkungen), Quellenlisten je Kapitel und eine Errata-Tabelle |
| Code | C++20 (header-only), Julia, Python und JavaScript, alle mit demselben xoshiro128**-Strom und derselben Kantenreihenfolge des Gitters |
| Labore | Gitterperkolation, Durchgangskollaps, Newman–Ziff-Sweep, Netzwerkrobustheit, gekoppelte Kaskaden, das Boolesche Modell, Cardys Formel, gerichtete Perkolation, Random-Cluster/Potts, Bootstrap-Perkolation, explosive Perkolation, Invasion-Perkolation, ein Algorithmen-Studio, der Bethe-Baum und SIR als Perkolation |
| Algorithmen | Ein Lesebuch mit dreizehn Einträgen: Bernoulli-Sampler, DSU, Newman–Ziff für Kanten und Plätze, Leath, Bootstrap, Invasion, Achlioptas, k-Kern, Hoshen–Kopelman, der Bethe-Fixpunkt, die SIR-Endgröße und Botschaftspassage. Jeder Eintrag nennt die Idee, die Invariante, die Kosten, die Fallstricke und verlinkt die genaue Quelle. |
| Daten | Ein C++-Benchmark-Harness, ein Python-Analysator und ein JSON-Datensatz, den die Datenansicht liest, ohne fehlende Daten zu verbergen |
| Tests | Ganzzahlgenaue Paritätsprüfungen über alle vier Implementierungen, einschließlich der Algorithmensammlung, der v4-Löser für Bäume und Epidemien, des Platz-Sweeps und der Botschaftspassage; RNG-Golden-Vektoren, Eigenschaftstests und eine Quellenprüfung |
| Beispiele | Nebeneinander gestellte Aufrufe desselben Experiments in allen vier Sprachen: `docs/EXAMPLES.md`; die Landkarte zum Codelesen: `docs/ALGORITHMS.md`; eine CLI und JSON-API: `docs/API.md` |

**Live-Seite:** <https://cxy2696.github.io/atlas-percolation/> · **Wiki:** <https://github.com/cxy2696/atlas-percolation/wiki> (Quelltext in `wiki/`) · **Release:** [v4.1.0](https://github.com/cxy2696/atlas-percolation/releases/tag/v4.1.0) · **Paket:** `pip install -e lib/python`

## Schnellstart

Voraussetzungen: Python 3.10+, Node.js 20+ für die Tests und den Website-Build sowie ein C++20-Compiler. Julia 1.9+ wird nur für die Julia-Suite benötigt.

```sh
git clone https://github.com/cxy2696/atlas-percolation.git
cd atlas-percolation

python3 scripts/build_content.py     # manifest, search index, code inventory
python3 scripts/serve.py 8788        # http://127.0.0.1:8788/
```

Zum Öffnen `http://127.0.0.1:8788/` aufrufen. Die Seite muss über HTTP ausgeliefert werden; der Inhaltslader verwendet `fetch()`, das Browser für `file://`-URLs blockieren.

Die Standardroute ist der Einstiegsleitfaden (`#/en/guide`), auf Englisch und im hellen Modus. Die neun Hauptansichten sind `#/en/guide`, `#/en/overview`, `#/en/atlas`, `#/en/labs`, `#/en/code`, `#/en/algorithms`, `#/en/data`, `#/en/library` und `#/en/sources`. Ersetzt man `en` durch `zh` oder `de`, wechselt die Sprache; der Umschalter steht auch in der Kopfzeile, und die Wahl wird in `localStorage` gespeichert.

## Die Prüfungen reproduzieren

```sh
make test          # four suites + parity + translation structure + prose claims
make verify        # translation structure + prose claims + reference audit
make bench         # C++ harness -> data/raw_bench.json
make analyse       # raw JSON -> data/benchmarks.json
make content       # rebuild manifest/search/code inventory
make audit         # Crossref/HTTP reference audit
make package       # wheel + sdist for the Python algorithm package
```

Oder eine einzelne Suite ausführen:

```sh
node --test tests/js/*.test.js
PYTHONPATH=lib/python python3 -m unittest discover -s lib/python/tests -v
make -C lib/cpp test
julia --project=lib/julia lib/julia/test/runtests.jl
```

Der Paritätsvertrag steht in `data/golden/parity.json`; die Vektoren des Zufallsstroms stehen in `data/golden/rng-seed42.json`; die Prüfungen für die Algorithmensammlung, die v4-Löser, den Platz-Sweep und die Botschaftspassage stehen in `data/golden/algorithms-v3.json` und werden von allen vier Suiten geprüft. Eine Änderung an der RNG, der Kantenreihenfolge des Gitters oder der Verbrauchsreihenfolge ist eine inkompatible Änderung: Goldens neu erzeugen, Version erhöhen und in Kapitel 14 festhalten. Die genaue Prüfmatrix und ihre Grenzen stehen in [`docs/VERIFICATION.md`](docs/VERIFICATION.md).

## Benchmark-Pipeline

```sh
make bench
make analyse
```

`scripts/bench.cpp` schreibt nur Rohzählungen (`n`, `hits`, Größen) und den Seed. `scripts/analyse_bench.py` ergänzt abgeleitete Größen, die Cardy-Kurve, einen Kollaps-Fit und eine Einarm-Steigung und versieht den Datensatz mit seinem Erzeugungszeitpunkt. Die Datenansicht liest `data/benchmarks.json`; fehlt die Datei, zeigt sie die obigen Befehle, statt eine Kurve zu erfinden.

Der Benchmark ist ein Lehrdatensatz, keine Hochpräzisionsmessung. Er ist so bemessen, dass er auf einem Laptop in Minuten läuft und das Finite-Size-Verhalten sichtbar macht. Kapitel 11 sagt, was er stützen kann und was nicht.

## Algorithmuspaket, CLI und API

Das Python-Paket ist die distribuierbare Form der Engine. Es hat außer der Standardbibliothek keine Laufzeitabhängigkeiten.

```sh
python3 -m pip install -e lib/python

atlas-perc info
atlas-perc sample    --lattice square --mode bond --L 128 --p 0.5 --seed 42
atlas-perc sweep     --lattice square --L 64 --seed 7
atlas-perc bootstrap --L 64 --p 0.55 --r 3 --seed 11
atlas-perc invasion  --L 48 --seed 3
atlas-perc explosive --n 2000 --rule product --seed 7
atlas-perc serve     --port 8080
```

`atlas-perc serve` liefert die statische Seite und eine JSON-API unter `/api`
(`/api/health`, `/api/thresholds`, `/api/sample`, `/api/sweep`,
`/api/bootstrap`, `/api/invasion`, `/api/explosive`, `/api/openapi.json`).
Die API ist ein Referenzdienst mit begrenzten Eingaben und ohne
Authentifizierung; wer sie öffentlich zugänglich macht, sollte sie hinter einen
Reverse-Proxy legen. Siehe `docs/API.md`.

Deployment-Optionen: GitHub Pages (die kanonische Seite), Docker
(`Dockerfile`), Netlify, Vercel und Fly.io. Einzelheiten stehen in
[`deploy/DEPLOY.md`](deploy/DEPLOY.md).

## Theme, Leitfäden und Barrierefreiheit

Beim ersten Besuch ist die Sprache Englisch und das Theme hell. Eine gespeicherte Wahl hat Vorrang; `?theme=dark` und `?theme=light` überschreiben sie zum Teilen und für Screenshots. Der Theme-Schalter steht in der oberen Leiste, und jede Zeichenfläche wird aus dem aktiven Stylesheet neu gezeichnet.

Jedes Labor enthält einen eigens verfassten Leseleitfaden auf Englisch, vereinfachtem Chinesisch und Deutsch: was das Bild zeigt, was jeder Parameter bewirkt, wie die Dynamik zu lesen ist, was man ausprobieren kann und wo das Modell endet. Der Hell-/Dunkel-Schalter wird in `localStorage` gespeichert, folgt beim ersten Besuch der Systemeinstellung und lässt sich mit `?theme=light` oder `?theme=dark` für Screenshots und zum Teilen erzwingen. Die Farben der Canvas-Diagramme stammen aus dem aktiven Stylesheet, sodass ein Themenwechsel jede Darstellung ohne Neuladen neu zeichnet.

## Repository-Struktur

```
README.md / README_cn.md / README_de.md  Repository-Handbuch in Englisch, Chinesisch und Deutsch
content/
  en/ zh/ de/           chapter Markdown, one file per chapter and language
  reference_audit.json  generated by scripts/verify_references.py
  references.json       primary bibliography (DOI or stable publisher URL)
  citations.json        chapter -> reference keys
  manifest.json         generated; do not edit by hand
  search.json           generated full-text index
  code.json             generated source inventory
data/
  golden/               RNG vectors and cross-language parity probes
  raw_bench.json        generated raw record
  benchmarks.json       generated, analysed record
lib/
  cpp/                  header-only C++20 library + Makefile + tests
  julia/                Julia package + tests
  python/               Python package + tests
  js/                   ES-module engine shared with the site
                        (percolation, site/bond Newman–Ziff, networks,
                         continuum, Cardy, directed, bootstrap, invasion,
                         explosive, Leath, trees and message passing)
assets/
  js/views/             overview, atlas reader, labs, code, algorithms, data, library, sources
  js/labs/              fifteen instruments, with authored guides
  css/hud.css           the HUD shell
scripts/
  build_content.py      validates content and generates JSON
  check_translations.py compares section numbers, equation tags and display blocks across editions
  bench.cpp             C++ raw-data harness
  analyse_bench.py      derived data and fits
  serve.py              static preview server
  verify_references.py  Crossref/HTTP bibliography audit
  parity_algorithms.py  algorithm-zoo, v4 solver and message-parity runner
tests/js/               Node test suite
docs/                   API, RNG, algorithms, data, scaling and editorial notes
wiki/                  GitHub wiki source, published by scripts/push_wiki.sh
```

## Design und Wartung

- **Oberfläche.** Dunkles HUD in Graphit und Cyan, dünne Instrumentenlinien, Monospace-Anzeigen. Die Übersicht ist eine live berechnete isometrische Karte der Kantenperkolation mit einem Schieberegler für das Regime. Bilder, Webfonts und ein Laufzeit-Framework kommen nicht zum Einsatz; die einzigen Fremddateien im Frontend sind die mitgelieferten Builds von KaTeX und marked.
- **Inhalt.** Markdown mit YAML-Frontmatter. Jedes Kapitel hat eine stabile id und in jeder Sprache dieselbe Reihenfolge. `scripts/build_content.py` verweigert den Build, wenn eine Übersetzung unvollständig, eine Reihenfolge doppelt oder eine Zitation unaufgelöst ist; `scripts/check_translations.py` verweigert ein Kapitel, dessen Abschnittsnummern, Gleichungsmarken oder Anzahl der angezeigten Formeln zwischen den Ausgaben auseinanderlaufen.
- **Übersetzungen.** Von Hand verfasst, nicht zur Laufzeit maschinell übersetzt. Die README-Datei des Repositorys ist auf [English](README.md), [简体中文](README_cn.md) und [Deutsch](README_de.md) verfügbar; der Umschalter der Seite wechselt zwischen allen drei Ausgaben. Glossar und Stilregeln stehen in `docs/EDITORIAL.md`. Die Fachbegriffe werden konsistent gehalten, sodass die Suche nach einem Schwellenwert in allen drei Ausgaben denselben Begriff findet. Die Sprachliste, die UI-Tabellen und die Inhaltsordner sind datengetrieben; eine vierte Ausgabe hinzuzufügen ist eine Inhalts- und Redaktionsaufgabe, keine Änderung an der Engine.
- **Barrierefreiheit.** Tastaturnavigation, sichtbare Fokuszustände, semantische Überschriften, ein überspringbarer Hauptbereich und Diagramme mit Textausgabe. Die Farbpalette ist nicht der einzige Bedeutungsträger: Jede Zustandsanzeige hat eine Textbezeichnung. Beide Themes behalten eine auf Kontrast geprüfte Palette bei.
- **Browser-Unterstützung.** Aktuelle Versionen von Chrome, Firefox und Safari mit ES-Modulen und `IntersectionObserver`. Bei deaktiviertem JavaScript bleibt die Seite als lesbares Markdown nutzbar. Komplexitäts- und Speichergrenzen sind in `docs/SCALING.md` dokumentiert.

## Deployment

Das Repository ist bereits eine statische Seite. Man veröffentlicht das Verzeichnis über GitHub Pages, Netlify, einen Object Store oder einen beliebigen statischen Server. Die einzige Voraussetzung ist der Aufbau des Verzeichnisses: `index.html` im Wurzelverzeichnis, daneben `assets/`, `content/` und `data/`.

Der GitHub-Pages-Workflow in `.github/workflows/pages.yml` stellt `index.html`, `assets/`, `content/` und `data/` in `_site/` zusammen und deployt es. Die veröffentlichte URL ist <https://cxy2696.github.io/atlas-percolation/>. Die Seite braucht keinen weiteren Build-Schritt außer `python3 scripts/build_content.py`.

## Umfang und Redlichkeit

Dies ist ein Nachschlagewerk und ein Lehrinstrument. Es ersetzt nicht die Primärliteratur und beansprucht weder neue Theoreme noch neue Präzisionsmessungen. Jeder numerische Wert ist als exact oder numerical gekennzeichnet, und die Errata-Tabelle in Kapitel 14 verzeichnet die in früheren Versionen gefundenen Fehler, einschließlich des Programmfehlers in der gekoppelten Kaskade, der die Paritätsprüfung von 0.668 auf 0.5306666666666666 änderte.

## Lizenz

Code: MIT (`LICENSE`). Text und Abbildungen: CC BY 4.0 (`LICENSE-CONTENT`). Zitationsmetadaten: `CITATION.cff`.
