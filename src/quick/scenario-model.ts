import { z } from "zod";
import oldSnapshot from "./methods/scenario-stress-1.0.json" with { type: "json" };
export const SCENARIO_METHOD = "scenario-stress-2.0";
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
    title: "Dasselbe Expertenteam, günstiger",
    short: "Günstiger",
    story:
      "Denken Sie an das Expertenteam Ihres Wettbewerbers: Es recherchiert, entwickelt und prüft auf Weltklasseniveau, rund um die Uhr. Seine Fähigkeiten und Fehlergrenzen bleiben gleich. Dieselbe digitale Facharbeit kostet ein Zehntel des angenommenen Ausgangspreises. Sie, Ihre Kunden und Wettbewerber können sie nutzen.",
    question:
      "Welche Aufgaben würden Kunden oder Wettbewerber nun selbst erledigen lassen?",
    assumptions: { costFactor: 10, intelligence: "same", robots: "none" },
  },
  {
    id: "s2",
    title: "Expertenteams für alle",
    short: "Für alle",
    story:
      "Dasselbe Expertenteam mit unveränderten Fähigkeiten und Fehlergrenzen steht Ihnen, Ihren Kunden und Wettbewerbern zur Verfügung. Dieselbe digitale Facharbeit kostet nur noch ein Hundertstel des angenommenen Ausgangspreises. So wird wesentlich mehr gleichartige Arbeit finanzierbar, ohne dass das Team dadurch klüger wird.",
    question:
      "Was würden Kunden selbst erledigen lassen, wenn gute Facharbeit kaum noch etwas kostet?",
    assumptions: { costFactor: 100, intelligence: "same", robots: "none" },
  },
  {
    id: "s3",
    title: "Die klügsten Forscher im Team",
    short: "Stärkeres Team",
    story:
      "Digitale Facharbeit kostet ein Hundertstel. Zusätzlich bekommt das Team die Fähigkeiten der klügsten Wissenschaftler und Entwickler Ihres Gebiets – im Gedankenexperiment bis auf Nobelpreisniveau, wo dieser Vergleich passt. Es löst schwierigere Probleme und bewältigt längere Entwicklungs- und Prüfabläufe zuverlässiger. Fehlerfreiheit und Zugang zu exklusiven Ressourcen sind nicht unterstellt.",
    question:
      "Welche fachliche Hürde bleibt, wenn das Team schwieriger forschen, entwickeln und prüfen kann?",
    assumptions: { costFactor: 100, intelligence: "higher", robots: "none" },
  },
  {
    id: "s4",
    title: "Das Team bekommt Roboter",
    short: "Team + Routine-Roboter",
    story:
      "Die Fähigkeiten des Expertenteams bleiben gleich, digitale Facharbeit kostet ein Hundertstel. Zusätzlich bekommt es wirtschaftlich einsetzbare Roboter für abgegrenzte, wiederkehrende körperliche Arbeiten in vorbereiteten Umgebungen. Flexible Arbeiten in beliebigen Situationen sind damit nicht unterstellt.",
    question:
      "Welche körperliche Routine könnte das Team nun zusätzlich selbst ausführen?",
    assumptions: { costFactor: 100, intelligence: "same", robots: "routine" },
  },
  {
    id: "s5",
    title: "Forscherteam mit Robotern",
    short: "Forscher + Routine-Roboter",
    story:
      "Digitale Facharbeit kostet ein Hundertstel. Das Team kann wie in Szenario 3 schwierigere Probleme erforschen und längere Abläufe zuverlässiger bewältigen. Dazu erhält es dieselben Routine-Roboter wie in Szenario 4. Diese arbeiten in abgegrenzten, vorbereiteten Umgebungen.",
    question:
      "Was könnte das stärkere Team mit denselben Routine-Robotern zusätzlich leisten?",
    assumptions: { costFactor: 100, intelligence: "higher", robots: "routine" },
  },
  {
    id: "s6",
    title: "Das Team kann auch körperlich handeln",
    short: "Team + flexible Roboter",
    story:
      "Das stärkere Forscherteam aus Szenario 5 bekommt zusätzlich flexible Roboter für wesentlich mehr körperliche Aufgaben. Digitale Facharbeit kostet weiterhin ein Hundertstel. Dass diese Roboter zuverlässig verfügbar und wirtschaftlich einsetzbar sind, ist eine eigene Annahme dieses Szenarios.",
    question:
      "Welche bisher schützende Grenze fällt weg, wenn das Team auch vielfältige körperliche Arbeiten ausführen kann?",
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
    title: "Nachbau des Kundenergebnisses",
    text: "Wie viel Ihres bezahlten Ergebnisses könnte dieses Team ohne Sie liefern?",
    low: "Nur kleine Teile des Kundenergebnisses",
    high: "Fast das gesamte Kundenergebnis",
    action:
      "Prüfen Sie an einer konkreten Kundenaufgabe, welche Ergebnisse das Team mit zugänglichem Wissen und Werkzeugen liefern könnte und welche Hürden bestehen bleiben.",
  },
  {
    id: "price",
    title: "Preis und Marge",
    text: "Wie stark müssten Sie im Preis nachgeben, wenn das Team vergleichbar gut und viel günstiger anbietet?",
    low: "Preis haltbar oder Kosten sinken ausreichend",
    high: "Erzielbarer Preis deckt Kosten kaum noch",
    action:
      "Spielen Sie ein vergleichbares günstigeres Angebot mit einem Kunden durch. Rechnen Sie nach, ob Ihr verbleibender Preis die vollständigen Kosten einschließlich Prüfung und Umstellung deckt.",
  },
  {
    id: "access",
    title: "Auswahl beim Einkauf",
    text: "Wie leicht könnte ein Einkaufsassistent Ihr Angebot bei der Vorauswahl übergehen?",
    low: "Direkter Zugang oder klare Auswahlgründe",
    high: "Kaum Gründe, Sie in die Auswahl aufzunehmen",
    action:
      "Spielen Sie die Anbietersuche aus Kundensicht durch. Prüfen Sie, über welche Zugänge und nachprüfbaren Kriterien Ihr Angebot auf die Auswahlliste gelangt.",
  },
  {
    id: "adapt",
    title: "Praktische Anpassung",
    text: "Wie viel fehlt Ihnen, um Ihr Angebot im gewählten Zeitfenster zu verändern?",
    low: "Ressourcen und nächste Schritte stehen bereit",
    high: "Wesentliche Voraussetzungen fehlen",
    action:
      "Erproben Sie eine konkrete Anpassung innerhalb des gewählten Zeitfensters mit klarer Zuständigkeit, Budget und überprüfbarem Ergebnis.",
  },
  {
    id: "opportunity",
    title: "Das Team für Sie",
    text: "Wie konkret könnten Sie dieses Team selbst für zusätzlichen Kundennutzen und Ertrag einsetzen?",
    low: "Bisher kein konkreter bezahlbarer Einsatz",
    high: "Konkreter Einsatz mit nachvollziehbarem Ertrag",
    action:
      "Erproben Sie einen konkreten Einsatz des Teams für Ihre Kunden. Prüfen Sie, welcher zusätzliche Nutzen bezahlt würde oder welche Einsparung im Unternehmen bliebe.",
  },
];
export const SCENARIO_SNAPSHOT = {
  catalog: SCENARIOS,
  questions: SCENARIO_QUESTIONS,
};
export const SCENARIO_METHODS: Record<string, typeof SCENARIO_SNAPSHOT> = {
  "scenario-stress-1.0": oldSnapshot as typeof SCENARIO_SNAPSHOT,
  [SCENARIO_METHOD]: SCENARIO_SNAPSHOT,
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
  methodVersion: "scenario-stress-1.0" | typeof SCENARIO_METHOD;
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
export function evaluateScenario(
  run: ScenarioRun,
  workspace?: ScenarioWorkspace,
) {
  const questions = workspace?.methodSnapshot.questions ?? SCENARIO_QUESTIONS;
  const risk = questions
    .slice(0, 4)
    .flatMap((q) =>
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
    unknown: questions.filter((q) => typeof run.answers[q.id] !== "number"),
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
export function scenarioLabels(
  s: ScenarioDefinition,
  version: string = SCENARIO_METHOD,
) {
  return {
    cost: `${s.assumptions.costFactor}× günstigere ${version === "scenario-stress-1.0" ? "KI" : "digitale Facharbeit"}`,
    intelligence:
      s.assumptions.intelligence === "same"
        ? version === "scenario-stress-1.0"
          ? "Agentenfähigkeiten gleich"
          : "Gleiche Teamfähigkeiten"
        : version === "scenario-stress-1.0"
          ? "Agentenfähigkeiten höher"
          : "Höhere Teamfähigkeiten",
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
    methodVersion: z.enum(["scenario-stress-1.0", SCENARIO_METHOD]),
    methodSnapshot: z.custom<typeof SCENARIO_SNAPSHOT>(
      (v) =>
        Object.values(SCENARIO_METHODS).some(
          (snapshot) =>
            JSON.stringify(canonical(v)) ===
            JSON.stringify(canonical(snapshot)),
        ),
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
    if (
      JSON.stringify(canonical(w.methodSnapshot)) !==
      JSON.stringify(canonical(SCENARIO_METHODS[w.methodVersion]))
    )
      ctx.addIssue({
        code: "custom",
        message: "Fragenstand und Szenariomethode passen nicht zusammen.",
      });
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
