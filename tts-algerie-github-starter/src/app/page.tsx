
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
    generating: "جارٍ التحقق...",
    waiting: "خدمة توليد الصوت قيد الإعداد. لم يتم استهلاك أي محاولة مجانية.",
    history: "السجل",
    soon: "قريباً",
    guest: "بدء جلسة ضيف",
    connecting: "جارٍ الاتصال...",
    connected: "جلسة الضيف مفعّلة",
    captcha: "أكمل اختبار التحقق أولاً.",
    success: "تم إنشاء جلسة الضيف بنجاح.",
    error: "فشل الاتصال. حاول مجدداً.",
    config: "إعداد hCaptcha غير مكتمل.",
    login: "يجب إنشاء جلسة ضيف أولاً.",
    limit: "لقد استنفدت المحاولتين المجانيتين أو توجد محاولات محجوزة.",
    rate: "طلبات كثيرة. يرجى الانتظار دقيقة ثم المحاولة مجدداً.",
    invalid: "الرجاء إدخال نص صحيح لا يتجاوز 2000 حرف.",
    apiError: "تعذّر التحقق من الطلب. حاول مجدداً.",
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
    generating: "Vérification...",
    waiting: "Le moteur TTS est en préparation. Aucun essai gratuit consommé.",
    history: "Historique",
    soon: "Bientôt disponible",
    guest: "Démarrer une session invitée",
    connecting: "Connexion...",
    connected: "Session invitée active",
    captcha: "Veuillez compléter le CAPTCHA.",
    success: "Session invitée créée avec succès.",
    error: "Connexion impossible. Réessayez.",
    config: "Configuration hCaptcha incomplète.",
    login: "Veuillez démarrer une session invitée.",
    limit: "Vos deux essais gratuits sont épuisés ou des essais sont réservés.",
    rate: "Trop de requêtes. Réessayez dans une minute.",
    invalid: "Saisissez un texte valide de 2000 caractères maximum.",
    apiError: "Impossible de vérifier la demande. Réessayez.",
    note: "Version de test. Gemini TTS est désactivé.",
  },
};

type ApiResponse = {
  error?: string;
  trial_consumed?: boolean;
  audioBase64?: string;
  mimeType?: string;
};

export default function Home() {
  const [lang, setLang] = useState<"ar" | "fr">("ar");
  const [value, setValue] = useState("");
  const [speed, setSpeed] = useState("normal");

  const [captchaToken, setCaptchaToken] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [ttsStatus, setTtsStatus] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const captchaContainer = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  const t = messages[lang];

  // Vérifier la session Supabase existante.
  useEffect(() => {
    const supabase = createPublicSupabaseClient();
    let active = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSignedIn(Boolean(data.session));
      }
    });

    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, session) => {
        if (active) {
          setSignedIn(Boolean(session));
        }
      });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Charger hCaptcha.
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

  // Créer une session invitée avec hCaptcha.
  const startGuestSession = async () => {
    if (signedIn || authLoading) return;

    if (!SITE_KEY) {
      setStatus(t.config);
      return;
    }

    if (!captchaToken) {
      setStatus(t.captcha);
      return;
    }

    setAuthLoading(true);
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
      setAuthLoading(false);
      setCaptchaToken("");

      if (widgetId.current !== null) {
        window.hcaptcha?.reset(widgetId.current);
      }
    }
  };

  // Envoyer une requête authentifiée à notre API.
  const generateVoice = async () => {
    if (ttsLoading) return;

    const text = value.trim();

    if (!text || text.length > 2000) {
      setTtsStatus(t.invalid);
      return;
    }

    setTtsLoading(true);
    setTtsStatus("");
    setAudioUrl(null);

    try {
      const supabase = createPublicSupabaseClient();

      const { data, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !data.session) {
        setSignedIn(false);
        setTtsStatus(t.login);
        return;
      }

      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify({ text }),
        cache: "no-store",
      });

      const result: ApiResponse = await response
        .json()
        .catch(() => ({ error: "INVALID_RESPONSE" }));

      if (
        response.status === 503 &&
        result.error === "TTS_NOT_READY"
      ) {
        setTtsStatus(t.waiting);
        return;
      }

      if (
        response.status === 429 ||
        result.error === "RATE_LIMIT_EXCEEDED"
      ) {
        setTtsStatus(t.rate);
        return;
      }

      if (
        response.status === 403 &&
        result.error === "FREE_TRIAL_LIMIT_REACHED"
      ) {
        setTtsStatus(t.limit);
        return;
      }

      if (response.status === 401) {
        setTtsStatus(t.login);
        return;
      }

      if (
        response.status === 400 ||
        response.status === 413
      ) {
        setTtsStatus(t.invalid);
        return;
      }

      if (response.ok && typeof result.audioBase64 === "string" && result.mimeType === "audio/wav") {
        const binary = atob(result.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const url = URL.createObjectURL(new Blob([bytes], { type: "audio/wav" }));
        setAudioUrl(url);
        setTtsStatus(lang === "ar" ? "تم إنشاء الصوت بنجاح. استُهلكت محاولة واحدة." : "Audio généré. Un essai gratuit consommé.");
        return;
      }
      if (result.error === "GLOBAL_DAILY_LIMIT") {
        setTtsStatus(lang === "ar" ? "تم بلوغ الحد اليومي للتجارب." : "Plafond global quotidien atteint.");
        return;
      }
      setTtsStatus(t.apiError);
    } catch {
      setTtsStatus(t.apiError);
    } finally {
      setTtsLoading(false);
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
                authLoading ||
                !captchaToken ||
                !SITE_KEY
              }
              onClick={startGuestSession}
            >
              {authLoading ? t.connecting : t.guest}
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
          disabled={!value.trim() || ttsLoading}
          onClick={generateVoice}
        >
          {ttsLoading ? t.generating : t.generate}
        </button>

        {audioUrl && (
          <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
            <audio controls src={audioUrl} style={{ width: "100%" }} />
            <a href={audioUrl} download="voix-dz.wav">{lang === "ar" ? "تحميل الصوت WAV" : "Télécharger le WAV"}</a>
          </div>
        )}

        {ttsStatus && (
          <p role="status" className="status">
            {ttsStatus}
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
