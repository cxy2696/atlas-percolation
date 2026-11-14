---
id: 12-applications
part: Networks and applications
order: 12
title: Anwendungen – und wie man die Theorie nutzt, ohne sie zu missbrauchen
subtitle: Ein Protokoll, vier Fallstudien, ein Feldführer und die Fragen, die zuerst zu stellen sind
reading: 23 min
---

Die Perkolation verdient ihren Platz in Anwendungen, weil sie eine Frage sehr gut beantwortet: Gibt es in einem zufälligen Medium einen zusammenhängenden Pfad hindurch? Alles andere – der Schwellenwert, die Exponenten, die Finite-Size-Korrekturen – ist eine Verfeinerung dieser Frage. Die meisten gescheiterten Anwendungen scheitern nicht, weil die Mathematik falsch ist, sondern weil die gestellte Frage nicht diejenige ist, die die Perkolation beantwortet.

## 12.1 Ein Übersetzungsprotokoll

Vor dem ersten Codestück sind fünf Fragen zu beantworten. Lautet eine Antwort „nein“ oder „nicht sicher“, ist das Modell noch kein Perkolationsmodell.

1. **Was sind die Elemente?** Plätze, Kanten oder beides? In einem porösen Gestein sind die Poren Plätze und die Porenhälse Kanten; in einem Komposit sind die Füllstoffpartikel Plätze und ihre Kontakte Kanten; in einer Epidemie sind die Individuen Plätze und die Kontakte Kanten. Die Wahl verändert die Schwelle und ist daher kein Detail.
2. **Was ist der Kontrollparameter?** Volumenanteil, Konnektivität, Besetzung, Entfernungsanteil – und ist es der *effektive* oder der *nominelle*? Agglomeration, Quellung, Kompression und Messverzerrung verschieben den effektiven Wert vom nominalen weg.
3. **Welche Konnektivität ist relevant?** Für den Transport ist es meist die Existenz eines Pfads; für die mechanische Integrität ist es die Existenz eines tragenden Rückgrats; für die Epidemiologie ist es ein Pfad in einem zeitlichen Kontaktnetzwerk. Das sind verschiedene Konnektivitäten auf demselben Graphen, mit verschiedenen Schwellen.
4. **In welcher Phase befindet sich das System?** Lautet die Antwort „nahe der Schwelle“, wird die Antwort vom kritischen Bereich dominiert und ist skalenabhängig. Lautet sie „weit darüber“, genügt meist eine Molekularfeld- oder Effektivmedium-Näherung, und die Perkolation trägt wenig bei.
5. **Wie groß ist die Stichprobe im Verhältnis zur Korrelationslänge?** Ist $L/\xi$ nicht groß, sind Finite-Size-Effekte das Signal und nicht das Rauschen. Hier liegt der häufigste Fehler ingenieurmäßiger Anwendungen.

Das Protokoll ist bewusst konservativ. Ein Modell, das alle fünf Fragen besteht, ist ein Perkolationsmodell und darf den gesamten Werkzeugkasten dieses Atlas ausleihen. Ein Modell, das eine Frage nicht besteht, kann trotzdem nützlich sein, aber es ist eine Analogie, und Analogien sollten nicht herangezogen werden, um eine Schwelle anzugeben.

## 12.2 Komposite und Elektroden

**Leitfähige Komposite.** Isolierendes Polymer plus leitfähiger Füllstoff: Die Leitfähigkeit springt, wenn der Volumenanteil des Füllstoffs die Perkolationsschwelle des Füllstoffnetzwerks überschreitet. Drei Fakten aus der Theorie wiegen mehr als die genaue Schwelle.

Erstens: *Die Form schlägt die Menge.* Die Schwelle skaliert für Stäbchen ungefähr mit dem inversen Seitenverhältnis und für Plättchen mit dem Inversen des dimensionslosen, normierten ausgeschlossenen Volumens; Füllstoffe mit hohem Seitenverhältnis (Kohlenstoffnanoröhren, Graphen) perkulieren daher bei Anteilen, die ein bis zwei Größenordnungen unter denen von sphärischem Ruß liegen. Die relevante geometrische Größe ist das mittlere ausgeschlossene Volumen, nicht der Massenanteil.

