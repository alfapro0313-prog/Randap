/**
 * Tarix savollari generatori — faktlardan savollar yasaydi.
 * Har bir sinf bazasi (80 fakt) → har qiyinlik uchun 4 xil savol shakli:
 * oson: what→who, who→what, qachon, qayer;
 * o'rtacha: davr→hodisa, to'g'ri hukm, shaxs+yil→hodisa, joy→hodisa;
 * qiyin: natija, natija→hodisa, davrga tegishlilik, yil-hukm.
 */
import {
  type L3,
  type QGen,
  type Rng,
  dedupe,
  optionsFor,
  rngOf,
  shuffle,
} from "./gen-core";
import type { HistFact } from "./tarix-types";
import { TARIX_UZ_G7 } from "./tarix-uz-g7";
import { TARIX_UZ_G8 } from "./tarix-uz-g8";
import { TARIX_UZ_G9 } from "./tarix-uz-g9";
import { TARIX_UZ_G10 } from "./tarix-uz-g10";
import { TARIX_UZ_G11 } from "./tarix-uz-g11";
import { TARIX_JAHON_G7 } from "./tarix-jahon-g7";
import { TARIX_JAHON_G8 } from "./tarix-jahon-g8";
import { TARIX_JAHON_G9 } from "./tarix-jahon-g9";
import { TARIX_JAHON_G10 } from "./tarix-jahon-g10";
import { TARIX_JAHON_G11 } from "./tarix-jahon-g11";

const UZ_FACTS: Record<number, HistFact[]> = {
  7: TARIX_UZ_G7,
  8: TARIX_UZ_G8,
  9: TARIX_UZ_G9,
  10: TARIX_UZ_G10,
  11: TARIX_UZ_G11,
};

const JAHON_FACTS: Record<number, HistFact[]> = {
  7: TARIX_JAHON_G7,
  8: TARIX_JAHON_G8,
  9: TARIX_JAHON_G9,
  10: TARIX_JAHON_G10,
  11: TARIX_JAHON_G11,
};


/** Uchala tilde bir-biridan farq qiladigan qiymatlarni tanlash */
function pickDistinctL3(rng: Rng, values: L3[], n: number): L3[] {
  const seen = new Set<string>();
  const out: L3[] = [];
  for (const v of shuffle(rng, values)) {
    const key = `${v.uz}|${v.ru}|${v.en}`;
    if (seen.has(key) || seen.has(v.uz) || seen.has(v.ru) || seen.has(v.en)) continue;
    seen.add(key);
    seen.add(v.uz);
    seen.add(v.ru);
    seen.add(v.en);
    out.push(v);
    if (out.length >= n) break;
  }
  return out;
}

/* ---------------- OSON SHAKLLAR ---------------- */

/** E1: hodisa → kim */
function fWhoOfWhat(rng: Rng, pool: HistFact[], i: number): QGen {
  const f = pool[i] as HistFact;
  const distr = pool.filter((x) => x.who.uz !== f.who.uz).map((x) => x.who);
  const { o, correct } = optionsFor(rng, f.who, shuffle(rng, distr));
  return {
    t: {
      uz: `«${f.what.uz}» hodisasi qaysi shaxs yoki davlat bilan bog'liq?`,
      ru: `С каким человеком или государством связано событие «${f.what.ru}»?`,
      en: `Which person or state is associated with the event “${f.what.en}”?`,
    },
    o,
    correct,
  };
}

/** E2: kim → hodisa */
function fWhatOfWho(rng: Rng, pool: HistFact[], i: number): QGen {
  const f = pool[i] as HistFact;
  const distr = pool.filter((x) => x.who.uz !== f.who.uz).map((x) => x.what);
  const { o, correct } = optionsFor(rng, f.what, shuffle(rng, distr));
  return {
    t: {
      uz: `${f.who.uz}: quyidagi hodisalardan qaysi biri haqiqatda sodir bo'lgan?`,
      ru: `${f.who.ru}: какое из перечисленных событий действительно произошло?`,
      en: `${f.who.en}: which of the following events actually took place?`,
    },
    o,
    correct,
  };
}

