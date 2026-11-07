import type { QuickCheck } from "./model";
import { isProviderMethod } from "./provider-questions";
import { DEFAULT_PROVIDER_SCENARIO } from "./provider-scenario";

export type RouteLevel = "high" | "partial" | "barrier" | "unknown";
export const ROUTE_LABELS: Record<RouteLevel, string> = {
  high: "Naheliegend",
  partial: "Teilweise",
  barrier: "Mit Hürden",
  unknown: "Offen",
};
export type ProtectionLevel = "strong" | "limited" | "weak" | "unknown";
export const PROTECTION_LABELS: Record<ProtectionLevel, string> = {
  strong: "Möglicher Schutz",
  limited: "Begrenzt",
  weak: "Kaum Schutz",
  unknown: "Offen",
};

const routes = [
  {
    id: "replace",
    title: "Ihre Arbeit erledigen",
    questionIds: ["Q1", "Q2", "Q3"],
    descriptions: {
      high: "KI könnte Ihre digitale Arbeit mit den Daten und Programmen des Kunden erledigen.",
      partial:
        "Einzelne Schritte sind übernehmbar. Daten oder Ausführung fehlen noch teilweise.",
      barrier:
        "Für eine vollständige Übernahme fehlen digitale Abläufe, Daten oder Zugänge.",
      unknown: "Angaben zu Leistung, Daten oder Programmen fehlen.",
    },
  },
  {
    id: "bundle",
    title: "Ihre Leistung mitliefern",
    questionIds: ["Q1", "Q2", "Q4"],
    descriptions: {
      high: "Ihre Leistung könnte zur mitgelieferten Funktion einer vorhandenen Plattform werden.",
      partial:
        "Ein Teil könnte mitgeliefert werden. Der Plattform fehlt noch vollständiger Zugang.",
      barrier:
        "Plattformzugang, Kundendaten und digitale Leistung kommen noch nicht zusammen.",
      unknown: "Angaben zu Leistung, Kundendaten oder Plattformnutzung fehlen.",
    },
  },
  {
    id: "background",
    title: "Ihre Oberfläche umgehen",
    questionIds: ["Q4", "Q5", "Q6"],
    descriptions: {
      high: "KI könnte Ihre Oberfläche ersetzen und Ihr System nur noch im Hintergrund nutzen.",
      partial:
        "KI könnte Teile der Bedienung übernehmen. Ihr Dienst bleibt teilweise nötig.",
      barrier:
        "Für die Nutzung als Hintergrunddienst fehlen Datenzugang oder passende Abläufe.",
      unknown:
        "Angaben zu Plattform, Informationsaufbereitung oder Datenaustausch fehlen.",
    },
  },
];
const protections = [
  {
    id: "data",
    questionId: "Q7",
    title: "Exklusive Daten",
    shortTitle: "eigene Daten",
    detail: "Sie liefern Daten, die der Kunde nicht selbst hat.",
    test: "Dieselbe Aufgabe mit und ohne Ihre Daten vergleichen.",
  },
  {
    id: "physical",
    questionId: "Q8",
    title: "Menschen und Geräte",
    shortTitle: "die tatsächliche Ausführung",
    detail:
      "Diese Arbeit braucht Menschen oder Geräte. Ein digitaler Agent allein reicht nicht.",
    test: "Kann ein anderer Dienstleister die Ausführung übernehmen?",
  },
  {
    id: "access",
    questionId: "Q9",
    title: "Rechte und Zugänge",
    shortTitle: "besondere Rechte und Zugänge",
    detail: "Andere Anbieter müssten nötige Rechte oder Zugänge erst erwerben.",
    test: "Aufwand und Zeit für die Beschaffung dieser Zugänge prüfen.",
  },
  {
    id: "operations",
    questionId: "Q10",
    title: "Feste Kundenabläufe",
    shortTitle: "Ihre Einbindung in Kundenabläufe",
    detail: "Ein Systemwechsel würde zentrale Kundenabläufe verändern.",
    test: "Den Wechsel mit einem Kunden durchspielen.",
  },
];

