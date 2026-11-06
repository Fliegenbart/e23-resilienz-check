import { useEffect, useRef, useState } from "react";
import type { Assessment } from "./domain/types";
import { touch } from "./domain/model";
import { METHOD, GROUPS } from "./methodology/config";
import { loadWorkspace, saveWorkspace } from "./storage/database";
import { download, serialize } from "./import-export/exchange";
import { Portfolio } from "./features/Portfolio";
import { Profile } from "./features/Profile";
import { Questions } from "./features/Questions";
import { Evidence } from "./features/Evidence";
import { Threats } from "./features/Threats";
import { Scenarios } from "./features/Scenarios";
import { Decision } from "./features/Decision";
import { Report } from "./features/Report";
import { evaluate, evidenceStatus } from "./rules/evaluate";
import { label } from "./import-export/report";
const nav = {
  profile: "Fallprofil",
  questions: "Prüfung",
  evidence: "Belege",
  threats: "Bedrohungen",
  scenarios: "Szenarien",
  decision: "Entscheidung",
  report: "Bericht",
  method: "Methode",
};
function Method() {
  return (
    <>
      <h1>Methode</h1>
      <p className="intro">
        Version {METHOD.version} · {METHOD.notes}
      </p>
      <p>
        Bewertungseinheit ist eine konkrete Leistung für eine Kundengruppe.
        Kundenwert, Exposition, Vorteile und Handlungsfähigkeit werden getrennt
        untersucht. Die gemeinsame Empfehlung ist eine menschliche Entscheidung.
      </p>
      <h2>Begriffe und Belegprüfung</h2>
      <p>
        Annahme: ungeprüfte Behauptung. Hinweis: Indiz mit begrenztem
        Geltungsbereich. Geprüfter Beleg: menschlich geprüfte Quelle mit
        ausdrücklich bestätigtem Bezug zur aktuellen Aussage. Die Belegstufe
        allein genügt nicht. Widersprüche, überfällige Quellen und materielle
        Änderungen erfordern erneute Prüfung.
      </p>
      <p>
        Ein geprüfter Vorteil und seine Schutzwirkung gegen eine konkrete
        Bedrohung sind getrennte Aussagen. Unbekannt bleibt unbekannt;
        Nichtanwendbarkeit benötigt eine Begründung. Es gibt keine Gesamtnote
        und keine Kompensation kritischer Betriebslücken durch andere Vorteile.
      </p>
      <p>
        Lokale Speicherung ist keine alleinige Sicherung; JSON-Export gehört zum
        regulären Arbeitsablauf. Historische Stände sind nachvollziehbar, aber
        nicht manipulationssicher.
      </p>
      <h2>Fragen und Bewertungsanker</h2>
      {Object.entries(GROUPS).map(([g, title]) => (
        <section key={g}>
          <h3>
            {g} — {title}
          </h3>
          <p>
            {g === "B"
              ? "Hoch bedeutet stärkere Exposition."
              : "Hoch bedeutet stärkeren Kundenwert, Vorteil oder höhere Handlungsfähigkeit."}
          </p>
          {METHOD.questions
            .filter((q) => q.group === g)
            .map((q) => (
              <details key={q.id}>
                <summary>
                  {q.id} {q.text}
                </summary>
                {Object.entries(q.anchors).map(([r, t]) => (
                  <p key={r}>
                    <strong>{label(r)}:</strong> {t}
                  </p>
                ))}
                <p className="preserve">{q.helpText}</p>
                <p>
                  Nichtanwendbarkeit:{" "}
                  {q.allowsNotApplicable
                    ? "mit Begründung zulässig"
                    : "nicht zulässig"}
                  .
                </p>
              </details>
            ))}
        </section>
      ))}
      <h2>Auswertungsregeln</h2>
      {METHOD.rules.map((r) => (
        <details key={r.id}>
          <summary>
            {r.id} {r.outputDescription}
          </summary>
          <p>Auslöser: {r.triggerDescription}</p>
        </details>
      ))}
      <h2>Methodische Erprobung</h2>
      <p>
        Der gemeinsame Pilot soll Verständlichkeit der Fragen und Anker,
        Unterschiede zwischen Einschätzungen und die Nutzbarkeit der
        Entscheidungen prüfen. Technisch korrektes Verhalten validiert die
        Beratungsmethode nicht empirisch.
      </p>
      <p>
        NIST AI RMF dient als Orientierung im Umgang mit KI-Risiken; METR
        liefert Kontext für möglichen KI-Fortschritt. Beide validieren keinen
        firmenspezifischen Resilienzscore. Reale Anbieter- und Fallbehauptungen
        benötigen eigene datierte Quellen.
      </p>
      <p>
        <a
          href="https://www.nist.gov/itl/ai-risk-management-framework"
          target="_blank"
          rel="noreferrer"
        >
          NIST AI RMF ↗
        </a>{" "}
        ·{" "}
        <a
          href="https://metr.org/blog/2026-11-05-anthropic-ai-rd-acceleration-assessment/"
          target="_blank"
          rel="noreferrer"
        >
          METR-Kontextquelle aus dem Briefing ↗
        </a>
      </p>
    </>
  );
}
export default function App() {
  const [cases, setCases] = useState<Assessment[]>([]),
    [loaded, setLoaded] = useState(false),
    [loadError, setLoadError] = useState(""),
    [error, setError] = useState(""),
    [selected, setSelected] = useState<string | null>(null),
    [view, setView] = useState<keyof typeof nav>("profile"),
    [saveState, setSaveState] = useState("Laden …");
  const generation = useRef(0),
    saved = useRef<Assessment[] | null>(null);
  const a = cases.find((a) => a.id === selected);
  const known = !!a && a.methodologyVersion === METHOD.version;
  const showError = (e: unknown) =>
    setError(e instanceof Error ? e.message : String(e));
  useEffect(() => {
    let active = true;
    loadWorkspace()
      .then((data) => {
        if (active) {
          saved.current = data;
          setCases(data);
          setLoaded(true);
          setSaveState("Gespeichert");
        }
      })
      .catch((e) => {
        if (active) setLoadError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!loaded || cases === saved.current) return;
    const current = ++generation.current;
    setSaveState("Speichern …");
    const timer = setTimeout(() => {
      saveWorkspace(cases)
        .then(() => {
          if (generation.current === current) {
            saved.current = cases;
            setSaveState("Gespeichert");
          }
        })
        .catch((e) => {
          if (generation.current === current) {
            setSaveState("Speicherfehler – JSON sichern");
            showError(e);
          }
        });
    }, 350);
    return () => clearTimeout(timer);
  }, [cases, loaded]);
  useEffect(() => {
    const before = (e: BeforeUnloadEvent) => {
      if (loaded && cases !== saved.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", before);
    return () => window.removeEventListener("beforeunload", before);
  }, [cases, loaded]);
  const change = (fn: (a: Assessment) => void) => {
    if (!a || !known) return;
    try {
      const copy = structuredClone(a);
      const previousRevisions = copy.revisions.length;
      fn(copy);
      if (copy.revisions.length === previousRevisions) touch(copy);
      setCases(cases.map((x) => (x.id === copy.id ? copy : x)));
    } catch (e) {
      showError(e);
    }
  };
  const open = (id: string) => {
    setSelected(id);
    setView("profile");
    setError("");
    window.scrollTo(0, 0);
  };
  const counts =
    a && known
      ? {
          processed: Object.values(a.content.answers).filter(
            (ans) => ans.state !== "unanswered",
          ).length,
          evidenced: Object.keys(a.content.answers).filter(
            (id) =>
              evidenceStatus(a, id as any, a.evaluationAsOf).substantiated,
          ).length,
          unknown: Object.values(a.content.answers).filter(
            (ans) => ans.state === "unknown",
          ).length,
        }
      : null;
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Zum Inhalt
      </a>
      <aside className="sidebar no-print">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
          </span>
          <strong>KI-Resilienz-Check</strong>
        </div>
        <nav aria-label="Arbeitsbereiche">
          <button
            className={!selected ? "active" : ""}
            onClick={() => {
              setSelected(null);
              setError("");
            }}
          >
            Fallübersicht
          </button>
          {a && (
            <>
              <div className="case-title">{a.content.title}</div>
              {Object.entries(nav).map(([v, text]) => (
                <button
                  key={v}
                  className={view === v ? "active" : ""}
                  aria-current={view === v ? "page" : undefined}
                  onClick={() => {
                    setView(v as any);
                    window.scrollTo(0, 0);
                  }}
                >
                  {text}
                </button>
              ))}
            </>
          )}
        </nav>
        <div className="sidebar-footer">
          Lokaler Beratungspilot
          <br />
          Methodenversion {METHOD.version}
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar no-print">
          <div>
            {a ? (
              <>
                {a.isExample ? "Fiktives Beispiel" : "Fall"}{" "}
                <span className="slash">/</span>{" "}
                <strong>{a.content.title}</strong>
              </>
            ) : (
              "Arbeitsbereich"
            )}
          </div>
          <div className="toolbar">
            <span
              className={
                saveState.startsWith("Speicherfehler") ? "error" : "save-state"
              }
              role="status"
              aria-live="polite"
            >
              {saveState}
            </span>
            {a && (
              <button
                className="primary"
                onClick={() =>
                  download(
                    "KI-Resilienz-Fall.json",
                    serialize([a]),
                    "application/json",
                  )
                }
              >
                JSON sichern
              </button>
            )}
          </div>
        </header>
        <main
          id="main"
          className={view === "report" && a ? "main report-main" : "main"}
        >
          {loadError ? (
            <div role="alert">
              <h1>Lokale Daten konnten nicht geladen werden</h1>
              <p>{loadError}</p>
              <p>
                Vorhandene Daten werden nicht durch einen leeren Arbeitsbereich
                überschrieben. Prüfen Sie den Browserzugriff oder öffnen Sie
                eine gesicherte Kopie in einem anderen Browserprofil.
              </p>
              <button onClick={() => location.reload()}>Erneut laden</button>
            </div>
          ) : !loaded ? (
            <p>Lokal gespeicherte Fälle werden geladen …</p>
          ) : (
            <>
              {error && (
                <div role="alert" className="error-banner">
                  <strong>Bitte prüfen:</strong> {error}
                  <button
                    onClick={() => setError("")}
                    aria-label="Fehlermeldung schließen"
                  >
                    ×
                  </button>
                </div>
              )}
              {!a ? (
                <Portfolio
                  cases={cases}
                  setCases={setCases}
                  open={open}
                  onError={showError}
                />
              ) : (
                <>
                  {a.isExample && (
                    <div className="example-notice no-print">
                      Fiktives Beispiel · Sämtliche Quellen und
                      Geschäftsaussagen dienen ausschließlich der Demonstration.
                    </div>
                  )}
                  {!known ? (
                    <>
                      <div className="notice">
                        <h1>Importierter Fall · Nur lesbar</h1>
                        <p>
                          Methodenversion {a.methodologyVersion} wird nicht
                          unterstützt. Keine Neuberechnung mit aktuellen Fragen.
                          Der ursprüngliche Stand bleibt exportierbar.
                        </p>
                      </div>
                      {a.methodologySnapshot ? (
                        <>
                          <Report a={a} />
                          <details>
                            <summary>Ursprünglicher Methodensnapshot</summary>
                            <pre>
                              {JSON.stringify(a.methodologySnapshot, null, 2)}
                            </pre>
                          </details>
                        </>
                      ) : (
                        <>
                          <h2>Rohansicht ohne Methodensnapshot</h2>
                          <pre>{JSON.stringify(a, null, 2)}</pre>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {counts && view !== "report" && view !== "method" && (
                        <div className="process no-print">
                          {counts.processed} von 20 Fragen bearbeitet ·{" "}
                          {counts.unknown} unbekannt · {counts.evidenced}{" "}
                          aktuell belegt{" "}
                          <span>Prozessstand, keine Resilienzbewertung</span>
                        </div>
                      )}
                      {view === "profile" && <Profile a={a} change={change} />}{" "}
                      {view === "questions" && (
                        <Questions a={a} change={change} />
                      )}{" "}
                      {view === "evidence" && (
                        <Evidence a={a} change={change} />
                      )}{" "}
                      {view === "threats" && <Threats a={a} change={change} />}{" "}
                      {view === "scenarios" && (
                        <Scenarios a={a} change={change} />
                      )}{" "}
                      {view === "decision" && (
                        <Decision a={a} change={change} />
                      )}{" "}
                      {view === "report" && <Report key={a.id} a={a} />}{" "}
                      {view === "method" && <Method />}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
