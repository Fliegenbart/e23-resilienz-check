import type { QuickCheck } from "./model";
import { currentBusinessAnalysis } from "./business-analysis";

export function CurrentCapabilities({
  check,
  print = false,
}: {
  check: QuickCheck;
  print?: boolean;
}) {
  if (check.methodologyVersion !== "quick-check-7.0") return null;
  const analysis = currentBusinessAnalysis(check);
  const research = analysis?.research;
  const claims =
    analysis && "currentCapabilities" in analysis.result
      ? analysis.result.currentCapabilities
      : [];
  return (
    <section
      className="current-capabilities print-block"
      aria-label="Heute schon möglich"
    >
      <h2>Heute schon möglich</h2>
      {claims.length ? (
        claims.map((claim, i) => (
          <div key={i} className="capability-finding">
            <p>
              <strong>{claim.product}: </strong>
              {claim.detail}
            </p>
            <p className="capability-limit">{claim.limitation}</p>
            <p className="capability-links">
              {[
                ...new Set(claim.evidence.map((evidence) => evidence.sourceId)),
              ].map((sourceId) => {
                const source = research?.sources.find((s) => s.id === sourceId);
                return source ? (
                  <a
                    key={sourceId}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source.title}
                  </a>
                ) : null;
              })}
            </p>
          </div>
        ))
      ) : (
        <p>
          {!analysis
            ? "Der Quellenabgleich startet mit der KI-Auswertung."
            : research?.status === "unavailable"
              ? "Anbieterquellen waren nicht abrufbar. Heutige Fähigkeiten bleiben ungeprüft."
              : "Kein passender aktueller Fähigkeitsbeleg gefunden."}
        </p>
      )}
      {research && (
        <details open={print || undefined} className="capability-sources">
          <summary>Quellen und Stand</summary>
          <p>
            Quellenabruf:{" "}
            {new Intl.DateTimeFormat("de-DE", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "Europe/Berlin",
            }).format(new Date(research.retrievedAt))}
            . Anbieterangaben; kein eigener Leistungstest.
          </p>
          {research.sources.map((source) => (
            <p key={source.id}>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.title}
              </a>
            </p>
          ))}
        </details>
      )}
    </section>
  );
}

const ROLE_TITLES = {
  replaceable: "Ihr Dienst wäre leicht austauschbar.",
  paid_supplier: "Ihr Dienst könnte hinter Agenten weiterverdienen.",
  dependent_supplier:
    "Ihr Dienst könnte bleiben. Der Vermittler gewinnt Macht.",
  unclear: "Ihre Rolle hinter Agenten ist noch offen.",
};

export function AgentRoleFinding({
  check,
  print = false,
}: {
  check: QuickCheck;
  print?: boolean;
}) {
  const analysis = currentBusinessAnalysis(check);
  if (!analysis || !("agentRole" in analysis.result)) return null;
  const role = analysis.result.agentRole;
  const access = check.answers.Q11;
  const readiness = check.answers.Q3;
  return (
    <section
      className="agent-role print-block"
      aria-label="Ihre Rolle hinter der KI"
    >
      <h2>Ihre Rolle hinter der KI</h2>
      <h3>{ROLE_TITLES[role.role]}</h3>
      <p>{role.contribution}</p>
      <p>
        <strong>Warum Ihr Dienst? </strong>
        {role.selectionReason}
      </p>
      <p>
        <strong>Abhängigkeit: </strong>
        {role.dependency}
      </p>
      <details open={print || undefined}>
        <summary>Nutzbarkeit und Kundenzugang</summary>
        <p>
          Agenten können Ihren Dienst{" "}
          {typeof readiness !== "number"
            ? "laut Angaben noch nicht nachweislich direkt nutzen und bezahlen."
            : readiness >= 7
              ? "laut Angaben bereits direkt nutzen und bezahlen."
              : readiness >= 4
                ? "laut Angaben teilweise direkt nutzen. Freigabe und Bezahlung sind noch zu prüfen."
                : "laut Angaben noch nicht direkt nutzen und bezahlen."}
        </p>
        <p>
          {typeof access !== "number"
            ? "Wer den Kundenzugang kontrolliert, ist offen."
            : access >= 7
              ? "Ihr Kundenzugang hängt laut Angaben stark an einer Plattform."
              : access >= 4
                ? "Die Kontrolle über den Kundenzugang ist laut Angaben geteilt."
                : "Sie kontrollieren den Kundenzugang laut Angaben weitgehend selbst."}
        </p>
        <p>
          Ein Agent kann für Ihren Kunden handeln. Eine Anbindung garantiert
          weder Auswahl noch Umsatz.
        </p>
      </details>
    </section>
  );
}
