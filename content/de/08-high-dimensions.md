---
id: 08-high-dimensions
part: Critical phenomena
order: 8
title: Hohe Dimensionen und die Lace-Expansion
subtitle: Molekularfeld-Verhalten, die Dreiecksbedingung und warum sechs
reading: 14 min
---

Oberhalb von sechs Dimensionen vergisst die Perkolation ihr Gitter. Die Exponenten nehmen ihre Molekularfeld-Werte an, der Ordnungsparameter ist bei $p_c$ glatt, und die gesamte Theorie reduziert sich auf einen Verzweigungsprozess mit Korrekturen, die sich abschätzen lassen. Das Werkzeug, das dies beweist, ist die Lace-Expansion, eine der wenigen nichtperturbativen Methoden der kritischen Phänomene. Dieses Kapitel erklärt, was die Expansion ist, warum ihre Konvergenzschwelle $d\ge11$ statt $d>6$ lautet und warum diese Lücke von Bedeutung ist.

## 8.1 Molekularfeld vom Bethe-Gitter, korrekt hergeleitet

Das Bethe-Gitter (Cayley-Baum) vom Grad $z$ ist der Limes $d\to\infty$: keine Schleifen, daher ist die Konnektivität ein Verzweigungsprozess. Es ist das eine Modell, in dem alles exakt ist.

**Bond-Perkolation.** Jede Kante ist mit Wahrscheinlichkeit $p$ offen. Sei $r$ die Wahrscheinlichkeit, dass ein gegebener Knoten, der über eine offene Kante erreicht wurde, durch seine Nachkommen mit der Unendlichkeit verbunden ist. Der Knoten besitzt $z-1$ Kanten zu seinen Nachkommen, von denen jede mit Wahrscheinlichkeit $p$ offen ist und unabhängig zu einem Teilbaum führt, der mit Wahrscheinlichkeit $r$ perkoliert. Daher gilt
$$
r=1-(1-pr)^{z-1},
$$
und die Wurzel ist genau dann mit der Unendlichkeit verbunden, wenn mindestens eine ihrer $z$ Kanten offen ist und zu einem perkolierenden Teilbaum führt:
$$
\theta(p)=1-(1-pr)^{z}.
$$
Die triviale Lösung $r=0$ existiert stets. Eine von null verschiedene Lösung tritt auf, wenn die rechte Seite bei $r=0$ eine Steigung größer als $1$ besitzt:
$$
\left.\frac{d}{dr}\big(1-(1-pr)^{z-1}\big)\right|_{r=0}=p(z-1)>1
\quad\Longleftrightarrow\quad
p>\frac{1}{z-1}.
$$
Also ist $p_c=1/(z-1)$. Bei der Site-Perkolation lautet die Rekursion für einen besetzten Knoten $r=1-(1-pr)^{z-1}$, und die Wurzelwahrscheinlichkeit ist $\theta=p[1-(1-pr)^z]$; der zusätzliche Faktor $p$ kürzt sich an der Schwelle heraus, sodass wiederum $p_c=1/(z-1)$ gilt.

**Exponenten.** Man setze $p=p_c(1+\delta)$ mit kleinem $\delta>0$. Entwickelt man die Rekursion bis zur zweiten Ordnung,
$$
r=(1+\delta)r-\frac{z-2}{2(z-1)}r^{2}+O(r^3)
\;\Longrightarrow\;
r\sim\frac{2(z-1)}{z-2}\,\delta,
$$
so gilt $\theta\asymp zp_cr\asymp\delta$ und $\beta=1$. Die mittlere Clustergröße ist die erwartete Nachkommenschaft eines Galton–Watson-Prozesses mit Mittelwert $p(z-1)$:
$$
\chi=\sum_{n\ge0}\big(p(z-1)\big)^n=\frac{1}{1-p(z-1)}\sim\frac{1}{z-1}\cdot\frac{1}{p_c-p},
$$
also $\gamma=1$. Am kritischen Punkt hat die Nachkommenverteilung den Mittelwert eins und endliche Varianz; die Clustergröße liegt daher im Einzugsbereich einer stabilen Verteilung mit $\mathbb{P}(|C_0|=n)\sim n^{-3/2}$, was $1+1/\delta=3/2$ ergibt, also $\delta=2$. Schließlich liefert die Relation $\beta=\nu(d-2+\eta)/2$ bei der oberen kritischen Dimension $d=6$ mit $\eta=0$ die Gleichung $1=\nu\cdot 2$, also $\nu=1/2$; die Korrelationslänge verhält sich wie $(p_c-p)^{-1/2}$, was sich auch direkt aus der Rekursion prüfen lässt. Die fraktale Dimension ist $d_f=d-\beta/\nu=6-2=4$.

