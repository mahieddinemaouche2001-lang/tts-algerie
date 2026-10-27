import { NextResponse, type NextRequest } from "next/server";
import { isMissingTable, nextDemoStatus, type JobStatus } from "@/lib/jobs";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { verifySupabaseUser } from "@/lib/supabase-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function fail(error: string, status: number) {
  return NextResponse.json(
    { error },
    { status, headers: { "Cache-Control": "no-store" } }
  );
}

/**
 * Demonstration only: advances a demo job by one state.
 * This is an explicit user action, never a fake background progress.
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifySupabaseUser(request.headers.get("authorization"));
    if (!user) return fail("UNAUTHORIZED", 401);

    const { id } = await context.params;
    if (!UUID.test(id)) return fail("INVALID_ID", 400);

    const db = createSupabaseAdmin();

    const { data: job, error } = await db
      .from("generation_jobs")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      if (isMissingTable(error)) return fail("JOBS_TABLE_MISSING", 503);
      return fail("JOB_UNAVAILABLE", 503);
    }

    if (!job) return fail("NOT_FOUND", 404);
    if (job.mode !== "demo") return fail("NOT_A_DEMO_JOB", 409);

    const next = nextDemoStatus(job.status as JobStatus);
    if (!next) return fail("JOB_ALREADY_FINAL", 409);

    const patch: Record<string, unknown> = {
      status: next,
      attempts: (job.attempts ?? 0) + 1,
    };
    if (next === "completed") patch.completed_at = new Date().toISOString();

    const { data: updated, error: updateError } = await db
      .from("generation_jobs")
      .update(patch)
      .eq("id", id)
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (updateError) return fail("JOB_UPDATE_FAILED", 503);

    return NextResponse.json(
      { job: updated },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return fail("SERVER_ERROR", 500);
  }
}
