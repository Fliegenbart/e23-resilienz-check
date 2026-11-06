import "fake-indexeddb/auto";
import { it, expect, vi } from "vitest";
import { createCheck, answerCheck } from "../src/quick/model";
import { loadChecks, saveChecks } from "../src/quick/storage";
import { saveWorkspace, loadWorkspace } from "../src/storage/database";
import { createAssessment } from "../src/domain/model";
it("speichert Antworten und aktuelle Position für die Wiederaufnahme", async () => {
  const c = createCheck("idea");
  answerCheck(c, "Q1", 7);
  c.step = 1;
  await saveChecks([c]);
  expect(await loadChecks()).toEqual([c]);
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
