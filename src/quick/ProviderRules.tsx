import { isProviderV4 } from "./provider-questions";
import {
  ROUTE_LABELS,
  PROTECTION_LABELS,
  BENEFIT_LABELS,
} from "./provider-analysis";
import { PROVIDER_SCENARIO_METHOD } from "./provider-scenario";

// One explanation for screen and print, selected by the saved method.
export function ProviderRules({ version }: { version: string }) {
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
