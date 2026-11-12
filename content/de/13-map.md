---
id: 13-map
part: Reference
order: 13
title: Die fächerübergreifende Landkarte und was noch offen ist
subtitle: Wo dieselbe Mathematik wieder auftaucht und wo nicht
reading: 13 min
---

Die Perkolation ist ein kleines Modell mit einem großen Einzugsgebiet. Dieses Kapitel kartiert die exakten Verbindungen, die genäherten und die bloß metaphorischen – und listet anschließend die tatsächlich offenen Probleme auf, in der Reihenfolge, in der sie lösbar erscheinen.

## 13.1 Exakte Entsprechungen

**Spinmodelle.** Die Random-Cluster-Darstellung (Kapitel 9) macht das $q$-Zustands-Potts-Modell und die Perkolation bei verschiedenen Werten eines Parameters zum selben Maß. Bei $q=1$ ist die Perkolationswahrscheinlichkeit die Potts-Magnetisierung, und die Phasenübergänge fallen zusammen. Das ist eine Identität, keine Analogie, und der Grund dafür, dass Perkolationsexponenten mit der Technik der Spinmodelle berechnet werden können.

**Zufallsgraphen.** Die Erdős–Rényi-Riesenkomponente ist Perkolation auf dem vollständigen Graphen; die Riesenkomponente des Konfigurationsmodells ist Perkolation auf einem zufälligen Multigraphen. Das Molloy–Reed-Kriterium ist die exakte Aussage, und es ist dieselbe Verzweigungsprozessrechnung wie beim Bethe-Gitter.

**Elektrische Netzwerke.** Der Zusammenhang zwischen Perkolation und Widerstandsnetzwerken ist auf der Ebene des Random-Cluster-Modells mit verdrahteten Randbedingungen exakt: Die effektive Leitfähigkeit besitzt eine variationelle (Dirichlet-)Darstellung, die von der Clusterstruktur bestimmt wird, und verschwindet genau dann, wenn kein offener Cluster die Elektroden verbindet. Die Skalierung der Leitfähigkeit ist ein wohldefinierter kritischer Exponent $t$: Hochpräzisionssimulationen ergeben $t\approx1.299$ in zwei Dimensionen (Grassberger 1999) und $t\approx2.0$ in drei Dimensionen. Das sind numerische Werte, keine Theoreme der konformen Feldtheorie. Die Relation $t=\nu(d-2+\zeta)$ definiert den Widerstandsexponenten $\zeta$, und das Versagen der naiven Einstein-Relation ist der „anomale“ Teil.

**Epidemien.** Die Endgröße einer SIR-Epidemie auf einem statischen Netzwerk ist die Riesenkomponente des Perkolationsgraphen – des Netzwerks, in dem jede Kante mit der Übertragungswahrscheinlichkeit pro Kontakt beibehalten wird. Das ist im Limes unendlicher Population exakt.

**Gekoppelte Netzwerke.** Die Kaskade in voneinander abhängigen Netzwerken ist eine Folge von Berechnungen der Riesenkomponente, jeder Schritt ist also exakt; die Molekularfeld-Lösung der Folge ist genähert, der Charakter erster Ordnung jedoch robust.

## 13.2 Genäherte und umstrittene Entsprechungen

**Glasübergänge.** Die dynamische Heterogenität unterkühlter Flüssigkeiten wird oft als „dynamische Perkolation“ mobiler Bereiche beschrieben. Die Phänomenologie ist suggestiv, und die Exponenten stimmen mitunter überein, aber es gibt keine Herleitung der Dynamik aus einem Perkolationsmodell. Man behandle die Entsprechung als Metapher mit Vorhersagewert für Skalierungskollapse, nicht als Identität.

