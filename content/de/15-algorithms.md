---
id: 15-algorithms
part: Methods
order: 15
title: Algorithmen: von einer Stichprobe zur ganzen Kurve
subtitle: Union-Find, Label-Propagation, Kanten-Sweeps und ihre Kosten
reading: 15 Min
---

Ein Perkolationsexperiment ist eine Folge endlicher Operationen, und die Wahl der Operation entscheidet, welche Fragen billig sind. Eine Konfiguration ziehen und ihre Cluster finden, die ganze Kopplungskurve durchlaufen und alle Konfigurationen eines schmalen Streifens aufzählen sind drei verschiedene Probleme. Dieses Kapitel nennt die Algorithmen, ihre Kosten und die Fehler, die überleben, wenn der Code schnell, der Schätzer aber falsch ist.

## 15.1 Die Grundoperation

Fast jeder Gitteralgorithmus lässt sich darauf zurückführen, Zusammenhangskomponenten unter Kanteneinfügungen zu pflegen. Man beginnt mit $n$ isolierten Plätzen. Jede offene Kante verbindet zwei Komponenten oder tut nichts. Eine Clusterstatistik ist eine Funktion der Komponentengrößen; die Datenstruktur muss daher nur zwei Fragen beantworten: *Welche Komponente enthält diesen Platz?* und *Wie groß ist sie?* Der Union-Find (DSU) beantwortet beide in amortisiert nahezu konstanter Zeit.

## 15.2 Union-Find

Jede Komponente wird durch einen gewurzelten Baum dargestellt. `find(x)` läuft zur Wurzel; `union(a,b)` hängt die kleinere Wurzel unter die größere. Zwei Optimierungen sind entscheidend.

- **Vereinigung nach Größe (oder Rang).** Die Tiefe eines Baumes ist höchstens $\lfloor\log_2 n\rfloor$, denn eine Wurzel der Größe $s$ wird nur an eine Wurzel der Größe mindestens $s$ gehängt.
- **Pfadkompression.** Jedes `find` verdrahtet die Knoten auf seinem Pfad direkt zur Wurzel. Ein Knoten, der einmal teuer war, ist danach billig.

Zusammen kosten $m$ Operationen auf $n$ Elementen $O(m\,\alpha(n))$, wobei $\alpha$ die inverse Ackermannfunktion ist; für jedes $n$, das in ein beobachtbares Universum passt, gilt $\alpha(n)\le4$ (Tarjan 1975). Pfadkompression allein liefert diese Schranke nicht, und Vereinigung nach Größe allein kostet $O(\log n)$ pro Operation. Die Kombination ist es, die die vier Bibliotheken implementieren.

```
find(x):
    r = x
    while parent[r] != r: r = parent[r]
    while parent[x] != r:
        next = parent[x]; parent[x] = r; x = next
    return r

union(a, b):
    ra = find(a); rb = find(b)
    if ra == rb: return false
    if size[ra] < size[rb]: swap(ra, rb)
    parent[rb] = ra
    size[ra] += size[rb]
    count -= 1
    max_size = max(max_size, size[ra])
    return true
```

`max_size` und `count` gehören nicht zum abstrakten DSU; sie werden gepflegt, weil jede Observable in diesem Atlas sie braucht.

## 15.3 Hoshen–Kopelman-Labeling

Der DSU ist der Motor, Hoshen–Kopelman ist der Scan, der ihn füttert (Hoshen und Kopelman 1976). Man besucht die Plätze in Zeilenordnung. Für jeden besetzten Platz betrachtet man die bereits besuchten Nachbarn (westlich und nördlich auf dem Quadratgitter). Ist keiner besetzt, wird ein neues Label vergeben. Gibt es genau ein Label, wird es kopiert. Gibt es zwei verschiedene, wird eines kopiert und beide werden in einer Äquivalenztabelle vereinigt.

Nach dem Scan zeigt jedes Label auf eine DSU-Wurzel, und die Clustergrößen ergeben sich in einem Durchlauf über die Labels. Die Kosten sind $O(n\,\alpha(n))$ für $n$ Plätze, der Speicher $O(n)$. Das Verfahren lässt sich auf jedes Gitter übertragen, sobald Nachbarliste und Scanordnung festliegen; auf dem Dreiecksgitter ist die Nachbarliste länger, aber jede Kante wird weiterhin genau einmal besucht, sodass sich die Komplexität nicht ändert.

Zwei Implementierungsdetails gehen leicht schief. Erstens muss die Äquivalenztabelle nach dem Scan komprimiert werden; ein Label, das in ein anderes überführt wurde, kann noch im Array stehen. Zweitens dürfen bei der Site-Perkolation leere Plätze gar kein Label bekommen, während bei der Bond-Perkolation jeder Platz vorhanden ist und nur offene Kanten vereinigt werden. Wer die beiden Konventionen mischt, erhält ein plausibles Clusterbild mit falscher Schwelle.

## 15.4 Leath-Wachstum

