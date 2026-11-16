"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Loader2,
  MessageCircle,
  MessagesSquare,
  Search,
  Settings,
  Shuffle,
  UserRound,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ChatAvatar } from "./chat-avatar";
import { ChatWindow } from "./chat-window";
import {
  CHAT_EMOJIS,
  CHAT_LANGS,
  CHAT_LANG_STORAGE,
  CHAT_COLORS,
  CHAT_AVATAR_COLORS,
  chatLocale,
  getChatStrings,
  isChatLang,
} from "@/lib/chat-i18n";
import type {
  ChatConversationItem,
  ChatLang,
  ChatProfileItem,
} from "@/lib/randap-types";
import { cn } from "@/lib/utils";

type ChatAppProps = {
  deviceKey: string;
  focusConversationId?: string | null;
};

type RandomState = "idle" | "waiting" | "matched";

export function ChatApp({ deviceKey, focusConversationId }: ChatAppProps) {
  const [lang, setLang] = useState<ChatLang>("en");
  const [profile, setProfile] = useState<ChatProfileItem | null>(null);
  const [conversations, setConversations] = useState<ChatConversationItem[]>([]);
  const [people, setPeople] = useState<ChatProfileItem[]>([]);
  const [searchQ, setSearchQ] = useState("");
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [randomState, setRandomState] = useState<RandomState>("idle");
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [peer, setPeer] = useState<ChatProfileItem | null>(null);

  // Sozlamalar formasi
  const [nameDraft, setNameDraft] = useState("");
  const [bioDraft, setBioDraft] = useState("");
  const [emojiDraft, setEmojiDraft] = useState("🙂");
  const [colorDraft, setColorDraft] = useState("sky");
  const [saving, setSaving] = useState(false);

  const t = getChatStrings(lang);

  const loadConversations = useCallback(async () => {
    if (!deviceKey) return;
    try {
      const res = await fetch(
        `/api/chat/conversations?deviceKey=${encodeURIComponent(deviceKey)}`
      );
      const data = await res.json();
      if (data?.ok) setConversations(data.conversations as ChatConversationItem[]);
    } catch {
      // ignore
    }
  }, [deviceKey]);

  // Til — localStorage'dan (default: inglizcha)
  useEffect(() => {
    const stored = window.localStorage.getItem(CHAT_LANG_STORAGE);
    if (isChatLang(stored)) setLang(stored);
  }, []);

  // Profil + suhbatlar
  useEffect(() => {
    if (!deviceKey) return;
    let stopped = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/chat/me?deviceKey=${encodeURIComponent(deviceKey)}`
        );
        const data = await res.json();
        if (stopped || !data?.ok) return;
        const p = data.profile as ChatProfileItem;
        setProfile(p);
        setNameDraft(p.name);
        setBioDraft(p.bio);
        setEmojiDraft(p.emoji);
        setColorDraft(p.color);
      } catch {
        // ignore
      } finally {
        if (!stopped) setLoading(false);
      }
    })();
    return () => {
      stopped = true;
    };
  }, [deviceKey]);

  useEffect(() => {
    if (!deviceKey) return;
    void loadConversations();
    const id = window.setInterval(() => void loadConversations(), 8000);
    return () => window.clearInterval(id);
  }, [deviceKey, loadConversations]);

  // SMS xabaridan kelgan suhbatni ochish
  useEffect(() => {
    if (focusConversationId) {
      setActiveConvId(focusConversationId);
      setRandomState("idle");
    }
  }, [focusConversationId]);

  // Odamlarni qidirish (debounce)
  useEffect(() => {
    if (!deviceKey) return;
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/chat/people?deviceKey=${encodeURIComponent(deviceKey)}&q=${encodeURIComponent(searchQ.trim())}`
        );
        const data = await res.json();
        if (data?.ok) setPeople(data.people as ChatProfileItem[]);
      } catch {
        // ignore
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [deviceKey, searchQ]);

  // Random chat: kutish holatida statusni tekshirish
  useEffect(() => {
    if (randomState !== "waiting" || !deviceKey) return;
    let stopped = false;
    const id = window.setInterval(async () => {
      try {
        const res = await fetch("/api/chat/random", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceKey, action: "status" }),
        });
        const data = await res.json();
        if (stopped || !data?.ok) return;
        if (data.status === "matched") {
          setRandomState("matched");
          setActiveConvId(String(data.conversationId));
          void loadConversations();
        }
        if (data.status === "idle") {
          setRandomState("idle");
        }
      } catch {
        // ignore
      }
    }, 2000);
    return () => {
      stopped = true;
      window.clearInterval(id);
    };
  }, [randomState, deviceKey, loadConversations]);

  function changeLang(next: ChatLang) {
    setLang(next);
    window.localStorage.setItem(CHAT_LANG_STORAGE, next);
  }

  async function openWithPeer(peerKey: string) {
    if (!deviceKey) return;
    try {
      const res = await fetch("/api/chat/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceKey, peerKey }),
      });
      const data = await res.json();
      if (data?.ok) {
        setRandomState("idle");
        setActiveConvId(String(data.conversationId));
        setPeer(null);
        void loadConversations();
      }
    } catch {
      // ignore
    }
  }

  async function startRandom() {
    if (!deviceKey) return;
    setRandomState("waiting");
    setActiveConvId(null);
    try {
      const res = await fetch("/api/chat/random", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceKey, action: "join" }),
      });
      const data = await res.json();
      if (data?.ok) {
        if (data.status === "matched") {
          setRandomState("matched");
          setActiveConvId(String(data.conversationId));
          void loadConversations();
        } else if (data.status === "idle") {
          setRandomState("idle");
        }
      }
    } catch {
      setRandomState("idle");
    }
  }

  async function randomNext() {
    if (!deviceKey) return;
    try {
      const res = await fetch("/api/chat/random", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceKey, action: "next" }),
      });
      const data = await res.json();
      if (data?.ok) {
        if (data.status === "matched") {
          setRandomState("matched");
          setActiveConvId(String(data.conversationId));
        } else {
          setRandomState("waiting");
          setActiveConvId(null);
        }
        void loadConversations();
      }
    } catch {
      // ignore
    }
  }

  async function randomBack() {
    if (!deviceKey) return;
    setActiveConvId(null);
    setRandomState("idle");
    try {
      await fetch("/api/chat/random", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceKey, action: "back" }),
      });
    } catch {
      // ignore
    }
    void loadConversations();
  }

  async function saveSettings() {
    if (!deviceKey) return;
    if (nameDraft.trim().length < 2 || nameDraft.trim().length > 40) {
      toast({ title: t.nameRequired, variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/chat/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceKey,
          name: nameDraft.trim(),
          bio: bioDraft.trim(),
          emoji: emojiDraft,
          color: colorDraft,
        }),
      });
      const data = await res.json();
      if (data?.ok) {
        setProfile(data.profile as ChatProfileItem);
        setShowSettings(false);
        toast({ title: t.saved });
        void loadConversations();
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  if (!deviceKey) {
    return (
      <div className="flex h-[60vh] items-center justify-center rounded-2xl border border-border bg-card">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  const activeConversation = conversations.find((c) => c.id === activeConvId);
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const searchMode = searchQ.trim().length > 0;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
          <MessagesSquare className="size-6" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-foreground">{t.chatTitle}</h1>
          <p className="text-sm text-muted-foreground">{t.chatSubtitle}</p>
        </div>
      </div>

      <div className="flex h-[calc(100dvh-215px)] min-h-[440px] overflow-hidden rounded-2xl border border-border bg-card">
        {/* Chap ustun — profil, qidiruv, random chat, ro'yxatlar */}
        <div
          className={cn(
            "flex w-full shrink-0 flex-col border-r border-border sm:w-80",
            activeConvId ? "hidden sm:flex" : "flex"
          )}
        >
          {/* Mening profilim + gildirak (sozlamalar) */}
          <div className="flex items-center gap-3 border-b border-border px-3 py-3">
            {profile ? (
              <>
                <button
                  onClick={() => {
                    setNameDraft(profile.name);
                    setBioDraft(profile.bio);
                    setEmojiDraft(profile.emoji);
                    setColorDraft(profile.color);
                    setShowSettings(true);
                  }}
                  aria-label={t.settings}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-1 text-left transition-colors hover:bg-secondary/60"
                >
                  <ChatAvatar
                    emoji={profile.emoji}
                    color={profile.color}
                    name={profile.name}
                    className="size-9"
                    emojiClassName="text-base"
                    online
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-foreground">
                      {profile.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">{t.you} · {t.online}</span>
                  </span>
                </button>
                <button
                  onClick={() => {
                    setNameDraft(profile.name);
                    setBioDraft(profile.bio);
                    setEmojiDraft(profile.emoji);
                    setColorDraft(profile.color);
                    setShowSettings(true);
                  }}
                  aria-label={t.settings}
                  title={t.settings}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80"
                >
                  <Settings className="size-5" aria-hidden="true" />
                </button>
              </>
            ) : (
              <span className="flex items-center gap-3 px-1">
                <span className="size-9 animate-pulse rounded-full bg-secondary" />
                <span className="h-4 w-24 animate-pulse rounded bg-secondary" />
              </span>
            )}
          </div>

          {/* Qidiruv */}
          <div className="px-3 pt-3">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3">
              <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder={t.searchPlaceholder}
                aria-label={t.searchPlaceholder}
                className="h-10 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Random chat tugmasi */}
          <div className="px-3 pt-3">
            <button
              onClick={() => void startRandom()}
              disabled={randomState === "waiting"}
              className="flex w-full items-center gap-3 rounded-xl bg-sky-600 px-4 py-2.5 text-left text-white transition-colors hover:bg-sky-700 disabled:opacity-60"
            >
              <Shuffle className="size-5 shrink-0" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">{t.randomChat}</span>
                <span className="block text-xs text-sky-100">{t.randomDesc}</span>
              </span>
            </button>
          </div>

          {/* Ro'yxat */}
          <div className="mt-3 min-h-0 flex-1 overflow-y-auto px-3 pb-3 scrollbar-thin">
            {searchMode ? (
              <section aria-label={t.people} className="flex flex-col gap-1">
                <p className="px-1 pb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {t.people}
                </p>
                {people.length === 0 ? (
                  <div className="px-1 py-6 text-center">
                    <p className="text-sm text-muted-foreground">{t.emptyPeople}</p>
                    <p className="mt-1 text-xs text-muted-foreground/80">{t.emptyPeopleHint}</p>
                  </div>
                ) : (
                  people.map((p) => (
                    <button
                      key={p.deviceKey}
                      onClick={() => void openWithPeer(p.deviceKey)}
                      className="flex items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-secondary/60"
                    >
                      <ChatAvatar
                        emoji={p.emoji}
                        color={p.color}
                        name={p.name}
                        className="size-10"
                        emojiClassName="text-xl"
                        online={p.online}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-foreground">
                          {p.name}
                        </span>
                        <span
                          className={cn(
                            "block truncate text-xs",
                            p.online ? "font-semibold text-emerald-600" : "text-muted-foreground"
                          )}
                        >
                          {p.bio || (p.online ? t.online : t.offline)}
                        </span>
                      </span>
                      <MessageCircle className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    </button>
                  ))
                )}
              </section>
            ) : loading ? (
              <div className="flex flex-col gap-3 px-1 pt-2">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="flex items-center gap-3">
                    <span className="size-10 animate-pulse rounded-full bg-secondary" />
                    <span className="flex-1">
                      <span className="mb-1 block h-3.5 w-28 animate-pulse rounded bg-secondary" />
                      <span className="block h-3 w-40 animate-pulse rounded bg-secondary/80" />
                    </span>
                  </span>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="px-2 py-8 text-center">
                <UserRound className="mx-auto size-8 text-muted-foreground/50" aria-hidden="true" />
                <p className="mt-2 text-sm text-muted-foreground">{t.emptyChats}</p>
              </div>
            ) : (
              <section aria-label={t.chats} className="flex flex-col gap-1">
                <p className="flex items-center gap-2 px-1 pb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {t.chats}
                  {totalUnread > 0 ? (
                    <span className="rounded-full bg-sky-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      {totalUnread}
                    </span>
                  ) : null}
                </p>
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setRandomState("idle");
                      setActiveConvId(c.id);
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-secondary/60",
                      c.id === activeConvId && "bg-secondary"
                    )}
                  >
                    {c.partner ? (
                      <ChatAvatar
                        emoji={c.partner.emoji}
                        color={c.partner.color}
                        name={c.partner.name}
                        className="size-10"
                        emojiClassName="text-xl"
                        online={c.partner.online}
                      />
                    ) : (
                      <span className="size-10 shrink-0 rounded-full bg-secondary" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-foreground">
                          {c.partner?.name ?? t.unknownUser}
                        </span>
                        {c.lastMessage ? (
                          <span className="shrink-0 text-[10px] text-muted-foreground">
                            {new Date(c.updatedAt).toLocaleTimeString(chatLocale(lang), {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })}
                          </span>
                        ) : null}
                      </span>
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-xs text-muted-foreground">
                          {c.isRandom ? `${t.randomChat}: ` : ""}
                          {c.lastMessage
                            ? `${c.lastMessage.mine ? `${t.you}: ` : ""}${
                                c.lastMessage.kind === "image"
                                  ? "[photo]"
                                  : c.lastMessage.kind === "sticker"
                                    ? c.lastMessage.content
                                    : c.lastMessage.kind === "system"
                                      ? t.chatEnded
                                      : c.lastMessage.content
                              }`
                            : t.messagesEmpty}
                        </span>
                        {c.unreadCount > 0 ? (
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-sky-600 text-[10px] font-bold text-white">
                            {c.unreadCount}
                          </span>
                        ) : null}
                      </span>
                    </span>
                  </button>
                ))}
              </section>
            )}
          </div>
        </div>

        {/* O'ng ustun — suhbat / random / bo'sh holat */}
        <div className={cn("min-w-0 flex-1", activeConvId ? "flex" : "hidden sm:flex")}>
          {randomState === "waiting" ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
              <Loader2 className="size-10 animate-spin text-sky-600" aria-hidden="true" />
              <p className="text-base font-bold text-foreground">{t.waiting}</p>
              <p className="text-sm text-muted-foreground">{t.waitingHint}</p>
              <button
                onClick={() => void randomBack()}
                className="mt-2 flex h-10 items-center rounded-full border border-border bg-background px-5 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
              >
                {t.cancel}
              </button>
            </div>
          ) : activeConvId ? (
            <ChatWindow
              key={activeConvId}
              deviceKey={deviceKey}
              lang={lang}
              conversationId={activeConvId}
              initialIsRandom={
                randomState === "matched" || Boolean(activeConversation?.isRandom)
              }
              onBack={() => setActiveConvId(null)}
              onOpenPeer={setPeer}
              onRandomNext={() => void randomNext()}
              onRandomBack={() => void randomBack()}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                <MessagesSquare className="size-8" aria-hidden="true" />
              </span>
              <p className="text-base font-bold text-foreground">{t.chatTitle}</p>
              <p className="max-w-xs text-sm text-muted-foreground">{t.emptyChats}</p>
            </div>
          )}
        </div>
      </div>

      {/* Sozlamalar (gildirak) — til tanlash + profil */}
      {showSettings && profile ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t.settings}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSettings(false);
          }}
        >
          <div className="flex max-h-[85vh] w-full max-w-sm flex-col gap-4 overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-xl scrollbar-thin">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">{t.settings}</h2>
              <button
                onClick={() => setShowSettings(false)}
                aria-label={t.cancel}
                className="flex size-8 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-secondary/80"
              >
                ✕
              </button>
            </div>

            {/* Til */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-foreground">{t.language}</p>
              <div className="grid grid-cols-3 gap-2">
                {CHAT_LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => changeLang(l.code)}
                    aria-pressed={lang === l.code}
                    className={cn(
                      "flex h-10 items-center justify-center rounded-xl border text-sm font-semibold transition-colors",
                      lang === l.code
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-border bg-background text-foreground hover:bg-secondary/60"
                    )}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mening profilim */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-foreground">{t.myProfile}</p>
              <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                {t.name}
                <input
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  maxLength={40}
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                {t.bio}
                <textarea
                  value={bioDraft}
                  onChange={(e) => setBioDraft(e.target.value)}
                  maxLength={200}
                  rows={2}
                  placeholder={t.bioPlaceholder}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                />
              </label>

              <p className="mt-1 text-xs text-muted-foreground">Emoji</p>
              <div className="grid grid-cols-6 gap-1">
                {CHAT_EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEmojiDraft(e)}
                    aria-pressed={emojiDraft === e}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg text-xl transition-colors",
                      emojiDraft === e ? "bg-sky-100 ring-2 ring-sky-500" : "hover:bg-secondary"
                    )}
                  >
                    {e}
                  </button>
                ))}
              </div>

              <p className="mt-1 text-xs text-muted-foreground">Color</p>
              <div className="flex gap-2">
                {CHAT_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColorDraft(c)}
                    aria-pressed={colorDraft === c}
                    aria-label={c}
                    className={cn(
                      "size-7 rounded-full transition-shadow",
                      CHAT_AVATAR_COLORS[c],
                      colorDraft === c && "ring-2 ring-sky-500 ring-offset-2"
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(false)}
                className="h-10 flex-1 rounded-xl border border-border bg-background text-sm font-bold text-foreground hover:bg-secondary"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => void saveSettings()}
                disabled={saving}
                className="h-10 flex-1 rounded-xl bg-sky-600 text-sm font-bold text-white transition-colors hover:bg-sky-700 disabled:opacity-60"
              >
                {saving ? <Loader2 className="mx-auto size-4 animate-spin" aria-hidden="true" /> : t.save}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Sherik profili */}
      {peer ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t.viewProfile}
          onClick={(e) => {
            if (e.target === e.currentTarget) setPeer(null);
          }}
        >
          <div className="w-full max-w-xs rounded-2xl border border-border bg-card p-5 text-center shadow-xl">
            <ChatAvatar
              emoji={peer.emoji}
              color={peer.color}
              name={peer.name}
              className="mx-auto size-16"
              emojiClassName="text-3xl"
              online={peer.online}
            />
            <h2 className="mt-3 text-base font-bold text-foreground">{peer.name}</h2>
            <p
              className={cn(
                "mt-0.5 text-xs font-semibold",
                peer.online ? "text-emerald-600" : "text-muted-foreground"
              )}
            >
              {peer.online ? t.online : t.offline}
            </p>
            {peer.bio ? (
              <p className="mt-2 text-sm text-muted-foreground">{peer.bio}</p>
            ) : null}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setPeer(null)}
                className="h-10 flex-1 rounded-xl border border-border bg-background text-sm font-bold text-foreground hover:bg-secondary"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => void openWithPeer(peer.deviceKey)}
                className="h-10 flex-1 rounded-xl bg-sky-600 text-sm font-bold text-white transition-colors hover:bg-sky-700"
              >
                {t.message}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
