"use client";

import { Bell } from "lucide-react";
import { AvatarBubble } from "./avatar";
import { VideoGrid } from "./video-card";
import { formatCount } from "@/lib/randap-client";
import type { ChannelInfo, VideoItem } from "@/lib/randap-types";
import { cn } from "@/lib/utils";

type ChannelViewProps = {
  channel: ChannelInfo | null;
  loading: boolean;
  deviceKey: string;
  onSubscribe: () => Promise<void>;
  onOpen: (video: VideoItem) => void;
  onOpenChannel: (uploaderId: string) => void;
  onBack: () => void;
};

export function ChannelView({
  channel,
  loading,
  onSubscribe,
  onOpen,
  onOpenChannel,
  onBack,
}: ChannelViewProps) {
  if (loading || !channel) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-6">
      <div className="flex flex-col items-start gap-5 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:p-6">
        <AvatarBubble
          name={channel.name}
          avatar={channel.avatar}
          className="size-16 text-2xl"
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-foreground">{channel.name}</h1>
          <p className="text-sm text-muted-foreground">
            {channel.handle} · {formatCount(channel.subscriberCount)} obunachi ·{" "}
            {channel.videoCount} video · {formatCount(channel.points)} ball
          </p>
        </div>
        <button
          onClick={onSubscribe}
          className={cn(
            "flex h-9 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors",
            channel.subscribedByMe
              ? "border border-border bg-secondary text-foreground hover:bg-secondary/80"
              : "bg-foreground text-background hover:bg-foreground/90"
          )}
        >
          <Bell className="size-4" aria-hidden="true" />
          {channel.subscribedByMe ? "Obuna bo'lingan" : "Obuna bo'lish"}
        </button>
      </div>

      <section aria-label="Kanal videolari" className="flex flex-col gap-4">
        <h2 className="text-base font-bold text-foreground">Videolar</h2>
        <VideoGrid
          videos={channel.videos}
          onOpen={onOpen}
          onOpenChannel={onOpenChannel}
          emptyText="Bu kanalda hozircha video yo'q."
        />
      </section>

      <button
        onClick={onBack}
        className="mx-auto rounded-full border border-border bg-secondary px-5 py-2 text-sm font-semibold hover:bg-secondary/80"
      >
        Orqaga
      </button>
    </div>
  );
}
