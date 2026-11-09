# e23 Resilience-Assessment

**Wird ein KI-Gigant Ihr Business vernichten?**

Das Resilience-Assessment beantwortet diese Frage mit zwölf konkreten Einschätzungen. Das Ergebnis zeigt einen KI-Risiko-Score, was KI übernimmt und wofür Kunden weiter zahlen könnten. Der verbleibende Kaufgrund steht im Mittelpunkt. Eigenständiges Projekt außerhalb von ViralFlux.

Repository: https://github.com/Fliegenbart/e23-resilienz-check

Produktionsadresse: https://e23-resilienz-check.vercel.app. Anwendungsversion **0.10.0** prüft den Burggraben gegen günstige Expertenteams für alle. Neue Methode: `quick-check-6.0`.

## Nutzung

1. Optional das Business kurz beschreiben – tippen oder „Diktieren“ verwenden. Im zweiten Feld den eigenen USP oder Moat nennen. Dann „Assessment starten“ anklicken. Drei kurze Szenarien öffnen den Blick: Der Kunde macht es selbst, ein Wettbewerber legt zu, ein neuer Anbieter aus einer anderen Branche löst das Problem anders.
2. Zwölf kurze Fragen beantworten: eine Frage pro Ansicht, Werte von 1 bis 10 oder „Weiß ich nicht“. Nach kurzer gelber Bestätigung folgt automatisch die nächste Frage. Hilfen und Beispiele stehen unter „Details“.
3. Das Ergebnis lesen: **KI-Risiko-Score**, **Was KI übernimmt**, **Wofür Kunden weiter zahlen**, **Ihr Burggraben**, **drei mögliche Angreifer** und **Nächster Test**. Zugang und wirtschaftlicher Anreiz stehen unter einer eigenen aufklappbaren Zeile. Unter „Nächste 2 Jahre“ unabhängig einstellen, wie schnell KI besser und günstiger wird: langsam, mittel oder schnell. Voreinstellung: mittel/mittel. Die heutige KI-Leistung und die Tempoannahmen verändern die Einstufung des Zwei-Jahres-Blicks; der grundlegende Stresstest-Score bleibt separat. Details und Belege sind aufklappbar.
4. Den Check über „Bisherige Checks“ wieder öffnen, als JSON sichern oder importieren. „Ergebnis als PDF“ öffnet die Druckfunktion des Browsers.

Keine Anmeldung und keine erforderlichen Texteingaben. Checks werden im jeweiligen Browser gespeichert. Eine hohe Zahl ist nicht pauschal gut oder schlecht: Die ersten Fragen beschreiben den möglichen Zugriff der Plattform, die späteren eigene Vorteile und Belege.

Beschreibung und Vorteil werden beim Start gespeichert und sind im Ergebnis unter „Business und Vorteil“ bearbeitbar. Beide erscheinen in JSON und Druckbericht. Maximal 5.000 Zeichen für `businessDescription`, 2.000 für `businessMoat`. Bestehende Checks ohne diese optionalen Felder bleiben lesbar; das Vorteilsfeld gehört zu den Methoden ab 5.0.

Ab 20 Zeichen Business-Beschreibung oder einem eingetragenen Vorteil bietet das Ergebnis eine KI-Auswertung an. Mit Vorteil heißt der Button „Mit KI prüfen“. Erst dieser Klick sendet beide Texte, zwölf Antworten und Szenario an OpenAI über Vercel. Die Auswertung nennt konkrete übernehmbare Tätigkeiten, den verbleibenden Kaufgrund und einen Praxistest. Eigener Nutzen und Herkunftsbezüge stehen in den Details. Es findet keine externe Prüfung des Geschäfts statt.

Die KI prüft den genannten Vorteil als unbestätigte Behauptung gegen günstige Expertenteams, die Kunden, Wettbewerber und neue Anbieter gleichermaßen nutzen können: leicht ersetzbar, Schutz unter Bedingungen, verbleibende Hürde oder noch nicht bewertbar. Sie nennt den entscheidenden Auslöser statt eines erfundenen Datums: Funktionsupdate, bessere Agenten oder eine Hürde außerhalb der KI-Intelligenz. Unklare Texte wie „diesdas ananas“ erfordern eine konkrete Rückfrage. Die Prüfung beeinflusst auch den beschriebenen Kaufgrund. Der Score bleibt aus den zwölf Antworten berechnet; hält die KI den Vorteil für ersetzbar, obwohl der Score unter 65 liegt, wird der Widerspruch sichtbar markiert.

