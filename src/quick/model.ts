import { z } from "zod";
export const QUICK_METHOD = "quick-check-1.0";
export const QUICK_SCHEMA = "1.0";
export type GroupId = "value" | "competition" | "advantage" | "control";
export type QuickAnswer = number | "unknown" | null;
export interface QuickQuestion {
  id: string;
  group: GroupId;
  text: string;
  low: string;
  high: string;
  help: string;
  action: string;
  actionDetail: string;
}
export const QUICK_GROUPS: { id: GroupId; title: string; short: string }[] = [
  { id: "value", title: "Kundenwert", short: "Kundenwert" },
  { id: "competition", title: "Wettbewerb", short: "Wettbewerb" },
  { id: "advantage", title: "Differenzierung", short: "Vorteile" },
  { id: "control", title: "Handlungsfähigkeit", short: "Handlung" },
];
export const QUICK_QUESTIONS: QuickQuestion[] = [
  {
    id: "Q1",
    group: "value",
    text: "Wie unsicher ist der Bedarf für Ihr Angebot?",
    low: "Wiederkehrender Bedarf belegt",
    high: "Bedarf bisher nur vermutet",
    help: "Denken Sie an ein konkretes Angebot für eine bestimmte Kundengruppe. Wählen Sie für jeden weiteren Check ein eigenes Angebot.",
    action: "Den Kundenbedarf absichern",
    actionDetail:
      "Sprechen Sie mit konkreten Käufern über die Aufgabe, ihre heutige Alternative und die Folgen eines ungelösten Problems.",
  },
  {
    id: "Q2",
    group: "value",
    text: "Wie stark ist die Zahlungsbereitschaft noch eine Annahme?",
    low: "Bezahlte Aufträge oder Verlängerungen",
    high: "Bisher kein Kaufnachweis",
    help: "Interesse ist ein erster Hinweis. Ein bezahlter Pilot, Auftrag oder eine Verlängerung gibt eine belastbarere Grundlage.",
    action: "Zahlungsbereitschaft überprüfen",
    actionDetail:
      "Testen Sie einen klar abgegrenzten bezahlten Pilot und dokumentieren Sie die tatsächliche Kaufentscheidung.",
  },
  {
    id: "Q3",
    group: "value",
    text: "Wie groß ist das Risiko, dass sich Ihr Angebot nicht rechnet?",
    low: "Kosten und Erlöse belastbar",
    high: "Zentrale Annahmen offen",
    help: "Berücksichtigen Sie neben KI-Kosten auch Vertrieb, Einführung, Betreuung, Prüfung und Nacharbeit.",
    action: "Die Wirtschaftlichkeit konkret rechnen",
    actionDetail:
      "Stellen Sie realistische Erlöse den vollständigen Kosten einschließlich Vertrieb, Betreuung und Qualitätssicherung gegenüber.",
  },
  {
    id: "Q4",
    group: "competition",
    text: "Wie leicht kann KI Ihre bezahlte Kernleistung ersetzen?",
    low: "Überwiegend Randaufgaben",
    high: "Weitgehend gleichwertige Kernleistung",
    help: "Vergleichen Sie das vollständige bezahlte Ergebnis – einschließlich Fehlern, Prüfung, Ausführung und Nacharbeit.",
    action: "Die Kernleistung gegen KI vergleichen",
    actionDetail:
      "Testen Sie verfügbare KI an repräsentativen Kundenaufgaben und vergleichen Sie das vollständige nutzbare Ergebnis.",
  },
  {
    id: "Q5",
    group: "competition",
    text: "Wie leicht könnte eine Plattform Ihre Kernleistung mitliefern?",
    low: "Kaum passende Bündelung erkennbar",
    high: "Vergleichbare Funktion verfügbar",
    help: "Denken Sie an die Plattformen, die Ihre Kunden bereits nutzen. Welche Leistung müssten sie dann noch separat kaufen?",
    action: "Den bezahlten Nutzen schärfen",
    actionDetail:
      "Benennen und testen Sie, welchen zusätzlichen Nutzen Kunden auch bei einer gebündelten Standardfunktion weiterhin bezahlen würden.",
  },
  {
    id: "Q6",
    group: "competition",
    text: "Wie leicht könnten Kunden wechseln oder es selbst erledigen?",
    low: "Konkrete erhebliche Wechselhürden",
    high: "Alternative unmittelbar einsetzbar",
    help: "Betrachten Sie Migration, Qualität, Schulung und organisatorische Umstellung – nicht nur den Kündigungsklick.",
    action: "Den tatsächlichen Wechselaufwand prüfen",
    actionDetail:
      "Prüfen Sie mit einem Kunden, wie gut die beste Alternative funktioniert und welcher reale Umstellungsaufwand entsteht.",
  },
  {
    id: "Q7",
    group: "advantage",
    text: "Wie leicht lässt sich Ihr besonderer Kundennutzen nachbauen?",
    low: "Schwer reproduzierbarer Vorsprung",
    high: "Mit Standardmitteln reproduzierbar",
    help: "Eigene Daten oder Fachwissen helfen nur, wenn sie einen relevanten Ergebnisvorteil erzeugen und schwer ersetzbar sind.",
    action: "Den eigenen Vorsprung belegen",
    actionDetail:
      "Vergleichen Sie das Ergebnis mit und ohne Ihre besonderen Daten, Erfahrungen oder Zugänge und prüfen Sie Ersatzmöglichkeiten.",
  },
  {
    id: "Q8",
    group: "advantage",
    text: "Wie ähnlich ist Ihr Ergebnis dem einer Standardlösung?",
    low: "Relevanter Mehrwert gezeigt",
    high: "Kein relevanter Unterschied",
    help: "Maßstab ist die beste für den Kunden zugängliche Alternative. Dazu zählen auch Eigenleistung und nichts zu verändern.",
    action: "Die Differenzierung sichtbar machen",
    actionDetail:
      "Messen Sie den zusätzlichen Nutzen gegenüber der besten zugänglichen Alternative bei Zeit, Qualität, Kosten oder Ergebnis.",
  },
  {
    id: "Q9",
    group: "advantage",
    text: "Wie leicht erreicht ein neuer Wettbewerber Ihre Käufer?",
    low: "Zugang schwer aufzubauen",
    high: "Vergleichbarer Zugang verfügbar",
    help: "Wiederkehrende Käufe und schwer reproduzierbare Beziehungen sind aussagekräftiger als eine bloße Kundenliste.",
    action: "Den Kundenzugang stärken",
    actionDetail:
      "Untersuchen Sie, warum Käufer wiederkommen und welche Beziehungen oder Vertriebswege ein Wettbewerber tatsächlich nachbauen müsste.",
  },
  {
    id: "Q10",
    group: "control",
    text: "Wie abhängig ist Ihre Kernleistung von einem KI-Anbieter?",
    low: "Erprobte Ausweichmöglichkeit",
    high: "Keine brauchbare Alternative",
    help: "Eine zweite API genügt nicht. Prüfen Sie Qualität, Datenzugang, Kosten und gemeinsame technische Abhängigkeiten.",
    action: "Einen Anbieterwechsel praktisch testen",
    actionDetail:
      "Erproben Sie eine Alternative an relevanten Aufgaben und dokumentieren Sie Qualität, Kosten, Umstellung und Mindestbetrieb.",
  },
  {
    id: "Q11",
    group: "control",
    text: "Wie groß ist das Risiko unbemerkter Qualitätsfehler?",
    low: "Relevante Aufgaben wiederholbar geprüft",
    high: "Relevante Fehler kaum geprüft",
    help: "Beurteilen Sie repräsentative Aufgaben, bekannte Fehlertypen und klare Akzeptanzgrenzen – statt einzelner überzeugender Beispiele.",
    action: "Eine wiederholbare Qualitätsprüfung aufbauen",
    actionDetail:
      "Definieren Sie repräsentative Prüfaufgaben, Fehlerklassen und Akzeptanzgrenzen und testen Sie nach Modelländerungen erneut.",
  },
  {
    id: "Q12",
    group: "control",
    text: "Wie schwer könnten Sie Ihr Angebot kurzfristig anpassen?",
    low: "Ressourcen, Verantwortung und Plan klar",
    high: "Keine realistische Umsetzung",
    help: "Berücksichtigen Sie Entscheidungswege, verfügbare Kapazität, Budget und die Zeit bis zur notwendigen Veränderung.",
    action: "Den Anpassungsplan konkret machen",
    actionDetail:
      "Legen Sie fest, wer welche Veränderung mit welchen Ressourcen umsetzt und bis wann ein überprüfbares Ergebnis vorliegen soll.",
  },
];
export interface QuickCheck {
  id: string;
  schemaVersion: string;
  methodologyVersion: string;
  methodologySnapshot: QuickQuestion[];
  createdAt: string;
  updatedAt: string;
  type: "existing" | "idea";
  answers: Record<string, QuickAnswer>;
  step: number;
  view: "questions" | "results";
  isExample: boolean;
  originId: string | null;
}
export function createCheck(type: QuickCheck["type"]): QuickCheck {
  const time = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    schemaVersion: QUICK_SCHEMA,
    methodologyVersion: QUICK_METHOD,
    methodologySnapshot: structuredClone(QUICK_QUESTIONS),
    createdAt: time,
    updatedAt: time,
    type,
    answers: Object.fromEntries(QUICK_QUESTIONS.map((q) => [q.id, null])),
    step: 0,
    view: "questions",
    isExample: false,
    originId: null,
  };
}
export function answerCheck(c: QuickCheck, id: string, value: QuickAnswer) {
  if (
    !QUICK_QUESTIONS.some((q) => q.id === id) ||
    !(
      value === null ||
      value === "unknown" ||
      (Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 10)
    )
  )
    throw Error("Ungültige Antwort. Bitte einen Wert von 1 bis 10 wählen.");
  c.answers[id] = value;
  c.updatedAt = new Date().toISOString();
}
function norm(values: number[]) {
  return Math.round(
    (100 * values.reduce((s, v) => s + v - 1, 0)) / (values.length * 9),
  );
}
export function riskLabel(score: number | null) {
  return score === null
    ? "Noch offen"
    : score < 25
      ? "Niedriges Risiko"
      : score < 50
        ? "Mittleres Risiko"
        : score < 75
          ? "Erhöhtes Risiko"
          : "Hohes Risiko";
}
export function calculateRisk(c: QuickCheck) {
  const rated = QUICK_QUESTIONS.flatMap((q) =>
    typeof c.answers[q.id] === "number"
      ? [{ ...q, value: c.answers[q.id] as number }]
      : [],
  );
  const groups = QUICK_GROUPS.map((g) => {
    const values = rated.filter((q) => q.group === g.id).map((q) => q.value);
    return {
      ...g,
      answered: values.length,
      score: values.length === 3 ? norm(values) : null,
    };
  });
  const ranked = [...rated].sort(
    (a, b) =>
      b.value - a.value || Number(a.id.slice(1)) - Number(b.id.slice(1)),
  );
  return {
    score: rated.length === 12 ? norm(rated.map((q) => q.value)) : null,
    answered: rated.length,
    processed: QUICK_QUESTIONS.filter((q) => c.answers[q.id] !== null).length,
    groups,
    critical: ranked.filter((q) => q.value >= 9),
    priorities: ranked.filter((q) => q.value >= 4).slice(0, 3),
    unknown: QUICK_QUESTIONS.filter((q) => typeof c.answers[q.id] !== "number"),
  };
}
const questionSchema = z
  .object({
    id: z.string(),
    group: z.enum(["value", "competition", "advantage", "control"]),
    text: z.string(),
    low: z.string(),
    high: z.string(),
    help: z.string(),
    action: z.string(),
    actionDetail: z.string(),
  })
  .strict();
