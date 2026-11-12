---
id: 06-exponents
part: Critical phenomena
order: 6
title: Exponenten, Skalierungsrelationen und Universalität
subtitle: Was die Zahlen bedeuten und welche von ihnen Sätze sind
reading: 17 min
---

Bei $p_c$ divergiert die Korrelationslänge, und das System verliert seine einzige Längenskala. Alles, was übrig bleibt, ist ein Potenzgesetz, und die Exponenten dieser Potenzgesetze bilden den quantitativen Gehalt der Universalität. Dieses Kapitel definiert sie, leitet die Beziehungen zwischen ihnen her und trennt die exakt bekannten Exponenten von jenen, die nur numerisch bekannt sind.

## 6.1 Definitionen

Für $p\downarrow p_c$ (bei $\theta$) und $p\to p_c$ von beiden Seiten (bei den übrigen Größen):

$$
\theta(p)\sim(p-p_c)^{\beta},\qquad
\chi(p)\sim|p-p_c|^{-\gamma},\qquad
\xi(p)\sim|p-p_c|^{-\nu},
$$
$$
\mathbb{P}_{p_c}\big(|C_0|=n\big)\sim n^{-1-1/\delta},\qquad
\tau_{p_c}(x)\sim|x|^{-(d-2+\eta)},\qquad
M\sim R^{d_f}.
$$

Die Clusterzahldichte ist $n_s(p)=\mathbb{P}_p(|C_0|=s)/s$; am kritischen Punkt gilt $n_s\sim s^{-\tau}$ mit $\tau=2+1/\delta$. Die fraktale Dimension $d_f$ beschreibt die Masse-Radius-Relation eines kritischen Clusters, die spektrale Dimension $d_s$ die Rückkehrwahrscheinlichkeit eines Zufallswegs auf ihm und $d_{\min}$ den Kürzeste-Wege-Abstand (chemischen Abstand).

Die **Einarmwahrscheinlichkeit** ist die Wahrscheinlichkeit, dass der Ursprung bei $p_c$ mit dem Rand einer Box der Seitenlänge $n$ verbunden ist:
$$
\pi_{\text{arm}}(n)=\mathbb{P}_{p_c}\big(0\leftrightarrow\partial\Lambda_n\big).
$$
Sie skaliert wie $n^{-\beta/\nu}$. Diese Identität dient ständig als Fingerabdruck. Der zweidimensionale Wert ist $n^{-5/48}=n^{-0.10417\ldots}$; ein häufig anzutreffendes $n^{-2/3}$ ist mit dem Exponentensatz unvereinbar und ein nützliches Diagnostikum für eine abgeschriebene Formel.

## 6.2 Die Tabelle

| | $\beta$ | $\gamma$ | $\nu$ | $\delta$ | $\eta$ | $d_f$ | Status |
|---|---|---|---|---|---|---|---|
| $d=1$ | 0 | 1 | 1 | $\infty$ | — | 0 | exakt, entartet |
| $d=2$ | $5/36$ | $43/18$ | $4/3$ | $91/5$ | $5/24$ | $91/48$ | Satz (SLE) |
| $d=3$ | 0.4181(1) | 1.793(3) | 0.8764(1) | 5.29(1) | $-0.046(2)$ | 2.5229(1) | numerisch |
| $d=4$ | 0.639(2) | 1.44(2) | 0.689(2) | 3.26(2) | — | — | numerisch |
| $d=5$ | 0.77(1) | 1.18(1) | 0.54(1) | — | — | — | numerisch |
| $d\ge6$ | 1 | 1 | $1/2$ | 2 | 0 | 4 | Satz ($d>6$), Logarithmen bei $d=6$ |
| Bethe | 1 | 1 | $1/2$ | 2 | 0 | 4 | exakt |
| Gerichtet, $d=2$ | 0.276(1) | 2.277(3) | 1.096(2) | — | — | — | numerisch, eigene Klasse |

Die Zeile $d=1$ ist die untere kritische Dimension: Die Schwelle liegt bei $p=1$, der Cluster ist ein Segment, und die folgenden Hyperskalierungsrelationen entarten (sie sind für $d\ge2$ formuliert). Die zweidimensionale Zeile ist die einzige, die zugleich exakt und nicht im Molekularfeld-Sinne ist. Sie stammt aus der SLE-Beschreibung des Skalierungslimits (Kapitel 7), und jeder Eintrag lässt sich an den folgenden Relationen prüfen. So sollte die Tabelle auch gelesen werden: nicht als sechs unabhängige Zahlen, sondern als eine kleine, durch Konsistenz eingeschränkte Menge.

