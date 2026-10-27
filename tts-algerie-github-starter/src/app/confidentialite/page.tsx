"use client";

import { LegalPage } from "@/components/legal-page";
import { useLocale } from "@/components/locale-provider";

export default function ConfidentialitePage() {
  const { t } = useLocale();

  return (
    <LegalPage
      title={t("Politique de confidentialité", "سياسة الخصوصية")}
      lead={t(
        "Quelles données sont collectées, pourquoi, et pendant combien de temps.",
        "ما هي البيانات التي تُجمع، ولماذا، ولأي مدة."
      )}
      sections={[
        {
          heading: t("Données collectées", "البيانات المجمّعة"),
          body: (
            <ul style={{ paddingInlineStart: 20 }}>
              <li>{t("Adresse e-mail et identifiant de compte.", "البريد الإلكتروني ومعرّف الحساب.")}</li>
              <li>{t("Textes soumis au studio, rattachés à votre compte.", "النصوص المُرسلة إلى الاستوديو، مرتبطة بحسابك.")}</li>
              <li>{t("Métadonnées techniques : date, état de la demande, quota d'essais.", "بيانات تقنية: التاريخ، حالة الطلب، حصة المحاولات.")}</li>
              <li>{t("Jeton hCaptcha lors de la création d'une session invitée.", "رمز hCaptcha عند إنشاء جلسة زائر.")}</li>
            </ul>
          ),
        },
        {
          heading: t("Finalités", "الأغراض"),
          body: (
            <p>
              {t(
                "Authentification, exécution des demandes, prévention des abus, suivi des quotas et support utilisateur. Aucune revente de données.",
                "المصادقة، تنفيذ الطلبات، منع إساءة الاستخدام، متابعة الحصص ودعم المستخدم. لا بيع للبيانات."
              )}
            </p>
          ),
        },
        {
          heading: t("Sous-traitants", "المعالجون الفرعيون"),
          body: (
            <p>
              {t(
                "Supabase (authentification et base de données), Vercel (hébergement), hCaptcha (protection anti-robot). Le fournisseur de synthèse vocale n'est pas encore activé ; sa politique sera publiée avant toute mise en service.",
                "Supabase (المصادقة وقاعدة البيانات)، Vercel (الاستضافة)، hCaptcha (الحماية من الروبوتات). مزوّد توليد الصوت غير مفعّل بعد؛ ستُنشر سياسته قبل أي تشغيل."
              )}
            </p>
          ),
        },
        {
          heading: t("Conservation et suppression", "الحفظ والحذف"),
          body: (
            <p>
              {t(
                "Les textes et fichiers sont conservés le temps nécessaire au service. La durée exacte et la procédure de suppression définitive seront précisées avant l'activation du moteur. Vous pouvez demander la suppression de votre compte depuis les paramètres.",
                "تُحفظ النصوص والملفات للمدة اللازمة للخدمة. ستُحدد المدة الدقيقة وإجراء الحذف النهائي قبل تفعيل المحرك. يمكنك طلب حذف حسابك من الإعدادات."
              )}
            </p>
          ),
        },
        {
          heading: t("Vos droits", "حقوقك"),
          body: (
            <p>
              {t(
                "Accès, rectification, suppression et opposition. Les demandes passent par la page Contact.",
                "الوصول والتصحيح والحذف والاعتراض. تُقدَّم الطلبات عبر صفحة الاتصال."
              )}
            </p>
          ),
        },
      ]}
    />
  );
}
