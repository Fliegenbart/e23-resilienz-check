import { describe, it, expect } from "vitest";
import {
  SCENARIOS,
  createScenarioWorkspace,
  startScenario,
  answerScenario,
  evaluateScenario,
  costEffect,
} from "../src/quick/scenario-model";
import {
  createCheck as createCurrentCheck,
  parseChecks,
  serializeChecks,
} from "../src/quick/model";
import { EXPERT_QUESTIONS } from "../src/quick/expert-questions";

// Die früheren Zukunftsszenarien bleiben bei ihrem V2-Fragenstand.
function createCheck(type: "existing" | "idea") {
  const check = createCurrentCheck(type);
  check.methodologyVersion = "quick-check-2.0";
  check.methodologySnapshot = structuredClone(EXPERT_QUESTIONS);
  return check;
}

describe("Szenario-Stresstest", () => {
  it("trennt Kosten, Agentenfähigkeiten und Robotik in kontrollierten Paaren", () => {
    expect(SCENARIOS).toHaveLength(6);
    const assumptions = SCENARIOS.map((s) => s.assumptions);
    expect(assumptions[1]).toEqual({ ...assumptions[0], costFactor: 100 });
    expect(assumptions[2]).toEqual({
      ...assumptions[1],
      intelligence: "higher",
    });
    expect(assumptions[3]).toEqual({ ...assumptions[1], robots: "routine" });
    expect(assumptions[4]).toEqual({
      ...assumptions[3],
      intelligence: "higher",
    });
    expect(assumptions[5]).toEqual({ ...assumptions[4], robots: "flexible" });
  });
  it("erzeugt für stärkere KI oder Robotik keinen automatischen Risikowert", () => {
    for (const s of SCENARIOS) {
      const w = createScenarioWorkspace();
      const run = startScenario(w, s.id);
      expect(evaluateScenario(run).score).toBeNull();
    }
  });
  it("berechnet nur aus vier vollständigen Risikoantworten; Chancen ändern das Risiko nicht", () => {
    const w = createScenarioWorkspace();
    const r = startScenario(w, "s6");
    for (const id of ["value", "price", "access", "adapt"] as const)
      answerScenario(r, id, 10);
    expect(evaluateScenario(r).score).toBe(100);
    answerScenario(r, "opportunity", 10);
    expect(evaluateScenario(r).score).toBe(100);
    expect(evaluateScenario(r).opportunity).toBe(10);
    expect(evaluateScenario(r).critical).toHaveLength(4);
    answerScenario(r, "adapt", "unknown");
    expect(evaluateScenario(r).score).toBeNull();
    expect(evaluateScenario(r).critical).toHaveLength(3);
  });
  it("zeigt bei niedrigen Risiken keine erfundene kritische Lücke", () => {
    const r = startScenario(createScenarioWorkspace(), "s1");
    for (const id of ["value", "price", "access", "adapt"] as const)
      answerScenario(r, id, 1);
    expect(evaluateScenario(r).score).toBe(0);
    expect(evaluateScenario(r).actions).toHaveLength(0);
  });
  it("rechnet nur den KI-Anteil günstiger, nicht die gesamte Leistung", () => {
    expect(costEffect(25, 10)?.savingPercent).toBe(22.5);
    expect(costEffect(25, 100)?.savingPercent).toBe(24.75);
    expect(costEffect(0, 100)?.savingPercent).toBe(0);
    expect(costEffect(100, 100)?.savingPercent).toBe(99);
    expect(costEffect(null, 100)).toBeNull();
    for (const n of [-1, 101, NaN, Infinity])
      expect(() => costEffect(n, 10)).toThrow();
  });
  it("neue Einstellungen ändern frühere Szenariobewertungen nicht", () => {
    const w = createScenarioWorkspace();
    w.draftContext.aiShare = 25;
    const a = startScenario(w, "s2");
    const snapshot = structuredClone(a);
    w.draftContext.horizon = 6;
    w.draftContext.profile = "physical";
    const b = startScenario(w, "s2");
    expect(a).toEqual(snapshot);
    expect(a.context.horizon).toBe(18);
    expect(b.context.horizon).toBe(6);
    expect(a.id).not.toBe(b.id);
  });
  it("sichert Szenarioannahmen und Position vollständig im JSON-Rundlauf", () => {
    const c = createCheck("existing");
    c.scenarios = createScenarioWorkspace();
    c.view = "scenarios";
    const r = startScenario(c.scenarios, "s4");
    answerScenario(r, "value", 9);
    r.step = 1;
    c.scenarios.view = "questions";
    expect(parseChecks(serializeChecks([c]))).toEqual([c]);
  });
  it("liest bestehende Exporte 1.0 ohne nachträgliche Umrechnung", () => {
    const c = createCheck("existing");
    c.schemaVersion = "1.0";
    const data = JSON.parse(serializeChecks([c]));
    data.schemaVersion = "1.0";
    expect(parseChecks(JSON.stringify(data))).toEqual([c]);
    expect(parseChecks(JSON.stringify(data))[0].scenarios).toBeUndefined();
  });
  it("akzeptiert semantisch gleiche Snapshots mit anderer JSON-Schlüsselreihenfolge", () => {
    const c = createCheck("idea");
    c.scenarios = createScenarioWorkspace();
    const data = JSON.parse(serializeChecks([c]));
    const s = data.checks[0].scenarios.methodSnapshot;
    data.checks[0].scenarios.methodSnapshot = {
      questions: s.questions,
      catalog: s.catalog,
    };
    expect(parseChecks(JSON.stringify(data))).toEqual([c]);
  });
  it("weist manipulierte oder zukünftige Szenariomethoden vor einer Übernahme ab", () => {
    const c = createCheck("idea");
    c.scenarios = createScenarioWorkspace();
    const data = JSON.parse(serializeChecks([c]));
    data.checks[0].scenarios.methodSnapshot.catalog[0].assumptions.intelligence =
      "higher";
    expect(() => parseChecks(JSON.stringify(data))).toThrow();
    const future = JSON.parse(serializeChecks([c]));
    future.checks[0].scenarios.methodVersion = "99";
    expect(() => parseChecks(JSON.stringify(future))).toThrow();
    const bad = JSON.parse(serializeChecks([c]));
    bad.checks[0].scenarios.activeRunId = "missing";
    expect(() => parseChecks(JSON.stringify(bad))).toThrow();
  });
});
