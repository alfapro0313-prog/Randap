import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminDevice } from "@/lib/randap-server";

/**
 * SHIKOYATLAR API:
 *  POST {deviceKey, text}                    — profil ichidan shikoyat yozish
 *      (ism va gmail serverda AuthAccount'dan olinadi);
 *  GET  ?deviceKey=<admin>                   — admin: barcha shikoyatlar;
 *  PATCH {deviceKey=<admin>, id, action}     — admin: "resolve" | "delete".
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      deviceKey?: string;
      text?: string;
    } | null;

    const deviceKey = (body?.deviceKey ?? "").trim();
    const text = (body?.text ?? "").trim();

    if (!deviceKey) {
      return NextResponse.json(
        { ok: false, error: "Avval saytga kiring" },
        { status: 401 }
      );
    }
    if (text.length < 3 || text.length > 1500) {
      return NextResponse.json(
        { ok: false, error: "Shikoyat 3-1500 belgi orasida bo'lishi kerak" },
        { status: 400 }
      );
    }

    const account = await db.authAccount.findUnique({ where: { deviceKey } });
    if (!account) {
      return NextResponse.json(
        { ok: false, error: "Avval saytga kiring" },
        { status: 401 }
      );
    }

    const complaint = await db.complaint.create({
      data: {
        deviceKey,
        name: account.name,
        gmail: account.gmail,
        text,
      },
    });

    return NextResponse.json({ ok: true, id: complaint.id });
  } catch (error) {
    console.error("/api/complaints POST error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
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

    const complaints = await db.complaint.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 200,
    });

    return NextResponse.json({
      ok: true,
      complaints: complaints.map((c) => ({
        id: c.id,
        name: c.name,
        gmail: c.gmail,
        text: c.text,
        createdAt: new Date(c.createdAt).getTime(),
        resolvedAt: c.resolvedAt ? new Date(c.resolvedAt).getTime() : null,
      })),
    });
  } catch (error) {
    console.error("/api/complaints GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      deviceKey?: string;
      id?: string;
      action?: "resolve" | "delete";
    } | null;

    const deviceKey = (body?.deviceKey ?? "").trim();
    const id = (body?.id ?? "").trim();
    const action = body?.action === "delete" ? "delete" : "resolve";

    if (!(await isAdminDevice(deviceKey))) {
      return NextResponse.json(
        { ok: false, error: "Faqat admin uchun" },
        { status: 403 }
      );
    }
    if (!id) {
      return NextResponse.json(
        { ok: false, error: "id kerak" },
        { status: 400 }
      );
    }

    if (action === "delete") {
      await db.complaint.deleteMany({ where: { id } });
      return NextResponse.json({ ok: true, action: "delete" });
    }

    await db.complaint.updateMany({
      where: { id },
      data: { resolvedAt: new Date() },
    });
    return NextResponse.json({ ok: true, action: "resolve" });
  } catch (error) {
    console.error("/api/complaints PATCH error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
