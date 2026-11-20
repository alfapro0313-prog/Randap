/**
 * Ingliz tili (CEFR A1-B2, IELTS) va Listening savollari generatori.
 * Lexik pool tarjima savollari, grammatika shablonlari (a/an, to be, Present
 * Simple, Past Simple, predloglar, ko'plik, qiyoshiq daraja) va tinglab
 * tushunish (Web Speech API orqali o'qiladigan audio matn bilan).
 */
import {
  dedupe,
  optionsFor,
  rangeInt,
  rngOf,
  same,
  shuffle,
  type L3,
  type QGen,
  type Rng,
} from "./gen-core";

type Word = { en: string; uz: string; ru: string };
const W = (en: string, uz: string, ru: string): Word => ({ en, uz, ru });

const WORDS_A1: Word[] = [
  W("apple", "olma", "яблоко"), W("water", "suv", "вода"), W("house", "uy", "дом"),
  W("book", "kitob", "книга"), W("school", "maktab", "школа"), W("friend", "do'st", "друг"),
  W("mother", "ona", "мама"), W("father", "ota", "папа"), W("cat", "mushuk", "кошка"),
  W("dog", "it", "собака"), W("sun", "quyosh", "солнце"), W("moon", "oy", "луна"),
  W("star", "yulduz", "звезда"), W("tree", "daraxt", "дерево"), W("flower", "gul", "цветок"),
  W("red", "qizil", "красный"), W("blue", "ko'k", "синий"), W("green", "yashil", "зелёный"),
  W("yellow", "sariq", "жёлтый"), W("black", "qora", "чёрный"), W("white", "oq", "белый"),
  W("big", "katta", "большой"), W("small", "kichik", "маленький"), W("hot", "issiq", "горячий"),
  W("cold", "sovuq", "холодный"), W("good", "yaxshi", "хороший"), W("bad", "yomon", "плохой"),
  W("eat", "yemoq", "есть"), W("drink", "ichmoq", "пить"), W("sleep", "uxlamoq", "спать"),
  W("read", "o'qimoq", "читать"), W("write", "yozmoq", "писать"), W("run", "yugurmoq", "бежать"),
  W("walk", "yurmoq", "ходить"), W("day", "kun", "день"), W("night", "tun", "ночь"),
  W("morning", "ertalab", "утро"), W("evening", "kechqurun", "вечер"), W("year", "yil", "год"),
  W("bread", "non", "хлеб"), W("milk", "sut", "молоко"), W("tea", "choy", "чай"),
  W("city", "shahar", "город"), W("village", "qishloq", "деревня"), W("door", "eshik", "дверь"),
  W("window", "oyna", "окно"), W("table", "stol", "стол"), W("chair", "stul", "стул"),
  W("pen", "ruchka", "ручка"), W("hand", "qo'l", "рука"), W("head", "bosh", "голова"),
  W("eye", "ko'z", "глаз"), W("ear", "quloq", "ухо"), W("nose", "burun", "нос"),
  W("bird", "qush", "птица"), W("fish", "baliq", "рыба"), W("horse", "ot", "конь"),
  W("cow", "sigir", "корова"), W("sheep", "qo'y", "овца"), W("rain", "yomg'ir", "дождь"),
  W("snow", "qor", "снег"), W("wind", "shamol", "ветер"), W("fire", "olov", "огонь"),
  W("love", "sevgi", "любовь"), W("happy", "baxtli", "счастливый"), W("sad", "xafa", "грустный"),
  W("fast", "tez", "быстрый"), W("slow", "sekin", "медленный"), W("new", "yangi", "новый"),
  W("old", "eski", "старый"), W("long", "uzun", "длинный"), W("short", "qisqa", "короткий"),
  W("learn", "o'rganmoq", "учиться"), W("play", "o'ynamoq", "играть"), W("sing", "kuylamoq", "петь"),
  W("dance", "raqs qilmoq", "танцевать"), W("work", "ishlamoq", "работать"), W("open", "ochmoq", "открывать"),
  W("close", "yopmoq", "закрывать"), W("buy", "sotib olmoq", "покупать"), W("sell", "sotmoq", "продавать"),
];

const WORDS_A2: Word[] = [
  W("weather", "ob-havo", "погода"), W("kitchen", "oshxona", "кухня"), W("bedroom", "yotoqxona", "спальня"),
  W("market", "bozor", "рынок"), W("river", "daryo", "река"), W("sea", "dengiz", "море"),
  W("mountain", "tog'", "гора"), W("forest", "o'rmon", "лес"), W("birthday", "tug'ilgan kun", "день рождения"),
  W("teacher", "o'qituvchi", "учитель"), W("doctor", "shifokor", "врач"), W("driver", "haydovchi", "водитель"),
  W("worker", "ishchi", "рабочий"), W("student", "o'quvchi", "ученик"), W("breakfast", "nonushta", "завтрак"),
  W("lunch", "tushlik", "обед"), W("dinner", "kechki ovqat", "ужин"), W("cheap", "arzon", "дешёвый"),
  W("expensive", "qimmat", "дорогой"), W("beautiful", "chiroyli", "красивый"), W("clean", "toza", "чистый"),
  W("dirty", "iflos", "грязный"), W("warm", "iliq", "тёплый"), W("thirsty", "chanqoq", "жаждущий"),
  W("tired", "charchagan", "уставший"), W("strong", "kuchli", "сильный"), W("weak", "zaif", "слабый"),
  W("easy", "oson", "лёгкий"), W("difficult", "qiyin", "трудный"), W("question", "savol", "вопрос"),
  W("answer", "javob", "ответ"), W("money", "pul", "деньги"), W("shop", "do'kon", "магазин"),
  W("price", "narx", "цена"), W("car", "mashina", "машина"), W("train", "poyezd", "поезд"),
  W("plane", "samolyot", "самолёт"), W("ship", "kema", "корабль"), W("ticket", "chipta", "билет"),
  W("newspaper", "gazeta", "газета"), W("story", "hikoya", "рассказ"), W("song", "qo'shiq", "песня"),
  W("music", "musiqa", "музыка"), W("picture", "rasm", "картина"), W("letter", "xat", "письмо"),
  W("library", "kutubxona", "библиотека"), W("hospital", "kasalxona", "больница"), W("bank", "bank", "банк"),
  W("hotel", "mehmonxona", "гостиница"), W("cinema", "kinoteatr", "кинотеатр"), W("winter", "qish", "зима"),
  W("summer", "yoz", "лето"), W("spring", "bahor", "весна"), W("autumn", "kuz", "осень"),
  W("clothes", "kiyim", "одежда"), W("shirt", "ko'ylak", "рубашка"), W("hat", "kalpoq", "шапка"),
  W("coat", "palto", "пальто"),
];

