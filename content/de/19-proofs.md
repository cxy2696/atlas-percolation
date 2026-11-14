---
id: 19-proofs
part: synthesis
order: 19
title: Beweise, Algorithmen und der Status einer Aussage
subtitle: Ein strenger Anhang, mit klar gekennzeichneten Beweisskizzen
reading: 20 min
---

Dieser Atlas mischt drei Arten von Aussagen: Theoreme mit vollständigem Beweis, Theoreme, deren Beweis zu lang ist und deren Voraussetzungen und Folgerungen angegeben werden, und numerische Beobachtungen. Sie zu verwechseln ist der häufigste Fehler in einem Perkolationsargument. Dieser Anhang nennt die Hauptresultate, gibt die kurzen Beweise, skizziert die langen und begründet die Korrektheit jedes Algorithmus der Referenzbibliothek.

## 19.1 Ein Vokabular für den Status

Jede Aussage trägt eine von vier Kennzeichnungen.

- **Theorem.** Eine bewiesene Aussage. Der Beweis steht hier oder wird als konkreter Satz in einer konkreten Quelle zitiert.
- **Beweisskizze.** Der Mechanismus ist korrekt, der fehlende Schritt ist ein Standardargument über Kompaktheit, Kopplung oder endliches Volumen. Eine Skizze ersetzt keinen Beweis in einer Veröffentlichung.
- **Numerisch.** Ein Wert aus einer endlichen Simulation mit angegebenem Seed, Größe und Kriterium. Reproduzierbar, nicht exakt.
- **Vermutung.** Stark gestützt, nicht bewiesen. Vermutungen werden im Text gekennzeichnet, nicht stillschweigend befördert.

Die Unterscheidung ist wichtig, weil die Perkolationsliteratur viele exakte Schwellen enthält; wer einen exakten Wert nicht von einer Extrapolation trennen kann, überschätzt die Präzision eines Anwendungsmodells.

## 19.2 Positive Assoziation: Harris und FKG

Sei $\Omega=\{0,1\}^{E}$ mit dem Produktmaß $\mathbb{P}_p$, geordnet durch Inklusion. Ein Ereignis ist wachsend, wenn das Hinzufügen offener Kanten es nicht zerstören kann; Beispiele sind „es gibt einen Links-rechts-Durchgang“ und „$|C(0)|\ge k$“.

**Theorem (Harris 1960; FKG 1971).** Sind $A$ und $B$ wachsend, so gilt
$$
\mathbb{P}_p(A\cap B)\;\ge\;\mathbb{P}_p(A)\,\mathbb{P}_p(B).
$$

**Beweisskizze.** Man koppelt zwei Konfigurationen $\omega\le\omega'$ mit denselben Uniformen: $e$ ist offen in $\omega$, wenn $U_e\le p$, und in $\omega'$, wenn $U_e\le q$, mit $p\le q$. Diese monotone Kopplung erhält die Ordnung. Eine punktweise Ungleichung für monotone Mengenfunktionen auf der Booleschen Algebra (das Vier-Funktionen-Argument von Harris oder das Verbandsargument von Fortuin–Kasteleyn–Ginibre) liefert die Behauptung. Entscheidend ist, dass die Ungleichung eine Aussage über das Maß ist, nicht über einen bestimmten Graphen.

Zwei Folgerungen werden ständig benutzt. Erstens ist die Durchgangswahrscheinlichkeit wachsend in $p$, der kritische Punkt also als Supremum wohldefiniert. Zweitens kehrt sich die Ungleichung um, wenn $A$ wachsend und $B$ fallend ist.

Harris nutzte sie für eine untere Schranke an $p_c$ auf dem Quadratgitter; FKG machte daraus ein allgemeines Werkzeug für ferromagnetische Systeme.

## 19.3 Disjunkte Realisierung: die BK-Ungleichung

FKG vergleicht Ereignisse, die sich überschneiden dürfen. Die BK-Ungleichung vergleicht Ereignisse, die auf disjunkten Kantenmengen stattfinden müssen.

Für wachsende Ereignisse $A,B$ sei $A\circ B$ das Ereignis, dass es disjunkte Mengen offener Kanten gibt, die $A$ bzw. $B$ bezeugen. Dann gilt
$$
\mathbb{P}_p(A\circ B)\;\le\;\mathbb{P}_p(A)\,\mathbb{P}_p(B)
$$
(van den Berg und Kesten 1985). Das gilt nicht für allgemeine Maße; es ist eine Eigenschaft von Produktmaßen und der daraus durch die üblichen Kopplungen gewonnenen Modelle.

