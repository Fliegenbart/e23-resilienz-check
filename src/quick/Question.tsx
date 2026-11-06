import { useEffect, useRef } from "react";
import type { QuickCheck, QuickAnswer } from "./model";
import { QUICK_QUESTIONS, QUICK_GROUPS } from "./model";
import { Arrow } from "./ui";
export function Question({
  check,
  onAnswer,
  onStep,
  onFinish,
}: {
  check: QuickCheck;
  onAnswer: (value: QuickAnswer) => void;
  onStep: (step: number) => void;
  onFinish: () => void;
}) {
  const q = QUICK_QUESTIONS[check.step],
    value = check.answers[q.id],
    heading = useRef<HTMLHeadingElement>(null);
  const group = QUICK_GROUPS.find((g) => g.id === q.group)!;
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [q.id]);
  return (
    <main className="question-page" aria-label="Check bearbeiten">
      <div
        className="progress-track"
        aria-label={`Frage ${check.step + 1} von 12`}
      >
        <span style={{ width: `${((check.step + 1) / 12) * 100}%` }} />
      </div>
      <div className="question-meta">
        <span>
          {String(check.step + 1).padStart(2, "0")}{" "}
          <span className="muted">/ 12</span>
        </span>
        <span>{group.title}</span>
      </div>
      <div className="question-stage" key={q.id}>
        <h1 ref={heading} tabIndex={-1}>
          {q.text}
        </h1>
        <p className="question-help">{q.help}</p>
        <fieldset className="scale" aria-labelledby="scale-label">
          <legend id="scale-label" className="sr-only">
            Ihre Einschätzung: 1 bedeutet niedriges Risiko, 10 hohes Risiko
          </legend>
          <div className="scale-points">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <label
                className={`scale-point ${value === n ? "chosen" : ""}`}
                key={n}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={n}
                  checked={value === n}
                  readOnly
                  onClick={(event) => {
                    if (event.detail < 2) onAnswer(n);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === " " || event.key === "Enter") {
                      event.preventDefault();
                      onAnswer(n);
                    }
                  }}
                  aria-label={String(n)}
                />
                <span>{n}</span>
              </label>
            ))}
          </div>
          <div className="scale-anchors">
            <span>
              <b>1</b> {q.low}
            </span>
            <span>
              <b>10</b> {q.high}
            </span>
          </div>
        </fieldset>
        <p className="selection-feedback" aria-live="polite">
          {typeof value === "number" ? (
            <>
              <strong>{value} von 10</strong>
              <span>
                {" "}
                ·{" "}
                {value <= 3
                  ? "Geringes Risikosignal"
                  : value <= 6
                    ? "Mittleres Risikosignal"
                    : "Deutliches Risikosignal"}
              </span>
            </>
          ) : value === "unknown" ? (
            "Als offene Einschätzung markiert."
          ) : (
            "Ein Klick wählt Ihre Antwort und führt direkt weiter."
          )}
        </p>
      </div>
      <div className="question-actions">
        <button
          className="text-link back"
          onClick={() => onStep(Math.max(0, check.step - 1))}
          disabled={check.step === 0}
        >
          <Arrow direction="left" />
          Zurück
        </button>
        <button
          className={`unknown-choice ${value === "unknown" ? "selected" : ""}`}
          onClick={() => onAnswer("unknown")}
        >
          Weiß ich noch nicht
        </button>
        <button
          className="button primary"
          disabled={value === null}
          onClick={() =>
            check.step === 11 ? onFinish() : onStep(check.step + 1)
          }
        >
          {check.step === 11 ? "Ergebnis ansehen" : "Weiter"}
          <Arrow />
        </button>
      </div>
      <nav className="section-nav" aria-label="Bereiche des Checks">
        {QUICK_GROUPS.map((g, i) => (
          <button
            key={g.id}
            onClick={() => onStep(i * 3)}
            aria-current={q.group === g.id ? "step" : undefined}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {g.short}
          </button>
        ))}
      </nav>
    </main>
  );
}
