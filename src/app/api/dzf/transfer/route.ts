import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureUser } from "@/lib/randap-server";
import { ensureChatProfile, partnerKeyOf } from "@/lib/chat-server";
import { OTKAZ_ITEM_ID } from "@/lib/shop-catalog";
import { dzfFromCents } from "@/lib/shop-catalog";
import { sendPushToUser } from "@/lib/push-server";

/**
 * POST /api/dzf/transfer
 * { deviceKey, conversationId, amount } — amount DZF da (masalan 2.5)
 * Shartlar:
 *  - Foydalanuvchi do'kondan "O'tkaz" tovarini olgan bo'lishi kerak (2 DZF);
 *  - Suhbat oddiy (random bo'lmagan) va tugamagan bo'lishi kerak;
 *  - Balans yetarli bo'lishi kerak.
 * Natija: yuboruvchidan DZF yechiladi, sherikka qo'shiladi, suhbatga
 * kind:"dzf" tizim xabari tushadi, sherikka bildirishnoma + tashqi push ketadi.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      deviceKey?: string;
      conversationId?: string;
      amount?: number | string;
    } | null;

    const deviceKey = (body?.deviceKey ?? "").trim();
    const conversationId = (body?.conversationId ?? "").trim();
    const amountRaw = body?.amount;
    const amount =
      typeof amountRaw === "number" ? amountRaw : Number(String(amountRaw ?? "").replace(",", "."));

    if (!deviceKey || !conversationId) {
      return NextResponse.json(
        { ok: false, error: "deviceKey va conversationId kerak" },
        { status: 400 }
      );
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { ok: false, badAmount: true, error: "Summa noto'g'ri" },
        { status: 400 }
      );
    }

    const cents = Math.round(amount * 100);
    if (cents < 10) {
      return NextResponse.json(
        { ok: false, badAmount: true, error: "Eng kichik summa 0,1 DZF" },
        { status: 400 }
      );
    }
    if (cents > 1_000_000) {
      return NextResponse.json(
        { ok: false, badAmount: true, error: "Summa juda katta (maks 10 000 DZF)" },
        { status: 400 }
      );
    }

    const conv = await db.conversation.findUnique({ where: { id: conversationId } });
    if (!conv || (conv.userAKey !== deviceKey && conv.userBKey !== deviceKey)) {
      return NextResponse.json({ ok: false, error: "Suhbat topilmadi" }, { status: 404 });
    }
    if (conv.isRandom) {
      return NextResponse.json(
        { ok: false, error: "Random chatda pul o'tkazib bo'lmaydi" },
        { status: 400 }
      );
    }
    if (conv.endedAt) {
      return NextResponse.json({ ok: false, error: "Chat tugagan" }, { status: 400 });
    }

    const partnerKey = partnerKeyOf(conv, deviceKey);
    if (partnerKey === deviceKey) {
      return NextResponse.json({ ok: false, error: "O'ziga o'tkazib bo'lmaydi" }, { status: 400 });
    }

    // "O'tkaz" tovari tekshiruvi
    const owned = await db.ownedItem.findUnique({
      where: { deviceKey_itemId: { deviceKey, itemId: OTKAZ_ITEM_ID } },
    });
    if (!owned) {
      return NextResponse.json(
        { ok: false, otkazNotOwned: true, error: "Do'kondan 'O'tkaz' oling (2 DZF)" },
        { status: 403 }
      );
    }

    const senderProfile = await ensureChatProfile(deviceKey);
    await ensureUser(partnerKey);

    const result = await db.$transaction(async (tx) => {
      const fresh = await tx.user.findUnique({ where: { deviceKey } });
      if (!fresh || fresh.dzfCents < cents) return null;
      await tx.user.update({
        where: { deviceKey },
        data: { dzfCents: { decrement: cents } },
      });
      await tx.user.update({
        where: { deviceKey: partnerKey },
        data: { dzfCents: { increment: cents } },
      });
      const message = await tx.message.create({
        data: { conversationId: conv.id, senderKey: deviceKey, kind: "dzf", content: String(cents) },
      });
      await tx.conversation.update({
        where: { id: conv.id },
        data: { lastMessageAt: new Date() },
      });
      // Sherik chatni yashirgan bo'lsa — yangi xabar uni qayta ko'rsatadi
      await tx.conversation.update({
        where: { id: conv.id },
        data: partnerKey === conv.userAKey ? { hiddenForA: false } : { hiddenForB: false },
      });
      const updated = await tx.user.findUnique({
        where: { deviceKey },
        select: { dzfCents: true },
      });
      return { messageId: message.id, dzfCents: updated?.dzfCents ?? 0 };
    });

    if (!result) {
      return NextResponse.json({ ok: false, notEnough: true, error: "DZF yetarli emas" }, { status: 400 });
    }

    const dzfStr = String(dzfFromCents(cents));
    // Sherikka sayt bildirishnomasi
    await db.notification
      .create({
        data: {
          deviceKey: partnerKey,
          type: "dzf",
          text: `${dzfStr} DZF`,
          actorName: senderProfile.name,
        },
      })
      .catch(() => undefined);
    // Tashqi push (sayt yopiq bo'lsa ham)
    await sendPushToUser(partnerKey, {
      title: senderProfile.name,
      body: `Sizga ${dzfStr} DZF berdi 💸`,
      url: "/",
      tag: "dzf",
    });

    return NextResponse.json({
      ok: true,
      sent: dzfFromCents(cents),
      dzf: dzfFromCents(result.dzfCents),
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("/api/dzf/transfer error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}
