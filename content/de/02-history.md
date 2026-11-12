---
id: 02-history
part: Foundations
order: 2
title: Eine kurze Geschichte
subtitle: Vom Kaffeesatz zur konformen Invarianz
reading: 10 min
---

Die Geschichte der Perkolation ist ungewöhnlich klar: eine eindeutige Gründungsarbeit, eine eindeutige Blütezeit und eine eindeutige Lösung in zwei Dimensionen. Im Folgenden steht eine Zeitleiste mit den jeweiligen Primärquellen, sodass sich jede Aussage zurückverfolgen lässt.

## 1957: die Gründungsarbeit

S. R. Broadbent und J. M. Hammersley, *Percolation processes: I. Crystals and mazes*, **Math. Proc. Cambridge Philos. Soc.** 53(3), 629–641. Die Arbeit führt das Modell ein, grenzt es von der Diffusion ab und stellt die Frage, die das Feld definiert: Existiert eine kritische Wahrscheinlichkeit? Ihre Beispiele sind ein Gas, das durch eine zufällige Anordnung blockierter Kanäle diffundiert, eine Krankheit, die sich durch einen Obstgarten ausbreitet, und eine Flüssigkeit, die durch einen porösen Festkörper sickert. Die Begriffe – offen, geschlossen, Cluster, Perkolationswahrscheinlichkeit – stammen von ihnen.

Die begleitende Notiz, J. M. Hammersley, *Percolation processes: II. The connective constant*, im selben Band, 642–645, behandelt die eindimensionale Kette und das Bethe-Gitter. Auf einem Baum vom Grad $z$ ist die Schwelle $1/(z-1)$, der erste exakte nichttriviale Wert, und sie bleibt die geometrische Verkörperung der Molekularfeldtheorie.

## 1960–1980: das quadratische Gitter

T. E. Harris, *A lower bound for the critical probability in a certain percolation process*, **Proc. Cambridge Philos. Soc.** 56 (1960), 13–20, beweist $\theta(1/2)=0$ auf $\mathbb{Z}^2$, d. h. $p_c\ge1/2$. Das Argument verbindet die planare Dualität offener und geschlossener Durchgänge mit der Farbsymmetrie bei $p=1/2$; beide Ideen werden zu dauerhaften Werkzeugen.

M. F. Sykes und J. W. Essam, *Exact critical percolation probabilities for site and bond problems in two dimensions*, **J. Math. Phys.** 5 (1964), 1117, führen die Paarungsmethode ein und gewinnen geschlossene Ausdrücke für die Kantenschwellen des Dreiecks- und des Honigwabengitters. Ihr Weg führt über die Stern-Dreieck-Transformation; die Algebra wird in Kapitel 4 korrekt wiedergegeben, wo die Herleitung Schritt für Schritt geprüft wird.

L. Russo, *A note on percolation*, **Z. Wahrsch. Verw. Gebiete** 43 (1978), 39–48, und P. D. Seymour und D. J. A. Welsh, *Percolation probabilities on the square lattice*, **Ann. Discrete Math.** 3 (1978), 227–245, beweisen unabhängig voneinander die Box-Durchgangsungleichungen, die die zweidimensionale Perkolation handhabbar machen. Das RSW-Lemma ist der Motor hinter fast jedem rigorosen zweidimensionalen Resultat, einschließlich Kestens Satz zwei Jahre später.

H. Kesten, *The critical probability of bond percolation on the square lattice equals 1/2*, **Comm. Math. Phys.** 74 (1980), 41–59, schließt die Lücke. Der Beweis ist lang und technisch. Bollobás und Riordan (2006) geben einen wesentlich kürzeren Weg mithilfe der Technik scharfer Schwellen.

## 1970er–1980er: kritische Phänomene

Die Übersetzung der Perkolation in die Sprache der kritischen Phänomene ist mit P.-G. de Gennes, *On a relation between percolation theory and the elasticity of gels*, **J. Physique Lettres** 37 (1976), L1–L2, und mit der Stauffer-Schule verbunden. D. Stauffer und A. Aharony, *Introduction to Percolation Theory* (Taylor & Francis, 2. Aufl. 1994), legten die Notation $\beta,\gamma,\nu,\delta,\eta$ fest, die heute allgemein verwendet wird, und lehrten eine Generation, Exponenten aus Monte-Carlo-Daten zu fitten – mitunter zu optimistisch, eine Gewohnheit, die Kapitel 11 zu korrigieren versucht.

Auf der rigorosen Seite begründete H. Kesten, *Percolation Theory for Mathematicians* (Birkhäuser, 1982), das Gebiet als Zweig der Wahrscheinlichkeitstheorie. M. Aizenman und D. J. Barsky, *Sharpness of the phase transition in percolation models*, **Comm. Math. Phys.** 108 (1987), 489–526, bewiesen exponentielle Abklingung unterhalb von $p_c$; M. V. Menshikov bewies die entsprechenden Ergebnisse unabhängig (1986–87). Der Burton–Keane-Eindeutigkeitssatz (1989) vervollständigte das qualitative Bild der superkritischen Phase.

