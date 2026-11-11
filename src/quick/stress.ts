import { z } from "zod";
import type { QuickCheck, QuickQuestion } from "./model.js";
import {
  BUSINESS_DESCRIPTION_MAX_LENGTH,
  BUSINESS_MOAT_MAX_LENGTH,
} from "./business-description.js";

// Method 8.0: a reverse stress test. It does not ask how likely failure is,
// it asks which scenario breaks the business. No score, no probability.
// 8.0 is published and frozen. 8.1 swaps the network question (S7) for
// verifiability (S11); every other question, rule and weight is unchanged.
export const STRESS_METHOD_8_0 = "quick-check-8.0";
export const STRESS_METHOD = "quick-check-8.1";
export const STRESS_ANALYSIS_VERSION = "stress-analysis-1.0";
export const STRESS_ANALYSIS_MODEL = "openai/gpt-5.2";
export const STRESS_ANALYSIS_MIN_LENGTH = 20;
export const isStressMethod = (version: string) =>
  version === STRESS_METHOD || version === STRESS_METHOD_8_0;

export const STRESS_PREMISE =
  "Angenommen, das Szenario tritt ein. Was bleibt dann von Ihrem Geschäft?";

// Scenario C has the capability of B and differs only in the time left to react.
export const STRESS_SCENARIOS = [
  {
    id: "today",
    letter: "A",
    title: "Heutige KI für alle",
    when: "in 6–12 Monaten",
    text: "Die Spitzenmodelle werden nicht klüger. Offene Modelle ziehen gleich. Jeder kann beliebig viele Agenten auf heutigem Niveau einsetzen.",
  },
  {
    id: "expert",
    letter: "B",
    title: "Spitzenniveau in jedem Fach",
    when: "in 12–18 Monaten",
    text: "KI verbessert sich selbst und arbeitet in allen Fachgebieten auf Nobelpreis-Niveau. Für alle, günstig und parallel.",
  },
  {
    id: "fast",
    letter: "C",
    title: "Dasselbe in sechs Monaten",
    when: "in 6 Monaten",
    text: "Wie B, nur schneller. Zum Umbauen bleibt kaum Zeit.",
  },
] as const;
export type StressScenarioId = (typeof STRESS_SCENARIOS)[number]["id"];

export const STRESS_IDS = [
  "S1",
  "S2",
  "S3",
  "S4",
  "S5",
  "S6",
  "S7",
  "S8",
  "S9",
  "S10",
  "S11",
] as const;
export type StressId = (typeof STRESS_IDS)[number];

