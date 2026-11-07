import { BUSINESS_DESCRIPTION_MAX_LENGTH } from "./business-description";

export type DictationState = "idle" | "starting" | "listening" | "stopping";
interface RecognitionEvent {
  results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>;
}
export interface SpeechRecognizer {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onresult: ((event: RecognitionEvent) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type RecognitionConstructor = new () => SpeechRecognizer;
type SpeechWindow = {
  SpeechRecognition?: RecognitionConstructor;
  webkitSpeechRecognition?: RecognitionConstructor;
};

export function getRecognitionConstructor():
  RecognitionConstructor | undefined {
  if (typeof window === "undefined") return undefined;
  const browser = window as unknown as SpeechWindow;
  return browser.SpeechRecognition ?? browser.webkitSpeechRecognition;
}

function errorMessage(error: string) {
  switch (error) {
    case "not-allowed":
      return "Mikrofonzugriff blockiert. Im Browser erlauben oder den Text tippen.";
    case "audio-capture":
      return "Kein Mikrofon verfügbar. Bitte den Text tippen.";
    case "no-speech":
      return "Keine Sprache erkannt. Noch einmal versuchen oder tippen.";
    case "network":
      return "Sprachdienst nicht erreichbar. Ihr Text bleibt erhalten.";
    case "service-not-allowed":
    case "language-not-supported":
      return "Diktieren ist hier nicht verfügbar. Nutzen Sie die Diktierfunktion Ihrer Tastatur.";
    default:
      return "Diktat beendet. Sie können den Text weiter bearbeiten.";
  }
}

export function startDictation({
  createRecognition,
  initialText,
  onText,
  onState,
  onError,
}: {
  createRecognition: () => SpeechRecognizer;
  initialText: string;
  onText: (text: string) => void;
  onState: (state: DictationState) => void;
  onError: (message: string) => void;
}) {
  let recognition: SpeechRecognizer | undefined;
  let active = true;
  let stopping = false;
  let stopTimer: ReturnType<typeof setTimeout> | undefined;

  const close = (abort: boolean, notify: boolean) => {
    if (!active) return;
    active = false;
    clearTimeout(stopTimer);
    if (recognition) {
      recognition.onstart = recognition.onend = null;
      recognition.onresult = recognition.onerror = null;
      if (abort) {
        try {
          recognition.abort();
        } catch {
          /* Already closed by the browser. */
        }
      }
    }
    if (notify) onState("idle");
  };
  const fail = (error: string) => {
    if (!active) return;
    if (error !== "aborted") onError(errorMessage(error));
    close(true, true);
  };
  try {
    recognition = createRecognition();
    recognition.lang = "de-DE";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = () => {
      if (active && !stopping) onState("listening");
    };
    recognition.onend = () => close(false, true);
    recognition.onerror = (event) => fail(event.error);
    recognition.onresult = (event) => {
      if (!active) return;
      // Each event contains the session's current result list. Replace that
      // suffix so revised interim words and repeated final results don't duplicate.
      const spoken = Array.from(event.results, (result) =>
        result[0].transcript.trim(),
      )
        .filter(Boolean)
        .join(" ");
      const separator =
        initialText && spoken && !/\s$/.test(initialText) ? " " : "";
      const text = `${initialText}${separator}${spoken}`;
      const limited = text
        .slice(0, BUSINESS_DESCRIPTION_MAX_LENGTH)
        .replace(/[\uD800-\uDBFF]$/, "");
      onText(limited);
      if (text.length >= BUSINESS_DESCRIPTION_MAX_LENGTH) {
        onError("5.000 Zeichen erreicht. Diktat beendet.");
        close(true, true);
      }
    };
    onState("starting");
    recognition.start();
  } catch (error) {
    fail(
      error instanceof Error && error.name === "NotAllowedError"
        ? "not-allowed"
        : "service-not-allowed",
    );
  }
  return {
    stop() {
      if (!active || stopping) return;
      stopping = true;
      onState("stopping");
      // Allow the final words to arrive, but don't leave a broken service open.
      stopTimer = setTimeout(() => close(true, true), 3000);
      try {
        recognition?.stop();
      } catch {
        close(true, true);
      }
    },
    dispose() {
      close(true, false);
    },
  };
}
