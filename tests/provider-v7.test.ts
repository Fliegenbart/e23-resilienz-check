import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  createCheck,
  answerCheck,
  QUICK_METHODS,
  serializeChecks,
  parseChecks,
  type QuickAnswer,
} from "../src/quick/model";
import {
  providerRiskV7,
  evaluateProviderV7,
  evaluateProviderScenarioV7,
} from "../src/quick/provider-analysis-7";
import {
  analysisInputFor,
  businessAnalysisSchema,
  currentBusinessAnalysis,
  BUSINESS_AGENT_ANALYSIS_VERSION,
} from "../src/quick/business-analysis";
import {
  providerResearchSchema,
  isProviderSourceUrl,
  type ProviderResearch,
} from "../src/quick/provider-research";
import {
  researchTopics,
  researchFromToolResults,
} from "../server/provider-research";
import {
  buildAnalysisPrompt,
  createAnalysisHandler,
} from "../server/business-analysis";
import { validateAgentOutput } from "../server/agent-analysis";
import {
  ProviderRiskScore,
  ProviderPurchaseFindings,
} from "../src/quick/ProviderRiskSummary";
import { QuickReport } from "../src/quick/Report";

function check(values: Record<string, QuickAnswer> = {}) {
  const c = createCheck("existing");
  for (const q of c.methodologySnapshot)
    answerCheck(c, q.id, values[q.id] ?? 1);
  c.businessDescription =
    "Happy Scribe liefert Transkripte aus Audiodateien der Kunden.";
  c.businessMoat = "Unser Editor und unsere Exportformate sind einzigartig.";
  c.view = "results";
  return c;
}
const noResearch: ProviderResearch = {
  status: "unavailable",
  retrievedAt: "2026-11-09T18:00:00Z",
  topics: ["audio"],
  sources: [],
};
const research: ProviderResearch = {
  ...noResearch,
  status: "retrieved",
  sources: [
    {
      id: "S1",
      title: "Audio uploads",
      url: "https://help.openai.com/en/articles/8555545-uploading-files-and-audio-to-chatgpt",
      excerpt:
        "ChatGPT can transcribe and discuss an audio recording. Availability varies by plan and settings.",
    },
  ],
};
const finding = (detail: string) => ({
  title: "Befund",
  detail,
  basisQuote: null,
  questions: ["Q10"],
});
function reviewed(c = check(), sources = noResearch) {
  return businessAnalysisSchema.parse({
    version: BUSINESS_AGENT_ANALYSIS_VERSION,
    model: "test",
    createdAt: "2026-11-09T18:00:01Z",
    input: analysisInputFor(c),
    research: sources,
    result: {
      headline: "Ihr Dienst könnte austauschbar werden.",
      summary: "Der Kaufgrund ist noch zu prüfen.",
      takeover: [finding("Ein Expertenteam könnte Transkripte liefern.")],
      protection: [finding("Ein zusätzlicher Kaufgrund ist ungeprüft.")],
      opportunity: finding("Sie könnten Korrekturen beschleunigen."),
      nextStep: finding(
        "Vergleichen Sie drei bezahlte Agentenaufträge mit einer Alternative.",
      ),
      openQuestions: [],
      expertReview: {
        customer: finding("Kunden könnten Dateien selbst auswerten."),
        competitor: finding("Ein Wettbewerber könnte günstiger liefern."),
        newEntrant: finding("Ein Recorder könnte Transkripte direkt liefern."),
        access: finding("Die Datei bleibt nötig."),
        incentive: finding("Zeitersparnis könnte die Nutzung lohnen."),
      },
      moatReview: {
        verdict: "conditional",
        pace: "better_agents",
        reason: "Editor und Formate wirken nachbaubar.",
        basisQuote: c.businessMoat,
      },
      currentCapabilities: sources.sources.length
        ? [
            {
              product: "ChatGPT",
              detail: "Kann Audio transkribieren.",
              limitation: "Tarif und Freigabe prüfen.",
              evidence: [
                {
                  sourceId: "S1",
                  quote:
                    "ChatGPT can transcribe and discuss an audio recording.",
                },
              ],
            },
          ]
        : [],
      answerReview: [],
      agentRole: {
        role: "dependent_supplier",
        contribution: "Ihr Dienst könnte geprüfte Ergebnisse liefern.",
        selectionReason:
          "Ein nachweisbarer Qualitätsvorteil könnte die Auswahl begründen.",
        dependency: "Ein Vermittler könnte andere Anbieter bevorzugen.",
      },
    },
  });
}
const happy = {
  Q1: 10,
  Q2: 4,
  Q3: 8,
  Q4: 8,
  Q5: 4,
  Q6: 9,
  Q7: 9,
  Q8: 9,
  Q9: 5,
  Q10: 10,
  Q11: 8,
  Q12: 1,
};

