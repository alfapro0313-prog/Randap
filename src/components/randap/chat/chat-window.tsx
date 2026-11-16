"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ImagePlus, Loader2, SendHorizontal, Shuffle, Smile } from "lucide-react";
import { ChatAvatar } from "./chat-avatar";
import {
  CHAT_STICKERS,
  chatLocale,
  getChatStrings,
} from "@/lib/chat-i18n";
import type { ChatLang, ChatMessageItem, ChatProfileItem } from "@/lib/randap-types";
import { cn } from "@/lib/utils";

type ChatWindowProps = {
  deviceKey: string;
  lang: ChatLang;
  conversationId: string;
  initialIsRandom: boolean;
  onBack: () => void;
  onOpenPeer: (peer: ChatProfileItem) => void;
  onRandomNext: () => void;
  onRandomBack: () => void;
};

type Meta = {
  partner: ChatProfileItem | null;
  typing: boolean;
  online: boolean;
  ended: boolean;
  isRandom: boolean;
};

function formatTime(iso: string, lang: ChatLang): string {
  return new Date(iso).toLocaleTimeString(chatLocale(lang), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function ChatWindow({
  deviceKey,
  lang,
  conversationId,
  initialIsRandom,
  onBack,
  onOpenPeer,
  onRandomNext,
  onRandomBack,
}: ChatWindowProps) {
  const t = getChatStrings(lang);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [uploading, setUploading] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const stickRef = useRef(true);
  const lastTypingRef = useRef(0);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Polling — yangi xabarlar, typing, online holat
  useEffect(() => {
    let stopped = false;
    async function poll() {
      try {
        const res = await fetch(
          `/api/chat/messages?deviceKey=${encodeURIComponent(deviceKey)}&conversationId=${encodeURIComponent(conversationId)}`
        );
        const data = await res.json();
        if (stopped || !data?.ok) return;
        setMessages(data.messages as ChatMessageItem[]);
        setMeta({
          partner: (data.partner ?? null) as ChatProfileItem | null,
          typing: Boolean(data.partnerTyping),
          online: Boolean(data.partnerOnline),
          ended: Boolean(data.ended),
          isRandom: Boolean(data.isRandom),
        });
      } catch {
        // tarmoq xatosi — keyingi poll'da qayta urinamiz
      }
    }
    void poll();
    const id = window.setInterval(() => void poll(), 2500);
    return () => {
      stopped = true;
      window.clearInterval(id);
    };
  }, [deviceKey, conversationId]);

  // Suhbat almashganda pastga scroll
  useEffect(() => {
    stickRef.current = true;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [conversationId]);

  // Yangi xabar bo'lsa pastga scroll (faqat foydalanuvchi pastda tursa)
  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickRef.current) el.scrollTop = el.scrollHeight;
  }, [messages, meta?.typing]);

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 90;
  }

  async function refresh() {
    try {
      const res = await fetch(
        `/api/chat/messages?deviceKey=${encodeURIComponent(deviceKey)}&conversationId=${encodeURIComponent(conversationId)}`
      );
      const data = await res.json();
      if (data?.ok) {
        setMessages(data.messages as ChatMessageItem[]);
        setMeta({
          partner: (data.partner ?? null) as ChatProfileItem | null,
          typing: Boolean(data.partnerTyping),
          online: Boolean(data.partnerOnline),
          ended: Boolean(data.ended),
          isRandom: Boolean(data.isRandom),
        });
      }
    } catch {
      // ignore
    }
  }

  async function send(kind: ChatMessageItem["kind"], content: string) {
    if (!content.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceKey, conversationId, kind, content }),
      });
      const data = await res.json();
      if (data?.ok) {
        stickRef.current = true;
        await refresh();
      }
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  }

  function onInputChange(value: string) {
    setInput(value);
    // "yozmoqda..." holatini yuborish (sekundiga 1.5 marta ko'p emas)
    const now = Date.now();
    if (value.length > 0 && now - lastTypingRef.current > 1500) {
      lastTypingRef.current = now;
      void fetch("/api/chat/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceKey, conversationId }),
      }).catch(() => undefined);
    }
  }

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 6 * 1024 * 1024) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.set("deviceKey", deviceKey);
      form.set("file", file);
      const res = await fetch("/api/chat/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data?.ok && typeof data.url === "string") {
        await send("image", data.url);
      }
    } catch {
      // ignore
    } finally {
      setUploading(false);
    }
  }

  const ended = meta?.ended ?? false;
  const isRandom = meta?.isRandom ?? initialIsRandom;
  const statusText = ended
    ? t.chatEnded
    : meta?.typing
      ? t.typing
      : meta?.online
        ? t.online
        : meta?.partner
          ? t.offline
          : "";

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header: avatar + ism + holat; random chatda Next/Back tugmalari */}
      <div className="flex items-center gap-2 border-b border-border bg-card px-2 py-2.5 sm:px-4">
        <button
          onClick={onBack}
          aria-label={t.backToList}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80 sm:hidden"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>

        <button
          onClick={() => meta?.partner && onOpenPeer(meta.partner)}
          aria-label={t.viewProfile}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-1 py-1 text-left transition-colors hover:bg-secondary/50"
        >
          {meta?.partner ? (
            <ChatAvatar
              emoji={meta.partner.emoji}
              color={meta.partner.color}
              name={meta.partner.name}
              className="size-10"
              emojiClassName="text-xl"
              online={meta.online}
            />
          ) : (
            <span className="size-10 shrink-0 animate-pulse rounded-full bg-secondary" />
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold text-foreground">
              {meta?.partner?.name ?? t.loading}
            </span>
            <span
              className={cn(
                "block truncate text-xs",
                meta?.typing
                  ? "font-semibold text-sky-600"
                  : meta?.online
                    ? "font-semibold text-emerald-600"
                    : "text-muted-foreground"
              )}
            >
              {statusText}
            </span>
          </span>
        </button>

        {isRandom ? (
          <span className="flex shrink-0 items-center gap-2">
            <button
              onClick={onRandomBack}
              className="flex h-9 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-bold text-foreground transition-colors hover:bg-secondary"
            >
              {t.back}
            </button>
            <button
              onClick={onRandomNext}
              disabled={ended}
              className="flex h-9 items-center gap-1.5 rounded-full bg-sky-600 px-3 text-xs font-bold text-white transition-colors hover:bg-sky-700 disabled:opacity-50"
            >
              <Shuffle className="size-3.5" aria-hidden="true" />
              {t.next}
            </button>
          </span>
        ) : null}
      </div>

      {/* Xabarlar */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto bg-secondary/30 px-3 py-4 scrollbar-thin sm:px-4"
      >
        {messages.length === 0 && !ended ? (
          <p className="mx-auto my-auto text-center text-sm text-muted-foreground">
            {t.messagesEmpty}
          </p>
        ) : null}

        {messages.map((m) => {
          if (m.kind === "system") {
            const text = m.content === "__connected__" ? t.connected : t.strangerLeft;
            return (
              <p
                key={m.id}
                className="mx-auto my-1 rounded-full bg-secondary px-3 py-1 text-center text-[11px] font-semibold text-muted-foreground"
              >
                {text}
              </p>
            );
          }

          if (m.kind === "sticker") {
            return (
              <div key={m.id} className={cn("flex", m.mine ? "justify-end" : "justify-start")}>
                <span title={formatTime(m.createdAt, lang)} className="text-[56px] leading-none">
                  {m.content}
                </span>
              </div>
            );
          }

          if (m.kind === "image") {
            return (
              <div key={m.id} className={cn("flex", m.mine ? "justify-end" : "justify-start")}>
                <figure className="flex max-w-[230px] flex-col">
                  <img
                    src={`/${m.content.replace(/^\//, "")}`}
                    alt="Chat rasmi"
                    loading="lazy"
                    className="max-h-72 rounded-2xl object-cover"
                  />
                  <figcaption
                    className={cn(
                      "mt-0.5 text-[10px] text-muted-foreground",
                      m.mine ? "text-right" : "text-left"
                    )}
                  >
                    {formatTime(m.createdAt, lang)}
                  </figcaption>
                </figure>
              </div>
            );
          }

          return (
            <div key={m.id} className={cn("flex", m.mine ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[78%] rounded-2xl px-3.5 py-2 sm:max-w-[70%]",
                  m.mine
                    ? "rounded-br-md bg-sky-600 text-white"
                    : "rounded-bl-md border border-border bg-card text-foreground"
                )}
              >
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                  {m.content}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-right text-[10px]",
                    m.mine ? "text-sky-100/80" : "text-muted-foreground"
                  )}
                >
                  {formatTime(m.createdAt, lang)}
                </p>
              </div>
            </div>
          );
        })}

        {meta?.typing ? (
          <div className="flex justify-start">
            <span className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-card px-3 py-2.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-1.5 animate-bounce rounded-full bg-muted-foreground/70"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </span>
          </div>
        ) : null}
      </div>

      {/* Yozish qatori */}
      {ended ? (
        <div className="border-t border-border bg-card px-4 py-4 text-center text-sm font-semibold text-muted-foreground">
          {t.chatEnded}
        </div>
      ) : (
        <div className="relative border-t border-border bg-card px-2 py-2.5 sm:px-3">
          {showStickers ? (
            <div className="absolute bottom-full left-2 z-10 mb-2 grid w-64 grid-cols-5 gap-1 rounded-2xl border border-border bg-card p-3 shadow-lg">
              {CHAT_STICKERS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setShowStickers(false);
                    void send("sticker", s);
                  }}
                  aria-label={`Stiker ${s}`}
                  className="flex size-11 items-center justify-center rounded-xl text-2xl transition-colors hover:bg-secondary"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          <div className="flex items-end gap-1.5">
            <button
              onClick={() => setShowStickers((prev) => !prev)}
              aria-label={t.stickers}
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                showStickers && "bg-secondary text-foreground"
              )}
            >
              <Smile className="size-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              aria-label={t.photo}
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {uploading ? (
                <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              ) : (
                <ImagePlus className="size-5" aria-hidden="true" />
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onPickImage}
              className="sr-only"
              aria-label={t.photo}
            />

            <textarea
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  const value = input.trim();
                  if (value) {
                    setInput("");
                    void send("text", value);
                  }
                }
              }}
              rows={1}
              maxLength={2000}
              placeholder={t.messagePlaceholder}
              aria-label={t.messagePlaceholder}
              className="max-h-32 min-h-10 flex-1 resize-none rounded-2xl border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            />

            <button
              onClick={() => {
                const value = input.trim();
                if (value) {
                  setInput("");
                  void send("text", value);
                }
              }}
              disabled={!input.trim() || sending}
              aria-label={t.send}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-600 text-white transition-colors hover:bg-sky-700 disabled:opacity-40"
            >
              <SendHorizontal className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
