import type { QuickCheck } from "./model";
import { ProviderReport } from "./ProviderReport";
import { isProviderMethod } from "./provider-questions";
import { ScenarioReport } from "./ScenarioReport";
import { calculateRisk, riskLabel, checkTitle, QUICK_GROUPS } from "./model";
import {
  EXPERT_PREMISE,
  EXPERT_BOUNDARIES,
  EXPERT_FRAMING,
} from "./expert-team";
export function QuickReport({ check }: { check: QuickCheck }) {
  if (isProviderMethod(check.methodologyVersion))
    return <ProviderReport check={check} />;
  const r = calculateRisk(check);
  if (r.processed === 0 && check.scenarios && check.scenarios.runs.length > 0) {
    return (
      <article className="quick-print-report">
        <header className="print-brand">
          <strong>e23</strong>
          <span>KI-Resilienz-Check</span>
        </header>
        <p className="print-context">{checkTitle(check)} · Zukunftsszenarien</p>
        <ScenarioReport workspace={check.scenarios} standalone />
        <p>
          Check-ID: {check.id} · Stand:{" "}
          {new Intl.DateTimeFormat("de-DE", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Europe/Berlin",
          }).format(new Date(check.updatedAt))}
        </p>
      </article>
    );
  }
  return (
    <article className="quick-print-report">
      <header className="print-brand">
        <strong>e23</strong>
        <span>KI-Resilienz-Check</span>
      </header>
      <p className="print-context">
        {checkTitle(check)}
        {check.isExample ? " · Fiktives Beispiel" : ""}
      </p>
      <h1>
        {check.methodologyVersion === "quick-check-2.0"
          ? "Ihr Risikoprofil"
          : "Ihr KI-Risikoprofil"}
      </h1>
      {check.methodologyVersion === "quick-check-2.0" && (
        <section className="print-block">
          <h2>Das bewertete Gedankenexperiment</h2>
          <p>{EXPERT_PREMISE}</p>
          <p>{EXPERT_BOUNDARIES}</p>
          <p>{EXPERT_FRAMING}</p>
        </section>
      )}
      <div className="print-score">
        <strong>{r.score ?? "Noch offen"}</strong>
        {r.score !== null && <span>/ 100</span>}
      </div>
      <p>
        <strong>{riskLabel(r.score)}</strong> · {r.answered} von 12 beantwortet
      </p>
      <p>Einschätzung auf Basis Ihrer Antworten.</p>
      <section className="print-block">
        <h2>Die vier Bereiche</h2>
        <p>Je höher der Wert, desto größer das eingeschätzte Risiko.</p>
        <table>
          <thead>
            <tr>
              <th>Bereich</th>
              <th>Risiko / 100</th>
              <th>Beantwortet</th>
            </tr>
          </thead>
          <tbody>
            {r.groups.map((g) => (
              <tr key={g.id}>
                <td>{g.title}</td>
                <td>{g.score ?? "Noch offen"}</td>
                <td>{g.answered} / 3</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {r.critical.length > 0 && (
        <>
          <h2>Kritische Einzelwerte</h2>
          <p>Diese Punkte bleiben unabhängig vom Gesamtscore relevant.</p>
          {r.critical.map((q) => (
            <p key={q.id}>
              <strong>{q.value}/10:</strong> {q.text}
            </p>
          ))}
        </>
      )}
      <h2>Ihre nächsten Schritte</h2>
      {r.priorities.length ? (
        r.priorities.map((q, i) => (
          <section className="print-block" key={q.id}>
            <h3>
              {i + 1}. {q.action}
            </h3>
            <p>{q.actionDetail}</p>
            <p>
              Auslösende Einschätzung: {q.id}, {q.value}/10.
            </p>
          </section>
        ))
      ) : (
        <p>
          {r.score === null
            ? "Offene Einschätzungen klären."
            : "Stärken erhalten und Annahmen regelmäßig prüfen."}
        </p>
      )}
      <h2 className="print-page-start">Alle Antworten</h2>
      {QUICK_GROUPS.map((g) => (
        <section key={g.id}>
          <h3>{g.title}</h3>
          {check.methodologySnapshot
            .filter((q) => q.group === g.id)
            .map((q) => (
              <section className="print-block print-answer" key={q.id}>
                <h4>
                  {q.id} · {q.text}
                </h4>
                <p>
                  <strong>Antwort:</strong>{" "}
                  {typeof check.answers[q.id] === "number"
                    ? `${check.answers[q.id]} von 10`
                    : check.answers[q.id] === "unknown"
                      ? "Bewusst unbekannt"
                      : "Nicht beantwortet"}
                </p>
                <p>
                  <strong>1:</strong> {q.low}
                  <br />
                  <strong>10:</strong> {q.high}
                </p>
              </section>
            ))}
        </section>
      ))}
      <section className="print-block">
        <h2>Methode und Einordnung</h2>
        <p>
          Version {check.methodologyVersion}. Alle zwölf Fragen sind gleich
          gewichtet. Risikoscore = gerundeter Wert von 100 × Summe(Antwort − 1)
          / 108. Die Teilbereiche verwenden jeweils drei Antworten. Niedrig:
          0–24, mittel: 25–49, erhöht: 50–74, hoch: 75–100.
        </p>
        <p>
          Ein Gesamtscore setzt zwölf numerische Antworten voraus. Unbekannte
          Antworten werden nicht als niedrige Risiken behandelt. Einzelwerte von
          9 oder 10 werden zusätzlich hervorgehoben.
        </p>
        <p>
          Eigene Beratungsheuristik zur Orientierung, kein empirisch
          kalibriertes Prognosemodell und keine Ausfall- oder
          Überlebenswahrscheinlichkeit. Die Angaben sind Selbsteinschätzungen.
        </p>
        <p>
          Check-ID: {check.id}
          <br />
          Stand:{" "}
          {new Intl.DateTimeFormat("de-DE", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Europe/Berlin",
          }).format(new Date(check.updatedAt))}
        </p>
      </section>
      {check.scenarios && <ScenarioReport workspace={check.scenarios} />}
    </article>
  );
}