// Option 1 is always the most exposed answer, option 3 the most protected.
const question = (
  id: StressId,
  group: QuickQuestion["group"],
  text: string,
  options: [string, string, string],
  help: string,
  action: string,
  actionDetail: string,
): QuickQuestion => ({
  id,
  group,
  text,
  low: options[0],
  high: options[2],
  help,
  // Key order matches the stored schema so exports compare equal.
  options,
  action,
  actionDetail,
});
export const STRESS_QUESTIONS_8_0: QuickQuestion[] = [
  question(
    "S1",
    "value",
    "Was nimmt Ihr Kunde am Ende ab?",
    [
      "Ein rein digitales Ergebnis",
      "Digitales Ergebnis plus Arbeit vor Ort",
      "Vor allem Arbeit vor Ort",
    ],
    "Datei, Text, Software oder Auswertung sind digital. Montage, Transport, Behandlung oder Messung finden vor Ort statt.",
    "In die echte Welt verlängern",
    "Koppeln Sie Ihr digitales Ergebnis an Umsetzung, Hardware oder Service vor Ort. Was dort geschieht, kann keine Software allein liefern.",
  ),
  question(
    "S2",
    "value",
    "Schafft heutige KI einen typischen Auftrag?",
    [
      "Ja, brauchbar",
      "Teilweise, mit Nacharbeit",
      "Nein, getestet und gescheitert",
    ],
    "Noch nicht ausprobiert? Dann „Weiß ich nicht“. Ein Versuch mit einem aktuellen Modell dauert 30 Minuten.",
    "Selbst der Angreifer sein",
    "Bauen Sie die KI-Version Ihres Angebots, bevor es ein anderer tut. Wer sich selbst angreift, kennt den Angriff zuerst.",
  ),
  question(
    "S3",
    "value",
    "Wie viel Ihres Werts steckt in der Bedienung?",
    ["Fast alles", "Ein Teil", "Kaum etwas"],
    "Wenn ein KI-Agent Ihr Programm bedient oder umgeht: Bleibt dahinter etwas, wofür jemand zahlt?",
    "Hinter den Agenten rücken",
    "Machen Sie Ihre Leistung für KI-Agenten bestellbar und verdienen Sie am Ergebnis statt an der Bedienung.",
  ),
  question(
    "S4",
    "advantage",
    "Entstehen bei Ihnen laufend Daten, die sonst niemand hat?",
    [
      "Nein",
      "Ja, aber andere könnten ähnliche sammeln",
      "Ja, exklusiv und laufend",
    ],
    "Gemeint sind Daten aus Ihrem eigenen Betrieb: Messungen, Nutzungsdaten, Fallhistorien. Öffentlich verfügbares Wissen zählt nicht.",
    "Eigene Daten aufbauen",
    "Erheben Sie laufend Daten, die nur in Ihrem Betrieb entstehen, und sichern Sie sich die Rechte daran.",
  ),
  question(
    "S5",
    "advantage",
    "Braucht Ihre Leistung eine Zulassung, ein Recht oder Ihre Haftung?",
    ["Nein", "Ja, aber viele haben sie", "Ja, und sie ist schwer zu bekommen"],
    "Zum Beispiel Zertifizierung, Lizenz, exklusives Nutzungsrecht, Garantie oder persönliche Unterschrift.",
    "Verantwortung übernehmen",
    "Bieten Sie Haftung, Zertifizierung oder Garantie an. Eine KI kann rechnen, aber nicht geradestehen.",
  ),
  question(
    "S6",
    "advantage",
    "Kaufen Kunden wegen einer persönlichen Beziehung zu Ihnen?",
    [
      "Nein, wegen des Ergebnisses",
      "Teilweise",
      "Ja, ohne Vertrauen kein Auftrag",
    ],
    "Gemeint sind feste Ansprechpartner, gewachsenes Vertrauen und Empfehlungen, nicht eine bekannte Marke allein.",
    "Beziehungen vertiefen",
    "Machen Sie aus Käufern persönliche Kundenbeziehungen: feste Ansprechpartner, Termine vor Ort, gemeinsame Planung.",
  ),
  question(
    "S7",
    "advantage",
    "Wird Ihr Angebot besser, je mehr Kunden es nutzen?",
    ["Nein", "Etwas", "Ja, deutlich"],
    "Zum Beispiel ein Marktplatz, ein Netzwerk oder gemeinsame Daten, von denen jeder weitere Kunde profitiert.",
    "Kunden vernetzen",
    "Schaffen Sie einen Nutzen, der mit jedem weiteren Kunden wächst. Ein Netzwerk lässt sich nicht nachprogrammieren.",
  ),
  question(
    "S8",
    "control",
    "Wie kommen Kunden zu Ihnen?",
    [
      "Über eine Plattform oder Suche",
      "Gemischt",
      "Direkt, über eigene Kontakte und Verträge",
    ],
    "Wer kann Sie aus der Auswahl nehmen? Wem gehört der Kundenkontakt?",
    "Eigenen Kundenstamm sichern",
    "Bauen Sie Direktverträge und einen eigenen Kundenstamm auf, statt von einer Plattform oder einem Vermittler abzuhängen.",
  ),
  question(
    "S9",
    "control",
    "Wie schnell kann ein Kunde wechseln?",
    ["Sofort", "Mit spürbarem Aufwand", "Erst nach Jahren"],
    "Zählen Sie Verträge, eingebaute Technik, Schulung und Datenumzug. Bindung verschafft Zeit, keinen Schutz.",
    "Tiefer in die Abläufe des Kunden",
    "Verankern Sie Ihre Leistung in den Abläufen des Kunden. Das verschafft Zeit zum Umbauen, ersetzt aber keinen Schutz.",
  ),
  question(
    "S10",
    "control",
    "Haben Kunden verglichen und trotzdem bei Ihnen gekauft?",
    ["Noch nicht getestet", "Einzelne Fälle", "Mehrfach"],
    "Gemeint sind echte Käufe nach einem Vergleich mit KI oder anderen Anbietern. Bei einer Idee ohne Kunden: „Noch nicht getestet“.",
    "Den Kaufgrund testen",
    "Zeigen Sie drei Kunden die beste KI-Alternative. Wofür zahlen sie trotzdem bei Ihnen?",
  ),
];
const VERIFIABLE = question(
  "S11",
  "value",
  "Lässt sich Ihr Ergebnis eindeutig als richtig oder falsch prüfen?",
  ["Ja, eindeutig", "Teilweise", "Nein, es hängt an Urteil und Vertrauen"],
  "KI wird dort am schnellsten besser, wo sich das Ergebnis klar nachprüfen lässt: Code läuft oder nicht, eine Rechnung stimmt oder nicht. Bei Geschmack, Abwägung und Verantwortung geht es langsamer.",
  "Auf Urteil und Verantwortung setzen",
  "Verlagern Sie Ihr Angebot dorthin, wo niemand das Ergebnis einfach nachmessen kann: Abwägung, Einschätzung, Verantwortung für die Folgen.",
);
const byId = (id: StressId) => STRESS_QUESTIONS_8_0.find((q) => q.id === id)!;
export const STRESS_QUESTIONS: QuickQuestion[] = [
  byId("S1"),
  byId("S2"),
  VERIFIABLE,
  byId("S3"),
  byId("S4"),
  byId("S5"),
  byId("S6"),
  byId("S8"),
  byId("S9"),
  byId("S10"),
];
export const stressQuestionsFor = (version: string) =>
  version === STRESS_METHOD_8_0 ? STRESS_QUESTIONS_8_0 : STRESS_QUESTIONS;
