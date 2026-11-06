import type {
  Assessment,
  Answer,
  Evidence,
  ProtectionLink,
  QuestionId,
  ReviewStamp,
  RuleFinding,
} from "../domain/types";
export function sourceCurrent(
  e: Evidence | undefined,
  asOf: string,
  isExample: boolean,
) {
  return (
    !!e &&
    (!e.synthetic || isExample) &&
    e.reviewStatus === "reviewed" &&
    e.reviewedRevision === e.revision &&
    !!e.reviewedBy?.trim() &&
    !!e.reviewedAt &&
    !!(e.url || e.internalReference) &&
    !!e.observation.trim() &&
    (!e.reviewDueAt || e.reviewDueAt.slice(0, 10) >= asOf.slice(0, 10))
  );
}
function allLinks(ans: Answer) {
  return [
    ...ans.evidenceLinks,
    ...ans.positions.flatMap((p) => p.evidenceLinks),
  ];
}
function stampCurrent(
  a: Assessment,
  s: ReviewStamp | null,
  revision: number,
  links: { evidenceId: string }[],
) {
  return (
    !!s &&
    s.subjectRevision === revision &&
    !!s.reviewedBy.trim() &&
    !!s.reviewedAt &&
    links.every(
      (l) =>
        s.evidenceRevisions[l.evidenceId] ===
        a.content.evidence.find((e) => e.id === l.evidenceId)?.revision,
    ) &&
    Object.keys(s.evidenceRevisions).every((id) =>
      links.some((l) => l.evidenceId === id),
    )
  );
}
export function evidenceStatus(a: Assessment, id: QuestionId, asOf: string) {
  const ans = a.content.answers[id],
    links = allLinks(ans);
  const hasDisagreement =
    ans.disputed ||
    ans.positions.some((p) => p.rating !== ans.rating) ||
    links.some((l) => l.relation === "contradicts");
  const conflict =
    hasDisagreement &&
    !(
      ans.conflictResolution?.rationale.trim() &&
      stampCurrent(a, ans.conflictResolution.review, ans.revision, links)
    );
  const stale = links.some((l) => {
    const e = a.content.evidence.find((e) => e.id === l.evidenceId);
    return (
      !e ||
      e.reviewStatus === "needs_review" ||
      (!!e.reviewDueAt && e.reviewDueAt.slice(0, 10) < asOf.slice(0, 10))
    );
  });
  const support = ans.evidenceLinks.some(
    (l) =>
      l.relation === "supports" &&
      l.explanation.trim() &&
      sourceCurrent(
        a.content.evidence.find((e) => e.id === l.evidenceId),
        asOf,
        a.isExample,
      ),
  );
  const substantiated =
    ans.state === "rated" &&
    !!ans.rating &&
    !!ans.rationale.trim() &&
    ans.evidenceLevel === "substantiated" &&
    support &&
    !stale &&
    !conflict &&
    stampCurrent(a, ans.substantiationReview, ans.revision, links);
  return {
    substantiated,
    conflict,
    stale,
    label: conflict
      ? "Widerspruch offen"
      : stale
        ? "Erneut zu prüfen"
        : substantiated
          ? "Aktuell belegt"
          : ans.state === "unknown"
            ? "Unbekannt"
            : ans.state === "unanswered"
              ? "Nicht bearbeitet"
              : ans.state === "not_applicable"
                ? "Nicht anwendbar"
                : "Nicht ausreichend belegt",
  };
}
export function protectionIsCurrent(
  a: Assessment,
  p: ProtectionLink,
  asOf: string,
) {
  const ans = a.content.answers[p.questionId],
    t = a.content.threats.find((t) => t.id === p.threatId);
  return (
    p.questionId.startsWith("C") &&
    !!ans &&
    ans.rating === "high" &&
    evidenceStatus(a, p.questionId, asOf).substantiated &&
    !!t &&
    !!p.mechanism.trim() &&
    p.reviewedAnswerRevision === ans.revision &&
    p.reviewedThreatRevision === t.revision &&
    stampCurrent(a, p.review, p.revision, p.evidenceLinks) &&
    p.evidenceLinks.some(
      (l) =>
        l.relation === "supports" &&
        l.explanation.trim() &&
        sourceCurrent(
          a.content.evidence.find((e) => e.id === l.evidenceId),
          asOf,
          a.isExample,
        ),
    ) &&
    p.evidenceLinks.every(
      (l) =>
        l.relation !== "contradicts" &&
        sourceCurrent(
          a.content.evidence.find((e) => e.id === l.evidenceId),
          asOf,
          a.isExample,
        ),
    )
  );
}
export function evaluate(a: Assessment, asOf: string): RuleFinding[] {
  const out: RuleFinding[] = [];
  const answers = a.content.answers;
  const st = (id: QuestionId) => evidenceStatus(a, id, asOf);
  const rated = (id: QuestionId, rating: string) =>
    answers[id].state === "rated" && answers[id].rating === rating;
  const open = (id: QuestionId) =>
    ["unanswered", "unknown"].includes(answers[id].state);
  const add = (
    ruleId: string,
    ids: QuestionId[],
    title: string,
    check: string,
    threatIds: string[] = [],
    force?: RuleFinding["kind"],
  ) => {
    out.push({
      findingId: [ruleId, ...ids, ...threatIds].join(":"),
      ruleId,
      kind:
        force ??
        (ids.every((id) => st(id).substantiated)
          ? "observed"
          : ids.some(open)
            ? "missing_information"
            : "hypothesis"),
      title,
      rationale: ids
        .map(
          (id) =>
            `${id}: ${({ low: "Niedrig", medium: "Mittel", high: "Hoch", unanswered: "Nicht bearbeitet", unknown: "Unbekannt", not_applicable: "Nicht anwendbar" } as Record<string, string>)[(answers[id].state === "rated" ? answers[id].rating : answers[id].state) ?? ""]}; ${st(id).label}. ${answers[id].rationale}`,
        )
        .join("\n"),
      triggerQuestionIds: ids,
      threatIds,
      evidenceIds: [
        ...new Set(
          ids.flatMap((id) => allLinks(answers[id]).map((l) => l.evidenceId)),
        ),
      ],
      suggestedCheck: check,
    });
  };
  for (const id of ["A1", "A2"] as QuestionId[])
    if (!st(id).substantiated)
      add(
        "R01",
        [id],
        "Kundenbedarf oder Zahlungsbereitschaft validieren",
        "Problem, Käufer und Kaufnachweis anhand konkreter Kundenaufgaben prüfen.",
      );
  if (open("A4") || rated("A4", "medium") || !st("A4").substantiated)
    add(
      "R02",
      ["A4"],
      "Wirtschaftliche Annahmen prüfen",
      "Erlös, Vertrieb, Betreuung, Qualitätssicherung und Einführung berücksichtigen.",
    );
  if (rated("B1", "high") && rated("B4", "high")) {
    add(
      "R03",
      ["B1", "B4"],
      "Kernleistung unter den untersuchten Bedingungen stark austauschbar",
      "Gesamten relevanten Arbeitsablauf einschließlich Nacharbeit vergleichen.",
    );
    const ts = a.content.threats.filter((t) =>
      t.questionIds.some((id) => id === "B1" || id === "B4"),
    );
    if (!ts.length)
      add(
        "R06",
        ["B1", "B4"],
        "Betroffene Bedrohung zuordnen",
        "Eine konkrete Bedrohung mit B1/B4 verknüpfen.",
        [],
        "missing_information",
      );
    for (const t of ts)
      if (
        !a.content.protections.some(
          (p) => p.threatId === t.id && protectionIsCurrent(a, p, asOf),
        )
      )
        add(
          "R06",
          ["B1", "B4"],
          "Schutzwirkung gegenüber dieser Bedrohung ist offen",
          "Konkreten Wirkungsmechanismus prüfen und belegen.",
          [t.id],
          "missing_information",
        );
  }
  if (rated("B2", "high"))
    add(
      "R04",
      ["B2"],
      "Abhängigkeit von einer Modellschwäche",
      "Konkrete Schwäche und verbleibenden Kundennutzen benennen.",
    );
  if (rated("B3", "high"))
    add(
      "R05",
      ["B3"],
      "Konkrete Plattformnähe",
      "Bündelungsszenario und tatsächliches Kundenverhalten prüfen.",
    );
  if (
    rated("B1", "high") &&
    rated("B4", "high") &&
    rated("A3", "low") &&
    rated("A4", "low") &&
    (["B1", "B4", "A3", "A4"] as QuestionId[]).every(
      (id) => st(id).substantiated,
    )
  )
    add(
      "R07",
      ["B1", "B4", "A3", "A4"],
      "Neuausrichtung oder Begrenzung weiterer Investitionen prüfen",
      "Menschliche Entscheidung über Leistungsumfang, Kundengruppe oder Betriebsmodell vorbereiten.",
    );
  for (const id of Object.keys(answers).filter(
    (id) => id[0] === "C",
  ) as QuestionId[])
    if (rated(id, "high")) {
      if (!st(id).substantiated)
        add(
          "R08",
          [id],
          "Möglicher Vorteil ist unbestätigt",
          "Rechte, Relevanz, Ergebnisvorteil und Ersatzmöglichkeiten prüfen.",
        );
      else if (
        !a.content.protections.some(
          (p) => p.questionId === id && protectionIsCurrent(a, p, asOf),
        )
      )
        add(
          "R09",
          [id],
          "Konkrete Schutzwirkung noch offen",
          "Vorteil mit einer Bedrohung verknüpfen und Wirkung gesondert prüfen.",
          [],
          "missing_information",
        );
    }
  for (const id of Object.keys(answers).filter(
    (id) => id[0] === "D",
  ) as QuestionId[])
    if (answers[id].criticalForDecision && rated(id, "low"))
      add(
        "R10",
        [id],
        "Kritische Betriebsvoraussetzung ungeklärt",
        "Konkrete Betriebslücke vor dem betroffenen Einsatz prüfen.",
      );
  for (const id of ["D2", "D5"] as QuestionId[])
    if (rated(id, "medium"))
      add(
        "R11",
        [id],
        "Alternative oder Ausweichverfahren erproben",
        "Qualität, Kosten, Umstellung und gemeinsame Abhängigkeiten praktisch testen.",
      );
  if (rated("D6", "low") || open("D6"))
    add(
      "R12",
      ["D6"],
      "Anpassungsfähigkeit klären",
      "Verantwortung, Ressourcen und zeitlichen Handlungsspielraum dokumentieren.",
    );
  for (const id of Object.keys(answers) as QuestionId[])
    if (st(id).conflict || st(id).stale)
      add(
        "R13",
        [id],
        st(id).conflict
          ? "Widerspruch bleibt offen"
          : "Quellenaktualität erneut prüfen",
        "Betroffene Quellenstände prüfen und Entscheidung begründen.",
        [],
        "missing_information",
      );
  if (!Object.values(answers).some((ans) => ans.state === "rated"))
    add(
      "R14",
      [],
      "Noch nicht beurteilbar",
      "Inhaltliche Bewertungen und ihre Grundlagen dokumentieren.",
      [],
      "missing_information",
    );
  for (const id of ["A1", "A2"] as QuestionId[])
    if (rated(id, "low"))
      add(
        "R15",
        [id],
        st(id).substantiated
          ? "Negative Evidenz zu Kundenbedarf oder Zahlungsbereitschaft"
          : "Negative Einschätzung zu Kundenbedarf oder Zahlungsbereitschaft prüfen",
        "Reichweite und Grenzen der Beobachtung klären.",
      );
  if (rated("A4", "low"))
    add(
      "R16",
      ["A4"],
      st("A4").substantiated
        ? "Wirtschaftlichkeit unter dokumentierten Bedingungen nicht tragfähig"
        : "Nicht tragfähige Wirtschaftlichkeit als Hypothese",
      "Kosten, Erlösmodell oder Leistungsumfang überprüfen.",
    );
  return out;
}