Die Standardanwendung ist der Tail der Clustergröße. Tritt $\{|C(0)|\ge n\}$ ein, kann man den Cluster an einer geeigneten Kante in zwei disjunkte Durchgangsereignisse zerlegen; BK macht aus der rekursiven Schranke exponentiellen Abfall für $p<p_c$. Darauf bauen die Schärfe-Theoreme.

## 19.4 Eindeutigkeit des unendlichen Clusters

**Theorem (Burton und Keane 1989).** Für Bernoulli-Perkolation auf einem amenablen transitiven Graphen wie $\mathbb{Z}^d$ gibt es für jedes $p$ fast sicher höchstens einen unendlichen Cluster.

**Beweisskizze.** Angenommen, zwei unendliche Cluster wären mit positiver Wahrscheinlichkeit disjunkt. Wegen der endlichen Energie kann man endlich viele Kanten umdrehen, um sie zu verschmelzen, ohne die Wahrscheinlichkeit um mehr als einen konstanten Faktor zu ändern. Ein lokales Modifikationsargument zeigt dann, dass die Anzahl unendlicher Cluster keine nicht-degenerierte endliche Zufallsvariable sein kann; Amenabilität schließt unendlich viele aus. Der vollständige Beweis ist kurz, aber nicht trivial. Auf einem regulären Baum ist die Aussage falsch: Dort koexistieren für einen Bereich von $p$ unendlich viele unendliche Cluster. Amenabilität leistet hier echte Arbeit.

Die Eindeutigkeit erlaubt es, von „dem“ unendlichen Cluster und von der Perkolationswahrscheinlichkeit $\theta(p)=\mathbb{P}_p(0\leftrightarrow\infty)$ zu sprechen.

## 19.5 Dualität und exakte Schwellen

Auf dem Quadratgitter ist das Dual einer Bondkonfiguration eine Bondkonfiguration auf dem verschobenen Gitter: Eine duale Kante ist offen genau dann, wenn die primale Kante geschlossen ist. Für eine Box $\Lambda_n$ existiert ein offener Links-rechts-Durchgang von $\Lambda_n$ genau dann, wenn es keinen geschlossenen Oben-unten-Durchgang der Paarungsbox $\Lambda_n^\dagger$ gibt. Das ergibt die Identität für endliche Boxen
$$
\mathbb{P}_{1/2}(A_n)+\mathbb{P}_{1/2}(B_n^\dagger)=1 .
$$
Bei $p=1/2$ macht die Farbsymmetrie aus $B_n^\dagger$ einen offenen Oben-unten-Durchgang der dualen Box. Die duale Box hat eine andere Knotenzahl als $\Lambda_n$, daher sind die beiden Wahrscheinlichkeiten bei endlichem $n$ nicht gleich; ihre Differenz ist ein Randterm. Mit $n\to\infty$ und Proposition 4.3 folgt $\mathbb{P}_{1/2}(A_n)\to1/2$. Harris nutzte diese Grenzaussage für $p_c\ge1/2$; Kesten (1980) bewies $p_c\le1/2$ mit einem feineren Argument, also $p_c=1/2$ exakt. Bei endlichem $n$ ist die Durchgangswahrscheinlichkeit nicht $1/2$: Exakte Abzählung ergibt $3/4$, $43/64$ und $82623/131072$ für die $2\times2$-, $3\times3$- und $4\times4$-Knotenbox.

Die Schwellen von Dreieck und Bienenwabe folgen aus der Stern-Dreieck-Transformation:
$$
p_c(\text{Dreieck})=2\sin\frac{\pi}{18}\approx0.347296,\qquad
p_c(\text{Bienenwabe})=1-2\sin\frac{\pi}{18}\approx0.652704,
$$
der Quadratwert ist $1/2$ (Sykes und Essam 1964; Wierman 1981). Das sind exakte Werte, keine Fits.

Für Platzperkolation auf dem Quadratgitter ist keine solche Identität bekannt; $0.592746\ldots$ ist keine geschlossene Form. Das gerichtete Modell hat bei $p_c$ keine Dualität; daher ist seine Durchgangswahrscheinlichkeit an der Schwelle nicht $1/2$.

