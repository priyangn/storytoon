import { NextResponse } from "next/server";
import { buildMockComic } from "@/lib/comic-mock";
import { sanitizeText } from "@/lib/sanitize";
import { getSessionMeta, purgeExpired, saveComicMeta } from "@/lib/session";
import type { ThemeId } from "@/lib/types";
import { THEMES } from "@/lib/themes";

export const dynamic = "force-dynamic";

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
    /** Photo may be sent for live Gemini; never written to disk/DB. */
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

  // Intentionally do not store photoDataUrl. It is discarded after this request.
  void body.photoDataUrl;

  // Simulate generation latency
  await new Promise((r) => setTimeout(r, 1200));

  const comic = buildMockComic(childName, body.themeId);
  saveComicMeta(body.sessionId, comic);

  return NextResponse.json({ comic });
}
