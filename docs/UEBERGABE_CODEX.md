# Übergabe an einen neuen Codex-Chat

## Aktueller Stand: Resilience-Assessment 0.12.0

Stand: 9. November 2026. Die Freitextfelder stehen nach den zwölf Fragen statt auf der Startseite. „Was macht Ihr Unternehmen – und was sollten wir noch wissen?“ und „Wo sehen Sie den Burggraben Ihres Unternehmens?“ bleiben optional. Diktat ist weiter vorhanden. Die bestehende KI kann direkt dort gestartet werden; die fertige Antwort öffnet das Ergebnis. Ohne KI ist der Abschluss ebenfalls möglich. Keine automatische Übertragung.

- `BusinessContext.tsx` ist der letzte Schritt der Methode 7.0. `view=context` wird lokal und im JSON gespeichert und kann über Fortsetzen oder den Verlauf wieder geöffnet werden.
- Derselbe `BusinessAnalysisControl` nutzt unverändert GPT-5.2 über Vercel. Texte, Antworten, Szenario und Quellenabgleich bleiben dieselbe Bewertungsgrundlage. Änderungen an Eingaben brechen eine laufende Auswertung ab; bei einem Fehler bleiben die Eingaben erhalten.
- Fragekatalog, Auswertungsregeln und historische Methoden unverändert. Ergebnisfelder können weiterhin bearbeitet werden.
- Prüfung: 233 Tests, Build; lokaler Browserdurchlauf von Start über alle zwölf Fragen zum Abschluss. Überspringen ohne KI, Speicherung/Wiederaufnahme, unveränderte Übermittlung beider Texte und aller Antworten sowie Ergebniswechsel geprüft. KI-Fehler und Erfolg lokal mit kontrollierten API-Antworten geprüft; Fehler behalten die Texte. Desktop 1440 px und Mobil 390 px ohne Überlauf. Die Modellbewertung selbst wurde in 0.11.0 live geprüft und bleibt unverändert.

---

## Historischer Stand: Resilience-Assessment 0.11.0

Stand: 9. November 2026. Happy-Scribe-Probe zeigte: Der Check erkannte die Angriffe, ließ aber bei überoptimistischen Angaben einen Score von 10 stehen und prüfte keine aktuellen Anbieterfunktionen. David beauftragte den Quellenabgleich, eine Sicherung gegen solche Schutzbehauptungen und die neue Rolle als bezahlter Zulieferer hinter Agenten.

- Methode `quick-check-7.0`, KI-Ausgabe `business-analysis-5.0`. V6-Katalog eingefroren, alte Regeln und gespeicherte Ergebnisse bleiben erhalten. Alle acht Methoden importierbar.
- Zwölf Fragen: Q3 direkte Nutzung und Bezahlung durch Agenten; Q11 Kontrolle über Kundenzugang; Q4 Bedienung separat. V7-Score nutzt nur direkte Ersetzung und austauschbare Anbieter. Bedienung allein zählt nicht als vollständiger Verlust des bezahlten Dienstes.
- Starke Schutzbehauptungen ohne bestätigte Kaufbelege sowie konkrete KI-Beanstandungen öffnen die Score-Spanne. Keine KI-erfundenen Zahlen, kein grünes Niedrig trotz ungeklärten Schutzes. Auch ein bedingter Burggrabenbefund hält hohe Schutzwerte bei optimistischem Q12 offen; Details markieren den Schutz ebenfalls als ungeklärt. Alte KI-Analysen verlieren bei Eingabeänderungen ihre Wirkung.
- `server/provider-research.ts`: feste öffentliche Sachthemen, Parallel Search über bestehendes Gateway, offizielle Anbieter-Domains, tatsächliche Tool-Quellen. Keine Geschäftstexte als Suchanfragen. Quelle, Auszug und ursprünglicher Abrufzeitpunkt werden gespeichert. Bei Ausfall oder unpassenden Belegen keine heutigen Fähigkeiten behaupten.
- `server/agent-analysis.ts`: aktueller Produktabgleich getrennt vom Expertenszenario; ChatGPT-Produkt vs API vs zukünftige Agenten unterscheiden. Standard-SSO, EU-Datenhaltung und Formate nicht automatisch als exklusiven Schutz ausgeben. `agentRole` prüft Beitrag, Auswahlgrund, Bezahlung und Plattformabhängigkeit. Kein pauschaler Rat, nur OpenAI überzeugen zu müssen oder keine Öffentlichkeit mehr zu brauchen.
- `AgentFindings.tsx`: Heute schon möglich mit Quellen, Ihre Rolle hinter der KI, Auswahlgrund und Abhängigkeit. Angreiferszenarien in V7 eingeklappt. Geteilte Komponenten für Bildschirm und Druck. JSON trägt Quellen und neue Felder mit.
- Eingabezitate in V7: falsch wiedergegebene optionale Zitate bei vorhandenem Fragenbezug weglassen; keine erfundenen Ersatzbelege. Quellenzitate müssen tatsächlichen Suchauszügen entsprechen. Frühere strikte Prüfungen bleiben erhalten.
- Budget 5 USD/Monat und Ratenbegrenzung bleiben. V7 max. 95 Sekunden plus 105 Sekunden Browser-Abbruch; Vercel-Funktion 120 Sekunden. Recherche max. 30 Sekunden, bis acht Quellen in zwei parallelen Suchläufen (Kerntätigkeit separat); Modellantwort max. 6.500 Tokens. Erfolgreiche Recherche im Prozess max. sechs Stunden gecacht, ursprünglicher Zeitpunkt bleibt erhalten.

Prüfung: 232 Tests in 20 Dateien, Build und nativer API-Smoke-Test bestanden. Echte KI-Antworten auf Vercel-Vorschau: Happy Scribe 75/100 mit belegter ChatGPT-Audiofunktion; überoptimistische Schutzangaben 0–100 mit „Angaben prüfen“; fiktiver Sensor-Zulieferer 5/100 mit bezahlter Rolle. Ein paralleler Anbieteraufruf war limitiert; der spätere einzelne Aufruf erfolgreich. Budget und Rate wurden nicht angehoben. Browserdurchlauf mit zwölf Fragen, echten importierten KI-Ergebnissen, JSON-Export, Mobil 390 px und Desktop 1440 px ohne horizontalen Überlauf. Live- und JSON-Testartefakte außerhalb von Git: `/private/tmp/e23-v7-qa`. Erste Produktionsprobe bestätigte die neue Zuliefererrolle und den Score, zeigte aber eine Verdrängung der Kerntätigkeit durch Sicherheitsquellen; deshalb bekommt sie einen eigenen Suchlauf. Plan: `docs/superpowers/plans/2026-11-09-agenten-zulieferer.md`.

---

## Historischer Stand: Resilience-Assessment 0.10.0

Stand: 9. November 2026. David will keine Fragen, in denen Nutzer die KI-Zukunft vorhersagen müssen. Das Tool soll den Blick öffnen: günstige, rund um die Uhr und parallel arbeitende Expertenteams stehen Kunden, bekannten Wettbewerbern, bislang unbekannten Anbietern aus anderen Branchen und dem eigenen Unternehmen zur Verfügung. Ergebnisfrage: Hält der behauptete Burggraben auch gegen andere Lösungen des Kundenproblems?

