/**
 * Randap test kontenti — 2-qism (kengaytirilgan seed).
 * Yangi fanlar: Matematika, Fizika, Kimyo, Geografiya, Ona tili, Adabiyot —
 * har biri oson / o'rtacha / qiyin darajalarda + o'rgatuv darslari.
 * Bundan tashqari mavjud tarix va ingliz testlariga QO'SHIMCHA savollar
 * (EXTRA_QUESTIONS) — har testda katta savol bazasi, har kirganda
 * tasodifiy 10 tasi tanlanadi.
 * Barcha IDlar barqaror — bir necha marta seed qilinsa ham ikki nusxa hosil bo'lmaydi.
 */

export const DIF2 = {
  easy: "easy",
  middle: "middle",
  hard: "hard",
  "very-hard": "very-hard",
} as const;
export type Dif2 = keyof typeof DIF2;

export type Q2 = { text: string; options: string[]; correct: number; audio?: string };
export type QuizDef2 = {
  id: string;
  title: string;
  description: string;
  difficulty: Dif2;
  grade?: number;
  kind?: "quiz" | "listening";
  questions: Q2[];
};
export type LessonDef2 = {
  id: string;
  title: string;
  summary: string;
  content: string;
  durationMin: number;
};
export type SubjectDef2 = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  quizzes: QuizDef2[];
  lessons: LessonDef2[];
};

/* ================= MATEMATIKA ================= */

const MATEMATIKA: SubjectDef2 = {
  slug: "matematika",
  name: "Matematika",
  description:
    "Arifmetika, algebra va geometriya — oson, o'rtacha va qiyin darajalarda. Har safar tasodifiy savollar.",
  icon: "calculator",
  color: "sky",
  order: 6,
  lessons: [
    {
      id: "lesson-mate-1",
      title: "Foizlar bilan tez ishlash",
      summary: "Foizni kasr va o'nli kasrga aylantirib, og'iz bo'i hisoblash sirlari.",
      durationMin: 7,
      content:
        "Foiz — butunning yuzdan bir qismi. 100% — butun narsa, 50% — yarmi, 25% — choragi, 10% — o'ndan bir qismi.\n\nTez hisoblash usullari: 10% topish uchun sonni o'ngdan bitta raqamga surish kifoya (450 ning 10% i = 45). 50% — sonni 2 ga bo'lish (450 ning 50% i = 225). 25% — 2 marta 2 ga bo'lish: 450 : 2 = 225, 225 : 2 ≈ 112,5.\n\nMashhur masala: narsa narxi 12 000 so'm, chegirma 25%. Chegirma qancha? 12 000 ning 25% i = 12 000 : 4 = 3 000 so'm. To'lash kerak: 12 000 − 3 000 = 9 000 so'm.\n\nTestda foiz masalalari doim shu tartibda yechiladi: avval 1% ni top (sonni 100 ga bo'l), so'ng kerakli foizni ko'paytir. Yoki yuqoridagi tez usullarni ishlatib, vaqtni tejash mumkin.",
    },
    {
      id: "lesson-mate-2",
      title: "Tenglamalarni 3 qadamda yechish",
      summary: "Ixchamlash, ko'chirish, bo'lish — har qanday oddiy tenglamaning yechim algoritmi.",
      durationMin: 8,
      content:
        "Tenglama — ichida noma'lum son (x) bor tenglik. Masalan: 3x + 5 = 20.\n\n1-qadam: ixchamlash — qavslarni och, o'xshash xadlarni birlashtir. Agar tenglama allaqachon ixcham bo'lsa, bu qadam o'tib ketadi.\n\n2-qadam: raqamlarni tenglikning boshqa tomoniga ko'chirish. Ko'chirilganda belgi o'zgaradi: +5 o'ng tomonga −5 bo'lib o'tadi. 3x = 20 − 5 = 15.\n\n3-qadam: x ning koeffitsiyentiga bo'lish. x = 15 : 3 = 5.\n\nTekshirish majburiy qadam: 3×5 + 5 = 20 — tenglik to'g'ri, demak yechim to'g'ri. Kvadrat tenglamalar (ax² + bx + c = 0) diskriminant D = b² − 4ac yordamida yechiladi: D > 0 bo'lsa 2 ta ildiz, D = 0 bo'lsa 1 ta ildiz bor.",
    },
  ],
  quizzes: [
    {
      id: "quiz_mate_easy",
      title: "Matematika — oson",
      description: "Arifmetika, foizlar, oddiy geometriya — boshlang'ich daraja.",
      difficulty: "easy",
      questions: [
        { text: "24 + 18 = ?", options: ["32", "42", "52", "44"], correct: 1 },
        { text: "7 × 8 = ?", options: ["54", "56", "58", "64"], correct: 1 },
        { text: "144 : 12 = ?", options: ["11", "12", "13", "14"], correct: 1 },
        { text: "200 ning 25% i qancha?", options: ["40", "45", "50", "60"], correct: 2 },
        { text: "Tomoni 6 sm bo'lgan kvadratning perimetri qancha?", options: ["12 sm", "18 sm", "24 sm", "36 sm"], correct: 2 },
        { text: "Tomonlari 8 sm va 5 sm bo'lgan to'g'ri to'rtburchakning yuzasi qancha?", options: ["26 sm²", "40 sm²", "45 sm²", "13 sm²"], correct: 1 },
        { text: "1000 − 647 = ?", options: ["353", "363", "343", "453"], correct: 0 },
        { text: "3/4 kasr foizda nechchi?", options: ["34%", "50%", "75%", "80%"], correct: 2 },
        { text: "15 sonini 3 ga bo'lsak nechchi chiqadi?", options: ["4", "5", "6", "7"], correct: 1 },
        { text: "2³ nechchi teng?", options: ["6", "8", "9", "5"], correct: 1 },
        { text: "Ketma-ket juft sonlar: 2, 4, 6, 8, ... Keyingi son qaysi?", options: ["9", "10", "12", "11"], correct: 1 },
        { text: "1 soat necha daqiqa?", options: ["30", "45", "60", "100"], correct: 2 },
        { text: "Uchburchak ichki burchaklari yig'indisi nechchi daraja?", options: ["90°", "180°", "270°", "360°"], correct: 1 },
        { text: "0,5 kasr ko'rinishda qanday yoziladi?", options: ["1/3", "1/2", "2/3", "1/5"], correct: 1 },
        { text: "45 + 55 = ?", options: ["80", "90", "100", "110"], correct: 2 },
        { text: "12 × 5 = ?", options: ["50", "55", "60", "65"], correct: 2 },
        { text: "Bir qutida 24 ta qalam bor. 6 ta shunday qutida jami nechta qalam bor?", options: ["124", "144", "148", "168"], correct: 1 },
        { text: "To'g'ri burchak nechchi daraja?", options: ["45°", "60°", "90°", "180°"], correct: 2 },
      ],
    },
    {
      id: "quiz_mate_middle",
      title: "Matematika — o'rtacha",
      description: "Tenglamalar, Pifagor teoremasi, foiz masalalari, progressiyalar.",
      difficulty: "middle",
      questions: [
        { text: "x + 17 = 42 tenglamada x nechchi?", options: ["15", "25", "29", "35"], correct: 1 },
        { text: "5x = 95 tenglamada x nechchi?", options: ["17", "19", "21", "23"], correct: 1 },
        { text: "x² − 5x + 6 = 0 tenglamaning ildizlari qaysi?", options: ["1 va 6", "2 va 3", "−2 va −3", "4 va 1"], correct: 1 },
        { text: "Arifmetik progressiyada a₁ = 3, d = 4. a₅ nechchi?", options: ["15", "19", "23", "27"], correct: 1 },
        { text: "To'g'ri burchakli uchburchakning katetlari 6 va 8. Gipotenuza nechchi?", options: ["9", "10", "12", "14"], correct: 1 },
        { text: "Doira radiusi 5. Doira yuzasi qanday ifodalanadi?", options: ["5π", "10π", "25π", "50π"], correct: 2 },
        { text: "20 ning 30% i nechchi?", options: ["5", "6", "7", "8"], correct: 1 },
        { text: "y = 2x + 3 funksiyada x = 5 bo'lsa, y nechchi?", options: ["10", "13", "15", "18"], correct: 1 },
        { text: "4, 8 va 12 sonlarining arifmetik o'rtachasi nechchi?", options: ["6", "8", "10", "12"], correct: 1 },
        { text: "sin 30° nechchi?", options: ["1/2", "1", "√2/2", "√3/2"], correct: 0 },
        { text: "2, 6, 18, 54 ... geometrik progressiyaning maxrajbi nechchi?", options: ["2", "3", "4", "6"], correct: 1 },
        { text: "Asosi 10, balandligi 6 bo'lgan uchburchakning yuzasi nechchi?", options: ["16", "30", "60", "36"], correct: 1 },
        { text: "400 ning 15% i nechchi?", options: ["45", "55", "60", "65"], correct: 2 },
        { text: "1 dan 20 gacha bo'lgan natural sonlar yig'indisi nechchi?", options: ["190", "200", "210", "220"], correct: 2 },
        { text: "Qirrasi 4 sm bo'lgan kubning hajmi nechchi?", options: ["16 sm³", "48 sm³", "64 sm³", "81 sm³"], correct: 2 },
        { text: "2x − 7 = 11 tenglamada x nechchi?", options: ["7", "9", "11", "13"], correct: 1 },
        { text: "Doira aylanasi uzunligi formulasi qaysi?", options: ["C = πr²", "C = 2πr", "C = πd²", "C = r²"], correct: 1 },
        { text: "Uch xil rangli sharlar orasidan tasodifiy bittasi olinmoqda. Har qanday shar olinish ehtimoli qanday?", options: ["1/2", "1/3", "1/4", "1/6"], correct: 1 },
      ],
    },
    {
      id: "quiz_mate_hard",
      title: "Matematika — qiyin",
      description: "Logarifmlar, trigonometriya, murakkab algebra va ehtimol nazariyasi.",
      difficulty: "hard",
      questions: [
        { text: "log₂ 32 nechchi?", options: ["4", "5", "6", "8"], correct: 1 },
        { text: "cos 60° nechchi?", options: ["1/2", "1", "√3/2", "√2/2"], correct: 0 },
        { text: "x² − 9 = 0 tenglamaning ildizlari qaysi?", options: ["3", "−3", "±3", "9"], correct: 2 },
        { text: "2⁵ nechchi?", options: ["16", "24", "32", "64"], correct: 2 },
        { text: "Kvadratning yuzasi 49 sm². Perimetri nechchi?", options: ["14 sm", "21 sm", "28 sm", "49 sm"], correct: 2 },
        { text: "Aylana radiusi 7. Aylana uzunligi qanday ifodalanadi?", options: ["7π", "14π", "49π", "21π"], correct: 1 },
        { text: "√144 nechchi?", options: ["10", "11", "12", "14"], correct: 2 },
        { text: "8 sonining kubi nechchi?", options: ["64", "256", "512", "1024"], correct: 2 },
        { text: "Sinuslar teoremasiga ko'ra a/sin A nimaga teng?", options: ["r", "2R", "R", "2r"], correct: 1 },
        { text: "e (Eyler soni) taxminan nechchi?", options: ["2,14", "2,71", "3,14", "3,71"], correct: 1 },
        { text: "(a + b)² formulasi qaysi to'g'ri?", options: ["a² + b²", "a² + ab + b²", "a² + 2ab + b²", "a² − 2ab + b²"], correct: 2 },
        { text: "tan 45° nechchi?", options: ["0", "1/2", "1", "√3"], correct: 2 },
        { text: "1 dan 100 gacha bo'lgan sonlar yig'indisi nechchi?", options: ["5000", "5050", "5100", "5500"], correct: 1 },
        { text: "Hakulana tanga 2 marta tashlandi. Ikkala marta ham 'qirrasi' tushish ehtimoli qancha?", options: ["1/2", "1/3", "1/4", "1/8"], correct: 2 },
        { text: "log₁₀ 100 nechchi?", options: ["1", "2", "10", "100"], correct: 1 },
        { text: "3 + 3 × 3 − 3 nechchi?", options: ["9", "12", "6", "3"], correct: 0 },
        { text: "√2 taxminan nechchi?", options: ["1,41", "1,51", "1,71", "2,41"], correct: 0 },
        { text: "Kvadrat tenglama qanday ko'rinishda bo'ladi?", options: ["ax + b = 0", "ax² + bx + c = 0", "ax³ + b = 0", "a/x = b"], correct: 1 },
      ],
    },
  ],
};

/* ================= FIZIKA ================= */

