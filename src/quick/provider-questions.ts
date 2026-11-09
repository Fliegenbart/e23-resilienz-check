import type { GroupId, QuickQuestion } from "./model.js";

export const PROVIDER_METHOD = "quick-check-5.0";
export function isProviderMethod(version: string) {
  return [
    "quick-check-3.0",
    "quick-check-3.1",
    "quick-check-4.0",
    "quick-check-5.0",
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
export function supportsBusinessAnalysis(version: string) {
  return isProviderV4(version) || isProviderV5(version);
}
export function providerPremise(version: string) {
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
    text: "Sind die nötigen Daten und Mittel auch ohne Sie erhältlich?",
    low: "Nicht ersetzbar",
    high: "Leicht erhältlich",
    help: "Zählen Sie Kundendaten, Standardsoftware und beauftragbare Dienste. Der Kunde muss sie heute noch nicht besitzen.",
    example:
      "Audiodatei und Transkriptionssoftware sind verfügbar. Exklusive Messdaten oder Rechte können fehlen.",
    action: "Den fehlenden Beitrag prüfen",
    actionDetail:
      "Was fehlt selbst einem sehr guten Agenten? Lässt es sich beschaffen, nachbauen oder anderswo einkaufen?",
  },
  {
    id: "Q3",
    group: "value",
    text: "Kann der Kunde den Auftrag direkt einem KI-Assistenten geben?",
    low: "Anderer Zugang nötig",
    high: "Ein Auftrag genügt",
    help: "Denken Sie an ChatGPT, Claude oder Gemini als Einstieg – auch wenn der Kunde sie heute noch nicht nutzt.",
    example: "Datei hochladen und fertige Untertitel anfordern.",
    action: "Den direkten Auftrag testen",
    actionDetail:
      "Formulieren Sie den Kundenauftrag in einem Satz. Was fehlt bis zum fertigen Ergebnis?",
  },
  {
    id: "Q4",
    group: "competition",
    text: "Wie viel Ihres Nutzens steckt in der Bedienung?",
    low: "Kaum etwas",
    high: "Fast alles",
    help: "Zählen Sie Klicks, Einstellungen und Handarbeit, die ein Agent übernehmen könnte.",
    example:
      "Ein Agent bedient das Schnittprogramm. Dessen Verarbeitung kann trotzdem nötig bleiben.",
    action: "Bedienung und Technik trennen",
    actionDetail:
      "Wenn der Agent alles bedient: Welche bezahlte Leistung Ihrer Software bleibt nötig?",
  },
  {
    id: "Q5",
    group: "competition",
    text: "Wie leicht kann ein Agent andere Anbieter beauftragen?",
    low: "Kaum möglich",
    high: "Leicht austauschbar",
    help: "Gemeint sind Anbieter mit einem für den Kunden ausreichend guten Ergebnis.",
    example:
      "Ein Agent wählt einen beliebigen Druck-, Übersetzungs- oder Transkriptionsdienst.",
    action: "Eine Alternative beauftragen",
    actionDetail:
      "Kann ein anderer Anbieter denselben Auftrag erledigen? Vergleichen Sie Ergebnis und Preis.",
  },
  {
    id: "Q6",
    group: "advantage",
    text: "Bleibt Ihr Beitrag für das fertige Ergebnis nötig?",
    low: "Nicht mehr nötig",
    high: "Unverzichtbar",
    help: "Nehmen Sie an, der Agent erledigt alle digitalen Schritte und bedient alle Programme.",
    example:
      "Weiter nötig sein können eigene Messdaten, eine spezielle Verarbeitung, ein Netzwerk oder eine verbindliche Prüfung.",
    action: "Den verbleibenden Beitrag benennen",
    actionDetail:
      "Was kann der Kunde auch mit einem sehr guten Agenten ohne Sie nicht erhalten?",
  },
  {
    id: "Q7",
    group: "advantage",
    text: "Wie schwer lässt sich dieser Beitrag ersetzen?",
    low: "Leicht ersetzbar",
    high: "Sehr schwer ersetzbar",
    help: "Prüfen Sie Nachbauen, andere Datenquellen und andere Anbieter. KI kann auch beim Wechsel helfen.",
    example:
      "Eine Standard-Schnittstelle ist leichter ersetzbar als exklusive laufende Messungen.",
    action: "Die beste Alternative suchen",
    actionDetail:
      "Wie würde ein KI-Anbieter den nötigen Beitrag beschaffen, ohne mit Ihnen zusammenzuarbeiten?",
  },
  {
    id: "Q8",
    group: "advantage",
    text: "Wie stark ist der Grund, weiter extra zu zahlen?",
    low: "Kein Kaufgrund",
    high: "Klarer Kaufgrund",
    help: "Für welchen verbleibenden Unterschied lohnt sich Ihr Preis? Bei einer Idee zählt zunächst Ihre Annahme.",
    example:
      "Der Kunde bezahlt eine verbindliche Ergebnisprüfung, die sein KI-Assistent nicht mitliefert.",
    action: "Den Preis begründen",
    actionDetail:
      "Benennen Sie den konkreten Unterschied zur mitgelieferten KI-Lösung, für den der Kunde extra zahlen würde.",
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
    text: "Wie viel Ihres Vorsprungs verschwindet mit besserer KI?",
    low: "Fast nichts",
    high: "Fast alles",
    help: "Gemeint sind heutige KI-Schwächen wie kurze Kontexte, Erkennungsfehler oder schwierige Bedienung.",
    example:
      "Ihr Werkzeug zerlegt Texte, weil das Modell sie noch nicht am Stück verarbeiten kann.",
    action: "Den Vorsprung erneut testen",
    actionDetail:
      "Wiederholen Sie einen Auftrag mit besserer KI. Welche Hilfsschritte werden noch bezahlt?",
  },
  {
    id: "Q11",
    group: "control",
    text: "Wie stark profitiert Ihr Angebot von besserer KI?",
    low: "Kaum",
    high: "Sehr stark",
    help: "Bessere Ergebnisse oder weniger Aufwand für Sie. Das allein verhindert keine Ersetzung.",
    example:
      "Sie können mehr geprüfte Ergebnisse liefern. Wettbewerber können dieselbe KI nutzen.",
    action: "Den eigenen Nutzen messen",
    actionDetail: "Vergleichen Sie Qualität und Aufwand mit besserer KI.",
  },
  {
    id: "Q12",
    group: "control",
    text: "Zahlen Kunden nach einem KI-Vergleich weiter?",
    low: "Noch nicht getestet",
    high: "Mehrfach bestätigt",
    help: "Gemeint sind echte Käufe nach demselben Auftrag. Eine neue Idee ohne Belege ist unsicher, nicht automatisch riskanter.",
    example:
      "Ein Kunde sieht die günstigere KI-Lösung und bezahlt trotzdem Ihr Angebot.",
    action: "Den Kaufgrund testen",
    actionDetail:
      "Zeigen Sie fünf typische Ergebnisse im direkten Vergleich. Für welchen Unterschied würden Kunden extra zahlen?",
  },
];