## 19.6 Schärfe, RSW und das kritische Fenster

Dualität liefert die Schwelle auf speziellen Gittern, aber nicht die Schärfe des Übergangs auf einem allgemeinen Graphen. Der moderne Weg hat drei Schritte.

1. **RSW.** Für Bernoulli-Perkolation auf dem Quadratgitter sind die Durchgangswahrscheinlichkeiten von Rechtecken bei $p=1/2$ uniform im Seitenverhältnis nach oben und unten beschränkt (Russo 1978; Seymour und Welsh 1978).
2. **Schärfe.** Aizenman und Barsky (1987) sowie Menshikov (1986) zeigten: Für $p<p_c$ fällt der Cluster-Schwanz exponentiell ab und $\chi(p)<\infty$, während $\theta(p)>0$ für $p>p_c$; insbesondere gilt $\chi(p)\to\infty$ für $p\uparrow p_c$. Duminil-Copin und Tassion (2016) gaben mit einer Differentialungleichung einen kurzen Beweis für transitive Graphen.
3. **Kritisches Fenster.** Finite-Size-Scaling sagt, dass der Übergang über ein Fenster der Breite $L^{-1/\nu}$ verschmiert wird. $\nu$ folgt nicht aus der Schärfe: In zwei Dimensionen kommt es aus der konformen Invarianz, in hohen Dimensionen aus der Spitzenentwicklung.

RSW ist auch der Grund, warum eine endliche Box eine wohldefinierte Durchgangswahrscheinlichkeit hat: Die Schranke ist uniform in der Form, also existiert der Limes für wachsende Boxen entlang Rechtecken.

## 19.7 Mean-Field und hohe Dimensionen

Oberhalb der oberen kritischen Dimension $d_c=6$ werden die kritischen Exponenten als Mean-Field-Werte erwartet:
$$
\beta=1,\quad \gamma=1,\quad \nu=1/2,\quad \Delta=2,
$$
mit logarithmischen Korrekturen bei $d=6$. Hara und Slade (1990) bewiesen Mean-Field-Verhalten für hinreichend große $d$ mit der Spitzenentwicklung; Fitzner und van der Hofstad (2017) dehnten den Beweis auf alle $d>10$ aus. Die Fälle $7\le d\le10$ und die logarithmischen Korrekturen bei $d=6$ sind aktive Forschung, kein gesicherter Lehrbuchstoff.

Auf einem Baum oder Bethe-Gitter ist die Rechnung exakt: Für Grad $z$ ist $p_c=1/(z-1)$, die Exponenten sind Mean-Field. Der Baum ist ein nützlicher Test für Näherungen, aber kein Modell eines zweidimensionalen Materials.

## 19.8 Konforme Invarianz in zwei Dimensionen

Cardys Formel (1992) gibt die Links-rechts-Durchgangswahrscheinlichkeit eines kritischen Rechtecks mit verdrahteten linken und rechten Rändern:
$$
\Pi(\ell)=C\,m^{1/3}\,{}_2F_1\!\left(\frac13,\frac23;\frac43;m\right),
\qquad \ell=\frac{H}{W}=\frac{K(m)}{K(1-m)},
$$
wobei $C$ eine Normierungskonstante und $K$ das vollständige elliptische Integral ist. Bei $\ell=1$ ist $m=1/2$ und $\Pi=1/2$.

Smirnov (2001) bewies die konforme Invarianz für Platzperkolation auf dem Dreiecksgitter und identifizierte den Skalierungslimes mit SLE$_6$; Lawler, Schramm und Werner berechneten die daraus folgenden Exponenten. Die Formel ist im Skalierungslimes exakt. Auf einem endlichen Quadratgitter nähert sich die gemessene Wahrscheinlichkeit mit einer Korrektur, die mit $L$ verschwindet; das Labor zeigt Kurve und Messpunkte, statt die Korrektur zu verstecken.

## 19.9 Korrektheit der Algorithmen

Die folgenden Aussagen prüft die Testsuite; jede ist ein kleiner Beweis.

