import type { QuickCheck } from "./model.js";
import type {
  RouteLevel,
  ProtectionLevel,
} from "./methods/provider-analysis-3.js";
import { DEFAULT_PROVIDER_SCENARIO } from "./provider-scenario.js";
import { isProviderV4 } from "./provider-questions.js";

type BenefitLevel = "high" | "partial" | "low" | "unknown";
export interface ProviderBenefit {
  questionId: string;
  title: string;
  level: BenefitLevel;
  description: string;
  test: string;
}
export const BENEFIT_LABELS: Record<BenefitLevel, string> = {
  high: "Viel Nutzen",
  partial: "Etwas Nutzen",
  low: "Wenig Nutzen",
  unknown: "Offen",
};

const routes = [
  {
    id: "replace",
    title: "Ihre Arbeit erledigen",
    questionIds: ["Q1", "Q2"],
    descriptions: {
      high: "KI könnte Ihre digitale Arbeit mit den Daten und Programmen des Kunden erledigen.",
      partial:
        "Einzelne Schritte sind übernehmbar. Daten oder Ausführung fehlen noch teilweise.",
      barrier:
        "Für eine vollständige Übernahme fehlen digitale Abläufe, Daten oder Programme.",
      unknown: "Angaben zu Ihrer Leistung oder den Mitteln des Kunden fehlen.",
    },
  },
  {
    id: "bundle",
    title: "Ihre Leistung mitliefern",
    questionIds: ["Q1", "Q2", "Q3"],
    descriptions: {
      high: "Ihre Leistung könnte zur mitgelieferten Funktion einer vorhandenen Plattform werden.",
      partial:
        "Die vorhandene Plattform könnte Teile Ihrer Leistung mitliefern.",
      barrier:
        "Digitale Leistung, nötige Mittel und Plattformzugang kommen noch nicht zusammen.",
      unknown:
        "Angaben zu Ihrer Leistung, den Mitteln des Kunden oder seiner Plattform fehlen.",
    },
  },
  {
    id: "model-gap",
    title: "Ihren Vorsprung einholen",
    questionIds: ["Q4"],
    descriptions: {
      high: "Bessere KI könnte die Hilfsschritte überflüssig machen, für die Kunden Sie heute bezahlen.",
      partial: "Ein Teil Ihres Vorteils könnte mit besserer KI verschwinden.",
      barrier: "Ihr Vorteil hängt wenig von heutigen KI-Schwächen ab.",
      unknown:
        "Wie stark Ihr Vorteil von KI-Schwächen abhängt, ist noch offen.",
    },
  },
];
const protections = [
  {
    id: "data",
    questionId: "Q5",
    title: "Exklusive Daten",
    shortTitle: "eigene Daten",
    detail: "Sie liefern wichtige Daten, die der Kunde nicht selbst hat.",
    test: "Dieselbe Aufgabe mit und ohne Ihre Daten vergleichen.",
  },
  {
    id: "network",
    questionId: "Q6",
    title: "Ihr Netzwerk",
    shortTitle: "Ihr Netzwerk",
    detail: "Andere aktive Teilnehmer tragen wesentlich zum Kundennutzen bei.",
    test: "Kann der Kunde den Nutzen anderswo erhalten oder die Teilnehmer mitnehmen?",
  },
  {
    id: "physical",
    questionId: "Q7",
    title: "Arbeit vor Ort",
    shortTitle: "die Ausführung vor Ort",
    detail:
      "Die Leistung braucht Geräte oder Arbeit vor Ort. Digitale KI allein genügt nicht.",
    test: "Kann ein anderer Dienstleister die Ausführung übernehmen?",
  },
  {
    id: "responsibility",
    questionId: "Q8",
    title: "Verantwortung",
    shortTitle: "Ihre Ergebniszusage",
    detail: "Sie stehen verbindlich für das Ergebnis ein.",
    test: "Welche Zusage bezahlt der Kunde? Würde ein anderer Anbieter sie ebenfalls geben?",
  },
  {
    id: "operations",
    questionId: "Q9",
    title: "Feste Kundenabläufe",
    shortTitle: "feste Kundenabläufe",
    detail: "Ein Systemwechsel würde zentrale Kundenabläufe verändern.",
    test: "Den Wechsel durchspielen: Was muss umgebaut werden, was kann ein Agent weiter nutzen?",
  },
  {
    id: "access",
    questionId: "Q10",
    title: "Rechte und Zugänge",
    shortTitle: "besondere Zugänge",
    detail:
      "Andere Anbieter müssten notwendige Rechte oder Zugänge erst erwerben.",
    test: "Aufwand und Zeit für die Beschaffung prüfen.",
  },
];

