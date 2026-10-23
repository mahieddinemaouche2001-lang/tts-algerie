
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "TTS_NOT_READY",
      message:
        "خدمة توليد الصوت قيد الإعداد. لم يتم استهلاك أي رصيد.",
    },
    { status: 503 }
  );
}

