import type { Metadata } from "next";
import { LandingFooter, LoginCTA, OtherSections, InfoCard, FaqBlock, faqJsonLd } from "@/components/randap/landing-shared";

/**
 * Ochiq (loginsiz) landing sahifa — /dokon
 * DZF do'koni: avatarlar, stikerlar, omad barabani.
 */

export const metadata: Metadata = {
  title: "DZF do'koni — avatarlar, stikerlar va omad barabani",
  description:
    "Randap DZF do'koni: testlardan va videolardan DZF pul ishlab, avatar rasmlari, stikerlar va omad barabanini sotib oling. O'yin valyutasi bilan qiziqarli profil yaratish — bepul.",
  keywords: [
    "dzf do'kon",
    "avatar do'kon",
    "stikerlar",
    "omad barabani",
    "o'yin valyutasi",
    "randap dokon",
  ],
  alternates: { canonical: "/dokon" },
};

const FAQ = [
  {
    q: "DZF nima?",
    a: "DZF — Randap ichidagi o'yin valyutasi ('da'tpun zaxirasi'). Testlardan to'g'ri javoblar, videolar ko'rish va faollik uchun DZF ishlab olasiz.",
  },
  {
    q: "DZF ni qanday ishlab olaman?",
    a: "Testlarda to'g'ri javoblar berganingiz uchun, videolar ko'rganingiz va saytda faol qatnashganingiz uchun DZF beriladi. Qancha ko'p ishtirok etingiz, shuncha ko'p DZF.",
  },
  {
    q: "Do'konda nima sotiladi?",
    a: "Profil uchun avatar rasmlari, chat uchun stikerlar va omad barabani — tasodifiy mukofotlar chiqadigan qiziqarli o'yin elementi.",
  },
  {
    q: "Haqiqiy pul kerakmi?",
    a: "Yo'q. Do'kon to'liq o'yin ichidagi: hamma narsa DZF bilan olinadi, haqiqiy pul qo'yilmaydi.",
  },
];

export default function DokonLandingPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQ)) }}
      />

      <p className="text-sm font-semibold text-red-600">Randap — randap.vercel.app</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        DZF do'koni — ishla, ishlab ol, sarfla
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Randap DZF do'koni — saytdagi o'yin do'koni. Testlardan to'g'ri
        javoblar bilan va videolar ko'rib DZF valyutasini ishlab olasiz, keyin
        uni do'konda avatar rasmlariga, stikerlarga yoki omad barabaniga
        sarflaysiz. Profilingiz chiroyli bo'ladi, chatda stikerlaringiz
        ko'rinadi — hammasi bepul, haqiqiy pul kerak emas.
      </p>

      <LoginCTA primary="Do'konga o'tish" secondary="Bepul qo'shilish" />

      <h2 className="mt-10 text-2xl font-bold text-foreground">
        Do'konda nima bor?
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          title="Avatar rasmlari"
          text="Profil va chat uchun chiroyli avatar rasmlari — do'kondan tanlab, profilingizga qo'yasiz."
        />
        <InfoCard
          title="Stikerlar"
          text="Chatda yuboriladigan stikerlar to'plami — suhbatingizni jonli qiladi."
        />
        <InfoCard
          title="Omad barabani"
          text="DZF ga aylantiriladigan omad barabani — aylantirasiz, tasodifiy mukofot chiqadi."
        />
        <InfoCard
          title="DZF ishlab olish"
          text="Testlarda to'g'ri javoblar, videolar va faollik — hammasi DZF olib keladi. Qancha ko'p yechsangiz, shuncha ko'p olasiz."
        />
      </div>

      <h2 className="mt-10 text-2xl font-bold text-foreground">
        Ko'p so'raladigan savollar
      </h2>
      <FaqBlock faq={FAQ} />

      <OtherSections current="/dokon" />
      <LandingFooter />
    </main>
  );
}
