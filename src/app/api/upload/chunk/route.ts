import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { UPLOAD_CHUNK_BYTES } from "@/lib/randap-server";

/**
 * Video/Shorts yuklash — 2-QADAM (bo'lak).
 * {uploadId, index, data: base64} — har bir bo'lak ~3MB xom bayt.
 * Bo'laklar UploadChunk jadvalida saqlanadi (idx tartib bilan).
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      uploadId?: string;
      index?: number;
      data?: string;
    } | null;

    const uploadId = (body?.uploadId ?? "").trim();
    const index = Math.round(Number(body?.index ?? -1));
    const data = body?.data ?? "";

    if (!uploadId) {
      return NextResponse.json({ ok: false, error: "uploadId kerak" }, { status: 400 });
    }
    if (!Number.isInteger(index) || index < 0 || index > 4096) {
      return NextResponse.json({ ok: false, error: "index noto'g'ri" }, { status: 400 });
    }
    if (typeof data !== "string" || data.length === 0) {
      return NextResponse.json({ ok: false, error: "Bo'lak ma'lumoti bo'sh" }, { status: 400 });
    }

    const uploadFile = await db.uploadFile.findUnique({ where: { id: uploadId } });
    if (!uploadFile) {
      return NextResponse.json({ ok: false, error: "Yuklash topilmadi" }, { status: 404 });
    }

    const bytes = Buffer.from(data, "base64");
    if (bytes.byteLength === 0) {
      return NextResponse.json({ ok: false, error: "Bo'lak ma'lumoti buzilgan" }, { status: 400 });
    }
    if (bytes.byteLength > UPLOAD_CHUNK_BYTES * 2) {
      return NextResponse.json({ ok: false, error: "Bo'lak juda katta" }, { status: 400 });
    }

    await db.uploadChunk.upsert({
      where: { fileId_idx: { fileId: uploadId, idx: index } },
      update: { data, bytes: bytes.byteLength },
      create: { fileId: uploadId, idx: index, data, bytes: bytes.byteLength },
    });

    return NextResponse.json({ ok: true, index, bytes: bytes.byteLength });
  } catch (error) {
    console.error("/api/upload/chunk POST error:", error);
    return NextResponse.json({ ok: false, error: "Bo'lak yuklashda xatolik" }, { status: 500 });
  }
}
