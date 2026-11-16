import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/search?q=
 * Qidiruv: videolar + PROFILLAR (odamlar nomi/handle bo'yicha).
 * SQLite case-insensitive qo'llab-quvvatlamasligi uchun JS da filtrlanadi.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();
    const lower = q.toLowerCase();

    if (!lower) {
      return NextResponse.json({ ok: true, users: [], videos: [] });
    }

    // --- Profillar: nom yoki handle bo'yicha ---
    const allUsers = await db.user.findMany({
      select: {
        id: true,
        name: true,
        handle: true,
        avatar: true,
        points: true,
        _count: { select: { videos: true } },
      },
      take: 200,
    });
    const users = allUsers
      .filter(
        (u) =>
          u.name.toLowerCase().includes(lower) ||
          u.handle.toLowerCase().includes(lower)
      )
      .slice(0, 8)
      .map((u) => ({
        id: u.id,
        name: u.name,
        handle: u.handle,
        avatar: u.avatar,
        points: u.points,
        videoCount: u._count.videos,
      }));

    // --- Videolar: nom/tavsif bo'yicha ---
    const recentVideos = await db.video.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        uploader: {
          select: { id: true, name: true, handle: true, avatar: true },
        },
      },
    });
    const matched = recentVideos.filter(
      (v) =>
        v.title.toLowerCase().includes(lower) ||
        (v.description ?? "").toLowerCase().includes(lower)
    );
    const videos = await Promise.all(
      matched.slice(0, 20).map(async (v) => ({
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

    return NextResponse.json({ ok: true, users, videos });
  } catch (error) {
    console.error("/api/search error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
