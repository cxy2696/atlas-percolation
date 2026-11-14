---
id: 20-design
part: synthesis
order: 20
title: Entwerfen unter Unsicherheit
subtitle: Kanten, Dosen, Füllstoffe und Brandschneisen in einem zufälligen Medium wählen
reading: 22 min
---

Die bisherigen Kapitel beantworten „Was passiert bei dieser Dichte?“. Entwurf stellt die umgekehrte Frage: „Welche Dichte, welche Kanten, welche Zuteilung liefert eine geforderte Zuverlässigkeit zu vertretbaren Kosten?“ Diese Umkehrung verändert die Mathematik. Eine Perkolationsschwelle wird zur Nebenbedingung, ein Potenzgesetz zur Kostenkurve, und eine Endlichkeitskorrektur wird zum Unterschied zwischen sicherem und gescheitertem Entwurf.

## 20.1 Die Entwurfsvorlage

Jedes Entwurfsproblem dieses Kapitels passt in eine Vorlage.

1. **Entscheidungsvariablen.** Welche Kanten hinzufügen ($x_e\in\{0,1\}$), welche Knoten schützen ($y_v$), Füllstoffanteil $\phi$, Brandschneisendichte $\rho$, Sensorenzahl $n$, Kopplungsstärke zwischen Schichten.
2. **Zufälliges Medium.** Die Realisierung offener/geschlossener Elemente, Kontaktübertragung, Porengrößenunordnung oder Brennstoffkonnektivität. Ihr Gesetz ist eine Modellwahl, und die Modellwahl ist Teil der Aussage.
3. **Leistungsfunktional.** Wahrscheinlichkeit eines durchspannenden Clusters, Größe der Riesenkomponente, erwarteter bedienter Anteil, Wahrscheinlichkeit einer Kaskade unter Budget, oder ein Quantil der First-Passage-Zeit.
4. **Kosten.** Geld, Masse, Energie, zusätzliche Kanten, Impfdosen, Wartung. Entwurf ohne Kosten ist ein Wunsch.
5. **Nebenbedingung.** Mindestzuverlässigkeit, Budget, Fairness oder regulatorische Grenze.

Die Ausgabe ist keine Zahl, sondern eine Kurve: Zuverlässigkeit gegen Kosten. Ein Entwurfspunkt ist ein Punkt auf dieser Kurve, und die Kurve ist das nützliche Objekt.

## 20.2 Monotonie ist nicht Submodularität

Kanten hinzuzufügen kann Konnektivität nicht verringern; das Funktional ist also monoton in der Kantenmenge. Monotonie allein liefert keinen guten Greedy-Algorithmus. Die Greedy-Garantie für die Maximierung einer monotonen **submodularen** Funktion braucht abnehmende Erträge: Eine Kante in einer kleinen Menge muss mindestens so viel helfen wie in einer großen.

Für Überdeckungsprobleme (Vereinigung von Scheiben, Influence Maximization mit unabhängiger Kaskade) gilt Submodularität, und Greedy hat eine $(1-1/e)$-Garantie. Bei **Konnektivität** ist es anders: Eine Kante kann in einer großen Menge redundant und in einer kleinen entscheidend sein; die erwartete Größe der Riesenkomponente ist im Allgemeinen nicht submodular. Zwei ehrliche Optionen bleiben.

- Ein submodulares Ersatzziel verwenden (Überdeckung, spektrale Konnektivität, Zahl geschützter Nachfragepaare) und den endgültigen Entwurf am echten Perkolationsziel validieren.
- Eine ableitungsfreie oder gemischt-ganzzahlige Suche mit angegebener Optimalitätslücke verwenden und die Lücke berichten. Eine Greedy-Heuristik ist nicht optimal, nur weil das Ziel monoton ist.

## 20.3 Netze: Robustheit zum Preis

Das Konfigurationsmodell-Ergebnis $f_c=1-1/(\kappa-1)$ mit $\kappa=\langle k^2\rangle/\langle k\rangle$ sagt: Heterogenität schützt gegen zufälligen Verlust und exponiert das Netz gegen gezielten Verlust. Der Entwurf folgt aus beiden Termen.

