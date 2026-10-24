
"use client";

import { useEffect, useRef, useState } from "react";
import { createPublicSupabaseClient } from "../lib/supabase";

type HCaptchaAPI = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    }
  ) => number;
  reset: (id: number) => void;
};

declare global {
  interface Window {
    hcaptcha?: HCaptchaAPI;
    voixCaptchaReady?: () => void;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

const messages = {
  ar: {
    title: "حوّل النص إلى صوت",
    subtitle: "منصة صوتية موجهة للجزائر",
    text: "النص",
    placeholder: "اكتب النص هنا...",
    voice: "الصوت",
    speed: "السرعة",
    generate: "توليد الصوت",
    waiting: "خدمة توليد الصوت قيد الإعداد.",
    history: "السجل",
    soon: "قريباً",
    guest: "بدء جلسة ضيف",
    connecting: "جارٍ الاتصال...",
    connected: "جلسة الضيف مفعّلة",
    captcha: "أكمل اختبار التحقق أولاً.",
    success: "تم إنشاء جلسة الضيف بنجاح.",
    error: "فشل الاتصال. حاول مجدداً.",
    config: "إعداد hCaptcha غير مكتمل.",
    note: "نسخة اختبارية. Gemini TTS غير مفعّل بعد.",
  },
  fr: {
    title: "Transformez votre texte en voix",
    subtitle: "Plateforme vocale pour l'Algérie",
    text: "Votre texte",
    placeholder: "Saisissez votre texte...",
    voice: "Voix",
    speed: "Vitesse",
    generate: "Générer la voix",
    waiting: "Le moteur TTS est en préparation.",
    history: "Historique",
    soon: "Bientôt disponible",
    guest: "Démarrer une session invitée",
    connecting: "Connexion...",
    connected: "Session invitée active",
    captcha: "Veuillez compléter le CAPTCHA.",
    success: "Session invitée créée avec succès.",
    error: "Connexion impossible. Réessayez.",
    config: "Configuration hCaptcha incomplète.",
    note: "Version de test. Gemini TTS est désactivé.",
  },
};

export default function Home() {
  const [lang, setLang] = useState<"ar" | "fr">("ar");
  const [value, setValue] = useState("");
  const [speed, setSpeed] = useState("normal");
  const [captchaToken, setCaptchaToken] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [showStatus, setShowStatus] = useState(false);

  const captchaContainer = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);

  const t = messages[lang];

  useEffect(() => {
    const supabase = createPublicSupabaseClient();

    void supabase.auth.getSession().then(({ data }) => {
      setSignedIn(Boolean(data.session));
    });

    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setSignedIn(Boolean(session));
      });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!SITE_KEY) return;

    let active = true;

    const renderCaptcha = () => {
      if (
        !active ||
        !captchaContainer.current ||
        !window.hcaptcha ||
        widgetId.current !== null
      ) {
        return;
      }

      widgetId.current = window.hcaptcha.render(
        captchaContainer.current,
        {
          sitekey: SITE_KEY,
          callback: (token: string) => {
            if (active) setCaptchaToken(token);
          },
          "expired-callback": () => {
            if (active) setCaptchaToken("");
          },
          "error-callback": () => {
            if (active) {
              setCaptchaToken("");
              setStatus(messages.fr.error);
            }
          },
        }
      );
    };

    window.voixCaptchaReady = renderCaptcha;

    if (window.hcaptcha) {
      renderCaptcha();
    } else if (!document.getElementById("voix-hcaptcha-script")) {
      const script = document.createElement("script");
      script.id = "voix-hcaptcha-script";
      script.src =
        "https://js.hcaptcha.com/1/api.js" +
        "?onload=voixCaptchaReady&render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    return () => {
      active = false;
      if (window.voixCaptchaReady === renderCaptcha) {
        delete window.voixCaptchaReady;
      }
    };
  }, []);

  const startGuestSession = async () => {
    if (signedIn || loading) return;

    if (!SITE_KEY) {
      setStatus(t.config);
      return;
    }

    if (!captchaToken) {
      setStatus(t.captcha);
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const supabase = createPublicSupabaseClient();

      const { data, error } =
        await supabase.auth.signInAnonymously({
          options: {
            captchaToken,
          },
        });

      if (error || !data.session) {
        setStatus(t.error);
      } else {
        setSignedIn(true);
        setStatus(t.success);
      }
    } catch {
      setStatus(t.error);
    } finally {
      setLoading(false);
      setCaptchaToken("");

      if (widgetId.current !== null) {
        window.hcaptcha?.reset(widgetId.current);
      }
    }
  };

  return (
    <main dir={lang === "ar" ? "rtl" : "ltr"}>
      <header>
        <strong>VOIX DZ</strong>
        <nav>
          <button
            onClick={() =>
              setLang(lang === "ar" ? "fr" : "ar")
            }
          >
            {lang === "ar" ? "Français" : "العربية"}
          </button>
          <span>
            {signedIn ? t.connected : t.guest}
          </span>
        </nav>
      </header>

      <section className="hero">
        <p className="eyebrow">
          TEXT TO SPEECH · ALGERIA
        </p>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="panel">
        {!signedIn && (
          <div>
            <h3>{t.guest}</h3>

            {SITE_KEY ? (
              <div
                ref={captchaContainer}
                dir="ltr"
                style={{ margin: "16px 0" }}
              />
            ) : (
              <p>{t.config}</p>
            )}

            <button
              className="primary"
              disabled={
                loading ||
                !captchaToken ||
                !SITE_KEY
              }
              onClick={startGuestSession}
            >
              {loading ? t.connecting : t.guest}
            </button>
          </div>
        )}

        {signedIn && (
          <p role="status">✓ {t.connected}</p>
        )}

        {status && (
          <p role="status" className="status">
            {status}
          </p>
        )}

        <label htmlFor="tts">{t.text}</label>

        <textarea
          id="tts"
          value={value}
          maxLength={2000}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t.placeholder}
        />

        <div className="counter">
          {value.trim()
            ? value.trim().split(/\s+/u).length
            : 0}{" "}
          {lang === "ar" ? "كلمة" : "mots"}
          {" · "}
          {value.length}/2000
        </div>

        <div className="fields">
          <div>
            <label htmlFor="voice">{t.voice}</label>
            <select id="voice" disabled>
              <option>Standard (à valider)</option>
            </select>
          </div>

          <div>
            <label htmlFor="speed">{t.speed}</label>
            <select
              id="speed"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
            >
              <option value="slow">0.85×</option>
              <option value="normal">1×</option>
              <option value="fast">1.15×</option>
            </select>
          </div>
        </div>

        <button
          className="primary"
          disabled={!value.trim()}
          onClick={() => setShowStatus(true)}
        >
          {t.generate}
        </button>

        {showStatus && (
          <p role="status" className="status">
            {t.waiting}
          </p>
        )}
      </section>

      <section className="features">
        <article>
          <h3>{t.history}</h3>
          <p>{t.soon}</p>
        </article>

        <article>
          <h3>
            {lang === "ar"
              ? "إنشاء صوت خاص"
              : "Voix personnelle"}
          </h3>
          <p>{t.soon}</p>
        </article>
      </section>

      <footer>{t.note}</footer>
    </main>
  );
}