const FIZIKA: SubjectDef2 = {
  slug: "fizika",
  name: "Fizika",
  description:
    "Mexanika, issiqlik, elektr va optika — oson, o'rtacha va qiyin darajalarda testlar.",
  icon: "atom",
  color: "violet",
  order: 7,
  lessons: [
    {
      id: "lesson-fiz-1",
      title: "Nyuton qonunlari hayotda",
      summary: "Uchta asosiy qonunni oddiy misollar bilan tushunish.",
      durationMin: 8,
      content:
        "1-qonun (inersiya qonuni): jismga boshqa jismlar ta'sir qilmasa, u tinch holatda yoki to'g'ri chiziqli tekis harakatda qoladi. Avtobus birdan jo'naganda tanamiz orqaga qarama-qarshi 'qolishga' urinadi — bu inersiya.\n\n2-qonun: kuch jismni tezlashtiradi: F = m·a. Massa qancha katta bo'lsa, xuddi shu kuch uchun tezlanish shuncha kichik. Mashinani yolg'iz surishdan ko'ra yuklangan mashinani surish qiyinroq — shundan.\n\n3-qonun: harakat va qarshilik kuchlari teng, yo'nalishlari qarama-qarshi. Suv ustidagi qayiqdan qirg'oqqa sakrasangiz, qayiq orqaga suzib ketadi. Raketa pastga gaz oqizib, yuqoriga uchadi.\n\nOg'irlik — Yer jismlarni tortadigan kuch: P = m·g, bu yerda g ≈ 9,8 N/kg. 5 kg li gipso: P = 5 × 9,8 = 49 N.",
    },
    {
      id: "lesson-fiz-2",
      title: "Elektr zanjiri asoslari",
      summary: "Tok, kuchlanish, qarshilik va Om qonuni — oddiy misollar bilan.",
      durationMin: 9,
      content:
        "Elektr toki — zaryadlar tartibli harakati. Tok kuchi amper (A) bilan o'lchanadi, kuchlanish volt (V) bilan, qarshilik om (Ω) bilan.\n\nOm qonuni: I = U/R. Tok kuchi kuchlanishga to'g'ri, qarshilikka teskari proporsional. Masalan: 12 V lampochka 4 Ω qarshilikda: I = 12 : 4 = 3 A.\n\nKetma-ket ulash: rezistorlar bir ketin ulanadi, R = R₁ + R₂. Paralel ulash: 1/R = 1/R₁ + 1/R₂. Uyda barcha asboblar paralel ulanadi — shuning uchun bittasi o'chsa, qolganlari ishlayveradi.\n\nQuvvat: P = U·I (vat). 220 V va 2 A bilan ishlaydigan choynak quvvati: P = 220 × 2 = 440 Vt. Elektr hisoblagichi aynan shu quvvat va vaqt ko'paytmasini (kVt·soat) hisoblaydi.",
    },
  ],
  quizzes: [
    {
      id: "quiz_fiz_easy",
      title: "Fizika — oson",
      description: "Birliklar, oddiy hodisalar va asosiy tushunchalar.",
      difficulty: "easy",
      questions: [
        { text: "Tezlik qanday birlikda o'lchanadi?", options: ["kg", "m/s", "N", "J"], correct: 1 },
        { text: "Normal bosimda suv qaysi haroratda qaynaydi?", options: ["0°C", "50°C", "100°C", "200°C"], correct: 2 },
        { text: "Suv qaysi haroratda muzlaydi?", options: ["0°C", "10°C", "100°C", "−50°C"], correct: 0 },
        { text: "Haroratni qaysi asbob bilan o'lchaydilar?", options: ["Barometr", "Termometr", "Ampermetr", "Speedometr"], correct: 1 },
        { text: "Yorug'likning tezligi taxminan qancha?", options: ["300 km/s", "3 000 km/s", "300 000 km/s", "3 km/s"], correct: 2 },
        { text: "Jismlarni Yerga tortadigan kuch qanday nomlanadi?", options: ["Magnit kuch", "Og'irlik kuchi", "Ishqalanish kuchi", "Zarracha kuchi"], correct: 1 },
        { text: "Massa qanday birlikda o'lchanadi?", options: ["kilogramm", "metr", "sekund", "volt"], correct: 0 },
        { text: "Elektr tokini qaysi asbob bilan o'lchaydilar?", options: ["Ampermetr", "Termometr", "Barometr", "Voltmetr"], correct: 0 },
        { text: "Magnit qaysi moddani tortadi?", options: ["Temir", "Yog'och", "Shisha", "Plastmassa"], correct: 0 },
        { text: "Qaysi holatdagi modda shaklini va hajmini saqlaydi?", options: ["Qattiq", "Suyuq", "Gaz", "Plazma"], correct: 0 },
        { text: "1 km necha metr?", options: ["10", "100", "1000", "10 000"], correct: 2 },
        { text: "Og'irlik kuchi qanday birlikda o'lchanadi?", options: ["nyuton (N)", "kilogramm", "vat", "joul"], correct: 0 },
        { text: "Suvning zichligi qancha?", options: ["100 kg/m³", "500 kg/m³", "1000 kg/m³", "10 000 kg/m³"], correct: 2 },
        { text: "Ovoz qanday muhitda tarqalmaydi?", options: ["Havoda", "Suvda", "Bo'shliqda (vakuumda)", "Temirda"], correct: 2 },
        { text: "Yorug'lik bir jinsli muhitda qanday tarqaladi?", options: ["Egilib", "To'g'ri chiziqli", "Aylanib", "Sinib"], correct: 1 },
        { text: "Qaysi asbob tezlikni o'lchaydi?", options: ["Speedometr", "Termometr", "Ampermetr", "Soat"], correct: 0 },
        { text: "Qaysi material elektr tokini yaxshi o'tkazadi?", options: ["Temir", "Kauchuk", "Plastmassa", "Yog'och"], correct: 0 },
        { text: "Issiq narsa sovuq narsaga tegsa, issiqlik qanday yo'naladi?", options: ["Issiqdan sovuqqa", "Sovuqdan issiqqa", "Yo'nalish o'zgarmaydi", "Ikki tomonga barobar"], correct: 0 },
      ],
    },
    {
      id: "quiz_fiz_middle",
      title: "Fizika — o'rtacha",
      description: "Nyuton qonunlari, bosim, elektr tok va mexanik ish.",
      difficulty: "middle",
      questions: [
        { text: "Nyutonning 1-qonuni qanday nom bilan ham yuritiladi?", options: ["Inersiya (saklanish) qonuni", "Tezlanish qonuni", "Harakat-va-qarshilik qonuni", "Om qonuni"], correct: 0 },
        { text: "F = m·a formulasi qaysi qonun ifodasi?", options: ["Nyutonning 1-qonuni", "Nyutonning 2-qonuni", "Nyutonning 3-qonuni", "Om qonuni"], correct: 1 },
        { text: "Bosim formulasi qaysi?", options: ["p = F·S", "p = F/S", "p = S/F", "p = m/V"], correct: 1 },
        { text: "Elektr tok kuchi qanday birlikda o'lchanadi?", options: ["volt", "amper", "om", "vat"], correct: 1 },
        { text: "Elektr qarshilik qanday birlikda o'lchanadi?", options: ["amper", "volt", "om", "joul"], correct: 2 },
        { text: "Quvvat qanday birlikda o'lchanadi?", options: ["joul", "vat", "nyuton", "amper"], correct: 1 },
        { text: "Mexanik ish formulasi qaysi?", options: ["A = F·s", "A = F/s", "A = m·g", "A = F·t²"], correct: 0 },
        { text: "Quvvat formulasi qaysi?", options: ["P = A·t", "P = A/t", "P = F·s", "P = m/a"], correct: 1 },
        { text: "Tebranish chastotasi qanday birlikda o'lchanadi?", options: ["gerts", "metr", "nyuton", "kaloriya"], correct: 0 },
        { text: "Og'irlik formulasi qaysi (g ≈ 9,8 N/kg)?", options: ["P = m·g", "P = m/g", "P = g/m", "P = m·a²"], correct: 0 },
        { text: "Kuch momenti (moment) formulasi qaysi?", options: ["M = F·d", "M = F/d", "M = d/F", "M = F·v"], correct: 0 },
        { text: "Massasi 2 kg bo'lgan jism 3 m/s² tezlanish bilan harakatlandirilsa, kerak kuch qancha?", options: ["1,5 N", "6 N", "5 N", "9 N"], correct: 1 },
        { text: "100 N kuch bilan yuk 5 m balandlikka ko'tarildi. Qilingan ish qancha?", options: ["20 J", "105 J", "500 J", "95 J"], correct: 2 },
        { text: "Ovoz havoda taxminan qanday tezlikda tarqaladi?", options: ["34 m/s", "340 m/s", "3400 m/s", "3 m/s"], correct: 1 },
        { text: "Suv ostidagi qayiq chuqurlikka tushsa, suv bosimi qanday o'zgaradi?", options: ["Kamayadi", "O'zgarmaydi", "Ortadi", "Avval ortib, keyin kamayadi"], correct: 2 },
        { text: "I = U/R formulasi qanday nomlanadi?", options: ["Om qonuni", "Nyuton qonuni", "Lenz qonuni", "Kulon qonuni"], correct: 0 },
        { text: "Bosim birligi qanday?", options: ["paskal (Pa)", "nyuton", "joul", "vat"], correct: 0 },
        { text: "Joul — nimaning birligi?", options: ["Kuch", "Ish va energiya", "Bosim", "Massa"], correct: 1 },
      ],
    },
    {
      id: "quiz_fiz_hard",
      title: "Fizika — qiyin",
      description: "Impuls, energiya, elektromagnetizm va optika qonunlari.",
      difficulty: "hard",
      questions: [
        { text: "Impuls formulasi qaysi?", options: ["p = m·v", "p = m/v", "p = m·a", "p = F·t"], correct: 0 },
        { text: "Harakat va qarshilik kuchlari tengligi qaysi qonunda?", options: ["Nyutonning 1-qonuni", "Nyutonning 2-qonuni", "Nyutonning 3-qonuni", "Om qonuni"], correct: 2 },
        { text: "Ideal gaz holati tenglamasi qaysi?", options: ["PV = νRT", "P = V/T", "V = PT", "P = ν/R"], correct: 0 },
        { text: "Yorug'lik sinishi qonuni kimsa nomi bilan ataladi?", options: ["Snell", "Om", "Nyuton", "Kulon"], correct: 0 },
        { text: "Elektr zanjirining quvvati formulasi qaysi?", options: ["P = U·I", "P = U/I", "P = I/R", "P = U·R"], correct: 0 },
        { text: "Kinetik energiya formulasi qaysi?", options: ["E = m·g·h", "E = m·v²/2", "E = m·c²", "E = k·x²"], correct: 1 },
        { text: "Potensial energiya formulasi qaysi (Yer yuzasiga nisbatan)?", options: ["E = m·v²/2", "E = m·g·h", "E = F·t", "E = P·V"], correct: 1 },
        { text: "Ketma-ket ulangan ikki rezistorning umumiy qarshiligi qanday?", options: ["R = R₁ + R₂", "R = R₁·R₂", "1/R = 1/R₁ + 1/R₂", "R = R₁ − R₂"], correct: 0 },
        { text: "Paralel ulangan rezistorlar uchun qaysi formula to'g'ri?", options: ["R = R₁ + R₂", "1/R = 1/R₁ + 1/R₂", "R = R₁·R₂", "R = R₂ − R₁"], correct: 1 },
        { text: "Tebranish davri va chastotasi orasidagi bog'lanish qaysi?", options: ["T = 1/ν", "T = ν", "T = ν²", "T = 2ν"], correct: 0 },
        { text: "Kulon qonuni formulasi qaysi?", options: ["F = G·m₁m₂/r²", "F = k·q₁q₂/r²", "F = m·a", "F = q·E"], correct: 1 },
        { text: "Fotoeffekt ta'limoti kim tomonidan yaratilgan?", options: ["Nyuton", "Eyinshteyn", "Geyzenberg", "Bor"], correct: 1 },
        { text: "Erkin tushayotgan jism t bosib o'tgan yo'l formulasi (boshlang'ich tezlik 0)?", options: ["s = g·t", "s = g·t²/2", "s = g·t³", "s = v·t²"], correct: 1 },
        { text: "Atom yadrosi qanday zarrachalardan tashkil topgan?", options: ["Proton va elektron", "Proton va neytron", "Elektron va neytron", "Faqat elektron"], correct: 1 },
        { text: "1 kVt·soat necha joul?", options: ["360 J", "3 600 J", "36 000 J", "3 600 000 J"], correct: 3 },
        { text: "Qarshiligi 4 Ω bo'lgan rezistorga 12 V kuchlanish berilsa, tok kuchi qancha?", options: ["2 A", "3 A", "4 A", "48 A"], correct: 1 },
        { text: "Butun olam tortishish doimiysi G taxminan qanchaga teng?", options: ["6,67×10⁻¹¹", "6,67×10¹¹", "9,8", "3×10⁸"], correct: 0 },
        { text: "Kandela — nimaning birligi?", options: ["Yorug'lik kuchi", "Tok kuchi", "Massa", "Harorat"], correct: 0 },
      ],
    },
  ],
};

/* ================= KIMYO ================= */

const KIMYO: SubjectDef2 = {
  slug: "kimyo",
  name: "Kimyo",
  description:
    "Modda, atomlar, davriy jadval va reaksiyalar — oson, o'rtacha va qiyin darajalarda.",
  icon: "flask",
  color: "emerald",
  order: 8,
  lessons: [
    {
      id: "lesson-kim-1",
      title: "Suv va molekulalar",
      summary: "Suv formulasi, molekula tuzilishi va modda holatlari haqida.",
      durationMin: 7,
      content:
        "Suv — Yerdagi eng muhim modda. Uning formulasi H₂O: bitta suv molekulasi 2 ta vodorod atomi va 1 ta kislorod atomidan tashkil topgan.\n\nSuv o'ziga xos modda: u uch holatda uchraydi — qattiq (muz), suyuq (suv), gaz (bug'). 0°C da muzlaydi, 100°C da qaynaydi. Ko'pchilik moddadan farqli ravishda suv muzlaganda hajmi kattalashadi — shuning uchun muz suvda suzadi.\n\nSuv — universal erituvchi: ko'pchilik moddalar unda eriydi. Tuz suvda eriganda suvdan ajratish mumkin: bug'latilsa, tuz qoladi — bu fizik jarayon, yangi modda hosil bo'lmaydi.\n\nMolekula — moddaning eng kichik zarrasi bo'lib, u moddaning barcha xossasini saqlaydi. Atomlar molekulalarning qurilish 'g'ishtlari'. Atom markazida yadro bor: unda proton (musbat zaryadli) va neytron (zaryadsiz), atrofida elektronlar (manfiy zaryadli) aylanadi.",
    },
    {
      id: "lesson-kim-2",
      title: "Davriy jadval bilan tanishuv",
      summary: "Mendeleev jadvali, element belgilari va eng mashhur elementlar.",
      durationMin: 8,
      content:
        "Davriy jadval — barcha kimyoviy elementlarning tartibli ro'yxati. Uni 1869-yilda Dmitriy Mendeleev yaratgan. Elementlar atom raqami (yadro protonlar soni) bo'yicha tartiblangan.\n\nEng mashhur elementlar va belgilari: vodorod — H, kislorod — O, uglerod — C, azot — N, temir — Fe, mis — Cu, oltin — Au, kumush — Ag, natriy — Na, kaliy — K, kalsiy — Ca, oltingugurt — S, xlor — Cl, geliy — He.\n\nElement belgisi qisqa harflar bilan yoziladi. Ba'zilari lotin nomidan: temir lotinchasi Ferrum — Fe; mis Cuprum — Cu; oltin Aurum — Au. Shu sababli belgilar har doim nomning birinchi harflari bilan mos kelmaydi.\n\nMetallar (temir, mis, oltin, natriy...) elektr tokini yaxshi o'tkazadi, yaltiraydi va plastik (cho'ziladigan) xossaga ega. Metallmaslar (kislorod, azot, xlor...) ko'pincha gaz yoki mo'rt qattiq moddalar.",
    },
  ],
  quizzes: [
    {
      id: "quiz_kim_easy",
      title: "Kimyo — oson",
      description: "Moddalar, molekulalar va mashhur elementlar haqida asosiy savollar.",
      difficulty: "easy",
      questions: [
        { text: "Suvning kimyoviy formulasi qaysi?", options: ["CO₂", "H₂O", "O₂", "NaCl"], correct: 1 },
        { text: "Tuz (osh tuzi) formulasi qaysi?", options: ["NaCl", "H₂O", "KCl", "CaCO₃"], correct: 0 },
        { text: "Eng yengil gaz qaysi?", options: ["Kislorod", "Vodorod", "Azot", "Geliy"], correct: 1 },
        { text: "Atom markazida nima bor?", options: ["Yadro", "Elektron", "Molekula", "Bo'sh joy"], correct: 0 },
        { text: "Metan gazining formulasi qaysi?", options: ["CH₄", "CO₂", "C₂H₅OH", "NH₃"], correct: 0 },
        { text: "Ko'mir kuyganda ajralib chiqadigan gaz qaysi?", options: ["Kislorod", "Karbonat angidrid (CO₂)", "Vodorod", "Azot"], correct: 1 },
        { text: "Qaysi gaz nafas olish uchun kerak?", options: ["Azot", "Kislorod", "Geliy", "Metan"], correct: 1 },
        { text: "Oltin elementining belgisi qaysi?", options: ["Ag", "Au", "Fe", "Cu"], correct: 1 },
        { text: "Temir elementining belgisi qaysi?", options: ["Fe", "Au", "Cu", "Na"], correct: 0 },
        { text: "Mis elementining belgisi qaysi?", options: ["Cu", "Co", "Ca", "Cl"], correct: 0 },
        { text: "Geliy qanday narsalarda ishlatiladi?", options: ["Balonlar va dirijabllarda", "Yoqilg'i", "O'g'it", "Dori"], correct: 0 },
        { text: "Molekula nimadan tashkil topgan?", options: ["Atomlardan", "Yadrolardan", "Elektronlardan", "Kislotalardan"], correct: 0 },
        { text: "Qaysi modda 'universal erituvchi' deb ataladi?", options: ["Moy", "Suv", "Spirt", "Benzin"], correct: 1 },
        { text: "Limonda qaysi kislota ko'p?", options: ["Sulfat kislota", "Limon (sitrat) kislota", "Sut kislotasi", "Nitrat kislota"], correct: 1 },
        { text: "Qattiq, suyuq va gaz — nimaning holatlari?", options: ["Energiyaning", "Moddaning", "Kuchning", "Yorug'likning"], correct: 1 },
        { text: "Shamol alangani nima bilan o'chiriladi?", options: ["Kislorod bilan", "Vodorod bilan", "Havodan ajratish bilan", "Azot qo'shish bilan"], correct: 2 },
        { text: "Havoda eng ko'p uchraydigan gaz qaysi?", options: ["Kislorod", "Azot", "Karbonat angidrid", "Geliy"], correct: 1 },
        { text: "Muz va suv — bir xil moddamining qaysi holatlari?", options: ["Qattiq va suyuq", "Suyuq va gaz", "Gaz va qattiq", "Ikkalasi ham gaz"], correct: 0 },
      ],
    },
    {
      id: "quiz_kim_middle",
      title: "Kimyo — o'rtacha",
      description: "Davriy jadval, valentlik, reaksiya tenglamalari va pH muhit.",
      difficulty: "middle",
      questions: [
        { text: "Davriy jadvalni kim yaratgan?", options: ["Lomonosov", "Mendeleev", "Nyuton", "Dalton"], correct: 1 },
        { text: "Bitta suv molekulasida nechta atom bor?", options: ["2", "3", "4", "6"], correct: 1 },
        { text: "Valentlik nimani bildiradi?", options: ["Atomning og'irligini", "Atomning bog'lanish qobiliyatini", "Atomning hajmini", "Moddaning rangini"], correct: 1 },
        { text: "Vodorod va kisloroddan suv hosil bo'lish tenglamasi qaysi?", options: ["H₂ + O₂ = H₂O", "2H₂ + O₂ = 2H₂O", "H₂ + 2O₂ = 2H₂O", "3H₂ + O₂ = 3H₂O"], correct: 1 },
        { text: "pH qiymati 7 dan kichik bo'lsa — qanday muhit?", options: ["Ishqoriy", "Kislotali", "Neytral", "Tuzli"], correct: 1 },
        { text: "pH qiymati 7 dan katta bo'lsa — qanday muhit?", options: ["Kislotali", "Ishqoriy", "Neytral", "Kislotali va tuzli"], correct: 1 },
        { text: "Neytral muhitning pH qiymati nechchi?", options: ["0", "7", "14", "1"], correct: 1 },
        { text: "NaOH — bu nima?", options: ["Kislota", "Ishqor", "Tuz", "Oksid"], correct: 1 },
        { text: "Ohaktosh formulasi qaysi?", options: ["CaCO₃", "CaO", "Ca(OH)₂", "CaCl₂"], correct: 0 },
        { text: "Muz erishi — qanday jarayon?", options: ["Kimyoviy", "Fizik", "Biologik", "Yadroviy"], correct: 1 },
        { text: "Qog'oz kuyishi — qanday jarayon?", options: ["Fizik", "Kimyoviy", "Mexanik", "Elektr"], correct: 1 },
        { text: "Eng sodda uglevodorod qaysi?", options: ["Metan", "Etan", "Propan", "Butan"], correct: 0 },
        { text: "Reaksiya tenglamasidagi o'ng tomondagi moddalar nima deb ataladi?", options: ["Reagentlar", "Mahsulotlar", "Katalizatorlar", "Eritmalar"], correct: 1 },
        { text: "Kislota metall bilan ta'sirlashganda qanday gaz ajraladi?", options: ["Kislorod", "Vodorod", "Azot", "Karbonat angidrid"], correct: 1 },
        { text: "Katalizator reaksiyada nima qiladi?", options: ["Reaksiya tezligini o'zgartiradi (sarf bo'lmay)", "Sarf bo'ladi", "Mahsulot bo'ladi", "Erituvchi bo'ladi"], correct: 0 },
        { text: "Davriy jadvalda elementlar nima bo'yicha tartiblangan?", options: ["Atom massasi bo'yicha kamayish", "Atom (protonlar) raqami bo'yicha o'sish", "Alifbo bo'yicha", "Rang bo'yicha"], correct: 1 },
        { text: "Qaysi qatorda faqat metallar berilgan?", options: ["Temir, mis, alyuminiy", "Kislorod, azot, xlor", "Vodorod, geliy, karbon", "S, P, C"], correct: 0 },
        { text: "Suvni elektroliz qilganda qanday gazlar ajraladi?", options: ["Vodorod va kislorod", "Azot va kislorod", "Geliy va vodorod", "Karbonat angidrid va azot"], correct: 0 },
      ],
    },
    {
      id: "quiz_kim_hard",
      title: "Kimyo — qiyin",
      description: "Molyar massa, Avogadro soni, eritmalar va organik kimyo asoslari.",
      difficulty: "hard",
      questions: [
        { text: "H₂O ning molyar massasi nechchi g/mol?", options: ["16", "17", "18", "20"], correct: 2 },
        { text: "Avogadro soni qancha?", options: ["6,02×10²³", "6,02×10²⁶", "1,6×10⁻¹⁹", "3×10⁸"], correct: 0 },
        { text: "1 mol moddada nechta molekula (zarracha) bor?", options: ["100", "6,02×10²³", "1 mln", "1 mlrd"], correct: 1 },
        { text: "Atom tarkibidagi zarrachalar qaysi to'g'ri berilgan?", options: ["Proton, neytron, elektron", "Kvark, muon, foton", "Molekula, ion, atom", "Faqat elektron"], correct: 0 },
        { text: "Protonning zaryadi qanday?", options: ["Musbat", "Manfiy", "Neytral", "Yo'q"], correct: 0 },
        { text: "Elektronning zaryadi qanday?", options: ["Musbat", "Manfiy", "Neytral", "O'zgaruvchan"], correct: 1 },
        { text: "Izotoplar nima bilan farq qiladi?", options: ["Protonlar soni", "Neytronlar soni", "Elektronlar soni", "Rangi"], correct: 1 },
        { text: "Eritma massa ulushi formulasi qaysi?", options: ["ω = m(modda)/m(eritma) × 100%", "ω = m(eritma)/m(modda)", "ω = V/m", "ω = m/V"], correct: 0 },
        { text: "Organik kimyo asosan qaysi elementning birikmalarini o'rganadi?", options: ["Uglerod (C)", "Temir (Fe)", "Kislorod (O)", "Natriy (Na)"], correct: 0 },
        { text: "Etanol (spirt) formulasi qaysi?", options: ["CH₃OH", "C₂H₅OH", "C₃H₇OH", "C₆H₆"], correct: 1 },
        { text: "Glukoza formulasi qaysi?", options: ["C₆H₁₂O₆", "C₁₂H₂₂O₁₁", "CH₄", "C₂H₄"], correct: 0 },
        { text: "Ekzotermik reaksiya nima?", options: ["Issiqlik yutadigan reaksiya", "Issiqlik ajratadigan reaksiya", "Yorug'lik ajratmaydigan reaksiya", "O'zgarmas reaksiya"], correct: 1 },
        { text: "Elektroliz — bu qanday jarayon?", options: ["Tok ta'sirida parchalanish", "Issiqlik ta'sirida erish", "Mehanik aralashtirish", "Filtrlayish"], correct: 0 },
        { text: "SO₃ ning molyar massasi nechchi g/mol (S=32, O=16)?", options: ["48", "64", "80", "96"], correct: 2 },
        { text: "Qaysi modda elektrolit (tokni eritmada o'tkazadi)?", options: ["Shakar eritmasi", "Tuz eritmasi (NaCl)", "Benzin", "Distillangan suv"], correct: 1 },
        { text: "Metallarning umumiy xossasi qaysi?", options: ["Elektr tokini o'tkazadi", "Mo'rt", "Yog'och kabi yonadi", "Hamma joyda gaz holatda"], correct: 0 },
        { text: "Valentlik II bo'lgan kislorod bilan birikkan magniy oksidi formulasi qaysi?", options: ["MgO", "MgO₂", "Mg₂O", "Mg₂O₃"], correct: 0 },
        { text: "1 mol CO₂ ning massasi nechchi g (C=12, O=16)?", options: ["22", "28", "44", "56"], correct: 2 },
      ],
    },
  ],
};

