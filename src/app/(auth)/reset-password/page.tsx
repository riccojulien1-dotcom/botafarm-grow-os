import Link from "next/link";

import { resetPasswordAction } from "@/app/(auth)/actions";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12">
      {user ? (
        <ResetPasswordForm action={resetPasswordAction} />
      ) : (
        <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl">
          <h1 className="text-2xl font-semibold text-white">Reset link required</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Open the password reset link from your email, or request a new one.
          </p>
          <Link
            href="/forgot-password"
            className="mt-4 inline-block text-sm text-fuchsia-400 hover:text-fuchsia-300"
          >
            Request a new reset link
          </Link>
        </div>
      )}
      <p className="mx-auto mt-4 w-full max-w-md text-sm text-zinc-400">
        <Link href="/login" className="text-fuchsia-400">
          Back to login
        </Link>
      </p>
    </div>
  );
}
