import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDeviceKeyFromRequest } from "@/lib/randap-server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = (searchParams.get("id") ?? "").trim();
    const deviceKey = getDeviceKeyFromRequest(
      req,
      searchParams.get("deviceKey")
    );

    if (!id) {
      return NextResponse.json({ ok: false, error: "id kerak" }, { status: 400 });
    }

    const channel = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        handle: true,
        avatar: true,
        points: true,
        createdAt: true,
      },
    });

    if (!channel) {
      return NextResponse.json(
        { ok: false, error: "Kanal topilmadi" },
        { status: 404 }
      );
    }

    const videos = await db.video.findMany({
      where: { uploaderId: channel.id },
      orderBy: { createdAt: "desc" },
      take: 60,
      include: {
        uploader: {
          select: { id: true, name: true, handle: true, avatar: true },
        },
      },
    });

    const withCounts = await Promise.all(
      videos.map(async (v) => ({
        id: v.id,
        title: v.title,
        description: v.description,
        thumbPath: v.thumbPath,
        videoPath: v.videoPath,
        kind: v.kind,
        durationSec: v.durationSec,
        allowComments: v.allowComments,
        views: v.views,
        createdAt: v.createdAt,
        uploader: v.uploader,
        likeCount: await db.like.count({ where: { videoId: v.id } }),
        commentCount: await db.comment.count({ where: { videoId: v.id } }),
      }))
    );

    const [subscriberCount, subscribedByMe] = await Promise.all([
      db.subscription.count({ where: { channelId: channel.id } }),
      deviceKey
        ? db.subscription.findUnique({
            where: {
              channelId_deviceId: { channelId: channel.id, deviceId: deviceKey },
            },
          })
        : Promise.resolve(null),
    ]);

    return NextResponse.json({
      ok: true,
      channel: {
        id: channel.id,
        name: channel.name,
        handle: channel.handle,
        avatar: channel.avatar,
        points: channel.points,
        subscriberCount,
        subscribedByMe: Boolean(subscribedByMe),
        videoCount: withCounts.length,
        videos: withCounts,
      },
    });
  } catch (error) {
    console.error("/api/channel GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
