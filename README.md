# e23 Resilience-Assessment

**Wird ein KI-Gigant Ihr Business vernichten?**

Das Resilience-Assessment beantwortet diese Frage mit zwölf konkreten Einschätzungen. Das Ergebnis zeigt einen KI-Risiko-Score, aktuell dokumentierte Anbieterfunktionen, was KI übernehmen könnte und eine mögliche bezahlte Rolle hinter Agenten. Der verbleibende Kaufgrund steht im Mittelpunkt. Eigenständiges Projekt außerhalb von ViralFlux.

Repository: https://github.com/Fliegenbart/e23-resilienz-check

Produktionsadresse: https://e23-resilienz-check.vercel.app. Anwendungsversion **0.11.0** prüft den Burggraben gegen günstige Expertenteams für alle. Neue Methode: `quick-check-7.0`.

## Nutzung

1. Optional das Business kurz beschreiben – tippen oder „Diktieren“ verwenden. Im zweiten Feld den eigenen USP oder Moat nennen. Dann „Assessment starten“ anklicken. Drei Angriffe und eine mögliche Zuliefererrolle öffnen den Blick: Der Kunde macht es selbst, ein Wettbewerber legt zu, ein neuer Anbieter aus einer anderen Branche löst das Problem anders.
2. Zwölf kurze Fragen beantworten: eine Frage pro Ansicht, Werte von 1 bis 10 oder „Weiß ich nicht“. Nach kurzer gelber Bestätigung folgt automatisch die nächste Frage. Hilfen und Beispiele stehen unter „Details“.
3. Das Ergebnis lesen: **KI-Risiko-Score**, **Was KI übernimmt**, **Wofür Kunden weiter zahlen**, **Ihr Burggraben**, **Heute schon möglich**, **Ihre Rolle hinter der KI** und **Nächster Test**. Drei mögliche Angreifer sind aufklappbar. Zugang und wirtschaftlicher Anreiz stehen unter einer eigenen aufklappbaren Zeile. Unter „Nächste 2 Jahre“ unabhängig einstellen, wie schnell KI besser und günstiger wird: langsam, mittel oder schnell. Voreinstellung: mittel/mittel. Die heutige KI-Leistung und die Tempoannahmen verändern die Einstufung des Zwei-Jahres-Blicks; der grundlegende Stresstest-Score bleibt separat. Details und Belege sind aufklappbar.
4. Den Check über „Bisherige Checks“ wieder öffnen, als JSON sichern oder importieren. „Ergebnis als PDF“ öffnet die Druckfunktion des Browsers.

Keine Anmeldung und keine erforderlichen Texteingaben. Checks werden im jeweiligen Browser gespeichert. Eine hohe Zahl ist nicht pauschal gut oder schlecht: Die ersten Fragen beschreiben den möglichen Zugriff der Plattform, die späteren eigene Vorteile und Belege.

Beschreibung und Vorteil werden beim Start gespeichert und sind im Ergebnis unter „Business und Vorteil“ bearbeitbar. Beide erscheinen in JSON und Druckbericht. Maximal 5.000 Zeichen für `businessDescription`, 2.000 für `businessMoat`. Bestehende Checks ohne diese optionalen Felder bleiben lesbar; das Vorteilsfeld gehört zu den Methoden ab 5.0.

Ab 20 Zeichen Business-Beschreibung oder einem eingetragenen Vorteil bietet das Ergebnis eine KI-Auswertung an. Mit Vorteil heißt der Button „Mit KI prüfen“. Erst dieser Klick sendet beide Texte, zwölf Antworten und Szenario an OpenAI über Vercel. Die Auswertung nennt konkrete übernehmbare Tätigkeiten, den verbleibenden Kaufgrund und einen Praxistest. Eigener Nutzen und Herkunftsbezüge stehen in den Details. Für V7 recherchiert Parallel über AI Gateway begrenzte, feste öffentliche Sachthemen auf offiziellen Anbieter-Websites. Geschäftsnamen, Beschreibungen, Vorteile und Antworten werden nicht in Suchanfragen eingesetzt. Quellenabruf und Anbieterangaben sind kein unabhängiger Qualitätstest oder eine externe Prüfung der Schutzbehauptungen.

Die KI prüft den genannten Vorteil als unbestätigte Behauptung gegen günstige Expertenteams, die Kunden, Wettbewerber und neue Anbieter gleichermaßen nutzen können: leicht ersetzbar, Schutz unter Bedingungen, verbleibende Hürde oder noch nicht bewertbar. Sie nennt den entscheidenden Auslöser statt eines erfundenen Datums: Funktionsupdate, bessere Agenten oder eine Hürde außerhalb der KI-Intelligenz. Unklare Texte wie „diesdas ananas“ erfordern eine konkrete Rückfrage. Die Prüfung beeinflusst auch den beschriebenen Kaufgrund. Der Score bleibt eine nachvollziehbare Rechnung. Starke unbelegte Schutzbehauptungen und konkret beanstandete Antworten öffnen die Spanne; auch ein bedingtes KI-Urteil kann einen irreführend niedrigen Wert verhindern.

