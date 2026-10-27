"use client";

import { useEffect, useState } from "react";
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

export default function HistoriquePage() {
  const { t } = useLocale();
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
      .limit(100)
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
      <h1 className="vz-page-title">{t("Historique", "السجل")}</h1>
      <p className="vz-page-sub">
        {t(
          "Toutes vos demandes, avec leur état réel. Aucun fichier n'est inventé.",
          "كل طلباتك، مع حالتها الحقيقية. لا يُنشأ أي ملف وهمي."
        )}
      </p>

      {state === "loading" ? (
        <p className="vz-muted">{t("Chargement…", "جارٍ التحميل…")}</p>
      ) : state === "error" ? (
        <div className="vz-alert">
          {t(
            "Historique indisponible. Vérifiez la configuration Supabase et les politiques RLS.",
            "السجل غير متاح. تحقق من إعداد Supabase وسياسات RLS."
          )}
        </div>
      ) : items.length === 0 ? (
        <div className="vz-card">
          <p className="vz-muted" style={{ margin: 0 }}>
            {t(
              "Aucune demande enregistrée. Les générations apparaîtront ici une fois le moteur activé.",
              "لا توجد طلبات مسجلة. ستظهر عمليات التوليد هنا بعد تفعيل المحرك."
            )}
          </p>
        </div>
      ) : (
        <div className="vz-table-wrap">
          <table className="vz-table">
            <thead>
              <tr>
                <th>{t("Texte", "النص")}</th>
                <th>{t("Langue", "اللغة")}</th>
                <th>{t("État", "الحالة")}</th>
                <th>{t("Date", "التاريخ")}</th>
                <th>{t("Fichier", "الملف")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ maxWidth: 320 }}>{item.text_input.slice(0, 160)}</td>
                  <td>{item.language.toUpperCase()}</td>
                  <td>
                    <span
                      className={`vz-badge${
                        item.status === "failed"
                          ? " vz-badge--warn"
                          : item.status === "pending"
                            ? " vz-badge--soon"
                            : ""
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td>
                    {item.audio_path ? (
                      item.audio_path.startsWith("http") ? (
                        <a href={item.audio_path} target="_blank" rel="noreferrer">
                          {t("Ouvrir", "فتح")}
                        </a>
                      ) : (
                        <span className="vz-muted">
                          {t("Stockage privé", "تخزين خاص")}
                        </span>
                      )
                    ) : (
                      <span className="vz-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
