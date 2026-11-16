"use client";

import { useEffect, useState } from "react";
import { Loader2, Medal, Trophy } from "lucide-react";
import { AvatarBubble } from "./avatar";
import { useLang } from "./lang-provider";
import { formatCount } from "@/lib/randap-client";
import type { LeaderEntry, LeaderMe } from "@/lib/randap-types";
import { cn } from "@/lib/utils";

const RANK_CLASSES = ["text-amber-500", "text-zinc-400", "text-amber-700"];

export function BallarView({ deviceKey }: { deviceKey: string }) {
  const { t, lang } = useLang();
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [me, setMe] = useState<LeaderMe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const url = deviceKey
      ? `/api/leaderboard?deviceKey=${encodeURIComponent(deviceKey)}`
      : "/api/leaderboard";
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.ok) {
          setLoading(false);
          return;
        }
        setLeaders(data.leaders ?? []);
        setMe(data.me ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [deviceKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pb-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
          <Trophy className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold text-foreground">{t("ballarTitle")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("ballarSub")}
          </p>
        </div>
      </div>

      {/* Mening ballim */}
      {me ? (
        <div className="flex items-center gap-4 rounded-2xl border border-primary/40 bg-primary/5 p-5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary font-extrabold text-primary-foreground">
            {me.rank}
          </span>
          <AvatarBubble name={me.name} avatar={me.avatar} className="size-12 text-base" />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 font-bold text-foreground">
              <span className="truncate">{me.name}</span>
              <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                {t("you")}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">{me.handle}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xl font-extrabold text-primary">
              {formatCount(me.points, lang)}
            </p>
            <p className="text-[11px] text-muted-foreground">{t("pointUnit")}</p>
          </div>
        </div>
      ) : null}

      {/* Reyting ro'yxati */}
      <ol className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {leaders.map((l, i) => (
          <li
            key={l.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3 sm:px-5",
              l.isMe && "bg-primary/5"
            )}
          >
            <span
              className={cn(
                "flex w-8 shrink-0 justify-center text-sm font-extrabold",
                RANK_CLASSES[i] ?? "text-muted-foreground"
              )}
            >
              {i < 3 ? (
                <Medal className={cn("size-5", RANK_CLASSES[i])} aria-hidden="true" />
              ) : (
                i + 1
              )}
            </span>
            <AvatarBubble
              name={l.name}
              avatar={l.avatar}
              className="size-9 text-sm"
            />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <span className="truncate">{l.name}</span>
                {l.isMe ? (
                  <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                    {t("you")}
                  </span>
                ) : null}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {l.handle} · {l.videoCount} {t("videoUnit")}
              </p>
            </div>
            <span className="shrink-0 text-right">
              <span className="block text-base font-extrabold text-foreground">
                {formatCount(l.points, lang)}
              </span>
              <span className="block text-[11px] text-muted-foreground">{t("pointUnit")}</span>
            </span>
          </li>
        ))}
      </ol>

      <p className="rounded-xl bg-secondary/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        {t("ballarHow")}
      </p>
    </div>
  );
}