export function evaluateProviderV4(check: QuickCheck) {
  if (!isProviderV4(check.methodologyVersion))
    throw new Error("Diese Auswertung gehört zu quick-check-4.0.");
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
  const evaluatedProtections = protections.map((p) => {
    const value = number(p.questionId);
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
  const upside = number("Q11");
  const benefitLevel: BenefitLevel =
    upside === null
      ? "unknown"
      : upside >= 7
        ? "high"
        : upside >= 4
          ? "partial"
          : "low";
  const benefit: ProviderBenefit = {
    questionId: "Q11",
    title: "Bessere eigene Leistung",
    level: benefitLevel,
    description: {
      high: "Bessere KI könnte Ihr Angebot deutlich verbessern oder Ihren Aufwand senken.",
      partial: "Bessere KI könnte einzelne Teile Ihres Angebots verbessern.",
      low: "Sie erwarten bisher wenig eigenen Nutzen durch bessere KI.",
      unknown: "Ihr eigener Nutzen durch bessere KI ist noch offen.",
    }[benefitLevel],
    test: "Dieselbe Aufgabe mit besserer KI testen. Ihre Wettbewerber können diese KI ebenfalls nutzen.",
  };
  const purchase = number("Q12");
  const evidence =
    purchase === null
      ? "unknown"
      : purchase >= 7
        ? "supported"
        : purchase >= 4
          ? "partial"
          : "untested";
  const evidenceText = {
    supported:
      "Laut Ihren Angaben zahlen Kunden nach einem KI-Vergleich weiter.",
    partial: "Erste Käufe nach einem KI-Vergleich stützen Ihren Vorteil.",
    untested:
      "Bezahlte Vorteile nach einem KI-Vergleich sind noch nicht belegt.",
    unknown: "Ob Kunden nach einem KI-Vergleich weiterzahlen, ist noch offen.",
  }[evidence];
  const exposed = evaluatedRoutes.filter((r) => r.level === "high");
  const strong = evaluatedProtections.filter((p) => p.level === "strong");
  const answered = 12 - unknown.length;
  const headline =
    answered === 0
      ? "Ihr Ergebnis ist noch offen."
      : unknown.length
        ? "Ihr Ergebnis ist noch unvollständig."
        : exposed.some((r) => r.id === "model-gap")
          ? "Ihr Vorsprung könnte verschwinden."
          : exposed.length
            ? "KI könnte viel übernehmen."
            : evaluatedRoutes.every((r) => r.level === "barrier")
              ? "Eine Übernahme stößt auf Hürden."
              : "KI könnte Teile übernehmen.";
  const protectionSummary = strong.length
    ? `Möglicher Schutz: ${new Intl.ListFormat("de", { type: "conjunction" }).format(strong.slice(0, 2).map((p) => p.shortTitle))}${strong.length > 2 ? ` sowie ${strong.length - 2} weitere Bereiche` : ""}.`
    : evaluatedProtections.some((p) => p.level === "unknown")
      ? "Ihr Schutz ist noch offen."
      : "Bisher wenig eigener Schutz erkennbar.";
  const proofSummary = {
    supported: "Bezahlter Vorteil laut Ihren Angaben belegt.",
    partial: "Erste Belege vorhanden.",
    untested: "Bezahlter Vorteil noch nicht belegt.",
    unknown: "Belege noch offen.",
  }[evidence];
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
    exposed.find((r) => r.id === "model-gap") ??
    exposed[0] ??
    evaluatedRoutes.find((r) => r.level === "partial");
  if (route)
    actions.push(
      route.id === "model-gap"
        ? {
            id: "gap",
            title: "Den Vorsprung mit besserer KI testen",
            detail:
              "Wiederholen Sie einen Auftrag mit einem besseren Modell. Welche Ihrer Hilfsschritte braucht der Kunde noch?",
            questionIds: ["Q4"],
          }
        : {
            id: "trial",
            title: "Einen Auftrag mit KI vergleichen",
            detail:
              "Derselbe Auftrag, zwei Lösungen: Vergleichen Sie Ergebnis und Aufwand.",
            questionIds: route.questionIds,
          },
    );
  if (evidence !== "supported" && answered > 0)
    actions.push({
      id: "proof",
      title: "Den bezahlten Vorteil belegen",
      detail:
        "Zeigen Sie die günstigere KI-Alternative. Für welchen Unterschied bezahlt der Kunde weiterhin?",
      questionIds: ["Q12"],
    });
  if (strong.length)
    actions.push({
      id: "protect",
      title: `${strong[0].title} praktisch prüfen`,
      detail: strong[0].test,
      questionIds: [strong[0].questionId],
    });
  if (benefit.level === "high" || benefit.level === "partial")
    actions.push({
      id: "benefit",
      title: "Den eigenen KI-Nutzen messen",
      detail: benefit.test,
      questionIds: ["Q11"],
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
    benefit,
    evidence,
    evidenceText,
    headline,
    summary:
      answered === 0
        ? "Noch keine Antworten."
        : `${protectionSummary} ${proofSummary}`,
    actions: actions.slice(0, 3),
    unknown,
    answered,
  };
}

export function evaluateProviderScenarioV4(check: QuickCheck) {
  const { routes, benefit } = evaluateProviderV4(check);
  const settings = check.providerScenario ?? DEFAULT_PROVIDER_SCENARIO;
  const strongest = (order: string[]) => {
    const ordered = order.map((id) => routes.find((r) => r.id === id)!);
    return (
      ordered.find((r) => r.level === "high") ??
      ordered.find((r) => r.level === "partial")
    );
  };
  const capabilityRoute = strongest(["model-gap", "replace", "bundle"]);
  // Cheap models alone do not close capability gaps. Price pressure uses the
  // independently assessed replacement/platform routes, never Q4 or Q11.
  const priceRoute = strongest(["bundle", "replace"]);
  const pace = { slow: "schrittweise", medium: "zunehmend", fast: "schnell" }[
    settings.capabilityPace
  ];
  const pressure = { slow: "leicht", medium: "zunehmend", fast: "stark" }[
    settings.pricePace
  ];
  const capability = (() => {
    if (!capabilityRoute) {
      const unresolved = routes.some((r) => r.level === "unknown");
      return {
        routeId: null,
        level: unresolved ? ("unknown" as const) : ("barrier" as const),
        text: unresolved
          ? "Für die Übernahme fehlen noch Antworten."
          : "Ihre Antworten zeigen Hürden, die bessere KI allein nicht beseitigt.",
      };
    }
    const partial = capabilityRoute.level === "partial";
    return {
      routeId: capabilityRoute.id,
      level: capabilityRoute.level,
      text:
        capabilityRoute.id === "model-gap"
          ? `Ihr ${partial ? "technischer " : ""}Vorsprung könnte ${pace} schrumpfen.${partial ? " Andere Vorteile bleiben möglich." : ""}`
          : `${partial ? "Teile Ihrer digitalen Arbeit könnten" : "Ihre digitale Arbeit könnte"} ${pace} durch KI ersetzt werden.${partial ? " Hürden bleiben." : ""}`,
    };
  })();
  const price = (() => {
    if (!priceRoute) {
      const unresolved = routes
        .filter((r) => r.id !== "model-gap")
        .some((r) => r.level === "unknown");
      return {
        routeId: null,
        level: unresolved ? ("unknown" as const) : ("barrier" as const),
        text: unresolved
          ? "Für den Preisdruck fehlen noch Antworten."
          : "Günstigere KI allein macht Ihr Angebot noch nicht ersetzbar.",
      };
    }
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
  const benefitText =
    benefit.level === "unknown"
      ? "Ihr eigener Nutzen bleibt offen."
      : benefit.level === "low"
        ? "Bisher wenig eigener KI-Nutzen erkennbar."
        : `Ihr eigenes Angebot könnte ${pace} ${benefit.level === "partial" ? "in einzelnen Teilen " : ""}besser werden.`;
  return {
    settings,
    capability,
    price,
    benefit: { level: benefit.level, text: benefitText },
  };
}
