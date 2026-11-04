import { ChevronLeft, X } from "lucide-react";
import { useEffect, useId, useRef, type ButtonHTMLAttributes, type ReactNode, type Ref } from "react";
import { Link, useLocation } from "react-router-dom";
import { copy } from "../i18n/copy.ts";
import { useText } from "../i18n/useText.ts";
import { cn } from "../lib/cn.ts";
import type { Localized } from "../types.ts";

const variants = {
  primary: "border-transparent bg-navy text-white",
  secondary: "border-navy/15 bg-white text-navy",
  danger: "border-transparent bg-sos text-white",
  ghost: "border-transparent bg-transparent text-navy",
};

export function BiBlock({
  text,
  primaryClass = "text-[1.05rem] font-bold leading-tight",
  secondaryClass = "text-[0.95rem] font-medium leading-tight text-muted",
  center = false,
  bilingual = false,
}: {
  text: Localized;
  primaryClass?: string;
  secondaryClass?: string;
  center?: boolean;
  bilingual?: boolean;
}) {
  const { t, s, lang, other } = useText();
  return (
    <span className={cn("block min-w-0", center && "text-center")}>
      <span className={cn("block break-words", primaryClass)} lang={lang}>
        {t(text)}
      </span>
      {bilingual ? (
        <span className={cn("mt-0.5 block break-words", secondaryClass)} lang={other}>
          {s(text)}
        </span>
      ) : null}
    </span>
  );
}

export function BiHeading({
  text,
  as: Tag = "h1",
  headingRef,
  className,
}: {
  text: Localized;
  as?: "h1" | "h2";
  headingRef?: Ref<HTMLHeadingElement>;
  className?: string;
}) {
  const { t, s, lang, other } = useText();
  const headingId = useId();
  return (
    <div className={className}>
      <Tag
        id={headingId}
        ref={headingRef}
        tabIndex={-1}
        className="text-[1.75rem] font-bold leading-tight text-navy outline-none"
        lang={lang}
      >
        {t(text)}
      </Tag>
      <p className="mt-1 text-[1.08rem] font-medium leading-snug text-muted" lang={other}>
        {s(text)}
      </p>
    </div>
  );
}

function buttonClasses(variant: keyof typeof variants, full: boolean, className?: string) {
  return cn(
    "inline-flex min-h-14 items-center justify-center rounded-2xl border px-4 py-2.5 font-semibold",
    full && "w-full",
    variants[variant],
    className,
  );
}

export function Button({
  label,
  variant = "primary",
  icon,
  full = true,
  className,
  type = "button",
  ...props
}: {
  label: Localized;
  variant?: keyof typeof variants;
  icon?: ReactNode;
  full?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonClasses(variant, full, className)} {...props}>
      <span className="grid w-full grid-cols-[1.5rem_1fr_1.5rem] items-center gap-2">
        <span className="flex justify-center" aria-hidden="true">
          {icon}
        </span>
        <BiBlock text={label} center primaryClass="text-[1.15rem] font-bold leading-tight" />
        <span />
      </span>
    </button>
  );
}

export function ButtonLink({
  to,
  label,
  variant = "primary",
  icon,
  full = true,
  className,
}: {
  to: string;
  label: Localized;
  variant?: keyof typeof variants;
  icon?: ReactNode;
  full?: boolean;
  className?: string;
}) {
  return (
    <Link to={to} className={buttonClasses(variant, full, className)}>
      <span className="grid w-full grid-cols-[1.5rem_1fr_1.5rem] items-center gap-2">
        <span className="flex justify-center" aria-hidden="true">
          {icon}
        </span>
        <BiBlock text={label} center primaryClass="text-[1.15rem] font-bold leading-tight" />
        <span />
      </span>
    </Link>
  );
}

export function IconButton({
  label,
  children,
  className,
  ...props
}: { label: string; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-2xl border border-navy/10 bg-white text-navy",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Screen({
  title,
  intro,
  backTo,
  heading = "both",
  trailing,
  children,
}: {
  title: Localized;
  intro?: Localized;
  backTo?: string;
  heading?: "both" | "single";
  trailing?: ReactNode;
  children: ReactNode;
}) {
  const { t, lang } = useText();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { pathname } = useLocation();
  const label = t(title);

  useEffect(() => {
    document.title = `SAHAAY — ${label}`;
    headingRef.current?.focus();
  }, [pathname, label]);

  return (
    <section>
      <header className="mb-5 flex items-start gap-3">
        {backTo ? (
          <Link
            to={backTo}
            className="mt-1 grid size-12 shrink-0 place-items-center rounded-2xl border border-navy/10 bg-white text-navy"
            aria-label={t(copy.back)}
          >
            <ChevronLeft aria-hidden="true" />
          </Link>
        ) : null}
        <div className="min-w-0 flex-1">
          {heading === "single" ? (
            <h1 ref={headingRef} tabIndex={-1} className="text-[1.75rem] font-bold leading-tight text-navy outline-none" lang={lang}>
              {label}
            </h1>
          ) : (
            <BiHeading text={title} headingRef={headingRef} />
          )}
          {intro ? (
            <p className="mt-2 text-[1.05rem] leading-snug text-ink" lang={lang}>
              {t(intro)}
            </p>
          ) : null}
        </div>
        {trailing ? <div className="shrink-0">{trailing}</div> : null}
      </header>
      {children}
    </section>
  );
}

