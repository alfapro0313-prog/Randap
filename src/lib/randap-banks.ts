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
import { genVeryHard1, genVeryHard2 } from "./banks/gen-veryhard";
import type { EngBank } from "./banks/gen-ingliz";

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

/* Ingliz tili: CEFR + IELTS */
const CEFR: Array<[string, EngBank]> = [
  ["quiz_cefr_a1", "a1"],
  ["quiz_cefr_a2", "a2"],
  ["quiz_cefr_b1", "b1"],
  ["quiz_cefr_b2", "b2"],
];
for (const [id, lvl] of CEFR) MAP[id] = genIngliz(lvl);
MAP["quiz_ielts_easy"] = genIngliz("ielts-e");
MAP["quiz_ielts_middle"] = genIngliz("ielts-m");
MAP["quiz_ielts_hard"] = genIngliz("ielts-h");

/* VERY HARD (C2) — 300 savolga to'ldiriladigan super qiyin ingliz testlari */
MAP["quiz_vhard_1"] = genVeryHard1();
MAP["quiz_vhard_2"] = genVeryHard2();

/* Listening (audio tinglash) */
for (const d of DIFS) {
  MAP[`quiz_listening_${d}`] = genListening(d);
}

export { BANK_TARGET };

/** Barcha generatsiya qilingan savollar (quizId bo'yicha) */
export const GEN_QUESTIONS: Record<string, QGen[]> = MAP;
