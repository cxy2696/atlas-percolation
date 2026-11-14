---
id: 16-directed
part: extensions
order: 16
title: Gerichtete Perkolation: die Zeit als Richtung
subtitle: Kausalität, die DP-Vermutung und die zugehörigen Exponenten
reading: 14 Min
---

Die gewöhnliche Perkolation kennt keinen Zeitpfeil. Ein Pfad darf nach links, rechts, vorwärts oder rückwärts wandern; die einzige Bedingung ist Konnektivität. Die gerichtete Perkolation fügt eine Richtung hinzu: Eine offene Kante darf nur in einem Sinn durchlaufen werden. Die Änderung wirkt klein und ist es nicht. Sie entfernt Schleifen, ändert die Universalitätsklasse und liefert die robusteste Universalitätsklasse der nichtgleichgewichtigen statistischen Physik.

## 16.1 Das Modell

Man arbeite auf $\mathbb{Z}^d\times\mathbb{Z}_{\ge0}$. Für jeden Platz $x$ und jede der $d$ positiven Koordinatenrichtungen $e_i$ werde die gerichtete Kante $(x,t)\to(x+e_i,t+1)$ unabhängig mit Wahrscheinlichkeit $p$ als offen erklärt. Ein gerichteter Pfad ist eine Folge offener Kanten mit wachsender Zeit. Das gerichtete Cluster von $(x,t)$ ist die Menge der von dort erreichbaren Plätze.

Der Ordnungsparameter ist
$$
\theta(p)=\mathbb{P}_p\big(|C_{(0,0)}|=\infty\big),\qquad
p_c=\inf\{p:\theta(p)>0\}.
$$
Für $d=1$ ist das Gitter ein gekipptes Quadratgitter: eine Raumrichtung und eine Zeitrichtung, gewöhnlich $1+1$ geschrieben. Für $d=2$ ist es $2+1$. Das interaktive Labor benutzt den $1+1$-Fall: Ostkanten sind Raum, Südkanten sind Zeit.

Der erste strukturelle Unterschied zur gewöhnlichen Perkolation besteht darin, dass ein gerichtetes Cluster in der Zeit keine Schleife schließen kann. Ein gerichteter Pfad, der in dieselbe Zeitscheibe zurückkehrt, bräuchte eine rückwärts gerichtete Kante, und die gibt es nicht. Deshalb ist die Verzweigungsnäherung auf dem gerichteten Gitter quantitativ brauchbar, auf dem ungerichteten aber nicht: Der Stammbaum eines gerichteten Clusters hat keine Zyklen, die korrigiert werden müssten.

## 16.2 Molekularfeld, exakt gerechnet

Auf einem gerichteten Baum mit $d$ Vorwärtszweigen pro Platz sei $r$ die Wahrscheinlichkeit, dass ein zur Zeit $t$ erreichter Platz ein unendliches Vorwärtscluster besitzt. Seine $d$ Kinder sind unabhängig, jedes wird mit Wahrscheinlichkeit $p$ erreicht und besitzt dann mit Wahrscheinlichkeit $r$ ein unendliches Vorwärtscluster. Also
$$
r=1-(1-pr)^d .
$$
Die triviale Lösung $r=0$ existiert immer. Eine positive Lösung erscheint, wenn die rechte Seite bei $r=0$ eine Steigung größer als eins hat:
$$
\left.\frac{d}{dr}\big(1-(1-pr)^d\big)\right|_{r=0}=pd>1
\quad\Longleftrightarrow\quad
p_c=\frac1d .
$$
Für $p=p_c(1+\varepsilon)$ entwickle man $r$ bis zur zweiten Ordnung. Mit $s=pr$ gilt
$$
r=ds-\binom d2s^2+O(s^3)
\;\Longrightarrow\;
1=dp-\binom d2p^2r+O(r^2),
$$
also mit $dp=1+\varepsilon$
$$
r\sim\frac{2d}{d-1}\,\varepsilon,\qquad
\theta\sim dpr\sim\frac{2d}{d-1}\,\varepsilon .
$$
Damit ist $\beta=1$ im Molekularfeld. Die räumliche Korrelationslänge ist die Distanz, über die der Verzweigungsprozess seinen Startpunkt vergisst; eine Irrfahrt mit $d$ Möglichkeiten breitet sich diffus aus, also $\xi_\perp\sim\varepsilon^{-1/2}$ und $\nu_\perp=1/2$. Die zeitliche Korrelationslänge zählt Generationen, also $\xi_\parallel\sim\varepsilon^{-1}$ und $\nu_\parallel=1$. Der dynamische Exponent ist $z=\nu_\parallel/\nu_\perp=2$. Die obere kritische Dimension liegt bei $d_c=4$ Raumdimensionen; darüber gelten diese Molekularfeldwerte exakt, bei $d=4$ mit logarithmischen Korrekturen.

