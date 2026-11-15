import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const kind = searchParams.get("kind") ?? "video"; // video | short | all
    const q = (searchParams.get("q") ?? "").trim();
    const uploaderId = (searchParams.get("uploaderId") ?? "").trim();
    const deviceId = (searchParams.get("deviceId") ?? "").trim();
    const subscribedOnly = searchParams.get("subscribedOnly") === "1";
    const limitRaw = Number(searchParams.get("limit") ?? "60");
    const limit = Math.min(100, Math.max(1, Math.floor(limitRaw) || 60));

    const where: Record<string, unknown> = {};

    if (kind === "video") where.kind = "video";
    if (kind === "short") where.kind = "short";

    if (uploaderId) where.uploaderId = uploaderId;

    if (subscribedOnly) {
      if (!deviceId) {
        return NextResponse.json({ ok: true, videos: [] });
      }
      const subs = await db.subscription.findMany({
        where: { deviceId },
        select: { channelId: true },
      });
      where.uploaderId = { in: subs.map((s) => s.channelId) };
      if (subs.length === 0) return NextResponse.json({ ok: true, videos: [] });
    }

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
      ];
    }

    const videos = await db.video.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { uploader: { select: { id: true, name: true, handle: true } } },
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

    return NextResponse.json({ ok: true, videos: withCounts });
  } catch (error) {
    console.error("/api/videos GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
