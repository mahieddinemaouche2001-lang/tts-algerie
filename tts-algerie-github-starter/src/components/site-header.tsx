"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "./locale-provider";

export function SiteHeader() {
  const { t, toggle, lang } = useLocale();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t("Accueil", "الرئيسية") },
    { href: "/fonctionnalites", label: t("Fonctionnalités", "الميزات") },
    { href: "/voix", label: t("Voix", "الأصوات") },
    { href: "/tarifs", label: t("Tarifs", "الأسعار") },
    { href: "/faq", label: t("FAQ", "الأسئلة") },
  ];

  return (
    <header className="vz-header">
      <div className="vz-container vz-header__inner">
        <Link href="/" className="vz-logo" aria-label="VOIX DZ — accueil">
          <span className="vz-logo__mark" aria-hidden="true">
            ◉
          </span>
          <span>
            VOIX <span className="vz-logo__dz">DZ</span>
          </span>
        </Link>

        <nav className="vz-nav" aria-label={t("Navigation principale", "التنقل الرئيسي")}>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="vz-header__actions">
          <button
            type="button"
            className="vz-lang"
            onClick={toggle}
            aria-label={t("Passer en arabe", "التبديل إلى الفرنسية")}
          >
            {lang === "ar" ? "Français" : "العربية"}
          </button>

          <Link href="/connexion" className="vz-btn vz-btn--ghost vz-btn--sm vz-desktop-only">
            {t("Connexion", "تسجيل الدخول")}
          </Link>

          <Link href="/app/studio" className="vz-btn vz-btn--primary vz-btn--sm vz-desktop-only">
            {t("Créer une voix", "أنشئ صوتاً")}
          </Link>

          <button
            type="button"
            className="vz-burger"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={t("Ouvrir le menu", "فتح القائمة")}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <div
        className={`vz-mobile-nav vz-container${open ? " vz-mobile-nav--open" : ""}`}
      >
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
        <Link href="/connexion" onClick={() => setOpen(false)}>
          {t("Connexion", "تسجيل الدخول")}
        </Link>
        <Link href="/app/studio" onClick={() => setOpen(false)}>
          {t("Créer une voix", "أنشئ صوتاً")}
        </Link>
      </div>
    </header>
  );
}
