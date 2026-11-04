import { Bed, Droplets, Footprints, PersonStanding } from "lucide-react";
import { useState } from "react";
import { ReminderChoices } from "./HomePage.tsx";
import { BiBlock, Card, Screen } from "../components/ui.tsx";
import { copy, habitCopy } from "../i18n/copy.ts";
import { useText } from "../i18n/useText.ts";
import { formatHm } from "../lib/format.ts";
import { habitDoneToday } from "../lib/medicines.ts";
import { useApp } from "../state/AppState.tsx";
import type { HabitId } from "../types.ts";

const icons: Record<HabitId, typeof Droplets> = {
  water: Droplets,
  walk: Footprints,
  stretch: PersonStanding,
  rest: Bed,
};

const tones: Record<HabitId, string> = {
  water: "bg-money",
  walk: "bg-care",
  stretch: "bg-amber",
  rest: "bg-blush",
};

export function MyDayPage() {
  const { data, now, markHabitDone, undoHabit, remindHabit, setHabitTime } = useApp();
  const { t, lang } = useText();
  const [remindId, setRemindId] = useState<HabitId | null>(null);

  return (
    <Screen title={copy.habitsTitle}>
      <div className="grid gap-4">
        {data.habits.map((habit) => {
          const Icon = icons[habit.id];
          const done = habitDoneToday(habit, now);
          return (
            <Card key={habit.id} className={tones[habit.id]}>
              <div className="flex items-start gap-3">
                <span className="grid size-20 place-items-center rounded-3xl bg-white/80 text-navy" aria-hidden="true">
                  <Icon size={40} />
                </span>
                <div className="min-w-0">
                  <BiBlock text={habitCopy[habit.id].title} primaryClass="text-[1.3rem] font-bold text-navy" />
                </div>
              </div>
              <label className="mt-4 block" htmlFor={`habit-${habit.id}`}>
                <BiBlock text={copy.habitTime} primaryClass="text-[1rem] font-bold text-navy" />
              </label>
              <input
                id={`habit-${habit.id}`}
                className="mt-2"
                type="time"
                value={habit.time}
                onChange={(event) => setHabitTime(habit.id, event.target.value)}
              />
              <p className="mt-2 font-semibold text-navy">{formatHm(habit.time, lang)}</p>
              {done ? (
                <div className="mt-4 grid gap-3">
                  <p className="font-bold text-success">{t(copy.markedDoneToday)}</p>
                  <button type="button" className="min-h-14 rounded-2xl border border-navy/15 bg-white" onClick={() => undoHabit(habit.id)}>
                    <BiBlock text={copy.undo} center />
                  </button>
                </div>
              ) : (
                <div className="mt-4 grid gap-3">
                  <button type="button" className="min-h-14 rounded-2xl bg-navy text-white" onClick={() => markHabitDone(habit.id)}>
                    <BiBlock text={copy.done} center primaryClass="text-[1.05rem] font-bold" secondaryClass="text-[0.9rem] opacity-90" />
                  </button>
                  <button type="button" className="min-h-14 rounded-2xl border border-navy/15 bg-white" onClick={() => setRemindId(habit.id)}>
                    <BiBlock text={copy.remindLater} center />
                  </button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
      {remindId ? (
        <ReminderChoices
          onClose={() => setRemindId(null)}
          onPick={(minutes) => {
            remindHabit(remindId, minutes);
            setRemindId(null);
          }}
        />
      ) : null}
    </Screen>
  );
}
