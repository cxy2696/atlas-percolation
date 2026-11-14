---
id: 21-reproducibility
part: synthesis
order: 21
title: Reproduzierbarkeit, Unsicherheit und das Fehlerbudget
subtitle: Von einem Seed zu einer publizierbaren Zahl und zurück
reading: 18 min
---

Ein Ergebnis, das sich nicht reproduzieren lässt, ist eine Geschichte. Dieses Kapitel nennt den Vertrag des Atlas, die Befehle, die ihn prüfen, und die Stellen, an denen ein sorgfältiger Leser weiterhin misstrauisch sein sollte. Das Ziel ist nicht zu behaupten, jede Zahl sei exakt; es ist, jede Zahl auf Seed, Größe, Schätzer und Version zurückzuführen.

## 21.1 Der Artefaktvertrag

Das Repository ist das Artefakt. Fünf Dinge werden gemeinsam versioniert.

1. **Quellen.** Markdown-Kapitel, JSON-Bibliographie, Zitationskarte.
2. **Engine.** C++20, Julia, Python und JavaScript für den Bernoulli-Kern, die v3-Algorithmensammlung, die Etikettierungsroutine und die Baum-/Epidemielöser.
3. **Goldens.** `data/golden/parity.json` für den viersprachigen Kern, `data/golden/rng-seed42.json` für den Zufallsstrom, `data/golden/algorithms-v3.json` für die neuen Algorithmen.
4. **Daten.** Rohe Benchmark-Zählungen und der analysierte Datensatz, samt Harness.
5. **Build und Deployment.** Content-Builder, statischer Server, Python-Paket, API, Dockerfile und CI-Workflows.

Eine Änderung an RNG, Kantenordnung oder Verbrauchsreihenfolge ist eine brechende Änderung. Sie verlangt neue Goldens, eine Versionserhöhung und einen Eintrag in Kapitel 14. Dasselbe gilt für eine Änderung einer Sampling-Konvention, auch wenn der Code noch „richtig aussieht“.

## 21.2 Der Zufallsstrom

Der Generator ist xoshiro128** mit SplitMix32-Seeding. Die Konventionen sind fixiert:

- der Seed wird modulo $2^{32}$ reduziert;
- Seeding führt vier SplitMix32-Schritte aus;
- `random()` verbraucht zwei 32-Bit-Ausgaben, zuerst die hohen 26 Bit, dann die niedrigen 27 Bit, und liefert ein exaktes Vielfaches von $2^{-53}$ in $[0,1)$;
- `int(n)` nutzt Rejection Sampling gegen das größte Vielfache von $n$, das $2^{32}$ nicht überschreitet;
- Platzperkolation zieht $n$ Uniformen in Platzordnung; Bondperkolation zieht $m$ Uniformen in der Kantenordnung von `build_lattice`.

Jede Implementierung folgt dieser Ordnung. Die Golden-Datei speichert Rohausgaben nach einer festen Zahl von Zügen, sodass eine Abweichung auffällt, bevor sie zu einem falschen Exponenten wird. Die vollständige Spezifikation steht in `docs/RNG.md`.

## 21.3 Die Paritätstests

Der Kernvertrag ist viersprachig. `scripts/parity.py` berechnet die Python-Proben, startet `scripts/parity_probe.mjs` für JavaScript und vergleicht beides mit `data/golden/parity.json`; die C++- und Julia-Suiten prüfen dieselben Werte aus derselben Datei.

Die Algorithmensammlung hat einen viersprachigen Vertrag. `scripts/parity_algorithms.py` vergleicht Python und JavaScript bei Bootstrap-Aktivierungszeiten, Invasionsreihenfolge, Leath-Clustergröße und Achlioptas-Trajektorien; die C++- und Julia-Suiten prüfen dieselben Werte aus `data/golden/algorithms-v3.json`, zusammen mit den deterministischen Hoshen–Kopelman-, Bethe- und SIR-Proben.

Ausführen mit:

