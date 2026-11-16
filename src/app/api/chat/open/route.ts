import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  ensureChatProfile,
  findOrCreateConversation,
  touchPresence,
} from "@/lib/chat-server";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      deviceKey?: string;
      peerKey?: string;
    } | null;

    const deviceKey = (body?.deviceKey ?? "").trim();
    const peerKey = (body?.peerKey ?? "").trim();

    if (!deviceKey || !peerKey || deviceKey === peerKey) {
      return NextResponse.json(
        { ok: false, error: "deviceKey va peerKey kerak" },
        { status: 400 }
      );
    }

    const peerProfile = await db.chatProfile.findUnique({ where: { deviceKey: peerKey } });
    if (!peerProfile) {
      return NextResponse.json({ ok: false, error: "Foydalanuvchi topilmadi" }, { status: 404 });
    }

    await ensureChatProfile(deviceKey);
    await touchPresence(deviceKey);

    const conversationId = await findOrCreateConversation(deviceKey, peerKey);
    return NextResponse.json({ ok: true, conversationId });
  } catch (error) {
    console.error("/api/chat/open POST error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}
