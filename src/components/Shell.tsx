import { House, Mic, Phone, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { copy, habitCopy, reminderChoices, slotCopy } from "../i18n/copy.ts";
import { useText } from "../i18n/useText.ts";
import { formatHm, primaryText } from "../lib/format.ts";
import { cn } from "../lib/cn.ts";
import { speak } from "../lib/speech.ts";
import { useApp } from "../state/AppState.tsx";
import { BiBlock, Dialog, Paragraph } from "./ui.tsx";

const titles: Array<{ test: (path: string) => boolean; title: typeof copy.home }> = [
  { test: (path) => path.startsWith("/home"), title: copy.home },
  { test: (path) => path.startsWith("/money"), title: copy.money },
  { test: (path) => path.startsWith("/medicines"), title: copy.medicines },
  { test: (path) => path.startsWith("/day"), title: copy.myDay },
  { test: (path) => path.startsWith("/help"), title: copy.help },
  { test: (path) => path.startsWith("/voice"), title: copy.voice },
  { test: (path) => path.startsWith("/contacts"), title: copy.contacts },
  { test: (path) => path.startsWith("/notifications"), title: copy.notifications },
  { test: (path) => path.startsWith("/settings"), title: copy.settings },
];

export function Shell() {
  const { data, prompt, dismissPrompt, markMedicineTaken, remindMedicine, markHabitDone, remindHabit, banner, dismissBanner, live } =
    useApp();
  const { t, lang } = useText();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
    const previous = previousPath.current;
    previousPath.current = location.pathname;
    if (!previous || previous === location.pathname || !data.settings.voiceGuidance) return;
    const match = titles.find((item) => item.test(location.pathname));
    if (match) speak(primaryText(match.title, data.settings.language), data.settings.language);
  }, [data.settings.language, data.settings.voiceGuidance, location.pathname]);

  const medicine = prompt?.kind === "medicine" ? data.medicines.find((item) => item.id === prompt.id) : null;
  const habit = prompt?.kind === "habit" ? data.habits.find((item) => item.id === prompt.id) : null;

  return (
    <div className="h-dvh overflow-hidden bg-cream text-ink xl:bg-[#ebe6dc]">
      <div className="mx-auto flex h-full max-w-[1180px]">
        <aside className="hidden flex-1 items-center justify-end px-10 xl:flex">
          <div className="max-w-sm">
            <p className="text-4xl font-bold tracking-tight text-navy">SAHAAY</p>
            <p className="mt-3 text-[1.35rem] font-semibold leading-snug text-navy" lang={lang}>
              {t(copy.tagline)}
            </p>
            <p className="mt-1 text-[1.15rem] leading-snug text-muted" lang={lang === "hi" ? "en" : "hi"}>
              {lang === "hi" ? copy.tagline.en : copy.tagline.hi}
            </p>
            <ul className="mt-6 grid gap-2 text-[1rem] font-semibold text-navy">
              {[copy.simple, copy.accessible, copy.safe, copy.warm].map((item) => (
                <li key={item.en}>{t(item)}</li>
              ))}
            </ul>
          </div>
        </aside>
        <div className="relative flex h-full w-full max-w-[480px] flex-col overflow-hidden bg-cream xl:border-x xl:border-navy/10">
          <a href="#main" className="skip-link">
            {t(copy.skip)}
          </a>
          <div className="sr-only" aria-live="polite">
            {live}
          </div>
          <main
            id="main"
            ref={mainRef}
            tabIndex={-1}
            className={cn(
              "min-h-0 flex-1 outline-none",
              location.pathname === "/home" ? "overflow-hidden" : "overflow-y-auto overscroll-contain",
            )}
          >
            <div
              key={location.pathname}
              className={cn(
                "page-enter px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-4",
                location.pathname === "/home" && "flex h-full min-h-0 flex-col overflow-hidden pb-3",
              )}
            >
              <Outlet />
            </div>
          </main>
          {banner ? (
            <div className="flex items-start gap-3 border-t border-navy/10 bg-white px-5 py-3" role="status">
              <div className="min-w-0 flex-1">
                <BiBlock text={banner.text} primaryClass="text-[1rem] font-semibold leading-snug text-navy" secondaryClass="text-[0.95rem] text-muted" />
              </div>
              <button type="button" className="grid size-12 place-items-center rounded-2xl text-navy" onClick={dismissBanner} aria-label={t(copy.close)}>
                <X aria-hidden="true" />
              </button>
            </div>
          ) : null}
          <nav
            className="grid grid-cols-3 border-t border-navy/10 bg-white px-2 pt-1.5 pb-[max(0.4rem,env(safe-area-inset-bottom))]"
            aria-label={t(copy.home)}
          >
            <NavLink
              to="/home"
              aria-current={location.pathname.startsWith("/home") ? "page" : undefined}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl py-1",
                location.pathname.startsWith("/home") ? "text-navy" : "text-muted",
              )}
            >
              <span className={cn("grid size-12 place-items-center rounded-2xl", location.pathname.startsWith("/home") ? "bg-care" : "bg-cream")}>
                <House aria-hidden="true" size={28} />
              </span>
              <span className="text-[1rem] font-bold leading-none" lang={lang}>
                {t(copy.home)}
              </span>
            </NavLink>
            <NavLink
              to="/voice"
              aria-current={location.pathname.startsWith("/voice") ? "page" : undefined}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl py-1",
                location.pathname.startsWith("/voice") ? "text-navy" : "text-muted",
              )}
            >
              <span className={cn("grid size-12 place-items-center rounded-2xl", location.pathname.startsWith("/voice") ? "bg-navy text-white" : "bg-[#E4F0FB] text-navy")}>
                <Mic aria-hidden="true" size={28} />
              </span>
              <span className="text-[1rem] font-bold leading-none" lang={lang}>
                {t(copy.voiceNav)}
              </span>
            </NavLink>
            <NavLink
              to="/help"
              aria-current={location.pathname.startsWith("/help") ? "page" : undefined}
              aria-label={t(copy.emergencySos)}
              className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl py-1 text-sos"
            >
              <span className={cn("grid size-12 place-items-center rounded-2xl bg-sos text-white", location.pathname.startsWith("/help") && "ring-2 ring-navy ring-offset-2")}>
                <Phone aria-hidden="true" size={26} />
              </span>
              <span className="text-[1rem] font-extrabold leading-none tracking-wide">SOS</span>
            </NavLink>
          </nav>
          <Dialog
            open={Boolean(medicine)}
            title={medicine ? slotCopy[medicine.slot] : copy.medicines}
            confirmLabel={copy.iveTaken}
            cancelLabel={copy.close}
            onConfirm={() => medicine && markMedicineTaken(medicine.id)}
            onClose={dismissPrompt}
          >
            {medicine ? (
              <div className="grid gap-3">
                <p className="text-[1.25rem] font-bold text-navy">
                  {medicine.name}
                </p>
                <p className="text-[1.15rem] font-semibold">{formatHm(medicine.time, lang)}</p>
                <Paragraph text={copy.unconfirmedNote} bilingual />
                <button
                  type="button"
                  className="min-h-12 rounded-2xl border border-navy/15 bg-white px-3 font-semibold text-navy"
                  onClick={() => remindMedicine(medicine.id, 30)}
                >
                  <BiBlock text={reminderChoices[1].label} center />
                </button>
              </div>
            ) : null}
          </Dialog>
          <Dialog
            open={Boolean(habit) && !medicine}
            title={habit ? habitCopy[habit.id].title : copy.myDay}
            confirmLabel={copy.done}
            cancelLabel={copy.close}
            onConfirm={() => habit && markHabitDone(habit.id)}
            onClose={dismissPrompt}
          >
            {habit ? (
              <div className="grid gap-3">
                <Paragraph text={habitCopy[habit.id].message} />
                <p className="font-semibold">{formatHm(habit.time, lang)}</p>
                <button
                  type="button"
                  className="min-h-12 rounded-2xl border border-navy/15 bg-white px-3 font-semibold text-navy"
                  onClick={() => remindHabit(habit.id, 30)}
                >
                  <BiBlock text={copy.remindIn30} center />
                </button>
              </div>
            ) : null}
          </Dialog>
        </div>
        <div className="hidden flex-1 xl:block" />
      </div>
    </div>
  );
}

export function HomeGate() {
  return <Navigate to="/home" replace />;
}
