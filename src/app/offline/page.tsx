import Link from "next/link";

export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <main className="bf-lab-bg flex min-h-screen items-center justify-center px-6 py-12 text-zinc-100">
      <div className="w-full max-w-md rounded-xl border border-white/[0.08] bg-black/30 p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-300/90">
          Offline shell
        </p>
        <h1 className="mt-3 text-2xl font-bold text-white">You are offline</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Botafarm Grow OS is installed, but this page is not cached yet. Reconnect to load your
          latest grow data.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-md bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-500"
        >
          Open dashboard
        </Link>
      </div>
    </main>
  );
}
