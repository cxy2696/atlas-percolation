---
id: 22-trees
part: Critical phenomena
order: 22
title: Bäume, erzeugende Funktionen und Botschaftspassage
subtitle: Exakte Perkolation auf Verzweigungsstrukturen und was dünn besetzte Netzwerke davon erben
reading: 17 min
---

Jede exakte Rechnung in diesem Atlas, die nicht zweidimensional ist, ist eine Rechnung auf einem Baum. Das Bethe-Gitter ist das sauberste Beispiel, aber nicht das einzige: Ein dünn besetzter Zufallsgraph sieht in der Umgebung eines typischen Knotens wie ein Baum aus, und das Konfigurationsmodell erbt die Baumantwort *global*, weil seine Riesenkomponente durch einen Verzweigungsprozess entsteht. Dieses Kapitel leitet die drei Gleichungen her, die den größten Teil der Arbeit leisten – die Verzweigungsrekursion, den Fixpunkt der erzeugenden Funktion und das Botschaftspassage-System –, und es sagt genau, wann jede von ihnen exakt ist und wann sie nur eine lokale Näherung darstellt.

## 22.1 Kantenperkolation auf einem Galton–Watson-Baum

Sei $T$ ein Galton–Watson-Baum: Die Wurzel hat $K$ Kinder mit $\mathbb{P}(K=k)=p_k$, und jeder weitere Knoten besitzt eine unabhängige Kopie derselben Nachkommenverteilung. Dabei bezeichne
$$
f(s)=\sum_{k\ge0}p_k s^k,\qquad m=f'(1)=\mathbb{E}K
$$
die erzeugende Funktion der Nachkommenzahl und den zugehörigen Mittelwert; es sei $m>1$, sodass der Baum mit positiver Wahrscheinlichkeit unendlich ist. Auf den Kanten betrachte man Kantenperkolation mit Beibehaltungswahrscheinlichkeit $p$.

$u$ sei die Wahrscheinlichkeit, dass der offene Cluster eines Knotens, *auf seinen Nachkommenteilbaum beschränkt*, endlich ist. Der Knoten selbst ist vorhanden. Jeder Kindzweig ist endlich, wenn entweder die Kante zu diesem Kind geschlossen ist (Wahrscheinlichkeit $1-p$) oder sie offen ist und der Nachkommencluster des Kindes endlich ist (Wahrscheinlichkeit $p\,u$). Die Zweige sind, gegeben den Knoten, unabhängig, also
$$
u=f\big(1-p+p\,u\big). \tag{22.1}
$$
Die Wurzel hat dieselbe Nachkommenverteilung; ihr Cluster ist daher ebenfalls mit Wahrscheinlichkeit $u$ endlich:
$$
\theta(p)=1-u,\qquad u=f(1-p+pu). \tag{22.2}
$$
Der Fixpunkt $u=1$ löst (22.1) stets und liefert $\theta=0$. Eine zweite Lösung in $[0,1)$ existiert genau dann, wenn die Abbildung $g(u)=f(1-p+pu)$ bei $u=1$ eine Steigung größer als eins besitzt:
$$
g'(1)=p\,f'(1)=p\,m>1
\quad\Longleftrightarrow\quad
p>\frac1m .
$$
Somit
$$
p_c(T)=\frac{1}{m}. \tag{22.3}
$$
Das ist die gesamte Molekularfeldtheorie in drei Zeilen. Auf dem $z$-regulären Baum hat die Wurzel $z$ Nachbarn und jeder weitere Knoten $z-1$ Vorwärtsnachbarn; die Vorwärtsrekursion lautet
$$
u=\big(1-p+pu\big)^{z-1},\qquad
\theta(p)=1-\big(1-p+pu\big)^{z}, \tag{22.4}
$$
und $p_c=1/(z-1)$, der in den Kapiteln 4 und 8 genannte Wert. Die beiden Formen unterscheiden sich nur im Grad der Wurzel; beide sind auf ihrem jeweiligen Baum exakt. Für $z=2$ ist der Baum eine Kette: $p_c=1$, und bei $p=1$ ist die Kette vollständig offen mit $\theta=1$. Der Endpunkt ist die eine Stelle, an der die Kurzform „kritisch heißt $\theta=0$“ die offensichtliche Ausnahme braucht.

