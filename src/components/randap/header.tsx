"use client";

import { useEffect, useRef, useState } from "react";
import { CirclePlay, Loader2, Search, UserRound } from "lucide-react";
import { AvatarBubble } from "./avatar";
import { SettingsGear } from "./settings-dialog";
import { NotificationsBell } from "./notifications-bell";
import { useLang } from "./lang-provider";
import type { Me, SearchData } from "@/lib/randap-types";
import type { ViewName } from "./sidebar";

type HeaderProps = {
  me: Me | null;
  initialQuery?: string;
  onSearch: (q: string) => void;
  onNavigate: (view: ViewName) => void;
  onOpenChannel: (id: string) => void;
  onOpenVideo: (videoId: string) => void;
};

export function Header({
  me,
  initialQuery = "",
  onSearch,
  onNavigate,
  onOpenChannel,
  onOpenVideo,
}: HeaderProps) {
  const { t } = useLang();
  const [q, setQ] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchData | null>(null);
  const [suggesting, setSuggesting] = useState(false);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  // Live qidiruv takliflari — yozarozic profil va videolar chiqadi
  useEffect(() => {
    const term = q.trim();
    const timer = window.setTimeout(() => {
      if (term.length < 2) {
        setSuggestions(null);
        setSuggesting(false);
        return;
      }
      setSuggesting(true);
      fetch(`/api/search?q=${encodeURIComponent(term)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.ok) {
            setSuggestions({ users: data.users ?? [], videos: data.videos ?? [] });
            setOpen(true);
          }
          setSuggesting(false);
        })
        .catch(() => setSuggesting(false));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [q]);

  // Tashqariga bosilganda yopish
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-3 border-b border-border bg-background/95 backdrop-blur px-3 sm:px-4">
      <button
        onClick={() => onNavigate("portal")}
        className="flex shrink-0 items-center gap-1.5"
        aria-label={t("logoAria")}
        title={t("logoTitle")}
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <CirclePlay className="size-5" aria-hidden="true" />
        </span>
        <span className="text-lg font-extrabold tracking-tight text-foreground">
          Randap
        </span>
      </button>

      <div ref={boxRef} className="relative flex min-w-0 flex-1 justify-end">
        <form
          role="search"
          className="flex w-full max-w-xl items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
            onSearch(q.trim());
          }}
        >
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => suggestions && setOpen(true)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchAria")}
              className="h-9 w-full rounded-full border border-border bg-secondary/60 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <button
            type="submit"
            className="h-9 shrink-0 rounded-full border border-border bg-secondary px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80"
          >
            {t("searchButton")}
          </button>
        </form>

        {/* Qidiruv takliflari: profillar + videolar */}
        {open && (suggestions !== null || suggesting) ? (
          <div
            role="listbox"
            aria-label={t("searchAria")}
            className="absolute inset-x-0 top-11 z-50 mx-auto max-w-xl overflow-hidden rounded-xl border border-border bg-background shadow-lg"
          >
            {suggesting && !suggestions ? (
              <div className="flex items-center justify-center gap-2 px-4 py-4 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                {t("searching")}
              </div>
            ) : null}

            {suggestions?.users.length ? (
              <div className="border-b border-border py-1.5">
                <p className="px-4 pb-1 pt-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  {t("profiles")}
                </p>
                {suggestions.users.slice(0, 4).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onOpenChannel(u.id);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-secondary/60"
                  >
                    <AvatarBubble
                      name={u.name}
                      avatar={u.avatar}
                      className="size-8 text-xs"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {u.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {u.handle} · {u.videoCount} {t("videoUnit")}
                      </span>
                    </span>
                    <UserRound
                      className="size-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            ) : null}

            {suggestions?.videos.length ? (
              <div className="py-1.5">
                <p className="px-4 pb-1 pt-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  {t("videosHeading")}
                </p>
                {suggestions.videos.slice(0, 4).map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onOpenVideo(v.id);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-secondary/60"
                  >
                    <img
                      src={`/${v.thumbPath}`}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="h-9 w-16 shrink-0 rounded-md object-cover"
                    />
                    <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                      {v.title}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}

            {suggestions &&
            suggestions.users.length === 0 &&
            suggestions.videos.length === 0 &&
            !suggesting ? (
              <p className="px-4 py-3 text-sm text-muted-foreground">
                {t("nothingFoundHint")}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Bildirishnomalar qo'ng'iroqchasi */}
      <NotificationsBell onOpenVideo={onOpenVideo} />

      {/* Profil yonida gildirak — global sozlamalar (til tanlash) */}
      <SettingsGear />

      <button
        onClick={() => onNavigate("profile")}
        aria-label={t("profileGoAria")}
        className="shrink-0 transition-transform hover:scale-105"
        title={me ? `${me.name} (${me.handle})` : t("navProfile")}
      >
        <AvatarBubble
          name={me?.name ?? "R"}
          avatar={me?.avatar}
          className="size-9 text-sm"
        />
      </button>
    </header>
  );
}
