---
id: 14-sources
part: Reference
order: 14
title: Quellen, Korrekturen und Pflege
subtitle: Wie die Zahlen geprüft werden, was sich geändert hat und wie man den Atlas am Leben hält
reading: 14 min
---

Ein Nachschlagewerk ist nur so gut wie seine Herkunft. Dieses letzte Kapitel hält fest, woher die Behauptungen stammen, welche exakt und welche numerisch sind, was in dieser Ausgabe korrigiert wurde und wie das Repository zu pflegen ist, ohne die Garantien zu brechen, die es nützlich machen.

## 14.1 Redaktionelle Regeln

Fünf Regeln bestimmen den Inhalt.

1. **Primärquellen für Ergebnisse.** Ein Theorem wird mit der Arbeit oder dem Buch zitiert, das es beweist, nicht mit einer Übersichtsarbeit, die es erwähnt. Hat ein Ergebnis eine lange Geschichte, werden sowohl das Original als auch die moderne Standardreferenz angegeben.
2. **Exakt, numerisch oder vermutet.** Jeder Exponent und jede Schwelle trägt eine dieser Kennzeichnungen. Ein numerischer Wert wird mit der Genauigkeit angegeben, die seine Quelle stützt, nicht mit der Genauigkeit eines Zeichenwerkzeugs. Eine Vermutung wird Vermutung genannt, auch wenn sie allgemein geglaubt wird.
3. **Kein stilles Runden.** Wo ein Wert gerundet wird, bleibt die Unsicherheit der Quelle erhalten. Widersprechen sich zwei Quellen in der letzten Stelle, wird der konservative Wert verwendet und die Abweichung vermerkt.
4. **Keine erfundenen Zitate.** Lässt sich eine Behauptung nicht auf eine Quelle zurückführen, wird sie entweder entfernt oder ausdrücklich als heuristisches Argument gekennzeichnet. Die Bibliographie in der Quellenansicht wird aus `content/references.json` erzeugt; jeder Eintrag dort hat einen DOI, eine stabile Verlags-URL oder eine ausdrückliche Notiz für Literatur aus der Zeit vor den DOIs.
5. **Korrekturen sind öffentlich.** Eine Korrektur wird datiert und in Abschnitt 14.3 beschrieben. Eine falsche Aussage zu entfernen, ohne sie zu protokollieren, lässt den nächsten Leser denselben Fehler wiederholen.

Der Text ist dafür geschrieben, von einem Menschen gelesen zu werden. Die mathematische Notation ist Standard; nicht definierter Jargon wird beim ersten Auftreten erklärt; rhetorischer Zierrat wird auf ein Minimum beschränkt. Die drei Sprachausgaben sind von Autorinnen und Autoren verfasst und nicht zur Laufzeit maschinell übersetzt. Die Fachbegriffe folgen dem Glossar in `docs/EDITORIAL.md`, damit die Suche nach „threshold“ in jeder Ausgabe dasselbe Konzept findet.

## 14.2 Wie eine Literaturangabe zu lesen ist

Die Bibliographie verwendet Autoren-Jahr-Schlüssel im Text und vollständige Einträge in der Quellenansicht. Für einen Zeitschriftenartikel nennt der Eintrag Autoren, Titel, Zeitschrift, Band, Seiten, Jahr und DOI. Für ein Buch wird die tatsächlich verwendete Auflage angegeben. Für ein Rechenergebnis werden der Algorithmus, die Stichprobengrößen und der Seed angegeben, soweit sie Teil der Behauptung sind.

Zwei Konventionen verdienen es, genannt zu werden. Erstens ist das Jahr das Jahr der tatsächlich eingesehenen Version. Ein Preprint von 2016 und eine Zeitschriftenversion von 2017 sind verschiedene Objekte; der Eintrag sagt, welches gemeint ist. Zweitens verweist ein DOI auf den Datensatz des Verlags, nicht auf eine Kopie der Arbeit. Der Atlas hostet keine urheberrechtlich geschützten PDFs.

