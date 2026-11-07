import { z } from "zod";
import type { QuickCheck } from "./model.js";
import { isProviderV4 } from "./provider-questions.js";
import { BUSINESS_DESCRIPTION_MAX_LENGTH } from "./business-description.js";
import {
  DEFAULT_PROVIDER_SCENARIO,
  providerScenarioSchema,
} from "./provider-scenario.js";

export const BUSINESS_ANALYSIS_MODEL = "openai/gpt-5.2";
export const BUSINESS_ANALYSIS_VERSION = "business-analysis-1.0";
export const BUSINESS_ANALYSIS_MIN_LENGTH = 20;
const ids = [
  "Q1",
  "Q2",
  "Q3",
  "Q4",
  "Q5",
  "Q6",
  "Q7",
  "Q8",
  "Q9",
  "Q10",
  "Q11",
  "Q12",
] as const;
const answer = z.union([
  z.number().int().min(1).max(10),
  z.literal("unknown"),
  z.null(),
]);
export const analysisInputSchema = z
  .object({
    methodologyVersion: z.literal("quick-check-4.0"),
    businessDescription: z
      .string()
      .trim()
      .min(BUSINESS_ANALYSIS_MIN_LENGTH)
      .max(BUSINESS_DESCRIPTION_MAX_LENGTH),
    answers: z.record(z.enum(ids), answer),
    scenario: providerScenarioSchema,
  })
  .strict();
export type BusinessAnalysisInput = z.infer<typeof analysisInputSchema>;

const findingSchema = z
  .object({
    title: z
      .string()
      .min(1)
      .max(60)
      .describe("Höchstens sechs konkrete Wörter."),
    detail: z
      .string()
      .min(1)
      .max(180)
      .describe("Ein kurzer Satz, höchstens 25 Wörter."),
    basisQuote: z.string().min(1).max(240).nullable(),
    questions: z.array(z.enum(ids)).max(4),
  })
  .strict();
export const analysisResultSchema = z
  .object({
    headline: z
      .string()
      .min(1)
      .max(160)
      .regex(/[.!?]$/)
      .describe(
        "Höchstens zehn Wörter; ein vollständiger Satz, keine abgeschnittenen Wörter.",
      ),
    summary: z
      .string()
      .min(1)
      .max(180)
      .describe("Ein Satz, höchstens 25 Wörter."),
    takeover: z.array(findingSchema).length(1),
    protection: z.array(findingSchema).length(1),
    opportunity: findingSchema,
    nextStep: findingSchema,
    openQuestions: z.array(z.string().min(1).max(140)).max(2),
  })
  .strict();
export type BusinessAnalysisResult = z.infer<typeof analysisResultSchema>;
export type BusinessFinding = z.infer<typeof findingSchema>;

export const businessAnalysisSchema = z
  .object({
    version: z.literal(BUSINESS_ANALYSIS_VERSION),
    createdAt: z.iso.datetime({ offset: true }),
    model: z.string().min(1).max(120),
    input: analysisInputSchema,
    result: analysisResultSchema,
  })
  .strict()
  .superRefine((analysis, ctx) => {
    const findings = [
      ...analysis.result.takeover,
      ...analysis.result.protection,
      analysis.result.opportunity,
      analysis.result.nextStep,
    ];
    const visible = [
      analysis.result.headline,
      analysis.result.summary,
      ...findings.flatMap((finding) => [finding.title, finding.detail]),
      ...analysis.result.openQuestions,
    ].join(" ");
    if (
      visible.trim().split(/\s+/).length > 180 ||
      /\bQ(?:1[0-2]|[1-9])\b/.test(visible)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Ergebnis zu lang oder mit technischen Frage-IDs.",
        path: ["result"],
      });
    }
    for (const finding of findings) {
      if (
        finding.basisQuote !== null &&
        !analysis.input.businessDescription.includes(finding.basisQuote)
      ) {
        ctx.addIssue({
          code: "custom",
          message:
            "Ein Herkunftszitat steht nicht in der Business-Beschreibung.",
          path: ["result"],
        });
      }
      if (finding.basisQuote === null && finding.questions.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Eine Aussage benötigt eine nachvollziehbare Grundlage.",
          path: ["result"],
        });
      }
    }
  });
export type BusinessAnalysis = z.infer<typeof businessAnalysisSchema>;

export function analysisInputFor(
  check: QuickCheck,
): BusinessAnalysisInput | null {
  if (!isProviderV4(check.methodologyVersion)) return null;
  const parsed = analysisInputSchema.safeParse({
    methodologyVersion: check.methodologyVersion,
    businessDescription: check.businessDescription ?? "",
    answers: Object.fromEntries(ids.map((id) => [id, check.answers[id]])),
    scenario: check.providerScenario ?? DEFAULT_PROVIDER_SCENARIO,
  });
  return parsed.success ? parsed.data : null;
}

export function analysisInputKey(input: BusinessAnalysisInput) {
  return JSON.stringify({
    methodologyVersion: input.methodologyVersion,
    businessDescription: input.businessDescription.trim(),
    answers: Object.fromEntries(ids.map((id) => [id, input.answers[id]])),
    scenario: [
      input.scenario.version,
      input.scenario.horizonYears,
      input.scenario.capabilityPace,
      input.scenario.pricePace,
    ],
  });
}
export function analysisMatches(check: QuickCheck, analysis: BusinessAnalysis) {
  const input = analysisInputFor(check);
  return (
    input !== null &&
    analysisInputKey(input) === analysisInputKey(analysis.input)
  );
}
export function currentBusinessAnalysis(check: QuickCheck) {
  return check.businessAnalysis &&
    analysisMatches(check, check.businessAnalysis)
    ? check.businessAnalysis
    : null;
}

export async function requestBusinessAnalysis(
  input: BusinessAnalysisInput,
  {
    signal,
    fetcher = fetch,
  }: { signal?: AbortSignal; fetcher?: typeof fetch } = {},
): Promise<BusinessAnalysis> {
  signal?.throwIfAborted();
  const response = await fetcher("/api/business-analysis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(analysisInputSchema.parse(input)),
    signal,
  });
  if (!response.ok) {
    throw new Error(
      response.status === 429 || response.status === 403
        ? "Zu viele Auswertungen. Bitte in einer Minute erneut versuchen."
        : response.status === 503
          ? "Die KI-Auswertung ist gerade nicht verfügbar. Ihr Check bleibt gespeichert."
          : "Die Auswertung hat nicht geklappt. Bitte erneut versuchen.",
    );
  }
  const parsed = businessAnalysisSchema.safeParse(
    await response.json().catch(() => null),
  );
  if (!parsed.success)
    throw new Error(
      "Die KI-Antwort war unvollständig. Bitte erneut versuchen.",
    );
  const analysis = parsed.data;
  if (analysisInputKey(input) !== analysisInputKey(analysis.input))
    throw new Error("Die Auswertung passt nicht zu Ihren aktuellen Angaben.");
  signal?.throwIfAborted();
  return analysis;
}
