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

    // Katta-kichik harf farqsiz qidiruv (SQLite/Postgres mos) — JS da filtrlanadi
    const rows = await db.chatProfile.findMany({
      where: { deviceKey: { not: deviceKey } },
      orderBy: [{ lastSeenAt: "desc" }],
      take: 300,
    });
    const lower = q.toLowerCase();
    const filtered = q
      ? rows.filter((r) => r.name.toLowerCase().includes(lower))
      : rows;

    // Online bo'lganlar tepada turadi
    const people = filtered
      .slice(0, 40)
      .map(serializeChatProfile)
      .sort((a, b) => {
        if (a.online !== b.online) return a.online ? -1 : 1;
        return b.lastSeenAt.localeCompare(a.lastSeenAt);
      });

    return NextResponse.json({ ok: true, people });
  } catch (error) {
    console.error("/api/chat/people GET error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}
