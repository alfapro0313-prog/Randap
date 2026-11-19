"use client";

import { useEffect, useState } from "react";
import type { Me } from "./randap-types";
import { compactCount, timeAgo as timeAgoRelative } from "./randap-i18n";

const DEVICE_KEY_STORAGE = "randap_device_key";
/** Qurilmaning o'zgarmas asosiy kaliti — logout/login almashtirishda saqlanadi */
const BASE_DEVICE_KEY_STORAGE = "randap_base_device_key";
/** Saytga kirish sessiyasi (login gate) — ism + Gmail */
export const SESSION_STORAGE = "randap_session";

export type LoginSession = {
  name: string;
  gmail: string;
  viaGoogle: boolean;
  /** Hisobning doimiy kaliti — bitta gmail = bitta accountKey */
  accountKey?: string;
  deviceKey?: string;
  at?: number;
};

export function readSession(): LoginSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LoginSession;
    if (!parsed || !parsed.name || !parsed.gmail) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeSession(session: LoginSession) {
  try {
    window.localStorage.setItem(SESSION_STORAGE, JSON.stringify(session));
    // Hisob kaliti — barcha ma'lumotlar endi shu kalit atrofida saqlanadi:
    // boshqa gmail bilan kirsa eski ma'lumotlar ko'rinmaydi
    if (session.accountKey) setDeviceKey(session.accountKey);
  } catch {
    // ignore
  }
}

export function clearSession() {
  try {
    window.localStorage.removeItem(SESSION_STORAGE);
    // Chiqishda qurilma asosiy kalitiga qaytadi (login formasi uchun)
    setDeviceKey(getBaseDeviceKey());
  } catch {
    // ignore
  }
}

function randomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `dev-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

export function getDeviceKey(): string {
  if (typeof window === "undefined") return "";
  let key = window.localStorage.getItem(DEVICE_KEY_STORAGE);
  if (!key) {
    key = getBaseDeviceKey();
    window.localStorage.setItem(DEVICE_KEY_STORAGE, key);
  }
  return key;
}

/**
 * Qurilmaning O'ZGARMAS kaliti — hech qachon almashtirilmaydi.
 * Eski foydalanuvchilar uchun mavjud device key asos bo'lib qoladi
 * (eski ma'lumotlar yo'qolmaydi).
 */
export function getBaseDeviceKey(): string {
  if (typeof window === "undefined") return "";
  let base = window.localStorage.getItem(BASE_DEVICE_KEY_STORAGE);
  if (!base) {
    base = window.localStorage.getItem(DEVICE_KEY_STORAGE) || randomId();
    window.localStorage.setItem(BASE_DEVICE_KEY_STORAGE, base);
  }
  return base;
}

/** Faol identifikatorni almashtirish (login: accountKey, logout: base) */
export function setDeviceKey(key: string) {
  if (typeof window === "undefined" || !key) return;
  window.localStorage.setItem(DEVICE_KEY_STORAGE, key);
}

/* ---------- Keyin ko'rish ro'yxati (localStorage, hisobga bog'langan) ---------- */

export const WATCH_LATER_KEY = "randap_watch_later";
export const WATCH_LATER_EVENT = "randap-watch-later-changed";

/** Ro'yxat kaliti: hisob accountKey'i bor bo'lsa — hisobga bog'lanadi */
function watchLaterStorageKey(): string {
  const session = readSession();
  return session?.accountKey
    ? `${WATCH_LATER_KEY}:${session.accountKey}`
    : WATCH_LATER_KEY;
}

export function getWatchLater(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const key = watchLaterStorageKey();
    const raw = window.localStorage.getItem(key);
    if (raw) {
      const list = JSON.parse(raw) as unknown;
      return Array.isArray(list) ? list.filter((v): v is string => typeof v === "string") : [];
    }
    // Migration: eski (qurilmaga bog'langan) ro'yxat — faqat asosiy hisobga o'tkaziladi
    const session = readSession();
    const legacy = window.localStorage.getItem(WATCH_LATER_KEY);
    if (session?.accountKey && legacy && session.accountKey === getBaseDeviceKey()) {
      const list = JSON.parse(legacy) as unknown;
      if (Array.isArray(list)) {
        const filtered = list.filter((v): v is string => typeof v === "string");
        window.localStorage.setItem(key, JSON.stringify(filtered));
        return filtered;
      }
    }
    return [];
  } catch {
    return [];
  }
}

/** true qaytarsa — ro'yxatga qo'shildi, false — olib tashlandi */
export function toggleWatchLater(videoId: string): boolean {
  const list = getWatchLater();
  const exists = list.includes(videoId);
  const next = exists ? list.filter((v) => v !== videoId) : [videoId, ...list].slice(0, 200);
  try {
    window.localStorage.setItem(watchLaterStorageKey(), JSON.stringify(next));
    window.dispatchEvent(new Event(WATCH_LATER_EVENT));
  } catch {
    // ignore
  }
  return !exists;
}

/** useSyncExternalStore uchun subscribe — ro'yxat o'zgarganda xabar beradi */
export function subscribeWatchLater(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(WATCH_LATER_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(WATCH_LATER_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function ensureMe(): Promise<Me | null> {
  const deviceKey = getDeviceKey();
  if (!deviceKey) return Promise.resolve(null);
  return fetch(`/api/me?deviceKey=${encodeURIComponent(deviceKey)}`)
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => (data?.ok ? (data.me as Me) : null))
    .catch(() => null);
}

export function useDeviceMe() {
  const [deviceKey, setDeviceKey] = useState("");
  const [me, setMe] = useState<Me | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const key = getDeviceKey();
    ensureMe().then((profile) => {
      setDeviceKey(key);
      setMe(profile);
      setReady(true);
    });
  }, []);

  return { deviceKey, me, setMe, ready };
}

export function formatDuration(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export function formatCount(n: number, lang?: string): string {
  if (lang === "en" || lang === "ru" || lang === "uz") {
    return compactCount(n, lang);
  }
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")} mln`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")} ming`;
  return String(n);
}

export function timeAgo(iso: string, lang?: string): string {
  if (lang === "en" || lang === "ru" || lang === "uz") {
    return timeAgoRelative(iso, lang);
  }
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "hozir";
  if (min < 60) return `${min} daqiqa oldin`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours} soat oldin`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} kun oldin`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} oy oldin`;
  return `${Math.floor(months / 12)} yil oldin`;
}