**Mittlere Clustergröße.** Die erwartete Zahl der Knoten im Abstand $n$ von der Wurzel beträgt im Baum $m^n$, und jeder von ihnen ist mit Wahrscheinlichkeit $p^n$ mit der Wurzel verbunden. Somit
$$
\chi(p)=\sum_{n\ge0}(pm)^n=\frac{1}{1-pm},\qquad p<p_c, \tag{22.5}
$$
was für $p\uparrow p_c=1/m$ mit dem Exponenten $\gamma=1$ divergiert. Auf dem $z$-regulären Baum beträgt die Zahl der Knoten im Abstand $n\ge1$ gerade $z(z-1)^{n-1}$, also $\chi=1+zp/(1-p(z-1))$; die Divergenz ist dieselbe.

## 22.2 Die erzeugende Funktion des Clusters

$H(s)=\sum_{n\ge1}\mathbb{P}(|C_0|=n)\,s^n$ sei die erzeugende Funktion des offenen Clusters der Wurzel. Die Wurzel trägt $s$ bei; jeder Kindzweig trägt entweder nichts bei (Kante geschlossen, Faktor $1-p$) oder einen Cluster mit erzeugender Funktion $H(s)$ (Kante offen, Faktor $p\,H(s)$). Die Unabhängigkeit über die Kinder liefert die Funktionalgleichung
$$
H(s)=s\,f\big(1-p+p\,H(s)\big). \tag{22.6}
$$
Mit $s=1$ erhält man (22.2) zurück, denn $u=H(1)$ ist die Wahrscheinlichkeit, dass der Cluster endlich ist. Differenziert man bei $s=1$ und schreibt $\chi=H'(1)$, so ergibt sich
$$
\chi=1+p\,f'(1)\,\chi=\frac{1}{1-pm},
$$
in Übereinstimmung mit (22.5).

Bei $p=p_c$ hat die Gleichung für eine Nachkommenverteilung mit endlicher Varianz eine doppelte Wurzel bei $s=1$, und eine Standardanalyse der Singularität von (22.6) liefert
$$
\mathbb{P}(|C_0|=n)\sim C\,n^{-3/2},\qquad
n_s(p_c)=\frac{\mathbb{P}(|C_0|=s)}{s}\sim C\,s^{-5/2}.
$$
Der Vergleich mit den Definitionen $\mathbb{P}(|C_0|=n)\sim n^{-1-1/\delta}$ und $n_s\sim s^{-\tau}$ ergibt $\delta=2$ und $\tau=5/2$, die Molekularfeldwerte. Die Quadratwurzel-Singularität ersetzt beim Baum einen Phasenübergang mit divergierender Korrelationslänge: Es gibt überhaupt keine Längenskala, nur eine Generationenzahl.

## 22.3 Dünn besetzte Graphen und der lokale Baumlimes

Das Konfigurationsmodell fixiert eine Gradfolge $(k_1,\dots,k_N)$ mit $\sum_i k_i=2M$ und paart die $2M$ Halbkanten gleichmäßig zufällig. Man wähle einen Knoten gleichmäßig zufällig und betrachte seine Nachbarschaft bis zu einem festen Radius $r$. Mit einer Wahrscheinlichkeit, die für $N\to\infty$ gegen eins strebt, ist diese Nachbarschaft ein Baum, und die Wurzel hat die Nachkommenverteilung
$$
q_k=\frac{(k+1)\,p_{k+1}}{\langle k\rangle}, \tag{22.7}
$$
die größenverzerrte Verteilung: Ein Nachbar eines zufälligen Knotens hat bereits eine Kante verbraucht, und seine verbleibenden $k$ Kanten sind nach $q_k$ verteilt. Die Konvergenz ist die *lokale schwache Konvergenz* von Benjamini und Schramm (2001); eine Lehrbuchdarstellung findet sich bei van der Hofstad (2017).

