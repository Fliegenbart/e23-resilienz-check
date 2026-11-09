import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  createCheck,
  answerCheck,
  QUICK_METHODS,
  parseChecks,
  serializeChecks,
  type QuickAnswer,
} from "../src/quick/model";
import {
  evaluateProvider,
  evaluateProviderScenario,
} from "../src/quick/provider-analysis";
import {
  analysisInputFor,
  businessAnalysisSchema,
  currentBusinessAnalysis,
  BUSINESS_EXPERT_ANALYSIS_VERSION,
} from "../src/quick/business-analysis";
import {
  buildAnalysisPrompt,
  createAnalysisHandler,
} from "../server/business-analysis";
import { QuickReport } from "../src/quick/Report";
import { ExpertScenarioIntro } from "../src/quick/ExpertScenarioIntro";
import { ProviderRules } from "../src/quick/ProviderRules";

function rated(values: Record<string, QuickAnswer> = {}) {
  const c = createCheck("idea");
  for (const q of c.methodologySnapshot)
    answerCheck(c, q.id, values[q.id] ?? 1);
  c.businessDescription = "Wir erstellen Untertitel für Creator.";
  c.businessMoat = "Unsere Oberfläche und unsere Prompts sparen Arbeit.";
  c.view = "results";
  return c;
}
const digital = { Q1: 10, Q2: 10, Q3: 10, Q10: 10 };
const finding = (detail: string, questions = ["Q2"]) => ({
  title: "Konkreter Befund",
  detail,
  basisQuote: null,
  questions,
});
function reviewed(c = rated(digital)) {
  return businessAnalysisSchema.parse({
    version: BUSINESS_EXPERT_ANALYSIS_VERSION,
    model: "test",
    createdAt: new Date().toISOString(),
    input: analysisInputFor(c),
    result: {
      headline: "Ihr genannter Burggraben ist angreifbar.",
      summary: "Expertenteams können den Auftrag anders lösen.",
      takeover: [
        finding(
          "Ein Expertenteam könnte verständliche Inhalte direkt liefern.",
          ["Q10"],
        ),
      ],
      protection: [
        finding("Ein zusätzlicher Kaufgrund ist noch nicht belegt.", [
          "Q8",
          "Q12",
        ]),
      ],
      opportunity: finding(
        "Auch Sie könnten die Aufträge günstiger erledigen.",
        ["Q10"],
      ),
      nextStep: finding(
        "Lassen Sie einen Fachkundigen eine andere Lösung vergleichen.",
        ["Q10"],
      ),
      openQuestions: [],
      expertReview: {
        customer: finding("Der Creator könnte Untertitel selbst erzeugen.", [
          "Q10",
        ]),
        competitor: finding(
          "Ein Untertiteldienst könnte mehr Aufträge günstiger liefern.",
          ["Q5"],
        ),
        newEntrant: finding(
          "Eine Videoplattform könnte verständliche Fassungen direkt bereitstellen.",
          ["Q1"],
        ),
        access: finding("Die Audiodatei und ihre Freigabe bleiben nötig."),
        incentive: finding(
          "Regelmäßige Aufträge könnten den Betrieb lohnen; Kosten sind ungeprüft.",
          ["Q11"],
        ),
      },
      moatReview: c.businessMoat
        ? {
            verdict: "replaceable",
            pace: "feature_update",
            reason:
              "Die Oberfläche schützt nicht vor einer anderen Lösung des Kundenproblems.",
            basisQuote: c.businessMoat,
          }
        : null,
    },
  });
}

