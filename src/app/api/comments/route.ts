import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDeviceKeyFromRequest } from "@/lib/randap-server";

async function upsertUser(deviceKey: string) {
  const existing = await db.user.findUnique({ where: { deviceKey } });
  if (existing) return existing;

  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  let handle = `@randap_${suffix.toLowerCase()}`;
  const handleExists = await db.user.findUnique({ where: { handle } });
  if (handleExists) handle = `@randap_${Date.now().toString(36).slice(-6)}`;

  return db.user.create({
    data: { deviceKey, name: `RandapUser ${suffix}`, handle },
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = (searchParams.get("videoId") ?? "").trim();

    if (!videoId) {
      return NextResponse.json(
        { ok: false, error: "videoId kerak" },
        { status: 400 }
      );
    }

    const comments = await db.comment.findMany({
      where: { videoId, parentId: null },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        author: { select: { id: true, name: true, handle: true, avatar: true } },
        replies: {
          orderBy: { createdAt: "asc" },
          take: 50,
          include: { author: { select: { id: true, name: true, handle: true, avatar: true } } },
        },
      },
    });

    return NextResponse.json({ ok: true, comments });
  } catch (error) {
    console.error("/api/comments GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      videoId?: string;
      deviceId?: string;
      body?: string;
      parentId?: string;
    } | null;

    const videoId = (body?.videoId ?? "").trim();
    const deviceId =
      getDeviceKeyFromRequest(req) || (body?.deviceId ?? "").trim();
    const text = (body?.body ?? "").trim();
    const parentId = (body?.parentId ?? "").trim() || null;

    if (!videoId || !deviceId || !text) {
      return NextResponse.json(
        { ok: false, error: "videoId, deviceId va xabar kerak" },
        { status: 400 }
      );
    }
    if (text.length > 1000) {
      return NextResponse.json(
        { ok: false, error: "Izoh 1000 belgidan oshmasligi kerak" },
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

    // "Chat mumkinmi yo'qmi" belgisi: agarda chat o'chirilgan bo'lsa izoh qabul qilinmaydi
    if (!video.allowComments) {
      return NextResponse.json(
        { ok: false, error: "Bu videoda izohlar o'chirilgan" },
        { status: 403 }
      );
    }

    const author = await upsertUser(deviceId);

    // Javob (reply) uchun ota izoh tekshiruvi
    let parentComment: {
      id: string;
      authorId: string;
      videoId: string;
    } | null = null;
    if (parentId) {
      parentComment = await db.comment.findUnique({
        where: { id: parentId },
        select: { id: true, authorId: true, videoId: true },
      });
      if (!parentComment || parentComment.videoId !== videoId) {
        return NextResponse.json(
          { ok: false, error: "Javob beriladigan izoh topilmadi" },
          { status: 404 }
        );
      }
    }

    const created = await db.comment.create({
      data: {
        videoId,
        authorId: author.id,
        body: text,
        ...(parentId ? { parentId } : {}),
      },
      include: { author: { select: { id: true, name: true, handle: true, avatar: true } } },
    });

    /* Bildirishnomalar: video egasiga yoki ota izoh egasiga (o'zi yozgan bo'lsa yo'q) */
    try {
      const targets: string[] = [];
      if (parentComment && parentComment.authorId !== author.id) {
        const parentAuthor = await db.user.findUnique({
          where: { id: parentComment.authorId },
          select: { deviceKey: true, name: true },
        });
        if (parentAuthor) targets.push(parentAuthor.deviceKey);
      }
      if (video.uploaderId !== author.id) {
        const uploader = await db.user.findUnique({
          where: { id: video.uploaderId },
          select: { deviceKey: true },
        });
        if (uploader) {
          const dup = await db.notification.findFirst({
            where: {
              deviceKey: uploader.deviceKey,
              type: parentComment ? "reply" : "comment",
              videoId,
              actorName: author.name,
              createdAt: { gte: new Date(Date.now() - 60_000) },
            },
          });
          if (!dup) targets.push(uploader.deviceKey);
        }
      }
      const uniqueTargets = [...new Set(targets)];
      if (uniqueTargets.length > 0) {
        await db.notification.createMany({
          data: uniqueTargets.map((key) => ({
            deviceKey: key,
            type: parentComment ? "reply" : "comment",
            text: text.slice(0, 140),
            actorName: author.name,
            videoId,
          })),
        });
      }
    } catch (notifError) {
      console.error("notification create error:", notifError);
    }

    const count = await db.comment.count({ where: { videoId } });

    return NextResponse.json({ ok: true, comment: created, count });
  } catch (error) {
    console.error("/api/comments POST error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
