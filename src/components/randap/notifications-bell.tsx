"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AvatarBubble } from "./avatar";
import { useLang } from "./lang-provider";
import { getDeviceKey, timeAgo } from "@/lib/randap-client";
import type { VideoItem } from "@/lib/randap-types";
import { cn } from "@/lib/utils";

type NotifItem = {
  id: string;
  type: string;
  text: string;
  actorName: string;
  videoId: string | null;
  readAt: string | null;
  createdAt: string;
};

const POLL_MS = 30_000;

/** Header'dagi bildirishnoma qo'ng'iroqchasi */
export function NotificationsBell({ onOpenVideo }: { onOpenVideo?: (videoId: string) => void }) {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotifItem[] | null>(null);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const refresh = useCallback(async () => {
    const deviceKey = getDeviceKey();
    if (!deviceKey) return;
    try {
      const res = await fetch(
        `/api/notifications?deviceKey=${encodeURIComponent(deviceKey)}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (data?.ok) {
        setItems(data.items ?? []);
        setUnread(data.unreadCount ?? 0);
      }
    } catch {
      // jim o'tamiz
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = setInterval(() => void refresh(), POLL_MS);
    const onFocus = () => void refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  async function openBox() {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) {
      const deviceKey = getDeviceKey();
      if (!deviceKey) return;
      setLoading(true);
      try {
        await fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceKey, action: "readAll" }),
        });
        setUnread(0);
      } finally {
        setLoading(false);
      }
    }
  }

  async function markAllAgain() {
    const deviceKey = getDeviceKey();
    if (!deviceKey) return;
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceKey, action: "readAll" }),
      });
      setItems((prev) => prev?.map((n) => ({ ...n, readAt: new Date().toISOString() })) ?? prev);
      toast({ title: t("notifReadAll") });
    } catch {
      // ignore
    }
  }

  function notifLabel(n: NotifItem) {
    const name = n.actorName || "Randap";
    switch (n.type) {
      case "like":
        return t("notifLike", { n: name });
      case "comment":
        return t("notifComment", { n: name });
      case "reply":
        return t("notifReply", { n: name });
      case "subscribe":
        return t("notifSubscribe", { n: name });
      case "video":
        return t("notifVideo", { n: name });
      default:
        return name;
    }
  }

  function openTarget(n: NotifItem) {
    if (n.videoId && onOpenVideo) {
      setOpen(false);
      onOpenVideo(n.videoId);
    }
  }

  return (
    <div ref={boxRef} className="relative shrink-0">
      <button
        onClick={openBox}
        aria-label={t("notifTitle")}
        title={t("notifTitle")}
        className="relative flex size-9 items-center justify-center rounded-full border border-border bg-secondary/60 text-foreground transition-colors hover:bg-secondary"
      >
        <Bell className="size-4" aria-hidden="true" />
        {unread > 0 ? (
          <span className="absolute -right-1 -top-1 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          className="absolute right-0 top-11 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-lg"
          role="dialog"
          aria-label={t("notifTitle")}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <span className="text-sm font-bold text-foreground">{t("notifTitle")}</span>
            <button
              onClick={markAllAgain}
              className="flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              {loading ? (
                <Loader2 className="size-3 animate-spin" aria-hidden="true" />
              ) : (
                <CheckCheck className="size-3.5" aria-hidden="true" />
              )}
              {t("notifReadAll")}
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto scrollbar-thin">
            {!items ? (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">...</p>
            ) : items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                {t("notifEmpty")}
              </p>
            ) : (
              <ul className="flex flex-col">
                {items.map((n) => (
                  <li key={n.id}>
                    <button
                      onClick={() => openTarget(n)}
                      disabled={!n.videoId}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
                        n.videoId ? "hover:bg-secondary/50" : "cursor-default",
                        !n.readAt && "bg-primary/5"
                      )}
                    >
                      <AvatarBubble
                        name={n.actorName || "R"}
                        className="size-8 shrink-0 text-xs"
                        avatar={null}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium leading-snug text-foreground">
                          {notifLabel(n)}
                        </span>
                        {n.text ? (
                          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                            {n.text}
                          </span>
                        ) : null}
                        <span className="mt-0.5 block text-[11px] text-muted-foreground">
                          {timeAgo(n.createdAt, lang)}
                        </span>
                      </span>
                      {!n.readAt ? (
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
