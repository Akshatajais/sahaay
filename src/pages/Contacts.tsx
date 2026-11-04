import { Bell, Check, ChevronLeft, HandHelping, MessageSquare, Phone, Siren } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BiBlock, Button, Card, Dialog, ErrorText, FieldLabel, Paragraph, Screen, SwitchRow } from "../components/ui.tsx";
import { copy, familyCallMessage, familyCheckMessage, familyMedicineNote, relationCopy, relations, removeConfirm, messageConfirm } from "../i18n/copy.ts";
import { useText } from "../i18n/useText.ts";
import { formatWhen, smsHref, telHref } from "../lib/format.ts";
import { uid } from "../lib/time.ts";
import { useApp } from "../state/AppState.tsx";
import type { Contact, Localized, Relation } from "../types.ts";

const MAN = "/icons/avatar-man.png";
const WOMAN = "/icons/avatar-woman.png";

function portraitSrc(contact: Contact) {
  if (contact.relation === "son" || contact.relation === "brother") return MAN;
  if (contact.relation === "daughter" || contact.relation === "sister") return WOMAN;
  return contact.name.length % 2 === 0 ? WOMAN : MAN;
}

const cardTone: Record<Relation, string> = {
  daughter: "border-[#F3C6D4] bg-[#FDE8EF]",
  son: "border-[#F0E0A8] bg-[#FFF4D6]",
  sister: "border-[#D4C6EA] bg-[#EDE4F7]",
  brother: "border-[#F0E0A8] bg-[#FFF4D6]",
  spouse: "border-[#F3C6D4] bg-[#FDE8EF]",
  friend: "border-[#C5DDF0] bg-[#E7F3FB]",
  other: "border-navy/10 bg-white",
};

export function ContactsPage() {
  const { data, addFamilyMessage } = useApp();
  const [chat, setChat] = useState<{ id: string; kind: "call" | "message" } | null>(null);
  const chatting = data.contacts.find((contact) => contact.id === chat?.id);

  if (chatting && chat) return <FamilyChat contact={chatting} kind={chat.kind} onBack={() => setChat(null)} />;

  return (
    <Screen title={copy.myFamily} heading="single" backTo="/home">
      {data.contacts.length === 0 ? (
        <Paragraph text={copy.emptyContacts} />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {data.contacts.map((contact) => (
            <FamilyTile
              key={contact.id}
              contact={contact}
              onCall={() => {
                addFamilyMessage(contact.id, "call", familyCallMessage(contact.name));
                setChat({ id: contact.id, kind: "call" });
              }}
              onMessage={() => setChat({ id: contact.id, kind: "message" })}
            />
          ))}
        </div>
      )}
      <FamilyInformed />
    </Screen>
  );
}

function FamilyTile({ contact, onCall, onMessage }: { contact: Contact; onCall: () => void; onMessage: () => void }) {
  const { t, lang } = useText();

  return (
    <article className={`flex h-full flex-col items-center rounded-3xl border p-3.5 ${cardTone[contact.relation]}`}>
      <span className="grid size-28 shrink-0 place-items-center overflow-hidden rounded-full bg-white">
        <img src={portraitSrc(contact)} alt="" className="h-full w-full object-contain object-center" />
      </span>
      <p className="mt-3 flex min-h-[2.6rem] items-center text-center text-[1.45rem] font-bold leading-tight text-navy" lang={lang}>
        {t(relationCopy[contact.relation])}
      </p>
      <p className="mt-1 min-h-[2.4rem] text-center text-[1.05rem] leading-tight text-ink">{contact.name}</p>
      <div className="mt-auto grid w-full grid-cols-1 gap-2 pt-3">
        <button
          type="button"
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-navy px-2 text-[1.05rem] font-bold text-white"
          onClick={onCall}
        >
          <Phone aria-hidden="true" size={22} />
          <span lang={lang}>{t(copy.call)}</span>
        </button>
        <button
          type="button"
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#D7E6F7] px-2 text-[1.05rem] font-bold text-navy"
          onClick={onMessage}
        >
          <MessageSquare aria-hidden="true" size={22} />
          <span lang={lang}>{t(copy.message)}</span>
        </button>
      </div>
    </article>
  );
}

