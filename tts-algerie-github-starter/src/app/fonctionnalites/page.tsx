"use client";

import Link from "next/link";
import { PageHero, PageShell } from "@/components/page-shell";
import { useLocale } from "@/components/locale-provider";

export default function FonctionnalitesPage() {
  const { t } = useLocale();

  const features = [
    {
      icon: "✍️",
      title: t("Saisie de texte contrôlée", "إدخال نص مُتحكَّم فيه"),
      body: t(
        "Compteur de caractères et de mots, limite à 2 000 caractères, validation avant envoi.",
        "عدّاد للأحرف والكلمات، حد أقصى 2000 حرف، وتحقق قبل الإرسال."
      ),
      status: t("Disponible", "متاح"),
      tone: "",
    },
    {
      icon: "🗂️",
      title: t("Historique personnel", "سجل شخصي"),
      body: t(
        "Chaque génération est rattachée à votre compte, avec son état et son fichier.",
        "كل عملية توليد مرتبطة بحسابك، مع حالتها وملفها."
      ),
      status: t("Disponible", "متاح"),
      tone: "",
    },
    {
      icon: "⏳",
      title: t("Traitement asynchrone", "معالجة غير متزامنة"),
      body: t(
        "Vous lancez la demande, suivez son état et récupérez l'audio plus tard, sans garder la page ouverte.",
        "تطلق الطلب، تتابع حالته وتستلم الصوت لاحقاً، دون إبقاء الصفحة مفتوحة."
      ),
      status: t("En préparation", "قيد الإعداد"),
      tone: "vz-badge--soon",
    },
    {
      icon: "🎚️",
      title: t("Réglages utiles seulement", "إعدادات مفيدة فقط"),
      body: t(
        "Vitesse et voix affichées uniquement si elles sont réellement connectées au moteur.",
        "السرعة والصوت يُعرضان فقط إذا كانا متصلين فعلياً بالمحرك."
      ),
      status: t("En préparation", "قيد الإعداد"),
      tone: "vz-badge--soon",
    },
    {
      icon: "🌐",
      title: t("Bilingue et RTL", "ثنائي اللغة و RTL"),
      body: t(
        "Bascule arabe / français immédiate, direction de lecture correcte, contrastes WCAG AA.",
        "تبديل فوري بين العربية والفرنسية، اتجاه قراءة صحيح، وتباين WCAG AA."
      ),
      status: t("Disponible", "متاح"),
      tone: "",
    },
    {
      icon: "🛡️",
      title: t("Compte et rôles", "حساب وأدوار"),
      body: t(
        "Visiteur, utilisateur, administrateur. Les contrôles sont faits côté serveur, pas dans le navigateur.",
        "زائر، مستخدم، مسؤول. التحققات تتم على الخادم، لا في المتصفح."
      ),
      status: t("Disponible", "متاح"),
      tone: "",
    },
  ];

  return (
    <PageShell>
      <PageHero
        eyebrow={t("Fonctionnalités", "الميزات")}
        title={t("Ce que VOIX DZ fait, sans exagération.", "ما يفعله VOIX DZ، دون مبالغة.")}
        lead={t(
          "Chaque fonction est classée : disponible aujourd'hui, en préparation, ou prévue plus tard. Une fonction non connectée n'est jamais présentée comme active.",
          "كل ميزة مصنّفة: متاحة اليوم، قيد الإعداد، أو مخططة لاحقاً. الميزة غير المتصلة لا تُعرض أبداً كأنها مفعّلة."
        )}
      />

      <section className="vz-section vz-section--tight">
        <div className="vz-container">
          <div className="vz-grid vz-grid--3">
            {features.map((feature) => (
              <article key={feature.title} className="vz-card">
                <div className="vz-card__icon" aria-hidden="true">
                  {feature.icon}
                </div>
                <span className={`vz-badge ${feature.tone}`}>{feature.status}</span>
                <h3 className="vz-h3" style={{ marginTop: 12 }}>
                  {feature.title}
                </h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="vz-section vz-section--tight">
        <div className="vz-container">
          <div className="vz-card" style={{ textAlign: "center" }}>
            <h2 className="vz-h2">{t("Tester l'interface maintenant", "جرّب الواجهة الآن")}</h2>
            <p className="vz-lead" style={{ marginInline: "auto" }}>
              {t(
                "Le studio fonctionne en mode démonstration transparent : vous voyez les écrans et les états, sans consommation d'API.",
                "يعمل الاستوديو في وضع عرض شفاف: ترى الشاشات والحالات، دون استهلاك أي API."
              )}
            </p>
            <div className="vz-hero__actions" style={{ justifyContent: "center" }}>
              <Link href="/app/studio" className="vz-btn vz-btn--primary">
                {t("Ouvrir le studio", "افتح الاستوديو")}
              </Link>
              <Link href="/tarifs" className="vz-btn vz-btn--ghost">
                {t("Voir les tarifs", "عرض الأسعار")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
