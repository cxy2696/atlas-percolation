---
id: 04-duality
part: Rigorous core
order: 4
title: Dualität, Paarung und die exakten Schwellen
subtitle: Von Harris zu Kesten und die Stern-Dreieck-Korrektur
reading: 19 min
---

Die planare Dualität ist das wichtigste Werkzeug, das exakte Schwellen liefert, und sie tut dies in zwei Schritten: Zuerst verwandelt sie eine Aussage über offene Durchgänge in eine Aussage über geschlossene Durchgänge, dann legt ein Symmetrieargument den kritischen Punkt auf den selbstdualen Wert fest. Auf dem quadratischen Gitter ergeben die beiden Schritte $p_c=1/2$. Auf dem Dreiecks- und dem Honigwabengitter wird ein zweiter Bestandteil benötigt, die Stern-Dreieck-Transformation. Die Herleitung findet sich in Abschnitt 4.4; auch die algebraische Abkürzung, die plausibel aussieht, aber die falsche Wurzel liefert, wird dort erklärt.

## 4.1 Der Paarungsgraph und das Durchgangslemma

**Definition 4.1.** $G$ sei ein in die Ebene eingebetteter Graph mit lokal endlichen Flächen. Der **Paarungsgraph** (matching graph) $G^\dagger$ hat einen Knoten in jeder Fläche von $G$ und eine Kante, die jede Kante von $G$ kreuzt und die beiden an sie angrenzenden Flächen verbindet. $G$ heißt **selbstdual**, wenn $G^\dagger\cong G$ als planare Graphen gilt. Das quadratische Gitter ist selbstdual; das Dreiecks- und das Honigwabengitter sind zueinander paarig (matching).

**Lemma 4.2 (Durchgangsdualität, ★).** Sei $\Lambda_n=[-n,n]^2$ und $\Lambda_n^\dagger$ das duale Quadrat. Für jede Kantenkonfiguration $\omega$ auf $\Lambda_n$ gilt genau eine der folgenden Aussagen:

- $A$: Es gibt einen offenen Links-rechts-Durchgang von $\Lambda_n$;
- $B^\ast$: Es gibt einen geschlossenen Durchgang von oben nach unten durch $\Lambda_n^\dagger$.

**Beweis.** Man färbe jede Kante von $\Lambda_n$ offen oder geschlossen und zeichne die duale Kante von $\Lambda_n^\dagger$ geschlossen, wenn die primale Kante offen ist, und offen, wenn die primale Kante geschlossen ist. Die beiden Kantenfamilien bilden somit ein Paar komplementärer planarer Duale.

*Höchstens eines.* Angenommen, $A$ und $B^\ast$ gelten beide. Der offene Links-rechts-Pfad $P$ und der geschlossene Dualpfad $Q$ von oben nach unten müssen sich an einer primalen Kante $e$ kreuzen: Die Pfade schneiden sich als Kurven in der Ebene, und ein Schnittpunkt eines horizontalen primalen Pfades mit einem vertikalen dualen Pfad liegt genau auf einer Kante. Diese Kante $e$ ist offen (weil $P$ sie benutzt) und zugleich geschlossen (weil $Q$ ihre duale Kante benutzt), ein Widerspruch.

*Mindestens eines.* Angenommen, $A$ trifft nicht zu. Man betrachte die Menge $S$ der primalen Knoten, die von der linken Seite aus über offene Pfade erreichbar sind. Ihr Kantenrand besteht aus geschlossenen Kanten: Eine Kante von $S$ nach $S^c$ kann nicht offen sein, sonst läge ihr Endpunkt in $S$. Man wandere entlang des Randes von $S$ von der Oberseite der Box zur Unterseite; die dualen Kanten der Randkanten bilden einen geschlossenen dualen Pfad, der die Ober- und die Unterseite von $\Lambda_n^\dagger$ verbindet. Das ist $B^\ast$. (Ist $S$ leer, so ist die gesamte linke Seite geschlossen, und der duale Pfad verläuft entlang des linken Randes.) $\blacksquare$

Das Lemma ist der zweidimensionale Ersatz für das Fehlen einer „monotonen Kopplung“ in höheren Dimensionen. Alles Exakte in $d=2$ beginnt hier.

## 4.2 Warum der selbstduale Punkt $1/2$ ist

**Proposition 4.3 (★).** Für die Kantenperkolation auf $\mathbb{Z}^2$ bei $p=1/2$ gilt für jedes $n$
$$
\mathbb{P}_{1/2}\big(\text{open left–right crossing of }\Lambda_n\big)=\tfrac12.
$$