- Neue Methode `quick-check-6.0`; alle zwölf Fragen nach beobachtbaren Geschäftsfakten überarbeitet. Q10 fragt nach einer Lösung durch ein Expertenteam ohne das eigene Angebot. Q11 beschreibt Häufigkeit des Bedarfs; Q12 echte Käufe nach Vergleich mit Alternativen. Keine alte Frage-ID neu interpretieren: V5-Katalog in `methods/quick-check-5.0.json`, alte Auswertung unverändert.
- `ExpertScenarioIntro.tsx`: drei kurze Szenarien vor dem ersten Fragebogen. Keine zusätzlichen Pflichtfelder. `view=intro` wird wie andere Ansichten gespeichert.
- `provider-analysis-6.ts`: direkte Lösung = min(Q1,Q2,Q10) × (0,7+0,3×Q3), Bedienung = min(Q4,Q2), Anbieterwechsel = min(Q5,Q2) × (0,7+0,3×Q3). Daten/Zugänge begrenzen jetzt alle Wege. Schutz weiterhin min(Q6,Q7,Q8). Q11 wirtschaftlicher Anreiz separat; seltene Nutzung ist keine Entwarnung. Q12 verändert den Score nicht. Formeln und Grenzen in README und ProviderRules.
- KI-Ausgabe 4.0 für V6: `expertReview.customer/competitor/newEntrant/access/incentive` als begründete, quellengestützte Hypothesen. `moatReview` bei USP vorhanden, sonst null. Kurze alternative Lösung, verbleibender Kaufgrund, Burggraben und nächster Test. Hauptaussagen maximal 240 Wörter, Ziel 180. Hintergrundtitel und nicht gerenderte Modellzusammenfassungen werden nicht gegen die Haupttextgrenze gezählt; alle Textfelder bleiben einzeln begrenzt. Eine zu breite Wortzählung hatte längere Szenario-Antworten als 502 verworfen und wurde mit Regressionen korrigiert. API-Fehler liefern nur feste Kategorien in X-Analysis-Failure, niemals Modelltext oder Eingaben. Ausgabelimit 5.000 Tokens; bisherige Methoden weiter 4.000. Timeout 45 s, Budget und Rate unverändert.
- Prompt prüft andere Lösungswege statt bloßen Nachbau. Keine erfundenen Konkurrentennamen, Marktgrößen, Profite oder Markteintritte. Wirtschaftliche Absicht liegt bei Unternehmen/Kunden, nicht bei der KI. Expertenniveau bleibt Annahme; keine allgemeine Fähigkeits- oder Datumsbehauptung für 12–18 Monate. Drei Angreifer in der Hauptansicht, Zugang/Anreiz und Herkunft aufklappbar; Bildschirm/PDF teilen Komponenten.
- Zwei-Jahres-Regler bleiben zwei unabhängige Szenarien. Besser = mehr Aufgaben auf Expertenniveau; billiger = mehr parallele Einsätze für alle. Keine Rechte/Daten aus höheren Fähigkeiten oder niedrigeren Kosten ableiten.
- Plan und Quellen: `docs/superpowers/plans/2026-11-09-expertenszenario.md`. Suttons The Bitter Lesson begründet skalierbare Suche/Lernen, keinen Übernahmetermin. METR-Aufgabenhorizonte sind domänen- und zuverlässigkeitsabhängig. Quellen am 9.11.2026 geprüft; Original-Sutton-Seite zeitweise nicht erreichbar, identischer Originaltext über PDF-Spiegel gelesen.
- Regressionen in `tests/provider-v6.test.ts`: Datenzugang, verschiedene Übernahmewege, Nische/Anreiz, unabhängige Tempi, drei Angreifer, Prompt und Ausgabeversion, Herkunft, Export/Import, Bericht und echte API-Validierung. Frühere Tests ausdrücklich auf V5 festgelegt.

Prüfung vor Veröffentlichung: 208 Tests in 19 Dateien bestanden, TypeScript/Vite-Build und nativer API-Smoke-Test erfolgreich. Lokaler Browser: drei Szenarien, alle zwölf Fragen, mobiler Ergebnisbericht, Speicherung/Wiederöffnung, veraltete KI-Ausgabe nach USP-Änderung und unveränderter V5-Check geprüft. Desktop 1440 und Mobil 390 ohne horizontalen Überlauf; keine Konsolenfehler. Die lokalen KI-Antworten waren kontrollierte Testausgaben; echte Modellantworten separat auf Vercel prüfen.

Veröffentlichung bleibt über `flux` auf https://e23-resilienz-check.vercel.app. Arbeitsbranch `codex/quick-check`. Git-Stand, Vercel-READY und Alias nach Veröffentlichung separat prüfen. Browser-QA nutzt fiktive Fälle und keine fremden Geschäftsdaten.

---

## Historischer Stand: Resilience-Assessment 0.9.0

Stand: 9. November 2026. David möchte einen eigenen USP oder Moat frei beschreiben und von KI kritisch gegen eine Intelligenzexplosion prüfen lassen. Minimalismus und die bestehende Veröffentlichungserlaubnis gelten weiter.

- Optionales Feld „Was macht Ihr Angebot schwer ersetzbar?“ auf der Startseite und im Ergebnis unter „Business und Vorteil“. `businessMoat`, höchstens 2.000 Zeichen, nur Methode 5.0. Speicherung in IndexedDB, JSON und Druckbericht; Änderungen machen die KI-Auswertung veraltet.
- „Mit KI prüfen“ sendet Beschreibung, Vorteil, Antworten und Szenario erst auf Klick. Auch ein allein angegebener, vager Vorteil kann geprüft werden. Kein automatisches Senden.
- Zusätzlicher Befund „KI-Prüfung Ihres Vorteils“: ersetzbar, bedingter Schutz, verbleibende Hürde oder unklar; ein kurzer Grund und ein Auslöser (Funktionsupdate, bessere Agenten, äußere Hürde). Keine erfundenen Vernichtungsdaten oder aktuellen Anbieterfähigkeiten. Unklare Angaben verlangen eine konkrete Rückfrage.
- Der Server prüft die Behauptung unter der Annahme sehr starker, günstiger Agenten. Prompts, Oberflächen, komplexer Code oder heutige Modellschwächen gelten nicht automatisch als Schutz. Daten, Rechte und Ausführung müssen weiterhin nötig, schwer ersetzbar und kaufrelevant sein. Keine erfundenen Belege; Anweisungen in beiden Textfeldern ignorieren.
- Kritik fließt in Kaufgrund und nächsten Test ein. Zwölf Fragen und Score-Formel bleiben unverändert (`quick-check-5.0`). Bei ersetzbarem Vorteil und Score unter 65 werden Headline und Score als Widerspruch markiert; keine KI-erfundene Zahl.
- Ausgabe mit Vorteil `business-analysis-3.0`, sonst weiterhin 2.0 (V5) bzw. 1.0 (V4). Strikte Schema-, Methoden- und Originalzitatprüfung. Historische Methoden und alte gespeicherte Ausgaben bleiben erhalten. API-Größenlimit jetzt 32 KiB für beide Textfelder einschließlich Unicode.
- Neue Komponenten/Regressionen: `BusinessMoat.tsx`, `tests/business-moat.test.ts`; gemeinsame Anzeige im Bildschirm und Bericht. 195 Tests, TypeScript/Vite-Build und nativer API-Smoke-Test bestanden.

