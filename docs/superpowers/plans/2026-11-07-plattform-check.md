# Plattform-Check Implementation Plan

## Folgeauftrag: zwölf Fragen und neue Auswertung (0.6.0)

David hat die Umsetzung der Analyse seines eingefügten Textes bestätigt und die Veröffentlichung erneut beauftragt. Neue Methode 4.0 statt Umdeutung alter Antworten. Die folgende ältere Planung dokumentiert 3.x.

- [x] V3.1-Fragen und V3-Auswertung einschließlich Szenariotexten einfrieren; V1/V2/3.0 erhalten.
- [x] Genau zwölf kurze Fragen: digitaler Anteil, Kundenmittel, Plattform, heutige KI-Schwächen, eigene Daten, Netzwerk, reale Ausführung, Verantwortung, Wechselaufwand, Rechte, eigener KI-Nutzen, bezahlter KI-Vergleich.
- [x] Auswertung: drei Risiken (Q1/Q2, Q1/Q2/Q3, Q4), sechs Schutzfaktoren (Q5–Q10), eigener Nutzen (Q11), Belege (Q12). Keine Verrechnung und keine vermeintlichen Überlebensprozente aus dem Text übernehmen.
- [x] Beide Tempi und zwei Jahre erhalten; eigener Nutzen reagiert separat auf das Fähigkeitstempo. Günstigere KI überwindet keine Fähigkeitslücke.
- [x] Darstellung minimal halten, neue Befunde und versionierte Regeln gemeinsam für Bildschirm und Bericht verwenden.
- [x] TDD: 17 V4-Prüfungen zuerst fehlgeschlagen. Danach insgesamt 152 Tests in 14 Dateien bestanden, Build und Diff erfolgreich. Alter V3.1-Katalog, Regeln und Szenarien mit expliziten historischen Fixtures geprüft.
- [x] Browser: Beschreibung → zwölf Fragen (eine offen) → Ergebnis → Korrektur mit Tastatur → schnell/langsam → Reload/Wiederöffnung. Früheren V3.1-Check und Methodendialog geprüft. Desktop 1280, Mobil 390/320 px ohne Überbreite, Konsole leer. Belege `v4-frage-mobil.jpg`, `v4-ergebnis-desktop.jpg`, `v4-ergebnis-mobil.jpg`, `v4-ergebnis-schmal.jpg` außerhalb des Repositories. Native PDF-/Mikrofon-Grenzen gelten weiter.
- Veröffentlichung über `flux` ist autorisiert; READY und öffentliche URL nach dem Push prüfen.

## Ursprüngliche Planung (3.x)

**Goal:** Die bestätigte Leitfrage beantworten: Was können die KI-Anbieter übernehmen und was schützt das Geschäft?

**Architecture:** Neue, eigenständige Methode `quick-check-3.1` mit zwölf konkreten Fragen und drei regelbasierten Angriffswegen. Der erste Fragenstand 3.0 bleibt eingefroren. Vier mögliche Schutzfaktoren und zwei Belegfragen bleiben von den Angriffswegen getrennt. Bestehende Methoden, Szenarien, Speicherung und Exporte bleiben erhalten; V3 erhält keine historische Durchschnittsnote.

**Tech Stack:** Bestehendes React/TypeScript/Vite, IndexedDB, Vitest. Keine neue Abhängigkeit oder API.

Die Richtung wurde im Chat ausdrücklich bestätigt und zur Umsetzung freigegeben. Arbeit im vorhandenen sauberen Branch `codex/quick-check`. Die Gestaltung bleibt Weiß/Graphit/Gelb; eine Frage pro Ansicht, 1–10 oder unbekannt, automatische Weiterleitung mit gelber Bestätigung.

## Inhalt und Auswertung

Fragen Q1–Q3: digitale Leistung, Informationen in Kundensystemen, Ausführung in Kundenprogrammen. Q4–Q6: Nutzung vorhandener Plattformen, Zusammenführen vorhandener Informationen, Datenexport/Schnittstellen. Q7–Q9: exklusive Daten, reale Ausführung, notwendige besondere Zugänge. Q10–Q12: Abhängigkeit laufender Prozesse vom eigenen System, direkter Vergleich, bewusster Kauf trotz günstiger Alternative.

