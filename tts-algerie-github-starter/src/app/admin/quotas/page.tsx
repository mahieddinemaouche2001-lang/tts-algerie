"use client";

import { useEffect, useState } from "react";
import { AdminGuard, AdminShell } from "@/components/admin-shell";
import { useLocale } from "@/components/locale-provider";

type Stats = {
  profiles: number;
  generations: number;
  trialsUsed: number;
  activeReservations: number;
  geminiEnabled: boolean;
};

function QuotaCards({ token }: { token: string }) {
  const { t } = useLocale();
  const [stats, setStats] = useState<Stats | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let active = true;
    void fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then(async (response) => {
        if (!active) return;
        if (!response.ok) {
          setState("error");
          return;
        }
        setStats((await response.json()) as Stats);
        setState("ready");
      })
      .catch(() => active && setState("error"));
    return () => {
      active = false;
    };
  }, [token]);

  if (state === "loading") return <p className="vz-muted">{t("Chargement…", "جارٍ التحميل…")}</p>;
  if (state === "error")
    return <div className="vz-alert">{t("Statistiques indisponibles.", "الإحصاءات غير متاحة.")}</div>;
  if (!stats) return null;

  return (
    <>
      <div className="vz-grid vz-grid--3">
        <div className="vz-kpi">
          <strong>{stats.trialsUsed}</strong>
          <span>{t("Essais consommés", "المحاولات المستهلكة")}</span>
        </div>
        <div className="vz-kpi">
          <strong>{stats.activeReservations}</strong>
          <span>{t("Réservations actives", "الحجوزات النشطة")}</span>
        </div>
        <div className="vz-kpi">
          <strong style={{ fontSize: 18 }}>
            {stats.geminiEnabled ? t("Actif", "مفعّل") : t("Désactivé", "معطّل")}
          </strong>
          <span>{t("Moteur", "المحرك")}</span>
        </div>
      </div>

      <div className="vz-alert vz-alert--info" style={{ marginTop: 18 }}>
        {t(
          "Le détail par utilisateur nécessite un schéma de quotas vérifié. Aucun chiffre n'est inventé sur cette page.",
          "التفصيل حسب المستخدم يتطلب مخطط حصص متحققاً منه. لا يُخترع أي رقم في هذه الصفحة."
        )}
      </div>
    </>
  );
}

export default function AdminQuotasPage() {
  const { t } = useLocale();
  return (
    <AdminGuard>
      {(token) => (
        <AdminShell
          title={t("Quotas", "الحصص")}
          subtitle={t("Consommation globale des essais.", "الاستهلاك الإجمالي للمحاولات.")}
        >
          <QuotaCards token={token} />
        </AdminShell>
      )}
    </AdminGuard>
  );
}
