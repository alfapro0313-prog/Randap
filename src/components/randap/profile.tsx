"use client";

import { useState } from "react";
import { Loader2, LogOut, UserRoundPen } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { VideoGrid } from "./video-card";
import type { Me, VideoItem } from "@/lib/randap-types";

type ProfileViewProps = {
  me: Me | null;
  deviceKey: string;
  videos: VideoItem[];
  loading: boolean;
  onRename: (name: string) => Promise<boolean>;
  onOpen: (video: VideoItem) => void;
  onOpenChannel: (uploaderId: string) => void;
  onNavigateUpload: () => void;
};

export function ProfileView({
  me,
  deviceKey,
  videos,
  loading,
  onRename,
  onOpen,
  onOpenChannel,
  onNavigateUpload,
}: ProfileViewProps) {
  const [name, setName] = useState(me?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    if (saving || !name.trim()) return;
    setSaving(true);
    const ok = await onRename(name.trim());
    setSaving(false);
    if (ok) {
      toast({ title: "Profil yangilandi" });
    } else {
      toast({
        title: "Saqlashda xatolik",
        description: "Ism 2-40 belgi orasida bo'lishi kerak.",
        variant: "destructive",
      });
    }
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
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-extrabold text-primary-foreground">
          {me.name.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-foreground">{me.name}</h1>
          <p className="text-sm text-muted-foreground">{me.handle}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {me.videoCount} yuklangan video · sizning profilingiz
          </p>
        </div>
        <button
          onClick={onNavigateUpload}
          className="h-9 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          + Video yuklash
        </button>
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
            Ismni o&apos;zgartirish
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
          {saving ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </form>

      <section aria-label="Mening videolarim" className="flex flex-col gap-4">
        <h2 className="text-base font-bold text-foreground">Mening videolarim</h2>
        <VideoGrid
          videos={videos}
          loading={loading}
          onOpen={onOpen}
          onOpenChannel={onOpenChannel}
          emptyText="Siz hozircha video yuklamagansiz. Pastdagi yoki chap menyudagi + tugmasini bosing."
        />
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-bold text-foreground">Qurilma profili</h2>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Randap ro&apos;yxatdan o&apos;tishni talab qilmaydi: profilingiz shu
          brauzerdagi qurilma kalitiga bog&apos;langan (
          <span className="font-mono text-[11px]">{deviceKey.slice(0, 13)}...</span>).
          Pastdagi tugmani bossangiz, bu qurilmadagi profil va shu qurilma
          qo&apos;ygan layklar/obunalar tiklanadi.
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
              Ha, profilni tiklash
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="rounded-full border border-border bg-secondary px-4 py-2 text-sm font-semibold hover:bg-secondary/80"
            >
              Bekor qilish
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-destructive hover:underline"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Qurilma profilini tiklash
          </button>
        )}
      </section>
    </div>
  );
}
