/**
 * RUS TILI savollar generatori — 3 ta haqiqiy daraja testi:
 *   OSON    (quiz_rus_oson)    — A1: kundalik so'zlar, asosiy grammatika
 *   O'RTACHA(quiz_rus_ortacha) — A2+/B1: kelishiklar, fe'l turlari, harakat fe'llari
 *   QIYIN   (quiz_rus_qiyin)   — C1-C2: qatnash/avalg'ilosh, paronimlar,
 *                                frazeologizmlar, kitobiy leksika — juda juda qiyin
 * 3 test o'zaro pool va bloklarni UMUMAN almashmaydi (takror yo'q),
 * qo'shimcha himoya: randap-banks.ts dagi oilaviy dedupe.
 */
import {
  dedupe,
  optionsFor,
  rngOf,
  shuffle,
  same,
  type L3,
  type QGen,
} from "./gen-core";
import {
  RUS_ARCHAIC,
  RUS_EASY_GR,
  RUS_EASY_WORDS,
  RUS_HARD_GR,
  RUS_HARD_WORDS,
  RUS_IDIOM,
  RUS_MID_GR,
  RUS_MID_WORDS,
  RUS_PARONYM,
  type RG,
  type RID,
} from "./gen-rus-data";

/* ================= VOKABULARY ================= */

type Word = { ru: string; uz: string; en: string };

/** ruscha so'z → ma'no savol matnlari (javoblar har tillarda o'zbekcha) */
const FWD = {
  uz: [
    (ru: string) => `«${ru}» so'zining o'zbekcha ma'nosi qaysi?`,
    (ru: string) => `Ruscha so'zning ma'nosini toping: ${ru} — ___`,
    (ru: string) => `«${ru}» ruscha so'zi o'zbekchada nimani anglatadi?`,
  ],
  ru: [
    (ru: string) => `Выберите узбекский перевод слова «${ru}».`,
    (ru: string) => `Как это слово переводится на узбекский: ${ru}?`,
    (ru: string) => `Найдите узбекский эквивалент: ${ru}.`,
  ],
  en: [
    (ru: string) => `Which is the Uzbek meaning of the Russian word “${ru}”?`,
    (ru: string) => `Translate into Uzbek: ${ru} — ___`,
    (ru: string) => `What does the Russian word “${ru}” mean in Uzbek?`,
  ],
};

/** o'zbekcha so'z → ruscha so'z (javoblar har tillarda ruscha) */
const REV = {
  uz: [
    (uz: string) => `«${uz}» tushunchasining ruscha nomi qaysi?`,
    (uz: string) => `${uz} — rus tilida qanday yoziladi?`,
    (uz: string) => `${uz} so'zining ruscha muqobilini tanlang.`,
  ],
  ru: [
    (uz: string) => `Выберите русский перевод: ${uz}.`,
    (uz: string) => `Как это слово пишется по-русски: ${uz}?`,
    (uz: string) => `Найдите русский эквивалент: ${uz}.`,
  ],
  en: [
    (uz: string) => `What is the Russian term for “${uz}”?`,
    (uz: string) => `How do you write “${uz}” in Russian?`,
    (uz: string) => `Choose the Russian equivalent of “${uz}”.`,
  ],
};

function vocabBank(prefix: string, pool: Word[]): QGen[] {
  const out: QGen[] = [];
  pool.forEach((w, wi) => {
    const others = pool
      .filter((x) => x.ru !== w.ru && x.uz !== w.uz)
      .map((x) => ({ uz: x.uz, ru: x.uz, en: x.uz }));
    const othersRev = pool
      .filter((x) => x.ru !== w.ru && x.uz !== w.uz)
      .map((x) => ({ uz: x.ru, ru: x.ru, en: x.ru }));
    for (let k = 0; k < 6; k++) {
      const r = rngOf(`${prefix}:${w.ru}:${k}`);
      const fwd = k % 2 === 0;
      const ti = k % 3;
      if (fwd) {
        const correct: L3 = { uz: w.uz, ru: w.uz, en: w.uz };
        const { o, correct: ci } = optionsFor(r, correct, shuffle(r, others));
        out.push({
          t: {
            uz: FWD.uz[ti]!(w.ru),
            ru: FWD.ru[ti]!(w.ru),
            en: FWD.en[ti]!(w.ru),
          },
          o,
          correct: ci,
        });
      } else {
        const correct: L3 = { uz: w.ru, ru: w.ru, en: w.ru };
        const { o, correct: ci } = optionsFor(r, correct, shuffle(r, othersRev));
        out.push({
          t: {
            uz: REV.uz[ti]!(w.uz),
            ru: REV.ru[ti]!(w.uz),
            en: REV.en[ti]!(w.uz),
          },
          o,
          correct: ci,
        });
      }
    }
  });
  return out;
}

