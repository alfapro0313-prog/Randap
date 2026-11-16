"use client";

import { useEffect, useState } from "react";
import { ChatAvatar } from "./chat/chat-avatar";
import type { ChatNotificationItem } from "@/lib/randap-types";

/**
 * "Kichkina esemes" — saytda bo'lgan foydalanuvchiga yangi xabar
 * kelganda pastki o'ng burchakda kichkina xabarnoma chiqadi.
 */
export function ChatSms({
  deviceKey,
  onOpen,
}: {
  deviceKey: string;
  onOpen: (conversationId: string) => void;
}) {
  const [items, setItems] = useState<ChatNotificationItem[]>([]);

  useEffect(() => {
    if (!deviceKey) return;
    let stopped = false;
    async function poll() {
      try {
        const res = await fetch(
          `/api/chat/notifications?deviceKey=${encodeURIComponent(deviceKey)}`
        );
        const data = await res.json();
        if (!stopped && data?.ok) {
          setItems((data.notifications ?? []) as ChatNotificationItem[]);
        }
      } catch {
        // ignore
      }
    }
    void poll();
    const id = window.setInterval(() => void poll(), 10_000);
    return () => {
      stopped = true;
      window.clearInterval(id);
    };
  }, [deviceKey]);

  if (items.length === 0) return null;

  return (
    <div
      aria-label="Yangi chat xabarlar"
      className="fixed bottom-20 right-3 z-50 flex w-72 max-w-[85vw] flex-col gap-2 md:bottom-6 md:right-5"
    >
      {items.map((n) => (
        <button
          key={`${n.conversationId}-${n.createdAt}`}
          onClick={() => onOpen(n.conversationId)}
          className="flex items-center gap-2.5 rounded-xl border border-sky-200 bg-card/95 p-3 text-left shadow-lg backdrop-blur transition-colors hover:border-sky-400"
        >
          <ChatAvatar
            emoji={n.senderEmoji}
            color={n.senderColor}
            name={n.senderName}
            className="size-8"
            emojiClassName="text-sm"
          />
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between gap-2">
              <span className="truncate text-xs font-bold text-foreground">{n.senderName}</span>
              <span className="shrink-0 text-[10px] font-bold uppercase text-sky-600">Chat</span>
            </span>
            <span className="block truncate text-xs text-muted-foreground">{n.preview}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
