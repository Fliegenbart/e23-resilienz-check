import { useEffect, useRef, useState } from "react";
import { answerScenario, scenarioLabels } from "./scenario-model";
import type {
  ScenarioWorkspace,
  ScenarioRun,
  ScenarioAnswer,
} from "./scenario-model";
import { Arrow } from "./ui";
export type ScenarioUpdate = (fn: (w: ScenarioWorkspace) => void) => void;
export function ScenarioInterview({
  workspace,
  run,
  onChange,
}: {
  workspace: ScenarioWorkspace;
  run: ScenarioRun;
  onChange: ScenarioUpdate;
}) {
  const q = workspace.methodSnapshot.questions[run.step],
    value = run.answers[q.id];
  const preset = workspace.methodSnapshot.catalog.find(
    (s) => s.id === run.presetId,
  )!;
  const labels = scenarioLabels(preset),
    heading = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [confirming, setConfirming] = useState(false);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    return () => {
      if (timer.current !== null) clearTimeout(timer.current);
    };
  }, []);
  const choose = (v: Exclude<ScenarioAnswer, null>) => {
    if (timer.current !== null) return;
    onChange((w) => {
      const r = w.runs.find((r) => r.id === run.id)!;
      answerScenario(r, q.id, v);
    });
    setConfirming(true);
    timer.current = setTimeout(() => {
      onChange((w) => {
        const r = w.runs.find((r) => r.id === run.id)!;
        if (r.step === 4) {
          r.completed = true;
          w.view = "comparison";
        } else r.step += 1;
      });
      window.scrollTo(0, 0);
    }, 450);
  };
  const back = () => {
    onChange((w) => {
      const r = w.runs.find((r) => r.id === run.id)!;
      if (r.step === 0) w.view = "scene";
      else r.step -= 1;
    });
    window.scrollTo(0, 0);
  };
  return (
    <main className="question-page scenario-question-page">
      <div className="scenario-question-context">
        <span>{preset.title}</span>
        <span>{run.context.horizon} Monate Anpassungszeit</span>
      </div>
      <div className="scenario-badges">
        <span>{labels.cost}</span>
        <span>{labels.intelligence}</span>
        <span>{labels.robots}</span>
      </div>
      <div
        className="progress-track"
        aria-label={`Szenariofrage ${run.step + 1} von 5`}
      >
        <span style={{ width: `${(run.step + 1) * 20}%` }} />
      </div>
      <div className="question-meta">
        <span>{String(run.step + 1).padStart(2, "0")} / 05</span>
        <span>
          {q.id === "opportunity"
            ? "Chance · separat bewertet"
            : "Risiko unter diesen Annahmen"}
        </span>
      </div>
      <div
        className={`question-stage${confirming ? " is-confirming" : ""}`}
        style={confirming ? { animationDuration: "450ms" } : undefined}
      >
        <h1 ref={heading} tabIndex={-1}>
          {q.id === "adapt"
            ? `Wie groß ist das Risiko, Ihr Angebot innerhalb von ${run.context.horizon} Monaten nicht anpassen zu können?`
            : q.text}
        </h1>
        <p className="question-help">
          {q.id === "opportunity"
            ? "Hier bedeutet ein hoher Wert eine große eigene Chance. Dieser Wert wird nicht vom Risiko abgezogen."
            : "Bewerten Sie die Wirkung auf Ihr konkretes Angebot, wenn die oben genannten Bedingungen eintreten."}
        </p>
        <fieldset className="scale" disabled={confirming}>
          <legend className="sr-only">
            {q.id === "opportunity"
              ? "Eigene Chance von 1 bis 10"
              : "Szenariorisiko von 1 bis 10"}
          </legend>
          <div className="scale-points">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <label
                className={`scale-point${value === n ? " chosen" : ""}`}
                key={n}
              >
                <input
                  type="radio"
                  name={`scenario-${q.id}`}
                  checked={value === n}
                  readOnly
                  aria-label={String(n)}
                  onClick={(e) => {
                    if (e.detail < 2) choose(n);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      choose(n);
                    }
                  }}
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
              <strong>{value} von 10</strong> ·{" "}
              {q.id === "opportunity" ? "Eigene Chance" : "Risikosignal"}
            </>
          ) : value === "unknown" ? (
            "Als offene Einschätzung markiert."
          ) : (
            "Auswählen, kurz bestätigen, automatisch weiter."
          )}
        </p>
      </div>
      <div className="question-actions">
        <button className="text-link back" disabled={confirming} onClick={back}>
          <Arrow direction="left" />
          Zurück
        </button>
        <button
          className={`unknown-choice${value === "unknown" ? " selected" : ""}`}
          disabled={confirming}
          onClick={(e) => {
            if (e.detail < 2) choose("unknown");
          }}
        >
          Weiß ich noch nicht
        </button>
      </div>
      <details className="scenario-assumption-reminder">
        <summary>Annahmen nochmals ansehen</summary>
        <p>{preset.story}</p>
        <p>
          Das Zeitfenster von {run.context.horizon} Monaten ist eine
          Stresstest-Annahme, keine Vorhersage.
        </p>
      </details>
    </main>
  );
}
