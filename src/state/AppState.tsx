import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { loadState, seed, STORAGE_KEY } from "../data/seed.ts";
import { copy, familyMedicineNote, habitCopy, medicineSaved, reminderSet, sosRecorded } from "../i18n/copy.ts";
import { primaryText, whenLocalized } from "../lib/format.ts";
import { isDueHabit, isDueMedicine } from "../lib/medicines.ts";
import { playChime } from "../lib/speech.ts";
import { isInQuiet, shiftOutOfQuiet, todayKey, uid } from "../lib/time.ts";
import type {
  AppData,
  Banner,
  Contact,
  HabitId,
  Lang,
  Localized,
  Notice,
  Profile,
  ReminderPrompt,
  Settings,
  SosEvent,
  FamilyThreadKind,
  TextSize,
  Transaction,
} from "../types.ts";

type AppContextValue = {
  data: AppData;
  now: Date;
  banner: Banner | null;
  dismissBanner: () => void;
  live: string;
  prompt: ReminderPrompt | null;
  dismissPrompt: () => void;
  setLanguage: (language: Lang) => void;
  setTextSize: (textSize: TextSize) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  completeOnboarding: () => void;
  markMedicineTaken: (id: string) => void;
  markMedicinesTaken: (ids: string[]) => void;
  undoMedicine: (id: string) => void;
  remindMedicine: (id: string, minutes: number) => void;
  remindMedicines: (ids: string[], minutes: number) => void;
  setMedicineTime: (id: string, time: string) => void;
  markHabitDone: (id: HabitId) => void;
  undoHabit: (id: HabitId) => void;
  remindHabit: (id: HabitId, minutes: number) => void;
  setHabitTime: (id: HabitId, time: string) => void;
  saveContact: (contact: Contact) => void;
  removeContact: (id: string) => void;
  createTransaction: (input: Omit<Transaction, "id" | "createdAt">) => string;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  markNoticeRead: (id: string) => void;
  markAllNoticesRead: () => void;
  recordSos: () => SosEvent;
  cancelSos: (id: string) => void;
  addFamilyMessage: (contactId: string, kind: FamilyThreadKind, body: Localized) => void;
  resetDemo: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function makeNotice(partial: Omit<Notice, "id" | "createdAt" | "read"> & { read?: boolean }): Notice {
  return {
    id: uid(),
    createdAt: new Date().toISOString(),
    read: partial.read ?? false,
    kind: partial.kind,
    title: partial.title,
    body: partial.body,
    href: partial.href,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadState);
  const [now, setNow] = useState(() => new Date());
  const [banner, setBanner] = useState<Banner | null>(null);
  const [live, setLive] = useState("");
  const [prompt, setPrompt] = useState<ReminderPrompt | null>(null);
  const dataRef = useRef(data);
  const promptRef = useRef<ReminderPrompt | null>(null);
  const bannerTimer = useRef<number | null>(null);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    document.documentElement.dataset.text = data.settings.textSize;
    document.documentElement.lang = data.settings.language === "hi" ? "hi" : "en";
  }, [data.settings.language, data.settings.textSize]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = window.setInterval(tick, 30000);
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  useEffect(() => {
    const look = () => {
      if (promptRef.current) return;
      const current = dataRef.current;
      const moment = new Date();
      if (isInQuiet(moment, current.settings)) return;
      const medicine = current.medicines.find((item) => isDueMedicine(item, moment));
      if (medicine) {
        const next = { kind: "medicine" as const, id: medicine.id };
        promptRef.current = next;
        setPrompt(next);
        setData((prev) => ({
          ...prev,
          medicines: prev.medicines.map((item) =>
            item.id === medicine.id ? { ...item, promptedKey: item.remindAt } : item,
          ),
        }));
        return;
      }
      const habit = current.habits.find((item) => isDueHabit(item, moment));
      if (habit) {
        const next = { kind: "habit" as const, id: habit.id };
        promptRef.current = next;
        setPrompt(next);
        setData((prev) => ({
          ...prev,
          habits: prev.habits.map((item) =>
            item.id === habit.id ? { ...item, promptedKey: item.remindAt } : item,
          ),
        }));
      }
    };
    look();
    const id = window.setInterval(look, 15000);
    return () => window.clearInterval(id);
  }, []);

  function feedback(message: string) {
    setLive(message);
    const settings = dataRef.current.settings;
    if (settings.sound) {
      try {
        playChime();
      } catch {
        // The browser blocked audio. The visible state still confirms the action.
      }
    }
    if (settings.vibration && typeof navigator.vibrate === "function") {
      try {
        navigator.vibrate(40);
      } catch {
        // Vibration is unavailable. Do not claim the device vibrated.
      }
    }
  }

  function showBanner(text: Localized) {
    if (bannerTimer.current) window.clearTimeout(bannerTimer.current);
    const id = Date.now();
    setBanner({ id, text });
    bannerTimer.current = window.setTimeout(() => {
      setBanner((current) => (current?.id === id ? null : current));
    }, 12000);
  }

  function dismissBanner() {
    setBanner(null);
  }

  function dismissPrompt() {
    promptRef.current = null;
    setPrompt(null);
  }

  function setLanguage(language: Lang) {
    setData((prev) => ({ ...prev, settings: { ...prev.settings, language } }));
    const message = language === "hi" ? copy.languageSetHi : copy.languageSetEn;
    feedback(primaryText(message, language));
  }

  function setTextSize(textSize: TextSize) {
    setData((prev) => ({ ...prev, settings: { ...prev.settings, textSize } }));
  }

  function updateSettings(patch: Partial<Settings>) {
    setData((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  }

  function updateProfile(patch: Partial<Profile>) {
    setData((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }));
  }

  function completeOnboarding() {
    setData((prev) => ({ ...prev, onboarded: true }));
  }

  function markMedicinesTaken(ids: string[]) {
    const idSet = new Set(ids);
    const medicines = dataRef.current.medicines.filter((item) => idSet.has(item.id));
    if (!medicines.length) return;
    const names = dataRef.current.contacts.filter((item) => item.notifyMedicine).map((item) => item.name);
    const label = medicines.map((item) => item.name).join(", ");
    const share = names.length
      ? {
          en: `Saved on this device only. Demonstration mode does not message ${names.join(", ")}.`,
          hi: `केवल इस डिवाइस पर सहेजा गया। प्रदर्शन मोड ${names.join(", ")} को संदेश नहीं भेजता।`,
        }
      : null;
    setData((prev) => ({
      ...prev,
      medicines: prev.medicines.map((item) =>
        idSet.has(item.id) ? { ...item, takenAt: new Date().toISOString(), remindAt: null, promptedKey: null, snoozeCount: 0 } : item,
      ),
      notices: [
        makeNotice({
          kind: "medicine",
          title: copy.markedTaken,
          body: share ?? medicineSaved(label),
          href: `/medicines/${medicines[0].id}/done`,
        }),
        ...prev.notices,
      ].slice(0, 40),
    }));
    feedback(primaryText(medicineSaved(label), dataRef.current.settings.language));
    dismissPrompt();
  }

  function markMedicineTaken(id: string) {
    markMedicinesTaken([id]);
  }

  function undoMedicine(id: string) {
    setData((prev) => ({
      ...prev,
      medicines: prev.medicines.map((item) =>
        item.id === id ? { ...item, takenAt: null } : item,
      ),
    }));
  }

  function schedule(minutes: number) {
    const from = new Date(Date.now() + minutes * 60000);
    return shiftOutOfQuiet(from, dataRef.current.settings);
  }

  function remindMedicines(ids: string[], minutes: number) {
    const { at, delayed } = schedule(minutes);
    const nowMs = Date.now();
    const targets = ids.flatMap((id) => {
      const medicine = dataRef.current.medicines.find((item) => item.id === id);
      if (!medicine) return [];
      if (medicine.remindAt && new Date(medicine.remindAt).getTime() > nowMs) return [];
      return [medicine];
    });
    if (!targets.length) {
      showBanner(copy.reminderAlready);
      feedback(primaryText(copy.reminderAlready, dataRef.current.settings.language));
      return;
    }
    const idSet = new Set(targets.map((item) => item.id));
    const family = dataRef.current.contacts.filter((item) => item.notifyMedicine).map((item) => item.name);
    const crossed = targets.filter((item) => (item.snoozeCount ?? 0) < 2 && (item.snoozeCount ?? 0) + 1 >= 2);
    const familyNote = crossed.length && family.length ? familyMedicineNote(crossed.map((item) => item.name).join(", "), family.join(", ")) : null;
    const when = whenLocalized(at);
    setData((prev) => ({
      ...prev,
      medicines: prev.medicines.map((item) =>
        idSet.has(item.id)
          ? { ...item, remindAt: at.toISOString(), promptedKey: null, snoozeCount: (item.snoozeCount ?? 0) + 1 }
          : item,
      ),
      notices: familyNote
        ? [
            makeNotice({
              kind: "family",
              title: copy.family,
              body: familyNote,
              href: "/notifications",
            }),
            ...prev.notices,
          ].slice(0, 40)
        : prev.notices,
    }));
    const banner = familyNote ?? reminderSet(when.en, when.hi, delayed);
    showBanner(banner);
    feedback(primaryText(banner, dataRef.current.settings.language));
    dismissPrompt();
  }

  function remindMedicine(id: string, minutes: number) {
    remindMedicines([id], minutes);
  }

  function setMedicineTime(id: string, time: string) {
    setData((prev) => ({
      ...prev,
      medicines: prev.medicines.map((item) =>
        item.id === id ? { ...item, time, remindAt: null, promptedKey: null } : item,
      ),
    }));
  }

  function markHabitDone(id: HabitId) {
    setData((prev) => ({
      ...prev,
      habits: prev.habits.map((item) =>
        item.id === id ? { ...item, doneOn: todayKey(), remindAt: null, promptedKey: null } : item,
      ),
      notices: [
        makeNotice({
          kind: "habit",
          title: habitCopy[id].title,
          body: copy.markedDoneToday,
          href: "/day",
        }),
        ...prev.notices,
      ].slice(0, 40),
    }));
    feedback(primaryText(copy.markedDoneToday, dataRef.current.settings.language));
    dismissPrompt();
  }

  function undoHabit(id: HabitId) {
    setData((prev) => ({
      ...prev,
      habits: prev.habits.map((item) => (item.id === id ? { ...item, doneOn: null } : item)),
    }));
  }

  function remindHabit(id: HabitId, minutes: number) {
    const { at, delayed } = schedule(minutes);
    const when = whenLocalized(at);
    setData((prev) => ({
      ...prev,
      habits: prev.habits.map((item) =>
        item.id === id ? { ...item, remindAt: at.toISOString(), promptedKey: null } : item,
      ),
    }));
    showBanner(reminderSet(when.en, when.hi, delayed));
    dismissPrompt();
  }

  function setHabitTime(id: HabitId, time: string) {
    setData((prev) => ({
      ...prev,
      habits: prev.habits.map((item) => (item.id === id ? { ...item, time } : item)),
    }));
  }

  function saveContact(contact: Contact) {
    setData((prev) => {
      const exists = prev.contacts.some((item) => item.id === contact.id);
      return {
        ...prev,
        contacts: exists
          ? prev.contacts.map((item) => (item.id === contact.id ? contact : item))
          : [...prev.contacts, contact],
      };
    });
    showBanner(copy.savedContact);
  }

  function removeContact(id: string) {
    setData((prev) => ({ ...prev, contacts: prev.contacts.filter((item) => item.id !== id) }));
    showBanner(copy.removedContact);
  }

  function createTransaction(input: Omit<Transaction, "id" | "createdAt">) {
    const id = uid();
    const transaction: Transaction = { ...input, id, createdAt: new Date().toISOString() };
    setData((prev) => ({ ...prev, transactions: [transaction, ...prev.transactions].slice(0, 30) }));
    return id;
  }

  function updateTransaction(id: string, patch: Partial<Transaction>) {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  }

  function markNoticeRead(id: string) {
    setData((prev) => ({
      ...prev,
      notices: prev.notices.map((item) => (item.id === id ? { ...item, read: true } : item)),
    }));
  }

  function markAllNoticesRead() {
    setData((prev) => ({
      ...prev,
      notices: prev.notices.map((item) => ({ ...item, read: true })),
    }));
  }

  function recordSos() {
    const agreed = dataRef.current.contacts.filter((item) => item.notifySos);
    const event: SosEvent = {
      id: uid(),
      status: agreed.length ? "recorded" : "failed",
      createdAt: new Date().toISOString(),
      contactNames: agreed.map((item) => item.name),
    };
    const body = agreed.length ? sosRecorded(agreed.map((item) => item.name).join(", ")) : copy.sosNone;
    const title = agreed.length ? copy.recorded : copy.notSent;
    setData((prev) => ({
      ...prev,
      sosEvents: [event, ...prev.sosEvents].slice(0, 20),
      notices: [
        makeNotice({ kind: "sos", title, body, href: "/help" }),
        ...prev.notices,
      ].slice(0, 40),
    }));
    feedback(primaryText(body, dataRef.current.settings.language));
    return event;
  }

  function cancelSos(id: string) {
    setData((prev) => ({
      ...prev,
      sosEvents: prev.sosEvents.map((item) => (item.id === id ? { ...item, status: "cancelled" } : item)),
      notices: [
        makeNotice({ kind: "sos", title: copy.cancelled, body: copy.sosCancelled, href: "/help" }),
        ...prev.notices,
      ].slice(0, 40),
    }));
    feedback(primaryText(copy.sosCancelled, dataRef.current.settings.language));
  }

  function addFamilyMessage(contactId: string, kind: FamilyThreadKind, body: Localized) {
    setData((prev) => ({
      ...prev,
      familyThreads: [
        ...(prev.familyThreads ?? []),
        { id: uid(), contactId, kind, body, createdAt: new Date().toISOString() },
      ].slice(-80),
    }));
  }

  function resetDemo() {
    localStorage.removeItem(STORAGE_KEY);
    setData(seed());
    dismissPrompt();
    setBanner(null);
  }

  const value: AppContextValue = {
    data,
    now,
    banner,
    dismissBanner,
    live,
    prompt,
    dismissPrompt,
    setLanguage,
    setTextSize,
    updateSettings,
    updateProfile,
    completeOnboarding,
    markMedicineTaken,
    markMedicinesTaken,
    undoMedicine,
    remindMedicine,
    remindMedicines,
    setMedicineTime,
    markHabitDone,
    undoHabit,
    remindHabit,
    setHabitTime,
    saveContact,
    removeContact,
    createTransaction,
    updateTransaction,
    markNoticeRead,
    markAllNoticesRead,
    recordSos,
    cancelSos,
    addFamilyMessage,
    resetDemo,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
