import type { AppLocale } from "@/i18n/config";
import { defaultLocale, isAppLocale, localeCookieName } from "@/i18n/config";
import { getProfileLanguage } from "@/lib/auth/get-profile";
import { getCurrentUser } from "@/lib/auth/get-user";
import { env } from "@/lib/env";
import { cookies, headers } from "next/headers";

function hasSupabaseEnv() {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function localeFromAcceptLanguage(headerValue: string | null): AppLocale | null {
  if (!headerValue) {
    return null;
  }

  const requested = headerValue
    .split(",")
    .map((part) => part.trim().split(";")[0]?.toLowerCase())
    .filter(Boolean);

  for (const language of requested) {
    if (!language) {
      continue;
    }

    if (isAppLocale(language)) {
      return language;
    }

    const base = language.split("-")[0];
    if (isAppLocale(base)) {
      return base;
    }
  }

  return null;
}

export async function resolveLocale(): Promise<AppLocale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(localeCookieName)?.value;
  if (isAppLocale(cookieLocale)) {
    return cookieLocale;
  }

  if (hasSupabaseEnv()) {
    const user = await getCurrentUser();
    if (user) {
      const profileLanguage = await getProfileLanguage(user.id);
      if (isAppLocale(profileLanguage)) {
        return profileLanguage;
      }
    }
  }

  const headerStore = await headers();
  const acceptLanguageLocale = localeFromAcceptLanguage(headerStore.get("accept-language"));
  if (acceptLanguageLocale) {
    return acceptLanguageLocale;
  }

  return defaultLocale;
}
