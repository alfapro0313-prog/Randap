/**
 * Randap test kontenti — avtomatik seed (idempotent).
 * Fanlar: O'zbekiston tarixi (7-11 sinf), Jahon tarixi (7-11 sinf),
 * Ingliz tili (CEFR + IELTS + Listening), Matematika, Fizika, Kimyo,
 * Geografiya, Ona tili, Adabiyot (har biri oson/o'rtacha/qiyin).
 * Mavjud testlarga qo'shimcha savollar: randap-seed-more.ts (EXTRA_QUESTIONS).
 * Har kirganda har bir testdan TASODIFIY 10 savol tanlanadi (/api/quiz).
 * Barcha IDlar barqaror (fixed) — createMany/upsert bilan bir necha marta
 * ishga tushsa ham ikki nusxa hosil bo'lmaydi (Vercel serverless uchun xavfsiz).
 */
import { db } from "@/lib/db";
import {
  NEW_SUBJECTS,
  EXTRA_QUESTIONS,
  type SubjectDef2,
} from "./randap-seed-more";
import { BANK_TARGET, GEN_QUESTIONS } from "./randap-banks";
import type { QGen } from "./banks/gen-core";
import {
  genLegacyArifmetika,
  genLegacyAlgebraMantiq,
  genLegacyGrammatika,
  genLegacyJahonTarixi,
  genLegacySozBoyligi,
  genLegacyUzTarixi,
} from "./banks/gen-legacy";

const DIF = { easy: "easy", middle: "middle", hard: "hard" } as const;
type Dif = keyof typeof DIF;

type Q = { text: string; options: string[]; correct: number; audio?: string };
type QuizDef = {
  id: string;
  title: string;
  description: string;
  difficulty: Dif;
  grade?: number;
  kind?: "quiz" | "listening";
  questions: Q[];
};
type LessonDef = {
  id: string;
  title: string;
  summary: string;
  content: string;
  durationMin: number;
};
type SubjectDef = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  quizzes: QuizDef[];
  lessons: LessonDef[];
};

/* ================= O'ZBEKISTON TARIXI (7-11 sinf) ================= */

