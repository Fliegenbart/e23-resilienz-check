import { afterEach, describe, expect, it, vi } from "vitest";
import * as dictation from "../src/quick/dictation";

class Recognition {
  lang = "";
  continuous = false;
  interimResults = false;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;
  onresult:
    | ((event: {
        results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>;
      }) => void)
    | null = null;
  start = vi.fn();
  stop = vi.fn();
  abort = vi.fn();
  result(...parts: [string, boolean][]) {
    this.onresult?.({
      results: parts.map(([transcript, isFinal]) => ({
        0: { transcript },
        isFinal,
      })),
    });
  }
}

function setup(initialText = "Wir bieten Software.") {
  expect(dictation).toHaveProperty("startDictation");
  const recognition = new Recognition();
  const onText = vi.fn(),
    onState = vi.fn(),
    onError = vi.fn();
  const session = dictation.startDictation({
    createRecognition: () => recognition,
    initialText,
    onText,
    onState,
    onError,
  });
  return { recognition, session, onText, onState, onError };
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("Diktieren", () => {
  it("erkennt beide Browser-Varianten, ohne das Mikrofon zu starten", () => {
    vi.stubGlobal("window", { SpeechRecognition: Recognition });
    expect(dictation.getRecognitionConstructor()).toBe(Recognition);
    vi.stubGlobal("window", { webkitSpeechRecognition: Recognition });
    expect(dictation.getRecognitionConstructor()).toBe(Recognition);
    vi.stubGlobal("window", {});
    expect(dictation.getRecognitionConstructor()).toBeUndefined();
  });

  it("erhält den vorhandenen Absatz beim Anhängen eines Diktats", () => {
    const { recognition, onText } = setup("Wir bieten Software.\n");
    recognition.result(["Für kleine Teams.", true]);
    expect(onText).toHaveBeenLastCalledWith(
      "Wir bieten Software.\nFür kleine Teams.",
    );
  });

  it("startet nur auf Aufruf, auf Deutsch und mit sichtbarem Status", () => {
    const { recognition, onState } = setup();
    expect(recognition.start).toHaveBeenCalledOnce();
    expect(recognition.lang).toBe("de-DE");
    expect(recognition.continuous).toBe(true);
    expect(recognition.interimResults).toBe(true);
    expect(onState).toHaveBeenLastCalledWith("starting");
    recognition.onstart?.();
    expect(onState).toHaveBeenLastCalledWith("listening");
  });

  it("korrigiert vorläufige Wörter und dupliziert wiederholte Ergebnisse nicht", () => {
    const { recognition, onText } = setup();
    recognition.result(["Für kleine Tee", false]);
    recognition.result(["Für kleine Teams.", true]);
    recognition.result(
      ["Für kleine Teams.", true],
      ["Wir planen Schichten.", false],
    );
    recognition.result(
      ["Für kleine Teams.", true],
      ["Wir planen Schichten.", true],
    );
    expect(onText).toHaveBeenLastCalledWith(
      "Wir bieten Software. Für kleine Teams. Wir planen Schichten.",
    );
  });

  it("übernimmt nach Stopp noch das letzte Ergebnis", () => {
    const { recognition, session, onText, onState } = setup("");
    session.stop();
    expect(recognition.stop).toHaveBeenCalledOnce();
    expect(onState).toHaveBeenLastCalledWith("stopping");
    recognition.result(["Unser Geschäftsmodell.", true]);
    recognition.onend?.();
    expect(onText).toHaveBeenLastCalledWith("Unser Geschäftsmodell.");
    expect(onState).toHaveBeenLastCalledWith("idle");
  });

  it("beendet einen hängenden Browser nach Stopp und ignoriert späte Ergebnisse", () => {
    vi.useFakeTimers();
    const { recognition, session, onText, onState } = setup();
    const lateResult = recognition.onresult;
    session.stop();
    vi.advanceTimersByTime(3000);
    expect(recognition.abort).toHaveBeenCalledOnce();
    expect(onState).toHaveBeenLastCalledWith("idle");
    lateResult?.({
      results: [{ 0: { transcript: "Zu spät" }, isFinal: true }],
    });
    expect(onText).not.toHaveBeenCalled();
  });

  it("stoppt beim Verlassen und verändert danach keine Eingaben mehr", () => {
    const { recognition, session, onText, onState } = setup();
    const lateResult = recognition.onresult;
    session.dispose();
    expect(recognition.abort).toHaveBeenCalledOnce();
    lateResult?.({
      results: [{ 0: { transcript: "Zu spät" }, isFinal: true }],
    });
    expect(onText).not.toHaveBeenCalled();
    expect(onState).toHaveBeenCalledTimes(1);
  });

  it.each([
    "not-allowed",
    "service-not-allowed",
    "network",
    "no-speech",
    "audio-capture",
  ])("erklärt %s und erhält bereits erkannten Text", (error) => {
    const { recognition, onText, onState, onError } = setup();
    recognition.result(["Für kleine Teams.", true]);
    recognition.onerror?.({ error });
    expect(onError).toHaveBeenCalledWith(expect.any(String));
    expect(onState).toHaveBeenLastCalledWith("idle");
    expect(onText).toHaveBeenLastCalledWith(
      "Wir bieten Software. Für kleine Teams.",
    );
    expect(recognition.abort).toHaveBeenCalledOnce();
  });

  it("fängt einen gescheiterten Mikrofonstart ab", () => {
    expect(dictation).toHaveProperty("startDictation");
    const recognition = new Recognition();
    recognition.start.mockImplementation(() => {
      throw new DOMException("denied", "NotAllowedError");
    });
    const onError = vi.fn(),
      onState = vi.fn();
    expect(() =>
      dictation.startDictation({
        createRecognition: () => recognition,
        initialText: "Vorhanden",
        onText: vi.fn(),
        onError,
        onState,
      }),
    ).not.toThrow();
    expect(onError).toHaveBeenCalledWith(expect.stringContaining("Mikrofon"));
    expect(onState).toHaveBeenLastCalledWith("idle");
  });

  it("begrenzt das Diktat auf die speicherbare Textlänge", () => {
    const { recognition, onText, onState, onError } = setup("x".repeat(4995));
    recognition.result(["Noch ein langer Satz", true]);
    expect(onText.mock.lastCall?.[0]).toHaveLength(5000);
    expect(onState).toHaveBeenLastCalledWith("idle");
    expect(onError).toHaveBeenCalledWith(expect.stringContaining("5.000"));
    expect(recognition.abort).toHaveBeenCalledOnce();
  });
});
