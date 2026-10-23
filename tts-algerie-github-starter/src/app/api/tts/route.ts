
import { NextRequest, NextResponse } from "next/server";
import { verifySupabaseUser } from "../../../lib/supabase-auth";

export async function POST(request: NextRequest) {
  try {
    const user = await verifySupabaseUser(
      request.headers.get("authorization")
    );

    if (!user) {
      return NextResponse.json(
        {
          error: "UNAUTHORIZED",
          message: "يجب تسجيل الدخول أو بدء جلسة ضيف صالحة.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: "TTS_NOT_READY",
        message: "خدمة توليد الصوت قيد الإعداد.",
      },
      { status: 503 }
    );
  } catch {
    return NextResponse.json(
      {
        error: "SERVER_ERROR",
        message: "حدث خطأ في الخادم.",
      },
      { status: 500 }
    );
  }
}
