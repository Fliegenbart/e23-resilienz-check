import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  answerCheck,
  calculateRisk,
  createCheck as createNewCheck,
  QUICK_METHODS,
  parseChecks,
  serializeChecks,
  type QuickQuestion,
} from "../src/quick/model";
import {
  evaluateProvider,
  evaluateProviderScenario,
} from "../src/quick/provider-analysis";
import providerV31 from "../src/quick/methods/quick-check-3.1.json";
import { ProviderResults } from "../src/quick/ProviderResults";
import { ProviderMethodContent } from "../src/quick/ProviderMethod";
import { QuickReport } from "../src/quick/Report";
import { DEFAULT_PROVIDER_SCENARIO } from "../src/quick/provider-scenario";

function createCheck(type: "existing" | "idea") {
  const check = createNewCheck(type);
  check.methodologyVersion = "quick-check-4.0";
  check.methodologySnapshot = structuredClone(QUICK_METHODS["quick-check-4.0"]);
  return check;
}

function rated(value = 9) {
  const check = createCheck("existing");
  check.methodologySnapshot.forEach((q) => answerCheck(check, q.id, value));
  check.view = "results";
  return check;
}

describe("Zwölf Fragen zu KI-Risiko, Schutz und eigenem Nutzen", () => {
  it("bewahrt die V4-Faktoren direkt und weiterhin in genau zwölf Fragen ab", () => {
    const c = createCheck("existing");
    expect(c.methodologyVersion).toBe("quick-check-4.0");
    expect(c.methodologySnapshot).toHaveLength(12);
    for (const [id, word] of [
      ["Q4", "KI-Schwächen"],
      ["Q6", "Netzwerks"],
      ["Q8", "Verantwortung"],
      ["Q11", "besserer KI"],
      ["Q12", "KI-Vergleich"],
    ]) {
      expect(c.methodologySnapshot.find((q) => q.id === id)?.text).toContain(
        word,
      );
    }
  });

  it("verrechnet sechs Schutzfaktoren und eigenen Nutzen nicht mit den drei Risiken", () => {
    const c = rated();
    const r = evaluateProvider(c);
    expect(r.routes.map((x) => [x.id, x.level])).toEqual([
      ["replace", "high"],
      ["bundle", "high"],
      ["model-gap", "high"],
    ]);
    expect(r.protections.filter((x) => x.level === "strong")).toHaveLength(6);
    expect(r.benefit?.level).toBe("high");
    expect(calculateRisk(c).score).toBeNull();
    for (let i = 5; i <= 12; i++) answerCheck(c, `Q${i}`, 1);
    expect(evaluateProvider(c).routes).toEqual(r.routes);
  });

  it("erkennt einen schwindenden KI-Vorsprung auch unabhängig vom Plattformzugang", () => {
    const c = rated(1);
    answerCheck(c, "Q4", 10);
    const r = evaluateProvider(c);
    expect(r.routes.map((x) => x.level)).toEqual([
      "barrier",
      "barrier",
      "high",
    ]);
    expect(r.headline).toBe("Ihr Vorsprung könnte verschwinden.");
    expect(r.actions[0].questionIds).toEqual(["Q4"]);
  });

  it("bewertet Netzwerk und Verantwortung einzeln, ohne sie als Belege zu behandeln", () => {
    const c = rated(1);
    answerCheck(c, "Q6", 8);
    answerCheck(c, "Q8", 7);
    const r = evaluateProvider(c);
    expect(
      r.protections.filter((x) => x.level === "strong").map((x) => x.id),
    ).toEqual(["network", "responsibility"]);
    expect(r.evidence).toBe("untested");
    expect(r.summary).toContain("nicht belegt");
  });

  it.each([
    [1, "untested"],
    [3, "untested"],
    [4, "partial"],
    [6, "partial"],
    [7, "supported"],
    [10, "supported"],
    ["unknown", "unknown"],
  ] as const)(
    "nimmt für Belege nur den bezahlten KI-Vergleich: %s",
    (value, level) => {
      const c = rated(1);
      answerCheck(c, "Q12", value);
      expect(evaluateProvider(c).evidence).toBe(level);
      answerCheck(c, "Q11", 10);
      expect(evaluateProvider(c).evidence).toBe(level);
    },
  );

  it.each([
    [3, "barrier", "weak", "low"],
    [4, "partial", "limited", "partial"],
    [6, "partial", "limited", "partial"],
    [7, "high", "strong", "high"],
  ])(
    "hält die Grenzen 3/4 und 6/7 konsistent: %s",
    (value, route, protection, benefit) => {
      const r = evaluateProvider(rated(Number(value)));
      expect(r.routes.every((x) => x.level === route)).toBe(true);
      expect(r.protections.every((x) => x.level === protection)).toBe(true);
      expect(r.benefit?.level).toBe(benefit);
    },
  );

  it("lässt fehlende Angaben offen und zeigt bestätigte Risiken trotzdem", () => {
    const c = rated();
    for (const id of ["Q2", "Q6", "Q8", "Q11", "Q12"])
      answerCheck(c, id, "unknown");
    const r = evaluateProvider(c);
    expect(r.routes.map((x) => x.level)).toEqual([
      "unknown",
      "unknown",
      "high",
    ]);
    expect(r.protections.find((x) => x.id === "network")?.level).toBe(
      "unknown",
    );
    expect(r.protections.find((x) => x.id === "responsibility")?.level).toBe(
      "unknown",
    );
    expect(r.benefit?.level).toBe("unknown");
    expect(r.evidence).toBe("unknown");
    expect(r.headline).toContain("unvollständig");
    expect(r.actions).toHaveLength(3);
    const empty = evaluateProvider(createCheck("idea"));
    expect(empty.answered).toBe(0);
    expect(empty.headline).toContain("offen");
    expect(empty.routes.every((x) => x.level === "unknown")).toBe(true);
  });

  it("bewahrt alte Fragen und Regeln neben neuen Checks beim Export", () => {
    const old = rated();
    old.methodologyVersion = "quick-check-3.1";
    old.methodologySnapshot = structuredClone(providerV31) as QuickQuestion[];
    old.providerScenario = {
      ...DEFAULT_PROVIDER_SCENARIO,
      capabilityPace: "fast",
    };
    old.businessDescription = "Mein Geschäft";
    const current = rated();
    const restored = parseChecks(serializeChecks([old, current]));
    expect(restored).toEqual([old, current]);
    expect(evaluateProvider(restored[0]).routes[2].id).toBe("background");
    expect(evaluateProvider(restored[0]).protections).toHaveLength(4);
    expect(evaluateProvider(restored[0]).benefit).toBeUndefined();
    expect(evaluateProvider(restored[1]).routes[2].id).toBe("model-gap");
    for (const [check, version] of [
      [old, "quick-check-4.0"],
      [current, "quick-check-3.1"],
    ] as const) {
      const raw = JSON.parse(serializeChecks([check]));
      raw.checks[0].methodologyVersion = version;
      expect(() => parseChecks(JSON.stringify(raw))).toThrow();
    }
  });

  it("zeigt dieselben getrennten Befunde und die richtige Methodik in Bildschirm und Bericht", () => {
    const check = rated();
    const r = evaluateProvider(check);
    const screen = renderToStaticMarkup(
      createElement(ProviderResults, {
        check,
        onEdit() {},
        onMethod() {},
        onPrint() {},
        onExport() {},
        onScenarioChange() {},
        onDescriptionChange() {},
        onAnalysisChange() {},
      }),
    );
    const report = renderToStaticMarkup(createElement(QuickReport, { check }));
    for (const markup of [screen, report]) {
      expect(markup).toContain(r.headline);
      expect(markup).toContain(r.evidenceText);
      expect(markup).toContain("Was Sie gewinnen können");
      expect(markup).toContain(r.benefit!.description);
      for (const protection of r.protections)
        expect(markup).toContain(protection.title);
      expect(markup).not.toContain("Risikoscore");
    }
    expect(screen).not.toMatch(/<details[^>]*\sopen[\s=>]/);
    expect(report).toMatch(/<details[^>]*\sopen[\s=>]/);
    expect(report).toContain("quick-check-4.0");
    expect(report).toContain("Q5–Q10");
    expect(report).not.toContain("Q1/Q2/Q4");
    const currentMethod = renderToStaticMarkup(
      createElement(ProviderMethodContent, { version: "quick-check-4.0" }),
    );
    const oldMethod = renderToStaticMarkup(
      createElement(ProviderMethodContent, { version: "quick-check-3.1" }),
    );
    expect(currentMethod).toContain("Q5–Q10");
    expect(currentMethod).toContain("Q11");
    expect(oldMethod).toContain("Q1/Q2/Q4");
    expect(oldMethod).not.toContain("Q5–Q10");
  });
});

