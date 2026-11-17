"use client";

import { Check, Loader2, LogIn, Mail, Play, User } from "lucide-react";
import { useState } from "react";
import { LANGS, type Lang } from "@/lib/randap-i18n";
import {
  getDeviceKey,
  writeSession,
  type LoginSession,
} from "@/lib/randap-client";
import { activeBlockMs, formatLeft, remainingMs } from "@/lib/randap-admin";
import { useLang } from "./lang-provider";
import { cn } from "@/lib/utils";

/** Faqat Gmail manzillar qabul qilinadi */
const GMAIL_RE = /^[a-z0-9](?:[a-z0-9._%+-]{0,62})?@(?:gmail|googlemail)\.com$/i;

/** Google "G" logotipi (rangli SVG) */
function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function LangSwitch() {
  const { lang, setLang } = useLang();
  return (
    <div
      className="flex items-center gap-1 rounded-full border border-border bg-card/90 p-1 shadow-sm backdrop-blur"
      role="group"
      aria-label="Language"
    >
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code as Lang)}
          aria-pressed={lang === l.code}
          className={cn(
            "min-h-[32px] rounded-full px-3 py-1 text-xs font-bold transition-colors",
            lang === l.code
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Saytga kirish darvozasi:
 *  - ism va Gmail IKKALASI yozilmasa saytga kirmaydi;
 *  - ismga boshqalar qo'ygan ismni ham qo'yish mumkin;
 *  - Gmail maydoni ostida "Google orqali kirish" tugmasi — hisob bo'lmasa kirmaydi;
 *  - Gmail kiritilib, Google tasdiqlangach "Muvaffaqiyatli kirdingiz!" deydi
 *    va saytga o'tadi.
 */
export function LoginView({
  onLoggedIn,
}: {
  onLoggedIn: (session: LoginSession) => void;
}) {
  const { t, lang } = useLang();
  const [name, setName] = useState("");
  const [gmail, setGmail] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [gmailErr, setGmailErr] = useState("");
  const [googleOpen, setGoogleOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [googleErr, setGoogleErr] = useState("");
  const [success, setSuccess] = useState<LoginSession | null>(null);

  const openGoogle = () => {
    setNameErr("");
    setGmailErr("");
    const n = name.trim();
    const g = gmail.trim().toLowerCase();

    if (!n) {
      setNameErr(t("loginErrNameReq"));
      return;
    }
    if (n.length < 2 || n.length > 40) {
      setNameErr(t("loginErrNameShort"));
      return;
    }
    if (!g) {
      setGmailErr(t("loginErrGmailReq"));
      return;
    }
    if (!GMAIL_RE.test(g)) {
      setGmailErr(t("loginErrGmailFormat"));
      return;
    }
    setGoogleErr("");
    setGoogleOpen(true);
  };

  async function confirmGoogle() {
    const n = name.trim();
    const g = gmail.trim().toLowerCase();
    if (!n || !g || !GMAIL_RE.test(g)) {
      setGoogleErr(t("loginGoogleErrNotFound"));
      return;
    }

    setChecking(true);
    setGoogleErr("");
    // Google hisobini tekshirish simulyatsiyasi (demo)
    await new Promise((r) => setTimeout(r, 900));

    const deviceKey = getDeviceKey();
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceKey, name: n, gmail: g, viaGoogle: true }),
      });
      const data = await res.json();
      if (data?.blocked) {
        // ADMIN BLOKI — qolgan vaqt bilan xato ko'rsatiladi
        setChecking(false);
        const ms = remainingMs(activeBlockMs(data.blockedUntil) ?? 0);
        const time = formatLeft(ms, t("unitHour"), t("unitMin"));
        setGoogleErr(t("loginBlocked", { time }));
        return;
      }
      if (!data?.ok) {
        setChecking(false);
        setGoogleErr(String(data?.error ?? t("loginGoogleErrNotFound")));
        return;
      }
    } catch {
      // server javob bermasa ham demo davom etadi
    }

    const session: LoginSession = {
      name: n,
      gmail: g,
      viaGoogle: true,
      deviceKey,
      at: Date.now(),
    };
    writeSession(session);
    setChecking(false);
    setGoogleOpen(false);
    setSuccess(session);
    window.setTimeout(() => onLoggedIn(session), 1600);
  }

  const googleAvatarLetter = gmail.trim().charAt(0).toUpperCase() || "G";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-10">
      {/* Fon yorug'ligi */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />

      {/* Til almashtirish — kirishdan oldin ham ishlaydi */}
      <div className="absolute right-4 top-4 z-10">
        <LangSwitch />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-border bg-card p-7 shadow-2xl sm:p-8">
          {success ? (
            /* ---------- Muvaffaqiyatli kirish ---------- */
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/15">
                <Check
                  className="size-9 text-emerald-500"
                  aria-hidden="true"
                />
              </div>
              <h1 className="text-xl font-bold text-foreground">
                {t("loginSuccess")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("loginSuccessSub", { name: success.name, gmail: success.gmail })}
              </p>
              <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                {t("loginEntering")}
              </p>
            </div>
          ) : (
            <>
              {/* ---------- Kirish formasi ---------- */}
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                  <Play className="size-5 fill-current" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-lg font-extrabold tracking-tight text-foreground">
                    Randap
                  </p>
                  <p className="text-[11px] leading-tight text-muted-foreground">
                    {t("loginBrandTag")}
                  </p>
                </div>
              </div>

              <h1 className="mt-6 text-2xl font-bold text-foreground">
                {t("loginWelcome")}
              </h1>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {t("loginSub")}
              </p>

              <form
                className="mt-6 flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  openGoogle();
                }}
              >
                {/* Ism */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="login-name"
                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                  >
                    <User className="size-4 text-muted-foreground" aria-hidden="true" />
                    {t("loginNameLabel")}
                    <span className="text-primary">*</span>
                  </label>
                  <input
                    id="login-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("loginNamePlaceholder")}
                    maxLength={40}
                    autoComplete="name"
                    className={cn(
                      "min-h-[46px] w-full rounded-xl border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/40",
                      nameErr ? "border-red-500/60" : "border-border"
                    )}
                  />
                  {nameErr ? (
                    <p className="text-xs font-medium text-red-500" role="alert">
                      {nameErr}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {t("loginNameHint")}
                    </p>
                  )}
                </div>

                {/* Gmail */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="login-gmail"
                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                  >
                    <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
                    {t("loginGmailLabel")}
                    <span className="text-primary">*</span>
                  </label>
                  <input
                    id="login-gmail"
                    type="email"
                    inputMode="email"
                    dir="ltr"
                    value={gmail}
                    onChange={(e) => setGmail(e.target.value)}
                    placeholder={t("loginGmailPlaceholder")}
                    autoComplete="email"
                    className={cn(
                      "min-h-[46px] w-full rounded-xl border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/40",
                      gmailErr ? "border-red-500/60" : "border-border"
                    )}
                  />
                  {gmailErr ? (
                    <p className="text-xs font-medium text-red-500" role="alert">
                      {gmailErr}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {t("loginGmailHint")}
                    </p>
                  )}
                </div>

                {/* Gmail maydoni OSTIDA — Google orqali kirish */}
                <button
                  type="submit"
                  onClick={openGoogle}
                  className="mt-1 flex min-h-[50px] w-full items-center justify-center gap-3 rounded-xl bg-white text-sm font-semibold text-zinc-900 shadow-md transition-colors hover:bg-zinc-100"
                >
                  <GoogleG className="size-5" />
                  {t("loginGoogleBtn")}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          {t("loginBrandTag")}
        </p>
      </div>

      {/* ---------- Google hisobini tanlash (simulyatsiya) ---------- */}
      {googleOpen ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={t("loginGoogleTitle")}
          onClick={(e) => {
            if (e.target === e.currentTarget && !checking) setGoogleOpen(false);
          }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-7 text-zinc-900 shadow-2xl sm:p-8">
            {checking ? (
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <Loader2 className="size-8 animate-spin text-[#1a73e8]" aria-hidden="true" />
                <p className="text-sm font-medium text-zinc-700">
                  {t("loginGoogleChecking")}
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center gap-2 text-center">
                  <GoogleG className="size-10" />
                  <h2 className="mt-2 text-xl font-medium text-zinc-900">
                    {t("loginGoogleTitle")}
                  </h2>
                  <p className="text-sm text-zinc-500">{t("loginGoogleSub")}</p>
                </div>

                <div className="mt-6 flex items-center gap-3 rounded-xl border border-zinc-300 bg-white p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1a73e8] text-base font-bold text-white">
                    {googleAvatarLetter}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900">
                      {name.trim()}
                    </p>
                    <p className="truncate text-xs text-zinc-500" dir="ltr">
                      {gmail.trim().toLowerCase()}
                    </p>
                  </div>
                </div>

                {googleErr ? (
                  <p className="mt-3 text-sm font-medium text-red-600" role="alert">
                    {googleErr}
                  </p>
                ) : null}

                <div className="mt-6 flex flex-col gap-2">
                  <button
                    onClick={() => void confirmGoogle()}
                    className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1765cc]"
                  >
                    <LogIn className="size-4" aria-hidden="true" />
                    {t("loginGoogleContinue")}
                  </button>
                  <button
                    onClick={() => setGoogleOpen(false)}
                    className="flex min-h-[44px] w-full items-center justify-center rounded-full border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    {t("loginGoogleUseOther")}
                  </button>
                </div>

                <p className="mt-5 text-center text-[10px] text-zinc-400">
                  {t("loginGoogleDemo")}
                </p>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