**Warum das Bethe-Gitter kein Gitter ist.** Es besitzt keine Zyklen und ist daher für kein endliches $d$ ein Teilgraph von $\mathbb{Z}^d$. Seine Exponenten stimmen mit den Molekularfeld-Werten überein, weil die Verzweigungsnäherung exakt wird, wenn Schleifen vernachlässigbar sind, und Schleifen sind oberhalb von $d_c$ vernachlässigbar. Die Übereinstimmung ist oberhalb von sechs Dimensionen ein Satz, keine Analogie.

## 8.2 Die Dreiecksbedingung

$\tau_p$ bezeichne die Zweipunktfunktion. Die **Dreiecksbedingung** lautet
$$
\nabla(p_c)=\sum_{x,y\in\mathbb{Z}^d}\tau_{p_c}(x)\,\tau_{p_c}(y)\,\tau_{p_c}(x-y)<\infty .
$$
(Aizenman–Newman 1984; Barsky–Aizenman 1987 führten sie für die Perkolation ein.) Der Name stammt vom Diagramm: drei Propagatoren, die zwei Knoten verbinden, also ein Dreieck in der dualen Darstellung oder ein Theta-Graph in der direkten Darstellung.

**Satz 8.1 (Aizenman–Newman; Barsky–Aizenman).** Wenn die Dreiecksbedingung bei $p_c$ gilt, gelten die Molekularfeld-Exponenten: $\beta=\gamma=1$, $\nu=1/2$, $\delta=2$, $\eta=0$, $d_f=4$, und $\theta$ ist bei $p_c$ zweimal differenzierbar mit $\theta'(p_c)>0$.

Der Beweis kombiniert die Infrarot-Schranke (eine Fourierraum-Ungleichung für $\tau$) mit einer Differentialungleichung für $\theta$; die Lace-Expansion wird nicht benötigt. Zu verifizieren ist die Dreiecksbedingung selbst, und hier kommt die Lace-Expansion ins Spiel.

**Warum die Bedingung $d>6$ lautet.** Angenommen, die Molekularfeld-Form $\tau(x)\asymp|x|^{-(d-2)}$ gilt. Dann folgt $\hat\tau(k)\asymp|k|^{-2}$ und
$$
\nabla\asymp\int_{\mathbb R^d}\hat\tau(k)^3\,d^dk\asymp\int|k|^{-6}\,d^dk,
$$
was genau dann endlich ist, wenn $d>6$ gilt. Bei $d=6$ divergiert das Integral logarithmisch; diese Divergenz ist die Quelle der logarithmischen Korrekturen des Molekularfeld-Verhaltens an der oberen kritischen Dimension.

Dieselbe Abzählung im Ortsraum: Der Theta-Graph besteht aus drei Wegen der Skalierungsdimension $d-2$, die zwei Verzweigungspunkte verbinden. Er ist endlich, wenn $3(d-2)>2d$ gilt, also $d>6$. Beim selbstmeidenden Weg hat das entsprechende Diagramm zwei Wege und eine Schleife, $2(d-2)>d$, was das bekannte $d_c=4$ ergibt. Der zusätzliche Propagator ist der Grund dafür, dass die obere kritische Dimension der Perkolation um zwei über der des Weges liegt.

## 8.3 Die Lace-Expansion

Die Lace-Expansion schreibt $\tau(x)$ als Summe über „verschnürte“ Graphen — Bäume, die mit Überlappungen verziert sind — und zeigt, dass die Reihe für große $d$ konvergiert. Der erste Term ist der Baumbeitrag (Molekularfeld); jede zusätzliche Verschnürung kostet einen Faktor der Ordnung $1/d$.

