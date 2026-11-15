import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  MAX_SHORT_SEC,
  MAX_THUMB_BYTES,
  MAX_VIDEO_BYTES,
  ensureUploadDirs,
  placeholderThumb,
  saveUpload,
  sha256,
} from "@/lib/randap-server";

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

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const deviceKey = String(form.get("deviceKey") ?? "").trim();
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const kind = String(form.get("kind") ?? "video").trim();
    const allowComments = String(form.get("allowComments") ?? "true") === "true";
    const durationSec = Math.round(Number(form.get("durationSec") ?? "0")) || 0;

    const file = form.get("file");
    const thumb = form.get("thumbnail");

    if (!deviceKey) {
      return NextResponse.json(
        { ok: false, error: "Profil aniqlanmadi. Sahifani yangilang." },
        { status: 400 }
      );
    }

    if (title.length < 2 || title.length > 100) {
      return NextResponse.json(
        { ok: false, error: "Video nomi 2-100 belgi orasida bo'lishi kerak." },
        { status: 400 }
      );
    }

    if (kind !== "video" && kind !== "short") {
      return NextResponse.json(
        { ok: false, error: "Turi noto'g'ri: video yoki short bo'lishi kerak." },
        { status: 400 }
      );
    }

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { ok: false, error: "Video fayl tanlanmagan." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("video/")) {
      return NextResponse.json(
        { ok: false, error: "Faqat video fayllar qabul qilinadi." },
        { status: 400 }
      );
    }

    if (file.size > MAX_VIDEO_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Video hajmi 300 MB dan oshmasligi kerak." },
        { status: 400 }
      );
    }

    // Shorts maksimal davomiyligi: 1:20 (80 soniya)
    if (kind === "short" && durationSec > MAX_SHORT_SEC) {
      return NextResponse.json(
        {
          ok: false,
          error: `Shorts ${MAX_SHORT_SEC} soniyadan (1:20) oshmasligi kerak. Bu video ${durationSec} soniya.`,
        },
        { status: 400 }
      );
    }

    const uploader = await upsertUser(deviceKey);

    // Dublikat tekshiruvi: fayl hash'i bazada bormi?
    const videoBuffer = Buffer.from(await file.arrayBuffer());
    const hash = sha256(videoBuffer);
    const duplicate = await db.video.findUnique({
      where: { hash },
      select: { id: true, title: true },
    });

    if (duplicate) {
      return NextResponse.json(
        {
          ok: false,
          duplicate: true,
          existingId: duplicate.id,
          error: `Bu video allaqachon Videos bo'limida qo'yilgan: "${duplicate.title}". Bir xil videoni yana yuklab bo'lmaydi.`,
        },
        { status: 409 }
      );
    }

    await ensureUploadDirs();

    const baseName = `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const videoPath = await saveUpload(
      videoBuffer,
      process.cwd() + "/public/uploads/videos",
      baseName,
      file.name,
      ".mp4"
    );

    // Thumbnail: foydalanuvchi yuklagan yoki avtomatik placeholder
    let thumbPath: string;
    if (thumb instanceof File && thumb.size > 0) {
      if (!thumb.type.startsWith("image/")) {
        return NextResponse.json(
          { ok: false, error: "Thumbnail rasm bo'lishi kerak." },
          { status: 400 }
        );
      }
      if (thumb.size > MAX_THUMB_BYTES) {
        return NextResponse.json(
          { ok: false, error: "Thumbnail 5 MB dan oshmasligi kerak." },
          { status: 400 }
        );
      }
      const thumbBuffer = Buffer.from(await thumb.arrayBuffer());
      thumbPath = await saveUpload(
        thumbBuffer,
        process.cwd() + "/public/uploads/thumbs",
        baseName,
        thumb.name,
        ".jpg"
      );
    } else {
      const svg = placeholderThumb(title);
      thumbPath = await saveUpload(
        Buffer.from(svg, "utf8"),
        process.cwd() + "/public/uploads/thumbs",
        baseName,
        "auto.svg",
        ".svg"
      );
    }

    const created = await db.video.create({
      data: {
        title,
        description: description || null,
        thumbPath,
        videoPath,
        hash,
        kind,
        durationSec,
        allowComments,
        uploaderId: uploader.id,
      },
    });

    return NextResponse.json({ ok: true, video: created });
  } catch (error) {
    console.error("/api/upload error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik yuz berdi." },
      { status: 500 }
    );
  }
}
