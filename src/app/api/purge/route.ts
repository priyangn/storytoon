import { NextResponse } from "next/server";
import { purgeExpired } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Cron/backstop for 24h metadata purge. */
export async function POST() {
  const purged = purgeExpired();
  return NextResponse.json({
    ok: true,
    purged,
    at: new Date().toISOString(),
  });
}

export async function GET() {
  return POST();
}
