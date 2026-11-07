import { createCheck, answerCheck } from "../../src/quick/model";
import type { BusinessAnalysisResult } from "../../src/quick/business-analysis";

export function businessCheck() {
  const check = createCheck("existing");
  check.businessDescription =
    "Wir prüfen Lieferantendokumente für kleine Hersteller. Wir haften für das geprüfte Ergebnis.";
  check.methodologySnapshot.forEach((q) => answerCheck(check, q.id, 8));
  check.view = "results";
  return check;
}

export const analysisResult: BusinessAnalysisResult = {
  headline: "Die Dokumentenprüfung ist angreifbar.",
  summary:
    "KI könnte Dokumente vorprüfen. Ihre verbindliche Ergebniszusage könnte weiter bezahlt werden.",
  takeover: [
    {
      title: "Dokumente vorprüfen",
      detail:
        "Ein Agent könnte Lieferantendokumente lesen und fehlende Angaben markieren.",
      basisQuote: "Wir prüfen Lieferantendokumente",
      questions: ["Q1", "Q2"],
    },
  ],
  protection: [
    {
      title: "Für das Ergebnis einstehen",
      detail:
        "Ihre Haftung kann wichtig bleiben, wenn der Hersteller diese Zusage braucht und bezahlt.",
      basisQuote: "Wir haften für das geprüfte Ergebnis.",
      questions: ["Q8", "Q12"],
    },
  ],
  opportunity: {
    title: "Mehr Prüfungen schaffen",
    detail:
      "KI könnte die Vorprüfung beschleunigen, während Sie das Ergebnis verantworten.",
    basisQuote: null,
    questions: ["Q11"],
  },
  nextStep: {
    title: "Zehn Dokumente vergleichen",
    detail:
      "Prüfen Sie dieselben zehn Dokumente mit und ohne Ihr Angebot. Lassen Sie einen Kunden Qualität und Zusage bewerten.",
    basisQuote: null,
    questions: ["Q12"],
  },
  openQuestions: ["Welche Fehler deckt Ihre Haftungszusage tatsächlich ab?"],
};