/* ================= GEOGRAFIYA ================= */

const GEOGRAFIYA: SubjectDef2 = {
  slug: "geografiya",
  name: "Geografiya",
  description:
    "Qit'alar, okeanlar, O'zbekiston va jahon geografiyasi — oson, o'rtacha va qiyin darajalarda.",
  icon: "globe",
  color: "rose",
  order: 9,
  lessons: [
    {
      id: "lesson-geo-1",
      title: "O'zbekiston: tog'lar va daryolar",
      summary: "Vatanimizning tabiiy geografiyasi — Amudaryo, Sirdaryo, Tyanshan va cho'llar.",
      durationMin: 8,
      content:
        "O'zbekiston Markaziy Osiyoda joylashgan. Maydoni taxminan 449 ming km². Qo'shni davlatlar: Qozog'iston, Qirg'iziston, Tojikiston, Afg'oniston va Turkmaniston — jami 5 ta.\n\nIkkita katta daryo mamlakatimizni sug'oradi: Amudaryo (Panj va Vaxsh daryolari qo'shilishidan hosil bo'ladi) va Sirdaryo (Naryn va Qoradaryo qo'shilishidan). Ikkalasi ham Orol dengiziga quyiladi.\n\nTog'lar: mamlakatning sharqi va janubi-sharqida Tyanshan ('Osmon tog'lari') va Hisor-Olay tog'lari joylashgan. Eng baland nuqta — Hazrat Sulton cho'qqisi (4643 m, G'arbiy Tyanshan). Mamlakat hududining taxminan 4/5 qismi tekisliklar: Turon tekisligi, Qizilqum cho'li (maydoni ~300 ming km²) va Ustyurt platosi.\n\nIqlimi keskin kontinental: yoz issiq, qish sovuq, yomg'ir kam. Shu sababli dehqonchilik asosan daryolar bo'yida sug'orish bilan yuritiladi.",
    },
    {
      id: "lesson-geo-2",
      title: "Yer yuzi: qit'alar va okeanlar",
      summary: "Olti qit'a, to'rt okean va dunyoning eng-eng nuqtalari.",
      durationMin: 7,
      content:
        "Yer yuzining taxminan 71% ini suv, 29% ini quruqlik egallaydi. Quruqlik 6 ta qit'aga bo'lingan: Yevrosiyo (eng katta), Afrika, Shimoliy Amerika, Janubiy Amerika, Avstraliya va Antarktida (muz qit'asi).\n\n4 ta okean: Tinch (eng katta va eng chuqur), Atlantika, Hind va Shimoliy Muz okeanlari. Duniyoning eng chuqur joyi — Tinch okeanidagi Mariana cho'yuqligi (~11 000 m).\n\nEng-englar: eng baland cho'qqi — Everest (Jomolungma, 8848 m); eng uzun daryo — Nil (Afrikada); eng sersuv daryo — Amazonka; eng katta orol — Grenlandiya; eng chuqur ko'l — Baykal (1642 m, Rossiyada); eng katta davlat — Rossiya.\n\nXaritada o'lchash: masshtab o'lchamlar qancha kichraytirilganini ko'rsatadi. Masalan, 1:100 000 masshtabda xaritadagi 1 sm = real 100 000 sm = 1 km.",
    },
  ],
  quizzes: [
    {
      id: "quiz_geo_easy",
      title: "Geografiya — oson",
      description: "Qit'alar, okeanlar, poytaxtlar va O'zbekiston geografiyasi asoslari.",
      difficulty: "easy",
      questions: [
        { text: "Duniyoning eng katta qit'asi qaysi?", options: ["Afrika", "Yevrosiyo", "Amerika", "Avstraliya"], correct: 1 },
        { text: "Duniyoning eng katta okeani qaysi?", options: ["Atlantika", "Tinch", "Hind", "Shimoliy Muz"], correct: 1 },
        { text: "O'zbekiston poytaxti qaysi shahar?", options: ["Samarqand", "Buxoro", "Toshkent", "Namangan"], correct: 2 },
        { text: "O'zbekistonda nechta viloyat bor?", options: ["10", "11", "12", "14"], correct: 2 },
        { text: "Duniyoning eng baland cho'qqisi qaysi?", options: ["Elbrus", "Everest", "Monblan", "Xan-Tengri"], correct: 1 },
        { text: "O'zbekistondagi eng katta cho'l qaysi?", options: ["Sahro", "Qizilqum", "G'obi", "Qoraqum"], correct: 1 },
        { text: "Qoraqalpog'iston poytaxti qaysi shahar?", options: ["Nukus", "Urganch", "Xiva", "Mo'ynoq"], correct: 0 },
        { text: "O'zbekistonning qaysi shahrida Registon maydoni joylashgan?", options: ["Buxoro", "Samarqand", "Xiva", "Toshkent"], correct: 1 },
        { text: "O'zbekiston bilan chegaradosh davlatlar soni nechta?", options: ["4", "5", "6", "7"], correct: 1 },
        { text: "Qaysi qit'a 'muz qit'asi' deb ataladi?", options: ["Avstraliya", "Antarktida", "Yevropa", "Afrika"], correct: 1 },
        { text: "Yer yuzining taxminan necha foizi suv bilan qoplangan?", options: ["29%", "50%", "71%", "90%"], correct: 2 },
        { text: "O'zbekistondan oqib o'tuvchi eng katta daryo qaysi?", options: ["Sirdaryo", "Amudaryo", "Zarafshon", "Chirchiq"], correct: 1 },
        { text: "Qaysi qit'ada Misr davlati joylashgan?", options: ["Osiyo", "Afrika", "Yevropa", "Avstraliya"], correct: 1 },
        { text: "Baykal ko'li qaysi davlatda?", options: ["Qozog'istonda", "Rossiyada", "Xitoyda", "Mo'g'ulistonda"], correct: 1 },
        { text: "Sahro cho'li qaysi qit'ada?", options: ["Osiyoda", "Afrikada", "Amerikada", "Avstraliyada"], correct: 1 },
        { text: "Xiva shahri qaysi viloyatda?", options: ["Buxoroda", "Xorazmda", "Navoiyda", "Qashqadaryoda"], correct: 1 },
        { text: "Farg'ona vodiysi qaysi yirik daryo havzasida?", options: ["Amudaryo", "Sirdaryo", "Ili", "Ural"], correct: 1 },
        { text: "Qaysi davlat poytaxti London?", options: ["Fransiya", "Angliya (Buyuk Britaniya)", "Germaniya", "Italiya"], correct: 1 },
      ],
    },
    {
      id: "quiz_geo_middle",
      title: "Geografiya — o'rtacha",
      description: "Daryolar, tog'lar, iqlim va O'zbekiston tabiiy boyliklari.",
      difficulty: "middle",
      questions: [
        { text: "Amudaryo qaysi daryolar qo'shilishidan hosil bo'ladi?", options: ["Naryn va Qoradaryo", "Panj va Vaxsh", "Chirchiq va Ahangaron", "Zarafshon va Kashkadarya"], correct: 1 },
        { text: "Sirdaryo qaysi daryolar qo'shilishidan hosil bo'ladi?", options: ["Panj va Vaxsh", "Naryn va Qoradaryo", "Amudaryo va Zarafshon", "Ili va Chu"], correct: 1 },
        { text: "O'zbekistonning eng baland nuqtasi qaysi?", options: ["Xan-Tengri", "Hazrat Sulton cho'qqisi", "Beshtor", "Adelunga"], correct: 1 },
        { text: "Hazrat Sulton cho'qqisi nechchi metr balandlikda?", options: ["3643 m", "4643 m", "5643 m", "6643 m"], correct: 1 },
        { text: "Baykal ko'lining eng chuqur joyi taxminan qancha?", options: ["642 m", "1042 m", "1642 m", "2642 m"], correct: 2 },
        { text: "'Osmon tog'lari' nomi qaysi tog' tizimasiga tegishli?", options: ["Himalay", "Tyanshan", "Alp", "Kavkaz"], correct: 1 },
        { text: "Iqlim nimaning ko'p yillik rejimi?", options: ["Ob-havoning", "Daryoning", "O'simlikning", "Hayvonlarning"], correct: 0 },
        { text: "O'zbekiston iqlimi qanday?", options: ["Mussonli", "Keskin kontinental", "Dengiz iqlimli", "Subtropik"], correct: 1 },
        { text: "Zarafshon daryosi qaysi shahar yaqinidan o'tadi?", options: ["Toshkent", "Samarqand", "Nukus", "Termez"], correct: 1 },
        { text: "Maydoni jihatidan eng katta davlat qaysi?", options: ["Xitoy", "Kanada", "Rossiya", "AQSh"], correct: 2 },
        { text: "Duniyoning eng uzun daryosi qaysi (darsliklar bo'yicha)?", options: ["Amazonka", "Nil", "Yangdzы", "Missisipi"], correct: 1 },
        { text: "Duniyoning eng sersuv daryosi qaysi?", options: ["Nil", "Amazonka", "Amudaryo", "Volga"], correct: 1 },
        { text: "Orol dengizi nima sababdan kichrayib bormoqda?", options: ["Suv sug'orishga olib chiqilgani", "Zilzila", "Tog' muzlari o'sgani", "Muzlik davri"], correct: 0 },
        { text: "Duniyoning eng ko'p aholi yashaydigan davlati qaysi (2023-yildan)?", options: ["Xitoy", "Hindiston", "AQSh", "Indoneziya"], correct: 1 },
        { text: "Everest cho'qqisi qaysi tog' tizimasida?", options: ["Himalay", "And", "Tyanshan", "Olay"], correct: 0 },
        { text: "Ustyurt platosi qaysi dengiz yaqinida joylashgan?", options: ["Orol dengizi va Kaspiy orasida", "Qora dengizda", "Boltiq dengizida", "Yapon dengizida"], correct: 0 },
        { text: "O'zbekistonning asosiy eksport boyliklaridan biri qaysi?", options: ["Tabiiy gaz va paxta", "Televizorlar", "Avtomobillar xam", "Kofe"], correct: 0 },
        { text: "Qaysi shahar 'Sharq Rimi' deb atalgan qadimiy shahar?", options: ["Toshkent", "Buxoro", "Andijon", "Urganch"], correct: 1 },
      ],
    },
    {
      id: "quiz_geo_hard",
      title: "Geografiya — qiyin",
      description: "Aniq raqamlar, xarita bilimlari va chuqur geografik tushunchalar.",
      difficulty: "hard",
      questions: [
        { text: "O'zbekiston maydoni taxminan qancha?", options: ["249 ming km²", "449 ming km²", "649 ming km²", "849 ming km²"], correct: 1 },
        { text: "Tyanshan so'zining ma'nosi nima?", options: ["Qor tog'lari", "Osmon tog'lari", "Besh tog'", "Olov tog'lari"], correct: 1 },
        { text: "Amudaryo qadimgi yunon manbalarida qanday nom bilan yuritilgan?", options: ["Oksus (Oxus)", "Iaksart", "Sug'd", "Ravi"], correct: 0 },
        { text: "Sirdaryo qadimgi nomi qaysi?", options: ["Oksus", "Iaksart (Yaksart)", "Djayhun", "Efrat"], correct: 1 },
        { text: "Qizilqum cho'lining maydoni taxminan qancha?", options: ["100 ming km²", "300 ming km²", "500 ming km²", "700 ming km²"], correct: 1 },
        { text: "Duniyoning eng chuqur nuqtasi — Mariana cho'yuqligi chuqurligi taxminan qancha?", options: ["6000 m", "8000 m", "11000 m", "14000 m"], correct: 2 },
        { text: "Duniyoning eng katta oroli qaysi?", options: ["Madagaskar", "Grenlandiya", "Kalimantan", "Yangi Zelandiya"], correct: 1 },
        { text: "O'zbekiston hududining taxminan qancha qismi tekisliklar?", options: ["1/4", "1/2", "4/5", "1/10"], correct: 2 },
        { text: "Musson shamollari qanday xususiyatga ega?", options: ["Mavsumiy yo'nalishni o'zgartiradi", "Doim bir yo'nalishda esadi", "Faqat tog'larda esadi", "Faqat kechqurun esadi"], correct: 0 },
        { text: "Xarita masshtabi 1:100 000 bo'lsa, 1 sm nechchi km ko'rsatadi?", options: ["100 m", "1 km", "10 km", "100 km"], correct: 1 },
        { text: "Panama kanali qaysi okeanlarni bog'laydi?", options: ["Tinch va Atlantika", "Hind va Tinch", "Atlantika va Shimoliy Muz", "Hind va Atlantika"], correct: 0 },
        { text: "Suv aylanishi (doirasi) qanday jarayonlar bilan sodir bo'ladi?", options: ["Bug'lanish va yog'ingarchilik", "Zilzila va vulqon", "Eroziya va cho'kish", "Fotosintez va nafas"], correct: 0 },
        { text: "Chorvoq suv ombori qaysi daryoda qurilgan?", options: ["Amudaryo", "Chirchiq", "Zarafshon", "Surchon"], correct: 1 },
        { text: "O'zbekistondagi eng katta ko'l (qisman sho'r) qaysi?", options: ["Sariqamish", "Baykal", "Isik-Ko'l", "Van"], correct: 0 },
        { text: "Xaritada ekvator nimani ajratadi?", options: ["Shimoliy va Janubiy yarim shar", "Sharqiy va G'arbiy yarim shar", "Qit'alarni", "Okeanlarni"], correct: 0 },
        { text: "O'zbekiston qaysi xalqaro vaqt zonasi (UTC+)?", options: ["UTC+3", "UTC+5", "UTC+7", "UTC+9"], correct: 1 },
        { text: "G'arbiy Tyanshan YUNESKO ro'yxatiga qaysi yil kiritilgan?", options: ["2016", "2006", "2010", "2020"], correct: 0 },
        { text: "Katta Suyqum kanali qaysi daryolarni bog'laydi?", options: ["Amudaryo va Sirdaryo", "Zarafshon va Amudaryo", "Ili va Irtysh", "Volga va Don"], correct: 0 },
      ],
    },
  ],
};

