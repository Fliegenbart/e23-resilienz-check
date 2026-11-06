import { useState } from "react";
import { Section, TextFields, Select, Multi, Sources, Reviewer } from "./ui";
import type { EditorProps } from "./ui";
import {
  uid,
  updateThreat,
  updateProtection,
  reviewProtection,
} from "../domain/model";
import { METHOD } from "../methodology/config";
import { protectionIsCurrent } from "../rules/evaluate";
export function Threats({ a, change }: EditorProps) {
  const [reviewer, setReviewer] = useState("");
  return (
    <>
      <h1>Bedrohungen und Schutzwirkung</h1>
      <p className="intro">
        Welcher Akteur verändert was? Prüfen Sie die Wirkung eines Vorteils
        gegenüber jeder konkreten Bedrohung gesondert.
      </p>
      <Section
        title="Bedrohungen"
        actions={
          <button
            onClick={() =>
              change((a) =>
                a.content.threats.push({
                  id: uid(),
                  revision: 1,
                  category: "Plattformbündelung",
                  actor: "",
                  change: "Neue Bedrohung",
                  valueStepIds: [],
                  economicMechanism: "",
                  basis: "scenario",
                  questionIds: [],
                  evidenceLinks: [],
                }),
              )
            }
          >
            Bedrohung hinzufügen
          </button>
        }
      >
        {a.content.threats.map((t) => (
          <details open key={t.id}>
            <summary>
              {t.change} · Version {t.revision}
            </summary>
            <TextFields
              object={t}
              fields={{
                actor: "Akteur",
                change: "Welche Veränderung?",
                economicMechanism:
                  "Wirkung auf Kaufverhalten, Preis, Kosten oder Betrieb",
              }}
              onChange={(k, v) =>
                change((a) => updateThreat(a, t.id, { [k]: v }))
              }
            />
            <div className="form-grid">
              <Select
                label="Kategorie"
                value={t.category}
                options={Object.fromEntries(
                  [
                    "Plattformbündelung",
                    "Branchenwettbewerber",
                    "Eigenleistung des Kunden",
                    "Verlust des Kundenzugangs",
                    "Anbieterabhängigkeit",
                    "Sonstige",
                  ].map((x) => [x, x]),
                )}
                onChange={(v) =>
                  change((a) => updateThreat(a, t.id, { category: v }))
                }
              />
              <Select
                label="Grundlage"
                value={t.basis}
                options={{
                  scenario: "Szenarioannahme",
                  observed: "Als Beobachtung dokumentiert",
                }}
                onChange={(v) =>
                  change((a) => updateThreat(a, t.id, { basis: v as any }))
                }
              />
            </div>
            <Multi
              label="Betroffene Schritte"
              values={t.valueStepIds}
              options={a.content.valueSteps}
              onChange={(v) =>
                change((a) => updateThreat(a, t.id, { valueStepIds: v }))
              }
            />
            <Multi
              label="Betroffene Fragen (B1/B4 für Austauschbarkeit zuordnen)"
              values={t.questionIds}
              options={METHOD.questions.map((q) => ({
                id: q.id,
                title: `${q.id} ${q.text}`,
              }))}
              onChange={(v) =>
                change((a) => updateThreat(a, t.id, { questionIds: v as any }))
              }
            />
            <Sources
              a={a}
              links={t.evidenceLinks}
              onChange={(v) =>
                change((a) => updateThreat(a, t.id, { evidenceLinks: v }))
              }
            />
            <button
              className="quiet"
              onClick={() =>
                change((a) => {
                  a.content.threats = a.content.threats.filter(
                    (x) => x.id !== t.id,
                  );
                  a.content.protections = a.content.protections.filter(
                    (p) => p.threatId !== t.id,
                  );
                  a.content.actions.forEach(
                    (ac) =>
                      (ac.linkedThreatIds = ac.linkedThreatIds.filter(
                        (id) => id !== t.id,
                      )),
                  );
                })
              }
            >
              Bedrohung und aktuelle Schutzzuordnungen entfernen
            </button>
          </details>
        ))}
      </Section>
      <Section
        title="Behauptete Schutzwirkung"
        actions={
          <button
            disabled={!a.content.threats.length}
            onClick={() =>
              change((a) =>
                a.content.protections.push({
                  id: uid(),
                  revision: 1,
                  questionId: "C1",
                  threatId: a.content.threats[0].id,
                  mechanism: "",
                  limitations: "",
                  evidenceLinks: [],
                  review: null,
                  reviewedAnswerRevision: null,
                  reviewedThreatRevision: null,
                }),
              )
            }
          >
            Schutzverknüpfung hinzufügen
          </button>
        }
      >
        <Reviewer value={reviewer} onChange={setReviewer} />
        {a.content.protections.map((p) => (
          <details open key={p.id}>
            <summary>
              {p.questionId} →{" "}
              {a.content.threats.find((t) => t.id === p.threatId)?.change} ·{" "}
              {protectionIsCurrent(a, p, a.evaluationAsOf)
                ? "Aktuell belegt"
                : "Schutzwirkung offen"}
            </summary>
            <div className="form-grid">
              <Select
                label="Behaupteter Vorteil"
                value={p.questionId}
                options={Object.fromEntries(
                  METHOD.questions
                    .filter((q) => q.group === "C")
                    .map((q) => [q.id, `${q.id} ${q.text}`]),
                )}
                onChange={(v) =>
                  change((a) =>
                    updateProtection(a, p.id, { questionId: v as any }),
                  )
                }
              />
              <Select
                label="Konkrete Bedrohung"
                value={p.threatId}
                options={Object.fromEntries(
                  a.content.threats.map((t) => [t.id, t.change]),
                )}
                onChange={(v) =>
                  change((a) => updateProtection(a, p.id, { threatId: v }))
                }
              />
            </div>
            <TextFields
              object={p}
              fields={{
                mechanism: "Weshalb schützt der Vorteil genau hier?",
                limitations: "Grenzen der Schutzwirkung",
              }}
              onChange={(k, v) =>
                change((a) => updateProtection(a, p.id, { [k]: v }))
              }
            />
            <Sources
              a={a}
              links={p.evidenceLinks}
              onChange={(v) =>
                change((a) => updateProtection(a, p.id, { evidenceLinks: v }))
              }
            />
            <div className="toolbar">
              <button
                onClick={() =>
                  change((a) =>
                    reviewProtection(a, p.id, reviewer, a.evaluationAsOf),
                  )
                }
              >
                Konkrete Schutzwirkung prüfen
              </button>
              <button
                className="quiet"
                onClick={() =>
                  change((a) => {
                    a.content.protections = a.content.protections.filter(
                      (x) => x.id !== p.id,
                    );
                  })
                }
              >
                Verknüpfung entfernen
              </button>
            </div>
          </details>
        ))}
      </Section>
    </>
  );
}
