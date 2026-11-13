---
id: 11-measurement
part: Networks and applications
order: 11
title: Eine Schwelle messen, ohne sich selbst zu täuschen
subtitle: Finite-Size-Skalierung, Newman–Ziff und die Arithmetik ehrlicher Fehlerbalken
reading: 16 min
---

Eine Schwelle ist keine Zahl, die sich aus einer einzelnen Kurve ablesen lässt. Jede endliche Stichprobe hat einen verschmierten Übergang, und diese Verschmierung ist kein Rauschen um eine feste Antwort: Es ist die Antwort, die sich mit der Systemgröße ändert. Dieses Kapitel legt ein Messprotokoll vor, das beides trennt, und erklärt, was der Benchmark in diesem Repository stützen kann und was nicht.

Das Protokoll ist bewusst konservativ. Es ist für jemanden geschrieben, der eine Zahl in einer Arbeit, einer Spezifikation oder einem Sicherheitsnachweis verteidigen muss, nicht für jemanden, der die schnellstmögliche Schätzung will.

## 11.1 Was geschätzt wird

Die Schwelle im unendlichen Volumen ist

$$
p_c=\inf\{p:\theta(p)>0\}.
$$

Eine Simulation hat endliches $L$ und beobachtet $\theta$ daher nie. Sie beobachtet stattdessen einen pseudokritischen Punkt $p_c(L)$, der durch eine Konvention definiert wird. Üblich sind:

- das $p$, bei dem die Durchgangswahrscheinlichkeit $\pi(p,L)$ gleich $1/2$ ist;
- das $p$, bei dem der Suszeptibilitäts-Proxy $\chi(p,L)$ maximal ist;
- der Kreuzungspunkt des Binder-Kumulanten $U_4=1-\langle S^4\rangle/(3\langle S^2\rangle^2)$ für zwei Größen;
- das $p$, bei dem der Anteil des größten Clusters $S_{\max}(p,L)$ einem festen Bruchteil der Box entspricht.

Jede Konvention hat eine andere Finite-Size-Korrektur. Auf dem Quadratgitter mit Bond-Perkolation hat die erste einen nützlichen Grenzwert: Die Dualität erzwingt $\pi(1/2,L)\to1/2$ für $L\to\infty$, aber die Werte bei endlichem $L$ sind nicht exakt $1/2$. Die im Protokoll verzeichneten Raten bei $L=32,64,128$ sind $0.5275$, $0.5375$ und $0.505$. Man benutzt den Trend oder eine Toleranz, die die Korrektur berücksichtigt, und behandelt den Grenzwert nicht als Identität pro Größe.

Die Unterschiede zwischen den Konventionen sind nicht kosmetisch. Gilt $p_c(L)=p_c+aL^{-1/\nu}(1+bL^{-\omega}+\cdots)$, so hängt der Koeffizient $a$ von der Observablen ab, $p_c$ und $\nu$ dagegen nicht. Zwei Konventionen, die bei $L=64$ um $10^{-2}$ voneinander abweichen, können nach der Extrapolation bis auf $10^{-4}$ übereinstimmen – oder einen Fehler aufdecken. Die Konvention zu nennen, gehört zur Angabe der Zahl.

## 11.2 Finite-Size-Skalierung als Prüfung, nicht als Dekoration

In der Nähe von $p_c$ lautet der Skalierungsansatz für eine Observable $A$

$$
A(p,L)=L^{y_A}\,\mathcal A\!\left((p-p_c)L^{1/\nu}\right)\left(1+cL^{-\omega}+\cdots\right),
$$

wobei $y_A$ die Skalierungsdimension von $A$ und $\omega$ der führende Korrekturexponent ist. Für die Durchgangswahrscheinlichkeit gilt $y_A=0$, die Kurven für verschiedene $L$ sollten sich also bei $p_c$ kreuzen und zusammenfallen, wenn man sie gegen $(p-p_c)L^{1/\nu}$ aufträgt. Für $S_{\max}$ ist $y_A=d_f$, für $\chi$ ist $y_A=\gamma/\nu$.

Ein Kollaps ist ein Indiz, kein Beweis. Er lässt sich erzeugen, indem man drei Parameter an das Rauschen anpasst, besonders wenn der Bereich von $L$ klein ist. Drei Vorkehrungen machen ihn aussagekräftig:

1. **Eine Größe zurückhalten.** Man passt im Bereich $L\le L_{\max}/2$ an und sagt $L_{\max}$ voraus. Ein Kollaps, der nur unter Einschluss der größten Größe funktioniert, ist eine Anpassung, keine Prüfung.
2. **Die Residuen zeigen.** Ein Diagramm der Residuen gegen die Skalierungsvariable legt einen Trend offen, den ein überlagertes Zusammenfallen verbirgt.
3. **Das Fenster angeben.** Der Wert von $\nu$, der den Kollaps minimiert, hängt vom verwendeten Bereich von $p$ ab. Der Bereich ist zu veröffentlichen; das Minimum allein genügt nicht.

