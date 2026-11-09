import type { QuickCheck } from "./model.js";
import type {
  RouteLevel,
  ProtectionLevel,
} from "./methods/provider-analysis-3.js";
import { DEFAULT_PROVIDER_SCENARIO } from "./provider-scenario.js";
import { isProviderV6 } from "./provider-questions.js";

// Versioned judgment rules, not an estimated probability of business failure.
// Q9 informs the scenario; Q11 is recurring demand; Q12 is evidence.
// Demand is one incentive clue, not a probability of market entry.
const riskIds = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q10"];
const protectionIds = ["Q6", "Q7", "Q8"];
const normalized = (value: number) => (value - 1) / 9;
const rounded = (value: number) => Math.round((value * 100) / 5) * 5;
const routeLevel = (value: number): RouteLevel =>
  value >= 0.65 ? "high" : value >= 0.35 ? "partial" : "barrier";
const numeric = (check: QuickCheck, id: string) =>
  typeof check.answers[id] === "number" ? (check.answers[id] as number) : null;

function assess(values: Record<string, number>) {
  const v = (id: string) => normalized(values[id]);
  // Distribution helps a platform, but lack of current access is no permanent barrier.
  const reach = 0.7 + 0.3 * v("Q3");
  const routes = [
    Math.min(v("Q1"), v("Q2"), v("Q10")) * reach,
    Math.min(v("Q4"), v("Q2")),
    Math.min(v("Q5"), v("Q2")) * reach,
  ];
  // One weak link prevents protection: necessary AND scarce AND worth paying for.
  const protection = Math.min(...protectionIds.map(v));
  const retained = 1 - 0.75 * protection;
  return {
    routes,
    protection,
    effective: routes.map((value) => value * retained),
  };
}

function bounds(check: QuickCheck) {
  const lower: Record<string, number> = {},
    upper: Record<string, number> = {};
  for (const id of riskIds) {
    const value = numeric(check, id);
    lower[id] = value ?? (protectionIds.includes(id) ? 10 : 1);
    upper[id] = value ?? (protectionIds.includes(id) ? 1 : 10);
  }
  return { lower: assess(lower), upper: assess(upper) };
}

function contradictionsFor(check: QuickCheck) {
  const conflicts: string[] = [];
  if (numeric(check, "Q2")! >= 7 && numeric(check, "Q6")! >= 7)
    conflicts.push(
      "Welche unverzichtbare Leistung bleibt bei Ihnen, wenn die nötigen Mittel auch ohne Sie erhältlich sind?",
    );
  if (numeric(check, "Q5")! >= 7 && numeric(check, "Q7")! >= 7)
    conflicts.push(
      "Was ist schwer ersetzbar, wenn ein Agent andere Anbieter leicht beauftragen kann?",
    );
  return conflicts;
}

export function providerRiskV6(check: QuickCheck) {
  if (!isProviderV6(check.methodologyVersion))
    throw new Error("Diese Auswertung gehört zu quick-check-6.0.");
  const { lower, upper } = bounds(check);
  const min = rounded(Math.max(...lower.effective));
  const conflicts = contradictionsFor(check);
  // Conflicting substitution/protection claims cannot earn a confident low score.
  const max = rounded(
    Math.max(...(conflicts.length ? upper.routes : upper.effective)),
  );
  const score = min === max ? min : null;
  const proof = numeric(check, "Q12");
  const missing = riskIds.filter((id) => numeric(check, id) === null);
  return {
    score,
    min,
    max,
    missing,
    conflicts,
    label:
      score === null
        ? min >= 85
          ? "Sehr hoch"
          : min >= 65
            ? max >= 85
              ? "Hoch bis sehr hoch"
              : "Hoch"
            : "Noch offen"
        : score >= 85
          ? "Sehr hoch"
          : score >= 65
            ? "Hoch"
            : score >= 35
              ? "Mittel"
              : "Niedrig",
    tone:
      score === null
        ? min >= 65
          ? "high"
          : "unknown"
        : score >= 65
          ? "high"
          : score >= 35
            ? "medium"
            : "low",
    basis:
      proof !== null && proof >= 7
        ? "Praxistest laut Angaben"
        : proof !== null && proof >= 4
          ? "Erste Belege"
          : "Annahmen",
  };
}
export type ProviderRisk = ReturnType<typeof providerRiskV6>;