Angriffswege: digitale Arbeit übernehmen (Q1/Q2/Q3), im vorhandenen Paket mitliefern (Q1/Q2/Q4), Oberfläche umgehen (Q4/Q5/Q6). Alle erforderlichen Angaben ≥7: naheliegend; alle ≥4: teilweise möglich; ein Wert ≤3: Hürde sichtbar. Jede fehlende Angabe lässt den betreffenden Weg offen. Diese Regeln sind qualitative Gesprächsregeln, keine empirischen Wahrscheinlichkeiten.

Schutzfaktoren Q7–Q10: 1–3 kaum angegeben, 4–6 begrenzt, 7–10 deutlich angegeben, unbekannt offen. Vergleich Q11 und Kaufentscheidung Q12 werden zusätzlich ausgewiesen; sie bestätigen keinen einzelnen Schutzfaktor automatisch. Risiken und Vorteile werden niemals miteinander verrechnet.

Die Annahme: sehr leistungsfähige, nahezu unbegrenzt verfügbare digitale Agenten; Zugang nur zu freigegebenen Kundendaten und Programmen. Keine behauptete heutige Superintelligenz, kein Eintrittsdatum, keine automatische Robotik.

## Arbeitsschritte

- [x] Versionierungs-, Auswertungs- und Unbekannt-Tests zuerst ergänzen und fehlschlagen sehen (`npm test -- --pool=threads tests/provider.test.ts`).
- [x] `src/quick/provider-questions.ts`, `provider-analysis.ts`: neue Fragen, Annahmen, getrennte Angriffswege, Schutz, Belege und nächste Schritte. `model.ts`: V1/V2 bewahren, V3 registrieren, neue Checks direkt in Fragen, V3 ohne Gesamtscore.
- [x] `ProviderLanding.tsx`, `ProviderResults.tsx`, `ProviderReport.tsx`, `ProviderMethod.tsx`: verständlicher Einstieg, Ergebnis und gleicher Inhalt im Druck. `Question.tsx`: passende Anker, kurze Hilfe, positive Fragen. `QuickApp.tsx` und `History.tsx`: neue Ansichten, alter Verlauf korrekt, Szenarien nur in alten Checks.
- [x] `provider.css`: vorhandene Gestaltung mit klarer Text-Hierarchie, reduzierter Informationsmenge und responsiver Darstellung fortsetzen.
- [x] Bestehende Methoden-Tests an explizite historische Fixtures binden; neue UI-/Drucktests für dieselben Ergebnisse und Quellenabgrenzung ergänzen.
- [x] Vollständige Tests, TypeScript/Vite-Build und Diff-Prüfung. Browser: Einstieg → zwölf Antworten → Ergebnis → Antwort ändern → speichern/neuladen; unbekannte Antwort; Mobilansicht; JSON-Export und V2-Import. JSON-Rundlauf und gemeinsame Berichtsinhalte zusätzlich automatisiert geprüft. Einschränkung bei der nativen Druckprüfung siehe unten.
- [x] README und Übergabe auf den tatsächlich implementierten Stand bringen. Lokal prüfbar übergeben; keine Veröffentlichung ohne entsprechenden Auftrag.

## Abnahme am 7. November 2026

- `npm test -- --pool=threads`: **97 Tests in 10 Dateien bestanden**.
- `npm run build`: TypeScript und Vite erfolgreich. Nur bestehende, nicht blockierende Kommentarwarnungen aus Zod.
- `git diff --check`: sauber. Keine neuen Abhängigkeiten, kein Push und kein Deployment.
- Browser unter `http://127.0.0.1:5183/`: vollständiger neuer Durchlauf mit einer unbekannten Antwort, korrekte offene Übernahmewege, Korrektur direkt zurück zum vollständigen Ergebnis, Persistenz nach Neuladen, JSON-Download mit korrekter V3-Methode und Antworten.
- V2-Testdatei über echte Importvorschau als Kopie übernommen. Historie und Ergebnis behalten den erwarteten Score 8, V2-Annahme und Zukunftsszenarien. V1/V2-Rundläufe und Speicherung zusätzlich durch Regressionstests abgedeckt.
- Desktop und Mobilansicht 390 × 844 geprüft; bei Frage und Ergebnis keine horizontale Überbreite. Begründung mit Enter und Methodendialog mit Escape bedienbar. Keine Browser-Konsolenfehler.
- Bildschirm und Bericht verwenden dieselbe Auswertung und dieselben Befundkomponenten. Bericht enthält Annahmen, Antworten, Skalen, Regeln und Quellen. **Der native PDF-Druckdialog konnte im eingebetteten Browser nicht vollständig automatisiert geprüft werden**: Der Klick lief in einen CDP-Timeout; die native App-Oberfläche ist für Computer Use gesperrt. Keine vollständige visuelle PDF-Abnahme behaupten.
- Prüfbilder und synthetische JSON-Dateien liegen außerhalb des Repositories unter `/Users/davidwegener/.codex/visualizations/2026/11/07/01a1b6b5-160f-7b61-b7bf-6af52356cb5f/e23-plattform-check/`.