Die KI-Auswertung wird mit ihrem Eingabestand lokal gespeichert und im JSON sowie im Druckbericht erhalten. Änderungen an Beschreibung, Vorteil, Antworten oder Szenario machen sie veraltet; „Auswertung aktualisieren“ erzeugt eine neue. Es gibt keine automatische Übertragung. Methode 6.0 nutzt `business-analysis-4.0` mit drei Angriffsszenarien, Zugang und Anreiz. Ein USP wird zusätzlich geprüft. Frühere Methoden behalten ihre bisherigen Ausgabeversionen 1.0–3.0. Alte Methoden erhalten keine neue KI-Interpretation. Bei einem Fehler bleibt die regelbasierte Auswertung nutzbar.

Das Diktat nutzt die [Web Speech API des Browsers](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition), auf Deutsch und ausschließlich nach einem Klick auf „Diktieren“. Der Browser kann Audio zur Erkennung an seinen Sprachdienst senden; darauf weist das Feld hin. Die App speichert keine Audiodatei. Nicht unterstützte Browser bieten die normale Texteingabe mit Hinweis auf die Diktierfunktion des Geräts. Stoppen, Fehler oder Verlassen der Ansicht beenden die Sitzung; bereits erkannter Text bleibt editierbar.

## Bewertungslogik der Methode 7.0

Die Leistung kann ersetzt werden, während ein anderer Dienst ausgewählt wird. Die Bedienoberfläche kann aber auch verschwinden, obwohl ein bezahlter Beitrag dahinter benötigt wird. Deshalb erhöht Bedienungsverlust allein den Ersetzbarkeits-Score nicht mehr.

Normierung: `(Wert − 1) / 9`. Direkte Ersetzung: `min(Q1,Q2,Q10)`. Andere Anbieter: `min(Q2,Q5)`. Schutz: `min(Q6,Q7,Q8)`. Score: `100 × max(direkte Ersetzung, andere Anbieter) × (1 − 0,75 × Schutz)`, auf Fünferschritte gerundet. 0–30 niedrig, 35–60 mittel, 65–80 hoch, 85–100 sehr hoch. Das sind transparente Einschätzungsregeln, keine empirisch kalibrierte Prognose.

Q3 fragt nach direkter Nutzung und Bezahlung durch Agenten. Q4 erfasst die Bedienung. Q11 erfasst Kontrolle über Kundenzugang, Auswahl und Preise. Diese drei Befunde bleiben vom Ersetzbarkeits-Score getrennt. Eine API ist kein Burggraben und garantiert weder Auswahl noch Umsatz. Ein Kundenagent, ein Vermittler oder der KI-Anbieter kann den Dienst auswählen. Eigene Kundenverträge, mehrere Absatzwege und eine Marge nach Vermittlung sind separat zu prüfen.

Unbekannte Antworten werden mit beiden möglichen Extremen gerechnet. Starke Schutzbehauptungen Q6–Q8 (ab 7) bleiben ohne mehrfach bestätigte bezahlte Vergleiche Q12 (ab 7) offen. Q5 und Q7 zugleich ab 7 öffnen Q7. Die KI kann weitere numerische Antworten als unbelegt oder widersprüchlich markieren. Auch ein bedingter, ersetzbarer oder unklarer KI-Burggrabenbefund hält hohe Schutzwerte offen, selbst bei optimistischen Kaufbelegen. Die markierten Antworten werden für die Spanne als unbekannt behandelt. Die KI erfindet keine Zahl; eine geringe Untergrenze ist keine Entwarnung. Q12 bleibt eine ungeprüfte Selbstauskunft.

Die aktuelle KI-Ausgabe 5.0 für V7 enthält `currentCapabilities`, `answerReview` und `agentRole` zusätzlich zu den Expertenszenarien. Die serverseitige `research`-Quellenliste stammt ausschließlich aus tatsächlichen Suchergebnissen. Aktuelle Fähigkeitsbehauptungen brauchen passende Quellen-IDs und echte Textbelege. Ungültige aktuelle Belege werden weggelassen, keine URLs erfunden. Ein Rechercheausfall lässt heutige Fähigkeiten ausdrücklich ungeprüft; das Szenario kann weiterhin ausgewertet werden. Optionale ungenaue Eingabezitate werden bei vorhandenen Fragenbezügen weggelassen, niemals durch erfundene Zitate ersetzt.

Recherche ist auf offizielle OpenAI-, Anthropic-, Google- und Microsoft-Domains beschränkt. Suchthemen werden aus einem festen Katalog ausgewählt, keine freien Geschäftstexte an die Suchmaschine geschickt. Maximal acht Quellen und begrenzte Auszüge aus höchstens zwei parallelen Suchschritten in insgesamt 30 Sekunden. Die Kerntätigkeit erhält einen eigenen Suchlauf, damit Sicherheits- und Agentendokumentation sie nicht verdrängt. Quellenfrische bis 24 Stunden ohne veralteten Cache-Fallback beim Suchdienst. Erfolgreiche Ergebnisse werden im Serverprozess höchstens sechs Stunden wiederverwendet; das ursprüngliche Abrufdatum bleibt erhalten. Quellenbelege und deren Datum bleiben im gespeicherten Check erhalten, nicht automatisch als aktuell behauptet.

