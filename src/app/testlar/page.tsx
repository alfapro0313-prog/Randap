import type { Metadata } from "next";
import { LandingFooter, LoginCTA, OtherSections, InfoCard, FaqBlock, faqJsonLd } from "@/components/randap/landing-shared";

/**
 * Ochiq (loginsiz) landing sahifa — /testlar
 * 3000+ savolli onlayn testlar bo'limi (eng katta SEO sahifa).
 */

export const metadata: Metadata = {
  title: "Onlayn testlar — 3000+ savol: matematika, tarix, ingliz, rus tili",
  description:
    "Bepul onlayn testlar: matematika, fizika, kimyo, geografiya, O'zbekiston va jahon tarixi (7-11 sinf), ona tili, adabiyot, ingliz tili (CEFR A1-B2, IELTS, Listening, Very Hard C2), rus tili. Har kirganda yangi savollar, darajalar oson-o'rtacha-qiyin.",
  keywords: [
    "onlayn test",
    "matematika testi",
    "tarix testi",
    "ingliz tili testi",
    "rus tili testi",
    "IELTS test",
    "CEFR test",
    "bepul test yechish",
    "7 sinf test",
    "8 sinf test",
    "9 sinf test",
    "10 sinf test",
    "11 sinf test",
    "listening test",
  ],
  alternates: { canonical: "/testlar" },
};

const FAQ = [
  {
    q: "Randap'da qanday testlar bor?",
    a: "O'zbekiston tarixi va jahon tarixi (7–11 sinf, har sinfda 3 daraja), matematika, fizika, kimyo, geografiya, ona tili va adabiyot (oson, o'rtacha, qiyin), ingliz tili (CEFR A1–B2, IELTS, Listening audio testlar, VERY HARD C2 daraja) va rus tili (A1 dan C1-C2 gacha). Jami 3000 dan ortiq savol.",
  },
  {
    q: "Test yechish bepulmi?",
    a: "Ha, to'liq bepul. Test natijalariga qarab DZF valyutasi ishlab olasiz — uni do'konda avatarlar va stikerlarga sarflaysiz, ballaringiz umumiy reytingga chiqadi.",
  },
  {
    q: "Har kirganda savollar bir xil keladimi?",
    a: "Yo'q. Har kirishda bankdan tasodifiy 10 savol tanlanadi va bir savol ketma-ket testlarda qaytarilmaydi. Shuning uchun har safar yangi test bo'ladi.",
  },
  {
    q: "Testlarni telefonda yechish qulaymi?",
    a: "Ha. Randap telefon brauzerida ham, kompyuterda ham bir xil ishlaydi — ilova o'rnatish shart emas. Testlar mobil ekranga moslashgan.",
  },
  {
    q: "IELTS va VERY HARD darajalar nima?",
    a: "IELTS Vocabulary testlari xalqaro IELTS imtihoni leksikasiga tayyorlaydi. VERY HARD 1 va 2 (C2) — eng qiyin daraja: nodir leksika (perspicacious, obfuscate), idiomalar va murakkab grammatika (inversion, subjunctive). Listening VERY HARD testlarida audio bilan C2 darajadagi tinglash savollari bor.",
  },
];

export default function TestlarLandingPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQ)) }}
      />

      <p className="text-sm font-semibold text-red-600">Randap — randap.vercel.app</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Onlayn testlar — 3000+ savol, bepul
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Randap'da hamma fandan onlayn testlar bor: maktab fanlari (tarix,
        matematika, fizika, kimyo, geografiya, ona tili, adabiyot), chet
        tillari (ingliz tili CEFR va IELTS, rus tili) va tinglash (Listening)
        testlari. Har kirganda bankdan tasodifiy yangi 10 savol keladi — bir
        savol ikki marta qaytmaydi. Har darajaga mos: oson, o'rtacha va juda
        qiyin.
      </p>

      <LoginCTA primary="Testlarni yechishni boshlash" secondary="Bepul qo'shilish" />

      <h2 className="mt-10 text-2xl font-bold text-foreground">
        Maktab fanlari (7–11 sinf)
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          title="O'zbekiston tarixi"
          text="7-sinf (Temuriylar davri), 8-sinf (Turkiston istilosi, Yangi davr), 9-sinf (Mustaqillikka yo'l), 10-sinf (Birinchi jahon urushi va XX asr), 11-sinf (Ikkinchi jahon urushi, Sovuq urush, zamonaviy O'zbekiston). Har sinfda Oson / O'rtacha / Qiyin daraja."
        />
        <InfoCard
          title="Jahon tarixi"
          text="9–11 sinf: Sanoat inqilobi, inqiloblar davri, Birinchi va Ikkinchi jahon urushlari, Sovuq urush. Uch darajada — oson, o'rtacha, qiyin."
        />
        <InfoCard
          title="Matematika"
          text="Arifmetika asoslari, foizlar bilan tez ishlash, tenglamalarni 3 qadamda yechish, algebra va mantiq. Oson, o'rtacha va qiyin darajalar."
        />
        <InfoCard
          title="Fizika"
          text="Elektr zanjiri asoslari, Nyuton qonunlari hayotda va boshqa mavzular. Uch daraja."
        />
        <InfoCard
          title="Kimyo"
          text="Suv va molekulalar, davriy jadval bilan tanishuv va boshqalar. Oson, o'rtacha, qiyin."
        />
        <InfoCard
          title="Geografiya, ona tili, adabiyot"
          text="Yer yuzi va qit'alar, so'z turkumlari, harf va tovushlar, Alisher Navoiy va Xamsa — har fan uchta darajada."
        />
      </div>

      <h2 className="mt-10 text-2xl font-bold text-foreground">
        Ingliz tili: CEFR'dan VERY HARD (C2) gacha
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          title="CEFR darajalari"
          text="CEFR A1 (Beginner), A2 (Elementary), B1 (Intermediate), B2 (Upper-Intermediate) — har birida grammatika va leksika."
        />
        <InfoCard
          title="IELTS"
          text="IELTS Vocabulary (Oson, O'rtacha, Qiyin) — xalqaro imtihon so'z boyligiga tayyorlov. 'IELTS nima va qanday topshiriladi?' darsi ham bor."
        />
        <InfoCard
          title="Listening"
          text="Audio bilan tinglash testlari: Listening 1 (Oson), 2 (O'rtacha), 3 (Qiyin) va eng qiyin — Listening VERY HARD 1-2 (C2: raqamlar-faktlar va mazmun-xulosa)."
        />
        <InfoCard
          title="VERY HARD 1 va 2 (C2)"
          text="Eng qiyin daraja: nodir leksika va idiomalar (perspicacious, obfuscate, sycophant) va murakkab grammatika (inversion, subjunctive). Faqat ustalar uchun!"
        />
        <InfoCard
          title="Rus tili"
          text="Rus tili — oson (A1: alifbo, kelishiklar), o'rtacha va juda qiyin (C1-C2). Lug'at va grammatika aralash savollar."
        />
        <InfoCard
          title="DZF va reyting"
          text="Har to'g'ri javob DZF beradi — do'konda sarflaysiz. Ballaringiz umumiy reytingga chiqadi, do'stlaringiz bilan raqobat qilasiz."
        />
      </div>

      <h2 className="mt-10 text-2xl font-bold text-foreground">
        Ko'p so'raladigan savollar
      </h2>
      <FaqBlock faq={FAQ} />

      <OtherSections current="/testlar" />
      <LandingFooter />
    </main>
  );
}