## 1986–1992: hohe Dimensionen und konforme Feldtheorie

M. Aizenman und R. Fernández, *On the critical behavior of the magnetization in high dimensional Ising models*, **J. Stat. Phys.** 44 (1986), 393, bewiesen mit der Random-Current-Darstellung das Molekularfeldverhalten des hochdimensionalen Ising-Modells. T. Hara und G. Slade, *Mean-field critical behaviour for percolation in high dimensions*, **Comm. Math. Phys.** 128 (1990), 333–391, entwickelten die Lace-Expansion für die Perkolation und bewiesen das entsprechende Ergebnis in hinreichend hoher Dimension. Die Lace-Expansion ist nicht perturbativ und bleibt der einzige rigorose Zugang zu kritischen Exponenten oberhalb der oberen kritischen Dimension. Die derzeitige Schwelle für Nächste-Nachbar-Kantenperkolation ist $d\ge11$ (Fitzner und van der Hofstad, 2017), aufbauend auf dem Ergebnis $d\ge19$ von Hara und Slade und späteren Verfeinerungen der Entwicklung.

Parallel dazu sagte J. L. Cardy, *Critical percolation in finite geometries*, **J. Phys. A** 25 (1992), L201, mit der konformen Feldtheorie die exakte Durchgangswahrscheinlichkeit eines Rechtecks voraus. R. Langlands, P. Pouliot und Y. Saint-Aubin, *Conformal invariance in two-dimensional percolation*, **Bull. Amer. Math. Soc.** 30 (1994), 1–61, prüften sie numerisch und schrieben die zugrunde liegende Vermutung Aizenman zu.

## 2001: die zweidimensionale Revolution

S. Smirnov, *Critical percolation in the plane: conformal invariance, Cardy's formula, scaling limits*, **C. R. Acad. Sci. Paris Sér. I Math.** 333 (2001), 239–244, bewies Cardys Formel für die kritische Site-Perkolation auf dem Dreiecksgitter. Der Beweis ist kurz genug, um an einem Nachmittag gelesen zu werden, und tief genug, um das Fach verändert zu haben: Er identifiziert den Kontinuumsgrenzwert der Explorationskurve als konform invariantes Objekt.

G. F. Lawler, O. Schramm und S. Werner, *Values of Brownian intersection exponents I, II*, **Acta Math.** 187 (2001), 237–273 und 275–308, und ihre späteren Arbeiten identifizierten den Grenzwert der Grenzfläche als SLE$_6$ und leiteten den exakten Exponentensatz her. Die Kette Cardy → Smirnov → SLE ist nach dem Ising-Modell die vollständigste Lösung eines kritischen Modells in zwei Dimensionen.

## 2000er: Netzwerke

R. Cohen, K. Erez, D. ben-Avraham und S. Havlin, *Resilience of the Internet to random breakdowns*, **Phys. Rev. Lett.** 85 (2000), 4626, und D. S. Callaway, M. E. J. Newman, S. H. Strogatz und D. J. Watts, *Network robustness and fragility: percolation on random graphs*, **Phys. Rev. Lett.** 85 (2000), 5468, brachten die Perkolation in die Netzwerkwissenschaft. Das Molloy–Reed-Kriterium, das bereits in M. Molloy und M. Reed, *A critical point for random graphs with a given degree sequence*, **Random Structures & Algorithms** 6 (1995), 161–180, implizit enthalten war, wurde zum Standardwerkzeug.

S. V. Buldyrev, R. Parshani, G. Paul, H. E. Stanley und S. Havlin, *Catastrophic cascade of failures in interdependent networks*, **Nature** 464 (2010), 1025–1028, zeigten, dass die Kopplung zweier Netzwerke einen kontinuierlichen Übergang in einen diskontinuierlichen verwandelt. Das Ergebnis ist das klarste Beispiel für einen Perkolationsübergang, dessen *Typ* eine Entwurfsvariable ist.

## 2010er–2020er

Das rigorose Programm für hohe Dimensionen rückte bis $d\ge11$ vor und erbrachte einen Beweis, dass dort die Dreiecksbedingung gilt; das dreidimensionale Problem bleibt numerisch. Perkolation höherer Ordnung auf simplizialen Komplexen, Perkolation auf temporalen und mehrschichtigen Netzwerken und die Perkolationsschwelle quantenfehlerkorrigierender Codes bilden die aktive Forschungsfront. Kapitel 13 listet die offenen Probleme in der Reihenfolge, in der sie lösbar erscheinen.

Zwei Datierungskonventionen verdienen einen Hinweis. Die Arbeit von Aizenman–Barsky über die Schärfe wird oft mit 1986 zitiert, weil sie in jenem Jahr als Preprint kursierte; der Zeitschriftenband ist von 1987. Und die aktuelle Schwelle für hohe Dimensionen ist $d\ge11$, nicht das ältere $d\ge19$, das noch in Sekundärquellen auftaucht. Kapitel 14 verzeichnet beide Korrekturen.
