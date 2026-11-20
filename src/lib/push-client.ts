/**
 * Randap Web Push — klient tomonidagi umumiy logika.
 * Profil sahifasidagi "Bildirishnomalar" kaliti va SwRegister (avtomatik
 * obuna) ikkalasi ham shu moduldan foydalanadi.
 *
 * Holat flag localStorage'da: randap_push_off = "1" bo'lsa foydalanuvchi
 * bildirishnomalarni o'chirgan — SwRegister qayta yoqib yubormaydi.
 */

import { getDeviceKey } from "./randap-client";

export const PUSH_OFF_FLAG = "randap_push_off";

export type PushState = "on" | "off" | "blocked" | "unsupported";

export function pushSupported(): boolean {
  if (typeof navigator === "undefined") return false;
  if (!("serviceWorker" in navigator)) return false;
  if (!("PushManager" in window)) return false;
  return typeof Notification !== "undefined";
}

export function pushOffFlag(): boolean {
  try {
    return window.localStorage.getItem(PUSH_OFF_FLAG) === "1";
  } catch {
    return false;
  }
}

export function setPushOffFlag(off: boolean) {
  try {
    if (off) window.localStorage.setItem(PUSH_OFF_FLAG, "1");
    else window.localStorage.removeItem(PUSH_OFF_FLAG);
  } catch {
    // localStorage ishlamasa — davom etamiz
  }
}

/** Joriy holat: yoqilgan / o'chirilgan / brauzer bloklagan / qo'llanmaydi */
export async function getPushState(): Promise<PushState> {
  if (!pushSupported()) return "unsupported";
  if (Notification.permission === "denied") return "blocked";
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = reg ? await reg.pushManager.getSubscription() : null;
    if (sub && !pushOffFlag()) return "on";
    return "off";
  } catch {
    return "off";
  }
}

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
 * Bildirishnomalarni YOQISH: ruxsat so'raydi (kerak bo'lsa), obuna qiladi
 * va serverga saqlaydi. Natija: "granted" | "denied" | "error".
 */
export async function enablePush(): Promise<"granted" | "denied" | "error"> {
  if (!pushSupported()) return "error";
  try {
    let perm = Notification.permission;
    if (perm === "denied") return "denied";
    if (perm === "default") {
      perm = await Notification.requestPermission();
      if (perm !== "granted") return "denied";
    }

    const deviceKey = getDeviceKey();
    if (!deviceKey) return "error";

    const cfgRes = await fetch("/api/push/config", { cache: "no-store" });
    const cfg = (await cfgRes.json()) as { ok?: boolean; publicKey?: string };
    if (!cfg?.ok || !cfg.publicKey) return "error";

    const reg = await navigator.serviceWorker.register("/sw.js");
    const existing = await reg.pushManager.getSubscription();
    const sub =
      existing ??
      (await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(cfg.publicKey) as BufferSource,
      }));

    const res = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceKey, subscription: sub.toJSON() }),
    });
    if (!res.ok) return "error";

    setPushOffFlag(false);
    return "granted";
  } catch {
    return "error";
  }
}

/**
 * Bildirishnomalarni O'CHIRISH: brauzer obunasini bekor qiladi va serverdan
 * o'chiradi. Brauzer ruxsatini dastur yoqa olmaydi — faqat foydalanuvchi.
 */
export async function disablePush(): Promise<boolean> {
  setPushOffFlag(true);
  if (!pushSupported()) return true;
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = reg ? await reg.pushManager.getSubscription() : null;
    if (!sub) return true;
    const endpoint = sub.endpoint;
    await sub.unsubscribe();
    await fetch("/api/push/subscribe", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint }),
    });
    return true;
  } catch {
    return false;
  }
}
