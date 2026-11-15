import { Check, Sparkles, X } from "lucide-react";
import { SectionHeading, SectionShell } from "./section-heading";
import { Reveal } from "./reveal";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <SectionShell id="pricing" className="bg-white">
      <SectionHeading
        eyebrow="Narxlar"
        title="Shaffof va qulay to'lov tizimi"
        subtitle="Qancha kurs o'qisangiz — shuncha tejaysiz. Birinchi sinov darsi har doim bepul."
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-3 lg:items-stretch">
        {PLANS.map((plan, i) => (
          <Reveal key={plan.name} delay={i * 0.1} className="h-full">
            <div
              className={cn(
                "relative flex h-full flex-col rounded-3xl border p-7 transition-shadow sm:p-8",
                plan.popular
                  ? "border-emerald-600 bg-emerald-50/50 shadow-lg shadow-emerald-600/10"
                  : "border-stone-200 bg-white hover:shadow-md"
              )}
            >
              {plan.popular ? (
                <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-md">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Eng ommabop
                </span>
              ) : null}

              <h3 className="text-lg font-bold text-stone-900">{plan.name}</h3>
              <p className="mt-1.5 text-sm text-stone-600">{plan.desc}</p>

              <p className="mt-5 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-stone-900">
                  {plan.price}
                </span>
                <span className="text-sm font-medium text-stone-500">{plan.unit}</span>
              </p>

              <ul className="mt-6 flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-stone-700">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="size-3" aria-hidden="true" />
                    </span>
                    {feature}
                  </li>
                ))}
                <li className="flex items-start gap-2.5 text-sm text-stone-500">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500">
                    <X className="size-3" aria-hidden="true" />
                  </span>
                  Yashirin to&apos;lovlar yo&apos;q
                </li>
              </ul>

              <div className="mt-auto pt-7">
                <Button
                  asChild
                  className={cn(
                    "h-11 w-full text-base font-semibold",
                    plan.popular
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-stone-900 text-white hover:bg-stone-800"
                  )}
                >
                  <a href="#contact">Tanlash</a>
                </Button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <p className="mt-8 text-center text-sm text-stone-500">
          2 va undan ko&apos;p kursga o&apos;qiyotgan oilalar uchun qo&apos;shimcha
          chegirmalar bor. Batafsil ma&apos;lumot uchun{" "}
          <a href="#contact" className="font-semibold text-emerald-700 hover:underline">
            biz bilan bog&apos;laning
          </a>
          .
        </p>
      </Reveal>
    </SectionShell>
  );
}
