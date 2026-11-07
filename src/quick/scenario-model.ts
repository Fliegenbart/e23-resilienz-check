import { z } from "zod";
export const SCENARIO_METHOD = "scenario-stress-1.0";
export type ScenarioAnswer = number | "unknown" | null;
export type ScenarioQuestionId =
  "value" | "price" | "access" | "adapt" | "opportunity";
export type ScenarioId = "s1" | "s2" | "s3" | "s4" | "s5" | "s6";
export interface ScenarioDefinition {
  id: ScenarioId;
  title: string;
  short: string;
  story: string;
  question: string;
  assumptions: {
    costFactor: 10 | 100;
    intelligence: "same" | "higher";
    robots: "none" | "routine" | "flexible";
  };
}
export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: "s1",
    title: "Gleiche Intelligenz, günstiger",
    short: "Günstiger",
    story:
      "Die heutigen Agentenfähigkeiten und Fehlerquoten bleiben gleich. Dieselbe KI-Leistung kostet nur noch ein Zehntel. Auch Wettbewerber und Kunden erhalten diesen Zugang.",
    question:
      "Welche heute schon möglichen Aufgaben werden dadurch wirtschaftlich interessant?",
    assumptions: { costFactor: 10, intelligence: "same", robots: "none" },
  },
  {
    id: "s2",
    title: "Digitale Leistung wird Massenware",
    short: "Massenware",
    story:
      "Die Agenten bleiben auf dem heutigen Leistungsniveau. Ihre Nutzung kostet nur noch ein Hundertstel. Bei gleichem KI-Budget werden hundertmal so viele gleichartige KI-Durchläufe finanzierbar.",
    question:
      "Was verändert sich, wenn bisher teure digitale Arbeit in viel größerer Menge finanzierbar wird?",
    assumptions: { costFactor: 100, intelligence: "same", robots: "none" },
  },
  {
    id: "s3",
    title: "Agenten bewältigen mehr",
    short: "Stärkere Agenten",
    story:
      "KI-Leistung kostet ein Hundertstel. Zusätzlich können Agenten längere und komplexere digitale Abläufe einschließlich Werkzeugnutzung und Prüfung zuverlässiger bewältigen. Fehlerfreiheit ist weiterhin nicht unterstellt.",
    question:
      "Welche bisher notwendigen menschlichen Arbeitsschritte werden unter dieser zusätzlichen Annahme ersetzbar?",
    assumptions: { costFactor: 100, intelligence: "higher", robots: "none" },
  },
  {
    id: "s4",
    title: "Roboter übernehmen Routine",
    short: "Routine-Robotik",
    story:
      "Die Agentenfähigkeiten bleiben gleich, die KI-Leistung kostet ein Hundertstel. Zusätzlich stehen wirtschaftlich einsetzbare Roboter für abgegrenzte, wiederkehrende körperliche Aufgaben in vorbereiteten Umgebungen bereit.",
    question:
      "Was ändert sich, wenn digitale Fähigkeiten auch klar begrenzte körperliche Abläufe ausführen können?",
    assumptions: { costFactor: 100, intelligence: "same", robots: "routine" },
  },
  {
    id: "s5",
    title: "Stärkere Agenten steuern Roboter",
    short: "Agenten + Roboter",
    story:
      "KI-Leistung kostet ein Hundertstel. Agenten bearbeiten längere digitale Abläufe zuverlässiger und steuern wirtschaftlich einsetzbare Roboter in abgegrenzten, vorbereiteten Arbeitsumgebungen.",
    question:
      "Welche zusätzliche Wirkung haben leistungsfähigere Agenten bei derselben Routine-Robotik wie in Szenario 4?",
    assumptions: { costFactor: 100, intelligence: "higher", robots: "routine" },
  },
  {
    id: "s6",
    title: "Flexible physische Automatisierung",
    short: "Flexible Robotik",
    story:
      "KI-Leistung kostet ein Hundertstel und Agenten bearbeiten komplexere Abläufe zuverlässiger. Zusätzlich werden flexible Roboter für wesentlich mehr körperliche Aufgaben wirtschaftlich einsetzbar. Verfügbarkeit und Wirtschaftlichkeit dieser Robotik sind eigene Szenarioannahmen.",
    question:
      "Welche bisher schützenden Grenzen körperlicher Ausführung fallen unter diesen Annahmen weg?",
    assumptions: {
      costFactor: 100,
      intelligence: "higher",
      robots: "flexible",
    },
  },
];
export const SCENARIO_QUESTIONS: {
  id: ScenarioQuestionId;
  title: string;
  text: string;
  low: string;
  high: string;
  action: string;
}[] = [
  {
    id: "value",
    title: "Bezahlter Nutzen",
    text: "Wie viel Ihres bezahlten Nutzens könnte durch Alternativen ersetzt werden?",
    low: "Bezahlter Nutzen bleibt eigenständig",
    high: "Nahezu vollständig ersetzbar",
    action:
      "Prüfen Sie an einer konkreten Kundenaufgabe, welcher zusätzliche Nutzen auch unter diesen Annahmen bezahlt würde.",
  },
  {
    id: "price",
    title: "Preis und Marge",
    text: "Wie stark könnte der Druck auf Ihren Preis oder Ihre Marge steigen?",
    low: "Kaum zusätzlicher Druck",
    high: "Wirtschaftlichkeit stark bedroht",
    action:
      "Vergleichen Sie vollständige Kosten je brauchbarem Ergebnis und tatsächliche Zahlungsbereitschaft – einschließlich Prüfung und Umstellung.",
  },
  {
    id: "access",
    title: "Kundenzugang",
    text: "Wie groß ist das Risiko, den Zugang zur Kaufentscheidung zu verlieren?",
    low: "Kundenzugang bleibt belastbar",
    high: "Auswahl liegt bei anderen Anbietern",
    action:
      "Testen Sie, wie Kunden oder Einkaufsagenten Ihr Angebot finden und auswählen und welche Zugänge oder Auswahlkriterien entscheidend sind.",
  },
  {
    id: "adapt",
    title: "Anpassung",
    text: "Wie groß ist das Risiko, Ihr Angebot nicht rechtzeitig anzupassen?",
    low: "Umsetzung im Zeitfenster realistisch",
    high: "Keine realistische Anpassung",
    action:
      "Erproben Sie die wichtigste Anpassung mit klarer Zuständigkeit, Kapazität und überprüfbarem Ergebnis innerhalb des gewählten Zeitfensters.",
  },
  {
    id: "opportunity",
    title: "Eigene Chance",
    text: "Wie gut könnten Sie diese Entwicklung selbst in zusätzlichen Kundennutzen und Erträge übersetzen?",
    low: "Kaum erkennbarer Ansatz",
    high: "Konkreter tragfähiger Ansatz",
    action:
      "Grenzen Sie einen kleinen Pilot ab, der den zusätzlichen Kundennutzen und Ihre Möglichkeit prüft, einen Teil davon als Ertrag zu behalten.",
  },
];
export const SCENARIO_SNAPSHOT = {
  catalog: SCENARIOS,
  questions: SCENARIO_QUESTIONS,
};
export const PROFILE_LABELS = {
  digital: "Vorwiegend digital",
  mixed: "Gemischtes Angebot",
  physical: "Vorwiegend physisch",
};
export interface ScenarioContext {
  profile: keyof typeof PROFILE_LABELS;
  horizon: 6 | 18 | 36;
  aiShare: 0 | 25 | 50 | 75 | 100 | null;
}
export interface ScenarioRun {
  id: string;
  presetId: ScenarioId;
  createdAt: string;
  context: ScenarioContext;
  answers: Record<ScenarioQuestionId, ScenarioAnswer>;
  step: number;
  completed: boolean;
}
export interface ScenarioWorkspace {
  methodVersion: typeof SCENARIO_METHOD;
  methodSnapshot: typeof SCENARIO_SNAPSHOT;
  referenceDate: string;
  draftContext: ScenarioContext;
  runs: ScenarioRun[];
  activeRunId: string | null;
  view: "catalog" | "scene" | "questions" | "comparison";
}
export function createScenarioWorkspace(): ScenarioWorkspace {
  return {
    methodVersion: SCENARIO_METHOD,
    methodSnapshot: structuredClone(SCENARIO_SNAPSHOT),
    referenceDate: new Date().toISOString(),
    draftContext: { profile: "mixed", horizon: 18, aiShare: null },
    runs: [],
    activeRunId: null,
    view: "catalog",
  };
}
export function startScenario(w: ScenarioWorkspace, presetId: ScenarioId) {
  if (!w.methodSnapshot.catalog.some((s) => s.id === presetId))
    throw Error("Unbekanntes Szenario.");
  if (w.runs.length >= 60)
    throw Error(
      "Für diesen Check sind bereits 60 Bewertungsstände gespeichert. Bitte einen neuen Check beginnen.",
    );
  const run: ScenarioRun = {
    id: crypto.randomUUID(),
    presetId,
    createdAt: new Date().toISOString(),
    context: structuredClone(w.draftContext),
    answers: {
      value: null,
      price: null,
      access: null,
      adapt: null,
      opportunity: null,
    },
    step: 0,
    completed: false,
  };
  w.runs.push(run);
  w.activeRunId = run.id;
  w.view = "scene";
  return run;
}
export function answerScenario(
  run: ScenarioRun,
  id: ScenarioQuestionId,
  answer: ScenarioAnswer,
) {
  if (
    !SCENARIO_QUESTIONS.some((q) => q.id === id) ||
    !(
      answer === null ||
      answer === "unknown" ||
      (typeof answer === "number" &&
        Number.isInteger(answer) &&
        answer >= 1 &&
        answer <= 10)
    )
  )
    throw Error("Bitte 1 bis 10 oder unbekannt wählen.");
  run.answers[id] = answer;
}
export function evaluateScenario(run: ScenarioRun) {
  const risk = SCENARIO_QUESTIONS.slice(0, 4).flatMap((q) =>
    typeof run.answers[q.id] === "number"
      ? [{ ...q, value: run.answers[q.id] as number }]
      : [],
  );
  return {
    score:
      risk.length === 4
        ? Math.round((100 * risk.reduce((sum, q) => sum + q.value - 1, 0)) / 36)
        : null,
    answered: risk.length,
    critical: risk.filter((q) => q.value >= 9),
    actions: [...risk]
      .filter((q) => q.value >= 4)
      .sort((a, b) => b.value - a.value)
      .slice(0, 3),
    opportunity:
      typeof run.answers.opportunity === "number"
        ? run.answers.opportunity
        : null,
    unknown: SCENARIO_QUESTIONS.filter(
      (q) => typeof run.answers[q.id] !== "number",
    ),
  };
}
export function costEffect(aiShare: number | null, factor: number) {
  if (!Number.isFinite(factor) || factor < 1)
    throw Error("Ungültiger Kostenfaktor.");
  if (aiShare === null) return null;
  if (!Number.isFinite(aiShare) || aiShare < 0 || aiShare > 100)
    throw Error("Ungültiger KI-Kostenanteil.");
  const savingPercent = Math.round(aiShare * (1 - 1 / factor) * 100) / 100;
  return {
    savingPercent,
    remainingPercent: Math.round((100 - savingPercent) * 100) / 100,
  };
}
export const ROBOT_LABELS = {
  none: "Keine neue Robotik",
  routine: "Routine-Robotik",
  flexible: "Flexible Robotik",
};
export function scenarioLabels(s: ScenarioDefinition) {
  return {
    cost: `${s.assumptions.costFactor}× günstigere KI`,
    intelligence:
      s.assumptions.intelligence === "same"
        ? "Agentenfähigkeiten gleich"
        : "Agentenfähigkeiten höher",
    robots: ROBOT_LABELS[s.assumptions.robots],
  };
}
export const formatPercent = (n: number) =>
  new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 }).format(n);
