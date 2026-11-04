import type { Lang, Localized } from "../types.ts";
import { localeFor, todayKey } from "./time.ts";

export function primaryText(text: Localized, lang: Lang) {
  return lang === "hi" ? text.hi : text.en;
}

export function secondaryText(text: Localized, lang: Lang) {
  return lang === "hi" ? text.en : text.hi;
}

export function formatRupees(amount: number, lang: Lang) {
  return new Intl.NumberFormat(localeFor(lang), {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatClock(date: Date, lang: Lang) {
  return new Intl.DateTimeFormat(localeFor(lang), {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatHm(hhmm: string, lang: Lang) {
  return formatClock(parseHm(hhmm), lang);
}

export function parseHm(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const date = new Date();
  date.setHours(h || 0, m || 0, 0, 0);
  return date;
}

export function formatDay(date: Date, lang: Lang) {
  return new Intl.DateTimeFormat(localeFor(lang), {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatWhen(iso: string, lang: Lang) {
  const date = new Date(iso);
  const today = todayKey();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const clock = formatClock(date, lang);
  if (todayKey(date) === today) {
    return lang === "hi" ? `आज, ${clock}` : `Today, ${clock}`;
  }
  if (todayKey(date) === todayKey(yesterday)) {
    return lang === "hi" ? `कल, ${clock}` : `Yesterday, ${clock}`;
  }
  return new Intl.DateTimeFormat(localeFor(lang), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function whenLocalized(date: Date): Localized {
  return { en: formatWhen(date.toISOString(), "en"), hi: formatWhen(date.toISOString(), "hi") };
}

export function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}

export function smsHref(phone: string, body: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return `sms:${digits}?body=${encodeURIComponent(body)}`;
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`;
  return letters.toUpperCase() || "?";
}

export function profileName(nameEn: string, nameHi: string, lang: Lang) {
  if (lang === "hi") return nameHi.trim() || nameEn.trim() || "अम्मा";
  return nameEn.trim() || nameHi.trim() || "Amma";
}

export function otherProfileName(nameEn: string, nameHi: string, lang: Lang) {
  return profileName(nameEn, nameHi, lang === "hi" ? "en" : "hi");
}
