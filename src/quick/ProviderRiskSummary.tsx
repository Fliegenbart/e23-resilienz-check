import type { QuickCheck } from "./model";
import { evaluateProvider } from "./provider-analysis";
import { isExpertMethod, isProviderV7 } from "./provider-questions";
import { providerRiskV7 } from "./provider-analysis-7";
import { CurrentCapabilities, AgentRoleFinding } from "./AgentFindings";
import {
  currentBusinessAnalysis,
  expertReviewFor,
  moatReviewFor,
  moatDisputesScore,
  quoteSource,
  MOAT_VERDICTS,
  MOAT_PACES,
  type BusinessAnalysis,
} from "./business-analysis";
import { EXPERT_ATTACKS } from "./ExpertScenarioIntro";

export function ProviderRiskScore({ check }: { check: QuickCheck }) {
  const risk = evaluateProvider(check).risk!;
  const review = isProviderV7(check.methodologyVersion)
    ? providerRiskV7(check).review
    : [];
  const disputed = moatDisputesScore(
    currentBusinessAnalysis(check),
    risk.score,
  );
  return (
    <div className={`provider-risk risk-${disputed ? "unknown" : risk.tone}`}>
      <p className="provider-risk-label">KI-Risiko-Score</p>
      <div className="provider-risk-value">
        <strong>{risk.score ?? `${risk.min}–${risk.max}`}</strong>
        {risk.score !== null && <span>/100</span>}
        <span className="provider-risk-band">
          {review.length
            ? "Angaben prüfen"
            : disputed
              ? "KI widerspricht"
              : risk.label}
        </span>
      </div>
      {risk.score !== null && (
        <div className="provider-risk-track" aria-hidden="true">
          <span style={{ width: `${risk.score}%` }} />
        </div>
      )}
      <p className="provider-risk-caption">
        {isProviderV7(check.methodologyVersion) &&
          "Ersetzbarkeit Ihrer Leistung · "}
        {isExpertMethod(check.methodologyVersion)
          ? "KI auf Expertenniveau"
          : "Sehr leistungsfähige KI"}{" "}
        · 0 niedrig, 100 hoch · keine Wahrscheinlichkeit
      </p>
      {review.length > 0 && (
        <p className="provider-risk-review" role="status">
          {review[0].reason} Die Spanne bleibt bis zur Klärung offen.
        </p>
      )}
      <p className="provider-risk-basis">
        Basis: {risk.basis}
        {risk.missing.length
          ? " · Angaben fehlen"
          : risk.conflicts.length
            ? " · Widerspruch klären"
            : ""}
      </p>
      {disputed && (
        <p className="provider-risk-review" role="status">
          Die KI bezweifelt Ihren Schutz. Der Score beruht auf Ihren Antworten –
          bitte prüfen.
        </p>
      )}
    </div>
  );
}

function MoatReviewPanel({ analysis }: { analysis: BusinessAnalysis | null }) {
  const review = moatReviewFor(analysis);
  if (!review) return null;
  const expert = isExpertMethod(analysis!.input.methodologyVersion);
  const title = expert ? "Ihr Burggraben" : "KI-Prüfung Ihres Vorteils";
  return (
    <section
      className={`provider-moat-review moat-${review.verdict} print-block`}
      aria-label={title}
    >
      <h2>{title}</h2>
      <p className="provider-moat-verdict">
        {expert && review.verdict === "durable"
          ? "Hürde auch für Expertenteams"
          : MOAT_VERDICTS[review.verdict]}
      </p>
      <p>{review.reason}</p>
      <p className="provider-moat-pace">{MOAT_PACES[review.pace]}</p>
    </section>
  );
}

export function ProviderPurchaseFindings({
  check,
  print = false,
}: {
  check: QuickCheck;
  print?: boolean;
}) {
  const r = evaluateProvider(check);
  const personal = currentBusinessAnalysis(check);
  const moatReview = moatReviewFor(personal);
  const expert = isExpertMethod(check.methodologyVersion);
  const agent = isProviderV7(check.methodologyVersion);
  const AttackContainer = agent ? "details" : "section";
  const expertReview = expertReviewFor(personal);
  const findings = personal
    ? [
        personal.result.takeover[0],
        personal.result.protection[0],
        personal.result.nextStep,
        ...(expertReview ? Object.values(expertReview) : []),
      ]
    : [];
  return (
    <section
      className="provider-purchase"
      aria-label="Ihr verbleibender Kaufgrund"
    >
      <MoatReviewPanel analysis={personal} />
      <CurrentCapabilities check={check} print={print} />
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
      {expertReview && (
        <AttackContainer
          aria-label="Drei mögliche Angreifer"
          className="expert-attacks print-block"
          open={(agent && print) || undefined}
        >
          {agent ? (
            <summary>Drei mögliche Angreifer</summary>
          ) : (
            <h2>Drei mögliche Angreifer</h2>
          )}
          <div className="expert-attack-grid">
            {EXPERT_ATTACKS.map(({ id, title }) => (
              <section key={id}>
                <h3>{title}</h3>
                <p>{expertReview[id].detail}</p>
              </section>
            ))}
          </div>
        </AttackContainer>
      )}
      <AgentRoleFinding check={check} print={print} />
      {expert && (
        <details
          className="expert-conditions print-block"
          open={print || undefined}
        >
          <summary>Zugang und wirtschaftlicher Anreiz</summary>
          <h3>Was die Angreifer brauchen</h3>
          <p>{expertReview?.access.detail ?? r.access}</p>
          <h3>Warum sich der Angriff lohnen könnte</h3>
          <p>{expertReview?.incentive.detail ?? r.incentive}</p>
        </details>
      )}
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
                <span>
                  {quoteSource(personal, finding)}: „{finding.basisQuote}“
                </span>
              )}
              {finding.questions.length > 0 && (
                <span>Ihre Antworten: {finding.questions.join(", ")}</span>
              )}
            </p>
          ))}
          {moatReview && (
            <p>
              <strong>Ihr genannter Vorteil</strong>
              <span>
                {moatReview.basisQuote
                  ? `Ihr Vorteil: „${moatReview.basisQuote}“`
                  : "Grundlage: Ihre Beschreibung des Vorteils."}
              </span>
            </p>
          )}
          <p>Eigener KI-Nutzen: {personal.result.opportunity.detail}</p>
          {personal.result.openQuestions.map((question, i) => (
            <p key={i}>Offen: {question}</p>
          ))}
          <p>
            {agent
              ? "KI-Einschätzung aus Ihren Angaben und den verlinkten Anbieterquellen. Geschäftliche Schutzbehauptungen sind nicht unabhängig bestätigt. Beanstandete Antworten öffnen die Score-Spanne."
              : "KI-Einschätzung aus Ihren Angaben. Keine externe Prüfung. Der Score wird aus den Antworten berechnet."}
          </p>
        </details>
      )}
    </section>
  );
}
