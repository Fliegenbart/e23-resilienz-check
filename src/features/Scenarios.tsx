import type { EditorProps } from "./ui";
import { Section, Field, TextFields, Select, Multi, Sources } from "./ui";
import { newScenario } from "../domain/model";
import { calculate } from "../scenarios/finance";
import type { FinancialStress } from "../domain/types";
const num = (v: string) => (v === "" ? null : Number(v));
export function Scenarios({ a, change }: EditorProps) {
  const b = a.content.baseline;
  const money = (v: number | null) =>
    v === null
      ? "Noch nicht berechenbar"
      : new Intl.NumberFormat("de-DE", {
          style: "currency",
          currency: b?.currency.match(/^[A-Z]{3}$/) ? b.currency : "EUR",
        }).format(v);
  return (
    <>
      <h1>Szenarien</h1>
      <p className="intro">
        Bedingte Annahmen, keine Vorhersagen. Die tatsächliche Ausgangslage
        bleibt unverändert.
      </p>
      <Section
        title="Wirtschaftliche Ausgangslage (optional)"
        actions={
          !b && (
            <button
              onClick={() =>
                change((a) => {
                  a.content.baseline = {
                    period: "month",
                    currency: "EUR",
                    revenue: null,
                    variableCosts: null,
                    fixedCosts: null,
                    sourceNote: "",
                  };
                })
              }
            >
              Finanzwerte ergänzen
            </button>
          )
        }
      >
        {b ? (
          <>
            <div className="form-grid">
              {(
                [
                  ["revenue", "Monatsumsatz R"],
                  ["variableCosts", "Variable Gesamtkosten V / Monat"],
                  ["fixedCosts", "Fixkosten F / Monat"],
                ] as const
              ).map(([k, l]) => (
                <Field
                  key={k}
                  label={l}
                  type="number"
                  value={b[k]}
                  onChange={(v) =>
                    change((a) => {
                      a.content.baseline![k] = num(v);
                    })
                  }
                />
              ))}
              <Field
                label="Währung (dreistelliger Code)"
                value={b.currency}
                onChange={(v) =>
                  change((a) => {
                    a.content.baseline!.currency = v.toUpperCase();
                  })
                }
              />
            </div>
            <Field
              label="Herkunft und Grenzen der Ausgangswerte"
              multiline
              value={b.sourceNote}
              onChange={(v) =>
                change((a) => {
                  a.content.baseline!.sourceNote = v;
                })
              }
            />
            <p>
              Vereinfachtes Monatsergebnis E0:{" "}
              <strong>{money(calculate(b, null).E0)}</strong>
            </p>
            {calculate(b, null).errors.map((e) => (
              <p key={e} className="error">
                {e}
              </p>
            ))}
            <button
              className="quiet"
              onClick={() =>
                change((a) => {
                  a.content.baseline = null;
                })
              }
            >
              Ausgangswerte entfernen
            </button>
          </>
        ) : (
          <p className="muted">
            Der qualitative Check funktioniert vollständig ohne Zahlen. Leere
            Werte werden nicht als null gerechnet.
          </p>
        )}
      </Section>
      <Section
        title="Stressszenarien und Chancen"
        actions={
          <div className="toolbar">
            <button
              onClick={() =>
                change((a) =>
                  a.content.scenarios.push(
                    newScenario(
                      "upside",
                      "Bessere KI verbessert unser Angebot",
                      a.content.horizonMonths,
                    ),
                  ),
                )
              }
            >
              Positive Perspektive
            </button>
            <button
              onClick={() =>
                change((a) =>
                  a.content.scenarios.push(
                    newScenario(
                      "custom",
                      "Eigenes Szenario",
                      a.content.horizonMonths,
                    ),
                  ),
                )
              }
            >
              Eigenes Szenario
            </button>
            {a.content.type === "idea" &&
              !a.content.scenarios.some((s) => s.template === "demand") && (
                <button
                  onClick={() =>
                    change((a) =>
                      a.content.scenarios.push(
                        newScenario(
                          "demand",
                          "Die Zahlungsbereitschaft bestätigt sich nicht",
                          a.content.horizonMonths,
                        ),
                      ),
                    )
                  }
                >
                  Zahlungsbereitschaft untersuchen
                </button>
              )}
          </div>
        }
      >
        {a.content.scenarios.map((s, i) => {
          const edit = (k: string, v: unknown) =>
            change((a) => {
              (a.content.scenarios[i] as any)[k] = v;
            });
          const fs = s.financialStress;
          const res = calculate(b, fs);
          return (
            <details key={s.id} open>
              <summary>
                {s.title} ·{" "}
                {s.status === "open"
                  ? "Offen"
                  : s.status === "worked"
                    ? "Bearbeitet"
                    : "Nicht relevant"}
              </summary>
              <TextFields
                object={s}
                fields={{
                  title: "Titel",
                  assumption: "Konkrete Veränderung / Annahme",
                  affectedCustomers: "Betroffene Kunden",
                  affectedRevenueParts: "Betroffene Erlösbestandteile",
                  customerReaction:
                    "Wirkungsweg: Warum ändern sich Kaufverhalten oder Betrieb?",
                  remainingPaidValue: "Verbleibender eigener bezahlter Nutzen",
                  response: "Mögliche Reaktion",
                  timeAndResourceNeeds:
                    "Zeitbedarf, einmaliger Aufwand und laufende Folgen",
                  earlyIndicator: "Frühindikator für Handlungsbedarf",
                  openQuestions: "Offene Fragen",
                  nextCheck: "Nächster Prüfschritt",
                  owner: "Verantwortlicher",
                }}
                onChange={edit}
              />
              <div className="form-grid">
                <Field
                  label="Termin des Prüfschritts"
                  type="date"
                  value={s.dueAt}
                  onChange={(v) => edit("dueAt", v || null)}
                />
                <Field
                  label="Planungshorizont in Monaten"
                  type="number"
                  value={s.horizonMonths}
                  onChange={(v) => edit("horizonMonths", Number(v) || 18)}
                />
              </div>
              <Multi
                label="Betroffene Schritte"
                values={s.valueStepIds}
                options={a.content.valueSteps}
                onChange={(v) => edit("valueStepIds", v)}
              />
              <Sources
                a={a}
                links={s.evidenceLinks}
                onChange={(v) => edit("evidenceLinks", v)}
              />
              <div className="form-grid">
                <Field
                  label="Begründung, falls nicht relevant"
                  multiline
                  value={s.notApplicableReason}
                  onChange={(v) => edit("notApplicableReason", v)}
                />
                <Select
                  label="Bearbeitungsstand"
                  value={s.status}
                  options={{
                    open: "Offen",
                    worked: "Bearbeitet",
                    ...(s.notApplicableReason.trim()
                      ? { not_applicable: "Begründet nicht relevant" }
                      : {}),
                  }}
                  onChange={(v) => edit("status", v)}
                />
              </div>
              <details>
                <summary>Optionaler wirtschaftlicher Vergleich</summary>
                {fs ? (
                  <>
                    <Select
                      label="Eignet sich das vereinfachte proportionale Monatsmodell?"
                      value={
                        fs.modelApplicable === null
                          ? ""
                          : String(fs.modelApplicable)
                      }
                      options={{
                        "": "Noch ungeprüft",
                        true: "Ja, für diese Annahmen geeignet",
                        false: "Nein, Modell ungeeignet",
                      }}
                      onChange={(v) =>
                        edit("financialStress", {
                          ...fs,
                          modelApplicable: v === "" ? null : v === "true",
                        })
                      }
                    />
                    <div className="form-grid">
                      {(
                        [
                          ["priceChange", "Preisänderung p (%)"],
                          ["volumeChange", "Mengenänderung q (%)"],
                          [
                            "unitVariableCostChange",
                            "Änderung variabler Stückkosten c (%)",
                          ],
                          [
                            "fixedCostDelta",
                            "Zusätzliche / entfallende Fixkosten pro Monat",
                          ],
                          [
                            "oneOffCost",
                            "Einmalige Umstellungskosten K (separat)",
                          ],
                        ] as const
                      ).map(([k, l], idx) => (
                        <Field
                          key={k}
                          label={l}
                          type="number"
                          value={
                            fs[k] === null ? null : fs[k]! * (idx < 3 ? 100 : 1)
                          }
                          onChange={(v) =>
                            edit("financialStress", {
                              ...fs,
                              [k]:
                                v === ""
                                  ? null
                                  : Number(v) / (idx < 3 ? 100 : 1),
                            })
                          }
                        />
                      ))}
                    </div>
                    <Field
                      label="Herkunft und Annahmen der Szenariowerte"
                      multiline
                      value={fs.assumptionNote}
                      onChange={(v) =>
                        edit("financialStress", { ...fs, assumptionNote: v })
                      }
                    />
                    <div className="finance-result">
                      <p>
                        Ausgangsergebnis E0: <strong>{money(res.E0)}</strong>
                      </p>
                      <p>
                        Szenarioergebnis E1: <strong>{money(res.E1)}</strong>
                      </p>
                      <p>
                        Veränderung pro Monat:{" "}
                        <strong>{money(res.delta)}</strong>
                      </p>
                      <p>
                        Einmalige Kosten:{" "}
                        {fs.oneOffCost === null
                          ? "Offen (nicht in E1 enthalten)"
                          : money(fs.oneOffCost)}
                      </p>
                    </div>
                    {res.errors.map((e) => (
                      <p className="error" key={e}>
                        {e}
                      </p>
                    ))}
                    <p className="muted">
                      Proportionale variable Kosten, repräsentative
                      Preis-/Mengeneinheit. Keine Liquiditätsrechnung oder
                      vollständige Finanzplanung.
                    </p>
                    <button
                      className="quiet"
                      onClick={() => edit("financialStress", null)}
                    >
                      Finanzannahmen entfernen
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() =>
                      edit("financialStress", {
                        priceChange: null,
                        volumeChange: null,
                        unitVariableCostChange: null,
                        fixedCostDelta: null,
                        oneOffCost: null,
                        assumptionNote: "",
                        modelApplicable: null,
                      } satisfies FinancialStress)
                    }
                  >
                    Finanzannahmen ergänzen
                  </button>
                )}
              </details>
            </details>
          );
        })}
      </Section>
    </>
  );
}
