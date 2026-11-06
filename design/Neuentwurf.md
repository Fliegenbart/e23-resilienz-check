# e23 KI-Resilienz-Check – einfacher Check und neues Design

Stand: 6. November 2026. Gestaltung freigegeben: Der Nutzer wählt den dritten Entwurf als Grundlage für den gesamten Check.

## Auftrag und Entscheidung

Der Nutzer möchte die bisherige formularbasierte Anwendung durch eine wesentlich einfachere Bedienung ersetzen: anklickbare Skalen von 1 bis 10, einen Risikoscore am Ende und eine moderne Gestaltung mit Animationen. Als Referenz wurde EY genannt. Diese aktuelle Anweisung ersetzt für den neuen Quick-Check die frühere Vorgabe, keinen Gesamtscore auszugeben. Bestehende Bewertungen werden dabei nicht nachträglich umgerechnet.

Empfohlen wird ein geführter Check mit zwölf Fragen. Ein einziger Bildschirm mit allen Skalen wäre schneller überflogen, aber auf kleinen Bildschirmen unruhig. Ein dreistufiger Check mit wenigen sehr breiten Fragen würde zu viele unterschiedliche Risiken vermischen. Zwölf Einzelfragen bieten eine kurze, verständliche Bearbeitung und noch unterscheidbare Handlungsfelder.

## Visuelle Richtung

Referenzen wurden auf den Originalseiten angesehen:

- EY Deutschland: https://www.ey.com/de_de
- McKinsey: https://www.mckinsey.com

Übernommen werden Prinzipien: starke Typografie, große Bildflächen, deutlicher Kontrast, viel Raum, kurze Aussagen und klare Handlungsaufforderungen. Die Gestaltung bleibt ein eigener e23-Auftritt. Die Methode wird nicht als Methode einer dieser Beratungen ausgegeben.

Bildentwürfe: `01-einstieg.png`, `02-skala.png`, `03-ergebnis.png`. Die Bilder sind mit dem eingebauten Image-Gen-Werkzeug erzeugte Gestaltungsreferenzen; ihre Beispielzahlen sind keine realen Fallbewertungen.

Farben: Graphit #202024, Weiß #ffffff, Gelb #ffe600; ergänzend Grau für nachrangige Informationen. Überschriften sind groß und markant, Bedienelemente eindeutig. Für alle Ansichten gilt die helle Gestaltung des dritten Entwurfs: große schwarze Typografie auf Weiß, dunkler Kopfbereich und gelbe Akzente. Der Einstieg verwendet eine ruhige typografische Komposition; Fotografie aus dem ersten Entwurf ist nicht Teil der gewählten Richtung. Keine seitliche Verwaltungsnavigation, keine Formulartabellen und keine dekorative Kartenlandschaft.

## Bedienung

1. Einstieg: „Wie stark verändert KI Ihr Geschäft?“ mit „Check starten“.
2. Falltyp ausschließlich anklicken: bestehendes Angebot oder neue Idee. Kein Titel-, Kunden- oder Personenfeld. Der Check erhält automatisch einen Namen aus Typ und Datum.
3. Je Bildschirm eine Frage mit zehn ausreichend großen anklickbaren Punkten. Links und rechts stehen konkrete Anker. Nach Auswahl wird der gewählte Wert hervorgehoben; Weiter und Zurück bleiben eindeutig. Optional „Weiß ich noch nicht“.
4. Ergebnis: großer Risikoscore 0–100, vier Teilbereiche, bis zu drei konkrete Prioritäten sowie Antworten ansehen, PDF und JSON-Sicherung.

Die Auswahl wird fortlaufend lokal gespeichert. Beim Wiederöffnen lässt sich ein Entwurf fortsetzen. „Bisherige Checks“ öffnet eine reduzierte Liste; Verwaltung und Datensicherung dominieren nicht den Hauptablauf. JSON-Import bleibt über ein Datei-Auswahlfenster möglich; die Bedienung verlangt dabei keine Texteingaben.

