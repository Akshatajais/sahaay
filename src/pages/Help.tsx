import {
  Check,
  ChevronLeft,
  CircleHelp,
  HandHelping,
  HeartPulse,
  House,
  LoaderCircle,
  MapPin,
  MessageCircle,
  MicOff,
  Phone,
  PhoneOff,
  Pill,
  Siren,
  Volume2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paragraph, Screen } from "../components/ui.tsx";
import { copy, assistFamilyMessage, familyCallMessage, familyRespondedNote, sosFamilyAlert } from "../i18n/copy.ts";
import { useText } from "../i18n/useText.ts";
import { formatWhen } from "../lib/format.ts";
import { useApp } from "../state/AppState.tsx";
import type { Localized } from "../types.ts";
import { ContactCard } from "./Contacts.tsx";

const WOMAN = "/icons/avatar-woman.png";
const MAN = "/icons/avatar-man.png";

const text = {
  title: { en: "Sahaay Emergency", hi: "सहाय आपातकाल" },
  ok: { en: "Are you okay?", hi: "क्या आप ठीक हैं?" },
  sub: { en: "We are here to help you. Choose what you need.", hi: "हम आपकी मदद के लिए यहाँ हैं। चुनें कि आपको क्या चाहिए।" },
  sosTitle: { en: "EMERGENCY SOS", hi: "आपातकालीन एसओएस" },
  sosNeed: { en: "I need immediate help", hi: "मुझे तुरंत मदद चाहिए" },
  sosSupport: { en: "Alert my family and start emergency assistance", hi: "मेरे परिवार को सूचित करें और आपातकालीन सहायता शुरू करें" },
  callFamily: { en: "Call my family", hi: "मेरे परिवार को कॉल करें" },
  callFamilyDesc: { en: "I need to speak to someone I trust.", hi: "मुझे किसी भरोसेमंद व्यक्ति से बात करनी है।" },
  assist: { en: "I need some assistance", hi: "मुझे कुछ सहायता चाहिए" },
  assistDesc: { en: "I need help, but it's not an emergency.", hi: "मुझे मदद चाहिए, पर यह आपातकाल नहीं है।" },
  locationShare: {
    en: "My location will be shared when you request emergency help.",
    hi: "जब आप आपातकालीन मदद माँगेंगे, तब आपका स्थान साझा किया जाएगा।",
  },
  startAsk: { en: "Start Emergency SOS?", hi: "आपातकालीन एसओएस शुरू करें?" },
  startBody: {
    en: "Sahaay will alert your emergency contacts and share your current location if available.",
    hi: "सहाय आपके आपातकालीन संपर्कों को सूचित करेगा और उपलब्ध होने पर आपका वर्तमान स्थान साझा करेगा।",
  },
  rowContacts: { en: "Alert your emergency contacts.", hi: "अपने आपातकालीन संपर्कों को सूचित करें।" },
  rowLocation: { en: "Share your current location.", hi: "अपना वर्तमान स्थान साझा करें।" },
  rowAccess: { en: "Make emergency assistance accessible.", hi: "आपातकालीन सहायता उपलब्ध रखें।" },
  yesStart: { en: "Yes, Start SOS", hi: "हाँ, एसओएस शुरू करें" },
  cancel: { en: "Cancel", hi: "रद्द करें" },
  live: { en: "LIVE", hi: "लाइव" },
  activated: { en: "SOS Activated", hi: "एसओएस चालू है" },
  activatedBody: { en: "We are contacting your emergency contacts.", hi: "हम आपके आपातकालीन संपर्कों से संपर्क कर रहे हैं।" },
  alertSent: { en: "Alert sent to emergency contacts", hi: "आपातकालीन संपर्कों को सूचना भेज दी गई" },
  locationStarted: { en: "Location sharing started", hi: "स्थान साझा करना शुरू हो गया" },
  waitingFamily: { en: "Waiting for family response", hi: "परिवार के जवाब की प्रतीक्षा" },
  call112: { en: "CALL 112 – Emergency Services", hi: "112 पर कॉल करें – आपातकालीन सेवाएँ" },
  cancelSos: { en: "Cancel SOS", hi: "एसओएस रद्द करें" },
  daughterResponding: { en: "Your daughter is responding!", hi: "आपकी बेटी जवाब दे रही है!" },
  priyaOnWay: { en: "Priya has received your alert and is on the way.", hi: "प्रिया को आपकी सूचना मिल गई है और वह रास्ते में है।" },
  onTheWay: { en: "On the way", hi: "रास्ते में" },
  waiting: { en: "Waiting", hi: "प्रतीक्षा" },
  responding: { en: "Responding", hi: "जवाब दे रही हैं" },
  alertStatus: { en: "Alert sent", hi: "सूचना भेजी गई" },
  yourLocation: { en: "Your current location", hi: "आपका वर्तमान स्थान" },
  liveShared: { en: "Live location shared", hi: "लाइव स्थान साझा है" },
  showResponding: { en: "Show Priya responding", hi: "प्रिया का जवाब दिखाएँ" },
  showWaiting: { en: "Show waiting again", hi: "फिर प्रतीक्षा दिखाएँ" },
  whatNeed: { en: "What do you need help with?", hi: "आपको किस बात में मदद चाहिए?" },
  danger: {
    en: "If you are in immediate danger or need urgent medical assistance, use Emergency SOS.",
    hi: "अगर तुरंत खतरा हो या जल्दी चिकित्सा मदद चाहिए, तो आपातकालीन एसओएस का उपयोग करें।",
  },
  submitRequest: { en: "Submit request", hi: "अनुरोध भेजें" },
  requestSubmitted: { en: "Request submitted", hi: "अनुरोध भेज दिया गया" },
  requestBody: { en: "Priya has been asked to help with this.", hi: "प्रिया से इस काम में मदद माँगी गई है।" },
  callPriya: { en: "Call Priya", hi: "प्रिया को कॉल करें" },
  calling: { en: "Calling...", hi: "कॉल हो रही है..." },
  endCall: { en: "End call", hi: "कॉल समाप्त करें" },
  speaker: { en: "Speaker", hi: "स्पीकर" },
  mute: { en: "Mute", hi: "म्यूट" },
  cancelAsk: { en: "Are you sure you want to cancel SOS?", hi: "क्या आप वाकई एसओएस रद्द करना चाहते हैं?" },
  cancelOnly: {
    en: "Only cancel if you no longer need emergency assistance.",
    hi: "केवल तभी रद्द करें जब आपको आपातकालीन सहायता की ज़रूरत न रहे।",
  },
  yesCancel: { en: "Yes, Cancel SOS", hi: "हाँ, एसओएस रद्द करें" },
  stillNeed: { en: "No, I Still Need Help", hi: "नहीं, मुझे अभी भी मदद चाहिए" },
  cancelledTitle: { en: "SOS cancelled", hi: "एसओएस रद्द हो गया" },
  cancelledBody: { en: "The emergency alert has been cancelled.", hi: "आपातकालीन सूचना रद्द कर दी गई है।" },
  backToSos: { en: "Back to Sahaay Emergency", hi: "सहाय आपातकाल पर वापस" },
  daughter: { en: "Daughter", hi: "बेटी" },
  son: { en: "Son", hi: "बेटा" },
  services: { en: "Emergency Services", hi: "आपातकालीन सेवाएँ" },
  acknowledged: { en: "Acknowledged", hi: "स्वीकार किया" },
} satisfies Record<string, Localized>;

