---
id: 03-monotonicity
part: Rigorous core
order: 3
title: Monotonie und die Existenz einer Schwelle
subtitle: FKG, Kopplung und warum p_c existieren muss
reading: 15 min
---

Bevor eine Schwelle berechnet werden kann, muss sie existieren. Dieses Kapitel beweist ihre Existenz und führt unterwegs die beiden Ungleichungen ein, auf die sich jedes spätere Argument stützt: die positive Assoziation (FKG) und die Kopplungsmonotonie von $\theta$. Die Beweise sind elementar; sie werden ausgeschrieben, weil der Rest des Atlas auf ihnen aufbaut.

## 3.1 Der Konfigurationsraum

Sei $\Omega=\{0,1\}^{E}$ mit der von Zylindermengen erzeugten Produkt-$\sigma$-Algebra $\mathcal{F}$. Man schreibe $\omega\le\omega'$, wenn $\omega_e\le\omega'_e$ für jede Kante gilt. Eine messbare Menge $A$ heißt **aufsteigend**, wenn aus $\omega\in A$ und $\omega\le\omega'$ folgt, dass $\omega'\in A$; absteigende Mengen werden durch Umkehrung der Ungleichung definiert. Ereignisse wie $\{0\leftrightarrow\infty\}$, $\{\exists\text{ an open crossing}\}$ und $\{|C_0|\ge n\}$ sind aufsteigend; $\{0\nleftrightarrow\infty\}$ ist absteigend.

Das Maß $\mathbb{P}_p$ ist das Produkt-Bernoulli-Maß mit Parameter $p$. Zwei Tatsachen darüber werden ständig verwendet:

- **Endliche Energie.** Jeder endliche Zylinder hat eine Wahrscheinlichkeit in $(0,1)$, solange $0<p<1$ gilt.
- **Unabhängigkeit.** Disjunkte Kantenmengen tragen unabhängige Einschränkungen.

## 3.2 Positive Assoziation

**Satz 3.1 (Harris 1960; Fortuin–Kasteleyn–Ginibre 1971).** Für aufsteigende Ereignisse $A,B$ gilt
$$
\mathbb{P}_p(A\cap B)\ \ge\ \mathbb{P}_p(A)\,\mathbb{P}_p(B).
$$

**Beweis (★).** Es genügt, die Ungleichung für eine endliche Indexmenge zu beweisen und dann zum Grenzwert überzugehen, da beide Seiten unter Zylinderapproximation stetig sind.

Sei also $n$ endlich; man schreibe $\mathbb{P}=\mathbb{P}_{n-1}\otimes\mu_n$, wobei $\mu_n$ das Bernoulli-Gesetz der letzten Koordinate ist. Für aufsteigende $A,B$ definiere man
$$
F(t)=\mathbb{P}_{n-1}\big(A\,\big|\,\omega_n=t\big),\qquad G(t)=\mathbb{P}_{n-1}\big(B\,\big|\,\omega_n=t\big),\qquad t\in\{0,1\}.
$$
Bedingt auf $\omega_n=t$ sind $A$ und $B$ aufsteigende Ereignisse der übrigen $n-1$ Koordinaten, die Induktionsvoraussetzung liefert daher
$$
\mathbb{P}_n(A\cap B\mid\omega_n=t)\ \ge\ F(t)G(t).
$$
Mittelt man mit den Gewichten $p_0=1-p$, $p_1=p$, so ergibt sich
$$
\mathbb{P}_n(A\cap B)\ \ge\ p_0F(0)G(0)+p_1F(1)G(1).
$$
Andererseits gilt
$$
\mathbb{P}_n(A)\mathbb{P}_n(B)=\big(p_0F(0)+p_1F(1)\big)\big(p_0G(0)+p_1G(1)\big).
$$
Subtrahiert man, so folgt
$$
\mathbb{P}_n(A\cap B)-\mathbb{P}_n(A)\mathbb{P}_n(B)\ \ge\ p_0p_1\big(F(1)-F(0)\big)\big(G(1)-G(0)\big)\ \ge\ 0,
$$
denn $F$ und $G$ sind monoton nicht fallend: Das Anheben der letzten Koordinate kann ein aufsteigendes Ereignis nicht zerstören. Der Induktionsanfang $n=1$ ist unmittelbar klar, und der Grenzübergang $n\to\infty$ folgt aus der Stetigkeit des Maßes auf der Zylinderalgebra. $\blacksquare$

