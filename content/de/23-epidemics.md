---
id: 23-epidemics
part: bridges
order: 23
title: Epidemien als Perkolation
subtitle: Endgröße, Herdenimmunität und wo die Abbildung endet
reading: 16 min
---

Eine SIR-Epidemie und die Kantenperkolation beantworten dieselbe Frage, wenn die Frage lautet, *wer jemals infiziert wird*. Die Abbildung ist exakt, wenn die infektiöse Periode konstant ist: Man behalte jede Kontaktkante mit Wahrscheinlichkeit $T=1-e^{-\beta\tau}$ bei, und die Menge der jemals Infizierten ist der offene Cluster des Ausgangsfalls. Variieren die infektiösen Perioden, so sind die Übertragungen von demselben Knoten korreliert; das exakte Objekt ist ein gerichtetes Epidemie-Perkolationsnetzwerk und kein unabhängiger Bond-Perkolationscluster. Die marginale Übertragungswahrscheinlichkeit legt weiterhin die Schwelle fest und liefert im Limes des Konfigurationsmodells die Endgrößen-Gleichung. Diese Unterscheidung macht die Rechnung nützlich: Sie sagt, welche Zahlen die Abbildung stützen kann und welche nicht. Über Peak und Zeitverlauf sagt sie nichts – und die meisten gescheiterten Anwendungen scheitern daran, dass sie das vergessen.

## 23.1 Die Abbildung, präzise formuliert

Betrachtet werde ein SIR-Prozess auf einem statischen Kontaktgraphen $G=(V,E)$ mit einem anfangs infektiösen Knoten. Jeder infektiöse Knoten $i$ hat eine infektiöse Periode $\tau_i$ und knüpft während dieser Zeit zu jedem empfänglichen Nachbarn Kontakte mit Rate $\beta$. Die Zahl der Übertragungen entlang einer Kante ist dann Poisson-verteilt mit Mittelwert $\beta\tau_i$ (sofern die Kontakte einen Poisson-Prozess bilden); die Kante überträgt also mit Wahrscheinlichkeit
$$
T_i=1-e^{-\beta\tau_i}.
$$
Sind die infektiösen Perioden unabhängig und identisch verteilt, so konditioniere man auf sie. Jede *gerichtete* Kante $i\to j$ ist mit Wahrscheinlichkeit $T_i$ unabhängig offen, und die Menge der jemals infizierten Knoten ist die Vorwärtskomponente des Ausgangsfalls in diesem gerichteten Zufallsgraphen.

Die Mittelung über die Perioden macht die Kanten **nicht** unabhängig. Alle Kanten von $i$ teilen $\tau_i$, also sind ihre Übertragungsereignisse korreliert; das exakte Objekt ist das halbgerichtete Epidemie-Perkolationsnetzwerk, dessen Vorwärtskomponente die Endgröße und dessen Rückwärtskomponente die Wahrscheinlichkeit liefert, dass ein gegebener Ausgangsfall einen Knoten infiziert (Kenah und Robins 2007). Auf einem Baum wird die Vorwärtskomponente weiterhin durch einen Verzweigungsprozess in zufälliger Umgebung beschrieben, aber nicht durch einen unabhängigen Bond-Perkolationscluster mit Beibehaltungswahrscheinlichkeit $T=\mathbb{E}[1-e^{-\beta\tau}]$.

Zwei Fälle reduzieren sich exakt auf das einfachere Bond-Bild. Ist $\tau$ konstant, so gilt $T_i=T=1-e^{-\beta\tau}$ für jeden Knoten, die gerichteten Kanten sind unabhängig, und die Vorwärtskomponente ist auf einem Baum ein unabhängiger Bond-Perkolationscluster. Ist die Gradverteilung Poisson, so lässt sich die Mittelung über $\tau$ in die erzeugende Funktion ziehen, weil $G_0(z)=G_1(z)=e^{c(z-1)}$; die Endgröße erfüllt wieder die skalare Gleichung mit $T=\mathbb{E}[1-e^{-\beta\tau}]$. Für eine allgemeine Gradverteilung und nicht-entartetes $\tau$ lautet die exakte Baumrekursion
$$
u=\mathbb{E}_\tau\Big[G_1\big(1-(1-e^{-\beta\tau})(1-u)\big)\Big],
\qquad
R_\infty=1-\mathbb{E}_\tau\Big[G_0\big(1-(1-e^{-\beta\tau})(1-u)\big)\Big];
$$
das Ersetzen der zufälligen Übertragungswahrscheinlichkeit durch $T$ in $G_1$ ist eine Näherung, keine Identität. Die Schwelle bleibt $R_0=T(\kappa-1)$, weil die mittlere Nachkommenzahl linear in $T$ ist.

