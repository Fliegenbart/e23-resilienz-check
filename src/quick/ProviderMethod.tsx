import { PROVIDER_PREMISE, PROVIDER_BOUNDARIES } from "./provider-questions";
import { ROUTE_LABELS, PROTECTION_LABELS } from "./provider-analysis";
import { PROVIDER_SCENARIO_METHOD } from "./provider-scenario";

export function ProviderMethodContent() {
  return (
    <>
      <p className="section-index">Annahmen und Grundlagen</p>
      <h2>Was wir prüfen.</h2>
      <p>{PROVIDER_PREMISE}</p>
      <p>{PROVIDER_BOUNDARIES}</p>
      <h3>So entsteht Ihr Ergebnis</h3>
      <p>
        Jede Skala beschreibt eine konkrete Eigenschaft Ihres Angebots. Eine
        hohe Zahl kann Übernahme erleichtern oder einen eigenen Vorteil
        ausdrücken. Maßgeblich sind die beiden Texte an der Skala.
      </p>
      <p>
        Wir betrachten drei Wege getrennt: digitale Arbeit übernehmen, im
        vorhandenen Paket mitliefern und Ihre Oberfläche umgehen. Eigene
        Vorteile werden davon nicht abgezogen.
      </p>
      <details>
        <summary>Die Auswertungsregeln im Detail</summary>
        <h3>Szenario: nächste zwei Jahre</h3>
        <p>{PROVIDER_SCENARIO_METHOD}</p>
        <p>
          Digitale Arbeit: Fragen 1, 2 und 3. Mitliefern: Fragen 1, 2 und 4.
          Oberfläche umgehen: Fragen 4, 5 und 6.
        </p>
        <ul>
          <li>Alle drei Werte 7–10: „{ROUTE_LABELS.high}“.</li>
          <li>
            Alle mindestens 4, aber nicht alle mindestens 7: „
            {ROUTE_LABELS.partial}“.
          </li>
          <li>Mindestens ein Wert 1–3: „{ROUTE_LABELS.barrier}“.</li>
          <li>Mindestens eine offene Antwort: „{ROUTE_LABELS.unknown}“.</li>
        </ul>
        <p>
          Schutzfaktoren aus Fragen 7–10: 1–3 „{PROTECTION_LABELS.weak}“, 4–6 „
          {PROTECTION_LABELS.limited}“, 7–10 „{PROTECTION_LABELS.strong}“.
          Fragen 11 und 12 prüfen zusätzlich Vergleich und Kaufentscheidung.
          Erst beide Werte ab 7 stützen einen bezahlten Vorteil nach Ihren
          Angaben. Sie bestätigen nicht automatisch jeden einzelnen
          Schutzfaktor.
        </p>
        <p>
          Dies sind eigene qualitative Gesprächsregeln. Sie ergeben weder eine
          Übernahmewahrscheinlichkeit noch eine Unternehmensbewertung. Eine
          sichtbare Hürde kann durch weitere Entwicklung kleiner werden.
        </p>
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