Produktion: https://e23-resilienz-check.vercel.app. Release über `flux`; Vercel-Status und Alias separat prüfen. Arbeitsbranch `codex/quick-check`. Lokaler QA-Server `127.0.0.1:5197` muss bei Wiederaufnahme auf Erreichbarkeit geprüft werden. Temporäre Browserartefakte in `.playwright-mcp/` sind von Git und Vercel ausgeschlossen.

---

## Historischer Stand: Resilience-Assessment 0.8.0

Stand: 9. November 2026. David hat den Umbau auf KI-Risiko-Score, konkrete Übernahme und verbleibenden Kaufgrund sowie die erneute Veröffentlichung ausdrücklich beauftragt. Kurz und minimalistisch bleiben.

- Neue Methode `quick-check-5.0`: Q1 digitales Ergebnis, Q2 auch ohne eigenen Anbieter erhältliche Mittel, Q3 direkter Assistentenzugang, Q4 Bedienung, Q5 austauschbare Anbieter, Q6 weiter nötiger Beitrag, Q7 schwere Ersetzbarkeit, Q8 zusätzlicher Kaufgrund, Q9 heutige KI-Leistung, Q10 schwindender KI-Vorsprung, Q11 eigener Nutzen, Q12 Kaufbelege.
- `provider-analysis-5.ts`: stärkster von drei Übernahmewegen statt Durchschnitt; Schutz nur als Minimum aus Q6/Q7/Q8. Q11 und Q12 werden nicht in Risiko verrechnet. Score 0–100 in Fünferschritten; unbekannte oder widersprüchliche Angaben ergeben eine Spanne. Keine empirisch kalibrierte Überlebenswahrscheinlichkeit. Formeln und Szenariogewichte in README und `ProviderRules.tsx`.
- Zwei-Jahres-Befunde nutzen Q9 als Ausgangslage. Tempoannahmen verändern den angenommenen Übernahme- und Preisdruck, nicht nur Adjektive. Der grundlegende Stresstest-Score bleibt unabhängig. Fehlender heutiger Vergleich bleibt sichtbar.
- Kompakte Hauptansicht: Score, klares Urteil, „Was KI übernimmt“, „Wofür Kunden weiter zahlen“, ein Test. Details aufklappbar. Bildschirm und PDF teilen `ProviderRiskSummary.tsx`. Verlauf zeigt den Score.
- Business-Beschreibung konkretisiert die drei Kernaussagen. Server erhält berechneten Score, verbleibenden Kaufgrund und Widersprüche. Modell unterscheidet Ergebnisersetzung, weiter benötigte Technik hinter dem Agenten und austauschbare Zulieferer. Keine Modell-erfundenen Zahlen. Übertragung weiterhin nur nach Klick.
- KI-Ausgabe `business-analysis-2.0`; alte 1.0-Ausgaben zur V4 bleiben lesbar. Eingabe-Methoden 4.0 und 5.0 werden getrennt interpretiert; Analyse und gespeicherter Check müssen dieselbe Methode haben. Änderungen machen KI-Texte weiterhin veraltet.
- V4-Katalog zusätzlich in `methods/quick-check-4.0.json` eingefroren. V1–V4-Auswertungen unverändert. JSON-Schema weiter 1.1, jetzt sechs Methoden. Historische Tests nutzen ausdrücklich ihre damaligen Kataloge.
- Prüfung: `npm test -- --pool=threads`, `npm run build`, `npm run test:api`, `git diff --check`. Neue Regressionen in `tests/provider-v5.test.ts`: Transkription, bezahlte Technik, Kundenzugang bei physischer Ausführung, Schutz als gemeinsame Bedingung, fehlende und widersprüchliche Angaben, getrennte Evidenz, Szenarien, Bildschirm/PDF, Import/Export und Beschreibungskontext.
- Browser-QA nutzt Playwright, weil der Browser-Plugin-Skill hier nicht verfügbar ist. Temporäre Artefakte in `.playwright-mcp/` sind von Git und Vercel ausgeschlossen. Der lokale Prüfserver läuft auf `127.0.0.1:5197`; bei Wiederaufnahme prüfen.

Produktion: https://e23-resilienz-check.vercel.app. Freigegebener Git-Stand auf `flux`. Beim Release 0.8.0 war nach dem Push kein neues Produktionsdeployment sichtbar; daher direkt mit `vercel deploy --prod --yes` veröffentlichen. Vor jedem Release Remote-Stand prüfen; aktuelles Deployment separat über Vercel bestätigen.

---

## Historischer Stand: Resilience-Assessment 0.7.0

Stand: 7. November 2026. David möchte konkrete Aussagen zu seinem Geschäft aus Business-Beschreibung und zwölf Antworten. Die frühere Veröffentlichungserlaubnis und die Vorgabe kurzer, konkreter Texte gelten weiter.

- Optionaler Klick „Mein Business auswerten“ im Ergebnis. Sendet ausschließlich Beschreibung, Antworten und Zwei-Jahres-Szenario an OpenAI über Vercel. Hinweis direkt am Button; keine automatische Übertragung beim Tippen oder bei Szenarioänderungen.
- Fester Serveraufruf: GPT-5.2, nur OpenAI-Route mit Zero-Data-Retention-Filter, Vercel-OIDC, AI SDK 7. Keine lokal exportierten Zugangsdaten. Claude war im vorhandenen Free-Credit-Tarif gesperrt; GPT-5.2 ist freigegeben. Kein Guthaben gekauft und keine automatische Aufladung aktiviert.
- Kurzes Ergebnis: mögliche Übernahme, Schutzbedingung, eigener KI-Nutzen, ein Praxistest. Maximal 180 sichtbare Wörter. Herkunftszitate und Fragebezüge aufklappbar. Keine externe Recherche, keine bewiesenen Geschäftsprognosen. Fehlende Informationen oder Widersprüche bleiben sichtbar.
- `businessAnalysis` enthält Version, Datum, Modell und exakten Eingabestand. Änderungen an Beschreibung, Antworten oder beiden Tempi machen die Analyse veraltet; sie wird nicht als aktuelles Ergebnis angezeigt oder gedruckt. JSON und IndexedDB erhalten sie. Alte Methoden werden nicht neu interpretiert.
- API in `api/business-analysis.ts`, Generator/HTTP-Validierung in `server/business-analysis.ts`, gemeinsame Schemas in `src/quick/business-analysis.ts`, UI in `BusinessAnalysis.tsx`. Native Node-Imports benötigen `.js`-Endungen und JSON-Importattribute; Fragen und historische Auswertungsregeln wurden nicht verändert.
- Projektbudget: maximal 5 USD pro Monat. WAF: fünf POST-Aufrufe auf `/api/business-analysis` pro Minute und IP; aktives Projekt `prj_dmsZxfaIZ8ikyKVYI2jBgmjYmp9f`. Größe 20 KiB, Modelllaufzeit 45 Sekunden, maximal 4.000 Ausgabetokens einschließlich Reasoning. Fehlerprotokoll enthält nur Status und feste Fehlerkategorie, keine Geschäftstexte oder vollständigen Anbieterfehler.
- Prüfen mit `npm test -- --pool=threads`, `npm run test:api`, `npm run build`, `git diff --check`. API-Smoke-Test kompiliert und lädt die tatsächliche Serverfunktion unter nativem Node ohne Modellaufruf. `npm run dev` startet nur Vite.

