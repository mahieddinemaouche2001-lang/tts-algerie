import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) return guard.error;

    const db = createSupabaseAdmin();

    const [{ data: list, error: listError }, { data: profiles, error: profilesError }] =
      await Promise.all([
        db.auth.admin.listUsers({ page: 1, perPage: 50 }),
        db.from("profiles").select("id,display_name,created_at").limit(500),
      ]);

    if (listError || profilesError) {
      return NextResponse.json({ error: "USERS_UNAVAILABLE" }, { status: 503 });
    }

    const names = new Map<string, string | null>(
      (profiles ?? []).map((row) => [row.id as string, (row.display_name as string) ?? null])
    );

    const users = (list?.users ?? []).map((user) => ({
      id: user.id,
      email: user.email ?? null,
      displayName: names.get(user.id) ?? null,
      anonymous: user.is_anonymous === true,
      createdAt: user.created_at,
      lastSignInAt: user.last_sign_in_at ?? null,
    }));

    return NextResponse.json(
      { users, total: users.length },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
