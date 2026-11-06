# KI-Resilienz-Check — Umsetzungsbriefing für Claude Code

**Version:** 0.1 — verbindliche Arbeitsgrundlage für einen ersten Beratungspiloten  
**Stand:** 6. November 2026  
**Auftraggeber:** David Wegener; gemeinsamer Einsatz mit Daniel und Stefan  
**Arbeitstitel:** KI-Resilienz-Check  
**Produkttyp:** moderiertes Analyse- und Entscheidungswerkzeug für Geschäftsfelder und neue Geschäftsideen  
**Sprache:** Deutsch; technische Bezeichner im Code dürfen Englisch sein

## 0. Dein Auftrag als Claude Code

Entwickle anhand dieses Briefings eine funktionierende erste Version eines browserbasierten Werkzeugs, das wir in unserer KI-Beratung einsetzen können. Wir wollen mit Kunden nachvollziehbar untersuchen, welche Teile eines bestehenden oder geplanten Geschäfts durch leistungsfähigere KI unter Druck geraten, welche Vorteile tatsächlich schützen und welche Maßnahmen wirtschaftlich sinnvoll erscheinen.

Lies das gesamte Briefing vor der Umsetzung. Prüfe anschließend das vorhandene Repository und übernimm brauchbare bestehende Konventionen. Baue die hier beschriebene erste Version, einschließlich der fachlichen Logik, Beispieldaten, Speicherung, Exportfunktionen und relevanten Tests. Ein grafischer Prototyp mit wirkungslosen Schaltflächen genügt nicht.

Arbeite in den Implementierungsschritten aus Abschnitt 15. Triff reversible technische Detailentscheidungen selbstständig und dokumentiere wesentliche Annahmen. Frage nur dann nach, wenn eine offene Entscheidung die fachliche Aussage, den vereinbarten Umfang oder die Sicherheit tatsächlich verändert. Erfinde keine fachlichen Regeln, Datenquellen oder Aussagen über reale Unternehmen, um Lücken zu schließen.

Die erste Version läuft lokal und verarbeitet Falldaten im Browser. Ein lokaler Entwicklungsserver ist zulässig. Benutzerkonten, Cloudbereitstellung und gleichzeitige Bearbeitung durch mehrere Personen gehören in eine spätere Version. Entwickle die Struktur so, dass diese Erweiterung möglich bleibt, ohne jetzt eine vollständige Beratungsplattform zu bauen.

**Erfolgskriterium:** Wir können mit einem Kunden einen vollständigen Fall bearbeiten, die Grundlagen jeder Einschätzung nachvollziehen und einen verständlichen Ergebnisbericht mit Entscheidung, offenen Punkten und nächsten Schritten mitnehmen.

---

## 1. Ausgangslage und Nutzenversprechen

### 1.1 Das Problem

Leistungsfähigere KI kann einzelne Funktionen eines Angebots vereinfachen, günstiger machen oder in einer verbreiteten Plattform bündeln. Unternehmen müssen deshalb beurteilen, ob sie weiterentwickeln, zukaufen, kooperieren, ihr Angebot verändern oder zunächst einen Nachweis erbringen sollten.

Die Bedrohung kann von unterschiedlichen Seiten kommen:

- Ein Modell- oder Plattformanbieter integriert eine bislang separat verkaufte Funktion.
- Ein Branchenwettbewerber nutzt dieselbe KI wirksamer und bietet ein besseres oder günstigeres Ergebnis.
- Kunden erbringen einen Teil der Leistung künftig selbst.
- Eine Plattform übernimmt den Kundenzugang oder verändert die Bedingungen für Sichtbarkeit und Vertrieb.
- Ein Unternehmen wird bei Daten, Arbeitsständen oder kritischen Prozessen von einem Anbieter abhängig.

Gleichzeitig kann bessere KI ein bestehendes Geschäft stärken. Der Check soll deshalb Chancen und Anpassungswege sichtbar machen. Eine schwer kopierbare Idee ist außerdem noch kein nachgefragtes oder rentables Angebot. Kundennutzen und Wirtschaftlichkeit werden eigenständig geprüft.

### 1.2 Was wir verkaufen wollen

Ein wiederholbares Beratungsverfahren, das Entscheidungen besser begründet und kritische Annahmen sichtbar macht. Das Werkzeug unterstützt die Zusammenarbeit von David, Daniel und Stefan mit dem Kunden. Es ersetzt ihr fachliches Urteil nicht.

Arbeitsformulierung für die Oberfläche:

> Wir prüfen, welche Teile Ihres Geschäfts auch mit leistungsfähigerer KI wertvoll bleiben — und welche Entscheidungen Sie heute vorbereiten sollten.

Das Produkt ist ein Baustein einer umfassenderen KI-Analyse. Es soll sich neben Prozessanalyse, Anwendungsfallentwicklung, Prototyping und Einführung einsetzen lassen. Eine bestimmte gemeinsame Gesellschaft, bestehende Marke oder feste Rollenverteilung der drei Berater wird nicht vorausgesetzt.

### 1.3 Drei Leitfragen

1. **Relevanz:** Kaufen beziehungsweise benötigen Kunden dieses Ergebnis überhaupt?
2. **Wettbewerb:** Wer könnte dieses Ergebnis mit KI ersetzen, bündeln oder günstiger anbieten?
3. **Handlungsfähigkeit:** Welche Vorteile, Ressourcen und Handlungsmöglichkeiten bleiben uns dann?

---

## 2. Fachliche Leitplanken

Diese Regeln sind Produktanforderungen. Sie dürfen beim Implementieren oder bei einer späteren KI-Anbindung nicht aufgeweicht werden.

1. **Keine erfundene Überlebenswahrscheinlichkeit.** Keine Ausgabe wie „82 % resilient“, „18-Monats-Überlebenswahrscheinlichkeit“ oder „Anthropic übernimmt diesen Markt mit 70 % Wahrscheinlichkeit“.
2. **Kein universeller Gesamtscore.** Keine gewichtete Summe, kein versteckter Mittelwert und keine Rangliste, die unterschiedliche Risiken zu einer Zahl verdichtet.
3. **Keine Immunität.** Eigene Daten, lokale Modelle, Regulierung, deterministische Software oder Kundenverträge lösen keine automatische positive Bewertung aus.
4. **Unbekannt bleibt unbekannt.** Fehlende Angaben sind keine niedrige Gefahr und kein schwacher Vorteil. Nichtanwendbarkeit ist ein eigener, begründungspflichtiger Zustand.
5. **Bewertung und Beleglage sind getrennt.** Eine starke Selbsteinschätzung ohne Nachweis bleibt eine unbestätigte Behauptung.
6. **Technische Ersetzbarkeit, wirtschaftliche Wirkung und Anbieterabhängigkeit bleiben unterscheidbar.** Das Kopieren einer Funktion beweist weder Kundenverlust noch Unternehmensversagen.
7. **Keine vorgeschriebene KI-Architektur.** Cloud, Selbstbetrieb, offene Modellgewichte und hybride Ansätze werden anhand konkreter Anforderungen beurteilt.
8. **Wirkung statt Besitz.** Daten, Zertifikate, Verträge oder Integrationen sind nur insoweit relevant, wie sie einen nachvollziehbaren Unterschied für Kunden, Wettbewerb oder Betrieb erzeugen.
9. **Szenarien sind bedingte Annahmen.** Sie dürfen nicht als Vorhersagen erscheinen. Ein Planungshorizont von 18 Monaten erzeugt keine prognostische Genauigkeit.
10. **Empfehlungen sind nachvollziehbar und menschlich verantwortet.** Automatische Regeln erzeugen Hinweise mit Begründung; die gemeinsame strategische Empfehlung wird ausdrücklich dokumentiert.
11. **Methodenversionen bleiben nachvollziehbar.** Eine spätere Änderung der Fragen oder Regeln darf abgeschlossene Bewertungen nicht unbemerkt verändern.
12. **Widerspruch bleibt sichtbar.** Unterschiedliche Einschätzungen werden nicht rechnerisch zu einem Scheinkonsens gemittelt.

Die Methode in diesem Dokument ist eine vorgeschlagene Beratungsheuristik. Sie ist kein empirisch kalibriertes Prognosemodell und keine Zertifizierung. Diese Einordnung gehört in die Methodenseite und den Bericht, ohne den Arbeitsablauf mit wiederkehrenden Warnfenstern zu überladen.

---

## 3. Bewertungseinheit und Arbeitsablauf

### 3.1 Ein Fall untersucht ein klar begrenztes Angebot

Bewertet wird eine konkrete Leistung für eine konkrete Kundengruppe. Nicht pauschal „die Resilienz eines Unternehmens“.

Beispiel für einen geeigneten Untersuchungsgegenstand:

> Erstellung, Prüfung und Freigabe markenkonformer Vertriebspräsentationen für die Vertriebsteams mittelständischer B2B-Unternehmen.

Zu unspezifisch wäre: „Marketing mit KI“.

Ein Unternehmen kann mehrere Fälle haben. Bestehende Geschäftsfelder und neue Ideen dürfen gemeinsam in einer Übersicht erscheinen, müssen aber klar gekennzeichnet sein.

### 3.2 Pflichtangaben beim Anlegen

- Titel des Geschäftsfelds oder der Idee.
- Kundenalias beziehungsweise Organisation; möglichst keine unnötigen personenbezogenen Angaben.
- Typ: bestehendes Geschäft oder neue Idee.
- Entscheidungsfrage: Welche konkrete Entscheidung soll vorbereitet werden?
- Zielkundengruppe, tatsächlicher Nutzer und wirtschaftlicher Käufer, jeweils getrennt.
- Kundenproblem und bisherige Alternative.
- Bezahltes beziehungsweise künftig zu bezahlendes Ergebnis.
- Erlösmodell und relevante Kostenarten, zunächst auch als Text möglich.
- Betrachteter Markt beziehungsweise Einsatzkontext.
- Planungshorizont: 6, 12, 18 oder 36 Monate; Standard 18 Monate.
- Untersuchungsgrenzen: Was ist nicht Teil des Falls?
- Verantwortlicher und Beteiligte.
- Bewertungsdatum und gewünschter nächster Überprüfungstermin.

Ein Entwurf darf mit unvollständigen Angaben gespeichert werden. Fehlende Angaben müssen anschließend sichtbar bleiben. Der erste Einrichtungsdialog soll nur Titel, Typ und Entscheidungsfrage verlangen; weitere Felder folgen auf der Fallseite.

### 3.3 Wertschöpfung in Schritte zerlegen