- **Den Tail kappen.** Eine Gradobergrenze $k_{\max}$ senkt $\kappa$ und macht das Netz unter gezieltem Angriff weniger fragil, zum Preis der Kapazität, die die Hubs lieferten. Die optimale Grenze ist ein Kostenproblem, kein Theorem.
- **Redundanz statt nur Kanten.** Ein zweiter Pfad zwischen zwei Regionen kostet mehr als eine Kante, ändert aber den Versagensmodus von Trennung zu gradueller Degradation.
- **Hubs schützen.** Der Schutz weniger Knoten mit hohem Grad ist effizient gegen gezielten Angriff und nahezu nutzlos gegen zufälligen Verlust. Das Budget folgt dem Bedrohungsmodell, nicht dem Mittelgrad.
- **Die richtige Kurve messen.** Ein Robustheitsaudit, das nur $f_c$ berichtet, versteckt die Kaskade. Berichten Sie $S(f)$ für zufälliges und gezieltes Entfernen, samt Kaskadenrunden.

Bei gekoppelten Infrastrukturen sind die Entwurfsvariablen Kopplungsstärke und Redundanz. Eine eins-zu-eins-Abhängigkeit erzeugt einen Übergang erster Ordnung bei $p_c=2.4554/c$; Teilkopplung oder mehrere Abhängigkeiten stellen einen stetigen Übergang wieder her (Buldyrev et al. 2010; Parshani et al. 2010). Die Ingenieursfrage ist nicht „Ist Kopplung schlecht?“, sondern „Wie viel Kopplung können wir uns zu entfernen leisten?“.

## 20.4 Epidemien: Dosen, Ziele und Timing

Für einen SIR-Prozess auf einem Konfigurationsmodell ist die Endgröße die Riesenkomponente, nachdem jede Kante mit der Kontaktübertragungswahrscheinlichkeit $T$ behalten wurde. Mit $R_0=T(\kappa-1)$ braucht zufällige Immunisierung den Anteil
$$
v_c=1-\frac{1}{R_0}
$$
der Bevölkerung. Gezielte Immunisierung von Knoten mit hohem Grad ist bei schwerem Tail effizienter; der Gewinn ist dort am größten, wo zufällige Zuteilung am schlechtesten ist.

Drei Entwurfswarnungen. Erstens gilt die Formel für ein statisches Netz und eine Markov-Epidemie; zeitliche und verhaltensabhängige Netze verschieben die Schwelle. Zweitens betrifft die Herdenimmunitätsschwelle die Endgröße in einer unendlichen Population, nicht den Peak oder den Zeitverlauf. Drittens ist Fairness eine Nebenbedingung, kein Nachtrag: Die billigste Zuteilung nach Dosen kann die exponierteste Gruppe systematisch unter ihrer lokalen Schwelle lassen.

## 20.5 Materialien und Elektroden: ein schmales Fenster

Ein leitfähiger Verbund braucht das Füllstoffnetz oberhalb seiner Perkolationsschwelle. Die Schwelle wird stärker von der Geometrie als von der Masse bestimmt: Das ausgeschlossene Volumen eines Stabs skaliert mit dem Aspektverhältnis, daher perkolieren Nanoröhren und Graphen bei weit niedrigeren Anteilen als Ruß. Entwurfsvariablen sind Aspektverhältnis, Dispersion, Ausrichtung und Beladung.

Das technische Optimum liegt knapp über der Schwelle, wo die Leitfähigkeit steil mit der Beladung steigt, der Zusatz aber noch aktives Material verdrängt. Das Fenster ist aus zwei Gründen schmal: Die Perkolationsleitfähigkeit ist ein Potenzgesetz, und die Chargenstreuung der effektiven Besetzung ist nahe der Schwelle am größten. Ein Entwurf auf die Fenstermitte scheitert an der Unterseite einer Chargenverteilung; ein Entwurf auf die Oberkante zahlt mit Energiedichte. Die robuste Wahl hängt von den Fehlerkosten ab, nicht vom Mittelwert.

Dieselbe Struktur erscheint in Batterieelektroden, Katalysatorschichten, Festelektrolyten und Wärmeleitpasten: Zwei oder mehr Netze müssen gleichzeitig perkolieren — ein **Zweiphasen**-Perkolationsproblem, nicht zwei unabhängige.

## 20.6 Poröse Medien und Energiespeicher

