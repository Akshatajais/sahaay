import { Mic, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ElderArt } from "../components/Illustrations.tsx";
import { BiBlock, Button, ButtonLink, Dialog, Paragraph, Screen } from "../components/ui.tsx";
import {
  callConfirm,
  callOpening,
  copy,
  habitAnswer,
  habitCopy,
  nextMedicineAnswer,
  relationCopy,
} from "../i18n/copy.ts";
import { useText } from "../i18n/useText.ts";
import { formatHm, primaryText, telHref } from "../lib/format.ts";
import { priorityMedicine, statusOf } from "../lib/medicines.ts";
import { createRecognition, recognitionSupported, speak } from "../lib/speech.ts";
import { interpret, type VoiceIntent } from "../lib/voice.ts";
import { useApp } from "../state/AppState.tsx";
import type { Contact, Localized } from "../types.ts";

type Reply = {
  heard: string;
  message: Localized;
  link?: { to: string; label: Localized };
  speechNote?: Localized;
};

export function VoicePage() {
  const { data, now } = useApp();
  const { t, lang } = useText();
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [draft, setDraft] = useState("");
  const [reply, setReply] = useState<Reply | null>(null);
  const [error, setError] = useState<Localized | null>(recognitionSupported() ? null : copy.voiceUnsupported);
  const [pendingCall, setPendingCall] = useState<Contact | null>(null);
  const [pendingSend, setPendingSend] = useState(false);
  const recRef = useRef<ReturnType<typeof createRecognition>>(null);

  useEffect(() => () => recRef.current?.stop(), []);

  function say(message: Localized, heard: string, link?: Reply["link"]) {
    const result = speak(primaryText(message, lang), lang);
    setReply({
      heard,
      message,
      link,
      speechNote: result === "missing" ? copy.speechUnavailable : result === "no-hindi-voice" ? copy.hindiVoiceMissing : undefined,
    });
  }

  function run(raw: string) {
    const text = raw.trim();
    if (!text) {
      setError(copy.noSpeech);
      return;
    }
    setError(null);
    const intent: VoiceIntent = interpret(text);
    if (intent.type === "nextMedicine") {
      const next = priorityMedicine(data.medicines, now);
      if (!next) {
        say(copy.nextMedicineNone, text, { to: "/medicines", label: copy.seeMedicines });
        return;
      }
      const unconfirmed = statusOf(next, now) === "needs_attention";
      say(
        nextMedicineAnswer(next.name, formatHm(next.time, "en"), formatHm(next.time, "hi"), unconfirmed),
        text,
        { to: `/medicines/${next.id}`, label: copy.seeMedicines },
      );
      return;
    }
    if (intent.type === "sendMoney") {
      setPendingSend(true);
      say(copy.sendConfirmBody, text);
      return;
    }
    if (intent.type === "help") {
      say(copy.helpOpened, text, { to: "/help", label: copy.help });
      return;
    }
    if (intent.type === "home") {
      say(copy.openedHome, text, { to: "/home", label: copy.home });
      return;
    }
    if (intent.type === "habit") {
      say(habitAnswer(habitCopy[intent.id].title), text, { to: "/day", label: copy.openHabit });
      return;
    }
    if (intent.type === "call") {
      const named = data.contacts.find((contact) => text.toLowerCase().includes(contact.name.toLowerCase()));
      const byRelation = intent.relation === "any" ? undefined : data.contacts.find((contact) => contact.relation === intent.relation);
      const contact = byRelation ?? named;
      if (!contact) {
        say(intent.relation === "any" ? copy.callWho : copy.callMissing, text, { to: "/contacts", label: copy.openContacts });
        return;
      }
      setPendingCall(contact);
      say(callConfirm(contact.name), text);
      return;
    }
    say(copy.notSure, text);
  }

  function toggleMic() {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = createRecognition();
    if (!rec) {
      setError(copy.voiceUnsupported);
      return;
    }
    rec.lang = lang === "hi" ? "hi-IN" : "en-IN";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (event) => {
      const heard = event.results[0]?.[0]?.transcript ?? "";
      setDraft(heard);
      run(heard);
    };
    rec.onerror = (event) => {
      const code = event.error;
      if (code === "not-allowed" || code === "service-not-allowed") setError(copy.micBlocked);
      else if (code === "audio-capture") setError(copy.micMissing);
      else if (code === "no-speech") setError(copy.noSpeech);
      else setError(copy.voiceError);
      setListening(false);
    };
    rec.onend = () => setListening(false);
    try {
      rec.start();
      recRef.current = rec;
      setListening(true);
      setError(null);
    } catch {
      setError(copy.voiceError);
      setListening(false);
    }
  }

  return (
    <Screen title={copy.howCanIHelp}>
      <div className="mb-4 grid justify-items-center">
        <ElderArt />
      </div>
      <button
        type="button"
        onClick={toggleMic}
        disabled={!recognitionSupported()}
        aria-pressed={listening}
        className="mx-auto grid size-36 place-items-center rounded-full bg-navy text-white disabled:opacity-50"
      >
        {listening ? <Square aria-hidden="true" size={36} /> : <Mic aria-hidden="true" size={42} />}
        <span className="mt-1 text-[1rem] font-bold">{listening ? t(copy.stop) : t(copy.tapMic)}</span>
      </button>
      <p className="mt-3 text-center text-[1.15rem] font-semibold text-navy" lang={lang}>
        {listening ? t(copy.listening) : t(copy.tapMic)}
      </p>
      {error ? (
        <div className="mt-4" role="alert">
          <Paragraph text={error} />
        </div>
      ) : null}

      <h2 className="mb-3 mt-6">
        <BiBlock text={copy.trySaying} primaryClass="text-[1.25rem] font-bold text-navy" />
      </h2>
      <div className="grid gap-3">
        {[copy.cmdDaughter, copy.cmdMedicine, copy.cmdSend].map((example) => (
          <button
            key={example.en}
            type="button"
            className="min-h-14 rounded-3xl border border-navy/10 bg-white px-4 py-3 text-left"
            onClick={() => {
              setDraft(t(example));
              run(t(example));
            }}
          >
            <BiBlock text={example} primaryClass="text-[1.05rem] font-bold text-navy" />
          </button>
        ))}
      </div>

      <form
        className="mt-5 grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          run(draft);
        }}
      >
        <label htmlFor="voice-text">
          <BiBlock text={copy.typeQuestion} primaryClass="text-[1.05rem] font-bold text-navy" />
        </label>
        <input
          id="voice-text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          autoComplete="off"
        />
        <Button type="submit" label={copy.ask} />
      </form>

      {reply ? (
        <div className="mt-5 grid gap-3" aria-live="polite">
          <CardHeard label={copy.youSaid} value={reply.heard} />
          <div className="rounded-3xl border border-navy/10 bg-care p-4">
            <BiBlock text={copy.response} primaryClass="text-[1rem] font-bold text-navy" />
            <div className="mt-2">
              <Paragraph text={reply.message} />
            </div>
            {reply.speechNote ? (
              <div className="mt-2">
                <Paragraph text={reply.speechNote} />
              </div>
            ) : null}
            <button
              type="button"
              className="mt-3 min-h-12 rounded-2xl border border-navy/15 bg-white px-4 font-bold"
              onClick={() => {
                const result = speak(primaryText(reply.message, lang), lang);
                if (result !== "ok") {
                  setReply({ ...reply, speechNote: result === "missing" ? copy.speechUnavailable : copy.hindiVoiceMissing });
                }
              }}
            >
              {t(copy.readAgain)}
            </button>
          </div>
          {reply.link ? <ButtonLink to={reply.link.to} label={reply.link.label} /> : null}
        </div>
      ) : null}

      <Dialog
        open={Boolean(pendingCall)}
        title={pendingCall ? callConfirm(pendingCall.name) : copy.call}
        confirmLabel={copy.callNow}
        confirmHref={pendingCall ? telHref(pendingCall.phone) : undefined}
        onConfirm={() => {
          if (!pendingCall) return;
          say(callOpening(pendingCall.name), pendingCall.name);
          setPendingCall(null);
        }}
        onClose={() => setPendingCall(null)}
      >
        {pendingCall ? (
          <div className="grid gap-2">
            <p className="text-[1.15rem] font-bold text-navy">{pendingCall.name}</p>
            <p>{t(relationCopy[pendingCall.relation])}</p>
            <Paragraph text={copy.opensPhone} />
          </div>
        ) : null}
      </Dialog>
      <Dialog
        open={pendingSend}
        title={copy.sendConfirmTitle}
        confirmLabel={copy.openSend}
        onConfirm={() => {
          setPendingSend(false);
          navigate("/money/send");
        }}
        onClose={() => setPendingSend(false)}
      >
        <Paragraph text={copy.sendConfirmBody} />
      </Dialog>
    </Screen>
  );
}

function CardHeard({ label, value }: { label: Localized; value: string }) {
  return (
    <div className="rounded-3xl border border-navy/10 bg-white p-4">
      <BiBlock text={label} primaryClass="text-[1rem] font-bold text-navy" />
      <p className="mt-2 text-[1.15rem] font-semibold text-ink">{value}</p>
    </div>
  );
}
