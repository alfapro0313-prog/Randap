import type { Metadata } from "next";
import { LandingFooter, LoginCTA, OtherSections, InfoCard, FaqBlock, faqJsonLd } from "@/components/randap/landing-shared";

/**
 * Ochiq (loginsiz) landing sahifa — /chat
 * Randap Chat: jonli suhbat, random chat, stikerlar, rasmlar.
 */

export const metadata: Metadata = {
  title: "Randap Chat — o'zbekcha jonli chat, random suhbat",
  description:
    "Randap Chat — odamlar bilan jonli suhbat: yozishma, stikerlar, rasmlar va random chat. Yangi odamlar bilan tanishing, do'stlaringiz bilan suhbatlashing — bepul va o'zbek tilida.",
  keywords: [
    "o'zbekcha chat",
    "random chat",
    "jonli suhbat",
    "onlayn chat o'zbek",
    "yangi odamlar bilan tanishish",
    "bepul chat",
  ],
  alternates: { canonical: "/chat" },
};

const FAQ = [
  {
    q: "Randap Chat nima?",
    a: "Randap Chat — saytdagi odamlar bilan jonli suhbat quradigan bo'lim: shaxsiy yozishma, stikerlar, rasmlar va random chat (tizim sizga tasodifiy suhbatdosh tanlab beradi). Telegram'ga o'xshagan, lekin Randap ichida.",
  },
  {
    q: "Random chat qanday ishlaydi?",
    a: "Random chat tugmasini bossangiz, sizni ham, boshqa bir odamni ham xohlagan suhbatdoshlar ro'yxatiga qo'yadi. Ikkolangiz mos kelganingizda suhbat ochiladi — yangi odam bilan tanishishning eng tez yo'li.",
  },
  {
    q: "Chatga rasm va stiker yuborsa bo'ladimi?",
    a: "Ha. Matn bilan birga stikerlar va rasmlar yuboriladi. Chat profilingizga emoji, rang va avatar rasmi o'rnatib olasiz.",
  },
  {
    q: "Suhbatlar xavfsizmi?",
    a: "Suhbat faqat siz va suhbatdosh ko'rasiz. Notanish odam bezovta qilsa, uni profilidan shikoyat qilish mumkin — admin ko'rib, kerak bo'lsa bloklaydi.",
  },
];

export default function ChatLandingPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQ)) }}
      />

      <p className="text-sm font-semibold text-red-600">Randap — randap.vercel.app</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Randap Chat — jonli suhbat va random chat
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Randap Chat — odamlar bilan bepul jonli suhbat bo'limi. Do'stlaringiz
        bilan yozishasiz, yangi odamlar bilan tanishasiz, rasmlar va stikerlar
        almashasiz. Random chat esa sizga xohlagancha yangi suhbatdosh
        tanib beradi — har bir suhbat yangi tanishuv.
      </p>

      <LoginCTA />

      <h2 className="mt-10 text-2xl font-bold text-foreground">
        Randap Chat imkoniyatlari
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          title="Shaxsiy yozishma"
          text="Har bir odam bilan alohida suhbat: xabarlar, stikerlar va rasmlar. Suhbat tarixi saqlanib boradi."
        />
        <InfoCard
          title="Random chat"
          text="Bir tugma bosish — tizim sizga xohlayotgan boshqa odamni topib beradi. Tasodifiy suhbatdosh bilan tanishuv."
        />
        <InfoCard
          title="Chat profili"
          text="O'zingizga emoji va rang tanlaysiz, avatar rasmi qo'yasiz, qisqa bio yozasiz — chatdagi ko'rinishingiz shunday bo'ladi."
        />
        <InfoCard
          title="Onlayn holat"
          text="Kim hozir onlayn — ko'rinib turadi. Xabar yozgan odam javob berayotganini ko'rasiz."
        />
        <InfoCard
          title="Tashqi bildirishnomalar"
          text="Suhbat kelganda sayt yopiq bo'lsa ham bildirishnoma olasiz — hech narsani o'tkazib yubormaysiz."
        />
        <InfoCard
          title="Xavfsizlik"
          text="Bezovta qiluvchi odamni shikoyat qilasiz — admin ko'rib chiqadi. Har bir hisob haqiqiy Gmail bilan ochilgan."
        />
      </div>

      <h2 className="mt-10 text-2xl font-bold text-foreground">
        Ko'p so'raladigan savollar
      </h2>
      <FaqBlock faq={FAQ} />

      <OtherSections current="/chat" />
      <LandingFooter />
    </main>
  );
}
