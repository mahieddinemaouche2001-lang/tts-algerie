"use client";

import { LegalPage } from "@/components/legal-page";
import { useLocale } from "@/components/locale-provider";

export default function CguPage() {
  const { t } = useLocale();

  return (
    <LegalPage
      title={t("Conditions générales d'utilisation", "شروط الاستخدام العامة")}
      lead={t(
        "Les règles d'usage du service, dans sa version actuelle de test.",
        "قواعد استخدام الخدمة، في نسختها التجريبية الحالية."
      )}
      sections={[
        {
          heading: t("Statut du service", "حالة الخدمة"),
          body: (
            <p>
              {t(
                "VOIX DZ est en phase de test. Le moteur de synthèse vocale est désactivé. L'interface, les comptes et l'historique sont fournis à titre d'évaluation, sans garantie de disponibilité continue.",
                "VOIX DZ في مرحلة اختبار. محرك توليد الصوت معطّل. تُقدَّم الواجهة والحسابات والسجل لغرض التقييم، دون ضمان توفر مستمر."
              )}
            </p>
          ),
        },
        {
          heading: t("Usage autorisé", "الاستخدام المسموح"),
          body: (
            <ul style={{ paddingInlineStart: 20 }}>
              <li>{t("Utiliser le service pour vos propres contenus ou ceux que vous êtes autorisé à traiter.", "استخدام الخدمة لمحتواك أو لمحتوى مصرّح لك بمعالجته.")}</li>
              <li>{t("Ne pas usurper l'identité d'une personne ni imiter sa voix sans consentement écrit.", "عدم انتحال هوية شخص أو تقليد صوته دون موافقة كتابية.")}</li>
              <li>{t("Ne pas automatiser massivement les demandes ni contourner les quotas.", "عدم أتمتة الطلبات بكثافة أو التحايل على الحصص.")}</li>
            </ul>
          ),
        },
        {
          heading: t("Contenus interdits", "المحتوى المحظور"),
          body: (
            <p>
              {t(
                "Contenus illicites, haineux, diffamatoires, trompeurs, ou destinés à frauder. Tout contenu portant atteinte aux droits d'un tiers peut entraîner la suspension du compte.",
                "المحتوى غير القانوني أو الكراهية أو التشهيري أو المضلل أو المخصص للاحتيال. أي محتوى ينتهك حقوق الغير قد يؤدي إلى تعليق الحساب."
              )}
            </p>
          ),
        },
        {
          heading: t("Responsabilité", "المسؤولية"),
          body: (
            <p>
              {t(
                "L'utilisateur est responsable du texte soumis et de l'usage du fichier produit. VOIX DZ ne garantit pas un résultat adapté à un usage professionnel particulier avant validation du moteur.",
                "المستخدم مسؤول عن النص المُرسل وعن استخدام الملف الناتج. لا يضمن VOIX DZ نتيجة ملائمة لاستخدام مهني معين قبل اعتماد المحرك."
              )}
            </p>
          ),
        },
        {
          heading: t("Modification des conditions", "تعديل الشروط"),
          body: (
            <p>
              {t(
                "Ces conditions seront révisées avant l'ouverture commerciale, notamment pour la facturation et les crédits.",
                "ستُراجع هذه الشروط قبل الافتتاح التجاري، لا سيما للفواتير والأرصدة."
              )}
            </p>
          ),
        },
      ]}
    />
  );
}
