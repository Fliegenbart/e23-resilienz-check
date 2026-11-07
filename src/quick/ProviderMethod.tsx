import {
  PROVIDER_METHOD,
  providerPremise,
  PROVIDER_BOUNDARIES,
  isProviderV4,
} from "./provider-questions";
import { ProviderRules } from "./ProviderRules";

export function ProviderMethodContent({
  version = PROVIDER_METHOD,
}: {
  version?: string;
}) {
  return (
    <>
      <p className="section-index">Annahmen und Grundlagen</p>
      <h2>Was wir prüfen.</h2>
      <p>{providerPremise(version)}</p>
      <p>{PROVIDER_BOUNDARIES}</p>
      <h3>So entsteht Ihr Ergebnis</h3>
      {isProviderV4(version) && (
        <p>
          Auf Wunsch bezieht eine KI-Auswertung Ihre Business-Beschreibung,
          Antworten und das gewählte Szenario auf Ihr Angebot. Sie ergänzt den
          Check ohne externe Recherche. Geänderte Angaben erfordern eine neue
          KI-Auswertung.
        </p>
      )}
      <p>
        Jede Skala beschreibt eine konkrete Eigenschaft Ihres Angebots. Eine
        hohe Zahl kann Übernahme erleichtern oder einen eigenen Vorteil
        ausdrücken. Maßgeblich sind die beiden Texte an der Skala.
      </p>
      <p>
        {isProviderV4(version)
          ? "Was KI übernehmen kann, was Sie schützt und wie Sie selbst profitieren: drei getrennte Befunde."
          : "Wir betrachten drei Wege getrennt: digitale Arbeit übernehmen, im vorhandenen Paket mitliefern und Ihre Oberfläche umgehen. Eigene Vorteile werden davon nicht abgezogen."}
      </p>
      <details>
        <summary>Die Auswertungsregeln im Detail</summary>
        <ProviderRules version={version} />
      </details>
      <h3>Was die Quellen beitragen</h3>
      <p>
        ARK Invest, <cite>Big Ideas 2026</cite>: sinkende Tokenpreise (S. 20 und
        34), längere bewältigte Aufgaben (S. 33) und Agenten als Zugang zu
        vorhandenen Systemen (S. 26–28). Die Daten stammen überwiegend aus 2025
        und Anfang 2026. Daraus leiten wir mögliche Angriffswege ab; die
        Zukunftszahlen des Berichts fließen nicht in Ihre Bewertung ein.
      </p>
      <ul className="provider-sources">
        <li>
          <a
            href="https://metr.org/time-horizons/"
            target="_blank"
            rel="noreferrer"
          >
            METR: Was Aufgabenhorizonte messen
          </a>
        </li>
        <li>
          <a
            href="https://cloud.google.com/gemini-enterprise/connectors"
            target="_blank"
            rel="noreferrer"
          >
            Google: Verbindungen zu Unternehmenssystemen
          </a>
        </li>
        <li>
          <a
            href="https://claude.com/resources/articles/cowork-plugins-across-enterprise"
            target="_blank"
            rel="noreferrer"
          >
            Anthropic: Cowork, Plugins und Arbeitsabläufe
          </a>
        </li>
        <li>
          <a
            href="https://help.openai.com/en/articles/12628342-company-knowledge-in-chatgpt"
            target="_blank"
            rel="noreferrer"
          >
            OpenAI: Unternehmenswissen in ChatGPT
          </a>
        </li>
      </ul>
      <p className="method-note">
        Ein Stresstest auf Basis Ihrer Antworten. Die Quellen begründen die
        Fragestellung; sie prüfen Ihr konkretes Angebot nicht. Quellenprüfung:
        7. November 2026.
      </p>
    </>
  );
}
