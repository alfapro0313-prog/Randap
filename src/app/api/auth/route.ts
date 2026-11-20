import { NextResponse } from "next/server";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "crypto";
import { db } from "@/lib/db";
import { ensureUser } from "@/lib/randap-server";
import {
  validateGmailFormat,
  verifyGmailReal,
  allowNewAccount,
} from "@/lib/gmail-verify";

/** Faqat Gmail manzillar qabul qilinadi */
const GMAIL_RE = /^[a-z0-9](?:[a-z0-9._%+-]{0,62})?@(?:gmail|googlemail)\.com$/i;

const PASS_MIN = 4;
const PASS_MAX = 64;

/** Parolni scrypt bilan hashlaymiz: "salt:hash" */
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/** Saqlangan hash bilan parolni solishtiramiz (timing-safe) */
function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

export function accountPayload(account: {
  name: string;
  gmail: string;
  viaGoogle: boolean;
  blockedUntil: Date | null;
  accountKey: string;
  blockReason?: string | null;
}) {
  return {
    name: account.name,
    gmail: account.gmail,
    viaGoogle: account.viaGoogle,
    blockedUntil: account.blockedUntil
      ? new Date(account.blockedUntil).getTime()
      : null,
    blockReason: account.blockReason ?? null,
    accountKey: account.accountKey,
  };
}

/**
 * Gmail bo'yicha hisobni topadi/yaratadi (bitta gmail = bitta accountKey).
 * Mavjud hisob bo'lmasa: eski AuthAccount qatori (shu gmail bilan biror qurilmada
 * kirgan bo'lsa) o'sha qurilma kalitini "adopt" qilinadi — eski ma'lumotlar
 * yo'qolmaydi. Aks holda yangi tasodifiy accountKey yaratiladi.
 */
async function upsertAccount(name: string, gmail: string) {
  const existing = await db.account.findUnique({ where: { gmail } });
  if (existing) {
    if (existing.name !== name) {
      await db.account.update({ where: { id: existing.id }, data: { name } });
      return { ...existing, name };
    }
    return existing;
  }

  // Migration: eski AuthAccount qatori bor-mi? (deploygacha kirgan hisoblar)
  const legacy = await db.authAccount.findFirst({
    where: { gmail },
    orderBy: { createdAt: "asc" },
  });
  const accountKey = legacy?.deviceKey || `acct-${randomUUID()}`;
  return db.account.create({ data: { gmail, name, accountKey } });
}

