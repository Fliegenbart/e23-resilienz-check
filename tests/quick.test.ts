import { describe, it, expect } from "vitest";
import {
  createCheck,
  calculateRisk,
  answerCheck,
  serializeChecks,
  parseChecks,
  mergeChecks,
  QUICK_QUESTIONS,
} from "../src/quick/model";
const complete = (value: number) => {
  const c = createCheck("existing");
  for (const q of QUICK_QUESTIONS) answerCheck(c, q.id, value);
  return c;
};
describe("Quick-Check Methodik 1.0", () => {
  it("enthält zwölf eigenständige Fragen in vier Bereichen", () => {
    expect(QUICK_QUESTIONS).toHaveLength(12);
    expect(new Set(QUICK_QUESTIONS.map((q) => q.group)).size).toBe(4);
  });
  it("ein leerer Check hat keinen Score", () => {
    expect(calculateRisk(createCheck("idea")).score).toBeNull();
  });
  it("zwölf Einsen ergeben 0, zwölf Zehnen ergeben 100", () => {
    expect(calculateRisk(complete(1)).score).toBe(0);
    expect(calculateRisk(complete(10)).score).toBe(100);
  });
  it("jede Frage hat dieselbe Richtung und dasselbe Gewicht", () => {
    for (const q of QUICK_QUESTIONS) {
      const c = complete(1);
      answerCheck(c, q.id, 10);
      expect(calculateRisk(c).score).toBe(8);
    }
  });
  it("Beispiel ergibt 68 und nachvollziehbare Teilrisiken", () => {
    const c = createCheck("existing");
    const ratings = [5, 5, 4, 10, 8, 7, 8, 7, 5, 10, 8, 8];
    QUICK_QUESTIONS.forEach((q, i) => answerCheck(c, q.id, ratings[i]));
    const r = calculateRisk(c);
    expect(r.score).toBe(68);
    expect(r.groups.map((x) => x.score)).toEqual([41, 81, 63, 85]);
    expect(r.critical).toHaveLength(2);
  });
  it("unbekannte und fehlende Antworten werden nicht als niedrige Risiken gewertet", () => {
    const c = complete(1);
    answerCheck(c, "Q1", "unknown");
    expect(calculateRisk(c).score).toBeNull();
    expect(calculateRisk(c).groups[0].score).toBeNull();
    expect(calculateRisk(c).answered).toBe(11);
  });
  it("ein kritischer Einzelwert bleibt auch bei niedrigem Gesamtscore sichtbar", () => {
    const c = complete(1);
    answerCheck(c, "Q11", 10);
    expect(calculateRisk(c).score).toBe(8);
    expect(calculateRisk(c).critical[0].id).toBe("Q11");
  });
  it("niedrige Risiken erfinden keine kritischen Prioritäten", () => {
    expect(calculateRisk(complete(1)).priorities).toHaveLength(0);
  });
  it("ungültige Zahlen und IDs werden abgewiesen", () => {
    const c = createCheck("idea");
    for (const value of [0, 11, 1.5, Infinity, NaN])
      expect(() => answerCheck(c, "Q1", value)).toThrow();
    expect(() => answerCheck(c, "Q99", 5)).toThrow();
  });
  it("JSON-Rundlauf erhält Antworten und Methode; Import verändert keine vorhandenen Daten", () => {
    const c = complete(7);
    const text = serializeChecks([c]);
    expect(parseChecks(text)).toEqual([c]);
    const existing = [c];
    const result = mergeChecks(existing, parseChecks(text), "copy");
    expect(result).toHaveLength(2);
    expect(result[1].id).not.toBe(c.id);
    expect(result[1].answers).toEqual(c.answers);
    expect(existing).toEqual([c]);
  });
  it("Ersetzen ist ausdrücklich möglich und bewahrt die Fall-ID", () => {
    const c = complete(2),
      incoming = structuredClone(c);
    answerCheck(incoming, "Q1", 10);
    const result = mergeChecks([c], [incoming], "replace");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(c.id);
    expect(result[0].answers.Q1).toBe(10);
  });
  it("beschädigter, zu großer oder zukünftiger Import wird abgewiesen", () => {
    expect(() => parseChecks("{kaputt")).toThrow();
    expect(() => parseChecks(" ".repeat(5 * 1024 * 1024 + 1))).toThrow();
    const data = JSON.parse(serializeChecks([complete(5)]));
    data.schemaVersion = "99";
    expect(() => parseChecks(JSON.stringify(data))).toThrow();
  });
  it("fremde Fragebögen und unvollständige Antwortobjekte werden abgewiesen", () => {
    const data = JSON.parse(serializeChecks([complete(5)]));
    data.checks[0].methodologySnapshot[0].text = "Andere Frage";
    expect(() => parseChecks(JSON.stringify(data))).toThrow();
  });
  it("es gibt keine automatische Übernahme alter Zwanzig-Fragen-Bewertungen", () => {
    expect(() =>
      parseChecks(
        JSON.stringify({ format: "ai-resilience-check", assessments: [] }),
      ),
    ).toThrow();
  });
});
