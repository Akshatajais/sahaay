import { AlertCircle, Check, ChevronRight, Clock, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiBlock, Button, ButtonLink, IconButton, Paragraph, StatusPill } from "../components/ui.tsx";
import { copy, medicineStatusCopy, reminderChoices, slotCopy } from "../i18n/copy.ts";
import { useText } from "../i18n/useText.ts";
import { cn } from "../lib/cn.ts";
import { formatHm, formatWhen, profileName } from "../lib/format.ts";
import { completedCount, priorityMedicine, statusOf } from "../lib/medicines.ts";
import { speak } from "../lib/speech.ts";
import { greeting } from "../lib/time.ts";
import { useApp } from "../state/AppState.tsx";
import type { Localized, MedicineViewStatus, TextSize } from "../types.ts";

const shortcuts = [
  { to: "/money", label: copy.money, image: "/icons/money.png", tone: "bg-[#E3F1FB]" },
  { to: "/medicines", label: copy.medicines, image: "/icons/medicines.png", tone: "bg-[#E5F6EA]" },
  { to: "/day", label: copy.myDay, image: "/icons/day.png", tone: "bg-[#FBF6EA]" },
  { to: "/help", label: copy.help, image: "/icons/help.png", tone: "bg-[#FBEAEA]" },
  { to: "/contacts", label: copy.family, image: "/icons/family.png", tone: "bg-[#F8E6D8]" },
  { to: "/settings", label: copy.settings, image: "/icons/settings.png", tone: "bg-[#E7EEF8]" },
];

const textSteps: TextSize[] = ["default", "large", "larger"];

const toneFor: Record<MedicineViewStatus, "care" | "amber" | "plain"> = {
  taken: "care",
  needs_attention: "amber",
  upcoming: "plain",
};