Für eine konstante infektiöse Periode $\tau$ gilt $T=1-e^{-\beta\tau}$. Für ein Markov-SIR-Modell mit Genesungsrate $\gamma$ (mittlere infektiöse Periode $1/\gamma$) und Transmissionsrate $\beta$ ist $T=\beta/(\beta+\gamma)$ die marginale Übertragungswahrscheinlichkeit; unabhängige Kanten beschreibt sie nur im Fall konstanter Periode oder in der Poisson-Grad-Molekularfeldreduktion. Zeitliche und verhaltensbedingte Heterogenität verletzen bereits die Annahme statischer Kontakte; das ist ein separater Fehler, der in Abschnitt 23.5 behandelt wird.

Bei mehreren Ausgangsfällen ist die Endmenge die Vereinigung ihrer offenen Cluster. In einer großen Population mit verschwindendem Anfangsanteil ist die Endgröße die Riesenkomponente, sofern die Parameter superkritisch sind; nahe dem Schwellenwert spielt die Fluktuation des Anfangskeims eine Rolle.

## 23.2 Die Gleichung für die Endgröße

Man nehme das Konfigurationsmodell aus Kapitel 22 mit den erzeugenden Funktionen $G_0$ und $G_1$ der Grade. Die Lösung (22.9) der Kantenperkolation mit Beibehaltungswahrscheinlichkeit $T$ ist
$$
R_\infty=1-G_0\big(1-T+T u\big),\qquad
u=G_1\big(1-T+T u\big). \tag{23.1}
$$
Sie ist exakt, wenn $\tau$ konstant ist oder die Gradverteilung Poisson ist; für eine allgemeine Gradverteilung mit variablem $\tau$ ist sie die Molekularfeldnäherung, die die zufällige Übertragungswahrscheinlichkeit in $G_1$ durch ihren Mittelwert $T$ ersetzt. Die Herleitung folgt der Botschaftspassage: Ein Knoten entgeht der Infektion, wenn jeder Nachbar entweder nicht überträgt (Wahrscheinlichkeit $1-T$) oder auf einen Nachbarn überträgt, dessen eigener Zweig erlischt (Wahrscheinlichkeit $T u$). Die Riesenkomponente ist die Menge der Knoten, die nicht entkommen.

Für Poisson-Grade mit Mittelwert $c$ gilt $G_0=G_1=e^{c(x-1)}$, und (23.1) reduziert sich auf die skalare Gleichung
$$
R_\infty=1-e^{-R_0R_\infty},\qquad R_0=Tc. \tag{23.2}
$$
Die triviale Lösung $R_\infty=0$ existiert stets. Eine positive Lösung existiert genau dann, wenn $R_0>1$, und dann ist sie eindeutig. Dieselbe Bifurkation ist der Perkolationsschwellenwert aus Kapitel 22:
$$
R_0=T(\kappa-1),\qquad T_c=\frac{1}{\kappa-1}. \tag{23.3}
$$
Gleichung (23.3) ist der quantitative Gehalt der Aussage „Die Epidemieschwelle ist eine Perkolationsschwelle“. Sie ist im Limes des Konfigurationsmodells exakt; auf einem realen endlichen Netzwerk ist sie der führende Term einer Entwicklung nach $1/\langle k\rangle$.

**Durchgerechnete Werte.** Für $R_0=2$ liefert (23.2) $R_\infty=0.7968\ldots$, für $R_0=3$ $R_\infty=0.9405\ldots$ und für $R_0=1.5$ $R_\infty=0.5828\ldots$. Die Annäherung an $R_\infty=1$ ist langsam: Selbst bei $R_0=5$ bleiben noch etwa $0.7\%$ empfänglich. Dies sind arithmetische Konsequenzen der Molekularfeldgleichung, keine Schätzungen für einen bestimmten Erreger.

## 23.3 Herdenimmunität

