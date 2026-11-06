import type { FinancialBaseline, FinancialStress } from "../domain/types";
export function calculate(
  b: FinancialBaseline | null,
  s: FinancialStress | null,
) {
  const result: {
    E0: number | null;
    E1: number | null;
    delta: number | null;
    R1: number | null;
    V1: number | null;
    F1: number | null;
    DB0: number | null;
    DB1: number | null;
    errors: string[];
  } = {
    E0: null,
    E1: null,
    delta: null,
    R1: null,
    V1: null,
    F1: null,
    DB0: null,
    DB1: null,
    errors: [],
  };
  if (!b) return result;
  const vals = [b.revenue, b.variableCosts, b.fixedCosts];
  if (vals.some((v) => v !== null && (!Number.isFinite(v) || v < 0))) {
    result.errors.push(
      "Ausgangswerte müssen endliche nichtnegative Zahlen sein.",
    );
    return result;
  }
  if (vals.some((v) => v === null)) return result;
  const [R, V, F] = vals as number[];
  if (!Number.isFinite(R - V - F)) {
    result.errors.push("Zahlenbereich der Ausgangslage überschritten.");
    return result;
  }
  result.E0 = R - V - F;
  result.DB0 = R - V;
  if (!s || s.modelApplicable !== true) return result;
  const factors = [s.priceChange, s.volumeChange, s.unitVariableCostChange];
  if (
    factors.some((v) => v !== null && (!Number.isFinite(v) || v < -1)) ||
    (s.fixedCostDelta !== null && !Number.isFinite(s.fixedCostDelta)) ||
    (s.oneOffCost !== null &&
      (!Number.isFinite(s.oneOffCost) || s.oneOffCost < 0))
  ) {
    result.errors.push(
      "Relative Änderungen dürfen nicht unter −100 % liegen; alle Zahlen müssen endlich sein, einmalige Kosten nichtnegativ.",
    );
    return result;
  }
  if (s.fixedCostDelta !== null && F + s.fixedCostDelta < 0) {
    result.errors.push("Fixkosten im Szenario dürfen nicht negativ sein.");
    return result;
  }
  if (factors.some((v) => v === null) || s.fixedCostDelta === null)
    return result;
  const [p, q, c] = factors as number[];
  const r = R * (1 + p) * (1 + q),
    v = V * (1 + q) * (1 + c),
    f = F + s.fixedCostDelta;
  if (![r, v, f, r - v - f, r - v - f - result.E0].every(Number.isFinite)) {
    result.errors.push("Zahlenbereich überschritten.");
    return result;
  }
  return {
    ...result,
    R1: r,
    V1: v,
    F1: f,
    DB1: r - v,
    E1: r - v - f,
    delta: r - v - f - result.E0,
  };
}