const routeDefinitions = [
  {
    id: "feature",
    title: "Zur KI-Funktion werden",
    questionIds: ["Q1", "Q2", "Q3", "Q10"],
    description:
      "KI auf Expertenniveau könnte das Kundenproblem digital lösen – auch auf einem anderen Weg.",
  },
  {
    id: "interface",
    title: "Die Bedienung übernehmen",
    questionIds: ["Q2", "Q4"],
    description:
      "Ein Agent könnte die Bedienung übernehmen; benötigte Technik kann dahinter weiterlaufen.",
  },
  {
    id: "supplier",
    title: "Andere Anbieter auswählen",
    questionIds: ["Q2", "Q3", "Q5"],
    description:
      "Ein Agent könnte den Auftrag an einen austauschbaren Anbieter vergeben.",
  },
];
const protectionDefinitions = [
  {
    id: "necessary",
    questionId: "Q6",
    title: "Weiterhin nötig",
    shortTitle: "Ihr nötiger Beitrag",
    detail: "Ein Beitrag bleibt auch nach der Arbeit des Agenten nötig.",
    test: "Den Auftrag ohne Ihren Beitrag durchspielen.",
  },
  {
    id: "scarce",
    questionId: "Q7",
    title: "Schwer ersetzbar",
    shortTitle: "ein schwer ersetzbarer Beitrag",
    detail:
      "Der nötige Beitrag lässt sich schwer nachbauen oder anderswo beschaffen.",
    test: "Die beste andere Quelle oder den besten anderen Anbieter prüfen.",
  },
  {
    id: "paid",
    questionId: "Q8",
    title: "Den Aufpreis wert",
    shortTitle: "ein bezahlter Unterschied",
    detail: "Der verbleibende Unterschied begründet einen zusätzlichen Preis.",
    test: "Den Preis nach einem direkten KI-Vergleich beim Kunden testen.",
  },
];

export function evaluateProviderV6(check: QuickCheck) {
  const risk = providerRiskV6(check);
  const { lower, upper } = bounds(check);
  const routes = routeDefinitions.map((route, i) => ({
    ...route,
    level: (lower.routes[i] === upper.routes[i]
      ? routeLevel(lower.routes[i])
      : "unknown") as RouteLevel,
    description:
      lower.routes[i] !== upper.routes[i]
        ? "Für diesen Übernahmeweg fehlen noch entscheidende Angaben."
        : lower.routes[i] < 0.35
          ? "Ihre Angaben zeigen hier bislang wenig Angriffspotenzial."
          : route.description,
  }));
  const protections = protectionDefinitions.map((p) => {
    const value = numeric(check, p.questionId);
    const level: ProtectionLevel =
      value === null
        ? "unknown"
        : value >= 7
          ? "strong"
          : value >= 4
            ? "limited"
            : "weak";
    return { ...p, value, level };
  });
  const demand = numeric(check, "Q11");
  const incentive =
    demand === null
      ? "Der wirtschaftliche Anreiz ist offen: Bedarf, Einsparung und Aufwand prüfen."
      : demand >= 7
        ? "Wiederkehrender Bedarf kann eine skalierbare Lösung attraktiv machen. Erreichbare Kunden und Kosten sind noch zu prüfen."
        : demand >= 4
          ? "Regelmäßiger Bedarf ist erkennbar. Ob sich eine Übernahme lohnt, hängt von Kundenzahl, Nutzen und Aufwand ab."
          : "Seltene Nutzung schließt eine Übernahme nicht aus: Eine wertvolle Nische oder gebündelte Funktion kann sich trotzdem lohnen.";
  const access = numeric(check, "Q2");
  const accessText =
    access === null
      ? "Welche Daten, Rechte und Zugänge verfügbar sind, ist noch offen."
      : access >= 7
        ? "Die nötigen Daten und Zugänge scheinen beschaffbar. Freigaben und verlässlichen Betrieb konkret prüfen."
        : access >= 4
          ? "Ein Teil der Daten und Zugänge ist erreichbar; entscheidende Lücken bleiben zu prüfen."
          : "Fehlende Daten oder Zugänge begrenzen die Übernahme. Mehr Fachwissen allein schafft sie nicht.";
  const proof = numeric(check, "Q12");
  const evidence =
    proof === null
      ? ("unknown" as const)
      : proof >= 7
        ? ("supported" as const)
        : proof >= 4
          ? ("partial" as const)
          : ("untested" as const);
  const evidenceText = {
    supported:
      "Laut Ihren Angaben zahlen Kunden nach einem Vergleich mit Alternativen weiter. Der Vergleich wurde hier nicht unabhängig geprüft.",
    partial:
      "Erste Käufe nach einem Vergleich mit Alternativen laut Ihren Angaben.",
    untested:
      "Der Kaufgrund ist eine Annahme; ein bezahlter Vergleich steht noch aus.",
    unknown:
      "Kaufbelege sind noch offen. Das erhöht die Unsicherheit, nicht den Risiko-Score.",
  }[evidence];
  const decidingRoutes =
    risk.score === null && risk.min >= 65 ? lower.routes : upper.routes;
  const strongestIndex = decidingRoutes.indexOf(Math.max(...decidingRoutes));
  const strongest = routes[strongestIndex];
  const protectedContribution =
    lower.protection >= 2 / 3 && !risk.conflicts.length;
  const score = risk.score ?? (risk.min >= 65 ? risk.min : null);
  const headline =
    score === null
      ? "Für das Expertenszenario fehlen noch Angaben."
      : protectedContribution && strongest.id === "interface"
        ? "Ihre Technik kann hinter dem Agenten bleiben."
        : score >= 65 && strongest.id === "feature"
          ? "Ihr Angebot droht zur KI-Funktion zu werden."
          : score >= 65 && strongest.id === "supplier"
            ? "Ein Agent könnte Ihren Kundenzugang übernehmen."
            : score >= 65
              ? "Die Bedienung verliert ihren Kaufgrund."
              : score >= 35
                ? "Ein Teil Ihres Kaufgrunds gerät unter Druck."
                : "Im Expertenszenario bleiben Hürden.";
  const payment = risk.conflicts.length
    ? "Ihre Angaben zum nötigen Beitrag und seiner Ersetzbarkeit widersprechen sich noch."
    : protectedContribution
      ? evidence === "supported"
        ? "Laut Ihren Angaben zahlen Kunden für Ihren nötigen Beitrag trotz Alternativen weiter."
        : "Kunden könnten für Ihren nötigen Beitrag weiter zahlen; der Kaufgrund ist noch zu testen."
      : protectionIds.some((id) => numeric(check, id) === null)
        ? "Welcher nötige, schwer ersetzbare Beitrag Ihren Aufpreis rechtfertigt, ist noch offen."
        : numeric(check, "Q6")! <= 3 || numeric(check, "Q8")! <= 3
          ? "Kein klarer Kaufgrund zusätzlich zum KI-Angebot erkennbar."
          : numeric(check, "Q7")! <= 3
            ? "Ihr Beitrag kann nötig bleiben, ist aber leicht anderswo erhältlich."
            : "Ein zusätzlicher Kaufgrund ist möglich, aber noch nicht stark genug begründet.";
  const takeover =
    strongest.level === "unknown"
      ? "Welche Leistung KI übernehmen kann, ist noch offen."
      : Math.max(...upper.routes) < 0.35
        ? "Ihre Angaben zeigen bislang wenig direkt übernehmbare Leistung."
        : routeDefinitions[strongestIndex].description;
  const nextStep = risk.conflicts.length
    ? risk.conflicts[0]
    : risk.missing.length
      ? "Die offenen Angaben zum Ergebnis und Kaufgrund klären."
      : protectedContribution
        ? "Fünf Aufträge vergleichen: Wofür zahlt ein Kunde trotz KI extra?"
        : "Einen typischen Kundenauftrag von einem Experten anders lösen lassen. Danach Datenzugang, Aufwand und Kaufgrund vergleichen.";
  const unknown = check.methodologySnapshot.filter(
    (q) => numeric(check, q.id) === null,
  );
  return {
    risk,
    routes,
    protections,
    access: accessText,
    incentive,
    evidence,
    evidenceText,
    headline,
    summary: payment,
    payment,
    takeover,
    nextStep,
    contradictions: risk.conflicts,
    actions: [
      {
        id: "purchase-test",
        title: "Den Kaufgrund testen",
        detail: nextStep,
        questionIds: ["Q8", "Q12"],
      },
    ],
    unknown,
    answered: 12 - unknown.length,
  };
}

