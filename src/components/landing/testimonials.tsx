import { Star } from "lucide-react";
import { SectionHeading, SectionShell } from "./section-heading";
import { Reveal } from "./reveal";
import { TESTIMONIALS } from "@/lib/site-data";

export function Testimonials() {
  return (
    <SectionShell id="testimonials" className="bg-stone-50/70">
      <SectionHeading
        eyebrow="Fikr-mulohazalar"
        title="O'quvchilarimiz va ota-onalar nima deydi?"
        subtitle="Eng yaxshi reklama — bizning bitiruvchilarimizning natijalari."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={(i % 2) * 0.08} className="h-full">
            <figure className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 transition-shadow hover:shadow-md">
              <div className="flex items-center gap-0.5" aria-label="5 yulduzli baho">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1">
                <p className="text-sm leading-relaxed text-stone-700 sm:text-[15px]">
                  &laquo;{t.quote}&raquo;
                </p>
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-stone-100 pt-4">
                <span className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-bold text-stone-900">{t.name}</p>
                  <p className="text-xs text-stone-500">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
