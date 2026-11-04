export type Lang = "en" | "hi";

export type Localized = {
  en: string;
  hi: string;
};

export type TextSize = "default" | "large" | "larger";

export type MedicineSlot = "morning" | "afternoon" | "night";

export type MedicineViewStatus = "taken" | "upcoming" | "needs_attention";

export type Medicine = {
  id: string;
  name: string;
  dose: string;
  slot: MedicineSlot;
  time: string;
  takenAt: string | null;
  remindAt: string | null;
  promptedKey: string | null;
  snoozeCount?: number;
};

export type Relation =
  | "daughter"
  | "son"
  | "sister"
  | "brother"
  | "spouse"
  | "friend"
  | "other";

export type Contact = {
  id: string;
  name: string;
  relation: Relation;
  phone: string;
  upiId: string;
  notifyMedicine: boolean;
  notifyPayment: boolean;
  notifySos: boolean;
};

export type TxStatus = "success" | "failed" | "pending" | "cancelled";

export type Transaction = {
  id: string;
  direction: "sent" | "received";
  contactId: string | null;
  name: string;
  amount: number;
  createdAt: string;
  status: TxStatus;
  reason?: "limit" | "demo";
};

export type HabitId = "water" | "walk" | "stretch" | "rest";

export type Habit = {
  id: HabitId;
  time: string;
  doneOn: string | null;
  remindAt: string | null;
  promptedKey: string | null;
};

export type NoticeKind = "medicine" | "payment" | "family" | "sos" | "habit" | "system";

export type Notice = {
  id: string;
  kind: NoticeKind;
  title: Localized;
  body: Localized;
  createdAt: string;
  read: boolean;
  href?: string;
};

export type SosStatus = "recorded" | "cancelled" | "failed";

export type SosEvent = {
  id: string;
  status: SosStatus;
  createdAt: string;
  contactNames: string[];
};

export type FamilyThreadKind = "call" | "sos" | "assist";

export type FamilyThreadMessage = {
  id: string;
  contactId: string;
  kind: FamilyThreadKind;
  body: Localized;
  createdAt: string;
};

export type Settings = {
  language: Lang;
  textSize: TextSize;
  sound: boolean;
  vibration: boolean;
  voiceGuidance: boolean;
  quietHours: boolean;
  quietStart: string;
  quietEnd: string;
  sharePayments: boolean;
};

export type Profile = {
  nameEn: string;
  nameHi: string;
};

export type ReminderPrompt =
  | { kind: "medicine"; id: string }
  | { kind: "habit"; id: HabitId };

export type AppData = {
  version: 1;
  onboarded: boolean;
  settings: Settings;
  profile: Profile;
  medicines: Medicine[];
  habits: Habit[];
  contacts: Contact[];
  transactions: Transaction[];
  notices: Notice[];
  sosEvents: SosEvent[];
  familyThreads: FamilyThreadMessage[];
};

export type Banner = {
  id: number;
  text: Localized;
};
