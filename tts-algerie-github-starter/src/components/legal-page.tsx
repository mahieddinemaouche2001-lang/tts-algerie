"use client";

import { PageHero, PageShell } from "./page-shell";
import { useLocale } from "./locale-provider";

export type LegalSection = {
  heading: string;
  body: React.ReactNode;
};

export function LegalPage({
  title,
  lead,
  sections,
}: {
  title: string;
  lead: string;
  sections: LegalSection[];
}) {
  const { t } = useLocale();

  return (
    <PageShell>
      <PageHero eyebrow={t("Informations légales", "معلومات قانونية")} title={title} lead={lead} />

      <section className="vz-section vz-section--tight">
        <div className="vz-container" style={{ maxWidth: 820 }}>
          <div className="vz-alert vz-alert--info" style={{ marginBottom: 24 }}>
            {t(
              "Texte provisoire : à faire relire par un juriste avant publication publique.",
              "نص مؤقت: يجب مراجعته من قبل قانوني قبل النشر العام."
            )}
          </div>

          {sections.map((section) => (
            <article key={section.heading} className="vz-card" style={{ marginBottom: 14 }}>
              <h2 className="vz-h3">{section.heading}</h2>
              <div className="vz-muted" style={{ lineHeight: 1.9 }}>
                {section.body}
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
