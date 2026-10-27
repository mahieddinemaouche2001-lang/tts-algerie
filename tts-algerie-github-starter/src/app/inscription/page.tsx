"use client";

import Link from "next/link";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { useLocale } from "@/components/locale-provider";
import { getBrowserClient, isSupabaseConfigured } from "@/lib/supabase-browser";

export default function InscriptionPage() {
  const { t } = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    if (password.length < 8) {
      setError(
        t(
          "Le mot de passe doit contenir au moins 8 caractères.",
          "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل."
        )
      );
      return;
    }

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

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { display_name: name.trim() || null },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(
        t(
          "Création impossible. L'adresse est peut-être déjà utilisée, ou le service refuse temporairement les inscriptions.",
          "تعذّر الإنشاء. ربما البريد مستخدم بالفعل، أو الخدمة ترفض التسجيلات مؤقتاً."
        )
      );
      return;
    }

    if (data.session) {
      window.location.assign("/app");
      return;
    }

    setDone(
      t(
        "Compte créé. Vérifiez votre boîte e-mail pour confirmer l'adresse, puis connectez-vous.",
        "تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيد العنوان، ثم سجّل الدخول."
      )
    );
  }

  return (
    <PageShell>
      <div className="vz-auth">
        <div className="vz-auth__card">
          <h1 className="vz-h2" style={{ fontSize: 28 }}>
            {t("Créer un compte", "إنشاء حساب")}
          </h1>
          <p className="vz-muted" style={{ marginTop: 6, marginBottom: 24 }}>
            {t(
              "Deux essais gratuits, sans carte bancaire.",
              "محاولتان مجانيتان، دون بطاقة بنكية."
            )}
          </p>

          {!isSupabaseConfigured() ? (
            <div className="vz-alert">
              {t(
                "Supabase n'est pas configuré : l'inscription est indisponible sur cet environnement.",
                "Supabase غير مهيأ: التسجيل غير متاح في هذه البيئة."
              )}
            </div>
          ) : done ? (
            <div className="vz-alert vz-alert--ok" role="status">
              {done}
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <div className="vz-field">
                <label className="vz-label" htmlFor="name">
                  {t("Nom affiché", "الاسم المعروض")}
                </label>
                <input
                  id="name"
                  className="vz-input"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>

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
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <span className="vz-help">
                  {t("8 caractères minimum.", "8 أحرف على الأقل.")}
                </span>
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
                  ? t("Création…", "جارٍ الإنشاء…")
                  : t("Créer mon compte", "إنشاء حسابي")}
              </button>
            </form>
          )}

          <div className="vz-auth__switch">
            {t("Déjà inscrit ?", "مسجل بالفعل؟")}{" "}
            <Link href="/connexion">{t("Se connecter", "تسجيل الدخول")}</Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
