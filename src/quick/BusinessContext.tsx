import { useEffect, useRef, useState } from "react";
import type { QuickCheck } from "./model";
import {
  analysisInputFor,
  currentBusinessAnalysis,
  type BusinessAnalysis,
} from "./business-analysis";
import { BusinessDescription } from "./BusinessDescription";
import { BusinessMoat } from "./BusinessMoat";
import { BusinessAnalysisControl } from "./BusinessAnalysis";
import { Arrow } from "./ui";

export function BusinessContext({
  check,
  onDescriptionChange,
  onMoatChange,
  onAnalysisComplete,
  onContinue,
  onBack,
}: {
  check: QuickCheck;
  onDescriptionChange: (text: string) => void;
  onMoatChange: (text: string) => void;
  onAnalysisComplete: (analysis: BusinessAnalysis) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [dictating, setDictating] = useState(false);
  const needsAnalysis =
    Boolean(analysisInputFor(check)) && !currentBusinessAnalysis(check);
  useEffect(() => heading.current?.focus({ preventScroll: true }), []);

  return (
    <main className="business-context-page">
      <p className="section-index">Ihre Ergänzungen</p>
      <h1 ref={heading} tabIndex={-1}>
        Zum Abschluss.
      </h1>
      <BusinessDescription
        value={check.businessDescription ?? ""}
        onChange={onDescriptionChange}
        onBusyChange={setDictating}
      />
      <BusinessMoat value={check.businessMoat ?? ""} onChange={onMoatChange} />
      {needsAnalysis && (
        <BusinessAnalysisControl
          check={check}
          onComplete={onAnalysisComplete}
          disabled={dictating}
        />
      )}
      <div className="business-context-actions">
        <button className="text-link" onClick={onBack}>
          <Arrow direction="left" /> Zurück
        </button>
        <button
          className={needsAnalysis ? "text-link" : "button primary"}
          onClick={onContinue}
          disabled={dictating}
        >
          {needsAnalysis ? "Ohne KI zum Ergebnis" : "Ergebnis ansehen"}{" "}
          <Arrow />
        </button>
      </div>
    </main>
  );
}