Lokale Konvergenz genügt nicht, um ein globales Ereignis wie die Perkolation auf $\mathbb{Z}^d$ zu bestimmen. Für das Konfigurationsmodell genügt sie, weil die Riesenkomponente durch eine Verzweigungsinstabilität entsteht und die Zyklen, die die Verzweigungszählung korrigieren würden, auf der Skala der entstehenden Komponente selten sind. Unter der Voraussetzung eines endlichen zweiten Moments ist das Molloy–Reed-Kriterium exakt: Eine Riesenkomponente existiert genau dann, wenn
$$
\frac{\langle k^2\rangle-\langle k\rangle}{\langle k\rangle}>1 .
$$
Durrett (2007) sowie Janson, Łuczak und Ruciński (2000) geben die präzisen Aussagen und das Verhalten im kritischen Fenster an.

## 22.4 Die Lösung des Konfigurationsmodells mit erzeugenden Funktionen

Dabei seien
$$
G_0(x)=\sum_{k\ge0}p_k x^k,\qquad
G_1(x)=\frac{G_0'(x)}{G_0'(1)}=\sum_{k\ge1}\frac{k\,p_k}{\langle k\rangle}x^{k-1}
$$
die erzeugende Funktion der Gradverteilung und ihr größenverzerrtes Gegenstück. Hinzu komme Kantenperkolation mit Beibehaltungswahrscheinlichkeit $T$ (der Buchstabe $p$ bleibt der Besetzungswahrscheinlichkeit der Gitterkapitel vorbehalten; $T$ ist die Übertragbarkeit aus Kapitel 23).

$u$ sei die Wahrscheinlichkeit, dass ein über eine Kante erreichter Knoten *nicht* über diese Kante mit der Riesenkomponente verbunden ist. Seine übrigen $k-1$ Kanten sind nach $G_1$ verteilt; jede von ihnen wird entweder nicht beibehalten (Wahrscheinlichkeit $1-T$) oder beibehalten, ohne den Weg fortzusetzen (Wahrscheinlichkeit $T u$). Somit
$$
u=G_1\big(1-T+T u\big). \tag{22.8}
$$
Die Wahrscheinlichkeit, dass die Wurzel nicht zur Riesenkomponente gehört, ist derselbe Ausdruck mit der Gradverteilung $G_0$ der Wurzel:
$$
S(T)=1-G_0\big(1-T+T u\big),\qquad u=G_1(1-T+Tu). \tag{22.9}
$$
Gleichung (22.9) ist die Standardlösung des Konfigurationsmodells (Newman 2002); sie ist im Limes $N\to\infty$ unter denselben Voraussetzungen an das endliche zweite Moment exakt, die auch für Molloy–Reed gelten.

**Schwellenwert.** Man linearisiere (22.8) bei $u=1$: Die Ableitung der rechten Seite ist $T\,G_1'(1)$, und
$$
G_1'(1)=\frac{G_0''(1)}{G_0'(1)}
=\frac{\langle k^2\rangle-\langle k\rangle}{\langle k\rangle}=\kappa-1 .
$$
Eine nichttriviale Lösung erscheint, wenn $T(\kappa-1)>1$ gilt, also
$$
T_c=\frac{1}{\kappa-1},\qquad \kappa=\frac{\langle k^2\rangle}{\langle k\rangle}. \tag{22.10}
$$
Bei $T=1$ ist dies die Molloy–Reed-Bedingung $\kappa>2$. Gleichung (22.10) ist derselbe Schwellenwert, der in Kapitel 10 mit einem Argument über das erste Moment hergeleitet wurde; die erzeugende Funktion liefert zusätzlich die Größe der Riesenkomponente.

**Kontrolle am Erdős–Rényi-Modell.** Für Poisson-Grade mit Mittelwert $c$ ist $G_0(x)=G_1(x)=e^{c(x-1)}$, und (22.9) wird zu
$$
S=1-e^{-cTS},\qquad T_c=\frac1c .
$$
Die von null verschiedene Lösung ist die bekannte Riesenkomponente des Zufallsgraphen; bei $cT=2$ beträgt sie $S=0.7968\ldots$.

**Kontrolle am skalenfreien Modell.** Für $p_k\propto k^{-\gamma_{\text{deg}}}$ mit $2<\gamma_{\text{deg}}\le3$ gilt $\langle k^2\rangle=\infty$ im Limes unendlicher Größe, also $\kappa=\infty$ und $T_c=0$. Die Aussage betrifft den Grenzfall; ein endliches Netzwerk besitzt einen Cutoff und einen kleinen, aber positiven Schwellenwert. Kapitel 10 erläutert die Einschränkung auf endliche Größe.