Der Korrekturterm ist wichtig. Für $L=32$ bis $128$ auf dem Quadratgitter kann das Ignorieren von $L^{-\omega}$ einen extrapolierten Wert von $\nu$ um mehrere Prozent verschieben. Der Benchmark in diesem Repository verwendet Größen bis $128$ und berichtet das Fit-Fenster zusammen mit dem Ergebnis; er ist jedoch ein Lehrdatensatz, keine hochpräzise Messung.

## 11.3 Der Newman–Ziff-Durchlauf

Für die Bond-Perkolation gibt es einen Algorithmus, der die äußere Schleife über $p$ beseitigt. Man erzeugt eine zufällige Reihenfolge der $m$ Kanten. Dann fügt man die Kanten eine nach der anderen hinzu. Nach $k$ Kanten ist die Konfiguration eine Stichprobe aus der Bond-Perkolation bei $p=k/m$, doch die Stichproben zu verschiedenen $k$ sind konstruktionsbedingt stark korreliert.

Man führe eine Union-Find-Struktur und die Summe der quadrierten Clustergrößen mit. Verbindet eine Kante Cluster der Größen $a$ und $b$, wächst die Summe um $2ab$. Der größte Cluster und die Anzahl der Cluster werden in $O(1)$ aktualisiert. Der vollständige Durchlauf kostet $O(m\,\alpha(n))$, wobei $\alpha$ die inverse Ackermann-Funktion ist, und er liefert die gesamte Kurve $\{S_{\max}(k/m),\chi(k/m)\}_{k=0}^{m}$.

Zwei Warnungen. Erstens ist die Kurve aus einer Kantenreihenfolge ein einzelner Stichprobenpfad, kein Ensemblemittel; die sichtbare Glätte stammt aus der monotonen Konstruktion, nicht aus einer Mittelung. Zweitens sind die Stichproben bei benachbarten $p$ nahezu identisch, die effektive Zahl unabhängiger Konfigurationen ist also viel kleiner als die Zahl der aufgetragenen Punkte. Fehlerbalken, die so berechnet werden, als wäre jeder Punkt unabhängig, sind weit zu klein.

Der Algorithmus lässt sich auf die Site-Perkolation erweitern, indem man Plätze in zufälliger Reihenfolge hinzufügt: Eine Kante ist genau dann aktiv, wenn beide Endpunkte aufgetreten sind; die vier Bibliotheken implementieren dies als `newmanZiffSite` / `newman_ziff_site`. Der Platz-Sweep verbraucht eine Permutation der n Plätze, der Kanten-Sweep eine Permutation der m Kanten.

## 11.4 Unsicherheit, die eine Begutachtung übersteht

Drei Fehlerquellen werden üblicherweise vermengt.

**Statistischer Fehler.** Für einen Indikator wie ein Durchgangsereignis beträgt der Standardfehler bei $n$ unabhängigen Stichproben $\sqrt{\hat\pi(1-\hat\pi)/n}$. Bei $\hat\pi=1/2$ und $n=1600$ sind das $0.0125$ – mehr als die Unterschiede zwischen vielen veröffentlichten Schwellen. Bei einer Cluster-Observablen wird die Varianz von den größten Clustern dominiert; man verwende ein Bootstrap über Konfigurationen, keine Gauß-Formel.

**Finite-Size-Fehler.** Dieser ist eine Verzerrung, keine Varianz. Er wird geschätzt, indem man die Messung bei mehreren $L$ wiederholt und extrapoliert. Die Extrapolation ist nur so gut wie die angenommene Korrekturform. Man berichte mindestens zwei Fit-Formen und zeige, dass die Schlussfolgerung stabil ist, oder gebe die Streuung als Teil des Fehlers an.

**Systematischer Fehler.** Die Gittergeometrie, die Randbedingungen, die Definition eines durchspannenden Clusters, der Zufallszahlengenerator und die Art, wie Gleichstände aufgelöst werden, können die Antwort allesamt verschieben. Die sprachübergreifenden Paritätstests in diesem Repository existieren, weil die letzten beiden Punkte leicht falsch zu machen und schwer zu sehen sind.

Eine belastbare Aussage hat die Form „Wir erhalten $p_c=0.5927(3)$ aus Größen $L=64$–$512$, mit der Durchgangskonvention $\pi=1/2$, einem Fit-Fenster $p\in[0.58,0.60]$ und festgehaltenem Korrekturexponenten $\omega=1.5$.“ Eine Zahl ohne diese Angaben ist ein Gerücht.

## 11.5 Ein Protokoll