const contextSchema = z
  .object({
    profile: z.enum(["digital", "mixed", "physical"]),
    horizon: z.union([z.literal(6), z.literal(18), z.literal(36)]),
    aiShare: z.union([
      z.literal(0),
      z.literal(25),
      z.literal(50),
      z.literal(75),
      z.literal(100),
      z.null(),
    ]),
  })
  .strict();
const answerSchema = z.union([
  z.number().int().min(1).max(10),
  z.literal("unknown"),
  z.null(),
]);
const runSchema = z
  .object({
    id: z.string().min(1).max(200),
    presetId: z.enum(["s1", "s2", "s3", "s4", "s5", "s6"]),
    createdAt: z.iso.datetime({ offset: true }),
    context: contextSchema,
    answers: z
      .object({
        value: answerSchema,
        price: answerSchema,
        access: answerSchema,
        adapt: answerSchema,
        opportunity: answerSchema,
      })
      .strict(),
    step: z.number().int().min(0).max(4),
    completed: z.boolean(),
  })
  .strict();
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, v]) => [key, canonical(v)]),
    );
  return value;
}
export const scenarioWorkspaceSchema = z
  .object({
    methodVersion: z.literal(SCENARIO_METHOD),
    methodSnapshot: z.custom<typeof SCENARIO_SNAPSHOT>(
      (v) =>
        JSON.stringify(canonical(v)) ===
        JSON.stringify(canonical(SCENARIO_SNAPSHOT)),
      "Unbekannter Szenariokatalog oder Fragenstand.",
    ),
    referenceDate: z.iso.datetime({ offset: true }),
    draftContext: contextSchema,
    runs: z.array(runSchema).max(60),
    activeRunId: z.string().nullable(),
    view: z.enum(["catalog", "scene", "questions", "comparison"]),
  })
  .strict()
  .superRefine((w, ctx) => {
    const ids = new Set(w.runs.map((r) => r.id));
    if (ids.size !== w.runs.length)
      ctx.addIssue({
        code: "custom",
        message: "Doppelte Szenariobewertungs-ID.",
      });
    if (
      (w.activeRunId !== null && !ids.has(w.activeRunId)) ||
      (w.view !== "catalog" && w.activeRunId === null)
    )
      ctx.addIssue({
        code: "custom",
        message: "Der aktive Szenariostand fehlt.",
      });
    if (
      w.runs.some(
        (r) => r.completed && Object.values(r.answers).some((v) => v === null),
      )
    )
      ctx.addIssue({
        code: "custom",
        message: "Unvollständiger abgeschlossener Szenariostand.",
      });
  });
