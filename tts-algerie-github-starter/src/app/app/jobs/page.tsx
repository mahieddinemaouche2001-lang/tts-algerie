"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useLocale } from "@/components/locale-provider";

type Job = {
  id: string;
  status: "queued" | "running" | "completed" | "failed" | "canceled";
  mode: "demo" | "live";
  language: string;
  text_input: string;
  attempts: number;
  created_at: string;
  completed_at: string | null;
};

export default function JobsPage() {
  const { t } = useLocale();
  const { session } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "missing" | "error">("loading");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!session?.access_token) return;

    const response = await fetch("/api/jobs", {
      headers: { Authorization: `Bearer ${session.access_token}` },
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
  }, [session]);

  useEffect(() => {
    void load();
  }, [load]);

  async function advance(id: string) {
    if (!session?.access_token || busy) return;
    setBusy(id);
    await fetch(`/api/jobs/${id}/advance`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session.access_token}` },
    }).catch(() => null);
    setBusy(null);
    await load();
  }

  function statusLabel(status: Job["status"]) {
    switch (status) {
      case "queued":
        return t("En attente", "في الانتظار");
      case "running":
        return t("En cours", "قيد التنفيذ");
      case "completed":
        return t("Terminé (démo)", "منتهٍ (عرض)");
      case "failed":
        return t("Échec", "فشل");
      default:
        return t("Annulé", "ملغى");
    }
  }

  return (
    <div>
      <h1 className="vz-page-title">{t("File d'attente", "قائمة الانتظار")}</h1>
      <p className="vz-page-sub">
        {t(
          "Suivi des demandes asynchrones. En mode démonstration, aucun audio n'est produit : les états avancent uniquement quand vous cliquez.",
          "متابعة الطلبات غير المتزامنة. في وضع العرض لا يُنتج أي صوت: تتقدم الحالات فقط عند النقر."
        )}
      </p>

      <div className="vz-card" style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/app/studio" className="vz-btn vz-btn--primary vz-btn--sm">
            {t("Nouvelle demande", "طلب جديد")}
          </Link>
          <button type="button" className="vz-btn vz-btn--ghost vz-btn--sm" onClick={() => void load()}>
            {t("Rafraîchir", "تحديث")}
          </button>
        </div>
      </div>

      {state === "loading" ? (
        <p className="vz-muted">{t("Chargement…", "جارٍ التحميل…")}</p>
      ) : state === "missing" ? (
        <div className="vz-alert">
          <strong>{t("Table des jobs absente.", "جدول الوظائف غير موجود.")}</strong>
          <p style={{ margin: "10px 0 0" }}>
            {t(
              "La migration supabase/migrations/0002_generation_jobs.sql est proposée mais n'est pas appliquée. Elle doit être relue et validée avant exécution sur la base réelle.",
              "ترحيل supabase/migrations/0002_generation_jobs.sql مقترح لكنه غير مطبّق. يجب مراجعته واعتماده قبل تنفيذه على قاعدة البيانات الحقيقية."
            )}
          </p>
        </div>
      ) : state === "error" ? (
        <div className="vz-alert">
          {t("File d'attente indisponible.", "قائمة الانتظار غير متاحة.")}
        </div>
      ) : jobs.length === 0 ? (
        <div className="vz-card">
          <p className="vz-muted" style={{ margin: 0 }}>
            {t(
              "Aucune demande en file. Créez-en une depuis le studio.",
              "لا توجد طلبات في القائمة. أنشئ واحداً من الاستوديو."
            )}
          </p>
        </div>
      ) : (
        <div className="vz-list">
          {jobs.map((job) => (
            <article key={job.id} className="vz-list__item">
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <span
                  className={`vz-badge${
                    job.status === "failed"
                      ? " vz-badge--warn"
                      : job.status === "queued" || job.status === "running"
                        ? " vz-badge--soon"
                        : ""
                  }`}
                >
                  {statusLabel(job.status)}
                </span>
                <span className="vz-badge vz-badge--soon">
                  {job.mode === "demo" ? t("Démo", "عرض") : t("Réel", "حقيقي")}
                </span>
                <span className="vz-list__meta">
                  {job.language.toUpperCase()} · {new Date(job.created_at).toLocaleString()}
                </span>
              </div>

              <strong>{job.text_input.slice(0, 160)}</strong>

              {job.mode === "demo" && (job.status === "queued" || job.status === "running") ? (
                <button
                  type="button"
                  className="vz-btn vz-btn--ghost vz-btn--sm"
                  onClick={() => void advance(job.id)}
                  disabled={busy === job.id}
                >
                  {busy === job.id
                    ? t("Mise à jour…", "جارٍ التحديث…")
                    : t("Avancer l'état (démo)", "تقديم الحالة (عرض)")}
                </button>
              ) : null}

              {job.status === "completed" && job.mode === "demo" ? (
                <span className="vz-list__meta">
                  {t(
                    "Démo terminée : aucun fichier audio n'a été généré.",
                    "انتهى العرض: لم يُولّد أي ملف صوتي."
                  )}
                </span>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
