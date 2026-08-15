import { NextResponse } from "next/server";
import { createSessionMeta, purgeExpired } from "@/lib/session";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

/** Demo sign-in until Google OAuth client IDs are configured. */
export async function POST(req: Request) {
  purgeExpired();
  const body = (await req.json().catch(() => ({}))) as {
    name?: string;
    email?: string;
    driveConsent?: boolean;
    accountConsent?: boolean;
    apiConsent?: boolean;
  };

  if (!body.accountConsent || !body.apiConsent) {
    return NextResponse.json(
      { error: "Account and Google API consent are required." },
      { status: 400 }
    );
  }

  const id = randomUUID();
  const email = body.email?.trim() || `parent-${id.slice(0, 8)}@demo.storytoon.app`;
  const name = body.name?.trim() || "Parent";
  const meta = createSessionMeta(id, email);

  return NextResponse.json({
    session: {
      id,
      name,
      email,
      driveConsent: Boolean(body.driveConsent),
      createdAt: meta.createdAt,
      expiresAt: meta.expiresAt,
    },
    mode: process.env.GOOGLE_CLIENT_ID ? "google" : "demo",
  });
}
