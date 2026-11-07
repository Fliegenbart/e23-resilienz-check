import type { ScenarioWorkspace } from "./scenario-model";
import {
  PROFILE_LABELS,
  SCENARIO_METHOD,
  costEffect,
  evaluateScenario,
  formatPercent,
  scenarioLabels,
} from "./scenario-model";
import { riskLabel } from "./model";
const answer = (v: number | "unknown" | null) =>
  typeof v === "number"
    ? `${v} von 10`
    : v === "unknown"
      ? "Bewusst unbekannt"
      : "Nicht beantwortet";
export function ScenarioReport({
  workspace,
  standalone = false,
}: {
  workspace: ScenarioWorkspace;
  standalone?: boolean;
}) {
  if (!workspace.runs.length) return null;
  return (
    <section className="scenario-print-section">
      <h2 className={standalone ? undefined : "print-page-start"}>
        Zukunftsszenarien im Vergleich
      </h2>
      <p>
        Wenn-dann-Stresstests auf Basis Ihrer Einschätzungen. Die Bedingungen
        und Zeitfenster sind Annahmen; es werden keine
        Eintrittswahrscheinlichkeiten oder Technologieprognosen berechnet.
      </p>
      <table>
        <thead>
          <tr>
            <th>Szenario / Zeitfenster</th>
            <th>Risiko / 100</th>
            <th>Chance / 10</th>
            <th>Stand</th>
          </tr>
        </thead>
        <tbody>
          {workspace.runs.map((r) => {
            const s = workspace.methodSnapshot.catalog.find(
                (s) => s.id === r.presetId,
              )!,
              e = evaluateScenario(r);
            return (
              <tr key={r.id}>
                <td>
                  {s.title}
                  <br />
                  {r.context.horizon} Monate
                </td>
                <td>{e.score ?? "Noch offen"}</td>
                <td>{e.opportunity ?? "Noch offen"}</td>
                <td>{r.completed ? "Bewertet" : "Entwurf"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p>
        Vergleichbar sind Szenariowerte aus diesem Vier-Fragen-Modell. Der
        heutige Zwölf-Fragen-Check verwendet eine andere Methode. Zwischen
        diesen beiden Scores wird keine rechnerische Veränderung ausgewiesen.
      </p>
      <section className="print-block">
        <h3>Berechnung und Grenzen</h3>
        <p>
          Methodenversion {SCENARIO_METHOD}. Risiko = gerundet 100 ×
          Summe(Antwort − 1) / 36. Vier gleich gewichtete numerische
          Risikoantworten sind erforderlich; unbekannte Werte gelten nicht als
          niedrige Risiken. Einzelwerte 9/10 bleiben kritisch. Chancen werden
          separat eingeschätzt und nicht mit Risiken verrechnet.
        </p>
        <p>
          Kostenersparnis = heutiger KI-Kostenanteil × (1 − 1 /
          Vergünstigungsfaktor). Die übrigen Kosten bleiben gleich. Keine
          automatische Umrechnung in Umsatz, Marge, Personaleinsparungen oder
          Robotikkosten. Ausgangspunkt sind angenommene heutige Fähigkeiten,
          keine Live-Messung. Referenzdatum:{" "}
          {new Intl.DateTimeFormat("de-DE").format(
            new Date(workspace.referenceDate),
          )}
          .
        </p>
      </section>
      {workspace.runs.map((r, index) => {
        const s = workspace.methodSnapshot.catalog.find(
            (s) => s.id === r.presetId,
          )!,
          labels = scenarioLabels(s),
          e = evaluateScenario(r),
          cost = costEffect(r.context.aiShare, s.assumptions.costFactor);
        return (
          <section className="scenario-print-run" key={r.id}>
            <h2 className="print-page-start">
              Bewertung {index + 1}: {s.title}
            </h2>
            <p>
              {labels.cost} · {labels.intelligence} · {labels.robots}
              <br />
              {PROFILE_LABELS[r.context.profile]} · {r.context.horizon} Monate
              Anpassungszeit
            </p>
            <p>{s.story}</p>
            <p>
              <strong>Unter diesen Annahmen zu prüfen:</strong> {s.question}
            </p>
            <p>
              Eigene Firma, Wettbewerber und Kunden erhalten Zugang zur gleichen
              KI. Daten, Rechte, Kundenzugang, Vertrauen und praktische
              Umsetzung bleiben zu prüfen. Neue Robotik setzt gesondert ihre
              Verfügbarkeit, Zuverlässigkeit und Wirtschaftlichkeit voraus.
            </p>
            {r.context.profile === "digital" &&
              s.assumptions.robots !== "none" && (
                <p>
                  Vorwiegend digitales Angebot: Ein unmittelbarer körperlicher
                  Produktionshebel ist nicht unterstellt; indirekte Folgen für
                  Kunden und Partner sind gesondert zu prüfen.
                </p>
              )}
            <p>
              <strong>Kostenbeispiel:</strong>{" "}
              {cost
                ? `${r.context.aiShare} % heutiger KI-Kostenanteil und ${s.assumptions.costFactor}× günstigere KI ergeben ${formatPercent(cost.savingPercent)} % geringere Gesamtkosten, wenn die übrigen Kosten gleich bleiben.`
                : "Der heutige KI-Kostenanteil ist unbekannt. Es wird kein Gesamtkosteneffekt berechnet."}{" "}
              Bei gleichem KI-Budget werden modellhaft{" "}
              {s.assumptions.costFactor}× so viele vergleichbare KI-Durchläufe
              finanzierbar. Daraus folgen weder proportional mehr brauchbare
              Ergebnisse noch beliebige Parallelität.
            </p>
            <p>
              <strong>
                Risiko: {e.score ?? "Noch offen"}
                {e.score !== null ? " / 100" : ""}
              </strong>{" "}
              · {riskLabel(e.score)} · {e.answered}/4 numerisch bewertet
              <br />
              <strong>
                Eigene Chance: {e.opportunity ?? "Noch offen"}
                {e.opportunity !== null ? " / 10" : ""}
              </strong>
            </p>
            {workspace.methodSnapshot.questions.map((q) => (
              <section className="print-block print-answer" key={q.id}>
                <h4>
                  {q.title}
                  {q.id === "adapt" ? ` · ${r.context.horizon} Monate` : ""}
                </h4>
                <p>
                  {q.text}
                  <br />
                  <strong>Antwort:</strong> {answer(r.answers[q.id])}
                  <br />
                  <strong>1:</strong> {q.low} · <strong>10:</strong> {q.high}
                </p>
              </section>
            ))}
            <section className="print-block">
              <h3>Wenn das eintritt, dann …</h3>
              {e.actions.map((q) => (
                <p key={q.id}>
                  <strong>
                    {q.title} · {q.value}/10:
                  </strong>{" "}
                  {q.action}
                </p>
              ))}
              {e.critical.length > 0 && (
                <p>
                  <strong>Kritische Einzelwerte:</strong>{" "}
                  {e.critical
                    .map((q) => `${q.title} (${q.value}/10)`)
                    .join(", ")}
                  . Diese Punkte bleiben unabhängig vom Durchschnitt relevant.
                </p>
              )}
              {e.unknown.length > 0 && (
                <p>
                  <strong>Prüfauftrag:</strong>{" "}
                  {e.unknown.map((q) => q.title).join(", ")} sind noch offen.
                </p>
              )}
              {e.actions.length === 0 && e.unknown.length === 0 && (
                <p>
                  Stärken an konkreten Kundenaufgaben überprüfen und
                  Veränderungen beobachten.
                </p>
              )}
              {e.opportunity !== null && e.opportunity >= 7 && (
                <p>
                  <strong>Eigene Chance erproben:</strong>{" "}
                  {workspace.methodSnapshot.questions[4].action}
                </p>
              )}
              <p>
                Szenariostand-ID: {r.id}
                <br />
                Angelegt:{" "}
                {new Intl.DateTimeFormat("de-DE", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Europe/Berlin",
                }).format(new Date(r.createdAt))}{" "}
                · {r.completed ? "Bewertet" : "Entwurf"}
              </p>
            </section>
          </section>
        );
      })}
    </section>
  );
}
