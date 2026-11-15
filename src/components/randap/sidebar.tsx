"use client";

import { useCallback } from "react";
import { Home, ListVideo, Plus, User, Zap, Users } from "lucide-react";
import type { Me } from "@/lib/randap-types";
import { cn } from "@/lib/utils";

export type ViewName =
  | "home"
  | "videos"
  | "shorts"
  | "subs"
  | "watch"
  | "upload"
  | "profile"
  | "channel";

type SidebarProps = {
  view: ViewName;
  onNavigate: (view: ViewName) => void;
  me: Me | null;
  watchKind?: string;
};

const NAV_ITEMS: Array<{
  key: ViewName;
  label: string;
  icon: typeof Home;
}> = [
  { key: "home", label: "Bosh sahifa", icon: Home },
  { key: "shorts", label: "Shorts", icon: Zap },
  { key: "videos", label: "Videos", icon: ListVideo },
  { key: "subs", label: "Obunalar", icon: Users },
  { key: "profile", label: "Profil", icon: User },
];

function isActive(
  item: ViewName,
  current: SidebarProps["view"],
  watchKind?: string
) {
  if (item === current) return true;
  if (item === "videos" && current === "channel") return true;
  if (item === "shorts" && current === "watch" && watchKind === "short")
    return true;
  return false;
}

export function Sidebar({ view, onNavigate, me, watchKind }: SidebarProps) {
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

        <button
          onClick={go("upload")}
          className="mt-3 flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="size-5" aria-hidden="true" />
          Video yuklash
        </button>

        <div className="mt-auto border-t border-border pt-4 px-3 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Randap</p>
          <p className="mt-1">Videolar va Shorts platformasi</p>
          <p className="mt-2">© 2026 Randap</p>
        </div>
      </aside>

      {/* Mobil pastki menyu — pastda + turadi */}
      <nav
        aria-label="Mobil menyu"
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-background/95 backdrop-blur pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {NAV_ITEMS.slice(0, 2).map((item) => {
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

        {NAV_ITEMS.slice(2, 4).map((item) => {
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
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded-full text-[9px] font-bold",
              isActive("profile", view, watchKind)
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            )}
          >
            {(me?.name ?? "R").slice(0, 1).toUpperCase()}
          </span>
          Profil
        </button>
      </nav>
    </>
  );
}