const needs: Array<{ id: string; label: Localized; icon: typeof Pill }> = [
  { id: "medicines", label: { en: "I need help with my medicines.", hi: "मुझे दवाइयों में मदद चाहिए।" }, icon: Pill },
  { id: "home", label: { en: "I need help at home.", hi: "मुझे घर पर मदद चाहिए।" }, icon: House },
  { id: "going", label: { en: "I need help going somewhere.", hi: "मुझे कहीं जाने में मदद चाहिए।" }, icon: MapPin },
  { id: "unwell", label: { en: "I'm not feeling well.", hi: "मेरी तबीयत ठीक नहीं है।" }, icon: HeartPulse },
  { id: "talk", label: { en: "I want to talk to someone.", hi: "मैं किसी से बात करना चाहता हूँ।" }, icon: MessageCircle },
  { id: "else", label: { en: "Something else.", hi: "कुछ और।" }, icon: CircleHelp },
];

type Person = { id: string; name: string; relation: Localized; phone: string; image: string | null };

const family: Person[] = [
  { id: "priya", name: "Priya", relation: text.daughter, phone: "+91 98765 43210", image: WOMAN },
  { id: "rahul", name: "Rahul", relation: text.son, phone: "+91 98765 43211", image: MAN },
];

const emergencyLine: Person = { id: "112", name: "112", relation: text.services, phone: "112", image: null };

