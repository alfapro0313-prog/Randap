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
      return NextResponse.json(
        { ok: false, error: "id kerak" },
        { status: 400 }
      );
    }

    const video = await db.video.findUnique({
      where: { id },
      include: {
        uploader: { select: { id: true, name: true, handle: true } },
        comments: {
          orderBy: { createdAt: "desc" },
          take: 100,
          include: { author: { select: { id: true, name: true, handle: true } } },
        },
      },
    });

    if (!video) {
      return NextResponse.json(
        { ok: false, error: "Video topilmadi" },
        { status: 404 }
      );
    }

    const [likeCount, commentCount, likedByMe, subscriberCount, subscribedByMe] =
      await Promise.all([
        db.like.count({ where: { videoId: video.id } }),
        db.comment.count({ where: { videoId: video.id } }),
        deviceKey
          ? db.like.findUnique({
              where: { videoId_deviceId: { videoId: video.id, deviceId: deviceKey } },
            })
          : Promise.resolve(null),
        db.subscription.count({ where: { channelId: video.uploaderId } }),
        deviceKey
          ? db.subscription.findUnique({
              where: {
                channelId_deviceId: {
                  channelId: video.uploaderId,
                  deviceId: deviceKey,
                },
              },
            })
          : Promise.resolve(null),
      ]);

    return NextResponse.json({
      ok: true,
      video: {
        id: video.id,
        title: video.title,
        description: video.description,
        thumbPath: video.thumbPath,
        videoPath: video.videoPath,
        kind: video.kind,
        durationSec: video.durationSec,
        allowComments: video.allowComments,
        views: video.views,
        createdAt: video.createdAt,
        likeCount,
        commentCount,
        uploader: video.uploader,
        likedByMe: Boolean(likedByMe),
        subscribedByMe: Boolean(subscribedByMe),
        comments: video.comments,
        subscriberCount,
      },
    });
  } catch (error) {
    console.error("/api/video GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
