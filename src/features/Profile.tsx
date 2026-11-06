import { Section, TextFields, Select, Field, Check } from "./ui";
import type { EditorProps } from "./ui";
import { uid } from "../domain/model";
export function Profile({ a, change }: EditorProps) {
  const c = a.content;
  return (
    <>
      <h1>Fallprofil</h1>
      <p className="intro">
        Grenzen Sie das Angebot und die Entscheidung für eine konkrete
        Kundengruppe ab. Fehlende Angaben bleiben offen.
      </p>
      <Section title="Angebot und Entscheidungsfrage">
        <TextFields
          object={c}
          fields={{
            title: "Geschäftsfeld / Titel",
            customerAlias: "Kunde / Alias",
            decisionQuestion: "Welche Entscheidung soll vorbereitet werden?",
            customerSegment: "Zielkundengruppe",
            user: "Tatsächlicher Nutzer",
            economicBuyer: "Wirtschaftlicher Käufer",
            customerProblem: "Kundenproblem",
            currentAlternative: "Bisherige Alternative",
            paidOutcome: "Bezahltes Ergebnis",
            revenueModel: "Erlösmodell",
            costDescription: "Relevante Kostenarten",
            marketContext: "Markt / Einsatzkontext",
            excludedScope: "Untersuchungsgrenzen",
            owner: "Verantwortlicher",
          }}
          onChange={(k, v) =>
            change((a) => {
              (a.content as any)[k] = v;
            })
          }
        />
        <div className="form-grid">
          <Select
            label="Falltyp"
            value={c.type}
            options={{ existing: "Bestehendes Geschäft", idea: "Neue Idee" }}
            onChange={(v) =>
              change((a) => {
                a.content.type = v as any;
              })
            }
          />
          <Select
            label="Planungshorizont"
            value={String(c.horizonMonths)}
            options={{
              6: "6 Monate",
              12: "12 Monate",
              18: "18 Monate",
              36: "36 Monate",
            }}
            onChange={(v) =>
              change((a) => {
                a.content.horizonMonths = Number(v);
              })
            }
          />
          <Field
            label="Beteiligte / freie Rollen (eine Zeile je Person)"
            multiline
            value={c.participants.join("\n")}
            onChange={(v) =>
              change((a) => {
                a.content.participants = v.split("\n");
              })
            }
          />
          <Field
            label="Auswertungsstichtag"
            type="date"
            value={a.evaluationAsOf.slice(0, 10)}
            onChange={(v) => {
              if (v)
                change((a) => {
                  a.evaluationAsOf = v;
                });
            }}
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
          <Select
            label="Manuelle Handlungspriorität"
            value={String(c.actionPriority)}
            options={{ 1: "Hoch", 2: "Normal", 3: "Niedrig" }}
            onChange={(v) =>
              change((a) => {
                a.content.actionPriority = Number(v);
              })
            }
          />
        </div>
      </Section>
      <Section
        title="Wertschöpfungsschritte"
        actions={
          <button
            onClick={() =>
              change((a) => {
                a.content.valueSteps.push({
                  id: uid(),
                  title: "Neuer Schritt",
                  customerValue: "",
                  requiredResources: "",
                  currentAIUse: "",
                  alternative: "",
                  critical: false,
                  openQuestions: "",
                });
              })
            }
          >
            Schritt hinzufügen
          </button>
        }
      >
        <p className="muted">
          Üblicherweise drei bis sieben Schritte. Erfassen Sie Ergebnis,
          Ressourcen und mögliche Alternativen.
        </p>
        {c.valueSteps.map((s, i) => (
          <details key={s.id} open>
            <summary>
              {i + 1}. {s.title}
            </summary>
            <TextFields
              object={s}
              fields={{
                title: "Schritt und Ergebnis",
                customerValue: "Kundenwert",
                requiredResources: "Ressourcen, Daten, Rechte und Beziehungen",
                currentAIUse: "KI-Anteil heute",
                alternative: "Mögliche Alternative",
                openQuestions: "Offene Fragen",
              }}
              onChange={(k, v) =>
                change((a) => {
                  (a.content.valueSteps[i] as any)[k] = v;
                })
              }
            />
            <Check
              label="Für das Leistungsversprechen kritisch"
              checked={s.critical}
              onChange={(v) =>
                change((a) => {
                  a.content.valueSteps[i].critical = v;
                })
              }
            />
            <button
              className="quiet"
              onClick={() =>
                change((a) => {
                  a.content.valueSteps.splice(i, 1);
                  for (const ans of Object.values(a.content.answers))
                    if (ans.valueStepIds.includes(s.id)) {
                      ans.revision++;
                      ans.substantiationReview = null;
                      ans.conflictResolution = null;
                      ans.valueStepIds = ans.valueStepIds.filter(
                        (id) => id !== s.id,
                      );
                    }
                  a.content.threats.forEach((t) => {
                    if (t.valueStepIds.includes(s.id)) {
                      t.revision++;
                      t.valueStepIds = t.valueStepIds.filter(
                        (id) => id !== s.id,
                      );
                    }
                  });
                  a.content.scenarios.forEach(
                    (t) =>
                      (t.valueStepIds = t.valueStepIds.filter(
                        (id) => id !== s.id,
                      )),
                  );
                })
              }
            >
              Schritt entfernen
            </button>
          </details>
        ))}
      </Section>
    </>
  );
}
