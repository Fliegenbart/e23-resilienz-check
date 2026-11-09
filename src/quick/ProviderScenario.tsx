import { useId } from "react";
import type { QuickCheck } from "./model";
import { isProviderV5 } from "./provider-questions";
import { evaluateProviderScenario } from "./provider-analysis";
import {
  PROVIDER_PACES,
  type ProviderScenarioSettings,
} from "./provider-scenario";

export function ProviderScenario({
  check,
  print = false,
  onChange,
}: {
  check: QuickCheck;
  print?: boolean;
  onChange?: (settings: ProviderScenarioSettings) => void;
}) {
  const id = useId();
  const { settings, capability, price, benefit } =
    evaluateProviderScenario(check);
  const axes = [
    {
      key: "capabilityPace" as const,
      label: "KI wird besser",
      result: capability,
    },
    { key: "pricePace" as const, label: "KI wird günstiger", result: price },
  ];
  return (
    <section
      className="provider-scenario print-block"
      aria-labelledby={`${id}-title`}
    >
      <header>
        <h2 id={`${id}-title`}>Nächste 2 Jahre</h2>
        <span>
          {isProviderV5(check.methodologyVersion) ? "Annahme" : "Szenario"}
        </span>
      </header>
      <div className="provider-scenario-grid">
        {axes.map(({ key, label, result }) => (
          <div key={key}>
            {print ? (
              <p className="provider-scenario-choice">
                {`${label}: ${PROVIDER_PACES.find((p) => p.value === settings[key])!.label}`}
              </p>
            ) : (
              <fieldset>
                <legend>{label}</legend>
                <div className="provider-pace-options">
                  {PROVIDER_PACES.map(({ value, label: paceLabel }) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name={`${id}-${key}`}
                        value={value}
                        checked={settings[key] === value}
                        onChange={() =>
                          onChange?.({ ...settings, [key]: value })
                        }
                      />
                      <span>{paceLabel}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            <p
              className="provider-scenario-effect"
              aria-live={print ? undefined : "polite"}
            >
              {result.text}
              {key === "capabilityPace" &&
                benefit &&
                !isProviderV5(check.methodologyVersion) && (
                  <span className="provider-scenario-benefit">
                    {benefit.text}
                  </span>
                )}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
