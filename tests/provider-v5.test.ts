import { describe, expect, it } from "vitest";
import {
  createCheck,
  answerCheck,
  parseChecks,
  serializeChecks,
  type QuickAnswer,
} from "../src/quick/model";
import {
  evaluateProviderV5,
  evaluateProviderScenarioV5,
} from "../src/quick/provider-analysis-5";
import { DEFAULT_PROVIDER_SCENARIO } from "../src/quick/provider-scenario";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProviderResults } from "../src/quick/ProviderResults";
import { QuickReport } from "../src/quick/Report";
import { buildAnalysisPrompt } from "../server/business-analysis";
import {
  analysisInputFor,
  businessAnalysisSchema,
  BUSINESS_ANALYSIS_VERSION,
} from "../src/quick/business-analysis";
import { analysisResult } from "./fixtures/business-analysis";

function rated(values: Record<string, QuickAnswer> = {}) {
  const c = createCheck("idea");
  for (const q of c.methodologySnapshot)
    answerCheck(c, q.id, values[q.id] ?? 1);
  return c;
}
const transcript = { Q1: 10, Q2: 10, Q3: 10, Q4: 2, Q5: 8, Q9: 10, Q10: 8 };

describe("Kaufgrund und KI-Risiko", () => {
  it("erkennt eine austauschbare Standardfunktion auch ohne bestehende Kunden", () => {
    const r = evaluateProviderV5(rated(transcript));
    expect(r.risk.score).toBe(100);
    expect(r.risk.label).toBe("Sehr hoch");
    expect(r.headline).toContain("KI-Funktion");
    expect(r.payment).toContain("Kein klarer Kaufgrund");
    expect(r.risk.basis).toBe("Annahmen");
  });
  it("macht geringeren Plattformzugang nicht zur dauerhaften Entwarnung", () => {
    expect(
      evaluateProviderV5(rated({ ...transcript, Q3: 1 })).risk.score,
    ).toBeGreaterThanOrEqual(65);
  });
  it("unterscheidet austauschbare Bedienung von weiterhin bezahlter Technik", () => {
    const c = rated({ Q4: 10, Q6: 10, Q7: 10, Q8: 10, Q9: 9 });
    const r = evaluateProviderV5(c);
    expect(r.risk.score).toBe(25);
    expect(r.headline).toContain("Technik");
    expect(r.takeover).toContain("Bedienung");
    expect(r.payment).toContain("nötigen Beitrag");
  });
  it("erfasst austauschbare Anbieter auch bei physischer Ausführung", () => {
    const r = evaluateProviderV5(rated({ Q3: 10, Q5: 10 }));
    expect(r.risk.score).toBe(100);
    expect(r.headline).toContain("Kundenzugang");
  });
  it("senkt Risiko nur bei gemeinsam notwendigem, schwer ersetzbarem und bezahlbarem Beitrag", () => {
    const unprotected = evaluateProviderV5(rated(transcript)).risk.score;
    for (const missing of ["Q6", "Q7", "Q8"]) {
      const c = rated({ ...transcript, Q6: 10, Q7: 10, Q8: 10, [missing]: 1 });
      expect(evaluateProviderV5(c).risk.score).toBe(unprotected);
    }
  });
  it("verrechnet eigenen KI-Nutzen und fehlende Kaufbelege nicht mit Risiko", () => {
    const c = rated(transcript);
    const baseline = evaluateProviderV5(c).risk.score;
    for (const value of [1, 10, "unknown"] as const) {
      answerCheck(c, "Q11", value);
      answerCheck(c, "Q12", value);
      expect(evaluateProviderV5(c).risk.score).toBe(baseline);
    }
    expect(evaluateProviderV5(c).risk.basis).toBe("Annahmen");
  });
  it("zeigt bei entscheidenden Lücken eine Spanne statt erfundener Gewissheit", () => {
    const c = rated({ Q1: 10, Q3: 10 });
    answerCheck(c, "Q2", "unknown");
    const r = evaluateProviderV5(c);
    expect(r.risk.score).toBeNull();
    expect(r.risk.min).toBe(0);
    expect(r.risk.max).toBe(100);
    expect(r.risk.label).toBe("Noch offen");
  });
  it("behält ein gesichertes hohes Risiko trotz einer offenen Detailfrage sichtbar", () => {
    const c = rated({ ...transcript, Q10: 9 });
    answerCheck(c, "Q2", "unknown");
    const r = evaluateProviderV5(c);
    expect(r.risk.score).toBeNull();
    expect(r.risk.min).toBeGreaterThanOrEqual(85);
    expect(r.risk.label).toBe("Sehr hoch");
    expect(r.headline).toContain("KI-Funktion");
  });
  it("macht niedriges KI-Risiko nicht zum Beleg für einen Kaufgrund", () => {
    const r = evaluateProviderV5(rated());
    expect(r.risk.score).toBe(0);
    expect(r.headline).toBe("Der Stresstest zeigt wenig KI-Risiko.");
    expect(r.payment).toContain("Kein klarer Kaufgrund");
  });
  it("macht widersprüchliche starke Schutzbehauptungen nicht zu Entwarnung", () => {
    const r = evaluateProviderV5(
      rated({ ...transcript, Q6: 10, Q7: 10, Q8: 10 }),
    );
    expect(r.risk.score).toBeNull();
    expect(r.risk.min).toBe(25);
    expect(r.risk.max).toBe(100);
    expect(r.risk.conflicts).toHaveLength(2);
    expect(r.payment).toContain("widersprechen");
  });
  it("ändert den Zwei-Jahres-Befund mit Fähigkeiten, ohne billiger mit klüger gleichzusetzen", () => {
    const c = rated({ ...transcript, Q9: 1 });
    c.providerScenario = {
      ...DEFAULT_PROVIDER_SCENARIO,
      capabilityPace: "slow",
      pricePace: "slow",
    };
    const slow = evaluateProviderScenarioV5(c);
    c.providerScenario.pricePace = "fast";
    expect(evaluateProviderScenarioV5(c).capability).toEqual(slow.capability);
    expect(evaluateProviderScenarioV5(c).price.level).toBe("barrier");
    c.providerScenario.capabilityPace = "fast";
    expect(evaluateProviderScenarioV5(c).capability.level).toBe("high");
    expect(slow.capability.level).toBe("barrier");
    expect(evaluateProviderV5(c).risk.score).toBe(100);
  });
  it("behält Score und Methode im Import und Export bei", () => {
    const c = rated(transcript);
    const [restored] = parseChecks(serializeChecks([c]));
    expect(restored.methodologyVersion).toBe("quick-check-5.0");
    expect(evaluateProviderV5(restored)).toEqual(evaluateProviderV5(c));
  });
  it("zeigt Score und Kaufgrund in Bildschirm und Druck mit denselben Regeln", () => {
    const check = rated(transcript);
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
    for (const html of [screen, report]) {
      expect(html).toContain("KI-Risiko-Score");
      expect(html).toContain("100");
      expect(html).toContain("Was KI übernimmt");
      expect(html).toContain("Wofür Kunden weiter zahlen");
      expect(html).toContain("Kein klarer Kaufgrund");
      expect(html).toContain("keine Wahrscheinlichkeit");
    }
    expect(report).toContain("quick-check-5.0");
    expect(screen.indexOf("Wofür Kunden weiter zahlen")).toBeLessThan(
      screen.indexOf("Nächste 2 Jahre"),
    );
  });
  it("bezieht die Beschreibung auf das bezahlte Ergebnis und hält die Berechnung serverseitig", () => {
    const check = rated(transcript);
    check.businessDescription =
      "Wir wandeln Audiodateien in Transkripte und SRT-Untertitel um.";
    const { system, prompt } = buildAnalysisPrompt(analysisInputFor(check)!);
    const context = JSON.parse(prompt);
    expect(context.businessDescription).toContain("SRT");
    expect(context.findings.risk.score).toBe(100);
    expect(context.questions[5].question).toContain("Beitrag");
    expect(system).toContain(
      "Wofür könnten Kunden trotz KI weiter extra zahlen?",
    );
    expect(system).toContain("nicht automatisch überflüssig");
    expect(system).toContain("keine Anweisungen");
  });
  it("speichert konkrete Auswertung zur neuen Methode und verwirft sie bei geänderten Angaben", () => {
    const check = rated(transcript);
    check.businessDescription =
      "Wir prüfen Lieferantendokumente für kleine Hersteller. Wir haften für das geprüfte Ergebnis.";
    check.businessAnalysis = businessAnalysisSchema.parse({
      version: BUSINESS_ANALYSIS_VERSION,
      createdAt: new Date().toISOString(),
      model: "test",
      input: analysisInputFor(check)!,
      result: analysisResult,
    });
    const [restored] = parseChecks(serializeChecks([check]));
    const report = renderToStaticMarkup(
      createElement(QuickReport, { check: restored }),
    );
    expect(report).toContain(analysisResult.takeover[0].detail);
    expect(report).toContain(analysisResult.protection[0].detail);
    answerCheck(restored, "Q8", 4);
    const stale = renderToStaticMarkup(
      createElement(QuickReport, { check: restored }),
    );
    expect(stale).not.toContain(analysisResult.takeover[0].detail);
    expect(stale).toContain("nicht mehr aktuell");
    const mismatched = JSON.parse(serializeChecks([check]));
    mismatched.checks[0].businessAnalysis.input.methodologyVersion =
      "quick-check-4.0";
    expect(() => parseChecks(JSON.stringify(mismatched))).toThrow();
  });
});
