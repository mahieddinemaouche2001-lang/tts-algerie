
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "../../../lib/supabase-admin";

export async function GET() {
  try {
    const supabase = createSupabaseAdmin();

    const { error } = await supabase
      .from("trial_usage")
      .select("user_id")
      .limit(1);

    if (error) {
      return NextResponse.json(
        { status: "connection_failed" },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: "connected",
      database: "supabase",
    });
  } catch {
    return NextResponse.json(
      { status: "server_error" },
      { status: 500 }
    );
  }
}