Details und Abnahme: `docs/superpowers/plans/2026-11-07-business-auswertung.md`. Produktion bleibt https://e23-resilienz-check.vercel.app; Git-Branch `flux` löst automatisch eine Veröffentlichung aus. Den tatsächlichen Live-Stand bei Wiederaufnahme über Vercel prüfen.

---

## Historischer Stand: Resilience-Assessment 0.6.0

Stand: 7. November 2026. Dieser Abschnitt ersetzt die nachfolgenden historischen Angaben. David hat die Überarbeitung der zwölf Fragen und der Auswertung sowie die erneute Veröffentlichung auf Vercel ausdrücklich beauftragt. Minimalismus bleibt verbindlich: kurze Fragen, kurze Skalenanker, Hilfen unter „Details“, Befunde und Schritte aufklappbar.

- Neue Methode `quick-check-4.0`: Q1 digitale Leistung, Q2 beim Kunden verfügbare Daten/Programme, Q3 vorhandene Plattform, Q4 Vorteil durch heutige KI-Schwächen, Q5 exklusive Daten, Q6 Netzwerke, Q7 Ausführung vor Ort, Q8 verbindliche Ergebnisverantwortung, Q9 Wechselaufwand, Q10 Rechte/Zugänge, Q11 eigener Nutzen besserer KI, Q12 Weiterzahlung nach KI-Vergleich.
- Risiken getrennt: Arbeit übernehmen Q1/Q2, im Paket mitliefern Q1/Q2/Q3, KI-Vorsprung einholen Q4. Fehlende erforderliche Antworten haben Vorrang und lassen den Weg offen; sonst alle ab 7 hoch, alle ab 4 teilweise, mindestens ein Wert bis 3 mit Hürden.
- Sechs mögliche Schutzfaktoren Q5–Q10, eigener Nutzen Q11 und Belege Q12 bleiben unabhängig. Weder Schutz noch eigener Nutzen werden vom Risiko abgezogen. Kein Gesamtscore, keine Überlebenswahrscheinlichkeit, kein automatischer Schutz durch präzise Berechnungen, Datenschutz oder Zusagen.
- Szenario weiterhin genau zwei Jahre und zwei unabhängige Tempi. „KI wird besser“ zeigt mögliche Übernahme UND eigenen Nutzen. „KI wird günstiger“ betrifft Preis-/Bündelungsdruck anhand Q1/Q2 bzw. Q1/Q2/Q3. Keine Preiswirkung aus Q4/Q11 ableiten. Struktur und Schutz bleiben unverändert.
- Bildschirm und Bericht nutzen dieselben Befunde, Szenarien und versionierten Regeln. Neue Dateien: `provider-analysis-4.ts`, `ProviderRules.tsx`. Die bestehende Schnittstelle `provider-analysis.ts` routet exakt nach gespeicherter Methode.
- V3.1-Fragen in `methods/quick-check-3.1.json`, V3.0/V3.1-Regeln und Szenarioauswertung in `methods/provider-analysis-3.ts` eingefroren. Keine alten Antworten umdeuten. Alte Checks zeigen einen kurzen Hinweis und können separat neu gestartet werden. V1/V2 bleiben unverändert.
- JSON-Schema 1.1, fünf Methoden, Szenarioformat `provider-scenario-1.0`. Strenge Snapshot-/Methodenprüfung bleibt bestehen. Business-Beschreibung und Diktat sind unverändert; Text wird gespeichert, nicht von KI ausgewertet.

Validierung vor Veröffentlichung: **152 Tests in 14 Dateien bestanden**, TypeScript/Vite erfolgreich, Diff sauber. Zuerst 17 fehlgeschlagene V4-Regressionen reproduziert, dann implementiert. Prüfungen decken Grenzwerte, unabhängige Befunde, unbekannte Antworten, alle neun Tempokombinationen, V3-Historie, JSON und Bildschirm-/Berichtsinhalte ab. Browser auf `http://localhost:5183/`: vollständiger neuer Check mit Beschreibung, offene Frage, Korrektur per Tastatur, Tempi schnell/langsam, Neuladen und Wiederöffnung, alter 3.1-Check mit ursprünglicher Auswertung. Desktop 1280, Mobil 390/320 px ohne horizontalen Überlauf, keine Konsolenfehler. Nutzerdaten unter `127.0.0.1` nicht bearbeitet. Screenshots außerhalb des Repositories im bestehenden `e23-plattform-check`-Prüfverzeichnis, Präfix `v4-`.

Grenzen: Native PDF-Ausgabe weiterhin nicht visuell abgenommen; Berichtsinhalte automatisiert geprüft. Diktat wurde bisher mit simulierten Browserereignissen geprüft, keine echte Mikrofonaufnahme gestartet.

Veröffentlichung ausdrücklich autorisiert über Git-Branch `flux` → Vercel. Arbeitsbranch `codex/quick-check`. Produktionsadresse: https://e23-resilienz-check.vercel.app. Deployment nach Push separat auf READY und auf der öffentlichen Seite prüfen; bei späteren Aufgaben aktuellen Remote-/Deployment-Stand erneut ermitteln. Letzter vor dieser Änderung geprüfter Produktionscommit: `e4bd89f` (0.5.1).

---

## Historischer Stand: Plattform-Check 0.5.1

Stand: 7. November 2026. **Dieser Abschnitt ersetzt die unten dokumentierte frühere Produktrichtung.** Der neue Umbau ist umgesetzt; David hat die Veröffentlichung auf Vercel ausdrücklich beauftragt. Arbeitsbranch: `codex/quick-check`, Produktionsbranch: `flux`. Die öffentliche Adresse ist `https://e23-resilienz-check.vercel.app`. Deployment- und Remote-Stand bei einem späteren Auftrag erneut prüfen.

David hat die Leitfrage bestätigt: **„Was bleibt von deinem Geschäft, wenn der KI-Anbieter deiner Kunden deine Leistung selbst übernimmt?“** Der konkrete Auftrag war, das Tool mit einfachen Fragen auf „Was können die KI-Anbieter übernehmen und was schützt mein Geschäft wirklich?“ umzubauen. Die Richtung und Umsetzung sind autorisiert; keine erneute Konzeptfreigabe nötig.

### Neue Methode und Oberfläche

Textkorrektur im selben Auftrag: David will deutlich mehr Minimalismus und direkte Sprache. Einstieg jetzt **„Wird ein KI-Gigant Ihr Business vernichten?“**, Nutzenzeile **„Was kann KI übernehmen? Was schützt Ihr Geschäft?“**, Button **„Assessment starten“**. Produktbezeichnung: **Resilience-Assessment**. Auswahl „Bestehendes Angebot / Neue Idee“, langer Einstieg und drei Erklärungskästen entfernt. Ein Klick startet die erste Frage; neue Einträge heißen neutral „Assessment“. Bestehende Datensätze und Fragen-Snapshots bleiben unverändert. Keine zusätzliche Auswahl oder Erklärungsschicht wieder einbauen.

