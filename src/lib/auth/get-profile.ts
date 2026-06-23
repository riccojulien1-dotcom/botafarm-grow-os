import { createClient } from "@/lib/supabase/server";

import type { AppLocale } from "@/i18n/config";

export async function getProfileLanguage(userId: string): Promise<AppLocale | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("language")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data?.language) {
    return null;
  }

  return data.language as AppLocale;
}
