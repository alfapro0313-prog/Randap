"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ListChecks,
  Loader2,
  PartyPopper,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { SectionTile } from "./sections";
import type { QuizData, QuizResult } from "@/lib/randap-types";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D"];

type QuizViewProps = {
  quizId: string;
  deviceKey: string;
  onBack: () => void;
  onFinished: () => void;
};

export function QuizView({ quizId, deviceKey, onBack, onFinished }: QuizViewProps) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [idx, setIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quiz?id=${encodeURIComponent(quizId)}`);
      const data = await res.json();
      if (data.ok) {
        setQuiz(data.quiz as QuizData);
        setAnswers(new Array(data.quiz.total).fill(null));
        setIdx(0);
        setResult(null);
      }
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    void load();
  }, [load]);

  function pick(optionIndex: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = optionIndex;
      return next;
    });
  }

  async function finish() {
    if (!quiz || submitting) return;
    const unanswered = answers.filter((a) => a === null).length;
    if (unanswered > 0) {
      toast({
        title: `${unanswered} ta savol javobsiz qoldi`,
        description: "Javobsiz savollar noto'g'ri hisoblanadi.",
        variant: "destructive",
      });
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceKey,
          quizId: quiz.id,
          answers: answers.map((a) => a ?? -1),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setResult(data as QuizResult);
        onFinished();
        window.scrollTo({ top: 0 });
      } else {
        toast({ title: "Xatolik", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({
        title: "Xatolik",
        description: "Natijani yuborib bo'lmadi. Qayta urinib ko'ring.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
        <p className="text-base font-semibold">Test topilmadi</p>
        <button
          onClick={onBack}
          className="rounded-full border border-border bg-secondary px-4 py-2 text-sm font-semibold hover:bg-secondary/80"
        >
          Orqaga
        </button>
      </div>
    );
  }

  // ---------- Natija ekrani ----------
  if (result) {
    const pct = Math.round((result.score / result.total) * 100);
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 pb-6">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <PartyPopper className="size-8" aria-hidden="true" />
          </span>
          <p className="text-3xl font-extrabold text-foreground">
            {result.score} / {result.total}
          </p>
          <p className="text-sm text-muted-foreground">
            {pct >= 80
              ? "Ajoyib natija! Bilimingiz qattiq ekan."
              : pct >= 50
                ? "Yaxshi! Yana bir marta yechsangiz yuqoriga chiqasiz."
                : "Avval darslarni o'rganing va qayta yechib ko'ring."}
          </p>

          <div className="mt-2 flex w-full items-center justify-center gap-3 rounded-xl bg-primary/10 px-4 py-3">
            <Trophy className="size-5 text-primary" aria-hidden="true" />
            <p className="text-base font-bold text-foreground">
              +{result.pointsEarned} ball qo&apos;shildi
            </p>
            <span className="text-sm text-muted-foreground">
              (jami: {result.userPoints} ball)
            </span>
          </div>
        </div>

        {/* Har bir savol bo'yicha ko'rik */}
        <section aria-label="Natijalar ko'rigi" className="flex flex-col gap-3">
          {quiz.questions.map((q, i) => {
            const mine = answers[i];
            const correct = result.correctIndexes[i];
            const ok = mine === correct;
            return (
              <div
                key={q.id}
                className={cn(
                  "flex flex-col gap-2 rounded-xl border p-4",
                  ok
                    ? "border-emerald-200 bg-emerald-50/60"
                    : "border-rose-200 bg-rose-50/60"
                )}
              >
                <p className="flex items-start gap-2 text-sm font-semibold text-foreground">
                  {ok ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                  ) : (
                    <XCircle className="mt-0.5 size-4 shrink-0 text-rose-600" aria-hidden="true" />
                  )}
                  {i + 1}. {q.text}
                </p>
                <p className="pl-6 text-xs text-muted-foreground">
                  Sizning javobingiz:{" "}
                  <span className={ok ? "font-semibold text-emerald-700" : "font-semibold text-rose-700"}>
                    {mine === null || mine < 0 ? "— (javob yo'q)" : q.options[mine]}
                  </span>
                  {!ok ? (
                    <>
                      {" · "}To&apos;g&apos;ri javob:{" "}
                      <span className="font-semibold text-emerald-700">
                        {q.options[correct]}
                      </span>
                    </>
                  ) : null}
                </p>
              </div>
            );
          })}
        </section>

        <div className="flex flex-wrap justify-center gap-3">
          <Button
            onClick={() => void load()}
            className="h-11 rounded-full px-6 font-bold"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Yana yechish
          </Button>
          <Button
            variant="secondary"
            onClick={onBack}
            className="h-11 rounded-full px-6 font-bold"
          >
            Bo&apos;limga qaytish
          </Button>
        </div>
      </div>
    );
  }

  // ---------- Test yechish ekrani ----------
  const question = quiz.questions[idx];
  const answered = answers.filter((a) => a !== null).length;
  const progress = Math.round((answered / quiz.total) * 100);
  const isLast = idx === quiz.total - 1;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 pb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Orqaga qaytish"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <SectionTile
          icon={quiz.subject.icon}
          color={quiz.subject.color}
          className="size-9"
        />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-bold text-foreground">
            {quiz.title}
          </h1>
          <p className="truncate text-xs text-muted-foreground">
            {quiz.subject.name}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>
            Savol {idx + 1} / {quiz.total}
          </span>
          <span>{quiz.total * 10} ballgacha</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Savol */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-lg font-bold leading-relaxed text-foreground">
          {question.text}
        </p>
        <div className="mt-5 flex flex-col gap-2.5">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => pick(i)}
              aria-pressed={answers[idx] === i}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                answers[idx] === i
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-background text-foreground hover:bg-secondary/50"
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  answers[idx] === i
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {LETTERS[i]}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Navigatsiya */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setIdx((v) => Math.max(0, v - 1))}
          disabled={idx === 0}
          className="h-10 rounded-full border border-border bg-secondary px-5 text-sm font-semibold text-foreground disabled:opacity-40"
        >
          Oldingi
        </button>
        <p className="text-xs text-muted-foreground">
          {answered} / {quiz.total} javob berildi
        </p>
        {isLast ? (
          <Button
            onClick={() => void finish()}
            disabled={submitting}
            className="h-10 rounded-full px-5 font-bold"
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <ListChecks className="size-4" aria-hidden="true" />
            )}
            Yakunlash
          </Button>
        ) : (
          <button
            onClick={() => setIdx((v) => Math.min(quiz.total - 1, v + 1))}
            className="h-10 rounded-full bg-foreground px-5 text-sm font-semibold text-background hover:bg-foreground/90"
          >
            Keyingi
          </button>
        )}
      </div>
    </div>
  );
}
