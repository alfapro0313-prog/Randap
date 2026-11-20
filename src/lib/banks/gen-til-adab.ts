/**
 * Ona tili va adabiyot savollari generatori.
 * Ona tili: harflar, sinonim/antonim juftliklari, imlo, so'z turkumlari.
 * Adabiyot: adib-asar juftliklari bazasidan savollar (uz/rus/jahon adabiyoti).
 */
import {
  dedupe,
  optionsFor,
  rngOf,
  same,
  shuffle,
  type L3,
  type QGen,
  type Rng,
} from "./gen-core";

/* ================= ONA TILI ================= */

const UNLI = ["a", "e", "i", "o", "u", "o'"] as const;
const UNDOSH = ["b", "d", "f", "g", "g'", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "x", "y", "z", "sh", "ch", "ng"] as const;

/** Unli harflarni sanash (o' — bitta harf hisoblanadi) */
function countUnli(w: string): number {
  const s = w.replace(/o'/g, "_").replace(/g'/g, "&");
  let n = 0;
  for (const ch of ["a", "e", "i", "o", "u", "_"]) {
    n += s.split(ch).length - 1;
  }
  return n;
}

const OAT_WORDS = [
  "maktab", "kitob", "gul", "daryo", "shahar", "non", "quyosh", "oy", "yulduz",
  "til", "ona", "otam", "qalam", "daftar", "sumka", "ko'za", "ro'yxat",
  "o'zbek", "yoz", "o'qish", "pishloq", "qishloq", "ko'p", "yo'l", "bog'", "ish",
  "tuz", "nonvoy", "olma", "shaftoli", "uzum", "tarvuz", "qovun", "guruch", "yog'",
  "temir", "tosh", "qum", "muz", "olov", "suv", "kecha", "ertalab", "bahor",
  "yozgi", "qish", "kuz", "tong", "kechqurun", "dengiz", "cho'l", "tog'", "o'rmon",
];

type Pair = [string, string];
const SYNONYMS: Pair[] = [
  ["katta", "ulkan"], ["kichik", "mayda"], ["tez", "jadal"], ["sekin", "sust"],
  ["go'zal", "chiroyli"], ["aqlli", "dono"], ["dono", "hikmatli"], ["jasur", "mard"],
  ["mehribon", "shafqatli"], ["baxtli", "omadli"], ["boy", "serbay"], ["qashshoq", "kambag'al"],
  ["mehnatkash", "tirishqoq"], ["do'st", "o'rtoq"], ["quvonch", "shodlik"], ["qayg'u", "g'am"],
  ["kam", "oz"], ["ko'p", "serob"], ["xursand", "shod"], ["ajoyib", "g'aroyib"],
  ["mo'jizali", "sehrli"], ["qimmatbaho", "bebaho"], ["ish", "mehnat"], ["yordam", "ko'mak"],
  ["suhbat", "gaplashuv"], ["sayohat", "safar"], ["bayram", "id"], ["qo'rqinch", "dahshat"],
  ["g'urur", "faxr"], ["dahshat", "qo'rquv"], ["xotirjam", "tinch"], ["tor", "tang"],
  ["sermo'l", "boy-badavlat"], ["ziyoli", "ma'rifatli"], ["maqtov", "olqish"], ["g'alaba", "zafar"],
  ["vaqt", "zamon"], ["tilak", "niyat"],
  ["boshliq", "rahbar"], ["saboq", "dars"], ["kundalik", "jurnal"],
  ["shifo", "davo"], ["kelajak", "istiqbol"],
  ["mamlakat", "davlat"], ["xalq", "el"], ["ota-bobo", "ajdod"], ["bola", "farzand"],
  ["layoqat", "qobiliyat"], ["san'at", "hunar"],
  ["qat'iyat", "qat'iylik"], ["shukronalik", "minnatdorchilik"], ["sabr", "chidam"], ["taqdir", "qismat"],
  ["nomer", "raqam"], ["hisob", "sanoq"], ["izoh", "sharh"],
  ["matn", "yozuv"], ["nutq", "so'zlashuv"],
  ["qo'shiq", "ashula"], ["raqs", "o'yin"], ["musiqa", "cholg'u"],
  ["esdalik", "yodgorlik"], ["tuhfa", "sovg'a"],
  ["adolat", "insaf"], ["vatan", "yurt"], ["tinchlik", "osoyishtalik"],
  ["fazilat", "yaxshi xulq"], ["xasis", "baxil"], ["sahiy", "saxovatli"],
  ["alohida", "yakka"], ["erk", "erkinlik"], ["qudratli", "kuchli"], ["baxt", "omad"],
  ["g'amgin", "xafa"], ["shirin", "mazali"], ["hiyla", "ayla"], ["ilohim", "umid qilaman"],
];

const ANTONYMS: Pair[] = [
  ["katta", "kichik"], ["baland", "past"], ["tez", "sekin"], ["issiq", "sovuq"],
  ["yorug'", "qorong'i"], ["kun", "tun"], ["yaxshi", "yomon"], ["boy", "kambag'al"],
  ["jasur", "qo'rqaqoq"], ["aqlli", "ahmoq"], ["mehribon", "qo'pol"], ["mehnatkash", "langarchi"],
  ["keng", "tor"], ["qattiq", "yumshoq"], ["og'ir", "yengil"], ["uzoq", "yaqin"],
  ["do'st", "dushman"], ["bor", "yo'q"], ["olmoq", "bermoq"], ["kulmoq", "yig'lamoq"],
  ["tinch", "bezovta"], ["toza", "iflos"], ["kam", "ko'p"], ["qimmat", "arzon"],
  ["chuqur", "sayoz"], ["g'alaba", "mag'lubiyat"], ["baxt", "baxtsizlik"], ["quvonch", "qayg'u"],
  ["hayot", "o'lim"], ["yoz", "qish"], ["kuz", "bahor"], ["haqiqat", "yolg'on"],
  ["adolat", "nohaqlik"], ["tinchlik", "urush"], ["kech", "erta"], ["xushbo'y", "badbo'y"],
  ["yig'ish", "sochish"], ["topmoq", "yo'qotmoq"], ["eslatmoq", "unutmoq"], ["ko'tarmoq", "tushirmoq"],
  ["qo'shmoq", "ayirish"], ["boshlamoq", "tugatmoq"], ["ochmoq", "yopmoq"], ["old", "orqa"],
  ["o'ng", "chap"], ["boshlang'ich", "yakunlovchi"], ["ilk", "oxirgi"],
  ["avval", "keyin"], ["ich", "tashqari"], ["yuqori", "quyi"], ["sharq", "g'arb"],
  ["shimol", "janub"], ["to'q", "och"], ["bo'sh", "to'la"],
  ["qalin", "ingichka"], ["bemalol", "qiyin"], ["bepoytak", "zarur"], ["o'chmoq", "yoqmoq"],
  ["sovutmoq", "qizmoq"], ["o'smoq", "pasaymoq"], ["yugurmoq", "to'xtamoq"],
  ["sotib olmoq", "sotmoq"], ["olmoq", "qaytarmoq"], ["bermoq", "olmoq"],
  ["boshlamoq", "tugatmoq"], ["yig'moq", "tarqatmoq"], ["kichiklamoq", "ulug'lamoq"],
  ["ertalab", "kechqurun"], ["tong", "shom"], ["bahor", "qish"], ["g'alaba", "yengilish"],
  ["kuchli", "nochor"], ["omadli", "baxtsiz"], ["sodiqlik", "xiyonat"],
];

