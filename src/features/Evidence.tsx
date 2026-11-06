import { useState } from "react";
import { Section, TextFields, Field, Select, Reviewer, Check } from "./ui";
import type { EditorProps } from "./ui";
import {
  addEvidence,
  updateEvidence,
  removeEvidence,
  answerLinks,
} from "../domain/model";
import { safeUrl } from "../import-export/exchange";
import { label } from "../import-export/report";
export function Evidence({ a, change }: EditorProps) {
  const [reviewer, setReviewer] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  return (
    <>
      <h1>Belege</h1>
      <p className="intro">
        Dokumentieren Sie, welche konkrete Aussage eine Quelle trägt und wo ihre
        Grenzen liegen.
      </p>
      <Section
        title={`${a.content.evidence.length} Quellen`}
        actions={
          <button
            className="primary"
            onClick={() =>
              change((a) => {
                addEvidence(a);
              })
            }
          >
            Quelle hinzufügen
          </button>
        }
      >
        <Reviewer value={reviewer} onChange={setReviewer} />
        {a.content.evidence.map((e) => (
          <details key={e.id} open>
            <summary>
              {e.title}{" "}
              <span className="muted">
                · {label(e.reviewStatus)} · Version {e.revision}
                {e.synthetic ? " · Synthetisch" : ""}
              </span>
            </summary>
            <TextFields
              object={e}
              fields={{
                title: "Titel",
                kind: "Art der Quelle",
                authorOrOrigin: "Urheber / Herkunft",
                internalReference: "Interne Referenz",
                observation: "Konkrete Beobachtung oder Auszug",
                scopeAndLimitations: "Geltungsbereich und Grenzen",
              }}
              onChange={(k, v) =>
                change((a) => updateEvidence(a, e.id, { [k]: v }))
              }
            />
            <div className="form-grid">
              <Field
                label="Quellen-URL"
                value={e.url}
                onChange={(v) =>
                  change((a) => updateEvidence(a, e.id, { url: v || null }))
                }
              />
              <Field
                label="Ereignis- / Erhebungsdatum (soweit bekannt)"
                type="date"
                value={e.eventDate?.slice(0, 10) ?? ""}
                onChange={(v) =>
                  change((a) =>
                    updateEvidence(a, e.id, { eventDate: v || null }),
                  )
                }
              />
              <Field
                label="Erneut prüfen bis"
                type="date"
                value={e.reviewDueAt?.slice(0, 10) ?? ""}
                onChange={(v) =>
                  change((a) =>
                    updateEvidence(a, e.id, { reviewDueAt: v || null }),
                  )
                }
              />
            </div>
            {safeUrl(e.url) ? (
              <a
                href={safeUrl(e.url)!}
                target="_blank"
                rel="noopener noreferrer"
              >
                Quelle bewusst öffnen ↗
              </a>
            ) : (
              e.url && (
                <p className="error">
                  URL nicht als sicherer HTTP-/HTTPS-Link verwendbar.
                </p>
              )
            )}
            <Check
              label="Synthetische Beispielquelle"
              checked={e.synthetic}
              onChange={(v) =>
                change((a) => updateEvidence(a, e.id, { synthetic: v }))
              }
            />
            <p className="muted">
              {e.reviewedBy
                ? `Zuletzt geprüft durch ${e.reviewedBy}, ${e.reviewedAt?.slice(0, 10)}, Quellenversion ${e.reviewedRevision}.`
                : "Noch nicht menschlich geprüft."}{" "}
              {e.reviewDueAt && e.reviewDueAt < a.evaluationAsOf
                ? "Prüffrist zum Auswertungsstichtag überschritten."
                : ""}
            </p>
            <div className="toolbar">
              <button
                onClick={() =>
                  change((a) => updateEvidence(a, e.id, {}, reviewer))
                }
              >
                Aktuelle Quelle prüfen
              </button>
              <button className="quiet danger" onClick={() => setPending(e.id)}>
                Quelle löschen …
              </button>
            </div>
            {pending === e.id && (
              <div role="alert" className="notice">
                <p>
                  Die Quelle wird aus dem aktuellen Entwurf entfernt. Abhängige
                  Prüfungen werden zurückgesetzt.
                </p>
                <p>
                  Betroffene Antworten:{" "}
                  {Object.values(a.content.answers)
                    .filter((ans) =>
                      answerLinks(ans).some((l) => l.evidenceId === e.id),
                    )
                    .map((ans) => ans.questionId)
                    .join(", ") || "Keine"}
                  . Schutzverknüpfungen, Szenarien und Bedrohungen werden
                  ebenfalls bereinigt. Historische Stände bleiben erhalten.
                </p>
                <div className="toolbar">
                  <button
                    className="danger"
                    onClick={() => {
                      change((a) => removeEvidence(a, e.id));
                      setPending(null);
                    }}
                  >
                    Löschen bestätigen
                  </button>
                  <button onClick={() => setPending(null)}>Abbrechen</button>
                </div>
              </div>
            )}
          </details>
        ))}
      </Section>
    </>
  );
}
