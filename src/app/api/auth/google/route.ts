import { randomBytes } from "crypto";
import {
  OAUTH_COOKIE,
  doneRedirect,
  googleConfigured,
  siteOrigin,
} from "@/lib/google-oauth";
import { NextResponse } from "next/server";

/**
 * GET /api/auth/google
 *  - ?status=1 → { configured: boolean } (login sahifasi uchun)
 *  - aks holda: haqiqiy Google OAuth oqimini boshlaydi — foydalanuvchini
 *    Google'ning rasmiy hisob tanlash sahifasiga yo'naltiradi.
 */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const origin = siteOrigin(req);

  // Login sahifasi holatini so'rashi
  if (searchParams.has("status")) {
    return NextResponse.json(
      { ok: true, configured: googleConfigured() },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const langParam = searchParams.get("lang");
  const lang =
    langParam === "ru" || langParam === "en" || langParam === "uz"
      ? langParam
      : "uz";
  const deviceKey = (searchParams.get("deviceKey") ?? "").slice(0, 160);

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return doneRedirect(origin, { err: "not_configured", lang });
  }

  const state = randomBytes(16).toString("hex");
  const auth = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  const res = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${auth.toString()}`
  );
  res.cookies.set(OAUTH_COOKIE, JSON.stringify({ state, deviceKey, lang }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });
  return res;
}
