import type { QuickCheck } from "./model.js";
import {
  isProviderV4,
  isProviderV5,
  isProviderV6,
} from "./provider-questions.js";
import {
  evaluateProviderV6,
  evaluateProviderScenarioV6,
} from "./provider-analysis-6.js";
import {
  evaluateProviderV5,
  evaluateProviderScenarioV5,
  type ProviderRisk,
} from "./provider-analysis-5.js";
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
export function evaluateProvider(check: QuickCheck): Omit<
  ReturnType<typeof evaluateV3>,
  "routes"
> & {
  routes: Omit<
    ReturnType<typeof evaluateV3>["routes"][number],
    "descriptions"
  >[];
  benefit?: ProviderBenefit;
  risk?: ProviderRisk;
  payment?: string;
  takeover?: string;
  nextStep?: string;
  contradictions?: string[];
  access?: string;
  incentive?: string;
} {
  return isProviderV6(check.methodologyVersion)
    ? evaluateProviderV6(check)
    : isProviderV5(check.methodologyVersion)
      ? evaluateProviderV5(check)
      : isProviderV4(check.methodologyVersion)
        ? evaluateProviderV4(check)
        : evaluateV3(check);
}
export function evaluateProviderScenario(check: QuickCheck): ReturnType<
  typeof scenarioV3
> & {
  benefit?: { level: ProviderBenefit["level"]; text: string };
} {
  return isProviderV6(check.methodologyVersion)
    ? evaluateProviderScenarioV6(check)
    : isProviderV5(check.methodologyVersion)
      ? evaluateProviderScenarioV5(check)
      : isProviderV4(check.methodologyVersion)
        ? evaluateProviderScenarioV4(check)
        : scenarioV3(check);
}
