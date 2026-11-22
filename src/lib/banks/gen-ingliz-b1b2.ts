/**
 * HAQIQIY CEFR darajalari: B1 (Intermediate), B2 (Upper-Intermediate)
 * va IELTS (easy/middle/hard) savollar banklari.
 *
 * MUHIM: har bir test O'Z so'z pooliga va O'Z grammatika bloklariga ega —
 * darajalar orasida birorta ham savol matni takrorlanmaydi:
 *   A1/A2      → gen-ingliz.ts (faqat a1 va a2 bloklari)
 *   B1         → shu fayl: WORDS_B1 + B1 grammatikasi (Present Perfect, shart, modallar...)
 *   B2         → shu fayl: WORDS_B2X + B2 grammatikasi (Passive, Reported, 3-shart, wish...)
 *   IELTS-e    → shu fayl: WORDS_B2 + grafik tili
 *   IELTS-m    → shu fayl: WORDS_IM + IELTS bog'lovchi/kollokatsiya bloklari
 *   IELTS-h    → shu fayl: WORDS_IH + akademik so'z tanlash bloklari
 * Distraktorlar deterministik (rngOf) — har safar bir xil natija.
 */
import { dedupe, optionsFor, rngOf, shuffle, same, type L3, type QGen } from "./gen-core";
import { WORDS_B1, WORDS_B2 } from "./gen-ingliz";

type Word = { en: string; uz: string; ru: string };
const W = (en: string, uz: string, ru: string): Word => ({ en, uz, ru });

/** Grammatika elementi: s — gap, a — to'g'ri javob, d — 3 ta xato variant */
type G = { s: string; a: string; d: [string, string, string] };
/** Frazeologik fe'l: pv — fe'l, m — ma'no, d — 3 ta xato ma'no */
type PV = { pv: string; m: string; d: [string, string, string] };

/* ================= VOKABULARY GENERATOR ================= */

const VT_UZ_FWD = [
  (en: string) => `«${en}» so'zining eng aniq o'zbekcha ma'nosi qaysi?`,
  (en: string) => `So'zning ma'nosini toping: ${en} — ___`,
  (en: string) => `${en} so'zi o'zbekchada nimani anglatadi?`,
];
const VT_RU_FWD = [
  (en: string) => `Какое значение слова «${en}» наиболее точное?`,
  (en: string) => `Найдите значение слова: ${en} — ___`,
  (en: string) => `Что означает слово «${en}» по-узбекски?`,
];
const VT_EN_FWD = [
  (en: string) => `Which meaning of “${en}” is the most accurate?`,
  (en: string) => `Find the meaning: ${en} — ___`,
  (en: string) => `What does “${en}” mean in Uzbek?`,
];
const VT_UZ_REV = [
  (uz: string) => `«${uz}» tushunchasining inglizcha nomi qaysi?`,
  (uz: string) => `${uz} — ingliz tilida qanday yoziladi?`,
  (uz: string) => `${uz} so'zining inglizcha muqobilini tanlang.`,
];
const VT_RU_REV = [
  (ru: string) => `Как по-английски называется: ${ru}?`,
  (ru: string) => `Выберите английский перевод: ${ru}.`,
  (ru: string) => `Найдите английский эквивалент: ${ru}.`,
];
const VT_EN_REV = [
  (uz: string) => `What is the English term for “${uz}”?`,
  (uz: string) => `How do you write “${uz}” in English?`,
  (uz: string) => `Choose the English equivalent of “${uz}”.`,
];

/** Bir pool so'zlardan 6 xil shakldagi savol (3 shablon × 2 yo'nalish) */
function vocabBank(prefix: string, pool: Word[]): QGen[] {
  const out: QGen[] = [];
  pool.forEach((w) => {
    const others = pool.filter((x) => x.en !== w.en && x.uz !== w.uz);
    for (let k = 0; k < 6; k++) {
      const r = rngOf(`${prefix}:${w.en}:${k}`);
      const fwd = k % 2 === 0;
      const ti = k % 3;
      if (fwd) {
        const { o, correct } = optionsFor(
          r,
          { uz: w.uz, ru: w.ru, en: w.uz },
          shuffle(r, others).slice(0, 10).map((x) => ({ uz: x.uz, ru: x.ru, en: x.uz }))
        );
        out.push({
          t: { uz: VT_UZ_FWD[ti]!(w.en), ru: VT_RU_FWD[ti]!(w.en), en: VT_EN_FWD[ti]!(w.en) },
          o,
          correct,
        });
      } else {
        const { o, correct } = optionsFor(
          r,
          { uz: w.en, ru: w.en, en: w.en },
          shuffle(r, others).slice(0, 10).map((x) => ({ uz: x.en, ru: x.en, en: x.en }))
        );
        out.push({
          t: { uz: VT_UZ_REV[ti]!(w.uz), ru: VT_RU_REV[ti]!(w.ru), en: VT_EN_REV[ti]!(w.uz) },
          o,
          correct,
        });
      }
    }
  });
  return out;
}

/* ================= GRAMMATIKA GENERATORLARI ================= */

function grammarQs(prefix: string, note: L3, items: G[]): QGen[] {
  return items.map((it, i) => {
    const r = rngOf(`${prefix}:${i}:${it.a}`);
    const { o, correct } = optionsFor(r, same(it.a), it.d.map((x) => same(x)));
    return {
      t: {
        uz: `Bo'sh joyni to'ldiring: “${it.s}” (${note.uz})`,
        ru: `Заполните пропуск: “${it.s}” (${note.ru})`,
        en: `Fill in the blank: “${it.s}” (${note.en})`,
      },
      o,
      correct,
    };
  });
}

function phrasalQs(prefix: string, items: PV[]): QGen[] {
  return items.map((it, i) => {
    const r = rngOf(`${prefix}:${i}:${it.pv}`);
    const { o, correct } = optionsFor(r, same(it.m), it.d.map((x) => same(x)));
    return {
      t: {
        uz: `Frazeologik fe'l “${it.pv}” nimani anglatadi?`,
        ru: `Фразовый глагол “${it.pv}” означает:`,
        en: `The phrasal verb “${it.pv}” means:`,
      },
      o,
      correct,
    };
  });
}

const NOTE = {
  perf: { uz: "Present Perfect yoki Past Simple", ru: "Present Perfect или Past Simple", en: "Present Perfect or Past Simple" },
  forsince: { uz: "for / since / already / yet", ru: "for / since / already / yet", en: "for / since / already / yet" },
  future: { uz: "will yoki be going to", ru: "will или be going to", en: "will or be going to" },
  cond1: { uz: "1-tip shart gap (real shart)", ru: "условное предложение 1 типа", en: "first conditional" },
  modal: { uz: "modallar: must/have to/should", ru: "модальные глаголы", en: "modals: must / have to / should" },
  gerinf: { uz: "gerundiy yoki infinitiv", ru: "герундий или инфинитив", en: "gerund or infinitive" },
  rel: { uz: "relative: who/which/where", ru: "относительные местоимения", en: "relative clauses" },
  usedto: { uz: "used to — o'tgan odat", ru: "used to — привычка в прошлом", en: "used to — past habits" },
  tooenough: { uz: "too / enough", ru: "too / enough", en: "too / enough" },
  tags: { uz: "savol-qo'shimchasi (question tag)", ru: "разделительный вопрос", en: "question tags" },
  pv1: { uz: "B1 frazeologik fe'llar", ru: "фразовые глаголы B1", en: "B1 phrasal verbs" },
  link1: { uz: "bog'lovchilar", ru: "союзы и связки", en: "linking words" },
  comp: { uz: "qiyosiy daraja (as...as, much)", ru: "степени сравнения", en: "comparatives" },
  pastperf: { uz: "Past Perfect", ru: "Past Perfect", en: "Past Perfect" },
  passive: { uz: "passiv (majhul) nisbat", ru: "пассивный залог", en: "passive voice" },
  report: { uz: "bilganlik (reported speech)", ru: "косвенная речь", en: "reported speech" },
  cond23: { uz: "2 va 3-tip shart gaplari", ru: "условные предложения 2-3 типа", en: "second and third conditionals" },
  wish: { uz: "wish / if only", ru: "wish / if only", en: "wish / if only" },
  modalperf: { uz: "modallar + have V3", ru: "модальные глаголы + have V3", en: "modal perfect: must have done" },
  rel2: { uz: "B2 relative: whom/whose/why", ru: "относительные B2", en: "B2 relative clauses" },
  causative: { uz: "have smth done (kauzativ)", ru: "каузатив have smth done", en: "causative have something done" },
  despite: { uz: "despite / in spite of / although", ru: "despite / in spite of / although", en: "despite / in spite of / although" },
  sosuch: { uz: "so / such", ru: "so / such", en: "so / such" },
  pv2: { uz: "B2 frazeologik fe'llar", ru: "фразовые глаголы B2", en: "B2 phrasal verbs" },
  wordform: { uz: "so'z yasalishi (word formation)", ru: "словообразование", en: "word formation" },
  link2: { uz: "B2 bog'lovchilar", ru: "связки B2", en: "B2 linking words" },
  graph: { uz: "grafik va diagramma tili", ru: "язык графиков", en: "graph language" },
  ieltslink: { uz: "IELTS bog'lovchilari", ru: "связки IELTS", en: "IELTS linking words" },
  coll: { uz: "kollokatsiyalar (fe'l + ot)", ru: "коллокации (глагол + существительное)", en: "verb + noun collocations" },
  acad: { uz: "akademik so'z tanlash", ru: "академический выбор слова", en: "academic word choice" },
  acadverb: { uz: "akademik fe'llar ma'nosi", ru: "значение академических глаголов", en: "academic verbs meaning" },
  vocabctx: { uz: "matn kontekstida so'z", ru: "слово в контексте", en: "word in context" },
};

/* ================= B2 SO'Z POOLI (faqat quiz_cefr_b2 uchun) ================= */

