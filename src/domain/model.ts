import { METHOD, SCHEMA_VERSION } from "../methodology/config";
import type {
  Assessment,
  Answer,
  Evidence,
  QuestionId,
  ReviewStamp,
  Scenario,
  ProtectionLink,
  Threat,
} from "./types";
import {
  evaluate,
  evidenceStatus,
  protectionIsCurrent,
} from "../rules/evaluate";
export const uid = () => crypto.randomUUID();
export const today = () =>
  new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin" }).format(
    new Date(),
  );
export const iso = () => new Date().toISOString();
export function blankAnswer(questionId: QuestionId): Answer {
  return {
    questionId,
    revision: 1,
    state: "unanswered",
    rating: null,
    rationale: "",
    evidenceLevel: null,
    evidenceLinks: [],
    scope: "",
    openCheck: "",
    criticalForDecision: false,
    valueStepIds: [],
    notApplicableReason: "",
    disputed: false,
    positions: [],
    substantiationReview: null,
    conflictResolution: null,
    assessedBy: "",
    assessedAt: null,
  };
}
export function newScenario(
  template: Scenario["template"],
  title: string,
  horizonMonths = 18,
): Scenario {
  return {
    id: uid(),
    template,
    title,
    status: "open",
    notApplicableReason: "",
    assumption: "",
    horizonMonths,
    valueStepIds: [],
    customerReaction: "",
    remainingPaidValue: "",
    response: "",
    timeAndResourceNeeds: "",
    earlyIndicator: "",
    evidenceLinks: [],
    financialStress: null,
    openQuestions: "",
    nextCheck: "",
    owner: "",
    dueAt: null,
    affectedCustomers: "",
    affectedRevenueParts: "",
  };
}
export function createAssessment(
  title: string,
  type: "idea" | "existing",
  decisionQuestion: string,
  asOf = today(),
): Assessment {
  return {
    id: uid(),
    schemaVersion: SCHEMA_VERSION,
    methodologyVersion: METHOD.version,
    methodologySnapshot: structuredClone(METHOD),
    evaluationAsOf: asOf,
    createdAt: iso(),
    updatedAt: iso(),
    isExample: false,
    originAssessmentId: null,
    status: "draft",
    revisions: [],
    content: {
      actionPriority: 2,
      title,
      customerAlias: "",
      type,
      decisionQuestion,
      customerSegment: "",
      user: "",
      economicBuyer: "",
      customerProblem: "",
      currentAlternative: "",
      paidOutcome: "",
      revenueModel: "",
      costDescription: "",
      marketContext: "",
      excludedScope: "",
      horizonMonths: 18,
      owner: "",
      participants: [],
      valueSteps: [],
      answers: Object.fromEntries(
        METHOD.questions.map((q) => [q.id, blankAnswer(q.id)]),
      ) as Record<QuestionId, Answer>,
      evidence: [],
      threats: [],
      protections: [],
      baseline: null,
      scenarios: [
        newScenario("bundle", "Die Kernfunktion wird gebündelt"),
        newScenario("competitor", "Ein Branchenwettbewerber nutzt stärkere KI"),
        newScenario("provider", "Der wichtigste KI-Dienst ist nicht nutzbar"),
        ...(type === "idea"
          ? [
              newScenario(
                "demand",
                "Die Zahlungsbereitschaft bestätigt sich nicht",
              ),
            ]
          : []),
      ],
      actions: [],
      decision: {
        recommendation: "open",
        rationale: "",
        conditions: "",
        dissent: "",
        findingResponses: [],
        decidedBy: "",
        decidedAt: null,
        reviewDueAt: null,
        provisional: true,
      },
      executiveSummary: {
        mainThreat: "",
        evidencedAdvantage: "",
        keyUnknown: "",
        priorityActionIds: [],
      },
    },
  };
}
export function touch(a: Assessment) {
  a.status = "draft";
  a.updatedAt = iso();
}
export function updateAnswer(
  a: Assessment,
  id: QuestionId,
  patch: Partial<Answer>,
) {
  const old = a.content.answers[id];
  const next = { ...old, ...patch };
  if (
    next.state === "not_applicable" &&
    (!METHOD.questions.find((q) => q.id === id)?.allowsNotApplicable ||
      !next.notApplicableReason.trim())
  )
    throw Error(
      "Nichtanwendbarkeit ist hier unzulässig oder benötigt eine Begründung.",
    );
  if (next.state !== "rated") {
    next.rating = null;
    next.evidenceLevel = null;
  }
  if (next.state === "rated" && !next.rating)
    throw Error("Bitte einen inhaltlichen Anker wählen.");
  next.revision = old.revision + 1;
  next.assessedAt = iso();
  a.content.answers[id] = next;
  touch(a);
}
export function addEvidence(a: Assessment): Evidence {
  const e: Evidence = {
    id: uid(),
    revision: 1,
    kind: "Sonstige Quelle",
    title: "Neue Quelle",
    authorOrOrigin: "",
    url: null,
    internalReference: null,
    observation: "",
    eventDate: null,
    recordedAt: iso(),
    reviewStatus: "unreviewed",
    reviewedRevision: null,
    reviewedBy: null,
    reviewedAt: null,
    reviewDueAt: null,
    scopeAndLimitations: "",
    synthetic: a.isExample,
  };
  a.content.evidence.push(e);
  touch(a);
  return e;
}
export function updateEvidence(
  a: Assessment,
  id: string,
  patch: Partial<Evidence>,
  reviewer?: string,
) {
  const e = a.content.evidence.find((x) => x.id === id);
  if (!e) throw Error("Quelle nicht gefunden.");
  const keys = [
    "title",
    "kind",
    "authorOrOrigin",
    "url",
    "internalReference",
    "observation",
    "eventDate",
    "scopeAndLimitations",
    "synthetic",
    "reviewDueAt",
  ] as const;
  if (keys.some((k) => k in patch && patch[k] !== e[k])) {
    Object.assign(e, patch);
    e.revision++;
    e.reviewStatus = "needs_review";
  } else Object.assign(e, patch);
  if (reviewer) {
    if (
      !reviewer.trim() ||
      !e.title.trim() ||
      !(e.url || e.internalReference) ||
      !e.observation.trim() ||
      !e.authorOrOrigin.trim() ||
      !e.scopeAndLimitations.trim()
    )
      throw Error(
        "Titel, Referenz, Herkunft, Beobachtung und Geltungsbereich sind für die Quellenprüfung erforderlich.",
      );
    e.reviewStatus = "reviewed";
    e.reviewedRevision = e.revision;
    e.reviewedBy = reviewer;
    e.reviewedAt = iso();
  }
  touch(a);
}
export function stamp(
  subjectRevision: number,
  links: { evidenceId: string }[],
  a: Assessment,
  reviewer: string,
  asOf: string,
): ReviewStamp {
  if (!reviewer.trim()) throw Error("Bitte eine prüfende Person benennen.");
  return {
    subjectRevision,
    reviewedBy: reviewer.trim(),
    reviewedAt: asOf,
    evidenceRevisions: Object.fromEntries(
      links.map((l) => [
        l.evidenceId,
        a.content.evidence.find((e) => e.id === l.evidenceId)?.revision ?? -1,
      ]),
    ),
  };
}
export function answerLinks(answer: Answer) {
  return [
    ...answer.evidenceLinks,
    ...answer.positions.flatMap((p) => p.evidenceLinks),
  ];
}
export function reviewAnswer(
  a: Assessment,
  id: QuestionId,
  reviewer: string,
  asOf: string,
) {
  const ans = a.content.answers[id];
  ans.substantiationReview = stamp(
    ans.revision,
    answerLinks(ans),
    a,
    reviewer,
    asOf,
  );
  if (!evidenceStatus(a, id, asOf).substantiated) {
    ans.substantiationReview = null;
    throw Error(
      "Die Antwort benötigt eine begründete Bewertung, die Stufe „Geprüfter Beleg“, eine aktuell geprüfte unterstützende Quelle mit erklärtem Bezug und geklärte Widersprüche.",
    );
  }
  touch(a);
}
export function resolveConflict(
  a: Assessment,
  id: QuestionId,
  rationale: string,
  reviewer: string,
  asOf: string,
) {
  if (!rationale.trim())
    throw Error("Die Konfliktauflösung benötigt eine Begründung.");
  const ans = a.content.answers[id];
  ans.conflictResolution = {
    rationale,
    review: stamp(ans.revision, answerLinks(ans), a, reviewer, asOf),
  };
  touch(a);
}
export function updateThreat(
  a: Assessment,
  id: string,
  patch: Partial<Threat>,
) {
  const t = a.content.threats.find((t) => t.id === id);
  if (t) {
    Object.assign(t, patch);
    t.revision++;
    touch(a);
  }
}
export function updateProtection(
  a: Assessment,
  id: string,
  patch: Partial<ProtectionLink>,
) {
  const p = a.content.protections.find((p) => p.id === id);
  if (p) {
    Object.assign(p, patch);
    p.revision++;
    touch(a);
  }
}
export function reviewProtection(
  a: Assessment,
  id: string,
  reviewer: string,
  asOf: string,
) {
  const p = a.content.protections.find((x) => x.id === id);
  if (!p) throw Error("Schutzverknüpfung nicht gefunden.");
  p.review = stamp(p.revision, p.evidenceLinks, a, reviewer, asOf);
  p.reviewedAnswerRevision = a.content.answers[p.questionId]?.revision;
  p.reviewedThreatRevision =
    a.content.threats.find((t) => t.id === p.threatId)?.revision ?? null;
  if (!protectionIsCurrent(a, p, asOf)) {
    p.review = null;
    throw Error(
      "Die konkrete Schutzwirkung benötigt einen belegten hohen C-Faktor, eine Bedrohung und eine erklärte, aktuell geprüfte unterstützende Quelle.",
    );
  }
  touch(a);
}
export function removeEvidence(a: Assessment, id: string) {
  a.content.evidence = a.content.evidence.filter((e) => e.id !== id);
  for (const ans of Object.values(a.content.answers)) {
    if (answerLinks(ans).some((l) => l.evidenceId === id)) {
      ans.evidenceLinks = ans.evidenceLinks.filter((l) => l.evidenceId !== id);
      ans.positions.forEach(
        (p) =>
          (p.evidenceLinks = p.evidenceLinks.filter(
            (l) => l.evidenceId !== id,
          )),
      );
      ans.revision++;
      ans.substantiationReview = null;
      ans.conflictResolution = null;
    }
  }
  for (const obj of [
    ...a.content.threats,
    ...a.content.protections,
    ...a.content.scenarios,
  ]) {
    if (obj.evidenceLinks.some((l) => l.evidenceId === id)) {
      obj.evidenceLinks = obj.evidenceLinks.filter((l) => l.evidenceId !== id);
      if ("revision" in obj) obj.revision++;
      if ("review" in obj) obj.review = null;
    }
  }
  touch(a);
}
export function closeAssessment(a: Assessment, reviewer: string, asOf: string) {
  if (
    !reviewer.trim() ||
    !a.content.decision.rationale.trim() ||
    !a.content.actions.some((x) => x.title.trim())
  )
    throw Error(
      "Für den Abschluss sind prüfende Person, Entscheidungsbegründung und mindestens ein nächster Schritt erforderlich.",
    );
  a.revisions.push({
    revisionId: uid(),
    revisionNumber: a.revisions.length + 1,
    createdAt: iso(),
    createdBy: reviewer,
    comment: "Fachliche Durchsicht",
    methodologyVersion: a.methodologyVersion,
    methodologySnapshot: structuredClone(a.methodologySnapshot),
    evaluationAsOf: asOf,
    reviewed: true,
    content: structuredClone(a.content),
    derivedFindingsSnapshot: structuredClone(evaluate(a, asOf)),
  });
  a.status = "reviewed";
  a.updatedAt = iso();
}
