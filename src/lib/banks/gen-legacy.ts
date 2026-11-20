/**
 * Eski (legacy) testlar uchun savollar generatori — 300 taga to'ldiriladi.
 * Bu 6 ta test prisma/seed-data.json orqali yaratilgan va dastlab 10 ta savolga
 * ega edi:
 *   - Matematika: "Arifmetika asoslari", "Algebra va mantiq"
 *   - Ingliz tili: "Grammatika asoslari", "So'z boyligi"
 *   - Tarix: "Jahon tarixi", "O'zbekiston tarixi"
 * Har bir generator kamida 300 unikal savol qaytaradi (3 til: uz/ru/en).
 */
import {
  dedupe,
  numOptions,
  optionsFor,
  rangeInt,
  rngOf,
  same,
  shuffle,
  type L3,
  type QGen,
  type Rng,
} from "./gen-core";
import { genHistoryQuiz } from "./gen-history";

/* ==================== ARIFMETIKA ASOSLARI ==================== */

function arifBank(rng: Rng): QGen[] {
  const out: QGen[] = [];
  // Yig'indi va ayirma (3 xonali)
  for (let i = 0; i < 55; i++) {
    const a = rangeInt(rng, 105, 899);
    const b = rangeInt(rng, 24, 899);
    const { o, correct } = numOptions(rng, a + b, Math.max(5, Math.round((a + b) * 0.1)));
    out.push({ t: same(`${a} + ${b} = ?`), o, correct });
  }
  for (let i = 0; i < 45; i++) {
    const a = rangeInt(rng, 120, 980);
    const b = rangeInt(rng, 15, a - 12);
    const { o, correct } = numOptions(rng, a - b, 7);
    out.push({ t: same(`${a} − ${b} = ?`), o, correct });
  }
  // Ko'paytirish va bo'lish
  for (let i = 0; i < 45; i++) {
    const a = rangeInt(rng, 12, 99);
    const b = rangeInt(rng, 3, 9);
    const { o, correct } = numOptions(rng, a * b, Math.max(4, Math.round(a * 0.35)));
    out.push({ t: same(`${a} × ${b} = ?`), o, correct });
  }
  for (let i = 0; i < 35; i++) {
    const b = rangeInt(rng, 3, 12);
    const k = rangeInt(rng, 3, 24);
    const a = b * k;
    const { o, correct } = numOptions(rng, k, 3);
    out.push({ t: same(`${a} : ${b} = ?`), o, correct });
  }
  // Foizlar
  const percents = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75];
  for (let i = 0; i < 45; i++) {
    const p = percents[rangeInt(rng, 0, percents.length - 1)]!;
    const base = rangeInt(rng, 4, 96) * 20; // 80..1920 — butun natija kafolatlangan
    const val = (base * p) / 100;
    const { o, correct } = numOptions(rng, val, Math.max(3, Math.round(val * 0.15)));
    out.push({
      t: {
        uz: `${base} ning ${p}% i nechchi?`,
        ru: `Сколько составляет ${p}% от ${base}?`,
        en: `What is ${p}% of ${base}?`,
      },
      o,
      correct,
    });
  }
  // Kasr ulushi
  const fracs: Array<[string, number, number]> = [
    ["1/2", 1, 2],
    ["1/3", 1, 3],
    ["1/4", 1, 4],
    ["2/3", 2, 3],
    ["3/4", 3, 4],
  ];
  for (let i = 0; i < 35; i++) {
    const [label, num, den] = fracs[rangeInt(rng, 0, fracs.length - 1)]!;
    const base = rangeInt(rng, 6, 90) * den;
    const val = (base * num) / den;
    const { o, correct } = numOptions(rng, val, Math.max(3, Math.round(val * 0.2)));
    out.push({
      t: {
        uz: `${base} ning ${label} qismi nechchi?`,
        ru: `Чему равна ${label} часть числа ${base}?`,
        en: `What is ${label} of ${base}?`,
      },
      o,
      correct,
    });
  }
  // Noma'lum xad
  for (let i = 0; i < 35; i++) {
    const a = rangeInt(rng, 14, 150);
    const b = rangeInt(rng, 5, 90);
    const c = a + b;
    const { o, correct } = numOptions(rng, b, 5);
    const which = rng() < 0.5;
    out.push(
      which
        ? { t: same(`${a} + ? = ${c}`), o, correct }
        : { t: same(`${c} − ? = ${a}`), o, correct }
    );
  }
  // Darajalar va ildizlar
  for (let i = 0; i < 30; i++) {
    const n = rangeInt(rng, 2, 9);
    const base = rangeInt(rng, 2, 5);
    const val = Math.pow(base, n);
    const { o, correct } = numOptions(rng, val, Math.max(3, Math.round(val * 0.25)));
    out.push({ t: same(`${base}^${n} = ?`), o, correct });
  }
  const squares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
  for (let i = 0; i < 20; i++) {
    const sq = squares[rangeInt(rng, 0, squares.length - 1)]!;
    const root = Math.round(Math.sqrt(sq));
    const { o, correct } = numOptions(rng, root, 3);
    out.push({ t: same(`√${sq} = ?`), o, correct });
  }
  // So'zli masalalar: narx × miqdor, qaytim
  const itemNames: Array<[L3, string]> = [
    [{ uz: "daftar", ru: "тетрадь", en: "notebook" }, "notebook"],
    [{ uz: "qalam", ru: "карандаш", en: "pen" }, "pen"],
    [{ uz: "olma", ru: "яблоко", en: "apple" }, "apple"],
    [{ uz: "kitob", ru: "книга", en: "book" }, "book"],
    [{ uz: "sham", ru: "свеча", en: "candle" }, "candle"],
  ];
  for (let i = 0; i < 25; i++) {
    const [name] = itemNames[rangeInt(rng, 0, itemNames.length - 1)]!;
    const qty = rangeInt(rng, 2, 9);
    const price = rangeInt(rng, 2, 25) * 100;
    const val = price * qty;
    const { o, correct } = numOptions(rng, val, Math.max(100, Math.round(val * 0.12)));
    out.push({
      t: {
        uz: `Bitta ${name.uz} ${price} so'm. ${qty} ta ${name.uz} jami nechchi so'm turadi?`,
        ru: `Одна ${name.ru} стоит ${price} сум. Сколько стоят ${qty} штук?`,
        en: `One ${name.en} costs ${price} som. How much do ${qty} of them cost?`,
      },
      o,
      correct,
    });
  }
  for (let i = 0; i < 25; i++) {
    const paid = rangeInt(rng, 10, 40) * 500;
    const price = rangeInt(rng, 3, Math.floor(paid / 500) - 2) * 500;
    const val = paid - price;
    const { o, correct } = numOptions(rng, val, 250);
    out.push({
      t: {
        uz: `Xaridor ${paid} so'm berdi va ${price} so'mlik mahsulot oldi. Qaytimi nechchi so'm?`,
        ru: `Покупатель дал ${paid} сум и купил товар за ${price} сум. Сколько сдачи?`,
        en: `A customer paid ${paid} som and bought goods for ${price} som. How much change?`,
      },
      o,
      correct,
    });
  }
  return dedupe(out);
}

