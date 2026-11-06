import "fake-indexeddb/auto";
import { it, expect } from "vitest";
import { createAssessment } from "../src/domain/model";
import { saveWorkspace, loadWorkspace } from "../src/storage/database";
it("Browserpersistenz erhält vollständige Fälle nach erneutem Öffnen", async () => {
  const a = createAssessment("Dauerhaft", "idea", "Frage");
  await saveWorkspace([a]);
  expect(await loadWorkspace()).toEqual([a]);
});
it("fehlgeschlagene Transaktion überschreibt keine gespeicherten Fälle", async () => {
  const a = createAssessment("Erhalten", "existing", "Frage");
  await saveWorkspace([a]);
  const bad: any = createAssessment("Ungültig", "idea", "Frage");
  bad.content.answers.A1.rating = "high";
  await expect(saveWorkspace([bad])).rejects.toThrow();
  expect(await loadWorkspace()).toEqual([a]);
});
