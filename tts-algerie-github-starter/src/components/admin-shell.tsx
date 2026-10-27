"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "./locale-provider";

const TOKEN_KEY = "vdz_admin_token";

export function saveAdminToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const { t } = useLocale();
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: t("Vue d'ensemble", "نظرة عامة") },
    { href: "/admin/utilisateurs", label: t("Utilisateurs", "المستخدمون") },
    { href: "/admin/generations", label: t("Générations", "عمليات التوليد") },
    { href: "/admin/jobs", label: t("Jobs Batch", "وظائف الدفعات") },
    { href: "/admin/quotas", label: t("Quotas", "الحصص") },
    { href: "/admin/contenus", label: t("Contenus", "المحتوى") },
    { href: "/admin/parametres", label: t("Paramètres", "الإعدادات") },
  ];

  return (
    <div className="vz-shell">
      <header className="vz-header">
        <div className="vz-container vz-header__inner">
          <Link href="/admin" className="vz-logo">
            <span className="vz-logo__mark" aria-hidden="true">
              ⚙
            </span>
            <span>
              VOIX <span className="vz-logo__dz">DZ</span>
            </span>
          </Link>
          <span className="vz-badge" style={{ marginInlineStart: 8 }}>
            {t("Administration", "الإدارة")}
          </span>
          <div className="vz-header__actions" style={{ marginInlineStart: "auto" }}>
            <Link href="/" className="vz-btn vz-btn--ghost vz-btn--sm">
              {t("Site public", "الموقع العام")}
            </Link>
            <button
              type="button"
              className="vz-btn vz-btn--ghost vz-btn--sm"
              onClick={() => {
                clearAdminToken();
                window.location.assign("/admin");
              }}
            >
              {t("Quitter", "خروج")}
            </button>
          </div>
        </div>
      </header>

      <div className="vz-container" style={{ paddingBlock: 24 }}>
        <nav className="vz-admin-nav" aria-label={t("Navigation admin", "تنقل الإدارة")}>
          {links.map((link) => {
            const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`vz-admin-nav__link${active ? " is-active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <h1 className="vz-page-title" style={{ marginTop: 22 }}>
          {title}
        </h1>
        {subtitle ? <p className="vz-page-sub">{subtitle}</p> : null}

        {children}
      </div>
    </div>
  );
}

/**
 * Render-prop guard: reads the admin token saved at login, redirects to
 * /admin when missing, and renders only with a token.
 */
export function AdminGuard({
  children,
}: {
  children: (token: string) => React.ReactNode;
}) {
  const { t } = useLocale();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(TOKEN_KEY);
    if (!stored) {
      router.replace("/admin");
      return;
    }
    setToken(stored);
    setChecked(true);
  }, [router]);

  if (!checked || !token) {
    return <p className="vz-muted">{t("Vérification de la session…", "جارٍ التحقق من الجلسة…")}</p>;
  }

  return <>{children(token)}</>;
}
