import Link from "next/link";
import {
  CirclePlay,
  FlaskConical,
  GraduationCap,
  BookOpen,
  MessageCircle,
  ShoppingBag,
  Trophy,
  Sparkles,
  Skull,
  ListChecks,
  ShieldCheck,
  Headphones,
} from "lucide-react";

/**
 * Bosh sahifa landing bloki — MEHMONLAR uchun (sessiyasiz tashrif).
 * To'liq HTML server tomonda chiqadi: Google qidiruvi uchun boy matn.
 * Kirish formasi (#kirish) ushbu blokdan keyin ko'rinadi (randap-gate.tsx).
 */

const VHARD_FAQ = [
  {
    q: "Randap nima?",
    a: "Randap — o'zbek tilidagi bepul platforma: videolar va Shorts yuklash hamda ko'rish, hamma fandan onlayn testlar, o'rganish darslari, jonli chat va DZF do'koni — hammasi bir joyda. Saytga Google akkaunti bilan bir bosishda kiriladi.",
  },
  {
    q: "VERY HARD ingliz testlari qanday?",
    a: "Ingliz tili bo'limida to'rtta VERY HARD (C2 daraja) test bor: VERY HARD 1 — leksika va idiomalar, VERY HARD 2 — grammatika, Listening VERY HARD 1 — raqamlar va faktlar, Listening VERY HARD 2 — mazmun va xulosa. Har birida 300 ta juda qiyin savol: nodir so'zlar (perspicacious, obfuscate, sycophant), idiomalar, inversiya, subjunctive, statistika va tinglab tushunish. Har urinishda savollardan tasodifiy 10 tasi tushadi — 1200 savoldan hech qachon bir xil test takrorlanmaydi.",
  },
  {
    q: "VERY HARD testlardan qancha ball olinadi?",
    a: "Har bir to'g'ri javob uchun 200 ball (oson testlarda 10, o'rtachada 50, qiyinda 100) — VERY HARD eng ko'p ball beruvchi testlar. Ball va DZF valyutasi Dapzif reytingiga qo'shiladi va do'konda sarflanadi.",
  },
  {
    q: "Randap bepulmi?",
    a: "Ha, to'liq bepul. Barcha testlar, darslar, videolar va chat hech qanday to'lovsiz. To'g'ri javoblar uchun DZF valyutasi ishlab olasiz — uni do'konda avatarlar va stikerlarga sarflaysiz.",
  },
];

