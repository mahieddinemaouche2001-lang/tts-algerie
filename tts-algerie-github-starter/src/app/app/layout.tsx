"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { useLocale } from "@/components/locale-provider";

function AppShell({ children }: { children: React.ReactNode }) {
  const { status, user, isAnonymous, signOut } = useAuth();
  const { t, lang, toggle } = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "signed-out") {
      router.replace("/connexion");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="vz-shell">
        <div className="vz-container" style={{ paddingBlock: 80 }}>
          <p className="vz-muted">{t("Chargement de votre espace…", "جارٍ تحميل مساحتك…")}</p>
        </div>
      </div>
    );
  }

  if (status === "unconfigured") {
    return (
      <div className="vz-shell">
        <div className="vz-container" style={{ paddingBlock: 60, maxWidth: 640 }}>
          <div className="vz-alert">
            {t(
              "L'authentification n'est pas configurée sur cet environnement. Ajoutez les variables publiques Supabase dans .env.local, puis redémarrez.",
              "المصادقة غير مهيأة في هذه البيئة. أضف متغيرات Supabase العامة في .env.local ثم أعد التشغيل."
            )}
          </div>
          <p style={{ marginTop: 16 }}>
            <Link href="/" className="vz-btn vz-btn--ghost">
              {t("Retour à l'accueil", "العودة إلى الرئيسية")}
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (status === "signed-out") {
    return (
      <div className="vz-shell">
        <div className="vz-container" style={{ paddingBlock: 80 }}>
          <p className="vz-muted">{t("Redirection vers la connexion…", "جارٍ التحويل إلى تسجيل الدخول…")}</p>
        </div>
      </div>
    );
  }

  const navigation = [
    { href: "/app", label: t("Vue d'ensemble", "نظرة عامة") },
    { href: "/app/studio", label: t("Studio", "الاستوديو") },
    { href: "/app/historique", label: t("Historique", "السجل") },
    { href: "/app/jobs", label: t("File d'attente", "قائمة الانتظار") },
    { href: "/app/credits", label: t("Essais et crédits", "المحاولات والأرصدة") },
    { href: "/app/parametres", label: t("Paramètres", "الإعدادات") },
  ];

  return (
    <div className="vz-shell">
      <header className="vz-header">
        <div className="vz-container vz-header__inner">
          <Link href="/" className="vz-logo">
            <span className="vz-logo__mark" aria-hidden="true">
              ◉
            </span>
            <span>
              VOIX <span className="vz-logo__dz">DZ</span>
            </span>
          </Link>

          <div className="vz-header__actions" style={{ marginInlineStart: "auto" }}>
            <button type="button" className="vz-lang" onClick={toggle}>
              {lang === "ar" ? "Français" : "العربية"}
            </button>
            <Link href="/" className="vz-btn vz-btn--ghost vz-btn--sm vz-desktop-only">
              {t("Site public", "الموقع العام")}
            </Link>
            <button
              type="button"
              className="vz-btn vz-btn--ghost vz-btn--sm"
              onClick={() => void signOut()}
            >
              {t("Déconnexion", "خروج")}
            </button>
          </div>
        </div>
      </header>

      <div className="vz-container" style={{ display: "grid", gap: 24, paddingBlock: 28, flex: 1 }}>
        <div className="vz-app-layout">
          <aside className="vz-app-sidebar" aria-label={t("Navigation de l'espace", "تنقل المساحة")}>
            <div className="vz-card" style={{ padding: 18 }}>
              <p className="vz-help" style={{ margin: 0 }}>
                {isAnonymous
                  ? t("Session invitée", "جلسة زائر")
                  : user?.email ?? t("Compte connecté", "حساب متصل")}
              </p>
            </div>

            <nav className="vz-app-nav">
              {navigation.map((item) => {
                const active =
                  item.href === "/app"
                    ? pathname === "/app"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`vz-app-nav__link${active ? " is-active" : ""}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {isAnonymous ? (
              <div className="vz-alert vz-alert--info" style={{ marginTop: 16 }}>
                {t(
                  "Vous êtes en session invitée : l'historique peut être perdu. Créez un compte pour le conserver.",
                  "أنت في جلسة زائر: قد يُفقد السجل. أنشئ حساباً للحفاظ عليه."
                )}
                <div style={{ marginTop: 10 }}>
                  <Link href="/inscription" className="vz-btn vz-btn--primary vz-btn--sm">
                    {t("Créer un compte", "إنشاء حساب")}
                  </Link>
                </div>
              </div>
            ) : null}
          </aside>

          <section>{children}</section>
        </div>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
