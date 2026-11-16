import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureChatProfile, partnerKeyOf, touchPresence } from "@/lib/chat-server";

type RandomResult =
  | { status: "matched"; conversationId: string; isRandom: true; ended: false }
  | { status: "waiting" }
  | { status: "idle" };

const CANDIDATE_FRESH_MS = 60_000;
const RANDOM_ACTIVITY_MS = 120_000; // sherik javob bermasa 2 daqiqada chat o'zi tugaydi

type TxClient = Parameters<Parameters<typeof db.$transaction>[0]>[0];

function activeRandomWhere(deviceKey: string) {
  return {
    isRandom: true,
    endedAt: null,
    OR: [{ userAKey: deviceKey }, { userBKey: deviceKey }],
  };
}

/**
 * Faol random chatni oladi. Sherik 2 daqiqadan beri offline bo'lsa
 * (xabar ham yo'q) chatni avtomatik tugatadi — sherik halok bo'lib
 * qolgan suhbatga abadiy band bo'lib qolmaydi.
 */
async function getActiveRandom(tx: TxClient, deviceKey: string) {
  const conv = await tx.conversation.findFirst({
    where: activeRandomWhere(deviceKey),
    orderBy: { createdAt: "desc" },
  });
  if (!conv) return null;

  const partnerKey = partnerKeyOf(conv, deviceKey);
  const partner = await tx.chatProfile.findUnique({
    where: { deviceKey: partnerKey },
  });
  const partnerOnline =
    partner !== null && Date.now() - partner.lastSeenAt.getTime() < 30_000;
  const lastActivity = Math.max(
    conv.createdAt.getTime(),
    conv.lastMessageAt.getTime()
  );
  const fresh = Date.now() - lastActivity < RANDOM_ACTIVITY_MS;

  if (!fresh && !partnerOnline) {
    await tx.conversation.update({
      where: { id: conv.id },
      data: { endedAt: new Date() },
    });
    await tx.message.create({
      data: {
        conversationId: conv.id,
        senderKey: "system",
        kind: "system",
        content: "__left__",
      },
    });
    return null;
  }
  return conv;
}

async function tryMatch(myKey: string): Promise<RandomResult> {
  return db.$transaction(async (tx) => {
    // Allaqachon faol random chatim bormi?
    const myActive = await getActiveRandom(tx, myKey);
    if (myActive) {
      return { status: "matched", conversationId: myActive.id, isRandom: true, ended: false };
    }

    const now = Date.now();
    const queue = await tx.randomQueue.findMany({
      where: { deviceKey: { not: myKey } },
      orderBy: { joinedAt: "asc" },
      take: 20,
    });

    for (const candidate of queue) {
      const profile = await tx.chatProfile.findUnique({
        where: { deviceKey: candidate.deviceKey },
      });

      // Eskirgan (saytdan chiqqan) nomzodlarni navbatdan olib tashlaymiz
      if (!profile || now - profile.lastSeenAt.getTime() > CANDIDATE_FRESH_MS) {
        await tx.randomQueue.deleteMany({ where: { deviceKey: candidate.deviceKey } });
        continue;
      }

      // Nomzod boshqa random chatda band bo'lsa
      const candidateActive = await getActiveRandom(tx, candidate.deviceKey);
      if (candidateActive) {
        await tx.randomQueue.deleteMany({ where: { deviceKey: candidate.deviceKey } });
        continue;
      }

      // Bu juftlik uchun faol random chat allaqachon bormi?
      const pairExists = await tx.conversation.findFirst({
        where: {
          isRandom: true,
          endedAt: null,
          AND: [
            {
              OR: [
                { userAKey: myKey },
                { userBKey: myKey },
              ],
            },
            {
              OR: [
                { userAKey: candidate.deviceKey },
                { userBKey: candidate.deviceKey },
              ],
            },
          ],
        },
      });
      if (pairExists) {
        await tx.randomQueue.deleteMany({ where: { deviceKey: candidate.deviceKey } });
        continue;
      }

      const conv = await tx.conversation.create({
        data: { userAKey: myKey, userBKey: candidate.deviceKey, isRandom: true },
      });
      await tx.message.create({
        data: { conversationId: conv.id, senderKey: "system", kind: "system", content: "__connected__" },
      });
      await tx.randomQueue.deleteMany({
        where: { deviceKey: { in: [myKey, candidate.deviceKey] } },
      });
      return { status: "matched", conversationId: conv.id, isRandom: true, ended: false };
    }

    // Bo'sh navbat — men kutishga qo'shilaman
    await tx.randomQueue.upsert({
      where: { deviceKey: myKey },
      create: { deviceKey: myKey, joinedAt: new Date() },
      update: { joinedAt: new Date() },
    });
    return { status: "waiting" };
  });
}

/** Faol random chatni tugatadi (sherik "__left__" tizim xabarini ko'radi) */
async function endActiveRandom(myKey: string): Promise<void> {
  const active = await db.conversation.findFirst({
    where: activeRandomWhere(myKey),
    orderBy: { createdAt: "desc" },
  });
  if (!active) return;
  await db.conversation.update({
    where: { id: active.id },
    data: { endedAt: new Date() },
  });
  await db.message.create({
    data: { conversationId: active.id, senderKey: "system", kind: "system", content: "__left__" },
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      deviceKey?: string;
      action?: string;
    } | null;

    const deviceKey = (body?.deviceKey ?? "").trim();
    const action = (body?.action ?? "").trim();

    if (!deviceKey || !["join", "status", "next", "back"].includes(action)) {
      return NextResponse.json({ ok: false, error: "So'rov noto'g'ri" }, { status: 400 });
    }

    await ensureChatProfile(deviceKey);
    await touchPresence(deviceKey);

    if (action === "status") {
      const active = await db.$transaction((tx) => getActiveRandom(tx, deviceKey));
      if (active) {
        return NextResponse.json({
          ok: true,
          status: "matched",
          conversationId: active.id,
          isRandom: true,
          ended: false,
        });
      }
      const queued = await db.randomQueue.findUnique({ where: { deviceKey } });
      return NextResponse.json({ ok: true, status: queued ? "waiting" : "idle" });
    }

    if (action === "join" || action === "next") {
      if (action === "next") {
        await endActiveRandom(deviceKey);
      }
      const result = await tryMatch(deviceKey);
      return NextResponse.json({ ok: true, ...result });
    }

    // action === "back" — faol chatni tugatadi va navbatdan chiqadi
    await endActiveRandom(deviceKey);
    await db.randomQueue.deleteMany({ where: { deviceKey } });
    return NextResponse.json({ ok: true, status: "idle" });
  } catch (error) {
    console.error("/api/chat/random POST error:", error);
    return NextResponse.json({ ok: false, error: "Serverda xatolik" }, { status: 500 });
  }
}
