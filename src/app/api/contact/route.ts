import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const name = String(body?.name ?? "").trim();
    const phone = String(body?.phone ?? "").trim();
    const course = body?.course ? String(body.course).trim() : null;
    const message = body?.message ? String(body.message).trim() : null;

    if (name.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Iltimos, ismingizni to'liq kiriting." },
        { status: 400 }
      );
    }

    if (phone.replace(/\D/g, "").length < 9) {
      return NextResponse.json(
        { ok: false, error: "Telefon raqami noto'g'ri kiritilgan." },
        { status: 400 }
      );
    }

    const saved = await db.contactMessage.create({
      data: {
        name,
        phone,
        course: course || null,
        message: message || null,
      },
    });

    return NextResponse.json({ ok: true, id: saved.id });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik yuz berdi. Qayta urinib ko'ring." },
      { status: 500 }
    );
  }
}
