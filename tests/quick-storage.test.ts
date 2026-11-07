import "fake-indexeddb/auto";
import { it, expect, vi } from "vitest";
import { createCheck, answerCheck } from "../src/quick/model";
import { loadChecks, saveChecks } from "../src/quick/storage";
import { saveWorkspace, loadWorkspace } from "../src/storage/database";
import { createAssessment } from "../src/domain/model";
import oldQuestions from "../src/quick/methods/quick-check-1.0.json";
import type { QuickQuestion } from "../src/quick/model";
import {
  createScenarioWorkspace,
  startScenario,
  answerScenario,
} from "../src/quick/scenario-model";
it("speichert Szenarioannahmen, Auswahl und Position vollständig", async () => {
  const c = createCheck("existing");
  c.scenarios = createScenarioWorkspace();
  c.view = "scenarios";
  const r = startScenario(c.scenarios, "s4");
  answerScenario(r, "value", 8);
  r.step = 1;
  c.scenarios.view = "questions";
  await saveChecks([c]);
  expect(await loadChecks()).toEqual([c]);
});
it("speichert Antworten und aktuelle Position für die Wiederaufnahme", async () => {
  const c = createCheck("idea");
  answerCheck(c, "Q1", 7);
  c.step = 1;
  await saveChecks([c]);
  expect(await loadChecks()).toEqual([c]);
});
it("bewahrt alte und neue Fragenstände gemeinsam in derselben Datenbank", async () => {
  const old = createCheck("existing");
  old.methodologyVersion = "quick-check-1.0";
  old.methodologySnapshot = structuredClone(oldQuestions) as QuickQuestion[];
  old.view = "questions";
  answerCheck(old, "Q4", 9);
  const current = createCheck("idea");
  await saveChecks([old, current]);
  expect(await loadChecks()).toEqual([old, current]);
});
it("überschreibt die ursprüngliche Datenbank nicht", async () => {
  const legacy = createAssessment("Alt", "existing", "Bestehende Analyse");
  await saveWorkspace([legacy]);
  await saveChecks([createCheck("existing")]);
  expect(await loadWorkspace()).toEqual([legacy]);
});
it("Schreibfehler wird weitergegeben und die nächste Speicherung ist möglich", async () => {
  const c = createCheck("idea");
  await saveChecks([c]);
  const spy = vi
    .spyOn(IDBObjectStore.prototype, "put")
    .mockImplementationOnce(() => {
      throw new DOMException("Testfehler", "QuotaExceededError");
    });
  await expect(saveChecks([])).rejects.toThrow();
  spy.mockRestore();
  expect(await loadChecks()).toEqual([c]);
  await saveChecks([]);
  expect(await loadChecks()).toEqual([]);
});
