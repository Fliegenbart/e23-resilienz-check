import {
  addEvidence,
  createAssessment,
  reviewAnswer,
  today,
  uid,
  updateAnswer,
  updateEvidence,
  newScenario,
} from "../domain/model";
import type { Assessment, QuestionId } from "../domain/types";
export function examples(): Assessment[] {
  return [
    "Allgemeiner Dokumentenassistent",
    "Dokumentenprozess mit fachlicher Prüfung",
    "Branchenanalyse mit exklusivem Datenzugang",
  ].map((title, i) => {
    const a = createAssessment(
      title,
      i === 2 ? "idea" : "existing",
      i === 2
        ? "Sollen wir einen bezahlten Pilot vorbereiten?"
        : "Welche Bestandteile sollen wir weiterentwickeln?",
    );
    a.isExample = true;
    Object.assign(a.content, {
      customerAlias: "Fiktive Organisation",
      customerSegment: "Fiktive B2B-Kunden",
      user: "Fachteam",
      economicBuyer: "Bereichsleitung",
      customerProblem: "Wiederkehrende Dokumenten- und Analyseaufgaben",
      currentAlternative: "Standardsoftware und manuelle Prüfung",
      paidOutcome:
        i === 2
          ? "Branchenbezogene Entscheidungsvorlage"
          : "Geprüfte, nutzbare Arbeitsergebnisse",
      revenueModel: "Fiktive monatliche Nutzung",
      costDescription: "Software, Betreuung, Fachprüfung und Vertrieb",
      marketContext: "Fiktiver Beratungspilot",
      excludedScope: "Keine Aussagen über reale Anbieter oder Kunden",
      owner: "Moderation",
      participants: ["Fachbeitrag", "Dokumentation"],
    });
    a.content.valueSteps = [
      "Datenzugang",
      "Erstellung und Analyse",
      "Fachliche Prüfung",
      "Freigabe und Verantwortung",
    ].map((title) => ({
      id: uid(),
      title,
      customerValue: "Passende und verlässliche Ergebnisse",
      requiredResources: "Fachwissen und passende Nutzungsrechte",
      currentAIUse: "Unterstützung bei Entwürfen",
      alternative: "Manuelle Bearbeitung",
      critical: true,
      openQuestions: "Im Pilot überprüfen",
    }));
    const e = addEvidence(a);
    updateEvidence(
      a,
      e.id,
      {
        title: "Fiktive Pilotbeobachtung",
        internalReference: "DEMO / keine reale Quelle",
        observation:
          "Für dieses Beispiel angenommener Vergleich an fiktiven Aufgaben.",
        authorOrOrigin: "Fiktives Beispielteam",
        scopeAndLimitations:
          "Ausschließlich Demonstration, keine reale Marktevidenz.",
      },
      "Beispielmoderation",
    );
    for (const q of a.methodologySnapshot.questions) {
      const rating =
        i === 0
          ? q.group === "B"
            ? "high"
            : q.group === "D"
              ? "medium"
              : "low"
          : i === 1
            ? q.group === "B"
              ? "medium"
              : "high"
            : q.group === "C" && q.id === "C1"
              ? "high"
              : "medium";
      if (i === 2 && q.group === "A") {
        updateAnswer(a, q.id, {
          state: "unknown",
          openCheck: "Zahlungsbereitschaft in einem kleinen Pilot prüfen.",
        });
        continue;
      }
      updateAnswer(a, q.id, {
        state: "rated",
        rating,
        rationale: "Fiktive Annahme zur Demonstration der Methode.",
        scope: "Nur dieses Beispiel",
        evidenceLevel: i === 1 ? "substantiated" : "assumption",
        evidenceLinks:
          i === 1
            ? [
                {
                  evidenceId: e.id,
                  relation: "supports",
                  explanation:
                    "Angenommener Vergleich trägt die dargestellte Beispielaussage.",
                },
              ]
            : [],
      });
      if (i === 1) reviewAnswer(a, q.id, "Beispielmoderation", today());
    }
    a.content.threats.push({
      id: uid(),
      revision: 1,
      category: "Plattformbündelung",
      actor: "Fiktive Plattform",
      change: "Die Generierung wird im Standardangebot verfügbar.",
      valueStepIds: [a.content.valueSteps[1].id],
      economicMechanism:
        "Kunden könnten einfache Generierung selbst übernehmen.",
      basis: "scenario",
      questionIds: ["B1", "B3", "B4"],
      evidenceLinks: [],
    });
    for (const s of a.content.scenarios) {
      Object.assign(s, {
        assumption: "Ausdrücklich fiktive bedingte Annahme.",
        customerReaction: "Kunden vergleichen den verbleibenden Nutzen.",
        remainingPaidValue:
          i === 1
            ? "Fachliche Prüfung und Verantwortungsübernahme"
            : "Noch zu prüfen",
        response: "Mit repräsentativen Aufgaben und Käufern validieren.",
        earlyIndicator: "Konkrete Nachfrage nach einer Alternative",
        nextCheck: "Kundenaufgaben und Vergleichsalternative dokumentieren.",
        owner: "Moderation",
      });
    }
    a.content.actions.push({
      id: uid(),
      title:
        i === 2
          ? "Zahlungsbereitschaft prüfen"
          : "Vergleich an Kundenaufgaben durchführen",
      description:
        "Begrenzten Pilot vereinbaren und Beobachtungen dokumentieren.",
      expectedEvidence: "Dokumentierte Kaufentscheidung und Ergebnisvergleich",
      owner: "Moderation",
      dueAt: null,
      status: "open",
      effortNote: "Im Workshop festlegen",
      linkedQuestionIds: i === 2 ? ["A1", "A2"] : ["B1", "B4"],
      linkedRuleIds: [],
      linkedFindingIds: [],
      linkedThreatIds: [],
      linkedScenarioIds: [],
    });
    Object.assign(a.content.decision, {
      recommendation: "validate",
      rationale: "Entscheidende Grundlagen mit begrenztem Aufwand prüfen.",
      conditions: "Alle Angaben dieses Falls sind fiktiv.",
      decidedBy: "Beispielmoderation",
      decidedAt: today(),
    });
    Object.assign(a.content.executiveSummary, {
      mainThreat: "Bündelung einfacher Funktionen",
      evidencedAdvantage:
        i === 1
          ? "Fiktiv geprüfte fachliche Ergebnisqualität"
          : "Noch kein aktuell belegter Vorteil",
      keyUnknown:
        i === 2
          ? "Zahlungsbereitschaft"
          : "Verbleibender bezahlter Nutzen im Szenario",
      priorityActionIds: [a.content.actions[0].id],
    });
    if (i === 1) {
      a.content.baseline = {
        period: "month",
        currency: "EUR",
        revenue: 100000,
        variableCosts: 40000,
        fixedCosts: 35000,
        sourceNote: "Fiktives Rechenbeispiel aus dem Briefing",
      };
      a.content.scenarios[0].financialStress = {
        priceChange: -0.2,
        volumeChange: -0.1,
        unitVariableCostChange: -0.25,
        fixedCostDelta: 5000,
        oneOffCost: null,
        assumptionNote: "Ausschließlich fiktive Demonstration",
        modelApplicable: true,
      };
    }
    return a;
  });
}
