import type { QuickCheck } from "./model";
import { calculateRisk, riskLabel, checkTitle } from "./model";
import { Arrow } from "./ui";
export function History({
  checks,
  onOpen,
  onStart,
  onImport,
  onExport,
  onArchive,
}: {
  checks: QuickCheck[];
  onOpen: (id: string) => void;
  onStart: () => void;
  onImport: () => void;
  onExport: () => void;
  onArchive: () => void;
}) {
  return (
    <main className="history-page">
      <div className="history-heading">
        <div>
          <p className="section-index">Ihr Arbeitsbereich</p>
          <h1>Bisherige Checks</h1>
          <p className="lead-small">
            Fortsetzen, vergleichen oder mit einem neuen Angebot beginnen.
          </p>
        </div>
        <button className="button primary" onClick={onStart}>
          Neuer Check
          <Arrow />
        </button>
      </div>
      {checks.length ? (
        <div className="check-list">
          {[...checks]
            .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
            .map((c) => {
              const r = calculateRisk(c);
              return (
                <button
                  className="history-row"
                  key={c.id}
                  onClick={() => onOpen(c.id)}
                >
                  <span className="history-row-title">
                    <strong>{checkTitle(c)}</strong>
                    <small>
                      {r.answered} von 12 beantwortet ·{" "}
                      {c.view === "results" ? "Ergebnis" : "Entwurf"}
                    </small>
                  </span>
                  <span className="history-score">
                    {r.score === null ? "—" : r.score}
                    <small>{riskLabel(r.score)}</small>
                  </span>
                  <Arrow />
                </button>
              );
            })}
        </div>
      ) : (
        <div className="history-empty">
          <p>Hier erscheinen Ihre gespeicherten Checks.</p>
          <button className="text-link" onClick={onStart}>
            Mit dem ersten Check starten
            <Arrow />
          </button>
        </div>
      )}
      <div className="history-tools">
        <button className="text-link" onClick={onImport}>
          JSON importieren
        </button>
        <button
          className="text-link"
          disabled={!checks.length}
          onClick={onExport}
        >
          Alle Checks als JSON sichern
        </button>
        <button className="text-link" onClick={onArchive}>
          Frühere ausführliche Analysen
        </button>
      </div>
      <p className="storage-hint">
        In diesem Browser gespeichert. Mit JSON nehmen Sie Ihre Checks in einen
        anderen Browser mit.
      </p>
    </main>
  );
}