In porösem Gestein ist der Porenraum der Platzgraph und die Porenhälse sind die Kanten. Das wassergefüllte Teilnetz verdünnt sich mit fallender Sättigung, und die hydraulische Leitfähigkeit verschwindet bei einer kritischen Sättigung. Entwurfsvariablen sind Porengrößenverteilung, Benetzbarkeit und der Kontrast zwischen Kluft und Matrix.

Invasion-Perkolation ist das richtige Modell, wenn die Verdrängung durch die Kapillardruckschwelle und nicht durch zufällige Besetzung gesteuert wird. Der invasive Cluster folgt der Randkante mit der kleinsten Schwelle; der Pfad wird ausgewählt, nicht gezogen. Deshalb ist eine einzelne „kritische Sättigung“ keine Materialkonstante: Sie hängt vom Druckpfad und vom Verhältnis der Halsgrößen ab. Für den Schadstofftransport ist die praktische Ausgabe ein Quantil der Ankunftszeit, nicht ihr Mittelwert; nahe der Schwelle wird der Mittelwert von seltenen schnellen Pfaden dominiert.

## 20.7 Feuer, Sensoren, Bilder und Gewebe

**Waldbrand.** Brennstoffkonnektivität ist der Kontrollparameter. Eine Brandschneise senkt die effektive Dichte; das Perkolationsbild sagt, dass die Änderung der Feuergröße pro Behandlungseinheit nahe der Schwelle am größten ist. Eine Behandlungsdichte, die „fast genug“ ist, ist der schlechteste Ort. Die Entwurfsfrage ist nicht nur wie viel, sondern wo: Eine Barriere, die keinen durchspannenden Pfad schließt, bringt wenig.

**Sensoreinsatz.** Überdeckung und Konnektivität sind verschiedene Funktionale. Überdeckung ist der Flächenanteil der Scheibenvereinigung, bei Poisson-Einsatz $1-e^{-\lambda}$; Konnektivität ist ein durchspannender Cluster mit Einsatz $\lambda_c\approx1.128$ in zwei Dimensionen (Mertens und Moore 2012). Bei $\lambda\approx0.7$ kann das Feld zu 50% bedeckt und trotzdem getrennt sein. Eine Regel, die beides gleichsetzt, überschätzt die Zuverlässigkeit.

**Bildsegmentierung.** Schwellenwertbildung und größte Zusammenhangskomponente ist Perkolation auf einem korrelierten Feld. Die Wahl des Schwellenwerts ist die Wahl von $p$. Hysterese (hohe Schwelle für Keime, niedrige für Wachstum) ist eine Endlichkeitskorrektur eines kritischen Phänomens; sie funktioniert, weil die zwei Schwellen Nukleation und Wachstum der Zielstruktur trennen.

**Gewebezucht.** Ein Gerüst braucht verbundene Poren oberhalb der Zellgrößengrenze. Das relevante Modell ist gewichtete Perkolation: Eine Pore unter dem Zelldurchmesser ist für Migration geschlossen, auch wenn sie geometrisch offen ist. Die Entwurfsvariable ist die Porengrößenverteilung, nicht die mittlere Porosität.

## 20.8 Eine Szenariotabelle

| Bereich | Kontrollvariable | Leistung | Hauptnebenbedingung | Methode | Validierung |
|---|---|---|---|---|---|
| Kommunikationsnetz | neue Kanten, Gradgrenze | Riesenkomponente unter Angriff | Budget, Latenz | Mehrzielsuche + Perkolationsaudit | $S(f)$ zufällig/gezielt |
| Epidemie | Impfdosen, Zielgruppe | Endgröße unter Budget | Dosen, Fairness | Perkolationsschwelle + Zuteilungs-LP | Kontaktnetz-Simulation |
| Strom/Kommunikation | Kopplungsstärke, Redundanz | Kaskadengröße | Kosten, Betriebsgrenzen | gekoppelte Riesenkomponenten | N-1- und N-k-Szenarien |
| Leitfähiger Verbund | Füllstoffanteil, Aspektverhältnis | Leitfähigkeit über Ziel | Viskosität, Kosten | Ausschlussvolumen + Perkolationskurve | Chargenverteilung |
| Batterieelektrode | Additivbeladung, Kalandrieren | Ratenfähigkeit | Energiedichte | Zweiphasen-Perkolationsfenster | Impedanz + Zyklen |
| Poröses Medium | Porengrößenverteilung, Benetzbarkeit | hydraulische Leitfähigkeit | Permeabilität, Kosten | Invasion-Perkolation/Effektivmedium | Coreflood-Daten |
| Waldbrand | Platzierung, Dichte | Feuergrößenverteilung | Budget, Ökologie | Perkolationsschwelle + räumliche Optimierung | Landschaftssimulation |
| Sensorfeld | Zahl, Radius, Platzierung | Überdeckung und Konnektivität | Kosten, Energie | Boolesches Modell + Konnektivitätsaudit | Einsatztest |
| Gerüst | Porengrößenverteilung | Anteil verbundener Poren | Steifigkeit, Fertigung | gewichtete Perkolation | Bildgebung + Zellpenetration |