/** E3: hodisa → qachon */
function fWhenOfWhat(rng: Rng, pool: HistFact[], i: number): QGen {
  const f = pool[i] as HistFact;
  const distr = pool.filter((x) => x.year !== f.year).map((x) => x.year);
  const { o, correct } = optionsFor(
    rng,
    { uz: f.year, ru: f.year, en: f.year },
    distr.map((y) => ({ uz: y, ru: y, en: y }))
  );
  return {
    t: {
      uz: `«${f.what.uz}» hodisasi qachon sodir bo'lgan?`,
      ru: `Когда произошло событие «${f.what.ru}»?`,
      en: `When did the event “${f.what.en}” take place?`,
    },
    o,
    correct,
  };
}

/** E4: hodisa → qayer */
function fWhereOfWhat(rng: Rng, pool: HistFact[], i: number): QGen {
  const f = pool[i] as HistFact;
  const distr = pool
    .filter((x) => x.where.uz !== f.where.uz)
    .map((x) => x.where);
  const { o, correct } = optionsFor(rng, f.where, shuffle(rng, distr));
  return {
    t: {
      uz: `«${f.what.uz}» hodisasi qayerda sodir bo'lgan?`,
      ru: `Где произошло событие «${f.what.ru}»?`,
      en: `Where did the event “${f.what.en}” take place?`,
    },
    o,
    correct,
  };
}

/* ---------------- O'RTACHA SHAKLLAR ---------------- */

/** M1: davr → hodisa */
function fWhatOfYear(rng: Rng, pool: HistFact[], i: number): QGen {
  const f = pool[i] as HistFact;
  const distr = pool
    .filter((x) => x.year !== f.year)
    .map((x) => x.what);
  const { o, correct } = optionsFor(rng, f.what, shuffle(rng, distr));
  return {
    t: {
      uz: `«${f.year}» davri: quyidagi hodisalardan qaysi biri shu davrga tegishli?`,
      ru: `Период «${f.year}»: к какому из перечисленных событий он относится?`,
      en: `The period “${f.year}”: which of the following events belongs to it?`,
    },
    o,
    correct,
  };
}

/** M2: to'g'ri hukm (shaxs almashtirilgan) */
function fTrueWho(rng: Rng, pool: HistFact[], i: number): QGen {
  const f = pool[i] as HistFact;
  const statement = (who: L3, year: string, what: L3): L3 => ({
    uz: `${who.uz} (${year}) — ${what.uz}.`,
    ru: `${who.ru} (${year}) — ${what.ru}.`,
    en: `${who.en} (${year}) — ${what.en}.`,
  });
  const others = pool.filter((x) => x.who.uz !== f.who.uz).map((x) => x.who);
  const sh = pickDistinctL3(rng, others, 3);
  const correctSt = statement(f.who, f.year, f.what);
  const all = shuffle(rng, [correctSt, ...sh.map((x) => statement(x, f.year, f.what))]);
  return {
    t: {
      uz: "To'g'ri hukmni tanlang.",
      ru: "Выберите верное утверждение.",
      en: "Choose the correct statement.",
    },
    o: all,
    correct: all.findIndex((x) => x.uz === correctSt.uz),
  };
}

/** M3: shaxs + yil → hodisa */
function fWhatOfWhoYear(rng: Rng, pool: HistFact[], i: number): QGen {
  const f = pool[i] as HistFact;
  const distr = pool.filter((x) => x.who.uz !== f.who.uz).map((x) => x.what);
  const { o, correct } = optionsFor(rng, f.what, shuffle(rng, distr));
  return {
    t: {
      uz: `${f.who.uz} (${f.year}-yillar): quyidagi hodisalardan qaysi biri uning faoliyati/hodisasiga tegishli?`,
      ru: `${f.who.ru} (${f.year} год): какое из перечисленных событий связано с ним?`,
      en: `${f.who.en} (${f.year}): which of the following events is associated with them?`,
    },
    o,
    correct,
  };
}

/** M4: joy → hodisa */
function fWhatOfWhere(rng: Rng, pool: HistFact[], i: number): QGen {
  const f = pool[i] as HistFact;
  const distr = pool
    .filter((x) => x.where.uz !== f.where.uz && x.who.uz !== f.who.uz)
    .map((x) => x.what);
  const { o, correct } = optionsFor(rng, f.what, shuffle(rng, distr));
  return {
    t: {
      uz: `«${f.where.uz}» joyi quyidagi hodisalardan qaysi biri bilan bog'liq?`,
      ru: `С каким из перечисленных событий связано место «${f.where.ru}»?`,
      en: `The place “${f.where.en}” is associated with which of the following events?`,
    },
    o,
    correct,
  };
}

