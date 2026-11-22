import type { Metadata } from "next";
import Link from "next/link";
import { LandingFooter, LoginCTA, OtherSections, InfoCard, FaqBlock, faqJsonLd } from "@/components/randap/landing-shared";

/**
 * Ochiq (loginsiz) landing sahifa — /menyu
 * Bosh menyu hubi: barcha bo'limlar tavsifi va havolalari.
 */

export const metadata: Metadata = {
  title: "Bosh menyu — Randap'ning barcha bo'limlari",
  description:
    "Randap bosh menyusi: Videolar va Shorts, onlayn testlar, o'rganish darslari, jonli chat, DZF do'koni, ballar va reyting, profil. Har bo'lim nima qilishini bilib oling va bir bosishda kiring.",
  keywords: [
    "randap menyu",
    "randap bo'limlari",
    "video platforma bo'limlar",
    "testlar",
    "chat",
    "do'kon",
    "reyting",
  ],
  alternates: { canonical: "/menyu" },
};

const SECTIONS = [
  {
    href: "/video",
    title: "Videolar va Shorts",
    text: "Videolar va qisqa vertikal Shorts ko'rish va yuklash, layk, izoh, obuna, ko'rilgan videolar tarixi.",
  },
  {
    href: "/testlar",
    title: "Onlayn testlar",
    text: "3000+ savol: tarix (7–11 sinf), matematika, fizika, kimyo, geografiya, ona tili, adabiyot, ingliz (CEFR, IELTS, VERY HARD C2) va rus tili.",
  },
  {
    href: "/organish",
    title: "O'rganish darslari",
    text: "Har fandan qadam-baqadam o'rgatuv darslari, xotira ilmi, din va hayot burchlari.",
  },
  {
    href: "/chat",
    title: "Jonli chat",
    text: "Shaxsiy yozishma, random chat, stikerlar va rasmlar — yangi odamlar bilan tanishuv.",
  },
  {
    href: "/dokon",
    title: "DZF do'koni",
    text: "DZF valyutaga avatarlar, stikerlar va omad barabani — ishlab ol, sarfla.",
  },
  {
    href: "/ballar",
    title: "Ballar va reyting",
    text: "Dapzif umumiy reytingi — do'stlaringiz bilan raqobat, har kuni yuqoriga.",
  },
  {
    href: "/profil",
    title: "Profil",
    text: "Shaxsiy kanal, kirilgan videolar tarixi, ballar, avatar va sozlamalar.",
  },
];

const FAQ = [
  {
    q: "Randap'da qanday bo'limlar bor?",
    a: "Yettta asosiy bo'lim: Videolar va Shorts, Onlayn testlar, O'rganish darslari, Jonli chat, DZF do'koni, Ballar va reyting, Profil. Hammasi bitta saytda, bitta akkaunt bilan ishlaydi.",
  },
  {
    q: "Qaysi bo'limdan boshlash kerak?",
    a: "Xohishingizga qarab: bilimni sinamoqchi bo'lsangiz — Testlar; video ko'rish yoki yuklamoqchi bo'lsangiz — Videolar; odamlar bilan gaplashmoqchi bo'lsangiz — Chat.",
  },
  {
    q: "Hamma bo'limlar bepulmi?",
    a: "Ha, Randap'ning barcha bo'limlari to'liq bepul. Kirish uchun faqat Google akkauntingiz kerak.",
  },
  {
    q: "Bir akkaunt bilan hamma bo'limga kirsa bo'ladimi?",
    a: "Ha. Bir marta Google orqali kirganingiz bilan testlar, videolar, chat, do'kon va reyting — hammasi ochiladi. Ma'lumotlaringiz barcha bo'limlarda saqlanadi.",
  },
];

export default function MenyuLandingPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQ)) }}
      />

      <p className="text-sm font-semibold text-red-600">Randap — randap.vercel.app</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Bosh menyu — barcha bo'limlar bir joyda
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Randap — O'zbek tilidagi bepul hammasahifali platforma. Quyida
        Randap'ning yetta asosiy bo'limi va ular nima qilishini qisqa
        tushuntirish berilgan. Har bir bo'lim haqida to'liq ma'lumot
        kerakmi? Bo'lim nomini bosing — alohida ochiq sahifa ochiladi.
      </p>

      <LoginCTA primary="Randap'ga kirish" secondary="Bepul qo'shilish" />

      <h2 className="mt-10 text-2xl font-bold text-foreground">
        Randap bo'limlari
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <section
            key={s.href}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <h3 className="text-base font-extrabold text-foreground">
              <Link
                href={s.href}
                className="underline-offset-4 hover:underline"
              >
                {s.title}
              </Link>
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {s.text}
            </p>
          </section>
        ))}
      </div>

      <h2 className="mt-10 text-2xl font-bold text-foreground">
        Ko'p so'raladigan savollar
      </h2>
      <FaqBlock faq={FAQ} />

      <OtherSections current="/menyu" />
      <LandingFooter />
    </main>
  );
}