export function evaluateProvider(check: QuickCheck) {
  if (!isProviderMethod(check.methodologyVersion))
    throw new Error(
      "Diese Auswertung gehört ausschließlich zum Plattform-Check.",
    );
  const number = (id: string): number | null =>
    typeof check.answers[id] === "number"
      ? (check.answers[id] as number)
      : null;
  const unknown = check.methodologySnapshot.filter(
    (q) => number(q.id) === null,
  );
  const evaluatedRoutes = routes.map((route) => {
    const values = route.questionIds.map(number);
    const level: RouteLevel = values.some((v) => v === null)
      ? "unknown"
      : values.every((v) => v! >= 7)
        ? "high"
        : values.every((v) => v! >= 4)
          ? "partial"
          : "barrier";
    return { ...route, level, description: route.descriptions[level] };
  });
  const evaluatedProtections = protections.map((protection) => {
    const value = number(protection.questionId);
    const level: ProtectionLevel =
      value === null
        ? "unknown"
        : value >= 7
          ? "strong"
          : value >= 4
            ? "limited"
            : "weak";
    return { ...protection, value, level };
  });
  const comparison = number("Q11"),
    purchase = number("Q12");
  const evidence =
    comparison === null || purchase === null
      ? "unknown"
      : comparison >= 7 && purchase >= 7
        ? "supported"
        : comparison <= 3 || purchase <= 3
          ? "untested"
          : "partial";
  const evidenceText =
    evidence === "supported"
      ? "Vergleich und Kaufentscheidungen stützen laut Ihren Angaben einen Vorteil."
      : evidence === "unknown"
        ? "Angaben zu Vergleich oder Kaufentscheidungen fehlen."
        : evidence === "untested"
          ? "Ein direkter Vergleich oder bewusste Käufe fehlen noch."
          : "Vergleich und Kaufentscheidungen sind erst teilweise belegt.";
  const exposed = evaluatedRoutes.filter((r) => r.level === "high");
  const strong = evaluatedProtections.filter((p) => p.level === "strong");
  const answered = 12 - unknown.length;
  const headline =
    answered === 0
      ? "Ihr Ergebnis ist noch offen."
      : unknown.length
        ? "Ihr Ergebnis ist noch unvollständig."
        : exposed.length
          ? "KI könnte viel übernehmen."
          : evaluatedRoutes.every((r) => r.level === "barrier")
            ? "Eine Übernahme stößt auf Hürden."
            : "KI könnte Teile übernehmen.";
  const protectionSummary = strong.length
    ? `Möglicher Schutz: ${new Intl.ListFormat("de", { type: "conjunction" }).format(strong.map((p) => p.shortTitle))}.`
    : evaluatedProtections.some((p) => p.level === "unknown")
      ? "Ihr Schutz ist noch offen."
      : "Bisher wenig eigener Schutz erkennbar.";
  const proofSummary =
    evidence === "supported"
      ? "Vorteil laut Ihren Angaben belegt."
      : evidence === "unknown"
        ? "Belege noch offen."
        : evidence === "untested"
          ? "Vorteil noch nicht belegt."
          : "Erste Belege vorhanden.";
  const summary =
    answered === 0
      ? "Noch keine Antworten."
      : `${protectionSummary} ${proofSummary}`;
  const actions: {
    id: string;
    title: string;
    detail: string;
    questionIds: string[];
  }[] = [];
  if (unknown.length)
    actions.push({
      id: "unknown",
      title: "Offene Antworten klären",
      detail: `Beginnen Sie mit: ${unknown[0].text}`,
      questionIds: unknown.map((q) => q.id),
    });
  const route =
    exposed[0] ?? evaluatedRoutes.find((r) => r.level === "partial");
  if (route)
    actions.push({
      id: "trial",
      title: "Einen Auftrag mit KI vergleichen",
      detail:
        "Derselbe Auftrag, zwei Lösungen: Vergleichen Sie Ergebnis und Aufwand.",
      questionIds: route.questionIds,
    });
  if (evidence !== "supported" && answered > 0)
    actions.push({
      id: "proof",
      title: "Kunden fragen, wofür sie weiter zahlen",
      detail:
        "Zeigen Sie die günstigere Alternative. Welchen Unterschied würde der Kunde weiter kaufen?",
      questionIds: ["Q11", "Q12"],
    });
  if (actions.length < 3 && strong.length)
    actions.push({
      id: "protect",
      title: `${strong[0].title} praktisch prüfen`,
      detail: strong[0].test,
      questionIds: [strong[0].questionId],
    });
  if (!actions.length)
    actions.push({
      id: "barrier",
      title: "Die größte Hürde praktisch testen",
      detail:
        "Testen Sie einen Auftrag mit KI. Welche Daten, Zugänge oder Arbeitsschritte fehlen?",
      questionIds: ["Q1", "Q2", "Q3"],
    });
  return {
    routes: evaluatedRoutes,
    protections: evaluatedProtections,
    evidence,
    evidenceText,
    headline,
    summary,
    actions: actions.slice(0, 3),
    unknown,
    answered,
  };
}

