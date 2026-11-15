"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  MessageSquare,
  Send,
  ThumbsUp,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatCount } from "@/lib/randap-client";
import type { VideoItem } from "@/lib/randap-types";
import { cn } from "@/lib/utils";

type ShortsViewProps = {
  shorts: VideoItem[];
  loading: boolean;
  deviceKey: string;
  onBack: () => void;
  onOpenChannel: (uploaderId: string) => void;
  onOpenWatch: (videoId: string) => void;
};

function ShortItem({
  short,
  deviceKey,
  muted,
  onToggleMute,
  onOpenChannel,
  onOpenWatch,
}: {
  short: VideoItem;
  deviceKey: string;
  muted: boolean;
  onToggleMute: () => void;
  onOpenChannel: (uploaderId: string) => void;
  onOpenWatch: (videoId: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(short.likeCount);
  const [commentCount] = useState(short.commentCount);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  // Scrollga qarab avtomatik o'ynatish/pauza
  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            video.play().catch(() => undefined);
          } else {
            video.pause();
          }
        }
      },
      { threshold: [0, 0.6, 1] }
    );
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = muted;
  }, [muted]);

  async function toggleLike() {
    try {
      const res = await fetch("/api/video/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: short.id, deviceId: deviceKey }),
      });
      const data = await res.json();
      if (data.ok) {
        setLiked(data.liked);
        setLikeCount(data.count);
      } else {
        toast({ title: "Xatolik", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Xatolik", description: "Layk yuborilmadi", variant: "destructive" });
    }
  }

  async function postComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: short.id,
          deviceId: deviceKey,
          body: commentText.trim(),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        toast({ title: "Izoh qo'shildi" });
        setCommentText("");
        setShowComments(false);
      } else {
        toast({ title: "Xatolik", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Xatolik", description: "Izoh yuborilmadi", variant: "destructive" });
    }
  }

  return (
    <div
      ref={wrapRef}
      className="relative flex h-full w-full shrink-0 snap-start snap-always items-center justify-center"
    >
      <div className="relative h-full max-h-[calc(100vh-8rem)] w-full max-w-[420px] overflow-hidden rounded-2xl bg-black">
        <video
          ref={videoRef}
          src={`/${short.videoPath}`}
          poster={`/${short.thumbPath}`}
          loop
          muted
          playsInline
          preload="metadata"
          onClick={() => {
            const v = videoRef.current;
            if (!v) return;
            if (v.paused) {
              v.play().catch(() => undefined);
            } else {
              v.pause();
            }
          }}
          className="h-full w-full cursor-pointer object-cover"
        />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 pt-10">
          <button
            onClick={() => onOpenChannel(short.uploader.id)}
            className="flex items-center gap-2 text-left"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {short.uploader.name.slice(0, 1).toUpperCase()}
            </span>
            <span className="text-sm font-semibold text-white">
              {short.uploader.name}
            </span>
          </button>
          <p className="mt-2 line-clamp-2 text-sm font-medium text-white">
            {short.title}
          </p>
        </div>

        {/* O'ng tomondagi tugmalar: like, izoh */}
        <div className="absolute bottom-20 right-3 flex flex-col items-center gap-4">
          <button
            onClick={toggleLike}
            aria-pressed={liked}
            aria-label="Layk bosish"
            className="flex flex-col items-center gap-1"
          >
            <span
              className={cn(
                "flex size-11 items-center justify-center rounded-full",
                liked ? "bg-primary text-primary-foreground" : "bg-white/20 text-white"
              )}
            >
              <ThumbsUp className={cn("size-5", liked && "fill-current")} aria-hidden="true" />
            </span>
            <span className="text-[11px] font-semibold text-white">
              {formatCount(likeCount)}
            </span>
          </button>

          {short.allowComments ? (
            <button
              onClick={() => setShowComments(true)}
              aria-label="Izohlar"
              className="flex flex-col items-center gap-1"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-white/20 text-white">
                <MessageSquare className="size-5" aria-hidden="true" />
              </span>
              <span className="text-[11px] font-semibold text-white">
                {formatCount(commentCount)}
              </span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Izohlar paneli (shorts ichida) */}
      {showComments ? (
        <div className="absolute inset-0 z-10 flex items-end justify-center bg-black/60 p-4 pb-24">
          <form
            onSubmit={postComment}
            className="w-full max-w-[420px] rounded-2xl border border-border bg-card p-4"
          >
            <p className="text-sm font-semibold text-foreground">Izoh yozish</p>
            <div className="mt-2 flex gap-2">
              <input
                autoFocus
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Fikringiz..."
                maxLength={1000}
                aria-label="Shorts izohi"
                className="h-10 flex-1 rounded-full border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
              <button
                type="submit"
                aria-label="Yuborish"
                disabled={!commentText.trim()}
                className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
              >
                <Send className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-3 flex justify-between">
              <button
                type="button"
                onClick={() => onOpenWatch(short.id)}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Barcha izohlarni videoda ko&apos;rish
              </button>
              <button
                type="button"
                onClick={() => setShowComments(false)}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Yopish
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export function ShortsView({
  shorts,
  loading,
  deviceKey,
  onBack,
  onOpenChannel,
  onOpenWatch,
}: ShortsViewProps) {
  const [muted, setMuted] = useState(true);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
        <p className="text-base font-semibold">Shorts hozircha yo&apos;q</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          &laquo;+&raquo; tugmasini bosib, 1:20 (80 soniya) gacha bo&apos;lgan
          video yuklang — u Shorts bo&apos;limida paydo bo&apos;ladi.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Orqaga qaytish"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Shorts</h1>
        <button
          onClick={() => setMuted((m) => !m)}
          className="ml-auto rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary/80"
        >
          {muted ? "Ovozni yoqish" : "Ovozni o'chirish"}
        </button>
      </div>

      <div
        className="flex h-[calc(100vh-9rem)] snap-y snap-mandatory flex-col gap-4 overflow-y-auto scrollbar-thin"
        aria-label="Shorts lenta"
      >
        {shorts.map((short) => (
          <ShortItem
            key={short.id}
            short={short}
            deviceKey={deviceKey}
            muted={muted}
            onToggleMute={() => setMuted((m) => !m)}
            onOpenChannel={onOpenChannel}
            onOpenWatch={onOpenWatch}
          />
        ))}
      </div>
    </div>
  );
}
