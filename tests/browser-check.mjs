import { chromium, expect as pwExpect } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.QA_APP_URL || "http://127.0.0.1:5178";
const executable =
  process.env.CHROMIUM_EXECUTABLE ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await chromium.launch({
  executablePath: executable,
  headless: true,
});
const out = "docs/qa";
await mkdir(out, { recursive: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  locale: "de-DE",
});
const page = await context.newPage();
const errors = [],
  external = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("request", (r) => {
  if (!r.url().startsWith(base) && !r.url().startsWith("data:"))
    external.push(r.url());
});
try {
  await page.goto(base);
  await page
    .getByRole("button", { name: "Neuen Fall anlegen", exact: true })
    .click();
  await page
    .getByLabel("Titel des Geschäftsfelds oder der Idee", { exact: true })
    .fill("Fiktiver Browsertest");
  await page
    .getByLabel("Welche Entscheidung soll vorbereitet werden?", { exact: true })
    .fill("Welche Annahme prüfen wir zuerst?");
  await page
    .getByRole("button", { name: "Fall erstellen", exact: true })
    .click();
  await page.getByLabel("Kunde / Alias", { exact: true }).fill("Nur Testdaten");
  await page.getByRole("status").filter({ hasText: "Gespeichert" }).waitFor();
  await page.reload();
  await page
    .getByRole("button", { name: "Fiktiver Browsertest", exact: true })
    .click();
  assert.equal(
    await page.getByLabel("Kunde / Alias", { exact: true }).inputValue(),
    "Nur Testdaten",
  );
  await page.getByRole("button", { name: "Prüfung", exact: true }).click();
  await page.getByRole("button", { name: "Unbekannt", exact: true }).click();
  assert.match(await page.locator(".process").innerText(), /1 unbekannt/);
  await page.getByRole("button", { name: "Entscheidung", exact: true }).click();
  assert.match(
    await page.locator("main").innerText(),
    /Noch nicht beurteilbar/,
  );
  await page
    .getByRole("button", { name: "Fallübersicht", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Fiktive Beispiele laden", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "Dokumentenprozess mit fachlicher Prüfung",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "Prüfung", exact: true }).click();
  await page
    .getByRole("button", {
      name: "A2 Welche Zahlungsbereitschaft besteht?",
      exact: true,
    })
    .click();
  await page.getByRole("status").filter({ hasText: "Gespeichert" }).waitFor();
  await page.screenshot({ path: `${out}/desktop.png`, fullPage: false });
  await page.getByRole("button", { name: "Entscheidung", exact: true }).click();
  await page
    .getByLabel("Prüfende Person", { exact: true })
    .fill("Automatisierter Funktionstest");
  await page
    .getByRole("button", { name: "Historischen Stand festhalten", exact: true })
    .click();
  assert.match(await page.locator("main").innerText(), /Fachlich durchgesehen/);
  await page.getByRole("button", { name: "Bericht", exact: true }).click();
  await page
    .getByLabel("Berichtsstand", { exact: true })
    .selectOption({ index: 1 });
  assert.match(
    await page.locator(".report").innerText(),
    /Historischer Stand 1/,
  );
  await page.screenshot({ path: `${out}/report.png`, fullPage: false });
  const printPage = await context.newPage();
  await printPage.goto(base + "/examples/Musterbericht.html");
  await printPage.pdf({
    path: "examples/Musterbericht.pdf",
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    tagged: true,
  });
  await printPage.close();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "JSON sichern", exact: true }).click(),
  ]);
  const file = await download.path();
  assert.ok(file);
  await page
    .getByRole("button", { name: "Fallübersicht", exact: true })
    .click();
  await page.locator("input[type=file]").setInputFiles(file);
  await page
    .getByRole("heading", { name: "Importvorschau", exact: true })
    .waitFor();
  await page
    .getByRole("button", { name: "Import übernehmen", exact: true })
    .click();
  await pwExpect(
    page.getByRole("button", {
      name: "Dokumentenprozess mit fachlicher Prüfung",
      exact: true,
    }),
  ).toHaveCount(2);
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: "kaputt.json",
      mimeType: "application/json",
      buffer: Buffer.from("{kaputt"),
    });
  await pwExpect(page.getByRole("alert")).toContainText("kein gültiges JSON");
  await pwExpect(
    page.getByRole("button", {
      name: "Dokumentenprozess mit fachlicher Prüfung",
      exact: true,
    }),
  ).toHaveCount(2);
  await page
    .getByRole("button", { name: "Fehlermeldung schließen", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Fiktiver Browsertest", exact: true })
    .click();
  await page.getByRole("button", { name: "Prüfung", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  );
  await page.screenshot({ path: `${out}/mobile.png`, fullPage: false });
  await page
    .getByRole("button", { name: "Nächste Frage", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  assert.match(
    await page.getByRole("heading", { level: 2 }).first().innerText(),
    /^A2/,
  );
  // A simulated storage error must remain visible and leave the in-memory draft exportable.
  await page.evaluate(() => {
    IDBObjectStore.prototype.put = function () {
      throw new DOMException(
        "Simulierter Speicherfehler",
        "QuotaExceededError",
      );
    };
  });
  await page.getByRole("button", { name: "Unbekannt", exact: true }).click();
  await page
    .getByRole("status")
    .filter({ hasText: "Speicherfehler" })
    .waitFor();
  assert.ok(
    await page
      .getByRole("button", { name: "JSON sichern", exact: true })
      .isEnabled(),
  );
  assert.deepEqual(errors, []);
  assert.deepEqual(external, []);
  await writeFile(
    `${out}/browser-result.json`,
    JSON.stringify(
      {
        passed: true,
        viewport: "1440x1000 / 390x844",
        externalRequests: external,
        pageErrors: errors,
        checks: [
          "Fall anlegen",
          "Persistenz nach Neuladen",
          "Unbekannt ohne Negativwertung",
        "R14 ohne inhaltliche Bewertung",
          "Fiktive Beispiele",
          "Historischer Stand",
          "PDF-Ausgabe",
          "JSON-Download und Kopierimport",
          "Fehlerhafter Import ohne Datenverlust",
          "Schmale Ansicht ohne Überlauf",
          "Tastaturbedienung",
          "Sichtbarer Speicherfehler und exportierbarer Entwurf",
        ],
      },
      null,
      2,
    ),
  );
  console.log(
    "Browserprüfung bestanden: 12 Abläufe, keine externen Requests oder Seitenfehler.",
  );
} finally {
  await browser.close();
}
