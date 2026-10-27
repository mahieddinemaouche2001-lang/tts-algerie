"use client";

import Link from "next/link";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { useLocale } from "@/components/locale-provider";
import { getBrowserClient, isSupabaseConfigured } from "@/lib/supabase-browser";

export default function MotDePasseOubliePage() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    const supabase = getBrowserClient();
    if (!supabase) {
      setMessage(
        t(
          "Configuration Supabase absente. Contactez l'administrateur.",
          "إعداد Supabase غير موجود. اتصل بالمسؤول."
        )
      );
      return;
    }

    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/connexion`,
    });
    setLoading(false);

    // Same message whether the address exists or not: no account enumeration.
    setMessage(
      t(
        "Si cette adresse correspond à un compte, un e-mail de réinitialisation vient d'être envoyé.",
        "إذا كان هذا البريد مرتبطاً بحساب، فقد أُرسل بريد إعادة التعيين للتو."
      )
    );
  }

  return (
    <PageShell>
      <div className="vz-auth">
        <div className="vz-auth__card">
          <h1 className="vz-h2" style={{ fontSize: 28 }}>
            {t("Mot de passe oublié", "نسيت كلمة المرور")}
          </h1>
          <p className="vz-muted" style={{ marginTop: 6, marginBottom: 24 }}>
            {t(
              "Saisissez votre adresse : nous vous enverrons un lien de réinitialisation.",
              "أدخل بريدك: سنرسل لك رابط إعادة التعيين."
            )}
          </p>

          {!isSupabaseConfigured() ? (
            <div className="vz-alert">
              {t("Supabase n'est pas configuré sur cet environnement.", "Supabase غير مهيأ في هذه البيئة.")}
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

              <button
                type="submit"
                className="vz-btn vz-btn--primary vz-btn--block"
                disabled={loading}
              >
                {loading
                  ? t("Envoi…", "جارٍ الإرسال…")
                  : t("Envoyer le lien", "إرسال الرابط")}
              </button>
            </form>
          )}

          {message ? (
            <p className="vz-alert vz-alert--info" role="status" style={{ marginTop: 16 }}>
              {message}
            </p>
          ) : null}

          <div className="vz-auth__switch">
            <Link href="/connexion">{t("Retour à la connexion", "العودة لتسجيل الدخول")}</Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
