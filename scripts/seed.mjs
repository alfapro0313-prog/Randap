import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const db = new PrismaClient();

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const hashOf = (label) =>
  createHash('sha256').update(`randap-demo-${label}-${Math.random()}`).digest('hex');

const THUMB_DIR = path.join(process.cwd(), 'public', 'uploads', 'thumbs');

function avatarSvg(name, c1, c2) {
  const letter = (name.trim()[0] ?? 'R').toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
  </linearGradient></defs>
  <rect width="200" height="200" fill="url(#g)"/>
  <circle cx="100" cy="78" r="42" fill="rgba(255,255,255,0.25)"/>
  <text x="100" y="132" text-anchor="middle" font-family="sans-serif" font-size="84" font-weight="bold" fill="#ffffff">${letter}</text>
</svg>`;
}

async function makeAvatar(name, c1, c2, key) {
  const fileName = `av-${key}.svg`;
  await writeFile(path.join(THUMB_DIR, fileName), avatarSvg(name, c1, c2));
  return `uploads/thumbs/${fileName}`;
}

// ---------- Test savollari ----------
const MATH_BASICS = [
  { t: '24 + 18 = ?', o: ['34', '42', '44', '46'], c: 1 },
  { t: '7 × 8 = ?', o: ['48', '54', '56', '64'], c: 2 },
  { t: '144 : 12 = ?', o: ['11', '12', '13', '14'], c: 1 },
  { t: '250 ning 20% i qancha?', o: ['25', '40', '50', '60'], c: 2 },
  { t: '15 + 27 − 12 = ?', o: ['20', '25', '30', '32'], c: 2 },
  { t: '9² (9 ning kvadrati) = ?', o: ['72', '81', '89', '99'], c: 1 },
  { t: '3/4 kasrni foizda ifodalang', o: ['25%', '50%', '75%', '80%'], c: 2 },
  { t: '1 km necha metr?', o: ['100', '500', '1000', '10000'], c: 2 },
  { t: '48 : 6 + 5 = ?', o: ['8', '11', '13', '18'], c: 2 },
  { t: 'Ketma-ketlikni davom ettiring: 2, 4, 8, 16, ...', o: ['20', '24', '32', '64'], c: 2 },
];

const MATH_ALGEBRA = [
  { t: 'x + 7 = 15 bo‘lsa, x = ?', o: ['6', '7', '8', '9'], c: 2 },
  { t: '3x = 27 bo‘lsa, x = ?', o: ['6', '8', '9', '12'], c: 2 },
  { t: '2x − 5 = 11 bo‘lsa, x = ?', o: ['3', '5', '8', '16'], c: 2 },
  { t: '12 × 5 − 10 = ?', o: ['40', '50', '60', '70'], c: 1 },
  { t: 'a = 4, b = 3 bo‘lsa, a² + b² = ?', o: ['7', '12', '14', '25'], c: 3 },
  { t: 'Fibonacci ketma-ketligi: 1, 1, 2, 3, 5, 8, ...', o: ['11', '12', '13', '21'], c: 2 },
  { t: '18 sonining bo‘luvchilari nechta?', o: ['4', '5', '6', '8'], c: 2 },
  { t: 'Tomonlari 6 va 8 bo‘lgan to‘rtburchakning perimetri?', o: ['14', '24', '28', '48'], c: 2 },
  { t: '√64 = ?', o: ['6', '7', '8', '16'], c: 2 },
  { t: '5 ta qalam 15 000 so‘m bo‘lsa, 8 ta qalam necha so‘m?', o: ['18 000', '21 000', '24 000', '27 000'], c: 2 },
];

const ENG_GRAMMAR = [
  { t: 'She ___ a doctor.', o: ['am', 'is', 'are', 'be'], c: 1 },
  { t: 'They ___ playing football now.', o: ['am', 'is', 'are', 'do'], c: 2 },
  { t: 'I ___ to school every day.', o: ['goes', 'going', 'go', 'gone'], c: 2 },
  { t: 'There ___ many books on the table.', o: ['is', 'are', 'was', 'be'], c: 1 },
  { t: '"go" fe’lining o‘tgan zamon shakli?', o: ['goed', 'gone', 'went', 'going'], c: 2 },
  { t: 'This is ___ apple.', o: ['a', 'an', 'the', '—'], c: 1 },
  { t: 'She ___ TV last night.', o: ['watch', 'watches', 'watched', 'watching'], c: 2 },
  { t: 'We ___ finished our homework.', o: ['has', 'have', 'had', 'having'], c: 1 },
  { t: '"big" so‘zining qiyos darajasi?', o: ['big', 'bigger', 'biggest', 'more big'], c: 1 },
  { t: 'I am interested ___ music.', o: ['at', 'on', 'in', 'for'], c: 2 },
];

const ENG_VOCAB = [
  { t: '"Kitob" so‘zining inglizchasi?', o: ['bag', 'book', 'box', 'boot'], c: 1 },
  { t: '"Do‘st" so‘zining inglizchasi?', o: ['frend', 'friend', 'freind', 'friende'], c: 1 },
  { t: '"Water" degani nima?', o: ['havo', 'olov', 'suv', 'tuproq'], c: 2 },
  { t: '"hot" so‘zining antonimi?', o: ['warm', 'cold', 'cool', 'heat'], c: 1 },
  { t: '"Teacher" degani kim?', o: ['shifokor', 'muhandis', 'o‘qituvchi', 'haydovchi'], c: 2 },
  { t: '"Morning" qachon bo‘ladi?', o: ['tongda', 'tushda', 'kechqurun', 'tunda'], c: 0 },
  { t: '"buy" fe’lining antonimi?', o: ['buy', 'sold', 'sell', 'sale'], c: 2 },
  { t: '"Family" degani nima?', o: ['maktab', 'oila', 'shahar', 'davlat'], c: 1 },
  { t: '"Three" qaysi raqam?', o: ['2', '3', '4', '5'], c: 1 },
  { t: '"Beautiful" so‘zining sinonimi?', o: ['ugly', 'nice', 'bad', 'small'], c: 1 },
];

const HIST_WORLD = [
  { t: 'Ikkinchi jahon urushi qaysi yillarda bo‘lgan?', o: ['1914–1918', '1939–1945', '1941–1945', '1945–1950'], c: 1 },
  { t: 'AQShning birinchi prezidenti kim?', o: ['Jorj Vashington', 'Abraham Linkoln', 'Tomas Jefferson', 'Franklin Ruzvelt'], c: 0 },
  { t: 'Buyuk geografik kashfiyotlar davri qaysi asrlarni qamrab oladi?', o: ['XII–XIV', 'XV–XVII', 'XVII–XIX', 'X–XII'], c: 1 },
  { t: 'Rim sarkardasi, "Sentaniborga kelgan" — "Men uni oldim" deb yozgan shaxs?', o: ['Yuliy Tsezar', 'Neron', 'Avgust', 'Karol Buyuk'], c: 0 },
  { t: '1492-yilda Amerika qit‘asiga yetib borgan dengizchi?', o: ['Kristofor Kolumb', 'Magellan', 'Vasko da Gama', 'Jeyms Kuk'], c: 0 },
  { t: 'Birinchi jahon urushi qaysi yilda boshlangan?', o: ['1912', '1914', '1916', '1918'], c: 1 },
  { t: '1789-yilda qaysi mamlakatda Buyuk inqilob sodir bo‘ldi?', o: ['Angliya', 'Fransiya', 'Germaniya', 'Rossiya'], c: 1 },
  { t: 'Berlin devori qaysi yilda qulatildi?', o: ['1985', '1989', '1991', '1993'], c: 1 },
  { t: 'Qog‘oz birinchi bo‘lib qaysi davlatda ixtiro qilingan?', o: ['Misr', 'Yunoniston', 'Xitoy', 'Hindiston'], c: 2 },
  { t: '"Mona Liza" suratining muallifi kim?', o: ['Leonardo da Vinchi', 'Rafael', 'Mikelanjelo', 'Van Gog'], c: 0 },
];

const HIST_UZ = [
  { t: 'Amir Temur qaysi shaharni poytaxt qilgan?', o: ['Buxoro', 'Xiva', 'Samarqand', 'Toshkent'], c: 2 },
  { t: 'Buyuk ipak yo‘li qaysi shaharlar orqali o‘tgan?', o: ['Samarqand va Buxoro', 'Parij va London', 'Moskva va Kiyev', 'Tokio va Seul'], c: 0 },
  { t: 'Al-Xorazmiy qanday soha olimi edi?', o: ['Shoir', 'Matematik', 'Sarkarda', 'Rassom'], c: 1 },
  { t: 'O‘zbekiston mustaqilligi qachon e‘lon qilingan?', o: ['1990-yil', '1991-yil 31-avgust', '1992-yil', '1993-yil'], c: 1 },
  { t: 'Registon maydoni qaysi shaharda joylashgan?', o: ['Buxoro', 'Samarqand', 'Xiva', 'Toshkent'], c: 1 },
  { t: 'Imom al-Buxoriy qayerda dafn etilgan?', o: ['Xivada', 'Buxoro yaqinida', 'Samarqandda', 'Toshkentda'], c: 1 },
  { t: 'Bobur Hindistonda qaysi sulolaga asos soldi?', o: ['Saljuqlar', 'Buyuk Mo‘g‘ullar', 'Temuriylar', 'Safaviylar'], c: 1 },
  { t: '"O‘zbek" so‘zi dastlab qanday ma‘noni anglatgan?', o: ['Erkin odam', 'O‘zining egasi', 'Jangchi', 'Dehqon'], c: 1 },
  { t: 'Mirzo Ulug‘bek asosan qaysi soha bilan shug‘ullangan?', o: ['Astronomiya', 'Tibbiyot', 'Savdo', 'Sport'], c: 0 },
  { t: 'Toshkent metropoliteni qaysi yilda ochilgan?', o: ['1967', '1971', '1977', '1985'], c: 2 },
];

// ---------- Darslar (o‘rgatuvlar) ----------
const LESSONS = {
  matematika: [
    {
      title: 'Qo‘shish va ayirish sirlari',
      summary: 'Ustunli hisob usuli bilan katta sonlarni tez qo‘shish va ayirishni o‘rganing.',
      durationMin: 6,
      content: `Ustunli hisob — katta sonlarni qo‘shish va ayirishning eng qulay usuli. Sonlarni biriga yozamiz: birliklar birliklar ostiga, o‘nliklar o‘nliklar ostiga tushadi.

Qo‘shishda birliklardan boshlaymiz. Agar birliklar yig‘indisi 10 dan oshsa, 1 ni o‘nliklar ustiga "yodlab" qo‘yamiz — bunga ko‘chirish (bitta o‘tkazish) deyiladi. Masalan: 47 + 38 = 85, chunki 7+8=15, 5 yozamiz va 1 ni yodlaymiz; 4+3+1=8.

Ayirishda kichik son katta sondan ayiriladi. Agar ustundagi son yetmasa, qo‘shni o‘nlikdan 1 "qarz" olamiz. Masalan: 52 − 27: birliklarda 2−7 yetmaydi, 12−7=5 yozamiz, o‘nlikdan 1 qarz oldik: 4−2=2. Javob 25.

Mashq qilish siri: har kuni 10 ta misol yechish. Bir haftada ustunli hisob avtomatiklashadi va testlarda vaqt yetib boradi.`,
    },
    {
      title: 'Foizlar bilan ishlash',
      summary: 'Foiz, kasr va o‘nli kasrlar orasidagi bog‘lanishni oddiy misollarda o‘rganamiz.',
      durationMin: 8,
      content: `Foiz — butunning yuzdan bir qismi. 100% — butun narsa, 50% — yarimi, 25% — choragi.

Sonning foizini topish uchun sonni foizga ko‘rib, 100 ga bo‘lamiz. Masalan: 250 ning 20% i = 250 × 20 : 100 = 50. Tez usul: 20% = 1/5, demak 250 ni 5 ga bo‘lamiz — 50.

Foizdan sonni topish teskari masala. "40 sonining 25% i nechaga teng?" — 40 × 25 : 100 = 10. Yoki 25% = 1/4, 40 : 4 = 10.

Hayotda qo‘llash: do‘konda 15 000 so‘mlik narsaga 30% chegirma bo‘lsa, chegirma miqdori 15 000 × 30 : 100 = 4 500 so‘m, to‘lov uchun 10 500 so‘m qoladi. Testlarda foiz masalalari shu tarzda yechiladi.`,
    },
    {
      title: 'Tenglama yechishning 3 qadami',
      summary: 'Har qanday oddiy tenglamani bir xil 3 qadam bilan yechish o‘rgatiladi.',
      durationMin: 7,
      content: `Tenglama — noma‘lum son (x) ishtirok etgan tenglik. Har qanday oddiy tenglama 3 qadamda yechiladi.

1-qadam: Qavslarni ochish va o‘xshash xadlarni birlashtirish. Masalan: 2x + 3 + x = 18 → 3x + 3 = 18.

2-qadam: Sonlarni tenglikning boshqa tomoniga o‘tkazish. O‘tkazganda belgi teskari bo‘ladi: "+" bo‘lsa "−" bo‘ladi. 3x = 18 − 3 = 15.

3-qadam: x ning koeffitsiyentiga bo‘lish. x = 15 : 3 = 5.

Tekshirish majburiy qadam: 2×5 + 3 + 5 = 18 — tenglik o‘rindi, demak javob to‘g‘ri. Testda ham javobni har doim tekshirib ko‘ring — 1 daqiqada 1 ball saqlab qoladi.`,
    },
  ],
  'ingliz-tili': [
    {
      title: 'Present Simple qoidasi',
      summary: 'Har kuni takrorlanadigan amallar haqida gapirishning asosiy qoidasi.',
      durationMin: 6,
      content: `Present Simple — muntazam, takrorlanadigan amallar uchun ishlatiladi: I go to school every day.

Qoida: I, you, we, they bilan fe'l o'zgarmaydi (they play). U, u, u (he, she, it) bilan fe'lga -s qo'shiladi: she plays, he goes. Masalan: "She watches TV" — u televizor ko'radi.

Savol va inkor qilishda do/does yordamchisi ishlatiladi: Do you play? He does not (doesn't) play. Eslatib o'tamiz: does ishlatilganda fe'lga -s qo'shilmaydi, chunki -s allaqachon does ichida bor.

Signal so'zlar: always, usually, often, sometimes, never, every day. Gapda shu so'zlar ko'rinsa — Present Simple ishlatiladi. Testda avval signal so'zlarni toping, keyin javobni tanlang.`,
    },
    {
      title: 'A / An / The artikllari',
      summary: 'Uchta artikkelda qachon ishlatilishini 5 ta qoidada tushuntirib beramiz.',
      durationMin: 5,
      content: `Ingliz tilida 3 ta artikkel bor: a, an, the.

"A" undosh tovush bilan boshlanadigan so'z oldidan keladi: a book, a car. "An" unli tovush bilan boshlanadigan so'z oldidan: an apple, an egg. E'tibor bering: tovush muhim, harf emas — "an hour" (h o'qilmaydi), "a university" (yu deb o'qiladi).

"The" aniq, ma'lum narsa oldidan keladi: The sun is bright (quyosh — yagona). Ikkinchi marta tilga olinganda ham the ishlatiladi: I saw a dog. The dog was big.

Nomavval oziq-ovqat va abstrakt tushunchalar oldidan artikkel qo'yilmaydi: I like water, Life is beautiful. Testda avval "aniqmi yoki umumiy mi?" deb so'rang — javob o'sha suhbatdan chiqadi.`,
    },
    {
      title: 'Har kuni 10 so‘z usuli',
      summary: 'So‘z boyligini tez oshirishning ilmiy asoslangan usuli.',
      durationMin: 6,
      content: `So'z boyligi — til o'rganishning poydevori. Ilmiy tadqiqotlarga ko'ra, bir so'zni 7 marta har xil kontekstda ko'rgan odam uni abadiy eslab qoladi.

Usul: har kuni 10 ta yangi so'z + 7 kun takrorlash. Birinchi kuni yozing, ikkinchi kuni gapda ishlatib ko'ring, to'rtinchi kuni o'zingizga savol tashlang, yettinchi kuni eski daftaringizni tekshiring.

So'zlarni mavzu bo'yicha o'rganing: bir kunda "oshxona" so'zlari, boshqa kuni "yo'l" so'zlari. Mavzuli guruhlar miya uchun bog'lanish hosil qiladi.

Ilova: telefon tilini inglizchaga o'zgartiring — kunda 50+ so'zni tabiiy tarzda ko'rasiz. Bu usul kuniga 10 so'z bilan bir yilda 3 650 so'z degani — kundalik gaplashish uchun yetarli.`,
    },
  ],
  tarix: [
    {
      title: 'Amir Temur va Temuriylar davri',
      summary: 'Buyuk sarkardaning yuksalishi va Temuriylar sulolasining madaniy merosi.',
      durationMin: 8,
      content: `Amir Temur (1336–1405) Movarounnahrning buyuk sarkardasi va davlat arbobi. U Samarqandni poytaxt qilib, ulkan imperiya yaratdi — Hindistondan Yaqin Sharqgacha.

Temur nafaqat sarkarda, balki davlat arbobi edi: ilm-fanga e'tibor berdi, Samarqandni dunyoning eng go'zal shaharlaridan biriga aylantirdi. Bibixonim masjidi, Go'ri Amir majmuasi — shu davr yodgorliklari.

Uning nabirasi Mirzo Ulug'bek — dunyoga mashhur astronom va olim. Ulug'bek rasadxonasi va uning "Ziji jadidi Sultoniy" yulduzlar jadvali o'sha davrning eng aniq astronomik hisob-kitoblari edi.

Temuriylar davri "Timarid renesansi" deb ataladi: shoir Navoiy, olim Koshiy, miniaturachi Kamoliddin Behzod — hammasi shu davr farzandlari. Testlarda sanalar: Temur 1336-yilda tug'ilgan, 1405-yilda vafot etgan.`,
    },
    {
      title: 'Buyuk ipak yo‘li',
      summary: 'Sharq va G‘arbni bog‘lagan eng qadimgi savdo yo‘li tarixi.',
      durationMin: 7,
      content: `Buyuk ipak yo'li — Xitoydan O'rta yer dengizigacha cho'zilgan qadimgi savdo yo'li. Uzunligi 7 000 km dan ortiq. Miloddan avvalgi II asrda ochilgan.

Yo'l faqat ipak emas: ziravorlar, qog'oz, shisha, zargarlik buyumlari, kitoblar ham almashtirildi. Shu yo'l orqali dinlar (buddizm, islom), ilmlar va san'at ham tarqaldi.

Hozirgi O'zbekiston hududi — ipak yo'lining markazi. Samarqand, Buxoro, Xiva, Termiz, Shahrisabz — karvon shaharlari. "Dunyo yarim markazi" deya ulug'langan Buxoro eng katta ilm markazlaridan biri edi.

Karvonlar kuniga 30-40 km yurardi. Safar Xitoyni O'rta yer dengizi bilan bog'lash uchun oylar davom etardi. Har shaharda rabotlar (mehmonxonalar) va chor-savdolar mavjud bo'lgan. Testlarda shu shahar nomlari va sanalar ko'p uchraydi.`,
    },
    {
      title: 'Mustaqil O‘zbekiston yillari',
      summary: '1991-yildan buyotni mustaqillik yillari — asosiy sanalar va hodisalar.',
      durationMin: 6,
      content: `1991-yil 31-avgust — O'zbekiston Respublikasi mustaqilligi e'lon qilingan kun. 1991-yil 1-sentyabrda Oliy Kengash bu qarorni tasdiqladi. Hozir 1-sentyabr — Mustaqillik kuni, bayram kun.

1991-yil dekabrda O'zbekiston BMTga a'zo bo'ldi. 1992-yil — Konstitutsiya qabul qilindi, milliy valyuta so'm-kuponga o'tish boshlandi. 1994-yilda so'm milliy valyuta sifatida joriy etildi.

Mustaqillikning dastlabki yillarida davlat tili o'zbek tili (lotin yozuviga o'tish 1993-yilda boshlandi), davlat gerbi, bayrog'i va madhiyasi qabul qilindi.

Bugungi kunda O'zbekiston dunyoning 100+ davlati bilan diplomatik munosabatlarga ega. Testlarda eng muhim sana — 1991-yil 31-avgust. Bu sanani har doim eslab qoling.`,
    },
  ],
};

