"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Ban,
  Check,
  CheckCircle2,
  Loader2,
  MessageSquareWarning,
  RefreshCw,
  Shield,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLang } from "./lang-provider";
import { activeBlockMs, ADMIN_GMAIL, formatLeft, remainingMs } from "@/lib/randap-admin";
import { timeAgo } from "@/lib/randap-i18n";
import { cn } from "@/lib/utils";

type AdminAccount = {
  id: string;
  name: string;
  gmail: string;
  viaGoogle: boolean;
  visits: number;
  lastSeenAt: number;
  createdAt: number;
  blockedUntil: number | null;
};

type AdminComplaint = {
  id: string;
  name: string;
  gmail: string;
  text: string;
  createdAt: number;
  resolvedAt: number | null;
};

/**
 * ADMIN PANEL — faqat sayt egasi ko'radi (sidebar "Admin" tugmasi orqali).
 *  - Kirganlar: kim, qachon, necha marta kirgan + 3 soatga bloklash;
 *  - Shikoyatlar: profil ichidan yozilgan shikoyatlar (yechish/o'chirish).
 */
export function AdminView({ deviceKey }: { deviceKey: string }) {
  const { t, lang } = useLang();
  const [tab, setTab] = useState<"users" | "complaints">("users");
  const [accounts, setAccounts] = useState<AdminAccount[] | null>(null);
  const [complaints, setComplaints] = useState<AdminComplaint[] | null>(null);
  const [busy, setBusy] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/admin?deviceKey=${encodeURIComponent(deviceKey)}`
      );
      const data = await res.json();
      if (data.ok) setAccounts(data.accounts as AdminAccount[]);
      else setAccounts([]);
    } catch {
      setAccounts([]);
    }
  }, [deviceKey]);

  const loadComplaints = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/complaints?deviceKey=${encodeURIComponent(deviceKey)}`
      );
      const data = await res.json();
      if (data.ok) setComplaints(data.complaints as AdminComplaint[]);
      else setComplaints([]);
    } catch {
      setComplaints([]);
    }
  }, [deviceKey]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void loadUsers();
      void loadComplaints();
    }, 0);
    return () => window.clearTimeout(id);
  }, [loadUsers, loadComplaints]);

  async function setBlock(gmail: string, action: "block" | "unblock") {
    setBusy(`${gmail}:${action}`);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceKey, gmail, action }),
      });
      const data = await res.json();
      if (data.ok) {
        toast({
          title: action === "block" ? t("adminBlockedDone") : t("adminUnblocked"),
        });
        void loadUsers();
      } else {
        toast({
          title: t("error"),
          description: data.error,
          variant: "destructive",
        });
      }
    } catch {
      toast({ title: t("error"), description: t("retry"), variant: "destructive" });
    }
    setBusy("");
  }

  async function complaintAction(id: string, action: "resolve" | "delete") {
    setBusy(`${id}:${action}`);
    try {
      const res = await fetch("/api/complaints", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceKey, id, action }),
      });
      const data = await res.json();
      if (data.ok) {
        toast({
          title: action === "resolve" ? t("adminResolvedDone") : t("adminDeletedDone"),
        });
        void loadComplaints();
      } else {
        toast({
          title: t("error"),
          description: data.error,
          variant: "destructive",
        });
      }
    } catch {
      toast({ title: t("error"), description: t("retry"), variant: "destructive" });
    }
    setBusy("");
  }

  const openCount = (complaints ?? []).filter((c) => !c.resolvedAt).length;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      {/* Sarlavha */}
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
          <Shield className="size-6 text-primary" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-foreground">{t("adminTitle")}</h1>
          <p className="text-sm text-muted-foreground">{t("adminSub")}</p>
        </div>
        <button
          onClick={() => {
            void loadUsers();
            void loadComplaints();
          }}
          aria-label={t("adminRefresh")}
          title={t("adminRefresh")}
          className="ml-auto flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
        </button>
      </div>

      {/* Tablar */}
      <div className="flex gap-2" role="tablist">
        <button
          role="tab"
          aria-selected={tab === "users"}
          onClick={() => setTab("users")}
          className={cn(
            "flex min-h-[40px] items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors",
            tab === "users"
              ? "bg-primary text-primary-foreground"
              : "border border-border text-muted-foreground hover:text-foreground"
          )}
        >
          <Users className="size-4" aria-hidden="true" />
          {t("adminTabUsers")}
        </button>
        <button
          role="tab"
          aria-selected={tab === "complaints"}
          onClick={() => setTab("complaints")}
          className={cn(
            "flex min-h-[40px] items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors",
            tab === "complaints"
              ? "bg-primary text-primary-foreground"
              : "border border-border text-muted-foreground hover:text-foreground"
          )}
        >
          <MessageSquareWarning className="size-4" aria-hidden="true" />
          {t("adminTabComplaints")}
          {openCount > 0 ? (
            <span className="rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
              {openCount}
            </span>
          ) : null}
        </button>
      </div>

      {/* --- KIRGANLAR --- */}
      {tab === "users" ? (
        accounts === null ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden="true" />
          </div>
        ) : accounts.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            {t("adminEmpty")}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {accounts.map((a) => {
              const blockMs = activeBlockMs(a.blockedUntil);
              const isMe = a.gmail.toLowerCase() === ADMIN_GMAIL;
              const letter = (a.name.trim()[0] ?? "R").toUpperCase();
              return (
                <div
                  key={a.id}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                      {letter}
                    </div>
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 truncate text-sm font-semibold text-foreground">
                        {a.name}
                        {isMe ? (
                          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                            {t("adminYou")}
                          </span>
                        ) : null}
                      </p>
                      <p className="truncate text-xs text-muted-foreground" dir="ltr">
                        {a.gmail}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {t("adminVisits")}: {a.visits} · {t("adminLastSeen")}:{" "}
                        {timeAgo(new Date(a.lastSeenAt).toISOString(), lang)}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {blockMs ? (
                      <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold text-red-500">
                        {t("adminBlockedLeft", {
                          time: formatLeft(
                            remainingMs(blockMs),
                            t("unitHour"),
                            t("unitMin")
                          ),
                        })}
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-600">
                        {t("adminStatusActive")}
                      </span>
                    )}
                    {!isMe ? (
                      blockMs ? (
                        <button
                          onClick={() => void setBlock(a.gmail, "unblock")}
                          disabled={busy === `${a.gmail}:unblock`}
                          className="flex min-h-[36px] items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {busy === `${a.gmail}:unblock` ? (
                            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                          ) : (
                            <ShieldCheck className="size-3.5" aria-hidden="true" />
                          )}
                          {t("adminUnblock")}
                        </button>
                      ) : (
                        <button
                          onClick={() => void setBlock(a.gmail, "block")}
                          disabled={busy === `${a.gmail}:block`}
                          className="flex min-h-[36px] items-center gap-1.5 rounded-full bg-red-600 px-3.5 text-xs font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                        >
                          {busy === `${a.gmail}:block` ? (
                            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                          ) : (
                            <Ban className="size-3.5" aria-hidden="true" />
                          )}
                          {t("adminBlock3h")}
                        </button>
                      )
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : null}

      {/* --- SHIKOYATLAR --- */}
      {tab === "complaints" ? (
        complaints === null ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden="true" />
          </div>
        ) : complaints.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            {t("adminEmpty")}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {complaints.map((c) => (
              <div
                key={c.id}
                className={cn(
                  "flex flex-col gap-2 rounded-2xl border bg-card p-4",
                  c.resolvedAt ? "border-border opacity-70" : "border-amber-500/40"
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground" dir="ltr">
                    {c.gmail}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    · {timeAgo(new Date(c.createdAt).toISOString(), lang)}
                  </p>
                  <span
                    className={cn(
                      "ml-auto rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                      c.resolvedAt
                        ? "bg-emerald-500/15 text-emerald-600"
                        : "bg-amber-500/15 text-amber-600"
                    )}
                  >
                    {c.resolvedAt ? t("adminStatusResolved") : t("adminStatusOpen")}
                  </span>
                </div>
                <p className="whitespace-pre-wrap rounded-xl bg-secondary/50 p-3 text-sm leading-relaxed text-foreground">
                  {c.text}
                </p>
                <div className="flex gap-2">
                  {!c.resolvedAt ? (
                    <button
                      onClick={() => void complaintAction(c.id, "resolve")}
                      disabled={busy === `${c.id}:resolve`}
                      className="flex min-h-[34px] items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <Check className="size-3.5" aria-hidden="true" />
                      {t("adminResolve")}
                    </button>
                  ) : (
                    <span className="flex min-h-[34px] items-center gap-1.5 px-1 text-xs font-semibold text-emerald-600">
                      <CheckCircle2 className="size-4" aria-hidden="true" />
                      {t("adminStatusResolved")}
                    </span>
                  )}
                  <button
                    onClick={() => void complaintAction(c.id, "delete")}
                    disabled={busy === `${c.id}:delete`}
                    className="flex min-h-[34px] items-center gap-1.5 rounded-full border border-destructive/40 px-3.5 text-xs font-bold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                    {t("adminDelete")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : null}
    </div>
  );
}
