"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useLocale } from "@/components/locale-provider";

type ApiResponse = {
  error?: string;
  trial_consumed?: boolean;
  audioBase64?: string;
  mimeType?: string;
};

const MAX_TEXT = 500;

export default function StudioPage() {
  const { t, lang } = useLocale();
  const { session } = useAuth();

  const [text, setText] = useState("");
  const [speed, setSpeed] = useState("normal");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [statusTone, setStatusTone] = useState<"info" | "error" | "ok">("info");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [queueLoading, setQueueLoading] = useState(false);
  const [queuedId, setQueuedId] = useState<string | null>(null);

  const words = text.trim() ? text.trim().split(/\s+/u).length : 0;
  const tooLong = text.length > MAX_TEXT;

  function report(message: string, tone: "info" | "error" | "ok" = "info") {
    setStatus(message);
    setStatusTone(tone);
  }

  async function generate() {
    if (loading) return;

    const value = text.trim();

    if (!value) {
      report(t("Saisissez un texte.", "أدخل نصاً."), "error");
      return;
    }

    if (value.length > MAX_TEXT) {
      report(
        t(
          `Le texte dépasse la limite de ${MAX_TEXT} caractères.`,
          `النص يتجاوز الحد الأقصى ${MAX_TEXT} حرفاً.`
        ),
        "error"
      );
      return;
    }

    if (!session?.access_token) {
      report(
        t("Session expirée. Reconnectez-vous.", "انتهت الجلسة. أعد تسجيل الدخول."),
        "error"
      );
      return;
    }

    setLoading(true);
    setAudioUrl(null);
    setStatus("");

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ text: value }),
        cache: "no-store",
      });

      const result: ApiResponse = await response
        .json()
        .catch(() => ({ error: "INVALID_RESPONSE" }));

      if (response.status === 503 && result.error === "TTS_NOT_READY") {
        report(
          t(
            "Le moteur vocal est volontairement désactivé. Votre demande n'a pas été envoyée au fournisseur et aucun essai n'a été consommé.",
            "محرك الصوت معطّل عمداً. لم يُرسل طلبك إلى المزوّد ولم تُستهلك أي محاولة."
          ),
          "info"
        );
        return;
      }

      if (response.status === 429 || result.error === "RATE_LIMIT_EXCEEDED") {
        report(
          t("Trop de demandes. Réessayez dans une minute.", "طلبات كثيرة. أعد المحاولة بعد دقيقة."),
          "error"
        );
        return;
      }

      if (response.status === 403 && result.error === "FREE_TRIAL_LIMIT_REACHED") {
        report(
          t(
            "Vos deux essais gratuits sont épuisés ou réservés.",
            "محاولتاك المجانيتان مستنفدتان أو محجوزتان."
          ),
          "error"
        );
        return;
      }

      if (response.status === 401) {
        report(t("Session invalide. Reconnectez-vous.", "جلسة غير صالحة. أعد تسجيل الدخول."), "error");
        return;
      }

      if (response.status === 400 || response.status === 413) {
        report(t("Texte invalide ou trop long.", "نص غير صالح أو طويل جداً."), "error");
        return;
      }

      if (
        response.ok &&
        typeof result.audioBase64 === "string" &&
        result.mimeType === "audio/wav"
      ) {
        const binary = atob(result.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index += 1) {
          bytes[index] = binary.charCodeAt(index);
        }
        const url = URL.createObjectURL(new Blob([bytes], { type: "audio/wav" }));
        setAudioUrl(url);
        report(
          t(
            "Audio généré. Un essai gratuit consommé.",
            "تم توليد الصوت. استُهلكت محاولة واحدة."
          ),
          "ok"
        );
        return;
      }

      if (result.error === "GLOBAL_DAILY_LIMIT") {
        report(
          t("Plafond global quotidien atteint.", "تم بلوغ الحد اليومي الإجمالي."),
          "error"
        );
        return;
      }

      report(
        t("Réponse inattendue du serveur. Réessayez.", "استجابة غير متوقعة من الخادم. أعد المحاولة."),
        "error"
      );
    } catch {
      report(t("Connexion au serveur impossible.", "تعذّر الاتصال بالخادم."), "error");
    } finally {
      setLoading(false);
    }
  }

  async function queueJob() {
    if (queueLoading) return;

    const value = text.trim();

    if (!value || value.length > MAX_TEXT) {
      report(t("Saisissez un texte valide.", "أدخل نصاً صالحاً."), "error");
      return;
    }

    if (!session?.access_token) {
      report(t("Session expirée. Reconnectez-vous.", "انتهت الجلسة. أعد تسجيل الدخول."), "error");
      return;
    }

    setQueueLoading(true);
    setQueuedId(null);

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          text: value,
          language: lang,
          idempotencyKey: crypto.randomUUID(),
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        job?: { id: string };
        error?: string;
      };

      if (response.status === 503 && data.error === "JOBS_TABLE_MISSING") {
        report(
          t(
            "La file d'attente n'est pas encore activée : la migration 0002 doit être validée puis appliquée.",
            "قائمة الانتظار غير مفعّلة بعد: يجب اعتماد الترحيل 0002 ثم تطبيقه."
          ),
          "info"
        );
        return;
      }

      if (!response.ok || !data.job) {
        report(t("Mise en file impossible.", "تعذّرت الإضافة إلى القائمة."), "error");
        return;
      }

      setQueuedId(data.job.id);
      report(
        t(
          "Demande placée en file (mode démo). Aucun audio ne sera généré.",
          "أُضيف الطلب إلى القائمة (وضع عرض). لن يُولّد أي صوت."
        ),
        "ok"
      );
    } catch {
      report(t("Connexion au serveur impossible.", "تعذّر الاتصال بالخادم."), "error");
    } finally {
      setQueueLoading(false);
    }
  }

  return (
    <div>
      <h1 className="vz-page-title">{t("Studio", "الاستوديو")}</h1>
      <p className="vz-page-sub">
        {t(
          "Écrivez, réglez, lancez. Le statut affiché est toujours réel.",
          "اكتب، اضبط، أطلق. الحالة المعروضة حقيقية دائماً."
        )}
      </p>

      <div className="vz-card">
        <div className="vz-field">
          <label className="vz-label" htmlFor="script">
            {t("Votre texte", "نصّك")}
          </label>
          <textarea
            id="script"
            className="vz-textarea"
            value={text}
            maxLength={MAX_TEXT}
            onChange={(event) => setText(event.target.value)}
            placeholder={t(
              "Exemple : Découvrez notre nouvelle collection, disponible dès aujourd'hui.",
              "مثال: اكتشف مجموعتنا الجديدة، متاحة ابتداءً من اليوم."
            )}
          />
          <span className="vz-help" style={tooLong ? { color: "var(--vz-red)" } : undefined}>
            {words} {t("mot(s)", "كلمة")} · {text.length}/{MAX_TEXT}
          </span>
        </div>

        <div className="vz-grid vz-grid--2" style={{ gap: 16 }}>
          <div className="vz-field">
            <label className="vz-label" htmlFor="voice">
              {t("Voix", "الصوت")}
            </label>
            <select id="voice" className="vz-select" disabled>
              <option>{t("Aucune voix validée pour l'instant", "لا يوجد صوت معتمد بعد")}</option>
            </select>
          </div>

          <div className="vz-field">
            <label className="vz-label" htmlFor="speed">
              {t("Vitesse", "السرعة")}
            </label>
            <select
              id="speed"
              className="vz-select"
              value={speed}
              onChange={(event) => setSpeed(event.target.value)}
            >
              <option value="slow">0.85×</option>
              <option value="normal">1×</option>
              <option value="fast">1.15×</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          className="vz-btn vz-btn--primary vz-btn--block"
          onClick={generate}
          disabled={loading || !text.trim() || tooLong}
        >
          {loading
            ? t("Vérification…", "جارٍ التحقق…")
            : t("Générer la voix", "توليد الصوت")}
        </button>

        {status ? (
          <div
            className={`vz-alert${
              statusTone === "ok" ? " vz-alert--ok" : statusTone === "info" ? " vz-alert--info" : ""
            }`}
            role="status"
            style={{ marginTop: 16 }}
          >
            {status}
          </div>
        ) : null}

        {audioUrl ? (
          <div style={{ marginTop: 16 }}>
            <audio controls src={audioUrl} className="vz-audio" />
            <a
              href={audioUrl}
              download="voix-dz.wav"
              className="vz-btn vz-btn--ghost vz-btn--sm"
              style={{ marginTop: 10 }}
            >
              {t("Télécharger le WAV", "تحميل WAV")}
            </a>
          </div>
        ) : null}
      </div>

      <div className="vz-card" style={{ marginTop: 18 }}>
        <h2 className="vz-h3">
          {t("File d'attente asynchrone", "قائمة الانتظار غير المتزامنة")}
        </h2>
        <p className="vz-muted" style={{ lineHeight: 1.8 }}>
          {t(
            "Tant que le fournisseur n'est pas activé, vous pouvez enregistrer une demande de démonstration. Elle suit les états réels du système, sans produire de fichier audio.",
            "ما دام المزوّد غير مفعّل، يمكنك تسجيل طلب عرض. يتبع حالات النظام الحقيقية دون إنتاج ملف صوتي."
          )}
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          <button
            type="button"
            className="vz-btn vz-btn--ghost vz-btn--sm"
            onClick={queueJob}
            disabled={queueLoading || !text.trim() || tooLong}
          >
            {queueLoading
              ? t("Mise en file…", "جارٍ الإضافة…")
              : t("Mettre en file (démo)", "أضف إلى القائمة (عرض)")}
          </button>

          <Link href="/app/jobs" className="vz-btn vz-btn--ghost vz-btn--sm">
            {t("Voir la file", "عرض القائمة")}
          </Link>
        </div>

        {queuedId ? (
          <p className="vz-help" style={{ marginTop: 10 }}>
            {t("Référence : ", "المرجع: ")}
            {queuedId.slice(0, 8)}…
          </p>
        ) : null}
      </div>

      <div className="vz-alert vz-alert--info" style={{ marginTop: 18 }}>
        {lang === "ar"
          ? "تنبيه: التوليد الفعلي معطّل حتى اعتماد المزوّد والميزانية. هذه الشاشة تتحقق من الجلسة والحصص فقط."
          : "Le moteur réel est désactivé jusqu'à validation du fournisseur et du budget. Cet écran vérifie seulement la session et les quotas."}
      </div>
    </div>
  );
}
