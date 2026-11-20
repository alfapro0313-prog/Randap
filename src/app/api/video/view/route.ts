import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

/**
 * POST /api/video/view  { id, deviceKey }
 * Ko'rish hisoblagichi: har bir akkaunt (viewerKey = accountKey/deviceKey)
 * videoni FAQAT BIR MAROTA sanaydi. Chiqib qayta kirsa ham — ko'rish oshmidi.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      id?: string;
      deviceKey?: string;
    } | null;
    const videoId = (body?.id ?? "").trim();
    const viewerKey = (body?.deviceKey ?? "").trim();

    if (!videoId) {
      return NextResponse.json({ ok: false, error: "id kerak" }, { status: 400 });
    }
    // Akkaunt aniqlanmasa — sanalmaydi (bir akkaunt = bir marta qoidasi uchun)
    if (!viewerKey) {
      const v = await db.video.findUnique({
        where: { id: videoId },
        select: { views: true },
      });
      return NextResponse.json({ ok: true, views: v?.views ?? 0, counted: false });
    }

    // Birinchi ko'rishmi? Unikal o'chuvchi: (videoId, viewerKey)
    try {
      await db.videoView.create({ data: { videoId, viewerKey } });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        // Bu akkaunt videoni allaqachon ko'rgan — hisobga qo'shilmaydi
        const v = await db.video.findUnique({
          where: { id: videoId },
          select: { views: true },
        });
        return NextResponse.json({
          ok: true,
          views: v?.views ?? 0,
          counted: false,
        });
      }
      throw err;
    }

    const video = await db.video.update({
      where: { id: videoId },
      data: { views: { increment: 1 } },
      select: { views: true },
    });

    return NextResponse.json({ ok: true, views: video.views, counted: true });
  } catch (error) {
    console.error("/api/video/view error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
