import type { Lang, Localized, Settings } from "../types.ts";

export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function atTimeToday(hhmm: string, now = new Date()) {
  const [h, m] = hhmm.split(":").map(Number);
  const date = new Date(now);
  date.setHours(h || 0, m || 0, 0, 0);
  return date;
}

export function minutesOf(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function greeting(now = new Date()): Localized {
  const hour = now.getHours();
  if (hour < 12) return { en: "Good morning", hi: "सुप्रभात" };
  if (hour < 17) return { en: "Good afternoon", hi: "नमस्कार" };
  if (hour < 21) return { en: "Good evening", hi: "शुभ संध्या" };
  return { en: "Good night", hi: "शुभ रात्रि" };
}

export function isInQuiet(date: Date, settings: Pick<Settings, "quietHours" | "quietStart" | "quietEnd">) {
  if (!settings.quietHours) return false;
  const mins = date.getHours() * 60 + date.getMinutes();
  const start = minutesOf(settings.quietStart);
  const end = minutesOf(settings.quietEnd);
  if (start === end) return false;
  if (start < end) return mins >= start && mins < end;
  return mins >= start || mins < end;
}

export function shiftOutOfQuiet(from: Date, settings: Settings) {
  if (!isInQuiet(from, settings)) return { at: from, delayed: false };
  const end = minutesOf(settings.quietEnd);
  const at = new Date(from);
  at.setSeconds(0, 0);
  at.setHours(Math.floor(end / 60), end % 60, 0, 0);
  if (at.getTime() <= from.getTime()) at.setDate(at.getDate() + 1);
  return { at, delayed: true };
}

export function localeFor(lang: Lang) {
  return lang === "hi" ? "hi-IN" : "en-IN";
}

export function uid() {
  return crypto.randomUUID();
}
