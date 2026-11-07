import "fake-indexeddb/auto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { createCheck, parseChecks, serializeChecks } from "../src/quick/model";
import { loadChecks, saveChecks } from "../src/quick/storage";
import { ProviderLanding } from "../src/quick/ProviderLanding";
import { QuickReport } from "../src/quick/Report";
import { evaluateProvider } from "../src/quick/provider-analysis";

describe("Business-Beschreibung", () => {
  it("speichert Freitext mit Zeilenumbrüchen und exportiert ihn unverändert", async () => {
    const check = createCheck("existing");
    check.businessDescription =
      "Wir planen Schichten für Pflegedienste.\nUnsere Kunden sind kleine Teams.";
    expect(parseChecks(serializeChecks([check]))[0]).toEqual(check);
    await saveChecks([check]);
    expect(await loadChecks()).toEqual([check]);
  });

  it("lässt bisherige Checks ohne Beschreibung unverändert", () => {
    const check = createCheck("existing");
    expect(check.businessDescription).toBeUndefined();
    expect(parseChecks(serializeChecks([check]))[0]).toEqual(check);
  });

  it("erlaubt 5.000 Zeichen und weist längere oder fremde Werte zurück", () => {
    const raw = JSON.parse(serializeChecks([createCheck("existing")]));
    raw.checks[0].businessDescription = "x".repeat(5000);
    expect(
      parseChecks(JSON.stringify(raw))[0].businessDescription,
    ).toHaveLength(5000);
    for (const value of ["x".repeat(5001), 42, null, {}]) {
      raw.checks[0].businessDescription = value;
      expect(() => parseChecks(JSON.stringify(raw))).toThrow();
    }
  });

  it("bietet die freiwillige Beschreibung direkt vor dem Start an", () => {
    const screen = renderToStaticMarkup(
      createElement(ProviderLanding, {
        description: "Wir planen Schichten.",
        onDescriptionChange() {},
        onStart() {},
        onExample() {},
        onResume() {},
        onMethod() {},
      }),
    );
    expect(screen).toContain("Was macht Ihr Business?");
    expect(screen).toContain("Optional");
    expect(screen).toContain("Wir planen Schichten.");
    expect(screen).toContain("<textarea");
    expect(screen).not.toMatch(/<textarea[^>]*required/);
    expect(screen).toContain("Diktieren");
  });

  it("übernimmt die Beschreibung sicher in den Bericht, ohne Antworten daraus zu erfinden", () => {
    const check = createCheck("existing");
    const before = evaluateProvider(check);
    check.businessDescription =
      '<script>alert("test")</script>\nUnser Business.';
    expect(evaluateProvider(check)).toEqual(before);
    const report = renderToStaticMarkup(createElement(QuickReport, { check }));
    expect(report).toContain("Ihr Business");
    expect(report).toContain("Unser Business.");
    expect(report).toContain("&lt;script&gt;");
    expect(report).not.toContain("<script>");
  });
});