Für jeden Fall wird eine Tabelle mit üblicherweise drei bis sieben Schritten angelegt. Die Anzahl ist eine Moderationshilfe, keine technische Beschränkung.

Mögliche Schritte: Zugang zu Daten → Aufbereitung → Analyse → Empfehlung → Ausführung → Qualitätssicherung → Verantwortungsübernahme.

Je Schritt erfassen:

- Was passiert und welches Ergebnis entsteht?
- Warum ist das für den Kunden wichtig?
- Welche Ressourcen, Daten, Rechte oder Beziehungen werden benötigt?
- Welchen Anteil übernimmt KI heute?
- Welche Alternative könnte den Schritt übernehmen?
- Ist der Schritt für das Leistungsversprechen kritisch?
- Welche offenen Fragen bestehen?

Fragen, Belege, Bedrohungen und Maßnahmen können mit diesen Schritten verknüpft werden. Geld- oder Umsatzanteile sind im MVP nicht erforderlich. Falls sie später ergänzt werden, niemals unbekannte Anteile automatisch gleichmäßig verteilen.

### 3.4 Bearbeitungsfolge

1. Fall und Entscheidungsfrage abgrenzen.
2. Kundenaufgabe und Wertschöpfung verstehen.
3. Zwanzig Kernfragen beantworten und Belege zuordnen.
4. Die wichtigsten Bedrohungen mit den behaupteten Vorteilen abgleichen.
5. Stressszenarien durchspielen.
6. Automatische Hinweise gemeinsam prüfen.
7. Empfehlung, Maßnahmen und nächste Überprüfung festhalten.
8. Bericht und vollständigen Fall exportieren.

Der Ablauf ist navigierbar. Niemand muss einen langen linearen Assistenten vollständig durchklicken, um eine frühere Antwort zu ändern. Die Ergebnisansicht ist jederzeit erreichbar und zeigt ausdrücklich ihren vorläufigen Stand.

---

## 4. Die zwanzig Kernfragen

### 4.1 Antwortmechanik

Jede Frage hat drei inhaltliche Anker: niedrig, mittel und hoch. Im Interface stehen die konkreten Beschreibungen; die Kurzbezeichnungen dienen der Orientierung. Es gibt keine sichtbaren Punktwerte.

Zusätzlich existieren:

- **Noch nicht bearbeitet:** Standardzustand.
- **Unbekannt:** aktiv als Wissenslücke gekennzeichnet.
- **Nicht anwendbar:** mit Begründung, soweit für diese Frage zulässig.
- **Strittig:** zusätzliche Markierung einer Antwort; unterschiedliche Positionen und Gründe können hinterlegt werden.

Bei A, C und D bedeutet „hoch“ einen stärkeren Kundenwert, Vorteil beziehungsweise eine höhere Handlungsfähigkeit. Bei B bedeutet „hoch“ stärkere Exposition. Diese Richtung muss in jeder Gruppe deutlich erkennbar sein. Keine Farblogik, die ein hohes B automatisch wie ein hohes C behandelt.

Je Frage müssen außerdem Begründung, Beleglage, verknüpfte Quellen, Geltungsbereich und offene Prüfung erfasst werden können.

### A — Kundenwert und Wirtschaftlichkeit

**A1 — Wie konkret und relevant ist das Kundenproblem?**

- Niedrig: Kein klarer Käufer oder kein relevanter Nachteil des bisherigen Zustands.
- Mittel: Problem und Käufer sind benannt; Häufigkeit oder Bedeutung sind noch ungeklärt.
- Hoch: Konkreter Käufer, wiederkehrender Bedarf und nachvollziehbarer wirtschaftlicher oder operativer Nachteil.
- Geeignete Belege: dokumentierte Kundenaufgaben, Prozessbeobachtung, Zeitverlust, Fehlerkosten, wiederkehrende konkrete Beschwerden.

**A2 — Welche Zahlungsbereitschaft besteht?**

- Niedrig: Ablehnung oder belegter fehlender Zahlungswille bei den untersuchten Zielkunden.
- Mittel: Interesse, Gespräche, unverbindliche Absichtserklärungen oder noch ungeprüfte Budgetannahmen.
- Hoch: Tatsächliches Kaufverhalten wie bezahlter Pilot, Auftrag, budgetierte Nutzung oder Verlängerung.
- Geeignete Belege: Aufträge, bezahlte Piloten, anonymisierte Umsatzdaten, Verlängerungen, dokumentierte Budgetentscheidung.
- Fehlender Nachweis ist „unbekannt“ oder eine mittelstarke Hypothese; er ist nicht automatisch belegte Ablehnung.

**A3 — Welcher zusätzliche Nutzen besteht gegenüber der besten zugänglichen Alternative?**

- Niedrig: Kein für den Kunden relevanter Unterschied.
- Mittel: Nutzen ist plausibel oder nur in einem begrenzten Einsatzbereich gezeigt.
- Hoch: Relevanter Vorteil bei Qualität, Zeit, Kosten oder Ergebnis ist nachvollziehbar demonstriert.
- Geeignete Belege: Vergleich an echten Aufgaben, Kundenmessung, nachprüfbare Zeit- und Qualitätsdaten einschließlich Nacharbeit.
- Die Vergleichsalternative kann auch eine vorhandene Standardsoftware, Eigenleistung oder „nichts ändern“ sein.

**A4 — Ist die Wirtschaftlichkeit tragfähig?**

- Niedrig: Bekannte Kosten übersteigen realistisch erreichbaren Erlös; ein plausibler Verbesserungspfad fehlt.
- Mittel: Ein positiver Verlauf ist plausibel, aber wichtige Kosten-, Nachfrage- oder Amortisationsannahmen sind noch offen.
- Hoch: Relevante Kosten sind berücksichtigt und ein nachvollziehbarer Weg zu einem positiven wirtschaftlichen Ergebnis besteht.
- Geeignete Belege: bestehender Deckungsbeitrag, belastbare Kostenstruktur oder offengelegter Business Case mit validierten Teilannahmen.
- Einführung, Vertrieb, Betreuung, Qualitätssicherung und Anpassungen dürfen nicht stillschweigend als kostenlos gelten.

**Unterschied der Falltypen:** Bei neuen Ideen sind Discovery und kleine bezahlte Experimente passende Nachweise. Bei bestehenden Feldern sollen tatsächlich verfügbare Umsatz-, Nutzungs- und Kundenbindungsdaten einbezogen werden. Eine neue Idee ohne Kaufnachweis braucht Validierung; sie wird deshalb nicht pauschal verworfen.

### B — Wettbewerbliche Ersetzbarkeit

**B1 — Wie weit können zugängliche KI-Systeme die bezahlte Kernleistung bereits erbringen?**

- Niedrig: Sie übernehmen überwiegend nebensächliche Teilaufgaben.
- Mittel: Sie übernehmen wesentliche Teile, aber relevante Lücken bei Ergebnis, Ausführung oder Kundenanforderungen bleiben.
- Hoch: Sie ermöglichen eine weitgehend gleichwertige Kernleistung innerhalb der betrachteten Kundenanforderungen.
- Geeignete Belege: aktueller Vergleich des vollständigen relevanten Arbeitsablaufs, einschließlich Prüfung, Fehlern und Nacharbeit.
- Ein überzeugendes Einzelbeispiel oder die Reproduktion einer Oberfläche genügt nicht als Nachweis der gesamten Leistung.

**B2 — Wie stark hängt der heutige Vorteil von einer vorübergehenden Modellschwäche ab?**

- Niedrig: Der Wert entsteht überwiegend unabhängig von dieser Schwäche.
- Mittel: Ein wesentlicher Teil hängt daran, andere wertvolle Bestandteile bleiben bestehen.
- Hoch: Der Hauptnutzen besteht darin, eine konkrete Modellschwäche zu überbrücken.
- Geeignete Belege: Zerlegung des Produktnutzens, Vergleich mit neueren Modellen, dokumentierter Zusammenhang zwischen Modellverbesserung und verlorenem Produktvorteil.
- Die konkrete Schwäche muss benannt werden; das Etikett „Wrapper“ ist keine Analyse.

**B3 — Wie nah liegt die Leistung am Angebot und Kundenzugang einer Plattform?**

- Niedrig: Wenige erkennbare wirtschaftliche Anreize oder erhebliche zusätzliche Ausführungsanforderungen sprechen derzeit gegen direkte Bündelung.
- Mittel: Angrenzende Angebote, passender Kundenzugang und plausible wirtschaftliche Anreize bestehen.
- Hoch: Konkrete Veröffentlichungen, Integrationen oder vergleichbare bereits angebotene Leistungen zeigen unmittelbare Nähe.
- Geeignete Belege: datierte Produktinformationen, Preis- und Bündelungsmodelle, dokumentierte Integrationen, vertriebliche Überschneidung.
- Der Befund beschreibt beobachtete Nähe. Er ist keine Markteintrittswahrscheinlichkeit. Fehlende öffentliche Informationen rechtfertigen allein keine niedrige Bewertung.

**B4 — Wie leicht können Kunden tatsächlich wechseln oder die Leistung selbst erbringen?**

- Niedrig: Erhebliche, konkret belegte Wechselhindernisse bestehen.
- Mittel: Migration, Prüfung, Schulung oder organisatorische Umstellung sind erforderlich.
- Hoch: Eine brauchbare Alternative ist bereits im Arbeitsablauf verfügbar oder mit geringem Umstellungsaufwand einsetzbar.
- Geeignete Belege: beobachtete Migration, Kundenversuch, Kündigungsgründe, Beschaffungsanforderungen, Aufwandsschätzung mit nachvollziehbarer Grundlage.
- Die Dauer des Kündigungsklicks ist nicht die Dauer eines fachlichen Anbieterwechsels.

### C — Verteidigbare Vorteile

Ein Unternehmen muss nicht alle sechs Vorteile besitzen. Ihre Anzahl ist kein Resilienzwert. Jeder behauptete Vorteil wird mit der Bedrohung verknüpft, gegen die er wirken soll.

**C1 — Gibt es schwer ersetzbare, nützliche eigene Daten?**

- Niedrig: Daten sind leicht zugänglich, ersetzbar oder liefern keinen relevanten zusätzlichen Nutzen.
- Mittel: Teilweise exklusiver Zugang oder plausibler Nutzen; Rechte, Qualität oder Wirkung sind noch offen.
- Hoch: Nutzungsrechte, schwer ersetzbarer Zugang und ein relevanter Ergebnisvorteil sind nachvollziehbar vorhanden.
- Geeignete Belege: Rechtebeschreibung, Vergleich mit und ohne diese Daten, laufender Zugang zu neuen Beobachtungen, Prüfung von Ersatzquellen.

