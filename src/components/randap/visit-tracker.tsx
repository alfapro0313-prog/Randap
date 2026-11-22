"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getBaseDeviceKey, readSession, SESSION_EVENT } from "@/lib/randap-client";

/**
 * SAYT STATISTIKASI YOZUVCHISI (layoutga ulangan — hammasahifada ishlaydi):
 *  - sahifa ochilganda / sahifa almashganda: "view" (SiteVisit qatori);
 *  - har 60 soniyada: "ping" yurak urishi (Presence) — admin panel
 *    "hozir online" ro'yxati shunga qarab hisoblanadi;
 *  - tab yana ko'rinishga chiqqanda: darhol ping;
 *  - login/logout bo'lganda: darhol ping (SESSION_EVENT) — online ro'yxat
 *    ism/gmail bilan darhol yangilanadi.
 * Mehmonlar ham sanaladi (visitorId = qurilmaning o'zgarmas kaliti).
 */

/** Sahifa almashganda yangi "view" yozamiz, heartbeat esa "ping" */

// React Strict Mode / HMR effektni ikki marta ishga tushirsa ham bitta
// sahifa faqat BIRTA "view" bo'lishi uchun modul darajasida guard
let lastViewKey = "";
let lastViewAt = 0;
const VIEW_GUARD_MS = 15_000;

export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const visitorId = getBaseDeviceKey();
    if (!visitorId) return;

    const send = (kind: "view" | "ping") => {
      try {
        const session = readSession();
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          keepalive: true,
          body: JSON.stringify({
            kind,
            visitorId,
            path: pathname || "/",
            userKey: session?.accountKey || "",
          }),
        }).catch(() => {});
      } catch {
        // Statistika hech qachon sayt ishlashiga xalaqit bermasin
      }
    };

    // 1) Bu sahifa ko'rildi (qisqa vaqt ichida xuddi shu sahifa qayta
    //    montaj bo'lsa — faqat presence yangilanadi, view yozilmaydi)
    const viewKey = `${visitorId}:${pathname}`;
    if (viewKey !== lastViewKey || Date.now() - lastViewAt > VIEW_GUARD_MS) {
      lastViewKey = viewKey;
      lastViewAt = Date.now();
      send("view");
    } else {
      send("ping");
    }

    // 2) Yurak urishi — har 60 soniyada (faqat tab ochiq va ko'rinayotganda)
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      send("ping");
    }, 60_000);

    // 3) Tab yana ko'rinsa — darhol ping (kompyuter uxlab qolsa ham online
    //    holat to'g'ri qaytadi)
    const onVisibility = () => {
      if (document.visibilityState === "visible") send("ping");
    };
    document.addEventListener("visibilitychange", onVisibility);

    // 4) Login/logout — darhol yangilash (ism/gmail online ro'yxatga tushadi)
    const onSessionChange = () => send("ping");
    window.addEventListener(SESSION_EVENT, onSessionChange);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener(SESSION_EVENT, onSessionChange);
    };
  }, [pathname]);

  return null;
}
