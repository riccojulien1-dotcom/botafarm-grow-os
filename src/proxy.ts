import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { assertSupabaseEnv, env } from "@/lib/env";

const protectedPaths = ["/dashboard", "/rooms"];
/** Guest-only auth pages — signed-in users are sent to the dashboard */
const guestAuthPaths = ["/login", "/signup", "/forgot-password"];
/** Recovery flow — must stay reachable during password reset (session may exist) */
const recoveryAuthPaths = ["/auth/callback", "/reset-password"];

export async function proxy(request: NextRequest) {
  assertSupabaseEnv();
  const response = NextResponse.next();

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected = protectedPaths.some((prefix) => path.startsWith(prefix));
  const isGuestAuthPath = guestAuthPaths.some((prefix) => path.startsWith(prefix));
  const isRecoveryAuthPath = recoveryAuthPaths.some((prefix) => path.startsWith(prefix));

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isGuestAuthPath && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isRecoveryAuthPath) {
    return response;
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