type SpellPair = [string, string];
const SPELLING: SpellPair[] = [
  ["a'lo", "alo"], ["ro'yxat", "royxat"], ["g'oya", "goya"], ["o'rtoq", "ortoq"],
  ["qo'shiq", "qoshiq"], ["so'z", "soz"], ["ko'p", "kop"], ["yo'l", "yol"],
  ["g'azal", "gazal"], ["o'qituvchi", "oqituvchi"], ["bo'ron", "boron"], ["so'roq", "soroq"],
  ["ko'krak", "kokrak"], ["g'olib", "golib"], ["o'yin", "oyin"], ["ta'lim", "talim"],
  ["san'at", "sanat"], ["e'lon", "elon"], ["me'yor", "meyor"],
  ["qishloq", "kishloq"], ["pishloq", "pishlok"],
  ["bog'", "bog"], ["o'qish", "oqish"], ["gulshan", "gulshon"], ["xursand", "xurshand"],
  ["maqtansaq", "maqtanzaq"], ["mustaqil", "mustahil"], ["samarali", "samorali"],
];

type WordClass = { w: string; cls: "ot" | "sifat" | "fe'l" | "ravish" | "son" | "olmosh" };
const WORDS: WordClass[] = [
  { w: "kitob", cls: "ot" }, { w: "maktab", cls: "ot" }, { w: "do'st", cls: "ot" },
  { w: "quyosh", cls: "ot" }, { w: "shahar", cls: "ot" }, { w: "non", cls: "ot" },
  { w: "suv", cls: "ot" }, { w: "gul", cls: "ot" }, { w: "cho'l", cls: "ot" },
  { w: "daryo", cls: "ot" }, { w: "olma", cls: "ot" }, { w: "o'yin", cls: "ot" },
  { w: "sevgi", cls: "ot" }, { w: "bilim", cls: "ot" }, { w: "vaqt", cls: "ot" },
  { w: "pul", cls: "ot" }, { w: "it", cls: "ot" }, { w: "mushuk", cls: "ot" },
  { w: "temir", cls: "ot" }, { w: "tuz", cls: "ot" }, { w: "chiroyli", cls: "sifat" },
  { w: "katta", cls: "sifat" }, { w: "yaxshi", cls: "sifat" }, { w: "tez", cls: "sifat" },
  { w: "baxtli", cls: "sifat" }, { w: "aqlli", cls: "sifat" }, { w: "ko'rkam", cls: "sifat" },
  { w: "quvnoq", cls: "sifat" }, { w: "tinch", cls: "sifat" }, { w: "toza", cls: "sifat" },
  { w: "baland", cls: "sifat" }, { w: "mazali", cls: "sifat" }, { w: "qattiq", cls: "sifat" },
  { w: "yumshoq", cls: "sifat" }, { w: "og'ir", cls: "sifat" }, { w: "o'qish", cls: "fe'l" },
  { w: "yozish", cls: "fe'l" }, { w: "ishlash", cls: "fe'l" }, { w: "kulish", cls: "fe'l" },
  { w: "yugurish", cls: "fe'l" }, { w: "uxlash", cls: "fe'l" }, { w: "gapirish", cls: "fe'l" },
  { w: "tinglash", cls: "fe'l" }, { w: "yemoq", cls: "fe'l" }, { w: "ichish", cls: "fe'l" },
  { w: "kecha", cls: "ravish" }, { w: "ertalab", cls: "ravish" }, { w: "hozir", cls: "ravish" },
  { w: "bir", cls: "son" }, { w: "ikki", cls: "son" }, { w: "uch", cls: "son" },
  { w: "o'n", cls: "son" }, { w: "yuz", cls: "son" }, { w: "ming", cls: "son" },
  { w: "men", cls: "olmosh" }, { w: "sen", cls: "olmosh" }, { w: "biz", cls: "olmosh" },
  { w: "bu", cls: "olmosh" }, { w: "o'sha", cls: "olmosh" }, { w: "kim", cls: "olmosh" },
  { w: "nima", cls: "olmosh" }, { w: "qaysi", cls: "olmosh" },
];

type SyntaxQ = { s: L3; parts: string[]; answerIdx: number; ask: "ega" | "kesim" };
const SYNTAX: SyntaxQ[] = [
  { s: { uz: "Yorqin quyosh tongda chiqdi.", ru: "Яркое солнце взошло утром.", en: "The bright sun rose in the morning." }, parts: ["Yorqin", "quyosh", "tongda", "chiqdi."], answerIdx: 1, ask: "ega" },
  { s: { uz: "Bolalar bog'da xursand o'ynashdi.", ru: "Дети весело играли в саду.", en: "The children played happily in the garden." }, parts: ["Bolalar", "bog'da", "xursand", "o'ynashdi."], answerIdx: 0, ask: "ega" },
  { s: { uz: "Jasur o'quvchi darsga kechikmadi.", ru: "Смелый ученик не опоздал на урок.", en: "The diligent student was not late for class." }, parts: ["Jasur", "o'quvchi", "darsga", "kechikmadi."], answerIdx: 1, ask: "ega" },
  { s: { uz: "Onam mazali taom tayyorladi.", ru: "Мама приготовила вкусное блюдо.", en: "My mother cooked a tasty dish." }, parts: ["Onam", "mazali", "taom", "tayyorladi."], answerIdx: 0, ask: "ega" },
  { s: { uz: "Bahorda bog'lar gullaydi.", ru: "Весной сады цветут.", en: "In spring, gardens bloom." }, parts: ["Bahorda", "bog'lar", "gullaydi.", "xursand"], answerIdx: 1, ask: "ega" },
  { s: { uz: "O'quvchilar kitob o'qishdi.", ru: "Ученики читали книгу.", en: "The students read a book." }, parts: ["O'quvchilar", "kitob", "o'qishdi.", "xursand"], answerIdx: 0, ask: "ega" },
  { s: { uz: "Mehmon uyga keldi.", ru: "Гость пришёл домой.", en: "The guest came home." }, parts: ["Mehmon", "uyga", "keldi.", "mazali"], answerIdx: 0, ask: "ega" },
  { s: { uz: "Charchagan poyezd bekatda to'xtadi.", ru: "Уставший поезд остановился на станции.", en: "The tired train stopped at the station." }, parts: ["Charchagan", "poyezd", "bekatda", "to'xtadi."], answerIdx: 1, ask: "ega" },
  { s: { uz: "Quyosh sharqdan chiqadi.", ru: "Солнце встаёт на востоке.", en: "The sun rises in the east." }, parts: ["Quyosh", "sharqdan", "chiqadi.", "tongda"], answerIdx: 0, ask: "ega" },
  { s: { uz: "Yomg'irdan keyin kamalak paydo bo'ldi.", ru: "После дождя появилась радуга.", en: "A rainbow appeared after the rain." }, parts: ["Yomg'irdan", "keyin", "kamalak", "paydo"], answerIdx: 2, ask: "ega" },
];

