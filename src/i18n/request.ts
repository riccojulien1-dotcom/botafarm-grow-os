import { getRequestConfig } from "next-intl/server";

import { defaultLocale } from "@/i18n/config";
import { resolveLocale } from "@/i18n/resolve-locale";

async function loadMessages(locale: string) {
  return (await import(`./messages/${locale}.json`)).default;
}

export default getRequestConfig(async () => {
  const locale = await resolveLocale();
  const englishMessages = await loadMessages(defaultLocale);
  const localeMessages = locale === defaultLocale ? {} : await loadMessages(locale);

  return {
    locale,
    messages: {
      ...englishMessages,
      ...localeMessages,
    },
  };
});