Der Zwei-Jahres-Blick nutzt weiterhin Q9 als heutigen Praxistest. Langsam/mittel/schnell schließt rechnerisch 0,2/0,5/0,8 der Fähigkeitslücke; günstiger gewichtet mit 0,55/0,75/1. Ohne geprüfte Ausgangslage oder bei offenen Risikoangaben bleibt die Einstufung offen. Niedrige Kosten erzeugen keine Rechte, Daten oder allgemeine Zuverlässigkeit. Regeln stehen gemeinsam für Bildschirm und Druck in `ProviderRules.tsx`.

Richard Suttons [The Bitter Lesson](https://www.incompleteideas.net/IncIdeas/BitterLesson.html), [METRs Grenzen der Aufgabenhorizonte](https://metr.org/notes/2026-01-22-time-horizon-limitations/) und ARK Invest, _Big Ideas 2026_, bleiben Hintergrund. Sie liefern keine individuellen Übernahmetermine.

## Historie und Speicherung

Neue Checks verwenden `quick-check-7.0`. Bestehende 3.0-, 3.1-, 4.0-, 5.0- und 6.0-Checks behalten ihre Fragen, Antworten und Auswertungsregeln. Die Fragekataloge sind unter `src/quick/methods/` eingefroren; die V4-/V5-/V6-Auswertungen bleiben separat erhalten. Alle sechs Plattform-Methoden unterstützen das Zwei-Jahres-Szenario. Die gespeicherte Methodenversion bestimmt dessen Auswertung. Es wird separat als `providerScenario` mit Version `provider-scenario-1.0` gespeichert und exportiert. Fehlt es in älteren Dateien, gilt mittel/mittel, ohne die Datensätze umzuschreiben. V1/V2 behalten ihre Fragen, Scores, Berichte und damaligen sechs Zukunftsszenarien. Sie werden nicht umgerechnet. Das Archiv der ursprünglichen ausführlichen Analysen bleibt lesbar und exportierbar.

JSON-Schema 1.1 liest weiterhin Schema 1.0 und alle acht unterstützten Methoden. Fragen und Methodenversion werden gemeinsam validiert. Importgrenze: 5 MiB; vollständige Vorschau vor Übernahme, standardmäßig zusätzliche Kopien. Gleiche IDs werden nur auf ausdrückliche Auswahl ersetzt.

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

`npm run dev` startet nur Vite. API-Tests arbeiten ohne Geheimnisse mit einem injizierten Generator; echte Modelltests erfolgen auf einer Vercel-Bereitstellung mit erfundenen Beispielen. Eingaben sind auf 32 KiB begrenzt, V7-Anfragen auf 95 Sekunden einschließlich Recherche und 6.500 Ausgabetokens. Ältere Methoden bleiben bei 45 Sekunden und 4.000/5.000 Ausgabetokens. Der öffentliche Endpunkt benötigt das projektbezogene Gateway-Budget und eine Ratenbegrenzung. Die Anwendung protokolliert bei Fehlern nur Status und feste Fehlerkategorie, keine Prompts oder vollständigen Anbieterfehler. Das Projektbudget beträgt maximal 5 USD pro Monat; der Endpunkt erlaubt fünf Anfragen pro Minute und IP.

## Weiterarbeiten

Einstieg: `src/main.tsx` → `src/quick/QuickApp.tsx`. Neue Fragen liegen in `provider-questions.ts`, V7-Regeln in `provider-analysis-7.ts`; `provider-analysis.ts` wählt anhand der gespeicherten Methode die passende Auswertung. `ProviderRules.tsx` erklärt die Regeln gemeinsam für Bildschirm und Bericht; Score und kompakte Aussagen in `ProviderRiskSummary.tsx`, weitere Ansichten in `Provider*.tsx`, die Gestaltung in `provider.css`. Frühere Kataloge und Berechnungen bleiben unverändert. Inhaltliche Folgeänderungen an der veröffentlichten Methode müssen erneut versioniert werden.

Übergabe: [docs/UEBERGABE_CODEX.md](docs/UEBERGABE_CODEX.md). Umsetzungsplan: [Agenten-Zulieferer und Anbieterabgleich](docs/superpowers/plans/2026-11-09-agenten-zulieferer.md).

Vercel baut mit `npm run build` nach `dist`. Der freigegebene Git-Stand liegt auf `flux`. Ein Push allein ist kein Nachweis einer Veröffentlichung: beim Release 0.8.0 war danach kein neues Produktionsdeployment sichtbar. Direkt veröffentlichen mit `vercel deploy --prod --yes`, anschließend Status und öffentliche Alias-Adresse auf Vercel sowie den Browserablauf prüfen.