**Beweis.** Lemma 4.2 liefert
$$
\mathbb{P}_p(A)+\mathbb{P}_p(B^\ast)=1
$$
für jedes $p$. Unter $p\mapsto1-p$ und Farbtausch wird $B^\ast$ zu einem offenen Durchgang von oben nach unten; wegen der vierfachen Symmetrie des Quadrats und der Farbsymmetrie bei $p=1/2$ gilt
$$
\mathbb{P}_{1/2}(B^\ast)=\mathbb{P}_{1/2}(\text{open top–bottom crossing})=\mathbb{P}_{1/2}(\text{open left–right crossing}).
$$
Also ist $2\mathbb{P}_{1/2}(A)=1$. $\blacksquare$

Das ist eine bemerkenswerte Identität: Für jede Größe ist die Durchgangswahrscheinlichkeit bei $p=1/2$ exakt die Hälfte, nicht nur näherungsweise. Sie ist ein scharfer Finite-Size-Test für einen zweidimensionalen Code, und die Benchmark-Suite in `data/benchmarks.json` verwendet sie als primäre Validierung des Samplers.

Was Proposition 4.3 **nicht** liefert, ist $p_c=1/2$. Sie besagt, dass $p=1/2$ ein Fixpunkt der Dualität ist, nicht dass es der kritische Punkt ist. Ein Modell könnte prinzipiell anderswo einen Übergang erster Ordnung haben und die Identität dennoch erfüllen. Diese Lücke schließt der Satz von Harris–Kesten.

## 4.3 Harris–Kesten: die Architektur

**Satz 4.4 (Harris 1960; Kesten 1980).** Für die Kantenperkolation auf $\mathbb{Z}^2$ gilt $p_c=1/2$.

Der Beweis besteht aus zwei Hälften, die unterschiedliche Hilfsmittel verwenden.

**Untere Hälfte, $p_c\ge1/2$ (Harris).** Angenommen, $\theta(1/2)>0$. Dann existiert mit positiver Wahrscheinlichkeit ein unendlicher offener Cluster, und nach dem Eindeutigkeitssatz (Satz 5.3, der nicht vom Wert von $p_c$ abhängt) ist er fast sicher eindeutig. Eine Standardfolgerung aus Eindeutigkeit und positiver Dichte ist, dass die Wahrscheinlichkeit eines offenen Links-rechts-Durchgangs von $\Lambda_n$ für $n\to\infty$ gegen $1$ strebt: Der unendliche Cluster hat positive Dichte, trifft also beide Seiten einer großen Box, und das Durchgangsereignis scheitert nur, wenn der Cluster im Inneren der Box unterbrochen ist, ein Ereignis von exponentiell kleiner Wahrscheinlichkeit. Das widerspricht Proposition 4.3, die die Wahrscheinlichkeit für jedes $n$ auf $1/2$ festlegt. Also ist $\theta(1/2)=0$ und $p_c\ge1/2$.

Der Schritt von der Eindeutigkeit zu „die Durchgangswahrscheinlichkeit strebt gegen eins“ ist der einzige nicht elementare Bestandteil; er wird in Grimmetts *Percolation*, Kapitel 8, bewiesen, und dort geht die Voraussetzung der Amenabilität ein. Alles Übrige in der unteren Hälfte ist Proposition 4.3.

**Obere Hälfte, $p_c\le1/2$ (Kesten).** Der Motor ist die RSW-Ungleichung.

**Satz 4.5 (Russo 1978; Seymour–Welsh 1978).** Es gibt eine Konstante $\delta>0$, sodass für alle $p$ und alle $n$ gilt:
$$
\mathbb{P}_p\big(\Lambda_n\text{ is crossed left–right}\big)\ \ge\ \delta
\quad\text{whenever}\quad
\mathbb{P}_p\big([0,2n]\times[0,n]\text{ is crossed left–right}\big)\ \ge\ \tfrac12 .
$$

Der Beweis ist ein Grobkörnungsargument: Man teile das $2n\times n$-Rechteck in vier $n\times n$-Quadrate; wird das lange Rechteck durchquert, so werden entweder zwei benachbarte Quadrate in derselben Richtung durchquert, oder es existiert ein dualer Durchgang in der komplementären Richtung; FKG verwandelt die Alternative in eine untere Schranke für ein einzelnes Quadrat, und die Iteration der Ungleichung verbessert $\delta$ zu einer von $n$ unabhängigen Konstante.