/* ==================== ALGEBRA VA MANTIQ ==================== */

function algBank(rng: Rng): QGen[] {
  const out: QGen[] = [];
  // Chiziqli tenglamalar ax + b = c
  for (let i = 0; i < 70; i++) {
    const a = rangeInt(rng, 2, 12);
    const x = rangeInt(rng, 1, 20);
    const b = rangeInt(rng, 1, 40) * (rng() < 0.5 ? -1 : 1);
    const c = a * x + b;
    const bTxt = b >= 0 ? ` + ${b}` : ` − ${Math.abs(b)}`;
    const { o, correct } = numOptions(rng, x, 3);
    out.push({
      t: {
        uz: `${a}x${bTxt} = ${c} tenglamada x nechchi?`,
        ru: `Чему равен x в уравнении ${a}x${bTxt} = ${c}?`,
        en: `In the equation ${a}x${bTxt} = ${c}, what is x?`,
      },
      o,
      correct,
    });
  }
  // Ikkala tomonda x
  for (let i = 0; i < 55; i++) {
    const a = rangeInt(rng, 3, 9);
    const c = rangeInt(rng, 1, a - 1);
    const x = rangeInt(rng, 1, 15);
    const b = rangeInt(rng, 1, 30);
    const d = a * x + b - c * x;
    const { o, correct } = numOptions(rng, x, 3);
    out.push({
      t: {
        uz: `${a}x + ${b} = ${c}x + ${d} tenglamada x nechchi?`,
        ru: `Чему равен x в уравнении ${a}x + ${b} = ${c}x + ${d}?`,
        en: `In the equation ${a}x + ${b} = ${c}x + ${d}, what is x?`,
      },
      o,
      correct,
    });
  }
  // Ifodani hisoblash
  for (let i = 0; i < 40; i++) {
    const k = rangeInt(rng, 2, 15);
    const m = rangeInt(rng, 1, 12);
    const x = rangeInt(rng, 1, 12);
    const val = k * x + m;
    const { o, correct } = numOptions(rng, val, 4);
    out.push({
      t: {
        uz: `y = ${k}x + ${m} funksiyada x = ${x} bo'lsa, y nechchi?`,
        ru: `В функции y = ${k}x + ${m}, если x = ${x}, чему равен y?`,
        en: `In the function y = ${k}x + ${m}, if x = ${x}, what is y?`,
      },
      o,
      correct,
    });
  }
  // Kvadrat tenglama (ko'paytuvchilarga yoyiladigan)
  for (let i = 0; i < 55; i++) {
    const p = rangeInt(rng, 1, 9);
    const q = rangeInt(rng, 1, 9);
    const s = p + q;
    const prod = p * q;
    const ans = `${Math.min(p, q)} va ${Math.max(p, q)}`;
    const wrongs = shuffle(rng, [
      same(`${Math.min(p + 1, q)} va ${Math.max(p, q + 1)}`),
      same(`${p + q} va ${Math.abs(prod - p) || prod + 1}`),
      same(`${p} va ${q + 2}`),
      same(`${Math.max(p, q)} va ${Math.max(p, q) + 1}`),
      same(`${p + 1} va ${q + 1}`),
    ]);
    const built = optionsFor(rng, same(ans), wrongs);
    out.push({
      t: {
        uz: `x² − ${s}x + ${prod} = 0 tenglamaning ildizlari qaysi?`,
        ru: `Каковы корни уравнения x² − ${s}x + ${prod} = 0?`,
        en: `What are the roots of the equation x² − ${s}x + ${prod} = 0?`,
      },
      ...built,
    });
  }
  // Arifmetik progressiya
  for (let i = 0; i < 40; i++) {
    const a1 = rangeInt(rng, 1, 15);
    const d = rangeInt(rng, 2, 9);
    const n = rangeInt(rng, 4, 12);
    const val = a1 + (n - 1) * d;
    const { o, correct } = numOptions(rng, val, 4);
    out.push({
      t: {
        uz: `Arifmetik progressiyada a₁ = ${a1}, d = ${d}. a${n} nechchi?`,
        ru: `В арифметической прогрессии a₁ = ${a1}, d = ${d}. Чему равен a${n}?`,
        en: `In an arithmetic progression a₁ = ${a1}, d = ${d}. What is a${n}?`,
      },
      o,
      correct,
    });
  }
  // Geometrik progressiya — keyingi had
  for (let i = 0; i < 25; i++) {
    const r = rangeInt(rng, 2, 4);
    const a1 = rangeInt(rng, 1, 5);
    const seq = [a1, a1 * r, a1 * r * r, a1 * r * r * r];
    const val = a1 * Math.pow(r, 4);
    const { o, correct } = numOptions(rng, val, Math.max(3, Math.round(val * 0.2)));
    out.push({
      t: {
        uz: `${seq.join(", ")} ... ketma-ketlikdagi keyingi son qaysi?`,
        ru: `Какое следующее число в последовательности ${seq.join(", ")} ...?`,
        en: `What is the next number in the sequence ${seq.join(", ")} ...?`,
      },
      o,
      correct,
    });
  }
  // Sonlar ketma-ketligi (navbatma-navbat qo'shish)
  for (let i = 0; i < 25; i++) {
    const a = rangeInt(rng, 2, 20);
    const d = rangeInt(rng, 2, 9);
    const step = rangeInt(rng, 2, 6);
    const seq = [a, a + d, a + d + step, a + d + step + d];
    const val = a + d + step + d + step;
    const { o, correct } = numOptions(rng, val, 4);
    out.push({
      t: {
        uz: `${seq.join(", ")} ... ketma-ketlikdagi keyingi son qaysi?`,
        ru: `Какое следующее число в последовательности ${seq.join(", ")} ...?`,
        en: `What is the next number in the sequence ${seq.join(", ")} ...?`,
      },
      o,
      correct,
    });
  }
  // Mantiqiy sillogizmlar
  const syl: Array<{ general: L3; mid: L3; concl: L3 }> = [
    {
      general: { uz: "Barcha gullar o'simlikdir", ru: "Все цветы — растения", en: "All flowers are plants" },
      mid: { uz: "Atirgul — gul", ru: "Роза — это цветок", en: "A rose is a flower" },
      concl: { uz: "Atirgul — o'simlik", ru: "Роза — растение", en: "A rose is a plant" },
    },
    {
      general: { uz: "Barcha qushlar uchadi", ru: "Все птицы летают", en: "All birds fly" },
      mid: { uz: "Chumchuq — qush", ru: "Воробей — это птица", en: "A sparrow is a bird" },
      concl: { uz: "Chumchuq uchadi", ru: "Воробей летает", en: "A sparrow flies" },
    },
    {
      general: { uz: "Barcha sportchilar kuchli", ru: "Все спортсмены сильные", en: "All athletes are strong" },
      mid: { uz: "Sanjar — sportchi", ru: "Санжар — спортсмен", en: "Sanjar is an athlete" },
      concl: { uz: "Sanjar kuchli", ru: "Санжар сильный", en: "Sanjar is strong" },
    },
    {
      general: { uz: "Barcha darsliklar bilim manbaidir", ru: "Все учебники — источник знаний", en: "All textbooks are a source of knowledge" },
      mid: { uz: "Bu kitob — darslik", ru: "Эта книга — учебник", en: "This book is a textbook" },
      concl: { uz: "Bu kitob bilim manbaidir", ru: "Эта книга — источник знаний", en: "This book is a source of knowledge" },
    },
    {
      general: { uz: "Barcha dasturchilar kompyuterda ishlaydi", ru: "Все программисты работают за компьютером", en: "All programmers work on computers" },
      mid: { uz: "Alisher — dasturchi", ru: "Алишер — программист", en: "Alisher is a programmer" },
      concl: { uz: "Alisher kompyuterda ishlaydi", ru: "Алишер работает за компьютером", en: "Alisher works on a computer" },
    },
    {
      general: { uz: "Agar yomg'ir yoqsa, yo'llar ho'l bo'ladi", ru: "Если идёт дождь, дороги мокрые", en: "If it rains, the roads get wet" },
      mid: { uz: "Hozir yomg'ir yoqmoqda", ru: "Сейчас идёт дождь", en: "It is raining now" },
      concl: { uz: "Yo'llar ho'l bo'ladi", ru: "Дороги мокрые", en: "The roads are wet" },
    },
  ];
  for (let i = 0; i < 30; i++) {
    const s = syl[i % syl.length]!;
    const wrongs = shuffle(rng, [
      {
        uz: `${s.concl.uz} emas`,
        ru: `Не верно, что ${s.concl.ru.toLowerCase()}`,
        en: `It is not true that ${s.concl.en}`,
      },
      {
        uz: `${s.general.uz} — noto'g'ri hukm`,
        ru: `${s.general.ru} — неверное утверждение`,
        en: `"${s.general.en}" is a false statement`,
      },
      {
        uz: `Bundan hech qanday xulosa chiqmaydi`,
        ru: `Из этого нельзя сделать вывод`,
        en: `No conclusion can be drawn from this`,
      },
      {
        uz: `${s.mid.uz} — noto'g'ri`,
        ru: `${s.mid.ru} — неверно`,
        en: `"${s.mid.en}" is false`,
      },
    ]);
    const built = optionsFor(rng, s.concl, wrongs);
    out.push({
      t: {
        uz: `${s.general.uz}. ${s.mid.uz}. Qaysi xulosa to'g'ri?`,
        ru: `${s.general.ru}. ${s.mid.ru}. Какой вывод верен?`,
        en: `${s.general.en}. ${s.mid.en}. Which conclusion is correct?`,
      },
      ...built,
    });
  }
  // Yosh masalalari
  for (let i = 0; i < 25; i++) {
    const age = rangeInt(rng, 8, 18);
    const k = rangeInt(rng, 2, 5);
    const father = age * k;
    const { o, correct } = numOptions(rng, father, 5);
    out.push({
      t: {
        uz: `O'g'il ${age} yoshda, otasi esa uning ${k} barobar yoshda. Otasi nechchi yoshda?`,
        ru: `Сыну ${age} лет, а отец в ${k} раза старше. Сколько лет отцу?`,
        en: `The son is ${age} years old and his father is ${k} times his age. How old is the father?`,
      },
      o,
      correct,
    });
  }
  // Tezlik-vaqt-masofa
  for (let i = 0; i < 25; i++) {
    const v = rangeInt(rng, 30, 90);
    const t = rangeInt(rng, 2, 9);
    const s = v * t;
    const { o, correct } = numOptions(rng, s, Math.max(10, Math.round(s * 0.12)));
    out.push({
      t: {
        uz: `Avtomobil ${v} km/soat tezlik bilan ${t} soat yurdi. Qancha yo'l bosib o'tdi?`,
        ru: `Автомобиль ехал ${t} часов со скоростью ${v} км/ч. Какой путь он проехал?`,
        en: `A car drove for ${t} hours at ${v} km/h. What distance did it cover?`,
      },
      o,
      correct,
    });
  }
  // Taqqoslash — eng kattasi
  for (let i = 0; i < 20; i++) {
    const nums = shuffle(rng, [
      rangeInt(rng, 10, 90),
      rangeInt(rng, 100, 900),
      rangeInt(rng, 2, 9),
      rangeInt(rng, 91, 99),
    ]);
    const max = Math.max(...nums);
    const opts = nums.map((n) => same(String(n)));
    out.push({
      t: {
        uz: `Qaysi son eng katta?`,
        ru: `Какое число наибольшее?`,
        en: `Which number is the largest?`,
      },
      o: opts,
      correct: opts.findIndex((x) => x.uz === String(max)),
    });
  }
  return dedupe(out);
}

