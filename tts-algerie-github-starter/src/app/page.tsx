"use client";

import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useLocale } from "@/components/locale-provider";

export default function HomePage() {
  const { t } = useLocale();

  return (
    <div className="vz-shell">
      <SiteHeader />

      <main className="vz-main">
        <section className="vz-hero">
          <div className="vz-container vz-hero__grid">
            <div>
              <span className="vz-eyebrow">
                {t("Synthèse vocale · Algérie", "توليد الصوت · الجزائر")}
              </span>

              <h1 className="vz-h1">
                {t("Votre texte devient", "نصّك يصبح")}{" "}
                <span className="vz-green">{t("une voix", "صوتاً")}</span>{" "}
                {t("professionnelle.", "احترافياً.")}
              </h1>

              <p className="vz-lead">
                {t(
                  "VOIX DZ transforme vos scripts publicitaires, narrations et cours en fichiers audio clairs, en arabe et en français, depuis votre navigateur.",
                  "يحوّل VOIX DZ نصوصك الإعلانية والروائية والدروس إلى ملفات صوتية واضحة، بالعربية والفرنسية، من متصفحك."
                )}
              </p>

              <div className="vz-hero__actions">
                <Link href="/app/studio" className="vz-btn vz-btn--primary">
                  {t("Ouvrir le studio", "افتح الاستوديو")}
                </Link>
                <Link href="/comment-ca-marche" className="vz-btn vz-btn--ghost">
                  {t("Comment ça marche", "كيف يعمل")}
                </Link>
              </div>

              <p className="vz-hero__note">
                {t(
                  "Deux essais gratuits. Aucune carte bancaire. Le moteur vocal est en préparation : la génération réelle n'est pas encore active.",
                  "محاولتان مجانيتان. بدون بطاقة بنكية. محرك الصوت قيد الإعداد: التوليد الفعلي غير مفعّل بعد."
                )}
              </p>

              <div className="vz-wave" aria-hidden="true">
                {[18, 42, 64, 32, 78, 52, 90, 44, 68, 30, 56, 82, 38, 60, 24, 74, 46, 88, 34, 54].map(
                  (height, index) => (
                    <span
                      key={index}
                      style={{ height: `${height}%`, animationDelay: `${index * 0.08}s` }}
                    />
                  )
                )}
              </div>
            </div>

            <div className="vz-card vz-card--accent">
              <span className="vz-badge">
                {t("Aperçu du studio", "معاينة الاستوديو")}
              </span>
              <h2 className="vz-h3" style={{ marginTop: 14 }}>
                {t("Un script, trois réglages, un fichier audio.", "نص واحد، ثلاثة إعدادات، ملف صوتي.")}
              </h2>
              <div className="vz-field" style={{ marginTop: 18 }}>
                <label className="vz-label" htmlFor="demo-text">
                  {t("Votre texte", "نصّك")}
                </label>
                <textarea
                  id="demo-text"
                  className="vz-textarea"
                  style={{ minHeight: 120 }}
                  readOnly
                  value={t(
                    "Bienvenue sur VOIX DZ, la plateforme vocale algérienne.",
                    "مرحباً بكم في VOIX DZ، المنصة الصوتية الجزائرية."
                  )}
                />
              </div>
              <div className="vz-grid vz-grid--2" style={{ gap: 12 }}>
                <div className="vz-field" style={{ marginBottom: 0 }}>
                  <span className="vz-label">{t("Voix", "الصوت")}</span>
                  <div className="vz-input" style={{ color: "#8a9c90" }}>
                    {t("À valider", "قيد التأكيد")}
                  </div>
                </div>
                <div className="vz-field" style={{ marginBottom: 0 }}>
                  <span className="vz-label">{t("Vitesse", "السرعة")}</span>
                  <div className="vz-input">1×</div>
                </div>
              </div>
              <div className="vz-alert vz-alert--info" style={{ marginTop: 16 }}>
                {t(
                  "Démonstration d'interface : aucun audio n'est généré sur cette page.",
                  "عرض للواجهة فقط: لا يتم توليد أي صوت في هذه الصفحة."
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="vz-section vz-section--tight">
          <div className="vz-container">
            <div className="vz-grid vz-grid--3">
              {[
                {
                  icon: "🎙️",
                  title: t("Publicité et réseaux", "الإعلانات والشبكات"),
                  body: t(
                    "Voix off pour spots, réels et publications, sans réserver un studio.",
                    "تعليق صوتي للإعلانات والريلز والمنشورات، دون حجز استوديو."
                  ),
                },
                {
                  icon: "📚",
                  title: t("Formation et narration", "التكوين والسرد"),
                  body: t(
                    "Transformez un cours ou un document en audio écoutable.",
                    "حوّل درساً أو وثيقة إلى ملف صوتي قابل للاستماع."
                  ),
                },
                {
                  icon: "🌍",
                  title: t("Arabe et français", "العربية والفرنسية"),
                  body: t(
                    "Une interface qui bascule de droite à gauche sans perdre le contenu.",
                    "واجهة تنقلب من اليمين إلى اليسار دون فقدان المحتوى."
                  ),
                },
              ].map((item) => (
                <article key={item.title} className="vz-card">
                  <div className="vz-card__icon" aria-hidden="true">
                    {item.icon}
                  </div>
                  <h3 className="vz-h3">{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="vz-section">
          <div className="vz-container">
            <div className="vz-center" style={{ marginBottom: 34 }}>
              <h2 className="vz-h2">{t("Trois étapes, pas plus.", "ثلاث خطوات فقط.")}</h2>
              <p className="vz-lead">
                {t(
                  "Le traitement est asynchrone : vous lancez la demande, vous pouvez fermer l'onglet, l'audio apparaît dans votre historique dès qu'il est prêt.",
                  "المعالجة غير متزامنة: تطلق الطلب، يمكنك إغلاق التبويب، ويظهر الصوت في سجلك بمجرد أن يصبح جاهزاً."
                )}
              </p>
            </div>
            <div className="vz-steps">
              {[
                {
                  title: t("Collez votre texte", "الصق نصّك"),
                  body: t("Jusqu'à 2 000 caractères, avec un compteur de mots.", "حتى 2000 حرف، مع عدّاد للكلمات."),
                },
                {
                  title: t("Choisissez la voix", "اختر الصوت"),
                  body: t("Voix et vitesse réellement disponibles, sans promesse creuse.", "أصوات وسرعات متاحة فعلاً، دون وعود فارغة."),
                },
                {
                  title: t("Récupérez l'audio", "استلم الصوت"),
                  body: t("Écoute et téléchargement depuis votre historique.", "الاستماع والتحميل من سجلك."),
                },
              ].map((step) => (
                <article key={step.title} className="vz-step">
                  <h3 className="vz-h3">{step.title}</h3>
                  <p className="vz-muted" style={{ margin: 0, lineHeight: 1.7 }}>
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="vz-section vz-section--tight">
          <div className="vz-container">
            <div className="vz-card" style={{ padding: "clamp(24px, 4vw, 40px)" }}>
              <span className="vz-badge vz-badge--warn">
                {t("Transparence", "الشفافية")}
              </span>
              <h2 className="vz-h2" style={{ marginTop: 14, fontSize: "clamp(22px, 3vw, 30px)" }}>
                {t("Ce qui fonctionne aujourd'hui, et ce qui arrive.", "ما يعمل اليوم، وما سيأتي.")}
              </h2>
              <div className="vz-grid vz-grid--2" style={{ marginTop: 20 }}>
                <div>
                  <h3 className="vz-h3">{t("Disponible", "متاح")}</h3>
                  <ul className="vz-muted" style={{ lineHeight: 1.9, paddingInlineStart: 20 }}>
                    <li>{t("Interface bilingue arabe / français", "واجهة ثنائية اللغة عربية / فرنسية")}</li>
                    <li>{t("Compte utilisateur et historique", "حساب مستخدم وسجل")}</li>
                    <li>{t("Suivi des essais gratuits", "متابعة المحاولات المجانية")}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="vz-h3">{t("En préparation", "قيد الإعداد")}</h3>
                  <ul className="vz-muted" style={{ lineHeight: 1.9, paddingInlineStart: 20 }}>
                    <li>{t("Génération audio réelle (Gemini Batch)", "التوليد الصوتي الفعلي (Gemini Batch)")}</li>
                    <li>{t("Catalogue de voix validées", "كتالوج أصوات معتمدة")}</li>
                    <li>{t("Crédits et paiement local", "الأرصدة والدفع المحلي")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="vz-section">
          <div className="vz-container">
            <div className="vz-card" style={{ textAlign: "center", padding: "clamp(30px, 5vw, 56px)" }}>
              <h2 className="vz-h2">{t("Prêt à écouter votre texte ?", "مستعد لسماع نصّك؟")}</h2>
              <p className="vz-lead" style={{ marginInline: "auto" }}>
                {t(
                  "Créez votre compte, testez l'interface, et suivez l'ouverture du moteur vocal.",
                  "أنشئ حسابك، جرّب الواجهة، وتابع فتح محرك الصوت."
                )}
              </p>
              <div className="vz-hero__actions" style={{ justifyContent: "center" }}>
                <Link href="/inscription" className="vz-btn vz-btn--primary">
                  {t("Créer un compte", "إنشاء حساب")}
                </Link>
                <Link href="/tarifs" className="vz-btn vz-btn--ghost">
                  {t("Voir les tarifs", "عرض الأسعار")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
