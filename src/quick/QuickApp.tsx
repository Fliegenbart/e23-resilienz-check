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
  createStressCheck,
  stressExampleCheck,
  CURRENT_METHOD,
  checkTitle,
} from "./model";
import { isStressMethod, stressAnalysisMatches } from "./stress";
import {
  StressIntro,
  StressContext,
  StressResults,
  StressMethodContent,
} from "./StressViews";
import { loadChecks, saveChecks } from "./storage";
import { ExpertIntro } from "./ExpertIntro";
import { Question } from "./Question";
import { Results } from "./Results";
import { isProviderMethod, isExpertMethod } from "./provider-questions";
import { ExpertScenarioIntro } from "./ExpertScenarioIntro";
import { ProviderLanding } from "./ProviderLanding";
import { BusinessContext } from "./BusinessContext";
import { ProviderResults } from "./ProviderResults";
import { ProviderMethodContent } from "./ProviderMethod";
import { analysisMatches } from "./business-analysis";
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
        aria-label="Grundlagen schließen"
      >
        <Close />
      </button>
      {isStressMethod(version) ? (
        <StressMethodContent />
      ) : isProviderMethod(version) ? (
        <ProviderMethodContent version={version} />
      ) : (
        <>
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
            Das gerundete Ergebnis liegt zwischen 0 und 100. Alle Fragen sind
            gleich gewichtet. Die vier Teilbereiche verwenden jeweils drei
            Antworten.
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
            Unbekannte Antworten zählen nicht als niedrige Risiken. Einzelwerte
            von 9 oder 10 werden unabhängig vom Durchschnitt hervorgehoben.
          </p>
          <p className="method-note">
            Eigene Beratungsheuristik auf Basis Ihrer Selbsteinschätzung. Die
            Grenzen sind methodische Orientierungswerte, keine empirisch
            kalibrierte Prognose oder Überlebenswahrscheinlichkeit.
          </p>
        </>
      )}
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
        (isProviderMethod(c.methodologyVersion) ||
          isStressMethod(c.methodologyVersion)) &&
        (c.view === "intro" ||
          c.view === "questions" ||
          c.view === "context" ||
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
    const c = createStressCheck();
    setChecks((list) => [...list, c]);
    open(c.id);
  };
  const showExample = () => {
    const c = stressExampleCheck();
    setChecks((list) => [...list, c]);
    open(c.id);
  };
  const openScenarios = () => {
    if (
      current &&
      page === "check" &&
      !isProviderMethod(current.methodologyVersion) &&
      !isStressMethod(current.methodologyVersion)
    ) {
      update((c) => {
        c.schemaVersion = "1.1";
        c.scenarios ??= createScenarioWorkspace();
        c.view = "scenarios";
      });
      go("check");
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
          aria-label="e23 Resilience-Assessment, Startseite"
        >
          <strong>e23</strong>
          <span>Resilience-Assessment</span>
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
                Neues Assessment
              </button>
              {page === "check" &&
                current &&
                !isProviderMethod(current.methodologyVersion) &&
                !isStressMethod(current.methodologyVersion) && (
                  <button onClick={openScenarios}>
                    Frühere Zukunftsszenarien
                  </button>
                )}
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
                Annahmen und Quellen
              </button>
              <button onClick={() => go("archive")}>Frühere Analysen</button>
            </div>
          </details>
        </nav>
      </header>
      <div id="quick-content" className="quick-content">
        {page === "check" &&
          current &&
          current.methodologyVersion !== CURRENT_METHOD && (
            <div className="method-version-note no-print">
              <span>
                Früherer Check. Fragen und Auswertung bleiben unverändert.
              </span>
              <button
                className="text-link"
                onClick={() => {
                  const c = createStressCheck();
                  if (current.businessDescription)
                    c.businessDescription = current.businessDescription;
                  if (current.businessMoat)
                    c.businessMoat = current.businessMoat;
                  setChecks((list) => [...list, c]);
                  open(c.id);
                }}
              >
                Neues Assessment starten
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
          <ProviderLanding
            onStart={start}
            onExample={showExample}
            resume={resume}
            onResume={() => resume && open(resume.id)}
            onMethod={() => setMethod(true)}
          />
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
                              c.methodologyVersion === "quick-check-2.0"
                            ? "intro"
                            : "questions";
                    });
                    window.scrollTo(0, 0);
                  }}
                  onExport={exportCurrent}
                  onPrint={() => window.print()}
                />
              </Suspense>
            ) : isStressMethod(current.methodologyVersion) &&
              current.view === "intro" ? (
              <StressIntro
                onStart={() => {
                  update((c) => {
                    c.view = "context";
                  });
                  window.scrollTo(0, 0);
                }}
              />
            ) : isStressMethod(current.methodologyVersion) &&
              current.view === "context" ? (
              <StressContext
                key={current.id}
                check={current}
                onDescriptionChange={(text) =>
                  update((c) => {
                    c.businessDescription = text;
                  })
                }
                onMoatChange={(text) =>
                  update((c) => {
                    c.businessMoat = text;
                  })
                }
                onContinue={() => {
                  update((c) => {
                    const open = c.methodologySnapshot.findIndex(
                      (q) => c.answers[q.id] == null,
                    );
                    c.view = open < 0 ? "results" : "questions";
                    if (open >= 0) c.step = open;
                  });
                  window.scrollTo(0, 0);
                }}
              />
            ) : isStressMethod(current.methodologyVersion) &&
              current.view === "results" ? (
              <StressResults
                key={current.id}
                check={current}
                onEditContext={() => {
                  update((c) => {
                    c.view = "context";
                  });
                  window.scrollTo(0, 0);
                }}
                onAnalysisChange={(analysis) =>
                  update((c) => {
                    if (stressAnalysisMatches(c, analysis))
                      c.stressAnalysis = analysis;
                  })
                }
                onEdit={onStep}
                onMethod={() => setMethod(true)}
                onPrint={() => window.print()}
                onExport={exportCurrent}
              />
            ) : current.view === "intro" &&
              isExpertMethod(current.methodologyVersion) ? (
              <ExpertScenarioIntro
                withSupplier={current.methodologyVersion === "quick-check-7.0"}
                onStart={() => {
                  update((c) => {
                    c.view = "questions";
                  });
                  window.scrollTo(0, 0);
                }}
              />
            ) : current.view === "intro" &&
              !isProviderMethod(current.methodologyVersion) ? (
              <ExpertIntro
                onStart={() => {
                  update((c) => {
                    c.view = "questions";
                  });
                  window.scrollTo(0, 0);
                }}
              />
            ) : current.view === "context" ? (
              <BusinessContext
                key={current.id}
                check={current}
                onDescriptionChange={(text) =>
                  update((c) => {
                    c.businessDescription = text;
                  })
                }
                onMoatChange={(text) =>
                  update((c) => {
                    c.businessMoat = text;
                  })
                }
                onAnalysisComplete={(analysis) => {
                  update((c) => {
                    if (analysisMatches(c, analysis)) {
                      c.businessAnalysis = analysis;
                      c.view = "results";
                    }
                  });
                  window.scrollTo(0, 0);
                }}
                onContinue={() => {
                  update((c) => {
                    c.view = "results";
                  });
                  window.scrollTo(0, 0);
                }}
                onBack={() => onStep(current.methodologySnapshot.length - 1)}
              />
            ) : current.view === "questions" || current.view === "intro" ? (
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
                    if (
                      c.step === c.methodologySnapshot.length - 1 ||
                      ((isProviderMethod(c.methodologyVersion) ||
                        isStressMethod(c.methodologyVersion)) &&
                        calculateRisk(c).processed ===
                          c.methodologySnapshot.length)
                    )
                      c.view =
                        c.methodologyVersion === "quick-check-7.0"
                          ? "context"
                          : "results";
                    else c.step += 1;
                  });
                  window.scrollTo(0, 0);
                }}
                onStep={onStep}
              />
            ) : isProviderMethod(current.methodologyVersion) ? (
              <ProviderResults
                key={current.id}
                check={current}
                onDescriptionChange={(text) =>
                  update((c) => {
                    c.businessDescription = text;
                  })
                }
                onMoatChange={(text) =>
                  update((c) => {
                    c.businessMoat = text;
                  })
                }
                onAnalysisChange={(analysis) =>
                  update((c) => {
                    if (analysisMatches(c, analysis))
                      c.businessAnalysis = analysis;
                  })
                }
                onScenarioChange={(settings) =>
                  update((c) => {
                    c.schemaVersion = "1.1";
                    c.providerScenario = settings;
                  })
                }
                onEdit={onStep}
                onMethod={() => setMethod(true)}
                onPrint={() => window.print()}
                onExport={exportCurrent}
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
              : CURRENT_METHOD
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