Zweitens: *Die Dispergierung ist die Steuergröße.* Die effektive Besetzung ist der Anteil gut dispergierten Füllstoffs, nicht die nominelle Beladung. Agglomerate senken das effektive $p$ und erhöhen zugleich das nominelle, weshalb zwei Chargen mit identischer Formulierung auf entgegengesetzten Seiten der Schwelle liegen können. Daraus entsteht die bimodale Leistungsverteilung, die Batterie- und Komposit-Ingenieuren vertraut ist; sie ist ein Perkolationseffekt und keine Anekdote über die Mischqualität.

Drittens: *Die Anisotropie folgt der Verarbeitung.* Die Ausrichtung anisotroper Füllstoffe verändert die Schwelle richtungsabhängig: Die Perkolationsschwelle entlang der Ausrichtungsrichtung sinkt, senkrecht dazu steigt sie. Eine einzelne skalare „Schwelle“ ist dann bedeutungslos; das richtige Objekt ist ein richtungsabhängiger Schwellentensor.

**Batterieelektroden.** Eine Lithium-Eisenphosphat-Kathode leitet elektronisch schlecht und benötigt einen leitfähigen Zusatz (Ruß, Kohlenstoffnanoröhren) sowie eine Kohlenstoffbeschichtung. Der Zusatz bildet ein perkulierendes Netzwerk; unterhalb der Schwelle ist die Elektrode durch den elektronischen Transport ratenbegrenzt, oberhalb verdrängt der zusätzliche Zusatz aktives Material und senkt die Energiedichte. Das technische Problem ist daher ein schmales Fenster knapp oberhalb der Schwelle, und der Beitrag der Theorie besteht darin zu erklären, warum das Fenster schmal ist: Die Leitfähigkeit wächst oberhalb von $p_c$ nach einem Potenzgesetz, eine kleine Änderung der Beladung erzeugt also nur in der Nähe der Schwelle eine große Änderung der Leitfähigkeit – genau dort, wo die Streuung von Charge zu Charge am größten ist.

Dieselbe Struktur erscheint in Festelektrolyten (ionische Perkolation über Korngrenzen), in Katalysatorschichten von Brennstoffzellen (elektronische und ionische Netzwerke müssen beide perkulieren, ein *zweiphasiges* Perkolationsproblem) und in thermischen Grenzflächenmaterialien.

## 12.3 Poröse Medien und Hydrologie

In einem porösen Gestein ist der Porenraum der Platzgraph und sind die Porenhälse die Kanten. Nimmt die Wassersättigung ab, dünnt der wassergefüllte Teilgraph aus, und bei einer kritischen Sättigung fällt die hydraulische Leitfähigkeit auf null. Die Perkolationsschwelle legt die *irreduzible* Sättigung fest; die Potenzgesetz-Leitfähigkeit darüber bestimmt die Form der relativen Permeabilitätskurve.

In der Praxis sind zwei Verfeinerungen unerlässlich. Die Porengrößenverteilung macht die Besetzungswahrscheinlichkeit platzabhängig, das relevante Modell ist also *korrelierte* oder *gewichtete* Perkolation, und die Schwelle wird von den größten Porenhälsen bestimmt, die noch invadiert werden müssen (Invasion-Perkolation). Und die Geometrie ist oft dual-porös: Klüfte perkulieren bei viel geringerer Dichte als die Matrix, und die beiden Netzwerke tauschen Fluid aus. Ein einzelnes $p_c$ ist dann keine Materialkonstante, sondern eine Funktion der Messrichtung und des Maßstabs.

Die Anwendung auf den Schadstofftransport hat die klarsten technischen Konsequenzen: Nahe der Schwelle sind die Erstpassagezeiten schwer verteilt (heavy-tailed), der mittlere Ankunftszeitpunkt ist daher kein brauchbares Risikomaß. Man verwende Quantile.

## 12.4 Epidemiologie

