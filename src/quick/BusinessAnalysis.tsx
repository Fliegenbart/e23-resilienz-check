import { useEffect, useRef, useState } from "react";
import type { QuickCheck } from "./model";
import {
  analysisInputFor,
  analysisInputKey,
  currentBusinessAnalysis,
  requestBusinessAnalysis,
  quoteSource,
  type BusinessAnalysis,
  type BusinessFinding,
} from "./business-analysis";

export function BusinessAnalysisControl({
  check,
  onComplete,
}: {
  check: QuickCheck;
  onComplete: (analysis: BusinessAnalysis) => void;
}) {
  const input = analysisInputFor(check);
  const key = input ? analysisInputKey(input) : "";
  const currentKey = useRef(key);
  currentKey.current = key;
  const active = useRef<AbortController | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const fresh = currentBusinessAnalysis(check);
  useEffect(() => {
    active.current?.abort();
    active.current = null;
    setBusy(false);
    setMessage("");
    return () => {
      active.current?.abort();
      active.current = null;
    };
  }, [key]);

  const run = async () => {
    if (!input || active.current) return;
    const controller = new AbortController();
    active.current = controller;
    setMessage("");
    setBusy(true);
    const timeout = setTimeout(
      () => controller.abort(new DOMException("Timeout", "TimeoutError")),
      check.methodologyVersion === "quick-check-7.0" ? 105_000 : 55_000,
    );
    try {
      const analysis = await requestBusinessAnalysis(input, {
        signal: controller.signal,
      });
      if (
        active.current === controller &&
        currentKey.current === key &&
        !controller.signal.aborted
      )
        onComplete(analysis);
    } catch (error) {
      if (active.current === controller) {
        if (!controller.signal.aborted)
          setMessage(
            error instanceof Error
              ? error.message
              : "Die Auswertung hat nicht geklappt. Bitte erneut versuchen.",
          );
        else if (controller.signal.reason?.name === "TimeoutError")
          setMessage("Die Auswertung dauert zu lange. Bitte erneut versuchen.");
      }
    } finally {
      clearTimeout(timeout);
      if (active.current === controller) {
        active.current = null;
        setBusy(false);
      }
    }
  };
  if (!input)
    return check.businessAnalysis ? (
      <p className="business-analysis-status" role="status">
        Die KI-Auswertung ist nicht mehr aktuell. Bitte Ihre Angaben ergänzen.
      </p>
    ) : null;

  return (
    <section
      className="business-analysis-control"
      aria-label="Individuelle Auswertung"
    >
      {check.businessAnalysis && !fresh && (
        <p className="business-analysis-status">
          Ihre Angaben haben sich geändert. Bitte die KI-Auswertung
          aktualisieren.
        </p>
      )}
      <div className="business-analysis-buttons">
        <button
          className={fresh ? "text-link" : "button primary"}
          onClick={run}
          disabled={busy}
        >
          {busy
            ? "Wird ausgewertet …"
            : fresh
              ? "Neu auswerten"
              : check.businessAnalysis
                ? "Auswertung aktualisieren"
                : check.businessMoat?.trim()
                  ? "Mit KI prüfen"
                  : "Mein Business auswerten"}
        </button>
        {busy && (
          <button
            className="text-link"
            onClick={() => {
              active.current?.abort();
              active.current = null;
              setBusy(false);
            }}
          >
            Abbrechen
          </button>
        )}
      </div>
      <p className="business-analysis-disclosure">
        Auf Klick: Beschreibung, {check.businessMoat?.trim() ? "Vorteil, " : ""}
        Antworten und Szenario an OpenAI über Vercel senden.
        {check.methodologyVersion === "quick-check-7.0" &&
          " Öffentliche Sachthemen werden über Parallel recherchiert."}
      </p>
      <p className="business-analysis-status" role="status" aria-live="polite">
        {busy
          ? check.methodologyVersion === "quick-check-7.0"
            ? "Anbieterquellen und Ihr Geschäft werden geprüft …"
            : "Ihre konkrete Auswertung entsteht …"
          : message}
      </p>
    </section>
  );
}

export function BusinessAnalysisFindings({
  analysis,
  print = false,
}: {
  analysis: BusinessAnalysis;
  print?: boolean;
}) {
  const r = analysis.result;
  const sections = [
    { title: "Was KI übernehmen könnte", items: r.takeover },
    { title: "Was Sie schützen kann", items: r.protection },
    { title: "Wo Sie selbst profitieren", items: [r.opportunity] },
    { title: "Ihr nächster Schritt", items: [r.nextStep] },
  ];
  const findings: BusinessFinding[] = [
    ...r.takeover,
    ...r.protection,
    r.opportunity,
    r.nextStep,
  ];
  return (
    <section
      className="business-analysis-findings"
      aria-label="Konkrete Aussagen zu Ihrem Business"
    >
      <div className="business-analysis-grid">
        {sections.map((section) => (
          <section className="provider-section print-block" key={section.title}>
            <h2>{section.title}</h2>
            {section.items.map((finding, i) => (
              <div className="business-analysis-finding" key={i}>
                <h3>{finding.title}</h3>
                <p>{finding.detail}</p>
              </div>
            ))}
          </section>
        ))}
      </div>
      {r.openQuestions.length > 0 && (
        <section className="business-analysis-open print-block">
          <h2>Noch offen</h2>
          <ul>
            {r.openQuestions.map((question, i) => (
              <li key={i}>{question}</li>
            ))}
          </ul>
        </section>
      )}
      <details
        className="business-analysis-basis print-block"
        open={print || undefined}
      >
        <summary>Worauf diese Aussagen beruhen</summary>
        {findings.map((finding, i) => (
          <p key={i}>
            <strong>{finding.title}</strong>
            {finding.basisQuote !== null && (
              <span>
                {quoteSource(analysis, finding)}: „{finding.basisQuote}“
              </span>
            )}
            {finding.questions.length > 0 && (
              <span>Ihre Antworten: {finding.questions.join(", ")}</span>
            )}
          </p>
        ))}
        <p>KI-Einschätzung aus Ihren Angaben. Keine externe Prüfung.</p>
        <p>
          {analysis.model} ·{" "}
          {new Intl.DateTimeFormat("de-DE", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Europe/Berlin",
          }).format(new Date(analysis.createdAt))}
        </p>
      </details>
    </section>
  );
}