```sh
python3 scripts/parity.py
python3 scripts/parity_algorithms.py
node --test tests/js/*.test.js
PYTHONPATH=lib/python python3 -m unittest discover -s lib/python/tests -v
```

Ein Paritätstest ist kein statistischer Test. Er sagt, dass zwei Implementierungen bei einer festen Eingabe in einer ganzen Zahl oder einer exakten Komponentengröße übereinstimmen. Das ist die stärkste Prüfung vor einem statistischen Vergleich und die, die die meisten stillen Fehler fängt.

## 21.4 Das statistische Protokoll

Eine Monte-Carlo-Schätzung braucht vier Zahlen: Stichprobenumfang, Seed (oder Seedliste), Schätzer und Unsicherheit. Der Atlas verwendet folgende Regeln.

- **Unabhängige Seeds, kein langer Lauf.** Für eine Schwellenschätzung $R$ unabhängige Seeds, jeweils eine Schätzung, und Mittelwert plus Standardfehler über die $R$ Schätzungen. Ein einzelner langer Lauf unterschätzt die Varianz, weil aufeinanderfolgende Konfigurationen korreliert sind.
- **Gemeinsame Zufallszahlen für Vergleiche.** Beim Vergleich zweier Algorithmen oder Entwürfe dieselben Unordnungsrealisierungen verwenden. Der Vergleich ist gepaart, die Varianz der Differenz viel kleiner als die der einzelnen Mittelwerte.
- **Blockbildung bei korrelierten Sweeps.** Ein Newman–Ziff-Sweep liefert korrelierte Punkte. Fehlerbalken kommen aus unabhängigen Kantenordnungen, nicht aus den $m$ Punkten einer Ordnung.
- **Intervalle, keine Standardabweichungen.** Ein 95%-Intervall berichten. Für Anteile nahe 0 oder 1 Wilson oder Jeffreys; bei wenigen Seeds ein $t$-Intervall und das sagen.
- **Die Stoppregel vorab festlegen.** „Wir liefen, bis es konvergiert aussah“ ist keine Stoppregel. Zahl der Seeds oder Ziel-Halbbreite vorher fixieren.

## 21.5 Das Fehlerbudget

Jede numerische Aussage im Atlas hat ein Fehlerbudget mit fünf Zeilen.

| Quelle | Was sie ist | Kontrolle | Typische Größe |
|---|---|---|---|
| Zufallsstrom | endliche Stichprobe der Unordnung | unabhängige Seeds, gepaarte Vergleiche | $O(n^{-1/2})$ |
| Endliche Größe | $L/\xi$ nicht unendlich | Kollapsfit, Korrekturterm, mehrere $L$ | $O(L^{-1/\nu})$ |
| Diskretisierung | Gitter oder Zeitschritt approximiert Kontinuum | Schritt verfeinern, zwei Auflösungen vergleichen | problemspezifisch |
| Schätzerverzerrung | z. B. $S=0.5$-Kreuzung statt Kollaps | besserer Schätzer, beide berichten | $10^{-2}$ im Lehrbenchmark |
| Modellfehler | Graph oder Besetzungsgesetz falsch | Validierung an zurückgehaltenen Daten, Sensitivität | oft dominant |

Die letzte Zeile ist in Anwendungen am wichtigsten und die, die eine Simulation nicht reduzieren kann. Ein Perkolationsmodell mit perfektem Fehlerbalken auf dem falschen Graphen bleibt falsch.

## 21.6 Eine Abbildung reproduzieren

Jede Abbildung der Data-Ansicht nennt ihren Quelldatensatz und den Befehl. Die Reihenfolge ist:

```sh
make content       # manifest, Suchindex, Code-Inventar neu erzeugen
make bench         # C++-Harness -> data/raw_bench.json
make analyse       # Rohzählungen -> data/benchmarks.json
make test          # vier Sprachsuiten + Parität
make serve         # http://127.0.0.1:8788/
```

Der Benchmark ist ein Lehrdatensatz, keine Hochpräzisionsmessung. Er ist so bemessen, dass er in Minuten läuft und Endlichkeitsverhalten sichtbar macht. Die Data-Ansicht zeigt Stichprobenumfang, Seed und Datum; fehlt die Datei, zeigt sie die Befehle, statt eine Kurve zu erfinden.

