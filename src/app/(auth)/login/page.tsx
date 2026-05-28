import Link from "next/link";

import { signInAction } from "@/app/(auth)/actions";
import { AuthForm } from "@/components/auth/auth-form";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12">
      <AuthForm
        mode="login"
        title="Welcome back"
        subtitle="Log in to continue your daily grow tracking."
        submitLabel="Log in"
        action={signInAction}
      />
      <p className="mx-auto mt-4 w-full max-w-md text-sm text-zinc-400">
        No account yet? <Link href="/signup" className="text-fuchsia-400">Create one</Link>
      </p>
    </div>
  );
}
