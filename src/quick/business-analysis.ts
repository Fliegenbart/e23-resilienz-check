import { z } from "zod";
import type { QuickCheck } from "./model.js";
import { supportsBusinessAnalysis } from "./provider-questions.js";
import {
  BUSINESS_DESCRIPTION_MAX_LENGTH,
  BUSINESS_MOAT_MAX_LENGTH,
} from "./business-description.js";
import {
  DEFAULT_PROVIDER_SCENARIO,
  providerScenarioSchema,
} from "./provider-scenario.js";

export const BUSINESS_ANALYSIS_MODEL = "openai/gpt-5.2";
export const BUSINESS_ANALYSIS_VERSION = "business-analysis-2.0";
export const BUSINESS_MOAT_ANALYSIS_VERSION = "business-analysis-3.0";
export const BUSINESS_EXPERT_ANALYSIS_VERSION = "business-analysis-4.0";
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
    methodologyVersion: z.enum([
      "quick-check-4.0",
      "quick-check-5.0",
      "quick-check-6.0",
    ]),
    businessDescription: z.string().trim().max(BUSINESS_DESCRIPTION_MAX_LENGTH),
    businessMoat: z.string().trim().max(BUSINESS_MOAT_MAX_LENGTH).optional(),
    answers: z.record(z.enum(ids), answer),
    scenario: providerScenarioSchema,
  })
  .strict()
  .superRefine((input, ctx) => {
    if (
      input.businessMoat &&
      !["quick-check-5.0", "quick-check-6.0"].includes(input.methodologyVersion)
    )
      ctx.addIssue({
        code: "custom",
        message: "Die Prüfung des Vorteils gehört zur Methode ab 5.0.",
        path: ["businessMoat"],
      });
    if (
      input.businessDescription.length < BUSINESS_ANALYSIS_MIN_LENGTH &&
      !input.businessMoat
    )
      ctx.addIssue({
        code: "custom",
        message:
          "Bitte Ihr Business oder Ihren besonderen Vorteil beschreiben.",
        path: ["businessDescription"],
      });
  });
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

export const moatReviewSchema = z
  .object({
    verdict: z.enum(["replaceable", "conditional", "durable", "unclear"]),
    pace: z.enum([
      "feature_update",
      "better_agents",
      "external_hurdle",
      "unclear",
    ]),
    reason: z
      .string()
      .min(1)
      .max(180)
      .describe(
        "Ein kurzer Satz: konkreter Übernahmeweg oder entscheidende Schutzbedingung, höchstens 25 Wörter.",
      ),
    basisQuote: z
      .string()
      .min(1)
      .max(240)
      .describe(
        "Exakter zusammenhängender Ausschnitt aus businessMoat, nie aus einer anderen Quelle.",
      ),
  })
  .strict();
export type MoatReview = z.infer<typeof moatReviewSchema>;
export const analysisWithMoatSchema = analysisResultSchema
  .extend({ moatReview: moatReviewSchema })
  .strict();
export const expertAnalysisResultSchema = analysisResultSchema
  .extend({
    expertReview: z
      .object({
        customer: findingSchema.describe(
          "Der Kunde nutzt sein eigenes Expertenteam: konkrete Selbstbedienung statt Kauf. Höchstens 16 Wörter.",
        ),
        competitor: findingSchema.describe(
          "Ein bekannter Wettbewerber nutzt dasselbe Expertenteam: konkreter Preis- oder Leistungsvorteil. Höchstens 16 Wörter.",
        ),
        newEntrant: findingSchema.describe(
          "Ein plausibler neuer Anbieter aus einer anderen Branche löst das Problem anders. Hypothese, keine erfundene Firma. Höchstens 16 Wörter.",
        ),
        access: findingSchema.describe(
          "Welche Daten, Rechte oder Zugänge ein Experte für die alternative Lösung braucht; Verfügbarkeit nicht erfinden.",
        ),
        incentive: findingSchema.describe(
          "Konkreter wirtschaftlicher Anreiz für Anbieter, Kunden oder Wettbewerber; Aufwand und fehlende Angaben beachten.",
        ),
      })
      .strict(),
    moatReview: moatReviewSchema.nullable(),
  })
  .strict();
export const MOAT_VERDICTS: Record<MoatReview["verdict"], string> = {
  replaceable: "Leicht ersetzbar",
  conditional: "Schutz nur unter Bedingungen",
  durable: "Auch für starke KI eine Hürde",
  unclear: "Noch nicht bewertbar",
};
export const MOAT_PACES: Record<MoatReview["pace"], string> = {
  feature_update: "Ein Funktionsupdate könnte reichen.",
  better_agents: "Mit besseren Agenten angreifbar.",
  external_hurdle: "Mehr Intelligenz allein genügt nicht.",
  unclear: "Tempo offen.",
};

