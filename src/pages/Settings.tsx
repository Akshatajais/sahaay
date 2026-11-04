import { Link } from "react-router-dom";
import { useState } from "react";
import { Button, Card, Dialog, FieldLabel, Paragraph, Screen, SwitchRow } from "../components/ui.tsx";
import { copy } from "../i18n/copy.ts";
import { useText } from "../i18n/useText.ts";
import { useApp } from "../state/AppState.tsx";
import type { Lang, TextSize } from "../types.ts";

const sizes: Array<{ id: TextSize; label: typeof copy.textDefault; px: number }> = [
  { id: "default", label: copy.textDefault, px: 18 },
  { id: "large", label: copy.textLarge, px: 20 },
  { id: "larger", label: copy.textLarger, px: 22 },
];

export function SettingsPage() {
  const { data, setLanguage, setTextSize, updateSettings, updateProfile, resetDemo } = useApp();
  const { t } = useText();
  const [clearOpen, setClearOpen] = useState(false);

  return (
    <Screen title={copy.settings} backTo="/home">
      <Card>
        <FieldLabel text={copy.nameEn} htmlFor="name-en" />
        <input
          id="name-en"
          value={data.profile.nameEn}
          maxLength={24}
          onChange={(event) => updateProfile({ nameEn: event.target.value })}
        />
        <div className="mt-4">
          <FieldLabel text={copy.nameHi} htmlFor="name-hi" />
          <input
            id="name-hi"
            value={data.profile.nameHi}
            maxLength={24}
            lang="hi"
            onChange={(event) => updateProfile({ nameHi: event.target.value })}
          />
        </div>
      </Card>

      <h2 className="mb-3 mt-6 text-[1.3rem] font-bold text-navy">{t(copy.language)}</h2>
      <div className="grid grid-cols-2 gap-3">
        {(["en", "hi"] as Lang[]).map((language) => {
          const selected = data.settings.language === language;
          return (
            <button
              key={language}
              type="button"
              aria-pressed={selected}
              onClick={() => setLanguage(language)}
              className={`min-h-20 rounded-3xl border px-3 ${selected ? "border-navy bg-white ring-2 ring-navy" : "border-navy/10 bg-white"}`}
            >
              <span className="block text-[1.2rem] font-bold text-navy">{language === "en" ? "English" : "हिन्दी"}</span>
              <span className="block text-[1rem] text-muted">{language === "en" ? "अंग्रेज़ी" : "Hindi"}</span>
              {selected ? <span className="mt-1 block text-[0.95rem] font-bold">{t(copy.selected)}</span> : null}
            </button>
          );
        })}
      </div>

      <h2 className="mb-3 mt-6 text-[1.3rem] font-bold text-navy">{t(copy.textSize)}</h2>
      <div className="grid gap-3">
        {sizes.map((size) => {
          const selected = data.settings.textSize === size.id;
          return (
            <button
              key={size.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setTextSize(size.id)}
              className={`flex min-h-16 items-center justify-between rounded-3xl border bg-white px-4 ${selected ? "border-navy ring-2 ring-navy" : "border-navy/10"}`}
            >
              <span className="text-[1.15rem] font-bold text-navy">{t(size.label)}</span>
              <span className="font-bold text-navy" style={{ fontSize: size.px }}>
                Aa
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-3xl border border-navy/10 bg-white px-4">
        <SwitchRow checked={data.settings.sound} onChange={(sound) => updateSettings({ sound })} label={copy.sound} />
        <SwitchRow checked={data.settings.vibration} onChange={(vibration) => updateSettings({ vibration })} label={copy.vibration} />
        <SwitchRow checked={data.settings.voiceGuidance} onChange={(voiceGuidance) => updateSettings({ voiceGuidance })} label={copy.voiceGuidance} />
        <SwitchRow checked={data.settings.quietHours} onChange={(quietHours) => updateSettings({ quietHours })} label={copy.quietHours} />
        <SwitchRow checked={data.settings.sharePayments} onChange={(sharePayments) => updateSettings({ sharePayments })} label={copy.sharePayments} />
      </div>

      {data.settings.quietHours ? (
        <Card className="mt-4">
          <div className="grid gap-4">
            <div>
              <FieldLabel text={copy.quietStart} htmlFor="quiet-start" />
              <input
                id="quiet-start"
                type="time"
                value={data.settings.quietStart}
                onChange={(event) => updateSettings({ quietStart: event.target.value })}
              />
            </div>
            <div>
              <FieldLabel text={copy.quietEnd} htmlFor="quiet-end" />
              <input
                id="quiet-end"
                type="time"
                value={data.settings.quietEnd}
                onChange={(event) => updateSettings({ quietEnd: event.target.value })}
              />
            </div>
          </div>
        </Card>
      ) : null}

      <div className="mt-6 grid gap-3">
        <Link to="/medicines" className="rounded-3xl border border-navy/10 bg-white p-4">
          <span className="block text-[1.1rem] font-bold text-navy">{t(copy.medicineTimes)}</span>
        </Link>
        <Link to="/day" className="rounded-3xl border border-navy/10 bg-white p-4">
          <span className="block text-[1.1rem] font-bold text-navy">{t(copy.habitTimes)}</span>
        </Link>
        <Link to="/contacts" className="rounded-3xl border border-navy/10 bg-white p-4">
          <span className="block text-[1.1rem] font-bold text-navy">{t(copy.familyPrefs)}</span>
        </Link>
        <Link to="/notifications" className="rounded-3xl border border-navy/10 bg-white p-4">
          <span className="block text-[1.1rem] font-bold text-navy">{t(copy.notifications)}</span>
        </Link>
      </div>

      <Card className="mt-6">
        <h2 className="text-[1.3rem] font-bold text-navy">{t(copy.privacy)}</h2>
        <div className="mt-2">
          <Paragraph text={copy.privacyBody} bilingual />
        </div>
        <div className="mt-4">
          <Button label={copy.clearData} variant="danger" onClick={() => setClearOpen(true)} />
        </div>
      </Card>

      <Dialog
        open={clearOpen}
        title={copy.clearTitle}
        confirmLabel={copy.clearData}
        tone="danger"
        initialFocus="cancel"
        onConfirm={() => {
          resetDemo();
          setClearOpen(false);
        }}
        onClose={() => setClearOpen(false)}
      >
        <Paragraph text={copy.clearConfirm} />
      </Dialog>
    </Screen>
  );
}
