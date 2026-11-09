import { useEffect, useRef, useState } from "react";
import type { QuickCheck } from "./model";
import { checkTitle } from "./model";
import {
  STRESS_SCENARIOS,
  STRESS_STATUS_LABELS,
  STRESS_BANDS,
  STRESS_PREMISE,
  evaluateStress,
  stressInputFor,
  stressInputKey,
  currentStressAnalysis,
  requestStressAnalysis,
  type StressAnalysis,
} from "./stress";
import { BusinessDescription } from "./BusinessDescription";
import { BusinessMoat } from "./BusinessMoat";
import { Arrow } from "./ui";

const CLAIM_LABELS = {
  replaceable: "Leicht ersetzbar",
  conditional: "Schützt nur unter Bedingungen",
  durable: "Bleibt auch für Spitzen-KI eine Hürde",
  unclear: "Noch nicht bewertbar",
};

export function StressIntro({ onStart }: { onStart: () => void }) {
  return (
    <main className="expert-scenario-intro results-page">
      <p className="section-index">Umgekehrter Stresstest</p>
      <h1>Welches Szenario bringt Ihr Geschäft um?</h1>
      <p className="expert-scenario-lead">
        Wir fragen nicht, wie wahrscheinlich es ist. Wir fragen, was dann
        bleibt.
      </p>
      <div className="stress-scenarios">
        {STRESS_SCENARIOS.map((scenario) => (
          <section className="stress-scenario" key={scenario.id}>
            <p className="stress-scenario-head">
              <span>Szenario {scenario.letter}</span>
              <span>{scenario.when}</span>
            </p>
            <h2>{scenario.title}</h2>
            <p>{scenario.text}</p>
          </section>
        ))}
      </div>
      <p className="expert-scenario-note">
        Was aus Intelligenz besteht, wird billig: Wissen, Software, Bedienung.
        Daten, Rechte, Anlagen und Kundenzugang werden es nicht automatisch.
      </p>
      <button className="button primary" onClick={onStart}>
        Stresstest starten <Arrow />
      </button>
    </main>
  );
}

