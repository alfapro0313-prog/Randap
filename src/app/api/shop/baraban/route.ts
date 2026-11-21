import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureUser } from "@/lib/randap-server";
import {
  BARABAN_PRICE,
  BARABAN_PRIZES,
  SHOP_ITEMS,
  dzfFromCents,
} from "@/lib/shop-catalog";

/**
 * POST /api/shop/baraban
 * { deviceKey } — "B" omad barabani: balansdan 30 DZF yechiladi, server
 * tasodifiy sovg'a tanlaydi va darhol beradi.
 *   - 50 DZF  (6%)
 *   - 40 DZF  (14%)
 *   - 10 DZF  (35%)
 *   - tasodifiy stiker (45%) — hali olinmagan stiker; hammasi bor bo'lsa 0.1 DZF
 * Sovg'a serverda tanlanadi (client ishonchsiz). Har chaqiruv = yangi aylanish.
 */

const COST_CENTS = Math.round(BARABAN_PRICE * 100); // 3000

type Roll = "d50" | "d40" | "d10" | "sticker";

/** Baraban bo'laklari (client g'ildiragi bilan bir xil tartibda) */
const SEG: Record<string, number> = { d50: 0, d10: 1, d40: 2, sticker: 3 };

function roll(): Roll {
  const r = Math.random();
  if (r < 0.06) return "d50";
  if (r < 0.2) return "d40";
  if (r < 0.55) return "d10";
  return "sticker";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      deviceKey?: string;
    } | null;
    const deviceKey = (body?.deviceKey ?? "").trim();
    if (!deviceKey) {
      return NextResponse.json(
        { ok: false, error: "deviceKey kerak" },
        { status: 400 }
      );
    }

    const user = await ensureUser(deviceKey);

    const result = await db.$transaction(async (tx) => {
      const fresh = await tx.user.findUnique({ where: { id: user.id } });
      if (!fresh || fresh.dzfCents < COST_CENTS) return null;

      await tx.user.update({
        where: { id: user.id },
        data: { dzfCents: { decrement: COST_CENTS } },
      });

      const prize = roll();

      if (prize !== "sticker") {
        const winCents = Math.round(BARABAN_PRIZES[prize] * 100);
        const updated = await tx.user.update({
          where: { id: user.id },
          data: { dzfCents: { increment: winCents } },
          select: { dzfCents: true },
        });
        return { prize, winCents, dzfCents: updated.dzfCents, sticker: null };
      }

      // Stiker: hali olinmagan stikerlardan tasodifiy bittasi
      const owned = await tx.ownedItem.findMany({
        where: { deviceKey },
        select: { itemId: true },
      });
      const ownedSet = new Set(owned.map((o) => o.itemId));
      const pool = SHOP_ITEMS.filter(
        (i) => i.kind === "sticker" && !ownedSet.has(i.id)
      );

      if (pool.length === 0) {
        // Barcha stikerlar bor — 0.1 DZF beriladi
        const updated = await tx.user.update({
          where: { id: user.id },
          data: {
            dzfCents: { increment: Math.round(BARABAN_PRIZES.cash * 100) },
          },
          select: { dzfCents: true },
        });
        return {
          prize: "cash" as const,
          winCents: Math.round(BARABAN_PRIZES.cash * 100),
          dzfCents: updated.dzfCents,
          sticker: null,
        };
      }

      const pick = pool[Math.floor(Math.random() * pool.length)];
      await tx.ownedItem.create({
        data: { deviceKey, itemId: pick.id },
      });
      const updated = await tx.user.findUnique({
        where: { id: user.id },
        select: { dzfCents: true },
      });
      return {
        prize: "sticker" as const,
        winCents: 0,
        dzfCents: updated?.dzfCents ?? 0,
        sticker: { id: pick.id, emoji: pick.content, name: pick.name ?? "" },
      };
    });

    if (!result) {
      return NextResponse.json(
        { ok: false, error: "DZF yetarli emas", notEnough: true },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      seg: SEG[result.prize] ?? 0,
      winDzf: dzfFromCents(result.winCents),
      sticker: result.sticker,
      dzf: dzfFromCents(result.dzfCents),
    });
  } catch (error) {
    console.error("/api/shop/baraban POST error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
