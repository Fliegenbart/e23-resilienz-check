import { it, expect } from "vitest";
import { examples } from "../src/fixtures/examples";
import {
  parseImport,
  serialize,
  applyImport,
} from "../src/import-export/exchange";
import { reportMarkdown } from "../src/import-export/report";
import { evidenceStatus } from "../src/rules/evaluate";
it("drei vollständige fiktive Beispiele lassen sich verlustfrei sichern", () => {
  const cases = examples();
  expect(cases).toHaveLength(3);
  expect(
    cases.every(
      (a) => a.isExample && a.content.evidence.every((e) => e.synthetic),
    ),
  ).toBe(true);
  expect(parseImport(serialize(cases)).assessments).toEqual(cases);
  expect(reportMarkdown(cases[1])).toContain("Fiktives Beispiel");
});
it("Beispielquellen verlieren im realen Fall die Belegqualifikation", () => {
  const a = examples()[1];
  expect(evidenceStatus(a, "C1", a.evaluationAsOf).substantiated).toBe(true);
  a.isExample = false;
  expect(evidenceStatus(a, "C1", a.evaluationAsOf).substantiated).toBe(false);
});
it("Beispiele überschreiben bestehende Fälle nicht", () => {
  const real = examples()[0];
  real.isExample = false;
  const result = applyImport([real], examples(), "copy");
  expect(result).toHaveLength(4);
  expect(result[0]).toEqual(real);
});
it("Managementteil enthält kritische Betriebslücken und offene Grundlagen", () => {
  const a = examples()[0];
  expect(reportMarkdown(a)).toContain("Kritische Betriebslücken");
  expect(reportMarkdown(a)).toContain("Offene Grundlagen");
});
it("datumähnliche Freitexte können den Bericht nicht zum Absturz bringen", () => {
  const a = examples()[0];
  a.content.title = "2026-99-99";
  expect(() => reportMarkdown(a)).not.toThrow();
});
it("Finanzbericht formatiert Szenarioergebnis und Veränderung auf Deutsch", () => {
  expect(reportMarkdown(examples()[1])).toContain("5.000 / -20.000");
  expect(reportMarkdown(examples()[1])).toContain("-20 % / -10 % / -25 %");
});