/** Sessiyani tekshirish — accountKey yoki eski deviceKey bo'yicha hisob bormi? */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = (searchParams.get("deviceKey") ?? "").trim();
    if (!key) {
      return NextResponse.json(
        { ok: false, error: "deviceKey kerak" },
        { status: 400 }
      );
    }

    // 1) Yangi usul: accountKey bo'yicha Account
    const acct = await db.account.findUnique({ where: { accountKey: key } });
    if (acct) {
      await db.account.update({
        where: { id: acct.id },
        data: { updatedAt: new Date() },
      });
      return NextResponse.json({
        ok: true,
        account: accountPayload({
          name: acct.name,
          gmail: acct.gmail,
          viaGoogle: true,
          blockedUntil: acct.blockedUntil,
          blockReason: acct.blockReason,
          accountKey: acct.accountKey,
        }),
      });
    }

    // 2) Migration: eski deviceKey bo'yicha AuthAccount
    const authAccount = await db.authAccount.findUnique({ where: { deviceKey: key } });
    if (authAccount) {
      // Har bir kirish — "kimlar kirganini ko'rish" uchun lastSeen yangilanadi
      await db.authAccount.update({
        where: { deviceKey: key },
        data: { lastSeenAt: new Date() },
      });
      const resolved = await upsertAccount(authAccount.name, authAccount.gmail);
      return NextResponse.json({
        ok: true,
        account: accountPayload({
          name: resolved.name,
          gmail: resolved.gmail,
          viaGoogle: authAccount.viaGoogle,
          blockedUntil: resolved.blockedUntil ?? authAccount.blockedUntil,
          blockReason: resolved.blockReason ?? authAccount.blockReason,
          accountKey: resolved.accountKey,
        }),
      });
    }

    return NextResponse.json({ ok: true, account: null });
  } catch (error) {
    console.error("/api/auth GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}

/**
 * Saytga kirish (login gate):
 *  - ism, parol va Gmail to'ldirilishi shart (validatsiya serverda ham);
 *  - parol hisobni himoyalaydi: boshqalar boshqa odamning ismi+gmaili bilan kira olmaydi;
 *  - yangi hisobda yozilgan parol saqlanadi; parol qo'yilmagan eski hisobda birinchi
 *    kirish parolini belgilaydi; parol qo'yilgan hisobda parol xato bo'lsa kirmaydi;
 *  - Google orqali kirishda gmail @gmail.com bo'lishi shart, aks holda kirmaydi;
 *  - Bitta gmail = bitta hisob (accountKey);
 *  - muvaffaqiyatli kirgach User va ChatProfile ismi sinxronlanadi.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      deviceKey?: string;
      name?: string;
      gmail?: string;
      password?: string;
      viaGoogle?: boolean;
    } | null;

    const deviceKey = (body?.deviceKey ?? "").trim();
    const name = (body?.name ?? "").trim();
    const gmail = (body?.gmail ?? "").trim().toLowerCase();
    const password = typeof body?.password === "string" ? body.password : "";
    const viaGoogle = body?.viaGoogle !== false;

    if (!deviceKey) {
      return NextResponse.json(
        { ok: false, error: "deviceKey kerak" },
        { status: 400 }
      );
    }
    if (!name) {
      return NextResponse.json(
        { ok: false, error: "Ism yozilishi shart" },
        { status: 400 }
      );
    }
    if (name.length < 2 || name.length > 40) {
      return NextResponse.json(
        { ok: false, error: "Ism 2-40 belgi orasida bo'lishi kerak" },
        { status: 400 }
      );
    }
    if (!gmail) {
      return NextResponse.json(
        { ok: false, error: "Gmail yozilishi shart" },
        { status: 400 }
      );
    }
    if (!GMAIL_RE.test(gmail)) {
      return NextResponse.json(
        { ok: false, error: "Faqat Gmail manzil bilan kirish mumkin" },
        { status: 400 }
      );
    }
    // HAQIQIY GMAIL — 1-qatlam: qatiy Gmail format qoidalari
    const format = validateGmailFormat(gmail);
    if (!format.ok) {
      return NextResponse.json(
        { ok: false, error: format.error ?? "Gmail noto'g'ri" },
        { status: 400 }
      );
    }
    if (!password) {
      return NextResponse.json(
        { ok: false, passwordRequired: true, error: "Parol yozilishi shart" },
        { status: 400 }
      );
    }
    if (password.length < PASS_MIN || password.length > PASS_MAX) {
      return NextResponse.json(
        {
          ok: false,
          passwordShort: true,
          error: `Parol ${PASS_MIN}-${PASS_MAX} belgi orasida bo'lishi kerak`,
        },
        { status: 400 }
      );
    }

    // ADMIN BLOKI: shu qurilma yoki gmail bloklangan bo'lsa — kirmaydi
    const now = new Date();
    const block = await db.authAccount.findFirst({
      where: {
        OR: [{ deviceKey }, { gmail }],
        blockedUntil: { gt: now },
      },
      orderBy: { blockedUntil: "desc" },
    });
    if (block?.blockedUntil) {
      return NextResponse.json(
        {
          ok: false,
          blocked: true,
          blockedUntil: new Date(block.blockedUntil).getTime(),
          blockReason: block.blockReason ?? null,
          error: "Kirish admin tomonidan bloklangan",
        },
        { status: 403 }
      );
    }
    const accountBlock = await db.account.findFirst({
      where: { gmail, blockedUntil: { gt: now } },
    });
    if (accountBlock?.blockedUntil) {
      return NextResponse.json(
        {
          ok: false,
          blocked: true,
          blockedUntil: new Date(accountBlock.blockedUntil).getTime(),
          blockReason: accountBlock.blockReason ?? null,
          error: "Kirish admin tomonidan bloklangan",
        },
        { status: 403 }
      );
    }

    // Bitta gmail = bitta hisob + parol himoyasi
    const existing = await db.account.findUnique({ where: { gmail } });

    // YANGI HISOB: haqiqiy Gmail tekshiruvi + yaratish limiti
    if (!existing) {
      const legacy = await db.authAccount.findFirst({ where: { gmail } });
      if (!legacy) {
        // Yangi akkaunt: bir qurilmadan kuniga 3 tadan ko'p yo'q
        if (!allowNewAccount(deviceKey)) {
          return NextResponse.json(
            {
              ok: false,
              error:
                "Bugun bu qurilmadan ko'p akkaunt yaratildi. Iltimos, keyinroq urinib ko'ring",
            },
            { status: 429 }
          );
        }
        // 2-qatlam: gmail Gmail serverida mavjudligini tekshirish
        const verdict = await verifyGmailReal(gmail);
        if (verdict === "fake") {
          return NextResponse.json(
            {
              ok: false,
              gmailNotReal: true,
              error:
                "Bu Gmail manzil mavjud emas. Faqat haqiqiy Gmail akkauntingiz bilan kiring",
            },
            { status: 400 }
          );
        }
      }
    }

    let account;
    if (existing) {
      if (existing.passwordHash) {
        // Parol qo'yilgan hisob — parol to'g'ri bo'lsa o'tadi
        if (!verifyPassword(password, existing.passwordHash)) {
          return NextResponse.json(
            {
              ok: false,
              passwordWrong: true,
              error: "Bu hisob uchun parol xato",
            },
            { status: 403 }
          );
        }
        if (existing.name !== name) {
          await db.account.update({
            where: { id: existing.id },
            data: { name },
          });
          existing.name = name;
        }
        account = existing;
      } else {
        // Parol hali qo'yilmagan eski hisob — birinchi kirish parolini belgilaydi
        account = await db.account.update({
          where: { id: existing.id },
          data: { name, passwordHash: hashPassword(password) },
        });
      }
    } else {
      account = await db.account.create({
        data: {
          gmail,
          name,
          accountKey: `acct-${randomUUID()}`,
          passwordHash: hashPassword(password),
        },
      });
    }

    // Profil ismini kirish ismi bilan sinxronlaymiz (accountKey ostida)
    const user = await ensureUser(account.accountKey);
    if (user.name !== name) {
      await db.user.update({ where: { id: user.id }, data: { name } });
    }

    // Chat profilining ismi ham kirish ismi bilan bir xil bo'lsin
    await db.chatProfile.upsert({
      where: { deviceKey: account.accountKey },
      update: { name },
      create: { deviceKey: account.accountKey, name },
    });

    // Qurilma sessiyasi (admin panel va statistika uchun saqlanadi)
    const authAccount = await db.authAccount.upsert({
      where: { deviceKey },
      update: {
        name,
        gmail,
        viaGoogle,
        lastSeenAt: new Date(),
        visits: { increment: 1 },
      },
      create: { deviceKey, name, gmail, viaGoogle },
    });

    return NextResponse.json({
      ok: true,
      account: accountPayload({
        name: authAccount.name,
        gmail: authAccount.gmail,
        viaGoogle: authAccount.viaGoogle,
        blockedUntil: account.blockedUntil,
        accountKey: account.accountKey,
      }),
    });
  } catch (error) {
    console.error("/api/auth POST error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}

/**
 * Chiqish (logout) — qurilma sessiyasi o'chiriladi.
 * Gmail→accountKey xaritasi Account jadvalida QOLADI: shu gmail bilan
 * qayta kirganda eski ma'lumotlar (videolar, chatlar, layklar) qaytadi.
 */
export async function DELETE(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      deviceKey?: string;
    } | null;
    const deviceKey = (body?.deviceKey ?? "").trim();
    if (!deviceKey) {
      return NextResponse.json(
        { ok: false, error: "deviceKey kerak" },
        { status: 400 }
      );
    }
    await db.authAccount.deleteMany({ where: { deviceKey } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("/api/auth DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
