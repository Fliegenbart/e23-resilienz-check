import type { Assessment, AssessmentContent, Revision } from "../domain/types";
import { METHOD, APP_VERSION } from "../methodology/config";
import {
  evidenceStatus,
  evaluate,
  protectionIsCurrent,
} from "../rules/evaluate";
import { calculate } from "../scenarios/finance";
import { safeUrl } from "./exchange";
export const RECOMMENDATIONS = {
  develop: "Weiterentwickeln",
  validate: "Gezielt validieren",
  reorient: "Neu ausrichten",
  pause: "Vorläufig pausieren",
  open: "Noch offen",
};
const esc = (value: unknown) =>
  String(value ?? "Offen")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/[\[\]`]/g, "\\$&");
const txt = (v: unknown): string => {
  if (v === null || v === undefined || v === "") return "Offen";
  if (typeof v === "number")
    return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 4 }).format(
      v,
    );
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}(T[0-9:.+Z-]+)?$/.test(v)) {
    const parsed = new Date(v.length === 10 ? v + "T12:00:00Z" : v);
    if (Number.isFinite(parsed.getTime()))
      return new Intl.DateTimeFormat("de-DE", {
        timeZone: "Europe/Berlin",
      }).format(parsed);
  }
  return esc(v);
};
const line = (k: string, v: unknown) => `**${k}:** ${txt(v)}\n`;
const labels: Record<string, string> = {
  low: "Niedrig",
  medium: "Mittel",
  high: "Hoch",
  unanswered: "Nicht bearbeitet",
  unknown: "Unbekannt",
  not_applicable: "Nicht anwendbar",
  assumption: "Annahme",
  indication: "Hinweis",
  substantiated: "Geprüfter Beleg",
  observed: "Beobachteter Befund",
  hypothesis: "Zu prüfende Hypothese",
  missing_information: "Offene Information",
  supports: "unterstützt",
  contradicts: "widerspricht",
  context: "Kontext",
  open: "Offen",
  worked: "Bearbeitet",
  in_progress: "In Arbeit",
  done: "Erledigt",
  cancelled: "Abgebrochen",
  unreviewed: "Ungeprüft",
  reviewed: "Geprüft",
  needs_review: "Erneut zu prüfen",
};
export const label = (v: string | null) => (v ? (labels[v] ?? v) : "Offen");
export function reportMarkdown(original: Assessment, revision?: Revision) {
  const a: Assessment = revision
    ? {
        ...original,
        content: revision.content,
        methodologyVersion: revision.methodologyVersion,
        methodologySnapshot: revision.methodologySnapshot,
        evaluationAsOf: revision.evaluationAsOf,
      }
    : original;
  const c = a.content;
  const known = a.methodologyVersion === METHOD.version;
  const method = a.methodologySnapshot;
  const findings = revision
    ? revision.derivedFindingsSnapshot
    : known
      ? evaluate(a, a.evaluationAsOf)
      : [];
  const links = (
    ls: { evidenceId: string; relation: string; explanation: string }[],
  ) =>
    ls.length
      ? ls
          .map(
            (l) =>
              `${l.evidenceId} — ${label(l.relation)}: ${txt(l.explanation)}`,
          )
          .join("\n")
      : "Keine Quellen zugeordnet.";
  let s = `# ${txt(c.title)}\n\n${a.isExample ? "**Fiktives Beispiel — ausschließlich synthetische Daten.**\n\n" : ""}${revision ? `Historischer Stand ${revision.revisionNumber}, fachlich durchgesehen von ${txt(revision.createdBy)} am ${txt(revision.createdAt)}.` : a.status === "reviewed" ? "Fachlich durchgesehener Arbeitsstand. Offene Punkte bleiben bestehen." : "Vorläufiger Arbeitsstand."}\n\n## Managementübersicht\n\n`;
  s +=
    line("Kunde / Alias", c.customerAlias) +
    line("Typ", c.type === "idea" ? "Neue Idee" : "Bestehendes Geschäft") +
    line("Entscheidungsfrage", c.decisionQuestion) +
    line("Planungshorizont", `${c.horizonMonths} Monate`) +
    line("Auswertungsstichtag", a.evaluationAsOf) +
    line("Wichtigste Bedrohung", c.executiveSummary.mainThreat) +
    line(
      "Wichtigster belegter Vorteil",
      c.executiveSummary.evidencedAdvantage,
    ) +
    line("Entscheidende offene Frage", c.executiveSummary.keyUnknown) +
    line(
      "Kritische Betriebslücken",
      findings
        .filter((f) => f.ruleId === "R10")
        .map((f) => `${f.triggerQuestionIds.join(", ")}: ${f.title}`)
        .join("; ") ||
        "Keine als kritisch markierte niedrige D-Bewertung erfasst. Offene und ungeprüfte Punkte bleiben im Anhang sichtbar.",
    ) +
    line(
      "Offene Grundlagen",
      known
        ? Object.entries(c.answers)
            .filter(
              ([id, ans]) =>
                ans.state === "unanswered" ||
                ans.state === "unknown" ||
                evidenceStatus(a, id as any, a.evaluationAsOf).conflict ||
                evidenceStatus(a, id as any, a.evaluationAsOf).stale,
            )
            .map(([id]) => id)
            .join(", ") ||
            "Keine als unbekannt, unbearbeitet oder strittig erfassten Antworten; Beleglage im Anhang beachten."
        : "Unbekannte Methodenversion; keine neue Bewertung.",
    ) +
    line("Empfehlung", RECOMMENDATIONS[c.decision.recommendation]) +
    line("Begründung", c.decision.rationale) +
    line("Bedingungen und Grenzen", c.decision.conditions) +
    line("Vorläufig", c.decision.provisional ? "Ja" : "Nein") +
    line("Abweichende Empfehlung", c.decision.dissent) +
    line("Entscheidung durch", c.decision.decidedBy) +
    line("Entscheidungsdatum", c.decision.decidedAt) +
    line("Nächste Überprüfung", c.decision.reviewDueAt);
  s += "\n### Drei nächste Schritte\n\n";
  const priority = c.executiveSummary.priorityActionIds
    .map((id) => c.actions.find((x) => x.id === id))
    .filter(Boolean);
  const acts = priority.length
    ? priority
    : c.actions.filter((x) => x.status !== "done" && x.status !== "cancelled");
  s +=
    acts
      .slice(0, 3)
      .map((x) => `${txt(x!.title)} — ${txt(x!.owner)} — ${txt(x!.dueAt)}\n`)
      .join("\n") || "Noch keine Maßnahmen festgelegt.\n";
  s += "\n## Vollständiger Anhang\n\n### Fallprofil\n\n";
  const profile: Partial<Record<keyof AssessmentContent, string>> = {
    customerSegment: "Zielkundengruppe",
    user: "Nutzer",
    economicBuyer: "Wirtschaftlicher Käufer",
    customerProblem: "Kundenproblem",
    currentAlternative: "Bisherige Alternative",
    paidOutcome: "Bezahltes Ergebnis",
    revenueModel: "Erlösmodell",
    costDescription: "Kostenarten",
    marketContext: "Markt / Einsatzkontext",
    excludedScope: "Untersuchungsgrenzen",
    owner: "Verantwortlicher",
  };
  for (const [k, v] of Object.entries(profile))
    s += line(v, c[k as keyof AssessmentContent]);
  s += line("Beteiligte", c.participants.join(", "));
  s += "\n### Wertschöpfung\n\n";
  for (const v of c.valueSteps)
    s +=
      `#### ${txt(v.title)}\n\n` +
      line("Kundenwert", v.customerValue) +
      line("Ressourcen / Rechte", v.requiredResources) +
      line("KI heute", v.currentAIUse) +
      line("Alternative", v.alternative) +
      line("Kritisch", v.critical ? "Ja" : "Nein") +
      line("Offene Fragen", v.openQuestions);
  s += "\n### Sämtliche Fragen und Beleglage\n\n";
  if (!method)
    s +=
      "Methodensnapshot fehlt. Keine aktuellen Fragetexte unter alte Antworten gesetzt. Rohdaten sind in der Anwendung und im JSON-Export verfügbar.\n";
  else
    for (const q of method.questions) {
      const ans = c.answers[q.id];
      if (!ans) continue;
      const st = known ? evidenceStatus(a, q.id, a.evaluationAsOf) : null;
      s +=
        `#### ${q.id} — ${txt(q.text)}\n\n` +
        line("Antwort", label(ans.state === "rated" ? ans.rating : ans.state)) +
        line("Gewählter Anker", ans.rating ? q.anchors[ans.rating] : "Offen") +
        line("Begründung", ans.rationale) +
        line("Gewählte Belegstufe", label(ans.evidenceLevel)) +
        line(
          "Aktueller Belegstatus",
          st?.label ?? "Unbekannte Methode; keine Neuberechnung",
        ) +
        line("Geltungsbereich", ans.scope) +
        line("Offene Prüfung", ans.openCheck) +
        line("Entscheidungsrelevant", ans.criticalForDecision ? "Ja" : "Nein") +
        line("Betroffene Schritte", ans.valueStepIds.join(", ")) +
        line("Nichtanwendbarkeit", ans.notApplicableReason) +
        line("Bewertende Person", ans.assessedBy) +
        line("Bewertungsdatum", ans.assessedAt) +
        line("Antwortversion", ans.revision) +
        line(
          "Aussage geprüft durch / am",
          ans.substantiationReview
            ? `${ans.substantiationReview.reviewedBy} / ${ans.substantiationReview.reviewedAt}; Antwortversion ${ans.substantiationReview.subjectRevision}`
            : "Noch nicht bestätigt",
        ) +
        line("Quellen", links(ans.evidenceLinks));
      for (const p of ans.positions)
        s += line(
          "Abweichende Position",
          `${p.person}: ${label(p.rating)} — ${p.rationale}; ${links(p.evidenceLinks)}`,
        );
      if (ans.conflictResolution)
        s += line(
          "Dokumentierte Konfliktauflösung",
          `${ans.conflictResolution.rationale}; ${ans.conflictResolution.review.reviewedBy}, ${ans.conflictResolution.review.reviewedAt}${st?.conflict ? " — erneut zu prüfen" : ""}`,
        );
    }
  s += "\n### Bedrohungen und Schutzwirkung\n\n";
  for (const t of c.threats)
    s +=
      `#### ${txt(t.actor)} — ${txt(t.change)}\n\n` +
      line("ID / Version", `${t.id} / ${t.revision}`) +
      line("Kategorie", t.category) +
      line(
        "Grundlage",
        t.basis === "observed"
          ? "Als Beobachtung dokumentiert; Quellenprüfung beachten"
          : "Szenarioannahme",
      ) +
      line("Wirkungsweg", t.economicMechanism) +
      line(
        "Fragen / Schritte",
        [...t.questionIds, ...t.valueStepIds].join(", "),
      ) +
      line("Quellen", links(t.evidenceLinks));
  for (const p of c.protections)
    s += line(
      "Schutzwirkung",
      `${p.questionId} → ${p.threatId}: ${p.mechanism}; Grenzen: ${p.limitations}; ${known && protectionIsCurrent(a, p, a.evaluationAsOf) ? "Aktuell belegt" : "Nicht aktuell belegt"}; ${links(p.evidenceLinks)}`,
    );
  s += "\n### Hinweise und Umgang mit ihnen\n\n";
  for (const f of findings)
    s +=
      `#### ${f.findingId} — ${txt(f.title)}\n\n` +
      line("Art", label(f.kind)) +
      line("Auslöser und Grundlage", f.rationale) +
      line("Quellen", f.evidenceIds.join(", ")) +
      line("Bedrohungen", f.threatIds.join(", ")) +
      line("Nächster Prüfschritt", f.suggestedCheck) +
      line(
        "Umgang mit Hinweis",
        c.decision.findingResponses.find((r) => r.findingId === f.findingId)
          ?.response ?? "Noch offen",
      );
  if (!known && !revision)
    s +=
      "Unbekannte Methodenversion: aktuelle Hinweise werden nicht neu berechnet.\n";
  s += "\n### Wirtschaftliche Ausgangslage\n\n";
  if (c.baseline) {
    s +=
      line("Währung / Zeitraum", `${c.baseline.currency} / Monat`) +
      line("Umsatz", c.baseline.revenue) +
      line("Variable Kosten", c.baseline.variableCosts) +
      line("Fixkosten", c.baseline.fixedCosts) +
      line("Herkunft und Annahmen", c.baseline.sourceNote) +
      line("Vereinfachtes Monatsergebnis", calculate(c.baseline, null).E0);
  } else s += "Keine Finanzwerte erfasst; keine Nullannahme.\n";
  s += "\n### Szenarien\n\n";
  for (const sc of c.scenarios) {
    s +=
      `#### ${txt(sc.title)}\n\n` +
      line("Status", label(sc.status)) +
      line("Nichtanwendbarkeit", sc.notApplicableReason) +
      line("Annahme", sc.assumption) +
      line("Horizont", `${sc.horizonMonths} Monate`) +
      line(
        "Kunden / Erlösbestandteile",
        `${sc.affectedCustomers || "Offen"}; ${sc.affectedRevenueParts || "Offen"}`,
      ) +
      line("Schritte", sc.valueStepIds.join(", ")) +
      line("Wirkungsweg / Kundenreaktion", sc.customerReaction) +
      line("Verbleibender bezahlter Nutzen", sc.remainingPaidValue) +
      line("Reaktion", sc.response) +
      line("Zeit und Ressourcen", sc.timeAndResourceNeeds) +
      line("Frühindikator", sc.earlyIndicator) +
      line("Offene Fragen", sc.openQuestions) +
      line("Prüfschritt", sc.nextCheck) +
      line(
        "Verantwortlicher / Termin",
        `${sc.owner || "Offen"} / ${sc.dueAt || "Offen"}`,
      ) +
      line("Quellen", links(sc.evidenceLinks));
    if (sc.financialStress) {
      const fs = sc.financialStress,
        r = calculate(c.baseline, fs);
      s +=
        line(
          "Änderung von Preis / Menge / variablen Stückkosten",
          [fs.priceChange, fs.volumeChange, fs.unitVariableCostChange]
            .map((v) => (v === null ? "Offen" : `${txt(v * 100)} %`))
            .join(" / "),
        ) +
        line("Fixkostenänderung", fs.fixedCostDelta) +
        line("Einmalige Kosten (separat)", fs.oneOffCost) +
        line(
          "Modell geeignet",
          fs.modelApplicable === null
            ? "Ungeprüft"
            : fs.modelApplicable
              ? "Ja"
              : "Nein",
        ) +
        line("Annahmen", fs.assumptionNote) +
        line(
          "Szenarioergebnis / Veränderung",
          `${txt(r.E1)} / ${txt(r.delta)}`,
        ) +
        line(
          "Rechenhinweise",
          r.errors.join("; ") ||
            "Vereinfachtes proportionales Monatsmodell; keine vollständige Finanzplanung.",
        );
    }
  }
  s += "\n### Vollständiger Maßnahmenplan\n\n";
  for (const ac of c.actions)
    s +=
      `#### ${txt(ac.title)}\n\n` +
      line("Tätigkeit", ac.description) +
      line("Erwarteter Nachweis", ac.expectedEvidence) +
      line("Verantwortlicher", ac.owner) +
      line("Termin", ac.dueAt) +
      line("Status", label(ac.status)) +
      line("Aufwand", ac.effortNote) +
      line(
        "Bezüge",
        [
          ...ac.linkedQuestionIds,
          ...ac.linkedRuleIds,
          ...ac.linkedFindingIds,
          ...ac.linkedThreatIds,
          ...ac.linkedScenarioIds,
        ].join(", "),
      );
  s += "\n### Vollständiges Quellenverzeichnis\n\n";
  for (const e of c.evidence)
    s +=
      `#### ${txt(e.title)}${e.synthetic ? " — Synthetische Beispielquelle" : ""}\n\n` +
      line("ID / Version", `${e.id} / ${e.revision}`) +
      line("Art", e.kind) +
      line("Herkunft", e.authorOrOrigin) +
      line(
        "Referenz",
        safeUrl(e.url) ??
          e.internalReference ??
          (e.url ? "Unzulässiges URL-Protokoll — Link deaktiviert" : "Offen"),
      ) +
      line("Beobachtung", e.observation) +
      line("Erhebungsdatum", e.eventDate) +
      line("Erfasst", e.recordedAt) +
      line("Prüfstatus", label(e.reviewStatus)) +
      line(
        "Geprüft durch / am",
        `${e.reviewedBy || "Offen"} / ${e.reviewedAt || "Offen"}`,
      ) +
      line("Geprüfte Quellenversion", e.reviewedRevision) +
      line("Erneute Prüfung bis", e.reviewDueAt) +
      line("Geltungsbereich und Grenzen", e.scopeAndLimitations);
  s +=
    "\n## Methode und Versionsstand\n\n" +
    line("Methodenversion", a.methodologyVersion) +
    line("Appversion", APP_VERSION) +
    line("Fall / Schemaversion", `${a.id} / ${a.schemaVersion}`) +
    line(
      "Historischer Stand",
      revision?.revisionNumber ?? "Aktueller Entwurf",
    ) +
    line("Auswertungsstichtag", a.evaluationAsOf) +
    line("Einordnung", method?.notes ?? "Methodensnapshot fehlt") +
    "\nDie Methode ist ein zunächst zu erprobender Beratungsentwurf. Sie liefert keine Überlebenswahrscheinlichkeit und keinen universellen Resilienzscore. Fachlicher Review ist keine Prognosegarantie. Die lokale Historie ist nicht manipulationssicher.\n";
  return s;
}
