export type Rating = "low" | "medium" | "high";
export type AnswerState = "unanswered" | "unknown" | "rated" | "not_applicable";
export type EvidenceLevel = "assumption" | "indication" | "substantiated";
export type EvidenceRelation = "supports" | "contradicts" | "context";
export type Recommendation =
  "develop" | "validate" | "reorient" | "pause" | "open";
export type QuestionId =
  | "A1"
  | "A2"
  | "A3"
  | "A4"
  | "B1"
  | "B2"
  | "B3"
  | "B4"
  | "C1"
  | "C2"
  | "C3"
  | "C4"
  | "C5"
  | "C6"
  | "D1"
  | "D2"
  | "D3"
  | "D4"
  | "D5"
  | "D6";

export interface EvidenceLink {
  evidenceId: string;
  relation: EvidenceRelation;
  explanation: string;
}

export interface ReviewStamp {
  reviewedBy: string;
  reviewedAt: string;
  subjectRevision: number;
  evidenceRevisions: Record<string, number>;
}

export interface Position {
  person: string;
  rating: Rating | null;
  rationale: string;
  evidenceLinks: EvidenceLink[];
  recordedAt: string;
}

export interface Answer {
  questionId: QuestionId;
  revision: number;
  state: AnswerState;
  rating: Rating | null;
  rationale: string;
  evidenceLevel: EvidenceLevel | null;
  evidenceLinks: EvidenceLink[];
  scope: string;
  openCheck: string;
  criticalForDecision: boolean;
  valueStepIds: string[];
  notApplicableReason: string;
  disputed: boolean;
  positions: Position[];
  substantiationReview: ReviewStamp | null;
  conflictResolution: { rationale: string; review: ReviewStamp } | null;
  assessedBy: string;
  assessedAt: string | null;
}

export interface Evidence {
  id: string;
  revision: number;
  kind: string;
  title: string;
  authorOrOrigin: string;
  url: string | null;
  internalReference: string | null;
  observation: string;
  eventDate: string | null;
  recordedAt: string;
  reviewStatus: "unreviewed" | "reviewed" | "needs_review";
  reviewedRevision: number | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewDueAt: string | null;
  scopeAndLimitations: string;
  synthetic: boolean;
}

export interface ValueStep {
  id: string;
  title: string;
  customerValue: string;
  requiredResources: string;
  currentAIUse: string;
  alternative: string;
  critical: boolean;
  openQuestions: string;
}

export interface Threat {
  id: string;
  revision: number;
  category: string;
  actor: string;
  change: string;
  valueStepIds: string[];
  economicMechanism: string;
  basis: "observed" | "scenario";
  questionIds: QuestionId[];
  evidenceLinks: EvidenceLink[];
}

export interface ProtectionLink {
  id: string;
  revision: number;
  questionId: QuestionId; // nur C1–C6 zulassen
  threatId: string;
  mechanism: string;
  limitations: string;
  evidenceLinks: EvidenceLink[];
  review: ReviewStamp | null;
  reviewedAnswerRevision: number | null;
  reviewedThreatRevision: number | null;
}

export interface FinancialBaseline {
  period: "month";
  currency: string;
  revenue: number | null;
  variableCosts: number | null;
  fixedCosts: number | null;
  sourceNote: string;
}

export interface FinancialStress {
  priceChange: number | null;
  volumeChange: number | null;
  unitVariableCostChange: number | null;
  fixedCostDelta: number | null;
  oneOffCost: number | null;
  assumptionNote: string;
  modelApplicable: boolean | null;
}

export interface Scenario {
  id: string;
  template:
    "bundle" | "competitor" | "provider" | "demand" | "upside" | "custom";
  nextCheck: string;
  owner: string;
  dueAt: string | null;
  affectedCustomers: string;
  affectedRevenueParts: string;
  title: string;
  status: "open" | "worked" | "not_applicable";
  notApplicableReason: string;
  assumption: string;
  horizonMonths: number;
  valueStepIds: string[];
  customerReaction: string;
  remainingPaidValue: string;
  response: string;
  timeAndResourceNeeds: string;
  earlyIndicator: string;
  evidenceLinks: EvidenceLink[];
  financialStress: FinancialStress | null;
  openQuestions: string;
}

export interface Action {
  id: string;
  title: string;
  description: string;
  linkedQuestionIds: QuestionId[];
  linkedRuleIds: string[];
  linkedFindingIds: string[];
  linkedThreatIds: string[];
  linkedScenarioIds: string[];
  expectedEvidence: string;
  owner: string;
  dueAt: string | null;
  status: "open" | "in_progress" | "done" | "cancelled";
  effortNote: string;
}

export interface Decision {
  recommendation: Recommendation;
  rationale: string;
  conditions: string;
  dissent: string;
  findingResponses: { findingId: string; response: string }[];
  decidedBy: string;
  decidedAt: string | null;
  reviewDueAt: string | null;
  provisional: boolean;
}

export interface AssessmentContent {
  actionPriority: number;
  title: string;
  customerAlias: string;
  type: "existing" | "idea";
  decisionQuestion: string;
  customerSegment: string;
  user: string;
  economicBuyer: string;
  customerProblem: string;
  currentAlternative: string;
  paidOutcome: string;
  revenueModel: string;
  costDescription: string;
  marketContext: string;
  excludedScope: string;
  horizonMonths: number;
  owner: string;
  participants: string[];
  valueSteps: ValueStep[];
  answers: Record<QuestionId, Answer>;
  evidence: Evidence[];
  threats: Threat[];
  protections: ProtectionLink[];
  baseline: FinancialBaseline | null;
  scenarios: Scenario[];
  actions: Action[];
  decision: Decision;
  executiveSummary: {
    mainThreat: string;
    evidencedAdvantage: string;
    keyUnknown: string;
    priorityActionIds: string[];
  };
}

export interface MethodologySnapshot {
  version: string;
  questions: {
    id: QuestionId;
    group: "A" | "B" | "C" | "D";
    text: string;
    anchors: Record<Rating, string>;
    allowsNotApplicable: boolean;
    helpText: string;
  }[];
  rules: {
    id: string;
    triggerDescription: string;
    outputDescription: string;
  }[];
  notes: string;
}

export interface Revision {
  revisionId: string;
  revisionNumber: number;
  createdAt: string;
  createdBy: string;
  comment: string;
  methodologyVersion: string;
  methodologySnapshot: MethodologySnapshot;
  evaluationAsOf: string;
  reviewed: boolean;
  content: AssessmentContent;
  derivedFindingsSnapshot: RuleFinding[];
}

export interface RuleFinding {
  findingId: string;
  ruleId: string;
  kind: "observed" | "hypothesis" | "missing_information";
  title: string;
  rationale: string;
  triggerQuestionIds: QuestionId[];
  threatIds: string[];
  evidenceIds: string[];
  suggestedCheck: string;
}

export interface Assessment {
  id: string;
  schemaVersion: string;
  methodologyVersion: string;
  methodologySnapshot: MethodologySnapshot;
  evaluationAsOf: string;
  createdAt: string;
  updatedAt: string;
  isExample: boolean;
  originAssessmentId: string | null;
  status: "draft" | "in_review" | "reviewed";
  content: AssessmentContent;
  revisions: Revision[];
}

export interface WorkspaceExport {
  format: "ai-resilience-check";
  schemaVersion: string;
  appVersion: string;
  exportedAt: string;
  assessments: Assessment[];
}
