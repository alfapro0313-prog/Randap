import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureChatProfile, touchPresence } from "@/lib/chat-server";

const MAX_IMAGE_BYTES = 6 * 1024 * 1024; // 6 MB
const ALLOWED_MIME = ["image/png", "image/jpeg", "image/webp", "image/gif"];

/**
 * Chatga rasm/skrinshot yuklash.
 * Bazada (ChatImage jadvalida) saqlanadi — fayl tizimi yozilmaydi,
 * shuning uchun Vercel kabi read-only serverlarda ham ishlaydi.
 * Javob: { ok: true, url: "chat-images/<id>" }
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
    // SVG va boshqa noma'lum turlar xavfsizlik uchun qabul qilinmaydi
    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json(
        { ok: false, error: "Faqat PNG, JPG, WEBP yoki GIF rasm" },
        { status: 400 }
      );
    }
    if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Rasm juda katta (maks 6 MB)" },
        { status: 400 }
      );
    }

    await ensureChatProfile(deviceKey);

    const buffer = Buffer.from(await file.arrayBuffer());
    const image = await db.chatImage.create({
      data: { mime: file.type, data: buffer.toString("base64") },
    });

    await touchPresence(deviceKey);

    return NextResponse.json({ ok: true, url: `chat-images/${image.id}` });
  } catch (error) {
    console.error("/api/chat/upload POST error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}