/* ================= ONA TILI ================= */

const ONA_TILI: SubjectDef2 = {
  slug: "ona-tili",
  name: "Ona tili",
  description:
    "O'zbek alifbosi, so'z turlari, qoidalar va sintaksis — oson, o'rtacha va qiyin darajalarda.",
  icon: "languages",
  color: "amber",
  order: 10,
  lessons: [
    {
      id: "lesson-til-1",
      title: "Harf va tovushlar: unlilar va undoshlar",
      summary: "O'zbek alifbosi tuzilishi va talaffuz qoidalarining poydevori.",
      durationMin: 7,
      content:
        "O'zbek alifbosida 29 ta harf bor. Ulardan 6 tasi unli: a, e, i, o, u, o'. Qolgan 23 tasi undosh.\n\nUnlilar tovush yo'li to'la ochilgan holda talaffuz qilinadi, shuning uchun ular gapdagi bo'g'inlarning asosini tashkil etadi. Har bir bo'g'inda kamida bitta unli bo'ladi. Masalan, 'kitob' so'zi ki-tob — 2 ta bo'g'in, har birida unli bor.\n\nUndoshlar juft-juftlik bilan yashaydi: q — g', b — p, d — t, j — ch, z — s, v — f, g — k, x — h. Juft undoshlarning biri qo'qir (ovoz chiqarib talaffuz qilinadi), boshqasi qo'rsiq (ovoz chiqmaydi). Masalan, 'b' — qo'qir, 'p' — qo'rsiq.\n\nBo'g'in turlari: ochiq (unli bilan tugaydi — ba-sha), yopiq (undosh bilan tugaydi — til) va qo'shma (undosh-undosh bilan tugaydi — dost, qand). Qo'shma bo'g'in faqat so'z oxirida keladi.",
    },
    {
      id: "lesson-til-2",
      title: "So'z turlari bilan tanishuv",
      summary: "Ot, sifat, son, olmosh, fe'l, ravish va yordamchi so'zlar haqida.",
      durationMin: 8,
      content:
        "O'zbek tilida so'zlar ma'no va vazifasiga ko'ra turlarga bo'linadi.\n\nOt — predmet nomini bildiradi: kitob, Toshkent, bahor. Otlar jonsiz va jonli, aniq va umumiy bo'ladi. Otlar kelishiklarga o'zgaradi: boshlang'ich, qaratqich (-ning), jo'nalis (-ga), o'rnis (-da), chiqish (-dan).\n\nSifat — belgi bildiradi: chiroyli, tez, oq. Sifat darajalarga ega: oddiy (chiroyli), qiyosiy (chiroyliroq), ortuq (eng chiroyli).\n\nFe'l — harakat-holat bildiradi: o'qimoq, yozmoq. Fe'l zamonlarga o'zgaradi: o'tgan (o'qidi, o'qigan edi), hozirgi (o'qiydi, o'qiyapti), kelasi (o'qiydi, o'qir).\n\nOlmosh — otni almashtiradi: men, sen, u, bu, kim, nima. Son — son sanaladi: bir, ikki, o'n. Ravish — belgi-harakat xususiyatini bildiradi: tez, erta, yaxshi.\n\nYordamchi so'zlar: bog'lovchi (va, lekin, chunki), ko'makchi (- bilan, uchun, haqida), yuklama (-mi, -gina). Ular mustaqil ma'no bildirmaydi, gaplarni bog'laydi.",
    },
  ],
  quizzes: [
    {
      id: "quiz_til_easy",
      title: "Ona tili — oson",
      description: "Alifbo, harf-tovushlar va oddiy so'z turlari.",
      difficulty: "easy",
      questions: [
        { text: "O'zbek alifbosida nechta harf bor?", options: ["26", "27", "29", "33"], correct: 2 },
        { text: "O'zbek alifbosida nechta unli harf bor?", options: ["5", "6", "7", "8"], correct: 1 },
        { text: "Qaysi qatorda faqat unli harflar berilgan?", options: ["a, e, i, o, u, o'", "b, p, d, t", "q, g, k", "z, s, sh"], correct: 0 },
        { text: "'Kitob' so'zi qaysi so'z turkumiga mansub?", options: ["Ot", "Sifat", "Fe'l", "Olmosh"], correct: 0 },
        { text: "Harakat bildiruvchi so'zlar qaysi turkumga mansub?", options: ["Ot", "Sifat", "Fe'l", "Ravish"], correct: 2 },
        { text: "Belgi bildiruvchi so'zlar qaysi turkumga mansub?", options: ["Ot", "Sifat", "Son", "Bog'lovchi"], correct: 1 },
        { text: "'U' so'zi qaysi so'z turkumiga mansub?", options: ["Ot", "Fe'l", "Olmosh", "Ko'makchi"], correct: 2 },
        { text: "'Va' so'zi nimaga xizmat qiladi?", options: ["So'zlarni bog'laydi", "Harakat bildiradi", "Belgi bildiradi", "Sanaydi"], correct: 0 },
        { text: "Gap oxirida qanday belgi qo'yiladi (hikoya gapida)?", options: ["Savol belgisi", "Nuqta", "Undov belgisi", "Vergul"], correct: 1 },
        { text: "Savol gapining oxirida qanday belgi bo'ladi?", options: ["?", "!", ".", ","], correct: 0 },
        { text: "'Yaxshi' so'zi qaysi turkumga mansub?", options: ["Sifat", "Ot", "Son", "Olmosh"], correct: 0 },
        { text: "'Kitoblar' so'zida qaysi qo'shimcha ko'plikni bildiradi?", options: ["-da", "-lar", "-ga", "-ning"], correct: 1 },
        { text: "Shahar va odam ismlari qanday harf bilan yoziladi?", options: ["Kichik harf", "Bosh harf", "Raqam bilan", "Chiqlash bilan"], correct: 1 },
        { text: "'O'qimoq' so'zi qaysi turkumga mansub?", options: ["Sifat", "Ot", "Fe'l", "Ravish"], correct: 2 },
        { text: "O'zbekistonning davlat tili qaysi til?", options: ["Rus tili", "O'zbek tili", "Ingliz tili", "Tajik tili"], correct: 1 },
        { text: "'Kitob' so'zi nechta bo'g'inga bo'linadi?", options: ["1", "2", "3", "4"], correct: 1 },
        { text: "Bo'g'inda kamida qanday tovush bo'ladi?", options: ["Undosh", "Unli", "Ikki undosh", "Hech narsa"], correct: 1 },
        { text: "O'zbek tili qaysi tillar oilasiga mansub?", options: ["Hind-yevropa", "Turk tillari", "Arab", "Xitoy-tibet"], correct: 1 },
      ],
    },
    {
      id: "quiz_til_middle",
      title: "Ona tili — o'rtacha",
      description: "Juft undoshlar, bo'g'inlar, fe'l zamonlari va kelishiklar.",
      difficulty: "middle",
      questions: [
        { text: "Juft undoshlardan 'q' ning jufti qaysi?", options: ["k", "g'", "x", "h"], correct: 1 },
        { text: "Juft undoshlardan 'b' ning jufti qaysi?", options: ["v", "p", "m", "f"], correct: 1 },
        { text: "Qo'shma bo'g'in qaysi so'zda bor?", options: ["ba-sha", "ki-tob", "dost", "u-lug'"], correct: 2 },
        { text: "'O'qiyapti' fe'li qaysi zamonda?", options: ["O'tgan zamon", "Hozirgi davomiy zamon", "Kelasi zamon", "Buyruq-undalma"], correct: 1 },
        { text: "'O'qigan edi' iborasida qaysi zamon?", options: ["Hozirgi", "O'tgan zamon", "Kelasi", "Hozirgi davomiy"], correct: 1 },
        { text: "'Bog'bon' so'zi qanday yasalgan?", options: ["bog' + bon", "bog + bon", "bo + g'bon", "bog'bo + n"], correct: 0 },
        { text: "'Eng chiroyli' qaysi daraja?", options: ["Oddiy", "Qiyosiy", "Ortuq", "Kamlik"], correct: 2 },
        { text: "'Daftar' oti jonlimi yoki jonsizmi?", options: ["Jonli", "Jonsiz", "Ikkalasi ham", "Hech biri"], correct: 1 },
        { text: "Ko'plik qo'shimchasi qaysi?", options: ["-lar", "-da", "-ning", "-ga"], correct: 0 },
        { text: "Qaratqich kelishigi qo'shimchasi qaysi?", options: ["-da", "-ga", "-ning", "-dan"], correct: 2 },
        { text: "'Men' olmoshi qaysi xildagi olmosh?", options: ["Shaxs olmoshi", "Ko'rsatish olmoshi", "Savol olmoshi", "Aniqlash olmoshi"], correct: 0 },
        { text: "'Chiroyliroq' qaysi daraja?", options: ["Oddiy", "Qiyosiy", "Ortuq", "Bu sifat emas"], correct: 1 },
        { text: "Gapning bosh bo'laklari qaysilar?", options: ["Ega va kesim", "Aniqlovchi va hol", "To'ldiruvchi va hol", "Ega va aniqlovchi"], correct: 0 },
        { text: "'-lik' qo'shimchasi nimani yasaydi ('do'stlik')?", options: ["Otni", "Fe'lni", "Ravishni", "Olmoshni"], correct: 0 },
        { text: "'Tez yugurdi' iborasida 'tez' nima bo'lak?", options: ["Ega", "Kesim", "Hol", "Aniqlovchi"], correct: 2 },
        { text: "Kelishiklar nechta?", options: ["3", "4", "5", "6"], correct: 2 },
        { text: "Jo'nalis kelishigi qo'shimchasi qaysi?", options: ["-ning", "-ga", "-da", "-dan"], correct: 1 },
        { text: "'O'quvchi' so'zida '-chi' qo'shimcha nimani bildiradi?", options: ["Kasb-hunarni", "Joy nomini", "Sonni", "Zamonni"], correct: 0 },
      ],
    },
    {
      id: "quiz_til_hard",
      title: "Ona tili — qiyin",
      description: "Sintaksis, morfema tuzilishi va murakkab qoidalar.",
      difficulty: "hard",
      questions: [
        { text: "Morfema nima?", options: ["So'zning ma'noli qismi (ildiz yoki qo'shimcha)", "Gapning bir bo'lagi", "Harf-tovush birlik", "Bo'g'in"], correct: 0 },
        { text: "Ildiz — so'zning nima?", options: ["Eng katta qismi", "Asosiy ma'noli qismi", "Oxirgi qismi", "Yordamchi qismi"], correct: 1 },
        { text: "'O'qigan' so'zida '-gan' qo'shimchasi nima yasaydi (o'qigan bola)?", options: ["Sifat", "Son", "Olmosh", "Bog'lovchi"], correct: 0 },
        { text: "'O'qib' so'zida '-ib' qo'shimcha bilan yasalgan so'z qanday nomlanadi?", options: ["Ravishdosh", "Son", "Ot", "Yuklama"], correct: 0 },
        { text: "Kim/nima degan savolga javob beradigan gap bo'lagi qaysi?", options: ["Ega", "Hol", "Aniqlovchi", "To'ldiruvchi"], correct: 0 },
        { text: "Aniqlovchi qanday savolga javob beradi?", options: ["Qaysi? qanday?", "Kimni? nimani?", "Qayerdan? qachon?", "Kim tomondan?"], correct: 0 },
        { text: "To'ldiruvchi qanday savollarga javob beradi?", options: ["Kimni? nimani?", "Qaysi? qanday?", "Qayerda? qachon?", "Nega?"], correct: 0 },
        { text: "Gapda ega bilan kesim nimani tashkil qiladi?", options: ["Bosh bo'laklarni", "Ikkinchi darajali bo'laklarni", "Yordamchi so'zlarni", "Undovlarni"], correct: 0 },
        { text: "Undirma gap nima bildiradi?", options: ["Buyruq, undov", "Savol", "Hikoya", "Shart"], correct: 0 },
        { text: "Qo'shma gap nechta sodda gapdan tashkil topadi?", options: ["1", "2 yoki undan ko'p", "Faqat 3", "Faqat 5"], correct: 1 },
        { text: "Qo'shma gapning qismlari qanday bog'lanadi?", options: ["Bog'lovchi vositalar orqali", "Faqat vergul orqali", "Hech qanday vositasiz", "Faqat tire orqali"], correct: 0 },
        { text: "'Shaharda' so'zida '-da' qaysi kelishigi?", options: ["Qaratqich", "Jo'nalis", "O'rnis", "Chiqish"], correct: 2 },
        { text: "'Maktabdan' so'zida '-dan' qaysi kelishigi?", options: ["Qaratqich", "O'rnis", "Jo'nalis", "Chiqish"], correct: 3 },
        { text: "Fe'lning buyruq mayli misoli qaysi?", options: ["O'qi!", "O'qidi", "O'qiydi", "O'qigan"], correct: 0 },
        { text: "Ravishdosh nechchi fe'l-harakatni birga bildiradi?", options: ["Faqat bittasini", "Ikkita (bosh harakat va asosiy)", "Uchtasini", "Hech birini"], correct: 1 },
        { text: "'Bosh' so'zida bo'g'in qanday tur?", options: ["Ochiq", "Yopiq", "Qo'shma", "Bunday bo'g'in yo'q"], correct: 2 },
        { text: "Yuklama gapning qaysi qismiga qo'shiladi va nimani bildiradi?", options: ["So'zga qo'shiladi, ma'noni kuchaytiradi/savol hosil qiladi", "Faqat sonlarga", "Faqat olmoshlarga", "Hech narsaga"], correct: 0 },
        { text: "'Kitobimda' so'zida qaysi qo'shimchalar ketma-ket kelgan?", options: ["Birlik + o'rnis kelishigi", "Ko'plik + chiqish", "Buyruq + jo'nalis", "Qiyosiy + qaratqich"], correct: 0 },
      ],
    },
  ],
};

