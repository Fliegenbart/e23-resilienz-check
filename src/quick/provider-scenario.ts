import { z } from "zod";

const paceSchema = z.enum(["slow", "medium", "fast"]);
export const providerScenarioSchema = z
  .object({
    version: z.literal("provider-scenario-1.0"),
    horizonYears: z.literal(2),
    capabilityPace: paceSchema,
    pricePace: paceSchema,
  })
  .strict();
export type ProviderScenarioSettings = z.infer<typeof providerScenarioSchema>;
export type ProviderPace = z.infer<typeof paceSchema>;

export const DEFAULT_PROVIDER_SCENARIO: Readonly<ProviderScenarioSettings> =
  Object.freeze({
    version: "provider-scenario-1.0",
    horizonYears: 2,
    capabilityPace: "medium",
    pricePace: "medium",
  });

export const PROVIDER_PACES: { value: ProviderPace; label: string }[] = [
  { value: "slow", label: "Langsam" },
  { value: "medium", label: "Mittel" },
  { value: "fast", label: "Schnell" },
];

export const PROVIDER_SCENARIO_METHOD =
  "Die zwei Tempi sind Ihre Annahmen für die nächsten zwei Jahre. Mehr Fähigkeiten erhöhen den angenommenen Übernahmedruck; sinkende KI-Kosten den Preis- und Bündelungsdruck. Wir verwenden die in Ihren Antworten erkennbaren Übernahmewege. Fehlende Daten, Zugänge und reale Ausführung bleiben Hürden. Die heutige KI-Leistung für Ihren konkreten Auftrag ist nicht gemessen. Deshalb ergeben sich daraus weder Eintrittstermine noch Preisnachlässe oder Wahrscheinlichkeiten. Die übrigen Befunde zeigen weiterhin die grundsätzliche Angreifbarkeit und den möglichen Schutz.";