// Disclosed judgment weights for the resilience score; each method uses ten
// of them and they sum to 100 (8.0 without S11, 8.1 without S7).
export const STRESS_WEIGHTS: Record<StressId, number> = {
  S1: 15,
  S2: 10,
  S3: 10,
  S4: 15,
  S5: 10,
  S6: 10,
  S7: 10,
  S8: 10,
  S9: 5,
  S10: 5,
  S11: 10,
};
// What does not consist of intelligence: data, rights, relationships, network.
const SHIELD_IDS: StressId[] = ["S4", "S5", "S6", "S7"];

export type StressStatus = "breaks" | "pressure" | "holds" | "open";
export const STRESS_STATUS_LABELS: Record<StressStatus, string> = {
  breaks: "Kippt",
  pressure: "Unter Druck",
  holds: "Trägt",
  open: "Offen",
};
const severity: Record<StressStatus, number> = {
  open: 0,
  holds: 1,
  pressure: 2,
  breaks: 3,
};

const numeric = (check: QuickCheck, id: StressId) =>
  typeof check.answers[id] === "number" ? (check.answers[id] as number) : null;

// Rule-only verdicts. Deliberately coarse: three states per scenario.
function ruleVerdicts(check: QuickCheck) {
  const result = numeric(check, "S1");
  const today = numeric(check, "S2");
  const shields = SHIELD_IDS.map((id) => numeric(check, id));
  // An unknown shield never counts as protection; all unknown stays open.
  const asset = shields.every((v) => v === null)
    ? null
    : Math.max(...shields.map((v) => v ?? 1));
  let expert: StressStatus, expertReason: string;
  if (result === null || asset === null) {
    expert = "open";
    expertReason =
      "Ergebnis und eigener Beitrag sind noch offen. Ohne sie lässt sich das Szenario nicht durchspielen.";
  } else if (asset === 3) {
    expert = "holds";
    expertReason =
      "Was nur Sie haben, entsteht nicht durch mehr Intelligenz. Dafür könnten Kunden weiter zahlen.";
  } else if (result === 1 && asset === 1) {
    expert = "breaks";
    expertReason =
      "Ein Agent liefert das digitale Ergebnis direkt. Nichts außerhalb der Intelligenz hält den Kunden bei Ihnen.";
  } else if (result === 3 && asset === 2) {
    expert = "holds";
    expertReason =
      "Die Arbeit vor Ort bleibt nötig. Ein Agent kann sie aber auch bei anderen bestellen.";
  } else {
    expert = "pressure";
    expertReason =
      asset === 2
        ? "Ihr besonderer Beitrag lässt sich auch anderswo beschaffen. Ein Agent vergleicht und wechselt."
        : "Der digitale Teil Ihrer Leistung fällt weg. Die Arbeit vor Ort bleibt, ist aber austauschbar.";
  }
  let now: StressStatus, nowReason: string;
  if (expert === "open" || expert === "holds") {
    now = expert;
    nowReason = expertReason;
  } else if (today === null) {
    now = "open";
    nowReason =
      "Ob heutige KI Ihren Auftrag schafft, ist ungetestet. Dieser Test entscheidet das Szenario.";
  } else if (today === 3) {
    now = "holds";
    nowReason =
      "Heutige KI scheitert laut Ihrem Test am Auftrag. Das schützt nur, solange sie nicht besser wird.";
  } else if (today === 2) {
    now = "pressure";
    nowReason =
      "Heutige KI schafft den Auftrag mit Nacharbeit. Diese Nacharbeit ist Ihr verbleibender Vorsprung.";
  } else {
    now = expert;
    nowReason =
      expert === "breaks"
        ? "Heutige KI schafft den Auftrag bereits. Sobald sie jeder hat, braucht Sie niemand mehr dafür."
        : expertReason;
  }
  return {
    today: { status: now, reason: nowReason },
    expert: { status: expert, reason: expertReason },
  };
}

