import { useEffect, useState } from "react";
import type { Assessment } from "../domain/types";
import { loadWorkspace } from "../storage/database";
import { serialize, download } from "../import-export/exchange";
import { Report } from "../features/Report";
import { Arrow } from "./ui";
export default function Legacy({ onBack }: { onBack: () => void }) {
  const [cases, setCases] = useState<Assessment[] | null>(null),
    [selected, setSelected] = useState<string | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    loadWorkspace()
      .then((c) => {
        if (active) setCases(c);
      })
      .catch((e) => {
        if (active) setError(String(e));
      });
    return () => {
      active = false;
    };
  }, []);
  const current = cases?.find((c) => c.id === selected);
  return (
    <main className="legacy-page">
      <div className="no-print">
        <button
          className="text-link"
          onClick={() => (current ? setSelected(null) : onBack())}
        >
          <Arrow direction="left" />
          {current ? "Zum Archiv" : "Zu den Checks"}
        </button>
        <h1>Frühere Analysen</h1>
        <p className="lead-small">
          Ihre ursprünglichen Bewertungen bleiben lesbar. Die neue
          Quick-Check-Methode rechnet diese Daten nicht um.
        </p>
      </div>
      {error ? (
        <p role="alert" className="error-banner">
          {error} · Die vorhandenen Daten wurden nicht verändert.
        </p>
      ) : cases === null ? (
        <p>Archiv wird geladen …</p>
      ) : current ? (
        <>
          <div className="legacy-actions no-print">
            <p>
              Ursprüngliche Methodenversion {current.methodologyVersion} · Nur
              lesbar
            </p>
            <button
              className="button secondary"
              onClick={() =>
                download(
                  "e23-Archiv.json",
                  serialize([current]),
                  "application/json",
                )
              }
            >
              Originaldaten als JSON sichern
            </button>
          </div>
          <Report a={current} />
          {!current.methodologySnapshot && (
            <pre>{JSON.stringify(current, null, 2)}</pre>
          )}
        </>
      ) : (
        <>
          {cases.length ? (
            cases.map((c) => (
              <button
                key={c.id}
                className="history-row"
                onClick={() => setSelected(c.id)}
              >
                <span className="history-row-title">
                  <strong>{c.content.title}</strong>
                  <small>
                    {c.content.customerAlias || "Alias offen"} · Methode{" "}
                    {c.methodologyVersion}
                  </small>
                </span>
                <Arrow />
              </button>
            ))
          ) : (
            <p>In diesem Browser liegen keine früheren Analysen vor.</p>
          )}
        </>
      )}
    </main>
  );
}
