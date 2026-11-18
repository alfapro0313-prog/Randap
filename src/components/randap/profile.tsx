"use client";

import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  Camera,
  Eye,
  Heart,
  Loader2,
  LogOut,
  MessageSquare,
  MessageSquareWarning,
  Send,
  Trophy,
  UserRoundPen,
  Users,
  Video as VideoIcon,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AvatarBubble } from "./avatar";
import { VideoGrid } from "./video-card";
import { useLang } from "./lang-provider";
import type { Me, VideoItem } from "@/lib/randap-types";

type ProfileViewProps = {
  me: Me | null;
  deviceKey: string;
  videos: VideoItem[];
  watchLaterVideos: VideoItem[];
  loading: boolean;
  onRename: (name: string) => Promise<boolean>;
  onAvatarUpload: (file: File) => Promise<boolean>;
  onOpen: (video: VideoItem) => void;
  onOpenChannel: (uploaderId: string) => void;
  onNavigateUpload: () => void;
  onNavigateBallar: () => void;
};

export function ProfileView({
  me,
  deviceKey,
  videos,
  watchLaterVideos,
  loading,
  onRename,
  onAvatarUpload,
  onOpen,
  onOpenChannel,
  onNavigateUpload,
  onNavigateBallar,
}: ProfileViewProps) {
  const { t } = useLang();
  const [name, setName] = useState(me?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [complaint, setComplaint] = useState("");
  const [complaintBusy, setComplaintBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  /* Profil statistikasi — /api/me/stats */
  const [stats, setStats] = useState<{
    videos: number;
    views: number;
    likes: number;
    comments: number;
    subscribers: number;
  } | null>(null);

  useEffect(() => {
    if (!deviceKey) return;
    let alive = true;
    fetch(`/api/me/stats?deviceKey=${encodeURIComponent(deviceKey)}`)
      .then((r) => r.json())
      .then((data) => {
        if (alive && data?.ok && data.stats) setStats(data.stats);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [deviceKey]);

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    if (saving || !name.trim()) return;
    setSaving(true);
    const ok = await onRename(name.trim());
    setSaving(false);
    if (ok) {
      toast({ title: t("profileUpdated") });
    } else {
      toast({
        title: t("saveError"),
        description: t("nameLengthDesc"),
        variant: "destructive",
      });
    }
  }

  async function pickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: t("chooseImage"),
        description: t("chooseImageDesc"),
        variant: "destructive",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t("imageTooBig"),
        description: t("imageTooBigDesc"),
        variant: "destructive",
      });
      return;
    }
    setAvatarBusy(true);
    const ok = await onAvatarUpload(file);
    setAvatarBusy(false);
    if (ok) {
      toast({ title: t("avatarUpdated") });
    } else {
      toast({
        title: t("avatarFailed"),
        description: t("retryDesc"),
        variant: "destructive",
      });
    }
    e.target.value = "";
  }

  async function sendComplaint() {
    const text = complaint.trim();
    if (complaintBusy || text.length < 3) return;
    setComplaintBusy(true);
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceKey, text }),
      });
      const data = await res.json();
      if (data.ok) {
        toast({ title: t("complaintSent") });
        setComplaint("");
      } else {
        toast({
          title: t("error"),
          description: data.error,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: t("error"),
        description: t("retry"),
        variant: "destructive",
      });
    }
    setComplaintBusy(false);
  }

  if (!me) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-6">
      <div className="flex flex-col items-start gap-5 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:p-6">
        {/* Profil rasmi + yuklash tugmasi */}
        <div className="relative shrink-0">
          <AvatarBubble
            name={me.name}
            avatar={me.avatar}
            className="size-20 text-3xl"
          />
          <button
            onClick={() => fileRef.current?.click()}
            aria-label={t("changeAvatarAria")}
            title={t("uploadPhotoTitle")}
            className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground transition-transform hover:scale-110"
          >
            {avatarBusy ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Camera className="size-4" aria-hidden="true" />
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={pickAvatar}
            className="sr-only"
            aria-label={t("chooseAvatarAria")}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-foreground">{me.name}</h1>
          <p className="text-sm text-muted-foreground">{me.handle}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("myVideosInfo", { n: me.videoCount })}
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            onClick={onNavigateBallar}
            className="flex h-9 items-center justify-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 text-sm font-semibold text-amber-700 hover:bg-amber-100"
          >
            <Trophy className="size-4" aria-hidden="true" />
            {t("pointsWithValue", { n: me.points })}
          </button>
          <button
            onClick={onNavigateUpload}
            className="h-9 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            + {t("uploadVideo")}
          </button>
        </div>
      </div>

      <form
        onSubmit={saveName}
        className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label
            htmlFor="profile-name"
            className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground"
          >
            <UserRoundPen className="size-4" aria-hidden="true" />
            {t("renameLabel")}
          </label>
          <input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>
        <button
          type="submit"
          disabled={saving || name.trim().length < 2}
          className="h-10 rounded-full bg-foreground px-5 text-sm font-semibold text-background hover:bg-foreground/90 disabled:opacity-50"
        >
          {saving ? t("saving") : t("save")}
        </button>
      </form>

      <section aria-label={t("statsTitle")} className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
          <BarChart3 className="size-4 text-red-500" aria-hidden="true" />
          {t("statsTitle")}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {([
            [VideoIcon, t("statVideos"), stats?.videos ?? 0],
            [Eye, t("statViews"), stats?.views ?? 0],
            [Heart, t("statLikes"), stats?.likes ?? 0],
            [MessageSquare, t("statComments"), stats?.comments ?? 0],
            [Users, t("statSubscribers"), stats?.subscribers ?? 0],
          ] as const).map(([Icon, label, value]) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-4 text-center"
            >
              <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-lg font-extrabold text-foreground">
                {stats ? value.toLocaleString("en-US") : "..."}
              </span>
              <span className="text-[11px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section aria-label={t("myVideos")} className="flex flex-col gap-4">
        <h2 className="text-base font-bold text-foreground">{t("myVideos")}</h2>
        <VideoGrid
          videos={videos}
          loading={loading}
          onOpen={onOpen}
          onOpenChannel={onOpenChannel}
          emptyText={t("emptyMyVideos")}
        />
      </section>

      <section aria-label={t("watchLater")} className="flex flex-col gap-4">
        <h2 className="text-base font-bold text-foreground">{t("watchLater")}</h2>
        <VideoGrid
          videos={watchLaterVideos}
          loading={false}
          onOpen={onOpen}
          onOpenChannel={onOpenChannel}
          emptyText={t("watchLaterEmpty")}
        />
      </section>

      <section
        aria-label={t("complaintTitle")}
        className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5"
      >
        <div className="flex items-center gap-2">
          <MessageSquareWarning
            className="size-4 text-amber-500"
            aria-hidden="true"
          />
          <h2 className="text-sm font-bold text-foreground">
            {t("complaintTitle")}
          </h2>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {t("complaintDesc")}
        </p>
        <textarea
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          placeholder={t("complaintPlaceholder")}
          maxLength={1500}
          rows={4}
          className="w-full resize-y rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/40"
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground">
            {complaint.trim().length}/1500
          </p>
          <button
            onClick={() => void sendComplaint()}
            disabled={complaintBusy || complaint.trim().length < 3}
            className="flex h-10 items-center gap-2 rounded-full bg-amber-500 px-5 text-sm font-bold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
          >
            {complaintBusy ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="size-4" aria-hidden="true" />
            )}
            {complaintBusy ? t("complaintSending") : t("complaintSend")}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-bold text-foreground">{t("deviceProfile")}</h2>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {t("deviceProfileDesc", { key: deviceKey.slice(0, 13) })}
        </p>
        {confirmReset ? (
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => {
                window.localStorage.removeItem("randap_device_key");
                window.location.reload();
              }}
              className="rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-white hover:bg-destructive/90"
            >
              {t("resetConfirm")}
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="rounded-full border border-border bg-secondary px-4 py-2 text-sm font-semibold hover:bg-secondary/80"
            >
              {t("cancel")}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-destructive hover:underline"
          >
            <LogOut className="size-4" aria-hidden="true" />
            {t("resetDevice")}
          </button>
        )}
      </section>
    </div>
  );
}
