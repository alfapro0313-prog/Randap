import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  ensureChatProfile,
  partnerKeyOf,
  serializeChatProfile,
  serializeMessage,
  touchPresence,
} from "@/lib/chat-server";

const TYPING_WINDOW_MS = 3000;
const MAX_TEXT_LEN = 2000;

async function loadConversation(conversationId: string, deviceKey: string) {
  const conv = await db.conversation.findUnique({ where: { id: conversationId } });
  if (!conv) return null;
  if (conv.userAKey !== deviceKey && conv.userBKey !== deviceKey) return null;
  return conv;
}

/** Suhbat xabarlarini olish (polling) — partner holati: online / yozmoqda / tugagan */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceKey = (searchParams.get("deviceKey") ?? "").trim();
    const conversationId = (searchParams.get("conversationId") ?? "").trim();
    if (!deviceKey || !conversationId) {
      return NextResponse.json(
        { ok: false, error: "deviceKey va conversationId kerak" },
        { status: 400 }
      );
    }

    const conv = await loadConversation(conversationId, deviceKey);
    if (!conv) {
      return NextResponse.json({ ok: false, error: "Suhbat topilmadi" }, { status: 404 });
    }

    const partnerKey = partnerKeyOf(conv, deviceKey);
    const [messages, partnerRow, typingRow] = await Promise.all([
      db.message.findMany({
        where: { conversationId: conv.id },
        orderBy: { createdAt: "asc" },
        take: 300,
      }),
      db.chatProfile.findUnique({ where: { deviceKey: partnerKey } }),
      db.typingState.findUnique({
        where: { conversationId_userKey: { conversationId: conv.id, userKey: partnerKey } },
      }),
    ]);

    // Men ochiq ko'rayotganim uchun yangi xabarlarni o'qilgan deb belgilaymiz
    await db.message.updateMany({
      where: { conversationId: conv.id, senderKey: { not: deviceKey }, readAt: null },
      data: { readAt: new Date() },
    });
    await touchPresence(deviceKey);

    const typing =
      typingRow !== null && Date.now() - typingRow.updatedAt.getTime() < TYPING_WINDOW_MS;

    return NextResponse.json({
      ok: true,
      isRandom: conv.isRandom,
      ended: conv.endedAt !== null,
      partner: partnerRow ? serializeChatProfile(partnerRow) : null,
      partnerTyping: typing,
      partnerOnline: partnerRow ? Date.now() - partnerRow.lastSeenAt.getTime() < 30_000 : false,
      messages: messages.map((m) => serializeMessage(m, deviceKey)),
    });
  } catch (error) {
    console.error("/api/chat/messages GET error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}

/** Xabar yuborish: text / sticker / image */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      deviceKey?: string;
      conversationId?: string;
      kind?: string;
      content?: string;
    } | null;

    const deviceKey = (body?.deviceKey ?? "").trim();
    const conversationId = (body?.conversationId ?? "").trim();
    const kind = (body?.kind ?? "text").trim();
    const content = (body?.content ?? "").trim();

    if (!deviceKey || !conversationId) {
      return NextResponse.json(
        { ok: false, error: "deviceKey va conversationId kerak" },
        { status: 400 }
      );
    }

    const conv = await loadConversation(conversationId, deviceKey);
    if (!conv) {
      return NextResponse.json({ ok: false, error: "Suhbat topilmadi" }, { status: 404 });
    }
    if (conv.endedAt) {
      return NextResponse.json({ ok: false, error: "Chat tugagan" }, { status: 400 });
    }

    if (kind === "text") {
      if (!content || content.length > MAX_TEXT_LEN) {
        return NextResponse.json(
          { ok: false, error: `Xabar 1-${MAX_TEXT_LEN} belgi orasida bo'lishi kerak` },
          { status: 400 }
        );
      }
    } else if (kind === "sticker") {
      if (!content || content.length > 16) {
        return NextResponse.json({ ok: false, error: "Stiker noto'g'ri" }, { status: 400 });
      }
    } else if (kind === "image") {
      if (!content.startsWith("uploads/chat/")) {
        return NextResponse.json({ ok: false, error: "Rasm manzili noto'g'ri" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ ok: false, error: "Xabar turi noto'g'ri" }, { status: 400 });
    }

    await ensureChatProfile(deviceKey);

    const partnerKey = partnerKeyOf(conv, deviceKey);
    const [message] = await Promise.all([
      db.message.create({
        data: { conversationId: conv.id, senderKey: deviceKey, kind, content },
      }),
      db.conversation.update({
        where: { id: conv.id },
        data: { lastMessageAt: new Date() },
      }),
      // Sherik chatni o'chirib tashlagan bo'lsa — yangi xabar uni qayta ko'rsatadi
      db.conversation.update({
        where: { id: conv.id },
        data: partnerKey === conv.userAKey
          ? { hiddenForA: false }
          : { hiddenForB: false },
      }),
      db.typingState.upsert({
        where: { conversationId_userKey: { conversationId: conv.id, userKey: deviceKey } },
        create: { conversationId: conv.id, userKey: deviceKey, updatedAt: new Date(0) },
        update: { updatedAt: new Date(0) },
      }),
    ]);
    await touchPresence(deviceKey);

    return NextResponse.json({
      ok: true,
      message: serializeMessage(message, deviceKey),
    });
  } catch (error) {
    console.error("/api/chat/messages POST error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}
