import { z } from "zod";
import oldQuestions from "./methods/quick-check-1.0.json" with { type: "json" };
import providerV3 from "./methods/quick-check-3.0.json" with { type: "json" };
import providerV31 from "./methods/quick-check-3.1.json" with { type: "json" };
import providerV4 from "./methods/quick-check-4.0.json" with { type: "json" };
import { EXPERT_QUESTIONS } from "./expert-questions.js";
import {
  PROVIDER_METHOD,
  PROVIDER_QUESTIONS,
  PROVIDER_GROUPS,
  isProviderMethod,
  isProviderV5,
  supportsBusinessAnalysis,
} from "./provider-questions.js";
import { providerRiskV5 } from "./provider-analysis-5.js";
import { scenarioWorkspaceSchema } from "./scenario-model.js";
import type { ScenarioWorkspace } from "./scenario-model.js";
import {
  providerScenarioSchema,
  type ProviderScenarioSettings,
} from "./provider-scenario.js";
import { BUSINESS_DESCRIPTION_MAX_LENGTH } from "./business-description.js";
import {
  businessAnalysisSchema,
  type BusinessAnalysis,
} from "./business-analysis.js";
export const QUICK_METHOD = PROVIDER_METHOD;
export const QUICK_SCHEMA = "1.1";
export type GroupId = "value" | "competition" | "advantage" | "control";
export type QuickAnswer = number | "unknown" | null;
export interface QuickQuestion {
  id: string;
  group: GroupId;
  text: string;
  low: string;
  high: string;
  help: string;
  example?: string;
  action: string;
  actionDetail: string;
}
export const QUICK_GROUPS: { id: GroupId; title: string; short: string }[] = [
  { id: "value", title: "Kundenwert", short: "Kundenwert" },
  { id: "competition", title: "Wettbewerb", short: "Wettbewerb" },
  { id: "advantage", title: "Differenzierung", short: "Vorteile" },
  { id: "control", title: "Handlungsfähigkeit", short: "Handlung" },
];
export const QUICK_QUESTIONS = PROVIDER_QUESTIONS;
export const QUICK_METHODS: Record<string, QuickQuestion[]> = {
  "quick-check-1.0": oldQuestions as QuickQuestion[],
  "quick-check-2.0": EXPERT_QUESTIONS,
  "quick-check-3.0": providerV3 as QuickQuestion[],
  "quick-check-3.1": providerV31 as QuickQuestion[],
  "quick-check-4.0": providerV4 as QuickQuestion[],
  [QUICK_METHOD]: QUICK_QUESTIONS,
};
export interface QuickCheck {
  id: string;
  schemaVersion: string;
  methodologyVersion: string;
  methodologySnapshot: QuickQuestion[];
  createdAt: string;
  updatedAt: string;
  type: "existing" | "idea";
  answers: Record<string, QuickAnswer>;
  step: number;
  view: "intro" | "questions" | "results" | "scenarios";
  scenarios?: ScenarioWorkspace;
  providerScenario?: ProviderScenarioSettings;
  businessDescription?: string;
  businessAnalysis?: BusinessAnalysis;
  isExample: boolean;
  originId: string | null;
}
export function createCheck(type: QuickCheck["type"]): QuickCheck {
  const time = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    schemaVersion: QUICK_SCHEMA,
    methodologyVersion: QUICK_METHOD,
    methodologySnapshot: structuredClone(QUICK_QUESTIONS),
    createdAt: time,
    updatedAt: time,
    type,
    answers: Object.fromEntries(QUICK_QUESTIONS.map((q) => [q.id, null])),
    step: 0,
    view: "questions",
    isExample: false,
    originId: null,
  };
}
export function answerCheck(c: QuickCheck, id: string, value: QuickAnswer) {
  if (
    !c.methodologySnapshot.some((q) => q.id === id) ||
    !(
      value === null ||
      value === "unknown" ||
      (Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 10)
    )
  )
    throw Error("Ungültige Antwort. Bitte einen Wert von 1 bis 10 wählen.");
  c.answers[id] = value;
  c.updatedAt = new Date().toISOString();
}
function norm(values: number[]) {
  return Math.round(
    (100 * values.reduce((s, v) => s + v - 1, 0)) / (values.length * 9),
  );
}
export function riskLabel(score: number | null) {
  return score === null
    ? "Noch offen"
    : score < 25
      ? "Niedriges Risiko"
      : score < 50
        ? "Mittleres Risiko"
        : score < 75
          ? "Erhöhtes Risiko"
          : "Hohes Risiko";
}
export function calculateRisk(c: QuickCheck) {
  const questions = c.methodologySnapshot;
  const rated = questions.flatMap((q) =>
    typeof c.answers[q.id] === "number"
      ? [{ ...q, value: c.answers[q.id] as number }]
      : [],
  );
  const provider = isProviderMethod(c.methodologyVersion);
  const groups = groupsForCheck(c).map((g) => {
    const values = rated.filter((q) => q.group === g.id).map((q) => q.value);
    return {
      ...g,
      answered: values.length,
      score: !provider && values.length === 3 ? norm(values) : null,
    };
  });
  const ranked = [...rated].sort(
    (a, b) =>
      b.value - a.value || Number(a.id.slice(1)) - Number(b.id.slice(1)),
  );
  return {
    score: isProviderV5(c.methodologyVersion)
      ? providerRiskV5(c).score
      : !provider && rated.length === 12
        ? norm(rated.map((q) => q.value))
        : null,
    answered: rated.length,
    processed: questions.filter((q) => c.answers[q.id] != null).length,
    groups,
    critical: provider ? [] : ranked.filter((q) => q.value >= 9),
    priorities: provider ? [] : ranked.filter((q) => q.value >= 4).slice(0, 3),
    unknown: questions.filter((q) => typeof c.answers[q.id] !== "number"),
  };
}
export function groupsForCheck(c: QuickCheck) {
  return isProviderMethod(c.methodologyVersion)
    ? PROVIDER_GROUPS
    : QUICK_GROUPS;
}
const questionSchema = z
  .object({
    id: z.string(),
    group: z.enum(["value", "competition", "advantage", "control"]),
    text: z.string(),
    low: z.string(),
    high: z.string(),
    help: z.string(),
    example: z.string().optional(),
    action: z.string(),
    actionDetail: z.string(),
  })
  .strict();