const questionIds = QUICK_QUESTIONS.map((q) => q.id) as [string, ...string[]];
const checkSchema = z
  .object({
    id: z.string().min(1).max(200),
    schemaVersion: z.literal(QUICK_SCHEMA),
    methodologyVersion: z.literal(QUICK_METHOD),
    methodologySnapshot: z.array(questionSchema).length(12),
    createdAt: z.iso.datetime({ offset: true }),
    updatedAt: z.iso.datetime({ offset: true }),
    type: z.enum(["existing", "idea"]),
    answers: z.record(
      z.enum(questionIds),
      z.union([
        z.number().int().min(1).max(10),
        z.literal("unknown"),
        z.null(),
      ]),
    ),
    step: z.number().int().min(0).max(11),
    view: z.enum(["questions", "results"]),
    isExample: z.boolean(),
    originId: z.string().nullable(),
  })
  .strict();
const exchangeSchema = z
  .object({
    format: z.literal("e23-quick-check"),
    schemaVersion: z.literal(QUICK_SCHEMA),
    appVersion: z.string(),
    exportedAt: z.iso.datetime({ offset: true }),
    checks: z.array(checkSchema).max(2000),
  })
  .strict();
export function serializeChecks(checks: QuickCheck[]) {
  return JSON.stringify(
    {
      format: "e23-quick-check",
      schemaVersion: QUICK_SCHEMA,
      appVersion: "0.2.0",
      exportedAt: new Date().toISOString(),
      checks,
    },
    null,
    2,
  );
}
export function parseChecks(
  text: string,
  maxBytes = 5 * 1024 * 1024,
): QuickCheck[] {
  if (new TextEncoder().encode(text).length > maxBytes)
    throw Error("Die Datei überschreitet das Importlimit von 5 MiB.");
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw Error("Die Datei enthält kein gültiges JSON.");
  }
  const result = exchangeSchema.safeParse(data);
  if (!result.success)
    throw Error(
      "Import nicht möglich: Datei, Schemaversion oder Methodenversion wird nicht unterstützt.",
    );
  const checks = result.data.checks;
  const ids = new Set<string>();
  for (const c of checks) {
    if (ids.has(c.id)) throw Error("Doppelte Check-ID in der Datei.");
    ids.add(c.id);
    if (
      JSON.stringify(c.methodologySnapshot) !== JSON.stringify(QUICK_QUESTIONS)
    )
      throw Error(
        "Der Fragenkatalog passt nicht zur angegebenen Methodenversion.",
      );
  }
  return checks;
}
export function mergeChecks(
  existing: QuickCheck[],
  incoming: QuickCheck[],
  mode: "copy" | "replace",
) {
  const result = structuredClone(existing);
  for (const source of incoming) {
    const c = structuredClone(source);
    if (mode === "copy") {
      c.originId = c.id;
      c.id = crypto.randomUUID();
    }
    const at = result.findIndex((x) => x.id === c.id);
    if (at < 0) result.push(c);
    else result[at] = c;
  }
  return result;
}
export function checkTitle(c: QuickCheck) {
  return `${c.isExample ? "Beispiel" : c.type === "idea" ? "Neue Idee" : "Bestehendes Angebot"}${c.originId ? " (Kopie)" : ""} · ${new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Berlin" }).format(new Date(c.createdAt))}`;
}
export function exampleCheck() {
  const c = createCheck("existing");
  const values = [5, 5, 4, 10, 8, 7, 8, 7, 5, 10, 8, 8];
  QUICK_QUESTIONS.forEach((q, i) => answerCheck(c, q.id, values[i]));
  c.isExample = true;
  c.view = "results";
  c.step = 11;
  return c;
}
export function downloadText(
  filename: string,
  text: string,
  type = "application/json",
) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
