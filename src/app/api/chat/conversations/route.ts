import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  ensureChatProfile,
  partnerKeyOf,
  serializeChatProfile,
  serializeMessage,
  touchPresence,
} from "@/lib/chat-server";
import type { ChatConversationItem } from "@/lib/randap-types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceKey = (searchParams.get("deviceKey") ?? "").trim();
    if (!deviceKey) {
      return NextResponse.json({ ok: false, error: "deviceKey kerak" }, { status: 400 });
    }

    await ensureChatProfile(deviceKey);
    await touchPresence(deviceKey);

    const conversations = await db.conversation.findMany({
      where: {
        OR: [{ userAKey: deviceKey }, { userBKey: deviceKey }],
        // Tugagan random chatlar ro'yxatda ko'rinmaydi
        AND: [{ OR: [{ isRandom: false }, { endedAt: null }] }],
      },
      orderBy: { lastMessageAt: "desc" },
      take: 60,
    });

    const partnerKeys = Array.from(
      new Set(conversations.map((c) => partnerKeyOf(c, deviceKey)))
    );
    const partners = await db.chatProfile.findMany({
      where: { deviceKey: { in: partnerKeys } },
    });
    const partnerMap = new Map(partners.map((p) => [p.deviceKey, p]));

    const items: ChatConversationItem[] = await Promise.all(
      conversations.map(async (conv) => {
        const partnerKey = partnerKeyOf(conv, deviceKey);
        const partnerRow = partnerMap.get(partnerKey);
        const lastMessage = await db.message.findFirst({
          where: { conversationId: conv.id },
          orderBy: { createdAt: "desc" },
        });
        const unreadCount = await db.message.count({
          where: {
            conversationId: conv.id,
            senderKey: { not: deviceKey },
            readAt: null,
          },
        });

        return {
          id: conv.id,
          isRandom: conv.isRandom,
          ended: conv.endedAt !== null,
          partner: partnerRow ? serializeChatProfile(partnerRow) : null,
          lastMessage: lastMessage ? serializeMessage(lastMessage, deviceKey) : null,
          unreadCount,
          updatedAt: conv.lastMessageAt.toISOString(),
        };
      })
    );

    return NextResponse.json({ ok: true, conversations: items });
  } catch (error) {
    console.error("/api/chat/conversations GET error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}
