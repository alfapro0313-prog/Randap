/**
 * Savollar banklari xaritasi: quizId → generatsiya qilingan savollar (3 til).
 * Seed mavjud savollar sonini hisoblab, 300 taga to'ldiradi:
 *   need = BANK_TARGET - mavjudSoni; GEN[quizId].slice(0, need)
 */
import { BANK_TARGET, type QGen } from "./banks/gen-core";
import { genHistoryQuiz } from "./banks/gen-history";
import { genFizika, genKimyo, genMatematika } from "./banks/gen-matfizkim";
import { genGeografiya } from "./banks/gen-geo";
import { genAdabiyot, genOnatili } from "./banks/gen-til-adab";
import { genIngliz, genListening } from "./banks/gen-ingliz";
import {
  genIeltsEasy2,
  genIeltsHard2,
  genIeltsMiddle2,
  genRealB1,
  genRealB2,
} from "./banks/gen-ingliz-b1b2";
import { genListeningVHard1, genListeningVHard2 } from "./banks/gen-listening-vhard";
import { genVeryHard1, genVeryHard2 } from "./banks/gen-veryhard";
import {
  genRusOson,
  genRusOrtacha,
  genRusQiyin,
} from "./banks/gen-rus";

const DIFS = ["easy", "middle", "hard"] as const;

const MAP: Record<string, QGen[]> = {};

/* Tarix: O'zbekiston va jahon (7-11 sinf × 3 qiyinlik) */
for (const g of [7, 8, 9, 10, 11]) {
  for (const d of DIFS) {
    MAP[`quiz_uz_${g}_${d}`] = genHistoryQuiz("uz", g, d);
    MAP[`quiz_jahon_${g}_${d}`] = genHistoryQuiz("jahon", g, d);
  }
}

/* Matematika, fizika, kimyo, geografiya, ona tili, adabiyot */
for (const d of DIFS) {
  MAP[`quiz_mate_${d}`] = genMatematika(d);
  MAP[`quiz_fiz_${d}`] = genFizika(d);
  MAP[`quiz_kim_${d}`] = genKimyo(d);
  MAP[`quiz_geo_${d}`] = genGeografiya(d);
  MAP[`quiz_til_${d}`] = genOnatili(d);
  MAP[`quiz_adab_${d}`] = genAdabiyot(d);
}

/* Ingliz tili: CEFR + IELTS
 *   A1/A2 — gen-ingliz.ts (o'z bloklari);
 *   B1/B2 — HAQIQIY daraja banklari (gen-ingliz-b1b2.ts);
 *   IELTS — har bir darajaga o'z so'z pooli va bloklari (takror yo'q). */
MAP["quiz_cefr_a1"] = genIngliz("a1");
MAP["quiz_cefr_a2"] = genIngliz("a2");
MAP["quiz_cefr_b1"] = genRealB1();
MAP["quiz_cefr_b2"] = genRealB2();
MAP["quiz_ielts_easy"] = genIeltsEasy2();
MAP["quiz_ielts_middle"] = genIeltsMiddle2();
MAP["quiz_ielts_hard"] = genIeltsHard2();

/* VERY HARD (C2) — 300 savolga to'ldiriladigan super qiyin ingliz testlari */
MAP["quiz_vhard_1"] = genVeryHard1();
MAP["quiz_vhard_2"] = genVeryHard2();

/* VERY HARD Listening (C2) — 300 savolli super qiyin tinglab tushunish testlari */
MAP["quiz_listening_vhard_1"] = genListeningVHard1();
MAP["quiz_listening_vhard_2"] = genListeningVHard2();

/* Listening (audio tinglash) */
for (const d of DIFS) {
  MAP[`quiz_listening_${d}`] = genListening(d);
}

/* RUS TILI — haqiqiy darajalar: oson (A1), o'rtacha (A2+/B1), qiyin (C1-C2) */
MAP["quiz_rus_oson"] = genRusOson();
MAP["quiz_rus_ortacha"] = genRusOrtacha();
MAP["quiz_rus_qiyin"] = genRusQiyin();