const UZ_TARIXI: SubjectDef = {
  slug: "uz-tarixi",
  name: "O'zbekiston tarixi",
  description:
    "7–11 sinf darsliklari asosida: Temuriylardan mustaqillikka — sinf va qiyinlik bo'yicha testlar.",
  icon: "landmark",
  color: "amber",
  order: 3,
  lessons: [
    {
      id: "lesson-uz-7",
      title: "7-sinf: Temuriylar davri",
      summary: "Amir Temur, Temuriylar davlati va uning madaniy yuksalishi.",
      durationMin: 8,
      content:
        "1370-yilda Amir Temur Balx shahrida oliy amir deb e'lon qilindi va Temuriylar davlatiga asos soldi. Poytaxt Samarqand tanlandi. Amir Temur 1391 va 1395-yillarda To'xtamish xon ustidan g'alaba qozondi, 1402-yil Anqara jangida esa Usmonli sultoni Boyazid I ni yengib, imperiya qudratini mustahkamladi. Temur 'Kuchi adl — adldar kuch' ('Kuch — adldadir') mottosiga amal qilib, adolatli boshqaruvni targ'ib qildi; uning qoidalarining to'plami 'Temur tuzuklari' nomi bilan ma'lum.\n\nAmir Temur vafotidan keyin (1405-yil) davlatni uning o'g'li Shohruh, keyinchalik nabirasi Ulug'bek boshqardi. Ulug'bek Samarqandda dunyodagi eng katta rasadxonalardan birini qurdirib, 'Ziji jadidi Ko'ragoniy' astronomik jadvalini tuzdi. Devoni Alisher Navoiy Xuroson sultoni Husayn Boyqaro davrida bosh vazir bo'lib ishladi va 'Xamsa' dostonlar to'plamini yaratdi.\n\nMadaniy yuksalish: Bibixonim masjidi, Go'ri Amir maqbarasi, Shohizinda majmuasi, Shahrisabzdagi Oqsaroy shular jumlasidan. 1500-yillarda Muhammad Shayboniy boshchiligida Shayboniylar Temuriylar sulolasining hukmronligiga barham berdi — 1507-yilga kelib Movarounnahr to'liq Shayboniylar qo'liga o'tdi.",
    },
    {
      id: "lesson-uz-8",
      title: "8-sinf: Turkistonning Rossiyaga qo'shilishi",
      summary: "XIX asr: istilo bosqichlari, xonliklarning tugashi va milliy uyg'onish boshlanishi.",
      durationMin: 8,
      content:
        "XIX asrning ikkinchi yarmida Rossiya imperiyasi Turkistonga keng ko'lamda yurish boshladi: 1865-yilda Toshkent bosib olindi (general Chernyayev qo'mondonligida), 1867-yilda Turkiston general-gubernatorligi tashkil etilib, birinchi general-gubernator K. Kaufman bo'ldi. 1868-yilda Buxoro amirligi va Qo'qon xonligi Rossiya protektoratini qabul qildi (Qo'qon 1876-yilda butunlay tugatildi), 1873-yilda Xiva xonligi Gandimigan shartnomasi bilan Rossiya qaramog'iga o'tdi.\n\nIste'mol bozori sifatida paxtachilik joriy qilindi, 1888-yilda Kaspi ortidagi temir yo'l Samarqandga, 1899-yilda Toshkentga yetib keldi — bu mahsulot chiqarishni tezlashtirdi. Mahalliy aholining yer va suvdan chetlatilishi norozilik tug'dirdi: 1892-yilda Toshkentda vabo isyoni, 1898-yilda esa Andijonda Dukchi ishon boshchiligida yirik qo'zg'olon ko'tarildi.\n\nXX asr boshida jadidchilik harakati kuchaydi: Mahmudxo'ja Behbudiy, Abdulla Qodiriy, Cho'lpon kabi ma'rifatparvarlar yangi usuldagi maktablar ochib, 'Oyina', 'Sadoi Turkiston' kabi gazetalar chiqardi. Behbudiyning 'Padarkush' pyesasi (1913) milliy teatrning ilk namunasidir.",
    },
    {
      id: "lesson-uz-9",
      title: "9-sinf: XX asr va mustaqillikka yo'l",
      summary: "Turkiston Muxtoriyati, sovet davri va 1991-yil mustaqillik.",
      durationMin: 9,
      content:
        "1917-yilning noyabrida Qo'qonda Turkiston (Turkiston avtonomiyasi) Muxtoriyati e'lon qilindi — raisi Mustafo Sho'kay bo'ldi. Lekin 1918-yil fevralda bolshevik qo'shinlari Qo'qonni egallab, muxtoriyatni ag'dardi. Shundan keyin hududda Sovet tuzumi o'rnatildi: 1918-yil Turkiston ASSR, 1920-yilda Buxoro Xalq Sovet Respublikasi tuzildi. 1924-yilda milliy-hududiy chegaralanish natijasida O'zbekiston SSR yaratildi.\n\n1930-yillarda majburiy kollektivlashtirish va 1937-1938-yillardagi qatag'onlar xalqqa og'ir zarba bo'ldi — minglab ziyolilar, diniy arboblar, dehqonlar jabrlandi. 1941-1945-yillardagi urushda O'zbekistondan yuz minglab kishilar frontga bordi, sanoat korxonalari evakuatsiya qilindi. 1966-yil 26-apreldagi Toshkent zilzilasi shaharni vayron qildi, butun ittifoq hisobidan qisqa muddatda qayta qurildi.\n\nPerestroyka davrida milliy o'zlik uyghandi: 1989-yilda o'zbek tili davlat tili deb e'lon qilindi, 1990-yil 20-iyunda Mustaqillik deklaratsiyasi qabul qilindi. 1991-yil 31-avgustda O'zbekiston Respublikasining davlat mustaqilligi e'lon qilindi va 1-sentabr Milliy bayram bo'ldi.",
    },
    {
      id: "lesson-uz-10",
      title: "10-sinf: Mustaqil O'zbekistonning yangi tarixi",
      summary: "1991-2016-yillar: davlat qurilishi, Konstitutsiya va islohotlar.",
      durationMin: 8,
      content:
        "Mustaqillik e'lon qilingandan so'ng davlat tizimi qurila boshladi: 1991-yil 18-noyabrda davlat bayrog'i, 1992-yil 2-iyulda gerb va madhiya qabul qilindi. 1992-yil 8-dekabrda O'zbekiston Respublikasining Konstitutsiyasi qabul qilindi — bu kun har yili Konstitutsiya kuni sifatida nishonlanadi. O'zbekiston 1992-yil 2-martda BMTga a'zo bo'ldi.\n\nIqtisodiyotda bosqichma-bosqich islohotlar o'tkazildi: 1993-yilda so'm-kupon joriy etildi, 1994-yil 1-iyulda milliy valyuta — so'm muomalaga chiqdi. 1994-1995-yillarda birinchi chaqiriq Oliy Majlis saylovi bo'ldi; 2002-yilgi referendum natijasida parlament ikki palatali tizimga o'tdi (Qonunchilik palatasi va Senat).\n\n2016-yildan boshlab yangi bosqich boshlandi: 2017-yilda 'Harakatlar strategiyasi — 2017-2021' qabul qilindi, 2017-yil sentabrda milliy valyuta erkin konvertatsiya qilina boshladi, davlat organlari faoliyati ochiqligi, tashqi siyosatda qo'shni mamlakatlar bilan yaqinlashuv kuchaydi.",
    },
    {
      id: "lesson-uz-11",
      title: "11-sinf: Zamonaviy O'zbekiston",
      summary: "Yangi O'zbekiston: 2017-2030 islohotlar, Konstitutsiyaning yangi tahriri.",
      durationMin: 8,
      content:
        "2019-yilda 'Besh muhim tashabbus' dasturi e'lon qilindi — yoshlar uchun musiqa, sport, adabiyot, kompyuter savodxonligi va tilda erkinlik yo'llarini ochishga qaratilgan. 2021-yil Prezident saylovi birinchi marta 7 yillik muddatga bo'lib o'tdi.\n\n2023-yil 30-aprelda Konstitutsiyaga keng qo'shimchalar beruvchi referendum bo'lib o'tdi — Konstitutsiyaning yangi tahriri qabul qilindi, 'Yangi O'zbekiston' tushunchasi asosiy hujjatga kiritildi. O'sha yili qabul qilingan 'O'zbekiston — 2030' strategiyasi 100 ta maqsadni o'z ichiga oladi: iqtisodiyotni yanada ochish, ta'lim sifatini oshirish, yashil iqtisodiyotga o'tish va boshqalar.\n\nHududiy tuzilma: respublikada 12 viloyat, Qoraqalpog'iston Respublikasi va Toshkent shahri mavjud. Davlat boshqaruvida raqamlashtirish, xizmatlarni 'ID hukumat' platformasiga ko'chirish, investitsiyalarni jalb qilish yo'lga qo'yilgan. O'zbekiston Markaziy Osiyoda xalqaro sammitlar (Samarqand, 2022 va keyingi yillar) mezbonligi bilan mintaqada hamkorlikni rivojlantirmoqda.",
    },
  ],
  quizzes: [
    /* ---------- 7-sinf ---------- */
    {
      id: "quiz_uz_7_easy",
      title: "7-sinf: Temuriylar davri (Oson)",
      description: "Amir Temur, Temuriylar davlati va madaniyati haqida asosiy savollar.",
      difficulty: "easy",
      grade: 7,
      questions: [
        { text: "Amir Temur qaysi yillarda hukmronlik qilgan?", options: ["1370–1405", "1250–1290", "1490–1530", "1310–1340"], correct: 0 },
        { text: "Temuriylar davlatining poytaxti qaysi shahar bo'lgan?", options: ["Buxoro", "Samarqand", "Xiva", "Toshkent"], correct: 1 },
        { text: "Ulug'bek asosan qaysi sohada mashhur bo'lgan?", options: ["Shoironlik", "Astronomiya va matematika", "Harbiy soha", "Tibbiyot"], correct: 1 },
        { text: "Bobur qaysi davlatga asos solgan?", options: ["Boburiylar davlati", "Shayboniylar davlati", "Qo'qon xonligi", "Xiva xonligi"], correct: 0 },
        { text: "Bibixonim masjidi qaysi shaharda joylashgan?", options: ["Buxoro", "Xiva", "Samarqand", "Shahrisabz"], correct: 2 },
      ],
    },
    {
      id: "quiz_uz_7_middle",
      title: "7-sinf: Temuriylar davri (O'rtacha)",
      description: "Yurishlar, ilm-fan va siyosiy hodisalar bo'yicha savollar.",
      difficulty: "middle",
      grade: 7,
      questions: [
        { text: "Amir Temur 1370-yilda qaysi shaharda oliy amir deb e'lon qilingan?", options: ["Samarqand", "Balx", "Buxoro", "Hirot"], correct: 1 },
        { text: "'Temur tuzuklari' qanday asar bo'lib, unda Amir Temurning qanday qoidasi yozilgan?", options: ["Shoirlik to'plami", "Boshqaruv va harbiy qoidalar ('Kuchi adl — adldar kuch')", "Astronomik jadval", "Tarixiy yilnoma"], correct: 1 },
        { text: "1402-yil Anqara jangida Amir Temur kimni yengdi?", options: ["To'xtamish xon", "Usmonli sultoni Boyazid I", "Shayboniyxon", "Qo'shqamibek"], correct: 1 },
        { text: "Ulug'bek qaysi asarni tuzib, astronomiyada shuhrat qozondi?", options: ["Ziji jadidi Ko'ragoniy", "Baburnoma", "Xamsa", "Temur tuzuklari"], correct: 0 },
        { text: "Alisher Navoiy qaysi sulton davrida Xuroson bosh vaziri bo'lgan?", options: ["Ulug'bek", "Husayn Boyqaro", "Shohruh", "Abdullaxon II"], correct: 1 },
        { text: "Shayboniylar qaysi shaharni 1500-yilda egallab, Temuriylar hukmronligini tugatgan?", options: ["Samarqand", "Xiva", "Toshkent", "Farg'ona"], correct: 0 },
      ],
    },
    {
      id: "quiz_uz_7_hard",
      title: "7-sinf: Temuriylar davri (Qiyin)",
      description: "Sanalar va nozik faktlar bo'yicha murakkab savollar.",
      difficulty: "hard",
      grade: 7,
      questions: [
        { text: "Amir Temur 1391 va 1395-yillarda qaysi xon ustidan yirik g'alabalarga erishgan?", options: ["To'xtamish xon", "Chingizxon", "Abulxayrxon", "Boyazid I"], correct: 0 },
        { text: "Ulug'bek qaysi yilda fitna natijasida o'ldirilgan?", options: ["1449-yil", "1405-yil", "1469-yil", "1435-yil"], correct: 0 },
        { text: "Navoiy 'Xamsa' to'plamida Bahrom Gur haqida qaysi dostonni yozgan?", options: ["Haft paykar", "Farhod va Shirin", "Layli va Majnun", "Saddi Iskandariy"], correct: 0 },
        { text: "Shahrisabzdagi Oqsaroy kimning buyrug'i bilan qurilgan?", options: ["Ulug'bek", "Amir Temur", "Shohruh", "Bobur"], correct: 1 },
        { text: "Temuriylar davrida pul muomalasi uchun necha tanga zarb etilgan — 'temuriiy tangalar' qaysi shaharda asosiy zarbxona bo'lgan?", options: ["Samarqand", "Xiva", "Qo'qon", "Turkiston"], correct: 0 },
        { text: "1507-yilga kelib Temuriylar sulolasi Movarounnahrda hukmronligi tugashiga kim sabab bo'lgan?", options: ["Muhammad Shayboniy", "To'xtamish", "Boyazid I", "Husayn Boyqaro"], correct: 0 },
      ],
    },
    /* ---------- 8-sinf ---------- */
    {
      id: "quiz_uz_8_easy",
      title: "8-sinf: Turkiston istilosi (Oson)",
      description: "Rossiya imperiyasi bosqini asosiy faktlari.",
      difficulty: "easy",
      grade: 8,
      questions: [
        { text: "Toshkent qaysi yilda Rossiya imperiyasi tomonidan bosib olingan?", options: ["1865-yil", "1876-yil", "1898-yil", "1840-yil"], correct: 0 },
        { text: "Turkiston general-gubernatorligi qachon tashkil etilgan?", options: ["1867-yil", "1885-yil", "1900-yil", "1860-yil"], correct: 0 },
        { text: "Birinchi Turkiston general-gubernatori kim bo'lgan?", options: ["K. Kaufman", "M. Chernyayev", "A. Vrevskiy", "S. Duxovskoy"], correct: 0 },
        { text: "1876-yilda qaysi xonlik butunlay tugatilgan?", options: ["Qo'qon xonligi", "Xiva xonligi", "Buxoro amirligi", "Afg'oniston"], correct: 0 },
        { text: "Jadidlar nimaga chaqirardi?", options: ["Yangi usuldagi maktablar va ma'rifatga", "Xonliklarni qaytarishga", "Rossiyaga qarshi chiqishga", "Savdo qilmaslikka"], correct: 0 },
      ],
    },
    {
      id: "quiz_uz_8_middle",
      title: "8-sinf: Turkiston istilosi (O'rtacha)",
      description: "Xonliklar taqdiri, temir yo'l va qo'zg'olonlar.",
      difficulty: "middle",
      grade: 8,
      questions: [
        { text: "Xiva xonligi qaysi shartnoma bilan Rossiya qaramog'iga o'tdi?", options: ["Gandimigan shartnomasi (1873)", "Tinchlik shartnomasi (1868)", "Yulduz shartnomasi (1865)", "Qizilsuv shartnomasi (1876)"], correct: 0 },
        { text: "Buxoro amirligi qachon Rossiya protektoratini qabul qildi?", options: ["1868-yil", "1885-yil", "1865-yil", "1873-yil"], correct: 0 },
        { text: "Kaspi ortidagi temir yo'l Samarqandga qachon yetib keldi?", options: ["1888-yil", "1865-yil", "1906-yil", "1898-yil"], correct: 0 },
        { text: "1898-yil Andijon qo'zg'oloniga kim boshchilik qilgan?", options: ["Dukchi ishon (Madali)", "Namangonli Xolmo'min", "Behbudiy", "Muhammad Alixon"], correct: 0 },
        { text: "Behbudiyning 'Padarkush' pyesasi qaysi yilda yozilgan?", options: ["1913-yil", "1905-yil", "1920-yil", "1898-yil"], correct: 0 },
        { text: "Rossiya imperiyasi Turkistonda asosan qaysi ekinni yetishtirishni majburladi?", options: ["Paxta", "Bug'doy", "Sholi", "Qandlavlagi"], correct: 0 },
      ],
    },
    {
      id: "quiz_uz_8_hard",
      title: "8-sinf: Turkiston istilosi (Qiyin)",
      description: "Nozik sanalar va voqealar tafsilotlari.",
      difficulty: "hard",
      grade: 8,
      questions: [
        { text: "1892-yilda Toshkentda qanday hodisa sodir bo'ldi?", options: ["Vabo isyoni", "Temir yo'l ochilishi", "Sud islohoti", "Milliy teatr tashkil etilishi"], correct: 0 },
        { text: "Toshkent bosib olinganda rus qo'shinlariga kim qo'mondonlik qilgan?", options: ["General M. Chernyayev", "K. Kaufman", "A. Skobelev", "D. Romanovskiy"], correct: 0 },
        { text: "1916-yil qo'zg'olonga sabab bo'lgan farmon nimani nazarda tutgan?", options: ["Front ishlarida majburiy mehnatga aholi jalb qilish", "Yer solig'ini oshirish", "Paxta planini oshirish", "Til islohoti"], correct: 0 },
        { text: "Jadidchilik harakatining asoschisi va yetakchilaridan biri kim edi?", options: ["Mahmudxo'ja Behbudiy", "Dukchi ishon", "Chernyayev", "Kaufman"], correct: 0 },
        { text: "'Sadoi Turkiston' gazetasi qachon va qayerda chop etila boshlagan?", options: ["1917-yil Toshkentda", "1913-yil Buxoroda", "1905-yil Xivada", "1920-yil Qo'qonda"], correct: 0 },
        { text: "XIX asr oxirida Turkiston hududida paxta toqalarini o'rash (qingirchilik) kimlarning vazifasi bo'lgan?", options: ["Dehqonlar va o'rta dehqonlar ustidan soliq yig'uvchi elita", "Rus ofitserlar", "Xon farzandlari", "Taqchilar"], correct: 0 },
      ],
    },
    /* ---------- 9-sinf ---------- */
    {
      id: "quiz_uz_9_easy",
      title: "9-sinf: Mustaqillikka yo'l (Oson)",
      description: "XX asr asosiy sanalari: muxtoriyat, SSR va mustaqillik.",
      difficulty: "easy",
      grade: 9,
      questions: [
        { text: "Turkiston Muxtoriyati qachon e'lon qilingan?", options: ["1917-yil", "1924-yil", "1918-yil", "1905-yil"], correct: 0 },
        { text: "O'zbekiston mustaqilligi qachon e'lon qilingan?", options: ["1991-yil 31-avgust", "1990-yil 20-iyun", "1992-yil 8-dekabr", "1989-yil 24-oktyabr"], correct: 0 },
        { text: "Mustaqillik kuni qaysi sanada nishonlanadi?", options: ["1-sentabr", "8-dekabr", "24-oktyabr", "1-may"], correct: 0 },
        { text: "O'zbekistonning birinchi prezidenti kim bo'lgan?", options: ["Islom Karimov", "Shavkat Mirziyoyev", "Mustafo Sho'kay", "Abdurahim Odilov"], correct: 0 },
        { text: "O'zbekiston SSR qachon tashkil etilgan?", options: ["1924-yil", "1918-yil", "1936-yil", "1991-yil"], correct: 0 },
      ],
    },
    {
      id: "quiz_uz_9_middle",
      title: "9-sinf: Mustaqillikka yo'l (O'rtacha)",
      description: "Muxtoriyat, sovet davri voqealari va tilning holati.",
      difficulty: "middle",
      grade: 9,
      questions: [
        { text: "Turkiston Muxtoriyati raisi kim edi?", options: ["Mustafo Sho'kay", "Toshpo'latbek", "Abdullaxon", "Behbudiy"], correct: 0 },
        { text: "Qo'qon Muxtoriyati qachon qulab tushdi?", options: ["1918-yil fevral", "1917-yil oktyabr", "1924-yil oktyabr", "1920-yil mart"], correct: 0 },
        { text: "Buxoro Xalq Sovet Respublikasi qachon tuzilgan?", options: ["1920-yil", "1918-yil", "1924-yil", "1917-yil"], correct: 0 },
        { text: "O'zbek tili davlat tili deb qachon e'lon qilingan?", options: ["1989-yil 24-oktyabr", "1991-yil 31-avgust", "1992-yil 8-dekabr", "1990-yil 20-iyun"], correct: 0 },
        { text: "1966-yilda qaysi shahar yirik zilzilaga uchradi?", options: ["Toshkent", "Samarqand", "Buxoro", "Farg'ona"], correct: 0 },
        { text: "Milliy-hududiy chegaralanish natijasida O'zbekiston SSR qachon yaratildi?", options: ["1924-yil 27-oktyabr", "1918-yil 30-aprel", "1936-yil 5-dekabr", "1920-yil 2-fevral"], correct: 0 },
      ],
    },
    {
      id: "quiz_uz_9_hard",
      title: "9-sinf: Mustaqillikka yo'l (Qiyin)",
      description: "Nozik sanalar va murakkab jarayonlar.",
      difficulty: "hard",
      grade: 9,
      questions: [
        { text: "Mustaqillik deklaratsiyasi qachon qabul qilingan?", options: ["1990-yil 20-iyun", "1991-yil 31-avgust", "1989-yil 24-oktyabr", "1992-yil 8-dekabr"], correct: 0 },
        { text: "O'zbekiston Respublikasi Konstitutsiyasi qachon qabul qilingan?", options: ["1992-yil 8-dekabr", "1991-yil 31-avgust", "1994-yil 1-iyul", "1993-yil 15-noyabr"], correct: 0 },
        { text: "Milliy valyuta — so'm qachon muomalaga chiqarilgan?", options: ["1994-yil 1-iyul", "1993-yil 15-noyabr", "1992-yil 8-dekabr", "1991-yil 1-sentabr"], correct: 0 },
        { text: "So'm-kupon qachon joriy etilgan?", options: ["1992-yil 15-noyabr", "1994-yil 1-iyul", "1991-yil 31-avgust", "1990-yil 20-iyun"], correct: 0 },
        { text: "Turkiston ASSR qachon tuzilgan?", options: ["1918-yil 30-aprel", "1920-yil 2-fevral", "1917-yil 27-noyabr", "1924-yil 27-oktyabr"], correct: 0 },
        { text: "1930-yillarda majburiy kollektivlashtirish nimaga olib keldi?", options: ["Dehqonlar yeridan va chorva mollardan ayrilishi, ocharchilik", "Sanoatning tez o'sishi", "Ta'limning rivojlanishi", "Tilning holati yaxshilandi"], correct: 0 },
      ],
    },
    /* ---------- 10-sinf ---------- */
    {
      id: "quiz_uz_10_easy",
      title: "10-sinf: Mustaqil O'zbekiston (Oson)",
      description: "Davlat ramzlari, Konstitutsiya va valyuta.",
      difficulty: "easy",
      grade: 10,
      questions: [
        { text: "O'zbekiston davlat bayrog'i qachon qabul qilingan?", options: ["1991-yil 18-noyabr", "1992-yil 8-dekabr", "1991-yil 31-avgust", "1992-yil 2-mart"], correct: 0 },
        { text: "O'zbekiston qachon BMTga a'zo bo'lgan?", options: ["1992-yil 2-mart", "1991-yil 1-sentabr", "1994-yil 1-iyul", "1995-yil 21-mart"], correct: 0 },
        { text: "Mustaqil O'zbekistonning milliy valyutasi qanday nomlanadi?", options: ["So'm", "Rubl", "Tanga", "Manat"], correct: 0 },
        { text: "Konstitutsiya kuni qachon nishonlanadi?", options: ["8-dekabr", "1-sentabr", "2-mart", "18-noyabr"], correct: 0 },
        { text: "'Harakatlar strategiyasi' qaysi yillarda amal qilgan?", options: ["2017–2021", "1991–1995", "2000–2005", "2023–2030"], correct: 0 },
      ],
    },
    {
      id: "quiz_uz_10_middle",
      title: "10-sinf: Mustaqil O'zbekiston (O'rtacha)",
      description: "Islohotlar, referendumlar va parlament tarixi.",
      difficulty: "middle",
      grade: 10,
      questions: [
        { text: "Oliy Majlisning birinchi chaqiriq saylovlari qachon bo'lib o'tgan?", options: ["1994–1995-yillar", "1991-yil", "2002-yil", "2019-yil"], correct: 0 },
        { text: "Parlament ikki palatali tizimga qachon o'tgan?", options: ["2002-yil referendumidan keyin", "1992-yil Konstitutsiya bilan", "2017-yil", "1995-yil"], correct: 0 },
        { text: "Milliy valyuta erkin konvertatsiya qilina boshlagan yil?", options: ["2017-yil", "1994-yil", "2010-yil", "2021-yil"], correct: 0 },
        { text: "Shavkat Mirziyoyev qachon Prezident etib saylangan?", options: ["2016-yil dekabr", "2017-yil mart", "2021-yil oktyabr", "2014-yil"], correct: 0 },
        { text: "'O'zbekiston — 2030' strategiyasi qachon qabul qilingan?", options: ["2023-yil", "2017-yil", "2019-yil", "2020-yil"], correct: 0 },
        { text: "1995-yildagi referendum nimani hal qilgan?", options: ["Prezident vakolatini uzaytirish", "Valyuta joriy etish", "BMTga a'zolik", "Yangi viloyat tashkil etish"], correct: 0 },
      ],
    },
    {
      id: "quiz_uz_10_hard",
      title: "10-sinf: Mustaqil O'zbekiston (Qiyin)",
      description: "Nozik sanalar va institutsional o'zgarishlar.",
      difficulty: "hard",
      grade: 10,
      questions: [
        { text: "Davlat gerbi va madhiyasi qachon qabul qilingan?", options: ["1992-yil", "1991-yil", "1993-yil", "1994-yil"], correct: 0 },
        { text: "So'm-kupon muomaladan to'liq chiqarilib, so'mga o'tish jarayoni qaysi yil yakunlangan?", options: ["1994-yil", "1996-yil", "1993-yil", "2000-yil"], correct: 0 },
        { text: "2002-yil referendumda qaysi ikki masala hal qilingan?", options: ["Ikki palatali parlament va Prezident muddatini 7 yilga uzaytirish", "Til va ramzlar", "Viloyatlar soni", "Solif islohoti"], correct: 0 },
        { text: "2021-yil Prezident saylovi birinchi marta qanday yangilik bilan bo'lib o'tdi?", options: ["7 yillik muddatga", "5 yillik muddatga", "10 yillik muddatga", "Uch yillik muddatga"], correct: 0 },
        { text: "'Yangi O'zbekiston' Konstitutsiyasi qabul qilingan referendum sanasi?", options: ["2023-yil 30-aprel", "2022-yil 24-iyul", "2021-yil 24-oktyabr", "2020-yil 5-sentabr"], correct: 0 },
        { text: "Mustaqillikning dastlabki yillarida chetki investitsiyalar uchun qanday organ tashkil etilgan edi?", options: ["Chetki investitsiyalar agentligi", "Markaziy bank", "Davlat soliq qo'mitasi", "Moliya vazirligi"], correct: 0 },
      ],
    },
    /* ---------- 11-sinf ---------- */
    {
      id: "quiz_uz_11_easy",
      title: "11-sinf: Zamonaviy O'zbekiston (Oson)",
      description: "Bugungi kundagi asosiy faktlar.",
      difficulty: "easy",
      grade: 11,
      questions: [
        { text: "O'zbekistonning davlat tili qaysi til hisoblanadi?", options: ["O'zbek tili", "Rus tili", "Tojik tili", "Qoraqalpoq tili"], correct: 0 },
        { text: "Respublikada nechta viloyat bor?", options: ["12", "14", "10", "8"], correct: 0 },
        { text: "'O'zbekiston — 2030' strategiyasi nima maqsadga qaratilgan?", options: ["Iqtisodiyot, ta'lim va hayot sifatini oshirishga", "Urushga tayyorlanishga", "Migratsiyani cheklashga", "Sanoatni yopishga"], correct: 0 },
        { text: "Qoraqalpog'iston Respublikasi O'zbekiston tarkibida qanday maqomga ega?", options: ["Suveren Respublika", "Viloyat", "Mintaqa", "Shahar"], correct: 0 },
        { text: "Besh muhim tashabbus kim tomonidan e'lon qilingan?", options: ["Shavkat Mirziyoyev", "Islom Karimov", "Mustafo Sho'kay", "Ulug'bek"], correct: 0 },
      ],
    },
    {
      id: "quiz_uz_11_middle",
      title: "11-sinf: Zamonaviy O'zbekiston (O'rtacha)",
      description: "2017-yildan keyingi islohotlar va institutlar.",
      difficulty: "middle",
      grade: 11,
      questions: [
        { text: "'Yangi O'zbekiston' tushunchasi qaysi hujjatga kiritildi?", options: ["Konstitutsiyaning yangi tahririga (2023)", "'Harakatlar strategiyasiga'", "Solif kodeksiga", "Migratsiya qonuniga"], correct: 0 },
        { text: "2024-yilda qaysi marosim yangi Oliy Majlis saylovi bo'lib o'tdi?", options: ["Oktabr 2024", "Mart 2024", "Yanvar 2024", "May 2024"], correct: 0 },
        { text: "2023-yil referendumdan keyin Prezidentlik muddati necha yil bo'ldi?", options: ["7 yil", "5 yil", "10 yil", "4 yil"], correct: 0 },
        { text: "'Besh muhim tashabbus' qaysi sohalarga qaratilgan?", options: ["Musiqa, sport, adabiyot, kompyuter savodxonligi va tillar", "Faqat sanoat", "Faqat qishloq xo'jaligi", "Harbiy sohalar"], correct: 0 },
        { text: "O'zbekiston Markaziy Osiyodagi sammitlarni asosan qaysi shahrida o'tkazadi?", options: ["Samarqand", "Nukus", "Andijon", "Termiz"], correct: 0 },
        { text: "Raqamli iqtisodiyotni rivojlantirish uchun qaysi organ mas'ul?", options: ["Raqamlashtirish vazirligi", "Moliya vazirligi", "Tashqi ishlar vazirligi", "Sog'liqni saqlash vazirligi"], correct: 0 },
      ],
    },
    {
      id: "quiz_uz_11_hard",
      title: "11-sinf: Zamonaviy O'zbekiston (Qiyin)",
      description: "Eng yangi jarayonlar va nozik sanalar.",
      difficulty: "hard",
      grade: 11,
      questions: [
        { text: "Konstitutsiya yangi tahririda necha modda qoldirilgan edi?", options: ["155 modda", "125 modda", "175 modda", "105 modda"], correct: 0 },
        { text: "2024-yilgi saylovda birinchi marta qanday yangilik joriy etildi?", options: ["Kuchli qiyinli uchun elektron saylov platformasi sinovi", "Faqat senat saylovi", "Viloyat hokimlari saylovi", "Yangi parlament binosi"], correct: 0 },
        { text: "'O'zbekiston — 2030' strategiyasida nechta maqsad belgilangan?", options: ["100 ta", "50 ta", "75 ta", "120 ta"], correct: 0 },
        { text: "2023-yildagi referendumda qabul qilingan o'zgarishlar Konstitutsiyaga necha marta tahrir kiritgan hisoblanadi?", options: ["Ikkinchi tahrir", "Birinchi tahrir", "Uchinchi tahrir", "To'rtinchi tahrir"], correct: 0 },
        { text: "2020-yil qaysi yangi idora Prezident administratsiyasi tarkibida tashkil etildi?", options: ["Milliy statistika qo'mitasi", "Moliya vazirligi", "Tashqi savdo vazirligi", "Ichki ishlar vazirligi"], correct: 0 },
        { text: "2022-yilda qaysi shahar 'Islom madaniyati poytaxti' deb e'lon qilindi?", options: ["Buxoro", "Samarqand", "Xiva", "Kokand"], correct: 0 },
      ],
    },
  ],
};