function synQ(rng: Rng, pairs: Pair[], i: number, reverse: boolean, word: string, kind: "syn" | "ant"): QGen {
  const p = pairs[i] as Pair;
  const correctVal = reverse ? p[0] : p[1];
  const others = pairs.filter((_, j) => j !== i).map((x) => (reverse ? x[1] : x[0]));
  const { o, correct } = optionsFor(rng, { uz: correctVal, ru: correctVal, en: correctVal }, others.map((v) => ({ uz: v, ru: v, en: v })));
  const base = reverse ? p[1] : p[0];
  if (kind === "syn") {
    return {
      t: {
        uz: `«${base}» so'zining sinonimi (ma'nodoshi) qaysi?`,
        ru: `Какой синоним у слова «${base}»?`,
        en: `What is a synonym of the word “${base}”?`,
      },
      o,
      correct,
    };
  }
  return {
    t: {
      uz: `«${base}» so'zining antonimi (qarama-qarshi ma'noli so'zi) qaysi?`,
      ru: `Какой антоним (противоположное по смыслу слово) у слова «${base}»?`,
      en: `What is the antonym (opposite) of the word “${base}”?`,
    },
    o,
    correct,
  };
}

function genOnatiliBank(dif: string): QGen[] {
  const rng = rngOf(`til-${dif}`);
  const out: QGen[] = [];
  if (dif === "easy") {
    // Harf turlari (3 xil ibora)
    const UNLI_UZ = [
      "Quyidagi harflardan qaysi biri unlilik?",
      "O'zbek alifbosida qaysi harf unli harf hisoblanadi?",
      "Qatorlardan qaysi birida faqat unli harf ko'rsatilgan? (javob — shu harf)",
    ];
    const UNLI_RU = [
      "Какая из следующих букв является гласной?",
      "Какая буква узбекского алфавита является гласной?",
      "В каком варианте показана только гласная буква?",
    ];
    const UNLI_EN = [
      "Which of the following letters is a vowel?",
      "Which letter of the Uzbek alphabet is a vowel?",
      "Which option shows a vowel letter?",
    ];
    const UNDOSH_UZ = [
      "Quyidagi harflardan qaysi biri undoshlik?",
      "O'zbek alifbosida qaysi harf undosh harf hisoblanadi?",
      "Qatorlardan qaysi birida faqat undosh harf ko'rsatilgan? (javob — shu harf)",
    ];
    const UNDOSH_RU = [
      "Какая из следующих букв является согласной?",
      "Какая буква узбекского алфавита является согласной?",
      "В каком варианте показана только согласная буква?",
    ];
    const UNDOSH_EN = [
      "Which of the following letters is a consonant?",
      "Which letter of the Uzbek alphabet is a consonant?",
      "Which option shows a consonant letter?",
    ];
    for (let k = 0; k < 3; k++) {
      for (const l of UNLI) {
        const distr = UNDOSH.slice(0, 20).map((d) => ({ uz: d, ru: d, en: d }));
        const { o, correct } = optionsFor(rng, { uz: l, ru: l, en: l }, shuffle(rng, distr));
        out.push({
          t: { uz: UNLI_UZ[k] as string, ru: UNLI_RU[k] as string, en: UNLI_EN[k] as string },
          o,
          correct,
        });
      }
      for (const l of UNDOSH) {
        const distr = UNLI.map((d) => ({ uz: d, ru: d, en: d }));
        const { o, correct } = optionsFor(rng, { uz: l, ru: l, en: l }, shuffle(rng, distr));
        out.push({
          t: { uz: UNDOSH_UZ[k] as string, ru: UNDOSH_RU[k] as string, en: UNDOSH_EN[k] as string },
          o,
          correct,
        });
      }
    }
    // Harflarni sanash (2 xil ibora)
    const CNT_UZ = [
      (w: string) => `«${w}» so'zida nechta unli harf bor?`,
      (w: string) => `${w} so'zidagi unlilik harflar sonini toping.`,
    ];
    const CNT_RU = [
      (w: string) => `Сколько гласных букв в слове «${w}»?`,
      (w: string) => `Найдите число гласных букв в слове ${w}.`,
    ];
    const CNT_EN = [
      (w: string) => `How many vowels are in the word “${w}”?`,
      (w: string) => `Count the vowels in the word “${w}”.`,
    ];
    for (let k = 0; k < 2; k++) {
      for (const w of OAT_WORDS) {
        const u = countUnli(w);
        const { o, correct } = optionsFor(
          rng,
          { uz: String(u), ru: String(u), en: String(u) },
          [1, 2, 3, 4, 5, 6].filter((n) => n !== u).map((n) => ({ uz: String(n), ru: String(n), en: String(n) }))
        );
        out.push({
          t: { uz: CNT_UZ[k]!(w), ru: CNT_RU[k]!(w), en: CNT_EN[k]!(w) },
          o,
          correct,
        });
      }
    }
    // Undosh harflarni sanash
    const CNT2_UZ = [
      (w: string) => `«${w}» so'zida nechta undosh harf bor?`,
      (w: string) => `${w} so'zidagi undosh harflar sonini toping.`,
    ];
    const CNT2_RU = [
      (w: string) => `Сколько согласных букв в слове «${w}»?`,
      (w: string) => `Найдите число согласных букв в слове ${w}.`,
    ];
    const CNT2_EN = [
      (w: string) => `How many consonants are in the word “${w}”?`,
      (w: string) => `Count the consonants in the word “${w}”.`,
    ];
    for (let k = 0; k < 2; k++) {
      for (const w of OAT_WORDS) {
        const u = w.replace(/o'/g, "_").replace(/g'/g, "&").length - countUnli(w);
        const { o, correct } = optionsFor(
          rng,
          { uz: String(u), ru: String(u), en: String(u) },
          [1, 2, 3, 4, 5, 6].filter((n) => n !== u).map((n) => ({ uz: String(n), ru: String(n), en: String(n) }))
        );
        out.push({
          t: { uz: CNT2_UZ[k]!(w), ru: CNT2_RU[k]!(w), en: CNT2_EN[k]!(w) },
          o,
          correct,
        });
      }
    }
    // Harf guruhi: "qaysi biri boshqalardan farq qiladi"
    for (let i = 0; i < UNLI.length; i++) {
      const l = UNLI[i] as string;
      const others = UNDOSH.slice(i * 3, i * 3 + 3);
      const opts = shuffle(rng, [{ uz: l, ru: l, en: l }, ...others.map((d) => ({ uz: d, ru: d, en: d }))]);
      out.push({
        t: {
          uz: "Qatorlardan qaysi harf boshqalardan turi bilan farq qiladi (unli/undosh)?",
          ru: "Какая буква в ряду отличается по типу (гласная/согласная)?",
          en: "Which letter in the row differs in type (vowel/consonant)?",
        },
        o: opts,
        correct: opts.findIndex((x) => x.uz === l),
      });
    }
    for (let i = 0; i < UNDOSH.length; i++) {
      const l = UNDOSH[i] as string;
      const others = UNLI.slice(i % 3, (i % 3) + 3);
      const opts = shuffle(rng, [{ uz: l, ru: l, en: l }, ...others.map((d) => ({ uz: d, ru: d, en: d }))]);
      out.push({
        t: {
          uz: "Qatorlardan qaysi harf boshqalardan turi bilan farq qiladi (unli/undosh)?",
          ru: "Какая буква в ряду отличается по типу (гласная/согласная)?",
          en: "Which letter in the row differs in type (vowel/consonant)?",
        },
        o: opts,
        correct: opts.findIndex((x) => x.uz === l),
      });
    }
  } else if (dif === "middle") {
    for (let k = 0; k < 4; k++) {
      for (let i = 0; i < SYNONYMS.length; i++) out.push(synQ(rng, SYNONYMS, i, k % 2 === 1, "", "syn"));
      for (let i = 0; i < ANTONYMS.length; i++) out.push(synQ(rng, ANTONYMS, i, k % 2 === 1, "", "ant"));
    }
  } else {
    // Imlo
    for (let k = 0; k < 4; k++) {
      for (let si = 0; si < SPELLING.length; si++) {
        const [ok, bad] = SPELLING[si] as [string, string];
        const others = SPELLING.filter((_, j) => j !== si);
        const sh = shuffle(rng, others).slice(0, 2);
        const opts = shuffle(rng, [
          { uz: ok, ru: ok, en: ok },
          { uz: bad, ru: bad, en: bad },
          { uz: sh[0]![0], ru: sh[0]![0], en: sh[0]![0] },
          { uz: sh[1]![1], ru: sh[1]![1], en: sh[1]![1] },
        ]);
        out.push({
          t: {
            uz: "Qaysi yozuv to'g'ri?",
            ru: "Какое написание верное?",
            en: "Which spelling is correct?",
          },
          o: opts,
          correct: opts.findIndex((x) => x.uz === ok),
        });
        out.push({
          t: {
            uz: `Qaysi yozuvda xatolik bor? (variantlar: «${bad}» yoki «${ok}»)`,
            ru: `В каком написании есть ошибка? (варианты: «${bad}» и «${ok}»)`,
            en: `Which spelling contains an error? (options: “${bad}” and “${ok}”)`,
          },
          o: opts,
          correct: opts.findIndex((x) => x.uz === bad),
        });
      }
    }
    // So'z turkumi
    for (let k = 0; k < 3; k++) {
      for (const wd of WORDS) {
        const clsL: L3 = {
          ot: { uz: "Ot", ru: "Существительное", en: "A noun" },
          sifat: { uz: "Sifat", ru: "Прилагательное", en: "An adjective" },
          "fe'l": { uz: "Fe'l", ru: "Глагол", en: "A verb" },
          ravish: { uz: "Ravish", ru: "Наречие", en: "An adverb" },
          son: { uz: "Son", ru: "Числительное", en: "A numeral" },
          olmosh: { uz: "Olmosh", ru: "Местоимение", en: "A pronoun" },
        }[wd.cls] as L3;
        const distr = [
          { uz: "Ot", ru: "Существительное", en: "A noun" },
          { uz: "Sifat", ru: "Прилагательное", en: "An adjective" },
          { uz: "Fe'l", ru: "Глагол", en: "A verb" },
          { uz: "Ravish", ru: "Наречие", en: "An adverb" },
          { uz: "Son", ru: "Числительное", en: "A numeral" },
          { uz: "Olmosh", ru: "Местоимение", en: "A pronoun" },
        ].filter((x) => x.uz !== clsL.uz);
        const { o, correct } = optionsFor(rng, clsL, distr);
        out.push({
          t: {
            uz: `«${wd.w}» so'zi qaysi so'z turkumiga mansub?`,
            ru: `К какой части речи относится слово «${wd.w}»?`,
            en: `To which part of speech does the word “${wd.w}” belong?`,
          },
          o,
          correct,
        });
      }
    }
    // Sinonim (qiyin daraja ham)
    for (let c = 0; c < 2; c++) {
      for (let i = 0; i < SYNONYMS.length; i++) out.push(synQ(rng, SYNONYMS, i, (i + c) % 2 === 1, "", "syn"));
      for (let i = 0; i < ANTONYMS.length; i++) out.push(synQ(rng, ANTONYMS, i, (i + c) % 2 === 1, "", "ant"));
    }
    // Gap tarkibi (ega)
    for (let k = 0; k < 4; k++) {
      for (const sq of SYNTAX) {
        const opts = sq.parts.map((p) => ({ uz: p, ru: p, en: p }));
        out.push({
          t: {
            uz: `«${sq.s.uz}» gapida ega qaysi so'z?`,
            ru: `Какое слово является подлежащим в предложении «${sq.s.ru}»?`,
            en: `Which word is the subject in the sentence “${sq.s.en}”?`,
          },
          o: opts,
          correct: sq.answerIdx,
        });
      }
    }
  }
  return dedupe(out);
}

