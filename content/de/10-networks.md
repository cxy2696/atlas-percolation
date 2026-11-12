---
id: 10-networks
part: Networks and applications
order: 10
title: Netzwerke: Grade, Kerne und Kopplung
subtitle: Molloy–Reed, k-Kern und die Konstante 2,4554
reading: 19 min
---

Auf einem Gitter hat jeder Knoten dieselbe Zahl von Nachbarn. In einem Netzwerk ist das nicht so, und die Gradverteilung wird zu einem Kontrollparameter, der so wichtig ist wie $p$. Drei Ergebnisse tragen den größten Teil der Theorie: das Molloy–Reed-Kriterium für die Existenz einer Riesenkomponente, der Charakter erster Ordnung der $k$-Kern-Perkolation und die Schwelle 2,4554 für zwei vollständig gekoppelte Erdős–Rényi-Netzwerke. Das letzte Ergebnis wird hier von Grund auf hergeleitet, weil es leicht ist, die Rekursion für gekoppelte Netzwerke auf subtile Weise falsch aufzuschreiben.

## 10.1 Das Konfigurationsmodell und die Verzweigungsnäherung

Man fixiere eine Gradfolge $(k_1,\dots,k_N)$ mit $\sum k_i=2M$. Das Konfigurationsmodell paart die $2M$ Halbkanten gleichmäßig zufällig. Im Limes $N\to\infty$ bei fester Gradverteilung $p_k$ konvergiert die Nachbarschaft eines zufälligen Knotens lokal gegen einen Verzweigungsprozess: Ein Knoten vom Grad $k$ hat $k$ Nachbarn, und ein über eine Kante erreichter Nachbar besitzt $k-1$ weitere Kanten, mit der **größenverzerrten** Gradverteilung
$$
\tilde p_k=\frac{k\,p_k}{\langle k\rangle}.
$$
Die Größenverzerrung ist der einzige nicht offensichtliche Bestandteil. Wählt man eine zufällige Kante und dann einen zufälligen Endpunkt, so wird ein Knoten vom Grad $k$ mit einer zu $k$ proportionalen Wahrscheinlichkeit gewählt, nicht mit einer zu $p_k$ proportionalen. Diesen Punkt falsch zu machen, ist ein häufiger Fehler in angewandten Netzwerkarbeiten.

## 10.2 Molloy–Reed, nachgerechnet

Jeder Knoten wird unabhängig mit Wahrscheinlichkeit $p$ beibehalten (Site-Verdünnung). Definiert sei $\rho$ als die Wahrscheinlichkeit, dass die Konnektivität von einem über eine Kante erreichten Knoten aus unbegrenzt weiterreicht. Ein beibehaltener Nachbar vom Grad $k$ setzt sie fort, wenn mindestens eine seiner $k-1$ übrigen Kanten zu einem beibehaltenen Knoten führt, der sie ebenfalls fortsetzt, also
$$
\rho=p\sum_{k\ge1}\frac{k\,p_k}{\langle k\rangle}\Big[1-(1-\rho)^{k-1}\Big].
$$
Die Riesenkomponente existiert genau dann, wenn diese Gleichung eine positive Lösung hat, und das ist genau dann der Fall, wenn die Ableitung bei $\rho=0$ eins übersteigt:
$$
\left.\frac{d}{d\rho}\right|_{\rho=0}
=p\sum_k\frac{k\,p_k}{\langle k\rangle}(k-1)
=p\,\frac{\langle k^2\rangle-\langle k\rangle}{\langle k\rangle}.
$$
Damit gilt
$$
p_c=\frac{\langle k\rangle}{\langle k^2\rangle-\langle k\rangle}=\frac{1}{\kappa-1},
\qquad \kappa:=\frac{\langle k^2\rangle}{\langle k\rangle},
$$
Bei voller Besetzung ($p=1$) reduziert sich dies auf $\kappa>2$, das Molloy–Reed-Kriterium. Unter Verdünnung lautet das Kriterium $p(\kappa-1)>1$ bzw. $p>1/(\kappa-1)$; $\kappa>2$ allein genügt nicht. Der Verzweigungsfaktor ist $\kappa-1$, nicht $\kappa$. Er ist nicht der mittlere Grad; beide stimmen nur bei Poisson-Graden überein, wo $\kappa=c+1$ und $\kappa-1=c$ gilt.

