"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Ban,
  BarChart3,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
  MessageSquareWarning,
  RefreshCw,
  Shield,
  ShieldCheck,
  Trash2,
  Users,
  Wifi,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLang } from "./lang-provider";
import { activeBlockMs, ADMIN_GMAIL, formatLeft, remainingMs } from "@/lib/randap-admin";
import { compactCount, langLocale, timeAgo } from "@/lib/randap-i18n";
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
  blockReason: string | null;
};

type AdminComplaint = {
  id: string;
  name: string;
  gmail: string;
  text: string;
  createdAt: number;
  resolvedAt: number | null;
};

type AdminStats = {
  totalViews: number;
  totalVisitors: number;
  visitors24h: number;
  onlineGuests: number;
  onlineUsers: Array<{
    name: string;
    gmail: string;
    path: string;
    at: number;
  }>;
  days: Array<{ date: string; views: number; visitors: number }>;
};

/**
 * ADMIN PANEL — faqat sayt egasi ko'radi (sidebar "Admin" tugmasi orqali).
 *  - Statistika: jami sahifa ko'rishlar, noyob mehmonlar, HOZIR ONLINE
 *    ro'yxati (ism+gmail bilan) va oxirgi 7 kunlik grafik;
 *  - Kirganlar: kim, qachon, necha marta kirgan + 3 soatga bloklash;
 *  - Shikoyatlar: profil ichidan yozilgan shikoyatlar (yechish/o'chirish).
 */
