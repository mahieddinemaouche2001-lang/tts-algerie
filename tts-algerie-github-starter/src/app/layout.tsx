import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./style.css";
import "./v1.css";
import { LocaleProvider } from "@/components/locale-provider";
import { DEFAULT_LANG, dirFor, isLang, LOCALE_COOKIE } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "VOIX DZ — Voix off IA pour l'Algérie",
  description:
    "VOIX DZ : plateforme algérienne de synthèse vocale assistée par IA. Textes en arabe et en français, voix off pour publicité, narration et formation.",
};

export const viewport: Viewport = {
  themeColor: "#006B3F",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await cookies();
  const cookieLang = store.get(LOCALE_COOKIE)?.value;
  const lang = isLang(cookieLang) ? cookieLang : DEFAULT_LANG;

  return (
    <html lang={lang} dir={dirFor(lang)}>
      <body>
        <LocaleProvider initialLang={lang}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
