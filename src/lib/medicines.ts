import type { Habit, Medicine, MedicineViewStatus } from "../types.ts";
import { atTimeToday, todayKey } from "./time.ts";

export function takenToday(medicine: Medicine, now = new Date()) {
  if (!medicine.takenAt) return false;
  return todayKey(new Date(medicine.takenAt)) === todayKey(now);
}

export function statusOf(medicine: Medicine, now = new Date()): MedicineViewStatus {
  if (takenToday(medicine, now)) return "taken";
  const scheduled = atTimeToday(medicine.time, now);
  let due = scheduled;
  if (medicine.remindAt) {
    const remind = new Date(medicine.remindAt);
    if (remind.getTime() > now.getTime() && remind > scheduled) due = remind;
  }
  return now >= due ? "needs_attention" : "upcoming";
}

export function byTime(a: Medicine, b: Medicine) {
  return a.time.localeCompare(b.time);
}

export function priorityMedicine(list: Medicine[], now = new Date()) {
  const ranked = [...list].sort(byTime);
  const attention = ranked.find((medicine) => statusOf(medicine, now) === "needs_attention");
  if (attention) return attention;
  return ranked.find((medicine) => statusOf(medicine, now) === "upcoming") ?? null;
}

export function nextOpenMedicine(list: Medicine[], exceptId: string | null, now = new Date()) {
  return [...list]
    .filter((medicine) => medicine.id !== exceptId && statusOf(medicine, now) !== "taken")
    .sort(byTime)[0] ?? null;
}

export function completedCount(list: Medicine[], now = new Date()) {
  return list.filter((medicine) => statusOf(medicine, now) === "taken").length;
}

export function isDueMedicine(medicine: Medicine, now: Date) {
  if (takenToday(medicine, now) || !medicine.remindAt) return false;
  if (medicine.promptedKey === medicine.remindAt) return false;
  const at = new Date(medicine.remindAt);
  if (todayKey(at) !== todayKey(now)) return false;
  return at.getTime() <= now.getTime();
}

export function habitDoneToday(habit: Habit, now = new Date()) {
  return habit.doneOn === todayKey(now);
}

export function isDueHabit(habit: Habit, now: Date) {
  if (habitDoneToday(habit, now) || !habit.remindAt) return false;
  if (habit.promptedKey === habit.remindAt) return false;
  const at = new Date(habit.remindAt);
  if (todayKey(at) !== todayKey(now)) return false;
  return at.getTime() <= now.getTime();
}
