"use client";

import { AdminGuard, AdminShell } from "@/components/admin-shell";
import { useLocale } from "@/components/locale-provider";

export default function AdminParametresPage() {
  const { t } = useLocale();

  const rows = [
    {
      name: "GEMINI_TTS_ENABLED",
      value: t("false (attendu)", "false (متوقع)"),
      note: t(
        "Le serveur refuse toute génération tant que cette valeur n'est pas true.",
        "يرفض الخادم أي توليد ما دامت هذه القيمة ليست true."
      ),
    },
    {
      name: "ADMIN_USER_ID",
      value: t("défini côté serveur", "معرّف على الخادم"),
      note: t(
        "Un seul administrateur pour l'instant. Les rôles multiples viendront plus tard.",
        "مسؤول واحد حالياً. ستأتي الأدوار المتعددة لاحقاً."
      ),
    },
    {
      name: "SUPABASE_SECRET_KEY",
      value: t("masquée", "مخفية"),
      note: t(
        "Jamais affichée, jamais envoyée au navigateur.",
        "لا تُعرض أبداً ولا تُرسل إلى المتصفح."
      ),
    },
    {
      name: "GEMINI_API_KEY",
      value: t("masquée", "مخفية"),
      note: t(
        "Aucun appel facturable tant que le budget n'est pas validé.",
        "لا استدعاء مدفوع ما لم تُعتمد الميزانية."
      ),
    },
  ];

  return (
    <AdminGuard>
      {() => (
        <AdminShell
          title={t("Paramètres", "الإعدادات")}
          subtitle={t(
            "Noms de variables et état attendu. Aucune valeur secrète n'est exposée.",
            "أسماء المتغيرات والحالة المتوقعة. لا تُعرض أي قيمة سرية."
          )}
        >
          <div className="vz-table-wrap">
            <table className="vz-table">
              <thead>
                <tr>
                  <th>{t("Variable", "المتغير")}</th>
                  <th>{t("État", "الحالة")}</th>
                  <th>{t("Règle", "القاعدة")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.name}>
                    <td style={{ fontFamily: "monospace", fontSize: 13 }}>{row.name}</td>
                    <td>{row.value}</td>
                    <td className="vz-muted">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="vz-alert vz-alert--info" style={{ marginTop: 18 }}>
            {t(
              "La modification des variables se fait uniquement dans .env.local (local) ou dans le tableau de bord d'hébergement, jamais depuis cette page.",
              "يتم تعديل المتغيرات فقط في .env.local (محلياً) أو في لوحة الاستضافة، وليس من هذه الصفحة."
            )}
          </div>
        </AdminShell>
      )}
    </AdminGuard>
  );
}
