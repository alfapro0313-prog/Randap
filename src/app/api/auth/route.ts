import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { ensureUser } from "@/lib/randap-server";

/** Faqat Gmail manzillar qabul qilinadi */
const GMAIL_RE = /^[a-z0-9](?:[a-z0-9._%+-]{0,62})?@(?:gmail|googlemail)\.com$/i;

function accountPayload(account: {
  name: string;
  gmail: string;
  viaGoogle: boolean;
  blockedUntil: Date | null;
  accountKey: string;
}) {
  return {
    name: account.name,
    gmail: account.gmail,
    viaGoogle: account.viaGoogle,
    blockedUntil: account.blockedUntil
      ? new Date(account.blockedUntil).getTime()
      : null,
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
 *  - ism va Gmail IKKALASI ham to'ldirilishi shart (validatsiya serverda ham);
 *  - ism takroriy bo'lishi mumkin (boshqalar qo'ygan ismni ham qo'yish mumkin);
 *  - Google orqali kirishda gmail @gmail.com bo'lishi shart, aks holda kirmaydi;
 *  - Bitta gmail = bitta hisob (accountKey): boshqa gmail bilan kirsa eski
 *    ma'lumotlar ko'rinmaydi, eski gmail bilan qayta kirsa hammasi qaytadi;
 *  - muvaffaqiyatli kirgach User va ChatProfile ismi sinxronlanadi.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      deviceKey?: string;
      name?: string;
      gmail?: string;
      viaGoogle?: boolean;
    } | null;

    const deviceKey = (body?.deviceKey ?? "").trim();
    const name = (body?.name ?? "").trim();
    const gmail = (body?.gmail ?? "").trim().toLowerCase();
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
          error: "Kirish vaqtincha bloklangan",
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
          error: "Kirish vaqtincha bloklangan",
        },
        { status: 403 }
      );
    }

    // Bitta gmail = bitta hisob
    const account = await upsertAccount(name, gmail);

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