const WORDS_B1: Word[] = [
  W("improve", "yaxshilamoq", "улучшать"), W("decide", "qaror qilmoq", "решать"),
  W("describe", "tavsiflamoq", "описывать"), W("explain", "tushuntirmoq", "объяснять"),
  W("remember", "eslab qolmoq", "помнить"), W("forget", "unutmoq", "забывать"),
  W("understand", "tushunmoq", "понимать"), W("believe", "ishonmoq", "верить"),
  W("refuse", "rad etmoq", "отказываться"), W("succeed", "muvaffaqiyat qozonmoq", "добиваться успеха"),
  W("fail", "muvaffaqiyatsiz bo'lmoq", "терпеть неудачу"), W("arrive", "yetib kelmoq", "прибывать"),
  W("leave", "ketmoq", "уходить"), W("return", "qaytmoq", "возвращаться"),
  W("borrow", "qarzga olmoq", "занимать"), W("lend", "qarzga bermoq", "давать взаймы"),
  W("waste", "isrof qilmoq", "тратить впустую"), W("save", "tejamoq", "экономить"),
  W("spend", "sarflamoq", "тратить"), W("pay", "to'lamoq", "платить"),
  W("choose", "tanlamoq", "выбирать"), W("change", "o'zgartirmoq", "менять"),
  W("begin", "boshlamoq", "начинать"), W("finish", "tugatmoq", "заканчивать"),
  W("continue", "davom etmoq", "продолжать"), W("stop", "to'xtamoq", "останавливаться"),
  W("wait", "kutmoq", "ждать"), W("follow", "ortidan bormoq", "следовать"),
  W("meet", "uchrashmoq", "встречать"), W("travel", "sayohat qilmoq", "путешествовать"),
  W("live", "yashamoq", "жить"), W("stay", "qolmoq", "оставаться"),
  W("grow", "o'smoq", "расти"), W("build", "qurmoq", "строить"),
  W("break", "sindirmoq", "сломать"), W("carry", "olib yurmoq", "носить"),
  W("catch", "ushlamoq", "ловить"), W("pull", "tortmoq", "тянуть"),
  W("push", "itarmoq", "толкать"), W("lift", "ko'tarmoq", "поднимать"),
  W("laugh", "kulmoq", "смеяться"), W("cry", "yig'lamoq", "плакать"),
  W("shout", "baqirmoq", "кричать"), W("whisper", "pichirlamoq", "шептать"),
  W("listen", "tinglamoq", "слушать"), W("hear", "eshitmoq", "слышать"),
  W("watch", "tomosha qilmoq", "наблюдать"), W("smell", "hidlamoq", "нюхать"),
  W("touch", "tegmoq", "трогать"), W("hope", "umid qilmoq", "надеяться"),
  W("wish", "tilamoq", "желать"), W("invite", "taklif qilmoq", "приглашать"),
];

const WORDS_B2: Word[] = [
  W("achieve", "erishmoq", "достигать"), W("analyze", "tahlil qilmoq", "анализировать"),
  W("available", "mavjud", "доступный"), W("benefit", "foyda", "польза"),
  W("contribute", "hissa qo'shmoq", "вносить вклад"), W("create", "yaratmoq", "создавать"),
  W("develop", "rivojlantirmoq", "развивать"), W("environment", "atrof-muhit", "окружающая среда"),
  W("establish", "tashkil etmoq", "основывать"), W("evidence", "dalil", "доказательство"),
  W("factor", "omil", "фактор"), W("government", "hukumat", "правительство"),
  W("increase", "oshmoq", "увеличиваться"), W("decrease", "kamaymoq", "уменьшаться"),
  W("significant", "ahamiyatli", "значительный"), W("important", "muhim", "важный"),
  W("necessary", "zarur", "необходимый"), W("experience", "tajriba", "опыт"),
  W("knowledge", "bilim", "знание"), W("research", "tadqiqot", "исследование"),
  W("society", "jamiyat", "общество"), W("technology", "texnologiya", "технология"),
  W("education", "ta'lim", "образование"), W("health", "salomatlik", "здоровье"),
  W("economy", "iqtisodiyot", "экономика"), W("culture", "madaniyat", "культура"),
  W("language", "til", "язык"), W("population", "aholi", "население"),
  W("resource", "resurs", "ресурс"), W("energy", "energiya", "энергия"),
  W("industry", "sanoat", "промышленность"), W("agriculture", "qishloq xo'jaligi", "сельское хозяйство"),
  W("climate", "iqlim", "климат"), W("pollution", "ifloslanish", "загрязнение"),
  W("solution", "yechim", "решение"), W("problem", "muammo", "проблема"),
  W("challenge", "sinov", "испытание"), W("opportunity", "imkoniyat", "возможность"),
  W("advantage", "afzallik", "преимущество"), W("disadvantage", "kamchilik", "недостаток"),
  W("effect", "ta'sir", "эффект"), W("strategy", "strategiya", "стратегия"),
  W("policy", "siyosat", "политика"), W("law", "qonun", "закон"),
  W("right", "huquq", "право"), W("duty", "majburiyat", "обязанность"),
  W("responsibility", "mas'uliyat", "ответственность"), W("community", "jamoa", "сообщество"),
  W("individual", "shaxs", "личность"), W("quality", "sifat", "качество"),
  W("quantity", "miqdor", "количество"), W("method", "usul", "метод"),
  W("process", "jarayon", "процесс"), W("result", "natija", "результат"),
  W("reason", "sabab", "причина"), W("purpose", "maqsad", "цель"),
  W("plan", "reja", "план"), W("project", "loyiha", "проект"),
  W("program", "dastur", "программа"), W("system", "tizim", "система"),
  W("structure", "tuzilma", "структура"), W("feature", "xususiyat", "черта"),
  W("similar", "o'xshash", "похожий"), W("different", "farqli", "разный"),
  W("typical", "odatiy", "типичный"), W("traditional", "an'anaviy", "традиционный"),
  W("modern", "zamonaviy", "современный"), W("ancient", "qadimgi", "древний"),
  W("natural", "tabiiy", "естественный"), W("artificial", "sun'iy", "искусственный"),
  W("complex", "murakkab", "сложный"), W("simple", "oddiy", "простой"),
  W("effective", "samarali", "эффективный"), W("reliable", "ishonchli", "надёжный"),
  W("flexible", "moslashuvchan", "гибкий"), W("stable", "barqaror", "стабильный"),
  W("common", "keng tarqalgan", "распространённый"), W("rare", "kam uchraydigan", "редкий"),
  W("valuable", "qimmatli", "ценный"), W("useless", "foydasiz", "бесполезный"),
  W("dangerous", "xavfli", "опасный"), W("safe", "xavfsiz", "безопасный"),
];

