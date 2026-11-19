import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureUser, saveUpload, uploadBaseName, UPLOAD_ROOT } from "@/lib/randap-server";
import { mkdir } from "fs/promises";
import path from "path";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5 MB

/** Profil avatari yuklash */
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
    const dir = path.join(UPLOAD_ROOT, "avatars");
    await mkdir(dir, { recursive: true });

    const avatarPath = await saveUpload(buffer, dir, uploadBaseName(), file.name, ".jpg");

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
