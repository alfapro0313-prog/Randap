import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  localizeLesson,
  localizeQuiz,
  localizeSubject,
} from "@/lib/randap-content-i18n";
import { ensureContentSeeded } from "@/lib/randap-seed";

export const maxDuration = 60; // Vercel: birinchi seed uchun

/**
 * GET /api/sections?deviceKey=&lang=
 * Barcha fanlar (Bo'limlar) + har birining testlari va darslari.
 * deviceKey berilsa — har bir test uchun eng yaxshi natijam qaytariladi.
 * lang=en|ru berilsa — fan/test/dars matnlari tarjima qilib qaytariladi
 * (uz — DB dagi asl matn).
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceKey = (searchParams.get("deviceKey") ?? "").trim();
    const lang = (searchParams.get("lang") ?? "").trim();

    // Yangi fanlar/testlar bazada yo'q bo'lsa — bir marta avtomatik yaratiladi
    await ensureContentSeeded();

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

    const sections = subjects.map((s) => {
      const nameDesc = localizeSubject(
        s.slug,
        s.name,
        s.description,
        lang
      );
      return {
        id: s.id,
        slug: s.slug,
        name: nameDesc.name,
        description: nameDesc.description,
        icon: s.icon,
        color: s.color,
        quizzes: s.quizzes.map((q) => {
          const qtr = localizeQuiz(
            s.slug,
            q.order,
            q.title,
            q.description,
            lang
          );
          return {
            id: q.id,
            title: qtr.title,
            description: qtr.description,
            questionCount: q._count.questions,
            difficulty: q.difficulty,
            grade: q.grade,
            kind: q.kind,
            bestScore:
              deviceKey && bestByQuiz[q.id] !== undefined ? bestByQuiz[q.id] : null,
          };
        }),
        lessons: s.lessons.map((l) =>
          localizeLesson(
            s.slug,
            l.order,
            {
              id: l.id,
              title: l.title,
              summary: l.summary,
              content: l.content,
              durationMin: l.durationMin,
            },
            lang
          )
        ),
      };
    });

    return NextResponse.json({ ok: true, sections });
  } catch (error) {
    console.error("/api/sections error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
