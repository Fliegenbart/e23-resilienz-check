# KI-Resilienz-Check

Vollständiger lokaler Beratungspilot auf Grundlage des Briefings 0.1 vom 6. November 2026. Eigenständiges Projekt außerhalb von ViralFlux.

Repository: https://github.com/Fliegenbart/e23-resilienz-check

## Veröffentlichung auf Vercel

Das Projekt enthält eine Vercel-Konfiguration für Vite. Installation: `npm ci --no-audit --no-fund`, Build: `npm run build`, Ausgabe: `dist`. Es sind keine Umgebungsvariablen oder API-Schlüssel erforderlich. Dokumentation und fiktive Musterdateien liegen im Repository; sie werden nicht in das Web-Bundle aufgenommen.

Die veröffentlichte Anwendung speichert Falldaten weiterhin ausschließlich im jeweiligen Browser. Daten aus der lokalen Adresse werden nicht automatisch auf die Vercel-Adresse übertragen; dafür einen JSON-Export anlegen und auf der veröffentlichten Seite wieder importieren.

## Start

Auf diesem Mac kann `Start.command` doppelt angeklickt werden. Alternativ im Projektordner:

```sh
npm ci
npm run dev
```

Dann **http://127.0.0.1:5178/** öffnen. Der Entwicklungsserver läuft bereits, solange die aktuelle Sitzung aktiv ist. Voraussetzungen: Node.js ab 22.12 und ein aktueller Browser mit IndexedDB. Die installierten Paketversionen stehen in `package-lock.json`.

Einmaliges Herunterladen der Entwicklungspakete benötigt Internet. Nach dem Laden arbeitet der Check ohne externe Dienste und ohne KI-Verbindung. Der lokale Server muss zum erneuten Öffnen erreichbar sein. Für einen lokalen optimierten Build:

```sh
npm run build
npm run preview -- --port 5178
```

Dafür den Entwicklungsserver vorher mit Ctrl+C beenden. Dieselbe Adresse und denselben Browser verwenden, damit vorhandene lokale Fälle wieder erscheinen.

## Ein erster Workshop

1. Einen Fall mit Titel, Typ und Entscheidungsfrage anlegen oder drei fiktive Beispiele laden.
2. Im Fallprofil Angebot, Käufer, Nutzer, Grenzen und Wertschöpfung erfassen.
3. In „Prüfung“ die zwanzig Fragen bearbeiten. Jede Gruppe hat ihre eigene Bewertungsrichtung; es gibt keine Punkte oder Gesamtnote.
4. In „Belege“ Quellen mit Referenz, Herkunft, Beobachtung und Geltungsbereich anlegen. Eine Person prüft die konkrete aktuelle Quelle.
5. Die Quelle einer Antwort zuordnen, „unterstützt“, „widerspricht“ oder „Kontext“ wählen und den Bezug erklären. Anschließend die aktuelle Antwort gesondert bestätigen. Die gewählte Belegstufe allein erzeugt keinen belegten Befund.
6. Bedrohungen erfassen und mögliche C-Vorteile mit ihrer Wirkung gegenüber genau dieser Bedrohung verknüpfen. Schutzwirkung hat eine eigene Prüfung.
7. Stressszenarien und gegebenenfalls das optionale proportionale Monatsmodell bearbeiten.
8. In „Entscheidung“ Hinweise prüfen, den Umgang mit ihnen dokumentieren und Empfehlung, Maßnahmen, Verantwortung und Termine festhalten.
9. Einen historischen Stand durch fachliche Durchsicht abschließen. Weitere Änderungen betreffen einen neuen Entwurf.
10. JSON sichern und den vollständigen Bericht als Markdown exportieren oder über „Drucken / PDF speichern“ ausgeben.

Eine neue Idee erhält zusätzlich das Szenario einer nicht bestätigten Zahlungsbereitschaft. Die positive KI-Perspektive und eigene Szenarien lassen sich ergänzen. Nichtanwendbarkeit benötigt eine Begründung. Offene Angaben bleiben ausdrücklich offen.

## Speicherung und Sicherung

Fälle liegen ausschließlich in IndexedDB dieses Browserprofils für die jeweilige Adresse. Der Speicherstatus wechselt erst nach erfolgreicher Transaktion auf „Gespeichert“. Bei Fehlern bleibt der aktuelle Entwurf im Arbeitsspeicher und als JSON exportierbar. Schließen Sie das Fenster bei einem Speicherfehler erst nach einer Sicherung.

**JSON regelmäßig sichern.** Das Löschen von Browserdaten, private Sitzungen und ein anderes Profil können den Zugriff auf lokale Fälle beenden. `localhost` und `127.0.0.1` sind unterschiedliche Speicherorte. Kundendaten werden nicht in URLs, Telemetrie, automatische Quellenabrufe oder externe KI-Dienste geschrieben. Links öffnen erst durch einen bewussten Klick.

