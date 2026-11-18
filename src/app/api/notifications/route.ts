import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDeviceKeyFromRequest } from "@/lib/randap-server";

/** GET /api/notifications — bildirishnomalar ro'yxati + o'qilmaganlar soni */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceKey =
      getDeviceKeyFromRequest(req) || (searchParams.get("deviceKey") ?? "").trim();
    if (!deviceKey) {
      return NextResponse.json({ ok: false, error: "deviceKey kerak" }, { status: 400 });
    }

    const [items, unreadCount] = await Promise.all([
      db.notification.findMany({
        where: { deviceKey },
        orderBy: { createdAt: "desc" },
        take: 30,
        select: {
          id: true,
          type: true,
          text: true,
          actorName: true,
          videoId: true,
          readAt: true,
          createdAt: true,
        },
      }),
      db.notification.count({ where: { deviceKey, readAt: null } }),
    ]);

    return NextResponse.json({ ok: true, items, unreadCount });
  } catch (error) {
    console.error("/api/notifications GET error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}

/** POST { action: "readAll" } — hammasini o'qilgan qilish */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      deviceKey?: string;
      action?: string;
    } | null;
    const deviceKey =
      getDeviceKeyFromRequest(req) || (body?.deviceKey ?? "").trim();
    const action = (body?.action ?? "readAll").trim();

    if (!deviceKey) {
      return NextResponse.json({ ok: false, error: "deviceKey kerak" }, { status: 400 });
    }
    if (action !== "readAll") {
      return NextResponse.json({ ok: false, error: "action: readAll" }, { status: 400 });
    }

    await db.notification.updateMany({
      where: { deviceKey, readAt: null },
      data: { readAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("/api/notifications POST error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}
