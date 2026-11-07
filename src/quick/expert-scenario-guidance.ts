import type { ScenarioContext, ScenarioQuestionId } from "./scenario-model";
const HELP: Record<
  ScenarioQuestionId,
  { meaning: string; low: string; middle: string; high: string }
> = {
  value: {
    meaning:
      "Denken Sie an das konkrete Ergebnis, für das ein Kunde bezahlt. Was könnte das im Szenario beschriebene Team selbst herstellen – und wofür bräuchte es erst Ihre Daten, Rechte, Beziehungen oder die Möglichkeit, körperlich zu arbeiten?",
    low: "Das Team könnte nur kleine Teile liefern; für den wesentlichen Nutzen bliebe Ihr Angebot erforderlich.",
    middle:
      "Das Team könnte einen Teil des Ergebnisses liefern. Andere bezahlte Teile blieben schwer erreichbar.",
    high: "Das Team könnte fast das gesamte bezahlte Ergebnis ohne Ihr Angebot herstellen.",
  },
  price: {
    meaning:
      "Nehmen Sie für diese Frage ein vergleichbar gutes, deutlich günstigeres Konkurrenzangebot an. Welchen Preis könnten Sie dann noch durchsetzen? Berücksichtigen Sie, dass Sie selbst dasselbe Team nutzen und dadurch Kosten sparen könnten.",
    low: "Ihr Preis bliebe durchsetzbar oder eigene Einsparungen würden den Preisnachlass auffangen.",
    middle:
      "Preis oder Ertrag pro Auftrag müssten sinken; das Angebot bliebe wirtschaftlich.",
    high: "Der noch erzielbare Preis würde Ihre vollständigen Kosten kaum decken.",
  },
  access: {
    meaning:
      "Stellen Sie sich vor, Ihr Kunde beauftragt einen Assistenten mit dem Anbietervergleich. Welche nachprüfbaren Gründe und Zugänge würden dafür sorgen, dass Ihr Angebot auf die Auswahlliste kommt?",
    low: "Direkte Kundenbeziehungen oder klare Auswahlkriterien würden Ihr Angebot in die Auswahl bringen.",
    middle:
      "Ein Teil der Anfragen könnte wegfallen; über andere Zugänge würden Kunden Sie weiterhin erreichen.",
    high: "Es gäbe kaum besondere Zugänge oder Auswahlgründe, durch die Ihr Angebot berücksichtigt würde.",
  },
  adapt: {
    meaning:
      "Welche konkrete Veränderung könnten Sie bis zum Ende des Zeitfensters umsetzen? Denken Sie an verfügbare Mitarbeitende, Technik, Geld, Entscheidungen und die nötige Zustimmung Ihrer Kunden.",
    low: "Zuständigkeit, Mittel und nächste Schritte für eine passende Veränderung stünden bereit.",
    middle:
      "Ein Ansatz wäre vorhanden, aber wichtige Ressourcen oder Freigaben wären noch offen.",
    high: "Wesentliche Voraussetzungen fehlten; eine rechtzeitige Umsetzung wäre kaum möglich.",
  },
  opportunity: {
    meaning:
      "Stellen Sie sich vor, dasselbe Team arbeitet für Sie. Welche konkrete Kundenaufgabe würden Sie ihm geben? Entscheidend ist, ob Kunden den zusätzlichen Nutzen bezahlen würden oder eine Einsparung bei Ihnen bliebe.",
    low: "Sie sehen bisher keinen konkreten Einsatz für zusätzlichen Nutzen und Ertrag.",
    middle:
      "Es gäbe einen plausiblen Einsatz; Nachfrage oder Wirtschaftlichkeit wären noch unklar.",
    high: "Es gäbe einen konkreten umsetzbaren Einsatz mit nachvollziehbarer Zahlungsbereitschaft oder verbleibender Einsparung.",
  },
};
const EXAMPLES: Record<
  ScenarioContext["profile"],
  Record<ScenarioQuestionId, string>
