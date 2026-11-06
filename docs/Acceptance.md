# Abnahme – KI-Resilienz-Check 0.1.0

Stand: 6. November 2026. Grundlage: vollständiges Briefing 0.1 und freigegebener Umsetzungsentwurf. Keine Änderungen am ViralFlux-Repository.

## Automatisierte Fachprüfung

46 Tests in fünf Dateien. Die Tests verwenden ausschließlich fiktive oder ausdrücklich simulierte Quellen.

| Anforderung des Briefings | Geprüfte Absicherung |
| --- | --- |
| Leer / alle unbekannt | R14 ohne positive oder negative Geschäftsaussage; unbekannt erfüllt keine niedrige oder hohe Bewertung. |
| Behaupteter C-Vorteil ohne Nachweis | R08 bleibt Hypothese. |
| Neue Idee ohne Kaufnachweis | A1/A2 bleiben trotz Datenvorteil offen. |
| Negative Nachfrage / Wirtschaftlichkeit unabhängig von KI | R15/R16 bleiben eigenständige Hinweise. |
| Selbstbetrieb und Cloud | Kein Architekturbasisbonus; die konkrete Qualität und Wechselprüfung zählen. |
| Netzwerkeffekt nicht relevant | Begründete Nichtanwendbarkeit ohne Gesamtabwertung. |
| Ersetzbarkeit und andere Vorteile | Kein automatischer Wechsel der menschlichen Empfehlung. |
| Datenbesitz ohne Ergebnisnachweis | Hoher C1 ohne aktuelle Quellenprüfung bleibt unbelegt. |
| Hohe B1/B4 ohne Beleg | Hypothese; mit aktuellem Beleg beobachteter Befund. |
| Offene Schutzwirkung | R06 verlangt Bedrohungszuordnung; behaupteter Mechanismus allein unterdrückt R06/R09 nicht. |
| Kritische D-Lücke | R10 bleibt trotz C-Vorteilen bestehen. |
| Widerspruch und erneute Auflösung | Aktueller Quellen- und Antwortversionsbezug erforderlich; neuer Widerspruch öffnet den Konflikt erneut. |
| Überfällige Quelle | Am ausdrücklichen Stichtag erneut prüfbedürftig; kein Löschen der Quelle. |
| Materielle Änderung | Antwort- und Quellenversionen entwerten frühere Bestätigungen. |
| Schutzverknüpfung | Geprüfte Schutzwirkung verfällt bei Änderung der zugrunde liegenden Bedrohung. |
| Historie | Quelllöschung und spätere Bearbeitung verändern abgeschlossene Revisionen nicht. |
| Nichtanwendbarkeit | Unzulässige Frage oder fehlende Begründung wird abgewiesen. |
| Finanzwerte leer | Keine Nullannahmen; E0 und E1 haben getrennte Voraussetzungen. |
| Verbindliches Rechenbeispiel | E0 = 25.000 EUR, E1 = 5.000 EUR, ΔE = −20.000 EUR. |
| Ungeeignetes Modell / unzulässige Faktoren | Kein E1 bei ungeprüfter Anwendbarkeit; unter −100 %, nichtendliche Werte und negative Fixkosten unzulässig. |
| Szenario unabhängig von Ausgangslage | Berechnung verändert Baseline nicht; einmalige Kosten bleiben separat. |
| Zahlenüberlauf | Weder Ausgangsergebnis noch Differenz können Infinity ausgeben. |
| Menschliche Entscheidung | R07 erzeugt einen Prüfhinweis und setzt keine Empfehlung automatisch. Begründung, Maßnahmen und Hinweisantworten sind eigene gespeicherte Felder. |
| Demonstrationsdaten | Drei zusätzliche Fälle, alle synthetisch, kein Überschreiben bestehender Fälle. Übernahme in reale Fälle beseitigt ihre Belegqualifikation. |

## Austausch und Persistenz

Vollständiger JSON-Rundlauf; neue Fall-ID bei Kopie; keine Mutation durch bloßes Parsen. Beschädigte und zu große Dateien, falsche Schemaversionen, ungültige Zustandskombinationen und verwaiste Quellenverweise werden abgewiesen. Unbekannte Methoden sind auch mit geändertem Fragenkatalog ausschließlich lesbar; fehlende Snapshots führen zur Rohansicht. Importe werden niemals als Programmcode ausgeführt.