const WORDS_B2X: Word[] = [
  W("reluctant", "bosh tortuvchi", "неохотный"), W("thorough", "puxta, batafsil", "тщательный"),
  W("commitment", "majburiylik, sadoqat", "обязательство"), W("comply", "itoat qilmoq", "подчиняться правилам"),
  W("coincide", "mos tushmoq", "совпадать"), W("collaborate", "hamkorlik qilmoq", "сотрудничать"),
  W("deteriorate", "yomonlashmoq", "ухудшаться"), W("enhance", "yuksaltirmoq", "усиливать"),
  W("evaluate", "baholamoq", "оценивать"), W("facilitate", "yengillashtirmoq", "облегчать"),
  W("implement", "amalga oshirmoq", "внедрять"), W("subsequently", "keyinchalik", "впоследствии"),
  W("ambiguous", "noaniq, ikki ma'noli", "двусмысленный"), W("deliberate", "ataylab qilingan", "преднамеренный"),
  W("crucial", "hal qiluvchi", "решающий"), W("feasible", "amalga oshiriladigan", "осуществимый"),
  W("detrimental", "zarar keltiruvchi", "вредный"), W("profound", "teran, chuqur", "глубокий"),
  W("remarkable", "diqqatga sazovor", "замечательный"), W("sufficient", "yetarli", "достаточный"),
  W("inevitable", "muqarrar", "неизбежный"), W("abundant", "mo'l-ko'l", "обильный"),
  W("accurate", "aniq", "точный"), W("adequate", "mo'tadil, mos", "адекватный"),
  W("ambitious", "buyuk maqsadli", "амбициозный"), W("apparent", "ko'zga ko'ringan", "очевидный"),
  W("comprehensive", "har tomonlama", "всеобъемлющий"), W("considerable", "sezilarli", "значительный"),
  W("enormous", "ulkan", "огромный"), W("essential", "asosiy ahamiyatga ega", "существенный"),
  W("evident", "ravon, yaqqol", "явный"), W("genuine", "haqiqiy", "настоящий"),
  W("harsh", "shafqatsiz, qattiq", "суровый"), W("inadequate", "yetarsiz", "недостаточный"),
  W("intense", "keskin", "интенсивный"), W("optional", "ixtiyoriy", "необязательный"),
  W("persistent", "qat'iyatli", "настойчивый"), W("preliminary", "dastlabki", "предварительный"),
  W("prior", "avvalgi", "предшествующий"), W("radical", "radikal", "радикальный"),
  W("severe", "og'ir", "тяжёлый"), W("vast", "keng miqyosdagi", "обширный"),
  W("abandon", "tashlab ketmoq", "покидать"), W("accumulate", "to'planmoq", "накапливаться"),
  W("acquire", "qo'lga kiritmoq", "приобретать"), W("adapt", "moslashmoq", "приспосабливаться"),
  W("advocate", "tarafdor bo'lmoq", "отстаивать"), W("anticipate", "oldindan kutmoq", "предвидеть"),
  W("appropriate", "joyiga mos", "уместный"), W("approve", "ma'qullamoq", "одобрять"),
  W("contradict", "zid kelmoq", "противоречить"), W("emphasize", "ta'kidlamoq", "подчёркивать"),
  W("acknowledge", "e'tirof etmoq", "признавать"), W("urge", "da'vat qilmoq", "настоятельно призывать"),
  W("retain", "saqlab qolmoq", "сохранять"), W("restrict", "cheklamoq", "ограничивать"),
  W("occur", "yuzaga kelmoq", "происходить"), W("require", "talab qilmoq", "требовать"),
  W("attempt", "urinmoq", "пытаться"),
];

/* ================= B1 GRAMMATIKA BLOKLARI (faqat quiz_cefr_b1) ================= */

const B1_PERF: G[] = [
  { s: "I ___ this film twice already.", a: "have seen", d: ["saw", "see", "am seeing"] },
  { s: "She ___ to London in 2019.", a: "went", d: ["has been", "has gone", "goes"] },
  { s: "We ___ each other since childhood.", a: "have known", d: ["knew", "know", "are knowing"] },
  { s: "Have you ever ___ sushi?", a: "eaten", d: ["ate", "eat", "eating"] },
  { s: "He ___ his keys yesterday.", a: "lost", d: ["has lost", "loses", "is losing"] },
  { s: "They ___ married for ten years.", a: "have been", d: ["were", "are", "was"] },
  { s: "I ___ my homework an hour ago.", a: "finished", d: ["have finished", "finish", "was finishing"] },
  { s: "She has just ___ the letter.", a: "posted", d: ["post", "posting", "posts"] },
  { s: "We ___ in this house since 2015.", a: "have lived", d: ["lived", "live", "are living"] },
  { s: "The train ___ yet, so we are still waiting.", a: "hasn't arrived", d: ["didn't arrive", "doesn't arrive", "hasn't been arriving"] },
  { s: "I ___ him at the conference last week.", a: "met", d: ["have met", "meet", "was meeting"] },
  { s: "Look! Someone ___ that window.", a: "has broken", d: ["broke", "breaks", "is breaking"] },
  { s: "My sister ___ her course two months ago.", a: "started", d: ["has started", "starts", "is starting"] },
  { s: "___ you seen my new phone? I can't find it.", a: "Have", d: ["Did", "Do", "Are"] },
  { s: "They ___ to Turkey last summer.", a: "flew", d: ["have flown", "fly", "are flying"] },
  { s: "She is the most honest person I ___ ever met.", a: "have", d: ["has", "did", "was"] },
];

const B1_FORSINCE: G[] = [
  { s: "I have lived here ___ 2018.", a: "since", d: ["for", "from", "during"] },
  { s: "They have been friends ___ many years.", a: "for", d: ["since", "during", "from"] },
  { s: "She has worked in this school ___ September.", a: "since", d: ["for", "during", "at"] },
  { s: "We have been waiting ___ two hours.", a: "for", d: ["since", "during", "from"] },
  { s: "He has ___ finished his report, so he is free now.", a: "already", d: ["yet", "still", "ever"] },
  { s: "Have you finished your essay ___?", a: "yet", d: ["still", "ever", "just"] },
  { s: "I have ___ seen this documentary twice.", a: "already", d: ["yet", "never", "ever"] },
  { s: "He has ___ visited Paris. This is his first trip abroad.", a: "never", d: ["ever", "already", "yet"] },
  { s: "Have you ___ been to Italy?", a: "ever", d: ["never", "yet", "already"] },
  { s: "The guests have ___ arrived — they are in the garden.", a: "just", d: ["yet", "ever", "still"] },
  { s: "She hasn't paid the bill ___.", a: "yet", d: ["already", "just", "ever"] },
  { s: "We've known each other ___ we were children.", a: "since", d: ["for", "during", "from"] },
  { s: "I haven't seen him ___ last Monday.", a: "since", d: ["for", "from", "during"] },
  { s: "The film has ___ started, so sit down quickly.", a: "just", d: ["yet", "ever", "still"] },
];

const B1_FUTURE: G[] = [
  { s: "Look at those black clouds! It ___ rain.", a: "is going to", d: ["will", "rains", "is raining"] },
  { s: "I think our team ___ win the cup this year.", a: "will", d: ["wins", "is winning", "win"] },
  { s: "We ___ visit our grandparents this weekend; the tickets are already bought.", a: "are going to", d: ["will", "will be", "shall"] },
  { s: "The phone is ringing. I ___ answer it.", a: "will", d: ["am going to", "am answering", "answers"] },
  { s: "She has decided that she ___ study medicine.", a: "is going to", d: ["will be", "shall", "would"] },
  { s: "Don't worry, I ___ help you with the boxes.", a: "will", d: ["am going", "am helping", "helps"] },
  { s: "Be careful with that ladder — you ___ fall.", a: "are going to", d: ["will be", "are dropping", "drop"] },
  { s: "What ___ you do after graduation? — I am not sure yet.", a: "will", d: ["are", "do", "did"] },
  { s: "They ___ build a new cinema here; the plans are ready.", a: "are going to", d: ["will", "will be", "would"] },
  { s: "I promise I ___ tell anyone your secret.", a: "will", d: ["am going", "am telling", "would"] },
];

const B1_COND1: G[] = [
  { s: "If it ___ tomorrow, we will stay at home.", a: "rains", d: ["will rain", "rain", "rained"] },
  { s: "If you study hard, you ___ the exam.", a: "will pass", d: ["pass", "would pass", "passed"] },
  { s: "She ___ be angry if you don't call her.", a: "will", d: ["would", "is", "was"] },
  { s: "If he ___ me, I will help him.", a: "asks", d: ["will ask", "ask", "asked"] },
  { s: "We will miss the bus if we ___ now.", a: "don't leave", d: ["won't leave", "didn't leave", "not leave"] },
  { s: "If you ___ the doctor, you will feel better.", a: "see", d: ["will see", "saw", "are seeing"] },
  { s: "I will call you as soon as I ___ home.", a: "get", d: ["will get", "got", "will be getting"] },
  { s: "If they ___ us, we will join the trip.", a: "invite", d: ["will invite", "invited", "inviting"] },
  { s: "You ___ the match if you don't practise.", a: "will lose", d: ["lose", "would lose", "lost"] },
  { s: "If the shop ___ open, let's go somewhere else.", a: "isn't", d: ["won't be", "wasn't", "weren't"] },
  { s: "If she ___ the lottery, she will buy a house.", a: "wins", d: ["will win", "won", "would win"] },
  { s: "If the children ___ to bed soon, they will be tired tomorrow.", a: "don't go", d: ["won't go", "didn't go", "not go"] },
];

