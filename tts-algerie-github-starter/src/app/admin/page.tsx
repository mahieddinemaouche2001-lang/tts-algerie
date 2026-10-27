"use client";

import { useEffect, useState } from "react";
import { AdminShell, saveAdminToken } from "@/components/admin-shell";
import { useLocale } from "@/components/locale-provider";
import { getBrowserClient } from "@/lib/supabase-browser";

type Stats = {
  profiles: number;
  generations: number;
  trialsUsed: number;
  activeReservations: number;
  geminiEnabled: boolean;
};

const TOKEN_KEY = "vdz_admin_token";

export default function AdminPage() {
  const { t } = useLocale();
  const [phase, setPhase] = useState<"checking" | "login" | "ready">("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

  async function loadStats(accessToken: string) {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });
      if (response.ok) {
        setStats((await response.json()) as Stats);
        setMessage("");
        setPhase("ready");
      } else if (response.status === 403) {
        setMessage(t("Ce compte n'est pas administrateur.", "هذا الحساب ليس مسؤولاً."));
        sessionStorage.removeItem(TOKEN_KEY);
        setPhase("login");
      } else if (response.status === 401) {
        sessionStorage.removeItem(TOKEN_KEY);
        setPhase("login");
      } else if (response.status === 503) {
        setMessage(
          t(
            "Configuration admin incomplète (ADMIN_USER_ID ou base de données).",
            "إعداد الإدارة غير مكتمل (ADMIN_USER_ID أو قاعدة البيانات)."
          )
        );
        setPhase("login");
      } else {
        setMessage(t("Accès refusé.", "تم رفض الوصول."));
        setPhase("login");
      }
    } catch {
      setMessage(t("Connexion au serveur impossible.", "تعذّر الاتصال بالخادم."));
      setPhase("login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const stored = sessionStorage.getItem(TOKEN_KEY);
    if (stored) {
      setToken(stored);
      void loadStats(stored);
      return;
    }

    const supabase = getBrowserClient();
    if (!supabase) {
      setPhase("login");
      return;
    }

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session?.access_token) {
        void loadStats(data.session.access_token);
      } else {
        setPhase("login");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // hCaptcha, only while the login form is visible.
  useEffect(() => {
    if (phase !== "login" || !siteKey) return;

    let widget: number | null = null;

    const render = () => {
      const host = document.getElementById("admin-captcha");
      const captcha = (
        window as unknown as {
          hcaptcha?: {
            render: (el: HTMLElement, options: Record<string, unknown>) => number;
            remove: (id: number) => void;
          };
        }
      ).hcaptcha;
      if (host && captcha && widget === null) {
        widget = captcha.render(host, {
          sitekey: siteKey,
          callback: (value: string) => setCaptchaToken(value),
          "expired-callback": () => setCaptchaToken(""),
        });
      }
    };

    const existing = document.getElementById("admin-hcaptcha-script");
    if ((window as unknown as { hcaptcha?: unknown }).hcaptcha) {
      render();
    } else if (existing) {
      existing.addEventListener("load", render);
    } else {
      const script = document.createElement("script");
      script.id = "admin-hcaptcha-script";
      script.src = "https://js.hcaptcha.com/1/api.js?render=explicit";
      script.async = true;
      script.addEventListener("load", render);
      document.head.appendChild(script);
    }

    return () => {
      if (widget !== null) {
        (
          window as unknown as { hcaptcha?: { remove: (id: number) => void } }
        ).hcaptcha?.remove(widget);
      }
    };
  }, [phase, siteKey]);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    const supabase = getBrowserClient();
    if (!supabase) {
      setMessage(t("Supabase n'est pas configuré.", "Supabase غير مهيأ."));
      return;
    }

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
      options: captchaToken ? { captchaToken } : undefined,
    });

    if (error || !data.session) {
      setMessage(
        t(
          "Connexion refusée. Vérifiez l'e-mail, le mot de passe et le CAPTCHA.",
          "تم رفض تسجيل الدخول. تحقق من البريد وكلمة المرور و CAPTCHA."
        )
      );
      setLoading(false);
      return;
    }

    saveAdminToken(data.session.access_token);
    setToken(data.session.access_token);
    await loadStats(data.session.access_token);
  }

  if (phase === "ready") {
    return (
      <AdminShell
        title={t("Vue d'ensemble", "نظرة عامة")}
        subtitle={t(
          "Chiffres lus en base, aucune donnée simulée.",
          "أرقام مقروءة من قاعدة البيانات، دون بيانات محاكاة."
        )}
      >
        {loading ? <p className="vz-muted">{t("Chargement…", "جارٍ التحميل…")}</p> : null}

        {stats ? (
          <>
            <div className="vz-grid vz-grid--3" style={{ marginBottom: 20 }}>
              <div className="vz-kpi">
                <strong>{stats.profiles}</strong>
                <span>{t("Profils", "الملفات")}</span>
              </div>
              <div className="vz-kpi">
                <strong>{stats.generations}</strong>
                <span>{t("Générations", "عمليات التوليد")}</span>
              </div>
              <div className="vz-kpi">
                <strong>{stats.trialsUsed}</strong>
                <span>{t("Essais consommés", "المحاولات المستهلكة")}</span>
              </div>
              <div className="vz-kpi">
                <strong>{stats.activeReservations}</strong>
                <span>{t("Réservations actives", "الحجوزات النشطة")}</span>
              </div>
              <div className="vz-kpi">
                <strong style={{ fontSize: 18 }}>
                  {stats.geminiEnabled ? t("Actif", "مفعّل") : t("Désactivé", "معطّل")}
                </strong>
                <span>{t("Moteur Gemini TTS", "محرك Gemini TTS")}</span>
              </div>
            </div>

            <div className="vz-alert vz-alert--info">
              {t(
                "Aucune clé secrète n'est affichée dans cette interface. Les valeurs d'environnement ne sortent jamais du serveur.",
                "لا يُعرض أي مفتاح سري في هذه الواجهة. قيم البيئة لا تغادر الخادم أبداً."
              )}
            </div>
          </>
        ) : null}

        {message ? (
          <p className="vz-alert" role="alert" style={{ marginTop: 16 }}>
            {message}
          </p>
        ) : null}
      </AdminShell>
    );
  }

  return (
    <div className="vz-shell">
      <div className="vz-auth">
        <div className="vz-auth__card">
          <span className="vz-badge">{t("Administration", "الإدارة")}</span>
          <h1 className="vz-h2" style={{ fontSize: 26, marginTop: 12 }}>
            {t("Connexion administrateur", "دخول المسؤول")}
          </h1>
          <p className="vz-muted" style={{ marginTop: 6, marginBottom: 20 }}>
            {t(
              "Accès réservé. La vérification du rôle est faite par le serveur.",
              "وصول محصور. يتحقق الخادم من الدور."
            )}
          </p>

          <form onSubmit={login}>
            <div className="vz-field">
              <label className="vz-label" htmlFor="admin-email">
                {t("Adresse e-mail", "البريد الإلكتروني")}
              </label>
              <input
                id="admin-email"
                type="email"
                className="vz-input"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="vz-field">
              <label className="vz-label" htmlFor="admin-password">
                {t("Mot de passe", "كلمة المرور")}
              </label>
              <input
                id="admin-password"
                type="password"
                className="vz-input"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            {siteKey ? <div id="admin-captcha" style={{ minHeight: 80, marginBottom: 12 }} /> : null}

            <button type="submit" className="vz-btn vz-btn--primary vz-btn--block" disabled={loading}>
              {loading ? t("Connexion…", "جارٍ الدخول…") : t("Se connecter", "تسجيل الدخول")}
            </button>
          </form>

          {message ? (
            <p className="vz-alert" role="alert" style={{ marginTop: 16 }}>
              {message}
            </p>
          ) : null}

          {phase === "checking" ? (
            <p className="vz-help" style={{ marginTop: 12 }}>
              {t("Vérification de la session…", "جارٍ التحقق من الجلسة…")}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
