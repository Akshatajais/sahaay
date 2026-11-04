import { ArrowDownLeft, ArrowRight, ArrowUpRight, BadgeCheck, Check, ChevronLeft, ChevronRight, Clock, Delete, QrCode, User, XCircle } from "lucide-react";
import { toDataURL } from "qrcode";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, ButtonLink, Card, Paragraph, Screen, StatusPill } from "../components/ui.tsx";
import { copy, successPay, txHeading, txStatusCopy } from "../i18n/copy.ts";
import { useText } from "../i18n/useText.ts";
import { cn } from "../lib/cn.ts";
import { formatRupees, formatWhen, profileName } from "../lib/format.ts";
import { useApp } from "../state/AppState.tsx";
import type { Contact, Localized, Relation, TxStatus } from "../types.ts";

const DEMO_LIMIT = 10000;
const QR_PAYLOAD = "upi://pay?pa=sahaay.demo@okaxis&pn=SAHAAY%20Demonstration&cu=INR";

const toneFor: Record<TxStatus, "care" | "amber" | "blush" | "plain"> = {
  success: "care",
  pending: "amber",
  failed: "blush",
  cancelled: "plain",
};

function StatusIcon({ status }: { status: TxStatus }) {
  if (status === "success") return <Check size={18} />;
  if (status === "pending") return <Clock size={18} />;
  return <XCircle size={18} />;
}

const listStatus: Record<TxStatus, Localized> = {
  success: copy.successful,
  failed: copy.failed,
  pending: copy.pending,
  cancelled: copy.cancelled,
};

const statusTone: Record<TxStatus, string> = {
  success: "bg-[#E5F6EA] text-success",
  failed: "bg-[#F8E4E4] text-danger",
  pending: "bg-amber text-amber-ink",
  cancelled: "bg-cream text-muted",
};

function MoneyStatusIcon({ status }: { status: TxStatus }) {
  if (status === "success") return <Check size={15} strokeWidth={2.5} />;
  if (status === "pending") return <Clock size={15} />;
  return <XCircle size={15} />;
}

const MAN = "/icons/avatar-man.png";
const WOMAN = "/icons/avatar-woman.png";

function portraitSrc(relation: Relation | undefined, seed: string) {
  if (relation === "son" || relation === "brother") return MAN;
  if (relation === "daughter" || relation === "sister") return WOMAN;
  return seed.length % 2 === 0 ? WOMAN : MAN;
}

function PersonPortrait({ src, className }: { src: string; className?: string }) {
  return (
    <span className={cn("grid shrink-0 place-items-center overflow-hidden rounded-full bg-[#F7F1E8]", className ?? "size-14")}>
      <img src={src} alt="" className="h-full w-full object-contain object-top" />
    </span>
  );
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function contactByPhone(contacts: Contact[], digits: string) {
  if (digits.length < 10) return null;
  const last = digits.slice(-10);
  return contacts.find((item) => onlyDigits(item.phone).slice(-10) === last) ?? null;
}

function sampleRecipient(contacts: Contact[]): Payee {
  const priya = contacts.find((item) => item.id === "priya") ?? contacts.find((item) => item.relation === "daughter") ?? null;
  return {
    contactId: priya?.id ?? null,
    name: priya?.name ?? "Priya Sharma",
    relation: priya?.relation ?? "daughter",
    seed: priya?.name ?? "Priya Sharma",
    upiId: priya?.upiId || "priya.demo@oksbi",
  };
}

function ScanFrame() {
  const corner = "pointer-events-none absolute h-12 w-12 border-white";
  return (
    <div className="relative aspect-square w-full max-w-[300px] overflow-hidden rounded-[32px] bg-[#202E63]">
      <span className="pointer-events-none absolute inset-8 rounded-2xl border border-white/20" />
      <span className={cn(corner, "left-5 top-5 rounded-tl-2xl border-l-4 border-t-4")} />
      <span className={cn(corner, "right-5 top-5 rounded-tr-2xl border-r-4 border-t-4")} />
      <span className={cn(corner, "bottom-5 left-5 rounded-bl-2xl border-b-4 border-l-4")} />
      <span className={cn(corner, "bottom-5 right-5 rounded-br-2xl border-b-4 border-r-4")} />
      <span className="scan-line pointer-events-none absolute inset-x-10 h-1 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.85)]" />
    </div>
  );
}

function TransferGraphic({ fromName, toName, toSrc, amount }: { fromName: string; toName: string; toSrc: string; amount: string }) {
  return (
    <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2">
      <div className="grid justify-items-center gap-2">
        <span className="grid size-20 place-items-center rounded-full bg-[#E7EEF8] text-navy">
          <User aria-hidden="true" size={36} />
        </span>
        <p className="text-center text-[1.05rem] font-extrabold leading-tight text-navy">{fromName}</p>
      </div>
      <div className="grid justify-items-center gap-1 px-1 pt-5">
        <p className="text-center text-[1.45rem] font-extrabold leading-none text-navy">{amount}</p>
        <ArrowRight aria-hidden="true" className="text-navy" size={28} />
      </div>
      <div className="grid justify-items-center gap-2">
        <PersonPortrait src={toSrc} className="size-20" />
        <p className="text-center text-[1.05rem] font-extrabold leading-tight text-navy">{toName}</p>
      </div>
    </div>
  );
}

function prettyPhone(digits: string) {
  return [digits.slice(0, 5), digits.slice(5, 10)].filter(Boolean).join(" ");
}

function Keypad({ onDigit, onDelete, onClear }: { onDigit: (digit: string) => void; onDelete: () => void; onClear: () => void }) {
  const { t } = useText();
  return (
    <div className="grid grid-cols-3 gap-3">
      {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
        <button key={digit} type="button" className="min-h-14 rounded-2xl border border-navy/10 bg-white text-[1.6rem] font-bold text-navy" onClick={() => onDigit(digit)}>
          {digit}
        </button>
      ))}
      <button type="button" className="min-h-14 rounded-2xl border border-navy/10 bg-white text-[1.2rem] font-bold text-navy" onClick={onClear} aria-label={t(copy.clearAmount)}>
        C
      </button>
      <button type="button" className="min-h-14 rounded-2xl border border-navy/10 bg-white text-[1.6rem] font-bold text-navy" onClick={() => onDigit("0")}>
        0
      </button>
      <button type="button" className="grid min-h-14 place-items-center rounded-2xl border border-navy/10 bg-white text-navy" onClick={onDelete} aria-label={t(copy.deleteDigit)}>
        <Delete aria-hidden="true" />
      </button>
    </div>
  );
}