## 21.7 Das Algorithmenpaket

Das Python-Paket ist die distribuierbare Form der Engine.

```sh
python3 -m pip install -e lib/python
atlas-perc info
atlas-perc sample --lattice square --mode bond --L 128 --p 0.5 --seed 42
atlas-perc sweep  --lattice square --L 64 --seed 7
atlas-perc bootstrap --L 64 --p 0.55 --r 3 --seed 11
atlas-perc invasion  --L 48 --seed 3
atlas-perc explosive --n 2000 --rule product --seed 7
atlas-perc serve --port 8080
```

`atlas-perc serve` liefert die statische Seite plus eine JSON-API:

| Route | Zweck |
|---|---|
| `GET /api/health` | Version, Build-Zeit, Engine-Status |
| `GET /api/thresholds` | exakte und numerische Schwellen mit Status |
| `POST /api/sample` | eine Konfiguration, Clusterstatistik |
| `POST /api/sweep` | Newman–Ziff-Kurve |
| `POST /api/bootstrap` | Bootstrap-Abschluss |
| `POST /api/invasion` | Invasionscluster |
| `POST /api/explosive` | Achlioptas-Trajektorie |
| `GET /api/openapi.json` | maschinenlesbares Schema |

Die API ist absichtlich klein und hat keine Authentifizierung. Sie ist ein Referenzdienst, kein produktiver Mehrbenutzerbetrieb. Für eine öffentliche Bereitstellung hinter Rate-Limiter und Reverse Proxy; das Dockerfile ist ein Ausgangspunkt, kein gehärtetes Gerät.

## 21.8 Eine Berichtscheckliste

Bevor eine Perkolationszahl das Notizbuch verlässt, beantworten Sie diese Fragen.

- [ ] Ist das Modell als Graph plus Besetzungsgesetz formuliert?
- [ ] Sind die Randbedingungen genannt (offen, periodisch, verdrahtet)?
- [ ] Ist der Schätzer definiert, und ist er der tatsächlich berechnete?
- [ ] Ist der Stichprobenumfang angegeben und der Seed archiviert?
- [ ] Ist die Unsicherheit ein Standardfehler, ein Konfidenzintervall oder eine Standardabweichung?
- [ ] Ist die Endlichkeitskorrektur geschätzt, oder ist die Aussage explizit asymptotisch?
- [ ] Ist der Wert als exakt, numerisch oder vermutet gekennzeichnet?
- [ ] Ist die Codeversion oder der Commit festgehalten?
- [ ] Reproduziert eine zweite Implementierung die ganzzahligen Proben?
- [ ] Ist der Versagensmodus des Modells genannt?

Wer alle zehn beantworten kann, kann die Zahl reproduzieren. Wer nicht, hat eine Geschichte, kein Ergebnis.

## 21.9 Was sich nicht reproduzieren lässt

Drei Dinge in diesem Atlas sind nicht bitgenau reproduzierbar.

1. **Wanduhrzeiten.** Das Algorithmen-Studio berichtet Browserzeiten zur Lehre; sie hängen von Maschine, JIT und Last ab. Für Messungen zum Vergleich von Implementierungen den C++-Harness nutzen.
2. **Fließkomma-Transzendenzfunktionen.** `sin`, `exp`, `log` und die hypergeometrische Auswertung können sich in den letzten Bits zwischen libm-Versionen unterscheiden. Die Goldens nutzen für diese Werte Toleranzen und exakte Gleichheit nur für ganze Zahlen und Komponentengrößen.
3. **Eine veröffentlichte Webseite.** Die Live-Seite kann sich nach einem Release ändern. Der Repository-Tag und das archivierte `_site/`-Artefakt sind die reproduzierbaren Objekte; die URL ist Bequemlichkeit.

Diese Grenzen explizit zu nennen ist Teil der Reproduzierbarkeitsbehauptung, kein Widerspruch zu ihr.
