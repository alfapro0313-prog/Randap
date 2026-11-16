"use client";

import { useEffect, useState } from "react";
import type { Me } from "./randap-types";
import { compactCount, timeAgo as timeAgoRelative } from "./randap-i18n";

const DEVICE_KEY_STORAGE = "randap_device_key";
/** Saytga kirish sessiyasi (login gate) — ism + Gmail */
export const SESSION_STORAGE = "randap_session";

export type LoginSession = {
  name: string;
  gmail: string;
  viaGoogle: boolean;
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
  } catch {
    // ignore
  }
}

export function clearSession() {
  try {
    window.localStorage.removeItem(SESSION_STORAGE);
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
    key = randomId();
    window.localStorage.setItem(DEVICE_KEY_STORAGE, key);
  }
  return key;
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