Hoshen–Kopelman berechnet alle Cluster in der Box; der Algorithmus von Leath berechnet ein Cluster, nämlich das mit einem gewählten Startplatz (Leath 1976). Der Startplatz kommt in eine Warteschlange und wird markiert. Man entnimmt einen Platz, betrachtet seine Nachbarn und reiht jeden offenen, noch unbesuchten Nachbarn ein. Ausgabe sind das Cluster und sein Rand; die Kosten sind proportional zur Zahl der tatsächlich berührten Plätze und Randkanten, nicht zum Volumen der Box.

Der Algorithmus ist exakt: Unter der Bedingung, dass der Startplatz besetzt ist, zieht er das Cluster des Startplatzes aus dem Perkolationsmaß, weil jeder offene Nachbar erkundet und jeder geschlossene als Rand notiert wird. Er ist das richtige Werkzeug, wenn das Cluster klein gegen die Box ist, und das falsche, wenn es die Box umschließt, weil die Erkundung dann ohnehin den größten Teil des Gitters berührt.

Leath-Wachstum liefert außerdem die Clustergrößenverteilung, ohne alle Cluster zu zählen. Man startet bei festem $p$ von vielen unabhängigen Startplätzen, notiert die Größe jedes Clusters und bricht bei Überschreiten einer Schwelle ab. Der Abbruch verzerrt den Schwanz; er ist zu berichten, nicht zu verstecken.

## 15.5 Der Newman–Ziff-Sweep

Eine Monte-Carlo-Studie, die über $p$ läuft, zieht bei jedem $p$ eine neue Konfiguration; zwei benachbarte Kurvenpunkte stammen daher aus verschiedenen Stichproben. Newman und Ziff (2000, 2001) entfernen die äußere Schleife. Man zieht eine zufällige Reihenfolge der $m$ Kanten und fügt sie nacheinander hinzu. Nach $k$ Kanten ist die offene Menge eine Stichprobe der Bond-Perkolation bei $p=k/m$; die Stichproben zu verschiedenen $k$ sind verschachtelt, nicht unabhängig.

Man pflegt den DSU, die Clusterzahl $n_c$, das größte Cluster $S_{\max}$ und das zweite Moment
$$
M_2=\sum_{C}|C|^2 .
$$
Anfangs ist $M_2=n$, ein Singleton pro Platz. Verbindet eine Kante zwei Komponenten der Größen $a$ und $b$, so gilt
$$
M_2\;\mapsto\;M_2+2ab,
$$
weil die Kreuzterme $2ab$ hinzukommen und die beiden alten Quadrate durch $(a+b)^2=a^2+2ab+b^2$ ersetzt werden. Bei der Bond-Perkolation ist jeder Platz vorhanden, also ist $M_2/n$ sowohl das zweite Moment pro Platz als auch die mittlere Clustergröße. Bei der Site-Perkolation ist der Nenner die Zahl der besetzten Plätze, nicht $n$.

Der ganze Sweep kostet $O(m\,\alpha(n))$ Zeit und $O(n+m)$ Speicher und liefert aus einer Kantenordnung die gesamte Kurve $S_{\max}(p)$, $\chi(p)$, $n_c(p)$. Der Preis ist die Korrelation: Der Punkt bei $k+1$ unterscheidet sich vom Punkt bei $k$ durch eine Kante, die effektive Zahl unabhängiger Stichproben ist also viel kleiner als die Zahl der gezeichneten Punkte. Fehlerbalken müssen durch Blockbildung über unabhängige Kantenordnungen gewonnen werden, nicht dadurch, dass man die $m$ Punkte als unabhängig behandelt.

## 15.6 Exakte Aufzählung und Transfermatrix

Für kleine Systeme ist die exakte Aufzählung konkurrenzfähig und liefert eine Prüfung, die keine Monte-Carlo-Rechnung liefern kann. Ein Streifen der Breite $w$ und Länge $L$ hat bei naiver Aufzählung $2^{O(wL)}$ Konfigurationen; die Transfermatrix reduziert das auf $O(L)$ Schritte über einen Zustandsraum, der exponentiell in $w$ wächst. Der Zustand speichert das Konnektivitätsmuster der offenen Plätze am aktuellen Schnitt, nicht die ganze Vorgeschichte. Jede neue Spalte wird mit ihrem Offen-/Geschlossen-Muster hinzugefügt, die Konnektivität wird aktualisiert, und am Ende liest man den Durchgangsindikator ab.

Die Transfermatrix ist für den Streifen exakt; durch Vergleich verschiedener Breiten extrahiert die Finite-Width-Skalierung $p_c$ und Exponenten. Die Kosten wachsen exponentiell mit $w$, auf einem Laptop sind daher nur Breiten von etwa zehn bis zwanzig erreichbar. Trotzdem ist das der Standardweg zu hochpräzisen Schwellen zweidimensionaler Streifen und zu exakten Prüfungen der Stern-Dreieck-Werte.

## 15.7 Was man wählt

