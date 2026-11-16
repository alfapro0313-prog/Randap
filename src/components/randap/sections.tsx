"use client";

import {
  ArrowLeft,
  BookOpen,
  Calculator,
  ChevronRight,
  FlaskConical,
  Globe2,
  Landmark,
  Languages,
  ListChecks,
  Loader2,
  PlayCircle,
  Trophy,
} from "lucide-react";
import type { SectionItem } from "@/lib/randap-types";
import { useLang } from "./lang-provider";
import { cn } from "@/lib/utils";

const ICONS: Record<string, typeof BookOpen> = {
  calculator: Calculator,
  languages: Languages,
  landmark: Landmark,
  book: BookOpen,
  flask: FlaskConical,
  globe: Globe2,
};

const TILE_CLASSES: Record<string, string> = {
  amber: "bg-amber-100 text-amber-700",
  emerald: "bg-emerald-100 text-emerald-700",
  rose: "bg-rose-100 text-rose-700",
};

export function SectionTile({
  icon,
  color,
  className,
}: {
  icon: string;
  color: string;
  className?: string;
}) {
  const Icon = ICONS[icon] ?? BookOpen;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-xl",
        TILE_CLASSES[color] ?? "bg-secondary text-secondary-foreground",
        className
      )}
    >
      <Icon className="size-6" />
    </span>
  );
}

export function SectionsGrid({
  sections,
  loading,
  onOpen,
  columns = 3,
}: {
  sections: SectionItem[];
  loading: boolean;
  onOpen: (section: SectionItem) => void;
  columns?: 2 | 3;
}) {
  const { t } = useLang();
  if (loading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"
        )}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="flex h-36 animate-pulse items-center gap-4 rounded-2xl border border-border bg-card p-5"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4",
        columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"
      )}
    >
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onOpen(section)}
          aria-label={`${section.name} bo'limiga kirish`}
          className="group flex flex-col rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:border-primary/50 hover:bg-secondary/40"
        >
          <div className="flex items-center gap-4">
            <SectionTile icon={section.icon} color={section.color} />
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-foreground group-hover:text-primary/90">
                {section.name}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t("testsCountLine", { q: section.quizzes.length, l: section.lessons.length })}
              </p>
            </div>
            <ChevronRight
              className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {section.description}
          </p>
        </button>
      ))}
    </div>
  );
}

export function SectionDetail({
  subject,
  loading,
  onBack,
  onStartQuiz,
  onOpenLesson,
}: {
  subject: SectionItem | null;
  loading: boolean;
  onBack: () => void;
  onStartQuiz: (quizId: string) => void;
  onOpenLesson: (lessonId: string) => void;
}) {
  const { t } = useLang();
  if (loading || !subject) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="size-7 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-7 pb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label={t("back")}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <h1 className="text-lg font-bold text-foreground">{subject.name}</h1>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
        <SectionTile icon={subject.icon} color={subject.color} className="size-14" />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-foreground">{subject.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {subject.description}
          </p>
        </div>
        <span className="hidden shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground sm:block">
          {t("testsCountLine", { q: subject.quizzes.length, l: subject.lessons.length })}
        </span>
      </div>

      {/* Testlar */}
      <section aria-label={t("navSections")} className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
          <ListChecks className="size-5 text-primary" aria-hidden="true" />
          {t("navSections")}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {subject.quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="flex flex-col rounded-2xl border border-border bg-card p-5"
            >
              <h3 className="text-base font-bold text-foreground">
                {quiz.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {quiz.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                  {t("savolCount", { n: quiz.questionCount })}
                </span>
                {quiz.bestScore !== null ? (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <Trophy className="size-3" aria-hidden="true" />
                    {t("best", { a: quiz.bestScore, b: quiz.questionCount })}
                  </span>
                ) : null}
              </div>
              <button
                onClick={() => onStartQuiz(quiz.id)}
                className="mt-4 flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ListChecks className="size-4" aria-hidden="true" />
                {quiz.bestScore !== null ? t("solveAgain") : t("startQuiz")}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* O'rgatuvlar (darslar) */}
      <section aria-label={t("orgatuvsHeading")} className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
          <PlayCircle className="size-5 text-primary" aria-hidden="true" />
          {t("orgatuvsHeading")}
        </h2>
        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
          {subject.lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => onOpenLesson(lesson.id)}
              className="flex items-start gap-4 p-4 text-left transition-colors hover:bg-secondary/40"
            >
              <PlayCircle
                className="mt-0.5 size-6 shrink-0 text-primary/80"
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-foreground">
                  {lesson.title}
                </span>
                <span className="mt-0.5 block text-sm text-muted-foreground">
                  {lesson.summary}
                </span>
              </span>
              <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                {lesson.durationMin} {t("minutes")}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
