"use client";

import { useState } from "react";
import { CirclePlay, Search } from "lucide-react";
import type { Me } from "@/lib/randap-types";
import type { ViewName } from "./sidebar";

type HeaderProps = {
  me: Me | null;
  initialQuery?: string;
  onSearch: (q: string) => void;
  onNavigate: (view: ViewName) => void;
};

export function Header({ me, initialQuery = "", onSearch, onNavigate }: HeaderProps) {
  const [q, setQ] = useState(initialQuery);

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-3 border-b border-border bg-background/95 backdrop-blur px-3 sm:px-4">
      <button
        onClick={() => onNavigate("home")}
        className="flex shrink-0 items-center gap-1.5"
        aria-label="Randap bosh sahifa"
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <CirclePlay className="size-5" aria-hidden="true" />
        </span>
        <span className="text-lg font-extrabold tracking-tight text-foreground">
          Randap
        </span>
      </button>

      <form
        role="search"
        className="flex min-w-0 flex-1 justify-end"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(q.trim());
        }}
      >
        <div className="flex w-full max-w-xl items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Videolarni qidirish..."
              aria-label="Qidiruv"
              className="h-9 w-full rounded-full border border-border bg-secondary/60 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <button
            type="submit"
            className="h-9 shrink-0 rounded-full border border-border bg-secondary px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80"
          >
            Qidirish
          </button>
        </div>
      </form>

      <button
        onClick={() => onNavigate("profile")}
        aria-label="Profilga o'tish"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
        title={me ? `${me.name} (${me.handle})` : "Profil"}
      >
        {(me?.name ?? "R").slice(0, 1).toUpperCase()}
      </button>
    </header>
  );
}
