/**
 * Listening VERY HARD (C2) savollar generatorlari — tinglab tushunish uchun
 * juda qiyin matnlar (Web Speech API orqali o'qiladi).
 *   genListeningVHard1() — raqamlar, statistika, foizlar, muddatlar (C2)
 *   genListeningVHard2() — idiomalar, inversiya qoidalar, shart gaplari,
 *     hedging, paraphrase, istisnolar va implied xulosa (C2)
 * Distraktorlar deterministik (rngOf) — har safar bir xil natija.
 * Har bir savolda audio mavjud; matnlar 25-40 so'z atrofida, C2 daraja.
 */
import {
  dedupe,
  numOptions,
  optionsFor,
  rngOf,
  same,
  type L3,
  type QGen,
} from "./gen-core";
import { LISTENING_VHARD_IDIOMS } from "./listening-vhard-idioms";
import {
  CLAIMS,
  CONDITIONS,
  EVALUATIONS,
  EXCEPTIONS,
  HEDGES,
  PARAPHRASES,
  RULES,
} from "./listening-vhard-inference";

/* ---------- yordamchilar ---------- */

const ONES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
  "sixteen", "seventeen", "eighteen", "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function below1000(n: number): string {
  let s = "";
  const h = Math.floor(n / 100);
  const rest = n % 100;
  if (h > 0) {
    s += `${ONES[h]} hundred`;
    if (rest > 0) s += " and ";
  }
  if (rest >= 20) {
    s += TENS[Math.floor(rest / 10)]!;
    if (rest % 10 > 0) s += `-${ONES[rest % 10]!}`;
  } else if (rest > 0) {
    s += ONES[rest]!;
  }
  return s;
}

/** 20..9999 oralig'idagi butun sonlarni inglizcha so'z bilan yozish */
function numWords(n: number): string {
  const th = Math.floor(n / 1000);
  const rest = n % 1000;
  if (th === 0) return below1000(n);
  let s = `${below1000(th)} thousand`;
  if (rest > 0) s += `${rest < 100 ? " and " : " "}${below1000(rest)}`;
  return s;
}

const fmtNum = (n: number): string => n.toLocaleString("en-US");

