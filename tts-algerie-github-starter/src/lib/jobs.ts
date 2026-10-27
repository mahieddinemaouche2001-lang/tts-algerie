import "server-only";

export type JobStatus = "queued" | "running" | "completed" | "failed" | "canceled";
export type JobMode = "demo" | "live";

export type JobRow = {
  id: string;
  user_id: string;
  generation_id: string | null;
  provider: string;
  provider_job_id: string | null;
  idempotency_key: string;
  status: JobStatus;
  mode: JobMode;
  text_input: string;
  language: string;
  attempts: number;
  error_code: string | null;
  audio_path: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
};

type DbError = { code?: string; message?: string } | null;

/**
 * Detects "table missing" without hiding other database errors.
 * PostgREST returns 42P01 (undefined_table) or PGRST205 when the schema
 * cache does not know the table yet.
 */
export function isMissingTable(error: DbError): boolean {
  if (!error) return false;
  if (error.code === "42P01" || error.code === "PGRST205") return true;
  return /does not exist|could not find the table|schema cache/i.test(
    error.message ?? ""
  );
}

export function nextDemoStatus(status: JobStatus): JobStatus | null {
  if (status === "queued") return "running";
  if (status === "running") return "completed";
  return null;
}