const B1_MODAL: G[] = [
  { s: "You ___ be quiet in the library — it's the rule.", a: "must", d: ["might", "could", "would"] },
  { s: "Drivers ___ stop when the light is red.", a: "must", d: ["might", "could", "may"] },
  { s: "It's cold inside. You ___ take a jacket.", a: "should", d: ["must not", "might not", "would"] },
  { s: "You ___ smoke here — it's forbidden.", a: "mustn't", d: ["shouldn't have", "might not", "couldn't"] },
  { s: "I ___ swim when I was only four.", a: "could", d: ["can", "must", "should"] },
  { s: "___ I open the window? It's really hot in here.", a: "May", d: ["Must", "Should", "Would"] },
  { s: "She is not at home. She ___ be at the gym.", a: "might", d: ["must not", "shouldn't", "wouldn't"] },
  { s: "You don't ___ to pay — the entrance is free.", a: "have", d: ["must", "should", "has"] },
  { s: "We ___ to wear a uniform at our school.", a: "have", d: ["must", "should", "would"] },
  { s: "He ___ come to the party, but he isn't sure.", a: "might", d: ["must", "should", "have to"] },
  { s: "You ___ eat so much sugar — it's unhealthy.", a: "shouldn't", d: ["mustn't have", "might not", "couldn't"] },
  { s: "Students ___ use dictionaries in this exam; it's not allowed.", a: "can't", d: ["couldn't", "might not", "wouldn't"] },
  { s: "___ you help me carry this box, please?", a: "Could", d: ["Must", "Should", "May"] },
  { s: "We ___ hurry — the film starts in ten minutes.", a: "must", d: ["might", "could", "would"] },
  { s: "She ___ to work on Saturdays.", a: "has", d: ["must", "should", "would"] },
  { s: "When I was young, I ___ stay up late at weekends.", a: "could", d: ["can", "must", "should"] },
];

const B1_GERINF: G[] = [
  { s: "I enjoy ___ books in the evening.", a: "reading", d: ["to read", "read", "reads"] },
  { s: "She decided ___ a new car.", a: "to buy", d: ["buying", "buy", "bought"] },
  { s: "He avoided ___ my question.", a: "answering", d: ["to answer", "answer", "answered"] },
  { s: "They suggested ___ a taxi.", a: "taking", d: ["to take", "take", "took"] },
  { s: "I would like ___ a cup of tea.", a: "to have", d: ["having", "have", "had"] },
  { s: "We are looking forward to ___ you again.", a: "meeting", d: ["meet", "to meet", "met"] },
  { s: "She made me ___ my mind.", a: "change", d: ["to change", "changing", "changed"] },
  { s: "It is no use ___ about the weather.", a: "complaining", d: ["to complain", "complain", "complained"] },
  { s: "Do you want ___ the museum with us?", a: "to visit", d: ["visiting", "visit", "visited"] },
  { s: "He promised ___ me at the station.", a: "to meet", d: ["meeting", "meet", "met"] },
  { s: "I can't stand ___ in long queues.", a: "waiting", d: ["to wait", "wait", "waited"] },
  { s: "They agreed ___ the bill equally.", a: "to share", d: ["sharing", "share", "shared"] },
  { s: "She is good at ___ languages.", a: "learning", d: ["to learn", "learn", "learned"] },
  { s: "We hope ___ the finals this year.", a: "to reach", d: ["reaching", "reach", "reached"] },
  { s: "He keeps ___ his keys.", a: "losing", d: ["to lose", "lose", "lost"] },
  { s: "My parents let me ___ out late on Fridays.", a: "stay", d: ["to stay", "staying", "stayed"] },
];

const B1_REL: G[] = [
  { s: "The man ___ lives next door is a pilot.", a: "who", d: ["which", "whose", "where"] },
  { s: "This is the book ___ changed my life.", a: "which", d: ["who", "whose", "where"] },
  { s: "That's the café ___ we first met.", a: "where", d: ["which", "who", "whose"] },
  { s: "The girl ___ bag was stolen called the police.", a: "whose", d: ["who", "which", "where"] },
  { s: "I don't like people ___ talk loudly in cinemas.", a: "who", d: ["which", "whose", "where"] },
  { s: "The film ___ we watched last night was boring.", a: "which", d: ["who", "whose", "where"] },
  { s: "This is the town ___ my grandparents were born.", a: "where", d: ["which", "who", "whose"] },
  { s: "The woman ___ car was damaged asked for insurance.", a: "whose", d: ["which", "who", "where"] },
  { s: "A vegetarian is a person ___ doesn't eat meat.", a: "who", d: ["which", "whose", "where"] },
  { s: "The phone ___ I bought last month stopped working.", a: "which", d: ["who", "whose", "where"] },
  { s: "That is the reason ___ I called you yesterday.", a: "why", d: ["which", "who", "whose"] },
  { s: "Summer is the season ___ most people travel.", a: "when", d: ["which", "who", "whose"] },
  { s: "The bread ___ you sold this morning was delicious.", a: "which", d: ["who", "whose", "when"] },
  { s: "Children ___ eat breakfast do better at school.", a: "who", d: ["which", "whose", "when"] },
];

const B1_USEDTO: G[] = [
  { s: "When I was a child, I ___ play outside every day.", a: "used to", d: ["use to", "am used to", "was used to"] },
  { s: "She ___ smoke, but she gave up last year.", a: "used to", d: ["uses to", "is used to", "was used"] },
  { s: "There ___ be a cinema here, but now it is a supermarket.", a: "used to", d: ["use to", "was used to", "is used to"] },
  { s: "I didn't ___ like coffee, but now I love it.", a: "use to", d: ["used", "am used", "was used"] },
  { s: "He ___ have long hair when he was a student.", a: "used to", d: ["use to", "is used to", "uses to"] },
  { s: "Did you ___ play the guitar in your childhood?", a: "use to", d: ["used to", "are used to", "uses to"] },
  { s: "My grandfather ___ walk five miles to school.", a: "used to", d: ["use to", "is used to", "uses to"] },
  { s: "People ___ send letters; now everyone emails.", a: "used to", d: ["use to", "are used to", "was used to"] },
  { s: "She isn't ___ to getting up early, so she is always tired.", a: "used", d: ["use", "using", "uses"] },
  { s: "We ___ to live in a small flat before buying this house.", a: "used", d: ["use", "are used", "using"] },
];

const B1_TOOENOUGH: G[] = [
  { s: "This coffee is ___ hot to drink right now.", a: "too", d: ["enough", "so", "much"] },
  { s: "The box isn't big ___ for all these books.", a: "enough", d: ["too", "so", "very"] },
  { s: "He is ___ young to drive a car.", a: "too", d: ["enough", "so", "very"] },
  { s: "We don't have ___ time to finish the project.", a: "enough", d: ["too", "so", "many"] },
  { s: "The bag is ___ heavy for me to carry.", a: "too", d: ["enough", "so", "very"] },
  { s: "She speaks English well ___ to work as a guide.", a: "enough", d: ["too", "so", "very"] },
  { s: "The room was ___ small for five people.", a: "too", d: ["enough", "so", "very"] },
  { s: "Is the water warm ___ to swim?", a: "enough", d: ["too", "so", "very"] },
  { s: "I am ___ tired to watch the film tonight.", a: "too", d: ["enough", "so", "very"] },
  { s: "There aren't ___ chairs for everyone.", a: "enough", d: ["too", "so", "much"] },
];

const B1_TAGS: G[] = [
  { s: "You're coming with us, ___?", a: "aren't you", d: ["are you", "isn't it", "don't you"] },
  { s: "She doesn't like coffee, ___?", a: "does she", d: ["doesn't she", "is she", "does her"] },
  { s: "They went home early, ___?", a: "didn't they", d: ["did they", "don't they", "wasn't it"] },
  { s: "It's a beautiful day, ___?", a: "isn't it", d: ["is it", "doesn't it", "isn't there"] },
  { s: "You haven't seen my glasses, ___?", a: "have you", d: ["haven't you", "do you", "have them"] },
  { s: "He can drive, ___?", a: "can't he", d: ["can he", "doesn't he", "can't drive"] },
  { s: "We should leave now, ___?", a: "shouldn't we", d: ["should we", "don't we", "aren't we"] },
  { s: "There are many rooms here, ___?", a: "aren't there", d: ["are there", "aren't they", "isn't it"] },
  { s: "She never smiles, ___?", a: "does she", d: ["doesn't she", "is she", "never smiles"] },
  { s: "I'm late again, ___?", a: "aren't I", d: ["amn't I", "am I not going", "don't I"] },
];

const B1_PV: PV[] = [
  { pv: "look after", m: "take care of", d: ["try to find", "postpone", "return a visit"] },
  { pv: "look for", m: "try to find", d: ["take care of", "avoid", "suddenly meet"] },
  { pv: "look forward to", m: "wait for something with pleasure", d: ["look at quickly", "think about the past", "search carefully"] },
  { pv: "give up", m: "stop trying to do something", d: ["start a hobby", "return something", "write down"] },
  { pv: "turn on", m: "make a machine start working", d: ["stop a machine", "wear clothes", "cancel"] },
  { pv: "put on", m: "wear clothes on your body", d: ["wash clothes", "take clothes off", "buy clothes"] },
  { pv: "take off", m: "remove clothes", d: ["put clothes on", "postpone a flight", "arrive"] },
  { pv: "get up", m: "stand up or rise from bed", d: ["go to bed", "sit down", "wake someone else"] },
  { pv: "find out", m: "get information or discover", d: ["lose something", "hide a fact", "invent a story"] },
  { pv: "come back", m: "return to a place", d: ["leave a place", "visit someone", "arrive first"] },
  { pv: "put off", m: "postpone to a later time", d: ["do immediately", "cancel forever", "start wearing"] },
  { pv: "call off", m: "cancel an event", d: ["phone someone", "shout loudly", "start earlier"] },
  { pv: "carry on", m: "continue doing something", d: ["stop doing", "lift something heavy", "forget"] },
  { pv: "run out of", m: "have no more of something", d: ["buy too much of", "run fast", "borrow"] },
  { pv: "get on with", m: "have a good relationship with", d: ["argue with", "board a vehicle", "climb onto"] },
  { pv: "turn up", m: "arrive or appear unexpectedly", d: ["turn around", "disappear", "fall asleep"] },
];

const B1_LINK: G[] = [
  { s: "I was very tired, ___ I finished my homework.", a: "but", d: ["because", "so that", "and"] },
  { s: "___ it was raining, we went for a long walk.", a: "Although", d: ["Because", "So", "If"] },
  { s: "She stayed at home ___ she was feeling ill.", a: "because", d: ["although", "but", "so that"] },
  { s: "He didn't study at all, ___ he failed the exam.", a: "so", d: ["because", "although", "but"] },
  { s: "I like tea ___ my sister prefers coffee.", a: "whereas", d: ["so", "because", "although"] },
  { s: "We took a map ___ we wouldn't get lost.", a: "so that", d: ["because", "although", "but"] },
  { s: "___ he is only twelve, he speaks English fluently.", a: "Although", d: ["Because", "So", "If"] },
  { s: "The shop was closed, ___ we went to the market instead.", a: "so", d: ["because", "although", "unless"] },
  { s: "___ you finish your vegetables, you can't have dessert.", a: "Unless", d: ["Because", "Although", "While"] },
  { s: "He passed the test ___ practising every day.", a: "by", d: ["so", "although", "because"] },
  { s: "I'll call you ___ I arrive at the hotel.", a: "when", d: ["although", "unless", "so that"] },
  { s: "She was late ___ the traffic jam.", a: "because of", d: ["because", "although", "so"] },
];

