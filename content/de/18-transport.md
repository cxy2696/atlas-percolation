---
id: 18-transport
part: Networks and applications
order: 18
title: Transport und Erstpassage
subtitle: Was Konnektivität nicht sagt, und wie man den Rest misst
reading: 14 Min
---

Konnektivität beantwortet eine Ja-Nein-Frage: Gibt es einen Pfad? Transport fragt, wie viel, wie schnell und mit welcher Streuung. Beides hängt zusammen, ist aber nicht austauschbar. Ein Cluster kann zusammenhängen und trotzdem schlecht leiten; ein zusammenhängendes Netz kann Ankunftszeiten haben, deren Verteilung so schwer ist, dass der Mittelwert als Zusammenfassung versagt. Dieses Kapitel nennt die Exponenten und das Messprotokoll, das beides trennt.

## 18.1 Leitfähigkeit

Man lege eine Einheitsspannung an ein Perkolationscluster und messe den Strom. Nahe $p_c$ verschwindet die effektive Leitfähigkeit wie
$$
\sigma(p)\sim(p-p_c)^{t}.
$$
Der Exponent $t$ ist nicht die Leitfähigkeit einer einzelnen Kante; er ist die makroskopische Antwort eines fraktalen Netzes mit Hängeenden, Engstellen und Schleifen. Die Standard-Skalenrelation lautet
$$
t=\nu(d-2+\zeta),
$$
wobei $\zeta$ der Widerstandsexponent ist, die anomalie Dimension, die beschreibt, wie der Widerstand mit dem euklidischen Abstand auf dem Cluster wächst. In zwei Dimensionen ist $t\approx1.299$ (Grassberger 1999), in drei Dimensionen $t\approx2.0$. In drei Dimensionen ist kein exakter Wert bekannt. Der zweidimensionale Wert ist numerisch, kein Satz der konformen Feldtheorie, und sollte mit seiner Unsicherheit zitiert werden.

Die naive Einstein-Relation setzt Leitfähigkeit mit einem Diffusionskoeffizienten gleich. Sie versagt bei $p_c$, weil die Irrfahrt auf dem Cluster anomal ist: Das mittlere Quadrat der Verschiebung wächst wie
$$
\langle r^2(t)\rangle\sim t^{2/d_w},\qquad d_w>2,
$$
mit einer Irrfahrtdimension $d_w$ größer als der Diffusionswert zwei. Die spektrale Dimension
$$
d_s=\frac{2d_f}{d_w}
$$
kontrolliert die Rückkehrwahrscheinlichkeit und die Zustandsdichte bei tiefen Frequenzen. In zwei Dimensionen ist $d_w\approx2.878$ und $d_s\approx1.318$, in drei Dimensionen $d_w\approx3.88$ und $d_s\approx1.30$. Die Zahlen sind numerisch; die Relation $d_s=2d_f/d_w$ ist eine Definition plus fraktale Geometrie, kein unabhängiger Satz.

## 18.2 Warum die Exponenten verschieden sind

Drei geometrische Merkmale trennen Transport und Konnektivität.

- **Hängeenden.** Ein großer Teil der Clustermasse hängt am leitenden Rückgrat und trägt keinen Strom. Das Rückgrat ist dünner als das Cluster, also ist die Leitfähigkeit niedriger, als eine naive Zählung der Plätze vermuten ließe.
- **Engstellen.** Der Strom muss durch schmale Hälse. Der Widerstand wird von den engsten Schnitten dominiert, nicht von der mittleren Breite.
- **Schleifen.** Eine Schleife bietet einen alternativen Pfad und senkt den Widerstand, fügt aber auch eine Längenskala hinzu, die die Irrfahrt erkunden muss. Das Zusammenspiel von Schleifen und Engstellen macht $\zeta$ nichttrivial.

Dieselben drei Merkmale erklären, warum Diffusionskoeffizient und Leitfähigkeit nicht proportional sind. Ein Irrläufer verbringt die meiste Zeit in Hängeenden, die keinen Strom tragen; der Strom nutzt das Rückgrat, das der Irrläufer selten besucht. Die Einstein-Relation wird erst wiederhergestellt, wenn die Irrfahrt über dasselbe Maß gemittelt wird wie der Strom — und das ist nicht das einfache Platzmaß.

## 18.3 Erstpassage

Die Erstpassagezeit von einer Quelle zu einem Ziel ist die zufällige Zeit, zu der ein Irrläufer das Ziel erstmals erreicht. Auf einem Perkolationscluster nahe $p_c$ ist ihre Verteilung breit. Der Mittelwert wird von seltenen langsamen Pfaden dominiert und ist oft eine schlechte Zusammenfassung; Quantile und die vollständige Verteilung sind aussagekräftiger.