| Aufgabe | Algorithmus | Kosten | Vorbehalt |
|---|---|---|---|
| Eine Konfiguration, alle Cluster | Hoshen–Kopelman | $O(n\,\alpha(n))$ | braucht einen vollen Label-Durchlauf |
| Ein Cluster, seltenes Ereignis | Leath-Wachstum | $O(|C|)$ | verzerrt bei Abbruch |
| Ganze Kurve $S_{\max}(p)$, $\chi(p)$ | Newman–Ziff | $O(m\,\alpha(n))$ | korrelierte Punkte |
| Exakte Streifenschwellen | Transfermatrix | exponentiell in der Breite | nur kleine Breiten |
| Gekoppelte Netzwerke | wiederholte Riesensuche | $O(r(n+m))$ | Rundenzahl $r$ datenabhängig |

Die ersten drei sind in allen vier Bibliotheken implementiert; die vierte ist ein Forschungswerkzeug und nicht Teil der Referenz-API. Die Paritätsproben in `data/golden/parity.json` vergleichen ganzzahlige Zählwerte bei festem Seed. Nur so lässt sich eine Abweichung in der Kantenordnung oder im Zufallsverbrauch erkennen, bevor sie zu einem falschen Exponenten wird.

## 15.9 Jenseits des Kerns: Bootstrap, explosiv und Invasion

Drei weitere Algorithmen sind in den Python- und JavaScript-Referenzbibliotheken implementiert und in den Laboren sichtbar. Sie beantworten andere Fragen und dürfen nicht mit dem Bernoulli-Sampler vermischt werden.

**Bootstrap-Perkolation.** Besetzte Plätze sind zur Zeit null aktiv; ein leerer Platz wird aktiv, wenn mindestens $r$ seiner Nachbarn aktiv sind. Das Update ist ein monotoner Abschluss, die Endmenge also der kleinste Fixpunkt und unabhängig von der Reihenfolge. Die Queue-Implementierung aktiviert jeden Platz in der ersten Runde, in der seine Zahl aktiver Nachbarn $r$ erreicht, in $O(n+m)$ Zeit. Für $r=2$ ist die Schwelle des unendlichen Gitters null, eine endliche Box füllt sich aber oberhalb eines von $L$ abhängigen Crossovers; für $r=3$ und $r=4$ ist die Schwelle positiv. Der Unterschied ist in Labor 10 sichtbar.

**Invasion-Perkolation.** Jede Kante trägt eine i.i.d. Schwelle. Von einem Seed aus akzeptiert der Cluster wiederholt die Randkante mit der kleinsten Schwelle, die zu einem unbesuchten Platz führt. Die akzeptierte Menge ist ein Spannbaum des überfluteten Gebiets; die gierige Regel ist die Definition des Prozesses, keine Näherung an Bernoulli-Perkolation. Ein Binärheap ergibt $O(m\log m)$ im schlechtesten Fall und $O(b\log b)$ in der Randgröße $b$. Kreiskanten werden verworfen; das Labor nennt das Kreisverwerfung, nicht die Trapping-Variante für verteidigende Cluster in porösen Medien.

**Achlioptas-Prozess.** In jedem Schritt werden zwei Kandidatenkanten gezogen; die Produkt- (oder Summen-) Regel behält die mit den kleineren Endkomponenten. Auf dem vollständigen Graphen verzögert das die Riesenkomponente und erzeugt einen scharfen Endlichkeitssprung. Der Sprung ist keine thermodynamische Unstetigkeit: Die Produktregel ist im Limes stetig, wie die Skalenprüfung in Labor 11 zeigt. Die Implementierung nutzt dieselbe DSU und berichtet die Trajektorie als exakte Funktion der Kandidatenfolge.

Die drei Algorithmen haben einen zweisprachigen Paritätsvertrag (Python und JavaScript), festgehalten in `data/golden/algorithms-v3.json`. Der viersprachige Vertrag deckt weiterhin den Bernoulli-Kern ab. Die Korrektheitsargumente stehen in Kapitel 19, die Instrumente sind die Labore 10–12.

## 15.8 Die Implementierungen lesen

Die JavaScript-Engine läuft im Browser; das Python-Paket ist die lesbare Referenz; die C++-Header sind der schnelle Pfad; das Julia-Paket ist der typisierte Pfad mit denselben öffentlichen Konventionen. Die Kantenordnung ist durch `build_lattice` festgelegt, der Zufallsstrom durch `docs/RNG.md`, der DSU durch den Pseudocode oben. Eine Änderung an einem der drei ist eine brechende Änderung: Goldwerte neu erzeugen, Version erhöhen und die Korrektur in Kapitel 14 festhalten.

Die Algorithmen dieses Kapitels sind auch der Grund, warum der Atlas überhaupt eine Live-Kurve im Browser zeigen kann. Ein $128\times128$-Gitter mit offenen Rändern hat 32 512 Kanten; ein Newman–Ziff-Sweep darüber sind einige Millionen DSU-Operationen, die sich bei blockweiser Ausführung bequem in ein Frame-Budget einpassen. Die Labore benutzen denselben Codepfad wie die Bibliotheken; es gibt keine separate „Demo“-Implementierung, die aus dem Takt geraten könnte.
