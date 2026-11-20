import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { localizeQuestion, localizeQuiz, localizeSubject } from "@/lib/randap-content-i18n";

/**
 * GET /api/quiz?id=&lang=
 * Testni to'liq savollari bilan qaytaradi (to'g'ri javoblar yashirin —
 * baholash faqat serverda /api/quiz/submit orqali bajariladi).
 * lang=en|ru berilsa — savollar tarjima qilib qaytariladi.
 */
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

    return NextResponse.json({
      ok: true,
      quiz: {
        id: quiz.id,
        title: quizTr.title,
        description: quizTr.description,
        subject: { ...quiz.subject, name: subjectTr.name },
        total: quiz.questions.length,
        kind: quiz.kind,
        questions: quiz.questions.map((q) => {
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