Die KI-Auswertung wird mit ihrem Eingabestand lokal gespeichert und im JSON sowie im Druckbericht erhalten. Änderungen an Beschreibung, Vorteil, Antworten oder Szenario machen sie veraltet; „Auswertung aktualisieren“ erzeugt eine neue. Es gibt keine automatische Übertragung. Methode 6.0 nutzt `business-analysis-4.0` mit drei Angriffsszenarien, Zugang und Anreiz. Ein USP wird zusätzlich geprüft. Frühere Methoden behalten ihre bisherigen Ausgabeversionen 1.0–3.0. Alte Methoden erhalten keine neue KI-Interpretation. Bei einem Fehler bleibt die regelbasierte Auswertung nutzbar.

Das Diktat nutzt die [Web Speech API des Browsers](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition), auf Deutsch und ausschließlich nach einem Klick auf „Diktieren“. Der Browser kann Audio zur Erkennung an seinen Sprachdienst senden; darauf weist das Feld hin. Die App speichert keine Audiodatei. Nicht unterstützte Browser bieten die normale Texteingabe mit Hinweis auf die Diktierfunktion des Geräts. Stoppen, Fehler oder Verlassen der Ansicht beenden die Sitzung; bereits erkannter Text bleibt editierbar.

## Annahme und Ergebnis

Das Gedankenexperiment stellt ein Team aus Spitzenexperten vor: rund um die Uhr, parallel und viel günstiger. Kunden, bestehende Wettbewerber, neue Anbieter aus anderen Branchen und das eigene Unternehmen haben Zugang zu diesem Team. Es darf das Kundenproblem anders lösen, statt das Produkt oder die menschliche Arbeitsweise nachzubauen. Daten, Rechte, Systemzugänge und reale Ausführung werden dadurch nicht automatisch verfügbar. Expertenniveau ist ein Vergleichsmaßstab, keine Behauptung allgemeiner heutiger KI-Fähigkeiten und keine Vorhersage für 12–18 Monate.

Q10 fragt deshalb „Könnte ein Expertenteam Ihr Kundenproblem ohne Sie lösen?“ statt vom Nutzer eine KI-Fortschrittsprognose zu verlangen. Q2 fragt nach beschaffbaren Daten und Zugängen; Q11 nach wiederkehrendem Bedarf. Q12 beschreibt bezahlte Vergleiche mit guten Alternativen, nicht ausschließlich KI. Der Nutzer liefert Geschäftsfakten und markiert Unbekanntes; die KI prüft daraus alternative Lösungen, Angreifer und den behaupteten Schutz.

Der KI-Risiko-Score ist ein strukturierter Index von 0 bis 100 für bedingte Ersetzbarkeit, **keine Pleite- oder Eintrittswahrscheinlichkeit**. Drei Wege bleiben getrennt: das Ergebnis direkt liefern, die Bedienung übernehmen und andere Anbieter auswählen. Schutz trägt nur gemeinsam: eigener Beitrag nötig (Q6), schwer ersetzbar (Q7) und kaufentscheidend (Q8).

Antworten werden mit `(Wert − 1) / 9` normiert. Direkte Lösung: `min(Q1, Q2, Q10) × (0,7 + 0,3 × Q3)`. Bedienung: `min(Q4, Q2)`. Anbieterauswahl: `min(Q5, Q2) × (0,7 + 0,3 × Q3)`. Expertenwissen umgeht damit keinen fehlenden Zugang. Score: `100 × max(Wege) × (1 − 0,75 × min(Q6, Q7, Q8))`, auf Fünferschritte gerundet. Bänder: 0–30 niedrig, 35–60 mittel, 65–80 hoch, 85–100 sehr hoch. Die Gewichte sind offengelegte Einschätzungsregeln, keine empirisch kalibrierte Prognose.

Wirtschaftlicher Anreiz bleibt separat: Häufiger Bedarf Q11 kann eine skalierbare Lösung attraktiv machen, belegt aber weder Marktgröße noch Profitabilität. Auch eine wertvolle Nische oder Bündelung kann sich lohnen. KI-Anbieter müssen nicht selbst einsteigen; Kunden und Wettbewerber können ihre Agenten nutzen. Q11 und Kaufbelege Q12 verändern den Ersetzbarkeits-Score nicht.

Fehlende Antworten ergeben eine Spanne aus den möglichen Extremen. Gleichzeitige starke Ersetzbarkeits- und Schutzbehauptungen (Q2/Q6 oder Q5/Q7 jeweils ab 7) lassen den Schutz ungeklärt; die obere Grenze verwendet keinen Schutzabzug. Die KI markiert Widersprüche, erfindet aber keine neue Zahl. Historische V5-Checks behalten ihre damalige Rechnung.

Das Zwei-Jahres-Szenario nutzt die heute eingeschätzte KI-Leistung Q9. Langsam/mittel/schnell schließt rechnerisch 0,2/0,5/0,8 der verbleibenden Fähigkeitslücke. Günstigere KI gewichtet den daraus resultierenden Preisdruck mit 0,55/0,75/1, ohne Fähigkeiten zu erhöhen. Die Faktoren sind Szenarioannahmen, keine gemessenen Wachstums- oder Preisprognosen. Die Befundstufe ändert sich bei 0,35 und 0,65. Ohne Q9 oder bei ungeklärtem Risiko bleibt das Szenario offen. Rechte, Daten oder ein weiterhin nötiger Beitrag werden nicht durch niedrige KI-Kosten erzeugt.

