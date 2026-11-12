---
id: 05-sharpness
part: Rigorous core
order: 5
title: Schärfe und Eindeutigkeit
subtitle: Exponentieller Abfall unterhalb von p_c und ein einziger unendlicher Cluster oberhalb
reading: 13 min
---

Zwei Sätze machen aus der Definition von $p_c$ eine brauchbare Theorie. Das erste besagt, dass unterhalb von $p_c$ die Konnektivität exponentiell abfällt; die Aussage „kein unendlicher Cluster“ ist damit eine starke Aussage über jede Längenskala, nicht nur über den unendlich fernen Grenzfall. Das zweite besagt, dass oberhalb von $p_c$ genau ein unendlicher Cluster existiert; „perkolierend“ ist damit eine Eigenschaft des gesamten Systems und nicht einer einzelnen glücklichen Komponente. Beide gelten auf $\mathbb{Z}^d$; der Eindeutigkeitssatz erstreckt sich auf transitive amenable Graphen, der Schärfesatz ist hier für das Gitter formuliert. Die Beweise beruhen auf ganz unterschiedlichen Ideen.

## 5.1 Exponentieller Abfall

**Satz 5.1 (Aizenman–Barsky 1987; Menshikov 1986).** Sei $G=\mathbb{Z}^d$. Für jedes $p<p_c(G)$ existiert ein $\psi(p)>0$, sodass
$$
\theta_n(p)\le e^{-n\psi(p)}\quad\text{for all }n\ge1,
\qquad
\tau_p(0,x)\le e^{-\psi(p)|x|}\quad\text{for all }x,
$$
und folglich $\chi(p)<\infty$ und $\xi(p)<\infty$.

Scharf ist die Schranke in dem Sinne, dass $\psi(p)\downarrow0$ für $p\uparrow p_c$. Im kritischen Skalierungsregime verschwindet die Rate wie $(p_c-p)^{\nu}$, wobei $\nu$ der Exponent der Korrelationslänge ist; dieses Potenzgesetz gehört zum Skalierungsansatz und folgt nicht aus der strikten Ungleichung. Bei $p_c$ selbst versagt die exponentielle Schranke, denn dort ist der Abfall ein Potenzgesetz.

**Wie der Beweis verläuft.** Beide Beweise stützen sich auf eine Differentialungleichung für die erzeugende Funktion der Clustergrößen. Man schreibe $G_p(z)=\sum_n\theta_n(p)z^n$ und setze $G'_p(1)=\chi(p)$. Der Weg von Aizenman–Barsky differenziert die Definitionsgleichung von $\theta_n$ nach $p$ und schätzt die Ableitung durch einen quadratischen Ausdruck in $G_p$ und $G'_p$ ab; dabei wird die geometrische Tatsache genutzt, dass ein Cluster der Größe $n+m$ an einer pivotalen Kante in Teile der Größen $n$ und $m$ zerlegt werden kann. Die resultierende Ungleichung
$$
\frac{d}{dp}\Big(\frac{1}{G_p(z)}\Big)\ \ge\ -C(z)
$$
lässt sich zu einer Schranke für $\theta_n$ integrieren, die exponentiell ist, sobald $\chi(p)<\infty$ gilt. Menshikovs Weg ist kombinatorisch: Er zeigt, dass ein Cluster der Größe $n$ einen „Kegel“ besetzter Plätze von zu $n$ vergleichbarer Größe enthält, und zählt die Möglichkeiten, einen solchen Kegel aufzubauen. Die beiden Argumente unterscheiden sich in der Technik und stimmen im Ergebnis überein; deshalb gilt das Resultat als robust.

Keiner der beiden Beweise wird hier vollständig wiedergegeben; beide umfassen mehrere Seiten, und für die Anwendungen in diesem Atlas wird keiner von ihnen benötigt. Benötigt wird die Äquivalenz:

**Korollar 5.2.** Für $G=\mathbb{Z}^d$ und $p<p_c$ sind die folgenden Aussagen äquivalent: $\chi(p)<\infty$; $\xi(p)<\infty$; $\theta_n(p)$ fällt exponentiell ab.

Diese Äquivalenz macht das numerische Kriterium „$\chi$ divergiert“ zu einer legitimen Definition des kritischen Punktes (Satz 3.6). Ohne Satz 5.1 würde eine divergierende Suszeptibilität $\chi$ lediglich besagen, dass die mittlere Clustergröße unendlich ist; in einem Graphen mit schweren Verteilungsenden der Clustergrößen könnte dies auch bei einer Dichte unterhalb von $p_c$ auftreten.

