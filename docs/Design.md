# KI-Resilienz-Check – Umsetzungsentwurf

Stand: 6. November 2026. Zur Freigabe der Umsetzung.

Grundlage: Das vollständig gelesene Briefing `KI_Resilienz_Check_Briefing_Claude_Code.md`, Version 0.1, mit 1.199 Zeilen und 8.513 Wörtern. Der Entwurf konkretisiert die technische Umsetzung; die Fragen, Bewertungsanker und Regeln des Briefings bleiben die fachliche Grundlage.

## Ziel und Umfang

Eine eigenständige lokale Browseranwendung für den moderierten Beratungsworkshop. Ein Fall untersucht ein Angebot für eine Kundengruppe und führt von der Entscheidungsfrage über Belege und Szenarien zu einer menschlich verantworteten Empfehlung. Die Anwendung unterstützt mehrere Fälle, vollständige Sicherungen und unveränderte historische Berichte.

Das Projekt erhält einen eigenen Ordner `ki-resilienz-check` außerhalb des ViralFlux-Repositorys. Es verwendet keine ViralFlux-Daten, Server oder Modellverbindungen. Für die Umsetzung steht der separate Arbeitsbereich dieses Chats zur Verfügung. Eine spätere Verlagerung des Projektordners erfordert keine Änderung der Fachlogik.

Der Lieferumfang umfasst alle fünf Umsetzungsschritte und die Abnahme aus Abschnitt 13 des Briefings. Anmeldung, Cloudbetrieb, gemeinsame Echtzeitbearbeitung und externe KI gehören nicht dazu.

## Technische Entscheidung

Empfohlen wird React mit TypeScript und Vite, mit IndexedDB für die Falldaten und Laufzeitvalidierung für Importe. Die eigentliche Methode besteht aus versionierten Daten und reinen TypeScript-Funktionen. Benutzeroberfläche, Fachlogik, Persistenz und Berichte haben getrennte Zuständigkeiten.

Zwei Alternativen wurden berücksichtigt:

- Eine Anwendung ohne Framework hätte weniger Abhängigkeiten, würde die zahlreichen verknüpften Bearbeitungszustände und Formulare jedoch aufwendiger machen.
- Eine Serveranwendung wäre für spätere Zusammenarbeit geeignet, würde im Pilot zusätzliche Betriebs- und Zugriffsfragen erzeugen. Sie bietet für den vereinbarten lokalen Ablauf derzeit keinen notwendigen Mehrwert.

React, TypeScript und Vite entsprechen der Empfehlung des Briefings und ermöglichen die spätere Ergänzung einer Serverpersistenz hinter derselben Schnittstelle. Konkrete Paketversionen werden bei der Einrichtung geprüft und in einer Lockdatei festgehalten.

## Arbeitsoberfläche

Eine ruhige deutsche Oberfläche mit klar beschrifteten Eingaben, sichtbarem Tastaturfokus und zurückhaltender Typografie. Die Anwendung lädt keine externen Schriften oder Vorschauen. Bedeutung wird durch Text und Symbole vermittelt und nicht allein durch Farben.

Die Fallübersicht bietet Anlegen, Beispiel laden, Import und JSON-Sicherung. Eine Tabelle zeigt Alias, Titel, Falltyp, Empfehlung, Bearbeitungsstand, Bedrohung, belegten Vorteil, offene Frage und nächste Maßnahme. Filter und Sortierung entsprechen Abschnitt 8.4; eine Handlungspriorität wird ausschließlich manuell gesetzt.

Beim Anlegen werden nur Titel, Typ und Entscheidungsfrage verlangt. Weitere Profilangaben bleiben sichtbar offen. Innerhalb eines Falls führt eine Navigation zu:

1. Fallprofil und Wertschöpfung.
2. Prüfung mit den Gruppen A bis D.
3. Belegen und abweichenden Positionen.
4. Bedrohungen und Schutzwirkung.
5. Szenarien mit optionalem Finanzvergleich.
6. Entscheidung, Hinweisen und Maßnahmen.
7. Bericht und historischen Ständen.
8. Methode mit Fragen, Regeln und Grenzen.

Der Bericht bleibt jederzeit erreichbar und kennzeichnet vorläufige Ergebnisse. Die Kopfzeile zeigt Falltyp, Beispielstatus, Auswertungsstichtag und tatsächlichen Speicherstatus. JSON-Sicherung bleibt auch bei Speicherfehlern erreichbar. Schmale Bildschirme erhalten dieselben Kernfunktionen mit umgebrochener Navigation und zugänglichen Tabellen.

## Module und Zuständigkeiten