/* ================= ADABIYOT ================= */

const ADABIYOT: SubjectDef2 = {
  slug: "adabiyot",
  name: "Adabiyot",
  description:
    "Klassik va zamonaviy o'zbek adabiyoti: Navoiy, Bobur, Qodiriy va boshqalar — oson, o'rtacha va qiyin darajalarda.",
  icon: "book",
  color: "cyan",
  order: 11,
  lessons: [
    {
      id: "lesson-adab-1",
      title: "Alisher Navoiy va Xamsa",
      summary: "Buyuk shoirning hayoti va besh dostonidan iborat Xamsa haqida.",
      durationMin: 8,
      content:
        "Alisher Navoiy (1441–1501) — o'zbek adabiyotining tayanch shaxsi. U Husayn Boyqaro hukmronligi davrida Hirot shahrida (Temuriylar saltanatining madaniy markazida) yashab ijod qilgan, davlat arbobi bo'lib xizmat qilgan.\n\nNavoiyning bosh shoh asari — 'Xamsa'. 'Xamsa' — arabcha 'beshlik' degan ma'noni bildiradi: unda 5 ta doston bor — 'Hayrat ul-abror', 'Farhod va Shirin', 'Layli va Majnun', 'Sab'ai sayyor' va 'Saddi Iskandariy'. Ushbu dostonlar orqali shoir do'stlik, adolat, sevgi va bilim g'oyalarini o'rgatgan.\n\nNavoiyning boshqa asarlari: 'Majolis un-nafois' (tazkira — 200 dan ortiq shoir va olim haqida), 'Muhokamat ul-lug'at' (til haqidagi risola — turkiy tilning boy va nufuzli ekanini asoslagan), 'Mahbub ul-qulub' (hikmatli asar).\n\nShoir 1501-yilda Hirot shahrida vafot etgan. Toshkent, Samarqand va boshqa shaharlarda uning nomidagi teatrlar va universitetlar bor.",
    },
    {
      id: "lesson-adab-2",
      title: "Zamonaviy o'zbek adabiyoti",
      summary: "Abdulla Qodiriy, Oybek, Hamza va XX asr adabiyotining yirik vakillari.",
      durationMin: 8,
      content:
        "XX asr o'zbek adabiyoti ko'plab yirik nomlar bilan boy.\n\nAbdulla Qodiriy (1894–1938) — o'zbek romanining asoschisi. 'O'tkan kunlar' romani — o'zbek tilidagi ilk yirik roman: unda Otabek va Kumushbibi sevgi hikoyasi, XIX asr Turkiston hayoti tasvirlangan. Yana bir romani — 'Mehrobdan chayon'; nasriy asarlaridan yana biri 'Kecha va kunduz'.\n\nOybek (Musoxon Aminxo'jayev) — 'Navoiy' romani va 'Qutlug' qon' qissasi bilan mashhur.\n\nHamza Hakimzoda Niyoziy — dramaturg va shoir: 'Boy ila xizmatchi' va 'Maysaraning ishi' pyesalari mashhur.\n\nG'afur G'ulom — 'Shum bola' avtobiografik qissasi bilan tanilgan.\n\nAbdulla Qahhor — 'Og'riq tish' kabi qisqa hikoyalar ustasi. Tohir Malik — 'Shaytanat' sernalari bilan ko'p qirrali yozuvchi. Ularning asarlari hozir ham maktab dasturlarida o'qitiladi.",
    },
  ],
  quizzes: [
    {
      id: "quiz_adab_easy",
      title: "Adabiyot — oson",
      description: "Mashhur asarlar va ularning mualliflari haqida asosiy savollar.",
      difficulty: "easy",
      questions: [
        { text: "'Boburnoma' asari kimga tegishli?", options: ["Alisher Navoiy", "Zahiriddin Muhammad Bobur", "Yaseviy", "Furqat"], correct: 1 },
        { text: "'Xamsa' kimi tomonidan yozilgan?", options: ["Alisher Navoiy", "Bobur", "Ulug'bek", "Ogahiy"], correct: 0 },
        { text: "Navoiyning 'Xamsa'ida nechta doston bor?", options: ["3", "4", "5", "6"], correct: 2 },
        { text: "'Alpomish' — qanday janrdagi asar?", options: ["Doston", "Roman", "Hikoya", "Maqol"], correct: 0 },
        { text: "'O'tkan kunlar' romani kim tomonidan yozilgan?", options: ["Abdulla Qodiriy", "Oybek", "Hamza", "G'afur G'ulom"], correct: 0 },
        { text: "'O'tkan kunlar' romaning asosiy qahramonlari kimlar?", options: ["Otabek va Kumush", "Anvar va Sitora", "Bobur va Layli", "Farhod va Shirin"], correct: 0 },
        { text: "'Shum bola' qissasi kimniki?", options: ["G'afur G'ulom", "Oybek", "Qodiriy", "Qahhor"], correct: 0 },
        { text: "'Boy ila xizmatchi' asari kimiiki?", options: ["Hamza", "Navoiy", "Mashrab", "Muqimiy"], correct: 0 },
        { text: "G'azal — qanday janr?", options: ["She'riy janr", "Nasriy janr", "Dramatik janr", "Aytim"], correct: 0 },
        { text: "Ruboiy nechta misradan iborat?", options: ["2", "3", "4", "5"], correct: 2 },
        { text: "Doston — qanday asar?", options: ["Katta hajmli she'riy asar", "Bir sahifali hikoya", "Maqol", "Pyesa"], correct: 0 },
        { text: "Maqol — bu nima?", options: ["Qisqa donishmandlik so'zi", "Uzun roman", "Pyesa", "Tarjimai hol"], correct: 0 },
        { text: "Navoiy qaysi tilda ijod qilgan?", options: ["Fors tilida", "O'zbek (turkiy) tilida", "Arab tilida", "Rus tilida"], correct: 1 },
        { text: "'Maysaraning ishi' — qanday janrdagi asar?", options: ["Pyesa (drama)", "Doston", "Ruboiy", "Ertak"], correct: 0 },
        { text: "'Og'riq tish' hikoyasi kimiiki?", options: ["Abdulla Qahhor", "Oybek", "Tohir Malik", "Fitrat"], correct: 0 },
        { text: "Kitoblarni saqlash va o'qish joyi qanday ataladi?", options: ["Kutubxona", "Muzey", "Teatr", "Kafe"], correct: 0 },
        { text: "'Farhod va Shirin' dostoni qaysi asardan?", options: ["Navoiyning Xamsasidan", "Boburnomadan", "Alpomishdan", "Devoni hikmatdan"], correct: 0 },
        { text: "Ertak — qanday adabiy tur?", options: ["Xalq og'zaki ijodi", "Fikr risolasi", "Hujjat", "Darslik"], correct: 0 },
      ],
    },
    {
      id: "quiz_adab_middle",
      title: "Adabiyot — o'rtacha",
      description: "Bobur, Navoiy davri va klassik adabiyot vakillari.",
      difficulty: "middle",
      questions: [
        { text: "Bobur qaysi shaharda tug'ilgan?", options: ["Samarqand", "Andijon", "Toshkent", "Hirot"], correct: 1 },
        { text: "'Majolis un-nafois' qanday turdagi asar?", options: ["Tazkira (shoirlar haqida)", "Doston", "Roman", "Maqollar"], correct: 0 },
        { text: "'Boburnoma' qanday turdagi asar?", options: ["Tarjimai hol (memuar)", "Doston", "Pyesa", "She'riy bayon"], correct: 0 },
        { text: "'Devoni hikmat' kimiiki?", options: ["Ahmad Yaseviy", "Navoiy", "Bobur", "Mashrab"], correct: 0 },
        { text: "Navoiyning Xamsasidagi birinchi doston qaysi?", options: ["Hayrat ul-abror", "Farhod va Shirin", "Sab'ai sayyor", "Layli va Majnun"], correct: 0 },
        { text: "Ogahiy qanday sohalarda ijod qilgan alloma?", options: ["Shoir va tarixchi", "Astronom", "Shifokor", "Suvchilik"], correct: 0 },
        { text: "'Tohir va Zuhra' doshtoni kimiiki?", options: ["Muqimiy", "Furqat", "Ogahiy", "Mashrab"], correct: 0 },
        { text: "Furqat qaysi mavzuda she'rlar yozgan mashhur shoir?", options: ["Ilm-fan va ma'rifat", "Harbiy", "Sport", "Ovchilik"], correct: 0 },
        { text: "'Mehrobdan chayon' romaning qahramoni kim?", options: ["Anvar", "Otabek", "Bobur", "Farhod"], correct: 0 },
        { text: "'Kecha va kunduz' romani kimiiki?", options: ["Abdulla Qodiriy", "Oybek", "Hamza", "Fitrat"], correct: 0 },
        { text: "'Qutlug' qon' qissasi kimiiki?", options: ["Oybek", "Qodiriy", "Qahhor", "G'afur G'ulom"], correct: 0 },
        { text: "'Shaytanat' asari kimiiki?", options: ["Tohir Malik", "Oybek", "Fitrat", "Aminxo'ja"], correct: 0 },
        { text: "Bobur Hindistonda qaysi davlatga asos soldi?", options: ["Buyuk Mo'g'ullar saltanati", "Osmonli saltanati", "Safaviylar", "Shaybaniylar"], correct: 0 },
        { text: "'Mahbub ul-qulub' Navoiyning qanday asari?", options: ["Hikmatli (donishmandlik) asari", "Dostoni", "Tazkirasi", "Risolasi"], correct: 0 },
        { text: "Mashrab qanday yo'nalishdagi shoir?", options: ["Sufizm (tasavvuf) g'oyalarida", "Harbiy", "Sport", "Bolalar adabiyoti"], correct: 0 },
        { text: "'Sab'ai sayyor' doshtoni Navoiyning qaysi asaridandir?", options: ["Xamsa", "Devoni hikmat", "Boburnoma", "Ravzat ul-ahbob"], correct: 0 },
        { text: "Muqimiy qaysi shaharda yashab ijod qilgan?", options: ["Qo'qon", "Samarqand", "Nukus", "Termez"], correct: 0 },
        { text: "Bahouddin Naqshband qanday sohada mashhur?", options: ["Tasavvuf (sufizm)", "Matematika", "Tib", "Musiqashunoslik"], correct: 0 },
      ],
    },
    {
      id: "quiz_adab_hard",
      title: "Adabiyot — qiyin",
      description: "Chuqur adabiy bilimlar: asarlar tarkibi, adabiy tushunchalar va davrlar.",
      difficulty: "hard",
      questions: [
        { text: "'Muhokamat ul-lug'at' Navoiyning qanday mavzudagi risolasi?", options: ["Til haqidagi (turkiy tilning ustunligi)", "Astronomiya", "Medik", "Harbiy"], correct: 0 },
        { text: "Navoiyning Xamsasi tartibi qaysi to'g'ri?", options: ["Hayrat ul-abror → Farhod va Shirin → Layli va Majnun → Sab'ai sayyor → Saddi Iskandariy", "Farhod → Layli → Hayrat → Saddi → Sab'ai", "Saddi → Farhod → Sab'ai → Hayrat → Layli", "Layli → Hayrat → Saddi → Farhod → Sab'ai"], correct: 0 },
        { text: "'Layli va Majnun' doshtoning qahramoni kimsa?", options: ["Qays", "Anvar", "Otabek", "Farhod"], correct: 0 },
        { text: "Navoiy qaysi shaharda vafot etgan (1501)?", options: ["Hirot", "Toshkent", "Samarqand", "Buxoro"], correct: 0 },
        { text: "Navoiy Husayn Boyqaro davlatida qanday lavozimda xizmat qilgan?", options: ["Vazir", "Rassom", "Harbiy qo'mondon", "Kalendarchi"], correct: 0 },
        { text: "G'azalning birinchi bayti qanday ataladi?", options: ["Matla'", "Maqta'", "Beket", "Radvif"], correct: 0 },
        { text: "Bobur 1526-yilda qaysi jang bilan Hindistonda o'rin egalladi?", options: ["Panipat jangi", "Polvashi jangi", "Kosovo jangi", "Aleppo jangi"], correct: 0 },
        { text: "'Ravzat ul-ahbob' Navoiyning qanday asari?", options: ["Tarixiy asar", "She'riy devon", "Tazkira", "Risolalar"], correct: 0 },
        { text: "Cho'lponning 'Kechal' asari qanday turda?", options: ["Roman (trilogiya birinchi kitobi)", "Ruboiy", "Maqol", "Ertak"], correct: 0 },
        { text: "'Navoiy' romani kimiiki?", options: ["Oybek", "Qodiriy", "Hamza", "Mashrab"], correct: 0 },
        { text: "Roman — qanday janr?", options: ["Katta hajmli nasriy asar", "4 misrali she'r", "Qisqa maqol", "Xalq qo'shig'i"], correct: 0 },
        { text: "Xalq dostonlarini ovoz bilan aytib beradigan ijrochi kim ataladi?", options: ["Baxshi (dostonchi)", "Rassom", "Kalendarchi", "Me'mor"], correct: 0 },
        { text: "Fitrat qaysi sohada ham ijod qilgan yirik nom?", options: ["Dramaturgiya va ma'rifat", "Sport", "Harbiy", "Kasanachilik"], correct: 0 },
        { text: "'Saddi Iskandariy' doshtoni kimning qahramoni atrofida?", options: ["Iskandar (Aleksandr)", "Farhod", "Majnun", "Bobur"], correct: 0 },
        { text: "Boburning she'riy devoni qaysi nom bilan mashhur (tahallusi)?", options: ["Devoni hikmat", "Devoni Foni", "Devoni lafton", "Devoni Boburiy"], correct: 1 },
        { text: "G'azal, ruboiy, qasida — qaysi janrlar?", options: ["She'riy janrlar", "Nasriy janrlar", "Dramatik janrlar", "Musiqiy janrlar"], correct: 0 },
        { text: "'Shum bola' qissasi qanday turda yozilgan?", options: ["Avtobiografik qissa", "Fantastik roman", "Tarixiy risola", "Pyesa"], correct: 0 },
        { text: "Oybekning asl ismi qanday?", options: ["Musoxon Aminxo'jayev", "Abdullayev", "Sohibxona", "Xolmurod"], correct: 0 },
      ],
    },
  ],
};

/* ================= MAVJUD TESTLARGA QO'SHIMCHA SAVOLLAR ================= */

