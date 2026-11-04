import type { HabitId, Relation } from "../types.ts";

export type VoiceIntent =
  | { type: "call"; relation: Relation | "any" }
  | { type: "nextMedicine" }
  | { type: "sendMoney" }
  | { type: "help" }
  | { type: "habit"; id: HabitId }
  | { type: "home" }
  | { type: "unknown" };

function has(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

export function interpret(raw: string): VoiceIntent {
  const text = raw.toLowerCase();
  if (has(text, ["send money", "पैसे भेज", "payment", "भुगतान"])) return { type: "sendMoney" };
  if (has(text, ["sos", "emergency", "आपातकाल", "बचाव"])) return { type: "help" };
  if (has(text, ["medicine", "दवा", "dawai", "tablet", "गोली"])) return { type: "nextMedicine" };
  if (has(text, ["water", "पानी"])) return { type: "habit", id: "water" };
  if (has(text, ["walk", "टहल"])) return { type: "habit", id: "walk" };
  if (has(text, ["stretch", "व्यायाम", "exercise"])) return { type: "habit", id: "stretch" };
  if (has(text, ["rest", "आराम", "break"])) return { type: "habit", id: "rest" };
  if (has(text, ["home", "होम"])) return { type: "home" };
  if (has(text, ["call", "कॉल", "phone", "फोन"])) {
    if (has(text, ["daughter", "beti", "बेटी"])) return { type: "call", relation: "daughter" };
    if (has(text, ["son", "beta", "बेटा"])) return { type: "call", relation: "son" };
    if (has(text, ["sister", "बहन"])) return { type: "call", relation: "sister" };
    if (has(text, ["brother", "भाई"])) return { type: "call", relation: "brother" };
    if (has(text, ["spouse", "पति", "पत्नी", "जीवनसाथी"])) return { type: "call", relation: "spouse" };
    if (has(text, ["friend", "मित्र"])) return { type: "call", relation: "friend" };
    return { type: "call", relation: "any" };
  }
  if (has(text, ["help", "मदद", "सहायता"])) return { type: "help" };
  return { type: "unknown" };
}
