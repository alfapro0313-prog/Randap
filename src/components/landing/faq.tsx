import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading, SectionShell } from "./section-heading";
import { Reveal } from "./reveal";
import { FAQS } from "@/lib/site-data";

export function Faq() {
  return (
    <SectionShell id="faq" className="bg-white">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Savol-javob"
          title="Ko'p beriladigan savollar"
          subtitle="Javobini topa olmadingizmi? Aloqa bo'limidan savol yuboring — 15 daqiqa ichida javob beramiz."
        />

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="mt-10">
            {FAQS.map((faq, i) => (
              <AccordionItem key={faq.q} value={`faq-${i}`} className="border-stone-200">
                <AccordionTrigger className="text-left text-base font-semibold text-stone-900 hover:text-emerald-700 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-stone-600">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </SectionShell>
  );
}
