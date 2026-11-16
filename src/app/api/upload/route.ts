import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  ensureUploadDirs,
  ensureUser,
  MAX_THUMB_BYTES,
  MAX_VIDEO_BYTES,
  placeholderThumb,
  saveUpload,
  sha256,
  uploadBaseName,
  VIDEO_DIR,
  THUMB_DIR,
} from "@/lib/randap-server";
import { writeFile } from "fs/promises";
import path from "path";

/** Video / Shorts yuklash */
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const deviceKey = String(form.get("deviceKey") ?? "").trim();
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const kind = String(form.get("kind") ?? "video").trim();
    const allowComments = String(form.get("allowComments") ?? "true") === "true";
    const durationSec = Math.max(0, Math.round(Number(form.get("durationSec") ?? 0) || 0));
    const file = form.get("file");
    const thumbnail = form.get("thumbnail");

    if (!deviceKey) {
      return NextResponse.json({ ok: false, error: "deviceKey kerak" }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Video fayl kerak" }, { status: 400 });
    }
    if (!file.type.startsWith("video/")) {
      return NextResponse.json({ ok: false, error: "Video fayl tanlang" }, { status: 400 });
    }
    if (file.size > MAX_VIDEO_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Video juda katta (maks 300 MB)" },
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
    if (thumbnail instanceof File) {
      if (!thumbnail.type.startsWith("image/")) {
        return NextResponse.json({ ok: false, error: "Thumbnail rasm bo'lishi kerak" }, { status: 400 });
      }
      if (thumbnail.size > MAX_THUMB_BYTES) {
        return NextResponse.json(
          { ok: false, error: "Thumbnail juda katta (maks 5 MB)" },
          { status: 400 }
        );
      }
    }

    const user = await ensureUser(deviceKey);
    const buffer = Buffer.from(await file.arrayBuffer());
    const hash = sha256(buffer);

    // Dublikat tekshiruvi
    const existing = await db.video.findUnique({ where: { hash } });
    if (existing) {
      return NextResponse.json({
        ok: false,
        duplicate: true,
        error: "Bu video allaqachon yuklangan.",
        existingId: existing.id,
      });
    }

    await ensureUploadDirs();
    const baseName = uploadBaseName();

    const videoPath = await saveUpload(buffer, VIDEO_DIR, baseName, file.name, ".mp4");

    let thumbPath: string;
    if (thumbnail instanceof File) {
      const thumbBuffer = Buffer.from(await thumbnail.arrayBuffer());
      thumbPath = await saveUpload(
        thumbBuffer,
        THUMB_DIR,
        `${baseName}-t`,
        thumbnail.name,
        ".jpg"
      );
    } else {
      const svg = placeholderThumb(title);
      const thumbFile = path.join(THUMB_DIR, `${baseName}-t.svg`);
      await writeFile(thumbFile, svg, "utf8");
      thumbPath = `uploads/thumbs/${baseName}-t.svg`;
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

    return NextResponse.json({
      ok: true,
      video: {
        id: video.id,
        title: video.title,
        kind: video.kind,
      },
    });
  } catch (error) {
    console.error("/api/upload POST error:", error);
    return NextResponse.json({ ok: false, error: "Yuklashda server xatoligi" }, { status: 500 });
  }
}
