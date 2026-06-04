/** Canonical app origin for Supabase email redirect links (recovery, confirm). */
export function getAuthSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  return "https://botafarm-grow-os.vercel.app";
}

export function getPasswordRecoveryRedirectTo(): string {
  const origin = getAuthSiteOrigin();
  return `${origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`;
}