**C2 — Wie tief ist das Angebot in Prozesse oder physische Ausführung eingebettet?**

- Niedrig: Leicht austauschbare Einzelleistung.
- Mittel: Integration oder Umsetzung verursacht nachvollziehbaren Aufwand.
- Hoch: Schwer reproduzierbarer Zugang, Einbettung oder Betriebserfahrung ist wesentlich für den Kundennutzen.
- Geeignete Belege: tatsächliche Prozessabhängigkeiten, Betriebswissen, Gerätezugang, Integrations- und Migrationsaufwand.
- Aufwendige Projektarbeit allein beweist weder hohe Marge noch dauerhaften Schutz.

**C3 — Besteht ein schwer reproduzierbarer fachlicher Ergebnisvorsprung?**

- Niedrig: Standardverfahren oder leicht reproduzierbares Ergebnis.
- Mittel: Fachlicher Vorsprung vorhanden, aber begrenzt geprüft oder voraussichtlich leicht aufholbar.
- Hoch: Validierter relevanter Vorsprung mit nachvollziehbaren Hindernissen oder Kosten für seine Reproduktion.
- Geeignete Belege: geeignete Vergleichsaufgaben, unabhängige Prüfung, validiertes Verfahren, dokumentierte Fehler- und Qualitätsdaten.
- Determinismus oder mathematische Formeln sind allein kein Vorteil; entscheidend sind Richtigkeit, Relevanz und Reproduzierbarkeit.

**C4 — Ist Vertrauen oder Verantwortungsübernahme tatsächlich kaufentscheidend?**

- Niedrig: Allgemeine Behauptung ohne konkrete Leistungsgrundlage.
- Mittel: Referenzen, passende Prozesse oder vertragliche Leistungen bestehen.
- Hoch: Zuverlässigkeit, Qualifikation oder Verantwortungsübernahme ist nachweislich kaufentscheidend und schwer ersetzbar.
- Geeignete Belege: Kundenentscheidungen, Leistungsnachweise, passende Qualifikationen, relevante Vereinbarungen und gelebte Betreuung.
- Keine automatische Höchstwertung durch Regulierung, einen Standort oder einen einzelnen Vertrag.

**C5 — Besteht ein echter Netzwerkeffekt?**

- Niedrig: Kein entsprechender Effekt.
- Mittel: Teilnehmer schaffen zusätzlichen Nutzen, sind aber leicht parallel nutzbar oder ersetzbar.
- Hoch: Der Nutzen hängt wesentlich von einem schwer neu aufzubauenden aktiven Netzwerk ab.
- Geeignete Belege: tatsächliche Transaktionen, wiederkehrende Interaktionen, Netzwerknutzen für einzelne Teilnehmer, Wechselverhalten.
- Mehrbenutzerfähigkeit und ein mehrstufiger Freigabeprozess sind allein kein Netzwerkeffekt.

**C6 — Wie belastbar sind Kundenzugang und Kundenbindung?**

- Niedrig: Austauschbarer Zugang und geringe Bindung.
- Mittel: Direkter Zugang, erste Wiederholungskäufe oder teilweise Einbettung.
- Hoch: Wiederholt bestätigte Bindung und schwer reproduzierbarer Zugang zu relevanten Käufern.
- Geeignete Belege: Verlängerungen, Wiederholungskäufe, Vertriebskanäle, beobachtete Bindung trotz Alternativen.
- Kundenlisten und laufende Vertragslaufzeiten allein reichen nicht; der Fortbestand der Beziehung muss begründet werden.

### D — Handlungsfähigkeit und KI-Kontrolle

**D1 — Besteht ausreichende Kontrolle über Daten und Arbeitsstände?**

- Niedrig: Kritische Daten oder Zustände sind nicht ausreichend zugänglich oder wiederverwendbar.
- Mittel: Teilweiser Export; Rechte, Vollständigkeit oder Wiederverwendung sind ungeprüft.
- Hoch: Benötigte Daten, Zustände und Rechte sind verfügbar; die Wiederverwendung wurde geprüft.
- Geeignete Belege: Export und Wiederherstellung, Rechteübersicht, Datenflussbeschreibung.

**D2 — Ist ein Anbieter- oder Modellwechsel tatsächlich möglich?**

- Niedrig: Keine brauchbare Alternative für den kritischen Prozess.
- Mittel: Alternative ist benannt oder technisch angebunden, aber nicht ausreichend geprüft.
- Hoch: Alternative wurde an relevanten Aufgaben auf Qualität, Kosten und Betrieb geprüft.
- Geeignete Belege: Vergleichsergebnisse, dokumentierter Wechselversuch, bekannte Anpassungskosten.
- Eine einheitliche API allein beweist keine fachliche Austauschbarkeit. Zwei Anbieter mit derselben kritischen Infrastruktur sind nicht automatisch unabhängige Ausweichmöglichkeiten.

**D3 — Wird die Qualität wiederholbar geprüft?**

- Niedrig: Beurteilung überwiegend anhand einzelner Beispiele oder subjektiver Eindrücke.
- Mittel: Prüfungen vorhanden, aber Lücken bei relevanten Aufgaben oder Fehlermöglichkeiten.
- Hoch: Repräsentative Aufgaben, klare Anforderungen und wiederholbare Prüfungen bestehen.
- Geeignete Belege: dokumentierte Prüfaufgaben, Akzeptanzgrenzen, Fehlerklassen, Ergebnisse nach Modelländerungen.

**D4 — Sind Handlungen des Systems angemessen begrenzt und nachvollziehbar?**

- Niedrig: Kritische Aktionen sind ohne passende Begrenzung, Freigabe oder Nachvollziehbarkeit möglich.
- Mittel: Teilweise Rechte, Freigaben und Protokolle bestehen; relevante Lücken sind offen.
- Hoch: Rechte, Grenzen, Freigaben und Eingriffsmöglichkeiten passen zum tatsächlichen Einsatz und wurden geprüft.
- Geeignete Belege: überprüfte Berechtigungen, Freigabeabläufe, Protokolle und Eingriffstests.
- Der Prüfbedarf richtet sich nach dem Einsatz: Textentwurf, Empfehlung und eigenständiges Ausführen geschäftlicher Aktionen sind unterschiedliche Fälle.

**D5 — Ist ein ausreichender Weiterbetrieb und Wiederanlauf vorbereitet?**

- Niedrig: Kritischer Ausfall ohne tragfähige Reaktion.
- Mittel: Ausweichverfahren sind beschrieben, aber ungeprüft.
- Hoch: Mindestbetrieb und Wiederanlauf wurden unter relevanten Bedingungen erprobt.
- Geeignete Belege: Wiederanlauftest, manueller Ersatzprozess, tolerierbare Ausfallzeit, Wiederherstellungsdauer.

**D6 — Kann sich das Unternehmen rechtzeitig anpassen?**

- Niedrig: Erforderliche Veränderungen passen nicht zu Ressourcen oder Entscheidungswegen.
- Mittel: Anpassung ist grundsätzlich möglich; Zeit, Verantwortung oder Budget bleiben unklar.
- Hoch: Zuständigkeit, Ressourcen und zeitlicher Handlungsspielraum für relevante Änderungen sind plausibel vorhanden.
- Geeignete Belege: konkrete Verantwortliche, verfügbare Kapazität, Umsetzungsplan und bisherige Änderungserfahrung.

### 4.2 Regeln zur Nichtanwendbarkeit

- A1–A4 und B1, B3, B4 gehören zum Kern jedes Falls und können nicht als „nicht anwendbar“ entfernt werden. Unklarheiten bleiben ausdrücklich offen.
- B2 kann nicht anwendbar sein, wenn das betrachtete Angebot keinerlei Vorteil aus dem Ausgleich einer Modellschwäche bezieht. Eine Begründung ist erforderlich.
- C-Fragen dürfen begründet nicht anwendbar sein. Das Fehlen eines Netzwerkeffekts verschlechtert keine Gesamtnote, weil keine Gesamtnote existiert.
- D1 und D6 bleiben für jedes Geschäftsfeld relevant. D2–D5 können bei einem Fall ohne entsprechenden KI-Einsatz begründet nicht anwendbar sein. Geplanter Einsatz wird als Planung gekennzeichnet; eine geplante Prüfung gilt nicht als durchgeführt.
- Zusätzlich kann der Moderator einzelne Fragen als „entscheidungsrelevant“ markieren. Das dient der Arbeitspriorisierung und ist kein numerisches Gewicht.

---

## 5. Belege, Annahmen und abweichende Einschätzungen

### 5.1 Drei Belegstufen

| Stufe | Bedeutung | Beispiel |
| --- | --- | --- |
| Annahme | Plausible, bisher ungeprüfte Behauptung. | „Unsere Kunden vertrauen uns mehr.“ |
| Hinweis | Indiz mit begrenztem Geltungsbereich. | Ein Interview, eine Herstellerankündigung oder ein einzelnes beobachtetes Beispiel. |
| Geprüfter Beleg | Eine konkrete Quelle oder Prüfung wurde von einer verantwortlichen Person auf ihre Aussage für diese Frage geprüft. | Ein aktueller Kundenvergleich oder eine dokumentierte Vertragsverlängerung mit nachvollziehbarem Zusammenhang. |

Ein geprüfter Beleg beweist nicht die Zukunft. Seine Aussage gilt nur für den dokumentierten Umfang. Mehrere Kopien derselben Quelle erzeugen keine höhere Belegstufe.

### 5.2 Angaben pro Quelle

- Titel und Art: Kundeninterview, Vertrag, Kennzahl, interner Test, Produktinformation, Forschungsbericht oder sonstige Quelle.
- URL oder interne Referenz; mindestens eine konkrete Referenz muss vorhanden sein.
- Urheber beziehungsweise Herkunft.
- Konkrete Beobachtung oder kurzer relevanter Auszug.
- Ereignis-/Erhebungsdatum, soweit bekannt, und Datum der Erfassung.
- Prüfstatus sowie prüfende Person und Prüfdatum.
- Geltungsbereich und Grenzen.
- Optional: Datum, bis zu dem erneut geprüft werden soll.

Dokumentenupload und automatische Recherche sind nicht erforderlich. Im MVP genügen Referenzen und kurze Auszüge. Ein Datum wird nicht erfunden, wenn es unbekannt ist.

### 5.3 Beziehung zwischen Quelle und Aussage

Die Zuordnung einer Quelle zu einer Antwort enthält eine Beziehung: **unterstützt**, **widerspricht** oder **Kontext**. Eine Quelle kann unterschiedliche Aussagen verschieden betreffen.