const questionIds = QUICK_QUESTIONS.map((q) => q.id) as [string, ...string[]];
const checkSchema = z
  .object({
    id: z.string().min(1).max(200),
    schemaVersion: z.enum(["1.0", "1.1"]),
    methodologyVersion: z.enum([
      "quick-check-1.0",
      "quick-check-2.0",
      "quick-check-3.0",
      "quick-check-3.1",
      "quick-check-4.0",
      QUICK_METHOD,
    ]),
    methodologySnapshot: z.array(questionSchema).length(12),
    createdAt: z.iso.datetime({ offset: true }),
    updatedAt: z.iso.datetime({ offset: true }),
    type: z.enum(["existing", "idea"]),
    answers: z.record(
      z.enum(questionIds),
      z.union([
        z.number().int().min(1).max(10),
        z.literal("unknown"),
        z.null(),
      ]),
    ),
    step: z.number().int().min(0).max(11),
    view: z.enum(["intro", "questions", "results", "scenarios"]),
    scenarios: scenarioWorkspaceSchema.optional(),
    providerScenario: providerScenarioSchema.optional(),
    businessDescription: z
      .string()
      .max(BUSINESS_DESCRIPTION_MAX_LENGTH)
      .optional(),
    businessAnalysis: businessAnalysisSchema.optional(),
    isExample: z.boolean(),
    originId: z.string().nullable(),
  })
  .strict()
  .refine(
    (c) =>
      c.businessAnalysis === undefined ||
      (supportsBusinessAnalysis(c.methodologyVersion) &&
        c.schemaVersion === "1.1" &&
        c.businessAnalysis.input.methodologyVersion === c.methodologyVersion),
    "Die Business-Auswertung muss zur gespeicherten Methode mit Schema 1.1 passen.",
  )
  .refine(
    (c) =>
      (c.view !== "scenarios" || c.scenarios !== undefined) &&
      (c.schemaVersion !== "1.0" || c.scenarios === undefined),
    "Szenariodaten benötigen Schema 1.1.",
  )
  .refine(
    (c) => !isProviderMethod(c.methodologyVersion) || c.scenarios === undefined,
    "Frühere Zukunftsszenarien gehören nicht zum Plattform-Check.",
  )
  .refine(
    (c) =>
      c.providerScenario === undefined ||
      (isProviderMethod(c.methodologyVersion) && c.schemaVersion === "1.1"),
    "Zwei-Jahres-Szenarien gehören zum Plattform-Check mit Schema 1.1.",
  );
