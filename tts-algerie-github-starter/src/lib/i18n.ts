export type Lang = "ar" | "fr";

export type Dir = "rtl" | "ltr";

export const LOCALE_COOKIE = "voix_lang";

export const DEFAULT_LANG: Lang = "ar";

export function isLang(value: unknown): value is Lang {
  return value === "ar" || value === "fr";
}

export function dirFor(lang: Lang): Dir {
  return lang === "ar" ? "rtl" : "ltr";
}

export function otherLang(lang: Lang): Lang {
  return lang === "ar" ? "fr" : "ar";
}
