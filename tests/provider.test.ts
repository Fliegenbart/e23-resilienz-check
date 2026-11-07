import { describe, expect, it } from "vitest";
import {
  createCheck,
  calculateRisk,
  parseChecks,
  serializeChecks,
  answerCheck,
  type QuickQuestion,
} from "../src/quick/model";
import providerV3 from "../src/quick/methods/quick-check-3.0.json";
import { EXPERT_QUESTIONS } from "../src/quick/expert-questions";
import { evaluateProvider } from "../src/quick/provider-analysis";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProviderResults } from "../src/quick/ProviderResults";
import { QuickReport } from "../src/quick/Report";
import { Question } from "../src/quick/Question";
import { createScenarioWorkspace } from "../src/quick/scenario-model";

function rated(values: number[]) {
  const c = createCheck("existing");
  c.methodologySnapshot.forEach((q, i) => answerCheck(c, q.id, values[i]));
  return c;
}

describe("Plattform-Check", () => {
  it("beginnt mit konkreten Fragen einer neuen Methode", () => {
    const c = createCheck("existing");
    expect(c.methodologyVersion).toBe("quick-check-3.1");
    expect(c.view).toBe("questions");
    expect(c.methodologySnapshot[0].text).toContain("digital");
  });
  it("verrechnet Schutz und Angreifbarkeit nicht zu einem Gesamtscore", () => {
    const c = createCheck("existing");
    c.methodologySnapshot.forEach((q) => answerCheck(c, q.id, 10));
    expect(calculateRisk(c).score).toBeNull();
    expect(calculateRisk(c).answered).toBe(12);
  });
  it("bewahrt den V2-Fragenstand und dessen Risikowert im gemeinsamen Export", () => {
    const old = createCheck("existing");
    old.methodologyVersion = "quick-check-2.0";
    old.methodologySnapshot = structuredClone(EXPERT_QUESTIONS);
    old.view = "results";
    old.methodologySnapshot.forEach((q) => answerCheck(old, q.id, 1));
    answerCheck(old, "Q4", 10);
    expect(calculateRisk(old).score).toBe(8);
    expect(parseChecks(serializeChecks([old, createCheck("idea")]))[0]).toEqual(
      old,
    );
  });
  it("bewahrt angefangene V3-Checks mit ihren ursprünglichen Fragen", () => {
    const old = rated([9, 9, 8, 10, 8, 9, 8, 1, 2, 6, 3, 4]);
    old.methodologyVersion = "quick-check-3.0";
    old.methodologySnapshot = structuredClone(providerV3) as QuickQuestion[];
    old.step = 3;
    old.view = "questions";
    const restored = parseChecks(
      serializeChecks([old, createCheck("existing")]),
    );
    expect(restored[0]).toEqual(old);
    expect(calculateRisk(restored[0]).score).toBeNull();
    expect(evaluateProvider(restored[0]).routes.map((r) => r.level)).toEqual([
      "high",
      "high",
      "high",
    ]);
    expect(restored[1].methodologySnapshot[0].text).not.toBe(
      old.methodologySnapshot[0].text,
    );
  });
  it("hält alle drei Angriffswege trotz starker eigener Vorteile sichtbar", () => {
    const r = evaluateProvider(rated(Array(12).fill(10)));
    expect(r.routes.map((x) => x.level)).toEqual(["high", "high", "high"]);
    expect(r.protections.filter((x) => x.level === "strong")).toHaveLength(4);
    expect(r.evidence).toBe("supported");
  });
  it("macht aus behaupteten Datenvorteilen keinen belegten Schutz", () => {
    const r = evaluateProvider(
      rated([10, 10, 10, 10, 10, 10, 10, 1, 1, 1, 1, 1]),
    );
    expect(r.protections[0].level).toBe("strong");
    expect(r.evidence).toBe("untested");
    expect(r.summary).toContain("belegt");
    expect(r.actions.some((x) => x.questionIds.includes("Q11"))).toBe(true);
  });
  it("wertet unbekannte Angaben weder als Entwarnung noch als Schutz", () => {
    const c = rated(Array(12).fill(10));
    answerCheck(c, "Q2", "unknown");
    answerCheck(c, "Q7", "unknown");
    const r = evaluateProvider(c);
    expect(r.routes[0].level).toBe("unknown");
    expect(r.routes[1].level).toBe("unknown");
    expect(r.routes[2].level).toBe("high");
    expect(r.protections[0].level).toBe("unknown");
    expect(r.unknown.map((q) => q.id)).toEqual(["Q2", "Q7"]);
    expect(r.actions.some((x) => x.id === "unknown")).toBe(true);
  });
  it("nennt konkrete Hürden bei überwiegend nicht digitaler Leistung", () => {
    const r = evaluateProvider(
      rated([1, 10, 10, 10, 10, 10, 1, 10, 1, 1, 7, 7]),
    );
    expect(r.routes[0].level).toBe("barrier");
    expect(r.routes[1].level).toBe("barrier");
    expect(r.routes[2].level).toBe("high");
    expect(r.protections.find((x) => x.id === "physical")?.level).toBe(
      "strong",
    );
  });
  it("behauptet bei leeren Checks keine Angriffe und keine Vorteile", () => {
    const r = evaluateProvider(createCheck("idea"));
    expect(r.routes.every((x) => x.level === "unknown")).toBe(true);
    expect(r.protections.every((x) => x.level === "unknown")).toBe(true);
    expect(r.evidence).toBe("unknown");
    expect(r.answered).toBe(0);
  });
  it("berechnet historische Antworten niemals nach den neuen Regeln", () => {
    const c = createCheck("existing");
    c.methodologyVersion = "quick-check-2.0";
    expect(() => evaluateProvider(c)).toThrow();
  });
  it("mischt die früheren Zukunftsszenarien nicht in einen neuen Plattform-Check", () => {
    const c = createCheck("existing");
    c.scenarios = createScenarioWorkspace();
    expect(() => parseChecks(serializeChecks([c]))).toThrow();
  });
  it("erhält neue Ergebnisse beim JSON-Rundlauf und lehnt vertauschte Methoden ab", () => {
    const c = rated([10, 10, 10, 10, 10, 10, 8, 2, 3, 6, 5, 7]);
    const restored = parseChecks(serializeChecks([c]))[0];
    expect(evaluateProvider(restored)).toEqual(evaluateProvider(c));
    const raw = JSON.parse(serializeChecks([c]));
    raw.checks[0].methodologyVersion = "quick-check-2.0";
    expect(() => parseChecks(JSON.stringify(raw))).toThrow();
    raw.checks[0].methodologyVersion = "quick-check-3.0";
    expect(() => parseChecks(JSON.stringify(raw))).toThrow();
  });
  it("zeigt in Ansicht und Druck dieselben getrennten Befunde ohne Risikoscore", () => {
    const c = rated([9, 9, 8, 10, 8, 9, 8, 1, 2, 6, 3, 4]);
    const r = evaluateProvider(c);
    const screen = renderToStaticMarkup(
      createElement(ProviderResults, {
        check: c,
        onEdit() {},
        onMethod() {},
        onPrint() {},
        onExport() {},
        onScenarioChange() {},
      }),
    );
    const report = renderToStaticMarkup(
      createElement(QuickReport, { check: c }),
    );
    for (const markup of [screen, report]) {
      expect(markup).toContain(r.headline);
      expect(markup).toContain(r.evidenceText);
      for (const route of r.routes) expect(markup).toContain(route.description);
      expect(markup).not.toContain("Risikoscore");
      expect(markup).not.toContain("Weltklasseexperten");
    }
    expect(report).toContain("quick-check-3.1");
    expect(report).toContain(c.methodologySnapshot[6].high);
    expect(screen).not.toMatch(/<details[^>]*\sopen[\s=>]/);
    expect(report).toMatch(/<details[^>]*\sopen[\s=>]/);
  });
  it("bezeichnet eine hohe Schutzantwort nicht als hohes Risiko", () => {
    const c = rated(Array(12).fill(10));
    c.step = 6;
    const page = renderToStaticMarkup(
      createElement(Question, {
        check: c,
        onAnswer() {},
        onAdvance() {},
        onStep() {},
      }),
    );
    expect(page).toContain(c.methodologySnapshot[6].high);
    expect(page).not.toContain("Risikosignal");
    expect(page).not.toContain("hohes Risiko");
  });
  it("unterscheidet Grenzen, mittlere Angaben und unbekannte Belege", () => {
    const c = rated(Array(12).fill(6));
    expect(evaluateProvider(c).routes.every((x) => x.level === "partial")).toBe(
      true,
    );
    expect(
      evaluateProvider(c).protections.every((x) => x.level === "limited"),
    ).toBe(true);
    expect(evaluateProvider(c).evidence).toBe("partial");
    answerCheck(c, "Q11", "unknown");
    expect(evaluateProvider(c).evidence).toBe("unknown");
  });
});