**Union-Find.** Invariante: `find(x)` liefert die Wurzel des Baums mit $x$, und `size[root]` ist die Zahl der Elemente. Union by size hängt die kleinere Wurzel unter die größere; eine Wurzel der Größe $s$ kann nur an eine Wurzel der Größe mindestens $s$ gehängt werden, die Tiefe ist $O(\log n)$. Path halving zeigt jeden zweiten Knoten auf den Großelternteil und ergibt zusammen mit Union by size die amortisierte Inverse-Ackermann-Schranke (Tarjan 1975).

**Hoshen–Kopelman.** Jeder Platz wird einmal besucht, jede Kante zwischen einem Platz und einem bereits besuchten Nachbarn einmal bearbeitet. Zwei Labels werden genau dann vereinigt, wenn die entsprechenden Komponenten durch eine offene Kante verbunden sind; nach dem Scan sind die Labelklassen die Zusammenhangskomponenten. Das ist eine Spannwald-Konstruktion, keine Näherung.

**Newman–Ziff.** Nach den ersten $k$ Kanten einer uniformen zufälligen Permutation ist die offene Menge eine Stichprobe der Bondperkolation bei $p=k/m$. Das ist exakt, weil eine uniforme Permutation bedingt auf ihre ersten $k$ Elemente ein uniformes $k$-Tupel liefert. Der gepflegte zweite Moment erfüllt $M_2\mapsto M_2+2ab$, wenn Komponenten der Größen $a,b$ verschmelzen; die berichtete Suszeptibilität ist für die gezogene Konfiguration exakt.

**Leath-Wachstum.** Bedingt darauf, dass der Seed besetzt ist, wird jede Kante an einem besuchten Platz einmal mit der korrekten Bernoulli-Wahrscheinlichkeit getestet. Eine offene Kante zu einem unbesuchten Platz wird erkundet, eine geschlossene als Rand notiert. Per Induktion über die BFS-Reihenfolge ist die besuchte Menge genau der Cluster des Seeds. Die einzige Verzerrung ist der optionale Größenabschneider, der den Tail kappt.

**Bootstrap-Abschluss.** Der Update-Operator ist monoton: Aus $S\subseteq T$ folgt $F(S)\subseteq F(T)$. Ein monotoner Operator auf einem endlichen Gitter hat einen kleinsten Fixpunkt, den man durch Iteration vom Startwert erhält. Der Queue-Algorithmus aktiviert einen Platz in der ersten Runde, in der seine Zahl aktiver Nachbarn $r$ erreicht; er berechnet also diesen kleinsten Fixpunkt. Gleichstände und Reihenfolge ändern das Ergebnis nicht.

**Invasion-Perkolation.** Die akzeptierten Kanten bilden einen Baum: Eine Kante wird nur akzeptiert, wenn sie einen besuchten mit einem unbesuchten Platz verbindet; es entsteht kein Kreis, und jeder akzeptierte Platz außer dem Seed wird über genau eine akzeptierte Kante erreicht. Die gierige Wahl der kleinsten Randschwelle ist die Definition des Prozesses; der Heap implementiert sie exakt. Kreiskanten werden verworfen.

**Achlioptas-Prozess.** Der Union-Find-Zustand nach jedem Schritt ist die Komponentenpartition des Graphen aus den bisher gewählten Kanten. Die Regel wählt einen von zwei Kandidaten allein anhand der aktuellen Komponentengrößen; die Trajektorie ist also eine deterministische Funktion der Kandidatenfolge und des Startgraphen. Der Endlichkeitssprung in $S_{\max}$ ist eine Eigenschaft dieser Trajektorie, kein Beweis einer thermodynamischen Unstetigkeit; die Skalenprüfung im Labor macht den Unterschied sichtbar.

## 19.10 Statistischer Fehler und Endlichkeitsverzerrung

Ein Monte-Carlo-Schätzer $\hat\pi$ aus $n$ unabhängigen Stichproben hat den Standardfehler $\sqrt{\pi(1-\pi)/n}$. Ein 95%-Intervall ist $\hat\pi\pm1.96\,\mathrm{se}$ für großes $n$; für kleines $n$ nutzt man Wilson oder Jeffreys, nicht die Normalapproximation. Hoeffdings Ungleichung liefert die verteilungsfreie Schranke
$$
\mathbb{P}(|\hat\pi-\pi|\ge\epsilon)\le2e^{-2n\epsilon^2},
$$
nützlich, wenn eine garantierte Genauigkeit verlangt ist.

