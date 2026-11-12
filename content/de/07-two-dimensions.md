---
id: 07-two-dimensions
part: Critical phenomena
order: 7
title: 'Zwei Dimensionen: Cardy, Smirnov, SLE'
subtitle: Die einzige Dimension mit einer exakten konformen Lösung
reading: 19 min
---

In zwei Dimensionen ist die kritische Grenzlinie eine Kurve, und Kurven besitzen eine unendlichdimensionale Symmetriegruppe: die konformen Abbildungen. Am kritischen Punkt genügt diese Symmetrie, um das Skalierungslimit des Dreiecksgittermodells zu bestimmen. Dieses Kapitel folgt der Kette von Cardys Vermutung aus dem Jahr 1992 über Smirnovs Satz von 2001 bis zur SLE-Beschreibung von Lawler, Schramm und Werner und hält den exakten Exponentensatz fest, der dabei herauskommt.

## 7.1 Warum die Grenzlinie das richtige Objekt ist

Bei $p_c$ ist der offene Cluster des Ursprungs ein Fraktal mit $d_f=91/48\approx1.896$, und sein Rand ist eine Zufallskurve, die auf jeder Skala fluktuiert. Betrachtet wird die Explorationsgrenzlinie: Man beginne an einem Randpunkt eines einfach zusammenhängenden Gebiets und wandere entlang der Grenze zwischen dem offenen Cluster, der den einen Bogen berührt, und dem geschlossenen Cluster, der den anderen berührt. Die Wanderung ist durch die Färbung bestimmt, lässt sich ohne Vorausschau erzeugen, und ihr Gesetz ist das Objekt, dessen Skalierungslimit bestimmt werden soll.

Zwei Eigenschaften dieser Wanderung stammen vom Gitter und überleben den Kontinuumslimes:

- **Gebiets-Markov-Eigenschaft (domain Markov property).** Bedingt auf die Grenzlinie bis zur Zeit $t$ ist das Gesetz der verbleibenden Konfiguration im unerforschten Gebiet dasselbe Perkolationsgesetz, wobei die Randbedingungen von der Grenzlinie transportiert werden.
- **Farbsymmetrie.** Bei $p=1/2$ bleibt das Gesetz unter Vertauschung von offen und geschlossen invariant.

Eine Zufallskurve mit diesen beiden Eigenschaften und konformer Invarianz ist eine SLE; der Parameter wird durch die Lokalität festgelegt, die kontinuierliche Form der Gebiets-Markov-Eigenschaft zusammen mit der Farbsymmetrie. Das ergibt $\kappa=6$.

## 7.2 Smirnovs Satz

**Satz 7.1 (Smirnov 2001).** Sei $\Omega$ ein einfach zusammenhängendes Gebiet mit vier markierten Randpunkten $A,B,C,D$, die im Gegenuhrzeigersinn angeordnet sind, und sei $\Omega_\delta$ eine Diskretisierung durch das Dreiecksgitter mit Maschenweite $\delta$. Für die kritische Site-Perkolation auf $\Omega_\delta$ besitzt die Wahrscheinlichkeit eines offenen Durchgangs vom Bogen $AB$ zum Bogen $CD$ einen Grenzwert für $\delta\to0$, der konform invariant ist; für ein Rechteck mit Seitenverhältnis $\ell=H/W$ ist dieser Grenzwert Cardys Formel.

**Aufbau des Beweises.** Der Beweis hat vier Schritte, und jeder einzelne lohnt sich, weil sie zusammen die Vorlage für alle späteren Ergebnisse dieser Art bilden.

*Schritt 1: drei Observablen.* Für einen Punkt $z$ im Gebiet seien $H_1(z),H_2(z),H_3(z)$ die Wahrscheinlichkeiten, dass die von $z$ ausgehende Grenzlinie durch einen der drei durch die markierten Punkte bestimmten Randbögen austritt. Sie summieren sich zu eins, und jede ist eine Funktion vom harmonischen Typ in $z$.

