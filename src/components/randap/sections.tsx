"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Atom,
  BookOpen,
  Calculator,
  ChevronRight,
  FlaskConical,
  Globe2,
  Headphones,
  Landmark,
  Languages,
  ListChecks,
  Loader2,
  PlayCircle,
  Trophy,
} from "lucide-react";
import type { QuizDifficulty, SectionItem } from "@/lib/randap-types";
import { useLang } from "./lang-provider";
import { cn } from "@/lib/utils";

const ICONS: Record<string, typeof BookOpen> = {
  calculator: Calculator,
  languages: Languages,
  landmark: Landmark,
  book: BookOpen,
  flask: FlaskConical,
  globe: Globe2,
  atom: Atom,
};

const TILE_CLASSES: Record<string, string> = {
  amber: "bg-amber-100 text-amber-700",
  emerald: "bg-emerald-100 text-emerald-700",
  rose: "bg-rose-100 text-rose-700",
  sky: "bg-sky-100 text-sky-700",
  violet: "bg-violet-100 text-violet-700",
  cyan: "bg-cyan-100 text-cyan-700",
};

const DIFF_BADGE: Record<QuizDifficulty, string> = {
  easy: "bg-emerald-100 text-emerald-700",
  middle: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700",
  "very-hard": "bg-zinc-900 text-red-400 border border-red-500/40",
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
  // Sinf va qiyinlik filtrlari (7-11 sinf tarix fanlari uchun asosiy)
  const [gradeFilter, setGradeFilter] = useState<number | null>(null);
  const [diffFilter, setDiffFilter] = useState<QuizDifficulty | null>(null);

  const grades = useMemo(() => {
    const set = new Set<number>();
    subject?.quizzes.forEach((q) => {
      if (q.grade !== null && q.grade !== undefined) set.add(q.grade);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [subject]);

  const filteredQuizzes = useMemo(() => {
    if (!subject) return [];
    return subject.quizzes.filter((q) => {
      if (gradeFilter !== null && q.grade !== gradeFilter) return false;
      if (diffFilter !== null && q.difficulty !== diffFilter) return false;
      return true;
    });
  }, [subject, gradeFilter, diffFilter]);

  if (loading || !subject) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="size-7 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  const diffChips: Array<[QuizDifficulty | null, string]> = [
    [null, t("diffAll")],
    ["easy", t("diffEasy")],
    ["middle", t("diffMiddle")],
    ["hard", t("diffHard")],
    ["very-hard", t("diffVeryHard")],
  ];

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

        {/* Sinf filtri — faqat sinf testlari bor fanlarda */}
        {grades.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setGradeFilter(null)}
              aria-pressed={gradeFilter === null}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                gradeFilter === null
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-secondary/60 text-foreground hover:bg-secondary"
              )}
            >
              {t("gradeAll")}
            </button>
            {grades.map((g) => (
              <button
                key={g}
                onClick={() => setGradeFilter(g)}
                aria-pressed={gradeFilter === g}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  gradeFilter === g
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-secondary/60 text-foreground hover:bg-secondary"
                )}
              >
                {g}-{t("gradeClass")}
              </button>
            ))}
          </div>
        ) : null}

        {/* Qiyinlik filtri */}
        <div className="flex flex-wrap items-center gap-2">
          {diffChips.map(([key, label]) => (
            <button
              key={label}
              onClick={() => setDiffFilter(key)}
              aria-pressed={diffFilter === key}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                diffFilter === key
                  ? "bg-foreground text-background"
                  : "border border-border bg-secondary/60 text-foreground hover:bg-secondary"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filteredQuizzes.map((quiz) => (
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
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-semibold",
                    DIFF_BADGE[quiz.difficulty] ?? "bg-secondary text-secondary-foreground"
                  )}
                >
                  {quiz.difficulty === "easy"
                    ? t("diffEasy")
                    : quiz.difficulty === "hard"
                      ? t("diffHard")
                      : quiz.difficulty === "very-hard"
                        ? t("diffVeryHard")
                        : t("diffMiddle")}
                </span>
                {quiz.kind === "listening" ? (
                  <span className="flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">
                    <Headphones className="size-3" aria-hidden="true" />
                    {t("listeningBadge")}
                  </span>
                ) : null}
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
                {quiz.kind === "listening" ? (
                  <Headphones className="size-4" aria-hidden="true" />
                ) : (
                  <ListChecks className="size-4" aria-hidden="true" />
                )}
                {quiz.bestScore !== null ? t("solveAgain") : t("startQuiz")}
              </button>
            </div>
          ))}
          {filteredQuizzes.length === 0 ? (
            <p className="col-span-full rounded-2xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
              {t("nothingFoundHint")}
            </p>
          ) : null}
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