Die Endlichkeitsverzerrung ist ein separater Fehler. Die Durchgangswahrscheinlichkeit bei $p_c$ konvergiert erst nach einer Korrektur der Ordnung $L^{-1/\nu}$ gegen $1/2$; der aus dem Suszeptibilitätsmaximum extrahierte Pseudokritikpunkt ist um einen Term derselben Ordnung verschoben. Ein Fit ohne Korrektur liefert einen Exponenten, der vom verwendeten $L$-Bereich abhängt. Das korrekte Protokoll: mit Korrekturterm fitten, den Bereich berichten und die Residuen zeigen.

## 19.11 Was nicht bekannt ist

- Die exakte Platzschwelle des Quadratgitters ist nicht in geschlossener Form bekannt.
- Die exakte Bondschwelle in drei Dimensionen ist unbekannt; die besten numerischen Werte haben viele Stellen, aber keinen Beweis.
- Die kritischen Exponenten in drei Dimensionen sind nicht als bestimmte rationale Werte bewiesen.
- Der Skalierungslimes der kritischen Perkolation in drei Dimensionen ist nicht konstruiert.
- Die Schärfe des Übergangs für alle transitiven Graphen ist nicht in voller Allgemeinheit bekannt.

Diese Liste ist keine Schutzklausel, sondern Teil eines ehrlichen Umgangs mit der Theorie. Ein numerischer Wert in diesem Atlas wird nie als Theorem präsentiert, und ein Theorem nie ohne seine Voraussetzungen.

## 19.12 Die Quellen lesen

Die Primärquellen dieses Anhangs sind Grimmetts *Percolation* (1999) für den strengen Kern, Bollobás und Riordans *Percolation* (2006) für die moderne probabilistische Darstellung sowie die oben zitierten Originalarbeiten. Die Beweise in diesem Kapitel sind Skizzen, wo das vollständige Argument mehrere Seiten füllen würde; sie sind als Skizzen gekennzeichnet. Die Algorithmen werden durch ausführbare Tests geprüft, nicht durch Prosa: siehe `tests/js/algorithms.test.js`, `lib/python/tests/test_algorithms.py` und `data/golden/algorithms-v3.json`.

### Ein kurzes Regal

Wer ein strenges Buch will, nimmt Grimmetts *Percolation*; wer die moderne probabilistische Sicht mit für ein Graduiertenkurs geschriebenen Beweisen will, nimmt Bollobás und Riordan. Stauffer und Aharony bleiben der schnellste Weg in die Sprache der Physiker; Sahimis *Applications of Percolation Theory* ist die Brücke zu porösen Medien, Verbundwerkstoffen und Transport. Meester und Roy sind die Standardreferenz für Kontinuumsperkolation; Hunt, Ewing und Ghanbarian gehen sorgfältig von der Perkolation zum Fluss in realen porösen Medien.

Für Netzwerke ist Newmans *Networks* das allgemeine Lehrbuch, Dorogovtsevs *Lectures on Complex Networks* die kompakte theoretische Darstellung und Bianconis *Multilayer Networks* der richtige Einstieg, wenn eine Schicht nicht reicht. Lyons und Peres ist die rigorose Referenz für Bäume und Verzweigungsprozesse; für Epidemien sind Kiss, Miller und Simon sowie Keeling und Rohani der richtige nächste Schritt. Christensen und Moloney verbinden Perkolation mit Kritikalität, ohne die Physik zu verstecken. Bunde und Havlin, Hughes und Zallen sind ältere Bücher, die sich noch lohnen: Sie enthalten Argumente und experimentellen Kontext, den moderne Reviews wegkürzen.

Unter den Reviews sind Saberi (2015) und Li et al. (2021) breit und gut belegt; D'Souza et al. (2019) ist die ehrliche Darstellung der explosiven Perkolation; Boccaletti et al. (2014) und Kivelä et al. (2014) decken multilayer networks von Struktur bis Dynamik ab. Isichenko (1992) ist noch immer der beste lange Essay über Perkolation, statistische Topographie und Transport in zufälligen Medien; Berkowitz und Ewing (1998) sind eine kompakte Einführung in die bodenphysikalischen Anwendungen.

Das sind Lesevorschläge, keine kanonische Liste. Die Bibliographie in der Sources-Ansicht ist der vollständige Nachweis, mit DOI oder URL für jeden Eintrag und einem Hinweis, wo kein DOI existiert.
