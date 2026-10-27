"use client";

import Link from "next/link";
import { useLocale } from "@/components/locale-provider";

export default function CreditsPage() {
  const { t } = useLocale();

  return (
    <div>
      <h1 className="vz-page-title">{t("Essais et crédits", "المحاولات والأرصدة")}</h1>
      <p className="vz-page-sub">
        {t(
          "Ce qui est décompté, quand, et pourquoi.",
          "ما يُحتسب، ومتى، ولماذا."
        )}
      </p>

      <div className="vz-grid vz-grid--2" style={{ marginBottom: 20 }}>
        <div className="vz-kpi">
          <strong>2</strong>
          <span>{t("Essais gratuits par compte", "محاولتان مجانيتان لكل حساب")}</span>
        </div>
        <div className="vz-kpi">
          <strong style={{ fontSize: 18 }}>{t("Aucun paiement actif", "لا دفع مفعّل")}</strong>
          <span>{t("Les crédits payants arriveront plus tard", "ستأتي الأرصدة المدفوعة لاحقاً")}</span>
        </div>
      </div>

      <div className="vz-card" style={{ marginBottom: 16 }}>
        <h2 className="vz-h3">{t("Règles de décompte", "قواعد الاحتساب")}</h2>
        <ul className="vz-muted" style={{ lineHeight: 1.95, paddingInlineStart: 20, margin: 0 }}>
          <li>
            {t(
              "Un essai est réservé au lancement de la demande, puis restitué si la génération échoue.",
              "تُحجز محاولة عند إطلاق الطلب، ثم تُعاد إذا فشل التوليد."
            )}
          </li>
          <li>
            {t(
              "Aucun essai n'est consommé quand le moteur est désactivé.",
              "لا تُستهلك أي محاولة عندما يكون المحرك معطّلاً."
            )}
          </li>
          <li>
            {t(
              "Le décompte est vérifié côté serveur, jamais dans le navigateur.",
              "يُتحقق من الاحتساب على الخادم، وليس في المتصفح."
            )}
          </li>
        </ul>
      </div>

      <div className="vz-alert vz-alert--info">
        {t(
          "Le solde exact sera affiché ici dès que la table de quotas sera vérifiée et exposée par une API dédiée. Nous préférons ne rien afficher plutôt qu'un chiffre faux.",
          "سيُعرض الرصيد الدقيق هنا بمجرد التحقق من جدول الحصص وإتاحته عبر API مخصص. نفضّل عدم عرض أي رقم بدلاً من رقم خاطئ."
        )}
      </div>

      <p style={{ marginTop: 20 }}>
        <Link href="/tarifs" className="vz-btn vz-btn--ghost">
          {t("Voir la structure des offres", "عرض هيكل العروض")}
        </Link>
      </p>
    </div>
  );
}