const B1_COMP: G[] = [
  { s: "My brother is ___ taller than me.", a: "much", d: ["very", "more", "most"] },
  { s: "This road is twice ___ long as that one.", a: "as", d: ["so", "than", "more"] },
  { s: "Today is ___ than yesterday.", a: "hotter", d: ["more hot", "hottest", "more hotter"] },
  { s: "She is the ___ student in our class.", a: "best", d: ["better", "goodest", "most good"] },
  { s: "The ticket was ___ more expensive than I expected.", a: "far", d: ["very", "most", "much more"] },
  { s: "February is the ___ month of the year.", a: "shortest", d: ["shorter", "most short", "more short"] },
  { s: "His new film is ___ interesting than the last one.", a: "more", d: ["most", "much", "very"] },
  { s: "This exercise is ___ difficult than the previous one.", a: "less", d: ["least", "little", "not"] },
  { s: "It is the ___ boring lecture I have ever attended.", a: "most", d: ["more", "much", "very"] },
  { s: "This bag is ___ than that one.", a: "heavier", d: ["more heavy", "heaviest", "heavy"] },
  { s: "The test was ___ easier than I thought.", a: "much", d: ["very", "most", "more"] },
  { s: "She sings ___ beautifully than her sister.", a: "more", d: ["most", "much", "very"] },
];

/* ================= B2 GRAMMATIKA BLOKLARI (faqat quiz_cefr_b2) ================= */

const B2_PASTPERF: G[] = [
  { s: "By the time we arrived, the film ___ already started.", a: "had", d: ["has", "was", "would"] },
  { s: "She told me she ___ the email the day before.", a: "had sent", d: ["sent", "has sent", "was sending"] },
  { s: "After he ___ his homework, he went out.", a: "had finished", d: ["finished", "has finished", "finishes"] },
  { s: "I didn't meet them because I ___ early.", a: "had left", d: ["left", "have left", "was leaving"] },
  { s: "The train ___ before we reached the platform.", a: "had gone", d: ["went", "has gone", "was going"] },
  { s: "When I got home, I realised I ___ my umbrella in the office.", a: "had left", d: ["have left", "was leaving", "would leave"] },
  { s: "She didn't want to go to the cinema because she ___ the film before.", a: "had seen", d: ["saw", "has seen", "was seen"] },
  { s: "He couldn't enter the university because he ___ the deadline.", a: "had missed", d: ["has missed", "was missing", "would miss"] },
  { s: "By 2010, the company ___ three new factories.", a: "had opened", d: ["has opened", "was opening", "would open"] },
  { s: "The guests left before the host ___ home.", a: "had come", d: ["came", "has come", "was coming"] },
  { s: "They ___ each other before the party, so they weren't strangers.", a: "had met", d: ["have met", "were meeting", "would meet"] },
  { s: "After she ___ the letter, she posted it.", a: "had written", d: ["has written", "was writing", "would write"] },
];

const B2_PASSIVE: G[] = [
  { s: "The window ___ by the boys yesterday.", a: "was broken", d: ["broke", "was broke", "is broken"] },
  { s: "English ___ all over the world.", a: "is spoken", d: ["speaks", "is speaking", "has spoken"] },
  { s: "The new bridge ___ next year.", a: "will be built", d: ["will build", "is built", "will been built"] },
  { s: "The letter ___ at the moment.", a: "is being written", d: ["is writing", "writes", "has written"] },
  { s: "The thief ___ by the police last night.", a: "was arrested", d: ["arrested", "has arrested", "is arrested"] },
  { s: "The report must ___ by Friday.", a: "be submitted", d: ["submitted", "being submitted", "submit"] },
  { s: "This dish ___ with fresh vegetables every morning.", a: "is prepared", d: ["prepares", "is preparing", "has prepared"] },
  { s: "The results ___ tomorrow morning.", a: "will be announced", d: ["will announce", "are announcing", "have announced"] },
  { s: "The house ___ twice since 2019.", a: "has been renovated", d: ["renovated", "is renovating", "has renovated"] },
  { s: "The tickets ___ online, not at the box office.", a: "must be bought", d: ["must buy", "must been bought", "must buying"] },
  { s: "While the walls ___, we stayed at a hotel.", a: "were being painted", d: ["were painting", "painted", "are painted"] },
  { s: "The machine ___ by an engineer every month.", a: "is checked", d: ["checks", "is checking", "has checked"] },
  { s: "Our luggage ___ at the airport last night.", a: "was lost", d: ["lost", "was losing", "has lost"] },
  { s: "The problem ___ right now, please be patient.", a: "is being solved", d: ["is solving", "solves", "has solved"] },
  { s: "The novel ___ into twelve languages so far.", a: "has been translated", d: ["translated", "is translating", "has translated"] },
  { s: "The classroom ___ after every lesson.", a: "is cleaned", d: ["cleans", "is cleaning", "has cleaned"] },
  { s: "The prime minister ___ next week.", a: "will be elected", d: ["will elect", "is electing", "elects"] },
  { s: "This bridge ___ in 1932.", a: "was built", d: ["built", "was building", "has built"] },
  { s: "The injured player ___ to hospital immediately.", a: "was taken", d: ["took", "was taking", "has taken"] },
  { s: "Nothing ___ about the accident until yesterday.", a: "was known", d: ["knew", "was knowing", "has known"] },
];

const B2_REPORTED: G[] = [
  { s: "He said he ___ tired and wanted to rest.", a: "was", d: ["is", "has been", "will be"] },
  { s: "She asked me where I ___.", a: "lived", d: ["live", "am living", "will live"] },
  { s: "'I will call you.' — He said he ___ call me.", a: "would", d: ["will", "shall", "is going"] },
  { s: "'Don't be late.' — She told me ___ be late.", a: "not to", d: ["to not", "don't", "to don't"] },
  { s: "'Do you like tea?' — She asked ___ I liked tea.", a: "whether", d: ["that", "what", "which"] },
  { s: "They said they ___ working since morning.", a: "had been", d: ["have been", "were", "are"] },
  { s: "'I lost my wallet.' — He said he ___ his wallet.", a: "had lost", d: ["has lost", "was losing", "would lose"] },
  { s: "She asked how long the trip ___ last.", a: "would", d: ["will", "shall", "is"] },
  { s: "'We are leaving tomorrow.' — They said they were leaving ___.", a: "the next day", d: ["tomorrow", "yesterday", "the day before"] },
  { s: "'I saw him here yesterday.' — He said he had seen him there ___.", a: "the day before", d: ["yesterday", "that day's", "the next day"] },
  { s: "The teacher told the students ___ talking.", a: "to stop", d: ["stopping", "stop", "stopped"] },
  { s: "He asked me ___ I had finished the task.", a: "if", d: ["that", "what", "which"] },
  { s: "He said the meeting ___ already been postponed.", a: "had", d: ["has", "was", "would"] },
  { s: "'Where do you work?' — She asked me where ___.", a: "I worked", d: ["do I work", "did I work", "I do work"] },
  { s: "He advised me ___ the exam again.", a: "to take", d: ["taking", "take", "took"] },
  { s: "They announced that the museum ___ open to visitors the following week.", a: "would be", d: ["will be", "is", "shall be"] },
];

const B2_COND23: G[] = [
  { s: "If I ___ more money, I would travel the world.", a: "had", d: ["have", "would have", "will have"] },
  { s: "If she had studied harder, she ___ the exam.", a: "would have passed", d: ["would pass", "passed", "will pass"] },
  { s: "I ___ you if you had asked me.", a: "would have helped", d: ["would help", "helped", "will help"] },
  { s: "If he ___ so stubborn, we would have finished earlier.", a: "hadn't been", d: ["wasn't", "isn't", "wouldn't be"] },
  { s: "We would go skiing if the weather ___ better.", a: "were", d: ["is", "would be", "will be"] },
  { s: "If you ___ me yesterday, I would have told you everything.", a: "had asked", d: ["asked", "ask", "would ask"] },
  { s: "She would buy the flat if it ___ a bit cheaper.", a: "were", d: ["is", "would be", "was being"] },
  { s: "If they had left earlier, they ___ the train.", a: "wouldn't have missed", d: ["didn't miss", "wouldn't miss", "won't miss"] },
  { s: "I would call her if I ___ her number.", a: "knew", d: ["know", "have known", "would know"] },
  { s: "If it hadn't rained, we ___ the picnic.", a: "would have had", d: ["would have", "had", "will have"] },
  { s: "___ you seen the doctor, you would feel better now.", a: "Had", d: ["Have", "If", "Did"] },
  { s: "He would be healthier if he ___ smoking.", a: "gave up", d: ["gives up", "had given up", "would give up"] },
  { s: "If I ___ you, I would apologise immediately.", a: "were", d: ["am", "was being", "would be"] },
  { s: "What ___ you do if you won the lottery?", a: "would", d: ["will", "did", "do"] },
  { s: "She would have come if she ___ invited.", a: "had been", d: ["was", "were", "has been"] },
  { s: "If the alarm ___, the fire would not have spread.", a: "had worked", d: ["works", "would work", "has worked"] },
];