## 22.5 Botschaftspassage auf einem festen Graphen

Die Lösung mit erzeugenden Funktionen setzt eine Gradverteilung voraus, nicht einen konkreten Graphen. Für einen gegebenen endlichen Graphen mit Nachbarmenge $\partial i$ sei die Cavity-Botschaft $u_{i\to j}$ die Wahrscheinlichkeit, dass $i$ nicht über einen anderen Nachbarn als $j$ mit der Riesenkomponente verbunden ist. Die Nachbarn von $i$ außer $j$ sind *unabhängig, wenn der Graph ein Baum ist*, also
$$
u_{i\to j}=\prod_{k\in\partial i\setminus\{j\}}\big(1-T+T\,u_{k\to i}\big), \tag{22.11}
$$
und die Wahrscheinlichkeit, dass $i$ außerhalb der Riesenkomponente liegt, ist
$$
u_i=\prod_{k\in\partial i}\big(1-T+T\,u_{k\to i}\big). \tag{22.12}
$$
Auf einem Baum sind (22.11)–(22.12) exakt und lassen sich in einem Durchgang von den Blättern nach innen lösen. Auf einem Graphen mit Zyklen sind sie die *Bethe-Näherung*: Das Produkt setzt voraus, dass die Zweige hinter verschiedenen Nachbarn, gegeben $i$, unabhängig sind, was versagt, wenn kurze Schleifen sie verbinden. Der Fehler wird von der Dichte kurzer Schleifen bestimmt, nicht von der Systemgröße. Karrer und Newman (2010) verwenden genau dieses System für allgemeine Epidemiemodelle, und Mézard und Montanari (2009) entwickeln die Cavity-Methode allgemein.

Die Botschaftspassage macht die Baumrechnung für reale Daten nutzbar: Das Kontaktnetzwerk ist gegeben, die Gradverteilung nicht, und (22.11) lässt sich auf der tatsächlichen Adjazenz in $O(m)$ Zeit pro Durchlauf iterieren. Die Referenzimplementierung ist `messagePassingPercolation` / `message_passing_percolation`, mit Präfix-/Suffixprodukt und einem `mate`-Array für die gegenüberliegende Halbkante.

## 22.6 Was Bäume richtig machen – und was nicht

Das Bethe-Gitter ist der Limes $d\to\infty$, und sein Schwellenwert $1/(z-1)$ ist *nicht* der Schwellenwert von $\mathbb{Z}^d$ mit demselben Grad. Tabelle 22.1 macht die Lücke sichtbar.

| Graph | $z$ | Baumvorhersage $1/(z-1)$ | Tatsächliches $p_c$ (Kanten) | Status |
|---|---|---|---|---|
| $\mathbb{Z}^2$ | 4 | $1/3=0.3333$ | $1/2$ | exakt (Kesten) |
| Einfach kubisch $\mathbb{Z}^3$ | 6 | $1/5=0.2$ | $0.24881182(10)$ | numerisch |
| $z$-regulärer Baum | $z$ | $1/(z-1)$ | $1/(z-1)$ | exakt |
| Konfigurationsmodell | $\langle k\rangle$ | $1/(\kappa-1)$ | $1/(\kappa-1)$ | exakt, $N\to\infty$ |

Tabelle 22.1. Der Baumwert ist auf Bäumen und im Konfigurationsmodell exakt; auf $\mathbb{Z}^d$ ist er eine untere Schranke, die mit fallendem $d$ schlechter wird. Der Grund ist, dass ein Baum keine Zyklen besitzt, die einen potenziell unendlichen Cluster blockieren könnten: Auf $\mathbb{Z}^2$ haben die dualen geschlossenen Durchgänge, die $p_c=1/2$ erzwingen, kein Gegenstück im Baum. Das Konfigurationsmodell ist wiederum anders gelagert: Auf der Skala der Riesenkomponente ist es baumartig, sodass die Verzweigungsantwort asymptotisch exakt ist, obwohl der Graph endlich ist und Zyklen besitzt.

