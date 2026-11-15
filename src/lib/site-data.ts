export const SITE = {
  name: "ZamonBilim",
  tagline: "O'quv markazi",
  slogan: "Zamonaviy bilim — kelajak kaliti",
  phone: "+998 90 123 45 67",
  phoneHref: "tel:+998901234567",
  whatsapp: "https://wa.me/998901234567",
  telegram: "https://t.me/zamonbilim",
  email: "info@zamonbilim.uz",
  address: "Toshkent sh., Amir Temur ko'chasi, 108-uy",
  hours: "Dushanba – Shanba: 8:00 – 20:00",
  hoursWeekend: "Yakshanba: 10:00 – 16:00",
};

export type Course = {
  id: string;
  title: string;
  desc: string;
  duration: string;
  price: string;
  icon: string;
  points: string[];
};

export const COURSES: Course[] = [
  {
    id: "english",
    title: "Ingliz tili (General English)",
    desc: "0 dan IELTS darajasigacha bosqichma-bosqich o'rgatish. Gapirish, tinglash, o'qish va yozish ko'nikmalari.",
    duration: "8 oy",
    price: "350 000 so'm/oy",
    icon: "languages",
    points: ["6 daraja: Starter dan Advanced gacha", "Haftada 3 dars, har biri 90 daqiqa", "Speaking club bepul"],
  },
  {
    id: "ielts",
    title: "IELTS 6.5+",
    desc: "Imtihon formatiga to'liq moslashtirilgan intensiv kurs. Mock testlar va individual tahlil bilan.",
    duration: "5 oy",
    price: "450 000 so'm/oy",
    icon: "trophy",
    points: ["Har hafta real formatdagi mock test", "Writing tahlili va shaxsiy xatboshilar", "94% o'quvchilar 6.5+ oladi"],
  },
  {
    id: "math",
    title: "Matematika",
    desc: "5–11 sinflar uchun maktab dasturini mustahkamlash va oliy o'quv yurtlariga tayyorlov.",
    duration: "9 oy",
    price: "350 000 so'm/oy",
    icon: "sigma",
    points: ["Kichik guruhlar: 10–12 o'quvchi", "Haftalik nazorat testlari", "Qiziqarli topshiriqlar va olimpiada tayyorgarligi"],
  },
  {
    id: "dtm",
    title: "Abituriyent kurslari (DTM)",
    desc: "Test sinovlariga chuqur tayyorlov. Blok tanlash, vaqtni taqsimlash va taktik maslahatlar.",
    duration: "10 oy",
    price: "450 000 so'm/oy",
    icon: "book",
    points: ["Ona tili, matematika, tarix bloklari", "Har oyda katta sinov imtihoni", "Reyting jadvali va ota-onaga hisobot"],
  },
  {
    id: "coding",
    title: "Dasturlash (Frontend)",
    desc: "HTML, CSS, JavaScript va React asoslari. Loyihalar bilan portfolio yaratish.",
    duration: "7 oy",
    price: "550 000 so'm/oy",
    icon: "code",
    points: ["Noldan boshlang'ichlar uchun", "Har oyi amaliy loyiha", "Bitiruvda ishga kirishga yordam"],
  },
  {
    id: "mental",
    title: "Mental arifmetika",
    desc: "7–12 yoshdagi bolalar uchun tez hisoblash va xotira rivojlantirish dasturi.",
    duration: "12 oy",
    price: "380 000 so'm/oy",
    icon: "brain",
    points: ["Abakus va mental hisob bosqichlari", "E'tibor va xotirani rivojlantirish", "O'yinlar asosidagi qiziqarli darslar"],
  },
];

export const STATS = [
  { value: "1200+", label: "Bitiruvchilar" },
  { value: "15+", label: "Tajribali ustozlar" },
  { value: "8", label: "Yillik tajriba" },
  { value: "94%", label: "IELTS o'tish darajasi" },
];

export const ADVANTAGES = [
  {
    title: "Kichik guruhlar",
    desc: "Har bir guruhda 10–12 o'quvchi. Ustoz har bir o'quvchiga alohida e'tibor beradi.",
    icon: "users",
  },
  {
    title: "Shaxsiy yondashuv",
    desc: "Darslar o'quvchining darajasi va maqsadiga moslab rejalashtiriladi.",
    icon: "target",
  },
  {
    title: "Haftalik kuzatuv",
    desc: "Har hafta testlar natijalari ota-onalarga SMS va Telegram orqali yuboriladi.",
    icon: "chart",
  },
  {
    title: "Zamonaviy sinfxonalar",
    desc: "Konditsioner, interaktiv doska va yorug' xonalarda qulay muhit yaratilgan.",
    icon: "monitor",
  },
  {
    title: "Bepul sinov darsi",
    desc: "Birinchi dars mutlaqo bepul — darajani aniqlab, guruhga moslashamiz.",
    icon: "gift",
  },
  {
    title: "Bo'lib to'lash",
    desc: "To'lovni oyiga bo'lib to'lash imkoniyati va ko'p kursga chegirmalar bor.",
    icon: "wallet",
  },
];

