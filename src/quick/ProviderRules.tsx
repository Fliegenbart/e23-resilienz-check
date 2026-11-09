import {
  isProviderV4,
  isProviderV5,
  isProviderV6,
  isProviderV7,
} from "./provider-questions";
import {
  ROUTE_LABELS,
  PROTECTION_LABELS,
  BENEFIT_LABELS,
} from "./provider-analysis";
import { PROVIDER_SCENARIO_METHOD } from "./provider-scenario";

// One explanation for screen and print, selected by the saved method.
export function ProviderRules({ version }: { version: string }) {
  if (isProviderV7(version))
    return (
      <>
        <p>
          Methode {version}. Der Score beschreibt die Ersetzbarkeit Ihrer
          bezahlten Leistung bei günstigen Expertenteams für alle. Der Verlust
          der Oberfläche, die Nutzbarkeit für Agenten und die Macht eines
          Vermittlers sind getrennte Befunde. Keine Pleitewahrscheinlichkeit und
          keine Zeitprognose.
        </p>
        <p>
          Normierung: (Antwort − 1) / 9. Direkte Ersetzung = min(Q1, Q2, Q10);
          andere Anbieter = min(Q2, Q5). Schutz = min(Q6, Q7, Q8). Score = 100 ×
          max(direkte Ersetzung, andere Anbieter) × (1 − 0,75 × Schutz), auf
          Fünferschritte gerundet. Bedienung = min(Q2, Q4) wird separat gezeigt
          und erhöht den Score nicht allein.
        </p>
        <p>
          Unbekannte Antworten werden mit beiden möglichen Extremen gerechnet.
          Starke Schutzbehauptungen (Q6–Q8 ab 7) bleiben ohne mehrfach
          bestätigten bezahlten Vergleich (Q12 ab 7) offen. Hohe Ersetzbarkeit
          und schwere Beschaffbarkeit zugleich (Q5/Q7 ab 7) öffnen Q7. Konkrete
          Beanstandungen der KI öffnen ebenfalls die betroffene Antwort. Ein
          nicht tragfähiger oder nur bedingter KI-Burggrabenbefund hält hohe
          Schutzwerte auch bei angegebenen Kaufbelegen offen. Daraus entsteht
          eine Spanne, keine von der KI erfundene Zahl.
        </p>
        <p>
          Beanstandete Schutzbehauptungen werden als „Angaben prüfen“ markiert.
          Eine niedrige Untergrenze ist dann keine Entwarnung. Q12 bleibt eine
          nicht unabhängig geprüfte Selbstauskunft. Fehlende Belege erhöhen die
          Unsicherheit, nicht automatisch das Risiko.
        </p>
        <p>
          Q3 erfasst direkte Nutzung und Bezahlung durch Agenten. Q11 erfasst
          die Kontrolle über den Kundenzugang. Eine Schnittstelle garantiert
          weder Auswahl noch Umsatz. Beide verändern den Ersetzbarkeits-Score
          nicht. Die mögliche Zuliefererrolle braucht einen bezahlten Beitrag,
          einen Auswahlgrund und eine tragfähige Marge trotz Vermittlung.
        </p>
        <p>
          Der aktuelle Anbieterabgleich verwendet begrenzte öffentliche
          Sachthemen, offizielle Anbieterquellen und deren tatsächliche
          Textauszüge. Vollständige Geschäftsbeschreibungen gehen nicht an die
          Suchmaschine. Quellenabruf und Anbieterangaben sind kein unabhängiger
          Qualitätstest. Ohne passende Quellen bleibt die heutige Fähigkeit
          ungeprüft; das Expertenszenario bleibt separat möglich.
        </p>
        <p>
          0–30 niedrig, 35–60 mittel, 65–80 hoch, 85–100 sehr hoch. Gewichte und
          Grenzen sind transparente Einschätzungsregeln, nicht empirisch
          kalibriert. Für zwei Jahre schließt langsam/mittel/schnell rechnerisch
          0,2/0,5/0,8 der Fähigkeitslücke ab Q9; Preisdruck wird mit 0,55/0,75/1
          gewichtet. Bei offenen Risikofragen bleibt diese Einordnung offen.
          Günstigere KI schafft keine Rechte oder Daten.
        </p>
      </>
    );
  if (isProviderV6(version))
    return (
      <>
        <p>
          Methode {version}. Der KI-Risiko-Score beschreibt die Ersetzbarkeit,
          wenn günstige Expertenteams für alle verfügbar sind: Kunden, bekannte
          Wettbewerber, neue Anbieter und Sie selbst. Andere Lösungen für das
          Kundenproblem zählen genauso wie Nachbauen. Kein Eintrittsdatum, keine
          Wahrscheinlichkeit.
        </p>
        <p>
          Antworten werden mit (Wert − 1) / 9 normiert. Drei Wege: direkte
          Lösung = min(Q1, Q2, Q10) × (0,7 + 0,3 × Q3); Bedienung = min(Q4, Q2);
          andere Anbieter = min(Q5, Q2) × (0,7 + 0,3 × Q3). Expertenwissen
          allein umgeht keine fehlenden Daten oder Zugänge. Niedriger heutiger
          Assistentenzugang begrenzt den Faktor auf 0,7, ist keine dauerhafte
          Sperre.
        </p>
        <p>
          Schutz = min(Q6, Q7, Q8): eigener Beitrag nötig, schwer ersetzbar und
          kaufentscheidend. Score = 100 × stärkster Übernahmeweg × (1 − 0,75 ×
          Schutz), auf Fünferschritte gerundet. 0–30 niedrig, 35–60 mittel,
          65–80 hoch, 85–100 sehr hoch. Gewichte und Grenzen sind offengelegte
          Einschätzungsregeln, nicht empirisch kalibriert.
        </p>
        <p>
          Unbekannte Antworten ergeben eine Spanne aus den möglichen Extremen.
          Hohe Ersetzbarkeit und hoher Schutz zugleich (Q2/Q6 oder Q5/Q7 jeweils
          ab 7) lassen den Schutz offen; die obere Grenze wird ohne Schutzabzug
          berechnet. Die KI kann solche Angaben hinterfragen, ändert aber keine
          Zahl.
        </p>
        <p>
          Q11 beschreibt die Häufigkeit des Bedarfs. Das ist nur ein Hinweis auf
          wirtschaftlichen Nutzen. Erreichbare Kunden, Zahlungsbereitschaft,
          Zugang, Betriebskosten und Bündelung werden separat geprüft. Eine
          kleine Nische schützt nicht automatisch. Q11 verändert den
          Ersetzbarkeits-Score nicht.
        </p>
        <p>
          Q12 beschreibt echte Käufe nach einem Vergleich mit Alternativen: 1–3
          Annahmen, 4–6 erste Belege, 7–10 Praxistest laut Angaben. Fehlende
          Kaufbelege erhöhen die Unsicherheit, nicht den Score. Neue Ideen
          werden nicht automatisch schlechter bewertet.
        </p>
        <p>
          Der Zwei-Jahres-Blick bleibt ein Szenario: Q9 ist der heutige
          KI-Vergleich. Langsam/mittel/schnell schließt rechnerisch 0,2/0,5/0,8
          der verbleibenden Fähigkeitslücke; Kostendruck gewichtet mit
          0,55/0,75/1. Der stärkste wirksame Weg wird damit gewichtet. Ab 0,65
          hoher, ab 0,35 teilweiser, darunter begrenzter Druck. Ohne
          Ausgangslage bleibt der Blick offen. Diese Gewichte sind keine
          gemessenen Wachstumsraten und versprechen kein Expertenniveau in 12–18
          Monaten. Niedrige Kosten ermöglichen mehr parallele Einsätze, erzeugen
          aber keine Rechte oder Daten.
        </p>
      </>
    );
  if (isProviderV5(version))
    return (
      <>
        <p>
          Methode {version}. Der KI-Risiko-Score bewertet den Verlust des
          Kaufgrunds bei sehr leistungsfähigen Agenten: 0 niedrig, 100 hoch. Er
          ist keine Wahrscheinlichkeit und keine Vorhersage eines Firmenendes.
        </p>
        <p>
          Alle Antworten von 1 bis 10 werden auf 0 bis 1 umgerechnet: (Antwort −
          1) / 9. Drei Wege: KI-Funktion, ersetzte Bedienung und austauschbarer
          Anbieter. Der stärkste Weg zählt, nicht der Durchschnitt.
        </p>
        <p>
          KI-Funktion: der größere Wert aus min(Q1, Q2) × (0,7 + 0,3 × Q3) und
          Q10. Bedienung: Q4. Anbieterauswahl: Q5 × (0,7 + 0,3 × Q3). Wenig
          Plattformzugang senkt den Druck höchstens um 30 Prozent; er ist keine
          dauerhafte Zugangssperre.
        </p>
        <p>
          Schutz trägt nur gemeinsam: nötig (Q6), schwer ersetzbar (Q7) und den
          Aufpreis wert (Q8). Der kleinste dieser Werte zählt. Score = 100 ×
          stärkster Weg × (1 − 0,75 × Schutz), auf Fünferschritte gerundet.
          Eigener KI-Nutzen (Q11) und Kaufbelege (Q12) verändern den Score
          nicht.
        </p>
        <p>
          0–30 niedrig, 35–60 mittel, 65–80 hoch, 85–100 sehr hoch. Die Gewichte
          und Grenzen sind nachvollziehbare Einschätzungsregeln, nicht empirisch
          kalibriert. Hohe Schutzwerte bleiben Selbstauskünfte.
        </p>
        <p>
          Bei fehlenden Antworten wird mit beiden möglichen Extremen gerechnet.
          Unterschiedliche Ergebnisse erscheinen als Spanne. Behauptete
          Ersetzbarkeit und behaupteter Schutz zugleich (Q2/Q6 oder Q5/Q7
          jeweils ab 7) ergeben ebenfalls eine Spanne: Der Schutz gilt dann als
          ungeklärt.
        </p>
        <p>
          Belege Q12: 1–3 Annahmen, 4–6 erste Belege, 7–10 Praxistest laut Ihren
          Angaben. Fehlende Kaufbelege erhöhen die Unsicherheit, nicht den
          Risiko-Score. Die Beschreibung konkretisiert die Tätigkeiten, den
          Kaufgrund und den Test; die KI darf den berechneten Score nicht
          ändern.
        </p>
        <p>
          Der Zwei-Jahres-Blick ist ein getrenntes Szenario. Ausgangspunkt ist
          die heutige KI-Leistung Q9. Langsam/mittel/schnell schließt
          rechnerisch 0,2/0,5/0,8 der verbleibenden Fähigkeitslücke. Der
          angenommene Kostendruck gewichtet das Ergebnis mit 0,55/0,75/1. Das
          sind Szenariogewichte, keine gemessenen Wachstumsraten oder
          Preisprognosen.
        </p>
        <p>
          Der stärkste wirksame Weg wird mit dieser angenommenen
          Leistungsfähigkeit gewichtet. Ab 0,65 gilt hoher, ab 0,35 teilweiser,
          darunter begrenzter Übernahmedruck. Günstigere KI erhöht nur den
          Preisdruck, nicht ihre Fähigkeiten. Fehlt Q9 oder ist der Kaufgrund
          ungeklärt, bleibt das Szenario offen. Der grundlegende
          Stresstest-Score bleibt unabhängig vom Tempo.
        </p>
      </>
    );
  const current = isProviderV4(version);
  return (
    <>
      <p>
        Methode {version}.{" "}
        {current
          ? "Arbeit übernehmen: Q1/Q2. Mitliefern: Q1/Q2/Q3. KI-Vorsprung einholen: Q4."
          : "Arbeit übernehmen: Q1/Q2/Q3. Mitliefern: Q1/Q2/Q4. Oberfläche umgehen: Q4/Q5/Q6."}
      </p>
      <p>
        Pro Weg: alle Werte 7–10 „{ROUTE_LABELS.high}“. Sonst alle mindestens 4
        „{ROUTE_LABELS.partial}“. Mindestens ein Wert 1–3 „
        {ROUTE_LABELS.barrier}“. Sobald eine Antwort fehlt: „
        {ROUTE_LABELS.unknown}“, auch wenn andere Werte niedrig sind.
      </p>
      <p>
        Schutzfaktoren {current ? "Q5–Q10" : "Q7–Q10"}: 1–3 „
        {PROTECTION_LABELS.weak}“, 4–6 „{PROTECTION_LABELS.limited}“, 7–10 „
        {PROTECTION_LABELS.strong}“. Fehlende Angaben bleiben offen. Ein hoher
        Wert allein belegt keinen Schutz.
      </p>
      {current ? (
        <>
          <p>
            Eigener KI-Nutzen Q11: 1–3 „{BENEFIT_LABELS.low}“, 4–6 „
            {BENEFIT_LABELS.partial}“, 7–10 „{BENEFIT_LABELS.high}“. Fehlende
            Angaben bleiben offen. Wettbewerber können dieselbe KI nutzen.
            Eigener Nutzen und Schutz werden nicht vom Risiko abgezogen.
          </p>
          <p>
            Belege Q12: 1–3 unbelegt, 4–6 erste Belege, 7–10 laut Ihren Angaben
            mehrfach durch Käufe nach einem KI-Vergleich bestätigt. Fehlende
            Angaben bleiben offen. Das bestätigt nicht automatisch jeden
            einzelnen Schutzfaktor.
          </p>
        </>
      ) : (
        <p>
          Belege Q11/Q12: beide ab 7 stützen einen bezahlten Vorteil nach Ihren
          Angaben. Mindestens ein Wert bis 3: unbelegt. Sonst teilweise belegt.
          Sobald eine Antwort fehlt: offen. Das bestätigt nicht automatisch
          jeden Schutzfaktor. Eigene Vorteile werden nicht von den Angriffswegen
          abgezogen.
        </p>
      )}
      <p>{PROVIDER_SCENARIO_METHOD}</p>
      {current && (
        <p>
          Das KI-Tempo betrifft mögliche Übernahme und eigenen Nutzen getrennt.
          Bei gleicher Einstufung steht Q4 vor Q1/Q2 und Q1/Q2/Q3. Preisdruck
          beruht auf Q1/Q2/Q3, danach Q1/Q2; günstige KI schließt keine
          Fähigkeitslücke. Fehlende Antworten bleiben offen.
        </p>
      )}
      <p>
        Eigene qualitative Gesprächsregeln, keine Übernahmewahrscheinlichkeit.
        Eine heutige Hürde kann kleiner werden. Auch präzise Berechnungen,
        Datenschutz oder eine Ergebniszusage machen ein Geschäft nicht
        automatisch unersetzbar.
      </p>
    </>
  );
}