Auf schmalen Bildschirmen werden die zehn Skalenpunkte in zwei Reihen mit je fünf Punkten angeordnet. Alle Bedienelemente funktionieren mit Tastatur; Auswahlzustände sind auch ohne Farbe erkennbar.

## Zwölf Fragen und ihre Anker

In allen Fragen bedeutet eine höhere Zahl mehr Risiko. Unbekannt ist ein eigener Zustand und keine Zahl.

| Bereich | Frage | 1 – niedriges Risiko | 10 – hohes Risiko |
| --- | --- | --- | --- |
| Kundenwert | Wie unsicher ist der Bedarf für Ihr Angebot? | Wiederkehrender Bedarf belegt | Bedarf bisher nur vermutet |
| Kundenwert | Wie stark ist die Zahlungsbereitschaft noch eine Annahme? | Bezahlte Aufträge oder Verlängerungen | Bisher kein Kaufnachweis |
| Kundenwert | Wie groß ist das Risiko, dass sich Ihr Angebot nicht rechnet? | Relevante Kosten und Erlöse belastbar | Zentrale wirtschaftliche Annahmen offen |
| Wettbewerb | Wie leicht kann KI Ihre bezahlte Kernleistung ersetzen? | Überwiegend Randaufgaben | Weitgehend gleichwertige Kernleistung |
| Wettbewerb | Wie leicht könnte eine Plattform Ihre Kernleistung mitliefern? | Kaum passende Bündelung erkennbar | Vergleichbare Funktion bereits verfügbar |
| Wettbewerb | Wie leicht könnten Kunden wechseln oder die Leistung selbst erbringen? | Konkrete erhebliche Wechselhürden | Brauchbare Alternative unmittelbar einsetzbar |
| Vorteile | Wie leicht lässt sich Ihr besonderer Kundennutzen nachbauen? | Schwer reproduzierbarer Vorsprung | Mit Standardmitteln leicht reproduzierbar |
| Vorteile | Wie ähnlich ist Ihr Ergebnis dem einer Standardlösung? | Relevanter zusätzlicher Nutzen gezeigt | Kein relevanter Unterschied erkennbar |
| Vorteile | Wie leicht erreicht ein neuer Wettbewerber Ihre Käufer? | Zugang nur schwer aufzubauen | Vergleichbarer Zugang unmittelbar verfügbar |
| Handlungsfähigkeit | Wie abhängig ist Ihre Kernleistung von einem KI-Anbieter? | Praktisch erprobte Ausweichmöglichkeit | Keine brauchbare Alternative |
| Handlungsfähigkeit | Wie groß ist das Risiko unbemerkter Qualitätsfehler? | Relevante Aufgaben wiederholbar geprüft | Relevante Fehler kaum geprüft |
| Handlungsfähigkeit | Wie schwer könnten Sie Ihr Angebot kurzfristig anpassen? | Ressourcen, Zuständigkeit und Plan vorhanden | Keine realistische Umsetzungsmöglichkeit |

Die Fragen bilden eine neue kurze Beratungsheuristik. Sie sind keine stillschweigende Neufassung der bisherigen zwanzig Fragen. Die vollständige bisherige Methode bleibt für historische Berichte erhalten.

## Score und Ergebnis

Methodenkennung: `quick-check-1.0`; eigene Kennzeichnung und eigenes Austauschformat gegenüber der bisherigen Analyse.

Bei zwölf numerisch beantworteten Fragen:

`Risikoscore = round(100 × Summe(Antwort − 1) / (12 × 9))`

Je Teilbereich gilt dieselbe Normierung mit drei Antworten. 1 entspricht 0, 10 entspricht 100. Alle zwölf Fragen haben das gleiche Gewicht. Die Einstufung verwendet gleich breite Orientierungsbänder: 0–24 niedrig, 25–49 mittel, 50–74 erhöht, 75–100 hoch. Diese Grenzen sind eine offene methodische Festlegung für diesen Quick-Check.

Ein leerer Check zeigt keinen Score. Fehlende oder unbekannte Antworten erzeugen keine rechnerische Entwarnung. Nach einem Durchgang mit offenen Antworten zeigt die Ergebnisseite die beantworteten Teilbereiche und die offenen Fragen; der Gesamtscore erscheint erst nach zwölf numerischen Einschätzungen. Eine Rückkehr zu offenen Fragen benötigt einen Klick.

