import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureUser } from "@/lib/randap-server";
import {
  SHOP_ITEMS,
  dzfFromCents,
  findShopItem,
} from "@/lib/shop-catalog";

/**
 * GET /api/shop?deviceKey=
 * DZF balansi + do'kondan olingan narsalar ro'yxatini qaytaradi.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceKey = (searchParams.get("deviceKey") ?? "").trim();
    if (!deviceKey) {
      return NextResponse.json(
        { ok: false, error: "deviceKey kerak" },
        { status: 400 }
      );
    }

    const user = await ensureUser(deviceKey);
    const owned = await db.ownedItem.findMany({
      where: { deviceKey },
      select: { itemId: true },
    });

    const ownedIds = owned.map((o) => o.itemId);
    const ownedContent = ownedIds
      .map((id) => findShopItem(id))
      .filter((i) => Boolean(i))
      .map((i) => ({ itemId: i!.id, content: i!.content }));

    return NextResponse.json({
      ok: true,
      dzf: dzfFromCents(user.dzfCents),
      ownedIds,
      owned: ownedContent,
    });
  } catch (error) {
    console.error("/api/shop GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/shop
 * { deviceKey, itemId } — DZF balansidan narx yechiladi, tovar foydalanuvchiga
 * biriktiriladi (OwnedItem). Avval tekshiriladi: tovar bor, hali olinmagan,
 * DZF yetarli.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      deviceKey?: string;
      itemId?: string;
    } | null;

    const deviceKey = (body?.deviceKey ?? "").trim();
    const itemId = (body?.itemId ?? "").trim();

    if (!deviceKey || !itemId) {
      return NextResponse.json(
        { ok: false, error: "deviceKey va itemId kerak" },
        { status: 400 }
      );
    }

    const item = findShopItem(itemId);
    if (!item || !SHOP_ITEMS.some((i) => i.id === itemId)) {
      return NextResponse.json(
        { ok: false, error: "Tovar topilmadi" },
        { status: 404 }
      );
    }

    const already = await db.ownedItem.findUnique({
      where: { deviceKey_itemId: { deviceKey, itemId } },
    });
    if (already) {
      return NextResponse.json(
        { ok: false, error: "Bu tovar allaqachon sizda bor", owned: true },
        { status: 400 }
      );
    }

    const priceCents = Math.round(item.price * 100);
    const user = await ensureUser(deviceKey);

    const result = await db.$transaction(async (tx) => {
      const fresh = await tx.user.findUnique({ where: { id: user.id } });
      if (!fresh || fresh.dzfCents < priceCents) {
        return null;
      }
      await tx.user.update({
        where: { id: user.id },
        data: { dzfCents: { decrement: priceCents } },
      });
      const ownedItem = await tx.ownedItem.create({
        data: { deviceKey, itemId },
      });
      const updated = await tx.user.findUnique({
        where: { id: user.id },
        select: { dzfCents: true },
      });
      return { ownedItem, dzfCents: updated?.dzfCents ?? 0 };
    });

    if (!result) {
      return NextResponse.json(
        { ok: false, error: "DZF yetarli emas", notEnough: true },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      dzf: dzfFromCents(result.dzfCents),
      itemId,
    });
  } catch (error) {
    console.error("/api/shop POST error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