export function MoneyPage() {
  const { data } = useApp();
  const { t, lang } = useText();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [showAll, setShowAll] = useState(false);
  const title = t(copy.money);
  const history = [...data.transactions].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const visible = showAll ? history : history.slice(0, 3);

  useEffect(() => {
    document.title = `SAHAAY — ${title}`;
    headingRef.current?.focus();
  }, [title]);

  return (
    <section>
      <header className="mb-4 grid grid-cols-[3rem_minmax(0,1fr)_3rem] items-center gap-2">
        <Link
          to="/home"
          className="grid size-12 place-items-center rounded-full border border-navy/10 bg-white text-navy"
          aria-label={t(copy.back)}
        >
          <ChevronLeft aria-hidden="true" size={26} />
        </Link>
        <h1 ref={headingRef} tabIndex={-1} className="text-center text-[1.7rem] font-extrabold text-navy outline-none" lang={lang}>
          {title}
        </h1>
        <span />
      </header>

      <Link to="/money/send" className="flex min-h-[8.75rem] items-center gap-2 rounded-[28px] bg-[#E3F1FB] px-4 py-3">
        <span className="min-w-0 flex-1 text-[1.55rem] font-extrabold leading-tight text-navy">{t(copy.sendMoney)}</span>
        <span className="relative shrink-0">
          <img src="/icons/money.png" alt="" className="h-28 w-32 object-contain" />
          <ArrowUpRight aria-hidden="true" className="absolute right-0 top-1 text-[#2F6BFF]" size={34} strokeWidth={2.6} />
        </span>
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-navy shadow-sm" aria-hidden="true">
          <ChevronRight size={22} />
        </span>
      </Link>

      <div className="mb-3 mt-6 flex items-center justify-between gap-3">
        <h2 className="text-[1.35rem] font-extrabold text-navy" lang={lang}>
          {t(copy.recentPayments)}
        </h2>
        {history.length > 0 ? (
          <button
            type="button"
            className="inline-flex min-h-11 items-center gap-1 rounded-full bg-[#E3F1FB] px-3 text-[0.95rem] font-bold text-navy"
            aria-expanded={showAll || history.length <= 3}
            onClick={() => setShowAll(true)}
          >
            {t(copy.viewAll)}
            <ChevronRight aria-hidden="true" size={16} />
          </button>
        ) : null}
      </div>

      {history.length === 0 ? (
        <Paragraph text={copy.noPayments} />
      ) : (
        <div className="grid gap-3">
          {visible.map((item) => {
            const sent = item.direction === "sent";
            const amount = formatRupees(item.amount, lang);
            return (
              <Link key={item.id} to={`/money/result/${item.id}`} className="flex min-w-0 items-center gap-3 rounded-[24px] border border-navy/10 bg-white px-3 py-3">
                <PersonPortrait src={portraitSrc(data.contacts.find((person) => person.id === item.contactId || person.name === item.name)?.relation, item.name)} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[1.08rem] font-bold text-navy">{item.name}</span>
                  <span className="mt-0.5 block whitespace-nowrap text-[0.92rem] text-muted">{formatWhen(item.createdAt, lang)}</span>
                  <span className="mt-1.5 inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#F8E4E4] px-2.5 py-1 text-[0.9rem] font-bold text-danger">
                    {sent ? <ArrowUpRight aria-hidden="true" size={14} /> : <ArrowDownLeft aria-hidden="true" size={14} />}
                    {t(sent ? copy.youSent : copy.youReceived)}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-[1.2rem] font-extrabold text-navy">{sent ? `-${amount}` : amount}</span>
                  <span className={cn("mt-1.5 inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.9rem] font-bold", statusTone[item.status])}>
                    <MoneyStatusIcon status={item.status} />
                    {t(listStatus[item.status])}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      )}

    </section>
  );
}

type PayStage = "choose" | "scan" | "found" | "number" | "amount" | "review";
type Payee = { contactId: string | null; name: string; relation?: Relation; seed: string; upiId?: string };

export function SendMoneyPage() {
  const { data, createTransaction } = useApp();
  const { t, lang } = useText();
  const navigate = useNavigate();
  const [stage, setStage] = useState<PayStage>("choose");
  const [via, setVia] = useState<"scan" | "number">("number");
  const [payee, setPayee] = useState<Payee | null>(null);
  const [phone, setPhone] = useState("");
  const [amountDigits, setAmountDigits] = useState("");
  const amount = Number(amountDigits || "0");
  const overLimit = amount > DEMO_LIMIT;
  const amountLabel = formatRupees(amount, lang);
  const matched = contactByPhone(data.contacts, phone);
  const senderName = profileName(data.profile.nameEn, data.profile.nameHi, lang);
  const title =
    stage === "scan"
      ? t(copy.scanQr)
      : stage === "found"
        ? payee?.name ?? t(copy.scanQr)
        : stage === "number"
          ? t(copy.enterNumber)
          : stage === "amount"
            ? t(copy.amountTitle)
            : stage === "review"
              ? t(copy.reviewTitle)
              : t(copy.sendMoney);

  function back() {
    if (stage === "choose") navigate("/money");
    else if (stage === "found") setStage("scan");
    else if (stage === "amount") setStage(via === "scan" ? "found" : "number");
    else if (stage === "review") setStage("amount");
    else setStage("choose");
  }

  function acceptPayee(next: Payee, method: "scan" | "number") {
    setPayee(next);
    setVia(method);
    setStage("amount");
  }

  function tryDemoScan() {
    const next = sampleRecipient(data.contacts);
    setPayee(next);
    setVia("scan");
    setStage("found");
  }

  function continueNumber() {
    if (phone.length < 10) return;
    const contact = contactByPhone(data.contacts, phone);
    acceptPayee(
      {
        contactId: contact?.id ?? null,
        name: contact?.name ?? `+91 ${prettyPhone(phone)}`,
        relation: contact?.relation,
        seed: contact?.name ?? "payee",
        upiId: contact?.upiId,
      },
      "number",
    );
  }

  function confirm() {
    if (!payee || amount <= 0) return;
    const id = createTransaction({
      direction: "sent",
      contactId: payee.contactId,
      name: payee.name,
      amount,
      status: overLimit ? "failed" : "success",
      reason: overLimit ? "limit" : "demo",
    });
    navigate(`/money/result/${id}`);
  }

  function pushPhone(digit: string) {
    setPhone((current) => (current.length >= 10 ? current : `${current}${digit}`));
  }

  function pushAmount(digit: string) {
    setAmountDigits((current) => {
      if (current.length >= 6) return current;
      if (current === "0") return digit;
      return `${current}${digit}`;
    });
  }

  return (
    <section>
      <header className="mb-4 grid grid-cols-[3rem_minmax(0,1fr)_3rem] items-center">
        <button type="button" className="grid size-12 place-items-center rounded-full border border-navy/10 bg-white text-navy" onClick={back} aria-label={t(copy.back)}>
          <ChevronLeft aria-hidden="true" size={26} />
        </button>
        <h1 className="text-center text-[1.45rem] font-extrabold text-navy" lang={lang}>
          {title}
        </h1>
        <span />
      </header>

      {stage === "choose" ? (
        <div className="grid gap-3">
          <button type="button" className="flex min-h-44 flex-col items-center justify-center gap-2 rounded-[28px] bg-[#E3F1FB] px-4 py-5" onClick={() => setStage("scan")}>
            <span className="grid size-28 place-items-center rounded-[28px] bg-white text-navy">
              <QrCode aria-hidden="true" size={64} strokeWidth={1.75} />
            </span>
            <span className="text-[1.45rem] font-extrabold text-navy">{t(copy.scanQr)}</span>
          </button>
          <button type="button" className="flex min-h-44 flex-col items-center justify-center gap-2 rounded-[28px] bg-[#F8E6D8] px-4 py-5" onClick={() => setStage("number")}>
            <span className="flex items-end justify-center">
              <img src={MAN} alt="" className="h-28 w-24 object-contain" />
              <img src={WOMAN} alt="" className="-ml-6 h-28 w-24 object-contain" />
            </span>
            <span className="text-[1.45rem] font-extrabold text-navy">{t(copy.enterNumber)}</span>
          </button>
        </div>
      ) : null}

      {stage === "scan" ? (
        <div className="grid justify-items-center gap-6">
          <ScanFrame />
          <Button label={copy.tryDemoScan} onClick={tryDemoScan} />
        </div>
      ) : null}

      {stage === "found" && payee ? (
        <div className="grid justify-items-center gap-4">
          <PersonPortrait src={portraitSrc(payee.relation, payee.seed)} className="size-36" />
          <p className="text-center text-[1.6rem] font-extrabold text-navy">{payee.name}</p>
          <div className="grid justify-items-center gap-1 rounded-[28px] bg-white px-5 py-4">
            <p className="flex items-center gap-2 text-[1.05rem] font-bold text-success">
              <BadgeCheck aria-hidden="true" size={22} />
              {t(copy.verifiedDemoUpi)}
            </p>
            <p className="text-center text-[1.2rem] font-extrabold text-navy">{payee.upiId}</p>
          </div>
          <Button label={copy.continue} onClick={() => setStage("amount")} />
        </div>
      ) : null}

      {stage === "number" ? (
        <div>
          <div className="mb-4 grid justify-items-center">
            {matched ? (
              <PersonPortrait src={portraitSrc(matched.relation, matched.name)} className="size-28" />
            ) : (
              <span className="flex h-28 items-end justify-center">
                <img src={MAN} alt="" className="h-28 w-24 object-contain" />
                <img src={WOMAN} alt="" className="-ml-6 h-28 w-24 object-contain" />
              </span>
            )}
            <p className="mt-3 text-center text-[2rem] font-extrabold tracking-wide text-navy" aria-live="polite">
              +91 {prettyPhone(phone)}
            </p>
          </div>
          <Keypad onDigit={pushPhone} onDelete={() => setPhone((current) => current.slice(0, -1))} onClear={() => setPhone("")} />
          <div className="mt-4">
            <Button label={copy.continue} disabled={phone.length < 10} onClick={continueNumber} />
          </div>
        </div>
      ) : null}

      {stage === "amount" && payee ? (
        <div>
          <div className="mb-2 grid justify-items-center">
            <PersonPortrait src={portraitSrc(payee.relation, payee.seed)} className="size-24" />
            <p className="mt-2 text-[1.2rem] font-bold text-navy">{payee.name}</p>
            <p className="text-[2.6rem] font-extrabold text-navy" aria-live="polite">
              {amountLabel}
            </p>
          </div>
          {overLimit ? <Paragraph text={copy.aboveLimit} bilingual /> : null}
          <div className="mt-3">
            <Keypad onDigit={pushAmount} onDelete={() => setAmountDigits((current) => current.slice(0, -1))} onClear={() => setAmountDigits("")} />
          </div>
          <div className="mt-4">
            <Button label={copy.continue} disabled={amount <= 0} onClick={() => setStage("review")} />
          </div>
        </div>
      ) : null}

      {stage === "review" && payee ? (
        <div className="grid gap-4">
          <Card>
            <TransferGraphic fromName={senderName} toName={payee.name} toSrc={portraitSrc(payee.relation, payee.seed)} amount={amountLabel} />
          </Card>
          {overLimit ? <Paragraph text={copy.aboveLimit} bilingual /> : <Paragraph text={copy.notRealAuth} bilingual />}
          <Button label={overLimit ? copy.recordUnsuccessful : copy.confirmPayment} variant={overLimit ? "danger" : "primary"} onClick={confirm} />
        </div>
      ) : null}
    </section>
  );
}
export function ReceivePage() {
  const { t } = useText();
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    toDataURL(QR_PAYLOAD, {
      margin: 1,
      width: 280,
      color: { dark: "#202E63", light: "#FFFFFF" },
    })
      .then((url) => {
        if (!cancelled) setSrc(url);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Screen title={copy.receiveTitle} backTo="/money">
      <Card className="grid justify-items-center text-center">
        <StatusPill tone="plain" icon={<QrCode size={18} />} label={copy.demonstration} />
        <div className="mt-4 grid min-h-64 place-items-center">
          {src ? (
            <img src={src} alt={`${t(copy.qrDemo)}`} width={240} height={240} className="rounded-2xl border border-navy/10 bg-white" />
          ) : (
            <p className="font-semibold text-navy">{failed ? t(copy.qrFailed) : t(copy.qrPreparing)}</p>
          )}
        </div>
        <div className="mt-3">
          <Paragraph text={copy.qrDemo} bilingual />
        </div>
      </Card>
      <ol className="mt-4 grid gap-3">
        {[copy.qrStep1, copy.qrStep2, copy.qrStep3].map((step, index) => (
          <li key={step.en} className="flex gap-3 rounded-3xl border border-navy/10 bg-white p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-money font-bold text-navy">{index + 1}</span>
            <Paragraph text={step} />
          </li>
        ))}
      </ol>
      {(failed || src) && (
        <p className="mt-4 break-all rounded-2xl bg-white p-4 text-[1rem] text-navy">{QR_PAYLOAD}</p>
      )}
    </Screen>
  );
}

export function PaymentResultPage() {
  const { id } = useParams();
  const { data, updateTransaction } = useApp();
  const { lang } = useText();
  const transaction = data.transactions.find((item) => item.id === id);
  if (!transaction) {
    return (
      <Screen title={copy.money} backTo="/money">
        <Paragraph text={copy.paymentResultMissing} />
      </Screen>
    );
  }
  const amount = formatRupees(transaction.amount, lang);
  const body =
    transaction.status === "success"
      ? successPay(amount, transaction.name)
      : transaction.status === "failed"
        ? transaction.reason === "limit"
          ? copy.failedLimitBody
          : copy.failedDemoBody
        : transaction.status === "cancelled"
          ? copy.cancelledBody
          : copy.pendingBody;

  const person = data.contacts.find((item) => item.id === transaction.contactId || item.name === transaction.name);
  const senderName = profileName(data.profile.nameEn, data.profile.nameHi, lang);

  if (transaction.status === "success") {
    return (
      <Screen title={copy.paymentSuccessful} backTo="/money">
        <Card className="grid justify-items-center gap-5">
          <span className="grid size-20 place-items-center rounded-full bg-[#E5F6EA] text-success">
            <Check aria-hidden="true" size={42} strokeWidth={2.75} />
          </span>
          <TransferGraphic
            fromName={senderName}
            toName={transaction.name}
            toSrc={portraitSrc(person?.relation, transaction.name)}
            amount={amount}
          />
        </Card>
        <div className="mt-4">
          <ButtonLink to="/money" label={copy.done} />
        </div>
      </Screen>
    );
  }

  return (
    <Screen title={txHeading[transaction.status]} backTo="/money">
      <Card className="grid justify-items-center text-center">
        <PersonPortrait src={portraitSrc(person?.relation, transaction.name)} className="mb-3 size-28" />
        <StatusPill tone={toneFor[transaction.status]} icon={<StatusIcon status={transaction.status} />} label={txStatusCopy[transaction.status]} />
        <p className="mt-4 text-[2rem] font-bold text-navy">{amount}</p>
        <p className="mt-2 text-[1.35rem] font-bold text-navy">{transaction.name}</p>
        <p className="text-[1rem] text-muted">{formatWhen(transaction.createdAt, lang)}</p>
      </Card>
      <div className="mt-4">
        <Paragraph text={body} />
      </div>
      {transaction.status === "pending" ? (
        <div className="mt-4 grid gap-3">
          <Button label={copy.completePayment} onClick={() => updateTransaction(transaction.id, { status: "success", reason: "demo" })} />
          <Button label={copy.recordUnsuccessful} variant="secondary" onClick={() => updateTransaction(transaction.id, { status: "failed", reason: "demo" })} />
          <Button label={copy.cancelPayment} variant="ghost" onClick={() => updateTransaction(transaction.id, { status: "cancelled", reason: "demo" })} />
        </div>
      ) : (
        <div className="mt-4">
          <ButtonLink to="/money" label={copy.backToMoney} />
        </div>
      )}
    </Screen>
  );
}
