import type { GroupId, QuickQuestion } from "./model.js";

export const PROVIDER_METHOD = "quick-check-7.0";
export function isProviderMethod(version: string) {
  return [
    "quick-check-3.0",
    "quick-check-3.1",
    "quick-check-4.0",
    "quick-check-5.0",
    "quick-check-6.0",
    "quick-check-7.0",
  ].includes(version);
}
export const PROVIDER_PREMISE =
  "Stellen Sie sich vor: Ihre Kunden haben nahezu unbegrenzt sehr leistungsfähige KI-Agenten. Diese können digitale Arbeit erledigen und die freigegebenen Daten und Programme der Firma nutzen. Wofür braucht der Kunde dann noch Ihr Angebot?";
export const PROVIDER_BOUNDARIES =
  "Wir prüfen diese Annahme ohne festen Zeitpunkt. Exklusive Daten, besondere Rechte und körperliche Ausführung stehen dem Anbieter dadurch nicht automatisch zur Verfügung.";
export const PROVIDER_GROUPS: { id: GroupId; title: string; short: string }[] =
  [
    { id: "value", title: "Ihre Leistung", short: "Leistung" },
    { id: "competition", title: "Der Zugang zum Kunden", short: "Plattform" },
    { id: "advantage", title: "Was Sie besonders macht", short: "Vorteile" },
    { id: "control", title: "Was davon trägt", short: "Belege" },
  ];

export function isProviderV4(version: string) {
  return version === "quick-check-4.0";
}
export function isProviderV5(version: string) {
  return version === "quick-check-5.0";
}
export function isProviderV6(version: string) {
  return version === "quick-check-6.0";
}
export function isProviderV7(version: string) {
  return version === "quick-check-7.0";
}
export function isExpertMethod(version: string) {
  return isProviderV6(version) || isProviderV7(version);
}
export function isProviderRiskMethod(version: string) {
  return isProviderV5(version) || isExpertMethod(version);
}
export function supportsBusinessAnalysis(version: string) {
  return isProviderV4(version) || isProviderRiskMethod(version);
}
export const EXPERT_PREMISE =
  "Stellen Sie sich ein Team aus Spitzenexperten vor: rund um die Uhr, parallel und viel günstiger. Ihre Kunden, bekannte Wettbewerber und neue Anbieter aus anderen Branchen haben dasselbe Team wie Sie. Es darf das Kundenproblem ganz anders lösen. Welcher Burggraben bleibt?";
export function providerPremise(version: string) {
  if (isExpertMethod(version)) return EXPERT_PREMISE;
  if (isProviderV5(version))
    return "Sehr leistungsfähige KI kann Aufgaben erledigen, Programme bedienen und andere Anbieter beauftragen. Was braucht der Kunde dann noch von Ihnen – und wofür zahlt er extra?";
  return isProviderV4(version)
    ? "Ihre Kunden, Ihre Wettbewerber und Sie selbst haben sehr leistungsfähige, günstige KI-Agenten. Diese können digitale Arbeit erledigen und freigegebene Daten und Programme nutzen. Wofür zahlen Kunden dann noch bei Ihnen?"
    : PROVIDER_PREMISE;
}

