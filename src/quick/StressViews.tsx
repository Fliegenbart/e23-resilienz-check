import { useEffect, useRef, useState } from "react";
import type { QuickCheck } from "./model";
import { checkTitle } from "./model";
import {
  STRESS_SCENARIOS,
  STRESS_STATUS_LABELS,
  STRESS_PREMISE,
  evaluateStress,
  stressInputFor,
  stressInputKey,
  currentStressAnalysis,
  requestStressAnalysis,
  type StressAnalysis,
  type StressStatus,
  type StressEvaluation,
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

type Verdict = { status: StressStatus; claimed?: boolean };

// The signature image: a load curve. It holds, yields or fractures.
export function StressCurve({
  today,
  expert,
  blank = false,
}: {
  today?: Verdict;
  expert?: Verdict;
  blank?: boolean;
}) {
  const X = [90, 500, 910];
  const Y = { top: 70, mid: 185, base: 300 };
  const level = (status: StressStatus, previous: number) =>
    status === "holds"
      ? Y.top
      : status === "pressure"
        ? Y.mid
        : status === "breaks"
          ? Y.base
          : previous;
  const points: { x: number; y: number; verdict: Verdict }[] = [];
  let y = Y.top;
  let broken = false;
  for (const [index, verdict] of [today, expert].entries()) {
    if (!verdict || broken) break;
    y = level(verdict.status, y);
    points.push({ x: X[index + 1], y, verdict });
    broken = verdict.status === "breaks";
  }
  const segment = (
    from: { x: number; y: number },
    to: { x: number; y: number; verdict: Verdict },
  ) =>
    to.verdict.status === "breaks"
      ? `M${from.x},${from.y} L${to.x - 90},${from.y} C${to.x - 30},${from.y} ${to.x - 8},${from.y + 40} ${to.x},${to.y}`
      : `M${from.x},${from.y} C${from.x + 200},${from.y} ${to.x - 200},${to.y} ${to.x},${to.y}`;
  const origin = { x: X[0], y: Y.top };
  return (
    <svg
      className="curve"
      viewBox="0 0 1000 350"
      role="img"
      aria-label={
        blank
          ? "Belastungskurve: von heute über Szenario A zu Szenario B"
          : `Belastungskurve: Szenario A ${today ? STRESS_STATUS_LABELS[today.status] : "offen"}, Szenario B ${expert ? STRESS_STATUS_LABELS[expert.status] : "offen"}`
      }
    >
      {Array.from({ length: 10 }, (_, i) => (
        <line
          key={`v${i}`}
          className="curve-grid"
          x1={X[0] + i * 91.1}
          x2={X[0] + i * 91.1}
          y1={40}
          y2={Y.base}
        />
      ))}
      {[Y.top, Y.mid].map((line) => (
        <line
          key={line}
          className="curve-grid"
          x1={X[0]}
          x2={X[2]}
          y1={line}
          y2={line}
        />
      ))}
      <line
        className="curve-axis"
        x1={X[0]}
        x2={X[2] + 30}
        y1={Y.base}
        y2={Y.base}
      />
      <line className="curve-axis" x1={X[0]} x2={X[0]} y1={40} y2={Y.base} />
      <text className="curve-label" x={X[0] + 12} y={34}>
        Wofür Kunden Ihnen zahlen
      </text>
      {["Heute", "A", "B"].map((label, i) => (
        <g key={label}>
          <line
            className="curve-tick"
            x1={X[i]}
            x2={X[i]}
            y1={Y.base}
            y2={Y.base + 10}
          />
          <text
            className={i ? "curve-letter" : "curve-label"}
            x={X[i]}
            y={Y.base + 38}
            textAnchor="middle"
          >
            {label}
          </text>
        </g>
      ))}
      {blank && (
        // Before the test: the three ways the curve can run.
        <g className="curve-legend">
          <path
            className="curve-line legend-holds"
            d={`M${X[0]},${Y.top} L${X[2]},${Y.top}`}
          />
          <path
            className="curve-line legend-pressure"
            d={`M${X[0]},${Y.top} L${X[1] + 60},${Y.top} C${X[1] + 200},${Y.top} ${X[1] + 220},${Y.mid} ${X[2]},${Y.mid}`}
          />
          <path
            className="curve-line legend-breaks"
            d={`M${X[0]},${Y.top} L${X[1] - 90},${Y.top} C${X[1] - 30},${Y.top} ${X[1] - 8},${Y.top + 40} ${X[1]},${Y.base}`}
          />
          <g className="curve-break legend-mark">
            <line
              x1={X[1] - 14}
              x2={X[1] + 14}
              y1={Y.base - 14}
              y2={Y.base + 14}
            />
            <line
              x1={X[1] - 14}
              x2={X[1] + 14}
              y1={Y.base + 14}
              y2={Y.base - 14}
            />
          </g>
          <text
            className="legend-text"
            x={X[2] - 8}
            y={Y.top - 14}
            textAnchor="end"
          >
            Trägt
          </text>
          <text
            className="legend-text"
            x={X[2] - 8}
            y={Y.mid + 32}
            textAnchor="end"
          >
            Unter Druck
          </text>
          <text className="legend-text" x={X[1] + 26} y={Y.base - 18}>
            Kippt
          </text>
        </g>
      )}
      {points.map((point, i) => {
        const from = i ? points[i - 1] : origin;
        const style =
          point.verdict.status === "open"
            ? "curve-open"
            : point.verdict.claimed
              ? "curve-claimed"
              : "curve-solid";
        return (
          <path
            key={i}
            className={`curve-line ${style}`}
            d={segment(from, point)}
            pathLength={style === "curve-solid" ? 1 : undefined}
            style={
              style === "curve-solid"
                ? { animationDelay: `${i * 0.9}s` }
                : undefined
            }
          />
        );
      })}
      <circle className="curve-dot" cx={origin.x} cy={origin.y} r={9} />
      {points.map((point, i) =>
        point.verdict.status === "breaks" ? (
          <g
            key={i}
            className="curve-break"
            style={{ animationDelay: `${i * 0.9 + 0.8}s` }}
          >
            <line
              x1={point.x - 16}
              x2={point.x + 16}
              y1={point.y - 16}
              y2={point.y + 16}
            />
            <line
              x1={point.x - 16}
              x2={point.x + 16}
              y1={point.y + 16}
              y2={point.y - 16}
            />
          </g>
        ) : (
          <circle
            key={i}
            className={`curve-dot dot-${point.verdict.status}`}
            cx={point.x}
            cy={point.y}
            r={11}
          />
        ),
      )}
    </svg>
  );
}

function ScenarioColumns({
  items,
}: {
  items: {
    letter: string;
    title: string;
    when: string;
    text: string;
    status?: StressStatus;
    tag?: string;
    note?: string;
  }[];
}) {
  return (
    <div className="scenario-columns">
      {items.map((item) => (
        <section key={item.letter}>
          {item.status && (
            <span className={`state state-${item.status}`}>{item.tag}</span>
          )}
          <h2>
            <span className="scenario-letter">{item.letter}</span> {item.title}
          </h2>
          <p className="scenario-when">{item.when}</p>
          <p>{item.text}</p>
          {item.note && <p className="scenario-note">{item.note}</p>}
        </section>
      ))}
    </div>
  );
}

export function StressIntro({ onStart }: { onStart: () => void }) {
  const [a, b, c] = STRESS_SCENARIOS;
  return (
    <main className="stress-page stress-intro">
      <div className="intro-text">
        <h1>Welches Szenario bringt Ihr Geschäft um?</h1>
        <p className="principle">
          Was aus Intelligenz besteht, wird billig: Wissen, Software, Bedienung.
        </p>
        <p className="principle principle-stays">
          Daten, Rechte, Anlagen und Kundenzugang werden es nicht automatisch.
        </p>
        <button className="go" onClick={onStart}>
          Stresstest starten
        </button>
      </div>
      <div className="intro-chart">
        <div className="curve-block">
          <StressCurve blank />
          <ScenarioColumns items={[a, b]} />
        </div>
        <p className="aside">
          Szenario C ist dasselbe in sechs Monaten: wie B, nur schneller. Zum
          Umbauen bleibt kaum Zeit.
        </p>
      </div>
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
    <main className="stress-page stress-context">
      <h1 ref={heading} tabIndex={-1}>
        Was verkaufen Sie? Und was schützt es?
      </h1>
      <p className="lede">
        Zwei Sätze genügen. Gesendet wird noch nichts; danach folgen zehn kurze
        Fragen.
      </p>
      <BusinessDescription
        value={check.businessDescription ?? ""}
        onChange={onDescriptionChange}
        onBusyChange={setDictating}
      />
      <BusinessMoat value={check.businessMoat ?? ""} onChange={onMoatChange} />
      <button className="go" onClick={onContinue} disabled={dictating}>
        {described ? "Weiter zu den Fragen" : "Ohne Beschreibung weiter"}
      </button>
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
      <p className="rerun">
        <button className="quiet" onClick={run} disabled={busy}>
          {busy ? "Nachruf wird neu geschrieben …" : "Nachruf neu schreiben"}
        </button>{" "}
        <span role="status" aria-live="polite">
          {message}
        </span>
      </p>
    );
  return (
    <section className="obituary-call" aria-label="Nachruf auf Ihr Geschäft">
      <h2>Wie endet Ihr Geschäft?</h2>
      <p>
        Die KI spielt den Angriff auf genau Ihr Geschäft durch: wer Sie ersetzt,
        auf welchem Weg, was übrig bleibt und was Sie jetzt tun können.
      </p>
      {input ? (
        <>
          <button className="go go-large" onClick={run} disabled={busy}>
            {busy ? "Der Nachruf entsteht …" : "Nachruf schreiben lassen"}
          </button>
          {busy && (
            <button
              className="quiet"
              onClick={() => {
                active.current?.abort();
                active.current = null;
                setBusy(false);
              }}
            >
              Abbrechen
            </button>
          )}
          <p className="small">
            {check.stressAnalysis
              ? "Ihre Angaben haben sich geändert. Der frühere Nachruf gilt nicht mehr. "
              : ""}
            Auf Klick gehen Beschreibung, Schutz und zehn Antworten an OpenAI
            über Vercel. Das dauert etwa 20 Sekunden.
          </p>
        </>
      ) : (
        <button className="go go-large" onClick={onEditContext}>
          Geschäft in zwei Sätzen beschreiben
        </button>
      )}
      <p className="small" role="status" aria-live="polite">
        {message}
      </p>
    </section>
  );
}

export function StressScore({ check }: { check: QuickCheck }) {
  const r = evaluateStress(check);
  return (
    <div
      className={`score band-${r.band?.id ?? "open"}`}
      aria-label="Resilienz-Score"
    >
      <p className="score-number">{r.score ?? "–"}</p>
      <p className="score-meta">
        <span className="score-band">{r.band?.label ?? "Noch offen"}</span>
        <span>
          Resilienz-Score von 100
          {r.disputed ? ", von der KI nach unten korrigiert" : ""}
        </span>
      </p>
    </div>
  );
}

const CTA_TEXT =
  "Die Frage ist nicht, ob Sie KI nutzen. Die Frage ist, wie Ihr Geschäft mehr von dem bekommt, was nicht aus einfach ersetzbarer Intelligenz besteht. Daran arbeiten wir mit Ihnen.";

// Which scenario is arriving? Observable signs, not forecasts.
const SIGNS = [
  {
    letter: "A",
    text: "Offene Modelle erreichen das Niveau der besten, ohne dass die besten spürbar klüger werden.",
  },
  {
    letter: "B",
    text: "Nicht nur ein Labor, sondern mehrere zeigen denselben Sprung. KI beschleunigt nachweislich die KI-Forschung.",
  },
  {
    letter: "C",
    text: "Die Abstände zwischen deutlich besseren Modellen schrumpfen von Monaten auf Wochen.",
  },
];
function Signs() {
  return (
    <section className="signs">
      <h3>Woran Sie erkennen, welches Szenario eintritt</h3>
      <ul>
        {SIGNS.map((sign) => (
          <li key={sign.letter}>
            <span className="scenario-letter">{sign.letter}</span>
            {sign.text}
          </li>
        ))}
        <li>
          <span className="scenario-letter">!</span>
          Für Ihr Geschäft: Ein Agent erledigt den Testauftrag von Montag ohne
          Nacharbeit.
        </li>
      </ul>
    </section>
  );
}

const verdictOf = (r: StressEvaluation, index: number): Verdict => ({
  status: r.scenarios[index].status,
  claimed: r.scenarios[index].status === "holds" && r.claimed,
});

function Verdicts({ check }: { check: QuickCheck }) {
  const r = evaluateStress(check);
  const [a, b] = r.scenarios;
  const tag = (index: number) =>
    STRESS_STATUS_LABELS[r.scenarios[index].status] +
    (verdictOf(r, index).claimed ? ", laut Ihren Angaben" : "");
  return (
    <>
      <div className="curve-block">
        <StressCurve today={verdictOf(r, 0)} expert={verdictOf(r, 1)} />
        <ScenarioColumns
          items={[a, b].map((scenario, index) => ({
            letter: scenario.letter,
            title: scenario.title,
            when: scenario.when,
            text: scenario.reason,
            status: scenario.status,
            tag: tag(index),
            note: scenario.disputed
              ? "Die KI urteilt hier strenger als Ihre Antworten."
              : undefined,
          }))}
        />
      </div>
      <p className="aside">
        Szenario C, dasselbe schon in sechs Monaten: {r.scenarios[2].reason}
        {r.time ? ` ${r.time}` : ""}
      </p>
    </>
  );
}

function Remains({ check }: { check: QuickCheck }) {
  const r = evaluateStress(check);
  const ai = r.analysis?.result;
  if (!ai) return null;
  return (
    <>
      <div className="ledger">
        <section>
          <h2>Aus Intelligenz gebaut</h2>
          <p className="ledger-fate">Das wird billig.</p>
          {ai.madeOfIntelligence.length ? (
            <ul className="ledger-gone">
              {ai.madeOfIntelligence.map((item, i) => (
                <li key={i}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="small">Nichts Konkretes beschrieben.</p>
          )}
        </section>
        <section>
          <h2>Nicht aus Intelligenz gebaut</h2>
          <p className="ledger-fate">Das kann bleiben.</p>
          {ai.notMadeOfIntelligence.length ? (
            <ul className="ledger-stays">
              {ai.notMadeOfIntelligence.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="ledger-empty">Hier steht noch nichts.</p>
          )}
        </section>
      </div>
      <div className="facts">
        {ai.claim && (
          <section>
            <h3>Ihr genannter Schutz: {CLAIM_LABELS[ai.claim.verdict]}</h3>
            <p>{ai.claim.reason}</p>
          </section>
        )}
        <section>
          <h3>Wofür Kunden dann noch zahlen könnten</h3>
          <p>{ai.remains}</p>
        </section>
        {ai.doubts.map((doubt) => (
          <section className="doubt" key={doubt.questionId}>
            <h3>
              Rückfrage zu:{" "}
              {
                check.methodologySnapshot.find((q) => q.id === doubt.questionId)
                  ?.text
              }
            </h3>
            <p>{doubt.reason}</p>
          </section>
        ))}
      </div>
    </>
  );
}

function Actions({
  check,
  print = false,
}: {
  check: QuickCheck;
  print?: boolean;
}) {
  const r = evaluateStress(check);
  const ai = r.analysis?.result;
  const { own, general } = r.recommendations;
  const [copied, setCopied] = useState(false);
  return (
    <>
      {own.length > 0 && (
        <ol className="advice">
          {own.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      )}
      {general.length > 0 && (
        <>
          {own.length > 0 && <h3>Grundsätzlich hilft außerdem</h3>}
          <ul className={own.length ? "advice-general" : "advice advice-plain"}>
            {general.map((item) => (
              <li key={item.id}>
                <strong>{item.title}.</strong> {item.detail}
              </li>
            ))}
          </ul>
        </>
      )}
      <section className="monday">
        <h3>Test für Montag</h3>
        <p>{r.nextStep}</p>
        {ai && r.scenarios[0].status !== "open" && (
          <>
            <p className="small">
              Geben Sie diesen Auftrag einem aktuellen KI-Agenten:
            </p>
            <p className="brief">{ai.attackBrief}</p>
            {!print && (
              <button
                className="quiet"
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
          <p className="small">Noch zu klären: {ai.openQuestion}</p>
        )}
      </section>
    </>
  );
}

// Linear version for the printed report.
export function StressFindings({ check }: { check: QuickCheck }) {
  const r = evaluateStress(check);
  const ai = r.analysis?.result;
  return (
    <>
      <Verdicts check={check} />
      {ai && (
        <section className="print-block">
          <h2>Nachruf</h2>
          <p className="obituary-text">{ai.obituary}</p>
        </section>
      )}
      <section className="print-block">
        <Remains check={check} />
      </section>
      <section className="print-block">
        <h2>Was Sie jetzt tun können</h2>
        <Actions check={check} print />
      </section>
      <section className="print-block">
        <Signs />
      </section>
      <p className="small">
        Grundlage: {r.basis}. Die Szenarien sind Annahmen, keine Prognosen.
      </p>
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
  const ai = r.analysis?.result;
  const steps = [
    { id: "verdict", label: "Urteil" },
    { id: "obituary", label: "Nachruf" },
    ...(ai ? [{ id: "remains", label: "Was bleibt" }] : []),
    { id: "actions", label: "Was tun" },
    { id: "next", label: "Und jetzt" },
  ];
  const [stepId, setStepId] = useState("verdict");
  const [answersOpen, setAnswersOpen] = useState(false);
  const index = Math.max(
    0,
    steps.findIndex((step) => step.id === stepId),
  );
  const heading = useRef<HTMLHeadingElement>(null);
  const go = (target: number) => {
    const next = steps[Math.min(steps.length - 1, Math.max(0, target))];
    setStepId(next.id);
    window.scrollTo(0, 0);
  };
  const move = useRef(go);
  move.current = go;
  const position = useRef(index);
  position.current = index;
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, dialog")) return;
      if (event.key === "ArrowRight") move.current(position.current + 1);
      if (event.key === "ArrowLeft") move.current(position.current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) first.current = false;
    else heading.current?.focus({ preventScroll: true });
  }, [stepId]);
  const step = steps[index].id;
  return (
    <main className="results-page stress-page stress-results">
      <div className={`sheet sheet-${step}`} key={step}>
        {step === "verdict" && (
          <>
            <div className="verdict-head">
              <StressScore check={check} />
              <div>
                <h1 ref={heading} tabIndex={-1}>
                  {r.headline}
                </h1>
                {check.isExample && <p className="small">Fiktives Beispiel.</p>}
                {r.unknown.length > 0 && (
                  <button
                    className="quiet"
                    onClick={() =>
                      onEdit(check.methodologySnapshot.indexOf(r.unknown[0]))
                    }
                  >
                    {r.unknown.length} offene{" "}
                    {r.unknown.length === 1 ? "Frage klären" : "Fragen klären"}
                  </button>
                )}
              </div>
            </div>
            <Verdicts check={check} />
          </>
        )}
        {step === "obituary" && (
          <>
            {ai ? (
              <>
                <h1 ref={heading} tabIndex={-1}>
                  Nachruf
                </h1>
                <p className="obituary-text">{ai.obituary}</p>
              </>
            ) : (
              <h1 ref={heading} tabIndex={-1} className="sr-only">
                Nachruf
              </h1>
            )}
            <StressAnalysisControl
              check={check}
              onComplete={onAnalysisChange}
              onEditContext={onEditContext}
            />
          </>
        )}
        {step === "remains" && (
          <>
            <h1 ref={heading} tabIndex={-1}>
              Was davon bleibt
            </h1>
            <Remains check={check} />
          </>
        )}
        {step === "actions" && (
          <>
            <h1 ref={heading} tabIndex={-1}>
              Was Sie jetzt tun können
            </h1>
            <Actions check={check} />
          </>
        )}
        {step === "next" && (
          <>
            <h1 ref={heading} tabIndex={-1}>
              Und jetzt?
            </h1>
            <p className="closing">{CTA_TEXT}</p>
            <Signs />
            <div className="tools">
              <button className="go" onClick={onPrint}>
                Ergebnis als PDF
              </button>
              <button
                className="quiet"
                aria-expanded={answersOpen}
                aria-controls="stress-answer-list"
                onClick={() => setAnswersOpen((v) => !v)}
              >
                Antworten {answersOpen ? "ausblenden" : "ändern"}
              </button>
              <button className="quiet" onClick={onEditContext}>
                Beschreibung ändern
              </button>
              <button className="quiet" onClick={onMethod}>
                Annahmen und Regeln
              </button>
              <button className="quiet" onClick={onExport}>
                JSON sichern
              </button>
            </div>
            {answersOpen && (
              <section
                className="answers"
                id="stress-answer-list"
                aria-label="Antworten bearbeiten"
              >
                {check.methodologySnapshot.map((q, i) => (
                  <button key={q.id} onClick={() => onEdit(i)}>
                    <strong>{q.text}</strong>
                    <span>{answerText(check, q.id)}</span>
                  </button>
                ))}
              </section>
            )}
            <p className="small">
              Grundlage: {r.basis}. Die Szenarien sind Annahmen, keine
              Prognosen.
              {ai
                ? " Die KI-Einschätzung beruht nur auf Ihren Angaben und ist nicht extern geprüft."
                : ""}
            </p>
          </>
        )}
      </div>
      <nav className="stepper no-print" aria-label="Schritte des Ergebnisses">
        <button
          className="stepper-move"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Zurück"
        >
          <Arrow direction="left" />
        </button>
        <ol>
          {steps.map((item, i) => (
            <li key={item.id}>
              <button
                aria-current={i === index ? "step" : undefined}
                onClick={() => go(i)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ol>
        <button
          className="stepper-move stepper-next"
          onClick={() => go(index + 1)}
          disabled={index === steps.length - 1}
        >
          {index < steps.length - 1 ? steps[index + 1].label : "Ende"}
          <Arrow />
        </button>
      </nav>
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
        exklusive Daten, Rechte und Haftung und persönliche Beziehungen. Was nur
        Sie haben, trägt; ohne Kaufbeleg steht dabei „laut Ihren Angaben“. C hat
        dasselbe Ergebnis wie B; es bleibt nur weniger Zeit.
      </p>
      <p>
        <strong>Mit KI.</strong> Die KI liest Ihre Beschreibung und urteilt je
        Szenario selbst. Es gilt immer das strengere Urteil. Eine
        unverständliche Beschreibung macht das Ergebnis offen.
      </p>
      <p>
        <strong>Resilienz-Score.</strong> Jede Antwort zählt 0, halb oder voll
        mit ihrem Gewicht: Ergebnis und eigene Daten je 15, heutige KI,
        Prüfbarkeit, Bedienung, Rechte, Beziehung und Kundenzugang je 10,
        Wechsel und Kaufbeleg je 5. Checks der Fassung 8.0 fragten statt der
        Prüfbarkeit nach einem Netzwerk. Die Summe wird in den Bereich gelegt,
        der zum Szenario-Urteil passt: kippt in A 0–20, kippt in B 15–35, Druck
        in A 25–55, Druck in B 40–65, trägt laut Angaben 60–80, trägt 65–100.
        Unter 35 rot, bis 64 gelb, ab 65 grün.
      </p>
      <p className="method-note">
        Die Szenarien sind gesetzte Annahmen, keine Prognosen. Der Score ist
        eine offengelegte Einschätzung, keine Wahrscheinlichkeit. Ihre Antworten
        sind Selbstauskünfte. Hintergrund: Richard Sutton, The Bitter Lesson.
      </p>
      <p className="method-note">
        Die Szenarien folgen der Einteilung, mit der Fachleute den METR-Bericht
        vom 5. November 2026 diskutieren: von „keine allgemeine Beschleunigung“
        bis „die Beschleunigung beschleunigt sich“. Laut diesem Bericht werden
        Modelle bei klar prüfbaren Aufgaben etwa doppelt so schnell besser wie
        zuvor; ob das anhält, ist offen. Quelle:{" "}
        <a
          href="https://schememagazine.substack.com/p/scheme-sura-and-that-metr-report-835"
          target="_blank"
          rel="noopener noreferrer"
        >
          SCHEME, 10. November 2026
        </a>
        .
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
      <StressFindings check={check} />
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
