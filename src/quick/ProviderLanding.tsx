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
            Was übernimmt KI? Wofür zahlen Kunden weiter?
          </p>
          <div className="landing-cta">
            <button className="button primary" onClick={onStart}>
              Assessment starten <Arrow />
            </button>
            <span className="provider-time">12 Fragen</span>
          </div>
          {resume && (
            <button className="resume-link" onClick={onResume}>
              Fortsetzen · {calculateRisk(resume).processed}/12 <Arrow />
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
          Annahmen und Quellen
        </button>
      </footer>
    </main>
  );
}
