"use client";

import { useState } from "react";
import {
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SectionHeading, SectionShell } from "./section-heading";
import { Reveal } from "./reveal";
import { COURSES, SITE } from "@/lib/site-data";

type FormState = {
  name: string;
  phone: string;
  course: string;
  message: string;
};

const INITIAL: FormState = { name: "", phone: "", course: "", message: "" };

export function Contact() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const update = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };

      if (res.ok && data.ok) {
        toast({
          title: "Arizangiz yuborildi",
          description:
            "Rahmat! Adminimiz tez orada siz bilan bog'lanadi. Bepul sinov darsiga tayyorlaning.",
        });
        setForm(INITIAL);
      } else {
        toast({
          title: "Xatolik yuz berdi",
          description: data.error ?? "Ma'lumotlarni tekshirib, qayta urinib ko'ring.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Internet aloqasi yo'q",
        description: "Iltimos, aloqani tekshirib qayta yuboring.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SectionShell id="contact" className="bg-stone-50/70">
      <SectionHeading
        eyebrow="Aloqa"
        title="Bepul sinov darsiga yoziling"
        subtitle="Arizangizni qoldiring — adminimiz bir ish kuni ichida siz bilan bog'lanib, qulay vaqtni tanlashga yordam beradi."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        {/* Info column */}
        <Reveal className="h-full">
          <div className="flex h-full flex-col gap-4">
            <div className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <MapPin className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-stone-900">Manzil</p>
                <p className="mt-1 text-sm leading-relaxed text-stone-600">{SITE.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Phone className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-stone-900">Telefon</p>
                <a
                  href={SITE.phoneHref}
                  className="mt-1 block text-sm font-medium text-stone-600 hover:text-emerald-700"
                >
                  {SITE.phone}
                </a>
                <a
                  href={`mailto:${SITE.email}`}
                  className="mt-0.5 flex items-center gap-1.5 text-sm text-stone-500 hover:text-emerald-700"
                >
                  <Mail className="size-3.5" aria-hidden="true" />
                  {SITE.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Clock className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-stone-900">Ish vaqti</p>
                <p className="mt-1 text-sm text-stone-600">{SITE.hours}</p>
                <p className="text-sm text-stone-500">{SITE.hoursWeekend}</p>
              </div>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-4 pt-2">
              <Button
                asChild
                className="h-12 bg-[#25D366] text-base font-semibold text-white hover:bg-[#1fb857]"
              >
                <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-5" aria-hidden="true" />
                  WhatsApp
                </a>
              </Button>
              <Button
                asChild
                className="h-12 bg-[#2AABEE] text-base font-semibold text-white hover:bg-[#2395d2]"
              >
                <a href={SITE.telegram} target="_blank" rel="noopener noreferrer">
                  <Send className="size-5" aria-hidden="true" />
                  Telegram
                </a>
              </Button>
            </div>
          </div>
        </Reveal>

        {/* Form column */}
        <Reveal delay={0.12} className="h-full">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <h3 className="text-lg font-bold text-stone-900">Ariza qoldirish</h3>
            <p className="mt-1 text-sm text-stone-500">
              Maydonlarni to&apos;ldiring — biz bog&apos;lanamiz.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Ismingiz *</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  minLength={2}
                  placeholder="Masalan: Aziza"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Telefon raqami *</Label>
                <Input
                  id="phone"
                  name="phone"
                  required
                  type="tel"
                  inputMode="tel"
                  placeholder="+998 90 123 45 67"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <Label htmlFor="course">Qaysi kursga yozilmoqchisiz?</Label>
              <Select value={form.course} onValueChange={(v) => update("course", v)}>
                <SelectTrigger id="course" className="h-11 w-full">
                  <SelectValue placeholder="Kursni tanlang (ixtiyoriy)" />
                </SelectTrigger>
                <SelectContent>
                  {COURSES.map((course) => (
                    <SelectItem key={course.id} value={course.title}>
                      {course.title}
                    </SelectItem>
                  ))}
                  <SelectItem value="Hali bilmayman">Hali bilmayman — maslahat kerak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <Label htmlFor="message">Xabar</Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                placeholder="O'zingizni qisqacha tanishtiring yoki savolingizni yozing..."
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="mt-6 h-12 w-full bg-emerald-600 text-base font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                  Yuborilmoqda...
                </>
              ) : (
                <>
                  <Send className="size-5" aria-hidden="true" />
                  Arizani yuborish
                </>
              )}
            </Button>
            <p className="mt-3 text-center text-xs text-stone-400">
              Ma&apos;lumotlaringiz xavfsiz saqlanadi va uchinchi shaxslarga
              berilmaydi.
            </p>
          </form>
        </Reveal>
      </div>
    </SectionShell>
  );
}
