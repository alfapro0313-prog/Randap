import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

/** Chat rasmini bazadan o'qib, to'g'ridan-to'g'ri rasm sifatida qaytaradi */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const image = await db.chatImage.findUnique({ where: { id } });

    if (!image || !ALLOWED_MIME.has(image.mime)) {
      return new NextResponse("Not found", { status: 404 });
    }

    const bytes = Buffer.from(image.data, "base64");
    return new NextResponse(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": image.mime,
        "Content-Length": String(bytes.byteLength),
        // id hech qachon o'zgarmaydi — brauzer bir marta yuklab, keyin keshdan oladi
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("/api/chat/image GET error:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
