---
id: 01-foundations
part: Foundations
order: 1
title: Was Perkolation ist
subtitle: Ein Parameter, eine Schwelle, eine ganze Geometrie des Zufalls
reading: 12 min
---

Eine Tasse Kaffee ist ein zufälliges Medium. Wasser bahnt sich seinen Weg durch ein dicht gepacktes Bett aus Kaffeesatz, weil einige Kanäle offen und andere blockiert sind; welchen Weg es nimmt, entscheidet die Geometrie des Bettes und nicht eine wie auch immer geartete Zufälligkeit des Wassers. Broadbent und Hammersley übersetzten dieses Bild 1957 in die Mathematik und nannten es *Perkolation*, nach dem lateinischen *percolare*, durchsickern. Ihr Anliegen war ebenso philosophisch wie technisch: In der Diffusionstheorie ist das Medium fest und das wandernde Teilchen zufällig; in der Perkolation ist das Medium zufällig, und der Fluss durch das Medium ist vollständig bestimmt, sobald das Medium realisiert ist.

Diese eine Umkehrung hat, wie sich zeigt, ein ganzes Forschungsfeld hervorgebracht. Man erklärt jeden Platz oder jede Kante eines Graphen unabhängig mit Wahrscheinlichkeit $p$ für offen und stellt eine Ja-Nein-Frage: Gibt es eine unendliche Zusammenhangskomponente offener Elemente? Die Antwort ändert sich qualitativ bei einem einzigen Wert von $p$. Um diesen Wert herum wird die Geometrie skaleninvariant, und die Größen, die sie beschreiben, folgen Potenzgesetzen, deren Exponenten nicht von den mikroskopischen Details des Graphen abhängen. Das ist ein Phasenübergang ohne Temperatur, ohne Energie und ohne Hamiltonoperator – allein die Konnektivität zählt.

## Das Modell in einem Absatz

Sei $G=(V,E)$ ein abzählbar unendlicher, lokal endlicher, zusammenhängender Graph, und $0\in V$ ein ausgezeichneter Ursprung. Jedem Platz (Site-Perkolation) oder jeder Kante (Kantenperkolation) werde eine unabhängige Bernoulli-Variable mit Erwartungswert $p$ zugeordnet. Die offenen Elemente bilden einen zufälligen Teilgraphen; seine Zusammenhangskomponenten heißen **offene Cluster**. Mit $C_0$ sei der Cluster bezeichnet, der den Ursprung enthält; man definiere

$$
\theta(p)=\mathbb{P}_p\big(|C_0|=\infty\big),\qquad
p_c(G)=\inf\{p\in[0,1]:\ \theta(p)>0\}.
$$

Alles Weitere in diesem Atlas ist eine Verfeinerung dieser beiden Zeilen. Die Funktion $\theta$ ist der Ordnungsparameter, $p_c$ die kritische Wahrscheinlichkeit, und die interessanten Aussagen betreffen das Verhalten für $p\downarrow p_c$ und für $p\uparrow p_c$.

## Sechs Observablen

In sechs Größen steckt nahezu die gesamte Theorie. Es lohnt sich, ihre Definitionen einmal festzuhalten, denn verschiedene Fachgemeinschaften normieren sie unterschiedlich, und die Hälfte der Verwirrung in der Literatur ist eine Frage der Buchführung.

**Perkolationswahrscheinlichkeit.** $\theta(p)=\mathbb{P}_p(0\leftrightarrow\infty)$.

**Zweipunktfunktion.** $\tau_p(x,y)=\mathbb{P}_p(x\leftrightarrow y)$, wobei $\tau_p(x)=\tau_p(0,x)$ gilt. Dies ist der Konnektivitätskern; auf einem transitiven Graphen hängt er nur von $x-y$ ab.

**Cluster-Größenverteilung.** $\theta_n(p)=\mathbb{P}_p(|C_0|=n)$ für $n<\infty$, und $\theta_\infty=\theta$.

**Suszeptibilität.** $\chi(p)=\mathbb{E}_p|C_0|=\sum_{n\ge1} n\,\theta_n(p)$, mit der Konvention $\chi(p)=\infty$, sobald $\theta(p)>0$. Dies ist die mittlere Größe des Clusters am Ursprung, einschließlich des unendlichen Clusters. Sie divergiert für $p\uparrow p_c$ und ist oberhalb von $p_c$ unendlich; diese Divergenz ist das sauberste numerische Signal für kritisches Verhalten.

**Korrelationslänge.** $\xi(p)^{-1}=\lim_{n\to\infty}-\frac1n\log\tau_p(0,n\mathbf e_1)$, die exponentielle Abklingrate der Konnektivität entlang einer Koordinatenachse. Sie divergiert für $p\to p_c$ von beiden Seiten her.

**Durchgangswahrscheinlichkeit.** In einer endlichen Box $\Lambda$ gilt $\pi_\Lambda(p)=\mathbb{P}_p(\text{open left–right crossing of }\Lambda)$. Diese Observable wird in Finite-Size-Studien tatsächlich gemessen, denn sie ist ein Indikator mit einer scharfen Schwelle in $L$ und benötigt kein unendliches Gitter.

Eine sechste Größe, die Clusterzahldichte $n_s(p)=\mathbb{P}_p(|C_0|=s)/s$ pro Platz, ist das natürliche Objekt der Skalierungstheorie; sie erscheint in Kapitel 6 und ist der Grund dafür, dass $\delta$ existiert.