export const STRESS_BANDS = [
  { id: "low", label: "Akut gefährdet", from: 0 },
  { id: "medium", label: "Angreifbar", from: 35 },
  { id: "high", label: "Robust", from: 65 },
] as const;

export function evaluateStress(check: QuickCheck) {
  const rules = ruleVerdicts(check);
  const analysis = currentStressAnalysis(check);
  const ai = analysis?.result ?? null;
  const unclear =
    ai?.today.status === "unclear" || ai?.expert.status === "unclear";
  // The harsher verdict wins, so optimistic answers cannot talk a risk down
  // once the description has been read. An unclear description opens everything.
  const combine = (
    rule: { status: StressStatus; reason: string },
    own: { status: string; detail: string } | undefined,
  ) => {
    if (!own) return { ...rule, disputed: false };
    if (unclear)
      return {
        status: "open" as StressStatus,
        reason: own.detail,
        disputed: false,
      };
    const status = own.status as StressStatus;
    if (rule.status === "open")
      return { status, reason: own.detail, disputed: false };
    return severity[status] >= severity[rule.status]
      ? {
          status,
          reason: own.detail,
          disputed: severity[status] > severity[rule.status],
        }
      : { ...rule, disputed: false };
  };
  const today = combine(rules.today, ai?.today);
  const expert = combine(rules.expert, ai?.expert);
  const scenarios = STRESS_SCENARIOS.map((scenario) => ({
    ...scenario,
    ...(scenario.id === "today"
      ? today
      : scenario.id === "expert"
        ? expert
        : {
            ...expert,
            reason:
              expert.status === "holds"
                ? "Gleiches Ergebnis wie in B. Das Tempo ändert nichts an dem, was nur Sie haben."
                : expert.status === "open"
                  ? "Gleiches Ergebnis wie in B, sobald die Angaben vorliegen."
                  : "Gleiches Ergebnis wie in B. Sie hätten nur ein halbes Jahr zum Umbauen.",
          }),
  }));
  const proof = numeric(check, "S10");
  const switching = numeric(check, "S9");
  // "Holds" that rests on an untested claim is shown as a claim, not a finding.
  const claimed =
    expert.status === "holds" &&
    (proof === null || proof < 3) &&
    ai?.claim?.verdict !== "durable";
  const first = scenarios.find((s) => s.status === "breaks");
  const pressured = scenarios.find((s) => s.status === "pressure");
  const open = scenarios.some((s) => s.status === "open");
  // Resilience score: weighted answers, then held inside the band that matches
  // the scenario verdicts. The verdicts lead; the number only makes them tangible.
  const raw = check.methodologySnapshot.reduce((sum, q) => {
    const id = q.id as StressId;
    const value = numeric(check, id);
    return sum + (value === null ? 0 : (STRESS_WEIGHTS[id] * (value - 1)) / 2);
  }, 0);
  const [floor, cap] =
    today.status === "breaks"
      ? [0, 20]
      : expert.status === "breaks"
        ? [15, 35]
        : today.status === "pressure"
          ? [25, 55]
          : expert.status === "pressure"
            ? [40, 65]
            : claimed
              ? [60, 80]
              : [65, 100];
  const score =
    unclear || expert.status === "open"
      ? null
      : Math.round(Math.min(cap, Math.max(floor, raw)) / 5) * 5;
  const band =
    score === null
      ? null
      : [...STRESS_BANDS].reverse().find((b) => score >= b.from)!;
  const headline = unclear
    ? "Ihr Geschäft ist so noch nicht bewertbar."
    : first?.id === "today"
      ? "Ihr Geschäft kippt schon mit heutiger KI."
      : first
        ? "Ihr Geschäft kippt, sobald KI auf Spitzenniveau arbeitet."
        : pressured?.id === "today"
          ? "Ihr Geschäft gerät schon mit heutiger KI unter Druck."
          : pressured
            ? "Ihr Geschäft gerät unter Druck, sobald KI auf Spitzenniveau arbeitet."
            : open
              ? "Für den Stresstest fehlen noch Angaben."
              : claimed
                ? "Ihr Schutz trägt, wenn Ihre Angaben stimmen."
                : "Ihr Schutz besteht nicht aus Intelligenz. Er trägt.";
  const time =
    !first && !pressured
      ? null
      : switching === 3
        ? "Ihre Kunden sind über Jahre gebunden. Das verschafft Zeit zum Umbauen, aber keinen Schutz."
        : switching === 2
          ? "Der Wechsel kostet Ihre Kunden Aufwand. Das verschafft etwas Zeit, aber keinen Schutz."
          : switching === 1
            ? "Ihre Kunden können sofort wechseln. Es bleibt keine Schonfrist."
            : "Wie schnell Kunden wechseln können, ist offen.";
  const nextStep = unclear
    ? "Beschreiben Sie in einem Satz, was ein Kunde bei Ihnen kauft."
    : numeric(check, "S2") === null
      ? "Lassen Sie ein aktuelles Modell einen typischen Auftrag komplett erledigen. 30 Minuten genügen."
      : first || pressured
        ? "Lassen Sie einen Agenten einen typischen Auftrag ohne Ihr Produkt lösen. Vergleichen Sie Ergebnis, Zeit und Kosten."
        : claimed
          ? "Zeigen Sie drei Kunden die beste Alternative. Kaufen sie trotzdem bei Ihnen?"
          : "Prüfen Sie jährlich, ob das, was nur Sie haben, noch exklusiv ist.";
  // General advice from the weakest answers, heaviest weight first.
  const weakest = (level: number) =>
    check.methodologySnapshot
      .filter((q) => numeric(check, q.id as StressId) === level)
      .sort(
        (a, b) =>
          STRESS_WEIGHTS[b.id as StressId] - STRESS_WEIGHTS[a.id as StressId],
      )
      .map((q) => ({ id: q.id, title: q.action, detail: q.actionDetail }));
  const general = [...weakest(1), ...weakest(2)].slice(0, 4);
  const unknown = check.methodologySnapshot.filter(
    (q) => typeof check.answers[q.id] !== "number",
  );
  return {
    scenarios,
    headline,
    score,
    band,
    // Short label for lists: the earliest scenario that breaks or pressures.
    short: unclear
      ? "Nicht bewertbar"
      : first
        ? `Kippt in ${first.letter}`
        : pressured
          ? `Druck ab ${pressured.letter}`
          : open
            ? "Offen"
            : claimed
              ? "Trägt laut Angaben"
              : "Trägt",
    tone:
      unclear || open
        ? "unknown"
        : first
          ? "high"
          : pressured
            ? "medium"
            : "low",
    claimed,
    disputed: scenarios.some((s) => s.disputed),
    time,
    nextStep,
    recommendations: {
      own: unclear ? [] : (ai?.recommendations ?? []),
      general,
    },
    basis: analysis
      ? "Ihre Antworten und die KI-Prüfung Ihrer Beschreibung"
      : "Ihre zehn Antworten, ungeprüft",
    unknown,
    answered: check.methodologySnapshot.length - unknown.length,
    analysis,
  };
}
export type StressEvaluation = ReturnType<typeof evaluateStress>;

