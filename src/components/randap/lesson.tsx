"use client";

import { ArrowLeft, Clock } from "lucide-react";
import { SectionTile } from "./sections";
import type { LessonItem, SectionItem } from "@/lib/randap-types";

type LessonViewProps = {
  lesson: LessonItem | null;
  subject: SectionItem | null;
  onBack: () => void;
  onNextLesson: (lessonId: string) => void;
};

export function LessonView({ lesson, subject, onBack, onNextLesson }: LessonViewProps) {
  if (!lesson) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
        <p className="text-base font-semibold">Dars topilmadi</p>
        <button
          onClick={onBack}
          className="rounded-full border border-border bg-secondary px-4 py-2 text-sm font-semibold hover:bg-secondary/80"
        >
          Orqaga
        </button>
      </div>
    );
  }

  const paragraphs = lesson.content.split(/\n\s*\n/).filter(Boolean);
  const idx = subject?.lessons.findIndex((l) => l.id === lesson.id) ?? -1;
  const nextLesson = subject && idx >= 0 ? subject.lessons[idx + 1] : undefined;

  return (
    <article className="mx-auto flex w-full max-w-2xl flex-col gap-6 pb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Orqaga qaytish"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        {subject ? (
          <SectionTile
            icon={subject.icon}
            color={subject.color}
            className="size-9"
          />
        ) : null}
        <span className="truncate text-sm font-semibold text-muted-foreground">
          {subject?.name ?? "O'rgatuv"}
        </span>
      </div>

      <header className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
          O&apos;rgatuv
          <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] normal-case text-secondary-foreground">
            <Clock className="size-3" aria-hidden="true" />
            {lesson.durationMin} daqiqa
          </span>
        </span>
        <h1 className="text-2xl font-extrabold text-foreground">{lesson.title}</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {lesson.summary}
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="rounded-xl border border-border bg-card p-5 text-[15px] leading-relaxed text-foreground/90"
          >
            {p}
          </p>
        ))}
      </div>

      {nextLesson ? (
        <button
          onClick={() => onNextLesson(nextLesson.id)}
          className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:bg-secondary/40"
        >
          <span>
            <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Keyingi dars
            </span>
            <span className="mt-1 block font-bold text-foreground">
              {nextLesson.title}
            </span>
          </span>
          <span className="text-sm font-semibold text-primary">O&apos;tish →</span>
        </button>
      ) : null}
    </article>
  );
}