Ein Anteil $v$ der Bevölkerung sei vor der Epidemie zufällig immunisiert. Im Konfigurationsmodell entfernt die Immunisierung Knoten samt allen ihren Kanten. Der Verzweigungsfaktor des verbleibenden Netzwerks wird mit $(1-v)$ multipliziert, die effektive Reproduktionszahl ist also
$$
R_{\text{eff}}=(1-v)R_0,
$$
und der Schwellenwert wird überschritten, wenn $R_{\text{eff}}=1$ gilt:
$$
v_c=1-\frac{1}{R_0}. \tag{23.4}
$$
Dieselbe Formel gilt für einen Impfstoff, der nach dem *Alles-oder-nichts*-Prinzip wirkt und die Wirksamkeit $e$ hat, wenn $v$ der Anteil der Geimpften ist (der geschützte Anteil beträgt $ve$), sowie für einen *durchlässigen* Impfstoff, der die Empfänglichkeit um $e$ senkt (der verbleibende Verzweigungsfaktor ist $1-ev$). In beiden Fällen
$$
v_c=\frac{1-1/R_0}{e}. \tag{23.5}
$$
Ein Impfstoff mit $e=0.9$ und $R_0=3$ verlangt daher $v_c=0.741$, nicht $0.667$. Die Wirksamkeit geht in die Molekularfeldrechnung linear ein; die tatsächliche Zuteilung hängt auch davon ab, wer geimpft wird, denn $R_0$ ist ein Mittel über eine heterogene Kontaktstruktur.

Tabelle 23.1 gibt die Zahlenwerte wieder, die sich aus (23.4) für verschiedene $R_0$ ergeben. Die Werte sind keine epidemiologischen Empfehlungen; sie geben an, was die Formel homogener Durchmischung sagt, und Kapitel 12 erklärt, warum die heterogene Korrektur groß ausfallen kann.

| $R_0$ | $v_c=1-1/R_0$ | $1-R_\infty$ bei auf $R_0$ abgestimmtem $T$ |
|---|---|---|
| 1.5 | 0.333 | 0.417 |
| 2.0 | 0.500 | 0.203 |
| 3.0 | 0.667 | 0.059 |
| 5.0 | 0.800 | 0.007 |
| 10.0 | 0.900 | $4.5\times10^{-5}$ |

Tabelle 23.1. Herdenimmunitätsanteile und der verbleibende empfängliche Anteil nach (23.2). Die zweite Spalte ist der Anteil, der immun sein muss, damit $R_{\text{eff}}$ auf eins sinkt; die dritte ist der Anteil, der der Infektion in der ungebremsten Epidemie beim selben $R_0$ entgeht.

**Gezielte Impfung.** Werden zuerst die Knoten mit dem höchsten Grad geimpft, so wird der Schwellenwert bei einem kleineren Anteil erreicht, und bei einer Gradverteilung mit schwerem Ende kann der Gewinn dramatisch sein: Die Knoten, die $\langle k^2\rangle$ dominieren, sind genau die, die entfernt werden. Die Molekularfeldrechnung bleibt dieselbe, sobald die verbleibende Gradverteilung festgelegt ist; geändert wird die Verteilung, nicht die Formel. Dies ist der Perkolationsgehalt des Rates, „die Hubs zu impfen“, und zugleich seine Grenze: Der Rat setzt voraus, dass das Kontaktnetzwerk gut genug bekannt ist, um die Hubs in eine Rangfolge zu bringen, und er reagiert empfindlich auf Fehler in dieser Rangfolge.

## 23.4 Heterogenität, Superspreading und die Grenzen der Reproduktionszahl

$R_0=T(\kappa-1)$ ist eine einzige Zahl, doch die Epidemie wird von der gesamten Nachkommenverteilung bestimmt. Zwei Populationen mit demselben $R_0$ können sehr unterschiedliche Endgrößen und sehr unterschiedliche Wahrscheinlichkeiten für einen großen Ausbruch haben, weil die Varianz der Nachkommenverteilung den Verzweigungsprozess steuert. Der extreme Fall ist eine Kontaktverteilung mit schwerem Ende: $\kappa$ kann groß, $T_c$ nahe null sein, und eine einzelne Einschleppung kann einen großen Ausbruch auslösen, selbst wenn die mittlere Zahl der Übertragungen bescheiden ist.

Die empirische Literatur zu Superspreading macht denselben Punkt von der anderen Seite. Die individuelle Variation der Infektiosität ist häufig überdispers, wobei ein kleiner Anteil der Fälle für einen großen Anteil der Übertragungen verantwortlich ist (Lloyd-Smith et al. 2005). In der Sprache der Perkolation ist die Nachkommenverteilung nicht Poisson-verteilt: Der Mittelwert ist $R_0$, doch Varianz und Verteilungsende bestimmen die Aussterbewahrscheinlichkeit und die Größe des größten Clusters. $R_0$ allein bestimmt keines von beiden. Praktisch folgt daraus, dass Maßnahmen, die die Varianz senken – etwa das Meiden überfüllter Innenraumveranstaltungen –, eine Wirkung haben können, die in keinem Verhältnis zu ihrer Wirkung auf den Mittelwert steht.

