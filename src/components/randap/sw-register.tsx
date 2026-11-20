"use client";

import { useEffect } from "react";
import { getDeviceKey } from "@/lib/randap-client";

/** VAPID public kalitni Uint8Array ga aylantirish */
function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalized = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(normalized);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    out[i] = raw.charCodeAt(i);
  }
  return out;
}

/**
 * Service worker'ni ro'yxatdan o'tkazadi — PWA installability uchun.
 * Undan tashqari Web Push obunasini yaratadi: ruxsat berilgan bo'lsa yangi
 * xabar / DZF o'tkazma haqida sayt yopiq bo'lsa ham tashqi bildirishnoma chiqadi.
 * Ruxsat hali so'ralmagan bo'lsa — birinchi bosishda so'raladi (Chrome talabi).
 */
export function SwRegister() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    if (!("PushManager" in window) || typeof Notification === "undefined") return;

    let done = false;

    async function subscribe() {
      if (done) return;
      done = true;
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        const deviceKey = getDeviceKey();
        if (!deviceKey) return;

        const cfgRes = await fetch("/api/push/config", { cache: "no-store" });
        const cfg = (await cfgRes.json()) as { ok?: boolean; publicKey?: string };
        if (!cfg?.ok || !cfg.publicKey) return;

        const existing = await reg.pushManager.getSubscription();
        const sub =
          existing ??
          (await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(cfg.publicKey) as BufferSource,
          }));

        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceKey, subscription: sub.toJSON() }),
        });
      } catch {
        // push ishlamasa — sayt baribir ishlaydi
      }
    }

    async function trySubscribe(ask: boolean) {
      const perm = Notification.permission;
      if (perm === "granted") {
        await subscribe();
        return;
      }
      if (perm === "default" && ask) {
        const p = await Notification.requestPermission();
        if (p === "granted") await subscribe();
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
