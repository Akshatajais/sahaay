import { Bell, HeartPulse, Pill, Siren, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { BiBlock, Button, Card, Paragraph, Screen, StatusPill } from "../components/ui.tsx";
import { copy, paymentFeed, slotCopy, txStatusCopy, unconfirmedTitle } from "../i18n/copy.ts";
import { useText } from "../i18n/useText.ts";
import { formatRupees, formatWhen } from "../lib/format.ts";
import { statusOf } from "../lib/medicines.ts";
import { useApp } from "../state/AppState.tsx";
import type { Localized, NoticeKind } from "../types.ts";

type FeedItem = {
  id: string;
  kind: NoticeKind;
  title: Localized;
  body: Localized;
  createdAt: string;
  href?: string;
  storedId?: string;
  read: boolean;
};

const icons = {
  medicine: Pill,
  payment: Wallet,
  family: HeartPulse,
  sos: Siren,
  habit: Bell,
  system: Bell,
};

export function NotificationsPage() {
  const { data, now, markNoticeRead, markAllNoticesRead } = useApp();
  const { t, lang } = useText();
  const unconfirmed: FeedItem[] = data.medicines
    .filter((medicine) => statusOf(medicine, now) === "needs_attention")
    .map((medicine) => ({
      id: `open-${medicine.id}`,
      kind: "medicine" as const,
      title: unconfirmedTitle(slotCopy[medicine.slot]),
      body: copy.unconfirmedBody,
      createdAt: now.toISOString(),
      href: `/medicines/${medicine.id}`,
      read: false,
    }));
  const payments: FeedItem[] = data.settings.sharePayments
    ? data.transactions.map((item) => ({
        id: `pay-${item.id}`,
        kind: "payment" as const,
        title: txStatusCopy[item.status],
        body: paymentFeed(item.status, formatRupees(item.amount, "en"), item.name),
        createdAt: item.createdAt,
        href: `/money/result/${item.id}`,
        read: true,
      }))
    : [];
  const stored: FeedItem[] = data.notices.map((notice) => ({
    id: notice.id,
    kind: notice.kind,
    title: notice.title,
    body: notice.body,
    createdAt: notice.createdAt,
    href: notice.href,
    storedId: notice.id,
    read: notice.read,
  }));
  const items = [...unconfirmed, ...stored, ...payments].sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    return b.createdAt.localeCompare(a.createdAt);
  });

  return (
    <Screen title={copy.notifications} backTo="/home">
      {stored.some((item) => !item.read) ? (
        <div className="mb-4">
          <Button label={copy.markAllRead} variant="secondary" onClick={markAllNoticesRead} />
        </div>
      ) : null}
      {items.length === 0 ? (
        <Card className="text-center">
          <Bell className="mx-auto text-navy" size={36} aria-hidden="true" />
          <div className="mt-3">
            <Paragraph text={copy.emptyNotes} />
          </div>
        </Card>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => {
            const Icon = icons[item.kind];
            const inner = (
              <>
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-cream text-navy" aria-hidden="true">
                  <Icon />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="mb-1 flex flex-wrap items-center gap-2">
                    {!item.read ? <StatusPill tone="amber" icon={<Bell size={16} />} label={copy.newItem} /> : null}
                    {item.kind === "medicine" && !item.storedId ? (
                      <StatusPill tone="plain" icon={<Pill size={16} />} label={copy.open} />
                    ) : null}
                  </span>
                  <BiBlock text={item.title} primaryClass="text-[1.1rem] font-bold text-navy" />
                  <span className="mt-1 block text-[1rem] leading-snug text-ink" lang={lang}>
                    {t(item.body)}
                  </span>
                  <span className="mt-2 block text-[0.95rem] text-muted">{formatWhen(item.createdAt, lang)}</span>
                </span>
              </>
            );
            if (!item.href) {
              return (
                <article key={item.id} className="flex gap-3 rounded-3xl border border-navy/10 bg-white p-4">
                  {inner}
                </article>
              );
            }
            return (
              <Link
                key={item.id}
                to={item.href}
                onClick={() => {
                  if (item.storedId) markNoticeRead(item.storedId);
                }}
                className="flex gap-3 rounded-3xl border border-navy/10 bg-white p-4"
              >
                {inner}
              </Link>
            );
          })}
        </div>
      )}
    </Screen>
  );
}
