import Link from "next/link";

/**
 * OCHIQ (loginsiz) LANDING SAHIFALAR UCHUN UMUMIY QISMLAR.
 *  - Har bir landing sahifada: CTA tugmalar, "Boshqa bo'limlar" ichki
 *    havolalari (SEO uchun muhim) va umumiy footer.
 *  - Server component — "use client" kerak emas.
 */

export const LANDING_LINKS: Array<{ href: string; title: string }> = [
  { href: "/haqida", title: "Randap haqida" },
  { href: "/menyu", title: "Bosh menyu" },
  { href: "/video", title: "Videolar va Shorts" },
  { href: "/testlar", title: "Onlayn testlar" },
  { href: "/organish", title: "O'rganish darslari" },
  { href: "/chat", title: "Jonli chat" },
  { href: "/dokon", title: "DZF do'koni" },
  { href: "/ballar", title: "Ballar va reyting" },
  { href: "/profil", title: "Profil" },
];

export function LoginCTA({
  primary = "Randap'ga kirish",
  secondary = "Bepul qo'shilish",
}: {
  primary?: string;
  secondary?: string;
}) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link
        href="/"
        className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-red-600 px-6 text-sm font-bold text-white transition-colors hover:bg-red-700"
      >
        {primary}
      </Link>
      <Link
        href="/"
        className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-border px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/60"
      >
        {secondary}
      </Link>
    </div>
  );
}

/** Boshqa bo'limlarning ochiq sahifalari — ichki havolalar tarmog'i */
export function OtherSections({ current }: { current: string }) {
  return (
    <nav aria-label="Boshqa bo'limlar" className="mt-10">
      <h2 className="text-2xl font-bold text-foreground">Boshqa bo'limlar</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {LANDING_LINKS.filter((l) => l.href !== current).map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="inline-flex min-h-[40px] items-center rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/60"
          >
            {l.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function LandingFooter() {
  return (
    <>
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
        </Link>{" "}
        ·{" "}
        <Link href="/menyu" className="underline underline-offset-2">
          Barcha bo'limlar
        </Link>
      </p>
    </>
  );
}

/** Qisqa bo'lim kartochkasi (ichki matnlar uchun) */
export function InfoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="text-base font-extrabold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {text}
      </p>
    </section>
  );
}

export function FaqBlock({
  faq,
}: {
  faq: Array<{ q: string; a: string }>;
}) {
  return (
    <div className="mt-5 flex flex-col gap-4">
      {faq.map((f) => (
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
  );
}

/**
 * BOSH SAHIFA FOOTERI — barcha ochiq bo'limlarga havolalar.
 * SEO: bosh sahifadan landing sahifalarga ichki havolalar tarmog'i
 * (Googlebot sahifalarni havolalar orqali tezroq topadi va indekslaydi).
 * Server component — har kimga (mehmon, a'zo, Googlebot) ko'rinadi.
 */
export function HomeLinksFooter() {
  return (
    <footer className="mx-auto w-full max-w-3xl px-4 pb-10 pt-6">
      <section
        aria-label="Randap bo'limlari"
        className="rounded-2xl border border-border bg-card p-5"
      >
        <h2 className="text-base font-bold text-foreground">
          Randap bo&apos;limlari
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Videolar va Shorts, onlayn testlar, o&apos;rganish darslari, jonli
          chat, DZF do&apos;koni, ballar va reyting — hammasi bir joyda, bepul.
        </p>
        <nav
          aria-label="Sayt bo'limlari xaritasi"
          className="mt-4 flex flex-wrap gap-2"
        >
          {LANDING_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex min-h-[40px] items-center rounded-full border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/60"
            >
              {l.title}
            </Link>
          ))}
        </nav>
        <p className="mt-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Randap — o&apos;zbek tilidagi bepul
          o&apos;rganish va ko&apos;ngilochar platforma.
        </p>
      </section>
    </footer>
  );
}

/** FAQPage JSON-LD — Google uchun strukturaviy ma'lumot */
export function faqJsonLd(faq: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
