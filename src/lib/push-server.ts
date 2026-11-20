import { sendNotification, setVapidDetails } from "web-push";
import { db } from "@/lib/db";
import { VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY, VAPID_SUBJECT } from "./push-config";

let configured = false;
function ensureConfigured() {
  if (configured) return;
  setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  configured = true;
}

export type PushPayload = {
  /** Sarlavha: odatda yuboruvchi ismi yoki "Randap" */
  title: string;
  /** Xabar matni: xabar ko'rinishi yoki "sizga N DZF berdi" */
  body: string;
  /** Bosilganda ochiladigan manzil */
  url?: string;
  /** Bir xil tag — eski bildirishnoma yangisiga almashadi */
  tag?: string;
};

/**
 * Foydalanuvchining barcha push obunalariga bildirishnoma yuboradi.
 * O'lgan (404/410) obunalar bazadan o'chiriladi. Xatolar jim o'tkaziladi —
 * push ishlamasligi asosiy amalga xalal bermasligi kerak.
 */
export async function sendPushToUser(deviceKey: string, payload: PushPayload): Promise<void> {
  try {
    ensureConfigured();
    const subs = await db.pushSubscription.findMany({ where: { deviceKey } });
    if (subs.length === 0) return;
    const body = JSON.stringify(payload);
    await Promise.all(
      subs.map(async (s) => {
        try {
          await sendNotification(
            {
              endpoint: s.endpoint,
              keys: { p256dh: s.p256dh, auth: s.auth },
            },
            body,
            { TTL: 60 * 60 * 24 }
          );
        } catch (err) {
          const status = (err as { statusCode?: number }).statusCode;
          if (status === 404 || status === 410) {
            await db.pushSubscription.deleteMany({ where: { endpoint: s.endpoint } }).catch(() => undefined);
          }
        }
      })
    );
  } catch (err) {
    console.error("sendPushToUser error:", err);
  }
}