/* ==================== INGLIZ TILI — GRAMMATIKA ASOSLARI ==================== */

const FILL_LABELS: Array<(s: string) => L3> = [
  (s) => ({ uz: `To'ldiring: ${s}`, ru: `Заполните пропуск: ${s}`, en: `Fill in the blank: ${s}` }),
  (s) => ({ uz: `To'g'ri variantni tanlang: ${s}`, ru: `Выберите правильный вариант: ${s}`, en: `Choose the correct option: ${s}` }),
];

function gramQ(rng: Rng, s: string, correct: string, wrongs: string[]): QGen {
  // Kafolat: kamida 4 ta bir-biridan farq qiladigan variant
  const built = optionsFor(
    rng,
    same(correct),
    shuffle(rng, wrongs.map((w) => same(w)))
  );
  const pre = FILL_LABELS[rangeInt(rng, 0, FILL_LABELS.length - 1)]!(s);
  return { t: pre, ...built };
}

function gramBank(rng: Rng): QGen[] {
  const out: QGen[] = [];

  /* Present Simple — 3-shaxs -s */
  const verbs3: Array<[string, string]> = [
    ["go", "goes"], ["do", "does"], ["watch", "watches"], ["study", "studies"],
    ["play", "plays"], ["read", "reads"], ["write", "writes"], ["speak", "speaks"],
    ["live", "lives"], ["work", "works"], ["like", "likes"], ["want", "wants"],
    ["need", "needs"], ["open", "opens"], ["close", "closes"], ["finish", "finishes"],
    ["teach", "teaches"], ["wash", "washes"], ["carry", "carries"], ["fly", "flies"],
    ["run", "runs"], ["walk", "walks"], ["eat", "eats"], ["drink", "drinks"],
    ["come", "comes"], ["make", "makes"], ["take", "takes"], ["give", "gives"],
    ["know", "knows"], ["think", "thinks"],
  ];
  for (const [base, third] of verbs3) {
    out.push(gramQ(rng, `He ___ every morning (${base}).`, third, [base, `${base}ing`, `${base}ed`, `${base}s`, `${base}ies`]));
    out.push(gramQ(rng, `They ___ fast (${base}).`, base, [third, `${base}ing`, `${base}ed`, `${base}es`]));
  }

  /* Negatsiya va so'roq (do/does) */
  const negVerbs = ["like", "want", "know", "play", "work", "watch", "speak", "eat", "drink", "need"];
  for (const v of negVerbs) {
    out.push(gramQ(rng, `He ___ ${v} coffee.`, "doesn't", ["don't", "isn't", "not", "doesnt", "doesn'ts"]));
    out.push(gramQ(rng, `___ you speak English?`, "Do", ["Does", "Are", "Is", "Have"]));
  }
  for (const v of ["go", "do", "have", "watch", "study"]) {
    out.push(gramQ(rng, `___ she ${v === "have" ? "have" : `${v} (${v})`} to music?`, "Does", ["Do", "Is", "Are", "Has"]));
  }

  /* To be — am/is/are */
  const beItems: Array<[string, string]> = [
    ["I ___ a student.", "am"],
    ["She ___ my sister.", "is"],
    ["He ___ at home now.", "is"],
    ["We ___ friends.", "are"],
    ["They ___ happy today.", "are"],
    ["You ___ my best friend.", "are"],
    ["My father ___ a doctor.", "is"],
    ["The books ___ on the table.", "are"],
    ["This ___ my pen.", "is"],
    ["I ___ ready for the lesson.", "am"],
    ["Cats ___ cute animals.", "are"],
    ["Tashkent ___ a big city.", "is"],
  ];
  for (const [s, ans] of beItems) {
    out.push(gramQ(rng, s, ans, ["am", "is", "are", "be", "been"].filter((x) => x !== ans)));
  }

  /* Past Simple — muntazam fe'llar */
  const regVerbs = ["play", "work", "walk", "talk", "help", "learn", "clean", "cook", "call", "jump", "listen", "open", "visit", "start", "live", "move", "use", "enjoy", "ask", "answer"];
  for (const v of regVerbs) {
    out.push(gramQ(rng, `Yesterday I ___ (${v}) with my friends.`, `${v}ed`, [v, `${v}ing`, `${v}s`, v.endsWith("e") ? `${v}t` : `${v}e`]));
  }

  /* Past Simple — noto'g'ri fe'llar */
  const irrVerbs: Array<[string, string]> = [
    ["go", "went"], ["see", "saw"], ["take", "took"], ["give", "gave"],
    ["come", "came"], ["make", "made"], ["buy", "bought"], ["write", "wrote"],
    ["eat", "ate"], ["drink", "drank"], ["run", "ran"], ["find", "found"],
    ["know", "knew"], ["think", "thought"], ["teach", "taught"], ["bring", "brought"],
    ["begin", "began"], ["speak", "spoke"], ["swim", "swam"], ["sleep", "slept"],
    ["feel", "felt"], ["leave", "left"], ["meet", "met"], ["send", "sent"],
    ["build", "built"], ["lose", "lost"], ["sing", "sang"], ["sit", "sat"],
    ["stand", "stood"], ["tell", "told"],
  ];
  for (const [base, past] of irrVerbs) {
    out.push(gramQ(rng, `Last week I ___ my friend and we talked (${base}).`, past, [base, `${base}ed`, `${base}ing`, base === past ? `${base}en` : base]));
  }

  /* Continuous / Future / Perfect */
  const cont: Array<[string, string, string[]]> = [
    ["Look! The baby ___ now.", "is sleeping", ["sleeps", "sleep", "slept", "are sleeping", "sleeping"]],
    ["They ___ football at the moment.", "are playing", ["play", "plays", "played", "is playing", "playing"]],
    ["I ___ a letter right now.", "am writing", ["write", "writes", "wrote", "is writing", "writing"]],
    ["We ___ dinner when she came.", "were having", ["have", "had", "has", "was having", "having"]],
    ["Tomorrow I ___ my grandmother.", "will visit", ["visit", "visited", "am visit", "will visited", "visiting"]],
    ["Next year he ___ a new car.", "will buy", ["buys", "bought", "buying", "will bought", "is buy"]],
    ["She has ___ finished her homework.", "already", ["yet", "since", "for", "ever", "never"]],
    ["I have lived here ___ 2015.", "since", ["for", "from", "at", "during", "in"]],
    ["I have known him ___ ten years.", "for", ["since", "from", "during", "at", "ago"]],
    ["When I came, he ___ TV.", "was watching", ["watched", "watches", "is watching", "were watching", "watch"]],
    ["I ___ never been to London.", "have", ["has", "had", "am", "did", "was"]],
    ["She ___ just come back.", "has", ["have", "had", "is", "did", "was"]],
    ["While I ___ , the phone rang.", "was reading", ["read", "reads", "am reading", "were reading", "reading"]],
    ["While they ___, it started to rain.", "were walking", ["walked", "walk", "was walking", "are walking", "walking"]],
    ["At 8 p.m. yesterday we ___ TV.", "were watching", ["watched", "watch", "was watching", "are watching", "watching"]],
    ["I ___ to school tomorrow.", "will go", ["went", "goes", "going", "will went", "am go"]],
    ["Listen! Someone ___ the piano.", "is playing", ["plays", "play", "played", "are playing", "playing"]],
    ["We ___ our homework every day.", "do", ["does", "doing", "did", "is do", "done"]],
    ["My mother ___ tea every morning.", "drinks", ["drink", "drinking", "drank", "drinkes", "is drink"]],
  ];
  for (const [s, ans, wrongs] of cont) {
    out.push(gramQ(rng, s, ans, wrongs));
  }

  /* Artikllar */
  const articleNouns = ["book", "car", "house", "phone", "idea", "egg", "orange", "umbrella", "window", "table", "apple", "hour", "university", "animal", "island", "box", "eye", "ear", "arm", "office", "elephant", "hotel", "ice cream", "unit", "uniform"];
  for (const noun of articleNouns) {
    const an = /^(a|e|i|o|hou|um)/.test(noun) && noun !== "university";
    const correct = an ? "an" : "a";
    out.push(gramQ(rng, `I bought ___ ${noun} yesterday.`, correct, ["a", "an", "the", "—", "some"].filter((x) => x !== correct)));
  }

  /* Predloglar */
  const preps: Array<[string, string, string[]]> = [
    ["I get up ___ 7 o'clock.", "at", ["in", "on", "for", "by", "since"]],
    ["My birthday is ___ May.", "in", ["on", "at", "by", "to", "since"]],
    ["We meet ___ Monday.", "on", ["in", "at", "to", "by", "for"]],
    ["He lives ___ Tashkent.", "in", ["on", "at", "to", "from", "by"]],
    ["The book is ___ the table.", "on", ["in", "at", "over", "under", "to"]],
    ["I go to school ___ bus.", "by", ["on", "in", "with", "at", "for"]],
    ["She is good ___ math.", "at", ["in", "on", "for", "with", "by"]],
    ["This gift is ___ you.", "for", ["to", "with", "at", "of", "by"]],
    ["I come ___ Uzbekistan.", "from", ["of", "in", "out", "at", "to"]],
    ["We are waiting ___ the bus.", "for", ["to", "at", "on", "of", "with"]],
    ["He is afraid ___ dogs.", "of", ["from", "by", "with", "at", "for"]],
    ["I depend ___ my parents.", "on", ["of", "from", "at", "to", "for"]],
    ["She was born ___ 2010.", "in", ["on", "at", "since", "by", "for"]],
    ["I have been here ___ morning.", "since", ["from", "for", "at", "in", "on"]],
    ["I lived there ___ two years.", "for", ["since", "during", "at", "from", "in"]],
    ["The cat is ___ the box.", "in", ["on", "at", "over", "by", "of"]],
    ["Listen ___ me, please.", "to", ["at", "for", "with", "of", "on"]],
    ["I agree ___ you.", "with", ["to", "for", "of", "at", "on"]],
  ];
  for (const [s, ans, wrongs] of preps) {
    out.push(gramQ(rng, s, ans, wrongs));
  }

  /* Olmoshlar */
  const pron: Array<[string, string, string[]]> = [
    ["This is my brother. ___ is a student.", "He", ["She", "It", "They", "We", "You"]],
    ["I like Mary. I see ___ every day.", "her", ["she", "hers", "him", "they", "he"]],
    ["The bag is ___ (I).", "mine", ["my", "me", "myself", "our", "my one"]],
    ["Give the pen to ___ (he).", "him", ["he", "his", "himself", "they", "she"]],
    ["___ is raining.", "It", ["He", "She", "This", "That one", "There"]],
    ["They washed ___ hands.", "their", ["theirs", "them", "they", "there", "its"]],
    ["She looked at ___ in the mirror.", "herself", ["her", "hers", "she", "himself", "it"]],
    ["Is this ___ book? (you)", "your", ["yours", "you", "yourself", "my", "our"]],
    ["The cat drinks ___ milk. (it)", "its", ["it's", "it", "itself", "his", "their"]],
    ["We built this house ___.", "ourselves", ["ourself", "ours", "us", "them", "our"]],
    ["They invited ___ to the party. (we)", "us", ["we", "our", "ours", "they", "our self"]],
    ["That bike is not mine, it is ___ (they).", "theirs", ["their", "them", "they", "there", "its"]],
  ];
  for (const [s, ans, wrongs] of pron) {
    out.push(gramQ(rng, s, ans, wrongs));
  }

  /* Ko'plik */
  const plurals: Array<[string, string]> = [
    ["child", "children"], ["tooth", "teeth"], ["foot", "feet"], ["man", "men"],
    ["woman", "women"], ["mouse", "mice"], ["goose", "geese"], ["person", "people"],
    ["box", "boxes"], ["city", "cities"], ["leaf", "leaves"], ["wolf", "wolves"],
    ["knife", "knives"], ["life", "lives"], ["bus", "buses"], ["fish", "fish"],
    ["sheep", "sheep"], ["deer", "deer"], ["tomato", "tomatoes"], ["potato", "potatoes"],
    ["baby", "babies"], ["story", "stories"], ["day", "days"], ["key", "keys"],
  ];
  for (const [sing, plur] of plurals) {
    out.push(gramQ(rng, `One ${sing}, two ___.`, plur, [`${sing}s`, `${sing}es`, `${sing}en`, `${sing}ies`, sing].filter((x) => x !== plur)));
  }

  /* Qiyoslash darajalari */
  const comp: Array<[string, string, string]> = [
    ["big", "bigger", "biggest"], ["small", "smaller", "smallest"], ["tall", "taller", "tallest"],
    ["fast", "faster", "fastest"], ["long", "longer", "longest"], ["short", "shorter", "shortest"],
    ["old", "older", "oldest"], ["young", "younger", "youngest"], ["happy", "happier", "happiest"],
    ["easy", "easier", "easiest"], ["good", "better", "best"], ["bad", "worse", "worst"],
    ["many", "more", "most"], ["little", "less", "least"], ["strong", "stronger", "strongest"],
  ];
  for (const [base, cmp, sup] of comp) {
    out.push(gramQ(rng, `An elephant is ___ than a dog. (${base})`, cmp, [sup, base, `${base}est`, `${base}ly`, `${base}ing`].filter((x) => x !== cmp)));
    out.push(gramQ(rng, `This is the ___ book in the library. (${base})`, sup, [cmp, base, `${base}er`, `${base}ly`, `${base}ful`].filter((x) => x !== sup)));
  }

  /* Modallik fe'llari */
  const modals: Array<[string, string, string[]]> = [
    ["You ___ smoke here. It's forbidden.", "mustn't", ["must", "can", "should", "may", "could"]],
    ["I ___ swim when I was five.", "could", ["can", "must", "should", "may", "am"]],
    ["You look tired. You ___ rest.", "should", ["must", "can't", "may", "would", "could not"]],
    ["___ I open the window?", "May", ["Must", "Should", "Am", "Do", "Have"]],
    ["Students ___ wear uniforms at our school.", "must", ["may", "could", "would", "might", "am"]],
    ["He ___ speak three languages.", "can", ["must", "should", "may", "will be", "does"]],
    ["It's late. We ___ go home.", "must", ["may", "could", "might", "would rather not", "are"]],
    ["You ___ not run near the pool. It's dangerous.", "should", ["shoulds", "musts", "cans", "mays", "wills"]],
  ];
  for (const [s, ans, wrongs] of modals) {
    out.push(gramQ(rng, s, ans, wrongs));
  }

  /* much/many, some/any */
  const quant: Array<[string, string, string[]]> = [
    ["How ___ water do you drink?", "much", ["many", "few", "lot", "some", "any"]],
    ["How ___ books do you have?", "many", ["much", "little", "few", "any", "lot"]],
    ["There is ___ milk in the fridge.", "some", ["any", "many", "a", "much", "few"]],
    ["Is there ___ bread left?", "any", ["some", "many", "much", "a", "few"]],
    ["I don't have ___ money.", "much", ["many", "few", "some", "a", "lot"]],
    ["She has ___ friends in London.", "many", ["much", "little", "any", "a", "much of"]],
    ["There are ___ apples on the plate.", "some", ["any", "much", "a", "little", "lot"]],
    ["We need ___ eggs for the cake.", "a few", ["a little", "much", "any", "many of", "little"]],
    ["There isn't ___ sugar in my tea.", "much", ["many", "few", "some", "a", "lot"]],
    ["How ___ time do we have?", "much", ["many", "few", "little", "some", "lot"]],
  ];
  for (const [s, ans, wrongs] of quant) {
    out.push(gramQ(rng, s, ans, wrongs));
  }

  /* there is / there are */
  const thereSing = ["a park", "a bank", "a museum", "a library", "a pool", "a market", "a hospital", "a cinema"];
  const therePlur = ["two parks", "three banks", "five museums", "many libraries", "four pools", "two markets", "three hospitals", "two cinemas"];
  for (const n of thereSing) {
    out.push(gramQ(rng, `___ ${n} near my house.`, "There is", ["There are", "There be", "There was were", "It is", "This is"]));
  }
  for (const n of therePlur) {
    out.push(gramQ(rng, `___ ${n} in this city.`, "There are", ["There is", "There am", "There be", "It is", "This is"]));
  }

  /* So'roq so'zlari */
  const qw: Array<[string, string, string[]]> = [
    ["___ is your name?", "What", ["Where", "When", "Why", "Who", "Which"]],
    ["___ do you live?", "Where", ["What", "Who", "How many", "When", "Why"]],
    ["___ is your birthday?", "When", ["Where", "What", "Which", "Who", "How"]],
    ["___ are you late?", "Why", ["What", "Where", "Who", "Which", "How many"]],
    ["___ is your best friend?", "Who", ["What", "When", "Why", "Where", "Which"]],
    ["___ old are you?", "How", ["What", "When", "Which", "Who", "Why"]],
    ["___ book is this — yours or mine?", "Whose", ["Who", "Which", "What", "Whom", "Which of"]],
    ["___ many brothers do you have?", "How", ["What", "Who", "When", "Why", "Which"]],
    ["___ do you go to school? — By bus.", "How", ["Why", "What", "When", "Where", "Who"]],
    ["___ do you get up? — At 6 a.m.", "When", ["What", "Who", "Which", "Why", "How many"]],
  ];
  for (const [s, ans, wrongs] of qw) {
    out.push(gramQ(rng, s, ans, wrongs));
  }

  return dedupe(out);
}