const IRREGULARS: Array<[string, string]> = [
  ["go", "went"], ["have", "had"], ["see", "saw"], ["take", "took"],
  ["make", "made"], ["come", "came"], ["get", "got"], ["give", "gave"],
  ["find", "found"], ["know", "knew"], ["think", "thought"], ["buy", "bought"],
  ["teach", "taught"], ["write", "wrote"], ["read", "read"], ["speak", "spoke"],
  ["eat", "ate"], ["drink", "drank"], ["run", "ran"], ["swim", "swam"],
  ["sit", "sat"], ["stand", "stood"], ["sleep", "slept"], ["feel", "felt"],
  ["keep", "kept"], ["meet", "met"], ["pay", "paid"], ["say", "said"],
  ["tell", "told"], ["begin", "began"], ["bring", "brought"], ["build", "built"],
  ["catch", "caught"], ["choose", "chose"], ["drive", "drove"], ["fall", "fell"],
  ["grow", "grew"], ["hold", "held"], ["leave", "left"], ["lose", "lost"],
  ["ride", "rode"], ["sell", "sold"], ["send", "sent"], ["sing", "sang"],
  ["spend", "spent"], ["win", "won"], ["understand", "understood"],
];

const PREPS: Array<{ q: string; a: string; d: string[] }> = [
  { q: "I am good ___ mathematics.", a: "at", d: ["in", "on", "for"] },
  { q: "She is afraid ___ dogs.", a: "of", d: ["from", "with", "at"] },
  { q: "We are interested ___ history.", a: "in", d: ["at", "on", "of"] },
  { q: "He is proud ___ his son.", a: "of", d: ["for", "with", "about"] },
  { q: "The cup is full ___ water.", a: "of", d: ["with", "by", "in"] },
  { q: "Listen ___ the teacher, please.", a: "to", d: ["at", "for", "with"] },
  { q: "Wait ___ me at the bus stop.", a: "for", d: ["to", "on", "with"] },
  { q: "This book belongs ___ my sister.", a: "to", d: ["with", "for", "of"] },
  { q: "They arrived ___ Tashkent yesterday.", a: "in", d: ["to", "at the", "from"] },
  { q: "I agree ___ you.", a: "with", d: ["to", "for", "of"] },
  { q: "She is married ___ a doctor.", a: "to", d: ["with", "for", "of"] },
  { q: "This photo is similar ___ that one.", a: "to", d: ["with", "of", "as"] },
  { q: "It is different ___ mine.", a: "from", d: ["of", "than", "with"] },
  { q: "Water consists ___ hydrogen and oxygen.", a: "of", d: ["from", "in", "with"] },
  { q: "Please pay ___ the tickets.", a: "for", d: ["of", "to", "on"] },
  { q: "Can you look ___ my cat this weekend?", a: "after", d: ["for", "at", "up"] },
  { q: "I am looking ___ my keys.", a: "for", d: ["after", "at", "up"] },
  { q: "He is fond ___ football.", a: "of", d: ["with", "for", "in"] },
  { q: "We are used ___ getting up early.", a: "to", d: ["for", "with", "of"] },
  { q: "She depends ___ her parents.", a: "on", d: ["from", "of", "at"] },
  { q: "Thank you ___ your help.", a: "for", d: ["of", "to", "with"] },
  { q: "The film is based ___ a true story.", a: "on", d: ["in", "at", "of"] },
  { q: "He is angry ___ his brother.", a: "with", d: ["on", "to", "for"] },
  { q: "I am tired ___ waiting.", a: "of", d: ["from", "with", "for"] },
];

const PLURALS: Array<[string, string]> = [
  ["child", "children"], ["man", "men"], ["woman", "women"], ["foot", "feet"],
  ["tooth", "teeth"], ["mouse", "mice"], ["goose", "geese"], ["person", "people"],
  ["box", "boxes"], ["city", "cities"], ["baby", "babies"], ["leaf", "leaves"],
  ["knife", "knives"], ["life", "lives"], ["wife", "wives"], ["wolf", "wolves"],
  ["shelf", "shelves"], ["bus", "buses"], ["dish", "dishes"], ["watch", "watches"],
  ["day", "days"], ["book", "books"], ["apple", "apples"], ["pen", "pens"],
];

const COMPARATIVES: Array<[string, string]> = [
  ["heavy", "heavier"], ["big", "bigger"], ["hot", "hotter"], ["thin", "thinner"],
  ["fast", "faster"], ["slow", "slower"], ["tall", "taller"], ["small", "smaller"],
  ["happy", "happier"], ["easy", "easier"], ["early", "earlier"], ["good", "better"],
  ["bad", "worse"], ["strong", "stronger"], ["cheap", "cheaper"], ["long", "longer"],
  ["short", "shorter"], ["warm", "warmer"], ["cold", "colder"], ["young", "younger"],
];

