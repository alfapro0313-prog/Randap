"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Loader2, UserRound } from "lucide-react";
import { AvatarBubble } from "./avatar";
import { VideoGrid } from "./video-card";
import { useLang } from "./lang-provider";
import { formatCount } from "@/lib/randap-client";
import type { SearchData, SearchUser, VideoItem } from "@/lib/randap-types";

type SearchViewProps = {
  query: string;
  onOpen: (video: VideoItem) => void;
  onOpenChannel: (uploaderId: string) => void;
};

export function SearchView({ query, onOpen, onOpenChannel }: SearchViewProps) {
  const { t, lang } = useLang();
  const [data, setData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((raw) => {
          if (cancelled) return;
          setData(
            raw?.ok
              ? { users: raw.users ?? [], videos: raw.videos ?? [] }
              : { users: [], videos: [] }
          );
          setLoading(false);
        })
        .catch(() => {
          if (!cancelled) {
            setData({ users: [], videos: [] });
            setLoading(false);
          }
        });
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  function UserRow({ user }: { user: SearchUser }) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
        <AvatarBubble
          name={user.name}
          avatar={user.avatar}
          className="size-14 text-xl"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-foreground">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {user.handle} · {t("videoCountLine", { n: user.videoCount, p: formatCount(user.points, lang) })}
          </p>
        </div>
        <button
          onClick={() => onOpenChannel(user.id)}
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-border bg-secondary px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80"
        >
          <UserRound className="size-4" aria-hidden="true" />
          {t("profileBtn")}
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  const nothing = data?.users.length === 0 && data?.videos.length === 0;

  return (
    <div className="flex flex-col gap-7">
      <h1 className="text-lg font-bold text-foreground">
        {t("searchTitle", { q: query })}
      </h1>

      {nothing ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-base font-semibold text-foreground">
            {t("nothingFound")}
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {t("nothingFoundDesc", { q: query })}
          </p>
        </div>
      ) : null}

      {data && data.users.length > 0 ? (
        <section aria-label={t("profiles")} className="flex flex-col gap-4">
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
            <UserRound className="size-5 text-primary" aria-hidden="true" />
            {t("profiles")}
          </h2>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {data.users.map((u) => (
              <UserRow key={u.id} user={u} />
            ))}
          </div>
        </section>
      ) : null}

      {data && data.videos.length > 0 ? (
        <section aria-label={t("videosHeading")} className="flex flex-col gap-4">
          <h2 className="text-base font-bold text-foreground">{t("videosHeading")}</h2>
          <VideoGrid
            videos={data.videos}
            onOpen={onOpen}
            onOpenChannel={onOpenChannel}
          />
        </section>
      ) : null}
    </div>
  );
}