export const businessAnalysisSchema = z
  .object({
    version: z.enum([
      "business-analysis-1.0",
      BUSINESS_ANALYSIS_VERSION,
      BUSINESS_MOAT_ANALYSIS_VERSION,
      BUSINESS_EXPERT_ANALYSIS_VERSION,
    ]),
    createdAt: z.iso.datetime({ offset: true }),
    model: z.string().min(1).max(120),
    input: analysisInputSchema,
    result: z.union([
      expertAnalysisResultSchema,
      analysisWithMoatSchema,
      analysisResultSchema,
    ]),
  })
  .strict()
  .superRefine((analysis, ctx) => {
    if (
      analysis.input.methodologyVersion === "quick-check-5.0" &&
      analysis.version === "business-analysis-1.0"
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Die neue Methode benötigt die neue KI-Auswertung.",
        path: ["version"],
      });
    }
    const expert = analysis.input.methodologyVersion === "quick-check-6.0";
    if (
      expert !== (analysis.version === BUSINESS_EXPERT_ANALYSIS_VERSION) ||
      expert !== "expertReview" in analysis.result
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Das Expertenszenario benötigt die passende Auswertung 4.0.",
        path: ["version"],
      });
    }
    const moatReview =
      "moatReview" in analysis.result ? analysis.result.moatReview : null;
    const hasMoat = Boolean(analysis.input.businessMoat);
    if (
      expert
        ? hasMoat !== (moatReview !== null)
        : (analysis.version === BUSINESS_MOAT_ANALYSIS_VERSION) !==
            (hasMoat && moatReview !== null) ||
          (analysis.version !== BUSINESS_MOAT_ANALYSIS_VERSION &&
            (hasMoat || moatReview !== null))
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Die Vorteilsprüfung muss zum eingegebenen Vorteil und zur Ausgabeversion passen.",
        path: ["result"],
      });
    }
    if (moatReview) {
      if (!analysis.input.businessMoat?.includes(moatReview.basisQuote))
        ctx.addIssue({
          code: "custom",
          message: "Das Zitat steht nicht im angegebenen Vorteil.",
          path: ["result", "moatReview"],
        });
      if (
        moatReview.verdict === "unclear" &&
        (moatReview.pace !== "unclear" ||
          analysis.result.openQuestions.length === 0)
      )
        ctx.addIssue({
          code: "custom",
          message:
            "Ein unklarer Vorteil braucht eine Rückfrage und ein offenes Tempo.",
          path: ["result", "moatReview"],
        });
      if (
        moatReview.verdict === "durable" &&
        moatReview.pace !== "external_hurdle"
      )
        ctx.addIssue({
          code: "custom",
          message: "Eine verbleibende Hürde braucht eine Schutzbedingung.",
          path: ["result", "moatReview"],
        });
      if (
        moatReview.verdict === "replaceable" &&
        !["feature_update", "better_agents"].includes(moatReview.pace)
      )
        ctx.addIssue({
          code: "custom",
          message:
            "Ein ersetzbarer Vorteil braucht einen passenden Übernahmeweg.",
          path: ["result", "moatReview"],
        });
    }
    const findings = [
      ...analysis.result.takeover,
      ...analysis.result.protection,
      analysis.result.opportunity,
      analysis.result.nextStep,
      ...("expertReview" in analysis.result
        ? Object.values(analysis.result.expertReview)
        : []),
    ];
    const visible = [
      analysis.result.headline,
      analysis.result.summary,
      ...findings.flatMap((finding) => [finding.title, finding.detail]),
      ...analysis.result.openQuestions,
      ...(moatReview ? [moatReview.reason] : []),
    ].join(" ");
    if (
      visible.trim().split(/\s+/).length > (expert ? 240 : 180) ||
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
        !analysis.input.businessDescription.includes(finding.basisQuote) &&
        !analysis.input.businessMoat?.includes(finding.basisQuote)
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Ein Herkunftszitat steht nicht in Ihren Angaben.",
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
  if (!supportsBusinessAnalysis(check.methodologyVersion)) return null;
  const parsed = analysisInputSchema.safeParse({
    methodologyVersion: check.methodologyVersion,
    businessDescription: check.businessDescription ?? "",
    ...(check.businessMoat?.trim() ? { businessMoat: check.businessMoat } : {}),
    answers: Object.fromEntries(ids.map((id) => [id, check.answers[id]])),
    scenario: check.providerScenario ?? DEFAULT_PROVIDER_SCENARIO,
  });
  return parsed.success ? parsed.data : null;
}

export function analysisInputKey(input: BusinessAnalysisInput) {
  return JSON.stringify({
    methodologyVersion: input.methodologyVersion,
    businessDescription: input.businessDescription.trim(),
    businessMoat: input.businessMoat?.trim() ?? "",
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

export function expertReviewFor(analysis: BusinessAnalysis | null | undefined) {
  return analysis && "expertReview" in analysis.result
    ? analysis.result.expertReview
    : null;
}
export function moatReviewFor(
  analysis: BusinessAnalysis | null | undefined,
): MoatReview | null {
  return analysis && "moatReview" in analysis.result
    ? analysis.result.moatReview
    : null;
}
export function expertMoatHeadline(
  analysis: BusinessAnalysis | null | undefined,
) {
  if (analysis?.input.methodologyVersion !== "quick-check-6.0") return null;
  const review = moatReviewFor(analysis);
  if (!review) return null;
  return {
    replaceable: "Ihr genannter Burggraben ist angreifbar.",
    conditional: "Ihr Burggraben hält nur unter Bedingungen.",
    durable: "Ihr Burggraben bleibt auch für Expertenteams eine Hürde.",
    unclear: "Ihr Burggraben ist noch nicht bewertbar.",
  }[review.verdict];
}
export function moatDisputesScore(
  analysis: BusinessAnalysis | null | undefined,
  score: number | null,
) {
  return (
    moatReviewFor(analysis)?.verdict === "replaceable" &&
    score !== null &&
    score < 65
  );
}
export function quoteSource(
  analysis: BusinessAnalysis,
  finding: BusinessFinding,
) {
  return finding.basisQuote &&
    !analysis.input.businessDescription.includes(finding.basisQuote) &&
    analysis.input.businessMoat?.includes(finding.basisQuote)
    ? "Ihr Vorteil"
    : "Ihre Beschreibung";
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