export function evaluateProviderScenarioV6(check: QuickCheck) {
  const settings = check.providerScenario ?? DEFAULT_PROVIDER_SCENARIO;
  const r = evaluateProviderV6(check);
  const today = numeric(check, "Q9");
  const { lower, upper } = bounds(check);
  const progress = { slow: 0.2, medium: 0.5, fast: 0.8 }[
    settings.capabilityPace
  ];
  const pressure = { slow: 0.55, medium: 0.75, fast: 1 }[settings.pricePace];
  // These fixed scenario weights are disclosed assumptions, not forecast growth rates.
  const readiness =
    today === null
      ? null
      : normalized(today) + (1 - normalized(today)) * progress;
  const index = upper.effective.indexOf(Math.max(...upper.effective));
  const routeId = routeDefinitions[index].id;
  const known = r.risk.score !== null && readiness !== null;
  const capabilityLevel: RouteLevel = known
    ? routeLevel(Math.max(...lower.effective) * readiness!)
    : "unknown";
  const priceLevel: RouteLevel = known
    ? routeLevel(Math.max(...lower.effective) * readiness! * pressure)
    : "unknown";
  return {
    settings,
    capability: {
      routeId,
      level: capabilityLevel,
      text: {
        high: "Hoher Übernahmedruck in diesem Szenario.",
        partial:
          "Ein Teil Ihres Kaufgrunds gerät in diesem Szenario unter Druck.",
        barrier: "In diesem Szenario bleibt der Übernahmedruck begrenzt.",
        unknown:
          today === null
            ? "Für den Zwei-Jahres-Blick fehlt der heutige KI-Vergleich."
            : "Für den Zwei-Jahres-Blick fehlen entscheidende Angaben.",
      }[capabilityLevel],
    },
    price: {
      routeId,
      level: priceLevel,
      text: {
        high: "Mitgelieferte oder günstigere Alternativen setzen Ihren Preis stark unter Druck.",
        partial: "Zusätzlicher Preisdruck durch günstigere Alternativen.",
        barrier:
          "Günstigere KI allein beseitigt den verbleibenden Kaufgrund noch nicht.",
        unknown: "Der Preisdruck bleibt ohne vollständige Ausgangslage offen.",
      }[priceLevel],
    },
  };
}
