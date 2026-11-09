import {
  PROVIDER_METHOD,
  providerPremise,
  PROVIDER_BOUNDARIES,
  isProviderV4,
  isProviderV5,
  isProviderV6,
  isProviderRiskMethod,
  supportsBusinessAnalysis,
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
      {supportsBusinessAnalysis(version) && (
        <p>
          Auf Wunsch bezieht eine KI-Auswertung Ihre Business-Beschreibung,
          Antworten und das gewählte Szenario auf Ihr Angebot. Sie ergänzt den
          Check ohne externe Recherche. Geänderte Angaben erfordern eine neue
          KI-Auswertung.
        </p>
      )}
      {isProviderRiskMethod(version) && (
        <p>
          Ihren angegebenen Vorteil prüft die KI als Behauptung. Sie nennt
          mögliche Auslöser für eine Ersetzung, kein Datum. Der Score bleibt aus
          Ihren Antworten berechnet; widerspricht die KI, wird das markiert.
        </p>
      )}
      <p>
        Jede Skala beschreibt eine konkrete Eigenschaft Ihres Angebots. Eine
        hohe Zahl kann Übernahme erleichtern oder einen eigenen Vorteil
        ausdrücken. Maßgeblich sind die beiden Texte an der Skala.
      </p>
      <p>
        {isProviderRiskMethod(version)
          ? "Der stärkste Übernahmeweg bestimmt das Risiko. Ein Kaufgrund trägt nur, wenn Ihr Beitrag nötig, schwer ersetzbar und den Aufpreis wert bleibt."
          : isProviderV4(version)
            ? "Was KI übernehmen kann, was Sie schützt und wie Sie selbst profitieren: drei getrennte Befunde."
            : "Wir betrachten drei Wege getrennt: digitale Arbeit übernehmen, im vorhandenen Paket mitliefern und Ihre Oberfläche umgehen. Eigene Vorteile werden davon nicht abgezogen."}
      </p>
      <details>
        <summary>Die Auswertungsregeln im Detail</summary>
        {isProviderV5(version) ? (
          <p>
            Der KI-Risiko-Score reicht von 0 bis 100. Hohe Werte bedeuten einen
            leicht ersetzbaren Kaufgrund. Er ist keine Pleitewahrscheinlichkeit.
          </p>
        ) : (
          <ProviderRules version={version} />
        )}
      </details>
      {isProviderV6(version) && (
        <p>
          Alle können das Expertenteam nutzen: Sie, Ihre Kunden, bekannte
          Wettbewerber und neue Anbieter aus anderen Branchen. Der Check sucht
          deshalb auch nach anderen Lösungen für dasselbe Kundenproblem.
        </p>
      )}
      <h3>Was die Quellen beitragen</h3>
      <p>
        ARK Invest, <cite>Big Ideas 2026</cite>: sinkende Tokenpreise (S. 20 und
        34), längere bewältigte Aufgaben (S. 33) und Agenten als Zugang zu
        vorhandenen Systemen (S. 26–28). Die Daten stammen überwiegend aus 2025
        und Anfang 2026. Daraus leiten wir mögliche Angriffswege ab; die
        Zukunftszahlen des Berichts fließen nicht in Ihre Bewertung ein.
      </p>
      {isProviderV6(version) && (
        <>
          <p>
            Richard Suttons „The Bitter Lesson“ beschreibt den Vorteil
            skalierbarer Suche und Lernverfahren gegenüber fest eingebauten
            menschlichen Lösungswegen. Daraus folgt kein Termin für allgemeines
            Expertenniveau.
          </p>
          <p>
            METR misst Aufgabenhorizonte in ausgewählten Fachgebieten. Diese
            Werte hängen von Aufgabe und Zuverlässigkeit ab; sie sind keine
            Vorhersage, wann Ihr Geschäft ersetzt wird.
          </p>
        </>
      )}
      <ul className="provider-sources">
        {isProviderV6(version) && (
          <>
            <li>
              <a
                href="https://www.incompleteideas.net/IncIdeas/BitterLesson.html"
                target="_blank"
                rel="noreferrer"
              >
                Richard Sutton: The Bitter Lesson
              </a>
            </li>
            <li>
              <a
                href="https://metr.org/notes/2026-01-22-time-horizon-limitations/"
                target="_blank"
                rel="noreferrer"
              >
                METR: Grenzen der Aufgabenhorizonte
              </a>
            </li>
          </>
        )}
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
        Fragestellung; sie prüfen Ihr konkretes Angebot nicht. Quellenstand: 7.
        November 2026.{" "}
        {isProviderV6(version) &&
          "Expertenszenario ergänzt am 9. November 2026."}
      </p>
    </>
  );
}
