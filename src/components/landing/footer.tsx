import { GraduationCap, MapPin, Phone, MessageCircle, Send, Mail } from "lucide-react";
import { SITE } from "@/lib/site-data";

const QUICK_LINKS = [
  { href: "#courses", label: "Kurslar" },
  { href: "#about", label: "Nega biz?" },
  { href: "#pricing", label: "Narxlar" },
  { href: "#testimonials", label: "Fikrlar" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Aloqa" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-800 bg-stone-900 text-stone-300">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <GraduationCap className="size-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-bold text-white">ZamonBilim</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-400">
              Zamonaviy o&apos;quv markazi. Ingliz tili, IELTS, matematika,
              abituriyent kurslari va dasturlash — 8 yillik tajriba bilan.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp sahifamiz"
                className="flex size-9 items-center justify-center rounded-lg bg-stone-800 text-stone-300 transition-colors hover:bg-emerald-600 hover:text-white"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
              </a>
              <a
                href={SITE.telegram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram kanalimiz"
                className="flex size-9 items-center justify-center rounded-lg bg-stone-800 text-stone-300 transition-colors hover:bg-emerald-600 hover:text-white"
              >
                <Send className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <nav aria-label="Sayt xaritasi">
            <p className="text-sm font-bold uppercase tracking-wider text-white">
              Bo&apos;limlar
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-stone-400 transition-colors hover:text-emerald-400"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white">
              Aloqa
            </p>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-500" aria-hidden="true" />
                {SITE.address}
              </li>
              <li>
                <a
                  href={SITE.phoneHref}
                  className="flex items-center gap-2.5 transition-colors hover:text-emerald-400"
                >
                  <Phone className="size-4 shrink-0 text-emerald-500" aria-hidden="true" />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-emerald-400"
                >
                  <Mail className="size-4 shrink-0 text-emerald-500" aria-hidden="true" />
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-stone-800 pt-6 text-xs text-stone-500 sm:flex-row">
          <p>© 2026 ZamonBilim o&apos;quv markazi. Barcha huquqlar himoyalangan.</p>
          <p>Zamonaviy bilim — kelajak kaliti</p>
        </div>
      </div>
    </footer>
  );
}
