import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureUser } from "@/lib/randap-server";

/** To'g'ri javob uchun ball */
const POINTS_PER_CORRECT = 10;

/**
 * POST /api/quiz/submit
 * { deviceKey, quizId, answers: number[] }
 * Baholash serverda bajariladi, ball foydalanuvchiga qo'shiladi.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      deviceKey?: string;
      quizId?: string;
      answers?: number[];
    } | null;

    const deviceKey = (body?.deviceKey ?? "").trim();
    const quizId = (body?.quizId ?? "").trim();
    const answers = Array.isArray(body?.answers) ? body!.answers : [];

    if (!deviceKey || !quizId) {
      return NextResponse.json(
        { ok: false, error: "deviceKey va quizId kerak" },
        { status: 400 }
      );
    }

    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: { questions: { orderBy: { order: "asc" } } },
    });

    if (!quiz) {
      return NextResponse.json(
        { ok: false, error: "Test topilmadi" },
        { status: 404 }
      );
    }

    // Baholash
    const correctIndexes: number[] = [];
    let score = 0;
    quiz.questions.forEach((q, i) => {
      correctIndexes.push(q.correctIndex);
      if (answers[i] === q.correctIndex) score++;
    });

    const total = quiz.questions.length;
    const pointsEarned = score * POINTS_PER_CORRECT;

    // Urinishni saqlash + ballni qo'shish
    await db.quizAttempt.create({
      data: {
        quizId,
        deviceId: deviceKey,
        score,
        total,
        pointsEarned,
      },
    });

    const user = await ensureUser(deviceKey);
    const updated = await db.user.update({
      where: { id: user.id },
      data: { points: { increment: pointsEarned } },
      select: { id: true, name: true, handle: true, avatar: true, points: true },
    });

    const bestAttempts = await db.quizAttempt.findMany({
      where: { quizId, deviceId: deviceKey },
      select: { score: true },
    });
    const bestScore = Math.max(...bestAttempts.map((a) => a.score), score);

    return NextResponse.json({
      ok: true,
      score,
      total,
      pointsEarned,
      userPoints: updated.points,
      correctIndexes,
      bestScore,
    });
  } catch (error) {
    console.error("/api/quiz/submit error:", error);
    return NextResponse.json(
      { ok: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
