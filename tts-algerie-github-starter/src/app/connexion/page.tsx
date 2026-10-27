"use client";

import Link from "next/link";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { GuestAccess } from "@/components/guest-access";
import { useLocale } from "@/components/locale-provider";
import { getBrowserClient, isSupabaseConfigured } from "@/lib/supabase-browser";

export default function ConnexionPage() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    const supabase = getBrowserClient();
    if (!supabase) {
      setError(
        t(
          "Configuration Supabase absente sur ce serveur. Contactez l'administrateur.",
          "إعداد Supabase غير موجود على هذا الخادم. اتصل بالمسؤول."
        )
      );
      return;
    }

    setLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(
        t(
          "Connexion impossible. Vérifiez l'adresse e-mail et le mot de passe.",
          "تعذّر تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور."
        )
      );
      setLoading(false);
      return;
    }

    window.location.assign("/app");
  }

  return (
    <PageShell>
      <div className="vz-auth">
        <div className="vz-auth__card">
          <h1 className="vz-h2" style={{ fontSize: 28 }}>
            {t("Se connecter", "تسجيل الدخول")}
          </h1>
          <p className="vz-muted" style={{ marginTop: 6, marginBottom: 24 }}>
            {t(
              "Retrouvez votre historique et vos essais.",
              "استعد سجلك ومحاولاتك."
            )}
          </p>

          {!isSupabaseConfigured() ? (
            <div className="vz-alert">
              {t(
                "Supabase n'est pas configuré : la connexion est indisponible sur cet environnement.",
                "Supabase غير مهيأ: تسجيل الدخول غير متاح في هذه البيئة."
              )}
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <div className="vz-field">
                <label className="vz-label" htmlFor="email">
                  {t("Adresse e-mail", "البريد الإلكتروني")}
                </label>
                <input
                  id="email"
                  type="email"
                  className="vz-input"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div className="vz-field">
                <label className="vz-label" htmlFor="password">
                  {t("Mot de passe", "كلمة المرور")}
                </label>
                <input
                  id="password"
                  type="password"
                  className="vz-input"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              {error ? (
                <p className="vz-alert" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                className="vz-btn vz-btn--primary vz-btn--block"
                style={{ marginTop: 8 }}
                disabled={loading}
              >
                {loading
                  ? t("Connexion…", "جارٍ الدخول…")
                  : t("Se connecter", "تسجيل الدخول")}
              </button>
            </form>
          )}

          <GuestAccess />

          <div className="vz-auth__switch">
            <Link href="/mot-de-passe-oublie">
              {t("Mot de passe oublié ?", "هل نسيت كلمة المرور؟")}
            </Link>
          </div>

          <div className="vz-auth__switch">
            {t("Pas encore de compte ?", "ليس لديك حساب؟")}{" "}
            <Link href="/inscription">{t("Créer un compte", "إنشاء حساب")}</Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
