import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  answerCheck,
  createCheck,
  parseChecks,
  serializeChecks,
} from "../src/quick/model";
import { EXPERT_QUESTIONS } from "../src/quick/expert-questions";
import providerV3 from "../src/quick/methods/quick-check-3.0.json";
import providerV31 from "../src/quick/methods/quick-check-3.1.json";
import type { QuickQuestion } from "../src/quick/model";
import * as analysis from "../src/quick/provider-analysis";
import { ProviderResults } from "../src/quick/ProviderResults";
import { QuickReport } from "../src/quick/Report";

function rated(value = 9) {
  const check = createCheck("existing");
  check.methodologyVersion = "quick-check-3.1";
  check.methodologySnapshot = structuredClone(providerV31) as QuickQuestion[];
  check.methodologySnapshot.forEach((q) => answerCheck(check, q.id, value));
  check.view = "results";
  return check;
}

const settings = {
  version: "provider-scenario-1.0" as const,
  horizonYears: 2 as const,
  capabilityPace: "fast" as const,
  pricePace: "slow" as const,
};

describe("Zwei-Jahres-Szenario", () => {
  it("erhält beide Tempi beim Export und Import", () => {
    const check = rated();
    check.providerScenario = settings;
    expect(parseChecks(serializeChecks([check]))[0]).toEqual(check);
  });

  it("wendet Mittel/Mittel an, ohne ältere Datensätze umzuschreiben", () => {
    const check = rated();
    const before = structuredClone(check);
    expect(analysis).toHaveProperty("evaluateProviderScenario");
    const result = analysis.evaluateProviderScenario(check);
    expect(result.settings).toEqual({
      ...settings,
      capabilityPace: "medium",
      pricePace: "medium",
    });
    expect(check).toEqual(before);
    expect(parseChecks(serializeChecks([check]))[0]).toEqual(before);
  });

  it("erlaubt das Szenario auch mit unveränderten ursprünglichen V3-Fragen", () => {
    const check = rated();
    check.methodologyVersion = "quick-check-3.0";
    check.methodologySnapshot = structuredClone(providerV3) as QuickQuestion[];
    check.providerScenario = settings;
    const restored = parseChecks(serializeChecks([check]))[0];
    expect(restored).toEqual(check);
    expect(analysis.evaluateProviderScenario(restored).settings).toEqual(
      settings,
    );
  });

  it.each([
    { capabilityPace: "unlimited" },
    { pricePace: "zero" },
    { horizonYears: 3 },
    { version: "provider-scenario-2.0" },
    { forecastProbability: 0.9 },
  ])("lehnt ungültige oder fremde Szenarioannahmen ab: %j", (change) => {
    const raw = JSON.parse(serializeChecks([rated()]));
    raw.checks[0].providerScenario = { ...settings, ...change };
    expect(() => parseChecks(JSON.stringify(raw))).toThrow();
  });

  it("mischt die neuen Tempi nicht mit historischen Score-Methoden", () => {
    const check = rated();
    check.methodologyVersion = "quick-check-2.0";
    check.methodologySnapshot = structuredClone(EXPERT_QUESTIONS);
    check.providerScenario = settings;
    expect(() => parseChecks(serializeChecks([check]))).toThrow();
    expect(analysis).toHaveProperty("evaluateProviderScenario");
    expect(() => analysis.evaluateProviderScenario(check)).toThrow();
  });

  it("variiert Fähigkeiten und Kosten unabhängig in allen neun Kombinationen", () => {
    const check = rated();
    const base = analysis.evaluateProvider(check);
    expect(analysis).toHaveProperty("evaluateProviderScenario");
    const capabilityTexts = new Set<string>();
    const priceTexts = new Set<string>();
    const priceByPace = new Map<string, string>();
    for (const capabilityPace of ["slow", "medium", "fast"] as const) {
      const sameCapability = new Set<string>();
      for (const pricePace of ["slow", "medium", "fast"] as const) {
        check.providerScenario = { ...settings, capabilityPace, pricePace };
        const result = analysis.evaluateProviderScenario(check);
        sameCapability.add(result.capability.text);
        capabilityTexts.add(result.capability.text);
        priceTexts.add(result.price.text);
        if (priceByPace.has(pricePace))
          expect(result.price.text).toBe(priceByPace.get(pricePace));
        priceByPace.set(pricePace, result.price.text);
        expect(analysis.evaluateProvider(check)).toEqual(base);
        const restored = parseChecks(serializeChecks([check]))[0];
        expect(analysis.evaluateProviderScenario(restored)).toEqual(result);
      }
      expect(sameCapability.size).toBe(1);
    }
    expect(capabilityTexts.size).toBe(3);
    expect(priceTexts.size).toBe(3);
  });

  it("lässt fehlende Antworten auch bei langsamem Fortschritt offen", () => {
    const check = createCheck("existing");
    check.methodologyVersion = "quick-check-3.1";
    check.methodologySnapshot = structuredClone(providerV31) as QuickQuestion[];
    check.providerScenario = { ...settings, capabilityPace: "slow" };
    expect(analysis).toHaveProperty("evaluateProviderScenario");
    const result = analysis.evaluateProviderScenario(check);
    expect(result.capability.level).toBe("unknown");
    expect(result.price.level).toBe("unknown");
    expect(result.capability.text).toContain("Antworten");
  });

  it("macht aus schnellem Fortschritt keinen Zugang zu fehlenden Daten", () => {
    const check = rated(1);
    check.providerScenario = { ...settings, pricePace: "fast" };
    expect(analysis).toHaveProperty("evaluateProviderScenario");
    const result = analysis.evaluateProviderScenario(check);
    expect(result.capability.level).toBe("barrier");
    expect(result.price.level).toBe("barrier");
    expect(result.capability.text).toContain("Hürden");
  });

  it("kennt Oberflächen- und Teilübernahme, ohne volle Ersetzbarkeit zu behaupten", () => {
    const check = rated();
    answerCheck(check, "Q1", 1);
    expect(analysis).toHaveProperty("evaluateProviderScenario");
    let result = analysis.evaluateProviderScenario(check);
    expect(result.capability.routeId).toBe("background");
    expect(result.capability.text).toContain("Oberfläche");
    answerCheck(check, "Q5", 5);
    result = analysis.evaluateProviderScenario(check);
    expect(result.capability.level).toBe("partial");
    expect(result.capability.text).toContain("Teile");
    expect(result.capability.text).toContain("Hürden");
  });

  it("zeigt Auswahl und gleiche Auswirkungen in Ergebnis und Druckbericht", () => {
    const check = rated();
    check.providerScenario = settings;
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
    expect(screen).toContain("Nächste 2 Jahre");
    expect(screen.match(/type="radio"/g)).toHaveLength(6);
    expect(screen.match(/checked=""/g)).toHaveLength(2);
    expect(analysis).toHaveProperty("evaluateProviderScenario");
    const result = analysis.evaluateProviderScenario(check);
    for (const markup of [screen, report]) {
      expect(markup).toContain(result.capability.text);
      expect(markup).toContain(result.price.text);
    }
    expect(report).toContain("KI wird besser: Schnell");
    expect(report).toContain("KI wird günstiger: Langsam");
    expect(report).not.toContain('type="radio"');
  });
});