## Forschungsgrundlage

### Optionale Business-Beschreibung mit Diktat (0.5.1)

Auf Folgeauftrag vor dem Start ein kurzes freiwilliges Textfeld mit Mikrofon ergänzen, im Ergebnis bearbeitbar halten, mit dem Check speichern sowie in JSON und Druck übernehmen. Kontexttext verändert keine Antworten oder Bewertung. Keine weitere Pflichtfrage. Browser-Spracherkennung statt eigener KI-API; externe Verarbeitung durch den Browser-Sprachdienst am Feld benennen. Maximal 5.000 Zeichen, vorheriger Text bleibt erhalten. Start nur auf Klick; Stopp nimmt letzte Ergebnisse mit, Unmount bricht ab. Fehler und fehlende Browser-Unterstützung lassen Tippen weiter zu.

TDD: zuerst Speicherung, Feld, Druck und Diktat-Steuerung fehlgeschlagen; zusätzlich ein Fehler beim Erhalt vorhandener Absätze reproduziert und korrigiert. Danach **132 Tests in 13 Dateien bestanden**, TypeScript/Vite erfolgreich, Diff sauber. Gesamter Browserpfad mit synthetischer Business-Beschreibung durch zwölf Fragen bis zum Ergebnis, Textänderung und Wiederöffnung nach Reload geprüft. Browserdienst-Simulation prüft Sprachereignisse und Fehler; keine echte Mikrofonaufnahme auf dem Nutzergerät. Die bestehende Einschränkung der nativen PDF-Prüfung gilt weiterhin.

### Zwei-Jahres-Szenario im Ergebnis

David hat die vorgeschlagenen zwei unabhängigen Tempoeinstellungen ausdrücklich zur Umsetzung freigegeben: „KI wird besser“ / „KI wird günstiger“, jeweils langsam/mittel/schnell, fester Zeitraum zwei Jahre. Kein weiterer Fragebogen, keine neue Einstiegsseite. Die kompakte Darstellung ergänzt zwei kurze, antwortabhängige Auswirkungen; Standard mittel/mittel. Fähigkeiten beeinflussen den Übernahmehinweis, Kosten den Preis-/Bündelungshinweis. Grundbefunde, Schutz und Belegstatus bleiben unabhängig davon bestehen.

Das optionale `providerScenario` mit Version `provider-scenario-1.0` wird streng validiert, automatisch gespeichert und als JSON erhalten. Alte V3-Datensätze ohne Feld werden nicht verändert. Beide V3-Fragenstände sind unterstützt; historische V1/V2-Szenarien bleiben separat. Bildschirm und Bericht verwenden dieselbe Komponente. Die Annahmen sind qualitativ und ohne gemessene heutige Leistungsbasis; keine Eintrittstermine, Preisfaktoren oder Wahrscheinlichkeiten.

Tests zuerst rot: fehlendes Importfeld, fehlende Auswertung und fehlende Auswahl. Anschließend Schema, Auswertung, Steuerung und Druck integriert. Regressionen decken alle neun Kombinationen, unabhängige Achsen, offene Antworten, Hürden, alte V3-Fragenstände, JSON, IndexedDB und gleiche Druckinhalte ab.