type Step =
  | { name: "main" }
  | { name: "confirm" }
  | { name: "active" }
  | { name: "contacts" }
  | { name: "call"; person: Person }
  | { name: "assist" }
  | { name: "assistPick"; id: string }
  | { name: "assistDone"; id: string }
  | { name: "cancelled" };

export function HelpPage() {
  const navigate = useNavigate();
  const { data, addFamilyMessage } = useApp();
  const { t, lang } = useText();
  const [stack, setStack] = useState<Step[]>([{ name: "main" }]);
  const [live, setLive] = useState(false);
  const [responding, setResponding] = useState(false);
  const [respondedAt, setRespondedAt] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const view = stack[stack.length - 1];
  const viewKey =
    view.name === "call" ? `call:${view.person.id}` : view.name === "assistPick" || view.name === "assistDone" ? `${view.name}:${view.id}` : view.name;

  useEffect(() => {
    document.title = `SAHAAY — ${t(text.title)}`;
    document.getElementById("main")?.scrollTo({ top: 0 });
  }, [lang, viewKey]);

  function push(step: Step) {
    setStack((current) => [...current, step]);
  }

  function back() {
    if (cancelOpen) {
      setCancelOpen(false);
      return;
    }
    if (stack.length <= 1) {
      navigate("/home");
      return;
    }
    setStack((current) => current.slice(0, -1));
  }

  function familyContactId(person: Person) {
    const named = data.contacts.find((contact) => contact.name.toLowerCase().startsWith(person.name.toLowerCase()));
    if (named) return named.id;
    if (person.id === "rahul") return data.contacts.find((contact) => contact.relation === "son")?.id ?? null;
    if (person.id === "priya") return data.contacts.find((contact) => contact.relation === "daughter")?.id ?? null;
    return null;
  }

  function noteCall(person: Person) {
    const contactId = familyContactId(person);
    if (!contactId) return;
    const contact = data.contacts.find((item) => item.id === contactId);
    addFamilyMessage(contactId, "call", familyCallMessage(contact?.name ?? person.name));
  }

  function noteFor(contactId: string | null, kind: "sos" | "assist" | "call", body: Localized) {
    if (contactId) addFamilyMessage(contactId, kind, body);
  }

  function startSos() {
    for (const person of family) noteFor(familyContactId(person), "sos", sosFamilyAlert());
    setLive(true);
    setResponding(false);
    setRespondedAt(null);
    setStack([{ name: "main" }, { name: "active" }]);
  }

  function finishCancel() {
    setLive(false);
    setResponding(false);
    setRespondedAt(null);
    setCancelOpen(false);
    setStack([{ name: "main" }, { name: "cancelled" }]);
  }

  const priya = family[0];

  return (
    <div>
      <SosHeader title={text.title} onBack={back} live={live && view.name === "active"} />
      {view.name === "main" ? (
        <MainView onSos={() => push({ name: "confirm" })} onFamily={() => push({ name: "contacts" })} onAssist={() => push({ name: "assist" })} />
      ) : null}
      {view.name === "confirm" ? <ConfirmView onStart={startSos} onCancel={back} /> : null}
      {view.name === "active" ? (
        <ActiveView
          responding={responding}
          respondedAt={respondedAt}
          onToggle={() => {
            if (!responding) {
              setRespondedAt(new Date().toISOString());
              noteFor(familyContactId(priya), "sos", familyRespondedNote());
            } else {
              setRespondedAt(null);
            }
            setResponding((value) => !value);
          }}
          onCall112={() => push({ name: "call", person: emergencyLine })}
          onFamily={() => push({ name: "contacts" })}
          onCancel={() => setCancelOpen(true)}
        />
      ) : null}
      {view.name === "contacts" ? <ContactsView onCall={(person) => { noteCall(person); push({ name: "call", person }); }} /> : null}
      {view.name === "call" ? <CallView person={view.person} onEnd={back} /> : null}
      {view.name === "assist" ? <AssistList onPick={(id) => push({ name: "assistPick", id })} onSos={() => push({ name: "confirm" })} /> : null}
      {view.name === "assistPick" ? (
        <AssistDetail
          id={view.id}
          onSubmit={() => {
            const need = needs.find((item) => item.id === view.id) ?? needs[0];
            noteFor(familyContactId(priya), "assist", assistFamilyMessage(need.label));
            push({ name: "assistDone", id: view.id });
          }}
          onCall={() => {
            noteCall(priya);
            push({ name: "call", person: priya });
          }}
          onSos={() => push({ name: "confirm" })}
        />
      ) : null}
      {view.name === "assistDone" ? (
        <AssistDone
          id={view.id}
          onCall={() => {
            noteCall(priya);
            push({ name: "call", person: priya });
          }}
          onSos={() => push({ name: "confirm" })}
        />
      ) : null}
      {view.name === "cancelled" ? <CancelledView onDone={() => setStack([{ name: "main" }])} /> : null}
      {cancelOpen ? <CancelModal onYes={finishCancel} onNo={() => setCancelOpen(false)} /> : null}
    </div>
  );
}

