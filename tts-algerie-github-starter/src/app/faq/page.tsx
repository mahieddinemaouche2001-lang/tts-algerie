"use client";

import Link from "next/link";
import { PageHero, PageShell } from "@/components/page-shell";
import { useLocale } from "@/components/locale-provider";

export default function FaqPage() {
  const { t } = useLocale();

  const items = [
    {
      q: t("La génération audio fonctionne-t-elle déjà ?", "هل توليد الصوت يعمل بالفعل؟"),
      a: t(
        "Non. Le moteur est volontairement désactivé. Le studio, les comptes et l'historique sont utilisables, mais aucune voix n'est produite tant que l'accès au fournisseur et le budget ne sont pas validés.",
        "لا. المحرك معطّل عمداً. الاستوديو والحسابات والسجل قابلة للاستخدام، لكن لا يُنتج أي صوت ما لم يُعتمد الوصول إلى المزوّد والميزانية."
      ),
    },
    {
      q: t("Pourquoi l'audio mettrait-il plusieurs minutes ?", "لماذا قد يستغرق الصوت عدة دقائق؟"),
      a: t(
        "Le mode Batch regroupe les demandes pour réduire le coût. En contrepartie, la réponse n'est pas instantanée. Vous suivez l'état depuis votre historique.",
        "يجمع وضع الدفعات الطلبات لتقليل التكلفة. مقابل ذلك، الاستجابة ليست فورية. تتابع الحالة من سجلك."
      ),
    },
    {
      q: t("Combien d'essais gratuits ?", "كم عدد المحاولات المجانية؟"),
      a: t(
        "Deux essais par compte, suivis côté serveur. Un essai échoué est restitué : il n'est consommé que si un fichier valide est produit.",
        "محاولتان لكل حساب، تُتابعان على الخادم. المحاولة الفاشلة تُعاد: لا تُستهلك إلا إذا أُنتج ملف صالح."
      ),
    },
    {
      q: t("Faut-il un compte ?", "هل أحتاج إلى حساب؟"),
      a: t(
        "Vous pouvez démarrer une session invitée protégée par hCaptcha. Un compte permanent conserve votre historique et vos essais.",
        "يمكنك بدء جلسة زائر محمية بـ hCaptcha. الحساب الدائم يحفظ سجلك ومحاولاتك."
      ),
    },
    {
      q: t("Mes textes sont-ils conservés ?", "هل تُحفظ نصوصي؟"),
      a: t(
        "Les générations sont rattachées à votre compte et visibles par vous seul. La durée de conservation sera précisée avant l'activation du moteur.",
        "عمليات التوليد مرتبطة بحسابك ومرئية لك وحدك. ستُحدد مدة الحفظ قبل تفعيل المحرك."
      ),
    },
    {
      q: t("Proposez-vous le clonage vocal ?", "هل تقدمون استنساخ الصوت؟"),
      a: t(
        "Non. Aucun clonage, aucune voix de personne réelle sans droit et consentement vérifiables.",
        "لا. لا استنساخ، ولا صوت شخص حقيقي دون حق وموافقة قابلين للتحقق."
      ),
    },
    {
      q: t("Le paiement est-il ouvert ?", "هل الدفع متاح؟"),
      a: t(
        "Non. Aucun paiement n'est encaissé. Les tarifs affichés décrivent une structure prévue.",
        "لا. لا يتم تحصيل أي دفعة. الأسعار المعروضة تصف هيكلاً مخططاً."
      ),
    },
  ];

  return (
    <PageShell>
      <PageHero
        eyebrow="FAQ"
        title={t("Questions fréquentes", "الأسئلة الشائعة")}
        lead={t(
          "Des réponses courtes et vérifiables. Si une information manque, elle est signalée comme telle plutôt qu'inventée.",
          "إجابات قصيرة وقابلة للتحقق. إذا كانت معلومة ناقصة، يُشار إلى ذلك بدلاً من اختراعها."
        )}
      />

      <section className="vz-section vz-section--tight">
        <div className="vz-container" style={{ maxWidth: 860 }}>
          {items.map((item) => (
            <details
              key={item.q}
              className="vz-card"
              style={{ padding: "18px 22px", marginBottom: 12 }}
            >
              <summary style={{ cursor: "pointer", fontWeight: 800, fontSize: 16 }}>
                {item.q}
              </summary>
              <p style={{ marginTop: 12, lineHeight: 1.8 }}>{item.a}</p>
            </details>
          ))}

          <p className="vz-muted" style={{ marginTop: 24 }}>
            {t("Une autre question ?", "سؤال آخر؟")}{" "}
            <Link href="/contact" style={{ color: "var(--vz-green)", fontWeight: 700 }}>
              {t("Écrivez-nous", "اكتب لنا")}
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
