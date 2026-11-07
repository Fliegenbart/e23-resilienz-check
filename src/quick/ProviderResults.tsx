import { useState, type ReactNode } from "react";
import type { QuickCheck } from "./model";
import {
  evaluateProvider,
  ROUTE_LABELS,
  PROTECTION_LABELS,
} from "./provider-analysis";
import { Arrow } from "./ui";
import { ProviderScenario } from "./ProviderScenario";
import type { ProviderScenarioSettings } from "./provider-scenario";

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
              <span>
                Vergleich{" "}
                <strong>
                  {typeof check.answers.Q11 === "number"
                    ? `${check.answers.Q11}/10`
                    : "offen"}
                </strong>
              </span>
              <span>
                Kaufentscheidung{" "}
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
}: {
  check: QuickCheck;
  onEdit: (step: number) => void;
  onMethod: () => void;
  onPrint: () => void;
  onExport: () => void;
  onScenarioChange: (settings: ProviderScenarioSettings) => void;
}) {
  const r = evaluateProvider(check);
  const [answersOpen, setAnswersOpen] = useState(false);
  return (
    <main className="results-page provider-results">
      <header className="provider-result-intro">
        <p className="section-index">
          Ihr Ergebnis · {r.answered}/12 beantwortet
          {check.isExample ? " · Beispiel" : ""}
        </p>
        <h1>{r.headline}</h1>
        <p className="provider-result-summary">{r.summary}</p>
        <p className="provider-context">Stresstest auf Basis Ihrer Angaben.</p>
        {r.unknown.length > 0 && (
          <button
            className="button secondary"
            onClick={() =>
              onEdit(check.methodologySnapshot.indexOf(r.unknown[0]))
            }
          >
            {r.unknown.length} offene{" "}
            {r.unknown.length === 1 ? "Frage klären" : "Fragen klären"}
            <Arrow />
          </button>
        )}
      </header>
      <ProviderScenario check={check} onChange={onScenarioChange} />
      <ProviderFindings check={check} />
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