Für eine SIR-Epidemie auf einem statischen Kontaktnetzwerk wird jede Kante unabhängig mit der Übertragungswahrscheinlichkeit $T$ pro Kontakt beibehalten; die Endgröße ist die Riesenkomponente des entstehenden Perkolationsgraphen. Im Limes unendlicher Population ist das für ein Netzwerk aus dem Konfigurationsmodell eine exakte Aussage. Die Formulierung vermeidet den Zirkelschluss, die „der Infektion entkommenden Knoten“ zu löschen, denn welche Knoten das sind, ist gerade das Ergebnis der Konstruktion. Sie liefert die Schwelle für zufällige Immunisierung als
$$
v_c=1-\frac{1}{R_0},\qquad R_0=T(\kappa-1),
$$
wobei $\kappa=\langle k^2\rangle/\langle k\rangle$ das Molloy–Reed-Verhältnis ist. Bei homogener Durchmischung gilt $R_0\approx T\langle k\rangle$, und für $T\approx1$ reduziert sich der heterogene Ausdruck auf $1-1/(\kappa-1)$. Die Heterogenität ist wichtig: Bei einem Netzwerk mit schwerer Gradverteilung ist der Anteil, der immun sein muss, größer, als die homogene Formel nahelegt, und eine gezielte Immunisierung von Knoten hohen Grades ist weit effizienter als eine zufällige.

Zwei Warnungen. Die Abbildung setzt ein statisches Netzwerk und eine Markov-Epidemie voraus; bei zeitlichen Netzwerken mit stoßartigen Kontakten tritt an die Stelle der Perkolationsschwelle eine *zeitliche* Konnektivitätsschwelle, und die beiden können sich um einen großen Faktor unterscheiden. Und die Herdenimmunitätsschwelle ist eine Aussage über die Endgröße in einer unendlichen Population, nicht über den Peak oder den zeitlichen Verlauf; dafür braucht man die Dynamik, die die Perkolation bewusst verwirft.

## 12.5 Infrastruktur und Kaskaden

Das Ergebnis von 2010 über voneinander abhängige Netzwerke (Kapitel 10) ist die theoretische Grundlage der modernen Auffassung, dass gekoppelte Infrastrukturen abrupt versagen. Die technische Übersetzung hat drei Teile.

*Die Kopplungstopologie zählt mehr als die Kopplungsstärke.* Eine Eins-zu-eins-Abhängigkeit zwischen einem Stromnetz und seinem Kommunikationsnetz verwandelt einen stetigen Übergang in einen erster Ordnung. Partielle Kopplung oder mehrfache redundante Abhängigkeiten stellen einen stetigen Übergang wieder her. Das ist eine Entwurfsentscheidung, kein Naturgesetz.

*Die Kaskade ist eine Folge von Berechnungen der Riesenkomponente.* Jede Runde entfernt die Knoten, die ihren Halt verloren haben, berechnet die Riesenkomponente neu und wiederholt das Verfahren. Die Zahl der Runden ist klein (typischerweise unter zehn), und der Gesamtverlust ist viel größer als die anfängliche Störung. Jede Minderungsmaßnahme, die die Kaskade verkürzt – Pufferung, Inselbildung, redundante Steuerung –, wirkt dadurch, dass sie die überlebende Menge oberhalb der Schwelle der nächsten Runde hält.

*Kennzahlen müssen Kaskaden berücksichtigen.* Ein Netzwerk, das auf der Ebene einer einzelnen Schicht robust gegen Zufallsausfälle ist, kann in gekoppeltem Zustand fragil sein; eine Robustheitsprüfung, die jede Schicht getrennt betrachtet, ist daher nicht bloß ungenau, sondern kann das falsche Vorzeichen liefern.

Ein Waldbrand ist ein natürliches Perkolationsproblem mit derselben Struktur: Die Konnektivität des Brennstoffs ist der Kontrollparameter, und der Übergang von exponentiell abgeschnittenen Brandgrößen zu Brandgrößen nach einem Potenzgesetz ist der Perkolationsübergang. Brandschneisen wirken, indem sie die effektive Konnektivität unter die Schwelle senken, und die praktische Lehre ist dieselbe wie im Fall der Komposite: Die Änderung des Ergebnisses pro Einheit Änderung des Kontrollparameters ist nahe der Schwelle am größten, eine Brandschneisendichte, die „fast ausreicht“, ist also der schlechteste Zustand.