const EX_UZ_TARIXI: Record<string, Q2[]> = {
  quiz_uz_7_easy: [
    { text: "Amir Temur qaysi davlatga asos soldi?", options: ["Temuriylar saltanati", "Osmonli saltanati", "Safaviylar", "Qoraxoniylar"], correct: 0 },
    { text: "Amir Temur o'z hokimiyatini qaysi shahardan boshqargan?", options: ["Samarqand", "Toshkent", "Buxoro", "Hirot"], correct: 0 },
    { text: "Temuriylar davrida poytaxt yirik ilm-fan markazi bo'lgan edi. 'Ulug'bek rasadxonasi' qaysi shaharda?", options: ["Toshkentda", "Samarqandda", "Nukusda", "Farg'onada"], correct: 1 },
    { text: "Temur qaysi unvon bilan mashhur edi?", options: ["Sahibqiron", "Sulton Odil", "Xalq ko'zi", "Daryo oshi"], correct: 0 },
    { text: "Temuriylar davrida qaysi ilm kuchli rivojlandi?", options: ["Astronomiya va matematika", "Futbol", "Kosmonavtika", "Ijtimoiy tarmoqlar"], correct: 0 },
  ],
  quiz_uz_7_middle: [
    { text: "Amir Temur qachon hokimiyat tepasiga chiqdi?", options: ["1370-yil", "1405-yil", "1220-yil", "1500-yil"], correct: 0 },
    { text: "Ulug'bek qaysi asarda mashhur astronom?", options: ["XV asr", "X asr", "XVIII asr", "XX asr"], correct: 0 },
    { text: "'Ziji jadidi Ko'ragoniy' — bu nima?", options: ["Astronomik jadval", "Roman", "Harbiy jang", "Xarita kitobi"], correct: 0 },
    { text: "Amir Temur davlatining tashqi siyosati qanday yo'nalishda edi?", options: ["Fathlar va savdo yo'llarini o'ziga qaratish", "Izolyatsiya (o'zini yopish)", "Faqat dengiz savdosi", "Faqat ma'rifiy uzgarmaslik"], correct: 0 },
    { text: "Temuriylar davrida Samarqand qaysi rasadxona bilan mashhur edi?", options: ["Ulug'bek rasadxonasi", "Grinvich rasadxonasi", "Paris rasadxonasi", "Ondem rasadxonasi"], correct: 0 },
  ],
  quiz_uz_7_hard: [
    { text: "Amir Temur fathlari qaysi yo'nalishlarda amalga oshirilgan?", options: ["Kichik Osiyo, Eron, Shimoliy Hindiston va Kavkaz", "Antarktida", "Janubiy Amerika", "Okeaniya"], correct: 0 },
    { text: "Ulug'bekning astronomik jadvalida yulduzlar pozitsiyalari qancha aniqlikda berilgan?", options: ["Ancha aniqlikda (zamonasiga qaraganda aniq)", "Faqat 3 ta yulduz", "Faqat ko'rinadigan yarim osmon", "Faqat Quyosh"], correct: 0 },
    { text: "Temuriylar davrida Amir Temurning qaysi avlodi ilm-fan markazi rahbari bo'lgan?", options: ["Ulug'bek", "Shaybaniy", "Mashrab", "Yaseviy"], correct: 0 },
    { text: "Temuriylar davlatining ta'siri qaysi davrgacha davom etgan?", options: ["XV asr oxirigacha", "XIII asrgacha", "XVII asrgacha", "XX asrgacha"], correct: 0 },
    { text: "Amir Temur davrida qaysi shahar madaniy va ilmiy markaz sifatida yuksalgan?", options: ["Samarqand", "Andijon", "Kokand", "Chimkent"], correct: 0 },
  ],
  quiz_uz_8_easy: [
    { text: "Shaybaniylar davlatiga kim asos soldi?", options: ["Shaybaniyxon", "Amir Temur", "Bobur", "Yaseviy"], correct: 0 },
    { text: "Zahiriddin Bobur qaysi asarini Movarounnahrni eslab yozgan?", options: ["Boburnoma", "Xamsa", "Devoni hikmat", "Mahbub ul-qulub"], correct: 0 },
    { text: "XVII asrda Movarounnahrdagi davlatlar qaysi sulolalar bo'lgan?", options: ["Ashtarkhoniylar", "Ruriklar", "Tudorlar", "Kapetinglar"], correct: 0 },
    { text: "Buxoro xonligining mashhur tarixiy shahri qaysi?", options: ["Buxoro", "Paris", "London", "Vena"], correct: 0 },
    { text: "XVIII asr oxirida Buxoro xonligida qaysi sulola hukmronlik qilgan?", options: ["Mang'itlar", "Safaviylar", "Romanovlar", "Vandallar"], correct: 0 },
  ],
  quiz_uz_8_middle: [
    { text: "Shaybaniyxon Movarounnahrni qachon egalladi?", options: ["1500-yil atrofida", "1200-yil", "1600-yil", "1700-yil"], correct: 0 },
    { text: "Ashtarkhoniylar davrida poytaxt qaysi shahar bo'lgan?", options: ["Buxoro", "Kokand", "Nukus", "Urganch"], correct: 0 },
    { text: "XVIII asrda Movarounnahrda qaysi xonliklar paydo bo'lgan?", options: ["Buxoro, Xiva va Qo'qon xonliklari", "Fransiya va Ispaniya", "Rus va Prusiya", "Xitoy va Yaponiya"], correct: 0 },
    { text: "Xiva xonligi qaysi hududni qamrab olgan?", options: ["Xorazm", "Farg'ona", "Ural", "Volga"], correct: 0 },
    { text: "Bobur Movarounnahrni yo'qotgandan keyin qaysi davlatga asos soldi?", options: ["Buyuk Mo'g'ullar (Hindiston)", "Osmonli (Turkiya)", "Safaviylar (Eron)", "Qoraxoniylar"], correct: 0 },
  ],
  quiz_uz_8_hard: [
    { text: "Shaybaniylar davri Movarounnahrga qaysi o'zgarishni keltirdi?", options: ["O'zbek sulolalari hukmronligining shakllanishi", "Yevropa ittifoqiga kirish", "Faqat dengiz savdosining rivoji", "Yozuvning yo'qolishi"], correct: 0 },
    { text: "Ashtarkhoniylar sulolasi qayerdan kelgan nomni olgan?", options: ["Astraxan", "Amsterdam", "Astana", "Athen"], correct: 0 },
    { text: "XVIII asrning birinchi yarmida Buxoro xonligi qaysi og'ir holatda bo'lgan?", options: ["Ichki nizolar va tabiiy ofatlar", "Faqat iqtisodiy boylik", "Faqat madaniy yuqorilash", "Tinchlik va barqarorlik"], correct: 0 },
    { text: "Qo'qon xonligi qaysi vodiyda joylashgan edi?", options: ["Farg'ona vodiysida", "Toshkentda", "Samarqandda", "Xorezmda"], correct: 0 },
    { text: "Mang'it sulolasi oxirgi xoni kim bo'lgan (Buxoro)?", options: ["Olimxon", "Genghis Khan", "Napoleon", "Shaybaniy"], correct: 0 },
  ],
  quiz_uz_9_easy: [
    { text: "XIX asrda Turkiston qaysi davlat tomonidan bosib olingan?", options: ["Rossiya imperiyasi", "Britaniya", "Fransiya", "Xitoy"], correct: 0 },
    { text: "Turkiston general-gubernatorligi qachon tashkil etilgan?", options: ["1867-yil", "1789-yil", "1917-yil", "1991-yil"], correct: 0 },
    { text: "XIX asrda O'zbekiston hududidagi xonliklar qaysi edi?", options: ["Buxoro, Xiva, Qo'qon", "Paris, London, Berlin", "Osmonli, Rus, Prusiya", "Xitoy, Yaponiya, Koreya"], correct: 0 },
    { text: "Toshkent qachon Rossiya imperiyasiga qo'shib olindi?", options: ["1865-yil", "1867-yil", "1873-yil", "1885-yil"], correct: 0 },
    { text: "XIX asr oxirida Turkistonda qaysi qishloq xo'jaligi sohasi tez rivojlandi?", options: ["Paxtachilik", "Kosmonavtika", "Ijtimoiy tarmoqlar", "Aviatsiya"], correct: 0 },
  ],
  quiz_uz_9_middle: [
    { text: "Turkiston general-gubernatorligining markazi qaysi shahar bo'lgan?", options: ["Toshkent", "Buxoro", "Samarqand", "Kokand"], correct: 0 },
    { text: "Dukchi Eshon boshchiligida qayta qo'zg'olon qachon bo'lgan?", options: ["1898-yil (Andijon)", "1805-yil", "1905-yil", "1917-yil"], correct: 0 },
    { text: "XIX asr oxirida Turkistonda qaysi demokratik yo'nalish shakllana boshladi?", options: ["Jadidchilik", "Renessans", "Reformatsiya", "Investitsiya"], correct: 0 },
    { text: "Jadidchilik harakati nima maqsad qilgan?", options: ["Yangi usul maktablari va ma'rifat", "Harbiy fathlar", "Dengiz savdosi", "Faqat qishloq xo'jaligi"], correct: 0 },
    { text: "Behbudi va Cho'lpon qanday yo'nalishdagi ijodkorlar?", options: ["Jadid (ma'rifatparvar)", "Harbiy", "Rus allomalari", "Sportni hisobotlovchilar"], correct: 0 },
  ],
  quiz_uz_9_hard: [
    { text: "Turkiston general-gubernatorligi qaysi ahamiyatga ega bo'lgan?", options: ["Rossiya imperiyasining Janubiy Osiyo yo'nalishi", "Faqat Atlantika savdosi", "Faqat Fan bo'limi", "Faqat sport"], correct: 0 },
    { text: "Jizzax qo'zg'oloni qachon bo'lgan?", options: ["1905-yil", "1805-yil", "1898-yil", "1917-yil"], correct: 0 },
    { text: "1898-yil Andijon qo'zg'oloni kimi boshchiligida bo'lgan?", options: ["Dukchi Eshon", "Behbudi", "Cho'lpon", "Olimxon"], correct: 0 },
    { text: "XIX asr oxirida Turkistonda qanday yirik transport yo'li qurilgan?", options: ["Temir yo'l (Zaxaral temir yo'li)", "Metro", "Magistral avtomobil yo'llari", "Faqat suv yo'llari"], correct: 0 },
    { text: "Jadidchilikda 'yangi usul' deganda nima tushunilgan?", options: ["Yangi metodik maktablar", "Harbiy metodlar", "Dengiz metodlari", "Qishloq metodlari"], correct: 0 },
  ],
  quiz_uz_10_easy: [
    { text: "O'zbekiston qachon mustaqillikka erishdi?", options: ["1991-yil 31-avgust", "1990-yil 1-may", "1989-yil", "2001-yil"], correct: 0 },
    { text: "O'zbekistonning birinchi Prezidenti kim?", options: ["Islom Karimov", "Shavkat Mirziyoyev", "Abdulla Qodiriy", "Ulug'bek"], correct: 0 },
    { text: "O'zbekistonning davlat bayrog'i qachon qabul qilingan?", options: ["1991-yil 18-noyabr", "1992-yil", "1989-yil", "2001-yil"], correct: 0 },
    { text: "O'zbekistonning milliy pul birligi qanday?", options: ["So'm", "Rubl", "Dollar", "Dinor"], correct: 0 },
    { text: "O'zbekiston Konstitutsiyasi qachon qabul qilingan?", options: ["1992-yil 8-dekabr", "1990-yil", "1989-yil", "2001-yil"], correct: 0 },
  ],
  quiz_uz_10_middle: [
    { text: "1917-yilda Turkistonda qanday siyosiy voqea bo'lgan?", options: ["Oktyabr to'ntarishi", "Renessans", "Buyuk geografik kashfiyotlar", "Reformatsiya"], correct: 0 },
    { text: "Turkiston Muhtoriyati (Kokand muxtoriyati) rahbari kim bo'lgan?", options: ["Mustafo Sho'qoyev", "Napoleon", "Shaybaniy", "Ulug'bek"], correct: 0 },
    { text: "1924-yilda O'zbekiston SSR qachon tashkil topgan?", options: ["1924-yil", "1917-yil", "1989-yil", "1991-yil"], correct: 0 },
    { text: "1966-yilda Toshkentda qanday tabiiy ofat bo'lgan?", options: ["Zilzila", "Suv toshqini", "Volqon", "Qurg'oqchilik"], correct: 0 },
    { text: "Mustaqillik kuni qaysi sanada nishonlanadi?", options: ["1-sentabr", "31-avgust", "8-dekabr", "18-noyabr"], correct: 0 },
  ],
  quiz_uz_10_hard: [
    { text: "Turkiston Avtonom Sovet Sotsialistik Respublikasi (TASSR) qachon tashkil etilgan?", options: ["1918-yil", "1924-yil", "1898-yil", "1991-yil"], correct: 0 },
    { text: "1916-yilgi qo'zg'olon asosan qaysi sababdan ko'tarilgan?", options: ["Urush rejimi odamlarni mehnat frontiga jalb qilish farmoniga qarshi", "Faqat soliq", "Faqat diniy", "Faqat iqtisodiy"], correct: 0 },
    { text: "Turkiston Mustaqil Avtonom Respublikasi (Turkiston Muhtoriyati) qachon og'ir taqiqga uchragan?", options: ["1918-yil (Fevral)", "1924-yil", "1898-yil", "1991-yil"], correct: 0 },
    { text: "O'zbekiston SSR tashkil etilishining natijasida nima o'zgargan?", options: ["Milliy-hududiy chegara belgilangan", "Faqat til o'zgardi", "Faqat pul birligi", "Hech narsa"], correct: 0 },
    { text: "Mustaqillikning dastlabki yillarida qaysi soha reformasi bilan boshlandi?", options: ["Iqtisodiy islohotlar va milliy pul", "Faqat sport", "Faqat kosmik", "Faqat dengiz savdosi"], correct: 0 },
  ],
  quiz_uz_11_easy: [
    { text: "O'zbekiston davlat bayrog'ining yuqori qismida qanday rang bor?", options: ["Ko'k", "Yashil", "Qizil", "Oq"], correct: 0 },
    { text: "O'zbekiston gerbining markazida nima tasvirlangan?", options: ["Humo qushi va paxta-sholi", "Burgut", "Sher", "Arslon qanoti"], correct: 0 },
    { text: "O'zbekiston davlat madhiyasi muallifi kimi?", options: ["Abdulla Aripov", "Abdulla Qodiriy", "Bobur", "Navoiy"], correct: 0 },
    { text: "Mustaqillikning qaysi yilida O'zbekiston BMTga a'zo bo'ldi?", options: ["1992-yil", "1991-yil", "1996-yil", "2000-yil"], correct: 0 },
    { text: "Mustaqil O'zbekistonning birinchi Konstitutsiyasi qaysi yil qabul qilingan?", options: ["1992-yil", "1991-yil", "1995-yil", "2000-yil"], correct: 0 },
  ],
  quiz_uz_11_middle: [
    { text: "Mustaqillik yillarida O'zbekistonda qaysi yirik iqtisodiy islohot boshlangan?", options: ["Bozor munosabatlari va xususiy mulk", "Faqat kollektiv ferma", "Faqat mudofaa", "Faqat turizm"], correct: 0 },
    { text: "O'zbekistonning 2017-yildagi asosiy valyuta islohoti nimani ifodalaydi?", options: ["So'm kursining erkinlashtirilishi", "Rublga o'tish", "Ikkita valyuta", "Valyutasizlik"], correct: 0 },
    { text: "Mustaqillik davrida qaysi tarixiy obidalar ta'mirlangan?", options: ["Registon, Bibixonim majmuasi", "Big Ben", "Eyfel minorasi", "Kolizey"], correct: 0 },
    { text: "O'zbekistonda qaysi yilida prezidentlik instituti ta'sis etilgan?", options: ["1991-yil", "1989-yil", "2001-yil", "2010-yil"], correct: 0 },
    { text: "Mustaqillik davrida qaysi ilmiy muassasa qayta faollashgan?", options: ["O'zbekiston Fanlar akademiyasi", "Nobel qo'mitasi", "MIT", "Oksford"], correct: 0 },
  ],
  quiz_uz_11_hard: [
    { text: "Mustaqillikning dastlabki yillarida qaysi hujjatlar davlat konstitutsiyaviy asosi bo'lgan?", options: ["Konstitutsiya (1992) va mustaqillik deklaratsiyasi", "Faqat prezident farmonlari", "Faqat mahalliy qonunlar", "Hech qanday hujjat"], correct: 0 },
    { text: "O'zbekistonning tashqi siyosatidagi asosiy tamoyil qaysi?", options: ["Doimiy neytralitet va hamkorlik", "Faqat ittifoq", "Faqat izolyatsiya", "Faqat harbiy blok"], correct: 0 },
    { text: "Mustaqillik yillarida qaysi dastur qishloq xo'jaligini o'zgartirdi?", options: ["Fermer va dehqon xo'jaliklarini rivojlantirish", "Faqat savdo", "Faqat turizm", "Faqat boshliq ma'lumoti"], correct: 0 },
    { text: "O'zbekistonda o'qitish tili sohasida qanday islohotlar amalga oshirilgan?", options: ["Milliy tillarga asoslangan ta'lim", "Faqat chet tili", "Faqat rus tili", "Ta'lim o'zgartirilmagan"], correct: 0 },
    { text: "Mustaqil O'zbekistonning xalqaro tashkilotlar bilan hamkorligi qaysi yo'nalishda?", options: ["BMT, O'HT va boshqalar bilan keng hamkorlik", "Faqat BMT", "Faqat Yevropa", "Hech qanday tashkilot bilan emas"], correct: 0 },
  ],
};

