import { primaryText, secondaryText } from "../lib/format.ts";
import { useApp } from "../state/AppState.tsx";
import type { Lang, Localized } from "../types.ts";

export function useText() {
  const { data } = useApp();
  const lang = data.settings.language;
  const other: Lang = lang === "hi" ? "en" : "hi";
  return {
    lang,
    other,
    t: (text: Localized) => primaryText(text, lang),
    s: (text: Localized) => secondaryText(text, lang),
  };
}
