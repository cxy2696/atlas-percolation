---
id: 09-random-cluster
part: Critical phenomena
order: 9
title: Das Random-Cluster-Modell
subtitle: Ein Modell, das Perkolation, Ising und Potts enthält
reading: 10 min
---

Das Random-Cluster-Modell (RC-Modell) ist eine Perkolation mit einer Belohnung für die Bildung von Clustern. Es ist die Fortuin–Kasteleyn-Darstellung des $q$-Zustands-Potts-Modells und für $q=1$ die gewöhnliche Perkolation. Sein Wert für diesen Atlas ist zweifach: Es liefert eine rigorose Brücke zwischen Perkolation und Spinsystemen und stellt die Algorithmen (Swendsen–Wang, Edwards–Sokal) bereit, die Cluster-Updates in der computergestützten Physik zum Standard machten.

## 9.1 Definition

Sei $G=(V,E)$ endlich. Für $p\in[0,1]$ und $q>0$ setze man
$$
\phi_{p,q}(\omega)=\frac{1}{Z_G(p,q)}\,p^{|\omega|}(1-p)^{|E|-|\omega|}\,q^{k(\omega)},
\qquad
Z_G(p,q)=\sum_{\omega\in\{0,1\}^E}p^{|\omega|}(1-p)^{|E|-|\omega|}q^{k(\omega)},
$$
wobei $k(\omega)$ die Anzahl der Zusammenhangskomponenten des offenen Teilgraphen ist, isolierte Knoten mitgezählt. Bei $q=1$ verschwindet das Clustergewicht, und $\phi_{p,1}$ ist die Bernoulli-Perkolation. Der Parameter $q$ muss keine ganze Zahl sein, damit das Maß sinnvoll ist; die Spininterpretation verlangt jedoch $q\in\{2,3,\dots\}$.

## 9.2 Die Potts-Korrespondenz

**Proposition 9.1 (★).** Für ganzzahliges $q\ge2$ und $\beta\ge0$ ist die Zustandssumme des $q$-Zustands-Potts-Modells
$$
Z_{\text{Potts}}(\beta)=\sum_{\sigma\in\{1,\dots,q\}^V}\exp\Big(-\beta\sum_{e=(u,v)}\big(1-\delta_{\sigma_u\sigma_v}\big)\Big)
$$
exakt gleich $Z_G(p,q)$, mit $p=1-e^{-\beta}$.

**Beweis.** Für eine einzelne Kante gilt die Identität
$$
e^{-\beta(1-\delta_{\sigma_u\sigma_v})}
=e^{-\beta}+\big(1-e^{-\beta}\big)\delta_{\sigma_u\sigma_v}
=(1-p)+p\,\delta_{\sigma_u\sigma_v};
$$
die linke Seite ist $1$ bei gleichen Spins und $e^{-\beta}$ bei verschiedenen. Multipliziert man über alle Kanten und entwickelt das Produkt,
$$
\prod_{e\in E}\Big((1-p)+p\,\delta_{\sigma_u\sigma_v}\Big)
=\sum_{\omega\subseteq E}p^{|\omega|}(1-p)^{|E|-|\omega|}\prod_{e\in\omega}\delta_{\sigma_u\sigma_v}.
$$
Summiert man über $\sigma$, so erzwingt das Produkt der Deltas, dass $\sigma$ auf jeder Zusammenhangskomponente von $(V,\omega)$ konstant ist, und jede Komponente kann eine von $q$ Farben annehmen. Es gibt $q^{k(\omega)}$ Färbungen, also
$$
Z_{\text{Potts}}(\beta)=\sum_{\omega\subseteq E}p^{|\omega|}(1-p)^{|E|-|\omega|}q^{k(\omega)}
=Z_G(p,q).
$$
Ein Vorfaktor ist nicht nötig: Die Bernoulli-Gewichte und das Clustergewicht werden bereits durch dieselbe Summe normiert. $\blacksquare$

Für $q=2$ ist dies das Ising-Modell in seiner Fortuin-Kasteleyn-Form, und die Perkolationswahrscheinlichkeit wird zur Magnetisierung: Bei verdrahteten Randbedingungen ist $\langle\sigma_0\rangle$ gleich der Wahrscheinlichkeit, dass der Ursprung mit dem Rand verbunden ist. Die Korrespondenz ist exakt, keine Analogie, und sie ist der Grund, warum sich Perkolationsexponenten mit der Technik der Spinsysteme berechnen lassen und umgekehrt.

## 9.3 Konsequenzen