Der verdünnte Anteil ist $f=1-p$, der kritische Entfernungsanteil also
$$
f_c=1-\frac{1}{\kappa-1}=\frac{\kappa-2}{\kappa-1}.
$$
Für Erdős–Rényi-Grade gilt $\langle k^2\rangle=\langle k\rangle(\langle k\rangle+1)$ und $\kappa=c+1$, was $f_c=1-1/c$ ergibt – das bekannte Ergebnis, dass ein Zufallsgraph mit mittlerem Grad $c$ zerfällt, wenn ein Anteil $1-1/c$ der Knoten entfernt wird.

**Ein häufiger Stolperstein.** Es liegt nahe, $f_c=1-1/\kappa$ zu schreiben und in derselben abgesetzten Formel den korrekten Ausdruck $1-\langle k\rangle/(\langle k^2\rangle-\langle k\rangle)$ anzugeben. Die beiden sind nicht gleich: $1/\kappa=\langle k\rangle/\langle k^2\rangle$, während der korrekte Nenner $\langle k^2\rangle-\langle k\rangle$ lautet. Der Erdős–Rényi-Sonderfall ist nachsichtig, weshalb der Fehler flüchtige Prüfungen übersteht. Die allgemeine Formel lautet $f_c=1-1/(\kappa-1)$; die Abweichung von $1-1/\kappa$ beträgt $1/[\kappa(\kappa-1)]$, ist in der Nähe von $\kappa=2$ am größten und verschwindet für schwere Verteilungen.

## 10.3 Skalenfreie Grade: das Verschwinden der Schwelle

Man nehme $p_k\propto k^{-\gamma_{\text{deg}}}$ für $k\ge m$ (der Index unterscheidet den Grad-Exponenten vom Suszeptibilitätsexponenten $\gamma$). Dann gilt
$$
\langle k^2\rangle\propto\int_m^\infty k^{2-\gamma_{\text{deg}}}\,dk
$$
was genau dann konvergiert, wenn $\gamma_{\text{deg}}>3$. Daraus ergeben sich drei Regime:

- $\gamma_{\text{deg}}>3$: $\kappa=(\gamma_{\text{deg}}-2)m/(\gamma_{\text{deg}}-3)$ ist endlich, $f_c=1-1/(\kappa-1)$ also eine echte Schwelle unterhalb von eins.
- $2<\gamma_{\text{deg}}\le3$: $\langle k^2\rangle=\infty$, also $\kappa=\infty$, $f_c=1$: Zufälliges Entfernen zerstört die Riesenkomponente im Limes unendlicher Größe nie.
- $\gamma_{\text{deg}}\le2$: Selbst $\langle k\rangle$ divergiert, und die Verteilung benötigt eine Regularisierung bei endlichem $N$; der Begriff eines Zufallsgraphen mit solchen Graden ist heikel.

Dasselbe Netzwerk ist gegenüber **gezielter** Entfernung extrem fragil: Entfernt man Knoten in absteigender Gradfolge, lässt sich die Riesenkomponente zerstören, während die meisten Knoten erhalten bleiben. Dies ist die Doppelnatur „robust und doch fragil“ von Cohen, Erez, ben-Avraham und Havlin (2000) sowie Albert, Jeong und Barabási (2000). Sie ist kein Paradoxon: Zufälliges Entfernen tastet die Gradverteilung proportional ab, sodass die vielen Knoten niedrigen Grades dominieren; gezieltes Entfernen trifft die Hubs, die das Netzwerk zusammenhalten.

## 10.4 $k$-Kern-Perkolation