function fmtDur(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h} hours` : `${h} hours ${m} minutes`;
}

function lowerFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

const HOURW = ["twelve", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/* ---------- Savol shablonlari (uz/ru/en) ---------- */

const ADMIT: L3 = {
  uz: "Audioni tinglang: oxir-oqibat nechta kishi qabul qilindi?",
  ru: "Прослушайте аудио: сколько человек в итоге было принято?",
  en: "Listen to the audio: how many were finally admitted?",
};
const ATTEND: L3 = {
  uz: "Audioni tinglang: ochilish plenar yig'ilishida nechta kishi qatnashdi?",
  ru: "Прослушайте аудио: сколько человек участвовало в открытии пленума?",
  en: "Listen to the audio: how many attended the opening plenary?",
};
const REMAIN: L3 = {
  uz: "Audioni tinglang: yakuniy so'zlarda nechta kishi qoldi?",
  ru: "Прослушайте аудио: сколько человек осталось до заключительного слова?",
  en: "Listen to the audio: how many remained for the closing remarks?",
};
const HOURS: L3 = {
  uz: "Audioni tinglang: zal haqiqatan necha soat ochiq bo'ladi?",
  ru: "Прослушайте аудио: сколько часов зал фактически открыт?",
  en: "Listen to the audio: how many hours is the room actually open?",
};
const TOTAL: L3 = {
  uz: "Audioni tinglang: o'n ikki dona jami qancha turadi?",
  ru: "Прослушайте аудио: сколько стоят двенадцать единиц вместе?",
  en: "Listen to the audio: what does a dozen units cost in total?",
};
const OVER: L3 = {
  uz: "Audioni tinglang: jami xarajat byudjetdan qancha oshadi?",
  ru: "Прослушайте аудио: на сколько общая стоимость превышает лимит?",
  en: "Listen to the audio: by how much does the total exceed the allowance?",
};
const POP: L3 = {
  uz: "Audioni tinglang: hozirgi aholi soni qancha?",
  ru: "Прослушайте аудио: какова численность населения сейчас?",
  en: "Listen to the audio: what is the population now?",
};
const JOURNEY: L3 = {
  uz: "Audioni tinglang: butun sayohat qancha vaqt oladi?",
  ru: "Прослушайте аудио: сколько времени занимает вся поездка?",
  en: "Listen to the audio: how long does the whole journey take?",
};
const PUBL: L3 = {
  uz: "Audioni tinglang: asar qachon nashr etilgan?",
  ru: "Прослушайте аудио: когда был опубликован труд?",
  en: "Listen to the audio: when was the manuscript finally published?",
};
const MEAN: L3 = {
  uz: "Audioni tinglang: gapiruvchi nimani nazarda tutgan?",
  ru: "Прослушайте аудио: что имеет в виду говорящий?",
  en: "Listen to the audio: what does the speaker mean?",
};
const RULE: L3 = {
  uz: "Audioni tinglang: qoidaning mohiyati nima?",
  ru: "Прослушайте аудио: в чём суть правила?",
  en: "Listen to the audio: what is the rule?",
};
const REAL: L3 = {
  uz: "Audioni tinglang: aslida nima bo'lgan?",
  ru: "Прослушайте аудио: что произошло на самом деле?",
  en: "Listen to the audio: what actually happened?",
};
const TONE: L3 = {
  uz: "Audioni tinglang: gapiruvchining umumiy munosabati qanday?",
  ru: "Прослушайте аудио: каково общее отношение говорящего?",
  en: "Listen to the audio: what is the speaker's overall attitude?",
};
const PARA: L3 = {
  uz: "Audioni tinglang: qaysi javob aytilganga eng yaqin?",
  ru: "Прослушайте аудио: какой вариант ближе всего к сказанному?",
  en: "Listen to the audio: which option is closest in meaning?",
};
const EXEMPT: L3 = {
  uz: "Audioni tinglang: qoidadan kim (yoki nima) ozod qilingan?",
  ru: "Прослушайте аудио: кого (или что) правило не касается?",
  en: "Listen to the audio: who or what is exempt from the rule?",
};
const IMPLIED: L3 = {
  uz: "Audioni tinglang: gapiruvchi aslida nimani anglatyapti?",
  ru: "Прослушайте аудио: что на самом деле подразумевается?",
  en: "Listen to the audio: what is actually implied?",
};
const CLAIM: L3 = {
  uz: "Audioni tinglang: olim nima deb hisoblaydi?",
  ru: "Прослушайте аудио: что утверждает учёный?",
  en: "Listen to the audio: what does the scholar argue?",
};

/* ========= VERY HARD LISTENING 1 — raqamlar va faktlar ========= */

export function genListeningVHard1(): QGen[] {
  const out: QGen[] = [];

  /* A) Ko'p raqamli jumlalardan kerakli raqamni ajratish (60) */
  {
    const OFFICERS = ["the registrar", "the press officer", "the dean", "the HR director", "the port manager", "the festival organiser", "the ministry spokesman", "the union leader"];
    const CTX = [
      "applications were received, though barely %B% met the entry requirements, and a mere %C% were eventually admitted",
      "applications had been filed, of which fewer than %B% passed the first screening, and only %C% were finally offered a place",
      "candidates had applied for the vacancy, roughly %B% of whom reached the interview stage, and just %C% were eventually hired",
      "entries arrived before the deadline, some %B% of which complied with the formatting rules, and merely %C% made the final shortlist",
    ];
    for (let i = 0; i < 60; i++) {
      const a = 8000 + (i % 5) * 1000;
      const b = 2500 + (Math.floor(i / 5) % 6) * 500;
      const c = 350 + (Math.floor(i / 30) % 7) * 75;
      const officer = OFFICERS[i % OFFICERS.length]!;
      const body = CTX[Math.floor(i / 8) % CTX.length]!;
      const rng = rngOf(`lvh1:A:${i}`);
      const text = `At the briefing, ${officer} revealed that over ${numWords(a)} ${body.replace("%B%", numWords(b)).replace("%C%", numWords(c))}.`;
      const fourth = c + 150 + (i % 4) * 25;
      const { o, correct } = optionsFor(
        rng,
        same(fmtNum(c)),
        [same(fmtNum(a)), same(fmtNum(b)), same(fmtNum(fourth))]
      );
      out.push({ t: ADMIT, o, correct, audio: text });
    }
  }

  /* B) Foizli zanjir: ro'yxatdan o'tganlar → qatnashganlar → qolganlar (48) */
  {
    const BASES = [300, 360, 400, 480, 540, 600, 720, 800];
    const PCTS = [25, 50, 75];
    const AUDS = ["delegates", "candidates", "shareholders", "students", "journalists", "members"];
    for (let i = 0; i < 48; i++) {
      const variant = i % 2;
      const k = Math.floor(i / 2); // 0..23
      const base = BASES[k % BASES.length]!;
      const pct = PCTS[Math.floor(k / BASES.length) % PCTS.length]!;
      const audience = AUDS[(k >> 2) % AUDS.length]!;
      const attended = (base * pct) / 100;
      const useThird = attended % 3 === 0;
      const gone = useThird ? attended / 3 : attended / 4;
      const remain = attended - gone;
      const rng = rngOf(`lvh1:B:${i}`);
      if (variant === 0) {
        const audio = `Of the ${numWords(base)} ${audience} who registered for the summit, only ${pct} percent actually attended the opening plenary.`;
        const { o, correct } = optionsFor(
          rng,
          same(fmtNum(attended)),
          [same(fmtNum(base)), same(fmtNum(pct)), same(fmtNum(attended + 30))]
        );
        out.push({ t: ATTEND, o, correct, audio });
      } else {
        const frac = useThird ? "a third" : "a quarter";
        const audio = `Of the ${numWords(base)} ${audience} who registered for the summit, only ${pct} percent attended the opening plenary, and roughly ${frac} of those departed before the closing remarks.`;
        const { o, correct } = optionsFor(
          rng,
          same(fmtNum(remain)),
          [same(fmtNum(attended)), same(fmtNum(base)), same(fmtNum(attended + 15 + (i % 3) * 10))]
        );
        out.push({ t: REMAIN, o, correct, audio });
      }
    }
  }

  /* C) Ochilish/yopilish va tushlik tanaffusi — haqiqiy ochiq soatlar (40) */
  {
    const ROOMS = ["archive reading room", "research library", "museum archive", "law library", "records office"];
    const OPENS: Array<[number, string]> = [
      [8, "eight o'clock"],
      [8.5, "half past eight"],
      [9, "nine o'clock"],
    ];
    const CLOSES = [17, 18, 19, 20];
    const BREAKS: Array<[number, string]> = [
      [30, "thirty"],
      [45, "forty-five"],
      [60, "sixty"],
      [90, "ninety"],
    ];
    for (let i = 0; i < 40; i++) {
      const [openH, openW] = OPENS[i % OPENS.length]!;
      const closeH = CLOSES[Math.floor(i / 3) % CLOSES.length]!;
      const [brk, brkW] = BREAKS[Math.floor(i / 12) % BREAKS.length]!;
      const mins = Math.round((closeH - openH) * 60 - brk);
      const room = ROOMS[i % ROOMS.length]!;
      const rng = rngOf(`lvh1:C:${i}`);
      const cw = HOURW[closeH % 12]!;
      const audio = `The ${room} admits readers from ${openW} in the morning until ${cw} in the evening, though the hall is closed for ${brkW} minutes over lunch.`;
      const built = numOptions(rng, mins, 45, fmtDur);
      out.push({ t: HOURS, o: built.o, correct: built.correct, audio });
    }
  }

  /* D) Jihozlar narxi va byudjet oshishi (48) */
  {
    const ITEMS = ["workstation", "laptop", "ergonomic chair", "printing station"];
    const PRICES = [640, 700, 780, 840, 920, 1050, 1200, 1350];
    const BUDGETS = [5000, 6000, 8000, 10000, 12000, 15000, 18000];
    for (let i = 0; i < 48; i++) {
      const variant = i % 2;
      const k = Math.floor(i / 2); // 0..23
      const item = ITEMS[k % ITEMS.length]!;
      const price = PRICES[Math.floor(k / ITEMS.length) % PRICES.length]!;
      const total = price * 12;
      const rng = rngOf(`lvh1:D:${i}`);
      if (variant === 0) {
        const audio = `The finance officer warned that each ${item} costs ${numWords(price)} dollars, and the new annex requires a dozen of them.`;
        const built = numOptions(rng, total, 900, fmtNum);
        out.push({ t: TOTAL, o: built.o, correct: built.correct, audio });
      } else {
        const fits = BUDGETS.filter((b) => b < total);
        const budget = fits[(k * 3) % fits.length]!;
        const audio = `The finance officer warned that each ${item} costs ${numWords(price)} dollars, so fitting out the annex with a dozen units would overrun the ${numWords(budget)}-dollar allowance.`;
        const built = numOptions(rng, total - budget, 600, fmtNum);
        out.push({ t: OVER, o: built.o, correct: built.correct, audio });
      }
    }
  }

  /* E) Aholi o'sishi (40) */
  {
    const DISTS = ["the river district", "the coastal district", "the northern district", "the hill district", "the lakeside district", "the mining district", "the capital district", "the border district"];
    const POPS = [40000, 45000, 50000, 55000, 60000, 64000, 72000, 80000];
    const PCTS = [5, 10, 15, 20, 25];
    for (let i = 0; i < 40; i++) {
      const pop = POPS[i % POPS.length]!;
      const pct = PCTS[Math.floor(i / 8) % PCTS.length]!;
      const dist = DISTS[i % DISTS.length]!;
      const now = pop + (pop * pct) / 100;
      const rng = rngOf(`lvh1:E:${i}`);
      const audio = `According to the latest census, ${dist}'s population of ${numWords(pop)} grew by exactly ${pct} percent over the decade, driven chiefly by migration from the coast.`;
      const built = numOptions(rng, now, 1500, fmtNum);
      out.push({ t: POP, o: built.o, correct: built.correct, audio });
    }
  }

  /* F) Yo'l: masofa, tezlik va to'xtash (40) */
  {
    const ROUTES: Array<[number, number]> = [
      [300, 60], [360, 60], [420, 60], [480, 60], [540, 60],
      [320, 80], [400, 80], [480, 80], [560, 80], [640, 80],
      [360, 90], [450, 90], [540, 90], [630, 90], [720, 90],
    ];
    const STOPS: Array<[number, string]> = [
      [20, "twenty"], [30, "thirty"], [45, "forty-five"], [60, "sixty"],
    ];
    for (let i = 0; i < 40; i++) {
      const [dist, speed] = ROUTES[i % ROUTES.length]!;
      const [stop, stopW] = STOPS[Math.floor(i / ROUTES.length) % STOPS.length]!;
      const mins = (dist / speed) * 60 + stop;
      const rng = rngOf(`lvh1:F:${i}`);
      const audio = `The express coach covers the ${numWords(dist)} kilometre route at a steady ${speed} kilometres per hour, plus a single ${stopW}-minute rest stop at the border.`;
      const built = numOptions(rng, mins, 60, fmtDur);
      out.push({ t: JOURNEY, o: built.o, correct: built.correct, audio });
    }
  }

  /* G) Yozish/nashr xronologiyasi (32) */
  {
    for (let i = 0; i < 32; i++) {
      const m1 = i % 8; // tayyor bo'lgan oy: Jan..Aug
      const m2 = 8 + (Math.floor(i / 8) % 4); // nashr oy: Sep..Dec
      const year = 1998 + ((i * 7) % 15);
      const yrs = 8 + (i % 9);
      const rng = rngOf(`lvh1:G:${i}`);
      const audio = `The manuscript was commissioned in ${year}, delivered in ${MONTHS[m1]!}, and finally published in ${MONTHS[m2]!}, some ${numWords(yrs)} years after the project began.`;
      const others = MONTHS.filter((m) => m !== MONTHS[m2]! && m !== MONTHS[m1]!);
      const d1 = same(others[(i * 5) % others.length]!);
      const d2 = same(others[(i * 5 + 3) % others.length]!);
      const { o, correct } = optionsFor(rng, same(MONTHS[m2]!), [same(MONTHS[m1]!), d1, d2]);
      out.push({ t: PUBL, o, correct, audio });
    }
  }

  return dedupe(out, true);
}

