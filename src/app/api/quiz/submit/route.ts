import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureUser } from "@/lib/randap-server";
import { dzfFromCents } from "@/lib/shop-catalog";

/** To'g'ri javob uchun ball va DZF (dapzif) — qiyinlik darajasiga qarab */
const POINTS_PER_CORRECT = 10;
/** DZF sentlari: oson 0.2, o'rtacha 0.5, qiyin 1.0 DZF har to'g'ri javob uchun */
const DZF_CENTS: Record<string, number> = {
  easy: 20,
  middle: 50,
  hard: 100,
  "very-hard": 200,
};

/**
 * POST /api/quiz/submit
 * { deviceKey, quizId, answers: number[], questionIds?: string[] }
 * Savollar har kirganda tasodifiy tanlanadi — shuning uchun client o'zi
 * olgan savollarning idlarini ham yuboradi; faqat shu savollar bo'yicha
 * baholanadi. questionIds berilmasa — barcha savollar tartibi bilan.
 * Baholash serverda bajariladi, ball va DZF foydalanuvchiga qo'shiladi.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      deviceKey?: string;
      quizId?: string;
      answers?: number[];
      questionIds?: string[];
    } | null;

    const deviceKey = (body?.deviceKey ?? "").trim();
    const quizId = (body?.quizId ?? "").trim();
    const answers = Array.isArray(body?.answers) ? body!.answers : [];
    const questionIds = Array.isArray(body?.questionIds) ? body!.questionIds : [];

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

    // Baholanadigan savollar: client tanlagan idlar bo'yicha (tartibi ham shunday)
    let graded = quiz.questions;
    if (questionIds.length > 0) {
      const byId = new Map(quiz.questions.map((q) => [q.id, q]));
      const picked = questionIds
        .map((id) => byId.get(id))
        .filter((q): q is (typeof quiz.questions)[number] => Boolean(q));
      if (picked.length > 0) graded = picked;
    }

    // Baholash
    const correctIndexes: number[] = [];
    let score = 0;
    graded.forEach((q, i) => {
      correctIndexes.push(q.correctIndex);
      if (answers[i] === q.correctIndex) score++;
    });

    const total = graded.length;
    const pointsEarned = score * POINTS_PER_CORRECT;
    const dzfPerCorrectCents = DZF_CENTS[quiz.difficulty] ?? DZF_CENTS.middle!;
    const dzfEarnedCents = score * dzfPerCorrectCents;

    // Urinishni saqlash + ball va DZF ni qo'shish
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
      data: {
        points: { increment: pointsEarned },
        dzfCents: { increment: dzfEarnedCents },
      },
      select: { id: true, name: true, handle: true, avatar: true, points: true, dzfCents: true },
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
      dzfPer: dzfFromCents(dzfPerCorrectCents),
      dzfEarned: dzfFromCents(dzfEarnedCents),
      userDzf: dzfFromCents(updated.dzfCents),
      difficulty: quiz.difficulty,
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