**Gemeinsame kritische Punkte.** Das RC-Modell besitzt einen Phasenübergang bei einem Wert $p_c(q)$, der das Bild der kritischen Potts-Temperatur ist. Für $q=2$ auf $\mathbb{Z}^2$ ist der selbstduale Punkt $p_c=\sqrt2/(1+\sqrt2)=0.585786\ldots$, der unter $p=1-e^{-2\beta_c}$ dem kritischen Ising-Punkt $\sinh(2\beta_c)=1$ entspricht. Diese Gleichheit ist ein Satz, und sie liefert die kritische Ising-Temperatur auf $\mathbb{Z}^2$ ohne Transfermatrix-Rechnung. Der Wert $p=1/2$ ist der Spezialfall $q=1$ (Perkolation), nicht der Ising-Punkt.

**Monotonie in $q$.** Das RC-Maß ist für $q\ge1$ positiv assoziiert und erfüllt die FKG-Ungleichung; die Perkolationswahrscheinlichkeit ist monoton in $p$. Eine Erhöhung von $q$ belohnt die Clusterbildung und kann einen stetigen Übergang in einen Übergang erster Ordnung verwandeln: Die Clusterbelohnung begünstigt eine dichte Phase. Die genaue $q$-Abhängigkeit der Ordnung des Übergangs ist modellabhängig; die folgenden Aussagen benötigen keine Monotonie in $q$.

**Dualität.** Auf einem planaren Graphen besitzt das RC-Modell ein duales Modell mit transformierten Parametern; auf dem Quadratgitter lautet die selbstduale Kurve $p=\sqrt q/(1+\sqrt q)$, und für $q=1$ reduziert sie sich auf $p\leftrightarrow1-p$. Die Dualitätsrelationen sind die RC-Verallgemeinerung von Lemma 4.2 und der sauberste Weg zu den $q$-abhängigen kritischen Punkten auf dem Quadrat- und dem Dreiecksgitter.

## 9.4 Algorithmen

Hinter zwei der nützlichsten Algorithmen der Monte-Carlo-Physik steht die RC-Darstellung.

**Swendsen–Wang (1987).** Ausgehend von einer Spinkonfiguration bilde man die Fortuin-Kasteleyn-Cluster, indem jede Kante mit Wahrscheinlichkeit $p=1-e^{-J}$ geöffnet wird, wenn die Spins an ihren beiden Endpunkten übereinstimmen, andernfalls nie; dabei ist $J$ die Potts-Kopplung (für die obige Ising-Normierung $J=2\beta$). Dann weise man jedem Cluster eine neue zufällige Farbe zu. Die resultierende Spinkonfiguration ist für das Potts-Maß stationär. Das Update ist nichtlokal: Es kann einen gesamten korrelierten Bereich in einem Schritt umklappen, weshalb es den Einzelspin-Metropolis nahe einem kritischen Punkt übertrifft.

**Edwards–Sokal (1988).** Ein gemeinsames Update von Spins und Kanten, das ein Gibbs-Sampler für das RC-Maß ist; es bietet einen systematischen Weg, zwischen dem Spin- und dem Clusterbild zu interpolieren, und ist das Standardwerkzeug zur Messung von Cluster-Observablen.

Keiner der beiden Algorithmen ändert die Physik; beide ändern die Korrelationszeit. An einem kritischen Punkt leidet der Einzelspin-Metropolis-Algorithmus unter kritischer Verlangsamung mit dynamischem Exponenten $z\approx2$, während Clusteralgorithmen $z$ für Potts-Modelle erheblich reduzieren. Für die Perkolation selbst ($q=1$) ist nicht Swendsen–Wang der relevante Algorithmus, sondern der Newman–Ziff-Sweep aus Kapitel 11, der die gesamte Kopplungskurve aus einer einzigen zufälligen Kantenreihenfolge statt aus einer Markov-Kette abtastet.

## 9.5 Was das RC-Modell nicht löst

Das RC-Modell liefert nicht die Perkolationsschwelle auf einem allgemeinen Gitter, weil das Modell mit $q=1$ keine Spin-Darstellung besitzt, die sich lösen ließe. Es liefert das vollständige Skalierungslimit in zwei Dimensionen nur über den Apparat des Coulomb-Gases und der SLE, der eine eigenständige Entwicklung darstellt. Und es macht die dreidimensionalen Exponenten nicht rigoros: Das RC-Modell mit $q=1$ in $d=3$ ist genau so schwierig wie die Perkolation.

Was es liefert, ist eine Sprache. Aussagen über Perkolation, die im Bernoulli-Bild umständlich wirken — Randbedingungen, Grenzwerte für verdrahtete und freie Randbedingungen, Clustergewichte, die Bedeutung der Konditionierung auf eine Verbindung —, werden im RC-Bild natürlich. Ein großer Teil der rigorosen Technik in diesem Atlas (FKG, der Paarungssatz, die Schärfebeweise) lässt sich in der RC-Sprache formulieren und anschließend auf $q=1$ spezialisieren.
