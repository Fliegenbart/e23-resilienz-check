import type { ScenarioContext, ScenarioQuestionId } from "./scenario-model";
import { expertScenarioGuidance } from "./expert-scenario-guidance";

// Erläuterungen für die Bedienung, getrennt von der gespeicherten Bewertungsmethode.
// Die Beispiele sind mögliche Wirkungswege, keine Technologieprognosen.
const GUIDANCE: Record<
  ScenarioQuestionId,
  { meaning: string; low: string; middle: string; high: string }
> = {
  value: {
    meaning:
      "Gemeint ist das Ergebnis, für das Kunden Sie bezahlen. Wenn sie im gewählten Szenario ein ausreichend gutes Ergebnis direkt mit KI oder bei einem anderen Anbieter bekommen, könnte der Grund entfallen, Ihr Angebot zu kaufen.",
    low: "Kunden hätten weiterhin einen klaren Grund, Ihr Angebot zu bezahlen.",
    middle:
      "Ein Teil Ihrer Leistung wäre ersetzbar; für andere Teile würden Kunden weiterhin bezahlen.",
    high: "Fast das gesamte bezahlte Ergebnis wäre auch ohne Ihr Angebot erhältlich.",
  },
  price: {
    meaning:
      "Kunden könnten Ihre Leistung weiterhin brauchen, aber weniger dafür bezahlen wollen. Wenn Wettbewerber dieselbe Aufgabe dank KI günstiger erledigen, könnten Sie Ihren Preis senken müssen. Entscheidend ist, ob Ihre eigenen Kosten ausreichend mit sinken.",
    low: "Ihr Preis wäre weiter durchsetzbar oder Ihre Kostenvorteile würden den Preisdruck auffangen.",
    middle:
      "Preise oder Erträge pro Auftrag könnten sinken; das Angebot bliebe wirtschaftlich.",
    high: "Der erzielbare Preis könnte Ihre vollständigen Kosten kaum noch decken.",
  },
  access: {
    meaning:
      "Es geht darum, ob Ihr Angebot überhaupt auf die Auswahlliste des Kunden kommt. Wenn ein KI-Assistent Anbieter sucht, vergleicht oder den Einkauf vorbereitet, könnten andere Angebote ausgewählt werden, bevor Sie mit dem Kunden sprechen.",
    low: "Kunden würden Ihr Angebot weiterhin finden und bei ihrer Auswahl berücksichtigen.",
    middle:
      "Ein Teil der Anfragen könnte wegfallen; über andere Zugänge würden Kunden Sie weiterhin erreichen.",
    high: "Viele Kunden könnten Ihr Angebot bei der Auswahl gar nicht mehr berücksichtigen.",
  },
  adapt: {
    meaning:
      "Könnten Sie Ihr Angebot im gewählten Zeitfenster so verändern, dass es für Kunden attraktiv bleibt? Eine gute Idee allein reicht dafür nicht: Auch Mitarbeitende, Technik, Geld und Kunden müssten die Umstellung mittragen können.",
    low: "Eine passende Veränderung wäre innerhalb des Zeitfensters praktisch umsetzbar.",
    middle:
      "Eine Veränderung wäre möglich, aber wichtige Voraussetzungen oder Ressourcen wären noch offen.",
    high: "Selbst bei erkennbarem Handlungsbedarf könnten Sie die Veränderung nicht rechtzeitig umsetzen.",
  },
  opportunity: {
    meaning:
      "Dieselbe KI steht auch Ihnen zur Verfügung. Könnten Sie damit ein besseres Ergebnis, ein neues Angebot oder geringere Kosten erreichen – und einen Teil des Vorteils als zusätzlichen Ertrag behalten? Wenn alle nur ihre Preise senken, entsteht daraus noch kein eigener Mehrertrag.",
    low: "Sie sehen bisher keinen konkreten Ansatz für zusätzlichen Kundennutzen und Ertrag.",
    middle:
      "Es gäbe einen plausiblen Ansatz, aber Nachfrage oder Wirtschaftlichkeit wären noch unklar.",
    high: "Sie sehen einen konkreten, umsetzbaren Ansatz und einen klaren Grund, warum Kunden dafür bezahlen würden.",
  },
};

const EXAMPLES: Record<
  ScenarioContext["profile"],
  Record<ScenarioQuestionId, string>