const exchangeSchema = z
  .object({
    format: z.literal("e23-quick-check"),
    schemaVersion: z.enum(["1.0", "1.1"]),
    appVersion: z.string(),
    exportedAt: z.iso.datetime({ offset: true }),
    checks: z.array(checkSchema).max(2000),
  })
  .strict();
export function serializeChecks(checks: QuickCheck[]) {
  return JSON.stringify(
    {
      format: "e23-quick-check",
      schemaVersion: QUICK_SCHEMA,
      appVersion: "0.8.0",
      exportedAt: new Date().toISOString(),
      checks,
    },
    null,
    2,
  );
}
export function parseChecks(
  text: string,
  maxBytes = 5 * 1024 * 1024,
): QuickCheck[] {
  if (new TextEncoder().encode(text).length > maxBytes)
    throw Error("Die Datei überschreitet das Importlimit von 5 MiB.");
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw Error("Die Datei enthält kein gültiges JSON.");
  }
  const result = exchangeSchema.safeParse(data);
  if (!result.success)
    throw Error(
      "Import nicht möglich: Datei, Schemaversion oder Methodenversion wird nicht unterstützt.",
    );
  const checks = result.data.checks;
  const ids = new Set<string>();
  for (const c of checks) {
    if (ids.has(c.id)) throw Error("Doppelte Check-ID in der Datei.");
    ids.add(c.id);
    if (
      JSON.stringify(c.methodologySnapshot) !==
      JSON.stringify(QUICK_METHODS[c.methodologyVersion])
    )
      throw Error(
        "Der Fragenkatalog passt nicht zur angegebenen Methodenversion.",
      );
  }
  return checks;
}
export function mergeChecks(
  existing: QuickCheck[],
  incoming: QuickCheck[],
  mode: "copy" | "replace",
) {
  const result = structuredClone(existing);
  for (const source of incoming) {
    const c = structuredClone(source);
    if (mode === "copy") {
      c.originId = c.id;
      c.id = crypto.randomUUID();
    }
    const at = result.findIndex((x) => x.id === c.id);
    if (at < 0) result.push(c);
    else result[at] = c;
  }
  return result;
}
export function checkTitle(c: QuickCheck) {
  return `${c.isExample ? "Beispiel" : isProviderMethod(c.methodologyVersion) ? "Assessment" : c.type === "idea" ? "Neue Idee" : "Bestehendes Angebot"}${c.originId ? " (Kopie)" : ""} · ${new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Berlin" }).format(new Date(c.createdAt))}`;
}
export function exampleCheck() {
  const c = createCheck("existing");
  const values = [10, 10, 10, 8, 9, 2, 2, 3, 8, 8, 9, 1];
  c.businessDescription =
    "Unsere App erstellt aus Audiodateien Transkripte und SRT-Untertitel für einzelne Content-Creator. Kunden zahlen für die automatische Umwandlung und den Download.";
  QUICK_QUESTIONS.forEach((q, i) => answerCheck(c, q.id, values[i]));
  c.isExample = true;
  c.view = "results";
  c.step = 11;
  return c;
}
export function downloadText(
  filename: string,
  text: string,
  type = "application/json",
) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
