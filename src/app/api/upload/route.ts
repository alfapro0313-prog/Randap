import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureUser, MAX_SHORT_SEC, MAX_VIDEO_BYTES, UPLOAD_CHUNK_BYTES } from "@/lib/randap-server";

/**
 * Video/Shorts yuklash — 1-QADAM (init).
 * Vercel serverless'da so'rov tanasi 4.5MB bilan cheklangan va fayl tizimi
 * yo'q — shu sababli katta fayllar bo'laklab yuklanadi va baytlari bazada
 * saqlanadi:
 *   1) POST /api/upload        → uploadId + chunkSize
 *   2) POST /api/upload/chunk  → har bir bo'lak (bazaga yoziladi)
 *   3) POST /api/upload/finish → hash, thumbnail va Video yozuvi
 * Fayl keyin /api/files/{uploadId} orqali beriladi.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      deviceKey?: string;
      title?: string;
      description?: string;
      kind?: string;
      allowComments?: boolean;
      durationSec?: number;
      fileName?: string;
      fileSize?: number;
      mime?: string;
    } | null;

    const deviceKey = (body?.deviceKey ?? "").trim();
    const title = (body?.title ?? "").trim();
    const description = (body?.description ?? "").trim();
    const kind = (body?.kind ?? "video").trim();
    const allowComments = body?.allowComments !== false;
    const durationSec = Math.max(0, Math.round(Number(body?.durationSec ?? 0) || 0));
    const mime = (body?.mime ?? "").trim();
    const fileSize = Math.max(0, Math.round(Number(body?.fileSize ?? 0) || 0));

    if (!deviceKey) {
      return NextResponse.json({ ok: false, error: "deviceKey kerak" }, { status: 400 });
    }
    if (!mime.startsWith("video/")) {
      return NextResponse.json({ ok: false, error: "Video fayl tanlang" }, { status: 400 });
    }
    if (fileSize > MAX_VIDEO_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Video juda katta (maks 300 MB)" },
        { status: 400 }
      );
    }
    if (fileSize <= 0) {
      return NextResponse.json({ ok: false, error: "Fayl bo'sh" }, { status: 400 });
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
    if (kind === "short" && durationSec > MAX_SHORT_SEC) {
      return NextResponse.json(
        { ok: false, error: "Shorts uchun maksimal 80 soniya" },
        { status: 400 }
      );
    }

    await ensureUser(deviceKey);

    const uploadFile = await db.uploadFile.create({
      data: {
        mime: mime,
        size: fileSize,
        kind: "video",
      },
    });

    return NextResponse.json({
      ok: true,
      uploadId: uploadFile.id,
      chunkSize: UPLOAD_CHUNK_BYTES,
    });
  } catch (error) {
    console.error("/api/upload POST error:", error);
    return NextResponse.json({ ok: false, error: "Yuklashda server xatoligi" }, { status: 500 });
  }
}
