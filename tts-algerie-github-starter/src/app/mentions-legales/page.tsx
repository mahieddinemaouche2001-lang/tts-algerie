"use client";

import { LegalPage } from "@/components/legal-page";
import { useLocale } from "@/components/locale-provider";

export default function MentionsLegalesPage() {
  const { t } = useLocale();

  return (
    <LegalPage
      title={t("Mentions légales", "الإشعارات القانونية")}
      lead={t(
        "Identification de l'éditeur et informations de contact du service VOIX DZ.",
        "تعريف الناشر ومعلومات الاتصال بخدمة VOIX DZ."
      )}
      sections={[
        {
          heading: t("Éditeur", "الناشر"),
          body: (
            <p>
              {t(
                "VOIX DZ — service en cours de constitution. Raison sociale, numéro d'immatriculation, adresse et représentant légal à compléter avant publication.",
                "VOIX DZ — خدمة قيد التأسيس. الاسم القانوني ورقم التسجيل والعنوان والممثل القانوني تُستكمل قبل النشر."
              )}
            </p>
          ),
        },
        {
          heading: t("Hébergement", "الاستضافة"),
          body: (
            <p>
              {t(
                "Application hébergée sur Vercel. Base de données et authentification assurées par Supabase. Les coordonnées exactes des prestataires seront précisées à la mise en production.",
                "التطبيق مستضاف على Vercel. قاعدة البيانات والمصادقة عبر Supabase. ستُحدد بيانات المزوّدين بدقة عند الإطلاق."
              )}
            </p>
          ),
        },
        {
          heading: t("Propriété intellectuelle", "الملكية الفكرية"),
          body: (
            <p>
              {t(
                "La marque, l'interface et les textes propres à VOIX DZ sont protégés. Toute reproduction des éléments graphiques ou sonores sans autorisation écrite est interdite. Les contenus générés par un utilisateur restent sa responsabilité.",
                "العلامة والواجهة والنصوص الخاصة بـ VOIX DZ محمية. يُحظر أي نسخ للعناصر الرسومية أو الصوتية دون إذن كتابي. المحتوى المُولّد من المستخدم يبقى تحت مسؤوليته."
              )}
            </p>
          ),
        },
        {
          heading: t("Contact", "الاتصال"),
          body: (
            <p>
              {t(
                "Pour toute question légale, utilisez la page Contact. Aucune demande de clé ou de mot de passe ne sera faite par ce canal.",
                "لأي سؤال قانوني، استخدم صفحة الاتصال. لن يُطلب أي مفتاح أو كلمة مرور عبر هذه القناة."
              )}
            </p>
          ),
        },
      ]}
    />
  );
}