const EX_JAHON_TARIXI: Record<string, Q2[]> = {
  quiz_jahon_7_easy: [
    { text: "Qadimgi Misr piramidalarining eng mashhuri qaysi?", options: ["Xeops (Buyuk) piramidasi", "Big Ben", "Eyfel minorasi", "Kolizey"], correct: 0 },
    { text: "Qadimgi yozuvning ilk turlaridan biri qanday nomlangan?", options: ["Mixxat yozuvi", "Kompyuter yozuvi", "Matbaa", "Telegraf"], correct: 0 },
    { text: "Antik davrning mashhur olimi kimsa?", options: ["Arximed", "Edison", "Newton", "Kurort"], correct: 0 },
    { text: "Qadimgi Rim poytaxti qaysi shahar?", options: ["Rim", "Paris", "London", "Moskva"], correct: 0 },
    { text: "Buyuk ipak yo'li qaysi qit'alarni bog'lagan?", options: ["Osiyo va Yevropa", "Antarktida va Afrika", "Amerika va Okeaniya", "Faqat Osiyo"], correct: 0 },
  ],
  quiz_jahon_7_middle: [
    { text: "Mixxat yozuvi qaysi tsivilizatsiyada paydo bo'lgan?", options: ["Shumer (Mesopotamiya)", "Rim", "Yunoniston", "Rus"], correct: 0 },
    { text: "Antik Yunonistonda Olimpiya o'yinlari qaysi shahar sharafiga o'tkazilgan?", options: ["Olimpiya", "Sparta", "Afina", "Korinf"], correct: 0 },
    { text: "Buyuk ipak yo'li asosan qanday mahsulot savdosi bilan mashhur edi?", options: ["Ipak", "Neft", "Kofe", "Muzlatilgan ovqat"], correct: 0 },
    { text: "Piramidalar qaysi davrda qurilgan?", options: ["Qadimgi Misrda", "O'rta asrlarda", "XX asrda", "Yangi davrda"], correct: 0 },
    { text: "Qadimgi yunonlarning mashhur faylasufi kimsa?", options: ["Aristotel", "Pushkin", "Lomonosov", "Navoiy"], correct: 0 },
  ],
  quiz_jahon_7_hard: [
    { text: "Buyuk ipak yo'li yuksalish davrida qaysi shaharlar asosiy chorraha bo'lgan?", options: ["Samarqand, Buxoro, Kushoniya shaharlari", "Paris va London", "New York va Boston", "Rim va Afina"], correct: 0 },
    { text: "Shumer tsivilizatsiyasi qaysi daryo o'rtasida vujudga kelgan?", options: ["Dajla va Furot", "Nil", "Amudaryo", "Volga"], correct: 0 },
    { text: "Qadimgi Misrda ierarxiya boshida kim turgan?", options: ["Faraon", "Podsho", "Prezident", "Konsul"], correct: 0 },
    { text: "Antik davrda faylasuflar maktablaridan qaysi biri mashhur?", options: ["Stoitsizm", "Marsizm", "Postmodernizm", "Futurizm"], correct: 0 },
    { text: "Buyuk ipak yo'li qanday ta'sir ko'rsatgan?", options: ["Madaniyat va savdo almashinuvi", "Faqat harbiy", "Faqat diniy", "Hech qanday"], correct: 0 },
  ],
  quiz_jahon_8_easy: [
    { text: "Buyuk geografik kashfiyotlar davri qaysi asrga to'g'ri keladi?", options: ["XV–XVII asrlar", "X asr", "XIX asr", "XX asr"], correct: 0 },
    { text: "Amerikani kim kashf etgan (1492)?", options: ["Xristofor Kolumb", "Magellan", "Kuk", "Livingston"], correct: 0 },
    { text: "Matbaani kim yaratgan?", options: ["Iogann Gutenberg", "Edison", "Bell", "Ford"], correct: 0 },
    { text: "Renessans (Uyg'onish davri) qaysi mamlakatdan boshlangan?", options: ["Italiyadan", "Rossiyadan", "Xitoydan", "Braziliyadan"], correct: 0 },
    { text: "Mashhur rassom Leonardo da Vinchi qaysi davrda yashagan?", options: ["Renessans davrida", "Antik davrda", "XX asrda", "O'rta asrlarda"], correct: 0 },
  ],
  quiz_jahon_8_middle: [
    { text: "Magellan ekspeditsiyasi nima bilan mashhur?", options: ["Birinchi jahon aylanish sayohati", "Amerikani kashf etish", "Antarktidani kashf etish", "Osiyoni zabt etish"], correct: 0 },
    { text: "Renessans davri qaysi sohalarda yuksalish keltirgan?", options: ["San'at, ilm va adabiyot", "Faqat harbiy", "Faqat qishloq", "Faqat sport"], correct: 0 },
    { text: "'Mona Liza' kartinasining muallifi kim?", options: ["Leonardo da Vinchi", "Rembrandt", "Van Gogh", "Pikasso"], correct: 0 },
    { text: "Reformatsiya harakati kim boshchiligida boshlangan?", options: ["Martin Lyuter", "Kolumb", "Napoleon", "Calvin"], correct: 0 },
    { text: "Buyuk geografik kashfiyotlar natijasida nima o'zgardi?", options: ["Jahon xaritasi kengaydi, savdo yo'llari o'zgardi", "Faqat ta'lim", "Faqat sport", "Hech narsa"], correct: 0 },
  ],
  quiz_jahon_8_hard: [
    { text: "Renessans davrining bosh g'oyasi qanday nomlanadi?", options: ["Antroposentrizm (odam markazda)", "Teosentrizm", "Geosentrizm", "Geliosentrizm"], correct: 0 },
    { text: "Buyuk geografik kashfiyotlar sabablaridan biri qaysi?", options: ["Sharq mahsulotlariga savdo talabi", "Faqat sayohat qiziqishi", "Faqat sport", "Faqat san'at"], correct: 0 },
    { text: "Reformatsiya qaysi ta'limotga qarshi chiqqan edi?", options: ["Katolik cherkovining ayrim xususiyatlariga", "Faqat maktab ta'limiga", "Faqat harbiy", "Faqat savdo"], correct: 0 },
    { text: "Leonardo da Vinchi qaysi sohalarda ham ijod qilgan?", options: ["San'at, anatomiya, injeneriya", "Faqat rasm", "Faqat musiqa", "Faqat poezia"], correct: 0 },
    { text: "O'rta asr Yevropasida universitetlar qaysi shaharlarda ochilgan?", options: ["Bolognya, Paris, Oksford", "Toshkent, Buxoro", "Tokio, Pekin", "Delhi, Kalkutta"], correct: 0 },
  ],
  quiz_jahon_9_easy: [
    { text: "Fransiyada buyuk inqilob qachon boshlangan?", options: ["1789-yil", "1689-yil", "1889-yil", "1749-yil"], correct: 0 },
    { text: "Amerika Qo'shma Shtatlari qachon mustaqillik e'lon qilgan?", options: ["1776-yil", "1789-yil", "1812-yil", "1861-yil"], correct: 0 },
    { text: "Parovoz ixtirosi qaysi sanoat inqilobi bilan bog'liq?", options: ["Birinchi sanoat inqilobi", "Ikkinchi jahon urushi", "Rekognizitsiya", "Renessans"], correct: 0 },
    { text: "Napoleon qaysi davlat hukmdori edi?", options: ["Fransiya", "Angliya", "Rossiya", "Prusiya"], correct: 0 },
    { text: "Sanoat inqilobi birinchi bo'lib qaysi davlatda boshlangan?", options: ["Angliyada", "Fransiyada", "Rossiyada", "Yaponiyada"], correct: 0 },
  ],
  quiz_jahon_9_middle: [
    { text: "Waterloo jangi qachon bo'lgan va kimga maglubiyat keltirgan?", options: ["1815-yil — Napoleon", "1805-yil — Nelson", "1870-yil — Bismark", "1914-yil — Vilgelma"], correct: 0 },
    { text: "Amerika fuqarolar urushi qaysi yillar oralig'ida bo'lgan?", options: ["1861–1865", "1776–1783", "1914–1918", "1939–1945"], correct: 0 },
    { text: "Ikkinchi sanoat inqilobida qaysi soha yetakchi bo'lgan?", options: ["Elektr va metallurgiya", "Faqat qishloq", "Faqat yozuv", "Faqat harbiy"], correct: 0 },
    { text: "1789-yilgi Fransiyada inqilob qaysi maqsad bilan boshlangan?", options: ["Absolyutizmga qarshi, ozodlik va tenglik", "Faqat soliq kamayishi", "Faqat sport", "Faqat din"], correct: 0 },
    { text: "O'sha davrda qaysi yirik davlatning qo'shini 'buyuk armiya' nomi bilan mashhur edi?", options: ["Fransiya (Napoleon armiyasi)", "Angliya", "Rossiya", "Yaponiya"], correct: 0 },
  ],
  quiz_jahon_9_hard: [
    { text: "Sanoat inqilobining asosiy ijtimoiy natijasi qaysi?", options: ["Ishchilar sinfi (proletariat) shakllanishi", "Faqat malikatlar ko'payishi", "Faqat din o'zgarishi", "Faqat til o'zgarishi"], correct: 0 },
    { text: "Amerika mustaqillik deklaratsiyasi muallifi kimsa?", options: ["Tomas Jefferson", "Jorj Vashington", "Abraham Linkoln", "Franklin"], correct: 0 },
    { text: "Fransiyada inqilobning mashhur shiori qaysi?", options: ["Ozodlik, tenglik, birodarlik", "Din, podsho, mamlakat", "Ish, tinchlik, non", "Birlik, irmat, ovqat"], correct: 0 },
    { text: "Angliyada sanoat inqilobi qaysi tarmoqdan boshlandi?", options: ["To'qimachilikdan", "Neftdan", "Kosmosdan", "Elektronikadan"], correct: 0 },
    { text: "XIX asr o'rtalarida qaysi yirik temir yo'l transkontinental yo'nalishda qurilgan (AQSH)?", options: ["Transkontinental temir yo'l", "Transsibir yo'li", "Bagdod yo'li", "Sibir yo'li"], correct: 0 },
  ],
  quiz_jahon_10_easy: [
    { text: "Birinchi jahon urushi qachon boshlangan?", options: ["1914-yil", "1939-yil", "1905-yil", "1917-yil"], correct: 0 },
    { text: "Oktyabr inqilobi qaysi davlatda bo'lgan?", options: ["Rossiyada", "Fransiyada", "Germaniyada", "Angliyada"], correct: 0 },
    { text: "Birinchi jahon urushi qachon tugagan?", options: ["1918-yil", "1914-yil", "1923-yil", "1939-yil"], correct: 0 },
    { text: "Ikkinchi jahon urushi qachon boshlangan?", options: ["1939-yil 1-sentabr", "1914-yil", "1941-yil", "1945-yil"], correct: 0 },
    { text: "BMT qachon ta'sis etilgan?", options: ["1945-yil", "1918-yil", "1939-yil", "1991-yil"], correct: 0 },
  ],
  quiz_jahon_10_middle: [
    { text: "Versal shartnomasi qachon imzolangan?", options: ["1919-yil", "1918-yil", "1929-yil", "1939-yil"], correct: 0 },
    { text: "Ikkinchi jahon urushi qachon tugagan?", options: ["1945-yil", "1939-yil", "1953-yil", "1941-yil"], correct: 0 },
    { text: "1929-yildagi Buyuk depressiya qaysi davlatni kuchli ta'sir qilgan?", options: ["AQSh", "Xitoy", "Yaponiya", "Hindiston"], correct: 0 },
    { text: "Birinchi jahon urushida qaysi qurilmalar birinchi marta keng ishlatilgan?", options: ["Tank va samolyot", "Faqat ot aravalar", "Faqat qilich", "Faqat kamon"], correct: 0 },
    { text: "SSSR qachon ta'sis etilgan?", options: ["1922-yil", "1917-yil", "1939-yil", "1953-yil"], correct: 0 },
  ],
  quiz_jahon_10_hard: [
    { text: "Birinchi jahon urushining asosiy sabablari qaysilar?", options: ["Imperialistik davlatlar o'rtasidagi ziddiyatlar", "Faqat sport musobaqalari", "Faqat madaniy almashinuvi", "Faqat ilmiy"], correct: 0 },
    { text: "Oktyabr inqilobining rahbari kim edi?", options: ["V. Lenin", "M. Gorbachev", "P. Stolypin", "A. Kerenskiy"], correct: 0 },
    { text: "Yalta konferensiyasi (1945) qaysi davlatlar rahbarlari o'rtasida bo'lgan?", options: ["SSSR, AQSH, Buyuk Britaniya", "Germaniya, Italiya, Yaponiya", "Fransiya, Xitoy, Kanada", "Turkiya, Misr, Hindiston"], correct: 0 },
    { text: "BMTning eng yirik organi qaysi?", options: ["Bosh Assambleya", "Xavfsizlik Kengashi", "YXAO", "Sud"], correct: 0 },
    { text: "Ikkinchi jahon urushida faol harbiy harakatlarning asosiy teatri qaysi?", options: ["Yevropa, Afrika va Tinch okeani", "Faqat Antarktida", "Faqat Okeaniya", "Faqat Janubiy Amerika"], correct: 0 },
  ],
  quiz_jahon_11_easy: [
    { text: "Berlin devori qachon buzilgan?", options: ["1989-yil", "1961-yil", "1975-yil", "1991-yil"], correct: 0 },
    { text: "SSSR qachon tarqagan?", options: ["1991-yil", "1989-yil", "1985-yil", "1995-yil"], correct: 0 },
    { text: "Jahon savdo tashkiloti (JSHT) qachon tashkil etilgan?", options: ["1995-yil", "1945-yil", "1989-yil", "2001-yil"], correct: 0 },
    { text: "'Sovuq urush' atamasining asosiy qatnashchilari kimlar edi?", options: ["AQSh va SSSR", "Angliya va Fransiya", "Xitoy va Yaponiya", "Hindiston va Pokiston"], correct: 0 },
    { text: "Internetning ommaviy rivoji qaysi davrga to'g'ri keladi?", options: ["1990-yillar", "1960-yillar", "2020-yillar", "1940-yillar"], correct: 0 },
  ],
  quiz_jahon_11_middle: [
    { text: "Jahon savdo markazlari (WTO) tashkil etilishining maqsadi qaysi?", options: ["Savdo qoidalarini tartiblash", "Harbiy blok", "Sport musobaqalari", "Madaniyat festivali"], correct: 0 },
    { text: "Kubada raketa krizisi (1962) qaysi davlatlar o'rtasida bo'lgan?", options: ["AQSh va SSSR", "Angliya va Fransiya", "Xitoy va Yaponiya", "Indiya va Pokiston"], correct: 0 },
    { text: "Yevropa Ittifoqi (EI) qachon rasman tashkil etilgan?", options: ["1993-yil (Maastricht shartnomasi)", "1945-yil", "1975-yil", "2001-yil"], correct: 0 },
    { text: "XXI asrda qaysi yirik terror hujumiga qarshi xalqaro koalitsiya tashkil etilgan?", options: ["2001-yil 11-sentabrdan keyin", "1989-yildan keyin", "1945-yildan keyin", "1991-yildan keyin"], correct: 0 },
    { text: "'Sovuq urush' qachon rasman tugagan?", options: ["1989–1991-yillar oralig'ida", "1962-yilda", "1975-yilda", "2001-yilda"], correct: 0 },
  ],
  quiz_jahon_11_hard: [
    { text: "Sovuq urush davrida qaysi siyosiy doktrina AQSh tomonidan e'lon qilingan?", options: ["Trumen doktrinasi", "Marksizm", "Leninizm", "Maoizm"], correct: 0 },
    { text: "Yevropada nizolarni kamaytirish uchun qaysi tashkilot tashkil etilgan?", options: ["OSCE (Xavfsizlik va hamkorlik tashkiloti)", "NATO", "WTO", "OPEC"], correct: 0 },
    { text: "Berlindagi devor qaysi ikki blokni ajratib turgan?", options: ["G'arbiy (kapitalistik) va Sharqiy (sotsialistik) bloklar", "Shimol va Janub", "Afrika va Osiyo", "Antarktida va Okeaniya"], correct: 0 },
    { text: "1991-yildan keyin qaysi xalqaro tashkilot yangi jahon tartibining asosi bo'ldi?", options: ["BMT va uning tizimi", "Warsava pakti", "Comecon", "Komintern"], correct: 0 },
    { text: "Globalizatsiya nimani anglatadi?", options: ["Jahon iqtisodiyoti va madaniyatining birlashuvi", "Faqat izolyatsiya", "Faqat harbiy ittifoq", "Faqat sport"], correct: 0 },
  ],
};

