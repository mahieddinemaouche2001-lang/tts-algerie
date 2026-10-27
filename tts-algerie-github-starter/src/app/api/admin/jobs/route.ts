import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { isMissingTable } from "@/lib/jobs";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) return guard.error;

    const db = createSupabaseAdmin();
    const { data, error } = await db
      .from("generation_jobs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      if (isMissingTable(error)) {
        return NextResponse.json(
          { error: "JOBS_TABLE_MISSING" },
          { status: 503, headers: { "Cache-Control": "no-store" } }
        );
      }
      return NextResponse.json({ error: "JOBS_UNAVAILABLE" }, { status: 503 });
    }

    return NextResponse.json(
      { jobs: data ?? [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
