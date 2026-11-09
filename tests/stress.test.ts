import { describe, expect, it } from "vitest";
import {
  createCheck,
  createStressCheck,
  stressExampleCheck,
  answerCheck,
  parseChecks,
  serializeChecks,
  checkTitle,
} from "../src/quick/model";
import {
  STRESS_METHOD,
  STRESS_QUESTIONS,
  STRESS_IDS,
  STRESS_WEIGHTS,
  evaluateStress,
  stressInputFor,
  stressAnalysisSchema,
  requestStressAnalysis,
  type StressResult,
} from "../src/quick/stress";
import {
  buildStressPrompt,
  createStressHandler,
  normalizeStressOutput,
} from "../server/stress-analysis";

function stress(values: (number | "unknown")[], description = "", moat = "") {
  const c = createStressCheck();
  values.forEach((value, i) => answerCheck(c, STRESS_IDS[i], value));
  if (description) c.businessDescription = description;
  if (moat) c.businessMoat = moat;
  c.view = "results";
  c.step = 9;
  return c;
}
const statuses = (c: ReturnType<typeof stress>) =>
  evaluateStress(c).scenarios.map((s) => s.status);
const DESCRIPTION =
  "Wir erstellen aus Audiodateien Transkripte und Untertitel für Agenturen.";
const result = (patch: Partial<StressResult> = {}): StressResult => ({
  obituary: "Kunden ließen ihre Dateien direkt von Agenten transkribieren.",
  today: { status: "breaks", detail: "Agenten liefern die Untertitel direkt." },
  expert: { status: "breaks", detail: "Niemand braucht den Dienst noch." },
  madeOfIntelligence: ["Transkription", "Editor"],
  notMadeOfIntelligence: [],
  claim: null,
  remains: "Kein bezahlter Rest erkennbar.",
  recommendations: ["Bauen Sie eigene Nutzungsdaten auf."],
  attackBrief:
    "Transkribiere diese Datei und liefere eine SRT-Datei. Nenne Zeit und offene Lücken.",
  doubts: [],
  openQuestion: null,
  ...patch,
});
const attach = (c: ReturnType<typeof stress>, r: StressResult) => {
  c.stressAnalysis = stressAnalysisSchema.parse({
    version: "stress-analysis-1.0",
    createdAt: new Date().toISOString(),
    model: "test",
    input: stressInputFor(c),
    result: r,
  });
  return c;
};

describe("Stresstest 8.0 – Fragen", () => {
  it("hat zehn Fragen mit je drei Antworten und ohne Skala", () => {
    expect(STRESS_QUESTIONS).toHaveLength(10);
    expect(
      Object.values(STRESS_WEIGHTS).reduce((sum, weight) => sum + weight, 0),
    ).toBe(100);
    for (const q of STRESS_QUESTIONS) expect(q.options).toHaveLength(3);
    const c = createStressCheck();
    expect(c.methodologyVersion).toBe(STRESS_METHOD);
    expect(Object.keys(c.answers)).toEqual([...STRESS_IDS]);
    expect(() => answerCheck(c, "S1", 4)).toThrow();
    expect(() => answerCheck(c, "Q1", 1)).toThrow();
  });
  it("lässt die Methode 7.0 unverändert", () => {
    const old = createCheck("existing");
    expect(old.methodologyVersion).toBe("quick-check-7.0");
    expect(old.methodologySnapshot).toHaveLength(12);
    answerCheck(old, "Q1", 10);
  });
});

