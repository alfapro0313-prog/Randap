import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/quiz?id=
 * Testni to'liq savollari bilan qaytaradi (to'g'ri javoblar yashirin —
 * baholash faqat serverda /api/quiz/submit orqali bajariladi).
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = (searchParams.get("id") ?? "").trim();

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

    return NextResponse.json({
      ok: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        subject: quiz.subject,
        total: quiz.questions.length,
        questions: quiz.questions.map((q) => ({
          id: q.id,
          text: q.text,
          options: JSON.parse(q.options) as string[],
        })),
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
