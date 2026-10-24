
import { NextRequest, NextResponse } from "next/server";
import { verifySupabaseUser } from "../../../lib/supabase-auth";
import { createSupabaseAdmin } from "../../../lib/supabase-admin";

const MAX_TEXT_LENGTH = 2000;
const MAX_BODY_BYTES = 8192;

export async function POST(request: NextRequest) {
  try {
    const contentLength = request.headers.get("content-length");

    if (
      contentLength !== null &&
      (!/^\d+$/.test(contentLength) ||
        Number(contentLength) > MAX_BODY_BYTES)
    ) {
      return NextResponse.json(
        { error: "REQUEST_TOO_LARGE" },
        { status: 413 }
      );
    }

    const user = await verifySupabaseUser(
      request.headers.get("authorization")
    );

    if (!user) {
      return NextResponse.json(
        { error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const reader = request.body?.getReader();

    if (!reader) {
      return NextResponse.json(
        { error: "INVALID_BODY" },
        { status: 400 }
      );
    }

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        totalBytes += value.byteLength;

        if (totalBytes > MAX_BODY_BYTES) {
          await reader.cancel();

          return NextResponse.json(
            { error: "REQUEST_TOO_LARGE" },
            { status: 413 }
          );
        }

        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }

    const bytes = new Uint8Array(totalBytes);
    let offset = 0;

    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }

    let body: unknown;

    try {
      body = JSON.parse(
        new TextDecoder("utf-8", { fatal: true }).decode(bytes)
      );
    } catch {
      return NextResponse.json(
        { error: "INVALID_JSON" },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body) ||
      !("text" in body) ||
      typeof body.text !== "string"
    ) {
      return NextResponse.json(
        { error: "INVALID_TEXT" },
        { status: 400 }
      );
    }

    const text = body.text.trim();

    if (!text || text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: "INVALID_TEXT" },
        { status: 400 }
      );
    }

    const admin = createSupabaseAdmin();

    // Protection : maximum 10 requêtes par minute.
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

    // Réserver un essai gratuit.
    const { data: reservationId, error: reserveError } =
      await admin.rpc("reserve_trial", {
        p_user_id: user.id,
      });

    if (reserveError) {
      return NextResponse.json(
        { error: "TRIAL_RESERVATION_FAILED" },
        { status: 503 }
      );
    }

    if (
      typeof reservationId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        reservationId
      )
    ) {
      return NextResponse.json(
        {
          error: "FREE_TRIAL_LIMIT_REACHED",
          message: "Les deux essais gratuits sont épuisés ou réservés.",
        },
        { status: 403 }
      );
    }

    // Gemini TTS n'est pas encore activé.
    // Aucune génération ne doit consommer d'essai pour l'instant.
    const { data: released, error: releaseError } =
      await admin.rpc("release_trial", {
        p_reservation_id: reservationId,
      });

    if (releaseError || released !== true) {
      return NextResponse.json(
        {
          error: "TRIAL_RELEASE_FAILED",
          message: "La réservation n'a pas pu être annulée.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "TTS_NOT_READY",
        message: "Le moteur vocal est en cours de préparation.",
        trial_consumed: false,
      },
      { status: 503 }
    );
  } catch {
    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