const EX_INGLIZ: Record<string, Q2[]> = {
  quiz_cefr_a1: [
    { text: "I ___ a student. (to be)", options: ["am", "is", "are", "be"], correct: 0 },
    { text: "Choose the correct plural: 'book' →", options: ["books", "bookes", "bookies", "book"], correct: 0 },
    { text: "___ is your name? — My name is Ali.", options: ["What", "Where", "When", "Why"], correct: 0 },
    { text: "She ___ from Tashkent.", options: ["is", "are", "am", "be"], correct: 0 },
    { text: "Choose the correct article: ___ apple", options: ["an", "a", "the an", "—"], correct: 0 },
  ],
  quiz_cefr_a2: [
    { text: "They ___ football now. (play)", options: ["are playing", "plays", "played", "will play"], correct: 0 },
    { text: "I ___ to school yesterday. (go)", options: ["went", "go", "goes", "going"], correct: 0 },
    { text: "The cat is ___ the table. (under)", options: ["under", "under of", "under to", "underly"], correct: 0 },
    { text: "There ___ many books on the shelf.", options: ["are", "is", "was", "be"], correct: 0 },
    { text: "Choose the correct question: ___ you like tea?", options: ["Do", "Does", "Are", "Is"], correct: 0 },
  ],
  quiz_cefr_b1: [
    { text: "I have ___ my homework. (finish)", options: ["finished", "finish", "finishing", "finishes"], correct: 0 },
    { text: "This book is ___ than that one.", options: ["more interesting", "interestinger", "most interesting", "interesting"], correct: 0 },
    { text: "If it rains, we ___ stay at home.", options: ["will", "would", "will be", "would be"], correct: 0 },
    { text: "She has lived here ___ 2015.", options: ["since", "for", "from", "during"], correct: 0 },
    { text: "I'm used to ___ up early.", options: ["getting", "get", "got", "gets"], correct: 0 },
  ],
  quiz_cefr_b2: [
    { text: "The report ___ by the manager yesterday. (write)", options: ["was written", "wrote", "is writing", "writes"], correct: 0 },
    { text: "He said he ___ come the next day.", options: ["would", "will", "shall", "is"], correct: 0 },
    { text: "If I ___ you, I would apologise.", options: ["were", "am", "was being", "be"], correct: 0 },
    { text: "The meeting was put ___ until Friday.", options: ["off", "on", "up", "in"], correct: 0 },
    { text: "She ___ to have finished the project by now.", options: ["is supposed", "supposes", "supposed", "supposing"], correct: 0 },
  ],
  quiz_ielts_easy: [
    { text: "Choose the best linker: I was tired; ___, I finished the work.", options: ["however", "because", "so that", "in case"], correct: 0 },
    { text: "The graph shows a sharp ___ in sales.", options: ["increase", "increasingly", "increased", "increase of"], correct: 0 },
    { text: "Choose the correct collocation: ___ a decision", options: ["make", "do", "take up", "put"], correct: 0 },
    { text: "'Nowadays' is closest in meaning to:", options: ["currently", "in the past", "later", "before"], correct: 0 },
    { text: "The line remained ___ (no change) over the period.", options: ["stable", "stability", "stabilise", "stably"], correct: 0 },
  ],
  quiz_ielts_middle: [
    { text: "Choose the formal alternative: 'get better'", options: ["improve", "get well soon", "be up", "rise up"], correct: 0 },
    { text: "The number of visitors ___ significantly between 2000 and 2010.", options: ["rose", "rose up to", "raised to", "arose"], correct: 0 },
    { text: "Choose the best linker: ___ the bad weather, the flight left on time.", options: ["Despite", "Although", "However", "Because"], correct: 0 },
    { text: "'A dramatic fall' describes a change that is:", options: ["sudden and large", "slow and small", "steady", "unchanged"], correct: 0 },
    { text: "Choose the correct collocation: ___ research", options: ["conduct", "make", "do up", "put"], correct: 0 },
  ],
  quiz_ielts_hard: [
    { text: "The data ___ that the trend accelerated after 2015.", options: ["indicates", "indicate about", "indicating to", "is indicate"], correct: 0 },
    { text: "Choose the best linker for a conclusion: ___, the advantages outweigh the drawbacks.", options: ["On balance", "In spite", "However it", "Despite of"], correct: 0 },
    { text: "'A marginal decline' means the fall was:", options: ["very small", "very large", "sudden", "nonexistent"], correct: 0 },
    { text: "The survey ___ 500 respondents across five cities.", options: ["covered", "covered to", "was covered by 500 to", "covering"], correct: 0 },
    { text: "Choose the most academic phrasing:", options: ["The findings suggest that...", "We think maybe that...", "It's like obvious that...", "You can see everyone knows..."], correct: 0 },
  ],
  quiz_vhard_1: [
    { text: "'Aplomb' is ___", options: ["self-confidence under pressure", "a type of fruit", "a school subject", "a dance step"], correct: 0 },
    { text: "'To equivocate' means to ___", options: ["speak vaguely to avoid commitment", "translate line by line", "argue very loudly", "apologize formally"], correct: 0 },
    { text: "'Intransigent' opponents ___", options: ["refuse any compromise", "change opinion often", "speak with an accent", "attend every meeting"], correct: 0 },
    { text: "'Garrulous' people talk ___", options: ["too much about trivial things", "only when asked", "in a whisper", "with perfect logic"], correct: 0 },
    { text: "'To extol' is to ___", options: ["praise highly", "criticize harshly", "steal quietly", "copy exactly"], correct: 0 },
    { text: "'Nefarious' deeds are ___", options: ["wicked", "brilliant", "necessary", "ordinary"], correct: 0 },
    { text: "'Affable' people are ___", options: ["friendly and easy to talk to", "impossible to please", "always late", "physically strong"], correct: 0 },
    { text: "'Cacophony' means ___", options: ["a harsh mix of sounds", "a quiet melody", "a type of poem", "a deep sleep"], correct: 0 },
    { text: "'To espouse' a view is to ___", options: ["adopt and support it", "mock it publicly", "forget it quickly", "sell it for profit"], correct: 0 },
    { text: "'Penurious' describes someone who is ___", options: ["extremely poor", "very generous", "always hungry", "deeply religious"], correct: 0 },
    { text: "'Soporific' talks make you ___", options: ["sleepy", "angry", "hungry", "cheerful"], correct: 0 },
    { text: "'To vituperate' is to ___", options: ["abuse with harsh words", "vote silently", "travel widely", "heal wounds"], correct: 0 },
    { text: "'Magnanimous' winners are ___", options: ["generous towards the defeated", "silent in victory", "addicted to fame", "afraid of losing"], correct: 0 },
    { text: "'Perspicuity' in writing means ___", options: ["clarity", "great length", "dark humour", "rare vocabulary"], correct: 0 },
    { text: "'Furtive' glances are ___", options: ["secretive", "friendly", "blinding", "regular"], correct: 0 },
    { text: "'To expiate' guilt is to ___", options: ["atone for it", "hide it from others", "laugh about it", "double it"], correct: 0 },
    { text: "'Vociferous' protests are ___", options: ["loud and forceful", "peaceful and quiet", "written in secret", "short-lived"], correct: 0 },
    { text: "'Ersatz' products are ___", options: ["poor imitations", "handmade", "top quality", "illegal exports"], correct: 0 },
  ],
  quiz_vhard_2: [
    { text: "Under no circumstances ___ the password to anyone.", options: ["should you reveal", "you should reveal", "you reveal should", "reveals you"], correct: 0 },
    { text: "So convincing ___ that everyone believed him.", options: ["was his story", "his story was", "his story were", "were his story"], correct: 0 },
    { text: "Only after the audit ___ the missing funds.", options: ["did they discover", "they discovered", "they did discover", "discovered they"], correct: 0 },
    { text: "I would rather you ___ nothing about this for now.", options: ["said", "say", "will say", "have said"], correct: 0 },
    { text: "It's imperative that every report ___ before Friday.", options: ["be submitted", "is submitted", "will submit", "submits"], correct: 0 },
    { text: "The professor recommended that each student ___ an original topic.", options: ["choose", "chooses", "chose", "choosing"], correct: 0 },
    { text: "No sooner had the auction started ___ bidding wars broke out.", options: ["than", "when", "then", "that"], correct: 0 },
    { text: "Rarely ___ a debut novel receive such acclaim.", options: ["does", "is", "do", "has been"], correct: 0 },
    { text: "___ from finishing the report, she also drafted the press release.", options: ["Far", "Instead", "Rather", "Apart of"], correct: 0 },
    { text: "He's the sort of manager ___ praises you to your face and complains behind your back.", options: ["who", "whom", "which", "whose"], correct: 0 },
    { text: "The results, ___ by two independent labs, were published today.", options: ["confirmed", "confirming", "were confirmed", "which confirmed by"], correct: 0 },
    { text: "Hardly ___ the verdict when the crowd erupted.", options: ["had the judge announced", "the judge had announced", "did the judge announced", "the judge announced"], correct: 0 },
    { text: "Were the minister ___ tomorrow, negotiations would resume at once.", options: ["to resign", "resigning", "resigned", "to be resigned by"], correct: 0 },
    { text: "The list of items ___ on the notice board.", options: ["was posted", "were posted", "have posted", "are posting"], correct: 0 },
    { text: "Neither the players nor the coach ___ available for comment.", options: ["was", "were", "have", "are being"], correct: 0 },
    { text: "This time tomorrow, the team ___ the final presentation.", options: ["will be rehearsing", "rehearses", "will have rehearse", "rehearsed"], correct: 0 },
    { text: "The proposal was rejected, ___ surprised nobody.", options: ["which", "that", "what", "who"], correct: 0 },
    { text: "Not until the third attempt ___ the summit.", options: ["did they reach", "they reached", "they did reach", "reached they"], correct: 0 },
  ],
  quiz_listening_easy: [
    {
      text: "What time does the library open on Saturday?",
      audio: "Good morning! This is a message from the city library. On Saturday, we open at nine in the morning and close at six in the evening. Welcome!",
      options: ["At 9 a.m.", "At 6 a.m.", "At 10 a.m.", "At 12 p.m."], correct: 0,
    },
    {
      text: "What is the weather like tomorrow?",
      audio: "Here is tomorrow's forecast: sunny in the morning, but cloudy with light rain in the afternoon. Take an umbrella!",
      options: ["Rainy in the afternoon", "Snowy all day", "Sunny all day", "Windy at night"], correct: 0,
    },
    {
      text: "How much does the ticket cost?",
      audio: "A single ticket costs five dollars, and a return ticket costs eight dollars. Children travel for half price.",
      options: ["5 dollars", "8 dollars", "3 dollars", "10 dollars"], correct: 0,
    },
    {
      text: "Where does Sarah work?",
      audio: "Sarah is a nurse. She works at the central hospital near the park. She starts work at seven o'clock.",
      options: ["At the hospital", "At the school", "At the bank", "At the shop"], correct: 0,
    },
    {
      text: "What does Tom want to buy?",
      audio: "Tom is going to the market. He wants to buy bread, milk and some apples. He forgot to take his bag.",
      options: ["Bread and milk", "Only apples", "Meat and rice", "Tea and sugar"], correct: 0,
    },
  ],
  quiz_listening_middle: [
    {
      text: "Why will the meeting be moved to Thursday?",
      audio: "Attention please. Due to a staff training session, Wednesday's meeting has been moved to Thursday at the same time, three o'clock. Thank you for your understanding.",
      options: ["Because of a staff training session", "Because of bad weather", "Because the room is booked", "Because the manager is ill"], correct: 0,
    },
    {
      text: "What time does the train leave?",
      audio: "The next train to Samarkand departs from platform two at half past four. Please make sure you have your ticket ready before boarding.",
      options: ["4:30", "2:30", "4:15", "5:30"], correct: 0,
    },
    {
      text: "What is included in the course price?",
      audio: "The English course costs 200 dollars per month. This price includes all learning materials, but not the final exam fee.",
      options: ["Learning materials", "The final exam", "Lunch every day", "Transport to class"], correct: 0,
    },
    {
      text: "What must students bring to the exam?",
      audio: "Remember, for Friday's exam you need your student card, two pens and a calculator. Phones are not allowed in the room.",
      options: ["A student card and pens", "A phone", "A dictionary", "A laptop"], correct: 0,
    },
    {
      text: "How often is the club meeting held?",
      audio: "Welcome to the reading club! We meet twice a month, on the first and the third Saturday, at the city library, room five.",
      options: ["Twice a month", "Once a week", "Every day", "Once a year"], correct: 0,
    },
  ],
  quiz_listening_hard: [
    {
      text: "Why did the flight to London get delayed?",
      audio: "We apologise for the delay of flight BA207 to London. The aircraft required an additional technical check before departure. The new departure time is five fifteen, boarding begins at four forty-five.",
      options: ["An additional technical check", "Bad weather in London", "A late crew", "A passengers' strike"], correct: 0,
    },
    {
      text: "What does the speaker suggest first-time visitors should do?",
      audio: "If this is your first visit to the museum, we recommend starting with the second-floor gallery, where the oldest exhibits are displayed. Guided tours leave every hour from the main hall.",
      options: ["Start with the second-floor gallery", "Visit the café first", "Skip the guided tours", "Go straight to the gift shop"], correct: 0,
    },
    {
      text: "What is the main purpose of the announcement?",
      audio: "Dear students, the library will remain open until midnight throughout the summer to accommodate evening visitors. Please note that the borrowing limit has been raised to five books at a time.",
      options: ["To inform about longer opening hours", "To cancel summer courses", "To reduce the borrowing limit", "To close the library early"], correct: 0,
    },
    {
      text: "What changed about the project deadline?",
      audio: "I know the original plan said the fifteenth, but after reviewing your feedback, we have extended the project deadline to the twenty-second. Late submissions after that date will not be accepted.",
      options: ["It was extended by a week", "It was shortened", "It stayed the same", "It was cancelled"], correct: 0,
    },
    {
      text: "What discount is offered for group bookings?",
      audio: "Groups of ten or more receive a twenty percent discount on standard tickets. Student groups also get free entry for one accompanying teacher per fifteen students.",
      options: ["20% for groups of ten or more", "50% for all students", "No discount", "10% for families"], correct: 0,
    },
  ],
};

export const NEW_SUBJECTS: SubjectDef2[] = [
  MATEMATIKA,
  FIZIKA,
  KIMYO,
  GEOGRAFIYA,
  ONA_TILI,
  ADABIYOT,
];

export const EXTRA_QUESTIONS: Record<string, Q2[]> = {
  ...EX_UZ_TARIXI,
  ...EX_JAHON_TARIXI,
  ...EX_INGLIZ,
};
