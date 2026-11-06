import { useEffect, useState } from "react";
import type { QuickCheck } from "./model";
import { calculateRisk, riskLabel, QUICK_QUESTIONS } from "./model";
import { Arrow, useReducedMotion } from "./ui";
function Count({ value }: { value: number }) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(reduced ? value : 0);
  useEffect(() => {
    if (reduced) {
      setShown(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 750);
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    setShown(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduced]);
  return (
    <>
      <span
        aria-hidden="true"
        className="screen-number"
        data-testid="score-value"
      >
        {shown}
      </span>
      <span className="sr-only">{value} von 100</span>
      <span className="print-number" aria-hidden="true">
        {value}
      </span>
    </>
  );
}
export function Results({
  check,
  onEdit,
  onMethod,
  onPrint,
  onExport,
}: {
  check: QuickCheck;
  onEdit: (step: number) => void;
  onMethod: () => void;
  onPrint: () => void;
  onExport: () => void;
}) {
  const r = calculateRisk(check);
  const [answersOpen, setAnswersOpen] = useState(false);
  const strongest = [...r.groups]
    .filter((g) => g.score !== null)
    .sort((a, b) => b.score! - a.score!)
    .slice(0, 2);
  return (
    <main className="results-page">
      <section className="result-overview">
        <div className="score-panel">
          <h1>Ihr KI-Risikoprofil</h1>
          {check.isExample && (
            <p className="example-label">Fiktives Beispiel</p>
          )}
          {r.score !== null ? (
            <>
              <div className="big-score">
                <Count value={r.score} />
                <span className="score-unit" aria-hidden="true">
                  / 100
                </span>
              </div>
              <p className="risk-grade">
                <span
                  className={`grade-mark band-${Math.floor(Math.min(99, r.score) / 25)}`}
                />
                {riskLabel(r.score)}
              </p>
              <p className="score-explanation">
                {r.score < 25
                  ? "Ihre Angaben zeigen derzeit wenig Druck. Sichern Sie Ihre Stärken und prüfen Sie Veränderungen regelmäßig."
                  : `Besonders relevant sind ${strongest.map((g) => g.title).join(" und ")}.`}
              </p>
              <div
                className="risk-track"
                aria-label={`${r.score} von 100 Risikopunkten`}
              >
                <span>Niedrig</span>
                <div>
                  <i style={{ left: `${r.score}%` }} />
                  <b style={{ width: `${r.score}%` }} />
                </div>
                <span>Hoch</span>
              </div>
            </>
          ) : (
            <>
              <div className="open-score">
                Noch offen<span>{r.answered} von 12 eingeschätzt</span>
              </div>
              <p className="score-explanation">
                {12 - r.answered}{" "}
                {12 - r.answered === 1
                  ? "Einschätzung fehlt"
                  : "Einschätzungen fehlen"}{" "}
                für Ihren Gesamtscore. Offene Antworten zählen nicht als
                niedriges Risiko.
              </p>
              <button
                className="button primary"
                onClick={() => onEdit(QUICK_QUESTIONS.indexOf(r.unknown[0]))}
              >
                Offene Fragen beantworten
                <Arrow />
              </button>
            </>
          )}
          {r.critical.length > 0 && (
            <div className="critical-note">
              <strong>
                {r.critical.length}{" "}
                {r.critical.length === 1
                  ? "kritischer Einzelwert"
                  : "kritische Einzelwerte"}
              </strong>
              <span>
                Diese Punkte bleiben unabhängig vom Durchschnitt relevant.
              </span>
              <button
                className="text-link"
                onClick={() =>
                  onEdit(
                    QUICK_QUESTIONS.findIndex((q) => q.id === r.critical[0].id),
                  )
                }
              >
                Ansehen
                <Arrow />
              </button>
            </div>
          )}
        </div>
        <div className="areas-panel">
          <h2>Die vier Bereiche</h2>
          <p className="area-note">Risiko je Bereich · 0 gering, 100 hoch</p>
          <div className="area-list">
            {r.groups.map((g, i) => (
              <button
                className="area-row"
                key={g.id}
                onClick={() => onEdit(i * 3)}
                aria-label={`${g.title}: ${g.score === null ? "noch offen" : `${g.score} von 100`}, Antworten ansehen`}
              >
                <strong>{g.title}</strong>
                <span className="area-bar">
                  <span
                    style={{
                      width: g.score === null ? "0%" : `${g.score}%`,
                      animationDelay: `${i * 90}ms`,
                    }}
                  />
                </span>
                <span className="area-value">
                  {g.score === null ? <small>{g.answered}/3</small> : g.score}
                </span>
              </button>
            ))}
          </div>
          <div className="area-caption">
            <span className="tiny-rule" />
            Ihre Einschätzung zeigt, wo Sie genauer hinsehen sollten.
          </div>
        </div>
      </section>
      <section className="priorities">
        <div className="priorities-title">
          <h2>
            {r.priorities.length
              ? "Ihre nächsten Schritte"
              : r.score === null
                ? "Ihre offenen Grundlagen"
                : "Ihre Stärken erhalten"}
          </h2>
          <p>
            {r.priorities.some((q) => q.value >= 7)
              ? "Drei Ansatzpunkte mit dem größten Handlungsbedarf."
              : r.priorities.length
                ? "Gezielte Verbesserungen aus Ihren Antworten."
                : r.score === null
                  ? "Klären Sie fehlende Einschätzungen, bevor Sie ein Gesamturteil ableiten."
                  : "Bleiben Sie aufmerksam, auch wenn Ihr aktuelles Risikoprofil niedrig ausfällt."}
          </p>
        </div>
        {r.priorities.length
          ? r.priorities.map((q, i) => (
              <button
                className="priority-row"
                key={q.id}
                onClick={() =>
                  onEdit(QUICK_QUESTIONS.findIndex((x) => x.id === q.id))
                }
              >
                <span className="priority-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <strong>{q.action}</strong>
                <span className="priority-description">{q.actionDetail}</span>
                <Arrow />
              </button>
            ))
          : (r.score === null
              ? r.unknown.slice(0, 3).map((q, i) => ({
                  title: q.text,
                  text: "Diese Einschätzung ist noch offen.",
                  step: QUICK_QUESTIONS.indexOf(q),
                  i,
                }))
              : [
                  {
                    title: "Kundenbedarf regelmäßig überprüfen",
                    text: "Bleiben Sie mit Käufern im Gespräch und verfolgen Sie Veränderungen.",
                    step: 0,
                    i: 0,
                  },
                  {
                    title: "Die beste Alternative beobachten",
                    text: "Vergleichen Sie Ihr Angebot regelmäßig mit dem, was Kunden selbst einsetzen können.",
                    step: 3,
                    i: 1,
                  },
                  {
                    title: "Anpassungsfähigkeit erhalten",
                    text: "Halten Sie Ihre Ausweichmöglichkeiten und Qualitätsprüfungen aktuell.",
                    step: 9,
                    i: 2,
                  },
                ]
            ).map((q) => (
              <button
                className="priority-row"
                key={q.title}
                onClick={() => onEdit(q.step)}
              >
                <span className="priority-number">
                  {String(q.i + 1).padStart(2, "0")}
                </span>
                <strong>{q.title}</strong>
                <span className="priority-description">{q.text}</span>
                <Arrow />
              </button>
            ))}
        <div className="result-footer">
          <div>
            <p>
              Einschätzung auf Basis Ihrer Antworten · {r.answered} von 12
              beantwortet
            </p>
            <button className="text-link" onClick={onMethod}>
              So wird der Score berechnet
            </button>
          </div>
          <div className="result-buttons">
            <button className="text-link export-inline" onClick={onExport}>
              JSON sichern
            </button>
            <button
              className="button secondary"
              onClick={() => setAnswersOpen((v) => !v)}
              aria-expanded={answersOpen}
            >
              Antworten {answersOpen ? "schließen" : "ansehen"}
            </button>
            <button className="button dark" onClick={onPrint}>
              Ergebnis als PDF
              <Arrow />
            </button>
          </div>
        </div>
      </section>
      {answersOpen && (
        <section className="answer-summary">
          <h2>Ihre zwölf Einschätzungen</h2>
          {QUICK_QUESTIONS.map((q, i) => (
            <button
              className="answer-summary-row"
              key={q.id}
              onClick={() => onEdit(i)}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              <strong>{q.text}</strong>
              <span>
                {typeof check.answers[q.id] === "number"
                  ? `${check.answers[q.id]} / 10`
                  : "Noch offen"}
              </span>
              <Arrow />
            </button>
          ))}
        </section>
      )}
    </main>
  );
}
