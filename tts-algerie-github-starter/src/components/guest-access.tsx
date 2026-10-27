"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "./locale-provider";
import { getBrowserClient } from "@/lib/supabase-browser";

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

export function GuestAccess({ onDone }: { onDone?: () => void }) {
  const { t } = useLocale();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);

  useEffect(() => {
    if (!SITE_KEY) return;
    let active = true;

    const render = () => {
      if (!active || !container.current || !window.hcaptcha || widgetId.current !== null) {
        return;
      }
      widgetId.current = window.hcaptcha.render(container.current, {
        sitekey: SITE_KEY,
        callback: (value: string) => active && setToken(value),
        "expired-callback": () => active && setToken(""),
        "error-callback": () => {
          if (active) {
            setToken("");
            setMessage(t("Vérification impossible. Réessayez.", "تعذّر التحقق. أعد المحاولة."));
          }
        },
      });
    };

    window.voixCaptchaReady = render;

    if (window.hcaptcha) {
      render();
    } else if (!document.getElementById("voix-hcaptcha-script")) {
      const script = document.createElement("script");
      script.id = "voix-hcaptcha-script";
      script.src = "https://js.hcaptcha.com/1/api.js?onload=voixCaptchaReady&render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    return () => {
      active = false;
      if (window.voixCaptchaReady === render) delete window.voixCaptchaReady;
    };
  }, [t]);

  async function start() {
    if (loading) return;

    const supabase = getBrowserClient();
    if (!supabase) {
      setMessage(
        t("Configuration Supabase absente.", "إعداد Supabase غير موجود.")
      );
      return;
    }

    if (SITE_KEY && !token) {
      setMessage(
        t("Complétez la vérification anti-robot.", "أكمل التحقق من الروبوت.")
      );
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInAnonymously(
      SITE_KEY ? { options: { captchaToken: token } } : undefined
    );

    setLoading(false);
    setToken("");
    if (widgetId.current !== null) window.hcaptcha?.reset(widgetId.current);

    if (error) {
      setMessage(
        t(
          "Session invitée impossible. Créez un compte ou réessayez plus tard.",
          "تعذّر إنشاء جلسة زائر. أنشئ حساباً أو أعد المحاولة لاحقاً."
        )
      );
      return;
    }

    onDone ? onDone() : window.location.assign("/app");
  }

  return (
    <div
      style={{
        marginTop: 24,
        paddingTop: 20,
        borderTop: "1px solid var(--vz-border)",
      }}
    >
      <h2 className="vz-h3" style={{ fontSize: 16 }}>
        {t("Ou essayer sans compte", "أو جرّب بدون حساب")}
      </h2>
      <p className="vz-help" style={{ marginBottom: 12 }}>
        {t(
          "Session invitée protégée par hCaptcha. L'historique n'est pas garanti.",
          "جلسة زائر محمية بـ hCaptcha. السجل غير مضمون."
        )}
      </p>

      {SITE_KEY ? (
        <div ref={container} dir="ltr" style={{ marginBottom: 12 }} />
      ) : (
        <p className="vz-help">
          {t(
            "hCaptcha n'est pas configuré sur cet environnement.",
            "hCaptcha غير مهيأ في هذه البيئة."
          )}
        </p>
      )}

      <button
        type="button"
        className="vz-btn vz-btn--ghost vz-btn--block"
        onClick={start}
        disabled={loading || (Boolean(SITE_KEY) && !token)}
      >
        {loading
          ? t("Connexion…", "جارٍ الاتصال…")
          : t("Démarrer une session invitée", "ابدأ جلسة زائر")}
      </button>

      {message ? (
        <p className="vz-alert" role="alert" style={{ marginTop: 12 }}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
