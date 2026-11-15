import { NextResponse } from "next/server";
import { db } from "@/lib/db";

async function upsertUser(deviceKey: string) {
  const existing = await db.user.findUnique({ where: { deviceKey } });
  if (existing) return existing;

  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  let handle = `@randap_${suffix.toLowerCase()}`;
  const handleExists = await db.user.findUnique({ where: { handle } });
  if (handleExists) handle = `@randap_${Date.now().toString(36).slice(-6)}`;

  return db.user.create({
    data: { deviceKey, name: `RandapUser ${suffix}`, handle },
  });
}

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

    const user = await upsertUser(deviceKey);
    const videoCount = await db.video.count({ where: { uploaderId: user.id } });

    return NextResponse.json({
      ok: true,
      me: {
        id: user.id,
        name: user.name,
        handle: user.handle,
        videoCount,
      },
    });
  } catch (error) {
    console.error("/api/me GET error:", error);
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
      name?: string;
    } | null;

    const deviceKey = (body?.deviceKey ?? "").trim();
    const name = (body?.name ?? "").trim();

    if (!deviceKey) {
      return NextResponse.json(
        { ok: false, error: "deviceKey kerak" },
        { status: 400 }
      );
    }
    if (name.length < 2 || name.length > 40) {
      return NextResponse.json(
        { ok: false, error: "Ism 2-40 belgi orasida bo'lishi kerak" },
        { status: 400 }
      );
    }

    const user = await upsertUser(deviceKey);
    const updated = await db.user.update({
      where: { id: user.id },
      data: { name },
    });
    const videoCount = await db.video.count({
      where: { uploaderId: updated.id },
    });

    return NextResponse.json({
      ok: true,
      me: {
        id: updated.id,
        name: updated.name,
        handle: updated.handle,
        videoCount,
      },
    });
  } catch (error) {
    console.error("/api/me PATCH error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