Dasselbe Argument, auf absteigende Ereignisse oder auf eine Mischung der Vorzeichen angewandt, liefert die vier Monotoniekombinationen; im Folgenden wird nur der Fall zweier aufsteigender Ereignisse benötigt.

## 3.3 Kopplung und Monotonie des Ordnungsparameters

**Korollar 3.2.** $p\mapsto\theta(p)$ ist monoton nicht fallend, und $p\mapsto\mathbb{P}_p(A)$ ist für jedes aufsteigende $A$ monoton nicht fallend.

**Beweis (★).** Man nehme eine Familie $\{U_e\}$ unabhängiger gleichverteilter Zufallsvariablen und definiere $\omega_e(p)=\mathbf 1\{U_e\le p\}$. Dann folgt aus $p\le p'$ kantenweise $\omega(p)\le\omega(p')$. Das Ereignis $\{0\leftrightarrow\infty\}$ ist aufsteigend, also
$$
\theta(p)=\mathbb{P}\big(\omega(p)\in\{0\leftrightarrow\infty\}\big)\ \le\ \mathbb{P}\big(\omega(p')\in\{0\leftrightarrow\infty\}\big)=\theta(p').
$$
Dieselbe Kopplung beweist die Monotonie für jedes aufsteigende Ereignis. $\blacksquare$

**Korollar 3.3 (Regularität).** $\theta$ ist auf $[0,1]$ rechtsstetig und hat höchstens abzählbar viele Unstetigkeitsstellen.

**Beweis.** Für $m\ge1$ sei $\theta^{(m)}(p)=\mathbb{P}_p(|C_0|\ge m)$. Jedes $\theta^{(m)}$ ist eine Wahrscheinlichkeit eines endlichen Zylinders, also ein Polynom in $p$ und stetig. Da $\{|C_0|=\infty\}=\bigcap_m\{|C_0|\ge m\}$ ein absteigender Durchschnitt ist, gilt $\theta(p)=\lim_m\downarrow\theta^{(m)}(p)$. Ein absteigender Limes stetiger Funktionen ist oberhalbstetig; zusammen mit der Monotonie ergibt das die Rechtsstetigkeit. Eine monotone Funktion hat höchstens abzählbar viele Sprungstellen. $\blacksquare$

Die Rechtsstetigkeit ist der Grund, warum $p_c$ mit „$\inf$“ statt mit „$\inf$ bis auf eine Nullmenge“ definiert werden kann: Die Menge $\{p:\theta(p)>0\}$ ist ein Intervall der Form $(p_c,1]$ oder $[p_c,1]$, und die beiden Möglichkeiten unterscheiden sich darin, ob $\theta$ bei $p_c$ springt. In zwei Dimensionen springt es nicht (Satz 5.5); in Molekularfeldmodellen ebenfalls nicht; bei gekoppelten Netzwerken kann es springen, was Gegenstand von Kapitel 10 ist.

## 3.4 Existenz mit expliziten Schranken

**Satz 3.4 (Hammersley 1957).** $G$ habe den Maximalgrad $\Delta<\infty$ und die Konnektivitätskonstante
$$
\lambda=\lim_{n\to\infty}\Big(\#\{\text{self-avoiding paths of length }n\text{ from }0\}\Big)^{1/n}.
$$
Dann gilt
$$
\frac{1}{\Delta-1}\ \le\ p_c(G)\ \le\ \frac{1}{\lambda}.
$$
Insbesondere gilt $0<p_c<1$ für jedes Gitter der Dimension $d\ge2$.

**Beweis der unteren Schranke (★).** Sei $N_n$ die Anzahl der offenen selbstvermeidenden Pfade der Länge $n$, die im Ursprung beginnen, mit Vielfachheit gezählt, und sei $N=\sum_{n\ge0}N_n$. Ein Pfad der Länge $n$ hat $n$ Kanten, also $\mathbb{E}_p[N_n]\le\Delta(\Delta-1)^{n-1}p^n$; durch Summation der geometrischen Reihe erhält man
$$
\mathbb{E}_p[N]\ \le\ 1+\frac{\Delta p}{1-(\Delta-1)p}\ <\ \infty\qquad\text{whenever }p<\frac{1}{\Delta-1}.
$$
Jeder Knoten von $C_0$ ist Endpunkt mindestens eines offenen Pfades vom Ursprung, also gilt $|C_0|\le N$ und $\mathbb{E}_p|C_0|<\infty$. Wäre $\theta(p)>0$, so wäre $\mathbb{P}_p(|C_0|=\infty)>0$, was $\mathbb{E}_p|C_0|=\infty$ erzwingt. Widerspruch. Also ist $\theta(p)=0$ für $p<1/(\Delta-1)$, d. h. $p_c\ge1/(\Delta-1)$. $\blacksquare$

**Skizze der oberen Schranke.** Man fixiere $p$ mit $p\lambda>1$. Dann wächst $\mathbb{E}_p[N_n]=\kappa_np^n$ exponentiell, wobei $\kappa_n$ die Anzahl der selbstvermeidenden Pfade der Länge $n$ ist. Die Zweitmomentabschätzung
$$
\mathbb{E}_p\big[N_n^2\big]\ \le\ C(p)\,\mathbb{E}_p[N_n]^2
$$
gilt für alle $p$ in einer Umgebung von $1$ und erstreckt sich mittels des üblichen Submultiplikativitätsarguments für selbstvermeidende Irrfahrten auf jedes $p>1/\lambda$; die Konstante absorbiert die Anzahl der Paare sich schneidender Pfade; diese Anzahl ist $O(\theta^n)$ mit $\theta<1$, wenn $p$ nahe genug bei $1$ liegt. Ein vollständiger Beweis, einschließlich der Submultiplikativitätsabschätzung, findet sich bei Grimmett (1999). Die rechte Seite der Cauchy–Schwarz-Ungleichung (Paley–Zygmund)
$$
\mathbb{P}_p(N_n>0)\ \ge\ \frac{\mathbb{E}_p[N_n]^2}{\mathbb{E}_p[N_n^2]}
$$
wird dann durch eine positive, von $n$ unabhängige Konstante $c(p)$ nach unten beschränkt. Da aus $N_n>0$ die Ungleichung $|C_0|\ge n$ folgt, gilt $\mathbb{P}_p(|C_0|\ge n)\ge c(p)$ für jedes $n$. Die Ereignisse $\{|C_0|\ge n\}$ schrumpfen gegen $\{|C_0|=\infty\}$, also ist $\mathbb{P}_p(|C_0|=\infty)\ge c(p)>0$ und $p>p_c$. Damit ist $p_c\le1/\lambda$. $\blacksquare$

**Bemerkung.** Die untere Schranke ist auf Bäumen scharf: Für den $z$-regulären Baum gilt $\Delta=z$ und $\lambda=z-1$, beide Schranken sind also gleich $1/(z-1)$. Auf $\mathbb{Z}^d$ lassen die beiden Schranken eine breite Lücke, und genau das ist der Inhalt der nächsten beiden Kapitel.

**Satz 3.5 (Peierls-Argument).** Für die Kantenperkolation auf $\mathbb{Z}^d$, $d\ge2$, gilt $p_c<1$.

**Beweisskizze.** Angenommen, der offene Cluster des Ursprungs ist endlich. Dann ist er von einer geschlossenen $\ast$-zusammenhängenden Fläche dualer Plaketten umgeben: einer endlichen Menge $S$ dualer $(d-1)$-Flächen, die den Ursprung vom Unendlichen trennt. Jede Plakette aus $S$ ist dual zu einer geschlossenen Kante, also gilt $\mathbb{P}_p(S\text{ is closed})=(1-p)^{|S|}$.

Es bleibt, die Flächen zu zählen. Eine $\ast$-zusammenhängende Menge von $n$ dualen Plaketten, die eine feste, dem Ursprung benachbarte Plakette enthält, lässt sich Plakette für Plakette aufbauen; jede neue Plakette berührt die aktuelle Menge entlang einer Fläche, und es gibt höchstens $c_d$ Möglichkeiten pro Schritt mit $c_d=4d$ (eine grobe, aber ausreichende Schranke). Es gibt also höchstens $c_d^{\,n}$ solche Mengen, und
$$
\mathbb{P}_p(0\nleftrightarrow\infty)\ \le\ \sum_{n\ge1}c_d^{\,n}(1-p)^n.
$$
Für $1-p<c_d^{-1}$ konvergiert die Reihe und ist echt kleiner als $1$, also $\theta(p)=1-\mathbb{P}_p(0\nleftrightarrow\infty)>0$. Daher gilt $p_c\le 1-c_d^{-1}<1$. $\blacksquare$

Die Skizze lässt die geometrische Buchführung aus, die die Flächenzählung rigoros macht; dasselbe Argument liefert eine explizite (sehr grobe) numerische Schranke. Bessere Schranken erhält man, indem man Flächen mit Gewichten zählt; so wird das Peierls-Argument in der Ising- und der Gittereichtheorie verwendet.

## 3.5 Drei Definitionen von $p_c$

**Satz 3.6.** Auf einem transitiven, amenablen Graphen gilt
$$
p_c=\inf\{p:\theta(p)>0\}=\sup\{p:\chi(p)<\infty\}.
$$

**Beweis.** Die erste Gleichheit ist die Definition. Für $p<p_c$ ist $\theta(p)=0$, und $\chi(p)<\infty$ ist genau der Inhalt des Schärfe-Satzes (Satz 5.1), der in Kapitel 5 bewiesen wird. Umgekehrt gilt: Ist $\chi(p)<\infty$, so ist $\mathbb{P}_p(|C_0|=\infty)=0$, weil ein unendlicher Cluster einen unendlichen Beitrag zur definierenden Summe von $\chi$ liefern würde. Also ist $\sup\{p:\chi<\infty\}\le p_c$, wobei die Gleichheit aus der Schärfe folgt. $\blacksquare$

Die Identität ist in der Praxis wichtig. Numerische Arbeiten lokalisieren $p_c$ über die Divergenz von $\chi$, und der Satz rechtfertigt es, diese Divergenz als Aussage über $\theta$ zu lesen. Er erklärt auch, warum die beiden üblichen operationalen Definitionen – „die Suszeptibilität divergiert“ und „ein unendlicher Cluster erscheint“ – austauschbar verwendet werden können und warum keine von beiden die Finite-Size-Skalierung ersetzt (Kapitel 11).

## 3.6 Was Monotonie nicht liefert

Monotonie ist eine Aussage über die *Änderung von $p$ bei festem Graphen*. Über eine Änderung des Graphen sagt sie nichts aus. Das Hinzufügen von Kanten senkt $p_c$; unterteilt man jede Kante, so wird eine offene Kante der Wahrscheinlichkeit $p$ durch zwei in Reihe geschaltete Kanten ersetzt, und die Kantenschwelle verschiebt sich auf $\sqrt{p_c}$, also nach oben. Die Intuition „mehr Verbindungen, niedrigere Schwelle“ ist bei Kanteninklusion verlässlich, nicht bei beliebigen Graphoperationen. Kapitel 11 listet die daraus folgenden Fallstricke auf.

Eine zweite Einschränkung: FKG ist eine Ungleichung, keine Identität. Sie liefert das Vorzeichen der Korrelationen, aber nicht deren Größe; für quantitative Arbeiten (etwa die RSW-Konstanten) benötigt man die tatsächlichen Durchgangsabschätzungen, die viel feiner sind.