*Schritt 2: diskrete Cauchy–Riemann-Gleichung.* Auf dem Dreiecksgitter bestimmt die Farbe eines Knotens den lokalen Schritt der Grenzlinie, und die Dreifärbung des hexagonalen Dualgitters bewirkt, dass die Kombination $H_1+\omega H_2+\omega^2H_3$ (mit $\omega=e^{2\pi i/3}$) eine diskrete Cauchy–Riemann-Gleichung erfüllt. Hier liegt das technische Herzstück: Das Gitter ist genau jenes, auf dem sich die diskrete holomorphe Struktur schließt.

*Schritt 3: Kompaktheit.* RSW-Abschätzungen liefern gleichmäßige Schranken für die Oszillation der $H_i$ auf allen Skalen; die Familie ist daher präkompakt, und eine Teilfolge konvergiert.

*Schritt 4: Identifikation.* Der Grenzwert ist holomorph, besitzt die von der Geometrie erzwungenen Randwerte und ist daher eindeutig. Cardys Formel ist die Lösung dieses Randwertproblems.

**Warum das Dreiecksgitter.** Die diskrete Holomorphie in Schritt 2 nutzt die Struktur des Dreiecksgitters zusammen mit seinem hexagonalen Paarungsgraphen: Jede Fläche ist ein Dreieck, sodass die Grenzlinie genau drei lokale Möglichkeiten hat. Was den Beweis schließt, ist die Dreiecksstruktur der Flächen, nicht eine Selbstdualität. Für das Quadratgitter oder ein allgemeines planares Gitter ist nicht bekannt, ob das entsprechende diskrete Objekt konvergiert; die konforme Invarianz des Skalierungslimits ist dort weiterhin eine Vermutung, die von sehr starker Numerik gestützt wird. Dies ist das zentrale offene Problem der rigorosen zweidimensionalen Theorie.

## 7.3 Cardys Formel, mit geprüften Konstanten

Sei $\ell=H/W$ das Seitenverhältnis eines Rechtecks und $\pi(\ell)$ die Wahrscheinlichkeit, dass bei Kritikalität ein offener Durchgang von der linken zur rechten Seite existiert. Am klarsten schreibt man Cardys Formel über den Ellipsenmodul $m\in(0,1)$:

$$
\ell=\frac{K(m)}{K(1-m)},\qquad
K(m)=\int_0^{\pi/2}\frac{dt}{\sqrt{1-m\sin^2t}},
$$

wobei $K$ das vollständige elliptische Integral erster Art ist. Dann gilt

$$
\pi(\ell)=\frac{3\,\Gamma(2/3)}{\Gamma(1/3)^2}\;m^{1/3}\;{}_2F_1\!\left(\frac13,\frac23;\frac43;m\right),
\qquad 0<\ell\le1,
$$

und für $\ell>1$ wird die Symmetrie $\pi(\ell)=1-\pi(1/\ell)$ verwendet. Der Modul ist nicht das Seitenverhältnis: Bei $\ell=1$ ist $m=1/2$, und mit fallendem $\ell$ fällt $m$ schnell. Genau hier scheitert eine verlockende Abkürzung: Setzt man $-\ell$ direkt in die hypergeometrische Funktion ein, erhält man eine andere Funktion, die bei mäßigen Seitenverhältnissen viel zu flach ist. Das richtige Argument ist der Modul $m$; die elliptische Relation trägt die Geometrie.

Drei Prüfungen legen die Konstanten und die Orientierung fest.

*Symmetrie.* Bei $\ell=1$, $m=1/2$, ist ${}_2F_1(1/3,2/3;4/3;1/2)=1.1129126745\ldots$, $m^{1/3}=0.7937005260\ldots$ und $3\Gamma(2/3)/\Gamma(1/3)^2=0.5660466804\ldots$; das Produkt ist $0.5$ bis auf Maschinengenauigkeit. Das ist der Cardy-Wert für $\ell=1$; er stimmt mit dem Grenzwert $L\to\infty$ aus Proposition 4.3 überein, nicht mit einer Identität bei jeder endlichen Größe.