Eine Antwort gilt für automatische Hinweise nur dann als belegt, wenn:

1. eine inhaltliche Bewertung und Begründung vorhanden sind;
2. die Belegstufe „geprüfter Beleg“ gewählt wurde;
3. mindestens eine unterstützende, menschlich geprüfte Quelle verknüpft ist;
4. deren Bezug zur konkreten Antwort erklärt ist;
5. eine fällige erneute Prüfung nicht ungeklärt überschritten ist;
6. kein ungelöster Widerspruch vorliegt.

Eine abgelaufene Prüffrist macht eine Quelle nicht automatisch falsch. Der Befund wird als „erneut zu prüfen“ dargestellt und zählt vorläufig nicht zu den aktuell belegten Vorteilen. Eine erneute Prüfung kann den Status wiederherstellen.

### 5.4 Widersprüche

Zu einer Antwort können mehrere Positionen gespeichert werden: Person, Bewertung, Begründung und Quellen. Der Moderator kann einen Arbeitsstand festlegen, muss eine Abweichung aber sichtbar lassen. Eine dokumentierte Auflösung verweist auf die betroffenen Quellen und erklärt die Entscheidung. Quellen werden dabei nicht gelöscht.

Eine bloße Bestätigungsschaltfläche macht eine Herstellerbehauptung nicht zu einem unabhängigen Nachweis. Die Nutzer müssen die tatsächlich belegte Aussage benennen, beispielsweise „Die Funktion wird angeboten“ statt „Die Funktion ersetzt den gesamten Kundenprozess“.

### 5.5 Änderungen und erneute Prüfung

Materielle Änderungen an einer Quelle — Beobachtung, Geltungsbereich, Herkunft oder Referenz — erhöhen deren Versionsnummer und setzen ihre Prüfung auf „erneut zu prüfen“. Eine Änderung des Inhalts darf keinen unveränderten Prüfstatus erben.

Änderungen an Bewertung, Begründung, Geltungsbereich oder Belegzuordnung einer Antwort erhöhen ebenfalls deren Versionsnummer. Die bisherige Bestätigung als belegter Befund gilt dann nicht automatisch weiter. Gespeicherte Prüfungen nennen ausdrücklich die Version der Antwort und aller herangezogenen Quellen.

Ein neuer oder substanziell geänderter widersprechender Beleg eröffnet den Konflikt erneut. Eine Konfliktauflösung bezieht sich auf dokumentierte Quellenstände und kann neue Widersprüche nicht verdecken. Diese Änderungen betreffen den aktuellen Entwurf; historische Revisionen bleiben unverändert.

---

## 6. Bedrohungen, Schutzwirkung und Regeln für Hinweise

### 6.1 Bedrohungen als eigene Einträge

Pro Fall können die relevanten Bedrohungen dokumentiert werden:

- Kategorie: Plattformbündelung, Branchenwettbewerber, Eigenleistung des Kunden, Verlust des Kundenzugangs, Anbieterabhängigkeit oder sonstige.
- Wer beziehungsweise welcher Akteur verändert was?
- Welche Wertschöpfungsschritte sind betroffen?
- Wie würde sich das auf Kaufverhalten, Preis, Kosten oder Betrieb auswirken?
- Welche Beobachtungen stützen diese Einschätzung?
- Handelt es sich um eine beobachtete Entwicklung oder um eine Szenarioannahme?

Ein C-Vorteil wird ausdrücklich mit einer oder mehreren Bedrohungen verbunden. Zusätzlich wird in einem Satz erklärt, weshalb er dort helfen soll. Beispiel: Ein exklusiver Datensatz kann eine Ergebnisreproduktion erschweren; er löst keinen Ausfall des KI-Anbieters.

Eine **belegte Schutzwirkung** erfordert einen belegten C-Faktor und eine gesondert geprüfte, quellenbezogene Erklärung seiner Wirkung gegenüber genau dieser Bedrohung. Die Schutzverknüpfung speichert Prüfer, Datum, Quellenstände und die zugrunde liegenden Versionen von C-Antwort und Bedrohung. Ein Mechanismus als Freitext allein reicht nicht. Ändern sich die zugrunde liegenden Inhalte, wird die Verknüpfung erneut prüfbedürftig.

### 6.2 Was automatisch ausgewertet wird

Die Anwendung erstellt ein Profil und nachvollziehbare Hinweise. Sie berechnet keine Wahrscheinlichkeit und keine Gesamtbewertung.

Zulässige Prozesszahlen sind beispielsweise:

- 16 von 20 Fragen bearbeitet.
- 3 Fragen unbekannt, 1 nicht anwendbar.
- 5 Bewertungen durch aktuell geprüfte Belege gestützt.
- 2 ungelöste Widersprüche.

„Bearbeitet“ heißt: bewertet, bewusst unbekannt oder begründet nicht anwendbar. Diese Zahl darf nicht als fachliche Vollständigkeit oder Sicherheit dargestellt werden. Keine Vermischung mit Resilienzprozenten.

### 6.3 Ausdrückliche Regeldefinitionen

Eine Regelfunktion liefert eine Liste von Hinweisen mit `findingId`, `ruleId`, Titel, Art, Begründung, auslösenden Antworten, betroffenen Bedrohungen, Quellenbezügen und vorgeschlagenem Prüfschritt. Die `ruleId` bezeichnet die Regelfamilie; die stabile `findingId` bezeichnet den konkreten Hinweis, beispielsweise R08 für C1. Maßnahmen und Antworten auf Hinweise referenzieren diese konkrete ID. Die ID wird nachvollziehbar aus Regel und betroffenen Objekten gebildet und ändert sich nicht bei jedem Rendern.

Die Arten sind **beobachteter Befund**, **zu prüfende Hypothese** und **offene Information**. „Beobachtet“ setzt die in Abschnitt 5 definierte Belegqualität voraus. Ungesicherte Antworten dürfen dieselbe Richtung als Hypothese anstoßen, aber nicht als beobachteten Befund ausgeben.

| Regel | Auslöser | Hinweis / nächster Schritt |
| --- | --- | --- |
| R01 | A1 oder A2 offen, strittig oder ohne ausreichenden Beleg | Kundenproblem, Käufer beziehungsweise Zahlungsbereitschaft validieren. Bei einer neuen Idee einen passenden kleinen Nachweis planen. |
| R02 | A4 offen, mittel oder nicht ausreichend belegt | Wirtschaftlichkeit und entscheidende Annahmen prüfen. |
| R03 | B1 hoch und B4 hoch | Kernleistung ist unter den dokumentierten Bedingungen stark austauschbar. Belegt nur, wenn beide Antworten belegt sind; sonst Hypothese. |
| R04 | B2 hoch | Abhängigkeit von einer Modellschwäche untersuchen; verbleibenden Kundennutzen benennen. |
| R05 | B3 hoch | Konkrete Plattformnähe prüfen; Bündelungsszenario bearbeiten. Kein automatisches Urteil über Kundenverlust. |
| R06 | R03 aktiv; eine betroffene Bedrohung wurde zugeordnet; keine aktuell belegte Schutzwirkung für diese Bedrohung vorhanden | Schutzwirkung ist offen. Fehlt schon die Bedrohungszuordnung, zunächst „Betroffene Bedrohung zuordnen“ ausgeben. Niemals automatisch „kein Schutz vorhanden“ behaupten. |
| R07 | B1 und B4 belegt hoch, A3 belegt niedrig, A4 belegt niedrig | Neuausrichtung oder Begrenzung weiterer Investitionen prüfen. Keine automatische Entscheidung und keine Schließungsempfehlung. |
| R08 | Ein C-Faktor hoch, aber nicht ausreichend belegt | Möglichen Vorteil als unbestätigt ausweisen; geeigneten Nachweis vorschlagen. |
| R09 | C-Faktor hoch und belegt, aber keine aktuell geprüfte Schutzverknüpfung zu einer konkreten Bedrohung vorhanden | Wirkung des Vorteils gegenüber dem betrachteten Risiko präzisieren und belegen. |
| R10 | Eine als kritisch markierte D-Frage niedrig | Konkrete Betriebsvoraussetzung vor dem betroffenen Einsatz prüfen. Andere Vorteile dürfen den Hinweis nicht ausgleichen. |
| R11 | D2 oder D5 mittel | Alternative beziehungsweise Ausweichverfahren praktisch erproben. |
| R12 | D6 niedrig oder offen | Verantwortung, Anpassungszeit und Ressourcen klären. |
| R13 | Widerspruch ungelöst oder entscheidende Quelle erneut zu prüfen | Fachlichen Konflikt beziehungsweise Aktualität als offene Entscheidungsvoraussetzung anzeigen. |
| R14 | Keine inhaltlich bewertete Frage vorhanden | „Noch nicht beurteilbar“; keine positive oder negative Geschäftsaussage. |
| R15 | A1 oder A2 niedrig | Negative Einschätzung zu Problemrelevanz oder Zahlungsbereitschaft prüfen. Bei ausreichendem Beleg als beobachtete negative Evidenz ausweisen, sonst als Hypothese. |
| R16 | A4 niedrig | Kosten, Erlösmodell oder Leistungsumfang überprüfen. Bei ausreichendem Beleg: Wirtschaftlichkeit unter den dokumentierten Bedingungen nicht tragfähig; sonst Hypothese. |

Anwendbarkeit, Widersprüche und Belegstatus werden in gemeinsamen Funktionen behandelt, nicht in jeder UI-Komponente anders. Eine nicht anwendbare Antwort löst keinen inhaltlichen Negativhinweis aus. Eine unbekannte Antwort erfüllt niemals eine Bedingung „niedrig“.

Regeln und Wortlaut stehen in einer versionierten Methodenkonfiguration. Die Regel-IDs bleiben stabil. Neue Regeln erhalten neue IDs.

Die Regelfunktion erhält den Auswertungsstichtag `evaluationAsOf` als ausdrücklichen Parameter. Fristen und Quellenaktualität werden gegen diesen Stichtag geprüft. Gleiche Falldaten, gleiche Methodenversion und gleicher Stichtag müssen gleiche Hinweise liefern. Im aktuellen Entwurf kann der Stichtag fortgeschrieben werden; historische Berichte behalten ihren ursprünglichen Stichtag.

### 6.4 Menschliche Empfehlung

Der Moderator wählt nach der gemeinsamen Prüfung eine Empfehlung:

- **Weiterentwickeln:** weiter am Angebot arbeiten; Bedingungen und Grenzen benennen.
- **Gezielt validieren:** eine entscheidende Annahme mit begrenztem Aufwand prüfen.
- **Neu ausrichten:** Leistungsversprechen, Zielgruppe, Wertschöpfung oder Betriebsmodell verändern.
- **Vorläufig pausieren:** weitere Investitionen bis zu einem benannten Nachweis zurückstellen.
- **Noch offen:** keine gemeinsame Empfehlung erreicht.

Die Auswahl benötigt eine Begründung und mindestens einen nächsten Schritt. Weicht sie von einem relevanten Regelhinweis ab, wird der Umgang mit diesem Hinweis dokumentiert. Das System darf eine professionelle Entscheidung nicht durch eine versteckte automatische Investitionsfreigabe ersetzen.

Eine Empfehlung kann ausdrücklich vorläufig sein. Offene Grundlagen verschwinden auch nach fachlicher Durchsicht nicht aus dem Bericht. „Geprüft“ bezeichnet den Review des Dokuments, nicht eine Garantie seiner Prognosen.

---

## 7. Stressszenarien und optionaler wirtschaftlicher Vergleich

### 7.1 Drei verpflichtend angebotene Szenariovorlagen

**S1 — Die Kernfunktion wird gebündelt.**

Eine Plattform stellt eine vergleichbare Funktion im bereits bezahlten Standardangebot des Kunden bereit. Welche bezahlte Leistung bleibt? Wer würde wechseln und warum? Was müsste weiterhin separat geleistet werden?

**S2 — Ein Branchenwettbewerber nutzt stärkere KI.**

Ein Wettbewerber mit Branchenkenntnis setzt vergleichbare Modelle ein und bietet schneller, günstiger oder zuverlässiger an. Welche eigenen Vorteile überstehen diesen Vergleich? Welche Teile könnte der Kunde selbst übernehmen?

**S3 — Der wichtigste KI-Dienst ist nicht nutzbar.**

Der kritische Anbieter fällt für eine frei gewählte Dauer aus, wird wirtschaftlich unattraktiv oder erfüllt eine wichtige Anforderung nicht mehr. Welche Mindestleistung bleibt möglich? Wie lange dauert eine Umstellung? Welche gemeinsamen Abhängigkeiten bleiben trotz zweitem Anbieter bestehen?

Alle drei Vorlagen müssen bearbeitbar sein; ein Szenario kann mit Begründung als nicht relevant dokumentiert werden. Die Software soll keine Ausfalllänge, Preisänderung oder Eintrittschance als Prognose vorgeben.

### 7.2 Zusätzliche Perspektiven

- Bei neuen Ideen: „Die angenommene Zahlungsbereitschaft bestätigt sich nicht.“ Diese Perspektive muss entweder als Szenario oder ausdrücklich in der Nutzenprüfung bearbeitet werden.
- Für alle Fälle verfügbar: „Bessere KI verbessert unser Angebot.“ Prüfen, ob der Nutzen beim eigenen Unternehmen verbleibt oder über niedrigere Preise beziehungsweise neue Erwartungen an Kunden weitergegeben wird.
- Eigene Szenarien können hinzugefügt werden. Spekulative Entwicklungen werden ausdrücklich als Annahmen gekennzeichnet.

### 7.3 Angaben pro Szenario

- Konkrete Veränderung und Planungshorizont.
- Betroffene Schritte, Kunden und Erlösbestandteile.
- Erklärung des Wirkungswegs: Warum verändert sich dadurch Kaufverhalten oder Betrieb?
- Was bleibt als eigener bezahlter Nutzen bestehen?
- Anpassungsmöglichkeit, Zeitbedarf, einmaliger Aufwand und laufende Folgen.
- Stützende und widersprechende Beobachtungen.
- Frühindikator: Woran würden wir erkennen, dass Handlungsbedarf entsteht?
- Nächster Prüfschritt, Verantwortlicher und Termin.

Szenarien verändern nie rückwirkend die Antworten oder Finanzwerte der tatsächlichen Ausgangslage. Kein „erwarteter Verlust“ aus einer Summe willkürlich gewichteter Szenarien.

### 7.4 Kleiner wirtschaftlicher Rechner

Im MVP als optionales Untermodul umsetzen. Der vollständige qualitative Check funktioniert ohne Zahlen.

Alle Beträge beziehen sich auf **einen Monat** und dieselbe Währung. Erforderliche Ausgangswerte:

- `R`: Monatsumsatz.
- `V`: monatliche variable Gesamtkosten bei heutiger Menge.
- `F`: monatliche Fixkosten.

Szenarioannahmen:

- `p`: relative Änderung des Verkaufspreises, beispielsweise −0,20.
- `q`: relative Änderung der verkauften Menge, beispielsweise −0,10.
- `c`: relative Änderung der variablen Kosten je verkaufter Einheit, beispielsweise −0,25.
- `deltaF`: zusätzliche oder entfallende monatliche Fixkosten.
- `K`: einmalige Umstellungskosten, separat ausweisen.

Formeln:

```text
Umsatz im Szenario                   R1 = R × (1 + p) × (1 + q)
Variable Kosten im Szenario          V1 = V × (1 + q) × (1 + c)
Fixkosten im Szenario                F1 = F + deltaF
Deckungsbeitrag Ausgangslage         DB0 = R − V
Deckungsbeitrag Szenario             DB1 = R1 − V1
Vereinfachtes Monatsergebnis         E0 = R − V − F
Vereinfachtes Szenarioergebnis       E1 = R1 − V1 − F1
Veränderung des Monatsergebnisses    ΔE = E1 − E0
```

Das ist ein vereinfachtes Betriebsmodell. Es unterstellt eine proportionale Veränderung der variablen Kosten mit der Menge und eine repräsentative Preis-/Mengeneinheit. Wenn diese Annahme für das Geschäftsfeld nicht passt, muss der Nutzer den Rechner als ungeeignet kennzeichnen können. Er liefert keine vollständige Finanzplanung, Liquiditätsrechnung oder Bewertung.

Wichtige Implementierungsregeln:

- Leere Eingaben bleiben fehlend; niemals stillschweigend null einsetzen.
- E0 kann berechnet werden, sobald R, V und F vollständig sind. E1 benötigt zusätzlich p, q, c und deltaF sowie eine bestätigte Anwendbarkeit des vereinfachten Modells. Ein fehlendes K blockiert nicht das Monatsergebnis; die einmaligen Kosten bleiben dann ausdrücklich offen.
- Preis-, Mengen- und Kostenfaktoren dürfen nicht negativ werden. Relative Änderungen unter −100 % sind unzulässig.
- Nichtnegative Ausgangskosten und ein nichtnegatives F1 verlangen; negative operative Ergebnisse dagegen ausdrücklich zulassen.
- Keine doppelte Subtraktion der Menge bei Umsatz und Kosten.
- Keine Renditeberechnung bei fehlender oder null gesetzter Bezugsgröße.
- Einmalige Kosten K nicht unbemerkt in monatliche Kosten umwandeln.
- Zahlen müssen als Annahmen mit Herkunft gekennzeichnet werden. Keine vorausgefüllten Rückgänge in neuen realen Fällen.

Verbindliches Rechenbeispiel für Tests, ausschließlich fiktiv:

```text
R = 100.000 EUR; V = 40.000 EUR; F = 35.000 EUR
p = −20 %; q = −10 %; c = −25 %; deltaF = 5.000 EUR
R1 = 72.000 EUR; V1 = 27.000 EUR; F1 = 40.000 EUR
DB0 = 60.000 EUR; DB1 = 45.000 EUR
E0 = 25.000 EUR; E1 = 5.000 EUR; ΔE = −20.000 EUR/Monat
```

Die Rechnung zeigt eine mögliche Konstellation: geringere Produktionskosten bedeuten bei gleichzeitigem Preis- und Mengendruck nicht zwangsläufig mehr Gewinn.

---

## 8. Ergebnisbericht und Arbeitsprodukte

### 8.1 Managementansicht

Der erste Teil des Berichts soll in ein bis zwei Druckseiten passen und folgende Fragen beantworten:

1. Was wurde für welchen Kunden und welchen Zeitraum untersucht?
2. Welche Entscheidung soll getroffen werden?
3. Welche Bedrohung ist am wichtigsten, und worauf beruht diese Einschätzung?
4. Welche Vorteile sind belegt, welche nur behauptet?
5. Welche kritischen Abhängigkeiten oder Kontrolllücken bestehen?
6. Was empfehlen wir, unter welchen Bedingungen?
7. Welche drei nächsten Schritte sind vorrangig, mit Verantwortung und Termin?

Ausgewählte Kernaussagen werden von den Beratern formuliert oder aus transparenten Regeltexten übernommen. Im MVP gibt es keine versteckte LLM-generierte Managementzusammenfassung.

### 8.2 Vollständiger Anhang

- Untersuchungsumfang und Wertschöpfungsschritte.
- Alle zwanzig Fragen mit Antworten, Begründungen und Beleglage.
- Nichtanwendbarkeit, offene Informationen und abweichende Positionen.
- Bedrohungen und zugeordnete Schutzwirkung.
- Szenarien mit Annahmen, Ergebnissen und Grenzen.
- Vollständiger Maßnahmenplan.
- Quellenverzeichnis mit Datum und Prüfstatus.
- Methoden-, App- und Fallversion.
- Reviewdatum, verantwortliche Person und nächste Überprüfung.

Ein „Kundenbericht“ darf offene Punkte nicht ausblenden, um überzeugender auszusehen. Für interne Notizen kann eine separate Sichtbarkeit gewählt werden; eine entscheidungsrelevante Einschränkung muss trotzdem im Bericht erscheinen.

### 8.3 Maßnahmen

Jede Maßnahme enthält:

- Titel und konkrete Tätigkeit.
- Bezug zu Frage, Regelhinweis, Bedrohung oder Szenario.
- Erwarteter Nachweis beziehungsweise Erfolgskriterium.
- Verantwortlicher, Zieltermin und Status.
- Grobe Aufwandseinschätzung als Freitext, sofern bekannt.

Beispiel: „Zwei verfügbare Modelle an fünf repräsentativen Kundenaufgaben vergleichen; Qualität, Nacharbeit, Kosten und Durchlaufzeit dokumentieren.“ Die Zahl fünf ist hier eine vorgeschlagene Pilotgröße, kein statistischer Nachweisstandard.

### 8.4 Portfolioansicht

Mehrere Geschäftsfelder sind in einer Tabelle vergleichbar:

- Kunde/Alias und Geschäftsfeld.
- Bestehend oder neue Idee.
- Gemeinsame Empfehlung und Bearbeitungsstatus.
- Wichtigste Bedrohung.
- Wichtigster belegter Vorteil.
- Entscheidende offene Frage.
- Nächste Maßnahme, Verantwortlicher und Termin.

Filtern nach Kunde, Typ, Empfehlung und fälliger Überprüfung. Sortieren nach Termin, Titel oder manuell gesetzter Handlungspriorität. Keine Sortierung nach einem versteckten Resilienzscore.

---

## 9. Nutzerführung und Gestaltung

### 9.1 Erforderliche Ansichten

1. **Übersicht:** Fälle anlegen, öffnen, filtern, exportieren und importieren.
2. **Fallprofil:** Entscheidungsfrage, Kundengruppe, Angebot und Wertschöpfung.
3. **Prüfung:** vier Bereiche mit insgesamt zwanzig Fragen.
4. **Belege:** Quellen verwalten, zuordnen und Widersprüche erkennen.
5. **Szenarien:** qualitative Folgen und optionaler wirtschaftlicher Vergleich.
6. **Entscheidung:** Hinweise prüfen, Empfehlung und Maßnahmen formulieren.
7. **Bericht:** gut lesbare Bildschirm- und Druckansicht.
8. **Methode:** Regeln, Begriffe und Grenzen der Aussagekraft.

Diese Ansichten können als seitliche Navigation innerhalb eines Falls umgesetzt werden. Kein überladener Startbildschirm mit dekorativen Kennzahlen.

### 9.2 Gestaltung

- Ruhige, professionelle Beratungsoberfläche; geeignet für ein gemeinsames Gespräch am Bildschirm.
- Klare deutsche Sprache und lesbare Tabellen.
- Verständliche Beschreibung direkt an der jeweiligen Antwortoption.
- Offene und ungeprüfte Aussagen visuell unterscheidbar; Bedeutung nicht nur über Farben vermitteln.
- Sichtbarer Speicherstatus sowie klare Unterscheidung zwischen echtem Fall und Beispiel.
- Desktop und Tablet priorisieren; Grundbedienung auf schmalen Bildschirmen sicherstellen.
- Tastaturbedienung, sichtbarer Fokus, Beschriftungen und verständliche Fehlermeldungen.
- Keine dekorativen Risikotachos, Radarflächen oder farbigen Gesamtnoten.

Ein Faktenprofil mit kurzen Begründungen ist für die erste Version hilfreicher als ein eindrucksvoller, aber methodisch unklarer Chart.

### 9.3 Gemeinsame Arbeit im Pilot

Gemeinsam bedeutet zunächst: ein moderierter Workshop mit einem geführten Datensatz. Moderator, Fachbeitrag und Dokumentation können als freie Rollen hinterlegt werden. Keine feste Rollenverteilung für David, Daniel oder Stefan erzwingen.

Als Arbeitsformat vorschlagen:

- Vorbereitung: Umfang, vorhandene Belege und Entscheidungsfrage sammeln.
- Etwa 90 Minuten gemeinsame Bearbeitung; bei komplexen Feldern auf mehrere Termine aufteilen.
- Anschließend gezielte Belegprüfung und Freigabe des Berichts.

Das ist eine Planungshilfe, kein Versprechen, dass zwanzig Fragen und alle Belege in 90 Minuten abschließend prüfbar sind. Ein Erstworkshop kann mit klaren Prüfaufträgen enden.

---

## 10. Datenmodell und Versionierung

### 10.1 Grundstruktur

Die folgenden TypeScript-Typen sind die fachliche Zielstruktur. Ergänze Laufzeitvalidierung und notwendige technische Felder. Die Daten dürfen nicht ausschließlich in UI-Komponenten leben.

```ts
type Rating = 'low' | 'medium' | 'high';
type AnswerState = 'unanswered' | 'unknown' | 'rated' | 'not_applicable';
type EvidenceLevel = 'assumption' | 'indication' | 'substantiated';
type EvidenceRelation = 'supports' | 'contradicts' | 'context';
type Recommendation = 'develop' | 'validate' | 'reorient' | 'pause' | 'open';
type QuestionId =
  | 'A1' | 'A2' | 'A3' | 'A4'
  | 'B1' | 'B2' | 'B3' | 'B4'
  | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6'
  | 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6';

interface EvidenceLink {
  evidenceId: string;
  relation: EvidenceRelation;
  explanation: string;
}

interface ReviewStamp {
  reviewedBy: string;
  reviewedAt: string;
  subjectRevision: number;
  evidenceRevisions: Record<string, number>;
}

interface Position {
  person: string;
  rating: Rating | null;
  rationale: string;
  evidenceLinks: EvidenceLink[];
  recordedAt: string;
}

interface Answer {
  questionId: QuestionId;
  revision: number;
  state: AnswerState;
  rating: Rating | null;
  rationale: string;
  evidenceLevel: EvidenceLevel | null;
  evidenceLinks: EvidenceLink[];
  scope: string;
  openCheck: string;
  criticalForDecision: boolean;
  valueStepIds: string[];
  notApplicableReason: string;
  disputed: boolean;
  positions: Position[];
  substantiationReview: ReviewStamp | null;
  conflictResolution: { rationale: string; review: ReviewStamp } | null;
  assessedBy: string;
  assessedAt: string | null;
}

interface Evidence {
  id: string;
  revision: number;
  kind: string;
  title: string;
  authorOrOrigin: string;
  url: string | null;
  internalReference: string | null;
  observation: string;
  eventDate: string | null;
  recordedAt: string;
  reviewStatus: 'unreviewed' | 'reviewed' | 'needs_review';
  reviewedRevision: number | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewDueAt: string | null;
  scopeAndLimitations: string;
  synthetic: boolean;
}

interface ValueStep {
  id: string;
  title: string;
  customerValue: string;
  requiredResources: string;
  currentAIUse: string;
  alternative: string;
  critical: boolean;
  openQuestions: string;
}

interface Threat {
  id: string;
  revision: number;
  category: string;
  actor: string;
  change: string;
  valueStepIds: string[];
  economicMechanism: string;
  basis: 'observed' | 'scenario';
  questionIds: QuestionId[];
  evidenceLinks: EvidenceLink[];
}

interface ProtectionLink {
  id: string;
  revision: number;
  questionId: QuestionId; // nur C1–C6 zulassen
  threatId: string;
  mechanism: string;
  limitations: string;
  evidenceLinks: EvidenceLink[];
  review: ReviewStamp | null;
  reviewedAnswerRevision: number | null;
  reviewedThreatRevision: number | null;
}

interface FinancialBaseline {
  period: 'month';
  currency: string;
  revenue: number | null;
  variableCosts: number | null;
  fixedCosts: number | null;
  sourceNote: string;
}

interface FinancialStress {
  priceChange: number | null;
  volumeChange: number | null;
  unitVariableCostChange: number | null;
  fixedCostDelta: number | null;
  oneOffCost: number | null;
  assumptionNote: string;
  modelApplicable: boolean | null;
}

interface Scenario {
  id: string;
  template: 'bundle' | 'competitor' | 'provider' | 'demand' | 'upside' | 'custom';
  title: string;
  status: 'open' | 'worked' | 'not_applicable';
  notApplicableReason: string;
  assumption: string;
  horizonMonths: number;
  valueStepIds: string[];
  customerReaction: string;
  remainingPaidValue: string;
  response: string;
  timeAndResourceNeeds: string;
  earlyIndicator: string;
  evidenceLinks: EvidenceLink[];
  financialStress: FinancialStress | null;
  openQuestions: string;
}

interface Action {
  id: string;
  title: string;
  description: string;
  linkedQuestionIds: QuestionId[];
  linkedRuleIds: string[];
  linkedFindingIds: string[];
  linkedThreatIds: string[];
  linkedScenarioIds: string[];
  expectedEvidence: string;
  owner: string;
  dueAt: string | null;
  status: 'open' | 'in_progress' | 'done' | 'cancelled';
  effortNote: string;
}

interface Decision {
  recommendation: Recommendation;
  rationale: string;
  conditions: string;
  dissent: string;
  findingResponses: { findingId: string; response: string }[];
  decidedBy: string;
  decidedAt: string | null;
  reviewDueAt: string | null;
  provisional: boolean;
}

interface AssessmentContent {
  title: string;
  customerAlias: string;
  type: 'existing' | 'idea';
  decisionQuestion: string;
  customerSegment: string;
  user: string;
  economicBuyer: string;
  customerProblem: string;
  currentAlternative: string;
  paidOutcome: string;
  revenueModel: string;
  costDescription: string;
  marketContext: string;
  excludedScope: string;
  horizonMonths: number;
  owner: string;
  participants: string[];
  valueSteps: ValueStep[];
  answers: Record<QuestionId, Answer>;
  evidence: Evidence[];
  threats: Threat[];
  protections: ProtectionLink[];
  baseline: FinancialBaseline | null;
  scenarios: Scenario[];
  actions: Action[];
  decision: Decision;
  executiveSummary: {
    mainThreat: string;
    evidencedAdvantage: string;
    keyUnknown: string;
    priorityActionIds: string[];
  };
}

interface MethodologySnapshot {
  version: string;
  questions: {
    id: QuestionId;
    group: 'A' | 'B' | 'C' | 'D';
    text: string;
    anchors: Record<Rating, string>;
    allowsNotApplicable: boolean;
    helpText: string;
  }[];
  rules: { id: string; triggerDescription: string; outputDescription: string }[];
  notes: string;
}

interface Revision {
  revisionId: string;
  revisionNumber: number;
  createdAt: string;
  createdBy: string;
  comment: string;
  methodologyVersion: string;
  methodologySnapshot: MethodologySnapshot;
  evaluationAsOf: string;
  reviewed: boolean;
  content: AssessmentContent;
  derivedFindingsSnapshot: RuleFinding[];
}

interface RuleFinding {
  findingId: string;
  ruleId: string;
  kind: 'observed' | 'hypothesis' | 'missing_information';
  title: string;
  rationale: string;
  triggerQuestionIds: QuestionId[];
  threatIds: string[];
  evidenceIds: string[];
  suggestedCheck: string;
}

interface Assessment {
  id: string;
  schemaVersion: string;
  methodologyVersion: string;
  methodologySnapshot: MethodologySnapshot;
  evaluationAsOf: string;
  createdAt: string;
  updatedAt: string;
  isExample: boolean;
  originAssessmentId: string | null;
  status: 'draft' | 'in_review' | 'reviewed';
  content: AssessmentContent;
  revisions: Revision[];
}

interface WorkspaceExport {
  format: 'ai-resilience-check';
  schemaVersion: string;
  appVersion: string;
  exportedAt: string;
  assessments: Assessment[];
}
```

