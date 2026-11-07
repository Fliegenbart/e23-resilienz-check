# Expertenteam statt abstrakter KI-Fragen

**Freigegeben:** Der Nutzer hat das vorgeschlagene Gedankenexperiment samt konkreten Hürdenfragen mit „ja“ bestätigt. Umsetzung und Veröffentlichung erfolgen im bestehenden eigenständigen Projekt.

**Ziel:** Nutzer beurteilen nachvollziehbare Geschäftshürden, aus denen der Check sein Risikoprofil ableitet. Das angenommene Expertenteam ist ein Stresstest, keine Behauptung über heute gemessene KI-Fähigkeiten.

**Architektur:** Neue Methoden `quick-check-2.0` und `scenario-stress-2.0`. Unveränderte V1-Kataloge werden als JSON eingefroren. Import, Berechnung, Fragen, Maßnahmen und Druckbericht wählen stets den zum gespeicherten Stand gehörenden Katalog. Keine Übertragung alter Antworten auf neue Fragen. IndexedDB und JSON-Struktur bleiben bestehen.

**Annahme:** Zehn Weltklasseexperten des jeweiligen Fachgebiets arbeiten sechs Monate rund um die Uhr praktisch kostenlos an einer Alternative. Sie können recherchieren, entwickeln, testen und lernen. Keine geschenkten exklusiven Daten, Rechte, Beziehungen, Maschinen oder Zulassungen; kein automatisch fehlerfreies Ergebnis. Nobelpreisniveau ist ein Vergleich für das stärkere Szenario, keine allgemeine Ist-Zustandsaussage. Robotik bleibt eine gesonderte Annahme.

## Umsetzung

- [x] V1-Kataloge einfrieren. Regressionstests für gemischte V1/V2-Exporte, unveränderte alte Fragen/Maßnahmen/PDFs, Versionsmanipulation und Speicherung zuerst ausführen.
- [x] `model.ts`: konkrete neue Zwölf-Fragen-Methode; zentrale Auswahl aus gespeichertem Snapshot; beide Versionen streng validieren. Skalenrichtung und Formel bleiben gleich.
- [x] `ExpertIntro.tsx` und `expert-team.ts`: vorgeschaltetes Gedankenexperiment, wieder aufrufbare Kurzfassung und Annahmen für Bericht/Ergebnis. `QuickApp.tsx`, `Question.tsx`, `Results.tsx`, `History.tsx`, `Report.tsx` an Versionsauswahl anbinden.
- [x] `scenario-model.ts`: neue sechs Szenarien in Teams, Fähigkeiten und körperlicher Ausführung erklären. Kontrollierte Paare und Kostenformel bleiben erhalten. Vier konkrete Hürdenfragen und eine separate Chance; stärkere Denkfähigkeiten nicht als heutige Verfügbarkeit darstellen.
- [x] `ScenarioPage.tsx`, `ScenarioInterview.tsx`, `scenario-guidance.ts`, `ScenarioReport.tsx`: passende Begriffe, konkrete Skalenhilfen, versionstreue historische Ansicht. Kostenrechner separat als technische KI-Kostenrechnung kennzeichnen.
- [x] README und App-Version aktualisieren. Tests, Build, Import/Export, Speicherung, V1/V2-Druckinhalt sowie Desktop und 390px Mobilansicht prüfen.
- [ ] Änderungen committen, auf `flux` pushen, Vercel-Produktionsstatus und Alias bestätigen.

## Abnahme

- Neuer Check erklärt das Team vor Frage 1; keine Frage verlangt eine Einschätzung abstrakter KI-Fähigkeiten.
- Wettbewerb fragt nach Nachbau, Zugängen, Preiswechsel und Zugang zu Käufern; konkrete Endpunkte für 1 und 10 sowie sichtbare Beispiele.
- Keine neue Annahme verändert alte Fragen, Antworten, Handlungsempfehlungen oder Scores.
- Ein alter und ein neuer Check können gemeinsam gespeichert und exportiert werden; manipulierte Versionszuordnungen werden abgewiesen.
- „Weiß ich noch nicht“, gelbe Bestätigung und 450ms Weiterleitung funktionieren weiterhin.
- Szenarien trennen gleiche Fähigkeiten/günstiger, höhere Fähigkeiten und Robotik. Eine eigene Chance reduziert keinen Risikoscore.
- PDF enthält das jeweils bewertete Gedankenexperiment und den zugehörigen Fragenstand.

## Verifikation vor Veröffentlichung

83 Tests in 9 Dateien und Produktionsbuild erfolgreich. Im Browser: alle zwölf neuen Fragen durchlaufen (zwölfmal 5 ergibt 44), gelbe Bestätigung und automatische Weiterleitung geprüft; Szenario 3 mit physischen Leistungen und 6 Monaten zunächst mit unbekanntem Kundenzugang ohne Gesamtwert, danach mit Antworten 8/8/8/7 und Chance 9 ergibt Risiko 75 und separate Chance 9. JSON-Export und Import als Kopie sowie Neuladen erhalten die Werte. Ein vorhandener V1-Stand zeigt seine ursprüngliche Frage und bietet einen ausdrücklichen neuen Expertenteam-Check an. Desktop 1280px und Mobilansicht 390px ohne horizontales Überlaufen; keine relevanten Konsolenfehler. Tatsächlicher Browser-PDF-Export mit 8 A4-Seiten visuell geprüft; Gedankenexperiment, beide Methodenstände, alle Antworten und Scorewerte enthalten. Abnahmedateien liegen außerhalb des Repositorys. Die Veröffentlichung wird nach dem Push über Vercel geprüft.