// ---------- Fanlar ----------
const SUBJECTS = [
  {
    slug: 'matematika',
    name: 'Matematika',
    description: 'Arifmetika, algebra va mantiq masalalari — bosqichma-bosqich o‘rganing.',
    icon: 'calculator',
    color: 'amber',
    quizzes: [
      { title: 'Arifmetika asoslari', description: 'Qo‘shish, ayirish, ko‘paytirish va foizlar — 10 ta savol.', questions: MATH_BASICS, order: 0 },
      { title: 'Algebra va mantiq', description: 'Tenglamalar, ketma-ketliklar va geometriya — 10 ta savol.', questions: MATH_ALGEBRA, order: 1 },
    ],
  },
  {
    slug: 'ingliz-tili',
    name: 'Ingliz tili',
    description: 'Grammatika va so‘z boyligi testlari bilan tilni mustahkamlang.',
    icon: 'languages',
    color: 'emerald',
    quizzes: [
      { title: 'Grammatika asoslari', description: 'To be, zamonlar, artikllar — 10 ta savol.', questions: ENG_GRAMMAR, order: 0 },
      { title: 'So‘z boyligi', description: 'Tarjima, sinonim va antonimlar — 10 ta savol.', questions: ENG_VOCAB, order: 1 },
    ],
  },
  {
    slug: 'tarix',
    name: 'Tarix',
    description: 'Jahon va O‘zbekiston tarixidan qiziqarli testlar.',
    icon: 'landmark',
    color: 'rose',
    quizzes: [
      { title: 'Jahon tarixi', description: 'Buyuk kashfiyotlar, urushlar va madaniyat — 10 ta savol.', questions: HIST_WORLD, order: 0 },
      { title: 'O‘zbekiston tarixi', description: 'Temuriylar, ipak yo‘li va mustaqillik — 10 ta savol.', questions: HIST_UZ, order: 1 },
    ],
  },
];

