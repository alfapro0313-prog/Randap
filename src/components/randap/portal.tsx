"use client";

import {
  ArrowRight,
  BookOpen,
  CirclePlay,
  GraduationCap,
  ListChecks,
  MessageCircle,
  Trophy,
  Users,
} from "lucide-react";
import { useLang } from "./lang-provider";
import type { SectionItem } from "@/lib/randap-types";

type PortalProps = {
  videosCount: number;
  shortsCount: number;
  sections: SectionItem[];
  loading: boolean;
  onEnterVideos: () => void;
  onEnterTests: () => void;
  onEnterOrganish: () => void;
  onEnterChat: () => void;
  onOpenBallar: () => void;
};

export function PortalView({
  videosCount,
  shortsCount,
  sections,
  loading,
  onEnterVideos,
  onEnterTests,
  onEnterOrganish,
  onEnterChat,
  onOpenBallar,
}: PortalProps) {
  const { t } = useLang();
  const quizCount = sections.reduce((sum, s) => sum + s.quizzes.length, 0);
  const lessonCount = sections.reduce((sum, s) => sum + s.lessons.length, 0);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 py-2 pb-6">
      {/* Kichik kirish matni */}
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-sm font-semibold text-muted-foreground">
          {t("portalWelcome")}
        </p>
        <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
          {t("portalChoose")}
        </h1>
      </div>

      {/* To'rtta kichik bo'lim */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* 1-bo'lim: Randap Video — YouTubega o'xshagan */}
        <button
          onClick={onEnterVideos}
          aria-label={t("enterVideoAria")}
          className="group flex flex-col rounded-2xl border border-border bg-card p-5 text-left transition-all hover:border-red-300 hover:shadow-md"
        >
          <span className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <CirclePlay className="size-6" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-base font-extrabold text-foreground">
                Randap Video
              </span>
              <span className="block text-xs text-muted-foreground">
                {t("portalVideoSub")}
              </span>
            </span>
          </span>

          <span className="mt-3 block text-sm leading-relaxed text-muted-foreground">
            {t("portalVideoDesc")}
          </span>

          <span className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
              {loading ? "..." : `${videosCount} ${t("videoUnit")}`}
            </span>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
              {loading ? "..." : `${shortsCount} ${t("shortsUnit")}`}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
              <Users className="size-3" aria-hidden="true" />
              {t("subs")}
            </span>
          </span>

          <span className="mt-4 flex h-9 items-center justify-center gap-1.5 rounded-full bg-red-600 px-4 text-sm font-bold text-white transition-colors group-hover:bg-red-700">
            {t("enter")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </button>

        {/* 2-bo'lim: Testlar — hamma fandan, ballari alohida */}
        <button
          onClick={onEnterTests}
          aria-label={t("enterTestsAria")}
          className="group flex flex-col rounded-2xl border border-border bg-card p-5 text-left transition-all hover:border-primary/50 hover:shadow-md"
        >
          <span className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <GraduationCap className="size-6" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-base font-extrabold text-foreground">
                {t("navSections")}
              </span>
              <span className="block text-xs text-muted-foreground">
                {t("portalTestsSub")}
              </span>
            </span>
          </span>

          <span className="mt-3 block text-sm leading-relaxed text-muted-foreground">
            {t("portalTestsA")}
            <span className="font-semibold text-foreground">
              {t("portalTestsBold")}
            </span>
            {t("portalTestsB")}
          </span>

          <span className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
              {loading ? "..." : `${sections.length} ${t("fanUnit")}`}
            </span>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
              {loading ? "..." : `${quizCount} ${t("navSections").toLowerCase()}`}
            </span>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
              {loading ? "..." : `${lessonCount} ${t("orgatuvUnit")}`}
            </span>
          </span>

          <span className="mt-4 flex h-9 items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors group-hover:bg-primary/90">
            {t("enter")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </button>

        {/* 3-bo'lim: O'rganish — uzun maqolalar + din va hayot burchlari */}
        <button
          onClick={onEnterOrganish}
          aria-label={t("enterOrganishAria")}
          className="group flex flex-col rounded-2xl border border-border bg-card p-5 text-left transition-all hover:border-violet-300 hover:shadow-md"
        >
          <span className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <BookOpen className="size-6" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-base font-extrabold text-foreground">
                {t("navOrganish")}
              </span>
              <span className="block text-xs text-muted-foreground">
                {t("portalOrganishSub")}
              </span>
            </span>
          </span>

          <span className="mt-3 block text-sm leading-relaxed text-muted-foreground">
            {t("portalOrganishDesc")}
          </span>

          <span className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
              {t("fourTopics")}
            </span>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
              {t("dinBadge")}
            </span>
          </span>

          <span className="mt-4 flex h-9 items-center justify-center gap-1.5 rounded-full bg-violet-600 px-4 text-sm font-bold text-white transition-colors group-hover:bg-violet-700">
            {t("enter")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </button>

        {/* 4-bo'lim: Chat — Telegramga o'xshagan */}
        <button
          onClick={onEnterChat}
          aria-label={t("enterChatAria")}
          className="group flex flex-col rounded-2xl border border-border bg-card p-5 text-left transition-all hover:border-sky-300 hover:shadow-md"
        >
          <span className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
              <MessageCircle className="size-6" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-base font-extrabold text-foreground">
                {t("navChat")}
              </span>
              <span className="block text-xs text-muted-foreground">
                {t("portalChatSub")}
              </span>
            </span>
          </span>

          <span className="mt-3 block text-sm leading-relaxed text-muted-foreground">
            {t("portalChatDesc")}
          </span>

          <span className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
              {t("randomChatBadge")}
            </span>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
              {t("stickersBadge")}
            </span>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
              {t("photoBadge")}
            </span>
          </span>

          <span className="mt-4 flex h-9 items-center justify-center gap-1.5 rounded-full bg-sky-600 px-4 text-sm font-bold text-white transition-colors group-hover:bg-sky-700">
            {t("enter")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </button>
      </div>

      {/* Ballar — alohida reyting */}
      <button
        onClick={onOpenBallar}
        className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left transition-colors hover:bg-amber-100"
      >
        <Trophy className="size-5 shrink-0 text-amber-600" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-amber-900">
            {t("ballarBarTitle")}
          </span>
          <span className="block text-xs text-amber-700">
            {t("ballarBarDesc")}
          </span>
        </span>
        <ListChecks className="size-4 shrink-0 text-amber-600" aria-hidden="true" />
      </button>
    </div>
  );
}
