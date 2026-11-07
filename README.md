# e23 Resilience-Assessment

**Wird ein KI-Gigant Ihr Business vernichten?**

Das Resilience-Assessment beantwortet diese Frage mit zwölf konkreten Einschätzungen. Das Ergebnis zeigt, welche Teile eine KI-Plattform übernehmen könnte, was das Geschäft schützt, wie es selbst von besserer KI profitiert und was Kunden nach einem KI-Vergleich weiter bezahlen. Eigenständiges Projekt außerhalb von ViralFlux.

Repository: https://github.com/Fliegenbart/e23-resilienz-check

Produktionsadresse: https://e23-resilienz-check.vercel.app. Anwendungsversion **0.7.0** ergänzt eine individuelle KI-Auswertung aus Business-Beschreibung, zwölf Antworten und dem Zwei-Jahres-Szenario.

## Nutzung

1. Optional das Business kurz beschreiben – tippen oder „Diktieren“ verwenden. Dann „Assessment starten“ anklicken. Die erste Frage erscheint direkt, ohne Auswahl zwischen bestehendem Angebot und neuer Idee.
2. Zwölf kurze Fragen beantworten: eine Frage pro Ansicht, Werte von 1 bis 10 oder „Weiß ich nicht“. Nach kurzer gelber Bestätigung folgt automatisch die nächste Frage. Hilfen und Beispiele stehen unter „Details“.
3. Das kompakte Ergebnis lesen: mögliche Übernahme, Schutz, eigener KI-Nutzen und nächste Schritte. Unter „Nächste 2 Jahre“ unabhängig einstellen, wie schnell KI besser und günstiger wird: langsam, mittel oder schnell. Voreinstellung: mittel/mittel. Kurze Hinweise zu Übernahme, eigenem Nutzen und Preisdruck reagieren direkt. Begründungen und Belege sind aufklappbar; Antworten lassen sich korrigieren.
4. Den Check über „Bisherige Checks“ wieder öffnen, als JSON sichern oder importieren. „Ergebnis als PDF“ öffnet die Druckfunktion des Browsers.

Keine Anmeldung und keine erforderlichen Texteingaben. Checks werden im jeweiligen Browser gespeichert. Eine hohe Zahl ist nicht pauschal gut oder schlecht: Die ersten Fragen beschreiben den möglichen Zugriff der Plattform, die späteren eigene Vorteile und Belege.

Die Beschreibung wird beim Start mit dem Check gespeichert und ist im Ergebnis unter „Ihr Business“ bearbeitbar. Sie erscheint auch in JSON und Druckbericht. Maximal 5.000 Zeichen. Das optionale Feld `businessDescription` verändert vorhandene Checks ohne Beschreibung nicht.

Ab 20 Zeichen bietet das Ergebnis „Mein Business auswerten“ an. Erst dieser Klick sendet Beschreibung, zwölf Antworten und Szenario an OpenAI über Vercel. Die Auswertung nennt konkrete Tätigkeiten, mögliche Schutzfaktoren, eigenen KI-Nutzen und einen Praxistest. Fehlende Angaben oder Widersprüche werden benannt. Herkunftszitate und Fragebezüge sind aufklappbar. Es findet keine externe Prüfung des Geschäfts statt.

Die KI-Auswertung wird mit ihrem Eingabestand lokal gespeichert und im JSON sowie im Druckbericht erhalten. Änderungen an Beschreibung, Antworten oder Szenario machen sie veraltet; „Auswertung aktualisieren“ erzeugt eine neue. Es gibt keine automatische Übertragung. Alte Methoden erhalten keine neue KI-Interpretation. Bei einem Fehler bleibt die regelbasierte Auswertung nutzbar.

Das Diktat nutzt die [Web Speech API des Browsers](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition), auf Deutsch und ausschließlich nach einem Klick auf „Diktieren“. Der Browser kann Audio zur Erkennung an seinen Sprachdienst senden; darauf weist das Feld hin. Die App speichert keine Audiodatei. Nicht unterstützte Browser bieten die normale Texteingabe mit Hinweis auf die Diktierfunktion des Geräts. Stoppen, Fehler oder Verlassen der Ansicht beenden die Sitzung; bereits erkannter Text bleibt editierbar.

## Annahme und Ergebnis

Der grundlegende Stresstest nimmt an, dass Kunden, Wettbewerber und das eigene Unternehmen sehr leistungsfähige, günstige digitale Agenten nutzen können. Diese erhalten Zugang zu freigegebenen Unternehmensdaten und Programmen. Exklusive Daten, besondere Rechte und körperliche Ausführung stehen ihnen dadurch nicht automatisch zur Verfügung. Für diesen Extremfall wird kein Eintrittsdatum behauptet.

Zusätzlich betrachtet das einstellbare Szenario die nächsten zwei Jahre. Fähigkeiten verändern den angenommenen Übernahmedruck und den eigenen Nutzen getrennt, Kosten den Preis- und Bündelungsdruck. Ein billigeres Modell schließt keine Fähigkeitslücke. Die Hinweise verwenden die erkennbaren Übernahmewege; offene Antworten bleiben offen, Hürden werden nicht durch das Tempo beseitigt. Es sind qualitative Annahmen ohne gemessene heutige Leistungsbasis, Preisfaktoren oder Wahrscheinlichkeiten. Grundbefunde und Schutzfaktoren werden nicht umgerechnet. Auswahl und Hinweise erscheinen auch im Druckbericht.

Die drei möglichen Übernahmen werden getrennt betrachtet:

- **Digitale Arbeit übernehmen:** Fragen 1 und 2.
- **Die Leistung im vorhandenen Paket mitliefern:** Fragen 1, 2 und 3.
- **Den KI-Vorsprung einholen:** Frage 4 – Anteil des Vorteils, der heutige KI-Schwächen ausgleicht.

Alle erforderlichen Werte ab 7 ergeben „Naheliegend“. Alle ab 4, aber nicht alle ab 7, ergeben „Teilweise“. Ein Wert bis 3 ergibt „Mit Hürden“. Sobald eine erforderliche Antwort fehlt, bleibt der betreffende Weg „Offen“.

Fragen 5–10 betrachten exklusive Daten, Netzwerke, Ausführung vor Ort, verbindliche Verantwortung, feste Kundenabläufe und besondere Zugänge. Frage 11 erfasst den eigenen Nutzen besserer KI separat. Frage 12 prüft Käufe nach einem KI-Vergleich. Für Schutz, Nutzen und Belege gelten die Stufen 1–3, 4–6 und 7–10; fehlende Angaben bleiben offen. Ein angegebener Vorteil wird nicht automatisch zum belegten Schutz. Die Auswertung verrechnet Vorteile und Angreifbarkeit nicht zu einem Gesamtscore. Weder präzise Software noch Datenschutz oder Haftungszusagen machen ein Geschäft automatisch unersetzbar.

Das sind qualitative Gesprächsregeln auf Basis eigener Angaben, keine empirisch kalibrierten Wahrscheinlichkeiten. ARK Invest, _Big Ideas 2026_, liefert Hintergrund zu Kosten, Aufgabenhorizonten und Agenten als Zugangsschicht. Seine Marktprognosen werden nicht auf einzelne Unternehmen übertragen. Quellen und Regeln sind in „Annahmen und Grundlagen“ und im Druckbericht dokumentiert.

## Historie und Speicherung

Neue Checks verwenden `quick-check-4.0`. Bestehende 3.0- und 3.1-Checks behalten ihre ursprünglichen Fragen, Antworten und Auswertungsregeln. Ihre Kataloge und die V3-Auswertung sind unter `src/quick/methods/` eingefroren. Alle drei Plattform-Methoden unterstützen das Zwei-Jahres-Szenario. Die gespeicherte Methodenversion bestimmt dessen Auswertung. Es wird separat als `providerScenario` mit Version `provider-scenario-1.0` gespeichert und exportiert. Fehlt es in älteren Dateien, gilt mittel/mittel, ohne die Datensätze umzuschreiben. V1/V2 behalten ihre Fragen, Scores, Berichte und damaligen sechs Zukunftsszenarien. Sie werden nicht umgerechnet. Das Archiv der ursprünglichen ausführlichen Analysen bleibt lesbar und exportierbar.

JSON-Schema 1.1 liest weiterhin Schema 1.0 und alle fünf unterstützten Methoden. Fragen und Methodenversion werden gemeinsam validiert. Importgrenze: 5 MiB; vollständige Vorschau vor Übernahme, standardmäßig zusätzliche Kopien. Gleiche IDs werden nur auf ausdrückliche Auswahl ersetzt.

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
npm run test:api
npm run build
git diff --check
```

React, TypeScript, Vite, Zod, Vitest und IndexedDB. Die regelbasierte Auswertung benötigt keine KI-API. Die optionale individuelle Auswertung verwendet eine Vercel-Node-Funktion und AI SDK mit `openai/gpt-5.2` über AI Gateway. Die Authentifizierung erfolgt über die bestehende Projekt-OIDC-Identität; keine Schlüssel im Browser. Diktat verwendet den Sprachdienst des Browsers. Die Website bzw. der lokale Server muss zum Öffnen erreichbar sein.

`npm run dev` startet nur Vite. API-Tests arbeiten ohne Geheimnisse mit einem injizierten Generator; echte Modelltests erfolgen auf einer Vercel-Bereitstellung mit erfundenen Beispielen. Eingaben sind auf 20 KiB begrenzt, Modellaufrufe auf 45 Sekunden und 4.000 Ausgabetokens einschließlich Reasoning. Der öffentliche Endpunkt benötigt das projektbezogene Gateway-Budget und eine Ratenbegrenzung. Die Anwendung protokolliert bei Fehlern nur Status und feste Fehlerkategorie, keine Prompts oder vollständigen Anbieterfehler. Das Projektbudget beträgt maximal 5 USD pro Monat; der Endpunkt erlaubt fünf Anfragen pro Minute und IP.

## Weiterarbeiten

Einstieg: `src/main.tsx` → `src/quick/QuickApp.tsx`. Neue Fragen liegen in `provider-questions.ts`, V4-Regeln in `provider-analysis-4.ts`; `provider-analysis.ts` wählt anhand der gespeicherten Methode die passende Auswertung. `ProviderRules.tsx` erklärt die Regeln gemeinsam für Bildschirm und Bericht; die neuen Ansichten in `Provider*.tsx`, die Gestaltung in `provider.css`. Frühere Kataloge und Berechnungen bleiben unverändert. Inhaltliche Folgeänderungen an der veröffentlichten Methode müssen erneut versioniert werden.

Übergabe: [docs/UEBERGABE_CODEX.md](docs/UEBERGABE_CODEX.md). Umsetzungsplan: [Plattform-Check](docs/superpowers/plans/2026-11-07-plattform-check.md).

Vercel baut mit `npm run build` nach `dist`. Der GitHub-Anschluss veröffentlicht den Branch `flux` automatisch; ein Push dorthin ist eine Veröffentlichung.