*Grenzwerte.* Für $\ell\to0$ geht $m\to0$ und $\pi\to0$; für $\ell\to\infty$ geht $\pi\to1$. Beides ist geometrisch plausibel: Ein sehr breites, flaches Rechteck wird fast nie links–rechts durchquert, ein sehr hohes fast immer.

*Werte.* $\pi(0.1)=4.0394890896\times10^{-5}$, $\pi(0.25)=0.0216300291$, $\pi(0.5)=0.1756468938$, $\pi(1)=0.5$, $\pi(2)=0.8243531062$, $\pi(4)=0.9783699709$, $\pi(10)=0.9999596051$. Die Steilheit ist real; deshalb braucht eine Simulation mit fester schmaler Breite große Seitenverhältnisse, bevor die asymptotische Kurve sichtbar wird.

**Numerische Auswertung.** Der Modul wird durch Bisektion auf $m\in[0,1/2]$ gefunden, $K$ über das arithmetisch–geometrische Mittel. Weil nur $m\le1/2$ ausgewertet wird, konvergiert die hypergeometrische Reihe schnell. Der Code in `lib/js/engine/cardy.js`, `lib/python/percolation_atlas/cardy.py`, `lib/cpp/include/percolation_atlas/cardy.hpp` und `lib/julia/src/cardy.jl` folgt diesem Weg; die obigen Regressionswerte stehen in allen vier Testsuiten.

**Bemerkung 7.2.** In der Literatur sind zwei Konventionen verbreitet. Manche Autoren nehmen $\ell=W/H$ und den vertikalen Durchgang, was $\pi(\ell)$ durch $1-\pi(1/\ell)$ ersetzt; andere verwenden ein Doppelverhältnis oder einen Nome statt des Moduls. Die obige Formel liefert mit $\ell=H/W$ und links–rechts-Durchgang $\pi(1)=1/2$ und $\pi(\infty)=1$. Wer mit einer Arbeit vergleicht, sollte zuerst die Konvention prüfen, bevor er einen Faktor für falsch hält.

## 7.4 SLE und der Exponentensatz

**Definition 7.3 (chordale SLE$_\kappa$).** Sei $B_t$ eine standardisierte Brownsche Bewegung und $\xi_t=\sqrt\kappa\,B_t$. Der Loewner-Fluss in der oberen Halbebene ist die Lösung von
$$
\partial_t g_t(z)=\frac{2}{g_t(z)-\xi_t},\qquad g_0(z)=z,
$$
und die SLE-Spur ist $\gamma(t)=g_t^{-1}(\xi_t)$.

**Satz 7.4 (Lawler–Schramm–Werner 2001).** Das Skalierungslimit der kritischen Perkolationsgrenzlinie auf dem Dreiecksgitter ist SLE$_6$.

Der Parameter wird durch die Lokalitätseigenschaft festgelegt: Unter allen SLE$_\kappa$ hat nur $\kappa=6$ ein Gesetz, das unter Einschränkung des Gebiets bis auf Zeitumparametrisierung invariant ist. (Die Restriktionseigenschaft ist eine andere Bedingung; sie gehört zu $\kappa=8/3$.) Die Lokalität ist genau die Kontinuumsversion der Gebiets-Markov-Eigenschaft in Verbindung mit der Farbsymmetrie, die die Perkolation bei $p=1/2$ besitzt.

Aus $\kappa=6$ folgen die Exponenten durch Berechnung Brownscher Schnittpunktexponenten. Das Ergebnis ist
$$
\beta=\frac{5}{36},\quad
\gamma=\frac{43}{18},\quad
\nu=\frac43,\quad
\delta=\frac{91}{5},\quad
\eta=\frac{5}{24},\quad
d_f=\frac{91}{48}=1.895833\ldots
$$

