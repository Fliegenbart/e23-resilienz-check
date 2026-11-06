import { useState } from "react";
import {
  Section,
  Field,
  Select,
  TextFields,
  Check,
  Multi,
  Reviewer,
} from "./ui";
import type { EditorProps } from "./ui";
import { evaluate, evidenceStatus } from "../rules/evaluate";
import { RECOMMENDATIONS, label } from "../import-export/report";
import { closeAssessment, uid } from "../domain/model";
import { METHOD } from "../methodology/config";
export function Decision({ a, change }: EditorProps) {
  const [reviewer, setReviewer] = useState("");
  const findings = evaluate(a, a.evaluationAsOf);
  const c = a.content;
  return (
    <>
      <h1>Entscheidung</h1>
      <p className="intro">
        Hinweise unterstützen die gemeinsame Entscheidung. Empfehlung,
        Bedingungen und nächste Schritte verantworten die Beteiligten.
      </p>
      <Section title="Hinweise mit ihren Grundlagen">
        {findings.map((f) => (
          <details key={f.findingId}>
            <summary>
              <span className="finding-kind">{label(f.kind)}</span> {f.ruleId} ·{" "}
              {f.title}
            </summary>
            <p className="preserve">{f.rationale}</p>
            <p>Nächster Prüfschritt: {f.suggestedCheck}</p>
            <p className="muted">
              Quellen:{" "}
              {f.evidenceIds
                .map((id) => c.evidence.find((e) => e.id === id)?.title ?? id)
                .join(", ") || "Keine"}{" "}
              · Bedrohungen:{" "}
              {f.threatIds
                .map((id) => c.threats.find((t) => t.id === id)?.change ?? id)
                .join(", ") || "Keine Zuordnung"}
            </p>
            <Field
              label="Unser Umgang mit diesem Hinweis / begründete Abweichung"
              multiline
              value={
                c.decision.findingResponses.find(
                  (x) => x.findingId === f.findingId,
                )?.response ?? ""
              }
              onChange={(v) =>
                change((a) => {
                  const rs = a.content.decision.findingResponses;
                  const r = rs.find((x) => x.findingId === f.findingId);
                  if (r) r.response = v;
                  else rs.push({ findingId: f.findingId, response: v });
                })
              }
            />
          </details>
        ))}
      </Section>
      <Section title="Gemeinsame Empfehlung">
        <Select
          label="Empfehlung"
          value={c.decision.recommendation}
          options={RECOMMENDATIONS}
          onChange={(v) =>
            change((a) => {
              a.content.decision.recommendation = v as any;
            })
          }
        />
        <TextFields
          object={c.decision}
          fields={{
            rationale: "Begründung",
            conditions: "Bedingungen und Grenzen",
            dissent: "Abweichende Einschätzung / offener Dissens",
            decidedBy: "Entscheidung durch",
          }}
          onChange={(k, v) =>
            change((a) => {
              (a.content.decision as any)[k] = v;
            })
          }
        />
        <div className="form-grid">
          <Field
            label="Entscheidungsdatum"
            type="date"
            value={c.decision.decidedAt?.slice(0, 10) ?? ""}
            onChange={(v) =>
              change((a) => {
                a.content.decision.decidedAt = v || null;
              })
            }
          />
          <Field
            label="Nächste Überprüfung"
            type="date"
            value={c.decision.reviewDueAt?.slice(0, 10) ?? ""}
            onChange={(v) =>
              change((a) => {
                a.content.decision.reviewDueAt = v || null;
              })
            }
          />
        </div>
        <Check
          label="Empfehlung ist vorläufig"
          checked={c.decision.provisional}
          onChange={(v) =>
            change((a) => {
              a.content.decision.provisional = v;
            })
          }
        />
      </Section>
      <Section
        title="Maßnahmenplan"
        actions={
          <button
            onClick={() =>
              change((a) =>
                a.content.actions.push({
                  id: uid(),
                  title: "Neue Maßnahme",
                  description: "",
                  expectedEvidence: "",
                  owner: "",
                  dueAt: null,
                  status: "open",
                  effortNote: "",
                  linkedQuestionIds: [],
                  linkedRuleIds: [],
                  linkedFindingIds: [],
                  linkedThreatIds: [],
                  linkedScenarioIds: [],
                }),
              )
            }
          >
            Maßnahme hinzufügen
          </button>
        }
      >
        {c.actions.map((ac, i) => (
          <details key={ac.id} open>
            <summary>
              {ac.title} · {ac.owner || "Verantwortung offen"}
            </summary>
            <TextFields
              object={ac}
              fields={{
                title: "Titel",
                description: "Konkrete Tätigkeit",
                expectedEvidence: "Erwarteter Nachweis / Erfolgskriterium",
                owner: "Verantwortlicher",
                effortNote: "Grobe Aufwandseinschätzung",
              }}
              onChange={(k, v) =>
                change((a) => {
                  (a.content.actions[i] as any)[k] = v;
                })
              }
            />
            <div className="form-grid">
              <Field
                label="Zieltermin"
                type="date"
                value={ac.dueAt?.slice(0, 10) ?? ""}
                onChange={(v) =>
                  change((a) => {
                    a.content.actions[i].dueAt = v || null;
                  })
                }
              />
              <Select
                label="Status"
                value={ac.status}
                options={{
                  open: "Offen",
                  in_progress: "In Arbeit",
                  done: "Erledigt",
                  cancelled: "Abgebrochen",
                }}
                onChange={(v) =>
                  change((a) => {
                    a.content.actions[i].status = v as any;
                  })
                }
              />
            </div>
            <Check
              label="Einer der drei vorrangigen nächsten Schritte"
              checked={c.executiveSummary.priorityActionIds.includes(ac.id)}
              onChange={(v) =>
                change((a) => {
                  if (
                    v &&
                    a.content.executiveSummary.priorityActionIds.length >= 3
                  )
                    throw Error(
                      "Bitte höchstens drei nächste Schritte priorisieren.",
                    );
                  a.content.executiveSummary.priorityActionIds = v
                    ? [...a.content.executiveSummary.priorityActionIds, ac.id]
                    : a.content.executiveSummary.priorityActionIds.filter(
                        (id) => id !== ac.id,
                      );
                })
              }
            />
            <details>
              <summary>Bezüge zu Grundlagen und Hinweisen</summary>
              <Multi
                label="Fragen"
                values={ac.linkedQuestionIds}
                options={METHOD.questions.map((q) => ({
                  id: q.id,
                  title: `${q.id} ${q.text}`,
                }))}
                onChange={(v) =>
                  change((a) => {
                    a.content.actions[i].linkedQuestionIds = v as any;
                  })
                }
              />
              <Multi
                label="Konkrete Hinweise"
                values={ac.linkedFindingIds}
                options={findings.map((f) => ({
                  id: f.findingId,
                  title: `${f.ruleId} ${f.title}`,
                }))}
                onChange={(v) =>
                  change((a) => {
                    a.content.actions[i].linkedFindingIds = v;
                  })
                }
              />
              <Multi
                label="Regelfamilien"
                values={ac.linkedRuleIds}
                options={METHOD.rules.map((r) => ({
                  id: r.id,
                  title: `${r.id} ${r.outputDescription}`,
                }))}
                onChange={(v) =>
                  change((a) => {
                    a.content.actions[i].linkedRuleIds = v;
                  })
                }
              />
              <Multi
                label="Bedrohungen"
                values={ac.linkedThreatIds}
                options={c.threats.map((t) => ({ id: t.id, title: t.change }))}
                onChange={(v) =>
                  change((a) => {
                    a.content.actions[i].linkedThreatIds = v;
                  })
                }
              />
              <Multi
                label="Szenarien"
                values={ac.linkedScenarioIds}
                options={c.scenarios}
                onChange={(v) =>
                  change((a) => {
                    a.content.actions[i].linkedScenarioIds = v;
                  })
                }
              />
            </details>
            <button
              className="quiet"
              onClick={() =>
                change((a) => {
                  a.content.actions = a.content.actions.filter(
                    (x) => x.id !== ac.id,
                  );
                  a.content.executiveSummary.priorityActionIds =
                    a.content.executiveSummary.priorityActionIds.filter(
                      (id) => id !== ac.id,
                    );
                })
              }
            >
              Maßnahme entfernen
            </button>
          </details>
        ))}
      </Section>
      <Section title="Kernaussagen für den Bericht">
        <TextFields
          object={c.executiveSummary}
          fields={{
            mainThreat: "Wichtigste Bedrohung und Grundlage",
            evidencedAdvantage: "Wichtigster belegter Vorteil",
            keyUnknown: "Entscheidende offene Frage",
          }}
          onChange={(k, v) =>
            change((a) => {
              (a.content.executiveSummary as any)[k] = v;
            })
          }
        />
      </Section>
      <Section title="Fachliche Durchsicht abschließen">
        <p>
          Der Abschluss speichert Methode, Stichtag, Inhalte und Hinweise als
          unveränderten historischen Stand. Offene Grundlagen bleiben im Bericht
          sichtbar.
        </p>
        <Reviewer value={reviewer} onChange={setReviewer} />
        <button
          className="primary"
          onClick={() =>
            change((a) => closeAssessment(a, reviewer, a.evaluationAsOf))
          }
        >
          Historischen Stand festhalten
        </button>
        {a.status === "reviewed" && (
          <p role="status">
            Fachlich durchgesehen. Weitere Änderungen erzeugen einen neuen
            Entwurf.
          </p>
        )}
      </Section>
    </>
  );
}
