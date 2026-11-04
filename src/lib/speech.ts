import type { Lang } from "../types.ts";

type RecResult = { results: ArrayLike<ArrayLike<{ transcript: string }>> };

export type SpeechRec = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: RecResult) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type RecCtor = new () => SpeechRec;

function recognitionCtor() {
  const w = window as Window & {
    SpeechRecognition?: RecCtor;
    webkitSpeechRecognition?: RecCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export function recognitionSupported() {
  return Boolean(recognitionCtor());
}

export function createRecognition() {
  const Ctor = recognitionCtor();
  if (!Ctor) return null;
  return new Ctor();
}

export function speak(text: string, lang: Lang): "ok" | "missing" | "no-hindi-voice" {
  if (!("speechSynthesis" in window)) return "missing";
  const voices = window.speechSynthesis.getVoices();
  const hindiMissing =
    lang === "hi" && voices.length > 0 && !voices.some((voice) => voice.lang.toLowerCase().startsWith("hi"));
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang === "hi" ? "hi-IN" : "en-IN";
  utter.rate = 0.92;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
  return hindiMissing ? "no-hindi-voice" : "ok";
}

export function playChime() {
  const Ctx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  const ctx = new Ctx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 587;
  gain.gain.value = 0.04;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  const stopAt = ctx.currentTime + 0.35;
  gain.gain.exponentialRampToValueAtTime(0.0001, stopAt);
  osc.stop(stopAt);
  osc.onended = () => {
    void ctx.close();
  };
}
