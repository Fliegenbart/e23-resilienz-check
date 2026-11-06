import { it, expect } from "vitest";
import { createAssessment } from "../src/domain/model";
import {
  serialize,
  parseImport,
  applyImport,
} from "../src/import-export/exchange";
import { reportMarkdown } from "../src/import-export/report";
it("vollständiger Rundlauf ohne Mutation beim Parsen", () => {
  const a = createAssessment("Fall", "idea", "Frage");
  const before = JSON.stringify(a);
  const parsed = parseImport(serialize([a]));
  expect(parsed.assessments[0]).toEqual(a);
  expect(JSON.stringify(a)).toBe(before);
});
it("beschädigter und zu großer Import wird abgewiesen", () => {
  expect(() => parseImport("{")).toThrow();
  expect(() => parseImport(" ".repeat(5 * 1024 * 1024 + 1))).toThrow();
});
it("zukünftiges Schema und verwaiste Referenzen werden abgewiesen", () => {
  const a = createAssessment("Fall", "existing", "Frage");
  const data = JSON.parse(serialize([a]));
  data.schemaVersion = "99.0";
  expect(() => parseImport(JSON.stringify(data))).toThrow();
  data.schemaVersion = "1.0";
  data.assessments[0].content.answers.A1.evidenceLinks = [
    { evidenceId: "missing", relation: "supports", explanation: "Test" },
  ];
  expect(() => parseImport(JSON.stringify(data))).toThrow();
});
it("nur rated darf rating enthalten und Nichtanwendbarkeit benötigt Begründung", () => {
  const a = createAssessment("Fall", "idea", "Frage");
  a.content.answers.A1.rating = "high";
  expect(() => parseImport(serialize([a]))).toThrow();
});
it("Kopierimport hat neue Fall-ID und erhält konsistente interne IDs", () => {
  const a = createAssessment("Fall", "idea", "Frage");
  const result = applyImport(
    [a],
    parseImport(serialize([a])).assessments,
    "copy",
  );
  expect(result).toHaveLength(2);
  expect(result[1].id).not.toBe(a.id);
  expect(result[1].content).toEqual(a.content);
});
it("unbekannte Methode bleibt lesbar ohne Neuberechnung", () => {
  const a = createAssessment("Alt", "existing", "Frage");
  a.methodologyVersion = "99";
  a.methodologySnapshot.version = "99";
  expect(parseImport(serialize([a])).assessments[0].methodologyVersion).toBe(
    "99",
  );
});
it("unbekannte Methode ohne Snapshot bleibt in Rohansicht", () => {
  const a: any = createAssessment("Alt", "existing", "Frage");
  a.methodologyVersion = "99";
  a.methodologySnapshot = null;
  expect(
    parseImport(serialize([a])).assessments[0].methodologySnapshot,
  ).toBeNull();
});
it("gefährliche URL wird nicht als aktiver Link in Bericht ausgegeben", () => {
  const a = createAssessment("<script>alert(1)</script>", "idea", "Frage");
  a.content.evidence.push({
    id: "e",
    revision: 1,
    title: "Quelle",
    kind: "other",
    url: "javascript:alert(1)",
    internalReference: null,
    authorOrOrigin: "",
    observation: "",
    eventDate: null,
    recordedAt: new Date().toISOString(),
    reviewStatus: "unreviewed",
    reviewedRevision: null,
    reviewedAt: null,
    reviewedBy: null,
    reviewDueAt: null,
    scopeAndLimitations: "",
    synthetic: false,
  });
  const text = reportMarkdown(a);
  expect(text).not.toContain("<script>");
  expect(text).not.toContain("](javascript:");
});

it("unbekannte Methode mit verändertem Fragenkatalog bleibt lesbar", () => {
  const a: any = createAssessment("Andere Methode", "idea", "Frage");
  a.methodologyVersion = "99";
  a.methodologySnapshot.version = "99";
  a.methodologySnapshot.questions[0].id = "A5";
  a.content.answers.A5 = { ...a.content.answers.A1, questionId: "A5" };
  delete a.content.answers.A1;
  expect(parseImport(serialize([a])).assessments[0].methodologyVersion).toBe(
    "99",
  );
});
