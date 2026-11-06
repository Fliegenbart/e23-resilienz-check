import data from "./config.json";
import type { MethodologySnapshot } from "../domain/types";
export const METHOD = data as MethodologySnapshot;
export const SCHEMA_VERSION = "1.0";
export const APP_VERSION = "0.1.0";
export const GROUPS = {
  A: "Kundenwert und Wirtschaftlichkeit",
  B: "Wettbewerbliche Ersetzbarkeit",
  C: "Verteidigbare Vorteile",
  D: "Handlungsfähigkeit und KI-Kontrolle",
};