/* ================= JAHON TARIXI (7-11 sinf) ================= */

const JAHON_TARIXI: SubjectDef = {
  slug: "jahon-tarixi",
  name: "Jahon tarixi",
  description:
    "7–11 sinf jahon tarixi darsliklari asosida: O'rta asrlardan Sovuq urushgacha — qiyinlik darajalari bilan.",
  icon: "globe",
  color: "emerald",
  order: 4,
  lessons: [
    {
      id: "lesson-jahon-7",
      title: "7-sinf: O'rta asrlar jahoni",
      summary: "Buyuk ipak yo'li, Arab xalifaligi, mo'g'ullar va Salib yurishlari.",
      durationMin: 8,
      content:
        "O'rta asrlarda (V–XV asrlar) Yevrosiyo siyosiy xaritasi butunlay o'zgardi. 632-yil payg'ambar Muhammad vafotidan keyin Arab xalifaligi kengayib, bir asr ichida Ispaniyadan Hindistongacha cho'zildi. 732-yilda Puatye jangida franklar qo'mondoni Karl Martell arablarning Yevropaga chuqurroq kirib borishini to'xtatdi. Xalifalik poytaxti Bag'doddagi 'Baytul-hikma' Sharqning eng yirik ilmiy markaziga aylandi.\n\n1206-yilda Onon daryosi bo'yidagi qurultoyda Temuchin Chingizxon deb e'lon qilindi; mo'g'ullar XIII asrda Yevrosiyoning katta qismini bosib oldi. 1453-yilda Usmonli sultoni Mehmet II Konstantinopolni egallab, Vizantiya imperiyasiga barham berdi — bu O'rta asrlar yakuni sanaladi.\n\nBuyuk ipak yo'li Xitoyni O'rta Yer dengizi bilan bog'lovchi savdo yo'llari tizimi bo'lib, ipak, ziravorlar, qog'oz va ilmlar almashinuvida hal qiluvchi rol o'ynadi; Samarqand va Buxoro uning muhim tugunlari edi. 1096–1291-yillarda sakkiz marta Salib yurishlari bo'lib, ular Yevropa bilan Sharq o'rtasidagi aloqalarni chuqurlashtirdi. 1337–1453-yillarda Angliya va Fransiya o'rtasida Yuz yillik urush kechdi.",
    },
    {
      id: "lesson-jahon-8",
      title: "8-sinf: Buyuk geografik kashfiyotlar va Yangi davr",
      summary: "Kolumb, Reformatsiya va burjua inqiloblarining boshlanishi.",
      durationMin: 8,
      content:
        "XV–XVII asrlarda Buyuk geografik kashfiyotlar davri boshlandi. 1492-yilda Xristofor Kolumb Ispaniya qirolining mablag'i bilan Atlantikani kesib o'tib, Amerika qit'asiga yo'l ochdi. 1498-yilda Vasco da Gama Afrika atroflanib Hindistonga dengiz yo'lini topdi, 1519–1522-yillarda Magellan ekspeditsiyasi birinchi bo'lib Yerni aylanib chiqdi. Kashfiyotlar natijasida kolonial tizim va qul savdosi (Angliya–Afrika–Amerika 'uchburchak savdosi') shakllandi.\n\n1517-yilda Martin Lyuter Vittenbergda 95 tezisni e'lon qilib, Reformatsiyani boshlab yubordi — katolik cherkovining bir davrligi tugadi, protestantlik paydo bo'ldi. Cherkov javoban Kontrreformatsiyani boshladi (Trent sobori).\n\n1640–1660-yillarda Angliyada burjua inqilobi bo'ldi: qirol Charlz I 1649-yilda boshi kesildi, 1688-yilgi 'Shonli inqilob' konstitutsion monarxiyani o'rnatdi. 1566-yilda Niderland inqilobi boshlandi. 1588-yilda Angliya Ispaniyaning 'Yengilmas armadasini' yengdi. 1648-yilgi Vestfyal sulhi Otuz yillik urushni tugatib, yangi xalqaro tartibni belgiladi.",
    },
    {
      id: "lesson-jahon-9",
      title: "9-sinf: Sanoat inqilobi va inqiloblar davri",
      summary: "Angliyadan boshlangan sanoat inqilobi, Fransuz inqilobi va XIX asr xaritasi.",
      durationMin: 8,
      content:
        "XVIII asrning ikkinchi yarmida Angliyada sanoat inqilobi boshlandi: 1764-yilda Jeyms Xargrivs 'Jenny' ip mashinasini ixtiro qildi, Jeyms Uatt parovoz dvigatelini takomillashtirdi, 1825-yilda Jorj Stivensonning 'Lokomosyon' parovoz birinchi umumiy temir yo'l chizig'ida yurdi. Sanoat inqilobi ijtimoiy tuzilmani o'zgartirdi: fabrikalar, shaharlar, ishchilar sinfi paydo bo'ldi.\n\n1789-yil 14-iyulda Parijliklar Bastiliya qal'asini egalladi — Fransuz inqilobi boshlandi. Uning shiori 'Erkinlik, Tenglik, Birodarlik' edi. 1799-yilda Napoleon Bonapart hokimiyatni qo'lga oldi, 1812-yilda Rossiyaga yurish qilib mag'lub bo'ldi va 1815-yilda Vaterloo jangida yakuniy tor-mor etildi. 1848-yil Yevropada 'Xalqlar bahosi' — inqiloblar to'lqini o'tdi.\n\nIjtimoiy fikrda 1848-yil Karl Marks va Fridrix Engels 'Kommunistik manifest'ni chop etdi. Ikkinchi yarmida xalqlar birlashdi: 1871-yilda Germaniya (Bismarck rahbarligida), 1870-yilda Italiya birlashishi yakunlandi. Amerika qit'asida 1776-yil 4-iyulda AQSh mustaqillik deklaratsiyasi qabul qilindi; 1861–1865-yillardagi fuqarolar urushi qulchilikni tugatdi.",
    },
    {
      id: "lesson-jahon-10",
      title: "10-sinf: Birinchi jahon urushi va XX asr boshi",
      summary: "Urush sabablari, Antanta, inqiloblar va Turkiya Respublikasi.",
      durationMin: 8,
      content:
        "XX asr boshida Yevropa ikki harbiy blokka bo'lindi: Antanta (Angliya, Fransiya, Rossiya) va Markaziy davlatlar (Germaniya, Avstriya-Vengriya, Usmoniylar, Bolgariya). 1914-yil 28-iyunda Sarayevoda arxiogertsog Frans Ferdinand o'ldirilishi Birinchi jahon urushining boshlanishiga turtki bo'ldi (1914–1918). Urushda 10 mln dan ortiq askar halok bo'ldi; 1919-yilgi Versal shartnomasi Germaniyaga og'ir shartlar yukladi.\n\nRossiyada 1917-yilda ikki inqilob bo'ldi: fevralda podsho ag'darildi, oktyabrda bolsheviklar hokimiyatni egalladi. 1918-yilda Brest sulhi imzolandi. 1919–1920-yillarda Millatlar ittifoqi (Liga of Nations) tuzildi — BMTning ilk nazariy ko'rinishi edi.\n\nUsmoniylar imperiyasi urushda mag'lub bo'lgach, 1920-yilgi Sevr shartnomasi uni bo'lib tashlashga qaratilgan edi, lekin Mustafo Kamol (Ataturk) boshchiligida mustaqillik harakati g'alaba qozondi: 1923-yil 29-oktyabrda Turkiya Respublikasi e'lon qilindi, Lozanna shartnomasi yangi chegaralarni tan oldi. Ataturk duniyaviy islohotlar (laitsizlik, alifbo, huquq) o'tkazdi.",
    },
    {
      id: "lesson-jahon-11",
      title: "11-sinf: Ikkinchi jahon urushi va Sovuq urush",
      summary: "1939-1945 urushi, BMT, Sovuq urush va dunyo tartibi.",
      durationMin: 9,
      content:
        "Ikkinchi jahon urushi 1939-yil 1-sentabrda Germaniya Polshaga hujum qilishi bilan boshlandi (1939–1945). 1941-yil 22-iyunda Germaniya SSSRga hujum qildi (Barbarossa rejasi). Burilish nuqtalari: Stalingrad jangi (1942–1943) va 1944-yil 6-iyundagi Normandiya qo'nish operatsiyasi. Urushda 60 mln dan ortiq odam halok bo'ldi. 1945-yil fevralda Yalta konferensiyasida Stalin, Ruzvelt va Cherchill urushdan keyingi tartibni muhokama qildi.\n\n1945-yil 24-oktyabrda Birlashgan Millatlar Tashkiloti tuzildi — shtab-kvartirasi Nyu-Yorkda. Ikki super davlat — AQSh va SSSR o'rtasidagi ziddiyat Sovuq urushga olib keldi (1945–1991): 1949-yil NATO, 1955-yil Varshava shartnomasi tashkilotlari tuzildi. 1962-yil Karib inqirozi yadro urushiga yaqin olib bordi.\n\n1989-yilda Berlin devori quladi, 1991-yilda SSSR tarqaldi — Sovuq urush tugadi. Keyingi davrda globalizatsiya, iqtisodiy integratsiya va yangi xavflar (terrorizm, iqlim inqirozi) dunyo siyosatining markaziga chiqdi.",
    },
  ],
  quizzes: [
    /* ---------- 7-sinf ---------- */
    {
      id: "quiz_jahon_7_easy",
      title: "7-sinf: O'rta asrlar (Oson)",
      description: "Buyuk ipak yo'li, Arab xalifaligi va mo'g'ullar haqida asosiy savollar.",
      difficulty: "easy",
      grade: 7,
      questions: [
        { text: "Buyuk ipak yo'li qaysi tovar nomi bilan mashhur?", options: ["Ipak", "Paxta", "Yog'", "Marmar"], correct: 0 },
        { text: "Arab xalifaligiga asos solgan din qanday nomlanadi?", options: ["Islom", "Xristianlik", "Buddizm", "Yahudiylik"], correct: 0 },
        { text: "Salib yurishlari maqsadi qaysi shahar edi?", options: ["Quddus", "Rim", "Parij", "Bag'dod"], correct: 0 },
        { text: "Mo'g'ullar davlatiga asos solgan hukmdor kim?", options: ["Chingizxon", "Amir Temur", "Boyazid I", "Mehmet II"], correct: 0 },
        { text: "1453-yil Konstantinopol qaysi davlat tomonidan egallandi?", options: ["Usmonli sultonligi", "Fransiya", "Rossiya", "Misr"], correct: 0 },
      ],
    },
    {
      id: "quiz_jahon_7_middle",
      title: "7-sinf: O'rta asrlar (O'rtacha)",
      description: "Janglar, kashfiyotlar va madaniyat markazlari.",
      difficulty: "middle",
      grade: 7,
      questions: [
        { text: "Yuz yillik urush qaysi davlatlar orasida bo'lgan?", options: ["Angliya va Fransiya", "Germaniya va Italiya", "Rossiya va Shvetsiya", "Ispaniya va Portugaliya"], correct: 0 },
        { text: "1453-yil Konstantinopolni egallagan sulton kim edi?", options: ["Mehmet II", "Boyazid I", "Selim I", "Sulaymon"], correct: 0 },
        { text: "Vizantiya imperiyasining poytaxti qaysi shahar edi?", options: ["Konstantinopol", "Afina", "Rim", "Iskandariya"], correct: 0 },
        { text: "Kitob chop etish Yevropada kim tomonidan takomillashtirilgan?", options: ["Iogann Gutenberg", "Leonardo da Vinchi", "Martin Lyuter", "Mikelandjelo"], correct: 0 },
        { text: "Arab xalifaligining mashhur ilmiy markazi qayerda edi?", options: ["Bag'doddagi Baytul-hikma", "Madrid", "Qohira akademiyasi", "Isfahon"], correct: 0 },
        { text: "Mo'g'ullar davlatining poytaxti asosan qayer bo'lgan?", options: ["Qoraqorum", "Samarqand", "Pekin", "Moskva"], correct: 0 },
      ],
    },
    {
      id: "quiz_jahon_7_hard",
      title: "7-sinf: O'rta asrlar (Qiyin)",
      description: "Sanalar va murakkab faktlar.",
      difficulty: "hard",
      grade: 7,
      questions: [
        { text: "Salib yurishlari jami necha marta bo'lgan?", options: ["8", "5", "12", "3"], correct: 0 },
        { text: "732-yil Puatye jangida arablarning Yevropaga yurishini kim to'xtatdi?", options: ["Karl Martell", "Sharlman", "Rikard Arslonyurak", "Yustinian I"], correct: 0 },
        { text: "Chingizxon 1206-yilda qayerda buyuk xon deb e'lon qilindi?", options: ["Onon daryosi qirg'og'idagi qurultoyda", "Bag'dodda", "Samarqandda", "Pekinda"], correct: 0 },
        { text: "Baytul-hikma ('Donolik uyi') qaysi xalifa davrida barpo etildi?", options: ["Xarun ar-Rashid va al-Ma'mun", "Mavlo", "Sulton Salim", "Abu Bakr"], correct: 0 },
        { text: "Yuz yillik urush qaysi yillar oralig'ida kechgan?", options: ["1337–1453", "1096–1291", "1450–1550", "1206–1260"], correct: 0 },
        { text: "O'rta asrlarda qog'oz ixtiro qilingan mamlakat qaysi?", options: ["Xitoy", "Hindiston", "Misr", "Gretsiya"], correct: 0 },
      ],
    },
    /* ---------- 8-sinf ---------- */
    {
      id: "quiz_jahon_8_easy",
      title: "8-sinf: Yangi davr (Oson)",
      description: "Buyuk geografik kashfiyotlar va Reformatsiya asoslari.",
      difficulty: "easy",
      grade: 8,
      questions: [
        { text: "Amerika qit'asini kim ochdi?", options: ["Xristofor Kolumb", "Magellan", "Vasco da Gama", "Amerigo Vespucci"], correct: 0 },
        { text: "Reformatsiyani kim boshladi?", options: ["Martin Lyuter", "Kolumb", "Karol Martell", "Lyudovik XIV"], correct: 0 },
        { text: "Hindistonga dengiz yo'lini kim ochdi (1498)?", options: ["Vasco da Gama", "Kolumb", "Magellan", "Drake"], correct: 0 },
        { text: "Buyuk geografik kashfiyotlar davri qaysi asrlarga to'g'ri keladi?", options: ["XV–XVII", "XII–XIV", "XVIII–XIX", "X–XI"], correct: 0 },
        { text: "Yerni birinchi bo'lib aylanib chiqqan ekspeditsiya rahbari kim edi?", options: ["Magellan", "Kolumb", "Kuk", "Vasko"], correct: 0 },
      ],
    },
    {
      id: "quiz_jahon_8_middle",
      title: "8-sinf: Yangi davr (O'rtacha)",
      description: "Inqiloblar, urushlar va siyosiy o'zgarishlar.",
      difficulty: "middle",
      grade: 8,
      questions: [
        { text: "Ingliz burjua inqilobi qachon bo'lib o'tdi?", options: ["1640–1660-yillarda", "1789–1799-yillarda", "1566–1609-yillarda", "1688-yilda"], correct: 0 },
        { text: "1649-yil qaysi ingliz qiroli boshi kesildi?", options: ["Charlz I", "Lyudovik XVI", "Yakov I", "Karol II"], correct: 0 },
        { text: "1588-yil Angliya qaysi flotni yengdi?", options: ["Ispaniya 'Yengilmas armada'", "Portugal flot", "Fransuz floti", "Niderland floti"], correct: 0 },
        { text: "'Davlat — bu men' iborasini kim aytgan?", options: ["Lyudovik XIV", "Napoleon", "Charlz I", "Pyotr I"], correct: 0 },
        { text: "Reformatsiya qaysi shahar bilan bog'liq?", options: ["Vittenberg", "Rim", "Parij", "London"], correct: 0 },
        { text: "Qul savdosining mashhur yo'li qanday nomlangan?", options: ["Uchburchak savdosi", "Ipak yo'li", "Tuz yo'li", "Ziravor yo'li"], correct: 0 },
      ],
    },
    {
      id: "quiz_jahon_8_hard",
      title: "8-sinf: Yangi davr (Qiyin)",
      description: "Sulhlar, kontrreformatsiya va nozik faktlar.",
      difficulty: "hard",
      grade: 8,
      questions: [
        { text: "1648-yilgi Vestfyal sulhi qaysi urushni tugatdi?", options: ["Otuz yillik urush", "Yuz yillik urush", "Uch yillik urush", "Muvaffaqiyatsiz urush"], correct: 0 },
        { text: "1688-yil Angliyadagi 'Shonli inqilob' nimaga olib keldi?", options: ["Konstitutsion monarxiyaga", "Respublikaga", "Absolyutizmning kuchayishiga", "Fuqarolar urushiga"], correct: 0 },
        { text: "Kolumb ekspeditsiyasini qaysi mamlakat moliyalashtirdi?", options: ["Ispaniya", "Portugaliya", "Angliya", "Fransiya"], correct: 0 },
        { text: "Niderland inqilobi qachon boshlandi?", options: ["1566-yil", "1640-yil", "1588-yil", "1492-yil"], correct: 0 },
        { text: "Kontrreformatsiya davrida katoliklar qaysi yig'inni o'tkazdi?", options: ["Trent sobori", "Vestfyal kongressi", "Nitsa sobori", "Vorms dietasi"], correct: 0 },
        { text: "1519–1522-yillar oralig'ida qanday hodisa sodir bo'ldi?", options: ["Magellan ekspeditsiyasining Yerni aylanib chiqishi", "Ingliz burjua inqilobi", "Vestfyal sulhi", "Armada jangi"], correct: 0 },
      ],
    },
    /* ---------- 9-sinf ---------- */
    {
      id: "quiz_jahon_9_easy",
      title: "9-sinf: Sanoat inqilobi (Oson)",
      description: "Fransuz inqilobi va sanoat inqilobi asoslari.",
      difficulty: "easy",
      grade: 9,
      questions: [
        { text: "Sanoat inqilobi qayerdan boshlandi?", options: ["Angliyada", "Fransiyada", "Germaniyada", "Rossiyada"], correct: 0 },
        { text: "Fransuz inqilobi qachon boshlandi?", options: ["1789-yil", "1848-yil", "1812-yil", "1799-yil"], correct: 0 },
        { text: "Fransuz inqilobining shiori qanday edi?", options: ["Erkinlik, Tenglik, Birodarlik", "Din, Boylik, Xotirjamlik", "Birlik, Orzu, Mehmanavozlik", "Adolat, Boylik, Ish"], correct: 0 },
        { text: "Bastiliya qal'asi qaysi shaharda edi?", options: ["Parijda", "Londonda", "Madridda", "Berlinda"], correct: 0 },
        { text: "Napoleon qachon hokimiyatni qo'lga oldi?", options: ["1799-yil", "1789-yil", "1815-yil", "1812-yil"], correct: 0 },
      ],
    },
    {
      id: "quiz_jahon_9_middle",
      title: "9-sinf: Sanoat inqilobi (O'rtacha)",
      description: "Ixtirolar, urushlar va ijtimoiy harakatlar.",
      difficulty: "middle",
      grade: 9,
      questions: [
        { text: "'Kommunistik manifest' mualliflari kimlar?", options: ["Marks va Engels", "Lenin va Stalin", "Russo va Volter", "Adam Smit va Rikardo"], correct: 0 },
        { text: "AQSh mustaqillik deklaratsiyasi qachon qabul qilingan?", options: ["1776-yil 4-iyul", "1789-yil 14-iyul", "1861-yil", "1812-yil"], correct: 0 },
        { text: "1812-yilda Napoleon qaysi davlatga yurish qilib mag'lub bo'ldi?", options: ["Rossiya", "Ispaniya", "Angliya", "Avstriya"], correct: 0 },
        { text: "1815-yilda Napoleonning yakuniy mag'lubiyatiga sabab bo'lgan jang qaysi?", options: ["Vaterloo jangi", "Austerlitz jangi", "Trafalgar jangi", "Borodino jangi"], correct: 0 },
        { text: "Parovoz dvigatelini takomillashtirgan kim edi?", options: ["Jeyms Uatt", "Jorj Stivenson", "Jeyms Xargrivs", "Edison"], correct: 0 },
        { text: "AQSh fuqarolar urushi qaysi yillar bo'ldi?", options: ["1861–1865", "1776–1783", "1848–1850", "1900–1905"], correct: 0 },
      ],
    },
    {
      id: "quiz_jahon_9_hard",
      title: "9-sinf: Sanoat inqilobi (Qiyin)",
      description: "Murakkab jarayonlar va nozik sanalar.",
      difficulty: "hard",
      grade: 9,
      questions: [
        { text: "1848-yil Yevropadagi inqiloblar to'lqini qanday nom bilan ataladi?", options: ["Xalqlar bahosi", "Katta qo'rqish", "Buyuk qochish", "Yashil to'lqin"], correct: 0 },
        { text: "Germaniya birlashishi qachon yakunlandi?", options: ["1871-yil", "1870-yil", "1866-yil", "1890-yil"], correct: 0 },
        { text: "Italian birlashuvining oxirgi bosqichi qaysi shahar bilan bog'liq?", options: ["Rim (1870)", "Vena", "Turin", "Neapol"], correct: 0 },
        { text: "Germaniya birlashuvini amalga oshirgan siyosatchi kim edi?", options: ["Otto fon Bismarck", "Vilgelm I", "Kayzer Fridrix", "Molteke"], correct: 0 },
        { text: "'Jenny' ip mashinasini kim ixtiro qildi?", options: ["Jeyms Xargrivs", "Jeyms Uatt", "Jorj Stivenson", "R. Arkright"], correct: 0 },
        { text: "AQShda qulchilik konstitutsiyaga ko'ra qachon bekor qilindi?", options: ["1865-yil (13-tuzatish)", "1863-yil deklaratsiyasi bilan", "1870-yil", "1850-yil"], correct: 0 },
      ],
    },
    /* ---------- 10-sinf ---------- */
    {
      id: "quiz_jahon_10_easy",
      title: "10-sinf: Birinchi jahon urushi (Oson)",
      description: "Urush sabablari va asosiy sanalar.",
      difficulty: "easy",
      grade: 10,
      questions: [
        { text: "Birinchi jahon urushi qaysi yillarda bo'ldi?", options: ["1914–1918", "1939–1945", "1905–1910", "1920–1925"], correct: 0 },
        { text: "Urush boshlanishiga turtki bo'lgan voqea qayerda sodir bo'ldi?", options: ["Sarayevoda", "Parijda", "Berlinda", "Londonda"], correct: 0 },
        { text: "Turkiya Respublikasining birinchi prezidenti kim?", options: ["Mustafo Kamol Ataturk", "Salim III", "Enver Posho", "Ismet Inonu"], correct: 0 },
        { text: "Oktyabr inqilobi qaysi yilda bo'ldi?", options: ["1917", "1905", "1914", "1921"], correct: 0 },
        { text: "Fevral inqilobi natijasida Rossiyada kim ag'darildi?", options: ["Podsho Nikolay II", "Lenin", "Stalin", "Kerenskiy"], correct: 0 },
      ],
    },
    {
      id: "quiz_jahon_10_middle",
      title: "10-sinf: Birinchi jahon urushi (O'rtacha)",
      description: "Bloklar, shartnomalar va Turkiya islohotlari.",
      difficulty: "middle",
      grade: 10,
      questions: [
        { text: "Antanta tarkibiga qaysi davlatlar kirgan?", options: ["Angliya, Fransiya, Rossiya", "Germaniya, Avstriya, Turkiya", "Italiya, Yaponiya, AQSh", "Fransiya, Germaniya, Polsha"], correct: 0 },
        { text: "Markaziy davlatlar qaysi blokni tashkil qilgan?", options: ["Germaniya, Avstriya-Vengriya, Usmoniylar, Bolgariya", "Angliya, Fransiya, Rossiya", "AQSh, Kanada, Meksika", "Italiya, Gretsiya, Serbiya"], correct: 0 },
        { text: "Versal shartnomasi qachon imzolangan?", options: ["1919-yil", "1918-yil", "1923-yil", "1920-yil"], correct: 0 },
        { text: "Turkiya Respublikasi qachon e'lon qilingan?", options: ["1923-yil 29-oktyabr", "1920-yil", "1919-yil", "1926-yil"], correct: 0 },
        { text: "1918-yil Rossiyada Markaziy davlatlar bilan qanday shartnoma imzolandi?", options: ["Brest sulhi", "Versal shartnomasi", "Lozanna shartnomasi", "Sevr shartnomasi"], correct: 0 },
        { text: "Ataturkning asosiy islohotlari qaysi sohalarni qamrab oldi?", options: ["Siyosat, huquq, alifbo va kiyim", "Faqat harbiy soha", "Faqat savdo", "Faqat sport"], correct: 0 },
      ],
    },
    {
      id: "quiz_jahon_10_hard",
      title: "10-sinf: Birinchi jahon urushi (Qiyin)",
      description: "Tizimlar, shartnomalar va nozik sanalar.",
      difficulty: "hard",
      grade: 10,
      questions: [
        { text: "1919-yildan keyin Yevropada qanday xalqaro tartib shakllandi?", options: ["Versal-Vashington tizimi", "Vestfyal tizimi", "Yalta tizimi", "Berlin tizimi"], correct: 0 },
        { text: "Millatlar ittifoqi (Liga of Nations) qachon tuzilgan?", options: ["1919–1920-yillarda", "1939-yilda", "1929-yilda", "1945-yilda"], correct: 0 },
        { text: "Sevr shartnomasi (1920) qaysi davlatga qaratilgan edi?", options: ["Usmonli Turkiyaga", "Germaniyaga", "Rossiyaga", "Avstriyaga"], correct: 0 },
        { text: "Turkiya mustaqillik urushi qaysi yillarda kechdi?", options: ["1919–1923", "1914–1918", "1923–1930", "1908–1914"], correct: 0 },
        { text: "1929-yil jahon iqtisodiy inqirozi qayerdan boshlandi?", options: ["AQShdan", "Germaniyadan", "Fransiyadan", "Angliyadan"], correct: 0 },
        { text: "Lenin qachon vafot etdi?", options: ["1924-yil", "1918-yil", "1930-yil", "1921-yil"], correct: 0 },
      ],
    },
    /* ---------- 11-sinf ---------- */
    {
      id: "quiz_jahon_11_easy",
      title: "11-sinf: Ikkinchi jahon urushi (Oson)",
      description: "Urush yillari, BMT va Sovuq urush asoslari.",
      difficulty: "easy",
      grade: 11,
      questions: [
        { text: "Ikkinchi jahon urushi qachon boshlandi?", options: ["1939-yil 1-sentabr", "1941-yil 22-iyun", "1937-yil", "1945-yil"], correct: 0 },
        { text: "BMT qachon tuzilgan?", options: ["1945-yil", "1939-yil", "1950-yil", "1991-yil"], correct: 0 },
        { text: "Sovuq urush qaysi davlatlar o'rtasida kechdi?", options: ["AQSh va SSSR", "Angliya va Fransiya", "Xitoy va Yaponiya", "Germaniya va Italiya"], correct: 0 },
        { text: "Berlin devori qachon qulagan?", options: ["1989-yil", "1979-yil", "1991-yil", "1999-yil"], correct: 0 },
        { text: "SSSR qachon tarqaldi?", options: ["1991-yil", "1989-yil", "1993-yil", "1985-yil"], correct: 0 },
      ],
    },
    {
      id: "quiz_jahon_11_middle",
      title: "11-sinf: Ikkinchi jahon urushi (O'rtacha)",
      description: "Konferensiyalar, tashkilotlar va inqirozlar.",
      difficulty: "middle",
      grade: 11,
      questions: [
        { text: "BMT shtab-kvartirasi qayerda joylashgan?", options: ["Nyu-Yorkda", "Jenevada", "Parijda", "Moskvada"], correct: 0 },
        { text: "Karib inqirozi qaysi yilda bo'ldi?", options: ["1962-yil", "1956-yil", "1972-yil", "1968-yil"], correct: 0 },
        { text: "Varshava shartnomasi tashkiloti qachon tugatildi?", options: ["1991-yilda", "1989-yilda", "1985-yilda", "1995-yilda"], correct: 0 },
        { text: "NATO qachon tuzilgan?", options: ["1949-yil", "1955-yil", "1939-yil", "1962-yil"], correct: 0 },
        { text: "1945-yil Potsdam konferensiyasida qaysi yetakchilar qatnashgan?", options: ["Trumen, Stalin, Cherchill (Attlee)", "Stalin, Ruzvelt, Cherchill", "Mao, Stalin, de Gol", "Trumen, de Gol, Mao"], correct: 0 },
        { text: "Ikkinchi jahon urushi Yevropada qachon yakunlandi?", options: ["1945-yil 9-may", "1944-yil 6-iyun", "1945-yil 2-sentabr", "1946-yil"], correct: 0 },
      ],
    },
    {
      id: "quiz_jahon_11_hard",
      title: "11-sinf: Ikkinchi jahon urushi (Qiyin)",
      description: "Operatsiyalar, janglar va nozik sanalar.",
      difficulty: "hard",
      grade: 11,
      questions: [
        { text: "Germaniya SSSRga hujum rejasi qanday nomlangan?", options: ["Barbarossa", "Seelev", "Barbarossa", "Ost"], correct: 0 },
        { text: "Stalingrad jangi qaysi yillar bo'ldi?", options: ["1942–1943", "1941–1942", "1943–1944", "1944–1945"], correct: 0 },
        { text: "Normandiya qo'nish operatsiyasi qachon bo'ldi?", options: ["1944-yil 6-iyun", "1943-yil 6-iyun", "1944-yil 22-iyun", "1945-yil 1-yanvar"], correct: 0 },
        { text: "Yalta konferensiyasi (1945) qatnashchilari kimlar edi?", options: ["Stalin, Ruzvelt, Cherchill", "Stalin, Trumen, de Gol", "Ruzvelt, Mao, Cherchill", "Stalin, Attlee, Ruzvelt"], correct: 0 },
        { text: "Ikkinchi jahon urushi Tinch okeanida qachon yakunlandi?", options: ["1945-yil 2-sentabr", "1945-yil 9-may", "1945-yil 8-avgust", "1946-yil 1-yanvar"], correct: 0 },
        { text: "Hiroshimaga atom bomba qachon tashlandi?", options: ["1945-yil 6-avgust", "1945-yil 9-avgust", "1944-yil 6-iyun", "1945-yil 2-sentabr"], correct: 0 },
      ],
    },
  ],
};