### 10.2 Konsistenzregeln

- Nur der Zustand `rated` darf eine `rating` enthalten. Bei Zustandswechseln nicht mehr gültige Bewertungsfelder bereinigen; Historie bewahren.
- `not_applicable` verlangt eine zulässige Frage und eine Begründung.
- Referenzen müssen auf vorhandene Objekte desselben Falls zeigen.
- `ProtectionLink.questionId` darf ausschließlich einen C-Faktor referenzieren.
- Zeitangaben werden technisch eindeutig gespeichert; Anzeige auf Deutsch. Keine erfundenen Erhebungsdaten.
- Geldbeträge und Faktoren müssen endlich sein; `NaN` und Infinity sind unzulässig.
- Beispiel- und synthetische Quellen dürfen in realen Fällen nicht als geprüfte Belege zählen.
- Eine Belegqualifikation oder Konfliktauflösung ist nur aktuell, wenn ihre gespeicherten Versionsbezüge zu den relevanten aktuellen Inhalten passen. Neu hinzugefügte widersprechende Quellen werden ebenfalls berücksichtigt; ein manueller Schalter allein darf sie nicht verschwinden lassen.
- Wird eine Quelle gelöscht, muss die Anwendung abhängige Bewertungen anzeigen und deren Belegstatus korrekt zurücksetzen. Kein unbemerkt „belegter“ Befund mit verschwundener Quelle.

### 10.3 Historie

Bei fachlichem Abschluss wird ein Snapshot mit Methodenversion, Antworten, Belegen, Empfehlung und erzeugten Hinweisen angelegt. Er wird durch weitere Bearbeitung nicht überschrieben. Neue Bearbeitung erzeugt einen Entwurf auf Basis dieses Stands.

Die lokale Historie dient der Nachvollziehbarkeit. Sie ist nicht manipulationssicher und darf nicht als „revisionssicher“ vermarktet werden.

Ein Import mit unbekannter zukünftiger Schemaversion wird verständlich zurückgewiesen. Ein importierter Fall mit einer nicht unterstützten Methodenversion kann zunächst nur gelesen werden; keine stille Neuberechnung nach anderen Regeln. Der Methodensnapshot enthält die ursprünglichen Fragetexte, Anker und Regelbeschreibungen. Bei fehlendem Snapshot und unbekannter Methode ist nur eine klar gekennzeichnete Rohansicht zulässig; niemals aktuelle Fragetexte unter alte Antworten setzen. Snapshots enthalten Daten und Beschreibungen, keinen beim Import ausführbaren Code. Ein späterer Methodenwechsel benötigt eine ausdrückliche Migration und Vergleichbarkeitshinweise.

---

## 11. Technische Umsetzung des MVP

### 11.1 Empfohlener Standard

Bei einem neuen Repository: React, TypeScript und Vite. Besteht bereits ein geeigneter Stack, verwende ihn. Entscheidend sind eine saubere Trennung von Fachlogik und Oberfläche sowie ein vollständiger lokaler Arbeitsablauf.

Empfohlene Module:

- `domain`: Typen, Validierung, fachliche Invarianten.
- `methodology`: versionierter Fragenkatalog, Anker, Regeln und Hilfetexte.
- `rules`: reine Funktionen für Hinweise und Belegprüfung.
- `scenarios`: wirtschaftliche Berechnung und Validierung.
- `storage`: Browserpersistenz, Migrationen und Snapshots.
- `import-export`: validierter Austausch und Berichte.
- `features`: Fallübersicht, Prüfung, Belege, Szenarien, Entscheidung und Bericht.
- `fixtures`: ausschließlich gekennzeichnete Beispiele und Testdaten.

Die Regeln dürfen keine LLM-Aufrufe enthalten. Dieselben Eingaben, dieselbe Methodenversion und derselbe Auswertungsstichtag ergeben dieselben Hinweise. Das macht die Methode nachvollziehbar; es ist kein Beweis ihrer prognostischen Richtigkeit.

### 11.2 Speicherung

- Für Falldaten IndexedDB oder eine vergleichbar geeignete lokale Browserpersistenz verwenden.
- Automatisch nach Änderungen speichern; sichtbar zwischen „gespeichert“, „Speichern …“ und Fehler unterscheiden.
- Beim Speicherfehler keine erfolgreiche Speicherung behaupten. Aktuellen Stand weiterhin exportierbar halten.
- Browserdaten sind keine verlässliche einzige Sicherung. JSON-Export als reguläre Arbeitsfunktion prominent anbieten.
- Keine Kundendaten in URLs, Analysewerkzeuge, Fehlertelemetrie oder externe Dienste schreiben.
- Externe Quellen erst auf bewussten Nutzerklick öffnen; keine automatischen Vorschauen mit Datenübertragung.
- Ein lokaler Betrieb allein ist keine umfassende Datenschutz- oder Sicherheitszusage.

### 11.3 Import und Export

MVP-Pflicht:

1. Vollständiger JSON-Export eines Falls oder aller Fälle.
2. JSON-Import mit Laufzeitvalidierung, Versionsprüfung und Vorschau vor Übernahme.
3. Druckansicht, aus der über den Browser ein PDF gespeichert werden kann.
4. Markdown-Export des vollständigen Berichts zur Weiterarbeit.

Für JSON ein praktikables Größenlimit festlegen, zum Beispiel 5 MB ohne Anhänge, und Überschreitungen verständlich behandeln. Das Limit ist eine technische MVP-Grenze, kein fachlicher Bewertungsmaßstab.

Bei ID-Kollisionen ausdrücklich zwischen Import als Kopie und Ersetzen wählen lassen. Standard ist Kopie mit neuer Fall-ID. Ein fehlerhafter Import verändert keine bestehenden Daten. Intern verknüpfte IDs bleiben konsistent.

Importierte Inhalte werden als Daten behandelt. Keine Ausführung von HTML oder Skripten; URLs nur mit erlaubten Protokollen öffnen. Texte im Bericht sicher darstellen.

### 11.4 Was nicht in den MVP gehört

- Anmeldung, Mandantenverwaltung oder gleichzeitige Bearbeitung.
- Automatische öffentliche Veröffentlichung oder Versand an Kunden.
- Eine umfassende CRM- oder Projektmanagementintegration.
- Automatische Rechts- oder Complianceprüfung.
- Autonome Internetrecherche oder permanente Überwachung aller KI-Anbieter.
- Ein vollwertiges Finanzmodell.
- Eine behauptete wissenschaftliche Kalibrierung des Verdrängungsrisikos.

Der Pilot soll zuerst die Beratungsmethode und den vollständigen Arbeitsablauf bewähren.

---

## 12. Optionale spätere KI-Unterstützung

Die erste Version funktioniert vollständig ohne externe KI. Später kann eine austauschbare Assistenzschicht hinzukommen.

Sinnvolle Aufgaben:

- Interviewnotizen den Fragen zuordnen.
- Fehlende Belege und widersprüchliche Aussagen markieren.
- Aus vorhandenen Quellen einen Entwurf für einen Befund formulieren.
- Recherchefragen, Szenarien und geeignete Prüfschritte vorschlagen.
- Änderungen zwischen zwei Bewertungsständen zusammenfassen.

Verbindliche Grenzen:

- Jede Ausgabe bleibt als Vorschlag erkennbar.
- Keine erfundenen Quellen, Zahlen oder Beobachtungen.
- Quellenverweise müssen die konkrete Aussage tragen; ein bloß vorhandener Link reicht nicht.
- Bewertungen und Belegstufen werden nicht ohne bewusste Übernahme überschrieben.
- Nur ausgewählte Inhalte werden an einen bewusst konfigurierten Anbieter übertragen.
- Keine geheimen Schlüssel im Browsercode.
- Modellwahl, Speicherung und Datenfluss bleiben austauschbar und nachvollziehbar.
- Inhalte aus Quellen oder importierten Dokumenten gelten als Daten, nicht als ausführbare Arbeitsanweisungen.

Mehrere Modelle dürfen später unterschiedliche Einschätzungen vorschlagen. Ein Mehrheitsvotum von Modellen ist kein empirischer Nachweis. Der Mensch muss weiterhin erkennen können, worauf eine Aussage beruht.

Ein späteres eigenes Prognosemodell wäre ein separates Forschungsvorhaben: Ereignisdefinition, Vergleichsfälle, zeitlich saubere Evaluation und Kalibrierung wären dafür erst zu erarbeiten.

---

## 13. Beispiele und Abnahmefälle

### 13.1 Drei fiktive Demonstrationsfälle

Lege drei ausdrücklich fiktive Beispiele an, die per Schaltfläche als zusätzliche Fälle geladen werden. Bestehende Arbeit wird dadurch nie überschrieben.

1. **Allgemeiner Dokumentenassistent:** einfache Dokumentenfragen, überwiegend austauschbare Funktionen, wenig nachgewiesene Bindung. Zeigt Plattformnähe und offene Differenzierung.
2. **Dokumentenprozess mit fachlicher Prüfung:** Erstellung, Prüfung und Freigabe in einer anspruchsvollen Organisation. Zeigt, dass Generierung, Integration und Verantwortung getrennt untersucht werden müssen. Keine automatische Immunität durch Anforderungen.
3. **Branchenanalyse mit exklusivem Datenzugang:** wertvolle, schwer beschaffbare Daten, aber noch ungeprüfte Nachfrage für ein neues Angebot. Zeigt, dass ein möglicher Datenvorteil keinen Kaufnachweis ersetzt.

Keine realen Unternehmensnamen, vermeintlich realen Kundenbewertungen oder erfundenen Forschungsbelege. Alle Beispielquellen tragen `synthetic: true`; alle Beispielberichte sichtbar „Fiktives Beispiel“. Synthetische Quellen dürfen bei der Übernahme in einen realen Fall keine Belegqualifikation erhalten.

Für automatisierte Tests können separate, klar gekennzeichnete Test-Fixtures mit simuliert geprüften Quellen genutzt werden. Sie dürfen nicht in echte Kundenfälle gelangen.

### 13.2 Fachliche Abnahmetests

