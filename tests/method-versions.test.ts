import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  createCheck as createCurrentCheck,
  answerCheck,
  calculateRisk,
  parseChecks,
  serializeChecks,
} from "../src/quick/model";
import {
  createScenarioWorkspace,
  startScenario,
  answerScenario,
  evaluateScenario,
} from "../src/quick/scenario-model";
import { QuickReport } from "../src/quick/Report";
import { Question } from "../src/quick/Question";
import { ScenarioReport } from "../src/quick/ScenarioReport";
import oldQuestions from "../src/quick/methods/quick-check-1.0.json";
import oldScenario from "../src/quick/methods/scenario-stress-1.0.json";
import type { QuickQuestion } from "../src/quick/model";
import { EXPERT_QUESTIONS } from "../src/quick/expert-questions";

function createCheck(type: "existing" | "idea") {
  const c = createCurrentCheck(type);
  c.methodologyVersion = "quick-check-2.0";
  c.methodologySnapshot = structuredClone(EXPERT_QUESTIONS);
  c.view = "intro";
  return c;
}

function oldCheck() {
  const c = createCheck("existing");
  c.methodologyVersion = "quick-check-1.0";
  c.methodologySnapshot = structuredClone(oldQuestions) as QuickQuestion[];
  c.view = "questions";
  c.step = 3;
  for (const q of c.methodologySnapshot)
    answerCheck(c, q.id, q.id === "Q4" ? 10 : 1);
  return c;
}

describe("Versionstreues Expertenteam-Modell", () => {
  it("bewahrt V2-Checks mit ihrem Gedankenexperiment und Fragenstand", () => {
    const c = createCheck("idea");
    expect(c.methodologyVersion).toBe("quick-check-2.0");
    expect(c.view).toBe("intro");
    expect(c.methodologySnapshot[3].text).toContain("Expertenteam");
  });
  it("behält alte Fragen und Handlungsempfehlungen im Score", () => {
    const c = oldCheck();
    const r = calculateRisk(c);
    expect(r.score).toBe(8);
    expect(r.critical[0].text).toBe(oldQuestions[3].text);
    expect(r.priorities[0].action).toBe(oldQuestions[3].action);
  });
  it("zeigt die tatsächlich beantworteten alten Fragen auch in Ansicht und PDF", () => {
    const c = oldCheck();
    const page = renderToStaticMarkup(
      createElement(Question, {
        check: c,
        onAnswer() {},
        onAdvance() {},
        onStep() {},
      }),
    );
    const report = renderToStaticMarkup(
      createElement(QuickReport, { check: c }),
    );
    expect(page).toContain(oldQuestions[3].text);
    expect(report).toContain(oldQuestions[3].text);
    expect(report).toContain("quick-check-1.0");
  });
  it("speichert beide Methoden gemeinsam und weist falsche Zuordnungen ab", () => {
    const checks = [oldCheck(), createCheck("idea")];
    expect(parseChecks(serializeChecks(checks))).toEqual(checks);
    const data = JSON.parse(serializeChecks(checks));
    data.checks[0].methodologyVersion = "quick-check-2.0";
    expect(() => parseChecks(JSON.stringify(data))).toThrow();
    expect(checks[0].methodologySnapshot).toEqual(oldQuestions);
  });
  it("neue Szenarien verwenden Team-Szenarien mit neuer Version", () => {
    const w = createScenarioWorkspace();
    expect(w.methodVersion).toBe("scenario-stress-2.0");
    expect(w.methodSnapshot.catalog[0].story).toContain("Expertenteam");
    expect(w.methodSnapshot.questions[0].text).toContain("Team");
  });
  it("alte Szenarien behalten Fragen und Maßnahmen nach dem Import", () => {
    const c = oldCheck();
    const w = createScenarioWorkspace();
    // Originaldatei als Import prüfen, ohne eine V2-Methode in V1 umzuwandeln.
    const raw = JSON.parse(serializeChecks([c]));
    const r = startScenario(w, "s3");
    for (const id of [
      "value",
      "price",
      "access",
      "adapt",
      "opportunity",
    ] as const)
      answerScenario(r, id, 9);
    raw.checks[0].scenarios = {
      ...w,
      methodVersion: "scenario-stress-1.0",
      methodSnapshot: oldScenario,
    };
    const restored = parseChecks(JSON.stringify(raw))[0].scenarios!;
    const result = evaluateScenario(restored.runs[0], restored);
    expect(result.score).toBe(89);
    expect(result.actions[0].text).toBe(oldScenario.questions[0].text);
    expect(result.actions[0].action).toBe(oldScenario.questions[0].action);
    expect(restored.methodSnapshot).toEqual(oldScenario);
    const report = renderToStaticMarkup(
      createElement(ScenarioReport, { workspace: restored }),
    );
    expect(report).toContain("scenario-stress-1.0");
    expect(report).toContain(oldScenario.questions[0].text);
    expect(report).not.toContain("Die klügsten Forscher im Team");
  });
  it("druckt bei neuen Bewertungen das tatsächlich bewertete Expertenteam", () => {
    const c = createCheck("existing");
    const report = renderToStaticMarkup(
      createElement(QuickReport, { check: c }),
    );
    expect(report).toContain("zehn Weltklasseexperten");
    expect(report).toContain("sechs Monate");
    expect(report).toContain("quick-check-2.0");
    expect(report).toContain(c.methodologySnapshot[3].text);
    c.scenarios = createScenarioWorkspace();
    startScenario(c.scenarios, "s3");
    const scenarioReport = renderToStaticMarkup(
      createElement(ScenarioReport, { workspace: c.scenarios }),
    );
    expect(scenarioReport).toContain("Nobelpreisniveau");
    expect(scenarioReport).toContain("scenario-stress-2.0");
    expect(scenarioReport).not.toContain(
      "Ausgangspunkt sind angenommene heutige Fähigkeiten",
    );
  });
  it("weist auch bei Szenarien die Zuordnung eines V1-Katalogs zu V2 zurück", () => {
    const c = createCheck("existing");
    c.scenarios = createScenarioWorkspace();
    const data = JSON.parse(serializeChecks([c]));
    data.checks[0].scenarios.methodSnapshot = oldScenario;
    expect(() => parseChecks(JSON.stringify(data))).toThrow();
  });
});