Der Import prüft Dateien bis 5 MiB vollständig vor einer Übernahme. Die Vorschau zeigt Fälle und ID-Kollisionen. Standard ist eine Kopie mit neuer Fall-ID; Ersetzen muss ausdrücklich ausgewählt werden. Ein ungültiger Import verändert keine vorhandenen Fälle. Import und laufende Sicherung verwenden atomare IndexedDB-Transaktionen.

## Fachliche Nachvollziehbarkeit

- Zwanzig Fragen und sechzehn Regelfamilien, vollständig aus dem Briefing übernommen.
- Deterministische Auswertung mit explizitem Stichtag, ohne Modellaufrufe.
- Antwortzustand, inhaltlicher Anker, gewählte Belegstufe und tatsächlich aktuelle Belegqualifikation sind getrennt.
- Materielle Änderungen an Quellen oder Aussagen, neue Widersprüche und abgelaufene Prüffristen können frühere Bestätigungen nicht übernehmen.
- Ein C-Vorteil ist erst mit gesondert geprüftem Mechanismus als Schutz gegenüber einer Bedrohung belegt.
- Historische Stände enthalten Methode, Stichtag, Daten und Hinweise als eigenständige Kopien.
- Unbekannte Schemaversionen werden abgewiesen. Unbekannte Methoden bleiben ausschließlich lesbar; ohne Snapshot gibt es nur eine Rohansicht.
- Alle Beispielquellen sind synthetisch. Sie qualifizieren keine Aussagen in realen Fällen.

## Struktur

`src/domain` enthält Typen, Laufzeitvalidierung und Änderungsoperationen. `src/methodology` enthält den unveränderten Fragenkatalog und die Regelbeschreibungen in Version 0.1. `src/rules` ermittelt aktuelle Beleglage, Schutzwirkung und Hinweise. `src/scenarios`, `src/storage` und `src/import-export` kapseln Berechnung, lokale Persistenz und Austausch. `src/features` enthält die Bearbeitungsansichten; `src/fixtures` die fiktiven Beispiele.

Zusätzlich zum Zielmodell des Briefings enthalten Szenarien Verantwortliche, Termine, Prüfschritt sowie betroffene Kunden und Erlösbestandteile. Die Portfolioansicht hat eine manuell gesetzte Handlungspriorität.

## Prüfungen

```sh
npm test
npm run build
npm run examples
npm run test:browser
```

Der Browsertest benötigt einen laufenden lokalen Server. Auf diesem Mac verwendet er das vorhandene Google Chrome ausschließlich mit einem isolierten temporären Profil und fiktiven Daten. Für andere Systeme können `CHROMIUM_EXECUTABLE` und `QA_APP_URL` gesetzt werden. Es wird keine bestehende Browsersitzung verändert.

46 automatisierte Fach-, Import-, Persistenz-, Beispiel- und Rechentests sowie zwölf Browserabläufe sind geprüft. Einzelheiten und visuelle Kontrolle: `docs/Acceptance.md`. Der Browserlauf prüft auch sichtbare Speicherfehler, JSON-Rundlauf, historischen Abschluss, Tastaturbedienung und eine schmale Ansicht. Ergebnisse liegen unter `docs/qa/`.

Der Produktionsbuild gelingt. Rollup meldet zwei Hinweise zu Kommentaranmerkungen innerhalb der installierten Zod-Abhängigkeit und entfernt diese Kommentare. Sie betreffen keine Anwendungseingaben oder Tests.

## Musterdateien

- `examples/Beispielfaelle.json`: drei vollständig austauschbare, fiktive Fälle.
- `examples/Musterbericht.md`: vollständiger Markdown-Bericht.
- `examples/Musterbericht.html`: eigenständige lesbare Berichtsansicht.
- `examples/Musterbericht.pdf`: mit Chromium gedruckter, visuell geprüfter Musterbericht.

`npm run examples` erzeugt JSON, Markdown und HTML erneut; `npm run test:browser` prüft den Druck und erzeugt die PDF-Datei.

## Einordnung und Grenzen

Die Software unterstützt ein moderiertes Beratungsverfahren. Die Methodik ist ein zunächst zu erprobender eigener Entwurf, kein kalibriertes Prognosemodell und keine Zertifizierung. NIST und METR sind Kontextquellen aus dem Briefing; aktuelle reale Anbieterbehauptungen benötigen eigene datierte Belege.

Die erste Version hat keine Konten, Cloudbereitstellung, Echtzeit-Zusammenarbeit oder externe KI. Die lokale Historie ist nachvollziehbar, aber nicht manipulationssicher. Gleichzeitige Bearbeitung desselben Arbeitsbereichs in mehreren Fenstern wird nicht unterstützt. Die Browserabnahme erfolgte mit Chromium und im integrierten Browser; Safari und Firefox wurden nicht separat abgenommen.

Nächster fachlicher Schritt ist der gemeinsame Pilot an drei bis fünf unterschiedlich gelagerten Fällen mit David, Daniel und Stefan, wie im Briefing beschrieben.
