"use client";

import { useCallback } from "react";
import {
  BookOpen,
  CirclePlay,
  GraduationCap,
  Home,
  ListVideo,
  Plus,
  Trophy,
  User,
  Users,
  Zap,
} from "lucide-react";
import { AvatarBubble } from "./avatar";
import type { Me, SubscribedChannel } from "@/lib/randap-types";
import { cn } from "@/lib/utils";

export type ViewName =
  | "portal"
  | "home"
  | "videos"
  | "shorts"
  | "subs"
  | "watch"
  | "upload"
  | "profile"
  | "channel"
  | "sections"
  | "section"
  | "quiz"
  | "lesson"
  | "organish"
  | "organishTopic"
  | "ballar"
  | "search";

type SidebarProps = {
  view: ViewName;
  onNavigate: (view: ViewName) => void;
  me: Me | null;
  watchKind?: string;
  subs: SubscribedChannel[];
  onOpenChannel: (id: string) => void;
};

const NAV_ITEMS: Array<{
  key: ViewName;
  label: string;
  icon: typeof Home;
}> = [
  { key: "portal", label: "Asosiy menyu", icon: Home },
  { key: "home", label: "Videolar", icon: CirclePlay },
  { key: "shorts", label: "Shorts", icon: Zap },
  { key: "videos", label: "Videos", icon: ListVideo },
  { key: "sections", label: "Testlar", icon: GraduationCap },
  { key: "organish", label: "O'rganish", icon: BookOpen },
  { key: "ballar", label: "Ballar", icon: Trophy },
  { key: "profile", label: "Profil", icon: User },
];

const MOBILE_ITEMS: Array<{
  key: ViewName;
  label: string;
  icon: typeof Home;
}> = [
  { key: "portal", label: "Asosiy", icon: Home },
  { key: "shorts", label: "Shorts", icon: Zap },
  { key: "videos", label: "Videos", icon: ListVideo },
  { key: "sections", label: "Testlar", icon: GraduationCap },
];

function isActive(
  item: ViewName,
  current: SidebarProps["view"],
  watchKind?: string
) {
  if (item === current) return true;
  if (item === "videos" && (current === "channel" || current === "search"))
    return true;
  if (item === "home" && current === "watch" && watchKind !== "short")
    return true;
  if (item === "sections" && (current === "section" || current === "quiz" || current === "lesson"))
    return true;
  if (item === "organish" && current === "organishTopic")
    return true;
  if (item === "shorts" && current === "watch" && watchKind === "short")
    return true;
  return false;
}

export function Sidebar({
  view,
  onNavigate,
  me,
  watchKind,
  subs,
  onOpenChannel,
}: SidebarProps) {
  const go = useCallback(
    (key: ViewName) => () => onNavigate(key),
    [onNavigate]
  );

  return (
    <>
      {/* Desktop chap menyu — hamma narsa shu yerda */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col gap-1 border-r border-border bg-background px-2 py-4 sticky top-0 h-screen overflow-y-auto scrollbar-thin">
        <nav aria-label="Asosiy menyu" className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.key, view, watchKind);
            return (
              <button
                key={item.key}
                onClick={go(item.key)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-4 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                <Icon
                  className={cn("size-5 shrink-0", active && "text-primary")}
                  aria-hidden="true"
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* OBUNALAR — tepada, obuna bo'lgan kanallar ro'yxati */}
        {subs.length > 0 ? (
          <section
            aria-label="Obunalar bo'limi"
            className="mt-4 flex flex-col gap-1 border-t border-border pt-4"
          >
            <button
              onClick={go("subs")}
              className="flex items-center gap-2 px-3 text-xs font-bold uppercase tracking-wide text-muted-foreground hover:text-foreground"
            >
              <Users className="size-3.5" aria-hidden="true" />
              Obunalar
            </button>
            {subs.map((ch) => (
              <button
                key={ch.id}
                onClick={() => onOpenChannel(ch.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                  view === "channel"
                    ? "text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                )}
                title={`${ch.name} kanaliga o'tish`}
              >
                <AvatarBubble
                  name={ch.name}
                  avatar={ch.avatar}
                  className="size-6 text-[10px]"
                />
                <span className="truncate">{ch.name}</span>
              </button>
            ))}
          </section>
        ) : (
          <button
            onClick={go("subs")}
            aria-label="Obunalar bo'limiga o'tish"
            className="mt-4 flex items-center gap-2 border-t border-border px-3 pt-4 text-xs font-bold uppercase tracking-wide text-muted-foreground hover:text-foreground"
          >
            <Users className="size-3.5" aria-hidden="true" />
            Obunalar
          </button>
        )}

        <button
          onClick={go("upload")}
          className="mt-4 flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="size-5" aria-hidden="true" />
          Video yuklash
        </button>

        <div className="mt-auto border-t border-border pt-4 px-3 text-xs text-muted-foreground">
          <button
            onClick={go("portal")}
            className="font-semibold text-foreground hover:text-primary"
          >
            Randap
          </button>
          <p className="mt-1">Videolar, Shorts va Testlar platformasi</p>
          <p className="mt-2">© 2026 Randap</p>
        </div>
      </aside>

      {/* Mobil pastki menyu — pastda + turadi */}
      <nav
        aria-label="Mobil menyu"
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-background/95 backdrop-blur pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {MOBILE_ITEMS.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.key, view, watchKind);
          return (
            <button
              key={item.key}
              onClick={go(item.key)}
              className={cn(
                "flex min-h-[44px] w-full flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-medium",
                active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("size-5", active && "text-primary")} aria-hidden="true" />
              {item.label}
            </button>
          );
        })}

        <button
          onClick={go("upload")}
          aria-label="Video yuklash"
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
        >
          <Plus className="size-6" aria-hidden="true" />
        </button>

        {MOBILE_ITEMS.slice(2, 4).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.key, view, watchKind);
          return (
            <button
              key={item.key}
              onClick={go(item.key)}
              className={cn(
                "flex min-h-[44px] w-full flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-medium",
                active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("size-5", active && "text-primary")} aria-hidden="true" />
              {item.label}
            </button>
          );
        })}

        <button
          onClick={go("profile")}
          className={cn(
            "flex min-h-[44px] w-full flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-medium",
            isActive("profile", view, watchKind)
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        >
          <AvatarBubble
            name={me?.name ?? "R"}
            avatar={me?.avatar}
            className={cn(
              "size-5 text-[9px]",
              isActive("profile", view, watchKind) && "ring-2 ring-primary"
            )}
          />
          Profil
        </button>
      </nav>
    </>
  );
}
