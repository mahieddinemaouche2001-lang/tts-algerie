"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { useLocale } from "@/components/locale-provider";

export default function ParametresPage() {
  const { t, lang, setLang } = useLocale();
  const { user, isAnonymous, signOut } = useAuth();

  return (
    <div>
      <h1 className="vz-page-title">{t("Paramètres", "الإعدادات")}</h1>
      <p className="vz-page-sub">
        {t("Votre compte et vos préférences.", "حسابك وتفضيلاتك.")}
      </p>

      <div className="vz-card" style={{ marginBottom: 16 }}>
        <h2 className="vz-h3">{t("Compte", "الحساب")}</h2>
        <p className="vz-muted" style={{ lineHeight: 1.9 }}>
          {isAnonymous
            ? t(
                "Session invitée : aucun e-mail associé.",
                "جلسة زائر: لا يوجد بريد إلكتروني مرتبط."
              )
            : user?.email ?? "—"}
        </p>
        <p className="vz-help">
          {t("Identifiant : ", "المعرّف: ")}
          {user?.id ?? "—"}
        </p>

        {isAnonymous ? (
          <Link href="/inscription" className="vz-btn vz-btn--primary vz-btn--sm">
            {t("Convertir en compte permanent", "تحويل إلى حساب دائم")}
          </Link>
        ) : null}
      </div>

      <div className="vz-card" style={{ marginBottom: 16 }}>
        <h2 className="vz-h3">{t("Langue de l'interface", "لغة الواجهة")}</h2>
        <div className="vz-pill-row" style={{ marginTop: 12 }}>
          <button
            type="button"
            className={`vz-btn vz-btn--sm ${lang === "ar" ? "vz-btn--primary" : "vz-btn--ghost"}`}
            onClick={() => setLang("ar")}
          >
            العربية
          </button>
          <button
            type="button"
            className={`vz-btn vz-btn--sm ${lang === "fr" ? "vz-btn--primary" : "vz-btn--ghost"}`}
            onClick={() => setLang("fr")}
          >
            Français
          </button>
        </div>
      </div>

      <div className="vz-card" style={{ marginBottom: 16 }}>
        <h2 className="vz-h3">{t("Données et suppression", "البيانات والحذف")}</h2>
        <p className="vz-muted" style={{ lineHeight: 1.9 }}>
          {t(
            "La suppression définitive du compte sera disponible ici après validation de la procédure serveur. En attendant, la demande passe par la page Contact.",
            "سيكون الحذف النهائي للحساب متاحاً هنا بعد اعتماد الإجراء على الخادم. حالياً، يُقدّم الطلب عبر صفحة الاتصال."
          )}
        </p>
        <Link href="/contact" className="vz-btn vz-btn--ghost vz-btn--sm">
          {t("Demander la suppression", "طلب الحذف")}
        </Link>
      </div>

      <div className="vz-card">
        <h2 className="vz-h3">{t("Session", "الجلسة")}</h2>
        <button type="button" className="vz-btn vz-btn--danger vz-btn--sm" onClick={() => void signOut()}>
          {t("Se déconnecter", "تسجيل الخروج")}
        </button>
      </div>
    </div>
  );
}