## Warum ein Parameter genügt

Man ist versucht zu glauben, ein Modell mit so wenig Struktur könne nichts Universelles hervorbringen. Das Gegenteil ist der Fall, und der Grund liegt in einer Skalentrennung. In der Nähe von $p_c$ ist die Korrelationslänge $\xi$ im Vergleich zum Gitterabstand riesig, sodass sich die mikroskopische Anordnung der Kanten vielfach ausmittelt, bevor ein Cluster entscheiden kann, ob er unendlich ist. Universalität besagt, dass in diesem Grenzfall nur wenige Merkmale des mikroskopischen Modells überleben: die Dimension und die Symmetrien, welche die Geometrie im großen Maßstab einschränken (Rotations- und Spiegelungsinvarianz sowie für die Perkolation die Farbsymmetrie zwischen offen und geschlossen).

Der Preis dieser Sparsamkeit ist, dass das Modell *an einem einzigen Punkt kritisch* ist und daher numerisch heikel: Bei $p_c$ ist die relevante Skala die Systemgröße selbst, die Finite-Size-Effekte sind von potenzgesetzlicher statt exponentieller Art, und naive Fits liefern verzerrte Exponenten. Kapitel 11 ist dem korrekten Vorgehen gewidmet.

## Fünf Ebenen des Bildes

Das Thema wird üblicherweise als Stapel gelehrt, und es hilft, den ganzen Stapel auf einmal zu sehen.

1. **Lokale Konnektivität.** Bei festem $p$ enthält die Box viele Cluster verschiedener Größen; die Größenverteilung ist der Gegenstand der Untersuchung.
2. **Eine Schwelle.** Auf einem unendlichen transitiven Graphen gibt es genau ein $p_c\in(0,1)$, bei dem sich das qualitative Verhalten ändert. Die Existenz ist leicht nachzuweisen, ihre Lage schwer zu bestimmen.
3. **Kritische Skalierung.** In der Nähe von $p_c$ verhalten sich die Observablen wie Potenzen von $|p-p_c|$ oder der Systemgröße, mit universellen Exponenten.
4. **Geometrischer Grenzfall.** In zwei Dimensionen ist der Skalierungsgrenzwert der kritischen Cluster konform invariant, und die Grenzkurven konvergieren gegen SLE$_6$. Dies ist die einzige Dimension, in der der Grenzwert vollständig verstanden ist.
5. **Übersetzung.** Ising, Potts, Zufallsgraphen, Epidemien, Widerstandsnetzwerke, fehlerkorrigierende Codes und die Robustheit von Netzwerken lassen sich alle als Perkolationsprobleme schreiben, teils exakt, teils nur als Analogie. Die beiden Fälle auseinanderzuhalten ist ein wiederkehrendes Thema dieses Atlas.

## Wegmarken

Drei Ergebnisse geben eine erste Orientierung. Auf dem quadratischen Gitter gilt für die Kantenperkolation exakt $p_c=1/2$ (Kesten 1980). Auf dem Dreiecksgitter gilt für die Site-Perkolation exakt $p_c=1/2$; dafür gibt es einen kurzen Stern-Dreieck-Beweis (Kapitel 4). Für das Dreiecksgitter und seine Stern-Dreieck-Verwandten sind die kritischen Exponenten in zwei Dimensionen exakt bekannt: $\beta=5/36$, $\gamma=43/18$, $\nu=4/3$, $\delta=91/5$, $\eta=5/24$, $d_f=91/48$. In drei Dimensionen sind weder Schwellen noch Exponenten exakt bekannt; die besten numerischen Werte sind $\beta\approx0.4181$, $\nu\approx0.8764$, $d_f\approx2.5229$, mit Fehlerbalken in der letzten angegebenen Stelle. Oberhalb von sechs Dimensionen werden die Molekularfeldwerte $\beta=\gamma=1$, $\nu=1/2$, $\delta=2$, $\eta=0$, $d_f=4$ erwartet; für $d\ge11$ sind sie bewiesen (Kapitel 8), bei $d=6$ gelten sie mit logarithmischen Korrekturen.

Die Kluft zwischen den exakten Ergebnissen und der numerischen Mitte ist die ungeschönte Gestalt des Feldes: exakt in zwei Dimensionen, streng für $d\ge11$, numerisch dazwischen.

## Wie dieser Atlas zu lesen ist

Wer Intuition sucht, liest dieses Kapitel und Kapitel 4 und öffnet dann das *Lattice*-Labor, um zuzusehen, wie eine Durchgangswahrscheinlichkeit mit wachsendem $L$ schärfer wird.

Wer den rigorosen Kern sucht, liest die Kapitel 3–5 der Reihe nach (Monotonie und Existenz, Dualität und exakte Schwellen, Schärfe und Eindeutigkeit) und danach Kapitel 7 zum zweidimensionalen Grenzfall.

Wer wegen der Anwendungen hier ist, findet in den Kapiteln 10 und 12 das Material zu Netzwerken und Werkstoffen; Kapitel 11 beschreibt die numerische Methodik, die verhindert, dass eine Anwendung eine plausible, aber falsche Schwelle produziert.

Wer eine Behauptung überprüfen will: Jeder vollständig bewiesene Satz ist mit ★ markiert, jeder numerische Wert trägt Quelle und Genauigkeit, und Kapitel 14 verzeichnet die Beweise, dokumentiert die in dieser Ausgabe vorgenommenen Korrekturen und listet die durchgängig verwendeten Quellen auf.
