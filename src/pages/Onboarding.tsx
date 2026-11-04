import { HeartPulse, Phone, Pill, Wallet } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wordmark } from "../components/Illustrations.tsx";
import { BiBlock, Button } from "../components/ui.tsx";
import { copy } from "../i18n/copy.ts";
import { useText } from "../i18n/useText.ts";
import { useApp } from "../state/AppState.tsx";
import type { Lang } from "../types.ts";

const features = [
  { icon: Pill, title: copy.featureMed, body: copy.featureMedBody, tone: "bg-care" },
  { icon: Wallet, title: copy.featureMoney, body: copy.featureMoneyBody, tone: "bg-money" },
  { icon: HeartPulse, title: copy.featureDay, body: copy.featureDayBody, tone: "bg-amber" },
  { icon: Phone, title: copy.featureHelp, body: copy.featureHelpBody, tone: "bg-blush" },
];

export function Onboarding() {
  const { data, setLanguage, completeOnboarding } = useApp();
  const { t, s, lang, other } = useText();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  function finish() {
    completeOnboarding();
    navigate("/home");
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-cream px-5 py-8">
      <Wordmark large />
      <h1 className="mt-6 text-[1.8rem] font-bold leading-tight text-navy" lang={lang}>
        {step === 0 ? t(copy.chooseLanguage) : t(copy.welcome)}
      </h1>
      <p className="mt-1 text-[1.08rem] text-muted" lang={other}>
        {step === 0 ? s(copy.chooseLanguage) : s(copy.welcome)}
      </p>
      <p className="mt-4 text-[1.15rem] font-semibold leading-snug text-navy" lang={lang}>
        {t(copy.tagline)}
      </p>

      {step === 0 ? (
        <div className="mt-6 grid gap-3">
          {(["en", "hi"] as Lang[]).map((language) => {
            const selected = data.settings.language === language;
            return (
              <button
                key={language}
                type="button"
                aria-pressed={selected}
                onClick={() => setLanguage(language)}
                className={`min-h-20 rounded-3xl border px-4 text-left ${selected ? "border-navy bg-white ring-2 ring-navy" : "border-navy/10 bg-white"}`}
              >
                <span className="block text-[1.35rem] font-bold text-navy">{language === "en" ? "English" : "हिन्दी"}</span>
                <span className="block text-[1.05rem] text-muted">{language === "en" ? "अंग्रेज़ी" : "Hindi"}</span>
                {selected ? (
                  <span className="mt-1 block font-bold text-navy">
                    {t(copy.selected)}
                  </span>
                ) : null}
              </button>
            );
          })}
          <Button label={copy.continue} onClick={() => setStep(1)} />
        </div>
      ) : (
        <div className="mt-6 grid gap-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title.en} className={`flex items-center gap-4 rounded-3xl border border-navy/10 p-4 ${feature.tone}`}>
                <span className="grid size-14 place-items-center rounded-2xl bg-white/80 text-navy">
                  <Icon aria-hidden="true" />
                </span>
                <span>
                  <BiBlock text={feature.title} primaryClass="text-[1.2rem] font-bold text-navy" />
                </span>
              </div>
            );
          })}
          <Button label={copy.start} onClick={finish} />
          {data.onboarded ? <Button label={copy.goHome} variant="secondary" onClick={() => navigate("/home")} /> : null}
        </div>
      )}
    </main>
  );
}