| Fall | Erwartetes Verhalten |
| --- | --- |
| Vollständig leerer Fall | „Noch nicht beurteilbar“, keine grüne oder rote Gesamtbewertung. |
| Alle Antworten bewusst unbekannt | Vollständige Wissenslückenliste; keine impliziten Nullwerte. |
| Starker C-Faktor ohne Quelle | Unbestätigter möglicher Vorteil, kein belegter Schutz. |
| Neue Idee mit Datenvorteil und ohne Kaufnachweis | Kundenvalidierung bleibt offen, unabhängig vom Datenvorteil. |
| Belegt niedrige Nachfrage oder Wirtschaftlichkeit bei geringer KI-Bedrohung | R15 beziehungsweise R16 erzeugt einen eigenständigen negativen Befund. |
| Selbst betriebenes Modell ohne Qualitätstests | Kein Bonus durch Selbstbetrieb; Qualitätslücke bleibt sichtbar. |
| Cloudbetrieb mit geprüftem Wechsel und Ausweichverfahren | Keine pauschale Abwertung durch Cloudnutzung. |
| Keine Netzwerkeffekte erforderlich | Begründete Nichtanwendbarkeit oder niedriger Einzelbefund ohne versteckte Gesamtabwertung. |
| Funktion technisch leicht ersetzbar, Ausführung und Bindung aber wertvoll | Beide Befunde bleiben sichtbar; keine automatische Pausenempfehlung. |
| Eigene Daten ohne Ergebnisvorteil | Kein starker belegter Datenvorteil allein wegen Datenbesitz. |
| B1 und B4 hoch, aber unbelegt | Hypothese der Austauschbarkeit statt beobachtetem Befund. |
| B1/B4 belegt hoch, Schutzwirkung ungeklärt | Offene Schutzwirkung, nicht „kein Schutz vorhanden“. |
| Hoher belegter C-Faktor mit ungeprüftem Mechanismus-Freitext | Unterdrückt R06 nicht; die konkrete Schutzwirkung bleibt offen. |
| Kritische D-Lücke und viele C-Vorteile | D-Lücke bleibt eigenständig bestehen; kein rechnerischer Ausgleich. |
| Unterstützende und widersprechende Quellen | Konflikt sichtbar, bis die Auflösung begründet ist. |
| Fällige Quellenüberprüfung überschritten | Erneute Prüfung angezeigt; Quelle bleibt erhalten. |
| Änderung einer Quelle oder Antwort | Abhängige Hinweise aktualisieren sich; abgeschlossene Revision bleibt unverändert. |
| Neue widersprechende Quelle nach alter Konfliktauflösung | Konflikt wird erneut sichtbar und verlangt aktuelle Prüfung. |
| Gleiche Daten und Methode bei anderem Stichtag | Fälligkeit kann sich ändern; historische Revision behält Stichtag und Befunde. |
| Nichtanwendbarkeit ohne Begründung | Nicht als gültig übernehmen. |
| Keine Finanzwerte | Kein berechneter Umsatz, Verlust oder Nullergebnis. |
| Finanzbeispiel aus Abschnitt 7 | E0 = 25.000 EUR; E1 = 5.000 EUR; ΔE = −20.000 EUR. |
| Szenario geändert | Ausgangslage bleibt unverändert. |
| Abweichende menschliche Empfehlung | Begründung und Umgang mit relevanten Hinweisen nachvollziehbar gespeichert. |

### 13.3 Technische Abnahme

- JSON-Export und erneuter Import erhalten Belege, Verknüpfungen, Szenarien, Entscheidungen und Revisionen.
- Beschädigte, zu große oder unzulässige Importe verändern keine vorhandenen Fälle.
- Unbekannte Schema- und Methodenversionen werden entsprechend Abschnitt 10 behandelt.
- Ein als Text importierter HTML-/Skriptinhalt wird niemals ausgeführt.
- Quellverweise mit unzulässigem Protokoll werden nicht geöffnet.
- Browserneustart erhält gespeicherte Fälle; Speicherfehler werden sichtbar behandelt.
- Löschen einer Quelle kann keine verwaisten, weiterhin als belegt geltenden Aussagen hinterlassen.
- Das Laden von Beispielen überschreibt keine realen Fälle.
- Bei engem Bildschirm und Tastaturbedienung bleiben alle Kernfunktionen erreichbar.
- Der Druckbericht enthält offene Punkte, Einschränkungen und Quellen vollständig und ohne abgeschnittene Inhalte.
- Der Kernablauf funktioniert ohne externe KI-Verbindung; nach lokalem Laden sind keine externen Dienste für Bearbeitung, Regeln oder Export erforderlich.

Tests sollen konkrete fachliche und technische Risiken absichern. Keine bloße Spiegelung der Implementierung und keine aufwendigen Tests für unwesentliche Gestaltungselemente.

---

## 14. Methodische Erprobung mit uns

Die Software kann korrekt implementiert sein, während die Methode noch verbessert werden muss. Das wird ausdrücklich getrennt.

Nach der technischen Abnahme wollen wir die Methode an drei bis fünf unterschiedlich gelagerten Fällen erproben. Diese Zahl ist eine Pilotgröße, keine Grundlage für statistische Vorhersagen.

Vorgehen:

1. David, Daniel und Stefan beurteilen ausgewählte Fragen zunächst unabhängig.
2. Unterschiede besprechen: War die Frage unklar, der Anker ungeeignet oder die Beleglage unterschiedlich?
3. Unklare Formulierungen verbessern; Regeln und Version dokumentieren.
4. Prüfen, ob aus dem Check konkrete Entscheidungen und überprüfbare nächste Schritte entstehen.
5. Nach einigen Wochen nachhalten, ob die Prüfaufträge neue Informationen geliefert oder Entscheidungen verändert haben.

Für die Weiterentwicklung beobachten wir Verständlichkeit, Bearbeitungsaufwand, wiederkehrende Wissenslücken und Nutzbarkeit der Entscheidungen. Keine „Prognosegenauigkeit“ behaupten, solange keine definierte Prognose und geeignete historische Evaluation existieren.

---

## 15. Implementierungsreihenfolge für Claude Code

### Schritt 1 — Repository und fachliche Grundlage

- Repository prüfen, vorhandene Konventionen übernehmen.
- Fragenkatalog und Methodenversion als Datenmodell anlegen.
- Typen, Validierung und reine Fachfunktionen implementieren.
- Relevante Tests für unbekannte Werte, Belegstatus und Regeln zuerst absichern.

**Fertig, wenn:** Alle zwanzig Fragen, ihre Anker und die Auswertungsregeln ohne Oberfläche überprüfbar vorliegen.

### Schritt 2 — Vollständiger erster Fall

- Übersicht, Fallprofil, Wertschöpfung und Fragenbearbeitung umsetzen.
- Belege, Beziehungen und abweichende Positionen erfassen.
- Lokale Speicherung, Speicherstatus und JSON-Sicherung ergänzen.

**Fertig, wenn:** Ein Fall angelegt, bearbeitet, geschlossen, wieder geöffnet und verlustfrei exportiert werden kann.

### Schritt 3 — Beratungsergebnis

- Bedrohungen und Schutzwirkung verknüpfen.
- Regelhinweise mit vollständiger Begründung anzeigen.
- Szenarien und optionalen Finanzvergleich ergänzen.
- Menschliche Empfehlung und Maßnahmenplan umsetzen.

**Fertig, wenn:** Aus Antworten und Belegen ein nachvollziehbares Profil mit Entscheidung und nächsten Schritten entsteht.

### Schritt 4 — Bericht, Historie und Vergleich

- Druck- und Markdown-Bericht erstellen.
- Fachlichen Review und unveränderte Snapshots implementieren.
- Portfolioübersicht und vollständigen validierten Import ergänzen.
- Fiktive Beispiele laden können.

**Fertig, wenn:** Wir das Ergebnis einem Kunden geben und später unter gleicher Methodenversion weiterbearbeiten können.

### Schritt 5 — Abnahme und Übergabe

- Die fachlichen und technischen Abnahmefälle aus Abschnitt 13 prüfen.
- Oberfläche in Desktop- und schmaler Ansicht durchlaufen.
- Druckbericht visuell kontrollieren.
- README mit Startanleitung, Speicherung, Sicherung, Methodengrenzen und ausgeführten Tests erstellen.
- Wesentliche offene Punkte ehrlich dokumentieren.

Lieferumfang: lauffähiger Code, nachvollziehbare Fachlogik, Methodenkonfiguration, Beispieldaten, erforderliche Tests, Startanleitung und ein exportierter fiktiver Musterbericht.

Kein abschließendes „fertig“, solange zentrale Schaltflächen wirkungslos sind, Belege verloren gehen, unbekannte Werte als Sicherheit erscheinen oder der Bericht zentrale Einschränkungen unterschlägt.

---

## 16. Quellen und Einordnung

Die Fragen, Anker, Regeln und Produktentscheidungen in diesem Briefing sind unser eigener methodischer Entwurf. Die folgenden Quellen begründen den Kontext beziehungsweise bieten Orientierung für den Umgang mit KI-Risiken. Sie validieren weder diese zwanzig Fragen noch ein Vorhersagemodell.

1. **NIST — AI Risk Management Framework.** Freiwilliger Rahmen für den Umgang mit Risiken beim Entwurf, Einsatz und der Bewertung von KI. Orientierung für nachvollziehbare Verantwortlichkeit und Risikobearbeitung; kein Standard für die Vorhersage von Geschäftsmodellverdrängung. Abruf: 6. November 2026. https://www.nist.gov/itl/ai-risk-management-framework
2. **METR — Independent Assessment of AI R&D Acceleration at Anthropic in October 2026.** Veröffentlicht am 5. November 2026. Kontext für die Möglichkeit beschleunigter KI-Entwicklung; der Bericht enthält ausdrücklich Unsicherheit und Grenzen seiner Evidenz. Aus ihm lassen sich keine firmenspezifischen Markteintritts- oder Überlebenswahrscheinlichkeiten ableiten. Abruf: 6. November 2026. https://metr.org/blog/2026-11-05-anthropic-ai-rd-acceleration-assessment/

Spätere reale Fallbeispiele und Aussagen über aktuelle Anbieterfunktionen benötigen eigene datierte Quellen. Keine aus diesem Briefing abgeleiteten Demoannahmen als Marktbeobachtungen ausgeben.

## 17. Zusammenfassender Arbeitsauftrag

Baue ein Werkzeug, das unsere Beratungsgespräche strukturiert, Aussagen mit Belegen verbindet und Entscheidungen überprüfbar macht. Der Kundennutzen besteht darin, sinnvolle Investitionen, nötige Anpassungen und entscheidende Wissenslücken früher zu erkennen.

Die erste Version soll praktisch einsetzbar, verständlich und methodisch ehrlich sein. Ihre wichtigste Eigenschaft ist, dass jederzeit erkennbar bleibt: **Was wissen wir, was nehmen wir an, welche Entscheidung folgt daraus und was müssen wir als Nächstes prüfen?**
