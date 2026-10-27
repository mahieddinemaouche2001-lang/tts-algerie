"use client";

import { AdminGuard, AdminShell } from "@/components/admin-shell";
import { useLocale } from "@/components/locale-provider";

export default function AdminContenusPage() {
  const { t } = useLocale();

  const sections = [
    t("Bandeau d'annonce", "شريط الإعلان"),
    t("Page d'accueil — hero", "الرئيسية — الواجهة"),
    t("FAQ", "الأسئلة الشائعة"),
    t("Tarifs", "الأسعار"),
    t("Mentions légales", "الإشعارات القانونية"),
  ];

  return (
    <AdminGuard>
      {() => (
        <AdminShell
          title={t("Contenus", "المحتوى")}
          subtitle={t(
            "Édition des textes du site public. La table site_content n'est pas encore créée.",
            "تحرير نصوص الموقع العام. جدول site_content غير موجود بعد."
          )}
        >
          <div className="vz-alert vz-alert--info" style={{ marginBottom: 18 }}>
            {t(
              "Cette section est préparée mais inactive : aucun contenu n'est enregistré en base pour l'instant. Les textes restent dans le code jusqu'à validation du schéma.",
              "هذا القسم جاهز لكنه غير مفعّل: لا يُحفظ أي محتوى في قاعدة البيانات حالياً. تبقى النصوص في الكود حتى اعتماد المخطط."
            )}
          </div>

          <div className="vz-grid vz-grid--2">
            {sections.map((section) => (
              <div key={section} className="vz-card">
                <h3 className="vz-h3">{section}</h3>
                <p className="vz-muted" style={{ marginBottom: 12 }}>
                  {t("Édition désactivée", "التحرير معطّل")}
                </p>
                <button type="button" className="vz-btn vz-btn--ghost vz-btn--sm" disabled>
                  {t("Modifier", "تعديل")}
                </button>
              </div>
            ))}
          </div>
        </AdminShell>
      )}
    </AdminGuard>
  );
}