## 12.6 Bildgebung, Sensorik und Gewebe

**Bildsegmentierung.** Ein Bild zu schwellen und die größte zusammenhängende Komponente zu nehmen, ist Perkolation mit einem räumlich korrelierten Feld. Die Wahl der Schwelle ist die Wahl von $p$, und die „richtige“ Schwelle ist diejenige, bei der die interessierende Struktur perkuliert, das Rauschen aber nicht. Das Perkolationsbild erklärt, warum eine einzelne globale Schwelle bei heterogenen Bildern versagt und warum eine Hysterese (zwei Schwellen, eine für das Wachstum und eine für das Verschmelzen) besser funktioniert: Sie ist eine ausdrückliche Finite-Size-Korrektur eines kritischen Phänomens.

**Drahtlose Sensornetze.** Abdeckung und Konnektivität sind verschiedene Fragen. Die Abdeckung ist der glatte Flächenanteil der Vereinigung von Kreisscheiben (ein Boolesches Modell); die Konnektivität ist ein Kontinuumsperkolationsproblem mit eigener Schwelle, $\lambda_c\approx1.128$ in zwei Dimensionen für die reduzierte Dichte $\lambda=n\pi r^2$ (Mertens und Moore 2012). Die beiden zu verwechseln, führt zu optimistischen Einsatzregeln: Die Abdeckung ist eine Aussage über die Vereinigung von Kreisscheiben, die Konnektivität eine Aussage über einen durchspannenden Cluster, und bei endlicher Dichte kann man eine hohe Abdeckung ohne durchspannenden Cluster haben.

**Gewebezüchtung.** Ein poröses Gerüst muss zusammenhängende Poren für Zellmigration und Vaskularisierung haben. Unterhalb der Porenkonnektivitätsschwelle bleiben die Zellen an der Oberfläche, und das Konstrukt vaskularisiert nicht; oberhalb dringen die Zellen rasch ein. Die Schwelle hängt von der Porengrößenverteilung und von der Zellgröße ab, was sie erneut zu einem *gewichteten* Perkolationsproblem macht.

## 12.7 Vier Fallstudien, und was das Modell nicht liefert

*Fall 1: Ruß-Polymer-Komposit.* Die Perkolation sagt, dass der Sprung der Leitfähigkeit bei einem Füllstoffanteil auftritt, der von der Füllstoffgeometrie und der Dispergierung bestimmt wird. Sie liefert nicht die absolute Leitfähigkeit; diese hängt vom Tunneln zwischen Partikeln, vom Kontaktwiderstand und von der Polymermorphologie ab. Die Perkolation liefert die Schwelle und den Potenzgesetz-Exponenten, ein Transportmodell die Amplitude.

*Fall 2: LFP-Kathode.* Die Perkolation sagt, dass die Ratenfähigkeit unterhalb einer kritischen Zusatzbeladung zusammenbricht und dass das Fenster darüber schmal ist. Sie liefert nicht die elektrochemische Impedanz, den Lithium-Diffusionskoeffizienten oder den Effekt des Kalandrierens auf den Partikelkontakt. Die Perkolation grenzt das Formulierungsfenster ein; gemessen werden muss anschließend.

*Fall 3: Masernimpfung.* Die Perkolation liefert die Herdenimmunitätsschwelle für ein Modell homogener Durchmischung und deren Korrektur für heterogene Kontaktnetzwerke. Sie liefert nicht die tatsächlich erreichte Impfabdeckung, den Zeitpunkt der Kampagne oder das Verhalten des Kontaktnetzwerks während der Schulferien. Man nutze sie, um ein Ziel zu setzen, nicht um einen Ausbruch vorherzusagen.

