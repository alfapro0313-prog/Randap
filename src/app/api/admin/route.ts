import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminDevice } from "@/lib/randap-server";
import { BLOCK_HOURS, isAdminGmail } from "@/lib/randap-admin";

/**
 * ADMIN PANEL API (faqat sayt egasi uchun):
 *  GET  ?deviceKey=           — saytga kirganlar ro'yxati (ism, gmail, tashriflar,
 *                               oxirgi ko'rinish, blok holati);
 *  POST {deviceKey, gmail, action} — action "block" (3 soatga) | "unblock".
 * Blok gmail bo'yicha beriladi — shu gmail bilan qayta kirish ham yopiladi.
 */
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
      })),
      openComplaints: complaintCount,
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
      action?: "block" | "unblock";
    } | null;
    const deviceKey = (body?.deviceKey ?? "").trim();
    const gmail = (body?.gmail ?? "").trim().toLowerCase();
    const action = body?.action === "unblock" ? "unblock" : "block";

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
    // Admin o'zini bloklashi mumkin emas
    if (isAdminGmail(gmail)) {
      return NextResponse.json(
        { ok: false, error: "Admin hisobini bloklash mumkin emas" },
        { status: 400 }
      );
    }

    if (action === "unblock") {
      const res = await db.authAccount.updateMany({
        where: { gmail },
        data: { blockedUntil: null, blockedAt: null },
      });
      const res2 = await db.account.updateMany({
        where: { gmail },
        data: { blockedUntil: null },
      });
      return NextResponse.json({ ok: true, action, count: res.count + res2.count });
    }

    const blockedUntil = new Date(Date.now() + BLOCK_HOURS * 60 * 60 * 1000);
    const res = await db.authAccount.updateMany({
      where: { gmail },
      data: { blockedUntil, blockedAt: new Date() },
    });
    // Gmail asosidagi hisob ham bloklanadi — yangi qurilmadan kirishni ham yopadi
    const res2 = await db.account.updateMany({
      where: { gmail },
      data: { blockedUntil },
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