## 16.3 Die Exponenten

Man schreibe
$$
P_\infty\sim(p-p_c)^{\beta},\qquad
\xi_\perp\sim|p-p_c|^{-\nu_\perp},\qquad
\xi_\parallel\sim|p-p_c|^{-\nu_\parallel},\qquad
z=\frac{\nu_\parallel}{\nu_\perp}.
$$
Am kritischen Punkt fällt die Überlebenswahrscheinlichkeit wie
$$
P_s(t)\sim t^{-\delta},\qquad \delta=\frac{\beta}{\nu_\parallel},
$$
denn ein Cluster, das bis zur Zeit $t$ überlebt, ist mit Wahrscheinlichkeit $\sim t^{-\beta/\nu_\parallel}$ mit dem Ursprung verbunden. Das ist eine Skalenidentität, kein unabhängiger Exponent.

| Klasse | $\beta$ | $\nu_\perp$ | $\nu_\parallel$ | $z$ | Status |
|---|---|---|---|---|---|
| Molekularfeld ($d\ge4$) | 1 | $1/2$ | 1 | 2 | exakt |
| $1+1$ | 0.276486(8) | 1.096854(4) | 1.733847(6) | 1.5807 | numerisch |
| $2+1$ | 0.5836(6) | 0.7329(6) | 1.2950(5) | 1.767 | numerisch |

Die $1+1$-Werte sind aus langen Monte-Carlo-Läufen und Reihenextrapolationen auf etwa sieben Stellen bekannt, die $2+1$-Werte auf drei bis vier. Keiner davon ist ein Satz. Die Tabelle steht hier, weil der Kontrast zur gewöhnlichen Perkolation der Punkt ist: $\beta\approx0.276$ ist nicht $5/36\approx0.139$, und die beiden Übergänge gehören verschiedenen Universalitätsklassen an, obwohl beide auf einem Quadratgitter leben.

## 16.4 Die DP-Vermutung

Dass die gerichtete Perkolation über ihr eigenes Gitter hinaus Bedeutung hat, beruht auf einer Vermutung, nicht auf einem Satz.

**Vermutung 16.1 (Janssen 1981; Grassberger 1982).** Man betrachte einen stetigen Phasenübergang von einem absorbierenden Zustand in einen aktiven Zustand in einem System mit skalarem Ordnungsparameter, kurzreichweitigen Wechselwirkungen, ohne zusätzlichen Erhaltungssatz und ohne Quenched-Unordnung. Dann gehört der Übergang zur Universalitätsklasse der gerichteten Perkolation.

Die Bedingungen sind der Inhalt. Eine erhaltene Dichte, ein zweiter absorbierender Zustand, langreichweitige Wechselwirkungen, gequenchte Unordnung oder eine Kopplung an ein erhaltenes Feld können die Klasse ändern. Der Kontaktprozess, das Schlögl-Modell und eine Reihe von Reaktions-Diffusions-Systemen erfüllen die Bedingungen und reproduzieren die DP-Exponenten. Die experimentelle Bestätigung in turbulenten Flüssigkristallen (Takeuchi et al. 2007) ist der sauberste physikalische Fall.

Die Vermutung ist im Allgemeinen nicht bewiesen, und sie ist keine Erlaubnis, jeden Übergang mit absorbierendem Zustand DP zu nennen. Sie ist eine Prüfliste: den absorbierenden Zustand identifizieren, prüfen, dass der Ordnungsparameter skalar ist, prüfen, dass kein Erhaltungssatz überlebt, und prüfen, dass die Unordnung nicht gequencht ist. Ein Modell, das einen Punkt verletzt, kann trotzdem in der Klasse liegen, aber die Beweislast liegt dann beim Modell.

## 16.5 Simulation

