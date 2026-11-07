# e23 Resilience-Assessment

**Wird ein KI-Gigant Ihr Business vernichten?**

Das Resilience-Assessment beantwortet diese Frage mit zwölf konkreten Einschätzungen. Das Ergebnis zeigt, welche Teile eine KI-Plattform übernehmen könnte, welche eigenen Vorteile bleiben und was davon bereits durch Vergleiche oder Kaufentscheidungen gestützt ist. Eigenständiges Projekt außerhalb von ViralFlux.

Repository: https://github.com/Fliegenbart/e23-resilienz-check

Produktionsadresse: https://e23-resilienz-check.vercel.app. Anwendungsversion **0.5.1** ergänzt eine freiwillige Business-Beschreibung mit Diktierfunktion zum vereinfachten Plattform-Check und den beiden Tempoeinstellungen für die nächsten zwei Jahre.

## Nutzung

1. Optional das Business kurz beschreiben – tippen oder „Diktieren“ verwenden. Dann „Assessment starten“ anklicken. Die erste Frage erscheint direkt, ohne Auswahl zwischen bestehendem Angebot und neuer Idee.
2. Zwölf kurze Fragen beantworten: eine Frage pro Ansicht, Werte von 1 bis 10 oder „Weiß ich nicht“. Nach kurzer gelber Bestätigung folgt automatisch die nächste Frage. Hilfen und Beispiele stehen unter „Details“.
3. Das kompakte Ergebnis lesen: mögliche Übernahme, Schutz und nächste Schritte. Unter „Nächste 2 Jahre“ unabhängig einstellen, wie schnell KI besser und günstiger wird: langsam, mittel oder schnell. Voreinstellung: mittel/mittel. Zwei kurze Hinweise reagieren direkt. Begründungen und Belege sind aufklappbar; Antworten lassen sich korrigieren.
4. Den Check über „Bisherige Checks“ wieder öffnen, als JSON sichern oder importieren. „Ergebnis als PDF“ öffnet die Druckfunktion des Browsers.

Keine Anmeldung und keine erforderlichen Texteingaben. Die Daten bleiben im jeweiligen Browser. Eine hohe Zahl ist nicht pauschal gut oder schlecht: Die ersten Fragen beschreiben den möglichen Zugriff der Plattform, die späteren eigene Vorteile und Belege.

Die Beschreibung wird beim Start mit dem Check gespeichert und ist im Ergebnis unter „Ihr Business“ bearbeitbar. Sie erscheint auch in JSON und Druckbericht. Sie hält den Kontext fest; die Bewertung basiert weiterhin auf den zwölf Antworten. Maximal 5.000 Zeichen. Das optionale Feld `businessDescription` verändert vorhandene Checks ohne Beschreibung nicht.

Das Diktat nutzt die [Web Speech API des Browsers](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition), auf Deutsch und ausschließlich nach einem Klick auf „Diktieren“. Der Browser kann Audio zur Erkennung an seinen Sprachdienst senden; darauf weist das Feld hin. Die App speichert keine Audiodatei. Nicht unterstützte Browser bieten die normale Texteingabe mit Hinweis auf die Diktierfunktion des Geräts. Stoppen, Fehler oder Verlassen der Ansicht beenden die Sitzung; bereits erkannter Text bleibt editierbar.

## Annahme und Ergebnis

Der grundlegende Stresstest nimmt an, dass Kunden nahezu unbegrenzt sehr leistungsfähige digitale Agenten nutzen können. Diese erhalten Zugang zu freigegebenen Unternehmensdaten und Programmen. Exklusive Daten, besondere Rechte und körperliche Ausführung stehen ihnen dadurch nicht automatisch zur Verfügung. Für diesen Extremfall wird kein Eintrittsdatum behauptet.

Zusätzlich betrachtet das einstellbare Szenario die nächsten zwei Jahre. Fähigkeiten verändern den angenommenen Übernahmedruck, Kosten den Preis- und Bündelungsdruck. Die Hinweise verwenden die erkennbaren Übernahmewege; offene Antworten bleiben offen, Hürden werden nicht durch das Tempo beseitigt. Es sind qualitative Annahmen ohne gemessene heutige Leistungsbasis, Preisfaktoren oder Wahrscheinlichkeiten. Grundbefunde und Schutzfaktoren werden nicht umgerechnet. Auswahl und Hinweise erscheinen auch im Druckbericht.

Die drei möglichen Übernahmen werden getrennt betrachtet:

- **Digitale Arbeit übernehmen:** Fragen 1, 2 und 3.
- **Die Leistung im vorhandenen Paket mitliefern:** Fragen 1, 2 und 4.
- **Die Oberfläche umgehen:** Fragen 4, 5 und 6.

Alle drei Werte ab 7 ergeben „Naheliegend“. Alle ab 4, aber nicht alle ab 7, ergeben „Teilweise“. Ein Wert bis 3 ergibt „Mit Hürden“. Sobald eine erforderliche Antwort fehlt, bleibt der betreffende Weg „Offen“.

Fragen 7–10 betrachten eigene Daten, tatsächliche Ausführung, besondere Zugänge und Verankerung im Betrieb. Fragen 11/12 prüfen Vergleich und bewussten Kauf zusätzlich. Ein angegebener Vorteil wird nicht automatisch zum belegten Schutz. Die Auswertung verrechnet Vorteile und Angreifbarkeit nicht zu einem Gesamtscore.

Das sind qualitative Gesprächsregeln auf Basis eigener Angaben, keine empirisch kalibrierten Wahrscheinlichkeiten. ARK Invest, *Big Ideas 2026*, liefert Hintergrund zu Kosten, Aufgabenhorizonten und Agenten als Zugangsschicht. Seine Marktprognosen werden nicht auf einzelne Unternehmen übertragen. Quellen und Regeln sind in „Annahmen und Grundlagen“ und im Druckbericht dokumentiert.

## Historie und Speicherung

Neue Checks verwenden den kürzeren Fragenstand `quick-check-3.1`. Bestehende 3.0-Checks behalten ihre Fragen und Antworten und nutzen die kompakte Darstellung. Beide erhalten das neue Zwei-Jahres-Szenario. Es wird separat als `providerScenario` mit Version `provider-scenario-1.0` gespeichert und exportiert. Fehlt es in älteren Dateien, gilt mittel/mittel, ohne die Datensätze umzuschreiben. V1/V2 behalten ihre Fragen, Scores, Berichte und damaligen sechs Zukunftsszenarien. Sie werden nicht umgerechnet. Das Archiv der ursprünglichen ausführlichen Analysen bleibt lesbar und exportierbar.

JSON-Schema 1.1 liest weiterhin Schema 1.0 und alle vier unterstützten Methoden. Fragen und Methodenversion werden gemeinsam validiert. Importgrenze: 5 MiB; vollständige Vorschau vor Übernahme, standardmäßig zusätzliche Kopien. Gleiche IDs werden nur auf ausdrückliche Auswahl ersetzt.

IndexedDB speichert automatisch unter der jeweiligen Browseradresse. Lokale und veröffentlichte Adressen haben getrennte Daten. Für einen Umzug JSON exportieren und am Ziel importieren. Bei Speicherfehlern bleiben Eingaben im geöffneten Fenster und können gesichert werden. Gleichzeitiges Bearbeiten in mehreren Fenstern wird nicht unterstützt.

## Lokal starten und prüfen

Node.js ab 22.12.0. Auf diesem Mac kann `Start.command` gestartet werden. Alternativ:

```sh
npm ci
npm run dev
```

Standardadresse: http://127.0.0.1:5179/

```sh
npm test -- --pool=threads
npm run build
git diff --check
```

React, TypeScript, Vite, Zod, Vitest und IndexedDB. Keine eigene KI-API, API-Schlüssel, Anmeldung oder Telemetrie erforderlich. Optionales Diktat verwendet den Sprachdienst des Browsers. Die Website bzw. der lokale Server muss zum Öffnen erreichbar sein.

## Weiterarbeiten

Einstieg: `src/main.tsx` → `src/quick/QuickApp.tsx`. Neue Fragen und Regeln liegen in `provider-questions.ts` und `provider-analysis.ts`; die neuen Ansichten in `Provider*.tsx`, die Gestaltung in `provider.css`. Frühere Kataloge und Berechnungen bleiben unverändert. Inhaltliche Folgeänderungen an der veröffentlichten Methode müssen erneut versioniert werden.

Übergabe: [docs/UEBERGABE_CODEX.md](docs/UEBERGABE_CODEX.md). Umsetzungsplan: [Plattform-Check](docs/superpowers/plans/2026-11-07-plattform-check.md).

Vercel baut mit `npm run build` nach `dist`. Der GitHub-Anschluss veröffentlicht den Branch `flux` automatisch; ein Push dorthin ist eine Veröffentlichung.
