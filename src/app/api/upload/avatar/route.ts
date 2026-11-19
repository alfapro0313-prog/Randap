import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureUser } from "@/lib/randap-server";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Profil avatari yuklash — bazada saqlanadi (Vercel'da fayl tizimi yo'q).
 * avatar = "api/files/{uploadId}" — /api/files/{id} orqali beriladi.
 */
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const deviceKey = String(form.get("deviceKey") ?? "").trim();
    const file = form.get("file");

    if (!deviceKey) {
      return NextResponse.json({ ok: false, error: "deviceKey kerak" }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Rasm fayl kerak" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ ok: false, error: "Faqat rasm fayllar" }, { status: 400 });
    }
    if (file.size > MAX_AVATAR_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Rasm juda katta (maks 5 MB)" },
        { status: 400 }
      );
    }

    const user = await ensureUser(deviceKey);

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadFile = await db.uploadFile.create({
      data: { mime: file.type, size: buffer.byteLength, kind: "avatar" },
    });
    await db.uploadChunk.create({
      data: {
        fileId: uploadFile.id,
        idx: 0,
        data: buffer.toString("base64"),
        bytes: buffer.byteLength,
      },
    });

    const avatarPath = `api/files/${uploadFile.id}`;

    const updated = await db.user.update({
      where: { id: user.id },
      data: { avatar: avatarPath },
    });

    return NextResponse.json({ ok: true, avatar: updated.avatar });
  } catch (error) {
    console.error("/api/upload/avatar POST error:", error);
    return NextResponse.json({ ok: false, error: "Yuklashda server xatoligi" }, { status: 500 });
  }
}
