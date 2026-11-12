---
id: 17-continuum
part: Networks and applications
order: 17
title: Kontinuumsperkolation: Scheiben, Stäbe und reale Medien
subtitle: Das Boolesche Modell, Ausschlussvolumen und warum Überdeckung nicht Konnektivität ist
reading: 15 Min
---

Die Gitterperkolation legt die Zufälligkeit auf ein festes Raster. Ein Verbundwerkstoff, ein Sensornetz oder ein poröses Gestein hat kein Raster: Die Füllstoffpartikel sitzen an zufälligen Positionen, und zwei Partikel sind verbunden, wenn sich ihre Ausschlussvolumina überlappen. Die kontinuierliche Version des Modells ist das Boolesche Modell, und seine Schwelle ist eine Zahl, die jede Anwendung zitiert und nur wenige nachprüfen.

## 17.1 Das Boolesche Modell

Die Mittelpunkte der Partikel seien ein Poisson-Punktprozess der Intensität $n$ in der Ebene, jedes Partikel eine abgeschlossene Scheibe vom Radius $r$. Zwei Scheiben sind verbunden, wenn sie sich überlappen oder berühren, also wenn der Abstand ihrer Mittelpunkte höchstens $2r$ beträgt. Die Zusammenhangskomponenten dieses Schnittgraphen sind die Kontinuumscluster.

Der natürliche dimensionslose Kontrollparameter ist die reduzierte Dichte
$$
\lambda=n\pi r^2,
$$
die erwartete Zahl der Scheibenmittelpunkte in einer Scheibe vom Radius $r$. Sie ist das kontinuierliche Gegenstück zu $np$. Solange das Gebiet groß gegen $r$ ist, hängt das Modell nur von $\lambda$ ab, nicht einzeln von $n$ und $r$.

## 17.2 Überdeckung ist glatt

Man fixiere einen Punkt $x$. Die Zahl der Mittelpunkte in der Scheibe vom Radius $r$ um $x$ ist Poisson-verteilt mit Mittelwert $\lambda$, also
$$
\mathbb{P}(x\text{ ist überdeckt})=1-e^{-\lambda}.
$$
Das ist der erwartete überdeckte Flächenanteil, eine glatte Funktion von $\lambda$ ohne Schwelle. Die Ableitung $e^{-\lambda}$ ist bei $\lambda=0$ am größten und fällt monoton; in der Überdeckungskurve gibt es keinen kritischen Punkt.

Der Unterschied ist wichtig, weil Überdeckung und Konnektivität in Auslegungsrechnungen regelmäßig verwechselt werden. Ein Sensornetz kann 99 % einer Region überdecken und trotzdem seine beiden Enden nicht verbinden; ein Verbundwerkstoff kann bei einem Füllstoffanteil elektrisch leiten, der weit unter dem die Probe überdeckenden Anteil liegt. Überdeckung ist eine Aussage über die Vereinigung der Scheiben. Konnektivität ist eine Aussage über ein durchgehendes Cluster im Schnittgraphen.

## 17.3 Die Konnektivitätsschwelle

Das Boolesche Modell hat einen Perkolationsübergang bei der kritischen reduzierten Dichte
$$
\lambda_c\approx1.128087,
$$
mit dem Flächenanteil
$$
\phi_c=1-e^{-\lambda_c}\approx0.6763.
$$
Der Wert ist numerisch, nicht exakt; die besten Schätzungen stammen aus großskaligen Simulationen und Finite-Size-Skalierung (Mertens und Moore 2012). Die Schwelle gilt für die unendliche Ebene; eine endliche Box hat einen verschmierten Übergang und einen pseudokritischen Punkt, der von den Randbedingungen abhängt.

Eine nützliche Gegenprobe ist der mittlere Grad. Eine Scheibe hat im Mittel
$$
\langle k\rangle=n\cdot\pi(2r)^2=4\lambda
$$
Nachbarn, denn der Mittelpunkt einer Nachbarscheibe muss in einer Scheibe vom Radius $2r$ liegen. Bei $\lambda_c$ ergibt das $\langle k\rangle\approx4.51$. Die Zahl ist kein Schwellenkriterium — die Gradverteilung ist Poisson-verteilt und die Clusterbildung geometrisch —, aber sie ist eine schnelle Prüfung, ob eine Simulation im richtigen Bereich liegt. Ein Code, der eine Schwelle bei $\langle k\rangle\approx2$ meldet, beschreibt einen anderen Graphen.

## 17.4 Ausschlussvolumen und anisotrope Füllstoffe

Das Scheibenmodell ist isotrop. Reale Füllstoffe sind Stäbe, Plättchen und unregelmäßige Partikel, und ihre Form verschiebt die Schwelle um Größenordnungen. Die organisierende Größe ist das **Ausschlussvolumen** $V_{ex}$: das Volumen, das ein Partikel um ein anderes überstreicht, wenn sich beide berühren. Für zwei konvexe Körper vom Volumen $v$ skaliert die Perkolationsschwelle wie
$$
\phi_c\;\sim\;\frac{v}{V_{ex}},
$$
bis auf einen formabhängigen Vorfaktor der Ordnung eins. Die Beziehung ist nicht exakt, erklärt aber die Skalierung, auf die es ankommt.

Für einen dünnen Stab der Länge $L$ und des Durchmessers $D$ gilt $v\sim L D^2$ und $V_{ex}\sim L^2D$, also
$$
\phi_c\;\sim\;\frac{D}{L}.
$$
Für ein dünnes Plättchen des Durchmessers $L$ und der Dicke $D$ liefert dasselbe Dimensionsargument $\phi_c\sim D/L$. Deshalb perkolieren Kohlenstoffnanoröhren und Graphen bei Anteilen, die ein bis zwei Größenordnungen unter denen von Rußkugeln liegen: Das Aspektverhältnis $L/D$ vervielfacht das Ausschlussvolumen, ohne die Masse zu vervielfachen.

