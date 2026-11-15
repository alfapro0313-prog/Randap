"use client";

import { useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileVideo,
  ImagePlus,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/randap-client";
import { MAX_SHORT_SEC, type VideoKind } from "@/lib/randap-types";
import { cn } from "@/lib/utils";

type UploadViewProps = {
  deviceKey: string;
  onBack: () => void;
  onUploaded: (videoId: string) => void;
};

type DuplicateInfo = {
  message: string;
  existingId: string;
};

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function UploadView({ deviceKey, onBack, onUploaded }: UploadViewProps) {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [thumb, setThumb] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [autoThumbPreview, setAutoThumbPreview] = useState<string | null>(null);
  const [kind, setKind] = useState<VideoKind>("video");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [allowComments, setAllowComments] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [duplicate, setDuplicate] = useState<DuplicateInfo | null>(null);
  const videoElRef = useRef<HTMLVideoElement | null>(null);

  const shortTooLong = kind === "short" && duration > MAX_SHORT_SEC;

  function resetFile() {
    setFile(null);
    setDuration(0);
    setAutoThumbPreview(null);
    if (thumbPreview && thumbPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbPreview);
    }
    setThumb(null);
    setThumbPreview(null);
  }

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    setDuplicate(null);
    const picked = e.target.files?.[0] ?? null;
    if (!picked) return;
    if (!picked.type.startsWith("video/")) {
      toast({
        title: "Video fayl tanlang",
        description: "MP4, WebM va shunga o'xshash video formatlar qabul qilinadi.",
        variant: "destructive",
      });
      return;
    }
    resetFile();
    setFile(picked);
    setDuration(0);

    // Davomiylikni o'qish + avtomatik thumbnail (video 1-ramkasidan)
    const url = URL.createObjectURL(picked);
    const el = document.createElement("video");
    el.preload = "metadata";
    el.muted = true;
    el.src = url;

    el.onloadedmetadata = () => {
      const d = Number.isFinite(el.duration) ? Math.round(el.duration) : 0;
      setDuration(d);
      el.currentTime = Math.min(1, d / 3 || 0.1);
    };

    el.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = Math.round((640 * el.videoHeight) / (el.videoWidth || 1));
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(el, 0, 0, canvas.width, canvas.height);
          setAutoThumbPreview(canvas.toDataURL("image/jpeg", 0.8));
        }
      } catch {
        // rasm olib bo'lmasa placeholder ishlaydi
      } finally {
        URL.revokeObjectURL(url);
      }
    };

    el.onerror = () => {
      URL.revokeObjectURL(url);
      toast({
        title: "Fayl o'qilmadi",
        description: "Bu fayl video sifatida ochilmadi. Boshqa fayl tanlab ko'ring.",
        variant: "destructive",
      });
    };
  }

  function pickThumb(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    if (!picked) return;
    if (!picked.type.startsWith("image/")) {
      toast({
        title: "Rasm tanlang",
        description: "Thumbnail sifatida rasm fayli kerak (JPG, PNG, WebP).",
        variant: "destructive",
      });
      return;
    }
    setThumb(picked);
    setThumbPreview(URL.createObjectURL(picked));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!deviceKey) {
      toast({
        title: "Profil tayyorlanmoqda",
        description: "Bir soniya kutib qayta bosing.",
        variant: "destructive",
      });
      return;
    }
    if (!file) {
      toast({ title: "Video fayl tanlanmagan", variant: "destructive" });
      return;
    }
    if (title.trim().length < 2) {
      toast({
        title: "Nom juda qisqa",
        description: "Video nomini kiriting (kamida 2 belgi).",
        variant: "destructive",
      });
      return;
    }
    if (shortTooLong) {
      toast({
        title: "Shorts juda uzun",
        description: `Shorts uchun maksimal 1:20 (80 soniya). Bu video ${duration} soniya — uni oddiy Video sifatida yuklang.`,
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    setDuplicate(null);

    try {
      const form = new FormData();
      form.set("deviceKey", deviceKey);
      form.set("title", title.trim());
      form.set("description", description.trim());
      form.set("kind", kind);
      form.set("allowComments", String(allowComments));
      form.set("durationSec", String(duration));
      form.set("file", file);
      if (thumb) form.set("thumbnail", thumb);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();

      if (res.ok && data.ok) {
        toast({
          title: "Video yuklandi",
          description:
            kind === "short"
              ? "Shorts bo'limida paydo bo'ldi."
              : "Videos bo'limida paydo bo'ldi.",
        });
        resetFile();
        setTitle("");
        setDescription("");
        setAllowComments(true);
        setKind("video");
        setDuration(0);
        onUploaded(data.video.id);
        return;
      }

      if (data.duplicate) {
        setDuplicate({
          message: String(data.error ?? "Bu video allaqachon yuklangan."),
          existingId: String(data.existingId ?? ""),
        });
        toast({
          title: "Dublikat aniqlandi",
          description: "Bu video allaqachon Videos bo'limida bor.",
          variant: "destructive",
        });
        return;
      }

      toast({ title: "Yuklashda xatolik", description: data.error, variant: "destructive" });
    } catch {
      toast({
        title: "Yuklash muvaffaqiyatsiz",
        description: "Internet aloqasini tekshirib qayta urinib ko'ring.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Orqaga qaytish"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Video yuklash</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* 1. Video fayl */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <FileVideo className="size-4 text-primary" aria-hidden="true" />
            1. Video fayl
          </h2>

          {!file ? (
            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-6 py-10 text-center transition-colors hover:border-primary/60 hover:bg-secondary/40">
              <UploadCloud className="size-10 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-semibold text-foreground">
                Video tanlash uchun bosing
              </span>
              <span className="text-xs text-muted-foreground">
                MP4, WebM, MOV · maksimal 300 MB
              </span>
              <input
                type="file"
                accept="video/*"
                onChange={pickFile}
                className="sr-only"
                aria-label="Video fayl tanlash"
              />
            </label>
          ) : (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-background p-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
                <FileVideo className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {file.name}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3" aria-hidden="true" />
                  {duration > 0 ? formatDuration(duration) : "davomiylik o'qilmoqda..."}
                  {" · "}
                  {formatBytes(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={resetFile}
                aria-label="Faylni olib tashlash"
                className="flex size-8 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-secondary/80"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Turi: Video yoki Shorts */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setKind("video")}
              aria-pressed={kind === "video"}
              className={cn(
                "rounded-xl border p-3 text-left transition-colors",
                kind === "video"
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background hover:bg-secondary/50"
              )}
            >
              <p className="text-sm font-bold text-foreground">Video</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Davomiyligi cheksiz
              </p>
            </button>
            <button
              type="button"
              onClick={() => setKind("short")}
              aria-pressed={kind === "short"}
              className={cn(
                "rounded-xl border p-3 text-left transition-colors",
                kind === "short"
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background hover:bg-secondary/50"
              )}
            >
              <p className="text-sm font-bold text-foreground">Shorts</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Maksimal 1:20 (80 soniya)
              </p>
            </button>
          </div>

          {shortTooLong ? (
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              Bu video {duration} soniya — Shorts uchun juda uzun (max 80 soniya).
              Oddiy &laquo;Video&raquo; sifatida yuklang.
            </p>
          ) : null}
        </div>

        {/* 2. Malumotlar */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-bold text-foreground">2. Ma&apos;lumotlar</h2>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="up-title" className="text-sm font-medium text-foreground">
                Video nomi *
              </label>
              <input
                id="up-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                placeholder="Masalan: Toshkent bozoridan kunlik vlog"
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="up-desc" className="text-sm font-medium text-foreground">
                Description (tavsif)
              </label>
              <textarea
                id="up-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={5000}
                placeholder="Video haqida qisqacha yozing..."
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>

            {/* Thumbnail */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">
                Thumbnail (rasm)
              </span>
              <div className="flex items-start gap-4">
                <label className="flex w-44 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border px-3 py-5 text-center transition-colors hover:border-primary/60 hover:bg-secondary/40">
                  <ImagePlus className="size-6 text-muted-foreground" aria-hidden="true" />
                  <span className="text-xs font-semibold text-foreground">
                    {thumb ? "Almashtirish" : "Rasm tanlash"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={pickThumb}
                    className="sr-only"
                    aria-label="Thumbnail rasm tanlash"
                  />
                </label>

                {thumbPreview ? (
                  <img
                    src={thumbPreview}
                    alt="Tanlangan thumbnail"
                    className="aspect-video w-44 rounded-xl object-cover"
                  />
                ) : autoThumbPreview ? (
                  <div className="relative">
                    <img
                      src={autoThumbPreview}
                      alt="Videodan avtomatik olindi"
                      className="aspect-video w-44 rounded-xl object-cover"
                    />
                    <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">
                      avtomatik
                    </span>
                  </div>
                ) : (
                  <div className="flex aspect-video w-44 items-center justify-center rounded-xl bg-secondary/50 text-xs text-muted-foreground">
                    Agar rasm tanlanmasa, videodan avtomatik oladi
                  </div>
                )}
              </div>
            </div>

            {/* Chat yoqish/o'chirish */}
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background p-4">
              <input
                type="checkbox"
                checked={allowComments}
                onChange={(e) => setAllowComments(e.target.checked)}
                className="mt-0.5 size-4 accent-[oklch(0.577_0.245_27.325)]"
              />
              <span>
                <span className="block text-sm font-semibold text-foreground">
                  Chat / izohlarga ruxsat berish
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Belgilansa odamlar videoga izoh qoldiradi. Belgilanmasa chat
                  o&apos;chiriladi.
                </span>
              </span>
            </label>
          </div>
        </div>

        {/* Dublikat xabari */}
        {duplicate ? (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
            <div className="flex-1 text-sm text-foreground">
              <p className="font-semibold">Dublikat aniqlandi</p>
              <p className="mt-1 text-muted-foreground">{duplicate.message}</p>
              {duplicate.existingId ? (
                <button
                  type="button"
                  onClick={() => onUploaded(duplicate.existingId)}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  Mavjud videoni ko&apos;rish
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={submitting || !file || shortTooLong}
          className="h-12 w-full text-base font-bold"
        >
          {submitting ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              Yuklanmoqda...
            </>
          ) : (
            <>
              <UploadCloud className="size-5" aria-hidden="true" />
              {kind === "short" ? "Shorts yuklash" : "Video yuklash"}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
