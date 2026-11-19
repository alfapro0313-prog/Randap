"use client";

import { useEffect, useRef } from "react";
import { useLang } from "./lang-provider";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** AdSense pub ID — Vercel env'da NEXT_PUBLIC_ADSENSE_CLIENT (masalan: ca-pub-1234567890123456) */
const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";

/**
 * Kichik AdSense banneri.
 * Env qo'yilmagan bo'lsa umuman ko'rinmaydi (sayt toza ishlaydi).
 * Google Auto Ads ham xuddi shu client skripti bilan ishlaydi.
 */
export function AdSlot({ slot, className }: { slot?: string; className?: string }) {
  const { t } = useLang();
  const pushed = useRef(false);

  useEffect(() => {
    if (!CLIENT || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense skripti hali yuklanmagan bo'lsa jim o'tamiz
    }
  }, []);

  if (!CLIENT) return null;

  return (
    <div className={className ?? ""}>
      <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {t("adLabel")}
      </span>
      <ins
        className="adsbygoogle block w-full"
        style={{ display: "block", minHeight: 60, maxHeight: 90 }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  );
}
