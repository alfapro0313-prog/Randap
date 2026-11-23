import type { Metadata } from "next";
import { LandingFooter, LoginCTA, OtherSections, InfoCard, FaqBlock, faqJsonLd } from "@/components/randap/landing-shared";

/**
 * Ochiq (loginsiz) landing sahifa — /video
 * Randap Video: videolar, Shorts, yuklash, tarix (kirilgan videolar).
 */

export const metadata: Metadata = {
  title: "Randap Video — videolar va Shorts ko'rish va yuklash",
  description:
    "Randap Video — O'zbek tilidagi bepul video platforma: videolar va Shorts yuklash hamda ko'rish, layk, izoh, obuna, ko'rilgan videolar tarixi va ulashish. Telefon va kompyuterda bepul.",
  keywords: [
    "randap video",
    "video yuklash",
    "video ko'rish",
    "shorts o'zbekcha",
    "qisqa videolar",
    "bepul video platforma",
    "o'zbek video sayt",
  ],
  alternates: { canonical: "/video" },
};

const FAQ = [
  {
    q: "Randap Video'da nima qilsam bo'ladi?",
    a: "Videolar va Shorts (80 sekundgacha qisqa vertikal videolar) yuklaysiz va ko'risiz. Har videoga layk bosish, izoh yozish, muallifga obuna bo'lish va do'stlaringizga ulashish mumkin.",
  },
  {
    q: "Video yuklash bepulmi?",
    a: "Ha, to'liq bepul. 300 MB gacha bo'lgan videolarni yuklash mumkin — yuklash jarayoni bo'laklab boradi, sekin internette ham qulay.",
  },
  {
    q: "Ko'rgan videolarim tarixi saqlanadimi?",
    a: "Ha. Kirilgan (ko'rilgan) videolar tarixi profilingizda saqlanadi — qayerdan to'xtatgansiz, o'shandan davom ettirasiz. Shuning uchun 'Kirilgan videolarim' bo'limi qulay.",
  },
  {
    q: "Randap Video'dan telefon bilan foydalana olamanmi?",
    a: "Ha. Randap telefon brauzerida ham, kompyuterda ham bir xil qulay ishlaydi. Ilova o'rnatish shart emas — saytni ochingiz va Google akkauntingiz bilan kiring.",
  },
];

export default function VideoLandingPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQ)) }}
      />

      <p className="text-sm font-semibold text-red-600">Randap — randap.vercel.app</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Randap Video — videolar va Shorts
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Randap Video — O'zbek tilidagi bepul video platforma. Uzun videolarni
        ham, qisqa vertikal Shorts'larni ham ko'rish va yuklash mumkin. Har
        videoga layk bosiladi, izoh yoziladi, muallifga obuna bo'liladi —
        YouTube'ga o'xshagan tajriba, lekin to'liq o'zbek tilida va bepul.
      </p>

      <LoginCTA />

      <h2 className="mt-10 text-2xl font-bold text-foreground">
        Randap Video imkoniyatlari
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          title="Videolar va Shorts"
          text="Uzun videolar alohida, 80 sekundgacha qisqa vertikal Shorts alohida oqimda. Bir suringa — boshqasi ochiladi."
        />
        <InfoCard
          title="Yuklash oddiy"
          text="Telefondan yoki kompyuterdan video tanlaysiz, sarlavha yozasiz — qolganini Randap o'zi qiladi. Yuklash bepul, 300 MB gacha."
        />
        <InfoCard
          title="Layk, izoh, obuna"
          text="Yoqqan videoga layk, savolingiz bo'lsa izoh, muallif yoqsa — obuna. Kanallarga obuna bo'lib, yangi videolardan xabardor bo'lasiz."
        />
        <InfoCard
          title="Kirilgan videolar tarixi"
          text="Ko'rgan videolaringiz tarixda saqlanadi. Telefondan ko'rib, kompyuterda davom ettirish mumkin — to'xtagan joyingizdan oynasi ochiladi."
        />
        <InfoCard
          title="Qidiruv va bo'limlar"
          text="Saytdagi videolar orasidan izlash mumkin. Har kanal o'z videolari bilan alohida sahifada."
        />
        <InfoCard
          title="Bildirishnomalar"
          text="Obuna bo'lgan kanaldan yangi video chiqsa, bildirishnoma keladi. Sayt yopiq bo'lsa ham xabarni ko'rasiz."
        />
      </div>

      <h2 className="mt-10 text-2xl font-bold text-foreground">Shorts nima?</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Shorts — vertikal formatdagi qisqa videolar: hazil, foydali maslahat,
        mohirlik ko'rsatmalari. TikTok va YouTube Shorts kabi bir suringa
        almashadi. O'zingiz ham Shorts yuklashingiz mumkin — maksimal 80
        sekund, telefon kamerasi yetarli.
      </p>

      <h2 className="mt-10 text-2xl font-bold text-foreground">
        Ko'p so'raladigan savollar
      </h2>
      <FaqBlock faq={FAQ} />

      <OtherSections current="/video" />
      <LandingFooter />
    </main>
  );
}
