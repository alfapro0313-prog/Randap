import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/sections?deviceKey=
 * Barcha fanlar (Bo'limlar) + har birining testlari va darslari.
 * deviceKey berilsa — har bir test uchun eng yaxshi natijam qaytariladi.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceKey = (searchParams.get("deviceKey") ?? "").trim();

    const subjects = await db.subject.findMany({
      orderBy: { order: "asc" },
      include: {
        quizzes: {
          orderBy: { order: "asc" },
          include: { _count: { select: { questions: true } } },
        },
        lessons: { orderBy: { order: "asc" } },
      },
    });

    let bestByQuiz: Record<string, number> = {};
    if (deviceKey) {
      const attempts = await db.quizAttempt.findMany({
        where: { deviceId: deviceKey },
        orderBy: { createdAt: "desc" },
      });
      bestByQuiz = attempts.reduce<Record<string, number>>((acc, a) => {
        const cur = acc[a.quizId];
        acc[a.quizId] = cur === undefined ? a.score : Math.max(cur, a.score);
        return acc;
      }, {});
    }

    const sections = subjects.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      description: s.description,
      icon: s.icon,
      color: s.color,
      quizzes: s.quizzes.map((q) => ({
        id: q.id,
        title: q.title,
        description: q.description,
        questionCount: q._count.questions,
        bestScore:
          deviceKey && bestByQuiz[q.id] !== undefined ? bestByQuiz[q.id] : null,
      })),
      lessons: s.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        summary: l.summary,
        content: l.content,
        durationMin: l.durationMin,
      })),
    }));

    return NextResponse.json({ ok: true, sections });
  } catch (error) {
    console.error("/api/sections error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
