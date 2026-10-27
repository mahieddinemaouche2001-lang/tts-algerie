import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { isMissingTable } from "@/lib/jobs";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { verifySupabaseUser } from "@/lib/supabase-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TEXT = 500;
const MAX_KEY_LENGTH = 120;
const LANGUAGES = new Set(["ar", "fr", "dz"]);

function fail(error: string, status: number) {
  return NextResponse.json(
    { error },
    { status, headers: { "Cache-Control": "no-store" } }
  );
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifySupabaseUser(request.headers.get("authorization"));
    if (!user) return fail("UNAUTHORIZED", 401);

    const db = createSupabaseAdmin();
    const { data, error } = await db
      .from("generation_jobs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      if (isMissingTable(error)) return fail("JOBS_TABLE_MISSING", 503);
      return fail("JOBS_UNAVAILABLE", 503);
    }

    return NextResponse.json(
      { jobs: data ?? [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return fail("SERVER_ERROR", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifySupabaseUser(request.headers.get("authorization"));
    if (!user) return fail("UNAUTHORIZED", 401);

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return fail("INVALID_JSON", 400);
    }

    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return fail("INVALID_JSON", 400);
    }

    const input = payload as Record<string, unknown>;

    // The paid engine is never reachable from this endpoint.
    if (input.mode === "live") return fail("LIVE_NOT_ENABLED", 503);

    const text = typeof input.text === "string" ? input.text.trim() : "";
    if (!text || text.length > MAX_TEXT) return fail("INVALID_TEXT", 400);

    const language =
      typeof input.language === "string" && LANGUAGES.has(input.language)
        ? input.language
        : "ar";

    const rawKey =
      typeof input.idempotencyKey === "string" ? input.idempotencyKey.trim() : "";
    const idempotencyKey =
      rawKey && rawKey.length <= MAX_KEY_LENGTH ? rawKey : randomUUID();

    const db = createSupabaseAdmin();

    const { data: existing, error: lookupError } = await db
      .from("generation_jobs")
      .select("*")
      .eq("user_id", user.id)
      .eq("idempotency_key", idempotencyKey)
      .maybeSingle();

    if (lookupError && isMissingTable(lookupError)) {
      return fail("JOBS_TABLE_MISSING", 503);
    }
    if (existing) {
      return NextResponse.json(
        { job: existing, replayed: true },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const { data, error } = await db
      .from("generation_jobs")
      .insert({
        user_id: user.id,
        idempotency_key: idempotencyKey,
        text_input: text,
        language,
        mode: "demo",
        status: "queued",
      })
      .select("*")
      .single();

    if (error) {
      if (isMissingTable(error)) return fail("JOBS_TABLE_MISSING", 503);
      if (error.code === "23505") {
        const { data: replay } = await db
          .from("generation_jobs")
          .select("*")
          .eq("user_id", user.id)
          .eq("idempotency_key", idempotencyKey)
          .maybeSingle();
        if (replay) return NextResponse.json({ job: replay, replayed: true });
      }
      return fail("JOB_CREATE_FAILED", 503);
    }

    return NextResponse.json(
      { job: data },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return fail("SERVER_ERROR", 500);
  }
}