export function StressContext({
  check,
  onDescriptionChange,
  onMoatChange,
  onContinue,
}: {
  check: QuickCheck;
  onDescriptionChange: (text: string) => void;
  onMoatChange: (text: string) => void;
  onContinue: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [dictating, setDictating] = useState(false);
  useEffect(() => heading.current?.focus({ preventScroll: true }), []);
  const described = Boolean(
    check.businessDescription?.trim() || check.businessMoat?.trim(),
  );
  return (
    <main className="business-context-page">
      <p className="section-index">Zwei Sätze genügen</p>
      <h1 ref={heading} tabIndex={-1}>
        Was verkaufen Sie? Und was schützt es?
      </h1>
      <BusinessDescription
        value={check.businessDescription ?? ""}
        onChange={onDescriptionChange}
        onBusyChange={setDictating}
      />
      <BusinessMoat value={check.businessMoat ?? ""} onChange={onMoatChange} />
      <p className="stress-note">
        Gesendet wird noch nichts. Danach folgen zehn kurze Fragen.
      </p>
      <div className="business-context-actions">
        <button
          className="button primary"
          onClick={onContinue}
          disabled={dictating}
        >
          {described ? "Weiter" : "Ohne Beschreibung weiter"} <Arrow />
        </button>
      </div>
    </main>
  );
}

export function StressAnalysisControl({
  check,
  onComplete,
  onEditContext,
}: {
  check: QuickCheck;
  onComplete: (analysis: StressAnalysis) => void;
  onEditContext: () => void;
}) {
  const input = stressInputFor(check);
  const key = input ? stressInputKey(input) : "";
  const currentKey = useRef(key);
  currentKey.current = key;
  const active = useRef<AbortController | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const fresh = currentStressAnalysis(check);
  useEffect(() => {
    active.current?.abort();
    active.current = null;
    setBusy(false);
    setMessage("");
    return () => {
      active.current?.abort();
      active.current = null;
    };
  }, [key]);
  const run = async () => {
    if (!input || active.current) return;
    const controller = new AbortController();
    active.current = controller;
    setMessage("");
    setBusy(true);
    const timeout = setTimeout(
      () => controller.abort(new DOMException("Timeout", "TimeoutError")),
      150_000,
    );
    try {
      const analysis = await requestStressAnalysis(input, {
        signal: controller.signal,
      });
      if (active.current === controller && currentKey.current === key)
        onComplete(analysis);
    } catch (error) {
      if (active.current === controller) {
        if (!controller.signal.aborted)
          setMessage(
            error instanceof Error
              ? error.message
              : "Die Auswertung hat nicht geklappt. Bitte erneut versuchen.",
          );
        else if (controller.signal.reason?.name === "TimeoutError")
          setMessage("Die Auswertung dauert zu lange. Bitte erneut versuchen.");
      }
    } finally {
      clearTimeout(timeout);
      if (active.current === controller) {
        active.current = null;
        setBusy(false);
      }
    }
  };
  if (fresh)
    return (
      <p className="stress-note stress-rerun">
        <button className="text-link" onClick={run} disabled={busy}>
          {busy ? "Nachruf wird neu geschrieben …" : "Nachruf neu schreiben"}
        </button>{" "}
        <span role="status" aria-live="polite">
          {message}
        </span>
      </p>
    );
  return (
    <section className="stress-attack" aria-label="Nachruf auf Ihr Geschäft">
      <p className="stress-attack-kicker">Der eigentliche Stresstest</p>
      <h2>Wie endet Ihr Geschäft? Lesen Sie den Nachruf.</h2>
      <p>
        Die KI spielt den Angriff auf genau Ihr Geschäft durch: wer Sie ersetzt,
        auf welchem Weg, was übrig bleibt und was Sie jetzt tun können.
      </p>
      {input ? (
        <>
          <div className="stress-attack-actions">
            <button
              className="stress-attack-button"
              onClick={run}
              disabled={busy}
            >
              {busy ? "Der Nachruf entsteht …" : "Nachruf schreiben lassen"}
              {!busy && <Arrow />}
            </button>
            {busy && (
              <button
                className="text-link"
                onClick={() => {
                  active.current?.abort();
                  active.current = null;
                  setBusy(false);
                }}
              >
                Abbrechen
              </button>
            )}
          </div>
          <p className="stress-attack-small">
            {check.stressAnalysis
              ? "Ihre Angaben haben sich geändert. Der frühere Nachruf gilt nicht mehr. "
              : ""}
            Auf Klick: Beschreibung, Schutz und zehn Antworten an OpenAI über
            Vercel senden. Dauer etwa 20 Sekunden.
          </p>
        </>
      ) : (
        <div className="stress-attack-actions">
          <button className="stress-attack-button" onClick={onEditContext}>
            Geschäft in zwei Sätzen beschreiben <Arrow />
          </button>
        </div>
      )}
      <p className="stress-attack-small" role="status" aria-live="polite">
        {message}
      </p>
    </section>
  );
}

export function StressScore({ check }: { check: QuickCheck }) {
  const r = evaluateStress(check);
  return (
    <div
      className={`stress-score band-${r.band?.id ?? "open"}`}
      aria-label="Resilienz-Score"
    >
      <p className="stress-score-label">Resilienz-Score</p>
      <p className="stress-score-value">
        <strong>{r.score ?? "–"}</strong>
        {r.score !== null && <span>/100</span>}
        <span className="stress-score-band">
          {r.band?.label ?? "Noch offen"}
        </span>
      </p>
      <div className="stress-score-track" aria-hidden="true">
        {STRESS_BANDS.map((band) => (
          <span key={band.id} className={`segment-${band.id}`} />
        ))}
        {r.score !== null && (
          <i style={{ left: `${Math.min(98, Math.max(2, r.score))}%` }} />
        )}
      </div>
      <p className="stress-score-caption">
        0 akut gefährdet · 100 robust · Einschätzung, keine Wahrscheinlichkeit
        {r.disputed ? " · von der KI nach unten korrigiert" : ""}
      </p>
    </div>
  );
}

function Recommendations({ check }: { check: QuickCheck }) {
  const r = evaluateStress(check);
  const { own, general } = r.recommendations;
  if (!own.length && !general.length) return null;
  return (
    <section className="stress-block stress-advice print-block">
      <h2>Was Sie jetzt tun können</h2>
      {own.length > 0 && (
        <ol>
          {own.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      )}
      {general.length > 0 && (
        <>
          {own.length > 0 && (
            <p className="stress-note">Grundsätzlich hilft außerdem:</p>
          )}
          <ul>
            {general.map((item) => (
              <li key={item.id}>
                <strong>{item.title}.</strong> {item.detail}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export function StressFindings({
  check,
  print = false,
}: {
  check: QuickCheck;
  print?: boolean;
}) {
  const r = evaluateStress(check);
  const ai = r.analysis?.result;
  const [copied, setCopied] = useState(false);
  return (
    <>
      {ai && (
        <section className="stress-block stress-obituary print-block">
          <h2>Nachruf</h2>
          <p>{ai.obituary}</p>
        </section>
      )}
      <div className="stress-scenarios" aria-label="Die drei Szenarien">
        {r.scenarios.map((scenario) => (
          <section
            className={`stress-scenario tone-${scenario.status} print-block`}
            key={scenario.id}
          >
            <p className="stress-scenario-head">
              <span>Szenario {scenario.letter}</span>
              <span>{scenario.when}</span>
            </p>
            <h3>{scenario.title}</h3>
            <span className={`stress-status status-${scenario.status}`}>
              {STRESS_STATUS_LABELS[scenario.status]}
              {scenario.status === "holds" && r.claimed
                ? " · laut Ihren Angaben"
                : ""}
            </span>
            <p>{scenario.reason}</p>
            {scenario.disputed && (
              <p className="stress-assumption">
                Die KI urteilt hier strenger als Ihre Antworten.
              </p>
            )}
          </section>
        ))}
      </div>
      {r.time && <p className="stress-note">{r.time}</p>}
      {ai && (
        <>
          <div className="stress-split">
            <section className="print-block">
              <h2>Aus Intelligenz gebaut · wird billig</h2>
              {ai.madeOfIntelligence.length ? (
                <ul>
                  {ai.madeOfIntelligence.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="stress-empty">Nichts Konkretes beschrieben.</p>
              )}
            </section>
            <section className="print-block">
              <h2>Nicht aus Intelligenz gebaut · kann bleiben</h2>
              {ai.notMadeOfIntelligence.length ? (
                <ul>
                  {ai.notMadeOfIntelligence.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="stress-empty">Nichts Konkretes beschrieben.</p>
              )}
            </section>
          </div>
          {ai.claim && (
            <section className="stress-block print-block">
              <h2>Ihr genannter Schutz: {CLAIM_LABELS[ai.claim.verdict]}</h2>
              <p>{ai.claim.reason}</p>
            </section>
          )}
          <section className="stress-block print-block">
            <h2>Wofür Kunden dann noch zahlen könnten</h2>
            <p>{ai.remains}</p>
          </section>
          {ai.doubts.map((doubt) => (
            <section
              className="stress-block stress-doubt print-block"
              key={doubt.questionId}
            >
              <h2>
                Rückfrage zu:{" "}
                {
                  check.methodologySnapshot.find(
                    (q) => q.id === doubt.questionId,
                  )?.text
                }
              </h2>
              <p>{doubt.reason}</p>
            </section>
          ))}
        </>
      )}
      <Recommendations check={check} />
      <section className="stress-block print-block">
        <h2>Test für Montag</h2>
        <p>{r.nextStep}</p>
        {ai && r.scenarios[0].status !== "open" && (
          <>
            <p className="stress-note">
              Geben Sie diesen Auftrag einem aktuellen KI-Agenten:
            </p>
            <p className="stress-brief">{ai.attackBrief}</p>
            {!print && (
              <button
                className="text-link"
                onClick={() => {
                  void navigator.clipboard
                    ?.writeText(ai.attackBrief)
                    .then(() => setCopied(true));
                }}
              >
                {copied ? "Kopiert" : "Auftrag kopieren"}
              </button>
            )}
          </>
        )}
        {ai?.openQuestion && (
          <p className="stress-note">Noch zu klären: {ai.openQuestion}</p>
        )}
      </section>
      <p className="stress-basis">
        Grundlage: {r.basis}. Die Szenarien sind Annahmen, keine Prognosen.
        {ai
          ? " Die KI-Einschätzung beruht nur auf Ihren Angaben und ist nicht extern geprüft."
          : ""}
      </p>
    </>
  );
}

const CTA_TEXT =
  "Die Frage ist nicht, ob Sie KI nutzen. Die Frage ist, wie Ihr Geschäft mehr von dem bekommt, was nicht aus einfach ersetzbarer Intelligenz besteht. Daran arbeiten wir mit Ihnen.";

// Appears once when the reader reaches the end of the result.
function StressCta() {
  const sentinel = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"waiting" | "open" | "closed">("waiting");
  useEffect(() => {
    const node = sentinel.current;
    if (!node || state !== "waiting" || !("IntersectionObserver" in window))
      return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) setState("open");
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [state]);
  useEffect(() => {
    if (state !== "open") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setState("closed");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state]);
  return (
    <>
      <div ref={sentinel} className="stress-cta-sentinel" aria-hidden="true" />
      {state === "open" && (
        <div
          className="stress-overlay no-print"
          onClick={() => setState("closed")}
        >
          <div
            className="stress-overlay-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="stress-cta-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="stress-cta-title">Und jetzt?</h2>
            <p>{CTA_TEXT}</p>
            <button
              className="button primary"
              autoFocus
              onClick={() => setState("closed")}
            >
              Verstanden <Arrow />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function StressResults({
  check,
  onEdit,
  onEditContext,
  onAnalysisChange,
  onMethod,
  onPrint,
  onExport,
}: {
  check: QuickCheck;
  onEdit: (step: number) => void;
  onEditContext: () => void;
  onAnalysisChange: (analysis: StressAnalysis) => void;
  onMethod: () => void;
  onPrint: () => void;
  onExport: () => void;
}) {
  const r = evaluateStress(check);
  const [answersOpen, setAnswersOpen] = useState(false);
  return (
    <main className="results-page provider-results stress-results">
      <header className="provider-result-intro">
        <p className="section-index">
          Ihr Stresstest · {r.answered}/{check.methodologySnapshot.length}{" "}
          beantwortet{check.isExample ? " · Beispiel" : ""}
        </p>
        <StressScore check={check} />
        <h1>{r.headline}</h1>
        {r.unknown.length > 0 && (
          <button
            className="button secondary"
            onClick={() =>
              onEdit(check.methodologySnapshot.indexOf(r.unknown[0]))
            }
          >
            {r.unknown.length} offene{" "}
            {r.unknown.length === 1 ? "Frage klären" : "Fragen klären"}
            <Arrow />
          </button>
        )}
      </header>
      <StressAnalysisControl
        check={check}
        onComplete={onAnalysisChange}
        onEditContext={onEditContext}
      />
      <StressFindings check={check} />
      <StressCta key={r.analysis ? "with" : "without"} />
      <footer className="provider-result-tools">
        <button className="button primary" onClick={onPrint}>
          Ergebnis als PDF <Arrow />
        </button>
        <button
          className="text-link"
          aria-expanded={answersOpen}
          aria-controls="stress-answer-list"
          onClick={() => setAnswersOpen((v) => !v)}
        >
          Antworten {answersOpen ? "ausblenden" : "ändern"}
        </button>
        <button className="text-link" onClick={onEditContext}>
          Beschreibung ändern
        </button>
        <button className="text-link" onClick={onMethod}>
          Annahmen und Regeln
        </button>
        <button className="text-link" onClick={onExport}>
          JSON sichern
        </button>
      </footer>
      {answersOpen && (
        <section
          className="provider-answer-list"
          id="stress-answer-list"
          aria-label="Antworten bearbeiten"
        >
          {check.methodologySnapshot.map((q, i) => (
            <button key={q.id} onClick={() => onEdit(i)}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <strong>{q.text}</strong>
              <span>{answerText(check, q.id)}</span>
              <Arrow />
            </button>
          ))}
        </section>
      )}
    </main>
  );
}

function answerText(check: QuickCheck, id: string) {
  const q = check.methodologySnapshot.find((q) => q.id === id)!;
  const value = check.answers[id];
  return typeof value === "number"
    ? (q.options?.[value - 1] ?? String(value))
    : value === "unknown"
      ? "Weiß ich nicht"
      : "Offen";
}

export function StressMethodContent() {
  return (
    <>
      <p className="section-index">Annahmen und Regeln</p>
      <h2>Ein umgekehrter Stresstest.</h2>
      <p>
        Banken fragen im umgekehrten Stresstest nicht, wie wahrscheinlich eine
        Krise ist, sondern welche sie nicht überstehen. Dieser Test stellt
        dieselbe Frage für Ihr Geschäft. {STRESS_PREMISE}
      </p>
      {STRESS_SCENARIOS.map((scenario) => (
        <p key={scenario.id}>
          <strong>
            {scenario.letter} · {scenario.title} ({scenario.when}).
          </strong>{" "}
          {scenario.text}
        </p>
      ))}
      <p>
        <strong>Regeln ohne KI.</strong> Ein rein digitales Ergebnis ohne
        eigenen Beitrag außerhalb der Intelligenz kippt in B und C. Kann heutige
        KI den Auftrag schon, kippt es bereits in A. Als Beitrag zählen
        exklusive Daten, Rechte und Haftung, persönliche Beziehungen und ein
        Netzwerk. Was nur Sie haben, trägt; ohne Kaufbeleg steht dabei „laut
        Ihren Angaben“. C hat dasselbe Ergebnis wie B; es bleibt nur weniger
        Zeit.
      </p>
      <p>
        <strong>Mit KI.</strong> Die KI liest Ihre Beschreibung und urteilt je
        Szenario selbst. Es gilt immer das strengere Urteil. Eine
        unverständliche Beschreibung macht das Ergebnis offen.
      </p>
      <p>
        <strong>Resilienz-Score.</strong> Jede Antwort zählt 0, halb oder voll
        mit ihrem Gewicht: Ergebnis und eigene Daten je 15, heutige KI,
        Bedienung, Rechte, Beziehung, Netzwerk und Kundenzugang je 10, Wechsel
        und Kaufbeleg je 5. Die Summe wird in den Bereich gelegt, der zum
        Szenario-Urteil passt: kippt in A 0–20, kippt in B 15–35, Druck in A
        25–55, Druck in B 40–65, trägt laut Angaben 60–80, trägt 65–100. Unter
        35 rot, bis 64 gelb, ab 65 grün.
      </p>
      <p className="method-note">
        Die Szenarien sind gesetzte Annahmen, keine Prognosen. Der Score ist
        eine offengelegte Einschätzung, keine Wahrscheinlichkeit. Ihre Antworten
        sind Selbstauskünfte. Hintergrund: Richard Sutton, The Bitter Lesson.
      </p>
    </>
  );
}

export function StressReport({ check }: { check: QuickCheck }) {
  const r = evaluateStress(check);
  return (
    <article className="quick-print-report provider-print-report">
      <header className="print-brand">
        <strong>e23</strong>
        <span>Resilience-Assessment · Stresstest</span>
      </header>
      <p className="print-context">
        {checkTitle(check)}
        {check.isExample ? " · Fiktives Beispiel" : ""}
      </p>
      <StressScore check={check} />
      <h1>{r.headline}</h1>
      {check.stressAnalysis && !r.analysis && (
        <p>
          Die frühere KI-Auswertung ist nicht mehr aktuell und hier nicht
          enthalten.
        </p>
      )}
      {check.businessDescription?.trim() && (
        <section className="print-block">
          <h2>Ihr Geschäft</h2>
          <p>{check.businessDescription}</p>
        </section>
      )}
      {check.businessMoat?.trim() && (
        <section className="print-block">
          <h2>Ihr genannter Schutz</h2>
          <p>{check.businessMoat}</p>
        </section>
      )}
      <StressFindings check={check} print />
      <section className="print-block">
        <h2>Und jetzt?</h2>
        <p>{CTA_TEXT}</p>
      </section>
      <section className="print-block">
        <h2>Ihre Antworten</h2>
        {check.methodologySnapshot.map((q) => (
          <p key={q.id}>
            <strong>{q.text}</strong> {answerText(check, q.id)}
          </p>
        ))}
      </section>
      <section className="print-block">
        <StressMethodContent />
        <p>
          Methode {check.methodologyVersion} · Check-ID: {check.id} · Stand:{" "}
          {new Intl.DateTimeFormat("de-DE", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Europe/Berlin",
          }).format(new Date(check.updatedAt))}
        </p>
      </section>
    </article>
  );
}
