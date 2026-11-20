import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { unlink } from "node:fs/promises";
import path from "node:path";
import {
  ensureChatProfile,
  partnerKeyOf,
  serializeChatProfile,
  serializeMessage,
  touchPresence,
} from "@/lib/chat-server";
import { CHAT_STICKERS } from "@/lib/chat-i18n";
import { findShopItemByContent } from "@/lib/shop-catalog";
import { sendPushToUser } from "@/lib/push-server";

const TYPING_WINDOW_MS = 3000;
const MAX_TEXT_LEN = 2000;

/**
 * Stiker yuborish huquqini tekshiradi:
 *  - bepul stikerlar (CHAT_STICKERS) hammaga ochiq;
 *  - do'kon stikeri faqat olib bo'lgan (OwnedItem) foydalanuvchiga.
 */
async function canUseSticker(deviceKey: string, content: string): Promise<boolean> {
  if (CHAT_STICKERS.includes(content)) return true;
  const item = findShopItemByContent(content);
  if (!item) return false;
  const owned = await db.ownedItem.findUnique({
    where: { deviceKey_itemId: { deviceKey, itemId: item.id } },
  });
  return Boolean(owned);
}

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
    // "Chatni o'chirish"dan keyin eski tarix faqat o'chirgan tomonda ko'rinmaydi
    const sideFilter = conv.userAKey === deviceKey ? { deletedForA: false } : { deletedForB: false };
    const [messages, partnerRow, typingRow] = await Promise.all([
      db.message.findMany({
        where: { conversationId: conv.id, deletedAt: null, ...sideFilter },
        orderBy: { createdAt: "asc" },
        take: 300,
      }),
      db.chatProfile.findUnique({ where: { deviceKey: partnerKey } }),
      db.typingState.findUnique({
        where: { conversationId_userKey: { conversationId: conv.id, userKey: partnerKey } },
      }),
    ]);

    // Men ochiq ko'rayotganim uchun yangi xabarlarni o'qilgan deb belgilaymiz
    // (o'zim o'chirib tashlagan eski xabarlar ham o'qilgan hisoblanadi — boshqa ko'rinmaydi)
    await db.message.updateMany({
      where: {
        conversationId: conv.id,
        senderKey: { not: deviceKey },
        readAt: null,
        ...(conv.userAKey === deviceKey ? { deletedForA: false } : { deletedForB: false }),
      },
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
    } else if (kind === "dzf") {
      // DZF xabarlarini faqat /api/dzf/transfer yaratadi — soxta yuborish taqiqlanadi
      return NextResponse.json({ ok: false, error: "Xabar turi noto'g'ri" }, { status: 400 });
    } else if (kind === "sticker") {
      if (!content || content.length > 16) {
        return NextResponse.json({ ok: false, error: "Stiker noto'g'ri" }, { status: 400 });
      }
      // Do'kon stikeri — faqat olib bo'lgan foydalanuvchi yubora oladi
      if (!(await canUseSticker(deviceKey, content))) {
        return NextResponse.json(
          { ok: false, stickerNotOwned: true, error: "Bu stiker sizniki emas — do'kondan oling" },
          { status: 403 }
        );
      }
    } else if (kind === "image") {
      // Yangi format: bazadagi rasm (chat-images/<id>) yoki eski fayl yo'li
      const valid =
        content.startsWith("chat-images/") || content.startsWith("uploads/chat/");
      if (!valid) {
        return NextResponse.json({ ok: false, error: "Rasm manzili noto'g'ri" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ ok: false, error: "Xabar turi noto'g'ri" }, { status: 400 });
    }

    await ensureChatProfile(deviceKey);

    const partnerKey = partnerKeyOf(conv, deviceKey);
    const senderProfile = await ensureChatProfile(deviceKey);
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

    // Tashqi push bildirishnoma (sayt yopiq bo'lsa ham chiqadi)
    const pushPreview =
      kind === "image"
        ? "\ud83d\udcf7 [photo]"
        : kind === "sticker"
          ? content
          : content.slice(0, 80);
    void sendPushToUser(partnerKey, {
      title: senderProfile.name,
      body: pushPreview,
      url: "/",
      tag: "chat",
    });

    return NextResponse.json({
      ok: true,
      message: serializeMessage(message, deviceKey),
    });
  } catch (error) {
    console.error("/api/chat/messages POST error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}

/**
 * Rasm/skrinshot xabarini o'chirish — ikkala tomonda ham yo'qoladi.
 * Rasm bazadagi ChatImage jadvalidan ham o'chiriladi (baytlar bo'shashadi).
 */
export async function DELETE(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      deviceKey?: string;
      conversationId?: string;
      messageId?: string;
    } | null;

    const deviceKey = (body?.deviceKey ?? "").trim();
    const conversationId = (body?.conversationId ?? "").trim();
    const messageId = (body?.messageId ?? "").trim();

    if (!deviceKey || !conversationId || !messageId) {
      return NextResponse.json(
        { ok: false, error: "deviceKey, conversationId va messageId kerak" },
        { status: 400 }
      );
    }

    const conv = await loadConversation(conversationId, deviceKey);
    if (!conv) {
      return NextResponse.json({ ok: false, error: "Suhbat topilmadi" }, { status: 404 });
    }

    const message = await db.message.findUnique({ where: { id: messageId } });
    if (!message || message.conversationId !== conv.id) {
      return NextResponse.json({ ok: false, error: "Xabar topilmadi" }, { status: 404 });
    }
    if (message.kind !== "image") {
      return NextResponse.json(
        { ok: false, error: "Faqat rasm/skrinshot o'chiriladi" },
        { status: 400 }
      );
    }
    if (message.deletedAt) {
      return NextResponse.json({ ok: true }); // allaqachon o'chirilgan
    }

    // Xabarni ikkala tomon uchun yashiramiz va rasm baytini bazadan o'chiramiz
    await db.$transaction(async (tx) => {
      await tx.message.update({
        where: { id: message.id },
        data: { deletedAt: new Date() },
      });
      // Yangi format: bazadagi rasm (chat-images/<id>) — jadvaldan o'chirish
      if (message.content.startsWith("chat-images/")) {
        const imageId = message.content.slice("chat-images/".length);
        await tx.chatImage.deleteMany({ where: { id: imageId } });
      }
    });

    // Eski fayl yo'li (uploads/chat/...) bo'lsa — faylni ham o'chirib tashlaymiz (xatosiga chidab)
    if (message.content.startsWith("uploads/chat/")) {
      try {
        const filePath = path.join(process.cwd(), "public", message.content);
        await unlink(filePath);
      } catch {
        // fayl yo'q yoki yozish mumkin emas — muhim emas, xabar baribir yashirildi
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("/api/chat/messages DELETE error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}
