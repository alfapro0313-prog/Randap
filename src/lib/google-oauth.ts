import { NextResponse } from "next/server";

/**
 * Google OAuth umumiy yordamchilari.
 * Sozlash: GOOGLE_CLIENT_ID va GOOGLE_CLIENT_SECRET env var'lari (Vercel).
 * Redirect URI: https://<domain>/api/auth/google/callback
 */

export const OAUTH_COOKIE = "randap_oauth";

export function googleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );
}

/** Vercel proxy ortidagi haqiqiy origin (x-forwarded-host) */
export function siteOrigin(req: Request): string {
  const fwdHost = req.headers.get("x-forwarded-host");
  const fwdProto = req.headers.get("x-forwarded-proto");
  if (fwdHost) {
    return `${fwdProto ?? "https"}://${fwdHost}`;
  }
  return new URL(req.url).origin;
}

/** Done sahifasiga yo'naltirish (xatolik yoki muvaffaqiyat) */
export function doneRedirect(
  origin: string,
  params: Record<string, string>
): NextResponse {
  const q = new URLSearchParams(params);
  return NextResponse.redirect(`${origin}/auth/google/done?${q.toString()}`);
}
