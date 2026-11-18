import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDeviceKeyFromRequest } from "@/lib/randap-server";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      id?: string;
      deviceId?: string;
    } | null;

    const videoId = (body?.id ?? "").trim();
    const deviceId =
      getDeviceKeyFromRequest(req) || (body?.deviceId ?? "").trim();

    if (!videoId || !deviceId) {
      return NextResponse.json(
        { ok: false, error: "id va deviceId kerak" },
        { status: 400 }
      );
    }

    const video = await db.video.findUnique({ where: { id: videoId } });
    if (!video) {
      return NextResponse.json(
        { ok: false, error: "Video topilmadi" },
        { status: 404 }
      );
    }

    const existing = await db.like.findUnique({
      where: { videoId_deviceId: { videoId, deviceId } },
    });

    if (existing) {
      await db.like.delete({ where: { id: existing.id } });
    } else {
      await db.like.create({ data: { videoId, deviceId } });

      /* Video egasiga bildirishnoma (o'zi bosgan bo'lsa yo'q) */
      try {
        const actor = await db.user.findUnique({
          where: { deviceKey: deviceId },
          select: { name: true },
        });
        const uploader = await db.user.findUnique({
          where: { id: video.uploaderId },
          select: { deviceKey: true },
        });
        if (actor && uploader && uploader.deviceKey !== deviceId) {
          await db.notification.create({
            data: {
              deviceKey: uploader.deviceKey,
              type: "like",
              text: video.title.slice(0, 140),
              actorName: actor.name,
              videoId,
            },
          });
        }
      } catch (notifError) {
        console.error("like notification error:", notifError);
      }
    }

    const count = await db.like.count({ where: { videoId } });

    return NextResponse.json({ ok: true, liked: !existing, count });
  } catch (error) {
    console.error("/api/video/like error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
