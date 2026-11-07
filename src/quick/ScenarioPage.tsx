import { useState } from "react";
import type {
  ScenarioWorkspace,
  ScenarioRun,
  ScenarioDefinition,
  ScenarioId,
  ScenarioContext,
} from "./scenario-model";
import {
  PROFILE_LABELS,
  SCENARIO_METHOD,
  startScenario,
  evaluateScenario,
  scenarioLabels,
  costEffect,
  formatPercent,
} from "./scenario-model";
import { ScenarioInterview } from "./ScenarioInterview";
import type { ScenarioUpdate } from "./ScenarioInterview";
import { Arrow } from "./ui";
import {
  SCENARIO_EXPERT_PREMISE,
  EXPERT_BOUNDARIES,
  EXPERT_FRAMING,
} from "./expert-team";
import { riskLabel } from "./model";
function Assumptions({
  preset,
  run,
  version,
}: {
  preset: ScenarioDefinition;
  run: ScenarioRun;
  version: string;
}) {
  const l = scenarioLabels(preset, version),
    effect = costEffect(run.context.aiShare, preset.assumptions.costFactor);
  return (
    <>
      <div className="scenario-badges">
        <span>{l.cost}</span>
        <span>{l.intelligence}</span>
        <span>{l.robots}</span>
        <span>{run.context.horizon} Monate</span>
        <span>{PROFILE_LABELS[run.context.profile]}</span>
      </div>
      <div className="scenario-story">
        <p className="section-index">Wenn diese Bedingungen eintreten …</p>
        <p>{preset.story}</p>
        <strong>{preset.question}</strong>
      </div>
      <div className="scenario-budget">
        <div>
          <b>1</b>
          <span>
            {version === "scenario-stress-1.0"
              ? "KI-Durchlauf heute"
              : "vergleichbarer Arbeitsdurchlauf"}
          </span>
        </div>
        <Arrow />
        <div>
          <b>{preset.assumptions.costFactor}</b>
          <span>finanzierbare Arbeitsdurchläufe im Szenario</span>
        </div>
        <p>
          Gleiches KI-Budget und vergleichbares Leistungsziel für die
          Kostenrechnung. Mehr Durchläufe bedeuten weder automatisch mehr
          brauchbare Ergebnisse noch beliebige Parallelität.
        </p>
      </div>
      <div className="scenario-effects">
        <div>
          <h3>Die bedingte Kostenwirkung</h3>
          {effect ? (
            <p>
              <strong>
                {formatPercent(effect.savingPercent)} % geringere Gesamtkosten
              </strong>
              <br />
              {run.context.aiShare} % heutiger KI-Kostenanteil,{" "}
              {preset.assumptions.costFactor}× günstigere KI. Die übrigen Kosten
              bleiben gleich.
            </p>
          ) : (
            <p>
              Der heutige KI-Kostenanteil ist unbekannt. Deshalb wird keine
              Einsparung bei den Gesamtkosten berechnet.
            </p>
          )}
          <small>
            Nur Wirkung auf heutige KI-Kosten. Neue Automatisierung, Robotik,
            Einführung, Prüfung und Nacharbeit sind gesondert zu betrachten.
          </small>
        </div>
        <div>
          <h3>Was weiter geprüft werden muss</h3>
          <p>
            Datenzugang, Nutzungsrechte, Kundenzugang, Vertrauen und praktische
            Umsetzung. Eigene Firma, Wettbewerber und Kunden erhalten im
            Szenario Zugang zu denselben Fähigkeiten.
          </p>
          {run.context.profile === "digital" &&
            preset.assumptions.robots !== "none" && (
              <p className="scenario-physical-note">
                Ihr Angebot ist vorwiegend digital. Ein unmittelbarer
                körperlicher Produktionshebel wird nicht unterstellt; Robotik
                kann Ihre Kunden und Partner verändern.
              </p>
            )}
        </div>
      </div>
    </>
  );
}
function AnswerText({ value }: { value: number | "unknown" | null }) {
  return (
    <>
      {typeof value === "number"
        ? `${value} / 10`
        : value === "unknown"
          ? "Unbekannt"
          : "Nicht beantwortet"}
    </>
  );
}
export default function ScenarioPage({
  workspace,
  onChange,
  onBack,
  onExport,
  onPrint,
}: {
  workspace: ScenarioWorkspace;
  onChange: ScenarioUpdate;
  onBack: () => void;
  onExport: () => void;
  onPrint: () => void;
}) {
  const [error, setError] = useState("");
  const run = workspace.runs.find((r) => r.id === workspace.activeRunId);
  const preset = run
    ? workspace.methodSnapshot.catalog.find((s) => s.id === run.presetId)
    : undefined;
  const catalog = () => {
    onChange((w) => {
      w.view = "catalog";
    });
    window.scrollTo(0, 0);
  };
  const start = (id: ScenarioId) => {
    try {
      if (workspace.runs.length >= 60)
        throw Error(
          "Bereits 60 Bewertungsstände. Bitte einen neuen Check beginnen.",
        );
      onChange((w) => {
        startScenario(w, id);
      });
      setError("");
      window.scrollTo(0, 0);
    } catch (e) {
      setError(String(e));
    }
  };
  const edit = (step: number) => {
    onChange((w) => {
      w.runs.find((r) => r.id === run!.id)!.step = step;
      w.view = "questions";
    });
    window.scrollTo(0, 0);
  };
  const context = (fn: (c: ScenarioContext) => void) =>
    onChange((w) => fn(w.draftContext));
  if (workspace.view === "questions" && run)
    return (
      <ScenarioInterview
        key={`${run.id}:${run.step}`}
        workspace={workspace}
        run={run}
        onChange={onChange}
      />
    );
  return (
    <main className="scenario-page">
      <div className="scenario-top no-print">
        <button className="text-link" onClick={onBack}>
          <Arrow direction="left" />
          Zum Check
        </button>
        <div>
          {workspace.view !== "catalog" && (
            <button className="text-link" onClick={catalog}>
              Weitere Szenarien
            </button>
          )}
          {workspace.runs.length > 0 && (
            <button
              className="text-link"
              onClick={() => {
                onChange((w) => {
                  w.activeRunId = w.activeRunId ?? w.runs.at(-1)!.id;
                  w.view = "comparison";
                });
                window.scrollTo(0, 0);
              }}
            >
              Vergleich ansehen
            </button>
          )}
        </div>
      </div>
      {error && (
        <p role="alert" className="error-banner">
          {error}
        </p>
      )}
      {workspace.view === "catalog" ? (
        <>
          <header className="scenario-heading">
            <p className="section-index">Sechs Zukunftsbilder. Ihr Geschäft.</p>
            <h1>Was wäre, wenn?</h1>
            <p>
              Expertenteams werden günstiger oder leistungsfähiger. Roboter
              kommen hinzu. Prüfen Sie die Folgen für Ihr Angebot.
            </p>
          </header>
          {workspace.methodVersion === SCENARIO_METHOD && (
            <div className="scenario-story expert-scenario-premise">
              <p className="section-index">
                Denken Sie an Menschen mit außergewöhnlichen Fähigkeiten
              </p>
              <p>{SCENARIO_EXPERT_PREMISE}</p>
              <details>
                <summary>
                  Was das Team bekommt – und was es erst beschaffen muss
                </summary>
                <p>{EXPERT_BOUNDARIES}</p>
                <p>{EXPERT_FRAMING}</p>
              </details>
            </div>
          )}
          <div className="scenario-settings">
            <fieldset>
              <legend>Ihr Angebot</legend>
              <div className="scenario-choices">
                {Object.entries(PROFILE_LABELS).map(([id, title]) => (
                  <label
                    className={
                      workspace.draftContext.profile === id ? "active" : ""
                    }
                    key={id}
                  >
                    <input
                      type="radio"
                      name="scenario-profile"
                      checked={workspace.draftContext.profile === id}
                      onChange={() =>
                        context((c) => {
                          c.profile = id as ScenarioContext["profile"];
                        })
                      }
                    />
                    {title}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Zeit für Ihre Anpassung</legend>
              <div className="scenario-choices">
                {([6, 18, 36] as const).map((n) => (
                  <label
                    className={
                      workspace.draftContext.horizon === n ? "active" : ""
                    }
                    key={n}
                  >
                    <input
                      type="radio"
                      name="scenario-horizon"
                      checked={workspace.draftContext.horizon === n}
                      onChange={() =>
                        context((c) => {
                          c.horizon = n;
                        })
                      }
                    />
                    {n} Monate
                  </label>
                ))}
              </div>
            </fieldset>
            <p>
              Angenommen, die Szenariobedingungen gelten in diesem Zeitfenster
              für Ihren Markt. Die Zeitangabe ist keine Technologieprognose.
            </p>
          </div>
          <details className="scenario-cost-setting">
            <summary>
              Kostenwirkung sichtbar machen <span>Optional</span>
            </summary>
            <p>
              Welchen Anteil haben KI-Nutzungskosten heute an den vollständigen
              Kosten Ihrer konkreten Leistung?
            </p>
            <div className="scenario-choices">
              {([null, 0, 25, 50, 75, 100] as const).map((n) => (
                <label
                  className={
                    workspace.draftContext.aiShare === n ? "active" : ""
                  }
                  key={String(n)}
                >
                  <input
                    type="radio"
                    name="scenario-share"
                    checked={workspace.draftContext.aiShare === n}
                    onChange={() =>
                      context((c) => {
                        c.aiShare = n;
                      })
                    }
                  />
                  {n === null ? "Unbekannt" : `${n} %`}
                </label>
              ))}
            </div>
            <p>
              Beispiel: 25 % KI-Anteil und zehnfach günstigere KI ergeben 22,5 %
              geringere Gesamtkosten. Personal, Vertrieb und Material werden
              dabei unverändert gerechnet.
            </p>
          </details>
          <div className="scenario-catalog">
            {workspace.methodSnapshot.catalog.map((s, i) => {
              const l = scenarioLabels(s, workspace.methodVersion);
              return (
                <button
                  className="scenario-card"
                  key={s.id}
                  onClick={() => start(s.id)}
                >
                  <span className="scenario-card-number">0{i + 1}</span>
                  <div>
                    <span className="scenario-card-kicker">{l.cost}</span>
                    <h2>{s.title}</h2>
                    <p>{s.question}</p>
                    <div className="scenario-card-tags">
                      <span>{l.intelligence}</span>
                      <span>{l.robots}</span>
                    </div>
                  </div>
                  <Arrow />
                </button>
              );
            })}
          </div>
          <div className="scenario-catalog-note">
            <strong>Sie müssen nicht alle Szenarien bearbeiten.</strong>
            <p>
              Vergleichen Sie etwa 2 und 3 für höhere Teamfähigkeiten oder 2 und
              4 für zusätzliche Robotik. Jede neue Bewertung bewahrt ihre
              eigenen Annahmen. Bestehende Stände ändern sich nicht mit den
              Einstellungen oben.
            </p>
          </div>
        </>
      ) : workspace.view === "scene" && run && preset ? (
        <>
          <header className="scenario-heading">
            <p className="section-index">
              Szenario {preset.id.slice(1)} · Neue Perspektive
            </p>
            <h1>{preset.title}</h1>
            <p>
              Vier Einschätzungen zum Risiko, eine zu Ihrer eigenen Chance.
              Jeweils ein Klick auf der Skala.
            </p>
          </header>
          <Assumptions
            preset={preset}
            run={run}
            version={workspace.methodVersion}
          />
          <div className="scenario-start">
            <button
              className="button primary"
              onClick={() => {
                onChange((w) => {
                  w.view = "questions";
                });
                window.scrollTo(0, 0);
              }}
            >
              Szenario durchspielen
              <Arrow />
            </button>
            <span>1–10 oder „Weiß ich noch nicht“ · Keine Textfelder</span>
          </div>
        </>
      ) : run && preset ? (
        (() => {
          const result = evaluateScenario(run, workspace);
          return (
            <>
              <header className="scenario-heading">
                <p className="section-index">Ihr Vergleich unter Annahmen</p>
                <h1>Welche Zukunft fordert Sie?</h1>
                <p>
                  Szenarien vergleichen, offene Punkte erkennen und nächste
                  Schritte vorbereiten.
                </p>
              </header>
              <section className="scenario-result">
                <div>
                  <p className="section-index">{preset.title}</p>
                  <div className="scenario-result-score">
                    <strong>{result.score ?? "Offen"}</strong>
                    {result.score !== null && <span>/ 100</span>}
                  </div>
                  <h2>{riskLabel(result.score)}</h2>
                  <p>
                    {result.answered} von 4 Risiko-Einschätzungen numerisch
                    beantwortet.
                  </p>
                  {result.critical.length > 0 && (
                    <p className="scenario-critical">
                      {result.critical.length}{" "}
                      {result.critical.length === 1
                        ? "kritischer Einzelwert"
                        : "kritische Einzelwerte"}{" "}
                      (9/10){" "}
                      {result.critical.length === 1 ? "bleibt" : "bleiben"}{" "}
                      unabhängig vom Durchschnitt sichtbar.
                    </p>
                  )}
                </div>
                <div className="scenario-opportunity">
                  <p className="section-index">Ihre eigene Chance</p>
                  <strong>
                    {result.opportunity ?? "Offen"}
                    {result.opportunity !== null && <small> / 10</small>}
                  </strong>
                  <p>
                    Ein hoher Chancenwert beseitigt keine Risiken. Er zeigt
                    einen Ansatz für die eigene Nutzung der Entwicklung.
                  </p>
                  <button className="text-link" onClick={() => edit(4)}>
                    Chance bearbeiten
                    <Arrow />
                  </button>
                </div>
              </section>
              <div className="scenario-answer-list">
                {workspace.methodSnapshot.questions.map((q, i) => (
                  <button key={q.id} onClick={() => edit(i)}>
                    <span>
                      {q.title}
                      {q.id === "adapt"
                        ? ` · ${run.context.horizon} Monate`
                        : ""}
                    </span>
                    <strong>
                      <AnswerText value={run.answers[q.id]} />
                    </strong>
                    <Arrow />
                  </button>
                ))}
              </div>
              <section className="scenario-next">
                <h2>Wenn das eintritt, dann …</h2>
                {result.actions.map((q) => (
                  <div key={q.id}>
                    <strong>
                      {q.title} · {q.value}/10
                    </strong>
                    <p>{q.action}</p>
                  </div>
                ))}
                {result.unknown.length > 0 && (
                  <div>
                    <strong>Offene Einschätzungen klären</strong>
                    <p>
                      {result.unknown.map((q) => q.title).join(", ")}. Diese
                      Angaben werden nicht als niedrige Risiken gewertet.
                    </p>
                  </div>
                )}
                {result.actions.length === 0 && result.unknown.length === 0 && (
                  <p>
                    Ihre Angaben zeigen geringe Risiken. Prüfen Sie die zugrunde
                    gelegten Stärken an konkreten Kundenaufgaben und beobachten
                    Sie Veränderungen.
                  </p>
                )}
                {result.opportunity !== null && result.opportunity >= 7 && (
                  <div>
                    <strong>
                      Die eigene Chance praktisch erproben ·{" "}
                      {result.opportunity}/10
                    </strong>
                    <p>{workspace.methodSnapshot.questions[4].action}</p>
                  </div>
                )}
              </section>
              <details className="scenario-saved-assumptions">
                <summary>Annahmen dieser Bewertung</summary>
                <Assumptions
                  preset={preset}
                  run={run}
                  version={workspace.methodVersion}
                />
              </details>
              <section className="scenario-comparison">
                <h2>Alle gespeicherten Szenariostände</h2>
                <p>
                  Ein Klick auf eine Zeile öffnet die Bewertung. Einstellungen
                  neuer Szenarien verändern diese Stände nicht.
                </p>
                <div className="scenario-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Szenario / Annahmen</th>
                        <th>Risiko / 100</th>
                        <th>Chance / 10</th>
                        <th>Stand</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...workspace.runs].reverse().map((r) => {
                        const s = workspace.methodSnapshot.catalog.find(
                            (s) => s.id === r.presetId,
                          )!,
                          e = evaluateScenario(r, workspace);
                        return (
                          <tr
                            key={r.id}
                            className={r.id === run.id ? "selected" : ""}
                          >
                            <th>
                              <button
                                onClick={() => {
                                  onChange((w) => {
                                    w.activeRunId = r.id;
                                    w.view = r.completed
                                      ? "comparison"
                                      : "scene";
                                  });
                                  window.scrollTo(0, 0);
                                }}
                              >
                                {s.title}
                                <small>
                                  {r.context.horizon} Monate ·{" "}
                                  {PROFILE_LABELS[r.context.profile]} ·
                                  KI-Anteil{" "}
                                  {r.context.aiShare === null
                                    ? "unbekannt"
                                    : `${r.context.aiShare} %`}
                                </small>
                              </button>
                            </th>
                            <td>{e.score ?? "Offen"}</td>
                            <td>{e.opportunity ?? "Offen"}</td>
                            <td>
                              {r.completed ? "Bewertet" : "Entwurf"}
                              <small>
                                {new Intl.DateTimeFormat("de-DE", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                  timeZone: "Europe/Berlin",
                                }).format(new Date(r.createdAt))}
                              </small>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
              <p className="scenario-comparability">
                Diese Risikowerte vergleichen Szenarien mit demselben
                Vier-Fragen-Modell. Der Zwölf-Fragen-Check verwendet eine andere
                Methode; eine rechnerische Differenz zwischen diesen Scores ist
                nicht aussagekräftig.
              </p>
              <div className="scenario-footer">
                <button className="button primary" onClick={catalog}>
                  Weiteres Szenario testen
                  <Arrow />
                </button>
                <div>
                  <button className="text-link" onClick={onExport}>
                    JSON sichern
                  </button>
                  <button className="button dark" onClick={onPrint}>
                    Szenariobericht als PDF
                    <Arrow />
                  </button>
                </div>
              </div>
            </>
          );
        })()
      ) : null}
      <details className="scenario-method">
        <summary>Methode und Grenzen der Szenariosimulation</summary>
        <p>
          Die sechs Zukunftsbilder sind Stresstests ohne
          Eintrittswahrscheinlichkeiten.{" "}
          {workspace.methodVersion === SCENARIO_METHOD
            ? "Die Teamfähigkeiten sind ausdrücklich angenommene Bedingungen des Gedankenexperiments, keine Messung heute verfügbarer Systeme."
            : "Ausgangspunkt sind angenommene heutige Fähigkeiten, keine automatische Live-Messung aktueller Spitzenmodelle."}
          Angelegter Referenzstand:{" "}
          {new Intl.DateTimeFormat("de-DE").format(
            new Date(workspace.referenceDate),
          )}
          .
        </p>
        <p>
          Risiko = gerundet 100 × Summe(Antwort − 1) / 36. Vier gleich
          gewichtete Risikoantworten sind erforderlich. Chance bleibt separat.
          Kritische Einzelwerte 9/10 bleiben sichtbar.
        </p>
        <p>
          Kostenersparnis = heutiger KI-Kostenanteil × (1 − 1 /
          Vergünstigungsfaktor). Andere Kosten bleiben gleich. Keine
          automatische Umrechnung von KI-Preisen in Umsatz, Marge,
          Personalersparnis oder Robotikkosten.
        </p>
        <small>
          Methodenversion {workspace.methodVersion} · Eigene Beratungsheuristik
          auf Basis Ihrer Einschätzungen
        </small>
      </details>
    </main>
  );
}
