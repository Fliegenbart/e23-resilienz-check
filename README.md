# e23 KI-Resilienz-Check

Ein einfacher Check für ein konkretes Angebot: zwölf Fragen per Klick auf einer Skala von 1 bis 10, danach ein Risikoprofil mit Gesamtscore, vier Teilbereichen und nächsten Schritten. Eigenständiges Projekt außerhalb von ViralFlux.

Anwendung: https://e23-resilienz-check.vercel.app

Repository: https://github.com/Fliegenbart/e23-resilienz-check

## Nutzung

1. Bestehendes Angebot oder neue Idee auswählen und starten.
2. Zwölf Einschätzungen anklicken. Nach jedem Wert und auch bei „Weiß ich noch nicht“ folgt automatisch die nächste Frage, nach der letzten das Ergebnis. Höhere Werte bedeuten immer mehr Risiko. Konkrete Anker erklären die Enden jeder Skala.
3. Das Ergebnis ansehen, einzelne Antworten bei Bedarf ändern und den Bericht über „Ergebnis als PDF“ drucken bzw. als PDF speichern.
4. Über „Bisherige Checks“ fortsetzen, JSON sichern oder eine Sicherung importieren.

Es gibt keine erforderlichen Texteingaben und keine Anmeldung. „Weiß ich noch nicht“ hält eine Frage offen. Ein Gesamtscore erscheint erst bei zwölf numerischen Antworten; offene Werte zählen niemals als niedriges Risiko. Einzelwerte von 9 oder 10 bleiben unabhängig vom Durchschnitt sichtbar.

## Methode

Version `quick-check-1.0`: Gesamtscore = gerundet `100 × Summe(Antwort − 1) / 108`. Alle zwölf Fragen haben das gleiche Gewicht; jeder Teilbereich enthält drei Fragen. Orientierung: 0–24 niedrig, 25–49 mittel, 50–74 erhöht, 75–100 hoch.

Der Score ist eine eigene Beratungsheuristik auf Basis einer Selbsteinschätzung, kein empirisch kalibriertes Prognosemodell und keine Ausfallwahrscheinlichkeit. Berechnung und Grenzen sind in der Anwendung und im Bericht erklärt. Fragen, Antworten und Methodensnapshot werden gemeinsam exportiert. Andere Methodenversionen werden nicht stillschweigend neu bewertet.

## Speicherung und Austausch

Die Anwendung speichert automatisch in IndexedDB im jeweiligen Browserprofil und unter der jeweiligen Adresse. Der Speicherstatus bestätigt abgeschlossene Transaktionen. Bei Speicherfehlern bleiben Eingaben im offenen Fenster und können als JSON gesichert werden. JSON regelmäßig sichern; Browserdaten können gelöscht werden. Gleichzeitiges Bearbeiten in mehreren Fenstern wird nicht unterstützt.

JSON-Importe bis 5 MiB werden vollständig geprüft und zunächst als Vorschau angezeigt. Standard ist eine zusätzliche Kopie; das Ersetzen gleicher IDs muss ausdrücklich gewählt werden. Fehlerhafte Dateien verändern vorhandene Checks nicht. Lokale und veröffentlichte Adressen haben getrennte Browserdaten. Zum Umzug JSON exportieren und am Ziel importieren.

Die bisherigen ausführlichen Analysen bleiben unter „Frühere Analysen“ lesbar und als Original-JSON exportierbar. Ihre Methodenversionen und historischen Berichte bleiben erhalten. Die neue Datenbank `e23-quick-check` ist unabhängig von `ki-resilienz-check`. Alte JSON-Sicherungen werden ins Archiv importiert und nicht in neue Scores umgerechnet.

## Lokal starten

Node.js ab 22.12 und ein aktueller Browser mit IndexedDB werden benötigt. Auf diesem Mac lässt sich `Start.command` doppelt anklicken. Alternativ:

```sh
npm ci
npm run dev
```

Adresse: http://127.0.0.1:5179/

```sh
npm test
npm run build
npm run preview -- --port 5180
```

Nach dem Laden benötigt der Check keine externe KI oder API-Verbindung. Es gibt keine Telemetrie, Cloud-Falldatenbank oder externen Schriften. Zum erneuten Öffnen muss der lokale Server bzw. die veröffentlichte Seite erreichbar sein.

## Projekt und Veröffentlichung

`src/quick` enthält die neue Methode, Ansichten, Speicherung und Druckgestaltung. Die bisherigen Fachmodule und Beispieldateien bleiben für das Archiv erhalten. `tests/quick.test.ts` und `tests/quick-storage.test.ts` prüfen Score, unbekannte Werte, Methodenversionen, Import und Speicherung. Die ursprünglichen Fachtests laufen weiterhin mit.

Das Design folgt dem freigegebenen dritten Entwurf in `design/03-ergebnis.png`: Weiß, Graphit, gelbe Akzente, klare Typografie und responsive Ansichten. Animationen berücksichtigen die Systemeinstellung für reduzierte Bewegung. Der Druckbericht verwendet immer den endgültigen Score.

Vercel: Vite, `npm ci --no-audit --no-fund`, `npm run build`, Ausgabe `dist`. Keine API-Schlüssel erforderlich. Der bestehende GitHub-Anschluss veröffentlicht Änderungen am Branch `flux` automatisch. Dokumentation, Beispieldateien und Designentwürfe werden nicht hochgeladen.

`docs/Acceptance.md` und `tests/browser-check.mjs` dokumentieren die ursprüngliche ausführliche Version; der alte Browserablauf ist kein Test des neuen Quick-Checks. Die aktuelle Abnahme steht in `docs/Quick-Check-Plan.md`.