Für $d=3$ stammen die obigen Werte von Wang, Zhou, Zhang, Garoni und Deng (2013); sie wurden aus $L\le512$ mit etwa $2.5\times10^7$ Stichproben je Größe gewonnen. Sie sind mit der Genauigkeit angegeben, die die Methode hergibt; die dritte Nachkommastelle ist zwischen den Methoden nicht stabil.

**Konsistenzprüfung für $d=3$.** Mit $\nu=0.8764$:
$$
\delta=1+\frac{\gamma}{\beta}=1+\frac{1.793}{0.4181}=5.288,\qquad
\eta=2-\frac{\gamma}{\nu}=2-\frac{1.793}{0.8764}=-0.0457,
$$
$$
d_f=d-\frac{\beta}{\nu}=3-0.4771=2.5229,\qquad
\frac{d+2-\eta}{2}=\frac{5.0457}{2}=2.5229 .
$$
Alle vier Relationen schließen im Rahmen der angegebenen Genauigkeit. Das ist kein Beweis für die Werte, aber ein Wertesatz, der diese Prüfungen nicht besteht, ist mit Sicherheit falsch.

## 6.3 Die Skalierungsrelationen

Die folgenden Relationen sind keine unabhängigen Sätze; sie folgen aus einem Skalierungsansatz. Bei jeder Herleitung ist angegeben, was sie voraussetzt.

**Relation 1: $d_f=d-\beta/\nu$ (★, nur Skalierungsansatz).** Am pseudokritischen Punkt einer Box der Seitenlänge $L$ ist der effektive Abstand vom kritischen Punkt $\varepsilon\sim L^{-1/\nu}$, also ist die Perkolationswahrscheinlichkeit $\theta\sim L^{-\beta/\nu}$. Sie ist zugleich die Wahrscheinlichkeit, dass ein gegebener Platz im größten Cluster liegt, dessen Masse $\sim L^{d_f}$ beträgt; daraus folgt $\theta\sim L^{d_f-d}$. Gleichsetzen der beiden Ausdrücke ergibt $d_f=d-\beta/\nu$. $\blacksquare$

**Relation 2: $\gamma=(2-\eta)\nu$ (★, nur Skalierungsansatz).** Nach Definition gilt
$$
\chi=\sum_x\tau(x)\asymp\int_{\mathbb R^d}|x|^{-(d-2+\eta)}e^{-|x|/\xi}\,dx
=\xi^{2-\eta}\int|u|^{-(d-2+\eta)}e^{-|u|}\,du .
$$
Das Integral ist eine endliche Konstante, also gilt $\chi\asymp\xi^{2-\eta}$. Mit $\chi\sim\varepsilon^{-\gamma}$ und $\xi\sim\varepsilon^{-\nu}$ folgt $\gamma=(2-\eta)\nu$. $\blacksquare$

**Relation 3: Fisher, $d_f=(d+2-\eta)/2$ (Hyperskalierung, $d\le d_c$).** Die Masse-Radius-Relation und die Zweipunktfunktion müssen für die Dichte eines kritischen Clusters im Abstand $r$ übereinstimmen: Der Cluster besetzt $\sim r^{d_f}$ Plätze in einer Kugel vom Volumen $r^d$, und die Konnektivität zu einem Platz im Abstand $r$ ist $\sim r^{-(d-2+\eta)}$. Gleichsetzen der beiden Dichten ergibt $d_f=(d+2-\eta)/2$. Zusammen mit Relation 1 folgt $\beta=\nu(d-2+\eta)/2$, die Form, in der die Relation üblicherweise zitiert wird. Die Relation ist eine Hyperskalierungsrelation: Sie versagt oberhalb von $d_c=6$, wo $d_f=4$ fest bleibt, während $(d+2)/2$ wächst. $\blacksquare$

