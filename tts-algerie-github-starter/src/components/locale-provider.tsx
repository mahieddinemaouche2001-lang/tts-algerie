"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  dirFor,
  LOCALE_COOKIE,
  otherLang,
  type Dir,
  type Lang,
} from "@/lib/i18n";

type LocaleContextValue = {
  lang: Lang;
  dir: Dir;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: (fr: string, ar: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const dir = dirFor(lang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      lang,
      dir,
      setLang,
      toggle: () => setLang(otherLang(lang)),
      t: (fr: string, ar: string) => (lang === "ar" ? ar : fr),
    }),
    [lang, dir, setLang]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used inside LocaleProvider");
  }
  return context;
}
