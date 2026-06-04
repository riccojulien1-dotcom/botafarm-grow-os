"use client";

import { useActionState } from "react";

type ResetPasswordFormProps = {
  action: (state: { error?: string }, formData: FormData) => Promise<{ error?: string }>;
};

const initialState: { error?: string } = {};

export function ResetPasswordForm({ action }: ResetPasswordFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl">
      <h1 className="text-2xl font-semibold text-white">Choose a new password</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Enter your new password below. You will be asked to sign in again afterward.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-zinc-200" htmlFor="password">
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-fuchsia-500"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-200" htmlFor="confirmPassword">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-fuchsia-500"
            placeholder="••••••••"
          />
        </div>

        {state?.error ? <p className="text-sm text-red-400">{state.error}</p> : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-fuchsia-600 px-4 py-2 font-medium text-white transition hover:bg-fuchsia-500 disabled:cursor-not-allowed disabled:bg-fuchsia-800"
        >
          {pending ? "Please wait..." : "Update password"}
        </button>
      </form>
    </div>
  );
}
