import Link from "next/link";

import { signUpAction } from "@/app/(auth)/actions";
import { AuthForm } from "@/components/auth/auth-form";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12">
      <AuthForm
        mode="signup"
        title="Create your grow account"
        subtitle="Set up your first room and start daily logs."
        submitLabel="Create account"
        action={signUpAction}
      />
      <p className="mx-auto mt-4 w-full max-w-md text-sm text-zinc-400">
        Already registered? <Link href="/login" className="text-fuchsia-400">Log in</Link>
      </p>
    </div>
  );
}