const B2_WISH: G[] = [
  { s: "I wish I ___ how to play the piano.", a: "knew", d: ["know", "would know", "have known"] },
  { s: "She wishes she ___ taller.", a: "were", d: ["is", "will be", "would be"] },
  { s: "I wish I ___ that comment — it sounded rude.", a: "hadn't made", d: ["didn't make", "haven't made", "wouldn't make"] },
  { s: "If only I ___ more free time.", a: "had", d: ["have", "will have", "would had"] },
  { s: "He wishes he ___ in a bigger city.", a: "lived", d: ["lives", "will live", "would live"] },
  { s: "I wish it ___ raining so we could go out.", a: "would stop", d: ["stopped", "stops", "had stopped"] },
  { s: "We wish we ___ the concert tickets earlier.", a: "had bought", d: ["have bought", "would buy", "were buying"] },
  { s: "I wish I ___ you at the airport last week.", a: "had met", d: ["have met", "would meet", "was meeting"] },
  { s: "She wishes her flat ___ closer to the office.", a: "were", d: ["is", "will be", "would been"] },
  { s: "If only we ___ about the sale yesterday!", a: "had known", d: ["knew", "know", "have known"] },
];

const B2_MODALPERF: G[] = [
  { s: "The ground is wet. It ___ rained last night.", a: "must have", d: ["should have", "can have", "will have"] },
  { s: "He can't ___ the report — he was on holiday all week.", a: "have written", d: ["write", "wrote", "have wrote"] },
  { s: "You ___ warned me about the meeting; I came unprepared.", a: "should have", d: ["should", "must", "will have"] },
  { s: "She isn't here yet — she ___ missed the bus.", a: "might have", d: ["might", "can", "should"] },
  { s: "They ___ arrived by now; the flight landed an hour ago.", a: "must have", d: ["can have", "should of", "will be"] },
  { s: "I can't find my wallet — I ___ it at the office.", a: "may have left", d: ["may leave", "must leave", "can leave"] },
  { s: "He ___ passed the test; he didn't even open the book.", a: "can't have", d: ["must have", "should have", "will have"] },
  { s: "You ___ seen the email — it was sent to everyone.", a: "should have", d: ["can have", "will have", "would have"] },
  { s: "The lights are off — they ___ gone to bed.", a: "must have", d: ["should have", "can have", "would have"] },
  { s: "She ___ forgotten our appointment — she apologised twice.", a: "must have", d: ["should have", "can have", "may not"] },
  { s: "We ___ booked earlier; now there are no seats.", a: "should have", d: ["must have", "could of", "will have"] },
  { s: "He ___ have known about the change; nobody told him.", a: "can't", d: ["must", "should", "would"] },
];

const B2_REL: G[] = [
  { s: "My colleague, ___ speaks four languages, works in export.", a: "who", d: ["which", "whom", "whose"] },
  { s: "The candidate ___ the board chose had more experience.", a: "whom", d: ["which", "whose", "what"] },
  { s: "That's the reason ___ I called you.", a: "why", d: ["which", "whose", "where"] },
  { s: "The engineer ___ design won the award is only 25.", a: "whose", d: ["who", "which", "whom"] },
  { s: "The project, ___ started in March, is almost complete.", a: "which", d: ["that", "who", "whose"] },
  { s: "The hotel ___ we stayed had a wonderful view.", a: "where", d: ["which", "who", "whose"] },
  { s: "The assistant ___ I spoke to was very helpful.", a: "whom", d: ["which", "whose", "what"] },
  { s: "He failed the test, ___ surprised everyone.", a: "which", d: ["that", "what", "who"] },
  { s: "The website ___ I recommended is down today.", a: "which", d: ["who", "whose", "whom"] },
  { s: "Students ___ essays were praised will read them aloud.", a: "whose", d: ["who", "which", "whom"] },
  { s: "The village ___ they found the treasure is now famous.", a: "where", d: ["which", "whose", "whom"] },
  { s: "She mentioned a film, the title ___ I have forgotten.", a: "of which", d: ["of that", "whose of", "what"] },
];

const B2_CAUSATIVE: G[] = [
  { s: "I ___ my car serviced every six months.", a: "have", d: ["do", "make", "am"] },
  { s: "She ___ her teeth whitened last week.", a: "had", d: ["was", "did", "made"] },
  { s: "We are ___ the kitchen painted next week.", a: "having", d: ["doing", "making", "painting"] },
  { s: "He ___ his bike repaired yesterday.", a: "had", d: ["was", "did", "made"] },
  { s: "You should ___ that mole checked by a doctor.", a: "have", d: ["do", "make", "be"] },
  { s: "They are ___ their flat redecorated this month.", a: "having", d: ["doing", "making", "being"] },
  { s: "I ___ my hair cut every three weeks.", a: "have", d: ["cut", "am cutting", "make"] },
  { s: "Where did you ___ your phone repaired?", a: "have", d: ["do", "make", "get to"] },
  { s: "The company ___ its staff trained every year.", a: "has", d: ["is", "makes", "does"] },
  { s: "We had the roof ___ after the storm.", a: "repaired", d: ["repair", "repairing", "to repair"] },
];

const B2_DESPITE: G[] = [
  { s: "___ the rain, the match continued.", a: "Despite", d: ["Although", "Despite of", "Because"] },
  { s: "___ he was tired, he kept working.", a: "Although", d: ["Despite", "In spite", "However"] },
  { s: "In spite ___ the traffic, we arrived on time.", a: "of", d: ["for", "to", "at"] },
  { s: "___ her young age, she runs a successful company.", a: "Despite", d: ["Although", "Despite of", "Even"] },
  { s: "___ the instructions were unclear, the students coped.", a: "Although", d: ["Despite", "In spite of", "However"] },
  { s: "He went to work ___ his illness.", a: "despite", d: ["although", "however", "because"] },
  { s: "___ the delay, the parcel arrived in perfect condition.", a: "Despite", d: ["Although", "However", "Because"] },
  { s: "___ being 90, my grandmother walks every morning.", a: "Despite", d: ["Although", "However", "Because of"] },
  { s: "She got the job ___ the fierce competition.", a: "in spite of", d: ["in spite", "although", "however"] },
  { s: "___ we had booked, there was no table for us.", a: "Although", d: ["Despite", "In spite of", "However"] },
  { s: "The festival went ahead ___ the storm warning.", a: "despite", d: ["although", "however", "due"] },
  { s: "___ the fact that it rained, the picnic was fun.", a: "Despite", d: ["Although", "However", "Due"] },
];

const B2_SOSUCH: G[] = [
  { s: "It was ___ a good film that we watched it twice.", a: "such", d: ["so", "very", "too"] },
  { s: "The exam was ___ difficult that half of the class failed.", a: "so", d: ["such", "very", "much"] },
  { s: "They are ___ kind people that everyone trusts them.", a: "such", d: ["so", "too", "very"] },
  { s: "She speaks ___ fast that I can't follow her.", a: "so", d: ["such", "very", "much"] },
  { s: "It was ___ terrible weather that we stayed in.", a: "such", d: ["so", "very", "too"] },
  { s: "There was ___ much noise that I couldn't sleep.", a: "so", d: ["such", "very", "too"] },
  { s: "He is ___ a talented musician.", a: "such", d: ["so", "very", "too"] },
  { s: "The bag was ___ heavy that she asked for help.", a: "so", d: ["such", "very", "much"] },
  { s: "We had ___ a lovely evening at their place.", a: "such", d: ["so", "very", "too"] },
  { s: "Everything happened ___ quickly that nobody reacted.", a: "so", d: ["such", "very", "too"] },
];

const B2_PV: PV[] = [
  { pv: "put up with", m: "tolerate something unpleasant", d: ["build a shelter", "refuse politely", "lift weights"] },
  { pv: "come across", m: "find by chance", d: ["cross a road", "meet on purpose", "walk towards"] },
  { pv: "get over", m: "recover from an illness or shock", d: ["climb a fence", "avoid", "deliver"] },
  { pv: "bring up", m: "mention a topic in conversation", d: ["carry upstairs", "educate badly", "postpone"] },
  { pv: "catch up with", m: "reach the same level as others", d: ["fall behind", "grab firmly", "avoid meeting"] },
  { pv: "cut down on", m: "reduce the amount of", d: ["chop wood", "increase", "stop completely"] },
  { pv: "look down on", m: "consider someone inferior", d: ["respect deeply", "watch from above", "criticise openly"] },
  { pv: "take after", m: "resemble an older relative", d: ["follow someone", "imitate deliberately", "adopt a child"] },
  { pv: "turn down", m: "refuse an offer or request", d: ["accept it happily", "rotate something", "switch off a device"] },
  { pv: "break down", m: "stop working (a machine or vehicle)", d: ["start working", "enter by force", "assemble"] },
  { pv: "carry out", m: "perform or complete a task", d: ["take outside", "abandon", "delay"] },
  { pv: "set up", m: "establish or arrange", d: ["demolish", "sit down", "delay"] },
  { pv: "sort out", m: "resolve or organise a problem", d: ["create a mess", "ignore", "throw away everything"] },
  { pv: "get away with", m: "escape punishment for", d: ["leave a place legally", "hide from police forever", "receive a prize"] },
  { pv: "look into", m: "investigate", d: ["look inside a box", "ignore completely", "watch television"] },
  { pv: "make up for", m: "compensate for", d: ["apply cosmetics", "apologise formally", "write fiction"] },
  { pv: "stand out", m: "be easy to notice", d: ["stand outside", "refuse to sit", "hide on purpose"] },
  { pv: "take on", m: "accept new work or responsibility", d: ["remove clothes", "fight against", "carry upstairs"] },
  { pv: "hold up", m: "delay someone or something", d: ["lift high", "hang a picture", "support a shelf"] },
  { pv: "let down", m: "disappoint someone", d: ["lower curtains", "make happy", "drop a ball"] },
];

