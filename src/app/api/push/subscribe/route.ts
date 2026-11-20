import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureUser } from "@/lib/randap-server";

/**
 * POST /api/push/subscribe
 * { deviceKey, subscription: { endpoint, keys: { p256dh, auth } } }
 * Service worker push obunasini saqlaydi — yangi xabar/DZF bo'lsa
 * sayt yopiq bo'lsa ham tashqi bildirishnoma chiqadi.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      deviceKey?: string;
      subscription?: {
        endpoint?: string;
        keys?: { p256dh?: string; auth?: string };
      };
    } | null;

    const deviceKey = (body?.deviceKey ?? "").trim();
    const endpoint = (body?.subscription?.endpoint ?? "").trim();
    const p256dh = (body?.subscription?.keys?.p256dh ?? "").trim();
    const auth = (body?.subscription?.keys?.auth ?? "").trim();

    if (!deviceKey || !endpoint || !p256dh || !auth) {
      return NextResponse.json(
        { ok: false, error: "deviceKey va to'liq subscription kerak" },
        { status: 400 }
      );
    }

    await ensureUser(deviceKey);
    await db.pushSubscription.upsert({
      where: { endpoint },
      update: { deviceKey, p256dh, auth },
      create: { deviceKey, endpoint, p256dh, auth },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("/api/push/subscribe error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}

/**
 * DELETE /api/push/subscribe
 * { endpoint } — obunani o'chirish (brauzer ruxsatni yopganda)
 */
export async function DELETE(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as { endpoint?: string } | null;
    const endpoint = (body?.endpoint ?? "").trim();
    if (!endpoint) {
      return NextResponse.json({ ok: false, error: "endpoint kerak" }, { status: 400 });
    }
    await db.pushSubscription.deleteMany({ where: { endpoint } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("/api/push/subscribe DELETE error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}