export { BANK_TARGET };

/* Ingliz oilasi bo'yicha global cross-quiz dedupe:
 * bir xil savol (matn + javob + audio) ikki xil testda qayta tushmaydi.
 * Tarif: audio (listening) ham kalitga kiritilgan. */
const ENGLISH_FAMILY_ORDER = [
  "quiz_cefr_a1",
  "quiz_cefr_a2",
  "quiz_cefr_b1",
  "quiz_cefr_b2",
  "quiz_ielts_easy",
  "quiz_ielts_middle",
  "quiz_ielts_hard",
  "quiz_listening_easy",
  "quiz_listening_middle",
  "quiz_listening_hard",
  "quiz_listening_vhard_1",
  "quiz_listening_vhard_2",
  "quiz_vhard_1",
  "quiz_vhard_2",
];

const seenGlobal = new Set<string>();
for (const quizId of ENGLISH_FAMILY_ORDER) {
  const arr = MAP[quizId];
  if (!arr) continue;
  MAP[quizId] = arr.filter((q) => {
    const correctVal = q.o[q.correct]?.uz ?? "";
    const key = `${q.t.uz}|${correctVal}|${q.audio ?? ""}`;
    if (seenGlobal.has(key)) return false;
    seenGlobal.add(key);
    return true;
  });
}

/* Tarix oilasi — sinflar/darajalar orasida bir xil savol qaytmaydi */
const HISTORY_ORDER: string[] = [];
for (const kind of ["uz", "jahon"] as const) {
  for (const g of [7, 8, 9, 10, 11]) {
    for (const d of DIFS) HISTORY_ORDER.push(`quiz_${kind}_${g}_${d}`);
  }
}
for (const quizId of HISTORY_ORDER) {
  const arr = MAP[quizId];
  if (!arr) continue;
  MAP[quizId] = arr.filter((q) => {
    const correctVal = q.o[q.correct]?.uz ?? "";
    const key = `${q.t.uz}|${correctVal}`;
    if (seenGlobal.has(key)) return false;
    seenGlobal.add(key);
    return true;
  });
}

/* Fanlar oilasi (matematika, fizika, kimyo, geografiya, ona tili, adabiyot):
 * oson/o'rtacha/qiyin darajalar orasida bir xil savol qaytmaydi */
const SCIENCE_ORDER = [
  "quiz_mate_easy", "quiz_mate_middle", "quiz_mate_hard",
  "quiz_fiz_easy", "quiz_fiz_middle", "quiz_fiz_hard",
  "quiz_kim_easy", "quiz_kim_middle", "quiz_kim_hard",
  "quiz_geo_easy", "quiz_geo_middle", "quiz_geo_hard",
  "quiz_til_easy", "quiz_til_middle", "quiz_til_hard",
  "quiz_adab_easy", "quiz_adab_middle", "quiz_adab_hard",
];
for (const quizId of SCIENCE_ORDER) {
  const arr = MAP[quizId];
  if (!arr) continue;
  MAP[quizId] = arr.filter((q) => {
    const correctVal = q.o[q.correct]?.uz ?? "";
    const key = `${q.t.uz}|${correctVal}`;
    if (seenGlobal.has(key)) return false;
    seenGlobal.add(key);
    return true;
  });
}

/* Rus tili oilasi — 3 test bir-biridan mutlaqo farqli */
const RUSSIAN_ORDER = [
  "quiz_rus_oson",
  "quiz_rus_ortacha",
  "quiz_rus_qiyin",
];
for (const quizId of RUSSIAN_ORDER) {
  const arr = MAP[quizId];
  if (!arr) continue;
  MAP[quizId] = arr.filter((q) => {
    const correctVal = q.o[q.correct]?.uz ?? "";
    const key = `${q.t.uz}|${correctVal}`;
    if (seenGlobal.has(key)) return false;
    seenGlobal.add(key);
    return true;
  });
}

/** Barcha generatsiya qilingan savollar (quizId bo'yicha) */
export const GEN_QUESTIONS: Record<string, QGen[]> = MAP;
