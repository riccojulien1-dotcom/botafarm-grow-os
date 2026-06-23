"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import type { AppLocale } from "@/i18n/config";
import { isAppLocale, localeCookieName } from "@/i18n/config";

type LocaleActionState = {
  error?: string;
};

export async function setLocaleAction(
  _: LocaleActionState,
  formData: FormData,
): Promise<LocaleActionState> {
  const locale = String(formData.get("locale") ?? "").trim();

  if (!isAppLocale(locale)) {
    return { error: "Unsupported language." };
  }

  const user = await requireUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ language: locale })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  const cookieStore = await cookies();
  cookieStore.set(localeCookieName, locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath("/", "layout");
  return {};
}
