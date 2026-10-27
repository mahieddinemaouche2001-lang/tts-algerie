"use client";

import Link from "next/link";
import { PageHero, PageShell } from "@/components/page-shell";
import { useLocale } from "@/components/locale-provider";

export default function TarifsPage() {
  const { t } = useLocale();

  const plans = [
    {
      name: t("Découverte", "الاكتشاف"),
      price: t("Gratuit", "مجاني"),
      detail: t("2 essais gratuits", "محاولتان مجانيتان"),
      features: [
        t("Accès au studio", "الوصول إلى الاستوديو"),
        t("Historique personnel", "سجل شخصي"),
        t("Arabe et français", "العربية والفرنسية"),
      ],
      cta: t("Créer un compte", "إنشاء حساب"),
      href: "/inscription",
      primary: false,
      badge: "",
    },
    {
      name: t("Créateur", "المبدع"),
      price: t("À définir", "قيد التحديد"),
      detail: t("Tarif annoncé après activation du moteur", "يُعلن السعر بعد تفعيل المحرك"),
      features: [
        t("Volume mensuel de caractères", "حجم شهري من الأحرف"),
        t("Téléchargement WAV", "تحميل WAV"),
        t("Historique étendu", "سجل موسّع"),
      ],
      cta: t("Être prévenu", "أبلغني"),
      href: "/contact",
      primary: true,
      badge: t("Recommandé", "موصى به"),
    },
    {
      name: t("Agence", "الوكالة"),
      price: t("Sur devis", "حسب الطلب"),
      detail: t("Facturation et volume personnalisés", "فواتير وحجم مخصصان"),
      features: [
        t("Plusieurs utilisateurs", "عدة مستخدمين"),
        t("Traitement par lots", "معالجة بالدفعات"),
        t("Accompagnement", "مواكبة"),
      ],
      cta: t("Nous contacter", "اتصل بنا"),
      href: "/contact",
      primary: false,
      badge: "",
    },
  ];

  return (
    <PageShell>
      <PageHero
        eyebrow={t("Tarifs", "الأسعار")}
        title={t("Des prix annoncés quand ils sont réels.", "أسعار تُعلن عندما تكون حقيقية.")}
        lead={t(
          "Aucun paiement n'est actif aujourd'hui. Les offres ci-dessous décrivent la structure prévue, pas un engagement commercial.",
          "لا يوجد أي دفع مفعّل اليوم. العروض أدناه تصف الهيكل المخطط، وليست التزاماً تجارياً."
        )}
      />

      <section className="vz-section vz-section--tight">
        <div className="vz-container">
          <div className="vz-grid vz-grid--3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className="vz-card"
                style={
                  plan.primary
                    ? { borderColor: "var(--vz-green-bright)", boxShadow: "var(--vz-shadow)" }
                    : undefined
                }
              >
                {plan.badge ? <span className="vz-badge">{plan.badge}</span> : null}
                <h3 className="vz-h3" style={{ marginTop: plan.badge ? 12 : 0 }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: 28, fontWeight: 900, color: "var(--vz-green-dark)", margin: "6px 0" }}>
                  {plan.price}
                </p>
                <p className="vz-help" style={{ marginBottom: 16 }}>
                  {plan.detail}
                </p>
                <ul className="vz-muted" style={{ lineHeight: 1.9, paddingInlineStart: 20 }}>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`vz-btn ${plan.primary ? "vz-btn--primary" : "vz-btn--ghost"} vz-btn--block`}
                  style={{ marginTop: 18 }}
                >
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="vz-section vz-section--tight">
        <div className="vz-container">
          <div className="vz-alert vz-alert--info">
            {t(
              "Le coût réel dépend du fournisseur de synthèse vocale. Tant que l'accès et le budget Google ne sont pas validés, aucun tarif définitif ne peut être publié.",
              "التكلفة الفعلية تعتمد على مزوّد توليد الصوت. ما دام الوصول والميزانية مع Google غير معتمدين، لا يمكن نشر أي سعر نهائي."
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
