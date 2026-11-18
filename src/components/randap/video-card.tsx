"use client";

import { useSyncExternalStore } from "react";
import { Bookmark } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { AvatarBubble } from "./avatar";
import { useLang } from "./lang-provider";
import {
  formatCount,
  formatDuration,
  timeAgo,
  getWatchLater,
  toggleWatchLater,
  subscribeWatchLater,
} from "@/lib/randap-client";
import type { VideoItem } from "@/lib/randap-types";
import { cn } from "@/lib/utils";

type VideoCardProps = {
  video: VideoItem;
  onOpen: (video: VideoItem) => void;
  onOpenChannel: (uploaderId: string) => void;
  compact?: boolean;
};

export function VideoCard({ video, onOpen, onOpenChannel, compact }: VideoCardProps) {
  const { t, lang } = useLang();
  const saved = useSyncExternalStore(
    subscribeWatchLater,
    () => getWatchLater().includes(video.id),
    () => false
  );

  function toggleSave(e: React.SyntheticEvent) {
    e.stopPropagation();
    const nowSaved = toggleWatchLater(video.id);
    toast({ title: t(nowSaved ? "savedAdded" : "savedRemoved") });
  }

  return (
    <article className={cn("group flex flex-col", compact && "gap-2")}>
      <button
        onClick={() => onOpen(video)}
        className="relative w-full overflow-hidden rounded-xl bg-card text-left focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`${video.title} — ko'rish`}
      >
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={`/${video.thumbPath}`}
            alt={`${video.title} rasmi`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">
          {formatDuration(video.durationSec)}
        </span>
        <span
          role="button"
          tabIndex={0}
          onClick={toggleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleSave(e);
          }}
          aria-pressed={saved}
          aria-label={t("watchLater")}
          title={t("watchLater")}
          className={cn(
            "absolute left-2 top-2 flex size-8 items-center justify-center rounded-full transition-colors",
            saved
              ? "bg-primary text-primary-foreground"
              : "bg-black/70 text-white opacity-0 focus-visible:opacity-100 group-hover:opacity-100"
          )}
        >
          <Bookmark className={cn("size-4", saved && "fill-current")} aria-hidden="true" />
        </span>
        {video.kind === "short" ? (
          <span className="absolute left-2 top-2 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
            SHORT
          </span>
        ) : null}
      </button>

      <div className="mt-2.5 flex gap-3">
        <button
          onClick={() => onOpenChannel(video.uploader.id)}
          aria-label={`${video.uploader.name} kanaliga o'tish`}
          className="mt-0.5 transition-transform hover:scale-105"
        >
          <AvatarBubble
            name={video.uploader.name}
            avatar={video.uploader.avatar}
            className="size-8 text-xs"
          />
        </button>
        <div className="min-w-0 flex-1">
          <button
            onClick={() => onOpen(video)}
            className="block w-full text-left focus-visible:ring-2 focus-visible:ring-ring"
          >
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary/90">
              {video.title}
            </h3>
          </button>
          <button
            onClick={() => onOpenChannel(video.uploader.id)}
            className="mt-1 block text-left text-xs text-muted-foreground hover:text-foreground"
          >
            {video.uploader.name}
          </button>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatCount(video.views, lang)} {t("viewsUnit")} · {timeAgo(video.createdAt, lang)}
          </p>
        </div>
      </div>
    </article>
  );
}

export function VideoGrid({
  videos,
  loading,
  onOpen,
  onOpenChannel,
  emptyText,
}: {
  videos: VideoItem[];
  loading?: boolean;
  onOpen: (video: VideoItem) => void;
  onOpenChannel: (uploaderId: string) => void;
  emptyText?: string;
}) {
  const { t } = useLang();
  const emptyFallback = t("emptyHome");
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2.5">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
        <p className="text-base font-semibold text-foreground">{t("empty")}</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{emptyText ?? emptyFallback}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onOpen={onOpen}
          onOpenChannel={onOpenChannel}
        />
      ))}
    </div>
  );
}