**Neuronale Kritikalität.** Lawinen im kortikalen Gewebe zeigen Größenverteilungen nach einem Potenzgesetz, und Verzweigungsprozessmodelle (die Perkolation auf einem Baum sind) geben sie wieder. Die Gleichsetzung eines *kritischen* Gehirns mit einem kritischen Punkt der Perkolation ist umstritten: Die Exponenten sind nicht über alle Präparate hinweg universell, und die gemessenen Netzwerke sind klein genug, dass Finite-Size-Effekte dominieren.

**Maschinelles Lernen.** Das „Auftauchen“ von Fähigkeiten mit der Skalierung, die Sparsamkeitsschwelle, bei der Pruning ein Netzwerk zerstört, und die Konnektivität zufälliger Merkmalsabbildungen wurden alle in der Sprache der Perkolation beschrieben. Einiges davon ist rigoros (Pruning-Schwellen in zufälligen dünn besetzten Netzwerken sind $k$-Kern-Schwellen); das meiste sind Analogien. Die Unterscheidung ist wichtig, weil eine Perkolationsanalogie eine scharfe Schwelle vorhersagt, wo das tatsächliche Phänomen stetig sein kann.

**Finanzielle Ansteckung.** Interbankennetzwerke zeigen tatsächlich Kaskadenverhalten, und der Apparat der voneinander abhängigen Netzwerke ist in dem Maße anwendbar, in dem die Bilanzrestriktionen wirklich besagen, dass nur überlebt, wessen Gegenpartei überlebt. In der Praxis sind die Restriktionen partiell, verzögert und gewichtet, die quantitativen Schwellen also nicht übertragbar. Die qualitative Lehre – Kopplung erzeugt Fragilität erster Ordnung – bleibt bestehen.

**Klima-Kipppunkte.** Die räumliche Konnektivität von Meereis, Vegetation und Ozeanzirkulation wurde mit Perkolation analysiert. Die Analogie ist nützlich für den Nachweis von Frühwarnsignalen (kritische Verlangsamung), doch die Systeme werden angetrieben, sind nichtstationär und endlich, was die Annahmen des Modells verletzt.

## 13.3 Eine Checkliste für eine fächerübergreifende Behauptung

Immer wenn eine Arbeit behauptet „X ist ein Perkolationsproblem“, sind folgende Fragen zu stellen:

1. Was ist der Graph, genau?
2. Was ist das zufällige Element, und ist es unabhängig?
3. Was ist der Kontrollparameter, und lässt er sich unabhängig von den anderen variieren?
4. Welche Konnektivität ist gemeint, und ist es diejenige, die das Phänomen steuert?
5. Befindet sich das System im kritischen Bereich, und ist die Systemgröße größer als die Korrelationslänge?
6. Welche Vorhersagen sind *spezifisch* für die Perkolation (eine Schwelle, ein Exponent, eine Universalitätsklasse) und nicht allgemeine Folgen von Konnektivität?

Eine Behauptung, die alle sechs beantwortet, ist ein wissenschaftlicher Beitrag. Eine Behauptung, die keine beantwortet, ist eine Metapher, die für die Lehre noch nützlich sein mag, aber nicht für Vorhersagen verwendet werden sollte.

## 13.4 Offene Probleme

Die Liste ist von „fällt wahrscheinlich im nächsten Jahrzehnt“ bis „vielleicht unerreichbar“ geordnet. Jeder Eintrag nennt, warum er wichtig ist.

**1. Konforme Invarianz für nicht dreieckige planare Gitter.** Der Satz von Smirnov gilt speziell für das Dreiecksgitter. Für die Site-Perkolation auf dem Quadratgitter wird angenommen, dass der Skalierungsgrenzwert konform invariant und SLE$_6$ ist; der Beweis fehlt. Dies ist das letzte fehlende Teil des Universalitätsrätsels in zwei Dimensionen und das konkreteste offene Problem des Gebiets.

**2. Kritische Exponenten in $3\le d\le5$.** Die numerischen Werte sind hervorragend, die rigorosen fehlen. Ein Beweis des Molekularfeldverhaltens bis hinunter zu $d=7$ ließe die physikalischen Dimensionen weiterhin offen, wäre aber ein großer Schritt. Das Hindernis ist die Divergenz der Lace-Expansion unterhalb von $d=11$.