Die vollständigen Regeln stehen gemeinsam für Bildschirm und Druck in `ProviderRules.tsx`. Richard Suttons [The Bitter Lesson](https://www.incompleteideas.net/IncIdeas/BitterLesson.html) begründet den Blick auf skalierbare Suche und Lernen statt festgelegter Lösungswege. [METR erläutert die Grenzen seiner Aufgabenhorizonte](https://metr.org/notes/2026-01-22-time-horizon-limitations/): domänenspezifische Fähigkeiten und Zuverlässigkeit erlauben keinen allgemeinen Termin für die Ersetzung eines Geschäfts. ARK Invest, _Big Ideas 2026_, bleibt Hintergrund zu Kosten, Aufgabenhorizonten und Agenten als Zugangsschicht. Seine Marktprognosen werden nicht auf einzelne Unternehmen oder die Gewichte des Scores übertragen.

## Historie und Speicherung

Neue Checks verwenden `quick-check-6.0`. Bestehende 3.0-, 3.1-, 4.0- und 5.0-Checks behalten ihre Fragen, Antworten und Auswertungsregeln. Die Fragekataloge sind unter `src/quick/methods/` eingefroren; die V4-/V5-Auswertungen bleiben separat erhalten. Alle fünf Plattform-Methoden unterstützen das Zwei-Jahres-Szenario. Die gespeicherte Methodenversion bestimmt dessen Auswertung. Es wird separat als `providerScenario` mit Version `provider-scenario-1.0` gespeichert und exportiert. Fehlt es in älteren Dateien, gilt mittel/mittel, ohne die Datensätze umzuschreiben. V1/V2 behalten ihre Fragen, Scores, Berichte und damaligen sechs Zukunftsszenarien. Sie werden nicht umgerechnet. Das Archiv der ursprünglichen ausführlichen Analysen bleibt lesbar und exportierbar.

JSON-Schema 1.1 liest weiterhin Schema 1.0 und alle sieben unterstützten Methoden. Fragen und Methodenversion werden gemeinsam validiert. Importgrenze: 5 MiB; vollständige Vorschau vor Übernahme, standardmäßig zusätzliche Kopien. Gleiche IDs werden nur auf ausdrückliche Auswahl ersetzt.

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

`npm run dev` startet nur Vite. API-Tests arbeiten ohne Geheimnisse mit einem injizierten Generator; echte Modelltests erfolgen auf einer Vercel-Bereitstellung mit erfundenen Beispielen. Eingaben sind auf 32 KiB begrenzt, Modellaufrufe auf 45 Sekunden und 5.000 Ausgabetokens einschließlich Reasoning (frühere Methoden: 4.000). Der öffentliche Endpunkt benötigt das projektbezogene Gateway-Budget und eine Ratenbegrenzung. Die Anwendung protokolliert bei Fehlern nur Status und feste Fehlerkategorie, keine Prompts oder vollständigen Anbieterfehler. Das Projektbudget beträgt maximal 5 USD pro Monat; der Endpunkt erlaubt fünf Anfragen pro Minute und IP.

## Weiterarbeiten

Einstieg: `src/main.tsx` → `src/quick/QuickApp.tsx`. Neue Fragen liegen in `provider-questions.ts`, V6-Regeln in `provider-analysis-6.ts`; `provider-analysis.ts` wählt anhand der gespeicherten Methode die passende Auswertung. `ProviderRules.tsx` erklärt die Regeln gemeinsam für Bildschirm und Bericht; Score und kompakte Aussagen in `ProviderRiskSummary.tsx`, weitere Ansichten in `Provider*.tsx`, die Gestaltung in `provider.css`. Frühere Kataloge und Berechnungen bleiben unverändert. Inhaltliche Folgeänderungen an der veröffentlichten Methode müssen erneut versioniert werden.

Übergabe: [docs/UEBERGABE_CODEX.md](docs/UEBERGABE_CODEX.md). Umsetzungsplan: [Expertenszenario](docs/superpowers/plans/2026-11-09-expertenszenario.md).

Vercel baut mit `npm run build` nach `dist`. Der freigegebene Git-Stand liegt auf `flux`. Ein Push allein ist kein Nachweis einer Veröffentlichung: beim Release 0.8.0 war danach kein neues Produktionsdeployment sichtbar. Direkt veröffentlichen mit `vercel deploy --prod --yes`, anschließend Status und öffentliche Alias-Adresse auf Vercel sowie den Browserablauf prüfen.