> = {
  digital: {
    value:
      "Sie erstellen Vertriebspräsentationen. Das Team könnte recherchieren, Folien entwerfen und sie prüfen. Exklusive Kundendaten, Freigaben und die Verantwortung für das Ergebnis müsste es gesondert bekommen.",
    price:
      "Das Team liefert vergleichbare Präsentationen für ein Zehntel Ihres Preises. Würden Kunden trotzdem Ihren Preis bezahlen? Falls Sie selbst günstiger herstellen, zählt das bei Ihrer Rechnung mit.",
    access:
      "Ein Kunde bekommt von seinem Einkaufsassistenten drei Agenturen vorgeschlagen. Ohne passende Referenzen, auffindbare Angebote oder direkten Kundenzugang könnten Sie auf dieser Liste fehlen.",
    adapt:
      "Sie wollen künftig Fachprüfung und Beratung statt Folienerstellung verkaufen. Sind Team, Preise und Kundenverträge innerhalb des Zeitfensters auf dieses neue Angebot umstellbar?",
    opportunity:
      "Ihr eigenes Expertenteam könnte viele Präsentationsvarianten testen. Ein Ertrag entsteht, wenn Kunden für ein besseres Ergebnis bezahlen oder die eingesparte Arbeitszeit wirtschaftlich nutzbar wird.",
  },
  mixed: {
    value:
      "Bei einem Wartungsangebot könnte das Team Diagnose und Einsatzplanung übernehmen. Für eine Reparatur vor Ort bräuchte es weiterhin Menschen oder die ausdrücklich im Szenario angenommenen Roboter.",
    price:
      "Ein anderer Wartungsdienst bietet dank günstiger Diagnose und Einsatzplanung deutlich billiger an. Könnten Sie Ihren Preis halten oder Ihre Kosten ausreichend senken?",
    access:
      "Ein Einkaufsassistent vergleicht Wartungsdienste. Bestehende Serviceverträge, belegte Reaktionszeiten oder besondere Zulassungen könnten dafür sorgen, dass Ihr Angebot berücksichtigt wird.",
    adapt:
      "Sie wollen Diagnose und Einsatzplanung neu organisieren. Sind die nötigen Daten verfügbar, Mitarbeitende einsetzbar und Kunden mit der Arbeitsweise einverstanden?",
    opportunity:
      "Ihr Team könnte wiederkehrende Ausfallursachen untersuchen und unnötige Anfahrten vermeiden. Kunden könnten für verlässlichere Verfügbarkeit bezahlen; eingesparte Kosten könnten bei Ihnen bleiben.",
  },
  physical: {
    value:
      "Ein Team könnte Bauteile planen und Prüfverfahren entwickeln. Für die tatsächliche Fertigung bräuchte es passende Maschinen, Material und Freigaben. Roboter kommen nur hinzu, wenn das gewählte Szenario sie ausdrücklich vorsieht.",
    price:
      "Ein anderer Hersteller liefert vergleichbare Teile günstiger. Sie müssten prüfen, ob besondere Qualität oder Lieferfähigkeit Ihren Preis tragen und ob eigene Einsparungen einen Preisnachlass auffangen könnten.",
    access:
      "Ein Einkaufsassistent sucht Hersteller nach Zertifizierung, Lieferzeit und Preis. Welche nachprüfbaren Kriterien würden Ihr Angebot auf die Auswahlliste bringen?",
    adapt:
      "Ein Betrieb will Fertigungsabläufe verändern. Beschaffung, Umbau, Schulung und laufende Lieferpflichten könnten die Umsetzung verzögern – auch wenn der fachliche Plan schon feststeht.",
    opportunity:
      "Das Team könnte Ausschussursachen untersuchen oder Sonderanfertigungen schneller planen. Das würde zum eigenen Ertrag, wenn die Einsparung bleibt oder Kunden den zusätzlichen Nutzen bezahlen.",
  },
};
export function expertScenarioGuidance(
  id: ScenarioQuestionId,
  profile: ScenarioContext["profile"],
) {
  return { ...HELP[id], example: EXAMPLES[profile][id] };
}
