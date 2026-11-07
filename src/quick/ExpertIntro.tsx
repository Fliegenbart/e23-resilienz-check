import {
  EXPERT_PREMISE,
  EXPERT_BOUNDARIES,
  EXPERT_FRAMING,
} from "./expert-team";
import { Arrow } from "./ui";
export function ExpertIntro({ onStart }: { onStart: () => void }) {
  return (
    <main className="expert-intro">
      <p className="section-index">
        Bevor Sie beginnen · Das Gedankenexperiment
      </p>
      <h1>
        Zehn Weltklasseexperten.
        <br />
        Ihr Geschäft.
        <br />
        <span>Sechs Monate.</span>
      </h1>
      <p className="expert-intro-story">{EXPERT_PREMISE}</p>
      <div className="expert-intro-facts" aria-label="Die Annahmen">
        <div>
          <strong>10</strong>
          <span>
            Weltklasseexperten
            <br />
            Ihres Fachgebiets
          </span>
        </div>
        <div>
          <strong>24/7</strong>
          <span>
            recherchieren, entwickeln,
            <br />
            testen und lernen
          </span>
        </div>
        <div>
          <strong>≈ 0 €</strong>
          <span>
            Personalkosten
            <br />
            im Gedankenexperiment
          </span>
        </div>
      </div>
      <p className="expert-intro-boundaries">{EXPERT_BOUNDARIES}</p>
      <p className="expert-intro-framing">{EXPERT_FRAMING}</p>
      <div className="expert-intro-start">
        <button className="button primary" onClick={onStart}>
          Mit diesem Bild starten
          <Arrow />
        </button>
        <span>12 Fragen · Anklicken statt ausfüllen</span>
      </div>
    </main>
  );
}
