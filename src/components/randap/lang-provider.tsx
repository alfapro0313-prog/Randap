"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  LANG_STORAGE,
  LANG_STORAGE_LEGACY,
  isLang,
  makeT,
  type Lang,
  type TFunc,
} from "@/lib/randap-i18n";

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TFunc;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Saqlangan tilni o'qish (eski chat-ga tegishli kalitni ham qo'llab-quvvatlaymiz)
  useEffect(() => {
    const id = window.setTimeout(() => {
      const stored =
        window.localStorage.getItem(LANG_STORAGE) ??
        window.localStorage.getItem(LANG_STORAGE_LEGACY);
      if (isLang(stored)) setLangState(stored);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(LANG_STORAGE, next);
      // eski kalitni ham sinxronlab qo'yamiz — chat hamma joyda bir xil til ko'rsin
      window.localStorage.setItem(LANG_STORAGE_LEGACY, next);
    } catch {
      // ignore
    }
  }, []);

  const t = useMemo(() => makeT(lang), [lang]);

  // <html lang> ni tanlangan til bilan sinxronlash
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(
    () => ({ lang, setLang, t }),
    [lang, setLang, t]
  );

  return (
    <LangContext.Provider value={value}>{children}</LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) {
    // Provider tashqarisida ishlatilsa — inglizcha default
    return { lang: "en", setLang: () => undefined, t: makeT("en") };
  }
  return ctx;
}