/* ================= INGLIZ TILI (CEFR + IELTS + Listening) ================= */

const INGLIZ: SubjectDef = {
  slug: "ingliz-tili",
  name: "Ingliz tili",
  description:
    "CEFR darajalari (A1–B2), IELTS so'z boyligi va Listening audio testlar.",
  icon: "languages",
  color: "emerald",
  order: 5,
  lessons: [
    {
      id: "lesson-eng-cefr",
      title: "CEFR darajalari: A1 dan C2 gacha",
      summary: "Xalqaro til darajalar tizimi va har bir daraja nima bilishni talab qiladi.",
      durationMin: 6,
      content:
        "CEFR (Common European Framework of Reference) — til bilimi darajalarini o'lchaydigan xalqaro tizim. U 6 darajaga bo'linadi:\n\nA1 (Beginner): Salomlashish, o'zingizni tanishtirish, oddiy savollarga javob berish. 'My name is... I am from Uzbekistan.' darajasidagi jumlalar.\n\nA2 (Elementary): Kunlik hayot mavzulari — do'kon, yo'l olish, oila haqida gaplashish; o'tgan zamon (Past Simple) ishlatish.\n\nB1 (Intermediate): Fikr bildirish, reja tuzish, qiyinchiliklar haqida gapirish; Present Perfect va Future turlarini qo'llash.\n\nB2 (Upper-Intermediate): Abstrakt mavzular, tortishuvlar, matn tahlili; shart gaplari (conditionals), majhulli gapirish.\n\nC1 va C2 — ilg'or darajalar: mutaxassislik tili, idioma va nozik ma'nolarni egallash.\n\nMaslahat: har bir darajada 300-500 so'z boyligi qo'shing va kunlik 20-30 daqiqa tinglang — CEFR testlari asosan qo'llashga qaratilgan, shunchaki qoidalar yodlash yetarli emas.",
    },
    {
      id: "lesson-eng-ielts",
      title: "IELTS nima va qanday topshiriladi?",
      summary: "IELTS tuzilishi, ball tizimi va tayyorgarlik yo'riqnomasi.",
      durationMin: 7,
      content:
        "IELTS (International English Language Testing System) — xalqaro universitetlar va migratsiya xizmatlari tan oladigan ingliz tili imtihoni. U ikki turda topshiriladi: Academic (o'qish uchun) va General Training (ish/migratsiya uchun).\n\nImtihon 4 bo'limdan iborat:\n1. Listening (30 daqiqa) — 4 bo'lak audio, 40 savol.\n2. Reading (60 daqiqa) — 3 matn, 40 savol.\n3. Writing (60 daqiqa) — Task 1 (grafik yoki xat) va Task 2 (esse).\n4. Speaking (11–14 daqiqa) — imtihonlovchi bilan suhbat 3 qismda.\n\nBall: har bo'lim 0–9 oralig'ida baholanadi va o'rtachasi umumiy ball bo'ladi. Ko'p universitetlar 6.0–6.5 so'raydi.\n\nTayyorgarlik maslahatlari: kunlik 40 ta yangi so'z yodlang (akademik so'zlar ro'yxati — Academic Word List); har hafta 2 ta IELTS esse yozing va xato turlarini sanab boring; Listening uchun podcastlarni tezlikni o'zgartirib tinglang; Readingda skimming va scanning usullarini mashq qiling.",
    },
    {
      id: "lesson-eng-listening",
      title: "Listeningni yaxshilashning 5 usuli",
      summary: "Audio tushunishni tez o'stirish amaliy yo'llari.",
      durationMin: 5,
      content:
        "1. Har kuni 20 daqiqa tinglang — qisqa podcasttlar (6 Minute English, ESL podcasttlari) muntazamlikdan ko'proq foyda beradi.\n\n2. Transkript bilan tinglang — birinchi marta matnsiz, ikkinchi marta matn bilan, uchinchi marta yana matnsiz: farqlarni taqqoslab, tushunmagan so'zlaringizni yozib oling.\n\n3. Tezlikni o'zgartiring — dastlab 0.75x tezlikda, keyin 1x, keyin 1.25x tezlikda tinglang; natijada odatiy tezlik oson bo'lib qoladi.\n\n4. Shadowing (soya usuli) — audioni tinglab, spiker so'zidan keyin ovoz chiqarib takrorlang: talaffuz va eshitish bir vaqtda o'sadi.\n\n5. Savol bilan tinglang — audio oldidan savolni o'qing, audio orasida javobni 'ov' qiling. Bu IELTS Listening strategiyasi: savol oldindan ma'lum bo'lsa, miya kalit so'zlarni izlaydi.\n\nSaytdagi Listening testlari shu usulga asoslangan: audio tugmasini bosing, gapni tinglang va savolga javob bering. Audio bir necha marta tinglash mumkin.",
    },
  ],
  quizzes: [
    /* CEFR */
    {
      id: "quiz_cefr_a1",
      title: "CEFR A1 (Beginner)",
      description: "Asosiy grammatika va kundalik so'zlar.",
      difficulty: "easy",
      questions: [
        { text: "She ___ a doctor.", options: ["is", "am", "are", "be"], correct: 0 },
        { text: "I ___ from Uzbekistan.", options: ["am", "is", "are", "was"], correct: 0 },
        { text: "Plural of 'book' is ___", options: ["books", "bookes", "bookies", "book"], correct: 0 },
        { text: "What ___ your name?", options: ["is", "are", "am", "do"], correct: 0 },
        { text: "The grass is ___", options: ["green", "blue", "red", "yellow"], correct: 0 },
      ],
    },
    {
      id: "quiz_cefr_a2",
      title: "CEFR A2 (Elementary)",
      description: "O'tgan zamon, qiyoslash va sonlar.",
      difficulty: "middle",
      questions: [
        { text: "Yesterday I ___ to the market.", options: ["went", "go", "going", "gone"], correct: 0 },
        { text: "There ___ many books on the table.", options: ["are", "is", "was", "be"], correct: 0 },
        { text: "Comparative of 'big' is ___", options: ["bigger", "biggest", "more big", "bigly"], correct: 0 },
        { text: "She is ___ than her sister.", options: ["taller", "tall", "tallest", "more tall"], correct: 0 },
        { text: "I have been here ___ 2020.", options: ["since", "for", "from", "at"], correct: 0 },
      ],
    },
    {
      id: "quiz_cefr_b1",
      title: "CEFR B1 (Intermediate)",
      description: "Shart gaplari, reported speech va modal fe'llar.",
      difficulty: "middle",
      questions: [
        { text: "If it rains, we ___ stay home.", options: ["will", "would", "did", "are"], correct: 0 },
        { text: "He said he ___ tired.", options: ["was", "is", "will be", "has been"], correct: 0 },
        { text: "I look forward to ___ from you.", options: ["hearing", "hear", "heard", "have heard"], correct: 0 },
        { text: "This is the man ___ helped me.", options: ["who", "which", "what", "whom"], correct: 0 },
        { text: "By next year, I ___ the course.", options: ["will have finished", "will finish", "finish", "finished"], correct: 0 },
      ],
    },
    {
      id: "quiz_cefr_b2",
      title: "CEFR B2 (Upper-Intermediate)",
      description: "Murakkab grammatika: inversion, passive va gerundlar.",
      difficulty: "hard",
      questions: [
        { text: "If I ___ you, I would apologize.", options: ["were", "was", "am", "will be"], correct: 0 },
        { text: "The report ___ by the committee yesterday.", options: ["was reviewed", "reviewed", "is reviewing", "has review"], correct: 0 },
        { text: "Rarely ___ such talent.", options: ["have I seen", "I have seen", "I saw", "did I saw"], correct: 0 },
        { text: "He denied ___ the money.", options: ["taking", "to take", "take", "taken"], correct: 0 },
        { text: "It's high time we ___.", options: ["left", "leave", "will leave", "are leaving"], correct: 0 },
      ],
    },
    /* IELTS */
    {
      id: "quiz_ielts_easy",
      title: "IELTS Vocabulary (Oson)",
      description: "Asosiy akademik so'zlar va ma'no yaqinlari.",
      difficulty: "easy",
      questions: [
        { text: "'Improve' means ___", options: ["make better", "make worse", "copy", "forget"], correct: 0 },
        { text: "Opposite of 'ancient' is ___", options: ["modern", "old", "beautiful", "big"], correct: 0 },
        { text: "'Approximately' means ___", options: ["about", "exactly", "never", "always"], correct: 0 },
        { text: "Synonym of 'huge' is ___", options: ["enormous", "tiny", "weak", "cheap"], correct: 0 },
        { text: "'Environment' refers to ___", options: ["the natural world", "a school subject", "a type of sport", "a kind of food"], correct: 0 },
      ],
    },
    {
      id: "quiz_ielts_middle",
      title: "IELTS Vocabulary (O'rtacha)",
      description: "Akademik mavzu so'zlari: ta'lim, atrof-muhit, shahar.",
      difficulty: "middle",
      questions: [
        { text: "'Significant' means ___", options: ["important", "funny", "cheap", "short"], correct: 0 },
        { text: "The money you pay to attend university is called ___", options: ["tuition fee", "salary", "rent", "fine"], correct: 0 },
        { text: "'Deforestation' means ___", options: ["cutting down forests", "planting trees", "protecting animals", "building roads"], correct: 0 },
        { text: "Synonym of 'deteriorate' is ___", options: ["worsen", "improve", "increase", "simplify"], correct: 0 },
        { text: "Which is a source of renewable energy?", options: ["solar power", "coal", "oil", "gas"], correct: 0 },
        { text: "'Urban' is related to ___", options: ["cities", "villages", "oceans", "mountains"], correct: 0 },
      ],
    },
    {
      id: "quiz_ielts_hard",
      title: "IELTS Academic (Qiyin)",
      description: "Yuqori darajadagi akademik leksika.",
      difficulty: "hard",
      questions: [
        { text: "'Mitigate' means ___", options: ["make less severe", "make worse", "delay", "copy"], correct: 0 },
        { text: "'Ubiquitous' means ___", options: ["found everywhere", "very rare", "very heavy", "broken"], correct: 0 },
        { text: "Able to continue without harming the planet — ___", options: ["sustainable", "expensive", "fragile", "temporary"], correct: 0 },
        { text: "'Ephemeral' means ___", options: ["short-lived", "eternal", "powerful", "hidden"], correct: 0 },
        { text: "'To advocate' means to ___", options: ["publicly support", "strongly dislike", "forget", "sell"], correct: 0 },
        { text: "'Comprehensive' means ___", options: ["including everything", "very small", "difficult", "modern"], correct: 0 },
      ],
    },
    /* Listening */
    {
      id: "quiz_listening_easy",
      title: "Listening 1 (Oson)",
      description: "Oddiy jumlalarni tinglab, savollarga javob bering.",
      difficulty: "easy",
      kind: "listening",
      questions: [
        {
          text: "What time does the train leave?",
          audio: "The train to Tashkent leaves at seven fifteen in the morning.",
          options: ["7:15", "7:50", "17:15", "9:15"], correct: 0,
        },
        {
          text: "Where does my sister work?",
          audio: "My sister works in a hospital near the city center.",
          options: ["In a hospital", "In a school", "In a bank", "At home"], correct: 0,
        },
        {
          text: "Why was the meeting moved?",
          audio: "The meeting was moved to Friday because the manager is traveling.",
          options: ["The manager is traveling", "It is a holiday", "The room is booked", "Nobody wanted to come"], correct: 0,
        },
        {
          text: "How much does a small cup of coffee cost?",
          audio: "A large cup of coffee costs six thousand soums and a small cup costs four thousand.",
          options: ["4,000 soums", "6,000 soums", "10,000 soums", "14,000 soums"], correct: 0,
        },
        {
          text: "How long is the library open?",
          audio: "The library opens at nine in the morning and closes at eight in the evening.",
          options: ["11 hours", "9 hours", "8 hours", "13 hours"], correct: 0,
        },
      ],
    },
    {
      id: "quiz_listening_middle",
      title: "Listening 2 (O'rtacha)",
      description: "Uzunroq jumlalar: shartlar, narxlar va sabablar.",
      difficulty: "middle",
      kind: "listening",
      questions: [
        {
          text: "How was the flight?",
          audio: "Although the weather was bad, the flight departed on time and arrived twenty minutes early.",
          options: ["On time and early", "Delayed for hours", "Cancelled", "Landed in another city"], correct: 0,
        },
        {
          text: "What happens if the books are late?",
          audio: "You must return the borrowed books within two weeks, or you will pay a small fine each day.",
          options: ["You pay a fine", "You lose your card", "Nothing happens", "The library closes"], correct: 0,
        },
        {
          text: "How much do students pay?",
          audio: "The course fee is three hundred dollars, but students receive a twenty percent discount.",
          options: ["240 dollars", "300 dollars", "280 dollars", "320 dollars"], correct: 0,
        },
        {
          text: "Where are tickets cheaper?",
          audio: "Tickets purchased online are cheaper than tickets bought at the station.",
          options: ["Online", "At the station", "On the train", "At the hotel"], correct: 0,
        },
        {
          text: "Why is tomorrow's lecture cancelled?",
          audio: "The professor will cancel tomorrow's lecture because he is attending a conference abroad.",
          options: ["He is at a conference", "He is ill", "The room is closed", "It is a holiday"], correct: 0,
        },
      ],
    },
    {
      id: "quiz_listening_hard",
      title: "Listening 3 (Qiyin)",
      description: "Murakkab tuzilmali jumlalar: shart, foiz va muddatlar.",
      difficulty: "hard",
      kind: "listening",
      questions: [
        {
          text: "What condition is mentioned about the bridge?",
          audio: "Provided that the funding is approved next month, construction of the new bridge will begin by the end of the year.",
          options: ["Funding must be approved", "Weather must be good", "The city must grow", "People must move out"], correct: 0,
        },
        {
          text: "What did most respondents favor?",
          audio: "The majority of respondents, nearly two thirds, favored extending working hours during the summer season.",
          options: ["Extending working hours", "Reducing salaries", "Closing in summer", "Hiring new staff"], correct: 0,
        },
        {
          text: "How did the energy project perform?",
          audio: "Despite initial skepticism, the renewable energy project surpassed its expected output within the first six months.",
          options: ["Better than expected", "Worse than expected", "Exactly as expected", "It was cancelled"], correct: 0,
        },
        {
          text: "What is the application deadline?",
          audio: "Applications submitted after the fifteenth of March will not be considered under any circumstances.",
          options: ["March 15", "March 5", "April 15", "March 25"], correct: 0,
        },
        {
          text: "Why will the museum stay open until midnight?",
          audio: "The museum will remain open until midnight throughout the summer to accommodate evening visitors.",
          options: ["For evening visitors", "For school groups", "For repairs", "For a concert"], correct: 0,
        },
      ],
    },
  ],
};