const stressAnswer = z.union([
  z.number().int().min(1).max(3),
  z.literal("unknown"),
  z.null(),
]);
const idsOf = (questions: QuickQuestion[]) =>
  questions.map((q) => q.id) as [StressId, ...StressId[]];
export const stressAnswersSchema = z.union([
  z.record(z.enum(idsOf(STRESS_QUESTIONS)), stressAnswer),
  z.record(z.enum(idsOf(STRESS_QUESTIONS_8_0)), stressAnswer),
]);
export const stressInputSchema = z
  .object({
    methodologyVersion: z.enum([STRESS_METHOD_8_0, STRESS_METHOD]),
    businessDescription: z.string().trim().max(BUSINESS_DESCRIPTION_MAX_LENGTH),
    businessMoat: z.string().trim().max(BUSINESS_MOAT_MAX_LENGTH).optional(),
    answers: stressAnswersSchema,
  })
  .strict()
  .refine(
    (input) =>
      input.businessDescription.length >= STRESS_ANALYSIS_MIN_LENGTH ||
      Boolean(input.businessMoat),
    "Bitte Ihr Geschäft oder Ihren Schutz beschreiben.",
  )
  .refine(
    (input) =>
      stressQuestionsFor(input.methodologyVersion).every(
        (q) => q.id in input.answers,
      ),
    "Die Antworten müssen zur Methodenversion passen.",
  );
