import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";
import { verifySupabaseUser } from "./supabase-auth";

type AdminResult = { user: User; error: null } | { user: null; error: NextResponse };

/**
 * Single gate for every admin API. Fails closed: missing configuration,
 * missing session, anonymous session or wrong user id all return an error.
 */
export async function requireAdmin(request: NextRequest): Promise<AdminResult> {
  const adminId = process.env.ADMIN_USER_ID;

  if (!adminId) {
    return {
      user: null,
      error: NextResponse.json({ error: "ADMIN_NOT_CONFIGURED" }, { status: 503 }),
    };
  }

  const user = await verifySupabaseUser(request.headers.get("authorization"));

  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 }),
    };
  }

  if (user.id !== adminId || user.is_anonymous === true) {
    return {
      user: null,
      error: NextResponse.json({ error: "FORBIDDEN" }, { status: 403 }),
    };
  }

  return { user, error: null };
}