Hier wird auch der Vergleich mit der Gradverteilung quantitativ. Im Konfigurationsmodell ist die Nachkommenverteilung des Perkolationsprozesses größenverzerrt, und ihre Varianz ist durch $p_k$ festgelegt. Eine Kontaktverteilung mit schwerem Ende hat eine Nachkommenverteilung mit schwerem Ende, selbst wenn die Übertragung pro Kante ein einfacher Münzwurf ist. Die beiden Quellen der Überdispersion – Heterogenität der Kontakte und individuelle Infektiosität – sind verschieden, und ein einzelnes $R_0$ kann sie nicht unterscheiden. Variiert $\tau$, so ist die Übertragungszahl eines Knotens eine Mischung über $\tau$; selbst bei festem Grad ist ihre Varianz größer als die unabhängiger Kanten mit demselben Mittelwert – genau diese Korrelation lässt das einfache Bond-Bild weg.

## 23.5 Zeitliche Netzwerke: Wann die statische Abbildung versagt

Die Abbildung aus Abschnitt 23.1 setzt einen statischen Kontaktgraphen voraus: Eine Kante, die zu irgendeinem Zeitpunkt besteht, kann zu jedem späteren Zeitpunkt eine Übertragung tragen. Reale Kontakte sind zeitlich geordnet. Ein Pfad, der eine Kante zur Zeit $t_1$ und eine andere zur Zeit $t_2<t_1$ benutzt, ist kein gültiger Übertragungsweg, obwohl er im statischen Graphen ein Pfad ist.

Das richtige Objekt ist der *zeitlich geordnete* oder *temporale* Erreichbarkeitsgraph: $j$ ist von $i$ aus erreichbar, wenn es eine Folge von Kontakten mit nicht abnehmenden Zeiten gibt. Die Riesenkomponente des statischen Graphen ist eine obere Schranke für die in diesem Sinne erreichbare Menge, und die Schranke kann sehr locker sein, wenn die Kontaktfolge stoßartig ist (Holme und Saramäki 2012). Der Epidemieschwellenwert eines zeitlichen Netzwerks hängt daher von der Reihenfolge ab und nicht nur von der aggregierten Gradverteilung; Valdano et al. (2015) führen eine analytische Berechnung für eine Klasse zeitlicher Netzwerke durch.

Daraus folgen zwei praktische Regeln. Erstens ist eine statische Perkolationsrechnung ein *Idealfall* für die Ausbreitung: Sie erlaubt Übertragungswege, die die Uhr verbietet. Zweitens ist der Fehler keine kleine Korrektur endlicher Größe; er kann den Schwellenwert um einen Betrag verschieben, der mit dem Schwellenwert selbst vergleichbar ist. Lautet die Frage „Kann sich eine Epidemie dauerhaft halten?“, so ist die statische Antwort notwendig, aber nicht hinreichend.

## 23.6 Der Algorithmus und wie man ihn prüft

Die Endgröße ist ein Fixpunkt; der Algorithmus ist daher eine Fixpunktiteration, die im Intervall $[0,1]$ eingeschlossen bleibt:

```
solve_final_size(T, degree_pmf):
    u = 0
    repeat:
        u_new = G1(1 - T + T*u)
        if |u_new - u| < tol: break
        u = u_new
    return 1 - G0(1 - T + T*u)
```

Von $u=0$ aus ist die Iteration monoton wachsend und konvergiert gegen den kleinsten Fixpunkt, den physikalischen; von $u=1$ aus bleibt sie beim trivialen Fixpunkt $u=1$ stehen und würde eine Endgröße von null melden. Auf einem Baum sind diese Gleichungen exakt, wenn die infektiöse Periode konstant ist oder die Grade Poisson-verteilt sind; bei variablen Perioden sind sie die Molekularfeldnäherung an die Rekursion in zufälliger Umgebung aus Abschnitt 23.1. Im Konfigurationsmodell sind sie unter denselben Bedingungen im Limes exakt; auf einem gegebenen Graphen sind dieselben Gleichungen das Botschaftspassage-System (22.11). Die Bibliotheken stellen den Löser als `sirFinalSize` in C++, Julia, Python und JavaScript bereit, und die Tests vergleichen ihn mit dem analytischen Erdős–Rényi-Wert sowie mit einer direkten Perkolationsrechnung auf einem kleinen Graphen.