Mit der RSW-Ungleichung zur Hand ist Kestens Argument eine Blockkonstruktion. Man nehme $p=1/2+\varepsilon$. Für $n$ groß im Vergleich zu $1/\varepsilon$ ist die Wahrscheinlichkeit, dass ein gegebenes $n\times n$-Quadrat von links nach rechts durchquert wird, mindestens $\delta$, und nach FKG verstärken sich die Durchgänge horizontal benachbarter Blöcke gegenseitig. Klebt man eine Kette solcher Blöcke quer durch ein Rechteck der Breite $N$, so ergibt sich ein Links-rechts-Durchgang des gesamten Rechtecks mit einer Wahrscheinlichkeit, die exponentiell in $N/n$ gegen $1$ strebt. Das Stapeln dieser Rechtecke und ein „Leiter“-Argument liefern für jede Skala mit einer durch eine Konstante nach unten beschränkten Wahrscheinlichkeit einen offenen Pfad, der die Distanz $2^k$ erreicht; ein Borel–Cantelli-Argument ergibt dann $\theta(1/2+\varepsilon)>0$. Also ist $p_c\le1/2+\varepsilon$ für jedes $\varepsilon>0$.

**Bemerkung 4.6.** Der Beweis wurde wiederholt vereinfacht. Der Weg bei Bollobás und Riordan (2006) verwendet den Sharp-Threshold-Satz von Friedgut–Kalai; er ist begrifflich sauberer, stützt sich aber auf ein anderes schweres Resultat. Kein Beweis ist kurz. Was für diesen Atlas zählt, ist die Struktur: Dualität liefert den Fixpunkt, RSW liefert Starrheit am Fixpunkt, und die Starrheit hebt den Fixpunkt zum kritischen Punkt.

## 4.4 Paarige Graphen, die Stern-Dreieck-Transformation und die korrigierte kubische Gleichung

**Satz 4.7 (Paarungsrelation).** $G,G^\dagger$ seien ein Paar periodischer planarer Graphen, die zueinander paarig sind, und beide seien amenable. Dann gilt
$$
p_c(G)+p_c(G^\dagger)=1 .
$$

**Beweisidee.** Eine Konfiguration von $G$ und ihre farbgetauschte duale Konfiguration auf $G^\dagger$ sind im Sinne von Lemma 4.2 komplementär. Das planare Separationsargument überträgt die Aussage für endliche Boxen auf die unendliche Version: $G$ hat genau dann keinen unendlichen offenen Cluster, wenn $G^\dagger$ einen unendlichen geschlossenen $\ast$-Cluster hat. Übersetzt man „geschlossener $\ast$-Cluster bei Dichte $1-p$“ in „offener Cluster bei Dichte $q$“, ergibt sich die Identität. Die Amenabilitätsvoraussetzung wird benötigt, um auszuschließen, dass beide Seiten mit positiver Wahrscheinlichkeit nicht perkolieren. $\blacksquare$

Für das Paar (Dreiecksgitter $T$, Honigwabengitter $H$) liefert dies eine Gleichung. Die zweite Gleichung ist die Stern-Dreieck-Identität, und hier muss die Algebra sorgfältig ausgeführt werden.

**Satz 4.8 (Sykes–Essam 1964; ★ Algebra).** Für die Kantenperkolation gilt
$$
p_c(T)=2\sin\frac{\pi}{18}=0.3472963553\ldots,\qquad
p_c(H)=1-2\sin\frac{\pi}{18}=0.6527036447\ldots .
$$

**Herleitung.** Man arbeite auf dem Dreiecksgitter an seinem kritischen Punkt $p=p_c(T)$ und setze $q=1-p$ für die Dichte geschlossener Kanten; nach der Paarungsrelation ist dies die kritische Dichte des Honigwabengitters.

Ein Stern (ein Knoten mit drei Kanten zu drei äußeren Knoten) mit Kantenwahrscheinlichkeit $q$ verbindet alle drei äußeren Knoten paarweise genau dann, wenn alle drei Kanten offen sind, ein Ereignis der Wahrscheinlichkeit $q^3$. Ein Dreieck mit Kantenwahrscheinlichkeit $p$ verbindet seine drei Knoten paarweise, sobald mindestens zwei seiner drei Kanten offen sind, ein Ereignis der Wahrscheinlichkeit
$$
3p^2(1-p)+p^3=3p^2-2p^3 .
$$
Die Stern-Dreieck-Transformation identifiziert diese beiden Netze mit drei Anschlüssen am kritischen Punkt, also gilt
$$
q^3=3p^2-2p^3 .
$$
Die Substitution $q=1-p$ ergibt
$$
(1-p)^3=3p^2-2p^3
\;\Longleftrightarrow\;
1-3p+3p^2-p^3=3p^2-2p^3
\;\Longleftrightarrow\;
p^3-3p+1=0 .
$$
Die kubische Gleichung hat drei reelle Wurzeln, $2\sin(10^\circ)$, $2\sin(50^\circ)$ und $-2\sin(70^\circ)$; nur die erste liegt in $(0,1)$, also
$$
p_c(T)=2\sin\frac{\pi}{18}=0.34729635533\ldots,
\qquad
p_c(H)=1-p_c(T)=0.65270364466\ldots .
$$
Numerische Kontrolle: Mit $p=0.34729635533386066$ gilt $q^3=0.2780661432813856$ und $3p^2-2p^3=0.2780661432813855$; die Werte stimmen bis auf das letzte Bit der doppelten Genauigkeit überein. $\blacksquare$