## 5.2 Eindeutigkeit des unendlichen Clusters

**Satz 5.3 (Burton–Keane 1989).** Sei $G$ ein transitiver amenabler Graph. Für jedes $p$ gilt
$$
\mathbb{P}_p\big(\text{there is at most one infinite open cluster}\big)=1 .
$$

**Beweisskizze.** Das Argument hat drei Zutaten.

*Ergodizität.* Die Anzahl $N(\omega)$ der unendlichen offenen Cluster ist eine translationsinvariante messbare Funktion und daher auf jeder ergodischen Komponente fast sicher konstant. Auf einem transitiven amenablen Graphen ist das Bernoulli-Maß unter Translationen ergodisch; folglich ist $N\in\{0,1,2,\dots\}\cup\{\infty\}$ fast sicher konstant.

*Endliche Energie.* Für eine endliche Kantenmenge $F$ sei $\omega^F$ die Konfiguration, die aus $\omega$ entsteht, indem jede Kante von $F$ geöffnet wird. Bedingt auf die Konfiguration außerhalb von $F$ ist die Wahrscheinlichkeit, auf $F$ ein beliebig vorgegebenes Muster zu sehen, mindestens $\min(p,1-p)^{|F|}>0$. Insbesondere gilt: Würde das Öffnen von $F$ zwei unendliche Cluster von $\omega$ verschmelzen, so geschieht diese Verschmelzung mit einer bedingten Wahrscheinlichkeit, die durch eine nur von $|F|$ und $p$ abhängige Konstante nach unten beschränkt ist.

*Keine endliche Verschmelzung.* Angenommen, es gilt fast sicher $N=k\ge2$. Zwei verschiedene unendliche Cluster lassen sich nicht durch eine endliche Kantenmenge verbinden, ohne $N$ zu ändern; daher hat für jedes endliche $F$ das Ereignis „das Öffnen von $F$ verringert $N$“ die Wahrscheinlichkeit null. Eine Konfiguration mit $k\ge2$ unendlichen Clustern besitzt jedoch unendlich viele endliche Mengen $F$, deren Öffnen zwei von ihnen verschmelzen würde: Man wähle einen hinreichend großen endlichen Bereich, der von beiden Clustern getroffen wird und sie in einem zusammenhängenden Stück verbindet, und verkleinere die verbindende Kantenmenge bis zur Minimalität. Aufgrund der endlichen Energie und der Translationsinvarianz ist die Wahrscheinlichkeit positiv, dass mindestens ein solches minimales $F$ erfolgreich ist; das widerspricht dem vorigen Satz.

Der dritte Schritt verlangt Sorgfalt, und hier kommt die Amenabilität ins Spiel: Auf einem nicht amenablen Graphen kann die Zahl der unendlichen Cluster tatsächlich unendlich sein (der $3$-reguläre Baum besitzt für $p$ oberhalb des kritischen Wertes unendlich viele unendliche Cluster, da verschiedene Zweige unabhängig sind). Der vollständige Beweis steht bei Burton–Keane (1989); eine Lehrbuchdarstellung findet sich bei Grimmett (1999), §8.2. $\blacksquare$

**Korollar 5.4.** Für $p>p_c$ gehört fast jeder Knoten entweder zum eindeutigen unendlichen Cluster oder zu einem endlichen Cluster, und
$$
\mathbb{P}_p(0\leftrightarrow\infty)=\theta(p)
$$
für jede Wahl des Ursprungs. In diesem Regime ist das Ereignis „Perkolation“ translationsinvariant und hat, bedingt darauf, dass der Ursprung zum unendlichen Cluster gehört, Wahrscheinlichkeit eins.

Das zweite Korollar legitimiert die Renormierungsargumente aus Kapitel 4: Sobald $\theta(p)>0$ gilt, darf man von *dem* unendlichen Cluster sprechen und seine Dichte als makroskopischen Ordnungsparameter verwenden.

## 5.3 Stetigkeit am kritischen Punkt

**Satz 5.5 (Kesten 1980; RSW).** Für die Bond-Perkolation auf $\mathbb{Z}^2$ gilt $\theta(p_c)=0$, und $\theta$ ist bei $p_c$ stetig. Außerdem gilt $\chi(p)\to\infty$ für $p\uparrow p_c$.