const answerOf = (input: { answers: object }, id: string) =>
  (input.answers as Record<string, unknown>)[id];
export type StressInput = z.infer<typeof stressInputSchema>;

const verdictSchema = z
  .object({
    status: z.enum(["breaks", "pressure", "holds", "unclear"]),
    detail: z.string().min(1).max(420),
  })
  .strict();
export const stressResultSchema = z
  .object({
    obituary: z.string().min(1).max(1200),
    today: verdictSchema,
    expert: verdictSchema,
    madeOfIntelligence: z.array(z.string().min(1).max(110)).max(3),
    notMadeOfIntelligence: z.array(z.string().min(1).max(110)).max(3),
    claim: z
      .object({
        verdict: z.enum(["replaceable", "conditional", "durable", "unclear"]),
        reason: z.string().min(1).max(220),
      })
      .strict()
      .nullable(),
    remains: z.string().min(1).max(320),
    recommendations: z.array(z.string().min(1).max(260)).max(4),
    attackBrief: z.string().min(1).max(900),
    doubts: z
      .array(
        z
          .object({
            questionId: z.enum(STRESS_IDS),
            reason: z.string().min(1).max(200),
          })
          .strict(),
      )
      .max(2),
    openQuestion: z.string().min(1).max(320).nullable(),
  })
  .strict();
export type StressResult = z.infer<typeof stressResultSchema>;

