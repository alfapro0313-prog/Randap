import type { Metadata } from "next";
import { LandingFooter, LoginCTA, OtherSections, InfoCard, FaqBlock, faqJsonLd } from "@/components/randap/landing-shared";

/**
 * Ochiq (loginsiz) landing sahifa — /organish
 * O'rganish darslari: uzun o'rgatuv maqolalar.
 */

export const metadata: Metadata = {
  title: "O'rganish darslari — ingliz tili, xotira, matematika va tarix",
  description:
    "Randap o'rganish bo'limi: ingliz tili o'rganish, xotirani mustahkamlash, matematika, fizika, kimyo, geografiya, ona tili va adabiyot bo'yicha qadam-baqadam darslar, din va hayot burchlari. Bepul o'qing.",
  keywords: [
    "o'rganish darslari",
    "ingliz tili o'rganish",
    "xotirani mustahkamlash",
    "matematika o'rganish",
    "onlayn darslar o'zbekcha",
    "bepul darslar",
    "din va hayot",
  ],
  alternates: { canonical: "/organish" },
};

const FAQ = [
  {
    q: "O'rganish bo'limida nima bor?",
    a: "Har fan bo'yicha uzun o'rgatuv darslari: ingliz tili (CEFR'dan C2 gacha), xotira (eslab qolish ilmi), matematika, fizika, kimyo, geografiya, ona tili va adabiyot, tarix, rus tili. Shuningdek 'Din va hayot burchlari' rubrikasi bor.",
  },
  {
    q: "Darslar kimlar uchun?",
    a: "Maktab o'quvchilari, imtihonga tayyorlanuvchilar va o'z-o'zini o'rganmoqchi bo'lgan har kim uchun. Darslar oddiy tilda, qadam-baqadam yozilgan — murakkab atamalar tushuntirib beriladi.",
  },
  {
    q: "Darslar testlar bilan bog'liqmi?",
    a: "Ha. Har dars o'sha fanning testlariga tayyorlaydi: darsni o'qiganingizdan keyin shu fandan test yechsangiz, mavzu mustahkamlanadi.",
  },
  {
    q: "O'qish bepulmi?",
    a: "Ha, barcha darslar bepul. Saytga Google akkauntingiz bilan kirsangiz, o'qigan darslaringiz va davomiylik saqlanadi.",
  },
];

export default function OrganishLandingPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQ)) }}
      />

      <p className="text-sm font-semibold text-red-600">Randap — randap.vercel.app</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        O'rganish darslari — qadam-baqadam bilim
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Randap'ning O'rganish bo'limi — har fandan uzun o'rgatuv darslari
        to'plami. Bu maktab kursining xulosasi emas, balki mavzuni noldan
        tushuntiruvchi qo'llanmalar: poydevordan masala yechishning 4
        qadamigacha, xotira qanday ishlashi va uni kuchaytirish, ingliz tili
        darajalari, Navoiydan Qodiriygacha adabiyotni esda saqlash tizimi va
        boshqalar.
      </p>

      <LoginCTA primary="Darslarni o'qishni boshlash" secondary="Bepul qo'shilish" />

      <h2 className="mt-10 text-2xl font-bold text-foreground">
        Qanday darslar bor?
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          title="Xotira (Memory)"
          text="Eslab qolish qanday ishlaydi va uni qanday kuchaytirish kerak — har fan uchun amaliy usullar bilan."
        />
        <InfoCard
          title="Ingliz tili"
          text="CEFR darajalari (A1 dan C2 gacha), IELTS nima va qanday topshiriladi, Listeningni yaxshilashning 5 usuli."
        />
        <InfoCard
          title="Matematika"
          text="Poydevordan tortib masala yechishning 4 qadamigacha: foizlar, tenglamalar va geometriya — qadam-baqadam o'rganish rejasi."
        />
        <InfoCard
          title="Fizika va kimyo"
          text="Nyuton qonunlari hayotda, elektr zanjirlari va formulalarni tushunish kaliti; davriy jadval, reaksiyalar va formulalar bilan do'stlashuv."
        />
        <InfoCard
          title="Tarix va geografiya"
          text="Xaritalar, O'zbekiston va jahon — sanalar va joylarni esda saqlash san'ati."
        />
        <InfoCard
          title="Ona tili, adabiyot, rus tili"
          text="Qoidalar, imlo va gap tuzish — aniq va chiroyli yozish yo'llari; Navoiydan Qodiriygacha asarlar tizimi; rus alifbosi va 6 ta kelishik."
        />
        <InfoCard
          title="Din va hayot burchlari"
          text="Diniy bilimlar va hayotiy mavzular — oddiy va ochiq tilda yozilgan rubrika."
        />
        <InfoCard
          title="Testlar bilan bog'liq"
          text="Har dars o'sha fanning testlariga tayyorlaydi — o'qing, keyin yeching, mavzu mustahkamlansin."
        />
      </div>

      <h2 className="mt-10 text-2xl font-bold text-foreground">
        Ko'p so'raladigan savollar
      </h2>
      <FaqBlock faq={FAQ} />

      <OtherSections current="/organish" />
      <LandingFooter />
    </main>
  );
}
