"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Loader2,
  MessageSquare,
  Send,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCount, formatDuration, timeAgo } from "@/lib/randap-client";
import type { VideoDetail } from "@/lib/randap-types";
import { cn } from "@/lib/utils";

type WatchViewProps = {
  videoId: string;
  deviceKey: string;
  onBack: () => void;
  onOpenChannel: (uploaderId: string) => void;
  onLikeChanged: () => void;
};

export function WatchView({
  videoId,
  deviceKey,
  onBack,
  onOpenChannel,
  onLikeChanged,
}: WatchViewProps) {
  const [video, setVideo] = useState<VideoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [localCommentCount, setLocalCommentCount] = useState<number | null>(null);
  const viewedRef = useRef<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/video?id=${encodeURIComponent(videoId)}&deviceKey=${encodeURIComponent(deviceKey)}`
      );
      const data = await res.json();
      if (data.ok) {
        setVideo(data.video as VideoDetail);
        setLocalCommentCount(null);
      }
    } finally {
      setLoading(false);
    }
  }, [videoId, deviceKey]);

  useEffect(() => {
    load();
  }, [load]);

  // Ko'rishlar hisoblagichi — har bir video uchun bir marta
  useEffect(() => {
    if (!videoId || viewedRef.current === videoId) return;
    viewedRef.current = videoId;
    fetch("/api/video/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: videoId }),
    }).catch(() => undefined);
  }, [videoId]);

  async function toggleLike() {
    if (!video || liking) return;
    setLiking(true);
    try {
      const res = await fetch("/api/video/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: video.id, deviceId: deviceKey }),
      });
      const data = await res.json();
      if (data.ok) {
        setVideo((prev) =>
          prev ? { ...prev, likedByMe: data.liked, likeCount: data.count } : prev
        );
        onLikeChanged();
      } else {
        toast({ title: "Xatolik", description: data.error, variant: "destructive" });
      }
    } finally {
      setLiking(false);
    }
  }

  async function toggleSubscribe() {
    if (!video || subscribing) return;
    setSubscribing(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: video.uploader.id, deviceId: deviceKey }),
      });
      const data = await res.json();
      if (data.ok) {
        setVideo((prev) =>
          prev
            ? { ...prev, subscribedByMe: data.subscribed, subscriberCount: data.count }
            : prev
        );
        toast({
          title: data.subscribed
            ? `${video.uploader.name} kanaliga obuna bo'ldingiz`
            : "Obuna bekor qilindi",
        });
      } else {
        toast({ title: "Xatolik", description: data.error, variant: "destructive" });
      }
    } finally {
      setSubscribing(false);
    }
  }

  async function postComment(e: React.FormEvent) {
    e.preventDefault();
    if (!video || !commentText.trim() || postingComment) return;
    setPostingComment(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: video.id,
          deviceId: deviceKey,
          body: commentText.trim(),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setVideo((prev) =>
          prev
            ? { ...prev, comments: [data.comment, ...prev.comments] }
            : prev
        );
        setLocalCommentCount((prev) => (prev ?? video.comments.length) + 1);
        setCommentText("");
        toast({ title: "Izohingiz qo'shildi" });
      } else {
        toast({ title: "Xatolik", description: data.error, variant: "destructive" });
      }
    } finally {
      setPostingComment(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
        <p className="text-base font-semibold">Video topilmadi</p>
        <button
          onClick={onBack}
          className="rounded-full border border-border bg-secondary px-4 py-2 text-sm font-semibold hover:bg-secondary/80"
        >
          Orqaga
        </button>
      </div>
    );
  }

  const commentCount = localCommentCount ?? video.comments.length;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 pb-6">
      {/* Orqaga strelka */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Orqaga qaytish"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <h1 className="truncate text-lg font-bold text-foreground">{video.title}</h1>
      </div>

      {/* Pleyer */}
      <div className="overflow-hidden rounded-xl bg-black">
        <video
          key={video.id}
          src={`/${video.videoPath}`}
          controls
          playsInline
          preload="metadata"
          poster={`/${video.thumbPath}`}
          className="aspect-video w-full"
        >
          Brauzeringiz video tag&apos;ni qo&apos;llab-quvvatlamaydi.
        </video>
      </div>

      {/* Sarlavha + statistika */}
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-xl font-bold leading-snug text-foreground">
            {video.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCount(video.views)} ko&apos;rildi ·{" "}
            {timeAgo(video.createdAt)} · {formatDuration(video.durationSec)}
            {video.kind === "short" ? " · Shorts" : ""}
            {!video.allowComments ? " · Chat o'chirilgan" : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Kanal + subscribe */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenChannel(video.uploader.id)}
              aria-label={`${video.uploader.name} kanaliga o'tish`}
              className="flex size-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground transition-transform hover:scale-105"
            >
              {video.uploader.name.slice(0, 1).toUpperCase()}
            </button>
            <div>
              <button
                onClick={() => onOpenChannel(video.uploader.id)}
                className="block text-sm font-semibold text-foreground hover:text-primary/90"
              >
                {video.uploader.name}
              </button>
              <p className="text-xs text-muted-foreground">
                {formatCount(video.subscriberCount ?? 0)} obunachi · {video.uploader.handle}
              </p>
            </div>
            <button
              onClick={toggleSubscribe}
              disabled={subscribing}
              className={cn(
                "ml-2 flex h-9 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors",
                video.subscribedByMe
                  ? "border border-border bg-secondary text-foreground hover:bg-secondary/80"
                  : "bg-foreground text-background hover:bg-foreground/90"
              )}
            >
              {video.subscribedByMe ? (
                <>
                  <Bell className="size-4" aria-hidden="true" />
                  Obuna bo&apos;lingan
                </>
              ) : (
                "Obuna bo'lish"
              )}
            </button>
          </div>

          {/* Like */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLike}
              disabled={liking}
              className={cn(
                "flex h-9 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors",
                video.likedByMe
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              )}
              aria-pressed={video.likedByMe}
            >
              {video.likedByMe ? (
                <ThumbsUp className="size-4 fill-current" aria-hidden="true" />
              ) : (
                <ThumbsUp className="size-4" aria-hidden="true" />
              )}
              {formatCount(video.likeCount)}
            </button>
            <span
              className="flex h-9 items-center gap-2 rounded-full bg-secondary px-4 text-sm font-semibold text-muted-foreground"
              title="Yaqinda qo'shiladi"
            >
              <ThumbsDown className="size-4" aria-hidden="true" />
              0
            </span>
          </div>
        </div>

        {/* Description */}
        {video.description ? (
          <div className="whitespace-pre-wrap rounded-xl bg-card p-4 text-sm leading-relaxed text-foreground/90">
            {video.description}
          </div>
        ) : null}
      </div>

      {/* Izohlar (chat) — yuklashda belgilangan "chat mumkinmi" bo'yicha */}
      <section aria-label="Izohlar" className="flex flex-col gap-4">
        <h3 className="flex items-center gap-2 text-base font-bold text-foreground">
          <MessageSquare className="size-4" aria-hidden="true" />
          Izohlar · {formatCount(commentCount)}
        </h3>

        {video.allowComments ? (
          <form onSubmit={postComment} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Izoh yozing..."
                aria-label="Izoh yozish"
                maxLength={1000}
                className="h-10 flex-1 rounded-full border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
              <button
                type="submit"
                disabled={postingComment || !commentText.trim()}
                aria-label="Izohni yuborish"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {postingComment ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </form>
        ) : (
          <p className="rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
            Bu videoda chat o&apos;chirilgan — muallif izohlarni yoqib qo&apos;ymagan.
          </p>
        )}

        <ul className="flex flex-col gap-4">
          {video.comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                {c.author.name.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{c.author.name}</span>{" "}
                  · {timeAgo(c.createdAt)}
                </p>
                <p className="mt-1 break-words text-sm leading-relaxed text-foreground/90">
                  {c.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