function SosHeader({ title, onBack, live }: { title: Localized; onBack: () => void; live?: boolean }) {
  const { t, lang } = useText();
  return (
    <header className="mb-5 flex items-center gap-3">
      <button
        type="button"
        onClick={onBack}
        className="grid size-12 shrink-0 place-items-center rounded-2xl border border-navy/10 bg-white text-navy"
        aria-label={t(copy.back)}
      >
        <ChevronLeft aria-hidden="true" />
      </button>
      <h1 className="min-w-0 flex-1 text-[1.55rem] font-bold leading-tight text-navy" lang={lang}>
        {t(title)}
      </h1>
      {live ? (
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-sos px-3 py-1.5 text-[0.95rem] font-bold text-white">
          <span className="size-2 rounded-full bg-white" aria-hidden="true" />
          {t(text.live)}
        </span>
      ) : null}
    </header>
  );
}

function MainView({ onSos, onFamily, onAssist }: { onSos: () => void; onFamily: () => void; onAssist: () => void }) {
  const { t, lang } = useText();
  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-[1.85rem] font-bold leading-tight text-navy" lang={lang}>
          {t(text.ok)}
        </h2>
        <p className="mt-2 text-[1.1rem] leading-snug text-ink" lang={lang}>
          {t(text.sub)}
        </p>
      </div>
      <button type="button" onClick={onSos} className="rounded-3xl bg-sos p-5 text-left text-white">
        <Phone aria-hidden="true" size={42} />
        <span className="mt-3 block text-[1.45rem] font-bold leading-tight" lang={lang}>
          {t(text.sosTitle)}
        </span>
        <span className="mt-1 block text-[1.15rem] font-semibold leading-snug" lang={lang}>
          {t(text.sosNeed)}
        </span>
        <span className="mt-2 block text-[1.05rem] leading-snug text-white/90" lang={lang}>
          {t(text.sosSupport)}
        </span>
      </button>
      <button type="button" onClick={onFamily} className="rounded-3xl border border-[#B7E4C7] bg-[#E7F7EE] p-5 text-left text-navy">
        <Phone aria-hidden="true" size={42} />
        <span className="mt-3 block text-[1.4rem] font-bold leading-tight" lang={lang}>
          {t(text.callFamily)}
        </span>
        <span className="mt-1 block text-[1.1rem] leading-snug" lang={lang}>
          {t(text.callFamilyDesc)}
        </span>
      </button>
      <button type="button" onClick={onAssist} className="rounded-3xl border border-[#C5DDF0] bg-[#E7F3FB] p-5 text-left text-navy">
        <HandHelping aria-hidden="true" size={42} />
        <span className="mt-3 block text-[1.4rem] font-bold leading-tight" lang={lang}>
          {t(text.assist)}
        </span>
        <span className="mt-1 block text-[1.1rem] leading-snug" lang={lang}>
          {t(text.assistDesc)}
        </span>
      </button>
      <p className="rounded-2xl border border-navy/10 bg-white px-4 py-3 text-[1rem] leading-snug text-ink" lang={lang}>
        {t(text.locationShare)}
      </p>
    </div>
  );
}

