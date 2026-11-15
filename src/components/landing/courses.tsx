import {
  BookOpen,
  Brain,
  Clock,
  Code2,
  Languages,
  Sigma,
  Trophy,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeading, SectionShell } from "./section-heading";
import { Reveal } from "./reveal";
import { COURSES } from "@/lib/site-data";

const ICONS: Record<string, LucideIcon> = {
  languages: Languages,
  trophy: Trophy,
  sigma: Sigma,
  book: BookOpen,
  code: Code2,
  brain: Brain,
};

export function Courses() {
  return (
    <SectionShell id="courses" className="bg-white">
      <SectionHeading
        eyebrow="Kurslarimiz"
        title="Sizga mos yo'nalishni tanlang"
        subtitle="Har bir kurs daraja testi bilan boshlanadi. Maqsadingizga qarab guruh va dastur tanlanadi."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {COURSES.map((course, i) => {
          const Icon = ICONS[course.icon] ?? BookOpen;
          return (
            <Reveal key={course.id} delay={(i % 3) * 0.08} className="h-full">
              <article className="group flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-600/5">
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600">
                    <Clock className="size-3" aria-hidden="true" />
                    {course.duration}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold leading-snug text-stone-900">
                  {course.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {course.desc}
                </p>

                <ul className="mt-4 flex flex-col gap-1.5">
                  {course.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-stone-600">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500"
                      />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4">
                    <span className="text-sm font-bold text-emerald-700">
                      {course.price}
                    </span>
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-stone-700 transition-colors hover:text-emerald-700"
                      aria-label={`${course.title} kursiga yozilish`}
                    >
                      Yozilish
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}
