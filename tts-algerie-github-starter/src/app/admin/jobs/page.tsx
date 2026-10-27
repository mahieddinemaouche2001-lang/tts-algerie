"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminGuard, AdminShell } from "@/components/admin-shell";
import { useLocale } from "@/components/locale-provider";

type Job = {
  id: string;
  user_id: string;
  status: "queued" | "running" | "completed" | "failed" | "canceled";
  mode: "demo" | "live";
  language: string;
  text_input: string;
  attempts: number;
  provider_job_id: string | null;
  created_at: string;
  completed_at: string | null;
};

function JobsTable({ token }: { token: string }) {
  const { t } = useLocale();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "missing" | "error">("loading");

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/jobs", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }).catch(() => null);

    if (!response) {
      setState("error");
      return;
    }

    if (response.status === 503) {
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      setState(body.error === "JOBS_TABLE_MISSING" ? "missing" : "error");
      return;
    }

    if (!response.ok) {
      setState("error");
      return;
    }

    const data = (await response.json()) as { jobs: Job[] };
    setJobs(data.jobs ?? []);
    setState("ready");
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  if (state === "loading") return <p className="vz-muted">{t("Chargement…", "جارٍ التحميل…")}</p>;

  if (state === "missing")
    return (
      <div className="vz-alert">
        <strong>{t("Table generation_jobs absente.", "جدول generation_jobs غير موجود.")}</strong>
        <p style={{ margin: "10px 0 0" }}>
          {t(
            "La migration proposée supabase/migrations/0002_generation_jobs.sql n'est pas appliquée. Aucune donnée n'est inventée : cette page restera vide jusqu'à validation et exécution.",
            "ترحيل supabase/migrations/0002_generation_jobs.sql غير مطبّق. لا تُخترع أي بيانات: ستبقى هذه الصفحة فارغة حتى الاعتماد والتنفيذ."
          )}
        </p>
      </div>
    );

  if (state === "error")
    return (
      <div className="vz-alert">
        {t("Supervision des jobs indisponible.", "متابعة الوظائف غير متاحة.")}
      </div>
    );

  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <button type="button" className="vz-btn vz-btn--ghost vz-btn--sm" onClick={() => void load()}>
          {t("Rafraîchir", "تحديث")}
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="vz-card">
          <p className="vz-muted" style={{ margin: 0 }}>
            {t("Aucun job enregistré.", "لا توجد وظائف مسجلة.")}
          </p>
        </div>
      ) : (
        <div className="vz-table-wrap">
          <table className="vz-table">
            <thead>
              <tr>
                <th>{t("Date", "التاريخ")}</th>
                <th>{t("Utilisateur", "المستخدم")}</th>
                <th>{t("Langue", "اللغة")}</th>
                <th>{t("Mode", "الوضع")}</th>
                <th>{t("État", "الحالة")}</th>
                <th>{t("Tentatives", "المحاولات")}</th>
                <th>{t("Fournisseur", "المزوّد")}</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{new Date(job.created_at).toLocaleString()}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>
                    {job.user_id.slice(0, 8)}…
                  </td>
                  <td>{job.language.toUpperCase()}</td>
                  <td>
                    <span className={`vz-badge${job.mode === "demo" ? " vz-badge--soon" : ""}`}>
                      {job.mode}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`vz-badge${
                        job.status === "failed"
                          ? " vz-badge--warn"
                          : job.status === "queued" || job.status === "running"
                            ? " vz-badge--soon"
                            : ""
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td>{job.attempts}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>
                    {job.provider_job_id ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default function AdminJobsPage() {
  const { t } = useLocale();

  return (
    <AdminGuard>
      {(token) => (
        <AdminShell
          title={t("Jobs Batch", "وظائف الدفعات")}
          subtitle={t(
            "100 derniers jobs, lus en base. Aucune progression simulée n'est affichée ici.",
            "آخر 100 وظيفة، مقروءة من قاعدة البيانات. لا يُعرض أي تقدم محاكى هنا."
          )}
        >
          <JobsTable token={token} />
        </AdminShell>
      )}
    </AdminGuard>
  );
}