**Beweisidee.** Bei $p_c$ liefert die Dualität $\mathbb{P}(A_n)+\mathbb{P}(B_n^\ast)=1$. RSW liefert eine gleichmäßige untere Schranke $\delta$ für die duale Durchgangswahrscheinlichkeit $\mathbb{P}(B_n^\ast)$ und damit eine gleichmäßige obere Schranke $\mathbb{P}(A_n)\le1-\delta$ für den primalen Durchgang. Wäre $\theta(p_c)>0$, so würde die Durchgangswahrscheinlichkeit wegen der Eindeutigkeit und der positiven Dichte gegen eins streben, was der gleichmäßigen oberen Schranke widerspricht. Also ist $\theta(p_c)=0$. Die Stetigkeit folgt aus denselben Abschätzungen: Die Wahrscheinlichkeit, dass der Ursprung mit der Entfernung $n$ verbunden ist, ist durch das Produkt einer Konstanten mit der Wahrscheinlichkeit eines Durchgangs durch den Ring (Annulus) beschränkt; diese strebt für $n\to\infty$ gleichmäßig in $p\downarrow p_c$ gegen null. $\blacksquare$

Das Ergebnis ist in seinem Beweis, nicht in seiner Aussage, auf zwei Dimensionen zugeschnitten: In hohen Dimensionen ist die Stetigkeit bei $p_c$ im Rahmen der Lace-Expansion bekannt; in den dazwischenliegenden Dimensionen, zu denen $d=3,4,5$ gehören, ist sie offen. Diesen Kontrast sollte man beim Lesen numerischer Aussagen über den Ordnungsparameter im Blick behalten: Ein diskontinuierlicher Sprung bei $p_c$ wäre in einer Simulation als Plateau sichtbar, und in drei Dimensionen wurde noch nie ein solches Plateau beobachtet; doch „nicht beobachtet“ heißt nicht „als abwesend bewiesen“.

## 5.4 Phasenübergänge erster Ordnung: die Ausnahme, nicht die Regel

Die Stetigkeit des Bernoulli-Übergangs ist kein universelles Naturgesetz, sondern ein Satz über unabhängige Perkolation. Drei Mechanismen erzeugen diskontinuierliche Übergänge; jedem ist später in diesem Atlas ein eigenes Kapitel gewidmet:

- **Korrelierte Perkolation.** Langreichweitige positive Korrelationen können einen Sprung im Ordnungsparameter erzeugen; das Random-Cluster-Modell mit großem $q$ besitzt einen Phasenübergang erster Ordnung, sobald $q$ oberhalb einer dimensionsabhängigen Schwelle liegt.
- **$k$-Kern-Perkolation.** Verlangt man lokale Redundanz statt bloßer Konnektivität, wird der Übergang für $k\ge3$ erster Ordnung (Kapitel 10).
- **Gekoppelte Netzwerke.** Zwei Netzwerke, die jeweils von der Riesenkomponente des anderen abhängen, erzeugen eine Kaskade mit einem diskontinuierlichen Sprung (Kapitel 10).

Die Lehre daraus: Die Aussage „Perkolation ist stetig“ betrifft die Unabhängigkeit der Kanten, nicht die Konnektivität als solche. Jede Anwendung, die die Perkolation mit einem anderen dynamischen Prozess koppelt, muss prüfen, in welchem Regime sie sich befindet, bevor sie einen stetigen Übergang annimmt.

## 5.5 Was die Schärfe liefert

Aus diesem Kapitel ergeben sich drei praktische Konsequenzen, die immer wieder verwendet werden.

Erstens ist der Finite-Size-Skalierungsansatz aus Kapitel 6 gerechtfertigt: Unterhalb von $p_c$ werden alle Längen von $\xi$ kontrolliert, und oberhalb von $p_c$ ist der unendliche Cluster eindeutig und dicht; bei $p_c$ bleibt als einzige Skala die Systemgröße.

Zweitens ist die numerische Bestimmung von $p_c$ über die Divergenz der Suszeptibilität zulässig, und ihre Fehlerbalken lassen sich aus der Skalierung von $\chi$ mit $L$ abschätzen.

Drittens bringt der Eindeutigkeitssatz die Rede von der „Riesenkomponente“ aus der Netzwerkwissenschaft mit der Gittersprache in Einklang: In einem großen endlichen Graphen gibt es oberhalb der Schwelle eine Komponente der Größe $\Theta(N)$, und die zweitgrößte ist $o(N)$. Die Aussage ist asymptotisch; in einem Graphen mit $10^4$ Knoten kann die zweitgrößte Komponente immer noch groß genug sein, um eine Rolle zu spielen — eine wiederkehrende Quelle von Verwirrung in angewandten Arbeiten.