/* ==================== INGLIZ TILI — SO'Z BOYLIKI ==================== */

type VocabWord = { en: string; uz: string; ru: string };

const VOCAB: VocabWord[] = [
  { en: "book", uz: "kitob", ru: "книга" },
  { en: "pen", uz: "qalam", ru: "ручка" },
  { en: "teacher", uz: "o'qituvchi", ru: "учитель" },
  { en: "student", uz: "talaba", ru: "студент" },
  { en: "school", uz: "maktab", ru: "школа" },
  { en: "water", uz: "suv", ru: "вода" },
  { en: "bread", uz: "non", ru: "хлеб" },
  { en: "apple", uz: "olma", ru: "яблоко" },
  { en: "mother", uz: "ona", ru: "мать" },
  { en: "father", uz: "ota", ru: "отец" },
  { en: "sister", uz: "singil", ru: "сестра" },
  { en: "brother", uz: "uka", ru: "брат" },
  { en: "friend", uz: "do'st", ru: "друг" },
  { en: "city", uz: "shahar", ru: "город" },
  { en: "village", uz: "qishloq", ru: "деревня" },
  { en: "road", uz: "yo'l", ru: "дорога" },
  { en: "sun", uz: "quyosh", ru: "солнце" },
  { en: "moon", uz: "oy", ru: "луна" },
  { en: "star", uz: "yulduz", ru: "звезда" },
  { en: "sky", uz: "osmon", ru: "небо" },
  { en: "tree", uz: "daraxt", ru: "дерево" },
  { en: "flower", uz: "gul", ru: "цветок" },
  { en: "rain", uz: "yomg'ir", ru: "дождь" },
  { en: "snow", uz: "qor", ru: "снег" },
  { en: "wind", uz: "shamol", ru: "ветер" },
  { en: "fire", uz: "olov", ru: "огонь" },
  { en: "hand", uz: "qo'l", ru: "рука" },
  { en: "eye", uz: "ko'z", ru: "глаз" },
  { en: "heart", uz: "yurak", ru: "сердце" },
  { en: "head", uz: "bosh", ru: "голова" },
  { en: "money", uz: "pul", ru: "деньги" },
  { en: "work", uz: "ish", ru: "работа" },
  { en: "time", uz: "vaqt", ru: "время" },
  { en: "year", uz: "yil", ru: "год" },
  { en: "month", uz: "oy (kalendar)", ru: "месяц" },
  { en: "day", uz: "kun", ru: "день" },
  { en: "night", uz: "tun", ru: "ночь" },
  { en: "morning", uz: "ertalab", ru: "утро" },
  { en: "evening", uz: "kechqurun", ru: "вечер" },
  { en: "food", uz: "ovqat", ru: "еда" },
  { en: "milk", uz: "sut", ru: "молоко" },
  { en: "tea", uz: "choy", ru: "чай" },
  { en: "sugar", uz: "shakar", ru: "сахар" },
  { en: "salt", uz: "tuz", ru: "соль" },
  { en: "meat", uz: "go'sht", ru: "мясо" },
  { en: "fruit", uz: "meva", ru: "фрукт" },
  { en: "house", uz: "uy", ru: "дом" },
  { en: "door", uz: "eshik", ru: "дверь" },
  { en: "window", uz: "oyna", ru: "окно" },
  { en: "table", uz: "stol", ru: "стол" },
  { en: "chair", uz: "stul", ru: "стул" },
  { en: "bed", uz: "karavot", ru: "кровать" },
  { en: "car", uz: "avtomobil", ru: "автомобиль" },
  { en: "train", uz: "poyezd", ru: "поезд" },
  { en: "plane", uz: "samolyot", ru: "самолёт" },
  { en: "big", uz: "katta", ru: "большой" },
  { en: "small", uz: "kichik", ru: "маленький" },
  { en: "new", uz: "yangi", ru: "новый" },
  { en: "old", uz: "qari", ru: "старый" },
  { en: "good", uz: "yaxshi", ru: "хороший" },
  { en: "bad", uz: "yomon", ru: "плохой" },
  { en: "beautiful", uz: "chiroyli", ru: "красивый" },
  { en: "fast", uz: "tez", ru: "быстрый" },
  { en: "slow", uz: "sekin", ru: "медленный" },
  { en: "hot", uz: "issiq", ru: "горячий" },
  { en: "cold", uz: "sovuq", ru: "холодный" },
  { en: "happy", uz: "baxtli", ru: "счастливый" },
  { en: "sad", uz: "xafa", ru: "грустный" },
  { en: "strong", uz: "kuchli", ru: "сильный" },
  { en: "weak", uz: "kuchsiz", ru: "слабый" },
  { en: "clean", uz: "toza", ru: "чистый" },
  { en: "dirty", uz: "kirli", ru: "грязный" },
  { en: "easy", uz: "oson", ru: "лёгкий" },
  { en: "difficult", uz: "qiyin", ru: "трудный" },
  { en: "rich", uz: "boy", ru: "богатый" },
  { en: "poor", uz: "kambag'al", ru: "бедный" },
  { en: "to read", uz: "o'qimoq", ru: "читать" },
  { en: "to write", uz: "yozmoq", ru: "писать" },
  { en: "to speak", uz: "gapirmoq", ru: "говорить" },
  { en: "to listen", uz: "tinglamoq", ru: "слушать" },
  { en: "to see", uz: "ko'rmoq", ru: "видеть" },
  { en: "to walk", uz: "yurmoq", ru: "ходить" },
  { en: "to run", uz: "yugurmoq", ru: "бежать" },
  { en: "to eat", uz: "yemoq", ru: "есть" },
  { en: "to drink", uz: "ichmoq", ru: "пить" },
  { en: "to sleep", uz: "uxlamoq", ru: "спать" },
  { en: "to work", uz: "ishlamoq", ru: "работать" },
  { en: "to play", uz: "o'ynamoq", ru: "играть" },
  { en: "to learn", uz: "o'rganmoq", ru: "учиться" },
  { en: "to help", uz: "yordam bermoq", ru: "помогать" },
  { en: "to buy", uz: "sotib olmoq", ru: "покупать" },
  { en: "to sell", uz: "sotmoq", ru: "продавать" },
  { en: "to open", uz: "ochmoq", ru: "открывать" },
  { en: "to close", uz: "yopmoq", ru: "закрывать" },
  { en: "to love", uz: "sevmoq", ru: "любить" },
  { en: "to laugh", uz: "kulmoq", ru: "смеяться" },
  { en: "to cry", uz: "yig'lamoq", ru: "плакать" },
  { en: "to think", uz: "o'ylamoq", ru: "думать" },
  { en: "to know", uz: "bilmoq", ru: "знать" },
  { en: "to understand", uz: "tushunmoq", ru: "понимать" },
  { en: "to remember", uz: "eslamoq", ru: "помнить" },
  { en: "to forget", uz: "unutmoq", ru: "забывать" },
  { en: "to begin", uz: "boshlamoq", ru: "начинать" },
  { en: "to finish", uz: "tugatmoq", ru: "заканчивать" },
  { en: "to wait", uz: "kutmoq", ru: "ждать" },
  { en: "to find", uz: "topmoq", ru: "находить" },
  { en: "to lose", uz: "yo'qotmoq", ru: "терять" },
  { en: "to give", uz: "bermoq", ru: "давать" },
  { en: "to take", uz: "olmoq", ru: "брать" },
  { en: "to bring", uz: "olib kelmoq", ru: "приносить" },
  { en: "to send", uz: "yubormoq", ru: "отправлять" },
  { en: "to ask", uz: "so'rash", ru: "спрашивать" },
  { en: "to answer", uz: "javob berish", ru: "отвечать" },
  { en: "winter", uz: "qish", ru: "зима" },
  { en: "spring", uz: "bahor", ru: "весна" },
  { en: "summer", uz: "yoz (fasl)", ru: "лето" },
  { en: "autumn", uz: "kuz (fasl)", ru: "осень" },
  { en: "river", uz: "daryo", ru: "река" },
  { en: "sea", uz: "dengiz", ru: "море" },
  { en: "mountain", uz: "tog'", ru: "гора" },
  { en: "forest", uz: "o'rmon", ru: "лес" },
  { en: "field", uz: "dala", ru: "поле" },
  { en: "bird", uz: "qush", ru: "птица" },
  { en: "horse", uz: "ot (hayvon)", ru: "лошадь" },
  { en: "dog", uz: "it", ru: "собака" },
  { en: "cat", uz: "mushuk", ru: "кошка" },
  { en: "cow", uz: "sigir", ru: "корова" },
  { en: "sheep", uz: "qo'ycha", ru: "овца" },
  { en: "doctor", uz: "shifokor", ru: "врач" },
  { en: "hospital", uz: "kasalxona", ru: "больница" },
  { en: "market", uz: "bozor", ru: "рынок" },
  { en: "shop", uz: "do'kon", ru: "магазин" },
  { en: "street", uz: "ko'cha", ru: "улица" },
  { en: "bridge", uz: "ko'prik", ru: "мост" },
  { en: "garden", uz: "bog'", ru: "сад" },
  { en: "kitchen", uz: "oshxona", ru: "кухня" },
  { en: "room", uz: "xona (uy bo'limi)", ru: "комната" },
  { en: "family", uz: "oila", ru: "семья" },
  { en: "child", uz: "bola", ru: "ребёнок" },
  { en: "name", uz: "ism", ru: "имя" },
  { en: "language", uz: "til", ru: "язык" },
  { en: "word", uz: "so'z", ru: "слово" },
  { en: "question", uz: "savol", ru: "вопрос" },
  { en: "answer", uz: "javob", ru: "ответ" },
  { en: "lesson", uz: "dars", ru: "урок" },
  { en: "homework", uz: "uy vazifasi", ru: "домашнее задание" },
  { en: "exam", uz: "imtihon", ru: "экзамен" },
  { en: "holiday", uz: "bayram", ru: "праздник" },
  { en: "gift", uz: "sovg'a", ru: "подарок" },
  { en: "picture", uz: "rasm", ru: "картина" },
  { en: "song", uz: "qo'shiq", ru: "песня" },
  { en: "game", uz: "o'yin", ru: "игра" },
  { en: "sport", uz: "sport", ru: "спорт" },
  { en: "dream", uz: "orzu", ru: "мечта" },
  { en: "life", uz: "hayot", ru: "жизнь" },
  { en: "health", uz: "salomatlik", ru: "здоровье" },
  { en: "peace", uz: "tinchlik", ru: "мир" },
  { en: "war", uz: "urush", ru: "война" },
  { en: "history", uz: "tarix", ru: "история" },
  { en: "science", uz: "fan (ilm)", ru: "наука" },
  { en: "number", uz: "son", ru: "число" },
  { en: "letter", uz: "harf", ru: "буква" },
  { en: "story", uz: "hikoya", ru: "рассказ" },
  { en: "news", uz: "yangilik", ru: "новость" },
  { en: "voice", uz: "ovoz", ru: "голос" },
  { en: "smile", uz: "tabassum", ru: "улыбка" },
  { en: "tear", uz: "ko'z yoshi", ru: "слеза" },
  { en: "goal", uz: "maqsad", ru: "цель" },
  { en: "plan", uz: "reja", ru: "план" },
  { en: "idea", uz: "fikr", ru: "идея" },
  { en: "hope", uz: "umid", ru: "надежда" },
  { en: "luck", uz: "omad", ru: "удача" },
  { en: "truth", uz: "haqiqat", ru: "правда" },
  { en: "secret", uz: "sir", ru: "секрет" },
  { en: "quiet", uz: "sokin", ru: "тихий" },
  { en: "loud", uz: "baland ovozli", ru: "громкий" },
  { en: "early", uz: "erta", ru: "ранний" },
  { en: "late", uz: "kech", ru: "поздний" },
  { en: "warm", uz: "iliq", ru: "тёплый" },
  { en: "dark", uz: "qorong'i", ru: "тёмный" },
  { en: "light", uz: "yorug'", ru: "свет" },
  { en: "deep", uz: "chuqur", ru: "глубокий" },
  { en: "high", uz: "baland", ru: "высокий" },
  { en: "long", uz: "uzun", ru: "длинный" },
  { en: "wide", uz: "keng", ru: "широкий" },
  { en: "heavy", uz: "og'ir", ru: "тяжёлый" },
  { en: "soft", uz: "yumshoq", ru: "мягкий" },
  { en: "hard", uz: "qattiq", ru: "твёрдый" },
  { en: "sweet", uz: "shirin", ru: "сладкий" },
  { en: "expensive", uz: "qimmat", ru: "дорогой" },
  { en: "cheap", uz: "arzon", ru: "дешёвый" },
  { en: "safe", uz: "xavfsiz", ru: "безопасный" },
  { en: "dangerous", uz: "xavfli", ru: "опасный" },
  { en: "important", uz: "muhim", ru: "важный" },
  { en: "famous", uz: "mashhur", ru: "известный" },
  { en: "ready", uz: "tayyor", ru: "готовый" },
  { en: "correct", uz: "to'g'ri (aniq)", ru: "правильный" },
  { en: "wrong", uz: "noto'g'ri", ru: "неправильный" },
  { en: "same", uz: "bir xil", ru: "одинаковый" },
  { en: "different", uz: "har xil", ru: "разный" },
  { en: "full", uz: "to'la", ru: "полный" },
  { en: "empty", uz: "bo'sh", ru: "пустой" },
  { en: "open", uz: "ochiq", ru: "открытый" },
  { en: "closed", uz: "yopiq", ru: "закрытый" },
  { en: "cup", uz: "piyola", ru: "чашка" },
  { en: "spoon", uz: "qoshiq", ru: "ложка" },
  { en: "key", uz: "kalit", ru: "ключ" },
  { en: "bag", uz: "sumka", ru: "сумка" },
  { en: "shoe", uz: "oyoq kiyim", ru: "обувь" },
  { en: "shirt", uz: "ko'ylak", ru: "рубашка" },
  { en: "hat", uz: "shlyapa", ru: "шляпа" },
  { en: "ring", uz: "uzuk", ru: "кольцо" },
  { en: "mirror", uz: "oyna (ko'zgu)", ru: "зеркало" },
  { en: "clock", uz: "soat", ru: "часы" },
  { en: "candle", uz: "sham", ru: "свеча" },
  { en: "rope", uz: "arqon", ru: "верёвка" },
  { en: "needle", uz: "igna", ru: "иголка" },
  { en: "bucket", uz: "kosa", ru: "ведро" },
  { en: "hammer", uz: "bolg'a", ru: "молоток" },
  { en: "ladder", uz: "narvon", ru: "стремянка" },
  { en: "chicken", uz: "tovuq", ru: "курица" },
  { en: "egg", uz: "tuxum", ru: "яйцо" },
  { en: "grape", uz: "uzum", ru: "виноград" },
  { en: "melon", uz: "qovun", ru: "дыня" },
  { en: "carrot", uz: "sabzi", ru: "морковь" },
  { en: "onion", uz: "piyoz", ru: "лук" },
  { en: "rice", uz: "guruch", ru: "рис" },
  { en: "soup", uz: "sho'rva", ru: "суп" },
  { en: "juice", uz: "shira", ru: "сок" },
  { en: "to cook", uz: "pishirmoq", ru: "готовить (еду)" },
];

