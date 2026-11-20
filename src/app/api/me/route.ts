import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureUser } from "@/lib/randap-server";
import { dzfFromCents } from "@/lib/shop-catalog";

function mePayload(user: {
  id: string;
  name: string;
  handle: string;
  avatar: string | null;
  points: number;
  dzfCents: number;
}, videoCount: number) {
  return {
    id: user.id,
    name: user.name,
    handle: user.handle,
    avatar: user.avatar,
    points: user.points,
    dzf: dzfFromCents(user.dzfCents),
    videoCount,
  };
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

    const user = await ensureUser(deviceKey);
    const videoCount = await db.video.count({ where: { uploaderId: user.id } });

    return NextResponse.json({ ok: true, me: mePayload(user, videoCount) });
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
      avatar?: string | null;
    } | null;

    const deviceKey = (body?.deviceKey ?? "").trim();
    const name = (body?.name ?? "").trim();

    if (!deviceKey) {
      return NextResponse.json(
        { ok: false, error: "deviceKey kerak" },
        { status: 400 }
      );
    }

    const user = await ensureUser(deviceKey);
    const data: { name?: string; avatar?: string | null } = {};

    if (name) {
      if (name.length < 2 || name.length > 40) {
        return NextResponse.json(
          { ok: false, error: "Ism 2-40 belgi orasida bo'lishi kerak" },
          { status: 400 }
        );
      }
      data.name = name;
    }

    if (body && "avatar" in body) {
      const avatar = body.avatar;
      if (avatar === null) {
        data.avatar = null;
      } else if (typeof avatar === "string" && avatar.length < 500) {
        data.avatar = avatar;
      } else {
        return NextResponse.json(
          { ok: false, error: "Avatar manzili noto'g'ri" },
          { status: 400 }
        );
      }
    }

    const updated = await db.user.update({ where: { id: user.id }, data });
    const videoCount = await db.video.count({
      where: { uploaderId: updated.id },
    });

    return NextResponse.json({ ok: true, me: mePayload(updated, videoCount) });
  } catch (error) {
    console.error("/api/me PATCH error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
