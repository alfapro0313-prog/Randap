import {
  ChartLine,
  Gift,
  MonitorSmartphone,
  Target,
  Users,
  Wallet,
  Quote,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeading, SectionShell } from "./section-heading";
import { Reveal } from "./reveal";
import { ADVANTAGES } from "@/lib/site-data";

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  target: Target,
  chart: ChartLine,
  monitor: MonitorSmartphone,
  gift: Gift,
  wallet: Wallet,
};

export function About() {
  return (
    <SectionShell id="about" className="bg-stone-50/70">
      <SectionHeading
        eyebrow="Nega ZamonBilim?"
        title="Natijaga yo'naltirilgan ta'lim tizimi"
        subtitle="Biz faqat dars o'tamiz demaymiz — har bir o'quvchining o'sishini o'lchaymiz va ota-onalarga tushunarli til-da hisobot beramiz."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="grid gap-4 sm:grid-cols-2">
          {ADVANTAGES.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Users;
            return (
              <Reveal key={item.title} delay={(i % 2) * 0.08} className="h-full">
                <div className="flex h-full flex-col gap-2.5 rounded-2xl border border-stone-200 bg-white p-5 transition-shadow hover:shadow-md">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-bold text-stone-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-stone-600">{item.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.15}>
          <figure className="relative rounded-3xl border border-stone-200 bg-white p-7 shadow-md sm:p-8">
            <Quote
              aria-hidden="true"
              className="absolute -top-5 left-7 size-10 rounded-full bg-emerald-600 p-2 text-white"
            />
            <blockquote className="mt-3">
              <p className="text-base leading-relaxed text-stone-700 sm:text-lg">
                &laquo;O&apos;quvchimizning muvaffaqiyati — bizning asosiy
                ko&apos;rsatkichimiz. Kichik guruhlar va muntazam kuzatuv tufayli
                har bir o&apos;quvchining o&apos;sishini oyma-oy ko&apos;ramiz.&raquo;
              </p>
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-stone-100 pt-5">
              <span className="flex size-11 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                AT
              </span>
              <div>
                <p className="text-sm font-bold text-stone-900">Alisher Tursunov</p>
                <p className="text-xs text-stone-500">Markaz asoschisi va direktori</p>
              </div>
              <span className="ml-auto flex items-center gap-0.5" aria-label="5 yulduzli baho">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                ))}
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </SectionShell>
  );
}