function vocabBank(rng: Rng): QGen[] {
  const out: QGen[] = [];
  // 1) Word → meaning (variantlar 3 tilda bir xil ma'noga tarjima qilinadi)
  for (const w of VOCAB) {
    const distr = shuffle(rng, VOCAB.filter((x) => x.en !== w.en))
      .slice(0, 6)
      .map((x) => ({ uz: x.uz, ru: x.ru, en: x.en }));
    const built = optionsFor(rng, { uz: w.uz, ru: w.ru, en: w.en }, distr);
    out.push({
      t: {
        uz: `«${w.en}» so'zi nimani anglatadi?`,
        ru: `Что означает слово «${w.en}»?`,
        en: `What does the word "${w.en}" mean?`,
      },
      ...built,
    });
  }
  // 2) Meaning → word (teskari; EN variantda o'zbekcha so'z beriladi)
  for (const w of VOCAB) {
    const distrWords = shuffle(rng, VOCAB.filter((x) => x.en !== w.en && !x.en.includes(" ")))
      .slice(0, 6)
      .map((x) => same(x.en));
    const built = optionsFor(rng, same(w.en), distrWords);
    out.push({
      t: {
        uz: `«${w.uz}» so'zining inglizchasi qaysi?`,
        ru: `Какое английское слово означает «${w.ru}»?`,
        en: `Which English word means "${w.uz}"?`,
      },
      ...built,
    });
  }
  return dedupe(out);
}

