import { NextResponse } from "next/server";
import { generateComicWithGemini } from "@/lib/gemini";
import { sanitizeText } from "@/lib/sanitize";
import { getSessionMeta, purgeExpired, saveComicMeta } from "@/lib/session";
import type { AgeRange, ThemeId } from "@/lib/types";
import { THEMES } from "@/lib/themes";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const DAILY_LIMIT = Number(process.env.DAILY_GENERATION_LIMIT ?? 5);
const usage = new Map<string, { day: string; count: number }>();

function checkQuota(userId: string): boolean {
  const day = new Date().toISOString().slice(0, 10);
  const row = usage.get(userId);
  if (!row || row.day !== day) {
    usage.set(userId, { day, count: 1 });
    return true;
  }
  if (row.count >= DAILY_LIMIT) return false;
  row.count += 1;
  return true;
}

export async function POST(req: Request) {
  purgeExpired();

  const body = (await req.json().catch(() => ({}))) as {
    sessionId?: string;
    childName?: string;
    themeId?: ThemeId;
    ageRange?: AgeRange;
    /** Used only in this request for Gemini — never written to disk/DB. */
    photoDataUrl?: string | null;
  };

  if (!body.sessionId || !getSessionMeta(body.sessionId)) {
    return NextResponse.json({ error: "Valid session required." }, { status: 401 });
  }

  if (!checkQuota(body.sessionId)) {
    return NextResponse.json(
      {
        error:
          "Daily comic limit reached. Please try again tomorrow to keep our free tier healthy.",
      },
      { status: 429 }
    );
  }

  const themeOk = THEMES.some((t) => t.id === body.themeId);
  if (!themeOk || !body.themeId) {
    return NextResponse.json({ error: "Choose a valid theme." }, { status: 400 });
  }

  const childName = sanitizeText(body.childName ?? "", 40);
  if (!childName) {
    return NextResponse.json({ error: "Child first name is required." }, { status: 400 });
  }

  if (!body.photoDataUrl || !body.photoDataUrl.startsWith("data:image/")) {
    return NextResponse.json(
      { error: "A photo is required for AI comic generation." },
      { status: 400 }
    );
  }

  if (!process.env.GEMINI_API_KEY?.trim()) {
    return NextResponse.json(
      {
        error:
          "Gemini is not configured. Add GEMINI_API_KEY to .env.local and restart the server.",
        code: "MISSING_GEMINI_KEY",
      },
      { status: 503 }
    );
  }

  try {
    const comic = await generateComicWithGemini({
      childName,
      themeId: body.themeId,
      photoDataUrl: body.photoDataUrl,
      ageRange: body.ageRange,
    });

    // Persist metadata only (no images / no raw photo)
    saveComicMeta(body.sessionId, {
      ...comic,
      coverImageDataUrl: undefined,
      panels: comic.panels.map((panel) => ({
        id: panel.id,
        caption: panel.caption,
        sceneLabel: panel.sceneLabel,
        speechBubble: panel.speechBubble,
        bg: panel.bg,
      })),
    });

    return NextResponse.json({ comic });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Comic generation failed.";
    console.error("[generate]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
