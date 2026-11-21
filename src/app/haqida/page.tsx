import type { Metadata } from "next";
import Link from "next/link";
import { CirclePlay, GraduationCap, BookOpen, MessageCircle, ShoppingBag, Trophy } from "lucide-react";

/**
 * Ochiq (loginsiz) landing sahifa — /haqida
 * To'liq server-render: Google qidiruvi uchun boy matn kontenti.
 */

export const metadata: Metadata = {
  title: "Randap haqida — Randap nima?",
  description:
    "Randap — videolar va Shorts, hamma fandan onlayn testlar, o'rganish darslari, jonli chat va DZF do'koni. Bepul qo'shiling: Google akkauntingiz bilan bir bosishda kiring.",
  alternates: {
    canonical: "/haqida",
  },
};

const FEATURES = [
  {
    icon: CirclePlay,
    color: "bg-red-100 text-red-600",
    title: "Randap Video",
    text: "Videolar va Shorts yuklash hamda ko'rish — layk, izoh qoldirish, obuna bo'lish va do'stlaringizga ulashish bilan.",
  },
  {
    icon: GraduationCap,
    color: "bg-emerald-100 text-emerald-700",
    title: "Testlar",
    text: "Tarix, matematika, fizika, kimyo, geografiya, ona tili, adabiyot va ingliz tili — har bir fanda oson, o'rtacha va qiyin darajalar. Har kirganda yangi savollar.",
  },
  {
    icon: BookOpen,
    color: "bg-violet-100 text-violet-700",
    title: "O'rganish",
    text: "Ingliz tili, xotira, matematika va tarix bo'yicha uzun o'rgatuv maqolalar, din va hayot burchlari rubrlari.",
  },
  {
    icon: MessageCircle,
    color: "bg-sky-100 text-sky-600",
    title: "Chat",
    text: "Odamlar bilan jonli suhbat: stikerlar, rasmlar va random chat. Sayt yopiq bo'lsa ham tashqi bildirishnomalar keladi.",
  },
  {
    icon: ShoppingBag,
    color: "bg-amber-100 text-amber-700",
    title: "DZF do'koni",
    text: "To'g'ri javoblar uchun DZF pul ishlab, do'konda avatarlar, stikerlar va omad barabanini sotib oling.",
  },
  {
    icon: Trophy,
    color: "bg-amber-100 text-amber-700",
    title: "Dapzif reytingi",
    text: "Ballar va DZF bo'yicha umumiy reyting — do'stlaringiz bilan raqobat qiling va cho'qqilarni zabt eting.",
  },
];

const FAQ = [
  {
    q: "Randap nima?",
    a: "Randap — O'zbek tilidagi bepul video platforma. Videolar va Shorts ko'rish va yuklash, hamma fandan testlar yechish, o'rganish darslarini o'qish va jonli chat — hammasi bir joyda.",
  },
  {
    q: "Randap'ga qanday qo'shilaman?",
    a: "Saytga kiring va 'Google orqali kirish' tugmasini bosing — tasdiqlangan Gmail akkauntingiz bilan bir bosishda kirasiz. Ro'yxatdan o'tish shart emas.",
  },
  {
    q: "Randap bepulmi?",
    a: "Ha, to'liq bepul. Testlardan to'g'ri javoblar uchun DZF valyutasi ishlab olasiz — uni do'konda stikerlar va avatarlarga sarflaysiz.",
  },
  {
    q: "Qanday testlar bor?",
    a: "O'zbekiston va jahon tarixi (7–11 sinf), matematika, fizika, kimyo, geografiya, ona tili, adabiyot, ingliz tili (CEFR A1–B2, IELTS, Listening va Very Hard C2 daraja) — jami 3000+ savol, har kirganda tasodifiy 10 tasi.",
  },
];

export default function HaqidaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p className="text-sm font-semibold text-red-600">Randap — randap.vercel.app</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Randap — Video platforma
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Randap — O'zbek tilidagi bepul video platforma. Bu yerda videolar va
        Shorts ko'rish hamda yuklash mumkin, hamma fandan onlayn testlar yechish,
        o'rganish darslarini o'qish, odamlar bilan jonli chat qurish va test
        natijalari uchun DZF valyutasi ishlab, uni do'konda sarflash mumkin.
        Hammasi bitta saytda — telefon va kompyuterda bir xil qulay.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-red-600 px-6 text-sm font-bold text-white transition-colors hover:bg-red-700"
        >
          Randap'ga kirish
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-border px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/60"
        >
          Bepul qo'shilish
        </Link>
      </div>

      <h2 className="mt-10 text-2xl font-bold text-foreground">
        Randap'da nima bor?
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <section
            key={f.title}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <span
              className={`flex size-11 items-center justify-center rounded-xl ${f.color}`}
            >
              <f.icon className="size-6" aria-hidden="true" />
            </span>
            <h3 className="mt-3 text-base font-extrabold text-foreground">
              {f.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {f.text}
            </p>
          </section>
        ))}
      </div>

      <h2 className="mt-10 text-2xl font-bold text-foreground">
        Ingliz tili: CEFR'dan Very Hard darajagacha
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Ingliz tili bo'limida CEFR A1, A2, B1, B2 darajalari, IELTS leksika
        (oson, o'rtacha, qiyin), audio Listening testlari va eng qiyin —{" "}
        <strong className="font-semibold text-foreground">
          Very Hard 1 va Very Hard 2 (C2)
        </strong>{" "}
        darajalari bor. Very Hard testlarda nodir leksika (perspicacious,
        obfuscate, sycophant), idiomalar va murakkab grammatika (inversion,
        subjunctive) savollari — faqat ustalar uchun!
      </p>

      <h2 className="mt-10 text-2xl font-bold text-foreground">
        Ko'p so'raladigan savollar
      </h2>
      <div className="mt-5 flex flex-col gap-4">
        {FAQ.map((f) => (
          <section
            key={f.q}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <h3 className="text-base font-bold text-foreground">{f.q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {f.a}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-red-600 p-6 text-center">
        <p className="text-lg font-extrabold text-white">
          Randap — Videolar, Shorts, Testlar, O'rganish va Chat
        </p>
        <p className="mt-1 text-sm text-red-100">
          Hammasi bir joyda — bepul qo'shiling!
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex min-h-[46px] items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
        >
          Kirish
        </Link>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Randap ·{" "}
        <Link href="/" className="underline underline-offset-2">
          Saytga o'tish
        </Link>
      </p>
    </main>
  );
}
