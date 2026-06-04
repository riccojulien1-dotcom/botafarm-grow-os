import Link from "next/link";

import { forgotPasswordAction } from "@/app/(auth)/actions";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12">
      <ForgotPasswordForm action={forgotPasswordAction} />
      <p className="mx-auto mt-4 w-full max-w-md text-sm text-zinc-400">
        Remember your password?{" "}
        <Link href="/login" className="text-fuchsia-400">
          Back to login
        </Link>
      </p>
    </div>
  );
}
