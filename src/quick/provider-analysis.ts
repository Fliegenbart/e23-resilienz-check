import type { QuickCheck } from "./model.js";
import { isProviderV4 } from "./provider-questions.js";
import {
  evaluateProvider as evaluateV3,
  evaluateProviderScenario as scenarioV3,
} from "./methods/provider-analysis-3.js";
import {
  evaluateProviderV4,
  evaluateProviderScenarioV4,
  type ProviderBenefit,
} from "./provider-analysis-4.js";

export {
  ROUTE_LABELS,
  PROTECTION_LABELS,
} from "./methods/provider-analysis-3.js";
export type {
  RouteLevel,
  ProtectionLevel,
} from "./methods/provider-analysis-3.js";
export { BENEFIT_LABELS } from "./provider-analysis-4.js";

// Dispatch by the saved method. Old answer IDs never acquire new meanings.
export function evaluateProvider(
  check: QuickCheck,
): ReturnType<typeof evaluateV3> & { benefit?: ProviderBenefit } {
  return isProviderV4(check.methodologyVersion)
    ? evaluateProviderV4(check)
    : evaluateV3(check);
}
export function evaluateProviderScenario(check: QuickCheck): ReturnType<
  typeof scenarioV3
> & {
  benefit?: { level: ProviderBenefit["level"]; text: string };
} {
  return isProviderV4(check.methodologyVersion)
    ? evaluateProviderScenarioV4(check)
    : scenarioV3(check);
}