const VOWEL_NOUNS = ["apple", "orange", "egg", "umbrella", "elephant", "ice cream", "idea", "island"];
const CONS_NOUNS = ["book", "car", "house", "dog", "cat", "pen", "table", "window", "school", "city"];

const WQ_UZ_FWD = [
  (en: string) => `«${en}» so'zining o'zbekcha tarjimasi qaysi?`,
  (en: string) => `${en} so'zi o'zbekchada qanday aytiladi?`,
  (en: string) => `Berilgan so'zning ma'nosi: ${en} — qaysi javob to'g'ri?`,
];
const WQ_RU_FWD = [
  (en: string) => `Как переводится слово «${en}»?`,
  (en: string) => `Как сказать «${en}» по-узбекски?`,
  (en: string) => `Выберите перевод слова «${en}».`,
];
const WQ_EN_FWD = [
  (en: string) => `What does “${en}” mean?`,
  (en: string) => `What is the Uzbek translation of “${en}”?`,
  (en: string) => `Choose the meaning of “${en}”.`,
];
const WQ_UZ_REV = [
  (uz: string) => `«${uz}» so'zining inglizchasi qaysi?`,
  (uz: string) => `${uz} — inglizchada qanday yoziladi?`,
  (uz: string) => `${uz} so'zining inglizcha muqobilini tanlang.`,
];
const WQ_RU_REV = [
  (ru: string) => `Как будет «${ru}» по-английски?`,
  (ru: string) => `Выберите английский перевод слова «${ru}».`,
  (ru: string) => `Найдите английский эквивалент: ${ru}.`,
];
const WQ_EN_REV = [
  (uz: string) => `How do you say “${uz}” in English?`,
  (uz: string) => `What is the English word for “${uz}”?`,
  (uz: string) => `Choose the English equivalent of “${uz}”.`,
];

let WQ_IDX = 0;

function wordQ(rng: Rng, w: Word, reverse: boolean): QGen {
  const k = WQ_IDX % 3;
  if (!reverse) {
    const others = [...WORDS_A1, ...WORDS_A2, ...WORDS_B1, ...WORDS_B2]
      .filter((x) => x.uz !== w.uz && x.en !== w.en);
    const { o, correct } = optionsFor(
      rng,
      { uz: w.uz, ru: w.ru, en: w.uz },
      shuffle(rng, others).slice(0, 10).map((x) => ({ uz: x.uz, ru: x.ru, en: x.uz }))
    );
    return {
      t: { uz: WQ_UZ_FWD[k]!(w.en), ru: WQ_RU_FWD[k]!(w.en), en: WQ_EN_FWD[k]!(w.en) },
      o,
      correct,
    };
  }
  const others = [...WORDS_A1, ...WORDS_A2, ...WORDS_B1, ...WORDS_B2]
    .filter((x) => x.en !== w.en && x.uz !== w.uz);
  const { o, correct } = optionsFor(
    rng,
    { uz: w.en, ru: w.en, en: w.en },
    shuffle(rng, others).slice(0, 10).map((x) => ({ uz: x.en, ru: x.en, en: x.en }))
  );
  return {
    t: { uz: WQ_UZ_REV[k]!(w.uz), ru: WQ_RU_REV[k]!(w.ru), en: WQ_EN_REV[k]!(w.uz) },
    o,
    correct,
  };
}

function wordQ3(rng: Rng, en: string, uz: string, ru: string, reverse: boolean): QGen {
  const others = [...WORDS_A1, ...WORDS_A2].filter((x) => x.en !== en && x.uz !== uz);
  if (!reverse) {
    const { o, correct } = optionsFor(
      rng,
      { uz, ru, en: uz },
      shuffle(rng, others).slice(0, 10).map((x) => ({ uz: x.uz, ru: x.ru, en: x.uz }))
    );
    const k = Math.floor(rng() * 3);
    return {
      t: { uz: WQ_UZ_FWD[k]!(en), ru: WQ_RU_FWD[k]!(en), en: WQ_EN_FWD[k]!(en) },
      o,
      correct,
    };
  }
  const { o, correct } = optionsFor(
    rng,
    { uz: en, ru: en, en: en },
    shuffle(rng, others).slice(0, 10).map((x) => ({ uz: x.en, ru: x.en, en: x.en }))
  );
  const k = Math.floor(rng() * 3);
  return {
    t: { uz: WQ_UZ_REV[k]!(uz), ru: WQ_RU_REV[k]!(ru), en: WQ_EN_REV[k]!(uz) },
    o,
    correct,
  };
}

function blankQ(rng: Rng, sentence: string, answer: string, distr: string[], note?: L3): QGen {
  const FILLER = ["was", "were", "will", "did", "be", "been", "does", "done"];
  const pool = [...distr];
  for (const f of FILLER) {
    if (pool.length >= 3) break;
    if (f !== answer && !pool.includes(f)) pool.push(f);
  }
  const { o, correct } = optionsFor(
    rng,
    same(answer),
    pool.map((d) => same(d))
  );
  return {
    t: {
      uz: `Bo'sh joyni to'ldiring: “${sentence}”${note ? ` (${note.uz})` : ""}`,
      ru: `Заполните пропуск: “${sentence}”${note ? ` (${note.ru})` : ""}`,
      en: `Fill in the blank: “${sentence}”${note ? ` (${note.en})` : ""}`,
    },
    o,
    correct,
  };
}