const B2_WORDFORM: G[] = [
  { s: "Complete: The ___ (INTRODUCE) of the law changed everything.", a: "introduction", d: ["introduce", "introducing", "introduced"] },
  { s: "Complete: The ___ (DEVELOP) of new technology is rapid.", a: "development", d: ["develop", "developing", "developed"] },
  { s: "Complete: Her ___ (EXPLAIN) convinced the whole committee.", a: "explanation", d: ["explain", "explaining", "explained"] },
  { s: "Complete: There is a big ___ (DIFFER) between the two reports.", a: "difference", d: ["differ", "different", "differently"] },
  { s: "Complete: We need your ___ (PERMIT) to publish the data.", a: "permission", d: ["permit", "permitted", "permissive"] },
  { s: "Complete: His ___ (FAIL) in the first round motivated him.", a: "failure", d: ["fail", "failing", "failed"] },
  { s: "Complete: The ___ (DECIDE) was announced on Monday.", a: "decision", d: ["decide", "deciding", "decided"] },
  { s: "Complete: Her speech was full of ___ (WISE) and humour.", a: "wisdom", d: ["wise", "wisely", "wiseness"] },
  { s: "Complete: The team showed great ___ (STRONG) in the final.", a: "strength", d: ["strong", "strongly", "strongness"] },
  { s: "Complete: He waited with ___ (PATIENT) for two hours.", a: "patience", d: ["patient", "patiently", "patientness"] },
  { s: "Complete: The country values its ___ (FREE).", a: "freedom", d: ["free", "freely", "freelyness"] },
  { s: "Complete: She has a natural ___ (ABLE) to lead.", a: "ability", d: ["able", "ably", "abling"] },
  { s: "Complete: The ___ (ARGUE) lasted for three hours.", a: "argument", d: ["argue", "arguing", "arguable"] },
  { s: "Complete: There is growing ___ (ANXIOUS) about the economy.", a: "anxiety", d: ["anxious", "anxiously", "anxiousness"] },
  { s: "Complete: The ___ (MANAGE) announced redundancies.", a: "management", d: ["manage", "managing", "managed"] },
  { s: "Complete: His ___ (CONFIDENT) impressed the judges.", a: "confidence", d: ["confident", "confidently", "confiding"] },
];

const B2_LINK: G[] = [
  { s: "The plan is risky; ___, it is the best option available.", a: "nevertheless", d: ["because", "moreover", "although"] },
  { s: "___ you finish by Friday, the contract will be cancelled.", a: "Unless", d: ["If", "Although", "Despite"] },
  { s: "Sales fell sharply; ___, the company cut costs.", a: "therefore", d: ["however", "moreover", "although"] },
  { s: "The flat is small; ___, it is very expensive.", a: "nevertheless", d: ["therefore", "because", "so"] },
  { s: "___ the high cost, demand keeps growing.", a: "In spite of", d: ["Because of", "Owing to", "Even"] },
  { s: "Prices rose; ___, fewer people travelled abroad.", a: "consequently", d: ["however", "although", "in spite"] },
  { s: "___ the manager's experience, the team was confused.", a: "Despite", d: ["Because of", "Owing to", "Even"] },
  { s: "The data was incomplete; ___, the conclusions are tentative.", a: "therefore", d: ["nevertheless", "moreover", "although"] },
  { s: "He is brilliant; ___, he is extremely modest.", a: "moreover", d: ["therefore", "however", "because"] },
  { s: "___ working full-time, she studies in the evenings.", a: "Besides", d: ["Although", "Despite", "However"] },
  { s: "The experiment failed; ___, the researchers kept trying.", a: "nevertheless", d: ["therefore", "because", "so"] },
  { s: "___ you apply early, you may still get a scholarship.", a: "If", d: ["Unless", "Although", "Despite"] },
  { s: "The road was closed; ___, we took a detour.", a: "therefore", d: ["however", "moreover", "although"] },
  { s: "___ his efforts, the project was cancelled.", a: "In spite of", d: ["Because of", "Owing to", "Due to"] },
];

/* ================= IELTS SO'Z POOLLARI (har darajaga o'z pool) ================= */

/** IELTS middle pool — grafik/akademik umumiy leksika (quiz_ielts_easy pooli bilan kesishmaydi) */
const WORDS_IM: Word[] = [
  W("influence", "ta'sir", "влияние"), W("transport", "transport", "транспорт"),
  W("security", "xavfsizlik", "безопасность"), W("wealth", "boylik", "богатство"),
  W("poverty", "qashshoqlik", "бедность"), W("employment", "bandlik", "занятость"),
  W("salary", "oylik maosh", "зарплата"), W("career", "karyera", "карьера"),
  W("deadline", "muddat", "крайний срок"), W("proposal", "taklif", "предложение"),
  W("consumption", "iste'mol", "потребление"), W("expenditure", "xarajat", "расходы"),
  W("estimate", "baholash", "оценка"), W("forecast", "bashorat", "прогноз"),
  W("demand", "talab", "спрос"), W("supply", "taqdim miqdori", "предложение товара"),
  W("revenue", "daromad", "доход"), W("growth", "o'sish", "рост"),
  W("decline", "pasayish", "спад"), W("trend", "tendensiya", "тенденция"),
  W("average", "o'rtacha", "средний"), W("proportion", "ulush", "доля"),
  W("category", "toifa", "категория"), W("criteria", "mezonlar", "критерии"),
  W("approach", "yondashuv", "подход"), W("concept", "tushuncha", "понятие"),
  W("context", "kontekst", "контекст"), W("source", "manba", "источник"),
  W("data", "ma'lumotlar", "данные"), W("statistics", "statistika", "статистика"),
  W("analysis", "tahlil", "анализ"), W("hypothesis", "faraz", "гипотеза"),
  W("assumption", "taxmin", "допущение"), W("bias", "taraflilik", "предвзятость"),
  W("outcome", "yakun", "итог"), W("framework", "asosiy tuzilma", "рамка"),
  W("guideline", "yo'riqnoma", "рекомендация"), W("benchmark", "etalon", "эталон"),
  W("threshold", "chegara nuqtasi", "порог"), W("incentive", "ragbat", "стимул"),
  W("subsidy", "davlat yordami", "субсидия"), W("infrastructure", "infratuzilma", "инфраструктура"),
  W("urban", "shaharga oid", "городской"), W("rural", "qishloqqa oid", "сельский"),
  W("sustainable", "barqaror", "устойчивый"), W("renewable", "qayta tiklanadigan", "возобновляемый"),
  W("emission", "atmosferaga chiqindi", "выбросы"), W("contamination", "ifloslanish", "загрязнение"),
  W("conservation", "muhofaza qilish", "охрана природы"), W("biodiversity", "biologik xilma-xillik", "биоразнообразие"),
  W("deforestation", "o'rmon kesilishi", "вырубка лесов"),
];

/** IELTS hard pool — chuqur akademik leksika (boshqa poolar bilan kesishmaydi) */
const WORDS_IH: Word[] = [
  W("empirical", "tajribaga asoslangan", "эмпирический"), W("anecdotal", "rovoyatga asoslangan", "анекдотический"),
  W("correlation", "o'zaro bog'liqlik", "корреляция"), W("causation", "sabab-natija bog'liqligi", "причинность"),
  W("inference", "xulosa chiqarish", "умозаключение"), W("extrapolate", "prognoz davom ettirmoq", "экстраполировать"),
  W("quantify", "raqamda ifodalamoq", "измерять количественно"), W("qualitative", "sifatga oid", "качественный"),
  W("variance", "o'zgaruvchanlik", "дисперсия"), W("deviation", "chetlanish", "отклонение"),
  W("median", "mediana", "медиана"), W("anomaly", "g'ayrioddiy holat", "аномалия"),
  W("substantiate", "asoslab bermoq", "обосновывать"), W("refute", "inkor etmoq", "опровергать"),
  W("corroborate", "tasdiqlamoq", "подтверждать"), W("juxtapose", "yonma-yon qo'ymoq", "сопоставлять"),
  W("delineate", "chegaralash", "очерчивать"), W("encapsulate", "qisqacha ifodalamoq", "вкратце выражать"),
  W("perpetuate", "abadiylashtirmoq", "увековечивать"), W("exacerbate", "kuchaytirmoq (muammoni)", "обострять"),
  W("mitigate", "kamaytirmoq (zararni)", "смягчать"), W("alleviate", "yengillik berish", "облегчать страдание"),
  W("undermine", "zaiflashtirmoq", "подрывать"), W("underscore", "ta'kidlab ko'rsatmoq", "подчёркивать особо"),
  W("encompass", "qamrab olmoq", "охватывать"), W("entail", "o'z ichiga olish", "влечь за собой"),
  W("preclude", "oldini olmoq", "исключать"), W("articulate", "oydin ifodalamoq", "ясно выражать"),
  W("scrutiny", "sinchiklab tekshiruv", "тщательная проверка"), W("disparity", "nomutanosiblik", "несоответствие"),
  W("discrepancy", "raqamli farq", "расхождение"), W("divergence", "ajralish", "дивергенция"),
  W("prevalence", "keng tarqalganlik", "распространённость"), W("viability", "hayotiylik", "жизнеспособность"),
  W("coherent", "mantiqiy uzluksiz", "связный"), W("concise", "qisqa va mazmunli", "лаконичный"),
  W("eloquent", "notiqdor", "красноречивый"), W("implicit", "yashirin, bilvosita", "неявный"),
  W("explicit", "oydin bayon qilingan", "явный, прямой"), W("inherent", "o'ziga xos, tabiiy", "присущий"),
  W("intrinsic", "ichki", "внутренний"), W("prerequisite", "oldindan shart", "предпосылка"),
  W("conclusive", "qat'iy dalil", "неопровержимый"), W("tentative", "taxminiy", "предварительный"),
  W("verbatim", "so'zma-so'z", "дословно"), W("candid", "ochiqko'ngil", "откровенный"),
  W("meticulous", "sinchkov", "скрупулёзный"), W("pragmatic", "amaliy", "прагматичный"),
  W("skeptical", "shubhalanuvchi", "скептический"), W("ambivalent", "ikki xil kayfiyatda", "двойственный"),
  W("indifferent", "betaraf", "безразличный"), W("inquisitive", "qiziquvchan", "любознательный"),
  W("observant", "kuzatuvchan", "наблюдательный"),
];

/* ================= IELTS GRAMMATIKA BLOKLARI ================= */