/* ================= GRAMMATIKA ================= */

/** Grammatika bloki uchun izohlar (3 til) */
const N = {
  easy1: { uz: "boshlang'ich grammatika", ru: "начальный уровень", en: "basic grammar" },
  easy2: { uz: "asosiy qoidalar", ru: "базовые правила", en: "core rules" },
  mid1: { uz: "o'rta daraja grammatika", ru: "грамматика среднего уровня", en: "intermediate grammar" },
  mid2: { uz: "fe'l shakllari va kelishiklar", ru: "формы глагола и падежи", en: "verb forms and cases" },
  hard1: { uz: "yuqori daraja: qatnash va avalg'ilosh", ru: "высокий уровень: причастие и деепричастие", en: "advanced: participles and adverbial participles" },
  hard2: { uz: "boshqaruv va murakkab qo'shimchalar", ru: "управление и сложные конструкции", en: "government and complex structures" },
};

function grammarQs(prefix: string, note: L3, items: RG[]): QGen[] {
  return items.map((it, i) => {
    const r = rngOf(`${prefix}:${i}:${it.a}`);
    const { o, correct } = optionsFor(r, same(it.a), it.d.map((x) => same(x)));
    return {
      t: {
        uz: `Bo'sh joyni to'ldiring: «${it.s}» (${note.uz})`,
        ru: `Заполните пропуск: «${it.s}» (${note.ru})`,
        en: `Fill in the blank: “${it.s}” (${note.en})`,
      },
      o,
      correct,
    };
  });
}

function idiomQs(prefix: string, items: RID[]): QGen[] {
  return items.map((it, i) => {
    const r = rngOf(`${prefix}:${i}:${it.ru}`);
    const { o, correct } = optionsFor(r, same(it.m), it.d.map((x) => same(x)));
    return {
      t: {
        uz: `Ruscha «${it.ru}» iborasi nimani anglatadi?`,
        ru: `Что означает выражение «${it.ru}»?`,
        en: `What does the Russian idiom “${it.ru}” mean?`,
      },
      o,
      correct,
    };
  });
}

function spellingQs(prefix: string, items: RG[]): QGen[] {
  return items.map((it, i) => {
    const r = rngOf(`${prefix}:${i}:${it.a}`);
    const { o, correct } = optionsFor(r, same(it.a), it.d.map((x) => same(x)));
    return {
      t: {
        uz: `Rus tili bilimingizni tekshiring: ${it.s}`,
        ru: `Проверьте свои знания русского языка: ${it.s}`,
        en: `Test your Russian: ${it.s}`,
      },
      o,
      correct,
    };
  });
}

/* ================= YAKUNIY GENERATORLAR ================= */

/** OSON (A1): ~48 so'z × 6 shakl + 44 grammatika ≈ 330 savol */
export function genRusOson(): QGen[] {
  const rng = rngOf("rus-oson-mix");
  const all = [
    ...vocabBank("rus-e", RUS_EASY_WORDS),
    ...grammarQs("rus-e-gr1", N.easy1, RUS_EASY_GR.slice(0, 22)),
    ...grammarQs("rus-e-gr2", N.easy2, RUS_EASY_GR.slice(22)),
  ];
  return dedupe(shuffle(rng, all));
}

/** O'RTACHA (A2+/B1): ~48 so'z × 6 shakl + 52 grammatika ≈ 340 savol */
export function genRusOrtacha(): QGen[] {
  const rng = rngOf("rus-mid-mix");
  const all = [
    ...vocabBank("rus-m", RUS_MID_WORDS),
    ...grammarQs("rus-m-gr1", N.mid1, RUS_MID_GR.slice(0, 26)),
    ...grammarQs("rus-m-gr2", N.mid2, RUS_MID_GR.slice(26)),
  ];
  return dedupe(shuffle(rng, all));
}

/** QIYIN (C1-C2): ~40 so'z × 6 shakl + 40 qiyin grammatika + 21 paronim
 * + 18 frazeologizm + 15 eskicha/imlo ≈ 334 savol — juda juda qiyin */
export function genRusQiyin(): QGen[] {
  const rng = rngOf("rus-hard-mix");
  const all = [
    ...vocabBank("rus-h", RUS_HARD_WORDS),
    ...grammarQs("rus-h-gr1", N.hard1, RUS_HARD_GR.slice(0, 20)),
    ...grammarQs("rus-h-gr2", N.hard2, RUS_HARD_GR.slice(20)),
    ...grammarQs("rus-h-par", N.hard2, RUS_PARONYM),
    ...idiomQs("rus-h-idiom", RUS_IDIOM),
    ...spellingQs("rus-h-arch", RUS_ARCHAIC),
  ];
  return dedupe(shuffle(rng, all));
}