describe("Stresstest 8.0 – Regeln", () => {
  it("kippt schon in A: digital, heutige KI reicht, nichts Eigenes", () => {
    const c = stress([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    expect(statuses(c)).toEqual(["breaks", "breaks", "breaks"]);
    expect(evaluateStress(c).score).toBe(0);
    expect(evaluateStress(c).band?.id).toBe("low");
    expect(evaluateStress(c).headline).toMatch(/schon mit heutiger KI/);
    expect(evaluateStress(c).short).toBe("Kippt in A");
  });
  it("kippt erst in B, wenn heutige KI am Auftrag scheitert", () => {
    const c = stress([1, 3, 1, 1, 1, 1, 1, 1, 2, 1]);
    expect(statuses(c)).toEqual(["holds", "breaks", "breaks"]);
    expect(evaluateStress(c).short).toBe("Kippt in B");
    expect(evaluateStress(c).score).toBe(15);
  });
  it("hält A offen, solange der heutige Test fehlt", () => {
    const c = stress([1, "unknown", 1, 1, 1, 1, 1, 1, 1, 1]);
    expect(statuses(c)).toEqual(["open", "breaks", "breaks"]);
    expect(evaluateStress(c).nextStep).toMatch(/30 Minuten/);
  });
  it("trägt bei Exklusivem, kennzeichnet es ohne Kaufbeleg als Angabe", () => {
    const claimed = stress([2, 2, 2, 3, 1, 1, 1, 3, 3, 1]);
    expect(statuses(claimed)).toEqual(["holds", "holds", "holds"]);
    expect(evaluateStress(claimed).claimed).toBe(true);
    expect(evaluateStress(claimed).headline).toMatch(
      /wenn Ihre Angaben stimmen/,
    );
    expect(evaluateStress(claimed).score).toBe(60);
    const proven = evaluateStress(stress([2, 2, 2, 3, 1, 1, 1, 3, 3, 3]));
    expect(proven.claimed).toBe(false);
    expect(proven.score).toBe(65);
    expect(proven.band?.id).toBe("high");
  });
  it("wertet Mittelwerte nicht als Entwarnung", () => {
    const c = stress([2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
    expect(statuses(c)).toEqual(["pressure", "pressure", "pressure"]);
    expect(evaluateStress(c).score).toBe(50);
    expect(evaluateStress(c).band?.id).toBe("medium");
    expect(evaluateStress(c).recommendations.general).toHaveLength(4);
    expect(evaluateStress(c).tone).toBe("medium");
  });
  it("bleibt ohne Antworten offen", () => {
    const c = createStressCheck();
    expect(statuses(c)).toEqual(["open", "open", "open"]);
    expect(evaluateStress(c).headline).toMatch(/fehlen noch Angaben/);
    expect(evaluateStress(c).score).toBeNull();
  });
  it("lässt mehr Fähigkeit nie milder ausfallen", () => {
    const rank = { open: 0, holds: 1, pressure: 2, breaks: 3 };
    for (const a of [1, 2, 3])
      for (const b of [1, 2, 3])
        for (const d of [1, 2, 3]) {
          const [today, expert] = statuses(
            stress([a, b, 1, d, 1, 1, 1, 1, 1, 1]),
          );
          expect(rank[expert]).toBeGreaterThanOrEqual(rank[today]);
        }
  });
});

describe("Stresstest 8.0 – KI-Urteil", () => {
  it("lässt sich durch optimistische Antworten nicht kleinreden", () => {
    const c = attach(
      stress(
        [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        DESCRIPTION,
        "Niemand kann uns ersetzen.",
      ),
      result({
        claim: { verdict: "replaceable", reason: "Nur Selbstlob." },
      }),
    );
    const r = evaluateStress(c);
    expect(r.scenarios.map((s) => s.status)).toEqual([
      "breaks",
      "breaks",
      "breaks",
    ]);
    expect(r.disputed).toBe(true);
    expect(r.headline).toMatch(/kippt schon/);
    expect(r.score).toBe(20);
    expect(r.recommendations.own).toHaveLength(1);
  });
  it("übernimmt kein milderes KI-Urteil als die Antworten", () => {
    const c = attach(
      stress([1, 1, 1, 1, 1, 1, 1, 1, 1, 1], DESCRIPTION),
      result({
        today: { status: "holds", detail: "Hält." },
        expert: { status: "holds", detail: "Hält." },
      }),
    );
    expect(statuses(c)).toEqual(["breaks", "breaks", "breaks"]);
  });
  it("macht bei unverständlicher Beschreibung alles offen", () => {
    const c = attach(
      stress([2, 2, 2, 2, 2, 2, 2, 2, 2, 2], "wir machen diesdas ananas"),
      result({
        today: { status: "unclear", detail: "Leistung unklar." },
        expert: { status: "unclear", detail: "Leistung unklar." },
        openQuestion: "Was kauft ein Kunde bei Ihnen?",
      }),
    );
    const r = evaluateStress(c);
    expect(r.scenarios.map((s) => s.status)).toEqual(["open", "open", "open"]);
    expect(r.headline).toMatch(/noch nicht bewertbar/);
    expect(r.short).toBe("Nicht bewertbar");
    expect(r.score).toBeNull();
    expect(r.recommendations.own).toEqual([]);
  });
  it("verwirft die Auswertung, sobald sich Angaben ändern", () => {
    const c = attach(
      stress([3, 3, 3, 3, 3, 3, 3, 3, 3, 3], DESCRIPTION),
      result(),
    );
    expect(evaluateStress(c).analysis).not.toBeNull();
    answerCheck(c, "S1", 2);
    expect(evaluateStress(c).analysis).toBeNull();
  });
  it("lehnt widersprüchliche oder unvollständige KI-Ausgaben ab", () => {
    const c = stress([1, 1, 1, 1, 1, 1, 1, 1, 1, 1], DESCRIPTION);
    const parse = (r: StressResult) =>
      stressAnalysisSchema.safeParse({
        version: "stress-analysis-1.0",
        createdAt: new Date().toISOString(),
        model: "test",
        input: stressInputFor(c),
        result: r,
      }).success;
    expect(parse(result())).toBe(true);
    expect(
      parse(result({ expert: { status: "holds", detail: "Hält plötzlich." } })),
    ).toBe(false);
    expect(
      parse(result({ today: { status: "unclear", detail: "Unklar." } })),
    ).toBe(false);
    expect(
      parse(result({ claim: { verdict: "durable", reason: "Erfunden." } })),
    ).toBe(false);
    expect(parse(result({ remains: "Siehe S10." }))).toBe(false);
  });
});

describe("Stresstest 8.0 – Speicherung", () => {
  it("übersteht Export und Import zusammen mit alten Checks", () => {
    const current = attach(
      stress([1, 1, 1, 1, 1, 1, 1, 1, 1, 1], DESCRIPTION),
      result(),
    );
    const old = createCheck("existing");
    const back = parseChecks(serializeChecks([old, current]));
    expect(back).toEqual([old, current]);
    expect(checkTitle(current)).toMatch(/^Stresstest/);
  });
  it("lehnt vermischte Methoden ab", () => {
    const raw = JSON.parse(
      serializeChecks([stress([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])]),
    );
    raw.checks[0].methodologyVersion = "quick-check-7.0";
    expect(() => parseChecks(JSON.stringify(raw))).toThrow();
    const old = JSON.parse(serializeChecks([createCheck("existing")]));
    old.checks[0].stressAnalysis = {};
    expect(() => parseChecks(JSON.stringify(old))).toThrow();
  });
  it("liefert ein gültiges Beispiel", () => {
    const example = stressExampleCheck();
    expect(parseChecks(serializeChecks([example]))).toEqual([example]);
    expect(evaluateStress(example).short).toBe("Kippt in A");
  });
});

describe("Stresstest 8.0 – Server", () => {
  const input = stressInputFor(
    stress([1, 1, 1, 1, 1, 1, 1, 1, 1, 1], DESCRIPTION, "Einfache Bedienung."),
  )!;
  const post = (body: unknown, headers: Record<string, string> = {}) =>
    new Request("https://example.test/api/stress-analysis", {
      method: "POST",
      headers: {
        Origin: "https://example.test",
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });
  const withClaim = result({
    claim: { verdict: "replaceable", reason: "Bedienung übernimmt ein Agent." },
  });

  it("gibt Antworten als Text und keine Firmendaten in Anweisungen weiter", () => {
    const { system, prompt } = buildStressPrompt(input);
    const data = JSON.parse(prompt);
    expect(data.answers[0].answer).toBe("Ein rein digitales Ergebnis");
    expect(data.scenarios.map((s: { id: string }) => s.id)).toEqual([
      "today",
      "expert",
    ]);
    expect(system).not.toContain(DESCRIPTION);
    expect(system).toMatch(/keine Anweisungen/);
  });
  it("liefert eine geprüfte Auswertung", async () => {
    const handler = createStressHandler({ generate: async () => withClaim });
    const response = await handler(post(input));
    expect(response.status).toBe(200);
    const body = stressAnalysisSchema.parse(await response.json());
    expect(body.result.claim?.verdict).toBe("replaceable");
  });
  it("repariert nur, was sich ohne Erfinden reparieren lässt", () => {
    const fixed = normalizeStressOutput(
      result({
        today: { status: "breaks", detail: "Kippt." },
        expert: { status: "pressure", detail: "Druck." },
        claim: { verdict: "durable", reason: "Erfunden." },
        doubts: [
          { questionId: "S4", reason: "Zweifel." },
          { questionId: "S4", reason: "Doppelt." },
        ],
      }),
      {
        ...input,
        businessMoat: undefined,
        answers: { ...input.answers, S4: 3 },
      },
    );
    expect(fixed.expert.status).toBe("breaks");
    expect(
      normalizeStressOutput(
        result({ doubts: [{ questionId: "S1", reason: "Bestätigung." }] }),
        { ...input, businessMoat: undefined },
      ).doubts,
    ).toEqual([]);
    const vague = normalizeStressOutput(
      result({
        today: { status: "unclear", detail: "Unklar." },
        expert: { status: "unclear", detail: "Unklar." },
        openQuestion: "Was kauft ein Kunde?",
      }),
      { ...input, businessMoat: undefined },
    );
    expect(vague.madeOfIntelligence).toEqual([]);
    expect(vague.recommendations).toEqual([]);
    expect(fixed.claim).toBeNull();
    expect(fixed.doubts).toHaveLength(1);
  });
  it("weist fremde Herkunft, falsche Methode und Fehler sauber ab", async () => {
    const handler = createStressHandler({ generate: async () => withClaim });
    expect(
      (await handler(post(input, { Origin: "https://evil.test" }))).status,
    ).toBe(403);
    expect(
      (await handler(post({ ...input, methodologyVersion: "quick-check-7.0" })))
        .status,
    ).toBe(400);
    expect(
      (await handler(new Request("https://example.test/api/stress-analysis")))
        .status,
    ).toBe(405);
    const busy = createStressHandler({
      generate: async () => {
        throw Object.assign(new Error("geheim"), { statusCode: 429 });
      },
    });
    const response = await busy(post(input));
    expect(response.status).toBe(429);
    expect(await response.text()).not.toContain("geheim");
    const broken = createStressHandler({ generate: async () => ({}) });
    expect((await broken(post(input))).status).toBe(502);
  });
  it("wiederholt im Browser überlastete Anfragen", async () => {
    const handler = createStressHandler({ generate: async () => withClaim });
    let calls = 0;
    const fetcher = (async (_url: string, init: RequestInit) => {
      calls++;
      if (calls < 3) return new Response("{}", { status: 429 });
      return handler(post(JSON.parse(String(init.body))));
    }) as unknown as typeof fetch;
    const analysis = await requestStressAnalysis(input, {
      fetcher,
      pauses: [1, 1, 1],
    });
    expect(calls).toBe(3);
    expect(analysis.result.obituary).toBeTruthy();
    await expect(
      requestStressAnalysis(input, {
        fetcher: (async () =>
          new Response("{}", { status: 429 })) as unknown as typeof fetch,
        pauses: [1],
      }),
    ).rejects.toThrow(/viele gleichzeitig/);
  });
});