- `quick-check-3.1`: zwölf gekürzte Fragen mit kurzen Skalenankern. Auf Davids anschließenden ausdrücklichen Wunsch bestehen Fragenansichten nur aus Fortschritt, Frage, Skala und Navigation. Hilfen und Beispiele liegen unter „Details“, die Bereichsnavigation ist entfernt. Dies ersetzt die frühere Präferenz für ständig sichtbare Erklärungen. Direkter Einstieg, Skala 1–10, unbekannte Antwort, gelbe Bestätigung und automatische Weiterleitung bleiben erhalten.
- Die früheren 3.0-Fragen sind in `src/quick/methods/quick-check-3.0.json` eingefroren. Vorhandene Entwürfe behalten ihre ursprünglichen Fragen und Antworten, erhalten aber die kompakte Darstellung. `isProviderMethod` routet 3.0 und 3.1 gemeinsam; Schwellen und Zuordnung sind unverändert. Keine stille Umrechnung, kein Gesamtscore für beide Methoden.
- Annahme: nahezu unbegrenzt sehr leistungsfähige digitale Agenten mit freigegebenem Unternehmenskontext. Kein Eintrittsdatum, keine automatische Verfügung über exklusive Daten, besondere Rechte oder körperliche Ausführung.
- Drei getrennte Übernahmen: digitale Arbeit (Q1/Q2/Q3), im vorhandenen Paket mitliefern (Q1/Q2/Q4), Oberfläche umgehen (Q4/Q5/Q6).
- Vier mögliche Schutzfaktoren Q7–Q10 und zwei Belegfragen Q11/Q12. Keine Durchschnittsnote, kein Verrechnen von Vorteil und Risiko. Unbekannte Angaben ergeben keine Entwarnung. Eine Schutzbehauptung ist noch kein belegter Wettbewerbsvorteil.
- Ergebnis: eine kurze Kernaussage, nebeneinander Übernahme und Schutz, darunter bis zu drei kurze Schritte. Befunde, Belege und Schritte sind aufklappbar; der Druckbericht öffnet dieselben Details vollständig. Fehlende Antworten und Belege bleiben im geschlossenen Ergebnis sichtbar. Antwortkorrektur führt unmittelbar zurück zum aktualisierten Ergebnis.
- Auf ausdrücklichen Folgeauftrag: im Ergebnis „Nächste 2 Jahre“, zwei unabhängige Auswahlzeilen „KI wird besser“ / „KI wird günstiger“, jeweils langsam/mittel/schnell, Standard mittel/mittel. Je ein kurzer Hinweis reagiert auf das Tempo und den stärksten erkennbaren Übernahmeweg. Fähigkeiten betreffen Übernahme, Kosten Preis-/Bündelungsdruck. Keine neuen Fragen, Preisfaktoren oder Wahrscheinlichkeiten. Grundbefunde und Schutz bleiben getrennt und unverändert. Regeln in `provider-scenario.ts`, Auswertung in `provider-analysis.ts`, gemeinsame Bildschirm-/Druckansicht in `ProviderScenario.tsx`.
- Weiterer Folgeauftrag: optionales Feld „Was macht Ihr Business?“ direkt vor dem Start, mit „Diktieren“/„Stopp“. Bis 5.000 Zeichen; ab Start als `businessDescription` beim Check gespeichert, in JSON und Bericht enthalten, im Ergebnis unter „Ihr Business“ bearbeitbar. Beschreibung dient als Kontext und wird nicht durch KI ausgewertet; zwölf Antworten bleiben Bewertungsbasis. `BusinessDescription.tsx` + `dictation.ts`: Browser-Web-Speech-API einschließlich WebKit, de-DE, keine eigene API und keine Audiodatei. Audio kann zum Browser-Sprachdienst gehen; Hinweis direkt am Feld. Mikrofon erst auf Klick. Bei fehlender Unterstützung, verweigerter Berechtigung oder Dienstfehler bleibt Texteingabe möglich. Beim Stopp letzte Ergebnisse abwarten, beim Verlassen abbrechen, veraltete Events ignorieren.
- ARK Invest, _Big Ideas 2026_, S. 20/34 (Tokenkosten), 33 (Aufgabenhorizonte), 26–28 (Agenten als Zugangsschicht), 36 (Spezialisten). Nur als Hintergrund; keine Marktprognosen im Ergebnis. Ergänzende offizielle Quellen stehen in `ProviderMethod.tsx` und im Bericht.

### Kompatibilität und Dateien

V1 und V2 behalten ihre Fragen, Scores und Szenarien. Die ursprünglichen Methoden werden weiterhin angezeigt, berechnet, gespeichert, importiert und gedruckt. Neue V3-Checks enthalten keine alten Zukunftsszenarien; entsprechende Mischimporte werden abgelehnt. Datenbanken und JSON-Schemaversion 1.1 bleiben erhalten.

Die neuen V3-Tempoannahmen stehen separat in `providerScenario` (`provider-scenario-1.0`, fester Horizont 2 Jahre), automatisch gespeichert und im JSON erhalten. Ohne das optionale Feld gilt mittel/mittel; alte Fragen und Antworten werden nicht verändert. Ungültige Tempi, andere Horizonte und Kombinationen mit historischen Score-Methoden werden abgewiesen. Der Zwei-Jahres-Blick ist ein qualitatives Szenario; heutige Leistung beim konkreten Auftrag wird nicht gemessen. Keine kalibrierte Vorhersage ergänzen oder aus ARK ableiten.

Neue Dateien: `src/quick/provider-questions.ts`, `provider-analysis.ts`, `ProviderLanding.tsx`, `ProviderResults.tsx`, `ProviderReport.tsx`, `ProviderMethod.tsx`, `provider.css`. Gemeinsame Integration: `model.ts`, `QuickApp.tsx`, `Question.tsx`, `History.tsx`, `Report.tsx`, `Results.tsx`. Historische Kataloge unverändert.

Plan und Validierung: `docs/superpowers/plans/2026-11-07-plattform-check.md`. Neue Regressionen: `tests/provider.test.ts`; frühere Score-/Szenariotests verwenden explizite historische Methoden. Der echte Browserablauf wurde auf einer getrennten lokalen Adresse `http://127.0.0.1:5183/` mit synthetischen Antworten geprüft. Erreichbarkeit eines weiterlaufenden Servers bei Wiederaufnahme prüfen.

Letzte Erweiterung geprüft: 113 Tests in 11 Dateien, Build und Diff sauber. Szenario-Auswahl auf separater Test-Origin `http://localhost:5183/` mit unabhängigen Tempi, Tastatur, Neuladen und Wiederöffnen geprüft; Desktop 1280 sowie Mobil 390/320 px ohne Überlauf oder Konsolenfehler. Nutzerdaten unter `127.0.0.1` wurden dafür nicht bearbeitet. Die nativen PDF-Dialoggrenzen aus dem Plan gelten weiter; Berichtsinhalte sind automatisiert geprüft.

Beschreibung/Diktat: **132 Tests in 13 Dateien** sowie Build erfolgreich. Text → kompletter Check → Ergebnis → Beschreibung ändern → Neuladen/Wiederöffnen im Browser geprüft. Diktat-Lebenszyklus mit simuliertem Browserdienst getestet (Zwischenergebnisse, Duplikate, Stopp, späte Events, Mikrofon-/Netzfehler und Längenlimit). Keine echte Mikrofonaufnahme auf Davids Gerät gestartet; diese Grenze bei Aussagen zur Sprachprüfung beachten. Native PDF-Ausgabe weiterhin nicht visuell abgenommen, Berichtstext automatisiert geprüft.

**Veröffentlichung:** Version 0.5.0 wurde nach ausdrücklichem Auftrag als `de8461a` nach `flux` gepusht; Vercel meldete `READY`, Startseite und beide Tempoeinstellungen waren öffentlich geprüft. Die Folgeergänzung 0.5.1 verwendet denselben Veröffentlichungsweg. `flux` löst automatisch Vercel aus. Nicht aus den nachfolgenden historischen Abschnitten auf den aktuellen Live-Stand schließen.