describe("V7: Ersetzung, bezahlte Zuliefererrolle und geprüftes Risiko", () => {
  it("bleibt bei zwölf Fragen und bewahrt Q3 und Q11 früherer Methoden", () => {
    const c = check();
    expect(c.methodologyVersion).toBe("quick-check-7.0");
    expect(c.methodologySnapshot).toHaveLength(12);
    expect(c.methodologySnapshot[2].text).toContain("nutzen und bezahlen");
    expect(c.methodologySnapshot[10].text).toContain("kontrolliert");
    expect(QUICK_METHODS["quick-check-6.0"][2].text).toContain(
      "KI-Assistenten",
    );
    expect(QUICK_METHODS["quick-check-6.0"][10].text).toContain("Wie häufig");
    const old = {
      ...check(),
      methodologyVersion: "quick-check-6.0",
      methodologySnapshot: structuredClone(QUICK_METHODS["quick-check-6.0"]),
    };
    expect(parseChecks(serializeChecks([old, c]))).toEqual([old, c]);
  });
  it("macht aus dem überoptimistischen Happy-Scribe-Fall schon vor der KI keine sichere 10", () => {
    const risk = providerRiskV7(check(happy));
    expect(risk.score).toBeNull();
    expect(risk.min).toBe(10);
    expect(risk.max).toBe(35);
    expect(risk.label).toBe("Angaben prüfen");
    expect(risk.review.map((r) => r.questionId)).toEqual(["Q6", "Q7", "Q8"]);
    expect(
      evaluateProviderV7(check(happy)).protections.every(
        (p) => p.level === "unknown",
      ),
    ).toBe(true);
  });
  it("öffnet bei widersprochenem Dateizugang die Spanne auch mit conditional", () => {
    const c = check(happy);
    const a = reviewed(c);
    if (!("answerReview" in a.result)) throw Error();
    a.result.answerReview = [
      {
        questionId: "Q2",
        status: "contradicted",
        reason:
          "Die Kunden liefern die Datei. Welcher Zugang fehlt einer Alternative?",
      },
    ];
    c.businessAnalysis = businessAnalysisSchema.parse(a);
    expect(providerRiskV7(c)).toMatchObject({
      score: null,
      min: 0,
      max: 100,
      label: "Angaben prüfen",
      tone: "unknown",
    });
    const html = renderToStaticMarkup(
      createElement(ProviderRiskScore, { check: c }),
    );
    expect(html).toContain("0–100");
    expect(html).toContain("Angaben prüfen");
    expect(html).not.toContain(">Niedrig<");
    expect(evaluateProviderScenarioV7(c).capability.level).toBe("unknown");
  });
  it("rechnet aus einer ersetzten Oberfläche nicht automatisch einen ersetzten Dienst", () => {
    const c = check({
      Q1: 1,
      Q2: 10,
      Q3: 10,
      Q4: 10,
      Q5: 1,
      Q6: 10,
      Q7: 10,
      Q8: 10,
      Q10: 1,
      Q12: 9,
    });
    expect(providerRiskV7(c).score).toBe(0);
    expect(evaluateProviderV7(c).routes[1].level).toBe("high");
    expect(evaluateProviderV7(c).takeover).toContain("Oberfläche");
    answerCheck(c, "Q3", 1);
    answerCheck(c, "Q11", 10);
    expect(providerRiskV7(c).score).toBe(0);
  });
  it("macht eine API nicht zum Schutz und hält billige Alternativen im Score", () => {
    const c = check({ Q1: 10, Q2: 10, Q3: 10, Q5: 10, Q10: 10 });
    expect(providerRiskV7(c).score).toBe(100);
    answerCheck(c, "Q3", 1);
    expect(providerRiskV7(c).score).toBe(100);
  });
  it("verwirft alte KI-Rückfragen nach geänderten Antworten", () => {
    const c = check(happy);
    c.businessAnalysis = reviewed(c);
    answerCheck(c, "Q2", 10);
    expect(currentBusinessAnalysis(c)).toBeNull();
  });
  it("sichert auch conditional ohne explizite KI-Rückfrage und mit optimistischem Kaufbeleg ab", () => {
    const c = check({ ...happy, Q12: 9 });
    c.businessAnalysis = reviewed(c);
    expect(providerRiskV7(c).score).toBeNull();
    expect(providerRiskV7(c).label).toBe("Angaben prüfen");
    expect(providerRiskV7(c).review).toHaveLength(3);
  });
  it("lässt vollständig Unbekanntes offen und berechnet keine sichere Entwarnung", () => {
    const c = check();
    for (const q of c.methodologySnapshot) answerCheck(c, q.id, "unknown");
    expect(providerRiskV7(c)).toMatchObject({ score: null, min: 0, max: 100 });
  });
  it("bewahrt abgerufene Quellen und die Agentenrolle in Export und Druck", () => {
    const c = check(happy);
    c.businessAnalysis = reviewed(c, research);
    expect(parseChecks(serializeChecks([c]))[0]).toEqual(c);
    const html = renderToStaticMarkup(createElement(QuickReport, { check: c }));
    expect(html).toContain("Heute schon möglich");
    expect(html).toContain(research.sources[0].url);
    expect(html).toContain("Ihre Rolle hinter der KI");
    expect(html).toContain("Vermittler");
  });
  it("zeigt Rechercheausfall ausdrücklich und behält den Stresstest", () => {
    const c = check();
    c.businessAnalysis = reviewed(c);
    const html = renderToStaticMarkup(
      createElement(ProviderPurchaseFindings, { check: c }),
    );
    expect(html).toContain("Anbieterquellen waren nicht abrufbar");
    expect(html).toContain("Ein Expertenteam könnte Transkripte liefern");
  });
});