Für eine eindimensionale Kette fällt die Erstpassagedichte für große $t$ wie $t^{-3/2}$, ein universeller Schwanz, der aus dem zentralen Grenzwertsatz der zugrunde liegenden Irrfahrt folgt. Auf einem Fraktal wird der Schwanz durch die Irrfahrtdimension und die spektrale Dimension modifiziert. Die praktische Konsequenz ist dieselbe: Nahe der Schwelle braucht ein kleiner Anteil der Trajektorien sehr lange, und eine Risikorechnung auf Basis der mittleren Ankunftszeit unterschätzt den Schwanz.

Das ist keine mathematische Kuriosität. Schadstofftransport in einem heterogenen Grundwasserleiter, die Zustellung von Nachrichten in einem verzögerungstoleranten Netz und die Suchzeit eines Nahrung suchenden Tieres zeigen nahe einer Konnektivitätsschwelle alle schwerverteilte Erstpassagezeiten. Die richtige technische Frage ist meist ein Quantil — „Wie groß ist die 95-Prozent-Ankunftszeit?“ —, nicht der Mittelwert.

## 18.4 Algorithmen

Drei Berechnungen decken die meisten Anwendungen ab.

**Kürzester Pfad.** Auf einem ungewichteten Graphen liefert die Breitensuche von der Quelle die Graphdistanz zu jedem Knoten in $O(n+m)$. Auf einem gewichteten Graphen kostet Dijkstras Algorithmus mit einem Binärheap $O((n+m)\log n)$. Der kürzeste Pfad ist nicht der Erstpassagepfad einer Irrfahrt, aber das richtige Objekt für Routing und für die „beste“ Ankunftszeit.

**Leitfähigkeit.** Man löse das Laplace-System mit Einheitsspannung an Quelle und Senke. Die effektive Leitfähigkeit ist der Strom. Direkte Löser kosten im schlechtesten Fall $O(n^3)$; dünnbesetzte Cholesky-Zerlegung, Mehrgitterverfahren oder ein konjugiertes Gradientenverfahren mit gutem Vorkonditionierer bringen große zwei- und dreidimensionale Systeme in Reichweite. Der Atlas liefert keinen Laplace-Löser; die Exponententabelle stammt aus der Literatur, und eine Produktionsrechnung braucht eine spezialisierte numerische Bibliothek.

**Irrfahrt.** Man simuliere viele unabhängige Irrläufer, notiere die Erstpassagezeit zum Ziel und berichte die empirische Verteilung mit ihren Quantilen. Die Kosten sind $O(\text{Irrläufer}\times\text{Schritte})$; die Varianz der Schätzung des Schwanzes wird von der Zahl der Irrläufer kontrolliert, die das Ziel tatsächlich erreichen, nicht von der Gesamtzahl der Schritte.

## 18.5 Anwendungen

**Leitfähigkeit von Verbundwerkstoffen.** Die Perkolationsschwelle bestimmt, wo der Sprung der Leitfähigkeit liegt; der Exponent $t$ bestimmt, wie steil er ist; der Kontaktwiderstand bestimmt die Amplitude. Eine Formulierung knapp oberhalb der Schwelle ist empfindlich gegen Chargenschwankungen, weil dort die Steigung am größten ist.

**Poröse Medien.** Die relative Permeabilitätskurve ist eine Transportobservable, keine Konnektivitätsobservable. Nahe der irreduziblen Sättigung ist die Wasserphase zusammenhängend, leitet aber schlecht; Exponent und Engstellen geometrie bestimmen die Form der Kurve.

**Epidemien und Netzwerke.** Die Ankunftszeit einer Epidemie oder einer Nachricht ist eine Erstpassageobservable. Die Riesenkomponente sagt, ob Ankunft möglich ist; der Schwanz sagt, wie lange es dauern kann. Die beiden Fragen brauchen verschiedene Modelle.

**Sensor- und Infrastrukturnetze.** Konnektivität ist notwendig für den Betrieb, aber nicht hinreichend für die Leistung. Latenz, Kapazität und Fehlerausbreitung sind Transportfragen, und ein zusammenhängendes Netz kann unter Last unbrauchbar sein.

## 18.6 Was zu berichten ist

Eine Transportmessung sollte den Exponenten, das Fit-Intervall, die Geometrie (Rückgrat oder vollständiges Cluster), die Randbedingungen und die Unsicherheit berichten. Wenn die Anwendung Zeit ernst nimmt, gehören auch die Erstpassagequantile dazu. Eine einzelne Leitfähigkeit bei einem Volumenanteil ist kein Perkolationsergebnis; sie ist ein Punkt auf einer Kurve, deren Form die eigentliche Vorhersage ist.

Der Unterschied zwischen Konnektivität und Transport ist das letzte Stück des wiederkehrenden Themas dieses Atlas. Die Perkolation liefert Schwelle und Skalierung mit bemerkenswerter Zuverlässigkeit. Amplituden und Dynamik liefert sie schlecht oder gar nicht. Eine Anwendung, die diese Arbeitsteilung respektiert, ist nützlich; eine, die eine Schwelle als Materialkonstante zitiert, ist es nicht.