function genEnglishBank(level: "a1" | "a2" | "b1" | "b2" | "ielts-e" | "ielts-m" | "ielts-h"): QGen[] {
  const rng = rngOf(`eng-${level}`);
  const out: QGen[] = [];
  const pool =
    level === "a1" ? WORDS_A1
      : level === "a2" ? WORDS_A2
      : level === "b1" ? WORDS_B1
      : level === "b2" ? WORDS_B2
      : WORDS_B2;
  const reps = level === "ielts-h" ? 6 : 4;
  for (let k = 0; k < reps; k++) {
    WQ_IDX = k;
    for (const w of pool) out.push(wordQ(rng, w, k % 2 === 1));
  }
  if (level === "a1" || level === "a2" || level === "ielts-e") {
    // Raqamlar, hafta kunlari, oylar, qarama-qarshi so'zlar
    const NUMS = [["one","bir","один"],["two","ikki","два"],["three","uch","три"],["four","to'rt","четыре"],["five","besh","пять"],["six","olti","шесть"],["seven","yetti","семь"],["eight","sakkiz","восемь"],["nine","to'qqiz","девять"],["ten","o'n","десять"]];
    const DAYS = [["Monday","dushanba","понедельник"],["Tuesday","seshanba","вторник"],["Wednesday","chorshanba","среда"],["Thursday","payshanba","четверг"],["Friday","juma","пятница"],["Saturday","shanba","суббота"],["Sunday","yakshanba","воскресенье"]];
    const MONTHS = [["January","yanvar","январь"],["February","fevral","февраль"],["March","mart","март"],["April","aprel","апрель"],["May","may","май"],["June","iyun","июнь"],["July","iyul","июль"],["August","avgust","август"],["September","sentabr","сентябрь"],["October","oktabr","октябрь"],["November","noyabr","ноябрь"],["December","dekabr","декабрь"]];
    for (let k = 0; k < 3; k++) {
      for (const [en, uz, ru] of NUMS) out.push(wordQ3(rng, en, uz, ru, k % 2 === 1));
      for (const [en, uz, ru] of DAYS) out.push(wordQ3(rng, en, uz, ru, k % 2 === 1));
      for (const [en, uz, ru] of MONTHS) out.push(wordQ3(rng, en, uz, ru, k % 2 === 1));
    }
    const OPPOSITES: Array<[string, string, string, string, string, string]> = [
      ["hot", "issiq", "горячий", "cold", "sovuq", "холодный"],
      ["big", "katta", "большой", "small", "kichik", "маленький"],
      ["day", "kun", "день", "night", "tun", "ночь"],
      ["good", "yaxshi", "хороший", "bad", "yomon", "плохой"],
      ["new", "yangi", "новый", "old", "eski", "старый"],
      ["long", "uzun", "длинный", "short", "qisqa", "короткий"],
      ["fast", "tez", "быстрый", "slow", "sekin", "медленный"],
      ["happy", "baxtli", "счастливый", "sad", "xafa", "грустный"],
      ["open", "ochmoq", "открывать", "close", "yopmoq", "закрывать"],
      ["buy", "sotib olmoq", "покупать", "sell", "sotmoq", "продавать"],
      ["black", "qora", "чёрный", "white", "oq", "белый"],
      ["rich", "boy", "богатый", "poor", "qashshoq", "бедный"],
    ];
    for (let k = 0; k < 2; k++) {
      for (const [e1, u1, r1, e2, u2, r2] of OPPOSITES) {
        const fwd = k % 2 === 0;
        const ans = fwd ? { uz: u2, ru: r2, en: u2 } : { uz: e2, ru: e2, en: e2 };
        const distr = fwd
          ? [{ uz: u1, ru: r1, en: u1 }, ...WORDS_A1.filter((x) => x.en !== e1 && x.en !== e2).slice(0, 8).map((x) => ({ uz: x.uz, ru: x.ru, en: x.uz }))]
          : [{ uz: e1, ru: e1, en: e1 }, ...WORDS_A1.filter((x) => x.en !== e1 && x.en !== e2).slice(0, 8).map((x) => ({ uz: x.en, ru: x.en, en: x.en }))];
        const { o, correct } = optionsFor(rng, ans, distr);
        out.push({
          t: fwd
            ? { uz: `«${e1}» so'zining qarama-qarshi ma'nosi (antonimi) qaysi?`, ru: `Какое слово противоположно по смыслу слову «${e1}»?`, en: `What is the opposite of “${e1}”?` }
            : { uz: `«${e1}» (${u1}) so'zining inglizcha antonimi qaysi?`, ru: `Какое английское слово противоположно слову «${r1}»?`, en: `What is the English opposite of “${u1}”?` },
          o,
          correct,
        });
      }
    }
    // a / an
    for (let k = 0; k < 3; k++) {
      for (const n of VOWEL_NOUNS) {
        out.push(blankQ(rng, `I have ___ ${n}.`, "an", ["a", "the", "—"], {
          uz: "unli harfdan oldin 'an'",
          ru: "перед гласной — 'an'",
          en: "'an' before a vowel sound",
        }));
      }
      for (const n of CONS_NOUNS) {
        out.push(blankQ(rng, `This is ___ ${n}.`, "a", ["an", "the", "—"], {
          uz: "undosh harfdan oldin 'a'",
          ru: "перед согласной — 'a'",
          en: "'a' before a consonant sound",
        }));
      }
    }
    // to be
    const BE: Array<[string, string]> = [
      ["I", "am"], ["he", "is"], ["she", "is"], ["it", "is"], ["we", "are"],
      ["you", "are"], ["they", "are"], ["My friend", "is"], ["The students", "are"], ["Her name", "is"],
    ];
    for (let k = 0; k < 3; k++) {
      for (const [subj, v] of BE) {
        out.push(blankQ(rng, `${subj} ___ a student.`, v, ["am", "is", "are", "be"].filter((x) => x !== v)));
      }
    }
  }
  if (level === "a2" || level === "b1" || level === "b2" || level.startsWith("ielts")) {
    // Present Simple 3-shaxs
    const P3: Array<[string, string]> = [
      ["play", "plays"], ["watch", "watches"], ["read", "reads"], ["write", "writes"],
      ["walk", "walks"], ["work", "works"], ["study", "studies"], ["go", "goes"],
      ["do", "does"], ["have", "has"], ["finish", "finishes"], ["wash", "washes"],
      ["fly", "flies"], ["cry", "cries"], ["try", "tries"], ["carry", "carries"],
      ["teach", "teaches"], ["fix", "fixes"], ["miss", "misses"], ["like", "likes"],
    ];
    for (let k = 0; k < 2; k++) {
      for (const [v, v3] of P3) {
        out.push(blankQ(rng, `He ___ (to ${v}) football every day.`, v3, [v, `${v}s`, `${v}ing`].filter((x) => x !== v3)));
      }
    }
    // Past Simple (noto'g'li fe'llar)
    for (let k = 0; k < 2; k++) {
      for (const [v, past] of IRREGULARS) {
        const ds = past === v ? ["readed", "was read", "readed up"] : [`${v}ed`, v, `${v}ing`].filter((x) => x !== past);
        out.push(blankQ(rng, `Yesterday I ___ (to ${v}) a book.`, past, ds));
      }
    }
    // Predloglar
    for (let k = 0; k < 2; k++) {
      for (const p of PREPS) {
        out.push(blankQ(rng, p.q, p.a, p.d));
      }
    }
    // Ko'plik
    for (let k = 0; k < 2; k++) {
      for (const [one, many] of PLURALS) {
        const distr = PLURALS.filter((x) => x[1] !== many).map((x) => x[1]);
        const { o, correct } = optionsFor(rng, same(many), distr.map((d) => same(d)));
        out.push({
          t: {
            uz: `To'plik shakli: “one ${one}, two ___”`,
            ru: `Форма множественного числа: “one ${one}, two ___”`,
            en: `Plural form: “one ${one}, two ___”`,
          },
          o,
          correct,
        });
      }
    }
  }
  if (level === "b1" || level === "b2" || level === "ielts-m" || level === "ielts-h") {
    // Qiyosiy daraja
    for (let k = 0; k < 2; k++) {
      for (const [adj, comp] of COMPARATIVES) {
        out.push(blankQ(rng, `This box is ___ (${adj}) than that one.`, comp, [`${adj}er`, `more ${adj}`, `${adj}est`].filter((x) => x !== comp)));
      }
    }
  }
  return dedupe(out);
}

