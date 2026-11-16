import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  ensureUploadDirs,
  ensureUser,
  saveUpload,
  uploadBaseName,
  MAX_THUMB_BYTES,
  THUMB_DIR,
} from "@/lib/randap-server";

export const runtime = "nodejs";

/** Profil rasmini yuklash: FormData { deviceKey, file(image) } → { ok, avatar } */
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const deviceKey = String(form.get("deviceKey") ?? "").trim();
    const file = form.get("file");

    if (!deviceKey) {
      return NextResponse.json(
        { ok: false, error: "deviceKey kerak" },
        { status: 400 }
      );
    }
    if (!(file instanceof File) || !file.type.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, error: "Rasm fayl yuklang (JPG, PNG, WebP)" },
        { status: 400 }
      );
    }
    if (file.size > MAX_THUMB_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Rasm hajmi 5 MB dan oshmasligi kerak" },
        { status: 400 }
      );
    }

    const user = await ensureUser(deviceKey);
    await ensureUploadDirs();

    const buffer = Buffer.from(await file.arrayBuffer());
    const baseName = `av-${uploadBaseName()}`;
    const url = await saveUpload(
      buffer,
      THUMB_DIR,
      baseName,
      file.name,
      ".png"
    );

    await db.user.update({
      where: { id: user.id },
      data: { avatar: url },
    });

    return NextResponse.json({ ok: true, avatar: url });
  } catch (error) {
    console.error("/api/upload/avatar error:", error);
    return NextResponse.json(
      { ok: false, error: "Rasm yuklashda serverda xatolik" },
      { status: 500 }
    );
  }
}
