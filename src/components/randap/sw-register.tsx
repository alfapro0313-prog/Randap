"use client";

import { useEffect } from "react";

/** Service worker'ni ro'yxatdan o'tkazadi — PWA installability uchun */
export function SwRegister() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    const reg = navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    void reg;
  }, []);
  return null;
}
