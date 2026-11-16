import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { db } from "@/lib/db";
import {
  ensureUploadDirs,
  ensureUser,
  saveUpload,
  sha256,
  placeholderThumb,
  uploadBaseName,
  MAX_SHORT_SEC,
  MAX_VIDEO_BYTES,
  MAX_THUMB_BYTES,
  VIDEO_DIR,
  THUMB_DIR,
} from "@/lib/randap-server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const deviceKey = String(form.get("deviceKey") ?? "").trim();
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const kindRaw = String(form.get("kind") ?? "video").trim();
    const kind = kindRaw === "short" ? "short" : "video";
    const allowComments = String(form.get("allowComments") ?? "true") === "true";
    const durationSec = Math.max(
      0,
      Math.floor(Number(form.get("durationSec") ?? "0") || 0)
    );
    const file = form.get("file");
    const thumb = form.get("thumbnail");

    if (!deviceKey) {
      return NextResponse.json(
        { ok: false, error: "deviceKey kerak" },
        { status: 400 }
      );
    }
    if (title.length < 2 || title.length > 100) {
      return NextResponse.json(
        { ok: false, error: "Video nomi 2-100 belgi orasida bo'lishi kerak" },
        { status: 400 }
      );
    }
    if (!(file instanceof File) || !file.type.startsWith("video/")) {
      return NextResponse.json(
        { ok: false, error: "Video fayl yuklang (MP4, WebM, MOV)" },
        { status: 400 }
      );
    }
    if (file.size > MAX_VIDEO_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Video hajmi 300 MB dan oshmasligi kerak" },
        { status: 400 }
      );
    }
    // Shorts vaqti server tomonda ham qat'iy tekshiriladi
    if (kind === "short" && durationSec > MAX_SHORT_SEC) {
      return NextResponse.json(
        {
          ok: false,
          error: `Shorts uchun maksimal 1:20 (80 soniya). Bu video ${durationSec} soniya.`,
        },
        { status: 400 }
      );
    }

    // --- Dublikat tekshiruvi ---
    // 1) Bir xil fayl (hash) yoki 2) xuddi shu nomli video Videos bo'limida bormi?
    const buffer = Buffer.from(await file.arrayBuffer());
    const hash = sha256(buffer);

    const sameHash = await db.video.findUnique({ where: { hash } });
    if (sameHash) {
      return NextResponse.json(
        {
          ok: false,
          duplicate: true,
          existingId: sameHash.id,
          error: `Bu video allaqachon Videos bo'limida mavjud: "${sameHash.title}".`,
        },
        { status: 409 }
      );
    }

    const allVideos = await db.video.findMany({
      select: { id: true, title: true },
    });
    const sameTitle = allVideos.find(
      (v) => v.title.trim().toLowerCase() === title.toLowerCase()
    );
    if (sameTitle) {
      return NextResponse.json(
        {
          ok: false,
          duplicate: true,
          existingId: sameTitle.id,
          error: `"${title}" nomli video allaqachon Videos bo'limida qo'yilgan. Boshqa nom tanlang.`,
        },
        { status: 409 }
      );
    }

    // --- Fayllarni saqlash ---
    const user = await ensureUser(deviceKey);
    await ensureUploadDirs();
    const baseName = uploadBaseName();
    const videoPath = await saveUpload(
      buffer,
      VIDEO_DIR,
      baseName,
      file.name,
      ".mp4"
    );

    let thumbPath: string;
    if (thumb instanceof File && thumb.type.startsWith("image/")) {
      if (thumb.size > MAX_THUMB_BYTES) {
        return NextResponse.json(
          { ok: false, error: "Thumbnail rasm 5 MB dan kichik bo'lishi kerak" },
          { status: 400 }
        );
      }
      const thumbBuffer = Buffer.from(await thumb.arrayBuffer());
      thumbPath = await saveUpload(
        thumbBuffer,
        THUMB_DIR,
        `${baseName}-t`,
        thumb.name,
        ".jpg"
      );
    } else {
      // Rasm tanlanmasa — avtomatik placeholder rasm
      const fileName = `${baseName}.svg`;
      await writeFile(
        `${THUMB_DIR}/${fileName}`,
        placeholderThumb(title),
        "utf-8"
      );
      thumbPath = `uploads/thumbs/${fileName}`;
    }

    const video = await db.video.create({
      data: {
        title,
        description: description || null,
        thumbPath,
        videoPath,
        hash,
        kind,
        durationSec,
        allowComments,
        uploaderId: user.id,
      },
    });

    return NextResponse.json({ ok: true, video: { id: video.id } });
  } catch (error) {
    console.error("/api/upload error:", error);
    return NextResponse.json(
      { ok: false, error: "Yuklashda serverda xatolik" },
      { status: 500 }
    );
  }
}
