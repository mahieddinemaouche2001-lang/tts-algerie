"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useLocale } from "@/components/locale-provider";
import { getBrowserClient } from "@/lib/supabase-browser";

type Generation = {
  id: string;
  text_input: string;
  language: string;
  status: string;
  audio_path: string | null;
  created_at: string;
};

export default function AppHomePage() {
  const { t } = useLocale();
  const { user, isAnonymous } = useAuth();
  const [items, setItems] = useState<Generation[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const supabase = getBrowserClient();
    if (!supabase) {
      setState("error");
      return;
    }

    let active = true;

    void supabase
      .from("generations")
      .select("id,text_input,language,status,audio_path,created_at")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setState("error");
          return;
        }
        setItems((data as Generation[]) ?? []);
        setState("ready");
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <h1 className="vz-page-title">
        {t("Bonjour", "مرحباً")}
        {user?.email ? `, ${user.email.split("@")[0]}` : ""}
      </h1>
      <p className="vz-page-sub">
        {isAnonymous
          ? t(
              "Vous utilisez une session invitée. Créez un compte pour conserver votre historique.",
              "أنت تستخدم جلسة زائر. أنشئ حساباً للحفاظ على سجلك."
            )
          : t(
              "Voici l'état de votre espace VOIX DZ.",
              "هذه حالة مساحتك في VOIX DZ."
            )}
      </p>

      <div className="vz-grid vz-grid--3" style={{ marginBottom: 22 }}>
        <div className="vz-kpi">
          <strong>{state === "ready" ? items.length : "—"}</strong>
          <span>{t("Générations récentes", "عمليات حديثة")}</span>
        </div>
        <div className="vz-kpi">
          <strong>2</strong>
          <span>{t("Essais gratuits par compte", "محاولتان مجانيتان لكل حساب")}</span>
        </div>
        <div className="vz-kpi">
          <strong style={{ fontSize: 18 }}>
            {t("Désactivé", "معطّل")}
          </strong>
          <span>{t("Moteur vocal", "محرك الصوت")}</span>
        </div>
      </div>

      <div className="vz-card" style={{ marginBottom: 22 }}>
        <h2 className="vz-h3">{t("Démarrer une génération", "ابدأ عملية توليد")}</h2>
        <p className="vz-muted" style={{ lineHeight: 1.8 }}>
          {t(
            "Le studio prépare votre texte et vérifie vos essais. La génération réelle sera activée après validation du fournisseur.",
            "يجهّز الاستوديو نصك ويتحقق من محاولاتك. سيُفعّل التوليد الفعلي بعد اعتماد المزوّد."
          )}
        </p>
        <Link href="/app/studio" className="vz-btn vz-btn--primary" style={{ marginTop: 12 }}>
          {t("Ouvrir le studio", "افتح الاستوديو")}
        </Link>
      </div>

      <h2 className="vz-h3">{t("Dernières générations", "أحدث عمليات التوليد")}</h2>

      {state === "loading" ? (
        <p className="vz-muted">{t("Chargement…", "جارٍ التحميل…")}</p>
      ) : state === "error" ? (
        <div className="vz-alert">
          {t(
            "Impossible de lire l'historique pour le moment. Vérifiez la configuration Supabase ou réessayez.",
            "تعذّرت قراءة السجل حالياً. تحقق من إعداد Supabase أو أعد المحاولة."
          )}
        </div>
      ) : items.length === 0 ? (
        <div className="vz-card">
          <p className="vz-muted" style={{ margin: 0 }}>
            {t(
              "Aucune génération pour l'instant. Votre première demande apparaîtra ici.",
              "لا توجد عمليات توليد بعد. سيظهر طلبك الأول هنا."
            )}
          </p>
        </div>
      ) : (
        <div className="vz-list">
          {items.map((item) => (
            <article key={item.id} className="vz-list__item">
              <strong>{item.text_input.slice(0, 140)}</strong>
              <span className="vz-list__meta">
                {new Date(item.created_at).toLocaleString()} · {item.language.toUpperCase()} ·{" "}
                {item.status}
              </span>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
