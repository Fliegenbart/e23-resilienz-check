# e23 Quick-Check Implementation Plan

Goal: Den freigegebenen dritten Entwurf als einfache helle Anwendung mit zwölf Klickfragen und Risikoscore umsetzen.
Architecture: Neue unabhängige Quick-Check-Methodik und IndexedDB, React-Ansichten für Einstieg, Fragen, Ergebnis und Historie. Frühere Daten und Berichte bleiben lesbar; kein neuer Score aus alten Bewertungen.
Tech Stack: React, TypeScript, Vite, CSS-Animationen und IndexedDB.

## 1. Methodik und Daten
- [x] tests/quick.test.ts zuerst auf fehlende Implementierung prüfen: zwölf Fragen, 1→0, 10→100, gleiche Gewichtung, unbekannt ohne Score, kritische Einzelwerte, valide Imports.
- [x] src/quick/model.ts: unabhängige Typen, versionierte Fragen, Score, Prioritäten und sicherer JSON-Austausch.
- [x] src/quick/storage.ts: eigene Datenbank e23-quick-check; geordnete Transaktionen und Fehlerweitergabe.
- [x] Fachtests und vorhandene Tests ausführen.

## 2. Bedienung und Gestaltung
- [x] src/quick/QuickApp.tsx: lokale Wiederaufnahme, Navigation, Importvorschau und Speicherung.
- [x] src/quick/Question.tsx: eine Frage, zehn Punkte, eigene Auswahl Unbekannt, Vor/Zurück und Bereichsfortschritt.
- [x] src/quick/Results.tsx: Score, Teilrisiken, kritische Punkte, drei Prioritäten, Antworten und Methodenhinweise.
- [x] src/quick/History.tsx und Legacy.tsx: einfache Historie und lesbarer Originalbericht ohne Umrechnung.
- [x] src/quick/styles.css: Weiß/Graphit/Gelb, präzise Typografie, sanfte Übergänge; Mobilansicht und reduzierte Bewegung.
- [x] src/main.tsx auf neue Anwendung umstellen; bisherige Fachlogik erhalten.

## 3. Bericht und Abnahme
- [x] src/quick/Report.tsx: vollständiger Druckbericht mit tatsächlichem Endscore, Antworten und Methodenversion; kein Animationszwischenstand.
- [x] Browser: Start → zwölf Antworten → Ergebnis → Wiederaufnahme → JSON-Rundlauf; Archivimport. Speicherfehler auf Persistenzebene getestet. PDF mit dem tatsächlichen React-Bericht und den Druckstilen gerendert.
- [x] Desktop (1280 px), Tablet (820 px), Mobil (390 px) visuell prüfen; Unterstützung reduzierter Bewegung in CSS und React prüfen.
- [x] npm test und npm run build ausführen; Startanleitung aktualisieren.

## 4. Veröffentlichung
- [ ] Alle Änderungen prüfen und auf dem vorhandenen Repository speichern.
- [ ] Standardbranch flux ohne Force-Push aktualisieren; Vercel-Git-Veröffentlichung bis READY verfolgen.
- [ ] Öffentliche Adresse und durchgeführte Prüfungen übergeben.

Freigegebene Gestaltung: design/03-ergebnis.png. Diese helle Gestaltungsrichtung gilt für den gesamten neuen Ablauf. Die dunklen Einstieg-/Fragenbilder sind verworfene Farbvarianten.


Abnahme 06.11.2026: 63 Tests bestanden; Produktionsbuild erfolgreich. Browserlauf mit fiktiven Angaben: Score 68, Teilwerte 41/81/63/85; zwölf Antworten sichtbar; Neuladen und Wiederaufnahme an Frage 10; JSON-Download, Kopie, ausdrückliches Ersetzen, ungültiger Import ohne Änderung, unbekannte Antwort ohne Gesamtscore, drei frühere Analysen im Archiv. Frischer Browserlauf ohne Konsolenfehler. Zwei responsive Überlappungen korrigiert und erneut angesehen.

PDF: tatsächliche exportierte Antworten durch `QuickReport` und originale Druckstile gerendert, alle fünf A4-Seiten visuell geprüft. Endscore 68, alle zwölf Antworten und Methodenversion vorhanden. Der native Druckdialog im integrierten Browser war für die Automatisierung nicht bedienbar; deshalb erfolgte die PDF-Renderingprüfung mit dem installierten Chrome. Safari/Firefox und die Systemeinstellung für reduzierte Bewegung wurden nicht separat interaktiv geprüft.