export function HomePage() {
  const { data, now, markMedicineTaken, remindMedicine, setLanguage, setTextSize } = useApp();
  const { t, lang } = useText();
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [remindOpen, setRemindOpen] = useState(false);
  const [speechNote, setSpeechNote] = useState<Localized | null>(null);
  const hello = greeting(now);
  const name = profileName(data.profile.nameEn, data.profile.nameHi, lang);
  const priority = priorityMedicine(data.medicines, now);
  const done = completedCount(data.medicines, now);
  const homeLabel = t(copy.home);
  const textIndex = textSteps.indexOf(data.settings.textSize);

  useEffect(() => {
    document.title = `SAHAAY — ${homeLabel}`;
    headingRef.current?.focus();
  }, [homeLabel]);

  function readMedicine() {
    if (!priority) return;
    const line =
      lang === "hi"
        ? `${priority.name}. ${slotCopy[priority.slot].hi}. ${formatHm(priority.time, "hi")}.`
        : `${priority.name}. ${slotCopy[priority.slot].en}. ${formatHm(priority.time, "en")}.`;
    const result = speak(line, lang);
    setSpeechNote(result === "missing" ? copy.speechUnavailable : result === "no-hindi-voice" ? copy.hindiVoiceMissing : null);
  }

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 flex-col gap-3">
        <div className="flex items-center justify-end gap-2">
          <div role="group" aria-label={t(copy.textSize)} className="inline-flex items-center gap-2">
            <button
              type="button"
              aria-label={t(copy.textSmaller)}
              disabled={textIndex <= 0}
              onClick={() => setTextSize(textSteps[textIndex - 1])}
              className="grid size-12 place-items-center rounded-full border border-navy/15 bg-white font-bold text-navy disabled:opacity-40"
            >
              <span aria-hidden="true" className="text-[0.85rem] leading-none">
                A−
              </span>
            </button>
            <button
              type="button"
              aria-label={t(copy.textBigger)}
              disabled={textIndex >= textSteps.length - 1}
              onClick={() => setTextSize(textSteps[textIndex + 1])}
              className="grid size-12 place-items-center rounded-full border border-navy/15 bg-white font-bold text-navy disabled:opacity-40"
            >
              <span aria-hidden="true" className="text-[1.2rem] leading-none">
                A+
              </span>
            </button>
          </div>
          <div
            role="group"
            aria-label={t(copy.language)}
            className="inline-flex h-12 shrink-0 items-stretch overflow-hidden rounded-full border border-navy/15 bg-white"
          >
          <button
            type="button"
            aria-pressed={lang === "en"}
            onClick={() => setLanguage("en")}
            className={cn(
              "min-w-12 px-3.5 text-[1rem] font-bold tracking-wide",
              lang === "en" ? "bg-navy text-white" : "text-muted",
            )}
          >
            EN
          </button>
          <span aria-hidden="true" className="w-px self-stretch bg-navy/15" />
          <button
            type="button"
            aria-pressed={lang === "hi"}
            onClick={() => setLanguage("hi")}
            className={cn(
              "min-w-12 px-3.5 text-[1rem] font-bold",
              lang === "hi" ? "bg-navy text-white" : "text-muted",
            )}
          >
            हिं
          </button>
          </div>
        </div>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-[1.7rem] font-extrabold leading-[1.1] tracking-tight text-navy outline-none"
          lang={lang}
        >
          <span className="block">{t(hello)},</span>
          <span className="block">{name}!</span>
        </h1>
      </div>

      {priority ? (
        <article className="mt-3 shrink-0 rounded-[24px] border border-navy/10 bg-care p-3.5">
          <div className="flex items-center justify-between gap-3">
            <StatusPill
              tone={toneFor[statusOf(priority, now)]}
              icon={statusOf(priority, now) === "needs_attention" ? <AlertCircle size={18} /> : <Clock size={18} />}
              label={medicineStatusCopy[statusOf(priority, now)]}
            />
            <IconButton label={t(copy.readAloud)} onClick={readMedicine}>
              <Volume2 aria-hidden="true" />
            </IconButton>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-[1.25rem] font-bold leading-tight text-navy" lang={lang}>
                {t(slotCopy[priority.slot])}
              </h2>
              <p className="mt-1 flex items-center gap-2 text-[1.15rem] font-bold text-navy">
                <Clock aria-hidden="true" size={20} />
                <span>{formatHm(priority.time, lang)}</span>
              </p>
              <p className="mt-1 text-[1.15rem] font-bold leading-tight text-navy">
                {priority.name}
              </p>
              {priority.remindAt && new Date(priority.remindAt) > now ? (
                <p className="mt-1 text-[1rem] font-semibold text-navy">
                  {t(copy.nextReminder)} · {formatWhen(priority.remindAt, lang)}
                </p>
              ) : null}
            </div>
            <img src="/icons/medicines.png" alt="" className="h-28 w-28 shrink-0 object-contain" />
          </div>
          {statusOf(priority, now) === "needs_attention" ? (
            <div className="mt-3">
              <Paragraph text={copy.unconfirmedNote} bilingual />
            </div>
          ) : null}
          <div className="mt-3 grid gap-2">
            <Button
              label={copy.markTaken}
              className="min-h-12 py-2"
              onClick={() => {
                markMedicineTaken(priority.id);
                navigate(`/medicines/${priority.id}/done`);
              }}
            />
            <button
              type="button"
              className="min-h-12 w-full rounded-2xl border border-navy/15 bg-white px-4"
              onClick={() => setRemindOpen(true)}
            >
              <BiBlock text={copy.remindLater} center />
            </button>
            {speechNote ? <Paragraph text={speechNote} /> : null}
          </div>
        </article>
      ) : (
        <article className="mt-3 shrink-0 rounded-[24px] border border-navy/10 bg-care p-3.5">
          <span className="grid size-14 place-items-center rounded-full bg-success text-white" aria-hidden="true">
            <Check size={28} strokeWidth={3} />
          </span>
          <h2 className="mt-3 text-[1.45rem] font-bold text-navy" lang={lang}>
            {t(copy.allDoneTitle)}!
          </h2>
          <p className="mt-1 text-[1.15rem] font-semibold text-success">
            {done}/{data.medicines.length}
          </p>
          <img src="/icons/medicines.png" alt="" className="mx-auto mt-2 h-28 w-28 object-contain" />
          <div className="mt-4">
            <ButtonLink to="/medicines" label={copy.seeMedicines} />
          </div>
        </article>
      )}

      <div className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain pb-1">
      <div className="grid grid-cols-2 gap-3">
        {shortcuts.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex min-h-32 flex-col justify-end gap-1 rounded-[22px] px-3 py-3 ${item.tone}`}
          >
            <img src={item.image} alt="" className="mx-auto h-16 w-16 object-contain" />
            <span className="flex items-center justify-between gap-1">
              <span className="text-[1.05rem] font-bold leading-tight text-navy">{t(item.label)}</span>
              <ChevronRight className="shrink-0 text-navy/35" aria-hidden="true" size={18} />
            </span>
          </Link>
        ))}
      </div>
      </div>

      {remindOpen && priority ? (
        <ReminderChoices
          onClose={() => setRemindOpen(false)}
          onPick={(minutes) => {
            remindMedicine(priority.id, minutes);
            setRemindOpen(false);
          }}
        />
      ) : null}
    </section>
  );
}

export function ReminderChoices({ onClose, onPick }: { onClose: () => void; onPick: (minutes: number) => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy/45 p-4 sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" className="w-full max-w-[440px] rounded-3xl bg-cream p-5">
        <BiBlock text={copy.chooseReminder} primaryClass="text-[1.4rem] font-bold text-navy" />
        <div className="mt-4 grid gap-3">
          {reminderChoices.map((choice) => (
            <button
              key={choice.minutes}
              type="button"
              className="min-h-14 rounded-2xl border border-navy/15 bg-white"
              onClick={() => onPick(choice.minutes)}
            >
              <BiBlock text={choice.label} center />
            </button>
          ))}
          <button type="button" className="min-h-14 rounded-2xl border border-navy/15 bg-white" onClick={onClose}>
            <BiBlock text={copy.close} center />
          </button>
        </div>
      </div>
    </div>
  );
}