export const stressAnalysisSchema = z
  .object({
    version: z.literal(STRESS_ANALYSIS_VERSION),
    createdAt: z.iso.datetime({ offset: true }),
    model: z.string().min(1).max(120),
    input: stressInputSchema,
    result: stressResultSchema,
  })
  .strict()
  .superRefine((analysis, ctx) => {
    const r = analysis.result;
    const issue = (message: string) =>
      ctx.addIssue({ code: "custom", message });
    if (Boolean(analysis.input.businessMoat) !== (r.claim !== null))
      issue("Die Prüfung des Schutzes muss zum eingegebenen Schutz passen.");
    const unclear =
      r.today.status === "unclear" || r.expert.status === "unclear";
    if (unclear && (r.today.status !== r.expert.status || !r.openQuestion))
      issue("Eine unklare Beschreibung braucht genau eine Rückfrage.");
    // More capability can never make a business safer than less capability.
    if (
      !unclear &&
      severity[r.expert.status as StressStatus] <
        severity[r.today.status as StressStatus]
    )
      issue("Das stärkere Szenario kann nicht milder ausfallen.");
    if (new Set(r.doubts.map((d) => d.questionId)).size !== r.doubts.length)
      issue("Jede Antwort wird höchstens einmal beanstandet.");
    if (
      r.doubts.some(
        (d) => typeof answerOf(analysis.input, d.questionId) !== "number",
      )
    )
      issue("Die Rückfrage muss eine gegebene Antwort betreffen.");
    const visible = [
      r.obituary,
      r.today.detail,
      r.expert.detail,
      ...r.madeOfIntelligence,
      ...r.notMadeOfIntelligence,
      r.claim?.reason ?? "",
      r.remains,
      ...r.recommendations,
      r.attackBrief,
      ...r.doubts.map((d) => d.reason),
      r.openQuestion ?? "",
    ].join(" ");
    if (/\bS(?:1[01]|[1-9])\b/.test(visible))
      issue("Ergebnis enthält technische Frage-IDs.");
    if (visible.trim().split(/\s+/).length > 700) issue("Ergebnis zu lang.");
  });
export type StressAnalysis = z.infer<typeof stressAnalysisSchema>;

export function stressInputFor(check: QuickCheck): StressInput | null {
  if (!isStressMethod(check.methodologyVersion)) return null;
  const parsed = stressInputSchema.safeParse({
    methodologyVersion: check.methodologyVersion,
    businessDescription: check.businessDescription ?? "",
    ...(check.businessMoat?.trim() ? { businessMoat: check.businessMoat } : {}),
    answers: Object.fromEntries(
      stressQuestionsFor(check.methodologyVersion).map((q) => [
        q.id,
        check.answers[q.id],
      ]),
    ),
  });
  return parsed.success ? parsed.data : null;
}
export function stressInputKey(input: StressInput) {
  return JSON.stringify([
    input.businessDescription.trim(),
    input.businessMoat?.trim() ?? "",
    stressQuestionsFor(input.methodologyVersion).map((q) => [
      q.id,
      answerOf(input, q.id),
    ]),
  ]);
}
export function stressAnalysisMatches(
  check: QuickCheck,
  analysis: StressAnalysis,
) {
  const input = stressInputFor(check);
  return (
    input !== null && stressInputKey(input) === stressInputKey(analysis.input)
  );
}
export function currentStressAnalysis(check: QuickCheck) {
  return check.stressAnalysis &&
    stressAnalysisMatches(check, check.stressAnalysis)
    ? check.stressAnalysis
    : null;
}

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });

// A workshop sends many requests at once from one network. Busy responses are
// retried with growing, jittered pauses instead of failing on the first attempt.
export async function requestStressAnalysis(
  input: StressInput,
  {
    signal,
    fetcher = fetch,
    pauses = [3000, 7000, 12000],
  }: { signal?: AbortSignal; fetcher?: typeof fetch; pauses?: number[] } = {},
): Promise<StressAnalysis> {
  const body = JSON.stringify(stressInputSchema.parse(input));
  for (let attempt = 0; ; attempt++) {
    signal?.throwIfAborted();
    const response = await fetcher("/api/stress-analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      signal,
    });
    if (response.ok) {
      const parsed = stressAnalysisSchema.safeParse(
        await response.json().catch(() => null),
      );
      if (!parsed.success)
        throw new Error(
          "Die KI-Antwort war unvollständig. Bitte erneut versuchen.",
        );
      if (stressInputKey(input) !== stressInputKey(parsed.data.input))
        throw new Error(
          "Die Auswertung passt nicht zu Ihren aktuellen Angaben.",
        );
      return parsed.data;
    }
    const busy = [429, 502, 503].includes(response.status);
    if (!busy || attempt >= pauses.length)
      throw new Error(
        busy
          ? "Gerade prüfen viele gleichzeitig. Bitte in einer Minute erneut versuchen."
          : "Die Auswertung hat nicht geklappt. Bitte erneut versuchen.",
      );
    await wait(pauses[attempt] * (0.7 + Math.random() * 0.6), signal);
  }
}
