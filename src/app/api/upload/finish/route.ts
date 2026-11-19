import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureUser, placeholderThumb } from "@/lib/randap-server";

/**
 * Video/Shorts yuklash — 3-QADAM (finish).
 * Bo'laklardan sha256 hisoblanadi (dublikat tekshiruvi), thumbnail
 * bazaga saqlanadi va Video yozuvi yaratiladi:
 *   videoPath = "api/files/{uploadId}", thumbPath = "api/files/{thumbId}".
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      uploadId?: string;
      deviceKey?: string;
      title?: string;
      description?: string;
      kind?: string;
      allowComments?: boolean;
      durationSec?: number;
      thumbData?: string;
      thumbMime?: string;
    } | null;

    const uploadId = (body?.uploadId ?? "").trim();
    const deviceKey = (body?.deviceKey ?? "").trim();
    const title = (body?.title ?? "").trim();
    const description = (body?.description ?? "").trim();
    const kind = (body?.kind ?? "video").trim();
    const allowComments = body?.allowComments !== false;
    const durationSec = Math.max(0, Math.round(Number(body?.durationSec ?? 0) || 0));

    if (!uploadId || !deviceKey) {
      return NextResponse.json(
        { ok: false, error: "uploadId va deviceKey kerak" },
        { status: 400 }
      );
    }
    if (title.length < 2 || title.length > 100) {
      return NextResponse.json(
        { ok: false, error: "Nomi 2-100 belgi orasida bo'lishi kerak" },
        { status: 400 }
      );
    }
    if (kind !== "video" && kind !== "short") {
      return NextResponse.json({ ok: false, error: "Turi noto'g'ri" }, { status: 400 });
    }
    if (kind === "short" && durationSec > 80) {
      return NextResponse.json(
        { ok: false, error: "Shorts uchun maksimal 80 soniya" },
        { status: 400 }
      );
    }

    const uploadFile = await db.uploadFile.findUnique({ where: { id: uploadId } });
    if (!uploadFile) {
      return NextResponse.json({ ok: false, error: "Yuklash topilmadi" }, { status: 404 });
    }
    if (uploadFile.kind !== "video") {
      return NextResponse.json({ ok: false, error: "Yuklash turi noto'g'ri" }, { status: 400 });
    }

    // Bo'laklarni tartib bilan o'qib sha256 hisoblaymiz (xotiraga butun fayl olmaydi)
    const hash = createHash("sha256");
    let totalBytes = 0;
    let partCount = 0;
    const BATCH = 25;
    let cursor = 0;
    for (;;) {
      const parts = await db.uploadChunk.findMany({
        where: { fileId: uploadId, idx: { gte: cursor } },
        orderBy: { idx: "asc" },
        take: BATCH,
      });
      if (parts.length === 0) break;
      for (const part of parts) {
        hash.update(Buffer.from(part.data, "base64"));
        totalBytes += part.bytes;
        partCount += 1;
      }
      if (parts.length < BATCH) break;
      cursor = parts[parts.length - 1].idx + 1;
    }
    if (partCount === 0 || totalBytes === 0) {
      return NextResponse.json({ ok: false, error: "Fayl bo'sh — bo'laklar yuklanmagan" }, { status: 400 });
    }
    await db.uploadFile.update({ where: { id: uploadId }, data: { size: totalBytes } });

    // Dublikat tekshiruvi
    const digest = hash.digest("hex");
    const existing = await db.video.findUnique({ where: { hash: digest } });
    if (existing) {
      return NextResponse.json({
        ok: false,
        duplicate: true,
        error: "Bu video allaqachon yuklangan.",
        existingId: existing.id,
      });
    }

    const user = await ensureUser(deviceKey);

    // Thumbnail: klient yuborgan rasm yoki placeholder (bazaga saqlanadi)
    const thumbFile = await db.uploadFile.create({
      data: { mime: "image/jpeg", size: 0, kind: "thumb" },
    });
    let thumbMime = "image/jpeg";
    let thumbBase64: string | null = null;
    const rawThumb = (body?.thumbData ?? "").trim();
    if (rawThumb) {
      const commaIdx = rawThumb.indexOf(",");
      const header = commaIdx >= 0 ? rawThumb.slice(0, commaIdx) : "";
      thumbBase64 = commaIdx >= 0 ? rawThumb.slice(commaIdx + 1) : rawThumb;
      const headerMime = /data:([^;]+)/.exec(header)?.[1];
      if (headerMime && headerMime.startsWith("image/")) thumbMime = headerMime;
      else if ((body?.thumbMime ?? "").startsWith("image/")) thumbMime = body!.thumbMime!;
    } else {
      thumbMime = "image/svg+xml";
      thumbBase64 = Buffer.from(placeholderThumb(title), "utf8").toString("base64");
    }
    const thumbBytes = Buffer.from(thumbBase64, "base64");
    await db.uploadChunk.create({
      data: {
        fileId: thumbFile.id,
        idx: 0,
        data: thumbBase64,
        bytes: thumbBytes.byteLength,
      },
    });
    await db.uploadFile.update({
      where: { id: thumbFile.id },
      data: { mime: thumbMime, size: thumbBytes.byteLength },
    });

    const video = await db.video.create({
      data: {
        title,
        description: description || null,
        thumbPath: `api/files/${thumbFile.id}`,
        videoPath: `api/files/${uploadId}`,
        hash: digest,
        kind,
        durationSec,
        allowComments,
        uploaderId: user.id,
      },
    });

    return NextResponse.json({
      ok: true,
      video: {
        id: video.id,
        title: video.title,
        kind: video.kind,
      },
    });
  } catch (error) {
    console.error("/api/upload/finish POST error:", error);
    return NextResponse.json({ ok: false, error: "Yuklashda server xatoligi" }, { status: 500 });
  }
}