/* ---------------- QIYIN SHAKLLAR ---------------- */

/** H1: hodisa → natija */
function fResultOfWhat(rng: Rng, pool: HistFact[], i: number): QGen {
  const f = pool[i] as HistFact;
  const distr = pool
    .filter((x) => x.result.uz !== f.result.uz)
    .map((x) => x.result);
  const { o, correct } = optionsFor(rng, f.result, shuffle(rng, distr));
  return {
    t: {
      uz: `«${f.what.uz}» hodisasining asosiy natijasi/ahamiyati qanday bo'ldi?`,
      ru: `Каким был основной итог события «${f.what.ru}»?`,
      en: `What was the main outcome of the event “${f.what.en}”?`,
    },
    o,
    correct,
  };
}

/** H2: natija → hodisa */
function fWhatOfResult(rng: Rng, pool: HistFact[], i: number): QGen {
  const f = pool[i] as HistFact;
  const distr = pool
    .filter((x) => x.result.uz !== f.result.uz)
    .map((x) => x.what);
  const { o, correct } = optionsFor(rng, f.what, shuffle(rng, distr));
  return {
    t: {
      uz: `«${f.result.uz}» — bu quyidagi hodisalardan qaysi birining natijasi?`,
      ru: `«${f.result.ru}» — это итог какого из перечисленных событий?`,
      en: `“${f.result.en}” — this was the outcome of which of the following events?`,
    },
    o,
    correct,
  };
}

/** H3: hodisa → davr (boshqacha ta'rif) */
function fPeriodOfWhat(rng: Rng, pool: HistFact[], i: number): QGen {
  const f = pool[i] as HistFact;
  const distr = pool.filter((x) => x.year !== f.year).map((x) => x.year);
  const { o, correct } = optionsFor(
    rng,
    { uz: f.year, ru: f.year, en: f.year },
    distr.map((y) => ({ uz: y, ru: y, en: y }))
  );
  return {
    t: {
      uz: `«${f.what.uz}» hodisasi qaysi davrga tegishli?`,
      ru: `К какому периоду относится событие «${f.what.ru}»?`,
      en: `To which period does the event “${f.what.en}” belong?`,
    },
    o,
    correct,
  };
}

/** H4: to'g'ri hukm (yil almashtirilgan) */
function fTrueYear(rng: Rng, pool: HistFact[], i: number): QGen {
  const f = pool[i] as HistFact;
  const statement = (year: string, who: L3, what: L3): L3 => ({
    uz: `${who.uz}: ${what.uz} — ${year}-yil.`,
    ru: `${who.ru}: ${what.ru} — ${year} год.`,
    en: `${who.en}: ${what.en} — ${year}.`,
  });
  const others = pool
    .filter((x) => x.year !== f.year && x.what.uz !== f.what.uz)
    .map((x) => ({ uz: x.year, ru: x.year, en: x.year }));
  const sh = pickDistinctL3(rng, others, 3);
  const correctSt = statement(f.year, f.who, f.what);
  const all = shuffle(rng, [
    correctSt,
    ...sh.map((y) => statement(y.uz, f.who, f.what)),
  ]);
  return {
    t: {
      uz: "To'g'ri hukmni tanlang.",
      ru: "Выберите верное утверждение.",
      en: "Choose the correct statement.",
    },
    o: all,
    correct: all.findIndex((x) => x.uz === correctSt.uz),
  };
}


/** VARIANtlar: bir xil mantiq, boshqacha ibora — bank sonini oshirish uchun */

function fWhoOfWhatV2(rng: Rng, pool: HistFact[], i: number): QGen {
  const f = pool[i] as HistFact;
  const distr = pool.filter((x) => x.who.uz !== f.who.uz).map((x) => x.who);
  const { o, correct } = optionsFor(rng, f.who, shuffle(rng, distr));
  return {
    t: {
      uz: `«${f.what.uz}» hodisasi kimning nomi bilan bog'liq?`,
      ru: `Имя какого человека связано с событием «${f.what.ru}»?`,
      en: `Whose name is associated with the event “${f.what.en}”?`,
    },
    o,
    correct,
  };
}

