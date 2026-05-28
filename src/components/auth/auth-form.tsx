"use client";

import { useActionState } from "react";

type AuthFormProps = {
  mode: "login" | "signup";
  title: string;
  subtitle: string;
  submitLabel: string;
  action: (state: { error?: string }, formData: FormData) => Promise<{ error?: string }>;
};

const initialState: { error?: string } = {};

export function AuthForm({ mode, title, subtitle, submitLabel, action }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl">
      <h1 className="text-2xl font-semibold text-white">{title}</h1>
      <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>

      <form action={formAction} className="mt-6 space-y-4">
        {mode === "signup" ? (
          <div className="space-y-2">
            <label className="text-sm text-zinc-200" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-fuchsia-500"
              placeholder="botafarm_grower"
            />
          </div>
        ) : null}

        <div className="space-y-2">
          <label className="text-sm text-zinc-200" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-fuchsia-500"
            placeholder="you@email.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-200" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-fuchsia-500"
            placeholder="••••••••"
          />
        </div>

        {mode === "signup" ? (
          <div className="space-y-2">
            <label className="text-sm text-zinc-200" htmlFor="language">
              Language
            </label>
            <select
              id="language"
              name="language"
              defaultValue="fr"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-fuchsia-500"
            >
              <option value="fr">Francais</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="es">Espanol</option>
            </select>
          </div>
        ) : null}

        {state?.error ? <p className="text-sm text-red-400">{state.error}</p> : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-fuchsia-600 px-4 py-2 font-medium text-white transition hover:bg-fuchsia-500 disabled:cursor-not-allowed disabled:bg-fuchsia-800"
        >
          {pending ? "Please wait..." : submitLabel}
        </button>
      </form>
    </div>
  );
}
