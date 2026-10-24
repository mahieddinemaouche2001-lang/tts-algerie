
    const admin = createSupabaseAdmin();

    const { data: allowed, error: rateError } =
      await admin.rpc("check_tts_rate_limit", {
        p_user_id: user.id,
      });

    if (rateError) {
      return NextResponse.json(
        { error: "RATE_LIMIT_CHECK_FAILED" },
        { status: 503 }
      );
    }

    if (allowed !== true) {
      return NextResponse.json(
        {
          error: "RATE_LIMIT_EXCEEDED",
          message: "Maximum 10 requêtes par minute.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: "TTS_NOT_READY",
        message: "خدمة توليد الصوت قيد الإعداد.",
      },
      { status: 503 }
    );

