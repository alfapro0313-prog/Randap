import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureUser } from "@/lib/randap-server";
import { dzfFromCents } from "@/lib/shop-catalog";

/**
 * GET /api/leaderboard?deviceKey=&mode=dzf|points
 * "Dapzif" sahifasi: 2 ta reyting — DZF (pul) bo'yicha va ballar (testlar)
 * bo'yicha alohida. mode=points bo'lsa ball bo'yicha teriladi.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceKey = (searchParams.get("deviceKey") ?? "").trim();
    const mode = (searchParams.get("mode") ?? "dzf").trim() === "points" ? "points" : "dzf";

    let meId: string | null = null;
    if (deviceKey) {
      const me = await ensureUser(deviceKey);
      meId = me.id;
    }

    const users = await db.user.findMany({
      orderBy:
        mode === "points"
          ? [{ points: "desc" }, { dzfCents: "desc" }, { createdAt: "asc" }]
          : [{ dzfCents: "desc" }, { points: "desc" }, { createdAt: "asc" }],
      take: 50,
      select: {
        id: true,
        name: true,
        handle: true,
        avatar: true,
        points: true,
        dzfCents: true,
        _count: { select: { videos: true } },
      },
    });

    const leaders = users.map((u) => ({
      id: u.id,
      name: u.name,
      handle: u.handle,
      avatar: u.avatar,
      points: u.points,
      dzf: dzfFromCents(u.dzfCents),
      videoCount: u._count.videos,
      isMe: u.id === meId,
    }));

    const meIndex = leaders.findIndex((l) => l.isMe);
    const me =
      deviceKey && meIndex >= 0
        ? { ...leaders[meIndex], rank: meIndex + 1 }
        : null;

    return NextResponse.json({ ok: true, mode, leaders, me });
  } catch (error) {
    console.error("/api/leaderboard error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
