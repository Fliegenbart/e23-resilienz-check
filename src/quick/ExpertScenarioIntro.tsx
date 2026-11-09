import { Arrow } from "./ui";

export const EXPERT_ATTACKS = [
  {
    id: "customer",
    title: "Ihr Kunde macht es selbst.",
    text: "Sein Expertenteam liefert das Ergebnis direkt.",
  },
  {
    id: "competitor",
    title: "Ihr Wettbewerber legt zu.",
    text: "Er liefert schneller, besser oder günstiger.",
  },
  {
    id: "newEntrant",
    title: "Ein neuer Anbieter greift an.",
    text: "Er kommt aus einer anderen Branche und löst das Problem anders.",
  },
] as const;

export function ExpertScenarioIntro({ onStart }: { onStart: () => void }) {
  return (
    <main className="expert-scenario-intro results-page">
      <p className="section-index">Ein Gedankenexperiment</p>
      <h1>Was, wenn jeder auf Expertenniveau arbeitet?</h1>
      <p className="expert-scenario-lead">
        Ein Team aus Spitzenexperten. Rund um die Uhr. Parallel. Viel günstiger.
      </p>
      <div className="expert-attack-grid">
        {EXPERT_ATTACKS.map((scenario) => (
          <section key={scenario.id}>
            <h2>{scenario.title}</h2>
            <p>{scenario.text}</p>
          </section>
        ))}
      </div>
      <p className="expert-scenario-note">
        Auch Sie haben dieses Team. Daten, Rechte und Zugänge sind nicht
        automatisch dabei.
      </p>
      <button className="button primary" onClick={onStart}>
        Wo bleibt Ihr Burggraben? <Arrow />
      </button>
    </main>
  );
}