**Warum eine plausible Abkürzung scheitert.** Ein verlockender, aber falscher Weg setzt die Konnektivität des Dreiecks mit der *Dichte* des Sterns gleich: $3p^2-2p^3=1-p$. Das ist nicht die Drei-Anschluss-Konnektivität eines Sterns; der Stern verbindet alle drei äußeren Knoten nur, wenn alle drei seiner Kanten offen sind, was die Wahrscheinlichkeit $(1-p)^3$ hat. Die falsche Gleichung führt auf die kubische Gleichung
$$
2p^3-3p^2-p+1=(p-\tfrac12)(2p^2-2p-2)
$$
mit der Wurzel $p=1/2$ und zwei Wurzeln außerhalb von $(0,1)$. Sie „sagt“ daher die Kantenschwelle $1/2$ voraus, die tatsächlich die *Platz*-Schwelle des Dreiecksgitters ist. Der numerische Unterschied ist groß ($0.3473$ gegenüber $0.5$), und dass beide Zahlen oft in derselben Tabelle stehen, ist genau der Grund, warum die Herkunft zählt. Die korrekte kubische Gleichung liefert $2\sin 10^\circ$, in Übereinstimmung mit Sykes und Essam (1964).

**Bemerkung 4.9 (zum Status des Y–Δ-Schritts).** Die Identität $q^3=3p^2-2p^3$ ist keine Verteilungsgleichheit eines einzelnen Sterns und eines einzelnen Dreiecks: Die beiden Netze haben unterschiedliche Zyklusstruktur und unterschiedliche Konnektivitätsverteilungen für die drei Randknoten. Sie ist der Grenzwert $q_{\mathrm{RC}}\to1$ der Yang–Baxter-Relation (Stern-Dreieck) für das Random-Cluster-Modell und wird auf der Ebene der Konnektivitätsfunktion mit drei Anschlüssen verwendet; $q_{\mathrm{RC}}$ ist das Clustergewicht des Random-Cluster-Modells, nicht die oben verwendete Dichte $q$ geschlossener Kanten. Sie als lokale Identität zu behandeln, die sich Dreieck für Dreieck anwenden lässt, ist ein häufiger Fehler und führt zu Unsinn; sie ist eine Identität am kritischen Punkt, und ihre rigorose Begründung für das Kantenproblem ist der Inhalt des Sykes–Essam-Paarungsarguments, das später von Wierman rigoros gemacht wurde.

## 4.5 Die Platzschwelle des Dreiecksgitters

**Satz 4.10.** Für die Site-Perkolation auf dem Dreiecksgitter gilt $p_c=1/2$.

**Argumentation (★ Struktur).** Das Dreiecksgitter ist vollständig trianguliert, jede Fläche ist also ein Dreieck, und der Paarungsgraph des Platzproblems ist das Honigwabengitter mit vertauschten Rollen von Knoten und Flächen. Die Stern-Dreieck-Transformation wirkt nun auf *Plätze*: Ein Platz des Dreiecksgitters mit seinen sechs Nachbarn ist dual zu einem Sechseck des Honigwabengitters, dessen sechs Plätze seine dualen Gegenstücke sind. Bei Dichte $p$ ist die Wahrscheinlichkeit, dass ein Platz offen ist, gleich der Wahrscheinlichkeit, dass das entsprechende Sechseck „blockiert“ ist, und die vollständig triangulierte Struktur macht die beiden Ereignisse komplementär. Also gilt
$$
\theta_T(p)>0\iff \theta_H^{\ast}(1-p)=0 ,
$$
und der selbstduale Punkt der Transformation ist $p=1/2$. Die rigorose Version stammt von Wierman (1981); eine vollständige Darstellung findet sich bei Grimmett (1999), §11.9. $\blacksquare$

Menshikov sowie Aizenman–Barsky beweisen die Schärfe des Phasenübergangs, nicht den numerischen Wert dieser Schwelle; in Sekundärquellen werden die beiden Ergebnisreihen oft vermengt.

