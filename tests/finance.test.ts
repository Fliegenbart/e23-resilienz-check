import { it, expect } from "vitest";
import { calculate } from "../src/scenarios/finance";
const b = {
  period: "month" as const,
  currency: "EUR",
  revenue: 100000,
  variableCosts: 40000,
  fixedCosts: 35000,
  sourceNote: "Fiktiv",
};
const s = {
  priceChange: -0.2,
  volumeChange: -0.1,
  unitVariableCostChange: -0.25,
  fixedCostDelta: 5000,
  oneOffCost: null,
  assumptionNote: "Fiktiv",
  modelApplicable: true,
};
it("verbindliches Finanzbeispiel ohne veränderte Ausgangslage", () => {
  const original = structuredClone(b);
  expect(calculate(b, s)).toMatchObject({
    E0: 25000,
    E1: 5000,
    delta: -20000,
    R1: 72000,
    V1: 27000,
    F1: 40000,
  });
  expect(b).toEqual(original);
});
it("leere Werte bleiben fehlend", () => {
  expect(calculate(null, null).E0).toBeNull();
  expect(calculate(b, { ...s, priceChange: null }).E1).toBeNull();
});
it("E0 unabhängig von E1; ungeeignetes Modell rechnet kein Szenario", () => {
  expect(calculate(b, { ...s, modelApplicable: false })).toMatchObject({
    E0: 25000,
    E1: null,
  });
});
it("negative operative Ergebnisse bleiben gültig", () => {
  expect(calculate(b, { ...s, priceChange: -1 }).E1).toBe(-67000);
});
it("unter -100 %, Infinity und negative Fixkosten unzulässig", () => {
  expect(
    calculate(b, { ...s, volumeChange: -1.1 }).errors.length,
  ).toBeGreaterThan(0);
  expect(
    calculate({ ...b, revenue: Infinity }, s).errors.length,
  ).toBeGreaterThan(0);
  expect(
    calculate(b, { ...s, fixedCostDelta: -40000 }).errors.length,
  ).toBeGreaterThan(0);
});
it("Zahlenüberlauf in der Ausgangslage ergibt keine unendlichen Ergebnisse", () => {
  const r = calculate(
    { ...b, revenue: 0, variableCosts: 1e308, fixedCosts: 1e308 },
    null,
  );
  expect(r.E0).toBeNull();
  expect(r.errors.length).toBeGreaterThan(0);
});
it("Überlauf der Ergebnisveränderung bleibt als Rechenfehler sichtbar", () => {
  const r = calculate(
    { ...b, revenue: 5e307, variableCosts: 1.4e308, fixedCosts: 0 },
    {
      ...s,
      priceChange: 2,
      volumeChange: 0,
      unitVariableCostChange: -1,
      fixedCostDelta: 0,
    },
  );
  expect(r.delta).toBeNull();
  expect(r.errors.length).toBeGreaterThan(0);
});