---

## Historischer Stand: Expertenteam 0.4.0

Die folgenden Abschnitte dokumentieren den vorherigen, damals veröffentlichten Stand. Seine Funktionen bleiben für frühere Checks erhalten; sie sind nicht mehr der Einstieg für neue Checks.

Stand damals: 7. November 2026 · Anwendungsversion 0.4.0

## 1. Projekt und verifizierter Stand

Du übernimmst den **e23 KI-Resilienz-Check** von David Wegener. Das Projekt ist eigenständig und strikt von ViralFlux getrennt.

- Lokaler Projektordner: `/Users/davidwegener/Documents/e23_resilienz`
- Repository: https://github.com/Fliegenbart/e23-resilienz-check
- Produktionsbranch auf GitHub: **`flux`**, nicht `main`.
- Aktueller lokaler Arbeitsbranch bei Übergabe: `codex/quick-check`.
- Öffentliche Anwendung: https://e23-resilienz-check.vercel.app
- Letzter fachlicher Implementierungscommit: `0b10b2c54272a2109045a748918e7acff5585e11` – Expertenteam-Modell mit versionstreuer Historie.
- Vorherige relevante Commits: `382ec83` (Erklärungen und Beispiele), `a60c1ae` (Szenariosimulation).

Bei Erstellung dieser Übergabe waren lokaler HEAD und GitHub `refs/heads/flux` auf demselben Implementierungscommit. Der Arbeitsbaum war sauber. Vercel meldete das zugehörige Produktionsdeployment als **Ready**, einschließlich des öffentlichen Alias. Dieser Übergabe und den Abnahmedateien folgt ein eigener Dokumentationscommit. Den aktuellen Remote-Stand bei Wiederaufnahme erneut prüfen.

**Der zuletzt beauftragte Produktumbau ist umgesetzt und veröffentlicht. Es besteht kein ausdrücklich offener neuer Feature-Auftrag.** Übernimm den Kontext und setze an Davids nächster konkreter Bitte an.

## 2. Was David mit dem Produkt erreichen will

Das Werkzeug soll Unternehmern verständlich zeigen, wodurch ihr konkretes Angebot bei sehr günstiger, leistungsfähiger digitaler Arbeit angreifbar wird und wo belastbare Vorteile oder eigene Chancen liegen.

David hat die ursprüngliche ausführliche Workshopanwendung als zu kompliziert empfunden. Seine verbindliche Richtung:

- Keine erforderlichen Textfelder oder langen Formulare.
- Eine Frage pro Bildschirm, anklickbare Werte von 1 bis 10 und „Weiß ich noch nicht“.
- Nach Auswahl etwa **450 ms gelbe Bestätigung**, dann automatisch weiter. Das gilt auch für unbekannte Antworten. Kein zusätzlicher Weiter-Button.
- Hochwertiger Consulting-Auftritt, an EY orientiert: Weiß, Graphit, Gelb, große klare Typografie, zurückhaltende Animationen und gute mobile Bedienung. Der dritte damalige Entwurf wurde ausgewählt (`design/03-ergebnis.png`).
- Konkrete Erklärungen und Beispiele sichtbar an den Fragen. Wichtige Hilfen nicht ausschließlich hinter einem kleinen Info-Symbol verstecken.
- Deutsch und verständlich; keine Entwicklerdetails im normalen Kundenablauf.

**Die wichtigste letzte Änderung:** Menschen können abstrakte „KI-Fähigkeiten“ kaum bewerten. Eine Frage wie „Wie leicht kann KI Ihre Kernleistung ersetzen?“ verlangt bereits das Ergebnis, das der Check erarbeiten soll. Stattdessen sollen Nutzer greifbare Nachbau-, Zugangs-, Wechsel- und Umsetzungshürden beurteilen.

## 3. Das freigegebene Expertenteam-Gedankenexperiment

Neue Checks beginnen mit:

> Ihr stärkster Wettbewerber bekommt zehn Weltklasseexperten Ihres Fachgebiets. Sie arbeiten sechs Monate lang rund um die Uhr, praktisch kostenlos. Sie können recherchieren, entwickeln, testen und aus Fehlern lernen. Ihr Auftrag: Ihren Kunden denselben Nutzen bieten wie Sie.

Das Team erhält keine exklusiven Daten, Nutzungsrechte, Kundenbeziehungen, Maschinen oder Zulassungen automatisch. Es kann Fehler machen. Körperliche Ausführung bleibt eine eigene Hürde; zusätzliche Robotik wird gesondert angenommen.

Im stärkeren Szenario reicht die angenommene Fähigkeit bis zu den klügsten Forschern und Wissenschaftlern des Fachgebiets, bis auf Nobelpreisniveau, wo dieser Vergleich passt. **Das ist ausdrücklich eine Stresstest-Annahme, keine Behauptung über heute gemessene Systeme oder einen vorhergesagten Zeitpunkt.** Keine erfundenen Eintrittswahrscheinlichkeiten und keine automatische Ableitung von Superintelligenz aus sinkenden Rechenkosten.

Davids „ja“ bestätigte diesen Umbau. Er ist bereits umgesetzt; nicht erneut nach einer grundsätzlichen Freigabe für dasselbe Konzept fragen.

## 4. Aktueller Funktionsumfang und Bewertung

### Zwölf-Fragen-Check

Vier Bereiche mit je drei Fragen: Kundenwert, Wettbewerb, Differenzierung, Handlungsfähigkeit. Neue Fragen liegen in `src/quick/expert-questions.ts`. Sie betreffen beobachteten Bedarf, tatsächliche Käufe, vollständige Kosten, Nachbau durch das Expertenteam, Bündelung in bestehenden Produkten, Wechsel zu einer günstigen Alternative, besondere Daten/Zugänge, Kundennutzen, Zugang zu Käufern, Dienstausfall, Fehlerprüfung und Anpassung innerhalb von sechs Monaten.

Formel: `round(100 × Summe(Antwort − 1) / 108)`.

- Alle zwölf Fragen gleich gewichtet; höhere Werte bedeuten mehr Risiko bzw. größere Lücken.
- Gesamtscore erst bei zwölf numerischen Antworten. Unbekannt oder leer ist nicht 0 und nicht niedriges Risiko.
- Teilbereiche erst bei drei numerischen Antworten.
- Einzelwerte 9/10 zusätzlich sichtbar, auch bei niedrigem Durchschnitt.
- Risikobänder: 0–24 niedrig, 25–49 mittel, 50–74 erhöht, 75–100 hoch.
- Eigene Beratungsheuristik auf Basis von Selbsteinschätzungen, kein empirisch kalibriertes Prognosemodell.

### Sechs Zukunftsszenarien

1. Dasselbe Expertenteam, günstiger: gleiche Fähigkeiten, digitale Arbeit 10× günstiger, keine neue Robotik.
2. Expertenteams für alle: gleiche Fähigkeiten, 100× günstiger, keine neue Robotik.
3. Die klügsten Forscher im Team: höhere Fähigkeiten, 100× günstiger, keine neue Robotik.
4. Das Team bekommt Roboter: gleiche Fähigkeiten, 100× günstiger, Routine-Robotik.
5. Forscherteam mit Robotern: höhere Fähigkeiten, 100× günstiger, dieselbe Routine-Robotik.
6. Das Team kann auch körperlich handeln: höhere Fähigkeiten, 100× günstiger, flexible Robotik.

