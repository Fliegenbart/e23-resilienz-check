# Szenariosimulation Implementation Plan

**Goal:** Die sechs freigegebenen Wenn-dann-Szenarien als klickbaren Arbeitsablauf mit Vergleich, Kostenmodell, Speicherung, JSON und Druckbericht veröffentlichen.
**Architecture:** Eigene versionierte Szenariomethode als optionale Erweiterung eines Quick-Checks. Bestehende Methodik bleibt unverändert. JSON-Schema 1.1 liest weiterhin 1.0; alte Daten bleiben in ihrer damaligen Form, bis bewusst ein Szenario ergänzt wird. Risiken sind Einschätzungen unter Annahmen, Chancen separat, Kostenwirkung reine bedingte Rechnung.
**Tech Stack:** Bestehendes React/TypeScript/Vite, Zod und IndexedDB. Keine neue Abhängigkeit.

## 1. Methode und Vertrag
- [x] tests/scenario.test.ts: kontrollierte Szenariopaare, keine automatisch erzeugten Risiken, unbekannte Werte, Chancen getrennt, 25%-KI-Anteil/10x → 22,5%, unveränderliche Kontexte, Import und Methodensnapshot testen (zunächst rot).
- [x] src/quick/scenario-model.ts: sechs Definitionen, fünf Fragen, Profil/Zeitfenster/Kostenanteil, strikt versionierter Workspace mit getrennten Bewertungsständen.
- [x] src/quick/model.ts: QuickCheck.scenarios optional, view scenarios, Schema 1.1 und Rückwärtslesen 1.0. Alte Exporte ohne Szenarien müssen identisch einlesbar bleiben.
- [x] tests/quick-storage.test.ts: Szenarien mit Position und Antworten dauerhaft speichern und laden.

Szenario-Risiko: round(100 * sum(answer - 1) / 36), nur vier numerische Risikoantworten. Chancenfrage bleibt außerhalb dieser Formel.
Kostenersparnis: s * (1 - 1/f), bei unbekanntem s kein Gesamtkostenwert.
Ein neuer Bewertungsstand kopiert sein Profil, Zeitfenster und den KI-Kostenanteil; spätere Einstellungen ändern alte Bewertungen nicht.

## 2. Geführte Oberfläche
- [x] src/quick/ScenarioPage.tsx: Katalog, auswählbare Profile und Horizonte, optionale Kostenrechnung, Szenario-Erzählung, fünf einzelne Klickfragen und Vergleich.
- [x] src/quick/ScenarioInterview.tsx: 1–10/Unbekannt, 450ms gelbe Auswahlbestätigung, abbruchfähiger Übergang, Tastatur, Zurück.
- [x] src/quick/scenario.css: vorhandenes Weiß/Graphit/Gelb, klare Annahmen, Mengenbild für dasselbe KI-Budget, mobile Ansichten, reduzierte Bewegung.
- [x] src/quick/QuickApp.tsx: Einstieg nach Ergebnis und direkt von Startseite, funktionale Updates, Wiederaufnahme des Workspace.
- [x] src/quick/Results.tsx und History.tsx: erreichbarer Szenariozugang, sichtbare gespeicherte Szenariostände.

## 3. Bericht und Austausch
- [x] src/quick/ScenarioReport.tsx: Vergleich und vollständige Annahmen/Antworten für jeden gespeicherten Stand; statische Scores, Formel und Grenzen.
- [x] src/quick/Report.tsx und print.css: Szenarioanhang, eigenständiger Bericht bei reinem Szenariocheck, saubere A4-Seitenumbrüche.
- [x] JSON-Export/Import einschließlich laufender Szenariofrage, Kontext, Antworten und Methodensnapshot.
- [x] README aktualisieren, Paketversion 0.3.0.

## 4. Abnahme und Veröffentlichung
- [x] npm test und npm run build.
- [x] Browser: direkter Einstieg, Szenario 1/2/3 und Robotik, Kostenchips, Risiko/Chance, unbekannte Antworten, erneute Bewertung mit geändertem Zeitfenster, Wiederaufnahme, JSON-Rundlauf und fehlerhafter Import.
- [x] 390px und Desktop visuell prüfen; Konsole und Formularfreiheit kontrollieren.
- [x] Tatsächliche exportierte Szenarien mit originalem React-Bericht und Druck-CSS als PDF rendern und visuell prüfen.
- Veröffentlichung: nach der lokalen Abnahme auf `flux` ohne Force-Push speichern und den Vercel-Status bis Ready verfolgen; der tatsächliche Release-Status wird nach dem Push geprüft.

## Abnahmeprotokoll 7. November 2026

- 74 Fach-, Schema-, Import- und Persistenztests bestehen mit `npm test -- --pool=threads`; Produktionsbuild erfolgreich. Der lokale Prozesspool hatte zeitweise lange Startzeiten; die Testausführung selbst bleibt erfolgreich.
- Browser: direkter Einstieg; vier bewertete Stände mit Risiko/Chance 64/9, 19/9, 83/7 und 72/6; unbekannte Antwort erzeugt keinen Gesamtwert.
- Nach Neuladen wurde die angefangene Szenariofrage 4 wieder geöffnet. Frühere Stände behalten 18 Monate/digital, während ein neuer Robotikstand 6 Monate/physisch erhält.
- JSON heruntergeladen und als Kopie wieder importiert: alle vier Stände einschließlich Annahmen und Antworten erhalten. Unbekannte Methodenversion wird abgewiesen; vorhandene Fälle bleiben sichtbar.
- Flexible Robotik mit unbekanntem KI-Kostenanteil erzeugt keine Gesamtkostenzahl. Ein digitales Profil unterstellt keinen unmittelbaren physischen Produktionshebel.
- Desktop und 390px: Auswahl, Skala und Navigation visuell geprüft; keine relevanten Konsolenfehler oder Texteingabefelder. Neue Simulation vom bestehenden Beispielergebnis erreichbar; dessen Score bleibt 68.
- Tatsächlicher JSON-Export durch `QuickReport`/`ScenarioReport` und originale Druckstile als PDF gerendert. Alle neun A4-Seiten des Vier-Szenario-Berichts visuell kontrolliert; Vergleich, Antworten, Kostenrechnung, Methodenversion und IDs vollständig. Der native Druckdialog des integrierten Browsers wird nicht automatisiert bedient.
- Safari/Firefox und reduzierte Bewegung wurden nicht separat interaktiv abgenommen; die bestehende CSS-Regel für reduzierte Bewegung gilt auch für die neuen Animationen.