function ConfirmView({ onStart, onCancel }: { onStart: () => void; onCancel: () => void }) {
  const { t, lang } = useText();
  const rows = [text.rowContacts, text.rowLocation, text.rowAccess];
  return (
    <div className="grid gap-4">
      <div className="grid justify-items-center text-center">
        <span className="grid size-28 place-items-center rounded-full bg-[#FDE8E8] text-sos">
          <Siren aria-hidden="true" size={52} />
        </span>
        <h2 className="mt-4 text-[1.75rem] font-bold leading-tight text-navy" lang={lang}>
          {t(text.startAsk)}
        </h2>
        <p className="mt-2 text-[1.1rem] leading-snug text-ink" lang={lang}>
          {t(text.startBody)}
        </p>
      </div>
      <ul className="grid gap-3">
        {rows.map((row) => (
          <li key={row.en} className="flex items-center gap-3 rounded-2xl border border-navy/10 bg-white px-4 py-3">
            <Check aria-hidden="true" className="shrink-0 text-navy" size={22} />
            <span className="text-[1.05rem] font-semibold leading-snug text-navy" lang={lang}>
              {t(row)}
            </span>
          </li>
        ))}
      </ul>
      <button type="button" onClick={onStart} className="flex h-14 items-center justify-center rounded-2xl bg-sos px-4 text-[1.15rem] font-bold text-white">
        <span lang={lang}>{t(text.yesStart)}</span>
      </button>
      <button type="button" onClick={onCancel} className="flex h-14 items-center justify-center rounded-2xl border border-navy/20 bg-white px-4 text-[1.15rem] font-bold text-navy">
        <span lang={lang}>{t(text.cancel)}</span>
      </button>
    </div>
  );
}

