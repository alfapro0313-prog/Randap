import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * SAYT STATISTIKASI — sahifa ko'rishlari va "hozir online" holati (admin panel).
 *
 *  POST { kind: "view" | "ping", visitorId, path?, userKey? }
 *   - "view"  : yangi sahifa ko'rildi — SiteVisit qatori qo'shiladi;
 *               jami ko'rishlar + noyob mehmonlar shu jadvaldan hisoblanadi;
 *   - "ping"  : har 60 soniyada yurak urishi — Presence yangilanadi.
 *               Online = oxirgi 3 daqiqada ping yuborgan qurilmalar.
 *
 * Anonim mehmonlar ham sanaladi (visitorId = qurilma kaliti). Hisob
 * yozuvlari 90 kundan keyin vaqti-vaqti bilan tozalab boriladi.
 * Statistika hech qachon sayt ishlashiga xalaqit bermasligi kerak —
 * barcha xatolar jim o'tkazib yuboriladi.
 */

/** Yaroqsiz/qisqa qiymatlarni tozalash */
function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      kind?: string;
      visitorId?: string;
      path?: string;
      userKey?: string;
    } | null;

    const visitorId = clean(body?.visitorId, 100);
    if (!visitorId) {
      return NextResponse.json({ ok: false, error: "visitorId kerak" });
    }
    const path = clean(body?.path, 300) || "/";
    const userKey = clean(body?.userKey, 120) || null;

    if (body?.kind === "ping") {
      // Yurak urishi: bir qurilma = bitta Presence qatori, updatedAt siljiydi
      await db.presence.upsert({
        where: { visitorId },
        update: { userKey, path, updatedAt: new Date() },
        create: { visitorId, userKey, path },
      });
    } else {
      // Yangi sahifa ko'rishi
      await db.siteVisit.create({ data: { visitorId, path, userKey } });
    }

    // Vaqti-vaqti bilan eski yozuvlarni tozalash (uchundan birida)
    if (Math.random() < 1 / 30) {
      const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      await db.siteVisit.deleteMany({ where: { createdAt: { lt: cutoff } } });
      await db.presence.deleteMany({ where: { updatedAt: { lt: cutoff } } });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Statistika xatosi sayt ishlashiga xalaqit bermasin — jim javob
    console.error("/api/track POST error:", error);
    return NextResponse.json({ ok: false });
  }
}
