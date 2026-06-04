import Link from "next/link";

import { signInAction } from "@/app/(auth)/actions";
import { AuthForm } from "@/components/auth/auth-form";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{ reset?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const passwordUpdated = params.reset === "success";
  const authError = params.error;

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12">
      {passwordUpdated ? (
        <p className="mx-auto mb-4 w-full max-w-md rounded-lg border border-cyan-500/30 bg-cyan-950/30 px-3 py-2 text-sm text-cyan-200">
          Password updated. Sign in with your new password.
        </p>
      ) : null}
      {authError ? (
        <p className="mx-auto mb-4 w-full max-w-md rounded-lg border border-red-500/30 bg-red-950/30 px-3 py-2 text-sm text-red-300">
          Sign-in link failed. Request a new password reset if needed.
        </p>
      ) : null}
      <AuthForm
        mode="login"
        title="Welcome back"
        subtitle="Log in to continue your daily grow tracking."
        submitLabel="Log in"
        action={signInAction}
      />
      <p className="mx-auto mt-4 w-full max-w-md text-sm text-zinc-400">
        <Link href="/forgot-password" className="text-fuchsia-400">
          Forgot password?
        </Link>
      </p>
      <p className="mx-auto mt-2 w-full max-w-md text-sm text-zinc-400">
        No account yet? <Link href="/signup" className="text-fuchsia-400">Create one</Link>
      </p>
    </div>
  );
}