Eine stochastische Kontrolle lohnt sich einmal. Man simuliere den SIR-Prozess mit dem Gillespie-Algorithmus auf einem kleinen Graphen des Konfigurationsmodells, wiederhole das mit vielen Anfangskeimen und vergleiche die mittlere Endgröße mit (23.1). Der Mittelwert konvergiert nahe dem Schwellenwert langsam, wo die Verteilung bimodal ist: Die meisten Läufe erlöschen, wenige erreichen die Riesenkomponente. Wer nur den Mittelwert berichtet, verdeckt die Bimodalität; man gebe auch die Aussterbewahrscheinlichkeit und die Größenverteilung an.

## 23.7 Anwendungen und was das Modell nicht liefert

**Impfung im Kindesalter.** Für Masern wird die Basisreproduktionszahl üblicherweise im Bereich 12–18 geschätzt, was nach (23.4) $v_c$ zwischen $0.92$ und $0.94$ ergibt. Die Rechnung ist robust; die epidemiologische Aussage verlangt die Kontaktstruktur, die Impfstoffwirksamkeit und die tatsächlich erreichte Impfabdeckung. Anderson und May (1991) ist die Standardquelle für die Schätzungen und ihre Vorbehalte.

**Heterogene Kontaktnetzwerke.** In einem Netzwerk mit einer Gradverteilung mit schwerem Ende verlangt zufällige Immunisierung selbst bei bescheidenem mittlerem Grad einen Anteil nahe eins, während gezielte Immunisierung der Knoten hohen Grades deutlich billiger sein kann. Die Perkolationsrechnung liefert den Vergleich; das Kontaktnetzwerk liefert sie nicht.

**Zeitliche und verhaltensabhängige Netzwerke.** Die statische Abbildung ist eine Schranke, keine Schätzung. Sind die Kontakte geordnet, stoßartig oder reagieren sie auf die Epidemie, so ist der Schwellenwert eine Eigenschaft des zeitlichen Prozesses, und die statische Riesenkomponente kann stark in die Irre führen.

**Variable infektiöse Perioden.** Das Bild unabhängiger Kanten ist nur bei konstanter infektiöser Periode (oder in der Poisson-Grad-Molekularfeldreduktion) exakt. Für eine allgemeine Verteilung der infektiösen Periode und eine allgemeine Gradfolge verwendet man die Rekursion in zufälliger Umgebung aus Abschnitt 23.1 oder das Epidemie-Perkolationsnetzwerk; die Endgrößengleichung (23.1) ist dann eine Näherung.

**Was das Modell nicht liefert.** Es liefert weder Zeitpunkt noch Höhe des Peaks, weder die Wirkung von Isolation oder Behandlung noch das Nachlassen der Immunität, weder das Auftreten von Varianten noch die Verhaltensreaktion auf die Prävalenz. Dies sind dynamische Fragen, und die Perkolationsabbildung verwirft die Dynamik bewusst. Wenn es auf das Timing ankommt, ist der Stoff zu Erstpassagezeiten in Kapitel 18 der richtige Ausgangspunkt; Keeling und Rohani (2008) oder Kiss, Miller und Simon (2017) behandeln die Dynamik.

## 23.8 Eine Checkliste für die Berichterstattung

Bevor man eine perkolationsbasierte Epidemiezahl zitiert, beantworte man diese Fragen.

1. **Was ist der Graph?** Statisch, zeitlich, gewichtet, gerichtet oder ein Konfigurationsmodell? Die Antwort verändert den Schwellenwert.
2. **Was ist $T$?** Eine gemessene Transmissionswahrscheinlichkeit, ein angepasster Parameter oder eine Modellannahme? Man gebe an, welches davon zutrifft.
3. **Wie lautet die Gradverteilung?** $R_0$ genügt nicht; $\kappa$ und die Varianz der Nachkommenverteilung zählen.
4. **Ist die Population groß im Vergleich zur Korrelationslänge?** Nahe dem Schwellenwert sind Finite-Size-Effekte das Phänomen.
5. **Geht es um die Endgröße oder um die Zeit?** Die Perkolation beantwortet das Erste und nicht das Zweite.
6. **Ist der Impfstoff vom Alles-oder-nichts-Typ oder durchlässig?** Man verwende (23.5) und gebe die Wirksamkeit an.
7. **Ist das Kontaktnetzwerk bekannt oder angenommen?** Gezielte Zuteilung verlangt Wissen, das zufällige Zuteilung nicht benötigt.

Eine Zahl, die diese Fragen nicht beantworten kann, ist eine Rechenübung und keine epidemiologische Schätzung. Der Wert der Perkolationsabbildung besteht darin, dass sie die Arithmetik exakt und die Annahmen sichtbar macht; die Notwendigkeit, diese zu verteidigen, erspart sie einem nicht.