Abnahme: **113 Tests in 11 Dateien bestanden**, TypeScript/Vite-Build und Diff-Prüfung erfolgreich. Browser auf der getrennten Test-Origin `http://localhost:5183/`: Beispiel → beide Tempi unabhängig ändern → per Pfeiltasten ändern → neu laden → gespeicherten Check wieder öffnen. Schnell/langsam blieb erhalten. Desktop 1280 px und Mobil 390/320 px geprüft; kein Überlauf, keine Konsolenfehler. Belege: `zwei-jahre-desktop.jpg`, `zwei-jahre-mobil.jpg`, `zwei-jahre-schmal.jpg` im bestehenden Prüfverzeichnis. Auswahl und identische Druckinhalte automatisiert geprüft; die oben dokumentierte Einschränkung beim nativen PDF-Dialog gilt weiter. Keine Veröffentlichung.

### Minimale Fragen und Ergebnisse

Auf weiteren Nutzerauftrag wurden alle neuen Fragen und Skalenanker gekürzt. Hilfen und Beispiele liegen unter „Details“, die Bereichsnavigation und der sichtbare Bedienhinweis sind entfallen. Die Ergebnisansicht zeigt nur Kernaussage, drei Übernahmen, vier mögliche Schutzfaktoren und bis zu drei Schritte. Begründungen, Antwortgrundlagen und Belege sind aufklappbar. Offene Antworten und fehlende Belege bleiben sichtbar. Im Druck sind die Details geöffnet.

Fragenstand `quick-check-3.1`; 3.0 bleibt mit Original-Snapshot importierbar und fortsetzbar. Beide nutzen dieselben Schwellen und keine Gesamtnote. Tests wurden zuerst für den Versionswechsel und erhaltene alte Entwürfe ergänzt; anschließend **98 Tests in 10 Dateien bestanden**, Build und Diff-Prüfung erfolgreich. Neuer kompletter Browserdurchlauf mit unbekannter Antwort, Korrektur per Tastatur, aufklappbaren Begründungen und Belegen; 1280, 390 und 320 px geprüft. Keine Konsolenfehler oder horizontale Überbreite. Der ursprüngliche Nutzerentwurf mit 3/12 bleibt erhalten. Belege: `kurze-frage-desktop.jpg`, `kurze-frage-mobil.jpg`, `kurzes-beispiel-ergebnis.jpg`, `kurzes-ergebnis-mobil.jpg`. Die oben dokumentierte Grenze der nativen PDF-Prüfung gilt weiterhin.

### Anschließende Textkorrektur

Auf ausdrücklichen Nutzerwunsch heißt der Einstieg jetzt „Wird ein KI-Gigant Ihr Business vernichten?“ mit „Was kann KI übernehmen? Was schützt Ihr Geschäft?“. Produktbezeichnung: Resilience-Assessment. Angebotsauswahl, langer Einleitungstext und drei Erklärungskästen entfernt. Ein Klick startet die erste Frage; gespeicherte neue Einträge heißen neutral „Assessment“. Ergebnisüberschriften und Begleittexte gekürzt. Fragen-Snapshots und Auswertungsregeln unverändert.

Erneut 97 Tests bestanden. Start → erste Frage im Browser auf separater Origin geprüft, Desktop 1280 und Mobil 390/320 px kontrolliert. Ein Überlauf der längeren Produktbezeichnung bei 320 px wurde behoben. Bestehender Nutzerentwurf mit 3/12 Antworten blieb erhalten. Belege: `minimal-start-desktop.jpg` und `minimal-start-mobil.jpg` im oben genannten Verzeichnis. Keine Veröffentlichung.

ARK Big Ideas 2026, S. 20/34: Tokenpreise bei bestimmter Benchmarkleistung, keine vollständigen Entwicklungskosten. S. 33: METR-Aufgabenhorizont, gemessen in menschlicher Bearbeitungszeit. S. 26–28: Agent als Zugangsschicht über bestehenden Systemen. S. 36: spezialisierte Anbieter neben Plattformen. Daraus abgeleitete Unternehmensszenarien sind unsere Hypothesen. ARK-Zukunftsprognosen werden nicht in einen Score übersetzt. Anbieterquellen zu Unternehmenskontext und Konnektoren werden in der Methodenerklärung verlinkt.
