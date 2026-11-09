# e23 Resilience-Assessment

**Wird ein KI-Gigant Ihr Business vernichten?**

Das Resilience-Assessment beantwortet diese Frage mit zwölf konkreten Einschätzungen. Das Ergebnis zeigt einen KI-Risiko-Score, was KI übernimmt und wofür Kunden weiter zahlen könnten. Der verbleibende Kaufgrund steht im Mittelpunkt. Eigenständiges Projekt außerhalb von ViralFlux.

Repository: https://github.com/Fliegenbart/e23-resilienz-check

Produktionsadresse: https://e23-resilienz-check.vercel.app. Anwendungsversion **0.8.0** ergänzt den KI-Risiko-Score und die Methode `quick-check-5.0`.

## Nutzung

1. Optional das Business kurz beschreiben – tippen oder „Diktieren“ verwenden. Dann „Assessment starten“ anklicken. Die erste Frage erscheint direkt, ohne Auswahl zwischen bestehendem Angebot und neuer Idee.
2. Zwölf kurze Fragen beantworten: eine Frage pro Ansicht, Werte von 1 bis 10 oder „Weiß ich nicht“. Nach kurzer gelber Bestätigung folgt automatisch die nächste Frage. Hilfen und Beispiele stehen unter „Details“.
3. Das Ergebnis lesen: **KI-Risiko-Score**, **Was KI übernimmt**, **Wofür Kunden weiter zahlen**, **Nächster Test**. Unter „Nächste 2 Jahre“ unabhängig einstellen, wie schnell KI besser und günstiger wird: langsam, mittel oder schnell. Voreinstellung: mittel/mittel. Die heutige KI-Leistung und die Tempoannahmen verändern die Einstufung des Zwei-Jahres-Blicks; der grundlegende Stresstest-Score bleibt separat. Details und Belege sind aufklappbar.
4. Den Check über „Bisherige Checks“ wieder öffnen, als JSON sichern oder importieren. „Ergebnis als PDF“ öffnet die Druckfunktion des Browsers.

Keine Anmeldung und keine erforderlichen Texteingaben. Checks werden im jeweiligen Browser gespeichert. Eine hohe Zahl ist nicht pauschal gut oder schlecht: Die ersten Fragen beschreiben den möglichen Zugriff der Plattform, die späteren eigene Vorteile und Belege.

Die Beschreibung wird beim Start mit dem Check gespeichert und ist im Ergebnis unter „Ihr Business“ bearbeitbar. Sie erscheint auch in JSON und Druckbericht. Maximal 5.000 Zeichen. Das optionale Feld `businessDescription` verändert vorhandene Checks ohne Beschreibung nicht.

Ab 20 Zeichen bietet das Ergebnis „Mein Business auswerten“ an. Erst dieser Klick sendet Beschreibung, zwölf Antworten und Szenario an OpenAI über Vercel. Die Auswertung nennt konkrete übernehmbare Tätigkeiten, den verbleibenden Kaufgrund und einen Praxistest. Eigener Nutzen und Herkunftsbezüge stehen in den Details. Der Score wird nachvollziehbar aus den Antworten berechnet; das Sprachmodell darf ihn nicht ändern. Fehlende Angaben oder Widersprüche werden benannt. Herkunftszitate und Fragebezüge sind aufklappbar. Es findet keine externe Prüfung des Geschäfts statt.

Die KI-Auswertung wird mit ihrem Eingabestand lokal gespeichert und im JSON sowie im Druckbericht erhalten. Änderungen an Beschreibung, Antworten oder Szenario machen sie veraltet; „Auswertung aktualisieren“ erzeugt eine neue. Es gibt keine automatische Übertragung. Alte Methoden erhalten keine neue KI-Interpretation. Bei einem Fehler bleibt die regelbasierte Auswertung nutzbar.

Das Diktat nutzt die [Web Speech API des Browsers](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition), auf Deutsch und ausschließlich nach einem Klick auf „Diktieren“. Der Browser kann Audio zur Erkennung an seinen Sprachdienst senden; darauf weist das Feld hin. Die App speichert keine Audiodatei. Nicht unterstützte Browser bieten die normale Texteingabe mit Hinweis auf die Diktierfunktion des Geräts. Stoppen, Fehler oder Verlassen der Ansicht beenden die Sitzung; bereits erkannter Text bleibt editierbar.

## Annahme und Ergebnis

Der grundlegende Stresstest nimmt an, dass Kunden, Wettbewerber und das eigene Unternehmen sehr leistungsfähige, günstige digitale Agenten nutzen können. Diese erhalten Zugang zu freigegebenen Unternehmensdaten und Programmen. Exklusive Daten, besondere Rechte und körperliche Ausführung stehen ihnen dadurch nicht automatisch zur Verfügung. Für diesen Extremfall wird kein Eintrittsdatum behauptet.

Die neue Methode unterscheidet drei Wege: **zur mitgelieferten KI-Funktion werden**, **die Bedienung an einen Agenten verlieren**, **als Anbieter austauschbar werden**. Ein Agent kann bezahlte Software weiterhin brauchen, obwohl die Oberfläche verschwindet. Auch physische Dienstleister können den Kundenzugang verlieren, wenn der Agent andere Anbieter auswählt.

