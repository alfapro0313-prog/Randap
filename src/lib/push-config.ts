/**
 * Web Push (VAPID) sozlamalari — Telegram-uslubidagi tashqi bildirishnomalar.
 * Kalitlar bir marta generatsiya qilingan (web-push.generateVAPIDKeys) va
 * shu faylda saqlanadi: /api/push/config public kalitni qaytaradi,
 * server tomonda private kalit ishlatiladi.
 */
export const VAPID_PUBLIC_KEY =
  "BEHtg9xchWrxLPAkfMJfnyX6Sh6q2uCMQZ3f8w9rWuQuD6uyeAtd5DcaKnCFB8afUeWnPn29xrAtfl6WLRWxLjk";
export const VAPID_PRIVATE_KEY =
  "poaODtMkOxsrQkKQIeT9WJfMwQ9QrtimM0GMtWkbgRQ";
/** Push yuborayotgan sayt (mailto o'rniga https ko'rsatiladi) */
export const VAPID_SUBJECT = "https://randap.vercel.app";