export const PROVIDER_QUESTIONS: QuickQuestion[] = [
  {
    id: "Q1",
    group: "value",
    text: "Wie viel Ihres Ergebnisses ist rein digital?",
    low: "Fast nichts",
    high: "Fast alles",
    help: "Gemeint ist das fertige Ergebnis, für das der Kunde bezahlt.",
    example:
      "Transkript, PDF oder Video: digital. Eine Reparatur vor Ort: nicht nur digital.",
    action: "Das bezahlte Ergebnis benennen",
    actionDetail:
      "Beschreiben Sie einen konkreten Auftrag und das Ergebnis, das der Kunde abnimmt.",
  },
  {
    id: "Q2",
    group: "value",
    text: "Kann ein Außenstehender die nötigen Daten und Zugänge bekommen?",
    low: "Kaum",
    high: "Leicht",
    help: "Zählen Sie Kundendaten mit Erlaubnis, Schnittstellen und andere Anbieter.",
    example:
      "Eine Audiodatei lässt sich teilen. Exklusive laufende Messdaten oder Zugangsrechte können fehlen.",
    action: "Daten und Zugänge prüfen",
    actionDetail:
      "Was braucht ein externer Experte? Welche Daten, Rechte oder Zugänge kann der Kunde bereitstellen?",
  },
  {
    id: "Q3",
    group: "value",
    text: "Kann ein Agent Ihren Dienst direkt nutzen und bezahlen?",
    low: "Noch nicht",
    high: "Bereits im Einsatz",
    help: "Von der Freigabe bis zum Ergebnis und zur Abrechnung. Eine Schnittstelle allein genügt nicht.",
    example:
      "Ein Kundenagent bestellt eine Prüfung; Ihr Dienst liefert das Ergebnis und wird dafür bezahlt.",
    action: "Einen bezahlten Agentenauftrag testen",
    actionDetail:
      "Kann ein Kundenagent Ihren Dienst finden, autorisieren, nutzen und bezahlen? Testen Sie einen vollständigen Auftrag.",
  },
  {
    id: "Q4",
    group: "competition",
    text: "Wie viel Ihres Werts steckt allein in der Bedienung?",
    low: "Kaum etwas",
    high: "Fast alles",
    help: "Zählen Sie Klicks und Einstellungen. Bezahlte Daten, Berechnung oder Ausführung können dahinter bleiben.",
    example:
      "Ein Agent bedient das Schnittprogramm. Dessen Verarbeitung kann trotzdem nötig bleiben.",
    action: "Bedienung und Technik trennen",
    actionDetail:
      "Wenn der Agent alles bedient: Welche bezahlte Leistung Ihrer Software bleibt nötig?",
  },
  {
    id: "Q5",
    group: "competition",
    text: "Wie leicht kann ein Agent einen anderen Anbieter wählen?",
    low: "Kaum möglich",
    high: "Leicht austauschbar",
    help: "Zählen Sie andere Anbieter, Selbstmachen und Lösungen aus anderen Branchen.",
    example:
      "Ein Agent wählt einen beliebigen Druck-, Übersetzungs- oder Transkriptionsdienst.",
    action: "Eine Alternative beauftragen",
    actionDetail:
      "Kann ein anderer Anbieter denselben Auftrag erledigen? Vergleichen Sie Ergebnis und Preis.",
  },
  {
    id: "Q6",
    group: "advantage",
    text: "Braucht ein Expertenteam etwas, das nur Sie liefern?",
    low: "Nichts",
    high: "Unverzichtbaren Beitrag",
    help: "Denken Sie an Daten, Rechte, Zugänge oder Ausführung. Fachwissen allein zählt hier nicht.",
    example:
      "Ein Experte kann Messdaten auswerten. Die laufende Messung am gesperrten Standort braucht er trotzdem.",
    action: "Den verbleibenden Beitrag benennen",
    actionDetail:
      "Welcher eigene Beitrag bleibt für das Kundenproblem nötig, auch bei einem anderen Lösungsweg?",
  },
  {
    id: "Q7",
    group: "advantage",
    text: "Wie schwer ist dieser Beitrag anderswo zu bekommen?",
    low: "Leicht ersetzbar",
    high: "Sehr schwer ersetzbar",
    help: "Zählen Sie andere Datenquellen, Anbieter und Wege zum gleichen Kundennutzen.",
    example:
      "Eine Standard-Schnittstelle ist leichter ersetzbar als exklusive laufende Messungen.",
    action: "Die beste Alternative suchen",
    actionDetail:
      "Kann ein externer Experte den Beitrag einkaufen, neu beschaffen oder durch einen anderen Lösungsweg umgehen?",
  },
  {
    id: "Q8",
    group: "advantage",
    text: "Wie stark hängt der Kauf an diesem Beitrag?",
    low: "Kaum",
    high: "Kaufentscheidend",
    help: "Gemeint ist der Beitrag aus den beiden vorigen Fragen. Bei einer Idee zählt Ihre Annahme.",
    example:
      "Kunden kaufen den Zugang zu laufenden Messdaten, nicht nur die Auswertung.",
    action: "Den Preis begründen",
    actionDetail:
      "Prüfen Sie mit Kunden, ob sie für den besonderen Beitrag oder nur für das fertige Ergebnis zahlen.",
  },
  {
    id: "Q9",
    group: "control",
    text: "Wie gut schafft KI die Aufgabe heute?",
    low: "Kaum brauchbar",
    high: "Ausreichend gut",
    help: "Bewerten Sie einen vollständigen Kundenauftrag. Ohne Vergleich wählen Sie „Weiß ich nicht“.",
    example:
      "Ein fertiger Untertitelauftrag zählt mehr als ein einzelner gut erkannter Satz.",
    action: "Die heutige Leistung messen",
    actionDetail:
      "Lassen Sie eine verfügbare KI einen typischen Auftrag erledigen. Prüfen Sie Qualität und Nacharbeit.",
  },
  {
    id: "Q10",
    group: "competition",
    text: "Könnte ein Expertenteam Ihr Kundenproblem ohne Sie lösen?",
    low: "Kaum",
    high: "Vollständig",
    help: "Auch auf einem ganz anderen Weg. Daten, Zugänge und Ausführung prüfen wir getrennt.",
    example:
      "Der Kunde braucht verständliche Inhalte. Ein Experte könnte sie anders aufbereiten, statt Ihr PDF-Werkzeug nachzubauen.",
    action: "Einen anderen Lösungsweg prüfen",
    actionDetail:
      "Lassen Sie einen Fachkundigen das Kundenproblem lösen, ohne Ihr Produkt oder Ihren bisherigen Ablauf zu übernehmen.",
  },
  {
    id: "Q11",
    group: "control",
    text: "Wer kontrolliert den Zugang zu Ihren Kunden?",
    low: "Wir selbst",
    high: "Eine Plattform",
    help: "Wer kann Sie aus der Auswahl nehmen, Preise diktieren oder den Kundenkontakt übernehmen?",
    example:
      "Eigene Kundenverträge oder mehrere Absatzwege geben mehr Spielraum als ein einziger Vermittler.",
    action: "Abhängigkeit vom Vermittler prüfen",
    actionDetail:
      "Wer bestimmt Auswahl, Preis und Kundendaten? Prüfen Sie einen zweiten Absatzweg und Ihre Marge nach Vermittlungskosten.",
  },
  {
    id: "Q12",
    group: "control",
    text: "Zahlen Kunden oder Partner trotz Alternativen für Ihren Vorteil?",
    low: "Noch nicht getestet",
    high: "Mehrfach bestätigt",
    help: "Gemeint sind echte Käufe nach einem Vergleich. Eine neue Idee ohne Belege bleibt eine Annahme.",
    example:
      "Ein Kunde vergleicht KI, Fachleute oder andere Anbieter und bezahlt trotzdem Ihren besonderen Beitrag.",
    action: "Den Kaufgrund testen",
    actionDetail:
      "Zeigen Sie fünf typische Ergebnisse im direkten Vergleich. Für welchen Unterschied würden Kunden extra zahlen?",
  },
];