export function StatusPill({
  tone,
  icon,
  label,
}: {
  tone: "care" | "amber" | "blush" | "plain";
  icon: ReactNode;
  label: Localized;
}) {
  const { t, lang } = useText();
  const tones = {
    care: "bg-care text-success",
    amber: "bg-amber text-amber-ink",
    blush: "bg-blush text-navy",
    plain: "border border-navy/10 bg-white text-navy",
  };
  return (
    <span className={cn("inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5", tones[tone])}>
      <span aria-hidden="true">{icon}</span>
      <span className="text-[1rem] font-bold leading-tight" lang={lang}>
        {t(label)}
      </span>
    </span>
  );
}

export function SwitchRow({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: Localized;
  hint?: Localized;
}) {
  const { t, lang } = useText();
  return (
    <div className="flex items-center justify-between gap-4 border-b border-navy/10 py-4 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[1.05rem] font-bold leading-tight text-navy" lang={lang}>
          {t(label)}
        </p>
        {hint ? (
          <p className="mt-1 text-[1rem] leading-snug text-ink" lang={lang}>
            {t(hint)}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${t(label)}. ${checked ? t(copy.on) : t(copy.off)}`}
        onClick={() => onChange(!checked)}
        className="flex min-h-12 shrink-0 items-center gap-2 rounded-full border border-navy/15 bg-white px-2 py-1"
      >
        <span className={cn("min-w-12 text-center text-[0.95rem] font-bold", checked ? "text-success" : "text-navy")}>
          {checked ? t(copy.on) : t(copy.off)}
        </span>
        <span className={cn("flex h-8 w-14 items-center rounded-full px-1", checked ? "justify-end bg-navy" : "justify-start bg-navy/20")}>
          <span className="size-6 rounded-full bg-white" />
        </span>
      </button>
    </div>
  );
}

export function Dialog({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
  tone = "default",
  initialFocus = "cancel",
  confirmHref,
}: {
  open: boolean;
  title: Localized;
  children: ReactNode;
  confirmLabel?: Localized;
  cancelLabel?: Localized;
  onConfirm?: () => void;
  onClose: () => void;
  tone?: "default" | "danger";
  initialFocus?: "cancel" | "confirm";
  confirmHref?: string;
}) {
  const { t } = useText();
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const node = ref.current;
    const items = () =>
      Array.from(
        node?.querySelectorAll<HTMLElement>("button, a, input, select, textarea") ?? [],
      ).filter((item) => !item.hasAttribute("disabled"));
    const first = items().find((item) => item.dataset.focus === initialFocus) ?? items()[0];
    first?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const list = items();
      if (!list.length) return;
      const firstItem = list[0];
      const lastItem = list[list.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus();
    };
  }, [initialFocus, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy/45 p-4 sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[90dvh] w-full max-w-[440px] overflow-y-auto rounded-3xl border border-navy/10 bg-cream p-5"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 id={titleId} className="min-w-0 flex-1">
            <BiBlock text={title} primaryClass="text-[1.45rem] font-bold leading-tight text-navy" />
          </h2>
          <button
            type="button"
            data-focus="close"
            onClick={onClose}
            className="grid size-12 shrink-0 place-items-center rounded-2xl border border-navy/10 bg-white"
            aria-label={t(copy.close)}
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="mb-5 text-[1.05rem] leading-snug">{children}</div>
        <div className="grid gap-3">
          {confirmLabel && confirmHref ? (
            <a data-focus="confirm" href={confirmHref} className={buttonClasses(tone === "danger" ? "danger" : "primary", true)} onClick={onConfirm}>
              <BiBlock text={confirmLabel} center primaryClass="text-[1.15rem] font-bold" />
            </a>
          ) : null}
          {confirmLabel && !confirmHref ? (
            <button
              type="button"
              data-focus="confirm"
              className={buttonClasses(tone === "danger" ? "danger" : "primary", true)}
              onClick={onConfirm}
            >
              <BiBlock text={confirmLabel} center primaryClass="text-[1.15rem] font-bold" />
            </button>
          ) : null}
          <button type="button" data-focus="cancel" className={buttonClasses("secondary", true)} onClick={onClose}>
            <BiBlock text={cancelLabel ?? copy.cancel} center primaryClass="text-[1.15rem] font-bold" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Card({
  children,
  className,
  tone = "white",
}: {
  children: ReactNode;
  className?: string;
  tone?: "white" | "care" | "money" | "amber" | "blush";
}) {
  const tones = {
    white: "bg-white",
    care: "bg-care",
    money: "bg-money",
    amber: "bg-amber",
    blush: "bg-blush",
  };
  return <div className={cn("rounded-3xl border border-navy/10 p-5", tones[tone], className)}>{children}</div>;
}

export function Paragraph({ text, bilingual = false }: { text: Localized; bilingual?: boolean }) {
  const { t, s, lang, other } = useText();
  if (!bilingual) {
    return (
      <p className="text-[1.05rem] leading-snug text-ink" lang={lang}>
        {t(text)}
      </p>
    );
  }
  return (
    <div>
      <p className="text-[1.05rem] leading-snug text-ink" lang={lang}>
        {t(text)}
      </p>
      <p className="mt-1 text-[1rem] leading-snug text-muted" lang={other}>
        {s(text)}
      </p>
    </div>
  );
}

export function FieldLabel({ text, htmlFor }: { text: Localized; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block">
      <BiBlock text={text} primaryClass="text-[1.05rem] font-bold text-navy" secondaryClass="text-[0.95rem] text-muted" />
    </label>
  );
}

export function ErrorText({ text }: { text: Localized }) {
  const { t, lang } = useText();
  return (
    <p role="alert" className="mt-2 text-[1rem] font-semibold text-danger" lang={lang}>
      {t(text)}
    </p>
  );
}
