import { useEffect, useRef, useState } from "react";
import type { QuickCheck, QuickAnswer } from "./model";
import { groupsForCheck } from "./model";
import {
  isProviderMethod,
  isExpertMethod,
  providerPremise,
  PROVIDER_BOUNDARIES,
} from "./provider-questions";
import { EXPERT_PREMISE, EXPERT_BOUNDARIES } from "./expert-team";
import { isStressMethod } from "./stress";
import { Arrow } from "./ui";
const CONFIRM_DELAY_MS = 450;
export function Question({
  check,
  onAnswer,
  onAdvance,
  onStep,
}: {
  check: QuickCheck;
  onAnswer: (value: QuickAnswer) => void;
  onAdvance: () => void;
  onStep: (step: number) => void;
}) {
  const q = check.methodologySnapshot[check.step],
    value = check.answers[q.id],
    heading = useRef<HTMLHeadingElement>(null);
  const groups = groupsForCheck(check);
  const group = groups.find((g) => g.id === q.group)!;
  const stress = isStressMethod(check.methodologyVersion);
  const provider = stress || isProviderMethod(check.methodologyVersion);
  const total = check.methodologySnapshot.length;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [confirming, setConfirming] = useState(false);
  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );
  const chooseAnswer = (answer: Exclude<QuickAnswer, null>) => {
    if (timer.current !== null) return;
    onAnswer(answer);
    setConfirming(true);
    timer.current = setTimeout(onAdvance, CONFIRM_DELAY_MS);
  };
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [q.id]);
  return (
    <main
      className={`question-page${provider ? " provider-question" : ""}`}
      aria-label="Check bearbeiten"
    >
      <div
        className="progress-track"
        aria-label={`Frage ${check.step + 1} von ${total}`}
      >
        <span style={{ width: `${((check.step + 1) / total) * 100}%` }} />
      </div>
      <div className="question-meta">
        <span>
          {String(check.step + 1).padStart(2, "0")}{" "}
          <span className="muted">/ {total}</span>
        </span>
        {!provider && <span>{group.title}</span>}
      </div>
      <div
        className={`question-stage${confirming ? " is-confirming" : ""}`}
        key={q.id}
        style={
          confirming
            ? { animationDuration: `${CONFIRM_DELAY_MS}ms` }
            : undefined
        }
      >
        <h1 ref={heading} tabIndex={-1}>
          {q.text}
        </h1>
        {isExpertMethod(check.methodologyVersion) && q.id === "Q10" && (
          <p className="question-help">Auch mit einer völlig anderen Lösung.</p>
        )}
        {!provider &&
          (q.example ? (
            <>
              <div className="scenario-question-guide">
                <div>
                  <h2>Was ist gemeint?</h2>
                  <p>{q.help}</p>
                </div>
                <div className="scenario-question-example">
                  <h2>Zum Beispiel</h2>
                  <p>{q.example}</p>
                </div>
              </div>
              <p className="expert-scale-direction">
                Je höher der Wert, desto größer die Lücke oder desto leichter
                der Angriff auf Ihr Angebot.
              </p>
            </>
          ) : (
            <p className="question-help">{q.help}</p>
          ))}
        {stress && <p className="question-help">{q.help}</p>}
        {q.options ? (
          <fieldset
            className="stress-options"
            aria-label="Ihre Antwort"
            disabled={confirming}
          >
            {q.options.map((option, i) => (
              <button
                key={option}
                type="button"
                className={`stress-option${value === i + 1 ? " chosen" : ""}`}
                aria-pressed={value === i + 1}
                onClick={(event) => {
                  if (event.detail < 2) chooseAnswer(i + 1);
                }}
              >
                {option}
              </button>
            ))}
          </fieldset>
        ) : (
          <fieldset
            className="scale"
            aria-labelledby="scale-label"
            disabled={confirming}
          >
            <legend id="scale-label" className="sr-only">
              {provider
                ? `Ihre Einschätzung: 1 – ${q.low}; 10 – ${q.high}`
                : "Ihre Einschätzung: 1 bedeutet niedriges Risiko, 10 hohes Risiko"}
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
                      if (event.detail < 2) chooseAnswer(n);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === " " || event.key === "Enter") {
                        event.preventDefault();
                        chooseAnswer(n);
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
        )}
        <p
          className={`selection-feedback${provider ? " sr-only" : ""}`}
          aria-live="polite"
        >
          {typeof value === "number" ? (
            <>
              <strong>
                {q.options ? q.options[value - 1] : `${value} von 10`}
              </strong>
              {!provider && (
                <span>
                  {" "}
                  ·{" "}
                  {value <= 3
                    ? "Geringes Risikosignal"
                    : value <= 6
                      ? "Mittleres Risikosignal"
                      : "Deutliches Risikosignal"}
                </span>
              )}
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
          disabled={check.step === 0 || confirming}
        >
          <Arrow direction="left" />
          Zurück
        </button>
        <button
          className={`unknown-choice ${value === "unknown" ? "selected" : ""}`}
          disabled={confirming}
          onClick={(event) => {
            if (event.detail < 2) chooseAnswer("unknown");
          }}
        >
          {provider ? "Weiß ich nicht" : "Weiß ich noch nicht"}
        </button>
      </div>
      {!provider && (
        <nav className="section-nav" aria-label="Bereiche des Checks">
          {groups.map((g, i) => (
            <button
              key={g.id}
              disabled={confirming}
              onClick={() => onStep(i * 3)}
              aria-current={q.group === g.id ? "step" : undefined}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {g.short}
            </button>
          ))}
        </nav>
      )}
      {provider && !stress && (
        <details className="provider-question-details">
          <summary>Details</summary>
          <p>{q.help}</p>
          {q.example && <p>{q.example}</p>}
          <p className="provider-question-assumption">
            {providerPremise(check.methodologyVersion)} {PROVIDER_BOUNDARIES}
          </p>
        </details>
      )}
      {check.methodologyVersion === "quick-check-2.0" && (
        <details className="expert-reminder">
          <summary>
            Das Expertenteam-Gedankenexperiment nochmals ansehen
          </summary>
          <p>{EXPERT_PREMISE}</p>
          <p>{EXPERT_BOUNDARIES}</p>
        </details>
      )}
    </main>
  );
}