**Korollar 4.11.** Enthält ein planarer Graph $G$ das Dreiecksgitter als Teilgraphen, so gilt $p_c^{\text{site}}(G)\le1/2$, weil das Hinzufügen von Kanten und Knoten die Schwelle nicht erhöhen kann. Für beliebige planare Graphen gibt es keine derartige universelle untere Schranke: Das Hinzufügen von Kanten zum Dreiecksgitter senkt die Schwelle, und planare Graphen, die ein Dreiecks-Untergitter enthalten, können unter $1/2$ liegen.

## 4.6 Eine Schwellentabelle mit Herkunftsangabe

Die Tabelle enthält die in diesem Atlas durchgängig verwendeten Werte. „Exakt“ steht für einen Satz; „numerisch“ für die beste verfügbare Monte-Carlo- oder Transfermatrix-Schätzung, wobei die letzten Stellen unsicher sind. Die Werte werden mit der Genauigkeit angegeben, die die zitierte Quelle tatsächlich stützt; wo die Quellen in der letzten Stelle abweichen, wird der konservative Wert genannt.

| Gitter | $z$ | Platz-$p_c$ | Kanten-$p_c$ | Status | Quelle |
|---|---|---|---|---|---|
| Kette | 2 | 1 | 1 | exakt | trivial |
| Quadrat $\mathbb{Z}^2$ | 4 | 0.59274605(3) | $1/2$ | Kante exakt, Platz numerisch | Kesten 1980; Jacobsen 2014 |
| Dreieck | 6 | $1/2$ | $2\sin(\pi/18)=0.3472963553$ | exakt | Wierman 1981; Sykes–Essam 1964 |
| Honigwabe | 3 | 0.697043(3) | $1-2\sin(\pi/18)=0.6527036447$ | Kante exakt, Platz numerisch | Sykes–Essam 1964; Jacobsen 2014 |
| Kagome | 4 | $0.6527036447$ | 0.5244053(3) | Platz exakt, Kante numerisch | Paarungsargument; Jacobsen 2014 |
| Einfach kubisch | 6 | 0.3116077(2) | 0.24881182(10) | numerisch | Wang et al. 2013 |
| BCC | 8 | 0.2459(1) | 0.1803(1) | numerisch | Site van der Marck 1997; Bond Lorenz–Ziff 1998 |
| FCC | 12 | 0.1992(1) | 0.1190(1) | numerisch | Site van der Marck 1997; Bond Lorenz–Ziff 1998 |
| Diamant | 4 | 0.4299(2) | 0.3886(2) | numerisch | van der Marck 1997 |
| Bethe-Gitter, Grad $z$ | $z$ | $1/(z-1)$ | $1/(z-1)$ | exakt | Hammersley 1957 |

Zwei Einträge verdienen einen Kommentar. Die Platzschwelle des Kagome-Gitters ist gleich der Kantenschwelle des Honigwabengitters, $1-2\sin(\pi/18)$, und das ist kein Zufall: Das Kagome-Gitter ist im Sinne der Paarungskonstruktion der „Kantengraph“ (line graph) des Honigwabengitters, sodass das Platzproblem auf dem einen dem Kantenproblem auf dem anderen entspricht. Die Übereinstimmung beider Zahlen in allen angegebenen Stellen ist ein guter Test für jede Tabelle, die man irgendwo findet.

Die dreidimensionalen Werte sind die schwächsten Einträge: Sie sind numerisch, die Fehlerbalken betreffen die letzte oder die beiden letzten Stellen, und verschiedene Hochpräzisionsstudien weichen auf diesem Niveau voneinander ab. Sie sollten mit ihren Fehlerbalken zitiert werden oder gar nicht.

## 4.7 Was daraus nicht zu folgern ist

Die Tabelle legt ein falsches Muster nahe: Die Schwellen sinken mit steigender Koordinationszahl. Das Muster ist im Mittel real, aber quantitativ nutzlos. Das Kagome-Gitter hat $z=4$ und eine Platzschwelle von $0.6527$, während das quadratische Gitter dasselbe $z=4$ und eine Platzschwelle von $0.5927$ hat; der Unterschied rührt von der Ringstruktur her, nicht vom Grad. Formeln vom Typ $p_c\approx 2/z$ oder die Galam–Mauger-Interpolation geben die Tabelle auf manchen Gittern bis auf wenige Prozent genau wieder und versagen auf anderen deutlich. Sie sind keine Sätze und sollten niemals dazu dienen, eine Schwelle zu „vorhersagen“, auf die es ankommt. Kapitel 11 listet die Messfallstricke auf, die daraus folgen.