// Qualitative sensitivity to the user's assumptions, not an arrival forecast.
// A faster pace never supplies missing access or changes the structural findings.
export function evaluateProviderScenario(check: QuickCheck) {
  const { routes } = evaluateProvider(check);
  const settings = check.providerScenario ?? DEFAULT_PROVIDER_SCENARIO;
  const strongest = (order: string[]) => {
    const ordered = order.map((id) => routes.find((route) => route.id === id)!);
    return (
      ordered.find((route) => route.level === "high") ??
      ordered.find((route) => route.level === "partial")
    );
  };
  const capabilityRoute = strongest(["replace", "background", "bundle"]);
  const priceRoute = strongest(["bundle", "replace", "background"]);
  const unresolved = routes.some((route) => route.level === "unknown");
  const pace = {
    slow: "schrittweise",
    medium: "zunehmend",
    fast: "schnell",
  }[settings.capabilityPace];
  const pressure = {
    slow: "leicht",
    medium: "zunehmend",
    fast: "stark",
  }[settings.pricePace];

  const capability = (() => {
    if (!capabilityRoute)
      return {
        routeId: null,
        level: unresolved ? ("unknown" as const) : ("barrier" as const),
        text: unresolved
          ? "Für die Übernahme fehlen noch Antworten."
          : "Daten, Zugänge oder reale Arbeit bleiben Hürden für eine Übernahme.",
      };
    const partial = capabilityRoute.level === "partial";
    const subject =
      capabilityRoute.id === "background"
        ? partial
          ? "Teile Ihrer Oberfläche"
          : "Ihre Oberfläche"
        : partial
          ? "Teile Ihrer digitalen Arbeit"
          : "Ihre digitale Arbeit";
    return {
      routeId: capabilityRoute.id,
      level: capabilityRoute.level,
      text: `${subject} ${partial ? "könnten" : "könnte"} ${pace} durch KI ersetzt werden.${partial ? " Hürden bleiben." : ""}`,
    };
  })();
  const price = (() => {
    if (!priceRoute)
      return {
        routeId: null,
        level: unresolved ? ("unknown" as const) : ("barrier" as const),
        text: unresolved
          ? "Für den Preisdruck fehlen noch Antworten."
          : "Günstigere KI allein macht Ihr Angebot noch nicht ersetzbar.",
      };
    const source =
      priceRoute.id === "bundle"
        ? priceRoute.level === "partial"
          ? "Mitgelieferte KI-Teilfunktionen"
          : "Mitgelieferte KI-Funktionen"
        : "Günstigere KI-Alternativen";
    return {
      routeId: priceRoute.id,
      level: priceRoute.level,
      text: `${source} könnten Ihren Preis ${pressure} unter Druck setzen.`,
    };
  })();
  return { settings, capability, price };
}
