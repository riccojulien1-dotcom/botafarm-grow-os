import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { requireUser } from "@/lib/auth/get-user";

function getAdminEmails(): string[] {
  return (process.env.BOTAFARM_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isBotafarmAdmin(user: User): boolean {
  const email = user.email?.toLowerCase();
  if (!email) {
    return false;
  }
  return getAdminEmails().includes(email);
}

export async function requireAdmin() {
  const user = await requireUser();

  if (!isBotafarmAdmin(user)) {
    redirect("/dashboard");
  }

  return user;
}
