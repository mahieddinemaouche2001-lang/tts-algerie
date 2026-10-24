
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "../../../lib/supabase-admin";

export async function GET() {
  // Temporary diagnostic endpoint.
  // No database query and no secrets are returned.
  try {
    createSupabaseAdmin();

    return NextResponse.json({
      status: "configured",
      note: "Supabase client initialized; connection not tested",
    });
  } catch {
    return NextResponse.json(
      { status: "configuration_error" },
      { status: 500 }
    );
  }
}
