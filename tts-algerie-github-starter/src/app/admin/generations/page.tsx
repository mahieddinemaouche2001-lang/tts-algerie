"use client";

import { useEffect, useState } from "react";
import { AdminGuard, AdminShell } from "@/components/admin-shell";
import { useLocale } from "@/components/locale-provider";

type Row = {
  id: string;
  user_id: string;
  text_input: string;
  language: string;
  status: string;
  audio_path: string | null;
  created_at: string;
};

function GenerationsTable({ token }: { token: string }) {
  const { t } = useLocale();
  const [rows, setRows] = useState<Row[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let active = true;

    void fetch("/api/admin/generations", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then(async (response) => {
        if (!active) return;
        if (!response.ok) {
          setState("error");
          return;
        }
        const data = (await response.json()) as { items: Row[] };
        setRows(data.items ?? []);
        setState("ready");
      })
      .catch(() => active && setState("error"));

    return () => {
      active = false;
    };
  }, [token]);

  if (state === "loading") return <p className="vz-muted">{t("Chargement…", "جارٍ التحميل…")}</p>;
  if (state === "error")
    return (
      <div className="vz-alert">
        {t("Lecture impossible des générations.", "تعذّرت قراءة عمليات التوليد.")}
      </div>
    );
  if (rows.length === 0)
    return (
      <div className="vz-card">
        <p className="vz-muted" style={{ margin: 0 }}>
          {t("Aucune génération enregistrée.", "لا توجد عمليات توليد مسجلة.")}
        </p>
      </div>
    );

  return (
    <div className="vz-table-wrap">
      <table className="vz-table">
        <thead>
          <tr>
            <th>{t("Texte", "النص")}</th>
            <th>{t("Langue", "اللغة")}</th>
            <th>{t("État", "الحالة")}</th>
            <th>{t("Utilisateur", "المستخدم")}</th>
            <th>{t("Date", "التاريخ")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td style={{ maxWidth: 320 }}>{row.text_input.slice(0, 160)}</td>
              <td>{row.language.toUpperCase()}</td>
              <td>
                <span className={`vz-badge${row.status === "failed" ? " vz-badge--warn" : ""}`}>
                  {row.status}
                </span>
              </td>
              <td style={{ fontFamily: "monospace", fontSize: 12 }}>{row.user_id.slice(0, 8)}…</td>
              <td>{new Date(row.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminGenerationsPage() {
  const { t } = useLocale();

  return (
    <AdminGuard>
      {(token) => (
        <AdminShell
          title={t("Générations", "عمليات التوليد")}
          subtitle={t("100 dernières demandes, tous utilisateurs.", "آخر 100 طلب، لكل المستخدمين.")}
        >
          <GenerationsTable token={token} />
        </AdminShell>
      )}
    </AdminGuard>
  );
}
