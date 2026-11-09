import { useEffect, useId, useRef, useState } from "react";
import { BUSINESS_DESCRIPTION_MAX_LENGTH } from "./business-description";
import {
  getRecognitionConstructor,
  startDictation,
  type DictationState,
} from "./dictation";

export function BusinessDescription({
  value,
  onChange,
  onBusyChange,
}: {
  value: string;
  onChange: (text: string) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const id = useId();
  const [state, setState] = useState<DictationState>("idle");
  const [message, setMessage] = useState("");
  const [supported] = useState(() => Boolean(getRecognitionConstructor()));
  const session = useRef<ReturnType<typeof startDictation> | null>(null);
  const callbacks = useRef({ onChange, onBusyChange });
  callbacks.current = { onChange, onBusyChange };
  const busy = state !== "idle";
  useEffect(() => () => session.current?.dispose(), []);

  const dictate = () => {
    if (busy) {
      session.current?.stop();
      return;
    }
    const Recognition = getRecognitionConstructor();
    if (!Recognition) return;
    session.current?.dispose();
    setMessage("");
    session.current = startDictation({
      createRecognition: () => new Recognition(),
      initialText: value,
      onText: (text) => callbacks.current.onChange(text),
      onState: (next) => {
        setState(next);
        callbacks.current.onBusyChange?.(next !== "idle");
      },
      onError: setMessage,
    });
  };

  return (
    <div className="business-description">
      <label htmlFor={id}>
        Was macht Ihr Business? <span>Optional</span>
      </label>
      <div className="business-input">
        <textarea
          id={id}
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setMessage("");
          }}
          readOnly={busy}
          maxLength={BUSINESS_DESCRIPTION_MAX_LENGTH}
          rows={3}
          placeholder="Welches Problem lösen Sie, für wen – und wofür zahlen Kunden?"
          aria-describedby={`${id}-hint ${id}-status`}
        />
        <div className="business-input-tools">
          <button
            type="button"
            className="business-dictate"
            onClick={dictate}
            disabled={
              !supported ||
              state === "stopping" ||
              (!busy && value.length >= BUSINESS_DESCRIPTION_MAX_LENGTH)
            }
            aria-pressed={busy}
            aria-label={busy ? "Diktat stoppen" : "Diktat starten"}
            title={
              !supported ? "Dieser Browser unterstützt kein Diktat." : undefined
            }
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              {busy ? (
                <rect x="6" y="6" width="12" height="12" fill="currentColor" />
              ) : (
                <>
                  <rect
                    x="8"
                    y="2"
                    width="8"
                    height="13"
                    rx="4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </>
              )}
            </svg>
            {busy ? "Stopp" : "Diktieren"}
          </button>
          <span id={`${id}-status`} role="status">
            {state === "starting"
              ? "Mikrofon wird aktiviert …"
              : state === "listening"
                ? "Ich höre zu …"
                : state === "stopping"
                  ? "Diktat wird beendet …"
                  : ""}
          </span>
          {value.length >= 4500 && (
            <span className="business-count">
              {value.length.toLocaleString("de-DE")} / 5.000
            </span>
          )}
        </div>
      </div>
      <p className="business-hint" id={`${id}-hint`}>
        {supported
          ? "Diktat: Audio kann an den Sprachdienst Ihres Browsers gehen."
          : "Alternativ: die Diktierfunktion Ihres Geräts nutzen."}
      </p>
      {message && (
        <p className="business-message" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
