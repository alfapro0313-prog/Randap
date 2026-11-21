import { NextResponse } from "next/server";
import { randomBytes, randomUUID, scryptSync } from "crypto";
import { db } from "@/lib/db";
import { ensureUser } from "@/lib/randap-server";
import { isLang, type Lang } from "@/lib/randap-i18n";
import {
  OAUTH_COOKIE,
  doneRedirect,
  siteOrigin,
} from "@/lib/google-oauth";

/**
 * GET /api/auth/google/callback
 * Google OAuth javobi: code → id_token → haqiqiy Gmail akkaunt.
 *  - Faqat Google'da TASDIQLANGAN (email_verified) @gmail.com manzillar;
 *  - bloklangan akkaunt kira olmaydi (sabab done sahifada ko'rinadi);
 *  - bitta gmail = bitta hisob (Account.accountKey);
 *  - Google orqali yaratilgan hisobga tasodifiy parol qo'yiladi —
 *    qo'lda (ishm+parol) kirib olib bo'lmaydi.
 */

const GMAIL_RE = /^[a-z0-9](?:[a-z0-9._%+-]{0,62})?@(?:gmail|googlemail)\.com$/i;

function readCookie(req: Request, name: string): string {
  const raw = req.headers.get("cookie") ?? "";
  for (const part of raw.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return "";
}

/** id_token payload'ini o'qish (token to'g'ridan-to'g'ri Google token endpointidan kelgan) */
function decodeIdPayload(idToken: string): {
  email?: string;
  email_verified?: boolean;
  name?: string;
} {
  try {
    const part = idToken.split(".")[1] ?? "";
    const json = Buffer.from(
      part.replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    ).toString("utf8");
    return JSON.parse(json) as {
      email?: string;
      email_verified?: boolean;
      name?: string;
    };
  } catch {
    return {};
  }
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export async function GET(req: Request) {
  const origin = siteOrigin(req);
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code") ?? "";
  const state = searchParams.get("state") ?? "";

  let saved: { state?: string; deviceKey?: string; lang?: string } = {};
  try {
    // Cookie Next.js tomonidan URL-kodlanadi (%7B%22state%22...) —
    // qayta o'qishda avval decode qilish shart, aks holda JSON.parse yiqiladi
    saved = JSON.parse(
      decodeURIComponent(readCookie(req, OAUTH_COOKIE) || "{}")
    ) as typeof saved;
  } catch {
    saved = {};
  }
  const lang: Lang = isLang(saved.lang) ? saved.lang : "uz";
  const deviceKey = (saved.deviceKey ?? "").slice(0, 160);

  const fail = (errCode: string) =>
    doneRedirect(origin, { err: errCode, lang });

  // 1) CSRF: state cookie'dagiga teng bo'lishi shart
  if (!code || !state || !saved.state || state !== saved.state) {
    return fail("state");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return fail("not_configured");
  // 2) code → token
  let idToken = "";
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${origin}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    const tok = (await tokenRes.json()) as { id_token?: string };
    idToken = tok.id_token ?? "";
  } catch {
    return fail("token");
  }
  if (!idToken) return fail("token");

  // 3) Haqiqiy va tasdiqlangan Gmail
  const info = decodeIdPayload(idToken);
  const email = (info.email ?? "").trim().toLowerCase();
  if (!email || info.email_verified !== true || !GMAIL_RE.test(email)) {
    return fail("gmail");
  }

  // 4) Admin blok tekshiruvi
  const now = new Date();
  const existing = await db.account.findUnique({ where: { gmail: email } });
  if (existing?.blockedUntil && existing.blockedUntil > now) {
    const until = new Date(existing.blockedUntil).getTime();
    const reason = encodeURIComponent(existing.blockReason ?? "");
    return NextResponse.redirect(
      `${origin}/auth/google/done?err=blocked&lang=${lang}&until=${until}&reason=${reason}`
    );
  }
  // 5) Hisob: bor — saqlanadi, yo'q — yaratiladi (Google ismi bilan)
  const account = existing
    ? existing
    : await db.account.create({
        data: {
          gmail: email,
          name: (info.name ?? email.split("@")[0] ?? "Google").slice(0, 40),
          accountKey: `acct-${randomUUID()}`,
          // Tasodifiy parol: bu hisobga qo'lda kirib olib bo'lmaydi
          passwordHash: hashPassword(randomBytes(32).toString("hex")),
        },
      });

  // 6) Profil + chat + qurilma sessiyasi
  await ensureUser(account.accountKey);
  await db.chatProfile.upsert({
    where: { deviceKey: account.accountKey },
    update: { name: account.name },
    create: { deviceKey: account.accountKey, name: account.name },
  });
  if (deviceKey) {
    await db.authAccount.upsert({
      where: { deviceKey },
      update: {
        name: account.name,
        gmail: email,
        viaGoogle: true,
        lastSeenAt: new Date(),
        visits: { increment: 1 },
      },
      create: { deviceKey, name: account.name, gmail: email, viaGoogle: true },
    });
  }

  // 7) Done sahifasi — sessiya localStorage'ga yoziladi
  const res = doneRedirect(origin, {
    ok: "1",
    lang,
    name: account.name,
    gmail: email,
    key: account.accountKey,
    dk: deviceKey,
  });
  res.cookies.set(OAUTH_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
