import { db } from "@/lib/db";
import { ensureUser } from "@/lib/randap-server";
import { CHAT_AVATAR_COLORS, CHAT_ONLINE_MS } from "@/lib/chat-i18n";
import type { ChatProfileItem, ChatMessageItem } from "@/lib/randap-types";

type ChatProfileRow = {
  deviceKey: string;
  name: string;
  emoji: string;
  color: string;
  bio: string;
  avatarImage: string | null;
  lastSeenAt: Date;
  createdAt: Date;
};

export function isOnline(lastSeenAt: Date): boolean {
  return Date.now() - lastSeenAt.getTime() < CHAT_ONLINE_MS;
}

export function chatAvatarClasses(color: string): string {
  return CHAT_AVATAR_COLORS[color] ?? CHAT_AVATAR_COLORS.sky;
}

export function serializeChatProfile(row: ChatProfileRow): ChatProfileItem {
  return {
    deviceKey: row.deviceKey,
    name: row.name,
    emoji: row.emoji,
    color: row.color,
    bio: row.bio,
    avatarImage: row.avatarImage ?? null,
    online: isOnline(row.lastSeenAt),
    lastSeenAt: row.lastSeenAt.toISOString(),
  };
}

export function validColor(color: string): boolean {
  return color in CHAT_AVATAR_COLORS;
}

/** deviceKey bo'yicha chat profilini topadi/yaratadi (ismi Randap hisobidan oladi) */
export async function ensureChatProfile(deviceKey: string): Promise<ChatProfileRow> {
  const existing = await db.chatProfile.findUnique({ where: { deviceKey } });
  if (existing) return existing;

  const user = await ensureUser(deviceKey);
  return db.chatProfile.create({
    data: { deviceKey, name: user.name },
  });
}

/** Har qanday chat so'rovida presence yangilanadi */
export async function touchPresence(deviceKey: string): Promise<void> {
  await db.chatProfile.updateMany({
    where: { deviceKey },
    data: { lastSeenAt: new Date() },
  });
}

export function partnerKeyOf(
  conversation: { userAKey: string; userBKey: string },
  myKey: string
): string {
  return conversation.userAKey === myKey ? conversation.userBKey : conversation.userAKey;
}

export function serializeMessage(
  message: { id: string; senderKey: string; kind: string; content: string; createdAt: Date },
  myKey: string
): ChatMessageItem {
  return {
    id: message.id,
    kind: (message.kind as ChatMessageItem["kind"]) ?? "text",
    content: message.content,
    mine: message.senderKey === myKey,
    createdAt: message.createdAt.toISOString(),
  };
}

/** Ikki qurilma orasida 1-1 (random bo'lmagan) suhbat topadi/yaratadi */
export async function findOrCreateConversation(
  myKey: string,
  peerKey: string
): Promise<string> {
  const existing = await db.conversation.findFirst({
    where: {
      isRandom: false,
      OR: [
        { AND: [{ userAKey: myKey }, { userBKey: peerKey }] },
        { AND: [{ userAKey: peerKey }, { userBKey: myKey }] },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
  if (existing) return existing.id;
  const created = await db.conversation.create({
    data: { userAKey: myKey, userBKey: peerKey },
  });
  return created.id;
}
