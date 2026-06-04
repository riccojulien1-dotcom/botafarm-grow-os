"use client";

import { useActionState } from "react";

type ForgotPasswordFormProps = {
  action: (state: { error?: string; success?: string }, formData: FormData) => Promise<{
    error?: string;
    success?: string;
  }>;
};

const initialState: { error?: string; success?: string } = {};

export function ForgotPasswordForm({ action }: ForgotPasswordFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl">
      <h1 className="text-2xl font-semibold text-white">Reset your password</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Enter your email and we will send you a link to choose a new password.
      </p>

      {state?.success ? (
        <p className="mt-6 rounded-lg border border-cyan-500/30 bg-cyan-950/30 px-3 py-2 text-sm text-cyan-200">
          {state.success}
        </p>
      ) : (
        <form action={formAction} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-zinc-200" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-fuchsia-500"
              placeholder="you@email.com"
            />
          </div>

          {state?.error ? <p className="text-sm text-red-400">{state.error}</p> : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-fuchsia-600 px-4 py-2 font-medium text-white transition hover:bg-fuchsia-500 disabled:cursor-not-allowed disabled:bg-fuchsia-800"
          >
            {pending ? "Please wait..." : "Send reset link"}
          </button>
        </form>
      )}
    </div>
  );
}