const IE_COMP: G[] = [
  { s: "This method is far ___ effective than the previous one.", a: "more", d: ["most", "very", "much"] },
  { s: "It was the ___ challenging task of all three.", a: "most", d: ["more", "much", "very"] },
  { s: "The results were ___ than we expected.", a: "better", d: ["best", "good", "more good"] },
  { s: "Sales in 2019 were ___ higher than in 2015.", a: "slightly", d: ["slight", "slighter", "slightest"] },
  { s: "The second graph shows a ___ sharper increase.", a: "far", d: ["very", "most", "much more"] },
  { s: "This figure is ___ than double the 2010 level.", a: "nearly", d: ["near", "nearer", "nearest"] },
  { s: "The northern region performed ___ of all.", a: "the worst", d: ["worse", "the worse", "badly"] },
  { s: "The change was ___ noticeable in rural areas.", a: "least", d: ["less", "little", "smaller"] },
  { s: "The average is ___ higher this quarter.", a: "marginally", d: ["marginal", "margin", "margins"] },
  { s: "Spending on transport was ___ as high as on education.", a: "twice", d: ["two", "double of", "twin"] },
  { s: "This is the ___ used indicator in economics.", a: "most widely", d: ["wider", "more wide", "widest"] },
  { s: "The number of visitors was ___ than in the previous year.", a: "lower", d: ["lowest", "more low", "low"] },
  { s: "The film was ___ less entertaining than the trailer suggested.", a: "far", d: ["very", "most", "much more"] },
  { s: "Of the five options, this one is ___ practical.", a: "the most", d: ["more", "much", "very"] },
  { s: "Costs rose ___ faster than revenues.", a: "considerably", d: ["considerable", "consider", "consideration"] },
  { s: "The southern data set is ___ reliable than the northern one.", a: "more", d: ["most", "very", "much"] },
  { s: "It was by ___ the largest increase.", a: "far", d: ["far of", "farthest", "long"] },
  { s: "The gap between the two lines ___ wider every year.", a: "grew", d: ["growed", "grown", "grow"] },
  { s: "The new model is ___ efficient than the old one.", a: "twice as", d: ["as twice", "twice more than", "double as"] },
  { s: "Rainfall was ___ in 2020 than in any other year.", a: "heavier", d: ["heaviest", "more heavy", "heavy"] },
];

const IE_LINK: G[] = [
  { s: "___ the bad weather, the flight departed on time.", a: "Despite", d: ["Although", "However", "Because"] },
  { s: "The population grew steadily; ___, unemployment fell.", a: "meanwhile", d: ["therefore", "because", "although"] },
  { s: "___ rising costs, demand remained strong.", a: "Despite", d: ["Because of", "Owing to", "However"] },
  { s: "The scheme failed; ___, the government abandoned it.", a: "consequently", d: ["however", "although", "despite"] },
  { s: "___ urban areas are crowded, rents remain high.", a: "Because", d: ["Although", "Despite", "However"] },
  { s: "___ people exercise regularly, they tend to sleep better.", a: "If", d: ["Unless", "Although", "Despite"] },
  { s: "The rules were strict; ___, attendance improved.", a: "as a result", d: ["in contrast", "although", "despite"] },
  { s: "___ the evidence, the theory remains popular.", a: "Despite", d: ["Because of", "Owing to", "Whereas"] },
  { s: "___ fossil fuels are cheap, they harm the environment.", a: "Although", d: ["Because", "Despite", "However"] },
  { s: "Recycling rates improved; ___, more bins were installed.", a: "as", d: ["although", "however", "despite"] },
  { s: "___ spending rose, satisfaction did not improve.", a: "Although", d: ["Because", "Despite", "So"] },
  { s: "The figure ___ from 20% to 35% over the decade.", a: "climbed", d: ["climbed up to", "was climbed", "climbing"] },
  { s: "___ by the data, the policy was a success.", a: "Judging", d: ["Judged", "Judge", "To judge"] },
  { s: "___ a whole, the chart shows a downward trend.", a: "On", d: ["In", "At", "By"] },
  { s: "The rise ___ sharply in the final quarter.", a: "accelerated", d: ["accelerated up", "was accelerate", "accelerating"] },
  { s: "___ conclusion, both methods have drawbacks.", a: "In", d: ["On", "At", "By"] },
  { s: "The proportion ___ steadily throughout the period.", a: "increased", d: ["increased up", "was increase", "increasing"] },
  { s: "___ it may seem surprising, the answer is negative.", a: "While", d: ["Despite", "Because", "However"] },
  { s: "The figures ___ a clear upward trend.", a: "reveal", d: ["reveal about", "are reveal", "revealing"] },
  { s: "___ contrast, the rural figure remained flat.", a: "In", d: ["On", "At", "By"] },
  { s: "The number ___ to just under a million by 2015.", a: "had risen", d: ["rose up", "was rising up", "has risen up"] },
  { s: "___ peak, sales reached 4.5 million units.", a: "At", d: ["In", "On", "To"] },
  { s: "The trend ___ after the new law was passed.", a: "reversed", d: ["reversed back", "was reverse", "reversing"] },
];

const IE_COLL: G[] = [
  { s: "Choose the correct collocation: ___ attention to detail", a: "pay", d: ["put", "make", "do"] },
  { s: "Choose the correct collocation: ___ progress", a: "make", d: ["do", "take", "put"] },
  { s: "Choose the correct collocation: ___ an experiment", a: "conduct", d: ["make", "do up", "take"] },
  { s: "Choose the correct collocation: ___ measures", a: "take", d: ["do", "make", "put"] },
  { s: "Choose the correct collocation: ___ a conclusion", a: "draw", d: ["do", "make", "take"] },
  { s: "Choose the correct collocation: ___ advantage of", a: "take", d: ["do", "make", "put"] },
  { s: "Choose the correct collocation: ___ responsibility for", a: "take", d: ["make", "do", "put"] },
  { s: "Choose the correct collocation: ___ a difference", a: "make", d: ["do", "take", "give"] },
  { s: "Choose the correct collocation: ___ business with", a: "do", d: ["make", "take", "give"] },
  { s: "Choose the correct collocation: ___ a favour", a: "do", d: ["make", "take", "give"] },
  { s: "Choose the correct collocation: ___ an effort", a: "make", d: ["do", "take", "put"] },
  { s: "Choose the correct collocation: ___ a survey", a: "conduct", d: ["make", "do up", "take"] },
  { s: "Choose the correct collocation: ___ a role in", a: "play", d: ["do", "make", "take"] },
  { s: "Choose the correct collocation: ___ pressure on", a: "put", d: ["make", "do", "take"] },
  { s: "Choose the correct collocation: ___ standards", a: "meet", d: ["make", "do", "put"] },
  { s: "Choose the correct collocation: ___ a policy", a: "implement", d: ["make", "do", "put"] },
  { s: "Choose the correct collocation: ___ the criteria", a: "meet", d: ["make", "do", "put"] },
  { s: "Choose the correct collocation: ___ into force", a: "come", d: ["make", "take", "put"] },
  { s: "Choose the correct collocation: ___ evidence", a: "provide", d: ["make", "do", "put"] },
  { s: "Choose the correct collocation: ___ a question", a: "raise", d: ["make", "do", "give"] },
  { s: "Choose the correct collocation: ___ harm", a: "do", d: ["make", "take", "put"] },
  { s: "Choose the correct collocation: ___ a contribution", a: "make", d: ["do", "take", "give"] },
];

const IH_GRAPH: G[] = [
  { s: "The chart ___ the number of visitors.", a: "shows", d: ["show about", "is show", "showing"] },
  { s: "Sales ___ steadily between 2010 and 2015.", a: "grew", d: ["growed", "grown", "grow"] },
  { s: "The figure ___ at 20% in 2005.", a: "stood", d: ["stand", "standing", "was stand"] },
  { s: "Numbers ___ by 15% over the period.", a: "rose", d: ["raised", "arose", "aroused"] },
  { s: "The line ___ slightly in the final year.", a: "fell", d: ["felt", "falling", "was fall"] },
  { s: "The trend ___ in 2012 and then recovered.", a: "dipped", d: ["dipped down from", "was dip", "dipping"] },
  { s: "The chart ___ three main categories.", a: "contains", d: ["contain", "containing", "is contain"] },
  { s: "The peak ___ in 2018.", a: "occurred", d: ["occur", "occurring", "was occur"] },
  { s: "The proportion ___ at around 40%.", a: "remained", d: ["remain", "remaining", "was remain"] },
  { s: "___ 2010, the figure had doubled.", a: "By", d: ["At", "In", "From"] },
  { s: "Both charts ___ spending patterns.", a: "illustrate", d: ["illustrate about", "are illustrate", "illustrating"] },
  { s: "The graph ___ a gradual improvement.", a: "shows", d: ["show", "showing", "shown"] },
  { s: "Figures ___ from 2015 to 2020.", a: "are compared", d: ["compare", "comparing", "are comparing"] },
  { s: "The rate ___ between 5% and 8%.", a: "fluctuated", d: ["fluctuate", "fluctuating", "was fluctuate"] },
  { s: "The data ___ collected in 2021.", a: "were", d: ["is", "has", "does"] },
];

const IH_ACADVERB: PV[] = [
  { pv: "substantiate", m: "provide evidence to support", d: ["reject completely", "copy exactly", "repeat aloud"] },
  { pv: "refute", m: "prove a claim wrong", d: ["confirm strongly", "accept willingly", "rewrite carefully"] },
  { pv: "corroborate", m: "confirm with additional evidence", d: ["deny entirely", "translate", "simplify"] },
  { pv: "undermine", m: "weaken gradually", d: ["dig under a building", "strengthen", "support openly"] },
  { pv: "underscore", m: "emphasise", d: ["lower the price", "draw a line", "rate highly"] },
  { pv: "encompass", m: "include a wide range of", d: ["surround with a fence", "exclude", "measure precisely"] },
  { pv: "entail", m: "involve as a necessary part", d: ["refuse politely", "postpone", "rent out"] },
  { pv: "preclude", m: "prevent something from happening", d: ["prepare in advance", "allow", "announce"] },
  { pv: "mitigate", m: "make something bad less severe", d: ["make worse", "explain carefully", "cause directly"] },
  { pv: "alleviate", m: "ease pain or problems", d: ["worsen", "ignore", "allocate"] },
  { pv: "exacerbate", m: "make a problem worse", d: ["solve completely", "reduce slightly", "describe"] },
  { pv: "juxtapose", m: "place side by side for contrast", d: ["mix thoroughly", "separate", "translate"] },
  { pv: "delineate", m: "describe or outline precisely", d: ["delete lines", "decorate", "deny"] },
  { pv: "encapsulate", m: "express briefly the essential points", d: ["wrap in plastic", "expand greatly", "forget"] },
  { pv: "perpetuate", m: "make something continue indefinitely", d: ["end permanently", "store carefully", "photograph"] },
  { pv: "articulate", m: "express clearly in words", d: ["speak unclearly", "paint", "count"] },
  { pv: "coherent", m: "logical and well organised", d: ["confusing and jumpy", "loud", "cheerful"] },
  { pv: "concise", m: "short and clear", d: ["long and detailed", "rude", "repeated"] },
  { pv: "meticulous", m: "extremely careful about details", d: ["careless", "mean", "late"] },
  { pv: "pragmatic", m: "practical rather than idealistic", d: ["dreamy", "strict", "fast"] },
];

