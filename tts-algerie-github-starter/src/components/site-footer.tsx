"use client";

import Link from "next/link";
import { useLocale } from "./locale-provider";

export function SiteFooter() {
  const { t } = useLocale();

  return (
    <footer className="vz-footer">
      <div className="vz-container">
        <div className="vz-footer__grid">
          <div>
            <Link href="/" className="vz-logo">
              <span className="vz-logo__mark" aria-hidden="true">
                ◉
              </span>
              <span>
                VOIX <span className="vz-logo__dz">DZ</span>
              </span>
            </Link>
            <p className="vz-muted" style={{ marginTop: 14, lineHeight: 1.7, maxWidth: 320 }}>
              {t(
                "Plateforme algérienne de synthèse vocale assistée par IA. Arabe et français, interface bilingue.",
                "منصة جزائرية لتحويل النص إلى صوت بالذكاء الاصطناعي. بالعربية والفرنسية، بواجهة ثنائية اللغة."
              )}
            </p>
          </div>

          <div>
            <h4>{t("Produit", "المنتج")}</h4>
            <Link href="/fonctionnalites">{t("Fonctionnalités", "الميزات")}</Link>
            <Link href="/voix">{t("Catalogue de voix", "الأصوات")}</Link>
            <Link href="/tarifs">{t("Tarifs", "الأسعار")}</Link>
            <Link href="/app/studio">{t("Studio", "الاستوديو")}</Link>
          </div>

          <div>
            <h4>{t("Ressources", "الموارد")}</h4>
            <Link href="/comment-ca-marche">{t("Comment ça marche", "كيف يعمل")}</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">{t("Contact", "اتصل بنا")}</Link>
          </div>

          <div>
            <h4>{t("Légal", "قانوني")}</h4>
            <Link href="/mentions-legales">{t("Mentions légales", "الإشعارات القانونية")}</Link>
            <Link href="/confidentialite">{t("Confidentialité", "الخصوصية")}</Link>
            <Link href="/cgu">{t("Conditions d'utilisation", "شروط الاستخدام")}</Link>
          </div>
        </div>

        <div className="vz-footer__bottom">
          <span>
            © {new Date().getFullYear()} VOIX DZ — {t("Tous droits réservés.", "جميع الحقوق محفوظة.")}
          </span>
          <span>
            {t(
              "Version de test : le moteur vocal est désactivé.",
              "نسخة تجريبية: محرك الصوت غير مفعّل."
            )}
          </span>
        </div>
      </div>
    </footer>
  );
}
