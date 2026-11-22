import type { Metadata } from "next";
import { LandingFooter, LoginCTA, OtherSections, InfoCard, FaqBlock, faqJsonLd } from "@/components/randap/landing-shared";

/**
 * Ochiq (loginsiz) landing sahifa — /profil
 * Profil: kanal, kirilgan videolar tarixi, ballar, sozlamalar.
 */

export const metadata: Metadata = {
  title: "Profil — kanal, ko'rilgan videolar tarixi va sozlamalar",
  description:
    "Randap profili: shaxsiy kanalingiz, ko'rilgan (kirilgan) videolar tarixi, ballar va DZF hisobi, avatar va stiker sozlamalari. Google akkaunti bilan bir bosishda kiring — bepul.",
  keywords: [
    "randap profil",
    "kanal yaratish",
    "kirilgan videolar",
    "video tarix",
    "shaxsiy sahifa",
    "sozlamalar",
  ],
  alternates: { canonical: "/profil" },
};

const FAQ = [
  {
    q: "Proilda nima bor?",
    a: "Shaxsiy kanalingiz (videolaringiz), ko'rilgan videolar tarixi, ballar va DZF hisobi, avatar va stiker sozlamalari, obunalar ro'yxati.",
  },
  {
    q: "Kirilgan videolar tarixi nima beradi?",
    a: "Ko'rgan videolaringiz tarixda saqlanadi — qaysi videoni qayerdan to'xtatganingiz esda qoladi. Xohlagan vaqtda davom ettirasiz, tarixdan topib ko'rasiz.",
  },
  {
    q: "Kanal nima?",
    a: "Har foydalanuvchi o'z kanaliga ega: videolaringiz kanalingizda to'planadi, odamlar kanalingizga obuna bo'ladi. Profil — kanalingizning vitrinası.",
  },
  {
    q: "Profilni o'zgartirsam bo'ladimi?",
    a: "Ha. Ism, avatar rasmi (do'kondan yoki yuklab), chat rangi va emoji — hammasi sozlamalardan o'zgartiriladi.",
  },
];

export default function ProfilLandingPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQ)) }}
      />

      <p className="text-sm font-semibold text-red-600">Randap — randap.vercel.app</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Profil — kanalingiz va tarixingiz
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Randap profili — saytdagi shaxsiy sahifangiz. Bu yerda kanalingiz,
        yuklagan videolaringiz, ko'rilgan videolar tarixi, ballar va DZF
        hisobingiz, avatar va stikerlaringiz birlashadi. Google akkauntingiz
        bilan kirganingizdan keyin hammasi avtomatik shakllanadi — ro'yxatdan
        o'tish shart emas.
      </p>

      <LoginCTA primary="Profilingizni oching" secondary="Bepul qo'shilish" />

      <h2 className="mt-10 text-2xl font-bold text-foreground">
        Profil imkoniyatlari
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          title="Shaxsiy kanal"
          text="Yuklagan videolaringiz kanalingizda to'planadi. Boshqalar kanalingizga obuna bo'ladi, yangi videolaringizdan xabardor bo'ladi."
        />
        <InfoCard
          title="Kirilgan videolar tarixi"
          text="Ko'rgan videolaringiz tarixi saqlanadi — to'xtagan joyingizdan davom ettirasiz, sevimlilaringizni qayta topasiz."
        />
        <InfoCard
          title="Ballar va DZF"
          text="Test natijalari va faollik uchun to'plangan ballar, DZF hisobingiz — profilida ko'rinadi."
        />
        <InfoCard
          title="Avatar va sozlamalar"
          text="Avatar rasmi, chat rangi, emoji va bio — profil ko'rinishingizni o'zingiz belgilaysiz."
        />
      </div>

      <h2 className="mt-10 text-2xl font-bold text-foreground">
        Ko'p so'raladigan savollar
      </h2>
      <FaqBlock faq={FAQ} />

      <OtherSections current="/profil" />
      <LandingFooter />
    </main>
  );
}