/* ================= ADABIYOT ================= */

type LitEntry = {
  a: L3; // muallif
  w: L3; // asosiy asar
  w2?: L3; // ikkinchi asar
  cent: string; // asr
  origin: L3; // xalq/mamlakat
  hero?: { n: L3; w: L3 };
};

const LITS: LitEntry[] = [
  { a: { uz: "Alisher Navoiy", ru: "Алишер Навои", en: "Alisher Navoi" }, w: { uz: "Xamsa", ru: "Хамса", en: "Khamsa" }, w2: { uz: "Farhod va Shirin", ru: "Фархад и Ширин", en: "Farhad and Shirin" }, cent: "XV asr", origin: { uz: "o'zbek", ru: "узбекский", en: "Uzbek" }, hero: { n: { uz: "Farhod", ru: "Фархад", en: "Farhad" }, w: { uz: "Farhod va Shirin", ru: "Фархад и Ширин", en: "Farhad and Shirin" } } },
  { a: { uz: "Bobur", ru: "Бабур", en: "Babur" }, w: { uz: "Boburnoma", ru: "Бабур-наме", en: "Baburnama" }, cent: "XV-XVI asrlar", origin: { uz: "o'zbek", ru: "узбекский", en: "Uzbek" } },
  { a: { uz: "Yusuf Xos Hojib", ru: "Юсуф Хас Хаджиб", en: "Yusuf Khass Hajib" }, w: { uz: "Qutadg'u bilig", ru: "Кутадгу билиг", en: "Kutadgu Bilig" }, cent: "XI asr", origin: { uz: "turkiy", ru: "тюркский", en: "Turkic" } },
  { a: { uz: "Lutfiy", ru: "Лутфи", en: "Lutfi" }, w: { uz: "Gul va Navruz", ru: "Гуль и Новруз", en: "Gul and Navruz" }, cent: "XIV-XV asrlar", origin: { uz: "o'zbek", ru: "узбекский", en: "Uzbek" } },
  { a: { uz: "Boborahim Mashrab", ru: "Боборахим Машраб", en: "Boborahim Mashrab" }, w: { uz: "Mashrab she'rlari", ru: "Стихи Машраба", en: "Mashrab's poems" }, cent: "XVII asr", origin: { uz: "o'zbek", ru: "узбекский", en: "Uzbek" } },
  { a: { uz: "Ogahiy", ru: "Агахи", en: "Agahi" }, w: { uz: "Tarixi shohi", ru: "Тарих-и шахи", en: "Tarikhi Shahi" }, cent: "XIX asr", origin: { uz: "o'zbek", ru: "узбекский", en: "Uzbek" } },
  { a: { uz: "Nodira", ru: "Надира", en: "Nodira" }, w: { uz: "Devon (Nodira)", ru: "Диван (Надира)", en: "Divan (Nodira)" }, cent: "XIX asr", origin: { uz: "o'zbek", ru: "узбекский", en: "Uzbek" } },
  { a: { uz: "Muqimiy", ru: "Мукими", en: "Muqimi" }, w: { uz: "Muqimiy satirik she'rlari", ru: "Сатирические стихи Мукими", en: "Muqimi's satirical poems" }, cent: "XIX asr", origin: { uz: "o'zbek", ru: "узбекский", en: "Uzbek" } },
  { a: { uz: "Furqat", ru: "Фуркат", en: "Furqat" }, w: { uz: "Hiblar", ru: "Хиблаяр", en: "Hiblar" }, cent: "XIX asr", origin: { uz: "o'zbek", ru: "узбекский", en: "Uzbek" } },
  { a: { uz: "Hamza Hakimzoda Niyoziy", ru: "Хамза Хакимзаде Ниязи", en: "Hamza Hakimzade Niyazi" }, w: { uz: "Maysaraning amali", ru: "Проделки Майсары", en: "The Tricks of Maysara" }, cent: "XX asr boshi", origin: { uz: "o'zbek", ru: "узбекский", en: "Uzbek" } },
  { a: { uz: "Mahmudxo'ja Behbudiy", ru: "Махмудходжа Бехбуди", en: "Mahmudkhoja Behbudiy" }, w: { uz: "Padarkush", ru: "Отцеубийца", en: "Padarkush" }, cent: "XX asr boshi", origin: { uz: "o'zbek", ru: "узбекский", en: "Uzbek" } },
  { a: { uz: "Abdulla Qodiriy", ru: "Абдулла Кодырий", en: "Abdulla Qodiriy" }, w: { uz: "O'tkan kunlar", ru: "Минувшие дни", en: "Days Gone By" }, w2: { uz: "Scalpel", ru: "Скальпель", en: "Scalpel" }, cent: "XX asr", origin: { uz: "o'zbek", ru: "узбекский", en: "Uzbek" }, hero: { n: { uz: "Otabek", ru: "Отабек", en: "Otabek" }, w: { uz: "O'tkan kunlar", ru: "Минувшие дни", en: "Days Gone By" } } },
  { a: { uz: "Cho'lpon", ru: "Чулпан", en: "Cholpon" }, w: { uz: "Kechalar", ru: "Ночи", en: "Nights" }, cent: "XX asr", origin: { uz: "o'zbek", ru: "узбекский", en: "Uzbek" } },
  { a: { uz: "Oybek", ru: "Айбек", en: "Oybek" }, w: { uz: "Navoiy (roman)", ru: "Навои (роман)", en: "Navoi (novel)" }, w2: { uz: "Qutlug' qon", ru: "Священная кровь", en: "Qutlug' qon" }, cent: "XX asr", origin: { uz: "o'zbek", ru: "узбекский", en: "Uzbek" } },
  { a: { uz: "Abdulla Qahhor", ru: "Абдулла Каххар", en: "Abdulla Qahhar" }, w: { uz: "Qo'shchoq chinor", ru: "Древний чинар", en: "The Old Chinar" }, w2: { uz: "Sinchkoh", ru: "Оглаз-Мухтар", en: "Sinchkoh" }, cent: "XX asr", origin: { uz: "o'zbek", ru: "узбекский", en: "Uzbek" } },
  { a: { uz: "Said Ahmad", ru: "Саид Ахмад", en: "Said Ahmad" }, w: { uz: "Ufq", ru: "Горизонт", en: "Ufq" }, cent: "XX asr", origin: { uz: "o'zbek", ru: "узбекский", en: "Uzbek" } },
  { a: { uz: "Pirimqul Qodirov", ru: "Пиримкул Кадыров", en: "Pirimqul Qodirov" }, w: { uz: "Yulduzli tunlar", ru: "Звёздные ночи", en: "Starlit Nights" }, cent: "XX asr", origin: { uz: "o'zbek", ru: "узбекский", en: "Uzbek" } },
  { a: { uz: "Ulug'bek Hamdam", ru: "Улугбек Хамдам", en: "Ulugbek Hamdam" }, w: { uz: "Parvoz", ru: "Полет", en: "Parvoz" }, cent: "XXI asr", origin: { uz: "o'zbek", ru: "узбекский", en: "Uzbek" } },
  { a: { uz: "Asqad Muxtor", ru: "Аскар Мухтар", en: "Askad Mukhtar" }, w: { uz: "Chinor", ru: "Чинара", en: "Chinor" }, cent: "XX asr", origin: { uz: "o'zbek", ru: "узбекский", en: "Uzbek" } },
  { a: { uz: "Xudoyberdi To'xtaboyev", ru: "Худайберды Тухтабаев", en: "Xudoyberdi To'xtaboyev" }, w: { uz: "Bolalik qaytgusi emas", ru: "Детство не вернётся", en: "Childhood Doesn't Return" }, cent: "XX asr", origin: { uz: "o'zbek", ru: "узбекский", en: "Uzbek" } },
  { a: { uz: "Abdulla Oripov", ru: "Абдулла Арипов", en: "Abdulla Oripov" }, w: { uz: "O'zbekiston (madhiya so'zlari)", ru: "Слова гимна Узбекистана", en: "Words of the Uzbek anthem" }, cent: "XX asr", origin: { uz: "o'zbek", ru: "узбекский", en: "Uzbek" } },
  { a: { uz: "Erkin Vohidov", ru: "Эркин Воходов", en: "Erkin Vohidov" }, w: { uz: "Ravoyat", ru: "Равоят", en: "Ravoyat" }, cent: "XX asr", origin: { uz: "o'zbek", ru: "узбекский", en: "Uzbek" } },
  { a: { uz: "Muhammad Yusuf", ru: "Мухаммад Юсуф", en: "Muhammad Yusuf" }, w: { uz: "Oqsoqol", ru: "Аксакал", en: "Oqsoqol" }, cent: "XX asr", origin: { uz: "o'zbek", ru: "узбекский", en: "Uzbek" } },
  { a: { uz: "Homer (Gomer)", ru: "Гомер", en: "Homer" }, w: { uz: "Iliada", ru: "Илиада", en: "The Iliad" }, w2: { uz: "Odisseya", ru: "Одиссея", en: "The Odyssey" }, cent: "VIII asr (mil. avv.)", origin: { uz: "qadimgi yunon", ru: "древнегреческий", en: "Ancient Greek" } },
  { a: { uz: "William Shakespeare", ru: "Уильям Шекспир", en: "William Shakespeare" }, w: { uz: "Romeo va Juletta", ru: "Ромео и Джульетта", en: "Romeo and Juliet" }, w2: { uz: "Hamlet", ru: "Гамлет", en: "Hamlet" }, cent: "XVI-XVII asrlar", origin: { uz: "angliya", ru: "английский", en: "English" }, hero: { n: { uz: "Hamlet", ru: "Гамлет", en: "Hamlet" }, w: { uz: "Hamlet", ru: "Гамлет", en: "Hamlet" } } },
  { a: { uz: "Molière", ru: "Мольер", en: "Moliere" }, w: { uz: "Tartuf", ru: "Тартюф", en: "Tartuffe" }, w2: { uz: "Xasis", ru: "Скупой", en: "The Miser" }, cent: "XVII asr", origin: { uz: "fransiya", ru: "французский", en: "French" } },
  { a: { uz: "Daniel Defoe", ru: "Даниэль Дефо", en: "Daniel Defoe" }, w: { uz: "Robinzon Kruzo", ru: "Робинзон Крузо", en: "Robinson Crusoe" }, cent: "XVIII asr", origin: { uz: "angliya", ru: "английский", en: "English" }, hero: { n: { uz: "Robinzon", ru: "Робинзон", en: "Robinson" }, w: { uz: "Robinzon Kruzo", ru: "Робинзон Крузо", en: "Robinson Crusoe" } } },
  { a: { uz: "Jonathan Swift", ru: "Джонатан Свифт", en: "Jonathan Swift" }, w: { uz: "Gulliverning sayohatlari", ru: "Путешествия Гулливера", en: "Gulliver's Travels" }, cent: "XVIII asr", origin: { uz: "angliya", ru: "английский", en: "English" }, hero: { n: { uz: "Gulliver", ru: "Гулливер", en: "Gulliver" }, w: { uz: "Gulliverning sayohatlari", ru: "Путешествия Гулливера", en: "Gulliver's Travels" } } },
  { a: { uz: "Goethe", ru: "Гёте", en: "Goethe" }, w: { uz: "Faust", ru: "Фауст", en: "Faust" }, cent: "XVIII-XIX asrlar", origin: { uz: "germaniya", ru: "немецкий", en: "German" } },
  { a: { uz: "Pushkin", ru: "Пушкин", en: "Pushkin" }, w: { uz: "Yevgeniy Onegin", ru: "Евгений Онегин", en: "Eugene Onegin" }, w2: { uz: "Ruslan va Lyudmila", ru: "Руслан и Людмила", en: "Ruslan and Lyudmila" }, cent: "XIX asr", origin: { uz: "rus", ru: "русский", en: "Russian" }, hero: { n: { uz: "Onegin", ru: "Онегин", en: "Onegin" }, w: { uz: "Yevgeniy Onegin", ru: "Евгений Онегин", en: "Eugene Onegin" } } },
  { a: { uz: "Lermontov", ru: "Лермонтов", en: "Lermontov" }, w: { uz: "Mtsyri", ru: "Мцыри", en: "Mtsyri" }, cent: "XIX asr", origin: { uz: "rus", ru: "русский", en: "Russian" } },
  { a: { uz: "Gogol", ru: "Гоголь", en: "Gogol" }, w: { uz: "O'lik jonlar", ru: "Мёртвые души", en: "Dead Souls" }, w2: { uz: "Shinel", ru: "Шинель", en: "The Overcoat" }, cent: "XIX asr", origin: { uz: "rus", ru: "русский", en: "Russian" } },
  { a: { uz: "Turgenev", ru: "Тургенев", en: "Turgenev" }, w: { uz: "Otalar va bolalar", ru: "Отцы и дети", en: "Fathers and Sons" }, cent: "XIX asr", origin: { uz: "rus", ru: "русский", en: "Russian" } },
  { a: { uz: "Tolstoy", ru: "Толстой", en: "Tolstoy" }, w: { uz: "Urush va tinchlik", ru: "Война и мир", en: "War and Peace" }, w2: { uz: "Anna Karenina", ru: "Анна Каренина", en: "Anna Karenina" }, cent: "XIX asr", origin: { uz: "rus", ru: "русский", en: "Russian" } },
  { a: { uz: "Dostoevsky", ru: "Достоевский", en: "Dostoevsky" }, w: { uz: "Jinoyat va jazo", ru: "Преступление и наказание", en: "Crime and Punishment" }, cent: "XIX asr", origin: { uz: "rus", ru: "русский", en: "Russian" }, hero: { n: { uz: "Raskolnikov", ru: "Раскольников", en: "Raskolnikov" }, w: { uz: "Jinoyat va jazo", ru: "Преступление и наказание", en: "Crime and Punishment" } } },
  { a: { uz: "Chekhov", ru: "Чехов", en: "Chekhov" }, w: { uz: "Hameleono", ru: "Хамелеон", en: "The Chameleon" }, cent: "XIX asr", origin: { uz: "rus", ru: "русский", en: "Russian" } },
  { a: { uz: "Victor Hugo", ru: "Виктор Гюго", en: "Victor Hugo" }, w: { uz: "Parij Notre-Dame ibodatxonasi", ru: "Собор Парижской Богоматери", en: "The Hunchback of Notre-Dame" }, cent: "XIX asr", origin: { uz: "fransiya", ru: "французский", en: "French" } },
  { a: { uz: "Balzac", ru: "Бальзак", en: "Balzac" }, w: { uz: "Shagren terisi", ru: "Шагреневая кожа", en: "The Magic Skin" }, cent: "XIX asr", origin: { uz: "fransiya", ru: "французский", en: "French" } },
  { a: { uz: "Stendhal", ru: "Стендаль", en: "Stendhal" }, w: { uz: "Qizil va qora", ru: "Красное и чёрное", en: "The Red and the Black" }, cent: "XIX asr", origin: { uz: "fransiya", ru: "французский", en: "French" } },
  { a: { uz: "Dickens", ru: "Диккенс", en: "Dickens" }, w: { uz: "Oliver Tving sarguzashtlari", ru: "Приключения Оливера Твиста", en: "Oliver Twist" }, cent: "XIX asr", origin: { uz: "angliya", ru: "английский", en: "English" } },
  { a: { uz: "Mark Twain", ru: "Марк Твен", en: "Mark Twain" }, w: { uz: "Tom Soyerning sarguzashtlari", ru: "Приключения Тома Сойера", en: "The Adventures of Tom Sawyer" }, cent: "XIX asr", origin: { uz: "amerika", ru: "американский", en: "American" }, hero: { n: { uz: "Tom Soyer", ru: "Том Сойер", en: "Tom Sawyer" }, w: { uz: "Tom Soyerning sarguzashtlari", ru: "Приключения Тома Сойера", en: "The Adventures of Tom Sawyer" } } },
  { a: { uz: "Jack London", ru: "Джек Лондон", en: "Jack London" }, w: { uz: "Oq tish", ru: "Белый Клык", en: "White Fang" }, cent: "XIX-XX asrlar", origin: { uz: "amerika", ru: "американский", en: "American" } },
  { a: { uz: "Hemingway", ru: "Хемингуэй", en: "Hemingway" }, w: { uz: "Qariya va dengiz", ru: "Старик и море", en: "The Old Man and the Sea" }, cent: "XX asr", origin: { uz: "amerika", ru: "американский", en: "American" } },
  { a: { uz: "Cervantes", ru: "Сервантес", en: "Cervantes" }, w: { uz: "Don Kixot", ru: "Дон Кихот", en: "Don Quixote" }, cent: "XVI-XVII asrlar", origin: { uz: "ispaniya", ru: "испанский", en: "Spanish" }, hero: { n: { uz: "Don Kixot", ru: "Дон Кихот", en: "Don Quixote" }, w: { uz: "Don Kixot", ru: "Дон Кихот", en: "Don Quixote" } } },
  { a: { uz: "Dante", ru: "Данте", en: "Dante" }, w: { uz: "Ilohiy komediya", ru: "Божественная комедия", en: "The Divine Comedy" }, cent: "XIII-XIV asrlar", origin: { uz: "italiya", ru: "итальянский", en: "Italian" } },
  { a: { uz: "Schiller", ru: "Шиллер", en: "Schiller" }, w: { uz: "Qaroqchilar", ru: "Разбойники", en: "The Robbers" }, cent: "XVIII asr", origin: { uz: "germaniya", ru: "немецкий", en: "German" } },
  { a: { uz: "Byron", ru: "Байрон", en: "Byron" }, w: { uz: "Chayld Garold sayohati", ru: "Паломничество Чайльд-Гарольда", en: "Childe Harold's Pilgrimage" }, cent: "XIX asr", origin: { uz: "angliya", ru: "английский", en: "English" } },
  { a: { uz: "Dumas (ota)", ru: "Дюма (отец)", en: "Dumas (father)" }, w: { uz: "Uch musketyor", ru: "Три мушкетёра", en: "The Three Musketeers" }, w2: { uz: "Monte-Kristo grafi", ru: "Граф Монте-Кристо", en: "The Count of Monte Cristo" }, cent: "XIX asr", origin: { uz: "fransiya", ru: "французский", en: "French" }, hero: { n: { uz: "D'Artanyan", ru: "Д'Артаньян", en: "D'Artagnan" }, w: { uz: "Uch musketyor", ru: "Три мушкетёра", en: "The Three Musketeers" } } },
  { a: { uz: "Kipling", ru: "Киплинг", en: "Kipling" }, w: { uz: "Jungllar kitobi", ru: "Книга джунглей", en: "The Jungle Book" }, cent: "XIX asr", origin: { uz: "angliya", ru: "английский", en: "English" }, hero: { n: { uz: "Mowgli", ru: "Маугли", en: "Mowgli" }, w: { uz: "Jungllar kitobi", ru: "Книга джунглей", en: "The Jungle Book" } } },
  { a: { uz: "Jules Verne", ru: "Жюль Верн", en: "Jules Verne" }, w: { uz: "80 kun ichida Yer aylanishi", ru: "Вокруг света за 80 дней", en: "Around the World in 80 Days" }, w2: { uz: "Suv ostida yigirma ming lye", ru: "Двадцать тысяч льё под водой", en: "Twenty Thousand Leagues Under the Seas" }, cent: "XIX asr", origin: { uz: "fransiya", ru: "французский", en: "French" } },
  { a: { uz: "Saint-Exupéry", ru: "Сент-Экзюпери", en: "Saint-Exupery" }, w: { uz: "Kichik shahzoda", ru: "Маленький принц", en: "The Little Prince" }, cent: "XX asr", origin: { uz: "fransiya", ru: "французский", en: "French" }, hero: { n: { uz: "Kichik shahzoda", ru: "Маленький принц", en: "The Little Prince" }, w: { uz: "Kichik shahzoda", ru: "Маленький принц", en: "The Little Prince" } } },
  { a: { uz: "Shevchenko", ru: "Шевченко", en: "Shevchenko" }, w: { uz: "Kobzar", ru: "Кобзарь", en: "Kobzar" }, cent: "XIX asr", origin: { uz: "ukraina", ru: "украинский", en: "Ukrainian" } },
  { a: { uz: "Tagor", ru: "Тагор", en: "Tagore" }, w: { uz: "Gitanjali", ru: "Гитанджали", en: "Gitanjali" }, cent: "XIX-XX asrlar", origin: { uz: "hind", ru: "индийский", en: "Indian" } },
];