## 14.3 Korrekturen in dieser Ausgabe

Die folgenden Fehler wurden in früheren Entwürfen dieses Atlas und in der ersten Veröffentlichung seines Codes gefunden. Sie sind mit der Korrektur und, soweit relevant, mit der numerischen Konsequenz aufgeführt.

| # | Ort | Frühere Aussage | Korrektur |
|---|---|---|---|
| 1 | Kaskade gekoppelter Netzwerke, Kapitel 10, Lab, C++/Julia/Python/JS-Bibliothek und Benchmark | Schicht A und Schicht B wurden jeweils auf ihre eigene Riesenkomponente ausgedünnt, ohne die beiden überlebenden Mengen zu schneiden. | Bei Eins-zu-eins-Kopplung überlebt ein Knoten nur, wenn er in beiden Riesenkomponenten liegt. Die Runde ist ein Durchschnitt. Die Paritätssonde änderte sich für Seed 11 von 0.668 auf 0.5306666666666666, und die Benchmark-Kurve liegt nahe $p_c$ niedriger. |
| 2 | Random-Cluster-Kapitel | Der kritische Punkt des Ising-Modells auf dem Quadratgitter wurde bei $p=1/2$ angesetzt. | Der selbstduale Punkt für $q=2$ ist $p_c=\sqrt2/(1+\sqrt2)=0.585786\ldots$. Der Wert $1/2$ ist der Perkolationspunkt für $q=1$. |
| 3 | Random-Cluster-Kapitel | Die Dualität wurde für jedes $q$ als $p\mapsto1-p$ beschrieben. | Auf dem Quadratgitter ist die selbstduale Kurve $p=\sqrt q/(1+\sqrt q)$; $p\mapsto1-p$ ist der Sonderfall $q=1$. |
| 4 | Diskussion der Leitfähigkeit, Kapitel 13 | Der zweidimensionale Leitfähigkeitsexponent $t\approx1.299$ wurde als exakt bekannt bezeichnet. | Er ist ein hochpräziser numerischer Wert (Grassberger 1999), kein Theorem der konformen Feldtheorie. |
| 5 | Kontinuums-Lab und Kapitel 12 | Der Abdeckung wurde eine Schwelle bei $\lambda=0$ zugeschrieben, im Gegensatz zur Konnektivität bei $\lambda_c\approx1.128$. | Die Abdeckung ist die glatte Funktion $1-e^{-\lambda}$; sie hat keine Schwelle. Die Perkolationsschwelle des Poisson-Scheibenmodells ist die separate Größe $\lambda_c\approx1.128$ (Flächenanteil $\approx0.676$). |
| 6 | Universalitätsdiskussion, Kapitel 6 und 13 | „Jedes periodische planare Gitter hat dieselben Exponenten“ wurde als Theorem formuliert. | Das Theorem gilt für das Dreiecksgitter und seine Stern-Dreieck-Verwandten. Der allgemeine planare Fall ist eine durch Numerik gestützte Vermutung. |
| 7 | Schärfe-Kapitel | Die Stetigkeit bei $p_c$ wurde nur für $3\le d\le5$ als offen bezeichnet. | Sie ist in $d=2$ und in hinreichend hohen Dimensionen bekannt und im Zwischenbereich offen; das Kapitel formuliert es jetzt so. |
| 8 | Schwellentabelle, 3D-Werte | Die 3D-Werte für BCC/FCC/Diamant wurden Lorenz–Ziff (1998) zugeschrieben. | Lorenz–Ziff bestimmten die *Bond*-Schwellen für sc, fcc und bcc; die Site- und Diamantwerte sind van der Marck (1997) entnommen, die sc-Werte Wang et al. (2013). |
| 9 | Kapitel 12 | Die heterogene Herdenimmunitätsschwelle wurde ohne die Übertragbarkeit als $1-1/(\kappa-1)$ geschrieben. | Die allgemeine Form ist $v_c=1-1/R_0$ mit $R_0=T(\kappa-1)$; der einfachere Ausdruck ist der Sonderfall $T=1$. |
| 10 | Kapitel 13 | „Peridemic graph“ und die Behauptung, exakte Perkolationsschwellen seien für endliche Graphen #P-schwer. | Der Begriff ist zu „percolation graph“ korrigiert. Die Komplexitätsaussage unterscheidet nun die Zuverlässigkeit endlicher Graphen (#P-schwer) von der Rückgewinnung einer Volumen-Schwelle. |
| 11 | Benchmark-Harness | Die Ablehnungsgrenze in `scripts/bench.cpp` wurde in 32-Bit-Arithmetik berechnet und lief bei einer Halbkantenzahl, die $2^{32}$ teilt, auf null über; die Shuffle-Schleife lief dadurch endlos. | Die Grenze wird jetzt in 64-Bit-Arithmetik berechnet. Die vier Bibliotheken waren nicht betroffen; ihre Sampler nutzten bereits 64-Bit- oder exakte Ganzzahlarithmetik. |
| 12 | Cardy-Formel, Kapitel 7, Cardy-Lab, vier Bibliotheken und Golden-Proben | Die hypergeometrische Funktion wurde mit dem Argument $-\ell$ ausgewertet; die Kurve ergab $\pi(0.1)=0.2585$, $\pi(10)=0.7414$ und war bei mäßigen Seitenverhältnissen viel zu flach. | Das richtige Argument ist der Ellipsenmodul $m$ mit $\ell=K(m)/K(1-m)$. Korrekte Werte: $\pi(0.1)=4.03949\times10^{-5}$, $\pi(1)=0.5$, $\pi(10)=0.9999596$. Bibliotheken, Lab, Tests und Golden-Werte wurden aktualisiert. |
| 13 | Kapitel 3, Satz 3.4 und Peierls-Argument | Der Satz von Hammersley wurde als $1/(\Delta-1)\le p_c\le1/\lambda$ mit einem Zweitmomentbeweis der oberen Schranke formuliert. Die Peierls-Reihe wurde bei $x<1$ durch $x/(1-x)$ abgeschätzt. | Die obere Schranke ist falsch: Auf $\mathbb{Z}^2$ gilt $1/\lambda=0.3790\ldots$, aber $p_c=1/2$. Der Satz gibt jetzt nur $p_c\ge1/\lambda\ge1/(\Delta-1)$ an; die Zweitmomentvoraussetzung gilt nur nahe $p=1$, und die obere Schranke $p_c<1$ stammt von Peierls. Die Peierls-Reihe ist $x/(1-x)$ mit $x=c_d(1-p)$ und unterschreitet $1$ nur für $x<1/2$; die Schranke lautet jetzt $p_c\le1-1/(2c_d)$. |
| 14 | Kapitel 9, Proposition 9.1, alle drei Sprachen | Der Fortuin–Kasteleyn-Beweis verwendete $e^{-\beta(1-\delta)}=1+(e^{\beta}-1)\delta$, was bei $\delta=1$ versagt, und fügte anschließend einen überflüssigen Faktor $(1-p)^{-|E|}$ ein. | Die richtige Identität ist $e^{-\beta(1-\delta)}=e^{-\beta}+(1-e^{-\beta})\delta=(1-p)+p\delta$. Die Entwicklung des Produkts ergibt $Z_{\text{Potts}}=\sum_\omega p^{|\omega|}(1-p)^{|E|-|\omega|}q^{k(\omega)}=Z_G(p,q)$ exakt, ohne Vorfaktor. |
| 15 | Kapitel 6, Exponententabelle | Die Zeile für gerichtete Perkolation war mit $2+1$D beschriftet, gab aber $\beta=0.276$, $\gamma=2.277$, $\nu_\perp=1.096$ an. | Das sind die $1+1$D-Werte. Die $2+1$D-Klasse hat $\beta\approx0.584$ und $\nu_\perp\approx0.733$. Die Zeile ist jetzt mit $1+1$D beschriftet, passend zum gerichteten Gitter im Labor. |
| 16 | Kapitel 1 und 3, Suszeptibilität und Satz 3.6 | $\chi$ war ohne den unendlichen Cluster definiert, aber Satz 3.6 verwendete $\sup\{p:\chi(p)<\infty\}=p_c$. Ohne den unendlichen Cluster ist $\chi$ oberhalb von $p_c$ endlich, und das Supremum ist $1$. | $\chi$ enthält jetzt den unendlichen Cluster: $\chi=\mathbb{E}_p|C_0|$, mit $\chi=\infty$, sobald $\theta>0$. Damit ist Satz 3.6 korrekt. |
| 17 | Kapitel 4, Proposition 4.3, sowie Kapitel 7 und 11 | Der Text behauptete $\mathbb{P}_{1/2}(\text{LR-Durchgang von }\Lambda_n)=1/2$ für jedes $n$ und vertauschte die endlichen Boxwerte (die $4\times4$-Box sollte $3/4$ liefern). | Die Proposition behauptet jetzt nur den Grenzwert $\lim_n\mathbb{P}_{1/2}(A_n)=1/2$. Exakte Abzählung ergibt $3/4$ für $2\times2$, $43/64=0.671875$ für $3\times3$ und $82623/131072=0.63036\ldots$ für $4\times4$; die Benchmarkwerte ($0.5275$, $0.5375$, $0.505$ für $L=32,64,128$) werden als Trend berichtet, nicht als Identität. |
| 18 | Kapitel 4, Satz 4.5 und die Kesten-Skizze | Satz 4.5 nannte die triviale Implikation (ein Langrechteck-Durchgang impliziert einen Quadrat-Durchgang), und der Kesten-Absatz behauptete, FKG-Verklebung mache die Durchgangswahrscheinlichkeit exponentiell in der Blockzahl gegen eins. FKG liefert ein Produkt von Unterschranken, das abfällt; die Behauptung war falsch. | Der Satz nennt jetzt die nichttriviale RSW-Richtung: Ein Quadrat-Durchgang mit Wahrscheinlichkeit mindestens $1/2$ erzwingt einen $3n\times n$-Rechteck-Durchgang mit Wahrscheinlichkeit mindestens $\eta>0$. Die Kesten-Skizze nutzt Dualität und Schärfe für Langrechteck-Durchgänge und dann das Leiter-/Renormierungsargument, ohne die falsche Exponentialbehauptung. |
| 19 | Kleinere Korrekturen dieser Revision | Die $d=1$-Zeile gab $d_f=0$ (Relation 1 ergibt $1$); der FSS-Ansatz verwendete $L^{y_A/\nu}$ mit $y_A=d_f$ und $\gamma/\nu$; die Fisher-Relation wurde durch eine Dichteanpassung hergeleitet, die $2-\eta$ ergibt; $\kappa$ wurde Verzweigungsfaktor genannt; $\theta$ sollte bei $p_c$ zweimal differenzierbar sein; die BCC/FCC-Bond-Schwellen wurden allein van der Marck zugeschrieben. | $d_f=1$; der FSS-Vorfaktor ist $L^{y_A}$; Fisher folgt aus den Relationen 1, 2 und 5; der Verzweigungsfaktor ist $\kappa-1$; $\theta$ ist auf $(p_c,1]$ $C^2$ mit einseitigen rechtsseitigen Ableitungen bei $p_c$; BCC/FCC-Bond-Werte stammen von Lorenz–Ziff, Site-Werte von van der Marck. |
| 20 | Bibliographie, PRL 106, 225701 | Die Arbeit war da Costa et al. zugeschrieben; Crossref und die Zeitschrift nennen Grassberger, Christensen, Bizhani, Son und Paczuski. | Der Eintrag heißt jetzt `grassberger2011` und ist neu zugeordnet; die Zitationskarte ist aktualisiert. Das Audit prüft nun den ersten Autor, nicht nur den Titel. |
| 21 | Invasion-Labor und die v3-Golden-Datei | `loops` zählte eine verworfene Kante pro Heap-Eintrag; eine Kante mit zwei besuchten Endpunkten konnte doppelt zählen. Die 16×16-Probe meldete 450 statt 225. | Die Implementierung zählt jede verworfene Kante einmal. Der Golden-Wert ist 225, die Anzeige nutzt den korrigierten Zähler. |
| 22 | Kapitel 19, Dualitäts-Beweisskizze | Die Skizze addierte die Identität für endliche Boxen $\mathbb{P}_{1/2}(\text{LR})+\mathbb{P}_{1/2}(\text{OB})=1$ und schloss, jeder Term sei bei jedem $n$ gleich $1/2$; das widerspricht der Korrektur in Zeile 17. | Die Skizze leitet jetzt nur die Aussage für $n\to\infty$ her, nennt die verschiedene Knotenzahl der dualen Box und verweist auf Proposition 4.3 für den endlichen Fall. |
| 23 | Chinesische und deutsche Fassung, Kapitel 4, Abschnitt 4.3 | Die Übersetzungen enthielten noch die vor der Korrektur gültige RSW-Aussage (ein Langrechteck-Durchgang impliziert einen Quadrat-Durchgang) und die falsche Behauptung einer exponentiellen FKG-Verklebung. | Beide Fassungen stimmen jetzt mit dem korrigierten englischen Abschnitt überein: die nichttriviale RSW-Richtung, die dreistufige Kesten-Skizze und der Randterm-Vorbehalt. Das war ein Übersetzungsrückstand, keine neue mathematische Aussage. |
| 24 | Kapitel 22, Poisson-Baum-Beispiel | Die Rekursion war als $u=e^{-2(0.4+0.6u)}$ gedruckt; das ist nicht die Gleichung der erzeugenden Funktion. | Die richtige Rekursion ist $u=e^{-cp(1-u)}=e^{-1.2(1-u)}$ für $c=2$, $p=0.6$; der angegebene Wert $\theta=0.313698\ldots$ war bereits der Wert des richtigen Fixpunkts und bleibt unverändert. |