export function AdminView({ deviceKey }: { deviceKey: string }) {
  const { t, lang } = useLang();
  const [tab, setTab] = useState<"stats" | "users" | "complaints">("stats");
  const [accounts, setAccounts] = useState<AdminAccount[] | null>(null);
  const [complaints, setComplaints] = useState<AdminComplaint[] | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [busy, setBusy] = useState("");
  // Ochilgan blok formasi: qaysi gmail + tanlangan muddat + sabab
  const [blockForm, setBlockForm] = useState<{
    gmail: string;
    hours: number;
    reason: string;
  } | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/admin?deviceKey=${encodeURIComponent(deviceKey)}`
      );
      const data = await res.json();
      if (data.ok) {
        setAccounts(data.accounts as AdminAccount[]);
        if (data.stats) setStats(data.stats as AdminStats);
      } else {
        setAccounts([]);
      }
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

  // Statistika tabi ochiq turganda har 30 soniyada avto-yangilash —
  // "hozir online" ro'yxati tirik bo'lib turadi
  useEffect(() => {
    if (tab !== "stats") return;
    const id = window.setInterval(() => void loadUsers(), 30000);
    return () => window.clearInterval(id);
  }, [tab, loadUsers]);

  async function setBlock(
    gmail: string,
    action: "block" | "unblock",
    hours = 3,
    reason = ""
  ) {
    setBusy(`${gmail}:${action}`);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceKey, gmail, action, hours, reason }),
      });
      const data = await res.json();
      if (data.ok) {
        toast({
          title: action === "block" ? t("adminBlockedDone") : t("adminUnblocked"),
        });
        setBlockForm(null);
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

  async function deleteAccount(gmail: string) {
    if (!window.confirm(t("adminDeleteConfirm"))) return;
    setBusy(`${gmail}:delete`);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceKey, gmail, action: "delete" }),
      });
      const data = await res.json();
      if (data.ok) {
        toast({ title: t("adminAccDeletedDone") });
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
      <div className="flex flex-wrap gap-2" role="tablist">
        <button
          role="tab"
          aria-selected={tab === "stats"}
          onClick={() => setTab("stats")}
          className={cn(
            "flex min-h-[40px] items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors",
            tab === "stats"
              ? "bg-primary text-primary-foreground"
              : "border border-border text-muted-foreground hover:text-foreground"
          )}
        >
          <BarChart3 className="size-4" aria-hidden="true" />
          {t("adminTabStats")}
        </button>
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

      {/* --- STATISTIKA --- */}
      {tab === "stats" ? (
        stats === null ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden="true" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Kartalar: jami ko'rish / noyob mehmonlar / 24 soat / online */}
            {(() => {
              const onlineCount = stats.onlineUsers.length + stats.onlineGuests;
              const cards = [
                {
                  icon: Eye,
                  label: t("statTotalViews"),
                  value: stats.totalViews,
                  online: false,
                },
                {
                  icon: Users,
                  label: t("statUniqueVisitors"),
                  value: stats.totalVisitors,
                  online: false,
                },
                {
                  icon: Clock,
                  label: t("statVisitors24h"),
                  value: stats.visitors24h,
                  online: false,
                },
                {
                  icon: Wifi,
                  label: t("statOnlineNow"),
                  value: onlineCount,
                  online: true,
                },
              ];
              return (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {cards.map((c) => (
                    <div
                      key={c.label}
                      className={cn(
                        "rounded-2xl border bg-card p-4",
                        c.online ? "border-emerald-500/40" : "border-border"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <c.icon
                          className={cn(
                            "size-4 shrink-0",
                            c.online ? "text-emerald-500" : "text-muted-foreground"
                          )}
                          aria-hidden="true"
                        />
                        <p className="truncate text-xs font-semibold text-muted-foreground">
                          {c.label}
                        </p>
                      </div>
                      <p
                        className={cn(
                          "mt-2 text-2xl font-bold tabular-nums",
                          c.online ? "text-emerald-500" : "text-foreground"
                        )}
                      >
                        {compactCount(c.value, lang)}
                      </p>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Oxirgi 7 kunlik grafik */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <BarChart3 className="size-4 text-muted-foreground" aria-hidden="true" />
                <p className="text-sm font-semibold text-foreground">
                  {t("statLast7Days")}
                </p>
              </div>
              <div className="mt-4 flex items-end gap-1.5 sm:gap-3">
                {stats.days.map((d) => {
                  const maxViews = Math.max(1, ...stats.days.map((x) => x.views));
                  const height = Math.max(4, Math.round((d.views / maxViews) * 100));
                  const label = new Intl.DateTimeFormat(langLocale(lang), {
                    day: "numeric",
                    month: "short",
                  }).format(new Date(`${d.date}T12:00:00Z`));
                  return (
                    <div
                      key={d.date}
                      className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
                    >
                      <div
                        className="flex h-28 w-full items-end"
                        title={`${label}: ${t("statTooltipViews", { n: d.views })}, ${t(
                          "statTooltipVisitors",
                          { n: d.visitors }
                        )}`}
                      >
                        <div
                          className="w-full rounded-t-lg bg-primary/80 transition-colors hover:bg-primary"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span className="max-w-full truncate text-[10px] text-muted-foreground">
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                {t("statChartHint")}
              </p>
            </div>

            {/* HOZIR ONLINE — kim turganini ko'rish */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                </span>
                <p className="text-sm font-semibold text-foreground">
                  {t("statOnlineNow")}
                </p>
                <span className="ml-auto rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                  {stats.onlineUsers.length + stats.onlineGuests}
                </span>
              </div>

              {stats.onlineUsers.length + stats.onlineGuests === 0 ? (
                <p className="mt-4 rounded-xl bg-secondary/50 p-4 text-center text-sm text-muted-foreground">
                  {t("statOnlineNone")}
                </p>
              ) : (
                <div className="mt-4 flex flex-col gap-2">
                  {stats.onlineUsers.map((u) => (
                    <div
                      key={u.gmail}
                      className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                        {(u.name.trim()[0] ?? "R").toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {u.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground" dir="ltr">
                          {u.gmail}
                        </p>
                      </div>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {timeAgo(new Date(u.at).toISOString(), lang)}
                      </span>
                    </div>
                  ))}
                  {stats.onlineGuests > 0 ? (
                    <div className="flex items-center gap-3 rounded-xl border border-dashed border-border p-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground">
                        <Eye className="size-4" aria-hidden="true" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("statOnlineGuests")}:{" "}
                        <span className="font-bold text-foreground">
                          {stats.onlineGuests}
                        </span>
                      </p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        )
      ) : null}

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
              const isPerm = !!blockMs && (a.blockedUntil ?? 0) >= 253402000000000;
              const isMe = a.gmail.toLowerCase() === ADMIN_GMAIL;
              const letter = (a.name.trim()[0] ?? "R").toUpperCase();
              const formOpen = blockForm?.gmail === a.gmail;
              return (
                <div
                  key={a.id}
                  className={cn(
                    "flex flex-col gap-3 rounded-2xl border bg-card p-4",
                    blockMs ? "border-red-500/40" : "border-border"
                  )}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
                        {blockMs && a.blockReason ? (
                          <p
                            className="mt-1 text-[11px] font-semibold text-red-500/90"
                            dir="auto"
                          >
                            {t("blockedReason", { reason: a.blockReason })}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      {blockMs ? (
                        <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold text-red-500">
                          {isPerm
                            ? `${t("adminStatusBlocked")} · ${t("adminPermanentChip")}`
                            : t("adminBlockedLeft", {
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
                        <>
                          {blockMs ? (
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
                              onClick={() =>
                                setBlockForm({ gmail: a.gmail, hours: 3, reason: "" })
                              }
                              disabled={busy === `${a.gmail}:block`}
                              className="flex min-h-[36px] items-center gap-1.5 rounded-full bg-red-600 px-3.5 text-xs font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                            >
                              {busy === `${a.gmail}:block` ? (
                                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                              ) : (
                                <Ban className="size-3.5" aria-hidden="true" />
                              )}
                              {t("adminBlockBtn")}
                            </button>
                          )}
                          <button
                            onClick={() => void deleteAccount(a.gmail)}
                            disabled={busy === `${a.gmail}:delete`}
                            className="flex min-h-[36px] items-center gap-1.5 rounded-full border border-destructive/50 px-3.5 text-xs font-bold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                          >
                            {busy === `${a.gmail}:delete` ? (
                              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                            ) : (
                              <Trash2 className="size-3.5" aria-hidden="true" />
                            )}
                            {t("adminDeleteBtn")}
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>

                  {/* Blok formasi: muddat + sabab */}
                  {blockForm && formOpen ? (
                    <div className="flex flex-col gap-2.5 rounded-xl border border-red-500/30 bg-red-500/5 p-3">
                      <p className="text-xs font-semibold text-foreground">
                        {t("adminReasonLabel")}
                      </p>
                      <input
                        value={blockForm.reason}
                        onChange={(e) =>
                          setBlockForm({
                            gmail: a.gmail,
                            hours: blockForm.hours,
                            reason: e.target.value,
                          })
                        }
                        placeholder={t("adminReasonPh")}
                        maxLength={300}
                        dir="auto"
                        className="min-h-[38px] w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/40"
                      />
                      <div className="flex flex-wrap gap-1.5">
                        {(
                          [
                            [1, "adminD1"],
                            [3, "adminD3"],
                            [12, "adminD12"],
                            [24, "adminDDay"],
                            [168, "adminD7"],
                            [0, "adminDPerm"],
                          ] as const
                        ).map(([h, key]) => (
                          <button
                            key={key}
                            onClick={() =>
                              setBlockForm({
                                gmail: a.gmail,
                                hours: h,
                                reason: blockForm.reason,
                              })
                            }
                            className={cn(
                              "min-h-[32px] rounded-full px-3 text-xs font-bold transition-colors",
                              blockForm.hours === h
                                ? "bg-red-600 text-white"
                                : "border border-border text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {t(key)}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            void setBlock(
                              a.gmail,
                              "block",
                              blockForm.hours,
                              blockForm.reason
                            )
                          }
                          disabled={busy === `${a.gmail}:block`}
                          className="flex min-h-[36px] items-center gap-1.5 rounded-full bg-red-600 px-4 text-xs font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                        >
                          {busy === `${a.gmail}:block` ? (
                            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                          ) : (
                            <Ban className="size-3.5" aria-hidden="true" />
                          )}
                          {t("adminBlockBtn")}
                        </button>
                        <button
                          onClick={() => setBlockForm(null)}
                          className="flex min-h-[36px] items-center rounded-full border border-border bg-secondary px-4 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/80"
                        >
                          {t("adminBlockCancel")}
                        </button>
                      </div>
                    </div>
                  ) : null}
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
