"use client";

import { useState } from "react";
import { PageHero, PageShell } from "@/components/page-shell";
import { useLocale } from "@/components/locale-provider";

export default function ContactPage() {
  const { t } = useLocale();
  const [sent, setSent] = useState(false);

  return (
    <PageShell>
      <PageHero
        eyebrow={t("Contact", "اتصل بنا")}
        title={t("Parlons de votre projet.", "لنتحدث عن مشروعك.")}
        lead={t(
          "Décrivez votre besoin : publicité, formation, narration ou volume important. Nous répondons avec les capacités réelles du produit, pas avec des promesses.",
          "صف احتياجك: إعلان، تكوين، سرد أو حجم كبير. نجيب بالقدرات الفعلية للمنتج، لا بالوعود."
        )}
      />

      <section className="vz-section vz-section--tight">
        <div className="vz-container">
          <div className="vz-grid vz-grid--2">
            <div className="vz-card">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setSent(true);
                }}
              >
                <div className="vz-field">
                  <label className="vz-label" htmlFor="contact-name">
                    {t("Nom", "الاسم")}
                  </label>
                  <input id="contact-name" className="vz-input" required autoComplete="name" />
                </div>
                <div className="vz-field">
                  <label className="vz-label" htmlFor="contact-email">
                    {t("E-mail", "البريد الإلكتروني")}
                  </label>
                  <input id="contact-email" type="email" className="vz-input" required autoComplete="email" />
                </div>
                <div className="vz-field">
                  <label className="vz-label" htmlFor="contact-message">
                    {t("Message", "الرسالة")}
                  </label>
                  <textarea id="contact-message" className="vz-textarea" required />
                </div>

                {sent ? (
                  <div className="vz-alert vz-alert--info" role="status">
                    {t(
                      "Le formulaire de contact n'est pas encore relié à un service d'envoi. Votre message n'a pas été transmis. Cette fonctionnalité est en préparation.",
                      "نموذج الاتصال غير مرتبط بعد بخدمة إرسال. لم تُرسل رسالتك. هذه الميزة قيد الإعداد."
                    )}
                  </div>
                ) : (
                  <button type="submit" className="vz-btn vz-btn--primary vz-btn--block">
                    {t("Envoyer", "إرسال")}
                  </button>
                )}
              </form>
            </div>

            <div className="vz-card">
              <h3 className="vz-h3">{t("Informations pratiques", "معلومات عملية")}</h3>
              <p className="vz-muted" style={{ lineHeight: 1.9 }}>
                {t(
                  "Langues de réponse : arabe et français. Délai indicatif : sous 3 jours ouvrés.",
                  "لغات الرد: العربية والفرنسية. المدة الإرشادية: خلال 3 أيام عمل."
                )}
              </p>
              <hr className="vz-divider" />
              <p className="vz-muted" style={{ lineHeight: 1.9 }}>
                {t(
                  "Aucune donnée bancaire n'est demandée. Ne transmettez jamais de clé API ni de mot de passe par ce formulaire.",
                  "لا تُطلب أي بيانات بنكية. لا ترسل أبداً مفتاح API أو كلمة مرور عبر هذا النموذج."
                )}
              </p>
              <div className="vz-alert vz-alert--info" style={{ marginTop: 16 }}>
                {t(
                  "Formulaire en démonstration : il affiche un message mais n'envoie rien pour le moment.",
                  "نموذج للعرض: يعرض رسالة لكنه لا يرسل شيئاً في الوقت الحالي."
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