function ActiveView({
  responding,
  respondedAt,
  onToggle,
  onCall112,
  onFamily,
  onCancel,
}: {
  responding: boolean;
  respondedAt: string | null;
  onToggle: () => void;
  onCall112: () => void;
  onFamily: () => void;
  onCancel: () => void;
}) {
  const { t, lang } = useText();
  const priya = family[0];
  return (
    <div className="grid gap-4">
      <div className="grid justify-items-center text-center">
        <span className="grid size-24 place-items-center rounded-full bg-[#FDE8E8] text-sos">
          <Siren aria-hidden="true" size={48} />
        </span>
        <h2 className="mt-3 text-[1.75rem] font-bold leading-tight text-navy" lang={lang}>
          {t(text.activated)}
        </h2>
        <p className="mt-1 text-[1.1rem] leading-snug text-ink" lang={lang}>
          {t(text.activatedBody)}
        </p>
      </div>
      {responding ? (
        <section className="rounded-3xl border border-[#B7E4C7] bg-[#E7F7EE] p-4">
          <p className="text-[1.35rem] font-bold leading-tight text-success" lang={lang}>
            {t(text.daughterResponding)}
          </p>
          <p className="mt-1 text-[1.05rem] leading-snug text-navy" lang={lang}>
            {t(text.priyaOnWay)}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <Avatar person={priya} />
            <div className="min-w-0">
              <p className="text-[1.15rem] font-bold text-navy">{priya.name}</p>
              <p className="text-[1rem]" lang={lang}>
                {t(priya.relation)}
              </p>
              <p className="text-[1rem] font-semibold text-success" lang={lang}>
                {t(text.onTheWay)}
              </p>
              {respondedAt ? (
                <p className="text-[0.95rem] text-muted" lang={lang}>
                  {t(text.acknowledged)} · {formatWhen(respondedAt, lang)}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
      <ul className="grid gap-2">
        <CheckRow label={text.alertSent} />
        <CheckRow label={text.locationStarted} />
        <li className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2">
          {responding ? (
            <Check aria-hidden="true" className="shrink-0 text-success" size={22} strokeWidth={3} />
          ) : (
            <LoaderCircle aria-hidden="true" className="shrink-0 animate-spin text-navy" size={22} />
          )}
          <span className="text-[1.05rem] font-semibold text-navy" lang={lang}>
            {t(responding ? text.daughterResponding : text.waitingFamily)}
          </span>
        </li>
      </ul>
      <div className="grid gap-3">
        {family.map((person) => {
          const answered = responding && person.id === "priya";
          return (
            <article key={person.id} className="flex items-center gap-3 rounded-3xl border border-navy/10 bg-white p-3">
              <Avatar person={person} />
              <div className="min-w-0 flex-1">
                <p className="text-[1.15rem] font-bold leading-tight text-navy">{person.name}</p>
                <p className="text-[1rem]" lang={lang}>
                  {t(person.relation)}
                </p>
                <p className="text-[0.95rem] text-muted" lang={lang}>
                  {t(text.alertStatus)}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1.5 text-[0.95rem] font-bold ${answered ? "bg-[#E7F7EE] text-success" : "bg-amber text-amber-ink"}`}
                lang={lang}
              >
                {t(answered ? text.responding : text.waiting)}
              </span>
            </article>
          );
        })}
      </div>
      <button type="button" onClick={onToggle} className="min-h-12 text-left text-[1.05rem] font-bold text-navy underline" lang={lang}>
        {t(responding ? text.showWaiting : text.showResponding)}
      </button>
      <LocationBlock />
      <button type="button" onClick={onCall112} className="flex h-14 items-center justify-center rounded-2xl bg-sos px-4 text-center text-[1.1rem] font-bold text-white">
        <span lang={lang}>{t(text.call112)}</span>
      </button>
      <button type="button" onClick={onFamily} className="flex h-14 items-center justify-center rounded-2xl border border-navy/20 bg-white px-4 text-[1.15rem] font-bold text-navy">
        <span lang={lang}>{t(text.callFamily)}</span>
      </button>
      <button type="button" onClick={onCancel} className="min-h-12 text-[1.1rem] font-bold text-sos">
        <span lang={lang}>{t(text.cancelSos)}</span>
      </button>
    </div>
  );
}

function ContactsView({ onCall }: { onCall: (person: Person) => void }) {
  const { t, lang } = useText();
  return (
    <div className="grid gap-4">
      <h2 className="text-[1.6rem] font-bold leading-tight text-navy" lang={lang}>
        {t(text.callFamily)}
      </h2>
      {family.map((person) => (
        <article key={person.id} className="rounded-3xl border border-navy/10 bg-white p-4">
          <div className="flex items-center gap-3">
            <Avatar person={person} />
            <div>
              <p className="text-[1.25rem] font-bold leading-tight text-navy">{person.name}</p>
              <p className="text-[1.05rem]" lang={lang}>
                {t(person.relation)}
              </p>
              <p className="text-[1.05rem] text-ink">{person.phone}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onCall(person)}
            className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-navy text-[1.15rem] font-bold text-white"
          >
            <Phone aria-hidden="true" size={22} />
            <span lang={lang}>{t(copy.call)}</span>
          </button>
        </article>
      ))}
    </div>
  );
}

function CallView({ person, onEnd }: { person: Person; onEnd: () => void }) {
  const { t, lang } = useText();
  const [seconds, setSeconds] = useState(0);
  const [connected, setConnected] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const wait = window.setTimeout(() => setConnected(true), 1200);
    return () => window.clearTimeout(wait);
  }, []);

  useEffect(() => {
    if (!connected) return;
    const tick = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(tick);
  }, [connected]);

  const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="grid justify-items-center gap-6 py-4 text-center">
      {person.image ? (
        <Avatar person={person} large />
      ) : (
        <span className="grid size-28 place-items-center rounded-full bg-[#FDE8E8] text-sos">
          <Siren aria-hidden="true" size={48} />
        </span>
      )}
      <div>
        <h2 className="text-[1.85rem] font-bold leading-tight text-navy">{person.name}</h2>
        <p className="mt-1 text-[1.1rem]" lang={lang}>
          {t(person.relation)}
        </p>
        <p className="mt-3 text-[1.25rem] font-semibold text-navy" lang={lang}>
          {connected ? clock : t(text.calling)}
        </p>
      </div>
      <div className="grid w-full grid-cols-2 gap-3">
        <button
          type="button"
          aria-pressed={speaker}
          onClick={() => setSpeaker((value) => !value)}
          className={`flex h-16 flex-col items-center justify-center gap-1 rounded-2xl border text-[1rem] font-bold ${speaker ? "border-navy bg-navy text-white" : "border-navy/15 bg-white text-navy"}`}
        >
          <Volume2 aria-hidden="true" size={22} />
          <span lang={lang}>{t(text.speaker)}</span>
        </button>
        <button
          type="button"
          aria-pressed={muted}
          onClick={() => setMuted((value) => !value)}
          className={`flex h-16 flex-col items-center justify-center gap-1 rounded-2xl border text-[1rem] font-bold ${muted ? "border-navy bg-navy text-white" : "border-navy/15 bg-white text-navy"}`}
        >
          <MicOff aria-hidden="true" size={22} />
          <span lang={lang}>{t(text.mute)}</span>
        </button>
      </div>
      <button type="button" onClick={onEnd} className="flex h-16 w-full items-center justify-center gap-2 rounded-full bg-sos text-[1.2rem] font-bold text-white">
        <PhoneOff aria-hidden="true" size={24} />
        <span lang={lang}>{t(text.endCall)}</span>
      </button>
    </div>
  );
}

function AssistList({ onPick, onSos }: { onPick: (id: string) => void; onSos: () => void }) {
  const { t, lang } = useText();
  return (
    <div className="grid gap-3">
      <h2 className="text-[1.6rem] font-bold leading-tight text-navy" lang={lang}>
        {t(text.whatNeed)}
      </h2>
      {needs.map((item) => {
        const Icon = item.icon;
        return (
          <button key={item.id} type="button" onClick={() => onPick(item.id)} className="flex min-h-20 items-center gap-4 rounded-3xl border border-navy/10 bg-white p-4 text-left">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#E7F3FB] text-navy">
              <Icon aria-hidden="true" size={28} />
            </span>
            <span className="text-[1.15rem] font-bold leading-snug text-navy" lang={lang}>
              {t(item.label)}
            </span>
          </button>
        );
      })}
      <DangerNote onSos={onSos} />
    </div>
  );
}

function AssistDetail({ id, onSubmit, onCall, onSos }: { id: string; onSubmit: () => void; onCall: () => void; onSos: () => void }) {
  const { t, lang } = useText();
  const item = needs.find((need) => need.id === id) ?? needs[0];
  const Icon = item.icon;
  return (
    <div className="grid gap-4">
      <div className="rounded-3xl border border-navy/10 bg-white p-5">
        <span className="grid size-16 place-items-center rounded-2xl bg-[#E7F3FB] text-navy">
          <Icon aria-hidden="true" size={32} />
        </span>
        <h2 className="mt-3 text-[1.5rem] font-bold leading-tight text-navy" lang={lang}>
          {t(item.label)}
        </h2>
      </div>
      <button type="button" onClick={onSubmit} className="flex h-14 items-center justify-center rounded-2xl bg-navy text-[1.15rem] font-bold text-white">
        <span lang={lang}>{t(text.submitRequest)}</span>
      </button>
      <button type="button" onClick={onCall} className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-navy/20 bg-white text-[1.15rem] font-bold text-navy">
        <Phone aria-hidden="true" size={22} />
        <span lang={lang}>{t(text.callPriya)}</span>
      </button>
      <DangerNote onSos={onSos} />
    </div>
  );
}

function AssistDone({ id, onCall, onSos }: { id: string; onCall: () => void; onSos: () => void }) {
  const { t, lang } = useText();
  const item = needs.find((need) => need.id === id) ?? needs[0];
  return (
    <div className="grid gap-4">
      <section className="rounded-3xl border border-[#B7E4C7] bg-[#E7F7EE] p-5">
        <Check aria-hidden="true" className="text-success" size={36} strokeWidth={3} />
        <h2 className="mt-3 text-[1.55rem] font-bold leading-tight text-navy" lang={lang}>
          {t(text.requestSubmitted)}
        </h2>
        <p className="mt-2 text-[1.1rem] leading-snug text-ink" lang={lang}>
          {t(item.label)}
        </p>
        <p className="mt-2 text-[1.05rem] leading-snug text-navy" lang={lang}>
          {t(text.requestBody)}
        </p>
      </section>
      <button type="button" onClick={onCall} className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-navy text-[1.15rem] font-bold text-white">
        <Phone aria-hidden="true" size={22} />
        <span lang={lang}>{t(text.callPriya)}</span>
      </button>
      <DangerNote onSos={onSos} />
    </div>
  );
}

function CancelledView({ onDone }: { onDone: () => void }) {
  const { t, lang } = useText();
  return (
    <div className="grid gap-4">
      <section className="rounded-3xl border border-navy/10 bg-white p-5 text-center">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-[#FDE8E8] text-sos">
          <Siren aria-hidden="true" size={36} />
        </span>
        <h2 className="mt-3 text-[1.6rem] font-bold leading-tight text-navy" lang={lang}>
          {t(text.cancelledTitle)}
        </h2>
        <p className="mt-2 text-[1.1rem] leading-snug text-ink" lang={lang}>
          {t(text.cancelledBody)}
        </p>
      </section>
      <button type="button" onClick={onDone} className="flex h-14 items-center justify-center rounded-2xl bg-navy text-[1.15rem] font-bold text-white">
        <span lang={lang}>{t(text.backToSos)}</span>
      </button>
    </div>
  );
}

function CancelModal({ onYes, onNo }: { onYes: () => void; onNo: () => void }) {
  const { t, lang } = useText();
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onNo();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onNo]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/45 p-4 sm:items-center" onMouseDown={(event) => event.target === event.currentTarget && onNo()}>
      <div role="dialog" aria-modal="true" className="w-full max-w-[440px] rounded-3xl border border-navy/10 bg-cream p-5">
        <h2 className="text-[1.45rem] font-bold leading-tight text-navy" lang={lang}>
          {t(text.cancelAsk)}
        </h2>
        <p className="mt-2 text-[1.05rem] leading-snug text-ink" lang={lang}>
          {t(text.cancelOnly)}
        </p>
        <div className="mt-4 grid gap-3">
          <button type="button" onClick={onYes} className="flex h-14 items-center justify-center rounded-2xl bg-sos text-[1.1rem] font-bold text-white">
            <span lang={lang}>{t(text.yesCancel)}</span>
          </button>
          <button type="button" onClick={onNo} className="flex h-14 items-center justify-center rounded-2xl border border-navy/20 bg-white text-[1.1rem] font-bold text-navy">
            <span lang={lang}>{t(text.stillNeed)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckRow({ label }: { label: Localized }) {
  const { t, lang } = useText();
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2">
      <Check aria-hidden="true" className="shrink-0 text-success" size={22} strokeWidth={3} />
      <span className="text-[1.05rem] font-semibold text-navy" lang={lang}>
        {t(label)}
      </span>
    </li>
  );
}

function Avatar({ person, large = false }: { person: Person; large?: boolean }) {
  const size = large ? "size-28" : "size-14";
  return (
    <span className={`grid ${size} shrink-0 place-items-center overflow-hidden rounded-full bg-[#F7F1E8]`}>
      {person.image ? <img src={person.image} alt="" className="h-full w-full object-contain object-center" /> : <Phone aria-hidden="true" />}
    </span>
  );
}

function LocationBlock() {
  const { t, lang } = useText();
  return (
    <section>
      <div className="relative h-36 overflow-hidden rounded-3xl border border-navy/10 bg-[#DCECC8]">
        <div className="absolute inset-x-10 top-10 h-3 rounded-full bg-white/80" />
        <div className="absolute top-0 left-16 h-full w-3 bg-white/70" />
        <div className="absolute right-8 bottom-5 h-12 w-28 rounded-full bg-[#B7D7A8]" />
        <span className="absolute top-1/2 left-1/2 grid -translate-x-1/2 -translate-y-full place-items-center text-sos">
          <MapPin aria-hidden="true" size={36} fill="currentColor" />
        </span>
      </div>
      <p className="mt-2 text-[1.1rem] font-bold text-navy" lang={lang}>
        {t(text.yourLocation)}
      </p>
      <p className="text-[1rem] text-muted" lang={lang}>
        {t(text.liveShared)}
      </p>
    </section>
  );
}

function DangerNote({ onSos }: { onSos: () => void }) {
  const { t, lang } = useText();
  return (
    <button type="button" onClick={onSos} className="rounded-2xl border border-[#F3C6C6] bg-[#FDE8E8] px-4 py-3 text-left text-[1.05rem] font-semibold leading-snug text-navy">
      <span lang={lang}>{t(text.danger)}</span>
    </button>
  );
}

export function FamilyPage() {
  const { data } = useApp();
  return (
    <Screen title={copy.myFamily} heading="single" backTo="/help">
      {data.contacts.length === 0 ? (
        <Paragraph text={copy.familyEmptyCall} />
      ) : (
        <div className="grid gap-3">
          {data.contacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </Screen>
  );
}