Der $k$-Kern eines Graphen entsteht durch wiederholtes Löschen von Knoten, deren aktueller Grad kleiner als $k$ ist. Anders als die Konnektivität verlangt der $k$-Kern lokale Redundanz: Ein Knoten überlebt, wenn mindestens $k$ seiner Nachbarn überleben.

Auf einem Erdős–Rényi-Graphen mit mittlerem Grad $c$ entsteht der $3$-Kern unstetig. Oberhalb einer Schwelle $c_3\approx3.35$ (für das Auftreten eines nichtleeren 3-Kerns im unverdünnten Graphen; Dorogovtsev, Goltsev und Mendes 2006) ist der Kern makroskopisch; darunter existiert er nicht. Unter Verdünnung ist der Übergang ebenfalls unstetig, mit einer Hystereseschleife, wenn man den Prozess rückwärts laufen lässt. Der Mechanismus ist eine Rückkopplung der Bootstrap-Perkolation: Der Verlust eines Knotens kann mehrere Nachbarn unter die Schwelle drücken, wodurch weitere Knoten entfallen, und die Kaskade kommt entweder früh zum Stillstand oder läuft bis zum Ende.

Dies ist das sauberste Beispiel für einen Perkolationsübergang, dessen *Typ* durch die lokale Regel und nicht durch Korrelationen verändert wird. Für Anwendungen ist das wichtig, weil eine $k$-Kern-Anforderung genau den allmählichen Abbau beseitigt: Ein System mit Redundanzanforderung versagt abrupt, nicht sanft.

## 10.5 Zwei gekoppelte Netzwerke und die Konstante 2,4554

**Modell (Buldyrev et al. 2010).** Zwei Netzwerke $A$ und $B$ auf derselben Knotenmenge, mit einer Eins-zu-eins-Kopplung. Ein Knoten überlebt eine Runde genau dann, wenn er anfangs beibehalten wurde, zur Riesenkomponente des überlebenden Teilgraphen von $A$ gehört und sein Partner zur Riesenkomponente des überlebenden Teilgraphen von $B$ gehört. Man entferne anfangs einen Anteil $1-p$, wende die Runde wiederholt an und halte am Fixpunkt an. Werden Partner mit derselben Nummer bezeichnet, ist die Partnerabbildung bei Eins-zu-eins-Kopplung die Identität; die Runde ist also der Durchschnitt der beiden Riesenkomponenten; $A$ und $B$ isoliert auszudünnen ist nicht derselbe Algorithmus und behält Knoten, deren Partner bereits ausgefallen ist.

**Molekularfeld-Lösung für Erdős–Rényi-Schichten.** Sei $\mu$ der Anteil der Knoten in der gemeinsamen Riesenkomponente. Ein beibehaltener Knoten gehört genau dann dazu, wenn er in $A$ mindestens einen Nachbarn in der gemeinsamen Komponente hat und in $B$ ebenso. Bei Poisson-Graden mit Mittelwert $c$ ist die Wahrscheinlichkeit, dass keiner der $c$ Nachbarn die Bedingung erfüllt, $e^{-c\mu}$, und die beiden Schichten sind, gegeben den Knoten, unabhängig, also
$$
\mu=p\big(1-e^{-c\mu}\big)^2. \tag{10.1}
$$
Die triviale Lösung $\mu=0$ existiert stets. Eine nichttriviale Lösung erscheint, wenn die rechte Seite die Diagonale berührt. Man setze $t=c\mu$ und $f(t)=p(1-e^{-t})^2$. Die Berührung verlangt
$$
f(t)=t/c,\qquad f'(t)=1/c .
$$
Die zweite Gleichung liefert $1/c=2p(1-e^{-t})e^{-t}$. Dividiert man die erste Gleichung durch die zweite, so folgt
$$
t=\frac{(1-e^{-t})^2}{2(1-e^{-t})e^{-t}}=\frac{e^{t}-1}{2},
$$
also $e^{t}=1+2t$. Die von null verschiedene Wurzel ist $t^\ast=1.256431\ldots$, und man erhält
$$
p_c=\frac{1}{2c\,(1-e^{-t^\ast})e^{-t^\ast}}=\frac{2.45538\ldots}{c}.
$$
Zum Vergleich: Eine einzelne Erdős–Rényi-Schicht hat $p_c=1/c$. Die Kopplung erhöht die Schwelle also um den Faktor $2.4554$, und der Übergang ist **erster Ordnung**: Bei $p_c$ springt die gemeinsame Komponente von null auf eine endliche Größe $\mu^\ast=t^\ast/c$, weil der nichttriviale Zweig durch eine Sattel-Knoten-Bifurkation entsteht und nicht durch eine stetige Bifurkation aus null.

