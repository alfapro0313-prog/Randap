import { Reveal } from "./reveal";
import { STATS } from "@/lib/site-data";

export function Stats() {
  return (
    <section aria-label="Markaz natijalari" className="border-y border-stone-100 bg-stone-50/70">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-y-8 px-4 py-10 sm:px-6 md:grid-cols-4 md:py-12 lg:px-8">
        {STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08} className="text-center">
            <p className="text-3xl font-extrabold tracking-tight text-emerald-600 sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1.5 text-sm font-medium text-stone-600">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
