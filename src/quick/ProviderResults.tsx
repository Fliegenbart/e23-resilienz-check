import { useState, type ReactNode } from "react";
import type { QuickCheck } from "./model";
import {
  evaluateProvider,
  ROUTE_LABELS,
  PROTECTION_LABELS,
  BENEFIT_LABELS,
} from "./provider-analysis";
import { isProviderV5, supportsBusinessAnalysis } from "./provider-questions";
import {
  ProviderRiskScore,
  ProviderPurchaseFindings,
} from "./ProviderRiskSummary";
import { Arrow } from "./ui";
import { ProviderScenario } from "./ProviderScenario";
import type { ProviderScenarioSettings } from "./provider-scenario";
import { BusinessDescription } from "./BusinessDescription";
import { BusinessMoat } from "./BusinessMoat";
import {
  BusinessAnalysisControl,
  BusinessAnalysisFindings,
} from "./BusinessAnalysis";
import {
  currentBusinessAnalysis,
  moatDisputesScore,
  type BusinessAnalysis,
} from "./business-analysis";

function AnswerBasis({
  check,
  ids,
  print,
}: {
  check: QuickCheck;
  ids: string[];
  print: boolean;
}) {
  if (print)
    return (
      <p className="provider-basis">
        Grundlage:{" "}
        {ids
          .map(
            (id) =>
              `${id}: ${typeof check.answers[id] === "number" ? `${check.answers[id]}/10` : "offen"}`,
          )
          .join(" · ")}
      </p>
    );
  return (
    <ul className="provider-basis-list">
      {ids.map((id) => {
        const q = check.methodologySnapshot.find((q) => q.id === id)!;
        return (
          <li key={id}>
            <strong>
              {typeof check.answers[id] === "number"
                ? `${check.answers[id]}/10`
                : "Offen"}
            </strong>
            <span>
              {q.text}
              <small>
                1: {q.low} · 10: {q.high}
              </small>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function Finding({
  title,
  status,
  tone,
  print,
  children,
}: {
  title: string;
  status: string;
  tone: string;
  print: boolean;
  children: ReactNode;
}) {
  return (
    <details className="provider-finding print-block" open={print || undefined}>
      <summary>
        <span className="provider-finding-title">{title}</span>
        <span className={`provider-status ${tone}`}>{status}</span>
        <span className="provider-toggle" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="provider-finding-detail">{children}</div>
    </details>
  );
}

export function ProviderFindings({
  check,
  print = false,
}: {
  check: QuickCheck;
  print?: boolean;
}) {
  const r = evaluateProvider(check);
  return (
    <>
      <div className="provider-findings-grid">
        <div>
          <section className="provider-section">
            <h2>Was KI übernehmen könnte</h2>
            {r.routes.map((route) => (
              <Finding
                key={route.id}
                title={route.title}
                status={ROUTE_LABELS[route.level]}
                tone={`route-${route.level}`}
                print={print}
              >
                <p>{route.description}</p>
                <AnswerBasis
                  check={check}
                  ids={route.questionIds}
                  print={print}
                />
              </Finding>
            ))}
          </section>
          {r.benefit && (
            <section className="provider-section provider-benefit">
              <h2>Was Sie gewinnen können</h2>
              <Finding
                title={r.benefit.title}
                status={BENEFIT_LABELS[r.benefit.level]}
                tone={`benefit-${r.benefit.level}`}
                print={print}
              >
                <p>{r.benefit.description}</p>
                <p>
                  <strong>Prüfen:</strong> {r.benefit.test}
                </p>
                <AnswerBasis
                  check={check}
                  ids={[r.benefit.questionId]}
                  print={print}
                />
              </Finding>
            </section>
          )}
        </div>
        <section className="provider-section">
          <h2>Was Sie schützen kann</h2>
          {r.protections.map((p) => (
            <Finding
              key={p.id}
              title={p.title}
              status={PROTECTION_LABELS[p.level]}
              tone={`protection-${p.level}`}
              print={print}
            >
              <p>
                {p.level === "strong"
                  ? p.detail
                  : p.level === "limited"
                    ? "Dieser Vorteil ist nur teilweise vorhanden."
                    : p.level === "weak"
                      ? "Ihre Antworten zeigen hier wenig Schutz."
                      : "Hier fehlt noch Ihre Einschätzung."}
              </p>
              {(p.level === "strong" || p.level === "limited") && (
                <p>
                  <strong>Prüfen:</strong> {p.test}
                </p>
              )}
              <AnswerBasis check={check} ids={[p.questionId]} print={print} />
            </Finding>
          ))}
          <details
            className="provider-evidence print-block"
            open={print || undefined}
          >
            <summary>
              Belege
              <span className="provider-toggle" aria-hidden="true">
                +
              </span>
            </summary>
            <p>{r.evidenceText}</p>
            <div>
              {!supportsBusinessAnalysis(check.methodologyVersion) && (
                <span>
                  Vergleich{" "}
                  <strong>
                    {typeof check.answers.Q11 === "number"
                      ? `${check.answers.Q11}/10`
                      : "offen"}
                  </strong>
                </span>
              )}
              <span>
                {supportsBusinessAnalysis(check.methodologyVersion)
                  ? "Kauf nach KI-Vergleich"
                  : "Kaufentscheidung"}{" "}
                <strong>
                  {typeof check.answers.Q12 === "number"
                    ? `${check.answers.Q12}/10`
                    : "offen"}
                </strong>
              </span>
            </div>
          </details>
        </section>
      </div>
      <section className="provider-section provider-next-steps">
        <h2>Was Sie jetzt tun können</h2>
        <ol className="provider-actions">
          {r.actions.map((action) => (
            <li className="print-block" key={action.id}>
              <details open={print || undefined}>
                <summary>
                  {action.title}
                  <span className="provider-toggle" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{action.detail}</p>
              </details>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

export function ProviderResults({
  check,
  onEdit,
  onMethod,
  onPrint,
  onExport,
  onScenarioChange,
  onDescriptionChange,
  onMoatChange,
  onAnalysisChange,
}: {
  check: QuickCheck;
  onEdit: (step: number) => void;
  onMethod: () => void;
  onPrint: () => void;
  onExport: () => void;
  onScenarioChange: (settings: ProviderScenarioSettings) => void;
  onDescriptionChange: (text: string) => void;
  onMoatChange?: (text: string) => void;
  onAnalysisChange: (analysis: BusinessAnalysis) => void;
}) {
  const r = evaluateProvider(check);
  const personal = currentBusinessAnalysis(check);
  const current = isProviderV5(check.methodologyVersion);
  const [answersOpen, setAnswersOpen] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  return (
    <main className="results-page provider-results">
      <header className="provider-result-intro">
        <p className="section-index">
          Ihr Ergebnis · {r.answered}/12 beantwortet
          {check.isExample ? " · Beispiel" : ""}
        </p>
        {current && <ProviderRiskScore check={check} />}
        <h1>
          {current
            ? moatDisputesScore(personal, r.risk?.score ?? null)
              ? "Die KI hält Ihren Vorteil für ersetzbar."
              : r.headline
            : (personal?.result.headline ?? r.headline)}
        </h1>
        {!current && (
          <p className="provider-result-summary">
            {personal?.result.summary ?? r.summary}
          </p>
        )}
        {!current && (
          <p className="provider-context">
            {personal
              ? "KI-Auswertung aus Ihrer Beschreibung und Ihren Antworten."
              : "Auswertung Ihrer zwölf Antworten."}
          </p>
        )}
        {(current
          ? (r.risk?.missing.length ?? 0) > 0
          : r.unknown.length > 0) && (
          <button
            className="button secondary"
            onClick={() =>
              onEdit(
                current
                  ? check.methodologySnapshot.findIndex(
                      (q) => q.id === r.risk!.missing[0],
                    )
                  : check.methodologySnapshot.indexOf(r.unknown[0]),
              )
            }
          >
            {current ? r.risk!.missing.length : r.unknown.length} offene{" "}
            {(current ? r.risk!.missing.length : r.unknown.length) === 1
              ? "Frage klären"
              : "Fragen klären"}
            <Arrow />
          </button>
        )}
      </header>
      <section className="provider-business-context">
        <button
          type="button"
          aria-expanded={descriptionOpen}
          aria-controls="provider-business-editor"
          onClick={() => setDescriptionOpen((open) => !open)}
        >
          {current
            ? check.businessDescription || check.businessMoat
              ? "Business und Vorteil"
              : "Business und Vorteil ergänzen"
            : check.businessDescription
              ? "Ihr Business"
              : "Business beschreiben"}
          <span aria-hidden="true">{descriptionOpen ? "−" : "+"}</span>
        </button>
        {descriptionOpen && (
          <div id="provider-business-editor">
            <BusinessDescription
              value={check.businessDescription ?? ""}
              onChange={onDescriptionChange}
            />
            {current && (
              <BusinessMoat
                value={check.businessMoat ?? ""}
                onChange={(text) => onMoatChange?.(text)}
              />
            )}
          </div>
        )}
      </section>
      {supportsBusinessAnalysis(check.methodologyVersion) && (
        <BusinessAnalysisControl check={check} onComplete={onAnalysisChange} />
      )}
      {current && <ProviderPurchaseFindings check={check} />}
      <ProviderScenario check={check} onChange={onScenarioChange} />
      {current ? (
        <details className="business-analysis-overview">
          <summary>Risiko und Kaufgrund im Detail</summary>
          {r.contradictions?.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
          <ProviderFindings check={check} />
        </details>
      ) : personal ? (
        <>
          <BusinessAnalysisFindings analysis={personal} />
          <details className="business-analysis-overview">
            <summary>Die zwölf Antworten im Überblick</summary>
            <ProviderFindings check={check} />
          </details>
        </>
      ) : (
        <ProviderFindings check={check} />
      )}
      <footer className="provider-result-tools">
        <button className="button primary" onClick={onPrint}>
          Ergebnis als PDF <Arrow />
        </button>
        <button
          className="text-link"
          aria-expanded={answersOpen}
          aria-controls="provider-answer-list"
          onClick={() => setAnswersOpen((v) => !v)}
        >
          Antworten {answersOpen ? "ausblenden" : "ändern"}
        </button>
        <button className="text-link" onClick={onMethod}>
          Annahmen und Quellen
        </button>
        <button className="text-link" onClick={onExport}>
          JSON sichern
        </button>
      </footer>
      {answersOpen && (
        <section
          className="provider-answer-list"
          id="provider-answer-list"
          aria-label="Antworten bearbeiten"
        >
          {check.methodologySnapshot.map((q, i) => (
            <button key={q.id} onClick={() => onEdit(i)}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <strong>{q.text}</strong>
              <span>
                {typeof check.answers[q.id] === "number"
                  ? `${check.answers[q.id]}/10`
                  : "Offen"}
              </span>
              <Arrow />
            </button>
          ))}
        </section>
      )}
    </main>
  );
}