IndexedDB wird mit `fake-indexeddb` auf vollständige Wiederherstellung und Erhalt bestehender Daten bei fehlgeschlagener Speicherung geprüft. Der Browsertest provoziert zusätzlich einen echten Fehler im Schreibpfad und prüft den sichtbaren Fehlerstatus bei weiterhin verfügbarem Export.

## Browserabnahme

Zwölf Abläufe mit isoliertem Google-Chrome-Profil, Desktop 1440 × 1000 und schmaler Ansicht 390 × 844. Der lokale Entwicklungsserver muss laufen. Das Ergebnis ist reproduzierbar mit `npm run test:browser` und wird in `docs/qa/browser-result.json` gespeichert.

Geprüft: Fall anlegen; Persistenz nach Neuladen; bewusst unbekannte Antwort; R14; zusätzliche Beispiele; fachlicher historischer Abschluss; ursprünglichen Berichtsstand auswählen; JSON herunterladen und als Kopie importieren; fehlerhaften Import ohne Datenverlust abweisen; schmale Ansicht ohne seitlichen Überlauf; Tastaturbedienung; Speicherfehler bei exportierbarem Entwurf. Der Testlauf beobachtet keine externen Anfragen oder Seitenfehler.

Zusätzlich im integrierten Browser tatsächlich durchlaufen: eigener Fall, Quelle anlegen und prüfen, Quelle zu Antwort zuordnen, Aussage gesondert bestätigen. „Aktuell belegt“ erscheint erst nach diesem Ablauf. Eine anschließende materielle Quellenänderung setzt den Belegzähler zurück und zeigt „Erneut zu prüfen“.

## Visuelle Kontrolle

Gestaltungsreferenz: `docs/design/concept.png`, erzeugt mit dem eingebauten Image-Gen-Werkzeug als UI-Konzept. Die Umsetzung wurde anhand der Browserabbildung `docs/qa/desktop.png` visuell verglichen: Seitenleiste, weißer Arbeitsbereich, blaue Auswahlzustände, Typografie, Gruppennavigation, Radioanker und Feldabstände. Der ruhige visuelle Aufbau wurde übernommen.

Bewusste Abweichungen vom generierten Konzept: Die vollständigen ursprünglichen Fragen und Bewertungsanker haben Vorrang vor verkürztem oder unzutreffendem Bildtext. Die Anwendung ergänzt erforderliche Beispielkennzeichnung, Prozessstand, Navigation zwischen Einzelfragen und die getrennte Quellen-/Aussageprüfung. Es wurden keine zusätzlichen Marketingaussagen aus dem Bild übernommen. Die Texte über der ersten Bildschirmkante wurden gegen diese erlaubten Inhalte geprüft.

Die Kernansichten wurden zuerst im integrierten Browser geprüft. Für die reproduzierbare Druckausgabe wird Chromium ergänzend verwendet, weil die integrierte Schnittstelle keinen direkten PDF-Export anbietet. Desktop und schmale Ansicht sind zusätzlich als Abbildungen festgehalten. Der konkrete Build wurde mit sichtbaren und bedienbaren Formularen geprüft.

Der vollständige PDF-Musterbericht wurde aus demselben Berichtsbaustein und denselben Druckstilen erzeugt. Managementteil, Fragebogen, Szenarien, Quellen und Methodeneinordnung bleiben enthalten. Die PDF-Seiten wurden mit Poppler gerendert und visuell auf Umbrüche, abgeschnittene Inhalte und Lesbarkeit kontrolliert. Der Bericht verwendet A4 und beginnt den Anhang auf einer neuen Seite.

## Verbleibende Grenzen

Keine offenen zentralen Funktionsplatzhalter. Die Methode selbst muss noch gemeinsam erprobt werden. Keine unabhängige Abnahme in Safari oder Firefox. Keine Zusage für manipulationssichere Historie, Echtzeit-Zusammenarbeit oder wissenschaftliche Prognosegüte. Diese Grenzen entsprechen dem vorgesehenen lokalen Beratungspiloten.