**3. Die logarithmischen Korrekturen bei $d=6$.** Bei $d=6$ sind die Exponenten molekularfeldartig, die Koeffizienten der Logarithmen sind jedoch nicht vollständig rigoros bekannt. Dies ist ein technisch schwieriges, aber wohldefiniertes Problem.

**4. Klassifikation von Perkolationsübergängen höherer Ordnung.** Auf Simplizialkomplexen hängt der Übergangstyp von der Definition der Konnektivität ab (Betti-Zahlen-Konnektivität, Konnektivität $k$-ter Ordnung, Euler-Charakteristik). Gibt es einen Klassifikationssatz? Derzeit gibt es einen Zoo numerischer Verhaltensweisen und keine einheitliche Theorie.

**5. Stabilität von Übergängen erster Ordnung bei partieller Kopplung.** Die Konstante 2,4554 gilt für vollständig gekoppelte Poisson-Schichten. Bei realistischer partieller, gewichteter und zeitveränderlicher Kopplung sind die Lage und sogar die Ordnung des Übergangs offen.

**6. Optimaler Angriff und optimale Verteidigung.** Wie lautet bei gegebener Gradverteilung und gegebenem Budget die Entfernungsfolge, die die Riesenkomponente minimiert, und welche Kantenzugaben maximieren die Robustheit? Dies ist ein kombinatorisches Optimierungsproblem mit einem Perkolationsziel; die Molekularfeld-Antworten sind bekannt, die Varianten für endliche Größe und für gegnerische Angriffe nicht.

**7. Zeitliche Perkolation.** Reale Konnektivität ist zeitabhängig: Ein Pfad muss existieren *und* innerhalb eines Zeitfensters durchlaufen werden können. Die Theorie der zeitlichen Perkolation ist jung, und die angemessene Skalierungstheorie ist nicht geklärt.

**8. Algorithmische Komplexität von Perkolationsgrößen.** Die Perkolationswahrscheinlichkeit oder das Zuverlässigkeitspolynom eines gegebenen endlichen Graphen zu berechnen, ist im Allgemeinen #P-schwer; die Rückgewinnung der Volumen-Schwelle aus endlichen Daten und der planare Fall sind davon getrennte Fragen. Der Zusammenhang mit dem Tutte-Polynom legt eine Komplexitätsklassifikation nahe, ist aber für Perkolationsschwellen im Besonderen noch nicht ausgearbeitet.

**9. Schwellen der Quantenfehlerkorrektur.** Der Schwellensatz für Oberflächencodes ist gut gesichert; die optimalen Schwellen für allgemeine Codefamilien und das Verhalten unter korreliertem Rauschen sind offen. Die Perkolationsanalogie ist für manche Dekodierungsprobleme exakt und für andere nur heuristisch.

**10. Perkolation in lernenden Systemen.** Ob die beim Pruning beobachteten Sparsamkeitsschwellen und die „Emergenz“-Phänomene eine Perkolationsbeschreibung haben, die mehr als eine Analogie ist, ist wirklich unbekannt. Die Frage verdient eine sorgfältige Prüfung, weil die Antwort entscheidet, ob die Schwellen vorhersagbar oder nur beobachtbar sind.

## 13.5 Wozu dieser Atlas dient

Der Atlas ist ein Arbeitsdokument, kein Denkmal. Jedes Kapitel ist eine Markdown-Datei mit einer stabilen id; jedes mit ★ markierte Ergebnis hat in seinem Kapitel einen Beweis oder eine Beweisskizze; jede Zahl hat eine Quelle. Wer einen Fehler findet, trägt ihn mit Datum und Korrektur in die Errata-Tabelle des nächsten Kapitels ein. Nur so bleibt ein Nachschlagewerk dieser Art nützlich, nachdem seine Autorinnen und Autoren aufgehört haben, es anzusehen.