const IH_ACADEMIC: G[] = [
  { s: "The findings ___ our initial hypothesis.", a: "confirm", d: ["confirm about", "are confirm", "confirming"] },
  { s: "The study was ___ over a five-year period.", a: "conducted", d: ["conducted to", "conducting", "conduct"] },
  { s: "Researchers ___ a significant correlation.", a: "identified", d: ["identified to", "identifying", "identification"] },
  { s: "The data ___ to our earlier findings.", a: "correspond", d: ["corresponds", "corresponding", "correspondence"] },
  { s: "The model ___ for seasonal variation.", a: "accounts", d: ["counts", "accounts for of", "accounting"] },
  { s: "Participants were ___ at random.", a: "selected", d: ["selecting", "select", "selective"] },
  { s: "The results ___ further investigation.", a: "warrant", d: ["warrants", "warning", "warranting"] },
  { s: "The two variables are closely ___.", a: "related", d: ["relating", "relation", "relate"] },
  { s: "The introduction ___ the scope of the essay.", a: "defines", d: ["defining", "definition", "defined to"] },
  { s: "His argument is ___ but lacks evidence.", a: "plausible", d: ["plausiblely", "plausibility", "plausibleness"] },
  { s: "The author ___ a number of sources.", a: "cites", d: ["sites", "sighting", "citing"] },
  { s: "The paper was ___ in a leading journal.", a: "published", d: ["publishing", "publish", "publication"] },
  { s: "The committee ___ the proposal unanimously.", a: "endorsed", d: ["endorses to", "endorsing", "endorsement"] },
  { s: "The method was ___ criticised.", a: "widely", d: ["wide", "widen", "width"] },
  { s: "The theory remains ___.", a: "influential", d: ["influence", "influencing", "influentially"] },
  { s: "The evidence ___ the earlier claims.", a: "contradicts", d: ["contradicting", "contradiction", "contradict about"] },
  { s: "The study ___ small sample size.", a: "suffers from", d: ["suffers", "is suffer", "suffering of"] },
  { s: "Further research is ___.", a: "required", d: ["requiring", "require", "requirement"] },
  { s: "The article ___ light on the issue.", a: "sheds", d: ["shines", "gives up", "puts out"] },
  { s: "The debate ___ for decades.", a: "has continued", d: ["is continue", "continued about", "continuing"] },
  { s: "The findings should be ___ with caution.", a: "interpreted", d: ["interpreting", "interpret", "interpretation"] },
  { s: "The model ___ real-world conditions.", a: "simulates", d: ["simulate about", "simulation", "simulating"] },
  { s: "Their conclusions are open ___ criticism.", a: "to", d: ["for", "at", "with"] },
  { s: "The results were ___ across all groups.", a: "consistent", d: ["consistency", "consistently", "consisting"] },
];

const IH_VOCABCTX: G[] = [
  { s: "The ___ of renewable energy has doubled in a decade.", a: "consumption", d: ["consume", "consuming", "consumed"] },
  { s: "Urban ___ continues to rise.", a: "population", d: ["populate", "populated", "populating"] },
  { s: "The government introduced a ___ on plastic bags.", a: "ban", d: ["banned", "banning", "banish"] },
  { s: "Carbon ___ must be cut by half.", a: "emissions", d: ["emitting", "emitted", "emit"] },
  { s: "The city invested in public ___.", a: "transport", d: ["transportable", "transported", "transporting"] },
  { s: "Data ___ shows a clear pattern.", a: "analysis", d: ["analyse", "analysing", "analysed"] },
  { s: "There is a strong ___ between diet and health.", a: "correlation", d: ["correlate", "correlated", "correlating"] },
  { s: "The ___ of the project exceeded the budget.", a: "cost", d: ["costly", "costing", "costed"] },
  { s: "___ in rural areas is falling.", a: "Employment", d: ["Employ", "Employed", "Employing"] },
  { s: "The law came into ___ last year.", a: "force", d: ["forced", "forcing", "forceful"] },
  { s: "The report offers several ___ for the decline.", a: "explanations", d: ["explain", "explaining", "explained"] },
  { s: "___ change is the defining issue of our time.", a: "Climate", d: ["Climatic of", "Climatically", "Climates"] },
  { s: "The survey measured household ___.", a: "income", d: ["incomer", "incoming", "income of"] },
  { s: "Education ___ social mobility.", a: "promotes", d: ["promotion", "promotional", "promoting"] },
  { s: "The policy aims to reduce ___.", a: "poverty", d: ["poor", "poorly", "poorness"] },
  { s: "Demand ___ supply in most sectors.", a: "outstrips", d: ["outstripped to", "outstripping", "outstrip"] },
  { s: "The economy experienced a sharp ___.", a: "downturn", d: ["downward", "downsize", "downpour"] },
  { s: "Interest rates were ___ by the central bank.", a: "raised", d: ["risen", "arose", "aroused"] },
  { s: "The ___ between rich and poor is widening.", a: "gap", d: ["gape", "gaping", "gapped"] },
  { s: "Critics questioned the ___ of the study.", a: "validity", d: ["valid", "validate", "validly"] },
];

/* ================= YAKUNIY GENERATORLAR ================= */

/** HAQIQIY B1: WORDS_B1 leksika + B1 grammatikasi (~500 savol, seed 295 oladi) */
export function genRealB1(): QGen[] {
  const rng = rngOf("real-b1-mix");
  const all = [
    ...vocabBank("b1", WORDS_B1),
    ...grammarQs("b1-perf", NOTE.perf, B1_PERF),
    ...grammarQs("b1-forsince", NOTE.forsince, B1_FORSINCE),
    ...grammarQs("b1-future", NOTE.future, B1_FUTURE),
    ...grammarQs("b1-cond1", NOTE.cond1, B1_COND1),
    ...grammarQs("b1-modal", NOTE.modal, B1_MODAL),
    ...grammarQs("b1-gerinf", NOTE.gerinf, B1_GERINF),
    ...grammarQs("b1-rel", NOTE.rel, B1_REL),
    ...grammarQs("b1-usedto", NOTE.usedto, B1_USEDTO),
    ...grammarQs("b1-tooenough", NOTE.tooenough, B1_TOOENOUGH),
    ...grammarQs("b1-tags", NOTE.tags, B1_TAGS),
    ...phrasalQs("b1-pv", B1_PV),
    ...grammarQs("b1-link", NOTE.link1, B1_LINK),
    ...grammarQs("b1-comp", NOTE.comp, B1_COMP),
  ];
  return dedupe(shuffle(rng, all));
}

/** HAQIQIY B2: WORDS_B2X leksika + B2 grammatikasi (~520 savol) */
export function genRealB2(): QGen[] {
  const rng = rngOf("real-b2-mix");
  const all = [
    ...vocabBank("b2", WORDS_B2X),
    ...grammarQs("b2-pastperf", NOTE.pastperf, B2_PASTPERF),
    ...grammarQs("b2-passive", NOTE.passive, B2_PASSIVE),
    ...grammarQs("b2-reported", NOTE.report, B2_REPORTED),
    ...grammarQs("b2-cond23", NOTE.cond23, B2_COND23),
    ...grammarQs("b2-wish", NOTE.wish, B2_WISH),
    ...grammarQs("b2-modalperf", NOTE.modalperf, B2_MODALPERF),
    ...grammarQs("b2-rel", NOTE.rel2, B2_REL),
    ...grammarQs("b2-causative", NOTE.causative, B2_CAUSATIVE),
    ...grammarQs("b2-despite", NOTE.despite, B2_DESPITE),
    ...grammarQs("b2-sosuch", NOTE.sosuch, B2_SOSUCH),
    ...phrasalQs("b2-pv", B2_PV),
    ...grammarQs("b2-wordform", NOTE.wordform, B2_WORDFORM),
    ...grammarQs("b2-link", NOTE.link2, B2_LINK),
  ];
  return dedupe(shuffle(rng, all));
}

/** IELTS easy: WORDS_B2 leksika + grafik tili asoslari */
export function genIeltsEasy2(): QGen[] {
  const rng = rngOf("ielts-easy-mix");
  const all = [
    ...vocabBank("ielts-e", WORDS_B2),
    ...grammarQs("ie-e-graph", NOTE.graph, IH_GRAPH),
  ];
  return dedupe(shuffle(rng, all));
}

/** IELTS middle: WORDS_IM leksika + qiyosiy daraja + IELTS bog'lovchilari + kollokatsiyalar */
export function genIeltsMiddle2(): QGen[] {
  const rng = rngOf("ielts-middle-mix");
  const all = [
    ...vocabBank("ielts-m", WORDS_IM),
    ...grammarQs("ie-m-comp", NOTE.comp, IE_COMP),
    ...grammarQs("ie-m-link", NOTE.ieltslink, IE_LINK),
    ...grammarQs("ie-m-coll", NOTE.coll, IE_COLL),
  ];
  return dedupe(shuffle(rng, all));
}

/** IELTS hard: WORDS_IH leksika + akademik fe'llar + akademik so'z tanlash */
export function genIeltsHard2(): QGen[] {
  const rng = rngOf("ielts-hard-mix");
  const all = [
    ...vocabBank("ielts-h", WORDS_IH),
    ...phrasalQs("ie-h-acadverb", IH_ACADVERB),
    ...grammarQs("ie-h-academic", NOTE.acad, IH_ACADEMIC),
    ...grammarQs("ie-h-vocabctx", NOTE.vocabctx, IH_VOCABCTX),
  ];
  return dedupe(shuffle(rng, all));
}