**Satz 8.2 (Hara–Slade 1990; Fitzner–van der Hofstad 2017).** Für die Nächste-Nachbar-Bond-Perkolation auf $\mathbb{Z}^d$ mit $d\ge11$ gilt die Dreiecksbedingung bei $p_c$, und die Molekularfeld-Exponenten stellen sich ein. Außerdem gilt
$$
\theta(p)=c_1(p-p_c)+c_2(p-p_c)^2+O\big((p-p_c)^3\big),\qquad c_1>0 .
$$

Die Geschichte der Schwelle ist lehrreich. Hara und Slade bewiesen das Ergebnis 1990 für $d\ge19$; Fitzner und van der Hofstad (2017) senkten die Schwelle auf $d\ge11$. Jede Verbesserung erforderte eine schärfere Abschätzung des Restglieds der Lace-Expansion, keine neue Idee. Die Lücke zwischen $d>6$ (wo die Dreiecksbedingung gelten sollte) und $d\ge11$ (wo sie bewiesen ist) bleibt offen; zu ihrer Schließung sind Abschätzungen nötig, die die derzeitige Expansion nicht bereitstellt.

**Was die Expansion nicht leistet.** Sie liefert keine Information über $p_c$ selbst, abgesehen von dessen Existenz; sie ist eine Aussage über Exponenten und über die Glattheit von $\theta$. Und sie liefert nichts bei $d=6$, wo die logarithmischen Korrekturen eine gesonderte Analyse erfordern (die Arbeiten von Hara und Slade an der oberen kritischen Dimension und spätere Verfeinerungen).

## 8.4 Das dreidimensionale Problem

In drei Dimensionen ist die Theorie am wenigsten vollständig und am dringendsten benötigt: Materialien, poröse Medien und biologische Gewebe sind dreidimensional. Die numerischen Werte sind hervorragend, die rigorosen fehlen. Die besten derzeitigen Schätzungen stammen aus großskaligen Monte-Carlo-Rechnungen mit Finite-Size-Skalierung:

$$
\frac1\nu=1.1410(15),\qquad
\frac{\beta}{\nu}=0.47705(15),\qquad
y_h=2.52295(15),\qquad
d_{\min}=1.3756(3),
$$
von Wang, Zhou, Zhang, Garoni und Deng (2013), mit $L$ bis 512 und etwa $2.5\times10^7$ Stichproben je Größe. Umgerechnet ergibt sich $\nu=0.8764(1)$, $\beta=0.4181(1)$, $\gamma=\nu(2-\eta)=1.793(3)$, $\eta=-0.046(2)$, $\delta=5.29(1)$, $d_f=2.5229(1)$.

Die innere Konsistenz dieser Zahlen (Kapitel 6, Abschnitt 6.2) ist beeindruckend, und unabhängige Methoden stimmen überein. Doch Konsistenz ist kein Beweis: Die Exponenten könnten im Prinzip der Grenzwert einer Folge effektiver Exponenten sein, die nicht konvergiert ist. Niemand glaubt das, aber dieser Glaube stützt sich auf die Übereinstimmung vieler Methoden und nicht auf einen Satz.

## 8.5 Die Geometrie oberhalb von sechs Dimensionen

Die Aussage $d_f=4$ für $d>6$ wirkt zunächst seltsam: Der Cluster ist ein vierdimensionales Objekt in einem höherdimensionalen Raum und daher äußerst dünn besetzt. Seine Struktur hat zwei Teile: ein **Rückgrat**, das die Zyklen und den Strom trägt, sowie **hängende Enden**, die daran befestigt sind. Die hängenden Enden tragen einen Großteil der Masse, aber keinen Strom. Deshalb sind der Leitfähigkeitsexponent $t$ und der Massenexponent $d_f$ verschiedene Größen, und deshalb ist die „anomale“ Leitfähigkeit von Perkolationsnetzwerken keine kleine Korrektur, sondern ein eigenes Phänomen (Kapitel 12).

Dasselbe Bild zweier Skalen erklärt das Paradox, dass $\nu=1/2$ und $d_f=4$ nebeneinander bestehen können: Die Korrelationslänge wächst wie $\varepsilon^{-1/2}$, die Masse auf dieser Skala wie $\xi^4=\varepsilon^{-2}$ und die Perkolationswahrscheinlichkeit wie $\xi^{-2}=\varepsilon$, was $\beta=1$ entspricht. Nichts daran ist widersprüchlich; der Cluster besitzt für $d>6$ schlicht zwei unabhängige Längenskalen.
