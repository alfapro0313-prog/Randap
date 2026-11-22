"use client";

import { Check, LogOut, Settings, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LANGS } from "@/lib/randap-i18n";
import { clearSession, getDeviceKey } from "@/lib/randap-client";
import { useLang } from "./lang-provider";
import { cn } from "@/lib/utils";

/**
 * Global sozlamalar oynasi — Profil yonidagi gildirak (⚙) bosilganda ochiladi.
 * Til tanlash HAMMA bo'limlarga tegishli (portal, videolar, testlar,
 * o'rganish, chat, ballar va h.k.), darhol qo'llanadi va esda saqlanadi.
 */
export function SettingsGear({
  className,
  iconClassName,
  title,
}: {
  className?: string;
  iconClassName?: string;
  title?: string;
}) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const { lang, setLang } = useLang();
  // Portal — header'dagi backdrop-blur "fixed" oynani header'ga qisib,
  // tillarni ekranning tepasiga chiqarib yuborardi. Body'ga render qilamiz.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleLogout = useCallback(() => {
    try {
      const deviceKey = getDeviceKey();
      void fetch("/api/auth", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceKey }),
      }).catch(() => undefined);
    } catch {
      // ignore
    }
    clearSession();
    window.location.reload();
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={t("settingsAria")}
        title={title ?? t("settingsAria")}
        className={
          className ??
          "flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80"
        }
      >
        <Settings className={iconClassName ?? "size-5"} aria-hidden="true" />
      </button>

      {open && mounted ? createPortal(
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t("settings")}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">
                {t("settings")}
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label={t("close")}
                className="flex size-8 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-secondary/80"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <p className="text-sm font-semibold text-foreground">
                {t("language")}
              </p>
              <div className="flex flex-col gap-2">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    aria-pressed={lang === l.code}
                    className={cn(
                      "flex min-h-[44px] items-center justify-between rounded-xl border px-4 text-sm font-semibold transition-colors",
                      lang === l.code
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-background text-foreground hover:bg-secondary/60"
                    )}
                  >
                    {l.label}
                    {lang === l.code ? (
                      <Check className="size-4 text-primary" aria-hidden="true" />
                    ) : null}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {t("languageAppliesAll")}
              </p>
            </div>

            <div className="mt-5 border-t border-border pt-4">
              <button
                onClick={handleLogout}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/20"
              >
                <LogOut className="size-4" aria-hidden="true" />
                {t("logout")}
              </button>
              <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
                {t("loginGmailHint")}
              </p>
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </>
  );
}
