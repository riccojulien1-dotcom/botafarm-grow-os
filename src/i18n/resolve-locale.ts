import type { AppLocale } from "@/i18n/config";
import { defaultLocale, isAppLocale, localeCookieName } from "@/i18n/config";
import { getProfileLanguage } from "@/lib/auth/get-profile";
import { getCurrentUser } from "@/lib/auth/get-user";
import { env } from "@/lib/env";
import { cookies } from "next/headers";

function hasSupabaseEnv() {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
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

  return defaultLocale;
}