Der KI-Risiko-Score ist ein strukturierter Index von 0 bis 100, **keine Pleite- oder Übernahmewahrscheinlichkeit**. Er verwendet den stärksten Übernahmeweg. Schutz senkt den Score nur, wenn ein Beitrag gleichzeitig nötig (Q6), schwer ersetzbar (Q7) und den Aufpreis wert (Q8) bleibt. Der schwächste dieser drei Werte begrenzt den Schutz. Eigener KI-Nutzen (Q11) und Kaufbelege (Q12) verändern den Score nicht. Eine neue Idee wird durch fehlende Belege nicht automatisch riskanter.

Antworten werden mit `(Wert − 1) / 9` normiert. KI-Funktion: `max(min(Q1, Q2) × (0,7 + 0,3 × Q3), Q10)`. Bedienung: `Q4`. Anbieterauswahl: `Q5 × (0,7 + 0,3 × Q3)`. Score: `100 × max(Wege) × (1 − 0,75 × min(Q6, Q7, Q8))`, auf Fünferschritte gerundet. Die Bänder sind 0–30 niedrig, 35–60 mittel, 65–80 hoch, 85–100 sehr hoch. Das sind offengelegte Einschätzungsregeln, keine empirisch kalibrierten Gewichte.

Fehlende Angaben erzeugen eine Spanne aus den möglichen Extremen statt eines erfundenen Mittelwerts. Gleichzeitige starke Ersetzbarkeits- und Schutzbehauptungen (Q2/Q6 oder Q5/Q7 jeweils ab 7) machen den Schutz ungeklärt: Die Spanne reicht bis zum Risiko ohne Schutzabzug. Die offenen Punkte erscheinen im Ergebnis. Belege werden getrennt als Annahmen, erste Belege oder Praxistest laut Angaben ausgewiesen.

Das Zwei-Jahres-Szenario nutzt die heute eingeschätzte KI-Leistung Q9. Langsam/mittel/schnell schließt rechnerisch 0,2/0,5/0,8 der verbleibenden Fähigkeitslücke. Günstigere KI gewichtet den daraus resultierenden Preisdruck mit 0,55/0,75/1, ohne Fähigkeiten zu erhöhen. Die Faktoren sind Szenarioannahmen, keine gemessenen Wachstums- oder Preisprognosen. Die Befundstufe ändert sich bei 0,35 und 0,65. Ohne Q9 oder bei ungeklärtem Risiko bleibt das Szenario offen. Rechte, Daten oder ein weiterhin nötiger Beitrag werden nicht durch niedrige KI-Kosten erzeugt.

Die vollständigen Regeln stehen gemeinsam für Bildschirm und Druck in `ProviderRules.tsx`. ARK Invest, _Big Ideas 2026_, bleibt Hintergrund zu Kosten, Aufgabenhorizonten und Agenten als Zugangsschicht. Seine Marktprognosen werden nicht auf einzelne Unternehmen oder die Gewichte des Scores übertragen.

## Historie und Speicherung

Neue Checks verwenden `quick-check-5.0`. Bestehende 3.0-, 3.1- und 4.0-Checks behalten ihre Fragen, Antworten und Auswertungsregeln. Die Fragekataloge sind unter `src/quick/methods/` eingefroren; die V4-Auswertung bleibt in `provider-analysis-4.ts`. Alle vier Plattform-Methoden unterstützen das Zwei-Jahres-Szenario. Die gespeicherte Methodenversion bestimmt dessen Auswertung. Es wird separat als `providerScenario` mit Version `provider-scenario-1.0` gespeichert und exportiert. Fehlt es in älteren Dateien, gilt mittel/mittel, ohne die Datensätze umzuschreiben. V1/V2 behalten ihre Fragen, Scores, Berichte und damaligen sechs Zukunftsszenarien. Sie werden nicht umgerechnet. Das Archiv der ursprünglichen ausführlichen Analysen bleibt lesbar und exportierbar.

JSON-Schema 1.1 liest weiterhin Schema 1.0 und alle sechs unterstützten Methoden. Fragen und Methodenversion werden gemeinsam validiert. Importgrenze: 5 MiB; vollständige Vorschau vor Übernahme, standardmäßig zusätzliche Kopien. Gleiche IDs werden nur auf ausdrückliche Auswahl ersetzt.

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

Einstieg: `src/main.tsx` → `src/quick/QuickApp.tsx`. Neue Fragen liegen in `provider-questions.ts`, V5-Regeln in `provider-analysis-5.ts`; `provider-analysis.ts` wählt anhand der gespeicherten Methode die passende Auswertung. `ProviderRules.tsx` erklärt die Regeln gemeinsam für Bildschirm und Bericht; Score und kompakte Aussagen in `ProviderRiskSummary.tsx`, weitere Ansichten in `Provider*.tsx`, die Gestaltung in `provider.css`. Frühere Kataloge und Berechnungen bleiben unverändert. Inhaltliche Folgeänderungen an der veröffentlichten Methode müssen erneut versioniert werden.

Übergabe: [docs/UEBERGABE_CODEX.md](docs/UEBERGABE_CODEX.md). Umsetzungsplan: [Plattform-Check](docs/superpowers/plans/2026-11-07-plattform-check.md).

Vercel baut mit `npm run build` nach `dist`. Der GitHub-Anschluss veröffentlicht den Branch `flux` automatisch; ein Push dorthin ist eine Veröffentlichung.
