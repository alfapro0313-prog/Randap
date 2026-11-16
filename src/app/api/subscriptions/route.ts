import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/subscriptions?deviceId=
 * Sidenin tepasidagi "OBUNALAR" bo'limi uchun obuna bo'lgan kanallar.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceId = (searchParams.get("deviceId") ?? "").trim();

    if (!deviceId) {
      return NextResponse.json({ ok: true, channels: [] });
    }

    const subs = await db.subscription.findMany({
      where: { deviceId },
      orderBy: { createdAt: "desc" },
      take: 30,
      include: {
        channel: {
          select: { id: true, name: true, handle: true, avatar: true },
        },
      },
    });

    return NextResponse.json({
      ok: true,
      channels: subs.map((s) => s.channel),
    });
  } catch (error) {
    console.error("/api/subscriptions error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