Die erste Korrektur war kein Tippfehler im Text, sondern ein algorithmischer Fehler, und sie überlebte, weil der falsche Algorithmus immer noch eine plausible Kurve erzeugte. Die Cardy-Korrektur war ein Formelfehler mit ähnlich großer numerischer Wirkung. Zeile 22 ist der umgekehrte Fehler: Eine korrekte Grenzaussage wurde zu einer Identität für jedes endliche $n$ erhoben. Die Lehre ist in Kapitel 11 festgehalten: Ganzzahlige Zählwerte bei festem Seed sind zu vergleichen, und die Endlichkeitskorrektur gehört in denselben Satz wie der Grenzwert. Zeile 23 ist eine Wartungslehre anderer Art: Eine Korrektur, die nur in einer Ausgabe angebracht wird, bleibt für jeden Test unsichtbar, der nur den englischen Build prüft.

## 14.4 Die Zahlen reproduzieren

Die vollständige Pipeline lautet:

```sh
make test                 # JS, Python, C++ and Julia parity suites
make bench                # builds the C++ harness and writes raw JSON
python3 scripts/analyse_bench.py
python3 scripts/build_content.py
```

`make bench` schreibt `data/raw_bench.json`; der Analysator schreibt `data/benchmarks.json` und gibt den Kollaps-Fit und die Einarm-Steigung aus. Die Website liest `content/manifest.json`, `content/search.json` und `data/benchmarks.json`. Keine dieser erzeugten Dateien sollte von Hand bearbeitet werden.

