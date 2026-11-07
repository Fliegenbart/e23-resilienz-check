import "fake-indexeddb/auto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { answerCheck, parseChecks, serializeChecks } from "../src/quick/model";
import { saveChecks, loadChecks } from "../src/quick/storage";
import { QuickReport } from "../src/quick/Report";
import {
  analysisInputFor,
  analysisMatches,
  businessAnalysisSchema,
  BUSINESS_ANALYSIS_MODEL,
  requestBusinessAnalysis,
} from "../src/quick/business-analysis";
import { businessCheck, analysisResult } from "./fixtures/business-analysis";

function analyzed() {
  const check = businessCheck();
  check.businessAnalysis = {
    version: "business-analysis-1.0",
    createdAt: new Date().toISOString(),
    model: BUSINESS_ANALYSIS_MODEL,
    input: analysisInputFor(check)!,
    result: structuredClone(analysisResult),
  };
  return check;
}

describe("Individuelle Business-Auswertung", () => {
  it("sendet nur den nötigen Kontext und keine Historie oder Check-ID", () => {
    const input = analysisInputFor(businessCheck())!;
    expect(Object.keys(input).sort()).toEqual([
      "answers",
      "businessDescription",
      "methodologyVersion",
      "scenario",
    ]);
    expect(input.methodologyVersion).toBe("quick-check-4.0");
    expect(input.scenario.horizonYears).toBe(2);
    expect(input.answers.Q12).toBe(8);
  });
  it("wertet keine leere Beschreibung oder alte Fragen nach neuen Bedeutungen aus", () => {
    const check = businessCheck();
    check.businessDescription = "  ";
    expect(analysisInputFor(check)).toBeNull();
    check.businessDescription = "Unser Angebot ist eine Dokumentenprüfung.";
    check.methodologyVersion = "quick-check-3.1";
    expect(analysisInputFor(check)).toBeNull();
  });
  it("erhält Analyse und Eingabestand in JSON und IndexedDB", async () => {
    const check = analyzed();
    expect(parseChecks(serializeChecks([check]))[0]).toEqual(check);
    await saveChecks([check]);
    expect(await loadChecks()).toEqual([check]);
    expect(analysisMatches(check, check.businessAnalysis!)).toBe(true);
  });
  it("erkennt Änderungen an Beschreibung, Antworten und beiden Tempi", () => {
    for (const field of ["description", "answer", "capability", "price"]) {
      const check = analyzed();
      if (field === "description")
        check.businessDescription += " Wir liefern auch Geräte.";
      if (field === "answer") answerCheck(check, "Q8", "unknown");
      if (field === "capability")
        check.providerScenario = {
          ...check.businessAnalysis!.input.scenario,
          capabilityPace: "fast",
        };
      if (field === "price")
        check.providerScenario = {
          ...check.businessAnalysis!.input.scenario,
          pricePace: "slow",
        };
      expect(analysisMatches(check, check.businessAnalysis!)).toBe(false);
      expect(parseChecks(serializeChecks([check]))[0].businessAnalysis).toEqual(
        check.businessAnalysis,
      );
    }
  });
  it("bleibt bei geänderter Reihenfolge der Antwortschlüssel und Rand-Leerzeichen aktuell", () => {
    const check = analyzed();
    check.answers = Object.fromEntries(Object.entries(check.answers).reverse());
    check.businessDescription = `  ${check.businessDescription}\n`;
    expect(analysisMatches(check, check.businessAnalysis!)).toBe(true);
  });
  it("weist erfundene Zitate, fremde Frage-IDs und unbegrenzte Ausgaben ab", () => {
    for (const mutation of [
      (x: ReturnType<typeof analyzed>) => {
        x.businessAnalysis!.result.takeover[0].basisQuote =
          "Wir haben 500 Kunden";
      },
      (x: ReturnType<typeof analyzed>) => {
        x.businessAnalysis!.result.takeover[0].questions = ["Q99"] as never;
      },
      (x: ReturnType<typeof analyzed>) => {
        x.businessAnalysis!.result.summary = "a".repeat(501);
      },
      (x: ReturnType<typeof analyzed>) => {
        x.businessAnalysis!.result.headline = "Ein unvollständiger Satz, der";
      },
      (x: ReturnType<typeof analyzed>) => {
        x.businessAnalysis!.result.summary = "Q12 ist noch ungeprüft.";
      },
    ]) {
      const check = analyzed();
      mutation(check);
      expect(() =>
        businessAnalysisSchema.parse(check.businessAnalysis),
      ).toThrow();
      expect(() => parseChecks(serializeChecks([check]))).toThrow();
    }
  });
  it("druckt nur die zum aktuellen Geschäft passende Analyse und escaped Texte", () => {
    const check = analyzed();
    check.businessAnalysis!.result.headline = '<script>alert("x")</script>';
    const report = renderToStaticMarkup(createElement(QuickReport, { check }));
    expect(report).toContain("Dokumente vorprüfen");
    expect(report).toContain("KI-Auswertung");
    expect(report).not.toContain("<script>alert");
    expect(report).toContain("&lt;script&gt;");
    answerCheck(check, "Q4", 1);
    const stale = renderToStaticMarkup(createElement(QuickReport, { check }));
    expect(stale).not.toContain("Zehn Dokumente vergleichen");
    expect(stale).toContain("nicht mehr aktuell");
  });
  it("prüft Serverantworten gegen den angefragten Eingabestand", async () => {
    const check = analyzed();
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify(check.businessAnalysis), { status: 200 }),
      );
    const input = analysisInputFor(check)!;
    expect(await requestBusinessAnalysis(input, { fetcher })).toEqual(
      check.businessAnalysis,
    );
    expect(fetcher.mock.calls[0][0]).toBe("/api/business-analysis");
    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual(input);
    check.businessAnalysis!.input.businessDescription =
      "Ein völlig anderes Geschäft, das Maschinen verkauft.";
    check.businessAnalysis!.result.takeover[0].basisQuote = null;
    check.businessAnalysis!.result.protection[0].basisQuote = null;
    fetcher.mockResolvedValue(
      new Response(JSON.stringify(check.businessAnalysis), { status: 200 }),
    );
    await expect(requestBusinessAnalysis(input, { fetcher })).rejects.toThrow();
  });
  it("macht aus Fehlern keine erfundene individuelle Auswertung", async () => {
    const input = analysisInputFor(businessCheck())!;
    for (const status of [403, 429, 502, 503]) {
      await expect(
        requestBusinessAnalysis(input, {
          fetcher: vi
            .fn()
            .mockResolvedValue(
              new Response("<html>upstream error</html>", { status }),
            ),
        }),
      ).rejects.toThrow();
    }
    const controller = new AbortController();
    controller.abort();
    const fetcher = vi.fn();
    await expect(
      requestBusinessAnalysis(input, { fetcher, signal: controller.signal }),
    ).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("zeigt bei ungültigen Modellantworten keine technischen Schemainterna", async () => {
    const input = analysisInputFor(businessCheck())!;
    for (const body of ['{"result":{}}', "<html>upstream</html>"]) {
      await expect(
        requestBusinessAnalysis(input, {
          fetcher: vi
            .fn()
            .mockResolvedValue(new Response(body, { status: 200 })),
        }),
      ).rejects.toThrow(
        "Die KI-Antwort war unvollständig. Bitte erneut versuchen.",
      );
    }
  });
});
