import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDeviceKeyFromRequest } from "@/lib/randap-server";

/** GET /api/me/stats — profil statistikasi: video, ko'rish, layk, izoh, obunachi */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceKey =
      getDeviceKeyFromRequest(req) || (searchParams.get("deviceKey") ?? "").trim();
    if (!deviceKey) {
      return NextResponse.json({ ok: false, error: "deviceKey kerak" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { deviceKey },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({
        ok: true,
        stats: { videos: 0, views: 0, likes: 0, comments: 0, subscribers: 0 },
      });
    }

    const [videos, viewsAgg, likes, comments, subscribers] = await Promise.all([
      db.video.count({ where: { uploaderId: user.id } }),
      db.video.aggregate({
        where: { uploaderId: user.id },
        _sum: { views: true },
      }),
      db.like.count({ where: { video: { uploaderId: user.id } } }),
      db.comment.count({ where: { video: { uploaderId: user.id } } }),
      db.subscription.count({ where: { channelId: user.id } }),
    ]);

    return NextResponse.json({
      ok: true,
      stats: {
        videos,
        views: viewsAgg._sum.views ?? 0,
        likes,
        comments,
        subscribers,
      },
    });
  } catch (error) {
    console.error("/api/me/stats GET error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}
