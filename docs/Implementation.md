# KI-Resilienz-Check Implementation Plan

Goal: Vollständiger lokaler Beratungspilot gemäß Briefing 0.1 und freigegebenem Entwurf.
Architecture: Versionierte Fachlogik, React-Oberfläche, IndexedDB, sichere JSON-Grenze. Keine Verbindung zu ViralFlux.
Tech Stack: TypeScript, React, Vite, Zod, Vitest, IndexedDB.

## 1. Fachliche Grundlage
- [x] Zieltypen aus docs/Briefing.md in src/domain/types.ts übernehmen; Szenario-Verantwortung/Termin und manuelle Priorität ergänzen.
- [x] Vollständige Fragen und Regeln in src/methodology/config.ts bzw. config.json erfassen.
- [x] tests/domain.test.ts zuerst ausführen: leere/unbekannte Antworten, aktuelle Belege, Konflikte und Änderungen müssen die im Briefing erwarteten Ergebnisse liefern.
- [x] src/domain/model.ts und src/rules/evaluate.ts implementieren. Schnittstellen: createAssessment(), updateAnswer(), updateEvidence(), evidenceStatus(), evaluate(assessment, evaluationAsOf).
- [x] npm test: leere Fälle liefern R14, unbelegte Austauschbarkeit Hypothese, aktuelle Quellen beobachtete Befunde; historische Stände unverändert.

## 2. Szenarien und Austausch
- [x] tests/finance.test.ts: verbindliches Beispiel, fehlende Werte, unter -100 %, negative Ergebnisse.
- [x] src/scenarios/finance.ts implementieren; Ausgangslage niemals ändern.
- [x] tests/exchange.test.ts: vollständiger JSON-Rundlauf, beschädigte/zu große Daten, unbekannte Versionen, Referenzen und Kopierimporte.
- [x] src/domain/schema.ts und src/import-export/exchange.ts implementieren. parseImport(text) validiert ohne Mutation; applyImport() übernimmt nach Vorschau.
- [x] tests/storage.test.ts mit fake-indexeddb: transaktionale Speicherung und Wiederherstellung.
- [x] src/storage/database.ts und src/import-export/report.ts implementieren.

## 3. Vollständiger Workshopablauf
- [x] src/App.tsx: Arbeitsbereich, Datenladen, geordnete Speicherung und Fehleranzeige.
- [x] src/features/Profile.tsx, Questions.tsx, Evidence.tsx, Threats.tsx: sämtliche Eingaben und Verknüpfungen.
- [x] src/features/Scenarios.tsx, Decision.tsx, Report.tsx, Portfolio.tsx: Szenarien, Hinweise, Empfehlung, Maßnahmen, Berichte und Importvorschau.
- [x] Gemeinsame Formelemente und Fokusführung in src/features/ui.tsx; responsive Stile in src/styles.css.
- [x] src/fixtures/examples.ts: drei zusätzliche fiktive Fälle; synthetische Quellen bleiben gekennzeichnet.

## 4. Abnahme und Übergabe
- [x] npm test und npm run build erfolgreich ausführen.
- [x] Browser: Fall anlegen, bearbeiten, speichern, neu laden, importieren/exportieren und Beispiel öffnen.
- [x] Desktop, schmale Ansicht und PDF-Druck visuell kontrollieren; Sicherheits- und Versionsfälle prüfen.
- [x] README.md, docs/Acceptance.md und examples/Musterbericht.md mit tatsächlichen Ergebnissen fertigstellen.

Alle Schritte werden in dieser Sitzung ausgeführt; die Freigabe zur vollständigen Umsetzung liegt vor.
