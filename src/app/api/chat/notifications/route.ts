import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureChatProfile, touchPresence } from "@/lib/chat-server";
import type { ChatNotificationItem } from "@/lib/randap-types";

/** O'qilmagan xabarlar — kichkina "esemes" ko'rinishida chiqadi */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceKey = (searchParams.get("deviceKey") ?? "").trim();
    if (!deviceKey) {
      return NextResponse.json({ ok: false, error: "deviceKey kerak" }, { status: 400 });
    }

    await ensureChatProfile(deviceKey);
    await touchPresence(deviceKey);

    const unread = await db.message.findMany({
      where: {
        readAt: null,
        senderKey: { not: deviceKey },
        // Tizim xabarlari (__connected__/__left__) "esemes" bo'lmaydi
        kind: { not: "system" },
        // O'chirilgan rasm/skrinshotlar ham bildirishnoma bo'lmaydi
        deletedAt: null,
        // "Chatni o'chirilgan" eski xabarlar qayta esemes chiqmaydi
        OR: [
          { conversation: { userAKey: deviceKey }, deletedForA: false },
          { conversation: { userBKey: deviceKey }, deletedForB: false },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    const convIds = Array.from(new Set(unread.map((m) => m.conversationId)));
    const convs = await db.conversation.findMany({
      where: { id: { in: convIds } },
    });
    const convMap = new Map(convs.map((c) => [c.id, c]));

    const senderKeys = Array.from(new Set(unread.map((m) => m.senderKey)));
    const senders = await db.chatProfile.findMany({
      where: { deviceKey: { in: senderKeys } },
    });
    const senderMap = new Map(senders.map((p) => [p.deviceKey, p]));

    const valid = unread.filter((m) => {
      const conv = convMap.get(m.conversationId);
      if (!conv) return false;
      // Tugagan random chatdan kelgan xabarlar eski hisoblanadi
      if (conv.isRandom && conv.endedAt) return false;
      return true;
    });

    const notifications: ChatNotificationItem[] = valid.slice(0, 3).map((m) => {
      const sender = senderMap.get(m.senderKey);
      const preview =
        m.kind === "image"
          ? "[photo]"
          : m.kind === "sticker"
            ? m.content
            : m.content.slice(0, 60);
      return {
        conversationId: m.conversationId,
        senderName: sender?.name ?? "Randap",
        senderEmoji: sender?.emoji ?? "🙂",
        senderColor: sender?.color ?? "sky",
        preview,
        createdAt: m.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      ok: true,
      count: valid.length,
      notifications,
    });
  } catch (error) {
    console.error("/api/chat/notifications GET error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}