Zwei Konsequenzen verdienen es, genannt zu werden, weil sie oft übersehen werden. Erstens ist die Konstante nicht universell: Sie hängt von der Gradverteilung und vom Kopplungsmuster ab (Eins-zu-eins, partiell, mehrfach). Für ein vollständig gekoppeltes Paar von Poisson-Schichten ist sie exakt die Wurzel der obigen transzendenten Gleichung; für andere Gradverteilungen liefert dieselbe Rechnung eine andere Zahl. Zweitens macht der Charakter erster Ordnung das System gefährlich: Im Ordnungsparameter gibt es keine Vorwarnung, und die Kaskade schreitet pro Schritt um einen endlichen Anteil des Netzwerks voran.

**Partielle Kopplung.** Ist nur ein Anteil $q$ der Knoten gekoppelt, wird die Rekursion zu einem Gleichungspaar für die beiden Schichten. Bei geringer Kopplungsstärke kehrt der Übergang zur zweiten Ordnung zurück (Parshani, Buldyrev und Havlin 2010). Die Entwurfslektion – mehrere schwache Kopplungen einem einzigen starken vorzuziehen – ist der ingenieurmäßige Gehalt der Theorie.

## 10.6 Perkolation höherer Ordnung

Auf einem Simplizialkomplex oder Hypergraphen kann „zusammenhängend“ $k$-te Ordnungskonnektivität bedeuten (zwei $k$-Simplizes, die über eine gemeinsame $(k-1)$-Seite verbunden sind), eine durch Betti-Zahlen definierte Konnektivität oder eine durch die Euler-Charakteristik definierte Konnektivität. Numerisch erzeugen diese Definitionen Übergänge, die stetiger als im Graphenfall sein können, mit einem kritischen Intervall, in dem die Betti-Zahlen von null verschieden bleiben. Eine einheitliche rigorose Theorie gibt es nicht; das Thema steht in der Liste offener Probleme in Kapitel 13, und die Numerik reagiert empfindlich auf die verwendete Definition.

## 10.7 Entwurfsregeln, die daraus folgen

Vier Regeln folgen aus diesem Kapitel und werden in den Fallstudien von Kapitel 12 verwendet.

1. **Grade homogenisieren, um gezielten Angriffen zu widerstehen; heterogenisieren, um Zufallsausfällen zu widerstehen.** Die beiden Ziele stehen im Konflikt, und der Konflikt wird durch $f_c=1-1/(\kappa-1)$ gegenüber der Schwelle für gezielte Angriffe quantifiziert.
2. **Einzelabhängigkeiten vermeiden.** Eins-zu-eins-Kopplung verwandelt einen stetigen Übergang in einen solchen erster Ordnung; mehrfache Kopplung stellt den stetigen Charakter wieder her.
3. **Redundanzanforderungen als unstetig behandeln.** Eine $k$-Kern-Anforderung beseitigt das allmähliche Regime; die Sicherheitsmarge ist für den Sprung auszulegen, nicht für den Mittelwert.
4. **$\kappa$ messen, nicht den mittleren Grad.** Der mittlere Grad ist die falsche Kennzahl für Robustheit; ein Netzwerk mit demselben mittleren Grad und einem schwereren Verteilungsende hat ein ganz anderes $f_c$.
