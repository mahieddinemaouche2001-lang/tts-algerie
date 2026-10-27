"use client";

import Link from "next/link";
import { PageHero, PageShell } from "@/components/page-shell";
import { useLocale } from "@/components/locale-provider";

export default function VoixPage() {
  const { t } = useLocale();

  return (
    <PageShell>
      <PageHero
        eyebrow={t("Catalogue", "الكتالوج")}
        title={t("Les voix seront annoncées une par une.", "سيتم الإعلان عن الأصوات واحدة تلو الأخرى.")}
        lead={t(
          "Aucune voix n'est encore validée avec le moteur retenu. Cette page ne présente donc ni nom, ni accent, ni extrait qui n'existe pas.",
          "لم يتم بعد اعتماد أي صوت مع المحرك المختار. لذلك لا تعرض هذه الصفحة اسماً أو لهجة أو مقطعاً غير موجود."
        )}
      />

      <section className="vz-section vz-section--tight">
        <div className="vz-container">
          <div className="vz-card">
            <span className="vz-badge vz-badge--warn">
              {t("En préparation", "قيد الإعداد")}
            </span>
            <h2 className="vz-h2" style={{ marginTop: 14, fontSize: "clamp(22px, 3vw, 30px)" }}>
              {t("Ce que nous publierons ici", "ما سننشره هنا")}
            </h2>
            <div className="vz-grid vz-grid--2" style={{ marginTop: 18 }}>
              <ul className="vz-muted" style={{ lineHeight: 1.95, paddingInlineStart: 20 }}>
                <li>{t("Le nom exact de chaque voix", "الاسم الدقيق لكل صوت")}</li>
                <li>{t("La langue et la variante réellement prises en charge", "اللغة والتنويع المدعوم فعلياً")}</li>
                <li>{t("Un extrait audio authentique, avec droits", "مقطع صوتي أصلي، مع الحقوق")}</li>
              </ul>
              <ul className="vz-muted" style={{ lineHeight: 1.95, paddingInlineStart: 20 }}>
                <li>{t("Les usages recommandés : publicité, narration, formation", "الاستخدامات الموصى بها: إعلان، سرد، تكوين")}</li>
                <li>{t("Les limites connues, écrites noir sur blanc", "الحدود المعروفة، مكتوبة بوضوح")}</li>
                <li>{t("La date de mise à disposition", "تاريخ الإتاحة")}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="vz-section vz-section--tight">
        <div className="vz-container">
          <div className="vz-grid vz-grid--3">
            {[
              {
                title: t("Arabe standard", "العربية الفصحى"),
                body: t("Cible prioritaire de la première version.", "الهدف الأول للنسخة الأولى."),
              },
              {
                title: t("Français", "الفرنسية"),
                body: t("Pour les marchés et les administrations bilingues.", "للأسواق والإدارات ثنائية اللغة."),
              },
              {
                title: t("Darija algérienne", "الدارجة الجزائرية"),
                body: t(
                  "À évaluer : toutes les voix ne gèrent pas correctement la darija écrite.",
                  "قيد التقييم: ليست كل الأصوات تتعامل بشكل صحيح مع الدارجة المكتوبة."
                ),
              },
            ].map((item) => (
              <article key={item.title} className="vz-card">
                <h3 className="vz-h3">{item.title}</h3>
                <p>{item.body}</p>
                <p style={{ marginTop: 12 }}>
                  <span className="vz-badge vz-badge--soon">
                    {t("Non validé", "غير معتمد")}
                  </span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="vz-section vz-section--tight">
        <div className="vz-container" style={{ textAlign: "center" }}>
          <Link href="/contact" className="vz-btn vz-btn--ghost">
            {t("Poser une question sur les voix", "اطرح سؤالاً حول الأصوات")}
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