/* ================= SEED (idempotent) ================= */

const CONTENT: SubjectDef[] = [
  UZ_TARIXI,
  JAHON_TARIXI,
  INGLIZ,
  ...NEW_SUBJECTS,
];

/** Yangi kontent ham seed qilinishi uchun marker yangi testga ko'chirildi.
 * GEN savollar (id: *_gen*) seed bo'lgach marker mavjud bo'ladi → qayta ishga tushmaydi. */
const MARKER_QUIZ_ID = "quiz_uz_7_easy_gen1";

/**
 * Eski (legacy) 6 ta testni 300 savolga to'ldirish.
 * Bu testlar dastlabki seed-data.json orqali 10 ta savol bilan yaratilgan edi:
 *   Tarix: "Jahon tarixi", "O'zbekiston tarixi"
 *   Matematika: "Arifmetika asoslari", "Algebra va mantiq"
 *   Ingliz tili: "Grammatika asoslari", "So'z boyligi"
 * Idlar barqaror: `${quiz.id}_leg${i+1}` — qayta ishga tushsa ikki nusxa hosil bo'lmaydi.
 */
function normTitle(s: string): string {
  return s.replace(/[\u2018\u2019']/g, "'").toLowerCase().trim();
}

const LEGACY_TARGETS: Array<{ slug: string; title: string; gen: () => QGen[] }> = [
  { slug: "tarix", title: "Jahon tarixi", gen: genLegacyJahonTarixi },
  { slug: "tarix", title: "O'zbekiston tarixi", gen: genLegacyUzTarixi },
  { slug: "matematika", title: "Arifmetika asoslari", gen: genLegacyArifmetika },
  { slug: "matematika", title: "Algebra va mantiq", gen: genLegacyAlgebraMantiq },
  { slug: "ingliz-tili", title: "Grammatika asoslari", gen: genLegacyGrammatika },
  { slug: "ingliz-tili", title: "So'z boyligi", gen: genLegacySozBoyligi },
];

async function topUpLegacyQuizzes(): Promise<void> {
  for (const tgt of LEGACY_TARGETS) {
    const subject = await db.subject.findUnique({ where: { slug: tgt.slug } });
    if (!subject) continue;
    const quizzes = await db.quiz.findMany({ where: { subjectId: subject.id } });
    const quiz = quizzes.find((q) => normTitle(q.title) === normTitle(tgt.title));
    if (!quiz) continue;
    const existing = await db.question.count({ where: { quizId: quiz.id } });
    const need = Math.max(0, BANK_TARGET - existing);
    if (need === 0) continue;
    const genQs = tgt.gen().slice(0, need);
    const legacyQs = genQs.map((qq, i) => ({
      id: `${quiz.id}_leg${i + 1}`,
      quizId: quiz.id,
      text: qq.t.uz,
      options: JSON.stringify(qq.o.map((x) => x.uz)),
      correctIndex: qq.correct,
      audio: qq.audio ?? null,
      order: 1000 + i,
      textRu: qq.t.ru,
      textEn: qq.t.en,
      optionsRu: JSON.stringify(qq.o.map((x) => x.ru)),
      optionsEn: JSON.stringify(qq.o.map((x) => x.en)),
    }));
    const ids = legacyQs.map((x) => x.id);
    const existingRows = await db.question.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
    const have = new Set(existingRows.map((x) => x.id));
    const toInsert = legacyQs.filter((x) => !have.has(x.id));
    if (toInsert.length) {
      await db.question.createMany({ data: toInsert });
    }
  }
}

let running: Promise<void> | null = null;

/** Kontent bazada yo'q bo'lsa — bir marta yaratadi. Har safar xavfsiz. */
export async function ensureContentSeeded(): Promise<void> {
  if (running) return running;
  running = (async () => {
    try {
      const marker = await db.question.findUnique({
        where: { id: MARKER_QUIZ_ID },
        select: { id: true },
      });
      if (marker) {
        // Asosiy kontent allaqachon bazada — faqat eski 6 testni 300 taga tekshiramiz
        await topUpLegacyQuizzes();
        return;
      }

      for (const s of CONTENT) {
        // Qo'shimcha savollarni mavjud testlarga qo'shib chiqamiz
        const sWithExtras: SubjectDef2 = {
          ...s,
          quizzes: s.quizzes.map((q) => ({
            ...q,
            questions: [...q.questions, ...(EXTRA_QUESTIONS[q.id] ?? [])],
          })),
        };
        await db.subject.upsert({
          where: { slug: s.slug },
          update: { name: s.name, description: s.description, icon: s.icon, color: s.color, order: s.order },
          create: {
            slug: s.slug,
            name: s.name,
            description: s.description,
            icon: s.icon,
            color: s.color,
            order: s.order,
          },
        });
        const subject = await db.subject.findUnique({ where: { slug: s.slug } });
        if (!subject) continue;

        // Darslar — mavjudlarini o'tkazib yuboramiz (SQLite skipDuplicates qo'llab-quvvatlamaydi)
        if (sWithExtras.lessons.length) {
          const lessonIds = sWithExtras.lessons.map((l) => l.id);
          const existingLessons = await db.lesson.findMany({
            where: { id: { in: lessonIds } },
            select: { id: true },
          });
          const existingLessonSet = new Set(existingLessons.map((l) => l.id));
          const newLessons = sWithExtras.lessons
            .map((l, li) => ({
              id: l.id,
              subjectId: subject.id,
              title: l.title,
              summary: l.summary,
              content: l.content,
              durationMin: l.durationMin,
              order: li,
            }))
            .filter((l) => !existingLessonSet.has(l.id));
          if (newLessons.length) {
            await db.lesson.createMany({ data: newLessons });
          }
        }

        for (const [qi, q] of sWithExtras.quizzes.entries()) {
          await db.quiz.upsert({
            where: { id: q.id },
            update: {
              title: q.title,
              description: q.description,
              difficulty: DIF[q.difficulty],
              grade: q.grade ?? null,
              kind: q.kind ?? "quiz",
              order: qi,
            },
            create: {
              id: q.id,
              subjectId: subject.id,
              title: q.title,
              description: q.description,
              difficulty: DIF[q.difficulty],
              grade: q.grade ?? null,
              kind: q.kind ?? "quiz",
              order: qi,
            },
          });

          // Generatsiya qilingan savollar — 300 taga to'ldirish
          const need = Math.max(0, BANK_TARGET - q.questions.length);
          const genQs = (GEN_QUESTIONS[q.id] ?? []).slice(0, need);
          const genIds = genQs.map((_, i) => `${q.id}_gen${i + 1}`);
          // Savollar — mavjudlarini o'tkazib yuboramiz
          const questionIds = [
            ...q.questions.map((_, i) => `${q.id}_q${i + 1}`),
            ...genIds,
          ];
          const existingQuestions = await db.question.findMany({
            where: { id: { in: questionIds } },
            select: { id: true },
          });
          const existingQuestionSet = new Set(existingQuestions.map((x) => x.id));
          const allQs: Array<{
            id: string; quizId: string; text: string; options: string;
            correctIndex: number; audio: string | null; order: number;
            textRu: string | null; textEn: string | null;
            optionsRu: string | null; optionsEn: string | null;
          }> = [
            ...q.questions.map((qq, i) => ({
              id: `${q.id}_q${i + 1}`,
              quizId: q.id,
              text: qq.text,
              options: JSON.stringify(qq.options),
              correctIndex: qq.correct,
              audio: qq.audio ?? null,
              order: i,
              textRu: null as string | null,
              textEn: null as string | null,
              optionsRu: null as string | null,
              optionsEn: null as string | null,
            })),
            ...genQs.map((qq, i) => ({
              id: `${q.id}_gen${i + 1}`,
              quizId: q.id,
              text: qq.t.uz,
              options: JSON.stringify(qq.o.map((x) => x.uz)),
              correctIndex: qq.correct,
              audio: qq.audio ?? null,
              order: 1000 + i,
              textRu: qq.t.ru,
              textEn: qq.t.en,
              optionsRu: JSON.stringify(qq.o.map((x) => x.ru)),
              optionsEn: JSON.stringify(qq.o.map((x) => x.en)),
            })),
          ];
          const newQuestions = allQs.filter((x) => !existingQuestionSet.has(x.id));
          if (newQuestions.length) {
            await db.question.createMany({ data: newQuestions });
          }
        }
      }
      await topUpLegacyQuizzes();
      const qCount = await db.question.count();
      console.log(`[seed] kontent tayyor: tarix (uz/jahon 7-11), ingliz (CEFR/IELTS/Listening), matematika, fizika, kimyo, geografiya, ona tili, adabiyot + eski 6 test (har biri ${BANK_TARGET} savol) — jami ${qCount} savol`);
    } catch (e) {
      console.error("[seed] xatolik:", e);
    } finally {
      running = null;
    }
  })();
  return running;
}