| Modul | Verantwortung |
| --- | --- |
| `domain` | Typen, Laufzeitvalidierung, Referenzprüfung, Änderungsoperationen und Konsistenzregeln. |
| `methodology` | Vollständige 20 Fragen, Anker, Hilfen, Nichtanwendbarkeit und die 16 Regelbeschreibungen in Version 0.1. |
| `rules` | Einheitliche Ermittlung der Beleglage, Konflikte, Schutzwirkung und deterministischen Hinweise. |
| `scenarios` | Vorlagen, qualitative Szenarien und der optionale Monatsvergleich. |
| `storage` | IndexedDB, geordnete Speicherung, Fehlerzustände, Wiederherstellung und historische Snapshots. |
| `import-export` | Vorschau, Versionsprüfung, Kopieren oder Ersetzen, JSON, Markdown und Berichtsdaten. |
| `features` | Die Bearbeitungsansichten und zugänglichen Formulare. |
| `fixtures` | Drei ausdrücklich fiktive Beispiele und getrennte Testdaten. |

Komponenten rufen dieselben Fachfunktionen auf wie Berichte und Tests. Regeltexte und IDs werden zentral gehalten. Importierte Methodensnapshots enthalten ausschließlich Daten; sie werden niemals ausgeführt.

## Bewertungs- und Beleglogik

Bewertungszustand, inhaltlicher Anker, gewählte Belegstufe und tatsächlich aktuelle Belegqualifikation bleiben getrennt. Eine unbekannte Antwort erfüllt keine Bedingung für eine niedrige Bewertung. Nichtanwendbarkeit ist nur bei den im Briefing zugelassenen Fragen und mit Begründung gültig.

Die gemeinsame Belegprüfung kontrolliert insbesondere:

- Bewertung, Begründung und gewählte Belegstufe.
- Unterstützende Quelle und erklärte Beziehung zur konkreten Aussage.
- Menschliche Prüfung der aktuellen Quellenversion und vollständige Prüfvermerke.
- Aktuelle Antwortversion und die Versionsbezüge aller herangezogenen Quellen.
- Fälligkeit zum ausdrücklich übergebenen Auswertungsstichtag.
- Offene Widersprüche und die Aktualität einer dokumentierten Konfliktauflösung.
- Die Kennzeichnung synthetischer Quellen und den Falltyp Beispiel oder realer Fall.

Ein aktueller C-Vorteil beweist noch keine Schutzwirkung. Für jede konkrete Bedrohung prüft eine gesonderte Funktion die Schutzverknüpfung mit Mechanismus, Quellen, Prüfer, Datum sowie aktuellen Antwort- und Bedrohungsversionen. Ein Freitext unterdrückt keinen Hinweis auf offene Schutzwirkung.

Fachlich relevante Änderungen erhöhen Versionsnummern und machen abhängige Prüfungen erneut erforderlich. Neue widersprechende Quellen werden bei jeder Auswertung berücksichtigt. Das Löschen einer Quelle zeigt vorher die betroffenen aktuellen Bewertungen an und bereinigt deren Verknüpfungen und Prüfungen. Historische Revisionen behalten ihre damaligen Quellen.

Jeder Hinweis erhält eine stabile ID aus Regel und beteiligten Objekt-IDs. Die Arten bleiben beobachteter Befund, Hypothese oder offene Information. Die Anwendung erzeugt weder einen Gesamtscore noch automatisch eine strategische Empfehlung.

## Szenarien und Wirtschaftlichkeit

Jeder Fall erhält die bearbeitbaren Vorlagen Bündelung, Branchenwettbewerber und Anbieterproblem. Neue Ideen erhalten zusätzlich die Perspektive ausbleibender Zahlungsbereitschaft. Die positive KI-Perspektive und eigene Szenarien stehen allen Fällen zur Verfügung. Nicht relevante Szenarien benötigen eine Begründung.

Szenarien speichern ihre Annahmen unabhängig von der tatsächlichen Ausgangslage. Sie enthalten Wirkungsweg, verbleibenden bezahlten Nutzen, Reaktion, Ressourcenbedarf, Frühindikator und Prüfschritt.

Der Finanzrechner verwendet genau die Formeln aus Abschnitt 7.4. Fehlende Werte bleiben fehlend. Das Ausgangsergebnis benötigt R, V und F; das Szenarioergebnis zusätzlich p, q, c und deltaF sowie die bestätigte Eignung des Modells. Einmalige Kosten bleiben separat. Negative Ergebnisse sind zulässig; negative Preis-, Mengen- und Kostenfaktoren sowie unzulässige Kostenwerte werden zurückgewiesen.

## Ergänzungen am Datenmodell

Die textlichen Anforderungen gehen an zwei Stellen über die beispielhaften Interfaces hinaus. Folgende Ergänzungen bilden diese bereits verlangten Funktionen ab:

- `Scenario`: nächster Prüfschritt, Verantwortlicher, Zieltermin sowie betroffene Kundengruppen und Erlösbestandteile.
- `AssessmentContent`: manuell gesetzte Handlungspriorität für die Portfolioansicht.

Ein Bewertungsdatum wird über den ausdrücklichen Auswertungsstichtag geführt. Die nächste Fallüberprüfung wird über die Entscheidung dokumentiert und ist auch bei noch offener Empfehlung bearbeitbar. Rollen der Beteiligten bleiben frei wählbar. Technische Zeitstempel erhalten eindeutige ISO-Werte; reine Termindaten werden als Kalenderdaten behandelt.

