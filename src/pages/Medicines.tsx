import { AlertCircle, Calendar, Check, ChevronDown, Clock, Moon, Sun, Sunrise, Utensils, Volume2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ReminderChoices } from "./HomePage.tsx";
import { BiBlock, Button, ButtonLink, Card, Dialog, IconButton, Paragraph, Screen } from "../components/ui.tsx";
import { copy, dayGroupCopy, familyMedicineNote, medicineCountLabel, medicineStatusCopy, slotCopy, slotWhenCopy, takenOfLabel } from "../i18n/copy.ts";
import { useText } from "../i18n/useText.ts";
import { cn } from "../lib/cn.ts";
import { formatHm } from "../lib/format.ts";
import { byTime, nextOpenMedicine, statusOf } from "../lib/medicines.ts";
import { speak } from "../lib/speech.ts";
import { localeFor } from "../lib/time.ts";
import { useApp } from "../state/AppState.tsx";
import type { Lang, Localized, Medicine, MedicineSlot, MedicineViewStatus } from "../types.ts";

const badgeTone: Record<MedicineViewStatus, string> = {
  taken: "bg-[#D9F5E4] text-[#157A45]",
  upcoming: "bg-[#E3F1FB] text-navy",
  needs_attention: "bg-amber text-amber-ink",
};

const cardTone: Record<MedicineViewStatus, string> = {
  taken: "border-[#D3EEDD] bg-[#E7F7EE]",
  upcoming: "border-[#E4E9F4] bg-white",
  needs_attention: "border-[#F3D7A2] bg-white",
};

const groupOrder: MedicineSlot[] = ["morning", "afternoon", "night"];

const groupIcon: Record<MedicineSlot, typeof Sunrise> = {
  morning: Sunrise,
  afternoon: Sun,
  night: Moon,
};

const cardFace: Record<"taken" | "due" | "upcoming" | "overdue", string> = {
  taken: "border-[#B7E4C7] bg-[#E5F6EA]",
  due: "border-[#F3D7A2] bg-[#FFF6E8]",
  upcoming: "border-[#C9DFF3] bg-[#E7F3FB]",
  overdue: "border-[#F0C2C2] bg-[#FDECEC]",
};

const pillArt = ["/icons/pill-pink.png", "/icons/pill-green.png", "/icons/pill-lilac.png", "/icons/pill-white.png"];

const pillById: Record<string, string> = {
  "med-morning": "/icons/pill-pink.png",
  "med-morning-aspirin": "/icons/pill-white.png",
  "med-afternoon": "/icons/pill-green.png",
  "med-afternoon-d3": "/icons/pill-yellow.png",
  "med-night": "/icons/pill-lilac.png",
};

function pillSrc(medicine: Medicine) {
  return pillById[medicine.id] ?? pillArt[Math.abs(medicine.id.length) % pillArt.length];
}

function medicineSpeech(medicine: Medicine, lang: "en" | "hi") {
  const when = formatHm(medicine.time, lang);
  const meal = slotWhenCopy[medicine.slot][lang];
  return `${medicine.name}. ${meal}. ${when}.`;
}

function viewStatus(medicine: Medicine, now: Date): "taken" | "due" | "upcoming" | "overdue" {
  const status = statusOf(medicine, now);
  if (status === "taken") return "taken";
  if (status === "upcoming") return "upcoming";
  return (medicine.snoozeCount ?? 0) >= 2 ? "overdue" : "due";
}

function compactDate(date: Date, lang: Lang) {
  const locale = localeFor(lang);
  return {
    day: new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(date),
    weekday: new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date),
  };
}

