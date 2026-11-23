import type { Metadata } from "next";
import { LandingFooter, LoginCTA, OtherSections, InfoCard, FaqBlock, faqJsonLd } from "@/components/randap/landing-shared";

/**
 * Ochiq (loginsiz) landing sahifa — /ballar
 * Ballar va Dapzif reytingi.
 */

export const metadata: Metadata = {
  title: "Ballar va reyting — Dapzif umumiy reytingi",
  description:
    "Randap ballar bo'limi: test natijalari va DZF bo'yicha umumiy reyting (Dapzif). Do'stlaringiz bilan raqobat qiling, ballaringizni ko'taring va reyting cho'qqilarini zabt eting — bepul.",
  keywords: [
    "randap reyting",
    "ballar",
    "dapzif",
    "umumiy reyting",
    "test natijalari",
    "raqobat",
  ],
  alternates: { canonical: "/ballar" },
};

const FAQ = [
  {
    q: "Ballar qanday hisoblanadi?",
    a: "Testlarda bergan to'g'ri javoblaringiz, ko'rgan videolaringiz va saytdagi faoligingiz uchun ball va DZF beriladi. Ballar profil harakatlaridan to'planadi.",
  },
  {
    q: "Dapzif reytingi nima?",
    a: "Dapzif — Randap'ning umumiy reytingi: barcha foydalanuvchilar ballari bo'yicha terilib boradi. Yuqorilar ro'yxatda ko'rinadi — do'stlaringiz bilan raqobat qilish qiziqarli.",
  },
  {
    q: "Reytingga chiqish uchun nima qilish kerak?",
    a: "Ko'proq test yeching — har to'g'ri javob ball keltiradi. Darslarni o'qing, videolar ko'ring: faollik ballingizni o'stiradi.",
  },
  {
    q: "Boshqalar ballimni ko'radimi?",
    a: "Ha, reyting ochiq: odamlar ismi va ballari ko'rinadi. Gmail manzilingiz esa yashirin qoladi — u faqat sizga ko'rinadi.",
  },
];

export default function BallarLandingPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQ)) }}
      />

      <p className="text-sm font-semibold text-red-600">Randap — randap.vercel.app</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Ballar va Dapzif reytingi — o'sib bor
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Randap'da har to'g'ri javob ball keltiradi. Ballaringiz Dapzif —
        umumiy reytingga chiqadi: kim qancha yechgani ko'rinib turadi.
        Do'stlaringiz bilan raqobat qiling, har kuni bir pog'ona yuqoriga
        chiqing — bilimingiz ortsa, ball ham ortadi, reyting ham.
      </p>

      <LoginCTA primary="Reytingni ko'rish" secondary="Bepul qo'shilish" />

      <h2 className="mt-10 text-2xl font-bold text-foreground">
        Ball tizimi qanday?
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          title="Test natijalari"
          text="Har to'g'ri javob ball va DZF keltiradi. Qiyin darajada yechilsa, ball ko'proq bo'ladi."
        />
        <InfoCard
          title="Dapzif reytingi"
          text="Barcha foydalanuvchilarning umumiy reytingi — qayerda turganingizni har vaqt ko'rasiz."
        />
        <InfoCard
          title="Raqobat va rag'bat"
          text="Do'stlaringiz bilan kim ko'proq yechib o'tishni musobaqalash — o'rganish o'yin ochigiga aylanadi."
        />
        <InfoCard
          title="DZF bilan birlashgan"
          text="Ballar va DZF birgalikda ishlaydi: ball — reyting uchun, DZF — do'kon uchun."
        />
      </div>

      <h2 className="mt-10 text-2xl font-bold text-foreground">
        Ko'p so'raladigan savollar
      </h2>
      <FaqBlock faq={FAQ} />

      <OtherSections current="/ballar" />
      <LandingFooter />
    </main>
  );
}