Das Ausschlussvolumenargument setzt harte, zufällig orientierte, gut dispergierte Partikel voraus. Agglomeration senkt das effektive Aspektverhältnis und hebt die Schwelle; Ausrichtung macht die Schwelle richtungsabhängig, sodass ein einzelnes skalares $\phi_c$ nicht mehr das richtige Objekt ist. Das richtige Objekt ist ein Richtungs-Schwellentensor, und das technische Ziel ist eine Formulierung, die in jeder Richtung oberhalb der Schwelle liegt, die Strom oder Last trägt.

## 17.5 Simulation

Der direkte Algorithmus ist derselbe wie auf dem Gitter, nur ersetzt die Geometrie die Kantenliste. Man erzeugt $n$ Poisson-Punkte in der Box und sortiert sie in ein gleichmäßiges Gitter der Zellgröße $2r$ ein. Für jede Scheibe betrachtet man die neun Nachbarzellen und vereinigt die Scheiben, deren Mittelpunkte höchstens $2r$ entfernt sind. Bei mäßiger Dichte ist der erwartete Aufwand $O(n)$, weil die Zahl der Nachbarn pro Zelle durch den Poisson-Mittelwert beschränkt ist.

Zwei Korrekturen werden leicht übersehen. Erstens muss die Zellgröße mindestens $2r$ betragen; bei genau $2r$ genügt die $3\times3$-Nachbarschaft, eine größere Zelle fügt nur Kandidaten hinzu. Zweitens hat die endliche Box eine Randschicht der Breite $2r$, in der Cluster abgeschnitten werden. Die Bibliothek verwendet offene Ränder und meldet das größte Cluster in der Box; das Labor macht es ebenso. Bei kleinem $n$ ist die Randverzerrung sichtbar; deshalb ist das Kontinuum-Panel eine Demonstration der Skalierung, keine Präzisionsmessung von $\lambda_c$.

## 17.6 Anwendungen

**Sensornetze.** Überdeckung fragt, ob jeder Punkt in Reichweite eines Sensors liegt; Konnektivität fragt, ob der Kommunikationsgraph eine durchgehende Komponente hat. Die beiden Schwellen sind verschieden, und eine Auslegung, die eine erfüllt, kann an der anderen scheitern. Das Boolesche Modell liefert das Skalengesetz; die tatsächliche Funkreichweite, Hindernisse und Schlafzyklen sind Korrekturen, die gemessen werden müssen.

**Leitfähige Verbundwerkstoffe.** Das Füllstoffnetz ist ein Kontinuumsperkolationsproblem mit Tunneleffekt. Die Schwelle wird durch Ausschlussvolumen und Dispergierung bestimmt; die Leitfähigkeit darüber durch Kontaktwiderstand und Tunnelbarrieren. Die Perkolation sagt, wo der Sprung liegt, nicht wie groß er ist.

**Poröse Medien.** Der Porenraum ist die zusammenhängende Phase, die feste Matrix das Hindernis. Quecksilberintrusion, Drainage und Imbibition sind Invasionsprobleme, deren Schwelle durch die Halsweitenverteilung gesetzt wird. Das Boolesche Modell ist eine grobe Geometrie für den Porenraum, aber es erfasst den Unterschied zwischen einem zusammenhängenden und einem getrennten Porennetz.

**Gewebegerüste.** Zellen wandern durch zusammenhängende Poren. Das Gerüst muss oberhalb der Porenkonnektivitätsschwelle liegen, nicht bloß porös sein. Die Schwelle hängt von der Porengrößenverteilung relativ zur Zellgröße ab; damit ist sie ein gewichtetes Perkolationsproblem und kein Boolesches.

## 17.7 Was das Boolesche Modell nicht erfasst

Das Modell setzt harte, undurchdringliche Scheiben, eine Poisson-Verteilung der Mittelpunkte, keine Orientierungskorrelationen und keine Kontakte außer geometrischer Überlappung voraus. Reale Systeme verletzen jede dieser Annahmen bis zu einem gewissen Grad. Polydispersität verbreitert den Übergang; Agglomeration erzeugt dichte Bereiche und Hohlräume; Ausrichtung macht die Schwelle anisotrop; Tunneleffekt und Kontaktwiderstand fügen eine Transportschicht hinzu, die die Perkolation nicht beschreibt.

Die richtige Antwort ist nicht, das Modell aufzugeben, sondern es für das zu nutzen, was es gut kann: die Skalierung der Schwelle mit dem Aspektverhältnis, die Unterscheidung von Überdeckung und Konnektivität und die Größenordnung des kritischen Anteils. Vorfaktor und Amplitude brauchen ein detaillierteres Modell, und die Messung sollte die Skalierung prüfen, nicht eine einzelne Zahl bestätigen.

## 17.8 Offene Fragen

Der exakte Wert von $\lambda_c$ für das Poisson-Scheibenmodell ist unbekannt. Er ist numerisch auf mehrere Stellen bekannt, und die Universalitätsklasse ist dieselbe wie die der Gitterperkolation in zwei Dimensionen, aber ein Beweis fehlt. Dasselbe gilt für die Schwelle anisotroper Partikel, polydisperser Mischungen und Systeme mit anziehenden Wechselwirkungen. Das sind keine exotischen Fragen: Sie entscheiden, ob eine Verbundwerkstoff-Formulierung oder ein Sensornetz funktioniert.
