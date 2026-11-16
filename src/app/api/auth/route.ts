import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureUser } from "@/lib/randap-server";

/** Faqat Gmail manzillar qabul qilinadi */
const GMAIL_RE = /^[a-z0-9](?:[a-z0-9._%+-]{0,62})?@(?:gmail|googlemail)\.com$/i;

function accountPayload(account: {
  name: string;
  gmail: string;
  viaGoogle: boolean;
}) {
  return {
    name: account.name,
    gmail: account.gmail,
    viaGoogle: account.viaGoogle,
  };
}

/** Sessiyani tekshirish — bu deviceKey uchun hisob bormi? */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceKey = (searchParams.get("deviceKey") ?? "").trim();
    if (!deviceKey) {
      return NextResponse.json(
        { ok: false, error: "deviceKey kerak" },
        { status: 400 }
      );
    }
    const account = await db.authAccount.findUnique({ where: { deviceKey } });
    return NextResponse.json({
      ok: true,
      account: account ? accountPayload(account) : null,
    });
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

    // Profil ismini kirish ismi bilan sinxronlaymiz
    const user = await ensureUser(deviceKey);
    if (user.name !== name) {
      await db.user.update({ where: { id: user.id }, data: { name } });
    }

    // Chat profilining ismi ham kirish ismi bilan bir xil bo'lsin
    await db.chatProfile.upsert({
      where: { deviceKey },
      update: { name },
      create: { deviceKey, name },
    });

    const account = await db.authAccount.upsert({
      where: { deviceKey },
      update: { name, gmail, viaGoogle },
      create: { deviceKey, name, gmail, viaGoogle },
    });

    return NextResponse.json({ ok: true, account: accountPayload(account) });
  } catch (error) {
    console.error("/api/auth POST error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}

/** Chiqish (logout) — sessiya hisobi o'chiriladi */
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
