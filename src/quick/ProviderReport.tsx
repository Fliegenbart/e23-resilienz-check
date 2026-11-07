import type { QuickCheck } from "./model";
import { checkTitle } from "./model";
import {
  evaluateProvider,
  ROUTE_LABELS,
  PROTECTION_LABELS,
} from "./provider-analysis";
import { PROVIDER_PREMISE, PROVIDER_BOUNDARIES } from "./provider-questions";
import { ProviderFindings } from "./ProviderResults";
import { ProviderScenario } from "./ProviderScenario";
import { PROVIDER_SCENARIO_METHOD } from "./provider-scenario";

export function ProviderReport({ check }: { check: QuickCheck }) {
  const r = evaluateProvider(check);
  return (
    <article className="quick-print-report provider-print-report">
      <header className="print-brand">
        <strong>e23</strong>
        <span>Resilience-Assessment</span>
      </header>
      <p className="print-context">
        {checkTitle(check)}
        {check.isExample ? " · Fiktives Beispiel" : ""}
      </p>
      <h1>{r.headline}</h1>
      <p>{r.summary}</p>
      <p>{r.answered} von 12 eingeschätzt. Ergebnis auf Basis Ihrer Angaben.</p>
      {check.businessDescription?.trim() && (
        <section className="print-business-description">
          <h2>Ihr Business</h2>
          <p>{check.businessDescription}</p>
        </section>
      )}
      <ProviderScenario check={check} print />
      <section className="print-block">
        <h2>Grundannahme des Stresstests</h2>
        <p>{PROVIDER_PREMISE}</p>
        <p>{PROVIDER_BOUNDARIES}</p>
      </section>
      <ProviderFindings check={check} print />
      <h2 className="print-page-start">Ihre Antworten</h2>
      {check.methodologySnapshot.map((q) => (
        <section className="print-block print-answer" key={q.id}>
          <h3>
            {q.id} · {q.text}
          </h3>
          <p>
            <strong>
              {typeof check.answers[q.id] === "number"
                ? `${check.answers[q.id]} von 10`
                : "Noch offen"}
            </strong>
          </p>
          <p>
            1: {q.low}
            <br />
            10: {q.high}
          </p>
        </section>
      ))}
      <section className="print-block">
        <h2>Grundlage der Auswertung</h2>
        <p>{PROVIDER_SCENARIO_METHOD}</p>
        <p>
          Methode {check.methodologyVersion}. Die drei Angriffswege verwenden
          Q1/Q2/Q3, Q1/Q2/Q4 und Q4/Q5/Q6. Alle drei Werte ab 7: „
          {ROUTE_LABELS.high}“. Sonst alle ab 4: „{ROUTE_LABELS.partial}“. Ein
          Wert bis 3: „{ROUTE_LABELS.barrier}“. Sobald eine Antwort fehlt: „
          {ROUTE_LABELS.unknown}“.
        </p>
        <p>
          Schutzfaktoren Q7–Q10: 1–3 „{PROTECTION_LABELS.weak}“, 4–6 „
          {PROTECTION_LABELS.limited}“, 7–10 „{PROTECTION_LABELS.strong}“. Q11
          und Q12 betrachten Vergleich und Kaufentscheidung separat; beide ab 7
          stützen einen bezahlten Vorteil nach Ihren Angaben. Sie bestätigen
          nicht automatisch jeden Schutzfaktor. Eigene Gesprächsregeln, keine
          Übernahmewahrscheinlichkeit.
        </p>
        <p>
          Hintergrund: ARK Invest, Big Ideas 2026, S. 20, 26–28, 33–36. Die
          Preis- und Aufgabenmessungen sowie das Modell der Agenten als
          Zugangsschicht begründen die Fragen. Marktprognosen werden nicht auf
          das Unternehmen übertragen.
        </p>
        <p>
          Weitere Quellen: metr.org/time-horizons/ ·
          cloud.google.com/gemini-enterprise/connectors ·
          claude.com/resources/articles/cowork-plugins-across-enterprise ·
          help.openai.com/en/articles/12628342-company-knowledge-in-chatgpt
        </p>
        <p>
          Check-ID: {check.id}
          <br />
          Stand:{" "}
          {new Intl.DateTimeFormat("de-DE", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Europe/Berlin",
          }).format(new Date(check.updatedAt))}
        </p>
      </section>
    </article>
  );
}