describe("V4-Szenario: zwei Jahre, zwei unabhängige Annahmen", () => {
  it("ändert Risiko und eigenen Nutzen mit dem KI-Tempo, Preisdruck separat", () => {
    const c = rated();
    const structural = evaluateProvider(c);
    const capabilities = new Set<string>();
    const benefits = new Set<string>();
    const prices = new Map<string, string>();
    for (const capabilityPace of ["slow", "medium", "fast"] as const) {
      const sameCapability = new Set<string>();
      const sameBenefit = new Set<string>();
      for (const pricePace of ["slow", "medium", "fast"] as const) {
        c.providerScenario = {
          ...DEFAULT_PROVIDER_SCENARIO,
          capabilityPace,
          pricePace,
        };
        const r = evaluateProviderScenario(c);
        expect(r.capability.routeId).toBe("model-gap");
        expect(r.capability.text).toContain("Vorsprung");
        sameCapability.add(r.capability.text);
        sameBenefit.add(r.benefit!.text);
        capabilities.add(r.capability.text);
        benefits.add(r.benefit!.text);
        if (prices.has(pricePace))
          expect(r.price.text).toBe(prices.get(pricePace));
        prices.set(pricePace, r.price.text);
        expect(evaluateProvider(c)).toEqual(structural);
        expect(
          evaluateProviderScenario(parseChecks(serializeChecks([c]))[0]),
        ).toEqual(r);
      }
      expect(sameCapability.size).toBe(1);
      expect(sameBenefit.size).toBe(1);
    }
    expect(capabilities.size).toBe(3);
    expect(benefits.size).toBe(3);
    expect(new Set(prices.values()).size).toBe(3);
  });

  it("macht schnellen Fortschritt weder zu Datenzugang noch zu eigenem Nutzen", () => {
    const c = rated(1);
    c.providerScenario = {
      ...DEFAULT_PROVIDER_SCENARIO,
      capabilityPace: "fast",
      pricePace: "fast",
    };
    let r = evaluateProviderScenario(c);
    expect(r.capability.level).toBe("barrier");
    expect(r.price.level).toBe("barrier");
    expect(r.benefit?.level).toBe("low");
    answerCheck(c, "Q11", "unknown");
    r = evaluateProviderScenario(c);
    expect(r.benefit?.level).toBe("unknown");
    expect(r.benefit?.text).toContain("offen");
  });
});
