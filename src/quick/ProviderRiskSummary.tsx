import type { QuickCheck } from "./model";
import { evaluateProviderV5 } from "./provider-analysis-5";
import { currentBusinessAnalysis } from "./business-analysis";

export function ProviderRiskScore({ check }: { check: QuickCheck }) {
  const { risk } = evaluateProviderV5(check);
  return (
    <div className={`provider-risk risk-${risk.tone}`}>
      <p className="provider-risk-label">KI-Risiko-Score</p>
      <div className="provider-risk-value">
        <strong>{risk.score ?? `${risk.min}–${risk.max}`}</strong>
        {risk.score !== null && <span>/100</span>}
        <span className="provider-risk-band">{risk.label}</span>
      </div>
      {risk.score !== null && (
        <div className="provider-risk-track" aria-hidden="true">
          <span style={{ width: `${risk.score}%` }} />
        </div>
      )}
      <p className="provider-risk-caption">
        Sehr leistungsfähige KI · 0 niedrig, 100 hoch · keine Wahrscheinlichkeit
      </p>
      <p className="provider-risk-basis">
        Basis: {risk.basis}
        {risk.missing.length
          ? " · Angaben fehlen"
          : risk.conflicts.length
            ? " · Widerspruch klären"
            : ""}
      </p>
    </div>
  );
}

export function ProviderPurchaseFindings({
  check,
  print = false,
}: {
  check: QuickCheck;
  print?: boolean;
}) {
  const r = evaluateProviderV5(check);
  const personal = currentBusinessAnalysis(check);
  const findings = personal
    ? [
        personal.result.takeover[0],
        personal.result.protection[0],
        personal.result.nextStep,
      ]
    : [];
  return (
    <section
      className="provider-purchase"
      aria-label="Ihr verbleibender Kaufgrund"
    >
      <div className="provider-purchase-grid">
        <section className="print-block">
          <h2>Was KI übernimmt</h2>
          <p>{personal?.result.takeover[0].detail ?? r.takeover}</p>
        </section>
        <section className="print-block">
          <h2>Wofür Kunden weiter zahlen</h2>
          <p>{personal?.result.protection[0].detail ?? r.payment}</p>
        </section>
      </div>
      <section className="provider-purchase-test print-block">
        <h2>Nächster Test</h2>
        <p>{personal?.result.nextStep.detail ?? r.nextStep}</p>
      </section>
      {personal && personal.result.openQuestions.length > 0 && (
        <p className="provider-purchase-open">
          Noch zu klären: {personal.result.openQuestions[0]}
        </p>
      )}
      {personal && (
        <details
          className="business-analysis-basis print-block"
          open={print || undefined}
        >
          <summary>Grundlage der Aussagen</summary>
          {findings.map((finding, i) => (
            <p key={i}>
              <strong>{finding.title}</strong>
              {finding.basisQuote && (
                <span>Ihre Beschreibung: „{finding.basisQuote}“</span>
              )}
              {finding.questions.length > 0 && (
                <span>Ihre Antworten: {finding.questions.join(", ")}</span>
              )}
            </p>
          ))}
          <p>Eigener KI-Nutzen: {personal.result.opportunity.detail}</p>
          {personal.result.openQuestions.map((question, i) => (
            <p key={i}>Offen: {question}</p>
          ))}
          <p>
            KI-Einschätzung aus Ihren Angaben. Keine externe Prüfung. Der Score
            wird aus den Antworten berechnet.
          </p>
        </details>
      )}
    </section>
  );
}
