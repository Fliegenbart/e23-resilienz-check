import { z } from "zod";
import { METHOD, SCHEMA_VERSION } from "../methodology/config";
import type { Assessment, AssessmentContent } from "./types";
const str = z.string().max(100000),
  id = z.string().min(1).max(200),
  date = z.union([z.iso.date(), z.iso.datetime({ offset: true })]);
const arr = <T extends z.ZodType>(t: T) => z.array(t).max(2000);
const number = z.number(),
  rev = z.number().int().positive(),
  nullableDate = date.nullable();
const qid = z.string().regex(/^[A-Z][0-9]{1,3}$/);
const rating = z.enum(["low", "medium", "high"]);
const link = z.object({
  evidenceId: id,
  relation: z.enum(["supports", "contradicts", "context"]),
  explanation: str,
});
const stamp = z.object({
  reviewedBy: str,
  reviewedAt: date,
  subjectRevision: rev,
  evidenceRevisions: z.record(id, rev),
});
const position = z.object({
  person: str,
  rating: rating.nullable(),
  rationale: str,
  evidenceLinks: arr(link),
  recordedAt: date,
});
const answer = z.object({
  questionId: qid,
  revision: rev,
  state: z.enum(["unanswered", "unknown", "rated", "not_applicable"]),
  rating: rating.nullable(),
  rationale: str,
  evidenceLevel: z
    .enum(["assumption", "indication", "substantiated"])
    .nullable(),
  evidenceLinks: arr(link),
  scope: str,
  openCheck: str,
  criticalForDecision: z.boolean(),
  valueStepIds: arr(id),
  notApplicableReason: str,
  disputed: z.boolean(),
  positions: arr(position),
  substantiationReview: stamp.nullable(),
  conflictResolution: z.object({ rationale: str, review: stamp }).nullable(),
  assessedBy: str,
  assessedAt: nullableDate,
});
const evidence = z.object({
  id,
  revision: rev,
  kind: str,
  title: str,
  authorOrOrigin: str,
  url: str.nullable(),
  internalReference: str.nullable(),
  observation: str,
  eventDate: nullableDate,
  recordedAt: date,
  reviewStatus: z.enum(["unreviewed", "reviewed", "needs_review"]),
  reviewedRevision: rev.nullable(),
  reviewedBy: str.nullable(),
  reviewedAt: nullableDate,
  reviewDueAt: nullableDate,
  scopeAndLimitations: str,
  synthetic: z.boolean(),
});
const valueStep = z.object({
  id,
  title: str,
  customerValue: str,
  requiredResources: str,
  currentAIUse: str,
  alternative: str,
  critical: z.boolean(),
  openQuestions: str,
});
const threat = z.object({
  id,
  revision: rev,
  category: str,
  actor: str,
  change: str,
  valueStepIds: arr(id),
  economicMechanism: str,
  basis: z.enum(["observed", "scenario"]),
  questionIds: arr(qid),
  evidenceLinks: arr(link),
});
const protection = z.object({
  id,
  revision: rev,
  questionId: qid,
  threatId: id,
  mechanism: str,
  limitations: str,
  evidenceLinks: arr(link),
  review: stamp.nullable(),
  reviewedAnswerRevision: rev.nullable(),
  reviewedThreatRevision: rev.nullable(),
});
const baseline = z.object({
  period: z.literal("month"),
  currency: z.string().regex(/^[A-Z]{3}$/),
  revenue: number.nonnegative().nullable(),
  variableCosts: number.nonnegative().nullable(),
  fixedCosts: number.nonnegative().nullable(),
  sourceNote: str,
});
const stress = z.object({
  priceChange: number.min(-1).nullable(),
  volumeChange: number.min(-1).nullable(),
  unitVariableCostChange: number.min(-1).nullable(),
  fixedCostDelta: number.nullable(),
  oneOffCost: number.nonnegative().nullable(),
  assumptionNote: str,
  modelApplicable: z.boolean().nullable(),
});
const scenario = z.object({
  id,
  template: z.enum([
    "bundle",
    "competitor",
    "provider",
    "demand",
    "upside",
    "custom",
  ]),
  title: str,
  status: z.enum(["open", "worked", "not_applicable"]),
  notApplicableReason: str,
  assumption: str,
  horizonMonths: number.positive(),
  valueStepIds: arr(id),
  customerReaction: str,
  remainingPaidValue: str,
  response: str,
  timeAndResourceNeeds: str,
  earlyIndicator: str,
  evidenceLinks: arr(link),
  financialStress: stress.nullable(),
  openQuestions: str,
  nextCheck: str.default(""),
  owner: str.default(""),
  dueAt: nullableDate.default(null),
  affectedCustomers: str.default(""),
  affectedRevenueParts: str.default(""),
});
const action = z.object({
  id,
  title: str,
  description: str,
  linkedQuestionIds: arr(qid),
  linkedRuleIds: arr(id),
  linkedFindingIds: arr(id),
  linkedThreatIds: arr(id),
  linkedScenarioIds: arr(id),
  expectedEvidence: str,
  owner: str,
  dueAt: nullableDate,
  status: z.enum(["open", "in_progress", "done", "cancelled"]),
  effortNote: str,
});
const decision = z.object({
  recommendation: z.enum(["develop", "validate", "reorient", "pause", "open"]),
  rationale: str,
  conditions: str,
  dissent: str,
  findingResponses: arr(z.object({ findingId: id, response: str })),
  decidedBy: str,
  decidedAt: nullableDate,
  reviewDueAt: nullableDate,
  provisional: z.boolean(),
});
const content = z.object({
  actionPriority: z.number().int().min(1).max(3).default(2),
  title: str,
  customerAlias: str,
  type: z.enum(["existing", "idea"]),
  decisionQuestion: str,
  customerSegment: str,
  user: str,
  economicBuyer: str,
  customerProblem: str,
  currentAlternative: str,
  paidOutcome: str,
  revenueModel: str,
  costDescription: str,
  marketContext: str,
  excludedScope: str,
  horizonMonths: z.union([
    z.literal(6),
    z.literal(12),
    z.literal(18),
    z.literal(36),
  ]),
  owner: str,
  participants: arr(str),
  valueSteps: arr(valueStep),
  answers: z.record(qid, answer),
  evidence: arr(evidence),
  threats: arr(threat),
  protections: arr(protection),
  baseline: baseline.nullable(),
  scenarios: arr(scenario),
  actions: arr(action),
  decision,
  executiveSummary: z.object({
    mainThreat: str,
    evidencedAdvantage: str,
    keyUnknown: str,
    priorityActionIds: arr(id),
  }),
});
const method = z.object({
  version: str,
  questions: arr(
    z.object({
      id: qid,
      group: z.string().max(80),
      text: str,
      anchors: z.object({ low: str, medium: str, high: str }),
      allowsNotApplicable: z.boolean(),
      helpText: str,
    }),
  ),
  rules: arr(z.object({ id, triggerDescription: str, outputDescription: str })),
  notes: str,
});
const finding = z.object({
  findingId: id,
  ruleId: id,
  kind: z.enum(["observed", "hypothesis", "missing_information"]),
  title: str,
  rationale: str,
  triggerQuestionIds: arr(qid),
  threatIds: arr(id),
  evidenceIds: arr(id),
  suggestedCheck: str,
});
const revision = z.object({
  revisionId: id,
  revisionNumber: rev,
  createdAt: date,
  createdBy: str,
  comment: str,
  methodologyVersion: str,
  methodologySnapshot: method,
  evaluationAsOf: date,
  reviewed: z.boolean(),
  content,
  derivedFindingsSnapshot: arr(finding),
});
const assessment = z.object({
  id,
  schemaVersion: z.literal(SCHEMA_VERSION),
  methodologyVersion: str,
  methodologySnapshot: method.nullable(),
  evaluationAsOf: date,
  createdAt: date,
  updatedAt: date,
  isExample: z.boolean(),
  originAssessmentId: id.nullable(),
  status: z.enum(["draft", "in_review", "reviewed"]),
  content,
  revisions: arr(revision),
});
export const workspaceSchema = z.object({
  format: z.literal("ai-resilience-check"),
  schemaVersion: z.literal(SCHEMA_VERSION),
  appVersion: str,
  exportedAt: date,
  assessments: arr(assessment),
});
export function validateReferences(a: Assessment) {
  const validate = (c: AssessmentContent, known: boolean) => {
    const sets = {
      evidence: new Set(c.evidence.map((x) => x.id)),
      steps: new Set(c.valueSteps.map((x) => x.id)),
      threats: new Set(c.threats.map((x) => x.id)),
      scenarios: new Set(c.scenarios.map((x) => x.id)),
      actions: new Set(c.actions.map((x) => x.id)),
    };
    for (const [label, items] of Object.entries({
      evidence: c.evidence,
      steps: c.valueSteps,
      threats: c.threats,
      scenarios: c.scenarios,
      actions: c.actions,
      protections: c.protections,
    }))
      if (new Set(items.map((x) => x.id)).size !== items.length)
        throw Error(`Doppelte IDs: ${label}.`);
    const refs = (ids: string[], s: Set<string>) => {
      if (ids.some((id) => !s.has(id)))
        throw Error("Ungültiger Objektverweis im Import.");
    };
    const links = (ls: { evidenceId: string }[]) =>
      refs(
        ls.map((l) => l.evidenceId),
        sets.evidence,
      );
    if (
      known &&
      (Object.keys(c.answers).length !== 20 ||
        METHOD.questions.some((q) => !c.answers[q.id]))
    )
      throw Error("Antworten sind unvollständig.");
    for (const [key, ans] of Object.entries(c.answers)) {
      const q = METHOD.questions.find((q) => q.id === key);
      if (ans.questionId !== key)
        throw Error("Antworten sind falsch zugeordnet.");
      if ((ans.state === "rated") !== (ans.rating !== null))
        throw Error("Nur bewertete Antworten dürfen einen Anker enthalten.");
      if (
        ans.state === "not_applicable" &&
        (!ans.notApplicableReason.trim() || (known && !q?.allowsNotApplicable))
      )
        throw Error("Ungültige Nichtanwendbarkeit.");
      links(ans.evidenceLinks);
      ans.positions.forEach((p) => links(p.evidenceLinks));
      refs(ans.valueStepIds, sets.steps);
    }
    for (const t of c.threats) {
      links(t.evidenceLinks);
      refs(t.valueStepIds, sets.steps);
      refs(t.questionIds, new Set(Object.keys(c.answers)));
    }
    for (const p of c.protections) {
      if (!c.answers[p.questionId] || !p.questionId.startsWith("C"))
        throw Error("Schutzwirkungen dürfen nur C-Faktoren verwenden.");
      refs([p.threatId], sets.threats);
      links(p.evidenceLinks);
    }
    for (const s of c.scenarios) {
      links(s.evidenceLinks);
      refs(s.valueStepIds, sets.steps);
      if (s.status === "not_applicable" && !s.notApplicableReason.trim())
        throw Error(
          "Szenario benötigt eine Begründung der Nichtanwendbarkeit.",
        );
      if (
        c.baseline &&
        s.financialStress?.fixedCostDelta != null &&
        c.baseline.fixedCosts != null &&
        c.baseline.fixedCosts + s.financialStress.fixedCostDelta < 0
      )
        throw Error("Negative Fixkosten im Szenario.");
    }
    for (const act of c.actions) {
      refs(act.linkedQuestionIds, new Set(Object.keys(c.answers)));
      refs(act.linkedThreatIds, sets.threats);
      refs(act.linkedScenarioIds, sets.scenarios);
      if (
        known &&
        act.linkedRuleIds.some((id) => !METHOD.rules.some((r) => r.id === id))
      )
        throw Error("Unbekannter Regelverweis.");
    }
    refs(c.executiveSummary.priorityActionIds, sets.actions);
  };
  if (
    a.methodologyVersion === METHOD.version &&
    (!a.methodologySnapshot ||
      JSON.stringify(a.methodologySnapshot) !== JSON.stringify(METHOD))
  )
    throw Error(
      "Methodensnapshot stimmt nicht mit der unterstützten Version überein.",
    );
  if (
    a.methodologySnapshot &&
    a.methodologySnapshot.version !== a.methodologyVersion
  )
    throw Error("Methodenversion und Snapshot widersprechen sich.");
  validate(a.content, a.methodologyVersion === METHOD.version);
  for (const r of a.revisions) {
    validate(r.content, r.methodologyVersion === METHOD.version);
    if (r.methodologySnapshot.version !== r.methodologyVersion)
      throw Error("Historische Methodenversion passt nicht zum Snapshot.");
    for (const f of r.derivedFindingsSnapshot) {
      if (
        f.evidenceIds.some(
          (id) => !r.content.evidence.some((e) => e.id === id),
        ) ||
        f.threatIds.some((id) => !r.content.threats.some((t) => t.id === id))
      )
        throw Error("Verwaister historischer Hinweis.");
    }
  }
}
