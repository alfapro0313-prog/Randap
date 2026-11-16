import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/** "Yozmoqda..." holati — chaqiruvchi o'z yozish holatini yangilaydi */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      deviceKey?: string;
      conversationId?: string;
    } | null;

    const deviceKey = (body?.deviceKey ?? "").trim();
    const conversationId = (body?.conversationId ?? "").trim();
    if (!deviceKey || !conversationId) {
      return NextResponse.json(
        { ok: false, error: "deviceKey va conversationId kerak" },
        { status: 400 }
      );
    }

    const conv = await db.conversation.findUnique({ where: { id: conversationId } });
    if (
      !conv ||
      (conv.userAKey !== deviceKey && conv.userBKey !== deviceKey) ||
      conv.endedAt
    ) {
      return NextResponse.json({ ok: false }, { status: 404 });
    }

    await db.typingState.upsert({
      where: { conversationId_userKey: { conversationId, userKey: deviceKey } },
      create: { conversationId, userKey: deviceKey, updatedAt: new Date() },
      update: { updatedAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("/api/chat/typing POST error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}