function worksOf(e: LitEntry): L3[] {
  return e.w2 ? [e.w, e.w2] : [e.w];
}

function genAdabiyotBank(dif: string): QGen[] {
  const rng = rngOf(`adab-${dif}`);
  const out: QGen[] = [];
  const allWorks: Array<{ w: L3; a: L3 }> = LITS.flatMap((e) => worksOf(e).map((w) => ({ w, a: e.a })));
  const AUTH_UZ = [
    (w: string) => `«${w}» asari muallifi kim?`,
    (w: string) => `«${w}» asari kim tomonidan yozilgan?`,
    (w: string) => `Muallifini toping: «${w}» asari kimniki?`,
  ];
  const AUTH_RU = [
    (w: string) => `Кто автор произведения «${w}»?`,
    (w: string) => `Кем написано произведение «${w}»?`,
    (w: string) => `Найдите автора: кому принадлежит «${w}»?`,
  ];
  const AUTH_EN = [
    (w: string) => `Who is the author of “${w}”?`,
    (w: string) => `By whom was “${w}” written?`,
    (w: string) => `Identify the author of “${w}”.`,
  ];
  const WORK_UZ = [
    (a: string) => `${a} quyidagi asarlardan qaysi birini yozgan?`,
    (a: string) => `${a}ning qaysi asari quyida ko'rsatilgan?`,
    (a: string) => `${a} ijodidan qaysi asar o'rin olgan?`,
  ];
  const WORK_RU = [
    (a: string) => `Какое из следующих произведений написал ${a}?`,
    (a: string) => `Какое из произведений принадлежит ${a}?`,
    (a: string) => `Какое произведение входит в творчество ${a}?`,
  ];
  const WORK_EN = [
    (a: string) => `Which of the following works was written by ${a}?`,
    (a: string) => `Which work belongs to ${a}?`,
    (a: string) => `Which of these works is by ${a}?`,
  ];
  for (let k = 0; k < 3; k++) {
    for (const { w, a } of allWorks) {
      const distr = allWorks.filter((x) => x.w.uz !== w.uz).map((x) => x.a);
      const { o, correct } = optionsFor(rng, a, shuffle(rng, distr));
      out.push({
        t: { uz: AUTH_UZ[k]!(w.uz), ru: AUTH_RU[k]!(w.ru), en: AUTH_EN[k]!(w.en) },
        o,
        correct,
      });
    }
    for (const e of LITS) {
      const distr = allWorks.filter((x) => x.a.uz !== e.a.uz).map((x) => x.w);
      const { o, correct } = optionsFor(rng, e.w, shuffle(rng, distr));
      out.push({
        t: { uz: WORK_UZ[k]!(e.a.uz), ru: WORK_RU[k]!(e.a.ru), en: WORK_EN[k]!(e.a.en) },
        o,
        correct,
      });
    }
  }
  if (dif === "middle" || dif === "hard") {
    for (let k = 0; k < 2; k++) {
      for (const e of LITS) {
        const distr = LITS.filter((x) => x.origin.uz !== e.origin.uz).map((x) => x.origin);
        const { o, correct } = optionsFor(rng, e.origin, shuffle(rng, distr));
        out.push({
          t: {
            uz: `${e.a.uz} qaysi xalq/mamlakat adibidir?`,
            ru: `К какому народу/стране относится ${e.a.ru}?`,
            en: `To which people/country does ${e.a.en} belong?`,
          },
          o,
          correct,
        });
      }
    }
  }
  if (dif === "hard") {
    for (let k = 0; k < 2; k++) {
      for (const e of LITS) {
        const distr = LITS.filter((x) => x.cent !== e.cent).map((x) => x.cent);
        const { o, correct } = optionsFor(rng, { uz: e.cent, ru: e.cent, en: e.cent }, distr.map((c) => ({ uz: c, ru: c, en: c })));
        out.push({
          t: {
            uz: `${e.a.uz} qaysi asrda ijod qilgan?`,
            ru: `В каком веке творил ${e.a.ru}?`,
            en: `In which century did ${e.a.en} create?`,
          },
          o,
          correct,
        });
      }
    }
  }
  // Qahramonlar
  const heroes = LITS.filter((e) => e.hero);
  for (let k = 0; k < (dif === "easy" ? 1 : 3); k++) {
    for (const e of heroes) {
      const h = e.hero as { n: L3; w: L3 };
      const distr = LITS.filter((x) => x.hero).filter((x) => (x.hero as { n: L3 }).n.uz !== h.n.uz).map((x) => (x.hero as { n: L3 }).n);
      const { o, correct } = optionsFor(rng, h.n, shuffle(rng, distr));
      out.push({
        t: {
          uz: `«${h.w.uz}» asarining bosh qahramoni kim?`,
          ru: `Кто главный герой произведения «${h.w.ru}»?`,
          en: `Who is the main character of “${h.w.en}”?`,
        },
        o,
        correct,
      });
    }
  }
  return dedupe(out);
}

export function genOnatili(dif: string): QGen[] {
  return genOnatiliBank(dif);
}

export function genAdabiyot(dif: string): QGen[] {
  return genAdabiyotBank(dif);
}
