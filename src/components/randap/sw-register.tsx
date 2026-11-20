"use client";

import { useEffect } from "react";
import { pushOffFlag, enablePush, pushSupported } from "@/lib/push-client";

/**
 * Service worker'ni ro'yxatdan o'tkazadi — PWA installability uchun.
 * Undan tashqari Web Push obunasini yaratadi: ruxsat berilgan bo'lsa yangi
 * xabar / DZF o'tkazma haqida sayt yopiq bo'lsa ham tashqi bildirishnoma chiqadi.
 *
 * Foydalanuvchi profil sahifasida bildirishnomalarni O'CHIRGAN bo'lsa
 * (localStorage flag) — bu yerda avtomatik qayta yoqilmaydi va ruxsat
 * so'ralmaydi; uni faqat profil ichidagi kalit yoqadi.
 */
export function SwRegister() {
  useEffect(() => {
    if (!pushSupported()) return;

    // Service worker har doim ro'yxatdan o'tadi — PWA offline va push uchun
    void navigator.serviceWorker.register("/sw.js").catch(() => undefined);

    let done = false;

    async function trySubscribe(ask: boolean) {
      if (done) return;
      if (pushOffFlag()) return; // profil ichidan o'chirilgan — aralashmaymiz
      const perm = Notification.permission;
      if (perm === "granted" || (perm === "default" && ask)) {
        done = true;
        await enablePush();
      }
    }

    // Ruxsat allaqachon berilgan bo'lsa — jim obuna qilamiz
    void trySubscribe(false);
    // Aks holda birinchi bosishda so'raymiz
    const onFirstClick = () => void trySubscribe(true);
    document.addEventListener("click", onFirstClick, { once: true });
    return () => document.removeEventListener("click", onFirstClick);
  }, []);
  return null;
}
