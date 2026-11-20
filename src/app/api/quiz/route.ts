import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { localizeQuestion, localizeQuiz, localizeSubject } from "@/lib/randap-content-i18n";

/**
 * GET /api/quiz?id=&lang=
 * Test savollari TASODIFIY tanlab qaytariladi (har kirganda har xil savol):
 * savollar bazasidan ko'pi bilan 10 ta aralashtirib tanlanadi.
 * To'g'ri javoblar yashirin — baholash faqat serverda /api/quiz/submit orqali
 * bajariladi (client tanlangan savollarning idlarini qaytaradi).
 * lang=en|ru berilsa — savollar tarjima qilib qaytariladi.
 */

/** Bir yo'lda ko'rsatiladigan savollar soni */
const SHOW_QUESTIONS = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = (searchParams.get("id") ?? "").trim();
    const lang = (searchParams.get("lang") ?? "").trim();

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "id kerak" },
        { status: 400 }
      );
    }

    const quiz = await db.quiz.findUnique({
      where: { id },
      include: {
        subject: {
          select: { id: true, name: true, slug: true, icon: true, color: true },
        },
        questions: { orderBy: { order: "asc" } },
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { ok: false, error: "Test topilmadi" },
        { status: 404 }
      );
    }

    const quizTr = localizeQuiz(
      quiz.subject.slug,
      quiz.order,
      quiz.title,
      quiz.description,
      lang
    );
    const subjectTr = localizeSubject(
      quiz.subject.slug,
      quiz.subject.name,
      "",
      lang
    );

    // Tasodifiy tanlash: har kirganda har xil savollar tushadi
    const allQuestions = shuffle(quiz.questions);
    const picked = allQuestions.slice(0, Math.min(SHOW_QUESTIONS, allQuestions.length));

    return NextResponse.json({
      ok: true,
      quiz: {
        id: quiz.id,
        title: quizTr.title,
        description: quizTr.description,
        subject: { ...quiz.subject, name: subjectTr.name },
        total: picked.length,
        poolSize: quiz.questions.length,
        kind: quiz.kind,
        questions: picked.map((q) => {
          const qtr = localizeQuestion(
            quiz.subject.slug,
            quiz.order,
            q.order,
            q.text,
            JSON.parse(q.options) as string[],
            lang
          );
          return {
            id: q.id,
            text: qtr.text,
            options: qtr.options,
            audio: q.audio ?? null,
          };
        }),
      },
    });
  } catch (error) {
    console.error("/api/quiz error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