export type Plan = {
  name: string;
  price: string;
  unit: string;
  desc: string;
  popular?: boolean;
  features: string[];
};

export const PLANS: Plan[] = [
  {
    name: "Boshlang'ich",
    price: "350 000",
    unit: "so'm / oy",
    desc: "Bir kursni tanlab o'qishni boshlash uchun.",
    features: [
      "1 ta kurs (o'z tanlovingiz bilan)",
      "Haftada 3 dars",
      "Haftalik nazorat testlari",
      "Kurs materiallari bepul",
    ],
  },
  {
    name: "Standart",
    price: "600 000",
    unit: "so'm / oy",
    desc: "Eng ko'p tanlanadigan variant — ikki kurs birga.",
    popular: true,
    features: [
      "2 ta kurs (masalan: Ingliz + Matematika)",
      "Haftada 6 dars",
      "Speaking club va qo'shimcha mashg'ulotlar",
      "Shaxsiy rivojlanish rejasi",
      "10% chegirma",
    ],
  },
  {
    name: "Intensiv",
    price: "900 000",
    unit: "so'm / oy",
    desc: "Maksimal natija uchun individual yondashuv bilan.",
    features: [
      "3+ kurs yoki individual darslar",
      "Haftada 9+ dars",
      "Ustoz bilan shaxsiy konsultatsiya",
      "Mock testlar cheksiz",
      "Kurs bitiruviga sertifikat",
      "20% chegirma",
    ],
  },
];

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  initials: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Dilnoza Karimova",
    role: "IELTS 7.5 — Tashkent State University",
    quote:
      "Bu yerga 5.0 darajadan keldim. Ustozlar har bir xatoni tahlilib boradilar, writing hattoki so'zma-so'z to'g'rilanadi. Natija 7.5 bo'ldi — o'zim ham ishonmaganman!",
    initials: "DK",
  },
  {
    name: "Jasur Rahimov",
    role: "Abituriyent, 2025 bitiruvchisi",
    quote:
      "DTM kursida haftalik sinovlar reytingni oshirishga undaydi. Ikkinchi yarim yilda reytingim 800 talikdan 45 talikka chiqtim. Hozir TATUda o'qiyman.",
    initials: "JR",
  },
  {
    name: "Nilufar opa",
    role: "O'quvchi ota-onasi",
    quote:
      "Qizim mental arifmetikaga o'qiydi. Har hafta natijalar Telegramdan kelib turadi, bu juda qulay. Sinfxonalar toza, ustozlar bolaga sabr-qanoat bilan qaraydi.",
    initials: "NA",
  },
  {
    name: "Bekzod Yusupov",
    role: "Frontend dasturlash bitiruvchisi",
    quote:
      "Har oyi loyiha qilib boradilar — bitirganimda 4 ta ishlaydigan saytim bor edi. Portfoliyo bilan ish topish ancha oson bo'ldi.",
    initials: "BY",
  },
];

export const FAQS = [
  {
    q: "Qabul qanday o'tadi?",
    a: "Avval bepul sinov darsiga yozilasiz. Darsda ustoz darajangizni aniqlaydi va natija bo'yicha qaysi guruhga mos kelishingizni aytadi. Sinov darsidan keyin ro'yxatdan o'tish majburiy emas.",
  },
  {
    q: "Darslar qachon va qanday o'tiladi?",
    a: "Guruhlar ertalab (9:00–12:00), kunduzi (14:00–17:00) va kechqurun (17:30–20:00) bo'limlarida ishlaydi. Maktab o'quvchilari uchun darslar asosan 15:00 dan keyin rejalashtiriladi.",
  },
  {
    q: "To'lovni qanday amalga oshiraman?",
    a: "To'lov har oyning 1–5 sanasida Payme, Click, Uzum Bank yoki naqd orqali amalga oshiriladi. Bo'lib to'lash va 2+ kursga 10% chegirma bor. Birinchi sinov darsi mutlaqo bepul.",
  },
  {
    q: "Kurs oxirida sertifikat beriladimi?",
    a: "Ha. Har bir kurs oxirida yakuniy imtihon topshiriladi. Muvaffaqiyatli o'tgan o'quvchilarga markaz rasmiy muhri bilan tasdiqlangan sertifikat beriladi. IELTS uchun British Council/Cambridge orqali xalqaro sertifikat olasiz.",
  },
  {
    q: "Darsga qatnay olmasam nima qilaman?",
    a: "Darsni o'tkazib yuborgan o'quvchi uchun ustoz bepul konsultatsiya berib, mavzuni yakunlashga yordam beradi. Shuningdek, o'z guruhingizdagi boshqa qulay vaqtga borishingiz mumkin.",
  },
];
