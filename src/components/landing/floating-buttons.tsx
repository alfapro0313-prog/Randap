"use client";

import { MessageCircle, Send } from "lucide-react";
import { SITE } from "@/lib/site-data";

export function FloatingButtons() {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2.5 sm:bottom-6 sm:right-6">
      <a
        href={SITE.telegram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Telegram orqali yozish"
        className="flex size-12 items-center justify-center rounded-full bg-[#2AABEE] text-white shadow-lg transition-transform hover:scale-105"
      >
        <Send className="size-5" aria-hidden="true" />
      </a>
      <a
        href={SITE.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp orqali yozish"
        className="flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
      >
        <MessageCircle className="size-5" aria-hidden="true" />
      </a>
    </div>
  );
}
