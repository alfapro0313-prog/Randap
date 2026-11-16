import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureChatProfile, serializeChatProfile, touchPresence, validColor } from "@/lib/chat-server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceKey = (searchParams.get("deviceKey") ?? "").trim();
    if (!deviceKey) {
      return NextResponse.json({ ok: false, error: "deviceKey kerak" }, { status: 400 });
    }

    const profile = await ensureChatProfile(deviceKey);
    await touchPresence(deviceKey);

    return NextResponse.json({ ok: true, profile: serializeChatProfile(profile) });
  } catch (error) {
    console.error("/api/chat/me GET error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      deviceKey?: string;
      name?: string;
      emoji?: string;
      color?: string;
      bio?: string;
    } | null;

    const deviceKey = (body?.deviceKey ?? "").trim();
    if (!deviceKey) {
      return NextResponse.json({ ok: false, error: "deviceKey kerak" }, { status: 400 });
    }

    await ensureChatProfile(deviceKey);
    const data: { name?: string; emoji?: string; color?: string; bio?: string } = {};

    if (body?.name !== undefined) {
      const name = body.name.trim();
      if (name.length < 2 || name.length > 40) {
        return NextResponse.json(
          { ok: false, error: "Ism 2-40 belgi orasida bo'lishi kerak" },
          { status: 400 }
        );
      }
      data.name = name;
    }

    if (body?.emoji !== undefined) {
      const emoji = body.emoji.trim();
      if (!emoji || emoji.length > 8) {
        return NextResponse.json({ ok: false, error: "Emoji noto'g'ri" }, { status: 400 });
      }
      data.emoji = emoji;
    }

    if (body?.color !== undefined) {
      if (!validColor(body.color)) {
        return NextResponse.json({ ok: false, error: "Rang noto'g'ri" }, { status: 400 });
      }
      data.color = body.color;
    }

    if (body?.bio !== undefined) {
      const bio = body.bio.trim();
      if (bio.length > 200) {
        return NextResponse.json(
          { ok: false, error: "Biografiya 200 belgidan oshmasligi kerak" },
          { status: 400 }
        );
      }
      data.bio = bio;
    }

    const updated = await db.chatProfile.update({
      where: { deviceKey },
      data,
    });

    return NextResponse.json({ ok: true, profile: serializeChatProfile(updated) });
  } catch (error) {
    console.error("/api/chat/me PATCH error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}
