"use client";

import { Check, Loader2, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { isLang, makeT, type Lang } from "@/lib/randap-i18n";
import { getBaseDeviceKey, writeSession } from "@/lib/randap-client";
import { activeBlockMs, formatLeft, remainingMs } from "@/lib/randap-admin";

/**
 * Google OAuth dan qaytish sahifasi:
 *  - ok=1 → sessiya localStorage'ga yoziladi va sayt ochiladi;
 *  - err=... → xatolik izohi (blok sababi ham ko'rsatiladi).
 */
export default function GoogleDonePage() {
  const [params, setParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
  }, []);

  const lang: Lang = (() => {
    if (!params) return "uz";
    const l = params.get("lang");
    return isLang(l) ? l : "uz";
  })();
  const t = makeT(lang);

  // Muvaffaqiyat: sessiyani yozamiz va saytga o'tamiz (bir marta)
  useEffect(() => {
    if (!params) return;
    if (params.get("ok") !== "1") return;
    const key = params.get("key") ?? "";
    const name = params.get("name") ?? "";
    const gmail = params.get("gmail") ?? "";
    const dk = params.get("dk") ?? "";
    if (!key || !name || !gmail) return;
    writeSession({
      name,
      gmail,
      viaGoogle: true,
      accountKey: key,
      deviceKey: dk || getBaseDeviceKey(),
      at: Date.now(),
    });
    const timer = window.setTimeout(() => {
      window.location.replace("/");
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [params]);

  if (!params) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  // ---------- Muvaffaqiyat ----------
  if (params.get("ok") === "1") {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
        />
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl">
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/15">
              <Check className="size-9 text-emerald-500" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold text-foreground">
              {t("oauthDoneOk")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("loginSuccessSub", {
                name: params.get("name") ?? "",
                gmail: params.get("gmail") ?? "",
              })}
            </p>
            <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              {t("oauthDoneOpening")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Xatolik ----------
  const err = params.get("err") ?? "token";
  let errText: string;
  if (err === "blocked") {
    const until = Number(params.get("until") ?? "0");
    const isPerm =
      Number.isFinite(until) && until >= 253402000000000;
    const base = isPerm
      ? t("blockedPermanent")
      : (() => {
          const ms = remainingMs(activeBlockMs(until) ?? 0);
          return t("loginBlocked", {
            time: formatLeft(ms, t("unitHour"), t("unitMin")),
          });
        })();
    const reason = params.get("reason") ?? "";
    errText = reason
      ? `${base} ${t("blockedReason", { reason })}`
      : base;
  } else if (err === "state") {
    errText = t("oauthDoneErrState");
  } else if (err === "gmail") {
    errText = t("oauthDoneErrGmail");
  } else if (err === "not_configured") {
    errText = t("oauthDoneErrNotConfigured");
  } else {
    errText = t("oauthDoneErrToken");
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
      />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Play className="size-5 fill-current" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold text-foreground">
            {t("oauthDoneErrTitle")}
          </h1>
          <p
            className="text-sm leading-relaxed text-red-500"
            role="alert"
          >
            {errText}
          </p>
          <a
            href="/"
            className="mt-4 flex min-h-[44px] w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("oauthDoneRetry")}
          </a>
        </div>
      </div>
    </div>
  );
}