const VHARD_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: VHARD_FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export function Landing() {
  return (
    <div className="relative bg-background">
      {/* Kirgan foydalanuvchi uchun landing HTML hali ham SSR qilinadi
          (Google uchun), lekin skript CSS orqali bir zumda yashiradi —
          flash bo'lmaydi. Mehmonlarda landing birinchi paint'dan ko'rinadi. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            'try{if(localStorage.getItem("randap_session")){document.documentElement.dataset.randapAuth="1"}}catch(e){}',
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(VHARD_JSONLD) }}
      />

      {/* ============ HERO ============ */}
      <section className="mx-auto max-w-3xl px-4 pb-10 pt-14 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-bold text-red-600">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Randap — bepul platforma
        </p>
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Randap — video platforma va{" "}
          <span className="text-red-600">onlayn testlar</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Videolar va Shorts yuklang, hamma fandan test yeching, o'rganish
          darslarini o'qing, jonli chatda suhbat quring — va testlardan DZF
          ishlab, do'konda sarflang. Hammasi bitta saytda, telefon va
          kompyuterda bir xil qulay.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#kirish"
            className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-red-600 px-8 text-sm font-bold text-white transition-colors hover:bg-red-700"
          >
            Saytga kirish
          </a>
          <Link
            href="/haqida"
            className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-border px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/60"
          >
            Batafsil ma'lumot
          </Link>
        </div>

        {/* Statistika */}
        <dl className="mx-auto mt-9 grid max-w-xl grid-cols-3 gap-3">
          <div className="rounded-2xl border border-border bg-card px-3 py-4">
            <dt className="text-xs text-muted-foreground">VERY HARD testlar</dt>
            <dd className="mt-1 text-xl font-extrabold text-foreground">4</dd>
          </div>
          <div className="rounded-2xl border border-border bg-card px-3 py-4">
            <dt className="text-xs text-muted-foreground">Har birida savol</dt>
            <dd className="mt-1 text-xl font-extrabold text-red-600">300</dd>
          </div>
          <div className="rounded-2xl border border-border bg-card px-3 py-4">
            <dt className="text-xs text-muted-foreground">Saytda fan</dt>
            <dd className="mt-1 text-xl font-extrabold text-foreground">10+</dd>
          </div>
        </dl>
      </section>

      {/* ============ RANDAP NIMA ============ */}
      <section className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-2xl font-bold text-foreground">Randap nima?</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Randap — O'zbekistonda ishga tushirilgan ommaviy ijtimoiy platforma.
          Randap Video bo'limida videolar va qisqa Shorts'lar yuklab, ko'rish,
          layk bosish va izoh qoldirish mumkin. Chat bo'limida odamlar bilan
          jonli suhbat quriladi: stikerlar, rasmlar va random chat bilan.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Eng muhimi — Randap o'qish uchun ham qulay: matematika, tarix,
          ingliz tili, fizika, kimyo, geografiya, ona tili va adabiyot fandan
          testlar bor. Har bir test har kirganda savollar bazasidan tasodifiy
          savollar tanlab, qaytadan yechiladigan bo'ladi. To'g'ri javoblar uchun
          ball va DZF beriladi — Dapzif reytingida do'stlaringiz bilan
          raqobatlashasiz.
        </p>

        {/* Xususiyatlar */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            {
              icon: CirclePlay,
              color: "bg-red-100 text-red-600",
              title: "Randap Video va Shorts",
              text: "Video yuklash, ko'rish, layk va izohlar — obunalar bilan.",
            },
            {
              icon: MessageCircle,
              color: "bg-sky-100 text-sky-600",
              title: "Jonli chat",
              text: "Stikerlar, rasmlar va random chat — suhbat hech qachon to'xtamaydi.",
            },
            {
              icon: GraduationCap,
              color: "bg-emerald-100 text-emerald-700",
              title: "10+ fandan testlar",
              text: "Har fan uch qiyinlikda; har kirganda yangi savollar tushadi.",
            },
            {
              icon: BookOpen,
              color: "bg-violet-100 text-violet-700",
              title: "O'rganish darslari",
              text: "Ingliz tili, xotira, matematika bo'yicha uzun o'rgatuvlar.",
            },
            {
              icon: Trophy,
              color: "bg-amber-100 text-amber-700",
              title: "Dapzif reytingi",
              text: "Ballar va DZF bo'yicha umumiy reyting — cho'qqini zabt eting.",
            },
            {
              icon: ShoppingBag,
              color: "bg-cyan-100 text-cyan-700",
              title: "DZF do'koni",
              text: "Ishlab topilgan DZF'ga avatarlar va stikerlar sotib oling.",
            },
          ].map((f) => (
            <section
              key={f.title}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <span
                className={`flex size-10 items-center justify-center rounded-xl ${f.color}`}
              >
                <f.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-3 text-sm font-extrabold text-foreground">
                {f.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {f.text}
              </p>
            </section>
          ))}
        </div>
      </section>

      {/* ============ VERY HARD highlight ============ */}
      <section className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-3xl border border-red-500/30 bg-gradient-to-br from-zinc-950 to-zinc-900 p-6 sm:p-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-red-400">
            <Skull className="size-3.5" aria-hidden="true" />
            Juda juda qiyin
          </p>
          <h2 className="mt-4 text-2xl font-extrabold text-white">
            VERY HARD ingliz testlari — 1200 ta qiyin savol
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Ingliz tili bo'limida to'rtta C2 darajadagi super qiyin test bor:
            ikkita yozma test va ikkita listening (audio tinglash) testi. Har
            birida 300 ta savol — lekin har urinishda ulardan tasodifiy 10
            tasi tushadi. 10/10 yig'ish deyarli imkonsiz — sinab ko'ring!
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-red-500/20 bg-zinc-900/80 p-5">
              <div className="flex items-center gap-2">
                <FlaskConical className="size-5 text-red-400" aria-hidden="true" />
                <h3 className="text-sm font-extrabold text-white">
                  VERY HARD 1 — Leksika va idiomalar
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Nodir so'zlar: perspicacious, obfuscate, sycophant, quixotic...
                Ingliz idiomalari va frazeologik fe'llar. Ma'noni topa olasizmi?
              </p>
            </div>
            <div className="rounded-2xl border border-red-500/20 bg-zinc-900/80 p-5">
              <div className="flex items-center gap-2">
                <ListChecks className="size-5 text-red-400" aria-hidden="true" />
                <h3 className="text-sm font-extrabold text-white">
                  VERY HARD 2 — Grammatika
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Inversiya (No sooner had...), subjunctive (insisted that he be),
                aralash shart gaplari, modal nuanslar va murakkab tuzilmalar.
              </p>
            </div>
            <div className="rounded-2xl border border-red-500/20 bg-zinc-900/80 p-5">
              <div className="flex items-center gap-2">
                <Headphones className="size-5 text-red-400" aria-hidden="true" />
                <h3 className="text-sm font-extrabold text-white">
                  Listening VERY HARD 1 — Raqamlar va faktlar
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Ovozli jumlalar: statistika, foizlar, ko'p raqamli aralash
                faktlar va tez hisob-kitob. Qulog'i o'tkir bo'lsin!
              </p>
            </div>
            <div className="rounded-2xl border border-red-500/20 bg-zinc-900/80 p-5">
              <div className="flex items-center gap-2">
                <Headphones className="size-5 text-red-400" aria-hidden="true" />
                <h3 className="text-sm font-extrabold text-white">
                  Listening VERY HARD 2 — Mazmun va xulosa
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Idiomalar kontekstda, inversiya qoidalar, shart gaplari,
                implied ma'no va akademik paraphrase — tinglab tushinasizmi?
              </p>
            </div>
          </div>

          <ul className="mt-5 flex flex-col gap-2 text-sm text-zinc-300">
            <li className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-red-400" aria-hidden="true" />
              Har bir to'g'ri javob uchun 200 ball — saytdagi eng baland kurs
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-red-400" aria-hidden="true" />
              Har kirishda boshqa 10 savol — 300 savolli bazadan
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-red-400" aria-hidden="true" />
              To'g'ri javoblar serverda saqlanadi — xit qilib bo'lmaydi
            </li>
          </ul>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-2xl font-bold text-foreground">
          Ko'p so'raladigan savollar
        </h2>
        <div className="mt-5 flex flex-col gap-4">
          {VHARD_FAQ.map((f) => (
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
      </section>

      {/* ============ CTA ============ */}
      <section className="mx-auto max-w-3xl px-4 pb-4 pt-2">
        <div className="rounded-2xl bg-red-600 p-6 text-center">
          <p className="text-lg font-extrabold text-white">
            Randap — Videolar, Shorts, Testlar, O'rganish va Chat
          </p>
          <p className="mt-1 text-sm text-red-100">
            Hammasi bir joyda — bepul qo'shiling!
          </p>
          <a
            href="#kirish"
            className="mt-4 inline-flex min-h-[46px] items-center justify-center rounded-full bg-white px-8 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
          >
            Saytga kirish
          </a>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Randap ·{" "}
          <Link href="/haqida" className="underline underline-offset-2">
            Randap haqida
          </Link>
        </p>
      </section>
    </div>
  );
}
