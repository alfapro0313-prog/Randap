"use client";

import { useEffect, useState } from "react";
import { Ban, Loader2 } from "lucide-react";
import {
  getBaseDeviceKey,
  getDeviceKey,
  readSession,
  writeSession,
  type LoginSession,
} from "@/lib/randap-client";
import { activeBlockMs, formatLeft, remainingMs } from "@/lib/randap-admin";
import { LoginView } from "./login";
import { RandapApp } from "./randap-app";
import { useLang } from "./lang-provider";

/**
 * Kirish darvozasi:
 *  - sessiya yo'q bo'lsa LoginView ko'rinadi (ism + Gmail shart);
 *  - sessiya bo'lsa to'g'ridan-to'g'ri sayt ochiladi;
 *  - sessiya server bilan tekshiriladi (hisob o'chirilgan bo'lsa qayta so'raladi);
 *  - hisob admin tomonidan bloklangan bo'lsa — blok ekrani ko'rinadi.
 */
export function RandapGate() {
  // undefined = yuklanmoqda, null = login kerak, LoginSession = kirilgan
  const [session, setSession] = useState<LoginSession | null | undefined>(
    undefined
  );
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const [blockedReason, setBlockedReason] = useState<string | null>(null);

  useEffect(() => {
    let alive = false;
    const id = window.setTimeout(() => {
      alive = true;
      // Asosiy qurilma kaliti HOZIR saqlanadi — login/logout almashtirishlardan oldin
      const baseKey = getBaseDeviceKey();
      const stored = readSession();
      if (!stored) {
        setSession(null);
        return;
      }
      // Hisob kaliti bilan tekshirish (yangi sessiyalar), eski sessiya — deviceKey
      const key = stored.accountKey ?? stored.deviceKey ?? baseKey ?? getDeviceKey();
      fetch(`/api/auth?deviceKey=${encodeURIComponent(key)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (!alive) return;
          if (data?.ok && data.account) {
            // ADMIN BLOKI — bloklangan bo'lsa sayt ochilmaydi
            const blockMs = activeBlockMs(data.account.blockedUntil);
            if (blockMs) {
              setBlockedUntil(blockMs);
              setBlockedReason(data.account.blockReason ?? null);
              return;
            }
            const next: LoginSession = {
              ...stored,
              name: String(data.account.name ?? stored.name),
              gmail: String(data.account.gmail ?? stored.gmail),
              viaGoogle: data.account.viaGoogle !== false,
              accountKey: String(data.account.accountKey ?? stored.accountKey ?? ""),
            };
            // Hisob kaliti faol identifikator bo'ladi (barcha ma'lumotlar shu kalitda)
            writeSession(next);
            setSession(next);
          } else if (data?.ok && !data.account) {
            // hisob serverda yo'q — qayta kirish so'raladi
            setSession(null);
          } else {
            // server javob bermadi — lokal sessiyaga ishonamiz
            setSession(stored);
          }
        })
        .catch(() => {
          if (alive) setSession(stored);
        });
    }, 0);
    return () => {
      alive = false;
      window.clearTimeout(id);
    };
  }, []);

  // BLOK tekshiruvi yuklanish holatidan OLDIN — aks holda bloklangan
  // foydalanuvchi abadiy "yuklanmoqda" ekranda qoladi
  if (blockedUntil) {
    return (
      <BlockedScreen
        until={blockedUntil}
        reason={blockedReason}
        onBack={() => {
          setBlockedUntil(null);
          setBlockedReason(null);
          setSession(null);
        }}
      />
    );
  }

  if (session === undefined) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
          <Loader2 className="size-6 animate-spin" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold tracking-wide text-muted-foreground">
          Randap
        </p>
      </div>
    );
  }

  if (session === null) {
    return <LoginView onLoggedIn={(s) => setSession(s)} />;
  }

  return <RandapApp />;
}

/** Bloklangan hisob uchun ekran — sabab va qolgan vaqt ko'rinadi */
function BlockedScreen({
  until,
  reason,
  onBack,
}: {
  until: number;
  reason: string | null;
  onBack: () => void;
}) {
  const { t } = useLang();
  const [, setTick] = useState(0);

  useEffect(() => {
    // Har 30 soniyada qolgan vaqtni yangilab turadi
    const id = window.setInterval(() => setTick((n) => n + 1), 30000);
    return () => window.clearInterval(id);
  }, []);

  const left = remainingMs(until);
  const time = formatLeft(left, t("unitHour"), t("unitMin"));
  // Doimiy blok — 9999-yilga qadar
  const isPerm = until >= 253402000000000;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl"
      />
      <div className="relative w-full max-w-md rounded-3xl border border-red-500/30 bg-card p-8 text-center shadow-2xl">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-500/15">
          <Ban className="size-9 text-red-500" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-foreground">
          {t("blockedTitle")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("blockedDesc")}
        </p>
        {reason ? (
          <p
            className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-500"
            dir="auto"
          >
            {t("blockedReason", { reason })}
          </p>
        ) : null}
        <p
          role="status"
          className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-500"
        >
          {isPerm ? t("blockedPermanent") : t("blockedLeft", { time })}
        </p>
        <button
          onClick={onBack}
          className="mt-6 flex min-h-[44px] w-full items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/60"
        >
          {t("blockedBack")}
        </button>
      </div>
    </div>
  );
}
