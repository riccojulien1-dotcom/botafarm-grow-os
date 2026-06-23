export const locales = ["en", "fr"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "fr";

export const localeCookieName = "NEXT_LOCALE";

export const localeLabels: Record<AppLocale, string> = {
  en: "English",
  fr: "Français",
};

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return locales.includes(value as AppLocale);
}
