import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as { id?: string } | null;
    const videoId = (body?.id ?? "").trim();

    if (!videoId) {
      return NextResponse.json({ ok: false, error: "id kerak" }, { status: 400 });
    }

    const video = await db.video.update({
      where: { id: videoId },
      data: { views: { increment: 1 } },
      select: { views: true },
    });

    return NextResponse.json({ ok: true, views: video.views });
  } catch (error) {
    console.error("/api/video/view error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