export function MedicinesPage() {
  const { data, now, markMedicineTaken, markMedicinesTaken, remindMedicines } = useApp();
  const { t, lang } = useText();
  const [speechNote, setSpeechNote] = useState<Localized | null>(null);
  const [open, setOpen] = useState<Record<MedicineSlot, boolean>>({ morning: true, afternoon: true, night: true });
  const [confirmIds, setConfirmIds] = useState<string[] | null>(null);
  const ordered = [...data.medicines].sort(byTime);
  const done = ordered.filter((item) => statusOf(item, now) === "taken").length;
  const date = compactDate(now, lang);
  const groups = groupOrder
    .map((slot) => ({ slot, items: ordered.filter((item) => item.slot === slot) }))
    .filter((group) => group.items.length > 0);
  const confirming = confirmIds ? ordered.filter((item) => confirmIds.includes(item.id)) : [];

  function readMedicine(medicine: Medicine) {
    const result = speak(medicineSpeech(medicine, lang), lang);
    setSpeechNote(result === "missing" ? copy.speechUnavailable : result === "no-hindi-voice" ? copy.hindiVoiceMissing : null);
  }

  return (
    <Screen
      title={copy.todaysMedicines}
      heading="single"
      trailing={
        <span className="flex items-center gap-2 rounded-2xl border border-navy/10 bg-white px-3 py-2 text-navy">
          <Calendar aria-hidden="true" size={22} />
          <span className="text-left leading-tight">
            <span className="block text-[1rem] font-extrabold">{date.day}</span>
            <span className="block text-[0.85rem] font-bold text-muted">{date.weekday}</span>
          </span>
        </span>
      }
    >
      <div className="mb-4">
        <p className="text-[1.05rem] font-bold text-navy">{t(takenOfLabel(done, ordered.length))}</p>
        <div
          className="mt-2 h-3 overflow-hidden rounded-full bg-[#E4E9F4]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={ordered.length}
          aria-valuenow={done}
          aria-label={t(takenOfLabel(done, ordered.length))}
        >
          <div className="h-full rounded-full bg-[#1F8A4C]" style={{ width: `${ordered.length ? (done / ordered.length) * 100 : 0}%` }} />
        </div>
      </div>
      <div className="grid gap-4">
        {groups.map((group) => {
          const Icon = groupIcon[group.slot];
          const taken = group.items.filter((item) => statusOf(item, now) === "taken").length;
          const due = group.items.filter((item) => {
            const status = viewStatus(item, now);
            return status === "due" || status === "overdue";
          });
          const waiting = due.filter((item) => !(item.remindAt && new Date(item.remindAt).getTime() > now.getTime()));
          const started = group.items.some((item) => statusOf(item, now) !== "upcoming");
          const allTaken = group.items.every((item) => statusOf(item, now) === "taken");
          const earlierOpen = groups
            .slice(0, groups.findIndex((item) => item.slot === group.slot))
            .some((item) => item.items.some((medicine) => statusOf(medicine, now) !== "taken"));
          const expanded = open[group.slot];
          return (
            <section key={group.slot} className={cn("rounded-[28px] border p-3", allTaken ? "border-[#B7E4C7] bg-[#E7F7EE]" : "border-navy/10 bg-white")}>
              <div className="grid grid-cols-[3rem_minmax(0,1fr)_3rem] items-start gap-2">
                <span className={cn("grid size-12 place-items-center rounded-2xl", group.slot === "night" ? "bg-[#F3E8F8] text-[#6A4C93]" : "bg-[#FFF4E0] text-[#C9842A]")}>
                  <Icon aria-hidden="true" size={24} />
                </span>
                <div className="min-w-0">
                  <h2 className="text-[1.35rem] font-extrabold leading-tight text-navy">{t(dayGroupCopy[group.slot])}</h2>
                  <p className="text-[1rem] font-semibold leading-snug text-ink">
                    {formatHm(group.items[0].time, lang)}
                    <span className="text-muted"> · {t(slotWhenCopy[group.slot])}</span>
                  </p>
                  <span className={cn("mt-1 inline-flex rounded-full px-3 py-1 text-[0.9rem] font-bold", started ? "bg-[#E5F6EA] text-[#157A45]" : "bg-[#E7F3FB] text-navy")}>
                    {t(started ? takenOfLabel(taken, group.items.length) : medicineCountLabel(group.items.length))}
                  </span>
                </div>
                <button
                  type="button"
                  className="grid size-12 place-items-center rounded-2xl text-navy"
                  aria-expanded={expanded}
                  aria-label={t(dayGroupCopy[group.slot])}
                  onClick={() => setOpen((prev) => ({ ...prev, [group.slot]: !prev[group.slot] }))}
                >
                  <ChevronDown aria-hidden="true" size={24} className={cn("transition-transform", expanded && "rotate-180")} />
                </button>
              </div>
              {expanded ? (
                <>
                  <div className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
                    {group.items.map((medicine) => {
                      const status = viewStatus(medicine, now);
                      return (
                        <article key={medicine.id} className={cn("relative shrink-0 snap-start rounded-[24px] border p-3", group.items.length > 1 ? "w-[82%]" : "w-full", cardFace[status])}>
                          <IconButton className="absolute top-2 right-2" label={t(copy.readAloud)} onClick={() => readMedicine(medicine)}>
                            <Volume2 aria-hidden="true" size={20} />
                          </IconButton>
                          <Link to={`/medicines/${medicine.id}`} className="block pr-12">
                            <img src={pillSrc(medicine)} alt="" className="mx-auto h-28 w-full object-contain" />
                            <span className="mt-2 block text-[1.25rem] font-extrabold leading-tight text-navy">{medicine.name}</span>
                            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[0.95rem] font-bold text-navy">
                              <Utensils aria-hidden="true" size={15} />
                              {t(slotWhenCopy[medicine.slot])}
                            </span>
                          </Link>
                          <div className="mt-3">
                            {status === "taken" ? (
                              <p className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#157A45] text-[1.1rem] font-extrabold text-white">
                                <Check aria-hidden="true" size={22} strokeWidth={3} />
                                {t(copy.taken)}
                              </p>
                            ) : status === "upcoming" ? (
                              <p className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white text-[1.05rem] font-extrabold text-navy">
                                <Clock aria-hidden="true" size={18} />
                                {t(copy.upcoming)}
                              </p>
                            ) : (
                              <div className="grid gap-2">
                                {status === "overdue" ? (
                                  <p className="flex items-center justify-center gap-1 text-[1rem] font-extrabold text-[#8E1B28]">
                                    <AlertCircle aria-hidden="true" size={16} />
                                    {t(copy.overdue)}
                                  </p>
                                ) : null}
                                <button
                                  type="button"
                                  className={cn(
                                    "flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl text-[1.05rem] font-extrabold text-white",
                                    status === "overdue" ? "bg-[#C83D42]" : "bg-[#E07A2A]",
                                  )}
                                  onClick={() => markMedicineTaken(medicine.id)}
                                >
                                  <Clock aria-hidden="true" size={18} />
                                  {t(copy.takeNow)}
                                </button>
                              </div>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                  {due.length > 0 && !earlierOpen ? (
                    <div className="mt-3 grid gap-2">
                      <button
                        type="button"
                        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-navy/10 bg-[#F7F8FC] text-[1.05rem] font-extrabold text-navy"
                        onClick={() => setConfirmIds(due.map((item) => item.id))}
                      >
                        <Check aria-hidden="true" size={18} strokeWidth={3} />
                        {t(copy.markRemaining)} ({due.length})
                      </button>
                      <button
                        type="button"
                        className="min-h-14 w-full rounded-2xl border border-navy/15 bg-white disabled:opacity-50"
                        disabled={waiting.length === 0}
                        onClick={() => remindMedicines(waiting.map((item) => item.id), 10)}
                      >
                        <BiBlock text={waiting.length ? copy.remindLater : copy.reminderAlready} center />
                      </button>
                      {due.some((item) => (item.snoozeCount ?? 0) >= 2) && data.contacts.some((person) => person.notifyMedicine) ? (
                        <Paragraph
                          text={familyMedicineNote(
                            due.filter((item) => (item.snoozeCount ?? 0) >= 2).map((item) => item.name).join(", "),
                            data.contacts.filter((person) => person.notifyMedicine).map((person) => person.name).join(", "),
                          )}
                          bilingual
                        />
                      ) : null}
                    </div>
                  ) : null}
                </>
              ) : null}
            </section>
          );
        })}
      </div>
      {speechNote ? (
        <div className="mt-3">
          <Paragraph text={speechNote} />
        </div>
      ) : null}
      <Dialog
        open={confirmIds !== null}
        title={copy.confirmMarkRemaining}
        confirmLabel={copy.markRemaining}
        cancelLabel={copy.close}
        onClose={() => setConfirmIds(null)}
        onConfirm={() => {
          if (confirmIds) markMedicinesTaken(confirmIds);
          setConfirmIds(null);
        }}
      >
        <ul className="grid gap-2">
          {confirming.map((medicine) => (
            <li key={medicine.id} className="text-[1.1rem] font-bold text-navy">
              {medicine.name}
            </li>
          ))}
        </ul>
      </Dialog>
    </Screen>
  );
}

function StatusPill({ status }: { status: MedicineViewStatus }) {
  const { t } = useText();
  const icon = status === "taken" ? <Check size={14} strokeWidth={3} /> : status === "upcoming" ? <Clock size={14} /> : <AlertCircle size={14} />;
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.85rem] font-bold", badgeTone[status])}>
      {icon}
      {t(medicineStatusCopy[status])}
    </span>
  );
}

function MedicineCard({
  medicine,
  to,
  onSpeak,
  footer,
}: {
  medicine: Medicine;
  to?: string;
  onSpeak?: () => void;
  footer?: ReactNode;
}) {
  const { now } = useApp();
  const { t, lang } = useText();
  const status = statusOf(medicine, now);
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <StatusPill status={status} />
        {onSpeak ? (
          <IconButton label={t(copy.readAloud)} onClick={onSpeak}>
            <Volume2 aria-hidden="true" />
          </IconButton>
        ) : null}
      </div>
      <img src={pillSrc(medicine)} alt="" className="mx-auto mt-2 h-28 w-full object-contain" />
      <p className="mt-1 text-[1.35rem] font-extrabold leading-tight text-navy">{medicine.name}</p>
      <p className="mt-1 flex items-center gap-1.5 text-[1.05rem] font-bold text-navy">
        <Clock aria-hidden="true" size={16} />
        {formatHm(medicine.time, lang)}
      </p>
      <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[0.95rem] font-bold text-navy">
        <Utensils aria-hidden="true" size={15} />
        {t(slotWhenCopy[medicine.slot])}
      </p>
      {status === "needs_attention" ? (
        <div className="mt-3">
          <Paragraph text={copy.unconfirmedNote} bilingual />
        </div>
      ) : null}
      {footer}
    </>
  );
  const className = cn("block rounded-[28px] border p-3.5", cardTone[status]);
  if (to) {
    return (
      <Link to={to} className={className}>
        {body}
      </Link>
    );
  }
  return <article className={className}>{body}</article>;
}

export function MedicineDetailPage() {
  const { id } = useParams();
  const { data, now, markMedicineTaken, remindMedicine, setMedicineTime } = useApp();
  const { t, lang } = useText();
  const navigate = useNavigate();
  const medicine = data.medicines.find((item) => item.id === id);
  const [remindOpen, setRemindOpen] = useState(false);
  const [speechNote, setSpeechNote] = useState<Localized | null>(null);
  if (!medicine) {
    return (
      <Screen title={copy.medicines} backTo="/medicines">
        <Paragraph text={copy.medicineMissing} />
      </Screen>
    );
  }
  const status = statusOf(medicine, now);
  return (
    <Screen title={slotCopy[medicine.slot]} backTo="/medicines">
      <MedicineCard medicine={medicine} />
      <div className="mt-4">
        <Paragraph text={copy.savedNote} bilingual />
      </div>
      <div className="mt-4">
        <label htmlFor="med-time" className="mb-2 block">
          <BiBlock text={copy.reminderTime} primaryClass="text-[1.05rem] font-bold text-navy" />
        </label>
        <input
          id="med-time"
          type="time"
          value={medicine.time}
          onChange={(event) => setMedicineTime(medicine.id, event.target.value)}
        />
      </div>
      <div className="mt-4">
        <IconButton
          label={t(copy.readAloud)}
          onClick={() => {
            const result = speak(medicineSpeech(medicine, lang), lang);
            setSpeechNote(result === "missing" ? copy.speechUnavailable : result === "no-hindi-voice" ? copy.hindiVoiceMissing : null);
          }}
        >
          <Volume2 aria-hidden="true" />
        </IconButton>
        {speechNote ? (
          <div className="mt-2">
            <Paragraph text={speechNote} />
          </div>
        ) : null}
      </div>
      {status === "taken" ? (
        <div className="mt-4">
          <Paragraph text={copy.markedTaken} />
        </div>
      ) : (
        <div className="mt-4 grid gap-3">
          <Button
            label={copy.iveTaken}
            onClick={() => {
              markMedicineTaken(medicine.id);
              navigate(`/medicines/${medicine.id}/done`);
            }}
          />
          <button type="button" className="min-h-14 rounded-2xl border border-navy/15 bg-white" onClick={() => setRemindOpen(true)}>
            <BiBlock text={copy.remindLater} center />
          </button>
        </div>
      )}
      {remindOpen ? (
        <ReminderChoices
          onClose={() => setRemindOpen(false)}
          onPick={(minutes) => {
            remindMedicine(medicine.id, minutes);
            setRemindOpen(false);
          }}
        />
      ) : null}
    </Screen>
  );
}

export function MedicineSuccessPage() {
  const { id } = useParams();
  const { data, now, undoMedicine } = useApp();
  const { lang } = useText();
  const navigate = useNavigate();
  const medicine = data.medicines.find((item) => item.id === id);
  const next = nextOpenMedicine(data.medicines, id ?? null, now);

  if (!medicine) {
    return (
      <Screen title={copy.medicines} backTo="/home">
        <Paragraph text={copy.medicineMissing} />
      </Screen>
    );
  }

  return (
    <Screen title={copy.wellDone} backTo="/home">
      <div className="mb-5 grid justify-items-center">
        <div className="grid size-28 place-items-center rounded-full bg-success text-white" aria-hidden="true">
          <Check size={64} strokeWidth={3} />
        </div>
      </div>
      <Paragraph text={copy.markedTaken} />
      <p className="mt-3 text-[1.2rem] font-bold text-navy">
        {medicine.name}
      </p>
      <Card className="mt-4" tone="white">
        {next ? (
          <>
            <BiBlock
              text={statusOf(next, now) === "needs_attention" ? copy.stillToConfirm : copy.nextReminder}
              primaryClass="text-[1.15rem] font-bold text-navy"
            />
            <p className="mt-2 text-[1.15rem] font-semibold">
              {next.name} · {formatHm(next.time, lang)}
            </p>
            {statusOf(next, now) === "needs_attention" ? (
              <div className="mt-2">
                <Paragraph text={copy.unconfirmedNote} bilingual />
              </div>
            ) : null}
          </>
        ) : (
          <Paragraph text={copy.noMoreToday} />
        )}
      </Card>
      <div className="mt-5 grid gap-3">
        <ButtonLink to="/home" label={copy.backHome} />
        <button
          type="button"
          className="min-h-14 rounded-2xl border border-navy/15 bg-white"
          onClick={() => {
            undoMedicine(medicine.id);
            navigate(`/medicines/${medicine.id}`);
          }}
        >
          <BiBlock text={copy.undo} center />
        </button>
      </div>
    </Screen>
  );
}
