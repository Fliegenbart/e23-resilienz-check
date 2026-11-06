import { useState } from "react";
import type { EditorProps } from "./ui";
import { Check, Field, Multi, Reviewer, Section, Select, Sources } from "./ui";
import { METHOD, GROUPS } from "../methodology/config";
import {
  updateAnswer,
  reviewAnswer,
  resolveConflict,
  iso,
} from "../domain/model";
import type { Answer, QuestionId } from "../domain/types";
import { evidenceStatus } from "../rules/evaluate";
import { label } from "../import-export/report";
export function Questions({ a, change }: EditorProps) {
  const [group, setGroup] = useState<keyof typeof GROUPS>("A");
  const [selected, setSelected] = useState<QuestionId>("A1");
  const [reviewer, setReviewer] = useState("");
  const [resolution, setResolution] = useState("");
  const q = METHOD.questions.find((q) => q.id === selected)!;
  const ans = a.content.answers[q.id];
  const status = evidenceStatus(a, q.id, a.evaluationAsOf);
  const update = (p: Partial<Answer>) =>
    change((a) => updateAnswer(a, q.id, p));
  const questions = METHOD.questions.filter((q) => q.group === group);
  return (
    <>
      <h1>Prüfung</h1>
      <p className="intro">
        {GROUPS[group]}.{" "}
        {group === "B"
          ? "„Hoch“ bedeutet hier stärkere Exposition."
          : "„Hoch“ bedeutet hier stärkeren Kundenwert, Vorteil oder höhere Handlungsfähigkeit."}
      </p>
      <div className="tabs" aria-label="Fragenbereiche">
        {Object.entries(GROUPS).map(([g, text]) => (
          <button
            key={g}
            aria-pressed={g === group}
            className={g === group ? "active" : ""}
            onClick={() => {
              setGroup(g as any);
              setSelected(METHOD.questions.find((q) => q.group === g)!.id);
            }}
          >
            {g}{" "}
            {g === "A"
              ? "Kundenwert"
              : g === "B"
                ? "Ersetzbarkeit"
                : g === "C"
                  ? "Vorteile"
                  : "Handlungsfähigkeit"}
          </button>
        ))}
      </div>
      <div className="question-nav" aria-label="Fragen">
        {questions.map((q) => (
          <button
            key={q.id}
            className={selected === q.id ? "active" : ""}
            aria-label={`${q.id} ${q.text}`}
            aria-pressed={selected === q.id}
            onClick={() => setSelected(q.id)}
          >
            {q.id}
            <small>
              {label(
                a.content.answers[q.id].state === "rated"
                  ? a.content.answers[q.id].rating
                  : a.content.answers[q.id].state,
              )}
            </small>
          </button>
        ))}
      </div>
      <Section title={`${q.id} — ${q.text}`}>
        <fieldset className="anchors">
          <legend>Inhaltliche Einschätzung</legend>
          {(["low", "medium", "high"] as const).map((r) => (
            <label
              key={r}
              className={
                ans.state === "rated" && ans.rating === r ? "selected" : ""
              }
            >
              <input
                type="radio"
                name={`rating-${q.id}`}
                checked={ans.state === "rated" && ans.rating === r}
                onChange={() => update({ state: "rated", rating: r })}
              />
              <span>
                <strong>{label(r)}</strong> — {q.anchors[r]}
              </span>
            </label>
          ))}
        </fieldset>
        <div className="toolbar">
          <button
            className={ans.state === "unknown" ? "active" : "quiet"}
            onClick={() => update({ state: "unknown" })}
          >
            Unbekannt
          </button>
          <button
            className={ans.state === "unanswered" ? "active" : "quiet"}
            onClick={() => update({ state: "unanswered" })}
          >
            Nicht bearbeitet
          </button>
        </div>
        <p className="status-note">
          {status.label}
          {ans.substantiationReview && !status.substantiated
            ? " — frühere Bestätigung gilt für diesen Stand nicht."
            : ""}
        </p>
        <div className="form-grid">
          <Field
            label="Begründung"
            multiline
            value={ans.rationale}
            onChange={(v) => update({ rationale: v })}
          />
          <Select
            label="Gewählte Belegstufe"
            value={ans.evidenceLevel ?? ""}
            options={{
              "": "Noch offen",
              assumption: "Annahme",
              indication: "Hinweis",
              substantiated: "Geprüfter Beleg",
            }}
            onChange={(v) => update({ evidenceLevel: (v || null) as any })}
          />
          <Field
            label="Geltungsbereich"
            multiline
            value={ans.scope}
            onChange={(v) => update({ scope: v })}
          />
          <Field
            label="Offene Prüfung"
            multiline
            value={ans.openCheck}
            onChange={(v) => update({ openCheck: v })}
          />
          <Field
            label="Bewertende Person"
            value={ans.assessedBy}
            onChange={(v) => update({ assessedBy: v })}
          />
        </div>
        <Check
          label="Für die Entscheidung kritisch"
          checked={ans.criticalForDecision}
          onChange={(v) => update({ criticalForDecision: v })}
        />
        <Multi
          label="Betroffene Wertschöpfungsschritte"
          values={ans.valueStepIds}
          options={a.content.valueSteps}
          onChange={(v) => update({ valueStepIds: v })}
        />
        <Sources
          a={a}
          links={ans.evidenceLinks}
          onChange={(v) => update({ evidenceLinks: v })}
        />
        <details>
          <summary>Bewertungsanker und geeignete Belege</summary>
          <p className="preserve">{q.helpText}</p>
          {q.allowsNotApplicable && (
            <>
              <Field
                label="Begründung der Nichtanwendbarkeit"
                multiline
                value={ans.notApplicableReason}
                onChange={(v) => update({ notApplicableReason: v })}
              />
              <button
                disabled={!ans.notApplicableReason.trim()}
                onClick={() => update({ state: "not_applicable" })}
              >
                Begründet nicht anwendbar
              </button>
            </>
          )}
        </details>
        <details>
          <summary>Abweichende Positionen und Widersprüche</summary>
          <Check
            label="Einschätzung strittig"
            checked={ans.disputed}
            onChange={(v) => update({ disputed: v })}
          />
          {ans.positions.map((p, i) => (
            <div className="position" key={i}>
              <Field
                label="Person"
                value={p.person}
                onChange={(v) =>
                  update({
                    positions: ans.positions.map((p, j) =>
                      i === j ? { ...p, person: v } : p,
                    ),
                  })
                }
              />
              <Select
                label="Abweichende Bewertung"
                value={p.rating ?? ""}
                options={{
                  "": "Keine Bewertung",
                  low: "Niedrig",
                  medium: "Mittel",
                  high: "Hoch",
                }}
                onChange={(v) =>
                  update({
                    positions: ans.positions.map((p, j) =>
                      i === j ? { ...p, rating: (v || null) as any } : p,
                    ),
                  })
                }
              />
              <Field
                label="Begründung der Position"
                multiline
                value={p.rationale}
                onChange={(v) =>
                  update({
                    positions: ans.positions.map((p, j) =>
                      i === j ? { ...p, rationale: v } : p,
                    ),
                  })
                }
              />
              <Sources
                a={a}
                links={p.evidenceLinks}
                onChange={(v) =>
                  update({
                    positions: ans.positions.map((p, j) =>
                      i === j ? { ...p, evidenceLinks: v } : p,
                    ),
                  })
                }
              />
            </div>
          ))}
          <button
            onClick={() =>
              update({
                positions: [
                  ...ans.positions,
                  {
                    person: "",
                    rating: null,
                    rationale: "",
                    evidenceLinks: [],
                    recordedAt: iso(),
                  },
                ],
                disputed: true,
              })
            }
          >
            Position hinzufügen
          </button>
          <Field
            label="Begründete Konfliktauflösung"
            multiline
            value={resolution}
            onChange={setResolution}
          />
          {ans.conflictResolution && (
            <p>
              Vorherige Auflösung: {ans.conflictResolution.rationale}{" "}
              {status.conflict ? "(erneut zu prüfen)" : ""}
            </p>
          )}
          <button
            onClick={() =>
              change((a) =>
                resolveConflict(
                  a,
                  q.id,
                  resolution,
                  reviewer,
                  a.evaluationAsOf,
                ),
              )
            }
          >
            Konfliktauflösung dokumentieren
          </button>
        </details>
        <div className="review-box">
          <Reviewer value={reviewer} onChange={setReviewer} />
          <button
            onClick={() =>
              change((a) => reviewAnswer(a, q.id, reviewer, a.evaluationAsOf))
            }
          >
            Antwort mit aktuellen Quellen bestätigen
          </button>
          <small>
            Bestätigt die Aussage für den dokumentierten Umfang. Änderungen
            erfordern erneute Prüfung.
          </small>
        </div>
      </Section>
      <div className="toolbar spread">
        <button
          disabled={questions[0].id === q.id}
          onClick={() => setSelected(questions[questions.indexOf(q) - 1].id)}
        >
          Vorherige Frage
        </button>
        <button
          disabled={questions.at(-1)!.id === q.id}
          onClick={() => setSelected(questions[questions.indexOf(q) + 1].id)}
        >
          Nächste Frage
        </button>
      </div>
    </>
  );
}
