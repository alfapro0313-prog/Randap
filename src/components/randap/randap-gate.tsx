"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getDeviceKey, readSession, type LoginSession } from "@/lib/randap-client";
import { LoginView } from "./login";
import { RandapApp } from "./randap-app";

/**
 * Kirish darvozasi:
 *  - sessiya yo'q bo'lsa LoginView ko'rinadi (ism + Gmail shart);
 *  - sessiya bo'lsa to'g'ridan-to'g'ri sayt ochiladi;
 *  - sessiya server bilan tekshiriladi (hisob o'chirilgan bo'lsa qayta so'raladi).
 */
export function RandapGate() {
  // undefined = yuklanmoqda, null = login kerak, LoginSession = kirilgan
  const [session, setSession] = useState<LoginSession | null | undefined>(
    undefined
  );

  useEffect(() => {
    let alive = false;
    const id = window.setTimeout(() => {
      alive = true;
      const stored = readSession();
      if (!stored) {
        setSession(null);
        return;
      }
      const deviceKey = stored.deviceKey ?? getDeviceKey();
      fetch(`/api/auth?deviceKey=${encodeURIComponent(deviceKey)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (!alive) return;
          if (data?.ok && data.account) {
            setSession({
              ...stored,
              name: String(data.account.name ?? stored.name),
              gmail: String(data.account.gmail ?? stored.gmail),
              viaGoogle: data.account.viaGoogle !== false,
            });
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