/* ================= LISTENING ================= */

const HOUR_WORDS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
const MIN_WORDS: Array<[string, string]> = [["", "o'clock"], ["fifteen", "15"], ["thirty", "30"], ["forty-five", "45"]];

function timeAudio(h: number, mi: number): string {
  const hw = HOUR_WORDS[h - 1] as string;
  const [mw] = MIN_WORDS[mi] as [string, string];
  const part = mi === 0 ? `${hw} o'clock` : `${hw} ${mw}`;
  return `It is ${part} now.`;
}

function genListeningBank(dif: string): QGen[] {
  const rng = rngOf(`listen-${dif}`);
  const out: QGen[] = [];
  // Vaqt
  for (let i = 0; i < 130; i++) {
    const h = rangeInt(rng, 1, 12);
    const mi = rangeInt(rng, 0, 3);
    const label = mi === 0 ? `${h}:00` : `${h}:${(MIN_WORDS[mi] as [string, string])[1]}`;
    const { o, correct } = optionsFor(
      rng,
      same(label),
      MIN_WORDS.filter((_, j) => j !== mi).map(([, v]) => same(`${h}:${v}`))
    );
    out.push({
      t: {
        uz: "Audioni tinglang: qanday vaqt aytilgan?",
        ru: "Прослушайте аудио: которое время названо?",
        en: "Listen to the audio: what time is mentioned?",
      },
      o,
      correct,
      audio: timeAudio(h, mi),
    });
  }
  // Joy
  const PLACES: Array<[string, L3, L3[]]> = [
    ["hospital", { uz: "Kasalxonada", ru: "В больнице", en: "In a hospital" }, [
      { uz: "Maktabda", ru: "В школе", en: "In a school" },
      { uz: "Bankda", ru: "В банке", en: "In a bank" },
      { uz: "Uyda", ru: "Дома", en: "At home" },
    ]],
    ["school", { uz: "Maktabda", ru: "В школе", en: "In a school" }, [
      { uz: "Kasalxonada", ru: "В больнице", en: "In a hospital" },
      { uz: "Do'konda", ru: "В магазине", en: "In a shop" },
      { uz: "Uyda", ru: "Дома", en: "At home" },
    ]],
    ["bank", { uz: "Bankda", ru: "В банке", en: "In a bank" }, [
      { uz: "Maktabda", ru: "В школе", en: "In a school" },
      { uz: "Kasalxonada", ru: "В больнице", en: "In a hospital" },
      { uz: "Bozorda", ru: "На рынке", en: "At the market" },
    ]],
    ["shop", { uz: "Do'konda", ru: "В магазине", en: "In a shop" }, [
      { uz: "Bankda", ru: "В банке", en: "In a bank" },
      { uz: "Uyda", ru: "Дома", en: "At home" },
      { uz: "Maktabda", ru: "В школе", en: "In a school" },
    ]],
  ];
  const JOBS: Array<[string, L3]> = [
    ["a doctor", { uz: "Shifokor", ru: "Врач", en: "A doctor" }],
    ["a teacher", { uz: "O'qituvchi", ru: "Учитель", en: "A teacher" }],
    ["a driver", { uz: "Haydovchi", ru: "Водитель", en: "A driver" }],
    ["a worker", { uz: "Ishchi", ru: "Рабочий", en: "A worker" }],
  ];
  for (let i = 0; i < 96; i++) {
    const [place, ans, distr] = PLACES[i % PLACES.length] as [string, L3, L3[]];
    const name = ["Anna", "my brother", "my sister", "Tom", "Mr. Brown", "my uncle", "Lola", "my friend"][(i >> 2) % 8] as string;
    const { o, correct } = optionsFor(rng, ans, distr);
    out.push({
      t: {
        uz: "Audioni tinglang: (shaxs) qayerda ishlaydi?",
        ru: "Прослушайте аудио: где работает этот человек?",
        en: "Listen to the audio: where does this person work?",
      },
      o,
      correct,
      audio: `${name.charAt(0).toUpperCase() + name.slice(1)} works in a ${place} near the city center.`,
    });
  }
  for (let i = 0; i < 96; i++) {
    const [job, ans] = JOBS[i % JOBS.length] as [string, L3];
    const distr = JOBS.filter((x) => x[0] !== job).map((x) => x[1]);
    const { o, correct } = optionsFor(rng, ans, distr);
    const name = ["Anna", "Mr. Smith", "Mrs. Brown", "My uncle", "Tom", "My aunt", "Mr. Lee", "Aziza"][(i >> 2) % 8] as string;
    out.push({
      t: {
        uz: "Audioni tinglang: (shaxs)ning kasbi nima?",
        ru: "Прослушайте аудио: какая у этого человека профессия?",
        en: "Listen to the audio: what is this person's job?",
      },
      o,
      correct,
      audio: `${name} is ${job} and works five days a week.`,
    });
  }
  // Raqamlar
  const NUMW = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  for (let i = 0; i < 90; i++) {
    const n = rangeInt(rng, 2, 9);
    const m = rangeInt(rng, 1, 6);
    const { o, correct } = optionsFor(
      rng,
      same(String(n)),
      [n - 1, n + 1, n + 2].filter((v) => v > 0).map((v) => same(String(v)))
    );
    out.push({
      t: {
        uz: "Audioni tinglang: nechta aka-uka (aka/uka) aytilgan?",
        ru: "Прослушайте аудио: сколько братьев названо?",
        en: "Listen to the audio: how many brothers are mentioned?",
      },
      o,
      correct,
      audio: `I have ${NUMW[n - 1]} brothers and ${NUMW[m - 1]} sister${m > 1 ? "s" : ""}.`,
    });
  }
  // Ranglar va narsalar (barcha darajalar)
  const COLORS: Array<[string, L3]> = [
    ["red", { uz: "Qizil", ru: "Красный", en: "Red" }],
    ["blue", { uz: "Ko'k", ru: "Синий", en: "Blue" }],
    ["green", { uz: "Yashil", ru: "Зелёный", en: "Green" }],
    ["black", { uz: "Qora", ru: "Чёрный", en: "Black" }],
    ["white", { uz: "Oq", ru: "Белый", en: "White" }],
    ["yellow", { uz: "Sariq", ru: "Жёлтый", en: "Yellow" }],
  ];
  const THINGS = ["car", "bag", "shirt", "book", "bike", "door"];
  const ADJS = ["new", "old", "big", "small"];
  for (let i = 0; i < 96; i++) {
    const [cw, ans] = COLORS[i % COLORS.length] as [string, L3];
    const thing = THINGS[(i >> 2) % THINGS.length] as string;
    const adj = ADJS[i % ADJS.length] as string;
    const distr = COLORS.filter((x) => x[0] !== cw).map((x) => x[1]);
    const { o, correct } = optionsFor(rng, ans, distr);
    out.push({
      t: {
        uz: "Audioni tinglang: narsaning rangi qanday?",
        ru: "Прослушайте аудио: какого цвета предмет?",
        en: "Listen to the audio: what colour is the item?",
      },
      o,
      correct,
      audio: `My ${adj} ${thing} is ${cw}, and I like it very much.`,
    });
  }
  // Xarid: nima oldi, qancha to'ladi
  const ITEMS: Array<[string, L3]> = [
    ["apples", { uz: "Olma", ru: "Яблоки", en: "Apples" }],
    ["bread", { uz: "Non", ru: "Хлеб", en: "Bread" }],
    ["milk", { uz: "Sut", ru: "Молоко", en: "Milk" }],
    ["eggs", { uz: "Tuxum", ru: "Яйца", en: "Eggs" }],
    ["cheese", { uz: "Pishloq", ru: "Сыр", en: "Cheese" }],
    ["oranges", { uz: "Apelsin", ru: "Апельсины", en: "Oranges" }],
    ["tea", { uz: "Choy", ru: "Чай", en: "Tea" }],
    ["rice", { uz: "Guruch", ru: "Рис", en: "Rice" }],
  ];
  for (let i = 0; i < 64; i++) {
    const [item, ans] = ITEMS[i % ITEMS.length] as [string, L3];
    const who = ["I", "She", "He", "My mother", "My father", "We", "They", "My sister"][(i >> 2) % 8] as string;
    const distr = ITEMS.filter((x) => x[0] !== item).map((x) => x[1]);
    const { o, correct } = optionsFor(rng, ans, distr);
    out.push({
      t: {
        uz: "Audioni tinglang: nima sotib olindi?",
        ru: "Прослушайте аудио: что купили?",
        en: "Listen to the audio: what was bought?",
      },
      o,
      correct,
      audio: `${who === "I" ? "At the market I" : who === "We" ? "At the market we" : `${who} at the market`} bought two kilos of ${item} for breakfast.`,
    });
  }
  // Maktab: qaysi fan
  const SUBJECTS: Array<[string, L3]> = [
    ["mathematics", { uz: "Matematika", ru: "Математика", en: "Mathematics" }],
    ["history", { uz: "Tarix", ru: "История", en: "History" }],
    ["biology", { uz: "Biologiya", ru: "Биология", en: "Biology" }],
    ["geography", { uz: "Geografiya", ru: "География", en: "Geography" }],
    ["English", { uz: "Ingliz tili", ru: "Английский язык", en: "English" }],
    ["physics", { uz: "Fizika", ru: "Физика", en: "Physics" }],
  ];
  for (let i = 0; i < 48; i++) {
    const [sub, ans] = SUBJECTS[i % SUBJECTS.length] as [string, L3];
    const distr = SUBJECTS.filter((x) => x[0] !== sub).map((x) => x[1]);
    const { o, correct } = optionsFor(rng, ans, distr);
    const day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][i % 5] as string;
    out.push({
      t: {
        uz: "Audioni tinglang: qaysi fan darsi bor?",
        ru: "Прослушайте аудио: какой предмет будет на уроке?",
        en: "Listen to the audio: which subject is mentioned?",
      },
      o,
      correct,
      audio: `On ${day} the first lesson is ${sub}, and the second one is chemistry in the laboratory.`,
    });
  }
  // Yo'nalish
  const DIRS: Array<[string, L3]> = [
    ["turn left", { uz: "Chapga buriling", ru: "Поверните налево", en: "Turn left" }],
    ["turn right", { uz: "O'ngga buriling", ru: "Поверните направо", en: "Turn right" }],
    ["go straight", { uz: "To'g'ri yuring", ru: "Идите прямо", en: "Go straight" }],
    ["go back", { uz: "Orqaga qayting", ru: "Вернитесь назад", en: "Go back" }],
  ];
  const LANDMARKS = ["the bank", "the school", "the park", "the shop", "the cinema", "the library"];
  for (let i = 0; i < 64; i++) {
    const [d, ans] = DIRS[i % DIRS.length] as [string, L3];
    const lm = LANDMARKS[(i >> 2) % LANDMARKS.length] as string;
    const distr = DIRS.filter((x) => x[0] !== d).map((x) => x[1]);
    const { o, correct } = optionsFor(rng, ans, distr);
    out.push({
      t: {
        uz: "Audioni tinglang: yo'l ko'rsatma bo'yicha nima qilish kerak?",
        ru: "Прослушайте аудио: что нужно сделать по инструкции?",
        en: "Listen to the audio: what should you do according to the instruction?",
      },
      o,
      correct,
      audio: `Excuse me, when you reach ${lm}, please ${d} and you will see the post office.`,
    });
  }
  // Oilaviy holat
  const FAMS: Array<[string, L3]> = [
    ["an engineer", { uz: "Muhandis", ru: "Инженер", en: "An engineer" }],
    ["a nurse", { uz: "Hamshira", ru: "Медсестра", en: "A nurse" }],
    ["a farmer", { uz: "Dehqon", ru: "Фермер", en: "A farmer" }],
    ["a lawyer", { uz: "Yurist", ru: "Юрист", en: "A lawyer" }],
  ];
  for (let i = 0; i < 64; i++) {
    const [j, ans] = FAMS[i % FAMS.length] as [string, L3];
    const who = ["my father", "my mother", "my elder brother", "my aunt", "my grandfather", "my cousin", "my uncle", "my sister"][(i >> 2) % 8] as string;
    const distr = FAMS.filter((x) => x[0] !== j).map((x) => x[1]);
    const { o, correct } = optionsFor(rng, ans, distr);
    out.push({
      t: {
        uz: "Audioni tinglang: (shaxs)ning kasbi nima?",
        ru: "Прослушайте аудио: какая профессия у этого человека?",
        en: "Listen to the audio: what is this person's job?",
      },
      o,
      correct,
      audio: `${who.charAt(0).toUpperCase() + who.slice(1)} is ${j}, and ${who.startsWith("my") ? "he" : "she"} works six days a week.`,
    });
  }
  if (dif !== "easy") {
    // Ob-havo
    const WEATHERS: Array<[string, L3]> = [
      ["raining", { uz: "Yomg'ir yog'lyapti", ru: "Идёт дождь", en: "It is raining" }],
      ["snowing", { uz: "Qor yog'lyapti", ru: "Идёт снег", en: "It is snowing" }],
      ["sunny", { uz: "Quyoshli", ru: "Солнечно", en: "It is sunny" }],
      ["cloudy", { uz: "Bulutli", ru: "Облачно", en: "It is cloudy" }],
    ];
    const CITIES = ["London", "Tashkent", "Moscow", "Paris", "New York"];
    for (let i = 0; i < 60; i++) {
      const [w, ans] = WEATHERS[i % WEATHERS.length] as [string, L3];
      const city = CITIES[(i >> 2) % CITIES.length] as string;
      const distr = WEATHERS.filter((x) => x[0] !== w).map((x) => x[1]);
      const { o, correct } = optionsFor(rng, ans, distr);
      out.push({
        t: {
          uz: "Audioni tinglang: ob-havo qanday?",
          ru: "Прослушайте аудио: какая погода?",
          en: "Listen to the audio: what is the weather like?",
        },
        o,
        correct,
        audio: `Today in ${city} it is ${w}, so take an umbrella if you go out.`,
      });
    }
    // Narxlar
    for (let i = 0; i < 64; i++) {
      const price = rangeInt(rng, 2, 12) * 1000;
      const { o, correct } = optionsFor(
        rng,
        same(`${price.toLocaleString("en-US")} soums`),
        [price + 1000, price - 1000, price + 2000].map((v) => same(`${v.toLocaleString("en-US")} soums`))
      );
      out.push({
        t: {
          uz: "Audioni tinglang: kichik choy qancha turadi?",
          ru: "Прослушайте аудио: сколько стоит маленький чай?",
          en: "Listen to the audio: how much does a small tea cost?",
        },
        o,
        correct,
        audio: `A large cup of tea costs ${price + 2000} soums and a small cup costs ${price} soums.`,
      });
    }
    // Ikkita fakt
    for (let i = 0; i < 64; i++) {
      const h = rangeInt(rng, 1, 8);
      const h2 = h + rangeInt(rng, 2, 4);
      const { o, correct } = optionsFor(
        rng,
        same(`${h2 - h} hours`),
        ["1 hour", "2 hours", "4 hours", "5 hours"].map((v) => same(v))
      );
      out.push({
        t: {
          uz: "Audioni tinglang: muzey necha soat ishlaydi?",
          ru: "Прослушайте аудио: сколько часов работает музей?",
          en: "Listen to the audio: how many hours is the museum open?",
        },
        o,
        correct,
        audio: `The museum opens at ${HOUR_WORDS[h - 1]} o'clock in the morning and closes at ${HOUR_WORDS[h2 - 1]} o'clock in the evening.`,
      });
    }
  }
  return dedupe(out, true);
}

/* ================= EXPORTS ================= */

export type EngBank = "a1" | "a2" | "b1" | "b2" | "ielts-e" | "ielts-m" | "ielts-h";

export function genIngliz(level: EngBank): QGen[] {
  return genEnglishBank(level);
}

export function genListening(dif: string): QGen[] {
  return genListeningBank(dif);
}

void shuffle;
