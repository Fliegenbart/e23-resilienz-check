# Individuelle Business-Auswertung

Auftrag: Die Beschreibung zusammen mit den zwölf Antworten für konkrete Aussagen zum eigenen Geschäft nutzen. Kurze Texte, keine zusätzliche Pflichtstrecke. Die bestehenden Veröffentlichungs- und Minimalismusvorgaben gelten weiter.

## Umsetzung

- Ein Klick auf „Mein Business auswerten“ sendet ausschließlich Beschreibung, Antworten und gewähltes Zwei-Jahres-Szenario an OpenAI über Vercel. Hinweis direkt am Button. Keine automatische Übertragung beim Tippen oder Ändern der Regler.
- Serverseitige Vercel-Funktion mit AI SDK, bestehender Projekt-OIDC-Identität und festem Modell. Kein Schlüssel im Browser, keine neue Anmeldung, keine Tools oder Webrecherche im Modellaufruf. Modellverfügbarkeit vor Auswahl prüfen.
- Kurzes strukturiertes Ergebnis: konkrete Übernahme, verbleibender Schutz, eigener KI-Nutzen, nächster Praxistest. Maximal zwei offene Punkte. Aussagen aus der Beschreibung und aus Frage-IDs nachvollziehbar halten; keine erfundenen Kunden, Datenrechte, Ergebnisse oder Überlebensquoten. Widersprüche sichtbar machen.
- Generierte Aussagen ergänzen die qualitative Methode 4.0. Alte Methoden und Antworten bleiben unverändert. Beschreibung und Antworten sind Daten, keine Modellinstruktionen.
- Analyse mit Datum, Modell und genauem Eingabestand lokal speichern, exportieren und drucken. Nach geänderten Eingaben keine alte Analyse als aktuelles Ergebnis zeigen. Verspätete Antworten und Abbruch dürfen keinen anderen Check verändern.
- Fehler führen zu einer kurzen Meldung; die bisherige Auswertung bleibt nutzbar. Eingabegröße, Ausgabelänge und Laufzeit begrenzen. Vor Veröffentlichung projektbezogene Gateway-/Endpunktlimits prüfen und setzen, ohne Guthaben zu kaufen oder andere Projekte zu verändern.

## Prüfung

1. Tests zuerst: Eingabeschema, Aktualität, JSON/IndexedDB, Bericht, Herkunftsbezüge, Serverfehler und Abbruch.
2. Implementierung und TypeScript-/Produktionsbuild.
3. Echte Modellaufrufe ausschließlich mit erfundenen Beispielen; zwei unterschiedliche Geschäfte müssen verschiedene konkrete Aussagen erhalten.
4. Browser: Beschreibung → Check → individuelle Auswertung → Änderung/Veraltung → Aktualisierung → Reload. Mobilansicht, Fehlerzustand und öffentliche Bereitstellung prüfen.

Lokaler OIDC-Download wurde von der automatischen Freigabeprüfung abgelehnt. Kein erneuter oder indirekter Export. Modelltests erfolgen über die bestehende Identität einer Vercel-Bereitstellung; alle lokalen Tests arbeiten ohne Zugangsdaten.

## Technische Entscheidungen aus der Prüfung

- Vercels native Node-Laufzeit benötigt explizite ESM-Dateiendungen und JSON-Importattribute. Der neue `test:api` kompiliert und importiert die echte Funktion unabhängig vom Vite-Bundler.
- Claude Sonnet 5.5 ist auf dem vorhandenen Gateway-Tarif gesperrt (403). Das offiziell für Free Credits verfügbare GPT-5.2 wird über die direkte OpenAI-Route verwendet. Der Übertragungshinweis wurde entsprechend geändert.
- Projektbudget 5 USD/Monat, Rate Limit fünf Anfragen/Minute/IP. Keine Guthabenkäufe. Ein Test bestätigte die Ablehnung zusätzlicher Aufrufe durch die WAF; deren 403 wird ebenso wie 429 als kurze Warte-Meldung dargestellt.
- Ergebnis auf genau einen Befund je Bereich gekürzt. Ausgabeprüfung lehnt abgeschnittene Headlines, technische Frage-IDs in sichtbaren Texten und mehr als 180 Wörter ab. Herkunftszitate müssen exakt aus der Beschreibung stammen.

## Abnahme vor Veröffentlichung

- 167 Tests in 16 Dateien bestanden; nativer Node-API-Smoke-Test, TypeScript-/Vite-Build und Diff-Prüfung erfolgreich.
- Reale API-Aufrufe auf Vorschau `dpl_3SKVbsv1ErkNcyKpmsTGegzGVhYv`: zwei erfundene Geschäftsbeschreibungen, beide HTTP 200. Dokumentenprüfung: 134 sichtbare Wörter zu Prüfzeugnissen, Haftung und Dokumentvergleich. Pumpenwartung: 146 Wörter zu Berichten, Vor-Ort-Einsatz, Messreihen und Fallvergleich. Kein reales Nutzerbusiness übertragen.
- Alle Modellantworten wurden gegen Ausgabeform, exakte Herkunftszitate und 180-Wort-Limit geprüft. Alte Methoden und Fragen unverändert; native ESM-Importanpassungen ändern keine Bewertungsregeln.
- Lokal über `localhost:5183`: Beschreibung, kompletter Zwölf-Fragen-Ablauf, Klick-Aktion und verständlicher Fehler bei fehlender lokaler API geprüft. Öffentliche Browserprüfung folgt auf den Produktionsbuild. Echte Spracheingabe und nativer PDF-Dialog wurden nicht neu getestet; Berichtsinhalt automatisiert geprüft.