> = {
  digital: {
    value:
      "Sie erstellen Vertriebspräsentationen. Wenn Kunden mit KI selbst brauchbare Folien erzeugen könnten, würden sie womöglich nur noch für Ihre fachliche Prüfung und Beratung bezahlen.",
    price:
      "Eine andere Agentur könnte vergleichbare Präsentationen mit KI deutlich günstiger anbieten. Sie müssten prüfen, ob Sie Ihren Preis halten oder mit einem niedrigeren Preis noch genug verdienen könnten.",
    access:
      "Ein Kunde bittet seinen Assistenten, eine Präsentationsagentur zu finden, und bekommt drei Vorschläge. Wenn Sie dabei fehlen, erhalten Sie keine Anfrage – selbst wenn Ihre Arbeit gut ist.",
    adapt:
      "Eine Agentur könnte künftig Prüfung und Beratung statt Folienerstellung verkaufen. Dafür müssten ihr Team, ihre Preise und ihre Kundenverträge rechtzeitig auf das neue Angebot umgestellt werden.",
    opportunity:
      "Eine Agentur könnte mit KI mehr Varianten testen und dadurch bessere Verkaufsmaterialien liefern. Ein eigener Ertrag entstünde, wenn Kunden den zusätzlichen Nutzen bezahlen oder die Einsparung im Unternehmen bliebe.",
  },
  mixed: {
    value:
      "Sie bieten Wartung samt Fehlerdiagnose vor Ort an. Wenn Kunden die Diagnose selbst mit KI erledigen könnten, würden sie womöglich nur noch die Reparatur bei Ihnen kaufen.",
    price:
      "Ein Wettbewerber könnte mit KI Diagnose und Einsatzplanung günstiger erledigen und seine Preise senken. Für Sie wäre entscheidend, ob Ihre eigenen Einsparungen mit dem Preisnachlass mithalten könnten.",
    access:
      "Ein Unternehmen könnte einen Assistenten nach Wartungsdiensten suchen lassen. Schlägt dieser nur drei Anbieter vor und Sie fehlen, bekämen Sie keine Anfrage – selbst bei guter Leistung.",
    adapt:
      "Ein Wartungsdienst könnte KI für Diagnose und Einsatzplanung einsetzen. Dafür müssten Daten verfügbar sein, Mitarbeitende geschult werden und Kunden die neue Arbeitsweise akzeptieren.",
    opportunity:
      "Ein Wartungsdienst könnte Ausfälle früher erkennen und unnötige Anfahrten vermeiden. Kunden könnten für verlässlichere Verfügbarkeit bezahlen; eingesparte Kosten könnten den eigenen Ertrag erhöhen.",
  },
  physical: {
    value:
      "Ein Kunde bezahlt Sie für passgenaue Bauteile. Wenn ein anderer Hersteller dank KI dieselbe Qualität verlässlicher liefern könnte, könnte der Kunde wechseln. Die körperliche Fertigung müsste dieser Anbieter weiterhin beherrschen.",
    price:
      "Ein Wettbewerber könnte mit KI weniger Ausschuss und kürzere Stillstände erreichen und günstiger anbieten. Ob Robotik zusätzlich hilft, hängt von den Annahmen des gewählten Szenarios ab.",
    access:
      "Ein Einkaufsteam könnte passende Hersteller durch einen Assistenten vorsortieren lassen. Wenn Ihr Angebot dort fehlt, würden Sie womöglich gar nicht erst um ein Angebot gebeten.",
    adapt:
      "Ein Betrieb könnte seine Abläufe stärker automatisieren wollen. Maschinenbeschaffung, Umbau, Schulung und laufende Lieferpflichten könnten die Umsetzung über das gewählte Zeitfenster hinaus verzögern.",
    opportunity:
      "Ein Hersteller könnte mit KI weniger Material verschwenden oder schneller auf Sonderwünsche reagieren. Der Vorteil würde zum eigenen Ertrag, wenn die Einsparung bleibt oder Kunden für die bessere Leistung mehr bezahlen.",
  },
};

export function scenarioGuidance(
  id: ScenarioQuestionId,
  profile: ScenarioContext["profile"],
  version = "scenario-stress-2.0",
) {
  if (version === "scenario-stress-2.0")
    return expertScenarioGuidance(id, profile);
  return { ...GUIDANCE[id], example: EXAMPLES[profile][id] };
}