function fWhenOfWhatV2(rng: Rng, pool: HistFact[], i: number): QGen {
  const f = pool[i] as HistFact;
  const distr = pool.filter((x) => x.year !== f.year).map((x) => x.year);
  const { o, correct } = optionsFor(
    rng,
    { uz: f.year, ru: f.year, en: f.year },
    distr.map((y) => ({ uz: y, ru: y, en: y }))
  );
  return {
    t: {
      uz: `Qaysi yilda «${f.what.uz}» hodisasi sodir bo'lgan?`,
      ru: `В каком году произошло событие «${f.what.ru}»?`,
      en: `In which year did the event “${f.what.en}” occur?`,
    },
    o,
    correct,
  };
}

function fWhenOfWhatV3(rng: Rng, pool: HistFact[], i: number): QGen {
  const f = pool[i] as HistFact;
  const distr = pool.filter((x) => x.year !== f.year).map((x) => x.year);
  const { o, correct } = optionsFor(
    rng,
    { uz: f.year, ru: f.year, en: f.year },
    distr.map((y) => ({ uz: y, ru: y, en: y }))
  );
  return {
    t: {
      uz: `«${f.what.uz}» hodisasi qaysi yilda bo'lib o'tgan?`,
      ru: `В каком году состоялось событие «${f.what.ru}»?`,
      en: `In what year did the event “${f.what.en}” take place?`,
    },
    o,
    correct,
  };
}

/** M: to'g'ri hukm — hodisa almashtirilgan */
function fTrueWhat(rng: Rng, pool: HistFact[], i: number): QGen {
  const f = pool[i] as HistFact;
  const statement = (what: L3, year: string, who: L3): L3 => ({
    uz: `${who.uz} (${year}): ${what.uz}.`,
    ru: `${who.ru} (${year}): ${what.ru}.`,
    en: `${who.en} (${year}): ${what.en}.`,
  });
  const others = pool
    .filter((x) => x.what.uz !== f.what.uz && x.who.uz !== f.who.uz)
    .map((x) => x.what);
  const sh = pickDistinctL3(rng, others, 3);
  const correctSt = statement(f.what, f.year, f.who);
  const all = shuffle(rng, [correctSt, ...sh.map((x) => statement(x, f.year, f.who))]);
  return {
    t: {
      uz: "To'g'ri hukmni tanlang.",
      ru: "Выберите верное утверждение.",
      en: "Choose the correct statement.",
    },
    o: all,
    correct: all.findIndex((x) => x.uz === correctSt.uz),
  };
}

function fResultOfWhatV2(rng: Rng, pool: HistFact[], i: number): QGen {
  const f = pool[i] as HistFact;
  const distr = pool
    .filter((x) => x.result.uz !== f.result.uz)
    .map((x) => x.result);
  const { o, correct } = optionsFor(rng, f.result, shuffle(rng, distr));
  return {
    t: {
      uz: `«${f.what.uz}» hodisasi nimaga olib keldi?`,
      ru: `К чему привело событие «${f.what.ru}»?`,
      en: `What did the event “${f.what.en}” lead to?`,
    },
    o,
    correct,
  };
}

/** H: kim → yil */
function fYearOfWho(rng: Rng, pool: HistFact[], i: number): QGen {
  const f = pool[i] as HistFact;
  const distr = pool.filter((x) => x.year !== f.year).map((x) => x.year);
  const { o, correct } = optionsFor(
    rng,
    { uz: f.year, ru: f.year, en: f.year },
    distr.map((y) => ({ uz: y, ru: y, en: y }))
  );
  return {
    t: {
      uz: `«${f.who.uz}» faoliyati/hodisasi qaysi yillarga to'g'ri keladi?`,
      ru: `На какие годы приходится деятельность «${f.who.ru}» / связанное с ним событие?`,
      en: `To which years does the activity of “${f.who.en}” (or their event) belong?`,
    },
    o,
    correct,
  };
}