Die drei höchsten Einzelwerte liefern priorisierte Prüfschritte. Ab Wert 7 werden sie als deutlicher Handlungsbedarf beschrieben. Bei ausschließlich niedrigen Werten lautet die Einordnung „Stärken erhalten und Annahmen regelmäßig prüfen“; es werden keine kritischen Mängel erfunden. Einzelwerte 9 oder 10 bleiben als kritische Punkte neben dem Gesamtscore sichtbar, damit eine einzelne starke Schwachstelle nicht im Durchschnitt verschwindet.

Die Oberfläche erklärt knapp: „Einschätzung auf Basis Ihrer Antworten“. „So wird der Score berechnet“ öffnet die Formel, Anker, Bänder und Methodeneinordnung. Der Score wird als Orientierung für die Beratung dargestellt, nicht als empirisch nachgewiesene Ausfall- oder Überlebenswahrscheinlichkeit. Es gibt keine wiederkehrenden Warnfenster.

## Bewegung

- Kurzer gestaffelter Einstieg von Überschrift, Erklärung und Hauptaktion.
- Dezente Bewegung der typografischen Einstiegselemente; kein ablenkender Bildwechsel.
- Fragenwechsel durch 200–350 ms lange Übergänge mit leichter Positionsänderung und Ausblendung.
- Animierte Auswahl eines Skalenpunkts und fließende Fortschrittslinie.
- Kurzes Hochzählen zum tatsächlichen Ergebnis und Animation der vier Balken.
- Unter `prefers-reduced-motion` entfallen räumliche Bewegungen und das Hochzählen; das Ergebnis bleibt sofort lesbar. Druck und PDF enthalten ausschließlich den endgültigen Zahlenstand.

Es gibt keine künstliche Wartezeit, die eine externe KI-Auswertung vortäuscht. Die Berechnung erfolgt lokal aus den Antworten.

## Daten und vorhandene Analysen

Neue Checks erhalten getrennte Typen, Methodenkonfiguration und Browserpersistenz. Die bestehende lokale Datenbank und ihre Einträge werden nicht überschrieben. Bestehende Analysen sind über einen untergeordneten Archivzugang lesbar und exportierbar. Historische Bewertungen bekommen keinen neuen Risikoscore und keine veränderten Fragetexte.

Der JSON-Import erkennt das jeweilige Format, validiert es vor Übernahme und behandelt ID-Kollisionen weiterhin ausdrücklich. Fehlerhafte Importe überschreiben keine Fälle. Speicherfehler bleiben sichtbar, der aktuelle Stand weiterhin exportierbar. Der PDF-Bericht der neuen Methode zeigt Score, Antworten, Anker, Prioritäten und Methodenversion.

## Technische Umsetzung und Abnahme nach Freigabe

Der vorhandene Stack React, TypeScript und Vite bleibt. Neue Quick-Check-Typen, Fragen, Scoreberechnung und Aktionen werden von der Oberfläche getrennt. Bestehende Regeln und Berichte bleiben für das Archiv verfügbar. Die Animationen können weitgehend mit CSS umgesetzt werden; eine zusätzliche Bibliothek wird nur verwendet, wenn sie tatsächlich benötigt wird. Für den Einstieg entsteht ein eigenständiges Bild ohne eingebrannten UI-Text; die eigentliche Anwendung verwendet echte HTML-Texte und Bedienelemente.

Geprüft werden: Eckwerte 0 und 100; korrekte Richtung sämtlicher Skalen; gleiche Gewichtung; fehlende/unbekannte Antworten; kritische Einzelwerte; Wiederaufnahme nach Neustart; JSON-Rundlauf; unveränderte historische Daten; sichtbare Speicherfehler; reale PDF-Ausgabe; Tastaturbedienung; Desktop-, Tablet- und schmale Ansicht; reduzierte Bewegung. Der neue Stand wird zunächst lokal geprüft und anschließend im bestehenden Repository und Vercel-Projekt veröffentlicht.