**Konsistenzprüfung.** Mit diesen Werten gilt
$$
\gamma=(2-\eta)\nu=\frac{43}{24}\cdot\frac43=\frac{43}{18},\qquad
\beta=\frac{\nu(d-2+\eta)}{2}=\frac{4}{3}\cdot\frac{5}{24}\cdot\frac12=\frac{5}{36},
$$
$$
d_f=\frac{d+2-\eta}{2}=\frac{4-5/24}{2}=\frac{91}{48},\qquad
\delta=1+\frac{\gamma}{\beta}=1+\frac{43/18}{5/36}=\frac{91}{5}.
$$
Alle vier Relationen schließen exakt, was ein starker Hinweis darauf ist, dass keine Ziffer falsch ist.

Der Einarm-Exponent ist $\beta/\nu=5/48$:
$$
\mathbb{P}_{p_c}\big(0\leftrightarrow\partial\Lambda_n\big)\asymp n^{-5/48}=n^{-0.104166\ldots}.
$$
Ein berichteter Exponent von $n^{-2/3}$ ist mit diesem Wert unvereinbar, und die Abweichung ist leicht zu erkennen, weil $\beta/\nu$ gleich $5/48$ sein muss, damit der Exponentensatz in sich konsistent ist. Kapitel 14 dokumentiert die Korrekturgeschichte.

## 7.5 Was die zweidimensionale Lösung liefert und was nicht

Sie liefert die Exponenten, die Durchgangswahrscheinlichkeiten, die Arm-Exponenten und die konforme Invarianz des Skalierungslimits — für das Dreiecksgitter und für Gitter, die durch Stern-Dreieck-Transformationen mit ihm verbunden sind. Im Prinzip liefert sie die vollständige Kontinuumsbeschreibung der kritischen Geometrie.

Sie liefert nicht die Schwelle auf einem beliebigen Gitter. Cardys Formel betrifft den kritischen Punkt; sie sagt nichts darüber aus, wo dieser liegt. Die Schwelle bleibt eine gitterabhängige Größe, die für eine Handvoll Gitter exakt (Kapitel 4) und für die übrigen numerisch bekannt ist.

Sie liefert außerdem nicht das vollständige Skalierungslimit des *Clusters* als Menge, sondern nur das der Grenzlinien. Die Gesamtheit aller Grenzlinien — das „vollständige Skalierungslimit“ — wird durch die Brownian-Loop-Soup- und CLE$_\kappa$-Technik beschrieben, die eine eigenständige, umfangreiche Theorie darstellt. Für die Zwecke dieses Atlas genügt die Aussage über die Grenzlinien: Jeder Exponent in der Tabelle folgt aus ihr, und jede numerische Prüfung der zweidimensionalen Perkolation lässt sich als Prüfung der Cardy-Formel oder eines Arm-Exponenten formulieren.

## 7.6 Numerische Fingerabdrücke

Drei Zahlen identifizieren die kritische zweidimensionale Perkolation zweifelsfrei:

1. die Durchgangswahrscheinlichkeit bei $p_c$ ist beim Seitenverhältnis $1$ gleich $1/2$ (und folgt für andere Seitenverhältnisse Cardys Kurve);
2. die Einarmwahrscheinlichkeit fällt wie $n^{-5/48}$ ab;
3. die Clustergrößenverteilung fällt wie $n^{-1-1/\delta}=n^{-96/91}=n^{-1.0549\ldots}$ ab.

Eine Simulation, die (1), aber nicht (2) reproduziert, hat ein Finite-Size-Problem; eine, die (2), aber nicht (3) reproduziert, hat ein Problem bei der Clusterzählung. Die drei zusammen sind eine viel stärkere Prüfung als jeder einzelne Exponentenfit, und die Benchmark-Suite in diesem Repository gibt alle drei an.
