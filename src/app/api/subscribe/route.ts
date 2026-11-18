import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDeviceKeyFromRequest } from "@/lib/randap-server";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      channelId?: string;
      deviceId?: string;
    } | null;

    const channelId = (body?.channelId ?? "").trim();
    const deviceId =
      getDeviceKeyFromRequest(req) || (body?.deviceId ?? "").trim();

    if (!channelId || !deviceId) {
      return NextResponse.json(
        { ok: false, error: "channelId va deviceId kerak" },
        { status: 400 }
      );
    }

    const channel = await db.user.findUnique({ where: { id: channelId } });
    if (!channel) {
      return NextResponse.json(
        { ok: false, error: "Kanal topilmadi" },
        { status: 404 }
      );
    }

    const existing = await db.subscription.findUnique({
      where: { channelId_deviceId: { channelId, deviceId } },
    });

    if (existing) {
      await db.subscription.delete({ where: { id: existing.id } });
    } else {
      await db.subscription.create({ data: { channelId, deviceId } });

      /* Kanal egasiga bildirishnoma (o'zi bo'lsa yo'q) */
      try {
        const actor = await db.user.findUnique({
          where: { deviceKey: deviceId },
          select: { name: true },
        });
        if (actor && channel.deviceKey !== deviceId) {
          await db.notification.create({
            data: {
              deviceKey: channel.deviceKey,
              type: "subscribe",
              text: "",
              actorName: actor.name,
            },
          });
        }
      } catch (notifError) {
        console.error("subscribe notification error:", notifError);
      }
    }

    const count = await db.subscription.count({ where: { channelId } });
    const subscribed = !existing;

    return NextResponse.json({ ok: true, subscribed, count });
  } catch (error) {
    console.error("/api/subscribe error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