Die Paritätssonden in `data/golden/parity.json` sind der Vertrag zwischen den vier Bibliotheken. Sie decken einen Durchgangszählwert, ein Newman–Ziff-Kontrollpunkt-Tripel, eine Komponentengröße aus dem Konfigurationsmodell und einen Kaskadenanteil gekoppelter Netzwerke ab. Die Zufallsstrom-Vektoren in `data/golden/rng-seed42.json` legen den Generator selbst fest. Eine Änderung am Zufallsstrom, an der Kantenreihenfolge oder an der Verbrauchsreihenfolge ist eine rückwärts inkompatible Änderung und erfordert neue Golden-Dateien, eine Versionserhöhung und eine Notiz in diesem Kapitel.

## 14.5 Den Atlas pflegen

**Ein Kapitel hinzufügen.** Man lege `content/en/NN-slug.md`, `content/zh/NN-slug.md` und `content/de/NN-slug.md` mit derselben `id`, `order` und Struktur an. Die Referenzen sind in `content/references.json` einzutragen. Anschließend ist `scripts/build_content.py` auszuführen; das Skript schlägt fehl, wenn eine Sprache fehlt oder eine Reihenfolge doppelt vergeben ist. Führt das Kapitel eine berechnete Zahl ein, ist es in die Testmatrix aufzunehmen.