Diese Unterscheidung ist die häufigste Fehlerquelle in der angewandten Arbeit. Eine „Bethe-Näherung“ für ein zweidimensionales Material ist keine kontrollierte Näherung; eine Bethe-Näherung für ein dünn besetztes Kontaktnetzwerk kann für die Riesenkomponente asymptotisch exakt sein und ist für den Schwellenwert meist eine gute Näherung, doch die Größe des Fehlers ist eine Eigenschaft des jeweiligen Graphen und keine universelle Konstante.

## 22.7 Durchgerechnete Kontrollen

Drei Zahlen lohnt es, im Gedächtnis zu behalten.

**Bethe, $z=3$, $p=1/2$.** Gleichung (22.4) lautet $u=(1/2+u/2)^2$, also $(u-1)^2=0$. Die doppelte Wurzel bei $u=1$ ist der kritische Punkt: $\theta=0$, und die beiden Zweige fallen zusammen. Bei $p=0.6$ lauten die Wurzeln $u=1$ und $u=4/9$, und
$$
\theta=1-\big(0.4+0.6\cdot\tfrac49\big)^3
=1-\big(\tfrac23\big)^3=\tfrac{19}{27}=0.7037\ldots .
$$

**Erdős–Rényi, $c=2$, $T=1$.** $S=1-e^{-2S}$ besitzt die von null verschiedene Wurzel $S=0.796812\ldots$; der Schwellenwert liegt bei $c=1$, und die Riesenkomponente bei $c=2$ umfasst etwa vier Fünftel des Graphen.

**Poisson-Baum, $c=2$, $p=0.6$.** Hier ist $p_c=1/2$, der Baum also superkritisch; die von null verschiedene Lösung von $u=e^{-cp(1-u)}=e^{-1.2(1-u)}$ liefert $\theta=1-u=0.313698\ldots$. Dies ist genau die Erdős–Rényi-Riesenkomponente bei $cT=1.2$, denn eine Poisson-Gradverteilung ist unter Ausdünnung stabil: Die Wurzel hat $\mathrm{Poisson}(2p)=\mathrm{Poisson}(1.2)$ offene Kinder, dieselbe Verteilung wie jeder Vorwärtszweig. Die Übereinstimmung ist eine nützliche Kontrolle beider Rechnungen und eine Besonderheit der Poisson-Grade.

Die Bibliotheken in vier Sprachen implementieren diese drei Kontrollen als `bethePercolation`, `configurationGiantComponent` und den Fixpunktlöser zu (22.9); die Regressionswerte stehen in den Testsuiten.

## 22.8 Was davon mitzunehmen ist

1. **Auf einem Baum ist Perkolation ein Verzweigungsprozess.** Die Rekursion (22.1) und der Schwellenwert (22.3) sind exakt, keine Näherungen.
2. **Erzeugende Funktionen verwandeln die Rekursion in Algebra.** Die erzeugende Funktion des Clusters (22.6) liefert die mittlere Größe, den kritischen Exponenten $\delta=2$ und den $n^{-3/2}$-Schwanz in einer einzigen Rechnung.
3. **Dünn besetzte Graphen erben die Baumantwort global.** Die Gleichungen des Konfigurationsmodells (22.9)–(22.10) sind im Limes $N\to\infty$ exakt, unter der Voraussetzung eines endlichen zweiten Moments.
4. **Auf einem Gitter ist die Baumantwort nur ein lokaler Grenzwert.** Die Zyklen, die der Baum auslässt, sind genau das, was in zwei Dimensionen $p_c=1/2$ festlegt und was den dreidimensionalen Schwellenwert größer als $1/(2d-1)$ macht.
5. **Botschaftspassage ist die Version für endliche Graphen.** Sie ist auf Bäumen exakt, auf lokal baumartigen Graphen asymptotisch exakt und anderswo nur dann eine kontrollierte Näherung, wenn die Dichte kurzer Schleifen klein ist.

Kapitel 23 verwendet diese Gleichungen für die Endgröße einer Epidemie, wobei $T$ eine Transmissionswahrscheinlichkeit und keine Kantenbesetzung ist.
