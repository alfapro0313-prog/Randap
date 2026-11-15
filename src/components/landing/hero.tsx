"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  GraduationCap,
  Phone,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site-data";

const TRUST_ITEMS = ["Bepul sinov darsi", "Sertifikat bilan yakunlanadi", "Onlayn + oflayn format"];

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 scroll-mt-20">
      {/* Background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-24 right-[-10%] size-[420px] rounded-full bg-emerald-100/70 blur-3xl" />
        <div className="absolute top-40 left-[-12%] size-[380px] rounded-full bg-amber-100/60 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        {/* Left: copy */}
        <div className="flex flex-col items-start gap-6">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700"
          >
            <BadgeCheck className="size-3.5" aria-hidden="true" />
            2026 yil yangi guruhlarga qabul ochiq
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-4xl font-extrabold leading-[1.1] tracking-tight text-stone-900 sm:text-5xl lg:text-[3.4rem]"
          >
            Zamonaviy bilim —{" "}
            <span className="relative whitespace-nowrap text-emerald-600">
              kelajak kaliti
              <svg
                aria-hidden="true"
                viewBox="0 0 220 12"
                className="absolute -bottom-1.5 left-0 w-full text-emerald-300"
                fill="none"
              >
                <path
                  d="M3 9c40-6 90-8 214-5"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg"
          >
            ZamonBilim o&apos;quv markazida ingliz tili, IELTS, matematika,
            abituriyent kurslari va dasturlashni kichik guruhlarda, tajribali
            ustozlar yordamida o&apos;rganing. Birinchi dars — mutlaqo bepul.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="flex flex-wrap items-center gap-3"
          >
            <Button
              asChild
              size="lg"
              className="h-12 bg-emerald-600 px-6 text-base font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700"
            >
              <a href="#contact">
                Kursga yozilish
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-stone-300 px-6 text-base font-semibold text-stone-700 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <a href="#courses">
                <Play className="size-4" aria-hidden="true" />
                Kurslarni ko&apos;rish
              </a>
            </Button>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.36 }}
            className="flex flex-wrap gap-x-5 gap-y-2"
          >
            {TRUST_ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 text-sm font-medium text-stone-600"
              >
                <BadgeCheck className="size-4 text-emerald-600" aria-hidden="true" />
                {item}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Right: visual composition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="relative rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 p-7 text-white shadow-xl shadow-emerald-900/20 sm:p-9">
            <GraduationCap
              className="absolute right-6 top-6 size-10 text-emerald-300/60"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-200">
              ZamonBilim markazi
            </p>
            <p className="mt-3 text-2xl font-bold leading-snug sm:text-3xl">
              &laquo;Har bir o&apos;quvchi — alohida e&apos;tiborga loyiq&raquo;
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-emerald-100/90">
              8 yildan beri 1200 dan ortiq o&apos;quvchini oliy o&apos;quv
              yurtlariga va yangi imkoniyatlarga yo&apos;l ochib berdik.
            </p>

            <div className="mt-7 flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700">
                <CalendarDays className="size-5" aria-hidden="true" />
              </span>
              <div className="text-sm">
                <p className="font-semibold">Dushanba – Shanba</p>
                <p className="text-emerald-100/80">8:00 – 20:00 · Yakshanba: 10:00 – 16:00</p>
              </div>
            </div>
          </div>

          {/* Floating stat card */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-3 rounded-2xl border border-stone-100 bg-white p-4 shadow-lg sm:-left-6"
          >
            <p className="text-2xl font-extrabold text-emerald-600">1200+</p>
            <p className="text-xs font-medium text-stone-500">omadli bitiruvchilar</p>
          </motion.div>

          {/* Floating phone card */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -top-5 right-2 flex items-center gap-2.5 rounded-2xl border border-stone-100 bg-white p-3.5 shadow-lg sm:-right-4"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Phone className="size-4" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-[11px] text-stone-500">Qabul uchun</p>
              <a href={SITE.phoneHref} className="text-sm font-bold text-stone-900 hover:text-emerald-700">
                {SITE.phone}
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
