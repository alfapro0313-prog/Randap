"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Eraser, ImagePlus, Loader2, SendHorizontal, Shuffle, Smile, Trash2, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ChatAvatar } from "./chat-avatar";
import { useLang } from "../lang-provider";
import {
  CHAT_STICKERS,
  chatLocale,
  getChatStrings,
} from "@/lib/chat-i18n";
import type { ChatLang, ChatMessageItem, ChatProfileItem } from "@/lib/randap-types";
import type { ShopData } from "@/lib/randap-types";
import { cn } from "@/lib/utils";

/** Yozish maydonining maksimal balandligi (px) — undan keyin ichida scroll */
const INPUT_MAX_H = 128;

type ChatWindowProps = {
  deviceKey: string;
  conversationId: string;
  initialIsRandom: boolean;
  onBack: () => void;
  onOpenPeer: (peer: ChatProfileItem) => void;
  onRandomNext: () => void;
  onRandomBack: () => void;
  onClear: () => void;
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
  conversationId,
  initialIsRandom,
  onBack,
  onOpenPeer,
  onRandomNext,
  onRandomBack,
  onClear,
}: ChatWindowProps) {
  // Til global kontekstdan olinadi
  const { lang } = useLang();
  const t = getChatStrings(lang);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [uploading, setUploading] = useState(false);
  // Do'kondan olingan stikerlar (maxsus panel bo'limi)
  const [ownedStickers, setOwnedStickers] = useState<string[]>([]);
  // "Rasm o'chirilsinmi?" tasdiqlashi ko'rsatilayotgan xabar
  const [confirmDeleteMsgId, setConfirmDeleteMsgId] = useState<string | null>(null);
  // "O'tkaz" — DZF pul o'tkazish (do'kondan tovar olingan bo'lishi kerak)
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferBusy, setTransferBusy] = useState(false);
  const [myDzf, setMyDzf] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const stickRef = useRef(true);
  const lastTypingRef = useRef(0);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Do'kon stikerlari — panel ochilganda yuklanadi
  useEffect(() => {
    if (!showStickers || !deviceKey) return;
    let stopped = false;
    (async () => {
      try {
        const res = await fetch(`/api/shop?deviceKey=${encodeURIComponent(deviceKey)}`);
        const data = (await res.json()) as ShopData & { ok?: boolean };
        if (!stopped && data?.ok) {
          const stickers = (data.owned ?? [])
            .map((o) => o.content)
            .filter((c): c is string => Boolean(c));
          setOwnedStickers(stickers);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      stopped = true;
    };
  }, [showStickers, deviceKey]);

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
      } else if (data?.stickerNotOwned) {
        toast({ title: t.stickerNotOwned, variant: "destructive" });
      }
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  }

  // Yozish maydoni matnga qarab avtomatik o'sadi — uzun xat ham to'liq
  // ko'rinadi, hech narsa chetga chiqmaydi (telefon uchun ham)
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, INPUT_MAX_H)}px`;
  }, [input]);

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

  /** Rasm/skrinshotni yuklab, xabar sifatida yuboradi (fayl tanlash yoki Ctrl+V paste) */
  async function uploadImageFile(file: File): Promise<boolean> {
    if (!file.type.startsWith("image/")) {
      toast({ title: t.imageOnly, variant: "destructive" });
      return false;
    }
    if (file.size > 6 * 1024 * 1024) {
      toast({ title: t.imageTooBig, variant: "destructive" });
      return false;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.set("deviceKey", deviceKey);
      form.set("file", file);
      const res = await fetch("/api/chat/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data?.ok && typeof data.url === "string") {
        stickRef.current = true;
        await send("image", data.url);
        return true;
      }
      toast({ title: t.imageFailed, variant: "destructive" });
      return false;
    } catch {
      toast({ title: t.imageFailed, variant: "destructive" });
      return false;
    } finally {
      setUploading(false);
    }
  }

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) void uploadImageFile(file);
  }

  /** Skrinshotni Clipboard'dan (Ctrl+V) ushlaydi */
  function onPasteImage(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const file = Array.from(e.clipboardData?.files ?? []).find((f) =>
      f.type.startsWith("image/")
    );
    if (file) {
      e.preventDefault();
      void uploadImageFile(file);
    }
  }

  /** Rasm/skrinshot xabarini o'chirish — ikkala tomonda ham yo'qoladi */
  async function deleteImageMessage(messageId: string) {
    setConfirmDeleteMsgId(null);
    // Darhol ekrandan olib tashlaymiz (optimistik)
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    try {
      const res = await fetch("/api/chat/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceKey, conversationId, messageId }),
      });
      const data = await res.json();
      if (data?.ok) {
        toast({ title: t.deletedImageToast });
      } else {
        await refresh(); // xato bo'lsa ro'yxatni tiklaymiz
      }
    } catch {
      await refresh();
    }
  }

  async function onTransferClick() {
    try {
      const res = await fetch(`/api/shop?deviceKey=${encodeURIComponent(deviceKey)}`);
      const data = (await res.json()) as ShopData & { ok?: boolean };
      if (data?.ok) {
        setMyDzf(data.dzf);
        if (data.ownedIds?.includes("otkaz")) {
          setTransferAmount("");
          setShowTransfer(true);
        } else {
          toast({ title: t.transferNeedBuy, variant: "destructive" });
        }
      }
    } catch {
      toast({ title: t.transferFail, variant: "destructive" });
    }
  }

  async function doTransfer() {
    const amount = Number(transferAmount.replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0 || transferBusy) {
      toast({ title: t.transferBadAmount, variant: "destructive" });
      return;
    }
    setTransferBusy(true);
    try {
      const res = await fetch("/api/dzf/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceKey, conversationId, amount }),
      });
      const data = await res.json();
      if (data?.ok) {
        setMyDzf(data.dzf);
        setShowTransfer(false);
        setTransferAmount("");
        toast({ title: t.transferSent });
        stickRef.current = true;
        await refresh();
      } else if (data?.notEnough) {
        toast({ title: t.transferNotEnough, variant: "destructive" });
      } else if (data?.otkazNotOwned) {
        toast({ title: t.transferNeedBuy, variant: "destructive" });
      } else if (data?.badAmount) {
        toast({ title: t.transferBadAmount, variant: "destructive" });
      } else {
        toast({ title: t.transferFail, variant: "destructive" });
      }
    } catch {
      toast({ title: t.transferFail, variant: "destructive" });
    } finally {
      setTransferBusy(false);
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
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col">
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
              image={meta.partner.avatarImage}
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
              onClick={onClear}
              title={t.clear}
              aria-label={t.clear}
              disabled={ended}
              className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
            >
              <Eraser className="size-4" aria-hidden="true" />
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

          if (m.kind === "dzf") {
            const dzfVal = String(Number(m.content) / 100);
            return (
              <div key={m.id} className="flex justify-center">
                <div className="flex flex-col items-center gap-0.5 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-2 text-center shadow-sm">
                  <span className="text-base font-extrabold text-amber-700">
                    💸 {dzfVal} DZF
                  </span>
                  <span className="text-[11px] font-semibold text-amber-600">
                    {m.mine ? t.transferMine : t.transferGot}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatTime(m.createdAt, lang)}
                  </span>
                </div>
              </div>
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
            // Bazadagi rasm: /api/chat-images/<id>; eski fayl yo'li: /uploads/chat/...
            const imageSrc = m.content.startsWith("chat-images/")
              ? `/api/${m.content}`
              : `/${m.content.replace(/^\//, "")}`;
            if (confirmDeleteMsgId === m.id) {
              // Tasdiqlash — rasm o'rnida qizil panel chiqadi
              return (
                <div key={m.id} className={cn("flex", m.mine ? "justify-end" : "justify-start")}>
                  <div className="flex w-60 flex-col gap-1 rounded-2xl border border-rose-300 bg-rose-50 px-3 py-2.5">
                    <span className="block text-xs font-bold text-rose-700">{t.deleteImageAsk}</span>
                    <span className="block text-[10px] text-rose-600/80">{t.deleteImageHint}</span>
                    <span className="mt-1 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setConfirmDeleteMsgId(null)}
                        aria-label={t.cancel}
                        title={t.cancel}
                        className="flex size-8 items-center justify-center rounded-lg bg-secondary text-foreground transition-colors hover:bg-secondary/80"
                      >
                        <X className="size-4" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => void deleteImageMessage(m.id)}
                        className="flex h-8 items-center gap-1 rounded-lg bg-rose-600 px-3 text-xs font-bold text-white transition-colors hover:bg-rose-700"
                      >
                        <Check className="size-3.5" aria-hidden="true" />
                        {t.deleteYes}
                      </button>
                    </span>
                  </div>
                </div>
              );
            }
            return (
              <div key={m.id} className={cn("flex", m.mine ? "justify-end" : "justify-start")}>
                <figure className="flex max-w-[240px] flex-col">
                  <a href={imageSrc} target="_blank" rel="noopener noreferrer" title={t.viewFull}>
                    <img
                      src={imageSrc}
                      alt="Chat rasmi"
                      loading="lazy"
                      className="max-h-72 w-auto max-w-full rounded-2xl border border-border object-contain"
                    />
                  </a>
                  <figcaption
                    className={cn(
                      "mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground",
                      m.mine ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <span>{formatTime(m.createdAt, lang)}</span>
                    {/* Skrinshotni o'chirish — yuborgan ham, olgan ham o'chira oladi */}
                    <button
                      onClick={() => setConfirmDeleteMsgId(m.id)}
                      aria-label={t.deleteImage}
                      title={t.deleteImage}
                      className="flex size-6 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                    </button>
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
            <div className="absolute bottom-full left-2 z-10 mb-2 max-h-72 w-64 overflow-y-auto rounded-2xl border border-border bg-card p-3 shadow-lg scrollbar-thin">
              {ownedStickers.length > 0 ? (
                <>
                  <p className="pb-1 text-[10px] font-bold uppercase tracking-wide text-amber-600">
                    {t.myStickers}
                  </p>
                  <div className="grid grid-cols-5 gap-1">
                    {ownedStickers.map((s) => (
                      <button
                        key={`own-${s}`}
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
                  <p className="pb-1 pt-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    {t.freeStickers}
                  </p>
                </>
              ) : null}
              <div className="grid grid-cols-5 gap-1">
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
            </div>
          ) : null}

          <div className="flex items-end gap-1.5">
            {!isRandom ? (
              <button
                onClick={() => void onTransferClick()}
                disabled={uploading}
                aria-label={t.transferTitle}
                title={t.transferTitle}
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-xl text-muted-foreground transition-colors hover:bg-secondary sm:size-10"
              >
                💸
              </button>
            ) : null}
            <button
              onClick={() => setShowStickers((prev) => !prev)}
              aria-label={t.stickers}
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:size-10",
                showStickers && "bg-secondary text-foreground"
              )}
            >
              <Smile className="size-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              aria-label={t.photo}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:size-10"
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
              onPaste={onPasteImage}
              rows={1}
              maxLength={2000}
              placeholder={t.messagePlaceholder}
              aria-label={t.messagePlaceholder}
              ref={inputRef}
              className="max-h-32 min-h-10 w-full min-w-0 flex-1 resize-none overflow-y-auto rounded-2xl border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky-500/40"
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
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-600 text-white transition-colors hover:bg-sky-700 disabled:opacity-40 sm:size-10"
            >
              <SendHorizontal className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* O'tkaz — DZF pul o'tkazish dialogi */}
      {showTransfer ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setShowTransfer(false)}
          role="presentation"
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label={t.transferTitle}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-foreground">
                💸 {t.transferTitle}
              </h3>
              <button
                onClick={() => setShowTransfer(false)}
                aria-label={t.cancel}
                className="flex size-8 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 truncate text-xs text-muted-foreground">
              {meta?.partner?.name ?? ""}
            </p>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2">
              <span className="text-xs text-muted-foreground">{t.transferBalance}</span>
              <span className="text-sm font-extrabold text-amber-600">
                {myDzf ?? 0} DZF
              </span>
            </div>
            <input
              type="number"
              inputMode="decimal"
              min="0.1"
              step="0.1"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder={t.transferAmount}
              aria-label={t.transferAmount}
              className="mt-3 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowTransfer(false)}
                className="flex h-9 items-center rounded-full bg-secondary px-4 text-xs font-bold text-foreground transition-colors hover:bg-secondary/80"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => void doTransfer()}
                disabled={transferBusy || !transferAmount}
                className="flex h-9 items-center gap-1.5 rounded-full bg-sky-600 px-4 text-xs font-bold text-white transition-colors hover:bg-sky-700 disabled:opacity-50"
              >
                {transferBusy ? (
                  <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                ) : null}
                {t.transferTitle}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
