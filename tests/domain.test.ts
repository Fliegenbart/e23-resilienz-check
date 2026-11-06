import type { QuestionId, Rating } from "../src/domain/types";
import { describe, it, expect } from "vitest";
import {
  createAssessment,
  updateAnswer,
  updateEvidence,
  addEvidence,
  reviewAnswer,
  resolveConflict,
  reviewProtection,
  removeEvidence,
  closeAssessment,
} from "../src/domain/model";
import {
  evaluate,
  evidenceStatus,
  protectionIsCurrent,
} from "../src/rules/evaluate";
const date = "2026-11-06";
function fixture() {
  return createAssessment("Testfall", "idea", "Investieren?", date);
}
function rated(a: any, id: QuestionId, rating: Rating = "high") {
  updateAnswer(a, id, {
    state: "rated",
    rating,
    rationale: "Konkrete geprüfte Aussage",
    scope: "Testaufgaben",
    evidenceLevel: "substantiated",
  });
}
function substantiate(a: any, id: QuestionId) {
  rated(a, id);
  const e = addEvidence(a);
  updateEvidence(a, e.id, {
    title: "Interner Test",
    internalReference: "TEST-1",
    observation: "Beobachtetes Ergebnis",
    scopeAndLimitations: "Testaufgaben",
    authorOrOrigin: "Testteam",
  });
  updateEvidence(a, e.id, {}, "Prüfer");
  updateAnswer(a, id, {
    evidenceLinks: [
      {
        evidenceId: e.id,
        relation: "supports",
        explanation: "Vergleich trägt diese Aussage",
      },
    ],
  });
  reviewAnswer(a, id, "Prüfer", date);
  return e;
}
describe("Fachliche Akzeptanz", () => {
  it("leerer Fall liefert R14 und keine beobachteten Geschäftsaussagen", () => {
    const f = evaluate(fixture(), date);
    expect(f.some((x) => x.ruleId === "R14")).toBe(true);
    expect(f.every((x) => x.kind === "missing_information")).toBe(true);
  });
  it("unbekannt erfüllt niemals niedrig oder hoch", () => {
    const a = fixture();
    Object.keys(a.content.answers).forEach((id) =>
      updateAnswer(a, id as any, { state: "unknown" }),
    );
    const f = evaluate(a, date);
    expect(f.some((x) => ["R03", "R15", "R16"].includes(x.ruleId))).toBe(false);
  });
  it("hoher C-Faktor ohne Beleg ist R08 und kein Schutz", () => {
    const a = fixture();
    rated(a, "C1");
    expect(evaluate(a, date).find((x) => x.ruleId === "R08")?.kind).toBe(
      "hypothesis",
    );
  });
  it("A1/A2 bleiben trotz möglichem Datenvorteil offen", () => {
    const a = fixture();
    rated(a, "C1");
    expect(evaluate(a, date).some((x) => x.ruleId === "R01")).toBe(true);
  });
  it("unbelegte Austauschbarkeit bleibt Hypothese mit offener Bedrohungszuordnung", () => {
    const a = fixture();
    rated(a, "B1");
    rated(a, "B4");
    const f = evaluate(a, date);
    expect(f.find((x) => x.ruleId === "R03")?.kind).toBe("hypothesis");
    expect(f.find((x) => x.ruleId === "R06")?.title).toMatch(/zuordnen/i);
  });
  it("aktuell geprüfte Antwort wird belegt; Änderung hebt Bestätigung auf", () => {
    const a = fixture();
    substantiate(a, "C1");
    expect(evidenceStatus(a, "C1", date).substantiated).toBe(true);
    updateAnswer(a, "C1", { rationale: "Andere Aussage" });
    expect(evidenceStatus(a, "C1", date).substantiated).toBe(false);
  });
  it("materielle Quellenänderung verlangt erneute Prüfung", () => {
    const a = fixture();
    const e = substantiate(a, "C1");
    updateEvidence(a, e.id, { observation: "Geändertes Ergebnis" });
    expect(e.reviewStatus).toBe("needs_review");
    expect(evidenceStatus(a, "C1", date).substantiated).toBe(false);
  });
  it("Frist berücksichtigt den Stichtag ohne historische Daten zu verändern", () => {
    const a = fixture();
    const e = substantiate(a, "C1");
    e.reviewDueAt = "2026-11-07";
    expect(evidenceStatus(a, "C1", date).substantiated).toBe(true);
    expect(evidenceStatus(a, "C1", "2026-11-08").substantiated).toBe(false);
  });
  it("neue widersprechende Quelle eröffnet einen gelösten Konflikt erneut", () => {
    const a = fixture();
    substantiate(a, "C1");
    const e = addEvidence(a);
    updateEvidence(a, e.id, { title: "Widerspruch", internalReference: "T2" });
    updateAnswer(a, "C1", {
      evidenceLinks: [
        ...a.content.answers.C1.evidenceLinks,
        {
          evidenceId: e.id,
          relation: "contradicts",
          explanation: "abweichend",
        },
      ],
    });
    resolveConflict(a, "C1", "Gilt für andere Aufgabe", "Prüfer", date);
    expect(evidenceStatus(a, "C1", date).conflict).toBe(false);
    const e2 = addEvidence(a);
    updateAnswer(a, "C1", {
      evidenceLinks: [
        ...a.content.answers.C1.evidenceLinks,
        {
          evidenceId: e2.id,
          relation: "contradicts",
          explanation: "neuer Widerspruch",
        },
      ],
    });
    expect(evidenceStatus(a, "C1", date).conflict).toBe(true);
  });
  it("synthetische Quellen qualifizieren keine realen Fälle", () => {
    const a = fixture();
    const e = substantiate(a, "C1");
    e.synthetic = true;
    expect(evidenceStatus(a, "C1", date).substantiated).toBe(false);
  });
  it("Zustandswechsel bereinigt Bewertung", () => {
    const a = fixture();
    rated(a, "A1");
    updateAnswer(a, "A1", { state: "unknown" });
    expect(a.content.answers.A1.rating).toBeNull();
  });
  it("unzulässige oder unbegründete Nichtanwendbarkeit wird abgewiesen", () => {
    const a = fixture();
    expect(() =>
      updateAnswer(a, "A1", {
        state: "not_applicable",
        notApplicableReason: "nicht relevant",
      }),
    ).toThrow();
    expect(() => updateAnswer(a, "C5", { state: "not_applicable" })).toThrow();
    updateAnswer(a, "C5", {
      state: "not_applicable",
      notApplicableReason: "Kein Netzwerk erforderlich",
    });
    expect(
      evaluate(a, date).some(
        (x) => x.triggerQuestionIds.includes("C5") && x.ruleId === "R08",
      ),
    ).toBe(false);
  });
  it("negative Nachfrage und Wirtschaftlichkeit bleiben trotz geringer Exposition sichtbar", () => {
    const a = fixture();
    rated(a, "A2", "low");
    rated(a, "A4", "low");
    rated(a, "B1", "low");
    expect(evaluate(a, date).map((x) => x.ruleId)).toEqual(
      expect.arrayContaining(["R15", "R16"]),
    );
  });
  it("kritische Betriebslücke wird nicht durch Vorteile kompensiert", () => {
    const a = fixture();
    rated(a, "D3", "low");
    updateAnswer(a, "D3", { criticalForDecision: true });
    rated(a, "C1");
    expect(evaluate(a, date).some((x) => x.ruleId === "R10")).toBe(true);
  });
  it("hoher C-Faktor und Freitext allein belegen keine Schutzwirkung", () => {
    const a = fixture();
    substantiate(a, "C1");
    a.content.threats.push({
      id: "t1",
      revision: 1,
      category: "bundle",
      actor: "Plattform",
      change: "Bündelung",
      valueStepIds: [],
      economicMechanism: "Wechsel",
      basis: "scenario",
      questionIds: ["B1", "B4"],
      evidenceLinks: [],
    });
    a.content.protections.push({
      id: "p1",
      revision: 1,
      questionId: "C1",
      threatId: "t1",
      mechanism: "Daten erschweren Ersatz",
      limitations: "",
      evidenceLinks: [],
      review: null,
      reviewedAnswerRevision: null,
      reviewedThreatRevision: null,
    });
    expect(protectionIsCurrent(a, a.content.protections[0], date)).toBe(false);
    expect(evaluate(a, date).some((x) => x.ruleId === "R09")).toBe(true);
  });
  it("Quelllöschung entfernt aktuellen Belegstatus und erhält abgeschlossene Revision", () => {
    const a = fixture();
    const e = substantiate(a, "C1");
    a.content.decision.rationale = "Validierung";
    a.content.actions.push({
      id: "a",
      title: "Test",
      description: "Test",
      linkedQuestionIds: [],
      linkedRuleIds: [],
      linkedFindingIds: [],
      linkedThreatIds: [],
      linkedScenarioIds: [],
      expectedEvidence: "Ergebnis",
      owner: "Team",
      dueAt: null,
      status: "open",
      effortNote: "",
    });
    closeAssessment(a, "Prüfer", date);
    const snapshot = JSON.stringify(a.revisions);
    removeEvidence(a, e.id);
    expect(evidenceStatus(a, "C1", date).substantiated).toBe(false);
    expect(JSON.stringify(a.revisions)).toBe(snapshot);
  });
  it("gleiche Eingaben erzeugen identische Hinweise und stabile IDs", () => {
    const a = fixture();
    rated(a, "B1");
    rated(a, "B4");
    expect(evaluate(a, date)).toEqual(evaluate(structuredClone(a), date));
  });
});
it("geprüfte Schutzwirkung verfällt bei Änderung der Bedrohung", () => {
  const a = fixture();
  const e = substantiate(a, "C1");
  a.content.threats.push({
    id: "t1",
    revision: 1,
    category: "bundle",
    actor: "Plattform",
    change: "Bündelung",
    valueStepIds: [],
    economicMechanism: "Wechsel",
    basis: "scenario",
    questionIds: ["B1", "B4"],
    evidenceLinks: [],
  });
  a.content.protections.push({
    id: "p1",
    revision: 1,
    questionId: "C1",
    threatId: "t1",
    mechanism: "Daten erschweren Reproduktion",
    limitations: "Geltungsbereich begrenzt",
    evidenceLinks: [
      {
        evidenceId: e.id,
        relation: "supports",
        explanation: "Test trägt die konkrete Schutzwirkung",
      },
    ],
    review: null,
    reviewedAnswerRevision: null,
    reviewedThreatRevision: null,
  });
  reviewProtection(a, "p1", "Prüfer", date);
  expect(protectionIsCurrent(a, a.content.protections[0], date)).toBe(true);
  a.content.threats[0].revision++;
  expect(protectionIsCurrent(a, a.content.protections[0], date)).toBe(false);
});
it("belegte Austauschbarkeit mit ungeklärtem Schutz bleibt als offene Wirkung sichtbar", () => {
  const a = fixture();
  substantiate(a, "B1");
  substantiate(a, "B4");
  a.content.threats.push({
    id: "t1",
    revision: 1,
    category: "bundle",
    actor: "Plattform",
    change: "Bündelung",
    valueStepIds: [],
    economicMechanism: "Wechsel",
    basis: "scenario",
    questionIds: ["B1", "B4"],
    evidenceLinks: [],
  });
  const f = evaluate(a, date);
  expect(f.find((x) => x.ruleId === "R03")?.kind).toBe("observed");
  expect(f.find((x) => x.ruleId === "R06")?.kind).toBe("missing_information");
});
it("Selbstbetrieb erhält ohne Qualitätstest keinen Bonus; geprüfte Cloud keinen Malus", () => {
  const a = fixture();
  rated(a, "D3", "low");
  updateAnswer(a, "D3", {
    criticalForDecision: true,
    rationale: "Selbstbetrieb ohne Qualitätstests",
  });
  expect(evaluate(a, date).some((x) => x.ruleId === "R10")).toBe(true);
  const cloud = fixture();
  for (const id of ["D2", "D3", "D5"] as QuestionId[]) substantiate(cloud, id);
  expect(
    evaluate(cloud, date).some((x) => ["R10", "R11"].includes(x.ruleId)),
  ).toBe(false);
});
it("alle 16 Regelfamilien sind abgedeckt; starke Exposition erzwingt keine Empfehlung", () => {
  const a = fixture();
  rated(a, "B2");
  rated(a, "B3");
  expect(evaluate(a, date).map((x) => x.ruleId)).toEqual(
    expect.arrayContaining(["R04", "R05"]),
  );
  expect(a.content.decision.recommendation).toBe("open");
});
it("R07 verlangt vier aktuell belegte Voraussetzungen und entscheidet nicht automatisch", () => {
  const a = fixture();
  for (const id of ["B1", "B4", "A3", "A4"] as QuestionId[])
    substantiate(a, id);
  for (const id of ["A3", "A4"] as QuestionId[]) {
    updateAnswer(a, id, { rating: "low" });
    reviewAnswer(a, id, "Prüfer", date);
  }
  expect(evaluate(a, date).find((f) => f.ruleId === "R07")?.kind).toBe(
    "observed",
  );
  expect(a.content.decision.recommendation).toBe("open");
  updateAnswer(a, "A4", { rationale: "Geänderte wirtschaftliche Aussage" });
  expect(evaluate(a, date).some((f) => f.ruleId === "R07")).toBe(false);
});
