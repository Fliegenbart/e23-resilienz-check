import type { QuickCheck } from "./model";
import { checkTitle } from "./model";
import { evaluateProvider } from "./provider-analysis";
import { providerPremise, PROVIDER_BOUNDARIES } from "./provider-questions";
import { ProviderFindings } from "./ProviderResults";
import { ProviderScenario } from "./ProviderScenario";
import { ProviderRules } from "./ProviderRules";

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
        <p>{providerPremise(check.methodologyVersion)}</p>
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
        <ProviderRules version={check.methodologyVersion} />
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