*Fall 4: gekoppelte Strom-/Kommunikationskaskade.* Die Perkolation sagt die Existenz eines Übergangs erster Ordnung und die Skalierung der Kaskadengröße voraus. Sie sagt nicht voraus, welche Leitung zuerst auslöst. Man nutze sie, um Topologien zu vergleichen und Redundanz zu begründen; man nutze sie nicht, um einen konkreten Stromausfall vorherzusagen.

Das Muster ist in allen vier Fällen dasselbe: Die Perkolation liefert Schwellen, Skalierung und qualitative Übergänge mit bemerkenswerter Zuverlässigkeit, Amplituden und Dynamik dagegen schlecht oder gar nicht. Eine Anwendung, die diese Arbeitsteilung respektiert, ist nützlich; eine, die eine Schwelle als Materialkonstante ausgibt, nicht.

## 12.8 Ein Feldführer nach Disziplinen

Jede Anwendung lässt sich mit denselben drei Fragen ordnen: Was ist der Graph, was ist der Kontrollparameter, welche Konnektivität zählt? Die Tabelle ist bewusst konservativ: Sie trennt ein an Daten geprüftes Modell von einer Perkolationsmetapher, die es nicht ist.

| Bereich | Graph und Kontrolle | Was Perkolation tatsächlich liefert | Was sie nicht liefert | Quellen |
|---|---|---|---|---|
| Leitfähige Verbunde, Elektroden | Füllstoffteilchen und Kontakte; Volumenanteil, Aspektverhältnis, Dispersion | Schwellenfenster und Potenzgesetz-Leitfähigkeit darüber | absolute Leitfähigkeit, Tunneln, Kontaktwiderstand | Balberg et al. 1984; Sahimi 2023 |
| Rigidität von Gläsern und Gerüsten | Constraint-Graph; mittlere Koordination | Mean-Field-Rigiditätsschwelle und Constraint-Zählung | experimenteller Glasübergang, chemische Details | Thorpe 1983; Jacobs und Thorpe 1995 |
| Poröse Medien, CO₂-Speicherung | Poren-Hals-Netz; Sättigung, Kapillardruck | verbundener Porenanteil, Invasionspfad, relative Permeabilität | Porenskalenreaktion, Mehrphasen-Hysterese | Sahimi 2023; Hunt et al. 2013 |
| Waldbrand | Brennstoffzellen; Dichte, Wind, Behandlung | qualitative Schwelle und Platzierungslogik | operativer Brandverlauf, Wetter, Bekämpfung | Drossel und Schwabl 1992 (Modell) |
| Epidemien | Kontaktnetz; Übertragung pro Kontakt | Endgröße, Schwellen für zufällige und gezielte Immunisierung | Zeitverlauf, Verhaltensänderung, temporäre Kontakte | Newman 2002; Cohen et al. 2003 |
| Infrastruktur | Mehrschichtnetz; Kopplung, Redundanz | Kaskade erster Ordnung, gemeinsame Riesenkomponente | welche Leitung zuerst ausfällt, Betreiberreaktion | Buldyrev et al. 2010; Parshani et al. 2010 |
| Optimale Perkolation | Graph; entfernte Knoten | minimale Zerstörungsmenge, Influence Maximization | exaktes Optimum in großem Maßstab, Kosten | Morone und Makse 2015; Zdeborová et al. 2016; Mugisha und Zhou 2016 |
| Straßenverkehr | evolvierendes Straßennetz; Engpässe | Perkolationsübergang im dynamischen Netz | individuelle Routenwahl, Nachfrageprognose | Li et al. 2015 |
| Finanzen | Interbank-Exposures; Ausfallschwelle | Kaskadenbedingung, systemisches Risiko-Ranking | Bilanzdetails, Fire Sales, Politik | Gai und Kapadia 2010 |
| Soziale Ansteckung, Stadtwachstum | soziales/Kontaktnetz oder korrelierte Landschaft | globale Adoptionsschwelle; korrelierte Perkolationsmorphologie | Präferenzen, Medien, Planung | Watts 2002; Solomon et al. 2000; Makse et al. 1995 |
| Quanteninformation | Fusions-/Messgraph; Gate-Erfolg | Perkolationsschwelle für einen nutzbaren Clusterzustand, Löschschwelle | allgemeine Gate-Fehler, Overhead, Architektur | Kieling et al. 2007; Stace et al. 2009 |
| Turbulenz | gerichtete Perkolation in Raum–Zeit | Universalitätsklasse und kritische Exponenten | Navier–Stokes-Herleitung, technische Amplituden | Lemoult et al. 2016; Sano und Tamai 2016 |

