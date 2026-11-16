import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { ensureChatProfile, touchPresence } from "@/lib/chat-server";
import { uploadBaseName } from "@/lib/randap-server";

const MAX_IMAGE_BYTES = 6 * 1024 * 1024; // 6 MB

function safeExt(fileName: string, mimeType: string): string {
  const ext = path.extname(fileName).toLowerCase().replace(/[^a-z0-9.]/g, "");
  if (ext && ext.length <= 6 && [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) {
    return ext;
  }
  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/webp") return ".webp";
  if (mimeType === "image/gif") return ".gif";
  return ".jpg";
}

/** Chatga rasm yuborish */
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
    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Rasm juda katta (maks 6 MB)" },
        { status: 400 }
      );
    }

    await ensureChatProfile(deviceKey);
    await touchPresence(deviceKey);

    const buffer = Buffer.from(await file.arrayBuffer());
    const dir = path.join(process.cwd(), "public", "uploads", "chat");
    await mkdir(dir, { recursive: true });

    const baseName = uploadBaseName();
    const ext = safeExt(file.name, file.type);
    const full = path.join(dir, `${baseName}${ext}`);
    await writeFile(full, buffer);

    return NextResponse.json({ ok: true, url: `uploads/chat/${baseName}${ext}` });
  } catch (error) {
    console.error("/api/chat/upload POST error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}