function fWhoOfWhatV3(rng: Rng, pool: HistFact[], i: number): QGen {
  const f = pool[i] as HistFact;
  const distr = pool.filter((x) => x.who.uz !== f.who.uz).map((x) => x.who);
  const { o, correct } = optionsFor(rng, f.who, shuffle(rng, distr));
  return {
    t: {
      uz: `Tarixda «${f.what.uz}» hodisasi bilan mashhur shaxs/davlat qaysi?`,
      ru: `Какой деятель/государство известен событием «${f.what.ru}»?`,
      en: `Which person/state is famous for the event “${f.what.en}”?`,
    },
    o,
    correct,
  };
}

function fWhereOfWhatV2(rng: Rng, pool: HistFact[], i: number): QGen {
  const f = pool[i] as HistFact;
  const distr = pool
    .filter((x) => x.where.uz !== f.where.uz)
    .map((x) => x.where);
  const { o, correct } = optionsFor(rng, f.where, shuffle(rng, distr));
  return {
    t: {
      uz: `«${f.what.uz}» hodisasi qayerda yuz bergan?`,
      ru: `На какой территории произошло событие «${f.what.ru}»?`,
      en: `On what territory did the event “${f.what.en}” occur?`,
    },
    o,
    correct,
  };
}

function fWhoOfWhatV4(rng: Rng, pool: HistFact[], i: number): QGen {
  const f = pool[i] as HistFact;
  const distr = pool.filter((x) => x.who.uz !== f.who.uz).map((x) => x.who);
  const { o, correct } = optionsFor(rng, f.who, shuffle(rng, distr));
  return {
    t: {
      uz: `Quyidagi shaxslardan qaysi biri «${f.what.uz}» hodisasida qatnashgan yoki uni amalga oshirgan?`,
      ru: `Какой из перечисленных деятелей участвовал в событии «${f.what.ru}» или осуществил его?`,
      en: `Which of the following figures took part in or carried out the event “${f.what.en}”?`,
    },
    o,
    correct,
  };
}

function fWhereOfWhatV3(rng: Rng, pool: HistFact[], i: number): QGen {
  const f = pool[i] as HistFact;
  const distr = pool
    .filter((x) => x.where.uz !== f.where.uz)
    .map((x) => x.where);
  const { o, correct } = optionsFor(rng, f.where, shuffle(rng, distr));
  return {
    t: {
      uz: `«${f.what.uz}» hodisasi joyi sifatida qaysi mamlakat/shahar tarixda mashhur?`,
      ru: `Какое место/страна известно как место события «${f.what.ru}»?`,
      en: `Which place/country is known as the site of the event “${f.what.en}”?`,
    },
    o,
    correct,
  };
}

/** Tarix bankini yig'ish: qiyinlik uchun 4 xil shakl × faktlar */
function buildHistoryBank(
  key: string,
  pool: HistFact[],
  forms: Array<(rng: Rng, p: HistFact[], i: number) => QGen>
): QGen[] {
  const rng = rngOf(key);
  // what.uz bo'yicha takrorlarni chiqarib tashlash
  const seen = new Set<string>();
  const clean = pool.filter((f) => {
    if (seen.has(f.what.uz)) return false;
    seen.add(f.what.uz);
    return true;
  });
  const out: QGen[] = [];
  for (let i = 0; i < clean.length; i++) {
    for (const form of forms) {
      out.push(form(rng, clean, i));
    }
  }
  return dedupe(out);
}

export function genHistoryQuiz(kind: "uz" | "jahon", grade: number, dif: string): QGen[] {
  const pool = (kind === "uz" ? UZ_FACTS : JAHON_FACTS)[grade] ?? [];
  const key = `hist-${kind}-${grade}-${dif}`;
  if (dif === "easy") {
    return buildHistoryBank(key, pool, [fWhoOfWhat, fWhatOfWho, fWhenOfWhat, fWhereOfWhat, fWhoOfWhatV2, fWhenOfWhatV2]);
  }
  if (dif === "middle") {
    return buildHistoryBank(key, pool, [fWhatOfYear, fTrueWho, fWhatOfWhoYear, fWhatOfWhere, fWhenOfWhatV3, fTrueWhat, fWhereOfWhatV2, fWhoOfWhatV3]);
  }
  return buildHistoryBank(key, pool, [fResultOfWhat, fWhatOfResult, fPeriodOfWhat, fTrueYear, fResultOfWhatV2, fYearOfWho, fWhoOfWhatV4, fWhereOfWhatV3]);
}