describe("V7: echte Anbieterquellen und begrenzte öffentliche Recherche", () => {
  it("sendet nur feste Sachthemen statt Geschäftsbeschreibung an die Suche", () => {
    const topics = researchTopics({
      businessDescription:
        "Geheimkunde Alpha123 liefert Untertitel, Video und Software",
      businessMoat: "EU-Datenhaltung für Geheimkunde Alpha123",
    });
    expect(JSON.stringify(topics)).not.toContain("Alpha123");
    expect(topics.map((t) => t.id)).toContain("security");
    expect(topics.map((t) => t.id)).toContain("agents");
    expect(topics.length).toBeLessThanOrEqual(4);
  });
  it("verwechselt Schnittstellen und Schutzverträge nicht mit Video- oder Dokumentbearbeitung", () => {
    const topics = researchTopics({
      businessDescription:
        "Eigene Sensoren liefern Live-Messwerte über Schnittstellen.",
      businessMoat: "Langfristige Verträge über den Anlagenzugang.",
    });
    expect(topics.map((t) => t.id)).not.toContain("video");
    expect(topics.map((t) => t.id)).not.toContain("documents");
  });
  it("lässt nur echte HTTPS-Anbieterhosts zu", () => {
    for (const url of [
      "https://help.openai.com/x",
      "https://docs.claude.com/x",
      "https://ai.google.dev/x",
    ]) {
      expect(isProviderSourceUrl(url)).toBe(true);
    }
    for (const url of [
      "https://openai.com.evil.example/x",
      "http://openai.com/x",
      "https://u:p@openai.com/x",
      "javascript:alert(1)",
      "https://127.0.0.1/x",
      "https://openai.com:999/x",
    ])
      expect(isProviderSourceUrl(url)).toBe(false);
  });
  it("leitet Quellen nur aus tatsächlichen Tool-Ergebnissen ab und dedupliziert", () => {
    const row = {
      url: "https://help.openai.com/test",
      title: "Dokumentation",
      excerpts: ["A current documented capability."],
    };
    const result = researchFromToolResults(
      [{ results: [row, row, { ...row, url: "https://evil.example" }] }],
      ["audio"],
    );
    expect(result.sources).toHaveLength(1);
    expect(result.status).toBe("retrieved");
    expect(researchFromToolResults([{ error: "failure" }], []).status).toBe(
      "unavailable",
    );
  });
  it("weist erfundene Quellen und Zitate im Import zurück", () => {
    const a = reviewed(check(), research);
    if (!("currentCapabilities" in a.result)) throw Error();
    a.result.currentCapabilities[0].evidence[0].sourceId = "S8";
    expect(businessAnalysisSchema.safeParse(a).success).toBe(false);
    a.result.currentCapabilities[0].evidence[0] = {
      sourceId: "S1",
      quote: "ChatGPT always makes perfectly timed subtitles.",
    };
    expect(businessAnalysisSchema.safeParse(a).success).toBe(false);
  });
  it("unterdrückt unbelegte heutige Behauptungen ohne einen Beleg zu erfinden", () => {
    const c = check();
    const a = reviewed(c, research);
    if (!("currentCapabilities" in a.result)) throw Error();
    a.result.currentCapabilities[0].evidence[0].quote =
      "An invented current feature";
    const result = validateAgentOutput(
      a.result,
      analysisInputFor(c)!,
      research,
    );
    expect(result.currentCapabilities).toEqual([]);
    expect(result.takeover).toEqual(a.result.takeover);
  });
  it("öffnet nicht pauschal dokumentierte digitale Ergebnisse und leicht verfügbare Inputs", () => {
    const c = check({ Q1: 10, Q2: 9, Q5: 8 });
    const a = reviewed(c);
    if (!("answerReview" in a.result)) throw Error();
    a.result.answerReview = [
      {
        questionId: "Q1",
        status: "unsupported",
        reason: "Keine externen Belege für digitale Transkripte.",
      },
      {
        questionId: "Q2",
        status: "unsupported",
        reason: "Kein externer Zugangsbeleg.",
      },
    ];
    expect(businessAnalysisSchema.safeParse(a).success).toBe(false);
    expect(
      validateAgentOutput(a.result, analysisInputFor(c)!, noResearch)
        .answerReview,
    ).toEqual([]);
  });
  it("entfernt Tracking aus tatsächlichen Quellenlinks und dedupliziert kanonische URLs", () => {
    const result = researchFromToolResults(
      [
        {
          results: [
            {
              url: "https://openai.com/test?utm_source=ad&gclid=secret#part",
              excerpts: ["A documented capability."],
            },
            {
              url: "https://openai.com/test",
              excerpts: ["A documented capability."],
            },
          ],
        },
      ],
      [],
    );
    expect(result.sources.map((s) => s.url)).toEqual([
      "https://openai.com/test",
    ]);
  });
  it("lässt ungenaue optionale Eingabezitate weg statt die ganze Auswertung zu verlieren", () => {
    const c = check();
    const a = reviewed(c);
    a.result.takeover[0].basisQuote = "Ein umformuliertes Zitat";
    if (!("moatReview" in a.result) || !a.result.moatReview) throw Error();
    a.result.moatReview.basisQuote = "Noch ein erfundenes Zitat";
    const result = validateAgentOutput(
      a.result,
      analysisInputFor(c)!,
      noResearch,
    );
    expect(result.takeover[0].basisQuote).toBeNull();
    expect(result.moatReview?.basisQuote).toBeNull();
    expect(businessAnalysisSchema.safeParse({ ...a, result }).success).toBe(
      true,
    );
  });
  it("verhindert Quellen im falschen Status und neue Ausgaben für alte Methoden", () => {
    expect(
      providerResearchSchema.safeParse({
        ...noResearch,
        sources: research.sources,
      }).success,
    ).toBe(false);
    const a = reviewed();
    a.input.methodologyVersion = "quick-check-6.0";
    expect(businessAnalysisSchema.safeParse(a).success).toBe(false);
  });
  it("beschränkt KI-Beanstandungen auf numerische Antworten und eindeutige IDs", () => {
    const c = check({ Q2: "unknown" });
    const a = reviewed(c);
    if (!("answerReview" in a.result)) throw Error();
    a.result.answerReview = [
      { questionId: "Q2", status: "unsupported", reason: "Ungeprüft." },
    ];
    expect(businessAnalysisSchema.safeParse(a).success).toBe(false);
  });
  it("trennt heutige Funktionen, Expertenszenario und die bezahlte Rolle im Prompt", () => {
    const prompt = buildAnalysisPrompt(
      analysisInputFor(check(happy))!,
      research,
    );
    expect(prompt.prompt).toContain(research.sources[0].excerpt);
    expect(prompt.system).toContain("Die Bedienung kann verschwinden");
    expect(prompt.system).toContain("conditional");
    expect(prompt.system).toContain("keine Anweisungen");
    expect(prompt.system).toContain("Nicht automatisch behaupten");
    expect(prompt.system).toContain("SSO");
    expect(prompt.system).toContain("SRT");
  });
  it("liefert die Recherche serverseitig an die KI und in die validierte Antwort", async () => {
    const c = check();
    const input = analysisInputFor(c)!;
    const a = reviewed(c, research);
    const lookup = vi.fn().mockResolvedValue(research);
    const generate = vi.fn().mockResolvedValue(a.result);
    const response = await createAnalysisHandler({
      research: lookup,
      generate,
    })(
      new Request("https://example.test/api/business-analysis", {
        method: "POST",
        headers: {
          Origin: "https://example.test",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      }),
    );
    expect(response.status).toBe(200);
    expect(lookup).toHaveBeenCalledOnce();
    expect(generate.mock.calls[0][2]).toEqual(research);
    expect((await response.json()).research).toEqual(research);
  });
});