Die Tabelle ist eine Karte, kein Rezept. Jede Zeile braucht ihre eigene Modellvalidierung; der Perkolationsteil liefert Schwellen und Skalierung, nicht die Amplitude.

## 20.9 Optimierungsalgorithmen, ehrlich

Drei Familien sind nützlich.

- **Exakt auf kleinen Instanzen.** Gemischt-ganzzahlige Programmierung für Kantenauswahl mit Konnektivitätsschnitt, gelöst bis zu einer angegebenen Lücke für Graphen mit einigen hundert Kanten. Das Perkolationsziel wird durch eine deterministische Konnektivitätsbedingung über eine Szenariomenge ersetzt; das Ergebnis ist nur so gut wie diese Menge.
- **Greedy mit Ersatzziel.** Überdeckung, spektrale Konnektivität oder geschützte Nachfragepaare sind submodular oder nahezu. Nutzen Sie die $(1-1/e)$-Garantie für das Ersatzziel und bewerten Sie dann am echten Perkolationsziel neu. Berichten Sie beide Zahlen.
- **Stochastische Suche.** Simulated Annealing oder evolutionäre Suche auf der Kantenmenge, mit Monte-Carlo-Schätzung des Perkolationsziels. Das Rauschen im Ziel gehört zum Algorithmus; nutzen Sie gemeinsame Zufallszahlen für Kandidaten, damit Vergleiche nicht von Stichprobenrauschen dominiert werden.

Ein als optimal bezeichneter Entwurf sollte Ziel, Szenarioverteilung, Löser, Lücke oder Stichprobenzahl und Validierungsmenge nennen. Ohne das bedeutet „optimal“ nur „der beste Punkt, den wir zufällig probiert haben“.

## 20.10 Validierung und die Kosten des Irrtums

Ein Perkolationsentwurf ist eine modellbasierte Entscheidung, und das Modell hat vier Fehlerquellen: Graph, Besetzungsgesetz, Endlichkeitskorrektur und Leistungsschätzer. Ein Validierungsprotokoll sollte jede adressieren.

1. **Ein Netz oder eine Charge zurückhalten.** Auf einer Realisierung fitten, auf einer anderen testen. Ein Entwurf, der nur auf dem Tuning-Graphen funktioniert, ist überangepasst.
2. **Die Endlichkeitslücke berichten.** Wird der Entwurf bei $L=64$ bewertet und bei $L=10^6$ eingesetzt, sagen Sie es und schätzen Sie die Richtung der Verzerrung.
3. **Den Tail belasten.** Bewerten Sie am 5. und 95. Perzentil der unsicheren Parameter, nicht nur am Mittelwert.
4. **Mit einer trivialen Basis vergleichen.** Zufällige Zuteilung, gleichmäßige Beladung, keine Behandlung. Eine komplexe Optimierung, die die Basis um weniger als ihre eigene Unsicherheit schlägt, ist kein Beleg.
5. **Den Versagensmodus nennen.** Trennung, Kaskade, langsame Drift oder eine Schwelle, die mit der Temperatur wandert. Der Modus bestimmt, welche Metrik zählt.

Die ehrliche Zusammenfassung ist unbequem, aber nützlich: Perkolation sagt hervorragend, *wo* die Klippe ist und *wie steil* sie ist, und schlecht, wie hoch der Zaun genau sein muss. Entwerfen Sie mit der Klippe im Blick, messen Sie den Zaun und halten Sie eine Marge für den Teil des Modells, den Sie nicht verifizieren können.
