import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminDevice } from "@/lib/randap-server";
import { isAdminGmail } from "@/lib/randap-admin";

/**
 * ADMIN PANEL API (faqat sayt egasi uchun):
 *  GET  ?deviceKey=           — saytga kirganlar ro'yxati (ism, gmail, tashriflar,
 *                               oxirgi ko'rinish, blok holati va sababi);
 *  POST {deviceKey, gmail, action, hours?, reason?}
 *       action "block"   — gmail'ni `hours` soatga (0 = butunlay) bloklash,
 *                          admin sababi bilan (foydalanuvchi kirishda ko'radi);
 *       action "unblock" — blokni olib tashlash;
 *       action "delete"  — hisobni BUTUNLAY o'chirish: Account, User, barcha
 *                          videolar, chatlar, layklar, bildirishnomalar va h.k.
 * Blok gmail bo'yicha beriladi — shu gmail bilan qayta kirish ham yopiladi.
 */

/** Doimiy blok — 9999-yilgacha (deyarli abadiy) */
const PERMANENT_MS = 253402300000000;

/** "Online" oynasi — oxirgi 3 daqiqada ping yuborgan qurilmalar */
const ONLINE_MS = 3 * 60 * 1000;

function blockExpiry(hours: number): Date {
  if (!hours || hours <= 0) return new Date(PERMANENT_MS);
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

/**
 * Sayt statistikasi (admin panel "Statistika" tabi):
 *  - jami sahifa ko'rishlari + noyob mehmonlar (SiteVisit);
 *  - oxirgi 24 soatdagi mehmonlar;
 *  - HOZIR ONLINE: oxirgi 3 daqiqada yurak urishi bo'lgan qurilmalar
 *    (kirgan foydalanuvchilar ism+gmail bilan, anonimlar alohida sanaladi);
 *  - oxirgi 7 kunlik kunlik ko'rish/mehmon grafigi uchun ma'lumot.
 */
async function buildSiteStats() {
  const nowMs = Date.now();
  const onlineSince = new Date(nowMs - ONLINE_MS);
  const daySince = new Date(nowMs - 24 * 60 * 60 * 1000);

  const [totalViews, visitorGroups, dayGroups, presences] = await Promise.all([
    db.siteVisit.count(),
    db.siteVisit.groupBy({ by: ["visitorId"], _count: { _all: true } }),
    db.siteVisit.groupBy({
      by: ["visitorId"],
      where: { createdAt: { gte: daySince } },
    }),
    db.presence.findMany({ where: { updatedAt: { gte: onlineSince } } }),
  ]);

  // Oxirgi 7 kun: har kun uchun ko'rishlar + noyob mehmonlar (UTC kunlar)
  const days = await Promise.all(
    Array.from({ length: 7 }, (_, i) => {
      const start = new Date(nowMs - (6 - i) * 24 * 60 * 60 * 1000);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      return db.siteVisit
        .groupBy({
          by: ["visitorId"],
          where: { createdAt: { gte: start, lt: end } },
          _count: { _all: true },
        })
        .then((groups) => ({
          date: start.toISOString().slice(0, 10),
          views: groups.reduce((sum, g) => sum + g._count._all, 0),
          visitors: groups.length,
        }));
    })
  );

  // Online kirgan foydalanuvchilar — ism/gmail bilan
  const onlineKeys = [
    ...new Set(
      presences
        .map((p) => p.userKey)
        .filter((k): k is string => !!k)
    ),
  ];
  const onlineAccounts = onlineKeys.length
    ? await db.account.findMany({
        where: { accountKey: { in: onlineKeys } },
        select: { accountKey: true, name: true, gmail: true },
      })
    : [];
  const nameByKey = new Map(onlineAccounts.map((a) => [a.accountKey, a]));
  const seenKey = new Set<string>();
  const onlineUsers = presences
    .filter((p) => p.userKey && nameByKey.has(p.userKey))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .flatMap((p) => {
      if (!p.userKey || seenKey.has(p.userKey)) return [];
      seenKey.add(p.userKey);
      const acct = nameByKey.get(p.userKey)!;
      return [
        {
          name: acct.name,
          gmail: acct.gmail,
          path: p.path,
          at: new Date(p.updatedAt).getTime(),
        },
      ];
    });
  const onlineGuests = presences.filter((p) => !p.userKey).length;

  return {
    totalViews,
    totalVisitors: visitorGroups.length,
    visitors24h: dayGroups.length,
    onlineGuests,
    onlineUsers,
    days,
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceKey = (searchParams.get("deviceKey") ?? "").trim();
    if (!(await isAdminDevice(deviceKey))) {
      return NextResponse.json(
        { ok: false, error: "Faqat admin uchun" },
        { status: 403 }
      );
    }

    const accounts = await db.authAccount.findMany({
      orderBy: [{ lastSeenAt: "desc" }],
      take: 500,
    });

    const complaintCount = await db.complaint.count({
      where: { resolvedAt: null },
    });

    // Statistika xato bersa ham panel ochilib qoladi (stats null bo'ladi)
    let stats: Awaited<ReturnType<typeof buildSiteStats>> | null = null;
    try {
      stats = await buildSiteStats();
    } catch (statsError) {
      console.error("/api/admin stats error:", statsError);
    }

    return NextResponse.json({
      ok: true,
      accounts: accounts.map((a) => ({
        id: a.id,
        name: a.name,
        gmail: a.gmail,
        viaGoogle: a.viaGoogle,
        visits: a.visits,
        lastSeenAt: new Date(a.lastSeenAt).getTime(),
        createdAt: new Date(a.createdAt).getTime(),
        blockedUntil: a.blockedUntil
          ? new Date(a.blockedUntil).getTime()
          : null,
        blockReason: a.blockReason ?? null,
      })),
      openComplaints: complaintCount,
      stats,
    });
  } catch (error) {
    console.error("/api/admin GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      deviceKey?: string;
      gmail?: string;
      action?: "block" | "unblock" | "delete";
      hours?: number;
      reason?: string;
    } | null;
    const deviceKey = (body?.deviceKey ?? "").trim();
    const gmail = (body?.gmail ?? "").trim().toLowerCase();
    const action =
      body?.action === "unblock" || body?.action === "delete"
        ? body.action
        : "block";
    const hours = Math.max(0, Math.min(24 * 365, Number(body?.hours ?? 3)));
    const reason = (body?.reason ?? "").trim().slice(0, 300);

    if (!(await isAdminDevice(deviceKey))) {
      return NextResponse.json(
        { ok: false, error: "Faqat admin uchun" },
        { status: 403 }
      );
    }
    if (!gmail) {
      return NextResponse.json(
        { ok: false, error: "gmail kerak" },
        { status: 400 }
      );
    }
    // Admin o'zini bloklashi/o'chirishi mumkin emas
    if (isAdminGmail(gmail)) {
      return NextResponse.json(
        { ok: false, error: "Admin hisobini bloklash mumkin emas" },
        { status: 400 }
      );
    }

    /* ---------- UNBLOCK ---------- */
    if (action === "unblock") {
      const res = await db.authAccount.updateMany({
        where: { gmail },
        data: { blockedUntil: null, blockedAt: null, blockReason: null },
      });
      const res2 = await db.account.updateMany({
        where: { gmail },
        data: { blockedUntil: null, blockReason: null },
      });
      return NextResponse.json({ ok: true, action, count: res.count + res2.count });
    }

    /* ---------- DELETE: hisobni BUTUNLAY o'chirish ---------- */
    if (action === "delete") {
      const acct = await db.account.findUnique({ where: { gmail } });
      if (!acct) {
        // Yangi tizimda Account yo'q — eski AuthAccount qatorlarini o'chiramiz
        const gone = await db.authAccount.deleteMany({ where: { gmail } });
        if (gone.count === 0) {
          return NextResponse.json(
            { ok: false, error: "Bunday hisob topilmadi" },
            { status: 404 }
          );
        }
        return NextResponse.json({ ok: true, action, deleted: gone.count });
      }
      const key = acct.accountKey;
      const user = await db.user.findUnique({ where: { deviceKey: key } });

      // 1) Videolari (comment/like cascade bilan o'chadi)
      if (user) await db.video.deleteMany({ where: { uploaderId: user.id } });
      // 2) Chat qutisi (xabarlar cascade)
      await db.conversation.deleteMany({
        where: { OR: [{ userAKey: key }, { userBKey: key }] },
      });
      // 3) Qolgan kalitga bog'langan ma'lumotlar
      await db.like.deleteMany({ where: { deviceId: key } });
      if (user)
        await db.subscription.deleteMany({
          where: { OR: [{ deviceId: key }, { channelId: user.id }] },
        });
      if (user) await db.comment.deleteMany({ where: { authorId: user.id } });
      await db.notification.deleteMany({ where: { deviceKey: key } });
      await db.typingState.deleteMany({ where: { userKey: key } });
      await db.ownedItem.deleteMany({ where: { deviceKey: key } });
      await db.pushSubscription.deleteMany({ where: { deviceKey: key } });
      await db.quizAttempt.deleteMany({ where: { deviceId: key } });
      await db.randomQueue.deleteMany({ where: { deviceKey: key } });
      await db.videoView.deleteMany({ where: { viewerKey: key } });
      await db.complaint.deleteMany({
        where: { OR: [{ deviceKey: key }, { gmail }] },
      });
      await db.authAccount.deleteMany({ where: { OR: [{ deviceKey: key }, { gmail }] } });
      if (user) await db.user.delete({ where: { id: user.id } });
      await db.account.delete({ where: { id: acct.id } });

      return NextResponse.json({ ok: true, action, deleted: 1 });
    }

    /* ---------- BLOCK: muddat + sabab ---------- */
    const blockedUntil = blockExpiry(hours);
    const res = await db.authAccount.updateMany({
      where: { gmail },
      data: { blockedUntil, blockedAt: new Date(), blockReason: reason || null },
    });
    // Gmail asosidagi hisob ham bloklanadi — yangi qurilmadan kirishni ham yopadi
    const res2 = await db.account.updateMany({
      where: { gmail },
      data: { blockedUntil, blockReason: reason || null },
    });
    if (res.count === 0 && res2.count === 0) {
      return NextResponse.json(
        { ok: false, error: "Bunday hisob topilmadi" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      ok: true,
      action,
      count: res.count,
      blockedUntil: blockedUntil.getTime(),
    });
  } catch (error) {
    console.error("/api/admin POST error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