/* ==================== LEGACY TARIX (mix) ==================== */

function mixBanks(rng: Rng, banks: QGen[][]): QGen[] {
  return dedupe(shuffle(rng, banks.flat()));
}

/* ==================== EXPORTS ==================== */

export function genLegacyArifmetika(): QGen[] {
  return arifBank(rngOf("legacy-arifmetika"));
}

export function genLegacyAlgebraMantiq(): QGen[] {
  return algBank(rngOf("legacy-algebra-mantiq"));
}

export function genLegacyGrammatika(): QGen[] {
  return gramBank(rngOf("legacy-grammatika"));
}

export function genLegacySozBoyligi(): QGen[] {
  return vocabBank(rngOf("legacy-sozboyligi"));
}

export function genLegacyJahonTarixi(): QGen[] {
  return mixBanks(rngOf("legacy-jahon"), [
    genHistoryQuiz("jahon", 9, "middle"),
    genHistoryQuiz("jahon", 7, "hard"),
    genHistoryQuiz("jahon", 8, "easy"),
  ]);
}

export function genLegacyUzTarixi(): QGen[] {
  return mixBanks(rngOf("legacy-uz"), [
    genHistoryQuiz("uz", 9, "middle"),
    genHistoryQuiz("uz", 7, "hard"),
    genHistoryQuiz("uz", 8, "easy"),
  ]);
}