describe("Expertenteams für alle statt vom Nutzer geschätzter KI-Zukunft", () => {
  it("fragt nach dem Geschäft und einer Expertenlösung, ohne V5-Antworten umzudeuten", () => {
    const c = rated();
    expect(c.methodologyVersion).toBe("quick-check-6.0");
    expect(c.methodologySnapshot).toHaveLength(12);
    expect(c.methodologySnapshot[9].text).toContain("Expertenteam");
    expect(c.methodologySnapshot[9].help).toContain("anderen Weg");
    expect(c.methodologySnapshot[10].text).toContain("Wie häufig");
    expect(QUICK_METHODS["quick-check-5.0"][9].text).toContain(
      "Vorsprungs verschwindet",
    );
    expect(QUICK_METHODS["quick-check-5.0"][10].text).toContain("profitiert");
    const old = structuredClone(c);
    old.id = crypto.randomUUID();
    old.methodologyVersion = "quick-check-5.0";
    old.methodologySnapshot = structuredClone(
      QUICK_METHODS[old.methodologyVersion],
    );
    expect(parseChecks(serializeChecks([old, c]))).toEqual([old, c]);
  });
  it("macht Expertenwissen ohne Daten und Zugänge nicht zum automatischen Höchstrisiko", () => {
    const accessible = rated({ ...digital, Q4: 10, Q5: 10 });
    const blocked = rated({ ...digital, Q2: 1, Q4: 10, Q5: 10 });
    expect(evaluateProvider(accessible).risk?.score).toBe(100);
    expect(evaluateProvider(blocked).risk?.score).toBe(0);
    expect(evaluateProvider(blocked).access).toContain(
      "Mehr Fachwissen allein",
    );
    answerCheck(blocked, "Q2", "unknown");
    expect(evaluateProvider(blocked).risk).toMatchObject({
      score: null,
      min: 0,
      max: 100,
    });
  });
  it("unterscheidet die direkte Expertenlösung von der Vermittlung anderer Anbieter", () => {
    expect(evaluateProvider(rated({ ...digital, Q10: 1 })).risk?.score).toBe(0);
    const physical = rated({ Q2: 10, Q3: 10, Q5: 10, Q10: 1 });
    expect(evaluateProvider(physical).risk?.score).toBe(100);
    expect(evaluateProvider(physical).headline).toContain("Kundenzugang");
  });
  it("verwechselt häufigen Bedarf nicht mit Profitabilität und gibt Nischen keine automatische Entwarnung", () => {
    const c = rated(digital);
    const score = evaluateProvider(c).risk?.score;
    expect(evaluateProvider(c).incentive).toContain(
      "schließt eine Übernahme nicht aus",
    );
    answerCheck(c, "Q11", 10);
    expect(evaluateProvider(c).risk?.score).toBe(score);
    expect(evaluateProvider(c).incentive).toContain(
      "Kosten sind noch zu prüfen",
    );
    answerCheck(c, "Q11", "unknown");
    expect(evaluateProvider(c).risk?.score).toBe(score);
    expect(evaluateProvider(c).incentive).toContain("offen");
  });
  it("lässt Kosten keine Fähigkeiten oder Zugänge erzeugen", () => {
    const c = rated({ ...digital, Q2: 1, Q9: 2 });
    c.providerScenario = {
      version: "provider-scenario-1.0",
      horizonYears: 2,
      capabilityPace: "slow",
      pricePace: "slow",
    };
    const before = evaluateProviderScenario(c);
    c.providerScenario.pricePace = "fast";
    expect(evaluateProviderScenario(c).capability).toEqual(before.capability);
    c.providerScenario.capabilityPace = "fast";
    expect(evaluateProviderScenario(c).capability.level).toBe("barrier");
    expect(evaluateProvider(c).risk?.score).toBe(0);
  });
  it("öffnet den Blick auf Selbstmachen, bekannte und unbekannte Wettbewerber", () => {
    const html = renderToStaticMarkup(
      createElement(ExpertScenarioIntro, { onStart() {} }),
    );
    for (const text of [
      "Spitzenexperten",
      "Rund um die Uhr",
      "Ihr Kunde",
      "Ihr Wettbewerber",
      "neuer Anbieter",
      "anderen Branche",
      "Auch Sie",
      "nicht automatisch",
    ])
      expect(html).toContain(text);
  });
  it("verlangt im KI-Prompt andere Lösungswege und wirtschaftliche Bedingungen statt eines Datums", () => {
    const { system, prompt } = buildAnalysisPrompt(
      analysisInputFor(rated(digital))!,
    );
    expect(system).toContain("keine Intelligenzexplosion als Voraussetzung");
    expect(system).toContain("bekannte Wettbewerber");
    expect(system).toContain("unbekannte Anbieter aus anderen Branchen");
    expect(system).toContain("nicht die bisherige Methode");
    expect(system).toContain("kein Versprechen für 12–18 Monate");
    expect(system).toContain("Q11 ist KEIN eigener KI-Nutzen");
    expect(system).toContain("keine automatische Entwarnung");
    expect(JSON.parse(prompt).questions[9].question).toContain("Expertenteam");
  });
  it("speichert die versionierte KI-Auswertung mit allen drei Angreifern und Originalbezügen", () => {
    const c = rated(digital);
    c.businessAnalysis = reviewed(c);
    expect(parseChecks(serializeChecks([c]))[0]).toEqual(c);
    expect(currentBusinessAnalysis(c)).not.toBeNull();
    c.businessMoat += " Wir haben Daten.";
    expect(currentBusinessAnalysis(c)).toBeNull();
    const invalid = structuredClone(c.businessAnalysis) as any;
    invalid.result.expertReview.access.basisQuote = "Weltweit exklusive Daten";
    expect(businessAnalysisSchema.safeParse(invalid).success).toBe(false);
  });
  it("akzeptiert den Expertencheck ohne USP und lehnt Methoden-/Ausgabemischungen ab", () => {
    const c = rated();
    delete c.businessMoat;
    const analysis = reviewed(c);
    expect(
      "moatReview" in analysis.result && analysis.result.moatReview,
    ).toBeNull();
    for (const version of ["business-analysis-2.0", "business-analysis-3.0"])
      expect(
        businessAnalysisSchema.safeParse({ ...analysis, version }).success,
      ).toBe(false);
    const invalid: any = structuredClone(analysis);
    delete invalid.result.expertReview.newEntrant;
    expect(businessAnalysisSchema.safeParse(invalid).success).toBe(false);
  });
  it("zeigt im Bericht Burggraben, alle Angreifer, Zugang und Anreiz mit denselben Bezügen", () => {
    const c = rated(digital);
    c.businessAnalysis = reviewed(c);
    const html = renderToStaticMarkup(createElement(QuickReport, { check: c }));
    for (const text of [
      "Ihr Burggraben",
      "Drei mögliche Angreifer",
      "Videoplattform",
      "Was die Angreifer brauchen",
      "Warum sich der Angriff lohnen könnte",
      "Expertenteams",
    ])
      expect(html).toContain(text);
    const rules = renderToStaticMarkup(
      createElement(ProviderRules, { version: c.methodologyVersion }),
    );
    expect(rules).toContain("min(Q1, Q2, Q10)");
    expect(rules).toContain("Q11 verändert den Ersetzbarkeits-Score nicht");
  });
  it("liefert Auswertung 4.0 durch die tatsächliche API-Validierung", async () => {
    const c = rated(digital);
    const handler = createAnalysisHandler({
      generate: vi.fn().mockResolvedValue(reviewed(c).result),
    });
    const response = await handler(
      new Request("https://example.test/api/business-analysis", {
        method: "POST",
        headers: {
          Origin: "https://example.test",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(analysisInputFor(c)),
      }),
    );
    expect(response.status).toBe(200);
    expect((await response.json()).version).toBe(
      BUSINESS_EXPERT_ANALYSIS_VERSION,
    );
  });
});