async function main() {
  await mkdir(THUMB_DIR, { recursive: true });

  await db.quizAttempt.deleteMany();
  await db.question.deleteMany();
  await db.quiz.deleteMany();
  await db.lesson.deleteMany();
  await db.subject.deleteMany();
  await db.comment.deleteMany();
  await db.like.deleteMany();
  await db.subscription.deleteMany();
  await db.video.deleteMany();
  await db.user.deleteMany();

  // Kanallar + balli foydalanuvchilar (hammasi "Ballar" sahifasida chiqadi)
  const people = [
    { key: 'studio', deviceKey: 'demo-studio-key', name: 'Randap Studio', handle: '@randapstudio', points: 240, colors: ['#dc2626', '#f97316'] },
    { key: 'oila', deviceKey: 'demo-oila-key', name: 'Oila Media', handle: '@oilamedia', points: 170, colors: ['#059669', '#84cc16'] },
    { key: 'tech', deviceKey: 'demo-tech-key', name: 'Tech Uz', handle: '@techuz', points: 320, colors: ['#7c3aed', '#c084fc'] },
    { key: 'aziz', deviceKey: 'demo-aziz-key', name: 'Aziz Karimov', handle: '@azizkarimov', points: 460, colors: ['#f59e0b', '#ef4444'] },
    { key: 'dilnoza', deviceKey: 'demo-dilnoza-key', name: 'Dilnoza Rahimova', handle: '@dilnoza', points: 385, colors: ['#db2777', '#fb7185'] },
    { key: 'jasur', deviceKey: 'demo-jasur-key', name: 'Jasur Toshmatov', handle: '@jasur', points: 300, colors: ['#0891b2', '#22d3ee'] },
    { key: 'malika', deviceKey: 'demo-malika-key', name: 'Malika Yusupova', handle: '@malika', points: 215, colors: ['#16a34a', '#4ade80'] },
    { key: 'bekzod', deviceKey: 'demo-bekzod-key', name: 'Bekzod Aliyev', handle: '@bekzod', points: 130, colors: ['#9333ea', '#e879f9'] },
  ];

  const users = {};
  for (const p of people) {
    const avatar = await makeAvatar(p.name, p.colors[0], p.colors[1], p.key);
    users[p.key] = await db.user.create({
      data: {
        deviceKey: p.deviceKey,
        name: p.name,
        handle: p.handle,
        points: p.points,
        avatar,
      },
    });
  }

  const studio = users.studio;
  const oila = users.oila;
  const tech = users.tech;

  const videos = [
    { title: "Toshkent metropoliteni — to'liq sayohat", desc: "Shaharostaning eng go'zal bekatlari bo'ylab sayohat. Ovqat olib boring va yaxshi yorug'lik!", path: 'demo-metro', dur: 18, kind: 'video', up: studio, views: rand(12000, 98000) },
    { title: 'Osh qanday tayyorlanadi? Tez retsept', desc: "Haqiqiy osh retsepti: zirvador guruch, sabzi va gazanda mol go'shti. Qadam-baqadam ko'rsatilgan.", path: 'demo-osh', dur: 12, kind: 'video', up: oila, views: rand(5000, 50000) },
    { title: 'Dasturlashni 0 dan boshlash — 1-dars', desc: "HTML, CSS va JavaScript asoslari. Birinchi darsda nimalarni o'rganamiz? Ko'ring va izohga savol qoldiring!", path: 'demo-dars', dur: 15, kind: 'video', up: tech, views: rand(3000, 30000) },
    { title: 'Xiva shahri — sharq durdonasi', desc: "Ichan qal'a, Muhammad Aminzon minorasi va eski shahar ko'chalari. 4K sifatda suratga olindi.", path: 'demo-xiva', dur: 14, kind: 'video', up: studio, views: rand(8000, 70000) },
    { title: 'Bulutlar ustidan parvoz', desc: 'Samolyot oynasidan olingan lahzalar. Qisqa ammo taassurotli!', path: 'demo-short-parvoz', dur: 10, kind: 'short', up: studio, views: rand(20000, 150000) },
    { title: '5 soniyada fokus testi', desc: "Diqqatni tekshiring: ko'ring va javobini izohlarda yozing.", path: 'demo-short-fokus', dur: 8, kind: 'short', up: tech, views: rand(10000, 90000) },
    { title: 'Piyola choy va shahar manzarasi', desc: 'Tong vaqti choyxona manzarasi. Yaxshi kun boshlanishi!', path: 'demo-short-choy', dur: 12, kind: 'short', up: oila, views: rand(4000, 40000) },
  ];

  const commentTexts = [
    "Zo'r video! Davomini kutamiz.",
    'Rahmat, juda foydali bo‘ldi.',
    'Qayerda suratga olgansiz? Joy chiroyli ekan.',
    'Izohdagi maslahatlar menga yordam berdi.',
    "Yana shunaqangi videolar qo'ying!",
    'Sifati juda yaxshi ekan.',
  ];

  for (const v of videos) {
    const created = await db.video.create({
      data: {
        title: v.title,
        description: v.desc,
        thumbPath: `uploads/thumbs/${v.path}.jpg`,
        videoPath: `uploads/videos/${v.path}.mp4`,
        hash: hashOf(v.path),
        kind: v.kind,
        durationSec: v.dur,
        allowComments: true,
        views: v.views,
        uploaderId: v.up.id,
      },
    });

    const likeCount = rand(20, 900);
    for (let i = 0; i < likeCount; i++) {
      await db.like
        .create({ data: { videoId: created.id, deviceId: `demo-like-${i}` } })
        .catch(() => {});
    }

    const commentCount = rand(1, 3);
    for (let i = 0; i < commentCount; i++) {
      await db.comment.create({
        data: {
          videoId: created.id,
          authorId: [studio, oila, tech][rand(0, 2)].id,
          body: commentTexts[rand(0, commentTexts.length - 1)],
        },
      });
    }
  }

  // Fanlar + testlar + darslar
  let subjectOrder = 0;
  for (const s of SUBJECTS) {
    const subject = await db.subject.create({
      data: {
        slug: s.slug,
        name: s.name,
        description: s.description,
        icon: s.icon,
        color: s.color,
        order: subjectOrder++,
      },
    });

    for (const q of s.quizzes) {
      const quiz = await db.quiz.create({
        data: {
          subjectId: subject.id,
          title: q.title,
          description: q.description,
          order: q.order,
        },
      });
      let qi = 0;
      for (const question of q.questions) {
        await db.question.create({
          data: {
            quizId: quiz.id,
            text: question.t,
            options: JSON.stringify(question.o),
            correctIndex: question.c,
            order: qi++,
          },
        });
      }
    }

    let li = 0;
    for (const lesson of LESSONS[s.slug] ?? []) {
      await db.lesson.create({
        data: {
          subjectId: subject.id,
          title: lesson.title,
          summary: lesson.summary,
          content: lesson.content,
          durationMin: lesson.durationMin,
          order: li++,
        },
      });
    }
  }

  const counts = {
    users: await db.user.count(),
    videos: await db.video.count(),
    likes: await db.like.count(),
    comments: await db.comment.count(),
    subjects: await db.subject.count(),
    quizzes: await db.quiz.count(),
    questions: await db.question.count(),
    lessons: await db.lesson.count(),
  };
  console.log('Seed tugadi:', JSON.stringify(counts));
  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