function FamilyChat({ contact, kind, onBack }: { contact: Contact; kind: "call" | "message"; onBack: () => void }) {
  const { data } = useApp();
  const { t, lang } = useText();
  const [openedAt] = useState(() => Date.now());
  const logged = (data.familyThreads ?? [])
    .filter((item) => item.contactId === contact.id)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const history = [
    { id: "medicine", kind: "medicine" as const, at: new Date(openedAt - 3 * 60000).toISOString(), text: familyCheckMessage(contact.name) },
    ...logged.map((item) => ({ id: item.id, kind: item.kind, at: item.createdAt, text: item.body })),
  ];
  const labels = {
    medicine: copy.chatFromSahaay,
    call: copy.call,
    sos: { en: "Emergency SOS", hi: "आपातकालीन एसओएस" },
    assist: { en: "Assistance", hi: "सहायता" },
  };

  useEffect(() => {
    const main = document.getElementById("main");
    if (kind === "call") {
      const calls = history.filter((item) => item.kind === "call");
      const latest = calls[calls.length - 1];
      if (latest) document.getElementById(`family-note-${latest.id}`)?.scrollIntoView({ block: "nearest" });
      return;
    }
    main?.scrollTo({ top: 0 });
    // history is derived from the saved thread; rerun when that thread or the opened card changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact.id, kind, logged.length]);

  return (
    <div>
      <header className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="grid size-12 shrink-0 place-items-center rounded-2xl border border-navy/10 bg-white text-navy"
          aria-label={t(copy.back)}
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full bg-white">
          <img src={portraitSrc(contact)} alt="" className="h-full w-full object-contain object-center" />
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-[1.35rem] font-bold leading-tight text-navy">{contact.name}</h1>
          <p className="text-[1.05rem]" lang={lang}>
            {t(relationCopy[contact.relation])}
          </p>
        </div>
      </header>
      <section className="rounded-3xl border border-navy/10 bg-white p-4">
        <div className="grid gap-4">
          {history.map((item) => (
            <article key={item.id} id={`family-note-${item.id}`}>
              <div className="flex items-center gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#E7F3FB] text-navy">
                  {item.kind === "call" ? (
                    <Phone aria-hidden="true" size={22} />
                  ) : item.kind === "sos" ? (
                    <Siren aria-hidden="true" size={22} />
                  ) : item.kind === "assist" ? (
                    <HandHelping aria-hidden="true" size={22} />
                  ) : (
                    <Bell aria-hidden="true" size={22} />
                  )}
                </span>
                <p className="text-[1.1rem] font-bold leading-tight text-navy" lang={lang}>
                  {t(labels[item.kind])}
                </p>
              </div>
              <p className="mt-3 text-[1rem] text-muted" lang={lang}>
                {formatWhen(item.at, lang)}
              </p>
              <div className="mt-2 rounded-3xl rounded-br-lg bg-navy px-4 py-3 text-white">
                <p className="text-[1.1rem] leading-snug" lang={lang}>
                  {t(item.text)}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-3 flex items-start gap-2">
          <Check aria-hidden="true" className="mt-0.5 shrink-0 text-success" size={22} strokeWidth={3} />
          <div>
            <p className="text-[1.05rem] font-bold leading-tight text-success" lang={lang}>
              {t(copy.chatSentAuto)}
            </p>
            <p className="mt-1 text-[1rem] leading-tight text-muted" lang={lang}>
              {t(copy.chatOnDevice)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FamilyInformed() {
  const { data } = useApp();
  const { t, lang } = useText();
  const people = data.contacts.filter((contact) => contact.notifyMedicine);
  const watched = data.medicines.filter((medicine) => !medicine.takenAt && (medicine.snoozeCount ?? 0) >= 2);
  const live =
    watched.length && people.length
      ? familyMedicineNote(
          watched.map((medicine) => medicine.name).join(", "),
          people.map((contact) => contact.name).join(", "),
        )
      : null;

  return (
    <section className="mt-4 flex items-center gap-3 rounded-3xl border border-[#C5DDF0] bg-[#E7F3FB] p-4">
      <img src="/icons/family.png" alt="" className="size-16 shrink-0 object-contain" />
      <div className="min-w-0">
        <h2 className="text-[1.2rem] font-bold leading-tight text-navy" lang={lang}>
          {t(copy.familyInformedTitle)}
        </h2>
        <p className="mt-1 text-[1.05rem] leading-snug text-ink" lang={lang}>
          {t(copy.familyInformedBody)}
        </p>
        {live ? (
          <p className="mt-2 text-[1.05rem] font-semibold leading-snug text-navy" lang={lang}>
            {t(live)}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export function ContactCard({ contact }: { contact: Contact }) {
  const { t, lang } = useText();
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <div className="flex items-center gap-4">
        <span className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-full bg-[#F7F1E8]">
          <img src={portraitSrc(contact)} alt="" className="h-full w-full object-contain object-top" />
        </span>
        <div className="min-w-0">
          <p className="text-[1.25rem] font-bold leading-tight text-navy">{contact.name}</p>
          <p className="text-[1.05rem]" lang={lang}>
            {t(relationCopy[contact.relation])}
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <a href={telHref(contact.phone)} className="grid min-h-14 place-items-center rounded-2xl bg-navy px-2 text-white">
          <BiBlock text={copy.call} center primaryClass="text-[1.05rem] font-bold" secondaryClass="text-[0.9rem] opacity-90" />
        </a>
        <button type="button" className="min-h-14 rounded-2xl border border-navy/15 bg-white" onClick={() => setOpen(true)}>
          <BiBlock text={copy.message} center />
        </button>
      </div>
      <Dialog
        open={open}
        title={messageConfirm(contact.name)}
        confirmLabel={copy.sendMessage}
        confirmHref={smsHref(contact.phone, t(copy.messagePreview))}
        onConfirm={() => setOpen(false)}
        onClose={() => setOpen(false)}
      >
        <p className="text-[1.1rem] font-semibold text-navy">“{t(copy.messagePreview)}”</p>
        <div className="mt-3">
          <Paragraph text={copy.messageFallback} />
        </div>
      </Dialog>
    </Card>
  );
}

const emptyContact = (): Contact => ({
  id: uid(),
  name: "",
  relation: "daughter",
  phone: "",
  upiId: "",
  notifyMedicine: false,
  notifyPayment: false,
  notifySos: false,
});

export function ContactFormPage() {
  const { id } = useParams();
  return <ContactEditor key={id ?? "new"} contactId={id} />;
}

function ContactEditor({ contactId }: { contactId?: string }) {
  const { data, saveContact, removeContact } = useApp();
  const navigate = useNavigate();
  const existing = data.contacts.find((contact) => contact.id === contactId);
  const [draft, setDraft] = useState<Contact>(() => existing ?? emptyContact());
  const [errors, setErrors] = useState<{ name?: Localized; phone?: Localized; upi?: Localized }>({});
  const [removeOpen, setRemoveOpen] = useState(false);

  if (contactId && !existing) {
    return (
      <Screen title={copy.contacts} backTo="/contacts">
        <Paragraph text={copy.contactMissing} />
      </Screen>
    );
  }

  function save() {
    const nextErrors: { name?: Localized; phone?: Localized; upi?: Localized } = {};
    if (draft.name.trim().length < 2) nextErrors.name = copy.nameError;
    const digits = draft.phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) nextErrors.phone = copy.phoneError;
    if (draft.upiId.trim() && !/^[\w.-]{2,}@[\w.-]{2,}$/.test(draft.upiId.trim())) nextErrors.upi = copy.upiError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    saveContact({ ...draft, name: draft.name.trim(), phone: draft.phone.trim(), upiId: draft.upiId.trim() });
    navigate("/contacts");
  }

  return (
    <Screen title={existing ? copy.editContact : copy.addContact} backTo="/contacts">
      <FieldLabel text={copy.fullName} htmlFor="contact-name" />
      <input id="contact-name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} autoComplete="name" />
      {errors.name ? <ErrorText text={errors.name} /> : null}

      <div className="mt-4">
        <BiBlock text={copy.relationship} primaryClass="text-[1.05rem] font-bold text-navy" />
        <div className="mt-2 grid grid-cols-2 gap-2">
          {relations.map((relation) => (
            <button
              key={relation}
              type="button"
              aria-pressed={draft.relation === relation}
              onClick={() => setDraft({ ...draft, relation: relation as Relation })}
              className={`min-h-14 rounded-2xl border px-2 ${draft.relation === relation ? "border-navy bg-white ring-2 ring-navy" : "border-navy/10 bg-white"}`}
            >
              <BiBlock text={relationCopy[relation]} center primaryClass="text-[1rem] font-bold" secondaryClass="text-[0.9rem]" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <FieldLabel text={copy.phone} htmlFor="contact-phone" />
        <input id="contact-phone" value={draft.phone} inputMode="tel" autoComplete="tel" onChange={(event) => setDraft({ ...draft, phone: event.target.value })} />
        {errors.phone ? <ErrorText text={errors.phone} /> : null}
      </div>

      <div className="mt-4">
        <FieldLabel text={copy.upi} htmlFor="contact-upi" />
        <input id="contact-upi" value={draft.upiId} autoComplete="off" spellCheck={false} onChange={(event) => setDraft({ ...draft, upiId: event.target.value })} />
        <div className="mt-2">
          <Paragraph text={copy.upiOptional} />
        </div>
        {errors.upi ? <ErrorText text={errors.upi} /> : null}
      </div>

      <div className="mt-4 rounded-3xl border border-navy/10 bg-white px-4">
        <SwitchRow checked={draft.notifyMedicine} onChange={(value) => setDraft({ ...draft, notifyMedicine: value })} label={copy.allowMedicine} hint={copy.consentMedicine} />
        <SwitchRow checked={draft.notifyPayment} onChange={(value) => setDraft({ ...draft, notifyPayment: value })} label={copy.allowPayment} hint={copy.consentPayment} />
        <SwitchRow checked={draft.notifySos} onChange={(value) => setDraft({ ...draft, notifySos: value })} label={copy.allowSos} hint={copy.consentSos} />
      </div>
      <div className="mt-3">
        <Paragraph text={copy.agree} />
      </div>
      <div className="mt-4 grid gap-3">
        <Button label={copy.save} onClick={save} />
        {existing ? (
          <Button label={copy.remove} variant="danger" onClick={() => setRemoveOpen(true)} />
        ) : null}
      </div>
      <Dialog
        open={removeOpen}
        title={removeConfirm(draft.name || existing?.name || "")}
        confirmLabel={copy.remove}
        tone="danger"
        initialFocus="cancel"
        onConfirm={() => {
          if (existing) removeContact(existing.id);
          navigate("/contacts");
        }}
        onClose={() => setRemoveOpen(false)}
      >
        <p className="text-[1.05rem] text-ink">{existing?.phone}</p>
      </Dialog>
    </Screen>
  );
}
