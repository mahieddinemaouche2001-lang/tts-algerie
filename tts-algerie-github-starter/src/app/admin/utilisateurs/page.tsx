"use client";

import { useEffect, useState } from "react";
import { AdminGuard, AdminShell } from "@/components/admin-shell";
import { useLocale } from "@/components/locale-provider";

type UserRow = {
  id: string;
  email: string | null;
  displayName: string | null;
  anonymous: boolean;
  createdAt: string;
  lastSignInAt: string | null;
};

function UsersTable({ token }: { token: string }) {
  const { t } = useLocale();
  const [rows, setRows] = useState<UserRow[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let active = true;

    void fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then(async (response) => {
        if (!active) return;
        if (!response.ok) {
          setState("error");
          return;
        }
        const data = (await response.json()) as { users: UserRow[] };
        setRows(data.users ?? []);
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
        {t(
          "Liste indisponible. Vérifiez SUPABASE_SECRET_KEY et les droits du service.",
          "القائمة غير متاحة. تحقق من SUPABASE_SECRET_KEY وصلاحيات الخدمة."
        )}
      </div>
    );

  if (rows.length === 0)
    return (
      <div className="vz-card">
        <p className="vz-muted" style={{ margin: 0 }}>
          {t("Aucun utilisateur pour l'instant.", "لا يوجد مستخدمون حالياً.")}
        </p>
      </div>
    );

  return (
    <div className="vz-table-wrap">
      <table className="vz-table">
        <thead>
          <tr>
            <th>{t("E-mail", "البريد")}</th>
            <th>{t("Nom", "الاسم")}</th>
            <th>{t("Type", "النوع")}</th>
            <th>{t("Inscrit le", "تاريخ التسجيل")}</th>
            <th>{t("Dernière connexion", "آخر دخول")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.email ?? "—"}</td>
              <td>{row.displayName ?? "—"}</td>
              <td>
                <span className={`vz-badge${row.anonymous ? " vz-badge--soon" : ""}`}>
                  {row.anonymous ? t("Invité", "زائر") : t("Compte", "حساب")}
                </span>
              </td>
              <td>{new Date(row.createdAt).toLocaleDateString()}</td>
              <td>{row.lastSignInAt ? new Date(row.lastSignInAt).toLocaleDateString() : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminUsersPage() {
  const { t } = useLocale();

  return (
    <AdminGuard>
      {(token) => (
        <AdminShell
          title={t("Utilisateurs", "المستخدمون")}
          subtitle={t(
            "50 derniers comptes lus via l'API d'administration Supabase.",
            "آخر 50 حساباً مقروءة عبر واجهة إدارة Supabase."
          )}
        >
          <UsersTable token={token} />
        </AdminShell>
      )}
    </AdminGuard>
  );
}