Gerichtete Erreichbarkeit ist billiger als ungerichtete Konnektivität, weil die Zeitrichtung eine topologische Ordnung liefert. Auf einem $L\times L$-Quadrat mit Ost- und Südkanten verarbeitet man die Plätze in Zeilenordnung. Ein Platz ist erreichbar, wenn er besetzt ist (Site-Modus) oder wenn die Kante von seinem westlichen oder nördlichen Nachbarn offen ist und dieser Nachbar erreichbar ist (Bond-Modus). Die linke Spalte ist die Quelle. Ein Links-rechts-Durchgang existiert, wenn in der letzten Spalte ein erreichbarer Platz liegt.

Die dynamische Programmierung kostet $O(L^2)$, nachdem die Konfiguration gezogen wurde, und belegt $O(L^2)$ Speicher für die erreichbare Menge. Sie verbraucht $n$ Uniformen im Site-Modus und $m$ im Bond-Modus, in derselben Reihenfolge wie der ungerichtete Sampler; deshalb können die vier Bibliotheken dieselbe Paritätsprobe teilen. Die Referenzwerte für das $1+1$-Quadratgitter sind $p_c=0.644700(10)$ für Bond und $p_c=0.705489(4)$ für Site.

Die Finite-Size-Skalierung funktioniert wie im ungerichteten Fall, mit einem wichtigen Unterschied: Es gibt keine Dualitätsidentität, die die Durchgangswahrscheinlichkeit bei $p_c$ auf $1/2$ festlegt. Die Durchgangswahrscheinlichkeit bei $p_c$ strebt gegen eine universelle Konstante, die nicht $1/2$ ist, und die Annäherung ist langsam. Ein Code, der nur an der ungerichteten Quadratgitter-Identität kalibriert wurde, liefert daher eine verzerrte gerichtete Schwelle. Man benutzt den Kollaps, nicht den Einzelpunkt.

## 16.6 Woher die Richtung kommt

Gerichtete Perkolation ist das natürliche Modell, wenn die Reihenfolge der Ereignisse zählt.

- **Epidemien auf temporalen Netzwerken.** Ein Übertragungsweg muss die Zeit respektieren: Wer zur Zeit $t$ infiziert wird, kann nur Kontakte anstecken, die nach $t$ verfügbar sind. Die Riesenkomponente des statischen Netzwerks ist das falsche Objekt; der temporale Erreichbarkeitsgraph ist gerichtet.
- **Waldbrände und Invasionen.** Ein Feuer, das mit vorherrschendem Wind läuft, oder eine Art, die in neues Gebiet vordringt, hat eine bevorzugte Richtung. Die Front ist eine gerichtete Grenzfläche, und ihre Rauheit ist eine DP-Observable.
- **Gerichtete Polymere in ungeordneten Medien.** Ein Pfad durch eine zufällige Umgebung mit bevorzugter Richtung bildet ein gerichtetes Irrfahrtproblem; die Fluktuationen der freien Energie gehören zur Kardashev–Parisi–Zhang-Klasse, und die Verbindung zur DP kommt aus derselben gerichteten Geometrie, nicht aus einer Identität der Exponenten.
- **Dynamik mit absorbierendem Zustand.** Kontaktprozess, katalytische Reaktionen und Modelle vom Schlögl-Typ liegen unter den Bedingungen von Vermutung 16.1 in der DP-Klasse. Das ist die größte Anwendung: DP ist das Standardverhalten einer ganzen Familie nichtgleichgewichtiger Systeme.

Die Einheit ist real, aber bedingt. Ein Modell mit Erhaltungssatz, Symmetrie oder zweitem absorbierendem Zustand gehört nicht automatisch zur DP, und die DP-Exponenten sollten dafür nicht ohne Prüfung zitiert werden.

## 16.7 Was das Labor zeigt

Das gerichtete Labor zeichnet eine $1+1$-Bond- oder Site-Konfiguration in voller Auflösung, markiert die erreichbare Menge und meldet den Links-rechts-Durchgang. Die Regler sind dieselben wie im ungerichteten Gitterlabor, sodass sich beide direkt vergleichen lassen: Bei gleichem $p$ liegt das gerichtete Modell noch weit unter seiner Schwelle, wenn das ungerichtete bereits kritisch ist.

Das Labor misst nicht die Exponententabelle. Es zeigt die Geometrie, die die Exponenten plausibel macht: Ein gerichtetes Cluster ist ein baumartiges Objekt mit einer wohldefinierten Front, und die Front verbreitert sich, wenn $p$ gegen $p_c$ geht. Die Zahlen in der Tabelle stammen aus der Literatur, nicht aus dem Browser.
