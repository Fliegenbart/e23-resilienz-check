import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { QuickAnswer, QuickCheck } from "./model";
import type { Assessment } from "../domain/types";
import {
  createCheck,
  answerCheck,
  calculateRisk,
  serializeChecks,
  parseChecks,
  mergeChecks,
  exampleCheck,
  QUICK_METHOD,
  checkTitle,
} from "./model";
import { loadChecks, saveChecks } from "./storage";
import { ExpertIntro } from "./ExpertIntro";
import { Question } from "./Question";
import { Results } from "./Results";
import { History } from "./History";
import { QuickReport } from "./Report";
import { Arrow, Close } from "./ui";
import { createScenarioWorkspace } from "./scenario-model";
const Legacy = lazy(() => import("./Legacy"));
const ScenarioPage = lazy(() => import("./ScenarioPage"));
type Page = "home" | "check" | "history" | "archive";
type Preview =
  | { kind: "quick"; checks: QuickCheck[] }
  | { kind: "legacy"; cases: Assessment[] };
function download(filename: string, text: string) {
  const u = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = u;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}
function Method({
  onClose,
  version,
}: {
  onClose: () => void;
  version: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog ref={ref} onCancel={onClose} className="method-dialog">
      <button
        className="icon-button dialog-close"
        onClick={onClose}
        aria-label="Berechnung schließen"
      >
        <Close />
      </button>
      <p className="section-index">Transparente Berechnung</p>
      <h2>
        Eine klare Skala.
        <br />
        Ein nachvollziehbarer Score.
      </h2>
      <p>
        Sie bewerten zwölf Fragen von 1 bis 10. In jeder Frage bedeutet ein
        höherer Wert mehr Risiko. Die konkreten Anker stehen direkt an der
        Skala.
      </p>
      <div className="formula">100 × Summe(Antwort − 1) / 108</div>
      <p>
        Das gerundete Ergebnis liegt zwischen 0 und 100. Alle Fragen sind gleich
        gewichtet. Die vier Teilbereiche verwenden jeweils drei Antworten.
      </p>
      <div className="method-bands">
        <span>
          <b>0–24</b>Niedrig
        </span>
        <span>
          <b>25–49</b>Mittel
        </span>
        <span>
          <b>50–74</b>Erhöht
        </span>
        <span>
          <b>75–100</b>Hoch
        </span>
      </div>
      <p>
        Ein Gesamtscore erscheint erst nach zwölf numerischen Antworten.
        Unbekannte Antworten zählen nicht als niedrige Risiken. Einzelwerte von
        9 oder 10 werden unabhängig vom Durchschnitt hervorgehoben.
      </p>
      <p className="method-note">
        Eigene Beratungsheuristik auf Basis Ihrer Selbsteinschätzung. Die
        Grenzen sind methodische Orientierungswerte, keine empirisch kalibrierte
        Prognose oder Überlebenswahrscheinlichkeit.
      </p>
      <small>Methodenversion {version}</small>
    </dialog>
  );
}
function ImportDialog({
  preview,
  mode,
  onMode,
  onCancel,
  onConfirm,
  busy,
  existing,
}: {
  preview: Preview;
  mode: "copy" | "replace";
  onMode: (mode: "copy" | "replace") => void;
  onCancel: () => void;
  onConfirm: () => void;
  busy: boolean;
  existing: QuickCheck[];
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  const items = preview.kind === "quick" ? preview.checks : preview.cases;
  return (
    <dialog ref={ref} onCancel={onCancel} className="import-dialog">
      <button
        className="icon-button dialog-close"
        onClick={onCancel}
        aria-label="Import abbrechen"
        disabled={busy}
      >
        <Close />
      </button>
      <p className="section-index">Sicher übernehmen</p>
      <h2>Importvorschau</h2>
      <p>
        {items.length}{" "}
        {preview.kind === "quick" ? "Checks" : "frühere Analysen"} gefunden.
        {preview.kind === "legacy"
          ? " Die ursprüngliche Methodik bleibt erhalten; die Analysen erscheinen nur lesbar im Archiv."
          : ""}
      </p>
      <ul className="import-list">
        {items.map((item) => (
          <li key={item.id}>
            {"content" in item ? item.content.title : checkTitle(item)}
            {existing.some((c) => c.id === item.id) ? (
              <small>Bereits vorhanden</small>
            ) : null}
          </li>
        ))}
      </ul>
      <fieldset className="import-mode">
        <legend>Wie möchten Sie importieren?</legend>
        <label>
          <input
            type="radio"
            name="importMode"
            checked={mode === "copy"}
            onChange={() => onMode("copy")}
          />
          Als zusätzliche Kopien
        </label>
        <label>
          <input
            type="radio"
            name="importMode"
            checked={mode === "replace"}
            onChange={() => onMode("replace")}
          />
          Gleiche IDs ausdrücklich ersetzen
        </label>
      </fieldset>
      <div className="dialog-actions">
        <button className="button secondary" disabled={busy} onClick={onCancel}>
          Abbrechen
        </button>
        <button className="button primary" disabled={busy} onClick={onConfirm}>
          {busy ? "Übernehmen …" : "Import übernehmen"}
          <Arrow />
        </button>
      </div>
    </dialog>
  );
}
export default function QuickApp() {
  const [checks, setChecks] = useState<QuickCheck[]>([]),
    [ready, setReady] = useState(false),
    [writable, setWritable] = useState(true),
    [page, setPage] = useState<Page>("home"),
    [selected, setSelected] = useState<string | null>(null),
    [type, setType] = useState<QuickCheck["type"]>("existing"),
    [status, setStatus] = useState("Laden …"),
    [error, setError] = useState(""),
    [method, setMethod] = useState(false),
    [preview, setPreview] = useState<Preview | null>(null),
    [mode, setMode] = useState<"copy" | "replace">("copy"),
    [importing, setImporting] = useState(false),
    [archiveKey, setArchiveKey] = useState(0);
  const file = useRef<HTMLInputElement>(null),
    menu = useRef<HTMLDetailsElement>(null),
    saved = useRef<QuickCheck[] | null>(null),
    generation = useRef(0);
  const current = checks.find((c) => c.id === selected);
  const resume = [...checks]
    .filter(
      (c) =>
        !c.isExample &&
        (c.view === "intro" ||
          c.view === "questions" ||
          c.view === "scenarios"),
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  useEffect(() => {
    let active = true;
    loadChecks()
      .then((data) => {
        if (active) {
          saved.current = data;
          setChecks(data);
          setReady(true);
          setStatus("Lokal gespeichert");
        }
      })
      .catch((e) => {
        if (active) {
          setWritable(false);
          setReady(true);
          setStatus("Speicher nicht lesbar");
          setError(
            `${e instanceof Error ? e.message : String(e)} Vorhandene Daten werden nicht überschrieben. Neue Eingaben bleiben bis zur JSON-Sicherung nur in diesem Fenster.`,
          );
        }
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!ready || !writable || checks === saved.current) return;
    const g = ++generation.current;
    setStatus("Speichern …");
    const timer = setTimeout(() => {
      saveChecks(checks)
        .then(() => {
          if (g === generation.current) {
            saved.current = checks;
            setStatus("Lokal gespeichert");
          }
        })
        .catch((e) => {
          if (g === generation.current) {
            setStatus("Speicherfehler · JSON sichern");
            setError(e instanceof Error ? e.message : String(e));
          }
        });
    }, 180);
    return () => clearTimeout(timer);
  }, [checks, ready, writable]);
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (ready && checks !== saved.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [checks, ready]);
  const go = (p: Page) => {
    setPage(p);
    if (menu.current) menu.current.open = false;
    window.scrollTo(0, 0);
  };
  const open = (id: string) => {
    setSelected(id);
    go("check");
  };
  const update = (fn: (c: QuickCheck) => void) => {
    if (!current) return;
    setChecks((list) =>
      list.map((x) => {
        if (x.id !== current.id) return x;
        const c = structuredClone(x);
        fn(c);
        c.updatedAt = new Date().toISOString();
        return c;
      }),
    );
  };
  const onStep = (step: number) => {
    update((c) => {
      c.step = step;
      c.view = "questions";
    });
    window.scrollTo(0, 0);
  };
  const start = () => {
    const c = createCheck(type);
    setChecks((list) => [...list, c]);
    open(c.id);
  };
  const showExample = () => {
    const c = exampleCheck();
    setChecks((list) => [...list, c]);
    open(c.id);
  };
  const openScenarios = () => {
    if (current && page === "check") {
      update((c) => {
        c.schemaVersion = "1.1";
        c.scenarios ??= createScenarioWorkspace();
        c.view = "scenarios";
      });
      go("check");
    } else {
      const c = createCheck(type);
      c.scenarios = createScenarioWorkspace();
      c.view = "scenarios";
      setChecks((list) => [...list, c]);
      open(c.id);
    }
  };
  const exportAll = () => download("e23-Checks.json", serializeChecks(checks));
  const exportCurrent = () => {
    if (current) download("e23-Check.json", serializeChecks([current]));
  };
  const readFile = async (f: File) => {
    setPreview(null);
    setError("");
    try {
      if (f.size > 5 * 1024 * 1024)
        throw Error("Das Importlimit beträgt 5 MiB.");
      const text = await f.text();
      let raw;
      try {
        raw = JSON.parse(text);
      } catch {
        throw Error("Die Datei enthält kein gültiges JSON.");
      }
      if (
        raw &&
        typeof raw === "object" &&
        raw.format === "ai-resilience-check"
      ) {
        const { parseImport } = await import("../import-export/exchange");
        setPreview({ kind: "legacy", cases: parseImport(text).assessments });
      } else setPreview({ kind: "quick", checks: parseChecks(text) });
      setMode("copy");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };
  const confirmImport = async () => {
    if (!preview) return;
    setImporting(true);
    try {
      if (preview.kind === "quick") {
        setChecks((list) => mergeChecks(list, preview.checks, mode));
        go("history");
      } else {
        const [{ loadWorkspace, saveWorkspace }, { applyImport }] =
          await Promise.all([
            import("../storage/database"),
            import("../import-export/exchange"),
          ]);
        const existing = await loadWorkspace();
        await saveWorkspace(applyImport(existing, preview.cases, mode));
        setArchiveKey((v) => v + 1);
        go("archive");
      }
      setPreview(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setImporting(false);
    }
  };
  return (
    <div className="quick-app">
      <a className="skip-link" href="#quick-content">
        Zum Inhalt
      </a>
      <header className="site-header no-print">
        <button
          className="wordmark"
          onClick={() => go("home")}
          aria-label="e23 KI-Resilienz-Check, Startseite"
        >
          <strong>e23</strong>
          <span>KI-Resilienz-Check</span>
        </button>
        <nav className="header-actions" aria-label="Hauptnavigation">
          <span
            className={`save-indicator ${status.includes("fehler") || !writable ? "save-error" : ""}`}
            role="status"
            aria-live="polite"
          >
            {status}
          </span>
          <button className="history-link" onClick={() => go("history")}>
            Bisherige Checks
          </button>
          <details ref={menu} className="main-menu">
            <summary aria-label="Menü öffnen">
              <svg
                width="28"
                height="24"
                viewBox="0 0 28 24"
                aria-hidden="true"
              >
                <path
                  d="M1 4h26M1 12h26M1 20h26"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </summary>
            <div className="menu-panel">
              <button
                onClick={() => {
                  go("home");
                }}
              >
                Neuer Check
              </button>
              <button onClick={openScenarios}>Zukunftsszenarien testen</button>
              <button
                onClick={() => {
                  if (menu.current) menu.current.open = false;
                  file.current?.click();
                }}
              >
                JSON importieren
              </button>
              <button
                disabled={!checks.length}
                onClick={() => {
                  exportAll();
                  if (menu.current) menu.current.open = false;
                }}
              >
                Alle Checks als JSON sichern
              </button>
              <button
                onClick={() => {
                  setMethod(true);
                  if (menu.current) menu.current.open = false;
                }}
              >
                So wird der Score berechnet
              </button>
              <button onClick={() => go("archive")}>Frühere Analysen</button>
            </div>
          </details>
        </nav>
      </header>
      <div id="quick-content" className="quick-content">
        {page === "check" &&
          current?.methodologyVersion === "quick-check-1.0" && (
            <div className="method-version-note no-print">
              <span>
                Sie sehen einen früheren Check mit seinen ursprünglichen Fragen.
                Das neue Expertenteam-Gedankenexperiment beginnt mit einer
                eigenen Bewertung.
              </span>
              <button
                className="text-link"
                onClick={() => {
                  const c = createCheck(current.type);
                  setChecks((list) => [...list, c]);
                  open(c.id);
                }}
              >
                Neuen Expertenteam-Check starten
                <Arrow />
              </button>
            </div>
          )}
        {error && (
          <div className="error-banner no-print" role="alert">
            <strong>Bitte beachten</strong>
            <span>{error}</span>
            <button
              className="icon-button"
              onClick={() => setError("")}
              aria-label="Hinweis schließen"
            >
              <Close />
            </button>
            {checks.length > 0 && (
              <button className="text-link" onClick={exportAll}>
                JSON sichern
              </button>
            )}
          </div>
        )}
        {!ready ? (
          <main className="loading-state">
            Ihre lokalen Checks werden geladen …
          </main>
        ) : page === "home" ? (
          <main className="landing-page">
            <section className="landing-hero">
              <div className="landing-copy">
                <p className="section-index">
                  Eine neue Perspektive auf Ihr Geschäft
                </p>
                <h1>
                  Wie stark
                  <br />
                  ist
                  <br />
                  <span className="highlight-word">Ihr Geschäft?</span>
                </h1>
                <p className="landing-description">
                  Zehn Weltklasseexperten. Sechs Monate.
                  <br />
                  Was schützt Ihr Angebot?
                </p>
                <fieldset className="case-type">
                  <legend>Was möchten Sie einschätzen?</legend>
                  <label className={type === "existing" ? "active" : ""}>
                    <input
                      type="radio"
                      name="caseType"
                      checked={type === "existing"}
                      onChange={() => setType("existing")}
                    />
                    Bestehendes Angebot
                  </label>
                  <label className={type === "idea" ? "active" : ""}>
                    <input
                      type="radio"
                      name="caseType"
                      checked={type === "idea"}
                      onChange={() => setType("idea")}
                    />
                    Neue Idee
                  </label>
                </fieldset>
                <div className="landing-cta">
                  <button className="button dark" onClick={start}>
                    Check starten
                    <Arrow />
                  </button>
                  <button className="text-link" onClick={showExample}>
                    Beispiel ansehen
                    <Arrow />
                  </button>
                </div>
                <button
                  className="text-link scenario-direct-link"
                  onClick={openScenarios}
                >
                  Direkt Zukunftsszenarien testen
                  <Arrow />
                </button>
                {resume && (
                  <button
                    className="resume-link"
                    onClick={() => open(resume.id)}
                  >
                    {resume.view === "scenarios"
                      ? "Letzte Szenariosimulation fortsetzen"
                      : `Letzten Check fortsetzen · ${calculateRisk(resume).answered}/12`}
                    <Arrow />
                  </button>
                )}
                <p className="landing-privacy">
                  Keine Anmeldung. Ihre Antworten bleiben in diesem Browser.
                </p>
              </div>
              <div className="landing-graphic" aria-hidden="true">
                <div className="graphic-label">
                  Strategie beginnt
                  <br />
                  mit den richtigen Fragen.
                </div>
                <span className="graphic-number">
                  12<span>Fragen</span>
                </span>
                <div className="graphic-line" />
                <div className="graphic-range">
                  <span>
                    1<span>wenig Risiko</span>
                  </span>
                  <i />
                  <span>
                    10<span>viel Risiko</span>
                  </span>
                </div>
                <div className="graphic-caption">
                  Kundenwert · Wettbewerb
                  <br />
                  Differenzierung · Handlungsfähigkeit
                </div>
              </div>
            </section>
            <section className="landing-steps">
              <div>
                <span>01</span>
                <h2>Einschätzen</h2>
                <p>
                  Ein Expertenteam greift Ihr Angebot an. Zwölf konkrete Fragen.
                </p>
              </div>
              <div>
                <span>02</span>
                <h2>Risiken erkennen</h2>
                <p>Ihr Risikoprofil und die vier Bereiche, die es prägen.</p>
              </div>
              <div>
                <span>03</span>
                <h2>Nächste Schritte</h2>
                <p>
                  Mit konkreten Prioritäten an Ihrem Angebot weiterarbeiten.
                </p>
              </div>
            </section>
            <footer className="landing-footer">
              <span>e23 · KI-Resilienz-Check</span>
              <button className="text-link" onClick={() => setMethod(true)}>
                Methode und Berechnung
              </button>
              <button className="text-link" onClick={() => go("history")}>
                Gespeicherte Checks
              </button>
            </footer>
          </main>
        ) : page === "history" ? (
          <History
            checks={checks}
            onOpen={open}
            onStart={() => go("home")}
            onImport={() => file.current?.click()}
            onExport={exportAll}
            onArchive={() => go("archive")}
          />
        ) : page === "archive" ? (
          <Suspense
            fallback={
              <main className="loading-state">Archiv wird geöffnet …</main>
            }
          >
            <Legacy key={archiveKey} onBack={() => go("history")} />
          </Suspense>
        ) : current ? (
          <>
            {current.isExample && current.view === "questions" && (
              <div className="question-example no-print">
                Fiktives Beispiel · Sie bearbeiten synthetische Beispielangaben.
              </div>
            )}
            {current.view === "scenarios" && current.scenarios ? (
              <Suspense
                fallback={
                  <main className="loading-state">
                    Szenarien werden geöffnet …
                  </main>
                }
              >
                <ScenarioPage
                  workspace={current.scenarios}
                  onChange={(fn) =>
                    update((c) => {
                      if (c.scenarios) fn(c.scenarios);
                    })
                  }
                  onBack={() => {
                    update((c) => {
                      c.view =
                        calculateRisk(c).processed === 12
                          ? "results"
                          : calculateRisk(c).processed === 0 &&
                              c.methodologyVersion === QUICK_METHOD
                            ? "intro"
                            : "questions";
                    });
                    window.scrollTo(0, 0);
                  }}
                  onExport={exportCurrent}
                  onPrint={() => window.print()}
                />
              </Suspense>
            ) : current.view === "intro" ? (
              <ExpertIntro
                onStart={() => {
                  update((c) => {
                    c.view = "questions";
                  });
                  window.scrollTo(0, 0);
                }}
              />
            ) : current.view === "questions" ? (
              <Question
                key={`${current.id}:${current.step}`}
                check={current}
                onAnswer={(v: QuickAnswer) => {
                  update((c) => {
                    answerCheck(c, current.methodologySnapshot[c.step].id, v);
                  });
                }}
                onAdvance={() => {
                  update((c) => {
                    if (c.step === c.methodologySnapshot.length - 1)
                      c.view = "results";
                    else c.step += 1;
                  });
                  window.scrollTo(0, 0);
                }}
                onStep={onStep}
              />
            ) : (
              <Results
                key={current.id}
                check={current}
                onEdit={onStep}
                onMethod={() => setMethod(true)}
                onPrint={() => window.print()}
                onExport={exportCurrent}
                onScenarios={openScenarios}
              />
            )}
            <QuickReport check={current} />
          </>
        ) : null}
      </div>
      <input
        ref={file}
        type="file"
        hidden
        accept=".json,application/json"
        aria-label="JSON-Datei importieren"
        onChange={(e) => {
          const f = e.currentTarget.files?.[0];
          e.currentTarget.value = "";
          if (f) void readFile(f);
        }}
      />
      {method && (
        <Method
          version={
            page === "check" && current
              ? current.methodologyVersion
              : QUICK_METHOD
          }
          onClose={() => setMethod(false)}
        />
      )}{" "}
      {preview && (
        <ImportDialog
          preview={preview}
          existing={checks}
          mode={mode}
          onMode={setMode}
          onCancel={() => {
            if (!importing) setPreview(null);
          }}
          onConfirm={() => void confirmImport()}
          busy={importing}
        />
      )}
    </div>
  );
}
