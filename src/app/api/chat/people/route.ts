import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureChatProfile, serializeChatProfile, touchPresence } from "@/lib/chat-server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceKey = (searchParams.get("deviceKey") ?? "").trim();
    const q = (searchParams.get("q") ?? "").trim();
    if (!deviceKey) {
      return NextResponse.json({ ok: false, error: "deviceKey kerak" }, { status: 400 });
    }

    await ensureChatProfile(deviceKey);
    await touchPresence(deviceKey);

    const rows = await db.chatProfile.findMany({
      where: {
        deviceKey: { not: deviceKey },
        name: q ? { contains: q } : undefined,
      },
      orderBy: [{ lastSeenAt: "desc" }],
      take: 40,
    });

    // Online bo'lganlar tepada turadi
    const people = rows.map(serializeChatProfile).sort((a, b) => {
      if (a.online !== b.online) return a.online ? -1 : 1;
      return b.lastSeenAt.localeCompare(a.lastSeenAt);
    });

    return NextResponse.json({ ok: true, people });
  } catch (error) {
    console.error("/api/chat/people GET error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}