## Speicherung, Import und Historie

Der aktuelle Stand liegt während der Bearbeitung im Anwendungsspeicher. Änderungen werden geordnet in IndexedDB geschrieben. Die Anzeige „Gespeichert“ erscheint erst nach erfolgreicher Transaktion. Schlägt die Speicherung fehl, bleibt der aktuelle Stand für den JSON-Export verfügbar. Beim Start werden Leseprobleme angezeigt; vorhandene Daten werden nicht durch einen leeren Arbeitsbereich überschrieben.

Der JSON-Import hat ein Limit von 5 MiB ohne Anhänge und prüft vor jeder Übernahme Struktur, Werte, Versionen und sämtliche internen Referenzen. Die Vorschau benennt die enthaltenen Fälle und Kollisionen. Standard ist Import als Kopie. Ersetzen erfolgt nur über die ausdrückliche Auswahl des Nutzers. Die Übernahme aller ausgewählten Fälle erfolgt transaktional; ein fehlerhafter Import verändert keine vorhandenen Fälle.

Unbekannte zukünftige Schemaversionen werden zurückgewiesen. Bei unbekannter Methodenversion werden vorhandene Snapshots und gespeicherte Befunde ausschließlich lesend angezeigt. Ohne Methodensnapshot steht nur eine klar gekennzeichnete Rohansicht zur Verfügung. Es findet keine Neuberechnung mit aktuellen Fragen statt.

Der fachliche Abschluss erzeugt eine eigenständige tiefe Kopie von Methode, Stichtag, Inhalten und Hinweisen. Weiterbearbeitung öffnet einen neuen Entwurf. Frühere Revisionen werden weder aktualisiert noch aus aktuellen Quellen neu berechnet. Die lokale Historie wird als nachvollziehbar, nicht als manipulationssicher bezeichnet.

## Bericht und Entscheidung

Eine gemeinsame Berichtsdatenstruktur speist die Bildschirmansicht, den Markdown-Export und die Druckansicht. Der Managementteil fasst Untersuchungsgegenstand, Entscheidung, Bedrohung, belegte und offene Vorteile sowie die priorisierten nächsten Schritte zusammen. Danach folgt der vollständige Anhang einschließlich aller Fragen, Positionen, Quellen, Szenarien, Maßnahmen und Einschränkungen.

Die Berater formulieren die Kernaussagen oder übernehmen sichtbare Regeltexte. Die Empfehlung benötigt Begründung und mindestens einen nächsten Schritt; der Umgang mit relevanten Hinweisen wird dokumentiert. Fachliche Durchsicht beseitigt keine offenen Grundlagen.

Importierte Texte werden sicher als Text dargestellt. Quellenlinks öffnen ausschließlich zulässige Protokolle nach bewusstem Klick. Es gibt keine automatischen Quellenabrufe, Telemetrie oder externen KI-Aufrufe im Kernablauf. Die Druckansicht zeigt alle entscheidungsrelevanten Einschränkungen und ist für PDF-Ausgabe über den Browser ausgelegt.

## Umsetzung und Abnahme

Die Umsetzung folgt der Reihenfolge des Briefings:

1. Vollständige Methodenkonfiguration, Typen, Validierung und geprüfte reine Fachfunktionen.
2. Vollständige Bearbeitung eines ersten Falls mit Quellen, Positionen, Speicherung und Sicherung.
3. Bedrohungen, Schutzwirkung, Hinweise, Szenarien, Finanzvergleich und menschliche Entscheidung.
4. Berichte, unveränderte historische Stände, Portfolio, Import und fiktive Beispiele.
5. Fachliche und technische Abnahme, visuelle Kontrolle und Übergabe.

Die Tests sichern die konkreten Risiken aus Abschnitt 13 ab. Besondere Schwerpunkte sind leere und unbekannte Antworten, unbelegte Vorteile, negative Nachfrage unabhängig von KI-Exposition, wiedereröffnete Konflikte, ungültig gewordene Prüfungen, Schutzmechanismen und die Unveränderlichkeit historischer Berichte.

Zusätzlich werden der fiktive Finanzfall mit E0 = 25.000 EUR, E1 = 5.000 EUR und ΔE = −20.000 EUR, fehlerhafte und kollidierende Importe, zukünftige Versionen, vollständiger JSON-Rundlauf, Quelllöschung und sichtbare Speicherfehler geprüft. Der Browserdurchlauf umfasst einen vollständigen Fall, Wiederöffnen, Tastaturbedienung, schmale Ansicht und Druckbericht.

Die Übergabe enthält lauffähigen Code, Lockdatei, Startanleitung, Dokumentation zur Speicherung und Sicherung, die tatsächlich ausgeführten Prüfungen und einen exportierten fiktiven Musterbericht. Verbleibende Einschränkungen werden konkret benannt. Die methodische Erprobung mit David, Daniel und Stefan folgt auf die technische Abnahme und bleibt eine eigene Aufgabe.
