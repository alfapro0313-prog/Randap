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
import { useLang } from "./lang-provider";
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

/** Bo'laklab yuklash: har bir bo'lakning xom bayt hajmi (serverless 4.5MB limit) */
const UPLOAD_CHUNK_BYTES = 3_000_000;

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** Blob/Base64 (FileReader dataURL orqali) — katta fayllar uchun ham xavfsiz */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const s = String(reader.result ?? "");
      const comma = s.indexOf(",");
      resolve(comma >= 0 ? s.slice(comma + 1) : s);
    };
    reader.onerror = () => reject(new Error("Faylni o'qib bo'lmadi"));
    reader.readAsDataURL(blob);
  });
}

export function UploadView({ deviceKey, onBack, onUploaded }: UploadViewProps) {
  const { t } = useLang();
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
  const [progress, setProgress] = useState(0);
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
        title: t("toastVideoPick"),
        description: t("toastVideoPickDesc"),
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
        title: t("toastFileReadFail"),
        description: t("toastFileReadFailDesc"),
        variant: "destructive",
      });
    };
  }

  function pickThumb(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    if (!picked) return;
    if (!picked.type.startsWith("image/")) {
      toast({
        title: t("chooseImage"),
        description: t("toastThumbPickDesc"),
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
        title: t("toastProfilePreparing"),
        description: t("toastProfilePreparingDesc"),
        variant: "destructive",
      });
      return;
    }
    if (!file) {
      toast({ title: t("toastNoFile"), variant: "destructive" });
      return;
    }
    if (title.trim().length < 2) {
      toast({
        title: t("toastTitleShort"),
        description: t("toastTitleShortDesc"),
        variant: "destructive",
      });
      return;
    }
    if (shortTooLong) {
      toast({
        title: t("toastShortTooLong"),
        description: t("toastShortTooLongDesc", { n: duration }),
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    setProgress(0);
    setDuplicate(null);

    try {
      // 1) INIT — yuklashni ochish (uploadId + bo'lak hajmi)
      const initRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceKey,
          title: title.trim(),
          description: description.trim(),
          kind,
          allowComments,
          durationSec: duration,
          fileName: file.name,
          fileSize: file.size,
          mime: file.type || "video/mp4",
        }),
      });
      const initData = await initRes.json();
      if (!initData?.ok) {
        toast({ title: t("toastUploadFail"), description: initData?.error, variant: "destructive" });
        return;
      }
      const uploadId: string = initData.uploadId;
      const chunkSize: number = Number(initData.chunkSize) || UPLOAD_CHUNK_BYTES;

      // 2) BO'LAKLAR — har biri ~3MB, foiz hisoblanib boradi
      const total = Math.ceil(file.size / chunkSize);
      for (let i = 0; i < total; i++) {
        const blob = file.slice(i * chunkSize, Math.min(file.size, (i + 1) * chunkSize));
        const data = await blobToBase64(blob);
        const chunkRes = await fetch("/api/upload/chunk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uploadId, index: i, data }),
        });
        const chunkData = await chunkRes.json();
        if (!chunkData?.ok) {
          toast({
            title: t("toastUploadFail"),
            description: chunkData?.error ?? t("toastUploadFailedDesc"),
            variant: "destructive",
          });
          return;
        }
        const doneBytes = Math.min(file.size, (i + 1) * chunkSize);
        setProgress(Math.round((doneBytes / file.size) * 100));
      }

      // 3) THUMBNAIL — tanlangan rasm yoki videodan olingan avtomatik rasm
      let thumbData: string | null = null;
      if (thumb) {
        thumbData = await blobToBase64(thumb);
      } else if (autoThumbPreview) {
        thumbData = autoThumbPreview.includes(",")
          ? autoThumbPreview.slice(autoThumbPreview.indexOf(",") + 1)
          : autoThumbPreview;
      }

      // 4) FINISH — hash, dublikat tekshiruvi va Video yozuvi
      const finRes = await fetch("/api/upload/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uploadId,
          deviceKey,
          title: title.trim(),
          description: description.trim(),
          kind,
          allowComments,
          durationSec: duration,
          thumbData,
          thumbMime: thumb?.type || "image/jpeg",
        }),
      });
      const finData = await finRes.json();

      if (finData?.ok) {
        toast({
          title: t("toastUploaded"),
          description:
            kind === "short"
              ? t("toastUploadedShorts")
              : t("toastUploadedVideos"),
        });
        resetFile();
        setTitle("");
        setDescription("");
        setAllowComments(true);
        setKind("video");
        setDuration(0);
        onUploaded(finData.video.id);
        return;
      }

      if (finData?.duplicate) {
        setDuplicate({
          message: String(finData.error ?? t("duplicateDefault")),
          existingId: String(finData.existingId ?? ""),
        });
        toast({
          title: t("duplicateFound"),
          description: t("duplicateToastDesc"),
          variant: "destructive",
        });
        return;
      }

      toast({ title: t("toastUploadFail"), description: finData?.error, variant: "destructive" });
    } catch {
      toast({
        title: t("toastUploadFailed"),
        description: t("toastUploadFailedDesc"),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      setProgress(0);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label={t("back")}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <h1 className="text-lg font-bold text-foreground">{t("uploadVideo")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* 1. Video fayl */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <FileVideo className="size-4 text-primary" aria-hidden="true" />
            {t("uploadStep1")}
          </h2>

          {!file ? (
            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-6 py-10 text-center transition-colors hover:border-primary/60 hover:bg-secondary/40">
              <UploadCloud className="size-10 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-semibold text-foreground">
                {t("pickVideo")}
              </span>
              <span className="text-xs text-muted-foreground">
                {t("pickVideoHint")}
              </span>
              <input
                type="file"
                accept="video/*"
                onChange={pickFile}
                className="sr-only"
                aria-label={t("pickVideoAria")}
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
                  {duration > 0 ? formatDuration(duration) : t("readingDuration")}
                  {" · "}
                  {formatBytes(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={resetFile}
                aria-label={t("removeFileAria")}
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
              <p className="text-sm font-bold text-foreground">
                {t("navVideos")}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t("kindVideoDesc")}
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
              <p className="text-sm font-bold text-foreground">
                {t("navShorts")}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t("kindShortsDesc")}
              </p>
            </button>
          </div>

          {shortTooLong ? (
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {t("shortTooLongNote", { n: duration })}
            </p>
          ) : null}
        </div>

        {/* 2. Malumotlar */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-bold text-foreground">{t("uploadStep2")}</h2>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="up-title" className="text-sm font-medium text-foreground">
                {t("titleLabel")}
              </label>
              <input
                id="up-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                placeholder={t("titlePlaceholder")}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="up-desc" className="text-sm font-medium text-foreground">
                {t("descLabel")}
              </label>
              <textarea
                id="up-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={5000}
                placeholder={t("descPlaceholder")}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>

            {/* Thumbnail */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">
                {t("thumbLabel")}
              </span>
              <div className="flex items-start gap-4">
                <label className="flex w-44 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border px-3 py-5 text-center transition-colors hover:border-primary/60 hover:bg-secondary/40">
                  <ImagePlus className="size-6 text-muted-foreground" aria-hidden="true" />
                  <span className="text-xs font-semibold text-foreground">
                    {thumb ? t("thumbReplace") : t("thumbPick")}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={pickThumb}
                    className="sr-only"
                    aria-label={t("thumbPick")}
                  />
                </label>

                {thumbPreview ? (
                  <img
                    src={thumbPreview}
                    alt={t("thumbLabel")}
                    className="aspect-video w-44 rounded-xl object-cover"
                  />
                ) : autoThumbPreview ? (
                  <div className="relative">
                    <img
                      src={autoThumbPreview}
                      alt={t("thumbAuto")}
                      className="aspect-video w-44 rounded-xl object-cover"
                    />
                    <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">
                      {t("thumbAuto")}
                    </span>
                  </div>
                ) : (
                  <div className="flex aspect-video w-44 items-center justify-center rounded-xl bg-secondary/50 text-xs text-muted-foreground">
                    {t("thumbAutoHint")}
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
                  {t("allowComments")}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {t("allowCommentsDesc")}
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
              <p className="font-semibold">{t("duplicateFound")}</p>
              <p className="mt-1 text-muted-foreground">{duplicate.message}</p>
              {duplicate.existingId ? (
                <button
                  type="button"
                  onClick={() => onUploaded(duplicate.existingId)}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  {t("seeExisting")}
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
              {t("uploadProgress", { percent: progress })}
            </>
          ) : (
            <>
              <UploadCloud className="size-5" aria-hidden="true" />
              {kind === "short" ? t("uploadShortsBtn") : t("uploadVideo")}
            </>
          )}
        </Button>

        {/* Yuklanish foizi — progress chizig'i */}
        {submitting ? (
          <div
            className="flex flex-col gap-1.5"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-200 ease-out"
                style={{ width: `${Math.max(2, progress)}%` }}
              />
            </div>
            <p className="text-center text-xs font-medium text-muted-foreground">
              {t("uploadProgress", { percent: progress })}
            </p>
          </div>
        ) : null}
      </form>
    </div>
  );
}
