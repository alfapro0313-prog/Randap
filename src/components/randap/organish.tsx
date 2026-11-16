"use client";

import {
  ArrowLeft,
  BookOpen,
  Brain,
  Calculator,
  ChevronRight,
  Clock,
  Landmark,
  Languages,
  ScrollText,
} from "lucide-react";
import { HAYOT_BURCHLARI, ORGANISH_TOPICS, type OrganishBullet, type OrganishTopic } from "@/lib/randap-organish";
import { cn } from "@/lib/utils";

const ICONS: Record<string, typeof BookOpen> = {
  languages: Languages,
  brain: Brain,
  calculator: Calculator,
  landmark: Landmark,
};

const TILE_CLASSES: Record<string, string> = {
  rose: "bg-rose-100 text-rose-700",
  violet: "bg-violet-100 text-violet-700",
  amber: "bg-amber-100 text-amber-700",
  emerald: "bg-emerald-100 text-emerald-700",
};

function TopicTile({ topic, className }: { topic: OrganishTopic; className?: string }) {
  const Icon = ICONS[topic.icon] ?? BookOpen;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-xl",
        TILE_CLASSES[topic.color] ?? "bg-secondary text-secondary-foreground",
        className
      )}
    >
      <Icon className="size-6" />
    </span>
  );
}

function ArticleBullets({ bullets }: { bullets: OrganishBullet[] }) {
  return (
    <ul className="mt-2 flex flex-col gap-2.5">
      {bullets.map((b, i) => (
        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-foreground/85">
          <span
            aria-hidden="true"
            className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/60"
          />
          <span className="min-w-0">
            {b.lead ? (
              <span className="font-semibold text-foreground">{b.lead}: </span>
            ) : null}
            {b.text}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ArticleBody({ topic }: { topic: OrganishTopic }) {
  return (
    <div className="flex flex-col gap-6">
      {topic.sections.map((section, i) => (
        <section key={i} aria-label={section.heading} className="flex flex-col gap-1">
          {section.heading ? (
            <h2 className="text-base font-bold text-foreground">{section.heading}</h2>
          ) : null}
          {section.paragraphs?.map((p, j) => (
            <p key={j} className="mt-1 text-sm leading-relaxed text-foreground/85">
              {p}
            </p>
          ))}
          {section.bullets ? <ArticleBullets bullets={section.bullets} /> : null}
        </section>
      ))}
    </div>
  );
}

export function OrganishView({ onOpenTopic }: { onOpenTopic: (id: string) => void }) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-7 pb-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
          <BookOpen className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold text-foreground">O&apos;rganish</h1>
          <p className="text-sm text-muted-foreground">
            Mavzulalarda bilim boyligi — uzun maqolalar bilan chuqur o&apos;rganing
          </p>
        </div>
      </div>

      {/* 4 mavzu maqolalari */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ORGANISH_TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onOpenTopic(topic.id)}
            aria-label={`${topic.title} maqolasini ochish`}
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:border-primary/50 hover:bg-secondary/40"
          >
            <div className="flex items-center gap-4">
              <TopicTile topic={topic} />
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-bold text-foreground group-hover:text-primary/90">
                  {topic.title}
                </h2>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3" aria-hidden="true" />
                  {topic.readMin} daqiqa o&apos;qish
                </p>
              </div>
              <ChevronRight
                className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </div>
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {topic.subtitle}
            </p>
          </button>
        ))}
      </div>

      {/* Pastida: din va hayot burchlari — to'liq yozilgan matn */}
      <section
        aria-label="Din va hayot burchlari"
        className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <ScrollText className="size-6" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-amber-900">
              {HAYOT_BURCHLARI.title}
            </h2>
            <p className="text-xs leading-relaxed text-amber-700">
              {HAYOT_BURCHLARI.subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {HAYOT_BURCHLARI.sections.map((section) => (
            <div key={section.heading} className="flex flex-col gap-1">
              <h3 className="text-sm font-bold text-amber-900">
                {section.heading}
              </h3>
              <ul className="flex flex-col gap-2">
                {section.bullets.map((b) => (
                  <li
                    key={b.lead}
                    className="flex gap-2.5 text-sm leading-relaxed text-amber-950/90"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500"
                    />
                    <span className="min-w-0">
                      <span className="font-semibold text-amber-900">
                        {b.lead}:{" "}
                      </span>
                      {b.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-amber-300 bg-amber-100 p-4">
          <p className="text-sm font-bold text-amber-900">
            {HAYOT_BURCHLARI.question}
          </p>
          <ul className="mt-2.5 flex flex-col gap-2">
            {HAYOT_BURCHLARI.options.map((option) => (
              <li
                key={option}
                className="flex gap-2.5 text-sm leading-relaxed text-amber-950/90"
              >
                <span
                  aria-hidden="true"
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-600"
                />
                <span className="min-w-0">{option}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export function TopicDetailView({
  topicId,
  onBack,
}: {
  topicId: string;
  onBack: () => void;
}) {
  const topic = ORGANISH_TOPICS.find((t) => t.id === topicId);

  if (!topic) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="text-sm text-muted-foreground">Maqola topilmadi.</p>
        <button
          onClick={onBack}
          className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
        >
          O&apos;rganishga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Orqaga qaytish"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <h1 className="text-lg font-bold text-foreground">{topic.title}</h1>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
        <TopicTile topic={topic} className="size-14" />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-foreground">{topic.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {topic.subtitle}
          </p>
        </div>
        <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground sm:flex">
          <Clock className="size-3" aria-hidden="true" />
          {topic.readMin} daqiqa
        </span>
      </div>

      <p className="text-sm leading-relaxed text-foreground/85">{topic.intro}</p>

      <ArticleBody topic={topic} />
    </div>
  );
}