**Ein Labor hinzufügen.** Die Engine gehört nur dann in `assets/js/engine/`, wenn sie Teil des gemeinsamen Vertrags ist. Die Seite gehört in `assets/js/labs/` und ist in `LABS` zu registrieren; mindestens der Titel, die Einleitung, jedes Bedienelement-Etikett und die Anzeigebeschriftungen sind zu lokalisieren. Ein Labor, das nur auf Englisch funktioniert, ist nicht fertig.

**Eine Sprache hinzufügen.** Der Sprachcode ist zu `LANGS` hinzuzufügen, ein Inhaltsverzeichnis anzulegen, eine UI-Stringtabelle hinzuzufügen und `scripts/build_content.py` zu erweitern. Das Layout ist bei 1280, 1440 und 1920 Pixeln zu prüfen; deutsche Beschriftungen sind länger als englische, chinesische kürzer, und ein Layout, das nur zu einer Sprache passt, ist kein Layout.

**Ein Ergebnis aktualisieren.** Die Markdown-Quelle ist zu ändern, nicht das erzeugte JSON. Betrifft das Ergebnis einen Codepfad, ist zuerst ein Regressionstest hinzuzufügen. Ändert es eine veröffentlichte Zahl, ist eine Zeile in Abschnitt 14.3 zu ergänzen und die Minor-Version zu erhöhen.

**Überprüfungsrhythmus.** Einmal im Jahr sind alle DOIs zu prüfen, der Benchmark mit dem aktuellen Compiler erneut auszuführen und die neuen Rohzählungen mit dem vorigen Protokoll zu vergleichen. Eine Änderung der Zählwerte bei gleichem Seed ist entweder ein Compilerfehler, ein plattformabhängiger Gleitkommapfad oder eine Änderung des Algorithmus. Alle drei verdienen Aufmerksamkeit.

## 14.6 Lizenz und Zitierung

Der Text steht unter CC BY 4.0, der Code unter der MIT-Lizenz; siehe `LICENSE` und `LICENSE-CONTENT`. Wer ein bestimmtes Ergebnis zitiert, sollte die Originalquelle ebenso wie den Atlas zitieren; der Atlas ist ein Wegweiser durch die Literatur, kein Ersatz für sie.

Der Atlas wird als statische Website ohne serverseitige Abhängigkeiten gepflegt. Das ist eine bewusste Entscheidung: Er lässt sich archivieren, spiegeln und offline lesen, und er funktioniert noch, wenn das Build-Werkzeug des Monats längst vergessen ist.