Kontrollierte Vergleiche: 1/2 Kosten, 2/3 Fähigkeiten, 2/4 Robotik, 4/5 Fähigkeiten, 5/6 flexible körperliche Ausführung. Diese Trennung erhalten.

Anklickbare Einstellungen: digitales/gemischtes/physisches Angebot; **6, 18 oder 36 Monate Anpassungszeit**. In Szenarien gilt das gewählte Fenster, nicht pauschal die sechs Monate des Grundchecks. Eigene Firma, Kunden und Wettbewerber erhalten Zugang zu denselben angenommenen Fähigkeiten.

Jedes Szenario hat vier Risikoantworten und eine separate Chancenfrage. Risikoformel: `round(100 × Summe(Antwort − 1) / 36)`; nur bei vier numerischen Risikoantworten. **Die eigene Chance 1–10 wird niemals vom Risiko abgezogen.** Keine rechnerische Differenz zwischen Szenarioscore und Zwölf-Fragen-Score: unterschiedliche Fragebögen.

Neue Bewertungen kopieren Einstellungen und Szenarioannahmen. Andere Einstellungen für einen neuen Durchlauf verändern frühere Stände nicht. Bis zu 60 Szenariostände pro Check.

Optionaler technischer Kostenrechner: heutiger KI-Kostenanteil unbekannt/0/25/50/75/100 %. Formel für die Gesamtkostenersparnis: `Anteil × (1 − 1 / Faktor)`. 25 % und Faktor 10 ergeben 22,5 %, Faktor 100 ergibt 24,75 %. Unbekannt erzeugt keine Zahl. Andere Kosten bleiben gleich; keine pauschale Umrechnung in Personalabbau, Umsatz, Marge oder Robotikkosten.

## 5. Historie und Daten dürfen nicht stillschweigend verändert werden

Aktuelle Methoden: `quick-check-2.0` und `scenario-stress-2.0`. JSON-Schema: `1.1`, ältere Exporte `1.0` bleiben lesbar.

Originale V1-Kataloge sind eingefroren:

- `src/quick/methods/quick-check-1.0.json`
- `src/quick/methods/scenario-stress-1.0.json`

Fragen, Antworten, Maßnahmen, Anzeige und PDF müssen jeweils den gespeicherten Methodenstand verwenden. V1-Antworten werden nicht auf V2-Fragen übertragen. Alte und neue Stände können gemeinsam gespeichert/importiert/exportiert werden. Falsche Versions-/Snapshot-Zuordnungen werden abgewiesen.

Bei älteren Checks erklärt ein sichtbarer Hinweis den früheren Fragenstand und bietet **„Neuen Expertenteam-Check starten“** an. Deshalb ist es korrekt, wenn eine alte Bewertung noch die ursprüngliche KI-Frage zeigt. Für neue Fragen einen neuen Check starten. Scores unterschiedlicher Methoden nicht unmittelbar vergleichen.

Bei späteren inhaltlichen Änderungen an Fragen, Ankern oder Szenarioannahmen erneut versionieren, frühere Kataloge erhalten und Regressionen für Anzeige, Berechnung, Import und Bericht prüfen. Aktuelle Historie nutzt `check.methodologySnapshot`; Szenarioauswertung erhält den Workspace mit dem zugehörigen Snapshot.

## 6. Architektur und wichtige Dateien

React 19, TypeScript, Vite, Zod, Vitest, IndexedDB; keine zusätzlich erforderliche KI-Verbindung, kein Backend, Login oder API-Schlüssel.

**Einstieg ist `src/main.tsx` → `src/quick/QuickApp.tsx`.** Die älteren Komponenten unter `src/features` sind nicht die aktuelle Hauptoberfläche.

| Datei                                                           | Verantwortung                                                                                  |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `src/quick/QuickApp.tsx`                                        | Navigation, Checkzustand, Autosave-Anbindung, Importvorschau, Export, Drucken, Versionshinweis |
| `src/quick/ExpertIntro.tsx`, `expert-team.ts`                   | Gedankenexperiment und gemeinsame Annahmetexte                                                 |
| `src/quick/expert-questions.ts`                                 | Neue zwölf Fragen, Anker, Erklärungen, Beispiele und Maßnahmen                                 |
| `src/quick/model.ts`                                            | Checkdaten, Methodenregister, Score, JSON-Validierung/Export und Kopien                        |
| `src/quick/Question.tsx`, `Results.tsx`, `History.tsx`          | Einzelne Fragen, Ergebnis und gespeicherte Checks                                              |
| `src/quick/scenario-model.ts`                                   | Szenariokataloge, Snapshotregister, Kontexte, Antworten, Risiko/Chance und Kostenrechnung      |
| `src/quick/ScenarioPage.tsx`, `ScenarioInterview.tsx`           | Auswahl, Annahmen, Interview und Vergleich                                                     |
| `src/quick/expert-scenario-guidance.ts`, `scenario-guidance.ts` | Neue Erklärungen/Beispiele und Hilfe für frühere Szenarien                                     |
| `src/quick/Report.tsx`, `ScenarioReport.tsx`, `print.css`       | Tatsächlicher Druck-/PDF-Bericht                                                               |
| `src/quick/storage.ts`                                          | IndexedDB und geordnete Schreibvorgänge                                                        |
| `src/quick/styles.css`, `expert.css`, `scenario.css`            | Aktuelles Design und responsive Ansichten                                                      |
| `src/quick/Legacy.tsx`                                          | Lesbares Archiv der ursprünglichen ausführlichen Analysen                                      |

Neue Datenbank: `e23-quick-check`, Version 1, Store `workspace`, Schlüssel `checks`. Ursprüngliche Datenbank `ki-resilienz-check` bleibt getrennt. Browserprofil und Origin bestimmen den Speicher: localhost und Vercel teilen keine Daten. Browserantworten sind **keine GitHub-Daten**. Für ihren Umzug JSON verwenden.

Importgrenze: 5 MiB. Vollständige Prüfung vor Übernahme, Vorschau, standardmäßig zusätzliche Kopien. Gleichnamige IDs nur über die ausdrücklich gewählte Ersetzen-Option überschreiben. Paralleles Bearbeiten desselben Bestands in mehreren Fenstern wird nicht unterstützt.

PDF nutzt die Druckansicht des tatsächlichen Reports und `window.print()`, keinen externen PDF-Dienst. Ausgegebene Scores sind statisch, auch wenn der Bildschirmwert animiert hochzählt.

## 7. Lokal arbeiten und veröffentlichen

Node.js >= 22.12.0. Bei fehlenden Abhängigkeiten `npm ci`, sonst vorhandene Installation verwenden.

```sh
cd /Users/davidwegener/Documents/e23_resilienz
git status --short
git log -3 --oneline
npm run dev
```

Lokale Adresse: **http://127.0.0.1:5179/**, in `vite.config.ts` fest eingestellt. Andere offene localhost-Tabs nicht ungeprüft diesem Projekt zuordnen. Ein vorher gestarteter Server kann noch laufen; zuerst prüfen.

```sh
npm test -- --pool=threads
npm run build
git diff --check
```

Der Thread-Pool lief in der letzten Sitzung schnell; der standardmäßige Fork-Pool war auf diesem Rechner zeitweise sehr langsam. Kein aktueller Testfehler.

