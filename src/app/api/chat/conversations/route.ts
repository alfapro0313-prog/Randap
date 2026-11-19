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
        AND: [
          // Tugagan random chatlar ro'yxatda ko'rinmaydi
          { OR: [{ isRandom: false }, { endedAt: null }] },
          // O'chirilgan (o'z tomondan yashirilgan) chatlar ko'rinmaydi
          {
            OR: [
              { userAKey: deviceKey, hiddenForA: false },
              { userBKey: deviceKey, hiddenForB: false },
            ],
          },
        ],
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
          where: { conversationId: conv.id, deletedAt: null },
          orderBy: { createdAt: "desc" },
        });
        const unreadCount = await db.message.count({
          where: {
            conversationId: conv.id,
            senderKey: { not: deviceKey },
            readAt: null,
            deletedAt: null,
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

/**
 * Chatni o'chirish — faqat o'z tomondan yashiriladi (sherikda suhbat qoladi).
 * Aytish joiz: sherik yangi xabar yozsa, suhbat qaytadan ro'yxatda ko'rinadi.
 */
export async function DELETE(req: Request) {
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
    if (!conv) {
      return NextResponse.json({ ok: false, error: "Suhbat topilmadi" }, { status: 404 });
    }
    if (conv.userAKey !== deviceKey && conv.userBKey !== deviceKey) {
      return NextResponse.json({ ok: false, error: "Ruxsat yo'q" }, { status: 403 });
    }

    const isA = conv.userAKey === deviceKey;
    await db.conversation.update({
      where: { id: conversationId },
      data: isA ? { hiddenForA: true } : { hiddenForB: true },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("/api/chat/conversations DELETE error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}
