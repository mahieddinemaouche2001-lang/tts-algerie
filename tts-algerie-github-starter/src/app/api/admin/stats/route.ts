import { NextRequest, NextResponse } from "next/server";
import { verifySupabaseUser } from "../../../../lib/supabase-auth";
import { createSupabaseAdmin } from "../../../../lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const adminId = process.env.ADMIN_USER_ID;
    if (!adminId) {
      return NextResponse.json({ error: "ADMIN_NOT_CONFIGURED" }, { status: 503 });
    }

    const user = await verifySupabaseUser(request.headers.get("authorization"));
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
    if (user.id !== adminId || user.is_anonymous === true) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const db = createSupabaseAdmin();
    const [profiles, generations, trials, reservations] = await Promise.all([
      db.from("profiles").select("*", { count: "exact", head: true }),
      db.from("generations").select("*", { count: "exact", head: true }),
      db.from("trial_usage").select("used_count"),
      db.from("trial_reservations").select("*", { count: "exact", head: true }).eq("status", "reserved").gt("expires_at", new Date().toISOString()),
    ]);
    if (profiles.error || generations.error || trials.error || reservations.error) {
      return NextResponse.json({ error: "STATS_UNAVAILABLE" }, { status: 503 });
    }

    return NextResponse.json({
      profiles: profiles.count ?? 0,
      generations: generations.count ?? 0,
      trialsUsed: (trials.data ?? []).reduce((sum, item) => sum + (item.used_count ?? 0), 0),
      activeReservations: reservations.count ?? 0,
      geminiEnabled: false,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