GitHub veröffentlicht `flux` automatisch auf Vercel. Bisher wurde vom lokalen Arbeitsbranch mit `git push origin HEAD:flux` veröffentlicht. Vor einem neuen Push Remote und Arbeitsbaum prüfen; keine fremden Änderungen überschreiben.

Vercel-Projekt: `e23-resilienz-check`, Scope `davids-projects-f2bdba89`, Projekt-ID `prj_dmsZxfaIZ8ikyKVYI2jBgmjYmp9f`. CLI war als `fliegenbart` angemeldet; Anmeldestatus bei Bedarf erneut prüfen. `.vercel` ist absichtlich ignoriert; ein frischer Checkout muss gegebenenfalls mit dem bestehenden Projekt verknüpft werden.

Build: `npm ci --no-audit --no-fund` → `npm run build` → `dist`. Konfiguration in `vercel.json`; `.vercelignore` schließt u. a. Dokumentation, Beispiele und Designbilder vom Deploymentpaket aus.

```sh
vercel ls e23-resilienz-check --scope davids-projects-f2bdba89
vercel inspect e23-resilienz-check.vercel.app --scope davids-projects-f2bdba89
```

Ein Push ist noch kein Beleg für ein fertiges Deployment: Ready, Produktionsziel und öffentlichen Alias bestätigen. Die letzte Fassung wurde vor dem Push lokal im Browser geprüft; danach wurde der Vercel-Status kontrolliert. Keine Behauptung, nach jedem Push sämtliche Tests erneut auf der öffentlichen Instanz durchgeführt zu haben.

## 8. Geprüfte Ergebnisse und reproduzierbare Grenzen

Letzte fachliche Abnahme am 7. November 2026:

- **83 Tests in 9 Dateien bestanden**, TypeScript-/Vite-Produktionsbuild erfolgreich, `git diff --check` sauber.
- Tests insbesondere in `tests/quick.test.ts`, `scenario.test.ts`, `method-versions.test.ts`, `quick-storage.test.ts`.
- Alle zwölf neuen Fragen im Browser durchlaufen. Zwölfmal 5 ergibt endgültig **44/100**; nicht einen Zwischenstand der Zahlenanimation ablesen.
- Auswahl nach etwa 220 ms vollständig gelb (`rgb(255, 230, 0)`), während der Bestätigung gesperrt; automatische Weiterleitung funktioniert.
- Szenario 3, physisches Angebot, sechs Monate: mit unbekannter Einkaufs-Auswahl kein Gesamtscore, Chance 9 separat. Nach Antworten **8/8/8/7** ergibt sich **Risiko 75/100**, Chance bleibt **9/10**.
- Tatsächlichen JSON-Download als zusätzliche Kopie importiert; Neuladen erhält Werte und Methoden.
- Vorhandener V1-Stand zeigt alte Fragen und bietet einen neuen Expertenteam-Check an.
- Desktop 1280 px und Mobilansicht 390 px geprüft, kein horizontales Überlaufen, keine relevanten Konsolenfehler.
- Tatsächlichen Browser-PDF-Export mit **8 A4-Seiten** erstellt und visuell geprüft. Gedankenexperiment, Methodenversionen, Fragen, Antworten und Werte enthalten; Bereichstabelle zusammengehalten.

Aktuelle Abnahmebilder und Demo-PDF liegen unter **`docs/qa/expertenteam-v2/`**. Die Zahlen darin sind fiktive Prüfdaten, keine Kundenanalyse. Die Dateien direkt in `docs/qa/`, die Beispiele unter `examples/` und `tests/browser-check.mjs` stammen dagegen aus der ursprünglichen ausführlichen Version und sind kein Abnahmenachweis für den aktuellen Quick-Check.

Nicht als neu geprüft darstellen: andere Browser, alle Gerätegrößen, gleichzeitiges Bearbeiten in mehreren Fenstern, empirische Prognosegüte oder automatische Risikofeststellung. Zurückhaltende Animationen und CSS für reduzierte Bewegung sind vorhanden, wurden zuletzt nicht auf jedem Betriebssystem interaktiv geprüft.

## 9. Ursprüngliche Unterlagen und Prioritäten

Lesereihenfolge: dieses Briefing → `README.md` → neue Fragen und Modelle → passende Tests. Weitere Hintergründe:

- `docs/Briefing.md`: vollständiges ursprüngliches Claude-Code-Briefing. Bei Übergabe bytegleich mit `/Users/davidwegener/Downloads/KI_Resilienz_Check_Briefing_Claude_Code.md`, SHA-256 `bdad4bcae2a015a1eaaa597bb9e714f5c007e51606010d03359cf983a45ae932`.
- `design/Neuentwurf.md`, `docs/Quick-Check-Plan.md`: vereinfachte Oberfläche und freigegebene Gestaltung.
- `design/Szenario-Modell.md`, `docs/superpowers/plans/2026-11-07-szenarien.md`: erster Szenarioaufbau; teilweise durch das Expertenteam-Modell weiterentwickelt.
- `docs/superpowers/plans/2026-11-07-expertenteam.md`: letzte Umsetzung und Abnahme.

Das Originalbriefing mit 20 ausführlichen Fragen beschreibt die historische erste Fassung. **Spätere ausdrückliche Nutzerentscheidungen für den einfachen Zwölf-Fragen-Check und das Expertenteam haben Vorrang.** Das Originaldokument nicht als Anlass nehmen, ungefragt die alte Formularanwendung wiederherzustellen.

David hat außerdem den ARK-Invest-Bericht „Big Ideas 2026“ zur Diskussion der Entwicklung eingebracht. Die Datei lag lokal unter `/tmp/codex-remote-attachments/01a1b1b2-e377-7311-b794-d190711229db/FA499547-3745-470F-B785-B5BCF2B2C6CF/1-ARKInvest-BigIdeas2026.pdf`. Sie ist **nicht** ins Repository kopiert und nicht Voraussetzung für Betrieb oder Weiterentwicklung. Ihre Aussagen nicht ungeprüft als aktuelle Fakten oder Validierung des Scores wiedergeben.

## 10. Arbeitsweise im nächsten Chat

1. Kontext übernehmen, aktuelle Git-/Remote-Lage prüfen, anschließend auf Davids nächste Bitte eingehen.
2. Änderungen am passenden aktuellen Modul vornehmen; historische Kataloge und Browserdaten erhalten.
3. Verständlichkeit und wenige Klicks haben Vorrang. Keine zusätzlichen Pflichtformulare oder abstrakten KI-Selbsteinschätzungen einführen.
4. Für funktionale Änderungen relevante Tests ergänzen/ausführen, Build prüfen und betroffenen Ablauf im Browser auf Desktop und mobil ansehen. Reversible reine Textkorrekturen brauchen keine spiegelbildlichen Tests.
5. User-Autorisierung aus dem laufenden Auftrag beachten. Keine wiederholten grundsätzlichen Bestätigungen für bereits freigegebene Arbeit verlangen. Neue externe Mitteilungen oder sachfremde Änderungen sind nicht Teil dieser Übergabe.
6. Änderungen, die veröffentlicht werden sollen, sauber committen und pushen, danach den tatsächlichen Vercel-Status bestätigen. Einen Fehler oder einen ungeprüften Teil offen benennen.

Die Übernahme selbst ist kein Auftrag, weitere Features, neue Chat-Threads, Automationen, externe KI-Anbindungen oder ein anderes Hosting einzurichten.
