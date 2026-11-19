import { NextResponse } from "next/server";
import { unlink } from "node:fs/promises";
import path from "node:path";
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
        // O'chirgan tomonda eski tarix ko'rinmaydi (deletedForA/B)
        const sideFilter = conv.userAKey === deviceKey ? { deletedForA: false } : { deletedForB: false };
        const lastMessage = await db.message.findFirst({
          where: { conversationId: conv.id, deletedAt: null, ...sideFilter },
          orderBy: { createdAt: "desc" },
        });
        const unreadCount = await db.message.count({
          where: {
            conversationId: conv.id,
            senderKey: { not: deviceKey },
            readAt: null,
            deletedAt: null,
            ...sideFilter,
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
 * Chatni o'chirish — ikkala tomonda ham yo'qoladi:
 * xabarlar, rasmlar/skrinshotlar (baytlari bilan) o'chiriladi, suhbat ikkala ro'yxatdan yashiriladi.
 * Keyin qayta ochilsa — toza, bo'sh chat boshlanadi.
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

    // Ikkala tomon uchun ham o'chiriladi: xabarlar va rasmlar bazadan butunlay o'chadi
    const msgs = await db.message.findMany({
      where: { conversationId },
      select: { content: true },
    });
    const dbImageIds = msgs
      .filter((m) => m.content.startsWith("chat-images/"))
      .map((m) => m.content.slice("chat-images/".length));
    const filePaths = msgs
      .filter((m) => m.content.startsWith("uploads/chat/"))
      .map((m) => m.content);

    await db.$transaction([
      // Ikkala ro'yxatdan yashiriladi
      db.conversation.update({
        where: { id: conversationId },
        data: { hiddenForA: true, hiddenForB: true },
      }),
      // Xabarlar butunlay o'chadi — sherikning ochiq oynasi ham bo'shashadi
      db.message.deleteMany({ where: { conversationId } }),
      db.typingState.deleteMany({ where: { conversationId } }),
      // Rasm baytlari ham bo'shashadi
      ...(dbImageIds.length
        ? [db.chatImage.deleteMany({ where: { id: { in: dbImageIds } } })]
        : []),
    ]);

    // Eski fayl yo'li rasmlari (uploads/chat/...) — fayllarni ham o'chiramiz (xatosiga chidab)
    for (const p of filePaths) {
      try {
        await unlink(path.join(process.cwd(), "public", p));
      } catch {
        // fayl yo'q — muhim emas
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("/api/chat/conversations DELETE error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}