/* ========= VERY HARD LISTENING 2 — mazmun va xulosa ========= */

export function genListeningVHard2(): QGen[] {
  const out: QGen[] = [];

  /* A) Idiomalar kontekstda (64) */
  LISTENING_VHARD_IDIOMS.forEach((it, idx) => {
    const rng = rngOf(`lvh2:idiom:${idx}`);
    const { o, correct } = optionsFor(rng, same(it.meaning), it.d.map(same));
    out.push({ t: MEAN, o, correct, audio: it.audio });
  });

  /* B) Taqiqlovchi qoidalar — 3 xil inversiya ramkasi (60) */
  RULES.forEach((r, idx) => {
    const frames = [
      `Under no circumstances are ${r.subj} to ${r.pred}.`,
      `On no account should ${r.subj} ${r.pred}.`,
      `Staff are reminded that under no circumstances may ${r.subj} ${r.pred}.`,
    ];
    frames.forEach((audio, f) => {
      const rng = rngOf(`lvh2:rule:${idx}:${f}`);
      const { o, correct } = optionsFor(rng, same(r.correct), r.d.map(same));
      out.push({ t: RULE, o, correct, audio });
    });
  });

  /* C) Shart gaplari — aslida nima bo'lgan (40) */
  CONDITIONS.forEach((c, idx) => {
    [
      c.audio,
      `The chair recalled that ${lowerFirst(c.audio)}`,
    ].forEach((audio, f) => {
      const rng = rngOf(`lvh2:cond:${idx}:${f}`);
      const { o, correct } = optionsFor(rng, same(c.correct), c.d.map(same));
      out.push({ t: REAL, o, correct, audio });
    });
  });

  /* D) Hedging — munosabat (36) */
  HEDGES.forEach((h, idx) => {
    [
      h.audio,
      `Asked for her view, the reviewer replied: "${h.audio}"`,
    ].forEach((audio, f) => {
      const rng = rngOf(`lvh2:hedge:${idx}:${f}`);
      const { o, correct } = optionsFor(rng, same(h.correct), h.d.map(same));
      out.push({ t: TONE, o, correct, audio });
    });
  });

  /* E) Akademik paraphrase (36) */
  PARAPHRASES.forEach((p, idx) => {
    [
      p.audio,
      `The examiner put it this way: "${p.audio}"`,
    ].forEach((audio, f) => {
      const rng = rngOf(`lvh2:para:${idx}:${f}`);
      const { o, correct } = optionsFor(rng, same(p.correct), p.d.map(same));
      out.push({ t: PARA, o, correct, audio });
    });
  });

  /* F) Istisnolar (36) */
  EXCEPTIONS.forEach((e, idx) => {
    [
      e.audio,
      `Employees were reminded that ${lowerFirst(e.audio)}`,
    ].forEach((audio, f) => {
      const rng = rngOf(`lvh2:exc:${idx}:${f}`);
      const { o, correct } = optionsFor(rng, same(e.correct), e.d.map(same));
      out.push({ t: EXEMPT, o, correct, audio });
    });
  });

  /* G) Implied evaluation (36) */
  EVALUATIONS.forEach((e, idx) => {
    [
      e.audio,
      `Asked to sum up, the critic said: "${e.audio}"`,
    ].forEach((audio, f) => {
      const rng = rngOf(`lvh2:eval:${idx}:${f}`);
      const { o, correct } = optionsFor(rng, same(e.correct), e.d.map(same));
      out.push({ t: IMPLIED, o, correct, audio });
    });
  });

  /* H) Olimlar da'volari (40) */
  CLAIMS.forEach((c, idx) => {
    [
      c.audio,
      `It is Professor ${c.prof}'s considered view that ${c.claim}.`,
    ].forEach((audio, f) => {
      const rng = rngOf(`lvh2:claim:${idx}:${f}`);
      const { o, correct } = optionsFor(rng, same(c.correct), c.d.map(same));
      out.push({ t: CLAIM, o, correct, audio });
    });
  });

  return dedupe(out, true);
}
