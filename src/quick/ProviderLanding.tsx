import type { QuickCheck } from "./model";
import { calculateRisk } from "./model";
import { Arrow } from "./ui";

export function ProviderLanding({
  onStart,
  onExample,
  resume,
  onResume,
  onMethod,
}: {
  onStart: () => void;
  onExample: () => void;
  resume?: QuickCheck;
  onResume: () => void;
  onMethod: () => void;
}) {
  return (
    <main className="landing-page provider-landing">
      <section className="provider-intro">
        <div>
          <h1>
            Wie einfach kann Ihr Business von KI{" "}
            <span className="highlight-word">disruptiert werden?</span>
          </h1>
          <p className="provider-lead">
            Drei Szenarien. Welches bringt Ihr Geschäft um, und was bleibt?
          </p>
          <div className="landing-cta">
            <button className="button primary" onClick={onStart}>
              Stresstest starten <Arrow />
            </button>
            <span className="provider-time">
              2 Sätze · 10 Fragen · 4 Minuten
            </span>
          </div>
          {resume && (
            <button className="resume-link" onClick={onResume}>
              Fortsetzen · {calculateRisk(resume).processed}/
              {resume.methodologySnapshot.length} <Arrow />
            </button>
          )}
        </div>
      </section>
      <footer className="landing-footer">
        <span>Checks werden in diesem Browser gespeichert.</span>
        <button className="text-link" onClick={onExample}>
          Beispiel ansehen
        </button>
        <button className="text-link" onClick={onMethod}>
          Annahmen und Regeln
        </button>
      </footer>
    </main>
  );
}