**Relation 4: $\delta=1+\gamma/\beta$ (Widom; Standardargument der Skalierung).** Man nehme die Skalierungsform der Clusterzahldichte an:
$$
n_s(p)=s^{-\tau}f\big(s/s^\ast\big),\qquad s^\ast\sim\varepsilon^{-1/\sigma},\qquad \tau=2+\frac1\delta,\quad \sigma=\frac1{\beta\delta}.
$$
Dann gilt
$$
\theta(p)\asymp\sum_{s>s^\ast}s\,n_s\asymp (s^\ast)^{2-\tau}=(s^\ast)^{-1/\delta}\sim\varepsilon^{\beta},
$$
was mit der Definition von $\beta$ übereinstimmt, und
$$
\chi(p)\asymp\sum_{s<s^\ast}s^2n_s\asymp(s^\ast)^{3-\tau}=(s^\ast)^{1-1/\delta}\sim\varepsilon^{-\beta(\delta-1)} .
$$
Der Vergleich mit $\chi\sim\varepsilon^{-\gamma}$ ergibt $\gamma=\beta(\delta-1)$, also $\delta=1+\gamma/\beta$. $\blacksquare$

**Relation 5: Josephson, $d\nu=2\beta+\gamma$ (Hyperskalierung, $d\le d_c$).** Das Analogon der freien Energie in der Perkolation skaliert wie $\xi^{-d}$, und seine zweite Ableitung nach dem zum Ordnungsparameter konjugierten Feld ist $\chi$. Die Dimensionsanalyse liefert $d\nu=2\beta+\gamma$. Zweidimensionale Probe: $d\nu=8/3$ und $2\beta+\gamma=10/36+43/18=8/3$. Molekularfeld-Probe bei $d=6$: Beide Seiten sind gleich $3$. Oberhalb von sechs Dimensionen wächst die linke Seite mit $d$, die rechte nicht — genau das Versagen der Hyperskalierung. $\blacksquare$

Das Muster lässt sich klar benennen: Die Relationen 1 und 2 sind Buchführung und gelten, wann immer der Skalierungsansatz gilt. Die Relationen 3 und 5 sind Hyperskalierungsrelationen und gelten nur bei oder unterhalb der oberen kritischen Dimension. Relation 4 ist eine Buchführungsidentität für die Clustergrößenverteilung. Keine von ihnen beweist einen Exponenten; sie sind Bedingungen, die jeder Kandidatensatz erfüllen muss.

## 6.4 Warum die obere kritische Dimension sechs ist

Die obere kritische Dimension ist die Dimension, oberhalb derer die Molekularfeld-Exponenten exakt werden. Für selbstmeidende Wege ist sie vier, für die Perkolation sechs. Der Unterschied beruht auf einem Abzählargument über Schleifen, und es lohnt sich, es sorgfältig durchzuführen, weil die Abzählung leicht zu unpräzise formuliert wird.

Man betrachte die Zweipunktfunktion am kritischen Punkt. In der Molekularfeldtheorie gilt $\tau(x)\asymp|x|^{-(d-2)}$, ihre Fouriertransformierte verhält sich also wie $\hat\tau(k)\asymp|k|^{-2}$. Die Korrekturen zur Molekularfeldtheorie werden durch das **Dreiecks- (Blasen-)Diagramm**
$$
\nabla=\sum_{x,y}\tau(x)\,\tau(y)\,\tau(x-y),
$$
organisiert, das drei Wege zählt, die zwei Verzweigungspunkte verbinden, also einen Theta-Graphen. Im Fourierraum ist dies $\int\hat\tau(k)^3\,d^dk\asymp\int|k|^{-6}\,d^dk$, was genau dann konvergiert, wenn $d>6$ gilt. Konvergiert der Ausdruck, so lässt sich die Lace-Expansion als konvergente Reihe organisieren, und die Molekularfeld-Exponenten folgen; divergiert er, so kontrolliert die Reihe das kritische Verhalten nicht.

Dieselbe Abzählung im Ortsraum: Jeder der drei Wege trägt einen Faktor der Dimension $d-2$ bei, die beiden Verzweigungspunkte tragen $2d$ bei; das Diagramm ist endlich, wenn $3(d-2)>2d$ gilt, also $d>6$. Beim selbstmeidenden Weg hat das analoge Diagramm zwei Wege und eine Schleife, $2(d-2)>d$, was $d_c=4$ ergibt. Der zusätzliche Weg ist der Grund, warum sechs über vier liegt.

