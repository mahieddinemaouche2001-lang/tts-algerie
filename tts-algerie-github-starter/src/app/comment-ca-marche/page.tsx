"use client";

import Link from "next/link";
import { PageHero, PageShell } from "@/components/page-shell";
import { useLocale } from "@/components/locale-provider";

export default function CommentCaMarchePage() {
  const { t } = useLocale();

  const steps = [
    {
      title: t("1. Vous écrivez le texte", "١. تكتب النص"),
      body: t(
        "Collez votre script. Le studio compte les caractères et les mots, et refuse un texte vide ou trop long.",
        "الصق نصك. يحسب الاستوديو الأحرف والكلمات، ويرفض النص الفارغ أو الطويل جداً."
      ),
    },
    {
      title: t("2. Vous choisissez les réglages", "٢. تختار الإعدادات"),
      body: t(
        "Vitesse et voix ne sont proposées que si elles sont réellement reliées au moteur. Sinon elles restent désactivées et signalées comme telles.",
        "تُعرض السرعة والصوت فقط إذا كانا مرتبطين فعلياً بالمحرك. وإلا يبقيان معطّلين ومُعلَّمين بذلك."
      ),
    },
    {
      title: t("3. La demande part au serveur", "٣. يُرسل الطلب إلى الخادم"),
      body: t(
        "Le serveur vérifie votre session, votre quota d'essais et le plafond quotidien. Aucune clé n'est exposée au navigateur.",
        "يتحقق الخادم من جلستك وحصتك من المحاولات والحد اليومي. لا يُعرض أي مفتاح في المتصفح."
      ),
    },
    {
      title: t("4. Le traitement est asynchrone", "٤. المعالجة غير متزامنة"),
      body: t(
        "La génération par lots peut prendre plusieurs minutes. Vous pouvez fermer l'onglet : le statut reste consultable dans votre historique.",
        "قد يستغرق التوليد بالدفعات عدة دقائق. يمكنك إغلاق التبويب: تبقى الحالة متاحة في سجلك."
      ),
    },
    {
      title: t("5. Vous récupérez le fichier", "٥. تستلم الملف"),
      body: t(
        "Dès que le fichier est prêt, vous l'écoutez et le téléchargez au format WAV depuis votre espace.",
        "بمجرد أن يصبح الملف جاهزاً، تستمع إليه وتحمّله بصيغة WAV من مساحتك."
      ),
    },
  ];

  return (
    <PageShell>
      <PageHero
        eyebrow={t("Comment ça marche", "كيف يعمل")}
        title={t("Un traitement par lots, expliqué sans jargon.", "معالجة بالدفعات، مشروحة بلا مصطلحات معقدة.")}
        lead={t(
          "Contrairement à un outil qui répond en trois secondes, un traitement asynchrone organise les demandes. C'est plus lent, mais plus économique et plus fiable sur de longs textes.",
          "على عكس أداة تجيب في ثلاث ثوانٍ، تنظّم المعالجة غير المتزامنة الطلبات. إنها أبطأ، لكنها أرخص وأكثر موثوقية في النصوص الطويلة."
        )}
      />

      <section className="vz-section vz-section--tight">
        <div className="vz-container">
          <div className="vz-grid vz-grid--2">
            {steps.map((step) => (
              <article key={step.title} className="vz-card">
                <h3 className="vz-h3">{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="vz-section vz-section--tight">
        <div className="vz-container">
          <div className="vz-card">
            <h2 className="vz-h2" style={{ fontSize: "clamp(22px, 3vw, 30px)" }}>
              {t("Combien de temps faut-il attendre ?", "كم من الوقت يجب الانتظار؟")}
            </h2>
            <p className="vz-lead">
              {t(
                "Nous ne publions pas de durée garantie tant que le mode Batch n'est pas mesuré sur de vraies demandes. L'interface affichera un état réel : en attente, en cours, prêt ou échec — jamais une fausse progression.",
                "لا ننشر مدة مضمونة ما لم يُقس وضع الدفعات على طلبات حقيقية. ستعرض الواجهة حالة حقيقية: في الانتظار، قيد التنفيذ، جاهز أو فشل — وليس تقدماً وهمياً."
              )}
            </p>
            <div className="vz-pill-row" style={{ marginTop: 16 }}>
              <span className="vz-badge vz-badge--soon">{t("En attente", "في الانتظار")}</span>
              <span className="vz-badge vz-badge--soon">{t("En cours", "قيد التنفيذ")}</span>
              <span className="vz-badge">{t("Prêt", "جاهز")}</span>
              <span className="vz-badge vz-badge--warn">{t("Échec", "فشل")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="vz-section vz-section--tight">
        <div className="vz-container" style={{ textAlign: "center" }}>
          <Link href="/app/studio" className="vz-btn vz-btn--primary">
            {t("Voir le studio", "شاهد الاستوديو")}
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