1. **Das Modell festlegen.** Gitter, Site- oder Bond-Perkolation, Randbedingungen und die Definition des Durchspannens. All das ist vor dem Blick auf die Daten schriftlich festzuhalten.
2. **An einem gelösten Fall kalibrieren.** Bond-Perkolation auf dem Quadratgitter bei $p=1/2$ muss eine mit $1/2$ verträgliche Durchgangsrate liefern, und jede Sprachimplementierung muss bei gleichem Seed exakt übereinstimmen.
3. **Zwei Observablen wählen.** Einen Indikator (Durchgang) und eine Cluster-Statistik ($S_{\max}$ oder $\chi$). Wenn sie sich bei $p_c(L)$ widersprechen, liegt ein Finite-Size-Problem oder ein Fehler vor.
4. **Genügend Stichproben verwenden.** Man beginnt mit $10^4$ Durchgangsstichproben pro Größe. Bei $\hat\pi=1/2$ ergibt das einen Standardfehler von etwa $0.5\%$; das Ziel sollte als Standardfehler formuliert werden, und die Stichprobe wird erhöht, bis er unter dem Effekt liegt, den man behaupten will.
5. **$L$ geometrisch durchfahren.** Mindestens vier Größen über einen Faktor acht. Ein Potenzgesetz, das an drei Punkte angepasst wird, ist eine Gerade durch drei Punkte.
6. **Mit Korrekturen fitten.** Man verwende den Ansatz aus Abschnitt 11.2, halte die größte Größe zurück und gebe das Fit-Fenster an.
7. **Residuen und Konventionen prüfen.** Ein Wechsel der Konvention sollte die Schätzung nach der Extrapolation um weniger als den angegebenen Fehler verschieben.
8. **Die Rohzählungen veröffentlichen.** Die Benchmark-Datei in diesem Repository speichert `n` und `hits` für jeden Punkt, sodass man die Rate neu berechnen kann, statt einer gezeichneten Kurve zu vertrauen.

## 11.6 Was der Benchmark in diesem Repository zeigt

`scripts/bench.cpp` ist ein eigenständiger C++20-Harness. Er nutzt den gemeinsamen xoshiro128**-Strom, dieselbe Kantenreihenfolge auf dem Gitter wie die Bibliotheken und schreibt Rohzählungen statt angepasster Werte. `scripts/analyse_bench.py` ergänzt die Cardy-Kurve, einen Kollaps-Fit und eine Einarm-Steigung und hält Seed und Erzeugungsdatum in `data/benchmarks.json` fest.

Der Benchmark soll die *Form* einer Finite-Size-Studie zeigen und nicht mit spezialisierter Hochpräzisionsarbeit konkurrieren. Das Durchgangsexperiment verwendet freie Ränder und $L\in\{32,64,128\}$; das Torus-Experiment verwendet $L\le128$; das Einarm-Experiment verwendet $L\le512$ und fittet nur $L\ge64$; das Cardy-Experiment verwendet ein $96\times H$-Rechteck mit $H/W$ von $0.25$ bis $4$. Der Kollaps-Fit in der Kopfzeile hält $\nu=4/3$ fest und fittet nur $p_c$; der freie Zwei-Parameter-Fit wird als Diagnose berichtet, weil er bei diesen Größen schlecht konditioniert ist. Jede Zeile trägt ihre eigene Stichprobenzahl. Die Datenansicht auf der Website liest dieselbe Datei; fehlt die Datei, sagt die Seite das, statt eine Kurve zu erfinden.

Die wichtige Prüfung ist nicht, ob der angepasste Wert von $p_c$ auf vier Nachkommastellen genau bei $0.5$ landet. Entscheidend ist, ob die Durchgangsrate bei $p=1/2$ dem Finite-Size-Trend gegen $1/2$ folgt, ob die Kurven mit $L$ schärfer werden und ob derselbe Seed in C++, Julia, Python und JavaScript dieselben ganzzahligen Zählwerte erzeugt. Das sind die Prüfungen, die die Fehler fangen, auf die es ankommt.

## 11.7 Fallstricke, in der Reihenfolge, in der sie gewöhnlich auftreten

| Fallstrick | Symptom | Abhilfe |
|---|---|---|
| Nur eine Gittergröße verwenden | Eine Schwelle, die aus $L=64$ auf vier Nachkommastellen angegeben wird | $L$ durchfahren; extrapolieren |
| Korrelierte Sweep-Punkte als unabhängig behandeln | Fehlerbalken, die wie $1/\sqrt{m}$ schrumpfen | Block-Bootstrap nach Kantenreihenfolge |
| Eine Gerade auf doppeltlogarithmischen Achsen anpassen | Ein Exponent, der mit dem Fenster wandert | Korrekturen einbeziehen; Residuen zeigen |
| $\pi=1/2$ auf einem beliebigen Gitter mit $p_c$ verwechseln | Eine verzerrte Schwelle, die präzise aussieht | Die korrekte Durchgangskonvention verwenden |
| Die falsche Durchspannungsdefinition verwenden | Eine Durchgangsrate, die mit der Literatur nicht vergleichbar ist | Die Randbögen und das Cluster-Kriterium angeben |
| Codes nur über den Mittelwert vergleichen | Ein Fehler, der sich im Mittel aufhebt | Ganzzahlige Zählwerte bei festem Seed vergleichen |
| Einen numerischen Exponenten als exakt angeben | Ein „Theorem“, das sich im nächsten Artikel ändert | Als exakt, numerisch oder vermutet kennzeichnen |

Die letzte Zeile ist ebenso eine redaktionelle Regel wie eine numerische. Der Atlas kennzeichnet exakte Ergebnisse mit ★ und versieht numerische Werte mit Quelle und Genauigkeit; Kapitel 14 verzeichnet die Korrekturen, die diese Politik erzwungen hat.