Bei genau $d=6$ divergiert $\int|k|^{-6}$ logarithmisch, und das Molekularfeld-Bild überlebt nur mit logarithmischen Korrekturen der Skalierungsformen. Die Exponenten sind die Molekularfeld-Exponenten, doch die Amplituden tragen Logarithmen; die Koeffizienten erfordern eine gesonderte Renormierungsgruppenrechnung.

## 6.5 Der Status der Universalität

Universalität ist die Behauptung, dass die Exponenten nur von der Dimension (und von Symmetrien) abhängen, nicht vom Gitter. Ihr Status unterscheidet sich stark je nach Dimension.

**Zwei Dimensionen: Satz für das Dreiecksgitter und seine Stern-Dreieck-Verwandten.** Für die kritische Site-Perkolation auf dem Dreiecksgitter ist das Skalierungslimit konform invariant, und die Grenzlinien konvergieren gegen SLE$_6$ (Kapitel 7), was die Exponenten festlegt. Derselbe Exponentensatz wird auf jedem periodischen planaren Gitter derselben Universalitätsklasse erwartet; die konforme Invarianz des Skalierungslimits für ein allgemeines planares Gitter ist jedoch weiterhin eine Vermutung, die von umfangreicher Numerik gestützt wird. Dies ist das wichtigste offene Problem der rigorosen zweidimensionalen Theorie und wird in Kapitel 13 behandelt.

**Oberhalb von sechs Dimensionen: Satz.** Die Lace-Expansion beweist Molekularfeld-Verhalten für $d\ge11$ bei Nächste-Nachbar-Bond-Perkolation (Fitzner–van der Hofstad 2017); die frühere Schwelle von Hara und Slade (1990) lag bei $d\ge19$. Das Ergebnis umfasst die Werte $\beta=\gamma=1$, $\nu=1/2$, $\delta=2$, $\eta=0$, $d_f=4$ und die Differenzierbarkeit von $\theta$ bei $p_c$.

**Drei bis fünf Dimensionen: kein Beweis.** Die Exponenten in der Tabelle für $d=3,4,5$ sind numerisch. Sie sind außerordentlich gut eingeschränkt — die Relationen aus Abschnitt 6.3 gelten im Rahmen der angegebenen Genauigkeit, und unabhängige Methoden (Monte Carlo, konformer Bootstrap, wo anwendbar, funktionale Renormierungsgruppe) stimmen überein —, doch sie sind keine Sätze. Jede Aussage der Form „Die dreidimensionalen Perkolationsexponenten seien bekannt“ ist streng genommen eine Aussage über Numerik.

**Bethe-Gitter: exakt.** Die Molekularfeld-Exponenten werden in Kapitel 8 durch Lösen der Rekursion des Verzweigungsprozesses exakt berechnet. Das Bethe-Gitter ist der Limes $d\to\infty$ und der Referenzpunkt, mit dem die endlichdimensionalen Zahlen verglichen werden.

## 6.6 Exponenten aus Daten ablesen

Die Exponenten sind als Grenzwerte für $\varepsilon\to0$ und $L\to\infty$ definiert, und keiner dieser Grenzwerte ist in einer Simulation verfügbar. Die praktische Folge ist, dass ein naiver doppeltlogarithmischer Fit einen effektiven Exponenten liefert, der mit dem Fit-Fenster wandert. Ein Suszeptibilitätsfit bei einer einzigen Größe kann stabil aussehen, während sich seine Steigung über den kritischen Bereich um den Faktor zwei ändert; Kapitel 11 erklärt, wie sich diese Drift erkennen lässt und was stattdessen anzugeben ist.

Das korrekte Vorgehen hat drei Teile. Man verwende einen Skalierungsansatz mit Korrekturen zur Skalierung, $A(p,L)=L^{y}\mathcal A\big((p-p_c)L^{1/\nu}\big)\big(1+cL^{-\omega}\big)$; man passe alle Größen gleichzeitig an; und man gebe ein Konfidenzintervall aus Resampling an statt einer einzelnen Zahl. Die Benchmarkdaten in `data/benchmarks.json` entstehen auf diese Weise, und die Residuen der Anpassung sind Teil der veröffentlichten Aufzeichnung, kein nachträglicher Zusatz.
