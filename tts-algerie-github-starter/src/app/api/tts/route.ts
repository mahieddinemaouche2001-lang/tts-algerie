import { NextRequest, NextResponse } from "next/server";
import { verifySupabaseUser } from "../../../lib/supabase-auth";
import { createSupabaseAdmin } from "../../../lib/supabase-admin";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "gemini-3.8-flash-tts";
const MAX_TEXT_LENGTH = 500;
const MAX_BODY_BYTES = 4096;
const MAX_AUDIO_BYTES = 6 * 1024 * 1024;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function fail(error: string, status: number) {
  return NextResponse.json({ error }, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function readBody(request: NextRequest): Promise<unknown> {
  const length = request.headers.get("content-length");
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > MAX_BODY_BYTES)) {
    throw new Error("TOO_LARGE");
  }
  const reader = request.body?.getReader();
  if (!reader) throw new Error("BAD_JSON");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new Error("TOO_LARGE");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    throw new Error("BAD_JSON");
  }
}

type AudioContent = { type?: string; data?: string; mime_type?: string };
type InteractionResponse = {
  steps?: Array<{ type?: string; content?: AudioContent[] }>;
};

export async function POST(request: NextRequest) {
  try {
    const user = await verifySupabaseUser(request.headers.get("authorization"));
    if (!user) return fail("UNAUTHORIZED", 401);

    let input: unknown;
    try {
      input = await readBody(request);
    } catch (error) {
      return error instanceof Error && error.message === "TOO_LARGE"
        ? fail("REQUEST_TOO_LARGE", 413)
        : fail("INVALID_JSON", 400);
    }

    if (!input || typeof input !== "object" || Array.isArray(input) ||
        !("text" in input) || typeof input.text !== "string") {
      return fail("INVALID_TEXT", 400);
    }
    const text = input.text.trim();
    if (!text || text.length > MAX_TEXT_LENGTH) return fail("INVALID_TEXT", 400);

    const admin = createSupabaseAdmin();
    const { data: allowed, error: rateError } = await admin.rpc(
      "check_tts_rate_limit", { p_user_id: user.id }
    );
    if (rateError) return fail("RATE_LIMIT_CHECK_FAILED", 503);
    if (allowed !== true) return fail("RATE_LIMIT_EXCEEDED", 429);

    // Server-side kill switch: no reservation or Gemini request when off.
    if (process.env.GEMINI_TTS_ENABLED !== "true") return fail("TTS_NOT_READY", 503);
    const key = process.env.GEMINI_API_KEY;
    if (!key) return fail("GEMINI_NOT_CONFIGURED", 503);

    const { data: reservationId, error: reserveError } = await admin.rpc(
      "reserve_trial", { p_user_id: user.id }
    );
    if (reserveError) return fail("TRIAL_RESERVATION_FAILED", 503);
    if (typeof reservationId !== "string" || !UUID.test(reservationId)) {
      return fail("FREE_TRIAL_LIMIT_REACHED", 403);
    }

    let completed = false;
    try {
      // Global quota fails closed; failed calls also count against the daily cap.
      const { data: quotaAllowed, error: quotaError } = await admin.rpc(
        "claim_gemini_daily_quota", { p_max: 5 }
      );
      if (quotaError) return fail("GLOBAL_QUOTA_CHECK_FAILED", 503);
      if (quotaAllowed !== true) return fail("GLOBAL_DAILY_LIMIT", 429);

      const upstream = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/interactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": key,
          },
          body: JSON.stringify({
            model: MODEL,
            input: [{ type: "user_input", content: [{ type: "text", text }] }],
            response_format: { type: "audio", mime_type: "audio/wav" },
            generation_config: { speech_config: [{ voice: "Kore" }] },
          }),
          signal: AbortSignal.timeout(35000),
          cache: "no-store",
        }
      );
      if (!upstream.ok) {
        console.error("VOIX_DZ_GEMINI_UPSTREAM_STATUS", upstream.status);
        return fail("GEMINI_UPSTREAM_FAILED", 502);
      }

      // Bound response size before parsing; the API returns base64 audio in JSON.
      const declaredSize = Number(upstream.headers.get("content-length") || 0);
      const maxJsonBytes = Math.ceil(MAX_AUDIO_BYTES * 1.5);
      if (declaredSize > maxJsonBytes) return fail("AUDIO_TOO_LARGE", 502);
      const reader = upstream.body?.getReader();
      if (!reader) return fail("INVALID_AUDIO_RESPONSE", 502);
      let total = 0;
      const parts: Uint8Array[] = [];
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          total += value.byteLength;
          if (total > maxJsonBytes) {
            await reader.cancel();
            return fail("AUDIO_TOO_LARGE", 502);
          }
          parts.push(value);
        }
      } finally {
        reader.releaseLock();
      }
      const payloadBytes = new Uint8Array(total);
      let at = 0;
      for (const part of parts) {
        payloadBytes.set(part, at);
        at += part.byteLength;
      }
      let payload: InteractionResponse;
      try {
        payload = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(payloadBytes));
      } catch {
        return fail("INVALID_AUDIO_RESPONSE", 502);
      }
      const audioBlocks = payload.steps
        ?.filter(step => step.type === "model_output")
        .flatMap(step => step.content ?? [])
        .filter(content => content.type === "audio" && typeof content.data === "string") ?? [];
      const audio = audioBlocks[audioBlocks.length - 1];
      if (!audio?.data || !/^[A-Za-z0-9+/]+={0,2}$/.test(audio.data)) {
        return fail("INVALID_AUDIO_RESPONSE", 502);
      }
      if (audio.data.length > Math.ceil(MAX_AUDIO_BYTES * 4 / 3) + 4) {
        return fail("AUDIO_TOO_LARGE", 502);
      }
      const bytes = Buffer.from(audio.data, "base64");
      if (bytes.length < 44 || bytes.length > MAX_AUDIO_BYTES ||
          bytes.toString("ascii", 0, 4) !== "RIFF" ||
          bytes.toString("ascii", 8, 12) !== "WAVE") {
        return fail("INVALID_AUDIO_RESPONSE", 502);
      }

      const { data: confirmed, error: confirmationError } = await admin.rpc(
        "complete_trial", { p_reservation_id: reservationId }
      );
      if (confirmationError || confirmed !== true) return fail("TRIAL_CONFIRM_FAILED", 503);
      completed = true;
      return NextResponse.json({
        audioBase64: audio.data,
        mimeType: "audio/wav",
        trial_consumed: true,
      }, { headers: { "Cache-Control": "no-store" } });
    } finally {
      if (!completed) {
        const { error } = await admin.rpc("release_trial", {
          p_reservation_id: reservationId,
        });
        if (error) console.error("VOIX_DZ_TRIAL_RELEASE_FAILED");
      }
    }
  } catch (error) {
    console.error("VOIX_DZ_TTS_ERROR", error instanceof Error ? error.name : "unknown");
    return fail("SERVER_ERROR", 500);
  }
}