## 12.9 Behauptungen, die leicht schiefgehen

**„Zufällige Immunisierung ist auf heterogenen Netzen leichter.“** Nein. Die nötige Abdeckung ist
$$
v_c = 1-\frac{1}{T(\kappa-1)},
$$
und sie wächst mit $R_0$. Bei festem $R_0$ ist die zufällige Abdeckung für jede Gradverteilung gleich. Bei festem mittlerem Grad hat ein schwer-tailed-Netz ein größeres $\kappa$, also ein größeres $R_0$ und ein größeres $v_c$; zufällige Immunisierung ist **nicht** leichter. Weniger braucht die gezielte Immunisierung von Knoten mit hohem Grad (Cohen et al. 2003).

**„Der zweidimensionale Platzschwellenwert $p_c\approx0.5927$ ist die Landschafts-Schwelle.“** Das ist der Wert des Quadratgitter-Platzmodells. Eine reale Landschaft hat korrelierte Habitate, gewichtete Bewegungskosten und ein artspezifisches Dispersalkern; das relevante Modell ist korrelierte oder gewichtete Perkolation, und der Wert muss gemessen werden.

**„Der Leitfähigkeitsexponent ist universell und exakt.“** In drei Dimensionen ist $t\approx2.0$ numerisch; in zwei Dimensionen ist $t\approx1.299$ ebenfalls numerisch (Grassberger 1999). Die Skalenrelation $t=\nu(d-2+\zeta)$ verbindet Exponenten, leitet ihre Werte aber nicht her.

**„Die Löschschwelle des Oberflächencodes ist genau die Bond-Perkolationsschwelle.“** Für das spezielle Verlustmodell von Stace et al. (2009) ist die Abbildung nützlich und die Schwelle fällt mit dem entsprechenden Bond-Wert zusammen. Allgemeine Gate-, Mess- und Schaltkreisfehler bilden nicht auf diese eine Zahl ab.

**„Rigiditätsperkolation hat eine scharfe Schwelle bei mittlerer Koordination 2.4.“** Der Wert $2.4$ ist ein Mean-Field-Ergebnis der Constraint-Zählung. Reale Gläser haben andere Koordinationsverteilungen, Biegekräfte und floppy modes; Experimente liefern einen Bereich, keine universelle Konstante.

**„Waldbrandmodelle beweisen, dass reale Wälder selbstorganisiert kritisch sind.“** Drossel–Schwabl ist ein Modell mit getrennten Zeitskalen. Reale Feuerregime hängen von Wetter, Brennstoffstruktur, Zündung und Bekämpfung ab; die Potenzgesetz-Aussage ist modellbedingt.

**„Perkolation erklärt die Emergenz von Fähigkeiten großer Sprachmodelle.“** Die Sprache von Konnektivität und Pruning ist nützlich, und $k$-Core-Pruning-Schwellen sind für zufällige dünne Netze streng. Die Behauptung, eine konkrete Fähigkeit sei ein Perkolationsübergang in einem trainierten Transformer, ist eine Hypothese über eine Architektur, kein Theorem.

**„Message Passing liefert die exakte Schwelle jedes realen Netzes.“** Das Non-Backtracking-Kriterium ist auf Bäumen exakt und auf lokal baumartigen Ensembles asymptotisch. Endliche Zyklen, Gradkorrelationen und Gemeinschaftsstruktur verschieben es; es ist eine begründete Näherung, keine exakte Identität für einen beobachteten Graphen.

Die praktische Regel ist in jeder Zeile dieselbe: Graph, Kontrollparameter und Konnektivität nennen; das Ergebnis als exakt, numerisch, modellbedingt oder metaphorisch kennzeichnen; und eine Schwelle nicht als Materialkonstante zitieren.
